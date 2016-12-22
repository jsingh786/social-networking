var ok_notOK_call_1;
var comment_edit_ajax_call;
var comment_delete_ajax_call;
var comment_hide_ajax_call;
$(document).ready(function(){
	
	$( ".photo-detail" ).on( "click", function() {
		showPhotoDetail($(this).attr("photo-id")); 
	});
	
	$("input#offsett").val(0);
	
	loadMorePictures( $("input#offsett").val(), 12);
	
	
	
	// when user click on the Add new album button...
	$(".more-photos").click(function() {
		getAddMorePhotosPopup();
	});

	
	$('#minimise_menu').click(function(){
		 $( "div.col2" ).animate({
			 margin: "10px 0 10px 34px",
			 }, 300, function() {
			 // Animation complete.
			 });
	});
	$('a#maximise_menu').click(function(){
		 $( "div.col2" ).animate({
			 margin: "10px 0 10px 3px",
			 }, 300, function() {
			 // Animation complete.
			 });
	});
	
//	movePicture();
	makeAsCoverPhoto();
//	getOtherAlbumsForUser();
	deleteAlbumPhoto();
	closebPopup();
	
	//Added by hkaur5
	//Confirmation dialog for deleting album
	$( "div#confirm_delete_album" ).dialog(
	{
      modal: true,
      autoOpen: false,
      draggable:false,
      width: 360,
      show: 
      {
    	  effect: "fade"
	  },
	  hide: 
	  {
		  effect: "fade"
	  },
      buttons: 
      {
    	  OK: function() 
    	  {
    		  $( this ).dialog( "close" );
    		  deleteCurrentAlbum($(this).data('album_id')); 
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
	
	//Close Add album popup
	$('div.photoalbum-addnew').on('click','img.close_add_photos', function(){
	
		$('div.photoalbum-addnew').children('div.fr').children('div').children('div').fadeOut('fast');
	});
	//-------------------------------------Comment actions----------------------------------------------------
	$( "div.comments-outer").unbind( "mouseover" );
	$("div.comments-outer").mouseover(function()
	{
		$(this).children( "div.edit_comment" ).show();
		$(this).children( "div.hide_comment" ).show();
	});
	
	$( "div.comments-outer").unbind( "mouseout" );
	$("div.comments-outer").mouseout(function()
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
	



	
	
	//-----------------------------------------------------------------------------------------
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
			'Delete': function()
			{
				$( this ).dialog( "close" );
				$("div#comments-outer_"+$(this).data('comment_id')).fadeOut();
				deleteComment($(this).data('comment_id'), $(this).data('element'));
			}
	      }
	});
	
	
});

/**
 * Hidding comment and showing "... div " .
 * @param control
 * @author hkaur5
 */
function hideComment(element)
{
	if($(element).attr("status"))
	{
			$(element).parents("div.comments-outer").css("opacity",0.3);
			var thisss = $(element);
			var comment_id = $(element).siblings("div.text").children("div.comment-text1").attr("rel");
			$(thisss).parents("div.comments-outer").addClass("hidden_comment");
			$(thisss).parents("div.comments-outer").css("opacity",1);
			$(thisss).parents("div.comments-outer").html('<span onclick="showComments(this);" rel="'+comment_id+'" class="unhide-comment" title = "Hidden Comment [Hidden on your wall]">...</span>');
	}
	else
	{
		if( comment_hide_ajax_call && comment_hide_ajax_call.state() != "resolved" )
		{
			alert("Please wait...");
		}
		else
		{
			$(element).parents("div.comments-outer").css("opacity",0.3);
			//var thisss = this;
			var comment_id = $(element).siblings("div.text").children("div.comment-text1").attr("rel");
			
			comment_hide_ajax_call = jQuery.ajax(
			{
				url: "/" + PROJECT_NAME + "socialise/hide-comment-of-user",
				type: "POST",
				dataType: "json",
				data: { 'comment_id' : comment_id },
				success: function(jsonData) 
				{
					if( jsonData == 1 )
					{	
						//if( $(thisss).parents("div.ok-comment-box").children().children().children("div.comments-outer").length == 0 )
						
						$("div#comments-outer_"+comment_id+".comments-outer").addClass("hidden_comment");
						$("div#comments-outer_"+comment_id+".comments-outer").css("opacity",1);
						$("div#comments-outer_"+comment_id+".comments-outer").html('<span onclick="showComments(this);"rel="'+comment_id+'" class="unhide-comment" title = "Hidden Comment [Hidden on your wall]">...</span>');
					}
					else
					{
						$("div#comments-outer_"+comment_id+".comments-outer").css("opacity",1);
					}
				},
				error: function(xhr, ajaxOptions, thrownError) 
				{
					//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
					$("div#comments-outer_"+comment_id+".comments-outer").css("opacity",1);
					alert("Error occured! Please try agian.");
				}
			});
		}
	}

}

/**
 * Delete album
 * @author hkaur5
 * @param integer album_id
 */
function deleteCurrentAlbum( album_id )
{
	__addOverlay();
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/delete-my-album",
		method : "POST",
		data : {"album_id":album_id},
		type : "post",
		dataType : "json",
		success : function(jsonData) 
		{
			if (jsonData)
			{
				window.location.href="/" + PROJECT_NAME + "profile/photo-albums";
			}
			else
			{
				__removeOverlay();
				showDefaultMsg( "An error has occurred while deleting an album! Please try again after some time.", 2 );
				
			}
		}
	});
}

