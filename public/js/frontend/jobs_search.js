$(document).ready(function(){

//get logged user states list on behalf of selected country.
	fillUpSimpleSearchStateDD();
//get logged user states list,salary on behalf of selected country for advanced search
	fillUpAdvancedSearchStateDD();

	$('input#view_more').val();
	$( "form#simple_search" ).validate({
		rules: {
			job_title:{
				required : true
			}
		},
	});
	$( "form#advance_search" ).validate({
		rules: {
			job_title:{
				required : true 
			}
		},
	});
	$( "form#save_search" ).validate({
		rules: {
			search_name:{
				required : true,
				maxlength: 100
			},
			email_to_recv_alerts:{
				email : true,
				required: {
				      depends: function(element) {
				        return $("select#receive_alerts").val().length;
				        //or whatever you need to check
				      }
				}
			}
		},
	});

	$("input#simple_search").click(function(){
		//Unset view more hidden field.
		$('input#view_more').val();

		//Change search_form value to detect which search to fire.
		$('input#search_form').val('simple');

		if( $( "form#simple_search" ).valid() == true )
		{
			simpleSearch($(this));
		}
	});
	
	$("input#advanced_search").click(function(){
		
		//Unset view more hidden field.
		$('input#view_more').val();
		
		//Change search_form value to detect which search to fire.
		$('input#search_form').val('advanced');
		
		if( $( "form#advance_search" ).valid() == true )
		{
			advancedSearch($(this));
		}
	});
    //Simple search state change.
    $("#simple_state").change(function(){
    	fillUpSimpleSearchCityDD();
    });
    //Advanced search country change.
   	$("#advanced_country").change(function(){
    	fillUpAdvanceSearchSalaryDD();
    });
    //Advanced search city change.
    $("#advanced_state").change(function(){
    	fillUpAdvancedSearchCityDD();
    });
    
    //reseting offset field.
    $("input#offsett").val(0);
    
    //Autocomplete plugin for company textfield.
    autoComplete( "input[name=company]", "/" + PROJECT_NAME + "profile/get-all-companies" );
    
    //Save search click.
    $("input#saved_search").click(function()
    {
		if( $( "form#save_search" ).valid() == true )
		{
			saveSearch($(this));
		}
    });
    
    //Fillup form according to saved search.
    if( $("input[type=hidden]#search_id").val().length > 0 )
    {
    	populateAdvSearchForm( $("input[type=hidden]#search_id").val() );
    }	
 
    
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
    
  //Alert box for error message.
    $( "div#dialog_error_job_apply" ).dialog({
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
    //Alert box for success message on unsaving job.
    $( "div#dialog_success_job_unsave" ).dialog({
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
    
    //Show/hide advanced search panel
    $("div.jobs-rt-hdr").click(function(){
    	 $( "div.jobs-rt-content" ).slideToggle( function() {
    		 if($("div.jobs-rt-content").is(":hidden"))
    		 {
    			 $("div.jobs-rt-hdr div.slide-down h3").css({"background": "url('"+IMAGE_PATH+"/plus_grey.png')" +
    			 "no-repeat scroll 145px center rgba(0, 0, 0, 0)","color":"#6E6E6E"});
     			 $("div.jobs-rt-hdr").css("background",'#FFF none repeat scroll 0% 0%');
    		 }
    		 else
    		 {
    			$("div.jobs-rt-hdr div.slide-down h3").css({"background": "url('"+IMAGE_PATH+"/minus-new.png') " +
    			"no-repeat scroll 145px center rgba(0, 0, 0, 0)","color":"#ffffff"});
     			$("div.jobs-rt-hdr").css("background",'#6C518F none repeat scroll 0% 0%');
     			
    		 }
    	});
    });
    
   
    $("span.edit_email_span").click(function()
    {
    	$("input.email_for_alerts_filled").attr('enabled','enabled');
    });
    
    //Doubleclick to enable email field.
    $("input#email_to_recv_alerts").dblclick(function(){
    	$(this).removeAttr("readonly");
    	$(this).css("background", "#FFFFFF");
    });
    
   
    // commonSearchByJobTitle
    commonSearchByJob( $("#commonSearchByJobTitle").val());
   
});

	/**
	 * 
	 * @author nsingh3 [initaited], jsingh7 [completed the function]
	 */
	function commonSearchByJob(searchJobTitle)
	{
		if(searchJobTitle != "")
		{
			 $("#advance_search_dd").getSetSSValue('jobs');
			 $("div.advance-search-textbox input#search").val(searchJobTitle);
			 simpleSearch( $("form#simple_search input#simple_search") );
		}
	}

/**
 * Function used Fade In and Out saved searches popup.
 * @author hkaur5
 */
function showSavedSearchPopup(){
	$("#grp-pop").fadeToggle();
}

//Date picker implementation.
$(function() {
	$( "#date_from" ).datepicker({
	dateFormat: 'dd-mm-yy',
	showOn: "both",
//	showOn: "button",
	buttonText: "Calendar",
	buttonImage: IMAGE_PATH+"/icon-calendar-pink.png",
	buttonImageOnly: true,
	changeMonth: true,
    changeYear: true,
    onSelect: function( selectedDate ) {
		$("#date_to").datepicker( "option", "minDate", selectedDate );
	}
	});
});
$(function() {
	$( "#date_to" ).datepicker({
		dateFormat: 'dd-mm-yy',
		changeMonth: true,
        changeYear: true,
        buttonText: "Calendar",
        showOn: "both",
		buttonImage: IMAGE_PATH+"/icon-calendar-pink.png",
		buttonImageOnly: true,
		onSelect: function( selectedDate ) {
			$("#date_from").datepicker( "option", "maxDate", selectedDate );
		}
	});
});

/**
 * Function triggers functions for
 * view more listing.
 * 
 * @author jsingh7
 * @version 1.0
 */
function triggerViewMoreListing()
{
    //View more jobs for simple and advanced search.
	$('input#view_more').val(1);
	if( $("input#search_form").val() == "simple" )
	{
		simpleSearchViewMore();
	}
	else if( $("input#search_form").val() == "advanced" )
	{
		advancedSearchViewMore();
	}

}

/**
 * Manages state dropdown acording to country selected,
 * If country selected has no states but cities, it fillup cities
 * in city dropdown.
 * 
 * @author jsingh7
 * @vesion 1.0
 */
function fillUpSimpleSearchStateDD()
{

	$.ajax({
		async:false,
		url : "/" + PROJECT_NAME + "job/get-response-for-country-selected",
		method : "POST",
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			$("#simple_state").html('<option value = "">Select</option>');
			$("#simple_city").html('<option value = "">Select</option>');
			$("#simple_state_div").fadeIn();
			var optionsForStates = "";
			var optionsForCities = "";
			if( jsonData.count > 0 )
			{
				if( jsonData.have_states == 1 )
				{
					optionsForStates += '<option value = "">Select</option>';
					for( i in jsonData.options )
					{
				
						optionsForStates += '<option value = "'+jsonData.options[i]['id']+'"';
							if(parseInt(jsonData.options[i]['id']) == parseInt($.cookie('simple_search_state')))
							{ 
								optionsForStates += 'selected="selected"';
							}
							else if(parseInt(jsonData.options[i]['id']) == parseInt(jsonData.user_seletced_state))
							{
								optionsForStates += 'selected="selected"';
							}
						optionsForStates += '>'+jsonData.options[i]['name']+'</option>';
					}
					$("#simple_state").html(optionsForStates);
					$("#simple_state_div").fadeIn();

				}	
				if( jsonData.have_states == 0 )
				{
					optionsForCities += '<option value = "">Select</option>';
					for( j in jsonData.options )
					{
						optionsForCities += '<option value = "'+jsonData.options[j]['id']+'"';
							if(parseInt(jsonData.options[j]['id']) == parseInt($.cookie('simple_search_city')))
							{ 
								optionsForCities += 'selected="selected"';
							}
							else if(parseInt(jsonData.options[j]['id']) == parseInt(jsonData.user_seletced_city))
							{
								optionsForCities += 'selected="selected"';
							}
						optionsForCities += '>'+jsonData.options[j]['name']+'</option>';
					}
					$("#simple_city").html(optionsForCities);
					$("#simple_state_div").hide();
				}
			}
		}
	});
	return 1;
}
/**
 * Manages city dropdown acording to state selected,
 * 
 * @author jsingh7
 * @vesion 1.0
 */
function fillUpSimpleSearchCityDD()
{
	var state_id = $('#simple_state').val();
	$.ajax({
		async:false,
		url : "/" + PROJECT_NAME + "job/get-response-for-state-selected",
		method : "POST",
		data : {"state_id": state_id},
		
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			var optionsForCities = "";

			optionsForCities += '<option value = "">Select</option>';
			for( i in jsonData.options )
			{
				optionsForCities +='<option value = "'+jsonData.options[i]['id']+'"';
					if(jsonData.options[i]['id'] == $.cookie('simple_search_city'))
					{ 
						
						optionsForCities += 'selected="selected"';
					}
					else if(parseInt(jsonData.options[i]['id']) == parseInt(jsonData.user_seletced_city))
					{
						optionsForCities += 'selected="selected"';
					}
				optionsForCities += '>'+jsonData.options[i]['name']+'</option>';
			}
			$("#simple_city").html(optionsForCities);
		}
	});
	return 1;
}
/**
 * Manages state dropdown acording to country selected,
 * If country selected has no states but cities, it fillup cities
 * in city dropdown.[jsingh7]
 *
 * updated code  for removing country vals used to get state dropdown
 * state dropdown will be displayed which is selected in his profile.[ssharma4]
 *
 * @author jsingh7
 * @author ssharma4
 * @vesion 1.0
 */
function fillUpAdvancedSearchStateDD()
{
	$.ajax({
		async:false,
		url : "/" + PROJECT_NAME + "job/get-response-for-country-selected",
		method : "POST",
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			$("#advanced_state").html('<option value = "">Select</option>');
			$("#advanced_city").html('<option value = "">Select</option>');
			$("#advanced_state_div").fadeIn();
			var optionsForStates = "";
			var optionsForCities = "";
			if( jsonData.count > 0 )
			{
				if( jsonData.have_states == 1 )
				{
					optionsForStates += '<option value = "">Select</option>';
					for( i in jsonData.options )
					{
						optionsForStates += '<option value = "'+jsonData.options[i]['id']+'"';
							if(parseInt(jsonData.options[i]['id']) == parseInt($.cookie('advance_search_state')))
							{ 
								optionsForStates += 'selected="selected"';
							}
							else if(parseInt(jsonData.options[i]['id']) == parseInt(jsonData.user_seletced_state))
							{
								optionsForStates += 'selected="selected"';
							}

						optionsForStates += '>'+jsonData.options[i]['name']+'</option>';
					}
					$("#advanced_state").html(optionsForStates);
					$("#advanced_state_div").fadeIn();

				}	
				if( jsonData.have_states == 0 )
				{
					optionsForCities += '<option value = "">Select</option>';
					for( j in jsonData.options )
					{
						optionsForCities += '<option value = "'+jsonData.options[j]['id']+'"';
						if($.cookie('advance_search_city'))
						{
							if(parseInt(jsonData.options[j]['id']) == parseInt($.cookie('advance_search_city')))
							{ 
								optionsForCities += 'selected="selected"';
							}
							else if(parseInt(jsonData.options[i]['id']) == parseInt(jsonData.user_seletced_city))
							{
								optionsForCities += 'selected="selected"';
							}
						}
						optionsForCities += '>'+jsonData.options[j]['name']+'</option>';
					}
					$("#advanced_city").html(optionsForCities);
					$("#advanced_state_div").hide();
				}	
			}	
			
		}
	});
}
/**
 * Manages state dropdown acording to state selected,
 * 
 * @author jsingh7
 * @vesion 1.0
 */
function fillUpAdvancedSearchCityDD()
{
	var state_id = $('#advanced_state').val();
	$.ajax({
		async:false,
		url : "/" + PROJECT_NAME + "job/get-response-for-state-selected",
		method : "POST",
		data : {"state_id": state_id},
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			var optionsForCities = "";

			optionsForCities += '<option value = "">Select</option>';
			for( i in jsonData.options )
			{
				optionsForCities += '<option value = "'+jsonData.options[i]['id']+'"';
					if(parseInt(jsonData.options[i]['id']) == parseInt($.cookie('advance_search_city')))
					{ 
						optionsForCities += 'selected="selected"';
					}
					else if(parseInt(jsonData.options[i]['id']) == parseInt(jsonData.user_seletced_city))
					{
						optionsForCities += 'selected="selected"';
					}
				optionsForCities += '>'+jsonData.options[i]['name']+'</option>';
			}
			$("#advanced_city").html(optionsForCities);
		}
	});
}
/**
 * Manages salary dropdown acording to country selected.[jsingh7]
 *
 * updated code  for removing country vals used to get salary ranges dropdown
 * Salary ranges dropdown will be displayed which is selected in his profile.[ssharma4]
 *
 * @author jsingh7
 * @author ssharma4
 * @vesion 1.1
 */
