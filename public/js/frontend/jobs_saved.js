$(document).ready(function(){
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
    
  //Alert box for success message.
    $( "div#select_checkbox" ).dialog({
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
    
	//Alert box for closing a job.
    $( "div#close_job_dialog_confirm" ).dialog({
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
	    		deleteJobs( $(this).data('jobIds'));
	    		},
    		Cancel: function() {
    			$( this ).dialog( "close" );
    		}
	    }
    });
    
    
  //Checking/unchecking checkboxes //By nsingh3----
	$("div.mail_select_all input#mail_list_main_cb").click(function(){
		var isAllChecked = isAllCBChecked("div#mail_holder input.mail_list_cb");
		if( isAllChecked == 1)
		{
			$("div#mail_holder input.mail_list_cb").prop("checked", false);
			$('span#delete_all').hide();
			$('span#select_all').fadeIn();
		}
		else if( isAtLeastOneCheckboxChecked( "div#mail_holder input.mail_list_cb" ) == true )
		{
			$('span#select_all').hide();
			$('span#delete_all').fadeIn();
		}
//		else
//		{
//			$('span#delete_all').hide();
//			$('span#select_all').fadeIn();
//		}
		else
		{	
			$("div#mail_holder input.mail_list_cb").prop('checked', true);
			$('span#select_all').hide();
			$('span#delete_all').fadeIn();
		}
	});
	
	$("div#mail_holder input.mail_list_cb").click(function(){
		var isAllChecked = isAllCBChecked("div#mail_holder input.mail_list_cb");
		if( isAllChecked == 1 )
		{
			$("div.mail_select_all input#mail_list_main_cb").prop('checked', true);
			$('span#select_all').hide();
			$('span#delete_all').fadeIn();
		}	
		else if( isAtLeastOneCheckboxChecked( "div#mail_holder input.mail_list_cb" ) == true )
		{
			$('span#select_all').hide();
			$('span#delete_all').fadeIn();
		}
		else
		{
			$("div.mail_select_all input#mail_list_main_cb").prop('checked', false);
			$('span#delete_all').hide();
			$('span#select_all').fadeIn();
		}
	});
	//------------------------------------------------
    // end of checkboxs 
});

function showQuickApplyView(job_id)
{
	window.onbeforeunload = function(e){
		return "On leaving the page your form will be reset.";
	};
	$("div.job-content-border.job-content").slideUp();
	if ($("div#saved_job_desc_"+job_id).hasClass("recommended-job-bg-grey"))
	{
		
		$("div#saved_job_desc_"+job_id).removeClass("recommended-job-bg-grey");
		$("div#more_detail_"+job_id).removeClass("recommended-job-bg-grey");
		$("div#outerDiv_"+job_id).removeClass("job-active-bdr");
		$("div#saved_job_desc_"+job_id).removeClass("remove-side-border");
    
	}
	else
	{
    	
    	$("div.remove-bg-gray").removeClass("recommended-job-bg-grey");
    	$("div.highlight_on_hover").removeClass("job-active-bdr");
    	$("div#saved_job_desc_"+job_id).addClass("recommended-job-bg-grey");
    	$("div#more_detail_"+job_id).addClass("recommended-job-bg-grey");
    	$("div#outerDiv_"+job_id).addClass("job-active-bdr");
    	$("div.mail-grey-hdr-col1").removeClass("remove-side-border");
    	$("div#saved_job_desc_"+job_id).addClass("remove-side-border");
    }
	
	$("div#saved-job-"+job_id).toggle();
}

/**
 * deleteSelectedJobs
 * @auther nsingh3
 */
function deleteSelectedJobs()
{
	var jobIds = $("div#mail_holder input:checked").map(function(i, el) { return $(el).attr("value"); }).get();
    if(jobIds && jobIds ==''){
    	$("#select_checkbox").dialog( "open" );
    	$("#select_checkbox")
        .delay(3000)
        .queue(function(){
            $(this)
                .dialog("close")
                .dequeue(); // take this function out of queue a.k.a dequeue a.k.a notify done
                            // so the next function on the queue continues execution...
        });
    }
    else{
    	$( "div#close_job_dialog_confirm" ).data('jobIds', jobIds).dialog( "open" );
    	
//    	$("div.mail_select_all input#delete_all").hide();
//    	deleteJobs(jobIds);
//    	return ;
    }
    return;
}

