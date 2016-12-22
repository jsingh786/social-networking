$(document).ready(function(){
	
	   //Search box js
	$( "form#links_search_form1" ).validate({
		rules: {
			linkSearch: {
				required: true
			}
		},
		messages: {
			linkSearch:{
				required:""
			},
		}
	});
	
	$("#invitation_cancle").click(function(){
		cancelRequest($(this).val());
	});
	
	$("a#search_links_btn").click( function(){
		if( $( "form#links_search_form1" ).valid() )
		{
			$("form#links_search_form1").submit();
		}
	});
});
/**
 * function used to send invitation to the users
 * author: Sunny Patial
 */
function invitationToUser(){
	var acceptUser = $("input#req_id").val();
	jQuery.ajax({
		async: false,
        url: "/" + PROJECT_NAME + "links/send-link-request",
        type: "POST",
        dataType: "json",
        data: "accept_user="+acceptUser,
        success: function(jsonData) 
        {
        	$("#invitation").attr("onclick","cancelRequest("+jsonData+")");
        	$("#invitation").html("Cancel Request");
		},
        error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
		}
    });
}
/**
 * Delete link requests
 * @param id (link_requests primary key)
 * @author spatial
 */
function cancelRequest(id){
	$(".alert-box").remove();
	$('a.cancel_invitation').hide();
	var ids = addLoadingImage($("span.acc-dec_"+id), "before", "loading_small_purple.gif", "0", "14");
	jQuery.ajax({
		async: false,
        url: "/" + PROJECT_NAME + "links/delete-request",
        type: "POST",
        dataType: "json",
        data: "cancel_request="+id,
        success: function(jsonData) {
        	$("span#"+ids).remove();
        	$('a.cancel_invitation').show();
        	$("#invitation_"+id).remove();
        	showDefaultMsg( "link request has been declined by you.", 1 );
        	if (!$(".mail-sendmsg-col2")[0]){
        		$(".text-grey3").remove();
        		$(".bookmark-search-right").remove();
        		$(".col4").append('<div class="emptyRecordOuter"><div class="emptyRecordInner text-grey3"><p class="no_feedbacks">No results found!</p></div></div>');
        	} 	
		},
        error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
		}
    });
}

/**
 * function used to accept request from the users
 * param:  id is the link_requests primary key
 * author: Sunny Patial
 * @author ssharma4[Clear user buddylist from localstorage on ajax success.]
 *
 * @version 1.1
 */
function acceptRequest( event ){
	var ids = addLoadingImage($("span.acc-dec_"+event.rel), "before", "loading_small_purple.gif", "0", "14");
	var profileID=event.id;
	var acceptId=event.rel;
	$(this).css("display","none");
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "profile/accept-request",
        type: "POST",
        dataType: "json",
        data: "accept_request="+acceptId+"&profileID="+profileID,
        success: function(jsonData) {
			//Clear user buddylist from localstorage.
			localStorage.removeItem("jsxc:"+ jsonData.accepter +'@'+OPENFIRE_DOMAIN +":buddylist");
        	$("span#"+ids).remove();
        	$('a.accept_invitation').show();
        	$("#invitation_"+acceptId).remove();
        	//showDefaultMsg( "You have accepted the link request.", 1 );
        	if (!$(".mail-sendmsg-col2")[0])
        	{
        		$(".text-grey3").remove();
        		$(".alert-box").remove();
        		$(".alert-box1").remove();
        		$(".alert-box2").remove();
        		$(".bookmark-search-right").remove();
        		$(".col4").append("<div class='no-rec-msg text-grey3'>No results found!</div>");

        		
        	} 
        	showDefaultMsg( "You have accepted the link request.", 1 );
		},
        error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
		}
    });
}
/**
 * function used to unfriend the users
 * param:  id is the link_requests primary key
 * author: Sunny Patial
 */
function unFriend(id){
	$(".alert-box").remove();
	jQuery.ajax({
		async: false,
        url: "/" + PROJECT_NAME + "links/delete-request",
        type: "POST",
        dataType: "json",
        data: "cancel_request="+id,
        success: function(jsonData) {
        	$(".alert-box").remove();
    		$(".alert-box1").remove();
    		$(".alert-box2").remove();
        	$("#invitation").attr("onclick","invitationToUser()");
        	$("#invitation").html("Invite To Connect");
		},
        error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
		}
    });
}
