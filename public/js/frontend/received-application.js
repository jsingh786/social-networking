var moveCandidateToShortlist = null;
var removeCandidateFromShortlist = null;
var deleteCandidate = null;
$(document).ready(function(){
	$(".deleteShortlist").click(function(){
		var jobId = $("#jobId").val();
		var profileId = $(this).attr("rel");
		deleteApplicant(jobId, profileId);
	});
	clickOnShortlisted2();
	clickOnShortlist();
	clickOnShortlisted();
	$(".manageOptions").click(function(){
		$(this).next().show();
	});
});

$(document).mouseup(function (e)
{
    var container = $(".manage-popup");
    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        container.hide();
    }
});
$(document).keyup(function(e) {
    if (e.keyCode == 27) {
        $(".manage-popup").hide(); 
    }
});

function clickOnShortlist(){
	$(".shortlist").click(function(){
		var profileId = $(this).attr("rel");
		var jobId = $("#jobId").val();
		moveToShortList(jobId, profileId);
	});
}
function clickOnShortlisted(){
	$(".shortlisted").click(function(){
		var profileId = $(this).attr("rel");
		var jobId = $("#jobId").val();
		removeFromShortList(jobId, profileId);
	});
}
function clickOnShortlisted2(){
	$(".shortlisted2").click(function(){
		var profileId = $(this).attr("rel");
		var jobId = $("#jobId").val();
		removeFromShortList2(jobId, profileId);
	});
}
/**
 * function used to move applicants to Shortlisted listing
 * @param jobId, profileId
 * @author spatial
 */
function moveToShortList(jobId, profileId){
	$("#shortlistStatus_"+profileId).unbind();
	$("#shortlistStatus_"+profileId).removeClass("shortlist");
	var ids = addLoadingImage($("#shortlistStatus_"+profileId), "after");
	moveCandidateToShortlist=$.ajax({
		 url : "/" + PROJECT_NAME + "job/move-to-shortListed-candidates",
		 method : "POST",
		 data : "job_id="+jobId+"&profile_id="+profileId,
		 type : "post",
		 dataType : "json",
		 beforeSend: function(){
			 if(moveCandidateToShortlist != null) {
				 moveCandidateToShortlist.abort();
			 }
		 },
		 success : function(jsonData) {
			 $("span#"+ids).remove();
			if(jsonData.msg==1){
				$("#shortlistStatus_"+profileId).addClass("shortlisted");
				$("#shortlistStatus_"+profileId).html("Remove from Shortlist");
				$("#cntApplicant").html(jsonData.applicants+" Applications");
				$("#cntCandidate").html(jsonData.candidates+" Shortlisted");
				$(".alert-box").remove();
				$(".alert-box1").remove();
				$(".alert-box2").remove();
				clickOnShortlisted();
				showDefaultMsg( "Applicant shortlisted successfully.", 1 );
			}
			else{
				$("#shortlistStatus_"+profileId).addClass("shortlist");
				$(".alert-box").remove();
				$(".alert-box1").remove();
				$(".alert-box2").remove();
				showDefaultMsg( "Error due to server, please try again.", 2 );
			}
		 }
	 });
}
/**
 * function used to remove applicants from Shortlisted listing
 * @param jobId, profileId
 * @author spatial
 */
function removeFromShortList(jobId, profileId){
	$("#shortlistStatus_"+profileId).unbind();
	$("#shortlistStatus_"+profileId).removeClass("shortlisted");
	var ids = addLoadingImage($("#shortlistStatus_"+profileId), "after");
	removeCandidateFromShortlist=$.ajax({
		 url : "/" + PROJECT_NAME + "job/remove-from-shortlisted-candidates",
		 method : "POST",
		 data : "job_id="+jobId+"&profile_id="+profileId,
		 type : "post",
		 dataType : "json",
		 beforeSend: function(){
			 if(removeCandidateFromShortlist != null) {
				 removeCandidateFromShortlist.abort();
			 }
		 },
		 success : function(jsonData) {
			 $("span#"+ids).remove();
			if(jsonData.msg==1){
				$("#shortlistStatus_"+profileId).addClass("shortlist");
				$("#shortlistStatus_"+profileId).html("Shortlist");
				$("#cntApplicant").html(jsonData.applicants+" Applications");
				$("#cntCandidate").html(jsonData.candidates+" Shortlisted");
				$(".alert-box").remove();
				$(".alert-box1").remove();
				$(".alert-box2").remove();
				clickOnShortlist();
				showDefaultMsg( "Applicant removed from shortlisted list.", 1 );
			}
			else{
				$("#shortlistStatus_"+profileId).addClass("shortlisted");
				$(".alert-box").remove();
				$(".alert-box1").remove();
				$(".alert-box2").remove();
				showDefaultMsg( "Error due to server, please try again.", 2 );
			}
		 }
	 });
}
/**
 * function used to remove applicants from Shortlisted Candidate page..
 * @param jobId, profileId
 * @author spatial
 */
function removeFromShortList2(jobId, profileId){
	$("#shortlistStatus_"+profileId).unbind();
	$("#shortlistStatus_"+profileId).removeClass("shortlisted");
	var ids = addLoadingImage($("#shortlistStatus_"+profileId), "after");
	removeCandidateFromShortlist=$.ajax({
		 url : "/" + PROJECT_NAME + "job/remove-from-shortlisted-candidates",
		 method : "POST",
		 data : "job_id="+jobId+"&profile_id="+profileId,
		 type : "post",
		 dataType : "json",
		 beforeSend: function(){
			 if(removeCandidateFromShortlist != null) {
				 removeCandidateFromShortlist.abort();
			 }
		 },
		 success : function(jsonData) {
			 $("span#"+ids).remove();
			if(jsonData.msg==1){
				window.location.href="/" + PROJECT_NAME + "job/shortlisted-applications/id/"+jobId;
			}
			else{
				$("#shortlistStatus_"+profileId).addClass("shortlisted");
				$(".alert-box").remove();
				$(".alert-box1").remove();
				$(".alert-box2").remove();
				showDefaultMsg( "Error due to server, please try again.", 2 );
			}
		 }
	 });
}
/**
 * function used to delete particular applicant.
 * @param jobId, profileId
 * @author spatial
 */
function deleteApplicant(jobId, profileId){
	$("#deleteShortlist_"+profileId).unbind();
	$("#deleteShortlist_"+profileId).removeClass("deleteShortlist");
	var ids = addLoadingImage($("#deleteShortlist_"+profileId), "after");
	deleteCandidate=$.ajax({
		 url : "/" + PROJECT_NAME + "job/delete-applicant",
		 method : "POST",
		 data : "job_id="+jobId+"&profile_id="+profileId,
		 type : "post",
		 dataType : "json",
		 beforeSend: function(){
			 if(deleteCandidate != null) {
				 deleteCandidate.abort();
			 }
		 },
		 success : function(jsonData) {
			 $("span#"+ids).remove();
			if(jsonData.msg==1){
				window.location.href="/" + PROJECT_NAME + "job/received-applications/id/"+jobId;
			}
			else{
				$("#deleteShortlist_"+profileId).addClass("deleteShortlist");
				$(".alert-box").remove();
				$(".alert-box1").remove();
				$(".alert-box2").remove();
				showDefaultMsg( "Error due to server, please try again.", 2 );
			}
		 }
	 });
}