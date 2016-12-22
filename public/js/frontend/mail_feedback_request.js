$(document).ready(function(){
	//listing feedback requests
	list_mails(1);
	
	//Back to listing
	$("a#back_to_mail_list").click(function(){
		$("div#detailed_msg").hide();
		$("div#msg_listing").fadeIn("slow");
	});
	//pagination click
	$('.pagination_nav').on('click','li.active', function(){
        var page = $(this).attr('p');
        if( $( "div.mail-hdr-search input[name=feedback_reqs_search]" ).val().length > 0 )
        {
        	listSearchedMails( page, $( "div.mail-hdr-search input[name=feedback_reqs_search]" ).val() );
        }
        else
        {	
        	list_mails(page);
        }	
    }); 
	$('.pagination_nav').on('click','#go_btn', function(){
        var page = parseInt($('.pagination_nav .goto').val());
        var no_of_pages = parseInt($('.pagination_nav .total').attr('a'));
        if(page != 0 && page <= no_of_pages){
        	list_mails(page);
        }else{
            alert('Enter a PAGE between 1 and '+no_of_pages);
            $('.pagination_nav .goto').val("");
            $('.pagination_nav .goto:FIRST').focus();
            return false;
        }
    });
	
	$("#hide").click(function(){
		$("div.manage-pop-outer div#manage_pop_1").fadeOut();	
	});

	
	//Clicking on multi-mark-read //by jsingh7
	$("div#manage_pop_1 ul li a#multi_read").click(function(){
		var iddd = addLoadingImage( $(this), "after");
		var msg_ids = "";
		var total = $("input[name='received_mail_ids[]']:checked:enabled",'div#mail_holder').length;
		$("input[name='received_mail_ids[]']:checked:enabled",'div#mail_holder').each(function( index ) {
			msg_ids += $(this).val();
			if (index !== total - 1) 
			{
				// these are not the last one
				msg_ids += ",";
			}
		});

		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "mail/mark-read-inbox-item",
	        type: "POST",
	        dataType: "json",
	        data: { 'msg_ids' : msg_ids },
	        timeout: 50000,
	        success: function(jsonData) {
	        	if( jsonData == 1 )
	        	{	
		        	$("span#"+iddd).remove();
		        	$("div.manage-pop-outer div#manage_pop_1").fadeOut();
		        	
		        	$("input[name='received_mail_ids[]']:checked:enabled",'div#mail_holder').each(function( index ) {
		    			$("div.row_holder#"+$(this).val()).removeClass('unread');
		    			$("div#"+$(this).val()+"_popup_menu_2 li a.mark_read").hide();
		    			$("div#"+$(this).val()+"_popup_menu_2 li a.mark_unread").show();
		    		});
	        	}	
	        }
		});
	});
	
	//Clicking on multi-mark-unread //by jsingh7
	$("div#manage_pop_1 ul li a#multi_unread").click(function(){
		var iddd = addLoadingImage( $(this), "after");
		var msg_ids = "";
		var total = $("input[name='received_mail_ids[]']:checked:enabled",'div#mail_holder').length;
		$("input[name='received_mail_ids[]']:checked:enabled",'div#mail_holder').each(function( index ) {
			msg_ids += $(this).val();
			if (index !== total - 1)
			{
				// these are not the last one
				msg_ids += ",";
			}
		});
		
		jQuery.ajax({
			url: "/" + PROJECT_NAME + "mail/mark-unread-inbox-item",
			type: "POST",
			dataType: "json",
			data: { 'msg_ids' : msg_ids },
			timeout: 50000,
			success: function(jsonData) {
				if( jsonData == 1 )
	        	{	
					$("span#"+iddd).remove();
					$("div.manage-pop-outer div#manage_pop_1").fadeOut();
					$("input[name='received_mail_ids[]']:checked:enabled",'div#mail_holder').each(function( index ) {
		    			$("div.row_holder#"+$(this).val()).addClass('unread');
		    			$("div#"+$(this).val()+"_popup_menu_2 li a.mark_read").show();
		    			$("div#"+$(this).val()+"_popup_menu_2 li a.mark_unread").hide();

					});
	        	}	
			}
		});
	});
	
	//Clicking on multi-archive //by jsingh7
	$("div#manage_pop_1 ul li a#multi_archive").click(function(){
		var iddd = addLoadingImage( $(this), "after");
		var msg_ids = "";
		var total = $("input[name='received_mail_ids[]']:checked:enabled",'div#mail_holder').length;
		$("input[name='received_mail_ids[]']:checked:enabled",'div#mail_holder').each(function( index ) {
			msg_ids += $(this).val();
			if (index !== total - 1) 
			{
				// these are not the last one
				msg_ids += ",";
			}
		});

		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "mail/move-msg-to-archive",
	        type: "POST",
	        dataType: "json",
	        data: { 'msg_ids' : msg_ids },
	        timeout: 50000,
	        success: function(jsonData) {
	        	if( jsonData == 1 )
	        	{	
		        	$("span#"+iddd).remove();
		        	$("div.manage-pop-outer div#manage_pop_1").fadeOut();
		        	
		        	$("input[name='received_mail_ids[]']:checked:enabled",'div#mail_holder').each(function( index ) {
		        		$("div#mail_holder div#"+$(this).val()).slideUp();
		    		});
	        	}	
	        }
		});
	});
	//Clicking on multi-archive //by jsingh7
	$("div#manage_pop_1 ul li a#multi_trash").click(function(){
		var iddd = addLoadingImage( $(this), "after");
		var msg_ids = "";
		var total = $("input[name='received_mail_ids[]']:checked:enabled",'div#mail_holder').length;
		$("input[name='received_mail_ids[]']:checked:enabled",'div#mail_holder').each(function( index ) {
			msg_ids += $(this).val();
			if (index !== total - 1) 
			{
				// these are not the last one
				msg_ids += ",";
			}
		});

		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "mail/move-inbox-msg-to-trash",
	        type: "POST",
	        dataType: "json",
	        data: { 'msg_ids' : msg_ids },
	        timeout: 50000,
	        success: function(jsonData) {
	        	if( jsonData == 1 )
	        	{	
		        	$("span#"+iddd).remove();
		        	$("div.manage-pop-outer div#manage_pop_1").fadeOut();
		        	
		        	$("input[name='received_mail_ids[]']:checked:enabled",'div#mail_holder').each(function( index ) {
		        		$("div#mail_holder div#"+$(this).val()).slideUp();
		    		});
	        	}	
	        }
		});
	});
	
	//perform search on enter 
	 $('#feedback_reqs_search').on('keypress', function(e){
		if(e.which == 13 )
			{  //Enter is key 13 
			listSearchedMails( 1, $("div.mail-hdr-search input[name=feedback_reqs_search]").val() );
			}
	});
	
	// Clicking on search button. 
	$("a#search_feedback_reqs").click(function(){
		if($( "div.mail-hdr-search input[name=feedback_reqs_search]" ).val().length <= 0 )
		{
			alert( "Please enter some text to search!" );
			return;
		}	
		listSearchedMails( 1, $("div.mail-hdr-search input[name=feedback_reqs_search]").val() );
	});
	
	 //Hidding manage-pop-outer on outside click.
	//Added by hkaur5
    $(document).mouseup(function (e)
    {
    	var container = $("div.manage-pop2");
    	
    	if (!container.is(e.target) // if the target of the click isn't the container...
    			&& container.has(e.target).length === 0) // ... nor a descendant of the container
    	{
    		container.hide();
    	}
    });

});

