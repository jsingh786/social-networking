function display_form(){
	$("#view-personal-info").css("display","none");
	$("#edit-personal-info").css("display","block");
}
$( document ).ready(function() {
	
	var d = new Date();
	var year = d.getFullYear() - 13;
	d.setFullYear(year);

	// assign datepicker to textboxes 
	$( "#b_day" ).datepicker({
		maxDate:0,
		changeMonth: true,
		changeYear: true,
		yearRange: '1950:' + year + '',
		defaultDate: d,
		dateFormat:"dd-mm-yy"
    });
	$("span#personalinfo").click(function() {
		editPersonalInfo();
	});
	$("input#save-personalinfo").click(function(){
		// validate form.....
		validator = $( "form#personalinfo_form" ).validate({
			rules: {
				phoneno:{
					number:true,
					//minlength: 10,
					maxlength: 16,
					require_from_group:[1, ".group-required"]
				},
				addr:{
					require_from_group:[1, ".group-required"]
				},
				addr_sec:{
					require_from_group:[1, ".group-required"]
				},

				website:{
					url:true,
					require_from_group:[1, ".group-required"]
				},
				linked:{
					url:true,
					require_from_group:[1, ".group-required"]
				},
				facebook:{
					url:true,
					require_from_group:[1, ".group-required"]
				},
				twitter:{
					url:true,
					require_from_group:[1, ".group-required"]
				},
				im:{
					require_from_group:[1, ".group-required"]
				},
				mtype:{
					require_from_group:[1, ".group-required"]
				},
				bday:{
					require_from_group:[1, ".group-required"]
				},
				martial:{
					require_from_group:[1, ".group-required"]
				},
				nationality:{
					require_from_group:[1, ".group-required"]
				}
			}
		});
		if( $( "form#personalinfo_form" ).valid() )
		{	
			savePersonalInfo();
		}	
	});
	$("#cancel").click(function() {
		// removeFormValidationMessages( validator );
		$("#edit-personal-info").hide();
		$("#view-personal-info").fadeIn("slow");
	});
	
});

function editPersonalInfo(){
	$("#cancel").fadeIn();
	var iddd = addLoadingImage($("span#personalinfo"), "before", 'loading_small_purple.gif', 30, 0, 'basic-info-loader');
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/edit-personal-info",
		method : "POST",
		data : {},
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			
			$("#view-personal-info").hide();
			$("[name=phoneno]").val(jsonData.phone);
			$("[name=addr]").val(jsonData.address);
			$("[name=addr_sec]").val(jsonData.address_second);
			$("[name=website]").val(jsonData.website_url);
			$("[name=linked]").val(jsonData.linkedin_url);
			$('[name=facebook]').val(jsonData.facebook_url);
			$('[name=twitter]').val(jsonData.twitter_url);
			$("[name=im]").val(jsonData.instant_messenger);
			if(jsonData.im_type!=""){
				$("[name=mtype]").val(jsonData.im_type);
			}
			$("[name=bday]").val(jsonData.birthday);
			if(jsonData.martial_status!=""){
				$("[name=martial]").val(jsonData.martial_status);
			}
			$("[name=nationality]").val(jsonData.nationality);
			$("span#"+iddd).remove();
			$("#edit-personal-info").fadeIn("slow");
			
		}
	});
}
function savePersonalInfo(){
	//alert('dg');
	//var numberOfControls=checkNumberOfFields("form#personalinfo_form");
	//var values=checkFormHasValues("form#personalinfo_form");
	//var values=numberOfControls-values-1;
	//if(values>0){
		$("input[name=save-personalinfo]").attr("disabled","disabled");
		var iddd = addLoadingImage($("input#save-personalinfo"), "before");
		$str = $("form#personalinfo_form").serialize();
		$.ajax({
			url : "/" + PROJECT_NAME + "profile/save-personal-info",
			method : "POST",
			data : $str,
			type : "post",
			dataType : "json",
			success : function(jsonData) {
				if(jsonData.msg="success"){
					getPersonalInfo(iddd);
					
				}			
			}
		});
	//}
	//else{
		//var html="";
		//html+="Please enter at least one field";
		//$("#erroemsg").css("color","#FF5B5B");
		//$('#erroemsg').html(html);  			
		//alert("Please enter at least one field");
	//}
}
function getPersonalInfo(iddd){
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/edit-personal-info",
		method : "POST",
		data : {},
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			$("input[name=save-personalinfo]").removeAttr('disabled');
			$("#edit-personal-info").hide();
			
			if(jsonData.phone.length != 0){
				$("#sphone").html(jsonData.phone);
			}else{
				$("#sphone").html('None');
			}
			
			if(jsonData.address.length != 0){
				$("#saddr").html(jsonData.address);
			}else{
				$("#saddr").html('None');
			}
			
			if(jsonData.address_second.length != 0){
				$("#saddr_sec").html(jsonData.address_second);
			}else{
				$("#saddr_sec").html('None');
			}

			if(jsonData.website_url.length != 0){
				$("#swebsite").html(jsonData.website_url);
			}else{
				$("#swebsite").html('None');
			}
			
			if(jsonData.linkedin_url.length != 0){
				$("#slinkedin").html(jsonData.linkedin_url);
			}else{
				$("#slinkedin").html('None');
			}
			
			if(jsonData.facebook_url.length != 0){
				$('#sfacebook').html(jsonData.facebook_url);
			}else{
				$('#sfacebook').html('None');
			}
			
			if(jsonData.facebook_url.length != 0){
				$('#sfacebook').html(jsonData.facebook_url);
			}else{
				$('#sfacebook').html('None');
			}
			if(jsonData.twitter_url.length != 0){
				$('#stwitter').html(jsonData.twitter_url);
			}else{
				$('#stwitter').html('None');
			}
			
			if(jsonData.instant_messenger.length != 0){
				$("#sim").html(jsonData.instant_messenger);
			}else{
				$("#sim").html('None');
			}
			
			var mtype="";
			/**
			 * 1 for gmail
			 * 2 for yahoo
			 * 3 for skype
			 * 4 for pidgin
			 */
			if(jsonData.im_type==1){
				 mtype="Gmail";
			}
			else if(jsonData.im_type==2){
				 mtype="Yahoo";
			}
			else if(jsonData.im_type==3){
				 mtype="Skype";
			}
			else if(jsonData.im_type==4){
				 mtype="Pidgin";
			}else{
				 mtype="None";
			}
			$("#smtype").html(mtype);
			
			if( jsonData.birthday && jsonData.birthday!="" && jsonData.birthday!="01-01-1970")
			{
				$("#sbday").html(jsonData.birthday);
			}
			else
			{
				$("#sbday").html("Not Shared");	
			}
			
			var mstatus="";
			/**
			 * 1 for married
			 * 2 for unmarried
			 */
			if(jsonData.martial_status==1){
				 mstatus="Married";
			}
			else if(jsonData.martial_status==2){
				 mstatus="Unmarried";
			}
			else if(jsonData.martial_status==0){
				 mstatus="Not Specified";
			}
			$("#smstatus").html(mstatus);
			
			if(jsonData.nationality.length != 0){
				$("#snationality").html(jsonData.nationality);
			}else{
				$("#snationality").html('None');
			}
			$("span#"+iddd).remove();
			$("#view-personal-info").fadeIn("slow");			
		}
	});
}