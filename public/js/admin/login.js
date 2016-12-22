$(document).ready(function(){
	//Validations----------------
	validator = $("div#imbullwrap form#form1").validate({
		rules: {
			email:{
				required : true,
				noSpace: true,
				email: true
			},
			pwd:{
				required: true,
				ilook_admin_password: true,
				noSpace: true,
				minlength: 8,
				maxlength: 20
			}
		}
	});
	//End validations------------
});

