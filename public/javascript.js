var socket = io.connect();
var connectionID;
var allsets = [];
var wSetNum = 0;
var photos = "";

function createList(){
	for (var j=0; j<allsets.length; j++){
		var num = document.createElement("li");
		num.setAttribute("id", j+1+"");
		num.innerHTML = j+1;
		console.log("w");
		console.log(wSetNum);
		if (j==wSetNum-1){
			if (j==0){ num.setAttribute("class","active setW"); }
			else { num.setAttribute("class","setW"); }
		}
		else if (j==0){
			num.setAttribute("class","active");
		}
		$("#list_numbers").append(num);

		$(num).click( function() {
			if (!$(this).hasClass("active")){

				downsizeImage("web");
				downsizeImage("mobile");

				var set_i = $("#list_numbers .active").attr("id");
				$("#setImages #set"+set_i).css("display","none");
				$("#list_numbers .active").removeClass("active");

				$(this).addClass("active");
				set_i = $(this).attr("id");
				$("#setImages #set"+set_i).css("display","block");

				if ($(this).hasClass("setW")){
					$("#web #allPalettes").show();
					$("#mobile #allPalettes").show();
				}
				else{
					$("#web #allPalettes").hide();
					$("#mobile #allPalettes").hide();
				}
				changeColors(set_i);
			}
		});
	}
}

function createSets(type){
	for (var j=0; j<allsets.length; j++){

		var set = allsets[j][0];
		var id = "set"+(1+j);

		var newset = document.createElement("div");
		newset.setAttribute("id",id);
		var setImages;
		if (type == "web") { setImages = $("#web #setImages"); }
		else { setImages = $("#mobile #setImages");}

		setImages.append(newset);

		console.log("SET NUM: "+j+" SET LENGTH: "+set.length);
		for (var i=0; i<set.length; i++){
			console.log("SET NUMBER: "+(j+1)+" IMAGE NUMBER :"+i);
			var set_i = document.createElement("img");
			set_i.setAttribute("src", "data:image/jpeg;base64,"+set[i]);
			newset.appendChild(set_i);

			$(set_i).click( function() {

				if (!$(this).hasClass("active")){

					$(this).addClass("active");
					$(this).css("z-index","1");
					if (type=="web"){ $("#web #expand").css("display","block"); }
					else { $("#mobile #expand").css("display","block"); }

					console.log($(this).css("background-color"));
					if (type=="web"){
						webUpsizeImage();
					}
					else { mobileUpsizeImage(); }
				}
			});
		}

		if (j!=0){
			$("#"+id).css("display","none");
		}

		var setPalette = document.createElement("li");
		setPalette.setAttribute("class","setColors2");

		var colors = allsets[j][1];

		setPalette.innerHTML = "<div class='colorline'></div> \
				              <div class='color color1' style='background-color:"+ colors[0] +"'></div> \
				              <div id='color_id1' class='color_id'></div> \
				              <div id='color_id1_rgb' class='color_id_rgb'></div> \
				              <div class='color color2' style='background-color:"+ colors[1] +"'></div> \
				              <div id='color_id2' class='color_id'></div> \
				              <div id='color_id2_rgb' class='color_id_rgb'></div> \
				              <div class='color color3' style='background-color:"+ colors[2] +"'></div> \
				              <div id='color_id3' class='color_id'></div> \
				              <div id='color_id3_rgb' class='color_id_rgb'></div> \
				              <div class='color color4' style='background-color:"+ colors[3] +"'></div> \
				              <div id='color_id4' class='color_id'></div> \
				              <div id='color_id4_rgb' class='color_id_rgb'></div>";

		$(".color").hover(function() {
			var color = $(this).css("background-color");
			var colorhex = rgb2hex(color);

			var hex = $(this).next();
			var rgb = hex.next();

			hex.show();
			rgb.show();

			hex.html(colorhex);
			rgb.html(color);
			hex.css("color",color);
			rgb.css("color",color);

			}, function(){

			var hex = $(this).next();
			hex.hide();
			hex.next().hide();

		});

		if (type == "web") { $("#web #allPalettes").append(setPalette); }
		else { $("#mobile #allPalettes").append(setPalette); }
	}
}

