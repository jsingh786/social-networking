$(document).ready(function(){	
	var options = {
//          target:        '#no_div',   // target element(s) to be updated with server response 
          beforeSubmit:  showRequest,  // pre-submit callback 
          success:       showResponse,  // post-submit callback 
          dataType : 'json',
          clearForm : true
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
      $('form#applicant_form').ajaxForm(options);
      
      $("form#applicant_form input#apply_job_btn").click(function(){
    	//Validations----------------
    	  	validator = $( "form#applicant_form" ).validate({
    	  		rules: {
    	  			applicant_cv:{
    	  				required : true
    	  			}
    	  		}
    	  	});
    	  	//End validations------------
    	  	if( $( "form#applicant_form" ).valid() )
    		{
		    	$(this).hide();
		    	addLoadingImage( $(this), "before", "loading_small_purple.gif", 100, 20 );
		    	$("div.alert-box").remove();
		    	$("div.alert-box2").remove();
		      	$('form#applicant_form').submit();
    		}
      });
  	
      
  	window.onbeforeunload = function(e){
		return "On leaving the page your form will be reset.";
	};
      
});

//pre-submit callback 
function showRequest(formData, jqForm, options) 
{
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
function showResponse(responseText, statusText, xhr, $form)  
{
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
		//Remopve apply button
		$("div.bdr-btm input#apply_job_btn").remove();
		$("div.bdr-btm span").remove();
		
		
//		$("div#formDiv").hide();
		$("div.job-content-last").slideUp();
		$("div.right").append('<div class="job_applied_text"><a class="quick-apply-btn applied" style="cursor:default !important;color:#a9a9a9;"> Applied </a></div>');
//		$("div.bg-none").css('display','none');
		$("div.right div.top").text("Applied on "+responseText.job_applied_date);
		$("div.right div.top").css('float' ,'right');
		$("div.right div.top").css('width' , '163px');
		$("div.right div.top").css('font-weight' , 'bold');
//		$("div.apply-2-job a#quick_apply").remove();
//		$("div.apply-2-job").append('<a class="quick-apply-btn text-purple-link" href="javascript:;">Applied</a>');
		showDefaultMsg( "Successfully applied ", 1 );	
	}
	else
	{
		showDefaultMsg( "An error occurred! Please try again.", 3 );
	}
	
	
	

//    console.log('status: ' + statusText + '\n\nresponseText: \n' + responseText + 
//        '\n\nThe output div should have already been updated with the responseText.');
	$("form#applicant_form input#apply_job_btn").siblings("span.loading").remove();
    $("form#applicant_form input#apply_job_btn").fadeIn();
}