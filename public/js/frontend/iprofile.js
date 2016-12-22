var feedback_call;
var reference_call;
$(document).ready(function()
{
	
	window.scrollTo(0,0);
	
	//Load albums on my-profile page
	$("input#album_page").val(1);
	loadPhotoAlbums( $("input#userId").val(), $("input#album_page").val(), 12 );
	
	//Load links on my-profile page
	profileLinks($("input#userId").val());
	
	
	
	var hash = location.hash.replace(/^.*?#/, '');
	if( hash == 'links' )
	{
		showLinks( $("div.link500") );
	}
	else if( hash == 'photos' )
	{
		showPhotoAlbums($('div.new-nav ul li.photo-album-tab'));
		
	}
	
	//--------------------Cover photo code starts----------------------------
	$('div.timeline-header-wrapper, div.cover-photo-cam-outer').mouseenter(function()
	{
		// When in undraggable form img will have both the classes below or will have none of them.
		if($("img#cvr_photo_img").hasClass('ui-draggable-disabled') )
		{
			$('div.cover-photo-cam-outer').show();
			$('div.cover_photo_cam img').show();
			$('div.cover_photo_cam').show();
		}
		else if(!$("img#cvr_photo_img").hasClass('ui-draggable'))
		{
			$('div.cover-photo-cam-outer').show();
			$('div.cover_photo_cam img').show();
			$('div.cover_photo_cam').show();
		}
	});
	
	$('div.timeline-header-wrapper, div.cover-photo-cam-outer').mouseleave(function()
	{
		$('div.cover-photo-cam-outer').hide();
	});
	
	$('div.timeline-header-wrapper').mouseleave(function()
	{
//		$("ul.cover_photo_menu").hide();
	});

	
	// Click on camera icon and getting options by ajax call-------------------------
	$('div.cover_photo_cam').click(function(){
		if($('ul.cover_photo_menu').is(':visible'))
		{
		
		}
		else
		{
			//giving definite height to menu.
			$('ul.cover_photo_menu').css('height','20px');
			$('div.cover-photo-menu-arrow').show();
			$('ul.cover_photo_menu').fadeIn();
			var cover_photo_name = $('img#cvr_photo_img').attr('rel1');
        	var html_menu = "";
	        
        	html_menu += '<div class="cover-photo-menu-arrow">';
        	html_menu +='<img src="'+IMAGE_PATH+'/arrow-up-white.png">';
        	html_menu +='</div>';
        	html_menu +='<img class="loading_options" style="position:absolute;top:49px;left:43px;" src="'+IMAGE_PATH+'/loading_small_purple.gif"/>';
			$('ul.cover_photo_menu').html(html_menu);
			jQuery.ajax
			({
		        url: "/" + PROJECT_NAME + "profile/get-menu-options-for-cvr-photo",
		        type: "POST",
		        dataType: "json",
		        data : { 'cover_photo_name':cover_photo_name },
		        success: function(jsonData) 
		        {
		        	
		        	if(jsonData == 1)
		        	{
			        	var html_menu = "";
			        
			        	html_menu += '<div class="cover-photo-menu-arrow">';
			        	html_menu +='<img src="'+IMAGE_PATH+'/arrow-up-white.png">';
			        	html_menu +='</div>';
		        		html_menu +='<li id="trigger_upload" onclick="tiggerUploadCoverPhotoCtrl(this);" class="trigger_upload">Upload cover photo</li>';
		        		html_menu +='<li id="repositn_cvr_photo" onclick="repositionCoverPhoto(this);"  class="reposition_cvr">Reposition</li>';
		        		html_menu +='<li id="delete_cvr_photo" onclick="deleteCoverPhoto(this);" class="delete_cvr">Delete</li>';
		        		
//		        		$('img.loading_options').hide();
		        		$('ul.cover_photo_menu').css('height','');
		        		$('ul.cover_photo_menu').html(html_menu);
		        	}
		        	else if (jsonData == 2 )
	        		{
		        		var html_menu = "";
		            	html_menu +='<div class="cover-photo-menu-arrow">';
			        	html_menu +='<img src="'+IMAGE_PATH+'/arrow-up-white.png">';
			        	html_menu +='</div>';
		        		html_menu +='<li id="trigger_upload" onclick="tiggerUploadCoverPhotoCtrl(this);" class="trigger_upload">Upload cover photo</li>';
		        		$('ul.cover_photo_menu').css('height','');
		        		$('ul.cover_photo_menu').html(html_menu);
	        		}
		        }
			});
		}
	});
	//End camera icon click code------------------------------------------------------
	
	//Hidding camera option on out click.
	$(document).mouseup(function (e)
	{
		var container = $("ul.cover_photo_menu");
		if (!container.is(e.target) // if the target of the click isn't the container...
				&& container.has(e.target).length === 0) // ... nor a descendant of the container
		{
			container.hide();
			container.html();			
		}
	});
	
	
	// On change of "input#upld_cvr_photo" call php function
	// upload cover photo in cover photo director of user (cover_photo/user_id)
	$("input#upld_cvr_photo").change(function ()
	{
		
		var current_user_id = $('input#upld_cvr_photo').attr('rel');
		$('div#cover_photo img#cvr_photo_img').attr('src','');
		$('div#cover_photo').append('<img class="cover_photo_loading" style="position: absolute;top:100px; left:400px; z-index:4;" src="'+IMAGE_PATH+'/loading_medium_purple.gif"/>');
		//Fetching file data of file to be uploaded by using 'formData'
	  	var fd = new FormData();    
	  	fd.append( 'file', this.files[0] );
		jQuery.ajax(
		{
			url: "/" + PROJECT_NAME + "profile/upload-cover-photo-n-genrate-thumb",
	        type: "POST",
	        dataType: "json",
	        data : fd,
	        processData: false,
	        contentType: false,
	        enctype: 'multipart/form-data',
	        success: function(jsonData) 
	        {
	        	$('img.cover_photo_loading').hide();
	        	if(jsonData.set_prev_cover == 1 && jsonData.is_success == 0)
        		{
	        		if(jsonData.prev_cover_position)
        			{
	        			$('div#update_cover_outer').hide();
	            		$('div.instructionWrap').hide();
	            		$('div#update_cover_outer').hide();
	            		$('div#cover_photo img#cvr_photo_img').attr('src',IMAGE_PATH+'//cover_photo/user_'+current_user_id+'/'+jsonData["prev_covr_photo_name"]);		
	            		$('div#cover_photo img#cvr_photo_img').css('top',jsonData["prev_cvr_photo_y_position"]);		
	            		//Cover photo css.
	            		$('div#cover_photo img#cvr_photo_img').css('opacity','1');		
	            		$('div#cover_photo img#cvr_photo_img').css('position','relative');		
        			}
	        		else if(	jsonData.prev_cover_default == 1 &&
	        					jsonData.user_gender )		
	        		{
	        	  		//hide save and cancel button panel.
	            		$('div#update_cover_outer').hide();
	            		//Dragging disabled.
//	            		$('div#cover_photo img#cvr_photo_img').draggable( 'disable' );
	            		$('input#save_cover').show();
	            		$('div.instructionWrap').hide();
	            		$('div#cover_photo img#cvr_photo_img').attr('src',IMAGE_PATH+'/cover-female-default.png');		
//	            		if(jsonData['user_gender'] == 2)
//	            		{
//	            			$('div#cover_photo img#cvr_photo_img').attr('src',IMAGE_PATH+'/cover-female-default.png');		
//	            		}
//	            		else
//	        			{
//	            			$('div#cover_photo img#cvr_photo_img').attr('src',IMAGE_PATH+'/cover-male-default.png');		
//	        			}
	            		$('div#cover_photo img#cvr_photo_img').removeClass('my_cover_photo');		
	            		$('div#cover_photo img#cvr_photo_img').addClass('my_default_cover_photo');		
	            		$('div#cover_photo img#cvr_photo_img').css('opacity','1');	
	             		//Default cover photo css.
	            		$('div#cover_photo img.cvr_img').css('top','0');	
	            		$('div#cover_photo img.cvr_img').css('left','0');	
	            		$('div#cover_photo img.cvr_img').css('opacity','1');	
	            		$('div#cover_photo img.cvr_img').css('min-height','202px');	
	        		}
	        		showDefaultMsg(jsonData.msg,2);
        		}
	        	else if( jsonData )
	    		{
	        		$('img.cover_photo_loading').hide();
	        		
	        		//hiding cam icon and menu.
	        		$('div.cover_photo_cam').hide();
	        		$('ul.cover_photo_menu').hide();
	        		
	        		$('div#cover_photo img.cvr_img').css('top','0');
	        		$('div#cover_photo img.cvr_img').css('display','block');
	        		
	        		//If user is uploading cover photo and had default cover photo then change class.
	        		$('div#cover_photo img.cvr_img').removeClass('my_default_cover_photo');
	        		$('div#cover_photo img.cvr_img').addClass('my_cover_photo');
	        		
	        		$('div#cover_photo img.cvr_img').attr('src',IMAGE_PATH+'//cover_photo/user_'+current_user_id+'/'+jsonData);
	        		
	        		// setting 'image uploaded name' in rel attr of cvr photo img tag.
	        		// Required to send in ajax call when saving cover photo.
	        		$('div#cover_photo img.cvr_img').attr('rel1',jsonData);
	        		
	        		$('div.instructionWrap').show();
	        		$('div#update_cover_outer').show();
	        		
	        		//Making cover image draggable to reposition it.
	        		$('div#cover_photo img#cvr_photo_img').css('cursor', 'all-scroll')
	        		.draggable({
	        			
	        			//revert: "invalid",
	        		    snap: ".instructionWrap",
	        		    //stack: ".my_cover_photo",
	        			
	        			scroll: false,
	        		    disabled: false,
	        			cursor: "all-scroll", 
	        			axis:"y",
	        			drag: function (event, ui) 
	        			{
	        				y1 = $('.timeline-header-wrapper').height(); 
	        				y2 = $('div#cover_photo').find('img').height(); 
	        		 
	        				if (ui.position.top >= 0) 
	        				{ 
	        					ui.position.top = 0;
	        				}  
	        				else if (ui.position.top <= (y1-y2)) 
	        				{
	        					ui.position.top = y1-y2; 
	        				}
	        				
	        				//For horizontal dragging.
//	        				x1 = $('.timeline-header-wrapper').width(); 
//	        				x2 = $('div#cover_photo').find('img').width(); 
//	        		 
//	        				if (ui.position.left >= 0) 
//	        				{ 
//	        					ui.position.left = 0;
//	        				}  
//	        				else if (ui.position.left <= (x1-x2))
//	        				{
//	        					ui.position.left = x1-x2; 
//	        				}
	        				
	        			},
	        			stop: function(event, ui) 
	        			{  
	        				$('input.cover-position').val(ui.position.top);
//	        				$('input.cover-position-x').val(ui.position.left);
	        			}  
	        		});  
	    		}
	        	else if( jsonData == 0 )
        		{
	        		$('img.cover_photo_loading').hide();
	        		showDefaultMsg('Some error has occurred while uploading cover photo. We will fix it soon!', 2);
        		}
	        		
	        },
	        error: function(xhr, ajaxOptions, thrownError) 
	        {
	        	showDefaultMsg('Some error has occurred while uploading cover photo. We will fix it soon!', 2);
			}
	    });
	      
	});
	
	
	//--------------------Cover photo upload code ends----------------------------

	//Expanding the feedback and reference that are showing up as cropped.
	$("span.show_more").click(function()
	{
		var fdbk_id = $(this).attr("rel");
		$('div#clickable_text_div_'+fdbk_id).hide();
		$("div#full_text_"+fdbk_id).fadeIn(1000);
	});
	//Collapsing feedback and reference text back to cropped form.
	$("span.show_less").click(function()
	{
		var fdbk_id = $(this).attr("rel");
		$('div#full_text_'+fdbk_id).hide();
		$("div#clickable_text_div_"+fdbk_id ).fadeIn(1000);
	});

	// click on skills
	$(".showskills").click(function(){
	if($('div#skills'+$(this).attr("skill")+':visible').length==0)
	{
		$("img#img_"+$(this).attr("skill")).attr("src",IMAGE_PATH+"/minus_grey.png");
	}
	else
	{
		$("img#img_"+$(this).attr("skill")).attr("src",IMAGE_PATH+"/plus_grey.png");
	}
	$("div#skills"+$(this).attr("skill")).slideToggle();
	});	
	$('.chk_all_'+$("input#userId").val()).change(function() 
	{
	 	addDownloadProfileEvents($("input#userId").val());
	 	addCheckboxCheckedEvents($("input#userId").val());
		
	});
	$('.chk_options_'+$("input#userId").val()).change(function() 
	{
		addCheckboxCheckedEvents($("input#userId").val());
	});
 
	$(".closeDownloadPopup").click(function()
	{
		$(".download-pop").hide();
	});	

	//Listing albums when according open.
	$("h3#accordion_photo_albums").toggle(function(){
		
	});

	//Expanding the notes that are showing up as cropped.
	$("p.clickable_text").click(function()
	{
		$("p#p_all_text_" + $(this).attr("rel") ).fadeIn();
		$(this).hide();
	});
	
	//On clicking shareurl anchor tag in my-iprofile a share popup will open.
	$("a#shareurl").click(function()
	{
		shareProfile();
	});
	
	
	// share url on ilook
	$("#shareIlookUrl").click(function()
	{
		shareProfileWithInIlook();
	});
	//Openning all accordions on the page.
	$("div#view_all").click(function()
	{
		$( "div.accordion" ).accordion({'active':0});
	});
	//Hovering over send mail icon and send mail text.
	$('img.send-mail-icon').mouseover(function()
	{
		$('a.send-mail-text').css('color','#6C518F');
	});
	$('img.send-mail-icon').mouseout(function()
	{
		$('a.send-mail-text').css('color','#C9CCCD');
	});
});


//Hidding share profile popup on out click.
$(document).mouseup(function (e)
{
	var container = $("div.invite-connect-pop-outer");
	if (!container.is(e.target) // if the target of the click isn't the container...
			&& container.has(e.target).length === 0) // ... nor a descendant of the container
	{
		container.hide();
	}
});

$(function() 
{
	 var showChar = 7, showtxt = "more", hidetxt = "less" ,  totalELementInThis = 0;
	 
	 $('div.slide-down-inner-container div.col1').each(function() {

	 $('div.slide-down-inner-container div.col1').css("display","none");
	 
	
	 for( var counterForViewMore = 0; counterForViewMore <= showChar; counterForViewMore++)
	 {
		$('div.slide-down-inner-container div.col1:nth-child('+counterForViewMore+')').css("display","block");
	 }

	 totalELementInThis =  $(this).parent().children().length;
 	  
 	  if( totalELementInThis > (showChar+1)	)
	 {
 		 $(this).parent().children().last().html('<div   style="float: left ! important; width: 66px ! important; display: block;" class="col1"><span  onclick="showAllSubEement(this)" style="cursor:pointer;display:block;vertical-align: baseline;"> View More </span></div> ');
 		 
	 }
 
 	 totalELementInThis = 0;
 
});

});
 
function  showAllSubEement(elem)
{
  $(elem).parent().parent().children().css("display","block");
  $(elem).parent().parent().parent().children().css("display","block");
  var notVisible = $(elem).parent().parent().children().not(':visible').length;
  $(elem).hide();
}


// accordian
$(function() {
	var icons = {
	header: "ui-icon-circle-arrow-e",
	activeHeader: "ui-icon-circle-arrow-s"
	};
	$( "div.accordion" ).accordion({
		active:true,
		icons: icons,
		collapsible: true,
		heightStyle: "content"
	}),
	$( "#toggle" ).button().click(function()
	{
		if ( $( "div.accordion" ).accordion( "option", "icons" ) ) 
		{
			$( "div.accordion" ).accordion( "option", "icons", null );
		}
		else 
		{
			$( "div.accordion" ).accordion( "option", "icons", icons );
		}
	});
});


function display(id)
{
	$("#"+id).slideToggle();
}
function displayss(id)
{
	$("#skills"+id).slideToggle();
}

/**
 * Mutual links and All links.
 * enable
 * @author spatial
 */
function fireLinksEvents(){
	$(".showMutualLinks").click(function(){
		__addOverlay();
		var uid = $("input#userId").val();
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "profile/mutual-links-listing",
	        type: "POST",
	        dataType: "json",
	        data : "uid="+uid,
	        success: function(jsonData) 
	        {
	        	__removeOverlay();
	        	$(".mutual-links-listing").empty();
	        	$(".links-listing").empty();
	        	$(".links-listing").empty();
	        	
	        	
	        	var html="";
	        	if(jsonData.mutual_links!="")
	        	{
	        		html+=jsonData.mutual_links;
	        	}
	        	else
	        	{
	        		html+='<div id="links-profie" class="accord-content purple-header-bot" style="display: block; text-align: left;font-family:arial;color: #7F7F7F !important; padding-left: 3% !important;font-weight: bold;">No Mutual Links.</div>';	
	        	}
	        	$(".showMutualLinks").removeClass('inactiveLink');
	        	$(".showLinks").addClass('inactiveLink');
	        	$(".mutual-links-listing").append(html);
	        	$(".mutual-links-listing").fadeIn();
			},
	        error: function(xhr, ajaxOptions, thrownError) 
	        {
				alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			}
	    });
	});	
	// click on all links
	$(".showLinks").click(function(){
		__addOverlay();
		var uid = $("input#userId").val();
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "profile/links-profile-listing",
	        type: "POST",
	        dataType: "json",
	        data : "uid="+uid,
	        success: function(jsonData) {
	        	__removeOverlay();
	        	$(".mutual-links-listing").empty();
	        	$(".links-listing").empty();
	        	var html="";
	        	if(jsonData!=0){
	        		html+=jsonData.links;
	        	}
	        	else{
	        		html+='No Links';	
	        	}
	        	$(".showLinks").removeClass('inactiveLink');
	        	$(".showMutualLinks").addClass('inactiveLink');
	        	$(".links-listing").append(html);
	        	$(".links-listing").fadeIn();
			},
	        error: function(xhr, ajaxOptions, thrownError) 
	        {
				alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			}
	    });
	});	
}
/**
 * Shows personal information details.
 * @author hkaur5
 * @param elem(control clicked)
 */
