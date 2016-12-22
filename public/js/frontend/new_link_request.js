//Show tooltip functionality----
$(document).ready(function(){

	$( document ).on( 'keydown', function ( e ) {
	    if ( e.keyCode === 27 ) {
	    	$(".quickview-outer").hide();
	    }
	});
	$("#tag-manage-outertags").on("click", function(e){
		$(".msg-popup-outer").fadeOut();
		});
	$(".msg-popup-outer").on("click", function(e){
		$("#tag-manage-outertags").fadeOut();
		});
});


/**
 * function used to get tooltip popup
 * Author: Shaina
 * Date: 5,Aug 2013
 * version: 1.0
 */
function getRequestTooltip(elem)
{
	$(".spanmsg").remove();
	if($("#invitation_"+$(elem).attr("id")).attr("popup-state")=="off"){
		$(".mail-sendmsg-col2").attr("popup-state","off");
		$("#invitation_"+$(elem).attr("id")).attr("popup-state","on");
		$(".mail-sendmsg-col2").hide();
		$("#invitation_"+$(elem).attr("id")).fadeIn('slow');
		var imghtml="";
		imghtml+='<div style="display:table-cell;width:527px;height:560px;text-align:center;vertical-align:middle;">';
		imghtml+='<img src="/'+PROJECT_NAME+'public/images/loading_large_purple.gif" />';
		imghtml+='</div>';
		$(".left_"+$(elem).attr("id")).append(imghtml);
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "links/get-tooltip",
	        type: "POST",
	        dataType: "json",
	        data: { "user_id" : $(elem).attr("id") },
	        timeout: 50000,
	        success: function(jsonData) {
	        	getUserInfo(elem,jsonData);
	        },
	        error: function(xhr, ajaxOptions, thrownError) {
				//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			}
		 });
	}
	else{
		$(".mail-sendmsg-col2").hide();
		$("#invitation_"+$(elem).attr("id")).attr("popup-state","off");
	}
	
   
}
/**
 * function used to get tooltip popup for bookmarked profile
 * Author: Shaina Gandhi
 * Date: 5,Aug 2013
 * version: 1.0
 */
function getTooltips(elem)
{
	//$("#download-popup").fadeToggle();
	$(".spanmsg").remove();
	if($("#view-outer_"+$(elem).attr("id")).attr("popup-state")=="off"){
		$(".quickview-outer").attr("popup-state","off");
		$("#view-outer_"+$(elem).attr("id")).attr("popup-state","on");
		$(".quickview-outer").hide();
		$("#view-outer_"+$(elem).attr("id")).fadeIn('slow');
		var imghtml="";
		imghtml+='<div style="display:table-cell;width:527px;height:560px;text-align:center;vertical-align:middle;">';
		imghtml+='<img src="/'+PROJECT_NAME+'public/images/loading_large_purple.gif" />';
		imghtml+='</div>';
		$("#view_"+$(elem).attr("id")).append(imghtml);
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "links/get-tooltip",
	        type: "POST",
	        dataType: "json",
	        data: { "user_id" : $(elem).attr("id") },
	        timeout: 50000,
	        success: function(jsonData) {
	        	getUserInfo(elem,jsonData);
	        	$("#download-popup").hide();
	        },
	        error: function(xhr, ajaxOptions, thrownError) {
				//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			}
		 });
	}
	else{
		$(".quickview-outer").hide();
		$("#view-outer_"+$(elem).attr("id")).attr("popup-state","off");
	}
	
   
}

