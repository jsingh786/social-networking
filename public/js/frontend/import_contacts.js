/**
 * JS code for importing contacts from Gmail and Yahoo
 * Note : gmail listing popup stucture has been re-used for yahoo listing popup. 
 * @author jsingh7
 */

//####################################################################
//Import gmail contacts by jsingh7 and dlverma########################
//####################################################################
var OAUTHURL    = 'https://accounts.google.com/o/oauth2/auth?';
var VALIDURL    = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
var SCOPE 		= 'https://www.google.com/m8/feeds/';
var CLIENTID    = GMAIL_CLIENTID;
var REDIRECT    = PROJECT_URL + PROJECT_NAME + 'links/import';
var LOGOUT 		= 'http://accounts.google.com/Logout';
var TYPE 		= 'token';
var _url	    = OAUTHURL + 'scope=' + SCOPE + '&client_id=' + CLIENTID + '&redirect_uri=' + REDIRECT + '&response_type=' + TYPE;
var acToken;
var tokenType;
var expiresIn;
var user;
var loggedIn = false;
var validator;


$(document).ready(function(){
	
	// Applying tabs
	 $(function() {
		 $( "div#tabs" ).tabs();
	 });
	
	//close popup   
	$('.close_popup').click(function(){
		$('div#gmail_popup').bPopup().close();
	});
	
	//caling gmail login function.
	$('#gmail').click(function(){
		gmailLogin();
	});
	
	//send email invitation button click.
	$("input#gmail_import_btn").click(function(){
		var idd = addLoadingImage( $(this), "before", "loading_medium_purple.gif", 95, 43 );
		$(this).hide();
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "links/send-invitation",
	        type: "POST",
	        dataType: "json",
	        data: $("div#gmail_popup form#email_contacts_form").serialize(),
	        timeout: 500000,
//	        timeout: 50000,
	        success: function(jsonData) {
	        	$("div.alert-box").remove();
				if( jsonData.total_sent <= 0 )
				{
					showDefaultMsg( jsonData.total_sent + " invitation(s) has been sent.", 3 );
				}
				else
				{
					showDefaultMsg( jsonData.total_sent + " invitation(s) has been sent.", 1 );				
				}	
				if( jsonData.failed )
				{
					showDefaultMsg( "!Error while sending invitation(s) on these email(s) : "+jsonData.failed, 2 );
				}
				$("span#"+idd).remove();
	        	$("input#gmail_import_btn").show();
	        	$('#gmail_popup').bPopup().close();
	        }
		});
	});
	
	//send invitation in the form of link request on button click.
	$("input#gmail_import_btn_2").click(function(){
		var idd = addLoadingImage($(this), "before", "loading_medium_purple.gif", 95, 43 );
		$(this).hide();
		
		var accepter_str = "";
		var len = $('input[type=checkbox].gmail_cb_2:checked').length;
		$('input[type=checkbox].gmail_cb_2:checked').each( function(index, element) 
		{
		    if (index != len - 1) {
		        accepter_str += $(this).val()+",";
		    }
		    else
		    {
		        accepter_str += $(this).val();
		    } 
		});
		
		jQuery.ajax({
			url: "/" + PROJECT_NAME + "links/invite-to-connect",
			type: "POST",
			dataType: "json",
			data: { 'accept_user' : accepter_str },
			timeout: 500000,
//	        timeout: 50000,
			error: function(){
				$("div.message_box").remove();
				showDefaultMsg( "Error while sending Link request(s). You may try again.", 2 );
				$("span#"+idd).remove();
				$("input#gmail_import_btn_2").show();
				$('#gmail_popup').bPopup().close();
	        },
			success: function(jsonData) {
				$("div.message_box").remove();
				if( jsonData == 1 )
				{	
					showDefaultMsg( "Link request(s) has been sent.", 1 );
					$("span#"+idd).remove();
					$("input#gmail_import_btn_2").show();
					$('#gmail_popup').bPopup().close();
				}
				else
				{
					showDefaultMsg( "Error while sending Link request(s). You may try again.", 2 );
					$("span#"+idd).remove();
					$("input#gmail_import_btn_2").show();
					$('#gmail_popup').bPopup().close();
				}	
			}
		});
	});
	
	//send invitation ( Invite by individual email )
	$("input#more_ways_to_connect_btn").click(function(){
		// validating first.
		validator = $( "form#more_ways_to_connect_frm" ).validate({
			rules: {
				more_ways_to_connect:{
					required : true,
					multiemail : true
				},
			}
		});
		if( $( "form#more_ways_to_connect_frm" ).valid() )
		{	
			sendInvitationIndividually( $(this) );
			$("form#more_ways_to_connect_frm").data('validator', null);
			$("form#more_ways_to_connect_frm").unbind('validate');
		}	
	});
});

