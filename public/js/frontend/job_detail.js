$(document).ready(function()
{
	//$('input#saved_job').attr('disabled','disabled');
	
//Alert box for success message.
	$( "div#dialog_success_job_save" ).dialog({
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
			OK: function() {
				$( this ).dialog( "close" );
			}
		}
	});
	
	
	//Opens links pop up. 
	$("a#share_job.share_enable").click(function(){
//		$("#gmail_import").hide();
		__addOverlay();
		ShowContactsPopup();
	});
	

	// close links popup on click of cross button.
	$("img.close_popup").click(function(){
		$('div#gmail_popup').bPopup().close();
	});
	
	//Share in side popup click.
	$("input#gmail_import_btn").click(function(){
		shareJob(this);
	});
	//Show unsave link when mouse over into saved job
	$("div.job-detail-btn-outer span#saved_span a#saved_job").mouseover(function(){
		$("span#unsave_span").show();
		$("span#saved_span").hide();
	});
	
	
    //Alert box for changing expiry date of job (renew).
    $( "div#renew_job_dialog_box" ).dialog({
	      modal: true,
	      autoOpen: false,
	      draggable:false,
	      resizable: false,
	      width: 280,
	      height:340,
	      show: {
	    	  effect: "fade"
	    	  },
	      close:function() {
	  			$( this ).dialog( "close" );
	  			//Setting drop down previous value.
	  		},
		  hide: {
			  effect: "fade"
			  },
	      buttons: {
	    	 Renew: function() {
	    		$( this ).dialog( "close" );
	    		renewJobExpiryDate( $(this).data('job_id'), $('input#job_expiry_date').val() );
	    		} /*,
  		Cancel: function() {
  			$( this ).dialog( "close" );
  			//Setting drop down previous value.
  			$( $(this).data('renew_select_box') ).val( $.data( $(this).data('renew_select_box'), 'current' ) );
  			}*/
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
		  close: function() {
			  $("[name=select]").val("");
			},
	      buttons: {
	    		 OK: function() {
	 	    		$( this ).dialog( "close" );
	 	    		deletingTheJob( $( $(this).data('delete_job_dialog') ).attr("rel") );
	 	    		},
    		Cancel: function() {
    			$( this ).dialog( "close" );
    			$("[name=select]").val("");
    		}
	    }
    });
});

/**
 * Applying datepicker for renew job popup.
 * 
 * @author jsingh7
 */
$(function()
{
	//Applying datepicker-------------
	$("div#renew_job_dialog_box div").datepicker({
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
				window.location.href="/" + PROJECT_NAME + "job/closed-jobs";
			}
		}
	});	
}
function unsaveToSavedJob(elem , job_id)
{	
	$("span#unsave_span").hide();
	$("span#saved_span").show();
}
/**
* Unsave current job.
* @param elem
* @param job_id
* @author nsingh3
* 
*/
function UnsaveJob( elem, job_id )
{	
	addLoadingImage( $(elem), 'before', 'loading_small_purple.gif', 90, 14);
	$(elem).remove();
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "job/unsave-job",
        type: "POST",
        dataType: "json",
        data: {'job_id' : job_id},
//		cache: false,
        timeout: 50000,
        success: function(jsonData) {
        	
        	if( jsonData == 1 )
        	{
        		//var html ='<input name=""  id ="unsave_job"  style="min-height:24px; min-width:101px; background:#dcdeda !important; cursor:pointer; color:#000;" value="Unsave" alt="Unsave Job" title="Unsave Job" type="button" onclick="UnsaveJob(this, '+job_id+')" onmouseout="unsaveToSavedJob('+job_id+')" />';
        		var html ='<a class="jobdetail-save" href="javascript:;"  id ="unsave_job" alt="Unsave Job" title="Unsave Job" onclick="UnsaveJob(this, '+job_id+')" onmouseout="unsaveToSavedJob('+job_id+')" >Unsave</a>';
        		$("span#unsave_span span.loading").remove();
        		$("span#unsave_span").append(html);
        		$("span#save_span").show();
        		$("span#unsave_span").hide();
        		
        	}
        	else{
        		//var html ='<input name=""  id ="unsave_job"  style="min-height:24px; min-width:101px; background:#dcdeda !important; cursor:pointer; color:#000; " value="Unsave" alt="Unsave Job" title="Unsave Job" type="button" onclick="UnsaveJob(this, '+job_id+')" onmouseout="unsaveToSavedJob('+job_id+')" />';
        		var html ='<a class="jobdetail-save" href="javascript:;"  id ="unsave_job" alt="Unsave Job" title="Unsave Job" onclick="UnsaveJob(this, '+job_id+')" onmouseout="unsaveToSavedJob('+job_id+')" >Unsave</a>';
        		$("span#unsave_span span.loading").remove();
        		$("span#unsave_span").append(html);
        		$("span#saved_span").show();
        		$("span#unsave_span").hide();        		
        	}	
        }
	});
}