/**
 * function used to get user information
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function getUserInfossss(elem,jsonData){
	
	$(".tag-popup-outer").remove();
	$("#view_"+$(elem).attr("id")).html('');
	$("[name=txtmsg]").val("");
	if(jsonData.bookmark_status==0){
		var bookMarktxt="Bookmark";
		var bookmarkprop='  onclick="bookmarkProfile(this)"';
	}
	else{
		var bookMarktxt="Bookmarked";
		var bookmarkprop='';
	}
	
	if(jsonData.jobseeker_display_flag==1 )
	{
		var flag_img = "/"+PROJECT_NAME+"public/images/icon-flag.png";
	}
	else
	{
		var flag_img = "/"+PROJECT_NAME+"public/images/icon-flag_faded.png";
	}
	if(jsonData.Abused_report==0)
	{
		var abusetxt="Report Abuse";
		var abuseprop=' onclick="sendAbuseReport(this)"';
	}
	else
	{
		var abusetxt="Already report abused";
		var abuseprop=' ';
	}
	
		var img = "/"+PROJECT_NAME+"public/images/arrow-purple2.png";
		var html="";
		html+='<div class="download">';
	   	html+='<a href="javascript:;"><img alt="Download" title="Download" src="/'+PROJECT_NAME+'public/images/icon-download2.png" width="29" height="27" onclick="download();"/></a>';
		
	   	html+='<div class="download-pop">';
	   	html+='<div style="right:-102px; top:0;" class="tag-popup-outer" id="download-popup">';
	   	html+='<div class="tag-popup-arrow2">';
	   	html+='<img src="/'+PROJECT_NAME+'public/images/arrow-popup.png" width="26" height="16" />';
	   	html+='</div>';
	   	html+='<div class="tag-popup">';
	   	html+='<div class="tag-popup-top2">';
	   	html+='<h4>Download Profile</h4>';
	   	html+='</div>';
	   	html+='<div class="tag-popup-mid">';
	   	
	   	html+='<div class="tag-popup-col1">';
	   	html+='<input name="" type="checkbox" value="" />';
	   	html+='<div class="tag-popup-col1-text">All</div>';
	   	html+='</div>';
	   	
	   	html+='<div class="tag-popup-col1">';
	   	html+='<input name="" type="checkbox" value="" />';
	   	html+='<div class="tag-popup-col1-text">Contact detail</div>';
	   	html+='</div>';
	   	
	   	html+='<div class="tag-popup-col1">';
	   	html+='<input name="" type="checkbox" value="" />';
	   	html+='<div class="tag-popup-col1-text">Basic information</div>';
	   	html+='</div>';
	   	
	   	html+='<div class="tag-popup-col1">';
	   	html+='<input name="" type="checkbox" value="" />';
	   	html+='<div class="tag-popup-col1-text">Summary</div>';
	   	html+='</div>';
	   	
	   	html+='<div class="tag-popup-col1">';
	   	html+='<input name="" type="checkbox" value="" />';
	   	html+='<div class="tag-popup-col1-text">Experience</div>';
	   	html+='</div>';
	   	
	   	html+='<div class="tag-popup-col1">';
	   	html+='<input name="" type="checkbox" value="" />';
	   	html+='<div class="tag-popup-col1-text">Education</div>';
	   	html+='</div>';
	   	
	   	html+='<div class="tag-popup-col1">';
	   	html+='<input name="" type="checkbox" value="" />';
	   	html+='<div class="tag-popup-col1-text">Skills</div>';
	   	html+='</div>';
	   	
	   	html+='<div class="tag-popup-col1">';
	   	html+='<input name="" type="checkbox" value="" />';
	   	html+='<div class="tag-popup-col1-text">Projects</div>';
	   	html+='</div>';
	   	
	   	html+='<div class="tag-popup-col1">';
	   	html+='<input name="" type="checkbox" value="" />';
	   	html+='<div class="tag-popup-col1-text">Languages</div>';
	   	html+='</div>';
	   	
	   	html+='</div>';
	   	html+='<div class="tag-popup-btn">';
	   	html+='<input name="" type="button" value="Save" class=" btn-blue mt5" alt="Save" title="Save" />';
	   	html+='</div>';
	   	html+='</div>';
	   	html+='</div>';
	   	html+='</div>';
	   	
	   	
	   	html+='</div>';
		html+='<div class="quickview-top">';
		html+='<div class="quickview-top-left">';
		html+='<img src="/'+PROJECT_NAME+'public/images/quick-profile.png" width="26" height="53" />';
		html+='</div>';
		html+='<div class="quickview-top-right">';
		html+='<div class="left">';
		html+='<div style="width:90px;height:90px;display:table-cell;vertical-align:middle;text-align:center;">';
		html+='<img src="'+jsonData.profile_image+'" style="max-width:90px;max-height:90px;" />';
		html+='</div>';
		html+='<h5>';
		html+='<a target="_blank" class="text-purple-link" href="/'+PROJECT_NAME+'profile/iprofile/id/'+jsonData.profile_id+'">View Full Profile</a>';
		html+='</h5>';
		html+='<p>';
		html+='<img src="/'+PROJECT_NAME+'public/images/icon-notes2.png" width="18" height="18" align="absmiddle" />';
		html+='<a class="text-grey2-link" href="javascript:;" id="'+jsonData.profile_id+'" onclick="getNotes(this);">Notes</a>';
		html+='</p>';
		
		html+='<!-- Notes Popup Starts -->';
		html+='<div class="notes-popup-outer" id="displayNotes" style="display:none;">';
		html+='<div class="notes-popup-top">';
		html+='<img src="images/arrow-popup.png" width="26" height="16" />';
		html+='</div>';
		html+='<div class="notes-popup-bot">';
		html+='<h4>ADD NOTE</h4>';
		html+='<textarea name="note_'+jsonData.profile_id+'" id="note_'+jsonData.profile_id+'" cols="" rows="8"></textarea>';
		html+='<div class="common-div">';
		html+='<div class="fl">';
		html+='<a class="text-purple-link" href="javascript:;" id="'+jsonData.profile_id+'" name="discardNote_'+jsonData.profile_id+'" onclick="discardNote(this);">Discard</a>';
		html+='</div>';
		html+='<div class="fr">';
		html+='<a class="text-purple-link" href="javascript:;" id="'+jsonData.profile_id+'" name="saveNote_'+jsonData.profile_id+'" onclick="saveNote(this)">Save Changes</a>';
		html+='</div>';
		html+='</div>';
		html+='</div>';
		html+='</div>';
		html+='<!-- Notes Popup Ends -->';
		 
		html+='</div>';
		html+='<div class="right">';
		html+='<h3>'+jsonData.full_name+'</h3>';
		html+='<div class="toplinks">';
		html+='<div class="col1">';
		html+='<img src='+flag_img+' width="15" height="16" align="absmiddle" id="joobseeker_'+jsonData.profile_id+'"/>'; 
		
		html+='<a class="text-grey2-link"  href="javascript:;" id="joobseeker_'+jsonData.profile_id+'" >Job Seeker</a>';
		html+='</div>';
		html+='<div class="col1">';
		html+='<img src="/'+PROJECT_NAME+'public/images/icon-connection.png" width="16" height="15" align="absmiddle" />';
		html+='<a target="_blank" class="text-grey2-link" href="/'+PROJECT_NAME+'links/index/id/'+jsonData.profile_id+'">View Their Links</a>';
		html+='</div>';
		html+='<div class="col1">';
		html+='<img src="/'+PROJECT_NAME+'public/images/icon-pencil3.png" width="17" height="17" align="absmiddle" />';
		html+='<a href="javascript:;" class="text-grey2-link" id="'+$(elem).attr("id")+'" onclick="gettags(this);">Tags</a>';
		html+='</div>';
		
		html+='<div class="bookmarks-withline">';
		html+='<div id="tag-popup-outertags" class="tag-popup-outer" style="display:none;">';
		html+='<div class="tag-popup-arrow">';
		html+='<img src="/'+PROJECT_NAME+'public/images/arrow-popup.png" width="26" height="16" />';
		html+='</div>';
		html+='<div class="tag-popup" id="tag-popup_'+jsonData.profile_id+'">';
		html+='<div id="loading_'+jsonData.profile_id+'" style="display:table-cell;width:170px;height:195px;text-align:center;vertical-align:middle;">';
		html+='<img src="/'+PROJECT_NAME+'public/images/loading_medium_purple.gif" />';
		html+='</div>';
		// tag popup display here....
		html+='</div>';
		html+='</div>';
		html+='</div>';
		
		html+='</div>';
		html+='<div class="botlinks">';
		html+='<div class="col1">';
		html+='<img src="/'+PROJECT_NAME+'public/images/icon-telephone.png" width="14" height="14" align="absmiddle" />';
		if(jsonData.profile_phone!= null){
			html+='<a class="text-grey2-link" href="javascript:;">'+jsonData.profile_phone+'</a>';
			}else{
			html+='<a class="text-grey2-link" href="javascript:;">Not Available</a>';	
			}
		html+='</div>';
		html+='<div class="col1">';
		html+='<img src="/'+PROJECT_NAME+'public/images/mail.png" width="16" height="13" align="absmiddle" /><a class="text-grey2-link" href="javascript:;">'+jsonData.profile_email+'</a>';
		html+='</div>';
		html+='<div class="col1">';
		html+='<img src="/'+PROJECT_NAME+'public/images/icon-profile.png" width="15" height="16" align="absmiddle" />';
		html+='<a class="text-grey2-link" href="javascript:;">http://'+PROJECT_NAME+'profile/iprofile/id/'+jsonData.profile_id+'</a>';
		html+='</div>';
		html+='</div>';
		html+='</div>';
		html+='</div>';
		html+='</div>';
		html+='<div class="quickview-mid">';
		html+='<div class="quickview-mid-left">';
		html+='<img src="/'+PROJECT_NAME+'public/images/quick-mail.png" width="26" height="53" />';
		html+='</div>';
		html+='<div class="quickview-mid-right">';
		html+='<h3>Send A Message</h3>';
		html+='<p>';
		html+='<div id="win-xp2">';
		if(jsonData.link_list==true){
		html+='<select name="msg_type_'+jsonData.profile_id+'" id="msg_type_'+jsonData.profile_id+'">';
		html+='<option value="0">Select message type</option>';
		html+='<option value="Email message">Email message</option>';
		html+='<option value="Request Support">Request Support</option>';
		html+='<option value="Request Feedback">Request Feedback</option>';
		html+='<option value="Request Reference">Request Reference</option>';
		html+='<option value="Send job invitation">Send job invitation</option>';
		html+='</select>';
		}else{
		html+='<select name="msg_type_'+jsonData.profile_id+'" id="msg_type_'+jsonData.profile_id+'">';
		html+='<option value="0">Select message type</option>';
		html+='<option value="Email message">Email message</option>';
		html+='<option value="Request introduction">Request introduction</option>';
		html+='<option value="Link Request">Link Request</option>';
		html+='<option value="Send job invitation">Send job invitation</option>';
		html+='</select>';
		}
		html+='</div>';
		html+='</p>';
		html+='<p>';
		html+='<textarea name="txtmsg" id="txtmsg_'+jsonData.profile_id+'" cols="" rows="7"></textarea>';
		html+='</p>';
		html+='<p style="text-align: right">';
		html+='<input type="button" value="Save" class="btn-blue" title="Save" alt="Save" name="sendMsg_'+jsonData.profile_id+'" id="'+jsonData.profile_id+'" onclick="sendMsg(this)">';
		html+='</p>';
		html+='</div>';
		html+='</div>';
		html+='<div class="quickview-bot">';
		html+='<div class="quickview-bot-left">';
		html+='<img src="/'+PROJECT_NAME+'public/images/quick-links.png" width="26" height="54" />';
		html+='</div>';
		html+='<div class="quickview-bot-right">';
		html+='<h3>Manage followers</h3>';
		html+='<div class="col1">&nbsp;';
		html+='</div>';
		html+='<div class="col1">';
		html+='<img src="/'+PROJECT_NAME+'public/images/icon-star-purple.png" width="16" height="16" align="absmiddle" />';
		html+='<input type="hidden" name="bookmark-status_'+jsonData.profile_id+'" id="bookmark-status_'+jsonData.profile_id+'" value="'+jsonData.bookmark_status+'" />';
		html+='<a class="text-grey2-link" name="bookmark_'+jsonData.profile_id+'" id="'+jsonData.profile_id+'" href="javascript:;" '+bookmarkprop+'>'+bookMarktxt+'</a>';
		html+='</div>';
		html+='<div class="col1">';
		html+='<img src="/'+PROJECT_NAME+'public/images/icon-abuse-purple.png" width="16" height="16" align="absmiddle" />';
		html+='<a name="abuse_'+jsonData.profile_id+'" class="text-grey2-link" href="javascript:;" id="'+jsonData.profile_id+'" '+abuseprop+'>'+abusetxt+'</a>';
		html+='</div>';
		html+='<div class="col1">';
		html+='<img src="/'+PROJECT_NAME+'public/images/icon-trash-hover.png" width="14" height="16" align="absmiddle" />';
		html+='<a class="text-grey2-link" id="delete_'+jsonData.profile_id+'" href="javascript:;" onclick="deleteRecentlyViewed('+jsonData.profile_id+')">Delete</a>';
		html+='</div>';
		html+='</div>';
		html+='</div>';
		$("#view_"+jsonData.profile_id).append(html);
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
	var ids = addLoadingImage($("[name=sendMsg_"+event.id+"]"), "before");
	var txt=$("#txtmsg_"+event.id).val();
	var msg_type=$("#msg_type_"+event.id).val();
	var uid=event.id;
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "links/sent-message",
        type: "POST",
        dataType: "json",
        data: { "user_id" : uid, "msg" : txt,"msg_type" :msg_type },
        timeout: 50000,
        success: function(jsonData) {
        	$("span#"+ids).remove();
        	if(jsonData.msg=="success"){
        		$("[name=txtmsg]").val("");
        		$("[name=sendMsg_"+event.id+"]").removeAttr('disabled');
        		$("[name=sendMsg_"+event.id+"]").before('<span class="spanmsg" id="span-sendmsg">Congrats! message sent successfully..</span>');
        	}
        	else{
        		$("[name=sendMsg_"+event.id+"]").removeAttr('disabled');
        		$("[name=sendMsg_"+event.id+"]").before('<span class="spanmsg" id="span-sendmsg" style="color:red;">Due to server problem we can not send message.</span>');
        	}
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
	var ids = addLoadingImage($("[name=bookmark_"+uid+"]"), "after");
	var changeStatus=1;
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "links/bookmark-status",
        type: "POST",
        dataType: "json",
        data: { "user_id" : uid, "status" : changeStatus },
        timeout: 50000,
        success: function(jsonData) {
        	$("[name=bookmark_"+uid+"]").removeAttr("onclick");
        	$("span#"+ids).remove();
        	$("[name=bookmark_"+uid+"]").html("Bookmarked");
        },
        error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
		}
	 });
	
}
/**
 * function used to delete recently viewed users
 * Author: Shaina
 * Date: 16,Aug 2013
 * version: 1.0
 */



   
