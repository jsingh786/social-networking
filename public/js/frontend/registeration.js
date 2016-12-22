var currentStateRequest = null;
var currentCityRequest = null;
$(document).ready(function() {
	
	//currunt_company checkbox click
	 $("input#currently_working").change(function() {
	    if(this.checked) 
	    {
	        $("input[name=employed_to]").val("");
	        $("input[name=employed_to]").attr("disabled", true);
	        $("input[name=employed_to]").removeClass("error");
	        $("label[for="+$('input[name=employed_to]').attr('id')+"]").remove();
	    }
	    else
	    {
	        $("input[name=employed_to]").removeAttr("disabled");
	    }	
	}); 
	
	
  //Automated regular AJAX call-----
    
//	get country state city prefilled on page load
    getLocation();
    
	var d = new Date();
	var year = d.getFullYear() - 13;
	d.setFullYear(year);

	// assign datepicker to textboxes 
	$( "input#b_day" ).datepicker({
		maxDate:0,
		changeMonth: true,
		changeYear: true,
		yearRange: '1950:' + year + '',
		defaultDate: d,
		dateFormat:"dd-mm-yy",
		onSelect: function( selectedDate ) {
			$(this).trigger("focus").trigger("blur");//to manage validations
		}
    });

	

	var school_url = "/" + PROJECT_NAME + "registration/get-schools-list";
	var company_url = "/" + PROJECT_NAME + "registration/get-all-ref-companies";
	autoComplete( 'input[type=text]#college', school_url);
	autoComplete( 'input[type=text]#employed_company', company_url);
	
/*--Validations for registration step-2 - starts here by RSharma---*/	
	jQuery.validator.addMethod("specialChars", function( value, element ) {
        var regex = new RegExp("^[a-zA-Z0-9_ ]*$");
        var key = value;

        if (!regex.test(key)) {
           return false;
        }
        return true;
    }, "Please do not enter Special Characters");
	
	$( "#registeration_step2" ).validate({
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
			genderlist: {
				required: true
			},
			country: {
				required: true
			},
			state:{
				//required : true,
			},
			city:{
				//required : true,
			},
			zipcode: {
				maxlength: 15,
				specialChars:true
			},

			email: {
				required: true,
				email: true,
				noSpace: true,
				remote: {
					url: "/"+PROJECT_NAME+"registration/check-email-exist",
					type: "post",
					beforeSend: function()
					{
						//$("input#save_dtls").attr("disabled", "disabled");
						$("input#save_dtls").hide();
						$("div#email-available").html("<img style = 'margin-top: 5px;' src = '"+IMAGE_PATH+"/loading_small_purple.gif'>");
					},
					complete: function(data) {
//						$("input#save_dtls").removeAttr("disabled");
						$("input#save_dtls").fadeIn();
						if(data.responseText == "true")
						{
							$("div#email-available").html("<img src = '"+IMAGE_PATH+"/tick_icon.png' alt='Ok' title='Ok'>");
						}
						else
						{
							$("div#email-available").html("");							
						}	
					},
					data: {
							email: function() 
							{
								return $( "#email" ).val();
							}
					}
				}
			},
			password: {
				required: true,
				ilook_password: true,
				minlength: 8,
				maxlength: 20
				
			},
			confirm_password: {
				required: true,
				ilook_password: true,
				minlength: 8,
				maxlength: 20,
				equalTo: "#password"
				
			},
			employed_jobTitle: {
				required: true,
				minlength: 2,
				maxlength: 30
			},
			employed_company: {
				required: true,
				minlength: 2,
				maxlength: 100
			},
			employed_from: {
				required: true
			},
			employed_to: {
				required: true
			},

			jobseeker_jobTitle: {
				required: true,
				minlength: 2,
				maxlength: 30
			},
			jobseeker_company: {
				required: true,
				minlength: 2,
				maxlength: 30
			},
			employed_industry: {
				required: true
			},
			experience_from: {
				required: true
			},
			experience_to: {
				required: true
			},
			college: {
				required: true,
				minlength: 2,
				maxlength: 50
			},
			student_from: {
				required: true
			},
			student_to: {
				required: true
			}
			
		},
		messages: { 
			email: {
	            remote: "Not available !"
	        },
	        first_name:{
			    noSpace:"Please enter valid first name"
		    },
		    last_name:{
		    	noSpace:"Please enter valid last  name"
		    }
		}
	});

/*--Validations for registration step-2 - end here by Ritu Sharma---*/
/*--Display the Role options as per the role selected on registration page starts here by DLverma---*/	

	//Employed input fields
	  
	$('#employed').show();	
	 $('#jobseeker').hide();
	 $('#student').hide();

	$('.cstatus').bind('click',function(){
	 var val=$(this).attr('id');
	
	 if(val=="Employed"){
		 $('#jobseeker').hide(); 
		 $('#student').hide();
		 $('#employed').show();	
	 }
	 else if(val=="JobSeeker"){
		 $('#jobseeker').show();
		 $('#student').hide();
		 $('#employed').hide();
	 }
	 else if(val=="Student"){
		 $('#jobseeker').hide();
		 $('#student').show();
		 $('#employed').hide();
	 }
	 else if(val=="recruiter"){
		 $('#jobseeker').hide();
		 $('#student').hide();
		 $('div#employed').show();
	 }
	 else if(val=="HomeMaker"){
		 $('#employed').hide();
		 $('#jobseeker').hide();
		 $('#student').hide();
	 }
	 });

	
	
/*-- Display the Role options as per the role selected on registeration page end here--*/	
		
/*--Code for Jobseeker-datepicker range starts here by Ritu Sharma on 17 June, 2013--*/	
	$(function() {
			$( "#experience_from" ).datepicker({
				defaultDate: "+1w",
				changeMonth: true,
				changeYear: true,
				yearRange: "-100:+0",
				numberOfMonths: 1,
				maxDate: new Date,
				dateFormat:"dd-mm-yy",
				onClose: function( selectedDate ) {
					$( "#experience_to" ).datepicker( "option", "minDate", selectedDate );
				},
				onSelect: function( selectedDate ) {
					$(this).trigger("focus").trigger("blur");//to manage validations
				}
			});
			$( "#experience_to" ).datepicker({
				defaultDate: "+1w",
				changeMonth: true,
				changeYear: true,
				yearRange: "-100:+0",
				numberOfMonths: 1,
				dateFormat:"dd-mm-yy",
				onClose: function( selectedDate ) {
					$( "#experience_from" ).datepicker( "option", "maxDate", selectedDate );
				},
				onSelect: function( selectedDate ) {
					$(this).trigger("focus").trigger("blur");//to manage validations
				}
			});
		});	
	
/*--Code for datepicker range end here by Ritu Sharma on 17 June, 2013--*/		
	
/*--Code for Student-datepicker range starts here by Ritu Sharma on 17 June, 2013--*/	
	$(function() {
		$( "#student_from" ).datepicker({
			defaultDate: "+1w",
			changeMonth: true,
			changeYear: true,
			yearRange: "-100:+0",
			maxDate: new Date,
			numberOfMonths: 1,
			dateFormat:"dd-mm-yy",
			onClose: function( selectedDate ) {
				$( "#student_to" ).datepicker( "option", "minDate", selectedDate );
			},
			onSelect: function( selectedDate ) {
				$(this).trigger("focus").trigger("blur");//to manage validations
			}
		});
		
		$( "#student_to" ).datepicker({
			defaultDate: "+1w",
			changeMonth: true,
			changeYear: true,
			yearRange: "-100:+0",
			numberOfMonths: 1,
			dateFormat:"dd-mm-yy",
			onClose: function( selectedDate ) {
				$( "#student_from" ).datepicker( "option", "maxDate", selectedDate );
			},
			onSelect: function( selectedDate ) {
				$(this).trigger("focus").trigger("blur");//to manage validations
			}
		});
	});	
	
/*--Code for employed-datepicker range starts here by Shaina on 17 Jan, 2014--*/
	/*--Code for Employed-datepicker range starts here by Shaina on 17 Jan, 2014--*/	
	$(function() {
			$( "input#employed_from" ).datepicker({
				defaultDate: "+1w",
				changeMonth: true,
				changeYear: true,
				yearRange: "-100:+0",
				numberOfMonths: 1,
				maxDate: new Date,
				dateFormat:"dd-mm-yy",
				onClose: function( selectedDate ) {
					$( "input#employed_to" ).datepicker( "option", "minDate", selectedDate );
				},
				onSelect: function( selectedDate ) {
					$(this).trigger("focus").trigger("blur");//to manage validations
				}
			});
			$( "input#employed_to" ).datepicker({
				defaultDate: "+1w",
				changeMonth: true,
				changeYear: true,
				yearRange: "-100:+0",
				numberOfMonths: 1,
				maxDate: new Date,
				dateFormat:"dd-mm-yy",
				onClose: function( selectedDate ) {
					if(selectedDate)
					{
					$( "input#employed_from" ).datepicker( "option", "maxDate", selectedDate );
					}
				},
				onSelect: function( selectedDate ) {
					$(this).trigger("focus").trigger("blur");//to manage validations
				}
			});
		});	
	
/*--Code for datepicker range end here by Ritu Sharma on 17 June, 2013--*/		


	$('#cancel').click(function(){
		var Urla = "/" + PROJECT_NAME + "registration/clear-session";
		var Dataa = "";
		var Successa = function(){
			window.location.href = "/"+PROJECT_NAME;
		};
		AJAXCaller(Urla, Dataa, Successa);
	});
	
	
	//Disable submit button 
	$("input[type=submit]#save_dtls").click(function(event){
		if( $( "form#registeration_step2" ).valid() == true)
		{
		    $("form#registeration_step2").submit();
		    $(this).attr('disabled', 'disabled');
		    $(this).css('cursor', 'progress');
		}
	});
	
	 //Simple search country change.
    $("#country").change(function(){
    	fillUpSimpleSearchStateDD();
    });
    //Simple search state change.
    $("#simple_state").change(function(){
    	fillUpSimpleSearchCityDD();
    });
    
    $(".state_list").css("display","none");
    $(".city_list").css("display","none");
   


	
});