function sendInvitationIndividually( elem )
{
	var idd = addLoadingImage(elem, "after",'loading_small_purple.gif', 35, 18 );
	jQuery.ajax({
		url: "/" + PROJECT_NAME + "links/send-invitation-individual",
		type: "POST",
		dataType: "json",
		data: { 'comma_sep_emails' : $("input#more_ways_to_connect").val() },
		timeout: 500000,
		success: function(jsonData) 
		{
			$("span#"+idd).remove();
			$("div.alert-box, div.alert-box1, div.alert-box2").remove();
			console.log(jsonData);
			if(jsonData.no_of_link_req_sent > 0)
			{
				showDefaultMsg( jsonData.no_of_link_req_sent+" link request(s) sent." );
			}
			if (jsonData.total_sent > 0)
			{
				showDefaultMsg( jsonData.total_sent + " invitation(s) has been sent.", 1 );
			}
			if(jsonData.no_invitations == 1)
			{
				showDefaultMsg( "Oops! no invitation(s) sent.", 2 );
			}
			
			if( jsonData.failed )
			{
				
				showDefaultMsg( "!Error while sending invitation(s) on these email(s) : "+jsonData.failed, 2 );
			}
		
			
			$("input#more_ways_to_connect").val("");
		}
	});
}


function gmailLogin(){
    var win         =   window.open(_url, "windowname1", 'width=500, height=400'); 
    var pollTimer   =   window.setInterval(function() {

	    try // try-catch added by jsingh7
	    {
	        if (win.document.URL.indexOf(REDIRECT) != -1) 
	        {
	            window.clearInterval(pollTimer);
	            var url =   win.document.URL;
	            acToken =   gup(url, 'access_token');
	            tokenType = gup(url, 'token_type');
	            expiresIn = gup(url, 'expires_in');
	            win.close();
	
	            validateToken(acToken);
	        }
	    }
	    catch(e)
	    {
	    	
	    }
    }, 1000);
}

function validateToken(token) {
    $.ajax({
        url: VALIDURL + token,
        data: null,
        success: function(responseText){  
            getUserInfo();
            loggedIn = true;
            $('#loginText').hide();
            $('#logoutText').show();
        },  
        dataType: "jsonp"  
    });
}

