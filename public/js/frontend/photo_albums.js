var change_privacy_call;

$(document).ready(function(){
	
	$("input#page").val(1);
	
	loadAlbums( $("input#page").val(), 12 );
	
	
	// when user click on the Add new album button.
	$(".new-album").click(function() 
	{
		getAddAlbumPopup();
	});
	clickOnEditIcon();
	displayPrivacyLinks();
	clickOnPrivacyCustomLink();
	setPrivacyToCustom();
	changePrivacyAccordingToSelectedOption();
	

	//Added by hkaur5
	//To close popup on click of cross image.
	$("img.close_popup").click(function(){
		$('div#gmail_popup').bPopup().close();
	});
	
	$('#minimise_menu').click(function(){
		 $( "div.col1" ).animate({
			 margin: "10px 0 10px 33px",
			 }, 300, function() {
			 // Animation complete.
			 });
		//$("div.col1").css("margin","10px 0 10px 33px");
	});
	$('a#maximise_menu').click(function(){
		 $( "div.col1" ).animate({
			 margin: "10px 0 10px 3px",
			 }, 300, function() {
			 // Animation complete.
			 });
		// $("div.col1").css("margin","10px 0 10px 3px");
	});
	
	//Close Add album popup
	$('div.photoalbum-addnew').on('click','img.close_add_photos', function(){
	
		$('div.photoalbum-addnew').children('div').children('div').fadeOut('fast');
	});
});

function clickOnEditIcon(){
	$('div.edit_pencile').unbind("click");
	$('div.edit_pencile').click(function()
	{
		$("div#edit-popup-outer_"+$(this).attr('rel')).fadeToggle();
	});
}


function displayPrivacyLinks(){
	
	$('div.col1-img').mouseover(function() 
	{
		
		 $("div#edit_pencile_"+ $(this).attr('rel') ).css('display','block');   
		 $("img#img_show_" + $(this).attr('rel')).css('display','block'); 
		 $("img#img_show_" + $(this).attr('rel')).html($(this).attr('title'));
		
	});
	$('div.col1-img').mouseleave(function() 
	{
		 $("div#edit_pencile_"+ $(this).attr('rel')).css('display','none');   
		 $("img#img_show_"+ $(this).attr('rel') ).css('display','none'); 
		 $("div#edit-popup-outer_"+ $(this).attr('rel') ).css('display','none'); 
		
	});  
	
}

//Added by hkaur5
//To show popup when custom option is selected in dropdown
function clickOnPrivacyCustomLink(){
	$('a.privacy_custom').unbind();
	$('a.privacy_custom').click(function()
	{
				var thiss = $(this); 
				__addOverlay();
				ShowCustomPopup(thiss);
	});
}

//Added by hkaur5
//To set privacy to custom . 
//Showing Pop up and saving selected options
function setPrivacyToCustom()
{
	$("form#email_contacts_form #gmail_import_btn").unbind();
	$("form#email_contacts_form #gmail_import_btn").click(function()
	{
		var current_album_id = $(this).siblings('input#selected_album_id').val();
		$("form#email_contacts_form #gmail_import_btn").hide();
		var loading_img = addLoadingImage( $(this), "before", 'loading_medium_purple.gif',61, 32 );
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
		var thisss = $(this);
		$.ajax({
			url : "/" + PROJECT_NAME + "profile/set-custom-privacy-and-viewers-for-album",
			method : "POST",
			data :{"custom_viewer" : usersList, "album_id":current_album_id},
			type : "post",
			dataType : "json",
			success : function(jsonData)
			{                    
				$("span#"+loading_img).remove();
				if(jsonData == 1)
				{
					$('div#gmail_popup').bPopup().close();
					$(thisss).fadeIn();
					$("div.message_box").remove();
					showDefaultMsg( " Your setting changes have been saved.", 1 );
						
				}
				else
				{
					alert("Some error has occured.Please select custom user again.");
				}
			}
		
		});
				
	});
}
/**
 * Change the privacy of particular album
 * according to the selected option in album edit popup.
 * @author hkaur5
 * 
 */