function showPersonalInfo( elem )
{
	$(".totallinks").addClass("link500");
	$(".totallinks").removeClass("link500-active");
	$(".linkstxt").addClass("link500-rt");
	$(".linkstxt").removeClass("link500-rt-active");
	var selected_tab_link = $(elem).children('a');
	$('div.feedback-accord-content').hide();
	$('div.reference-accord-content').hide();
	$('div.skills-accord-content').hide();
	$('div.photos-accord-content').hide();
	$('div.links-accord-content').hide();
	$('div.personal-info-accord-content').fadeIn();
	
	$("div.new-nav ul li a").removeClass("selected");
	$( selected_tab_link ).addClass("selected");
}
/**
 * Show feedbacks.
 * @author hkaur5
 * @param elem ( control clicked)
 */
function showFeedbacks( elem )
{
	$(".totallinks").addClass("link500");
	$(".totallinks").removeClass("link500-active");
	$(".linkstxt").addClass("link500-rt");
	$(".linkstxt").removeClass("link500-rt-active");
	var selected_tab_link = $(elem).children('a');
	$('div.reference-accord-content').hide();
	$('div.skills-accord-content').hide();
	$('div.photos-accord-content').hide();
	$('div.links-accord-content').hide();
	$('div.personal-info-accord-content').hide();
	$('div.feedback-accord-content').fadeIn();
	$("div.new-nav ul li a ").removeClass("selected");
	$( selected_tab_link ).addClass("selected");
}
/**
 * Show references.
 * @author hkaur5
 * @param elem ( control clicked)
 */
