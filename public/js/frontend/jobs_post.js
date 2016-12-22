var currentStateRequest = null;
var currentCityRequest = null;
var submitFormOkay = false;
$(document).ready(function(){
	$('#preview').click(function(){
		var allowedtags = "p,b,br,strong,em,span,ol,ul,div,span"; // for more tags use the multiple selector, e.g. "p, img"
		
		var postedBy = $("#postedBy").val();
		if(postedBy==""){
			postedBy = "---";
		}
		$("#previewPostedBy").html(postedBy);
		
		var jobDesc = nl2br(CKEDITOR.instances.jobDesc.getData());
		if(jobDesc==""){
			jobDesc = "---";
		}
		$("#previewJobDesc").html(jobDesc);
		
		var responsibilities = nl2br(CKEDITOR.instances.responsibilities.getData());
		if(responsibilities==""){
			responsibilities = "---";
		}
		$("#previewResponsibilities").html(responsibilities);
		
		var skills = nl2br(CKEDITOR.instances.skills.getData());
		if(skills==""){
			skills = "---";
		}
		$("#previewSkills").html(skills);
		
		var companyDesc = nl2br(CKEDITOR.instances.companyDesc.getData());
		if(companyDesc==""){
			companyDesc = "---";
		}
		$("#previewCompanyDesc").html(companyDesc);
		
		var dd_exp_lvl = $("#dd_exp_lvl option:selected").text();
		if(dd_exp_lvl=="Select"){
			dd_exp_lvl = "---";
		}
		$("#previewExperience").html(dd_exp_lvl);
		
		var dd_industry = $("#dd_industry option:selected").text();
		if(dd_industry=="Select"){
			dd_industry = "---";
		}
		$("#previewIndustry").html(dd_industry);
		
		var dd_job_type = $("#dd_job_type option:selected").text();
		if(dd_job_type=="Select"){
			dd_job_type = "---";
		}
		$("#previewJobType").html(dd_job_type);
		
		var title = $("#jobTitle").val();
		
		if(title!=""){
			if(title.length>50){
				title = title.substr(0, 50)+"...";
			}
		}
		else{
			title = "---";
		}
		$("#previewJobTitle").html(title);
		
		var url = $("#urlFields").val();
		if(url!="" && url!="http://www")
		{
			if(url.length>50)
			{
				url = url.substr(0, 50)+"...";
			}
			$("#previewUrlFields").html(url);
		}
		else
		{
			$('p.p_previewUrlFields').html('<a class="empty_url text-purple-link"style="text-decoration:none !important;cursor:default !important;">---</a>');
		}
		
		
		var company = $("#company").val();
		if(company!="")
		{
			company = showCroppedText(company, 60);
		}
		else
		{
			company = "---";
		}
		$("#previewCompany").html(company);
		var dd_state = $("#dd_state option:selected").text();
		if(dd_state!="Select" && dd_state!=""){
			dd_state = $("#dd_state option:selected").text()+", ";
		}
		else{
			dd_state = "";
		}
		var dd_city = $("#dd_city option:selected").text();
		if(dd_city!="Select" && dd_city!=""){
			dd_city = $("#dd_city option:selected").text()+", ";
		}
		else{
			dd_city = "";
		}
		var cntry = $("#dd_location option:selected").text();
		if(cntry=="Select" || cntry==""){
			cntry = "";
		}
		$("#previewCntry").html(dd_city+dd_state+cntry);
		$("#previewCntry *").not(allowedtags).each(function() {
		    var content = $(this).contents();
		    $(this).replaceWith(content);
		});
		$("#jobPreview").bPopup();
	});
	$('#close_prev').click(function(){
		$("#jobPreview").bPopup().close();;
	});
	$("input[name=applyfrm]:radio").change(function () {
		if($('input[name=applyfrm]:checked', '#createJob').val()==1){
			$("#cWebUrl").css("display","block");
		}
		else{
			$("#cWebUrl").css("display","none");
		}
	});
	
	//If any input has been changed, then alert will appear on leaving the page.
	$("form#createJob :input").change(function() {
		window.onbeforeunload = function(e){
			if (!submitFormOkay) {
				return "On leaving the page your form will be reset.";
			}
		};
	});
	

	autoComplete( "input[name=company]", "/" + PROJECT_NAME + "profile/get-all-companies" );
	$('#dd_location').change(function()
	{
		empty_dd();
		if($('#dd_location').val()!="")
		{
			stateList();
			//salaryList(); // Hide as client said to temp remove.
		}
	});
	
	 $( "#expireDate" ).datepicker({
		 dateFormat:"dd-mm-yy",
		 minDate: 1
	});
	 
	 
	//Validations----------------
		validator = $( "form#createJob" ).validate({
			rules: {
				dd_location:{
					required : true
				},
				dd_state:{
					required : true
				},
				dd_city:{
					required : true
				},
				company:{
					
					required : true,
					alphanumericWithHyphensAndSpacesOnly : true,
					maxlength: 100
				},
				dd_industry:
				{
					required : true
				},
				dd_exp_lvl:
				{
					required : true
				},
				dd_job_type:
				{
					required : true
				},
				jobTitle:
				{
					required : true
				},
				skills:
				{
					minlength: 3,
					maxlength: 2000
				},
				companyDesc:
				{
					minlength: 3,
					maxlength: 2000
				},
				postedBy:
				{
					minlength: 3,
					maxlength: 30,
					required : true
				},
				webJobUrl:
				{
					required : true,
					url : true
				},
				jobDesc:
				{
					minlength: 3,
					maxlength: 1024,
					required : true
					
				}
			}
		});
		//End validations------------
		
		$(".hasDatepicker").next("label").css("float","right");
		$(".hasDatepicker").next("label").css("margin-right","75px"); 
	
		/*$('#post').click(function(){
			if($("#createJob").valid()==true){
				$('#post').attr("disable","disable");
				addLoadingImage( $("#post"), 'before', 'loading_small_purple.gif', 0, 16 );
			}	
		});*/
		
});

