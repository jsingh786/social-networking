var currentStateRequest = null;
var currentCityRequest = null;
var currentApplicantRequest = null;
var currentCandidateShortlisted = null;
var moveCandidateToShortlist = null;
var removeCandidateFromShortlist = null;
var deleteCandidate = null;
$(document).ready(function(){
	getApplicantsAndCandidates();
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
	//Alert box for closing a job in active jobs detail page.
    $( "div#close_job_dialog_confirm_active" ).dialog({
	      modal: true,
	      autoOpen: false,
	      resizable: false,
	      width: 596,
	      show: {
	    	  effect: "fade"
	    	  },
    	  close:function() {
	  			$( this ).dialog( "close" );
	  			//Setting drop down previous value.
	  			$( $(this).data('thisss') ).val( $.data( $(this).data('thisss'), 'current' ) );
	  		},
		  hide: {
			  effect: "fade"
			  },
	      buttons: {
	    	 OK: function() {
	    		$( this ).dialog( "close" );
	    		closingTheJobForActiveJobs( $( $(this).data('thisss') ).attr("id") );
	    		},
	    	Cancel: function() {
    			$( this ).dialog( "close" );
    			//Setting drop down previous value.
    			$( $(this).data('thisss') ).val( $.data( $(this).data('thisss'), 'current' ) );
    		}
	    }
    });
    //Alert box for changing expiry date of job (renew) in active jobs detail page.
    $( "div#renew_job_dialog_box_active" ).dialog({
	      modal: true,
	      autoOpen: false,
	      draggable:false,
	      resizable: false,
	      width: 280,
	      height:'auto',
	      show: {
	    	  effect: "fade"
	    	  },
	      close:function() {
	  			$( this ).dialog( "close" );
	  			//Setting drop down previous value.
	  			$( $(this).data('renew_select_box') ).val( $.data( $(this).data('renew_select_box'), 'current' ) );
	  		},
		  hide: {
			  effect: "fade"
			  },
	      buttons: {
	    	 Renew: function() {
	    		$( this ).dialog( "close" );
	    		renewJobExpiryDateForActiveJobs( $( $(this).data('renew_select_box') ).attr("id"),$('input#job_expiry_date').val(),  $( $(this).data('renew_select_box') ));
	    		}/*,
  		Cancel: function() {
  			$( this ).dialog( "close" );
  			//Setting drop down previous value.
  			$( $(this).data('renew_select_box') ).val( $.data( $(this).data('renew_select_box'), 'current' ) );
  			}*/
	    }
  });
    //Alert box for closing a job in expired jobs detail page.
    $( "div#close_job_dialog_confirm_expire" ).dialog({
    	modal: true,
    	autoOpen: false,
    	resizable: false,
    	width: 596,
    	show: {
    		effect: "fade"
    	},
    	close:function() {
    		$( this ).dialog( "close" );
    		//Setting drop down previous value.
    		$( $(this).data('thisss1') ).val( $.data( $(this).data('thisss1'), 'current' ) );
    	},
    	hide: {
    		effect: "fade"
    	},
    	buttons: {
    		OK: function() {
    			$( this ).dialog( "close" );
    			closingTheJobForExpiredJobs( $( $(this).data('thisss1') ).attr("id") );
    		},
    		Cancel: function() {
    			$( this ).dialog( "close" );
    			//Setting drop down previous value.
    			$( $(this).data('thisss1') ).val( $.data( $(this).data('thisss1'), 'current' ) );
    		}
    	}
    });
  //Alert box for changing expiry date of job (renew) in expired jobs detail page.
    $( "div#renew_job_dialog_box_expire" ).dialog({
    	modal: true,
    	autoOpen: false,
    	draggable:false,
    	resizable: false,
    	width: 280,
    	height:'auto',
    	open: function(){
    		jQuery('.ui-widget-overlay').click(function(){
    			$("input#job_expiry_date").blur();
    		})
    	},
    	show: {
    		effect: "fade"
    	},
    	close:function() {
    		$( this ).dialog( "close" );
    		//Setting drop down previous value.
    		$( $(this).data('renew_select_box1') ).val( $.data( $(this).data('renew_select_box1'), 'current' ) );
    	},
    	hide: {
    		effect: "fade"
    	},
    	buttons: {
    		OK: function() {
    			$( this ).dialog( "close" );
    			renewJobExpiryDateForExpiredJobs( $( $(this).data('renew_select_box1') ).attr("id"),$('input#job_expiry_date').val(),  $( $(this).data('renew_select_box') ));
    		},
    		Cancel: function() {
    			$( this ).dialog( "close" );
    			//Setting drop down previous value.
    			$( $(this).data('renew_select_box1') ).val( $.data( $(this).data('renew_select_box1'), 'current' ) );
    		}
    	}
    });
    //Alert box for deleting a job.
    $( "div#delete_job_dialog_confirm1" ).dialog({
	      modal: true,
	      autoOpen: false,
	      draggable:false,
	      resizable: false,
	      width: 520,
	      show: {
	    	  effect: "fade"
	    	  },
		  hide: {
			  effect: "fade"
			  },
	      buttons: {
	    		 OK: function() {
	 	    		$( this ).dialog( "close" );
	 	    		deletingTheJob( $( $(this).data('delete_job_dialog') ).attr("id") );
	 	    		},
    		Cancel: function() {
    			$( this ).dialog( "close" );
    			//Setting drop down previous value.
    			// $( $(this).data('thisss') ).val( $.data( $(this).data('thisss'), 'current' ) );
    		}
	    }
    });
    // close links popup on click of cross button.
	$("img.close_popup").click(function(){
		$('div#gmail_popup').bPopup().close();
	});
	
	//Share in side popup click.
	$("input#share_job_with").click(function()
	{
		shareJob(this);
	});
});
//applying datepicker for renew job popup.
//added by hkaur5
$(function()
{
	//Applying datepicker-------------
	$("div.renew_job div").datepicker({
		dateFormat: 'dd-mm-yy',
		changeMonth: true,
        changeYear: true,
        maxDate: '30D',
        minDate: '0',
        onClose: function(dateText, inst) {
        	
        },
        onSelect: function( selectedDate ) {
    		$("#date_to").datepicker( "option", "minDate", selectedDate );
    		$("input#job_expiry_date").val(selectedDate);
    	}
        //showButtonPanel: true,
		});
});
function shareBtnOption(){
	$("input.chk_all").click(function(){
		if($("input.chk_all").prop('checked') == true){
			//  $("input.gmail_cb").prop("checked",true);
			$("#gmail_import").fadeIn();
		}
		else{
			// $("input.gmail_cb").prop("checked",false);
			$("#gmail_import").fadeOut();
		}
	}); 
	
	$("input.gmail_cb").click(function(){
		if(parseInt($("input.gmail_cb:checked").length)>0){
			$("#gmail_import").fadeIn();
		}
		else{
			$("#gmail_import").fadeOut();
		} 
	 });
}
/**
 * Perform action according to the option selected in selectbox.
 * @param elem
 * @author hkaur5
 */