function fillUpAdvanceSearchSalaryDD()
{
	$.ajax({
		async:false,
		url : "/" + PROJECT_NAME + "job/get-salary-ranges-by-country",
		method : "POST",
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			var optionsForSalary = "";
			
			optionsForSalary += '<option value = "">Select</option>';
			for( i in jsonData )
			{
				optionsForSalary += '<option value = "'+jsonData[i]['id']+'"';
					if(parseInt(jsonData[i]['id']) == parseInt($.cookie('advance_search_salary')))
					{ 
						optionsForSalary += 'selected="selected"';
					}
				optionsForSalary += '>'+jsonData[i]['Currency_sym']+' '+jsonData[i]['min_salary']+' - '+jsonData[i]['max_salary']+'</option>';
			}
			$("select#salary").html(optionsForSalary);
		}
	});
}

/**
 * Populates listing of jobs on submition
 * of simple search form.
 * 
 * @param elem (button which clicked)
 * @author jsingh7
 * @version 1.0
 */
function simpleSearch( elem )
{
	$("input#offsett").val(0);
	$("input#search_form").val("simple");
	if( typeof elem != 'undefined' )
	{
		elem.hide();
		var idd = addLoadingImage( elem, 'before', 'loading_small_purple.gif', 61, 24 );
	}
	var dataa = $("form#simple_search").serialize() + "&offset=" + 0;
    jQuery.ajax({
        url: "/" + PROJECT_NAME + "job/get-search-results",
        type: "POST",
        dataType: "json",
        data: dataa,
//		cache: false,
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
        	
	        	if( jsonData.job )
	        	{
	        		var searchResultBar = '';
	        		searchResultBar += '<div class="search_result_bar" id = "search_result_header_bar" >';
	        		searchResultBar += '<div style="margin: 3px 0 5px !important;">';
	        		searchResultBar += '<h3>Search Result</h3>';
	        		searchResultBar += '</div>';
	        		searchResultBar += '</div>';
	        		$("div#job_list_holder").append(searchResultBar);
		        	for( i in jsonData.job )
		        	{
		        	
			        	//Create job template.
		        		job = jobTemplateMaker( jsonData.job[i].job_image, jsonData.job[i].job_posted_by, jsonData.job[i].job_title, jsonData.job[i].job_reference, jsonData.job[i].company_name, jsonData.job[i].industry_name, jsonData.job[i].country, jsonData.job[i].state, jsonData.job[i].city, jsonData.job[i].salaryRange, jsonData.job[i].jobType, jsonData.job[i].experieneceLevel, jsonData.job[i].time_of_post, jsonData.job[i].job_id, jsonData.job[i].is_saved, jsonData.job[i].is_applied, jsonData.job[i].can_apply, jsonData.job[i].job_desc, jsonData.job[i].apply_from, jsonData.job[i].company_url, jsonData.job[i].comply_job_apply_url);
	
			        	$("div#job_list_holder").append( job );
			        	//Setting offset.
			        	$("input#offsett").val( parseInt( $("input#offsett").val() ) + 1 );
		        	}
		        	//Scrolling to job list.
		        	goToByScroll("search_result_header_bar");
		        	//Show dialog msg in case user has selected some different country than his/her current location detected through IP.
		           	if(jsonData.show_job_gate_off_warning_msg)
		    		{
		        		showDialogMsg('Country restriction',jsonData.job_gate_off_warning_msg, 15000,
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
	        				    dialogClass: "general_dialog_message fixed_dialog",
	        				    height: 200,
	        				    width: 450
	        					}		
	        				);
		        	}
	        	}
	        	else
	        	{	
	        		showDefaultMsg( "No jobs available for this search criteria.", 1 );
	        
	        	}
	        	

	        	if( jsonData.is_more_jobs > 0 )
	        	{
	        		var job = "";
	        		job += '<div class="job-content view_more">';
	        		job += '<p>  <a href="javascript:;" onclick = "triggerViewMoreListing()" class=" text-purple-link fr">View More</a> </p>';
	        		job += '</div>';
		        	$("div#job_list_holder").append( job );
	        	}
        	}
        }
    });
}

