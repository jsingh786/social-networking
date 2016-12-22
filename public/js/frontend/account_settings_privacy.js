$(document).ready(function(){
	//No option selected dialog-box.
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
	        	$('select#dropdown_albums').focus();
	        }
	      }
	});
	
	/* Account-Settings: Privacy dropdows by @author ssharma4 */
	if($('select#dropdown_view_profile').length > 0)
	{
		$("select#dropdown_view_profile").selectBoxIt({theme: "jqueryui"});
	}
	if($('select#dropdown_albums').length > 0)
	{
		$("select#dropdown_albums").selectBoxIt({theme: "jqueryui"});
	}

	//To show popup when custom option is selected in dropdown(album privacy).
	$('select#dropdown_albums').change(function(){
		if( $(this).getSetSSValue() == 4 )
		{
			__addOverlay();
			ShowCustomPopup();
			
		}
		
	});

	$("input#privacy_settings_save_changes").click(function(){
	if ( $("select#dropdown_albums").val()== 4  && $("input[name='emails[]']:checked:enabled").length == 0 )
		{
		showDefaultMsg( "You have not selected any links to set custom privacy. Please select atleast one link.", 2 );
		}
	else if(
			(
			$("select#dropdown_albums").val()== 1 
			|| $("select#dropdown_albums").val()== 2 
			|| $("select#dropdown_albums").val()== 3
			|| $("select#dropdown_albums").val()== 4
			)
			||
			(
			$("select#dropdown_view_profile").val()== 0
			|| $("select#dropdown_view_profile").val()== 1
			)
		)
		{
		$(this).hide();
		var selected_option_album = $("select#dropdown_albums").val();
		var selected_option_view_profile = $("select#dropdown_view_profile").val();
		var thiss = $(this);
		
		var loading_img = addLoadingImage( $(this), "before", 'loading_small_purple.gif', 75, 17  );
		$.ajax(
		{
			async: false,
			url : "/" + PROJECT_NAME + "account-settings/change-privacy-settings",
			method : "POST",
			data :{"privacy_album" : selected_option_album, "privacy_view_profile" : selected_option_view_profile},
			type : "post",
			dataType : "json",
			success : function(jsonData)
			{                    
				if(jsonData==1)
				{
					$("span#"+loading_img).remove();
					$(thiss).fadeIn();
					showDefaultMsg( "Privacy settings have been saved.", 1 );
				}
			}
		});
	
		}
		});

	
	//To add album privacy's custom pop up's checked links in database on ajax call.
	$(document).on('click', "div.select_custom_viewers form#email_contacts_form #gmail_import_btn", function()
	{
		$(this).hide();
		var loading_img = addLoadingImage( $(this), "before", 'loading_medium_purple.gif',28, 42, "links_listing" );
		var usersList = "";
		var total = $("input[name='emails[]']:checked:enabled").length;
		$("input[name='emails[]']:checked:enabled").each(function(index)
		{
			if (index === total - 1) 
			{
		        // this is the last one
				usersList += $(this).attr('rel');
		    }
			else
			{	
				usersList += $(this).attr('rel')+",";
			}
		});
		$.ajax({
			url : "/" + PROJECT_NAME + "account-settings/set-custom-viewer-albums",
			method : "POST",
			data :{ "custom_viewer" : usersList },
			type : "post",
			dataType : "json",
			success : function(jsonData)
			{
				$("span#"+loading_img).remove();
				if(jsonData == 1)
				{
					$('div#gmail_popup.select_custom_viewers').bPopup().close();
				}
				else
				{
					showDefaultMsg("Some error has occured. Please select custom user again.",2);
				}
				$("div#gmail_popup").removeClass("select_custom_viewers");			
			},
			error : function(jsonData)
			{
				$("div#gmail_popup").removeClass("select_custom_viewers");			
			}
		});			
	});
	
	$("h3.sub-heading-arial-narrow#blocked_users_header").click(function(){
		$("div.settings-labelspan-outer#blocked_users_div").slideToggle( "", invertArrow );
	});
	
	//Opening links listing popup.
	$('a#mail_contacts_popup').click( function(){
		__addOverlay();
		ShowContactsPopup();
	});
	
	
	//token input for blocking users(links only)
	//Token input---------------
	$("input#to_be_blocked").tokenInput(PROJECT_URL+PROJECT_NAME+"mail/get-my-matching-contacts", {
		onAdd: function (item) {
			$("div#to_be_blocked_ids_holder").append("<input type = 'hidden' name = 'to_be_blocked_ids[]' class = 'font-arial to_be_blocked_ids' id = '"+item.id+"' value = '"+item.id+"'>");
			$("#jq_receiver_id").attr('placeholder','');
		},
		onDelete: function (item) {
			$('div#to_be_blocked_ids_holder input#'+item.id).remove();
		},
		theme: "facebook",
		minChars: 1,
		propertyToSearch: "first_name",
		propertyToSearch: "last_name",
		resultsFormatter: function(item){ return "<li><div style = 'width:25px; height:25px; display:inline-block;margin: 3px 0 1px;'> <div style = 'width:25px; height:25px; display : table-cell; vertical-align: middle; text-align: center;'>" + "<img style = 'max-width : 25px; max-height : 25px;' src='" + item.url + "' title='" + item.first_name + " " + item.last_name + "'/></div></div>" + "<div style='display: block; margin-top: -29px; padding-bottom: 4px; padding-left: 28px;'><div class='full_name'>" + item.first_name + " " + item.last_name + "</div><div class='email'>" + item.email + "</div></div></li>" },
		tokenFormatter: function(item) { return "<li><p>" + item.first_name + " " + item.last_name + "</p></li>" },
	});
	
	// adding tokens to 'To' field to block users
	$(document).on('click', "div.populate_to_block form#email_contacts_form #gmail_import_btn", function(){
		$("input[name='emails[]']:checked:enabled",'form#email_contacts_form').each(function( index ) {
			$("input#to_be_blocked").tokenInput("add", {id : $(this).attr("rel"), first_name: $(this).attr("rel1"), last_name: $(this).attr("rel2")});
		});
		$('div#gmail_popup.populate_to_block').bPopup().close();
		$("div#gmail_popup").removeClass("populate_to_block");
	});
	
	$("input#block_user_btn").click( function(){
		block_users();
	});
	
	//Unblocking users.
	$(document).on('click', "div#blocked_users label.text-black span.clickable", function()
	{
		var thiss = $(this);
		thiss.html("Unblocking...");
		jQuery.ajax(
		{
	        url: "/" + PROJECT_NAME + "account-settings/unblock-users",
	        type: "POST",
	        dataType: "json",
	        data: { user_to_be_unblocked : $(this).attr("id") },
	        timeout: 50000,
	        success: function(jsonData) {
	        	if( jsonData.length != 0 )
	        	{
	        		for( i in jsonData )
	        		{
	        			$( "span#"+jsonData[i] ).parents("label.text-black").siblings("span.text-black#"+jsonData[i]).remove();
	        			$( "span#"+jsonData[i] ).parents("label.text-black").remove();
	        		}	
	        	}
	        	thiss.html("unblock");
	        },
	        error: function()
	        {
	        	showDialogMsg( "Unblock User", "An error occured while unblocking! We will fix it soon.", 5000, 	{
    		    buttons: [
    		  	        {
    		  	            text: "OK",
    		  	            click: function(){
    		  	                $(this).dialog("close");
    		  	            }
    		  	        }
    		  	    ],
    		  	    show: {
    		  	        effect: "fade"
    		  	    },
    		  	    hide: {
    		  	        effect: "fade"
    		  	    },
    		  	    dialogClass: "general_dialog_message",
    		  	    height: 200,
    		  	    width: 300
    		  	});
	        	
	        	thiss.html("unblock");
	        }
		});
		
	});
	
});