/**
 * Redirects to job apply page of given job id.
 * @param jobId
 * @author hkaur5
 */
function redirectToApplyPage( jobId )
{
	window.location = "/"+PROJECT_NAME+"job/apply/jobid/" + jobId;
}

/**
 * Makes ajax call for sharing
 * a job.
 * 
 * @param job_id
 * @param elem
 * @author jsingh7
 */
function shareJob( elem ){
	var usersStr = "";
	$.each( $("input.gmail_cb:checked"), function( key, value ) {
		usersStr += $(value).attr("rel")+",";
		});
	var element = elem;
	$(elem).hide();
	var idd = addLoadingImage( $(elem), 'before', 'loading_medium_purple.gif', 94, 45, 'fix_loader' );
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "job/share-job",
        type: "POST",
        dataType: "json",
        data: { 'job_id' : $("a#share_job").attr("rel"), 'users_str' : usersStr },
//		cache: false,
        timeout: 50000,
        success: function(jsonData) {
        	//Show dialog after sharing.
        	if( jsonData == 1 )
        	{
        		$('span#'+idd).remove();
        		$(element).fadeIn();
        		$('div#gmail_popup').bPopup().close();
        		$("div.message_box").remove();
        		showDefaultMsg( "Job shared successfully.", 1 );
        	}
        	else
        	{
        		$('span#'+idd).remove();
        		$(element).fadeIn();
        		$('div#gmail_popup').bPopup().close();
        		$('.message_box').remove();
        		showDefaultMsg( "Job not shared, please try again.", 2 );
        	}
        }
	});
}


/**
 * Save current job.
 * @param elem
 * @param job_id
 * @author hkaur5, nsingh3
 */
function saveJob(elem, job_id)
{
	addLoadingImage( $(elem), 'before', 'loading_small_purple.gif', 90, 14);
	$(elem).remove();
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "job/save-job",
        type: "POST",
        dataType: "json",
        data: {'job_id' : job_id},
//		cache: false,
        timeout: 50000,
        success: function(jsonData) {
        	//Show dialog after sharing.
        	
        	if( jsonData.status == 1 )
        	{
        		//var html ='<input name=""  onclick = "saveJob(this,'+job_id+')" id ="save_job"  class="btn-purple-lt" value="Save Job" alt="Save Job" title="Save Job" type="button" />';
        		var html ='<a class="jobdetail-save" href="javascript:;" onclick = "saveJob(this,'+job_id+')" id ="save_job"  alt="Save Job" title="Save Job">Save Job</a>';
        		$("span#save_span span.loading").remove();
        		$("span#save_span").append(html);
        		$("span#saved_span").show();
        		$("span#save_span").hide();
        	}else{
        		//var html ='<input name=""  onclick = "saveJob(this,'+job_id+')" id ="save_job"  class="btn-purple-lt" value="Save Job" alt="Save Job" title="Save Job" type="button" />';
        		var html ='<a class="jobdetail-save" href="javascript:;" onclick = "saveJob(this,'+job_id+')" id ="save_job"  alt="Save Job" title="Save Job">Save Job</a>';
        		$("span#save_span span.loading").remove();
        		$("span#save_span").append(html);
        	}	
        }
	});
}
///**
// * Display share button on the basis of checkbox checked status
// * @author Sunny Patial
// */
//function shareBtnOption(){
//	$("input.gmail_cb").click(function()
//	{
//		if(parseInt($("input.gmail_cb:checked").length)>0)
//		{
//			$("#gmail_import").fadeIn();
//		}
//		else
//		{
//			$("#gmail_import").fadeOut();
//		} 
//	 });
//}
/**
 * Show links popup,
 * fetches and show up links
 * to add for share job.
 * 
 * @author hkaur5
 */
