jq = jQuery;
$( document ).ready(function() {
	
	//logo click
	$('#logo-inner').click(function(){
		location.href = "/"+ PROJECT_NAME ;
	});
	
	// validate form.....
	validator = $( "form#form_recover_pswd" ).validate({	
		rules: {
			email:{
				required: true,
				email: true,
				noSpace: true,
				remote: {
					url: "/"+PROJECT_NAME+"admin/recovery/check-Email",
					type: "post",
					beforeSend: function() {
						$("button#forgot_email_submit").text('Sending...');
						$("button#forgot_email_submit").attr('disabled', 'disabled');
						
						
					},
					complete: function(data) {
						$("button#forgot_email_submit").text('Send');
						$("button#forgot_email_submit").removeAttr('disabled');
						if(data.responseText == 'true')
						{
//							$("span#email_validate_image").html("<img src = '"+IMAGE_PATH+"/tick_icon.png'>");
							$("div#emailExistsMsg").html("This is a registered email, please click 'SEND' button to send an email.");
						}
						else
						{
//							$("span#email_validate_image").html("");							
							$("div#emailExistsMsg").html("");							
						}
					},
					data: {
						emailForgot: function() {
								return $( "#email" ).val();
						}
					}
				}
			},	
		},
		messages: {
			email: {
				required:"please enter email id.",
				email:"Please enter correct email id.",
				remote: "Email id does not exist"
	        }
		}
	
	});
	$("button#forgot_email_submit").click(function()
	{
		$('div#success_error_msg').empty();
//		$("span#email_validate_image").html();
		if( $("form#form_recover_pswd").valid() )
		{
			$("div.message_box").remove();
			var thiss = $(this);
			var email = jq('input#email').val();
//			$('#forgot_password_msg').css('visibility','hidden');
			
			$(this).text('Sending...');
			$("button#forgot_email_submit").attr('disabled', 'disabled');
//			var iddd = addLoadingImage($("button#forgot_email_submit"),"after","loading_medium_purple.gif");
			jq.ajax({
				url:'/' + PROJECT_NAME + 'admin/recovery/send-reset-pswd-email',
				type:'POST',
				dataType: "json",
				data: 'email='+email,
				beforeSend: function() {
					// alert("loading")
				},
				success:function(jsonData)
				{
					$("span#email_validate_image").html("");
					$("div#emailExistsMsg").html("");
					
					$("button#forgot_email_submit").text('Send');
					$("button#forgot_email_submit").removeAttr('disabled');
					if( jsonData == true )
					{
						
						$('div#success_error_msg').html('Mail has been sent to your email. Please check to reset your password.');
//						showDefaultMsg("Password reset mail has been sent to your email id.", 1 );
					}
					else if( jsonData == false )
					{
						$('div#success_error_msg').html('Due to some error mail could not be sent. Please try again');
//						showDefaultMsg("Password reset mail has not been sent to your email id.", 2 );
					}

				}
			});
	        }
		});
});