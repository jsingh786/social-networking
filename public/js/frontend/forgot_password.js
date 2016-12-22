jq = jQuery;
$( document ).ready(function() {
	
	//logo click
	$('#logo-inner').click(function(){
		location.href = "/"+ PROJECT_NAME ;
	});
	
	// validate form.....
	validator = $( "form#forgotPwd" ).validate({	
		rules: {
			emailForgot:{
				required: true,
				email: true,
				noSpace: true,
				remote: {
					url: "/"+PROJECT_NAME+"Authenticate/check-Email",
					type: "post",
					beforeSend: function() {
						$("input#forgot_email_submit").attr('disabled', 'disabled');
						
						$("span#email_validate_image").html("<div style = 'margin-top:4px;'><img src = '"+IMAGE_PATH+"/loading_small_purple.gif'></div>");
					},
					complete: function(data) {
						$("input#forgot_email_submit").removeAttr('disabled');
						if(data.responseText == 'true')
						{
							$("span#email_validate_image").html("<img src = '"+IMAGE_PATH+"/tick_icon.png'>");
							$("div#emailExistsMsg").html("This is a registered email, please click 'SEND' button to send an email.");
						}
						else
						{
							$("span#email_validate_image").html("");							
							$("div#emailExistsMsg").html("");							
						}
					},
					data: {
						emailForgot: function() {
								return $( "#emailForgot" ).val();
						}
					}
				}
			},	
		},
		messages: {
			emailForgot: {
				required:"please enter email id.",
				email:"Please enter correct email id.",
				remote: "Email id does not exist in our database or is disabled!"
	        }
		}
	
	});
	$("input#forgot_email_submit").click(function(){
		$('#forgot-suggestion').hide(); 
		if( $("form#forgotPwd").valid() )
		{
			$("div.message_box").remove();
			var thiss = $(this);
			var email = jq('#emailForgot').val();

			$(this).hide();
			$('#forgot_password_msg').css('visibility','hidden');
			
			var iddd = addLoadingImage($("input#forgot_email_submit"),"after","loading_medium_purple.gif", 79, 68);
			jq.ajax({
				url:'/' + PROJECT_NAME + 'authenticate/forgotpwd',
				type:'POST',
				dataType: "json",
				data: 'email='+email,
				beforeSend: function() {
					// alert("loading")
				},
				success:function(jsonData){
					$("span#"+iddd).remove();
					thiss.show();
					
					$('div.message_box').remove();
					
					$("span#email_validate_image").html("");
					$("div#emailExistsMsg").html("");
					
					if( jsonData == true )
					{
						showDefaultMsg("Password reset mail has been sent to your email ID.", 1 );
					}
					else if( jsonData == false )
					{
						showDefaultMsg("Oops! some error occured. Password reset mail has not been sent to your email ID.", 2 );
					}
					else
					{
						showDefaultMsg("Oops! some error occured. Please contact administrator.", 2 );
					}
				}
			});
	        }
		});
		
	

});