function changePrivacyAccordingToSelectedOption()
{
	$("a.privacy_public, a.privacy_links_of_links, a.privacy_links").unbind();
	$("a.privacy_public, a.privacy_links_of_links, a.privacy_links").click(function(){
		if( change_privacy_call )
		{	
			if( change_privacy_call.state() != "resolved" )
			{
				return;
			}
		}
		var selected_option = $(this).attr("rel");
		var album_id =$(this).parents("div.edit_pencile").attr("rel");
		var thiss = $(this);
			$(this).hide();
			var loading_img = addLoadingImage( $(this), "after", 'tiny_loader.gif', 30, 13, "prvcy_set_loader");
			change_privacy_call = $.ajax
			({
				url : "/" + PROJECT_NAME + "profile/change-privacy-of-album",
				method : "POST",
				data :{"album_id" : album_id, "privacy" : selected_option },
				type : "post",
				dataType : "json",
				success : function(jsonData)
				{                    
					if( jsonData != 0 )
					{
						$("span#"+loading_img).remove();
						$sibling_privacy_links = $(thiss).parents('div.edit-popup-col1').siblings().find('a');
						$($sibling_privacy_links).removeClass('text-dark-purple');
						$(thiss).addClass('text-dark-purple');
						$(thiss).fadeIn();
						$("div.message_box").remove();
						showDefaultMsg( "Privacy setting for album has been saved.", 1 );
					}
					else
					{
						$("span#"+loading_img).remove();
						$(thiss).fadeIn();
						$("div.message_box").remove();
						showDefaultMsg( "Some error has occured! We will fix it soon.", 2 );
					}
				}
			});
	});
}
// Getting Add New Album pop up.
// @author: spatial.
function getAddAlbumPopup()
{
	$(".quickview").empty();
	var html="";
	html += ' <img width="21" height="20" title="Cancel" alt="Cancel" src="'+IMAGE_PATH+'/cross2.png" class="close_add_photos">';
	// html=html + '<div class="album-pop-top"><input type="text" class="text-grey" style="width: 62%; height: 22px; margin-right: 10px; font-weight: bold;" placeholder="Title of Album" name="albumTitle" onkeypress="return IsAlphaNumeric(event);" ondrop="return false;" maxlength="30" /><input name="addPhotos" type="button" class=" btn-blue" value="Add More Photos" alt="Add More Photos" title="Add More Photos" /><span id="error" style="color:red;display:none;">Enter Album Title First.</span><span id="error2" style="color:red;display:none;">Special Characters not allowed</span></div>';
	html=html + '<div class="album-pop-top"><input type="text" class="text-grey" style="width: 62%; height: 22px; margin-right: 10px; font-weight: bold;" placeholder="Title of Album" name="albumTitle"  onkeypress="return IsAlphaNumeric(event);" ondrop="return false;" maxlength="30" /><input name="addPhotos" type="button" class=" btn-blue" value="Add More Photos" alt="Add More Photos" title="Add More Photos" /><div style="float:left;width:100%;"><span id="error" style="color:red;display:none;">Enter Album Title First.</span><span id="error2" style="color:red;display:none;"><, >, Single quotes, Double quotes Characters not allowed</span></div></div>';
	html=html + '<div class="album-pop-mid"></div>';
	html=html + '<div class="album-pop-top"><input type="button" id="mulitplefileuploader" name="mulitplefileuploader" style="display:none;" /> </div>';
	
	html=html + '<div class="album-pop-bot" style="display:none;"><div class="dd"><div id="win-xp8">';
	html=html + '<select name="privacy" id="privacy" style="width:140px;">';
	html=html + '<option value="1">Public</option>';
	html=html + '<option value="2">Links</option>';
	html=html + '<option value="3">Links of Links</option>';
	html=html + '</select>';
	html=html + '</div></div>';
	html=html + '<input name="postPhotos" type="button" class="btn-blue" value="Post Photos" alt="Post Photos" title="Post Photos" />';
	html=html + '</div>';
	
	$(".quickview").append(html);
	$("select#privacy").val(2);
	
	$(".quickview-outer").fadeToggle(function(){
		removeTempDirectory();
	});
	addNewAlbum();
	
}
// function used to remove user directory from temp folder.
// @author: spatial.
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
// Add new album button event.
// @author: spatial.
function addNewAlbum(){
	
	$("[name=addPhotos]").click(function(){
		$("#mulitplefileuploader").next().html("");
		$(".ajax-file-upload-statusbar").fadeOut("slow");
		$("#error2").hide();
		
		//Check that user does not create album with album title as 
		// albums created by system.
		if($("[name=albumTitle]").val().length>0 
			&& $("[name=albumTitle]").val().toLowerCase()!="default"
			&& $("[name=albumTitle]").val().toLowerCase()!="cover photos"
			&& $("[name=albumTitle]").val().toLowerCase()!="profile photos"
			)
		{
			$( ".ajax-file-upload").unbind( "click" );
			$("#error").fadeOut();
			
			// calling ajax-file-upload-button
			addUploaderSettings();
			$(".ajax-file-upload").click();
		}
		else
		{
			if($("[name=albumTitle]").val().length==0)
			{
				$("#error").html("Enter Album Title First");
			}
			else
			{
				$("#error").html('You can not create an album with name as '+$("[name=albumTitle]").val()+', Please choose some other name.');
				
			}
			$("#error").fadeIn();
		}
	});
	
	$("[name=postPhotos]").click(function(){
		$("#error2").hide();
		if($("[name=albumTitle]").val().length>0 && $("[name=albumTitle]").val().toLowerCase()!="default"){
			$("#error").fadeOut();
			// calling ajax-file-upload-button
			postPhotos();
 
		}
		else{
			if($("[name=albumTitle]").val().length==0){
				$("#error").html("Enter Album Title First");
			}
			else{
				$("#error").html('You can not create album as a "default" name, Please enter another text.');
			}
			$("#error").fadeIn();
		}
	});
}

