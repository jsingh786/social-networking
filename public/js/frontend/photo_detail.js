$(document).ready(function(){
	
	//  close popup
	$('.close_popup').click(function()
	{
		$('div#who_liked_listing_popup').bPopup().close();
	});
	$('.close_popup_2').click(function()
	{
		$('div#comments_listing_popup').bPopup().close();
	});
	$('.close_popup_3').click(function()
	{
		$('div#share_photo_feed_popup').bPopup().close();
	});
	$('.close_popup_4').click(function()
	{
		$('div#who_shared_listing_popup').bPopup().close();
	});
	
	//Added by hkaur5
	//Call function to move photo to other
	$('div#movePhoto').on('click','input#movePicture',function()
	{
		movePicture(this);
	});
	
	//Added by hkaur5
	//Close move_to_other_album popup on click of cross.
	$('img.close_photo_popup').click(function()
	{
		$('div#movePhoto').bPopup().close();
	
	});
	
	//Added by hkaur5
	//Open popup to move photo to other album and call action  to fetch other albums of user.
	$('div#realImage').on('click','a.moveToAnotherAlbum',function()
	{
		getOtherAlbumsForUser(this);
	});
});


/** 
* @author Spatial
*/
function enabledLeftRightEvent(){
	$("body").unbind();
	$("body").keydown(function(e) {
		if($(".popup-wrapper").css("display")=="block" || $(".fullscreen-popup").css("display")=="block")
		{
			if(e.keyCode == 37) { // left
				$(".option-pop").hide();
				var photoID = $(".popup-arrow-lt").attr("photo-id");
				getPreviousPhotoDetail(photoID);
			  }
			  else if(e.keyCode == 39) { // right
				$(".option-pop").hide();
				var photoID = $(".popup-arrow-rt").attr("photo-id");
				getNextPhotoDetail(photoID);
			  }
		}
	});
}


/**
 * function used to show detail of the image with in the popup..
 * 
 * @author Spatial
 */
function getPhotoDetail( id, which_id, is_my_album_photo )
{
	if( which_id == "id_of_photo")
	{
		data = { "photo_id" : id };
	}
	else if( which_id == "id_of_wallpost" )
	{
		data = { "wallpost_id" : id };
	}
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "profile/get-photo-detail",
        type: "POST",
        dataType: "json",
        data: data,
        beforeSend: function(msg)
        {
        	__addOverlay();
        	$("#realImage").empty();
        	var img_html = '';
        	img_html = '<img src="/'+PROJECT_NAME+'public/js/overlay/overlay_image.gif">';
        	$("#realImage").html(img_html);
        	$("#fullImage").empty();
        	var img_html = '';
        	img_html = '<img src="/'+PROJECT_NAME+'public/js/overlay/overlay_image.gif">';
        	$("#fullImage").html(img_html);
        	$(".popup-lt-bot-lt").empty();
        },
        timeout: 50000,
        success: function(jsonData) 
        {
        	 __removeOverlay();
        	 
        	if( jsonData == 2 )
         	{
         		showDialogMsg( "Oops!", "Oops! This photo doesnot exist anymore.", 3000, {buttons:[{text:"OK",click:function(){$(this).dialog("close");}}],show:{effect:"fade"},hide:{effect:"fade"},dialogClass:"general_dialog_message",height:200,width:300} );
         		return;
         	}	
        	 //Check if photo is mine then only move to other album and make cover option will work.
        	if(jsonData.logined_user_details.id == jsonData.photo_poster_details.posted_by_user_id )
        	{
        		embedPopupWithImage( jsonData, 1 );
        	}
        	else
    		{
        		embedPopupWithImage( jsonData, 0 );
    		}
        }
	});
}
/**
 * function used to show next image detail with in the popup..
 * 
 * @author Sunny Patial
 */
function getNextPhotoDetail(photoID){
	jQuery.ajax({
		url: "/" + PROJECT_NAME + "profile/get-next-photo-detail",
		type: "POST",
		dataType: "json",
		data: { "photo_id" : photoID },
		beforeSend: function(msg){
        	$("#realImage").empty();
        	var img_html = '';
        	img_html = '<img src="/'+PROJECT_NAME+'public/js/overlay/overlay_image.gif">';
        	$("#realImage").html(img_html);
        	$("#fullImage").empty();
        	var img_html = '';
        	img_html = '<img src="/'+PROJECT_NAME+'public/js/overlay/overlay_image.gif">';
        	$("#fullImage").html(img_html);
        	$(".popup-lt-bot-lt").empty();
        },
		timeout: 50000,
		success: function(jsonData) {
			embedPopupWithImage(jsonData);
		}
	});
}
/**
 * function used to show previous image detail with in the popup..
 * 
 * @author Sunny Patial
 */
function getPreviousPhotoDetail(photoID){
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "profile/get-previous-photo-detail",
        type: "POST",
        dataType: "json",
        data: { "photo_id" : photoID },
        beforeSend: function(msg){
        	$("#realImage").empty();
        	var img_html = '';
        	img_html = '<img src="/'+PROJECT_NAME+'public/js/overlay/overlay_image.gif">';
        	$("#realImage").html(img_html);
        	$("#fullImage").empty();
        	var img_html = '';
        	img_html = '<img src="/'+PROJECT_NAME+'public/js/overlay/overlay_image.gif">';
        	$("#fullImage").html(img_html);
        	$(".popup-lt-bot-lt").empty();
        },
        timeout: 50000,
        success: function(jsonData) {
        	embedPopupWithImage(jsonData);
        }
	});
}
/**
 * function used to show bottom div of the Image POPUP
 * 
 * @author Sunny Patial
 */
function showPopupBottomDiv(photoID){
	$(".popup-lt-mid").hover(function() {
		$(".popup-lt-bot_"+photoID).css("display","block");
	});
	$(".popup-lt-mid").mouseleave(function() {
		$(".popup-lt-bot_"+photoID).css("display","none");
	});
}
/**
 * function used to show bottom Options, when user going to click on the Option text.
 * 
 * @author Sunny Patial
 */
function showOptionsDiv(photoID){
	$(".popup-lt-bot-lt_"+photoID).unbind();
	$(".popup-lt-bot-lt_"+photoID).click(function() {
		$(".option-pop_"+photoID).toggle();
	});
}
/**
 * function used to embed center Image and right content,
 * used to embed big image.
 * @author Sunny Patial
 */
