$(document).ready(function(){
	$("#hideNotes").click(function(){
		$("#displayNotes").fadeToggle('slow');
	});	
	$("img#hideNotes").click(function(){
		$(".closeNotesPopup").hide();
		$(".closeNotesPopup").fadeToggle('slow');
	});	
	
	$("img#closeNote").click(function(){
		$("#displayNotes").fadeToggle('slow');
	});	
	
	$("#closeManageTagPopups").click(function(){
		$("#tag-manage-outertags").hide();
	});	
	
	$("#closeManageGroupPopups").click(function(){
		$("#tag-manage-outertags").hide();
	});	
	
	// Change text of Reported as abuse to Cancel report abuse on hover 
	// in short profile view. 
	// Added by hkaur5
	$('body').on('mouseover','a.change_text',function(){
		$(this).html('Cancel Report Abuse');
	});
	$('body').on('mouseout','a.change_text',function(){
		$(this).html('Reported as Abuse');
	});
	//-----------------------------------------------------------------
	
});
$(document).mouseup(function (e){
	var container = $(".notesPop");
    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
    	$(".notes-popup-outer").hide(); 
    }
    // 
    var container = $(".notes-popup-outer2");
    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
    	$(".notes-popup-outer2").hide(); 
    }
    // 
    var container = $(".manage-pop");
    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
    	$(".manage-pop-outer").hide(); 
    }
    // 
    var container = $(".tag-manage-outer");
    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
    	$(".tag-manage-outer").hide(); 
    }
    // 
    var container = $("#tags-menu-popUp");
    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
    	$("#tags-menu-popUp").hide(); 
    }
 // 
    var container = $(".closeTagsPopup");
    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
    	$(".closeTagsPopup").hide(); 
    }
    // 
    var container = $(".download-pop");
    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
    	$(".download-pop").hide(); 
    }
    // 
    var container = $(".msg-popup-outer");
    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
    	$(".msg-popup-outer").hide(); 
    }
 // 
    var container = $("#groups-menu-popUp");
    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
    	$("#groups-menu-popUp").hide(); 
    }
    
});
$(document).keyup(function(e) {
    if (e.keyCode == 27) {
        $(".notes-popup-outer").hide(); 
        $(".closeTagsPopup").hide(); 
        $("#tags-menu-popUp").hide();
        $("#groups-menu-popUp").hide();
        $(".download-pop").hide();
        // manage tag popup hide..
        if($('#tag-manage-outertags').is(':visible')==true){
        	$("#tag-manage-outertags").hide();        	
        }
        else{
	        // manage popup hide....
	        $(".manage-pop-outer").hide();
        }	
    }
});
//PDF REPORT: show download pdf file popup
// author: Sunny Patial
function downloadProfile(elem){
	$(".chk_all_"+$(elem).attr("uid")).removeAttr("checked");
	$(".chk_options_"+$(elem).attr("uid")).removeAttr("checked");
	$(".tag-popup-btn_"+$(elem).attr("uid")).css("display","none");
	$("#download-pop_"+$(elem).attr("uid")).toggle();
}
// download detail...
function downloadDetail(elem){
	generateReport($(elem).attr("uid"));
}
/**
 * function used for to Generate PDF.
 * @author Sunny Patial.
 */
function generateReport(uid){
	$(".message_box").remove();
	var allParms=$("form#iprofile_"+uid).serialize();
	window.open("/" + PROJECT_NAME + "profile/generate-report-contact-information/?"+allParms);
	//showdownload();
	
}
/**
 * function used to get short profile
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function getShortProfile(elem,jsonParameters){
	// hide tag popup...
	$("#tags-menu-popUp").hide();
	
	// hide group popup...
	$("#groups-menu-popUp").hide();
	
	// hide download popup...
	$(".download-pop").hide();
	
	// hide tag popup...
	$(".closeTagsPopup").hide();
	
	// hide notes popup...
	$(".closeNotesPopup").hide();
	
	// hide manage popup...
	$(".manage-pop-outer").hide();
	
	// hide group popup...
	$("#grp-pop").hide();
	
	// top message remove...
	$(".spanmsg").remove();
	$(".spanmsg").remove();
	
	// remove border from user grid view...
	$(".col4").removeAttr('style');
	$(".userProfileImage").removeAttr('style');
	$(".img-align-center").removeAttr("style");
	
	// assign border to user grid view...
	if( $(elem).attr("disable-border")==1 )
	{
		$(elem).parent().parent().parent().parent().removeAttr("style");
	}
	else
	{
		$(elem).parent().parent().parent().parent().css("border","1px solid #6C518F");
	}
	
	if( $(elem).parents("div.short_profile_border").length > 0 )
	{
		$(elem).parents("div.short_profile_border").css("border", "1px solid #6C518F");
	}
	else if( $(elem).children("div.short_profile_border").length > 0 )
	{
		$(elem).children("div.short_profile_border").css("border", "1px solid #6C518F");
	}
	
	$(".quickview-outer").removeAttr("visibility");
	
	// Add html image.
	var imghtml="";
	imghtml+='<div class = "shortProfileData">';
	imghtml+='<img src="/'+PROJECT_NAME+'public/images/loading_large_purple.gif" />';
	imghtml+='</div>';
	
	
	// Hide other quickView profile.
	$(".quickview-outer").hide();
	
	// Empty div
	$(elem).next().children("div.quickview").empty();
	$(elem).next().children("div.quickview").append(imghtml);
	$(elem).next().fadeIn('slow');

	// get profile data on the basis of profile id...
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "links/get-tooltip",
        type: "POST",
        dataType: "json",
        data: { "user_id" : $(elem).attr("id") },
        timeout: 50000,
        success: function(jsonData) {
        	if( jsonData["user_removed"] != 1 )
        	{
        		getUserInformation(elem, jsonData, jsonParameters);
	        	$("#download-popup").hide();
        	}
        	else
        	{
        		$("div.quickview-outer").fadeOut();
        		showDialogMsg("Oops!", "No information avaliable about this user.", 5000, {
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
        		  	});
        	}
        },
        error: function(xhr, ajaxOptions, thrownError) {
        	alert("An error occured! We will fix this soon.");
		}
	 });
}

/**
 * function used to get user information
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function getUserInformation(elem,jsonData, jsonParameters){
	var obj = jsonParameters;
	/*if(obj.shortProfileView=="candidateShortProfile"){
		$("#candidateShortProfile_"+$(elem).attr("id")).html('');
	}
	else{*/
	$(elem).next().children("div.quickview").html('');
	//}
	$("[name=txtmsg]").val("");
	var uid=$(elem).attr("id");
	 
	if(jsonData.bookmark_status==0){
		var linkClass = "text-grey2-link";
		var bookMarktxt="Bookmark";
		var bookmarkprop='  onclick="bookmarkProfile(this)"';
		var iconbookmarkprop='  onclick="bookmarkProfile(this)" title="Bookmark profile"';
		var cssCls=' class="bookmark-icon" ';
	}
	else
	{
		var linkClass = "text-grey2-link2";
		var bookMarktxt="Bookmarked";
		var bookmarkprop='';
		var iconbookmarkprop='  onclick="bookmarkProfile(this)" rel="0"  title="Remove Bookmark" ';
		var cssCls=' class="bookmark-linked" ';
	}
	
	if(jsonData.jobseeker_display_flag == 2 )
	{
		var flag_img = "/"+PROJECT_NAME+"public/images/icon-flag.png";
	}
	else
		{
		
		if( jsonData.jobseeker_display_flag== 3 )
			{
				var flag_img = "/"+PROJECT_NAME+"public/images/icon-flag-on-hidden.png";
			}
		else
			{
				var flag_img = "/"+PROJECT_NAME+"public/images/icon-flag_faded.png";
			} 	
		
		}
