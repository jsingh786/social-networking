function display_form(){
	$("#hobbie-detail").css("display","none");
	$("#edit-hobbies").css("display","block");
}
$( document ).ready(function() {
	// edit additional info....
	$("span#additional-info").click(function() {
		editAdditionalInfo();
	});
	
	$("input#save-additionalinfo").click(function(){
		if( $( "form#additional-info-form" ).valid() )
		{	
			saveAdditionalInfo();
		}	
	});
	
	// cancel additional info...
	$("#cancel").click(function() {
		// removeFormValidationMessages( validator );
		$("#additional-info").fadeIn("slow");
		$("#edit-hobbies").hide();
		$("#hobbie-detail").fadeIn("slow");
	});
	
	// validate form.....
	validator = $( "form#additional-info-form" ).validate({
		rules: {
			hobbie:{
				required : true,
				maxlength: 255
			}		
		}
	});
});
/**
 * function used to display additional information of the user for editing purposes
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function editAdditionalInfo(){
	
	var iddd = addLoadingImage($("span#additional-info"), "before", 'loading_small_purple.gif', 30, 0, 'basic-info-loader');
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/edit-additional-info",
		method : "POST",
		data : {},
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			$("input[name=cancel]").fadeIn("slow");
			$("#additional-info").hide();
			$("#hobbie-detail").hide();
			$("#hobbie").val(jsonData.hobbies);
			$("span#"+iddd).remove();
			$("#edit-hobbies").fadeIn("slow");
			
		}
	});
}
/**
 * function used to save additional information
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function saveAdditionalInfo(){
	$("input[name=save-additionalinfo]").attr("disabled","disabled");
	var iddd = addLoadingImage($("input#save-additionalinfo"), "before");
	$str = $("form#additional-info-form").serialize();
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/save-additional-info",
		method : "POST",
		data : $str,
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			if(jsonData.msg="success"){
				getAdditionalInfo(iddd);
				
			}			
		}
	});
}
/**
 * function used to display additional information of the user for editing purposes
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function getAdditionalInfo(iddd){
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/edit-additional-info",
		method : "POST",
		data : {},
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			$("#additional-info").fadeIn("slow");
			$("input[name=save-additionalinfo]").removeAttr('disabled');
			$("#additional-info").fadeIn("slow");
			$("#edit-hobbies").hide();
			$("#additional-infotext").html(jsonData.hobbies);
			$("span#"+iddd).remove();
			$("#hobbie-detail").fadeIn("slow");
		}
	});
}