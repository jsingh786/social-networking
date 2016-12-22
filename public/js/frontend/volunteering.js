var validator;
$(document).ready(function(){
	// remove volunteering
	$("#remove-volunteer").click(function(){
		removeVolunteering();
	});
	
	// validate form
	validateVolunteeringForm();
	$("#datee").datepicker({
		dateFormat: 'dd-mm-yy',
		changeMonth: true,
        changeYear: true,
        yearRange: '1930:c',
        maxDate: '0',
        //showButtonPanel: true,
		
	});

	// assign datepicker to textboxes 
	
    
    // display add more Volunteering module
	$("input[name=add-more]").click(function(){
			addMoreVolunteering();
		});
	// cancel Volunteering here
	$("a#cancel").click(function(){
			cancelVolunteering();
		});
	// check whether form is valid or not then save it...
	$("input[name=save-voluninfo]").click(function(){
		if( $( "form#volun-form" ).valid() )
		{	
			saveVolunteeringinfo();
		}	
	});
	// check whether form is valid or not then save it...
	$("input[name=update-voluninfo]").click(function(){
		if( $( "form#volun-form" ).valid() )
		{	
			updateVolunteeringinfo();
		}	
	});
});

/**
 * function used for cancel the new or existing record
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function cancelVolunteering(){
	var id=$("#volunt_id").val();
	$("#volunteering"+id).fadeIn("slow");
	$("#volunteering-form").slideUp();
	$("input[name=add-more]").fadeIn("slow");
	
}
/**
 * function used for add more volunteering.
 *
 * @author spatial
 * @version 1.0
 * 
 */