//	var abusetxt_clickable = 1; // This flag is not required anymore as report abuse text will be clickable in both
								// cases : Report absue or Reported abuse.
	if(jsonData.Abused_report == 0)
	{
		var abusetxt ="Report Abuse";
		var abuseprop =' onclick="abuseReportProfile(this)"';
	}
	else
	{
		var abusetxt ="Reported as Abuse";
		var abuseprop ='onclick ="RemoveProfileFromReportAbuse(this)"';
		var abuseclass ='change_text';
//		abusetxt_clickable = 0;
	}
		var img = "/"+PROJECT_NAME+"public/images/arrow-purple2.png";
		var html="";
		html+='<div class="download">';
	   	html+='<a href="javascript:;"><img onclick="downloadProfile(this)" id="showDownload_'+jsonData.profile_id+'" alt="Download" uid="'+jsonData.profile_id+'" title="Download" src="/'+PROJECT_NAME+'public/images/icon-download2.png" width="29" height="27" /></a>';
		
	   	html+='<div class="download-pop" id="download-pop_'+jsonData.profile_id+'" style="display:none;">';
	 	html+='<form name="iprofile_'+jsonData.profile_id+'" id="iprofile_'+jsonData.profile_id+'" method="post" action="">';
	 	html+='<input type="hidden" name="notesOrignalValue_'+jsonData.profile_id+'" id="notesOrignalValue_'+jsonData.profile_id+'" value="'+jsonData.notesTitle+'">';
	 	html+='<input type="hidden" name="id" id="id" value="'+uid+'">';
	   	html+='<div class="tag-popup-outer">';
	   	html+='<div class="tag-popup-arrow2">';
	   	html+='<img src="/'+PROJECT_NAME+'public/images/arrow-popup.png" width="26" height="16" />';
	   	html+='</div>';
	   	html+='<div class="tag-popup">';
	   	html+='<div class="tag-popup-top2">';
	   	html+='<h4>Download Profile</h4>';
	   	html+='</div>';
	   	html+='<div class="tag-popup-mid">';
	   	
	   	html+='<div class="tag-popup-col1">';
		html+='<input name="all" id="all" type="checkbox" value="1" class="chk_all_'+jsonData.profile_id+'" />';
		html+='<div class="tag-popup-col1-text">All</div>';
		html+='</div>';
		if(jsonData.showSummary==1){
			html+='<div class="tag-popup-col1">';
			html+='<input name="summary" id="summary" type="checkbox" value="1" class="chk_options_'+jsonData.profile_id+'" />';
			html+='<div class="tag-popup-col1-text">Summary</div>';
			html+='</div>';			
		}
		if(jsonData.showExperience==1){
			html+='<div class="tag-popup-col1">';
			html+='<input name="exp" id="exp" type="checkbox" value="1" class="chk_options_'+jsonData.profile_id+'" />';
			html+='<div class="tag-popup-col1-text">Experience</div>';
			html+='</div>';			
		}
		if(jsonData.showEdulist==1){
			html+='<div class="tag-popup-col1">';
			html+='<input name="educ" id="educ" type="checkbox" value="1" class="chk_options_'+jsonData.profile_id+'" />';
			html+='<div class="tag-popup-col1-text">Education</div>';
			html+='</div>';			
		}
		if(jsonData.showProject==1){
			html+='<div class="tag-popup-col1">';
			html+='<input name="projects" id="projects" type="checkbox" value="1" class="chk_options_'+jsonData.profile_id+'" />';
			html+='<div class="tag-popup-col1-text">Projects</div>';
			html+='</div>';			
		}
		if(jsonData.showLanguage==1){
			html+='<div class="tag-popup-col1">';
			html+='<input name="language" id="language" type="checkbox" value="1" class="chk_options_'+jsonData.profile_id+'" />';
			html+='<div class="tag-popup-col1-text">Language</div>';
			html+='</div>';			
		}
		if(jsonData.showPublication==1){
			html+='<div class="tag-popup-col1">';
			html+='<input name="public" id="public" type="checkbox" value="1" class="chk_options_'+jsonData.profile_id+'" />';
			html+='<div class="tag-popup-col1-text">Publication</div>';
			html+='</div>';			
		}
		if(jsonData.showHonorsAndAwards==1){
			html+='<div class="tag-popup-col1">';
			html+='<input name="honors" id="honors" type="checkbox" value="1" class="chk_options_'+jsonData.profile_id+'" />';
			html+='<div class="tag-popup-col1-text">Honors & Awards</div>';
			html+='</div>';			
		}
		if(jsonData.showCertiList==1){
			html+='<div class="tag-popup-col1">';
			html+='<input name="certification" id="certification" type="checkbox" value="1" class="chk_options_'+jsonData.profile_id+'" />';
			html+='<div class="tag-popup-col1-text">Certification</div>';
			html+='</div>';			
		}
		if(jsonData.showVolunteer==1){
			html+='<div class="tag-popup-col1">';
			html+='<input name="volunteer" id="volunteer" type="checkbox" value="1" class="chk_options_'+jsonData.profile_id+'" />';
			html+='<div class="tag-popup-col1-text">Volunteer & Causes</div>';
			html+='</div>';
		}
		if(jsonData.showPersonal==1){
			html+='<div class="tag-popup-col1">';
		   	html+='<input name="personal" id="personal" type="checkbox" value="1" class="chk_options_'+jsonData.profile_id+'" />';
		   	html+='<div class="tag-popup-col1-text">Personal Information</div>';
		   	html+='</div>';
		}
		if(jsonData.showAdditionalInfo==1){
			html+='<div class="tag-popup-col1">';
		   	html+='<input name="hobby" id="hobby" type="checkbox" value="1" class="chk_options_'+jsonData.profile_id+'" />';
		   	html+='<div class="tag-popup-col1-text">Additional Information</div>';
		   	html+='</div>';
		}
		   	
	   	html+='</div>';
	   	html+='<div class="tag-popup-btn_'+jsonData.profile_id+'" style="display:none;">';
	   	html+='<input name="download" id="download" uid="'+jsonData.profile_id+'" type="button" value="Download" class="btn-blue mt5" onclick="downloadDetail(this)" alt="Download" title="Download" style="float:right;margin-top:5px;padding:0 5px;" />';
	   	html+='</div>';
	   	html+='</div>';
	   	html+='</div>';
	   	html+='</form>';
	   	html+='</div>';
	   	html+='</div>';
	   	/*if(obj.shortProfileView=="candidateShortProfile"){
	   		html+='<div class="quickview-top candidate-quickview-top_'+jsonData.profile_id+'">';
	   	}
	   	else{*/
	   	html+='<div class="quickview-top quickview-top_'+jsonData.profile_id+'">';
	   	// }
	   	html+='<div class="quickview-top-left">';
		html+='<img src="/'+PROJECT_NAME+'public/images/quick-profile.png" width="26" height="53" />';
		html+='</div>';
		html+='<div class="quickview-top-right">';
		html+='<div class="left">';
		html+='<div style="width:90px;height:90px;display:table-cell;vertical-align:middle;text-align:center;">';
		html+='<img src="'+jsonData.profile_image+'" style="max-width:90px;max-height:90px;" />';
		html+='</div>';
		html+='<h5>';
		html+='<a class="text-purple-link padding0" href="/'+PROJECT_NAME+'profile/iprofile/id/'+jsonData.profile_id+'">View Full Profile</a>';
		html+='</h5>';
		// notes start....
		// if login user and profile user both are same then note section will not display...
		if(jsonData.login_user_id!=jsonData.profile_id)
		{
			html+='<div class="notesPop">';
			html+='<p>';
			html+='<img src="/'+PROJECT_NAME+'public/images/icon-notes.png" width="18" height="18" align="absmiddle" />';
			html+='<a class="text-purple notes_icon" style="color:#B084E9;text-decoration:none;display:inline;" href="javascript:;" id="'+jsonData.profile_id+'" onclick="getNotes(this);">Notes</a>';
			html+='<!-- Notes Popup Starts -->';
			html+='<div class="notes-popup-outer closeNotesPopup" id="displayNotes_'+jsonData.profile_id+'" style="display:none;">';
			html+='<div class="notes-popup-top" style="padding:7px 0 0 61px ">';
			html+='<img src="/'+PROJECT_NAME+'public/images/arrow-popup.png" width="26" height="16" />';
			html+='</div>';
			html+='<div class="notes-popup-bot notes-popup-bot_'+jsonData.profile_id+'" style="display:none;">';
			html+='<h4>ADD NOTE</h4>';
			html+='<textarea name="note_'+jsonData.profile_id+'" id="note_'+jsonData.profile_id+'" cols="" rows="8"></textarea>';
			html+='<div class="common-div">';
			html+='<div class="fr">';
			html+='<a class="text-purple-link" href="javascript:;" id="'+jsonData.profile_id+'" name="saveNote_'+jsonData.profile_id+'" onclick="saveNote(this)">Save Changes</a>';
			html+='</div>';
			html+='</div>';
			html+='</div>';
			html+='<div class="notes-popup-bot-second notes-popup-bot-second_'+jsonData.profile_id+'" style="background:white;height:270px;width:411px;border:solid 2px;display:none;float:left;">';
			html+='</div>';
			html+='</div>';
			html+='<!-- Notes Popup Ends -->';
			html+='</p>';
			html+='</div>';
		}
		html+='</div>';
		html+='<div class="right">';
		 var uFname = jsonData.full_name;
		 if(parseInt(uFname.length)>30){
			 uFname = uFname.substr(0,30)+"..";
		 }
		html+='<h3 class="links-profile-view-font-change" title='+jsonData.full_name+' style="color:#6C518F;font-weight:bold;">'+uFname+'</h3>';
		html+='<div class="toplinks">';
		if( jsonData.jobseeker_display_flag == 2 )
		{
			html+='<div class="col2" style="margin:0 0px 0 0 !important;">';
			html+='<span class="iconWidth">';
			html+='<img src='+flag_img+' width="15" height="16" align="absmiddle" id="joobseeker_'+jsonData.profile_id+'" alt="job seeker flag" title= " job seeker flag " />';	
			html+='</span>';
			html+='<span class="textWidth2">';
			html+='<label class="text-grey2-link"  href="javascript:;" id="joobseeker_'+jsonData.profile_id+'" style="width:100%;float:none;">Job Seeker</label>';
			html+='</span>';
			html+='</div>';
		}
		html+='<div class="col2" style="margin:0 0px 0 0 !important;">';
		html+='<span class="iconWidth">';
		html+='<img src="/'+PROJECT_NAME+'public/images/icon-connection.png" width="16" height="15" align="absmiddle" />';
		html+='</span>';
		html+='<span class="textWidth2">';
		html+='<a target="_blank" class="text-grey2-link" href="/'+PROJECT_NAME+'profile/iprofile/id/'+jsonData.profile_id+'#links">View Their Links</a>';
		html+='</span>';
		html+='</div>';
		if(jsonData.linkStatus['friend_type']==3 && obj.showEditGroupsOption!=1){
			html+='<div class="col2" style="margin:0 0px 0 0 !important;">';
			html+='<span class="iconWidth">';
			html+='<img src="/'+PROJECT_NAME+'public/images/icon-pencil3.png" width="17" height="17" align="absmiddle" />';
			html+='</span>';
			html+='<span class="textWidth2">';
			html+='<a href="javascript:;" class="text-grey2-link editTagPopup" id="'+$(elem).attr("id")+'" name="tag_'+$(elem).attr("id")+'" onclick="gettags(this);">Tags</a>';
			html+='</span>';
			// tag popup start here....
			html+='<div class="">';
			html+='<div id="tag-popup-outertags_'+$(elem).attr("id")+'" class="tag-popup-outer closeTagsPopup closeTagsPopups_'+$(elem).attr("id")+'" style="display:none;top:32px;left:-130px;">';
			html+='<div class="tag-popup-arrow" style="margin:-5px 0 0 138px;">';
			html+='<img src="/'+PROJECT_NAME+'public/images/arrow-popup.png" width="26" height="16" />';
			
			html+='</div>';
			html+='<div class="tag-popup" id="tag-popup_'+jsonData.profile_id+'">';
			html+='<img src="/'+PROJECT_NAME+'public/images/notok-icon-grey.png"alt="Close" title="Close"  align="absmiddle" style="float: right; margin: -20px -19px; width: 16px; height: 16px;" onclick="getgroups(this);"/>';

			html+='<div id="loading_'+jsonData.profile_id+'" style="display:table-cell;width:170px;height:195px;text-align:center;vertical-align:middle;">';
			html+='<img src="/'+PROJECT_NAME+'public/images/loading_medium_purple.gif" />';
			html+='</div>';
			html+='</div>';
			html+='</div>';
			html+='</div>';
			// tag popup end here....			
			html+='</div>';
		}
		if(obj.showEditGroupsOption==1){
			html+='<div class="col2" style="padding:0 !important;">';
			html+='<span class="iconWidth">';
			html+='<img src="/'+PROJECT_NAME+'public/images/icon-pencil3.png" width="17" height="17" align="absmiddle" />';
			html+='</span>';
			html+='<span class="textWidth2">';
			html+='<a href="javascript:;" class="text-grey2-link shortProfileEditGrp" id="'+$(elem).attr("id")+'" onclick="getgroups(this);" name="shortProfileGrp_'+$(elem).attr("id")+'">Edit Groups</a>';
			html+='</span>';
			// group popup start here....			
			html+='<div class="">';
			html+='<div id="tag-popup-outertags_'+$(elem).attr("id")+'" class="tag-popup-outer closeTagsPopup closeGroupsPopups_'+$(elem).attr("id")+'" style="display:none;top:15px;left:-130px;">';
			html+='<div class="tag-popup-arrow">';
			html+='<img src="/'+PROJECT_NAME+'public/images/arrow-popup.png" width="26" height="16" />';
			
			html+='</div>';
			html+='<div class="tag-popup" id="tag-popup_'+jsonData.profile_id+'">';
			html+='<img src="/'+PROJECT_NAME+'public/images/notok-icon-grey.png"  alt="Close" title="Close"  align="absmiddle" style="float: right; margin: -20px -19px; width: 16px; height: 16px;" onclick="getgroups(this);"/>';

			html+='<div id="loading_'+jsonData.profile_id+'" style="display:table-cell;width:170px;height:195px;text-align:center;vertical-align:middle;">';
			html+='<img src="/'+PROJECT_NAME+'public/images/loading_medium_purple.gif" />';
			html+='</div>';
			html+='</div>';
			html+='</div>';
			// group popup end here....
			html+='</div>';
		}
		
		html+='</div>';
		html+='<div class="botlinks bookmarks-withline">';
		if(jsonData.profile_phone!= null)
		{
			html+='<div class="col2">';
			html+='<span class="iconWidth">';
			html+='<img src="/'+PROJECT_NAME+'public/images/icon-telephone.png" width="14" height="14" align="absmiddle" />';
			html+='</span>';
			html+='<span class="textWidth3">';
			html+=jsonData.profile_phone;
			html+='</span>';
			html+='</div>';
		}
		// star icon..
		if(jsonData.login_user_id==jsonData.profile_id)
		{
			cssCls = "";
		}
		html+='<div><a name="bookmarkicon_'+jsonData.profile_id+'" id="'+jsonData.profile_id+'" href="javascript:;" '+cssCls+' '+iconbookmarkprop+'></a></div>';
		
		html+='<div class="col2">';
		html+='<span class="iconWidth">';
		html+='<img src="/'+PROJECT_NAME+'public/images/mail.png" width="16" height="13" align="absmiddle" />';
		html+='</span>';
		html+='<span class="textWidth3">';
		html+='<a class="text-grey2-link" title = "'+jsonData.profile_email+'" href="mailto:'+jsonData.profile_email+'">'+showCroppedText( jsonData.profile_email, 40 )+'</a>';
		html+='</span>';
		html+='</div>';
		html+='<div class="col2">';
		html+='<span class="iconWidth">';
		html+='<img src="/'+PROJECT_NAME+'public/images/icon-profile.png" width="15" height="16" align="absmiddle" />';
		html+='</span>';
		html+='<span class="textWidth3">';
		var profile_url = PROJECT_URL+PROJECT_NAME+'profile/iprofile/id/'+jsonData.profile_id;
		html+='<a class="text-grey2-link" title="'+profile_url+'" href="/'+PROJECT_NAME+'profile/iprofile/id/'+jsonData.profile_id+'">'+showCroppedText(profile_url, 40)+'</a>';
		html+='</span>';
		html+='</div>';
		html+='</div>';
		html+='</div>';
		html+='</div>';
		html+='</div>';
		html+='</div>';
		
		var msgTxtboxStyle = "display:none;";
		if(jsonData.linkStatus['friend_type']==3){
			msgTxtboxStyle = "";
		}
		// send message section start...
		// if login user and profile user both are same then SEND MESSAGE section will not display... 3 is for friends..
		if(jsonData.login_user_id!=jsonData.profile_id && jsonData.linkStatus["friend_type"]==3)
		{
		   	html+='<div style="'+msgTxtboxStyle+'" class="quickview-mid quickview-mid_'+jsonData.profile_id+'">';
			html+='<div class="quickview-mid-left">';
			html+='<img src="/'+PROJECT_NAME+'public/images/quick-mail.png" width="26" height="53" />';
			html+='</div>';
			html+='<div class="quickview-mid-right" style="width:478px !important;">';
			html+='<h3 class="links-profile-view-font-change">Send A Message</h3>';
			html+='<p>';
			html+='<form name="sendmsg" class="sendmsg" id="'+jsonData.profile_id+'" method="post" action="">';
			html+='<div id="win-xp2">';
			html+='<input type="hidden" name="msg_type_'+jsonData.profile_id+'" id="msg_type_'+jsonData.profile_id+'" value="Email message" />';
			html+='</div>';
			html+='</p>';
			html+='<p>';
			html+='<textarea name="txtmsg" id="txtmsg_'+jsonData.profile_id+'" cols="" rows="7" style="border:1px solid #E5E5E5;width:98%"></textarea>';
			html+='</p>';
			html+='<p style="width: 110px; float: right; text-align: right;">';
			html+='<input type="button" value="Send" class="btn-blue links-profile-view-save-button" title="Send" alt="Send" name="sendMsg_'+jsonData.profile_id+'" id="'+jsonData.profile_id+'" onclick="sendMsg(this)">';
			html+='</p>';
			html+='</form>';
			html+='</div>';
			html+='</div>';
		}
		
		// MANAGE FOLLOWERS section start...
		// if login user and profile user both are same then MANAGE FOLLOWERS section will not display...
		if(jsonData.login_user_id!=jsonData.profile_id)
		{
		   	html+='<div class="quickview-bot quickview-bot_'+jsonData.profile_id+'">';
		   	html+='<div class="quickview-bot-left">';
			html+='<img src="/'+PROJECT_NAME+'public/images/quick-links.png" width="26" height="54" />';
			html+='</div>';
			html+='<div class="quickview-bot-right">';
			html+='<h3 class="links-profile-view-font-change">Manage followers</h3>';
			// if(obj.showBookmark=="true"){
				html+='<div class="col2">';
				html+='<span class="iconWidth">';
				html+='<img src="/'+PROJECT_NAME+'public/images/icon-star-purple.png" width="16" height="16" align="absmiddle" />';
				html+='<input type="hidden" name="bookmark-status_'+jsonData.profile_id+'" id="bookmark-status_'+jsonData.profile_id+'" value="'+jsonData.bookmark_status+'" />';
				html+='</span>';
				html+='<span class="textWidth">';
				html+='<a class="'+linkClass+'" name="bookmark_'+jsonData.profile_id+'" id="'+jsonData.profile_id+'" href="javascript:;" '+bookmarkprop+'>'+bookMarktxt+'</a>';
				html+='</span>';
				html+='</div>';
			//}
			// if(obj.showReportAbuse=="true"){
				html+='<div class="col2">';
				html+='<span class="iconWidth">';
				html+='<img src="/'+PROJECT_NAME+'public/images/icon-abuse-purple.png" width="16" height="16" align="absmiddle" />';
				html+='</span>';
				html+='<span class="textWidth">';
				
				//In case when profile is not reported abuse.
//				if(abusetxt_clickable)
//				{
					html+='<a name="abuse_'+jsonData.profile_id+'" class="text-grey2-link '+abuseclass+'" href="javascript:;" id="'+jsonData.profile_id+'" '+abuseprop+'>'+abusetxt+'</a>';
//				}
				// When profile is reported abuse.
//				else
//				{
//					html+='<a name="abuse_'+jsonData.profile_id+'" class="text-grey2" href="javascript:;" id="'+jsonData.profile_id+'" '+abuseprop+'>'+abusetxt+'</a>';
//				}
				html+='</span>';
				html+='</div>';
			// }
			if(jsonData.linkStatus['friend_type']==0){
				html+='<div class="col2">';
				html+='<span class="iconWidth" id="statusIcon-'+jsonData.profile_id+'">';
				html+='<img src="/'+PROJECT_NAME+'public/images/small-invitation-request-icon.png" align="absmiddle" />';
				html+='</span>';
				html+='<span class="textWidth" id="statusTitle-'+jsonData.profile_id+'">';
				html+='<a id="'+jsonData.profile_id+'" class="text-grey2-link cursor-style invite_'+jsonData.profile_id+'" href="javascript:;" onclick="inviteToLink(this)">Invite to link</a>';
				html+='</span>';
				html+='</div>';
			}
			else if(jsonData.linkStatus['friend_type']==2){
				html+='<div class="col2">';
				html+='<span class="iconWidth" id="statusIcon-'+jsonData.profile_id+'">';
				html+='<img src="/'+PROJECT_NAME+'public/images/small-accept-request-icon.png" align="absmiddle" />';
				html+='</span>';
				html+='<span class="textWidth" id="statusTitle-'+jsonData.profile_id+'">';
				html+='<a id="'+jsonData.profile_id+'" rel="'+jsonData.linkStatus["link_id"]+'" title="Accept Request" class="text-grey2-link" href="javascript:;" onclick="acceptRequestFromListing(this)">Accept</a>';
				html+='</span>';
				html+='</div>';
				
				html+='<div class="col2" id="cancel-request-icon-text-'+jsonData.profile_id+'">';
				html+='<span class="iconWidth" id="statusIcon-'+jsonData.profile_id+'">';
				html+='<img src="/'+PROJECT_NAME+'public/images/small-decline-request-icon.png" align="absmiddle" />';
				html+='</span>';
				html+='<span class="textWidth" id="statusTitle-'+jsonData.profile_id+'">';
				html+='<a id="'+jsonData.profile_id+'" rel="'+jsonData.linkStatus["link_id"]+'" class="text-grey2-link" title="Decline Request" href="javascript:;" onclick="cancelRequestFromListing(this)">Decline</a>';
				html+='</span>';
				html+='</div>';
			}
			else if(jsonData.linkStatus['friend_type']==3){
				html+='<div class="col2">';
				html+='<span class="iconWidth" id="statusIcon-'+jsonData.profile_id+'">';
				html+='<img src="/'+PROJECT_NAME+'public/images/small-unlink-icon.png" align="absmiddle" />';
				html+='</span>';
				html+='<span class="textWidth" id="statusTitle-'+jsonData.profile_id+'">';
				html+='<a class="text-grey2-link" id="delete_'+jsonData.link_id+'" href="javascript:;" onclick="unLink('+jsonData.link_id+','+jsonData.profile_id+')">Unlink</a>';
				html+='</span>';
				html+='</div>';
			}
			else {
				html+='<div class="col2">';
				html+='<span class="iconWidth" id="statusIcon-'+jsonData.profile_id+'">';
				html+='<img src="/'+PROJECT_NAME+'public/images/small-cancel-request-icon.png" align="absmiddle" />';
				html+='</span>';
				html+='<span class="textWidth" id="statusTitle-'+jsonData.profile_id+'">';
				html+='<a class="text-grey2-link" id="delete_'+jsonData.link_id+'" href="javascript:;" onclick="unLink('+jsonData.link_id+','+jsonData.profile_id+')">Cancel Request</a>';
				html+='</span>';
				html+='</div>';
			}
			if(obj.showRemoveFromGroup=="true"){
				html+='<div class="col2">';
				html+='<span class="iconWidth">';
				html+='<img src="/'+PROJECT_NAME+'public/images/icon-trash-hover.png" width="14" height="16" align="absmiddle" />';
				html+='</span>';
				html+='<span class="textWidth">';
				html+='<a class="text-grey2-link" id="delete_'+jsonData.profile_id+'" href="javascript:;" onclick="deleteBookmarkedProfileGroup('+jsonData.profile_id+')">Remove from Group</a>';
				html+='</span>';
				html+='</div>';
			}
			if(obj.showRemoveFromTag=="true"){
				html+='<div class="col2">';
				html+='<span class="iconWidth">';
				html+='<img src="/'+PROJECT_NAME+'public/images/icon-trash-hover.png" width="14" height="16" align="absmiddle" />';
				html+='</span>';
				html+='<span class="textWidth">';
				html+='<a class="text-grey2-link" id="delete_'+jsonData.profile_id+'" href="javascript:;" onclick="removeTagLink('+jsonData.profile_id+')">Remove from Tag</a>';
				html+='</span>';
				html+='</div>';
			}
			if(obj.showDeleteApplicant=="true"){
				html+='<div class="col2">';
				html+='<span class="iconWidth">';
				html+='<img src="/'+PROJECT_NAME+'public/images/icon-trash-hover.png" width="14" height="16" align="absmiddle" />';
				html+='</span>';
				html+='<span class="textWidth">';
				html+='<a class="text-grey2-link" id="delete_'+jsonData.profile_id+'" href="javascript:;" onclick="deleteApplicant('+obj["jobID"]+','+jsonData.profile_id+')">Delete</a>';
				html+='</span>';
				html+='</div>';
			}
			if(obj.showShortListCandidateOption=="true" && jsonData.showShortlistedType==1){
				html+='<div class="col2">';
				html+='<span class="iconWidth">';
				html+='<img src="/'+PROJECT_NAME+'public/images/shortlisted.png" width="14" height="16" align="absmiddle" />';
				html+='</span>';
				html+='<span class="textWidth">';
				html+='<a id="moveShortListed_'+jsonData.profile_id+'" href="javascript:;" style="cursor:default;color:#48545E;text-decoration:none;" >Candidate Shortlisted</a>';
				html+='</span>';
				html+='</div>';
			}
			else if(obj.showShortListCandidateOption=="true" && jsonData.showShortlistedType==0){
				html+='<div class="col2">';
				html+='<span class="iconWidth">';
				html+='<img src="/'+PROJECT_NAME+'public/images/shortlisted.png" width="14" height="16" align="absmiddle" />';
				html+='</span>';
				html+='<span class="textWidth">';
				html+='<a class="text-grey2-link" id="moveShortListed_'+jsonData.profile_id+'" href="javascript:;" onclick="moveToShortList('+obj["jobID"]+','+jsonData.profile_id+')">Shortlist Candidate</a>';
				html+='</span>';
				html+='</div>';
			}
			if(obj.showRemoveShortListCandidateOption=="true"){
				html+='<div class="col2">';
				html+='<span class="iconWidth">';
				html+='<img src="/'+PROJECT_NAME+'public/images/shortlisted.png" width="14" height="16" align="absmiddle" />';
				html+='</span>';
				html+='<span class="textWidth">';
				html+='<a class="text-grey2-link" id="removeShortListed_'+jsonData.profile_id+'" href="javascript:;" onclick="removeFromShortList('+obj["jobID"]+','+jsonData.profile_id+')">Remove from Shortlist</a>';
				html+='</span>';
				html+='</div>';
			}
			if( jsonData.isBlocked )
			{	
				html+='<div class="col2">';
				html+='<span class="iconWidth">';
				html+='<img src="/'+PROJECT_NAME+'public/images/block_user.png" width="16" height="16" align="absmiddle" />';
				html+='</span>';
				html+='<span class="textWidth">';
				html+='<span>Blocked</span>';
				html+='</span>';
				html+='</div>';
			}
			else
			{
				html+='<div class="col2">';
				html+='<span class="iconWidth">';
				html+='<img src="/'+PROJECT_NAME+'public/images/block_user.png" width="16" height="16" align="absmiddle" />';
				html+='</span>';
				html+='<span class="textWidth">';
				html+='<a class="text-grey2-link" id="block_user_'+jsonData.profile_id+'" class = "block_user" href="javascript:;" onclick="blockUser('+jsonData.profile_id+')">Block</a>';
				html+='</span>';
				html+='</div>';
			}	
			
			html+='</div>';
			html+='</div>';
		}
			html = $(html);
			html.hide();
			
			$(elem).next().children("div.quickview").append(html);
			
			html.fadeIn();

		$("#closeTagPopups_"+jsonData.profile_id).click(function(){
			$(".closeTagsPopups_"+jsonData.profile_id).fadeToggle('slow');
		});	
		$("#closeGroupPopups_"+jsonData.profile_id).click(function(){
			$(".closeGroupsPopups_"+jsonData.profile_id).fadeToggle('slow');
		});	
		$(".closeDownloadPopup").click(function(){
			$(".download-pop").hide();
		});	
		CKEDITOR.replace( 'note_'+jsonData.profile_id, 
		{
			uiColor: '#6C518F',
			toolbar: [
						{ name: 'basicstyles', items : [ 'Bold','Italic','TextColor',"BGColor" ] },
						{ name: 'paragraph', items : [ 'NumberedList','BulletedList' ] },
					],
			removePlugins : 'elementspath'
		});
		CKEDITOR.addCss(".cke_editable{background-color: #F2F2F2}");
		 CKEDITOR.instances["note_"+jsonData.profile_id].setData(jsonData.notesTitle);
		 $('.chk_all_'+jsonData.profile_id).change(function() {
			 addDownloadProfileEvents(jsonData.profile_id);
			 addCheckboxCheckedEvents(jsonData.profile_id);
		 });
		 $('.chk_options_'+jsonData.profile_id).change(function() {
			 addCheckboxCheckedEvents(jsonData.profile_id);
		 });
}
function addCheckboxCheckedEvents(id){
	var nEvents = $(".chk_options_"+id+":checked").length;
	if(nEvents ==2) {
		$(".chk_all_"+id).prop('checked', true);
	}
	if(nEvents>=1){
		$(".tag-popup-btn_"+id).css("display","block");
	}
	else{
		$(".tag-popup-btn_"+id).css("display","none");
		$(".chk_all_"+id).removeAttr('checked');
	}
}
function addDownloadProfileEvents(id){
	var attr = $(".chk_all_"+id).prop('checked', true);

	if (typeof attr !== 'undefined' && attr !== false) {

	$(".chk_options_"+id).prop('checked', true);
	}
	else{
		$(".chk_options_"+id).removeAttr('checked');	
	}
}
function closeNotesPopup(id){
	CKEDITOR.instances["note_"+id].setData($("#notesOrignalValue_"+id).val());
	$('.closeNotesPopup').hide();
}
/*************** bookmarks functions *******************/
/**
 * function used to remove profile from any group
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function removeBookmarkGroup(){
	var grpID=$("#grpID").val();
	var str = [];
	// var str=$("form#bookmark-form").serializeArray();
	$("input[name='profile_chk[]']:checked").each(function(i){
		str[i] = $(this).val();
	});
	if(str.length>0){
		var ids = addLoadingImage($("#remBookmark"), "after");
		jQuery.ajax({
			url: "/" + PROJECT_NAME + "bookmarks/remove-bookmark-group",
			type: "POST",
			dataType: "json",
			data: { "bookmarks" : str,"grp_id":grpID },
			timeout: 50000,
			success: function(jsonData) {
				$("span#"+ids).remove();
				$(".manage-pop").fadeOut("slow");
				$(".short-view-profile-popup").hide();
				for(var i=0;i<str.length;i++){
					// $("#grid_"+str[i]).fadeOut(1000,function() {
						$("#grid_"+str[i]).remove();					        		
					// });
				}
	        	if (!$(".col4")[0])
	        	{
	        		__removeOverlay();
	        		$(".text-grey3").remove();
	        		$(".bookmark-search-right").remove();
	        		$(".linkprofile-outer").append('<div class="emptyRecordOuter"><div class="emptyRecordInner text-grey3"><p>No result found!</p></div></div>');
	        	} 	
	        	
				$(".alert-box").remove();
				$(".alert-box1").remove();
				$(".alert-box2").remove();
				showDefaultMsg( "Removed from Group successfully.", 1 );
			},
			error: function(xhr, ajaxOptions, thrownError) {
				alert("Server Error.");
			}
		});
	}
	else{
		$(".manage-pop-outer").fadeToggle();
		$( "#dialog_confirm" ).dialog({
			modal: true,
			width: 306,
			show: {
				effect: "fade"
			},
			hide: {
				effect: "fade"
			},
			buttons: {
				'ok': function() {
					$( this ).dialog( "close" );
				}
			}
		});
	}
}
/**
 * function used to get send message
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function sendMsg(event){
	
	$("#span-sendmsg").remove();
	$("[name=sendMsg_"+event.id+"]").attr("disabled","disabled");
	var ids = addLoadingImage($("[name=sendMsg_"+event.id+"]"), "before", 'loading_small_purple.gif', 0, 33, 'fl');
	var txt=$("#txtmsg_"+event.id).val();
	var msg_type=$("#msg_type_"+event.id).val();
	var uid=event.id;
	if(txt!=""){
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "links/send-message",
	        type: "POST",
	        dataType: "json",
	        data: { "user_id" : uid, "msg" : txt,"msg_type" :msg_type },
	        timeout: 50000,
	        success: function(jsonData) {
	        	$("span#"+ids).remove();
	        	if(jsonData.msg=="success"){
	        		$("[name=txtmsg]").val("");
	        		$("[name=sendMsg_"+event.id+"]").removeAttr('disabled');
	        	//	$("[name=sendMsg_"+event.id+"]").before('<span class="spanmsg" id="span-sendmsg">Congrats! message sent successfully..</span>');
	        		$(".alert-box").remove();
	        		$(".alert-box1").remove();
	        		showDefaultMsg( "Message sent.", 1 );
	        	}
	        	else{
	        		$("[name=sendMsg_"+event.id+"]").removeAttr('disabled');
	        		$("[name=sendMsg_"+event.id+"]").before('<span class="spanmsg" id="span-sendmsg" style="color:red;">Due to server problem we can not send message.</span>');
	        	}
	        },
	        error: function(xhr, ajaxOptions, thrownError) {
	        	alert("Server Error.");
			}
		 });
	}
	else{
		$("[name=sendMsg_"+event.id+"]").removeAttr('disabled');
		$("span#"+ids).remove();
		$(".alert-box1").remove();
		$(".alert-box").remove();
		showDefaultMsg( "Please add message text.", 2 );
	}
}
/**
 * function used to delete recently viewed users
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function deleteBookmarkedProfile(uid){
	var ids = addLoadingImage($("#delete_"+uid), "after");
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "bookmarks/delete-bookmarked-profile",
        type: "POST",
        dataType: "json",
        data: { "user_id" : uid },
        timeout: 50000,
        success: function(jsonData) {
        	$(".alert-box").remove();
    		$(".alert-box2").remove();
    		$(".alert-box1").remove();
    		showDefaultMsg( "Bookmarked profile removed successfully.", 1 );
        	$("span#"+ids).remove();
        	$("#view_"+uid).remove();
        	$("#arrow-first").remove();
        	$("#col1_"+uid).remove();
        	if (!$(".bookmarkLinks")[0]){
        		$(".text-grey3").remove();
        		$(".bookmark-search-right").remove();
        		$(".linkprofile-outer").append('<div class="emptyRecordOuter"><div class="emptyRecordInner text-grey3"><p>No result found!</p></div></div>');
        	} 	
        },
        error: function(xhr, ajaxOptions, thrownError) {
        	alert("Server Error.");
		}
	 });
	
}
/**
 * function used to delete bookmarked profile from groups
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function deleteBookmarkedProfileGroup(uid){
	var grpID=$("#grpID").val();
	var ids = addLoadingImage($("#delete_"+uid), "after");
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "bookmarks/delete-bookmarked-profile-group",
        type: "POST",
        dataType: "json",
        data: { "user_id" : uid,"grp_id":grpID },
        timeout: 50000,
        success: function(jsonData) {
        	
        	$("span#"+ids).remove();
        	$("#view_"+uid).remove();
        	$("#arrow-first").remove();
        	$("#col1_"+uid).remove();
        	if (!$(".bookmarkLinks")[0]){
        		$(".text-grey3").remove();
        		$(".bookmark-search-right").remove();
        		$(".linkprofile-outer").append('<div class="emptyRecordOuter"><div class="emptyRecordInner text-grey3"><p>No result found!</p></div></div>');
        	} 	
        	$(".alert-box").remove();
    		$(".alert-box1").remove();
    		$(".alert-box2").remove();
    		showDefaultMsg( "Removed from Group successfully.", 1 );
        },
        error: function(xhr, ajaxOptions, thrownError) {
        	alert("Server Error.");
		}
	 });
	
}
/**
 * function used to delete bookmarked users
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function deleteBookmarkedProfile2(uid){
	var ids = addLoadingImage($("#delete_"+uid), "after");
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "bookmarks/delete-bookmarked-profile",
        type: "POST",
        dataType: "json",
        data: { "user_id" : uid },
        timeout: 50000,
        success: function(jsonData) {
        	$(".alert-box").remove();
    		$(".alert-box2").remove();
    		$(".alert-box1").remove();
    		showDefaultMsg( "Bookmarked profile removed successfully.", 1 );
        	$("span#"+ids).remove();
        	$("#view_"+uid).remove();
        	$("#arrow-first").remove();
        	$("#col1_"+uid).remove();
        	if (!$(".bookmarkLinks")[0]){
        		$(".text-grey3").remove();
        		$(".bookmark-search-right").remove();
        		$(".linkprofile-outer").append('<div class="emptyRecordOuter"><div class="emptyRecordInner text-grey3"><p>No result found!</p></div></div>');
        	} 	
        },
        error: function(xhr, ajaxOptions, thrownError) {
        	alert("Server Error.");
		}
	 });
	
}
/**
 * function used to get user created tags list
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function getgroups(event){
	var uid=event.id;
	// $('span.spanmsg').remove();
	var attr = $(event).attr('showShortProfileTags');
	if (typeof attr !== 'undefined' && attr !== false) {
		// ...... not going for server request...
		$("#tag-popup-outertags_"+uid).fadeToggle('slow');
	}
	else{
		// remove attribute onclick...
    	$("[name="+event.name+"]").removeAttr("onclick");
		// ..... going for server request...
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "bookmarks/get-edit-groups",
	        type: "POST",
	        dataType: "json",
	        data: { "user_id" : uid },
	        timeout: 50000,
	        beforeSend: function(){
	        	// embed loading image file..
	        	$("#tag-popup_"+uid).empty();
	    		var loadingHtml = '<div id="loading" style="display:table-cell;width:170px;height:195px;text-align:center;vertical-align:middle;padding-left:0px;margin-top:89px;">';
	    		loadingHtml += '<img src="'+IMAGE_PATH+'/loading_medium_purple.gif">';
	    		loadingHtml += '</div>';
	    		$("#tag-popup_"+uid).append(loadingHtml);
	    		$("#tag-popup-outertags_"+uid).fadeToggle('slow');
	    	},
	        success: function(jsonData) {
	        	if(jsonData.length>0)
		        {
		        	$("#loading_"+uid).css("display","none");
		        	var html='';
			        	html+='<div class="tag-popup-top">';
			        	html+='<input maxlength="124" style="width:95%;" name="groupTxt_'+uid+'" id="groupTxt_'+uid+'" type="text" />';
			        	html+='<input name="groupBtn_'+uid+'" id="'+uid+'" type="button" value="Add Group" class="btn-blue mt5" alt="Add Group" title="Add Group" onclick="addGroup(this)" />';
			        	html+='</div>';
			        	html+='<form class="popupsTaglist" name="formGroup_'+uid+'" id="formGroup_'+uid+'" method="post" action="">';
			        	html+='<div class="tag-popup-mid">';
			        	var j=0;
			        	var chk="";
			        	for(var i=0;i<jsonData.length;i++){
			        		if(jsonData[i]["is_checked"]==1){
			        			var chk="checked";
			        		}else{
			        			var chk="";
			        		}
			        		
				        	html+='<div class="tag-popup-col1">';
				        	html+='<input name="groupChk[]" id="groupChk[]" type="checkbox" value="'+jsonData[i]["group_id"]+'" '+chk+' />';
				        
				        	var tTitle = jsonData[i]["group_title"];
				        	if(tTitle.length>16){
				        		tTitle=tTitle.substr(0,16)+"...";
				        	}
				        	
				        	html+='<div class="tag-popup-col1-text">'+tTitle+'</div>';
				        	html+='</div>';	
				        	j++;
			        	}
			        	
			        	html+='</div>';
			        	html+='<div class="tag-popup-btn"><input name="saveBtn_'+uid+'" onclick="assignGroups(this)" id="'+uid+'" type="button" value="Save" class=" btn-blue mt5" alt="Save" title="Save" />';
			        	html+='</form>';
			        	html+='</div>';
		        	$("[name="+event.name+"]").removeAttr('disabled');
		        	$("#tag-popup_"+uid).empty();
		        	$("#tag-popup_"+uid).append(html);
		        	$(".grouplist").css("display","block");
		        	$("#tag-popup_"+uid).css("height","auto");
	        	}
	        	else
	        	{
	        		$(".tags-menu-listing-addnewTag").css("height","54pspan_33x");
	        		var html='';
		        	html+='<div class="tag-popup-top">';
		        	html+='<input style="width:95%;" maxlength="124" name="groupTxt_'+uid+'" id="groupTxt_'+uid+'" type="text" />';
		        	html+='<input name="groupBtn_'+uid+'" id="'+uid+'" type="button" value="Add Group" class="btn-blue mt5" alt="Add Group" title="Add Group" onclick="addGroup(this)" />';
		        	html+='</div>';
		        	html+='<form class="popupsTaglist" name="formGroup_'+uid+'" id="formGroup_'+uid+'" method="post" action="" style="display:none;">';
		        	html+='<div class="tag-popup-mid">';
		        	
		        	html+='</div>';
		        	html+='<div class="tag-popup-btn"><input name="saveBtn_'+uid+'" onclick="assignGroups(this)" id="'+uid+'" type="button" value="Save" class=" btn-blue mt5" alt="Save" title="Save" />';
		        	html+='</form>';
		        	html+='</div>';
		        	
		        	$("[name="+event.name+"]").removeAttr('disabled');
		        	$("#tag-popup_"+uid).empty();
		        	$("#tag-popup_"+uid).append(html);
		        	$("#tag-popup_"+uid).css("height","auto");
		        }
	        	// add attribute onclick...
	        	$("[name="+event.name+"]").attr("onclick","getgroups(this);");
	        	$("[name=shortProfileGrp_"+uid+"]").attr("showShortProfileTags","yes");
	        	
	        },
	        error: function(xhr, ajaxOptions, thrownError) {
	        	showDefaultMsg( "Unable to add group.Please try again.", 2 );   
			}
		 });
		
	}
}
/**
 * function used to add new group
 * Author: Shaina Gandhi, Sunny Patial
 * Date: 14,Aug 2013
 * version: 1.0
 */