function invertArrow()
{
	var arrow = $( "img#block_users_dropdown_arrow" );
	if( $(this).is(":visible") )
	{
		arrow.css( "-ms-transform", "rotate(0deg)" );
		arrow.css( "-webkit-transform", "rotate(0deg)" );
		arrow.css( "transform", "rotate(0deg)" );
	}
	else
	{
		arrow.css( "-ms-transform", "rotate(180deg)" );
		arrow.css( "-webkit-transform", "rotate(180deg)" );
		arrow.css( "transform", "rotate(180deg)" );
	}	
}

/**
 * Send users ids to be blocked 
 * to server.
 * 
 * @author Jsingh7
 * @version 1.0
 */
function block_users()
{
	var user_to_be_blocked = [];
	$( "input.to_be_blocked_ids" ).each(function( index ) {
		user_to_be_blocked.push( $(this).val() );
	});
	
	if( user_to_be_blocked.length === 0 )
	{
		showDialogMsg( "Block Users", "You have not entered any user.", 3000, 	{
		    buttons: [
		  	        {
		  	            text: "OK",
		  	            click: function(){
		  	                $(this).dialog("close");
		  	            }
		  	        }
		  	    ],
		  	    show: {
		  	        effect: "fade"
		  	    },
		  	    hide: {
		  	        effect: "fade"
		  	    },
		  	    dialogClass: "general_dialog_message",
		  	    height: 150,
		  	    width: 300
		  	});
	}
	else
	{	
	
		$("input#block_user_btn").attr( "disabled", "disabled" );
		$("input#block_user_btn").css( "background", "none repeat scroll 0 0 #EFEFEF" );
		$("input#block_user_btn").css( "color", "grey" );
		
		jQuery.ajax(
		{
	        url: "/" + PROJECT_NAME + "account-settings/block-users",
	        type: "POST",
	        dataType: "json",
	        data: { users_to_be_blocked : jQuery.unique(user_to_be_blocked) },
	        timeout: 50000,
	        success: function(jsonData) {
	        	if( jsonData != 0 )
	        	{
	        		var html = "";
	        		for( i in jsonData )
	        		{
	        			html += '<label class="text-black"><span class = "clickable" id = "'+jsonData[i]['id']+'">Unblock</span></label>';
	        			html += '<span id = "'+jsonData[i]['id']+'" class="text-black" style="text-transform:none !important;line-height: 20px; !important" >'+jsonData[i]['name']+' - '+jsonData[i]['email']+'</span>';
	        		}
	        		$("div#blocked_users").append( html );
	        		
	        	}
	        	$("input#to_be_blocked").tokenInput("clear");
	        	$("div.token-input-dropdown-facebook").hide();
	        },
	        error: function()
	        {
	        	showDialogMsg( "Block Users", "An error occured while blocking! We will fix it soon.", 5000, 	{
	    		    buttons: [
	    		  	        {
	    		  	            text: "OK",
	    		  	            click: function(){
	    		  	                $(this).dialog("close");
	    		  	            }
	    		  	        }
	    		  	    ],
	    		  	    show: {
	    		  	        effect: "fade"
	    		  	    },
	    		  	    hide: {
	    		  	        effect: "fade"
	    		  	    },
	    		  	    dialogClass: "general_dialog_message",
	    		  	    height: 200,
	    		  	    width: 300
	    		  	});
	        	$("input#to_be_blocked").tokenInput("clear");
	        	$("div.token-input-dropdown-facebook").hide();
	        }
		});
		$("input#block_user_btn").removeAttr( "disabled" );
		$("input#block_user_btn").css( "background", "none repeat scroll 0 0 #6c518f" );
		$("input#block_user_btn").css( "color", "#FFFFFF" );
	}
}

