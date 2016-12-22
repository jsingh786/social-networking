$(document).ready(function()
{
	
	//date picker for expiry date field for create sub-admins page
	$( "#expiry_date" ).datepicker({
		minDate : 0,
		defaultDate: "+1w",
		changeMonth: true,
		changeYear: true,
		numberOfMonths: 1,
		dateFormat:"yy-mm-dd",
		onSelect: function( selectedDate ) {
			$(this).trigger("focus").trigger("blur");//to manage validations
		},
		 beforeShow: function (input, inst) {
		        var rect = input.getBoundingClientRect();
		        setTimeout(function () {
			        inst.dpDiv.css({ top: rect.top + 40, left: rect.left + 0 });
		        }, 0);
		    }
	});
	
	// validation for edit  admin page
	$( "#edit-admin" ).validate({
		errorElement: "div",
		rules: {
			first_name: {
				required: true,
				noSpace: true,
				alphaOnly:true,
				minlength: 3,
				maxlength: 30
			},
			last_name: {
				required: true,
				noSpace: true,
				alphaOnly:true,
				minlength: 3,
				maxlength: 30
			},
			email_id: {
				required: true,
				email: true,
				noSpace: true,
				remote: {
					url: "/"+PROJECT_NAME+"admin/profile/check-email-exist-admin",
					type: "post",
					beforeSend:"",
					complete: "",
					data: {
							current_email: function() 
							{
								return $( "#current_email_id" ).val();
							}
					}
				}
			},
			expiry_date: {
				required: true
			},
			password: {
				ilook_admin_password : true,
				minlength : 8,
			},
			cpassword: {
				required: false,
				noSpace: true,
				minlength: 3,
				maxlength: 30,
				equalTo : '#password'
			},
			general_password: {
				minlength : 6,
				maxlength : 6,
				number : true
			}
		},
		messages: {
			first_name:{
				noSpace:"Please enter valid first name"
			},
			last_name:{
				noSpace:"Please enter valid last name"
			},
			email_id: {
	            remote: "Not available!"
	        },
	        expiry_date: {
				required: "Please select expiry date"
			},
			profile_pic: {
				required : 'Please upload profile pic'
			},
			cpassword:{
				noSpace:"Please enter confirm password",
				equalTo : "Passwords do not match"
			},
			general_password: {
				number : "Only numbers are allowed"
			}
			
		}
	});


});


/**
 * remove sub-admin profile picture
 * @author sjaiswal
 * @param user_id integer
 * @version 1.0
 */

function removeAdminProfilePicture(user_id)
{
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "admin/profile/remove-profile-picture",
        type: "POST",
        dataType: "json",
        data: {
            	'user_id': user_id
              },
        timeout: 50000,
        success: function(jsonData) {
	        if( jsonData == 1 )
	        {
		        showDefaultMsg('Profile picture removed.',1);
		        $('#admin_profile_image').hide();
		        $('.cross_image_icon').hide();
			}
			else
			{
				showDefaultMsg('Profile picture not removed.',1);
			}
        }
        
	});
}