//function for to DELETE ALBUM PHOTO which work on click event
//sunny patial
function deleteAlbumPhoto(){
	$(".alert-box").remove();
	$(".deleteAlbumPhoto").unbind();
	$(".deleteAlbumPhoto").click(function(event){
		$(".alert-box").remove();
		// idsString contain Album id,Photo id.
		$("#photoID").val("");
		var idsString=$(this).attr("rel");
		$( "#dialog-confirm" ).dialog({
				resizable: false,
				height:200,
				modal: true,
				buttons: {
					"Remove": function() 
					{
						$( this ).dialog( "close" );
						__addOverlay();
						var ids=idsString.split(",");
						$("#photoID").val(ids[1]);
						$.ajax({
							url : "/" + PROJECT_NAME + "profile/delete-album-photo",
							method : "POST",
							data : "albumID="+ids[0]+"&photoID="+ids[1],
							type : "post",
							dataType : "json",
							success : function(jsonData) {
								__removeOverlay();
								if( jsonData == 1 )
								{
									$("div.col2_"+ids[1]).remove();
									showDefaultMsg( "Image deleted successfully.", 1 );
									
									//alert-box message_box
								}
								
								else
								{
									alert("An error occured while deleting records regarding photo!");
								}	
							}
						});
						event.preventDefault();
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
	});
}
//function for to DISPLAY PENCIL ICON which work on click event
//sunny patial
function displayEditLinks(){
	$(".col2").hover(function() {
		$("#edit_"+$(this).attr("rel")).css("display","block");
		$("#editOptions_"+$(this).attr("rel")).css("display","none");
	});
	$(".col2").mouseleave(function() {
		$("#edit_"+$(this).attr("rel")).css("display","none");
		$("#editOptions_"+$(this).attr("rel")).css("display","none");
	});
}

function clickOnEditLink(){
	$(".editPhoto").unbind( "click" );
	$(".editPhoto").click(function(event) {
		$("#editOptions_"+$(this).attr("rel")).toggle();
	});
}

// Getting Add New Album popup...
// @author: Sunny Patial.
function getAddMorePhotosPopup()
{
	$(".quickview").empty();
	var html="";
	html += ' <img width="21" height="20" title="Close" alt="Cancel" src="'+IMAGE_PATH+'/cross2.png" class="close_add_photos">';
	html=html + '<div class="album-pop-top" style="text-align:center;"><input name="addPhotos" type="button" class=" btn-blue" value="Add More Photos" alt="Add More Photos" title="Add More Photos" /></div>';
	html=html + '<div class="album-pop-mid"></div>';
	html=html + '<div class="album-pop-top"><input type="button" id="mulitplefileuploader" name="mulitplefileuploader" style="display:none;" /> </div>';
	
	html=html + '<div class="album-pop-bot" style="display:none;"><div class="dd"><div id="win-xp8">';
	html=html + '</div></div>';
	html=html + '<input name="postPhotos" type="button" class="btn-blue" value="Post Photos" alt="Post Photos" title="Post Photos" />';
	html=html + '</div>';
	
	$("div#quickview-outer-photos.quickview-outer .quickview").append(html);
	$("div#quickview-outer-photos.quickview-outer").fadeToggle(function(){
		removeTempDirectory();
	});
	addNewAlbum();
}

// function used to remove user directory from temp folder..
//@author: Sunny Patial.
function removeTempDirectory(){
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/remove-temp-directory",
		method : "POST",
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			// console.log(jsonData);
		}
	});
}
// Add new album button event...
//@author: Sunny Patial.
function addNewAlbum(){
	$("[name=addPhotos]").click(function(){
		$("#mulitplefileuploader").next().html("");
		$(".ajax-file-upload-statusbar").fadeOut("slow");
			$( ".ajax-file-upload").unbind( "click" );
			// calling ajax-file-upload-button
			addUploaderSettings();
			$(".ajax-file-upload").click();
	});
	
	$("[name=postPhotos]").click(function(){
		// calling ajax-file-upload-button
		postPhotos();	
	});
}

// Store Album Info...
// @author: Sunny Patial.
function postPhotos(){
	var iddd = addLoadingImage($("[name=postPhotos]"), "after");
	var albumID=$("input#albumID").val();
	var name=$("input#albumName").val();
	
	//Array for post_photos-------------------------------------
	var temp_photo_arr = {};
	var photo_arr = {};
	
	$.each( $("div.album-pop-mid div.col1"), function( key, value ) {

		//console.log(key);
		//console.log($(this).attr("temp_path"));
		temp_photo_arr = {};
		var index  = $(this).children('textarea#photo_desc').attr('rel');
		
		temp_photo_arr[index] = $(this).children('textarea#photo_desc').val();
		photo_arr['index_'+key] = temp_photo_arr;
	});
	
	//----------------------------------------------------------
	
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/post-photos-under-existing-album",
		method : "POST",
		data : "album_name="+name+"&album_id="+albumID+'&photo_name_desc_arr='+JSON.stringify(photo_arr),
		type : "post",
		dataType : "json",
		success : function(jsonData) 
		{
			$("div.noRecFound").remove();
			$("span#"+iddd).remove();
			var i;
			var html='';
			for(i=jsonData.img.length-1;i>=0;i--)
			{
				html=html+'<div class="col2 col2_'+jsonData.photoId[i]+' whitebox" rel="'+jsonData.photoId[i]+'">';
				html=html+'<div class="edit editPhoto" id="edit_'+jsonData.photoId[i]+'" rel="'+jsonData.photoId[i]+'" style="cursor:pointer;">';			
				html=html+'<img title="Edit photo"  src="/'+PROJECT_NAME+'public/images/icon-pencil-hover.png" width="16" height="16" />';
				
				if(jsonData.moveOtherAlbumLinkStatus==1)
				{
					html=html+='<div style="bottom:-100px; right:0;display:none;" class="edit-popup-outer" id="editOptions_'+jsonData.photoId[i]+'">';
				}
				else
				{
					html=html+='<div style="bottom:-75px; right:0;display:none;" class="edit-popup-outer" id="editOptions_'+jsonData.photoId[i]+'">';
				}
				
				html=html+='<div style=" margin:0 0 0 148px"  class="edit-popup-arrow">';
				html=html+='<img width="26" height="16" src="/'+PROJECT_NAME+'public/images/arrow-up-grey2.png">';
				html=html+='</div>';
				html=html+='<div class="edit-popup">';
				html=html+='<div class="edit-popup-col1">';
				html=html+='<h5><a href="javascript:;" class="text-grey2-link deleteAlbumPhoto" rel="'+jsonData.albumId+','+jsonData.photoId[i]+'">Delete Photo</a></h5>';
				html=html+='</div>';
				if(jsonData.moveOtherAlbumLinkStatus==1)
				{
					html=html+='<div class="edit-popup-col1">';
					html=html+='<h5><a onclick="getOtherAlbumsForUser(this);" href="javascript:;" class=" text-grey2-link moveToAnotherAlbum" rel="'+jsonData.albumId+','+jsonData.photoId[i]+'" >Move Photo to Another Album</a></h5>';
					html=html+='</div>';
				}
				
				html=html+='<div class="edit-popup-col1">';
				html=html+='<h5><a href="javascript:;" class="text-grey2-link makeAsCoverPhoto" rel="'+jsonData.albumId+','+jsonData.photoId[i]+'">Make it Album Cover</a></h5>';
				html=html+='</div>';
				html=html+='</div>';
				html=html+='</div>';
				html=html+='</div>';
				
				//As this ajax call always take place when user is in their album, 
				//so there is no need to check whether it is logged in user or not.
				html=html+'<a photo-id="'+jsonData.photoId[i]+'" onclick = "showPhotoDetail('+jsonData.photoId[i]+','+"'id_of_photo'"+')" class="photo-detail" href="javascript:;">';
//				html=html+'<div class="photo-center" >';
				html=html+'<img src="'+jsonData.img[i]+'">';
//				html=html+'</div>';			
				html=html+'</a>';
				if(jsonData.photo_desc[i])
				{
					html=html+'<div class="caption photo_caption">';
					html=html+'<div class="caption_hover col2-link2 text-white">'+showCroppedText(jsonData.photo_desc[i], 15);
					html=html+'</div>';
				}
				else
				{
					html=html+'<div class="caption photo_caption default_photo_caption">';

					html=html+'<div class="caption_hover col2-link2 text-white default_caption">Say something about this photo';
					html=html+'</div>';
				}
				html=html+'</div>';
				html=html+'</div>';
			}
			$(".photo-slider-bot").prepend(html);
			$("div#quickview-outer-photos.quickview-outer").fadeToggle();
			displayEditLinks();
			clickOnEditLink();
//			movePicture();
			makeAsCoverPhoto();
//			getOtherAlbumsForUser();
			deleteAlbumPhoto();
			closebPopup();
			addImageClickEvent();
		}
	});
}
// Multiple file uploader settings...
//@author: Sunny Patial.
function addUploaderSettings(){
	// alert($('input[name=myfile]').get(0).files.length);
	// multiple file uploader settings...
	var settings = {
		url: "/" + PROJECT_NAME + "profile/add-more-photos",
		method: "POST",
		allowedTypes:"jpg,png,gif,jpeg",
		fileName: "myfile",
		multiple: true,
		maxFileSize:1024*1024*5,
		returnType:'json',
		showStatusAfterSuccess:false,
		showAbort:false,
		showDone:false,
		onSubmit : function(q, r) {
			//$("#fb-root").next().remove();
		},
		onSuccess:function(files,data,xhr)
		{
			//$("#fb-root").next().remove();
			var html='';
			if(data){
				html += '<div class="col1">';
					html += '<div style="width:131px;height:131px;vertical-align:middle;text-align:center;display:table-cell;border:1px solid #6C518F;">';
						html += '<img style="margin:0px !important;" src="'+PUBLIC_PATH+'/'+data['image_path']+'">';
					html += '</div>';
					html += '<textarea maxlength="255" rel="'+data['image_name']+'" id="photo_desc" class="add_photo_desc" placeholder="Add description"></textarea>';
				html +='</div>';				
			}
			else{
				$("#mulitplefileuploader").next().append('<div><font color="red"><b>'+files+'</b> is an corrupt image<br></font></div>');
			}
			$(".album-pop-mid").append(html);
			$(".album-pop-bot").fadeIn();
		},
		onError: function(files,status,errMsg)
		{	
			//$("#fb-root").next().remove();
			$("#status").html("<font color='red'>Upload is Failed</font>");
		}
	}
	$("#mulitplefileuploader").uploadFile(settings);
}
/**
* opens dialog box to confirm deletion of album.
* @author hkaur5
* @param element
*
*/
function confirmDeleteAlbum(element)
{
	var album_id = $(element).attr('rel');
	$( "div#confirm_delete_album" ).data('album_id',album_id).dialog( "open" );
}