function addGroup(event){
	$('#span-tag').remove();
	var ids = addLoadingImage($("[name=groupBtn_"+event.id+"]"), "before");
	var title=$("#groupTxt_"+event.id).val();
	if(title!=""){
	$("[name=groupBtn_"+event.id+"]").attr('disabled','disabled');
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "bookmarks/add-new-group",
        type: "POST",
        dataType: "json",
        data: { "title" : title },
        timeout: 50000,
        success: function(jsonData) {
        		var uID = $("#currentLoginUserID").val();
	        	$("span#"+ids).remove();
	        	$("[name=groupBtn_"+event.id+"]").removeAttr('disabled');
	        	$("#groupTxt_"+event.id).val("");
	        	if(jsonData=="exist"){
	        		$('[name=groupBtn_'+event.id+']').before('<span class="spanmsg" id="span-tag">Already exist </span>');
	        	}
	        	else{
	        		var tTitle = jsonData.title;
		        	if(tTitle.length>19){
		        		menuTitle=tTitle.substr(0,19)+"...";
		        		popTitle=tTitle.substr(0,16)+"...";
		        	}
		        	else{
		        		menuTitle=tTitle;
		        		popTitle=tTitle;
		        	}
		        	stTitle = tTitle.substr(0,124);
	        		var html="";
        			html+='<div class="tag-popup-col1">';
        			html+='<input type="checkbox" name="groupChk[]" id="groupChk[]" value="'+jsonData.id+'">';
        			html+='<div class="tag-popup-col1-text">'+popTitle+'</div>';
        			html+='</div>';
	        		$(".tag-popup-mid").prepend(html);
	        		var html4="";
	    			html4+='<div class="tag-popup-col1" style="margin:0 0 5px 0px">';
	    			html4+='<input type="checkbox" name="groupChk[]" id="groupChk[]" value="'+jsonData.id+'">';
	    			html4+='<div class="tag-popup-col1-text">'+popTitle+'</div>';
	    			html4+='</div>';
	        		$(".tag-manage-mid").prepend(html4);
	        		var html2="";
	        		html2+='<a id="menu_grp_'+jsonData.id+'" class="grp-listing" href="/'+PROJECT_NAME+'bookmarks/group/id/'+jsonData.id+'">';
	        		html2+=menuTitle+'</a>';
	        		$("#grplisting").after(html2); 
	        		html3='';
	        		html3+='<div class="group-popup-col1" id="grp_'+jsonData.id+'">';
	        		html3+='<div class="editpop-cross">';
	        		html3+='<img align="absmiddle" height="8" src="/'+PROJECT_NAME+'public/images/cross-grey.png" grpid="'+jsonData.id+'" uid="'+uID+'" onclick="removeGrp(this)" id="imggrp_'+jsonData.id+'">';
        			html3+='</div>';
    				html3+='<div class="group-popup-col1-text">';
					html3+='<span class="menu-span" title="Click to Rename it" style="padding:0px;background:none;" id="span_'+jsonData.id+'" rel="'+jsonData.id+'">'+popTitle+'</span>';
					html3+='<input type="text" class="menu-span2" style="width:115px;display:none;" id="txtgrp_'+jsonData.id+'" name="txtgrp_'+jsonData.id+'" rel="'+jsonData.id+'" value="'+jsonData.title+'" maxlength="124" onkeyup="assignGrpLabels(this)">';
					html3+='</div>';
					html3+='</div>';
					$("#grp-form").prepend(html3);
					$(".grouplist").fadeIn();
					$(".popupsTaglist").fadeIn();
					$("[name=add_grptxt]").remove();
	        	}

        	},
        error: function(xhr, ajaxOptions, thrownError) {
        	alert("Server Error.");
		}
	 });
	}
	else{
		$("span#"+ids).remove();
		$(".alert-box").remove();
		$(".alert-box1").remove();
		$(".alert-box2").remove();
		showDefaultMsg( "Please add text.", 2 );
	}
}
/**
 * function used to assign groups to the users
 * Author: Shaina Gandhi
 * Date: 14,Aug 2013
 * version: 1.0
 */
