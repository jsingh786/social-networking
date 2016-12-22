var idd;
$(document).ready(function(){
	$('form#provide_feedback_form').validate(
		{
			rules: {
				provider_msg:{
		    					required:true,
								maxlength:1000
				    		},
			    feedback_for_position:
			    {
			    	required:true,
			    	maxlength:50
			    },
			    provided_as:
			    {
			    	required:true,
			    },
			    requester_jobs:
			    {
			    	required:true,
			    },
			    provider_links:
			    {
			    	required:true,
			    }

				    },
		});
	if( window.location.hash.split('#')[1] != "" && window.location.hash.split('#')[1] != undefined )
	{
		__addOverlay();
		var requester_id = window.location.hash.split('#')[1];
		var requester_id_trim = requester_id.trim();
		$("select#provider_links").val(requester_id_trim);
		if($('select#provider_links').val() != "" && $('select#provider_links').val() != " ")
		{
			fillUpJobDD( requester_id_trim );
		}
		__removeOverlay();
	}
	
	// send button click and validation on sending feedback by hkaur5
	$("#send_feedback").click(function() 
	{
			sendfeedback();
	});
	
	$("#cancel").click(function() {
		$("form#provide_feedback_form").trigger('reset');
		
	});

	//Dialog box prompt if msg limit exceeds 1000 chars. 
	$( "#dialog_limit_msg" ).dialog({
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
	        'ok': function() {
	        	$( this ).dialog( "close" );
	        	$('#cke_provider_msg').focus();
	        }
	      }
	});	
	// Dialog box prompt if msg is kept empty.
	$( "#dialog_empty_msg" ).dialog({
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
	        'ok': function() {
	        	$( this ).dialog( "close" );
	        	$('#cke_provider_msg').focus();
	        }
	      }
	});	
	//Modal message dialog-box-position----------
	$( "#dialog_confirm_position" ).dialog({
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
	        'ok': function() {
	        	$( this ).dialog( "close" );
	        	$('#feedback_for_position').focus();
	        }
	      }
	});
	
	
	//Fill up jobs on change of links drop down.
	$('#provider_links').change(function()
	{
		//user whose jobs to be displayed in dropdown.
		var user_id = $(this).val();
		if(user_id != "")
		{
			fillUpJobDD( user_id );
		}
	});
});
/**
 * Posts the provide_feedback_form 
 * 
 * @author hkaur5
 * @author sjaiswal (updated ckeditor code)
 */
function sendfeedback()
{
	if( $('#provide_feedback_form').valid() == true)
	{

		// for updating ckditor i.e. sending ckeditor data in serialised form data
		/*for (instance in CKEDITOR.instances) {
	        CKEDITOR.instances[instance].updateElement();
	    }*/
		
		//var iddd = addLoadingImage($("#send_message"), "before");
		var loading_img = addLoadingImage($("#send_request"), "before","loading_small_purple.gif",'45','16', 'fl');
		$str = $("form#provide_feedback_form").serialize();
		$.ajax({
			url : "/" + PROJECT_NAME + "feedback/send-feedback",
			method : "POST",
			data : $str ,
			type : "post",
			dataType : "json",
			success : function(jsonData) {
				if(jsonData == 1)
				{
					$("span#"+loading_img).remove();
					window.location.href = "/" + PROJECT_NAME + "feedback/provide-feedback";
					
				}			
				else 
				{
					showDefaultMsg( "Some error has occured while providing feedback! Please try again.", 2 );
				}
			}
		});
	}
		
}

/**
 * Manages job dropdown according to selected ,
 *
 * @author hkau5
 * @vesion 1.0
 */
function fillUpJobDD( user_id )
{
	$.ajax({
		url : "/" + PROJECT_NAME + "feedback/get-all-jobs-of-link",
		method : "POST",
		data : {"user_id": user_id},
		type : "post",
		dataType : "json",
		success : function(jsonData)
		{
			var optionsForJobs= "";
			optionsForJobs = '<option value="">Select</option>';
			
			if ( jsonData['student']== 1 )
			{
				optionsForJobs += '<option value = "student">student</option>';

			}
			if( jsonData['home_maker'] == 1)
			{
				optionsForJobs += '<option value = "student">Home Maker</option>';
			}
			if(jsonData['jobs'])
			{
				for( i in jsonData['jobs'] )
				{
					optionsForJobs += '<option value = "'+jsonData['jobs'][i]+' (Working experience)">'+jsonData['jobs'][i]+' (Working experience)</option>';
				}
			}
			/*else
			{
				for( i in jsonData['jobs'] )
				{
					optionsForJobs += '<option value = "'+jsonData['jobs'][i]+'">'+jsonData['jobs'][i]+'</option>';
				}
			}*/
			$("select#requester_jobs").empty();
			$("select#requester_jobs").html(optionsForJobs);
		}
	});
}