function changeColors(i){
	var colors = allsets[i-1][1];

	var color1 = colors[0];
	var color2 = colors[1];
	var color3 = colors[2];
	var color4 = colors[3];

	$("#color1").css("background-color",color1);
	$("#color2").css("background-color",color2);
	$("#color3").css("background-color",color3);
	$("#color4").css("background-color", color4);

	$("#box_background1").css("backgroundColor",color4);
	$("#box_background2").css("backgroundColor",color3);
	$("#box_text3").css("backgroundColor",color2);
	$("#box_accent4").css("backgroundColor",color1);

	changeColor("#box_background1");
	changeColor("#box_background2");
	changeColor("#box_text3");
	changeColor("#box_accent4");
}

function downsizeImage(type){
	$("#"+type +" #setImages .active").css("width","150px");
	$("#"+type +" #setImages .active").css("z-index","0");
	if ($("#"+type +" #setImages .active").hasClass("web")){
		$("#"+type +" #setImages .active").removeClass("web");
		$("#"+type +" #setImages .active").css("margin-left", "25px");
	}
	else {
		$("#"+type +" #setImages .active").css("max-height","90px");
	}
	$("#"+type +" #setImages .active").removeClass("active");
	$("#"+type +" #expand").css("display","none");
}

function webUpsizeImage(){
	$("#web #setImages .active").css("width","190px");
	$("#web #setImages .active").css("margin-left","0px");
	$("#web #setImages .active").addClass("web");

}

function mobileUpsizeImage(){
	$("#mobile #setImages .active").css("max-height","305px");
	$("#mobile #setImages .active").css("width","305px");
}

function mobileShrink(){
	$("#mobile #setImages").animate({
			left: "355px",
			"padding-right": "10px",
			width: "0px"
		}, "slow", function() {
			$("#mobile #triangle-left").fadeIn("slow");
	});
}

function mobileExpand(){
	$("#mobile #setImages").animate({
			left: "30px",
			"padding-right": "20px",
			width: "315px"
		}, "slow", function() {
			$("#mobile #triangle-right").fadeIn("slow");
	});
}

function webShrink(){
	$("#web #setImages").animate({
			left: "378px",
			width: "0px"
		}, "slow", function() {
			$("#web #triangle-left").fadeIn("slow");
	});
}

function webExpand(){
	$("#web #setImages").animate({
			left: "188px",
			width: "190px"
		}, "slow", function() {
			$("#web #triangle-right").fadeIn("slow");
	});
}

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}
function hex2rgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
        (parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16))
     : null;
}


function changeColor(id){
	var box = id.charAt(id.length-1);
	var color;
	if (box == "1"){
		var color = $("#box_background1").css("backgroundColor");
		$("#fake_web_body").css("backgroundColor",color);
		$("#B_web").css("color",color);

		//mobile
		$("#innerPhone").css("backgroundColor",color);
		$("#B").css("color",color);
	}
	else if (box == "2"){
		var color = $("#box_background2").css("backgroundColor");
		$("#inner_web").css("backgroundColor",color);
		$("#B_web").css("backgroundColor",color);
		$("#inner_box").css("backgroundColor",color);

		//mobile
		$("#top").css("backgroundColor",color);
		$("#B").css("backgroundColor",color);
	}
	else if (box == "3"){
		var color = $("#box_text3").css("backgroundColor");
		$("#fake_web_text").css("color",color);
		$("#username_web").css("color",color);
		$("#inner_box").css("color",color);
		$("#web_top").css("color",color);
		var split = color.split("(");
		split = split[0]+"a("+split[1];
	    split = split.split(")");
	    split = split[0]+",0.7)";
		$("#fake_nav a").css("color",split);
		$("#fake_nav a").hover( function() {
			$(this).css("color",color);
		}, function(){
			$(this).css("color",split);
			$("#fake_nav .active").css("color",color);
		});
		$("#fake_nav .active").css("color",color);

		//mobile

		$("#phoneText").css("color",color);	
		$(".username").css("color",color);
		$(".comment").css("color",color);
		$(".points").css("color",color);
	}
	else {
		var color = $("#box_accent4").css("backgroundColor");
		$("#fake_nav").css("backgroundColor",color);
		$("#B_web").css({"border-color":color,
							"border-weight":"2px",
							"border-style":"solid",
							"border-radius":"10px"});
		$("#inner_box").css({"border-color":color,
							"border-weight":"2px",
							"border-style":"solid",
							"border-radius":"10px"});

		//mobile
		$("#top").css("color",color);
		$("#navButton").css({"border-color":color,
							"border-weight":"2px",
							"border-style":"solid",
							"border-radius":"10px"});
		$("#B").css({"border-color":color,
							"border-weight":"2px",
							"border-style":"solid",
							"border-radius":"10px"});
		$("#navButton div").css("backgroundColor",color);
		$(".commentBlock").css({"border-color":color,
							"border-weight":"1px",
							"border-style":"solid"});
	}
}


