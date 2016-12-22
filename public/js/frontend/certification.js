var validator;
$(document).ready(function(){
	// remove certification
	$("#remove-certification").click(function(){
		removeCertification();
	});
	
	// validate form
	validateCertificationForm();
	
	linkDatePickers();
	
    // display add more certification module
	$("input[name=add-more]").click(function(){
			addMoreCertification();
		});
	// cancel certification here
	$("a#cancel-certification").click(function(){
			cancelCertification();
		});
	// check whether form is valid or not then save it...
	$("input[name=save-certiinfo]").click(function(){
		if( $( "form#certi-form" ).valid() )
		{	
			saveCertificationinfo();
		}	
	});
	// check whether form is valid or not then save it...
	$("input[name=update-certiinfo]").click(function(){
		if( $( "form#certi-form" ).valid() )
		{	
			updateCertificationinfo();
		}	
	});
	$('input#expired').click(function(){
		$('label#expiry_date_label').fadeToggle();
		$('span#expiry_date_span').fadeToggle();
		linkDatePickers();
	});
	
});

/**
 * function used for cancel the new or existing record
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function cancelCertification(){
	var id=$("#certi_id").val();
	$("#certification"+id).fadeIn("slow");
	$("#certification-form").slideUp();
	$("input[name=add-more]").fadeIn("slow");
	
}
/**
 * function used for add more certification
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function addMoreCertification(){
	clear_form_elements("#certi-form");
	//$(".un-editable-outer").fadeIn('slow');
	$("#certification-form").slideDown();
	$("input[name=add-more]").hide();
	$("input[name=save-certiinfo]").show();
	$("a#cancel-certification").fadeIn("slow");
	
	$("input[name=update-certiinfo]").hide();
	$("#remove-certification").hide();
	
	$('input#expired').prop('checked', true);
	$('span#expiry_date_span').css('display','none');
	$('label#expiry_date_label').css('display','none');
	
}
/**
 * function used for validate the certification form
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function validateCertificationForm(){
	// validate form.....
	validator = $( "form#certi-form" ).validate({
		rules: {
			certification_name:{
				required : true
			},
			authority:{
				required : true
			},
			lincense_number:{
				required : true
			},
			from:{
				required : true
			},
			expiry_date: {
				required : true
			}
		}
	});
}
/**
 * function used for save the certification info
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function saveCertificationinfo(){
	$("input[name=save-certiinfo]").attr("disabled","disabled");
	var iddd = addLoadingImage($("input[name=save-certiinfo]"), "before",'loading_small_purple.gif', 0, 20 );
	$str = $("form#certi-form").serialize();
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/save-certification-info",
		method : "POST",
		data : $str,
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			console.log(jsonData.cert_data["expired"]);
			$("span#"+iddd).remove();
			$("#certification-form").slideUp();
			$("input[name=add-more]").fadeIn("slow");
			var html="";
			html += '<div class="un-editable-outer" id="certification'+jsonData.cert_id+'">';
			html += '<h3>'+jsonData.cert_data["certification_name"]+'<a id="'+jsonData.cert_id+'" href="javascript:;" onclick="editCertification(this)"><img  src="/'+PROJECT_NAME+'/public/images/icon-pencil.png" width="16" height="16" />';
			html += '</a></h3>';
			html += '<p>'+jsonData.cert_data["authority"]+'</p>';
			html += '<p>'+jsonData.cert_data["lincense_number"]+'</p>';
			html += '<p>'+Date.parse(jsonData.cert_data["from"]).toString("d MMMM, yyyy")+'</p>';
			// If checkbox was unchecked and expiry date input has some value.
			if(jsonData.cert_data["expired"] != 1 && jsonData.cert_data["expiry_date"] )
			{
				html += '<p>'+Date.parse(jsonData.cert_data["expiry_date"]).toString("d MMMM, yyyy")+'</p>';
			}
			html += '</div>';
			$("input[name=save-certiinfo]").removeAttr('disabled');
			$("div#certification-form").after(html);
			$("div#certification"+jsonData.cert_id).animate({backgroundColor: '#fff'}, 7000);
		}
	});
}
/**
 * function used for get Certification listing
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function getCertificationInfoListing(id){
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/get-certification-listing",
		method : "POST",
		data : "",
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			console.log(jsonData[0].is_expired);
			$("span#"+id).remove();
			$("#certification-form").slideUp();
			$("input[name=add-more]").fadeIn("slow");
			var html="";
			html += '<div class="un-editable-outer" id="certification'+jsonData[0].id+'">';
			html += '<h3>'+jsonData[0].certification_name+'<a id="'+jsonData[0].id+'" href="javascript:;" onclick="editCertification(this)"><img  src="/'+PROJECT_NAME+'/public/images/icon-pencil.png" width="16" height="16" />';
			html += '</a></h3>';
			html += '<p>'+jsonData[0].autority+'</p>';
			html += '<p>'+jsonData[0].license_number+'</p>';
			html += '<p>'+Date.parse(jsonData[0].certification_date['date']).toString("d MMMM, yyyy")+'</p>';
			// If certification does expire and has some expiry date.
			if(jsonData[0].expiry_date && jsonData[0].is_expired)
			{
				html += '<p>'+Date.parse(jsonData[0].expiry_date['date']).toString("d MMMM, yyyy")+'</p>';
			}
			html += '</div>';
			$("input[name=save-certiinfo]").removeAttr('disabled');
			$("div#certification-form").after(html);
			$("div#certification"+jsonData[0].certi_id).animate({backgroundColor: '#fff'}, 7000);
		}
	});
}
/**
 * function used for edit the particular certification
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function editCertification(event){
	$("a#cancel-certification").fadeIn("slow");
	$("label#expiry_date_label").css("display","none");
	$("span#expiry_date_span").css("display","none");
	$("input#expiry_date").val('');
	
	var id=event.id;
	var iddd = addLoadingImage($(event), "after");
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/edit-certification",
		method : "POST",
		data : "edit_id="+id,
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			removeFormValidationMessages( validator );
			$("span#"+iddd).remove();
			$("#certification"+$("#certi_id").val()).show();
			//$("#certification"+$("#certi_id").val()).fadeOut('slow');
			//$("div.un-editable-outer").fadeIn();
			$("#remove-certification").show();
			$("input[name=save-certiinfo]").hide();
			$("input[name=update-certiinfo]").show();
			$("#certi_id").val(id);
			$sqldate=jsonData[0].certification_date['date'];
			$sqldate1=$sqldate.split(" ");
			$finaldate1=$sqldate1[0].split("-");
			$finaldate2=$finaldate1[2]+"-"+$finaldate1[1]+"-"+$finaldate1[0];
			$("#from").val($finaldate2);
			// If certification has expiry date.
			if( jsonData[0].expiry_date)
			{
				$expiry_date1=jsonData[0].expiry_date['date'];
				$expiry_date2=$expiry_date1.split(" ");
				$finalexpiry_date1=$expiry_date2[0].split("-");
				$finalexpiry_date2=$finalexpiry_date1[2]+"-"+$finalexpiry_date1[1]+"-"+$finalexpiry_date1[0];
				$("label#expiry_date_label").fadeIn();
				$("span#expiry_date_span").fadeIn();
				$("#expiry_date").val($finalexpiry_date2);
			}
			// If checkbox was remained unchecked but expiry date was not filled.
			if( jsonData[0].is_expired && !(jsonData[0].expiry_date))
			{
				$("label#expiry_date_label").fadeIn();
				$("span#expiry_date_span").fadeIn();
				$("input#expiry_date").val('');
			}
			if(!jsonData[0].is_expired)
			{
				$("label#expiry_date_label").css('display','none');
				$("span#expiry_date_span").css('display','none');
		
			}
			$("#certification_name").val(jsonData[0].certification_name);
			$("#authority").val(jsonData[0].autority);
			$("#lincense_number").val(jsonData[0].license_number);
			if(jsonData[0].is_expired)
			{
				$('input#expired').prop('checked', false);
			}
			else
			{
				$('input#expired').prop('checked', 'checked');
			}
			$("#certification-form").slideDown();
			$("#certification"+id).hide();
		}
	});
}
/**
 * function used for remove the particular certification
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function removeCertification(){
	var iddd = addLoadingImage($("#remove-certification"), "after", "loading_small_purple.gif", 0, 14);
	var id=$("#certi_id").val();
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/remove-certification",
		method : "POST",
		data : "remove_id="+id,
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			$("span#"+iddd).remove();
			$("#certification"+id).remove();
			if(jsonData.msg==2){
				clear_form_elements("#certi-form");
				show_first_time_entry_form();
			}
			else{
				$("#certification-form").hide();
				$("input[name=add-more]").fadeIn("slow");
			}
		}
	});
}
/**
 * function used for update existing certification
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function updateCertificationinfo(){
	$("input[name=update-certiinfo]").attr("disabled","disabled");
	var iddd = addLoadingImage($("input[name=update-certiinfo]"), "before", 'loading_small_purple.gif', 0, 20 );
	$str = $("form#certi-form").serialize();
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/update-certification-info",
		method : "POST",
		data : $str,
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			if(jsonData.msg="success"){
				$("span#"+iddd).remove();
				var certi_id=jsonData[0].id;
				$("div#certification"+certi_id).css("background-color","#CABEDB");
				$("div#certification"+certi_id).hide();
				var html="";
				html += '<h3>'+jsonData[0].certification_name+'<a id="'+jsonData[0].id+'" href="javascript:;" onclick="editCertification(this)"><img  src="/'+PROJECT_NAME+'/public/images/icon-pencil.png" width="16" height="16" />';
				html += '</a></h3>';
				html += '<p>'+jsonData[0].autority+'</p>';
				html += '<p>'+jsonData[0].license_number+'</p>';
				html += '<p>'+Date.parse(jsonData[0].certification_date['date']).toString("d MMMM, yyyy")+'</p>';
				// check box was unchecked and there is some expiring dat of certification.
				if(jsonData[0].is_expired && jsonData[0].expiry_date )
				{
					html += '<p>'+Date.parse(jsonData[0].expiry_date['date']).toString("d MMMM, yyyy")+'</p>';
				}
				$("input[name=update-certiinfo]").removeAttr('disabled');
				$("div#certification"+certi_id).html(html);
				$("#certification-form").slideUp();
				$("input[name=add-more]").fadeIn("slow");
				$("div#certification"+certi_id).fadeIn('slow');
				$("div#certification"+certi_id).animate({backgroundColor: '#fff'}, 7000);
			}			
		}
	});
}
function show_first_time_entry_form()
{
	$("input[name=save-certiinfo]").show();
	$("input[name=add-more]").hide();
	$("input[name=update-certiinfo]").hide();	
	$("#remove-certification").hide();
	$("a#cancel-certification").hide();
}

function linkDatePickers()
{
	$("#from").datepicker("destroy");
	$("#expiry_date").datepicker("destroy");
	
	// assign datepicker to textboxes 
	$("#from").datepicker({
		dateFormat: 'dd-mm-yy',
		changeMonth: true,
        changeYear: true,
        yearRange: '1930:c',
        maxDate: '0',
		onSelect: function( selectedDate ) {
			$("input[name=expiry_date]").datepicker( "option", "minDate", selectedDate );
			$(this).trigger("focus").trigger("blur");//to manage validations
		}
		
	});
	// assign datepicker to expiry_date textbox
	$("#expiry_date").datepicker({
		dateFormat: 'dd-mm-yy',
		changeMonth: true,
        changeYear: true,
        yearRange: '1930:c',
        minDate: '0',
        onSelect: function( selectedDate ) {
			$("input[name=from]").datepicker( "option", "maxDate", selectedDate );
			$(this).trigger("focus").trigger("blur");//to manage validations
        }
	});
}