/**
 * ajax call for getting user country,state and city
 * 
 * @author sjaiswal
 */
function getLocation()
{
	 $.ajaxQueue({
        url: "/" + PROJECT_NAME + "registration/get-ip-details",
        type : "post",
		dataType : "json",
        data: {},
        success: function(jsonData) {
        var countryName = jsonData.countryName;
        var stateName = jsonData.regionName;
        var cityName = jsonData.cityName;
        
        $("select#country option").filter(function(index) {
    	return $(this).text() == countryName; }).attr('selected', 'selected');
     
        fillUpSimpleSearchStateDD();
        
        $("select#simple_state option").filter(function(index) {
        	return $(this).text() == stateName; }).attr('selected', 'selected');
        
       
        fillUpSimpleSearchCityDD();
        
        $("select#simple_city option").filter(function(index) {
        	return $(this).text() == cityName; }).attr('selected', 'selected');
      
        
        /*if(jsonData.cityName)
    	{
    		$('select#simple_city option:contains('+cityName+')').attr('selected', 'selected');
    	}*/ 
        
        	
        }
	});
}


/**
 * Manages state dropdown acording to country selected,
 * If country selected has no states but cities, it fillup cities
 * in city dropdown.
 * 
 * @author jsingh7,sjaiswal
 * @vesion 1.0
 */
