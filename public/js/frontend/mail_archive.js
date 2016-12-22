$(document).ready(function(){
	//listing emails
	
	discardTempFilesforReply();
	discardTempFilesforForward();
	list_mails(1);
	
	//Back to archive listing
	$("a#back_to_mail_list").click(function(){
		$("div#detailed_msg").hide();
		$("div#msg_listing").fadeIn("slow");
		clearForwardAttachmentFormData();
		clearReplyFormData();
	});
	//pagination click
	$('.pagination_nav').on('click','li.active', function(){
        var page = $(this).attr('p');
        if( $( "div.mail-hdr-search input[name=archive_mails_search]" ).val().length > 0 )
        {
        	listSearchedMails( page, $( "div.mail-hdr-search input[name=archive_mails_search]" ).val() );
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
	        url: "/" + PROJECT_NAME + "mail/move-archive-msg-to-trash",
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
	        url: "/" + PROJECT_NAME + "mail/mark-read-archive-item",
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
			url: "/" + PROJECT_NAME + "mail/mark-unread-archive-item",
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
	$("div#manage_pop_1 ul li a#multi_inbox").click(function(){
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
	        url: "/" + PROJECT_NAME + "mail/move-archive-msg-to-inbox",
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
	 $('#archive_mails_search').on('keypress', function(e){
		if(e.which == 13 )
			{  //Enter is key 13 
			listSearchedMails( 1, $("div.mail-hdr-search input[name=archive_mails_search]").val() );
			}
	});
	
	// Clicking on search button. 
	$("a#search_archive_items").click(function(){
		if($( "div.mail-hdr-search input[name=archive_mails_search]" ).val().length <= 0 )
		{
			alert( "Please enter some text to search!" );
			return;
		}	
		listSearchedMails( 1, $("div.mail-hdr-search input[name=archive_mails_search]").val() );
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

//On window unload remove all the temp attachments. attached but not sent.
$( window ).unload(function() {
	discardTempFilesforReply();
	discardTempFilesforForward();
});


function goBackToArchiveMails()
{
	$( "div.mail-hdr-search input[name=archive_mails_search]" ).val("");
	list_mails(1);
}
/**
 * lists archive emails.
 * 
 * @author sgandhi
 * @version 1.0
 */
function list_mails(page)
{
	//listing mails in archive by sgandhi
	__addOverlay();
	
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "mail/get-my-archive",
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
	        	row += '<img src="'+jsonData.records[i].prof_image+'" />';
	        	row += '</div>';
	        	row += '</div>';
	        	row += '</div>';
        		row += '<div class="go_to_detail-text mid" id = "'+jsonData.records[i].id+'">';
        		row += '<a id = "'+jsonData.records[i].id+'" class="text-purple2" href="javascript:;" style="font-size:14px;text-decoration: none;"><h4 class="font-arial" >'+showCroppedText( jsonData.records[i].sender_firstname+' '+jsonData.records[i].sender_lastname, 35 )+'</h4></a>';

        		//row += '<a style="text-decoration: none !important;" href="/'+PROJECT_NAME+'profile/iprofile/id/'+jsonData.records[i].msg_sender_id+'"><h4>'+jsonData.records[i].sender_firstname+' '+jsonData.records[i].sender_lastname+'</h4>';
        		if(jsonData.records[i].subject == "" || jsonData.records[i].subject == null){
	        		row += '<p><a id = "'+jsonData.records[i].id+'" class="text-purple-link text-purple2  font-arial" href="javascript:;" style="font-size:14px;"><i>No Subject</i></a></p>';
	        	}else{
	        		row += '<p><a id = "'+jsonData.records[i].id+'" class="text-purple-link text-purple2  font-arial" title="'+jsonData.records[i].subject+'" href="javascript:;" style="font-size:14px;">'+showCroppedText(jsonData.records[i].subject, 45)+'</a></p>';
	        		
	        	}
        		row += '<p class="">';
        		row += '<a id = "'+jsonData.records[i].id+'" class="text-purple-link text-purple2 font-weight-normal font-arial" href="javascript:;" style="font-size:14px;">';
         		if(jsonData.records[i].content.length <= 150 )
        		{
        			row += jsonData.records[i].content;
        		}
        		else if(jsonData.records[i].content.length > 150 )
        		{
        			row += showCroppedText(jsonData.records[i].content, 150);
        			
        		}
        		row += '</a>';
        		row += '</p>';
        		//row += '<p><a id = "'+jsonData.records[i].id+'" class="text-purple-link go_to_detail" href="javascript:;" style="font-size:14px;">'+jsonData.records[i].subject+'</a></p>';
        		row += '</div>';
        		row += '<div class="go_to_detail-time right">';
        		row += '<div class="go_to_detail-time-top">'+jsonData.records[i].created_at+'</div>';
        		
        		//Attachement Clip.
        		if( parseInt(jsonData.records[i].num_of_attachments) > 0 )
        		{
        			row += '<div class="attachment-clip"><img src="'+IMAGE_PATH+'/attachment-clip.png" /></div>';
        		}
        		row += '<div class="go_to_detail-time-bot"><a href="javascript:;" class = "popup_menu_2_arrow" rel = "'+jsonData.records[i].id+'"><img src="'+IMAGE_PATH+'/arrow-down-lightgrey.png" width="14" height="9" /></a>';
//              <!-- Popup -->
        		row += '<div style=" margin-top:5px; margin-left:-140px;" class="manage-pop2-outer">';
        		row += '<div class="manage-pop2 popup_menu_2 closed" id = "'+jsonData.records[i].id+'_popup_menu_2" style = "display:none;">';
                row += '<ul>';
                if( jsonData.records[i].can_reply == 1 )
        		{	
        		row += '<li><a id = "'+jsonData.records[i].id+'"  class="rply" href="javascript:;">Reply</a></li>';
        		}
                if( jsonData.records[i].can_forward == 1 )
                {
                	row += '<li><a id = "'+jsonData.records[i].id+'" class = "forward" href="javascript:;">Forward</a></li>';
                }
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
        		row += '<li><a href="javascript:;" class = "inbox" rel = "'+jsonData.records[i].id+'">Inbox</a></li>';
        		row += '<li><a href="javascript:;" class = "delete_archive" rel = "'+jsonData.records[i].id+'">Delete</a></li>';
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
        	
        	//Clicking on indiviual trash. //by Sgandhi
        	$("div.manage-pop2 ul li a.delete_archive").click(function(){
        		var msg_id = $(this).attr("rel");
        		var iddd = addLoadingImage( $(this), "after");
        		jQuery.ajax({
        			url: "/" + PROJECT_NAME + "mail/move-archive-msg-to-trash",
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
        	//------------------------------------------------
        	
        	//Clicking on indiviual mark read. //by jsingh7
        	$("div.manage-pop2 ul li a.mark_read").click(function(){
        		var msg_id = $(this).attr("rel");
        		var iddd = addLoadingImage( $(this), "after");
        		jQuery.ajax({
        	        url: "/" + PROJECT_NAME + "mail/mark-read-archive-item",
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
        			url: "/" + PROJECT_NAME + "mail/mark-unread-archive-item",
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
        	
        	//Clicking on indiviual inbox. //by jsingh7
        	$("div.manage-pop2 ul li a.inbox").click(function(){
        		var msg_id = $(this).attr("rel");
        		var iddd = addLoadingImage( $(this), "after");
        		jQuery.ajax({
        			url: "/" + PROJECT_NAME + "mail/move-archive-msg-to-inbox",
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
function listSearchedMails( page, search_text )
{
	__addOverlay();
	
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "mail/get-my-searched-archive",
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
        	row += '<span style = "float:right;"> <b>Search Results</b> <label style = "margin-right : 10px; cursor:pointer;" onclick = "goBackToArchiveMails();">[Go Back To Archive Mails]</label></span>';
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
	        	row += '<img src="'+jsonData.records[i].prof_image+'" />';
	        	row += '</div>';
	        	row += '</div>';
	        	row += '</div>';
        		row += '<div class="go_to_detail-text mid" id = "'+jsonData.records[i].id+'">';
        		row += '<a id = "'+jsonData.records[i].id+'" class="text-purple2" href="javascript:;" style="font-size:14px;text-decoration: none;"><h3 class="font-arial" >'+showCroppedText( jsonData.records[i].sender_firstname+' '+jsonData.records[i].sender_lastname, 35 )+'</h3></a>';

        		//row += '<a style="text-decoration: none !important;" href="/'+PROJECT_NAME+'profile/iprofile/id/'+jsonData.records[i].msg_sender_id+'"><h4>'+jsonData.records[i].sender_firstname+' '+jsonData.records[i].sender_lastname+'</h4>';
        		if(jsonData.records[i].subject == "" || jsonData.records[i].subject == null)
        		{
	        		row += '<p><a id = "'+jsonData.records[i].id+'" class="text-purple-link text-purple2  font-arial" href="javascript:;" style="font-size:14px;"><i>No Subject</i></a></p>';
	        	}
        		else
	        	{
	        		row += '<p><a id = "'+jsonData.records[i].id+'" class="text-purple-link text-purple2  font-arial" href="javascript:;" style="font-size:14px;">'+showCroppedText(jsonData.records[i].subject, 45)+'</a></p>';
	        		
	        	}
         		row += '<p class="">';
        		row += '<a id = "'+jsonData.records[i].id+'" class="text-purple-link text-purple2 font-weight-normal font-arial" href="javascript:;" style="font-size:14px;">';
        		row += showCroppedText(jsonData.records[i].content, 150);
        		row += '</a>';
        		row += '</p>';
        		//row += '<p><a id = "'+jsonData.records[i].id+'" class="text-purple-link go_to_detail" href="javascript:;" style="font-size:14px;">'+jsonData.records[i].subject+'</a></p>';
        		row += '</div>';
        		row += '<div class="go_to_detail-time right">';
        		row += '<div class="go_to_detail-time-top">'+jsonData.records[i].created_at+'</div>';
        		
        		//Attachement Clip.
        		if( parseInt(jsonData.records[i].num_of_attachments) > 0 )
        		{
        			row += '<div class="attachment-clip"><img src="'+IMAGE_PATH+'/attachment-clip.png" /></div>';
        		}
        		
        		row += '<div class="go_to_detail-time-bot"><a href="javascript:;" class = "popup_menu_2_arrow" rel = "'+jsonData.records[i].id+'"><img src="'+IMAGE_PATH+'/arrow-down-lightgrey.png" width="14" height="9" /></a>';
//              <!-- Popup -->
        		row += '<div style=" margin-top:5px; margin-left:-140px;" class="manage-pop2-outer">';
        		row += '<div class="manage-pop2 popup_menu_2 closed" id = "'+jsonData.records[i].id+'_popup_menu_2" style = "display:none;">';
                row += '<ul>';
                if(jsonData.records[i].can_reply)
                {
                	row += '<li><a id = "'+jsonData.records[i].id+'"  class="rply" href="javascript:;">Reply</a></li>';
                }
                if(jsonData.records[i].can_forward)
                {
                	row += '<li><a id = "'+jsonData.records[i].id+'" class = "forward" href="javascript:;">Forward</a></li>';
                }
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
        		row += '<li><a href="javascript:;" class = "inbox" rel = "'+jsonData.records[i].id+'">Inbox</a></li>';
        		row += '<li><a href="javascript:;" class = "delete_archive" rel = "'+jsonData.records[i].id+'">Delete</a></li>';
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
        		row += '<div class="mail_select_all">';
	        	row += '<span style = "float:right;"> <b>Search Results</b> <label style = "margin-right : 10px; cursor:pointer;" onclick = "goBackToArchiveMails();">[Go Back To Archive Mails]</label></span>';
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
        	
        	//Clicking on indiviual trash. //by Sgandhi
        	$("div.manage-pop2 ul li a.delete_archive").click(function(){
        		var msg_id = $(this).attr("rel");
        		var iddd = addLoadingImage( $(this), "after");
        		jQuery.ajax({
        			url: "/" + PROJECT_NAME + "mail/move-archive-msg-to-trash",
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
        	//------------------------------------------------
        	
        	//Clicking on indiviual mark read. //by jsingh7
        	$("div.manage-pop2 ul li a.mark_read").click(function(){
        		var msg_id = $(this).attr("rel");
        		var iddd = addLoadingImage( $(this), "after");
        		jQuery.ajax({
        	        url: "/" + PROJECT_NAME + "mail/mark-read-archive-item",
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
        			url: "/" + PROJECT_NAME + "mail/mark-unread-archive-item",
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
        	
        	//Clicking on indiviual inbox. //by jsingh7
        	$("div.manage-pop2 ul li a.inbox").click(function(){
        		var msg_id = $(this).attr("rel");
        		var iddd = addLoadingImage( $(this), "after");
        		jQuery.ajax({
        			url: "/" + PROJECT_NAME + "mail/move-archive-msg-to-inbox",
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
 * 
 * ajax to forward a mail
 * @author Ritu
 * @author sjaiswal(updated attachment code)
 */
function sendmail(){
	
	// for updating ckditor i.e. sending ckeditor data in serialised form data
	for (instance in CKEDITOR.instances) {
        CKEDITOR.instances[instance].updateElement();
    }
	
	var temp_path_info_arr = {};
	var temp_path_info_inner_arr = {};

	$.each( $("div.template-download span.file_attachments"), function( key, value ) {

		temp_path_info_inner_arr = {};
		temp_path_info_inner_arr.ts_file_name 			= $(this).attr("ts_file_name");
		temp_path_info_inner_arr.ts_file_size 			= $(this).attr("ts_file_size");
		temp_path_info_arr['index_'+key] = temp_path_info_inner_arr;
	});
	
	var iddd = addLoadingImage($("#send_message"), "before");
	$str = $("form#send_message_form").serialize();
	$.ajax({
		url : "/" + PROJECT_NAME + "mail/send-mail",
		method : "POST",
		data : {"str": $str,"temp_path_info_arr":temp_path_info_arr,"imail_type":'forward'},
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			if(jsonData == "success")
			{
				window.location.href = "/" + PROJECT_NAME + "mail/inbox";
				
			}			
		}
	});
}

/**
 * 
 * ajax to rply a mail
 * @author Shaina
 */
function sendmails(){
	
	// for updating ckditor i.e. sending ckeditor data in serialised form data
	for (instance in CKEDITOR.instances) {
        CKEDITOR.instances[instance].updateElement();
    }
	
	var temp_path_info_arr = {};
	var temp_path_info_inner_arr = {};
	
	$.each( $("div.template-download span.file_attachments"), function( key, value ) {

		temp_path_info_inner_arr = {};
		temp_path_info_inner_arr.ts_file_name 			= $(this).attr("ts_file_name");
		temp_path_info_inner_arr.ts_file_size 			= $(this).attr("ts_file_size");
		temp_path_info_arr['index_'+key] = temp_path_info_inner_arr;
	});
	
	var iddd = addLoadingImage($("#send_messages"), "before");
	$str = $("form#send_message_forms").serialize();
	$.ajax({
		url : "/" + PROJECT_NAME + "mail/send-rply-mail",
		method : "POST",
		data : {"str": $str,"temp_path_info_arr":temp_path_info_arr},
		type : "post",
		dataType : "json",
		beforeSend: function() {
			$("span#"+iddd).remove();
			$("form#send_message_form").trigger('reset');
			$("div.alert-box").remove();
			$("#receiver_id").tokenInput("clear");
			// hide attachments records
			$(".files").css("display","none");
			$("div.mail-sendmsg-outer").slideUp();
			$('#subjects').focus();	
	        },
		success : function(jsonData) {
			if(jsonData == "success")
			{
				showDefaultMsg( "Mail sent.", 1 );	
			}			
		}
	});
}

/**
 * add contacts popup,
 * fetches and show up contacts
 * to add directly to send message.
 * 
 * @author Jsingh7
 * @version 1.0
 */
function ShowContactsPopup()
{
	ajax_call = jQuery.ajax({
        url: "/" + PROJECT_NAME + "mail/get-my-links",
        type: "POST",
        dataType: "json",
        data: {},
        timeout: 50000,
        success: function(jsonData) {
        	__removeOverlay();
        	accessHtml = "";
        	var counter = 0;
        	accessHtml += '<ul><li><label><span><input type="checkbox" id = "gmail_main_cb" name="gmail_main_cb" value="" /></span><span><b>Select All</b></span></label></li></ul>';
        	accessHtml += '<ul>';
    		for( i in jsonData )
    		{
    			accessHtml += '<li class = "mail_contacts">';
    			accessHtml += '<span class = "import_cb">';
    			accessHtml += '<input type="checkbox" class = "gmail_cb" name="emails[]" value="'+i+'" rel = "'+ jsonData[i].user_id +'" rel1 = "'+ jsonData[i].first_name +'" rel2 = "'+ jsonData[i].last_name +'" rel3 = "'+ jsonData[i].email +'" />';
    			accessHtml += '</span>';
    			accessHtml += "<div style = 'width:25px; height:25px; display:inline-block;margin:0 0 4px 0;'><div style = 'width:25px; height:25px; display : table-cell; vertical-align: middle; text-align: center;'>" + "<img style = 'max-width : 25px; max-height : 25px;' src='" + jsonData[i].prof_image + "' title='" + jsonData[i].first_name + " " + jsonData[i].last_name + "'/></div></div>" + "<div style='display: inline-block; padding-left: 10px;'><div class='full_name'>" + jsonData[i].first_name + " " + jsonData[i].last_name + "</div><div class='email'>" + jsonData[i].email + "</div></div></li>";
            	counter++;
    		}
    		accessHtml += '</ul>';
    		
            $("#modal_contacts").html(accessHtml);
        	
        	$('#gmail_popup').bPopup({
        	    easing: 'easeOutBack', //uses jQuery easing plugin
                speed: 1000,
				closeClass : 'close_bpopup',
                transition: 'slideDown',
                onOpen: function() {
                }, 
    		},
        	function() {
    			//Checking/unchecking checkboxes
            	$("div#modal_contacts ul li input#gmail_main_cb").click(function(){
            		var isAllChecked = isAllCBChecked("div#modal_contacts ul li input.gmail_cb");
            		if( isAllChecked == 1)
            		{
            			$("div#modal_contacts ul li input.gmail_cb").prop("checked", false);
            		}
            		else
            		{	
            			$("div#modal_contacts ul li input.gmail_cb").prop('checked', true);
            		}
            		if( isAtLeastOneCheckboxChecked( "input.gmail_cb" ) == true )
            		{
            			$("input#gmail_import_btn").fadeIn();
            		}
            		else
            		{
            			$("input#gmail_import_btn").hide();
            		}
            	});
            	$("div#modal_contacts ul li input.gmail_cb").click(function(){
            		var isAllChecked = isAllCBChecked("div#modal_contacts ul li input.gmail_cb");
            		if( isAllChecked == 1 )
            		{
            			$("div#modal_contacts ul li input#gmail_main_cb").prop('checked', true);
            		}	
            		else
            		{
            			$("div#modal_contacts ul li input#gmail_main_cb").prop('checked', false);
            		}
            		if( isAtLeastOneCheckboxChecked( "input.gmail_cb" ) == true )
            		{
            			$("input#gmail_import_btn").fadeIn();
            		}
            		else
            		{
            			$("input#gmail_import_btn").hide();
            		}
            	});
            	
            	if( counter < 0 )
            	{
            		$("#modal_contacts").html("<label>Oops! No contacts found to send message.</label>");
            	}
    		});
        }
	});
}

function show_inbox_msg_detail(msg_id, forward_show, reply_show)
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
        success: function(jsonData) {
        	var row = "";
        	var receivers = '';
        	var mailSubject = '';

        	if(jsonData.subject == "" || jsonData.subject == null){
        		$('#mail_detail_subject').text('No Subject');
        		
        	}else{
        		mailSubject = showCroppedText(jsonData.subject, 40);
        		$('#mail_detail_subject').text(mailSubject);
        		$('#mail_detail_subject').attr('title', jsonData.subject);
        		
        	}

			
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
			row += '</div>';
			row += '<div class="right">';
			row += '<div class="top">'+jsonData.created_at_date+'</div>';
			row += '<div class="mid">'+jsonData.created_at_time+'</div>';
			row += '</div>';
			row += '</div>';
			
			//Staring attachment part-------------------------
			if( jsonData.has_attachements ){
			
				row += '<div class="attachment-outer">';
				row += '<div class="attachment-inner">';
			
				// Looping attachments to display------------------
				for( var atchmts in jsonData.attachments ){
					
					row += '<div class="attachment-column">';
					row += '<a href="'+PUBLIC_PATH+'/imails/imail_'+jsonData.msg_id+'_'+jsonData.folder_id+'/'+jsonData.attachments[atchmts].name+'"  download="'+jsonData.attachments[atchmts].actual_name+'">';
					//row += '<a href="'+PUBLIC_PATH+'/imails/imail_'+jsonData.msg_id+'/'+jsonData.attachments[atchmts].name+'"  download="'+jsonData.attachments[atchmts].actual_name+'">';
					row += '<div class="attachment-column-lt">';
					row += '<img src="'+IMAGE_PATH+'/'+getAttachmentIconByExtention( jsonData.attachments[atchmts].ext )+'"/>';
					row += '</div>';
					row += '<div class="attachment-column-rt">';
					row += jsonData.attachments[atchmts].actual_name;
					row += '</div>';
					row += '</a>';
					row += '</div>';
				}
				// End Looping attachments to display------------------
				
				
				row += '</div>';
				row += '</div>';
			}
			//Ending attachment part-------------------------------
			
			row += '<div class="mail-content-outer">';
			row += '<div class="mail-content-mid">';
        	if(jsonData.contents == "" || jsonData.contents == null)
        	{
        	 row += ' ';	
        	}
        	else
        	{
        	 row += '<p>'+jsonData.contents+'</p>';
        	}
			row += '</div>';
			row += '<div class="mail-content-bot" id = "'+jsonData.msg_id+'_popup_menu_2">';
			row += '<ul>';
			if(jsonData.can_forward == 1)
			{
				row += '<li><a href="#" id="forward">Forward</a><img src="'+IMAGE_PATH+'/icon-forwad.png" width="13" height="14" align="absmiddle" /></li>';
			}
			if(jsonData.can_reply==1)
			{
				if(jsonData.msg_type == 4)
				{
					//case if user is replying to enquiry initiated from frontend
					if(jsonData.enquiry_id)
					{
					var type = 'enquiry';
					row += '<li><a href="javascript:void(0)" onclick = "openEnquiryForm('+"'"+jsonData.login_user_email+"'"+","+"'"+jsonData.enquiry_id+"'"+","+"'"+type+"'"+');" >Reply</a><img width="16" height="16" align="absmiddle" src="'+IMAGE_PATH+'/icon-reply.png"></li>'
					}
					else // case if user replying to admin compose enquiry from imail section
					{
					var type = 'msg';
					row += '<li><a href="javascript:void(0)" onclick = "openEnquiryForm('+"'"+jsonData.login_user_email+"'"+","+"'"+jsonData.msg_id+"'"+","+"'"+type+"'"+');" >Reply</a><img width="16" height="16" align="absmiddle" src="'+IMAGE_PATH+'/icon-reply.png"></li>'	
					}
				}
				else
				{
					row += '<li><a href="javascript:;" id="rply">Reply</a><img width="16" height="16" align="absmiddle" src="'+IMAGE_PATH+'/icon-reply.png"></li>';	
				}
				//row += '<li><a href="#" id="rply">Reply</a><img width="16" height="16" align="absmiddle" src="'+IMAGE_PATH+'/icon-reply.png"></li>';
			}
			row += '<li><a href="javascript:;" class = "delete_archive" rel = "'+jsonData.msg_id+'">Delete</a><img src="'+IMAGE_PATH+'/icon-trash-hover.png" width="14" height="16" align="absmiddle" /></li>';
			row += '</ul>';
			row += '</div>';
            // Forward Div start here
			row += '<div class="mail-sendmsg-outer" id="mail-sendmsg-outer1" style="padding:0px;width:100%;display:none;">';
			row += '<form name="send_message_form" id="send_message_form" action="" method="post" >';
			row += '<input type="hidden" name="msg_type" value="'+MSG_TYPE_GENERAL+'" >';
			row += '<div class="mail-sendmsg-col1">';
			row += '<div class="left-mail-sendmsg-col1-fwd">';
			row += '</div>';
			row += '<div class="right"><a id="send_message" class="text-purple-link" href="javascript:;">Send Message</a><img src="'+IMAGE_PATH+'/mail-hover.png"  align="absmiddle" /></div>';
			row += '</div>';
            row += '<div style="display:none;" id="receiver_ids_holder">';
            row += ' </div>';
            row += '<div class="mail-sendmsg-col2">';
            row += '<span class="mail-span">';
            row += '<input name="receiver_id" id="receiver_id" type="text" class="forward_to_field"/>';
            row += '<a id="mail_contacts_popup" href="javascript:;"><img src="'+IMAGE_PATH+'/search-user-icon.png" title = "Add recipients" /></a>';
            row += ' </span>';
        	if(jsonData.Subject == "" || jsonData.Subject == null)
        	{
       		  row += '<span class="mail-span"><input name="subject" id="subject" type="text" maxlength="255" value="FW: " />';
       		}
        	else
        	{
        		if( jsonData.subject.substr(0, 3) == 'FW:' )
        		{
        			row += '<span class="mail-span"><input name="subject" id="subject" type="text" value="'+jsonData.subject+'" />';
        		}
        		else
        		{	
        			row += '<span class="mail-span"><input name="subject" id="subject" type="text" value="FW: '+jsonData.subject+'" />';
        		}
       		}

            row += '</span>';
            row += '<script type="text/javascript">';
            row += '</script>';
            row += ' </div>';
            row += ' <div class="mail-sendmsg-col2-content">';
            row += ' <textarea name="message_body" id="message_body" class="textarea" style="width:94%; border:none; min-height:170px; resize:none;" cols="" rows="">';
            row += '\r\n \r\n</br> ';
            row += ' ----</br> ';  
            row += '\r\n From: ' +jsonData.sender_firstname+' '+jsonData.sender_lastname+'</br>';
            row += '\r\n Sent: '+jsonData.created_at_date+' '+jsonData.created_at_time+'</br>';
            if(jsonData.reciever_names.length > 40){
           	 row += '\r\n To: '+jsonData.reciever_names.substr(0, 30)+ "..."+'</br>';
		    	 	
		    }
		    else{
		    	row += '\r\n To: '+jsonData.reciever_names+'</br>';
		    }

        	if(jsonData.Subject == "" || jsonData.Subject == null){
        		row += '\r\n Subject: ';
        		
        	}else{
        		 row += '\r\n Subject:' +jsonData.Subject;
        		
        	}

            row += '</br> ----</br>\r\n';
        	if(jsonData.contents == "" || jsonData.contents == null){
        		row += '\r\n';
        		
        	}else{
        		 row += '\r\n' +jsonData.contents;
        		
        	}
            row += ' </textarea>';
            row += ' </div>';
            row += ' <div class="mail-save-draft">';
            row += '<div class="fr fr_cancel"><a id="cancel" class="text-purple-link" href="javascript:;">Clear</a></div>';
            row += '  </div>';
            row += ' </form>';
            row += '</div>';
            // Forward Div end here
			
            //Reply div starts
			row += '<div class="mail-sendmsg-outer" id="mail-sendmsg-outer2" style="padding:0px;width:100%;display:none;">';
			row += '<form name="send_message_forms" id="send_message_forms" action="" method="post" >';
			row += '<input type="hidden" name="msg_type" value="'+MSG_TYPE_GENERAL+'" >';
			row += '<div class="mail-sendmsg-col1">';
			row += '<div class="left-mail-sendmsg-col1-rply">';
			row += '</div>';
			row += '<div class="right"><a id="send_messages" class="text-purple-link" href="javascript:;">Send Message</a><img src="'+IMAGE_PATH+'/mail-hover.png" align="absmiddle" /></div>';
			row += '</div>';
            row += '<div style="display:none;" id="receiver_ids_holders">';
            row += ' </div>';
            row += '<div class="mail-sendmsg-col2">';
            row += '<span class="mail-span" >';
            row += '<input name="receiver_ids" id="receiver_ids" type="text" value=""	class="reply_to_field"/>';
            row += '<a id="mail_contacts_popups" href="javascript:;"><img src="'+IMAGE_PATH+'/search-user-icon.png" title = "Add recipients"/></a>';
            row += ' </span>';
        	if(jsonData.Subject == "" || jsonData.Subject == null){
        		row += '<span class="mail-span" ><input name="subjects" id="subjects" type="text" maxlength="255" value="RE: " />';
       		
        	}else{
        		if( jsonData.subject.substr(0, 3) == 'RE:' )
        		{	
        			row += '<span class="mail-span"><input name="subjects" id="subjects" type="text" value="'+jsonData.subject+'" />';
        		}
        		else
        		{
        			row += '<span class="mail-span"><input name="subjects" id="subjects" type="text" value="RE: '+jsonData.subject+'" />';
        		}
       		
        	}

           // row += '<span><input name="subjects" id="subjects" type="text" value="RE: '+jsonData.subject+'" />';
            //row += '<a title="Reset Subject" id="reset_subjects" href="javascript:;"><img src="'+IMAGE_PATH+'/icon-reload.png" width="16" height="16" /></a>';
            row += '</span>';
            row += '<script type="text/javascript">';
            row += '</script>';
            row += ' </div>';
            row += ' <div class="mail-sendmsg-col2-content">';
            row += '<textarea name="message_bodys" id="message_bodys" class="textarea" style="width:94%;border: medium none; resize: none;min-height:170px;" cols="8" rows="4">';
            row += '\r\n \r\n</br> ';
            row += ' ----</br> ';
            row += '\r\n From: ' +jsonData.sender_firstname+' '+jsonData.sender_lastname+'</br>';
            row += '\r\n Sent: '+jsonData.created_at_date+' '+jsonData.created_at_time+'</br>';
            if(jsonData.reciever_names.length > 40){
           	 row += '\r\n To: '+jsonData.reciever_names.substr(0, 30)+ "..."+'</br>';
		    	 	
		    }
		    else{
		    	row += '\r\n To: '+jsonData.reciever_names+'</br>';
		    }

            //row += '\r\n To: '+jsonData.reciever_names;
        	if(jsonData.Subject == "" || jsonData.Subject == null){
        		row += '\r\n Subject: ';
        		
        	}else{
        		 row += '\r\n Subject:' +jsonData.Subject;
        		
        	}
       
            //row += '\r\n Subject: '+jsonData.subject+'';
            row += '</br> ----</br>\r\n';
        	if(jsonData.contents == "" || jsonData.contents == null){
        		row += '\r\n';
        		
        	}else{
        		 row += '\r\n' +jsonData.contents;
        		
        	}
           
            row	+= '</textarea>';
           // row += ' <textarea name="message_bodys" id="message_bodys" class="textarea" style="width:100%; border:none; min-height:170px; resize:none;" cols="" rows="">'+jsonData.contents+'</textarea>';
            row += ' </div>';
            row += ' <div class="mail-save-draft">';
            row += '<div class="fr fr_cancel"><a id="cancels" class="text-purple-link" href="javascript:;">Clear</a> </div>';
            row += '  </div>';
            row += ' </form>';
            row += '</div>';
            //rply div end
            row += '</div>';
          //mail-content-outer end
            row += '<div id="dialog_confirm" title="Alert">';
            row += '<p>';
            row += '<span class="ui-icon ui-icon-info" style="float: left; margin: 0 7px 50px 0;"></span>Please enter Receiver name!';
            row += '</p>';
            row += '</div>';
			$("div#detial_msg_holder").html(row);
			
			//Apply condition with the help of hidden field.
			
			// if mail content is shared photos i.e group_photos/wallpost 
			// then check if post is deleted then show content is removed else
			// apply function to form collage from photos.
			// Added by hkau5
			if($("input[type=hidden]#is_collage").length == 1)
			{
				
				if(jsonData.nail_thumbs_exist)
				{
					formCollage();
				}
				else
				{
					$('a.post-individual-outer').append('<div class="content_removed" style=""  >Content has been removed.</div>');
					
					$('div.dashboard-sharelink-column a.go_to_detail_page').empty();
					$('div.news-update-content').remove('div.dashboard-sharelink-column a.go_to_detail_page');
					$('div.dashboard-sharelink-icon').siblings('div').append('<div class="content_removed" >Content has been removed.</div>');
				}
			}
			
			__removeOverlay();
			$("div#msg_listing").hide();
    		$("div#detailed_msg").fadeIn("slow");
    		
    		//Marking inbox item read on openning its detail, with jquery only and rest of the code is in ajax call action. //by Jsingh7
    		$("div.row_holder#"+msg_id).removeClass("unread");
    		//showing appropriate menu options.
    		$("div#"+msg_id+"_popup_menu_2 li a.mark_read").hide();
    		$("div#"+msg_id+"_popup_menu_2 li a.mark_unread").show();
    		
    		$("a#forward").click(function(){
				if(CKEDITOR.instances['message_body'] == undefined) {
					//Apply CKeditor
					CKEDITOR.replace('message_body', {
						width: 592,
						uiColor: '#6C518F',
						toolbar: [
							{
								name: 'basicstyles',
								items: ['Bold', 'Italic', 'TextColor', "BGColor", 'NumberedList', 'BulletedList']
							},
							{name: 'tools', items: ['Maximize', '-']},
						],
						removePlugins: 'elementspath',
						on: {
							'instanceReady': function (evt) {

								var tags = ['p', 'ol', 'ul', 'li']; // etc.

								for (var key in tags) {
									evt.editor.dataProcessor.writer.setRules(tags[key],
										{
											indent: false,
											breakBeforeOpen: false,
											breakAfterOpen: false,
											breakBeforeClose: false,
											breakAfterClose: false
										});
								}
								//Set the focus to your editor
								CKEDITOR.instances.message_body.focus();
							}
						},
					});
				}
    			$("div#mail-sendmsg-outer1").slideToggle();  
    			$("div#mail-sendmsg-outer2").hide();  
    			
    			$("div#reply_attachment").css("display", "none"); 
    			$("div#forward_attachment").css("display", "block");
    			$('#forward_attachment').insertAfter('#detial_msg_holder');
    			$("div.left-mail-sendmsg-col1-fwd").empty();
    			$("div.left-mail-sendmsg-col1-fwd").html($("div#forward_attachment"));

				discardTempFilesforReply();
				addFilesToBeForwarded(jsonData);//Adding code to attach files to be forwarded.
    			
    		});
    		$("a#rply").click(function(){
				$("div#mail-sendmsg-outer2").slideToggle();
				$("div#mail-sendmsg-outer1").hide();

				// show attachment code
				$("div#forward_attachment").css("display", "none");
				$("div#reply_attachment").css("display", "block");
				$('#reply_attachment').insertAfter('#detial_msg_holder');

				$("div.left-mail-sendmsg-col1-rply").empty();
				$("div.left-mail-sendmsg-col1-rply").html($("div#reply_attachment"));

				discardTempFilesforForward();
				if(CKEDITOR.instances['message_bodys'] == undefined) {
					CKEDITOR.replace('message_bodys', {
						width: 592,
						uiColor: '#6C518F',
						toolbar: [
							{
								name: 'basicstyles',
								items: ['Bold', 'Italic', 'TextColor', "BGColor", 'NumberedList', 'BulletedList']
							},
							{name: 'tools', items: ['Maximize', '-']},
						],
						removePlugins: 'elementspath',
						on: {
							'instanceReady': function (evt) {

								var tags = ['p', 'ol', 'ul', 'li']; // etc.

								for (var key in tags) {
									evt.editor.dataProcessor.writer.setRules(tags[key],
										{
											indent: false,
											breakBeforeOpen: false,
											breakAfterOpen: false,
											breakBeforeClose: false,
											breakAfterClose: false
										});
								}
								//Set the focus to your editor
								CKEDITOR.instances.message_bodys.focus();
							}
						},
					});
				}

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
    			minChars: 1,
    			propertyToSearch: "first_name",
    			propertyToSearch: "last_name",
    			resultsFormatter: function(item){ return "<li><div style = 'width:25px; height:25px; display:inline-block;margin:0 0 4px 0;'><div style = 'width:25px; height:25px; display : table-cell; vertical-align: middle; text-align: center;'>" + "<img style = 'max-width : 25px; max-height : 25px;' src='" + item.url + "' title='" + item.first_name + " " + item.last_name + "'/></div></div>" + "<div style='display: inline-block; padding-left: 10px;'><div class='full_name'>" + item.first_name + " " + item.last_name + "</div><div class='email'>" + item.email + "</div></div></li>" },
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
    			minChars: 1,
    			propertyToSearch: "first_name",
    			propertyToSearch: "last_name",
    			resultsFormatter: function(item){ return "<li><div style = 'width:25px; height:25px; display:inline-block;margin:0 0 4px 0;'><div style = 'width:25px; height:25px; display : table-cell; vertical-align: middle; text-align: center;'>" + "<img style = 'max-width : 25px; max-height : 25px;' src='" + item.url + "' title='" + item.first_name + " " + item.last_name + "'/></div></div>" + "<div style='display: inline-block; padding-left: 10px;'><div class='full_name'>" + item.first_name + " " + item.last_name + "</div><div class='email'>" + item.email + "</div></div></li>" },
    			tokenFormatter: function(item) { return "<li><p>" + item.first_name + " " + item.last_name + "</p></li>" },
    		});

        	//Clicking on indiviual sent trash. //by Sgandhi
        	$(" div.mail-content-bot ul li a.delete_archive").click(function(){
        		var msg_id = $(this).attr("rel");
        		var iddd = addLoadingImage( $(this), "before");
        		jQuery.ajax({
        			url: "/" + PROJECT_NAME + "mail/move-archive-msg-to-trash",
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
				clearForwardAttachmentFormData();
			});
			////for rply cancel
			$("#cancels").click(function() {
				clearReplyFormData();
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

    		//------------------------------------------
    		// click forward from list archive mails page
    		if( forward_show == 1 )
    		{
				if(CKEDITOR.instances['message_body'] == undefined) {
					CKEDITOR.replace('message_body', {
						width: 592,
						uiColor: '#6C518F',
						toolbar: [
							{
								name: 'basicstyles',
								items: ['Bold', 'Italic', 'TextColor', "BGColor", 'NumberedList', 'BulletedList']
							},
							{name: 'tools', items: ['Maximize', '-']},
						],
						removePlugins: 'elementspath',
						on: {
							'instanceReady': function (evt) {

								var tags = ['p', 'ol', 'ul', 'li']; // etc.

								for (var key in tags) {
									evt.editor.dataProcessor.writer.setRules(tags[key],
										{
											indent: false,
											breakBeforeOpen: false,
											breakAfterOpen: false,
											breakBeforeClose: false,
											breakAfterClose: false
										});
								}
								//Set the focus to your editor
								CKEDITOR.instances.message_body.focus();
							}
						},
					});
				}
    			$("div#mail-sendmsg-outer1").slideToggle();  
    			$("div#mail-sendmsg-outer2").hide();  
    			
    			$("div#reply_attachment").css("display", "none"); 
    			$("div#forward_attachment").css("display", "block");
    			$('#forward_attachment').insertAfter('#detial_msg_holder');
    			$("div.left-mail-sendmsg-col1-fwd").empty();
    			$("div.left-mail-sendmsg-col1-fwd").html($("div#forward_attachment"));
    			
    			discardTempFilesforReply();
    			discardTempFilesforForward();
    		}
    		
    		// click reply from archive mails list page(outside mail detail)
	        if( reply_show == 1)
	        {
				if(CKEDITOR.instances['message_bodys'] == undefined) {
					//Apply CKeditor
					CKEDITOR.replace('message_bodys', {
						width: 592,
						uiColor: '#6C518F',
						toolbar: [
							{
								name: 'basicstyles',
								items: ['Bold', 'Italic', 'TextColor', "BGColor", 'NumberedList', 'BulletedList']
							},
							{name: 'tools', items: ['Maximize', '-']},
						],
						removePlugins: 'elementspath',
						on: {
							'instanceReady': function (evt) {

								var tags = ['p', 'ol', 'ul', 'li']; // etc.

								for (var key in tags) {
									evt.editor.dataProcessor.writer.setRules(tags[key],
										{
											indent: false,
											breakBeforeOpen: false,
											breakAfterOpen: false,
											breakBeforeClose: false,
											breakAfterClose: false
										});
								}
								//Set the focus to your editor
								CKEDITOR.instances.message_bodys.focus();
							}
						},
					});
				}
    			
    			$("div#mail-sendmsg-outer2").slideToggle(); 
    			$("div#mail-sendmsg-outer1").hide(); 
    			
    			// show attachment code
    			$("div#forward_attachment").css("display", "none"); 
    			$("div#reply_attachment").css("display", "block"); 
    			$('#reply_attachment').insertAfter('#detial_msg_holder');
    			
    			$("div.left-mail-sendmsg-col1-rply").empty();
    			$("div.left-mail-sendmsg-col1-rply").html($("div#reply_attachment"));
    			
    			discardTempFilesforReply();
    			discardTempFilesforForward();
    			
    			// adding tokens to "TO" field while replying a message.
    			$("input#receiver_ids").tokenInput("clear");
				$("input#receiver_ids").tokenInput( "add", {id : $("input#sender_info").attr("rel"), first_name: $("input#sender_info").attr("rel1"), last_name: $("input#sender_info").attr("rel2")} );
				
	        }

        }
	});
}


function clearForwardAttachmentFormData()
{
	$("form#send_message_form").trigger('reset');
	$('input#jq_receiver_id').attr('placeholder','To');
	$("#receiver_id").tokenInput("clear");
	$("#subject").focus(); //this is to for token input.
	$("div.mail-sendmsg-outer").slideUp();
	//Destory CKEditor
	if (CKEDITOR.instances['message_body']) {
		CKEDITOR.instances['message_body'].destroy();
	}
}

function clearReplyFormData()
{
	$("form#send_message_forms").trigger('reset');
	$("#receiver_ids").tokenInput("clear");
	$("#subjects").focus();  //this is to for token input.
	$("div.mail-sendmsg-outer").slideUp();
	//Destory CKEditor
	if (CKEDITOR.instances['message_bodys']) {
		CKEDITOR.instances['message_bodys'].destroy();
	}
}