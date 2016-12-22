function display_form(){
	$("#honours-detail").css("display","none");
	$("#edit-honours").css("display","block");
}
$( document ).ready(function() {
	// edit additional info....
	$("span#honors-awards").click(function() {
		editHonoursAwards();
	});
	
	$("input#save-honors-awards").click(function(){
		if( $( "form#honors-awards-form" ).valid() )
		{	
			saveHonoursAwards();
		}	
	});
	
	// cancel additional info...
	$("#cancel").click(function() {
		// removeFormValidationMessages( validator );
		$("#edit-honours").hide();
		$("#honors-awards").fadeIn("slow");
		$("#honours-detail").fadeIn("slow");
	});
	
	// validate form.....
	validator = $( "form#honors-awards-form" ).validate({
		rules: {
			honours:{
				required : true,
				maxlength : 250
			}		
		}
//		messages:{
//			honours:{
//				required : "Please enter some text"
//			}
//		}
	});
});
/**
 * function used to display hornors & awards information for editing purpose
 * Author: Sunny patial
 * version: 1.0
 */
function editHonoursAwards(){
	//$("#honors-awards").hide();
	var iddd = addLoadingImage($("span#honors-awards"), "before");
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/edit-honours-n-awards",
		method : "POST",
		data : {},
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			$("#honours-detail").hide();
			$("#honors-awards").hide();
			$("#honours").val(jsonData.honors_n_awards);
			$("span#"+iddd).remove();
			$("#cancel").fadeIn("slow");
			$("#edit-honours").fadeIn("slow");
			
		}
	});
}
/**
 * function used to save honors and awards information
 * Author: Sunny patial
 * version: 1.0
 */
function saveHonoursAwards(){
	$("input[name=save-honors-awards]").attr("disabled","disabled");
	var iddd = addLoadingImage($("input#save-honors-awards"), "before");
	$str = $("form#honors-awards-form").serialize();
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/save-honours-n-awards",
		method : "POST",
		data : $str,
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			if(jsonData.msg="success"){
				getHonoursNAwards(iddd);
				
			}			
		}
	});
}
/**
 * function used to display honors and awards information
 * Author: Sunny patial
 * version: 1.0
 */
function getHonoursNAwards(iddd){
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/edit-honours-n-awards",
		method : "POST",
		data : {},
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			$("input[name=save-honors-awards]").removeAttr('disabled');
			$("#honors-awards").fadeIn("slow");
			$("#edit-honours").hide();
			$("#honors-awardstext").html(jsonData.honors_n_awards);
			$("span#"+iddd).remove();
			$("#honours-detail").fadeIn("slow");
		}
	});
}