function performAction( elem )
{
	var action = $(elem).val();
	var element = elem;
	var jobId = $(elem).attr('id');
	switch( action )
	{
		case '1':
			promptBeforeClosingAJobInActiveJobs( element );
			break;
		case '2':
			promptForRenewingAJobInActiveJobs( element , jobId);
			break;
		case '3':
			shareJobPopup( element );
			break;
		case '4':
			promptBeforeClosingAJobInExpiredJobs( element );
			break;
		case '5':
//			promptForRenewingAJobInExpiredJobs( element , jobId);
			promptForRenewingAJobInActiveJobs( element , jobId);
			break;
		case '7':
			promptBeforeDeletingJob( element );
			break;
	}
}
/**
 * prompts an alert to ask for setting status of job to close.
 * @param elem
 * @author hkaur5
 */
function promptBeforeClosingAJobInActiveJobs( elem )
{   
    $( "div#close_job_dialog_confirm_active" ).data('thisss', elem).dialog( "open" );
}
/**
 * Set status of job to closed.
 * @param job_id
 * @author hkaur5
 */
function closingTheJobForActiveJobs( job_id )
{
	var jobb_id = job_id;
	__addOverlay();
	$.ajax({
		url : "/" + PROJECT_NAME + "job/set-job-status-closed",
		method : "POST",
		data : { 'job_id' : job_id },
		type : "post",
		dataType : "json",
		beforeSend: function(){
			
		 },
		success : function(jsonData) 
		{
			__removeOverlay();
//			$("tr#"+jobb_id).slideUp();
			window.location.href = "/"+PROJECT_NAME+"job/active-jobs";
		}
	});	
}
/**
 * Prompts a dialog box to renew a job when renew option is selected frokm actions.
 * @author hkaur5
 * @param elem
 */
