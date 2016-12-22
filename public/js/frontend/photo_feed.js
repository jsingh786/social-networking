var ok_notOK_call_1;
var comment_edit_ajax_call;
var comment_hide_ajax_call;

// Confirmation message, if photos uploaded but not posted.
window.onbeforeunload = function (e)
{
	if( $("table[role=presentation] div.template-download").length > 0 )
	{
		var message = "Do you really want to navigate from this page without posting your post?",
		e = e || window.event;
		// For IE and Firefox
		if (e) {
			e.returnValue = message;
		}
		// For Safari
		return message;
	}
}

//On window unload remove all the temp images( uploaded but not posted on wall )
$( window ).unload(function() {
	if( $("table[role=presentation] div.template-download").length > 0 )
	{
	    $.ajax(
	    {
	        async: false,
	        url : "/" + PROJECT_NAME + "socialise/remove-temp-folder-n-data"
		});
    	
	};
	//Remove div where blueimp thumbnails are created on refreshing the page.
	$('div.template-download').remove();
});
$(document).ready(function()
{
	//Remove div where blueimp thumbnails are created on refreshing the page.
	$('div.template-download').remove();
	
	sticky_relocate();
	//Switching between "Add Photos" and "Create Album".
	$('div.fileupload-buttons input#add_photos').click(  
		function()
		{
			$("div.fileupload-buttons input#album_title").hide();
			$("div.fileupload-buttons input#just_photos_or_photo_album").val(1);
		}
	);
	$('div.fileupload-buttons input#create_album').click(  
		function()
		{
			$("div.fileupload-buttons input#album_title").fadeIn();
			$("div.fileupload-buttons input#just_photos_or_photo_album").val(2);
		}
	);
	
	$("textarea#photo_text").focus(function(){
		$("div#post_btn").fadeIn();
	});
	
	$( "form#photo_feed input[type=file]" ).click(function(){
		$("div#post_btn").fadeIn();		
	});
	
	window.scrollTo(0,0);
	//Loading more posts on wall when scroll touches bottom.
	$(window).scroll(function() {
		if($(window).scrollTop() + $(window).height() == $(document).height()) {
			$("div.show_more").click();
		}
	});
	//-------------------------------------------------------


	 if($('#privacy').length > 0)
	 {
		 $('#privacy option[value=2]').attr('selected','selected');
		 $("select#privacy").selectBoxIt({theme: "jqueryui"});
	 }
	$("input#offsettt").val(0);
	$("input#offsettt_comm").val(0);
    
    var options = {
            beforeSubmit:  showRequest,  // pre-submit callback 
            success:       showResponse,  // post-submit callback 
            dataType : 'json',
            clearForm : true,
            data : {},
            // other available options:
            url:       '/'+PROJECT_NAME+'socialise/post-photos', // override for form's 'action' attribute
            dataType:  'json'        // 'xml', 'script', or 'json' (expected server response type) 

        };
    
        // bind form using 'ajaxForm'
        $('#photo_feed').ajaxForm(options);
        
        $("form#photo_feed a#share").click(function()
        {
        	//Array for post_photos-------------------------------------
        	var temp_photo_arr = {};
        	var photo_arr = {};
        	
        	$.each( $("div.template-download"), function( key, value ) {

        		//console.log(key);
        		//console.log($(this).attr("temp_path"));
        		temp_photo_arr = {};
        		var index  = $(this).children('textarea#photo_desc').attr('rel');
        		
        		temp_photo_arr[index] = $(this).children('textarea#photo_desc').val();
        		photo_arr['index_'+key] = temp_photo_arr;
        		
        	});
        	
        	//----------------------------------------------------------
        	
        	if( $('form#fileupload span input#album_title').is(":visible") && $('form#fileupload span input#album_title').prop('value') == "" )
        	{
        		showDialogMsg( 'Oops! Your album is untitled', "Please add name for the album.", 5000, 
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
            		    width: 300
            		}		
            	);
        		
        		return;
        	}

        	if( $("table[role=presentation] div.template-download span.preview img").length > 0 )
        	{
	        	var idd = addLoadingImage( $(this), "before", "loading_small_purple.gif", 50, 30);
	        	$(this).hide();
	        	
	        	//options.data.photos_text = $("form#fileupload textarea#photo_text").val();
	        	options.data.photos_text = CKEDITOR.instances.photo_text_ckeditor.getData();
	        	options.data.photo_name_desc_arr = photo_arr;	
	        	//if Album
	            if( $("div.fileupload-buttons input#just_photos_or_photo_album").val() == 2 )
	            {
	            	options.url = '/'+PROJECT_NAME+'socialise/post-album';
	            	options.data.album_title = $('form#fileupload input#album_title').val();
	            }
	            else if( $("div.fileupload-buttons input#just_photos_or_photo_album").val() == 1 )
	            {
	            	options.url = '/'+PROJECT_NAME+'socialise/post-photos';
	            }	
	        	
	        	if($('form#photo_feed').submit())
	        		{
	        		//clear ckeditor
					if (CKEDITOR.instances['photo_text_ckeditor']) {
						CKEDITOR.instances['photo_text_ckeditor'].setData('');
					}
	        		}
	        	
        	}
        	else
        	{
        		showDialogMsg( 'Oops!', "Please add photo(s) to post on wall.", 5000, 
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
        		    width: 300
        		}		
        		);
        	}	
        });
        
        loadImageFeedsOnWall( 0 );
        
    	//Alert box for success message.
        $( "div#dialog_success_share" ).dialog({
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
  	    	 OK: function() {
  	    		$( this ).dialog( "close" );
  	    		}
  	      	}
        });
    	
        //Posting a comment.
        $(document).on( 'focus', "textarea.comment-textarea", function(){
        	//Auto grow comment input text area.
        	//To prevent the scrollbar in the textarea from flashing on & off during expansion/contraction, you can set the overflow to hidden as well:
        	var opts = {
        		    animate: true
        		};
        	
        	this.selectionStart = this.selectionEnd = this.value.length;
        	$(this).css('overflow', 'hidden').autogrow();
        });
        
      
        //Alert box for confirming deletion of wallpost .
        $( "div#dialog_confirm_delete_wallpost" ).dialog({
       	 modal: true,
       	 autoOpen: false,
       	 draggable:false,
       	 width: 304,
       	 show: {
       		 effect: "fade"
       	 },
       	 hide: {
       		 effect: "fade"
       	 },
       	 buttons: {
       		 Yes: function() {
       			 $( this ).dialog( "close" );
       			 deleteWallpost( $(this).data('element'), $(this).data('wallpost_id')); 
       		 },
       		 Cancel: {
                 click: function () {
                     $(this).dialog("close");
                 },
                 class: 'only_text',
                 text : 'Cancel'
             }
       	 }
        });
        
        //Alert to confirm deletion of comment on wall.
		$( "#dialog_delete_comment" ).dialog({
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
		    	 'Cancel': {
		                 click: function () {
		                     $(this).dialog("close");
		                 },
		                 class: 'only_text',
		                 text : 'Cancel'
		             },
				'Delete': function(){
					$( this ).dialog( "close" );
					$("div#comments-outer_"+$(this).data('comment_id')).fadeOut();
					deleteComment($(this).data('comment_id'), $(this).data('element'));
				}
		      }
		});
		
		//Alert to confirm deletion of comment in popup.
		$( "#dialog_delete_comment_in_popup" ).dialog({
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
		        'Cancel': function() {
		        	$( this ).dialog( "close" );
		        },
				'Delete': function(){
					$( this ).dialog( "close" );
					$("div#comments-outer_"+$( this ).data('comment_id')).fadeOut();
					deleteCommentInPopup($(this).data('comment_id'), $(this).data('element'));
				}
		     }
		});  
		
		//Open users who has shared post in popup
		//Added by hkaur5
		$('a.other_sharers').on('click',function(){
			openWhoSharedPopup($(this).attr('rel'),this);
		});
	//clear ckeditor
	 if (CKEDITOR.instances['photo_text_ckeditor']) {
	 CKEDITOR.instances['photo_text_ckeditor'].destroy();
	 }
		
		//Apply CKeditor
		CKEDITOR.replace( 'photo_text_ckeditor', {
			width:850,
			height:100,
			uiColor: '#6C518F',
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
			
			$("div#post_btn").fadeIn();
			}
			},
		});
});

//Hidding post wish popup on out click.
$(document).mouseup(function (e)
{
	var container = $("div.wish-pop-outer");
	if (!container.is(e.target) // if the target of the click isn't the container...
			&& container.has(e.target).length === 0) // ... nor a descendant of the container
	{
		container.hide();
	}
});

//Hidding comment edit popup on out click.
$(document).mouseup(function (e)
{
	var container = $("div.edit-popup-outer");
	
	if (!container.is(e.target) // if the target of the click isn't the container...
			&& container.has(e.target).length === 0) // ... nor a descendant of the container
	{
		container.hide();
	}
});

//Hidding privacy popup on out click.
$(document).mouseup(function (e)
{
	var container = $("div.option-pop");
	if (!container.is(e.target) // if the target of the click isn't the container...
			&& container.has(e.target).length === 0) // ... nor a descendant of the container
	{
		container.hide();
		
		$( "img.privacy_icon" ).each(function( index )
		{
			switch ( $(this).attr("src") ) 
			{
				case IMAGE_PATH+"/privacy_links_purple.png" :
					$(this).attr("src", IMAGE_PATH+"/privacy_links_grey.png");
				break;
				case IMAGE_PATH+"/privacy_public_purple.png" :
					$(this).attr("src", IMAGE_PATH+"/privacy_public_grey.png");
					break;
				case IMAGE_PATH+"/privacy_links_of_links_purple.png" :
					$(this).attr("src", IMAGE_PATH+"/privacy_links_of_links_grey.png");
					break;
				
				default:
					break;
			}
		});
	}
});

//Hidding privacy popup on out click.
$(document).mouseup(function (e)
{
	var container = $("div.option-pop2");
	if (!container.is(e.target) // if the target of the click isn't the container...
			&& container.has(e.target).length === 0) // ... nor a descendant of the container
	{
		container.hide(); 
	}
}); 

//Hidding post comment popup on out click.
$(document).mouseup(function (e)
{
	var container = $("div.commentbox-outer");
	
	if (!container.is(e.target) // if the target of the click isn't the container...
			&& container.has(e.target).length === 0) // ... nor a descendant of the container
	{
		container.hide();
	}
});

//Show comments
//$("div.comments-outer").on('click','span.unhide-comment',function(){
//	showComments(this);
//});
// pre-submit callback 
function showRequest(formData, jqForm, options) {
    // formData is an array; here we use $.param to convert it to a string to display it 
    // but the form plugin does this for you automatically when it submits the data 
//    var queryString = $.param(formData); 
    
    // jqForm is a jQuery object encapsulating the form element.  To access the 
    // DOM element for the form do this: 
    // var formElement = jqForm[0]; 
 
//    alert('About to submit: \n\n' + queryString); 
 
    // here we could return false to prevent the form from being submitted; 
    // returning anything other than false will allow the form submit to continue 
    return true; 
}
 
// post-submit callback 
function showResponse(responseText, statusText, xhr, $form)  {

    // for normal html responses, the first argument to the success callback 
    // is the XMLHttpRequest object's responseText property
 
    // if the ajaxForm method was passed an Options Object with the dataType 
    // property set to 'xml' then the first argument to the success callback 
    // is the XMLHttpRequest object's responseXML property
 
    // if the ajaxForm method was passed an Options Object with the dataType 
    // property set to 'json' then the first argument to the success callback 
    // is the json data object returned by the server

//    console.log('status: ' + statusText + '\n\nresponseText: \n' + responseText + 
//        '\n\nThe output div should have already been updated with the responseText.');
//    console.log(responseText);
    
	if( responseText.is_success )
    {
	
    	$("form#fileupload table[role=presentation] tbody.files").empty();
    	var wall_post = "";
    	
    	wall_post = imageFeedWallPostMaker(
    								responseText.wall_post_id,
    								responseText.user_id,
    								responseText.user_type,
    								responseText.user_name,
    								responseText.user_gender,
    								responseText.user_image,
    								responseText.collage,
    								responseText.collage_description,
    								"",
    								'0 seconds from now',//responseText.collage_created_at,
    								1,
    								0,
    								0,
    								0,
    								[],
    								0,
    								"",
    								responseText.is_ok_comment_share_pannel_visible,
    								responseText.privacy,
    								1,    
    								responseText.post_update_type,
    								[],
    								0,
    								responseText.first_img_portrait_or_landscape,
    								{ 
    									'origi_user_id' : responseText.user_id , 
    									'origi_user_name': responseText.user_name,
    									'origi_user_type': responseText.user_type 
    								},
    								responseText.album_id,
    								responseText.album_name, //album_name
    								responseText.album_name //album_display_name
    								
    								
    							);

    	$("div#updates_holder div.loading_updates").remove();
    	$("div#updates_holder").prepend( wall_post );
    	activateCommentActions();
    	$("div.news-update-content:first").fadeIn();
    	
    	//Resizing the wall thumbnails with jquery.
    	$( 'img.require_jquery_thumbnail_processing' ).each(function( index ) {
        	jQuery( this ).nailthumb(
        			{
        				onStart:function(container){
        					//container.showLoading();
                        },
                        width: $(this).attr('rel_width'),
                        height: $(this).attr('rel_height'),
                        method:'crop',
        				onFinish:function(container){
                            container.children().removeClass('require_jquery_thumbnail_processing');
                        }
        			}
        		);
        });
    }
    else
    {
    	$("div.message_box").remove();
	    showDefaultMsg( responseText.msg, 2 );
    }
    $("form#photo_feed div.col3 a#share").siblings("span.loading").remove();
    $("form#photo_feed a#share").fadeIn();
	$('#privacy option[value=2]').attr('selected','selected');
    $("form#fileupload input#album_title").val("");
}
/**
 * close share wallpost popup.
 * @author hkaur5
 * 
 */
function closePopUp()
{
	$('div#share_photo_feed_popup').bPopup().close();
}

/**
 * Makes feed post html for photo feed,
 * according to recieved parameters.
 * 
 * @param integer wallpost_id
 * @param integer user_id
 * @param integer user_type
 * @param string user_name
 * @param integer user_gender
 * @param string user_image
 * @param array collage_images [ array of photos to make collage, for wallpost POST_UPDATE_TYPE 15, 16 and 17]
 * @param sting wall_post_text
 * @param string wallpost_text_when_shared
 * @param string wallpost_created_at
 * @param integer displayyNone [ 0 for display, 1 for display : none ]
 * @param integer like_count
 * @param integer comment_count
 * @param integer share_count
 * @param json comments_json
 * @param integer did_i_liked_this [ 1 or 0 ]
 * @param string likers_string [ For eg : You, Rajan, Jason and 3 other(s) OK this ]
 * @param integer is_ok_comment_share_pannel_visible [0 or 1]
 * @param integer privacy
 * @param integer is_my_wallpost[0 or 1]
 * @param integer post_update_type
 * @param json wish_data {"wish_id": 91,"underlying_text": "Completing1year(s)atLarsenandturbothisOctober","wish_type": 3}
 * @param boolean is_wallpost_reported_abuse
 * @param integer first_img_portrait_or_landscape [tells that first photo in collage_images is portrait or landscape]
 * @param json original_user_data { "origi_user_id":1, "origi_user_name":"Abc Def" }
 * @param socialise_album_id
 * @param socialise album_name
 * @param socialise album_display_name
 * @param json sharer_string ( "sharer_string" : "harsimer and jaskaran has shared your wallpost", "shared_from_wallpost":"true/false")
 * 
 * 
 * @returns "post's HTML"
 * @author jsingh7
 * @version 1.0
 *
 */