function showReferences( elem )
{
	$(".totallinks").addClass("link500");
	$(".totallinks").removeClass("link500-active");
	$(".linkstxt").addClass("link500-rt");
	$(".linkstxt").removeClass("link500-rt-active");
	var selected_tab_link = $(elem).children('a');
	$('div.reference-accord-content').hide();
	$('div.skills-accord-content').hide();
	$('div.photos-accord-content').hide();
	$('div.links-accord-content').hide();
	$('div.personal-info-accord-content').hide();
	$('div.feedback-accord-content').hide();
	$('div.reference-accord-content').fadeIn();
	$("div.new-nav ul li a ").removeClass("selected");
	$( selected_tab_link ).addClass("selected");
}
/**
 * Show links.
 * @author hkaur5
 * @param elem ( control clicked)
 */
function showLinks( elem )
{
	$(".totallinks").removeClass("link500");
	$(".totallinks").addClass("link500-active");
	$(".linkstxt").removeClass("link500-rt");
	$(".linkstxt").addClass("link500-rt-active");
	var selected_tab_link = $(elem).children('a');
	$('div.reference-accord-content').hide();
	$('div.skills-accord-content').hide();
	$('div.photos-accord-content').hide();
	$('div.personal-info-accord-content').hide();
	$('div.feedback-accord-content').hide();
	$('div.reference-accord-content').hide();
	$('div.links-accord-content').fadeIn();
	$("div.new-nav ul li a ").removeClass("selected");
	$("a.links_tab_child_link").addClass("selected");
	$( selected_tab_link ).addClass("selected");
}
/**
 * Show skills.
 * @author hkaur5
 * @param elem ( control clicked)
 */
function showSkills( elem )
{
	$(".totallinks").addClass("link500");
	$(".totallinks").removeClass("link500-active");
	$(".linkstxt").addClass("link500-rt");
	$(".linkstxt").removeClass("link500-rt-active");
	var selected_tab_link = $(elem).children('a');
	$('div.reference-accord-content').hide();
	$('div.photos-accord-content').hide();
	$('div.personal-info-accord-content').hide();
	$('div.feedback-accord-content').hide();
	$('div.reference-accord-content').hide();
	$('div.links-accord-content').hide();
	$('div.skills-accord-content').fadeIn();
	$("div.new-nav ul li a ").removeClass("selected");
	$( selected_tab_link ).addClass("selected");
}
/**
 * Show photo albums.
 * @author hkaur5
 * @param elem ( control clicked)
 */
function showPhotoAlbums( elem )
{
	$(".totallinks").addClass("link500");
	$(".totallinks").removeClass("link500-active");
	$(".linkstxt").addClass("link500-rt");
	$(".linkstxt").removeClass("link500-rt-active");
	
	var selected_tab_link = $(elem).children('a');
	$('div.reference-accord-content').hide();
	$('div.personal-info-accord-content').hide();
	$('div.feedback-accord-content').hide();
	$('div.reference-accord-content').hide();
	$('div.links-accord-content').hide();
	$('div.skills-accord-content').hide();
	$('div.photos-accord-content').fadeIn();
	$("div.new-nav ul li a ").removeClass("selected");
	$( selected_tab_link ).addClass("selected");
}

/**
 * function used to show share profile popup
 * Author: Sunny patial
 * version: 1.0
 */
function shareProfile(){
	$("div#share").fadeToggle();
}

/**
 * function used to send invitation to users
 * Author: Sunny patial
 * version: 1.0
 */
