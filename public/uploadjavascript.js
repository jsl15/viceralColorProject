var socket = io.connect();

function addToSet(filepath, setNum){
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
	jhover.css("width",width);

	img.after(jhover);

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
	});

}


function sendFile(files, obj, setNum) {
	console.log(setNum);
	for (var i=0; i < files.length; i++) {
		var fd = new FormData();
		fd.append('file', files[i]);
		console.log(files[i]);

		var reader = new FileReader(); // instance of the FileReader
       		reader.readAsDataURL(files[i]); // read the local file
 		reader.onloadend = function(){ 
               		addToSet(this.result, setNum);
        	}

		var status = "";
		
		
		//upload a single file
		console.log('emitting');
		socket.emit('upload', fd, status);
		//problems with the progress bar
		uploadFile(fd, status);
	}
}

function uploadFile(formData, status) {
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
				//	status.setProgress(percent);
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
			console.log("uploaded!");
		}
	});
	
//	status.setAbort(req);
}

$(document).ready(function() {

	var setCounter = 1;

	$("#drop_down_img").slideDown("slow",function(){
		$("#drop_down_text").fadeIn("slow");
		$("#setColors").fadeIn("slow");
	});

	$("#add").click( function() {
		var li = document.createElement('li');
		var ul = document.getElementById("imagesets");
		li.innerHTML = "<div class='block'><span>+ Drag Images Here</span><ul id='blockImages'></ul></div><div class='browse'>Browse</div>";
		addDragListener($(li.firstChild));
		ul.appendChild(li);

		setCounter++;
		var set_li = document.createElement('li');
		var set_ul = document.getElementById("list_numbers");
		set_li.innerHTML = setCounter;
		$(set_li).attr("id",setCounter);
		$(li).attr("id",setCounter);
		set_ul.appendChild(set_li);
	});

	// $(".browse").hover( function() {
	// 	$(this).css("color", "white");
	// }, function() {
	// 	$(this).css("color", "black");
	// });

	$("#blockImages img").hover( function() {
		$(this).next().css("display","block");
	}, function() {
		$(this).next().css("display","none");
	});

	$("#blockImages .hover").hover( function() {
		$(this).css("display","block");
	}, function() {
		$(this).css("display","none");
	});

/*	$(".block").each(function(i, obj) {
		 /*obj.on('dragenter', function (e) {
			e.stopPropagation();
			e.preventDefault();
			$(this).css('border', '2px solid red');
		});
		console.log(obj);
		/*obj.on('dragover', function (e) {
			e.stopPropagation();
			e.preventDefault();
		});
		obj.on('drop', function (e) {
			$(this).css('border', '2px dotted blue');
			e.preventDefault();
			var files = e.originalEvent.dataTransfer.files;
			console.log("got drop");
		});
	});*/
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
	console.log(element);
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
			var setNum = $(this).parent().index() + 1;
			sendFile(files, element, setNum);
		});
}