function addMoreVolunteering(){
	clear_form_elements("#volun-form");
	$(".un-editable-outer").fadeIn("slow");
	$("#volunteering-form").slideDown();
	$("input[name=add-more]").hide();
	$("a#cancel").fadeIn("slow");
	$("input[name=save-voluninfo]").show();
	$("input[name=update-voluninfo]").hide();
	$("#remove-volunteer").hide();
}
/**
 * function used for validate the volunteering form
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function validateVolunteeringForm(){
	// validate form.....
	validator = $( "form#volun-form" ).validate({
		rules: {
			organization:{
				required : true,
				maxlength : 250
			},
			role:{
				required : true,
				maxlength : 250
			},
			cause:{
				required : true,
				maxlength : 250
			},
			datee:{
				required : true
			},
			desc:{
				maxlength : 250
			}
		}
	});
}
/**
 * function used for save the Volunteering info
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function saveVolunteeringinfo(){
	$("input[name=save-voluninfo]").attr("disabled","disabled");
	var iddd = addLoadingImage($("input[name=save-voluninfo]"), "before");
	$str = $("form#volun-form").serialize();
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/save-volun-info",
		method : "POST",
		data : $str,
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			
			if(jsonData.msg="success"){
				$("span#"+iddd).remove();
				$("#volunteering-form").slideUp();
				$("input[name=add-more]").fadeIn("slow");
				var html="";
				html += '<div class="un-editable-outer" id="volunteering'+jsonData[0].id+'" style="background-color:#CABEDB">';
				html += '<h3>'+jsonData[0].organization+'<a href="javascript:;" id="'+jsonData[0].id+'" onclick="editVolunteering(this)"><img  src="/'+PROJECT_NAME+'/public/images/icon-pencil.png" width="16" height="16" />';
				html += '</a></h3>';
				html += '<p>Date:'+Date.parse(jsonData[0].datee["date"]).toString("dd MMMM, yyyy")+'</p>';
				html += '<p>Role:'+jsonData[0].role+'</p>';
				html += '<p>Cause:'+jsonData[0].cause+'</p>';
				html += '<p>Description: '+jsonData[0].description+'</p>';
				html += '</div>';
				$("input[name=save-voluninfo]").removeAttr('disabled');
				$("div#volunteering-form").after(html);
				$("div#volunteering"+jsonData[0].id).animate({backgroundColor: '#fff'}, 7000);
			}			
		}
	});
}
/**
 * function used for edit the particular volunteering
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function editVolunteering(event){
	
	$("a#cancel").fadeIn("slow");
	var id=event.id;
	var iddd = addLoadingImage($(event), "after");
	var ids=$("#volun_ids").val();
	var ids_arr=ids.split(",");
	var index = ids_arr.indexOf(id);
	ids_arr.splice(index, 1);
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/edit-volunteering",
		method : "POST",
		data : "edit_id="+id,
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			
			removeFormValidationMessages( validator );
			$("span#"+iddd).remove();
			$("#volunteering"+$("#volunt_id").val()).fadeOut('slow');
			$("#volunteering"+id).hide();
			$("#remove-volunteer").show();
			$("input[name=save-voluninfo]").hide();
			$("input[name=update-voluninfo]").show();
			$("#volunt_id").val(id);
			$sqldate=jsonData[0].datee['date'];
			$sqldate=$sqldate.split(" ");
			$finaldate=$sqldate[0].split("-");
			$finaldate=$finaldate[2]+"-"+$finaldate[1]+"-"+$finaldate[0];

			$("#organization").val(jsonData[0].organization);
			$("#role").val(jsonData[0].role);
			$("#cause").val(jsonData[0].cause);
			$("#datee").val($finaldate);
			$("#desc").val(jsonData[0].description);
			$("#volunteering-form").slideDown();
        	//Smooth scrolling top.
    		$('html, body').stop().animate({
    	        scrollTop: 0
    	    }, 1000);

			// $("input[name=add-more]").hide();				
		}
	});
}
/**
 * function used for remove the particular volunteering
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function removeVolunteering(){
	var iddd = addLoadingImage($("#remove-volunteer"), "after", "loading_small_purple.gif", 0, 14);
	var id=$("#volunt_id").val();
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/remove-volunteering",
		method : "POST",
		data : "remove_id="+id,
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			$("span#"+iddd).remove();
			$("#volunteering"+id).remove();
			if(jsonData.msg==2){
				clear_form_elements("#volun-form");
				show_first_time_entry_form();
			}
			else{
				$("#volunteering-form").hide();
				$("input[name=add-more]").fadeIn("slow");
			}
		}
	});
}
/**
 * function used for update existing volunteering
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function updateVolunteeringinfo(){
	
	$("input[name=update-voluninfo]").attr("disabled","disabled");
	var iddd = addLoadingImage($("input[name=update-voluninfo]"), "before");
	$str = $("form#volun-form").serialize();
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/update-volunteering-info",
		method : "POST",
		data : $str,
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			if(jsonData.msg="success"){
				
				$("span#"+iddd).remove();
				var edu_id=jsonData[0].id;
				$("div#volunteering"+edu_id).css("background-color","#CABEDB");
				// $("div#volunteering"+edu_id).hide();
				var html="";
				html += '<h3>'+jsonData[0].organization+'<a href="javascript:;" id="'+jsonData[0].id+'" onclick="editVolunteering(this)"><img  src="/'+PROJECT_NAME+'/public/images/icon-pencil.png" width="16" height="16" />';
				html += '</a></h3>';
				html += '<p>Date:'+Date.parse(jsonData[0].datee["date"]).toString("dd MMMM, yyyy")+'</p>';
				html += '<p>Role:'+jsonData[0].role+'</p>';
				html += '<p>Cause:'+jsonData[0].cause+'</p>';
				html += '<p>Description: '+jsonData[0].description+'</p>';
				$("input[name=update-voluninfo]").removeAttr('disabled');
				$("div#volunteering"+edu_id).html(html);
				$("#volunteering-form").slideUp();
				$("input[name=add-more]").fadeIn("slow");
				$("div#volunteering"+edu_id).fadeIn('slow');
				 $("div#volunteering"+edu_id).animate({backgroundColor: '#fff'}, 7000);
			}			
		}
	});
}
function show_first_time_entry_form()
{
	$("input[name=save-voluninfo]").show();
	$("input[name=add-more]").hide();
	$("input[name=update-voluninfo]").hide();	
	$("#remove-volunteer").hide();
	$("a#cancel").hide();
}