function invitationToUser(){
	$(".alert-box").remove();
	$('#invitation').hide();
	var iddd = addLoadingImage($("#invitation"), "before", 'loading_small_purple.gif', 0, 0, 'invite_or_cancel_link');
	
	var acceptUser = $("input#req_id").val();
	
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "links/send-link-request",
        type: "POST",
        dataType: "json",
        data: "accept_user="+acceptUser,
        
        success: function(jsonData) 
        {
        	$("span#"+iddd).remove();
        	$('div.requestStatus').show();
        	
        	var html = '<a style="margin-top: 0px;" title="Cancel Request" onclick="cancelRequest('+jsonData+');" id="invitation" class="text-grey-link" href="javascript:;">';
        	html += '<span class = "network_icon frd_req_state_icon"></span>';
        	html += '<label class="send-mail-label">Cancel Request</label></a>';
        	
			$('div.requestStatus').html(html);
        	showDefaultMsg( "Your link request has been sent successfully.", 1 );
        	
		},
        error: function(xhr, ajaxOptions, thrownError) 
        {
        	
		}
    });
}


/**
 * function used to cancel the request
 * param: id is the link_requests primary key
 * Author: Sunny patial
 * version: 1.0
 */
function cancelRequest(id){
	$profileID=$("#req_id").val();
	$('#invitation').hide();
	$(".alert-box").remove();
	var iddd = addLoadingImage($("#invitation"), "before", 'loading_small_purple.gif', 0, 0, 'invite_or_cancel_link');
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "profile/cancel-request",
        type: "POST",
        dataType: "json",
        data: "cancel_request="+id+"&profileID="+$profileID+"&type=request",
        success: function(jsonData) {
        	$("span#"+iddd).remove();
        	$('div.requestStatus').show();
        	
        	if(jsonData.msg){
        		
        		var html = '<a style="margin-top: 0px;" onclick="invitationToUser();" id="invitation" href="javascript:;" title="Invite to Link">';
        		html += '<span class = "network_icon frd_req_state_icon"></span>';
        		html += '<label class="send-mail-label">Invite to Link</label></a>';
            	$('div.requestStatus').html(html);
    			showDefaultMsg(jsonData.msg, 1 );
    		}
    		else if(jsonData==1){
    			
    			var html = '<a style="margin-top: 0px;" onclick="invitationToUser();" id="invitation" href="javascript:;" title="Invite to Link">';
        		html += '<span class = "network_icon frd_req_state_icon"></span>';
        		html += '<label class="send-mail-label">Invite to Link</label></a>';
            	$('div.requestStatus').html(html);
    			showDefaultMsg( "Your link request has been cancel.", 1 );
    		}
    		else if(jsonData==2){
    			var html = '<a style="margin-top: 0px;" title="Send mail" href="'+PROJECT_URL+PROJECT_NAME+'mail/compose#to_user:'+$profileID+'" >';
    			html += '<span class = "send_mail_icon frd_req_state_icon"></span>';
    			html += '<label class="send-mail-label">Send Mail</label></a>';
    			$('div.requestStatus').html(html);
    			showDefaultMsg( "Your link request has been accepted and we can't cancel it.", 1 );
    		}
    		else if(jsonData==3){
    			var html = '<a style="margin-top: 0px;" onclick="invitationToUser();" id="invitation" href="javascript:;" title="Invite to Link">';
        		html += '<span class = "network_icon frd_req_state_icon"></span>';
        		html += '<label class="send-mail-label">Invite to Link</label></a>';
            	$('div.requestStatus').html(html);
    			if(event.type=="decline"){
        			showDefaultMsg( "Your link request has been decline.", 1 );
        		}
        		else{
        			showDefaultMsg( "Your link request has been cancelled.", 1 );
        		}
    		}
         },
        error: function(xhr, ajaxOptions, thrownError) 
        {
		}
    });
}

function redirectUserToMail(id){
	var profileID=id;
	window.location.href="/"+PROJECT_NAME+"mail/compose#"+profileID;
	}

/**
 * function used to accept the request
 * param: id is the link_requests primary key
 * Author: Sunny patial
 * @author ssharma4[Clear user buddylist from localstorage on ajax success.]
 * version: 1.1
 */
function acceptRequest(id){
	$(".alert-box").remove();
	var iddd = addLoadingImage($("#invitation"), "before");
	jQuery.ajax({
		async: false,
        url: "/" + PROJECT_NAME + "profile/accept-request",
        type: "POST",
        dataType: "json",
        data: "accept_request="+id,
        success: function(jsonData)
        {
			//Clear user buddylist from localstorage.
			localStorage.removeItem("jsxc:"+ jsonData.accepter +'@'+OPENFIRE_DOMAIN +":buddylist");
        	$("span#"+iddd).remove();
			var html = '<a style="margin-top: 0px;" title="Send mail" href="'+PROJECT_URL+PROJECT_NAME+'mail/compose#to_user:'+$("#req_id").val()+'" >';
			html += '<span class = "send_mail_icon frd_req_state_icon"></span>';
			html += '<label class="send-mail-label">Send Mail</label></a>';
			$('div.requestStatus').html(html);
			
        	showDefaultMsg( 'You are linked to '+$("#fbname").val(), 1 );
		},
        error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
		}
    });
}
/**
 * function used to unfriend the request
 * param: id is the link_requests primary key
 * Author: Sunny patial
 * version: 1.0
*/
function unFriend(id){
	$profileID=$("#req_id").val();
	$(".alert-box").remove();
	var iddd = addLoadingImage($("#invitation"), "before");
	jQuery.ajax({
		async: false,
        url: "/" + PROJECT_NAME + "profile/cancel-request",
        type: "POST",
        dataType: "json",
        data: "cancel_request="+id+"&profileID="+$profileID,
        success: function(jsonData) {
        	$("span#"+iddd).remove();
        	$("#invitation").attr("onclick","invitationToUser()");
        	$("#invitation").html("Invite to Link");
        	$("#invitation").attr("title","Invite to Link");
        	showDefaultMsg( "Unlink successfully.", 1 );
		},
        error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
		}
    });
}
/**
 * function used to bookmark the profile
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
*/
function bookmarkProfile(event){
	var uid=event.id;
	if(event.rel){
		var changeStatus=event.rel;
	}
	else{
		var changeStatus=1;
	}
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "links/bookmark-status",
        type: "POST",
        dataType: "json",
        data: { "user_id" : uid, "status" : changeStatus },
        timeout: 50000,
        success: function(jsonData) {
        	$(".alert-box").remove();
    		$(".alert-box1").remove();
    		$(".alert-box2").remove();
    		if(event.rel){
    			$("[name=bookmarkicon_"+uid+"]").removeAttr("rel");
            	$("[name=bookmarkicon_"+uid+"]").removeClass("bookmark-linked");
            	$("[name=bookmarkicon_"+uid+"]").attr("title","Bookmark Profile");
            	$("[name=bookmarkicon_"+uid+"]").addClass("bookmark-link");
        		showDefaultMsg( "Unbookmarked successfully.", 1 );
    		}
    		else{
    			$("[name=bookmarkicon_"+uid+"]").attr("rel","0");
            	$("[name=bookmarkicon_"+uid+"]").removeClass("bookmark-link");
            	$("[name=bookmarkicon_"+uid+"]").attr("title","Remove Bookmark");
            	$("[name=bookmarkicon_"+uid+"]").addClass("bookmark-linked");
    			showDefaultMsg( "Bookmarked Successfully.", 1 );
    		}
        },
        error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
		}
	 });
}