/**
 * function used to delete recently viewed users
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function deleteRecentlyViewed(uid){
	//if ($('input#check_' + uid).is(':checked')) {
		//alert($('input#check_' + uid));
//	alert(uid);
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "links/delete-recently-viewed-profile",
        type: "POST",
        dataType: "json",
        data: { "user_id" : uid },
        timeout: 50000,
        success: function(jsonData) {
        	
        	
        	$("#view_"+uid).fadeOut("slow");
        	$("#arrow-first").fadeOut("slow");
        	$("#col1_"+uid).fadeOut("slow");
        
        	
        	return false;
        },
        error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
		}
	 });
	//}
}
/**
 * function used to get user created tags list
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function gettags(event){
	//$("#download-popup").fadeOut();
	$(".tag-popup-top").remove();
	$(".tag-popup-mid").remove();
	$(".tag-popup-btn").remove();
	$("#formTag_"+event.id).remove();
	var uid=event.id;
	$("#tag-popup-outertags").fadeToggle('slow',function(){
		if($("#tag-popup-outertags").is(':visible')){
			jQuery.ajax({
		        url: "/" + PROJECT_NAME + "links/get-edit-tags",
		        type: "POST",
		        dataType: "json",
		        data: { "user_id" : uid },
		        timeout: 50000,
		        success: function(jsonData) {
		        	$("#loading_"+uid).remove();
		        	var html='';
		        	html+='<div class="tag-popup-top">';
		        	html+='<input style="width:95%;" name="tagTxt_'+uid+'" id="tagTxt_'+uid+'" type="text" />';
		        	html+='<input name="tagBtn_'+uid+'" id="'+uid+'" type="button" value="Add Tag" class="btn-blue mt5" alt="Add Tag" title="Add Tag" onclick="addTag(this)" />';
		        	html+='</div>';
		        	html+='<form name="formTag_'+uid+'" id="formTag_'+uid+'" method="post" action="">';
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
			        	html+='<div class="tag-popup-col1-text">'+jsonData[i]["tag_title"]+'</div>';
			        	html+='</div>';	
			        	j++;
		        	}
		        	
		        	html+='</div>';
		        	html+='<div class="tag-popup-btn"><input name="saveBtn_'+uid+'" onclick="assignTags(this)" id="'+uid+'" type="button" value="Save" class=" btn-blue mt5" alt="Save" title="Save" />';
		        	html+='</form>';
		        	html+='</div>';

		        	$("#tag-popup_"+uid).append(html);
		        },
		        error: function(xhr, ajaxOptions, thrownError) {
					//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
				}
			 });
		}
	});	
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
	$("[name=tagBtn_"+event.id+"]").attr('disabled','disabled');
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "links/add-new-tag",
        type: "POST",
        dataType: "json",
        data: { "title" : title },
        timeout: 50000,
        success: function(jsonData) {
        		$("span#"+ids).remove();
        		$("[name=tagBtn_"+event.id+"]").removeAttr('disabled');
        		$("#tagTxt_"+event.id).val("");
        		if(jsonData.tag_id=="exist"){
        			$('[name=tagBtn_'+event.id+']').before('<span class="spanmsg" id="span-tag">Already exist </span>');
        		}
        		else{
            		var html="";
            		html+='<div class="tag-popup-col1">';
            		html+='<input type="checkbox" name="tags_arr[]" id="tags_arr[]" value="'+jsonData.tag_id+'">';
            		html+='<div class="tag-popup-col1-text">'+title+'</div>';
            		html+='</div>';
            		$(".tag-popup-mid").prepend(html);        			
        		}
            },
        error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
		}
	 });
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
            		$("#formTag_"+event.id).remove();
            		$("[name=title]").val("");
            		$("[name=saveBtn_"+event.id+"]").removeAttr('disabled');
            		$("#tag-popup-outertags").fadeToggle('slow');
            	}
            	else{
            		$("[name=saveBtn_"+event.id+"]").removeAttr('disabled');
            		$("[name=saveBtn_"+event.id+"]").before('<span class="spanmsg" id="span-msg" style="color:red;">Server Error</span>');
            	}
            },
        error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
		}
	 });
	
}

/**
 * function used to get user created tags list
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function getNotes(event){
	$("[name=note_"+uid+"]").val();
	var uid=event.id;
	$("#displayNotes").fadeToggle('slow',function(){
		if($("#displayNotes").is(':visible')){
			jQuery.ajax({
		        url: "/" + PROJECT_NAME + "links/get-note",
		        type: "POST",
		        dataType: "json",
		        data: { "user_id" : uid },
		        timeout: 50000,
		        success: function(jsonData) {
		        	$("[name=note_"+uid+"]").val(jsonData.txt_note);
		        },
		        error: function(xhr, ajaxOptions, thrownError) {
					//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
				}
			 });
		}
	});	
}

function saveNote(event){
	$("#note-msg").remove();
	$("[name=saveNote_"+event.id+"]").attr('disabled','disabled');
	var ids = addLoadingImage($("[name=saveNote_"+event.id+"]"), "before");
	var txt=$("#note_"+event.id).val();
	var uid=event.id;
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "links/save-note",
        type: "POST",
        dataType: "json",
        data: { "user_id" : uid, "note" : txt },
        timeout: 50000,
        success: function(jsonData) {
        		$("span#"+ids).remove();
            	if(jsonData.msg=="success"){
            		
            		$("[name=saveNote_"+event.id+"]").removeAttr('disabled');
            		$("#displayNotes").fadeToggle('slow');
            	}
            	else{
            		$("[name=saveNote_"+event.id+"]").removeAttr('disabled');
            		$("[name=saveNote_"+event.id+"]").before('<span class="spanmsg" id="note-msg" style="color:red;">Server Error</span>');
            	}
            },
        error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
		}
	 });
}
/**
 * function used to get info for the person already abused or not by the user
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function sendAbuseReport(event){
	var ids = addLoadingImage($("[name=abuse_"+event.id+"]"), "after");
	var uid=event.id;
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "links/abuse-report",
        type: "POST",
        dataType: "json",
        data: { "user_id" : uid },
        timeout: 50000,
        success: function(jsonData) {
        	$("span#"+ids).remove();
        	$("[name=abuse_"+uid+"]").removeAttr("onclick");
        	$("[name=abuse_"+uid+"]").html("Report Abused");
        	
        },
        error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
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
	$(".tag-popup-top").remove();
	$(".tag-popup-mid").remove();
	$(".tag-popup-btn").remove();
	$("#formTag_"+event.id).remove();
	var uid=event.id;
	$("#tag-popup-outertags").fadeToggle('slow',function(){
		if($("#tag-popup-outertags").is(':visible')){
			jQuery.ajax({
		        url: "/" + PROJECT_NAME + "bookmarks/get-edit-groups",
		        type: "POST",
		        dataType: "json",
		        data: { "user_id" : uid },
		        timeout: 50000,
		        success: function(jsonData) {
		        
		        	if(jsonData!=""){
		        		
		        	$("#loading_"+uid).remove();
		        	var html='';
		        	html+='<div class="tag-popup-top">';
		        	html+='<input style="width:95%;" name="groupTxt_'+uid+'" id="groupTxt_'+uid+'" type="text" />';
		        	html+='<input name="groupBtn_'+uid+'" id="'+uid+'" type="button" value="Add Tag" class="btn-blue mt5" alt="Add Tag" title="Add Tag" onclick="addGroup(this)" />';
		        	html+='</div>';
		        	html+='<form name="formGroup_'+uid+'" id="formGroup_'+uid+'" method="post" action="">';
		        	html+='<div class="tag-popup-mid">';
		        	var j=0;
		        	var chk="";
		        	for(var i=jsonData.length-1;i>0;i--){
		        		if(jsonData[i]["is_checked"]==1){
		        			var chk="checked";
		        		}else{
		        			var chk="";
		        		}
		        		
			        	html+='<div class="tag-popup-col1">';
			        	html+='<input name="groupChk[]" id="groupChk[]" type="checkbox" value="'+jsonData[i]["tag_id"]+'" '+chk+' />';
			        	html+='<div class="tag-popup-col1-text">'+jsonData[i]["tag_title"]+'</div>';
			        	html+='</div>';	
			        	j++;
		        	}
		        	
		        	html+='</div>';
		        	html+='<div class="tag-popup-btn"><input name="saveBtn_'+uid+'" onclick="assignGroups(this)" id="'+uid+'" type="button" value="Save" class=" btn-blue mt5" alt="Save" title="Save" />';
		        	html+='</form>';
		        	html+='</div>';

		        	$("#tag-popup_"+uid).append(html);
		        }else{
		           	$("#loading_"+uid).remove();
		        	var html='';
		        	html+='<div class="tag-popup-top">';
		        	html+='<input style="width:95%;" name="groupTxt_'+uid+'" id="groupTxt_'+uid+'" type="text" />';
		        	html+='<input name="groupBtn_'+uid+'" id="'+uid+'" type="button" value="Add Tag" class="btn-blue mt5" alt="Add Tag" title="Add Tag" onclick="addGroup(this)" />';
		        	html+='</div>';
		        	html+='<form name="formGroup_'+uid+'" id="formGroup_'+uid+'" method="post" action="">';
		        	html+='<div class="tag-popup-mid">';
		        	var j=0;
		        	var chk="";
		        	for(var i=jsonData.length-1;i>0;i--){
		        		
		        		if(jsonData[i]["is_checked"]==1){
		        			var chk="checked";
		        		}else{
		        			var chk="";
		        		}
		        		
			        	html+='<div class="tag-popup-col1">';
			        	html+='<input name="groupChk[]" id="groupChk[]" type="checkbox" value="'+jsonData[i]["tag_id"]+'" '+chk+' />';
			        	html+='<div class="tag-popup-col1-text">'+jsonData[i]["tag_title"]+'</div>';
			        	html+='</div>';	
			        	j++;
		        	}
		        	
		        	html+='</div>';
		        	html+='<div class="tag-popup-btn"><input name="saveBtn_'+uid+'" onclick="assignGroups(this)" id="'+uid+'" type="button" value="Save" class=" btn-blue mt5" alt="Save" title="Save" />';
		        	
		        	html+='</form>';
		        	html+='</div>';

		        	$("#tag-popup_"+uid).append(html);
	        	
		        }
},
		        error: function(xhr, ajaxOptions, thrownError) {
					//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
				}
			 });
		}
	});	
}
/**
 * function used to add new group
 * Author: Shaina Gandhi
 * Date: 14,Aug 2013
 * version: 1.0
 */