/**
 * add contacts popup,
 * to block users.
 * 
 * @author Jsingh7
 * @version 1.0
 */
function ShowContactsPopup()
{
	ajax_call = jQuery.ajax(
	{
        url: "/" + PROJECT_NAME + "mail/get-my-links",
        type: "POST",
        dataType: "json",
        data: {},
        timeout: 50000,
        success: function(jsonData) {
        	if( jsonData )
        	{
	        	__removeOverlay();
	        	accessHtml = "";
	        	var counter = 0;
	        	accessHtml += '<ul class="select-all-contacts-ul"><li><label><span><input type="checkbox" id = "gmail_main_cb" name="gmail_main_cb" value="" /></span><span><b>Select All</b></span></label></li></ul>';
	        	accessHtml += '<ul>';
	        	
		    		for( i in jsonData )
		    		{
		    			
		    			accessHtml += '<li class = "mail_contacts">';
		    			accessHtml += '<span class = "import_cb">';
		    			accessHtml += '<input type="checkbox" class = "gmail_cb" name="emails[]" value="'+i+'" rel = "'+ jsonData[i].user_id +'" rel1 = "'+ jsonData[i].first_name +'" rel2 = "'+ jsonData[i].last_name +'" rel3 = "'+ jsonData[i].email +'" />';
		    			accessHtml += '</span>';
		    			accessHtml += "<div class='contact_img'><div style = 'width:25px; height:25px; display : table-cell; vertical-align: middle; text-align: center;'>" + "<img style = 'max-width: 25px; max-height: 25px; border: medium none ! important;' src='" + jsonData[i].prof_image + "' title='" + jsonData[i].first_name + " " + jsonData[i].last_name + "'/></div></div>" + "<div style='display: inline-block; padding-left: 10px;'><div class='full_name'>" +showCroppedText( jsonData[i].first_name+ " " +jsonData[i].last_name, 15) + "</div><div class='email'>" + jsonData[i].email + "</div></div></li>";
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
	                onClose: function() {
	                	//Removing special class
	                	$("div#gmail_popup").removeClass("populate_to_block");
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
	            	
	            	//Adding special class
	            	$("div#gmail_popup").addClass("populate_to_block");
	            	
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


/**
 * List links to select them for custom
 * privacty settings of album.
 * @author hkaur5
 * @version 1.0
 */
function ShowCustomPopup()
{
	ajax_call = jQuery.ajax(
	{
        url: "/" + PROJECT_NAME + "account-settings/get-my-links",
        type: "POST",
        dataType: "json",
        data: {},
        timeout: 50000,
        success: function(jsonData) {
        	if( jsonData.all_links !=""   )
        	{
	        	__removeOverlay();
	        	accessHtml = "";
	        	var counter = 0;
	        	accessHtml += '<ul class="select-all-contacts-ul" ><li><label><span><input type="checkbox" id = "gmail_main_cb" name="gmail_main_cb" value="" /></span><span><b>Select All</b></span></label></li></ul>';
	        	accessHtml += '<ul>';
	        	
		    		for( i in jsonData.all_links )
		    		{
		    			accessHtml += '<li class = "mail_contacts">';
		    			accessHtml += '<span class = "import_cb">';
//		    			if( jsonData['custom_set_links'][i].user_id )
		    			accessHtml += '<input type="checkbox" class = "gmail_cb" name="emails[]" value="'+i+'" rel="'+ jsonData.all_links[i]['user_id'] +'" />';
		    			accessHtml += '</span>';
		    			accessHtml += "<div class='contact_img'><div style = 'width:25px; height:25px; display : table-cell; vertical-align: middle; text-align: center;'>" + "<img style = 'max-width: 25px; max-height: 25px; border: medium none ! important;' src='" + jsonData['all_links'][i].prof_image + "' title='" + jsonData['all_links'][i].first_name + " " + jsonData['all_links'][i].last_name + "'/></div></div>" + "<div style='display: inline-block; padding-left: 10px;'><div class='full_name'>" + showCroppedText(jsonData['all_links'][i].first_name+ " " +jsonData['all_links'][i].last_name, 15)+ "</div><div class='email'>" + jsonData['all_links'][i].email + "</div></div></li>";
		    		  	
		    			counter++;
		    		}
	        	
	        
	    		accessHtml += '</ul>';
	    		
	      
	            $("#modal_contacts").html(accessHtml);
	        	//Marking checkboxes.
	            for( j in jsonData.custom_set_links )
	    		{
	            	$("#modal_contacts input[rel='"+jsonData.custom_set_links[j]['user_id']+"']").prop('checked', true);
	    		}
	            //Managing checkboxes.
	            var isAllChecked = isAllCBChecked("div#modal_contacts ul li input.gmail_cb");
        		if( isAllChecked == 1 )
        		{
        			$("div#modal_contacts ul li input#gmail_main_cb").prop('checked', true);
        		}	
        		else
        		{
        			$("div#modal_contacts ul li input#gmail_main_cb").prop('checked', false);
        		}
        		
	        	$('#gmail_popup').bPopup({
	        	    easing: 'easeOutBack', //uses jQuery easing plugin
	                speed: 1000,
	                transition: 'slideDown',
					closeClass : 'close_bpopup',
	                onOpen: function() {
	                }, 
	                onClose: function() {
	                	//Removing special class
		            	$("div#gmail_popup").removeClass("select_custom_viewers");
	                },
	    		},
	    	
	        	function() 
	        	{
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
	            		$("#modal_contacts").html("<label>Oops! No contacts found to set custom viewers.</label>");
	            	}
	    		});
	        	
	        	//Adding special class
            	$("div#gmail_popup").addClass("select_custom_viewers");
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