function fillUpSimpleSearchStateDD()
{
	
	var country_id = $('#country').val();
	$.ajax({
		async:false,
		url : "/" + PROJECT_NAME + "registration/get-response-for-country-selected",
		method : "POST",
		data : {"country_id": country_id},
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			$("#simple_state").html('<option value = "">Select</option>');
			$("#simple_city").html('<option value = "">Select</option>');
			var optionsForStates = "";
			var optionsForCities = "";
			if( jsonData.count > 0 )
			{
				if( jsonData.have_states == 1 )
				{
					
					optionsForStates += '<option value = "">Select</option>';
					for( i in jsonData.options )
					{
						optionsForStates += '<option value = "'+jsonData.options[i]['id']+'"';
						optionsForStates += '>'+jsonData.options[i]['name']+'</option>';
					}
					$("#simple_state").html(optionsForStates);
					//$("#simple_state_div").fadeIn();
					if($('#country').val()!="")
					{
						$(".state_list").css("display","block");
							
					}

				}	
				if( jsonData.have_states == 0 )
				{
					$(".city_list").css("display","block");
					optionsForCities += '<option value = "">Select</option>';
					for( j in jsonData.options )
					{
						optionsForCities += '<option value = "'+jsonData.options[j]['id']+'"';
						optionsForCities += '>'+jsonData.options[j]['name']+'</option>';
					}
					//alert(optionsForCities);
					$("#simple_state_div").hide();
					$("select#simple_city").html(optionsForCities);
					
				}
			}
		}
	});
	return 1;
}


/**
 * Manages city dropdown acording to state selected,
 * 
 * @author jsingh7,sjaiswal
 * @vesion 1.1
 */