/**
 * Populates listing of jobs on view more click.
 * Chck from hiden field that which form last submited (simple search or advanced search.)
 * 
 * @author jsingh7
 * @version 1.0
 */
function simpleSearchViewMore()
{
	$("div.view_more p a").html("<img src = '"+IMAGE_PATH+"/loading_small_purple.gif'>");
	var dataa = $("form#simple_search").serialize() + "&offset=" + parseInt( $("input#offsett").val()) + "&myLat="+$('input#myLat').val()+ "&myLong="+$('input#myLong').val();
    jQuery.ajax({
        url: "/" + PROJECT_NAME + "job/get-search-results",
        type: "POST",
        dataType: "json",
        data: dataa,
//		cache: false,
        timeout: 50000,
        success: function(jsonData) {
        	$("div.view_more").remove();
        	if( jsonData.error != 0 )
        	{
        		showDefaultMsg( jsonData.error, 3 );
        	}
        	else
        	{	
	        	for( i in jsonData.job )
	        	{
	        		//Create job template.
	        		job = jobTemplateMaker( jsonData.job[i].job_image, jsonData.job[i].job_posted_by, jsonData.job[i].job_title, jsonData.job[i].job_reference, jsonData.job[i].company_name, jsonData.job[i].industry_name, jsonData.job[i].country, jsonData.job[i].state, jsonData.job[i].city, jsonData.job[i].salaryRange, jsonData.job[i].jobType, jsonData.job[i].experieneceLevel, jsonData.job[i].time_of_post, jsonData.job[i].job_id, jsonData.job[i].is_saved, jsonData.job[i].is_applied, jsonData.job[i].can_apply, jsonData.job[i].job_desc, jsonData.job[i].apply_from, jsonData.job[i].company_url,jsonData.job[i].comply_job_apply_url);
		        	
		        	$("div#job_list_holder").append(job);
		        	
		        	//Setting offset.
		        	$("input#offsett").val( parseInt( $("input#offsett").val() ) + 1 );
	        	}
	        	if( jsonData.is_more_jobs > 0 )
	        	{
	        		var job = "";
	        		job += '<div class="job-content view_more">';
	        		job += '<p>  <a href="javascript:;" onclick = "triggerViewMoreListing()" class=" text-purple-link fr">View More</a> </p>';
	        		job += '</div>';
		        	$("div#job_list_holder").append( job );
	        	}
	        	
	        	//Show dialog msg in case user has selected some different country than his/her current location detected through IP.
	           	if(jsonData.show_job_gate_off_warning_msg)
	    		{
	        		showDialogMsg('Country restriction',jsonData.job_gate_off_warning_msg, 15000,
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
        				    dialogClass: "general_dialog_message fixed_dialog",
        				    height: 200,
        				    width: 450
        					}		
        				);
	        	}
        	}
        }
    });
}

