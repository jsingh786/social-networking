$(document).ready(function(){
		
	// Confirmation message, if photos uploaded but not posted.
	window.onbeforeunload = function (e)
	{
	
		if( $("div#temp_uploads_info span").length > 0 
			|| $('input[name=email_id].enquiry').val().length > 0 
			|| $('input[name=phone_number].enquiry').val().length > 0 
			|| $('input[name=subject].enquiry').val().length > 0
			|| $('textarea[name=body].enquiry').val().length > 0
			)
		{
			var message = "Do you really want to navigate from this page without sending your enquiry?",
			e = e || window.event;
			// For IE and Firefox
			if (e) {
				e.returnValue = message;
			}
			// For Safari
			return message;
		}
	};

	//Dialog box show if uploaded file size exceeds 20 MB
    $( "div#dialog_file_size_enq" ).dialog({
	      modal: false,
	      autoOpen: false,
	      draggable:true,
	      width: 345,
	      show: {
	    	  effect: "fade"
	    	  },
		  hide: {
			  effect: "fade"
			  },
	      buttons: {
	    		 OK: {
		    		 click: function () {
	                    $(this).dialog("close");

	                 },
	                 	text : 'OK'
	    		 }
	 	    	 
	      }
    });
	$( "form#enquiry_form_content" ).validate(
			{
				rules: {
					enquiry_type: {
						required: true
					},
					phone_number: {
						required: true,
						minlength : 10,
						maxlength: 20,
						number : true
					},
					email_id: {
						required: true,
						email: true,
						noSpace: true
					},
					subject: {
						required: true,
						maxlength: 255
					}
				}
			});

		 $('input#send_enquiry').on('click', function() {
			    if($("form#enquiry_form_content").valid())
			    {
			    	send_enquiry();
				}
			});
});

/* open popup for enquiry form
 * @author sjaiswal
 * @param user_email string
 * @param msgId_OR_enquiryId int(it contains message id or enquiry id)
 * @param checkType string(check whether second param is message id or enquiry id)
 */
function openEnquiryForm(user_email, msgId_OR_enquiryId,checkType)
{
	//alert(msgId_OR_enquiryId)
	//Bpopup for enquiry form.
		$("div#enquiry_form").bPopup({
			closeClass:'close_bpopup',
			modalClose: false,
			scrollBar: true,
			zIndex : 110,
			escClose: true,
			//resize_enabled: 'false',
		    //removePlugins: 'elementspath',
			onClose: function() {

					//Destory CKEditor
					if (CKEDITOR.instances['enquiry_editor']) {
						CKEDITOR.instances['enquiry_editor'].setData('');
						CKEDITOR.instances['enquiry_editor'].destroy();
						
					}
					
					// clear attachments uploaded 
					//$("form.dz-started").empty();
					$("div#temp_uploads_info").empty();
					
					// clear all other fields
					$('div.enquiry-labelspan-outer  input[type=text][name=email_id]').val('');
					$('div.enquiry-labelspan-outer  input[type=text][name=phone_number]').val('');
					$('div.enquiry-labelspan-outer  input[type=text][name=subject]').val('');

					//Remove all the temporary uploaded files-----------
					if( $("div#temp_uploads_info span").length > 0 )
					{
						var temp_path_info_arr = {};
						var temp_path_info_inner_arr = {};
						$.each( $("div#temp_uploads_info span"), function( key, value ) {

							//console.log(key);
							//console.log($(this).attr("temp_path"));
							temp_path_info_inner_arr = {};
							
							temp_path_info_inner_arr.ts_file_name 	= $(this).attr("ts_file_name");
							temp_path_info_inner_arr.ts_file_size 	= $(this).attr("ts_file_size");

							temp_path_info_arr['index_'+key] = temp_path_info_inner_arr;
							
						});

					};
					//--------------------------------------------------
					
				 },
				 
			onOpen: function(){

				//Destory CKEditor
				if (CKEDITOR.instances['enquiry_editor']) {
					CKEDITOR.instances['enquiry_editor'].destroy();
				}
				
				//Apply CKeditor
				CKEDITOR.replace( 'enquiry_editor', {
					width:450,
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
					CKEDITOR.instances.enquiry_editor.focus();
					}
					},
				});

				if(msgId_OR_enquiryId)
				{
			    $.ajax({
			        url : "/"+PROJECT_NAME+"mail/get-enquiry-msg-detail",
			        data: {
				        	'msgId_OR_enquiryId':msgId_OR_enquiryId,
				        	'checkType':checkType,
				        	},
			        type: "POST",
			        success: function(jsonData) {
			            if(jsonData)
			            {
			            	var jsonData = JSON.parse(jsonData);
			            	html = '';
			            	html += '</br>';
			            	html += '---------</br>';
			            	html += '\r\n'+jsonData.final_date_time+',</br>' ;
			            	html += jsonData.sender_firstname+' '+jsonData.sender_lastname+' wrote:</br>';
			            	html += '\r\n---------</br>';
			            	html += jsonData.contents;

			            	// set message thread to ckeditor 
			            	CKEDITOR.instances['enquiry_editor'].setData(html);
			            	//CKEDITOR.instances['enquiry_editor'].setData(jsonData.contents);
			            }
			        }
				});
				}
				// prefill email id input
				$('div.enquiry-labelspan-outer  input[type=text][name=email_id]').val(user_email);
			}
		});
	
	
}