// Store Album Info...
// @author: spatial.
function postPhotos(){
	var iddd = addLoadingImage($("[name=postPhotos]"), "after");
	
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
	
	var stitle = htmlEntities($("[name=albumTitle]").val());
	var title=btoa(stitle);
	var privacy=$("[name=privacy]").val();
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/post-photos",
		method : "POST",
		data : "album_title="+title+"&album_privacy="+privacy+'&photo_name_desc_arr='+JSON.stringify(photo_arr),
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			
			$("span#"+iddd).remove();
			var album_id = jsonData.link.replace(/^.+\/([^\/]*)$/,'$1');
			var html='<div class="col1 whitebox">';
			html = html+'<div class="col1-img" rel="'+album_id+'">';
			html = html+'<div  class="edit_pencile" style = "display:none" id="edit_pencile_'+album_id+'" rel="'+album_id+'">';
			html = html+'<img title="Edit privacy sttings"src="'+IMAGE_PATH+'/icon-pencil-hover.png " width="16" height="16" class="img_show" id="img_show_'+album_id+'" rel="'+album_id+'" title="Edit"/>';  
            html = html+'<div style="bottom: -108px; right:0;" style = "display:none" class="edit-popup-outer" id="edit-popup-outer_'+album_id+'">';
            html = html+'<div style="margin: 0 0 0 154px" class="edit-popup-arrow">';
            html = html+'<img width="26" height="16" src="'+IMAGE_PATH+'/arrow-up-grey2.png">';
            html = html+'</div>';
            html = html+'<div class="edit-popup">';
            html = html+'<div class="edit-popup-col1">';
            html = html+'<h5 class="album_privacy_text">';
            
            if(jsonData.album_visibility_criteria == '2')
            {
            	html = html+'<a href="#" class="text-dark-purple text-grey2-link privacy_links" rel = "2" id="privacy_2">';
            	html = html+'Links';
            	html = html+'</a>';
            }
            else
        	{
            	html = html+'<a href="#" class=" text-grey2-link privacy_links" rel = "2" id="privacy_2">';
            	html = html+'Links';
            	html = html+'</a>';
        	}
            html = html+'</h5>';
            html = html+'</div>';
            html = html+'<div class="edit-popup-col1">';
            html = html+'<h5 class="album_privacy_text">';
            if(jsonData.album_visibility_criteria == '4')
            {
	            html = html+'<a href="#" class="text-dark-purple text-grey2-link privacy_custom" rel = "4" id="privacy_4" rel1 ="'+album_id+'" >';
	            html = html+'Custom';
	            html = html+'</a>';
            }
            else
        	{
            	html = html+'<a href="#" class=" text-grey2-link privacy_custom" rel = "4" id="privacy_4" rel1 ="'+album_id+'" >';
	            html = html+'Custom';
	            html = html+'</a>';
        	}
            html = html+'</h5>';
            html = html+'</div>';
            html = html+'<div class="edit-popup-col1">';
            html = html+'<h5 class="album_privacy_text">';
            if(jsonData.album_visibility_criteria == '1')
            {
	            html = html+'<a href="#" class="text-dark-purple text-grey2-link privacy_public" rel = "1" id="privacy_1">';
	            html = html+'Public';
	            html = html+'</a>';
            }
            else
        	{
            	html = html+'<a href="#" class="text-grey2-link privacy_public" rel = "1" id="privacy_1">';
 	            html = html+'Public';
 	            html = html+'</a>';
        	}
            html = html+'</h5>';
            html = html+'</div>';
            html = html+'<div class="edit-popup-col1">';
            html = html+'<h5 class="album_privacy_text">';
            if(jsonData.album_visibility_criteria == '3')
            {
		        html = html+'<a href="#" class="text-dark-purple text-grey2-link privacy_links_of_links" rel = "3" id="privacy_3">';
		        html = html+'Links of Links';
		        html = html+'</a>';
            }
            else
        	{
        	  html = html+'<a href="#" class="text-grey2-link privacy_links_of_links" rel = "3" id="privacy_3">';
              html = html+'Links of Links';
              html = html+'</a>';
        	}
            html = html+'</h5>';
            html = html+'</div>';
            html = html+'</div>';
            html = html+'</div>';
            html = html+' </div>';		
    		html = html+'<a href="'+jsonData.link+'">';
            html = html+'<div style="width: 176px; height: 176px; display: table-cell; text-align: center; vertical-align: middle;">';
            html = html+'<img src="'+jsonData.img+'"/>';
            html = html+'<div class="caption" style="padding:0 3px;opacity:1;transition-delay:0s;color:#fff;bottom: 3px !important;">';
            html = html+'<div  style="float:left;line-height:30px;" class="lt" title="'+jsonData.album+'">'+showCroppedText(jsonData.album, 20)+'</div>';
            html = html+'<div style="float:right;line-height:30px;" class="rt">'+jsonData.numbers+'</div>';
            html = html+'</div>';
            html = html+'</div>';
            html = html+'</a>';
            html = html+'</div>';
  
            html = html+'</div>';
			$(".noRecFound").remove();
			$(".photo-slider-bot").prepend(html);
			$(".quickview-outer").fadeToggle();
			clickOnEditIcon();	
			displayPrivacyLinks();
			clickOnPrivacyCustomLink();
			setPrivacyToCustom();
			changePrivacyAccordingToSelectedOption();
			$("div.message_box").remove();
    		showDefaultMsg( "Album added successfully.", 1 );
		}
	});
}
function htmlEntities(str) {
    return str.replace(/\>/g,"").replace(/\</g,"");
    
}