/**
 * Populates listing of jobs on submition
 * of advanced search form.
 * 
 * @param elem (button which clicked)
 * @author jsingh7
 * @version 1.0
 */
function advancedSearch( elem )
{
	$("input#offsett").val(0);
	$("input#search_form").val("advanced");
	if( typeof elem != 'undefined' )
	{
		elem.hide();
		var idd = addLoadingImage( elem, 'before', 'loading_small_purple.gif', 61, 24  );
	}
	var dataa = $("form#advance_search").serialize() + "&offset=" + 0;
    jQuery.ajax({
        url: "/" + PROJECT_NAME + "job/get-search-results",
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
	        	if( jsonData.job )
	        	{
	        		var searchResultBar = '';
	        		searchResultBar += '<div class="search_result_bar" id = "search_result_header_bar" >';
	        		searchResultBar += '<div style="margin: 3px 0 5px !important;">';
	        		searchResultBar += '<h3>Search Result</h3>';
	        		searchResultBar += '</div>';
	        		searchResultBar += '</div>';
	        		$("div#job_list_holder").append(searchResultBar);
	        		
		        	for( i in jsonData.job )
		        	{
		        		//Create job template.
		        		job = jobTemplateMaker( jsonData.job[i].job_image, jsonData.job[i].job_posted_by, jsonData.job[i].job_title, jsonData.job[i].job_reference, jsonData.job[i].company_name, jsonData.job[i].industry_name, jsonData.job[i].country, jsonData.job[i].state, jsonData.job[i].city, jsonData.job[i].salaryRange, jsonData.job[i].jobType, jsonData.job[i].experieneceLevel, jsonData.job[i].time_of_post, jsonData.job[i].job_id, jsonData.job[i].is_saved, jsonData.job[i].is_applied, jsonData.job[i].can_apply, jsonData.job[i].job_desc, jsonData.job[i].apply_from, jsonData.job[i].company_url, jsonData.job[i].comply_job_apply_url );
			        	
			        	$("div#job_list_holder").append( job );
			        	//Setting offset.
			        	$("input#offsett").val( parseInt( $("input#offsett").val() ) + 1 );
		        	}
		        	
		        	//Scrolling to job list.
		        	goToByScroll("search_result_header_bar");
		        	
		        	//Show dialog msg in case user has selected some different country than his/her current location detected through IP.
		           	if(jsonData.show_job_gate_off_warning_msg)
		    		{
		        		showDialogMsg('Country restriction',jsonData.job_gate_off_warning_msg, 15000,
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
	        				    dialogClass: "general_dialog_message fixed_dialog",
	        				    height: 200,
	        				    width: 450
	        					}		
	        				);
		        	}
	        	}
	        	else
	        	{
	        		showDefaultMsg( "No jobs available for this search criteria.", 1 );
	        	}	
	        	
	        	if( jsonData.is_more_jobs > 0 )
	        	{
	        		var job = "";
	        		job += '<div class="job-content view_more">';
	        		job += '<p>  <a href="javascript:;" onclick = "triggerViewMoreListing()" class=" text-purple-link fr">View More</a> </p>';
	        		job += '</div>';
		        	$("div#job_list_holder").append( job );
	        	}
        	}
        }
    });
}

/**
 * Populates listing of jobs on view more click.
 * Checks from hiden field that which form last submited (simple search or advanced search.)
 * 
 * @author jsingh7
 * @version 1.0
 */
