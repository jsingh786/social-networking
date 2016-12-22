var feedback_call;
$(document).ready(function(){
	//Expanding the feedback that are showing up as cropped.
	$("span.show_more").click(function(){
		var fdbk_id = $(this).attr("rel");
		$('div#clickable_text_div_'+fdbk_id).hide();
		$("div#full_text_"+fdbk_id).fadeIn(1000);
	});
	//Collapsing feedback text back to cropped form.
	$("span.show_less").click(function(){
		var fdbk_id = $(this).attr("rel");
		$('div#full_text_'+fdbk_id).hide();
		$("div#clickable_text_div_"+fdbk_id ).fadeIn(1000);
	});
	
	$('span.accept_display').click( function(){
		if( feedback_call )
		{	
			if( feedback_call.state() != "resolved" )
			{
				return;
			}
		}
		var idd = addLoadingImage($(this), "before");
		var thiss = $(this);
		feedback_call = $.ajax({
//			async: false,
			url : "/" + PROJECT_NAME + "feedback/accept-feedback",
			method : "POST",
			data : { 'feedback_req_id' : $(this).attr("rel") },
			type : "post",
			dataType : "json",
			success : function(jsonData){
				if(jsonData == 1)
					{
						 $("span#"+idd).remove();
						 $(thiss).hide();
						 $(thiss).siblings("span.hide_feedbk").fadeIn();
						 $(thiss).siblings("span.delete_feedbk").fadeIn();
					}
			}
			});
		
	});
	$('span.hide_feedbk').click(function(){
		if( feedback_call )
		{	
			if( feedback_call.state() != "resolved" )
			{
				return;
			}
		}
		var thisss = $(this);
		var iddd = addLoadingImage($(this), "before");
		
		feedback_call = $.ajax({
//			async: false,
			url : "/" + PROJECT_NAME + "feedback/hide-feedback",
			method : "POST",
			data : { 'feedback_req_id' : $(this).attr("rel") },
			type : "post",
			dataType : "json",
			success : function(jsonData){
				if(jsonData == 1)
					{
						$("span#"+iddd).remove();
						 $("div.alert-box").remove();
							showDefaultMsg( "The Feedback will not be displayed to your Links.", 1 );

						$(thisss).hide();
						
						$(thisss).siblings('span.display_feedbk').fadeIn();
//						 $(thisss).parents("div.mail-grey-hdr-col1").slideUp();
					}
				}
			});
		
	});
	$('span.display_feedbk').click(function(){
		if( feedback_call )
		{	
			if( feedback_call.state() != "resolved" )
			{
				return;
			}
		}
		var thisss = $(this);
		var idddd = addLoadingImage($(this), "before");
		feedback_call = $.ajax({
			url : "/" + PROJECT_NAME + "feedback/display-feedback",
			method : "POST",
			data : { 'feedback_req_id' : $(this).attr("rel") },
			type : "post",
			dataType : "json",
			success : function(jsonData){
				if(jsonData == 1)
					{
						$("span#"+idddd).remove();
						 $("div.alert-box").remove();
							showDefaultMsg( "The Feedback will be displayed on your Profile.", 1 );

						$(thisss).hide();
						
						$(thisss).siblings('span.hide_feedbk').fadeIn();
//						 $(thisss).parents("div.mail-grey-hdr-col1").slideUp();
					}
				}
			});
		
	});
	$('span.delete_feedbk').click(function(){
		if( feedback_call )
		{	
			if( feedback_call.state() != "resolved" )
			{
				return;
			}
		}
		var thissss = $(this);
		var iddddd = addLoadingImage($(this), "after");
		feedback_call = $.ajax({
			url : "/" + PROJECT_NAME + "feedback/delete-feedback",
			method : "POST",
			data : { 'feedback_req_id' : $(this).attr("rel") },
			type : "post",
			dataType : "json",
			success : function(jsonData){
				if(jsonData == 1)
					{
						 $("span#"+iddddd).remove();
						 $("div.alert-box").remove();
							showDefaultMsg( "Your Feedback has been deleted.", 1 );

						 $(thissss).parents("div.feedback-received-col1").remove();
					}
				}
		});
	});
});
