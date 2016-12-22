var getRecommendedJobs = null;

$(document).ready(function(){

	
	$("input#offset").val(0);

	getMoreRecommendedJobs();
	
	 $("#viewMoreBtn").click(function(){
		 	getMoreRecommendedJobs();
	    });
    //Fillup form according to saved search.
	if( $("input#search_id[type=hidden]").val() )
	{	
	    if( $("input#search_id[type=hidden]").val().length > 0 )
	    {
	    	populateAdvSearchForm( $("input[type=hidden]#search_id").val() );
	    }
	}
    
  //Alert box for error message.
    $( "div#dialog_error_job_apply1" ).dialog({
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
    
	//Alert box for success message.
    $( "div#dialog_success_job_apply" ).dialog({
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
});
/**
 * Highlights job on mouse hover.
 * @param elem
 * @author hkaur5
 */
function highlightJob(elem)
{
	var job_id = $(elem).attr("rel");
	$(elem).addClass('hightlighted_job');
	$("div#job-content_"+job_id).addClass('highlighted_job');
	$("a#more_detail_"+job_id).addClass('highlighted_job_links');
	$("a#quick_apply_"+job_id).addClass('highlighted_job_links');
	
}
/**
* Saved To Unsave Job
* @param elem
* @param job_id
* @author nsingh3
* 
*/
function savedToUnsaveJob(elem , job_id)
{	
	$(".text-purple a#saved_job_"+job_id ).css('display','none');
	$(".text-purple a#unsave_job_"+job_id ).css('display','block');

}
/**
* Unsave To Saved Job 
* @param elem
* @param job_id
* @author nsingh3
* 
*/
function unsaveToSavedJob(elem , job_id)
{	
	$(".text-purple a#unsave_job_"+job_id ).css('display','none');
	$(".text-purple a#saved_job_"+job_id ).css('display','block');
	
}
/**
* Unsave current job.
* @param elem
* @param job_id
* @author nsingh3
* 
*/
function UnsaveJob( elem, job_id)
{
	var element = elem;
	
	$(".text-purple a#saved_job_"+job_id ).remove();
	
	addLoadingImage( $(elem), 'before', 'loading_small_purple.gif');
	$(".text-purple a#unsave_job_"+job_id ).remove();
	var job_idd = job_id;
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "job/unsave-job",
        type: "POST",
        dataType: "json",
        data: {'job_id' : job_id},
        timeout: 50000,
        success: function(jsonData) {
        	var html = '';
        	if( jsonData == 1 )
        	{
        	html +='<a class="save-icon" href="javascript:;" onclick="saveJob(this, '+ job_id +')" title="Save job">';
        	html += '<span>Save</span>';
			html += '</a>';
        	}
        	else{
        		html +='<a href="javascript:;" onmouseover="savedToUnsaveJob(this, '+job_id+')" style="display:block;" id="saved_job_'+job_id+'" class="text-purple-link" style="cursor:default;">';
        		html += 'Job Saved';
        		html += '</a>';
        		html += '<a href="javascript:;" onmouseout="unsaveToSavedJob(this, '+job_id+')"  id="unsave_job_'+job_id+'" style="display:none;" onclick="UnsaveJob(this, '+job_id+')" class="text-purple-link" style="cursor:default;">';
        		html += 'Unsave';
        		html += '</a>';
        	}
        	$("div#save_job_button_holder_"+job_id).addClass('apply-2-job-lt');
        	$("div#save_job_button_holder_"+job_id+" span").hide();
        	$("div#save_job_button_holder_"+job_id).append(html);


        }
	});
}

/**
* show quick apply view.
* @version 1.1
* @author nsingh3
*/
function showQuickApplyView(elem)
{
	window.onbeforeunload = function(e){
			return "On leaving the page your form will be reset.";
	};
	
	$("div.job-content.quick_apply").slideUp();
	
	var elem_id = $(elem).attr("id");
	var job_id = $(elem).attr("rel");
	
	if ( $("div#job-content_"+job_id).hasClass("recommended-job-bg-grey") )
	{
		$("div#job-content_"+job_id).removeClass("recommended-job-bg-grey");
		$("div#job-id-"+job_id).removeClass("recommended-job-bg-grey");
		$("div#outerDiv_"+job_id).removeClass("job-active-bdr");
		$("job-id-"+job_id).css("border-right", "4px solid #C4C4C4");
		$("div#job-id-"+job_id).removeClass("remove-side-border");
	}
	else
	{
    	$("div.remove-bg-gray").removeClass("recommended-job-bg-grey");
    	$("div.highlight_on_hover").removeClass("job-active-bdr");
    	$("div#job-content_"+job_id).addClass("recommended-job-bg-grey");
    	$("div#job-id-"+job_id).addClass("recommended-job-bg-grey");
    	$("div#outerDiv_"+job_id).addClass("job-active-bdr");
    	$("div.mail-grey-hdr-col1").removeClass("remove-side-border");
    	$("div#job-id-"+job_id).addClass("remove-side-border");
    }
	$("div#"+elem_id).toggle();
}

/**
 *
 *
 *
 */
function applyFormValidate(job_id){
	var options = {
          beforeSubmit:  showRequest,  // pre-submit callback 
          success:       showResponse,  // post-submit callback 
          dataType : 'json',
          clearForm : false
      };
	// bind form using 'ajaxForm'
	$("form#applicant_form_"+job_id).ajaxForm(options);
   //Validations----------------
  	  	validator = $( "form#applicant_form_"+job_id ).validate({
  	  		rules: {
  	  			applicant_cv:{
  	  				required : true
  	  			}
  	  		}
  	  	});
  	  	//End validations------------
  	  	if( $( "form#applicant_form_"+job_id ).valid() )
  		{
  	  			$("input#apply_job_btn_"+job_id).hide();
		    	addLoadingImage( $("input#apply_job_btn_"+job_id), "before", "loading_small_purple.gif", 100, 20 );
		    	$("div.alert-box").remove();
		    	$("div.alert-box2").remove();
		    	$('form#applicant_form_'+job_id).submit();
  		}
	// end apply to job from validationi
}
//pre-submit callback 
function showRequest(formData, jqForm, options) {
    // formData is an array; here we use $.param to convert it to a string to display it 
    // but the form plugin does this for you automatically when it submits the data 
    //var queryString = $.param(formData); 
    
    // jqForm is a jQuery object encapsulating the form element.  To access the 
    // DOM element for the form do this: 
    // var formElement = jqForm[0]; 
 
    //alert('About to submit: \n\n' + queryString); 
 
    // here we could return false to prevent the form from being submitted; 
    // returning anything other than false will allow the form submit to continue 
    return true; 
}
 
// post-submit callback 
function showResponse(responseText, statusText, xhr, $form)  {
    // for normal html responses, the first argument to the success callback 
    // is the XMLHttpRequest object's responseText property
 
    // if the ajaxForm method was passed an Options Object with the dataType 
    // property set to 'xml' then the first argument to the success callback 
    // is the XMLHttpRequest object's responseXML property
 
    // if the ajaxForm method was passed an Options Object with the dataType 
    // property set to 'json' then the first argument to the success callback 
    // is the json data object returned by the server
	if(responseText.is_success == 1){
		//Removes apply job.
		$("div.bdr-btm_"+responseText.job_id+" input#apply_job_btn_"+responseText.job_id).remove();
		
		//Appends applied button in place of apply. 
		$("div.bdr-btm_"+responseText.job_id).append('<input name="Applied" type="button" class="btn-purple-lt fr" value="Applied" alt="Appled" title="Appled" />');
		//Removes the loader.
		$("div.bdr-btm_"+responseText.job_id+" span").hide();
		
		//Removes quick apply link and replace it with applied.
		$("div#quick_apply_bar_"+responseText.job_id+" a#quick_apply_"+responseText.job_id).remove();
		$("div#quick_apply_bar_"+responseText.job_id).append('<a style="margin-right: 4px ! important;" class="quick-apply-btn text-purple-link applied"> Applied </a>');
		//Remove save job div when job is applied.
		$("div#save_job_button_holder_"+responseText.job_id).remove();	
		//replace classes.
		$("div#quick_apply_bar_"+responseText.job_id).removeClass("apply-2-job");
		$("div#quick_apply_bar_"+responseText.job_id).addClass("no_apply-2-job");
		$("div#quick_apply_"+responseText.job_id).addClass("no_more_apply");
		
		//Side click slide up functionality.
		$(document).mouseup(function (e)
		{
			var containerr = $("div#quick_apply_"+responseText.job_id+".no_more_apply");
	    	
	    	if (!containerr.is(e.target) // if the target of the click isn't the container...
	    			&& containerr.has(e.target).length === 0) // ... nor a descendant of the container
	    	{
	    		containerr.slideUp();
	    		//To remove the classes added at time of expandeing quick apply. 
	    		$("div#job-content_"+responseText.job_id).removeClass("recommended-job-bg-grey");
	    		$("div#job-id-"+responseText.job_id).removeClass("recommended-job-bg-grey");
	    		$("div#outerDiv_"+responseText.job_id).removeClass("job-active-bdr");
	    	}
		});
		//reset the form fields after job applied
		document.getElementById("applicant_form_"+responseText.job_id).reset();

		//Unbinding the window before Unload event.
		window.onbeforeunload = null;
		
		
		//Show dialog after sharing.
		$( "#dialog_success_job_apply" ).dialog( "open" );
        
        $("#dialog_success_job_apply")
        .delay(3000)
        .queue(function(){
            $(this)
                .dialog("close")
                .dequeue(); // take this function out of queue a.k.a dequeue a.k.a notify done
                            // so the next function on the queue continues execution...
        });
	}else{
		//showDefaultMsg( "Failure while loading updates, Please try again.", 3 );
		$("div.bdr-btm_"+responseText.job_id+" span").hide();
	
		$("input#apply_job_btn_"+responseText.job_id).show();
		$( "div#dialog_error_job_apply1 p" ).text(responseText.msg);
		//Show dialog after sharing.

        $( "div#dialog_error_job_apply1" ).dialog( "open" );
	}


	$("form#applicant_form input#apply_job_btn").siblings("span.loading").remove();
	$("form#applicant_form input#apply_job_btn").fadeIn();
}



function saveJob(elem, job_id)
{
	var element = elem;
	$(elem).hide();
	var idd = addLoadingImage( $(elem), 'before', 'loading_small_purple.gif');
	var job_idd = job_id;
	
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "job/save-job",
        type: "POST",
        dataType: "json",
        data: {'job_id' : job_id},

        timeout: 50000,
        success: function(jsonData) {
        	//Show dialog after sharing.
        	if( jsonData.status == 1 )
        	{
        		$('a#unsave_job a').css('background','none');
        		var html = '';
        		html +='<a href="javascript:;" onmouseover="savedToUnsaveJob(this, '+job_id+')" style="display:block;" id="saved_job_'+job_id+'" class="text-purple-link" style="cursor:default;">';
        		html += 'Job Saved';
        		html += '</a>';
        		html += '<a href="javascript:;" onmouseout="unsaveToSavedJob(this, '+job_id+')"  id="unsave_job_'+job_id+'" style="display:none;" onclick="UnsaveJob(this, '+job_id+')" class="text-purple-link" style="cursor:default;">';
        		html += 'Unsave';
        		html += '</a>';
        		
        		$("div#save_job_button_holder_"+job_idd).html(html);

        	}	
        }
	});
}