function advancedSearchViewMore()
{
	$("div.view_more p a").html("<img src = '"+IMAGE_PATH+"/loading_small_purple.gif'>");
	var dataa = $("form#advance_search").serialize() + "&offset=" + parseInt( $("input#offsett").val() ) + "&myLat="+$('input#myLat').val()+ "&myLong="+$('input#myLong').val();
    jQuery.ajax({
        url: "/" + PROJECT_NAME + "job/get-search-results",
        type: "POST",
        dataType: "json",
        data: dataa,
//		cache: false,
        timeout: 50000,
        success: function(jsonData) {
        	$("div.view_more").remove();
        	if( jsonData.error != 0 )
        	{
        		showDefaultMsg( jsonData.error, 3 );
        	}
        	else
        	{
	        	for( i in jsonData.job )
	        	{
	        		//Create job template.
	        		job = jobTemplateMaker( jsonData.job[i].job_image, jsonData.job[i].job_posted_by, jsonData.job[i].job_title, jsonData.job[i].job_reference, jsonData.job[i].company_name, jsonData.job[i].industry_name, jsonData.job[i].country, jsonData.job[i].state, jsonData.job[i].city, jsonData.job[i].salaryRange, jsonData.job[i].jobType, jsonData.job[i].experieneceLevel, jsonData.job[i].time_of_post, jsonData.job[i].job_id, jsonData.job[i].is_saved, jsonData.job[i].is_applied, jsonData.job[i].can_apply, jsonData.job[i].job_desc, jsonData.job[i].apply_from, jsonData.job[i].company_url,jsonData.job[i].comply_job_apply_url );
		        	
		        	$("div#job_list_holder").append(job);
		        	//Setting offset.
		        	$("input#offsett").val( parseInt( $("input#offsett").val() ) + 1 );
	        	}
	        	if( jsonData.is_more_jobs > 0 )
	        	{
	        		var job = "";
	        		job += '<div class="job-content view_more">';
	        		job += '<p>  <a href="javascript:;" onclick = "triggerViewMoreListing()" class=" text-purple-link fr">View More</a> </p>';
	        		job += '</div>';
		        	$("div#job_list_holder").append( job );
	        	}
	        	
	        	//Show dialog msg in case user has selected some different country than his/her current location detected through IP.
	           	if(jsonData.show_job_gate_off_warning_msg)
	    		{
	        		showDialogMsg('Country restriction',jsonData.job_gate_off_warning_msg, 15000,
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
        				    dialogClass: "general_dialog_message fixed_dialog",
        				    height: 200,
        				    width: 450
        					}		
        				);
	        	}
        	}
        }
    });
}
function showQuickApplyView(elem)
{
	window.onbeforeunload = function(e){
		return "On leaving the page your form will be reset.";
	};
	var job_id = $(elem).attr("rel");
	$("div.job-content-border.job-content").slideUp();

	if ($("div#job-content_"+job_id).hasClass("recommended-job-bg-grey"))
	{
		
		$("div#job-content_"+job_id).removeClass("recommended-job-bg-grey");
		$("div#job-id-"+job_id).removeClass("recommended-job-bg-grey");
		$("div#outerDiv_"+job_id).removeClass("job-active-bdr");
		$("div#job-id-"+job_id).removeClass("remove-side-border");
	}
	else
	{
    	
    	$("div.remove-bg-gray").removeClass("recommended-job-bg-grey");
    	//$("div.job-content").removeClass("recommended-job-bg-grey");
    	$("div.highlight_on_hover").removeClass("job-active-bdr");
    	$("div#job-content_"+job_id).addClass("recommended-job-bg-grey");
    	$("div#job-id-"+job_id).addClass("recommended-job-bg-grey");
    	$("div#outerDiv_"+job_id).addClass("job-active-bdr");
    	$("div.mail-grey-hdr-col1").removeClass("remove-side-border");
    	$("div#job-id-"+job_id).addClass("remove-side-border");
    	
    }
	
	$("div#job-form-"+job_id).toggle();

}

/**
 * Save search criteria/search name.
 * @author jsingh7
 * @param elem
 */
function saveSearch(elem)
{
	$("div.message_box").remove();
	
	var element = elem;
	var job_title =  $("input#job_title").val(); 
	$.trim(job_title);
	if((job_title!= "" && job_title != " " && job_title.length != 0))
	{
		$(elem).hide();
		var idd = addLoadingImage( $(elem), 'before', 'loading_small_purple.gif', 61, 26 );
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "job/save-search",
	        type: "POST",
	        dataType: "json",
	        data: $("form#advance_search").serialize()+"&email_for_alerts="+$("input#email_to_recv_alerts").val()+"&search_name="+$("input#search_name").val()+"&receive_alerts="+$("select#receive_alerts").val(),
	//		cache: false,
	        timeout: 50000,
	        success: function(jsonData) {
	        	$("div.message_box").remove();
	        	$("span#"+idd).remove();
	        	$(element).fadeIn();
	        	if( jsonData.status == 1 )
	        	{
	        		var row = '<a href="/'+PROJECT_NAME+'job/search-jobs/search_id/'+jsonData.id+'" title = "'+$("input#search_name").val()+'" id = "search_'+jsonData.id+'">';
	        			row += showCroppedText($("input#search_name").val(), 20);
	        			row += '</a>';
     		$("div#saved_search_holder").append(row);
	        		$("div.message_box").remove();
	        		showDefaultMsg( "Job search saved.", 1 );
	        	}
	        	else if( jsonData.status == 0 )
	        	{
	        		$("div.message_box").remove();
	        		showDefaultMsg( "Job search not saved! please try again.", 2 );
	        	}
	        	else if( jsonData.status == 2 )
	        	{
	        		$("div.message_box").remove();
	        		showDefaultMsg( "Job search already exist with this name!", 2 );
	        	}
	        }
		});
	}
	else
	{
			showDefaultMsg( "Job search can't be saved without job title.", 2);
			$("input#job_title").focus();
	}
}

function populateAdvSearchForm( search_id )
{
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "job/get-saved-search",
        type: "POST",
        dataType: "json",
        data: {'search_id' : search_id},
//		cache: false,
        timeout: 50000,
        success: function(jsonData) {
        	if( jsonData != 0 )
        	{
        		$("form#advance_search input[name=job_title]").val(jsonData.job_title);
        		$("select#advanced_country").val(jsonData.country);
        		fillUpAdvancedSearchStateDDAndSet( jsonData.country, jsonData.state, jsonData.city );
        		fillUpAdvanceSearchSalaryDDAndSet( jsonData.country, jsonData.salary );
        		$("input#company").val(jsonData.company);
        		$("select#industry").val(jsonData.industry);
        		$("select#job_type").val(jsonData.job_type);
        		$("select#salary").val(jsonData.salary);
        		$("select#experience_level").val(jsonData.experience_level);
        		$("input#date_from").val(jsonData.date_from);
        		$("input#date_to").val(jsonData.date_to);
        	}
        }
	});
}
/**
 * Manages state dropdown acording to country selected,
 * If country selected has no states but cities, it fillup cities
 * in city dropdown.
 * 
 * @author jsingh7
 * @vesion 1.0
 * @param country_id
 * @param state_id_to_set
 * @param city_id_to_set
 */
function fillUpAdvancedSearchStateDDAndSet( country_id, state_id_to_set, city_id_to_set )
{
	$.ajax({
		url : "/" + PROJECT_NAME + "job/get-response-for-country-selected",
		method : "POST",
		data : {"country_id": country_id},
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			$("#advanced_state").html('<option value = "">Select</option>');
			$("#advanced_city").html('<option value = "">Select</option>');
			$("#advanced_state_div").fadeIn();
			var optionsForStates = "";
			var optionsForCities = "";
			if( jsonData.count > 0 )
			{
				if( jsonData.have_states == 1 )
				{
					optionsForStates += '<option value = "">Select</option>';
					for( i in jsonData.options )
					{
						optionsForStates += '<option value = "'+jsonData.options[i]['id']+'">'+jsonData.options[i]['name']+'</option>';
					}
					$("#advanced_state").html(optionsForStates);
					$("#advanced_state_div").fadeIn();
					$("select#advanced_state").val(state_id_to_set);
					
					fillUpAdvancedSearchCityDDAndSet( state_id_to_set, city_id_to_set );
				}	
				if( jsonData.have_states == 0 )
				{
					optionsForCities += '<option value = "">Select</option>';
					for( j in jsonData.options )
					{
						optionsForCities += '<option value = "'+jsonData.options[j]['id']+'">'+jsonData.options[j]['name']+'</option>';
					}
					$("#advanced_city").html(optionsForCities);
					$("#advanced_state_div").hide();
					$("select#advanced_city").val(city_id_to_set);
				}	
			}	
			
		}
	});
}
/**
 * Manages state dropdown acording to state selected,
 * 
 * @author jsingh7
 * @vesion 1.0
 * @param state_id
 * @param city_id_to_set
 */