// Multiple file uploader settings...
// @author: Sunny Patial.
function addUploaderSettings(){
	// multiple file uploader settings...
	var settings = {
		url: "/" + PROJECT_NAME + "profile/add-more-photos",
		method: "POST",
		allowedTypes:"jpg,png,gif,jpeg",
		fileName: "myfile",
		multiple: true,
		maxFileSize: 5242881, //1024*1024*5 = 5242880 = 5MB
		returnType:'json',
		showStatusAfterSuccess:false,
		showAbort:false,
		showDone:false,
		onSuccess:function(files,data,xhr)
		{
			var html='';
			if(data){
				html += '<div class="col1">';
					html += '<div style="width:131px;height:131px;vertical-align:middle;text-align:center;display:table-cell;border:1px solid #6C518F;">';
						html += '<img style="margin:0px !important;" src="'+PUBLIC_PATH+'/'+data['image_path']+'">';
					html += '</div>';
					html += '<textarea maxlength="255" rel = "'+data['image_name']+'" id="photo_desc" class="add_photo_desc" placeholder="Add description"></textarea>';
				html += '</div>';	
				
			}
			else{
				$("#mulitplefileuploader").next().append('<div><font color="red"><b>'+files+'</b> is a corrupt image<br></font></div>');
				
			}
			
			$(".album-pop-mid").append(html);
			
			$(".album-pop-bot").fadeIn();
		},
		onError: function(files,status,errMsg)
		{		
			$("#status").html("<font color='red'>Upload is Failed</font>");
		}
	};
	$("#mulitplefileuploader").uploadFile(settings);
}

/**
 * List links to select them for custom
 * privacty settings.
 * @author hkaur5
 * @version 1.0
 */