/**
 * Function to change job seeker flag
 * @Param: Object elem , element itself as parameter
 * Author: dsingh
 * Version: 1.0
*/
function jobSeekerFlagStatus(elem)
{
	
	//GET FLAG IMAGE SOURC AND PUT IT INTO A VARIABLE
    var fullImagePath = jQuery("#flagstatus").attr("src");
   
    //GET COUNTER 'FLAG' TO CHECK THE CURRENT ACTIVE FLAG. TO BE USED IN SWITCH CASE LATER ON.
    var titleVar = parseInt(jQuery("#flagstatus").attr("flag"));
   
    //EXTRACT THE URL OF IMAGE EXCLUDING THE IMAGE NAME.	  
    var imagePathFirstPart = jQuery("#flagstatus").attr("src");
   
    //MAKE FLAG IMAGE ATTRIBUTE 'FLAG' BLANK TO PREVENT CONCATANATION OF COUNTER
    jQuery("#flagstatus").attr("flag","");
   
    //INCREAMENT THE COUNTER
    titleVar = titleVar+1;
    
    //SET THE FLAG TO NEW COUNTER AFTER INCEREAMENT
    jQuery("#flagstatus").attr("flag",titleVar);
   
    //GET THE IMAGE NAME BY EXTRACTIG IT FROM IMAGE URL  AND FIRST PART WITHOUT IMAGE NAME
    var imagePathArray = fullImagePath.split("/"); 
    var imagePathImageNamePart = $(imagePathArray).get(-1);
   
    var imagePathFirstPart = imagePathArray.pop();
        imagePathFirstPart = imagePathArray.join("/")+"/";
       
       
       
    //------------------------------------
    var idd = addLoadingImage($(elem), 'before', 'tiny_loader.gif' );
   	jQuery.ajax({
   		async: false,
           url: "/" + PROJECT_NAME + "profile/save-flag-status",
           type: "POST",
           dataType: "json",
           data: {'flag_status': titleVar },
           success: function(jsonData) {
           	
               //SWITCH IMAGE SOURCE ON EVERY CLICK.
        	   switch(titleVar)
        	   {
      		    case 4:
      		      jQuery("#flagstatus").attr("src",imagePathFirstPart+"icon-flag-grey.png");
      		      $("span#jobSeekerLebel").html("Not Seeking Job");
      		      titleVar = 1;
      		      
    	          jQuery("#flagstatus").attr("flag",titleVar);
    	          jQuery("#flagstatus").attr("title","Off");
    	          break;

        		 case 3:
        			 jQuery("#flagstatus").attr("src",imagePathFirstPart+"icon-flag-on-hidden.png");
        			 $("span#jobSeekerLebel").html("Job Seeker- Invisible");
        			 
        			 jQuery("#flagstatus").attr("title","On But Hidden");
        			 jQuery("#flagstatus").attr("flag",titleVar);
        	         break;
        	         
        	     case 2:
        		     jQuery("#flagstatus").attr("src",imagePathFirstPart+"icon-flag.png");
        		     $("span#jobSeekerLebel").html("Seeking for Job");
        		     
        		     jQuery("#flagstatus").attr("flag",titleVar);
        		     jQuery("#flagstatus").attr("title","On");
        	         break;
        	         
        	      default:
        	    	 
        		      titleVar = 1;
        		      jQuery("#flagstatus").attr("src",imagePathFirstPart+"icon-flag-grey.png");
        	          jQuery("#flagstatus").attr("flag",titleVar);
        	          jQuery("#flagstatus").attr("title","Off");
        	   }
           	
		    $("span#"+idd).remove();
		    $("div.message_box").remove();
           	
			switch(jsonData)
			{
        	    case 1:
        	   	 showDefaultMsg( "Job seeker flag has been set to OFF .", 1 );
        	   	 break;
        	   		
        	   	case 3:
        	   	 showDefaultMsg( "Job seeker flag has been set to ON but HIDDEN.", 1 );
        	   	 break;
        	   			
        	   	case 2:
        	   	 showDefaultMsg( "Job seeker flag has been set to ON.", 1 );
        	   	 break;

        	   	case 4:
           	   	 showDefaultMsg( "Job seeker flag has been set to OFF .", 1 );
           	   	 break;
        	   	 
        	   	default:
        	   		 showDefaultMsg( "Error occured please try again.", 1 );
        	   			 
        	 }
           	
   		},
           error: function(xhr, ajaxOptions, thrownError) {
   			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
   		}
       });      
}

/**
 * Function to supprot a skill on user profile.
 * @Param: integer skill_id, Id of a skill 
 * @Param: integer supporter_id , user himself who is supporting
 * @Param: Integer user_id , user who's skills are being supported.
  
 * Author: dsingh
 * Version: 1.0
*/

function supportSomeSkill(skill_id, supporter_id , user_id, elem )
{
	
    var idd = addLoadingImage($(elem), 'after', 'tiny_loader.gif' );
    var src = $(elem).attr("src");
    var title = $(elem).attr("title")
    
        	jQuery.ajax({
            url: "/" + PROJECT_NAME + "profile/save-supported-skills",
            type: "POST",
            dataType: "json",
            data: { "skill_id" : skill_id, "user_id" : user_id, "supporter_id" : supporter_id },
             
            success: function( jsonData ) 
            {
                $("span#"+idd).remove();
                $("div.message_box").remove();
                
                //unsupporting skill
            	if( jsonData.support_type == 0 )
            	{
//            	  $("div[rel="+skill_id+"-"+supporter_id+"-"+user_id+"]").remove('span#'+skill_id+"-"+supporter_id+"-"+user_id);
//            	  $("div[rel="+skill_id+"-"+supporter_id+"-"+user_id+"]").children("span[rel1="+skill_id+"-"+supporter_id+"-"+user_id+"]").prepend('<span id="'+skill_id+'-'+supporter_id+'-'+user_id+'">'+jsonData.no_of_supporters+'</span>');
            	  $("#"+skill_id+"-"+supporter_id+"-"+user_id).html(jsonData.no_of_supporters);
            	
               	  $(elem).parent().parent().next().children().eq(1).children("div.user-"+supporter_id).fadeOut( "slow", function(){ this.remove();});
 
         
               	  if( jsonData.no_of_supporters == 0)
               		  {
                  	   $(elem).parent().parent().next().children().eq(1).append('<span id="no_skills">No skill supporter found!</span>');
               		  }
               	 $(elem).attr("title","Support");
                 $(elem).attr("src",IMAGE_PATH+"/icon-support.png");
           	
            	}
           	
            	else if( jsonData.support_type == 1 )
            	{
            	  
            	   var fname_of_user = jsonData[0].firstname;
            	   if( fname_of_user.length > 7)
            		   {
            		       fname_of_user = fname_of_user.substr(0,5);
            		       fname_of_user = fname_of_user+"...";
            		   }
            	   else
            		   {
            		       fname_of_user = jsonData[0].firstname;
            		   }
             	  
//            	  $("span#"+skill_id+"-"+supporter_id+"-"+user_id).html("");
               	$("span#"+skill_id+"-"+supporter_id+"-"+user_id).html(jsonData.no_of_supporters);
                  var basic_text = $(elem).parent().parent().next().children().eq(1).text();
                  if( basic_text == '<div style="text-align: center;" class="slide-down-inner-container" id="users10">No skill supporter found!</div>' )
                	  {
                	  }
                   $(elem).parent().parent().next().children().eq(1).children("#no_skills").fadeOut("slow");
               	   $(elem).parent().parent().next().children().eq(1).append('<div style="float: left ! important; width: 66px ! important; display:none; " class="col1 user-'+supporter_id+'" ><a target="_blank" class="text-purple2-link" title="'+jsonData[0].firstname+' '+jsonData[0].lastname+'" href="/'+PROJECT_NAME+'profile/iprofile/id/'+supporter_id+'"><img src="'+jsonData.profile_photo+'" height="51" >'+fname_of_user+'</a></div>');
               	   $(elem).parent().parent().next().children().eq(1).children(".user-"+supporter_id).fadeIn("slow");
               	
               	   $(elem).attr("src",IMAGE_PATH+"/icon-support-hover.png");
               	   $(elem).attr("title","Unsupport");
               	   
            	}	
            	else
            		{
            		  showDefaultMsg( "Something went wrong , Please try again", 1 );
            		}
             },
            error: function(xhr, ajaxOptions, thrownError) {
    		}
    	 });
        	 
}


/**
 * Function to remove anchor tag and change image on cleint side after supporting a skill
 * @Param: object elem , element itself
 * Author: dsingh
 * Version: 1.0
*/

function changeSupportSkillIcon(elem)
{	
            
    	if( $(elem).attr("src") == IMAGE_PATH+"/icon-support-hover.png" )
		{
    		$(elem).attr("src",IMAGE_PATH+"/icon-support-hover.png");
		}
    	else
		{
			$(elem).attr("src",IMAGE_PATH+"/icon-support.png");
		}
        	
}