/**
 * close pop-up on cross button
 * @author ravneet
 * @version 1.0
 */
function showManagePopup()
{
	$("#manage_pop_1").fadeToggle();
}
function goBackToFeedbackRequests()
{
	$( "div.mail-hdr-search input[name=feedback_reqs_search]" ).val("");
	list_mails(1);
}


/**
 * lists inbox feedback request.
 * 
 * @author jsingh7
 * @version 1.0
 */
function list_mails(page)
{
	//listing feedback requests in inbox by jsingh7
	__addOverlay();
	
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "mail/get-my-feedback-request",
        type: "POST",
        dataType: "json",
        data: { 'page' : page },
        timeout: 50000,
        success: function(jsonData) {
        	
        	$("div#mail_holder").html("");
        	var row = "";
        	if( jsonData.records.length != 0 )
        	{
        		$(".controls").show(); //Enabling controls.
	        	row += '<div class="mail_select_all">';
	        	row += '<input type="checkbox" value="" class="fl" name="mail_list_main_cb" id = "mail_list_main_cb">&nbsp; Select All';
	        	row += '</div>';
	        	for( i in jsonData.records )
	        	{
	//              <!-- col1 Starts -->
	        		if( jsonData.records[i].mark_read == 1 )
	        		{        			
	        			row += '<div class="go_to_detail row_holder" id = "'+jsonData.records[i].id+'">';
	        		}
	        		else
	        		{
	        			row += '<div class="go_to_detail row_holder unread" id = "'+jsonData.records[i].id+'">';
	        		}	
	        		row += '<div class="go_to_detail-image">';
	        		row += '<input name="received_mail_ids[]" class="fl mail_list_cb" type="checkbox" value="'+jsonData.records[i].id+'" />';
	        		row += '<div class ="mail-img-listing">';
		        	row += '<div class="go_to_detail-imagebox" style = "display:table-cell; width:50px; height:50px; vertical-align: middle; text-align: center;" user_id="'+jsonData.records[i].msg_sender_id+'">';
		        	row += '<img src="'+jsonData.records[i].prof_image+'"/>';
		        	row += '</div>';
		        	row += '</div>';
		        	row += '</div>';
	        		row += '<div class="go_to_detail-text mid" id = "'+jsonData.records[i].id+'">';
	        		row += '<a id = "'+jsonData.records[i].id+'" class="text-purple2" href="javascript:;" style="font-size:14px;text-decoration: none;"><h4 class="font-arial" >'+showCroppedText( jsonData.records[i].sender_firstname+' '+jsonData.records[i].sender_lastname, 35)+'</h4></a>';

	        		//row += '<a style="text-decoration: none !important;" href="/'+PROJECT_NAME+'profile/iprofile/id/'+jsonData.records[i].msg_sender_id+'"><h4>'+jsonData.records[i].sender_firstname+' '+jsonData.records[i].sender_lastname+'</h4></a>';
		        	row += '<p><a id = "'+jsonData.records[i].id+'" class="font-arial text-purple-link" href="javascript:;" style="font-size:14px;">'+jsonData.records[i].subject+'</a></p>';
	        		row += '</div>';
	        		row += '<div class="go_to_detail-time right">';
	        		row += '<div class="go_to_detail-time-top">'+jsonData.records[i].created_at+'</div>';
	        		row += '<div class="go_to_detail-time-bot"><a href="javascript:;" class = "popup_menu_2_arrow" rel = "'+jsonData.records[i].id+'"><img src="'+IMAGE_PATH+'/arrow-down-lightgrey.png" width="14" height="9" /></a>';
	//              <!-- Popup -->
	        		row += '<div style=" margin-top:5px; margin-left:-140px;" class="manage-pop2-outer">';
	        		row += '<div class="manage-pop2 popup_menu_2 closed" id = "'+jsonData.records[i].id+'_popup_menu_2" style = "display:none;">';
	                row += '<ul>';
	        		//row += '<li><a id = "'+jsonData.records[i].id+'"  class="rply" href="javascript:;">Reply</a></li>';
	        		//row += '<li><a id = "'+jsonData.records[i].id+'" class = "forward" href="#">Forward</a></li>';
	        		if( jsonData.records[i].mark_read == 1 )
	        		{	
	        			row += '<li><a href="javascript:;" class = "mark_unread" rel = "'+jsonData.records[i].id+'">Mark as Unread</a></li>';
	        			row += '<li><a href="javascript:;" class = "mark_read" style = "display:none" rel = "'+jsonData.records[i].id+'">Mark as Read</a></li>';
	        		}
	        		else
	        		{	
	        			row += '<li><a href="javascript:;" class = "mark_unread" style = "display:none" rel = "'+jsonData.records[i].id+'">Mark as Unread</a></li>';
	        			row += '<li><a href="javascript:;" class = "mark_read" rel = "'+jsonData.records[i].id+'">Mark as Read</a></li>';
	        		}	
	        		row += '<li><a href="javascript:;" class = "delete_inbox" rel = "'+jsonData.records[i].id+'">Delete</a></li>';
//	        		row += '<li><a href="javascript:;" class = "archive" rel = "'+jsonData.records[i].id+'">Archive</a></li>';
	        		//row += '<li><a href="#">Report as Spam</a></li>';
	                row += '</ul>';
	                row += '</div>';
	        		row += '</div>';
	//              <!-- Popup -->
	        		row += '</div>';
	                row += '</div>';
	        		row += '</div>';
	//              <!-- col1 Ends -->
	        	}
        	}
        	else
        	{
        		$(".controls").hide();//Hiding controls.
        		row += '<div class="no_messages">';
        		row += '<div class="no_messages-img"><img src="'+IMAGE_PATH+'/folder-empty.png"></div>';
        		row += '<div class="no_messages-data">This folder is empty</div>';
        		row += '</div>';
        	}	
	        row = $(row);
        	
        	$("div#mail_holder").html(row);
        	$("div.pagination_nav").html(jsonData.pagination);
        	
        	__removeOverlay();
        	
        	//row popup show/hide //by jsingh7
        	//please add class (closed) to (div#mail_holder div.manage-pop2-outer div.manage-pop2) by defaut.
        	$("a.popup_menu_2_arrow").click(function(){
        		var thiss = $(this);
        	
				$("div#"+$(this).attr("rel")+"_popup_menu_2").toggle(0,'none',function () {
					$("div#mail_holder div.manage-pop2-outer div.manage-pop2").addClass("closed");
					$("div#mail_holder div.manage-pop2-outer div.manage-pop2").removeClass("open");
					if( $("div#"+thiss.attr("rel")+"_popup_menu_2").is(":visible") )
					{
						$("div#"+thiss.attr("rel")+"_popup_menu_2").addClass("open");
						$("div#"+thiss.attr("rel")+"_popup_menu_2").removeClass("closed");
					}
					else
					{	
						$("div#"+thiss.attr("rel")+"_popup_menu_2").addClass("closed");
						$("div#"+thiss.attr("rel")+"_popup_menu_2").removeClass("open");
					}
					$("div#mail_holder div.manage-pop2-outer div.manage-pop2.closed").hide();
        	});
        	});
        	
        	//message detail
        	$("div#mail_holder div.go_to_detail-text").click(function(){
        		show_inbox_msg_detail($(this).attr("id"));
        	});
        	//end message detail
        	
        	//reply click in list.
        	$("div#mail_holder a.rply").click(function(){
        		show_inbox_msg_detail($(this).attr("id"), 0, 1);
        	});
        	//End reply click in list.

        	//Forward click in list.
        	$("div#mail_holder a.forward").click(function(){
        		
        		show_inbox_msg_detail($(this).attr("id"), 1, 0);
        		
        	});
        	//End forward click in list.
        	
        	//Checking/unchecking checkboxes //By Jsingh7----
        	$("div.mail_select_all input#mail_list_main_cb").click(function(){
        		var isAllChecked = isAllCBChecked("div#mail_holder input.mail_list_cb");
        		if( isAllChecked == 1)
        		{
        			$("div#mail_holder input.mail_list_cb").prop("checked", false);
        		}
        		else
        		{	
        			$("div#mail_holder input.mail_list_cb").prop('checked', true);
        		}
        		if( isAtLeastOneCheckboxChecked( "div#mail_holder input.mail_list_cb" ) == true )
        		{
        			//Do your code.
        		}
        		else
        		{
        			//Do your code.
        		}
        	});
        	
        	$("div#mail_holder input.mail_list_cb").click(function(){
        		var isAllChecked = isAllCBChecked("div#mail_holder input.mail_list_cb");
        		if( isAllChecked == 1 )
        		{
        			$("div.mail_select_all input#mail_list_main_cb").prop('checked', true);
        		}	
        		else
        		{
        			$("div.mail_select_all input#mail_list_main_cb").prop('checked', false);
        		}
        		if( isAtLeastOneCheckboxChecked( "div#mail_holder input.mail_list_cb" ) == true )
        		{
        			//Do your code.
        		}
        		else
        		{
        			//Do your code.
        		}
        	});
        	//------------------------------------------------
        	
        	//Clicking on indiviual mark read. //by jsingh7
        	$("div.manage-pop2 ul li a.mark_read").click(function(){
        		var msg_id = $(this).attr("rel");
        		var iddd = addLoadingImage( $(this), "after");
        		jQuery.ajax({
        	        url: "/" + PROJECT_NAME + "mail/mark-read-inbox-item",
        	        type: "POST",
        	        dataType: "json",
        	        data: { 'msg_ids' : msg_id },
        	        timeout: 50000,
        	        success: function(jsonData) {
        	        	if( jsonData == 1 )
        	        	{	
        		        	$("span#"+iddd).remove();
        		        	$("div#"+msg_id+"_popup_menu_2").fadeOut();//popup close.
        		        	$("div#"+msg_id+"_popup_menu_2 ul li a.mark_read").hide();
        		        	$("div#"+msg_id+"_popup_menu_2 ul li a.mark_unread").show();
        		        	$("div#"+msg_id+".row_holder").removeClass("unread");//show msg as read.
        	        	}
        	        }
        		});	
        	});
        	
        	//Clicking on indiviual mark unread. //by jsingh7
        	$("div.manage-pop2 ul li a.mark_unread").click(function(){
        		var msg_id = $(this).attr("rel");
        		var iddd = addLoadingImage( $(this), "after");
        		jQuery.ajax({
        			url: "/" + PROJECT_NAME + "mail/mark-unread-inbox-item",
        			type: "POST",
        			dataType: "json",
        			data: { 'msg_ids' : msg_id },
        			timeout: 50000,
        			success: function(jsonData) {
        				if( jsonData == 1 )
        				{	
        					$("span#"+iddd).remove();
        					$("div#"+msg_id+"_popup_menu_2").fadeOut();//popup menu close.
        					$("div#"+msg_id+"_popup_menu_2 ul li a.mark_read").show();
        					$("div#"+msg_id+"_popup_menu_2 ul li a.mark_unread").hide();
        					$("div#"+msg_id+".row_holder").addClass("unread");//show msg as read.
        				}
        			}
        		});
        	});
        	
        	//Clicking on indiviual archive. //by jsingh7
        	$("div.manage-pop2 ul li a.archive").click(function(){
        		var msg_id = $(this).attr("rel");
        		var iddd = addLoadingImage( $(this), "after");
        		jQuery.ajax({
        			url: "/" + PROJECT_NAME + "mail/move-msg-to-archive",
        			type: "POST",
        			dataType: "json",
        			data: { 'msg_ids' : msg_id },
        			timeout: 50000,
        			success: function(jsonData) {
        				if( jsonData == 1 )
        				{	
        					$("span#"+iddd).remove();
        					$("div#"+msg_id+"_popup_menu_2").fadeOut();//popup menu close.
        					$("div#mail_holder div#"+msg_id).slideUp();
        				}	
        			}
        		});
        	});
        	//Clicking on indiviual trash. //by Sgandhi
        	$("div.manage-pop2 ul li a.delete_inbox").click(function(){
        		var msg_id = $(this).attr("rel");
        		var iddd = addLoadingImage( $(this), "after");
        		jQuery.ajax({
        			url: "/" + PROJECT_NAME + "mail/move-inbox-msg-to-trash",
        			type: "POST",
        			dataType: "json",
        			data: { 'msg_ids' : msg_id },
        			timeout: 50000,
        			success: function(jsonData) {
        				if( jsonData == 1 )
        				{	
        					$("span#"+iddd).remove();
        					$("div#"+msg_id+"_popup_menu_2").fadeOut();//popup menu close.
        					$("div#mail_holder div#"+msg_id).slideUp();
        				}	
        			}
        		});
        	});

        }
	});
	
	//Opennig mail detail page when redirecting from i-mail notifications popup/dropdown.
	var mail_id = getUrlParameter('mail_id');
	if( typeof mail_id !== 'undefined' )
	{
    	$("div#msg_listing").css('background-color', '#ffffff'); 
		$("div#msg_listing").children().css('visibility', 'hidden');
		show_inbox_msg_detail(mail_id);
	}
}
/**
 * lists inbox feedback request according to the serched word.
 * 
 * @author hkaur5
 * @version 1.0
 */
