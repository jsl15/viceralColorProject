
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
var io = require('socket.io').listen(server);


var ids = {}; // list of already-used IDs for photos (to prevent duplicates)
app.use(express.bodyParser({
	keepExtensions:true,
	uploadDir: __dirname +'/tmp'}));
app.use(express.methodOverride());

var anyDB = require('any-db');
var conn = anyDB.createConnection('sqlite3://vcp.db');


var exec = require('child_process').exec; 
// remember child_process is included in node.js, no need to npm install



//rendering html 
var engines = require('consolidate');
app.engine('html', engines.hogan); //tell Express to run .html files through Hogan
app.set('views', __dirname + '/templates'); //tell Express where to find templates
app.use('/public', express.static('public'));




// set up the database
conn.query('DROP TABLE photos'); // maybe should do when starting up
//conn.query('DROP TABLE palettes');
conn.query('CREATE TABLE photos (id TEXT, ext TEXT, setnum TEXT, client TEXT)');
//conn.query('CREATE TABLE palettes (color TEXT, setnum TEXT, client TEXT)');

var allPalettes = {};
var wSets = {};




app.get('/website_page.html', function(request, response) {
	//this is the function that is called when the user calls website_page.html
	response.render('website_page.html', '');
});

app.get('/', function(request, response) {
	//this is the function that is called when the user calls imageselections.html
	response.render('imageselection.html', '');
});

//I was wondering which methods that I should interact with the client
app.get('/imageselection.html', function(request, response) {
	//this is the function that is called when the user calls imageselections.html
	request.on('close', function() {
		console.log("closed");
	});
	request.on('end', function() {
		console.log("ended");
	});
	response.render('imageselection.html', '');
});

app.get('/mobile.html', function(request, response) {
	request.on('close', function() {
		console.log("closed");
	});
	response.render('mobile.html', '');
});


app.get('/done', function(req, res){
	clientID = req.query.clientID;
	res.render('website_page.html', {'connectionID': clientID});
});

// app.get('/done', function(request, res) {
// 	if(request.url === '/favicon.ico') {
// 		return;
// 	}

// 	var clientID = request.query.client;

// 	conn.query('SELECT MAX(setnum) AS numsets FROM photos WHERE client=$1', [clientID], function(error, result){
// 		num_sets = result.rows[0].numsets;

// 		generatePalettes(clientID, num_sets, function(r){
// 			console.log('FINAL PALETTE result: ',r);

// 			var addPalette = 'INSERT INTO palettes (color, setnum, client) VALUES ($1,$2,$3)';
// 			var numColorsTotal = 4*r.length; // bc each palette has 4 colors
// 			var numColorsAdded = 0;

// 			for (var i=0; i<r.length; i++){
// 				for (var j=0; j<r[i].length; j++){
// 					conn.query(addPalette, [r[i][j], i+1, clientID], function(error, result){
// 						numColorsAdded++;
// 						console.log('added palette color to db: ',numColorsAdded);
// 						if(numColorsAdded == numColorsTotal){
// 							// maybe need to pass in the client ID
// 							console.log('finished adding palette to db');
//							res.redirect('/website_page.html');
// 							console.log('redirected page');
// 						}
// 					});
// 				}
// 			}

			
// 			//socket.emit('palettes', result); // DONE, send result to the next page for display
// 			//response.render('website_page.html', {});

// 			//response.render('room.html', {'roomName': room})

// 		});	
// 	});


// });



io.sockets.on('connection', function(socket) {
	console.log('in server: connected' + socket.id);
	
	socket.emit('connectionID', socket.id);
	

	socket.on('upload', function(fd, status) {
	
		console.log('in server: upload');
	
	});


	socket.on('doneLoadingPalettes', function(wSetNum){
		wSets[socket.id] = wSetNum;

		conn.query('SELECT MAX(setnum) AS numsets FROM photos WHERE client=$1', [socket.id], function(error, result){
			num_sets = result.rows[0].numsets;

			generatePalettes(socket.id, num_sets, function(result){
				console.log('FINAL PALETTE result: ',result);
				
				allPalettes[socket.id] = result;
				socket.emit('doneGeneratingPalettes'); // DONE, send result to the next page for display

			});	
		});
		
	});


	socket.on('getPalettes', function(clientID){
		socket.emit('returnPalettes', allPalettes[clientID], wSets[clientID]);
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
				.on('end', function(){
					console.log("woo deleting " + imageID);
				});
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
			.on('end', function(){
				console.log('deleted all photos from client '+socket.id);
			});
		});
	});

});