function fillUpAdvancedSearchCityDDAndSet( state_id, city_id_to_set )
{
	$.ajax({
		url : "/" + PROJECT_NAME + "job/get-response-for-state-selected",
		method : "POST",
		data : {"state_id": state_id},
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			var optionsForCities = "";

			optionsForCities += '<option value = "">Select</option>';
			for( i in jsonData.options )
			{
				optionsForCities += '<option value = "'+jsonData.options[i]['id']+'">'+jsonData.options[i]['name']+'</option>';
			}
			$("#advanced_city").html(optionsForCities);
			$("select#advanced_city").val(city_id_to_set);
		}
	});
}
/**
 * Manages salary dropdown acording to country selected,
 * 
 * @author jsingh7
 * @vesion 1.0
 */
function fillUpAdvanceSearchSalaryDDAndSet( country_id, salary_id_to_set )
{
	$.ajax({
		url : "/" + PROJECT_NAME + "job/get-salary-ranges-by-country",
		method : "POST",
		data : {"country_id": country_id},
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			var optionsForSalary = "";
			
			optionsForSalary += '<option value = "">Select</option>';
			for( i in jsonData )
			{
				optionsForSalary += '<option value = "'+jsonData[i]['id']+'">'+jsonData[i]['Currency_sym']+' '+jsonData[i]['min_salary']+' - '+jsonData[i]['max_salary']+'</option>';
			}
			$("select#salary").html(optionsForSalary);
			$("select#salary").val(salary_id_to_set);
		}
	});
}

/**
 *
 *
 *
 */
