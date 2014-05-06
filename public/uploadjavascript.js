var socket = io.connect();
var connectionID = "";
var numImages = 0;
var numSets = 1;

function addToSet(filepath, setNum, progressBar){
	var block = $("#imagesets #"+setNum+" .block");
	if (block.css("height")=="60px"){
		block.css("height","120px");
		block.css("padding-top","0px");
		$("#imagesets #"+setNum+" span").remove();
	}
	var ul = $("#imagesets #"+setNum+" ul");
	ul.prepend("<li><img src="+filepath+"></img></li>");

	var hover = document.createElement("div");
	var jhover = $(hover);
	jhover.attr("class","hover");
	// jhover.css("display","none");
	jhover.html("<div class='delete'>X</div>");

	var img = $("#imagesets #"+setNum+" ul li:first-child img");

	var width = img.css("width");
	progressBar.width = parseInt(width, 10);
	jhover.css("width",width);

	img.after(progressBar.bar);
	img.after(jhover);
	progressBar.bar.css("display", "block");
	img.hover( function() {
		$(this).next().css("display","block");
	}, function() {
		$(this).next().css("display","none");
	});
	
	jhover.hover( function() {
		$(this).css("display","block");
	}, function() {
		$(this).css("display","none");
	});

	var del = jhover.children();
	del.click ( function() {
		img.parent().remove();
		console.log(del.id);
		deleteImage(del.id);
	});

	numImages++;

	return del;

}

function deleteImage(imageID) {
	socket.emit('delete', imageID);
}

function progressBar(obj)
{
	this.bar = $("<div class='progressBar'><div></div></div>");
	var padding = 5;
    this.setProgress = function(progress)
    {       
    	console.log(this.width);
        var progressBarWidth = progress*this.width/ 100;  
        this.bar.find('div').animate({ width: progressBarWidth }, 10).html("");
    }
}
	

function sendFile(files, obj, setNum) {
	for (var i=0; i < files.length; i++) {
		fd = new FormData();
		fd.append('setNum', setNum);
		fd.append('connectionID', connectionID);
		var status = new progressBar(obj);
		var currFile = files[i];
		reader = new FileReader(); // instance of the FileReader
       	reader.readAsDataURL(files[i]); // read the local file
 		reader.onloadend = function(){ 
           	d  = addToSet(this.result, setNum, status);
			console.log("about to send");
			uploadFile(fd, status, currFile, setNum, d);
        }

	/*	//upload a single file
		console.log('emitting');
		socket.emit('upload', fd, status);
		//problems with the progress bar
		uploadFile(fd, status);*/
	}
}

function uploadFile(formData, status, currentFile, setNumber, d) {
	formData.append("file", currentFile);
	var url = "http://localhost:8080/upload";
	var req = $.ajax({
		xhr: function() {
			var xhrobj = $.ajaxSettings.xhr();
			if (xhrobj.upload) {
				xhrobj.upload.addEventListener("progress", function (e) {
					var percent = 0;
					var position = event.loaded || event.position;
					var total = event.total;
					if (event.lengthComputable) {
						percent = Math.ceil(position / total*100);
					}
					status.setProgress(percent);
					if (percent == 100){
						hideBar();
					}
				}, false);
			}
			return xhrobj;
		},
		url: url,
		type: "POST",
		contentType: false,
		processData: false,
		cache: false,
		data: formData,
		success: function (data) {
			//status.setProgress(100);
			d.id = data;
			console.log(d.id);
			
		}
	});
function hideBar(){
	 $(".progressBar").css("display","none");
}
//	status.setAbort(req);
}

function handleFileSelect(e) {
	var files = e.target.files;
	console.log("fileselect");
	sendFile(files, $(this).parent().children().eq(1), $(this).parent().attr('id'));
}


$(document).ready(function() {



	$("#done").click(function() {
		if (numImages!=0){
			$("#loading_page").show();
			socket.emit('doneLoadingPalettes', $('.setW').attr('id'));
		}
		else{
			alert("Please upload at least one image.");
		}
	});

	socket.on('connectionID', function(id) {
		connectionID = id;
	});

	socket.on('doneGeneratingPalettes', function(){
		$.ajax({
			url: '/done?clientID='+connectionID,
			success: function(data){
				$("body").html(data);
			}
		});

	});
		
	var setCounter = 1;

	$("#drop_down_img").slideDown("slow",function(){
		$("#drop_down_text").fadeIn("slow");
		$("#setColors").fadeIn("slow");
	});

	$("#add").click( function() {
		setCounter++;

		var li = document.createElement('li');
		var ul = document.getElementById("imagesets");
		var input = document.createElement('input');
		input.type = "file";
		input.id = "input" + setCounter.toString();
		input.style.display = "none";
		li.innerHTML = "<input type='radio' name='setW' value ='"+setCounter+"' class='radio'><div class='block'><span>+ Drag Images Here</span><ul id='blockImages'></ul></div><a href=javascript:document.getElementById('input"+setCounter+"').click();><div class='browse'>Browse</div></a></input>";
		li.appendChild(input);
		ul.appendChild(li);
 		currSets = numSets;
		addDragListener($(li.firstChild).next());
		$(input).on("change", function (e) {
			var files = e.target.files;
			console.log("got a new file");
			console.log($(this).id);
			sendFile(files, $(this).parent().children().eq(1), li.id);
		});


		$(":radio[value="+setCounter+"]").click( function() {
			$(".setW").removeClass("setW");
			var thisButton = $(this).attr("value");
			$("#set_numbers #"+thisButton).addClass("setW");
		});

		var set_li = document.createElement('li');
		var set_ul = document.getElementById("list_numbers");
		set_li.innerHTML = setCounter;
		$(set_li).attr("id",setCounter);
		$(li).attr("id",setCounter);
		set_ul.appendChild(set_li);
	});
	$("#input1").on("change", function (e) {
			var files = e.target.files;
			console.log("got a new file");
			console.log($(this).id);
			sendFile(files, $(this).parent().children().eq(1), 1);
	});

	$(":radio[value=1]").click( function() {
		$(".setW").removeClass("setW");
		$("#set_numbers #1").addClass("setW");
	});

	$("#blockImages img").hover( function() {
		$(this).next().css("display","block");
	}, function() {
		$(this).next().css("display","none");
	});
	
	$(".fileupload").on('change','input[type="file"]', handleFileSelect);

	$("#blockImages .hover").hover( function() {
		$(this).css("display","block");
	}, function() {
		$(this).css("display","none");
	});

	var obj = $(".block");
	addDragListener(obj); 
 	$(document).on('dragenter', function(e) {
		e.stopPropagation();
		e.preventDefault();
	});
	$(document).on('dragover', function(e) {
		e.stopPropagation();
		e.preventDefault();
	});
	$(document).on('drop', function(e) {
		e.stopPropagation();
		e.preventDefault();
	});

});

function addDragListener(element) {
	element.on('dragenter', function (e) {
			e.stopPropagation();
			e.preventDefault();
			console.log("Drag event");
	});

	element.on('dragover', function (e) {
			e.stopPropagation();
			e.preventDefault();
	});
	
	element.on('drop', function (e) {
			e.preventDefault();
			var files = e.originalEvent.dataTransfer.files;
			console.log("got drop");
			console.log(files);
			s = $(this).parent().index() + 1;
			sendFile(files, element, s);
		});
		
}
