function imageFeedWallPostMaker(
						wallpost_id,
						user_id,
						user_type,
						user_name,
						user_gender,
						user_image,
						collage_images,
						wall_post_text,
						wallpost_text_when_shared,
						wallpost_created_at,
						displayyNone,
						like_count,
						comment_count,
						share_count,
						comments_json,
						did_i_liked_this,
						likers_string,
						is_ok_comment_share_pannel_visible,
						privacy,
						is_my_wallpost,
						post_update_type,
						wish_data,
						is_wallpost_reported_abuse,
						first_img_portrait_or_landscape,
						original_user_data,
						album_id,
						album_name,
						album_display_name,
						sharers_string_json
					)
{
	var collage_length = 0;
	if ( typeof collage_images != "undefined" )
	{
		collage_length = collage_images.length;
	}
	wall_post = "";
	
	if( displayyNone == 0 )
	{
		wall_post += '<div class="news-update-content" rel = "'+wallpost_id+'">';
	}
	else
	{
		wall_post += '<div class="news-update-content" style = "display:none;" rel = "'+wallpost_id+'">';
	}
	wall_post += '<div class="news-update-column">';	
	if( post_update_type == 11 )//POST_UPDATE_TYPE_WISH
	{
		switch ( wish_data.wish_type )
		{
			case 1:
			case '1':
				wall_post += '<div class="wish-icon"><img src = "'+IMAGE_PATH+'/icon-new-link-big.png"/> </div>';
			break;
			
			case 2:
			case '2':
				wall_post += '<div class="wish-icon"><img src = "'+IMAGE_PATH+'/icon-new-job-big.png"/> </div>';
			break;
			
			case 3:
			case '3':
				wall_post += '<div class="wish-icon"><img src = "'+IMAGE_PATH+'/icon-job-anniversary-big.png"/> </div>';
			break;
			
			case 5:
			case '5':
				wall_post += '<div class="wish-icon"><img src = "'+IMAGE_PATH+'/icon-birthday-wishes-big.png"/> </div>';
			break;
		}
	}
	var his_or_her = user_gender == 2?'her':'his';
	
	//---------------------------------------------------------------------------------------------------------------------
	// Heading text in case of shared posts
	//---------------------------------------------------------------------------------------------------------------------
	if( post_update_type == 17 )//Shared photos in default album.
	{
//		console.log(wallpost_id);
//		console.log(sharers_string_json);
		
		wall_post += '<div class="shared-link">';
		if(sharers_string_json)
		{
			if(sharers_string_json.shared_from_wallpost_exist)
			{
				wall_post += '<span class="text-purple2">'+sharers_string_json.sharer_string;
			}
			else
			{
				var photo = collage_length>1?'photos':'photo';
				if( user_id == original_user_data.origi_user_id )
				{
					
					wall_post += '<span class="text-purple2">';
					wall_post += '<a class="text-purple2" href="'+PROJECT_URL+PROJECT_NAME+'profile/iprofile/id/'+original_user_data.origi_user_id+'" style="text-decoration: none !important;">You</a>';
					wall_post += '</span> shared your <span class="text-purple2">'+photo+'</span>';
				}
				else
				{
					var original_user_name = original_user_data.origi_user_name+"'s ";
					wall_post += '<span class="text-purple2">'+sharers_string_json.sharer_string+'</span> shared <span class="text-purple2">';
					wall_post += '<a class="text-purple2" href="'+PROJECT_URL+PROJECT_NAME+'profile/iprofile/id/'+original_user_data.origi_user_id+'" style="text-decoration: none !important;">'+original_user_name+'</a>'+photo+'</span>';
				}
			}
		}
		
		// when sharers_string_json not available. This will happen in case of functions in whichh heading text functionality not applied yet.
		// Remove this condn after heading text functionality is applied every where.
		else
		{
			
			var photo = collage_length>1?'photos':'photo';
			if( user_id == original_user_data.origi_user_id )
			{
				
				wall_post += '<span class="text-purple2">'+user_name+'</span> shared '+his_or_her+' own <span class="text-purple2">'+photo+'</span>';
			}
			else
			{
				var original_user_name = original_user_data.origi_user_name+"'s ";
				wall_post += '<span class="text-purple2">'+user_name+'</span> shared <span class="text-purple2">';
				wall_post += '<a class="text-purple2" href="'+PROJECT_URL+PROJECT_NAME+'profile/iprofile/id/'+original_user_data.origi_user_id+'" style="text-decoration: none !important;">'+original_user_name+'</a>'+photo+'</span>';
			}
			
		}
			
		//---------------------------------------------------------------------------------------------------------------------
		// Heading text in case of shared posts
		//---------------------------------------------------------------------------------------------------------------------
		wall_post += '</div>';
	}
	
	wall_post += '<div class="news-update-content-icon short_profile_border">';
	
	if( user_type != 5){	
		var parameter_json = "{'user_id':"+user_id+"}";
		wall_post += '<a disable-border="1" title = "' + user_name + '" id="'+user_id+'" href = "javascript:" onclick="getShortProfile(this,'+parameter_json+')" >';
		wall_post += '<img src="' + user_image + '"/>';
		wall_post += '</a>';
	}else{
		wall_post += '<img title = "' + user_name + '" src="' + user_image + '"/>';
	}
	
	//Short profile view popup holder
	wall_post += '<div id="view-outer_'+user_id+'" class="quickview-outer" popup-state="off" style="display:none;">';
	wall_post += '<div class="popupArrow">';
	wall_post += '<img width="36" height="22" src="'+IMAGE_PATH+'/arrow-purple2.png">';
	wall_post += '</div>';
	wall_post += '<div id="view_'+user_id+'" class="quickview"> </div>';
	wall_post += '</div>';
	
	wall_post += '</div>';
	
	wall_post += '<div class="news-update-date">';
	
	
	
	if( post_update_type == 14 )//Profile photo change wall update.
	{
		wall_post += '<h4><a class="text-purple2" href="/'+PROJECT_NAME+'profile/iprofile/id/'+ user_id +'" style="text-decoration: none !important;">' + user_name + '</a> has updated '+his_or_her+' profile photo.</h4>';
	}
	else if( post_update_type == 16 )//collage of images posted on wall.
	{
		var photo = collage_length>1?'photos':'a photo';
		if( user_type != 5){
			wall_post += '<h4><a class="text-purple2" href="/'+PROJECT_NAME+'profile/iprofile/id/'+ user_id +'" style="text-decoration: none !important;">' + user_name + '</a> has posted '+photo+'.</h4>';
		}else{//case of admin.
			wall_post += '<h4><span class = "text-purple2">' + user_name + '</span> has posted '+photo+'.</h4>';
		}
	}
	//In case of shared post show only from_user name and not all heading.
	else if( post_update_type == 17 )//collage of images shared.
	{
//		var photo = collage_length>1?'photos':'photo';
		
		if( user_id == original_user_data.origi_user_id )
		{	
			if( user_type != 5){
//				wall_post += '<h4><a class="text-purple2" href="/'+PROJECT_NAME+'profile/iprofile/id/'+ user_id +'" style="text-decoration: none !important;">' + user_name + '</a> has shared '+his_or_her+' own '+photo+'.</h4>';
				wall_post += '<h4><a class="text-purple2" href="/'+PROJECT_NAME+'profile/iprofile/id/'+ user_id +'" style="text-decoration: none !important;">' + user_name + '</a></h4>';
			}else{//Case of admin
//				wall_post += '<h4><a class="text-purple2" href="javascript:void(0)" style="text-decoration: none !important;">' + user_name + '</a> has shared '+his_or_her+' own '+photo+'.</h4>';
				wall_post += '<h4><a class="text-purple2" href="javascript:void(0)" style="text-decoration: none !important;">' + user_name + '</a></h4>';
			}	
		}
		else
		{
//			wall_post += '<h4><a class="text-purple2" href="/'+PROJECT_NAME+'profile/iprofile/id/'+ user_id +'" style="text-decoration: none !important;">' + user_name + '</a> has shared ';
			wall_post += '<h4><a class="text-purple2" href="/'+PROJECT_NAME+'profile/iprofile/id/'+ user_id +'" style="text-decoration: none !important;">' + user_name + '</a></h4>';
//			if( original_user_data.origi_user_type != 5/* User type admin */ ) //Not to show link(URL) in case of post.
//			{
//				wall_post += '<a class="text-purple2" href="/'+PROJECT_NAME+'profile/iprofile/id/'+ original_user_data.origi_user_id +'" style="text-decoration: none !important;">' + original_user_data.origi_user_name + '\'s</a> '+photo+' </h4>';
//			}
//			else
//			{
//				wall_post += '<a class="text-purple2" href="javascript:void(0)" style="text-decoration: none !important; cursor: default;">' + original_user_data.origi_user_name + '\'s</a> '+photo+' </h4>';
//			}
		}	
	}
	else if( post_update_type == 15 )//album on wall.
	{
		if( user_type != 5 )
		{
			wall_post += '<h4><a class="text-purple2" href="/'+PROJECT_NAME+'profile/iprofile/id/'+ user_id +'" style="text-decoration: none !important;">' + user_name + '</a>';
			wall_post += ' has posted an Album <a class="text-dark-purple" href="'+PROJECT_URL+PROJECT_NAME+'profile/photos/uid/'+user_id+'/id/'+album_id+'">'+album_display_name+'</a>.</h4>';
		}
		else
		{
			wall_post += '<h4><span class = "text-purple2">' + user_name + '</span> has posted an Album.</h4>';
		}
	}
	else if( post_update_type == 11 )//POST_UPDATE_TYPE_WISH
	{
		switch ( wish_data.wish_type )
		{
			case 1:
			case '1':
				wall_post += '<h4><a class="text-purple2" href="/'+PROJECT_NAME+'profile/iprofile/id/'+ user_id +'" style="text-decoration: none !important;">' + user_name + '</a>';
				wall_post += ' has a new ';
				wall_post += '<a class="text-purple2" href="/'+PROJECT_NAME+'profile/iprofile/id/'+ wish_data.link_ilook_user_id +'" style="text-decoration: none !important;" title = "'+ wish_data.link_ilook_user_name +'">Link</a></h4>';
			break;
			
			case 2:
			case '2':
				wall_post += '<h4><a class="text-purple2" href="/'+PROJECT_NAME+'profile/iprofile/id/'+ user_id +'" style="text-decoration: none !important;">' + user_name + '</a>';
				wall_post += ' has a new Job</h4>';
			break;
			
			case 3:
			case '3':
				wall_post += '<h4><a class="text-purple2" href="/'+PROJECT_NAME+'profile/iprofile/id/'+ user_id +'" style="text-decoration: none !important;">' + user_name + '</a>';
				wall_post += ' having a work Anniversary</h4>';
			break;
			
			case 5:
			case '5':
				wall_post += '<h4><a class="text-purple2" href="/'+PROJECT_NAME+'/profile/iprofile/id/'+ user_id +'" style="text-decoration: none !important;">' + user_name + '</a>';
				wall_post += ' Celebrating Birthday Today</h4>';
			break;
		}
	}
	
	
	wall_post += '<p style="width:auto;float:left;">';
	
	//or POST_UPDATE_TYPE_PROFILE_PHOTO_CHANGED
	// or POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM or POST_UPDATE_TYPE_ALBUM
	// or POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING
	if( 
			post_update_type == 14
			|| post_update_type == 16
			|| post_update_type == 15
			|| post_update_type == 17
	)
	//original_user_data.origi_user_id
	{
		wall_post += wallpost_created_at;
	
		switch (privacy)
		{
			case 1:
			case '1':
				wall_post += '<img class = "privacy_icon" id = "'+wallpost_id+'" src="'+IMAGE_PATH+'/privacy_public_grey.png">';
			break;
			
			case 2:
			case '2':
				wall_post += '<img class = "privacy_icon" id = "'+wallpost_id+'" src="'+IMAGE_PATH+'/privacy_links_grey.png">';
			break;
			
			case 3:
			case '3':
				wall_post += '<img class = "privacy_icon" id = "'+wallpost_id+'" src="'+IMAGE_PATH+'/privacy_links_of_links_grey.png">';
			break;
		}
	}
	
	wall_post += '</p>';
	
	//Privacy options popup starts------
	if( is_my_wallpost == 1 )
	{
		//or POST_UPDATE_TYPE_PROFILE_PHOTO_CHANGED
		// or POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM or POST_UPDATE_TYPE_ALBUM
		// or POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_WHEN_SHARED
		if( post_update_type == 14 || post_update_type == 16 || post_update_type == 15 || post_update_type == 17)
		{
			wall_post += '<div style="position: relative; float: left; margin: 3px 0px 0px 4px;">';
			wall_post += '<img class = "privacy_settings_arrow" src="'+IMAGE_PATH+'/arrow-down-grey.png" onclick = "showPrivacyOptions(this)">';
			wall_post += '<div class="option-pop option-pop3" style="">';
			
			switch (privacy)
			{
				case 1:
				case '1':
					wall_post += '<a href="javascript:;" class="full-screen-view selected" onclick = "ChangePrivacyOfWallpost(this, '+wallpost_id+', 1)"><div class="public selected">&nbsp;</div>Public<span style="margin-left: 5px;" class = "loading">&nbsp;</span></a>';
					wall_post += '<a href="javascript:;" class="full-screen-view" onclick = "ChangePrivacyOfWallpost(this, '+wallpost_id+', 2)"><div class="links">&nbsp;</div>Links<span style="margin-left: 5px;" class = "loading">&nbsp;</span></a>';
					wall_post += '<a href="javascript:;" class="full-screen-view" onclick = "ChangePrivacyOfWallpost(this, '+wallpost_id+', 3)"><div class="links2">&nbsp;</div>Links of Links<span style="margin-left: 5px;" class = "loading">&nbsp;</span></a>';
				break;
				
				case 2:
				case '2':
					wall_post += '<a href="javascript:;" class="full-screen-view" onclick = "ChangePrivacyOfWallpost(this, '+wallpost_id+', 1)"><div class="public">&nbsp;</div>Public<span style="margin-left: 5px;" class = "loading">&nbsp;</span></a>';
					wall_post += '<a href="javascript:;" class="full-screen-view selected" onclick = "ChangePrivacyOfWallpost(this, '+wallpost_id+', 2)"><div class="links selected" >&nbsp;</div>Links<span style="margin-left: 5px;" class = "loading">&nbsp;</span></a>';
					wall_post += '<a href="javascript:;" class="full-screen-view" onclick = "ChangePrivacyOfWallpost(this, '+wallpost_id+', 3)"><div class="links2">&nbsp;</div>Links of Links<span style="margin-left: 5px;" class = "loading">&nbsp;</span></a>';
				break;
				
				case 3:
				case '3':
					wall_post += '<a href="javascript:;" class="full-screen-view" onclick = "ChangePrivacyOfWallpost(this, '+wallpost_id+', 1)"><div class="public">&nbsp;</div>Public<span style="margin-left: 5px;" class = "loading">&nbsp;</span></a>';
					wall_post += '<a href="javascript:;" class="full-screen-view" onclick = "ChangePrivacyOfWallpost(this, '+wallpost_id+', 2)"><div class="links">&nbsp;</div>Links<span style="margin-left: 5px;" class = "loading">&nbsp;</span></a>';
					wall_post += '<a href="javascript:;" class="full-screen-view selected" onclick = "ChangePrivacyOfWallpost(this, '+wallpost_id+', 2)"><div class="links2 selected">&nbsp;</div>Links of Links<span style="margin-left: 5px;" class = "loading">&nbsp;</span></a>';
				break;
				
				default:
					wall_post += '<a href="javascript:;" class="full-screen-view" onclick = "ChangePrivacyOfWallpost(this, '+wallpost_id+', 1)"><div class="public">&nbsp;</div>Public<span style="margin-left: 5px;" class = "loading">&nbsp;</span></a>';
					wall_post += '<a href="javascript:;" class="full-screen-view" onclick = "ChangePrivacyOfWallpost(this, '+wallpost_id+', 2)"><div class="links">&nbsp;</div>Links<span style="margin-left: 5px;" class = "loading">&nbsp;</span></a>';
					wall_post += '<a href="javascript:;" class="full-screen-view" onclick = "ChangePrivacyOfWallpost(this, '+wallpost_id+', 2)"><div class="links2">&nbsp;</div>Links of Links<span style="margin-left: 5px;" class = "loading">&nbsp;</span></a>';
				break;	
			}
			wall_post += '</div>';
			wall_post += '</div>';
		}
		
	}
	//Privacy options popup ends------
	
	//Show text entered while sharing. Text enetered by from_user of post--------------------------------------------------------------------
	// Added by hkaur5
	if(post_update_type == 17)
	{
		wall_post += '<p id = "'+wallpost_id+'" class="text-black editable">';
		if( wall_post_text )
		{	
			wall_post += '<span class = "wallpost_text_cropped" id = "'+wallpost_id+'">'+showCroppedText( wall_post_text, 750, '...<label onclick="showFullWallpostText(this)">See More</label>' )+'</span>';
			wall_post += '<span class = "wallpost_text_full" id = "'+wallpost_id+'">'+wall_post_text+'</span>';
		}
		else
		{
			wall_post += '<span class = "wallpost_text_cropped" id = "'+wallpost_id+'"></span>';
			wall_post += '<span class = "wallpost_text_full" id = "'+wallpost_id+'"></span>';
		}	
		wall_post += '</p>';
		
		//Text editing.
		wall_post += '<div class = "wallpost_editor" id = "'+wallpost_id+'">';
		wall_post += '<textarea id="edit_photo_text_'+wallpost_id+'" name="edit_photo_text" maxlength="255">' + wall_post_text + '</textarea>';
		wall_post += '<div class="wall-editor-btn">';
		wall_post += '<input class="btn-purple" type = "button" name = "save" value = "Done Editing" id = "'+wallpost_id+'" onclick = "saveWallpostEditing( this, '+wallpost_id+', 1 )">';
		wall_post += '<a class="new-cancel-btn" id = "'+wallpost_id+'" onclick = "cancelWallpostEditing( this, '+wallpost_id+' )" href="javascript:;">Cancel</a>';
		wall_post += '</div>';
		wall_post += '</div>';
	}
	//---------------------------------------------------------------------------------------------------------------------------------
	wall_post += '</div>';
	
	//wallpost edit/delete popup start-------
	if( is_my_wallpost == 1 )
	{
		//POST_UPDATE_TYPE_PHOTO or POST_UPDATE_TYPE_SHARED_PHOTO
		//or POST_UPDATE_TYPE_PROFILE_PHOTO_CHANGED
		// or POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM or POST_UPDATE_TYPE_ALBUM
		// or POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING
		if( post_update_type == 14 
				|| post_update_type == 16 
				|| post_update_type == 15 
				|| post_update_type == 17 
				)
		{
			wall_post += '<div class="dashboard-sharelink-arrow">';
			wall_post += '<img onclick = "showEditDeleteOptionsForWallpost(this)" src="'+IMAGE_PATH+'/arrow-down2.png" style = "cursor : pointer" />';
			
			wall_post += '<div class="option-pop2" style="">';
			wall_post += '<a href="javascript:;" class="full-screen-view" onclick = "confirmToDelete( this, '+wallpost_id+' )">Delete<span style="margin-left: 5px;" class = "loading">&nbsp;</span></a>';
			wall_post += '<a href="javascript:;" class="full-screen-view" onclick = "showWallpostEditBox( this, '+wallpost_id+' )">Edit Post<span style="margin-left: 5px;" class = "loading">&nbsp;</span></a>';
			wall_post += '</div>';
			
			wall_post += '</div>';
		}
	}
	//wallpost edit/delete popup end-------
	
	wall_post += '</div>';

	wall_post += '<div class="news-update-content-text">';

	switch ( post_update_type )
	{
		
		//POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM or POST_UPDATE_TYPE_ALBUM
		case 16:
		case 15:
			wall_post += '<p id = "'+wallpost_id+'" class="editable">';
			if( wall_post_text )
			{
				wall_post += '<span class = "wallpost_text_cropped" id = "'+wallpost_id+'">'+showCroppedText( wall_post_text, 750, '...<label onclick="showFullWallpostText(this)">See More</label>' )+'</span>';
				wall_post += '<span class = "wallpost_text_full" id = "'+wallpost_id+'">'+wall_post_text+'</span>';
			}
			else
			{
				wall_post += '<span class = "wallpost_text_cropped" id = "'+wallpost_id+'"></span>';
				wall_post += '<span class = "wallpost_text_full" id = "'+wallpost_id+'"></span>';
			}
			wall_post += '</p>';
			
			wall_post += '<div class = "wallpost_editor" id = "'+wallpost_id+'">';
			wall_post += '<textarea class="edit_photo_text"  id="edit_photo_text_'+wallpost_id+'" name="edit_photo_text" maxlength="255">' + wall_post_text + '</textarea>';
			wall_post += '<div class="wall-editor-btn">';
			wall_post += '<input class="btn-purple" type = "button" name = "save" value = "Done Editing" id = "'+wallpost_id+'" onclick = "saveWallpostEditing( this, '+wallpost_id+', 1 )">';
			wall_post += '<a class="new-cancel-btn" id = "'+wallpost_id+'" onclick = "cancelWallpostEditing( this, '+wallpost_id+' )" href="javascript:;">Cancel</a>';
			wall_post += '</div>';
			wall_post += '</div>';
			
			if ( typeof collage_images != "undefined" )
			{	
				wall_post += getCollageHTML( collage_images, first_img_portrait_or_landscape );
			}
			
			break;
		
			// POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING
		case 17:
			
			//-------------------------------------------------------------------------------------------------
			// Original user data - profile photo, name and post text.
			//-------------------------------------------------------------------------------------------------
			wall_post +='<div class="original_user_data">';
			
			//Original user profile photo--------------
			wall_post += '<div style="" class="original_user_img_outer">';
			wall_post += '<div class="original_user_img news-update-content-icon short_profile_border">';
			
			if( user_type != 5){	
				var parameter_json = "{'user_id':"+original_user_data.origi_user_id+"}";
				wall_post += '<a disable-border="1" title = "' + original_user_data.origi_user_name + '" id="'+original_user_data.origi_user_id+'" href = "javascript:" onclick="getShortProfile(this,'+parameter_json+')" >';
				wall_post += '<img src="' + original_user_data.origi_profile_pic + '"/>';
				wall_post += '</a>';
			}else{
				wall_post += '<img title = "' + original_user_data.origi_user_name + '" src="' + original_user_data.origi_profile_pic + '"/>';
			}
			
			//Short profile view popup holder
			wall_post += '<div id="view-outer_'+original_user_data.origi_user_id+'" class="quickview-outer" popup-state="off" style="display:none;">';
			wall_post += '<div class="popupArrow">';
			wall_post += '<img width="36" height="22" src="'+IMAGE_PATH+'/arrow-purple2.png">';
			wall_post += '</div>';
			wall_post += '<div id="view_'+original_user_data.origi_user_id+'" class="quickview"> </div>';
			wall_post += '</div>';
			
			wall_post += '</div>';//original_user_img end.
			wall_post += '</div>';//outer div end
			
			//End - Original user profile photo--------------
			
			//Original user name and post text.--------------
			wall_post +='<div class="original_user_detail">';
		
			//Original user name
			wall_post += '<p class="original_user_name">';
			if(original_user_data.origi_user_type != 5 )
			{
				wall_post += '<a class="fnt-bold text-purple2" href="/'+PROJECT_NAME+'profile/iprofile/id/'+ original_user_data.origi_user_id +'" style="text-decoration: none !important;">' + original_user_data.origi_user_name + '</a>';
			}
			else
			{
				wall_post += '<a class="fnt-bold text-purple2" href="javascript:void(0);" style="cursor:default;text-decoration: none !important;">' + original_user_data.origi_user_name + '</a>';
				
			}
			wall_post += '</p>';
			wall_post += '<p class="original_user_post_time" style="">'+original_user_data.origi_post_created_at+'</p>';
			//original post text
			wall_post += '<p class="original_user_post_text" id = "'+wallpost_id+'" class="non_editable">';
			if(wallpost_text_when_shared != null)
			{
				wall_post += '<span class = "wallpost_text_when_shared_cropped" id = "'+wallpost_id+'">'+showCroppedText( wallpost_text_when_shared, 750, '...<label onclick="showFullWallpostText(this)">See More</label>' )+'</span>';
				wall_post += '<span class = "wallpost_text_when_shared_full" id = "'+wallpost_id+'">'+wallpost_text_when_shared+'</span>';
			}
			wall_post += '</p>';
			
			wall_post +='</div>';//original_user_detail div ends
			
			wall_post +='</div>';
			//-------------------------------------------------------------------------------------------------
			// END - Original user data - profile photo, name and post text.
			//-------------------------------------------------------------------------------------------------
			
			//Original post content.
			if ( typeof collage_images != "undefined" )
			{	
				wall_post += getCollageHTML( collage_images, first_img_portrait_or_landscape );
			}
			

			break;
			
			// On profile photo change, automatic post on wall.
		case 14:
			wall_post += '<p id = "'+wallpost_id+'" class="editable">';
			if(wall_post_text != null)
			{
				wall_post += '<span class = "wallpost_text_cropped" id = "'+wallpost_id+'">'+showCroppedText( wall_post_text, 750, '...<label onclick="showFullWallpostText(this)">See More</label>' )+'</span>';
				wall_post += '<span class = "wallpost_text_full" id = "'+wallpost_id+'">'+wall_post_text+'</span>';
			}
			else
			{
				wall_post += '<span class = "wallpost_text_cropped" id = "'+wallpost_id+'"></span>';
				wall_post += '<span class = "wallpost_text_full" id = "'+wallpost_id+'"></span>';
			}	
			wall_post += '</p>';
			
			wall_post += '<div class = "wallpost_editor" id = "'+wallpost_id+'">';
			wall_post += '<textarea class="edit_photo_text"  id="edit_photo_text_'+wallpost_id+'" name="edit_photo_text" maxlength="255">' + wall_post_text + '</textarea>';
			wall_post += '<div class="wall-editor-btn">';
			wall_post += '<input class="btn-purple" type = "button" name = "save" value = "Done Editing" id = "'+wallpost_id+'" onclick = "saveWallpostEditing( this, '+wallpost_id+', 1 )">';
			wall_post += '<a class="new-cancel-btn" id = "'+wallpost_id+'" onclick = "cancelWallpostEditing( this, '+wallpost_id+' )" href="javascript:;">Cancel</a>';
			wall_post += '</div>';
			wall_post += '</div>';
		
			wall_post += '<div class="news-update-img">';
			wall_post += '<div class = "photo_aligner">';
			if( is_my_wallpost )
			{
				wall_post += '<a class="" onclick = "showPhotoDetail( '+wallpost_id+', '+"'id_of_wallpost'"+', 1);"  href="javascript:;">';
			}
			else
			{
				wall_post += '<a class="" onclick = "showPhotoDetail( '+wallpost_id+', '+"'id_of_wallpost'"+', 0);"  href="javascript:;">';
			}
			wall_post += '<img src="' + collage_images[0].image_path + '"/>';
			wall_post += '</a>';		
			wall_post += '</div>';
			wall_post += '</div>';
			break;
		
		//POST_UPDATE_TYPE_WISH
		case 11:
			switch ( wish_data.wish_type ) 
			{
				//new_link_wishes
				case 1:
				case '1':
					wall_post += '<p class="wish-img-text-outer">';
						wall_post += '<div class="wish-img-text-lt">';
						wall_post += '<img src="'+wish_data.link_ilook_user_medium_photo+'" width = "100" height = "100" >';
						wall_post += '</div>';
						wall_post += '<div class="wish-img-text-rt">';
						wall_post += '<h4><a class="wish-img-text-rt-link"href="/'+PROJECT_NAME+'profile/iprofile/id/'+wish_data.link_ilook_user_id+'">'+wish_data.link_ilook_user_name+'</a></h4>';
						wall_post += '<p>'+wish_data.link_ilook_user_professional_info+'</p>';
						wall_post += '</div>';
					wall_post += '</p>';
				break;
				
				//new_job_wishes
				case 2:
				case '2':
				//job_anniversary_wishes
				case 3:
				case '3':
				//birthday_wishes
				case 5:
				case '5':				
					wall_post += '<p class="wish-img-text-outer">';
					wall_post += wish_data.underlying_text;
					wall_post += '</p>';
				break;
			}
		break;
		
		default:
		break;
	}
		
	wall_post += '<div class="news-update-likes news-likes">';
	wall_post += '<div class="fl  text-purple">';
	
	//Ok Comment share starts here------------
	if( is_ok_comment_share_pannel_visible )
	{
		//OK div starts
		//POST_UPDATE_TYPE_PROFILE_PHOTO_CHANGED or POST_UPDATE_TYPE_ALBUM
		// or POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING
		if( 
				post_update_type == 14 
				|| post_update_type == 16 
				|| post_update_type == 15 
				|| post_update_type == 17 
			)
		{
			
			wall_post += '<div class="ok">';
			wall_post += '<div style = "display:inline-block;">';
			
			if( did_i_liked_this == 1 )
			{
				wall_post += '<a style = "" href="javascript:;" class = "not_ok" onclick = "notOkTheWallpost( '+wallpost_id+', this );" rel = "'+wallpost_id+'" ><span>&nbsp;</span>Unok</a>';
				wall_post += '<a style = "display:none;" href="javascript:;" class = "ok" onclick = "okTheWallpost( '+wallpost_id+', this );" rel = "'+wallpost_id+'" ><span>&nbsp;</span>Ok</a>';
			}
			else
			{
				wall_post += '<a style = "" href="javascript:;" class = "ok" onclick = "okTheWallpost( '+wallpost_id+', this );" rel = "'+wallpost_id+'" ><span>&nbsp;</span>Ok</a>';
				wall_post += '<a style = "display:none;" href="javascript:;" class = "not_ok" onclick = "notOkTheWallpost( '+wallpost_id+', this );" rel = "'+wallpost_id+'" ><span>&nbsp;</span>Unok</a>';
			}
			
			wall_post += '</div>';
			wall_post += '<div style = "display:inline-block; float: right;" class = "like_count" id = "'+wallpost_id+'">';
			if( like_count > 0 )
			{
				wall_post += '<a href="javascript:;" onclick = "openWhoLikedPopupByWallpostId(' + wallpost_id + ')" >('+ like_count +')</a>';
			}
			else
			{
				wall_post += '<a href="javascript:;" style = "display : none;" onclick = "openWhoLikedPopupByWallpostId(' + wallpost_id + ')" >('+ 0 +')</a>';
			}
			wall_post += '</div>';
			wall_post += '</div>';	
		}
		else if( post_update_type == 11 )//POST_UPDATE_TYPE_WISH
		{
			wall_post += '<div class="ok">';
			wall_post += '<div style = "display:inline-block;">';
			
			if( did_i_liked_this == 1 )
			{
				wall_post += '<a style = "" href="javascript:;" class = "not_ok" onclick = "notOkTheWallpostOfTypeWish( '+wallpost_id+', this, 2 );" rel = "'+wallpost_id+'" ><span>&nbsp;</span>Unok</a>';
				wall_post += '<a style = "display:none;" href="javascript:;" class = "ok" onclick = "okTheWallpostOfTypeWish( '+wallpost_id+', this, 2 );" rel = "'+wallpost_id+'" ><span>&nbsp;</span>Ok</a>';
			}
			else
			{
				wall_post += '<a style = "" href="javascript:;" class = "ok" onclick = "okTheWallpostOfTypeWish( '+wallpost_id+', this, 2 );" rel = "'+wallpost_id+'" ><span>&nbsp;</span>Ok</a>';
				wall_post += '<a style = "display:none;" href="javascript:;" class = "not_ok" onclick = "notOkTheWallpostOfTypeWish( '+wallpost_id+', this, 2 );" rel = "'+wallpost_id+'" ><span>&nbsp;</span>Unok</a>';
			}
			
			wall_post += '</div>';
			wall_post += '<div style = "display:inline-block; float: right;" class = "like_count" id = "'+wallpost_id+'">';
			if( like_count > 0 )
			{
				wall_post += '<a href="javascript:;" onclick = "openWhoLikedPopupByWallpostId(' + wallpost_id + ')" >('+ like_count +')</a>';
			}
			else
			{
				wall_post += '<a href="javascript:;" style = "display : none;" onclick = "openWhoLikedPopupByWallpostId(' + wallpost_id + ')" >('+ 0 +')</a>';
			}
			wall_post += '</div>';
			wall_post += '</div>';	
		}
		//OK div ends
		
		
		wall_post += '<div class="comments">';
		if( comment_count > 0 )
		{
			wall_post += '<a href="javascript:;" class = "add_comment">Comment</a><span id = "comment_count_'+wallpost_id+'" >('+comment_count+')</span>';
		}
		else
		{
			wall_post += '<a href="javascript:;" class = "add_comment">Comment</a><span id = "comment_count_'+wallpost_id+'"></span>';
		}
		wall_post += '</div>';
		//wall_post += '</div>';
		
		
		//POST_UPDATE_TYPE_PROFILE_PHOTO_CHANGED
		// or POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM or POST_UPDATE_TYPE_ALBUM
		// or POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING
		if( post_update_type == 14 
				|| post_update_type == 16 
				|| post_update_type == 15 
				|| post_update_type == 17 
				)
		{
			wall_post += '<div class="share">';
			wall_post += '<div style = "display:inline-block;">';
			wall_post += '<a rel="" onclick="shareThisPostByWallpostId( '+wallpost_id+', this )" class="share" href="javascript:;" style=""><span>&nbsp;</span>Share</a>';
			wall_post += '</div>';
			wall_post += '<div style = "display:inline-block; float: right; margin-left:3px;" class = "share_count">';
			if( share_count > 0 )
			{
				//wall_post += '<a href="javascript:;" onclick = "openWhoSharedPopup(' + wallpost_id + ')" ><span id = "wallpost_' + wallpost_id + '" class = "bg-none">('+share_count+')</span></a>';
				wall_post += '<a href="javascript:;" rel = "share_count_'+wallpost_id+'" onclick = "openWhoSharedPopup(' + wallpost_id+', this)" >('+share_count+')</a>';
			}
			else
			{
				wall_post += '<a href="javascript:;" rel = "share_count_'+wallpost_id+'" onclick = "openWhoSharedPopup(' + wallpost_id + ', this)" ></a>';		
			}	
			wall_post += '</div>';
			wall_post += '</div>';
		}
	}
	else
	{
		wall_post += '<p style="float:left; width:100%;">&nbsp;</p>';
	}
	//Ok Comment share ends here------------   
	
	// report abuse  starts here-------------------------
	// or POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM or POST_UPDATE_TYPE_ALBUM
	// or POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING
	if( post_update_type == 14 
			|| post_update_type == 16 
			|| post_update_type == 15 
			|| post_update_type == 17 
			)
	{
		if(is_wallpost_reported_abuse==0)
		{
			var abusetxt="Report Abuse";
//			var abuseprop='onclick="abuseReportWallPost('+wallpost_id+','+user_id+')"';
			var abuseprop='onclick="showReportAbuseOptions(this)"';
		}
		else
		{
			var abusetxt="Reported as abuse";
			var abuseprop='';
		}
		//do not show report abuse option on own post ,admin posts and on wish posts
		if( user_type!= 5 
			&& user_id != $("input[type=hidden]#my_user_id").val() 
			&& original_user_data.origi_user_id != $("input[type=hidden]#my_user_id").val()
			)
		{
		wall_post += '<div class="report-abuse '+wallpost_id+'">';
		wall_post += '<a rel2="'+post_update_type+'" rel1="'+wallpost_id+'" rel="'+user_id+'"  name="abuse_'+wallpost_id+'" href="javascript:;" '+abuseprop+' ><span>&nbsp;</span><div class="abuse-text '+wallpost_id+'">'+abusetxt+'</div> </a>';
		wall_post += '</div>';
		}
		// report abuse  ends here--------------------
	
	}
	
    
	wall_post += '</div>';
    wall_post += '</div>';
    wall_post += '</div>';
    //Comments Outer Box Starts Here.
	
	wall_post += '<div class="comment-box-outer ">';
	
	
	//Likers string.
	if( typeof likers_string != 'undefined' && likers_string != "" )
	{
		if( likers_string.length > 0 )
		{	
			wall_post += '<div class="people-who-liked" id = "'+wallpost_id+'">';
			wall_post += '<img src="'+IMAGE_PATH+'/tick-grey.png" align="absmiddle" />';	
			wall_post += '<span>';
			wall_post += likers_string;
			wall_post += '</span>';
			wall_post += '</div>';
		} 
		else
		{
			wall_post += '<div class="people-who-liked" id = "'+wallpost_id+'" style = "display:none;">';
			wall_post += '<img src="'+IMAGE_PATH+'/tick-grey.png" align="absmiddle" />';	
			wall_post += '<span>';
			wall_post += '</span>';
			wall_post += '</div>';
		}
	}
	else
	{
		wall_post += '<div class="people-who-liked" id = "'+wallpost_id+'" style = "display:none;">';
		wall_post += '<img src="'+IMAGE_PATH+'/tick-grey.png" align="absmiddle" />';	
		wall_post += '<span>';
		wall_post += '</span>';
		wall_post += '</div>';
	}
	
	
//  Comments section starts here.
	if( comment_count >= 1 )
	{
		wall_post += '<input type="hidden" name="offsettt_comm_'+wallpost_id+'" value="2" id="offsettt_comm_'+wallpost_id+'"/>';
		wall_post += '<div class="ok-comment-box" id = "comment_box_'+wallpost_id+'">';
    	wall_post += '<div class="ok-comment-box-bot ">';
    
	    if( comment_count > 2 )
	    {
	    	wall_post += '<div id = "load_more_comments_'+wallpost_id+'">';
	    	wall_post += '<div class="ok-comment-box-bot-left"><img src="'+IMAGE_PATH+'/comments--grey.png"  align="absmiddle" />';
	    	wall_post += '</div>';
	    	wall_post += '<div class="ok-comment-box-bot-right" style = "cursor:pointer;" onclick = loadMoreComments('+wallpost_id+',this)> View more comments</div>';
	    	wall_post += '</div>';
	    }
	    
	    wall_post += '<div id="comments_outer_'+wallpost_id+'">';
	    
	  
	    for( j in comments_json )
	    {
	    	if( comments_json[j]['is_hidden'] == 0 )
	    	{
	    		wall_post += '<div class="comments-outer comments-outer_'+comments_json[j]['id']+'" id="comments-outer_'+comments_json[j]['id']+'" rel="'+comments_json[j]['id']+'">';
			    
		    	//wall_post += '<a href = "/'+PROJECT_NAME+'profile/iprofile/id/'+comments_json[j]['user_id']+'"><div class="img" title = "'+comments_json[j]['user_name']+'"><div><img src="' + comments_json[j]['user_prof_image_path'] + '" width="" height="" /></div></div></a>';
	    		
	    		var parameter_json = "{'user_id':"+comments_json[j]['user_id']+"}";
	    		if(comments_json[j]['is_user_image_clickable'])
	    		{
	    		wall_post += '<a disable-border="1" id="'+comments_json[j]['user_id']+'" title = "'+comments_json[j]['user_name']+'" href = "javascript:" onclick="getShortProfile(this,'+parameter_json+')" >';
	    		wall_post += '<div class="img img32 short_profile_border" title = "'+comments_json[j]['user_name']+'"><img src="' + comments_json[j]['user_prof_image_path'] + '" width="" height="" /></div>';
	    		wall_post += '</a>';
	    		}
	    		else
    			{
		    		wall_post += '<div class="img img32 short_profile_border" title = "'+comments_json[j]['user_name']+'"><img src="' + comments_json[j]['user_prof_image_path'] + '" width="" height="" /></div>';
    			}
	    		//Short profile view popup holder
	    		wall_post += '<div id="view-outer_'+comments_json[j]['user_id']+'" class="quickview-outer" popup-state="off" style="display:none;">';
	    		wall_post += '<div class="popupArrow">';
	    		wall_post += '<img width="36" height="22" src="'+IMAGE_PATH+'/arrow-purple2.png">';
	    		wall_post += '</div>';
	    		wall_post += '<div id="view_'+comments_json[j]['user_id']+'" class="quickview"> </div>';
	    		wall_post += '</div>';
	    		
			    //wall_post += '<div class="text"><div class="comment-text1" id = "idd_'+comments_json[j]['id']+'" rel = "'+comments_json[j]['id']+'"><span>'+comments_json[j]['user_name']+'</span>';
			    wall_post += '<div class="text"><div class="comment-text1" id = "idd_'+comments_json[j]['id']+'" rel = "'+comments_json[j]['id']+'">';
		    	wall_post += '<span><a href = "/'+PROJECT_NAME+'profile/iprofile/id/'+comments_json[j]['user_id']+'">'+comments_json[j]['user_name']+'</a></span>';
		    	wall_post += '<div class = "comment_text" id = "'+comments_json[j]['id']+'">';
		    	wall_post += showCroppedText( comments_json[j]['text'], 150, "...<label class = 'show_full_comment' onclick = 'showFullComment(this)'>>></label>");
		    	wall_post += '</div>';
		    	wall_post += '<div class = "full_comment_text" style = "display:none" id = "'+comments_json[j]['id']+'">';
		    	wall_post += comments_json[j]['text'];
		    	wall_post += '</div>';
		    	
		    	wall_post += '</div>';
		    	wall_post += '<textarea maxlength="255" cols="1" class="comment-textarea" rows="1" id = "id_'+comments_json[j]['id']+'" rel = "'+comments_json[j]['id']+'" style = "  resize: vertical; display:none;" >'+comments_json[j]['text']+'</textarea>';
		    	wall_post += '<div class="comments-date">'+comments_json[j]['created_at']+'</div>';
		    	wall_post += '</div>';
		    	if( comments_json[j]['user_id'] == $("input[type=hidden]#my_user_id").val() )
		    	{
		    		wall_post += '<div class="edit_comment">';
		    		wall_post += '<div class="edit-popup-outer" style="bottom:-85px; width:78px; padding:5px; right: -7px; text-align:left; z-index:99999">';
		    		wall_post += '<div class="edit-popup-arrow" style=" margin:0 0 0 55px"><img width="26" height="16" src="'+IMAGE_PATH+'/arrow-up-grey2.png"></div>';
		    		wall_post += '<div class="edit-popup" style="width: 65px; padding:5px;">';
		    		wall_post += '<div class="edit-popup-col1">';
		    		wall_post += '<h5 style="text-transform: none !important;"><a style="font-size:12px;" class="text-grey2-link edit_comment_link" href="javascript:;">Edit</a></h5>';
		    		wall_post += '</div>';
		    		wall_post += '<div class="edit-popup-col1">';
		    		wall_post += '<h5 style="text-transform: none !important;"><a style="font-size:12px;" class=" text-grey2-link delete_comment_link" href="javascript:;" rel = "'+comments_json[j]['id']+'">Delete</a></h5>';
		    		wall_post += '</div>';
		    		wall_post += '</div>';
		    		wall_post += '</div>';
		    		wall_post += '</div>';
		    	}
		    	else
		    	{
		    		wall_post += '<div style="text-align: right;" class="hide_comment"><img title="Hide comment" src="'+IMAGE_PATH+'/cross-grey.png"></div>';
		    	}	
		    
		    	
		    	wall_post += '</div>';
	    	}
	    	else
	    	{
	    		wall_post += '<div class="comments-outer comments-outer_'+comments_json[j]['id']+' hidden_comment "  id="comments-outer_'+comments_json[j]['id']+'"  rel="'+comments_json[j]['id']+'"><span rel="'+comments_json[j]['id']+'" class="" onclick="showComments(this);" title = "Hidden Comment [Hidden on your wall]">...</span></div>';
	    	}
	    }
	    
	    wall_post += '</div>';
	    wall_post += '</div>';
	    wall_post += '</div>';
    }
	else
	{
		wall_post += '<div class="ok-comment-box" id = "comment_box_'+wallpost_id+'" style = "display : none;">';
    	wall_post += '<div class="ok-comment-box-bot ">';
	    wall_post += '<div id="comments_outer_'+wallpost_id+'">';
	    //Append comments here.
	    wall_post += '</div>';
	    wall_post += '</div>';
	    wall_post += '</div>';
	}
//  Comments section ends here.


	
//  write comment Starts
	if( is_ok_comment_share_pannel_visible )
	{
		wall_post += '<div class="comment-write-outer">';
		wall_post += '<form id = "comment_box_'+wallpost_id+'">';
		wall_post += '<input type = "hidden" name = "wallpost_id" value = "'+wallpost_id+'"/>';
		wall_post += '<div class="comment-write-left ">';
		wall_post += '<img width="" height="" src="' + $("input[type=hidden]#my_small_image").val() + '">';
		wall_post += '</div>';
		wall_post += '<div class="comment-write-right ">';
		
		//POST_UPDATE_TYPE_PROFILE_PHOTO_CHANGED
		// or POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM or POST_UPDATE_TYPE_ALBUM
		// or POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING
		if( post_update_type == 14 
				|| post_update_type == 16 
				|| post_update_type == 15 
				|| post_update_type == 17 
				)
		{
			wall_post += '<textarea name="comment" maxlength="255" class="comment-textarea" placeholder = "Write a comment..." onkeydown="javascript: if(event.keyCode == 13) addComment( '+wallpost_id+', this, event );"></textarea>';
		}
		else if( post_update_type == 11 )//POST_UPDATE_TYPE_WISH
		{
			wall_post += '<textarea name="comment" maxlength="255" class="comment-textarea" placeholder = "Write a comment..." onkeydown="javascript: if(event.keyCode == 13) addCommentToTheWallpostOfTypeWish( '+wallpost_id+', this, event, 2 );"></textarea>';
		}
			wall_post += '<div class="enter-post">';
			wall_post += 'Press Enter to Post';
			wall_post += '</div>';
		wall_post += '</div>';
	wall_post += '</form>';
	wall_post += '</div>';
	}
//  write comment Ends
	
	wall_post += '</div>';
	
//  Comments Outer Box ends here.    
    
	return wall_post;
}