function addGroup(event){
	$('#span-tag').remove();
	var ids = addLoadingImage($("[name=groupBtn_"+event.id+"]"), "before");
	var title=$("#groupTxt_"+event.id).val();
	$("[name=groupBtn_"+event.id+"]").attr('disabled','disabled');
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "bookmarks/add-new-group",
        type: "POST",
        dataType: "json",
        data: { "title" : title },
        timeout: 50000,
        success: function(jsonData) {
        		$("span#"+ids).remove();
        		$("[name=groupBtn_"+event.id+"]").removeAttr('disabled');
        		$("#groupTxt_"+event.id).val("");
        		if(jsonData.tag_id=="exist"){
        			$('[name=groupBtn_'+event.id+']').before('<span class="spanmsg" id="span-tag">Already exist </span>');
        		}
        		else{
            		var html="";
            		html+='<div class="tag-popup-col1">';
            		html+='<input type="checkbox" name="gropus_arr[]" id="gropus_arr[]" value="'+jsonData.tag_id+'">';
            		html+='<div class="tag-popup-col1-text">'+title+'</div>';
            		html+='</div>';
            		$(".tag-popup-mid").prepend(html);        			
        		}
            },
        error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
		}
	 });
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
            		$("#formGroup_"+event.id).remove();
            		$("[name=title]").val("");
            		$("[name=saveBtn_"+event.id+"]").removeAttr('disabled');
            		$("#tag-popup-outertags").fadeToggle('slow');
            	}
            	else{
            		$("[name=saveBtn_"+event.id+"]").removeAttr('disabled');
            		$("[name=saveBtn_"+event.id+"]").before('<span class="spanmsg" id="span-msg" style="color:red;">Server Error</span>');
            	}
            },
        error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
		}
	 });
}