function generatePalettes(clientID, num_sets, callback){
	console.log('running generatePalettes on client ',clientID,' for ',num_sets,' sets');

	color_sets = new Array();

	// keep track of num of overall sets completed
	var complete_sets = 0;

	for (var set=1; set<=num_sets; set++) {
		

		// keep track of num of pictaculous requests completed for this set
		var complete_pictaculous_requests = 0; 


		//get the current set's photos
		conn.query('SELECT id, ext FROM photos WHERE client=$1 AND setnum=$2', [clientID, set], function(error, result){
				// now we have the photos for this set - loop through them
				var num_photos_in_set = result.rows.length;
				// keep track of num of pictaculous requests completed for this set
				var photosFinished = 0; 

				console.log('num photos in set: '+num_photos_in_set);
					
				var photoColors = Array();
				for(var i=0; i<num_photos_in_set; i++){
					// don't forget we need child_process.exec as exec
					php_script = 'php request.php';
					pic_fp = './public/images/tmp/'+result.rows[i].id+result.rows[i].ext;

					//console.log(pic_fp);

					// for each photo, run the php script for it
					generate_result(php_script, pic_fp, function(result){
						palette = $.parseJSON(result).info.colors;

						console.log('Pictaculous API (php script) result: ',palette);

						photoColors = photoColors.concat(palette);
						photosFinished++;
						
						if (photosFinished == num_photos_in_set){					
							// PYTHON SCRIPT CALL
							generate_result('./palette.py', photoColors, function(result){
								color_sets.push(result);
								
								complete_sets++;
								
								console.log('called python script, now have # complete sets = ',complete_sets);

								
								if (complete_sets == num_sets){
								 	console.log("completed computation");
								 	console.log(color_sets);
									callback(color_sets);
									// finished! send to next page for display
									// should be a list of lists, one for each set.
									
								}
							});
						}
					});
				}
		});
	}
}






function generate_sample_palettes(){
	pal1 = ['#758A9F','#3D4D58','#E2D4B2']; // wolf pic
	pal2 = ['#BC9A0C','#948D56','#A1C5FE','#8C7909','#F1F7FF']; // green field blue sky landscape
	pal3 = ['#703E77','#80698C','#020202']; // purple starry night sky

	// because of the way javascript joins arrays, this is actually
	// just one list (NOT a list of lists, as it might look)
	palettes = [pal1, pal2, pal3]; 

	return palettes;
}




function generate_result(scriptName, args, callback){
	/* normally you'd be calling the pictaculous thing instead
	 * note: needs to be sent as one big list, not a list of
	 * individual per-image lists.
	 */
	// remember, the script needs to be executable
	
	command = scriptName+' "'+args.toString()+'"';

	var finalresult = null;

	exec(command, function(error, stdout, stderr){
		 console.log('ERROR:',error);
		 console.log('STDERR:',stderr);

		result = stdout.replace('\n','');
		result = result.split(',');

		//imgset_palette = result;
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

app.post('/upload', function(req, res) {
	var obj = {};
	var setNumber = parseInt(req.body.setNum);
	//	console.log(req);
	// console.log(req.connection.remoteAddress);
	// console.log(req.socket.remoteAddress);
	// console.log(req.headers['x-forwarded-for']);
	var extensions={".png":true, ".jpg":true, ".gif":true};
	var maxFileSize = 500000;
	var fileName = req.files.file.name;
	var fileID = generateImageID();
	var tmpPath = req.files.file.path;
	var i = fileName.lastIndexOf('.');
	var extension = (i < 0) ? '' : fileName.substr(i);

	var newPath = __dirname +'/public/images/tmp/' + fileID + extension;
	var result = "";

	if ((extensions[extension]) && ((req.files.file.size /1024) < maxFileSize)) {
		var base64_data = new Buffer(fs.readFileSync(tmpPath)).toString('base64');
		//console.log("moving out of the folder");
		fs.rename(tmpPath, newPath, function (err) {
			if (err) 
				throw err;
			fs.unlink(tmpPath, function() {
				if (err)
					throw err;
			});
		});
		result = fileID;

		console.log('About to add a photo to the db');

		add_photo = 'INSERT INTO photos (id, ext, setnum, client) VALUES ($1,$2,$3,$4)';

		conn.query(add_photo, [fileID, extension, setNumber, req.body.connectionID], function(error, result){
			console.log('error: ',error);
			console.log('result: ',result);
			console.log("added photo: ID ="+fileID+' extension='+extension+' set number='+setNumber+' client='+req.body.connectionID);
			conn.query('SELECT * FROM photos', function(error, result){
				console.log(result);
			});
		});
			// .on('error',console.error)
			// .on('end', function(){
			// 	console.log("added photo " + fileID+ ' client = '+req.body.connectionID);
			// });

		/*		var options = {

			host: 'http://pictaculous.com/api/1.0/',
			port: 80,
			method: 'POST',
		};

		var httpreq = http.request(options, function (response) {
			response.setEncoding('utf8');
			response.on('data', function(stuff) {
				console.log("body: " + stuff);
			});
		});
		httpreq.write(data);*/
		// var php = require('child_process').spawn('php', ["test.php"]);
		// var output = "";
		// php.stdout.on('data', function(data) { 
		// 	var str = data.toString();
		// 	var json = 	$.parseJSON(str);
		// 	console.log(json.info);
		// });
		// php.on('close', function(code) {
		// 	console.log('process exit code ' + code);	
		// });

	} else {
		fs.unlink(tmpPath, function(err) {
			if (err) throw err;
		});
		console.log("problemmmmm");
		result = "File upload failed";
	}
	res.end(result);
});

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
console.log('server running on 8080');
