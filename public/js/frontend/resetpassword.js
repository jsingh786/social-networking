

$(document).ready(function() {	
	
/*--validation for reset password form starts---*/
 $("form#rpform").validate(
		{
			rules : {
				pwd : {
					required: true,
					ilook_password: true,
					minlength: 8,
					maxlength: 20
				},
				cpwd : {
					required : true,
					minlength : 8,
					maxlength :20,
					ilook_password: true,
					equalTo : "#pwd"
				}
			},
			messages : {
			      pwd : {
			    	  required  : "Please enter your password",
					  minlength : "Please enter minimum 8  characters",
					  maxlength : "Please enter maximum 20  characters"
					  },
				  cpwd : {
					  required  : "Please confirm your password",
					  minlength : "Please enter minimum 8  characters",
					  maxlength : "Please enter maximum 20  characters",
					  equalTo   : "Password does not Match"
					}
				}
				
		});
 
/*-- validation for reset form ends  --*/
 
//Cancel click
 $('#cancel').click(function(){
	 $("input#cancel" ).removeClass('btn-cancel');
	 $("input#cancel" ).addClass('btn-save');
	 $('input#rpsubmit').removeClass('btn-save');
	 $('input#rpsubmit').addClass('btn-cancel');
 	location.href = "/"+ PROJECT_NAME +"index";
  });
 
 //save click
 $('#rpsubmit').click(function(){
	 $("input#rpsubmit" ).removeClass('btn-cancel');
	 $("input#rpsubmit" ).addClass('btn-save');
	 $('input#cancel').removeClass('btn-save');
	 $("input#cancel" ).addClass('btn-cancel');
	 
 	//location.href = "/"+ PROJECT_NAME +"index";
  });
 
 
});




