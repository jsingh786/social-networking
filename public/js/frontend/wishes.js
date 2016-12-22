var ok_notOK_call_1;
var comment_edit_ajax_call;
var comment_delete_ajax_call;
var comment_hide_ajax_call;

$(document).ready(function()
{
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
});

/**
 * Fetch more records of wishes
 * according to offset and limit sent.
 * @param element
 * @author hkaur5
 */
function loadMoreWishes(element)
{
	$(element).hide();
	
	$('div.see_more_wishes').html('<img class="loading_options" style="" src="'+IMAGE_PATH+'/loading_medium_purple.gif"/>');
	var offset = $("input#wishes_offset").val();
	var limit = $("input#wishes_recordLimit").val();
	
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "wishes/load-more-wishes",
        type: "POST",
        dataType: "json",
        data : { 'offset':offset, 'limit':limit  },
        success: function(jsonData) 
        {
        	$('div.see_more_wishes').hide();
        	if(jsonData)
    		{
        		var html = "";
        		for ( i in jsonData.data)
        		{
	        		html +='<div class = "wish-content-outer">';
	        		
	        		switch(jsonData.data[i]['type'])
	        		{
	        			
	        		//new link wish.
	        		case 1:
	        			html +='<div class="no-pointer wish-data icon-add-people" id="'+jsonData.data[i]["wish_id"]+'">';
	        			html +='<div class="wish-data-lt">';
	        			html +='<img alt="" width="40" height="40" src="'+jsonData.data[i]["wish_about_user_prof_photo"]+'">';
	        			html +='</div>';
	        			
	        			html +='<div class="wish-data-rt">';
	        			html +='<div class="wish-data-rt-text">';
	        			html +='<a class="text-purple2-link wish_about_user_name" href="/'+PROJECT_NAME+jsonData.data[i]["wish_about_user_username"]+'">';
	        			html +=jsonData.data[i]["wish_about_user_name"] ;
	        			html +='</a>';
	        			html +=' has a new <a class="text-purple2-link" href="javascript:;">Link';
	    				html +='</a>';
						html +='</div>';
						html +='<div class="wish-data-rt-img">';
						html +='<div class="icon-add-people">';
						html +='</div>';
						html +='</div>';
						html +='<div class="wish-data-rt2-outer" >';
						html +='<div class="wish-data-rt2">';
						html +='<div class="wish-data-rt2-lt">';
						html +='<a class="new_link_user" href="'+jsonData.data[i]["new_link_username"]+'">';
		                html +='<h4 style="color:#6C518F !important">';
		                html +=jsonData.data[i]["new_link_name"]; 
		                html +='</a>';
		                html +='</h4>';
	
	
	
	                	if( jsonData.data[i]["new_link_prof_info"] )
	                    {
	
	                		html +='<p style="color:black !important;">';
	
	                		html +=jsonData.data[i]["new_link_prof_info"][0]+' at '+jsonData.data[i]["new_link_prof_info"][1]; 
	
	                        html +='</p>';
	                        html +='<p style="color:black !important;">';
	 
	                        html +=jsonData.data[i]["new_link_prof_info"][2];
	
	                        html +='</p>';
	
	                    }
	
	                    html +='</div>';
	                    html +='<div class="wish-data-rt2-rt">';
	                    html +='<img width="40" height="40" alt="" src="'+jsonData.data[i]["new_link_prof_photo"]+'">';
	                    html +='</div>';
	                    html +='</div>';
	                    html +='</div>';
	                    html +='</div>';
	                    
	                    html +='<div class="wish-bot-text">';
	                    html +='</div>';
	                    html +='</div>';
	        			break;
	        		case 2:
	        			// new job wish.
	        			html +='<div class="wish-data icon-bag" id="'+jsonData.data[i]["wish_id"]+'" onclick = "populateWishPopup( '+jsonData.data[i]['wish_id']+' )">';
	        			html +='<div class="wish-data-lt">';
	        			html +='<img width="40" height="40" alt="" src="'+jsonData.data[i]['wish_about_user_prof_photo']+'">';
	        			html +='</div>';
	        			html +='<div class="wish-data-rt">';
	        			html +='<div class="wish-data-rt-text">';
	        			html +='<a class="text-purple2-link wish_about_user_name" href="javascript:;">';
	        			html +=jsonData.data[i]['wish_about_user_name'] ;
	        			html +='</a>';
	        			html +=' has a new <a class="text-purple2-link" href="javascript:;"> Job</a>';
	        			html +='</div>';
	        			html +='<div class="wish-data-rt-img">';
	        			html +='</div>';
	        			html +='<div class="wish-bot-text">'+jsonData.data[i]['wish_underlying_text']+'</div>';
	        			html +='</div>';
	        			html +='</div>';
	        			break;
	        		case 3:
	        			// work anniversary.
	        			html +='<div class="wish-data icon-anniversary" id="'+jsonData.data[i]["wish_id"]+'" onclick = "populateWishPopup( '+jsonData.data[i]["wish_id"]+' )">';
	    				html +='<div class="wish-data-lt">';
						html +='<img width="40" height="40" alt="" src="'+jsonData.data[i]["wish_about_user_prof_photo"]+'">';
	        			html +='</div>';
	    				html +='<div class="wish-data-rt">';
						html +='<div class="wish-data-rt-text">';
						html +='<a class="text-purple2-link wish_about_user_name" href="javascript:;">';
						html +=jsonData.data[i]["wish_about_user_name"];
						html +='</a>';
						html +=' having a work Anniversary';
						html +='</div>';
						html +='<div class="wish-data-rt-img">';
						html +='<div class="icon-anniversary">';
						html +='</div>';
	        			html +='</div>';
						html +='<div class="wish-bot-text">'+jsonData.data[i]["wish_underlying_text"];
						html +='</div>';
						html +='</div>';
						html +='</div>';
						break;
	        		case 5:
	        			// Celebrating birthday wish.
	        			html +='<div class="wish-data icon-bday" id="'+jsonData.data[i]["wish_id"]+'" onclick = "populateWishPopup( '+jsonData.data[i]["wish_id"]+' )">';
	        			html +='<div class="wish-data-lt">';
	        			html +='<img width="40" height="40" alt="" src="'+jsonData.data[i]["wish_about_user_prof_photo"]+'">';
	        			html +='</div>';
	        			html +='<div class="wish-data-rt">';
	        			html +='<div class="wish-data-rt-text">';
	        			html +='<a class="text-purple2-link" href="javascript:;">';
	        			html +=jsonData.data[i]["wish_about_user_name"] ;
	        			html +='</a>';
	        			html +=' celebrating Birthday Today ';
	        			html +='</div>';
	    				html +='<div class="wish-data-rt-img">';
	    				html +='<div class="icon-bday"></div>';
	        			html +='</div>';
	        			html +='<div class="wish-bot-text">'+jsonData.data[i]["wish_underlying_text"]+'</div>';
	        			html +='</div>';
	        			html +='</div>';
	        			html +='</div>';
					
	        		}
        		
	        		//Wish Popup Starts
	        		html +='<div class="wish-pop-outer" id = "'+jsonData.data[i]["wish_id"]+'">';
	        		html +='<div class="wish-pop-arrow">';
	        		html +='<img width="36" height="22" src="'+IMAGE_PATH+'/arrow-purple2.png">';
	        		html +='</div>';
	
	        		html +='<div class="wish-pop-bot" id = "wish_'+jsonData.data[i]["wish_id"]+'" >';
	       			html +='</div>';
	    			html +='</div>';
	    			
//	        		//Wish Popup Ends.
	    			html +='</div>';
	    			$("input#wishes_offset").val( parseInt(offset)+parseInt(limit) );
        		}
        		$('div.wish-outer').append(html);
    		}
        	else
        	{
        	}
			if(jsonData.is_more)
			{
				var see_more_html ="";
				see_more_html += '<div class="see_more_wishes job-content view_more">';
				see_more_html += '<p class="see_more_wishes_p">';
				see_more_html += '<a href="javascript:;" onclick="loadMoreWishes(this);" class="see_more_wishes_text text-dark-purple">';
				see_more_html += 'Show More';
				see_more_html += '</a>';
				see_more_html += '</p>';
				see_more_html += '</div>';
				$('div.main_outer_div').append(see_more_html);
			}
       
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
														html += '<div style="bottom: -85px; width: 78px; padding: 5px; right: -7px; text-align: left; z-index: 1; display: none;" class="edit-popup-outer">';
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
							html += '<div style="bottom: -85px; width: 78px; padding: 5px; right: -7px; text-align: left; z-index: 1; display: none;" class="edit-popup-outer">';
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
//		if($(this).children( "div.edit-popup-outer" ).hide().is('visible'))
//		{
//			alert("hide");
//			$(this).children( "div.edit-popup-outer" ).hide();
//		}
//		else
//		{
//			alert('show');
//			$(this).children( "div.edit-popup-outer" ).show();
//		}
		$(this).children( "div.hide_comment" ).show();
	});
	
	$( "div.comments-outer").unbind( "mouseleave" );
	$("div.comments-outer").mouseleave(function(){
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
	
	//pressing enter key on edit commnet textarea.
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
    					
    					$('div.text div#'+jsonData.id+'.comment_text').text( jsonData.text );
    					$('div.text div#'+jsonData.id+'.comment_text').fadeIn();
//    					$('div.text div#'+jsonData+'.comment_text1').text( $(thiss).val() );
//    					$('div.text div#'+jsonData+'.comment_text1').fadeIn();
    					 
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
		if($(this).attr("status")){
			$(this).parents("div.comments-outer").css("opacity",0.3);
			var thisss = this;
			var comment_id = $(this).siblings("div.text").children("div.comment-text1").attr("rel");
			$(thisss).parents("div.comments-outer").addClass("hidden_comment");
			$(thisss).parents("div.comments-outer").css("opacity",1);
			$(thisss).parents("div.comments-outer").html('<span rel="'+comment_id+'" onclick="showComments(this);" class="unhide-comment" title = "Hidden Comment [Hidden on your wall]">...</span>');
			//showComments();
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
							$("div#comments-outer_"+comment_id+".comments-outer").html('<span onclick="showComments(this);" rel="'+comment_id+'" class="unhide-comment" title = "Hidden Comment [Hidden on your wall]">...</span>');
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
function showComments(elem){
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
		
//	});
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
        	comment += '<div style="bottom: -85px; width: 78px; padding: 5px; right: -7px; text-align: left; z-index: 1; display: none;" class="edit-popup-outer">';
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
        	
        	//Adding scroller after 6 comments because if we manage this only with css then it gives issue. 
        	if( jsonData.comment_count > 6 )
        	{
        		$("div.wish-data-outer ~ div.comment-box-outer  div.ok-comment-box div.ok-comment-box-bot div.comments_outer").css('overflow-y', 'auto');
        	}
        	
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
//        transition: 'slideDown',
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