$(document).ready(function() {

	socket.on('returnPalettes', function(palettes, wSet, setPhotos) {
		// console.log('website page got palettes from server!');
		// console.log(palettes);
		wSetNum = wSet;

		for (var pal=0; pal<palettes.length; pal++){
			var set = setPhotos[pal];
			var colors = palettes[pal];
			allsets.push([set,colors]);
		}

		createSets("web");
		createSets("mobile");
		createList();


		if ($("#set_numbers #1").hasClass("setW")){
			$("#web #allPalettes").show();
		} else {
			$("#web #allPalettes").hide();
		}

		changeColors("1");

		var drag_color = $("#color2").css("backgroundColor");
		var drag_box = $("#color2");
		var box = $("#box_text3");
		
		$("#drop_down_img").slideDown("slow",function(){
			$("#drop_down_text").fadeIn("slow");
			$("#setColors").fadeIn("slow");
		});

		setTimeout(function(){
			$(".color").draggable( {			  
			  revert : true, 
			  	drag : function(event, ui) {
			  		drag_color = $(this).css("backgroundColor");
			  		drag_box = $(this);
			  	}
			});

			$(".box").droppable({
				drop:function(event,ui){
					$(this).css("backgroundColor",drag_color);
					changeColor($(this).attr("id"));
				} 
			});
		},800);
	});
	

	// first thing to actually happen
	socket.emit('getPalettes', meta('connectionID'));


	$("#mobile #expand").click( function() {
		downsizeImage("mobile");
	});

	$("#web #expand").click( function() {
		downsizeImage("web");
	});

	$("#web #triangle-right").click(function(){
		$(this).css("display","none");
		$("#web #setImages img").css("display","none");
		webShrink();
	});

	$("#web #triangle-left").click(function(){
		$(this).css("display","none");
		$("#web #setImages img").css("display","inline");
		webExpand();
	});

	$("#mobile #triangle-right").click(function(){
		$(this).css("display","none");
		$("#mobile #setImages img").css("display","none");
		mobileShrink();
	});

	$("#mobile #triangle-left").click(function(){
		$(this).css("display","none");
		$("#mobile #setImages img").css("display","inline");
		mobileExpand();
	});


	$("#mobileButton").click( function() {
		$("#web").hide();
		$("#mobile").show();
		$("#websiteButton").removeClass("active");
		$("#mobileButton").addClass("active");
		$("#drop_down_text").text("Drag and drop colors to make your ideal mobile app!");
		$("#boxes").css("top","160px");
		$("#boxes").css("left","890px");
	});
	$("#websiteButton").click( function() {
		$("#web").show();
		$("#mobile").hide();
		$("#websiteButton").addClass("active");
		$("#mobileButton").removeClass("active");
		$("#drop_down_text").text("Drag and drop colors to make your ideal website!")
		$("#boxes").css("top","170px");
		$("#boxes").css("left","1075px");
	})
});



/* DEALING WITH CONFIGURATION VARIABLES */
function meta(name){
	var tag = document.querySelector('meta[name='+name+']');
	if (tag != null){
		return tag.content;
	}
	return '';
}



