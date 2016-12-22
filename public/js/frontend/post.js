var ok_notOK_call_1;
var comment_edit_ajax_call;
var comment_delete_ajax_call;
var comment_hide_ajax_call;

	$(document).ready(function(){
	//  close popup
		
		clickCloseYouMayKnowButton();

		if($('#privacy_dd').length > 0)
		{
			$('#privacy_dd option[value=2]').attr('selected','selected');
			$("select#privacy_dd").selectBoxIt({theme: "jqueryui"});
		}
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
	                    text: 'Cancel',
	                    class: 'only_text'
	             },
				'Delete': function(){
					$( this ).dialog( "close" );
					$("div#comments-outer_"+$(this).data('comment_id')).fadeOut();
					deleteComment($(this).data('comment_id'), $(this).data('element'));
				}
		      }
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
	    			 if($(this).data('wall_type') == 1)
	    			 {
	    			 deleteWallpost( $(this).data('element'), $(this).data('wallpost_id')); 
	    			 }
	    			 else
	    			 {
	    			 deleteCollageTypeWallpost( $(this).data('element'), $(this).data('wallpost_id'));  
	    			 }
	    		 },
	    		 Cancel: 
	    		 {
                    click: function () {
                        $(this).dialog("close");
                    },
                    text: 'Cancel',
                    class: 'only_text'
	             },
	    	 }
	     });
	     
	     
	     activateCommentActions();
	     
	 	//Resizing the wall thumbnails with jquery.
	    	$( 'img.jquerynailthumb' ).each(function( index ) {
	        	jQuery( this ).nailthumb(
	        			{
	        				onStart:function(container){
	        					
	                        },
	                        width: $(this).attr('rel_width'),
	                        height: $(this).attr('rel_height'),
	                        method:'crop',
	        				onFinish:function(container){
	                            container.children().removeClass('jquerynailthumb');
	                        }
	        			}
	        		);
	        });
	    	
	        //Open users who has shared post in popup
	        //Added by hkaur5
	    	$('.other_sharers').click(function(){
    		getSharedPhotoListByWallpostId($(this).attr('rel'), this);
	   	});
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
	
	
	/**
	 * Activate action controls for comments[edit, delete, hide].
	 * They start working according to mouse actions.
	 * 
	 * @author jsingh7
	 */
	function activateCommentActions()
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
			$("div.text div.comment_text").fadeIn();
			$("div.text textarea").hide();
			$(this).parents("div.edit_comment").siblings("div.text").children("div.comment-text1").children("div.comment_text").hide();
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
	    				url: "/" + PROJECT_NAME + "post/edit-comment",
	    				type: "POST",
	    				dataType: "json",
	    				data: { 'comment_id' : $(thiss).attr("rel"), 'comment_text' : $(thiss).val() },
	    				success: function(jsonData) {
	    					$("div#"+$(thiss).attr("rel")).text($(thiss).val());
	    							
	    					$("span#"+iddd).remove();
	    					$(thiss).hide();
	    					$('div.text div.comment_text#'+jsonData.id).text( jsonData.text );
	    					 
	    					$('div.text div.comment_text#'+jsonData.id).fadeIn();
	    					
	    					 
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
		$("a.delete_comment_link").unbind( "click" );
		$("a.delete_comment_link").click(function(){
			var thisss = this;
			//var comment_id = $(this).parents("div.edit_comment").siblings("div.text").children("p").attr("rel");
			var comment_id = $(this).attr("rel");
			var dialog_data = $("#dialog_delete_comment").data();  
			
			dialog_data.comment_id = comment_id;
			dialog_data.element = thisss;
			$( "#dialog_delete_comment" ).dialog( "open" );


		});   
		/*//Clicking delete comment icon.
		$("a.delete_comment_link").unbind( "click" );
		$("a.delete_comment_link").click(function(){
			var thisss = this;
			//var comment_id = $(this).parents("div.edit_comment").siblings("div.text").children("p").attr("rel");
			var comment_id = $(this).attr('rel');
			var wallpost_id = $(this).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().attr("rel");
			
			$( "#delete_comm_dialog_confirm" ).dialog({
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
						$(thisss).parents("div.comments-outer").fadeOut();
						comment_delete_ajax_call = jQuery.ajax({
							
							url: "/" + PROJECT_NAME + "dashboard/delete-comment",
							type: "POST",
							dataType: "json",
							data: { 'comment_id' : comment_id, 'wallpost_id' : wallpost_id },
							success: function(jsonData) {
								if( jsonData == 1 )
								{	
									$(thisss).parents("div.comments-outer").remove();
									
									var numItems = $('div#comment_box_'+wallpost_id+' div#comments_outer_'+wallpost_id+' div.comments-outer').length ;
									var seeMoreDiv = $('div#comment_box_'+wallpost_id+' div.ok-comment-box-bot-right').length ;
									
									if(numItems == 0 && seeMoreDiv == 0){
										$('div#comment_box_'+wallpost_id).hide() ;
									}
									
									
									var updated_count = parseInt( $( "div.comments span#comment_count_"+wallpost_id ).text().replace(/[\])}[{(]/g,'') ) - 1;
									$( "div.comments span#comment_count_"+wallpost_id ).text("("+updated_count+")");
									if( updated_count < 1 )
									{
										$( "div.comments span#comment_count_"+wallpost_id ).hide();
									}
								}
								else
								{
									$(thisss).parents("div.comments-outer").slideDown();
								}	
							},
							error: function(xhr, ajaxOptions, thrownError) {
								//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
								$(thisss).parents("div.comments-outer").slideDown();
								alert("Comment not deleted. Please try agian.");
							}
						});

					}
			      }
			});

		});
	*/

		//Clicking hide comment icon.
		$("div.comments-outer div.hide_comment").unbind( "click" );
		$("div.comments-outer div.hide_comment").click(function(){
			
			if($(this).attr("status")){
				$(this).parents("div.comments-outer").css("opacity",0.3);
				var thisss = this;
				var comment_id = $(this).siblings("div.text").children("div.comment-text1").attr("rel");
				$(thisss).parents("div.comments-outer").addClass("hidden_comment");
				$(thisss).parents("div.comments-outer").css("opacity",1);
				$(thisss).parents("div.comments-outer").html('<span rel="'+comment_id+'" class="unhide-comment" title = "Hidden Comment [Hidden on your wall]">...</span>');
				showComments();
			}
			else{
				if( comment_hide_ajax_call && comment_hide_ajax_call.state() != "resolved" )
				{
					alert("Please wait...");
				}
				else
				{
					$(this).parents("div.comments-outer").css("opacity",0.3);
					var thisss = this;
					//console.log(thisss);
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
								$(thisss).parents("div.comments-outer").addClass("hidden_comment");
								$(thisss).parents("div.comments-outer").css("opacity",1);
								$(thisss).parents("div.comments-outer").html('<span rel="'+comment_id+'" class="unhide-comment" title = "Hidden Comment [Hidden on your wall]">...</span>');
								showComments();
							}
							else
							{
								$(thisss).parents("div.comments-outer").css("opacity",1);
							}
						},
						error: function(xhr, ajaxOptions, thrownError)
						{
							//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
							$(thisss).parents("div.comments-outer").slideDown();
							alert("Comment not deleted. Please try agian.");
						}
					});
				}
			}
		});
	}

	function showComments(){
		$("span.unhide-comment").unbind();
		$("span.unhide-comment").click(function(){
			var elem = $(this).parent();
			var comment_id = $(this).attr("rel");
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
				    		comment += '<div class="img img32 short_profile_border" title = "'+jsonData.commenter_fname+' '+jsonData.commenter_lname+'"><img src="' + jsonData.commenter_small_image + '" width="" height="" /></div>';
				    		comment += '</a>';
		    			}
			    		else
		    			{
				    		comment += '<div class="img img32 short_profile_border" title = "'+jsonData.commenter_fname+' '+jsonData.commenter_lname+'"><img src="' + jsonData.commenter_small_image + '" width="" height="" /></div>';
		    			}
			    		//Short profile view popup holder
			    		comment += '<div id="view-outer_'+jsonData.commenter_id+'" class="quickview-outer" popup-state="off" style="display:none;">';
			    		comment += '<div class="popupArrow">';
			    		comment += '<img width="36" height="22" src="'+IMAGE_PATH+'/arrow-purple2.png">';
			    		comment += '</div>';
			    		comment += '<div id="view_'+jsonData.commenter_id+'" class="quickview"> </div>';
			    		comment += '</div>';
			    		
					    
			    		//comment += '<div class="text"><div class="comment-text1" id = "idd_'+jsonData.comm_id+'" rel = "'+jsonData.comm_id+'"><span>'+jsonData.commenter_fname+' '+jsonData.commenter_lname+'</span>';
			    		comment += '<div class="text"><div class="comment-text1" id = "idd_'+jsonData.comm_id+'" rel = "'+jsonData.comm_id+'">';
			    		comment += '<span><a href = "/'+PROJECT_NAME+'profile/iprofile/id/'+comments_json[j]['comment_user_id']+'">'+jsonData.commenter_fname+' '+jsonData.commenter_lname+'</a></span>';
			    		comment += '<div class = "comment_text" id = "'+jsonData.comm_id+'">';
			    		comment += jsonData.comm_text;
			    		comment += '</div> ';
			    		comment += '</div> ';
			    		comment += '<textarea maxlength="255" cols="1" class="comment-textarea" rows="1" id = "id_'+jsonData.comm_id+'" rel = "'+jsonData.comm_id+'" style = "  resize: vertical; display:none;" >'+jsonData.comm_text+'</textarea>';
			    		comment += '<div class="comments-date">'+jsonData.created_at+'<a rel="'+jsonData.comm_id+'" href="javascript:;" id="unhideComment_'+jsonData.comm_id+'" class="unhideComment">Unhide</a></div>';
			    		comment += '</div>';
			    		comment += '<div style="text-align: right;" status="hide" class="hide_comment hide_comment_'+jsonData.comm_id+'"><img title="Hide comment" src="'+IMAGE_PATH+'/cross-grey.png"></div>';
			    		elem.empty();
			        	elem.html(comment);
			        	elem.css("opacity","0.3");
			        	elem.removeClass("hidden_comment");
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
			
		});
	}


//function to show privacy options 
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
		url: "/" + PROJECT_NAME + "post/change-privacy-of-wallpost",
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

/**
 * Show edit box for wallpost.
 * @param elem
 * @param wallpost_id
 * @author jsingh7,sjaiswal
 */
function showWallpostEditBox( elem, wallpost_id )
{
	$('div#'+wallpost_id+'.wallpost_editor textarea').val( $('p#'+wallpost_id+'.editable .wallpost_text_cropped').text() );
	$(elem).parents('div.option-pop2').hide();
	$('p#'+wallpost_id+'.editable').hide();
	$('div#'+wallpost_id+'.wallpost_editor').fadeIn();
}

/**
 * Hide edit box for wallpost.
 * @param elem
 * @param wallpost_id
 */