function applyFormValidate(job_id){
	var options = {
//          target:        '#no_div',   // target element(s) to be updated with server response 
          beforeSubmit:  showRequest,  // pre-submit callback 
          success:       showResponse,  // post-submit callback 
          dataType : 'json',
          clearForm : false
          // other available options: 
          //url:       url         // override for form's 'action' attribute 
          //type:      type        // 'get' or 'post', override for form's 'method' attribute 
          //dataType:  null        // 'xml', 'script', or 'json' (expected server response type) 
          //clearForm: true        // clear all form fields after successful submit 
          //resetForm: true        // reset the form after successful submit 
   
          // $.ajax options can be used here too, for example: 
          //timeout:   3000 
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

//  console.log('status: ' + statusText + '\n\nresponseText: \n' + responseText + 
//      '\n\nThe output div should have already been updated with the responseText.');
	$("form#applicant_form input#apply_job_btn").siblings("span.loading").remove();
	$("form#applicant_form input#apply_job_btn").fadeIn();
}

/**
 * Creates template for a job listing. 
 * when job posted by him self then quick apply button should be invisible
 * 
 * @param job_creator_image
 * @param job_posted_by
 * @param job_title
 * @param job_reference
 * @param company_name
 * @param industry_name
 * @param country
 * @param state
 * @param city
 * @param salaryRange
 * @param jobType
 * @param experieneceLevel
 * @param time_of_post
 * @param job_id
 * @param is_saved [ true if job saved by current user ]
 * @param is_applied [ true if job applied by current user ]
 * @param is_job_active [ true if job status is active ]
 * @param job_desc
 * @param apply_from 
 * @param company_url
 * 
 * @author jsingh7, nsingh3
 * @version 1.1
 *
 */
function jobTemplateMaker( job_image_path, job_posted_by, job_title, job_reference, company_name, industry_name, country, state, city, salaryRange, jobType, experieneceLevel, time_of_post, job_id, is_saved, is_applied, is_job_active, job_desc, apply_from, company_url, comply_job_apply_url )
{
	var job = "";
	job += '<div class="search-job-single">';
	job += '<div class="new-border-space"></div>';
	
	job += '<div class="highlight_on_hover"  id="outerDiv_'+job_id+'">';
	job += '<div class="mail-grey-hdr-col1 remove-bg-gray" id="job-id-'+job_id+'">';
	
	job +='<div class="search_job_img_outer">';
	job +='<a style="text-decoration:none !important;" class="text-purple-link" href = "/'+PROJECT_NAME+'/job/job-detail/job_id/'+job_id+'">';
	job += '<div class="search_job_img_inner">';
	job += '<img style="max-width:60px;max-height:60px" src="'+PUBLIC_PATH+'/Imagehandler/GenerateImage.php?image='+job_image_path+'&h=60&w=60">';
	job += '</a>';
	job += '</div>';
	job += '</div>';
	job += '<div class="mid">';
	job += '<h4 class="job-title-arial" >'+'<a style="text-decoration:none !important;" class="text-purple-link job_listing_job_title"  href = "/'+PROJECT_NAME+'job/job-detail/job_id/'+job_id+'">'+job_title+' | '+job_reference+'</a></h4>';
	job += '<p>';
	//job += '<a  href="javascript:;" class="text-purple-link font-arial job_cmpny_name">'+company_name+'</a>';
	job += '<span  class="job_listing_company_name">'+company_name+'</span>';
	job += '</p>';
	job += '<p class="job_listing_industry_location">'+industry_name+', '+country+', '+state+', '+city+'</p>';
	job += '<p class="font-arial job_listing_salary_exp">'+jobType+' | '+experieneceLevel+'</p>';
	job += '</div>';
	job += '<div class="right">';
	job += '<div class="top">'+time_of_post+'</div>';
	job += '</div>';
	
	job += '</div>';
	
	job += '<div style=" position:relative; z-index:1; margin-bottom: 0px; width: 97% !important; padding:0 1.5% !important" class=" job-content remove-bg-gray" id="job-content_'+job_id+'">';
	
	//Job status is active and posted by logged in user.
	//OR
	//Job status is not active and not posted by logged in user.
	//OR
	//Job is applied by logged in user and job is active to be applied and posted by some other user.
	if( ( is_job_active && job_posted_by == 1 )
			|| ( !is_job_active && job_posted_by == 2 ) 
			|| ( is_applied && is_job_active && job_posted_by == 2 )
			)
	{
		//No apply buttton should be displayed
		job += '<div  id="quick_apply_bar_'+job_id+'" style="margin:0 0 4px !important;" class="no_apply-2-job  text-purple ">';
	}
	else if( is_applied==0 && is_job_active && job_posted_by == 2)//job is not applied by logged in user and job status is active and job is not posted by logged in user.
	{
		// job can be applied so we have to show apply button.
		job += '<div  id="quick_apply_bar_'+job_id+'" class="apply-2-job  text-purple">'; 
	}
	else
	{
		job += '<div  id="quick_apply_bar_'+job_id+'" style="margin:0 0 4px !important;" class="no_apply-2-job  text-purple ">';
	}	
	
	
	// Save job only shown when job is not applied yet.
	if( !(is_applied) )
	{
		
		if( is_saved == 0 )
		{	
			job += '<div class="mid apply-2-job-lt" id = "save_job_button_holder_'+job_id+'" style="margin-left:16px !important;margin-bottom:4px;">';
			job += '<a id = "save_job_'+job_id+'" class="text-purple-link save-icon" href="javascript:;" onclick = "saveJob(this, '+job_id+')"><span>Save</span></a>';
			job += '</div>';
		}
		else
		{	
			job += '<div class="mid" id = "save_job_button_holder_'+job_id+'" style="margin-left:16px !important;margin-bottom:4px;">';
			job +='<a href="javascript:;" onmouseover="savedToUnsaveJob(this, '+job_id+')" style="display:block;" id="saved_job_'+job_id+'" class="text-purple-link" style="cursor:default;">';
			job += 'Job Saved';
			job += '</a>';
			job += '<a href="javascript:;" onmouseout="unsaveToSavedJob(this, '+job_id+')"  id="unsave_job_'+job_id+'" style="display:none;" onclick="UnsaveJob(this, '+job_id+')" class="text-purple-link" style="cursor:default;">';
			job += 'Unsave';
			job += '</a>';
			job += '</div>';
		}	
		
	}
	else
	{
		job +='<div class="mid">';
		job+='</div>';
	}
	//nsingh3
	if(job_posted_by == 2)// Job posted by some other user.
	{
		// is_job_active means that, Is job expired or not?
		// Is_applied means that, Is job applied by me?
		if(!is_applied && is_job_active) //Job is not applied by logged in user.
		{
			//Show quick apply.
			job += '<div class="apply-2-job-rt"><a class="quick-apply-btn text-purple-link" onclick = "showQuickApplyView(this)" id = "quick_apply_'+job_id+'" rel="'+job_id+'" ><span>Quick Apply</span></a></div>';
		}
		else if (!is_job_active)//Job is not active.
		{
			//Show expired.
			job +='<a style="margin-right: 4px ! important;" class ="quick-apply-btn text-purple-link applied "> Expired</a>';
		}
		else if (is_applied && is_job_active)//Job is applied by logged in user and is active.
		{
			//Show applied.
			job +='<a style="margin-right: 4px ! important;" class ="quick-apply-btn text-purple-link applied" > Applied </a>';
		}
	}
	//nsingh3
	
	job += '</div>';
	job += '</div>';
	job += '</div>';	
	//Hidden part for quick apply.
	// start of job form
	job += '<form id="applicant_form_'+job_id+'" name="applicant_form_'+job_id+'" method="POST" action="/'+ PROJECT_NAME +'job/apply-job" enctype="multipart/form-data" >';
	job += '<div class="job-content job-content-border" style="margin-bottom: 0px; display:none;" id="job-form-'+job_id+'">';
	if( apply_from == 1 )//Job can be applied by company website.
	{
		job += '<div class = "apply-from-company quick_apply " id = "quick_apply_'+job_id+'" ><a href = "'+comply_job_apply_url+'" target = "_blank">Apply</a></div>';
	}
	//Job can be applied from ilook. Show quick apply form.
	else
	{
		job += '<div class="quick_apply" id = "quick_apply_'+job_id+'" >';
		job += '<div style="margin: 18px 0 10px !important;" class="applicant-col1  form-bg-grey">';
		job += '<div class="applicant-col1-left">';
		job += '<h3 class="applicant-cv text-grey2 recommended-hdr">applicant CV</h3>';
		job += '</div>';
		
		job += '<div class="applicant-col1-left"><input name="applicant_cv" type="file" value="Upload from computer" alt="Upload from computer" style="max-width: 360px;overflow:hidden" />';
		job += '</div>';
		job += '</div>';
		job += '<div class="applicant-col1  form-bg-grey">';
		job += '<div class="applicant-col1-left">';
		job += '<h3 class="applicant-cv text-grey2 recommended-hdr">applicant Cover letter</h3>';
		job += '</div>';
		
		job += '<div class="applicant-col1-left"><input name="application_cl" type="file" value="Upload from computer" alt="Upload from computer" style="max-width: 360px;overflow:hidden"  /></div>';
		job += '</div>';
		
		job += '<div class="applicant-col1 form-bg-grey">';
		job += '<textarea maxlength="1000" name="applicant_msg" cols="" rows="10" placeholder="">Hi, I am interested in this position and would like to apply for the same. Please have a look into my profile for more details.</textarea>';
		job += '</div>';
	
		job += '<div class="applicant-col1 text-grey2">';
		job += '<h3 class="sub-heading-arial-narrow" style="font-weight:bold;">job description </h3>';
		job += '</div>';
		job += '<div class="applicant-col1 text-grey2">';
		job += job_desc;
		job += '</div>';
		
		job += '<div class="applicant-col1">';
		job += '<input type="hidden" name="job_id" id="job_id" value="'+job_id+'" />';
		job += '<div style="text-align:right;" class="bdr-btm_'+job_id+'">';
		job += '<input name="apply_job_btn_'+job_id+'" id="apply_job_btn_'+job_id+'" onclick="applyFormValidate('+job_id+')" type="button" class="btn-purple fr" value="Apply" alt="Apply" title="Apply" />';
		job += '</div>';
		
		job += '</div>';
		job += '<div class="mail-content-bot" style="border-bottom:none !important;">';
		job += '</div>';
		
		job += '</div>';
	}
	job += '</div>';
	job += '</form>';
	job += '</div>';
	// end of job form
	
	return job;
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
	$(".mid a#saved_job_"+job_id ).css('display','none');
	$(".mid a#unsave_job_"+job_id ).css('display','block');

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
	$(".mid a#unsave_job_"+job_id ).css('display','none');
	$(".mid a#saved_job_"+job_id ).css('display','block');
	
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
	$(".mid a#saved_job_"+job_id ).remove();
	
	addLoadingImage( $(elem), 'before', 'loading_small_purple.gif');
	$(".mid a#unsave_job_"+job_id ).remove();
	
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "job/unsave-job",
        type: "POST",
        dataType: "json",
        data: {'job_id' : job_id},
//		cache: false,
        timeout: 50000,
        success: function(jsonData) {
        	var html = '';
        	if( jsonData == 1 )
        	{
	        	html +='<a class="text-purple-link save-icon" href="javascript:;" onclick="saveJob(this, '+ job_id +')" title="Save job">';
	//        	html += '<img src="'+IMAGE_PATH+'/save-icon.png" alt="Save" width="14" height="14" hspace="5" align="absmiddle" title="Save" />';
	        	html += '<span>Save</span> ';
	        	html += '</a>';
        	}
        	else
        	{
        		html +='<a href="javascript:;" onmouseover="savedToUnsaveJob(this, '+job_id+')" style="display:block;" id="saved_job_'+job_id+'" class="text-purple-link" style="cursor:default;">';
        		html += 'Job Saved';
        		html += '</a>';
        		html += '<a href="javascript:;" onmouseout="unsaveToSavedJob(this, '+job_id+')"  id="unsave_job_'+job_id+'" style="display:none;" onclick="UnsaveJob(this, '+job_id+')" class="text-purple-link" style="cursor:default;">';
        		html += 'Unsave';
        		html += '</a>';
        	}
        	
        	//Added by hkaur5 as this class was eliminated while saving job.
        	$("div#save_job_button_holder_"+job_id).addClass('apply-2-job-lt');
        	$("div#save_job_button_holder_"+job_id+" span").hide();
        	$("div#save_job_button_holder_"+job_id).append(html);
        	
//        	$( "#dialog_success_job_unsave" ).dialog( "open" );
//    		$( "#dialog_success_job_unsave" ).delay(3000).queue(function(){
//    			$(this).dialog("close").dequeue(); // take this function out of queue a.k.a dequeue a.k.a notify done
//    			// so the next function on the queue continues execution...
//    		});

        }
	});
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
//		cache: false,
        timeout: 50000,
        success: function(jsonData) {
        	//Show dialog after sharing.
        	if( jsonData.status == 1 )
        	{
        		
        		var html = '';
        		html +='<a href="javascript:;" onmouseover="savedToUnsaveJob(this, '+job_id+')" style="display:block;" id="saved_job_'+job_id+'" class="text-purple-link" style="cursor:default;">';
        		html += 'Job Saved';
        		html += '</a>';
        		html += '<a href="javascript:;" onmouseout="unsaveToSavedJob(this, '+job_id+')"  id="unsave_job_'+job_id+'" style="display:none;" onclick="UnsaveJob(this, '+job_id+')" class="text-purple-link" style="cursor:default;">';
        		html += 'Unsave';
        		html += '</a>';
        		
        		$("div#save_job_button_holder_"+job_idd).removeClass('apply-2-job-lt');
        		$("div#save_job_button_holder_"+job_idd).html(html);
        	}	
        }
	});
}

