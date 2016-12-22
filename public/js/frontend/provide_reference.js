var idd;
$(document).ready(function()
{
	$('form#provide_reference_form').validate(
	{
		rules: 
		{
	    	provider_msg:
	    	{
				required:true,
				maxlength:1000
		    },
		    provider_links:
		    {
		    	required:true
		    },
		    requester_jobs:
		    {
		    	required:true
		    }
		},
	});
	//Filling up to field, reading hash value.
	if( window.location.hash.split('#')[1] != "" && window.location.hash.split('#')[1]!= undefined )
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

	// send button click and validation on composing message by Ritu
	$("#send_reference").click(function() {
			sendreference();
	});
	
	$("#cancel").click(function() {
		$("form#provide_reference_form").trigger('reset');
		
	});

	//Modal message dialog-box----------
	$( "#dialog_confirm" ).dialog({
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
	        	$('#jq_reference_receiver_id').focus();
	        }
	      }
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
	//Modal message dialog-box-position---------
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
	        	$('#reference_for_position').focus();
	        }
	      }
	});	
	
	//Modal message dialog-box-company---------
	$( "#dialog_confirm_company" ).dialog({
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
	        	$('#reference_for_company').focus();
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
	
	
	
	/*//Apply CKeditor
	CKEDITOR.replace( 'provider_msg', {
		width:597,
		uiColor: '#6C518F',
		toolbar: [
					{ name: 'basicstyles' , items : [ 'Bold','Italic','TextColor',"BGColor", 'NumberedList','BulletedList'  ] },
					{ name: 'tools', items : [ 'Maximize','-' ] },
				],
		removePlugins : 'elementspath',
		on:
		{
		'instanceReady': function(evt) {

			 var tags = ['p', 'ol', 'ul', 'li']; // etc.

		        for (var key in tags) {
		        	evt.editor.dataProcessor.writer.setRules(tags[key],
		                {
		                    indent : false,
		                    breakBeforeOpen : false,
		                    breakAfterOpen : false,
		                    breakBeforeClose : false,
		                    breakAfterClose : false
		                });
		        }
		//Set the focus to your editor
		CKEDITOR.instances.provider_msg.focus();
		}
		},
	});*/
});

/**
 * Posts the compose mail form
 * 
 * @author ritu
 */
function sendreference()
{
	if( $('#provide_reference_form').valid() == true)
	{
		
		// for updating ckditor i.e. sending ckeditor data in serialised form data
		/*for (instance in CKEDITOR.instances) {
	        CKEDITOR.instances[instance].updateElement();
	    }*/

		var loading_img = addLoadingImage($("#send_request"), "before","loading_small_purple.gif",'45','16', 'fl');

		$str = $("form#provide_reference_form").serialize();
		$.ajax({
			url : "/" + PROJECT_NAME + "reference-request/send-reference",
			method : "POST",
			data : $str,
			type : "post",
			dataType : "json",
			success : function(jsonData) 
			{
				if(jsonData == 1)
				{
					$("span#"+loading_img).remove();
					window.location.href = "/" + PROJECT_NAME + "reference-request/provide-reference";
				}
				else 
				{
					showDefaultMsg( "Some error has occured while providing reference! Please try again.", 2 );
				}
			}
		});
	}
}
/**
* Manages job dropdown according to selected.
*
* @author hkau5
*/
function fillUpJobDD( user_id )
{
	$.ajax({
		url : "/" + PROJECT_NAME + "reference-request/get-all-jobs-of-link",
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

			$("select#requester_jobs").empty();
			$("select#requester_jobs").html(optionsForJobs);
		}
	});
}

