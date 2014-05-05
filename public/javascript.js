
var set1 = ["/public/images/6.png","/public/images/7.png", "/public/images/8.png"];
var set1_colors = [[197,96,54], [0,0,0], [109,157,184], [147, 171, 138]];
var set2 = ["/public/images/1.png","/public/images/2.png", "/public/images/3.png", "/public/images/4.png", "/public/images/5.png"];
var set2_colors = [[214,164,0], [54,92,127], [220,158,130], [142,142,142]];
var set3 = [];
var set3_colors = [[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
var allsets = [[set1,set1_colors], [set2,set2_colors], [set3, set3_colors]];

function createSets(){
	for (var j=0; j<allsets.length; j++){

		var set = allsets[j][0];
		var id = "set"+(1+j);

		var newset = document.createElement("div");
		newset.setAttribute("id",id);
		var setImages = document.getElementById("setImages");
		setImages.appendChild(newset);

		for (var i=0; i<set.length; i++){
			var set_i = document.createElement("img");
			set_i.setAttribute("src",set[i]);
			newset.appendChild(set_i);
		}

		if (j!=0){
			$("#"+id).css("display","none");
		}
		
		var setPalette = document.createElement("li");
		setPalette.setAttribute("class","setColors2");

		var colors = allsets[j][1];

		var color1 = "rgb("+colors[0][0]+","+colors[0][1]+","+colors[0][2]+")";
		var color2 = "rgb("+colors[1][0]+","+colors[1][1]+","+colors[1][2]+")";
		var color3 = "rgb("+colors[2][0]+","+colors[2][1]+","+colors[2][2]+")";
		var color4 = "rgb("+colors[3][0]+","+colors[3][1]+","+colors[3][2]+")";


		setPalette.innerHTML = "<div class='colorline'></div> \
				              <div class='color color1' style='background-color:"+ color1 +"'></div> \
				              <div id='color_id1' class='color_id'></div> \
				              <div id='color_id1_rgb' class='color_id_rgb'></div> \
				              <div class='color color2' style='background-color:"+ color2 +"'></div> \
				              <div id='color_id2' class='color_id'></div> \
				              <div id='color_id2_rgb' class='color_id_rgb'></div> \
				              <div class='color color3' style='background-color:"+ color3 +"'></div> \
				              <div id='color_id3' class='color_id'></div> \
				              <div id='color_id3_rgb' class='color_id_rgb'></div> \
				              <div class='color color4' style='background-color:"+ color4 +"'></div> \
				              <div id='color_id4' class='color_id'></div> \
				              <div id='color_id4_rgb' class='color_id_rgb'></div>";

		$("#allPalettes").append(setPalette);

	}
}

function changeColors(i){
	var colors = allsets[i-1][1];

	var color1 = "rgb("+colors[0][0]+","+colors[0][1]+","+colors[0][2]+")";
	$("#color1").css("background-color",color1);

	var color2 = "rgb("+colors[1][0]+","+colors[1][1]+","+colors[1][2]+")";
	$("#color2").css("background-color",color2);

	var color3 = "rgb("+colors[2][0]+","+colors[2][1]+","+colors[2][2]+")";
	$("#color3").css("background-color",color3);

	var color4 = "rgb("+colors[3][0]+","+colors[3][1]+","+colors[3][2]+")";
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

function downsizeImage(){
	$("#setImages .active").css("max-height","90px");
	$("#setImages .active").css("width","150px");
	$("#setImages .active").css("z-index","0");
	if ($("#setImages .active").hasClass("web")){
		$("#setImages .active").removeClass("web");
		$("#setImages .active").css("margin-left", "25px");
	}
	$("#setImages .active").removeClass("active");
	$("#expand").css("display","none");
}

function webUpsizeImage(){
	$("#setImages .active").css("max-height","190px");
	$("#setImages .active").css("width","190px");
	$("#setImages .active").css("margin-left","0px");
	$("#setImages .active").addClass("web");
}

function mobileUpsizeImage(){
	$("#setImages .active").css("max-height","305px");
	$("#setImages .active").css("width","305px");
}

function mobileShrink(){
	$("#setImages").animate({
			left: "355px",
			"padding-right": "10px",
			width: "0px"
		}, "slow", function() {
			$("#triangle-left").fadeIn("slow");
	});
}

function mobileExpand(){
	$("#setImages").animate({
			left: "30px",
			"padding-right": "20px",
			width: "315px"
		}, "slow", function() {
			$("#triangle-right").fadeIn("slow");
	});
}

function webShrink(){
	$("#setImages").animate({
			left: "378px",
			width: "0px"
		}, "slow", function() {
			$("#triangle-left").fadeIn("slow");
	});
}

function webExpand(){
	$("#setImages").animate({
			left: "188px",
			width: "190px"
		}, "slow", function() {
			$("#triangle-right").fadeIn("slow");
	});
}

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
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

	if ($("#set_numbers #1").hasClass("setW")){
		$("#allPalettes").show();
		$("#setColors").hide();
		$("#box_background1").css("backgroundColor","lightgray");
		$("#box_background2").css("backgroundColor","darkgray");
		$("#box_text3").css("backgroundColor","black");
		$("#box_accent4").css("backgroundColor","gray");
		for (var i=1; i<5; i++){			
			changeColor(""+i);
		}

	}
	else {
		changeColors("1");
	}

	
	var drag_color = $("#color2").css("backgroundColor");
	var drag_box = $("#color2");
	var box = $("#box_text3");
	
	$("#drop_down_img").slideDown("slow",function(){
		$("#drop_down_text").fadeIn("slow");
		if (!($("#set_numbers #1").hasClass("setW"))){
			$("#setColors").fadeIn("slow");
		}
	});

	createSets();
	
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
	
	$("#set_numbers li").click( function() {
		if (!$(this).hasClass("active")){

			downsizeImage();

			var set_i = $("#list_numbers .active").attr("id");
			$("#setImages #set"+set_i).css("display","none");
			$("#list_numbers .active").removeClass("active");

			$(this).addClass("active");
			set_i = $(this).attr("id");
			$("#setImages #set"+set_i).css("display","block");

			if ($(this).hasClass("setW")){
				$("#setColors").hide();
				$("#box_background1").css("backgroundColor","lightgray");
				$("#box_background2").css("backgroundColor","darkgray");
				$("#box_text3").css("backgroundColor","black");
				$("#box_accent4").css("backgroundColor","gray");
				for (var i=1; i<5; i++){
					changeColor(""+i);
				}
				$("#allPalettes").show();

			}
			else{
				$("#allPalettes").hide();
				$("#setColors").show();
				changeColors(set_i);
			}
		}
	});

	$("#setImages img").click( function() {

		if (!$(this).hasClass("active")){

			$(this).addClass("active");
			$(this).css("z-index","1");
			$("#expand").css("display","block");

			console.log($(this).css("background-color"));
			if ($(this).css("background-color")=="rgb(0, 0, 255)"){
				mobileUpsizeImage();
			}
			else { webUpsizeImage(); }
		}
	});

	$("#expand").click( function() {
		downsizeImage();
	});

	
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

	$("#triangle-right").click(function(){
		$(this).css("display","none");
		$("#setImages img").css("display","none");
		if ($(this).css("left")=="35px"){
			mobileShrink();
		}
		else{
			webShrink();
		}
	});

	$("#triangle-left").click(function(){
		$(this).css("display","none");
		$("#setImages img").css("display","inline");
		if ($(this).css("left")=="360px"){
			mobileExpand();
		}
		else{
			webExpand();
		}
	});
});