function listingForSavedSearch( $savedSearchId )
{
	__addOverlay();
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "job/get-search-results-for-saved-search",
        type: "POST",
        dataType: "json",
        data: {'search_id' : $savedSearchId, 'offset' : 0},
//		cache: false,
        timeout: 50000,
        success: function(jsonData) {

        	$("div#job_list_holder").html("");
        	$("div.message_box").remove();
        	if( jsonData.job )
        	{
        		var searchResultBar = '';
        		searchResultBar += '<div class="search_result_bar" id = "search_result_header_bar" >';
        		searchResultBar += '<div style="margin: 3px 0 5px !important;">';
        		searchResultBar += '<h3>Search Result</h3>';
        		searchResultBar += '</div>';
        		searchResultBar += '</div>';
        		$("div#job_list_holder").append(searchResultBar);
        		
	        	for( i in jsonData.job )
	        	{
	 
		        	//Create job template.
	        		job = jobTemplateMaker( jsonData.job[i].job_image,
	        								jsonData.job[i].job_posted_by,
	        								jsonData.job[i].job_title,
	        								jsonData.job[i].job_reference,
	        								jsonData.job[i].company_name,
	        								jsonData.job[i].industry_name,
	        								jsonData.job[i].country,
	        								jsonData.job[i].state,
	        								jsonData.job[i].city,
	        								jsonData.job[i].salaryRange,
	        								jsonData.job[i].jobType,
	        								jsonData.job[i].experieneceLevel,
	        								jsonData.job[i].time_of_post,
	        								jsonData.job[i].job_id,
	        								jsonData.job[i].is_saved,
	        								jsonData.job[i].is_applied,
	        								jsonData.job[i].can_apply,
	        								jsonData.job[i].job_desc,	        								
	        								jsonData.job[i].apply_from,
	        								jsonData.job[i].company_url,
	        								jsonData.job[i].comply_job_apply_url
	        								);
	        		
		        	$("div#job_list_holder").append( job );
		        	//Setting offset.
		        	$("input#offsett").val( parseInt( $("input#offsett").val() ) + 1 );
	        	}
	        	//Scrolling to job list.
	        	goToByScroll("search_result_header_bar");	
        	}
        	else
        	{
        		showDefaultMsg( "No jobs available for this search criteria!", 1 );
        	}
        	if( jsonData.is_more_jobs > 0 )
        	{
        		var job = "";
        		job += '<div class="job-content view_more">';
        		job += '<p>  <a href="javascript:;" onclick = "triggerViewMoreListing()" class=" text-purple-link fr">View More</a> </p>';
        		job += '</div>';
	        	$("div#job_list_holder").append( job );
        	}
        	__removeOverlay();
        }
	});
	
}