function getUserInfo(){
	 var contact_email;
	// var contacts_name;
	 var list_contact = [];
	// var contact_name=[];
	    $.ajax({
	        url: 'https://www.google.com/m8/feeds/contacts/default/full?access_token=' + acToken+'&alt=json' +  '&max-results=100000000',
	        data: null,
	        success: function(resp) {
	        //LISTING GMAIL CONTACTS.
	        	
	        	if( resp.feed.entry == undefined )
	        	{
	        		showDefaultMsg( "Error, No contacts found!", 2 );
	        		return false;
	        	}
	        	var contactarr = [];
	        	if(resp.feed.entry)
				{
	        	for (i in resp.feed.entry)
	        		{
	        			
	        			if(resp.feed.entry[i].gd$email != undefined)
	        			{
		        			//console.log(resp.feed.entry[i].gd$email[0].address);
		        			contactarr[i] =  resp.feed.entry[i].gd$email[0].address ;
	        			}
	        			
	        		}
	        	}
	        	
	        	// filter undefined elements from  array
	        	contactfilterarr = contactarr.filter(function(n){return n != undefined;}); 
	        
	        	// convert array to json
	        	var myJsonString = JSON.stringify(contactfilterarr);

	        	__addOverlay();
	        	jQuery.ajax({
	    	        url: "/" + PROJECT_NAME + "links/get-emails-from-google-response",
	    	        type: "POST",
	    	        dataType: "json",
	    	        data: { 'google_response' : myJsonString },
	    	        timeout: 500000,
//	    	        timeout: 50000,
	    	        success: function(jsonData) {
	    	        	__removeOverlay();
		        		//LISTING GMAIL CONTACTS OUTSIDE ILOOK.
		        		var counter = 0;
		            	$("div#modal_contacts div#tabs div#tabs-1 div#contacts").html("");
		            	var accessHtml = "";
		            	accessHtml += '<ul><li><label><span><input type="checkbox" id = "gmail_main_cb" name="gmail_main_cb" value="" /></span><span><b>Select All</b></span></label></li></ul>';
		            	accessHtml += '<ul>';
		        		for( i in jsonData.not_in_my_contacts )
		        		{
		        			if(jsonData.not_in_my_contacts[i])
		        			{
			        			accessHtml += '<li><label>';
				            	accessHtml += '<span class = "import_cb">';
				            	accessHtml += '<input type="checkbox" class = "gmail_cb" name="emails[]" value="'+jsonData.not_in_my_contacts[i]+'" />';
				            	accessHtml += '</span>';
					            	 if ( jsonData.not_in_my_contacts[i].length > 40 )
					            	 {
					            		 accessHtml += '<span class = "contacts" title="'+jsonData.not_in_my_contacts[i]+'"> '+jsonData.not_in_my_contacts[i].substr(0, 40)+ "..."+'</span>';
					            	 }else{
					            		 accessHtml += '<span class = "contacts" title="'+jsonData.not_in_my_contacts[i]+'"> '+jsonData.not_in_my_contacts[i]+'</span>';	 
					            	 }
				            	accessHtml += '</label></li>';
				            	counter++;
			            	}
		        		}
		        		accessHtml += '</ul>';
		                $("div#modal_contacts div#tabs div#tabs-1 div#contacts").html(accessHtml);
		                
		                //LISTING GMAIL CONTACTS ALREADY IN ILOOK.
		        		var counter_1 = 0;
		            	$("div#modal_contacts div#tabs div#tabs-2 div#contacts_n_ilook_users").html("");
		            	var accessHtml = "";
		            	accessHtml += '<ul><li><label><span><input type="checkbox" id = "gmail_main_cb_2" name="gmail_main_cb_2" value="" /></span><span><b>Select All</b></span></label></li></ul>';
		            	accessHtml += '<ul>';
		        		for( i in jsonData.in_my_contacts )
		        		{	
		        			accessHtml += '<li><label>';
			            	accessHtml += '<span class = "import_cb">';
			            	if( jsonData.in_my_contacts[i].link_info.friend_type == 0 )
			            	{	
			            		accessHtml += '<input type="checkbox" class = "gmail_cb_2" name="emails_in_ilook[]" value="'+jsonData.in_my_contacts[i].ilook_user_id+'" />';
			            	}	
			            	accessHtml += '</span>';
			            	accessHtml += '<div class = "contact_holder"><div class = "photo_holder"><div><img src = "'+jsonData.in_my_contacts[i].prof_image+'"/></div></div>';
			            	accessHtml += '<div class = "label_holder"><span>'+jsonData.in_my_contacts[i].fname+' '+jsonData.in_my_contacts[i].lname+'</span><br><span>'+jsonData.in_my_contacts[i].email+'</span>';
			            	accessHtml += '<br><span style = "color : #6C518F">';
			            	switch ( jsonData.in_my_contacts[i].link_info.friend_type ) 
			            	{
								case 0:
								break;
								case 1:
									accessHtml += 'Link request sent.';
								break;
								case 2:
									accessHtml += 'Link Request not accepted by you, yet.';
								break;
								case 3:
									accessHtml += 'Linked';
								break;
								default:
									accessHtml += 'Unable to find link status!';
								break;
							}
			            	
			            	accessHtml += '</span></div></div>';
			            	accessHtml += '</label></li>';
			            	counter_1++;
		        		}
		        		accessHtml += '</ul>';
		                $("div#modal_contacts div#tabs div#tabs-2 div#contacts_n_ilook_users").html(accessHtml);
		                
		        		$('#gmail_popup').bPopup({
		        			modalClose: false,
		            	    easing: 'easeOutBack', //uses jQuery easing plugin
	                        speed: 1000,
							closeClass : 'close_bpopup',
	                        transition: 'slideDown',
	                        onOpen: function() {
	                        	$("input#gmail_import_btn").hide();
	                        	$("input#gmail_import_btn_2").hide();
	                        }, 
		        		},
		        		function() {
		        			//Checking/unchecking checkboxes for tab 1
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
		                	
		                	//Checking/unchecking checkboxes for tab 2
		                	$("div#modal_contacts ul li input#gmail_main_cb_2").click(function(){
		                		var isAllChecked = isAllCBChecked("div#modal_contacts ul li input.gmail_cb_2");
		                		if( isAllChecked == 1)
		                		{
		                			$("div#modal_contacts ul li input.gmail_cb_2").prop("checked", false);
		                		}
		                		else
		                		{	
		                			$("div#modal_contacts ul li input.gmail_cb_2").prop('checked', true);
		                		}
		                		if( isAtLeastOneCheckboxChecked( "input.gmail_cb_2" ) == true )
		                		{
		                			$("input#gmail_import_btn_2").fadeIn();
		                		}
		                		else
		                		{
		                			$("input#gmail_import_btn_2").hide();
		                		}
		                	});
		                	$("div#modal_contacts ul li input.gmail_cb_2").click(function(){
		                		var isAllChecked = isAllCBChecked("div#modal_contacts ul li input.gmail_cb_2");
		                		if( isAllChecked == 1 )
		                		{
		                			$("div#modal_contacts ul li input#gmail_main_cb_2").prop('checked', true);
		                		}	
		                		else
		                		{
		                			$("div#modal_contacts ul li input#gmail_main_cb_2").prop('checked', false);
		                		}
		                		if( isAtLeastOneCheckboxChecked( "input.gmail_cb_2" ) == true )
		                		{
		                			$("input#gmail_import_btn_2").fadeIn();
		                		}
		                		else
		                		{
		                			$("input#gmail_import_btn_2").hide();
		                		}
		                	});
		                	
		                	if( counter == 0 )
		                	{
		                		$("div#modal_contacts div#tabs div#tabs-1 div#contacts").html("<label>Oops! No records found to import.</label>");
		                	}
		                	if( counter_1 == 0 )
		                	{
		                		$("div#modal_contacts div#tabs div#tabs-2 div#contacts_n_ilook_users").html("<label>Oops! No records found to import.</label>");
		                	}
		        		});
	    	        }
	        	});
	        }	
	    });
	}

