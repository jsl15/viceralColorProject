
var http = require('http'); //this is new
var querystring = require('querystring');
var jsdom = require("./node_modules/jsdom");
var window = jsdom.jsdom().createWindow();
var $ = require('jquery')(window);
$.support.cors = true;

var express = require('express');
var app = express();
app.enable('trust proxy');
var fs = require('fs');

//adding io 
var server = http.createServer(app);
var io = require('socket.io').listen(server, {log: false});


var ids = {}; // list of already-used IDs for photos (to prevent duplicates)
app.use(express.bodyParser({
	keepExtensions:true,
	uploadDir: __dirname +'/tmp'}));
app.use(express.methodOverride());

var anyDB = require('any-db');
var conn = anyDB.createConnection('sqlite3://vcp.db');

var exec = require('child_process').exec; // child_process is included in node.js, no need to npm install


//rendering html 
var engines = require('consolidate');
app.engine('html', engines.hogan); //tell Express to run .html files through Hogan
app.set('views', __dirname + '/templates'); //tell Express where to find templates
app.use('/public', express.static('public'));




// set up the database
conn.query('DROP TABLE photos'); // should usually do when starting up
conn.query('CREATE TABLE photos (id TEXT, ext TEXT, setnum TEXT, client TEXT)');

var allPalettes = {};
var wSets = {};




app.get('/website_page.html', function(request, response) {
	response.render('website_page.html', '');
});

app.get('/', function(request, response) {
	response.render('imageselection.html', '');
});

app.get('/imageselection.html', function(request, response) {
	response.render('imageselection.html', '');
});


app.get('/done', function(req, res){
	/* client sends this request once it has received notification that 
	the server is done generating palettes. Server redirects page and gives
	the html the old client ID so it knows how to find the palettes in the server */
	clientID = req.query.clientID;
	res.render('website_page.html', {'connectionID': clientID});
});


app.post('/upload', function(req, res) {
	var obj = {};
	var setNumber = parseInt(req.body.setNum);
	var id = (typeof req.body.connectionID == 'string') ? req.body.connectionID : req.body.connectionID[0];

	var extensions={".png":true, ".jpg":true, ".jpeg":true, ".JPG":true, ".GIF":true, ".PNG":true, ".gif":true};
	var maxFileSize = 500000000;
	var fileName = req.files.file.name;
	var fileID = generateImageID();
	var tmpPath = req.files.file.path;
	var i = fileName.lastIndexOf('.');
	var extension = (i < 0) ? '' : fileName.substr(i);

	var newPath = __dirname +'/public/images/tmp/' + fileID + extension;
	var result = "";

	if (extensions[extension]) {
		var base64_data = new Buffer(fs.readFileSync(tmpPath)).toString('base64');
		fs.rename(tmpPath, newPath, function (err) {
			if (err) 
				throw err;
			fs.unlink(tmpPath, function() {
				if (err)
					throw err;
			});
		});
		result = fileID;

		add_photo = 'INSERT INTO photos (id, ext, setnum, client) VALUES ($1,$2,$3,$4)';
		conn.query(add_photo, [fileID, extension, setNumber, id]);

	} else {
		fs.unlink(tmpPath, function(err) {
			if (err) throw err;
		});
		result = "File upload failed";
	}
	res.end(result);
});