function embedPopupWithImage(jsonData, is_my_album ){
	$(".popup-arrow-lt").removeAttr("photo-id");
	$(".popup-arrow-rt").removeAttr("photo-id");
	if(jsonData.album_detail["img_count"]==1){
		$(".popup-arrow-lt").hide();
		$(".popup-arrow-rt").hide();
	}
	else{
		$(".popup-arrow-lt").show();
		$(".popup-arrow-rt").show();
	}
	$(".popup-arrow-lt").attr("photo-id",jsonData.photoID);
	$(".popup-arrow-rt").attr("photo-id",jsonData.photoID);
	var img_html = '';
	if(jsonData.photo==0)
	{
		img_html+='<div class="no-img">No Preview Found!</div>';
	}
	else{
		img_html = '<img src="'+jsonData.photo+'">';
	}
	// bottom div start...
	img_html+='<div class="popup-lt-top">';
	img_html+='<a title="View Full Screen" class="full-screen-view see-full-screen-image" rel="'+jsonData.photoID+'" href="javascript:;">';	
	img_html+='<img alt="" src="'+IMAGE_PATH+'/fullview-img.png">';
	img_html+='</a>';
	img_html+='</div>';
	//img_html+='asdfasdf';
	img_html+='<div class="popup-lt-bot popup-lt-bot_'+jsonData.photoID+'">';

		if(jsonData.album_detail["enableOptionMove"]==1)
		{
			img_html+='<div class="option-pop option-pop-slider option-pop_'+jsonData.photoID+'">';
		}
		else if(!is_my_album)
		{
			img_html+='<div class="option-pop option-pop_'+jsonData.photoID+'" style="  left: 6px;top:-47px;">';	   
		}
		else
		{
			img_html+='<div class="option-pop option-pop_'+jsonData.photoID+'" style="top:-70px;">';
		}
	img_html+='<a class="full-screen-view  see-full-screen-image" rel="'+jsonData.photoID+'" href="javascript:;">View Full Screen</a>';
	img_html+='<a href="/'+PROJECT_NAME+'profile/download-file/uid/'+jsonData.album_detail["postedUser"]+'/directory/'+jsonData.album_detail["album"]+'/file/'+jsonData.album_detail["file"]+'">Download</a>';
	//Check if photo is of logged in user only then he can make it cover photo
	if( is_my_album )
	{
		img_html+='<a class="makeAsCoverPhoto" rel="'+jsonData.album_detail["id"]+','+jsonData.photoID+'" href="javascript:;">Make Album Cover</a>';
	}
	if( is_my_album )
	{
		if(jsonData.album_detail["enableOptionMove"]==1)
		{
			img_html+='<a class="moveToAnotherAlbum" rel="'+jsonData.album_detail["id"]+','+jsonData.photoID+'" href="javascript:;">Move to another Album</a>';		
		}	
	}
	img_html+='</div>';
	
	img_html+='<div class="popup-lt-bot-lt popup-lt-bot-lt_'+jsonData.photoID+'">';
	img_html+='<img src="'+IMAGE_PATH+'/option-icon.png" width="15" height="15" alt=""/>'; 
	img_html+='<span>Options</span>';
	img_html+='</div>';
	
	
	img_html+='<div class="popup-lt-bot-rt">';
	
	img_html += '<div class="fl  text-purple">';
	if( jsonData.photo_details["is_ok_comment_share_pannel_visible"] == 1 )
	{	
		/***** ok photo start here...****/
		img_html += '<div class="ok-photo">';
		img_html += '<div style = "display:inline-block;">';
		if( jsonData.photo_details["am_I_ok_this_photo"] == 1 )
		{
			img_html += '<a style = "display:none" href="javascript:;" class = "ok" onclick = "okThePhoto('+jsonData.photoID+','+jsonData.album_detail["postedUser"]+', this );" rel = "'+jsonData.photoID+'" ><span>&nbsp;</span>Ok</a>';
			img_html += '<a style = "" href="javascript:;" class = "not_ok" onclick = "notOkThePhoto( '+jsonData.photoID+','+jsonData.album_detail["postedUser"]+', this );" rel = "'+jsonData.photoID+'" ><span>&nbsp;</span>Unok</a>';
		}
		else
		{
			img_html += '<a style = "" href="javascript:;" class = "ok" onclick = "okThePhoto('+jsonData.photoID+','+jsonData.album_detail["postedUser"]+', this );" rel = "'+jsonData.photoID+'" ><span>&nbsp;</span>Ok</a>';
			img_html += '<a style = "display:none;" href="javascript:;" class = "not_ok" onclick = "notOkThePhoto( '+jsonData.photoID+','+jsonData.album_detail["postedUser"]+', this );" rel = "'+jsonData.photoID+'" ><span>&nbsp;</span>Unok</a>';
		}
		img_html += '</div>';
		
		img_html += '<div style = "display:inline-block; float: right;" class = "like_photo_count">';
		if( jsonData.photo_details["no_of_oks"] > 0 )
		{
			img_html += '<a href="javascript:;" onclick = "openWhoLikedPopup(' + jsonData.photoID + ', ' + jsonData.album_detail["postedUser"] + ', ' + jsonData.logined_user_details["id"] + ')" >('+ jsonData.photo_details["no_of_oks"] +')</a>';
		}
		else
		{
			img_html += '<a href="javascript:;" style = "display : none;" onclick = "openWhoLikedPopup(' + jsonData.photoID + ', ' + jsonData.album_detail["postedUser"] + ', ' + jsonData.logined_user_details["id"] + ')" >('+ 0 +')</a>';
		}
		img_html += '</div>';
		img_html += '</div>';
		/***** ok photo end here...****/
		
		/***** share photo start here...****/
		img_html += '<div class="share-photo">';
		
		img_html += '<div style = "display:inline-block;">';
		img_html += '<a onclick="shareThisPost('+jsonData.photoID+','+jsonData.album_detail["postedUser"]+', '+jsonData.photo_details["no_of_shares"]+' , this);" class="share" href="javascript:;" style=""><span>&nbsp;</span>Share</a>';
		img_html += '</div>';
		
		img_html += '<div style = "display:inline-block; float: right; " class = "share_photo_count">';
		if( jsonData.photo_details["no_of_shares"] > 0 )
		{
			img_html += '<a href="javascript:;" onclick = "openUsersWhoSharedPhotoInPopup(' + jsonData.photoID + ', ' + jsonData.album_detail["postedUser"] + ', ' + jsonData.logined_user_details["id"] + ')" ><span id = "photo_' + jsonData.photoID + '" class = "bg-none">('+jsonData.photo_details["no_of_shares"]+')</span></a>';
		}
		/*else
		{
			img_html += '<a href="javascript:;" onclick = "openUsersWhoSharedPhotoInPopup(' + jsonData.photoID + ', ' + jsonData.album_detail["postedUser"] + ', ' + jsonData.logined_user_details["id"] + ')" ><span id = "photo_' + jsonData.photoID + '" class = "bg-none"></span></a>';		
		}*/
		img_html += '</div>';
		
		img_html += '</div>';
		/***** share photo end here...****/
	}
	// end of likes...
	
	img_html+='</div>';
	img_html+='</div>';
	
	$("#realImage").empty();
	$("#realImage").html(img_html);
	html='';
	html+='<div class="popup-right-top">';
	html+='<div class="pop-arrow">';
	html+='<a title="Close" href="javascript:;" class="close-photo-desc">';
	html+='<img src="'+IMAGE_PATH+'/cross-grey.png" alt="close"/>';
	html+='</a>';
	html+='</div>';
	html+='<div class="popup-right-photo-detail">';
	html+='<div class=" popup-right-photo">';
	if(jsonData.album_detail.posted_by_user_type != 5 )
	{
		html+='<a href="/'+PROJECT_NAME+'profile/iprofile/id/'+jsonData.album_detail.postedUser+'">';
		html+='<img src="'+jsonData.photo_poster_details["photo"]+'" width="45" height="44" alt=""/>';
		html+='</a>';
	}
	else
	{
		html+='<img src="'+jsonData.photo_poster_details["photo"]+'" width="45" height="44" alt=""/>';
	}
	html+='</div>';
	html+='<div class=" popup-right-detail">';
	if(jsonData.album_detail.posted_by_user_type != 5)
	{
		html+='<a href="/'+PROJECT_NAME+'profile/iprofile/id/'+jsonData.album_detail.postedUser+'">';
		html+='<h3>'+jsonData.photo_poster_details["name"]+'</h3>';
		html+='</a>';
	}
	else
	{
		html+='<h3 style="text-transform:none;">'+jsonData.photo_poster_details["name"]+'</h3>';
	}
	html+='<p>'+jsonData.photo_poster_details["time_period"]+'</p>';
	html+='</div>';
	html+='</div>';
	if(jsonData.logined_user_details["id"]==jsonData.album_detail["postedUser"]){
		var titleMsg = "Click here to add image title";
		if(jsonData.photo_poster_details["description"]!=null)
		{
			if((jsonData.photo_poster_details["description"]).trim()!="")
			{
				titleMsg = "Click here to edit image title";
			}
			
		}
		html+='<div title="'+titleMsg+'" class="photo-desc photo-desc_'+jsonData.photoID+'" rel="'+jsonData.photoID+'">';
	
	}
	else{
		html+='<div class="photo-descs photo-desc_'+jsonData.photoID+'" rel="'+jsonData.photoID+'">';
	}
	if(jsonData.photo_poster_details["description"]==null)
	{
		
		if(jsonData.logined_user_details["id"]==jsonData.album_detail["postedUser"]){
			html+='Click here to add image title';
		}
		else{
			html+='';
		}
	}
	else{
		if((jsonData.photo_poster_details["description"]).trim()!="")
		{
			html+=jsonData.photo_poster_details["description"];
		}	
		else
		{
			if(jsonData.logined_user_details["id"]==jsonData.album_detail["postedUser"])
			{
				html+='Click here to add image title';
			}
			else
			{
				html+='';
			}
		}
	}
	html+='</div>';
	html+='<div class="enter-photo-desc enter-photo-desc_'+jsonData.photoID+'">';
	html+='<textarea maxlength="255" class="" rel="'+jsonData.photoID+'" name="photo-desc_'+jsonData.photoID+'" id="photo-desc_'+jsonData.photoID+'">';
	if(jsonData.photo_poster_details["description"]=="" || jsonData.photo_poster_details["description"]==null)
	{
		html+="";
	}
	else{
		html += jsonData.photo_poster_details["description"];
	}
	
	html+='</textarea>';
	if(jsonData.photo_poster_details["description"]=="" || jsonData.photo_poster_details["description"]==null)
	{
		html+='<input type="hidden" name="hide-desc_'+jsonData.photoID+'" id="hide-desc_'+jsonData.photoID+'" value="">';
	}
	else{
		html+='<input type="hidden" name="hide-desc_'+jsonData.photoID+'" id="hide-desc_'+jsonData.photoID+'" value="'+jsonData.photo_poster_details["description"]+'">';
	}
	
	html+='<a class="cancel-photo-desc" rel="'+jsonData.photoID+'">Cancel</a>';
	html+='<a class="save-photo-desc" rel="'+jsonData.photoID+'">Save</a>';
	html+='</div>';
	html+='</div>';

// ok Comments Share starts
	if( jsonData.photo_details["is_ok_comment_share_pannel_visible"] == 1 )
	{
		html += '<div class="photo-likes news_likes">';
		html += '<div class="fl  text-purple">';
		
		
		html += '<div class="ok-photo-right ok">';
		html += '<div style = "display:inline-block;">';
		
		
		if( jsonData.photo_details["am_I_ok_this_photo"] == 1 )
		{
			html += '<a style = "display:none" href="javascript:;" class = "ok" onclick = "okThePhoto('+jsonData.photoID+','+jsonData.album_detail["postedUser"]+', this );" rel = "'+jsonData.photoID+'" ><span>&nbsp;</span>Ok</a>';
			html += '<a style = "" href="javascript:;" class = "not_ok" onclick = "notOkThePhoto( '+jsonData.photoID+','+jsonData.album_detail["postedUser"]+', this );" rel = "'+jsonData.photoID+'" ><span>&nbsp;</span>Unok</a>';
		}
		else
		{
			html += '<a style = "" href="javascript:;" class = "ok" onclick = "okThePhoto('+jsonData.photoID+','+jsonData.album_detail["postedUser"]+', this );" rel = "'+jsonData.photoID+'" ><span>&nbsp;</span>Ok</a>';
			html += '<a style = "display:none;" href="javascript:;" class = "not_ok" onclick = "notOkThePhoto( '+jsonData.photoID+','+jsonData.album_detail["postedUser"]+', this );" rel = "'+jsonData.photoID+'" ><span>&nbsp;</span>Unok</a>';
		}
		
		html += '</div>';
		html += '<div style = "display:inline-block; float: right;" class = "like_photo_count">';
		if( jsonData.photo_details["no_of_oks"] > 0 )
		{
			html += '<a href="javascript:;" onclick = "openWhoLikedPopup(' + jsonData.photoID + ', ' + jsonData.album_detail["postedUser"] + ', ' + jsonData.logined_user_details["id"] + ')" >('+ jsonData.photo_details["no_of_oks"] +')</a>';
		}
		else
		{
			html += '<a href="javascript:;" style = "display : none;" onclick = "openWhoLikedPopup(' + jsonData.photoID + ', ' + jsonData.album_detail["postedUser"] + ', ' + jsonData.logined_user_details["id"] + ')" >('+ 0 +')</a>';
		}
		html += '</div>';
		html += '</div>';
		
		
		
		html += '<div class="comments">';
		if( jsonData.photo_details["no_of_comments"] > 0 )
		{
			html += '<a href="javascript:;" rel="'+jsonData.photoID+'" class = "add_comment">Comment</a><span id = "comment_count_'+jsonData.photoID+'" >('+jsonData.photo_details["no_of_comments"]+')</span>';
		}
		else
		{
			html += '<a href="javascript:;" rel="'+jsonData.photoID+'" class = "add_comment">Comment</a><span id = "comment_count_'+jsonData.photoID+'"></span>';
		}
		html += '</div>';
		
		
		
		
		html += '<div class="share">';
		
		html += '<div style = "display:inline-block;">';
		html += '<a onclick="shareThisPost('+jsonData.photoID+','+jsonData.album_detail["postedUser"]+', '+jsonData.photo_details["no_of_shares"]+' , this);" class="share" href="javascript:;" style=""><span>&nbsp;</span>Share</a>';
		html += '</div>';
		html += '<div style = "display:inline-block; float: right; " class = "share_photo_count">';
		if( jsonData.photo_details["no_of_shares"] > 0 )
		{
			html += '<a href="javascript:;" onclick = "openUsersWhoSharedPhotoInPopup(' + jsonData.photoID + ', ' + jsonData.album_detail["postedUser"] + ', ' + jsonData.logined_user_details["id"] + ')" ><span id = "photo_' + jsonData.photoID + '" class = "bg-none">('+jsonData.photo_details["no_of_shares"]+')</span></a>';
		}
		/*else
		{
			html += '<a href="javascript:;" onclick = "openUsersWhoSharedPhotoInPopup(' + jsonData.photoID + ', ' + jsonData.album_detail["postedUser"] + ', ' + jsonData.logined_user_details["id"] + ')" ><span id = "photo_' + jsonData.photoID + '" class = "bg-none"></span></a>';		
		}*/
		html += '</div>';
		
		html += '</div>';
		html += '</div>';
		
		html += '</div>';
	}
	else
	{
		html += '<p style="float:left; width:100%;">&nbsp;</p>';
	}	
// ok Comments Share Ends
    
	html+='<div class="popup-right-bot">';
	
	if( jsonData.photo_details["no_of_oks"] > 0 )
	{
    	html+='<div class="other-likethis people-who-liked" id="other-likethis_'+jsonData.photoID+'">';
		html+='<img src="'+IMAGE_PATH+'/tick-grey.png" width="12" height="13" alt=""/>';
		html+='<span>';
		html+=jsonData.photo_details["ok_string"];
		html+='</span>';
		html+='</div>';
	}
	else
	{
		html+='<div class="other-likethis people-who-liked" id="other-likethis_'+jsonData.photoID+'" style="display:none;">';
		html+='</div>';
	}
	
	if( jsonData.photo_details["no_of_comments"] > 2 )
	{
		html+='<div class="view-more-comment">';
		html+='<img src="'+IMAGE_PATH+'/comments-icon-purple.png" width="18" height="16" alt=""/>';
		html+='<a href="javascript:;" class="view-comments" rel="'+jsonData.photoID+'" id="view-more-comments_'+jsonData.photoID+'">';
		html+='View more comments';
		html+='</a>';
		html+='</div>';
	}
	
	if( jsonData.photo_details["no_of_comments"] > 0 )
	{	
		//console.log(jsonData.latest_four_comments );
		var countLength = ( jsonData.latest_four_comments ).length;
		html+='<input type="hidden" name="comment-offset_'+jsonData.photoID+'" id="comment-offset_'+jsonData.photoID+'" value="'+countLength+'">';
		html+='<input type="hidden" name="comment-photo_id" id="comment-photo_id" value="'+jsonData.photoID+'">';
		html+='<div id="comment-box_'+jsonData.photoID+'">';
		for( var i = countLength-1; i>=0; i--)
		{
			if(jsonData.latest_four_comments[i]["is_hidden"] == 0 )
			{
				
			html+='<div class="comment-write-box comment-write-box_'+jsonData.latest_four_comments[i]["comment_id"]+'" rel="'+jsonData.latest_four_comments[i]["comment_id"]+'">';
				html+='<div class="comment-write-box-img">';
					html+='<img src="'+jsonData.latest_four_comments[i]["comment_profes_image"]+'" width="32" height="32" alt=""/>';
				html+='</div>';
				
				html+='<div class="comment-write-box-text">';
					html+='<h5 style="width:100%;text-transform:none;">';
					html+='<span class="commented-user"><a href = "/'+PROJECT_NAME+'profile/iprofile/id/'+jsonData.latest_four_comments[i]['commenter_id']+'">'+jsonData.latest_four_comments[i]["commenter_name"]+'</a></span>';
					
					html+='<span class="display-comment" id="display-comment_'+jsonData.latest_four_comments[i]["comment_id"]+'">';
					html+=showCroppedText( jsonData.latest_four_comments[i]["comment_text"], 150, "...<label class = 'show_full_comment' onclick = 'showFullComment(this)'>>></label>");
					html+='</span>';
					
					html+='<span class="display-full-comment" style = "display:none;" id="display-comment_'+jsonData.latest_four_comments[i]["comment_id"]+'">';
					html+=jsonData.latest_four_comments[i]["comment_text"];
					html+='</span>';
					
					html+='</h5>';
				
					html+='<div class="comment-write-box-textarea comment-write-box-textarea_'+jsonData.latest_four_comments[i]["comment_id"]+'" >';
					html+='<textarea maxlength="255" class="comment-box-input" id="edit-comment_'+jsonData.latest_four_comments[i]["comment_id"]+'" name="edit-comment_'+jsonData.latest_four_comments[i]["comment_id"]+'">'+jsonData.latest_four_comments[i]["comment_text"]+'</textarea>';
					html+='</div>';
				
					html+='<p class="comments-date">';
					html+=jsonData.latest_four_comments[i]["created_at"];
					html+='</p>';
				
				html+='</div>';
			
				if(jsonData.latest_four_comments[i]["is_my_comment"]==1)
				{
					// start of edit comment div..
					html+='<div class="editComment" id="editComment_'+jsonData.latest_four_comments[i]["comment_id"]+'" rel="'+jsonData.latest_four_comments[i]["comment_id"]+'" style="cursor:pointer;">';
					html+='<img src="'+IMAGE_PATH+'/icon-pencil4.png" title="Edit Comment" />';
					
					html+='<div id="editCommentOptions_'+jsonData.latest_four_comments[i]["comment_id"]+'" class="edit-comment-popup-outer" style="right: 0px; bottom: -60px; display: block;">';
					
					html+='<div class="edit-comment-popup-outer" style="margin: 0px 0px 0px 66px;">';
					html+='<img width="26" height="16" src="'+IMAGE_PATH+'/arrow-up-grey2.png">';
					html+='</div>';
					
					html+='<div class="edit-comment-popup">';
					html+='<div class="edit-comment-popup-col1">';
					html+='<h5><a class="text-grey2-link editing-comment" rel="'+jsonData.latest_four_comments[i]["comment_id"]+'" href="javascript:;">Edit</a></h5>';
					html+='</div>';
					
					html+='<div class="edit-comment-popup-col1">';
					html+='<h5><a href="javascript:;" rel="'+jsonData.latest_four_comments[i]["comment_id"]+'" class=" text-grey2-link" onclick="deletePhotoComment('+jsonData.photoID+','+jsonData.latest_four_comments[i]["comment_id"]+', this)" >Delete</a></h5>';
					html+='</div>';
					html+='</div>';
					
					html+='</div>';
					
					html+='</div>';
					// end of edit comment div..
				}	
				else{
					html+='<div title="Hide Comment" class="hideComment" id="hideComment_'+jsonData.latest_four_comments[i]["comment_id"]+'" rel="'+jsonData.latest_four_comments[i]["comment_id"]+'"  same-comment-id="'+jsonData.latest_four_comments[i]["same_comment_id"]+'" style="cursor:pointer;">';
					html+='<img src="'+IMAGE_PATH+'/cross-grey.png" title="Hide Comment" />';
					html+='</div>';
				}
			html+='</div>';
			}
			else{
				html+='<div title="Hidden Comment" class="comment-write-box comment-write-box_'+jsonData.latest_four_comments[i]["comment_id"]+'" rel="'+jsonData.latest_four_comments[i]["comment_id"]+'" style="text-align:center;">';
				html+='<span class="photoHiddenComment photoHiddenComment_'+jsonData.latest_four_comments[i]["comment_id"]+'" rel="'+jsonData.latest_four_comments[i]["comment_id"]+'" >';
				html+='...';
				html+='</span>';
				html+='</div>';
			}
		}
		html+='</div>';
	}
	else{
		html+='<input type="hidden" name="comment-offset_'+jsonData.photoID+'" id="comment-offset_'+jsonData.photoID+'" value="'+countLength+'">';
		html+='<div id="comment-box_'+jsonData.photoID+'">';
		html+='</div>';
	}
	//html+='<form name="comment_'+jsonData.photoID+'" id="comment_'+jsonData.photoID+'" method="post" action="'+PROJECT_NAME+'profile/add-comment-to-the-photo-and-related-wallpost">';
	html+='<input type="hidden" name="album_posted_by_'+jsonData.photoID+'" id="album_posted_by_'+jsonData.photoID+'" value="'+jsonData.album_detail["postedUser"]+'">';
	if( jsonData.photo_details["is_ok_comment_share_pannel_visible"] == 1 )
	{
	html+='<div class="comment-write-box">';
	html+='<div class="comment-write-box-img">';
	html+='<img src="'+jsonData.logined_user_details["photo"]+'" width="32" height="32" alt=""/>';
	html+='</div>';
	html+='<div class="comment-write-box-text">';
	html+='<input maxlength="255" class="comment-box-input" id="comment_'+jsonData.photoID+'" name="comment_'+jsonData.photoID+'" type="text" placeholder="Write your comment" />';
	html += '<div class="enter-post">Press Enter to Post</div>';
	html+='</div>';
	html+='</div>';
	html+='</div>';
	}
	//html+='</form>';
	
	var full_screen_html = '';
	var windowWidth = $(window).width()+"px"; 
	var windowHeight = parseInt($(window).height())+"px"; 
	full_screen_html+='<div class="popup-left big-popup-left">';
	full_screen_html+='<div class="popup-lt-mid big-popup-lt-mid">';
	if(jsonData.album_detail["img_count"]>1){
		full_screen_html+='<div class="popup-arrow-lt" photo-id="'+jsonData.photoID+'">';
		full_screen_html+='</div>';
		full_screen_html+='<div class="popup-arrow-rt" photo-id="'+jsonData.photoID+'">';
		full_screen_html+='</div>';		
	}
	
	full_screen_html+='<div id="fullImage" class="popup-lt-mid-inner" style="width:'+windowWidth+';height:'+windowHeight+';">';
	if(jsonData.realPhoto==0){
		full_screen_html+='<div class="no-img">No Preview Found!</div>';
	}
	else{
		full_screen_html+='<img style="max-width:'+windowWidth+';" src="'+jsonData.realPhoto+'">';
	}
	full_screen_html+='<div class="popup-lt-bot popup-lt-bot_'+jsonData.photoID+'" style="display: none;">';
	full_screen_html+='<div class="option-pop big-option-pop option-pop_'+jsonData.photoID+'">';
	full_screen_html+='<a href="javascript:;" rel="'+jsonData.photoID+'" class="esc-key" style="display: block;">';
	full_screen_html+='Exit Full Screen';
	full_screen_html+='</a>';
	full_screen_html+='<a href="/'+PROJECT_NAME+'profile/download-file/uid/'+jsonData.album_detail["postedUser"]+'/directory/'+jsonData.album_detail["album"]+'/file/'+jsonData.album_detail["file"]+'">Download</a>';
	full_screen_html+='</div>';
	full_screen_html+='<div class="popup-lt-bot-lt popup-lt-bot-lt_'+jsonData.photoID+'">';
	full_screen_html+='<img src="'+IMAGE_PATH+'/option-icon.png" width="15" height="15" alt=""/>';
	full_screen_html+='<span>Options</span>';
	full_screen_html+='</div>';
	full_screen_html+='<div class="popup-lt-bot-rt">';
	if( jsonData.photo_details["is_ok_comment_share_pannel_visible"] == 1 )
	{
		/**** ok photo start here...*****/
		full_screen_html += '<div class="ok-photo">';
		
		full_screen_html += '<div style = "display:inline-block;">';
		if( jsonData.photo_details["am_I_ok_this_photo"] == 1 )
		{
			full_screen_html += '<a style = "display:none" href="javascript:;" class = "ok" onclick = "okThePhoto('+jsonData.photoID+','+jsonData.album_detail["postedUser"]+', this );" rel = "'+jsonData.photoID+'" ><span>&nbsp;</span>Ok</a>';
			full_screen_html += '<a style = "" href="javascript:;" class = "not_ok" onclick = "notOkThePhoto( '+jsonData.photoID+','+jsonData.album_detail["postedUser"]+', this );" rel = "'+jsonData.photoID+'" ><span>&nbsp;</span>Unok</a>';
		}
		else
		{
			full_screen_html += '<a style = "" href="javascript:;" class = "ok" onclick = "okThePhoto('+jsonData.photoID+','+jsonData.album_detail["postedUser"]+', this );" rel = "'+jsonData.photoID+'" ><span>&nbsp;</span>Ok</a>';
			full_screen_html += '<a style = "display:none;" href="javascript:;" class = "not_ok" onclick = "notOkThePhoto( '+jsonData.photoID+','+jsonData.album_detail["postedUser"]+', this );" rel = "'+jsonData.photoID+'" ><span>&nbsp;</span>Unok</a>';
		}
		full_screen_html += '</div>';
		
		full_screen_html += '<div style = "display:inline-block; float: right;" class = "like_photo_count">';
		if( jsonData.photo_details["no_of_oks"] > 0 )
		{
			full_screen_html += '<a href="javascript:;" onclick = "openWhoLikedPopup(' + jsonData.photoID + ', ' + jsonData.album_detail["postedUser"] + ', ' + jsonData.logined_user_details["id"] + ')" >('+ jsonData.photo_details["no_of_oks"] +')</a>';
		}
		else
		{
			full_screen_html += '<a href="javascript:;" style = "display : none;" onclick = "openWhoLikedPopup(' + jsonData.photoID + ', ' + jsonData.album_detail["postedUser"] + ', ' + jsonData.logined_user_details["id"] + ')" >('+ 0 +')</a>';
		}
		full_screen_html += '</div>';
		
		full_screen_html += '</div>';
		/**** ok photo end here...*****/
		
		/**** share photo start here...*****/
		full_screen_html += '<div class="share-photo">';
		
		full_screen_html += '<div style = "display:inline-block;">';
		full_screen_html += '<a onclick="shareThisPost('+jsonData.photoID+','+jsonData.album_detail["postedUser"]+', '+jsonData.photo_details["no_of_shares"]+' , this);" class="share" href="javascript:;" style=""><span>&nbsp;</span>Share</a>';
		full_screen_html += '</div>';
		
		full_screen_html += '<div style = "display:inline-block; float: right; " class = "share_photo_count">';
		if( jsonData.photo_details["no_of_shares"] > 0 )
		{
			full_screen_html += '<a href="javascript:;" onclick = "openUsersWhoSharedPhotoInPopup(' + jsonData.photoID + ', ' + jsonData.album_detail["postedUser"] + ', ' + jsonData.logined_user_details["id"] + ')" ><span id = "photo_' + jsonData.photoID + '" class = "bg-none">('+jsonData.photo_details["no_of_shares"]+')</span></a>';
		}
		else
		{
		}	
		full_screen_html += '</div>';
		
		full_screen_html += '</div>';
		/**** share photo end here...*****/
	}
	full_screen_html+='</div>';
	full_screen_html+='</div>';
	full_screen_html+='</div>';
	full_screen_html+='</div>';
	full_screen_html+='</div>';
	$(".fullscreen-popup").empty();
	$(".fullscreen-popup").html(full_screen_html);
	
	$(".popup-right").empty();
	$(".popup-right").html(html);
	$(".popup-wrapper").bPopup(
			{
				amsl : 0,
				zIndex : 10
            }		
	);
	
	showPopupBottomDiv(jsonData.photoID);
	showOptionsDiv(jsonData.photoID);
	makeAsCoverPhoto();
//	getOtherAlbumsForUser();
	showFullImage();
	addArrowClickEvents();
	enableExitFullScreenLink();
	addDescriptionEditEvents();
	getPhotoMoreComments();
	// getMoreComments();
	displayEditCommentLinks();
	clickOnEditCommentLink();
	clickOnHideCommentLink();
	submitFormWhenClickOnEnter(jsonData.photoID);
	if(jsonData.photo_details["no_of_comments"]>0){
		var countLength = (jsonData.latest_four_comments).length;
		for(var i=countLength-1;i>=0;i--){
			var commentID = jsonData.latest_four_comments[i]["comment_id"];
			var sameCommentID = jsonData.latest_four_comments[i]["same_comment_id"];
			updateCommentWhenClickOnEnter(commentID);
		}
	}
	clickOnDotsShowCommentEvent();
	enabledLeftRightEvent();
	closeImageDetailPopup();
}
/**
 *
 * 
 * @author Sunny Patial
 */