function listSearchedMails( page, search_text )
{
	__addOverlay();
	
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "mail/get-my-searched-feedback-requests",
        type: "POST",
        dataType: "json",
        data: { 'search_text' : search_text, 'page' : page },
        timeout: 50000,
        success: function(jsonData) {
        	
        	$("div#mail_holder").html("");
        	var is_records_found = 0;
        	var row = "";
        	if( jsonData.records.length != 0 )
        	{
        		is_records_found = 1;
        		$(".controls").show(); //Enabling controls.
	        	row += '<div class="mail_select_all">';
	        	row += '<input type="checkbox" value="" class="fl" name="mail_list_main_cb" id = "mail_list_main_cb">&nbsp; Select All';
	        	row += '<span style = "float:right;"> <b>Search Results</b> <label style = "margin-right : 10px; cursor:pointer;" onclick = "goBackToFeedbackRequests();">[Go Back To Feedback Requests]</label></span>';
	        	row += '</div>';
	        	for( i in jsonData.records )
	        	{
	//              <!-- col1 Starts -->
	        		if( jsonData.records[i].mark_read == 1 )
	        		{        			
	        			row += '<div class="go_to_detail row_holder" id = "'+jsonData.records[i].id+'">';
	        		}
	        		else
	        		{
	        			row += '<div class="go_to_detail row_holder unread" id = "'+jsonData.records[i].id+'">';
	        		}	
	        		row += '<div class="go_to_detail-image">';
	        		row += '<input name="received_mail_ids[]" class="fl mail_list_cb" type="checkbox" value="'+jsonData.records[i].id+'" />';
	        		row += '<div class ="mail-img-listing">';
		        	row += '<div class="go_to_detail-imagebox" style = "display:table-cell; width:50px; height:50px; vertical-align: middle; text-align: center;" user_id="'+jsonData.records[i].msg_sender_id+'">';
		        	row += '<img src="'+jsonData.records[i].prof_image+'"/>';
		        	row += '</div>';
		        	row += '</div>';
		        	row += '</div>';
	        		row += '<div class="go_to_detail-text mid" id = "'+jsonData.records[i].id+'">';
	        		row += '<a id = "'+jsonData.records[i].id+'" class="text-purple2" href="javascript:;" style="font-size:14px;text-decoration: none;"><h4 class="font-arial" >'+showCroppedText( jsonData.records[i].sender_firstname+' '+jsonData.records[i].sender_lastname, 35 )+'</h4></a>';

	        		//row += '<a style="text-decoration: none !important;" href="/'+PROJECT_NAME+'profile/iprofile/id/'+jsonData.records[i].msg_sender_id+'"><h4>'+jsonData.records[i].sender_firstname+' '+jsonData.records[i].sender_lastname+'</h4></a>';
		        	row += '<p><a id = "'+jsonData.records[i].id+'" class="font-arial text-purple-link" href="javascript:;" style="font-size:14px;">'+showCroppedText(jsonData.records[i].subject, 45)+'</a></p>';
	        		row += '</div>';
	        		row += '<div class="go_to_detail-time right">';
	        		row += '<div class="go_to_detail-time-top">'+jsonData.records[i].created_at+'</div>';
	        		row += '<div class="go_to_detail-time-bot"><a href="javascript:;" class = "popup_menu_2_arrow" rel = "'+jsonData.records[i].id+'"><img src="'+IMAGE_PATH+'/arrow-down-lightgrey.png" width="14" height="9" /></a>';
	//              <!-- Popup -->
	        		row += '<div style=" margin-top:5px; margin-left:-140px;" class="manage-pop2-outer">';
	        		row += '<div class="manage-pop2 popup_menu_2 closed" id = "'+jsonData.records[i].id+'_popup_menu_2" style = "display:none;">';
	                row += '<ul>';
	        		//row += '<li><a id = "'+jsonData.records[i].id+'"  class="rply" href="javascript:;">Reply</a></li>';
	        		//row += '<li><a id = "'+jsonData.records[i].id+'" class = "forward" href="#">Forward</a></li>';
	        		if( jsonData.records[i].mark_read == 1 )
	        		{	
	        			row += '<li><a href="javascript:;" class = "mark_unread" rel = "'+jsonData.records[i].id+'">Mark as Unread</a></li>';
	        			row += '<li><a href="javascript:;" class = "mark_read" style = "display:none" rel = "'+jsonData.records[i].id+'">Mark as Read</a></li>';
	        		}
	        		else
	        		{	
	        			row += '<li><a href="javascript:;" class = "mark_unread" style = "display:none" rel = "'+jsonData.records[i].id+'">Mark as Unread</a></li>';
	        			row += '<li><a href="javascript:;" class = "mark_read" rel = "'+jsonData.records[i].id+'">Mark as Read</a></li>';
	        		}	
	        		row += '<li><a href="javascript:;" class = "delete_inbox" rel = "'+jsonData.records[i].id+'">Delete</a></li>';

	                row += '</ul>';
	                row += '</div>';
	        		row += '</div>';
	//              <!-- Popup -->
	        		row += '</div>';
	                row += '</div>';
	        		row += '</div>';
	//              <!-- col1 Ends -->
	        	}
        	}
        	else
        	{
        		row += '<div class="mail_select_all">';
	        	row += '<span style = "float:right;"> <b>Search Results</b> <label style = "margin-right : 10px; cursor:pointer;" onclick = "goBackToFeedbackRequests();">[Go Back To Feedback Requests]</label></span>';
	        	row += '</div>';
        		row += '<div class="no_messages">No search results found</div>';
        	}	
	        row = $(row);
        	
        	$("div#mail_holder").html(row);
        	$("div.pagination_nav").html(jsonData.pagination);
        	
        	if( is_records_found == 0 )
        	{
        		$("div.total").hide();
        	}
        	__removeOverlay();
        	
        	//row popup show/hide //by jsingh7
        	//please add class (closed) to (div#mail_holder div.manage-pop2-outer div.manage-pop2) by defaut.
        	$("a.popup_menu_2_arrow").click(function(){
        		var thiss = $(this);
        	
				$("div#"+$(this).attr("rel")+"_popup_menu_2").toggle(0,'none',function () {
					$("div#mail_holder div.manage-pop2-outer div.manage-pop2").addClass("closed");
					$("div#mail_holder div.manage-pop2-outer div.manage-pop2").removeClass("open");
					if( $("div#"+thiss.attr("rel")+"_popup_menu_2").is(":visible") )
					{
						$("div#"+thiss.attr("rel")+"_popup_menu_2").addClass("open");
						$("div#"+thiss.attr("rel")+"_popup_menu_2").removeClass("closed");
					}
					else
					{	
						$("div#"+thiss.attr("rel")+"_popup_menu_2").addClass("closed");
						$("div#"+thiss.attr("rel")+"_popup_menu_2").removeClass("open");
					}
					$("div#mail_holder div.manage-pop2-outer div.manage-pop2.closed").hide();
        	});
        	});
        	
        	//message detail
        	$("div#mail_holder div.go_to_detail-text").click(function(){
        		show_inbox_msg_detail($(this).attr("id"));
        	});
        	//end message detail
        	
        	//reply click in list.
        	$("div#mail_holder a.rply").click(function(){
        		show_inbox_msg_detail($(this).attr("id"), 0, 1);
        	});
        	//End reply click in list.

        	//Forward click in list.
        	$("div#mail_holder a.forward").click(function(){
        		
        		show_inbox_msg_detail($(this).attr("id"), 1, 0);
        		
        	});
        	//End forward click in list.
        	
        	//Checking/unchecking checkboxes //By Jsingh7----
        	$("div.mail_select_all input#mail_list_main_cb").click(function(){
        		var isAllChecked = isAllCBChecked("div#mail_holder input.mail_list_cb");
        		if( isAllChecked == 1)
        		{
        			$("div#mail_holder input.mail_list_cb").prop("checked", false);
        		}
        		else
        		{	
        			$("div#mail_holder input.mail_list_cb").prop('checked', true);
        		}
        		if( isAtLeastOneCheckboxChecked( "div#mail_holder input.mail_list_cb" ) == true )
        		{
        			//Do your code.
        		}
        		else
        		{
        			//Do your code.
        		}
        	});
        	
        	$("div#mail_holder input.mail_list_cb").click(function(){
        		var isAllChecked = isAllCBChecked("div#mail_holder input.mail_list_cb");
        		if( isAllChecked == 1 )
        		{
        			$("div.mail_select_all input#mail_list_main_cb").prop('checked', true);
        		}	
        		else
        		{
        			$("div.mail_select_all input#mail_list_main_cb").prop('checked', false);
        		}
        		if( isAtLeastOneCheckboxChecked( "div#mail_holder input.mail_list_cb" ) == true )
        		{
        			//Do your code.
        		}
        		else
        		{
        			//Do your code.
        		}
        	});
        	//------------------------------------------------
        	
        	//Clicking on indiviual mark read. //by jsingh7
        	$("div.manage-pop2 ul li a.mark_read").click(function(){
        		var msg_id = $(this).attr("rel");
        		var iddd = addLoadingImage( $(this), "after");
        		jQuery.ajax({
        	        url: "/" + PROJECT_NAME + "mail/mark-read-inbox-item",
        	        type: "POST",
        	        dataType: "json",
        	        data: { 'msg_ids' : msg_id },
        	        timeout: 50000,
        	        success: function(jsonData) {
        	        	if( jsonData == 1 )
        	        	{	
        		        	$("span#"+iddd).remove();
        		        	$("div#"+msg_id+"_popup_menu_2").fadeOut();//popup close.
        		        	$("div#"+msg_id+"_popup_menu_2 ul li a.mark_read").hide();
        		        	$("div#"+msg_id+"_popup_menu_2 ul li a.mark_unread").show();
        		        	$("div#"+msg_id+".row_holder").removeClass("unread");//show msg as read.
        	        	}
        	        }
        		});	
        	});
        	
        	//Clicking on indiviual mark unread. //by jsingh7
        	$("div.manage-pop2 ul li a.mark_unread").click(function(){
        		var msg_id = $(this).attr("rel");
        		var iddd = addLoadingImage( $(this), "after");
        		jQuery.ajax({
        			url: "/" + PROJECT_NAME + "mail/mark-unread-inbox-item",
        			type: "POST",
        			dataType: "json",
        			data: { 'msg_ids' : msg_id },
        			timeout: 50000,
        			success: function(jsonData) {
        				if( jsonData == 1 )
        				{	
        					$("span#"+iddd).remove();
        					$("div#"+msg_id+"_popup_menu_2").fadeOut();//popup menu close.
        					$("div#"+msg_id+"_popup_menu_2 ul li a.mark_read").show();
        					$("div#"+msg_id+"_popup_menu_2 ul li a.mark_unread").hide();
        					$("div#"+msg_id+".row_holder").addClass("unread");//show msg as read.
        				}
        			}
        		});
        	});
        	
        	//Clicking on indiviual archive. //by jsingh7
        	$("div.manage-pop2 ul li a.archive").click(function(){
        		var msg_id = $(this).attr("rel");
        		var iddd = addLoadingImage( $(this), "after");
        		jQuery.ajax({
        			url: "/" + PROJECT_NAME + "mail/move-msg-to-archive",
        			type: "POST",
        			dataType: "json",
        			data: { 'msg_ids' : msg_id },
        			timeout: 50000,
        			success: function(jsonData) {
        				if( jsonData == 1 )
        				{	
        					$("span#"+iddd).remove();
        					$("div#"+msg_id+"_popup_menu_2").fadeOut();//popup menu close.
        					$("div#mail_holder div#"+msg_id).slideUp();
        				}	
        			}
        		});
        	});
        	//Clicking on indiviual trash. //by Sgandhi
        	$("div.manage-pop2 ul li a.delete_inbox").click(function(){
        		var msg_id = $(this).attr("rel");
        		var iddd = addLoadingImage( $(this), "after");
        		jQuery.ajax({
        			url: "/" + PROJECT_NAME + "mail/move-inbox-msg-to-trash",
        			type: "POST",
        			dataType: "json",
        			data: { 'msg_ids' : msg_id },
        			timeout: 50000,
        			success: function(jsonData) {
        				if( jsonData == 1 )
        				{	
        					$("span#"+iddd).remove();
        					$("div#"+msg_id+"_popup_menu_2").fadeOut();//popup menu close.
        					$("div#mail_holder div#"+msg_id).slideUp();
        				}	
        			}
        		});
        	});

        }
	});	
}
/**
 * Show detail mail part.
 * 
 * one can pass parameters forward_show or reply_show
 * with value 1 by keeping other 0, to show forward or 
 * reply form pre open.
 * 
 * @param integer msg_id
 * @param boolean forward_show [optional]
 * @param boolean reply_show [optional]
 * 
 * @author Jsingh7, sgandhi
 * @version 1.1
 */