function ShowContactsPopup()
{
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
	        	accessHtml += '<ul class="select-all-contacts-ul" ><li><label><span><input type="checkbox"  id = "gmail_main_cb" name="gmail_main_cb" value="" /></span><span><b>Select All</b></span></label></li></ul>';
	        	accessHtml += '<ul>';
	        	
		    		for( i in jsonData )
		    		{
		    			
		    			accessHtml += '<li class = "mail_contacts">';
		    			accessHtml += '<span class = "import_cb">';
		    			accessHtml += '<input type="checkbox" class = "gmail_cb" name="emails[]" value="'+i+'" rel = "'+ jsonData[i].user_id +'" rel1 = "'+ jsonData[i].first_name +'" rel2 = "'+ jsonData[i].last_name +'" rel3 = "'+ jsonData[i].email +'" />';
		    			accessHtml += '</span>';
		    			accessHtml += "<div class='contact_img'><div style = 'width:25px; height:25px; display : table-cell; vertical-align: middle; text-align: center;'>" + "<img style = 'max-width: 25px; max-height: 25px; border: medium none ! important;' src='" + jsonData[i].prof_image + "' title='" + jsonData[i].first_name + " " + jsonData[i].last_name + "'/></div></div>" + "<div style='display: inline-block; padding-left: 10px;'><div class='full_name'>" + showCroppedText(jsonData[i].first_name+ " " +jsonData[i].last_name, 15) + "</div><div class='email'>" + jsonData[i].email + "</div></div></li>";
		            	counter++;
		    		}
	        	
	        	
	    		accessHtml += '</ul>';
	    		
	            $("#modal_contacts").html(accessHtml);
	        	
	        	$('#gmail_popup').bPopup(
	        	{
	        	    easing: 'easeOutBack', //uses jQuery easing plugin
	                speed: 1000,
	                transition: 'slideDown',
					closeClass : 'close_bpopup',
	                onOpen: function() 
	                {
	                	
	                }, 
	    		},
	        	function() 
	        	{
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
//	        	shareBtnOption();
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
 * Prompts a dialog box to renew a job.
 * Inspired from promptForRenewingAJob( elem , jobId ) in jobs_active.js
 * 
 * @author jsingh7
 * @param jobId
 */
function promptForRenewingAJob( jobId )
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
			html += '<img style="max-height: 60px; max-width: 60px;" src="'+PUBLIC_PATH+'/Imagehandler/GenerateImage.php?image='+ jsonData.job_image +'&amp;h=60&amp;w=60">';
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
	
	$( "div#renew_job_dialog_box" ).data('job_id', jobId).dialog( "open" );
}

/**
 * 
 */
function showDialogToLogin()
{
	//$('.ui-dialog:has(#' + $myDialogDiv.attr('id') + ')').empty().remove();
	showDialogMsg('Login', "Please login to continue.", 0,
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
		    dialogClass: "general_dialog_message login_popup",
		    modal:true,
		    height: 200,
		    width: 200
	});
}
/**
 * Change expiry date of job and set to the new date selected.
 * @author hkaur5
 * @param job_id
 * @param string new_expiry_date
 */
function renewJobExpiryDate( job_id, new_expiry_date)
{
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
			//__removeOverlay();
			location.reload();
			//window.location.href= "/"+PROJECT_NAME+"job/expired-jobs";
		}
	});	
}