//credits: http://www.netlobo.com/url_query_string_javascript.html
function gup(url, name) {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\#&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    if( results == null )
        return "";
    else
        return results[1];
}

function startLogoutPolling() {
    $('#loginText').show();
    $('#logoutText').hide();
    loggedIn = false;
    $('#uName').text('Welcome ');
    $('#imgHolder').attr('src', 'none.jpg');
}

function toggle(source) {
	  checkboxes = document.getElementsByName('import_contacts_email[]');
	  for(var i=0, n=checkboxes.length;i<n;i++) {
	    checkboxes[i].checked = source.checked;
	  }
	}

//####################################################################
//Import yahoo contacts by jsingh7 and dlverma########################
//####################################################################
$(document).ready(function(){
	var ajax_call;
	
	//close popup   
	$('.close_popup').click(function(){
		$('div#yahoo_login_popup').bPopup().close();
	});
	
	$("#yahoo").click(function(){
	
		showDialogMsg('Coming Soon!', "Coming Soon...", 6000,
					{
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
				    width: 200
					}		
				);
				return;
		/*$('#yahoo_login_popup').bPopup({
 	    	easing: 'easeOutBack', //uses jQuery easing plugin
            speed: 1000,
            transition: 'slideIn',
			closeClass : 'close_bpopup',
	    });*/
	});
	
	validator = $( "form#yahoo_login_form" ).validate({
		rules: {
			yahoo_email:{
				required : true
			},
			yahoo_pwd:{
				required : true
			}
		}
	});
	
	$("form#yahoo_login_form input#cancel_yahoo_auth").click(function(){
		if( ajax_call )
		{	
			ajax_call.abort();
			$("span.loading").remove();
			$("form#yahoo_login_form input#cancel_yahoo_auth").hide();
			$("div.forgot-password-content input#submit_yahoo_credentials").fadeIn("slow");
		}
	});
	
	//YAHOO AUTHENTICATION
	$("input#submit_yahoo_credentials").click(function(){
		if( $( "form#yahoo_login_form" ).valid() )
		{	
			var thiss = $(this);
			$("form#yahoo_login_form input#cancel_yahoo_auth").show();
			var idd = addLoadingImage($(this), "before", "loading_medium_purple.gif", 50, 32 );
			$(this).hide();
			ajax_call = jQuery.ajax({
		        url: "/" + PROJECT_NAME + "links/yahoo-authentication-and-get-emails",
		        type: "POST",
		        dataType: "json",
		        data: $("div.forgot-password-outer_1 form#yahoo_login_form").serialize(),
		        timeout: 500000,
		        error: function(){
		        	$("form#yahoo_login_form input#cancel_yahoo_auth").hide();
		        	$("span#"+idd).remove();
		        	thiss.fadeIn("slow");
		        	$('div#yahoo_login_popup').bPopup().close();
		        	$("div.message_box").remove();
		        	showDefaultMsg( "Importing contacts unsuccessfull, you may try again.", 2 );
	        		$("html, body").animate({ scrollTop: 0 }, "slow");
		        },
		        success: function(jsonData) {
		        	$("form#yahoo_login_form input#cancel_yahoo_auth").hide();
		        	$("span#"+idd).remove();
		        	thiss.fadeIn("slow");
		        	$('div#yahoo_login_popup').bPopup().close();
		        	if(jsonData.error)
		        	{
		        		$("div.alert-box1").remove();
		        		showDefaultMsg( jsonData.error.login, 2 );
		        		$("html, body").animate({ scrollTop: 0 }, "slow");
		        	}
		        	else
		        	{
		        		//LISTING YAHOO CONTACTS OUTSIDE ILOOK.
		        		var counter = 0;
		            	$("div#modal_contacts div#tabs div#tabs-1 div#contacts").html("");
		            	var accessHtml = "";
		            	accessHtml += '<ul><li><label><span><input type="checkbox" id = "gmail_main_cb" name="gmail_main_cb" value="" /></span><span><b>Select All</b></span></label></li></ul>';
		            	accessHtml += '<ul>';
		        		for( i in jsonData.not_in_my_contacts )
		        		{
		        			accessHtml += '<li><label>';
			            	accessHtml += '<span class = "import_cb">';
			            	accessHtml += '<input type="checkbox" class = "gmail_cb" name="emails[]" value="'+jsonData.not_in_my_contacts[i]+'" />';
			            	accessHtml += '</span>';
			            	 if ( jsonData.not_in_my_contacts[i].length > 40) 
			            	 {
			            		 accessHtml += '<span class = "contacts" title="'+jsonData.not_in_my_contacts[i]+'"> '+jsonData.not_in_my_contacts[i].substr(0, 40)+ "..."+'</span>';
			            	 }else{
			            		 accessHtml += '<span class = "contacts" title="'+jsonData.not_in_my_contacts[i]+'"> '+jsonData.not_in_my_contacts[i]+'</span>';	 
			            	 }
			            	accessHtml += '</label></li>';
			            	counter++;
		        		}
		        		accessHtml += '</ul>';
		                $("div#modal_contacts div#tabs div#tabs-1 div#contacts").html(accessHtml);
		                
		                //LISTING YAHOO CONTACTS ALREADY IN ILOOK.
		        		var counter_1 = 0;
		            	$("div#modal_contacts div#tabs div#tabs-2 div#contacts_n_ilook_users").html("");
		            	var accessHtml = "";
		            	accessHtml += '<ul><li><label><span><input type="checkbox" id = "gmail_main_cb_2" name="gmail_main_cb_2" value="" /></span><span><b>Select All</b></span></label></li></ul>';
		            	accessHtml += '<ul>';
		        		for( i in jsonData.in_my_contacts )
		        		{	
		        			accessHtml += '<li><label>';
			            	accessHtml += '<span class = "import_cb">';
			            	if( jsonData.in_my_contacts[i].link_info.friend_type == 0 )
			            	{	
			            		accessHtml += '<input type="checkbox" class = "gmail_cb_2" name="emails_in_ilook[]" value="'+jsonData.in_my_contacts[i].ilook_user_id+'" />';
			            	}	
			            	accessHtml += '</span>';
			            	accessHtml += '<div class = "contact_holder"><div class = "photo_holder"><div><img src = "'+jsonData.in_my_contacts[i].prof_image+'"/></div></div>';
			            	accessHtml += '<div class = "label_holder"><span>'+jsonData.in_my_contacts[i].fname+' '+jsonData.in_my_contacts[i].lname+'</span><br><span>'+jsonData.in_my_contacts[i].email+'</span>';
			            	accessHtml += '<br><span style = "color : #6C518F">';
			            	switch ( jsonData.in_my_contacts[i].link_info.friend_type ) 
			            	{
								case 0:
								break;
								case 1:
									accessHtml += 'Link request sent.';
								break;
								case 2:
									accessHtml += 'Link Request not accepted by you, yet.';
								break;
								case 3:
									accessHtml += 'Linked';
								break;
								default:
									accessHtml += 'Unable to find link status!';
								break;
							}
			            	
			            	accessHtml += '</span></div></div>';
			            	accessHtml += '</label></li>';
			            	counter_1++;
		        		}
		        		accessHtml += '</ul>';
		                $("div#modal_contacts div#tabs div#tabs-2 div#contacts_n_ilook_users").html(accessHtml);
		                
		        		$('#gmail_popup').bPopup({
		        			modalClose: false,
		            	    easing: 'easeOutBack', //uses jQuery easing plugin
	                        speed: 1000,
	                        transition: 'slideDown',
							closeClass : 'close_bpopup',
	                        onOpen: function() {
	                        	$("input#gmail_import_btn").hide();
	                        	$("input#gmail_import_btn_2").hide();
	                        }, 
		        		},
		        		function() {
		        			//Checking/unchecking checkboxes for tab 1
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
		                	
		                	//Checking/unchecking checkboxes for tab 2
		                	$("div#modal_contacts ul li input#gmail_main_cb_2").click(function(){
		                		var isAllChecked = isAllCBChecked("div#modal_contacts ul li input.gmail_cb_2");
		                		if( isAllChecked == 1)
		                		{
		                			$("div#modal_contacts ul li input.gmail_cb_2").prop("checked", false);
		                		}
		                		else
		                		{	
		                			$("div#modal_contacts ul li input.gmail_cb_2").prop('checked', true);
		                		}
		                		if( isAtLeastOneCheckboxChecked( "input.gmail_cb_2" ) == true )
		                		{
		                			$("input#gmail_import_btn_2").fadeIn();
		                		}
		                		else
		                		{
		                			$("input#gmail_import_btn_2").hide();
		                		}
		                	});
		                	$("div#modal_contacts ul li input.gmail_cb_2").click(function(){
		                		var isAllChecked = isAllCBChecked("div#modal_contacts ul li input.gmail_cb_2");
		                		if( isAllChecked == 1 )
		                		{
		                			$("div#modal_contacts ul li input#gmail_main_cb_2").prop('checked', true);
		                		}	
		                		else
		                		{
		                			$("div#modal_contacts ul li input#gmail_main_cb_2").prop('checked', false);
		                		}
		                		if( isAtLeastOneCheckboxChecked( "input.gmail_cb_2" ) == true )
		                		{
		                			$("input#gmail_import_btn_2").fadeIn();
		                		}
		                		else
		                		{
		                			$("input#gmail_import_btn_2").hide();
		                		}
		                	});
		                	
		                	if( counter == 0 )
		                	{
		                		$("div#modal_contacts div#tabs div#tabs-1 div#contacts").html("<label>Oops! No records found to import.</label>");
		                	}
		                	if( counter_1 == 0 )
		                	{
		                		$("div#modal_contacts div#tabs div#tabs-2 div#contacts_n_ilook_users").html("<label>Oops! No records found to import.</label>");
		                	}
		        		});
		        	}
//		        	console.log(jsonData);
		        	return false;
		        }
			});
		}
	});
});