/**
 * This is used for initial listing
 * and get more listing
 * 
 * @author spatial
 */
function getMoreRecommendedJobs()
{
	$('div.share_location_msg').remove();
	__addOverlay();
	
	var recordInitial = $("#offset").val();
	var recordLimit = $("#recordLimit").val();

	getRecommendedJobs = $.ajax({
		url : "/" + PROJECT_NAME + "job/get-more-recommended-jobs",
		method : "POST",
		data : { "offset" : recordInitial, "recordLimit" : recordLimit },
		type : "post",
		dataType : "json",
		beforeSend: function()
		{
			$("#viewMoreBtn").empty();
			$("#viewMoreBtn").append('<img style="margin-top: 10px;" src = "' + IMAGE_PATH + '/loading_small_purple.gif">');
			if(getRecommendedJobs != null) 
			{
				getRecommendedJobs.abort();
			}
		},
		success : function( jsonData )
		{
			$("div.job-content.view_more").remove();
			var availableJobs = jsonData.availabiltyStatus.isJobAvailable;
			if( jQuery.isEmptyObject(jsonData.jobsList) )
			{
				var html = "";
				
				html += '<div class="no_messages">';
				html += '<div class="no_messages-img"><img height="" width="" src="'+IMAGE_PATH+'/icon-round-bag.png"></div>';
				html +=	'<div class="no_messages-data">No Recommendations to be displayed, Please update your profile.</div>';
				html += '</div>';
				$("#jobslisting").append(html);
				
				__removeOverlay();
				return;
			}
			
			if((jsonData.jobsList).length >0 )
			{
				var html='';
				for( var i=0; i < (jsonData.jobsList).length; i++ )
				{
					//console.log(jsonData.jobsList[i]);
					html+='<div class="single-joblisting">';
					html+='<div class = "highlight_on_hover" id = "outerDiv_'+jsonData.jobsList[i].jobId+'">';
					html+='<div class="mail-grey-hdr-col1 remove-bg-gray" id="job-id-'+jsonData.jobsList[i].jobId+'">';
					html+='<div class="job_detail_img_outer">';
					html+='<a class=" text-purple-link" href="'+PROJECT_URL+PROJECT_NAME+'job/job-detail/job_id/'+jsonData.jobsList[i].jobId+'">';
					html+='<div class="job_detail_img_inner">';
					html+='<img style="max-width:60px;max-height:60px" src="'+PUBLIC_PATH+'/Imagehandler/GenerateImage.php?image='+jsonData.jobsList[i].companyLogo+'&h=60&w=60">';
					html+='</div>';
					html+='</a>';
					html+='</div>';
					html+='<div class="mid">';
					html+='<h4 class="font-arial" ><a style="color:#6C518F !important;" class="job_listing_job_title text-purple-link" href="'+PROJECT_URL+PROJECT_NAME+'job/job-detail/job_id/'+jsonData.jobsList[i].jobId+'">'+jsonData.jobsList[i].jobTitle+'</a></h4>';
					html+='<p class="job_listing_company_name">';
					html+=jsonData.jobsList[i].companyName;
					html+='</p>';
					html+='<p class="job_listing_industry_location">'+jsonData.jobsList[i].industryTitle+'</p>';

					html+=jsonData.jobsList[i].jobTypeTitle+' | '+jsonData.jobsList[i].experienceYearTitle+'</p>';
					html+='</div>';	
					html+='<div class="right">';
					html+='<div class="top">'+jsonData.jobsList[i].postedDate+'';
					html+='</div>';
					html+='<div class="mid">';
					html+='</div>';
					html+='</div>';
					html+='</div>';

					html+='<div class=" job-content remove-bg-gray " id="job-content_'+jsonData.jobsList[i].jobId+'" style="height: 25px !important; width:97% !important;">';
					
					if(jsonData.jobsList[i].jobAppStatus==1)
					{
						html+='<div id ="quick_apply_bar_'+jsonData.jobsList[i].jobId+'" class="no_apply-2-job text-purple">';
					}
					else
					{
						html+='<div id ="quick_apply_bar_'+jsonData.jobsList[i].jobId+'" class="apply-2-job text-purple">';
					}

					
					if( jsonData.jobsList[i].jobSaveStatus == 1 )
					{
						
						html+='<div class="bot text-purple" id="save_job_button_holder_'+jsonData.jobsList[i].jobId+'" style="width: 100px; float: left; margin-left:21px !important;">';
						html +='<a href="javascript:;" onmouseover="savedToUnsaveJob(this, '+jsonData.jobsList[i].jobId+')" style="display:block;" id="saved_job_'+jsonData.jobsList[i].jobId+'" class="text-purple-link" style="cursor:default;">';
		        		html += 'Job Saved';
		        		html += '</a>';
		        		html += '<a href="javascript:;" onmouseout="unsaveToSavedJob(this, '+jsonData.jobsList[i].jobId+')"  id="unsave_job_'+jsonData.jobsList[i].jobId+'" style="display:none;" onclick="UnsaveJob(this, '+jsonData.jobsList[i].jobId+')" class="text-purple-link" style="cursor:default;">';
		        		html += 'Unsave';
		        		html += '</a>';		
					}
					else
					{
						html+='<div class="apply-2-job-lt text-purple" id="save_job_button_holder_'+jsonData.jobsList[i].jobId+'" style="width: 100px; float: left; margin-left:21px !important;">';
						html +='<a class="save-icon" href="javascript:;" onclick="saveJob(this, '+ jsonData.jobsList[i].jobId +')" title="Save job">';
			        	//html += '<img width="14" height="14" alt="" src="'+IMAGE_PATH+'/save-icon.png">';
			        	html += '<span>Save</span>';
						html += '</a>';
					}
					
					html+='</div>';
					if( jsonData.jobsList[i].jobAppStatus==1 )
					{	
						html+='<a style="margin-right: 4px ! important;" class ="applied quick-apply-btn text-purple-link"> Applied </a>';
					}
					else
					{	
						html+='<div class="apply-2-job-rt"><a id="quick_apply_'+jsonData.jobsList[i].jobId+'" rel="'+jsonData.jobsList[i].jobId+'" onclick="showQuickApplyView(this)" href="javascript:;" class="quick-apply-btn text-purple-link"><span>Quick Apply</span></a></div>';
					}

					html+='</div>';
					html+='</div>';
					html+='</div>';
					
					
					html+='<form enctype="multipart/form-data" action="/'+PROJECT_NAME+'job/apply-job" method="POST" name="applicant_form_'+jsonData.jobsList[i].jobId+'" id="applicant_form_'+jsonData.jobsList[i].jobId+'">';
					if( jsonData.jobsList[i].apply_from == 1 )
					{
						html+='<div style="display: none;" id="quick_apply_'+jsonData.jobsList[i].jobId+'" class=" job-content quick_apply job-content-border">';
						html+='<div class=" apply-from-company">';
						html+='<a target = "_blank" href="'+jsonData.jobsList[i].company_job_apply_url+'">Apply</a>';
						html+='</div>';
						html+='</div>';
					}
					else
					{
						html+='<div style="display: none;" id="quick_apply_'+jsonData.jobsList[i].jobId+'" class=" job-content quick_apply job-content-border">';
						html+='<div class="applicant-col1 form-bg-grey" style="margin: 18px 0 10px !important;">';
						html+='<div class="applicant-col1-left">';
						html+='<h3  class="applicant-cv text-grey2 recommended-hdr" >applicant CV</h3>';
						html+='</div>';
						html+='<div class="applicant-col1-left">';
						html+='<input type="file" alt="Upload from computer" value="Upload from computer" name="applicant_cv">';
						html+='</div>';
						html+='</div>';
						html+='<div class="applicant-col1 form-bg-grey">';
						html+='<div class="applicant-col1-left">';
						html+='<h3 class="applicant-cv text-grey2 recommended-hdr" >applicant Cover letter</h3>';
						html+='</div>';
						html+='<div class="applicant-col1-left">';
						html+='<input type="file" title="Upload from computer" alt="Upload from computer" value="Upload from computer" name="application_cl">';
						html+='</div>';
						html+='</div>';
						html+='<div class="applicant-col1 form-bg-grey">';
						html+='<textarea maxlength = "1000" rows="10" cols="" name="applicant_msg" placeholder="">Hi, I am interested in this position and would like to apply for the same. Please have a look into my profile for more details.</textarea>';
						html+='</div>';
						
						html+='<div class="applicant-col1 text-grey2">';
						html+='<h3 class="sub-heading-arial-narrow" style="font-weight:bold;">job description </h3>';
						html+='</div>';
						html+='<div class="applicant-col1 text-grey2">';
						html+=jsonData.jobsList[i].jobDesc;
						html+='</div>';	
						
						html+='<div class="applicant-col1">';
						html+='<input type="hidden" value="'+jsonData.jobsList[i].jobId+'" id="job_id" name="job_id">';
						html+='<div class="bdr-btm_'+jsonData.jobsList[i].jobId+'" style="text-align:right;">';
						
						html+='<input type="button" title="Apply" alt="Apply" value="Apply" class="btn-purple-lt fr" onclick="applyFormValidate('+jsonData.jobsList[i].jobId+')" id="apply_job_btn_'+jsonData.jobsList[i].jobId+'" name="apply_job_btn_'+jsonData.jobsList[i].jobId+'">';
						
						html+='</div>';
						html+='</div>';
						
						html+='</div>';
					}
					
					html+='</form>';
					html+='<div class="new-border-space"></div>';
					html+= '</div>';
				}
				
				$("#jobslisting").append(html);
				if( jsonData.availabiltyStatus.isJobAvailable != 0 )
				{
					$("#jobslisting").append('<div class="job-content view_more"><p>  <a class=" text-purple-link fr" onclick="getMoreRecommendedJobs()" href="javascript:;">View More</a> </p></div>');
				}	
				
				__removeOverlay();
			}
			
			$("#offset").val( parseInt(recordInitial)+parseInt(recordLimit) );
			if(availableJobs==0)
			{
				$("#viewMoreBtn").fadeOut("slow");
			}
		}
	});	
}