function promptForRenewingAJobInActiveJobs( elem , jobId)
{   
	$('div#append_div').remove();
	__addOverlay();
	$.ajax({
		url : "/" + PROJECT_NAME + "job/get-job-detail",
		method : "POST",
		data : { 'job_id' : jobId },
		type : "post",
		dataType : "json",
		beforeSend: function(){
			
		 },
		success : function(jsonData) 
		{
			var html = '';
			html += '<div id="append_div">';
			html += '<div class="chkbx-img img" style="float: left; width: auto;">';
			html += '<div style="width: 60px; border: 1px solid rgb(196, 196, 196); vertical-align: middle; text-align: center; margin: auto; float: none;">';
			html += '<img style="max-height: 60px; max-width: 60px;" src="http://localhost/ilook/public/Imagehandler/GenerateImage.php?image='+ PROJECT_URL+'/'+ PROJECT_NAME +'public/images/jobs/'+ jsonData.job_image +'&amp;h=60&amp;w=60">';
			html += '</div>';
			html += '</div>';
			html += '<div class="mid" style="margin: 0px 0px 0px 10px; float: left; text-align: left; width: 330px;">';
			html += '<h4 style="cursor: default;">'+ jsonData.job_title +' | <font>'+ jsonData.job_reference +'</font></h4>';
			html += '<p style="cursor: default;">'+jsonData.company_name+'</p>';
			html += '<p style="cursor: default;">'+ jsonData.industryTitle +', '+ jsonData.job_location +'</p>';
			html += '<p style="cursor: default;">'+ jsonData.salary +' | '+ jsonData.jobTypeTitle +' | '+ jsonData.experience +'</p>';
			html +='</div>';
			html += '<div style="width: 100%; float: left; text-align: left; margin: 10px 0px; border-top: 1px solid rgb(149, 149, 149); padding: 10px 0px;" class="right">';
			html += '<div class="top" style="width: auto; float: left;">Posted Job : '+ jsonData.postedDate +' </div>';
			html += '<div id="save_job_button_holder_1067" class="bot" style="float: right;">';
			html += 'Expired Job : '+ jsonData.expiry_date +'';
			html += '</div>';
			html += '</div>';
			html += '<div style="width:100%; float:right;">New expiry date :</div>';
			html += '</div>';
			$(".job_expiry_date").parent().prepend(html);
			__removeOverlay();
		}
	});	
    $( "div#renew_job_dialog_box_active" ).data('renew_select_box', elem).dialog( "open" );
}
/**
 * Change expiry date of job and set to the new date selected.
 * @author hkaur5
 * @param job_id
 * @param string new_expiry_date
 * @param current_select_box
 */