/* remove attachments from temp folder 
 * @author sjaiswal
 */
function removeattachment(filename)
{
	//Remove all the temporary uploaded files-----------
	if( $("div#temp_uploads_info span").length > 0 )
	{
		
	    $.ajax({
	        url : "/"+PROJECT_NAME+"enquiry/discard-attachments",
	        data: {
		        	'files':filename
		        	},
	        type: "POST",
	        success: function(jsonData) {
	            if(jsonData)
	            {
	            	$('span[ts_file_name='+jsonData+']').remove();
	            }
	        }
		});
    	
	};
	
}

function send_enquiry(){

	var iddd = addLoadingImage($("#send_enquiry"), "before","loading_small_purple.gif",0 ,21 );
	$("#send_enquiry").hide();
	
	var temp_path_info_arr = {};
	var temp_path_info_inner_arr = {};
	
	$.each( $("div#temp_uploads_info span"), function( key, value ) {

		temp_path_info_inner_arr = {};
		
		temp_path_info_inner_arr.ts_file_name 			= $(this).attr("ts_file_name");
		temp_path_info_inner_arr.ts_file_size 			= $(this).attr("ts_file_size");
		temp_path_info_inner_arr.ts_actual_file_name 	= $(this).attr("ts_actual_file_name")
		
		temp_path_info_arr['index_'+key] = temp_path_info_inner_arr;
	});

	// checking uploaded attachments size for not greater than 20 MB
	// on first ajax call and then
	// on success call send enquiry ajax call

	jQuery.ajax({
		url : "/" + PROJECT_NAME + "enquiry/check-attachments-size",
		type : "POST",
		dataType : "json",
		data: {
	         	'uploads' 	: temp_path_info_arr,
	          },
	     timeout: 600000,
	     success: function(jsonData) {
	         if(jsonData == 1)
	         {
				jQuery.ajax({
			        url: "/" + PROJECT_NAME + "enquiry/send-enquiry",
			        type: "POST",
			        dataType: "json",
			        beforeSend: function() {
				       	 $("span#"+iddd).remove();
						 $("#send_enquiry").show();
				     	 $('div#enquiry_form').bPopup().close();
				     	 $("div#temp_uploads_info").empty();
			     	
			     		// clear all other fields
						$('div.enquiry-labelspan-outer  input[type=text][name=email_id]').val('');
						$('div.enquiry-labelspan-outer  input[type=text][name=phone_number]').val('');
						$('div.enquiry-labelspan-outer  input[type=text][name=subject]').val('');
						
						//clear ckeditor
						if (CKEDITOR.instances['enquiry_editor']) {
							CKEDITOR.instances['enquiry_editor'].setData('');
							CKEDITOR.instances['enquiry_editor'].destroy();
						}
					
						// clear uploaded image div
						$( "div.dz-complete" ).remove();
						$( "div.dz-message" ).show();
			        },
			        data: {
			            	'uploads' 		: temp_path_info_arr,
			            	'enquiry_type' 	: $('div.enquiry-labelspan-outer select[name=enquiry_type]').val(),
			            	'email_id'		: $('div.enquiry-labelspan-outer  input[type=text][name=email_id]').val(),
			            	'phone_number'	: $('div.enquiry-labelspan-outer  input[type=text][name=phone_number]').val(),
			            	'subject'		: $('div.enquiry-labelspan-outer  input[type=text][name=subject]').val(),
			            	'body'			: nl2br(CKEDITOR.instances.enquiry_editor.getData())
			              },
			        timeout: 50000,
			        success: function(jsonData) {
			        	if(jsonData == 1)
			            {
				        	showDefaultMsg("You have submitted an enquiry.", 1);	
			            }
				       	else if(jsonData == 0)
						{
							$("span#"+iddd).remove();
							$("#send_enquiry").show(); 
						}
			            else
			            {
			            	showDefaultMsg("Error while posting enquiry.", 2); 	
			            }
			        }
				});

	         }
	         else if(jsonData == 0)
			 {
				$("span#"+iddd).remove();
				$("#send_enquiry").show(); 
				alert("Total Attachment size should not exceed 20 MB");
				//$( "div#dialog_file_size_enq" ).dialog( "open" );
			 }
	         else
	         {
	        		showDefaultMsg("Error while posting enquiry.", 2); 	
	         }
	     }      
	});
	
}