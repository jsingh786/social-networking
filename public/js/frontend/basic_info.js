function display_form(){
	$("#view-basic-info").css("display","none");
	$("#edit-basic-info").css("display","block");
}
$( document ).ready(function() {
	
	//country change.
	$("#simple_country").change(function(){
		var country_id = $('#simple_country').val();
    	fillUpState(country_id);
    });
	 //state change.
    $("#simple_state").change(function(){
    	var state_id = $('#simple_state').val();
    	fillUpCity(state_id);
    });
   
	$("span#basicinfo").click(function() {
		editBasicInfo();
	});
	$("input#save-basicinfo").click(function(){
		if( $( "form#basicinfo_form" ).valid() )
		{	
			saveBasicinfo();
		}	
	});
	$("#cancel").click(function() {
		removeFormValidationMessages( validator );
		$("#edit-basic-info").hide();
		$("#view-basic-info").fadeIn("slow");
	});
	// validate form.....
	jQuery.validator.addMethod("specialChars", function( value, element ) {
        var regex = new RegExp("^[a-zA-Z0-9_ ]*$");
        var key = value;

        if (!regex.test(key)) {
           return false;
        }
        return true;
    }, "Please do not enter Special Characters");
	validator = $( "form#basicinfo_form" ).validate({
		rules: {
			fname:{
				required : true,
				noSpace: true,
				alphaOnly:true,
				minlength: 3,
				maxlength: 30
			},
			mname:{
				noSpace: true,
				alphaOnly:true,
				minlength: 3,
				maxlength: 30
			},
			lname:{
				required : true,
				required : true,
				noSpace: true,
				alphaOnly:true,
				minlength: 3,
				maxlength: 30
			},
			genderlist:{
				required : true
			},
			prof_headline:{
				required : true,
				minlength: 4,
				maxlength: 50
			},
			countrylist:{
				required : true
			},
			simple_state:{
				required : true
			},
			simple_city:{
				required : true
			},
			zipcode:{
				//required : true,
				maxlength: 15,
				specialChars:true
				
			},
			industrylist:{
				required : true
			}
		},
		messages: {
			fname:{
				required : "first name is required",
				noSpace:"Please enter valid first name"
			},
			mname:{
				required : "middle name is required",
				noSpace:"Please enter valid middle name"
			},
			lname:{
				required : "last name is required",
				noSpace:"Please enter valid last name"
			},
			prof_headline:{
				required : "professional headline required"
			},
			countrylist:{
				required : "Country required"
			},
			zipcode:{
				//required : "Zipcode is required"
			},
			industrylist:{
				required : "Industry required"
			}
		}
	});
});
/**
 * function used to display basic information of the user for editing purposes
 * @author: Sunny Patial
 * @date: 5,Aug 2013
 * @version: 1.0
 */