function ShowCustomPopup(elem)
{
	var current_album_id= $(elem).attr('rel1');
	ajax_call = jQuery.ajax(
	{
        url: "/" + PROJECT_NAME + "profile/get-my-links-for-custom-viwer-pop-up",
        type: "POST",
        dataType: "json",
        data: {'current_album_id':current_album_id},
        timeout: 50000,
        success: function(jsonData) {
        	if( jsonData.all_links != "" )
        	{
	        	__removeOverlay();
	        	accessHtml = "";
	        	var counter = 0;
	        	accessHtml += '<ul class="select-all-contacts-ul"><li><label><span><input type="checkbox" id = "gmail_main_cb" name="gmail_main_cb" value="" /></span><span><b>Select All</b></span></label></li></ul>';
	        	accessHtml += '<ul>';
	        	for( i in jsonData.all_links )
	    		{
	    			accessHtml += '<li class = "mail_contacts">';
	    			accessHtml += '<span class = "import_cb">';
	    			accessHtml += '<input type="checkbox" class = "gmail_cb" name="emails[]" value="'+i+'" rel="'+ jsonData.all_links[i]['user_id'] +'" />';
	    			accessHtml += '</span>';
	    			accessHtml += "<div class='contact_img'><div style = 'width:25px; height:25px; display : table-cell; vertical-align: middle; text-align: center;'>" + "<img style = 'max-width: 25px; max-height: 25px; border: medium none ! important;' src='" + jsonData['all_links'][i].prof_image + "' title='" + jsonData['all_links'][i].first_name + " " + jsonData['all_links'][i].last_name + "'/></div></div>" + "<div style='display: inline-block; padding-left: 10px;'><div class='full_name'>" + showCroppedText( jsonData['all_links'][i].first_name + " " + jsonData['all_links'][i].last_name, 15) + "</div><div class='email'>" + jsonData['all_links'][i].email + "</div></div></li>";
	    		  	
	    			counter++;
	    		}
        	
	        	
	        	
	    		accessHtml += '</ul>';
	    		
	            $("#modal_contacts").html(accessHtml);
	        	//Marking checkboxes.
	            if(jsonData.custom_set_links)
	            {
		            for( j in jsonData.custom_set_links )
		    		{
		            	$("#modal_contacts input[rel='"+jsonData.custom_set_links[j]['user_id']+"']").prop('checked', true);
		    		}
	            }
	            else if (jsonData.custom_set_links =="")
            	{
	            	//Do nothing.
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
					closeClass : 'close_bpopup',
	                transition: 'slideDown',
	                onOpen: function() {
	                	$("input#selected_album_id").val(current_album_id) ;
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
	            		$("#modal_contacts").html("<label>Oops! No contacts found.</label>");
	            	}
	    		});
        	}
        	else if (jsonData.all_links == "")
        	{
        		__removeOverlay();
        		$("div.message_box").remove();
        		showDefaultMsg( "You do not have any links. You may search a person to add him/her to send link request.", 1 );
        	}	
        }
	});
}


function IsAlphaNumeric(e) {
	$("#error").hide();
	$("#error2").hide();
	var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;
    if(keyCode == 60 || keyCode == 39 || keyCode == 34 || keyCode == 62){
    	$("#error2").fadeIn();
    	return false;
    }
}

/**
 * function for loading more albums on photo albums page
 * @author sjaiswal
 * @param offset 
 * @param limit 
 * @version 1.0
 */