/**
 * Loads ten updates/wallposts on your wall,
 * depending on which last set of 10
 * updates loaded before.
 * 
 * @param integer offset [ tells which set of 10 new updates to load. ]
 * @author jsingh7
 * @version 1.0
 */
function loadImageFeedsOnWall( offset )
{
	offset = typeof offset !== 'undefined' ? offset : 0;
//	return;
	var loading_div = '<div style ="height:500px" class="loading_updates">';
	loading_div += '<div><img src = "' + IMAGE_PATH + '/loading_medium_purple.gif"><lable>Loading...</lable></div>';
	loading_div += '</div>';
	$("div#updates_holder").html( loading_div );
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "socialise/get-my-imagefeeds",
        type: "POST",
        dataType: "json",
        data: { 'offset' : offset },
//		cache: false,
        timeout: 50000,
        success: function(jsonData) {
        	var wall_post = "";
        	if( jsonData.data != 0 )
        	{        		
        		$("div#updates_holder").html("");
	        	for( i in jsonData.data.wallpost )
	        	{
	        		wall_post = imageFeedWallPostMaker( jsonData.data.wallpost[i].id,
	        											jsonData.data.wallpost[i].wallpost_user_id, 
	        											jsonData.data.wallpost[i].wallpost_user_type,
	        											jsonData.data.wallpost[i].wallpost_user_name, 
	        											jsonData.data.wallpost[i].wallpost_user_gender,
	        											jsonData.data.wallpost[i].wallpost_user_prof_image_path, 
	        											jsonData.data.wallpost[i].collage,
	        											jsonData.data.wallpost[i].wallpost_text,
	        											jsonData.data.wallpost[i].wall_post_text_when_shared,
	        											jsonData.data.wallpost[i].created_at,
	        											0,
	        											jsonData.data.wallpost[i].like_count, 
	        											jsonData.data.wallpost[i].comment_count, 
	        											jsonData.data.wallpost[i].share_count, 
	        											jsonData.data.wallpost[i].wallpost_comments,
	        											jsonData.data.wallpost[i].did_I_liked,
	        											jsonData.data.wallpost[i].likers_string,
	        											jsonData.data.wallpost[i].is_ok_comment_share_pannel_visible,
	        											jsonData.data.wallpost[i].visibility_criteria,
	        											jsonData.data.wallpost[i].is_my_wallpost,
	        											jsonData.data.wallpost[i].post_update_type,
	        											jsonData.data.wallpost[i].wish,
	        											jsonData.data.wallpost[i].is_wallpost_reported_abuse,
	        											jsonData.data.wallpost[i].first_img_portrait_or_landscape,
	        											{
	        												'origi_user_id': jsonData.data.wallpost[i].original_user.id,
	        												'origi_user_name': jsonData.data.wallpost[i].original_user.fullname,
	        												'origi_user_type': jsonData.data.wallpost[i].original_user.user_type,
	        												'origi_profile_pic': jsonData.data.wallpost[i].original_user.profile_photo,
	        												'origi_post_created_at': jsonData.data.wallpost[i].original_user.post_created_at
	        											},
	        											jsonData.data.wallpost[i].album_id,
	        											jsonData.data.wallpost[i].album_name,
	        											jsonData.data.wallpost[i].album_display_name,
	        											{
	        												'sharer_string':jsonData.data.wallpost[i].sharers_string.string,
	        												'shared_from_wallpost_exist':jsonData.data.wallpost[i].sharers_string.shared_from_wallpost_exist
	        											}
	        										);
	        				
	        		$("div#updates_holder").append( wall_post );
	        	}
//	        	showComments();	
	        	$("input#offsettt").val( parseInt( $("input#offsettt").val() ) + parseInt( i ) );
	        	$("input#offsettt").val( parseInt( $("input#offsettt").val() ) + 1 );
	        	
	        	// Is there need to show "Load more records" div.
	        	if( jsonData.is_there_more_recs == 1 )
	        	{
	        		var show_more_div = '<div class="show_more">';
	        		show_more_div += '<div><span id = "show_more">Show more</span></div>';
	        		show_more_div += '</div>';
	        		
	        		$("div#updates_holder").append( show_more_div );
	        	}
	        	else
	        	{
	        		var no_more_div = '<div class="no_more">';
	        		no_more_div += '<div><span id = "no_more">No more updates available.</span></div>';
	        		no_more_div += '</div>';
	        		
	        		$("div#updates_holder").append( no_more_div );
	        	}
	        	//Load more updates.
	        	$("div#updates_holder div.show_more").click( function(){
	        		loadMoreImageFeedsOnWall( $("input#offsettt").val() );		
	        	});
        	}
        	else
        	{
        		$("div#updates_holder div.loading_updates div").html("<span>No News available.</span>");
        	}
        	
        	activateCommentActions();
        	
        	//Resizing the wall thumbnails with jquery.
        	$( 'img.require_jquery_thumbnail_processing' ).each(function( index ) {
	        	jQuery( this ).nailthumb(
	        			{
	        				onStart:function(container){
	        					
	                        },
	                        width: $(this).attr('rel_width'),
	                        height: $(this).attr('rel_height'),
	                        method:'crop',
	        				onFinish:function(container){
	                            container.children().removeClass('require_jquery_thumbnail_processing');
	                        }
	        			}
	        		);
	        });
        	
        },
        error: function(xhr, ajaxOptions, thrownError) {
        	showDefaultMsg( "Failure while loading photo feeds, Please try again.", 3 );
        }
	});
}

/**
 * Called to load more updates/wallposts,
 * When user click on show more.
 * 
 * @param offset
 * @author jsingh7
 */
function loadMoreImageFeedsOnWall(offset)
{
	offset = typeof offset !== 'undefined' ? offset : 0;
	$("div.show_more").remove();
	var loading_div = '<div class="loading_more_updates">';
		loading_div += '<div><img src = "' + IMAGE_PATH + '/loading_medium_purple.gif"><lable>Loading...</lable></div>';
		loading_div += '</div>';
	$("div#updates_holder").append( loading_div );

	jQuery.ajax({
        url: "/" + PROJECT_NAME + "socialise/get-my-imagefeeds",
        type: "POST",
        dataType: "json",
        data: { 'offset' : offset },
//		cache: false,
        timeout: 50000,
        success: function(jsonData) {
        	var wall_post = "";
        	for( i in jsonData.data.wallpost )
        	{
        		wall_post = imageFeedWallPostMaker(
        				jsonData.data.wallpost[i].id,
						jsonData.data.wallpost[i].wallpost_user_id, 
						jsonData.data.wallpost[i].wallpost_user_type, 
						jsonData.data.wallpost[i].wallpost_user_name, 
						jsonData.data.wallpost[i].wallpost_user_gender,
						jsonData.data.wallpost[i].wallpost_user_prof_image_path, 
						jsonData.data.wallpost[i].collage,
						jsonData.data.wallpost[i].wallpost_text,
						jsonData.data.wallpost[i].wall_post_text_when_shared,
						jsonData.data.wallpost[i].created_at,
						0,
						jsonData.data.wallpost[i].like_count, 
						jsonData.data.wallpost[i].comment_count, 
						jsonData.data.wallpost[i].share_count, 
						jsonData.data.wallpost[i].wallpost_comments,
						jsonData.data.wallpost[i].did_I_liked,
						jsonData.data.wallpost[i].likers_string,
						jsonData.data.wallpost[i].is_ok_comment_share_pannel_visible,
						jsonData.data.wallpost[i].visibility_criteria,
						jsonData.data.wallpost[i].is_my_wallpost,
						jsonData.data.wallpost[i].post_update_type,
						jsonData.data.wallpost[i].wish,
						jsonData.data.wallpost[i].is_wallpost_reported_abuse,
						jsonData.data.wallpost[i].first_img_portrait_or_landscape,
						{
							'origi_user_id': jsonData.data.wallpost[i].original_user.id,
							'origi_user_name': jsonData.data.wallpost[i].original_user.fullname,
							'origi_user_type': jsonData.data.wallpost[i].original_user.user_type,
							'origi_profile_pic': jsonData.data.wallpost[i].original_user.profile_photo,
							'origi_post_created_at': jsonData.data.wallpost[i].original_user.post_created_at
						},
						jsonData.data.wallpost[i].album_id,
						jsonData.data.wallpost[i].album_name,
						jsonData.data.wallpost[i].album_display_name,
						{
							'sharer_string':jsonData.data.wallpost[i].sharers_string.string,
							'shared_from_wallpost_exist':jsonData.data.wallpost[i].sharers_string.shared_from_wallpost_exist
						}
					);
        		$("div#updates_holder").append( wall_post );
        	}
        	
        	$("input#offsettt").val( parseInt( $("input#offsettt").val() ) + parseInt( i ) );
        	$("input#offsettt").val( parseInt( $("input#offsettt").val() ) + 1 );
        	
        	$("div.loading_more_updates").remove();
        	
        	// Is there need to show "Load more records" div.
        	if( jsonData.is_there_more_recs == 1 )
        	{
        		var show_more_div = '<div class="show_more">';
        		show_more_div += '<div><span id = "show_more" rel = "">Show more</span></div>';
        		show_more_div += '</div>';
        		
        		$("div#updates_holder").append( show_more_div );
        	}
        	else
        	{
        		var no_more_div = '<div class="no_more">';
        		no_more_div += '<div><span id = "no_more" rel = "">No more updates.</span></div>';
        		no_more_div += '</div>';
        		
        		$("div#updates_holder").append( no_more_div );
        	}
        	//Load more updates.
        	$("div#updates_holder div.show_more").click( function(){
        		loadMoreImageFeedsOnWall( $("input#offsettt").val() );		
        	});
        	
        	activateCommentActions();
        	
        	//Resizing the wall thumbnails with jquery.
        	$( 'img.require_jquery_thumbnail_processing' ).each(function( index ) {
	        	jQuery( this ).nailthumb(
	        			{
	        				onStart:function(container){
	        					
	                        },
	                        width: $(this).attr('rel_width'),
	                        height: $(this).attr('rel_height'),
	                        method:'crop',
	        				onFinish:function(container){
	                            container.children().removeClass('require_jquery_thumbnail_processing');
	                        }
	        			}
	        		);
	        });
        },
        error: function(xhr, ajaxOptions, thrownError) {
        	$("div.message_box").remove();
        	showDefaultMsg( "Failure while loading photo feeds, Please try again.", 3 );
        }
	});
}

function okTheWallpost( wallpost_id, elem )
{
	//	var idd = addLoadingImage( $(elem), 'before', 'tiny_loader.gif', 0, 0 );
	if( ok_notOK_call_1 )
	{	
		if( ok_notOK_call_1.state() != "resolved" )
		{
			return;
		}
	}
	
	$(elem).hide();
	$(elem).siblings("a.not_ok").fadeIn();
	
	
	ok_notOK_call_1 = jQuery.ajax({
        url: "/" + PROJECT_NAME + "socialise/ok-the-wallpost",
        type: "POST",
        dataType: "json",
        data: { 'wallpost_id' : wallpost_id },
//		cache: false,
        timeout: 50000,
        success: function(jsonData) {
        	if( jsonData.is_success == 2 )
			{
				showDialogMsg('Oops!', "The action can not be performed because this post has been removed.", 3000,
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
				    height: 200,
				    width: 300
					}		
				);
				return;
			}
        	else if( jsonData.is_success == 1 )
        	{
//        		Incrementing count.
        		var updated_count = parseInt( $(elem).parent().siblings("div.like_count").children("a").text().replace(/[\])}[{(]/g,'') )+1;
        		$ (elem).parent().siblings("div.like_count").children("a").text("("+updated_count+")");
        		$(elem).parent().siblings("div.like_count").children("a").fadeIn();
        		
        		//Updating likers string.
        		$("div#"+wallpost_id+".people-who-liked").fadeIn();
        		$("div#"+wallpost_id+".people-who-liked span").html(jsonData.likers_string);
				
				//Ajax call for sending 'ok' notification to wallpost owner 
				//and users who have done any activity on it.
				jQuery.ajax({
					url: "/" + PROJECT_NAME + "notifications/send-ok-notification",
					type: "POST",
					dataType: "json",
					data: { 'wallpost_id' : wallpost_id },
					success: function(jsonData) {
						
					}
				});
				
        	}
        	else
        	{
        		//alert("An error occured. Please try again.");
        	}	
        },
        error: function(xhr, ajaxOptions, thrownError) {
        	
        }
	});

}

/**
 * 
 * 
 * @param item_id
 * @param elem
 * @param wish_or_wallpost_id( 1 means wish_id passed, 2 means wallpost_id passed )
 * 
 * @author jsingh7
 */
function okTheWallpostOfTypeWish( item_id, elem, wish_or_wallpost_id )
{
//	var idd = addLoadingImage( $(elem), 'before', 'tiny_loader.gif', 0, 0 );
	if( ok_notOK_call_1 )
	{	
		if( ok_notOK_call_1.state() != "resolved" )
		{
			return;
		}
	}
	
	$(elem).hide();
	$(elem).siblings("a.not_ok").fadeIn();
	
	var wish_id = 0;
	var wallpost_id = 0;
	
	if( wish_or_wallpost_id == 1 )
	{
		wish_id = item_id;
	}
	else if( wish_or_wallpost_id == 2 )
	{
		wallpost_id = item_id;
	}
		
	
	ok_notOK_call_1 = jQuery.ajax({
        url: "/" + PROJECT_NAME + "socialise/ok-the-wallpost-of-type-wish",
        type: "POST",
        dataType: "json",
        data: { 'wish_id' : wish_id, 'wallpost_id' : wallpost_id },
//		cache: false,
        timeout: 50000,
        success: function(jsonData) {
        	if( jsonData.is_success == 1 )
        	{
        		//Switch between OK - NOTOK buttons on wall.
        		$("div.ok a.ok[rel='"+jsonData.wallpost_id+"']").hide();
        		$("div.ok a.ok[rel='"+jsonData.wallpost_id+"']").siblings("a.not_ok").fadeIn();
        		
        		$("div.ok a.ok[rel='"+jsonData.wish_id+"']").hide();
        		$("div.ok a.ok[rel='"+jsonData.wish_id+"']").siblings("a.not_ok").fadeIn();
        		
//        		Incrementing count on wallpost.
        		var updated_count = parseInt( $("div#"+jsonData.wallpost_id+".like_count").children("a").text().replace(/[\])}[{(]/g,'') )+1;
        		$("div#"+jsonData.wallpost_id+".like_count").children("a").text("("+updated_count+")");
        		$("div#"+jsonData.wallpost_id+".like_count").children("a").fadeIn();

//        		Incrementing count on wish section.     
        		var updated_count = parseInt( $("div#"+jsonData.wish_id+".like_count").children("a").text().replace(/[\])}[{(]/g,'') )+1;
        		$("div#"+jsonData.wish_id+".like_count").children("a").text("("+updated_count+")");
        		$("div#"+jsonData.wish_id+".like_count").children("a").fadeIn();
        		
        		//Updating likers string
        		$("div#"+jsonData.wallpost_id+".people-who-liked span").html(jsonData.likers_string);
        		$("div#"+jsonData.wallpost_id+".people-who-liked").fadeIn();
				
        		$("div#"+jsonData.wish_id+".people-who-liked-wish span").html(jsonData.likers_string);
        		$("div#"+jsonData.wish_id+".people-who-liked-wish").fadeIn();
				
				//Ajax call for sending 'ok' notification to wallpost owner 
				//and users who have done any activity on it.
				var wallpost_id = jsonData.wallpost_id;
				jQuery.ajax({
					url: "/" + PROJECT_NAME + "notifications/send-ok-notification",
					type: "POST",
					dataType: "json",
					data: { 'wallpost_id' : wallpost_id },
					success: function(jsonData) {
						
					}
				});
        	}
        	else
        	{
        		//alert("An error occured. Please try again.");
        	}	
        },
        error: function(xhr, ajaxOptions, thrownError) {
        	
        }
	});
}

function notOkTheWallpost( wallpost_id, elem )
{
//	var idd = addLoadingImage( $(elem), 'before', 'tiny_loader.gif', 0, 0 );
	
	if( ok_notOK_call_1 )
	{	
		if( ok_notOK_call_1.state() != "resolved" )
		{
			return;
		}
	}
	
	$(elem).hide();
	$(elem).siblings("a.ok").fadeIn();
	
	ok_notOK_call_1 = jQuery.ajax({
		url: "/" + PROJECT_NAME + "socialise/not-ok-the-wallpost",
		type: "POST",
		dataType: "json",
		data: { 'wallpost_id' : wallpost_id },
//		cache: false,
		timeout: 50000,
		success: function(jsonData) {
			if( jsonData.is_success == 2 )
			{
				showDialogMsg('Oops!', "The action can not be performed because this post has been removed.", 3000,
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
				    height: 200,
				    width: 300
					}		
				);
				return;
			}
			else if( jsonData.is_success == 1 )
			{
//				Decrementing count.
        		var updated_count = parseInt( $(elem).parent().siblings("div.like_count").children("a").text().replace(/[\])}[{(]/g,'') )-1;
        		$(elem).parent().siblings("div.like_count").children("a").text("("+updated_count+")");
				if( updated_count < 1 )
				{
					$(elem).parent().siblings("div.like_count").children("a").hide();
				}	
				
        		//Updating likers string
				if( jsonData.likers_string.length > 0 )
				{
					$("div#"+wallpost_id+".people-who-liked").fadeIn();
					$("div#"+wallpost_id+".people-who-liked span").html(jsonData.likers_string);
				}
				else
				{
					$("div#"+wallpost_id+".people-who-liked").hide();
				}	
			}
			else
			{
//				$("span#"+idd).remove();
				//alert("An error occured. Please try again. If problem persists, please contact admin.");
			}
		},
		error: function(xhr, ajaxOptions, thrownError) {
			
		}
	});
}

/**
 * 
 * 
 * @param item_id
 * @param elem
 * @param wish_or_wallpost_id( 1 means wish_id passed, 2 means wallpost_id passed )
 * 
 * @author jsingh7
 */
function notOkTheWallpostOfTypeWish( item_id, elem, wish_or_wallpost_id )
{
//	var idd = addLoadingImage( $(elem), 'before', 'tiny_loader.gif', 0, 0 );
	
	if( ok_notOK_call_1 )
	{	
		if( ok_notOK_call_1.state() != "resolved" )
		{
			return;
		}
	}
	
	$(elem).hide();
	$(elem).siblings("a.ok").fadeIn();
	
	var wish_id = 0;
	var wallpost_id = 0;
	
	if( wish_or_wallpost_id == 1 )
	{
		wish_id = item_id;
	}
	else if( wish_or_wallpost_id == 2 )
	{
		wallpost_id = item_id;
	}
	
	ok_notOK_call_1 = jQuery.ajax({
		url: "/" + PROJECT_NAME + "socialise/not-ok-the-wallpost-of-type-wish",
		type: "POST",
		dataType: "json",
		data: { 'wish_id' : wish_id, 'wallpost_id' : wallpost_id },
//		cache: false,
		timeout: 50000,
		success: function(jsonData) {
			if( jsonData.is_success == 1 )
			{
				//Switch between OK - NOTOK buttons on wall.
				$("div.ok a.not_ok[rel='"+jsonData.wallpost_id+"']").hide();
				$("div.ok a.not_ok[rel='"+jsonData.wallpost_id+"']").siblings("a.ok").fadeIn();
				$("div.ok a.not_ok[rel='"+jsonData.wish_id+"']").hide();
				$("div.ok a.not_ok[rel='"+jsonData.wish_id+"']").siblings("a.ok").fadeIn();
				
//				Decrementing count wall post
				var updated_count = parseInt( $("div#"+jsonData.wallpost_id+".like_count").children("a").text().replace(/[\])}[{(]/g,'') )-1;
				$("div#"+jsonData.wallpost_id+".like_count").children("a").text("("+updated_count+")");
				if( updated_count < 1 )
				{
					$("div#"+jsonData.wallpost_id+".like_count").children("a").hide();
				}	
//				Decrementing count on wish section.
				var updated_count = parseInt( $("div#"+jsonData.wish_id+".like_count").children("a").text().replace(/[\])}[{(]/g,'') )-1;
				$("div#"+jsonData.wish_id+".like_count").children("a").text("("+updated_count+")");
				if( updated_count < 1 )
				{
					$("div#"+jsonData.wish_id+".like_count").children("a").hide();
				}
				
        		//Updating likers string
				if( jsonData.likers_string.length > 0)
				{
					$("div#"+jsonData.wallpost_id+".people-who-liked").fadeIn();
					$("div#"+jsonData.wallpost_id+".people-who-liked span").html(jsonData.likers_string);
					
					$("div#"+jsonData.wish_id+".people-who-liked-wish").fadeIn();
					$("div#"+jsonData.wish_id+".people-who-liked-wish span").html(jsonData.likers_string);
				}
				else
				{
					$("div#"+jsonData.wallpost_id+".people-who-liked").hide();
					$("div#"+jsonData.wish_id+".people-who-liked-wish").hide();
				}	
			}
			else
			{
//				$("span#"+idd).remove();
				//alert("An error occured. Please try again. If problem persists, please contact admin.");
			}
		},
		error: function(xhr, ajaxOptions, thrownError) {
			
		}
	});
}


function reportAbuse(event){
	var wallPostId = event.rel;
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "socialise/report-abuse",
        type: "POST",
        dataType: "json",
        data: { 'wall_id' : wallPostId },
        timeout: 50000,
        success: function( jsonData ) {
        	/*thiss.show();
        	$("span#"+idd).remove();
        	var wall_post = "";
        	wall_post = wallPostMaker( jsonData.user_id, jsonData.fname, jsonData.lname, jsonData.user_image, jsonData.gender, jsonData.wall_post_text, 1 );
        	$("div#updates_holder div.loading_updates").remove();
        	$("div#updates_holder").prepend( wall_post );
        	$("input#offsettt").val( parseInt( $("input#offsettt").val() ) + 1 );
        	$("div.news-content").fadeIn("slow");
        	$("textarea#post_box").val("");*/
        },
        error: function(xhr, ajaxOptions, thrownError) {

        }
	});
}

/**
* common function used to invite users to link on like and share popups 
 * Author: sjaiswal
 * version: 1.0
 */
function invitationToLinkOnPhotoFeed(acceptUserId, elem)
{
	var thiss = $(elem);
	var idd = addLoadingImage( thiss, 'before', 'loading_small_purple.gif');
	thiss.hide();
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "links/send-link-request", 
        type: "POST",
        dataType: "json",
        data: "accept_user="+acceptUserId,
        success: function(jsonData) {
        	var link_id = jsonData;
        	$("span#"+idd).remove();
        	var html = '';
        	html +='<a id="'+acceptUserId+'" class="cursor-style invite_'+acceptUserId+' cancel-request" title="cancel request" rel="'+link_id+'" onclick="cancelRequestOnPhotoFeed(this)"">';
        	//html +='<img src="'+ IMAGE_PATH +'/cancel-request-icon.png" alt="cancel request"/>';
        	html +='</a>';
        	$('span#link_'+acceptUserId).html(html);	
		},
        error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
		}
    });
}

/**
 * common function used to 'cancel link request' on like and share popups 
 * Author: sjaiswal
 * version: 1.0
 */