function showMoreSupporter(element,limiter)
{
	var count = 0;
	$( element ).prev().css( "display", "none" );
	
}

/**
 * function used to show listing of user albums.
 * @author sgandhi, hkaur5, jsingh7
 * version: 1.3
 */
function loadPhotoAlbums(uid, page, limit)
{
	var user_id = uid;
	var html="";
	$loadingImage = "<img id = 'album_loading' src = '/" + PROJECT_NAME + "public/images/loading_large_purple.gif' alt = 'Wait...' />";
	$("#album").append($loadingImage).css('text-align','center');
	
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "profile/photo-albums-profile-listing",
        type: "POST",
        dataType: "json",
        data : {"uid":uid, "page":page, "limit":limit},
        success: function(jsonData) {
        	
        	$("#album img#album_loading").remove();
        	
        	if(jsonData['album_info'])
        	{
	        	for(i in jsonData['album_info'])
	        	{
	        		    html+='<div class="whitebox">';
	            		html+='<a href="'+PROJECT_URL+PROJECT_NAME+'profile/photos/uid/'+uid+'/id/'+jsonData['album_info'][i]["id"]+'">';
	                	html+='<img src="'+jsonData['album_info'][i]["socialise_albums_socialise_photo"]+'"/>';
	                	html+='<div class="caption">';
	                	html+='<div class="col1-title lt" title="'+jsonData['album_info'][i]["album_name"]+'" >';
	            		html+=showCroppedText( jsonData['album_info'][i]["album_name"], 15 ) ;
	            		html+='</div>';
	            		html+='<div class="col1-title3 rt">';
	            		html+=jsonData['album_info'][i]["photo_count"];
	            		html+='</div>';
	            		html+='</div>';
	            		html+='</div>';
	            		html+='</a>';	            
	            		html+='</div>';
	        	}
	        	$('#detail').append(html);
	        	
	        	$("input#album_page").val( parseInt( $("input#album_page").val() ) + 1 );
	        	
	        	if( jsonData['is_there_more_albums'] != 0 )
	        	{	
	        		loadPhotoAlbums(user_id, $("input#album_page").val(), 12);
	        	}
        	}
        	else if(jsonData.login_user_no_album_msg)
        	{
        		 html+='<div class="no-albums">';
        		 html+='<img src="'+IMAGE_PATH+'/no-album.png"/>';
        		 html+='<div class="no-album-text">';
        		 html+='No Albums to be displayed';
        		 html+='</div>';
        		 html+='<div>';
        		 
        		 html+='<a href ="'+PROJECT_URL+PROJECT_NAME+'profile/photo-albums" class="create-album">';
        		 html+= '+Create New Album';
        		 html+=	'</a>';
        		 html+='</div>';
        		 html+='</div>';
        		$('#detail').html( html );
        	}
        	else if(jsonData.not_a_login_user_no_album_msg)// if albums are not of login user and there are no albums.
        	{
        		 html+='<div class="no-albums">';
        		 html+='<img src="'+IMAGE_PATH+'/no-album.png"/>';
        		 html+='<div class="no-album-text">';
        		 html+=jsonData['albums_owner_name']+ " " +jsonData['not_a_login_user_no_album_msg'];
        		 html+='</div>';
        		 html+='</div>';
        		$('#detail').html( html );
        	}
        	else
        	{
        		 html+='<div class="no-albums">';
        		 html+='<img src="'+IMAGE_PATH+'/no-album.png"/>';
        		 html+='<div class="no-album-text">';
        		 html+=jsonData['albums_owner_name']+ " " + "has not shared any albums with you.";
        		 html+='</div>';
        		 html+='</div>';
        		$('#detail').html(html);
        	}
		},
        error: function(xhr, ajaxOptions, thrownError)
        {
        	
		}
    });
}
/**
 * function used to show listing of user links.
 * 
 * @author shaina
 * @author spatial
 * @author hkaur5 (worked on else part)
 * @author jsingh7 (worked on section, when no links available (import contacts))
 * @version 1.3
 */
function profileLinks(uid){
	
	$('#links-profie').hide();
	var iddd = addLoadingImage( $("#links-pro"), "before", "loading_large_purple.gif", 575, 40);
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "profile/links-profile-listing",
        type: "POST",
        dataType: "json",
        data : "uid="+uid,
        success: function(jsonData) {
        	var html="";
        	html+='<div id="userLinks" style="font-weight: bold; width: 100%; float: right ! important; text-align:right;">';
        	if( jsonData.links != '' )
        	{	
        		html+='<a href="javascript:;" class="showLinks" style="text-decoration:none;font-weight:bold;font-family:arial;">All Links</a>';
        	}	
        	if(jsonData.mutual_status==1)
        	{
        		html+=' | <a href="javascript:;" class="showMutualLinks inactiveLink" style="text-decoration:none;font-weight:bold;font-family:arial;">Mutual Links</a>';		
        	}        	
        	html+='</div>';
        	
        	$("span#"+iddd).remove();
        	html+='<div style="width: 100%; float: left;" class="links-listing">';
        	if( jsonData.links != '' )
        	{
        		html+=jsonData.links;
        	 	html+='</div>';
            	html+='<div style="width: 100%; float: left; display:none;" class="mutual-links-listing">';
            	html+='</div>';
            	$('#links-profie').html(html);
            	$('#links-profie').show();
            	fireLinksEvents();
        	}
        	else if ( jsonData.links == '')
        	{
        		$("div#links-profie").show();
        		$("div#no_links_div").show();
        	}
		},
        error: function(xhr, ajaxOptions, thrownError) 
        {
        	
		}
    });
}

function shareProfileWithInIlook(){
	$("#shareIlookUrl").hide();
	__addOverlay();

	jQuery.ajax({
        url: "/" + PROJECT_NAME + "dashboard/post-on-wall",
        type: "POST",
        dataType: "json",
        data : { 'is_profile_url' : 1, 'profile_share_user_id' :$("input#OtherProfileUserID").val() },
        success: function(jsonData) {
        	__removeOverlay();
        	$('#links-profie').show();
        	$("#shareIlookUrl").show();
        	$("#sharetxt").val("");
        	shareProfile();
        	$(".alert-box").remove();
    		$(".alert-box1").remove();
    		$(".alert-box2").remove();
    		showDefaultMsg( "Profile shared on the wall.", 1 );
		},
        error: function(xhr, ajaxOptions, thrownError) 
        {
        	
		}
    });
}


//--------------------Cover photo upload functions starts----------------------------
/*
 * Trigger upload_cover_photo file uploader.
 * @author hkaur5
 */
function tiggerUploadCoverPhotoCtrl()
{
	//empty rel attr of cancel btn.
	//because rel attr of cancel btn is used to know whether we are cancelling
	//reposition or uploading.
	$('a#cancel_cover').attr('rel','uploading');
	$('input#upld_cvr_photo').click();
	
}

/**
 * Ajax call to save cover photo and display it with saved position
 * @param element
 * @author hkaur5
 */