function loadAlbums(page, limit)
{
	page = typeof page !== 'undefined' ? page : 0;
	
	//check if more albums are present or not
	$("div.loading_albums").show();
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/get-my-albums",
		type: "POST",
		data: { 'page' : page ,'limit':limit },
		dataType : "json",
		timeout: 50000,
		success : function(jsonData) {
			$("div.loading_albums").hide();
			if( jsonData == 0 )
			{
				var html='<div class="noRecFound no_album">You have not posted any album</div>';
				$("div.photoalbum-outer div.photo-slider-bot").html( html );
			}
			for( i in jsonData.album_info )
        	{
				var html='<div class="col1 whitebox">';
				html = html+'<div class="col1-img" rel="'+jsonData.album_info[i].id+'">';
				html = html+'<div  class="edit_pencile" style = "display:none" id="edit_pencile_'+jsonData.album_info[i].id+'" rel="'+jsonData.album_info[i].id+'">';
				html = html+'<img title="Edit privacy sttings"src="'+IMAGE_PATH+'/icon-pencil-hover.png " width="16" height="16" class="img_show" id="img_show_'+jsonData.album_info[i].id+'" rel="'+jsonData.album_info[i].id+'" title="Edit"/>';  
	            html = html+'<div style="bottom: -108px; right:0;" style = "display:none" class="edit-popup-outer" id="edit-popup-outer_'+jsonData.album_info[i].id+'">';
	            html = html+'<div style="margin: 0 0 0 154px" class="edit-popup-arrow">';
	            html = html+'<img width="26" height="16" src="'+IMAGE_PATH+'/arrow-up-grey2.png">';
	            html = html+'</div>';
	            html = html+'<div class="edit-popup">';
	            html = html+'<div class="edit-popup-col1">';
	            html = html+'<h5 class="album_privacy_text">';
	            
	            if(jsonData.album_info[i].visibility_criteria == '2')
	            {
	            	html = html+'<a href="#" class="text-dark-purple text-grey2-link privacy_links" rel = "2" id="privacy_2">';
	            	html = html+'Links';
	            	html = html+'</a>';
	            }
	            else
	        	{
	            	html = html+'<a href="#" class=" text-grey2-link privacy_links" rel = "2" id="privacy_2">';
	            	html = html+'Links';
	            	html = html+'</a>';
	        	}
	            html = html+'</h5>';
	            html = html+'</div>';
	            html = html+'<div class="edit-popup-col1">';
	            html = html+'<h5 class="album_privacy_text">';
	            if(jsonData.album_info[i].visibility_criteria == '4')
	            {
		            html = html+'<a href="#" class="text-dark-purple text-grey2-link privacy_custom" rel = "4" id="privacy_4" rel1 ="'+jsonData.album_info[i].id+'" >';
		            html = html+'Custom';
		            html = html+'</a>';
	            }
	            else
	        	{
	            	html = html+'<a href="#" class=" text-grey2-link privacy_custom" rel = "4" id="privacy_4" rel1 ="'+jsonData.album_info[i].id+'" >';
		            html = html+'Custom';
		            html = html+'</a>';
	        	}
	            html = html+'</h5>';
	            html = html+'</div>';
	            html = html+'<div class="edit-popup-col1">';
	            html = html+'<h5 class="album_privacy_text">';
	            if(jsonData.album_info[i].visibility_criteria == '1')
	            {
		            html = html+'<a href="#" class="text-dark-purple text-grey2-link privacy_public" rel = "1" id="privacy_1">';
		            html = html+'Public';
		            html = html+'</a>';
	            }
	            else
	        	{
	            	html = html+'<a href="#" class="text-grey2-link privacy_public" rel = "1" id="privacy_1">';
	 	            html = html+'Public';
	 	            html = html+'</a>';
	        	}
	            html = html+'</h5>';
	            html = html+'</div>';
	            html = html+'<div class="edit-popup-col1">';
	            html = html+'<h5 class="album_privacy_text">';
	            if(jsonData.album_info[i].visibility_criteria == '3')
	            {
			        html = html+'<a href="#" class="text-dark-purple text-grey2-link privacy_links_of_links" rel = "3" id="privacy_3">';
			        html = html+'Links of Links';
			        html = html+'</a>';
	            }
	            else
	        	{
	        	  html = html+'<a href="#" class="text-grey2-link privacy_links_of_links" rel = "3" id="privacy_3">';
	              html = html+'Links of Links';
	              html = html+'</a>';
	        	}
	            html = html+'</h5>';
	            html = html+'</div>';
	            html = html+'</div>';
	            html = html+'</div>';
	            html = html+' </div>';	
	            html = html+'<a href="/'+PROJECT_NAME+'profile/photos/uid/'+jsonData.album_info[i].uid+'/id/'+jsonData.album_info[i].id+'">';
	            html = html+'<div style="width: 180px; height: 180px; display: table-cell; text-align: center; vertical-align: middle;">';
	            html = html+'<img src="'+jsonData.album_info[i].socialise_albums_socialise_photo+'"/>';
	            html = html+'<div class="caption">';
	            html = html+'<div class="lt" title="'+jsonData.album_info[i].album_name+'">'+
	            showCroppedText(jsonData.album_info[i].album_name, 20)
	            +'</div>';
	            html = html+'<div class="rt">'+jsonData.album_info[i].photo_count+'</div>';
	            html = html+'</div>';
	            html = html+'</div>';
	            html = html+'</a>';
	            html = html+'</div>';
	            html = html+'</div>';
				$("div.photo-slider-bot").append(html);
				clickOnEditIcon();
				displayPrivacyLinks();
				clickOnPrivacyCustomLink();
				setPrivacyToCustom();
				changePrivacyAccordingToSelectedOption();
        	}
			
			//incrementing page.
			$("input#page").val( parseInt( $("input#page").val() ) + 1 );
			
			if( jsonData.is_there_more_albums )
			{
				loadAlbums( $("input#page").val(), 12 );
			}
			
			//assigning is there more albums value to hidden field
			$("input#is_there_more_albums").val( jsonData.is_there_more_albums );
		}
	});
	
}