function assignGroups(event){
	$("[name=saveBtn_"+event.id+"]").attr('disabled','disabled');
	var ids = addLoadingImage($("[name=saveBtn_"+event.id+"]"), "before");
	var assign_groups=$("#formGroup_"+event.id).serializeArray();
	var uid=event.id;
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "bookmarks/assign-groups",
        type: "POST",
        dataType: "json",
        data: { "user_id" : uid, "groups_arr" : assign_groups },
        timeout: 50000,
        success: function(jsonData) {
        	
            	$("span#"+ids).remove();
            	if(jsonData.msg=="success"){
            		$("[name=title]").val("");
            		$("[name=saveBtn_"+event.id+"]").removeAttr('disabled');
            		$("#tag-popup-outertags_"+uid).fadeToggle('slow');
            		$(".alert-box").remove();
	        		$(".alert-box2").remove();
	        		$(".alert-box1").remove();
	        		showDefaultMsg( "Bookmark group(s) assigned successfully.", 1 );
            	}
            	else{
            		$("[name=saveBtn_"+event.id+"]").removeAttr('disabled');
            		$("[name=saveBtn_"+event.id+"]").before('<span class="spanmsg" id="span-msg" style="color:red;">Server Error</span>');
            	}
            },
        error: function(xhr, ajaxOptions, thrownError) {
        	alert("Server Error.");
		}
	 });
}

function showGroupMenuPopup(){
	$("#groups-menu-popUp").fadeToggle();
}

function addMenuGroup(event){
	var uid=event.uid;
	$("[name=manageTags]").removeAttr("showmanagegroups");
	$(".shortProfileEditGrp").removeAttr("showshortprofiletags");
	var ids = addLoadingImage($("[name=nav-grp-btn]"), "before");
	var title=$("[name=grp-nav-title]").val();
	if(title!=""){
	
		$("[name=nav-grp-btn]").attr('disabled','disabled');
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "bookmarks/add-new-group",
        type: "POST",
        dataType: "json",
        data: { "title" : title },
        timeout: 50000,
        success: function(jsonData) {
        		$(".spanmsg").remove();
        		$("span#"+ids).remove();
        		$("[name=nav-grp-btn]").removeAttr('disabled');
        		$("[name=grp-nav-title]").val("");
        		if(jsonData=="exist"){
        			$("[name=nav-grp-btn]").before('<span class="spanmsg" id="span-tag">Already exist </span>');
        		}
        		else{
        			var tTitle = jsonData.title;
        			if(tTitle.length>19){
		        		menuTitle=tTitle.substr(0,19)+"...";
		        		popTitle=tTitle.substr(0,16)+"...";
		        	}
		        	else{
		        		menuTitle=tTitle;
		        		popTitle=tTitle;
		        	}
		        	stTitle = tTitle.substr(0,124);
		        	
        			$("[name=add_grptxt]").remove();
        			$(".tag-manage-btn").remove();
        			
        			html3='';
	        		html3+='<div class="group-popup-col1" id="grp_'+jsonData.id+'">';
	        		html3+='<div class="editpop-cross">';
	        		html3+='<img align="absmiddle" height="8" src="/'+PROJECT_NAME+'public/images/cross-grey.png" grpid="'+jsonData.id+'" uid="'+uid+'" onclick="removeGrp(this)" id="imggrp_'+jsonData.id+'">';
        			html3+='</div>';
    				html3+='<div class="group-popup-col1-text">';
					html3+='<span class="menu-span" title="Click to Rename it" style="padding:0px;background:none;" id="span_'+jsonData.id+'" rel="'+jsonData.id+'">'+popTitle+'</span>';
					html3+='<input type="text" class="menu-span2" style="width:115px;display:none;" id="txtgrp_'+jsonData.id+'" name="txtgrp_'+jsonData.id+'" rel="'+jsonData.id+'" value="'+jsonData.title+'" maxlength="124" onkeyup="assignGrpLabels(this)">';
					html3+='</div>';
					html3+='</div>';
					$("#grp-form").prepend(html3);
		        	
            		var html2="";
            		html2+='<a title="'+tTitle+'" id="menu_grp_'+jsonData.id+'" class="grp-listing" href="/'+PROJECT_NAME+'bookmarks/group/id/'+jsonData.id+'">';
            		html2+=menuTitle+'</a>';
            		
            		
            		$("#addNewgrp").remove();
            		$(".groupdiv").css("height","auto");
            		$(".grouplist").css("display","block");
            		$("#grplisting").after(html2); 
            	}
            },
        error: function(xhr, ajaxOptions, thrownError) {
        	alert("Server Error.");
		}
	 });
}
	else{
		$("span#"+ids).remove();
		$(".alert-box").remove();
		$(".alert-box1").remove();
		$(".alert-box2").remove();
		showDefaultMsg( "Please add text.", 2 );
	}
}
function removeGrp(event){
	var uid=$(event).attr("uid");
	$("[name=manageTags]").removeAttr("showmanagegroups");
	$(".shortProfileEditGrp").removeAttr("showshortprofiletags");
	$(".editpop-cross").attr('disabled','disabled');
	var grpid=$(event).attr("grpid");
	$("#imggrp_"+grpid).removeAttr("onclick");
	$("#imggrp_"+grpid).css("max-width","20px");
	$("#imggrp_"+grpid).attr("src", "/"+PROJECT_NAME+"public/images/loading_small_black.gif");
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "bookmarks/delete-group",
        type: "POST",
        dataType: "json",
        data: { "id" : grpid },
        timeout: 50000,
        success: function(jsonData) {
        	$(".editpop-cross").removeAttr('disabled');
        	$("#grp_"+grpid).remove();
        	$("#menu_grp_"+grpid).remove();
        	$("[name=manageTags]").removeAttr('showmanagegroups');
        	$(".shortProfileEditGrp").removeAttr('showshortprofiletags');
        	$(".groupdiv").css("height","auto");
        	if ($('#grp-form').is(':empty')){
        		var html='';
        		html+='<a onclick="loadBookmarkPopup(this);" href="javascript:;" id="12" name="add_grptxt">';
				html+='Add Group';
				html+='</a>';
        		$("#grplisting").after(html);
        		$(".grouplist").hide();
        	}
        	$(".alert-box").remove();
			$(".alert-box1").remove();
			$(".alert-box2").remove();
        	showDefaultMsg( "Group deleted successfully.", 1 );
        	/*
        	
        	if(jsonData.msg=="fail"){
        		$(".editpop-cross").removeAttr('disabled');
        		$("#menu_grp_"+grpid).remove();
        		var html="";
        		html+='<a onclick="loadBookmarkPopup(this);" href="javascript:;" id="'+uid+'" name="add_grptxt">Add Group</a>';
        		$("#grplisting").after(html);
        		$(".group-popup-btn").remove();
        		$(".group-popup-mid").remove();
    			$(".group-popup-btn").remove();
        	}
        	else{
        		$(".editpop-cross").removeAttr('disabled');
        		if(jsonData.length>0){
        			$("[name=add_grptxt]").remove();
        			$(".group-popup-mid").remove();
        			$(".grouplist").remove();
        			$(".group-popup-btn").remove();
        			var html="";
        			if(jsonData.length>3){
        				html+='<div style="overflow-y:scroll;" class="group-popup-mid">';
        			}
        			else{
        				html+='<div style="overflow-y:hidden;" class="group-popup-mid">';
        			}
        			
        			html+='<form action="" method="post" id="grp-form" name="grp-form">';
            		
        			for(var i=0;i<jsonData.length;i++){
    	        		html+='<div id="grp_'+jsonData[i]['group_id']+'" class="group-popup-col1">';
                		html+='<div class="editpop-cross">';
                		html+='<img id="imggrp_'+jsonData[i]["group_id"]+'" onclick="removeGrp(this)" uid="'+uid+'" grpid="'+jsonData[i]["group_id"]+'" height="8" align="absmiddle" src="/'+PROJECT_NAME+'public/images/cross-grey.png">';
                		html+='</div>';
                		html+='<div class="group-popup-col1-text"><span rel="'+jsonData[i]['group_id']+'" id="span_'+jsonData[i]['group_id']+'" style="padding:0px;background:none;" class="menu-span">'+jsonData[i]['group_title']+'</span>';
                		html+='<input type="text" onkeyup="assignGrpLabels(this)" value="'+jsonData[i]['group_title']+'" rel="'+jsonData[i]['group_id']+'" name="txtgrp_'+jsonData[i]['group_id']+'" id="txtgrp_'+jsonData[i]['group_id']+'" style="width:115px;display:none;" class="menu-span2">';
                		html+='</div>';
                		html+='</div>';
                		if(i==0){
                			var lastid=jsonData[0]['group_id'];	
                		}
           			}
        			html+='</div>';
            		html+='<div class="group-popup-btn">';
            		html+='<input type="button" value="Update" name="nav-grp-save" class="btn-blue mt5" alt="Update" title="Update" onclick="updateGroupLabels()">';
            		html+='</div>';
            		html+='</form>';
		        	html+='</div>';
		        	
            		$("#addNewgrp").remove();
            		$(".groupdiv").css("height","auto");
            		$(".grouplist").css("display","block");
            		$(".group-popup-top").after(html);
            		
            		
        			$("#grp_"+grpid).remove();
        			$("#menu_grp_"+grpid).remove();
        			$(".groupdiv").css("height","auto");
        		}   
        	}
        		     		
            */},
        error: function(xhr, ajaxOptions, thrownError) {
        	alert("Server Error.");
		}
	 });
}
function assignGrpLabels(event){
	var id=$(event).attr("rel");
	$("#span_"+id).html($(event).val());
	$("#event"+id).val($(event).val());
}
/**
 * update group labels in middle bar..
 * @auther Sunny Patial
 */