/**
 * delete Jobs
 * @auther nsingh3
 */
function deleteJobs(jobIds)
{
	__addOverlay();
	$.ajax({
		url : "/" + PROJECT_NAME + "job/delete-job",
		method : "POST",
		data : {"job_ids": jobIds},
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			 window.location.reload();
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
//         target:        '#no_div',   // target element(s) to be updated with server response 
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
	
	if(responseText.is_success == 1){
		//Removes apply job.
		$("div.bdr-btm_"+responseText.job_id+" input#apply_job_btn_"+responseText.job_id).remove();
		
		//Appends applied button in place of apply. 
		$("div.bdr-btm_"+responseText.job_id).append('<input name="Applied" type="button" class="btn-purple-lt fr" value="Applied" alt="Appled" title="Appled" />');
		//Removes the loader.
		$("div.bdr-btm_"+responseText.job_id+" span").hide();
		
		//Removes quick apply link and replace it with applied.
		$("div#quick_apply_bar_"+responseText.job_id+" span#quick_apply_"+responseText.job_id+" a#quick_apply_"+responseText.job_id).remove();
		$("div#quick_apply_bar_"+responseText.job_id+" span#quick_apply_"+responseText.job_id).append('<a style="margin-right: 4px ! important;" class="quick-apply-btn text-purple-link applied"> Applied </a>');

		//replace classes.
		$("div#quick_apply_bar_"+responseText.job_id).removeClass("apply-2-job");
		$("div#quick_apply_bar_"+responseText.job_id).addClass("no_apply-2-job");
		
		//Side click slide up functionality.
		$(document).mouseup(function (e)
		{
			var containerr = $("div#saved-job-"+responseText.job_id);
	    	
	    	if (!containerr.is(e.target) // if the target of the click isn't the container...
	    			&& containerr.has(e.target).length === 0) // ... nor a descendant of the container
	    	{
	    		containerr.slideUp();
	    		$("div#saved_job_desc_"+responseText.job_id).removeClass("recommended-job-bg-grey");
	    		$("div#more_detail_"+responseText.job_id).removeClass("recommended-job-bg-grey");
	    		$("div#outerDiv_"+responseText.job_id).removeClass("job-active-bdr");
	    	}
		});
		
		//reset the form fields after job applied
		document.getElementById("applicant_form_"+responseText.job_id).reset();
		
		//Show dialog after sharing.
        $("#dialog_success_job_apply").dialog( "open" );
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
        .queue(function()
        {
            $(this).dialog("close").dequeue(); // take this function out of queue a.k.a dequeue a.k.a notify done
             // so the next function on the queue continues execution...
        });
		
	}

//  console.log('status: ' + statusText + '\n\nresponseText: \n' + responseText + 
//      '\n\nThe output div should have already been updated with the responseText.');
	$("form#applicant_form input#apply_job_btn").siblings("span.loading").remove();
	$("form#applicant_form input#apply_job_btn").fadeIn();
}
/**
* Unsave current job.
* @param elem
* @param job_id
* @author hkaur5
* 
*/
function UnsaveJob( elem, job_id)
{
	var element = elem;
	$(elem).hide();
	addLoadingImage( $(elem), 'before', 'loading_small_purple.gif');
	var job_idd = job_id;
	
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "job/unsave-job",
        type: "POST",
        dataType: "json",
        data: {'job_id' : job_id},
//		cache: false,
        timeout: 50000,
        success: function(jsonData) {
        	//Show dialog after sharing.
        	if( jsonData == 1 )
        	{
        		window.location.href=document.documentURI;	
        		
        	}
        	else
        	{
        		window.location.href=document.documentURI;
        	}
        }
	});
}