function fillUpSimpleSearchCityDD()
{
	if($('#simple_state').val()!="")
	{
		$(".city_list").css("display","block");
			
	}
	var state_id = $('#simple_state').val();
	if(state_id)
	{
	$.ajax({
		async:false,
		url : "/" + PROJECT_NAME + "registration/get-response-for-state-selected",
		method : "POST",
		data : {"state_id": state_id},
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			var optionsForCities = "";

			optionsForCities += '<option value = "">Select</option>';
			for( i in jsonData.options )
			{
				optionsForCities +='<option value = "'+jsonData.options[i]['id']+'"';
				optionsForCities += '>'+jsonData.options[i]['name']+'</option>';
			}
			$("#simple_city").html(optionsForCities);
		}
	});
	return 1;
	}
	
		
	}

/**
 * function used to display state dropdown
 * @author Sunny Patial
 * @version 1.0
 */
function stateList(){

		var countryHasStates=$('#country').val();
	
		var countryArr=countryHasStates.split(",");
		var country_id=countryArr[0];
		if(countryArr[1]==1){
			// country has states...
			currentStateRequest = $.ajax({
				url : "/" + PROJECT_NAME + "registration/get-states",
				method : "POST",
				data : "country_id="+country_id,
				type : "post",
				dataType : "json",
				beforeSend: function(){
					if(currentStateRequest != null) {
						currentStateRequest.abort();
					}
				},
				success : function(jsonData) {
					if(jsonData.length>0){
						
						// if state found :)
						var html='<label>State</label> <span><div id="win-xp8">';
						html+='<select name="dd_state" id="dd_state" class="ddCls">';
						html+='<option value="">Select</option>';
						
						for(var i=0;i<jsonData.length;i++)
						{
							
							html+='<option value="'+jsonData[i].id+'">'+jsonData[i].name+'</option>';
							
						}
						
						html+='</select>';
						html+='</div></span>';
						$(".state_list").append(html);
						$(".state_list").fadeIn('slow');
						cityList();
					}
					else{
						// if no state found :)
					}
					
				}
			});
		}
		else{
			// country has no states...
			$(".city_list").empty();
			$(".city_list").css("display","none");
				currentCityRequest = $.ajax({
					url : "/" + PROJECT_NAME + "registration/get-cities-under-country",
					method : "POST",
					data : "country_id="+country_id,
					type : "post",
					dataType : "json",
					beforeSend: function(){
						if(currentCityRequest != null) {
							currentCityRequest.abort();
						}
					},
					success : function(jsonData) {
						if(jsonData.length>0){
							// if cities found :)
							var html='<label>City</label> <span><div id="win-xp8">';
							html+='<select name="dd_city" id="dd_city" class="ddCls">';
							html+='<option value="">Select</option>';
							
							for(var i=0;i<jsonData.length;i++){
								html+='<option value="'+jsonData[i].id+'">'+jsonData[i].name+'</option>';
							}
							
							html+='</select>';
							html+='</div></span>';
							$(".city_list").append(html);
							$(".city_list").fadeIn('slow');
						}
						else{
							// if no cities found :)
						}
					}
				});			
		}
}

/**
 * function used to display city dropdown
 * @author Sunny Patial
 * @version 1.0
 */
function cityList(){
	$('#dd_state').change(function(){
		$(".city_list").empty();
		$(".city_list").css("display","none");
		if($('#dd_state').val()!=""){
			var state_id=$('#dd_state').val();
			currentCityRequest = $.ajax({
				url : "/" + PROJECT_NAME + "registration/get-cities",
				method : "POST",
				data : "state_id="+state_id,
				type : "post",
				dataType : "json",
				beforeSend: function(){
					if(currentCityRequest != null) {
						currentCityRequest.abort();
					}
				},
				success : function(jsonData) {
					if(jsonData.length>0){
						// if cities found :)
						var html='<label>City</label> <span><div id="win-xp8">';
						html+='<select name="dd_city" id="dd_city" class="ddCls">';
						html+='<option value="">Select</option>';
						
						for(var i=0;i<jsonData.length;i++){
							html+='<option value="'+jsonData[i].id+'">'+jsonData[i].name+'</option>';
						}
						
						html+='</select>';
						html+='</div></span>';
						$(".city_list").append(html);
						$(".city_list").fadeIn('slow');
					}
					else{
						// if no cities found :)
					}
					
				}
			});			
		}
		
	});
}