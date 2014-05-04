
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

$(document).ready(function() {

	// JavaScript Document

	var drag_color = $("#color2").css("backgroundColor");
	var drag_box = $("#color2");
	var box = $("#box_text");
	
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
		<!-- web
			<!-- background1
			$("#fake_web_body").css("backgroundColor",$("#box_background1").css("backgroundColor"));
			$("#B_web").css("color",$("#box_background1").css("backgroundColor"));
			<!-- text
			$("#fake_web_text").css("color",$("#box_text").css("backgroundColor"));
			$("#username_web").css("color",$("#box_text").css("backgroundColor"));
			$("#inner_box").css("color",$("#box_text").css("backgroundColor"));
			$("#web_top").css("color",$("#box_text").css("backgroundColor"));
			$("#fake_nav a").css("color",$("#box_text").css("backgroundColor"));
			<!--outlines

			<!-- accent
			$("#fake_nav").css("backgroundColor",$("#box_accent").css("backgroundColor"));
			$("#B_web").css({"border-color":$("#box_accent").css("backgroundColor"),
							"border-weight":"2px",
							"border-style":"solid",
							"border-radius":"10px"});
			$("#inner_box").css({"border-color":$("#box_accent").css("backgroundColor"),
							"border-weight":"2px",
							"border-style":"solid",
							"border-radius":"10px"});
			<!-- background2
			$("#inner_web").css("backgroundColor",$("#box_background2").css("backgroundColor"));
			$("#B_web").css("backgroundColor",$("#box_background2").css("backgroundColor"));
			$("#inner_box").css("backgroundColor",$("#box_background2").css("backgroundColor"));
			
		<!-- Mobile
			<!-- background1
			$("#innerPhone").css("backgroundColor",$("#box_background1").css("backgroundColor"));
			$("#B").css("color",$("#box_background1").css("backgroundColor"));
			<!-- text
			$("#phoneText").css("color",$("#box_text").css("backgroundColor"));	
			$(".username").css("color",$("#box_text").css("backgroundColor"));
			$(".comment").css("color",$("#box_text").css("backgroundColor"));
			$(".points").css("color",$("#box_text").css("backgroundColor"));
			<!-- accent
			$("#top").css("color",$("#box_accent").css("backgroundColor"));
			$("#navButton").css({"border-color":$("#box_accent").css("backgroundColor"),
							"border-weight":"2px",
							"border-style":"solid",
							"border-radius":"10px"});
			$("#a").css("backgroundColor",$("#box_accent").css("backgroundColor"));
			$("#b").css("backgroundColor",$("#box_accent").css("backgroundColor"));
			$("#c").css("backgroundColor",$("#box_accent").css("backgroundColor"));
			$("#B").css({"border-color":$("#box_accent").css("backgroundColor"),
							"border-weight":"2px",
							"border-style":"solid",
							"border-radius":"10px"});
			$("#commentBlocks #a").css({"border-color":$("#box_accent").css("backgroundColor"),
							"border-weight":"1px",
							"border-style":"solid"
							});
			$("#commentBlocks #b").css({"border-color":$("#box_accent").css("backgroundColor"),
							"border-weight":"1px",
							"border-style":"solid"
							});
			$("#commentBlocks #c").css({"border-color":$("#box_accent").css("backgroundColor"),
							"border-weight":"1px",
							"border-style":"solid"
							});
			$("#commentBlocks #d").css({"border-color":$("#box_accent").css("backgroundColor"),
							"border-weight":"1px",
							"border-style":"solid"
							});
			$("#commentBlocks #e").css({"border-color":$("#box_accent").css("backgroundColor"),
							"border-weight":"1px",
							"border-style":"solid"
							});
			<!-- background2
			$("#top").css("backgroundColor",$("#box_background2").css("backgroundColor"));
			$("#B").css("backgroundColor",$("#box_background2").css("backgroundColor"));
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
	
	$("#color4").hover(function() {
		var color = $("#color4").css("backgroundColor");
		var colorhex = rgb2hex(color);
		$("#color_id1").append("<div id='colors'></div>"); 
		$("#color_id1_rgb").append("<div id='colors_rgb'></div>"); 
		colors.innerHTML += colorhex;
		colors_rgb.innerHTML += color;
		$("#colors").css("color",color);
		$("#colors_rgb").css("color",color);
		},
		function(){
	 	 	colors.remove();
			colors_rgb.remove();
	});
		$("#color3").hover(function() {
		var color = $("#color3").css("backgroundColor");
		var colorhex = rgb2hex(color);
		$("#color_id2").append("<div id='colors'></div>"); 
		$("#color_id2_rgb").append("<div id='colors_rgb'></div>"); 
		colors.innerHTML += colorhex;
		colors_rgb.innerHTML += color;
		$("#colors").css("color",color);
		$("#colors_rgb").css("color",color);
		},
		function(){
	 	 	colors.remove();
			colors_rgb.remove();
	});
	$("#color2").hover(function() {
		var color = $("#color2").css("backgroundColor");
		var colorhex = rgb2hex(color);
		$("#color_id3").append("<div id='colors'></div>"); 
		$("#color_id3_rgb").append("<div id='colors_rgb'></div>"); 
		colors.innerHTML += colorhex;
		colors_rgb.innerHTML += color;
		$("#colors").css("color",color);
		$("#colors_rgb").css("color",color);
		},
		function(){
	 	 	colors.remove();
			colors_rgb.remove();
	});
	$("#color1").hover(function() {
		var color = $("#color1").css("backgroundColor");
		var colorhex = rgb2hex(color);
		$("#color_id4").append("<div id='colors'></div>"); 
		$("#color_id4_rgb").append("<div id='colors_rgb'></div>"); 
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
	
	
});
