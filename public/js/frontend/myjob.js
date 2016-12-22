var currentStateRequest = null;
var currentCityRequest = null;
var currentApplicantRequest = null;
var currentCandidateShortlisted = null;
var moveCandidateToShortlist = null;
var removeCandidateFromShortlist = null;
var deleteCandidate = null;
$(document).ready(function(){
	// display filteration div for Ascending and Descending purposes
	$('.filter').click(function(){
		$(".filteration").fadeToggle("slow");
	});
	// get job detail...
	$('.jobDetail').click(function(event){
		$("#detail_"+$(this).attr("rel")).fadeToggle("slow");
	});
	// get job description...
	$('.jobDesc').click(function(event){
		$("#desc_"+$(this).attr("rel")).slideToggle("slow");
	});
	// get job posting...
	$('.jobPosting').click(function(event){
		$("#postedBy_"+$(this).attr("rel")).slideToggle("slow");
	});
	// get applicants...
	$('.applicants').click(function(event){
		var jobId = $(this).attr("rel");
		 $(".applicants_"+jobId).slideToggle("slow");
		 if(!$(".applicants_"+jobId).attr("applicants")){
			 getApplicants(jobId, "tab");
		 }		
	});	 
	// get shortlisting candidates...
	$('.candidates').click(function(event){
		var jobId = $(this).attr("rel");
		 $(".candidates_"+jobId).slideToggle("slow");
		 if(!$(".candidates_"+jobId).attr("candidates")){
			 getCandidates(jobId,"tab");
		 }		
	});	 
	
/*	$('.candidates').click(function(event){
		var jobId = $(this).attr("rel");
		 $(".candidates_"+jobId).slideToggle("slow");
		 if(!$(".candidates_"+jobId).attr("candidates")){
			 currentCandidateShortlisted = $.ajax({
				 url : "/" + PROJECT_NAME + "job/get-shortListed-candidates",
				 method : "POST",
				 data : "job_id="+jobId,
				 type : "post",
				 dataType : "json",
				 beforeSend: function(){
					 $(".candidates_"+jobId).empty();
					 $(".candidates_"+jobId).html("<center>Loading....</center>");
					 if(currentCandidateShortlisted != null) {
						 currentCandidateShortlisted.abort();
					 }
				 },
				 success : function(jsonData) {
					 $(".candidates_"+jobId).empty();
					 if(jsonData.length>0){
						 // if candidates found :)
						 var html='';
						 for(var i=0;i<jsonData.length;i++){
							 html+='<div class="bookmarks-profile-img" style="width:52px; margin-right:10px;">';
							 html+='<div style="width:50px; height:50px;display:table-cell;cursor:pointer;vertical-align:middle;text-align:center;border:1px solid #ccc;">';
							 html+='<img src="'+jsonData[i]['ilookUser']['professional_image']+'">';
							 html+='</div><span>'+jsonData[i]['ilookUser']['firstname'];
							 html+='</span></div>';
						 }
						 $(".candidates_"+jobId).append(html);
					 }
					 else{
						 $(".candidates_"+jobId).html("<center>Not Found!!!</center>");
					 }
					 $(".candidates_"+jobId).attr("candidates","displayed");
				 }
			 });					 
		 }		 
	});*/
	
	/**
	 * Alert box for success message.
	 * 
	 * @author sgandhi
	 * @version 1.0
	 */	
	
	
	
    $( "div#dialog_status_active" ).dialog({
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
		        	
		        	$(this).dialog( "close" );
		        	$( $(this).data('thisss') ).val( $.data( $(this).data('thisss'), 'current' ) );
		        },
	    	 'OK': function() {
	    		$( this ).dialog( "close" );
	    		$thisOfSelect = $($(this).data('thisss'));
	    		$thisOfSelect.attr("disabled", "disabled");
	    		$.ajax({
	    			url: "/" + PROJECT_NAME + "job/change-my-jobs-status",
	    			type: "POST",
	    	        dataType: "json",
	    			data: {
	    				"status_active" : $($(this).data('thisss')).val(),
	    				"id" : $($(this).data('thisss')).attr("rel"),
	    				},
	    			success: function(jsonData) {
	    				var options = "";
	    				if( $thisOfSelect.val() == 1 )
	    				{
	    					options += "<option value = '1' selected>Active</option>";
	    					options += "<option value = '2'>Expired</option>";
	    				}
	    				else if(  $thisOfSelect.val() == 2 )
	    				{
	    					options += "<option value = '2' selected>Expired</option>";
	    					options += "<option value = '1'>Active</option>";
	    					options += "<option value = '4'>Closed</option>";
	    				}
	    				else if(  $thisOfSelect.val() == 4 )
	    				{
	    					options += "<option value = '4' selected>Closed</option>";
	    					options += "<option value = '3'>Delete</option>";
	    				}
	    				$thisOfSelect.empty();
	    				$thisOfSelect.html(options);
	    				$thisOfSelect.removeAttr("disabled");
	    			},
	    			error: function(xhr, ajaxOptions, thrownError) {
	    				//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
	    			}
	    		});
	    	}
		}
   });
	
	

	//change order status
    $('select.statuss').change(function(){
		$( "div#dialog_status_active" ).data('thisss', this).dialog( "open" );
	});
});