function saveWallpostEditing( elem, wallpost_id )
{
	$(elem).hide();
	$('div#'+wallpost_id+'.wallpost_editor textarea').attr("disabled", "disabled");
	var idd = addLoadingImage($(elem), "before", "loading_small_purple.gif", 113, 18);

	jQuery.ajax({
		url: "/" + PROJECT_NAME + "dashboard/update-wallpost-text",
		type: "POST",
		dataType: "json",
		data: { 'wallpost_id' : wallpost_id, "wallpost_text" : $("div#"+wallpost_id+".wallpost_editor textarea").val() },
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
}

/**
 * unok post on wall
 * @param elem
 * @param wallpost_id
 * @author jsingh7
 */
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
		url: "/" + PROJECT_NAME + "post/not-ok-the-wallpost",
		type: "POST",
		dataType: "json",
		data: { 'wallpost_id' : wallpost_id },
//		cache: false,
		timeout: 50000,
		success: function(jsonData) {
			if( jsonData.is_success == 1 )
			{
//				Decrementing count.
        		var updated_count = parseInt( $(elem).parent().siblings("div.like_count").children("a").text().replace(/[\])}[{(]/g,'') )-1;
        		$(elem).parent().siblings("div.like_count").children("a").text("("+updated_count+")");
				if( updated_count < 1 )
				{
					$(elem).parent().siblings("div.like_count").children("a").hide();
				}
				
				//Updating likers string
				if( jsonData.likers_string.length > 0)
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
 * ok post on wall
 * @param elem
 * @param wallpost_id
 * @author jsingh7
 */
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
        url: "/" + PROJECT_NAME + "post/ok-the-wallpost",
        type: "POST",
        dataType: "json",
        data: { 'wallpost_id' : wallpost_id },
//		cache: false,
        timeout: 50000,
        success: function(jsonData) {
        	if( jsonData.is_success == 1 )
        	{
        		
//        		Incrementing count.
        		var updated_count = parseInt( $(elem).parent().siblings("div.like_count").children("a").text().replace(/[\])}[{(]/g,'') )+1;
        		$(elem).parent().siblings("div.like_count").children("a").text("("+updated_count+")");
        		$(elem).parent().siblings("div.like_count").children("a").fadeIn();

        		//Updating likers string
        		$("div#"+wallpost_id+".people-who-liked").fadeIn();
        		$("div#"+wallpost_id+".people-who-liked span").html(jsonData.likers_string);
        	}
        	else
        	{
//        		$("span#"+idd).remove();
        		//alert("An error occured. Please try again. If problem persists, please contact admin.");
        	}	
        },
        error: function(xhr, ajaxOptions, thrownError) {
        	
        }
	});
	//Ajax call for sending 'ok' notification to wallpost owner 
	//and users who have done any activity on it.
	jQuery.ajax
	({
		url: "/" + PROJECT_NAME + "notifications/send-ok-notification",
		type: "POST",
		dataType: "json",
		data: { 'wallpost_id' : wallpost_id },
		timeout: 50000,
	});
}

/**
 * Gets info for sharing post which is already on the wall.
 * Display the post to share inside popup designed for dashboard type
 * wallposts
 * 
 * @param wallpost_id
 * @param elem
 * @author jsingh7
 * @version 1.0
 */
function shareThisPostByWallpostId_1( wallpost_id, elem )
{

	$('div#share_dashboard_post_popup').bPopup(
	{
		modalClose: true,
	    easing: 'easeOutBack', //uses jQuery easing plugin
        speed: 500,
		closeClass : 'close_bpopup',
//        transition: 'slideDown',
        onClose: function() {},
        onOpen: function() {
        	//Do required stuff...
        	$("div#share_dashboard_post_popup div#share_box").html("<div style = 'display : table-cell; height: 500px; width: 490px; text-align:center; vertical-align: middle;'><image src = "+IMAGE_PATH+"/loading_medium_purple.gif></div>");
        	jQuery.ajax({
                url: "/" + PROJECT_NAME + "dashboard/get-info-of-original-wallpost",
                type: "POST",
                dataType: "json",
                data: { 'wallpost_id' : wallpost_id },
                timeout: 50000,
                success: function( jsonData ) {
                	
                	if( jsonData == 2 )
                	{
                		showDialogMsg( "Oops!", "Oops! Post doesnot exist anymore.", 3000, {buttons:[{text:"OK",click:function(){$(this).dialog("close");}}],show:{effect:"fade"},hide:{effect:"fade"},dialogClass:"general_dialog_message",height:200,width:300} );
                		var bPopup = $('div#share_dashboard_post_popup').bPopup();
                		bPopup.close();
                		return;
                	}	
                	
                	var html = "";
                	html += '<div class="share-hdr2">';
                						
					html += '<p>';
					if( jsonData.post_update_type == 6 )//sharing shared text
                	{
						var txtLength = (jsonData.wallpost_user_text_old).length;
						var txtText = jsonData.wallpost_user_text_old;
						if(txtLength>350){
							txtText = txtText.substr(0, 350)+"...";
						}
						
                		html += '<a href="/'+PROJECT_NAME+'"></a> ' + txtText;
                	}
                	else if( jsonData.post_update_type == 0 )//sharing text
                	{
                		var txtLength = (jsonData.wallpost_user_text).length;
						var txtText = jsonData.wallpost_user_text;
						if(txtLength>350){
							txtText = txtText.substr(0, 350)+"...";
						}
	                	html += '<a target="_blank" href="/'+PROJECT_NAME+'"></a> ' + txtText;
                	}	
                	else
                	{	
			            if( jsonData.post_update_type == 1 )//sharing link
			            {
	                			
		                    html += '<p class = "url_preview_in_popup">';
		                    html += jsonData.wallpost_user_text;
		                    html += '</p>';
		                    html += '<div class="link-outer url_preview_in_popup">';
		                   
		                    if(jsonData.url_data.image_src)
		                    {
		                    	html += '<div class="link-img url_preview_in_popup">';
		                    	html += '<img width="50" height="50" src="'+jsonData.url_data.image_src+'">';
			                    html += '</div>';
			                    html += '<div class="link-detail url_preview_in_popup">';
		                    }
		                    else
		                    {
		                    	html += '<div class="link-detail url_preview_in_popup" style="width:auto !important;">';
		                    }
		                    var titleLength = (jsonData.url_data.url_title).length;
		                    var sharedTitle = jsonData.url_data.url_title;  	
		                    if(titleLength>35)
		                    {
		                    	  sharedTitle = sharedTitle.substr(0, 34)+"...";
		                    }
		                    var contentLength = (jsonData.url_data.url_content).length;
		                    var sharedContent = jsonData.url_data.url_content;  	
		                    if(contentLength>160)
		                    {
		                    	sharedContent = sharedContent.substr(0, 160)+"...";
		                    }
		                    var vurl = $(jsonData.wallpost_user_text).attr("href");
		                    html += '<a target="_blank" href="'+vurl+'" class="url_title text-dark-purple" >'+sharedTitle+'</a>';
		                    html += '<p>'+sharedContent+'</p>';
		                    html += '</div>';
		                    html += '</div>';
	                	}
			            else if( jsonData.post_update_type == 12 )//Sharing a profile url
			            {
			            	html += '<p class = "url_preview_in_popup">';
		                    html += jsonData.wallpost_user_text;
		                    html += '</p>';
		                    html += '<div class="link-outer url_preview_in_popup">';
		                   
		                    if(jsonData.url_data.image_src)
		                    {
		                    	html += '<div class="link-img url_preview_in_popup">';
		                    	html += '<img width="50" height="50" src="'+jsonData.url_data.image_src+'">';
			                    html += '</div>';
			                    html += '<div class="link-detail url_preview_in_popup">';
		                    }
		                    else
		                    {
		                    	html += '<div class="link-detail url_preview_in_popup" style="width:auto !important;">';
		                    }
		                    var titleLength = (jsonData.url_data.url_title).length;
		                    var sharedTitle = jsonData.url_data.url_title;  	
		                    if(titleLength>35){
		                    	  sharedTitle = sharedTitle.substr(0, 34)+"...";
		                    }
		                    var contentLength = (jsonData.url_data.url_content).length;
		                    var sharedContent = jsonData.url_data.url_content;  	
		                    if(contentLength>160){
		                    	sharedContent = sharedContent.substr(0, 160)+"...";
		                    }
		                    var vurl = $(jsonData.wallpost_user_text).attr("href");
		                    html += '<a target="_blank" href="'+vurl+'" class="url_title text-dark-purple" >'+sharedTitle+'</a>';
		                    html += '<p>'+sharedContent+'</p>';
		                    html += '</div>';
		                    html += '</div>';
			            }
			            else if( jsonData.post_update_type == 7 || jsonData.post_update_type == 13)//sharing 'shared link on wall'. 
			            {
			            	html += '<p class = "url_preview_in_popup">';
		                    html += jsonData.wallpost_user_text_old;
		                    html += '</p>';
		                    html += '<div class="link-outer url_preview_in_popup">';
		                   
		                    if(jsonData.url_data.image_src)
		                    {
		                    	html += '<div class="link-img url_preview_in_popup">';
		                    	html += '<img width="50" height="50" src="'+jsonData.url_data.image_src+'">';
			                    html += '</div>';
			                    html += '<div class="link-detail url_preview_in_popup">';
		                    }
		                    else
		                    {
		                    	html += '<div class="link-detail url_preview_in_popup" style="width:auto !important;">';
		                    }
		                    var titleLength = (jsonData.url_data.url_title).length;
		                    var sharedTitle = jsonData.url_data.url_title;
		                    if(titleLength>35)
		                    {
		                    	  sharedTitle = sharedTitle.substr(0, 34)+"...";
		                    }
		                    var contentLength = (jsonData.url_data.url_content).length;
		                    var sharedContent = jsonData.url_data.url_content;
		                    if(contentLength>160)
		                    {
		                    	sharedContent = sharedContent.substr(0, 160)+"...";
		                    }
		                    html += '<a class="url_title text-dark-purple" >'+sharedTitle+'</a>';
		                    html += '<p>'+sharedContent+'</p>';
		                    html += '</div>';
		                    html += '</div>';
			            }
                	}	
					html+='</p>';
					html += '</div>';
					
					
                	html += '<form id="toshare" class="form-share-pop">';
                	
                	html += '<div id = "privacy">';
                	html += '<input class="share-checkbox" checked="checked" type="checkbox" id="share-update" name="share-wall[]" value="1" onclick = "enableDisableShareForm(this, '+"'div#share_dashboard_post_popup'"+')"> Share an update';
                	
                	html += '<div class="share-greybox">';
                	
                	html += '<textarea maxlength="1000" style="height:50px; width:97%;background:#fff;border:1px solid #ddd;"id="new_text3" name = "new_text3" placeholder="Share an update. Type a name to mention a connection or company." rows="" cols="" ></textarea>';
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
            		
                	
                	
            		/****Second Div Starts*****/
                	html += '<div id = "privacy">';
                	html += '<input class="share-checkbox" type="checkbox" id="share-individual" name="share-wall[]" value="2"> Send to individuals';
                	html += '<div class="share-greybox individual-msg-div">';
                	html += '<div class="share-greybox-lt">';
                	html += 'To:';
                	html += '</div>';
                	html += '<div class="share-greybox-rt">';
                	html += '<input placeholder="Start typing a name or email address" id="receiver_id" name="receiver_id" style="width:99%; border:1px solid #ddd;" type="text">';
                	html += '</div>';
                	html += '<div class="share-greybox-lt">';
                	html += 'Message:';
                	html += '</div>';
                	html += '<div class="share-greybox-rt">';
                	html += '<textarea maxlength="1000" placeholder="Your message here"  name="share_text_msg" id="share_text_msg" style="height:50px; width:97%;background:#fff;border:1px solid #ddd;"></textarea>';
                	html += '</div>';
                	
            	
            		html += '</div>';
                	html += '</div>';
                	/****Second Div Ends*****/
                	
					html += '<div id  = "lower_container">';
							
                	html += '<input type="hidden" name="photo_id" id="photo_id" value="'+jsonData.socialise_photo_id+'" />';							
                	html += '</div>';
                	html += '<div class="individual_popup_msg" style = "display: inline-block; height: 27px; padding: 0px; float: left; margin-top: 10px;  text-align: center;">';
            		html += '<a id="share_popup" href="javascript:;" onclick = "shareTextFromWall('+jsonData.wallpost_id+', '+jsonData.wallpost_user_id+',this)">';
            		html += '<img width="102" height="27" title="Share" alt="Share" src="'+IMAGE_PATH+'/btn-share.png">';
            		html += '</a>';
            		html += '</div>';
                	
                	html += '<input type="hidden" name="wallpost_user_id" id="wallpost_user_id" value="'+jsonData.wallpost_user_id+'" />';
                	
                	//Whether value set to 1 or 7, will saved in DB as 7 where share using popup(i.e share from wall to wall) and
                	//Whether value set to 12 or 13, will saved in DB as 13 where share using popup(i.e share from wall to wall).
                	html += '<input type="hidden" name="post_update_type" id="post_update_type" value="'+jsonData.post_update_type+'" />';

                	if( jsonData.post_update_type == 7 )//sharing 'shared link on wall'.
                	{	
                		html += '<span style="display:none;" id="wall_post_text_data">'+jsonData.wallpost_user_text_old+'</span>';
                		// html += "<input type='hidden' name='wall_post_text_data' id='wall_post_text_data' value='"+jsonData.wallpost_user_text_old+"' />";
                		//html += "<input type='hidden' name='old_text' id='old_text' value='"+jsonData.wallpost_user_text_old+"' />";
                	}
                	else if( jsonData.post_update_type == 6 )//sharing 'shared text on wall'.
                	{
                		html += '<span style="display:none;" id="wall_post_text_data">'+jsonData.wallpost_user_text_old+'</span>';
                		//html += "<input type='hidden' name='wall_post_text_data' id='wall_post_text_data' value='"+jsonData.wallpost_user_text_old+"'/>";
                		//html += "<input type='hidden' name='old_text' id='old_text' value='"+jsonData.wallpost_user_text_old+"'/>";
                	}
                	else if( jsonData.post_update_type == 13 )//sharing 'shared profile url on wall'.
                	{
                		html += '<span style="display:none;" id="wall_post_text_data">'+jsonData.wallpost_user_text_old+'</span>';
                		// html += "<input type='hidden' name='wall_post_text_data' id='wall_post_text_data' value='"+jsonData.wallpost_user_text_old+"' />";
                		//html += "<input type='hidden' name='old_text' id='old_text' value='"+jsonData.wallpost_user_text+"' />";
                	}
                	else
                	{
                		html += '<span style="display:none;" id="wall_post_text_data">'+jsonData.wallpost_user_text+'</span>';
                		//html += "<input type='hidden' name='wall_post_text_data' id='wall_post_text_data' value='"+jsonData.wallpost_user_text+"' />";
                		//html += "<input type='hidden' name='old_text' id='old_text' value='"+jsonData.wallpost_user_text+"' />";
                	}	
                	
                	html += '</form>';
                	
                	$('div#share_dashboard_post_popup div#share_box').html(html);
                	
                	//Popup reposition
                	var bPopup = $("div#share_dashboard_post_popup").bPopup();
            		bPopup.reposition();
            		
            		if( $( window ).height() < 637 )
            		{
            			$("div#share_dashboard_post_popup form.form-share-pop").css("height", "225px");
            		}
            		else
            		{
            			$("div#share_dashboard_post_popup form.form-share-pop").css("height", "");
            		}
                	
                	// displayShareButton();
                	retrieveUsersWithAutocomplete();
                	// add hide or display event for INDIVIDUAL EMAIL...
                	addIndividualCheckBoxEvent( 'div#share_dashboard_post_popup' );

					if($('#privacydd').length > 0)
					{
						$('#privacydd option[value=2]').attr('selected','selected');
						$("select#privacydd").selectBoxIt({theme: "jqueryui"});
					}

                	$("#jq_receiver_id").attr("placeholder","Start typing a name or email address");
                	$("#jq_receiver_id").css("width","232px");
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


/**
 * Gets info for sharing post which is already on the wall.
 * Display the post to share inside popup designed for socialise(photo) type
 * wallposts
 * 
 * @param wallpost_id
 * @param elem
 * @author jsingh7
 * @version 1.0
 */
function shareThisPostByWallpostId_2( wallpost_id, elem )
{

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
                success: function( jsonData ) {
                	var html = "";
                	html += '<div class="share-hdr2">';

					html += '<div class="share-hdr2-lt collage_text">';
					html += '<div id = "photo_thumbnail">';
					html += getPopupCollageHTML( jsonData.collage, jsonData.first_img_portrait_or_landscape );

   
                	html += '</div>';
					html += '</div>';

					html += '<div class="share-hdr2-rt collage_text">';

					html += '<p>';
					if(jsonData.wallpost_user_text!=null && jsonData.wallpost_user_text!="")
					{
						html+=jsonData.wallpost_user_text;
					}
					else 
					{
						if(jsonData.socialise_photo_desc!=null)
						{
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
            		html += '<select style="display: none;" id="privacydd2" name="privacy">';
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
                	html += '<input placeholder="Start typing a name or email address" id="receiver_id2" name="receiver_id" style="width:99%; border:1px solid #ddd;" type="text">';
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
            		html += '<a id="share_popup" style="float:left;" href="javascript:;" onclick = "sharePhotofeedFromWall('+jsonData.wallpost_id+', '+jsonData.wallpost_user_id+', this)">';
            		html += '<img width="102" height="27" title="Share" alt="Share" src="'+IMAGE_PATH+'/btn-share.png">';
            		html += '</a>';
            		html += '</div>';
            		
                	html += '<input type="hidden" name="photo_id" id="photo_id" value="'+jsonData.socialise_photo_id+'" />';
                	html += '</form>';
                	
                	$('div#share_box').html(html);
                	
                	
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
                                        //container.children().removeClass('jquerynailthumb');
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
                	
                	retrieveUsersWithAutocomplete2();
                	addIndividualCheckBoxEvent();
         
					if($('#privacydd2').length > 0)
							{
								$('#privacydd2 option[value=2]').attr('selected','selected');
								$("select#privacydd2").selectBoxIt({theme: "jqueryui"});
							}
				
                	$("input#jq_receiver_id2").attr("placeholder","Start typing a name or email address");
                	$("input#jq_receiver_id2").css("width","232px");
                	
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
        	
        	var comment = "";
        	comment += '<div class="comments-outer comments-outer_'+jsonData.comm_id+'">';
        	
    		var parameter_json = "{'user_id':"+jsonData.commenter_id+"}";
    		if(jsonData.commenter_id)
			{
    			
	    		comment += '<a disable-border="1" id="'+jsonData.commenter_id+'" title = "'+jsonData.commenter_fname+' '+jsonData.commenter_lname+'" href = "javascript:" onclick="getShortProfile(this,'+parameter_json+')" >';
	    		comment += '<div style="width:32px;" class="img short_profile_border" title = "'+jsonData.commenter_fname+' '+jsonData.commenter_lname+'"><img src="' + jsonData.commenter_small_image + '" width="" height="" /></div>';
	    		comment += '</a>';
			}
    		else
			{
    			comment += '<div style="width:32px;" class="img short_profile_border" title = "'+jsonData.commenter_fname+' '+jsonData.commenter_lname+'"><img src="' + jsonData.commenter_small_image + '" width="" height="" /></div>';
			}
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
        	comment += '<textarea class="comment-textarea" maxlength="255" style="resize: vertical; display:none !important;" rel="'+jsonData.comm_id+'" id="id_'+jsonData.comm_id+'_popUp" rows="1" cols="1">'+jsonData.comm_text+'</textarea>';
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
        	
        	$(elem).val('');
        	$( "div.comments span#comment_count_"+wallpost_id).text("("+jsonData.comment_count+")");
        	$( "div.comments span#comment_count_"+wallpost_id).fadeIn();
        	
        	$(elem).removeAttr("disabled");
        	$(elem).css("background-color", "#FFFFFF");
        	$(elem).css("color", "#48545E;");
        	
//        	Activate action controls for comments.
        	activateCommentActions();
        },
        error: function(xhr, ajaxOptions, thrownError) {
        	alert("Error while commenting, please try again!");
        }
	});
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
}
function showComments(){
	$("span.unhide-comment").unbind();
	$("span.unhide-comment").click(function(){
		var elem = $(this).parent();
		var comment_id = $(this).attr("rel");
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
		    		comment += '<a disable-border="1" id="'+jsonData.commenter_id+'" title = "'+jsonData.commenter_fname+' '+jsonData.commenter_lname+'" href = "javascript:" onclick="getShortProfile(this,'+parameter_json+')" >';
		    		comment += '<div class="img img32 short_profile_border" title = "'+jsonData.commenter_fname+' '+jsonData.commenter_lname+'"><img src="' + jsonData.commenter_small_image + '" width="" height="" /></div>';
		    		comment += '</a>';
		    		
		    		//Short profile view popup holder
		    		comment += '<div id="view-outer_'+jsonData.commenter_id+'" class="quickview-outer" popup-state="off" style="display:none;">';
		    		comment += '<div class="popupArrow">';
		    		comment += '<img width="36" height="22" src="'+IMAGE_PATH+'/arrow-purple2.png">';
		    		comment += '</div>';
		    		comment += '<div id="view_'+jsonData.commenter_id+'" class="quickview"> </div>';
		    		comment += '</div>';
		    		
				    
		    		//comment += '<div class="text"><div class="comment-text1" id = "idd_'+jsonData.comm_id+'" rel = "'+jsonData.comm_id+'"><span>'+jsonData.commenter_fname+' '+jsonData.commenter_lname+'</span>';
		    		comment += '<div class="text"><div class="comment-text1" id = "idd_'+jsonData.comm_id+'" rel = "'+jsonData.comm_id+'">';
		    		//comment += '<span><a href = "/'+PROJECT_NAME+'profile/iprofile/id/'+comments_json[j]['comment_user_id']+'">'+jsonData.commenter_fname+' '+jsonData.commenter_lname+'</a></span>';
		    		comment += '<span>'+jsonData.commenter_fname+' '+jsonData.commenter_lname+'</span>';
		    		comment += '<div class = "comment_text" id = "'+jsonData.comm_id+'">';
		    		comment += jsonData.comm_text;
		    		comment += '</div> ';
		    		comment += '</div> ';
		    		comment += '<textarea maxlength="255" cols="1" class="comment-textarea" rows="1" id = "id_'+jsonData.comm_id+'" rel = "'+jsonData.comm_id+'" style = "  resize: vertical; display:none;" >'+jsonData.comm_text+'</textarea>';
		    		comment += '<div class="comments-date">'+jsonData.created_at+'<a rel="'+jsonData.comm_id+'" href="javascript:;" id="unhideComment_'+jsonData.comm_id+'" class="unhideComment">Unhide</a></div>';
		    		comment += '</div>';
		    		comment += '<div style="text-align: right;" status="hide" class="hide_comment hide_comment_'+jsonData.comm_id+'"><img title="Hide comment" src="'+IMAGE_PATH+'/cross-grey.png"></div>';
		    		elem.empty();
		        	elem.html(comment);
		        	elem.css("opacity","0.3");
		        	elem.removeClass("hidden_comment");
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
		
	});
}
function unHideComment(){
	$("a.unhideComment").unbind();
	$("a.unhideComment").click(function(){
		var elem = $(this).parent();
		var comment_id = $(this).attr("rel");
		jQuery.ajax({
			url: "/" + PROJECT_NAME + "socialise/unhide-comment-of-user",
			type: "POST",
			dataType: "json",
			data: { 'comment_id' : comment_id },
			success: function(jsonData) {
				$(".hide_comment_"+comment_id).removeAttr("status");
				$("#unhideComment_"+comment_id).remove();
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

function loadMoreComments( wallpost_id, elem, e )
{
	var idddd = addLoadingImage($('div#load_more_comments_'+wallpost_id), "before");
	$('div#load_more_comments_'+wallpost_id).hide();
    jQuery.ajax({
    	 url: "/" + PROJECT_NAME + "dashboard/get-comments-for-wallpost",
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
            	    		html += '<textarea maxlength="255" cols="1" class="comment-textarea" rows="1" id = "id_'+comments_json[j]['comment_id']+'" rel = "'+comments_json[j]['comment_id']+'" style = "  resize: vertical; display:none;" >'+comments_json[j]['comment_text']+'</textarea>';
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
            	    		html += '<div id="comments-outer_'+comments_json[j]['comment_id']+'" class="comments-outer hidden_comment comment-outer-popup-border" rel="'+comments_json[j]['comment_id']+'"><span rel="'+comments_json[j]['comment_id']+'" class="unhide-comment" title = "Hidden Comment [Hidden on your wall]">...</span></div>';
            	    	}
                		$( "div#comments_outer_"+wallpost_id ).prepend(html);
                	}
                	
                	$("input[type=hidden]#offsettt_comm_"+wallpost_id).val( parseInt( $("input[type=hidden]#offsettt_comm_"+wallpost_id ).val() ) + parseInt(j) + 1 );
                	
                	//Remove loading.
                	$("span#"+idddd).remove();
                	
//                	checking if there are more records to show or not?
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
 * this function is used to fetch users list who shared wall posts
 * @auther nsingh3,sjaiswal
 * @author hkaur5 ( view more part )
 * @param int wallpost_id 
 * @param elem
 * version 1.1
 * 
 */

function getSharedPhotoListByWallpostId(wallpost_id, elem)
{
	var offset = $('input#offset_who_shared').val();
	var limit = $('input#limit_who_shared').val();
	
	var nxt_offset = parseInt(offset)+parseInt(limit);
	$('#who_shared_listing_popup').bPopup(
			{
				modalClose: true,
			    easing: 'easeOutBack', //uses jQuery easing plugin
		        speed: 500,
				closeClass : 'close_bpopup',
		        onClose: function() {},
		        onOpen: function() {
		        	//Do required stuff...
		        	$("div#list_of_who_shared").html("<div style = 'display : table-cell; height: 197px; width: 395px; text-align:center; vertical-align: middle;'><image src = "+IMAGE_PATH+"/loading_medium_purple.gif></div>");
		        	jQuery.ajax({
		                url: "/" + PROJECT_NAME + "socialise/get-who-shared-post",
		                type: "POST",
		                dataType: "json",
		                data: { 'wallpost_id' : wallpost_id, 'offset':offset, 'limit':limit,'logged_in_user_id':$(elem).attr('rel1')  },
		                timeout: 50000,
		                success: function( jsonData ) {
		                	var html = "<ol id='post_detail_users_who_shared'>";
		                	if(jsonData.user_info)
		                	{
			                	for( i in jsonData.user_info )
			                	{
			                		
			                		html += '<div style="width: 100%;border-bottom: 1px solid #EDEDED;padding-bottom: 10px !important;" class="comments-outer">';
			                		html += '<div title="'+jsonData.user_info[i]["user_full_names"]+'" class="img short_profile_border">';
			                		html += '<div>';
			                		html += '<img src = "'+jsonData.user_info[i]["user_image"]+'"/>';
			                		html += '</div>';
			                		html += '</div>';
			                		
			                		html += '<div class="text" style="width: 88% !important; float:right; word-wrap: break-word;margin-top:1px !important;">';
			                		
			                		if( $("input[type=hidden]#my_user_id").val() == jsonData.user_info[i]["user_id"] )
			                		{
				                		html += "<a class = '' href = '/"+PROJECT_NAME+"profile/iprofile/id/"+jsonData.user_info[i]["user_id"]+"'>Me</a>";
			                		}
			                		else
			                		{	
				                		html += "<a class = '' href = '/"+PROJECT_NAME+"profile/iprofile/id/"+jsonData.user_info[i]["user_id"]+"'>"+jsonData.user_info[i]["user_full_names"]+"</a>";
			                		}
			                		
			                		html += '<span id="link_'+jsonData.user_info[i]["user_id"]+'" class="get_shared_list_dashboard">';
			                	switch ( jsonData.user_info[i]["link_info"].friend_type ) 
				            	{
				            		case 0:
									// case for inviting user
									if( $("input[type=hidden]#my_user_id").val() != jsonData.user_info[i]["user_id"] )
									{		
										html +='<a id="'+jsonData.user_info[i]["user_id"]+'" class="cursor-style invite_'+jsonData.user_info[i]["user_id"]+' invitation-request" title="Invite to Link" onclick="invitationToLinkOnDashboard('+jsonData.user_info[i]["user_id"]+', this);">';
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
									html +='<a id="'+jsonData.user_info[i]["user_id"]+'" rel="'+jsonData.user_info[i]["link_info"]["link_id"]+'" class="cursor-style invite_'+jsonData.user_info[i]["user_id"]+' cancel-request" title="Cancel Request" href="javascript:;" onclick="cancelRequestFromDashboard(this)">';
									//html +='<img src="'+IMAGE_PATH+'/cancel-request-icon.png" alt="Cancel Request"/>';
									html +='</a>';
									break;
								case 2:
									// case for accepting or rejecting request by user
									html +='<a id="'+jsonData.user_info[i]["user_id"]+'" rel="'+jsonData.user_info[i]["link_info"]["link_id"]+'" class="cursor-style invite_'+jsonData.user_info[i]["user_id"]+' accept-request" title="Accept Request" onclick="acceptRequestFromDashboard(this);" href="javascript:;">';
									//html +='<img src="'+IMAGE_PATH+'/accept-request-icon.png" alt="Accept Request"/>';
									html +='</a>';
									html +='<a id="'+jsonData.user_info[i]["user_id"]+'" rel="'+jsonData.user_info[i]["link_info"]["link_id"]+'" class="cursor-style decline_'+jsonData.user_info[i]["user_id"]+' decline-request" title="Decline Request" onclick="cancelRequestFromDashboard(this);" href="javascript:;">';
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
										html += 'Unable to find link status!';
									break;
								}
				            	html += '</span></div>';
				            	html += '</div>';
			                	}	
			                 	html += "</ol>";
			                   	if(jsonData["is_more_records"])
			        			{
				                	html += '<div class="view_more_who_shared">';
				                	html += '<p class="" >';
				                	html += '<a rel1="'+$(elem).attr('rel1')+'" href="javascript:;" class="text-dark-purple" onclick=loadMoreWhosharedPost('+wallpost_id+','+nxt_offset+',this)>';
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
 * fetching and displaying records of people who shared post
 * according to offset and limit.
 * 
 * @param wallpost_id
 * @param bit/boolean offset
 * @param elem
 * @author hkaur5
 * @version 1.1
 */
function loadMoreWhosharedPost( wallpost_id,offset, elem )
{
	var limit = $('input#limit_who_shared').val();
	$("div.view_more_who_shared p").html("<div style = 'display : table-cell;text-align:center; vertical-align: middle;'><image src = "+IMAGE_PATH+"/loading_small_purple.gif></div>");
	var nxt_offset = parseInt(offset)+parseInt(limit);
	
	jQuery.ajax({
		url: "/" + PROJECT_NAME + "socialise/get-who-shared-post",
		type: "POST",
		dataType: "json",
		data: { 'wallpost_id' : wallpost_id,'offset':offset,'limit':limit, 'logged_in_user_id':$(elem).attr('rel1') },
		timeout: 50000,
		success: function( jsonData ) {
			if(jsonData.user_info)
			{
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
						html += "<a class='' href = '/"+PROJECT_NAME+"profile/iprofile/id/"+jsonData.user_info[i]["user_id"]+"'>Me</a>";
					}
					else
					{	
						html += "<a class='' href = '/"+PROJECT_NAME+"profile/iprofile/id/"+jsonData.user_info[i]["user_id"]+"'>"+jsonData.user_info[i]["user_full_names"]+"</a>";
					}
					html +='</p>';
					if(jsonData.user_info[i].mutual_count!="Me" && jsonData.user_info[i].mutual_count!=0)
					{
						html += '<p>'+jsonData.user_info[i].mutual_count+' Mutual Friend</p>';
					}
					html += '</div>';//Left div end
					html += '<span id="link_'+jsonData.user_info[i]["user_id"]+'" class="open_who_like_dashboard" >';
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
				if(jsonData["is_more_records"])
				{
					html += '<div class="view_more_who_shared">';
					html += '<p class="" >';
					html += '<a rel1="'+$(elem).attr('rel1')+'" href="javascript:;" class="text-dark-purple" onclick=loadMoreWhosharedPost('+wallpost_id+','+nxt_offset+',this)>';
					html += 'View More';
					html += '</a>';
					html += '</p>';
					html += '</div>';
				}
				$("div.view_more_who_shared").remove();
				$("ol#post_detail_users_who_shared").append(html);
				
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
		error: function(xhr, ajaxOptions, thrownError) {
			
		}
	});
}
/**
 * Who liked listing functionality.
 * @param int wallpost_id
 * @author jsingh7,sjaiswal
 * @version 1.1
 */
function openWhoLikedPopupByWallpostID( wallpost_id )
{
	$('#who_liked_listing_popup').bPopup(
	{
		modalClose: true,
	    easing: 'easeOutBack', //uses jQuery easing plugin
        speed: 500,
		closeClass : 'close_bpopup',
        onClose: function() {},
        onOpen: function() { 	
        	//Do required stuff...
        	$("div#list_of_who_liked").html("<div style = 'display : table-cell; height:197px; width: 395px; text-align:center; vertical-align: middle;'><image src = "+IMAGE_PATH+"/loading_medium_purple.gif></div>");
        	jQuery.ajax({
                url: "/" + PROJECT_NAME + "dashboard/get-who-like-post",
                type: "POST",
                dataType: "json",
                data: { 'wallpost_id' : wallpost_id },
                timeout: 50000,
                success: function( jsonData ) {
                	var html = "<ol>";
                	
                	for( i in jsonData.user_info )
                	{
                		html += '<div style="width: 100%;border-bottom:1px solid #ededed;padding-bottom:10px !important;" class="comments-outer">';
                		html += '<div title="'+jsonData.user_info[i]["user_full_names"]+'" class="img short_profile_border">';
                		html += '<div>';
                		html += '<img src = "'+jsonData.user_info[i]["user_image"]+'"/>';
                		html += '</div>';
                		html += '</div>';
                		html += '<div class="text" style="width: 86%!important; float:left; word-wrap: break-word;margin-top:0px !important;">';
                		html +='<div style="float: left; width: 85%;" class="left">';
                		html +='<p>';
                		if( $("input[type=hidden]#my_user_id").val() == jsonData.user_info[i]["user_id"] )
                		{
	                		html += "<a href = '/"+PROJECT_NAME+"profile/iprofile/id/"+jsonData.user_info[i]["user_id"]+"'>Me</a>";
                		}
                		else
                		{	
	                		html += "<a href = '/"+PROJECT_NAME+"profile/iprofile/id/"+jsonData.user_info[i]["user_id"]+"'>"+jsonData.user_info[i]["user_full_names"]+"</a>";
                		}
                		html +='</p>';
                     	if(jsonData.user_info[i].mutual_count!="Me" && jsonData.user_info[i].mutual_count!=0)
    	            	{
    	            		html += '<p>'+jsonData.user_info[i].mutual_count+' Mutual Friend</p>';
    	            	}	
                    	html += '</div>';//Left div end
                		html += '<span id="link_'+jsonData.user_info[i]["user_id"]+'" class="open_who_like_dashboard">';
	            	switch ( jsonData.user_info[i]["link_info"].friend_type ) 
	            	{
	            	case 0:
	            		// case for inviting user
						if( $("input[type=hidden]#my_user_id").val() != jsonData.user_info[i]["user_id"] )
                		{
						html +='<a id="'+jsonData.user_info[i]["user_id"]+'" class="cursor-style invite_'+jsonData.user_info[i]["user_id"]+' invitation-request" title="Invite to Link" onclick="invitationToLinkOnDashboard('+jsonData.user_info[i]["user_id"]+', this);">';
						html +='</a>';
                		}
						else
						{
							html += '';                			
                		}
					break;
					case 1:
						// when user revert back his/her link request
						html +='<a id="'+jsonData.user_info[i]["user_id"]+'" rel="'+jsonData.user_info[i]["link_info"]["link_id"]+'" class="cursor-style invite_'+jsonData.user_info[i]["user_id"]+' cancel-request" title="Cancel Request" href="javascript:;" onclick="cancelRequestFromDashboard(this)">';
		    			
		    			html +='</a>';
					break;
					case 2:
						// case for accepting or rejecting request by user
						html +='<a id="'+jsonData.user_info[i]["user_id"]+'" rel="'+jsonData.user_info[i]["link_info"]["link_id"]+'" class="cursor-style invite_'+jsonData[i]["user_id"]+' accept-request" title="Accept Request" onclick="acceptRequestFromDashboard(this);" href="javascript:;">';
						html +='</a>';	
						html +='<a id="'+jsonData.user_info[i]["user_id"]+'" rel="'+jsonData.user_info[i]["link_info"]["link_id"]+'" class="cursor-style decline_'+jsonData.user_info[i]["user_id"]+' decline-request" title="Decline Request" onclick="cancelRequestFromDashboard(this);" href="javascript:;">';
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
	            	html += '</span>';
	       
	            	html += '</div>';
	            	html += '</div>';
                	}
                	html += "</ol>";
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

//Call confirm dialog box before deleting wallpost.
function confirmToDelete( elem, wallpost_id ,wall_type)
{
	var data = $("#dialog_confirm_delete_wallpost").data();   
	data.element = elem;  
	data.wallpost_id = wallpost_id;
	data.wall_type = wall_type;

	$("#dialog_confirm_delete_wallpost").dialog("open");
}

/**
 * Shares text from wall to wall from popup.
 *
 *@author dsingh, sunny patial
 *@version 1.0
 *@param wallpost_id
 *@param wallpost_from_user_id [owner of orignal post]
 *@param elem
 */
function shareTextFromWall(wallpost_id, wallpost_from_user_id, elem)
{
	if($("input#receiver_id").val()=="" && $("#share-individual:checked").length==1)
	{
		alert("Please add users.");
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
		
		$(elem).hide();
		
		var iddd = addLoadingImage( $(elem), "before", 'loading_small_purple.gif', 102, 27 );
		// send email message... and sharing on wall...
		if(shareOnWall == 1)
		{
			var new_text = $("textarea#new_text3").val();
			var privacysett = $("select#privacydd").val();
			var post_update_type = $("input#post_update_type").val();
			var old_text = $("#wall_post_text_data").html();
			var emailMsgText = $("textarea#share_text_msg").val();
			jQuery.ajax({
				url: "/" + PROJECT_NAME + "dashboard/share-from-wall",
				type: "POST",
				dataType: "json",
				data:{
					"new_text":new_text,
					"old_text":old_text, 
					"privacysett":privacysett,
				//	"from_user":wallpost_from_user_id,
					"wallpost_id":wallpost_id, 
					"post_update_type" : post_update_type, 
					"wall_share" :shareOnWall, 
					"email_share" : shareOnEmail, 
					"share_text_msg" : emailMsgText 
					} ,
				timeout: 50000,
				success: function( jsonData ) 
				{
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
							data: {"share_text_msg":emailMsgText,"wallpost_id":jsonData.wallpost_id, "receiver_id":userIDs } ,
							success: function(jsonData) 
							{
								
							}
						});
					}
					// send email message...end..
					var share_count  = $( "div.share span a#share_count"+'_'+ wallpost_id ).text().replace(/[\])}[{(]/g,'');
					share_count = share_count.replace ( /[^\d.]/g, '' );
					share_count = parseInt(share_count, 10);
					if ( isNaN(share_count) )
					{ 
						share_count = 0;
					}
					share_count = parseInt(share_count) + 1 ;
					$("div.share span a#share_count"+'_'+ wallpost_id ).text("("+share_count+")");   
					
					$("span#"+iddd).remove();
						
					//closing popup
					$('div#share_dashboard_post_popup').bPopup().close();
					
					//Show dialog after sharing.
					$( "#dialog_success_share" ).dialog( "open" );
					$("#dialog_success_share")
					.delay(3000)
					.queue(function(){
						$(this)
						.dialog("close")
						.dequeue(); // take this function out of queue a.k.a dequeue a.k.a notify done
						// so the next function on the queue continues execution...
					});
					
					
					// number of rows define to display text on wall. 
					$("div.news-update-content:nth-child(1)").fadeIn(); 
					//Updating sharecount.
					
//           $("div.share_count a span#wallpost_"+wallpost_id).text("("+jsonData.post_share_count+")");
					//         $("div.share_count a span#wallpost_"+wallpost_id).css("border","solid 1px red");
					//      var dfgsdf = $(elem).html();
					//    alert(dfgsdf);
					
					activateCommentActions();    
				}
				
			});
			//Ajax call for sending 'share' notification to wallpost owner 
			//and users who have done any activity on it.
			jQuery.ajax
			({
				url: "/" + PROJECT_NAME + "notifications/send-share-notification",
				type: "POST",
				dataType: "json",
				data: {"new_text":new_text,"old_text":old_text, "privacysett":privacysett,"from_user":wallpost_from_user_id,"wallpost_id":wallpost_id, "post_update_type" : post_update_type } ,
				success: function(jsonData) 
				{
					
				}
			});
			
		}
		// send email message... not sharing on wall...
		else if(shareOnWall == 0 && shareOnEmail == 1 )
		{
			var emailMsgText = $("textarea#share_text_msg").val();
			var userIDs = $("input#receiver_id").val();
			jQuery.ajax
			({
				url: "/" + PROJECT_NAME + "dashboard/send-wall-link-to-individual-emails",
				type: "POST",
				dataType: "json",
				data: {"share_text_msg":emailMsgText,"wallpost_id":wallpost_id, "receiver_id":userIDs } ,
				success: function(jsonData) 
				{
					$("span#"+iddd).remove();
					//closing popup
					$('div#share_photo_feed_popup').bPopup().close();
					//Show dialog after sharing.
					$( "#dialog_success_share" ).dialog( "open" );
					$("#dialog_success_share")
					.delay(3000)
					.queue(function(){
						$(this)
						.dialog("close")
						.dequeue(); // take this function out of queue a.k.a dequeue a.k.a notify done
						// so the next function on the queue continues execution...
					});
				}
			});
		}		
	}    
}

/*

 * Makes wall post html,
 * according to recieved parameters.
 * 
 * @param wallpost_id
 * @param user_id
 * @param user_full_name
 * @param user_image
 * @param wall_post_text
 * @param displayyNone [ 0 for display, 1 for display : none ]
 * @param like_count
 * @param comment_count
 * @param share_count
 * @param comments_json
 * @param did_i_liked_this
 * @param integer post_update_type
 * @param json url_json
 * @param string created_at
 * @param json shared_data [in the format of json, will contain shared data such as fullname, text]
 * @param string likers_string [ For eg : You, Rajan, Jason and 3 other(s) OK this ]
 * @param integer is_ok_comment_share_pannel_visible [0 or 1]
 * @param integer privacy
 * @param integer is_my_wallpost[0 or 1]
 * 
 * @returns "wallpost HTML"
 * @author jsingh7
 * @version 1.0
 *
 *//*
function wallPostMaker(
						wallpost_id,
						user_id, 
						user_full_name, 
						user_image, 
						wall_post_text, 
						displayyNone, 
						like_count, 
						comment_count, 
						share_count, 
						comments_json, 
						did_i_liked_this, 
						post_update_type, 
						url_json, 
						created_at, 
						shared_data, 
						likers_string, 
						is_ok_comment_share_pannel_visible, 
						privacy, 
						is_my_wallpost
						)
{

	wall_post = "";
	if( displayyNone == 0 )
	{
		wall_post += '<div class="news-update-content" rel="'+wallpost_id+'">';
	}
	else
	{
		wall_post += '<div class="news-update-content" rel="'+wallpost_id+'" style = "display:none;">';		
	}	
	wall_post += '<div class="dash-sharelink-content" rel = "'+wallpost_id+'">';
	wall_post += '<div class="dashboard-sharelink-column" style="position:relative;">';
	
	
	if( post_update_type == 6 )//Shared text
	{
		wall_post += '<div class="shared-link">';
		wall_post += '<span class="text-purple2">'+user_full_name+'</span> shared <span class="text-purple2">a status update</span>';
		wall_post += '</div>';
	}
	
	if( post_update_type == 7 || post_update_type == 13 )//Shared URL
	{	
		wall_post += '<div class="shared-link">';
		wall_post += '<span class="text-purple2">'+user_full_name+'</span> shared <span class="text-purple2">URL</span>';
		wall_post += '</div>';
	}
	
	
	wall_post += '<div class="dashboard-sharelink-icon short_profile_border" title = "' + user_full_name + '" >';
	var parameter_json = "{'user_id':"+user_id+"}";
	wall_post += '<a disable-border="1" id="'+user_id+'" href = "javascript:" onclick="getShortProfile(this,'+parameter_json+')" >';
	wall_post += '<img src="' + user_image + '" width="" height="" />';
	wall_post += '</a>';
	
	//Short profile view popup holder
	wall_post += '<div id="view-outer_'+user_id+'" class="quickview-outer" popup-state="off" style="display:none;">';
	wall_post += '<div class="popupArrow">';
	wall_post += '<img width="36" height="22" src="'+IMAGE_PATH+'/arrow-purple2.png">';
	wall_post += '</div>';
	wall_post += '<div id="view_'+user_id+'" class="quickview"> </div>';
	wall_post += '</div>';
	
	wall_post += '</div>';
				
	wall_post += '<div class="dashboard-sharelink-detail">';
	wall_post += '<h4>';
	wall_post += '<a class="text-purple2" href="/'+PROJECT_NAME+'profile/iprofile/id/'+ user_id +'" style="text-decoration: none !important;">';
	wall_post += user_full_name;
	wall_post += '</a>';
	wall_post += '</h4>';
					
	wall_post += '<p style="width:auto;float:left;">'+created_at;
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
	wall_post += '</p>';
	
	//Privacy options popup starts------
	if( is_my_wallpost == 1 )
	{	
		wall_post += '<div style="position: relative; float: left; margin: 3px 0px 0px 4px;">';
		wall_post += '<img class = "privacy_settings_arrow" src="'+IMAGE_PATH+'/arrow-down-grey.png" onclick = "showPrivacyOptions(this)">';
		wall_post += '<div class="option-popppp" style="">';
		
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
	//Privacy options popup ends------
	
	if( post_update_type == 6 || post_update_type == 7 || post_update_type == 13 ) //Shared text and Shared URL
	{
		if( shared_data )
		{
			wall_post += '<p id = "'+wallpost_id+'" class="text-black editable simple_text_'+wallpost_id+'">';
			wall_post += '<span class = "wallpost_text_cropped" id = "'+wallpost_id+'">'+showCroppedText( wall_post_text, 750, '...<label onclick="showFullWallpostText(this)">See More</label>' )+'</span>';
			wall_post += '<span class = "wallpost_text_full" id = "'+wallpost_id+'">'+wall_post_text+'</span>';
			wall_post += '</p>';
			
			wall_post += '<div class = "wallpost_editor" id = "'+wallpost_id+'">';
			wall_post += "<textarea>" + wall_post_text + "</textarea>";
			wall_post += '<div class="wall-editor-btn">';
			wall_post += '<input class="btn-purple" type = "button" name = "save" value = "Done Editing" id = "'+wallpost_id+'" onclick = "saveWallpostEditing( this, '+wallpost_id+' )">';
			wall_post += '<a class="new-cancel-btn" id = "'+wallpost_id+'" onclick = "cancelWallpostEditing( this, '+wallpost_id+' )" href="javascript:;">Cancel</a>';
			wall_post += '</div>';
			wall_post += '</div>';
		}
	}
					
	wall_post += '</div>';
	
	
	if( post_update_type == 6 ) //Shared text
	{
		if( shared_data )
		{
			wall_post += '<div class="shared-link-outernew">';
			wall_post += '<div class="share-link-outer">';
			
			
			wall_post += '<div class="share-link-img">';
			wall_post += '<div class = "short_profile_border share-link-img2" style="">';
			
			
			var parameter_json = "{'user_id':"+shared_data.from_user_id+"}";
			wall_post += '<a disable-border="1" id="'+shared_data.from_user_id+'" title = "'+shared_data.from_user_fullname+'" href = "javascript:" onclick="getShortProfile(this,'+parameter_json+')" >';
			wall_post += '<img title = "'+shared_data.from_user_fullname+'" width = "32" src="' + shared_data.from_user_image + '" />';
			wall_post += '</a>';
    		
    		//Short profile view popup holder
			wall_post += '<div id="view-outer_'+shared_data.from_user_id+'" class="quickview-outer" popup-state="off" style="display:none;">';
			wall_post += '<div class="popupArrow">';
			wall_post += '<img width="36" height="22" src="'+IMAGE_PATH+'/arrow-purple2.png">';
			wall_post += '</div>';
			wall_post += '<div id="view_'+shared_data.from_user_id+'" class="quickview"> </div>';
			wall_post += '</div>';
			
			wall_post += '</div>';
			wall_post += '</div>';
			
			
			wall_post += '<div class="share-link-detail">';
			wall_post += '<h4></h4>';
			if( shared_data.from_user_user_type != 5 )//Admin type
			{
				wall_post += '<p> <a class="text-purple2 fnt-bold" href="/'+PROJECT_NAME+'profile/iprofile/id/'+shared_data.from_user_id+'" >'+shared_data.from_user_fullname+'</a> <img src="'+IMAGE_PATH+'/status-arrow.png" width="" height="" /> <a class=" fnt-bold text-purple2" href="/'+PROJECT_NAME+'profile/iprofile/id/'+user_id+'" >'+user_full_name+'</a></p>';
				//wall_post += '<p> <a class="text-purple2 fnt-bold" href="profile/iprofile/id/'+shared_data.from_user_id+'" >'+shared_data.from_user_fullname+'</a> <img src="'+IMAGE_PATH+'/status-arrow.png" width="" height="" /> <a class=" fnt-bold text-purple2" href="profile/iprofile/id/'+user_id+'" >'+user_full_name+'</a></p>';
			}
			else
			{
				wall_post += '<p> <a class="text-purple2 fnt-bold" style = "cursor:default;" href="javascript:void(0);" >'+shared_data.from_user_fullname+'</a> <img src="'+IMAGE_PATH+'/status-arrow.png" width="" height="" /> <a class=" fnt-bold text-purple2" href="/'+PROJECT_NAME+'profile/iprofile/id/'+user_id+'" >'+user_full_name+'</a></p>';
			}	
			
			wall_post += '<p>';
			wall_post += shared_data.from_user_wall_text;
			wall_post += '</p>';
			wall_post += '</div>';
			wall_post += '</div>';
			wall_post += '</div>';
		}
	}
	
	if( post_update_type == 7 ) //Shared URL
	{
		if( shared_data )
		{
			wall_post += '<div class="shared-link-outernew">';
			wall_post += '<div class="share-link-outer">';
			
			wall_post += '<div class="share-link-img">';
			wall_post += '<div class = "short_profile_border share-link-img2" style="">';
			
			
			var parameter_json = "{'user_id':"+shared_data.from_user_id+"}";
			wall_post += '<a disable-border="1" id="'+shared_data.from_user_id+'" title = "'+shared_data.from_user_fullname+'" href = "javascript:" onclick="getShortProfile(this,'+parameter_json+')" >';
			wall_post += '<img title = "'+shared_data.from_user_fullname+'" width = "32" src="' + shared_data.from_user_image + '" />';
			wall_post += '</a>';
    		
    		//Short profile view popup holder
			wall_post += '<div id="view-outer_'+shared_data.from_user_id+'" class="quickview-outer" popup-state="off" style="display:none;">';
			wall_post += '<div class="popupArrow">';
			wall_post += '<img width="36" height="22" src="'+IMAGE_PATH+'/arrow-purple2.png">';
			wall_post += '</div>';
			wall_post += '<div id="view_'+shared_data.from_user_id+'" class="quickview"> </div>';
			wall_post += '</div>';
			
			wall_post += '</div>';
			wall_post += '</div>';
			wall_post += '<div class="share-link-detail">';
			wall_post += '<h4></h4>';
			if( shared_data.from_user_user_type != 5 )//Admin type
			{
				wall_post += '<p> <a class="text-purple2 fnt-bold" href="/'+PROJECT_NAME+'profile/iprofile/id/'+shared_data.from_user_id+'" >'+shared_data.from_user_fullname+'</a> <img src="'+IMAGE_PATH+'/status-arrow.png" width="" height="" /> <a class=" fnt-bold text-purple2" href="/'+PROJECT_NAME+'profile/iprofile/id/'+user_id+'" >'+user_full_name+'</a></p>';
				//wall_post += '<p> <a class="text-purple2 fnt-bold" href="profile/iprofile/id/'+shared_data.from_user_id+'" >'+shared_data.from_user_fullname+'</a> <img src="'+IMAGE_PATH+'/status-arrow.png" width="" height="" /> <a class=" fnt-bold text-purple2" href="profile/iprofile/id/'+user_id+'" >'+user_full_name+'</a></p>';
			}
			else
			{
				wall_post += '<p> <a class="text-purple2 fnt-bold" style = "cursor:default;" href="javascript:void(0);" >'+shared_data.from_user_fullname+'</a> <img src="'+IMAGE_PATH+'/status-arrow.png" width="" height="" /> <a class=" fnt-bold text-purple2" href="/'+PROJECT_NAME+'profile/iprofile/id/'+user_id+'" >'+user_full_name+'</a></p>';
			}	
			
			
			wall_post += '<p class="shared_link_from_wall_to_wall">';
//			wall_post += '<a href="'+shared_data.from_user_wall_text+'">';
			wall_post += shared_data.from_user_wall_text;
//			wall_post += '</a>';
			wall_post += '</p>';
			var shared_url_href = $(shared_data.from_user_wall_text).attr('href');
			wall_post += "<a target='_blank' href='"+shared_url_href+"'>";
			wall_post += '<div class="link-outer shared_link_from_wall_to_wall">';
			if(url_json.image_src != null)
			{
				wall_post += '<div class="link-img shared_link_from_wall_to_wall">';
				wall_post += '<img width="50" height="50" src="'+url_json.image_src+'">';
				wall_post += '</div>';
			}
			wall_post += '<div class="link-detail shared_link_from_wall_to_wall">';
//			wall_post += '<a class="url_title text-dark-purple">'+url_json.url_title+'</a>';
			wall_post += '<p class="url_title text-dark-purple">'+showCroppedText( url_json.url_title, 34 )+'</p>';
			wall_post += '<p>'+showCroppedText( url_json.url_content, 160 )+'</p>';
			wall_post += '</div>';
			wall_post += '</div>';
			wall_post += '</a>';
			
			wall_post += '</div>';
			wall_post += '</div>';
			wall_post += '</div>';
		}
	}
	
	if( post_update_type == 13 ) //Shared profile URL
	{
		
		if( shared_data )
		{
			wall_post += '<div class="shared-link-outernew">';
			wall_post += '<div class="share-link-outer">';
			
			wall_post += '<div class="share-link-img">';
			wall_post += '<div class = "short_profile_border share-link-img2" style="">';
			
			
			var parameter_json = "{'user_id':"+shared_data.from_user_id+"}";
			wall_post += '<a disable-border="1" id="'+shared_data.from_user_id+'" title = "'+shared_data.from_user_fullname+'" href = "javascript:" onclick="getShortProfile(this,'+parameter_json+')" >';
			wall_post += '<img title = "'+shared_data.from_user_fullname+'" width = "32" src="' + shared_data.from_user_image + '" />';
			wall_post += '</a>';
			
			//Short profile view popup holder
			wall_post += '<div id="view-outer_'+shared_data.from_user_id+'" class="quickview-outer" popup-state="off" style="display:none;">';
			wall_post += '<div class="popupArrow">';
			wall_post += '<img width="36" height="22" src="'+IMAGE_PATH+'/arrow-purple2.png">';
			wall_post += '</div>';
			wall_post += '<div id="view_'+shared_data.from_user_id+'" class="quickview"> </div>';
			wall_post += '</div>';
			
			
			wall_post += '</div>';
			wall_post += '</div>';
			
			
			wall_post += '<div class="share-link-detail">';
			wall_post += '<h4></h4>';
			if( shared_data.from_user_user_type != 5 )//Admin type
			{
				wall_post += '<p> <a class="text-purple2 fnt-bold" href="/'+PROJECT_NAME+'profile/iprofile/id/'+shared_data.from_user_id+'" >'+shared_data.from_user_fullname+'</a> <img src="'+IMAGE_PATH+'/status-arrow.png" width="" height="" /> <a class=" fnt-bold text-purple2" href="/'+PROJECT_NAME+'profile/iprofile/id/'+user_id+'" >'+user_full_name+'</a></p>';
				//wall_post += '<p> <a class="text-purple2 fnt-bold" href="profile/iprofile/id/'+shared_data.from_user_id+'" >'+shared_data.from_user_fullname+'</a> <img src="'+IMAGE_PATH+'/status-arrow.png" width="" height="" /> <a class=" fnt-bold text-purple2" href="profile/iprofile/id/'+user_id+'" >'+user_full_name+'</a></p>';
				
			}
			else
			{
				wall_post += '<p> <a class="text-purple2 fnt-bold" style = "cursor:default;" href="javascript:void(0);" >'+shared_data.from_user_fullname+'</a> <img src="'+IMAGE_PATH+'/status-arrow.png" width="" height="" /> <a class=" fnt-bold text-purple2" href="/'+PROJECT_NAME+'profile/iprofile/id/'+user_id+'" >'+user_full_name+'</a></p>';
			}	
			
			wall_post += '<p class="shared_link_from_wall_to_wall">';
//			wall_post += '<a href="'+shared_data.from_user_wall_text+'">';
			wall_post += shared_data.from_user_wall_text;
//			wall_post += '</a>';
			wall_post += '</p>';
			var shared_url_href1 = $(shared_data.from_user_wall_text).attr('href');
			wall_post += '<a href="'+shared_url_href1+'">';
			wall_post += '<div class="link-outer shared_link_from_wall_to_wall">';
			if(url_json.image_src != null)
			{
				wall_post += '<div class="link-img shared_link_from_wall_to_wall">';
				wall_post += '<img width="50" height="50" src="'+url_json.image_src+'">';
				wall_post += '</div>';
			}
			wall_post += '<div class="link-detail shared_link_from_wall_to_wall">';
//			wall_post += '<a class="url_title text-dark-purple">'+url_json.url_title+'</a>';
			wall_post += '<p class="url_title text-dark-purple">'+showCroppedText( url_json.url_title, 34 )+'</p>';
			wall_post += '<p>'+showCroppedText( url_json.url_content, 160 )+'</p>';
			wall_post += '</div>';
			wall_post += '</div>';
			wall_post += '</a>';
			
			wall_post += '</div>';
			wall_post += '</div>';
			wall_post += '</div>';
		}
	}
	
	//wallpost edit/delete popup start-------
	if( user_id == $("input[type=hidden]#my_user_id").val() )
	{
		wall_post += '<div class="dashboard-sharelink-arrow">';
		wall_post += '<img onclick = "showEditDeleteOptionsForWallpost(this)" src="'+IMAGE_PATH+'/arrow-down2.png" style = "cursor : pointer" />';
		
		wall_post += '<div class="option-pop2" style="">';
		wall_post += '<a href="javascript:;" class="full-screen-view" onclick = "confirmToDelete( this, '+wallpost_id+' )">Delete<span style="margin-left: 5px;" class = "loading">&nbsp;</span></a>';
		if( post_update_type == 7 || post_update_type == 6 || post_update_type == 0 || post_update_type == 13 )
		{
			wall_post += '<a href="javascript:;" class="full-screen-view" onclick = "showWallpostEditBox( this, '+wallpost_id+' )">Edit Post<span style="margin-left: 5px;" class = "loading">&nbsp;</span></a>';
		}	
		wall_post += '</div>';
		
		wall_post += '</div>';
	}
	//wallpost edit/delete popup end-------
	
	wall_post += '</div>';
	
	if( post_update_type == 0 )//Simple text
	{
		wall_post += '<p id = "'+wallpost_id+'" class = "editable simple_text simple_text_'+wallpost_id+'">';
		wall_post += '<span class = "wallpost_text_cropped" id = "'+wallpost_id+'">'+showCroppedText( wall_post_text, 750, '...<label onclick="showFullWallpostText(this)">See More</label>' )+'</span>';
		wall_post += '<span class = "wallpost_text_full" id = "'+wallpost_id+'">'+wall_post_text+'</span>'; 
		wall_post += '</p>';
		
		wall_post += '<div class = "wallpost_editor" id = "'+wallpost_id+'">';
		wall_post += '<textarea>' + wall_post_text + '</textarea>';
		wall_post += '<div class="wall-editor-btn">';
		wall_post += '<input class="btn-purple" type = "button" name = "save" value = "Done Editing" id = "'+wallpost_id+'" onclick = "saveWallpostEditing( this, '+wallpost_id+' )">';
		wall_post += '<a class="new-cancel-btn" id = "'+wallpost_id+'" onclick = "cancelWallpostEditing( this, '+wallpost_id+' )" href="javascript:;">Cancel</a>';
		wall_post += '</div>';
		wall_post += '</div>';
	}

	else if ( post_update_type == 1 || post_update_type == 8 ) //URL or news URL
	{
		wall_post += '<div class="dashboard-sharelink-data">';
		
		wall_post += '<p>';
		wall_post += '<span class = "wallpost_text_cropped" id = "'+wallpost_id+'">'+showCroppedText( wall_post_text, 750, '...<label onclick="showFullWallpostText(this)">See More</label>' )+'</span>';
		wall_post += '<span class = "wallpost_text_full" id = "'+wallpost_id+'">'+wall_post_text+'</span>';
		wall_post += '</p>';

		var vurl = $(wall_post_text).attr("href");

		wall_post += "<a target'_blank' href='"+vurl+"'>";
		wall_post += '<div class="link-outer">';
		if( url_json.image_src )
		{
			wall_post += '<div class="link-img">';
			wall_post += '<img  src="'+url_json.image_src+'">';   
			wall_post += '</div>';
		}	
		wall_post += '<div class="link-detail">';
//		wall_post += '<a target="_blank" class = "url_title text-dark-purple" href = "'+vurl+'">'+url_json.url_title+'</a>';
		
		wall_post += '<p class="url_title text-dark-purple" >'+showCroppedText( url_json.url_title, 34)+'</p>';
		wall_post += '<p>'+showCroppedText( url_json.url_content, 160 )+'</p>';
		wall_post += '</div>';
		wall_post += '</div>';
		wall_post += '</a>';
		wall_post += '</div>';
	}
	else if ( post_update_type == 12 )//Profile URL
	{
		wall_post += '<div class="dashboard-sharelink-data">';
		
		wall_post += '<p>';
		wall_post += '<span class = "wallpost_text_cropped" id = "'+wallpost_id+'">'+showCroppedText( wall_post_text, 750, '...<label onclick="showFullWallpostText(this)">See More</label>' )+'</span>';
		wall_post += '<span class = "wallpost_text_full" id = "'+wallpost_id+'">'+wall_post_text+'</span>';
		wall_post += '</p>';
		
		var vurl = $(wall_post_text).attr("href");
		wall_post += '<a target="_blank" href="'+vurl+'">';
		wall_post += '<div class="link-outer">';
		if( url_json.image_src )
		{
			wall_post += '<div class="link-img">';
			wall_post += '<img  src="'+url_json.image_src+'">';   
			wall_post += '</div>';
		}	
		wall_post += '<div class="link-detail">';
//		wall_post += '<a target="_blank" class = "url_title text-dark-purple" href = "'+vurl+'">'+url_json.url_title+'</a>';
		wall_post += '<p class="url_title text-dark-purple" >'+showCroppedText( url_json.url_title, 34 )+'</p>';
		wall_post += '<p>'+showCroppedText( url_json.url_content, 160 )+'</p>';
		wall_post += '</div>';
		wall_post += '</div>';
		wall_post += '</a>';
		wall_post += '</div>';
	}
	
	//OK-Comment-Share Section starts----------
	if( is_ok_comment_share_pannel_visible )
	{
		wall_post += '<div class="news-likes">';
		wall_post += '<div class="fl">';
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
		wall_post += '<div style = "display:inline-block; float: right;" class = "like_count">';
		if( like_count > 0 )
		{
			wall_post += '<a href="javascript:;" onclick = "openWhoLikedPopupByWallpostID(' + wallpost_id + ')" >('+ like_count +')</a>';
		}
		else
		{
			wall_post += '<a href="javascript:;" style = "display : none;" onclick = "openWhoLikedPopupByWallpostID(' + wallpost_id + ')" >('+ 0 +')</a>';
		}
		wall_post += '</div>';
		wall_post += '</div>';
		
		wall_post += '<div class="comments">';
			
		if( comment_count > 0 )
		{
			wall_post += '<a href="javascript:;" class = "add_comment" >Comment</a><span id = "comment_count_'+wallpost_id+'" >('+comment_count+')</span>';
		}
		else
		{
			wall_post += '<a href="javascript:;" class = "add_comment" >Comment</a><span id = "comment_count_'+wallpost_id+'"></span>';
		}
			
		wall_post += '</div>';
		wall_post += '<div class="share">';
			 
		wall_post += '<a href="javascript:;" onclick="shareThisPost( '+wallpost_id+', this )" ><span>&nbsp;</span>Share </a>';
		if(share_count != "null" && share_count > 0)
		{
			wall_post += ' <span>&nbsp;<a href="javascript:;" id="share_count_'+wallpost_id+'" onclick="getSharedPhotoListByWallpostId('+wallpost_id+','+user_id+');" >('+share_count+')</a></span>';	
		}
		else
		{
			wall_post += ' <span>&nbsp;<a href="javascript:;" id="share_count_'+wallpost_id+'" onclick="getSharedPhotoListByWallpostId('+wallpost_id+','+user_id+');" ></a></span>';
		}
			
		wall_post += '</div>';
		wall_post += '</div>';
	
		wall_post += '</div>';
	}
	else
	{
		wall_post += '<p style="float:left; width:100%;">&nbsp;</p>';
	}
	//OK-Comment-Share Section Ends----------
	
	wall_post += '</div>';
	
	wall_post += '<div class="comment-box-outer ">';

	
	//likers string.
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
	    	wall_post += '<div class="ok-comment-box-bot-right" style = "cursor:pointer;" onclick = "loadMoreComments('+wallpost_id+',this, event)" > View more comments</div>';
	    	wall_post += '</div>';
	    }
		    
	    wall_post += '<div id="comments_outer_'+wallpost_id+'">';
		    
	    for( j in comments_json )
	    {
	    	if( comments_json[j]['is_hidden'] == 0 )
	    	{
	    		wall_post += '<div class="comments-outer comments-outer_'+comments_json[j]['id']+'">';
			    
		    	//wall_post += '<a href = "/'+PROJECT_NAME+'profile/iprofile/id/'+comments_json[j]['user_id']+'"><div class="img" title = "'+comments_json[j]['user_name']+'"><img src="' + comments_json[j]['user_prof_image_path'] + '" width="" height="" /></div></a>';
			    
	    		var parameter_json = "{'user_id':"+comments_json[j]['user_id']+"}";
	    		wall_post += '<a disable-border="1" id="'+comments_json[j]['user_id']+'" title = "'+comments_json[j]['user_name']+'" href = "javascript:" onclick="getShortProfile(this,'+parameter_json+')" >';
	    		wall_post += '<div class="img img32 short_profile_border" title = "'+comments_json[j]['user_name']+'"><img src="' + comments_json[j]['user_prof_image_path'] + '" width="" height="" /></div>';
	    		wall_post += '</a>';
	    		
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
		    	wall_post += '</div> ';
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
	    		wall_post += '<div id="comments-outer_'+comments_json[j]['id']+'" class="comments-outer hidden_comment comment-outer-popup-border" rel="'+comments_json[j]['id']+'"><span rel="'+comments_json[j]['id']+'" class="unhide-comment" title = "Hidden Comment [Hidden on your wall]">...</span></div>';
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
		wall_post += '<div class="comment-write-outer ">';
		wall_post += '<form id = "comment_box_'+wallpost_id+'">';
		wall_post += '<input type = "hidden" name = "wallpost_id" value = "'+wallpost_id+'"/>';
		wall_post += '<div class="comment-write-left ">';
		wall_post += '<img width="" height="" src="' + $("input[type=hidden]#my_small_image").val() + '">';
		wall_post += '</div>';
		wall_post += '<div class="comment-write-right ">';
		wall_post += '<textarea name="comment" maxlength="255" class="comment-textarea" placeholder = "Write a comment..." onkeydown="javascript: if(event.keyCode == 13) addComment( '+wallpost_id+', this, event );"></textarea>';
		wall_post += '<div class="enter-post">';
		wall_post += 'Press Enter to Post';
		wall_post += '</div>';
		wall_post += '</div>';
		wall_post += '</form>';
		wall_post += '</div>';
	}
	//  write comment Ends
		
	wall_post += '</div>';
	wall_post += '</div>';
	return wall_post;
}*/

/**
 * Delete post.
 * @param elem(element to be clicked to delete post)
 * @param wallpost_id(post to be delete)
 * @author unknown
 */
function deleteCollageTypeWallpost( elem, wallpost_id )
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
				showDialogMsg( "Deleting", "Post deleted successfully.", 2000, 
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
				//window.location.href="/" + PROJECT_NAME + "/post/detail/id/"+ wallpost_id;
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
 * Delete post.
 * @param elem (element to be clicked to delete post)
 * @param wallpost_id(post to be delete)
 * @author unknown
 */
function deleteWallpost( elem, wallpost_id )
{
	$(elem).children('span.loading').html("<img src = '"+IMAGE_PATH+"/tiny_loader.gif'>");
	$(elem).parents('div.option-pop2').hide();
	$("div.news-update-content[rel="+wallpost_id+"]").css({'opacity':0.4 });
	jQuery.ajax({
		url: "/" + PROJECT_NAME + "dashboard/delete-wallpost",
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
				
				showDefaultMsg( "Post deleted.", 1 );
				//window.location.href="/" + PROJECT_NAME + "/post/detail/id/"+ wallpost_id;
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
 * function used to click on close button in the People You May Know section...
 * Author: Sunny patial
 * version: 1.0
 */
function clickCloseYouMayKnowButton(){
	$('.youmay-know-cross').click(function(){
		var uid = $(this).attr("rel");
		// hide div on dashboard.. slowly slowly
		$('div.you-may-know-column_'+uid).hide("slow");
		// check div is hide or not..
		// $(".invite-mails-outer").is(":visible")
		if($(".you-may-input").is(":visible")==false && $(".invite-mails-outer").is(":visible")==true){
			$(".you-may-input").show();
		}
		if($(".invite-mails-outer").is(":visible")==false){
			$(".invite-mails-outer").show();
		}
	});
}

/**
 * Used to show full comment and hide cropped comment.
 * 
 * @param elem (The elememt which will be click)
 * @author jsingh7
 */
function showFullComment(elem)
{
	$(elem).parents("div.comment_text").hide();
	$(elem).parents("div.comment_text").siblings("div.full_comment_text").fadeIn();
}

/**
* common function used to invite users to link on like and share popups 
 * Author: sjaiswal
 * version: 1.0
 */
function invitationToLinkOnDashboard(acceptUserId, elem)
{
	var thiss = $(elem);
	var idd = addLoadingImage( thiss, 'before', 'loading_small_purple.gif');
	thiss.hide();
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "dashboard/invite-to-connect", 
        type: "POST",
        dataType: "json",
        data: "accept_user="+acceptUserId,
        success: function(jsonData) {
        	var link_id = jsonData;
        	$("span#"+idd).remove();
        	var html = '';
        	html +='<a id="'+acceptUserId+'" class="cursor-style invite_'+acceptUserId+' cancel-request" title="cancel request" rel="'+link_id+'" onclick="cancelRequestFromDashboard(this)"">';
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
function cancelRequestFromDashboard(event){
	var profileID=event.id;
	// remove 'accept request' icon
	$('span#link_'+profileID+ ' a.invite_'+profileID).hide();
	var thiss = $(event);
	var idd = addLoadingImage( thiss, 'before', 'loading_small_purple.gif', 0, 34);
	thiss.hide();
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "dashboard/cancel-request",
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
        			html+='<a id="'+profileID+'" class="cursor-style invite_'+profileID+' invitation-request" title="Invite to Link" href="javascript:;" onclick="invitationToLinkOnDashboard('+profileID+', this);">';
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
function acceptRequestFromDashboard(event){
	var profileID=event.id;
	var acceptId=event.rel;
	// remove 'decline request' icon
	$('span#link_'+profileID+ ' a.decline_'+profileID).hide();
	var thiss = $(event);
	var idd = addLoadingImage( thiss, 'before', 'loading_small_purple.gif', 0, 34);
	thiss.hide();
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "dashboard/accept-request",
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
 * function used to enable save, cancel, show edit description events...
 * 
 * @author Sunny Patial
 */
function addDescriptionEditEvents(){
	// show text area event..
	$(".photo-desc").unbind();
	$(".photo-desc").click(function(){
		var photoID = $(this).attr("rel");
		$(".enter-photo-desc_"+photoID).fadeIn();
		$(this).hide();
	}); 
	// cancel event..
	$(".cancel-photo-desc").unbind();
	$(".cancel-photo-desc").click(function(){
		var photoID = $(this).attr("rel");
		$(".photo-desc_"+photoID).fadeIn();
		$("#photo-desc_"+photoID).val($("#hide-desc_"+photoID).val());
		$(".enter-photo-desc_"+photoID).hide();
	}); 
	// save event...
	$(".save-photo-desc").unbind();
	$(".save-photo-desc").click(function(){
		var photoID = $(this).attr("rel");
		savePhotoDescription(photoID);
	}); 
	
	// focus cursor to the comment box...
	$(".add_comment").unbind();
	$(".add_comment").click(function(){
		var photoID = $(this).attr("rel");
		$("#enter-comment_"+photoID).focus();
	}); 
	
}

/**
 * function  used to show  popup who liked the photo detail ..
 * @param int photo_id
 * @param int photo_posted_by_user_id
 * @param int login_user
 * @return string
 * @version 1.1
 * @author nsingh,sjaiswal.
 */
function openWhoLikedPhotoPopup( photo_id , photo_posted_by_user_id, login_user)
{
	$('#who_liked_listing_popup').bPopup(
	{
		modalClose: true,
	    easing: 'easeOutBack', //uses jQuery easing plugin
        speed: 500,
		closeClass : 'close_bpopup',
        zIndex : 13,
        onClose: function() {},
        onOpen: function() {
      	//Do required stuff...
      	$("div#list_of_who_liked").html("<div style = 'display : table-cell; height: 197px; width: 395px; text-align:center; vertical-align: middle;'><image src = "+IMAGE_PATH+"/loading_medium_purple.gif></div>");
      	jQuery.ajax({
              url: "/" + PROJECT_NAME + "profile/get-who-like-photo",
              type: "POST",
              dataType: "json",
              data: { 'photo_id' : photo_id ,'photo_posted_by_user_id' : photo_posted_by_user_id },
              timeout: 50000,
              success: function( jsonData ) {
              	var html = "<ol>";
              	for( i in jsonData )
              	{
              		html += '<div style="width: 100%;border-bottom:1px solid #ededed;padding-bottom:10px !important;" class="comments-outer">';
              		html += '<div title="'+jsonData[i]["user_full_names"]+'" class="img short_profile_border">';
              		html += '<div>';
              		html += '<img src = "'+jsonData[i]["user_image"]+'"/>';
              		html += '</div>';
              		html += '</div>';
              		
              		html += '<div class="text" style="width: 84%!important; float:left; word-wrap: break-word; margin-top:0px !important;">';
              		if( login_user == jsonData[i]["user_id"] )
              		{
	                		html += "<a href = '/"+PROJECT_NAME+"profile/iprofile/id/"+jsonData[i]["user_id"]+"' class = 'text-purple-link'>Me</a>";
              		}
              		else
              		{
	                		html += "<a href = '/"+PROJECT_NAME+"profile/iprofile/id/"+jsonData[i]["user_id"]+"' class = 'text-purple-link'>"+jsonData[i]["user_full_names"]+"</a>";
              		}
              	
              		html += '<span id="link_'+jsonData[i]["user_id"]+'" class="open_who_like_photodetail">';
              	switch ( jsonData[i]["link_info"].friend_type ) 
	            	{
						case 0:
							// case for inviting user
							if( login_user != jsonData[i]["user_id"] )
	                		{
								
								html +='<a id="linkToConnect_'+jsonData[i]["user_id"]+'" class="cursor-style invite_'+jsonData[i]["user_id"]+' invitation-request" title="Invite to Link" onclick="invitationToLinkOnPhotoDetail('+jsonData[i]["user_id"]+', this);">';
								html +='</a>';
	                		}
							else
							{
								html += '';                			
	                		}
						break;
						case 1:
							// when user revert back his/her link request
							html += '<span id="link_'+jsonData[i]["user_id"]+'" style = "color : #6C518F; float:right;margin-right:10px">';
							html +='<a id="'+jsonData[i]["user_id"]+'" rel="'+jsonData[i]["link_info"]["link_id"]+'" class="cursor-style invite_'+jsonData[i]["user_id"]+' cancel-request " title="Cancel Request" href="javascript:;" onclick="cancelRequestOnPhotoDetail(this)">';
			    			html +='</a>';
						break;
						case 2:
							// case for accepting or rejecting request by user
							html += '<span id="link_'+jsonData[i]["user_id"]+'" style = "color : #6C518F; float:right;margin-right:10px">';
							html +='<a id="'+jsonData[i]["user_id"]+'" rel="'+jsonData[i]["link_info"]["link_id"]+'" class="cursor-style invite_'+jsonData[i]["user_id"]+' accept-request" title="Accept Request" onclick="acceptRequestOnPhotoDetail(this);" href="javascript:;">';
							html +='</a>';	
							html +='<a id="'+jsonData[i]["user_id"]+'" rel="'+jsonData[i]["link_info"]["link_id"]+'" class="cursor-style decline_'+jsonData[i]["user_id"]+' decline-request" title="Decline Request" onclick="cancelRequestOnPhotoDetail(this);" href="javascript:;">';
							html +='</a>';
						break;
						case 3:
							// case when request is accepted and user can send mail to his linked user
							if( $("input[type=hidden]#my_user_id").val() != jsonData[i]["user_id"] )
	                		{
								html += '<span id="link_'+jsonData[i]["user_id"]+'" style = "color : #6C518F; float:right;margin-right:10px;">';
								html +='<a class="cursor-style compose-mail" title="Send Mail" href="'+ PROJECT_URL + PROJECT_NAME +'mail/compose#to_user:'+jsonData[i]["user_id"]+'">';
					    		html +='</a>';
	                		}
							else
							{
								html += '';  
							}
							break;
						default:
							html += 'link status not found!';
						break;
					}
	            	html += '</span></div>';
	            	html += '</div>';
              	}
              	html += "</ol>";
              	$("div#list_of_who_liked").html(html);
              },
              error: function(xhr, ajaxOptions, thrownError) {

              }
      	});
      }
	},
	function() {
		//Do required stuff...
	});
}

//Show privacy options for wallpost.
function showPrivacyOptions(elem)
{
	$(elem).siblings("div.option-pop").fadeIn();

	if( $(elem).parent().siblings("p").children("img.privacy_icon") );
	
	switch ( $(elem).parent().siblings("p").children("img.privacy_icon").attr("src") ) 
	{
		case IMAGE_PATH+"/privacy_links_grey.png" :
			$(elem).parent().siblings("p").children("img.privacy_icon").attr("src", IMAGE_PATH+"/privacy_links_purple.png")
		break;
		case IMAGE_PATH+"/privacy_public_grey.png" :
			$(elem).parent().siblings("p").children("img.privacy_icon").attr("src", IMAGE_PATH+"/privacy_public_purple.png")
			break;
		case IMAGE_PATH+"/privacy_links_of_links_grey.png" :
			$(elem).parent().siblings("p").children("img.privacy_icon").attr("src", IMAGE_PATH+"/privacy_links_of_links_purple.png")
			break;
		
		default:
			break;
	}
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
			if( jsonData > 0 )
			{
				$("div#comments-outer"+comment_id).remove();
				
				var numItems = $('div#comment_box_'+jsonData+' div.comments-outer').length;
				var seeMoreDiv = $('div#comment_box_'+jsonData+' div.ok-comment-box-bot-right').length ;
				
				if(numItems == 0 && seeMoreDiv == 0){
					$('div#comment_box_'+jsonData).hide();
				}
				
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
			$(thisss).parents("div.comments-outer").slideDown();
			alert("Comment not deleted. Please try agian.");
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
 * Activate action controls for comments[edit, delete, hide] for pop up
 * They start working according to mouse actions.
 * 
 * @author dsingh
 */
function activateCommentPopUpActions(wallpost_id)
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
    					$('div.text p#idd_'+jsonData.id+'_popUp').text( jsonData.text );
    					$('div.text p#idd_'+jsonData.id).text( jsonData.text );
    					 
    					$('div.text p#idd_'+jsonData.id+'_popUp').fadeIn();
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
	    			html += '<div class="collage2-pic1"><img rel_width = "200" rel_height = "160" onclick="" src="'+photos_arr[0].image_path+'" class = "single_image" alt=""/></div>';
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
	    				html += '<div class="collage2-pic3-div-four "><img rel_width = "95" rel_height = "80" class = "small_jquerynailthumb"  src="'+photos_arr[2].image_path+'" alt=""/></div>';
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
	    				html += '<div class="collage2-pic4-div-one"><img rel_width = "100" rel_height = "77" class = "small_jquerynailthumb"  src="'+photos_arr[0].image_path+'" alt=""/></div>';
	    				html += '<div class="collage2-pic4-div-two"><img rel_width = "95" rel_height = "77"  class = "small_jquerynailthumb"  src="'+photos_arr[1].image_path+'" alt=""/></div>';
	    				html += '<div class="collage2-pic4-div-one"><img rel_width = "100" rel_height = "77"  class = "small_jquerynailthumb"  src="'+photos_arr[2].image_path+'" alt=""/></div>';
	    				html += '<div class="collage2-pic4-div-two"><img rel_width = "95" rel_height = "77"  class = "small_jquerynailthumb"  src="'+photos_arr[3].image_path+'" alt=""/></div>';
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
 * function to abuse wallpost by current user on post detail page
 * @params post_id 
 * @params wallpost_owner_id
 * @author sjaiswal
 * version 1.0
 */

function abuseReportWallPost(post_id,wallpost_owner_id)
{
	var ids = addLoadingImage($("div.report-abuse."+post_id+""), 'after', 'loading_small_purple.gif',0 ,11 );
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "post/abuse-report",
        type: "POST",
        dataType: "json",
        data: {"post_id" :post_id  ,"wallpost_owner_id" :wallpost_owner_id},
        timeout: 50000,
        success: function(jsonData) {
        	$("span#"+ids).remove();
        	$("[name=abuse_"+post_id+"]").removeAttr("onclick");
        	$("div.abuse-text."+post_id).html("Reported as abuse");
        	
        },
        error: function(xhr, ajaxOptions, thrownError) {
        	alert("Server Error.");
		}
	 });
}

/**
 * Shares the selected wallpost on the wall. 
 * 
 * @param wallpost_id
 * @author jsingh7
 * @author spatial
 * @version 1.0
 */
function sharePhotofeedFromWall(wallpost_id, wallpost_from_user_id, elem)
{
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
					//$('div.share_count span#wallpost_'+wallpost_id).html('('+jsonData.share_count_of_post+')');
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
					
					//Updating share count of the post from which we are sharing this post.
					$("div.share span a#share_count_"+wallpost_id).text("("+jsonData.share_count_of_post+")");
					
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
				/*	jQuery.ajax({
						url: "/" + PROJECT_NAME + "socialise/send-share-notification",
						type: "POST",
						dataType: "json",
						data: { 'wallpost_id' : wallpost_id },
						success: function(jsonData)
						{
							
						}
					});
					*/
					
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