function editBasicInfo(){
	var iddd = addLoadingImage($("span#basicinfo"), "before", 'loading_small_purple.gif', 30, 0, 'basic-info-loader');
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/edit-basic-info",
		method : "POST",
		data : {},
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			if(jsonData.info)
				{
				
			$("#view-basic-info").hide();
			$("#fname").val(jsonData.info['firstname']);
			$("#mname").val(jsonData.info['middle_name']);
			$("#lname").val(jsonData.info['lastname']);
			$("#prof_headline").val(jsonData.info['professional_headline']);
			$('#countrylist').val(jsonData.info['country_id']);
			$("#zipcode").val(jsonData.info['zipcode']);
				
			if(jsonData.industry)
				{
			
			
				$('#industrylist').val(jsonData.industry['industry_id']);
				}
			else
				{
		//alert('ssss');
				$('#industrylist').val();
				}
				}
			$("span#"+iddd).remove();
			$("#edit-basic-info").fadeIn("slow");
		}
	});
}
/**
 * function used to save basic information
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function saveBasicinfo(){
	var iddd = addLoadingImage($("input#save-basicinfo"), "before");
	$str = $("form#basicinfo_form").serialize();
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/save-basic-info",
		method : "POST",
		data : $str,
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			if(jsonData.msg="success"){
				getBasicInfo(iddd);
				//Updating user name on header.
				$("h5#user_name a").text($("form#basicinfo_form div.contact-details input#fname").val()+" "+$("form#basicinfo_form div.contact-details input#lname").val());
			}			
		}
	});
}
/**
 * function used to display basic information. 
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function getBasicInfo(iddd){
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/edit-basic-info",
		method : "POST",
		data : {},
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			
			$("#edit-basic-info").hide();
			$("#sfname").html(jsonData.info['firstname']);
			$("#smname").html(jsonData.info['middle_name']);
			$("#slname").html(jsonData.info['lastname']);
			$("#sprof_headline").html(jsonData.info['professional_headline']);
			$('#scountrylist').html(jsonData.info['name']);
			if(jsonData.info['state']){
				$("div #sstate_div").show();
				$('#sstate').html(jsonData.info['state']);
			}else{
				$("div #sstate_div").hide();
			}

			if(jsonData.info['city']){
				$("div #scity_div").show();
				$('#scity').html(jsonData.info['city']);
			}else{
				$("div #scity_div").hide();
				$('#scity').html("");
			}
			
			//$('#scity').html(jsonData.info['city']);
			$('#sgender').html(jsonData.info['gender']);
			
			$("#szipcode").html(jsonData.info['zipcode']);
			if(jsonData.industry)
			{
				$('#sindustrylist').html(jsonData.industry['title']);		
			}
	
			$("span#"+iddd).remove();
			$("#view-basic-info").fadeIn("slow");
			
		}
	});
}

/**
 * Manages state dropdown acording to country selected,
 * If country selected has no states but cities, it fillup cities
 * in city dropdown.
 * 
 * @author nsingh3,sjaiswal
 * @vesion 1.1
 */
function fillUpState(country_id)
{
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/get-response-for-country-selected",
		method : "POST",
		data : {"country_id": country_id},
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			console.log(jsonData);
			$("#simple_state").html('<option value = "">SELECT</option>');
			$("#simple_city").html('<option value = "">SELECT</option>');
			if( jsonData.count == 0 )
			{
				$("div#simple_state_div").css("display","none");
				$("div#simple_city_div").css("display","none");	
			}
			$("#simple_state_div").fadeIn();
			var optionsForStates = "";
			var optionsForCities = "";
			if( jsonData.count > 0 )
			{
				optionsForStates += '<option value = "">SELECT</option>';
				for( i in jsonData.options )
				{
					optionsForStates += '<option value = "'+jsonData.options[i]['id']+'">'+jsonData.options[i]['name']+'</option>';
				}
				$("#simple_state").html(optionsForStates);
				$("#simple_state_div").fadeIn();
			}
			else
			{
				optionsForCities += '<option value = "">SELECT</option>';
				for( j in jsonData.options )
				{
					optionsForCities += '<option value = "'+jsonData.options[j]['id']+'">'+jsonData.options[j]['name']+'</option>';
				}
				$("#simple_city").html(optionsForCities);
				$("#simple_state_div").hide();		
			}	
			
		}
	});
}

/**
 * Manages state dropdown acording to state selected,
 * 
 * @author nsingh3
 * @vesion 1.0
 */
function fillUpCity(state_id)
{
	$.ajax({
		url : "/" + PROJECT_NAME + "job/get-response-for-state-selected",
		method : "POST",
		data : {"state_id": state_id},
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			if(jsonData.count > 0)
			{
				$("#simple_city_div").show();
				$("#simple_city").html('<option value = "">SELECT</option>');
				var optionsForCities = "";
				optionsForCities += '<option value = "">SELECT</option>';
				for( i in jsonData.options )
				{
					optionsForCities += '<option value = "'+jsonData.options[i]['id']+'">'+jsonData.options[i]['name']+'</option>';
				}
				$("#simple_city").html(optionsForCities);
			}
			else
			{
				$("#simple_city_div").hide();
				$("#scity_div").hide();
				$("#scity").text("");
			}
		}
	});
}