function getCandidates(jobId,hitType){
	var recordInitial = $("#recordCandidateInitialPoint").val();
	 currentCandidateShortlisted = $.ajax({
		 url : "/" + PROJECT_NAME + "job/get-shortListed-candidates",
		 method : "POST",
		 data : "job_id="+jobId+"&recordStart="+recordInitial,
		 type : "post",
		 dataType : "json",
		 beforeSend: function(){
			 if(hitType=="tab"){
				 $(".candidates_"+jobId).empty();
				 $(".candidates_"+jobId).html("<center>Loading....</center>");		 				 
			 }
			 else{
				 $(".viewmoreCandidate_"+jobId).empty();
				 $(".viewmoreCandidate_"+jobId).append('<div><img src = "' + IMAGE_PATH + '/loading_medium_purple.gif"></div>');
			 }
			 if(currentCandidateShortlisted != null) {
				 currentCandidateShortlisted.abort();
			 }
		 },
		 success : function(jsonData) {
			 if(hitType=="tab"){
				 $(".candidates_"+jobId).empty();
			 }
			 var availableCandidates = jsonData.availabiltyStatus.isMoreCandidatesAvailable;
			 if((jsonData.candidatesList).length>0){
				 // if candidates found :)
				 var html='';
				 if(hitType=="tab"){
					 html+='<div class="candidates-outer_'+jobId+'">';
				 }
				 for(var i=0;i<(jsonData.candidatesList).length;i++){
					 var jsonArr = '{&quot;user_id&quot;:'+(jsonData.candidatesList)[i]['ilookUser']['id']+',&quot;showTags&quot;:&quot;false&quot;,&quot;showBookmark&quot;:&quot;true&quot;,&quot;showReportAbuse&quot;:&quot;true&quot;,&quot;showlinkStatus&quot;:&quot;false&quot;,&quot;showGroups&quot;:&quot;false&quot;,&quot;showRemoveFromBookmark&quot;:&quot;false&quot;,&quot;showParentCss&quot;:0,&quot;shortProfileView&quot;:&quot;candidateShortProfile&quot;,&quot;showShortListCandidateOption&quot;:&quot;false&quot;,&quot;showRemoveShortListCandidateOption&quot;:&quot;true&quot;,&quot;showDeleteApplicant&quot;:&quot;true&quot;,&quot;jobID&quot;:'+jobId+'}';
					
					 html+='<div class="bookmarks-profile-img candidateName_'+(jsonData.candidatesList)[i]['ilookUser']['id']+'" style="width:52px; margin-right:10px;position:relative;">';
					 html+='<div style="width:50px; height:50px;display:table-cell;cursor:pointer;vertical-align:middle;text-align:center;border:1px solid #ccc;">';
					 html+='<a id="'+(jsonData.candidatesList)[i]['ilookUser']['id']+'" href="javascript:;" onClick="getShortProfile(this,\''+jsonArr+'\')">';
					 html+='<img src="'+(jsonData.candidatesList)[i]['ilookUser']['professional_image']+'">';
					 html+='</a>';
					 html+='</div><span>'+(jsonData.candidatesList)[i]['ilookUser']['firstname'];
					 html+='</span>';
					 //    popup start here...
					 html+='<div id="candidateShortProfile-outer_'+(jsonData.candidatesList)[i]['ilookUser']['id']+'" style="display:none;" class="quickview-outer" visibility="on">';
					 html+='<div class="arrow-second">';
					 html+='<img width="36" style="margin-left:255px;" height="22" src="http://localhost/ilook/public/images/arrow-purple2.png">';
					 html+='</div>';
					 html+='<div style="height:560px !important;" id="candidateShortProfile_'+(jsonData.candidatesList)[i]['ilookUser']['id']+'" class="quickview">';
					 html+='</div>';
					 html+='</div>';
					 // popup end here...
					 html+='</div>';
				 }
				 if(hitType=="tab"){
					 html+='</div>';
					 html+='<div style="background: none repeat scroll 0% 0% rgb(244, 244, 244); text-align: center; width: 100%; float: left; margin-top: 10px; padding: 5px; border: 1px solid rgb(220, 220, 220);height:18px;" class="viewmoreCandidate_'+jobId+'">';
					 html+='<a href="javascript:;" style="color:#6C518F;text-decoration:none;" onclick="getCandidates('+jobId+')">View More</a>';
					 html+='</div>';
					 $(".candidates_"+jobId).append(html);
				 }
				 else{
					 $(".viewmoreCandidate_"+jobId).empty();
					 $(".viewmoreCandidate_"+jobId).append('<a href="javascript:;" style="color:#6C518F;text-decoration:none;" onclick="getApplicants('+jobId+')">View More</a>');
					 $(".candidates-outer_"+jobId).append(html);
				 }
			 }
			 else{
				 if(hitType=="tab"){
					 $(".candidates_"+jobId).html("<center>Not Found!!!</center>");
				 }	 
			 }
			 $(".candidates_"+jobId).attr("candidates","displayed");
			 $("#recordCandidateInitialPoint").val(parseInt(recordInitial)+parseInt(3));
			 if(availableCandidates==0){
				 $(".viewmoreCandidate_"+jobId).fadeOut("slow");
			 }
			 
			 /*if(jsonData.length>0){
				 // if candidates found :)
				 var html='';
				 for(var i=0;i<jsonData.length;i++){
					 var jsonArr = '{&quot;user_id&quot;:'+jsonData[i]['ilookUser']['id']+',&quot;showTags&quot;:&quot;false&quot;,&quot;showBookmark&quot;:&quot;true&quot;,&quot;showReportAbuse&quot;:&quot;true&quot;,&quot;showlinkStatus&quot;:&quot;false&quot;,&quot;showGroups&quot;:&quot;false&quot;,&quot;showRemoveFromBookmark&quot;:&quot;false&quot;,&quot;showParentCss&quot;:0,&quot;shortProfileView&quot;:&quot;candidateShortProfile&quot;,&quot;showShortListCandidateOption&quot;:&quot;false&quot;,&quot;showRemoveShortListCandidateOption&quot;:&quot;true&quot;,&quot;showDeleteApplicant&quot;:&quot;true&quot;,&quot;jobID&quot;:'+jobId+'}';
					
					 html+='<div class="bookmarks-profile-img candidateName_'+jsonData[i]['ilookUser']['id']+'" style="width:52px; margin-right:10px;position:relative;">';
					 html+='<div style="width:50px; height:50px;display:table-cell;cursor:pointer;vertical-align:middle;text-align:center;border:1px solid #ccc;">';
					 html+='<a id="'+jsonData[i]['ilookUser']['id']+'" href="javascript:;" onClick="getShortProfile(this,\''+jsonArr+'\')">';
					 html+='<img src="'+jsonData[i]['ilookUser']['professional_image']+'">';
					 html+='</a>';
					 html+='</div><span>'+jsonData[i]['ilookUser']['firstname'];
					 html+='</span>';
					 //    popup start here...
					 html+='<div id="candidateShortProfile-outer_'+jsonData[i]['ilookUser']['id']+'" style="display:none;" class="quickview-outer" visibility="on">';
					 html+='<div class="arrow-second">';
					 html+='<img width="36" style="margin-left:255px;" height="22" src="http://localhost/ilook/public/images/arrow-purple2.png">';
					 html+='</div>';
					 html+='<div style="height:560px !important;" id="candidateShortProfile_'+jsonData[i]['ilookUser']['id']+'" class="quickview">';
					 html+='</div>';
					 html+='</div>';
					 // popup end here...
					 html+='</div>';
				 }
				 $(".candidates_"+jobId).append(html);
			 }
			 else{
				 $(".candidates_"+jobId).html("<center>Not Found!!!</center>");
			 }
			 $(".candidates_"+jobId).attr("candidates","displayed");*/
		 }
	 });					 
}
function getApplicants(jobId,hitType){
	 var recordInitial = $("#recordInitialPoint").val();
	 currentApplicantRequest = $.ajax({
		 url : "/" + PROJECT_NAME + "job/get-applicants",
		 method : "POST",
		 data : "job_id="+jobId+"&recordStart="+recordInitial,
		 type : "post",
		 dataType : "json",
		 beforeSend: function(){
			 if(hitType=="tab"){
				 $(".applicants_"+jobId).empty();
				 $(".applicants_"+jobId).html("<center>Loading....</center>");				 				 
			 }
			 else{
				 $(".viewmore_"+jobId).empty();
				 $(".viewmore_"+jobId).append('<div><img src = "' + IMAGE_PATH + '/loading_medium_purple.gif"></div>');
			 }
			 if(currentApplicantRequest != null) {
				 currentApplicantRequest.abort();
			 }
		 },
		 success : function(jsonData) {
			 if(hitType=="tab"){
				 $(".applicants_"+jobId).empty();
			 }
			 var availableCandidates = jsonData.availabiltyStatus.isMoreCandidatesAvailable;
			 if((jsonData.applicantsList).length>0){
				 // if candidates found :)
				 var html='';
				 if(hitType=="tab"){
					 html+='<div class="applicant-outer_'+jobId+'">';
				 }
				 for(var i=0;i<(jsonData.applicantsList).length;i++){
					 var jsonArr = '{&quot;user_id&quot;:'+(jsonData.applicantsList)[i]['ilookUser']['id']+',&quot;showTags&quot;:&quot;false&quot;,&quot;showBookmark&quot;:&quot;true&quot;,&quot;showReportAbuse&quot;:&quot;true&quot;,&quot;showlinkStatus&quot;:&quot;false&quot;,&quot;showGroups&quot;:&quot;false&quot;,&quot;showRemoveFromBookmark&quot;:&quot;false&quot;,&quot;showParentCss&quot;:0,&quot;showShortListCandidateOption&quot;:&quot;true&quot;,&quot;showRemoveShortListCandidateOption&quot;:&quot;false&quot;,&quot;showDeleteApplicant&quot;:&quot;true&quot;,&quot;jobID&quot;:'+jobId+'}';
					
					 html+='<div class="bookmarks-profile-img applicantName_'+(jsonData.applicantsList)[i]['ilookUser']['id']+'" style="width:52px; margin-right:10px;position:relative;">';
					 html+='<div style="width:50px; height:50px;display:table-cell;cursor:pointer;vertical-align:middle;text-align:center;border:1px solid #ccc;">';
					 html+='<a id="'+(jsonData.applicantsList)[i]['ilookUser']['id']+'" href="javascript:;" onClick="getShortProfile(this,\''+jsonArr+'\')">';
					 html+='<img src="'+(jsonData.applicantsList)[i]['ilookUser']['professional_image']+'">';
					 html+='</a>';
					 html+='</div><span>'+(jsonData.applicantsList)[i]['ilookUser']['firstname'];
					 html+='</span>';
					 //    popup start here...
					 html+='<div id="view-outer_'+(jsonData.applicantsList)[i]['ilookUser']['id']+'" style="display:none;" class="quickview-outer" visibility="on">';
					 html+='<div class="arrow-second">';
					 html+='<img width="36" style="margin-left:255px;" height="22" src="http://localhost/ilook/public/images/arrow-purple2.png">';
					 html+='</div>';
					 html+='<div style="height:560px !important;" id="view_'+(jsonData.applicantsList)[i]['ilookUser']['id']+'" class="quickview">';
					 html+='</div>';
					 html+='</div>';
					 // popup end here...
					 html+='</div>';
				 }
				 if(hitType=="tab"){
					 html+='</div>';
					 html+='<div style="background: none repeat scroll 0% 0% rgb(244, 244, 244); text-align: center; width: 100%; float: left; margin-top: 10px; padding: 5px; border: 1px solid rgb(220, 220, 220);height:18px;" class="viewmore_'+jobId+'">';
					 html+='<a href="javascript:;" style="color:#6C518F;text-decoration:none;" onclick="getApplicants('+jobId+')">View More</a>';
					 html+='</div>';
					 $(".applicants_"+jobId).append(html);
				 }
				 else{
					 $(".viewmore_"+jobId).empty();
					 $(".viewmore_"+jobId).append('<a href="javascript:;" style="color:#6C518F;text-decoration:none;" onclick="getApplicants('+jobId+')">View More</a>');
					 $(".applicant-outer_"+jobId).append(html);
				 }
			 }
			 else{
				 if(hitType=="tab"){
					 $(".applicants_"+jobId).html("<center>Not Found!!!</center>");
				 }	 
			 }
			 $(".applicants_"+jobId).attr("applicants","displayed");
			 $("#recordInitialPoint").val(parseInt(recordInitial)+parseInt(3));
			 if(availableCandidates==0){
				 $(".viewmore_"+jobId).fadeOut("slow");
			 }
		 }
	 });					 
}
/**
 * function used to move applicants to Shortlisted listing
 * @param jobId, profileId
 * @author Sunny Patial
 */