function updateGroupLabels(elem)
{
	$(".alert-box").remove();
	$(".alert-box1").remove();
	$(".alert-box2").remove();
	var ids = addLoadingImage($("[name=nav-grp-save]"), "before");
	var str=$("form#grp-form").serializeArray();
	var existenceArr = new Array();
	for(var i=0;i<str.length;i++){
		var result = existenceArr.indexOf(str[i].value);
		existenceArr[i] = str[i].value; 
		if(result==0){
			$("span#"+ids).remove();
			showDefaultMsg( "User can't update group with same title.", 2 );
			return false;
		}
	}
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "bookmarks/update-group",
        type: "POST",
        dataType: "json",
        data: { "grps" : str },
        timeout: 50000,
        success: function(jsonData) {
        		$("span#"+ids).remove();
        		$(".grp-listing").remove();  
	        	var html="";
	        	for(var i=0;i<jsonData.length;i++){
	        		
	        		var tTitle = jsonData[i]["group_title"];
		        	if(tTitle.length>19){
		        		tTitle=tTitle.substr(0,19)+"...";
		        		popTitle=tTitle.substr(0,16)+"...";
		        	}
		        	else{
		        		tTitle=tTitle;
		        		popTitle=tTitle;
		        	}
	        		html+='<a class="grp-listing" title="'+tTitle+'" id="menu_grp_'+jsonData[i]['group_id']+'" href="/'+PROJECT_NAME+'bookmarks/group/id/'+jsonData[i]['group_id']+'">';
	        		html+=tTitle+'</a>';
	        		$("#span_"+jsonData[i]['group_id']).html(popTitle);
	        	}
	        	$("#grplisting").after(html);
	        	$(".GrpInput").hide();
	        	$(".GrpTxt").fadeIn();
	        	$("[name=manageTags]").removeAttr("showmanagegroups");
	        	$(".shortProfileEditGrp").removeAttr("showshortprofiletags");
	        	showGroupMenuPopup();
        	},
        error: function(xhr, ajaxOptions, thrownError) {
        	alert("Server Error.");
		}
	 });
}
/**
 * close edit group pop pop
 * @auther nsingh3
 */
function closeEditGroupPopup(){
	$(".tag-manage-outer").css("display","none");
}

function removeBookmark2(){
	// var str=$("form#bookmark-form").serializeArray();
	var str = [];
    $("input[name='profile_chk[]']:checked").each(function(i){
    	str[i] = $(this).val();
     });
	if(str.length>0){
		var ids = addLoadingImage($("#remBookmark"), "after");
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "bookmarks/remove-bookmark",
	        type: "POST",
	        dataType: "json",
	        data: { "bookmarks" : str },
	        timeout: 50000,
	        success: function(jsonData) {
	        		$("span#"+ids).remove();
	        		$(".manage-pop").fadeOut("slow");
	        		if(jsonData.msg="success"){
	        			for(var i=0;i<str.length;i++){
	        				$("#col1_"+str[i]).remove();
	        			}
	        		}
	        		if (!$(".bookmarkLinks")[0]){
	            		$(".text-grey3").remove();
	            		$(".bookmark-search-right").remove();
	            		$(".linkprofile-outer").append('<div class="emptyRecordOuter"><div class="emptyRecordInner text-grey3"><p>No result found!</p></div></div>');
	            	}
	        		$(".alert-box").remove();
	        		$(".alert-box1").remove();
	        		$(".alert-box2").remove();
	        		showDefaultMsg( "Bookmarked profile removed successfully.", 1 );
	        		
	        	},
	        error: function(xhr, ajaxOptions, thrownError) {
	        	alert("Server Error.");
			}
		 });
	}
	else{
		$(".manage-pop-outer").fadeToggle();
		$( "#dialog_confirm" ).dialog({
		      modal: true,
		      width: 306,
		      show: {
		    	  effect: "fade"
		    	  },
			  hide: {
				  effect: "fade"
				  },
		      buttons: {
		        'ok': function() {
		        	$( this ).dialog( "close" );
		        }
		      }
		});
	}
}
function removeBookmark(){
	// var str=$("form#bookmark-form").serializeArray();
	var str = [];
    $("input[name='profile_chk[]']:checked").each(function(i){
    	str[i] = $(this).val();
     });
	if(str.length>0){
		var ids = addLoadingImage($("#remBookmark"), "after");
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "bookmarks/remove-bookmark",
	        type: "POST",
	        dataType: "json",
	        data: { "bookmarks" : str },
	        timeout: 50000,
	        success: function(jsonData) {
	        		$("span#"+ids).remove();
	        		$(".manage-pop").fadeOut("slow");
	        		$(".short-view-profile-popup").hide();
					for(var i=0;i<str.length;i++){
						// $("#grid_"+str[i]).fadeOut(1000,function() {
							$("#grid_"+str[i]).remove();					        		
						// });
					}
		        	if (!$(".col4")[0])
		        	{
		        		__removeOverlay();
		        		$(".text-grey3").remove();
		        		$(".bookmark-search-right").remove();
		        		$(".linkprofile-outer").append('<div class="emptyRecordOuter"><div class="emptyRecordInner text-grey3"><p>No result found!</p></div></div>');
		        	} 	
		        	
	        		
	        		$(".alert-box").remove();
	        		$(".alert-box1").remove();
	        		$(".alert-box2").remove();
	        		showDefaultMsg( "Bookmarked profile removed successfully.", 1 );
	        		
	        	},
	        error: function(xhr, ajaxOptions, thrownError) {
	        	alert("Server Error.");
			}
		 });
	}
	else{
		$(".manage-pop-outer").fadeToggle();
		 $(".alert-box").remove();
		 $(".alert-box1").remove();
		 $(".alert-box2").remove();
		 showDefaultMsg( "Please select one user atleast.", 2 ); 
	}
}
function sngMsg(){
	$("#sndmultiple").val("");
	$(".msg-popup-outer").fadeToggle();
	$("#tag-manage-outertags").hide(); 
	

}

/**
 * function used to get user created tags list
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function getManageGrps(event){
	var uid=event.id;
	$('.loading').remove();
	$(".grpChk").removeAttr('checked');
	var attr = $(event).attr('showManageGroups');
	if (typeof attr !== 'undefined' && attr !== false) {
		// ...... not going for server request...
		$("#tag-manage-outertags").fadeToggle('slow');
	}
	else{
		// remove attribute onclick...
		$("[name="+event.name+"]").removeAttr("onclick");
		// ..... going for server request...
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "bookmarks/get-manage-groups",
	        type: "POST",
	        dataType: "json",
	        data: { "user_id" : uid },
	        timeout: 50000,
	        beforeSend: function(){
	        	$("#tag-manage_"+uid).empty();
	        	// embed loading image file..
	    		var loadingHtml = '<div id="loading" style="display:table-cell;width:170px;height:195px;text-align:center;vertical-align:middle;padding-left:0px;margin-top:89px;">';
	    		loadingHtml += '<img src="'+IMAGE_PATH+'/loading_medium_purple.gif">';
	    		loadingHtml += '</div>';
	    		$("#tag-manage_"+uid).append(loadingHtml);
	    		$("#tag-manage-outertags").fadeToggle('slow');
	    	},
	        success: function(jsonData) {
	        	if(jsonData.length>0)
		        {
		        	$("#loading_"+uid).css("display","none");
		        	var html='';
		        	html+='<div class="tag-manage-top">';
		        	html+='<input style="width:95%;" maxlength="124" name="managegroupTxt_'+uid+'" id="managegroupTxt_'+uid+'" type="text" />';
		        	html+='<input name="managegroupBtn_'+uid+'" id="'+uid+'" type="button" value="+ Add Group" class="btn-blue mt5 job-popup-btn" alt="+ Add Group" title="+ Add Group" onclick="addManageGroup(this)" />';
		        	html+='</div>';
		        	html+='<form class="popupsTaglist" name="formManageGroup_'+uid+'" id="formManageGroup_'+uid+'" method="post" action="">';
		        	html+='<div class="tag-manage-mid">';
		        	var j=0;
		        	for(var i=0;i<jsonData.length;i++){
		        		
			        	html+='<div class="tag-manage-col1">';
			        	html+='<input name="groupChk[]" class="grpChk" id="groupChk[]" type="checkbox" value="'+jsonData[i]["group_id"]+'" />';
			        	var tTitle = jsonData[i]["group_title"];
			        	var sTitle="";
			        	if(tTitle.length>19){
			        		sTitle=tTitle.substr(0,19)+"...";
			        	}
			        	else{
			        		sTitle=tTitle;	
			        	}
			        	tTitle = tTitle.substr(0,124);
			        	html+='<div class="tag-popup-col1-text" title="'+tTitle+'">'+sTitle+'</div>';
			        	html+='</div>';	
			        	j++;
		        	}
		        	
		        	html+='</div>';
		        	html+='<div class="tag-manage-btn"><input name="saveManageBtn_'+uid+'" onclick="assignGroupsToUser(this)" id="'+uid+'" type="button" value="Save" class=" btn-blue mt5 job-popup-save-btn" alt="Save" title="Save" />';
		        	html+='</form>';
		        	html+='</div>';
		        	$("[name="+event.name+"]").removeAttr('disabled');
		        	$("#tag-manage_"+uid).empty();
		        	$("#tag-manage_"+uid).append(html);
		        	$(".grouplist").css("display","block");
		        	$("#tag-manage_"+uid).css("height","auto");
		        	 $(".popupsTaglist").fadeIn();
	        	}
	        	else
	        	{
	        		$(".tags-menu-listing-addnewTag").css("height","54pspan_33x");
	        		var html='';
		        	html+='<div class="tag-manage-top">';
		        	html+='<input style="width:95%;"  maxlength="124" name="managegroupTxt_'+uid+'" id="managegroupTxt_'+uid+'" type="text" />';
		        	html+='<input name="managegroupBtn_'+uid+'" id="'+uid+'" type="button" value="+ Add Group" class="btn-blue mt5 job-popup-btn" alt="+ Add Group" title="+ Add Group" onclick="addManageGroup(this)" />';
		        	html+='</div>';
		        	html+='<form class="popupsTaglist" name="formManageGroup_'+uid+'" id="formManageGroup_'+uid+'" method="post" action="" style="display:none;">';
		        	html+='<div class="tag-manage-mid">';
		        	
		        	html+='</div>';
		        	html+='<div class="tag-manage-btn"><input name="saveManageBtn_'+uid+'" onclick="assignGroupsToUser(this)" id="'+uid+'" type="button" value="Save" class=" btn-blue mt5 job-popup-save-btn" alt="Save" title="Save" />';
		        	html+='</form>';
		        	html+='</div>';
		        	
		        	$("[name="+event.name+"]").removeAttr('disabled');
		        	$("#tag-manage_"+uid).empty();
		        	$("#tag-manage_"+uid).append(html);
		        	$("#tag-manage_"+uid).css("height","auto");
		        }
	        	// add attribute onclick...
	        	$("[name="+event.name+"]").attr("onclick","getManageGrps(this);");
	        	$("[name=manageTags]").attr("showManageGroups","yes");
	        	
	        },
	        error: function(xhr, ajaxOptions, thrownError) {
	        	showDefaultMsg( "Unable to add group.Please try again.", 2 );   
			}
		 });
		
	}
}
/**
 * function used to add new group
 * Author: Sunny Patial
 * Date: 20,Aug 2013
 * version: 1.0
 */
function addManageGroup(event){
	$('#span-tag').remove();
	var ids = addLoadingImage($("[name=managegroupBtn_"+event.id+"]"), "before");
	var title=$("#managegroupTxt_"+event.id).val();
	if(title != "")
		{
	$("[name=managegroupBtn_"+event.id+"]").attr('disabled','disabled');
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "bookmarks/add-new-group",
        type: "POST",
        dataType: "json",
        data: { "title" : title },
        timeout: 50000,
        success: function(jsonData) {
        	var uID = $("#currentLoginUserID").val();
        	$("span#"+ids).remove();
    		$("[name=managegroupBtn_"+event.id+"]").removeAttr('disabled');
    		$("#managegroupTxt_"+event.id).val("");
    		if(jsonData=="exist"){
    			$('[name=managegroupBtn_'+event.id+']').before('<span class="spanmsg" id="span-tag">Already exist </span>');
    		}
    		else{
    			var tTitle = jsonData.title;
    			if(tTitle.length>19){
	        		menuTitle=tTitle.substr(0,19)+"...";
	        		popTitle=tTitle.substr(0,16)+"...";
	        	}
	        	else{
	        		menuTitle=tTitle;
	        		popTitle=tTitle;
	        	}
	        	stTitle = tTitle.substr(0,124);
    			var html="";
    			html+='<div class="tag-popup-col1">';
    			html+='<input type="checkbox" name="groupChk[]" id="groupChk[]" value="'+jsonData.id+'">';
    			html+='<div class="tag-popup-col1-text">'+popTitle+'</div>';
    			html+='</div>';
        		$(".tag-popup-mid").prepend(html);
        		var html4="";
    			html4+='<div class="tag-popup-col1" style="margin:0 0 5px 0px">';
    			html4+='<input type="checkbox" name="groupChk[]" id="groupChk[]" value="'+jsonData.id+'">';
    			html4+='<div class="tag-popup-col1-text">'+popTitle+'</div>';
    			html4+='</div>';
        		$(".tag-manage-mid").prepend(html4);
        		var html2="";
        		html2+='<a id="menu_grp_'+jsonData.id+'" class="grp-listing" href="/'+PROJECT_NAME+'bookmarks/group/id/'+jsonData.id+'">';
        		html2+=menuTitle+'</a>';
        		$("#grplisting").after(html2); 
        		html3='';
        		html3+='<div class="group-popup-col1" id="grp_'+jsonData.id+'">';
        		html3+='<div class="editpop-cross">';
        		html3+='<img align="absmiddle" height="8" src="/'+PROJECT_NAME+'public/images/cross-grey.png" grpid="'+jsonData.id+'" uid="'+uID+'" onclick="removeGrp(this)" id="imggrp_'+jsonData.id+'">';
    			html3+='</div>';
				html3+='<div class="group-popup-col1-text">';
				html3+='<span class="menu-span" title="Click to Rename it" style="padding:0px;background:none;" id="span_'+jsonData.id+'" rel="'+jsonData.id+'">'+popTitle+'</span>';
				html3+='<input type="text" class="menu-span2" style="width:115px;display:none;" id="txtgrp_'+jsonData.id+'" name="txtgrp_'+jsonData.id+'" rel="'+jsonData.id+'" value="'+jsonData.title+'" maxlength="124" onkeyup="assignGrpLabels(this)">';
				html3+='</div>';
				html3+='</div>';
				$("[name=add_grptxt]").remove();
				$("#grp-form").prepend(html3);
				$(".grouplist").fadeIn();
				$(".popupsTaglist").fadeIn();
			}
        },
        error: function(xhr, ajaxOptions, thrownError) {
        	alert("Server Error.");
		}
	 });
		}
	else{
		$("span#"+ids).remove();
		$(".alert-box").remove();
		$(".alert-box1").remove();
		$(".alert-box2").remove();
		showDefaultMsg( "Please add text.", 2 );
	}
}
/*function assignGroupsToUser(event){
	var userid=$("form#bookmark-form").serializeArray();
	var grpsfrm=$("form#formManageGroup_"+event.id).serializeArray();
	if(userid.length>0){
		var ids = addLoadingImage($("#saveManageBtn_"+event.id), "before");
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "bookmarks/assign-multiple-groups",
	        type: "POST",
	        dataType: "json",
	        data: { "groups" : grpsfrm,"user" : userid },
	        timeout: 50000,
	        success: function(jsonData) {
	        		$("span#"+ids).remove();
	        		if(jsonData.msg="success"){
	        			$("#tag-manage-outertags").css("display","none");
	        		}
	        	},
	        error: function(xhr, ajaxOptions, thrownError) {
	        	alert("Server Error.");
			}
		 });
	}
	else{
		$(".msg-popup-outer").fadeToggle();
		$(".manage-pop-outer").fadeToggle();
		$( "#dialog_confirm" ).dialog({
		      modal: true,
		      width: 306,
		      show: {
		    	  effect: "fade"
		    	  },
			  hide: {
				  effect: "fade"
				  },
		      buttons: {
		        'ok': function() {
		        	$( this ).dialog( "close" );
		        }
		      }
		});
	}
}*/
/**
 * Get notes of user inside ckeditor in short profile.  
 * @author spatial
 * @version 1.0
 */
