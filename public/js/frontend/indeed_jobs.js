/**
 * Js created for managing indeed jobs.
 *
 * @author ssharma4
 * @version 1.0
 */
$(document).ready(function(){
	//Display indeed jobs on page load.
	MoreIndeedJobs();
	//Validate search form.
	$( "form#advance_search" ).validate({
		rules: {
			job_title:{
				required : true
			}
		},
	});
	//Call indeedJobsSearch function on form valid.
	$("input#advanced_search").click(function(){

		if( $( "form#advance_search" ).valid() == true )
		{
			indeedJobsSearch($(this));
		}
	});

});

/**
 * Populates listing of jobs on submition
 * of indeed jobs search form.
 * Currently, search is working for any random keyword.
 *
 * @param elem (button which clicked)
 * @author ssharma4
 * @version 1.0
 */
function indeedJobsSearch( elem )
{
	$("div#job_list_holder").empty();
	if( typeof elem != 'undefined' )
	{
		elem.hide();
		var idd = addLoadingImage( elem, 'before', 'loading_small_purple.gif', 61, 24 );
	}

	var dataa =  "keyword="+$("#job_title").val()+"&offset=" + 0;
	if( $("#job_type").val() !="")
	{
		dataa+="&job_type="+$("#job_type").val();
	}
	if( $("#search_type").val() !="")
	{
		dataa+="&search_type="+$("#search_type").val();
	}
	if( $("#radius").val() !="")
	{
		dataa+="&radius="+$("#radius").val();
	}
	if( $("#place").val() !="")
	{
		dataa+="&place="+$("#place").val();
	}
	if( $("#fromage").val() !="")
	{
		dataa+="&fromage="+$("#fromage").val();
	}
	jQuery.ajax({
		url: "/" + PROJECT_NAME + "job/more-indeed-jobs",
		type: "POST",
		dataType: "json",
		data: dataa,
		timeout: 50000,
		success: function(jsonData) {

			$("span#"+idd).remove();
			if( typeof elem != 'undefined' )
			{
				elem.fadeIn();
			}

			$("div#job_list_holder").html("");
			$("div.message_box").remove();

			if( jsonData.error != 0 )
			{
				showDefaultMsg( jsonData.error, 3 );
			}
			else
			{
				var searchResultBar = '';
				searchResultBar += '<div class="search_result_bar" id = "search_result_header_bar" >';
				searchResultBar += '<div style="margin: 3px 0 5px !important;">';
				searchResultBar += '<h3>Search Result</h3>';
				searchResultBar += '</div>';
				searchResultBar += '</div>';
				$("div#job_list_holder").append(searchResultBar);
				if( jsonData.job!="") {
					for( i in jsonData.job )
					{
						if(jsonData.job[i].indeedApply == "false") {
							jsonData.job[i].indeedApply = 1;
						} else {
							jsonData.job[i].indeedApply = 0;
						}

						if(jsonData.job[i].expired == "true") {
							jsonData.job[i].expired = 1;
						} else {
							jsonData.job[i].expired = 0;
						}
						//Create job template.
						job = jobTemplateMaker( jsonData.job[i].jobtitle,
							jsonData.job[i].company,
							jsonData.job[i].source,
							jsonData.job[i].country,
							jsonData.job[i].state,
							jsonData.job[i].city,
							jsonData.jobType,
							jsonData.job[i].formattedRelativeTime,
							jsonData.job[i].jobkey,
							jsonData.job[i].indeedApply,
							jsonData.job[i].job_desc,
							jsonData.job[i].url,
							jsonData.job[i].expired);

						$("div#job_list_holder").append(job);
					}
					//Setting offset.
					$("input#offsett").val( parseInt( jsonData.current_search_criteria.end[0]) + 1 );
				} else {
					showDefaultMsg( "No jobs available for this search criteria.", 1 );
				}

				if( jsonData.is_more_jobs > 0 )
				{
					var job = "";
					job += '<div class="job-content view_more">';
					job += '<p>  <a href="javascript:;" onclick = "MoreIndeedJobs()" class=" text-purple-link fr">View More</a> </p>';
					job += '</div>';
					$("div#job_list_holder").append( job );
				}
			}
		}
	});
}

