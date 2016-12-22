var idd;
$(document).ready(function(){

	//On window ready an ajax call will be shooted if there are some previous attachments. 
	//This possibilty is very rare.
	discardTempFilesforCompose();
	
	$('form#send_message_form').validate(
			{
				rules: {
						subject:{
			    				required:true,
								maxlength:255
					    	},

					    },
			});
	
	
	$("input#jq_receiver_id").attr('placeholder','To');
	$("input#jq_receiver_id").css('font-family','arial');
	
	//Token input---------------
	$("#receiver_id").tokenInput(PROJECT_URL+PROJECT_NAME+"mail/get-my-matching-contacts", {
		onAdd: function (item) {
			$("div#receiver_ids_holder").append("<input type = 'hidden' name = 'receiver_ids[]' class = 'font-arial receiver_ids' id = '"+item.id+"' value = '"+item.id+"'>");
			$("#jq_receiver_id").attr('placeholder','');
		},
		onDelete: function (item) {
			$('div#receiver_ids_holder input#'+item.id).remove();
		},
		theme: "facebook",
		minChars: 1,
		propertyToSearch: "first_name",
		propertyToSearch: "last_name",
		resultsFormatter: function(item){ return "<li><div style = 'width:25px; height:25px; display:inline-block;margin: 3px 0 1px;'> <div style = 'width:25px; height:25px; display : table-cell; vertical-align: middle; text-align: center;'>" + "<img style = 'max-width : 25px; max-height : 25px;' src='" + item.url + "' title='" + item.first_name + " " + item.last_name + "'/></div></div>" + "<div style='display: block; margin-top: -29px; padding-bottom: 4px; padding-left: 28px;'><div class='full_name'>" + item.first_name + " " + item.last_name + "</div><div class='email'>" + item.email + "</div></div></li>" },
		tokenFormatter: function(item) { return "<li><p>" + item.first_name + " " + item.last_name + "</p></li>" },
	});
	
	
	//Filling up 'to field', reading hash value.
	var hash = location.hash.replace(/^.*?#/, '');
	var pairs = hash.split('&');
	var key_0 = pairs[0].split(':')[0];
	var value_0 = pairs[0].split(':')[1];
	
	if( key_0 == 'to_user' )
	{
		if( value_0 != 'admin' )
		{
			__addOverlay();
			$.ajax({
				url : "/" + PROJECT_NAME + "mail/get-user-info",
				method : "POST",
				data : { 'user_id' : value_0 },
				type : "post",
				dataType : "json",
				success : function(jsonData) {
					if(jsonData != false )
					{
						$("input#receiver_id").tokenInput("add", {id : jsonData.id, first_name: jsonData.firstname, last_name: jsonData.lastname});
						$("#jq_receiver_id").attr('placeholder','');
					}
					__removeOverlay();
				}
			});
		}
		else if( value_0 == 'admin' )
		{
			$("input#receiver_id").tokenInput("add", {id : 0, first_name: 'feedback@ilook.net', last_name: ''});
			$("#jq_receiver_id").attr('placeholder','');
			$("li.token-input-token-facebook").addClass('adminToken');
			$("span.mail-span a#mail_contacts_popup").remove();
		}	
	}
	else if( key_0 == 'share_profile_of_user' )
	{
		__addOverlay();
		$.ajax({
			url : "/" + PROJECT_NAME + "mail/get-user-info",
			method : "POST",
			data : { 'user_id' : value_0 },
			type : "post",
			dataType : "json",
			success : function(jsonData) {
				if(jsonData != false )
				{
//					$("input#receiver_id").tokenInput("add", {id : jsonData.id, first_name: jsonData.firstname, last_name: jsonData.lastname});
//					$("#jq_receiver_id").attr('placeholder','');
				}
				__removeOverlay();
			}
		});
		$("textarea#message_body").text("I found this profile interesting, you may wish to have a look. \n"+PROJECT_URL+PROJECT_NAME+"profile/iprofile/id/"+value_0);
	}
	

	// send button click and validation on composing message by Ritu
	$("#send_message").click(function() {
		if($("#jq_receiver_id").val() == "" && $('ul.token-input-list-facebook li').length == 1){
			$( "#dialog_confirm" ).dialog( "open" );
		}else{
			sendmail();
		}
	});
	
	$("#cancel").click(function() {
		$("form#send_message_form").trigger('reset');
		$("#jq_receiver_id").attr('placeholder','');
		 window.location.href =  "/" +PROJECT_NAME + "mail/inbox";
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
	$('a#mail_contacts_popup').click( function(){
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
	//------------------------------------------
	
	
	//Apply CKeditor
	CKEDITOR.replace( 'message_body', {
		width:592,
		uiColor: '#6C518F',
		toolbar: [
					{ name: 'basicstyles' , items : [ 'Bold','Italic','TextColor',"BGColor", 'NumberedList','BulletedList'  ] },
					{ name: 'tools', items : [ 'Maximize','-' ] },
				],
		removePlugins : 'elementspath',
		on:
		{
		'instanceReady': function(evt) {

			 var tags = ['p', 'ol', 'ul', 'li']; // etc.

		        for (var key in tags) {
		        	evt.editor.dataProcessor.writer.setRules(tags[key],
		                {
		                    indent : false,
		                    breakBeforeOpen : false,
		                    breakAfterOpen : false,
		                    breakBeforeClose : false,
		                    breakAfterClose : false
		                });
		        }
		//Set the focus to your editor
		CKEDITOR.instances.message_body.focus();
		}
		},
	});
});

//On window unload remove all the temp attachments. attached but not sent.
$( window ).unload(function() {
	discardTempFilesforCompose();
});

/**
 * Posts the compose mail form
 * 
 * @author ritu
 * @author sjaiswal(updated attachment code)
 */
function sendmail(){
	if( $('form#send_message_form').valid() == true)
	{
		// for sending ckeditor data in serialised form data
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
		
		var iddd = addLoadingImage($("#send_message"), "before","loading_small_purple.gif",0 ,21 );
		$("#send_message").hide();

		$str = $("form#send_message_form").serialize();
		$.ajax({
			url : "/" + PROJECT_NAME + "mail/send-mail",
			method : "POST",
			//data : $str,
			data : {"str": $str,"temp_path_info_arr":temp_path_info_arr},
			type : "post",
			dataType : "json",
			beforeSend: function() {
				$("span#"+iddd).remove();
				$("#send_message").show();
				$("form#send_message_form").trigger('reset');
				
				//clear ckeditor
				if (CKEDITOR.instances['message_body']) {
					CKEDITOR.instances['message_body'].setData('');
				}
				
				$("#jq_receiver_id").attr('placeholder','To');
				$("div.alert-box").remove();
				$("#receiver_id").tokenInput("clear");
				// hide attachments records
				$(".files").empty();
				
		        },
				success : function(jsonData) {
				if(jsonData == "success")
				{
					window.location.href = "/" + PROJECT_NAME + "mail/inbox";
				}	
				else
				{
					showDefaultMsg("Error while sending mail.", 2); 	
				}
			}
		});
	}
}


/**
 * !!Please add description also!!
 * 
 * @author Ritu
 */
function searchReceiverName(){
	var iddd = addLoadingImage($("input#send_message"), "before");
	$str = $("form#send_message_form").serialize();
	$.ajax({
		url : "/" + PROJECT_NAME + "mail/send-mail",
		method : "POST",
		data : $str,
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			if(jsonData.msg=="success"){
				//getBasicInfo(iddd);
				alert(jsonData);
				
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

/* remove attachments from imail temp folder 
 * @author sjaiswal
 */

function discardTempFilesforCompose()
{
	if( $("table[role=presentation] div.template-download").length > 0 )
	{
		$.ajax({
			async: false,
	        url : "/"+PROJECT_NAME+"mail/discard-attachments-for-compose",
	        type: "POST"
		});
	}
}