function renewJobExpiryDateForActiveJobs( job_id, new_expiry_date, current_select_box)
{
	var jobb_id = job_id;
	var select_box = current_select_box;
	var expiry_date = new_expiry_date;
	__addOverlay();
	$.ajax({
		url : "/" + PROJECT_NAME + "job/set-new-expiry-date-of-job",
		method : "POST",
		data : { 'job_id' : job_id , 'expiry_date' : new_expiry_date},
		type : "post",
		dataType : "json",
		beforeSend: function(){
			
		 },
		success : function(jsonData) {
			if(jsonData)
			{
				__removeOverlay();
				window.location.href="/"+PROJECT_NAME+"job/active-jobs";
			}
			else
			{
				window.location.href="/"+PROJECT_NAME+"job/active-jobs";
			}
		}
	});	
}
/**
 * prompts an alert to ask for setting status of job to close.
 * @param elem
 * @author hkaur5
 */
function promptBeforeClosingAJobInExpiredJobs( elem )
{   
	$( "div#close_job_dialog_confirm_expire" ).data('thisss1', elem).dialog( "open" );
}
/**
 * Set status of job to closed.
 * @param job_id
 * @author hkaur5
 */
function closingTheJobForExpiredJobs( job_id )
{
	var jobb_id = job_id;
	__addOverlay();
	$.ajax({
		url : "/" + PROJECT_NAME + "job/set-job-status-closed",
		method : "POST",
		data : { 'job_id' : job_id },
		type : "post",
		dataType : "json",
		beforeSend: function(){
			
		},
		success : function(jsonData) 
		{
			__removeOverlay();
//			$("tr#"+jobb_id).slideUp();
			window.location.href="/"+PROJECT_NAME+"job/expired-jobs";
		}
	});	
}
/**
* Prompts a dialog box to renew a job when renew option is selected frokm actions.
* @author hkaur5
* @param elem
*/
function promptForRenewingAJobInExpiredJobs( elem )
{   
	$( "div#renew_job_dialog_box_expire" ).data('renew_select_box1', elem).dialog( "open" );
}
/**
* Change expiry date of job and set to the new date selected.
* @author hkaur5
* @param job_id
* @param string new_expiry_date
* @param current_select_box
*/
function renewJobExpiryDateForExpiredJobs( job_id, new_expiry_date, current_select_box)
{
	var jobb_id = job_id;
	var select_box = current_select_box;
	var expiry_date = new_expiry_date;
	__addOverlay();
	$.ajax({
		url : "/" + PROJECT_NAME + "job/set-new-expiry-date-of-job",
		method : "POST",
		data : { 'job_id' : job_id , 'expiry_date' : new_expiry_date},
		type : "post",
		dataType : "json",
		beforeSend: function(){
			
		},
		success : function(jsonData)
		{
			if(jsonData)
			{
				__removeOverlay();
				window.location.href="/"+PROJECT_NAME+"job/expired-jobs";
			}
			else
			{
				window.location.href="/"+PROJECT_NAME+"/job/expired-jobs";
			}
			
		}
	});	
}
/**
 * Prompts a dialog box to confirm from user to delete a job.
 * @author hkaur5
 * @param elem
 */
function promptBeforeDeletingJob( elem )
{   
    $( "div#delete_job_dialog_confirm1").data('delete_job_dialog', elem).dialog( "open" );
}
/**
 * Deletes the current job.
 * @param hkaur5
 * @author job_id
*/
function deletingTheJob( job_id )
{
	var jobb_id = job_id;
	__addOverlay();
	$.ajax({
		url : "/" + PROJECT_NAME + "job/delete-multiple-jobs",
		method : "POST",
		data : "jobIDs="+jobb_id,
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			if(jsonData.msg=="success")
			{
				__removeOverlay();
				window.location.href="/"+PROJECT_NAME+"/job/closed-jobs";
			}
			else
			{
				window.location.href="/"+PROJECT_NAME+"/job/closed-jobs";
			}
		}
	});	
}
function shareJobPopup(elem){
	__addOverlay();
	ShowContactsPopup(elem.id, elem);
}
/**
 * Show links popup,
 * fetches and show up links
 * to add for share job.
 * 
 * @author Sunny Patial
 */
