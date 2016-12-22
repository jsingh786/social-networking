$( document ).ready(function() {
	
	//logo click
	$('#logo-inner').click(function(){
		location.href = "/"+ PROJECT_NAME ;
	});
	
	
	// validation for change password form
	$( "form#form_change_pswd" ).validate({
		errorElement: "div",
		rules: {
			cg_password: {
				required: true,
				ilook_admin_password : true,
				noSpace: true,
				minlength: 8,
				maxlength: 30
			},
			cg_cpassword: {
				required: true,
				noSpace: true,
				minlength: 8,
				maxlength: 30,
				equalTo : '#password'
			}
		},
		messages: {
			password:{
				noSpace:"Please enter password"
			},
			cpassword:{
				noSpace:"Please enter confirm password",
				equalTo : "Passwords do not match"
			}
			
		}
	});
	
	$("button#change_password_button").click(function(){
		changePwdSubmit();
	});
	$(document).keypress(function(e) {
	    if(e.which == 13) {
	    	changePwdSubmit();
	    }
	});
		
	

});

function changePwdSubmit()
{
	if( $("form#form_change_pswd").valid() )
	{
		$("div.message_box").remove();
		//var thiss = $(this);
		var password = $('#cpassword').val();
		
		$.ajax({
			url:'/' + PROJECT_NAME + 'admin/sub-admins/change-password',
			type:'POST',
			dataType: "json",
			data: 'password='+password,
			beforeSend: function() {
				// alert("loading")
			},
			success:function(jsonData){
				if( jsonData == 0 )
				{
					showDefaultMsg("Your new password should not be same as old one", 2);
				}
				else if( jsonData == 1 )
				{
					showDefaultMsg("Password changed successfully",1);
					window.location.href="/" + PROJECT_NAME + "admin/manage-users/";
				}
				else if( jsonData == 2)
				{
					showDefaultMsg("Please try again",2);
				}
			}
		});
    }	
}