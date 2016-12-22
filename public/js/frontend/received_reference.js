var reference_call;
$(document).ready(function(){
	//Expanding the feedback that are showing up as cropped.
	$("span.show_more").click(function(){
		var ref_id = $(this).attr("rel");
		$('div#clickable_text_div_'+ref_id).hide();
		$("div#full_text_"+ref_id).fadeIn(1000);
	});
	//Collapsing feedback text back to cropped form.
	$("span.show_less").click(function(){
		var ref_id = $(this).attr("rel");
		$('div#full_text_'+ref_id).hide();
		$("div#clickable_text_div_"+ref_id ).fadeIn(1000);
	});
	
	$('span.accept_display').click( function(){
		if( reference_call )
		{	
			if( reference_call.state() != "resolved" )
			{
				return;
			}
		}
		var loading_img = addLoadingImage($(this), "before");
		var thiss = $(this);
		reference_call = $.ajax({
			url : "/" + PROJECT_NAME + "reference-request/accept-reference",
			method : "POST",
			data : { 'reference_req_id' : $(this).attr("rel") },
			type : "post",
			dataType : "json",
			success : function(jsonData){
				if(jsonData == 1)
					{
					
						 $("span#"+loading_img).remove();
						 $(thiss).hide();
						 $(thiss).siblings("span.hide_ref").fadeIn();
						 $(thiss).siblings("span.delete_ref").fadeIn();
					}
			}
			});
		
	});


	$('span.hide_ref').click(function(){
		if( reference_call )
		{	
			if( reference_call.state() != "resolved" )
			{
				return;
			}
		}
		var thisss = $(this);
		var loading_img = addLoadingImage($(this), "before");
		reference_call = $.ajax({
			url : "/" + PROJECT_NAME + "reference-request/hide-reference",
			method : "POST",
			data : { 'reference_req_id' : $(this).attr("rel") },
			type : "post",
			dataType : "json",
			success : function(jsonData){
				if(jsonData == 1)
					{
					
					 $("span#"+loading_img).remove();
					 $("div.alert-box").remove();
						showDefaultMsg( "The Reference will not be displayed to your Links.", 1 );

					 $(thisss).hide();
				
					 $(thisss).siblings("span.display_ref").fadeIn();
					
					

						 //$(thisss).parents("div.mail-grey-hdr-col1").slideUp();
					}
				}
			});
		
	});
	$('span.display_ref').click(function(){
		if( reference_call )
		{	
			if( reference_call.state() != "resolved" )
			{
				return;
			}
		}
		var thisss = $(this);
		var loading_img = addLoadingImage($(this), "before");
		reference_call = $.ajax({
			url : "/" + PROJECT_NAME + "reference-request/display-reference",
			method : "POST",
			data : { 'reference_req_id' : $(this).attr("rel") },
			type : "post",
			dataType : "json",
			success : function(jsonData){
				if(jsonData == 1)
					{
					 $("span#"+loading_img).remove();
					 $("div.alert-box").remove();
						showDefaultMsg( "The Reference will be displayed on your Profile.", 1 );
						
					 $(thisss).hide();
					
					 $(thisss).siblings("span.hide_ref").fadeIn();
				
					

						 //$(thisss).parents("div.mail-grey-hdr-col1").slideUp();
					}
				}
			});
		
	});
	$('span.delete_ref').click(function(){
		if( reference_call )
		{	
			if( reference_call.state() != "resolved" )
			{
				return;
			}
		}
		var thissss = $(this);
		var loading_img = addLoadingImage($(this), "after");
		reference_call = $.ajax({
			url : "/" + PROJECT_NAME + "reference-request/delete-reference",
			method : "POST",
			data : { 'reference_req_id' : $(this).attr("rel") },
			type : "post",
			dataType : "json",
			success : function(jsonData){
				if(jsonData == 1)
					{
					
					 $("span#"+loading_img).remove();
					 $("div.alert-box").remove();
						showDefaultMsg( "Your Reference has been deleted.", 1 );

						 $(thissss).parents("div.feedback-received-col1").remove();
					}
				}
		});
	});
});




