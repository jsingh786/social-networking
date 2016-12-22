$(document).ready(function(){

	//listing emails
	list_mails(1);
	
	//Back to listing
	$("a#back_to_mail_list").click(function(){
		$("div#detailed_msg").hide();
		$("div#msg_listing").fadeIn("slow");
	});
	//pagination click
	$('.pagination_nav').on('click','li.active', function(){
        var page = $(this).attr('p');
        list_mails(page);
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
    					//$("div#mail_holder div#"+$(this).val()).slideUp();
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

});

/**
 * lists inbox emails.
 * 
 * @author jsingh7
 * @version 1.0
 */
function list_mails(page)
{
	//listing mails in inbox by jsingh7
	__addOverlay();
	
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "mail/get-my-link-requests",
        type: "POST",
        dataType: "json",
        data: { 'page' : page },
        timeout: 50000,
        success: function(jsonData) {
        	//console.log(jsonData);
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
        			row += '<div class="mail-grey-hdr-col1 row_holder" id = "'+jsonData.records[i].id+'">';
        		}
        		else
        		{
        			row += '<div class="mail-grey-hdr-col1 row_holder unread" id = "'+jsonData.records[i].id+'">';
        		}	
        		row += '<div class="chkbx-img">';
        		row += '<input name="received_mail_ids[]" class="fl mail_list_cb" type="checkbox" value="'+jsonData.records[i].id+'" />';
        		row += '<div style = "display: inline-block;">';
	        	row += '<div style = "display:table-cell; width:50px; height:50px; vertical-align: middle; text-align: center;" user_id="'+jsonData.records[i].msg_sender_id+'">';
	        	row += '<img src="'+jsonData.records[i].prof_image+'" />';
	        	row += '</div>';
	        	row += '</div>';
	        	row += '</div>';
        		row += '<div class="mid">';
        		row += '<a id = "'+jsonData.records[i].id+'" class="go_to_detail" href="javascript:;" style="font-size:14px;text-decoration: none;"><h4>'+jsonData.records[i].sender_firstname+' '+jsonData.records[i].sender_lastname+'</h4></a>';

        		//row += '<a style="text-decoration: none !important;" href="/'+PROJECT_NAME+'profile/iprofile/id/'+jsonData.records[i].msg_sender_id+'"><h4>'+jsonData.records[i].sender_firstname+' '+jsonData.records[i].sender_lastname+'</h4>';
	        	row += '<p><a id = "'+jsonData.records[i].id+'" class="text-purple-link go_to_detail" href="javascript:;" style="font-size:14px;">'+jsonData.records[i].subject+'</a></p>';
        		row += '</div>';
        		row += '<div class="right">';
        		row += '<div class="top">'+jsonData.records[i].created_at+'</div>';
        		row += '<div class="mid"></div>';
        		row += '<div class="bot"><a href="javascript:;" class = "popup_menu_2_arrow" rel = "'+jsonData.records[i].id+'"><img src="'+IMAGE_PATH+'/arrow-down-blue.png" width="14" height="9" /></a>';
//              <!-- Popup -->
        		row += '<div style=" margin-top:5px; margin-left:-140px;" class="manage-pop2-outer">';
        		row += '<div class="manage-pop2 popup_menu_2 closed" id = "'+jsonData.records[i].id+'_popup_menu_2" style = "display:none;">';
                row += '<ul>';
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
        		row += '<li><a href="javascript:;" class = "archive" rel = "'+jsonData.records[i].id+'">Archive</a></li>';
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
        		row += '<div class="no_messages">No records to be displayed</div>';
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
        	$("div#mail_holder a.go_to_detail").click(function(){
        		show_inbox_msg_detail($(this).attr("id"));
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
        		        	$("div#"+msg_id+".mail-grey-hdr-col1").removeClass("unread");//show msg as read.
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
        					$("div#"+msg_id+".mail-grey-hdr-col1").addClass("unread");//show msg as read.
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
 * 
 * ajax to forward a mail
 * @author Ritu
 */
function sendmail(){
	var iddd = addLoadingImage($("#send_message"), "before");
	$str = $("form#send_message_form").serialize();
	$.ajax({
		url : "/" + PROJECT_NAME + "mail/send-mail",
		method : "POST",
		data : $str,
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			
			if(jsonData == "success")
			{
				$("span#"+iddd).remove();
				$("form#send_message_form").trigger('reset');
				$("div.alert-box").remove();
				showDefaultMsg( "Mail sent.", 1 );
				$("#receiver_id").tokenInput("clear");
				$("div.mail-sendmsg-outer").slideUp();
				$('#subject').focus();	
				
				
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
    			accessHtml += "<div style = 'width:25px; height:25px; display:inline-block;'><div style = 'width:25px; height:25px; display : table-cell; vertical-align: middle; text-align: center;'>" + "<img style = 'max-width : 25px; max-height : 25px;' src='" + jsonData[i].prof_image + "' title='" + jsonData[i].first_name + " " + jsonData[i].last_name + "'/></div></div>" + "<div style='display: inline-block; padding-left: 10px;'><div class='full_name'>" + jsonData[i].first_name + " " + jsonData[i].last_name + "</div><div class='email'>" + jsonData[i].email + "</div></div></li>";
            	counter++;
    		}
    		accessHtml += '</ul>';
    		
            $("#modal_contacts").html(accessHtml);
        	
        	$('#gmail_popup').bPopup({
        	    easing: 'easeOutBack', //uses jQuery easing plugin
                speed: 1000,
                transition: 'slideDown',
				closeClass : 'close_bpopup',
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

function show_inbox_msg_detail(msg_id)
{
	__addOverlay();
	
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "mail/get-msg-detail",
        type: "POST",
        dataType: "json",
        data: {'message_id':msg_id },
        timeout: 50000,
        success: function(jsonData) {
        	$('#mail_detail_subject').text(jsonData.subject);
			var row = "";
			row += '<div class="mail-grey-hdr-col1">';
			row += '<div class="left">';
			row += '<div style = "display: inline-block; width:60px; height:60px;">';
        	row += '<div style = "display:table-cell;">';
			row += '<img src="'+jsonData.sender_prof_image+'" width="60" height="60"  /></div>';
			row += '</div>';
			row += '</div>';
			row += '<div class="mid">';
			row += '<h4>'+jsonData.sender_firstname+' '+jsonData.sender_lastname+'</h4>';
		    row += '<p>To: ';
		    if(jsonData.reciever_names.length > 40){
		    	 row += jsonData.reciever_names.substr(0, 30)+ "...";	
		    }
		    else{
		    	 row += jsonData.reciever_names;	
		    }
		    row += '</p>';
        	//row += '<p>'+jsonData.subject+'</p>';
			row += '</div>';
			row += '<div class="right">';
			row += '<div class="top">'+jsonData.created_at_date+'</div>';
			row += '<div class="mid">'+jsonData.created_at_time+'</div>';
			row += '<div class="bot">&nbsp;</div>';
			row += '</div>';
			row += '</div>';
			row += '<div class="mail-content-outer">';
			row += '<div class="mail-content-mid">';
			row += '<p>'+jsonData.contents+'</p>';
			row += '</div>';
			row += '<div class="mail-content-bot" id = "'+jsonData.msg_id+'_popup_menu_2">';
			row += '<ul>';
			row += '<li><a href="#" class = "archive_feedback" rel = "'+jsonData.msg_id+'">Archive</a><img src="'+IMAGE_PATH+'/folder-hover.png" width="16" height="13" align="absmiddle" /></li>';
			//row += '<li><a href="#">Report as Spam</a><img src="'+IMAGE_PATH+'/icon-fire-purple.png" width="14" height="16" /></li>';
			row += '<li><a href="javascript:;" class = "delete_inbox" rel = "'+jsonData.msg_id+'">Delete</a><img src="'+IMAGE_PATH+'/icon-trash-hover.png" width="14" height="16" align="absmiddle" /></li>';
			row += '</ul>';
			row += '</div>';
			row += '</div>';
           
            
			$("div#detial_msg_holder").html(row);
			__removeOverlay();
			$("div#msg_listing").hide();
    		$("div#detailed_msg").fadeIn("slow");
    		
    		//Marking inbox item read on openning its detail, with jquery only and rest of the code is in ajax call action. //by Jsingh7
    		$("a#"+msg_id+".go_to_detail").parent().parent().parent($("div#"+msg_id)).removeClass("unread");
    		//showing appropriate menu options.
    		$("div#"+msg_id+"_popup_menu_2 li a.mark_read").hide();
    		$("div#"+msg_id+"_popup_menu_2 li a.mark_unread").show();
    		
        	//Clicking on indiviual archive. 
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

    		
        	//Clicking on indiviual trash. //by Sgandhi
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
//        					$("span#"+iddd).remove();
//        					$("div#detial_msg_holder").fadeOut();
//
//        					window.location.href = "/" + PROJECT_NAME + "mail/inbox";
        					$("span#"+iddd).remove();
        					//$("div#detial_msg_holder").fadeOut();
        					$("div#detailed_msg").hide();
        					$("div#msg_listing").fadeIn("slow");
        					$("div#mail_holder div#"+msg_id+".mail-grey-hdr-col1").fadeOut();
        					
        					$("div#mail_holder div#"+msg_id).slideUp();
        					//$("div#"+msg_id+"_detial_msg_holder").fadeOut();
        					//$("div#detial_msg_holder div#"+msg_id).slideUp();
        				}	
        			}
        		});
        	});

    		        }
	});
}