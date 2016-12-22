$(document).ready(function(){

	//listing emails
	list_mails(1);

	//Back to listing
	$("a#back_to_mail_list_inbox").click(function(){
		$("div#detailed_msg").hide();
		$("div#msg_listing").fadeIn("slow");
		clearForwardAttachmentFormData();
	});

	//pagination click
	$('.pagination_nav').on('click','li.active', function(){
        var page = $(this).attr('p');
        if( $( "div.mail-hdr-search input[name=mails_search]" ).val().length > 0 )
        {
        	listSearchedMails( page, $( "div.mail-hdr-search input[name=mails_search]" ).val() );
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




	//Clicking on multi-trash //by jsingh7
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
	        url: "/" + PROJECT_NAME + "mail/move-sent-msg-to-trash",
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

	//Clicking on multi-archive //by Sgandhi
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
	        url: "/" + PROJECT_NAME + "mail/move-sent-msg-to-archive",
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
	 $('#sent_mails_search').on('keypress', function(e){
		if(e.which == 13 )
			{  //Enter is key 13
			listSearchedMails( 1, $("div.mail-hdr-search input[name=mails_search]").val() );
			}
	});

	// Clicking on search button.
	$("a#search_sent_items").click(function(){
		if($( "div.mail-hdr-search input[name=mails_search]" ).val().length <= 0 )
		{
			alert( "Please enter some text to search!" );
			return;
		}
		listSearchedMails( 1, $("div.mail-hdr-search input[name=mails_search]").val() );
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

function goBackToSentMails()
{
	$( "div.mail-hdr-search input[name=mails_search]" ).val("");
	list_mails(1);
}

/**
 * lists sent emails.
 *
 * @author RSHARMA
 * @version 1.0
 */
function list_mails(page)
{
	//listing mails in inbox by jsingh7
	//$("div#mail_holder").html("<div style = 'text-align:center;' class = 'loading'><span style ='margin-top: 25px; display: inline-block;'><img src = '/"+PROJECT_NAME+"public/images/loading_medium_purple.gif' ></img></div></div>");
	__addOverlay();
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "mail/get-my-sent-items",
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
	        		row += '<div class="go_to_detail read" id = "'+jsonData.records[i].id+'">';
	        		row += '<div class="go_to_detail-image">';
	        		row += '<input name="received_mail_ids[]" class="fl mail_list_cb" type="checkbox" value="'+jsonData.records[i].id+'" />';
	        		row += '<div class ="mail-img-listing">';
		        	row += '<div class="go_to_detail-imagebox" style = "display: table-cell; width: 50px; height: 50px; vertical-align: middle; text-align: center;" user_id="'+jsonData.records[i].msg_receiver_id+'">';
		        	row += '<img src="'+jsonData.records[i].prof_image+'"  />';
		        	row += '</div>';
		        	row += '</div>';
		        	row += '</div>';
		        	row += '<div class="go_to_detail-text mid" id = "'+jsonData.records[i].id+'" >';
	        		row += '<a id = "'+jsonData.records[i].id+'" class="text-purple2" href="javascript:;" style="font-size:14px;text-decoration: none;"><h4 class="font-arial">'+showCroppedText( jsonData.records[i].sender_firstname+' '+jsonData.records[i].sender_lastname, 35 )+'</h4></a>';
	    		    //row += '<a style="text-decoration: none !important;" href="/'+PROJECT_NAME+'profile/iprofile/id/'+jsonData.records[i].sender_id+'">'+jsonData.records[i].sender_firstname+" "+jsonData.records[i].sender_lastname+'</a>';

	        		if(jsonData.records[i].subject == "" || jsonData.records[i].subject == null){
	        			row += '<p><a id = "'+jsonData.records[i].id+'" class="font-arial text-purple-link text-purple2" href="javascript:;" style="font-size:14px;"><i>No Subject</i></a></p>';
	        		}
	        		else
    		    	{
	        			row += '<p><a id = "'+jsonData.records[i].id+'" class="fon-arial text-purple-link text-purple2" title="'+jsonData.records[i].subject+'" href="javascript:;" style="font-family:arial !important;font-size:14px;">'+showCroppedText(jsonData.records[i].subject , 45)+'</a></p>';

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

		        	//row += '</h4><p><a id = "'+jsonData.records[i].id+'" class="text-purple-link go_to_detail" href="javascript:;" style="font-size:14px;">'+jsonData.records[i].subject+'</a></p>';
	        		row += '</div>';
	        		row += '<div class="go_to_detail-time right">';
	        		row += '<div class="go_to_detail-time-top">'+jsonData.records[i].created_at+'</div>';
	        		//Attachement Clip.
	        		if( parseInt(jsonData.records[i].num_of_attachments) > 0 )
	        		{
	        			row += '<div class="attachment-clip"><img src="'+IMAGE_PATH+'/attachment-clip.png" /></div>';
	        		}
	        		row += '<div class="go_to_detail-time-bot"><a href="javascript:;" class = "popup_menu_2_arrow" rel = "'+jsonData.records[i].id+'"><img src="'+IMAGE_PATH+'/arrow-down-lightgrey.png" width="14" height="9" /></a>';
	//              <!-- Pop up -->
	        		row += '<div style=" margin-top:5px; margin-left:-140px;" class="manage-pop2-outer">';
	        		row += '<div class="manage-pop2 popup_menu_2 closed" id = "'+jsonData.records[i].id+'_popup_menu_2" style = "display:none;">';
	                row += '<ul>';

	        		row += '<li><a id = "'+jsonData.records[i].id+'" class = "forward" href="javascript:;">Forward</a></li>';
	        		row += '<li><a href="javascript:;" class = "delete_sent" rel = "'+jsonData.records[i].id+'">Delete</a></li>';
	        		row += '<li><a href="javascript:;" class = "archive_sent" rel = "'+jsonData.records[i].id+'">Archive</a></li>';
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
        		row += '<div class="no_messages-img"><img src="'+IMAGE_PATH+'/folder-empty2.png"></div>';
        		row += '<div class="no_messages-data">This folder is empty</div>';
        		row += '</div>';
        	}

        	row = $(row);
        	$("div#mail_holder").html(row);
        	$("div.pagination_nav").html(jsonData.pagination);

        	__removeOverlay();

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
        		show_sent_msg_detail($(this).attr("id"));
        	});
        	//end message detail

        	//Forward click in list.
        	$("div#mail_holder a.forward").click(function(){
        		show_sent_msg_detail($(this).attr("id"), 1, 0);
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
        	//Clicking on indiviual archive. //by jsingh7
        	$("div.manage-pop2 ul li a.archive_sent").click(function(){
        		var msg_id = $(this).attr("rel");
        		var iddd = addLoadingImage( $(this), "after");
        		jQuery.ajax({
        			url: "/" + PROJECT_NAME + "mail/move-sent-msg-to-archive",
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

        	//Clicking on indiviual sent trash. //by Sgandhi
        	$("div.manage-pop2 ul li a.delete_sent").click(function(){
        		var msg_id = $(this).attr("rel");
        		var iddd = addLoadingImage( $(this), "after");
        		jQuery.ajax({
        			url: "/" + PROJECT_NAME + "mail/move-sent-msg-to-trash",
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
        url: "/" + PROJECT_NAME + "mail/get-my-searched-sent-items",
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
	        	row += '<span style = "float:right;"> <b>Search Results</b> <label style = "margin-right : 10px; cursor:pointer;" onclick = "goBackToSentMails();">[Go Back To Sent Mails]</label></span>';
	        	row += '</div>';
	        	for( i in jsonData.records )
        		{
	//              <!-- col1 Starts -->
	        		row += '<div class="go_to_detail row_holder read" id = "'+jsonData.records[i].id+'">';
	        		row += '<div class="go_to_detail-image">';
	        		row += '<input name="received_mail_ids[]" class="fl mail_list_cb" type="checkbox" value="'+jsonData.records[i].id+'" />';
	        		row += '<div class ="mail-img-listing">';
		        	row += '<div class="go_to_detail-imagebox" style = "display: table-cell; width: 50px; height: 50px; vertical-align: middle; text-align: center;" user_id="'+jsonData.records[i].msg_receiver_id+'">';
		        	row += '<img src="'+jsonData.records[i].prof_image+'"/>';
		        	row += '</div>';
		        	row += '</div>';
		        	row += '</div>';
		        	row += '<div class="go_to_detail-text mid" id = "'+jsonData.records[i].id+'" >';
	        		row += '<a id = "'+jsonData.records[i].id+'" class="text-purple2" href="javascript:;" style="font-size:14px;text-decoration: none;"><h3 class="font-arial" >'+showCroppedText( jsonData.records[i].sender_firstname+' '+jsonData.records[i].sender_lastname, 35 )+'</h3></a>';

	    		    //row += '<a style="text-decoration: none !important;" href="/'+PROJECT_NAME+'profile/iprofile/id/'+jsonData.records[i].sender_id+'">'+jsonData.records[i].sender_firstname+" "+jsonData.records[i].sender_lastname+'</a>';

	        		if(jsonData.records[i].subject == "" || jsonData.records[i].subject == null)
	        		{
	        			row += '<p><a id = "'+jsonData.records[i].id+'" class="text-purple2 text-purple-link font-arial" href="javascript:;" style="font-size:14px;"><i>No Subject</i></a></p>';
	        		}
	        		else
    		    	{
	        			row += '<p><a id = "'+jsonData.records[i].id+'" class="text-purple2 text-purple-link font-arial" href="javascript:;" style="font-family:arial !important;font-size:14px;">'+showCroppedText(jsonData.records[i].subject, 45)+'</a></p>';
    		    	}

	        		row += '<p class="">';
	        		row += '<a id = "'+jsonData.records[i].id+'" class="text-purple-link text-purple2 font-weight-normal font-arial" href="javascript:;" style="font-size:14px;">';
	        		row += showCroppedText(jsonData.records[i].content, 150);
	        		row += '</a>';
	        		row += '</p>';
		        	//row += '</h4><p><a id = "'+jsonData.records[i].id+'" class="text-purple-link go_to_detail" href="javascript:;" style="font-size:14px;">'+jsonData.records[i].subject+'</a></p>';
	        		row += '</div>';
	        		row += '<div class="go_to_detail-time right">';
	        		row += '<div class="go_to_detail-time-top">'+jsonData.records[i].created_at+'</div>';

	        		//Attachement Clip.
	        		if( parseInt(jsonData.records[i].num_of_attachments) > 0 )
	        		{
	        			row += '<div class="attachment-clip"><img src="'+IMAGE_PATH+'/attachment-clip.png" /></div>';
	        		}
	        		row += '<div class="go_to_detail-time-bot"><a href="javascript:;" class = "popup_menu_2_arrow" rel = "'+jsonData.records[i].id+'"><img src="'+IMAGE_PATH+'/arrow-down-lightgrey.png" width="14" height="9" /></a>';
	//              <!-- Pop up -->
	        		row += '<div style=" margin-top:5px; margin-left:-140px;" class="manage-pop2-outer">';
	        		row += '<div class="manage-pop2 popup_menu_2 closed" id = "'+jsonData.records[i].id+'_popup_menu_2" style = "display:none;">';
	                row += '<ul>';

	        		row += '<li><a id = "'+jsonData.records[i].id+'" class = "forward" href="javascript:;">Forward</a></li>';
	        		row += '<li><a href="javascript:;" class = "delete_sent" rel = "'+jsonData.records[i].id+'">Delete</a></li>';
	        		row += '<li><a href="javascript:;" class = "archive_sent" rel = "'+jsonData.records[i].id+'">Archive</a></li>';
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
	        	row += '<span style = "float:right;"> <b>Search Results</b> <label style = "margin-right : 10px; cursor:pointer;" onclick = "goBackToSentMails();">[Go Back To Sent Mails]</label></span>';
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
				show_sent_msg_detail($(this).attr("id"));
			});
			//end message detail

			//reply click in list.
			$("div#mail_holder a.rply").click(function(){
				show_sent_msg_detail($(this).attr("id"), 0, 1);
			});
			//End reply click in list.

			//Forward click in list.
			$("div#mail_holder a.forward").click(function(){
				show_sent_msg_detail($(this).attr("id"), 1, 0);

			});

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
        	//Clicking on indiviual archive. //by jsingh7
        	$("div.manage-pop2 ul li a.archive_sent").click(function(){
        		var msg_id = $(this).attr("rel");
        		var iddd = addLoadingImage( $(this), "after");
        		jQuery.ajax({
        			url: "/" + PROJECT_NAME + "mail/move-sent-msg-to-archive",
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

        	//Clicking on indiviual sent trash. //by Sgandhi
        	$("div.manage-pop2 ul li a.delete_sent").click(function(){
        		var msg_id = $(this).attr("rel");
        		var iddd = addLoadingImage( $(this), "after");
        		jQuery.ajax({
        			url: "/" + PROJECT_NAME + "mail/move-sent-msg-to-trash",
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
        if (jsonData)
        {
	        	__removeOverlay();
	        	accessHtml = "";
	        	var counter = 0;
	        	accessHtml += '<ul class="select-all-contacts-ul" ><li><label><span><input type="checkbox" id = "gmail_main_cb" name="gmail_main_cb" value="" /></span><span><b>Select All</b></span></label></li></ul>';
	        	accessHtml += '<ul>';
	    		for( i in jsonData )
	    		{
	    			accessHtml += '<li class = "mail_contacts">';
	    			accessHtml += '<span class = "import_cb">';
	    			accessHtml += '<input type="checkbox" class = "gmail_cb" name="emails[]" value="'+i+'" rel = "'+ jsonData[i].user_id +'" rel1 = "'+ jsonData[i].first_name +'" rel2 = "'+ jsonData[i].last_name +'" rel3 = "'+ jsonData[i].email +'" />';
	    			accessHtml += '</span>';
	    			accessHtml += "<div class='contact_img'><div style = 'width:25px; height:25px; display : table-cell; vertical-align: middle; text-align: center;'>" + "<img style = 'max-width : 25px; max-height : 25px;' src='" + jsonData[i].prof_image + "' title='" + jsonData[i].first_name + " " + jsonData[i].last_name + "'/></div></div>" + "<div style='display: inline-block; padding-left: 10px;'><div class='full_name'>" + showCroppedText(jsonData[i].first_name + " " + jsonData[i].last_name, 15 ) + "</div><div class='email'>" + jsonData[i].email + "</div></div></li>";
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
        	else
        	{
        		__removeOverlay();
        		$("div.message_box").remove();
        		showDefaultMsg( "You do not have any links. You may search a person to add him/her to send link request.", 1 );
        	}
        }
	});
}

function show_sent_msg_detail(msg_id, forward_show)
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
			var mailSubject = '';
			if(jsonData.subject == "" || jsonData.subject == null){
				$('#mail_detail_subject').text('No Subject');

			}else{
				mailSubject = showCroppedText(jsonData.subject, 40);
				$('#mail_detail_subject').text(mailSubject);
				$('#mail_detail_subject').attr('title', jsonData.subject);

			}
			var receivers = "";
			var row = "";
			row += '<div class="mail-grey-hdr-col1">';
			row += '<div class="left">';
			row += '<div style = "display: inline-block; width:60px; height:60px;">';
			row += '<div style = "display:table-cell;">';
			row += '<img src="'+jsonData.sender_prof_image+'" width="60" height="60"  />';
			row += '</div>';
			row += '</div>';
			row += '</div>';
			row += '<div class="mid">';
			row += '<h4 class="mail-user-title">'+jsonData.sender_firstname+' '+jsonData.sender_lastname+'</h4>';
			row += '<input id="sender_info" type="hidden" rel="'+jsonData.msg_sender_id+'" value="" rel1="'+jsonData.sender_firstname+'" rel2="'+jsonData.sender_lastname+'">';

			if(jsonData.reciever_names.length > 40){
				receivers += jsonData.reciever_names.substr(0, 50)+ "...";
			}
			else{
				receivers += jsonData.reciever_names;
			}
			row += '<p title = "'+jsonData.reciever_names+'">To: ';
			row += jsonData.reciever_names;
			row += '</p>';

			//	row += '<p>'+jsonData.subject+'</p>';
			row += '</div>';
			row += '<div class="right">';
			row += '<div class="top">'+jsonData.created_at_date;
			row += '</div>';
			row += '<div class="mid">'+jsonData.created_at_time;
			row += '</div>';
//			row += '<div class="bot">&nbsp;</div>';
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
				row += '<p>'+(jsonData.contents)+'</p>';

			}

			row += '</div>';
			row += '<div class="mail-content-bot" id = "'+jsonData.msg_id+'_popup_menu_2">';
			row += '<ul>';
			row += '<li><a href="#" class = "archive_sent" rel = "'+jsonData.msg_id+'">Archive</a><img src="'+IMAGE_PATH+'/folder-hover.png" width="16" height="13" align="absmiddle" /></li>';
			if(jsonData.can_forward == 1)
			{
				row += '<li><a href="javascript:;" id="forward">Forward</a><img src="'+IMAGE_PATH+'/icon-forwad.png" width="13" height="14" align="absmiddle" /></li>';
			}
			if(jsonData.can_reply == 1)
			{

			}


			row += '<li><a href="javascript:;" class = "delete_inbox" rel = "'+jsonData.msg_id+'">Delete</a>';
			//row += '<img src="'+IMAGE_PATH+'/icon-trash-hover.png" width="14" height="16" align="absmiddle" /></li>';
			row += '</ul>';
			row += '</div>';

			// Forward Div starts here
			row += '<div class="mail-sendmsg-outer" id="mail-sendmsg-outer1" style="padding:0px;width:100%;display:none;">';
			row += '<form name="send_message_form" id="send_message_form" action="" method="post" >';
			row += '<input type="hidden" name="msg_type" value="'+MSG_TYPE_GENERAL+'" >';
			row += '<div class="mail-sendmsg-col1">';
			row += '<div class="left-mail-sendmsg-col1-fwd">';
			row += '</div>';
			row += '<div class="right"><a id="send_message" class="text-purple-link" href="javascript:;">Send Message</a><img src="'+IMAGE_PATH+'/mail-hover.png"  align="absmiddle" />';
			row += '</div>';
			row += '</div>';
			row += '<div style="display:none;" id="receiver_ids_holder">';
			row += ' </div>';
			row += '<div class="mail-sendmsg-col2">';

			row += '<span class="mail-span" >';
			row += '<input placeholder="To" name="receiver_id" id="receiver_id" type="text" class = "forward_to_field"/>';
			row += '<a id="mail_contacts_popup" href="javascript:;"><img src="'+IMAGE_PATH+'/search-user-icon.png" title = "Add recipients" style="margin:0 0 0 0px;"/></a>';
			row += ' </span>';

			if(jsonData.subject == "" || jsonData.subject == null)
			{
				row += '<span class="mail-span" ><input name="subject" id="subject" type="text" maxlength="255" value="FW: " />';
			}
			else
			{
				if( jsonData.subject.substr(0, 3) == 'FW:' )
				{
					row += '<span class="mail-span" ><input name="subject" id="subject" type="text" value="'+jsonData.subject+'" />';
				}
				else
				{
					row += '<span class="mail-span" ><input name="subject" id="subject" type="text" value="FW: '+jsonData.subject+'" />';
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
			row += '\r\n From: ' +jsonData.sender_firstname+' '+jsonData.sender_lastname+'</br> ';
			row += '\r\n Sent: '+jsonData.created_at_date+' '+jsonData.created_at_time+'</br> ';
			if(jsonData.reciever_names.length > 40){
				row += '\r\n To: '+jsonData.reciever_names.substr(0, 30)+ "..."+'</br> ';

			}
			else{
				row += '\r\n To: '+jsonData.reciever_names+'</br> ';
			}
			if(jsonData.subject == "" || jsonData.subject == null){
				row += '\r\n Subject : ';

			}else{
				row += '\r\n Subject : ' +jsonData.subject;

			}

			//row += '\r\n Subject: '+jsonData.subject+'';
			row += '</br> ----</br>\r\n';
			if(jsonData.contents == "" || jsonData.contents == null){
				row += '\r\n';

			}else{
				row += '\r\n' +jsonData.contents;

			}

			// row += '\r\n' +jsonData.contents;
			row += ' </textarea>';
			row += ' </div>';
			row += ' <div class="mail-save-draft">';
			row += '<div class="fr fr_cancel"><a id="cancel" class="text-purple-link" href="javascript:;">Clear</a> </div>';
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
			row += '<div class="right"><a id="send_messages" class="text-purple-link" href="javascript:;">Send Message</a><img src="'+IMAGE_PATH+'/mail-hover.png" align="absmiddle" />';
			//row += '<a onclick="openAttachmentForm();" class="text-purple-link" href="javascript:;"><img src="'+IMAGE_PATH+'/attachment-clip.png" align="absmiddle" /></a>';
			row += '</div>';
			row += '</div>';
			row += '<div style="display:none;" id="receiver_ids_holders">';
			row += '</div>';
			row += '<div class="mail-sendmsg-col2">';
			row += '<span class="mail-span">';
			row += '<input name="receiver_ids" id="receiver_ids" type="text" value=""	class="reply_to_field"/>';
			row += '<a id="mail_contacts_popup" href="javascript:;"><img src="'+IMAGE_PATH+'/search-user-icon.png" title = "Add recipients"style="margin:0 0 0 0px;"/></a>';
			row += ' </span>';

			if(jsonData.subject == "" || jsonData.subject == null){
				row += '<span class="mail-span"><input placeholder="subject" name="subjectsss" id="subjects" type="text" maxlength="255" value="RE: " />';

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

			row += '</span>';
			row += '<script type="text/javascript">';
			row += '</script>';
			row += '</div>';

			row += ' <div class="mail-sendmsg-col2-content">';
			row += '<textarea placeholder="Your message here" name="message_bodys" id="message_bodys" class="textarea" style=" width:94%;border: medium none; resize: none;min-height:170px;" cols="8" rows="4">';

			row += '</br>\r\n \r\n';
			row += '-----</br>';
			row += '\r\n'+jsonData.final_date_time+', '+jsonData.sender_firstname+' '+jsonData.sender_lastname+' wrote:';
			row += '</br>\r\n-----</br>';

			row += '\r\n';
			if(jsonData.contents == "" || jsonData.contents == null){
				row += '\r\n';

			}else{
				row += '\r\n' +jsonData.contents;

			}

			row	+= '</textarea>';
			row += ' </div>';
			row += ' <div class="mail-save-draft">';
			row += '<div class="fr fr_cancel">';
			row += '<a id="cancels" class="text-purple-link" href="javascript:;">Clear</a>';
			row += '</div>';
			row += '</div>';
			row += '</form>';
			row += '</div>';


			//Reply div end here

			row += '</div>';
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

					//--- To be removed.
					$('div.dashboard-sharelink-column a.go_to_detail_page').empty();
					$('div.news-update-content').remove('div.dashboard-sharelink-column a.go_to_detail_page');
					$('div.dashboard-sharelink-icon').siblings('div').append('<div class="content_removed" >Content has been removed.</div>');
				}
			}

			$("input#jq_receiver_id").attr('placeholder','To');
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

				discardTempFilesforReply();
				discardTempFilesforForward();
				$("div#mail-sendmsg-outer1").slideToggle();
				$("div#mail-sendmsg-outer2").hide();


				$("div#reply_attachment").css("display", "none");
				$("div#forward_attachment").css("display", "block");
				$('#forward_attachment').insertAfter('#detial_msg_holder');
				$("div.left-mail-sendmsg-col1-fwd").empty();
				$("div.left-mail-sendmsg-col1-fwd").html($("div#forward_attachment"));


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
				resultsFormatter: function(item){ return "<li><div style = 'width:25px; height:25px; display:inline-block;margin:0 0 4px 0; '><div style = 'width:25px; height:25px; display : table-cell; vertical-align: middle; text-align: center;'>" + "<img style = 'max-width : 25px; max-height : 25px;' src='" + item.url + "' title='" + item.first_name + " " + item.last_name + "'/></div></div>" + "<div style='display: inline-block; padding-left: 10px;'><div class='full_name'>" + item.first_name + " " + item.last_name + "</div><div class='email'>" + item.email + "</div></div></li>" },
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
			//Clicking on indiviual archive.
			$("div.mail-content-bot ul li a.archive_sent").click(function(){
				var msg_id = $(this).attr("rel");
				var iddd = addLoadingImage( $(this), "before");
				jQuery.ajax({
					url: "/" + PROJECT_NAME + "mail/move-sent-msg-to-archive",
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
					url: "/" + PROJECT_NAME + "mail/move-sent-msg-to-trash",
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

			// send button click and validation on composing message by Ritu
			//forward
			$("#send_message").click(function() {
				if( $('input.forward_to_field').siblings('ul.token-input-list-facebook').children('li.token-input-token-facebook').length < 1 ){
					$( "#dialog_confirm" ).dialog( "open" );
				}else{
					sendmail();
				}
			});
			//Reply
			$("#send_messages").click(function() {
				if( $('input.reply_to_field').siblings('ul.token-input-list-facebook').children('li.token-input-token-facebook').length < 1 ){
					$( "#dialog_confirm" ).dialog( "open" );
				}else{
					sendmails();
				}
			});

			$("#cancel").click(function() {
				clearForwardAttachmentFormData();
			});


			$("#reset_subject").click(function() {
				$("#subject").val("");
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
						$('#jq_receiver_id').attr('placeholder','To');
					}
				}
			});

			//for mail contacts popup -----------------
			$('a#mail_contacts_popup').click( function(){
				__addOverlay();
				ShowContactsPopup();
			});


			//add attchment popup -----------------
			$('a#add_attachment').click( function(){
				__addOverlay();
				ShowAddAttachmentPopup();
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

			// click forward from inbox mails list page(outside mail detail)
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
				discardTempFilesforForward();
			}

			//Adding code to attach files to be forwarded.
			addFilesToBeForwarded(jsonData);

		}
	});
}
function clearForwardAttachmentFormData()
{
	$("form#send_message_form").trigger('reset');
	$('input#jq_receiver_id').attr('placeholder','To');
	$("#receiver_id").tokenInput("clear");
	$("#subject").focus();
	$("div.mail-sendmsg-outer").slideUp();

	//Destory CKEditor
	if (CKEDITOR.instances['message_body']) {
		CKEDITOR.instances['message_body'].destroy();
	}
}