function moveToShortList(jobId, profileId){
	var ids = addLoadingImage($("#moveShortListed_"+profileId), "after");
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
				
				$(".alert-box").remove();
				$(".alert-box1").remove();
				$(".alert-box2").remove();
				showDefaultMsg( "Applicant shortlisted successfully.", 1 );
			}
			else{
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
 * @author Sunny Patial
 */
function removeFromShortList(jobId, profileId){
	var ids = addLoadingImage($("#removeShortListed_"+profileId), "after");
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
				$(".candidateName_"+profileId).remove();
				$(".alert-box").remove();
				$(".alert-box1").remove();
				$(".alert-box2").remove();
				showDefaultMsg( "Applicant removed from shortlisted list.", 1 );
			}
			else{
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
 * @author Sunny Patial
 */
function deleteApplicant(jobId, profileId){
	var ids = addLoadingImage($("#delete_"+profileId), "after");
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
				$(".candidateName_"+profileId).remove();
				$(".applicantName_"+profileId).remove();
				$(".alert-box").remove();
				$(".alert-box1").remove();
				$(".alert-box2").remove();
				showDefaultMsg( "Applicant deleted successfully.", 1 );
			}
			else{
				$(".alert-box").remove();
				$(".alert-box1").remove();
				$(".alert-box2").remove();
				showDefaultMsg( "Error due to server, please try again.", 2 );
			}
		 }
	 });
}
/**
 * function used to filtered jobs in ascending or descending order.
 * @param filterType
 * @author Sunny Patial
 */
function filterJobs(filterType){
	window.loaction.href=window.location.protocol + "//" + window.location.host + window.location.pathname + "/filter/" + filterType;
}