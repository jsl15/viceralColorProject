// JavaScript Document

	var drag_color = $("#color2").css("backgroundColor");
	var drag_box = $("#color2");

	
	$("#drop_down_img").slideDown("slow",function(){
		$("#drop_down_text").fadeIn("slow");
		$("#setColors").fadeIn("slow");
	});

	createSets();


	$(".color").draggable( {			  
	  revert :function(event,ui){
	  	$(this).css("top","50px");
		$(this).css("left","50px");
	   }, 
	  	drag : function(event, ui) {
	  		drag_color = $(this).css("backgroundColor");
	  		drag_box = $(this);
	  	}
	});
	$(".box").droppable({
		drop:function(event,ui){
			$(this).css("backgroundColor",drag_color);	
			setTimeout(function() {
				$(drag_box).promise().done();
			},100);
		} 
	});
	
	
	
	
				if ($("#box_background1")){
				$("#fake_web_body").css("backgroundColor",drag_color);
				console.log("background_change_test");
			}
			if ($("#box_text")){
				$("#fake_web_text").css("color",drag_color);
				console.log("background_change_test");
			}