
var set1 = ["/public/images/6.png","/public/images/7.png", "/public/images/8.png"];
var set1_colors = [[0,0,0],[197,96,54],[147, 171, 138],[109,157,184]];
var set2 = ["/public/images/1.png","/public/images/2.png", "/public/images/3.png", "/public/images/4.png", "/public/images/5.png"];
var set2_colors = [[142,142,142],[214,164,0],[54,92,127],[220,158,130]];
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

	// JavaScript Document
	$("#box_background1").css("backgroundColor",$("#color1").css("backgroundColor"));
	$("#box_background2").css("backgroundColor",$("#color2").css("backgroundColor"));
	$("#box_text3").css("backgroundColor",$("#color3").css("backgroundColor"));
	$("#box_accent4").css("backgroundColor",$("#color4").css("backgroundColor"));
	changeColor("#box_background1");
	changeColor("#box_background2");
	changeColor("#box_text3");
	changeColor("#box_accent4");
	
	var drag_color = $("#color2").css("backgroundColor");
	var drag_box = $("#color2");
	var box = $("#box_text3");
	
	$("#drop_down_img").slideDown("slow",function(){
		$("#drop_down_text").fadeIn("slow");
		$("#setColors").fadeIn("slow");
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

			var set_i = $("#list_numbers .active").attr("id");
			$("#setImages #set"+set_i).css("display","none");
			$("#list_numbers .active").removeClass("active");

			$(this).addClass("active");
			set_i = $(this).attr("id");
			$("#setImages #set"+set_i).css("display","block");
			changeColors(set_i)
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

	$("#set_numbers li").click( function() {
		if (!$(this).hasClass("active")){
			downsizeImage();
		}
	});
	
	$(".color").hover(function() {
		var color = $(this).css("backgroundColor");
		var colorhex = rgb2hex(color);

		var id = $(this).attr("id");
		console.log(id[5]);

		$("#color_id"+id[5]).append("<div id='colors'></div>"); 
		$("#color_id"+id[5]+"_rgb").append("<div id='colors_rgb'></div>"); 
		colors.innerHTML += colorhex;
		colors_rgb.innerHTML += color;
		$("#colors").css("color",color);
		$("#colors_rgb").css("color",color);
		},
		function(){
	 	 	colors.remove();
			colors_rgb.remove();
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
	
	$("#list_numbers li").click(function(){
		$("#box_background1").css("backgroundColor",$("#color4").css("backgroundColor"));
		$("#box_background2").css("backgroundColor",$("#color3").css("backgroundColor"));
		$("#box_text3").css("backgroundColor",$("#color2").css("backgroundColor"));
		$("#box_accent4").css("backgroundColor",$("#color1").css("backgroundColor"));
		changeColor("#box_background1");
		changeColor("#box_background2");
		changeColor("#box_text3");
		changeColor("#box_accent4");
	});
});