function addLeavePopupOnTheBasisOfFormValidate(){
	if($("#createJob").valid()){
		submitFormOkay = true;
	}
	else{
		submitFormOkay = false;
	}
}
function confirmExit()
{
	return "Do you want to cancel this job posting?";
}
/**
 * function used, empty and hide dropdowns.
 * @author Sunny Patial
 * @version 1.0
 */
function empty_dd(){
	$(".state_list").empty();
	$(".state_list").css("display","none");
	$(".city_list").empty();
	$(".city_list").css("display","none");
	$(".salary_list").empty();
	$(".salary_list").css("display","none");
}
/**
 * function used to display state dropdown
 * @author Sunny Patial
 * @version 1.0
 */
function stateList(){

		var countryHasStates=$('#dd_location').val();
		var countryArr=countryHasStates.split(",");
		var country_id=countryArr[0];
		if(countryArr[1]==1){
			// country has states...
			currentStateRequest = $.ajax({
				url : "/" + PROJECT_NAME + "job/get-states",
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
					url : "/" + PROJECT_NAME + "job/get-cities-under-country",
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
				url : "/" + PROJECT_NAME + "job/get-cities",
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
/**
 * function used to display salary dropdown
 * @author Sunny Patial
 * @version 1.0
 */
function salaryList(){
	var countryHasStates=$('#dd_location').val();
	var countryArr=countryHasStates.split(",");
	var country_id=countryArr[0];
	$(".salary_list").empty();
	$.ajax({
		url : "/" + PROJECT_NAME + "job/get-salary-ranges-by-country",
		method : "POST",
		data : "country_id="+country_id,
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			
			if(jsonData.length>0){
				// salary range found!
				var html='<label>Salary</label> <span><div id="win-xp8">';
				html+='<select name="dd_salary" id="dd_salary" class="ddCls">';
				html+='<option value="">Select</option>';
				
				for( i in jsonData )
				{
					html += '<option value = "'+jsonData[i]['id']+'">'+jsonData[i]['Currency_sym']+' '+jsonData[i]['min_salary']+' - '+jsonData[i]['max_salary']+'</option>';
				} 
				
				html+='</select>';
				html+='</div></span>';
				$(".salary_list").append(html);
				$(".salary_list").fadeIn('slow');
			}
			else{
				// salary range not found
			}			
		}
	});
}