function getNotes(event)
{
	$(".closeTagsPopup").hide();
	var uid=event.id;
	var attr = $(event).attr('showShortProfileNote');
	
	if (typeof attr !== 'undefined' && attr !== false) 
		
	{
		// ...... not going for server request...
		$("#displayNotes_"+uid).toggle();
		CKEDITOR.instances["note_"+uid].setData($("#notesOrignalValue_"+uid).val());
	}
	else
	{
		// remove attribute onclick...
		$("[name="+event.name+"]").removeAttr("onclick");
		//..... going for server request...
		jQuery.ajax({
				  url: "/" + PROJECT_NAME + "links/get-note",
				  type: "POST",
				  dataType: "json",
				  data: { "user_id" : uid },
				  beforeSend: function(){
					// embed loading image file..
					var loadingHtml = '';
					// loadingHtml += '<img align="absmiddle" src="'+IMAGE_PATH+'/notok-icon-grey.png" alt="Close" title="Close" style="float: right; width: 16px; height: 16px; cursor: pointer; margin: -10px -12px;" onclick="closeNotesPopup(19)">';
					loadingHtml += '<div style="vertical-align: middle; text-align: center; display: table-cell; height:270px;width:411px;border:solid 1px;">';
					loadingHtml += '<img src="'+IMAGE_PATH+'/loading_medium_purple.gif">';
					loadingHtml += '</div>';
					$(".notes-popup-bot-second_"+uid).empty();
					$(".notes-popup-bot-second_"+uid).append(loadingHtml);
					$(".notes-popup-bot-second_"+uid).css("display","block");
					$("#displayNotes_"+uid).fadeToggle('slow');
					}, 
				  timeout: 50000,
				  success: function(jsonData) 
				  {
						  $(".notes-popup-bot-second_"+uid).empty();
						  $(".notes-popup-bot-second_"+uid).css("display","none");
						  $(".notes-popup-bot_"+uid).css("display","block");
						  CKEDITOR.instances["note_"+uid].setData(jsonData);
						  $("#notesOrignalValue_"+uid).val(jsonData);
						  $(event).attr("onclick","getNotes(this);");
						  $(event).attr("showShortProfileNote","yes");
						  $(".cke_contents").height("150px");
				  },
				  error: function(xhr, ajaxOptions, thrownError) 
				  {
					  alert("Server Error.");
				  }
			  });
	}
}
/**
 * Get notes of user inside ckeditor in iprofile
 * when user visit another user profile.
 * @author hkaur5
 * @see getNotes()
 */
function getNotesForProfile(event)
{
	var uid = event.id ;
	if (CKEDITOR.instances['note_'+uid])
	{
		CKEDITOR.instances['note_'+uid].destroy();
	}
	
	CKEDITOR.replace( 'note_'+uid, {
		uiColor: '#6C518F',
		toolbar:[
		         [ 'Bold', 'Italic', '-', 'NumberedList', 'BulletedList', '-', 'Link', 'Unlink' ],
		         [ 'FontSize', 'TextColor', 'BGColor' ]
		         
		         ],
		         removePlugins: 'elementspath'
	});

	$("#displayNotes").fadeToggle('fast',function(){
		 //Destroy instance of editor that has already made in previous call.

		 if ($("#displayNotes").is(":hidden")) 
		 {
		     // do this
		 }
		 else
		 {	

			jQuery.ajax({
		        url: "/" + PROJECT_NAME + "links/get-note",
		        type: "POST",
		        dataType: "json",
		        data: { "user_id" : uid },
		        timeout: 50000,
		        success: function(jsonData) 
		        {
		        	
					CKEDITOR.instances["note_"+uid].setData(jsonData);
		        },
		        error: function(xhr, ajaxOptions, thrownError) {
					//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
				}
			 });
		 }
	});
}
/**
 * Saves the note from ckeditor. 
 * @author spatial, hkaur5 
 * @param event
 * @version 1.0
 */

function saveNote(event){
	var uid=event.id;
	$("#note-msg").remove();
	$("[name=saveNote_"+event.id+"]").attr('disabled','disabled');
	// var txt=$("#note_"+event.id).val();
	
	//To get value inside ckeditor.
	var txt=CKEDITOR.instances["note_"+event.id].getData();
	
	
	if(txt !=="" && txt.length != 0)
	{
			var ids = addLoadingImage($("[name=saveNote_"+event.id+"]"), "before");
			$("[name=saveNote_"+event.id+"]").hide();
			jQuery.ajax({
		        url: "/" + PROJECT_NAME + "links/save-note",
		        type: "POST",
		        dataType: "json",
		        data: { "user_id" : uid, "note" : txt },
		        timeout: 50000,
		        success: function(jsonData) 
		        {
		        	$("span#"+ids).remove();
		        	$("[name=saveNote_"+event.id+"]").show();
		        	if(jsonData.msg=="success")
		        	{
		        		$("#notesOrignalValue_"+event.id).val(txt);
		        		CKEDITOR.instances["note_"+event.id].setData(txt);
		        		$(".alert-box").remove();
		        		$(".alert-box1").remove();
		    			$(".alert-box2").remove();
		    			showDefaultMsg( "Note has been saved successfully.", 1 );
		        		$("[name=saveNote_"+event.id+"]").removeAttr('disabled');
		        		$(".closeNotesPopup").fadeToggle('slow');
		        		$(".notes-popup-outer2").fadeToggle('slow');
		        	}
		        	else
		        	{
						$("[name=saveNote_"+event.id+"]").removeAttr('disabled');
						$("[name=saveNote_"+event.id+"]").before('<span class="spanmsg" id="note-msg" style="color:red;">Server Error</span>');
		            }
		         },
		         error: function(xhr, ajaxOptions, thrownError) 
		         {
		        	 alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
		         }
			 });
	}
	else
	{
		alert("You cannot make an empty note. Please insert some text.");
		
	}
}
/**
 *	Ajax call to report abuse profile and changing properties of current alement so
 *	as to show Cancel report absue options.
 * @author spatial
 * @author sjaiswal
 * @author hkaur5 ( added code to change properties of element)
 * Date: 5,Aug 2013
 * version: 1.1
 */
function abuseReportProfile(event){
	var ids = addLoadingImage($("[name=abuse_"+event.id+"]"), "after","tiny_loader.gif");
	var uid=event.id;
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "links/abuse-report",
        type: "POST",
        dataType: "json",
        data: { "user_id" : uid },
        timeout: 50000,
        success: function(jsonData) {
        	$("span#"+ids).remove();
        	$("[name=abuse_"+uid+"]").attr("onclick",'RemoveProfileFromReportAbuse(this)'); //changing onclick function
        	$("[name=abuse_"+uid+"]").addClass('change_text'); // adding class to show cancel report abuse on hover.
        	$("[name=abuse_"+uid+"]").html("Reported as Abuse");
        	
        },
        error: function(xhr, ajaxOptions, thrownError) {
        	alert("Server Error.");
		}
	 });
}

/**
 * Remove user profile from report abuse record and changing properties of element.
 * @param elem
 * @author hkaur5
 */
function RemoveProfileFromReportAbuse(elem)
{
	
	var ids = addLoadingImage($("[name=abuse_"+elem.id+"]"), "after","tiny_loader.gif");
	var uid=elem.id;
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "links/remove-profile-report-abuse",
        type: "POST",
        dataType: "json",
        data: { "user_id" : uid },
        timeout: 50000,
        success: function(jsonData) {
        	
        	$("span#"+ids).remove();
        	if(jsonData)
        	{
	        	$("[name=abuse_"+uid+"]").attr("onclick",'abuseReportProfile(this)'); //changing onclick function
	        	$("[name=abuse_"+uid+"]").removeClass('change_text'); // remove class so as to remove onhover functionality.
	        	$("[name=abuse_"+uid+"]").html("Reported Abuse");
        	}
        	else
    		{
        		$("[name=abuse_"+uid+"]").html("Reported as Abuse");
    		}
        	
        },
        error: function(xhr, ajaxOptions, thrownError) {
        	alert("Server Error.");
		}
	 });
	
}

function sendMessage(){
	
	$(".alert-box").remove();
	var str = [];
    $("input[name='profile_chk[]']:checked").each(function(i){
    	str[i] = $(this).val();
     });
//	var str=$("form#bookmark-form").serializeArray();
	var msg=$("#sndmultiple").val();
//	if(str.length>0){
		var txt=$("#sndmultiple").val();
		var ids = addLoadingImage($("#sndmsg"), "before");
		if(txt!=""){
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "bookmarks/send-multiple-msges",
	        type: "POST",
	        dataType: "json",
	        data: { "bookmark_users" : str,"msg" : msg },
	        timeout: 50000,
	        success: function(jsonData) {
	        		$("span#"+ids).remove();
	        		$(".alert-box").remove();
	        		if(jsonData.msg="success"){
	        			sngMsg();
	        			$(".alert-box").remove();
		        		$(".alert-box2").remove();
		        		$(".alert-box1").remove();
		        		showDefaultMsg( "Message sent.", 1 );
	        		}
	        		
	        		
	        	},
	        error: function(xhr, ajaxOptions, thrownError) {
	        	alert("Server Error.");
			}
		 });
		}
		else{
			$("[name=sndmultiple]").removeAttr('disabled');
			$(".alert-box1").remove();
			$("span#"+ids).remove();
			$(".alert-box").remove();
			showDefaultMsg( "Please add message text.", 2 );
		}
//	}
//	else{
//		$(".msg-popup-outer").fadeToggle();
//		$(".manage-pop-outer").fadeToggle();
//		 $(".alert-box").remove();
//		 $(".alert-box1").remove();
//		 $(".alert-box2").remove();
//		 showDefaultMsg( "Please select one user atleast.", 2 ); 
//	}
}
function sngMsg(){
	var str = [];
    $("input[name='profile_chk[]']:checked").each(function(i){
    	str[i] = $(this).val();
     });
    if(str.length>0)
    {
	$("#sndmultiple").val("");
	$(".msg-popup-outer").fadeToggle();
	$("#tag-manage-outertags").hide(); 
    }
	else{
	$(".msg-popup-outer").fadeToggle();
	$(".manage-pop-outer").fadeToggle();
	 $(".alert-box").remove();
	 $(".alert-box1").remove();
	 $(".alert-box2").remove();
	 showDefaultMsg( "Please select one user atleast.", 2 ); 
}
	

}

function assignGroupsToUser(event){
	var ids = addLoadingImage($("[name="+event.name+"]"), "before");
	var userid = [];
    $("input[name='profile_chk[]']:checked").each(function(i){
    	userid[i] = $(this).val();
     });
    var grpid = [];
    $("input[name='groupChk[]']:checked").each(function(i){
    	grpid[i] = $(this).val();
     });
	// var userid=$("form#bookmark-form").serializeArray();
	var grpsfrm=$("form#formManageGroup_"+event.id).serializeArray();
	if(userid.length>0){
		if(grpid.length>0){
			var ids = addLoadingImage($("#saveManageBtn_"+event.id), "before");
			jQuery.ajax({
		        url: "/" + PROJECT_NAME + "bookmarks/assign-multiple-groups",
		        type: "POST",
		        dataType: "json",
		        data: { "groups" : grpsfrm,"user" : userid },
		        timeout: 50000,
		        success: function(jsonData) {
		        		$("span#"+ids).remove();
		        		if(jsonData.msg="success"){
		        			$("#tag-manage-outertags").css("display","none");
		        		}
		        		$(".alert-box").remove();
		        		$(".alert-box1").remove();
		        		$(".alert-box2").remove();
		        		showDefaultMsg( "Groups assigned.", 1 );
		        	},
		        error: function(xhr, ajaxOptions, thrownError) {
		        	alert("Server Error.");
				}
			 });
		}
		else{
			$("span#"+ids).remove();
			$(".alert-box").remove();
			$(".alert-box1").remove();
			$(".alert-box2").remove();
			showDefaultMsg( "To assign group, select at least one.", 2 );
		}
	}
	else{
		$("span#"+ids).remove();
		$(".msg-popup-outer").fadeToggle();
		$(".manage-pop-outer").fadeToggle();
		$(".alert-box").remove();
		$(".alert-box1").remove();
		$(".alert-box2").remove();
		showDefaultMsg( "Please select one user atleast.", 2 );
	}
}
/*************** bookmarks functions *******************/