function cancelRequestOnPhotoFeed(event){
	var profileID=event.id;
	// remove 'accept request' icon
	$('span#link_'+profileID+ ' a.invite_'+profileID).hide();
	var thiss = $(event);
	var idd = addLoadingImage( thiss, 'before', 'loading_small_purple.gif', 0, 34);
	thiss.hide();
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "profile/cancel-request",
        type: "POST",
        dataType: "json",
        data: "cancel_request="+event.rel+"&profileID="+profileID+"&type=request",
        success: function(jsonData) {
        	var html = '';
        	$("div#cancel-request-icon-text-"+profileID).remove();
        		if(jsonData==1)
        		{
        			//Remove loading.
        			$("span#"+idd).remove(); 
        			html+='<a id="'+profileID+'" class="cursor-style invite_'+profileID+' invitation-request" title="Invite to Link" href="javascript:;" onclick="invitationToLinkOnPhotoFeed('+profileID+', this);">';
        			//html+='<img src="'+IMAGE_PATH+'/invitation-request-icon.png" alt="Invite to Link"/>';
        			html+='</a>';
        			$('span#link_'+profileID).html(html);
        		}
        },
    
        error: function(xhr, ajaxOptions, thrownError) {
        	alert("Server Error.");
		}
    });
}

/**
 * common function used to 'accept user link request' on like and share popups 
 * @author sjaiswal
 * @version 1.0
 */
function acceptRequestOnPhotoFeed(event){
	var profileID=event.id;
	var acceptId=event.rel;
	// remove 'decline request' icon
	$('span#link_'+profileID+ ' a.decline_'+profileID).hide();
	var thiss = $(event);
	var idd = addLoadingImage( thiss, 'before', 'loading_small_purple.gif', 0, 34);
	thiss.hide();
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "profile/accept-request",
        type: "POST",
        dataType: "json",
        data: "accept_request="+acceptId+"&profileID="+profileID,
        success: function(jsonData) {
        		$("span#"+idd).remove();  
        		var html='';
        		html +='<a class="cursor-style" title="Send Mail" href="'+ PROJECT_URL + PROJECT_NAME +'mail/compose#to_user:'+profileID+'">';
	    		html +='<img src="'+ IMAGE_PATH +'/mail-icon2.png" alt="Send Mail"/>';
	    		html +='</a>';
    			$('span#link_'+profileID).html(html); 
		},
        error: function(xhr, ajaxOptions, thrownError) {
        	alert("Server Error.");
		}
    });
}
/**
 * Who liked listing functionality.
 * 
 * @param wallpost_id
 * @param bit/boolean view_more
 * @author jsingh7,sjaiswal
 * @author hkaur5
 * @version 1.1
 */
function openWhoLikedPopupByWallpostId( wallpost_id )
{
	var offset = $('input#offset_who_liked').val();
	var limit = $('input#limit_who_liked').val();
	var nxt_offset = parseInt(offset)+parseInt(limit);
	$('#who_liked_listing_popup').bPopup(
	{
		modalClose: true,
	    easing: 'easeOutBack', //uses jQuery easing plugin
        speed: 500,
		closeClass : 'close_bpopup',
//        transition: 'slideDown',
        onClose: function() {},
        onOpen: function() {
        	//Do required stuff...
        	$("div#list_of_who_liked").html("<div style = 'display : table-cell; height: 197px; width: 395px; text-align:center; vertical-align: middle;'><image src = "+IMAGE_PATH+"/loading_medium_purple.gif></div>");
        	jQuery.ajax({
                url: "/" + PROJECT_NAME + "socialise/get-who-like-post",
                type: "POST",
                dataType: "json",
                data: { 'wallpost_id' : wallpost_id,'offset':offset,'limit':limit },
                timeout: 50000,
                success: function( jsonData ) {
                	var html = "<ol id='display_who_liked_post_users'>";
                	if(jsonData.user_info)
                	{
	                	for( i in jsonData.user_info )
	                	{
	                
                	
                		html += '<div style="width: 100%;border-bottom:1px solid #EDEDED;padding-bottom:10px !important;" class="comments-outer">';
                		html += '<div title="'+jsonData.user_info[i]["user_full_names"]+'" class="img short_profile_border">';
                		html += '<div>';
                		html += '<img src = "'+jsonData.user_info[i]["user_image"]+'"/>';
                		html += '</div>';
                		html += '</div>';
                		
                		html += '<div class="text" style="width: 86%!important; float:left; word-wrap: break-word; margin-top:0px !important;">';
                		
                		html +='<div style="float: left; width: 85%;" class="left">';
                		html +='<p>';
                		if( $("input[type=hidden]#my_user_id").val() == jsonData.user_info[i]["user_id"] )
                		{
	                		html += "<a class='text-purple-link' href = '/"+PROJECT_NAME+"profile/iprofile/id/"+jsonData.user_info[i]["user_id"]+"'>Me</a>";
                		}
                		else
                		{	
	                		html += "<a class='text-purple-link' href = '/"+PROJECT_NAME+"profile/iprofile/id/"+jsonData.user_info[i]["user_id"]+"'>"+jsonData.user_info[i]["user_full_names"]+"</a>";
                		}
                		
                		html +='</p>';
                		
                	  	if(jsonData.user_info[i].mutual_count!="Me" && jsonData.user_info[i].mutual_count!=0)
    	            	{
    	            		html += '<p>'+jsonData.user_info[i].mutual_count+' Mutual Friend</p>';
    	            	}
                		html += '</div>';//Left div end
                		
                		html += '<span id="link_'+jsonData.user_info[i]["user_id"]+'" class="open_who_like_photofeed" >';
	                	switch ( jsonData.user_info[i]["link_info"].friend_type )
		            	{
		            	case 0:
		            		// case for inviting user
							if( $("input[type=hidden]#my_user_id").val() != jsonData.user_info[i]["user_id"] )
	                		{
								html +='<a id="linkToConnect_'+jsonData.user_info[i]["user_id"]+'" class="cursor-style invite_'+jsonData.user_info[i]["user_id"]+' invitation-request" title="Invite to Link" onclick="invitationToLinkOnPhotoFeed('+jsonData.user_info[i]["user_id"]+', this);">';
								//html +='<img src="'+ IMAGE_PATH +'/invitation-request-icon.png" alt="Invite to Link"/>';
								html +='</a>';
	                		}
							else
							{
								html += '';                			
	                		}
						break;
						case 1:
							// when user revert back his/her link request
							html +='<a id="'+jsonData.user_info[i]["user_id"]+'" rel="'+jsonData.user_info[i]["link_info"]["link_id"]+'" class="cursor-style invite_'+jsonData.user_info[i]["user_id"]+' cancel-request" title="Cancel Request" href="javascript:;" onclick="cancelRequestOnPhotoFeed(this)">';
			    			//html +='<img src="'+IMAGE_PATH+'/cancel-request-icon.png" alt="Cancel Request"/>';
			    			html +='</a>';
						break;
						case 2:
							// case for accepting or rejecting request by user
							html +='<a id="'+jsonData.user_info[i]["user_id"]+'" rel="'+jsonData.user_info[i]["link_info"]["link_id"]+'" class="cursor-style invite_'+jsonData.user_info[i]["user_id"]+' accept-request" title="Accept Request" onclick="acceptRequestOnPhotoFeed(this);" href="javascript:;">';
							//html +='<img src="'+IMAGE_PATH+'/accept-request-icon.png" alt="Accept Request"/>';
							html +='</a>';	
							html +='<a id="'+jsonData.user_info[i]["user_id"]+'" rel="'+jsonData.user_info[i]["link_info"]["link_id"]+'" class="cursor-style decline_'+jsonData.user_info[i]["user_id"]+' decline-request" title="Decline Request" onclick="cancelRequestOnPhotoFeed(this);" href="javascript:;">';
							//html +='<img src="'+IMAGE_PATH+'/decline-request-icon.png" alt="Decline Request"/>';
							html +='</a>';
						break;
						case 3:
							// case when request is accepted and user can send mail to his linked user
							if( $("input[type=hidden]#my_user_id").val() != jsonData.user_info[i]["user_id"] )
	                		{
								html +='<a class="cursor-style compose-mail" title="Send Mail" href="'+ PROJECT_URL + PROJECT_NAME +'mail/compose#to_user:'+jsonData.user_info[i]["user_id"]+'">';
					    		//html +='<img src="'+ IMAGE_PATH +'/mail-icon2.png" alt="Send Mail"/>';
					    		html +='</a>';
	                		}
							else
							{
								html += '';  
							}
							break;
						default:
							html += '<label>Unable to find link status!</label>';
						break;
					}
	            	html += '</span>';
	          
	            	html += '</div>';
                	html += '</div>';
                	}
                	html += '</ol>';
                	if(jsonData["is_more_records"])
        			{
	                	html += '<div class="view_more_who_liked">';
	                	html += '<p class="" >';
	                	html += '<a href="javascript:;" class="text-dark-purple" onclick=loadMoreWhoLikedPost('+wallpost_id+',this,'+nxt_offset+')>';
	                	html += 'View More';
	                	html += '</a>';
	                	html += '</p>';
	                	html += '</div>';
        			}
                	$("div#list_of_who_liked").html(html);
                }
            	else
        		{
            		$("div#list_of_who_liked").html("Oops! Some error occurred while fetching records.We hope to have fix it soon!");
        		}
                },
                error: function(xhr, ajaxOptions, thrownError) {

                }
        	});
        }, 
	},
	function() {
		//Do required stuff...
	});
}

/**
 * fetching and displaying records of people who liked post
 * according to offset and limit.
 * 
 * @param wallpost_id
 * @param bit/boolean view_more
 * @author hkaur5
 * @version 1.1
 */
function loadMoreWhoLikedPost( wallpost_id,elem,offset )
{
	var limit = $('input#limit_who_liked').val();
	$("div.view_more_who_liked p").html("<div style = 'display : table-cell;text-align:center; vertical-align: middle;'><image src = "+IMAGE_PATH+"/loading_small_purple.gif></div>");
	var nxt_offset = parseInt(offset)+parseInt(limit);
	
	jQuery.ajax({
		url: "/" + PROJECT_NAME + "socialise/get-who-like-post",
		type: "POST",
		dataType: "json",
		data: { 'wallpost_id' : wallpost_id,'offset':offset,'limit':limit },
		timeout: 50000,
		success: function( jsonData ) {
		if(jsonData.user_info)
		{
//			var html = "<ol>";
			var html = "";
			for( i in jsonData.user_info )
			{
				html += '<div style="width: 100%;border-bottom:1px solid #EDEDED;padding-bottom:10px !important;" class="comments-outer">';
				html += '<div title="'+jsonData.user_info[i]["user_full_names"]+'" class="img short_profile_border">';
				html += '<div>';
				html += '<img src = "'+jsonData.user_info[i]["user_image"]+'"/>';
				html += '</div>';
				html += '</div>';
				
				html += '<div class="text" style="width: 86%!important; float:left; word-wrap: break-word; margin-top:0px !important;">';
				html +='<div style="float: left; width: 85%;" class="left">';
				html +='<p>';
				if( $("input[type=hidden]#my_user_id").val() == jsonData.user_info[i]["user_id"] )
				{
					html += "<a class='text-purple-link' href = '/"+PROJECT_NAME+"profile/iprofile/id/"+jsonData.user_info[i]["user_id"]+"'>Me</a>";
				}
				else
				{	
					html += "<a class='text-purple-link' href = '/"+PROJECT_NAME+"profile/iprofile/id/"+jsonData.user_info[i]["user_id"]+"'>"+jsonData.user_info[i]["user_full_names"]+"</a>";
				}
				html +='</p>';
				if(jsonData.user_info[i].mutual_count!="Me" && jsonData.user_info[i].mutual_count!=0)
				{
					html += '<p>'+jsonData.user_info[i].mutual_count+' Mutual Friend</p>';
				}
				html += '</div>';//Left div end
				html += '<span id="link_'+jsonData.user_info[i]["user_id"]+'" class="open_who_like_photofeed" >';
				switch ( jsonData.user_info[i]["link_info"].friend_type )
				{
				case 0:
					// case for inviting user
					if( $("input[type=hidden]#my_user_id").val() != jsonData.user_info[i]["user_id"] )
					{
						html +='<a id="linkToConnect_'+jsonData.user_info[i]["user_id"]+'" class="cursor-style invite_'+jsonData.user_info[i]["user_id"]+' invitation-request" title="Invite to Link" onclick="invitationToLinkOnPhotoFeed('+jsonData.user_info[i]["user_id"]+', this);">';
						//html +='<img src="'+ IMAGE_PATH +'/invitation-request-icon.png" alt="Invite to Link"/>';
						html +='</a>';
					}
					else
					{
						html += '';                			
					}
					break;
				case 1:
					// when user revert back his/her link request
					html +='<a id="'+jsonData.user_info[i]["user_id"]+'" rel="'+jsonData.user_info[i]["link_info"]["link_id"]+'" class="cursor-style invite_'+jsonData.user_info[i]["user_id"]+' cancel-request" title="Cancel Request" href="javascript:;" onclick="cancelRequestOnPhotoFeed(this)">';
					//html +='<img src="'+IMAGE_PATH+'/cancel-request-icon.png" alt="Cancel Request"/>';
					html +='</a>';
					break;
				case 2:
					// case for accepting or rejecting request by user
					html +='<a id="'+jsonData.user_info[i]["user_id"]+'" rel="'+jsonData.user_info[i]["link_info"]["link_id"]+'" class="cursor-style invite_'+jsonData.user_info[i]["user_id"]+' accept-request" title="Accept Request" onclick="acceptRequestOnPhotoFeed(this);" href="javascript:;">';
					//html +='<img src="'+IMAGE_PATH+'/accept-request-icon.png" alt="Accept Request"/>';
					html +='</a>';	
					html +='<a id="'+jsonData.user_info[i]["user_id"]+'" rel="'+jsonData.user_info[i]["link_info"]["link_id"]+'" class="cursor-style decline_'+jsonData.user_info[i]["user_id"]+' decline-request" title="Decline Request" onclick="cancelRequestOnPhotoFeed(this);" href="javascript:;">';
					//html +='<img src="'+IMAGE_PATH+'/decline-request-icon.png" alt="Decline Request"/>';
					html +='</a>';
					break;
				case 3:
					// case when request is accepted and user can send mail to his linked user
					if( $("input[type=hidden]#my_user_id").val() != jsonData.user_info[i]["user_id"] )
					{
						html +='<a class="cursor-style compose-mail" title="Send Mail" href="'+ PROJECT_URL + PROJECT_NAME +'mail/compose#to_user:'+jsonData.user_info[i]["user_id"]+'">';
						//html +='<img src="'+ IMAGE_PATH +'/mail-icon2.png" alt="Send Mail"/>';
						html +='</a>';
					}
					else
					{
						html += '';  
					}
					break;
				default:
					html += '<label>Unable to find link status!</label>';
				break;
				}
				html += '</span>';
				
				html += '</div>';
				html += '</div>';
			}
//			html += '</ol>';
			if(jsonData["is_more_records"])
			{
				html += '<div class="view_more_who_liked">';
				html += '<p class="" >';
				html += '<a href="javascript:;" class="text-dark-purple" onclick=loadMoreWhoLikedPost('+wallpost_id+',this,'+nxt_offset+')>';
				html += 'View More';
				html += '</a>';
				html += '</p>';
				html += '</div>';
			}
			$("div.view_more_who_liked").remove();
			$("ol#display_who_liked_post_users").append(html);
		  
			//bpopup reposition
			var bPopup = $("#who_liked_listing_popup").bPopup();
			bPopup.reposition();
		}
		else
		{
    		$("div#list_of_who_liked").html("Oops! Some error occurred while fetching records.We hope to have fix it soon!");
		}
		
		},
		error: function(xhr, ajaxOptions, thrownError) {
			
		}
	});
}
/**
 * Who liked listing functionality.
 * 
 * @param wallpost_id
 * @author jsingh7
 * @version 1.0
 */
function openWhoLikedPopupByWishId( wish_id )
{
	$('#who_liked_listing_popup').bPopup(
			{
				modalClose: true,
				easing: 'easeOutBack', //uses jQuery easing plugin
				speed: 500,
				closeClass : 'close_bpopup',
				//transition: 'slideDown',
				onClose: function() {},
				onOpen: function() {
					//Do required stuff...
					$("div#list_of_who_liked").html("<div style = 'display : table-cell; height: 197px; width: 395px; text-align:center; vertical-align: middle;'><image src = "+IMAGE_PATH+"/loading_medium_purple.gif></div>");
					jQuery.ajax({
						url: "/" + PROJECT_NAME + "socialise/get-who-like-wish-post",
						type: "POST",
						dataType: "json",
						data: { 'wish_id' : wish_id },
						timeout: 50000,
						success: function( jsonData ) {
							var html = "<ol>";
							for( i in jsonData )
							{
								html += '<div style="width: 100%;border-bottom:1px solid #EDEDED;padding-bottom:10px !important;" class="comments-outer">';
								
								
								html += '<div title="'+jsonData[i]["user_full_names"]+'" class="img short_profile_border">';
								html += '<div>';
								html += '<img src = "'+jsonData[i]["user_image"]+'"/>';
								html += '</div>';
								html += '</div>';
								
								html += '<div class="text" style="width: 84%!important; float:left; word-wrap: break-word;">';
								if( $("input[type=hidden]#my_user_id").val() == jsonData[i]["user_id"] )
								{
									html += "<a class='text-purple-link' href = '/"+PROJECT_NAME+"profile/iprofile/id/"+jsonData[i]["user_id"]+"'>Me</a>";
								}
								else
								{	
									html += "<a class='text-purple-link' href = '/"+PROJECT_NAME+"profile/iprofile/id/"+jsonData[i]["user_id"]+"'>"+jsonData[i]["user_full_names"]+"</a>";
								}
								
								html += '<span id="link_'+jsonData[i]["user_id"]+'" style = "color : #6C518F; float:right">';
								switch ( jsonData[i]["link_info"].friend_type )
								{
								case 0:
									if( $("input[type=hidden]#my_user_id").val() != jsonData[i]["user_id"] )
									{
										html += '<input name="link" id = "linkToConnect_'+jsonData[i]["user_id"]+'" type="button" class="btn-ok-popup" value="Link" alt="Link" title="Link" onclick="invitationToUser('+jsonData[i]["user_id"]+');"/>';
									}
									else
									{
										html += '';       			
									}
									break;
								case 1:
									html += '<label>Link request sent</label>';
									
									break;
								case 2:
									html += '<label>Link request Received</label>';
									break;
								case 3:
									if( $("input[type=hidden]#my_user_id").val() != jsonData[i]["user_id"] )
									{
										html +="<a style='text-decoration:none !important;' href = '/"+PROJECT_NAME+"mail/compose#to_user:"+jsonData[i]["user_id"]+"'><input name='send_mail' id = 'send_mail' type='button' class='btn-ok-popup' value='Send Mail' alt='Send Mail' title='Send Mail' '/></a>";
									}
									else
									{
										html += '';  
									}
									break;
								default:
									html += '<label>Unable to find link status!</label>';
								break;
								}
								html += '</span>';
								if(jsonData[i].mutual_count!="Me" && jsonData[i].mutual_count!=0)
								{
									html += '<p>'+jsonData[i].mutual_count+' Mutual Friend</p>';
								}
								html += '</div>';
								html += '</div>';
							}
							$("div#list_of_who_liked").html(html);
						},
						error: function(xhr, ajaxOptions, thrownError) {
							
						}
					});
				}, 
			},
			function() {
				//Do required stuff...
			});
}

/**
 * Get information of users who has shared given wallpost.
 * 
 * @param int wallpost_id
 * @param int logged_in_user_id 
 * @author hkaur5
 * @version 1.0
 */
function openWhoSharedPopup(wallpost_id,elem)
{
	var offset = $('input#offset_who_shared').val();
	var limit = $('input#limit_who_shared').val();
	var nxt_offset = parseInt(offset)+parseInt(limit);
//	console.log($(elem).attr('links'));
	$('#who_shared_listing_popup').bPopup(
	{
		modalClose: true,
	    easing: 'easeOutBack', //uses jQuery easing plugin
        speed: 500,
		closeClass : 'close_bpopup',
//        transition: 'slideDown',
        onClose: function() {},
        onOpen: function() {
        	//Do required stuff...
        	$("div#list_of_who_shared").html("<div style = 'display : table-cell; height: 197px; width: 395px; text-align:center; vertical-align: middle;'><image src = "+IMAGE_PATH+"/loading_medium_purple.gif></div>");
        	jQuery.ajax({
                url: "/" + PROJECT_NAME + "socialise/get-who-shared-post",
                type: "POST",
                dataType: "json",
                data: { 'wallpost_id' : wallpost_id,'offset':offset,'limit':limit, 'logged_in_user_id':$(elem).attr('rel1')},
                timeout: 50000,
                success: function( jsonData ) {
            	if(jsonData.user_info)
            	{
                	var html = "<ol id='display_users_who_shared_post'>";
                	for( i in jsonData.user_info )
                	{
                		html += '<div style="width: 100%;border-bottom: 1px solid #EDEDED;padding-bottom: 10px !important;" class="comments-outer">';
                		html += '<div title='+jsonData.user_info[i]["user_full_names"]+' class="img short_profile_border">';
                		html += '<div>';
                		html += '<img src = "'+jsonData.user_info[i]["user_image"]+'"/>';
                		html += '</div>';
                		html += '</div>';
                		html += '<div class="text" style="width: 88% ! important; float: right; word-wrap: break-word; margin: 0px ! important;">';
                		
                		if( $("input[type=hidden]#my_user_id").val() == jsonData.user_info[i]["user_id"] )
                		{
	                		html += "<a class = 'text-dark-purple' href = '/"+PROJECT_NAME+"profile/iprofile/id/"+jsonData.user_info[i]["user_id"]+"'>Me</a>";
                		}
                		else
                		{	
	                		html += "<a class = 'text-dark-purple' href = '/"+PROJECT_NAME+"profile/iprofile/id/"+jsonData.user_info[i]["user_id"]+"'>"+jsonData.user_info[i]["user_full_names"]+"</a>";
                		}
                		
                		html += '<span id="link_'+jsonData.user_info[i]["user_id"]+'" class="get_shared_list_photofeed">';
	                	switch ( jsonData.user_info[i]["link_info"].friend_type ) 
		            	{
			            	case 0:
			            		// case for inviting user
								if( $("input[type=hidden]#my_user_id").val() != jsonData.user_info[i]["user_id"] )
		                		{
								html +='<a id="linkToConnect_'+jsonData.user_info[i]["user_id"]+'" class="cursor-style invite_'+jsonData.user_info[i]["user_id"]+' invitation-request" title="Invite to Link" onclick="invitationToLinkOnPhotoFeed('+jsonData.user_info[i]["user_id"]+', this);">';
								html +='</a>';
		                		}
								else
								{
									html += '';                			
		                		}
							break;
							case 1:
								// when user revert back his/her link request
								html +='<a id="'+jsonData.user_info[i]["user_id"]+'" rel="'+jsonData.user_info[i]["link_info"]["link_id"]+'" class="cursor-style invite_'+jsonData.user_info[i]["user_id"]+' cancel-request" title="Cancel Request" href="javascript:;" onclick="cancelRequestOnPhotoFeed(this)">';
				    			html +='</a>';
							break;
							case 2:
								// case for accepting or rejecting request by user
								html +='<a id="'+jsonData.user_info[i]["user_id"]+'" rel="'+jsonData.user_info[i]["link_info"]["link_id"]+'" class="cursor-style invite_'+jsonData.user_info[i]["user_id"]+' accept-request" title="Accept Request" onclick="acceptRequestOnPhotoFeed(this);" href="javascript:;">';
								html +='</a>';	
								html +='<a id="'+jsonData.user_info[i]["user_id"]+'" rel="'+jsonData.user_info[i]["link_info"]["link_id"]+'" class="cursor-style decline_'+jsonData.user_info[i]["user_id"]+' decline-request" title="Decline Request" onclick="cancelRequestOnPhotoFeed(this);" href="javascript:;">';
								html +='</a>';
							break;
							case 3:
							// case when request is accepted and user can send mail to his linked user
							if( $("input[type=hidden]#my_user_id").val() != jsonData.user_info[i]["user_id"] )
	                		{
								html +='<a class="cursor-style compose-mail" title="Send Mail" href="'+ PROJECT_URL + PROJECT_NAME +'mail/compose#to_user:'+jsonData.user_info[i]["user_id"]+'">';
					    		html +='</a>';
	                		}
							else
							{
								html += '';  
							}
							break;
							default:
								html += 'Unable to find link status!';
							break;
						}
		            	html += '</span></div>';
		            	html += '</div>';
                		}	
		              	html += '</ol>';
		              	
		              	//For showing option of view more in case when more records are available.
	                	if(jsonData["is_more_records"])
	        			{
		                	html += '<div class="view_more_who_shared">';
		                	html += '<p class="" >';
		                	html += '<a rel1="'+$(elem).attr('rel1')+'" href="javascript:;" class="text-dark-purple" onclick=loadMoreWhoSharedPost(this,'+wallpost_id+','+nxt_offset+')>';
		                	html += 'View More';
		                	html += '</a>';
		                	html += '</p>';
		                	html += '</div>';
	        			}

                	$("div#list_of_who_shared").html(html);
                }
            	else
        		{
            		$("div#list_of_who_shared").html("Oops! Some error occurred while fetching records.We hope to have fix it soon!");
        		}
                },
                error: function(xhr, ajaxOptions, thrownError) {

                }
        	});
        }, 
	},
	function() {
		//Do required stuff...
	});
}

/**
 * load/append more users who has shared wallpost.
 * 
 * @param wallpost_id
 * @param elem ( element )
 * @param offset
 * 
 * @author hkaur5
 */