/**
 * Populates listing of indeed jobs on view more click as well as on page load.
 *
 * @author ssharma4
 * @version 1.0
 */
function MoreIndeedJobs()
{
	$("div.view_more p a").html("<img src = '"+IMAGE_PATH+"/loading_small_purple.gif'>");

	if( $("input#offsett").val() > 0 &&  $("#job_title").val()!="") {
		var dataa =  "keyword="+$("#job_title").val()+"&offset=" + $("input#offsett").val();
	}
	if($("input#offsett").val() > 0 &&  $("#job_title").val()==""){
		var dataa =  "keyword=&offset=" + $("input#offsett").val();
	}

	jQuery.ajax({
		url: "/" + PROJECT_NAME + "job/more-indeed-jobs",
		type: "POST",
		dataType: "json",
		data: dataa,
		timeout: 50000,
		success: function(jsonData) {

			$("div.view_more").remove();
			if( jsonData.error != 0 )
			{
				showDefaultMsg( jsonData.error, 3 );
			}
			else
			{
				if(jsonData.job!="") {
					for( i in jsonData.job )
					{
						if(jsonData.job[i].indeedApply == "false") {
							jsonData.job[i].indeedApply = 1;
						} else {
							jsonData.job[i].indeedApply = 0;
						}

						if(jsonData.job[i].expired == "true") {
							jsonData.job[i].expired = 1;
						} else {
							jsonData.job[i].expired = 0;
						}
						//Create job template.
						job = jobTemplateMaker( jsonData.job[i].jobtitle,
							jsonData.job[i].company,
							jsonData.job[i].source,
							jsonData.job[i].country,
							jsonData.job[i].state,
							jsonData.job[i].city,
							jsonData.jobType,
							jsonData.job[i].formattedRelativeTime,
							jsonData.job[i].jobkey,
							jsonData.job[i].indeedApply,
							jsonData.job[i].job_desc,
							jsonData.job[i].url,
							jsonData.job[i].expired);

						$("div#job_list_holder").append(job);


					}
					if (jsonData.current_search_criteria.end ) {
						//Setting offset.
						$("input#offsett").val( parseInt( jsonData.current_search_criteria.end[0]) + 1 );
					}

				} else {
					showDefaultMsg( "No jobs available for this search criteria.", 1 );
				}

				if( jsonData.is_more_jobs > 0 )
				{
					var job = "";
					job += '<div class="job-content view_more">';
					job += '<p>  <a href="javascript:;" onclick = "MoreIndeedJobs()" class=" text-purple-link fr">View More</a> </p>';
					job += '</div>';
					$("div#job_list_holder").append( job );
				}
			}
		}
	});
}
/**
 * Highlight job on which user want to apply for job.
 *
 * @author ssharma4
 * @version 1.0
 */

