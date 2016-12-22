var idi;
$(document).ready(function(){
	
    /*
     * @author jsingh7
     */
	jQuery.validator.addMethod("custom_number", function(value, element) {
	    return this.optional(element) || value != value.match(/^[a-zA-Z]+$/) &&
	        value.match(/^[0-9,\+-]+$/);
	}, "Please enter a valid Phone number");
	

	validator = $( "form#edit_contact_details" ).validate({
		rules: {
			tel_1:{
				//required : true,
				//number:true,
				
				//regex:/[0-9\-#\.\(\)\/%&\s]{0,19}/,
				minlength: 3,
				maxlength: 16,
				custom_number:true,
				
				
				require_from_group:[1, ".group-required"]
			},
			tel_2:{
				//number:true,
				minlength: 3,
				//minlength: 10,
				maxlength: 16,
				custom_number:true,
				require_from_group:[1, ".group-required"]
			},
			profile: 
			{
				maxlength:50,
				remote: {
					url: "/"+PROJECT_NAME+"profile/check-username-exist",
					type: "post",
//					beforeSend: function() {
//						idi = addLoadingImage($("input#save_contact_dtls"), "before");
//						$("input#save_contact_dtls").hide();
//					},
//					complete: function() {
//						$("span#"+idi).remove();
//						$("input#save_contact_dtls").show();
//					},
					beforeSend: function() {
						$("input#save_contact_dtls").attr("disabled", "disabled");
						$("div#profile-validate").html("<img style = 'margin-top: 5px;' src = '"+IMAGE_PATH+"/loading_small_purple.gif'>");
					},
					complete: function(data) {
						if(data.responseText == "true")
						{
							$("input#save_contact_dtls").removeAttr("disabled");
							$("div#profile-validate").html("<img src = '"+IMAGE_PATH+"/tick_icon.png' alt='Ok' title='Ok'>");
						}
						else
						{
							$("input#save_contact_dtls").removeAttr("disabled");
							$("div#profile-validate").html("");							
						}
					},
					data: {
							username: function() {
								return $( "input[name=profile]" ).val();
							}	
					}
				},
				require_from_group:[1, ".group-required"]
			}
		},
		messages: {
			profile: {
	            remote: "Oops! This profile name is not avalaible."
	        },
	        tel_1: {
	        	//number: "Please enter a valid phone number.",
	        		regex: "please enter valid",
	        	minlength:"Please enter atleast 3 digits.",
	        	maxlength:"Please do not enter more than 16 digits."
        },
        tel_2: {
        	//number: "Please enter a valid phone number.",
        	minlength:"Please enter atleast 3 digits.",
        	maxlength:"Please do not enter more than 16 digits."
        }


		}
	});
//	contact-details show hide------
	$("span#edit_contact_dtls_btn").click(function(){
		$("div#profile-validate").html("");//removing tick mark on slug/profile field.
		getAndFillMyContactdtls( $(this) );
	});
	$("a#cancel_edit_contact_dtls").click(function(){
		$("div#show_contact_details").fadeIn("slow");
		$("span#edit_contact_dtls_btn").fadeIn("slow");
		$("div#edit_contact_details").hide();
	});
	$("input#save_contact_dtls").click(function(){
		
		if( $( "form#edit_contact_details" ).valid() )
		{	
			var dataa = $("form#edit_contact_details").serialize();
			var idd = addLoadingImage($(this), 'before');
			jQuery.ajax({
		        url: "/" + PROJECT_NAME + "profile/save-my-contact-details",
		        type: "POST",
		        dataType: "json",
		        data: dataa,
//		        cache: false,
		        timeout: 50000,
		        success: function(jsonData) {
		        	if(jsonData.username){
		        		var usernme = PROJECT_URL+PROJECT_NAME + jsonData.username;
		        	}else{
		        		var usernme = "";
		        	}
		        	$("span#tel_1").text(jsonData.tel_1);
		        	$("span#tel_2").text(jsonData.tel_2);
		        	var cropped_usernme = showCroppedText( usernme, 54 )
		        	$("span#username").text(cropped_usernme);
		        	$("span#username").attr('title', usernme);
		        	$("span#"+idd).remove();
		        	$("div#show_contact_details").fadeIn("slow");
		    		$("span#edit_contact_dtls_btn").fadeIn("slow");
		    		$("div#edit_contact_details").hide();
				},
		        error: function(xhr, ajaxOptions, thrownError) {
					//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
				}
		    });
		}
	});
//	end contact-details show hide------
});
/**
 * Function to get and fill contact details
 * of logged in user with ajax.
 * 
 * @author jsingh7
 * @version 1.0
 */
function getAndFillMyContactdtls(elem)
{
	var iddd = addLoadingImage(elem, "before", 'loading_small_purple.gif', 30, 0, 'basic-info-loader');
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "profile/get-my-contact-details",
        type: "POST",
        dataType: "json",
        async : false,
        data: {},
//        cache: false,
        timeout: 50000,
        	
        success: function(jsonData) {
        	$("input[name=tel_1]").val(jsonData.tel_1);
        	$("input[name=tel_2]").val(jsonData.tel_2);
        	$("input[name=profile]").val(jsonData.username);
        	$("span#"+iddd).remove();
        	removeFormValidationMessages( validator );
        	$("div#show_contact_details").hide();
    		$("span#edit_contact_dtls_btn").hide();
    		$("div#edit_contact_details").fadeIn("slow");
		},
        error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
		}
    });
}