function show_inbox_msg_detail( msg_id, forward_show, reply_show )
{
	forward_show = typeof forward_show !== 'undefined' ? forward_show : "0";
	reply_show = typeof reply_show !== 'undefined' ? reply_show : "0";

	__addOverlay();
	
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "mail/get-msg-detail",
        type: "POST",
        dataType: "json",
        data: {'message_id':msg_id },
        timeout: 50000,
        complete: function(){
        	$("div#msg_listing").css('background-color', 'none'); 
    		$("div#msg_listing").children().css('visibility', 'visible');
        },
        success: function(jsonData) {
        	console.log(jsonData);
        	$('#mail_detail_subject').text(jsonData.subject);
        	var receivers = "";
			var row = "";
			row += '<div class="mail-grey-hdr-col1">';
			row += '<div class="left">';
			row += '<div style = "display: inline-block; width:60px; height:60px;">';
        	row += '<div style = "display:table-cell;">';
			row += '<img src="'+jsonData.sender_prof_image+'" width="60" height="60"  /></div>';
			row += '</div>';
			row += '</div>';
			row += '<div class="mid">';
			row += '<h4 class="mail-user-title">'+jsonData.sender_firstname+' '+jsonData.sender_lastname+'</h4>';
			row += '<input id="sender_info" type="hidden" rel="'+jsonData.msg_sender_id+'" value="" rel1="'+jsonData.sender_firstname+'" rel2="'+jsonData.sender_lastname+'">';
		    
			if(jsonData.reciever_names.length > 40){
				receivers += jsonData.reciever_names.substr(0, 30)+ "...";	
			}
			else{
				receivers += jsonData.reciever_names;	
			}
			row += '<p title = "'+jsonData.reciever_names+'">To: ';
			row += receivers;
		    row += '</p>';
		    
        //	row += '<p>'+jsonData.subject+'</p>';
			row += '</div>';
			row += '<div class="right">';
			row += '<div class="top">'+jsonData.created_at_date+'</div>';
			row += '<div class="mid">'+jsonData.created_at_time+'</div>';
//			row += '<div class="bot">&nbsp;</div>';
			row += '</div>';
			row += '</div>';
			row += '<div class="mail-content-outer">';
			row += '<div class="mail-content-mid">';
			//alert(jsonData.contents);
			row += '<p>'+nl2br(jsonData.contents)+'</p>';
			row += '</div>';
			row += '<div class="mail-content-bot" id = "'+jsonData.msg_id+'_popup_menu_2">';
			row += '<ul>';
//			row += '<li><a href="#" class = "archive_feedback" rel = "'+jsonData.msg_id+'"><span>Archive</span></a>';
			//row += '<img src="'+IMAGE_PATH+'/folder-hover.png" width="16" height="13" align="absmiddle" /></li>';
			//row += '<li><a href="#" id="forward">Forward</a><img src="'+IMAGE_PATH+'/icon-forwad.png" width="13" height="14" align="absmiddle" /></li>';
			//row += '<li><a href="#" id="rply">Reply</a><img width="16" height="16" align="absmiddle" src="'+IMAGE_PATH+'/icon-reply.png"></li>';
			//row += '<li><a href="#">Report as Spam</a><img src="'+IMAGE_PATH+'/icon-fire-purple.png" width="14" height="16" /></li>';
			row += '<li><a href="javascript:;" class = "delete_inbox" rel = "'+jsonData.msg_id+'"><span>Delete</span></a></li>';
			row += '</ul>';
			row += '</div>';
			
			// Forward Div starts here
			row += '<div class="mail-sendmsg-outer" id="mail-sendmsg-outer1" style="padding:0px;width:100%;display:none;">';
			row += '<form name="send_message_form" id="send_message_form" action="" method="post" >';
			row += '<input type="hidden" name="msg_type" value="'+MSG_TYPE_GENERAL+'" >';
			row += '<div class="mail-sendmsg-col1">';
			row += '<div class="right"><a id="send_message" class="text-purple-link" href="javascript:;">Send Message</a><img src="'+IMAGE_PATH+'/mail-hover.png" width="16" height="13" align="absmiddle" /></div>';
			row += '</div>';
            row += '<div style="display:none;" id="receiver_ids_holder">';
            row += ' </div>';
            row += '<div class="mail-sendmsg-col2">';
            row += '<label>TO</label>';
            row += '<span>';
            row += '<input name="receiver_id" id="receiver_id" type="text" 	class="forward_to_field"/>';
            row += '<a id="mail_contacts_popup" href="javascript:;"><img src="'+IMAGE_PATH+'/icon-connection-hover.png" width="16" height="15" title = "Add recipients"/></a>';
            row += ' </span>';
            row += '<label>SUBJECT</label>';
            row += '<span><input name="subject" id="subject" type="text" value="FW: '+jsonData.subject+'" />';
           // row += '<a title="Reset Subject" id="reset_subject" href="javascript:;"><img src="'+IMAGE_PATH+'/icon-reload.png" width="16" height="16" /></a>';
            row += '</span>';
            row += '<script type="text/javascript">';
            row += '</script>';
            row += ' </div>';
            row += '<div class="mail-sendmsg-col2-msg">MESSAGE</div>';
            row += ' <div class="mail-sendmsg-col2-content">';
            row += ' <textarea name="message_body" id="message_body" class="textarea" style="width:100%; border:none; min-height:170px; resize:none;" cols="" rows="">'+jsonData.contents+'</textarea>';
            row += ' </div>';
            row += ' <div class="mail-save-draft">';
            row += '<div class="fl fr_cancel"><a id="cancel" class="text-purple-link" href="javascript:;">Cancel</a> </div>';
            row += '  </div>';
            row += ' </form>';
            row += '</div>';
            // Forward Div end here
			
            //Reply div starts
			row += '<div class="mail-sendmsg-outer" id="mail-sendmsg-outer2" style="padding:0px;width:100%;display:none;">';
			row += '<form name="send_message_forms" id="send_message_forms" action="" method="post" >';
			row += '<input type="hidden" name="msg_type" value="'+MSG_TYPE_GENERAL+'" >';
			row += '<div class="mail-sendmsg-col1">';
			row += '<div class="right"><a id="send_messages" class="text-purple-link" href="javascript:;">Send Message</a><img src="'+IMAGE_PATH+'/mail-hover.png" width="16" height="13" align="absmiddle" /></div>';
			row += '</div>';
            row += '<div style="display:none;" id="receiver_ids_holders">';
            row += ' </div>';
            row += '<div class="mail-sendmsg-col2">';
            row += '<label>TO</label>';
            row += '<span>';
            row += '<input name="receiver_ids" id="receiver_ids" type="text" value="" class="reply_to_field"	/>';
            row += '<a id="mail_contacts_popups" href="javascript:;"><img src="'+IMAGE_PATH+'/icon-connection-hover.png" width="16" height="15" title = "Add recipients"/></a>';
            row += ' </span>';
            row += '<label>SUBJECT</label>';
            row += '<span><input name="subjects" id="subjects" type="text" value="RE: '+jsonData.subject+'" />';
           // row += '<a title="Reset Subject" id="reset_subjects" href="javascript:;"><img src="'+IMAGE_PATH+'/icon-reload.png" width="16" height="16" /></a>';
            row += '</span>';
            row += '<script type="text/javascript">';
            row += '</script>';
            row += ' </div>';
          
          

            row += '<div class="mail-sendmsg-col2-msg">MESSAGE</div>';
            row += ' <div class="mail-sendmsg-col2-content">';
           

            row += '<textarea name="message_bodys" id="message_bodys" class="textarea" style=" border: medium none; resize: none;min-height:170px;" cols="8" rows="4">';
            row += '\r\n \r\n ';
            row += ' ----';
            row += '\r\n From: ' +jsonData.sender_firstname+' '+jsonData.sender_lastname+'';
            row += '\r\n Sent: '+jsonData.created_at_date+' '+jsonData.created_at_time+'';
            if(jsonData.reciever_names.length > 40){
           	 row += '\r\n To: '+jsonData.reciever_names.substr(0, 30)+ "..."+'';
		    	 	
		    }
		    else{
		    	row += '\r\n To: '+jsonData.reciever_names+'';
		    }

            //row += '\r\n To: '+jsonData.reciever_names;
            row += '\r\n Subject: '+jsonData.subject+'';
            row += '\r\n';
            row += '\r\n' +jsonData.contents;
           
            row	+= '</textarea>';

           // row += ' <textarea name="message_bodys" id="message_bodys" class="textarea" style="width:100%; border:none; min-height:170px; resize:none;" cols="" rows="">'+jsonData.contents+'</textarea>';
            row += ' </div>';
            row += ' <div class="mail-save-draft">';
            row += '<div class="fl fr_cancel"><a id="cancels" class="text-purple-link" href="javascript:;">Cancel</a> </div>';
            row += '  </div>';
            row += ' </form>';
            row += '</div>';
          

          //Reply div end here
			
			
			
     	
            row += '</div>';
            row += '<div id="dialog_confirm" title="Alert">';
            row += '<p>';
            row += '<span class="ui-icon ui-icon-info" style="float: left; margin: 0 7px 50px 0;"></span>Please enter Receiver name!';
            row += '</p>';
            row += '</div>';
			$("div#detial_msg_holder").html(row);
			__removeOverlay();
			$("div#msg_listing").hide();
    		$("div#detailed_msg").fadeIn("slow");
    		
    		//Marking inbox item read on openning its detail, with jquery only and rest of the code is in ajax call action. //by Jsingh7
    		$("div.row_holder#"+msg_id).removeClass("unread");
    		//showing appropriate menu options.
    		$("div#"+msg_id+"_popup_menu_2 li a.mark_read").hide();
    		$("div#"+msg_id+"_popup_menu_2 li a.mark_unread").show();
    		
	    		$("a#forward").click(function(){
	    			$("div#mail-sendmsg-outer1").slideToggle();  
	    			//$(".mail-content-outer").css("min-height","219px"); 
	    		
	    			$("div#mail-sendmsg-outer2").hide();  
	    		});
    		
	    		$("a#rply").click(function(){
	    			
	    			$("div#mail-sendmsg-outer2").slideToggle(); 
	    			$("div#mail-sendmsg-outer1").hide(); 
	    			// adding tokens to "TO" field while replying a message.
	    			$("input#receiver_ids").tokenInput("clear");
					$("input#receiver_ids").tokenInput( "add", {id : $("input#sender_info").attr("rel"), first_name: $("input#sender_info").attr("rel1"), last_name: $("input#sender_info").attr("rel2")} );
	    		});

    		//Token input---------------
    		$("#receiver_id").tokenInput(PROJECT_URL+PROJECT_NAME+"mail/get-my-matching-contacts", {
    			onAdd: function (item) {
    				$("div#receiver_ids_holder").append("<input type = 'hidden' name = 'receiver_ids[]' class = 'receiver_ids' id = '"+item.id+"' value = '"+item.id+"'>");
    			},
    			onDelete: function (item) {
    				$('div#receiver_ids_holder input#'+item.id).remove();
    			},
    			theme: "facebook",
    			propertyToSearch: "first_name",
    			propertyToSearch: "last_name",
    			resultsFormatter: function(item){ return "<li><div style = 'width:25px; height:25px; display:inline-block;'><div style = 'width:25px; height:25px; display : table-cell; vertical-align: middle; text-align: center;'>" + "<img style = 'max-width : 25px; max-height : 25px;' src='" + item.url + "' title='" + item.first_name + " " + item.last_name + "'/></div></div>" + "<div style='display: inline-block; padding-left: 10px;'><div class='full_name'>" + item.first_name + " " + item.last_name + "</div><div class='email'>" + item.email + "</div></div></li>" },
    			tokenFormatter: function(item) { return "<li><p>" + item.first_name + " " + item.last_name + "</p></li>" },
    		});
    		//Token input---------------rply
    		$("#receiver_ids").tokenInput(PROJECT_URL+PROJECT_NAME+"mail/get-my-matching-contacts", {
    			onAdd: function (item) {
    				$("div#receiver_ids_holders").append("<input type = 'hidden' name = 'receiver_idss[]' class = 'receiver_idss' id = '"+item.id+"' value = '"+item.id+"'>");
    			},
    			onDelete: function (item) {
    				$('div#receiver_ids_holders input#'+item.id).remove();
    			},
    			theme: "facebook",
    			propertyToSearch: "first_name",
    			propertyToSearch: "last_name",
    			resultsFormatter: function(item){ return "<li><div style = 'width:25px; height:25px; display:inline-block;'><div style = 'width:25px; height:25px; display : table-cell; vertical-align: middle; text-align: center;'>" + "<img style = 'max-width : 25px; max-height : 25px;' src='" + item.url + "' title='" + item.first_name + " " + item.last_name + "'/></div></div>" + "<div style='display: inline-block; padding-left: 10px;'><div class='full_name'>" + item.first_name + " " + item.last_name + "</div><div class='email'>" + item.email + "</div></div></li>" },
    			tokenFormatter: function(item) { return "<li><p>" + item.first_name + " " + item.last_name + "</p></li>" },
    		});
        	//Clicking on indiviual archive. //by Shaina
        	$("div.mail-content-bot ul li a.archive_feedback").click(function(){
        		var msg_id = $(this).attr("rel");
        		var iddd = addLoadingImage( $(this), "before");
        		jQuery.ajax({
        			url: "/" + PROJECT_NAME + "mail/move-msg-to-archive",
        			type: "POST",
        			dataType: "json",
        			data: { 'msg_ids' : msg_id },
        			timeout: 50000,
        			success: function(jsonData) {
        				if( jsonData == 1 )
        				{	
        					$("span#"+iddd).remove();
        					$("div#detailed_msg").hide();
        					$("div#msg_listing").fadeIn("slow");
        					$("div#mail_holder div#"+msg_id+".mail-grey-hdr-col1").fadeOut();
        					
        					$("div#mail_holder div#"+msg_id).slideUp();
        				}	
        			}
        		});
        	});


        	//Clicking on indiviual sent trash. //by Sgandhi
        	$(" div.mail-content-bot ul li a.delete_inbox").click(function(){
        		var msg_id = $(this).attr("rel");
        		var iddd = addLoadingImage( $(this), "before");
        		jQuery.ajax({
        			url: "/" + PROJECT_NAME + "mail/move-inbox-msg-to-trash",
        			type: "POST",
        			dataType: "json",
        			data: { 'msg_ids' : msg_id },
        			timeout: 50000,
        			success: function(jsonData) {
        				if( jsonData == 1 )
        				{	
        				
        					$("span#"+iddd).remove();
        					//$("div#detial_msg_holder").fadeOut();
        					$("div#detailed_msg").hide();
        					$("div#msg_listing").fadeIn("slow");
        					$("div#mail_holder div#"+msg_id+".mail-grey-hdr-col1").fadeOut();
        					
        					$("div#mail_holder div#"+msg_id).slideUp();
        					//window.location.href = "/" + PROJECT_NAME + "mail/inbox";
        					
        					//$("div#"+msg_id+"_detial_msg_holder").fadeOut();
        					//$("div#detial_msg_holder div#"+msg_id).slideUp();
        				}	
        			}
        		});
        	});

    		// send button click and validation on composing message by Ritu
    		$("#send_message").click(function() {
    			if($('input.forward_to_field').siblings('ul.token-input-list-facebook').children('li.token-input-token-facebook').length < 1){
    				$( "#dialog_confirm" ).dialog( "open" );
    			}else{
    				sendmail();
    			}
    		});
    		$("#send_messages").click(function() {
    			if($('input.reply_to_field').siblings('ul.token-input-list-facebook').children('li.token-input-token-facebook').length < 1){
    				$( "#dialog_confirm" ).dialog( "open" );
    			}else{	
    				sendmails();
    			}
    			
    		});
    		
    		$("#cancel").click(function() {
    			$("form#send_message_form").trigger('reset');
    			$("#receiver_id").tokenInput("clear");
    			$("#subject").focus();
    			$("div.mail-sendmsg-outer").slideUp();   
    		});
    		////for rply cancel
    		$("#cancels").click(function() {
    			$("form#send_message_forms").trigger('reset');
    			$("#receiver_ids").tokenInput("clear");
    			$("#subjects").focus();
    			$("div.mail-sendmsg-outer").slideUp();   
    		});
   		
    		$("#reset_subject").click(function() {
    			$("#subject").val("");
    		});
    		/////for rply 
    		$("#reset_subjects").click(function() {
    			$("#subjects").val("");
    		});


    		//Modal message dialog-box----------
    		$( "#dialog_confirm" ).dialog({
    		      modal: true,
    		      autoOpen: false,
    		      width: 250,
    		      show: {
    		    	  effect: "fade"
    		    	  },
    			  hide: {
    				  effect: "fade"
    				  },
    		      buttons: {
    		        'ok': function() {
    		        	$( this ).dialog( "close" );
    		        	$('#jq_receiver_id').focus();
    		        	    		        	
    		        }
    		      }
    		});	
    		
    		//for mail contacts popup -----------------
    		$('#mail_contacts_popup').click( function(){
    			__addOverlay();
    			ShowContactsPopup();
    		});
    		//for mail contacts popup -----------------rply
    		$('#mail_contacts_popups').click( function(){
    			__addOverlay();
    			ShowContactsPopup();
    		});
    		
    		$("img.close_popup").click(function(){
    			$('div#gmail_popup').bPopup().close();
    		});
    		
    		// adding tokens to 'To' field.
    		$("form#email_contacts_form #gmail_import_btn").click(function(){
    			$("input[name='emails[]']:checked:enabled",'form#email_contacts_form').each(function( index ) {
    				$("input#receiver_id").tokenInput("add", {id : $(this).attr("rel"), first_name: $(this).attr("rel1"), last_name: $(this).attr("rel2")});
    			});
    			$('div#gmail_popup').bPopup().close();
    		});
    		$("form#email_contacts_form #gmail_import_btn").click(function(){
    			$("input[name='emails[]']:checked:enabled",'form#email_contacts_form').each(function( index ) {
    				$("input#receiver_ids").tokenInput("add", {id : $(this).attr("rel"), first_name: $(this).attr("rel1"), last_name: $(this).attr("rel2")});
    			});
    			$('div#gmail_popup').bPopup().close();
    		});
    		
    		if( forward_show == 1 )
    		{
    			$("div#mail-sendmsg-outer1").slideToggle();  
    			$("div#mail-sendmsg-outer2").hide();  
    		}
	        if( reply_show == 1)
	        {	
	        	
	        	$("div#mail-sendmsg-outer2").slideToggle();
	        	$("div#mail-sendmsg-outer1").hide(); 
	        	// adding tokens to "TO" field while replying a message.
	        	$("input#receiver_ids").tokenInput("clear");
	        	$("input#receiver_ids").tokenInput( "add", {id : $("input#sender_info").attr("rel"), first_name: $("input#sender_info").attr("rel1"), last_name: $("input#sender_info").attr("rel2")} );
	        }	

    		
        }
	});
	
	
}