function ShowContactsPopup(id, elem)
{
	var selectBox = $(elem);
	ajax_call = jQuery.ajax(
	{
        url: "/" + PROJECT_NAME + "job/get-my-links",
        type: "POST",
        dataType: "json",
        data: {},
        timeout: 50000,
        success: function(jsonData) {
        	if( jsonData )
        	{
	        	__removeOverlay();
	        	accessHtml = "";
	        	var counter = 0;
	        	accessHtml += '<input type="hidden" name="UjobId" id="UjobId" value="'+id+'" /><ul class="select-all-contacts-ul"><li><label><span><input type="checkbox" id = "gmail_main_cb" name="gmail_main_cb" value="" class="chk_all" /></span><span><b>Select All</b></span></label></li></ul>';
	        	accessHtml += '<ul>';
	        	
		    		for( i in jsonData )
		    		{
		    			
		    			accessHtml += '<li class = "mail_contacts">';
		    			accessHtml += '<span class = "import_cb">';
		    			accessHtml += '<input type="checkbox" class = "gmail_cb" name="emails[]" value="'+i+'" rel = "'+ jsonData[i].user_id +'" rel1 = "'+ jsonData[i].first_name +'" rel2 = "'+ jsonData[i].last_name +'" rel3 = "'+ jsonData[i].email +'" />';
		    			accessHtml += '</span>';
		    			accessHtml += "<div class='contact_img'><div style = 'width:25px; height:25px; display : table-cell; vertical-align: middle; text-align: center;'>" + "<img style = 'max-width: 25px; max-height: 25px; border: medium none ! important;' src='" + jsonData[i].prof_image + "' title='" + jsonData[i].first_name + " " + jsonData[i].last_name + "'/></div></div>" + "<div style='display: inline-block; padding-left: 10px;'><div class='full_name'>" +showCroppedText( jsonData[i].first_name+ " " +jsonData[i].last_name, 15) + "</div><div class='email'>" + jsonData[i].email + "</div></div></li>";
		            	counter++;
		    		}
	        	
	        	
	    		accessHtml += '</ul>';
	    		
	            $("#modal_contacts").html(accessHtml);
	        	
	        	$('#gmail_popup').bPopup({
	        	    easing: 'easeOutBack', //uses jQuery easing plugin
	                speed: 1000,
	                transition: 'slideDown',
					closeClass : 'close_bpopup',
	                onClose:function()
	                {
	                	$(selectBox ).val( $.data(selectBox , 'current' ) );
	                },
	                onOpen: function() {
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
	            		$("#modal_contacts").html("<label>Oops! No contacts found to send message.</label>");
	            	}
	    		});
	        	shareBtnOption();
        	}
        	else
        	{
        		__removeOverlay();
        		$("div.message_box").remove();
        		showDefaultMsg( "You do not have any links. You may search a person to add him/her to send link request.", 1 );
        	}	
        }
	});
}
/**
 * Makes ajax call for sharing
 * a job.
 * 
 * @param job_id
 * @param elem
 * @author spatial
 */