/**
 * function for loading more albums on photo albums page
 * @author sjaiswal
 * @param offset 
 * @param limit 
 * @version 1.1
 */
function loadMorePictures(offset,limit)
{
	
	offset = typeof offset !== 'undefined' ? offset : 0;
	var name=$("input#albumName").val();
	
	var currentUserId = $("input#currentUserId").val();
	var albumOwnerId = $("input#albumOwnerId").val();
	
	var albumId = $('#albumID').val();
	
	
	$.ajaxQueue({
		url : "/" + PROJECT_NAME + "profile/get-album-pictures",
		method : "POST",
		data: { 'offset' : offset ,'limit':limit,'albumId':albumId,'albumOwnerId':albumOwnerId,},
		type : "post",
		dataType : "json",
		timeout: 50000,
		beforeSend: function( xhr )
		{
			$("div.loading_pictures").show();
		},
		success : function(jsonData) 
		{
			$("div.loading_pictures").hide();
			
			if( jsonData.total_pictures == 0 )
			{
				var html='';
				html = "<div class='no_messages' style=''>There are no photos in this album.</div>";
				$("div.photo-slider-bot").append(html);
				return;
			}
			
			for( i in jsonData.data)
        	{
				var html='';
				html=html+'<div class="col2 col2_'+jsonData.data[i].photo_id+' whitebox" rel="'+jsonData.data[i].photo_id+'">';
				
				//Checks whether to show edit options. 
				if( jsonData.data[i].is_my_photo )
				{
					html=html+'<div class="edit editPhoto" id="edit_'+jsonData.data[i].photo_id+'" rel="'+jsonData.data[i].photo_id+'" style="cursor:pointer;">';			
					html=html+'<img title="Edit photo"  src="/'+PROJECT_NAME+'public/images/icon-pencil-hover.png" width="16" height="16" />';
					if(name!="album_default" && jsonData.data[i].moveOtherAlbumLinkStatus==1)
					{
						html=html+='<div style="bottom:-100px; right:0;display:none;" class="edit-popup-outer" id="editOptions_'+jsonData.data[i].photo_id+'">';
					}
					else
					{
						html=html+='<div style="bottom:-75px; right:0;display:none;" class="edit-popup-outer" id="editOptions_'+jsonData.data[i].photo_id+'">';
					}
			
					html=html+='<div style=" margin:0 0 0 148px"  class="edit-popup-arrow">';
					html=html+='<img width="26" height="16" src="/'+PROJECT_NAME+'public/images/arrow-up-grey2.png">';
					html=html+='</div>';
					html=html+='<div style=" padding:0px; float:right;" class="edit-popup">';
					html=html+='<div style=" padding:0px; margin:0; width:100%;" class="edit-popup-col1">';
					html=html+='<h5 style="margin:0;"><a style="display:block; padding:5px; margin:0;" href="javascript:;" class="text-grey2-link deleteAlbumPhoto" rel="'+jsonData.data[i].album_id+','+jsonData.data[i].photo_id+'">Delete Photo</a></h5>';
					html=html+='</div>';
					if(name!="album_default" && jsonData.data[i].moveOtherAlbumLinkStatus==1)
					{
						html=html+='<div style=" padding:0px; margin:0; width:100%;" class="edit-popup-col1">';
						html=html+='<h5 style="margin:0;"><a onclick="getOtherAlbumsForUser(this);" style="display:block; padding:5px; margin:0;" href="javascript:;" class=" text-grey2-link moveToAnotherAlbum" rel="'+jsonData.data[i].album_id+','+jsonData.data[i].photo_id+'" >Move Photo to Another Album</a></h5>';
						html=html+='</div>';
					}
			
					html=html+='<div style=" padding:0px; margin:0; width:100%;" class="edit-popup-col1">';
					html=html+='<h5 style="margin:0;"><a style="display:block; padding:5px; margin:0;" href="javascript:;" class="text-grey2-link makeAsCoverPhoto" rel="'+jsonData.data[i].album_id+','+jsonData.data[i].photo_id+'">Make it Album Cover</a></h5>';
					html=html+='</div>';
					html=html+='</div>';
					html=html+='</div>';
					html=html+='</div>';
				}
			
				//As this ajax call always take place when user is in their album, 
				//so there is no need to check whether it is logged in user or not.
				if(jsonData.data[i].realPath)
				{
					//Only albumOwner can see text (say something about this photo)
					if(currentUserId == albumOwnerId)
					{
						html=html+'<a photo-id="'+jsonData.data[i].photo_id+'" onclick = "showPhotoDetail('+jsonData.data[i].photo_id+','+"'id_of_photo'"+')" class="photo-detail" href="javascript:;">';
					}
					else
					{
						html=html+'<a photo-id="'+jsonData.data[i].photo_id+'" onclick = "showPhotoDetail('+jsonData.data[i].photo_id+','+"'id_of_photo'"+')" class="photo-detail" href="javascript:;">';
					}
					html=html+'<img src="'+jsonData.data[i].imgurl+'">';		
					html=html+'</a>';
				}
				else
				{
					html=html+'<img src="'+IMAGE_PATH+'/no_image.png">';		
				}
				
				if(jsonData.data[i].description)
				{
					html=html+'<div class="caption photo_caption">';
					html=html+'<div class="caption_hover col2-link2 text-white lt">'+showCroppedText(jsonData.data[i].description,15,'...');	
				}
				
				html=html+'</div>';
				
				html=html+'</div>';
		
				$("div.photo-slider-bot").append(html);
				
				
			
				//incrementing offset.
				$("input#offsett").val( parseInt( $("input#offsett").val() ) + 1 );

				displayEditLinks();
				clickOnEditLink();
//				movePicture();
				makeAsCoverPhoto();
//				getOtherAlbumsForUser();
				deleteAlbumPhoto();
				closebPopup();
    		}
			
			
			if( jsonData.is_there_more_pictures )
			{
				loadMorePictures( $("input#offsett").val(), 12);
			}
			
		}
	});
	
	
	
	
	
	
	
	
	
}