/*************** links functions *******************/
/**
 * function used to get user created tags list
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function gettags(event){
	$(".closeNotesPopup").hide();
	var uid=event.id;
	var attr = $(event).attr('showShortProfileTags');
	if (typeof attr !== 'undefined' && attr !== false) {
		// ...... not going for server request...
		$("#tag-popup-outertags_"+uid).fadeToggle('slow');
	}
	else{
		// remove attribute onclick...
		$("[name="+event.name+"]").removeAttr("onclick");
		// ..... going for server request...
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "links/get-edit-tags",
	        type: "POST",
	        dataType: "json",
	        data: { "user_id" : uid },
	        timeout: 50000,
	        beforeSend: function(){
	        	// embed loading image file..
	        	$("#tag-popup_"+uid).empty();
	    		var loadingHtml = '<div id="loading" style="display:table-cell;width:170px;height:195px;text-align:center;vertical-align:middle;padding-left:0px;margin-top:89px;">';
	    		loadingHtml += '<img src="'+IMAGE_PATH+'/loading_medium_purple.gif">';
	    		loadingHtml += '</div>';
	    		$("#tag-popup_"+uid).append(loadingHtml);
	    		$("#tag-popup-outertags_"+uid).fadeToggle('slow');
	    	},
	        success: function(jsonData) {
	        	if(jsonData.length>0)
		        {
		        	$("#loading_"+uid).css("display","none");
		        	var html='';
			        	html+='<div class="tag-popup-top">';
			        	html+='<input style="width:95%;" maxlength="124" name="tagTxt_'+uid+'" id="tagTxt_'+uid+'" type="text" />';
			        	html+='<input name="tagBtn_'+uid+'" id="'+uid+'" type="button" value="+ Add Tag" class="btn-blue mt5 job-popup-btn" alt="+ Add Tag" title="+ Add Tag" onclick="addTag(this)" />';
			        	html+='</div>';
			        	html+='<form class="popupsTaglist" name="formTag_'+uid+'" id="formTag_'+uid+'" method="post" action="">';
			        	html+='<div class="tag-popup-mid">';
			        	var j=0;
			        	var chk="";
			        	for(var i=0;i<jsonData.length;i++){
			        		if(jsonData[i]["is_checked"]==1){
			        			var chk="checked";
			        		}else{
			        			var chk="";
			        		}
			        		
				        	html+='<div class="tag-popup-col1">';
				        	html+='<input name="tagChk[]" id="tagChk[]" type="checkbox" value="'+jsonData[i]["tag_id"]+'" '+chk+' />';
				        	var tTitle = jsonData[i]["tag_title"];
				        	if(tTitle.length>16){
				        		tTitle=tTitle.substr(0,16)+"...";
				        	}
				        	html+='<div class="tag-popup-col1-text">'+tTitle+'</div>';
				        	html+='</div>';	
				        	j++;
			        	}
			        	
			        	html+='</div>';
			        	html+='<div class="tag-popup-btn"><input name="saveBtn_'+uid+'" onclick="assignTags(this)" id="'+uid+'" type="button" value="Save" class=" btn-blue mt5 job-popup-save-btn" alt="Save" title="Save" />';
			        	html+='</form>';
			        	html+='</div>';
		        	$("[name="+event.name+"]").removeAttr('disabled');
		        	$("#tag-popup_"+uid).empty();
		        	$("#tag-popup_"+uid).append(html);
		        	$(".grouplist").css("display","block");
		        	$("#tag-popup_"+uid).css("height","auto");
		        	$(".popupsTaglist").fadeIn();
	        	}
	        	else
	        	{
	        		$(".tags-menu-listing-addnewTag").css("height","54px");
	        		var html='';
		        	html+='<div class="tag-popup-top">';
		        	html+='<input style="width:95%;" maxlength="124" name="tagTxt_'+uid+'" id="tagTxt_'+uid+'" type="text" />';
		        	html+='<input name="tagBtn_'+uid+'" id="'+uid+'" type="button" value="+ Add Tag" class="btn-blue mt5 job-popup-btn" alt="+ Add Tag" title="+ Add Tag" onclick="addTag(this)" />';
		        	html+='</div>';
		        	html+='<form class="popupsTaglist" name="formTag_'+uid+'" id="formTag_'+uid+'" method="post" action="" style="display:none;">';
		        	html+='<div class="tag-popup-mid">';
		        	
		        	html+='</div>';
		        	html+='<div class="tag-popup-btn"><input name="saveBtn_'+uid+'" onclick="assignTags(this)" id="'+uid+'" type="button" value="Save" class=" btn-blue mt5 job-popup-save-btn" alt="Save" title="Save" />';
		        	html+='</form>';
		        	html+='</div>';
		        	
		        	$("[name="+event.name+"]").removeAttr('disabled');
		        	$("#tag-popup_"+uid).empty();
		        	$("#tag-popup_"+uid).append(html);
		        	$("#tag-popup_"+uid).css("height","auto");
		        }
	        	// add attribute onclick...
	        	$("[name="+event.name+"]").attr("onclick","gettags(this);");
	        	$("[name="+event.name+"]").attr("showShortProfileTags","yes");
	        	
	        },
	        error: function(xhr, ajaxOptions, thrownError) {
	        	showDefaultMsg( "Unable to add group.Please try again.", 2 );   
			}
		 });
		
	}
}
/**
 * function used to add new tag
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function addTag(event){
	$('#span-tag').remove();
	var ids = addLoadingImage($("[name=tagBtn_"+event.id+"]"), "before");
	var title=$("#tagTxt_"+event.id).val();
	if(title!=""){
	$("[name=tagBtn_"+event.id+"]").attr('disabled','disabled');
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "links/add-new-tag",
        type: "POST",
        dataType: "json",
        data: { "title" : title },
        timeout: 50000,
        success: function(jsonData) {
        		var uID = $("#currentLoginUserID").val();
        		$("span#"+ids).remove();
        		$("[name=tagBtn_"+event.id+"]").removeAttr('disabled');
        		$("#tagTxt_"+event.id).val("");
        		if(jsonData=="exist"){
        			$('[name=tagBtn_'+event.id+']').before('<span class="spanmsg" id="span-tag">Already exist </span>');
        		}
        		else{
        			var tTitle = jsonData.title;
		        	if(tTitle.length>19){
		        		menuTitle=tTitle.substr(0,19)+"...";
		        		popTitle=tTitle.substr(0,16)+"...";
		        	}
		        	else{
		        		menuTitle=tTitle;
		        		popTitle=tTitle;
		        	}
		        	stTitle = tTitle.substr(0,124);
        			var html="";
        			html+='<div class="tag-popup-col1" style="margin:0 0 5px 0">';
        			html+='<input type="checkbox" name="groupChk[]" id="groupChk[]" value="'+jsonData.id+'">';
        			html+='<div class="tag-popup-col1-text">'+popTitle+'</div>';
        			html+='</div>';
	        		$(".tag-popup-mid").prepend(html);
	        		var html2="";
	        		html2+='<a id="menu_grp_'+jsonData.id+'" class="grp-listing" href="/'+PROJECT_NAME+'links/tag/id/'+jsonData.id+'">';
	        		html2+=menuTitle+'</a>';
	        		$("#grplisting").after(html2); 
	        		html3='';
	        		html3+='<div class="group-popup-col1" id="grp_'+jsonData.id+'">';
	        		html3+='<div class="editpop-cross">';
	        		html3+='<img align="absmiddle" height="8" src="/'+PROJECT_NAME+'public/images/cross-grey.png" grpid="'+jsonData.id+'" uid="'+uID+'" onclick="removeTg(this)" id="imggrp_'+jsonData.id+'">';
        			html3+='</div>';
    				html3+='<div class="group-popup-col1-text">';
					html3+='<span class="menu-span" title="Click to Rename it" style="padding-left:7px;background:none;" id="span_'+jsonData.id+'" rel="'+jsonData.id+'">'+popTitle+'</span>';
					html3+='<input type="text" class="menu-span2" style="width:115px;display:none;" id="txtgrp_'+jsonData.id+'" name="txtgrp_'+jsonData.id+'" rel="'+jsonData.id+'" value="'+jsonData.title+'" maxlength="124" onkeyup="assignGrpLabels(this)">';
					html3+='</div>';
					html3+='</div>';
					$("#grp-form").prepend(html3);
					$(".grouplist").fadeIn();
					$(".popupsTaglist").fadeIn();
					$(".tags-menu-listing-addnewTag").css("height","auto");
				}
            },
        error: function(xhr, ajaxOptions, thrownError) {
        	alert("Server Error.");
		}
	 });
	}
	else{
		$("span#"+ids).remove();
		$(".alert-box").remove();
		$(".alert-box1").remove();
		$(".alert-box2").remove();
		showDefaultMsg( "Please add text.", 2 );
	}
}
/**
 * function used to assign tags to the users
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function assignTags(event){
	
	$("[name=saveBtn_"+event.id+"]").attr('disabled','disabled');
	
	var ids = addLoadingImage($("[name=saveBtn_"+event.id+"]"), "before");
	var assign_tags=$("#formTag_"+event.id).serializeArray();
	var uid=event.id;
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "links/assign-tags",
        type: "POST",
        dataType: "json",
        data: { "user_id" : uid, "tags_arr" : assign_tags },
        timeout: 50000,
        success: function(jsonData) {
        	
            	$("span#"+ids).remove();
            	if(jsonData.msg=="success"){
            		$("[name=title]").val("");
            		$("[name=saveBtn_"+event.id+"]").removeAttr('disabled');
            		$("#tag-popup-outertags_"+uid).fadeToggle('slow');
            		$(".alert-box").remove();
	        		$(".alert-box2").remove();
	        		$(".alert-box1").remove();
	        		showDefaultMsg( "Tags assigned.", 1 );
            	}
            	else{
            		$("[name=saveBtn_"+event.id+"]").removeAttr('disabled');
            		$("[name=saveBtn_"+event.id+"]").before('<span class="spanmsg" id="span-msg" style="color:red;">Server Error</span>');
            	}
            },
        error: function(xhr, ajaxOptions, thrownError) {
        	alert("Server Error.");
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
	var ids = addLoadingImage($("[name=bookmark_"+uid+"]"), "after");
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
    		$("span#"+ids).remove();
        	if(event.rel){
        		$("[name=bookmark_"+uid+"]").addClass("text-grey2-link");
    			$("[name=bookmark_"+uid+"]").removeClass("text-grey2-link2");
    			$("[name=bookmark_"+uid+"]").attr("onclick","bookmarkProfile(this)");
    			$("[name=bookmark_"+uid+"]").html("Bookmark");
            	$("[name=bookmarkicon_"+uid+"]").removeAttr("rel");
            	$("[name=bookmarkicon_"+uid+"]").removeClass("bookmark-linked");
            	$("[name=bookmarkicon_"+uid+"]").attr("title","Bookmark Profile");
            	$("[name=bookmarkicon_"+uid+"]").addClass("bookmark-icon");
        		showDefaultMsg( "Unbookmarked successfully.", 1 );
    		}
    		else{
    			$("[name=bookmark_"+uid+"]").removeClass("text-grey2-link");
    			$("[name=bookmark_"+uid+"]").addClass("text-grey2-link2");
    			$("[name=bookmark_"+uid+"]").removeAttr("onclick");
    			$("[name=bookmark_"+uid+"]").html("Bookmarked");
            	$("[name=bookmarkicon_"+uid+"]").attr("rel","0");
            	$("[name=bookmarkicon_"+uid+"]").removeClass("bookmark-icon");
            	$("[name=bookmarkicon_"+uid+"]").attr("title","Remove Bookmark");
            	$("[name=bookmarkicon_"+uid+"]").addClass("bookmark-linked");
    			showDefaultMsg( "Bookmarked Successfully.", 1 );
    		}
        },
        error: function(xhr, ajaxOptions, thrownError) {
        	alert("Server Error.");
		}
	 });
	
}

/**
 * function used to unfriend the request
 * param: id is the link_requests primary key
 * @author Sunny patial
 * @version 1.0
 */