function shareJob( elem ){
	var usersStr = "";
	$.each( $("input.gmail_cb:checked"), function( key, value ) {
		usersStr += $(value).attr("rel")+",";
		});
	var element = elem;
	$(elem).hide();
	var idd = addLoadingImage( $(elem), 'before', 'loading_medium_purple.gif', 94, 20 );
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "job/share-job",
        type: "POST",
        dataType: "json",
        data: { 'job_id' : $("#UjobId").val(), 'users_str' : usersStr },
//		cache: false,
        timeout: 50000,
        success: function(jsonData) {
        	//Show dialog after sharing.
        	if( jsonData == 1 )
        	{
        		$('span#'+idd).remove();
        		$(element).fadeIn();
        		$('div#gmail_popup').bPopup().close();
        		showDefaultMsg( "Job shared successfully.", 1 );
        	}
        	else
        	{
        		$('span#'+idd).remove();
        		$(element).fadeIn();
        		$('div#gmail_popup').bPopup().close();
        		showDefaultMsg( "Job not shared, please try again.", 2 )
        	}
        }
	});
}
function getApplicantsAndCandidates(){
	$(".applicants_"+$("#jobId").val()).slideToggle("slow");
	getApplicants($("#jobId").val(), "tab");
	$(".candidates_"+$("#jobId").val()).slideToggle("slow");
	getCandidates($("#jobId").val(),"tab");
}

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
					 var uFname = (jsonData.candidatesList)[i]['ilookUser']['firstname'];
					 if(parseInt(uFname.length)>8){
						 uFname = uFname.substr(0,8)+"..";
					 }
					 html+='</div><span>'+uFname;
					 html+='</span>';
					 //    popup start here...
					 html+='<div id="candidateShortProfile-outer_'+(jsonData.candidatesList)[i]['ilookUser']['id']+'" style="display:none;" class="quickview-outer" visibility="on">';
					 html+='<div class="arrow-second">';
					 html+='<img width="36" style="margin-left:255px;" height="22" src="/'+PROJECT_NAME+'public/images/arrow-purple2.png">';
					 html+='</div>';
					 html+='<div style="height:auto !important;" id="candidateShortProfile_'+(jsonData.candidatesList)[i]['ilookUser']['id']+'" class="quickview">';
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
					 $(".candidates_"+jobId).html("<center>No record found!</center>");
				 }	 
			 }
			 $(".candidates_"+jobId).attr("candidates","displayed");
			 $("#recordCandidateInitialPoint").val(parseInt(recordInitial)+parseInt(3));
			 if(availableCandidates==0){
				 $(".viewmoreCandidate_"+jobId).fadeOut("slow");
			 }
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
					 var uFname = (jsonData.applicantsList)[i]['ilookUser']['firstname'];
					 if(parseInt(uFname.length)>8){
						 uFname = uFname.substr(0,8)+"..";
					 }
					 html+='</div><span>'+uFname;
					 html+='</span>';
					 //    popup start here...
					 html+='<div id="view-outer_'+(jsonData.applicantsList)[i]['ilookUser']['id']+'" style="display:none;" class="quickview-outer" visibility="on">';
					 html+='<div class="arrow-second">';
					 html+='<img width="36" style="margin-left:255px;" height="22" src="/'+PROJECT_NAME+'public/images/arrow-purple2.png">';
					 html+='</div>';
					 html+='<div style="height:auto !important;" id="view_'+(jsonData.applicantsList)[i]['ilookUser']['id']+'" class="quickview">';
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
					 $(".applicants_"+jobId).html("<center>No record found!</center>");
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
 * @author spatial
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
				$("#moveShortListed_"+profileId).removeAttr("onclick");
				$("#moveShortListed_"+profileId).html("Candidate Shortlisted");
				$("#moveShortListed_"+profileId).removeClass("text-grey2-link");
				$("#moveShortListed_"+profileId).css("color","#48545E");
				$("#moveShortListed_"+profileId).css("text-decoration","none");
				$("#moveShortListed_"+profileId).css("cursor","default");
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
 * @author spatial
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
				$("#view_"+profileId).removeAttr("popupcontent");
				$(".candidateName_"+profileId).remove();
				if( $(".candidates-outer_"+jobId).is(':empty') ){
					$(".candidates_"+jobId).empty();
					$(".candidates_"+jobId).html("<center>No record found!</center>");
				} 
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
 * @author spatial
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
				if( $(".applicant-outer_"+jobId).is(':empty') ){
					$(".applicants_"+jobId).empty();
					$(".applicants_"+jobId).html("<center>No record found!</center>");
				} 
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