/**
 *  Ok album 
 *  Ok works in two ways one is for those albums which have wallpost like users custom albums
 *  and for those albums which dont have any associated wallpost like Desfault album, profile photos album.
 *  
 *  @param integer post_id(album_id or wallpost_id)
 *  @param object elem(this)
 *  @param boolean for_wallpost(1 or 0, 1 when album does has any associated wallpost and 0 in case when  
 *  album which does not has any associated wallpost like default album)
 *  
 *  @author hkaur5
 */
function okTheWallpostOrAlbum( post_id, elem, for_wallpost,$album_id )
{
	$album_id = typeof $album_id !== 'undefined' ? $album_id : "";
	if( ok_notOK_call_1 )
	{	
		if( ok_notOK_call_1.state() != "resolved" )
		{
			return;
		}
	}
	
	$(elem).hide();
	$(elem).siblings("a.not_ok").fadeIn();
	
	if(for_wallpost)
	{
		ok_notOK_call_1 = jQuery.ajax({
	        url: "/" + PROJECT_NAME + "socialise/ok-the-wallpost",
	        type: "POST",
	        dataType: "json",
	        data: { 'wallpost_id' : post_id },
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
	        		
	        		//Updating likers string
	        		$("div#"+post_id+".people-who-liked").fadeIn();
	        		$("div#"+post_id+".people-who-liked span").html(jsonData.likers_string);
					
//					Ajax call for sending 'ok' notification to wallpost owner 
//					and users who have done any activity on it.
					jQuery.ajax({
						url: "/" + PROJECT_NAME + "notifications/send-ok-notification",
						type: "POST",
						dataType: "json",
						data: { 'album_id' : $album_id },
						success: function(jsonData) {
							
						}
					});
					
	        	}
	        	else
	        	{
	        		showDialogMsg("Ok album","Some error has occured.Please try again.");
	        	}	
	        },
	        error: function(xhr, ajaxOptions, thrownError) {
	        	
	        }
		});
	}
	else if( !for_wallpost )
	{
		ok_notOK_call_1 = jQuery.ajax({
	        url: "/" + PROJECT_NAME + "socialise/ok-the-album",
	        type: "POST",
	        dataType: "json",
	        data: { 'album_id' : post_id },
	        timeout: 50000,
	        success: function(jsonData) {
	        	if( jsonData.is_success == 1 )
	        	{
	        		//Incrementing count.
	        		var updated_count = parseInt( $(elem).parent().siblings("div.like_count").children("a").text().replace(/[\])}[{(]/g,'') )+1;
	        		
	        		$ (elem).parent().siblings("div.like_count").children("a").text("("+updated_count+")");
	        		$(elem).parent().siblings("div.like_count").children("a").fadeIn();
	        		
	        		//Updating likers string
	        		$("div#"+post_id+".people-who-liked").fadeIn();
	        		$("div#"+post_id+".people-who-liked span").html(jsonData.likers_string);
					
//					Ajax call for sending 'ok' notification to album owner 
//					and users who have done any activity on it.
					jQuery.ajax({
						url: "/" + PROJECT_NAME + "notifications/send-ok-notification",
						type: "POST",
						dataType: "json",
						data: { 'album_id' : $album_id },
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

}
/**
 *  Not Ok album 
 *  Not Ok works in two ways one is for those albums which have wallpost like users custom albums
 *  and for those albums which dont have any associated wallpost like Desfault album, profile photos album.
 *  
 *  @param integer post_id(album_id or wallpost_id)
 *  @param object elem(this)
 *  @param boolean for_wallpost(1 or 0, 1 when album does has any associated wallpost and 0 in case when  
 *  album which does not has any associated wallpost like default album)
 *  @author hkaur5
 */
function notOkTheWallpostOrAlbum( wallpost_id, elem, for_wallpost )
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
	if( for_wallpost )
	{
		ok_notOK_call_1 = jQuery.ajax(
		{
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
	else
	{
		ok_notOK_call_1 = jQuery.ajax(
				{
					url: "/" + PROJECT_NAME + "socialise/not-ok-the-album",
					type: "POST",
					dataType: "json",
					data: { 'album_id' : wallpost_id },
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
		$(this).children( "div.hide_comment" ).show();
	});
	
	$( "div.comments-outer").unbind( "mouseout" );
	$("div.comments-outer").mouseout(function(){
		$(this).children( "div.edit_comment" ).hide();
		$(this).children( "div.hide_comment" ).hide();
	});
	
//	$( "div.edit_comment").unbind( "click" );
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
    					
    					$('div.text div#'+jsonData.id+'.comment_text').text(jsonData.text );
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
	


}

function clickDeleteComment(element)
{
	//Clicking delete comment icon.
		var thiss = element;
		var comment_id = $(element).attr("rel");
		var dialog_data = $("#dialog_delete_comment").data();  
		
		dialog_data.comment_id = comment_id;
		dialog_data.element = thiss;
		$( "#dialog_delete_comment" ).dialog( "open" );


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
			if( jsonData.comment_id )
			{
				if(jsonData.wallpost_id)
				{
					var id = jsonData.wallpost_id;
				}
				else if(jsonData.album_id)
				{
					 id = jsonData.album_id;
				}
				$("div#comments-outer_"+comment_id).remove();
				
				var numItems = $('div#comment_box_'+id+' div.comments-outer').length;
				var seeMoreDiv = $('div#comment_box_'+id+' div.ok-comment-box-bot-right').length ;
				
				if(numItems == 0 && seeMoreDiv == 0){
					$('div#comment_box_'+id).hide();
				}
				
				var updated_count = parseInt( $( "div.comments span#comment_count_"+id ).text().replace(/[\])}[{(]/g,'') ) - 1;
				$( "div.comments span#comment_count_"+id ).text("("+updated_count+")");
				if( updated_count < 1 )
				{
					$( "div.comments span#comment_count_"+id ).hide();
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
 * Show comment detail in faded form when click on hidden comment.
 * @param control_name
 * @author ?
 * @author hkaur5
 */
function showComments(element)
{
	var rel = $(element).parent().attr("rel");
	var elemClass = "comments-outer_"+rel;
	var comment_id = $(element).attr("rel");
//	console.log(elemClass);
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
	    		comment += '<div onclick="hideComment(this);" style="text-align:right;margin:10px;" status="hide" class="hide_comment hide_comment_'+jsonData.comm_id+'"><img title="Hide comment" src="'+IMAGE_PATH+'/cross-grey.png"></div>';
	    		$("div#"+elemClass).html();
	    		$("div#"+elemClass).html(comment);
	    		$("div#"+elemClass).css("opacity","0.3");
	    		$("div#"+elemClass).removeClass("hidden_comment");
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
 * Load comments given wallpost.
 * @param wallpost_id
 * @param elem (element clicked)
 * @author unknown
 * @author hkaur5
 * @see photofeed.js/loadMoreComments
 */
function loadMoreComments( wallpost_or_album_id, elem, for_wallpost )
{
	var idddd = addLoadingImage($('div#load_more_comments_'+wallpost_or_album_id), "before");
	$('div#load_more_comments_'+wallpost_or_album_id).hide();
	
	
	// Change the name of action in case default, cover or 
	// profile album is used i.e. when album has no associated wallpost 
	// and for_wallpost is 0.
	var action_name = "get-comments-for-wallpost";
	if(for_wallpost)
	{
		action_name = "get-comments-for-wallpost";
	}
	else
	{
		action_name = "get-comments-for-album";
	}
    jQuery.ajax({
    	 url: "/" + PROJECT_NAME + "socialise/"+action_name,
         type: "POST",
         dataType: "json",
         data: { 'wallpost_id' : wallpost_or_album_id,
    	 		'album_id':wallpost_or_album_id, 
    	 		'offset' : $("input[type=hidden]#offsettt_comm_"+wallpost_or_album_id).val()
    	 		},
         timeout: 50000,
         success: function( jsonData ) 
         {
        	var comments_json = jsonData.data;
         	for( j in comments_json )
         	{
         		var html = "";
         		if( comments_json[j]['is_hidden'] == 0 )
     	    	{
         			html += '<div id="comments-outer_'+comments_json[j]['comment_id']+'" class="comments-outer comments-outer_'+comments_json[j]['comment_id']+'">';
     			    
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
     		    		html += '<h5 style="text-transform: none !important;"><a style="font-size:12px;" onclick="clickDeleteComment(this);" class=" text-grey2-link delete_comment_link" href="javascript:;" rel = "'+comments_json[j]['comment_id']+'">Delete</a></h5>';
     		    		html += '</div>';
     		    		html += '</div>';
     		    		html += '</div>';
     		    		html += '</div>';
     		    	}
     		    	else
     		    	{
     		    		html += '<div onclick="hideComment(this);" style="text-align:right;margin:10px;" class="hide_comment"><img title="Hide comment" src="'+IMAGE_PATH+'/cross-grey.png"></div>';
     		    	}
     		    	
     		    	html += '</div>';
     	    	}
     	    	else
     	    	{
     	    		html += '<div id="comments-outer_'+comments_json[j]['comment_id']+'" class="comments-outer hidden_comment comment-outer-popup-border" rel="'+comments_json[j]['comment_id']+'">';
     	    		html += '<span rel="'+comments_json[j]['comment_id']+'" onclick="showComments(this);" class="unhide-comment" title = "Hidden Comment [Hidden on your album]">...</span></div>';
     	    	}
         		$( "div#comments_outer_"+wallpost_or_album_id ).prepend(html);
         	}
         	
         	$("input[type=hidden]#offsettt_comm_"+wallpost_or_album_id).val( parseInt( $("input[type=hidden]#offsettt_comm_"+wallpost_or_album_id ).val() ) + parseInt(j) + 1 );
         	
         	//Remove loading.
         	$("span#"+idddd).remove();
         	
//         	checking if there are more records to show or not?
         	if( jsonData.is_there_more_recs == 0 )
         	{
         		$('div#load_more_comments_'+wallpost_or_album_id).remove();
         	}
         	else
         	{	
         		$('div#load_more_comments_'+wallpost_or_album_id).fadeIn();
         	}
         	
         	activateCommentActions(wallpost_or_album_id);
        },
        error: function(xhr, ajaxOptions, thrownError) 
        {

        }
	});
}


/**
 * Used to show share popup collage.
 * 
 * @param photos_arr
 * @param first_img_portrait_or_landscape
 * @author sjaiswal
 * @version 1.1
 * @see photofeed.js/getPopupCollageHTML
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
 * 
 * @param wallpost_id/album_id
 * @param elem
 * @param boolean for_wallpost [to check if album has any associated wallpost or not]
 * @param integer $socialise_album_id
 */
function addComment( wallpost_or_album_id, elem, event, for_wallpost,$socialise_album_id )
{
	
	//In this function we are using album_id and socialise_album_id which contain same value but 
	// are used in different ajax call for different purpose.
	// we use album id when we have to call add-comment-to-the-wallpost/add-comment-to-the-album, in album_id we put wallpost_or_album_id
	// on the basis of for_wallpost(when 0) and socialise_album_id is used for send-comment-notification.
	
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
	
	var action_name = "add-comment-to-the-wallpost";
	if( for_wallpost )
	{
		action_name = "add-comment-to-the-wallpost";
	}
	else
	{
		action_name = "add-comment-to-the-album";
	}
	jQuery.ajax({
		url: "/" + PROJECT_NAME + "socialise/"+action_name,
		type: "POST",
		dataType: "json",
		data: {
			"wallpost_id" : wallpost_or_album_id,
			"album_id" :wallpost_or_album_id,
			"comment" : $("form#comment_box_"+wallpost_or_album_id+" textarea").val()
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
			comment += '<a onclick="clickDeleteComment(this);" href="javascript:;" class=" text-grey2-link delete_comment_link" style="font-size:12px;" rel="'+jsonData.comm_id+'">Delete</a>';
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
			
			$( "div.comments span#comment_count_"+wallpost_or_album_id).text("("+jsonData.comment_count+")");
			$( "div.comments span#comment_count_"+wallpost_or_album_id).fadeIn();
			
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
				data: { 'album_id' : $socialise_album_id },
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
 * @author jsingh7,sjaiswal
 * @version 1.1
 */
function openWhoLikedPopupByWallpostIdOrAlbumId( wallpost_id, for_wallpost )
{
	var offset = $('input#offset_who_liked').val();
	var limit = $('input#limit_who_liked').val();
	var nxt_offset = parseInt(offset)+parseInt(limit);
	var album_id = null;
	var action = 'get-who-like-post';
	// Send album_id in case default, cover or 
	// profile album is used i.e. when album has no associated wallpost 
	// and for_wallpost is 0.
	if(!for_wallpost)
	{
		album_id = wallpost_id;
		action = 'get-who-liked-album';
	}
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
                url: "/" + PROJECT_NAME + "socialise/"+action,
                type: "POST",
                dataType: "json",
                data: { 'wallpost_id' : wallpost_id, 'album_id': album_id, 'offset':offset, 'limit':limit },
                timeout: 50000,
                success: function( jsonData ) {
                	if(jsonData.user_info)
        			{
                	var html = "<ol id='albums_users_who_liked'>";
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
                		if( $("input[type=hidden]#currentUserId").val() == jsonData.user_info[i]["user_id"] )
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
							if( $("input[type=hidden]#currentUserId").val() != jsonData.user_info[i]["user_id"] )
	                		{
							html +='<a id="linkToConnect_'+jsonData.user_info[i]["user_id"]+'" class="cursor-style invite_'+jsonData.user_info[i]["user_id"]+' invitation-request" title="Invite to Link" onclick="invitationToLinkOnAlbum('+jsonData.user_info[i]["user_id"]+', this);">';
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
							html +='<a id="'+jsonData.user_info[i]["user_id"]+'" rel="'+jsonData.user_info[i]["link_info"]["link_id"]+'" class="cursor-style invite_'+jsonData.user_info[i]["user_id"]+' cancel-request" title="Cancel Request" href="javascript:;" onclick="cancelRequestOnAlbum(this)">';
			    			//html +='<img src="'+IMAGE_PATH+'/cancel-request-icon.png" alt="Cancel Request"/>';
			    			html +='</a>';
						break;
						case 2:
							// case for accepting or rejecting request by user
							html +='<a id="'+jsonData.user_info[i]["user_id"]+'" rel="'+jsonData.user_info[i]["link_info"]["link_id"]+'" class="cursor-style invite_'+jsonData.user_info[i]["user_id"]+' accept-request" title="Accept Request" onclick="acceptRequestOnAlbum(this);" href="javascript:;">';
							//html +='<img src="'+IMAGE_PATH+'/accept-request-icon.png" alt="Accept Request"/>';
							html +='</a>';	
							html +='<a id="'+jsonData.user_info[i]["user_id"]+'" rel="'+jsonData.user_info[i]["link_info"]["link_id"]+'" class="cursor-style decline_'+jsonData.user_info[i]["user_id"]+' decline-request" title="Decline Request" onclick="cancelRequestOnAlbum(this);" href="javascript:;">';
							//html +='<img src="'+IMAGE_PATH+'/decline-request-icon.png" alt="Decline Request"/>';
							html +='</a>';
						break;
						case 3:
							// case when request is accepted and user can send mail to his linked user
							if( $("input[type=hidden]#currentUserId").val() != jsonData.user_info[i]["user_id"] )
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
    					html += '<a href="javascript:;" class="text-dark-purple" onclick=loadMoreWhoLikedAlbum('+wallpost_id+',this,'+nxt_offset+','+for_wallpost+')>';
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
function loadMoreWhoLikedAlbum( wallpost_id,elem,offset, for_wallpost )
{
	var album_id = null;
	var action = 'get-who-like-post';
	if(!for_wallpost)
	{
		album_id = wallpost_id;
		action = 'get-who-liked-album';
	}
	var limit = $('input#limit_who_liked').val();
	$("div.view_more_who_liked p").html("<div style = 'display : table-cell;text-align:center; vertical-align: middle;'><image src = "+IMAGE_PATH+"/loading_small_purple.gif></div>");
	var nxt_offset = parseInt(offset)+parseInt(limit);
	jQuery.ajax({
		url: "/" + PROJECT_NAME + "socialise/"+action,
		type: "POST",
		dataType: "json",
		data: { 'wallpost_id' : wallpost_id,'album_id':album_id,'offset':offset,'limit':limit },
		timeout: 50000,
		success: function( jsonData ) 
		{
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
					if( $("input[type=hidden]#currentUserId").val() == jsonData.user_info[i]["user_id"] )
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
						if( $("input[type=hidden]#currentUserId").val() != jsonData.user_info[i]["user_id"] )
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
						if( $("input[type=hidden]#currentUserId").val() != jsonData.user_info[i]["user_id"] )
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
					html += '<div class="view_more_who_liked">';
					html += '<p class="" >';
					html += '<a href="javascript:;" class="text-dark-purple" onclick=loadMoreWhoLikedAlbum('+wallpost_id+',this,'+nxt_offset+','+for_wallpost+')>';
					html += 'View More';
					html += '</a>';
					html += '</p>';
					html += '</div>';
				}
				$("div.view_more_who_liked").remove();
				$("ol#albums_users_who_liked").append(html);
				
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
* common function used to invite users to link on like and share popups 
 * @author hkaur5
 * version: 1.0
 */
function invitationToLinkOnAlbum(acceptUserId, elem)
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
        	html +='<a id="'+acceptUserId+'" class="cursor-style invite_'+acceptUserId+' cancel-request" title="cancel request" rel="'+link_id+'" onclick="cancelRequestOnAlbum(this)"">';
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
 * Author: hkaur5
 * version: 1.0
 */
function cancelRequestOnAlbum(event){
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
        			html+='<a id="'+profileID+'" class="cursor-style invite_'+profileID+' invitation-request" title="Invite to Link" href="javascript:;" onclick="invitationToLinkOnAlbum('+profileID+', this);">';
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
 * @author hkaur5
 * @version 1.0
 */
function acceptRequestOnAlbum(event){
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
 * Opens popup to share.
 * 
 * @param integer wallpost_or_album_id[this value can be album_id or wallpost_id]
 * @param elem [this]
 * @param boolean for_wallpost [this can be 1 or 0 if album has associated wallpost and does not has any wallpost respectively.
 * for_wallpost will be 1 when we send wallpost_id in wallpost_or_album_id]
 * @param integer album_id 
 * @author hkaur5
 * @version 1.2
 */
function shareThisAlbumByWallpostOrAlbumId( wallpost_or_album_id, elem, for_wallpost, socialise_album_id )
{
	//In this function we are using album_id and socialise_album_id which contain same value but 
	// are used in different ajax call for different purpose.
	// we use album id when we have to call share-photofeed-info, in album_id we put wallpost_or_album_id
	// on the basis of for_wallpost(when 0) and socialise_album_id is used for send-share-notification 
	
	var album_id = '';
	var action_name = 'get-photofeed-info';
	
	// Send album_id and change the name of action in case of default, cover or 
	// profile album i.e. when album has no associated wallpost 
	// and for_wallpost is 0.
	if(!for_wallpost)
	{
		album_id = wallpost_or_album_id;
		action_name = "get-album-info";
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
                url: "/" + PROJECT_NAME + "socialise/"+action_name,
                type: "POST",
                dataType: "json",
                data: { 'wallpost_id' : wallpost_or_album_id, 'album_id':album_id },
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
                	//html += '<img src = "'+jsonData.wallpost_gallery_size_socialise_photo_path+'"/>';
                	html += getPopupCollageHTML( jsonData.collage, jsonData.first_img_portrait_or_landscape );
                
                	html += '</div>';
                	
					html += '</div>';
					
					html += '<div class="share-hdr2-rt collage_text">';
//					html += '<h4>'+jsonData.wallpost_user_name+'</h4>';
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
            		html += '<a id="share_popup" style="float:left;" href="javascript:;" onclick = "shareAlbum('+wallpost_or_album_id+', '+jsonData.collage[0]['image_posted_by']+', this,'+for_wallpost+','+socialise_album_id+')">';
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
                                    method:'resize',
                    				onFinish:function(container){
                                        //container.children().removeClass('require_jquery_thumbnail_processing');
                                    }
                    			}
                    		);
                    });
                	
                	retrieveUsersWithAutocomplete();
                	addIndividualCheckBoxEvent();
                	$('#privacydd').sSelect();
                	$('#privacydd').getSetSSValue(2);
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
/**
 * Shares the album on wall and imail.
 * Uses ajax call through which whole album photos 
 * goes in default album and shared on wall as default album group.
 * 
 * In first case only Execute 2 cases -> 
 * 	1. Sharing albums which have associated wallposts
 *  2. Sharing albums that are mere group of photos like profile pictures, 
 *  cover photo and default album.
 * 
 * @param integer wallpost_id/album_id
 * @param integer logged in user id
 * @param boolean album to be shared belongs to 1st = 1 or 2nd case =  0.
 * @param integer socialise_album_id
 * @author hkaur5
 * @version 1.0
 */
function shareAlbum(wallpost_or_album_id, wallpost_from_user_id, elem, for_wallpost, socialise_album_id)
{
	//In this function we are using album_id and socialise_album_id which contain same value but 
	// are used in different ajax call for different purpose.
	// we use album id when we have to call share-photo-feed-from-wall-to wall, in album_id we put wallpost_or_album_id
	// on the basis of for_wallpost(when 0) and socialise_album_id is used for send-share-notification 
	
	
	var album_id = '';
	var sharing_album_only = 0;
	var for_album = 0;
	
	//This parameter is here used to check that which kind of album we are sharing 
	// Album which has wallpost id will have this value equals to 1 and albums which 
	// has no wallpost id will have share_from_wall_to_wall equals to 0.
	var shared_from_wall_to_wall = 1;
	
	// Send album_id in case of default, cover or 
	// profile album i.e. when album has no associated wallpost 
	// and 'for_wallpost' is 0.
	if(!for_wallpost)
	{
		album_id = wallpost_or_album_id;
		sharing_album_only = 1;
		for_album = 1;
		shared_from_wall_to_wall = 0;
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
			var jdata = $("div#share_box form").serialize()+"&wallpost_id="+wallpost_or_album_id+"&wallpost_from_user_id="+wallpost_from_user_id+"&album_id="+album_id+"&sharing_album_only="+sharing_album_only+"&shared_from_photodetail_to_wall=0&shared_from_wall_to_wall="+shared_from_wall_to_wall;
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
							data: {"share_text_msg":emailMsgText,"wallpost_id":wallpost_or_album_id, "receiver_id":userIDs,"for_album" :for_album } ,
							success: function(jsonData) 
							{
								
							}
						});
					}
					
					//Removing loading sign.
					$("span#"+iddd).hide();
					//Showing up button again.
					$(elem).fadeIn();
					$('div.share_count span').html('('+jsonData.share_count_of_post+')');
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
					
					//Updating share count of album which we are sharing.
					$("div.share_count a span#wallpost_"+wallpost_or_album_id).text("("+jsonData.share_count_of_album+")");
					
					//closing share popup
					$( "span#"+iddd ).remove();
					$(elem).fadeIn();
					$('div#share_photo_feed_popup').bPopup().close();
					
					
					$( 'div.news-update-content:first img.require_jquery_thumbnail_processing' ).each(function( index ) 
					{
                    	jQuery( this ).nailthumb(
            			{
            				onStart:function(container){},
                            width: $(this).attr('rel_width'),
                            height: $(this).attr('rel_height'),
                            method:'crop',
            				onFinish:function(container){}
            			});
                    });
					
					//Ajax call for sending 'share' notification to wallpost owner 
					//and users who have done any activity on it.
				jQuery.ajax({
						url: "/" + PROJECT_NAME + "notifications/send-share-notification",
						type: "POST",
						dataType: "json",
						data: { 'album_id' : socialise_album_id },
						success: function(jsonData)
						{
							
						}
					});
				},
				error: function(xhr, ajaxOptions, thrownError) 
				{
					//Show dialog after sharing(if error occured).
					showDialogMsg( "Sharing", "Problem occured while sharing. Please try again after some time.", 3000, 
					{
						buttons: [
				        {
				            text: "OK",
				            click: function(){$(this).dialog("close");}
				        }
					    ],
					    show: {effect: "fade"},
						hide: { effect: "fade"},
						dialogClass: "general_dialog_message",
						height: 200,
						width: 300
					});
				}
			});
		}
		
		
		//Sharing wallposts in imails.
		else if(shareOnWall == 0 && shareOnEmail == 1 )
		{
			var emailMsgText = $("textarea#share_text_msg").val();
			var userIDs = $("input#receiver_id").val();
			jQuery.ajax
			({
				url: "/" + PROJECT_NAME + "dashboard/send-wall-link-to-individual-emails",
				type: "POST",
				dataType: "json",
				data: {"share_text_msg":emailMsgText, "wallpost_id":wallpost_or_album_id, "receiver_id":userIDs,'album_id':album_id,"for_album" :for_album } ,
				success: function(jsonData)
				{
					
					//Removing loading sign.
					$("span#"+iddd).hide();
					//Showing up button again.
					$(elem).fadeIn();
					//closing popup
					$('div#share_photo_feed_popup').bPopup().close();
					
					//Show dialog after sharing.
					showDialogMsg( "Sharing", "Photo shared via imail.", 6000, 
					{
						buttons: 
						[
						 	{
					            text: "OK",
					            click: function(){$(this).dialog("close");}
					        }
					    ],
					    show: {effect: "fade"},
					    hide: {effect: "fade"},
					    dialogClass: "general_dialog_message",
					    height: 200,
					    width: 300
					});
				}
			});
		}		
	}   
}

/**
 * Get information of users who has shared given album.
 * 
 * @param wallpost_id
 * @author hkaur5
 * @version 1.0
 */
function openWhoSharedPopup( wallpost_or_album_id, for_wallpost )
{
	var offset = $('input#offset_who_shared').val();
	var limit = $('input#limit_who_shared').val();
	var nxt_offset = parseInt(offset)+parseInt(limit);
	
	var album_id = null;
	var action_name = 'get-who-shared-post';
	
	// Send album_id and change the name of action in case default, cover or 
	// profile album is used i.e. when album has no associated wallpost 
	// and for_wallpost is 0.
	if(!for_wallpost)
	{
		action_name = 'get-who-shared-album';
		album_id = wallpost_or_album_id;
	}
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
                url: "/" + PROJECT_NAME + "socialise/"+action_name,
                type: "POST",
                dataType: "json",
                data: { 'wallpost_id' : wallpost_or_album_id, 'album_id':album_id,'limit':limit,'offset':offset },
                timeout: 50000,
                success: function( jsonData ) {
                	var html = "<ol id='albums_users_who_shared'>";
                	if(jsonData.user_info)
                	{
	                	for( i in jsonData.user_info )
	                	{
	                		html += '<div style="width: 100%;border-bottom: 1px solid #EDEDED;padding-bottom: 10px !important;" class="comments-outer">';
	                		html += '<div title='+jsonData.user_info[i]["user_full_names"]+' class="img short_profile_border">';
	                		html += '<div>';
	                		html += '<img src = "'+jsonData.user_info[i]["user_image"]+'"/>';
	                		html += '</div>';
	                		html += '</div>';
	                		html += '<div class="text" style="width: 88% ! important; float: right; word-wrap: break-word; margin: 0px ! important;">';
	                		
	                		if( $("input[type=hidden]#currentUserId").val() == jsonData.user_info[i]["user_id"] )
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
							if( $("input[type=hidden]#currentUserId").val() != jsonData.user_info[i]["user_id"] )
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
							if( $("input[type=hidden]#currentUserId").val() != jsonData.user_info[i]["user_id"] )
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
		                	html += '<a href="javascript:;" class="text-dark-purple" onclick=loadMoreWhoSharedWallpostOrAlbum('+wallpost_or_album_id+',this,'+nxt_offset+','+for_wallpost+')>';
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
 * @param elem
 * @param offset
 * 
 * @author hkaur5
 */
function loadMoreWhoSharedWallpostOrAlbum( wallpost_or_album_id, elem, offset, for_wallpost )
{
	var album_id = null;
	var action_name = 'get-who-shared-post';
	
	// Send album_id and change the name of action in case default, cover or 
	// profile album is used i.e. when album has no associated wallpost 
	// and for_wallpost value is 0.
	if(!for_wallpost)
	{
		action_name = 'get-who-shared-album';
		album_id = wallpost_or_album_id;
	}
	var limit = $('input#limit_who_shared').val();
	$("div.view_more_who_shared p").html("<div style = 'display : table-cell;text-align:center; vertical-align: middle;'><image src = "+IMAGE_PATH+"/loading_small_purple.gif></div>");
	var nxt_offset = parseInt(offset)+parseInt(limit);
	
	jQuery.ajax({
	url: "/" + PROJECT_NAME + "socialise/"+action_name,
	type: "POST",
	dataType: "json",
	data: { 'wallpost_id' : wallpost_or_album_id,'album_id':album_id, 'limit':limit, 'offset':offset },
	timeout: 50000,
	success: function( jsonData ) {
	if(jsonData.user_info)
	{
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
				html += '<a href="javascript:;" class="text-dark-purple" onclick=loadMoreWhoSharedWallpostOrAlbum('+wallpost_or_album_id+',this,'+nxt_offset+','+for_wallpost+')>';
				html += 'View More';
				html += '</a>';
				html += '</p>';
				html += '</div>';
			}
		$("div.view_more_who_shared").remove();
		$("ol#albums_users_who_shared").append(html);
		
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


///**
// * Changes album details into editable form.
// * 
// * @param elem
// * @author hkaur5
// */
//function makeAlbumEditable(elem)
//{
//	
//	
//	//Hiding various controls.
//	$('div.add_photos').hide();
//	$('div.news-update-likes').hide();
//	$('div.comment-box-outer ').hide();
//	$('div.delete-album').children('a.edit_album').hide();
//	$('a.delete_album').hide();
//	
//	//Empty html
//	$('h2.album_title').empty();
//	$('div.caption_hover').empty();
//	
//	//Showing various controls
//	$('input#edit_album_name').show();//title in textbox
//	$('select.edit_album_privacy').show();
//	$('div.save_cancel_album_changes').show();
//	$('textarea.edit_album_add_desc.add_photo_desc').show();
//	$('textarea.edit_album_add_desc').show();
//	
//	//Changing CSS
//	$('.photoalbum-hdr h2.add_border').css('border','1px solid #c4c4c4');
//	$('div.col2.whitebox').css( 'margin','10px 0 72px 34px');
//	$('h2.album_title').css('margin','58px 0 0');
//	
//	//Removing CSS classes
//	$('div.photo_caption').removeClass('caption');
//	
//}