function loadMoreWhoSharedPost( elem, wallpost_id, offset )
{
//	var logged_in_user_id = "";
//	if( typeof user_id !== 'undefined' &&  typeof user_id !== false)
//	{
//		logged_in_user_id  = user_id;
//	}
	var limit = $('input#limit_who_shared').val();
	$("div.view_more_who_shared p").html("<div style = 'display : table-cell;text-align:center; vertical-align: middle;'><image src = "+IMAGE_PATH+"/loading_small_purple.gif></div>");
	var nxt_offset = parseInt(offset)+parseInt(limit);
	
	jQuery.ajax({
	url: "/" + PROJECT_NAME + "socialise/get-who-shared-post",
	type: "POST",
	dataType: "json",
	data: { 'wallpost_id' : wallpost_id, 'limit':limit, 'offset':offset,'logged_in_user_id':$(elem).attr('rel1')},
	timeout: 50000,
	success: function( jsonData ) {
	if(jsonData.user_info)
	{
//		var html = "<ol>";
		var html = "";
		for( i in jsonData.user_info )
		{
			html += '<div style="width: 100%;border-bottom: 1px solid #EDEDED;padding-bottom: 10px !important;" class="comments-outer">';
			html += '<div title='+jsonData.user_info[i]["user_full_names"]+' class="img short_profile_border">';
			html += '<div>';
			html += '<img src = "'+jsonData.user_info[i]["user_image"]+'"/>';
			html += '</div>';
			html += '</div>';
			html += '<div class="text" style="width: 88% ! important; float: right; word-wrap: break-word; margin: 0px ! important;">';
			
			if( $("input[type=hidden]#my_user_id").val() == jsonData.user_info[i]["user_id"] )
			{
				html += "<a class = 'text-dark-purple' href = '/"+PROJECT_NAME+"profile/iprofile/id/"+jsonData.user_info[i]["user_id"]+"'>Me</a>";
			}
			else
			{	
				html += "<a class = 'text-dark-purple' href = '/"+PROJECT_NAME+"profile/iprofile/id/"+jsonData.user_info[i]["user_id"]+"'>"+jsonData.user_info[i]["user_full_names"]+"</a>";
			}
			
			html += '<span id="link_'+jsonData.user_info[i]["user_id"]+'" class="get_shared_list_photofeed">';
			switch ( jsonData.user_info[i]["link_info"].friend_type ) 
			{
			case 0:
				// case for inviting user
				if( $("input[type=hidden]#my_user_id").val() != jsonData.user_info[i]["user_id"] )
				{
					html +='<a id="linkToConnect_'+jsonData.user_info[i]["user_id"]+'" class="cursor-style invite_'+jsonData.user_info[i]["user_id"]+' invitation-request" title="Invite to Link" onclick="invitationToLinkOnPhotoFeed('+jsonData.user_info[i]["user_id"]+', this);">';
					html +='</a>';
				}
				else
				{
					html += '';                			
				}
				break;
			case 1:
				// when user revert back his/her link request
				html +='<a id="'+jsonData.user_info[i]["user_id"]+'" rel="'+jsonData.user_info[i]["link_info"]["link_id"]+'" class="cursor-style invite_'+jsonData.user_info[i]["user_id"]+' cancel-request" title="Cancel Request" href="javascript:;" onclick="cancelRequestOnPhotoFeed(this)">';
				html +='</a>';
				break;
			case 2:
				// case for accepting or rejecting request by user
				html +='<a id="'+jsonData.user_info[i]["user_id"]+'" rel="'+jsonData.user_info[i]["link_info"]["link_id"]+'" class="cursor-style invite_'+jsonData.user_info[i]["user_id"]+' accept-request" title="Accept Request" onclick="acceptRequestOnPhotoFeed(this);" href="javascript:;">';
				html +='</a>';	
				html +='<a id="'+jsonData.user_info[i]["user_id"]+'" rel="'+jsonData.user_info[i]["link_info"]["link_id"]+'" class="cursor-style decline_'+jsonData.user_info[i]["user_id"]+' decline-request" title="Decline Request" onclick="cancelRequestOnPhotoFeed(this);" href="javascript:;">';
				html +='</a>';
				break;
			case 3:
				// case when request is accepted and user can send mail to his linked user
				if( $("input[type=hidden]#my_user_id").val() != jsonData.user_info[i]["user_id"] )
				{
					html +='<a class="cursor-style compose-mail" title="Send Mail" href="'+ PROJECT_URL + PROJECT_NAME +'mail/compose#to_user:'+jsonData.user_info[i]["user_id"]+'">';
					html +='</a>';
				}
				else
				{
					html += '';  
				}
				break;
			default:
				html += 'Unable to find link status!';
			break;
			}
			html += '</span></div>';
			html += '</div>';
			}	
//			html += '</ol>';
			
			//For showing option of view more in case when more records are available.
			if(jsonData["is_more_records"])
			{
				html += '<div class="view_more_who_shared">';
				html += '<p class="" >';
				html += '<a rel1="'+$(elem).attr('rel1')+'" href="javascript:;" class="text-dark-purple" onclick=loadMoreWhoSharedPost(this,'+wallpost_id+','+nxt_offset+')>';
				html += 'View More';
				html += '</a>';
				html += '</p>';
				html += '</div>';
			}
		$("div.view_more_who_shared").remove();
		$("ol#display_users_who_shared_post").append(html);
		
	  	//bpopup reposition
		var bPopup = $("#who_shared_listing_popup").bPopup();
		bPopup.reposition();
	}
	else
	{
		$("div.view_more_who_shared").remove();
		$("div#list_of_who_shared").html("Oops! Some error occurred while fetching records.We hope to have fix it soon!");
	}
	},
	error: function(xhr, ajaxOptions, thrownError) {}
	});


}

/**
 * Showing up popup to add comment 
 * on clicking comment under photofeed 
 * wallpost.
 * 
 * @author jsingh7
 */
function showCommentPopup( elem ){
	$("div.commentbox-outer").hide();
	$(elem).parent().parent().siblings("div.commentbox-outer").fadeIn();
}

/**
 * @param about_user_name (user name to whom wish belongs )
 * @param item_id
 * @param elem
 * @param event
 * @param wallpost_or_wish_id( 1 means wish_id passed, 2 means wallpost_id passed )
 * 
 * @author jsingh7
 */
function addCommentToTheWallpostOfTypeWish( item_id, elem, event, wallpost_or_wish_id )
{
	event.preventDefault();//prevent default action enter.
	if( $(elem).val().trim() == "" )
	{
		alert( "Please enter comment text." );
		$(elem).val("");
		return;
	}
	
	var wallpost_id = 0;
	var wish_id = 0;
	var comment_text = "";
	if( wallpost_or_wish_id == 1 )
	{
		wish_id = item_id;
		comment_text = $("form#comment_box_"+wish_id+" textarea").val();
	}
	else if( wallpost_or_wish_id == 2 )
	{
		wallpost_id = item_id;
		comment_text = $("form#comment_box_"+wallpost_id+" textarea").val();
	}
	
	$(elem).attr("disabled","disabled");
	$(elem).css("background-color","#E5E5E5");
	$(elem).css("color","#C0C0C0;");
	
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "socialise/add-comment-to-the-wallpost-of-type-wish",
        type: "POST",
        dataType: "json",
        data: {
        	"wallpost_id" : wallpost_id,
        	"wish_id" : wish_id,
        	"comment" : comment_text
        },
        timeout: 50000,
        success: function( jsonData ) {
        	
        	var comment = "";
        	comment += '<div class="comments-outer comments-outer_'+jsonData.comm_id+'" rel = "'+jsonData.comm_id+'" id = "comments-outer_'+jsonData.comm_id+'" style = "display:none;">';
        	
    		var parameter_json = "{'user_id':"+jsonData.commenter_id+"}";
    		comment += '<a disable-border="1" id="'+jsonData.commenter_id+'" title = "'+jsonData.commenter_fname+' '+jsonData.commenter_lname+'" href = "javascript:" onclick="getShortProfile(this,'+parameter_json+')" >';
    		comment += '<div style="width:32px;" class="img short_profile_border" title = "'+jsonData.commenter_fname+' '+jsonData.commenter_lname+'"><img src="' + jsonData.commenter_small_image + '" width="" height="" /></div>';
    		comment += '</a>';
    		
    		//Short profile view popup holder
    		comment += '<div id="view-outer_'+jsonData.commenter_id+'" class="quickview-outer" popup-state="off" style="display:none;">';
    		comment += '<div class="popupArrow">';
    		comment += '<img width="36" height="22" src="'+IMAGE_PATH+'/arrow-purple2.png">';
    		comment += '</div>';
    		comment += '<div id="view_'+jsonData.commenter_id+'" class="quickview"> </div>';
    		comment += '</div>';
        	
        	comment += '<div class="text">';
        	comment += '<div rel="'+jsonData.comm_id+'" id="idd_'+jsonData.comm_id+'" class="comment-text1">';
        	comment += '<span title = "'+jsonData.commenter_fname+' '+jsonData.commenter_lname+'"><a href="/'+PROJECT_NAME+'profile/iprofile/id/'+jsonData.commenter_id+'">'+showCroppedText(jsonData.commenter_fname+' '+jsonData.commenter_lname, 50)+'</a></span>';
        	//comment += '<span title = "'+jsonData.commenter_fname+' '+jsonData.commenter_lname+'">'+showCroppedText(jsonData.commenter_fname+' '+jsonData.commenter_lname, 50)+'</span>';
        	comment += '<div class = "comment_text" id = "'+jsonData.comm_id+'">';
        	comment += jsonData.comm_text;
        	comment += '</div>';
        	
        	comment += '</div>';
        	comment += '<textarea class="comment-textarea" maxlength="255" style="resize: vertical; display:none !important;" rel="'+jsonData.comm_id+'" id="id_'+jsonData.comm_id+'" rows="1" cols="1">'+jsonData.comm_text+'</textarea>';
        	comment += '<div class="comments-date">'+jsonData.created_at+'</div>';
        	comment += '</div>';
        	comment += '<div class="edit_comment" style="text-align: right; position: relative; display: none;">';
        	comment += '<div style="bottom: -85px; width: 78px; padding: 5px; right: -7px; text-align: left; z-index: 99999; display: none;" class="edit-popup-outer">';
        	comment += '<div style=" margin:0 0 0 55px" class="edit-popup-arrow">';
        	comment += '<img width="26" height="16" src="'+IMAGE_PATH+'/arrow-up-grey2.png">';
        	comment += '</div>';
        	comment += '<div style="width: 65px; padding:5px;" class="edit-popup">';
        	comment += '<div class="edit-popup-col1">';
        	comment += '<h5 style="text-transform: none !important;">';
        	comment += '<a href="javascript:;" class="text-grey2-link edit_comment_link" style="font-size:12px;">Edit</a>';
        	comment += '</h5>';
        	comment += '</div>';
        	comment += '<div class="edit-popup-col1">';
        	comment += '<h5 style="text-transform: none !important;">';
        	comment += '<a href="javascript:;" class=" text-grey2-link delete_comment_link" style="font-size:12px;" rel="'+jsonData.comm_id+'">Delete</a>';
        	comment += '</h5>';
        	comment += '</div>';
        	comment += '</div>';
        	comment += '</div>';
        	comment += '</div>';
        	comment += '</div>';
        	
        	
        	$("div#comments_outer_"+ jsonData.wp_id).append(comment);
        	//$("div#comments_outer_"+ jsonData.wp_id).show();
        	$("div#comment_box_" + jsonData.wp_id).show();
        	$("div#comments_outer_"+ jsonData.wp_id+" div.comments-outer:LAST").fadeIn("slow");
        	
        	$("div#comments_outer_"+ jsonData.wish_id).append(comment);
        	//$("div#comments_outer_"+ jsonData.wish_id).show();
        	$("div#comment_box_" + jsonData.wish_id).show();
        	$("div#comments_outer_"+ jsonData.wish_id+" div.comments-outer:LAST").fadeIn("slow");
        	
        	$(elem).val('');
        	
        	$( "div.comments span#comment_count_"+jsonData.wp_id).text("("+jsonData.comment_count+")");
        	$( "div.comments span#comment_count_"+jsonData.wp_id).fadeIn();
        	
        	$( "div.comments span#comment_count_"+jsonData.wish_id).text("("+jsonData.comment_count+")");
        	$( "div.comments span#comment_count_"+jsonData.wish_id).fadeIn();
        	
//        	Update hidden field value in wish popup for comment offset.
        	var hidden_field_wish_comment_offset = parseInt( $("input[type=hidden]#wish_comments_offset_"+jsonData.wish_id ).val() );
        	hidden_field_wish_comment_offset++;
        	$("input[type=hidden]#wish_comments_offset_"+jsonData.wish_id).val( hidden_field_wish_comment_offset );
        	
        	
        	$(elem).removeAttr("disabled");
        	$(elem).css("background-color", "#FFFFFF");
        	$(elem).css("color", "#48545E;");
        	
//        	Activate action controls for comments.
        	activateCommentActions();
        	
        	//Adding scroller after 6 comments because if we manage this only with css then it gives issue. 
        	if( jsonData.comment_count > 6 )
        	{
        		$("div.wish-data-outer ~ div.comment-box-outer div.ok-comment-box div.ok-comment-box-bot div.comments_outer").css('overflow-y', 'auto');
        	}	
        	
        	
        	//Ajax call for sending 'comment' notification to wallpost owner 
        	//and users who have done any activity on it.
        	jQuery.ajax
        	({
        		url: "/" + PROJECT_NAME + "notifications/send-comment-notification",
        		type: "POST",
        		dataType: "json",
        		data: { 'wallpost_id' : jsonData.wp_id },
        		success: function(jsonData) 
        		{
        	        	
        	     }
        	});
        },
        error: function(xhr, ajaxOptions, thrownError) {
        	alert("Error while commenting, please try again!");
        }
	});
	
}
/**
 * 
 * @param wallpost_id
 * @param elem
 * @param event
 */
function addComment( wallpost_id, elem, event )
{
	event.preventDefault();//prevent default action enter.
	if( $(elem).val().trim() == "" )
	{
		alert( "Please enter comment text." );
		$(elem).val("");
		return;
	}
	
	$(elem).attr("disabled","disabled");
	$(elem).css("background-color","#E5E5E5");
	$(elem).css("color","#C0C0C0;");
	
	jQuery.ajax({
		url: "/" + PROJECT_NAME + "socialise/add-comment-to-the-wallpost",
		type: "POST",
		dataType: "json",
		data: {
			"wallpost_id" : wallpost_id,
			"comment" : $("form#comment_box_"+wallpost_id+" textarea").val()
		},
		timeout: 50000,
		success: function( jsonData ) {
			
			if( jsonData == 2 )
			{
				showDialogMsg('Oops!', "The action can not be performed because this post has been removed.", 3000,
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
				    height: 200,
				    width: 300
					}
				);
				
				$(elem).removeAttr("disabled");
				$(elem).css("background-color", "#FFFFFF");
				$(elem).css("color", "#48545E;");
				return;
			}	
			
			
			var comment = "";
			comment += '<div id="comments-outer_'+jsonData.comm_id+'" class="comments-outer comments-outer_'+jsonData.comm_id+'" rel="'+jsonData.comm_id+'">';
			
			var parameter_json = "{'user_id':"+jsonData.commenter_id+"}";
			comment += '<a disable-border="1" id="'+jsonData.commenter_id+'" title = "'+jsonData.commenter_fname+' '+jsonData.commenter_lname+'" href = "javascript:" onclick="getShortProfile(this,'+parameter_json+')" >';
			comment += '<div style="width:32px;" class="img short_profile_border" title = "'+jsonData.commenter_fname+' '+jsonData.commenter_lname+'"><img src="' + jsonData.commenter_small_image + '" width="" height="" /></div>';
			comment += '</a>';
			
			//Short profile view popup holder
			comment += '<div id="view-outer_'+jsonData.commenter_id+'" class="quickview-outer" popup-state="off" style="display:none;">';
			comment += '<div class="popupArrow">';
			comment += '<img width="36" height="22" src="'+IMAGE_PATH+'/arrow-purple2.png">';
			comment += '</div>';
			comment += '<div id="view_'+jsonData.commenter_id+'" class="quickview"> </div>';
			comment += '</div>';
			
			comment += '<div class="text">';
			comment += '<div rel="'+jsonData.comm_id+'" id="idd_'+jsonData.comm_id+'" class="comment-text1">';
			comment += '<span title = "'+jsonData.commenter_fname+' '+jsonData.commenter_lname+'"><a href="/'+PROJECT_NAME+'profile/iprofile/id/'+jsonData.commenter_id+'">'+showCroppedText(jsonData.commenter_fname+' '+jsonData.commenter_lname, 50)+'</a></span>';
			comment += '<div class = "comment_text" id = "'+jsonData.comm_id+'">';
			comment += jsonData.comm_text;
			comment += '</div>';
			comment += '</div>';
			comment += '<textarea class="comment-textarea" maxlength="255" style="resize: vertical; display:none !important;" rel="'+jsonData.comm_id+'" id="id_'+jsonData.comm_id+'" rows="1" cols="1">'+jsonData.comm_text+'</textarea>';
			comment += '<div class="comments-date">'+jsonData.created_at+'</div>';
			comment += '</div>';
			comment += '<div class="edit_comment" style="text-align: right; position: relative; display: none;">';
			comment += '<div style="bottom: -85px; width: 78px; padding: 5px; right: -7px; text-align: left; z-index: 99999; display: none;" class="edit-popup-outer">';
			comment += '<div style=" margin:0 0 0 55px" class="edit-popup-arrow">';
			comment += '<img width="26" height="16" src="'+IMAGE_PATH+'/arrow-up-grey2.png">';
			comment += '</div>';
			comment += '<div style="width: 65px; padding:5px;" class="edit-popup">';
			comment += '<div class="edit-popup-col1">';
			comment += '<h5 style="text-transform: none !important;">';
			comment += '<a href="javascript:;" class="text-grey2-link edit_comment_link" style="font-size:12px;">Edit</a>';
			comment += '</h5>';
			comment += '</div>';
			comment += '<div class="edit-popup-col1">';
			comment += '<h5 style="text-transform: none !important;">';
			comment += '<a href="javascript:;" class=" text-grey2-link delete_comment_link" style="font-size:12px;" rel="'+jsonData.comm_id+'">Delete</a>';
			comment += '</h5>';
			comment += '</div>';
			comment += '</div>';
			comment += '</div>';
			comment += '</div>';
			comment += '</div>';
			
			$("div#comments_outer_"+ jsonData.wp_id).append(comment);
			$("div#comment_box_" + jsonData.wp_id).show();
			$("div#comments_outer_"+ jsonData.wp_id+" div.comments-outer:LAST").fadeIn("slow");
			
			$(elem).val('');
			
			$( "div.comments span#comment_count_"+wallpost_id).text("("+jsonData.comment_count+")");
			$( "div.comments span#comment_count_"+wallpost_id).fadeIn();
			
			$(elem).removeAttr("disabled");
			$(elem).css("background-color", "#FFFFFF");
			$(elem).css("color", "#48545E;");
			
//        	Activate action controls for comments.
			activateCommentActions();
			
			//Ajax call for sending 'comment' notification to wallpost owner 
			//and users who have done any activity on it.
			jQuery.ajax
			({
				url: "/" + PROJECT_NAME + "notifications/send-comment-notification",
				type: "POST",
				dataType: "json",
				data: { 'wallpost_id' : wallpost_id },
				success: function(jsonData) 
				{
					
				}
			});
			
		},
		error: function(xhr, ajaxOptions, thrownError) {
			alert("Error while commenting, please try again!");
		}
	});
}

/**
 * Who liked listing functionality.
 * 
 * @param wallpost_id
 * @author jsingh7
 * @version 1.0
 * @deprecated
 */
function openAllCommentsPopup( wallpost_id, elem )
{
	$('div#comments_listing_popup').bPopup(
	{
		modalClose: true,
	    easing: 'easeOutBack', //uses jQuery easing plugin
        speed: 500,
		closeClass : 'close_bpopup',
        zIndex: 2,
//        transition: 'slideDown',
        onClose: function() { $("input[type=hidden]#offsettt_comm").val(0); },
        onOpen: function() {
        	//Do required stuff...
        	$("div#list_of_comments").html("<div style = 'display : table-cell; height: 390px; width: 395px; text-align:center; vertical-align: middle;'><image src = "+IMAGE_PATH+"/loading_medium_purple.gif></div>");
        	jQuery.ajax({
                url: "/" + PROJECT_NAME + "socialise/get-comments-for-wallpost",
                type: "POST",
                dataType: "json",
                data: { 'wallpost_id' : wallpost_id, 'offset' : $("input[type=hidden]#offsettt_comm").val() },
                timeout: 50000,
                success: function( jsonData ) {
                	 var html = "<ol>";
                	
                	 
                	for( i in jsonData.data )
                	{
                	   if( jsonData.data[i]['is_hidden'] != 1 )
                	   {
                		html += '<div id="comments-outer_'+jsonData.data[i]['comment_id']+'" class="comments-outer comment-outer-popup-border comments-outer_'+jsonData.data[i]['comment_id']+'" style="float:left;">';
                		html += '<a href="/'+PROJECT_NAME+'profile/iprofile/id/'+jsonData.data[i]['comment_user_id']+'">';
                		html += '<div title="'+jsonData.data[i]['comment_user_name']+'" class="img short_profile_border">';
                		html += '<div>';
                		html += '<img width="" height="" src="'+jsonData.data[i]['comment_profes_image']+'">';
                		html += '</div>';
                		html += '</div>';
                		html += '</a>';
                		html += '<div style=" margin:0 0 0 10px !important;width: 81% !important; word-wrap: break-word;" class="text">';
                		html += '<span class = "user_name" title = "'+jsonData.data[i]['comment_user_name']+'">'+showCroppedText( jsonData.data[i]['comment_user_name'], 50 )+'</span>';
                		html += '<p rel="'+jsonData.data[i]['comment_id']+'" id="idd_'+jsonData.data[i]['comment_id']+'_popUp">'+jsonData.data[i]['comment_text']+'</p>';
                		html += '<textarea class="comment-textarea" maxlength="255" style="resize: vertical; display:none !important;" rel="'+jsonData.data[i]['comment_id']+'" id="id_'+jsonData.data[i]['comment_id']+'_popUp" rows="1" cols="1">'+jsonData.data[i]['comment_text']+'</textarea>';
                		html += '<div style="padding:0;" class="comments-date" >'+jsonData.data[i]['created_at'];
                		html += '</div>';
                		html += '</div>';
                		
        		    	if( jsonData.data[i]['comment_user_id'] == $("input[type=hidden]#my_user_id").val() )
        		    	{         		
        		    		html += '<div class="edit_comment" style="text-align: right; position: relative;   display: none;">';
        		    		html += '<div style="bottom: -85px; width: 78px; padding: 5px; right: -7px; text-align: left; z-index: 99999; display: none;" class="edit-popup-outer">';
        		    		html += '<div style=" margin:0 0 0 55px" class="edit-popup-arrow">';
        		    		html += '<img width="26" height="16" src="'+IMAGE_PATH+'/arrow-up-grey2.png">';
        		    		html += '</div>';
        		    		html += '<div style="width: 65px; padding:5px;" class="edit-popup">';
        		    		html += '<div class="edit-popup-col1"><h5>';
        		    		html += '<a href="javascript:;" class="text-grey2-link edit_comment_link" style="font-size:12px;text-transform: none !important;">Edit</a></h5>';
        		    		html += '</div>';
        		    		html += '<div class="edit-popup-col1"><h5><a href="javascript:;" class=" text-grey2-link delete_comment_link" style="font-size:12px;text-transform: none !important;">Delete</a></h5>';
        		    		html += '</div>';
        		    		html += '</div>';
        		    		html += '</div>';
        		    		html += '</div>';
        		        }
        		    	else
        		    	{
        		    		html += '<div style="text-align: right;" class="hide_comment" ><img title="Hide comment" src="'+IMAGE_PATH+'/cross-grey.png">';
        		    		html += '</div>';
        		    	}	
                		html += '</div>';
                	   }
                	  else
                		  {
                		    html += '<div class="comments-outer comments-outer_'+jsonData.data[i]['comment_id']+' hidden_comment" rel="'+jsonData.data[i]['comment_id']+'"><span onclick="showComments(this);" class="unhide-comment"  rel="'+jsonData.data[i]['comment_id']+'" title="Hidden Comment [Hidden on your wall]">...</span>';
                		    html += '</div>';
                		 }
                	  // html += '</li>';

                	}
                	html += "</ol>";
                	if( jsonData.is_there_more_recs == 1 )
                	{
                		html += "<span id = 'load_more_comments' onclick = 'loadMoreCommentsInPopup( "+wallpost_id+", this )'> <!--<img src='"+IMAGE_PATH+"/comments-icon.png'/>-->Look More</span>";
                	}
                	
                	$("input[type=hidden]#offsettt_comm").val( parseInt( $("input[type=hidden]#offsettt_comm").val() ) + parseInt( i ) );
                	$("input[type=hidden]#offsettt_comm").val( parseInt( $("input[type=hidden]#offsettt_comm").val() ) + 1 );
                	
                	$("div#list_of_comments").html(html);
                	//$("div#list_of_comments").css("background","red");
                	activateCommentPopUpActions(wallpost_id);
                	//showComments();	
                	
               },

               error: function(xhr, ajaxOptions, thrownError) {

                }
        	});
        }, 
	},
	function() {
		//Do required stuff...
	});
}

function loadMoreComments( wallpost_id, elem )
{
	var idddd = addLoadingImage($('div#load_more_comments_'+wallpost_id), "before");
	$('div#load_more_comments_'+wallpost_id).hide();
    jQuery.ajax({
    	 url: "/" + PROJECT_NAME + "socialise/get-comments-for-wallpost",
         type: "POST",
         dataType: "json",
         data: { 'wallpost_id' : wallpost_id, 'offset' : $("input[type=hidden]#offsettt_comm_"+wallpost_id).val() },
         timeout: 50000,
         success: function( jsonData ) {
		        	var comments_json = jsonData.data;
		         	for( j in comments_json )
		         	{
		         		var html = "";
		         		if( comments_json[j]['is_hidden'] == 0 )
		     	    	{
		         			html += '<div class="comments-outer comments-outer_'+comments_json[j]['comment_id']+'">';
		     			    
		     	    		var parameter_json = "{'user_id':"+comments_json[j]['comment_user_id']+"}";
		     	    		if(comments_json[j]['is_user_photo_clickable'])
            	    		{
			     	    		html += '<a disable-border="1" id="'+comments_json[j]['comment_user_id']+'" title = "'+comments_json[j]['comment_user_name']+'" href = "javascript:" onclick="getShortProfile(this,'+parameter_json+')" >';
			     	    		html += '<div class="img img32 short_profile_border" title = "'+comments_json[j]['comment_user_name']+'"><img src="' + comments_json[j]['comment_profes_image'] + '" width="" height="" /></div>';
			     	    		html += '</a>';
            	    		}
		     	    		else
	     	    			{
			     	    			html += '<div class="img img32 short_profile_border" title = "'+comments_json[j]['comment_user_name']+'"><img src="' + comments_json[j]['comment_profes_image'] + '" width="" height="" /></div>';
	     	    			}
		     	    		//Short profile view popup holder
		     	    		html += '<div id="view-outer_'+comments_json[j]['comment_user_id']+'" class="quickview-outer" popup-state="off" style="display:none;">';
		     	    		html += '<div class="popupArrow">';
		     	    		html += '<img width="36" height="22" src="'+IMAGE_PATH+'/arrow-purple2.png">';
		     	    		html += '</div>';
		     	    		html += '<div id="view_'+comments_json[j]['comment_user_id']+'" class="quickview"> </div>';
		     	    		html += '</div>';
		     		    	
		     	    		//html += '<div class="text"><div class="comment-text1" id = "idd_'+comments_json[j]['comment_id']+'" rel = "'+comments_json[j]['comment_id']+'"><span>'+comments_json[j]['comment_user_name']+'</span>';
		     	    		html += '<div class="text"><div class="comment-text1" id = "idd_'+comments_json[j]['comment_id']+'" rel = "'+comments_json[j]['comment_id']+'">';
            	    		html += '<span><a href = "/'+PROJECT_NAME+'profile/iprofile/id/'+comments_json[j]['comment_user_id']+'">'+comments_json[j]['comment_user_name']+'</a></span>';
		     	    		html += '<div class = "comment_text" id = "'+comments_json[j]['comment_id']+'">';
		     	    		html += showCroppedText( comments_json[j]['comment_text'], 150, "...<label class = 'show_full_comment' onclick = 'showFullComment(this)'>>></label>");
		     	    		html += '</div> ';
		     	    		html += '<div class = "full_comment_text" style = "display:none" id = "'+comments_json[j]['comment_id']+'">';
		     	    		html += comments_json[j]['comment_text'];
		     	    		html += '</div>';
		     		    	
		     	    		html += '</div>';
		     	    		html += '<textarea cols="1" maxlength="255" class="comment-textarea" rows="1" id = "id_'+comments_json[j]['comment_id']+'" rel = "'+comments_json[j]['comment_id']+'" style = "  resize: vertical; display:none;" >'+comments_json[j]['comment_text']+'</textarea>';
		     	    		html += '<div class="comments-date">'+comments_json[j]['created_at']+'</div>';
		     	    		html += '</div>';
		     		    	
		     		    	if( comments_json[j]['is_my_comment'] == 1 || comments_json[j]['is_my_comment'] == "1" )
		     		    	{	
		     		    		html += '<div class="edit_comment">';
		     		    		html += '<div class="edit-popup-outer" style="bottom:-85px; width:78px; padding:5px; right: -7px; text-align:left; z-index:99999">';
		     		    		html += '<div class="edit-popup-arrow" style=" margin:0 0 0 55px"><img width="26" height="16" src="'+IMAGE_PATH+'/arrow-up-grey2.png"></div>';
		     		    		html += '<div class="edit-popup" style="width: 65px; padding:5px;">';
		     		    		html += '<div class="edit-popup-col1">';
		     		    		html += '<h5 style="text-transform: none !important;"><a style="font-size:12px;" class="text-grey2-link edit_comment_link" href="javascript:;">Edit</a></h5>';
		     		    		html += '</div>';
		     		    		html += '<div class="edit-popup-col1">';
		     		    		html += '<h5 style="text-transform: none !important;"><a style="font-size:12px;" class=" text-grey2-link delete_comment_link" href="javascript:;" rel = "'+comments_json[j]['comment_id']+'">Delete</a></h5>';
		     		    		html += '</div>';
		     		    		html += '</div>';
		     		    		html += '</div>';
		     		    		html += '</div>';
		     		    	}
		     		    	else
		     		    	{
		     		    		html += '<div style="text-align: right;" class="hide_comment"><img title="Hide comment" src="'+IMAGE_PATH+'/cross-grey.png"></div>';
		     		    	}
		     		    	
		     		    	html += '</div>';
		     	    	}
		     	    	else
		     	    	{
		     	    		html += '<div id="comments-outer_'+comments_json[j]['comment_id']+'" class="comments-outer hidden_comment comment-outer-popup-border" rel="'+comments_json[j]['comment_id']+'"><span rel="'+comments_json[j]['comment_id']+'" onclick="showComments(this);" class="unhide-comment" title = "Hidden Comment [Hidden on your wall]">...</span></div>';
		     	    	}
		         		$( "div#comments_outer_"+wallpost_id ).prepend(html);
		         	}
		         	
		         	$("input[type=hidden]#offsettt_comm_"+wallpost_id).val( parseInt( $("input[type=hidden]#offsettt_comm_"+wallpost_id ).val() ) + parseInt(j) + 1 );
		         	
		         	//Remove loading.
		         	$("span#"+idddd).remove();
		         	
		//         	checking if there are more records to show or not?
		         	if( jsonData.is_there_more_recs == 0 )
		         	{
		         		$('div#load_more_comments_'+wallpost_id).remove();
		         	}
		         	else
		         	{	
		         		$('div#load_more_comments_'+wallpost_id).fadeIn();
		         	}
		         	
		         	activateCommentActions(wallpost_id);
                },
                error: function(xhr, ajaxOptions, thrownError) {

                }
        	});
}