function unLink(linkId, profileId){
	
	$(".message_box").remove();

	showDialogMsg( 
			"Unlink from link list", 
			"Do you really want to remove this user from your link list?", 
			0,
			{
			    buttons: [
		        {
		            text: "Unlink",
		            click: function(){
						$( this ).dialog( "close" );
						__addOverlay();
						jQuery.ajax(
						{
							url: "/" + PROJECT_NAME + "profile/cancel-request",
							type: "POST",
					        dataType: "json",
					        data: "cancel_request="+linkId+"&profileID="+profileId,
					        success: function(jsonData) 
					        {
					        	__removeOverlay();
					        	$(".short-view-profile-popup").hide();
					        	$("#grid_"+profileId).fadeOut(1000,function() {
				        		$("#grid_"+profileId).remove();					        		
				        	});
				        	if (!$(".col4")[0])
				        	{
				        		__removeOverlay();
				        		$(".text-grey3").remove();
				        		$(".bookmark-search-right").remove();
				        		$(".linkprofile-outer").append('<div class="emptyRecordOuter"><div class="emptyRecordInner text-grey3"><p>No result found!</p></div></div>');
				        	} 	
				        	// for gridview..
				        	$("#user-status_"+profileId).empty();
				        	var html = '';
			        		html+='<a id="'+profileId+'" class="cursor-style invite_'+profileId+'" title="Invite to Link" href="javascript:;" onclick="inviteToLink(this)">';
			            	html+='<img src="'+IMAGE_PATH+'/invitation-request-icon.png" alt="Invite to Link"/>';
			            	html+='</a>';
			            	$("#user-status_"+profileId).html(html);
			            	// for user popup
			            	$("#statusIcon-"+profileId).empty();
			            	var html2 = '';
			            	html2+='<img src="'+IMAGE_PATH+'/small-invitation-request-icon.png" alt="Invite to Link"/>';
			            	$("#statusIcon-"+profileId).html(html2);
			            	// for user popup title
			            	$("#statusTitle-"+profileId).empty();
			            	var html3 = '';
			            	html3+='<a id="'+profileId+'" class="text-grey2-link cursor-style invite_'+profileId+'" title="Invite to Link" href="javascript:;" onclick="inviteToLink(this)">Invite to Link</a>';
			            	$("#statusTitle-"+profileId).html(html3);
				        	// hide textarea...
				        	$(".quickview-mid_"+profileId).slideUp();
				        	if(jsonData.requestStatus=="already canceled"){
			        		showDefaultMsg( "Already unlinked by "+jsonData.uname+".", 1 );
			        		}
				        	else
			        		{
				        		showDefaultMsg( "The link has been removed from your link list.", 1 );
			        		}
					        },
				        	error: function(xhr, ajaxOptions, thrownError) {
				        	}
						});
		            }
		        },
		        {
		        	text: "Cancel",
		        	class: 'only_text', 
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
		    dialogClass: "general_dialog_message shortProfileViewDialogs",
		    height: 200,
		    width: 300
		}
	);
}


/**
 * Makes an ajax call to block user.
 * @param integer $user_id [user to be blocked] 
 *
 * @return void
 * @author jsingh7
 * @version 1.0
 */
function blockUser( user_id )
{
	showDialogMsg( 
					"Block User", 
					"Page will refresh to apply settings.", 
					0,
					{
					    buttons: [
				        {
				            text: "Block",
				            click: function(){
				            	jQuery.ajax(
		            		 	{
		            		        url: "/" + PROJECT_NAME + "profile/block-user",
		            		        type: "POST",
		            		        dataType: "json",
		            		        data: { "user_to_be_blocked_id":user_id },
		            		        success: function(jsonData) 
		            		        {
		            		        	if( jsonData == 1 )
		            		        	{	
		            		        		location.reload();
		            		        	}
		            		        }
		            		 	});
				            }
				        },
				        {
				        	text: "Cancel",
				        	class: 'only_text', 
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
				    dialogClass: "general_dialog_message shortProfileViewDialogs",
				    height: 150,
				    width: 300
				}
			);
}

/**
 * function used to assign multiple groups
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function addBookmark(){
	var str = [];
    $("input[name='profile_chk[]']:checked").each(function(i){
    	str[i] = $(this).val();
     });
	if(str.length>0){
		var ids = addLoadingImage($("#addBookmark"), "after");
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "links/add-bookmark",
	        type: "POST",
	        dataType: "json",
	        data: { "bookmarks" : str },
	        timeout: 50000,
	        success: function(jsonData) {
	        		$("span#"+ids).remove();
	        		if(jsonData.msg="success"){
	        			$(".alert-box").remove();
	        			$(".alert-box1").remove();
	        			$(".alert-box2").remove();
	        			showDefaultMsg( "Profile bookmarked successfully.", 1 );
	        		}
	        		
	        	},
	        error: function(xhr, ajaxOptions, thrownError) {
	        	alert("Server Error.");
			}
		 });
	}
	else{
		$(".manage-pop-outer").fadeToggle();
		 $(".alert-box").remove();
		 $(".alert-box1").remove();
		 $(".alert-box2").remove();
		 showDefaultMsg( "Please select one user atleast.", 2 ); 
	}
}
/**
 * function used to get user created tags list
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function getManageTags(event){
	var uid=event.id;
	// $('span.spanmsg').remove();
	var attr = $(event).attr('manageProfileTags');
	if (typeof attr !== 'undefined' && attr !== false) {
		// ...... not going for server request...
		$("#tag-manage-outertags").fadeToggle('slow');
	}
	else{
		var userid = [];
	    $("input[name='profile_chk[]']:checked").each(function(i){
	    	userid[i] = $(this).val();
	     });
		// remove attribute onclick...
		$("[name="+event.name+"]").removeAttr("onclick");
		// ..... going for server request...
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "links/get-checked-tags",
	        type: "POST",
	        dataType: "json",
	        data: { "user_id" : userid },
	        timeout: 50000,
	        beforeSend: function(){
				$("#tag-manage_"+uid).empty();
	        	// embed loading image file..
	    		var loadingHtml = '<div id="loading" style="display:table-cell;width:170px;height:195px;text-align:center;vertical-align:middle;padding-left:0px;margin-top:89px;">';
	    		loadingHtml += '<img src="'+IMAGE_PATH+'/loading_medium_purple.gif">';
	    		loadingHtml += '</div>';
	    		$("#tag-manage_"+uid).append(loadingHtml);
	    		$("#tag-manage-outertags").fadeToggle('slow');
	    	},
	        success: function(jsonData) {
	        	if(jsonData.length>0)
		        {
		        	$("#loading_"+uid).css("display","none");
		        	var html='';
		        	html+='<div class="tag-manage-top">';
		        	html+='<input style="width:95%;"  maxlength="124" name="managegroupTxt_'+uid+'" id="managegroupTxt_'+uid+'" type="text" />';
		        	html+='<input name="managegroupBtn_'+uid+'" id="'+uid+'" type="button" value="+ Add Tag" class="btn-blue mt5 job-popup-btn" alt="+ Add Tag" title="+ Add Tag" onclick="addManageTag(this)" />';
		        	html+='</div>';
		        	html+='<form class="popupsTaglist" name="formManageGroup_'+uid+'" id="formManageGroup_'+uid+'" method="post" action="">';
		        	html+='<div class="tag-manage-mid">';
		        	var j=0;
		        	for(var i=0;i<jsonData.length;i++){
		        		
			        	html+='<div class="tag-popup-col1" style="margin:0 0 5px 0">';
			        	if(jsonData[i]["type"]=="checked"){
		        			html+='<input name="groupChk[]" id="groupChk[]" type="checkbox" value="'+jsonData[i]["tag_id"]+'" checked="checked" />';
		        		}
		        		else{
		        			html+='<input name="groupChk[]" id="groupChk[]" type="checkbox" value="'+jsonData[i]["tag_id"]+'" />';
		        		}
			        	var tTitle = jsonData[i]["tag_title"];
			        	if(tTitle.length>16){
			        		tTitle=tTitle.substr(0,16)+"...";
			        	}
			        	// html+='<input name="groupChk[]" id="groupChk[]" type="checkbox" value="'+jsonData[i]["tag_id"]+'" />';
			        	html+='<div class="tag-popup-col1-text">'+tTitle+'</div>';
			        	html+='</div>';	
			        	j++;
		        	}
		        	
		        	html+='</div>';
		        	html+='<div class="tag-manage-btn"><input name="saveManageBtn_'+uid+'" onclick="assignTagsToUser(this)" id="'+uid+'" type="button" value="Save" class=" btn-blue mt5 job-popup-save-btn" alt="Save" title="Save" />';
		        	html+='</form>';
		        	html+='</div>';
					
		        	$("[name="+event.name+"]").removeAttr('disabled');
		        	$("#tag-manage_"+uid).empty();
		        	$("#tag-manage_"+uid).append(html);
		        	$(".grouplist").css("display","block");
		        	$("#tag-manage_"+uid).css("height","auto");
		        	$(".popupsTaglist").fadeIn();
	        	}
	        	else
	        	{
	        		$(".tags-menu-listing-addnewTag").css("height","54pspan_33x");
	        		var html='';
		        	html+='<div class="tag-manage-top">';
		        	html+='<input style="width:95%;"  maxlength="124" name="managegroupTxt_'+uid+'" id="managegroupTxt_'+uid+'" type="text" />';
		        	html+='<input name="managegroupBtn_'+uid+'" id="'+uid+'" type="button" value="+ Add Tag" class="btn-blue mt5 job-popup-btn" alt="+ Add Tag" title="+ Add Tag" onclick="addManageTag(this)" />';
		        	html+='</div>';
		        	html+='<form class="popupsTaglist" name="formManageGroup_'+uid+'" id="formManageGroup_'+uid+'" method="post" action="" style="display:none;">';
		        	html+='<div class="tag-manage-mid">';
		        	
		        	html+='</div>';
		        	html+='<div class="tag-manage-btn"><input name="saveManageBtn_'+uid+'" onclick="assignTagsToUser(this)" id="'+uid+'" type="button" value="Save" class=" btn-blue mt5 job-popup-save-btn" alt="Save" title="Save" />';
		        	html+='</form>';
		        	html+='</div>';
		        	
		        	$("[name="+event.name+"]").removeAttr('disabled');
		        	$("#tag-manage_"+uid).empty();
		        	$("#tag-manage_"+uid).append(html);
		        	$("#tag-manage_"+uid).css("height","auto");
		        }
	        	// add attribute onclick...
	        	$("[name="+event.name+"]").attr("onclick","getManageTags(this);");
	        	$("[name=manageETag]").attr("manageProfileTagss","yes");
	        	
	        },
	        error: function(xhr, ajaxOptions, thrownError) {
	        	showDefaultMsg( "Unable to add tag.Please try again.", 2 );   
			}
		 });
		
	}
}
/**
 * function used to add new group
 * Author: Sunny Patial
 * Date: 20,Aug 2013
 * version: 1.0
 */
function addManageTag(event){
	$('#span-tag').remove();
	var ids = addLoadingImage($("[name=managegroupBtn_"+event.id+"]"), "before");
	var title=$("#managegroupTxt_"+event.id).val();
	if(title != "")
		{
	$("[name=managegroupBtn_"+event.id+"]").attr('disabled','disabled');
	
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "links/add-new-tag",
        type: "POST",
        dataType: "json",
        data: { "title" : title },
        timeout: 50000,
        success: function(jsonData) {
        		var uID = $("#currentLoginUserID").val();
        		$("span#"+ids).remove();
        		$("[name=managegroupBtn_"+event.id+"]").removeAttr('disabled');
        		$("#managegroupTxt_"+event.id).val("");
        		if(jsonData=="exist"){
        			$('[name=managegroupBtn_'+event.id+']').before('<span class="spanmsg" id="span-tag">Already exist </span>');
        		}
        		else{
        			var tTitle = jsonData.title;
		        	if(tTitle.length>19){
		        		menuTitle=tTitle.substr(0,19)+"...";
		        		popTitle=tTitle.substr(0,16)+"...";
		        	}
		        	else{
		        		menuTitle=tTitle;
		        		popTitle=tTitle;
		        	}
		        	stTitle = tTitle.substr(0,124);
        			var html="";
        			html+='<div class="tag-popup-col1" style="margin:0 0 5px 0">';
        			html+='<input type="checkbox" name="groupChk[]" id="groupChk[]" value="'+jsonData.id+'">';
        			html+='<div class="tag-popup-col1-text">'+popTitle+'</div>';
        			html+='</div>';
	        		$(".tag-popup-mid").prepend(html);
	        		var html4="";
	    			html4+='<div class="tag-popup-col1" style="margin:0 0 5px 0px">';
	    			html4+='<input type="checkbox" name="groupChk[]" id="groupChk[]" value="'+jsonData.id+'">';
	    			html4+='<div class="tag-popup-col1-text">'+popTitle+'</div>';
	    			html4+='</div>';
	        		$(".tag-manage-mid").prepend(html4);
	        		var html2="";
	        		html2+='<a id="menu_grp_'+jsonData.id+'" class="grp-listing" href="/'+PROJECT_NAME+'links/tag/id/'+jsonData.id+'">';
	        		html2+=menuTitle+'</a>';
	        		$("#grplisting").after(html2); 
	        		html3='';
	        		html3+='<div class="group-popup-col1" id="grp_'+jsonData.id+'">';
	        		html3+='<div class="editpop-cross">';
	        		html3+='<img align="absmiddle" height="8" src="/'+PROJECT_NAME+'public/images/cross-grey.png" grpid="'+jsonData.id+'" uid="'+uID+'" onclick="removeTg(this)" id="imggrp_'+jsonData.id+'">';
        			html3+='</div>';
    				html3+='<div class="group-popup-col1-text">';
					html3+='<span class="menu-span" title="Click to Rename it" style="padding-left:7px;background:none;" id="span_'+jsonData.id+'" rel="'+jsonData.id+'">'+popTitle+'</span>';
					html3+='<input type="text" class="menu-span2" style="width:115px;display:none;" id="txtgrp_'+jsonData.id+'" name="txtgrp_'+jsonData.id+'" rel="'+jsonData.id+'" value="'+jsonData.title+'" maxlength="124" onkeyup="assignGrpLabels(this)">';
					html3+='</div>';
					html3+='</div>';
					$("#grp-form").prepend(html3);
					$(".grouplist").fadeIn();
        		}
            },
        error: function(xhr, ajaxOptions, thrownError) {
        	alert("Server Error.");
		}
	 });
		}
	else{
		$("span#"+ids).remove();
		$(".alert-box").remove();
		$(".alert-box1").remove();
		$(".alert-box2").remove();
		showDefaultMsg( "Please add text.", 2 );
	}
}
/**
 * function used to assign multiple tags users
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function assignTagsToUser(event){
	var userid = [];
    $("input[name='profile_chk[]']:checked").each(function(i){
    	userid[i] = $(this).val();
     });
    var grpid = [];
    $("input[name='groupChk[]']:checked").each(function(i){
    	grpid[i] = $(this).val();
     });
	var grpsfrm=$("form#formManageGroup_"+event.id).serializeArray();
	if(userid.length>0){
		
		if(grpid.length>0){
			var ids = addLoadingImage($("[name=saveManageBtn_"+event.id+"]"), "before");
			//var ids = addLoadingImage($("#saveManageBtn_"+event.id), "before");
			jQuery.ajax({
		        url: "/" + PROJECT_NAME + "links/assign-multiple-tags",
		        type: "POST",
		        dataType: "json",
		        data: { "tags_arr" : grpsfrm,"user" : userid },
		        timeout: 50000,
		        success: function(jsonData) {
		        		$("span#"+ids).remove();
		        		if(jsonData.msg="success"){
		        			$("#tag-manage-outertags").fadeToggle('slow');
		        			$(".alert-box").remove();
		        			$(".alert-box1").remove();
		        			$(".alert-box2").remove();
		        			showDefaultMsg( "Tags assigned.", 1 );
		        		}
		        	},
		        error: function(xhr, ajaxOptions, thrownError) {
		        	alert("Server Error.");
				}
			 });
		}
		else{
			$(".alert-box").remove();
			$(".alert-box1").remove();
			$(".alert-box2").remove();
			showDefaultMsg( "To assign tag, select at least one.", 2 );
		}
	}
	else{
		$(".msg-popup-outer").fadeToggle();
		$(".manage-pop-outer").fadeToggle();
		$( "#dialog_confirm" ).dialog({
		      modal: true,
		      width: 306,
		      show: {
		    	  effect: "fade"
		    	  },
			  hide: {
				  effect: "fade"
				  },
		      buttons: {
		        'ok': function() {
		        	$( this ).dialog( "close" );
		        }
		      }
		});
		$(".alert-box").remove();
		$(".alert-box1").remove();
		$(".alert-box2").remove();
		showDefaultMsg( "Please select one user atleast.", 2 );
	}
}
/**
 * function used to remove tag links
 * param: id is the link_requests primary key
 * Author: Sunny patial
 * version: 1.0
 */
function removeTagLink(profileId){
	$(".alert-box").remove();
	$(".alert-box1").remove();
	$(".alert-box2").remove();
	var tagID=$("#tagID").val();
	var iddd = addLoadingImage($("#delete_"+profileId), "after");
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "links/remove-links-tag",
        type: "POST",
        dataType: "json",
        data: "profileID="+profileId+"&tagID="+tagID,
        success: function(jsonData) {
        	if(jsonData.msg=="success"){
        		$("span#"+iddd).remove();
            	showDefaultMsg( "Removed from Tag successfully.", 1 );
            	$("#col1_"+profileId).remove();
            	if (!$(".userTagLinks")[0]){
            		$(".text-grey3").remove();
            		$(".bookmark-search-right").remove();
            		$(".linkprofile-outer").append('<div class="emptyRecordOuter"><div class="emptyRecordInner text-grey3"><p>No result found!</p></div></div>');
            	} 
        	}
     	},
        error: function(xhr, ajaxOptions, thrownError) {
        	alert("Server Error.");
		}
    });
}
function removeFromTag(){
	var tagID=$("#tagID").val();
	var str = [];
	$("input[name='profile_chk[]']:checked").each(function(i){
    	str[i] = $(this).val();
     });
	if(str.length>0){
		var ids = addLoadingImage($("#remBookmark"), "after");
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "links/remove-from-tag",
	        type: "POST",
	        dataType: "json",
	        data: { "profileID" : str,"tagID":tagID },
	        timeout: 50000,
	        success: function(jsonData) {
	        		$("span#"+ids).remove();
	        		$(".manage-pop").fadeOut("slow");
	        		$(".manage-pop").fadeOut("slow");
					$(".short-view-profile-popup").hide();
					for(var i=0;i<str.length;i++){
						// $("#grid_"+str[i]).fadeOut(1000,function() {
							$("#grid_"+str[i]).remove();					        		
						// });
					}
		        	if (!$(".col4")[0])
		        	{
		        		$(".text-grey3").remove();
		        		$(".bookmark-search-right").remove();
		        		$(".linkprofile-outer").append('<div class="emptyRecordOuter"><div class="emptyRecordInner text-grey3"><p>No result found!</p></div></div>');
		        	} 
	        		$(".alert-box").remove();
	        		$(".alert-box1").remove();
	        		$(".alert-box2").remove();
	        		showDefaultMsg( "Removed from Tag successfully.", 1 );
	        	},
	        error: function(xhr, ajaxOptions, thrownError) {
	        	alert("Server Error.");
			}
		 });
	}
	else{
		$(".manage-pop-outer").fadeToggle();
		$( "#dialog_confirm" ).dialog({
		      modal: true,
		      width: 306,
		      show: {
		    	  effect: "fade"
		    	  },
			  hide: {
				  effect: "fade"
				  },
		      buttons: {
		        'ok': function() {
		        	$( this ).dialog( "close" );
		        }
		      }
		});
	}
}
/*************** links functions *******************/

//Hidding post comment popup on out click.
$(document).mouseup(function (e)
{
	var container = $("div.quickview-outer");
	var secondContainer = $("div.ui-dialog");
	if (!container.is(e.target) && !secondContainer.is(e.target) // if the target of the click isn't the container...
			&& container.has(e.target).length === 0 && secondContainer.has(e.target).length === 0) // ... nor a descendant of the container
	{
		$(".quickview-outer").removeAttr("visibility");
		container.hide();
		// remove style attribute from gridview and image
		$(".col4").removeAttr('style');
		$(".userProfileImage").removeAttr('style');
		
		$(".you-may-know-img-outer").css("border","1px solid #C0C0C0");
		$("div.short_profile_border").css("border", "1px solid #CCCCCC");
	}
});

/******* Quick view Profile *******/
function quickViewProfile(){
	if(!elemt.attr("popupcontent")){
		var jobid=$("#jobId").val();
		return;
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "links/get-tooltip",
	        type: "POST",
	        dataType: "json",
	        data: { "user_id" : $(elem).attr("id"),"jobid" : jobid },
	        timeout: 50000,
	        success: function(jsonData) 
	        {
	        	getUserInfo(elem, jsonData, jsonParameters);
	        	$("#download-popup").hide();
	        },
	        error: function(xhr, ajaxOptions, thrownError) {
	        	alert("An error occured! We will fix this soon.");
			}
		 });	
	}
	else{
		// fade in fade out...
	}
}