function saveCoverPhoto( element )
{
	var loader = addLoadingImage( $(element), 'before', 'loading_small_purple.gif', 0, 0, 'save_cover_loading' );
	$(element).hide();
	$('a.cancel_cvr').hide();
	$('ul.cover_photo_menu').hide();
	
	// Empty rel attr of cancel btn.
	// because rel attr of cancel btn is used to know whether we are cancelling
	// reposition or uploading of cover photo.
	$('a#cancel_cover').attr('rel','');
	
	var new_cover_photo = 1;
	if($('input#save_cover').attr('rel') == 'save_new_positioning')
	{
		new_cover_photo = 0;
	}
	$('input#save_cover').attr('rel','');
	var cover_img_name = $('div#cover_photo').children('img').attr('rel1');
	var cover_img_position_top = $('input.cover-position').val();
	console.log(cover_img_position_top);
	
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "profile/save-cover-photo",
        type: "POST",
        dataType: "json",
        data : { 'cover_img_name':cover_img_name,"img_position_top":cover_img_position_top,'save_new_cover':new_cover_photo  },
        success: function(jsonData) 
        {
        	if(jsonData['cover_photo_name'])
    		{
        		$('div#cover_photo img#cvr_photo_img').draggable( 'disable' );
        		$("span#"+loader).remove(); 
        		$(element).show();
        		$('a.cancel_cvr').show();
        		$('div.instructionWrap').hide();
        		$('div#update_cover_outer').hide();
        		$('div#cover_photo img#cvr_photo_img').attr('src',IMAGE_PATH+'/'+'cover_photo/user_'+jsonData['cover_photo_user_id']+'/'+jsonData['cover_photo_name']);
        		
        		//Cover photo css.
        		$('div#cover_photo img#cvr_photo_img').css('top',jsonData['y_position']);
        		$('div#cover_photo img#cvr_photo_img').css('opacity',1);
        		
        		
    		}
        	
        	//If cover photo was not save then show previously saved cover photo.
        	else if(jsonData['prev_covr_photo_name'])
    		{
        		$('div#cover_photo img#cvr_photo_img').draggable( 'disable' );
        		$("span#"+loader).remove(); 
         		$(element).show();
        		$('a.cancel_cvr').show();
        		$('div.instructionWrap').hide();
        		$('div#update_cover_outer').hide();
        		$('div#cover_photo img#cvr_photo_img').attr('src',IMAGE_PATH+'/'+'prev_covr_photo_name');
        		
        		//Cover photo css.
        		$('div#cover_photo img#cvr_photo_img').css('top',jsonData['prev_cvr_photo_y_position']);
        		$('div#cover_photo img#cvr_photo_img').css('opacity',1);
        		
        		showDefaultMsg( "Some error has occurred while save cover photo. We will fix this error soon. Please try again!", 2 );
        		
    		}
        	
        	// If cover photo not saved and no previous cover photo was there then show default cover photo.
        	else if(jsonData['user_gender'])
        	{
        		$('div#cover_photo img#cvr_photo_img').draggable( 'disable' );
        		$("span#"+loader).remove(); 
         		$(element).show();
        		$('a.cancel_cvr').show();
        		$('div.instructionWrap').hide();
        		$('div#update_cover_outer').hide();
        		$('div#cover_photo img.cvr_img').attr('src',IMAGE_PATH+'/cover-female-default.png');		
//        		if(jsonData['user_gender'] == 2)
//        		{
//        			$('div#cover_photo img.cvr_img').attr('src',IMAGE_PATH+'/cover-female-default.png');		
//        		}
//        		else
//        		{
//        			$('div#cover_photo img.cvr_img').attr('src',IMAGE_PATH+'/cover-male-default.png');		
//        		}
        		$('div#cover_photo img.cvr_img').removeClass('my_cover_photo');		
        		$('div#cover_photo img.cvr_img').addClass('my_default_cover_photo');		
        		//Default cover photo css.
        		$('div#cover_photo img.cvr_img').css('opacity','1');	
        		$('div#cover_photo img.cvr_img').css('min-height','202px');	
        		
        		
        	}
        }
	});
}

/**
 * Cancel uploading newly uploaded cover photo and displaying previously adedd 
 * with previous db record.
 * @param element
 */
function cancelCoverPhotoChanges(element)
{
	
	var loader = addLoadingImage( $(element), 'before', 'loading_small_purple.gif', 0, 0,"save_cover_loading" );
	$(element).hide();
	$('input#save_cover').hide();
	$('ul.cover_photo_menu').hide();
	var current_user_id = $('input#upld_cvr_photo').attr('rel');
	var cover_img_name = $('div#cover_photo').children('img').attr('rel1');
	
	//If rel attr of cancel button contains value = cancel_repositiioning then
	// only reset its position and deleting current cover photo source not required.
	
	var cancel = "reposition";
	if( $(element).attr('rel') == 'cancel_repositioning')
	{
		cancel = "reposition";
	}
	else
	{
		 cancel = "uploading";
	}
	$(element).attr('rel','');
	jQuery.ajax
	({
        url: "/" + PROJECT_NAME + "profile/cancel-cover-photo-changes",
        type: "POST",
        dataType: "json",
        data : { 'cover_img_name':cover_img_name,"cancel":cancel},
        success: function(jsonData) 
        {
        	
        	//If json data contains previous cover photo info that means
        	// uploading is cancelled mid way and set cover photo to previous one from database.
        	if( jsonData['prev_covr_photo_name'] )
    		{
        		$('div#update_cover_outer').hide();
        		$('div#cover_photo img#cvr_photo_img').draggable( 'disable' );
        		$("span#"+loader).remove(); 
        		$(element).show();
        		$('input#save_cover').show();
        		$('div.instructionWrap').hide();
        		$('div#update_cover_outer').hide();
        		$('div#cover_photo img#cvr_photo_img').attr('src',IMAGE_PATH+'//cover_photo/user_'+current_user_id+'/'+jsonData["prev_covr_photo_name"]);		
        		$('div#cover_photo img#cvr_photo_img').css('top',jsonData["prev_cvr_photo_y_position"]);		
        		//Cover photo css.
        		$('div#cover_photo img#cvr_photo_img').css('opacity','1');		
        		$('div#cover_photo img#cvr_photo_img').css('position','relative');		
    		}
        
        	//If jsonData contains info of current cover photo that means
        	//reposition is cancelled midway and we have to reset cover photo position to as it is in database.
        	else if( (jsonData['crnt_cvr_photo_y_position'] && jsonData['crnt_cvr_photo_y_position'] !="" && jsonData['crnt_cvr_photo_y_position'] != null)
        			|| jsonData['crnt_cvr_photo_y_position'] == 0 )
    		{
        		//hide save and cancel button panel.
        		$('div#update_cover_outer').hide();
        		//Dragging disabled.
        		$('div#cover_photo img#cvr_photo_img').draggable( 'disable' );
        		$("span#"+loader).remove(); 
        		$(element).show();
        		$('input#save_cover').show();
        		$('div.instructionWrap').hide();
        		//Cover photo css.
        		$('div#cover_photo img#cvr_photo_img').css('top',jsonData["crnt_cvr_photo_y_position"]);
        		$('div#cover_photo img#cvr_photo_img').css('opacity','1');	
    		}
        	//Showing default picture if no cover photo exist.
        	else
        	{
        		//hide save and cancel button panel.
        		$('div#update_cover_outer').hide();
        		//Dragging disabled.
        		$('div#cover_photo img#cvr_photo_img').draggable( 'disable' );
        		$("span#"+loader).remove(); 
        		$(element).show();
        		$('input#save_cover').show();
        		$('div.instructionWrap').hide();
        		$('div#cover_photo img#cvr_photo_img').attr('src',IMAGE_PATH+'/cover-female-default.png');		
//        		if(jsonData['user_gender'] == 2)
//        		{
//        			$('div#cover_photo img#cvr_photo_img').attr('src',IMAGE_PATH+'/cover-female-default.png');		
//        		}
//        		else
//    			{
//        			$('div#cover_photo img#cvr_photo_img').attr('src',IMAGE_PATH+'/cover-male-default.png');		
//    			}
        		$('div#cover_photo img#cvr_photo_img').removeClass('my_cover_photo');		
        		$('div#cover_photo img#cvr_photo_img').addClass('my_default_cover_photo');		
        		$('div#cover_photo img#cvr_photo_img').css('opacity','1');	
         		//Default cover photo css.
        		$('div#cover_photo img.cvr_img').css('top','0');	
        		$('div#cover_photo img.cvr_img').css('left','0');	
        		$('div#cover_photo img.cvr_img').css('opacity','1');	
        		$('div#cover_photo img.cvr_img').css('min-height','202px');	
        	}
//        	else 
//        	{
//        		//hide 'save and cancel' button panel.
//        		$('div#update_cover_outer').hide();
//        		//Dragging disabled.
//        		$('div#cover_photo img#cvr_photo_img').draggable( 'disable' );
//        		$("span#"+loader).remove(); 
//        		$(element).show();
//        		$('input#save_cover').show();
//        		$('div.instructionWrap').hide();
//    			$('div#cover_photo img.cvr_img').attr('src',IMAGE_PATH+'/cover-male-default.png');		
//        		$('div#cover_photo img.cvr_img').removeClass('my_cover_photo');		
//        		$('div#cover_photo img.cvr_img').addClass('my_default_cover_photo');		
//        		$('div#cover_photo img.cvr_img').css('opacity','1');	
//        		
//        		//Default photo css.
//        		$('div#cover_photo img.cvr_img').css('top','0');	
//        		$('div#cover_photo img.cvr_img').css('left','0');	
//        		$('div#cover_photo img.cvr_img').css('opacity','1');	
//        		$('div#cover_photo img.cvr_img').css('min-height','202px');	
//        	}
        		
        }
        
    });
	
}

