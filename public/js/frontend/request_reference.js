var idd;
$(document).ready(function(){
	$('form#request_reference_form').validate(
	{
		rules: 
		{
	    	requester_msg:
	    	{
				required:true,
				maxlength:500
	    	},
	    	provider_links:
	    	{
	    		required:true
	    	},
	    	requester_jobs:
	    	{
	    		required:true
	    	},
	    	requester_links:
	    	{
	    		required:true
	    	}
		},
	});
	if( window.location.hash.split('#')[1] != "" && window.location.hash.split('#')[1]!= undefined )
	{
		
		__addOverlay();
		var provider_id = window.location.hash.split('#')[1];
		var provider_id_trim = provider_id.trim();
		$("select#requester_links").val(provider_id_trim);
		__removeOverlay();
	
	}

	// send button click and validation on composing message by Ritu
	$("#send_request").click(function(){ 
			sendreferencerequest();
	});
	
	$("#cancel").click(function() {
		$("form#request_reference_form").trigger('reset');
//		$("select#provider_links").val("0");
//		$("select#requester_jobs").val("0");
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
	        	$('#jq_request_receiver_id').focus();
	        }
	      }
	});	
	
	//Dialog prompts if reference msg exceeds 500 chars. 
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
	        	$('#cke_requester_msg').focus();
	        }
	      }
	});	
	// Dialog prompts when reference msg is empty
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
	        	$('#cke_requester_msg').focus();
	        }
	      }
	});	

	
/*	//Apply CKeditor
	CKEDITOR.replace( 'requester_msg', {
		width:592,
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
		CKEDITOR.instances.requester_msg.focus();
		}
		},
	});*/

});
/**
 * Posts the request reference form.
 * 
 * @author sgandhi
 */
function sendreferencerequest()
{
	if( $('form#request_reference_form').valid() == true)
	{
		
		// for updating ckditor i.e. sending ckeditor data in serialised form data
		/*for (instance in CKEDITOR.instances) {
	        CKEDITOR.instances[instance].updateElement();
	    }*/
		var loading_img = addLoadingImage($("#send_request"), "before","loading_small_purple.gif",'45','16', 'fl');

		$str = $("form#request_reference_form").serialize();
		$.ajax({
			url : "/" + PROJECT_NAME + "reference-request/send-reference-request",
			method : "POST",
			data : $str,
			type : "post",
			dataType : "json",
			success : function(jsonData) {
				if(jsonData == 1)
				{
					$("span#"+loading_img).remove();
					$("form#request_reference_form").trigger('reset');
					$("div.message_box").remove();
					showDefaultMsg( "Reference Request(s) has been sent.", 1 );
					$("#send_request").show();
				}			
			},
			error:function(xhr, ajaxOptions, thrownError) 
			{
				showDefaultMsg( "An error occurred! Please try again.", 2);
			}
		});
	}
}