/**
 * Opens popup to share.
 * 
 * @param wallpost_id
 * @author jsingh7, sjaiswal
 * @version 1.1
 */
function shareThisPostByWallpostId( wallpost_id, elem )
{
	//clear ckeditor
	for (instance in CKEDITOR.instances) {
		CKEDITOR.instances[instance].updateElement();
	}
	$('div#share_photo_feed_popup').bPopup(
	{
		modalClose: true,
	    easing: 'easeOutBack', //uses jQuery easing plugin
        speed: 500,
		closeClass : 'close_bpopup',
        onClose: function() {},
        onOpen: function() {
        	//Do required stuff...
        	$("div#share_box").html("<div style = 'display : table-cell; height: 500px; width: 490px; text-align:center; vertical-align: middle;'><image src = "+IMAGE_PATH+"/loading_medium_purple.gif></div>");
        	jQuery.ajax({
                url: "/" + PROJECT_NAME + "socialise/get-info-of-original-wallpost",
                type: "POST",
                dataType: "json",
                data: { 'wallpost_id' : wallpost_id },
                timeout: 50000,
                success: function( jsonData ) 
                {
                	if( jsonData.error_code == 2 )
                	{
                		showDialogMsg( "Oops!", "The action can not be performed because this post has been removed.", 3000, {buttons:[{text:"OK",click:function(){$(this).dialog("close");}}],show:{effect:"fade"},hide:{effect:"fade"},dialogClass:"general_dialog_message",height:200,width:300} );
                		var bPopup = $('div#share_photo_feed_popup').bPopup();
                		bPopup.close();
                		return;
                	}
                	
                	var html = "";
                	html += '<div class="share-hdr2">';

					html += '<div class="share-hdr2-lt collage_text">';
					html += '<div id = "photo_thumbnail">';
					html += getPopupCollageHTML( jsonData.collage, jsonData.first_img_portrait_or_landscape );

                	html += '</div>';

                	
					html += '</div>';
					html += '<div class="share-hdr2-rt collage_text">';

					//html += '<h4>'+jsonData.wallpost_text+'</h4>';
					html += '<p>';
					if(jsonData.wallpost_user_text!=null && jsonData.wallpost_user_text!=""){
						html+=jsonData.wallpost_user_text;
					}
					else {
						if(jsonData.socialise_photo_desc!=null){
							html+=jsonData.socialise_photo_desc;
						}
			
					}
					html+='</p>';
					html += '</div>';
					html += '</div>';
					
                	html += '<form class="form-share-pop">';
                	html += '<div id = "privacy">';
                	html += '<input class="share-checkbox" checked="checked" type="checkbox" id="share-update" name="share-wall[]" value="1" onclick = "enableDisableShareForm(this)"> Share an update';
                	
                	html += '<div class="share-greybox">';
                	
                	html += '<textarea maxlength="255" style="height:50px; width:97%;background:#fff;border:1px solid #ddd;"id="photo_text" name = "photo_text" placeholder="Share an update. Type a name to mention a connection or company." rows="" cols="" ></textarea>';
                	html += '<font style = " float:left; padding:10px 10px 0 0;color:#6A6A6A">';
             		html += 'Share with';
             		html += '</font>';
            		
             		html += '<div id="win-xp6">';
            		html += '<select style="display: none;" id="privacydd" name="privacy">';
            		html += '<option value="1">Public</option>';
            		html += '<option value="2">Links</option>';
            		html += '<option value="3">Links of Links</option>';
            		html += '</select>';
            		html += '</div>';
            		
            		html += '</div>';
                	
            		html += '</div>';					
                	
            		html += '</div>';
                	
                	/****Second Div Starts*****/
                	html += '<div id = "privacy">';
                	html += '<input class="share-checkbox" type="checkbox" id="share-individual" name="share-wall[]" value="2"> Send to individuals';
                	html += '<div class="share-greybox individual-msg-div">';
                	html += '<div class="share-greybox-lt">';
                	html += 'To:';
                	html += '</div>';
                	html += '<div class="share-greybox-rt">';
                	html += '<input placeholder="Type name or email" id="receiver_id" name="receiver_id" style="width:99%; border:1px solid #ddd;" type="text">';
                	html += '</div>';
                	html += '<div class="share-greybox-lt">';
                	html += 'Message:';
                	html += '</div>';
                	html += '<div class="share-greybox-rt">';
                	html += '<textarea placeholder="Your message here" name="share_text_msg" id="share_text_msg" style="height:50px; width:97%;background:#fff;border:1px solid #ddd;"></textarea>';
                	html += '</div>';
                	
            	
            		html += '</div>';
                	
                	html += '</div>';					
                	html += '</div>';
                	/****Second Div Ends*****/
                	
                	html += '<div class="individual_popup_msg" style = "display: inline-block; height: 27px; padding: 0px; float: left; margin-top: 10px;  text-align: center;margin-bottom: 20px;">';
                	if(jsonData.post_update_type == 14)
                	{	
                		html += '<a id="share_popup" style="float:left;" href="javascript:;" onclick = "sharePhotofeedFromWall('+jsonData.wallpost_id+', '+jsonData.original_user_id+', this)">';
                	}
                	else
                	{
                		html += '<a id="share_popup" style="float:left;" href="javascript:;" onclick = "sharePhotofeedFromWall('+jsonData.wallpost_id+', '+jsonData.collage[0]['image_posted_by']+', this)">';
                	}
                	html += '<img width="102" height="27" title="Share" alt="Share" src="'+IMAGE_PATH+'/btn-share.png">';
            		html += '</a>';
            		html += '</div>';
            		
                	html += '<input type="hidden" name="photo_id" id="photo_id" value="'+jsonData.socialise_photo_id+'" />';
                	html += '</form>';
                	
                	$('div#share_box').html(html);

                	//Apply CKeditor after html loading
                	CKEDITOR.replace( 'photo_text', {
                		width:390,
                		height:60,
                		uiColor: '#6C518F',
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
                		CKEDITOR.instances.photo_text.focus();

                		}
                		},
                	});

                	//Apply CKeditor to "send to individuals" textarea 
                	CKEDITOR.replace( 'share_text_msg', {
                		width:300,
                		height:60,
                		uiColor: '#6C518F',
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
                				CKEDITOR.instances.share_text_msg.focus();
                				

                			}
                		},
                	});
                	
                	//Resizing and crop to fit small collage images with nailthumb.js 
                	$( 'img.small_jquerynailthumb' ).each(function( index ) {
                    	jQuery( this ).nailthumb(
                    			{
                    				onStart:function(container){
                    					
                                    },
                                    width: $(this).attr('rel_width'),
                                    height: $(this).attr('rel_height'),
                                    method:'crop',
                    				onFinish:function(container){
                                        //container.children().removeClass('require_jquery_thumbnail_processing');
                                    }
                    			}
                    		);
                    });
                	
                	$( 'div#share_box img.single_image' ).each(function( index ) {
                    	jQuery( this ).nailthumb(
                    			{
                    				onStart:function(container){
                    					
                                    },
                                    width: $(this).attr('rel_width'),
                                    height: $(this).attr('rel_height'),
                                    method:'crop',
                    				onFinish:function(container){
                                        //container.children().removeClass('require_jquery_thumbnail_processing');
                                    }
                    			}
                    		);
                    });
                	
                	retrieveUsersWithAutocomplete();
                	addIndividualCheckBoxEvent();

					if($('#privacydd').length > 0)
					{
						$('#privacydd option[value=2]').attr('selected','selected');
						$("select#privacydd").selectBoxIt({theme: "jqueryui"});
					}
                	$("#jq_receiver_id").attr("placeholder","Type name or email");
                	$("#jq_receiver_id").css("width","232px");
                	
                	//Popup reposition
                	var bPopup = $("div#share_photo_feed_popup").bPopup();
            		bPopup.reposition();

            		if( $( window ).height() < 637 )
            		{
            			$("div#share_photo_feed_popup form.form-share-pop").css("height", "225px");
            		}
            		else
            		{
            			$("div#share_photo_feed_popup form.form-share-pop").css("height", "");
            		}
            		
                },
                error: function(xhr, ajaxOptions, thrownError) {
                	$("div.message_box").remove();
                	showDefaultMsg( "Error while loading share popup, please try again.", 3 );
                }
        	});
        }, 
	},
	function() {
		//Do required stuff...
	});
	
	
}
function addIndividualCheckBoxEvent(){
	$( ".share-checkbox").unbind( "click" );
	$(".share-checkbox").click(function()
	{
		if( $('.share-checkbox:checked').length>0 )
		{
			$(".individual_popup_msg").fadeIn();
			if( $('#share-individual:checked').length>0 )
			{
				$(".individual-msg-div").fadeIn();
			}
			else
			{
				$(".individual-msg-div").hide();
			}
		}
		else
		{
			$(".individual-msg-div").hide();
			$(".individual_popup_msg").hide();
		}
		
		//Popup reposition
		var bPopup = $("div#share_photo_feed_popup").bPopup();
		bPopup.reposition();
	});
}

function retrieveUsersWithAutocomplete(){
	
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
		resultsFormatter: function(item){ return "<li><div style = 'width:25px; height:25px; display:inline-block;margin: 3px 0 1px;'> <div style = 'width:25px; height:25px; display : table-cell; vertical-align: middle; text-align: center;'>" + "<img style = 'max-width : 25px; max-height : 25px;' src='" + item.url + "' title='" + item.first_name + " " + item.last_name + "'/></div></div>" + "<div style='display: block; margin-top: -29px; padding-bottom: 4px; padding-left: 28px;'><div class='full_name'>" + item.first_name + " " + item.last_name + "</div><div class='email'>" + item.email + "</div></div></li>";  },
		tokenFormatter: function(item) { return "<li><p>" + item.first_name + " " + item.last_name + "</p></li>"; }
	});
}
function displayShareButton(){
	$( ".share-checkbox").unbind( "click" );
	$(".share-checkbox").click(function(){
		if($('[name="share-wall[]"]:checked').length>0){
			$("#share_popup").fadeIn();
		}
		else{
			$("#share_popup").hide();
		}
	});
}
/**
 * Shares the selected wallpost on the wall. 
 * 
 * @param wallpost_id
 * @param wallpost_from_user_id (original user of this post from where it has been originated.)
 * @author jsingh7
 * @author spatial
 * @version 1.0
 */
function sharePhotofeedFromWall(wallpost_id, wallpost_from_user_id, elem)
{
	
	// for sending ckeditor data in serialised form data
	for (instance in CKEDITOR.instances) {
        CKEDITOR.instances[instance].updateElement();
    }
	if($("input#receiver_id").val()=="" && $("#share-individual:checked").length==1)
	{
		alert("Please add atleast one receiver.");
	}
	else
	{

		var shareOnWall = 0;
		var shareOnEmail = 0;
		if($('#share-update').prop("checked"))
		{
			shareOnWall = 1;
		}
		if($('#share-individual').prop("checked"))
		{
			shareOnEmail = 1;
		}
		
		//hide share button an show loading.
		$(elem).hide();
		var iddd = addLoadingImage( $(elem), "before", 'loading_small_purple.gif', 102, 27 );
		
		//Sharing wallpost on wall.
		if(shareOnWall == 1)
		{
			//var privacy = $("select#privacydd").val();
			var jdata = $("div#share_box form").serialize()+"&wallpost_id="+wallpost_id+"&wallpost_from_user_id="+wallpost_from_user_id+"&shared_from_photodetail_to_wall=0&shared_from_wall_to_wall=1";
			jQuery.ajax({
				url: "/" + PROJECT_NAME + "socialise/share-photofeed-from-wall",
				type: "POST",
				dataType: "json",
				data: jdata,
				timeout: 50000,
				success: function( jsonData ) 
				{
					//console.log(jsonData);
					// send email message...
					if(shareOnEmail == 1)
					{
						var emailMsgText = $("textarea#share_text_msg").val();
						var userIDs = $("input#receiver_id").val();
						jQuery.ajax
						({
							url: "/" + PROJECT_NAME + "dashboard/send-wall-link-to-individual-emails",
							type: "POST",
							dataType: "json",
							data: {"share_text_msg":emailMsgText,"wallpost_id":jsonData.wall_post_id, "receiver_id":userIDs } ,
							success: function(jsonData) 
							{
								
							}
						});
					}
					
					//Removing loading sign.
					$("span#"+iddd).hide();
					//Showing up button again.
					$(elem).fadeIn();
					$('div.share_count a[rel=share_count_'+wallpost_id+']').html('('+jsonData.share_count_of_post+')');
					//closing popup
					$('div#share_photo_feed_popup').bPopup().close();
					
					//Show dialog after sharing.
					showDialogMsg( "Sharing", "Photo shared successfully.", 3000, 
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
						    width: 300
						}		
					);
					
					var wall_post = "";
					wall_post = imageFeedWallPostMaker(
							jsonData.wall_post_id,
							jsonData.user_id,
							jsonData.user_type,
							jsonData.user_name,
							jsonData.user_gender,
							jsonData.user_image,
							jsonData.collage,
							jsonData.collage_description,
							jsonData.collage_description_when_shared,
							jsonData.collage_created_at,
							1,
							0,
							0,
							0,
							[],
							0,
							"",
							jsonData.is_ok_comment_share_pannel_visible,
							jsonData.privacy,
							1,
							jsonData.post_update_type,
							[],
							0,
							jsonData.first_img_portrait_or_landscape,
							{ 
								'origi_user_id' : jsonData.original_user_id, 
								'origi_user_name' : jsonData.original_user_full_name, 
								'origi_user_type': jsonData.original_user_type,
								'origi_profile_pic': jsonData.original_user_prof_pic,
								'origi_post_created_at': jsonData.original_user_post_created_at
								
							},
							null,
							null,
							null,
							{
								'sharer_string':jsonData.sharers_string.string,
								'shared_from_wallpost_exist':jsonData.sharers_string.shared_from_wallpost_exist
							}
							
					);
					
					//Prepending wallpost/photofeed on wall.
					$("div#updates_holder").prepend( wall_post );
					$("div.news-update-content:first").fadeIn();
					
					//Updating share count of the post from which we are sharing this post.
					$('div.share_count a[rel=share_count_'+wallpost_id+']').text("("+jsonData.share_count_of_post+")");
					
					//closing share popup
					$( "span#"+iddd ).remove();
					$(elem).fadeIn();
					$('div#share_photo_feed_popup').bPopup().close();
					
					
					$( 'div.news-update-content:first img.require_jquery_thumbnail_processing' ).each(function( index ) {
                    	jQuery( this ).nailthumb(
                    			{
                    				onStart:function(container){
                    					
                                    },
                                    width: $(this).attr('rel_width'),
                                    height: $(this).attr('rel_height'),
                                    method:'crop',
                    				onFinish:function(container){
                                        //container.children().removeClass('require_jquery_thumbnail_processing');
                                    }
                    			}
                    		);
                    });

					
					//Ajax call for sending 'share' notification to wallpost owner 
					//and users who have done any activity on it.
				jQuery.ajax({
						url: "/" + PROJECT_NAME + "notifications/send-share-notification",
						type: "POST",
						dataType: "json",
						data: { 'wallpost_id' : wallpost_id },
						success: function(jsonData)
						{
							
						}
					});
				
					
				},
				error: function(xhr, ajaxOptions, thrownError) {
					//Show dialog after sharing(if error occured).
					showDialogMsg( "Sharing", "Problem occured while sharing. Please try again after some time.", 3000, 
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
						    height: 200,
						    width: 300
						}		
					);
				}
			});
		}
		//Sharing wallposts in imails.
		else if(shareOnWall == 0 && shareOnEmail == 1 ){
			var emailMsgText = $("textarea#share_text_msg").val();
			var userIDs = $("input#receiver_id").val();
			jQuery.ajax
			({
				url: "/" + PROJECT_NAME + "dashboard/send-wall-link-to-individual-emails",
				type: "POST",
				dataType: "json",
				data: {"share_text_msg":emailMsgText, "wallpost_id":wallpost_id, "receiver_id":userIDs } ,
				success: function(jsonData)
				{
					
//					$("span#"+iddd).remove();
					
					//Removing loading sign.
					$("span#"+iddd).hide();
					//Showing up button again.
					$(elem).fadeIn();
					
					//closing popup
					$('div#share_photo_feed_popup').bPopup().close();
					
					//Show dialog after sharing.
					showDialogMsg( "Sharing", "Photo shared via imail.", 6000, 
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
						    height: 200,
						    width: 300
						}	
					);
				}
			});
		}		
	}   
}
/**
 * function used to send invitation to the users
 * author: Shaina Gandhi
 */

function invitationToUser(acceptUser)
{
	$('input#linkToConnect_'+acceptUser).hide();
	var ids = addLoadingImage($("input#linkToConnect_"+acceptUser), "before", "loading_small_purple.gif", "0", "14");

	jQuery.ajax({
		async: false,
        url: "/" + PROJECT_NAME + "links/send-link-request",
        type: "POST",
        dataType: "json",
        data: "accept_user="+acceptUser,
        success: function(jsonData) 
        {
        	$("span#"+ids).remove();
        	$('span#link_'+acceptUser).html("Link Request sent");
        	
		},
        error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
		}
    });
}

/**
 * Activate action controls for comments[edit, delete, hide] for pop up
 * They start working according to mouse actions.
 * 
 * @author dsingh
 * @deprecated
 */
/*function activateCommentPopUpActions(wallpost_id)
{
	$( "div.comments-outer").unbind( "mouseover" );
	$("div.comments-outer").mouseover(function(){
		$(this).children( "div.edit_comment" ).show();
		$(this).children( "div.hide_comment" ).show();
	});
	
	$( "div.comments-outer").unbind( "mouseout" );
	$("div.comments-outer").mouseout(function(){
		$(this).children( "div.edit_comment" ).hide();
		$(this).children( "div.hide_comment" ).hide();
	});
	
	$( "div.edit_comment").unbind( "click" );
	$("div.edit_comment").click(function(){
		$("div.edit-popup-outer").hide();
		$(this).children( "div.edit-popup-outer" ).show();
	});
	
	$( "div.edit-popup-outer" ).mouseleave(function() {
		$(this).hide();
	});
	
	//clicking edit action item, for comment edit.
	$( "div.edit_comment a.edit_comment_link").unbind( "click" );
	$("div.edit_comment a.edit_comment_link").click(function(){
		$("div.text p").fadeIn();
		$("div.text textarea").hide();
		$(this).parents("div.edit_comment").siblings("div.text").children("p").hide();
		$(this).parents("div.edit_comment").siblings("div.text").children("textarea").fadeIn();
		$(this).parents("div.edit_comment").siblings("div.text").children("textarea").focus();
	});
	
	//pressing enter key on edit commnet textarea.
	$("div.text textarea").unbind( "keydown" );
	$('div.text textarea').keydown(function(e){
	    if(e.keyCode == 13)
	    {
	    	e.preventDefault();
	    	var thiss = this;
	    	var iddd = addLoadingImage( $(this), "after", "tiny_loader.gif", 0, 10);

    		if( comment_edit_ajax_call && comment_edit_ajax_call.state() != "resolved" )
    		{
    			return;
    		}
    		else
    		{
    			comment_edit_ajax_call = jQuery.ajax({
    				url: "/" + PROJECT_NAME + "socialise/edit-comment",
    				type: "POST",
    				dataType: "json",
    				data: { 'comment_id' : $(thiss).attr("rel"), 'comment_text' : $(thiss).val() },
    				success: function(jsonData) {
    				
    					$("span#"+iddd).remove();
    					$(thiss).hide();
    					//updates in pop up
    					$('div.text p#idd_'+jsonData+'_popUp').text( $('div.text textarea#id_'+jsonData+'_popUp' ).val() );
    					$('div.text p#idd_'+jsonData).text( $('div.text textarea#id_'+jsonData+'_popUp' ).val() );
    					 
    					$('div.text p#idd_'+jsonData+'_popUp').fadeIn();
    					//$('div.text p#idd_'+jsonData+'_popUp').css("background","red");
    					
    					 
    				},
    				error: function(xhr, ajaxOptions, thrownError) {
    					//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
    					alert("Comment not updated. Please try agian.");
    				}
    			});
    		}	
	    }
	});
	//Clicking delete comment icon.
	$("div.comments-outer a.delete_comment_link").unbind( "click" );
	$("div.comments-outer a.delete_comment_link").click(function(){
		
		//var confirmation = confirm("DO you want to delete this comment?");
		var thisss = this;
		var comment_id = $(this).parents("div.edit_comment").siblings("div.text").children("p").attr("rel");
		//var wallpost_id = $(this).parents("div.news-update-content").attr("rel");
		
		var dialog_data2 = $("div#dialog_delete_comment_in_popup").data();   
		dialog_data2.element = thisss;  
		dialog_data2.comment_id = comment_id;
		
		$( "div#dialog_delete_comment_in_popup" ).dialog( "open" );
	});

	
	//Clicking hide comment icon.
	$("div.comments-outer div.hide_comment").unbind( "click" );
	$("div.comments-outer div.hide_comment").click(function(){
		if( comment_hide_ajax_call && comment_hide_ajax_call.state() != "resolved" )
		{
			alert("Please wait...");
		}
		else
		{
			$(this).parents("div.comments-outer").css("opacity",0.3);
			var thisss = this;
			var comment_id = $(this).siblings("div.text").children("p").attr("rel");
		
			comment_hide_ajax_call = jQuery.ajax({
				url: "/" + PROJECT_NAME + "socialise/hide-comment-of-user",
				type: "POST",
				dataType: "json",
				data: { 'comment_id' : comment_id },
				success: function(jsonData) {
					if( jsonData == 1 )
					{	
						//if( $(thisss).parents("div.ok-comment-box").children().children().children("div.comments-outer").length == 0 )
						$(thisss).parents("div.comments-outer").addClass("hidden_comment");
						$(thisss).parents("div.comments-outer").css("opacity",1);
						$(thisss).parents("div.comments-outer").html('<span  rel="'+comment_id+'" class="unhide-comment" title = "Hidden Comment [Hidden on your wall]">...</span>');
						showComments();
					}
					else
					{
						$(thisss).parents("div.comments-outer").css("opacity",1);
					}
				},
				error: function(xhr, ajaxOptions, thrownError) {
					//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
					$(thisss).parents("div.comments-outer").slideDown();
					alert("Comment not deleted. Please try agian.");
				}
			});
		}
	});	
}*/

/**
 * Delete comments in view more comments popup.
 * @param comment_id
 * @param wallpost_id
 * @param element
 * 
 * @depretated not is in use since MS-4.
 */
/*function deleteCommentInPopup(comment_id, thisss )
{
	comment_delete_ajax_call = jQuery.ajax({
		url: "/" + PROJECT_NAME + "socialise/delete-comment",
		type: "POST",
		dataType: "json",
		data: { 'comment_id' : comment_id },
		success: function(jsonData) {
			//Receives wallpost id in jsonData
			if( jsonData > 0 )
			{	
				$("div.comments-outer"+comment_id).remove();
				$("div#comments-outer"+comment_id).remove();
				
				var updated_count = parseInt( $( "div.comments span#comment_count_"+jsonData ).text().replace(/[\])}[{(]/g,'') ) - 1;
				$( "div.comments span#comment_count_"+jsonData ).text("("+updated_count+")");
				if( updated_count < 1 )
				{
					$( "div.comments span#comment_count_"+jsonData ).hide();
				}
			}
			else
			{
				$("div#comments-outer_"+comment_id).slideDown();
			}
		},
		error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			$("div#comments-outer_"+comment_id).slideDown();
			alert("Comment not deleted. Please try agian.");
		}
	});
}*/


/**
 * Activate action controls for comments[edit, delete, hide].
 * They start working according to mouse actions.
 * 
 * @author jsingh7
 */
function activateCommentActions()
{
	$( "div.comments-outer").unbind( "mouseover" );
	$("div.comments-outer").mouseover(function()
	{
		$(this).children( "div.edit_comment" ).show();
		$(this).children( "div.hide_comment" ).show();
	});
	
	$( "div.comments-outer").unbind( "mouseout" );
	$("div.comments-outer").mouseleave(function()
	{
		$(this).children( "div.edit_comment" ).hide();
		$(this).children( "div.hide_comment" ).hide();
	});
	
	$( "div.edit_comment").unbind( "click" );
	$("div.edit_comment").click(function(){
		$("div.edit-popup-outer").hide();
		$(this).children( "div.edit-popup-outer" ).show();
	});
	
	$( "div.edit-popup-outer" ).mouseleave(function() {
		$(this).hide();
	});
	
	//clicking edit action item, for comment edit.
	$( "div.edit_comment a.edit_comment_link").unbind( "click" );
	$("div.edit_comment a.edit_comment_link").click(function(){
		$("div.text p").fadeIn(); //for all.
		$("div.text textarea").hide(); //for all.

		$(this).parents("div.comments-outer").children("div.text").children("div.comment-text1").children("div.comment_text").hide();
		$(this).parents("div.comments-outer").children("div.text").children("textarea").fadeIn();
		$(this).parents("div.comments-outer").children("div.text").children("textarea").focus();
	});
	
	//pressing enter key on edit comment textarea.
	$("div.text textarea").unbind( "keydown" );
	$('div.text textarea').keydown(function(e){
	    if(e.keyCode == 13)
	    {
	    	if( $(this).val().trim() == "" )
	    	{
	    		alert('Please add some text for comment');
	    		$(this).val("");
	    		return;
	    	}
	    	e.preventDefault();
	    	var thiss = this;
	    	var iddd = addLoadingImage( $(this), "after", "tiny_loader.gif", 0, 10);

    		if( comment_edit_ajax_call && comment_edit_ajax_call.state() != "resolved" )
    		{
    			return;
    		}
    		else
    		{
    			comment_edit_ajax_call = jQuery.ajax({
    				url: "/" + PROJECT_NAME + "socialise/edit-comment",
    				type: "POST",
    				dataType: "json",
    				data: { 'comment_id' : $(thiss).attr("rel"), 'comment_text' : $(thiss).val() },
    				success: function(jsonData) {
    					
    					$("span#"+iddd).remove();
    					$(thiss).hide();
    					if(jsonData.id)
    					{
	    					$('div.text div#'+jsonData.id+'.comment_text').text( jsonData.text );
	    					$('div.text div#'+jsonData.id+'.comment_text').fadeIn();
	//    					$('div.text div#'+jsonData+'.comment_text1').text( $(thiss).val() );
	//    					$('div.text div#'+jsonData+'.comment_text1').fadeIn();
    					}
    				},
    				error: function(xhr, ajaxOptions, thrownError) {
    					//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
    					alert("Comment not updated. Please try agian.");
    				}
    			});
    		}	
	    }
	});
	
	//Clicking delete comment icon.
	$("div.comments-outer a.delete_comment_link").unbind( "click" );
	$("div.comments-outer a.delete_comment_link").click(function()
	{
		var thisss = this;
		//var comment_id = $(this).parents("div.edit_comment").siblings("div.text").children("p").attr("rel");
		var comment_id = $(this).attr("rel");
		var dialog_data = $("#dialog_delete_comment").data();  
		
		dialog_data.comment_id = comment_id;
		dialog_data.element = thisss;
		$( "#dialog_delete_comment" ).dialog( "open" );


	});

	//Clicking hide comment icon.
	$("div.comments-outer div.hide_comment").unbind( "click" );
	$("div.comments-outer div.hide_comment").click(function(){
		if($(this).attr("status"))
		{
			$(this).parents("div.comments-outer").css("opacity",0.3);
			var thisss = this;
			var comment_id = $(this).siblings("div.text").children("div.comment-text1").attr("rel");
			$(thisss).parents("div.comments-outer").addClass("hidden_comment");
			$(thisss).parents("div.comments-outer").css("opacity",1);
			$(thisss).parents("div.comments-outer").html('<span rel="'+comment_id+'" onclick="showComments(this);" class="unhide-comment" title = "Hidden Comment [Hidden on your wall]">...</span>');
			//showComments();	
		}
		else
		{
			if( comment_hide_ajax_call && comment_hide_ajax_call.state() != "resolved" )
			{
				alert("Please wait...");
			}
			else
			{
				$(this).parents("div.comments-outer").css("opacity",0.3);
				//var thisss = this;
				var comment_id = $(this).siblings("div.text").children("div.comment-text1").attr("rel");
			
				comment_hide_ajax_call = jQuery.ajax({
					url: "/" + PROJECT_NAME + "socialise/hide-comment-of-user",
					type: "POST",
					dataType: "json",
					data: { 'comment_id' : comment_id },
					success: function(jsonData) {
						if( jsonData == 1 )
						{	
							//if( $(thisss).parents("div.ok-comment-box").children().children().children("div.comments-outer").length == 0 )
							
							$("div#comments-outer_"+comment_id+".comments-outer").addClass("hidden_comment");
							$("div#comments-outer_"+comment_id+".comments-outer").css("opacity",1);
							$("div#comments-outer_"+comment_id+".comments-outer").html('<span rel="'+comment_id+'" onclick="showComments(this);" class="unhide-comment" title = "Hidden Comment [Hidden on your wall]">...</span>');
							//showComments();	
						}
						else
						{
							$("div#comments-outer_"+comment_id+".comments-outer").css("opacity",1);
						}
					},
					error: function(xhr, ajaxOptions, thrownError) {
						//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
						$("div#comments-outer_"+comment_id+".comments-outer").css("opacity",1);
						alert("Error occured! Please try agian.");
					}
				});
			}
		}
	});
}
/**
 * Deletes comment from wall.
 * @param comment_id
 * @param wallpost_id
 * @author jsingh7
 */