/**
 * Making cover photo draggable to reposition it.
 * @param element(reposition button)
 * @author hkaur5
 */

function repositionCoverPhoto( element )
{
	$('ul.cover_photo_menu').hide();
	// Puting rel value in cancel button so as to know 
	// whether to cancel cover photos repositioning or uploading.
	$('a#cancel_cover').attr('rel','cancel_repositioning');
	$('input#save_cover').attr('rel','save_new_positioning');
	$('div.instructionWrap').show();
	
	//Show save and cancel btns.
	$('div#update_cover_outer').show();
	
	//Making cover image draggable to reposition it.
	$('div#cover_photo img#cvr_photo_img').css('cursor', 'all-scroll')
	.draggable({ 
		scroll: false,
	    disabled: false,
		cursor: "all-scroll", 
		axis:"y",
		drag: function (event, ui) 
		{
			y1 = $('.timeline-header-wrapper').height(); 
			y2 = $('div#cover_photo').find('img').height(); 
	 
			if (ui.position.top >= 0) 
			{ 
				ui.position.top = 0;
			}  
			else if (ui.position.top <= (y1-y2)) 
			{
				ui.position.top = y1-y2; 
			}
				
			},
			stop: function(event, ui) 
			{  
				$('input.cover-position').val(ui.position.top);
			}  
		});  
}	     

/**
 * Delete current cover photo and display default cover photo.
 * @author hkaur5
 * @param element
 */
function deleteCoverPhoto(element)
{
	$('div#cover_photo').append('<img class="cover_photo_loading" style="position: absolute;top:100px; left:400px; z-index:4;" src="'+IMAGE_PATH+'/loading_medium_purple.gif"/>');
	$('ul.cover_photo_menu').hide();
	
	var cover_img_name = $('div#cover_photo').children('img').attr('rel1');
	$(element).attr('rel','');
	jQuery.ajax
	({
        url: "/" + PROJECT_NAME + "profile/delete-cover-photo",
        type: "POST",
        dataType: "json",
        data : { 'cover_img_name':cover_img_name },
        success: function(jsonData) 
        {
        	$('img.cover_photo_loading').hide();
    		$('div#cover_photo img.cvr_img#cvr_photo_img').attr('src',IMAGE_PATH+'/cover-female-default.png');	
    		$('div#cover_photo img.cvr_img#cvr_photo_img').attr('rel1','');	
    		$('div#cover_photo img.cvr_img').removeClass('my_cover_photo');		
    		$('div#cover_photo img.cvr_img').addClass('my_default_cover_photo');
    		//Dragging disabled.
    		$('div#cover_photo img#cvr_photo_img').draggable( 'disable' );
    		
    		//default cover photo css.
    		$('div#cover_photo img.cvr_img').css('top','0');	
    		$('div#cover_photo img.cvr_img').css('left','0');	
    		$('div#cover_photo img.cvr_img').css('opacity','1');	
    		$('div#cover_photo img.cvr_img').css('min-height','202px');	
        }
        
	});
}
//--------------------Cover photo upload functions END----------------------------	     


/**
 * function for loading more albums on photo albums page
 * @author sjaiswal
 * @param offset 
 * @param limit 
 * @version 1.0
 * @deprecated
 */
/*function loadMoreAlbums(offset,limit)
{
	offset = typeof offset !== 'undefined' ? offset : 0;
	//alert(offset+'==='+limit);
	var html= "";
	//check if more albums are present or not
	if($('#is_there_more_albums').val()==1)
	{
	$("div.loading_albums").fadeIn();
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/get-my-albums",
		method : "POST",
		data: { 'offset' : offset ,'limit':limit},
		type : "post",
		dataType : "json",
		timeout: 50000,
		success : function(jsonData) {
			for( i in jsonData['album_info'] )
        	{
				
    		    html+='<div class="whitebox">';
        		html+='<a href="'+PROJECT_URL+PROJECT_NAME+'profile/photos/uid/'+jsonData['album_info'][i]["uid"]+'/id/'+jsonData['album_info'][i]["id"]+'">';
            	html+='<img src="'+jsonData['album_info'][i]["socialise_albums_socialise_photo"]+'"/>';
            	html+='<div class="caption">';
            	html+='<div class="col1-title lt" title="'+jsonData['album_info'][i]["album_name"]+'" >';
        		html+=showCroppedText( jsonData['album_info'][i]["album_name"], 15 ) ;
        		html+='</div>';
        		html+='<div class="col1-title3 rt">';
        		html+=jsonData['album_info'][i]["photo_count"];
        		html+='</div>';
        		html+='</div>';
        		html+='</div>';
        		html+='</a>';	            
        		html+='</div>';	
		
			//incrementing offset.
			$("input#offsett").val( parseInt( $("input#offsett").val() ) + 1 );

        	}
			
			$("div#detail").append(html);
			
			//assigning is there more albums value to hidden field
			$("input[id=is_there_more_albums]").val(jsonData.is_there_more_albums);
			
			$("div.loading_albums").hide();
			
		}
	});
	}
}*/

/**
 * Ajax call which changes the status of feedback to accepted.
 * @param element
 * @author hkaur5
 */
function acceptFeedbackReceived(element)
{
		if( feedback_call )
		{	
			if( feedback_call.state() != "resolved" )
			{
				return;
			}
		}
		var idd = addLoadingImage($(element), "before");
		var thiss = $(element);
		feedback_call = $.ajax({
//			async: false,
			url : "/" + PROJECT_NAME + "feedback/accept-feedback",
			method : "POST",
			data : { 'feedback_req_id' : $(element).attr("rel") },
			type : "post",
			dataType : "json",
			success : function(jsonData){
				if(jsonData == 1)
				{
					 $("span#"+idd).remove();
					 $(thiss).hide();
					 showDefaultMsg( "You have accepted the feedback.It will now display in your profile.", 1 );
				}
				else
				{
					showDefaultMsg( "Some error has occured while accepting feedback. We hope to fix this error soon!", 2 );
					
				}
			}
			});
		
}

/**
 * Ajax call which changes the status of feedback to accepted.
 * @param element
 * @author hkaur5
 */
function acceptReferenceReceived(element)
{
	if( reference_call )
	{	
		if( reference_call.state() != "resolved" )
		{
			return;
		}
	}
	var loading_img = addLoadingImage($(element), "before");
	var thiss = $(element);
	reference_call = $.ajax(
	{
		url : "/" + PROJECT_NAME + "reference-request/accept-reference",
		method : "POST",
		data : { 'reference_req_id' : $(element).attr("rel") },
		type : "post",
		dataType : "json",
		success : function(jsonData)
		{
			if(jsonData == 1)
			{
				 $("span#"+loading_img).remove();
				 $(thiss).hide();					
				 showDefaultMsg( "You have accepted the reference.It will now display in your profile.", 1 );
			}
			else
			{
				showDefaultMsg( "Some error has occured while accepting reference. We hope to fix this error soon!", 2 );
				
			}
		}
	});
}