io.sockets.on('connection', function(socket) {

	socket.emit('connectionID', socket.id);


	socket.on('doneLoadingPalettes', function(wSetNum){
		wSets[socket.id] = wSetNum;

		conn.query('SELECT MAX(setnum) AS numsets FROM photos WHERE client=$1', [socket.id], function(error, result){
			num_sets = result.rows[0].numsets;

			generatePalettes(socket.id, num_sets, function(result){
				allPalettes[socket.id] = result;
				socket.emit('doneGeneratingPalettes'); // DONE, send result to the next page for display
			});	
		});
		
	});


	/* Client requesting palettes that the server has already generated. Return the palettes */
	socket.on('getPalettes', function(clientID){
		conn.query('SELECT id, ext, setnum FROM photos WHERE client=$1', [clientID], function(error, result) {
			if (error) {
				console.error;
			} else {
				var photos = new Array();
				for (var i = 0; i<result.rows.length; i++) {
					var setNum = result.rows[i].setnum;
					var base64 = new Buffer(fs.readFileSync("public/images/tmp/" + result.rows[i].id + result.rows[i].ext)).toString('base64');
					if (!photos[setNum-1]) {
						photos[setNum-1] = new Array();
					}
					photos[setNum-1].push(base64);
				}
				var palettes = new Array();
				var keys = Object.keys(allPalettes[clientID]);
				for (var i = 0; i < keys.length; i ++) {
					palettes[parseInt(keys[i])-1] = allPalettes[clientID][parseInt(keys[i])];
				}
				socket.emit('returnPalettes', palettes, wSets[clientID], photos);
			}
		});
	});


	socket.on('delete', function (imageID) {
		//delete the image from the database and tmp folder.
		delete_photo = 'DELETE FROM photos WHERE id=$1';
		conn.query('SELECT ext FROM photos WHERE id=$1', [imageID], function(error, result) {
			for (var i = 0; i < result.rows.length; i++) {
				fs.unlinkSync("public/images/tmp/" + imageID + result.rows[i].ext);
			}
			conn.query(delete_photo,[imageID])
				.on('error',console.error)
				.on('end', function(){});
		});
	});


	socket.on('disconnect', function() {
		delete allPalettes[socket.id];
		var get_photos = 'SELECT id, ext FROM photos WHERE client=$1';
		conn.query(get_photos, [socket.id], function(error, result) {
			if (error) console.error
			else {
				for (var i = 0; i < result.rows.length; i++) {
					fs.unlinkSync("public/images/tmp/" + result.rows[i].id + result.rows[i].ext);
				}
			}
			deleteAll = 'DELETE FROM photos WHERE client=$1';
			conn.query(deleteAll,[socket.id])
			.on('error',console.error)
			.on('end', function(){});
		});
	});

});



function generatePalettes(clientID, num_sets, callback){
	console.log('Generating palettes for client',clientID,'for',num_sets,'sets');

	color_sets = {};
	var complete_sets = 0; // keep track of num of overall sets completed

	for (var set=1; set<=num_sets; set++) {
		//get the current set's photos
		conn.query('SELECT id, ext, setnum FROM photos WHERE client=$1 AND setnum=$2', [clientID, set], function(error, pics){
				var num_photos_in_set = pics.rows.length;				
				var photosFinished = 0; // keep track of num of pictaculous requests completed for this set
					
				var photoColors = Array();
				for(var i=0; i<num_photos_in_set; i++){
					php_script = 'php request.php';
					pic_fp = './public/images/tmp/'+pics.rows[i].id+pics.rows[i].ext;

					// PHP SCRIPT CALL for each photo
					generateResult(php_script, pic_fp, function(result){
						palette = $.parseJSON(result).info.colors;
						photoColors = photoColors.concat(palette);
						photosFinished++;
						
						if (photosFinished == num_photos_in_set){					
							// PYTHON SCRIPT CALL for each set
							generateResult('./palette.py', photoColors, function(result){
								color_sets[pics.rows[0].setnum] = result;
								complete_sets++;
								
								if (complete_sets == num_sets){
									callback(color_sets); // finished! send to next page for display
								}
							});
						}
					});
				}
		});
	}
}





function generateSamplePalettes(){
	pal1 = ['#758A9F','#3D4D58','#E2D4B2']; // wolf pic
	pal2 = ['#BC9A0C','#948D56','#A1C5FE','#8C7909','#F1F7FF']; // green field blue sky landscape
	pal3 = ['#703E77','#80698C','#020202']; // purple starry night sky

	// because of the way javascript joins arrays, this is actually
	// just one list (NOT a list of lists, as it might look)
	palettes = [pal1, pal2, pal3]; 

	return palettes;
}



/* call command line scripts and get the results */
function generateResult(scriptName, args, callback){	
	command = scriptName+' "'+args.toString()+'"';

	var finalresult = null;

	exec(command, function(error, stdout, stderr){
		if(stderr.length > 0){
			console.log('SCRIPT',scriptName,'ERROR:',stderr);	
		}
		result = stdout.replace('\n','');
		result = result.split(',');

		callback(result);	
	});
}


function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}




function generateImageID() {
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
	var result = '';
	for (var i = 0; i < 25; i++) {
		result += chars.charAt(Math.floor(Math.random()*chars.length));
	}
	if (ids[result]) {
		generateImageID();
	} else {
		ids[result] = true;
		return result;
	}
}


server.listen(8080);
console.log('-- Server running on port 8080');