function showQuickApplyView(elem)
{
	window.onbeforeunload = function(e){
		return "On leaving the page your form will be reset.";
	};
	var job_id = $(elem).attr("rel");
	$("div.job-content-border.job-content").slideUp();

	if ($("div#job-id-"+job_id).hasClass("recommended-job-bg-grey"))
	{ 
		$("div#job-id-"+job_id).removeClass("recommended-job-bg-grey");
		$("div#outerDiv_"+job_id).removeClass("job-active-bdr");
		$("div#job-id-"+job_id).removeClass("remove-side-border");
	}
	else
	{
		$("div.remove-bg-gray").removeClass("recommended-job-bg-grey");
		$("div.highlight_on_hover").removeClass("job-active-bdr");
		$("div.mail-grey-hdr-col1").removeClass("remove-side-border");

		$("div#job-id-"+job_id).addClass("recommended-job-bg-grey");
		$("div#outerDiv_"+job_id).addClass("job-active-bdr");
		$("div#job-id-"+job_id).addClass("remove-side-border");

	}

	$("div#job-form-"+job_id).toggle();

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

	if(responseText.is_success == 1)
	{
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


		//Side click slide up functionality.
		$(document).mouseup(function (e)
		{
			var containerr = $("div#job-form-"+responseText.job_id );

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
		$( "#dialog_error_job_apply p" ).text(responseText.msg);
		//Show dialog after sharing.
		$( "#dialog_error_job_apply" ).dialog( "open" );
		$("#dialog_error_job_apply")
			.delay(3000)
			.queue(function(){
				$(this)
					.dialog("close")
					.dequeue(); // take this function out of queue a.k.a dequeue a.k.a notify done
								// so the next function on the queue continues execution...
			});

	}

	$("form#applicant_form input#apply_job_btn").siblings("span.loading").remove();
	$("form#applicant_form input#apply_job_btn").fadeIn();
}


/**
 * Creates template for a job listing.
 * when job posted by him self then quick apply button should be invisible
 *
 * @param job_title
 * @param company_name
 * @param industry_name
 * @param country
 * @param state
 * @param city
 * @param jobType
 * @param time_of_post
 * @param job_id
 * @param is_applied [ true if job applied by current user ]
 * @param is_job_active [ true if job not expired by indeed job api ]
 * @param job_desc
 * @param comply_job_apply_url
 *
 * @author jsingh7,ssharma4
 * @version 1.0
 *
 */
function jobTemplateMaker( job_title,
						   company_name,
						   industry_name,
						   country,
						   state,
						   city,
						   jobType,
						   time_of_post,
						   job_id,
						   can_apply_for_job,
						   job_desc,
						   comply_job_apply_url,
						   is_job_expired
)
{


	var job = "";
	job += '<div class="search-job-single bg-grey">';
	job += '<div class="new-border-space"></div>';

	job += '<div class="highlight_on_hover"  id="outerDiv_'+job_id+'">';
	job += '<div class="mail-grey-hdr-col1 remove-bg-gray" id="job-id-'+job_id+'">';

/*	job +='<div style=" border: medium none !important;" class="search_job_img_outer">';
	job += '<div class="search_job_img_inner">';

	job += '</div>';
	job += '</div>';*/
	job += '<div class="mid">';
	job += '<h4 class="job-title-arial" >'+'<a style="text-decoration:none !important;" class="text-purple-link job_listing_job_title"  target="_blank" href = "'+comply_job_apply_url+'">'+job_title+'</a></h4>';
	job += '<p>';

	job += '<span  class="job_listing_company_name">'+company_name+'</span>';
	job += '</p>';
	job += '<p class="job_listing_industry_location">'+industry_name+', '+country+', '+state+', '+city+'</p>';
	job += '<p class="font-arial job_listing_salary_exp">'+jobType+' </p>';
	job += '</div>';
	job += '<div class="right">';
	job += '<div class="top">'+time_of_post+'</div>';
	job += '<div class="apply-2-job-rt"><a class="quick-apply-btn text-purple-link" onclick = "showQuickApplyView(this)" id = "quick_apply_'+job_id+'" rel="'+job_id+'" ><span>Quick Apply</span></a></div>';

	job += '</div>';
	job += '</div>';

	/*job += '<div style=" position:relative; z-index:1; margin-bottom: 0px; width: 97% !important; padding:0 1.5% !important" class=" job-content remove-bg-gray" id="job-content_'+job_id+'">';
*/

	//Job is applied by logged in user and job is active to be applied and posted by some other user.
	job += '<div  id="quick_apply_bar_'+job_id+'" class="apply-2-job  text-purple">';


	job +='<div class="mid">';
	job+='</div>';



	job += '</div>';
	job += '</div>';
	job += '</div>';
	//Hidden part for quick apply.
	// start of job form
	job += '<form id="applicant_form_'+job_id+'" name="applicant_form_'+job_id+'" method="POST" action="/'+ PROJECT_NAME +'job/apply-job" enctype="multipart/form-data" >';
	job += '<div class="job-content job-content-border" style="margin-bottom: 0px; display:none;" id="job-form-'+job_id+'">';
	job += '<div class = "apply-from-company quick_apply " id = "quick_apply_'+job_id+'" ><a href = "'+comply_job_apply_url+'" target = "_blank">Apply</a></div>';

	job += '</div>';
	job += '</form>';
	job += '</div>';
	// end of job form

	return job;
}