function deleteComment(comment_id, thisss)
{
	comment_delete_ajax_call = jQuery.ajax({
		url: "/" + PROJECT_NAME + "socialise/delete-comment",
		type: "POST",
		dataType: "json",
		data: { 'comment_id' : comment_id },
		success: function(jsonData) {
		
			//Receives wallpost id in jsonData.
			if( jsonData.comment_id > 0 )
			{
				$("div#comments-outer_"+comment_id).remove();
				
				var numItems = $('div#comment_box_'+jsonData.wallpost_id+' div.comments-outer').length;
				var seeMoreDiv = $('div#comment_box_'+jsonData.wallpost_id+' div.ok-comment-box-bot-right').length ;
				
				if(numItems == 0 && seeMoreDiv == 0){
					$('div#comment_box_'+jsonData.wallpost_id).hide();
				}
				
				var updated_count = parseInt( $( "div.comments span#comment_count_"+jsonData.wallpost_id ).text().replace(/[\])}[{(]/g,'') ) - 1;
				$( "div.comments span#comment_count_"+jsonData.wallpost_id ).text("("+updated_count+")");
				if( updated_count < 1 )
				{
					$( "div.comments span#comment_count_"+jsonData.wallpost_id ).hide();
				}
			}
			else
			{
				$("div#comments-outer_"+comment_id).slideDown();
			}	
			
		},
		error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			$(thisss).parents("div.comments-outer").slideDown();
			showDefaultMsg("Comment not deleted. Please try agian.",2);
		}
	});
}

/**
 * 
 * @param elem
 * @author ?
 * @author hkaur5
 */
function showComments(elem)
{
	$(elem).unbind();
//	$("span.unhide-comment").click(function(){
		var rel = $(elem).parent().attr("rel");
		var elemClass = "comments-outer_"+rel;
		var comment_id = $(elem).attr("rel");
		
		jQuery.ajax({
			url: "/" + PROJECT_NAME + "socialise/show-comment-of-user",
			type: "POST",
			dataType: "json",
			data: { 'comment_id' : comment_id },
			success: function(jsonData) {
				if(jsonData)
				{	
					var comment = "";
		        	
		    		var parameter_json = "{'user_id':"+jsonData.commenter_id+"}";
		    		if(jsonData.is_user_photo_clickable)
		    		{
		    		comment += '<a disable-border="1" id="'+jsonData.commenter_id+'" title = "'+jsonData.commenter_fname+' '+jsonData.commenter_lname+'" href = "javascript:" onclick="getShortProfile(this,'+parameter_json+')" >';
		    		comment += '<div class="img short_profile_border" title = "'+jsonData.commenter_fname+' '+jsonData.commenter_lname+'"><img src="' + jsonData.commenter_small_image + '" width="" height="" /></div>';
		    		comment += '</a>';
		    		}
		    		else
	    			{
			    		comment += '<div class="img short_profile_border" title = "'+jsonData.commenter_fname+' '+jsonData.commenter_lname+'"><img src="' + jsonData.commenter_small_image + '" width="" height="" /></div>';
	    			}
		    		//Short profile view popup holder
		    		comment += '<div id="view-outer_'+jsonData.commenter_id+'" class="quickview-outer" popup-state="off" style="display:none;">';
		    		comment += '<div class="popupArrow">';
		    		comment += '<img width="36" height="22" src="'+IMAGE_PATH+'/arrow-purple2.png">';
		    		comment += '</div>';
		    		comment += '<div id="view_'+jsonData.commenter_id+'" class="quickview"> </div>';
		    		comment += '</div>';
		    		
				    
		    		comment += '<div class="text"><div class="comment-text1" id = "idd_'+jsonData.comm_id+'" rel = "'+jsonData.comm_id+'"><span>'+jsonData.commenter_fname+' '+jsonData.commenter_lname+'</span>';
		    		comment += '<div class = "comment_text" id = "'+jsonData.comm_id+'">';
		    		comment += jsonData.comm_text;
		    		comment += '</div> ';
		    		comment += '</div> ';
		    		comment += '<textarea cols="1" maxlength= "255" class="comment-textarea" rows="1" id = "id_'+jsonData.comm_id+'" rel = "'+jsonData.comm_id+'" style = "  resize: vertical; display:none;" >'+jsonData.comm_text+'</textarea>';
		    		comment += '<div class="comments-date">'+jsonData.created_at+'<a rel="'+jsonData.comm_id+'" href="javascript:;" id="unhideComment_'+jsonData.comm_id+'" class="unhideComment_'+jsonData.comm_id+' unhideComment">Unhide</a></div>';
		    		comment += '</div>';
		    		comment += '<div style="text-align: right;" status="hide" class="hide_comment hide_comment_'+jsonData.comm_id+'"><img title="Hide comment" src="'+IMAGE_PATH+'/cross-grey.png"></div>';
		    		$("."+elemClass).empty();
		    		$("."+elemClass).html(comment);
		    		$("."+elemClass).css("opacity","0.3");
		    		$("."+elemClass).removeClass("hidden_comment");
		        	// Activate action controls for comments.
		        	activateCommentActions();
		        	unHideComment();
				}
				else
				{
					// $(thisss).parents("div.comments-outer").css("opacity",1);
				}
			},
			error: function(xhr, ajaxOptions, thrownError) {
				//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
				$(thisss).parents("div.comments-outer").slideDown();
				alert("Comment not deleted. Please try agian.");
			}
		});
		

}
function unHideComment(){
	$("a.unhideComment").unbind();
	$("a.unhideComment").click(function(){
		//var elem = $(this).parent();
		var comment_id = $(this).attr("rel");
		jQuery.ajax({
			url: "/" + PROJECT_NAME + "socialise/unhide-comment-of-user",
			type: "POST",
			dataType: "json",
			data: { 'comment_id' : comment_id },
			success: function(jsonData) {
				$(".hide_comment_"+comment_id).removeAttr("status");
				$(".unhideComment_"+comment_id).remove();
				$("#comments-outer_"+comment_id).css("opacity","1");
				$(".comments-outer_"+comment_id).css("opacity","1");
			},
			error: function(xhr, ajaxOptions, thrownError) {
				//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
				$(thisss).parents("div.comments-outer").slideDown();
				alert("Comment not deleted. Please try agian.");
			}
		});
	});
}
//Show / hide privacy options for wallpost.
function showPrivacyOptions(elem)
{
	$(elem).siblings("div.option-pop").fadeIn();
	if( $(elem).parent().siblings("p").children("img.privacy_icon") );
	
	switch ( $(elem).parent().siblings("p").children("img.privacy_icon").attr("src") ) 
	{
		case IMAGE_PATH+"/privacy_links_grey.png" :
			$(elem).parent().siblings("p").children("img.privacy_icon").attr("src", IMAGE_PATH+"/privacy_links_purple.png");
		break;
		case IMAGE_PATH+"/privacy_public_grey.png" :
			$(elem).parent().siblings("p").children("img.privacy_icon").attr("src", IMAGE_PATH+"/privacy_public_purple.png");
			break;
		case IMAGE_PATH+"/privacy_links_of_links_grey.png" :
			$(elem).parent().siblings("p").children("img.privacy_icon").attr("src", IMAGE_PATH+"/privacy_links_of_links_purple.png");
			break;
		
		default:
			break;
	}
}

//Show edit, delete options for wallpost.
function showEditDeleteOptionsForWallpost(elem)
{
	$(elem).siblings("div.option-pop2").fadeIn();
}

//Function to change privacy of wallpost.
function ChangePrivacyOfWallpost( elem, wallpost_id, privacy_to_set )
{
	$(elem).children('span.loading').html("<img src = '"+IMAGE_PATH+"/tiny_loader.gif'>");
	
	jQuery.ajax({
		url: "/" + PROJECT_NAME + "dashboard/change-privacy-of-wallpost",
		type: "POST",
		dataType: "json",
		data: { 'privacy_to_set' : privacy_to_set, 'wallpost_id' : wallpost_id },
		success: function(jsonData) {
			//Remove Loading
			$(elem).children('span.loading').html('&nbsp;');
			
			//Remove seleted class if any sibling and sibling-children have
			$(elem).siblings('a').removeClass('selected');
			$(elem).siblings('a').children('div').removeClass('selected');
			
			//Add selected class to current clicked [a] tag.
			$(elem).addClass('selected');
			$(elem).children('div').addClass('selected');
			
			//Change the icon for privacy setting
			switch (privacy_to_set)
			{
				case 1:
					$("img.privacy_icon#"+wallpost_id).attr('src', IMAGE_PATH+'/privacy_public_grey.png');
					break;
				case 2:
					$("img.privacy_icon#"+wallpost_id).attr('src', IMAGE_PATH+'/privacy_links_grey.png');
					break;
				case 3:
					$("img.privacy_icon#"+wallpost_id).attr('src', IMAGE_PATH+'/privacy_links_of_links_grey.png');
					break;
			}
			
			//Close the popup
			$(elem).parents("div.option-pop").hide();
		},
		error: function(xhr, ajaxOptions, thrownError) {
			
		}
	});
}

//Call confirm dialog box before deleting wallpost.
function confirmToDelete( elem, wallpost_id )
{
	var data = $("#dialog_confirm_delete_wallpost").data();   
	data.element = elem;  
	data.wallpost_id = wallpost_id;

	$("#dialog_confirm_delete_wallpost").dialog("open");
}
/**
 * Delete post.
 * @param elem(element to be clicked to delete post)
 * @param wallpost_id(post to be delete)
 * @author unknown
 */
function deleteWallpost( elem, wallpost_id )
{
	$(elem).children('span.loading').html("<img src = '"+IMAGE_PATH+"/tiny_loader.gif'>");
	$(elem).parents('div.option-pop2').hide();
	$("div.news-update-content[rel="+wallpost_id+"]").css({'opacity':0.4 });

	jQuery.ajax({
		url: "/" + PROJECT_NAME + "socialise/delete-collage-type-wallpost",
		type: "POST",
		dataType: "json",
		data: { 'wallpost_id' : wallpost_id },
		success: function(jsonData) {
			if( jsonData == 1 )
			{
				//Remove Loading
				$(elem).children('span.loading').html('&nbsp;');
				//Remove wallpost
				$("div.news-update-content[rel="+wallpost_id+"]").remove();
				//Show dialog
				showDialogMsg( "Deleting", "Post deleted.", 2000, 
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
					    width: 300
					}		
				);
			}
			else
			{
				//Show dialog
				showDialogMsg( "Deleting", "Problem occured while deleting the post. Please try again after some time.", 3000, 
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
					    height: 200,
					    width: 300
					}		
				);
			}
		},
		error: function(xhr, ajaxOptions, thrownError) {
			//Show dialog
			showDialogMsg( "Deleting", "Problem occured while deleting the post. Please try again after some time.", 3000, 
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
				    height: 200,
				    width: 300
				}		
			);
		}
	});
}

/**
 * Show edit box for wallpost.
 * @param elem
 * @param wallpost_id
 * @author jsingh7
 */
function showWallpostEditBox( elem, wallpost_id )
{
	if (CKEDITOR.instances['edit_photo_text_'+wallpost_id] == undefined) {

		//Apply CKeditor
		CKEDITOR.replace('edit_photo_text_'+wallpost_id , {
			width: 570,
			height: 100,
			uiColor: '#6C518F',
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
					CKEDITOR.instances['edit_photo_text_'+wallpost_id].setData($('p#' + wallpost_id + '.editable .wallpost_text_cropped').html());

				}
			},
		});
	}

	$(elem).parents('div.option-pop2').hide();
	$('p#'+wallpost_id+'.editable').hide();
	$('div#'+wallpost_id+'.wallpost_editor').fadeIn();
}

/**
 * Hide edit box for wallpost.
 * @param elem
 * @param wallpost_id
 * @author jsingh7
 */
function cancelWallpostEditing( elem, wallpost_id )
{
	$('div#'+wallpost_id+'.wallpost_editor').hide();
	$('p#'+wallpost_id+'.editable').fadeIn();
	$('div#'+wallpost_id+'.wallpost_editor textarea').removeAttr("disabled");
	$('div#'+wallpost_id+'.wallpost_editor span.loading').remove();
	$('div#'+wallpost_id+'.wallpost_editor input[name=save]').show();
	//Clear ckeditor when cancel editing.
	if (CKEDITOR.instances['edit_photo_text_'+wallpost_id]) {
		CKEDITOR.instances['edit_photo_text_'+wallpost_id].destroy();
	}
	
}

/**
 * Hide edit box for wallpost.
 * @param elem
 * @param wallpost_id
 * @param update_photo_text (Decides wether to update wallpost text or photo text)[1 or 0]
 */
function saveWallpostEditing( elem, wallpost_id, update_photo_text )
{
	$(elem).hide();
	$('div#'+wallpost_id+'.wallpost_editor textarea').attr("disabled", "disabled");
	var idd = addLoadingImage($(elem), "before", "loading_small_purple.gif", 113, 18);
	if( update_photo_text == 1 || update_photo_text == '1' )
	{
		update_photo_text = 1;
	}
	else
	{
		update_photo_text = 0;
	}
	jQuery.ajax({
		url: "/" + PROJECT_NAME + "dashboard/update-wallpost-text",
		type: "POST",
		dataType: "json",
		data: { 'wallpost_id' : wallpost_id, 
				"wallpost_text" : CKEDITOR.instances['edit_photo_text_'+wallpost_id].getData() },
		success: function(jsonData) {
			if( jsonData != 0 )
			{
				//Remove Loading
				$('span#'+idd).remove();
				$('div#'+wallpost_id+'.wallpost_editor input[name=save]').show();
				
				//show wallpost text.
				$('div#'+jsonData.wallpost_id+'.wallpost_editor').hide();
				$('p#'+jsonData.wallpost_id+'.editable .wallpost_text_cropped').html(jsonData.wallpost_text);
				$('p#'+jsonData.wallpost_id+'.editable').fadeIn();
				
				$('div#'+wallpost_id+'.wallpost_editor textarea').removeAttr("disabled");

				if (CKEDITOR.instances['edit_photo_text_'+wallpost_id]) {
					CKEDITOR.instances['edit_photo_text_'+wallpost_id].destroy();
				}
			}
			else
			{
				alert("Some error occured! please try again.");
			}	
		},
		error: function(xhr, ajaxOptions, thrownError) {
			
		}
	});
}

/**
 * 
 * @param integer wish_id
 * 
 * @author jsingh7
 */
function populateWishPopup( wish_id )
{
	$("div#"+wish_id+".wish-pop-outer").fadeIn();
	var loading_span = "<span class = 'loading loading_wish_data'><table><tr><td style = 'width:500px; height:100px'><img src = '/" + PROJECT_NAME + "public/images/loading_large_purple.gif' alt = 'Wait...' /></td></tr></table></span>";
	
	//Show loading when popup is empty i.e first time.
	if( ! $.trim( $("div#"+wish_id+".wish-pop-outer div.wish-pop-bot").html() ).length )
	{
		$("div#"+wish_id+".wish-pop-outer div.wish-pop-bot").html(loading_span);
	}
	
	jQuery.ajax({
		url: "/" + PROJECT_NAME + "socialise/get-wish-info",
		type: "POST",
		dataType: "json",
		data: { 'wish_id' : wish_id },
		success: function( jsonData	) {
			var html = "";
			if( jsonData != 0 )
			{
				html += '<div class = "wish-pop-bot-inner" style="position : absolute; display : none;">';
				html += '<div rel="'+jsonData.data.wish.wish_id+'" style="" class="news-update-content">';
				html += '<div class="news-update-column">';
					html += '<div title="'+jsonData.data.wish.about_ilook_user_name+'" class="news-update-content-icon short_profile_border">';
					html += '<img width="" height="" src="'+jsonData.data.wish.about_ilook_user_smallphoto+'">';
					html += '</div>';
					html += '<div class="news-update-date">';
						html += '<p>';
				    	switch ( jsonData.data.wish.wish_type )
				    	{
				    		//New link
				    		case 1:
				    		case '1':
				    			html += '<a style="text-decoration: none !important;" href="/'+PROJECT_NAME+'profile/iprofile/id/'+jsonData.data.wish.about_ilook_user_id+'" class="text-purple2">';
				    			html += '<b>'+jsonData.data.wish.about_ilook_user_name+'</b>';
								html += '</a> has a new ';
								html += '<a class="text-purple2-link" href="/'+PROJECT_NAME+'profile/iprofile/id/'+jsonData.data.wish.link_ilook_user_id+'"><b>Link</b></a>';
				    		break;
				    		//New job
				    		case 2:
				    		case '2':
				    			html += '<a style="text-decoration: none !important;" href="/'+PROJECT_NAME+'profile/iprofile/id/'+jsonData.data.wish.about_ilook_user_id+'" class="text-purple2">';
				    			html += '<b>'+jsonData.data.wish.about_ilook_user_name+'</b>';
								html += '</a> has a new ';
								html += '<b>Job</b>';
				    			break;
				    		//job anniversary
				    		case 3:
				    		case '3':
				    			html += '<a style="text-decoration: none !important;" href="/'+PROJECT_NAME+'profile/iprofile/id/'+jsonData.data.wish.about_ilook_user_id+'" class="text-purple2">';
				    			html += '<b>'+jsonData.data.wish.about_ilook_user_name+'</b>';
								html += '</a> having a work Anniversary';
				    			break;
				    		//Birthday wishes
				    		case 5:
				    		case '5':
				    			html += '<a style="text-decoration: none !important;" href="/'+PROJECT_NAME+'profile/iprofile/id/'+jsonData.data.wish.about_ilook_user_id+'" class="text-purple2">';
				    			html += '<b>'+jsonData.data.wish.about_ilook_user_name+'</b>';
								html += '</a> celebrating Birthday Today';
				    			break;
				    	}
						html += '</p>';
					html += '</div>';
					html += '<div class="dashboard-sharelink-arrow">';
						
					switch ( jsonData.data.wish.wish_type ) 
			    	{
			    		//New link
			    		case 1:
			    		case '1':
			    			html += '<img style="cursor: default" src="'+IMAGE_PATH+'/icon-new-link-big.png">';
			    		break;
			    		//New job
			    		case 2:
			    		case '2':
			    			html += '<img style="cursor: default" src="'+IMAGE_PATH+'/icon-new-job-big.png">';
			    			break;
			    		//job anniversary
			    		case 3:
			    		case '3':
			    			html += '<img style="cursor: default" src="'+IMAGE_PATH+'/icon-job-anniversary-big.png">';
			    			break;
			    		//Birthday wishes
			    		case 5:
			    		case '5':
			    			html += '<img style="cursor: default" src="'+IMAGE_PATH+'/icon-birthday-wishes-big.png">';
			    			break;
			    	}
						
					html += '</div>';
				html += '</div>';

				html += '<div class="wish-data-outer">';
					
					//New Link user info
					if( jsonData.data.wish.wish_type == 1 && jsonData.data.wish.wish_type == '1' )
					{
						html += '<div class="wish-img-text-outer">';
						html += '<div class="wish-img-text-lt">';
						html += '<img src="'+jsonData.data.wish.link_ilook_user_mediumphoto+'" width = "" height = "" >';
						html += '</div>';
						html += '<div class="wish-img-text-rt">';
						html += '<h4><a class="wish-img-text-rt-link" href="/'+PROJECT_NAME+'profile/iprofile/id/'+jsonData.data.wish.link_ilook_user_id+'">'+jsonData.data.wish.link_ilook_user_name+'</a></h4>';
						html += '<p>'+jsonData.data.wish.link_ilook_user_professional_info+'</p>';
						html += '</div>';
						html += '</div>';
					}
					//End new Link user info
					
					
					html += '<div class="news-update-likes  news-likes">';
						html += '<div class="fl  text-purple">';
						
							//Ok functionality.
							html += '<div class="ok">';
								html += '<div style="display: inline-block;">';
								if( jsonData.data.wish.did_i_liked_this_wish == 0 )
								{	
									html += '<a style = "display:none;" href="javascript:;" class = "not_ok" onclick = "notOkTheWallpostOfTypeWish( '+jsonData.data.wish.wish_id+', this, 1 );" rel = "'+jsonData.data.wish.wish_id+'" ><span>&nbsp;</span>Unok</a>';
									html += '<a style = "" href="javascript:;" class = "ok" onclick = "okTheWallpostOfTypeWish( '+jsonData.data.wish.wish_id+', this, 1 );" rel = "'+jsonData.data.wish.wish_id+'" ><span>&nbsp;</span>Ok</a>';
								}
								else
								{
									html += '<a style = "" href="javascript:;" class = "not_ok" onclick = "notOkTheWallpostOfTypeWish( '+jsonData.data.wish.wish_id+', this, 1 );" rel = "'+jsonData.data.wish.wish_id+'" ><span>&nbsp;</span>Unok</a>';
									html += '<a style = "display:none;" href="javascript:;" class = "ok" onclick = "okTheWallpostOfTypeWish( '+jsonData.data.wish.wish_id+', this, 1 );" rel = "'+jsonData.data.wish.wish_id+'" ><span>&nbsp;</span>Ok</a>';
								}
								
								html += '</div>';
								html += '<div class="like_count" id  = "'+jsonData.data.wish.wish_id+'" style="display: inline-block; float: right;">';
								if( jsonData.data.wish.like_count > 0 )
								{										
									html += '<a onclick="openWhoLikedPopupByWishId('+jsonData.data.wish.wish_id+')" href="javascript:;">('+ jsonData.data.wish.like_count +')</a>';
								}
								else
								{
									html += '<a onclick="openWhoLikedPopupByWishId('+jsonData.data.wish.wish_id+')" style="display: none;" href="javascript:;">(0)</a>';
								}
								html += '</div>';
							html += '</div>';
							//end Ok functionality.
							
							html += '<div class="comments">';
							if( jsonData.data.wish.comment_count > 0 )
							{
								html += '<a href="javascript:;" class = "add_comment">Comment</a><span id = "comment_count_'+jsonData.data.wish.wish_id+'" >('+jsonData.data.wish.comment_count+')</span>';
							}
							else
							{
								html += '<a href="javascript:;" class = "add_comment">Comment</a><span id = "comment_count_'+jsonData.data.wish.wish_id+'"></span>';
							}
							html += '</div>';
						html += '</div>';
					html += '</div>';
				html += '</div>';

				html += '<div class="comment-box-outer ">';
					
					//People who liked this------
				
				//likers string.
				if( typeof jsonData.data.wish.likers_string != 'undefined' && jsonData.data.wish.likers_string != "" )
				{
					if( jsonData.data.wish.likers_string.length > 0 )
					{	
						html += '<div class="people-who-liked-wish" id = "'+jsonData.data.wish.wish_id+'">';
						html += '<img src="'+IMAGE_PATH+'/tick-grey.png" align="absmiddle" />';	
						html += '<span>';
						html += jsonData.data.wish.likers_string;
						html += '</span>';
						html += '</div>';
					}
					else
					{
						html += '<div class="people-who-liked-wish" id = "'+jsonData.data.wish.wish_id+'" style = "display:none;">';
						html += '<img src="'+IMAGE_PATH+'/tick-grey.png" align="absmiddle" />';	
						html += '<span>';
						html += '</span>';
						html += '</div>';
					}
				}
				else
				{
					html += '<div class="people-who-liked-wish" id = "'+jsonData.data.wish.wish_id+'" style = "display:none;">';
					html += '<img src="'+IMAGE_PATH+'/tick-grey.png" align="absmiddle" />';	
					html += '<span>';
					html += '</span>';
					html += '</div>';
				}
				
					html += '<div id="comment_box_'+jsonData.data.wish.wish_id+'" class="ok-comment-box">';
							
						html += '<div class="ok-comment-box-bot">';
							
							if( jsonData.data.wallpost != 0 )
							{
								if( jsonData.data.wallpost.wallpost.comment_count > 2 )
							    {
									html += '<div class="ok-comment-box-bot-left show_more_comments_'+jsonData.data.wish.wish_id+'">';
										html += '<img align="absmiddle" src="'+IMAGE_PATH+'/comments--grey.png">';
									html += '</div>';
									html += '<div onclick="getMoreCommentsForWish('+jsonData.data.wish.wish_id+',this)" style="cursor: pointer;" class="ok-comment-box-bot-right load_more_comments show_more_comments_'+jsonData.data.wish.wish_id+'">';
										html += 'View more comments';
									html += '</div>';
							    }
							}
							
							//Comments listing starts-------------------

							
							html += '<div id="comments_outer_'+jsonData.data.wish.wish_id+'" class = "comments_outer">';
							var comment_counter = 0;
							if( jsonData.data.wallpost != 0 )
							{
								if( jsonData.data.wallpost.wallpost.comment_count > 0 )
								{
									for( i in jsonData.data.wallpost.wallpost.wallpost_comments )
									{
										if( jsonData.data.wallpost.wallpost.wallpost_comments[i].is_hidden == 0 )
										{
											html += '<div rel="'+jsonData.data.wallpost.wallpost.wallpost_comments[i].id+'" id="comments-outer_'+jsonData.data.wallpost.wallpost.wallpost_comments[i].id+'" class="comments-outer comments-outer_'+jsonData.data.wallpost.wallpost.wallpost_comments[i].id+'">';
												
												html += '<a href="javascript:" title="'+jsonData.data.wallpost.wallpost.wallpost_comments[i].user_name+'" id="'+jsonData.data.wallpost.wallpost.wallpost_comments[i].user_id+'" disable-border="1">';
													html += '<div title="'+jsonData.data.wallpost.wallpost.wallpost_comments[i].user_name+'" class="img img32 short_profile_border">';
															html += '<img width="" height="" src="'+jsonData.data.wallpost.wallpost.wallpost_comments[i].user_prof_image_path+'">';
													html += '</div>';
												html += '</a>';
												
												html += '<div class="text">';
													html += '<div rel="'+jsonData.data.wallpost.wallpost.wallpost_comments[i].id+'" id="idd_'+jsonData.data.wallpost.wallpost.wallpost_comments[i].id+'" class="comment-text1">';
														html += '<span>'+jsonData.data.wallpost.wallpost.wallpost_comments[i].user_name+'</span>';
														html += '<div id="'+jsonData.data.wallpost.wallpost.wallpost_comments[i].id+'" class="comment_text">'+jsonData.data.wallpost.wallpost.wallpost_comments[i].text+'</div>';
													html += '</div>';
													html += '<textarea maxlength="255" style="resize: vertical; display: none;" rel="'+jsonData.data.wallpost.wallpost.wallpost_comments[i].id+'" id="id_'+jsonData.data.wallpost.wallpost.wallpost_comments[i].id+'" rows="1" class="comment-textarea" cols="1">'+jsonData.data.wallpost.wallpost.wallpost_comments[i].text+'</textarea>';
													html += '<div class="comments-date">'+jsonData.data.wallpost.wallpost.wallpost_comments[i].created_at+'</div>';
												html += '</div>';
												
												if( jsonData.data.wallpost.wallpost.wallpost_comments[i].is_my_comment == 1 )
												{
													html += '<div class="edit_comment" style="display: none;">';
														html += '<div style="bottom: -85px; width: 78px; padding: 5px; right: -7px; text-align: left; z-index: 99999; display: none;" class="edit-popup-outer">';
															html += '<div style="margin: 0 0 0 55px" class="edit-popup-arrow">';
																html += '<img width="26" height="16" src="'+IMAGE_PATH+'/arrow-up-grey2.png">';
															html += '</div>';
															html += '<div style="width: 65px; padding: 5px;" class="edit-popup">';
																html += '<div class="edit-popup-col1">';
																	html += '<h5 style="text-transform: none !important;">';
																		html += '<a href="javascript:;" class="text-grey2-link edit_comment_link" style="font-size: 12px;">Edit</a>';
																	html += '</h5>';
																html += '</div>';
																html += '<div class="edit-popup-col1">';
																	html += '<h5 style="text-transform: none !important;">';
																		html += '<a rel="'+jsonData.data.wallpost.wallpost.wallpost_comments[i].id+'" href="javascript:;" class=" text-grey2-link delete_comment_link" style="font-size: 12px;">Delete</a>';
																	html += '</h5>';
																html += '</div>';
															html += '</div>';
														html += '</div>';
													html += '</div>';
												}    
												else
												{
													html += '<div class="hide_comment" style="text-align: right; display: none;">';
													html += '<img src="'+IMAGE_PATH+'/cross-grey.png" title="Hide comment">';
													html += '</div>';
												}
												
												
												html += '</div>';
												
												comment_counter++;
										}
										else
								    	{
											html += '<div class="comments-outer comments-outer_'+jsonData.data.wallpost.wallpost.wallpost_comments[i].id+'  hidden_comment"  id="comments-outer_'+jsonData.data.wallpost.wallpost.wallpost_comments[i].id+'"  rel="'+jsonData.data.wallpost.wallpost.wallpost_comments[i].id+'"><span onclick="showComments(this);" rel="'+jsonData.data.wallpost.wallpost.wallpost_comments[i].id+'" class="unhide-comment" title = "Hidden Comment [Hidden on your wall]">...</span></div>';
								    	}
									}
								}
							}
									html += '</div>';
									html += '<input type = "hidden" id = "wish_comments_offset_'+jsonData.data.wish.wish_id+'" value = "'+comment_counter+'"/>';
							
						//Comments listing ends-------------------
								html += '</div>';
							
						html += '</div>';
					html += '</div>';
					
					
					
					
					html += '<div class="comment-write-outer ">';
						html += '<form id="comment_box_'+jsonData.data.wish.wish_id+'">';
							html += '<input type="hidden" value="'+jsonData.data.wish.wish_id+'" name="wallpost_id">';
							html += '<div class="comment-write-left ">';
								html += '<img width="" height="" src="'+$('input[type=hidden]#my_small_image').val()+'">';
							html += '</div>';
							html += '<div class="comment-write-right ">';
								html += '<textarea onkeydown="javascript: if(event.keyCode == 13) addCommentToTheWallpostOfTypeWish( '+jsonData.data.wish.wish_id+', this, event, 1 );" placeholder="Write a comment..." class="comment-textarea" maxlength="255" name="comment"></textarea>';
								html += '<div class="enter-post">Press Enter to Post';
								html += '</div>';
							html += '</div>';
						html += '</form>';
					html += '</div>';
				html += '</div>';
			html += '</div>';
			html += '</div>';
			
				html = $(html);
				
				//hide loading.
				$('span.loading_wish_data').css('visibility', 'hidden');
				
				//add the new HTML to the DOM off-screen, then get the height of the new element
				html.appendTo('body');
				theHeight = html.height();
				//now animate the height change for the container element, and when that's done change the HTML to the new serverResponse HTML
				//notice the `style` attribute of the new HTML is being reset so it's not displayed off-screen anymore
				$("div#"+wish_id+".wish-pop-outer div.wish-pop-bot").animate({ height : theHeight }, 500, function () {
					$(this).html(html.attr('style', ''));
					$(this).attr('style', '');
			    });
				
//	        	Activate action controls for comments.
	        	activateCommentActions();
	        	//showComments();	
			}
			else
			{
				alert("Some error occured! please try again.");
			}	
		},
		error: function(xhr, ajaxOptions, thrownError) {
			
		}
	});	
}