function closeImageDetailPopup(){
	$(".close-photo-desc").unbind();
	$(".close-photo-desc").click(function(){
		$(".popup-wrapper").bPopup().close();
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
 * function used to save photo description...
 * 
 * @author Sunny Patial
 */
function savePhotoDescription(photoID){
	var imageDesc = $("#photo-desc_"+photoID).val();
	jQuery.ajax({
		url: "/" + PROJECT_NAME + "profile/save-photo-description",
		type: "POST",
		dataType: "json",
		data: { "photo_id" : photoID,"desc":imageDesc },
		beforeSend: function(msg){
			
		},
		timeout: 50000,
		success: function(jsonData) {
			if(jsonData==1){
				if(imageDesc.trim()!="")
				{
					$(".photo-desc_"+photoID).attr("title","Click here to edit image title");
					$(".photo-desc_"+photoID).html(imageDesc);
					$(".photo-desc_"+photoID).fadeIn();
					$(".enter-photo-desc_"+photoID).hide();
					$("#hide-desc_"+photoID).val(imageDesc);
				}
				else
				{
					$(".photo-desc_"+photoID).attr("title","Click here to add image title");
					$(".photo-desc_"+photoID).html("Click here to add image title");
					$(".photo-desc_"+photoID).fadeIn();
					$(".enter-photo-desc_"+photoID).hide();
					$("#hide-desc_"+photoID).val("");
				}
			}
		}
	});			
}
/**
 * function used to enable left, right arrows.
 * 
 * @author Spatial
 */
function addArrowClickEvents(){
	$(".popup-arrow-lt").unbind();
	$(".popup-arrow-lt").click(function(){
		$(".option-pop").hide();
		getPreviousPhotoDetail($(this).attr("photo-id"));
	});
	$(".popup-arrow-rt").unbind();
	$(".popup-arrow-rt").click(function(){
		$(".option-pop").hide();
		getNextPhotoDetail($(this).attr("photo-id"));
	}); 
}
/**
 * function used to exit from Full Screen View
 * @author Spatial
 */
function enableExitFullScreenLink(){
	$("a.esc-key").unbind();
	$("a.esc-key").on('click', function() {
		$(".option-pop").hide();
	    var docElement, request;
	    docElement = document;
	    request = docElement.cancelFullScreen|| docElement.webkitCancelFullScreen || docElement.mozCancelFullScreen || docElement.msCancelFullScreen || docElement.exitFullscreen;
	    if(typeof request!="undefined" && request){
	        request.call(docElement);
	    }
	});
}

/**
 * Share photo detail popup.
 * 
 * @param wallpost_id 
 * @author jsingh7, nsingh3
 * @version 1.1
 */
function shareThisPost( photo_id, photo_posted_by, shareCount, elem )
{

	var photoDesc = $("#photo-desc_"+photo_id).val();
	// start of get the photo thumb url
	var zee_index;
	if( $("input[type=hidden]#is_fullscreen_mode").val() == "1" )
	{
		zee_index = 2147483647;
	}
	else
	{
		zee_index = 13;
	}
	
	$('div#share_photo_feed_popup').bPopup(
	{

				modalClose: true,
			    easing: 'easeOutBack', //uses jQuery easing plugin
		        speed: 500,
		        closeClass : 'close_bpopup',
//				        transition: 'slideDown',
		        onClose: function() {},
		        onOpen: function() {
		        	//Do required stuff...
		        	
		        	
		        	$("div#share_box").html("<div style = 'display : table-cell; height: 560px; width: 500px; text-align:center; vertical-align: middle;'><image src = "+IMAGE_PATH+"/loading_medium_purple.gif></div>");
		        	$("div.message_box").slideUp();
		        	jQuery.ajax({
		                url: "/" + PROJECT_NAME + "socialise/get-photo-info",
		                type: "POST",
		                dataType: "json",
		                data: { 'photo_id' : photo_id },
		                timeout: 50000,
		                success: function( jsonData ) {
		                	if( jsonData == 2 )
		                	{
		                		showDialogMsg( "Oops!", "Oops! Post doesnot exist anymore.", 3000, {buttons:[{text:"OK",click:function(){$(this).dialog("close");}}],show:{effect:"fade"},hide:{effect:"fade"},dialogClass:"general_dialog_message",height:200,width:300} );
		                		var bPopup = $('div#share_photo_feed_popup').bPopup();
		                		bPopup.close();
		                		return;
		                	}	
							
		                	var html = "";
		                	
		                	html += '<div class="share-hdr2">';
		                	
		                	html += '<div class="share-hdr2-lt collage_text">';
							html += '<div class = "share_popup_photo_thumbnail" id = "photo_thumbnail_'+jsonData.photo_id+'">';
		                	html += '<img src = "'+jsonData.image_path+'"/>';
		                	html += '</div>';
							html += '</div>';
							
							html += '<div class="share-hdr2-rt collage_text">';                                                                                                           
							html += '<p>';
							html+=photoDesc;
							html+='</p>';
							html += '</div>';
						
							html += '</div>';
							
							html += '<form class="form-share-pop">';
		                
							/****First Div Starts*****/
							html += '<div id = "privacy">';
		                	html += '<input class="share-checkbox" checked="checked" type="checkbox" id="share-update" name="share-wall[]" value="1" onclick = "enableDisableShareForm(this)"> Share an update';
		                	html += '<div class="share-greybox">';
		                	html += '<textarea style="height:50px; width:97%;background:#fff;border:1px solid #ddd;"id="photo_text" name = "photo_text" placeholder="Share an update. Type a name to mention a connection or company." rows="" cols="" ></textarea>';
		                	html += '<font style = " float:left; padding:10px 10px 0 0;color:#6A6A6A">';
		             		html += 'Share with';
		             		html += '</font>';
		            		html += '<div id="win-xp6">';
		            		html += '<select id="privacydd" name="privacy">';
		            		html += '<option value="1">Public</option>';
		            		html += '<option value="2">Links</option>';
		            		html += '<option value="3">Links of Links</option>';
		            		html += '</select>';
		            		html += '</div>';
		            		html += '</div>';
		                	html += '</div>';					
		                	/****First Div Ends*****/
		            		
		            		/****Second Div Starts*****/
		                	html += '<div id = "privacy">';
		                	html += '<input class="share-checkbox" type="checkbox" id="share-individual" name="share-wall[]" value="2"> Send to individuals';
		                	html += '<div class="share-greybox  individual-msg-div">';
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
		                	html += '<textarea placeholder="Your message here" name="share_text_msg" id="share_text_msg" style="height:50px; width:97%;background:#fff;border:1px solid #ddd;"></textarea>';
		                	html += '</div>';
		                	html += '</div>';
		                	html += '</div>';					
		                	/****Second Div Ends*****/
		                	
		            		
		                	html += '<div class="individual_popup_msg" style = "display: inline-block; height: 27px; padding: 0px; float: left; margin-top: 10px;  text-align: center;margin-bottom: 20px;">';
		            		html += '<a id="share" style="float:left;" href="javascript:;" onclick = "sharePhotoDetailFromPhotoSlider('+photo_id+', '+photo_posted_by+', '+shareCount+', this)">';
		            		html += '<img width="102" height="27" title="Share" alt="Share" src="'+IMAGE_PATH+'/btn-share.png">';
		            		html += '</a>';
		            		html += '</div>';
		                	
		                	html += '</form>';
		                	
		                	$('div#share_box').html(html);
		                	
		                	//Resizing and crop to fit small image with nailthumb.js
		                	$( 'div#photo_thumbnail_'+jsonData.photo_id+' img' ).each(function( index ) {
		                    	jQuery( this ).nailthumb(
		                    			{
		                    				onStart:function(container){
		                    					
		                                    },
		                                    width: 200,
		                                    height: 160,
		                                    method:'crop',
		                    				onFinish:function(container){
		                                    }
		                    			}
		                    		);
		                    });
		                	
		                	//Popup reposition
		            		var bPopup = $("div#share_photo_detail_popup").bPopup();
		            		bPopup.reposition();
		             		bPopup.reposition();

		            		if( $( window ).height() < 637 )
		            		{
		            			$("div#share_photo_feed_popup form.form-share-pop").css("height", "225px");
		            		}
		            		else
		            		{
		            			$("div#share_photo_feed_popup form.form-share-pop").css("height", "");
		            		}
		                	// displayShareButton();
		                	retrieveUsersWithAutocomplete();
		                	addIndividualCheckBoxEvent();
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
		        zIndex: zee_index
			},
			function() {
				//Do required stuff...
				
			});	
	
	// end of get the photo thumb url
	return ;
}
function addIndividualCheckBoxEvent(){
	$( ".share-checkbox").unbind( "click" );
	$(".share-checkbox").click(function(){
		if($('.share-checkbox:checked').length>0){
			$(".individual_popup_msg").fadeIn();
			if($('#share-individual:checked').length>0){
				$(".individual-msg-div").fadeIn();
			}
			else{
				$(".individual-msg-div").hide();
			}
		}
		else{
			$(".individual-msg-div").hide();
			$(".individual_popup_msg").hide();
		}
		
		//Popup reposition
		var bPopup = $("div#share_photo_detail_popup").bPopup();
		bPopup.reposition();
	});
}

/**
 * @param elem
 * @author jsingh7
 */
function enableDisableShareForm(elem, popup_selector)
{
	popup_selector = typeof popup_selector !== 'undefined' ? popup_selector : "0";
	if($(elem).prop('checked'))
	{
		$("div.share-greybox").fadeIn();
	}
	else
	{
		$("div.share-greybox").hide();
	}
	
	//Popup reposition
	if( popup_selector != 0 )
	{	
		var bPopup = $(popup_selector).bPopup();
		bPopup.reposition();
	}
	else
	{
		var bPopup = $("div#share_photo_feed_popup").bPopup();
		bPopup.reposition();
	}
}

/*function to retrive user listing in shareThisPostByWallpostId_1*/
function retrieveUsersWithAutocomplete(){
	
	//Token input---------------
	
	$("input#receiver_id").tokenInput(PROJECT_URL+PROJECT_NAME+"mail/get-my-matching-contacts", {
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
}

/*function to retrive user listing in shareThisPostByWallpostId_2*/
function retrieveUsersWithAutocomplete2(){
	//Token input---------------

	$("input#receiver_id2").tokenInput(PROJECT_URL+PROJECT_NAME+"mail/get-my-matching-contacts", {
		onAdd: function (item) {
			$("div#receiver_ids_holder").append("<input type = 'hidden' name = 'receiver_ids[]' class = 'font-arial receiver_ids' id = '"+item.id+"' value = '"+item.id+"'>");
			$("#jq_receiver_id2").attr('placeholder','');
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
 * Share photo from photo detail popup to wall and appending new wallpost on wall.
 * @param photo_id
 * @param photo_posted_by
 * @param shareCount
 * @param elem
 * @author ?
 */
function sharePhotoDetailFromPhotoSlider(photo_id, photo_posted_by, shareCount, elem)
{
	
	if($("input#receiver_id").val()=="" && $("#share-individual:checked").length==1)
	{
		alert("Please add atleast one receiver.");
	}
	else
	{
		var shareOnWall = 0;
		var shareOnEmail = 0;
		if($('#share-update').prop("checked")){
			shareOnWall = 1;
		}
		if($('#share-individual').prop("checked")){
			shareOnEmail = 1;
		}
		$(elem).hide();
		var iddd = addLoadingImage( $(elem), "before", 'loading_small_purple.gif', 102, 27 );
		// send email message... and sharing on wall...
		if(shareOnWall == 1){
			var jdata = $("div#share_box form").serialize()+"&photo_id="+photo_id+"&photo_posted_by="+photo_posted_by+"&share_count="+shareCount+"&shared_from_photodetail_to_wall=1&shared_from_wall_to_wall=0";
			jQuery.ajax({
				url: "/" + PROJECT_NAME + "socialise/share-photofeed-from-wall",
				type: "POST",
				dataType: "json",
				data: jdata,
				timeout: 50000,
				success: function( jsonData ) {
					if(shareOnEmail == 1){
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
					$("span#"+iddd).hide();
					$(elem).fadeIn();
					clear_form_elements("form#sharePhotoDetail");
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
					
					
					//Updating sharecount.
					$("div.share_count a span#wallpost_"+jsonData.source_wall_post_id).text("("+jsonData.share_count_of_photo+")");
					//$("div.share_count a span").text("("+jsonData.source_photofeed_share_count+")");
					
					$("div.share_photo_count a span").text("("+jsonData.share_count_of_photo+")");
					//Checking the is user on socialize wall?
					//if yes the show shared photo instantly on the wall at the top.
					if( $( "input#isThisSocializeWall" ).val() == 1 )
					{
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
								}
						);
						
						//Prepending wallpost/photofeed on wall.
						$("div#updates_holder").prepend( wall_post );
						$("div.news-update-content:first").fadeIn();
						
						
						//closing share popup
						$( "span#"+iddd ).remove();
						$(elem).fadeIn();
						$('div#share_photo_feed_popup').bPopup().close();
						
					}
					
					//Ajax call for sending 'share' notification to photo owner 
					//and users who have done any activity on it.
					jQuery.ajax({
						url: "/" + PROJECT_NAME + "notifications/send-share-notification",
						type: "POST",
						dataType: "json",
						data: { 'photo_id' : photo_id },
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
				url: "/" + PROJECT_NAME + "profile/send-link-to-invidual-email",
				type: "POST",
				dataType: "json",
				data: {"share_text_msg":emailMsgText, "photo_id" : photo_id, "receiver_id":userIDs },
				success: function(jsonData) 
				{
					$("span#"+iddd).remove();
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
						    height: 170,
						    width: 200
						}	
					);
					return false;
				}
			});
		}		
	}
}
//this function is use for Add photo like.
//@author: Narinder Singh

var ok_notOK_call_1;
function okThePhotoAndWallpost( photo_id, photo_posted_by_user_id, elem )
{
	// this condition is use for check the last ajax call state..
	if( ok_notOK_call_1 )
	{	
		if( ok_notOK_call_1.state() != "resolved" )
		{
			return;
		}
	}
	$("a.ok").hide();
	$("a.not_ok").fadeIn();
	
	ok_notOK_call_1 = jQuery.ajax({
      url: "/" + PROJECT_NAME + "profile/ok-the-album-photo-and-wallpost",
      type: "POST",
      dataType: "json",
      data: { 'photo_id' : photo_id  ,'photo_posted_by_user_id' : photo_posted_by_user_id},
//		cache: false,
      timeout: 50000,
      success: function(jsonData) {
      	if( jsonData.status == 1 )
      	{
//      	Incrementing count.
      		var updated_count  = parseInt( $(elem).parent().siblings("div.like_count").children("a").text().replace(/[\])}[{(]/g,'') );
      		if (isNaN(updated_count))
      		{ 
      			updated_count = 0;
      		}
      		updated_count = updated_count+1;
      		$(".like_count").children("a").text("("+updated_count+")");
      		$(".like_count").children("a").fadeIn();
      		
      		
//    		Incrementing count.
      		if( $("input#isThisSocializeWall").val() == 1 )
      		{	
	    		$("div#"+jsonData.wallpost_id+".like_count a").text("("+updated_count+")");
	    		$("div#"+jsonData.wallpost_id+".like_count a").fadeIn();
      		}
      		
      		// show likers string.
      		var xhtml='';
      		xhtml+='<img src="'+IMAGE_PATH+'/tick-grey.png" width="12" height="13" alt=""/>';
    		xhtml+=jsonData.ok_string;
    		$("div#other-likethis_"+photo_id).html(xhtml);
    		$("div#other-likethis_"+photo_id).fadeIn();
    		
    		//Show likers string on wallpost also if you are on socialize wall.
    		if( $("input#isThisSocializeWall").val() == 1 )
    		{
    			$("div#"+jsonData.wallpost_id+".people-who-liked span").html(jsonData.ok_string);
        		$("div#"+jsonData.wallpost_id+".people-who-liked").fadeIn();
    		}
    		
    		//Ajax call for sending 'ok' notification to wallpost owner 
			//and users who have done any activity on it.
			jQuery.ajax({
				url: "/" + PROJECT_NAME + "notifications/send-ok-notification",
				type: "POST",
				dataType: "json",
				data: { 'wallpost_id' : jsonData.wallpost_id },
				success: function(jsonData) {
					
				}
			});
    		
      	}
      	else
      	{
      		return ;
      	}      	
      },
      error: function(xhr, ajaxOptions, thrownError) {
      	
      }
	});
	
}


//this function is use for dislike photo .
//@author: Narinder Singh
function notOkThePhotoAndWallpost( photo_id, photo_posted_by_user_id, elem )
{
	// this condition is use for check the last ajax call state..
	if( ok_notOK_call_1 )
	{	
		if( ok_notOK_call_1.state() != "resolved" )
		{
			return;
		}
	}
	
	$("a.ok").fadeIn();
	$("a.not_ok").hide();
	
	ok_notOK_call_1 = jQuery.ajax({
		url: "/" + PROJECT_NAME + "profile/not-ok-the-album-photo-and-wallpost",
		type: "POST",
		dataType: "json",
		data: { 'photo_id' : photo_id ,'photo_posted_by_user_id' : photo_posted_by_user_id },
//		cache: false,
		timeout: 50000,
		success: function(jsonData) {
			if( jsonData.status == 1 )
			{
//				Decrementing count.
	      		var updated_count = parseInt( $(elem).parent().siblings("div.like_count").children("a").text().replace(/[\])}[{(]/g,'') )-1;
	      		$(".like_count").children("a").text("("+updated_count+")");
	      		if( updated_count < 1 )
				{
	      			$(".like_count").children("a").hide();
				}	

	      		// show likers string.
	      		if( jsonData.ok_string.length > 0 )
	      		{	
		      		var xhtml='';
		      		xhtml+='<img src="'+IMAGE_PATH+'/tick-grey.png" width="12" height="13" alt=""/>';
		    		xhtml+=jsonData.ok_string;
		    		$("div#other-likethis_"+photo_id).html(xhtml);
		    		$("div#other-likethis_"+photo_id).fadeIn();
	      		}
	      		else
	      		{
	      			$("div#other-likethis_"+photo_id).hide();
	      		}	
	    		//Show likers string on wallpost also if you are on socialize wall.
	    		if( $("input#isThisSocializeWall").val() == 1 )
	    		{
	    			if( jsonData.ok_string.length > 0 )
	    			{
		    			$("div#"+jsonData.wallpost_id+".people-who-liked span").html(jsonData.ok_string);
		        		$("div#"+jsonData.wallpost_id+".people-who-liked").fadeIn();
	    			}
	    			else
	    			{
	    				$("div#"+jsonData.wallpost_id+".people-who-liked").hide();
	    			}	
	    		}
			}
			else
			{
				return ;
			}
		},
		error: function(xhr, ajaxOptions, thrownError) {
			
		}
	});
}


/**
 * function is used to ok photo
 * @params int photo_id
 * @params int photo_posted_by
 * @param elem on which action performed
 * @author sjaiswal
 * version 1.0
 */
var ok_notOK_call_1;
function okThePhoto( photo_id, photo_posted_by_user_id, elem )
{ 
	// this condition is use for check the last ajax call state..
	if( ok_notOK_call_1 )
	{	
		if( ok_notOK_call_1.state() != "resolved" )
		{
			return;
		}
	}
	
	$("div.photo-likes a.ok").hide();
	$("div.photo-likes a.not_ok").fadeIn();
	$("div.ok-photo a.ok").hide();
	$("div.ok-photo a.not_ok").fadeIn();

	ok_notOK_call_1 = jQuery.ajax({
		url: "/" + PROJECT_NAME + "socialise/ok-the-photo",
		type: "POST",
		dataType: "json",
		data: { 'photo_id' : photo_id  ,'photo_posted_by_user_id' : photo_posted_by_user_id},
//		cache: false,
		timeout: 50000,
		success: function(jsonData) {
			if( jsonData.status == 1 )
			{
//  			Incrementing count.
		  		var updated_count  = parseInt( $(elem).parent().siblings("div.like_photo_count").children("a").text().replace(/[\])}[{(]/g,'') );
		  		if (isNaN(updated_count))
		  		{ 
		  			updated_count = 0;
		  		}
		  		updated_count = updated_count+1;
		  		$(".like_photo_count").children("a").text("("+updated_count+")");
		  		$(".like_photo_count").children("a").fadeIn();
		  	
		  		// show likers string.
		  		var xhtml='';
		  		xhtml+='<img src="'+IMAGE_PATH+'/tick-grey.png" width="12" height="13" alt=""/>';
				xhtml+=jsonData.ok_string;
				$("div#other-likethis_"+photo_id).html(xhtml);
				$("div#other-likethis_"+photo_id).fadeIn();
		
				//Now if wallpost id also received.
				if ( typeof jsonData.wallpost_id != "undefined" )
				{
					//Incrementing count.
			  		var updated_count  = parseInt( $( "div.ok div.like_count#"+jsonData.wallpost_id ).children("a").text().replace(/[\])}[{(]/g,'') );
			  		if ( isNaN(updated_count) )
			  		{ 
			  			updated_count = 0;
			  		}
			  		updated_count = updated_count+1;
			  		$("div.ok div#"+jsonData.wallpost_id+".like_count").children("a").text("("+updated_count+")");
			  		$("div.ok div#"+jsonData.wallpost_id+".like_count").children("a").fadeIn();
			  	
			  		// show likers string.
			  		var xhtml='';
			  		xhtml+='<img align="absmiddle" src="'+IMAGE_PATH+'/tick-grey.png">';
					xhtml+=jsonData.ok_string;
					$("div#"+jsonData.wallpost_id+".people-who-liked").html(xhtml);
					$("div#"+jsonData.wallpost_id+".people-who-liked").fadeIn();
					
					//One thing more, Change the OK to NOT OK on wallpost
					$("div.news-update-likes a.ok[rel="+jsonData.wallpost_id+"]").hide();
					$("div.news-update-likes a.not_ok[rel="+jsonData.wallpost_id+"]").fadeIn();
				}
				
				
				//Ajax call for sending 'ok' notification to wallpost owner 
				//and users who have done any activity on it.
				jQuery.ajax({
					url: "/" + PROJECT_NAME + "notifications/send-ok-notification",
					type: "POST",
					dataType: "json",
					data: { 'photo_id' :photo_id },
					success: function(jsonData) {	
					}
				});
			}
			else
			{
				return ;
			}      	
		},
		error: function(xhr, ajaxOptions, thrownError) {
  	
		}
	});
}
/**
 * function to not ok photo
 * @params int photo_id
 * @params int photo_posted_by
 * @param elem on which action performed
 * @author sjaiswal
 * @version 1.0
 */
function notOkThePhoto( photo_id, photo_posted_by_user_id, elem )
{
	// this condition is use for check the last ajax call state..
	if( ok_notOK_call_1 )
	{	
		if( ok_notOK_call_1.state() != "resolved" )
		{
			return;
		}
	}
	
	$("div.photo-likes a.ok").fadeIn();
	$("div.photo-likes a.not_ok").hide();
	$("div.ok-photo a.ok").fadeIn();
	$("div.ok-photo a.not_ok").hide();
	
	ok_notOK_call_1 = jQuery.ajax({
		url: "/" + PROJECT_NAME + "socialise/not-ok-the-photo",
		type: "POST",
		dataType: "json",
		data: { 'photo_id' : photo_id ,'photo_posted_by_user_id' : photo_posted_by_user_id },
//		cache: false,
		timeout: 50000,
		success: function(jsonData) {
			if( jsonData.status == 1 )
			{
//				Decrementing count.
	      		var updated_count = parseInt( $(elem).parent().siblings("div.like_photo_count").children("a").text().replace(/[\])}[{(]/g,'') )-1;
	      		$(".like_photo_count").children("a").text("("+updated_count+")");
	      		if( updated_count < 1 )
				{
	      			$(".like_photo_count").children("a").hide();
				}	

	      		// show likers string.
	      		if( jsonData.ok_string.length > 0 )
	      		{
		      		var xhtml='';
		      		xhtml+='<img src="'+IMAGE_PATH+'/tick-grey.png" width="12" height="13" alt=""/>';
		    		xhtml+=jsonData.ok_string;
		    		$("div#other-likethis_"+photo_id).html(xhtml);
		    		$("div#other-likethis_"+photo_id).fadeIn();
	      		}
	      		else
	      		{
	      			$("div#other-likethis_"+photo_id).hide();
	      		}
	      		
	      		
	      		//Now if wallpost id also received.
				if ( typeof jsonData.wallpost_id != "undefined" )
				{
					//Decrementing count.
		      		var updated_count = parseInt( $( "div.ok div#"+jsonData.wallpost_id+".like_count" ).children("a").text().replace(/[\])}[{(]/g,'') )-1;
		      		$("div.ok div#"+jsonData.wallpost_id+".like_count").children("a").text("("+updated_count+")");
		      		if( updated_count < 1 )
					{
		      			$("div.ok div#"+jsonData.wallpost_id+".like_count").children("a").hide();
					}
			  	
					// show likers string.
		      		if( jsonData.ok_string.length > 0 )
		      		{	
			      		var xhtml='';
			      		xhtml+='<img src="'+IMAGE_PATH+'/tick-grey.png" width="12" height="13" alt=""/>';
			    		xhtml+=jsonData.ok_string;
			    		$("div#"+jsonData.wallpost_id+".people-who-liked").html(xhtml);
			    		$("div#"+jsonData.wallpost_id+".people-who-liked").fadeIn();
		      		}
		      		else
		      		{
		      			$("div#"+jsonData.wallpost_id+".people-who-liked").hide();
		      		}
		      		
		      		//One thing more, Change the NOT OK to OK on wallpost
		      		$("div.news-update-likes a.ok[rel="+jsonData.wallpost_id+"]").fadeIn();
		      		$("div.news-update-likes a.not_ok[rel="+jsonData.wallpost_id+"]").hide();
				}
			}
			else
			{
				return ;
			}
		},
		error: function(xhr, ajaxOptions, thrownError) {
			
		}
	});
}
/**
 * function to get list of users who shared photo
 * @params int photo_id
 * @params int photo_posted_by
 * @params int login_user
 * @author sjaiswal
 * @author hkaur5
 * version 1.1
 */
function openUsersWhoSharedPhotoInPopup(photo_id , photo_posted_by, login_user)
{
	var offset = $('input#offset_who_shared_photo').val();
	var limit = $('input#limit_who_shared_photo').val();
	var nxt_offset = parseInt(offset)+parseInt(limit);
	
	$('#who_shared_listing_popup').bPopup(
	{
		modalClose: true,
	    easing: 'easeOutBack', //uses jQuery easing plugin
        speed: 500,
        zIndex : 13,
        closeClass : 'close_bpopup',
        onClose: function() {},
        onOpen: function() {
        	//Do required stuff...
        	$("div#list_of_who_shared").html("<div style = 'display : table-cell; height: 197px; width: 395px; text-align:center; vertical-align: middle;'><image src = "+IMAGE_PATH+"/loading_medium_purple.gif></div>");
        	jQuery.ajax({
                url: "/" + PROJECT_NAME + "profile/get-who-shared-photo",
                type: "POST",
                dataType: "json",
                data: { 'photo_id' : photo_id, 'photo_posted_by' : photo_posted_by,'offset':offset,'limit':limit },
                timeout: 50000,
                success: function( jsonData ) 
                {
                	if(jsonData.user_info)
                	{
                	var html = "<ol id='photos_users_who_shared'>";
                	for( i in jsonData.user_info )
                	{
                		
                		html += '<div style="width: 100%;border-bottom:1px solid #ededed;padding-bottom:10px !important;" class="comments-outer">';
                		html += '<div title="'+jsonData.user_info[i]["user_full_names"]+'" class="img">';
                		html += '<div>';
                		html += '<img src = "'+jsonData.user_info[i]["user_image"]+'"/>';
                		html += '</div>';
                		html += '</div>';
                		
                		html += '<div class="text" style="word-wrap: break-word; float: left; width: 84%; margin-top: 0px ! important;">';
                		
                		if( login_user == jsonData.user_info[i]["user_id"] )
                		{
	                		html += "<a href = '/"+PROJECT_NAME+"profile/iprofile/id/"+jsonData.user_info[i]["user_id"]+"' class='text-dark-purple'>Me</a>";
                		}
                		else
                		{	
	                		html += "<a href = '/"+PROJECT_NAME+"profile/iprofile/id/"+jsonData.user_info[i]["user_id"]+"' class='text-dark-purple' >"+jsonData.user_info[i]["user_full_names"]+"</a>";
                		}
                		
                		html += '<span id="link_'+jsonData.user_info[i]["user_id"]+'" class="get_shared_list_photodetail">';
                		switch ( jsonData.user_info[i]["link_info"].friend_type ) 
                		{
                		case 0:
							// case for inviting user
							if( login_user != jsonData.user_info[i]["user_id"] )
	                		{
								
								html +='<a id="linkToConnect_'+jsonData.user_info[i]["user_id"]+'" class="cursor-style invite_'+jsonData.user_info[i]["user_id"]+' invitation-request" title="Invite to Link" onclick="invitationToLinkOnPhotoDetail('+jsonData.user_info[i]["user_id"]+', this);">';
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
							html +='<a id="'+jsonData.user_info[i]["user_id"]+'" rel="'+jsonData.user_info[i]["link_info"]["link_id"]+'" class="cursor-style invite_'+jsonData.user_info[i]["user_id"]+' cancel-request" title="Cancel Request" href="javascript:;" onclick="cancelRequestOnPhotoDetail(this)">';
			    			//html +='<img src="'+IMAGE_PATH+'/cancel-request-icon.png" alt="Cancel Request"/>';
			    			html +='</a>';
						break;
						case 2:
							// case for accepting or rejecting request by user
							html +='<a id="'+jsonData.user_info[i]["user_id"]+'" rel="'+jsonData.user_info[i]["link_info"]["link_id"]+'" class="cursor-style invite_'+jsonData.user_info[i]["user_id"]+' accept-request" title="Accept Request" onclick="acceptRequestOnPhotoDetail(this);" href="javascript:;">';
							html +='</a>';	
							html +='<a id="'+jsonData.user_info[i]["user_id"]+'" rel="'+jsonData.user_info[i]["link_info"]["link_id"]+'" class="cursor-style decline_'+jsonData.user_info[i]["user_id"]+' decline-request" title="Decline Request" onclick="cancelRequestOnPhotoDetail(this);" href="javascript:;">';
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
                	html += '</ol>';
                	if(jsonData["is_more_records"])
        			{
	                	html += '<div class="view_more_who_shared">';
	                	html += '<p class="" >';
	                	html += '<a href="javascript:;" class="text-dark-purple" onclick=loadMoreWhoSharedPhoto('+photo_id+',this,'+nxt_offset+')>';
	                	html += 'View More';
	                	html += '</a>';
	                	html += '</p>';
	                	html += '</div>';
        			}
                	$("div#list_of_who_shared").html(html);
                }
            	else{
            		$("div#list_of_who_shared").html("Oops! Some error occurred while fetching records.We hope to have fix it soon!");}
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

/**
 * load/append more users who has shared photo.
 * 
 * @param wallpost_id
 * @param elem
 * @param offset
 * 
 * @author hkaur5
 */
function loadMoreWhoSharedPhoto( photo_id, elem, offset )
{
	var limit = $('input#limit_who_shared').val();
	$("div.view_more_who_shared p").html("<div style = 'display : table-cell;text-align:center; vertical-align: middle;'><image src = "+IMAGE_PATH+"/loading_small_purple.gif></div>");
	var nxt_offset = parseInt(offset)+parseInt(limit);
	
	jQuery.ajax({
	url: "/" + PROJECT_NAME + "profile/get-who-shared-photo",
	type: "POST",
	dataType: "json",
	data: { 'photo_id' : photo_id,'limit':limit, 'offset':offset },
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
			
			//For showing option of view more in case when more records are available.
			if(jsonData["is_more_records"])
			{
				html += '<div class="view_more_who_shared">';
				html += '<p class="" >';
				html += '<a href="javascript:;" class="text-dark-purple" onclick=loadMoreWhoSharedPhoto('+photo_id+',this,'+nxt_offset+')>';
				html += 'View More';
				html += '</a>';
				html += '</p>';
				html += '</div>';
			}
		$("div.view_more_who_shared").remove();
		$("ol#photos_users_who_shared").append(html);
		
	  	//bpopup reposition
		var bPopup = $("#who_shared_listing_popup").bPopup();
		bPopup.reposition();
	}
	else
	{
		$("div#list_of_who_shared").append("Oops! Some error occurred while fetching records.We hope to have fix it soon!");
	}
	},
	error: function(xhr, ajaxOptions, thrownError) {}
	});


}

/**
 * Sunny Patial.
 */
function getPhotoMoreComments(){
	$("a.view-comments").unbind();
	$("a.view-comments").on('click', function() {
		getMoreComments(5);
	});
}

function getMoreComments(numberOfRecords, status)
{
	var photoID = $("#comment-photo_id").val();
	var offset = $("#comment-offset_"+photoID).val();
	if(status == "delete"){
		offset = offset-1;
	}
	if(numberOfRecords!="")
	{
		jQuery.ajax({
			url: "/" + PROJECT_NAME + "profile/get-photo-more-comments",
			type: "POST",
			dataType: "json",
			data: { "photo_id" : photoID,"offset":offset,"nor":numberOfRecords },
			beforeSend: function(msg){
				
			},
			timeout: 50000,
			success: function(jsonData) {
			
				if(jsonData){
					var countLength = (jsonData.latest_five_comments).length;
					if(countLength>0){
						if(jsonData.is_there_more_comments==1){
							var newOffset = parseInt(offset)+parseInt(numberOfRecords);
							$("#comment-offset_"+photoID).val(newOffset);
						}
						else{
							$("#view-more-comments_"+photoID).parent().hide();
						}
						var html = '';
						for(var i=countLength-1;i>=0;i--){
							if(jsonData.latest_five_comments[i]["is_hidden"]==0)
							{
							html+='<div class="comment-write-box comment-write-box_'+jsonData.latest_five_comments[i]["comment_id"]+'" rel="'+jsonData.latest_five_comments[i]["comment_id"]+'">';
							html+='<div class="comment-write-box-img">';
							html+='<img src="'+jsonData.latest_five_comments[i]["comment_profes_image"]+'" width="32" height="32" alt=""/>';
							html+='</div>';
							html+='<div class="comment-write-box-text">';
							html+='<h5 style="width:100%;text-transform:none;">';
							//html+='<span class="commented-user">'+jsonData.latest_five_comments[i]["commenter_name"]+'</span>';
							html+='<span class="commented-user"><a href = "/'+PROJECT_NAME+'profile/iprofile/id/'+jsonData.latest_five_comments[i]['commenter_id']+'">'+jsonData.latest_five_comments[i]["commenter_name"]+'</a></span>';
							
							html+='<span class="display-comment" id="display-comment_'+jsonData.latest_five_comments[i]["comment_id"]+'">';
							html+=showCroppedText( jsonData.latest_five_comments[i]["comment_text"], 150, "...<label class = 'show_full_comment' onclick = 'showFullComment(this)'>>></label>");
							html+='</span>';

							html+='<span class="display-full-comment" style = "display:none;" id="display-comment_'+jsonData.latest_five_comments[i]["comment_id"]+'">';
							html+=jsonData.latest_five_comments[i]["comment_text"];
							html+='</span>';
							
							html+='</h5>';
							html+='<div class="comment-write-box-textarea comment-write-box-textarea_'+jsonData.latest_five_comments[i]["comment_id"]+'" >';
							html+='<textarea maxlength="255" class="comment-box-input" id="edit-comment_'+jsonData.latest_five_comments[i]["comment_id"]+'" name="edit-comment_'+jsonData.latest_five_comments[i]["comment_id"]+'">'+jsonData.latest_five_comments[i]["comment_text"]+'</textarea>';
							html+='</div>';
							html+='<p class="comments-date">';
							html+=jsonData.latest_five_comments[i]["created_at"];
							html+='</p>';
							html+='</div>';
							if(jsonData.latest_five_comments[i]["is_my_comment"]==1){
								// start of edit comment div..
								html+='<div class="editComment" id="editComment_'+jsonData.latest_five_comments[i]["comment_id"]+'" rel="'+jsonData.latest_five_comments[i]["comment_id"]+'" style="cursor:pointer;">';
								html+='<img src="'+IMAGE_PATH+'/icon-pencil4.png" title="Edit Comment" />';
								
								html+='<div id="editCommentOptions_'+jsonData.latest_five_comments[i]["comment_id"]+'" class="edit-comment-popup-outer" style="right: 0px; bottom: -60px; display: block;">';
								
								html+='<div class="edit-comment-popup-outer" style="margin: 0px 0px 0px 66px;">';
								html+='<img width="26" height="16" src="'+IMAGE_PATH+'/arrow-up-grey2.png">';
								html+='</div>';
								
								html+='<div class="edit-comment-popup">';
								html+='<div class="edit-comment-popup-col1">';
								html+='<h5><a class="text-grey2-link editing-comment" rel="'+jsonData.latest_five_comments[i]["comment_id"]+'" href="javascript:;">Edit</a></h5>';
								html+='</div>';
								
								html+='<div class="edit-comment-popup-col1">';
								html+='<h5><a href="javascript:;" rel="'+jsonData.latest_five_comments[i]["comment_id"]+'" class=" text-grey2-link" onclick="deletePhotoComment('+photoID+','+jsonData.latest_five_comments[i]["comment_id"]+', this)" >Delete</a></h5>';
								html+='</div>';
								html+='</div>';
								
								html+='</div>';
								
								html+='</div>';
								// end of edit comment div..								
							}
							else{
								html+='<div title="Hide Comment" class="hideComment" id="hideComment_'+jsonData.latest_five_comments[i]["comment_id"]+'" rel="'+jsonData.latest_five_comments[i]["comment_id"]+'" same-comment-id="'+jsonData.latest_five_comments[i]["same_comment_id"]+'" style="cursor:pointer;">';
								html+='<img src="'+IMAGE_PATH+'/cross-grey.png" title="Hide Comment" />';
								html+='</div>';
							}
							
							html+='</div>';
							}
							else{
								html+='<div title="Hidden Comment"  class="comment-write-box comment-write-box_'+jsonData.latest_five_comments[i]["comment_id"]+'" rel="'+jsonData.latest_five_comments[i]["comment_id"]+'" style="text-align:center;">';
								html+='<span class="photoHiddenComment photoHiddenComment_'+jsonData.latest_five_comments[i]["comment_id"]+'" rel="'+jsonData.latest_five_comments[i]["comment_id"]+'">';
								html+='...';
								html+='</span>';
								html+='</div>';
							}
							
						}	
						$("#comment-box_"+photoID).prepend(html);
					}
					else{
						$("#view-more-comments_"+photoID).parent().hide();
					}
					if(countLength>0){
						for(var i=countLength-1;i>=0;i--){
							var commentID = jsonData.latest_five_comments[i]["comment_id"];
							var sameCommentID = jsonData.latest_five_comments[i]["same_comment_id"];
							updateCommentWhenClickOnEnter(commentID);
						}
					}
				}
				displayEditCommentLinks();
				clickOnEditCommentLink();
				clickOnHideCommentLink();
				clickOnDotsShowCommentEvent();
			}
		});
	}
}
function submitFormWhenClickOnEnter(photoID){
	// click on enter and add your comment...
	$('#comment_'+photoID).keypress(function (e) {
		if (e.which == 13) {
			e.preventDefault();
			// $('form#comment_'+photoID).submit();
			submitYourComment(photoID);
		}
	});
}
function updateCommentWhenClickOnEnter(photo_commentID){
	// click on enter and add your comment...
	$('#edit-comment_'+photo_commentID).keypress(function (e) {
		if (e.which == 13) {
			if( $(this).val().trim() == "" )
			{
				alert('Please add some text for comment');
				$(this).val("");
				return;
			}
			e.preventDefault();
			updateYourComment(photo_commentID);
		}
	});
}
function updateYourComment(photo_commentID){

	var commentTxt = $("#edit-comment_"+photo_commentID).val();
	if($.trim(commentTxt)!=""){
		jQuery.ajax({
			url: "/" + PROJECT_NAME + "socialise/edit-photo-comment",
			type: "POST",
			dataType: "json",
			data: { "comment_id" : photo_commentID,"comment_text":commentTxt },
			beforeSend: function(msg){
				$("#edit-comment_"+photo_commentID).attr("disabled","disabled");
				$("#edit-comment_"+photo_commentID).addClass("disabledCss");
			},
			timeout: 50000,
			success: function(jsonData) {
				if(jsonData){
					$("#edit-comment_"+photo_commentID).removeAttr("disabled");
					$("#edit-comment_"+photo_commentID).removeClass("disabledCss");
					$(".comment-write-box-textarea_"+photo_commentID).hide();
					$("#display-comment_"+photo_commentID).html(jsonData.text);
					$("#display-comment_"+photo_commentID).fadeIn();
					
					//Updating comment on wall.
					if( $("input#isThisSocializeWall").val() == 1 )
					{
						if( typeof jsonData.wallpost_comment_id != 'undefined' )
						{	
							$("div#"+jsonData.wallpost_comment_id+".comment_text").html(jsonData.text);
							$("div#"+jsonData.wallpost_comment_id+".full_comment_text").html(jsonData.text);
							$("textarea#id_"+jsonData.wallpost_comment_id+".comment-textarea").val(jsonData.text);
						}
					}
				}
			}
		});	
	}
}

/**
 *  Where is the description? 
 *  And the name of the function
 *  should be like this: addComment() -jsingh7
 * 
 * @param photoID
 * @author spatial
 */
function submitYourComment(photoID)
{
	var comment = $("#comment_"+photoID).val();
	if($.trim($("#comment_"+photoID).val())!=""){
		var loginedUserID = $("#album_posted_by_"+photoID).val();
		jQuery.ajax({
			url: "/" + PROJECT_NAME + "socialise/add-comment-to-the-photo",
			type: "POST",
			dataType: "json",
			data: { "photo_id" : photoID,"comment":comment,"album_posted_by":loginedUserID },
			beforeSend: function(msg){
				$("#comment_"+photoID).attr("disabled","disabled");
				$("#comment_"+photoID).addClass("disabledCss");
			},
			timeout: 50000,
			success: function(jsonData) {
				
				if(jsonData)
				{
					var commentID = jsonData.comment_id;
					
					$("#comment_"+photoID).removeAttr("disabled");
					$("#comment_"+photoID).removeClass("disabledCss");
					
//					Comment stucture for photo slider/photo detail------------------------------------
					var html = '';
					html+='<div class="comment-write-box  comment-write-box_'+commentID+'" rel="'+commentID+'">';
					html+='<div class="comment-write-box-img">';
					html+='<img src="'+jsonData.commenter_small_image+'" width="32" height="32" alt=""/>';
					html+='</div>';
					html+='<div class="comment-write-box-text">';
					html+='<h5 style="width:100%;text-transform:none;">';
					html+='<span class="commented-user"><a href = "/'+PROJECT_NAME+'profile/iprofile/id/'+jsonData.commenter_id+'">'+jsonData.commenter_fname+' '+jsonData.commenter_lname+'</a></span>';
				
				
					html+='<span class="display-comment" id="display-comment_'+commentID+'">';
					html+=showCroppedText( jsonData.comm_text, 150, "...<label class = 'show_full_comment' onclick = 'showFullComment(this)'>>></label>");
					html+='</span>';
					html+='<span class="display-full-comment" style = "display : none;" id="display-comment_'+commentID+'">';
					html+=jsonData.comm_text;
					html+='</span>';
					
					html+='</h5>';
					html+='<div class="comment-write-box-textarea comment-write-box-textarea_'+commentID+'" >';
					html+='<textarea maxlength="255" class="comment-box-input" id="edit-comment_'+commentID+'" name="edit-comment_'+commentID+'">'+jsonData.comm_text+'</textarea>';
					html+='</div>';
					html+='<p class="comments-date">';
					html+=jsonData.created_at;
					html+='</p>';
					html+='</div>';
					
					// start of edit comment div.
					html+='<div class="editComment" id="editComment_'+commentID+'" rel="'+commentID+'" style="cursor:pointer;">';
						html+='<img src="'+IMAGE_PATH+'/icon-pencil4.png" title="Edit Comment" />';
			            
						html+='<div id="editCommentOptions_'+commentID+'" class="edit-comment-popup-outer" style="right: 0px; bottom: -60px; display: block;">';
						
							html+='<div class="edit-comment-popup-outer" style="margin: 0px 0px 0px 66px;">';
							html+='<img width="26" height="16" src="'+IMAGE_PATH+'/arrow-up-grey2.png">';
							html+='</div>';
							
							html+='<div class="edit-comment-popup">';
								html+='<div class="edit-comment-popup-col1">';
								html+='<h5><a class="text-grey2-link editing-comment" rel="'+commentID+'" href="javascript:;">Edit</a></h5>';
								html+='</div>';
							
								html+='<div class="edit-comment-popup-col1">';
								html+='<h5><a href="javascript:;" rel="'+commentID+'" class=" text-grey2-link" onclick="deletePhotoComment('+photoID+','+commentID+', this)" >Delete</a></h5>';
								html+='</div>';
						  	html+='</div>';
						
					  	html+='</div>';
					
					html+='</div>';
					// end of edit comment div.
					html+='</div>';
					
					
					
//					Comment stucture for socialize wall-------------------------------------------
					//Only required if we receive wallpost_id in JSON response.
					if( $("input#isThisSocializeWall").val() == 1 )
					{
						if( typeof jsonData.wallpost_id != 'undefined' )
						{
							var comment = "";
							comment += '<div id="comments-outer_'+jsonData.wallpost_comment_id+'" class="comments-outer comments-outer_'+jsonData.wallpost_comment_id+'" rel="'+jsonData.wallpost_comment_id+'">';
							
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
							comment += '<div rel="'+jsonData.wallpost_comment_id+'" id="idd_'+jsonData.wallpost_comment_id+'" class="comment-text1">';
							//comment += '<span title = "'+jsonData.commenter_fname+' '+jsonData.commenter_lname+'">'+showCroppedText(jsonData.commenter_fname+' '+jsonData.commenter_lname, 50)+'</span>';
							comment += '<span title = "'+jsonData.commenter_fname+' '+jsonData.commenter_lname+'"><a href="/'+PROJECT_NAME+'profile/iprofile/id/'+jsonData.commenter_id+'">'+showCroppedText(jsonData.commenter_fname+' '+jsonData.commenter_lname, 50)+'</a></span>';
							comment += '<div class = "comment_text" id = "'+jsonData.wallpost_comment_id+'">';
							comment += jsonData.comm_text;
							comment += '</div>';
							comment += '</div>';
							comment += '<textarea class="comment-textarea" maxlength="255" style="resize: vertical; display:none !important;" rel="'+jsonData.wallpost_comment_id+'" id="id_'+jsonData.wallpost_comment_id+'" rows="1" cols="1">'+jsonData.comm_text+'</textarea>';
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
							comment += '<a href="javascript:;" class=" text-grey2-link delete_comment_link" style="font-size:12px;" rel="'+jsonData.wallpost_comment_id+'">Delete</a>';
							comment += '</h5>';
							comment += '</div>';
							comment += '</div>';
							comment += '</div>';
							comment += '</div>';
							comment += '</div>';
							
							$("div#comments_outer_"+ jsonData.wallpost_id).append(comment);
							$("div#comment_box_" + jsonData.wallpost_id).show();
							$("div#comments_outer_"+ jsonData.wallpost_id+" div.comments-outer:LAST").fadeIn("slow");
							
							$( "div.comments span#comment_count_"+jsonData.wallpost_id).text("("+jsonData.comment_count+")");
							$( "div.comments span#comment_count_"+jsonData.wallpost_id).fadeIn();
							
//				        	Activate action controls for comments.
							activateCommentActions();
						}
					}
					
					$("#comment-box_"+photoID).show();
					$("#comment-box_"+photoID).append(html);
					$("#comment_"+photoID).val("");
					
					updateCommentWhenClickOnEnter(commentID);
					
					$( "div.comments span#comment_count_"+photoID).text("("+jsonData.comment_count+")");
					$( "div.comments span#comment_count_"+photoID).fadeIn();
					
				}
				
				displayEditCommentLinks();
				clickOnEditCommentLink();
				clickOnHideCommentLink();
				
				//Ajax call for sending 'comment' notification to photo owner 
				//and users who have done any activity on it.
				jQuery.ajax
				({
					url: "/" + PROJECT_NAME + "notifications/send-comment-notification",
					type: "POST",
					dataType: "json",
					data: { 'photo_id' : photoID,  },
					success: function(jsonData) 
					{
						
					}
				});
				
			}
		});	
	}
}
/**
 * Calls another function for Photo Detail/slider popup.
 * Do not use 'id_of_wallpost' for which_id.
 * 
 * @param id
 * @param which_id [it can have two value 'id_of_photo' or 'id_of_wallpost'][Now second option is depreciated] 
 * @param is_my_album [ pass 1 if album logged in user is album owner else 0 ]
 * 
 * @version 1.1
 * @author jsingh7
 */
function showPhotoDetail( id, which_id)
{
	
	getPhotoDetail( id, which_id);
	addArrowClickEvents();
}

function displayEditCommentLinks(){
	$(".comment-write-box").hover(function() {
		$("#editComment_"+$(this).attr("rel")).css("display","block");
		$("#hideComment_"+$(this).attr("rel")).css("display","block");
		$("#editCommentOptions_"+$(this).attr("rel")).css("display","none");
	});
	$(".comment-write-box").mouseleave(function() {
		$("#editComment_"+$(this).attr("rel")).css("display","none");
		$("#hideComment_"+$(this).attr("rel")).css("display","none");
		$("#editCommentOptions_"+$(this).attr("rel")).css("display","none");
	});
} 
function clickOnEditCommentLink(){
	$(".editComment").unbind( "click" );
	$(".editComment").click(function(event) {
		$("#editCommentOptions_"+$(this).attr("rel")).toggle();
	});
	// when user click on edit link..
	$(".editing-comment").unbind( "click" );
	$(".editing-comment").click(function(event) {
		$("span.display-comment").fadeIn();
		$("div.comment-write-box-textarea").hide();
		var commentID = $(this).attr("rel");
		$("span#display-comment_"+commentID).hide();
		$("div.comment-write-box-textarea_"+commentID).fadeIn();
	});
	
} 

function clickOnHideCommentLink(){
	$(".hideComment").click(function(event) {
		var comment_id = $(this).attr("same-comment-id");
		var wall_comment_id = $(this).attr("rel");
		jQuery.ajax({
			url: "/" + PROJECT_NAME + "socialise/hide-comment-of-user",
			type: "POST",
			dataType: "json",
			data: { 'comment_id' : wall_comment_id },
			success: function(jsonData) 
			{
				$(".comment-write-box_"+wall_comment_id).empty();
				$(".comment-write-box_"+wall_comment_id).css("text-align","center");
				
				html='<span rel="'+wall_comment_id+'" class="photoHiddenComment photoHiddenComment_"'+wall_comment_id+'>...</span>';
				
				$(".comment-write-box_"+wall_comment_id).html(html);
				$(".comment-write-box_"+wall_comment_id).css("opacity","1");
				clickOnDotsShowCommentEvent();
				//getMoreComments(1, "delete");
			},
			error: function(xhr, ajaxOptions, thrownError) {
				
			}
		});		
	});
}
/**
 *  function to delete photo comment on photo detail page
 * 
 * @param photoID
 * @param commentID
 * @author sjaiswal
 */
function deletePhotoComment(photoID, commentID, elem){
	$( "#dialog_confirm_comment2" ).dialog({
		resizable: false,
		width:250,
		height:180,
		modal: true,
		buttons: {
			 Cancel: 
    		 {
				 click: function () {
                    $(this).dialog("close");
                },
                text: 'Cancel',
                class: 'only_text'
             },
			"Delete": function() {
				$( this ).dialog( "close" );
				jQuery.ajax({
					url: "/" + PROJECT_NAME + "profile/delete-comment",
					type: "POST",
					dataType: "json",
					data: { 'comment_id' : commentID , 'photo_id': photoID},
					success: function(jsonData) {
						if( jsonData.comment_id )
						{
							$(".comment-write-box_"+commentID).remove();
							var numItems = $('div#comment-box_'+photoID+' div.comment-write-box').length;
							var seeMoreDiv = $('div.view-more-comment div.view-more-comments_'+photoID).length ;
										
							if(numItems == 0 && seeMoreDiv == 0){
								$('div#comment-box_'+photoID).hide();
							}
							var updated_count = parseInt( $( "div.comments span#comment_count_"+photoID ).text().replace(/[\])}[{(]/g,'') ) - 1;
							
							$( "div.comments span#comment_count_"+photoID ).text("("+updated_count+")");
							if( updated_count < 1 )
							{
								$( "div.comments span#comment_count_"+photoID ).hide();
							}
							
							//Removing comment from wallpost.
							if( jsonData.same_comment_id )
							{
								$("div#comments-outer_"+jsonData.same_comment_id).remove();
								
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
						}
						else
						{
							// $(thisss).parents("div.comments-outer").slideDown();
							$("div.comment-write-box_"+commentID).slideDown();
						}
					},
					error: function(xhr, ajaxOptions, thrownError) {
						alert("Comment not deleted. Please try agian.");
					}
				});
			}
		}
	});	
	
	
}

/**
 * function used to invite users to link on 'Ok' and 'share' popups on photo detail page
 * @param int acceptUserId
 * Author: sjaiswal
 * version: 1.0
 */
function invitationToLinkOnPhotoDetail(acceptUserId, elem)
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
        	html +='<a id="'+acceptUserId+'" class="cursor-style invite_'+acceptUserId+' cancel-request" title="cancel request" rel="'+link_id+'" onclick="cancelRequestOnPhotoDetail(this)"">';
        	html +='</a>';
        	$('span#link_'+acceptUserId).html(html);	
		},
        error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
		}
    });
}

/**
 * function used to 'cancel link request' on 'Ok' and 'share' popups on photo detail page
 * Author: sjaiswal
 * version: 1.0
 */
function cancelRequestOnPhotoDetail(event){
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
        			html+='<a id="'+profileID+'" class="cursor-style invite_'+profileID+' invitation-request" title="Invite to Link" href="javascript:;" onclick="invitationToLinkOnPhotoDetail('+profileID+', this);">';
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
 * function used to 'accept link request' on 'Ok' and 'share' popups on photo detail page
 * @author sjaiswal
 * @version 1.0
 */
function acceptRequestOnPhotoDetail(event){
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
        		html +='<a class="cursor-style compose-mail" title="Send Mail" href="'+ PROJECT_URL + PROJECT_NAME +'mail/compose#to_user:'+profileID+'">';
	    		html +='</a>';
    			$('span#link_'+profileID).html(html); 
		},
        error: function(xhr, ajaxOptions, thrownError) {
        	alert("Server Error.");
		}
    });
}
/**
 * function  used to show  popup who liked the photo detail .
 * @param int photo_id
 * @param int photo_posted_by_user_id
 * @param int login_user
 * @return string
 * @version 1.1
 * @author nsingh,sjaiswal.
 * @author hkaur5
 */
function openWhoLikedPopup( photo_id , photo_posted_by_user_id, login_user)
{
	var offset = $('input#offset_who_liked_photo').val();
	var limit = $('input#limit_who_liked_photo').val();

	var nxt_offset = parseInt(offset)+parseInt(limit);
	$('#who_liked_listing_popup').bPopup(
	{
		modalClose: true,
	    easing: 'easeOutBack', //uses jQuery easing plugin
        speed: 500,
        zIndex : 13,
        closeClass : 'close_bpopup',
        onClose: function() {},
        onOpen: function() {
      	//Do required stuff...
      	$("div#list_of_who_liked").html("<div style = 'display : table-cell; height: 197px; width: 395px; text-align:center; vertical-align: middle;'><image src = "+IMAGE_PATH+"/loading_medium_purple.gif></div>");
      	jQuery.ajax({
              url: "/" + PROJECT_NAME + "profile/get-who-like-photo",
              type: "POST",
              dataType: "json",
              data: { 'photo_id' : photo_id ,'photo_posted_by_user_id' : photo_posted_by_user_id,'offset':offset,'limit':limit },
              timeout: 50000,
              success: function( jsonData ) {
              	var html = "<ol id='photos_users_who_liked'>";
            	if(jsonData.user_info)
    			{
	              	for( i in jsonData.user_info )
	              	{
	              		html += '<div style="width: 100%;border-bottom:1px solid #ededed;padding-bottom:10px !important;" class="comments-outer">';
	              		html += '<div title="'+jsonData.user_info[i]["user_full_names"]+'" class="img short_profile_border">';
	              		html += '<div>';
	              		html += '<img src = "'+jsonData.user_info[i]["user_image"]+'"/>';
	              		html += '</div>';
	              		html += '</div>';
	              		
	              		html += '<div class="text" style="width: 84%!important; float:left; word-wrap: break-word; margin-top:0px !important;">';
	              		if( login_user == jsonData.user_info[i]["user_id"] )
	              		{
		                		html += "<a href = '/"+PROJECT_NAME+"profile/iprofile/id/"+jsonData.user_info[i]["user_id"]+"' class = 'text-purple-link'>Me</a>";
	              		}
	              		else
	              		{
		                		html += "<a href = '/"+PROJECT_NAME+"profile/iprofile/id/"+jsonData.user_info[i]["user_id"]+"' class = 'text-purple-link'>"+jsonData.user_info[i]["user_full_names"]+"</a>";
	              		}
	              	
	              		html += '<span id="link_'+jsonData.user_info[i]["user_id"]+'" class="open_who_like_photodetail">';
	              	switch ( jsonData.user_info[i]["link_info"].friend_type ) 
		            	{
							case 0:
								// case for inviting user
								if( login_user != jsonData.user_info[i]["user_id"] )
		                		{
									
									html +='<a id="linkToConnect_'+jsonData.user_info[i]["user_id"]+'" class="cursor-style invite_'+jsonData.user_info[i]["user_id"]+' invitation-request" title="Invite to Link" onclick="invitationToLinkOnPhotoDetail('+jsonData.user_info[i]["user_id"]+', this);">';
									html +='</a>';
		                		}
								else
								{
									html += '';                			
		                		}
							break;
							case 1:
								// when user revert back his/her link request
								//html += '<span id="link_'+jsonData.user_info[i]["user_id"]+'" style = "color : #6C518F; float:right;margin-right:10px">';
								html +='<a id="'+jsonData.user_info[i]["user_id"]+'" rel="'+jsonData.user_info[i]["link_info"]["link_id"]+'" class="cursor-style invite_'+jsonData.user_info[i]["user_id"]+' cancel-request " title="Cancel Request" href="javascript:;" onclick="cancelRequestOnPhotoDetail(this)">';
				    			html +='</a>';
							break;
							case 2:
								// case for accepting or rejecting request by user
								//html += '<span id="link_'+jsonData.user_info[i]["user_id"]+'" style = "color : #6C518F; float:right;margin-right:10px">';
								html +='<a id="'+jsonData.user_info[i]["user_id"]+'" rel="'+jsonData.user_info[i]["link_info"]["link_id"]+'" class="cursor-style invite_'+jsonData.user_info[i]["user_id"]+' accept-request" title="Accept Request" onclick="acceptRequestOnPhotoDetail(this);" href="javascript:;">';
								html +='</a>';	
								html +='<a id="'+jsonData.user_info[i]["user_id"]+'" rel="'+jsonData.user_info[i]["link_info"]["link_id"]+'" class="cursor-style decline_'+jsonData.user_info[i]["user_id"]+' decline-request" title="Decline Request" onclick="cancelRequestOnPhotoDetail(this);" href="javascript:;">';
								html +='</a>';
							break;
							case 3:
								// case when request is accepted and user can send mail to his linked user
								if( $("input[type=hidden]#my_user_id").val() != jsonData.user_info[i]["user_id"] )
		                		{
									//html += '<span id="link_'+jsonData[i]["user_id"]+'" style = "color : #6C518F; float:right;margin-right:10px;">';
									html +='<a class="cursor-style compose-mail" title="Send Mail" href="'+ PROJECT_URL + PROJECT_NAME +'mail/compose#to_user:'+jsonData.user_info[i]["user_id"]+'">';
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
	              	//For view more
	              	if(jsonData["is_more_records"])
					{
						html += '<div class="view_more_who_liked">';
						html += '<p class="" >';
						html += '<a href="javascript:;" class="text-dark-purple" onclick=loadMoreWhoLikedPhoto('+photo_id+',this,'+nxt_offset+','+photo_posted_by_user_id+')>';
						html += 'View More';
						html += '</a>';
						html += '</p>';
						html += '</div>';
					}
	              	$("div#list_of_who_liked").html(html);
				}
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

/**
 * fetching and displaying records of people who liked photo
 * according to offset and limit.
 * 
 * @param wallpost_id
 * @param bit/boolean view_more
 * @author hkaur5
 * @version 1.1
 */
function loadMoreWhoLikedPhoto( photo_id,elem,offset,photo_posted_by_user_id )
{
	var limit = $('input#limit_who_liked_photo').val();
	console.log(limit);
	$("div.view_more_who_liked p").html("<div style = 'display : table-cell;text-align:center; vertical-align: middle;'><image src = "+IMAGE_PATH+"/loading_small_purple.gif></div>");
	var nxt_offset = parseInt(offset)+parseInt(limit);
	
	jQuery.ajax({
		url: "/" + PROJECT_NAME + "profile/get-who-like-photo",
		type: "POST",
		dataType: "json",
		data: { 'photo_id' : photo_id,'offset':offset,'limit':limit,'photo_posted_by_user_id':photo_posted_by_user_id },
		timeout: 50000,
		success: function( jsonData ) {
			if(jsonData.user_info)
			{
//				var html = "<ol>";
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
				html += '</ol>';
				if(jsonData["is_more_records"])
				{
					html += '<div class="view_more_who_liked">';
					html += '<p class="" >';
					html += '<a href="javascript:;" class="text-dark-purple" onclick=loadMoreWhoLikedPhoto('+photo_id+',this,'+nxt_offset+')>';
					html += 'View More';
					html += '</a>';
					html += '</p>';
					html += '</div>';
				}
				$("div.view_more_who_liked").remove();
				$("ol#photos_users_who_liked").append(html);
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
function clickOnDotsShowCommentEvent(){
	$(".photoHiddenComment").unbind();
	$(".photoHiddenComment").click(function(event) {

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
					var html = "";
		        	
		    		html+='<div class="comment-write-box-img">';
						html+='<img src="'+jsonData.commenter_small_image+'" width="32" height="32" alt=""/>';
					html+='</div>';
					
					html+='<div class="comment-write-box-text">';
						html+='<h5 style="width:100%;text-transform:none;">';
						//html+='<span class="commented-user">'+jsonData.commenter_fname+' '+jsonData.commenter_lname+'</span>';
						html+='<span class="commented-user"><a href = "/'+PROJECT_NAME+'profile/iprofile/id/'+jsonData.commenter_id+'">'+jsonData.commenter_fname+' '+jsonData.commenter_lname+'</a></span>';
						
						html+='<span class="display-comment" id="display-comment_'+jsonData.commenter_id+'">';
						html+=showCroppedText( jsonData.comm_text, 150, "...<label class = 'show_full_comment' onclick = 'showFullComment(this)'>>></label>");
						html+='</span>';
						html+='<span class="display-full-comment" style = "display:none;" id="display-comment_'+jsonData.commenter_id+'">';
						html+=jsonData.comm_text;
						html+='</span>';
						
						html+='</h5>';
					
						html+='<div class="comment-write-box-textarea comment-write-box-textarea_'+jsonData.commenter_id+'" >';
						html+='<textarea maxlength="255" class="comment-box-input" id="edit-comment_'+jsonData.commenter_id+'" name="edit-comment_'+jsonData.commenter_id+'">'+jsonData.comm_text+'</textarea>';
						html+='</div>';
					
						html+='<p class="comments-date">';
						html+=jsonData.created_at;
						html+='<a rel="'+jsonData.same_comm_id+'" commid="'+jsonData.comm_id+'" href="javascript:;" id="unhideUserComment_'+jsonData.same_comm_id+'" class="unhideUserComment">Unhide</a>';
						html+='</p>';
					
					html+='</div>';
				
					html+='<div title="Hide Comment" class="hideComment" same-comment-id="'+jsonData.same_comm_id+'" id="hideComment_'+jsonData.comm_id+'" rel="'+jsonData.comm_id+'"  style="cursor:pointer;">';
					html+='<img src="'+IMAGE_PATH+'/cross-grey.png" title="Hide Comment" />';
					html+='</div>';
					
		    		elem.empty();
		        	elem.html(html);
		        	elem.css({ 'opacity' : '0.3', 'text-align' : 'justify'});
		        	elem.removeClass("hidden_comment");
		        	displayEditCommentLinks();
		        	clickOnHideCommentLink();
		        	unHideHiddenCommentOnPhoto();
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
function unHideHiddenCommentOnPhoto()
{
	$("a.unhideUserComment").unbind();
	$("a.unhideUserComment").click(function(){
		var elem = $(this).parent();
		var comment_id = $(this).attr("rel");
		var comm_same_id = $(this).attr("commid");
		
		jQuery.ajax({
			url: "/" + PROJECT_NAME + "socialise/unhide-comment-of-user",
			type: "POST",
			dataType: "json",
			data: { 'comment_id' : comm_same_id },
			success: function(jsonData) {
				$("#unhideUserComment_"+comment_id).remove();
				$(".comment-write-box_"+comm_same_id).css("opacity","1");
				$(".comment-write-box_"+comm_same_id).css("text-align","justify");
			},
			error: function(xhr, ajaxOptions, thrownError) {
				//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
				//$(thisss).parents("div.comments-outer").slideDown();
				alert("Some error occured. Please try agian.");
			}
		});
	});
}
/**
* Please add docmentation!
*
*
*/
function invitationToUser(acceptUserId, elem)
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
		$("span#"+idd).remove();
		$('#youmay-know-col_'+acceptUserId).slideUp("slow");
		showDefaultMsg( "Link request has been sent.", 1 );
		$('span#link_'+acceptUserId).html('Link request sent');
	},
	error: function(xhr, ajaxOptions, thrownError) {
		//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
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
	$(elem).parents("span.display-comment").hide();
	$(elem).parents("span.display-comment").siblings("span.display-full-comment").fadeIn();
}

//function for to MAKE AS A COVER PHOTO which work on click event
//sunny patial
function makeAsCoverPhoto(){
	$(".makeAsCoverPhoto").unbind();
	$(".makeAsCoverPhoto").click(function(event){
		$(".alert-box").remove();
		$(".alert-box1").remove();
		$(".alert-box2").remove();
		__addOverlay();
		// idsString contain Album id,Photo id.
		$("#photoID").val("");
		var idsString=$(this).attr("rel");
		var ids=idsString.split(",");
		$("#photoID").val(ids[1]);
		$.ajax({
			url : "/" + PROJECT_NAME + "profile/make-as-cover-photo",
			method : "POST",
			data : "albumID="+ids[0]+"&photoID="+ids[1],
			type : "post",
			dataType : "json",
			success : function(jsonData) {
				__removeOverlay();
				if($(".popup-wrapper").css('display')!="none")
				{
					$(".popup-wrapper").bPopup().close();					
				}
				if(jsonData==1){
					showDefaultMsg( "Cover photo changed.", 1 );
				}
				else{
					showDefaultMsg( "Server Error.", 2 );
				}
			}
		});
		event.preventDefault();
	});
}

//-------------NEXT 3 functions added by hkaur5 (made by spatial)----------//
//@author spatial

//function for to close bpopup which work on click event
//sunny patial
function closebPopup(){
	$(".close_photo_popup").click(function() {
		$("#movePhoto").bPopup().close();
	});
}
//function for to MOVE PHOTO TO OTHER ALBUM which work on click event
//sunny patial
function movePicture(elem){
//	$("#movePicture").unbind();
//	$("#movePicture").click(function(event){
		__addOverlay();
//		var photoIDs=$("#photoID").val();
		
		
		var albumID=$("#otherAlbums").val();
//		var prevAlbumID=$("#albumID").val();
		var idsString=$(elem).attr("rel");
		var ids=idsString.split(",");
		var photoID = ids[1];
		
		var prevAlbumID = ids[0];
		
		$.ajax({
			url : "/" + PROJECT_NAME + "profile/move-photo-to-other-album",
			method : "POST",
			data : "albumID="+albumID+"&photoID="+photoID+"&prevAlbumID="+prevAlbumID,
			type : "post",
			dataType : "json",
			success : function(jsonData) 
			{
				if (jsonData)
				{
					__removeOverlay();
					
					$("div.popup-wrapper").bPopup().close();
					$("div.popup").bPopup().close();
					$("div.col2_"+photoID).remove();
				}
			}
		});
		
//	});
}

//function for to GET LIST OF ANOTHER ALBUMS which work on click event
//sunny patial
function getOtherAlbumsForUser(elem){
//	$(".moveToAnotherAlbum").click(function(event){
		__addOverlay();
		// idsString contain Album id,Photo id.
		$("#photoID").val("");
		var idsString=$(elem).attr("rel");
		var ids=idsString.split(",");
		$("#photoID").val(ids[1]);
		$.ajax({
			url : "/" + PROJECT_NAME + "profile/get-other-albums-for-user",
			method : "POST",
			data : "albumID="+ids[0]+"&photoID="+ids[1],
			type : "post",
			dataType : "json",
			success : function(jsonData) {
				__removeOverlay();
				$("#otherAlbums").empty();
				var html="";
				for(var i=0;i<jsonData.length;i++)
				{
					if(jsonData[i]['album_name'].toLowerCase()!="default")
					{
						html+="<option value='"+jsonData[i]['id']+"'>"+jsonData[i]['album_name']+"</option>";
					}
				}
				$("#otherAlbums").append(html);
				
				$("#movePhoto").bPopup();
				$('input#movePicture').attr('rel',ids[0]+','+ids[1]);
			}
		});
//		event.preventDefault();
//	});
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
	
	$(elem).parents("span.display-comment").hide();
	$(elem).parents("span.display-comment").siblings("span.display-full-comment").fadeIn();
}

/**
 * Shares the selected wallpost on the wall. 
 * 
 * @param wallpost_id
 * @author jsingh7, spatial
 * @version 1.0
 * 
 * @deprecated [same function in photo_feed.js]
 * 
 */
/*function sharePhotofeedFromWall(wallpost_id, wallpost_from_user_id, elem)
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
			var privacy = $("select#privacydd").val();
			var jdata = $("div#share_box form").serialize()+"&wallpost_id="+wallpost_id+"&wallpost_from_user_id="+wallpost_from_user_id+"&shared_from_photodetail_to_wall=0&shared_from_wall_to_wall=1";
			jQuery.ajax({
				url: "/" + PROJECT_NAME + "socialise/share-photofeed-from-wall",
				type: "POST",
				dataType: "json",
				data: jdata,
				timeout: 50000,
				success: function( jsonData ) {
					// send email message...
					if(shareOnEmail == 1){
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
							jsonData.user_name,
							jsonData.user_image,
							jsonData.feed_image,
							jsonData.new_wallpost_text,
							jsonData.photo_text,
							jsonData.image_created_at,
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
							9,
							[]
					);
					
					//Prepending wallpost/photofeed on wall.
					$("div#updates_holder").prepend( wall_post );
					$("div.news-update-content:first").fadeIn();
					
					//Updating share count of the post from which we are sharing this post.
					$("div.share_count a span#wallpost_"+jsonData.source_wall_post_id).text("("+jsonData.source_photofeed_share_count+")");
					
					//closing share popup
					$( "span#"+iddd ).remove();
					$(elem).fadeIn();
					$('div#share_photo_feed_popup').bPopup().close();
					
					
					//Ajax call for sending 'share' notification to wallpost owner 
					//and users who have done any activity on it.
					jQuery.ajax({
						url: "/" + PROJECT_NAME + "socialise/send-share-notification",
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
}*/