function showGroupMenuPopup(){
	$("#grp-pop").fadeToggle();
}
function addMenuTag(event){
	var uid=event.uid;
	var ids = addLoadingImage($("[name=nav-grp-btn]"), "before");
	var title=$("[name=grp-nav-title]").val();
	$("[name=nav-grp-btn]").attr('disabled','disabled');
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "links/add-new-tag",
        type: "POST",
        dataType: "json",
        data: { "title" : title },
        timeout: 50000,
        success: function(jsonData) {
	    		$(".group-popup-btn").remove();
	    		$(".spanmsg").remove();
	    		$("span#"+ids).remove();
	    		$("[name=nav-grp-btn]").removeAttr('disabled');
	    		$("[name=grp-nav-title]").val("");
	    		if(jsonData=="exist"){
	    			$("[name=nav-grp-btn]").before('<span class="spanmsg" id="span-tag">Already exist </span>');
	    		}
	    		else{
	    			$("[name=add_grptxt]").remove();
	    			$(".group-popup-mid").remove();
	    			$(".grouplist").remove();
	    			$(".tag-manage-btn").remove();
	    			var html="";
	    			
	    			html+='<div style="overflow-y:scroll;" class="group-popup-mid">';
	    			html+='<form action="" method="post" id="grp-form" name="grp-form">';
	        		
	    			for(var i=0;i<jsonData.length;i++){
		        		html+='<div id="grp_'+jsonData[i]['tag_id']+'" class="group-popup-col1">';
	            		html+='<div class="editpop-cross">';
	            		html+='<img width="9" onclick="removeTg(this)" grpid="'+jsonData[i]['tag_id']+'" uid="'+uid+'" height="8" align="absmiddle" src="/'+PROJECT_NAME+'public/images/cross-grey.png">';
	            		html+='</div>';
	            		html+='<div class="group-popup-col1-text"><span rel="'+jsonData[i]['tag_id']+'" id="span_'+jsonData[i]['tag_id']+'" style="padding:0px;background:none;" class="menu-span">'+jsonData[i]['tag_title']+'</span>';
	            		html+='<input type="text" onkeyup="assignGrpLabels(this)" value="'+jsonData[i]['tag_title']+'" rel="'+jsonData[i]['tag_id']+'" name="txtgrp_'+jsonData[i]['tag_id']+'" id="txtgrp_'+jsonData[i]['tag_id']+'" style="width:115px;display:none;" class="menu-span2">';
	            		html+='</div>';
	            		html+='</div>';
	            		if(i==0){
	            			var lastid=jsonData[0]['tag_id'];	
	            		}
	       			}
	    			html+='</div>';
	    			html+='<div class="group-popup-btn">';
	    			html+='<input type="button" value="Save" name="nav-grp-save" class="btn-blue mt5" alt="Save" title="Save" onclick="updateLabels()">';
	    			html+='</div>';
		        	html+='</form>';
		        	html+='</div>';
		        	
	        		var html2="";
	        		html2+='<a  id="menu_grp_'+lastid+'" class="grp-listing" href="/'+PROJECT_NAME+'links/tag/id/'+jsonData.tag_id+'">';
	        		html2+=title+'</a>';
	        		
	        		
	        		$("#addNewgrp").remove();
	        		$(".groupdiv").css("height","auto");
	        		$(".grouplist").css("display","block");
	        		$("#grplisting").after(html2); 
	        		$(".group-popup-top").after(html);       			
	    		}
	        	
            },
        error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
		}
	 });
}
function removeTg(event){
	$(".editpop-cross").attr('disabled','disabled');
	var grpid=$(event).attr("grpid");
	var uid=$(event).attr("uid");
	$("#imggrp_"+grpid).removeAttr("onclick");
	$("#imggrp_"+grpid).css("max-width","20px");
	$("#imggrp_"+grpid).attr("src", "/"+PROJECT_NAME+"public/images/loading_small_black.gif");
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "links/delete-tag",
        type: "POST",
        dataType: "json",
        data: { "id" : grpid },
        timeout: 50000,
        success: function(jsonData) {
        	if(jsonData.msg=="fail"){
        		$(".editpop-cross").removeAttr('disabled');
        		$("#menu_grp_"+grpid).remove();
        		var html="";
        		html+='<a onclick="getNavPopup(this);" href="javascript:;" id="'+uid+'" name="add_grptxt">Add Tag</a>';
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
        			
        			html+='<div style="overflow-y:scroll;" class="group-popup-mid">';
        			html+='<form action="" method="post" id="grp-form" name="grp-form">';
            		
        			for(var i=0;i<jsonData.length;i++){
    	        		html+='<div id="grp_'+jsonData[i]['tag_id']+'" class="group-popup-col1">';
                		html+='<div class="editpop-cross">';
                		html+='<img id="imggrp_'+jsonData[i]["tag_id"]+'" onclick="removeTg(this)" uid="'+uid+'" grpid="'+jsonData[i]["tag_id"]+'" height="8" align="absmiddle" src="/'+PROJECT_NAME+'public/images/cross-grey.png">';
                		html+='</div>';
                		html+='<div class="group-popup-col1-text"><span rel="'+jsonData[i]['tag_id']+'" id="span_'+jsonData[i]['tag_id']+'" style="padding:0px;background:none;" class="menu-span">'+jsonData[i]['tag_title']+'</span>';
                		html+='<input type="text" onkeyup="assignGrpLabels(this)" value="'+jsonData[i]['tag_title']+'" rel="'+jsonData[i]['tag_id']+'" name="txtgrp_'+jsonData[i]['tag_id']+'" id="txtgrp_'+jsonData[i]['tag_id']+'" style="width:115px;display:none;" class="menu-span2">';
                		html+='</div>';
                		html+='</div>';
                		if(i==0){
                			var lastid=jsonData[0]['group_id'];	
                		}
           			}
        			html+='</div>';
            		html+='<div class="group-popup-btn">';
            		html+='<input type="button" value="Save" name="nav-grp-save" class="btn-blue mt5" alt="Save" title="Save" onclick="updateLabels()">';
            		html+='</div>';
            		html+='</form>';
		        	html+='</div>';
		        	
            		$("#addNewgrp").remove();
            		$(".groupdiv").css("height","auto");
            		$(".grouplist").css("display","block");
            		$(".group-popup-top").after(html);
            		
            		
        			$("#grp_"+grpid).remove();
        			$("#menu_grp_"+grpid).remove();
        		}   
        	}
        		     		
            },
        error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
		}
	 });
}
function assignGrpLabels(event){
	var id=$(event).attr("rel");
	$("#span_"+id).html($(event).val());
	$("#event"+id).val($(event).val());
}
function updateLabels(){
	var ids = addLoadingImage($("[name=nav-grp-save]"), "before");
	var str=$("form#grp-form").serializeArray();
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "links/update-tag",
        type: "POST",
        dataType: "json",
        data: { "tags" : str },
        timeout: 50000,
        success: function(jsonData) {
        		$("span#"+ids).remove();
        		$(".grp-listing").remove();  
	        	var html="";
	        	for(var i=0;i<jsonData.length;i++){
	        		html+='<a class="grp-listing" id="menu_grp_'+jsonData[i]['tag_id']+'" href="/'+PROJECT_NAME+'bookmarks/tag/id/'+jsonData[i]['tag_id']+'">';
	        		html+=jsonData[i]['tag_title']+'</a>';
	        	}
	        	$("#grplisting").after(html);  
	        	showGroupMenuPopup();
        	},
        error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
		}
	 });
}
function showManagePopup(){
	$(".manage-pop-outer").fadeToggle();
	$(".quickview-outer-second  quickview-outer").hide();
	$("#tag-manage-outertags").hide(); 	
	$(".msg-popup-outer").hide();
}
function addBookmark(){
	var str=$("form#link-form").serializeArray();
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
	        			
	        		}
	        	},
	        error: function(xhr, ajaxOptions, thrownError) {
				//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
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
function sendMessage(){
	var str=$("form#link-form").serializeArray();
	var msg=$("#sndmultiple").val();
	if(str.length>0){
		var ids = addLoadingImage($("#sndmsg"), "before");
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "links/send-multiple-msges",
	        type: "POST",
	        dataType: "json",
	        data: { "bookmark_users" : str,"msg" : msg },
	        timeout: 50000,
	        success: function(jsonData) {
	        		$("span#"+ids).remove();
	        		if(jsonData.msg="success"){
	        			sngMsg();
	        		}
	        	},
	        error: function(xhr, ajaxOptions, thrownError) {
				//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
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
}
function sngMsg(){
	$("#sndmultiple").val("");
	$(".msg-popup-outer").fadeToggle();
	$("#tag-manage-outertags").hide(); 
}
function download(){
	$("#download-popup").fadeToggle();
}

/**
 * function used to get user created tags list
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function getManageTags(event){
	$(".msg-popup-outer").hide(); 
	$(".tag-manage-top").remove();
	$(".tag-manage-mid").remove();
	$(".tag-manage-btn").remove();
	// $("#formTag_"+event.id).remove();
	var uid=event.id;
	$("#tag-manage-outertags").fadeToggle('slow',function(){
		if($("#tag-manage-outertags").is(':visible')){
			jQuery.ajax({
		        url: "/" + PROJECT_NAME + "links/get-manage-tags",
		        type: "POST",
		        dataType: "json",
		        data: { "user_id" : uid },
		        timeout: 50000,
		        success: function(jsonData) {
		        	if(jsonData.length>0){
		        	$("#loading_"+uid).css("display","none");
		        	var html='';
		        	html+='<div class="tag-manage-top">';
		        	html+='<input style="width:95%;" name="managegroupTxt_'+uid+'" id="managegroupTxt_'+uid+'" type="text" />';
		        	html+='<input name="managegroupBtn_'+uid+'" id="'+uid+'" type="button" value="Add Tag" class="btn-blue mt5" alt="Add Tag" title="Add Tag" onclick="addManageTag(this)" />';
		        	html+='</div>';
		        	html+='<form name="formManageGroup_'+uid+'" id="formManageGroup_'+uid+'" method="post" action="">';
		        	html+='<div class="tag-manage-mid">';
		        	var j=0;
		        	for(var i=0;i<jsonData.length;i++){
		        		
			        	html+='<div class="tag-manage-col1">';
			        	html+='<input name="groupChk[]" id="groupChk[]" type="checkbox" value="'+jsonData[i]["tag_id"]+'" />';
			        	html+='<div class="tag-manage-col1-text">'+jsonData[i]["tag_title"]+'</div>';
			        	html+='</div>';	
			        	j++;
		        	}
		        	
		        	html+='</div>';
		        	html+='<div class="tag-manage-btn"><input name="saveManageBtn_'+uid+'" onclick="assignGroupsToUser(this)" id="'+uid+'" type="button" value="Save" class=" btn-blue mt5" alt="Save" title="Save" />';
		        	html+='</form>';
		        	html+='</div>';

		        	$("#tag-manage_"+uid).append(html);
		        }else{
	        	
		        }
},
		        error: function(xhr, ajaxOptions, thrownError) {
					//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
				}
			 });
		}
	});	
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
	$("[name=managegroupBtn_"+event.id+"]").attr('disabled','disabled');
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "links/add-new-tag",
        type: "POST",
        dataType: "json",
        data: { "title" : title },
        timeout: 50000,
        success: function(jsonData) {
        		$("span#"+ids).remove();
        		$("[name=managegroupBtn_"+event.id+"]").removeAttr('disabled');
        		$("#managegroupTxt_"+event.id).val("");
        		if(jsonData.tag_id=="exist"){
        			$('[name=managegroupBtn_'+event.id+']').before('<span class="spanmsg" id="span-tag">Already exist </span>');
        		}
        		else{
            		var html="";
            		html+='<div class="tag-manage-col1">';
            		html+='<input type="checkbox" name="mnggrp_arr[]" id="mnggrp_arr[]" value="'+jsonData.tag_id+'">';
            		html+='<div class="tag-manage-col1-text">'+title+'</div>';
            		html+='</div>';
            		$(".tag-manage-mid").prepend(html);        			
        		}
            },
        error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
		}
	 });
}
function assignGroupsToUser(event){

	var userid=$("form#link-form").serializeArray();
	var grpsfrm=$("form#formManageGroup_"+event.id).serializeArray();
	if(userid.length>0){
		var ids = addLoadingImage($("#saveManageBtn_"+event.id), "before");
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "links/assign-multiple-tags",
	        type: "POST",
	        dataType: "json",
	        data: { "tags_arr" : grpsfrm,"user" : userid },
	        timeout: 50000,
	        success: function(jsonData) {
	        		$("span#"+ids).remove();
	        		if(jsonData.msg="success"){
	        			$("#tag-manage-outertags").css("display","none");
	        		}
	        	},
	        error: function(xhr, ajaxOptions, thrownError) {
				//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
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
}
function getNavPopup(event){
	$(".group-popup-btn").remove();
	$(".group-popup-mid").remove();
	$(".group-popup-top").remove();
	$(".tag-manage-btn").remove();
	var uid=event.id;
	$("[name="+event.name+"]").attr("disabled","disabled");
	$(".group-popup-top").remove();
	$(".grouplist").remove();
	// $("#formTag_"+event.id).remove();
	$("#grp-pop").fadeToggle('slow',function(){
		if($("#grp-pop").is(':visible')){
			$("#loading2_"+uid).css("display","block");
			jQuery.ajax({
		        url: "/" + PROJECT_NAME + "links/get-manage-tags",
		        type: "POST",
		        dataType: "json",
		        data: { "user_id" : uid },
		        timeout: 50000,
		        success: function(jsonData) {
		        	if(jsonData.length>0){
			        	$("#loading2_"+uid).css("display","none");
			        	html="";
			        	html+='<div class="group-popup-top">';
			        	html+='<input max-length="18" type="text" style="width:95%;" name="grp-nav-title">';
			        	html+='<input id="'+uid+'" type="button" name="nav-grp-btn" onclick="addMenuTag(this)" value="Add Tag" class=" btn-blue mt5" alt="Add Tag" title="Add Tag">';
			        	html+='</div>';
			            
			        	html+='<div class="grouplist">';
			        	html+='<div class="group-popup-mid" style="overflow-y:scroll;">';
			        	html+='<form name="grp-form" id="grp-form" method="post" action="">';
			        	var j=0;
			        	for(var i=0;i<jsonData.length;i++){
			        		
			        	html+='<div class="group-popup-col1" id="grp_'+jsonData[i]["tag_id"]+'">';
			        	html+='<div class="editpop-cross">';
			        	html+='<img id="imggrp_'+jsonData[i]["tag_id"]+'" onclick="removeTg(this)" uid="'+uid+'" grpid="'+jsonData[i]["tag_id"]+'" height="8" align="absmiddle" src="/'+PROJECT_NAME+'public/images/cross-grey.png">';
			        	html+='</div>';
			        	html+='<div class="group-popup-col1-text">';
			        	html+='<span class="menu-span" style="padding:0px;background:none;" id="span_'+jsonData[i]["tag_id"]+'" rel="'+jsonData[i]["tag_id"]+'">';
			        	html+=jsonData[i]["tag_title"];
			        	html+='</span>';
			        	html+='<input class="menu-span2" style="width:115px;display:none;" type="text" id="txtgrp_'+jsonData[i]["tag_id"]+'" name="txtgrp_'+jsonData[i]["tag_id"]+'" rel="'+jsonData[i]["tag_id"]+'" value="'+jsonData[i]["tag_title"]+'" onkeyup="assignGrpLabels(this)" />';
			        	html+='</div>';
			        	html+='</div>';

			        	}
			        	html+='</form>';
			        	html+='</div>';
			        	html+='<div class="group-popup-btn">';
			        	html+='<input type="button" value="Save" name="nav-grp-save" class="btn-blue mt5" alt="Save" title="Save" onclick="updateLabels()">';
			        	html+='</div>';
			        	html+='</div>';
			        	$("[name="+event.name+"]").removeAttr('disabled');
			        	$(".groupdiv").append(html);
			        	$(".grouplist").css("display","block");
			        }else{
			        	$(".groupdiv").css("height","54px");
			        	$("#loading2_"+uid).css("display","none");
			        	html="";
			        	html+='<div class="group-popup-top">';
			        	html+='<input max-length="18" type="text" style="width:95%;" name="grp-nav-title">';
			        	html+='<input id="'+uid+'" type="button" name="nav-grp-btn" onclick="addMenuTag(this)" value="Add Tag" class=" btn-blue mt5" alt="Add Tag" title="Add Tag">';
			        	html+='</div>';
			        	$("[name="+event.name+"]").removeAttr('disabled');
			        	$(".groupdiv").append(html);
			        }		        	
},
		        error: function(xhr, ajaxOptions, thrownError) {
					//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
				}
			 });
		}
	});	    
}
/**
 * Fetch more records of people you may know
 * according to offset and limit sent.
 * @param element
 * @author hkaur5
 */
function loadMorePeopleYouMayKnow(element)
{
	$(element).hide();
	$('div.see_more_you_may_know').html('<img class="loading_options" style="" src="'+IMAGE_PATH+'/loading_small_purple.gif"/>');
	var offset = $("input#offsett").val();
	var limit = $("input#recordLimit").val();
	
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "links/load-more-people-you-may-know",
        type: "POST",
        dataType: "json",
        data : { 'offset':offset, 'limit':limit  },
        success: function(jsonData) 
        {
        	if(jsonData)
    		{
        		$('div.see_more_you_may_know').hide();
        		$('div#user_records').append(jsonData.html);
        		
    		}
        	$("#offsett").val( parseInt(offset)+parseInt(limit) );
		}
	});
}