function getMoreCommentsForWish( wish_id, elem )
{
	jQuery.ajax({
		url: "/" + PROJECT_NAME + "socialise/get-more-comments-for-wish",
		type: "POST",
		dataType: "json",
		data: { 'wish_id' : wish_id, 'offset' : $("input[type=hidden]#wish_comments_offset_"+wish_id).val() },
		success: function( jsonData	) {
			
			//Making comment stucture.
			var comment_counter = 0;
			var html = "";
			for( i in jsonData.data )
			{
				if( jsonData.data[i].is_hidden == 0 )
				{
					html += '<div rel="'+jsonData.data[i].comment_id+'" id="comments-outer_'+jsonData.data[i].comment_id+'" class="comments-outer comments-outer_'+jsonData.data[i].comment_id+'">';
					
					html += '<a href="javascript:" title="'+jsonData.data[i].comment_user_name+'" id="'+jsonData.data[i].comment_user_id+'" disable-border="1">';
						html += '<div title="'+jsonData.data[i].comment_user_name+'" class="img img32 short_profile_border">';
								html += '<img width="" height="" src="'+jsonData.data[i].comment_profes_image+'">';
						html += '</div>';
					html += '</a>';
					
					html += '<div class="text">';
						html += '<div rel="'+jsonData.data[i].comment_id+'" id="idd_'+jsonData.data[i].comment_id+'" class="comment-text1">';
							html += '<span>'+jsonData.data[i].comment_user_name+'</span>';
							html += '<div id="'+jsonData.data[i].comment_id+'" class="comment_text">'+jsonData.data[i].comment_text+'</div>';
						html += '</div>';
						html += '<textarea maxlength= "255" style="resize: vertical; display: none;" rel="'+jsonData.data[i].comment_id+'" id="id_'+jsonData.data[i].comment_id+'" rows="1" class="comment-textarea" cols="1">'+jsonData.data[i].comment_text+'</textarea>';
						html += '<div class="comments-date">'+jsonData.data[i].created_at+'</div>';
					html += '</div>';
					
					if( jsonData.data[i].is_my_comment == 1 )
					{
						html += '<div class="edit_comment" style="display: none;">';
							html += '<div style="bottom: -85px; width: 78px; padding: 5px; right: -7px; text-align: left; z-index: 99999; display: none;" class="edit-popup-outer">';
								html += '<div style="margin: 0 0 0 55px" class="edit-popup-arrow">';
									html += '<img width="26" height="16" src="'+IMAGE_PATH+'/arrow-up-grey2.png">';
								html += '</div>';
								html += '<div style="width: 65px; padding: 5px;" class="edit-popup">';
									html += '<div class="edit-popup-col1">';
										html += '<h5 style="text-transform: none !important;">';
											html += '<a href="javascript:;" class="text-grey2-link edit_comment_link" style="font-size: 12px;">Edit</a>';
										html += '</h5>';
									html += '</div>';
									html += '<div class="edit-popup-col1">';
										html += '<h5 style="text-transform: none !important;">';
											html += '<a rel="'+jsonData.data[i].comment_id+'" href="javascript:;" class=" text-grey2-link delete_comment_link" style="font-size: 12px;">Delete</a>';
										html += '</h5>';
									html += '</div>';
								html += '</div>';
							html += '</div>';
						html += '</div>';
					}
					else
					{
						html += '<div class="hide_comment" style="text-align: right; display: none;">';
						html += '<img src="'+IMAGE_PATH+'/cross-grey.png" title="Hide comment">';
						html += '</div>';
					}
					html += '</div>';
				}
				else
		    	{
					html += '<div class="comments-outer comments-outer_'+jsonData.data[i].comment_id+'  hidden_comment"  id="comments-outer_'+jsonData.data[i].comment_id+'"  rel="'+jsonData.data[i].comment_id+'"><span onclick="showComments(this);" rel="'+jsonData.data[i].comment_id+'" class="unhide-comment" title = "Hidden Comment [Hidden on your wall]">...</span></div>';
		    	}
				
				comment_counter++;
			}
			
//			Setting up offset in hidden field to keep track on no. of comments already fetched to show.
			var old_offset = parseInt( $("input[type=hidden]#wish_comments_offset_"+wish_id).val() );
			var new_offset = old_offset + comment_counter;
			$("input[type=hidden]#wish_comments_offset_"+wish_id).val( new_offset );
			
			$( "div.wish-pop-outer div#comments_outer_"+wish_id ).prepend( html );
			
//			Show/hide view more comments label.
			if( jsonData.is_there_more_recs == 0 )
			{
				$("div.wish-pop-outer div.show_more_comments_"+wish_id ).hide();
			}

//        	Activate action controls for comments.			
			activateCommentActions();
			
//			Styling the comments holder div to over-flow auto.
			$("div.wish-pop-outer div.comments_outer").css("overflow-y", "auto");
			
		}
	});	
}


/**
 * Used to show full wallpost text and hide cropped one.
 * 
 * @param elem (The elememt which will be click)
 * @author jsingh7
 */
function showFullWallpostText(elem)
{
	$(elem).parents("span.wallpost_text_cropped").hide();
	$(elem).parents("span.wallpost_text_cropped").siblings("span.wallpost_text_full").fadeIn();
}

/**
 * Used to show collage on socialise wall.
 * 
 * @param photos_arr
 * @param first_img_portrait_or_landscape
 * @author jsingh7
 */
function getCollageHTML( photos_arr, first_img_portrait_or_landscape )
{

	var html = "";
	switch (photos_arr.length){
	    case 1:
	    	html += '<div class="collage-outer">';
	    		html += '<div class="collage-inner">';
	    			html += '<div class="collage-pic1"> <img onclick="showPhotoDetail( '+photos_arr[0].image_id+', '+"'id_of_photo'"+');" src="'+photos_arr[0].image_path+'" class = "single_image" alt=""/></div>';
	    		html += '</div>';
	    	html += '</div>';
		    break;
	    
	    case 2:
	    	if( first_img_portrait_or_landscape == 1 ){
	    		html += '<div class="collage-outer">';
	    			html += '<div class="collage-inner">';
	    				html += '<div class="collage-pic2-div-two"><img rel_width = "280" rel_height = "375" class = "require_jquery_thumbnail_processing" onclick="showPhotoDetail( '+photos_arr[0].image_id+', '+"'id_of_photo'"+');"  src="'+photos_arr[0].image_path+'" alt=""/></div>';
	    				html += '<div class="collage-pic2-div-two"><img rel_width = "280" rel_height = "375" class = "require_jquery_thumbnail_processing" onclick="showPhotoDetail( '+photos_arr[1].image_id+', '+"'id_of_photo'"+');"  src="'+photos_arr[1].image_path+'" alt=""/></div>';
	    			html += '</div>';
	    		html += '</div>';
	    	}else{
	    		html += '<div class="collage-outer">';
	    			html += '<div class="collage-inner">';
	    				html += '<div class="collage-pic2-div-one"><img rel_width = "570" rel_height = "185" class = "require_jquery_thumbnail_processing" onclick="showPhotoDetail( '+photos_arr[0].image_id+', '+"'id_of_photo'"+');" src="'+photos_arr[0].image_path+'" alt=""/></div>';
	    				html += '<div class="collage-pic2-div-one"><img rel_width = "570" rel_height = "185" class = "require_jquery_thumbnail_processing" onclick="showPhotoDetail( '+photos_arr[1].image_id+', '+"'id_of_photo'"+');" src="'+photos_arr[1].image_path+'" alt=""/></div>';
	    			html += '</div>';
	    		html += '</div>';
	    	}
	    	break;
	    case 3:
	    	if( first_img_portrait_or_landscape == 1 ){
	    		html += '<div class="collage-outer">';
	    			html += '<div class="collage-inner">';
	    				html += '<div class="collage-pic3-div-three"><img rel_width = "280" rel_height = "375" class = "require_jquery_thumbnail_processing" onclick="showPhotoDetail( '+photos_arr[0].image_id+', '+"'id_of_photo'"+');" src="'+photos_arr[0].image_path+'" alt=""/></div>';
	    				html += '<div class="collage-pic3-div-four"><img rel_width = "285" rel_height = "184" class = "require_jquery_thumbnail_processing" onclick="showPhotoDetail( '+photos_arr[1].image_id+', '+"'id_of_photo'"+');" src="'+photos_arr[1].image_path+'" alt=""/></div>';
	    				html += '<div class="collage-pic3-div-four"><img rel_width = "285" rel_height = "185" class = "require_jquery_thumbnail_processing" onclick="showPhotoDetail( '+photos_arr[2].image_id+', '+"'id_of_photo'"+');" src="'+photos_arr[2].image_path+'" alt=""/></div>';
	    			html += '</div>';
	    		html += '</div>';
	    	}else{
	    		html += '<div class="collage-outer">';
	    			html += '<div class="collage-inner">';
	    				html += '<div class="collage-pic3-div-one"><img rel_width = "570" rel_height = "185" class = "require_jquery_thumbnail_processing" onclick="showPhotoDetail( '+photos_arr[0].image_id+', '+"'id_of_photo'"+');" src="'+photos_arr[0].image_path+'" alt=""/></div>';
	    				html += '<div class="collage-pic3-div-two"><img rel_width = "280" rel_height = "185" class = "require_jquery_thumbnail_processing" onclick="showPhotoDetail( '+photos_arr[1].image_id+', '+"'id_of_photo'"+');" src="'+photos_arr[1].image_path+'" alt=""/></div>';
	    				html += '<div class="collage-pic3-div-two"><img rel_width = "285" rel_height = "185" class = "require_jquery_thumbnail_processing" onclick="showPhotoDetail( '+photos_arr[2].image_id+', '+"'id_of_photo'"+');" src="'+photos_arr[2].image_path+'" alt=""/></div>';
	    			html += '</div>';
	    		html += '</div>';
	    	}
	    	break;
	    case 4:
	    	if(first_img_portrait_or_landscape == 1){
	    		html += '<div class="collage-outer">';
	    			html += '<div class="collage-inner">';
	    				html += '<div class="collage-pic4-div-three"><img rel_width = "280" rel_height = "375" class = "require_jquery_thumbnail_processing" onclick="showPhotoDetail( '+photos_arr[0].image_id+', '+"'id_of_photo'"+');" src="'+photos_arr[0].image_path+'" alt=""/></div>';
	    				html += '<div class="collage-pic4-div-four"><img rel_width = "285" rel_height = "121"  class = "require_jquery_thumbnail_processing" onclick="showPhotoDetail( '+photos_arr[1].image_id+', '+"'id_of_photo'"+');" src="'+photos_arr[1].image_path+'" alt=""/></div>';
	    				html += '<div class="collage-pic4-div-four"><img rel_width = "285" rel_height = "121"  class = "require_jquery_thumbnail_processing" onclick="showPhotoDetail( '+photos_arr[2].image_id+', '+"'id_of_photo'"+');" src="'+photos_arr[2].image_path+'" alt=""/></div>';
	    				html += '<div class="collage-pic4-div-five"><img rel_width = "285" rel_height = "123"  class = "require_jquery_thumbnail_processing" onclick="showPhotoDetail( '+photos_arr[3].image_id+', '+"'id_of_photo'"+');" src="'+photos_arr[3].image_path+'" alt=""/></div>';
	    			html += '</div>';
	    		html += '</div>';
	    	}else{
	    		html += '<div class="collage-outer">';
	    			html += '<div class="collage-inner">';
	    				html += '<div class="collage-pic4-div-six"><img rel_width = "570" rel_height = "184" class = "require_jquery_thumbnail_processing" onclick="showPhotoDetail( '+photos_arr[0].image_id+', '+"'id_of_photo'"+');" src="'+photos_arr[0].image_path+'" alt=""/></div>';
    					html += '<div class="collage-pic4-div-seven"><img rel_width = "187" rel_height = "186" class = "require_jquery_thumbnail_processing" onclick="showPhotoDetail( '+photos_arr[1].image_id+', '+"'id_of_photo'"+');" src="'+photos_arr[1].image_path+'" alt=""/></div>';
    					html += '<div class="collage-pic4-div-seven"><img rel_width = "187" rel_height = "186" class = "require_jquery_thumbnail_processing" onclick="showPhotoDetail( '+photos_arr[2].image_id+', '+"'id_of_photo'"+');" src="'+photos_arr[2].image_path+'" alt=""/></div>';
    					html += '<div class="collage-pic4-div-eight"><img rel_width = "186" rel_height = "186" class = "require_jquery_thumbnail_processing" onclick="showPhotoDetail( '+photos_arr[3].image_id+', '+"'id_of_photo'"+');" src="'+photos_arr[3].image_path+'" alt=""/></div>';
					html += '</div>';
				html += '</div>';
	    	}
	    	break;
	    case 5:
	    	html += '<div class="collage-outer">';
	    		html += '<div class="collage-inner">';
	    			html += '<div class="collage-lt">';
	    				html += '<div class="collage-pic4-div-one"><img rel_width = "280" rel_height = "184" class = "require_jquery_thumbnail_processing" alt="" onclick="showPhotoDetail( '+photos_arr[0].image_id+', '+"'id_of_photo'"+');" src="'+photos_arr[0].image_path+'"></div>';
    					html += '<div class="collage-pic4-div-one"><img rel_width = "280" rel_height = "184" class = "require_jquery_thumbnail_processing" alt="" onclick="showPhotoDetail( '+photos_arr[1].image_id+', '+"'id_of_photo'"+');" src="'+photos_arr[1].image_path+'"></div>';
					html += '</div>';
					html += '<div class = "collage-rt">';
						html += '<div class="collage-pic4-div-four"><img rel_width = "285" rel_height = "121" class = "require_jquery_thumbnail_processing" onclick="showPhotoDetail( '+photos_arr[2].image_id+', '+"'id_of_photo'"+');" src="'+photos_arr[2].image_path+'" alt=""/></div>';
						html += '<div class="collage-pic4-div-four"><img rel_width = "285" rel_height = "121" class = "require_jquery_thumbnail_processing" onclick="showPhotoDetail( '+photos_arr[3].image_id+', '+"'id_of_photo'"+');" src="'+photos_arr[3].image_path+'" alt=""/></div>';
						html += '<div class="collage-pic4-div-five"><img rel_width = "285" rel_height = "121" class = "require_jquery_thumbnail_processing" onclick="showPhotoDetail( '+photos_arr[4].image_id+', '+"'id_of_photo'"+');" src="'+photos_arr[4].image_path+'" alt=""/></div>';
					html += '</div>';
				html += '</div>';
			html += '</div>';
	    	break;
	}
	
	return html;
}

/**
 * Used to show share popup collage.
 * 
 * @param photos_arr
 * @param first_img_portrait_or_landscape
 * @author sjaiswal
 */
function getPopupCollageHTML( photos_arr, first_img_portrait_or_landscape )
{
	var html = "";
	//alert(photos_arr.length);
	switch (photos_arr.length){
	
	    case 1:
	    	html += '<div class="collage2-outer">';
	    		html += '<div class="collage2-inner">';
	    			html += '<div class="collage2-pic1"> <img rel_width = "200" rel_height = "160" onclick="" src="'+photos_arr[0].image_path+'" class = "single_image" alt=""/></div>';
	    		html += '</div>';
	    	html += '</div>';
		    break;
	    
	    case 2:
	    	if( first_img_portrait_or_landscape == 1 ){
	    		html += '<div class="collage2-outer">';
	    			html += '<div class="collage2-inner">';
	    				html += '<div class="collage2-pic2-div-two"><img rel_width = "100" rel_height = "160" class = "small_jquerynailthumb"   src="'+photos_arr[0].image_path+'" alt=""/></div>';
	    				html += '<div class="collage2-pic2-div-two"><img rel_width = "100" rel_height = "160" class = "small_jquerynailthumb"  src="'+photos_arr[1].image_path+'" alt=""/></div>';
	    			html += '</div>';
	    		html += '</div>';
	    	}else{
	    		html += '<div class="collage2-outer">';
	    			html += '<div class="collage2-inner">';
	    				html += '<div class="collage2-pic2-div-one"><img rel_width = "200" rel_height = "78" class = "small_jquerynailthumb"  src="'+photos_arr[0].image_path+'" alt=""/></div>';
	    				html += '<div class="collage2-pic2-div-one"><img rel_width = "200" rel_height = "78" class = "small_jquerynailthumb"  src="'+photos_arr[1].image_path+'" alt=""/></div>';
	    			html += '</div>';
	    		html += '</div>';
	    	}
	    	break;
	    case 3:
	    	if( first_img_portrait_or_landscape == 1 ){
	    		html += '<div class="collage2-outer ">';
	    			html += '<div class="collage2-inner ">';
	    				html += '<div class="collage2-pic3-div-three "><img rel_width = "100" rel_height = "160" class = "small_jquerynailthumb"  src="'+photos_arr[0].image_path+'" alt=""/></div>';
	    				html += '<div class="collage2-pic3-div-four "><img rel_width = "95" rel_height = "80" class = "small_jquerynailthumb"  src="'+photos_arr[1].image_path+'" alt=""/></div>';
	    				html += '<div class="collage2-pic3-div-four "><img rel_width = "95" rel_height = "75" class = "small_jquerynailthumb"  src="'+photos_arr[2].image_path+'" alt=""/></div>';
	    			html += '</div>';
	    		html += '</div>';
	    	}else{
	    		html += '<div class="collage2-outer">';
	    			html += '<div class="collage2-inner">';
	    				html += '<div class="collage2-pic3-div-one"><img rel_width = "200" rel_height = "78" class = "small_jquerynailthumb"  src="'+photos_arr[0].image_path+'" alt=""/></div>';
	    				html += '<div class="collage2-pic3-div-two"><img rel_width = "97" rel_height = "78" class = "small_jquerynailthumb"  src="'+photos_arr[1].image_path+'" alt=""/></div>';
	    				html += '<div class="collage2-pic3-div-two"><img rel_width = "98" rel_height = "78" class = "small_jquerynailthumb"  src="'+photos_arr[2].image_path+'"alt=""/></div>';
	    			html += '</div>';
	    		html += '</div>';
	    	}
	    	break;
	    case 4:
	    	if(first_img_portrait_or_landscape == 1){
	    		html += '<div class="collage2-outer">';
	    			html += '<div class="collage2-inner">';
	    				html += '<div class="collage2-pic4-div-three"><img rel_width = "100" rel_height = "160" class = "small_jquerynailthumb"  src="'+photos_arr[0].image_path+'" alt=""/></div>';
	    				html += '<div class="collage2-pic4-div-four"><img rel_width = "95" rel_height = "50"  class = "small_jquerynailthumb"  src="'+photos_arr[1].image_path+'" alt=""/></div>';
	    				html += '<div class="collage2-pic4-div-four"><img rel_width = "95" rel_height = "50"  class = "small_jquerynailthumb"  src="'+photos_arr[2].image_path+'" alt=""/></div>';
	    				html += '<div class="collage2-pic4-div-five"><img rel_width = "95" rel_height = "50"  class = "small_jquerynailthumb"  src="'+photos_arr[3].image_path+'" alt=""/></div>';
	    			html += '</div>';
	    		html += '</div>';
	    	}else{
	    		html += '<div class="collage2-outer">';
	    			html += '<div class="collage2-inner">';
	    				html += '<div class="collage2-pic4-div-six"><img rel_width = "200" rel_height = "80" class = "small_jquerynailthumb"  src="'+photos_arr[0].image_path+'" alt=""/></div>';
    					html += '<div class="collage2-pic4-div-seven"><img rel_width = "63" rel_height = "75" class = "small_jquerynailthumb"  src="'+photos_arr[1].image_path+'" alt=""/></div>';
    					html += '<div class="collage2-pic4-div-seven"><img rel_width = "63" rel_height = "75" class = "small_jquerynailthumb"  src="'+photos_arr[2].image_path+'" alt=""/></div>';
    					html += '<div class="collage2-pic4-div-eight"><img rel_width = "63" rel_height = "75" class = "small_jquerynailthumb"  src="'+photos_arr[3].image_path+'" alt=""/></div>';
					html += '</div>';
				html += '</div>';
	    	}
	    	break;
	    case 5:
	    	html += '<div class="collage2-outer">';
	    		html += '<div class="collage2-inner">';
	    			html += '<div class="collage2-lt">';
	    				html += '<div class="collage2-pic4-div-one"><img rel_width = "95" rel_height = "77" class = "small_jquerynailthumb" alt=""  src="'+photos_arr[0].image_path+'"></div>';
    					html += '<div class="collage2-pic4-div-one"><img rel_width = "95" rel_height = "77" class = "small_jquerynailthumb" alt=""  src="'+photos_arr[1].image_path+'"></div>';
					html += '</div>';
						html += '<div class="collage2-pic4-div-nine"><img rel_width = "95" rel_height = "50" class = "small_jquerynailthumb"  src="'+photos_arr[2].image_path+'" alt=""/></div>';
						html += '<div class="collage2-pic4-div-nine"><img rel_width = "95" rel_height = "50" class = "small_jquerynailthumb"  src="'+photos_arr[3].image_path+'" alt=""/></div>';
						html += '<div class="collage2-pic4-div-ten"><img rel_width = "95" rel_height = "49" class = "small_jquerynailthumb"  src="'+photos_arr[4].image_path+'" alt=""/></div>';
				html += '</div>';
				html += '</div>';
	    	break;
	}
	
	return html;
}
/**
 * Sticks the div when reaches top of the window.
 * @author jsingh7
 * 
 */

function sticky_relocate() {
    var window_top = $(window).scrollTop();
    var div_top = $('#sticky-anchor').offset().top;
    if (window_top > div_top) {
        $('#sticky').addClass('stick');
    } else {
        $('#sticky').removeClass('stick');
    }
}

/**
 * Call to stick function on window scroll.
 */
$(function () 
{
    $(window).scroll(sticky_relocate);
    sticky_relocate();
});

///**
// * function to abuse wallpost by current user.
// * @params post_id 
// * @params wallpost_owner_id
// * @author sjaiswal
// * version 1.0
// */
//
//function abuseReportWallPost(post_id,wallpost_owner_id)
//{
//	var ids = addLoadingImage($("div.report-abuse."+post_id+""), 'after', 'tiny_loader.gif',0 ,12 );
//	jQuery.ajax({
//        url: "/" + PROJECT_NAME + "socialise/abuse-report",
//        type: "POST",
//        dataType: "json",
//        data: {"post_id" :post_id  ,"wallpost_owner_id" :wallpost_owner_id},
//        timeout: 50000,
//        success: function(jsonData) {
//        	$("span#"+ids).remove();
//        	$("[name=abuse_"+post_id+"]").removeAttr("onclick");
//        	$("div.abuse-text."+post_id).html("Reported as abuse");
//        	
//        },
//        error: function(xhr, ajaxOptions, thrownError) {
//        	alert("Server Error.");
//		}
//	 });
//}