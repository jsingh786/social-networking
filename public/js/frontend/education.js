var validator;
$(document).ready(function(){
	// remove education
	$("#remove-educ").click(function(){
		removeEducation();
	});
	

	//Alert box for prompting user that only one education is left.
	$( "div#dialog_education" ).dialog({
	      modal: true,
	      autoOpen: false,
	      draggable:false,
	      width: 335,
	      show: {
	    	  effect: "fade"
	    	  },
		  hide: {
			  effect: "fade"
			  },
	      buttons: {
	    		 OK: function() {
	 	    		$( this ).dialog( "close" );
	 	    		},
	    }
	});
	
	bindDatePickers();
	
	// validate form
	validateEducationForm();
	
	// Auto search for school, degree and field of study.
	schoolRecords();
	degreeRecords();
	fieldOfStudyRecords();
	
	// assign datepicker to textboxes 
//	$( "#from" ).datepicker({
//		dateFormat:"dd-mm-yy",
//	    onClose: function( selectedDate ) {
//	    	$( "#to" ).datepicker( "option", "minDate", selectedDate );
//	    }
//    });
//    $( "#to" ).datepicker({
//		dateFormat:"dd-mm-yy",
//		onClose: function( selectedDate ) {
//			$( "#from" ).datepicker( "option", "maxDate", selectedDate );
//		}
//    });	
    
    // display add more education module
	$("input[name=add-more]").click(function(){
			addMoreEducation();
		});
	// cancel education here
	$("a#cancel-education").click(function(){
			cancelEducation();
		});
	// check whether form is valid or not then save it...
	$("input[name=save-eduinfo]").click(function(){
		if( $( "form#edu-form" ).valid() )
		{	
			saveEducationinfo();
		}	
	});
	// check whether form is valid or not then save it...
	$("input[name=update-eduinfo]").click(function(){
		if( $( "form#edu-form" ).valid() )
		{	
			updateEducationinfo();
		}	
	});
});
/**
 * function used for get school records from the school_ref table
 * to setdata.
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function schoolRecords(){
		var cache = {};
	    $( "#school_name" ).autocomplete({
	      minLength: 2,
	      source: function( request, response ) {
	    	$("input[name=school_id]").val("");
	  		var term = request.term;
	        if ( term in cache ) {
	          response( cache[ term ] );
	          return;
	        }
	 
	        $.getJSON( "/" + PROJECT_NAME + "profile/get-schools-list", request, function( data, status, xhr ) {
	          cache[ term ] = data;
	          response( data );
	        });
	      }, 
	      select: function(evt, ui){
	      	$("#school_id").val(ui.item.id);
	       }	   
	});		
}
/**
 * function used for get degree records from the degree_ref table
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function degreeRecords(){
	var cache = {};
    $( "#degree" ).autocomplete({
      minLength: 2,
      source: function( request, response ) {
    	$("input[name=degree_id]").val("");
        var term = request.term;
        if ( term in cache ) {
          response( cache[ term ] );
          return;
        }
 
        $.getJSON( "/" + PROJECT_NAME + "profile/get-degree-list", request, function( data, status, xhr ) {
          cache[ term ] = data;
          response( data );
        });
      }	, 
      select: function(evt, ui){
      	$("#degree_id").val(ui.item.id);
       }
});		
}
/**
 * function used for get field of study records from the field_of_study_ref table
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function fieldOfStudyRecords(){
	var cache = {};
    $( "#study_field" ).autocomplete({
      minLength: 2,
      source: function( request, response ) {
    	$("input[name=field_stud_id]").val(""); 
        var term = request.term;
        if ( term in cache ) {
          response( cache[ term ] );
          return;
        }
 
        $.getJSON( "/" + PROJECT_NAME + "profile/get-field-of-study-list", request, function( data, status, xhr ) {
          cache[ term ] = data;
          response( data );
        });
      }	, 
     select: function(evt, ui){
    	$("#field_stud_id").val(ui.item.id);
     }
});		
}
/**
 * function used for cancel the new or existing record
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function cancelEducation(){
	var id=$("#educ_id").val();
	$("#education"+id).fadeIn();
	$("#education-form").slideUp();
	$("input[name=add-more]").fadeIn("slow");
	
}
/**
 * function used for add more education
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function addMoreEducation(){
	clear_form_elements("#edu-form");
	$(".un-editable-outer").show();
	$("#education-form").slideDown();
	$("input[name=add-more]").hide();
	$("input[name=save-eduinfo]").show();
	$("a#cancel-education").fadeIn("slow");
	
	$("input[name=update-eduinfo]").hide();
	$("#remove-educ").hide();
}
/**
 * function used for validate the education form
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function validateEducationForm(){
	// validate form.....
	validator = $( "form#edu-form" ).validate({
		rules: {
			school_name:{
				required : true,
				minlength: 2,
				maxlength: 50
			},
			/*degree:{
				required : true
			},
			study_field:{
				required : true
			},*/
			from:{
				required : true
			},
			to:{
				required : true
			},
			grade:{
				required : false,
				maxlength: 3
			},
			degree_name:{
				required : true,
				maxlength :250
			},
			degree:{
				required : true,
				maxlength : 255
				
			},
			study_field:
			{
				required : true,
				maxlength : 50
			},
			activities:
			{
				maxlength :1500,
//				noHTML: true
			},
			institute_location:
			{
				required : true
			},
			additional_notes:{
				maxlength :1500,
//				noHTML: true
			}
		}
	});
}
/**
 * function used for save the education info
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function saveEducationinfo(){
	$("input[name=save-eduinfo]").attr("disabled","disabled");
	var iddd = addLoadingImage($("input[name=save-eduinfo]"), "before");
	$str = $("form#edu-form").serialize();
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/save-edu-info",
		method : "POST",
		data : $str,
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			if(jsonData.msg=="success"){
				getEducationInfoListing(iddd);
	    		destroyDatePickers();
	    		bindDatePickers();
			}
		
			else{
				$("span#"+iddd).remove();
				$("#education-form").slideUp();
				$("input[name=add-more]").fadeIn("slow");
				$("input[name=save-eduinfo]").removeAttr('disabled');
	    		destroyDatePickers();
	    		bindDatePickers();
			}
		}
	});
}
/**
 * function used for get education listing
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function getEducationInfoListing(id){
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/get-education-listing",
		method : "POST",
		data : "",
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			$("span#"+id).remove();
			$("#education-form").slideUp();
			$("input[name=add-more]").fadeIn("slow");
			var html="";
			html += '<div class="un-editable-outer" id="education'+jsonData[0].educ_id+'" style="background-color:#CABEDB">';
			html += '<h3 >'+jsonData[0].school_title+'<a href="javascript:;" id="'+jsonData[0].educ_id+'" onclick="editEducation(this)"><img class="edit-new-icon"  src="'+PUBLIC_PATH+'/images/edit-pencil.png" />';
			html += '</a></h3>';
			if(jsonData[0].location)
			{
				html += '<p class="exp_company" >'+jsonData[0].location+'</p>';
			}	
			if(jsonData[0].degreetitle != "" &&  jsonData[0].fieldofstudy_title !=""){
				html += '<p >'+jsonData[0].degreetitle+' ('+jsonData[0].fieldofstudy_title+')</p>';
			}
			else if(jsonData[0].degreetitle == "" && jsonData[0].fieldofstudy_title !=""){
				html += '<p >('+jsonData[0].fieldofstudy_title+')</p>';
			}else if(jsonData[0].fieldofstudy_title =="" && jsonData[0].degreetitle !=""){
				html += '<p >'+jsonData[0].degreetitle+'</p>';
			}
			else if(jsonData[0].degreetitle == "" &&  jsonData[0].fieldofstudy_title ==""){
				html += '<p >None</p>';
			}
			html += '<p class="fnt12" >'+jsonData[0].degree_name+'</p>';
			html += '<p class="fnt12 exp_dates">'+Date.parse(jsonData[0].duration_from).toString("MMMM, yyyy")+' - '+Date.parse(jsonData[0].duration_to).toString("MMMM, yyyy")+'</p>';
			html += '<p class="fnt12">Grade-'+jsonData[0].grade+'</p>';
			html += '<p class="fnt12">Activities:'+jsonData[0].acitivities+'</p>';
			html += '<p class="fnt12 exp_notes">Notes: '+jsonData[0].notes+'</p>';
			html += '</div>';
			$("input[name=save-eduinfo]").removeAttr('disabled');
			$("div#education-form").after(html);
			$("div#education"+jsonData[0].educ_id).animate({backgroundColor: '#fff'}, 1000);
        	
		}
	});
}
/**
 * function used for edit the particular education
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function editEducation(event){
	$("a#cancel-education").fadeIn("slow");
	var id=event.id;
	var iddd = addLoadingImage($(event), "after", 'loading_small_purple.gif', 0, 14, 'fr');
	var ids=$("#edu_ids").val();
	var ids_arr=ids.split(",");
	var index = ids_arr.indexOf(id);
	ids_arr.splice(index, 1);
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/edit-education",
		method : "POST",
		data : "edit_id="+id,
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			removeFormValidationMessages( validator );
			$("span#"+iddd).remove();
			$("#education"+$("#educ_id").val()).fadeIn();
			$("#education"+id).hide();
			$("#remove-educ").show();
			$("input[name=save-eduinfo]").hide();
			$("input[name=update-eduinfo]").show();
			$("#educ_id").val(id);
			
			$("#school_id").val(jsonData[0].school_id);
			$("select[name=degree]").val(jsonData[0].id);
			$("#field_stud_id").val(jsonData[0].fieldofstudy_id);
			
			$("#school_name").val(jsonData[0].school_title);
			if(jsonData[0].location)
			{
				$("input#institute_location").val(jsonData[0].location);
			}
			$("select[name=degree]").val(jsonData[0].degreetitle);
			$("input[name=degree_name]").val(jsonData[0].degree_name);
			$("#study_field").val(jsonData[0].fieldofstudy_title);
			$("#from").val(jsonData[0].duration_from);
			$("#to").val(jsonData[0].duration_to);
			$("#grade").val(jsonData[0].grade);
			$("#activities").val(jsonData[0].acitivities);
			$("#additional_notes").val(jsonData[0].notes);
			$("#education-form").slideDown();
    		destroyDatePickers();
    		bindDatePickers();
			// $("input[name=add-more]").hide();		
        	//Smooth scrolling top.
    		$('html, body').stop().animate({
    	        scrollTop: 0
    	    }, 1000);

		}
	});
}



/**
 * function used for remove the particular education
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function removeEducation(){
	var iddd = addLoadingImage($("#remove-educ"), "after", "loading_small_purple.gif", 0, 14);
	var id=$("#educ_id").val();
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/remove-education",
		method : "POST",
		data : "remove_id="+id,
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			$("span#"+iddd).remove();
			$("#education"+id).remove();
			
			if(jsonData.msg==2){
				clear_form_elements("#edu-form");
				show_first_time_entry_form();
			}
			else if(jsonData.msg==3)
				{
				deleteWhenOneEduLeft();
				}
			else{
				$("#education-form").hide();
				$("input[name=add-more]").fadeIn("slow");
			}
			
		}
	});
}

/**
 * function used for prompting user that only one education is left.
 *
 * @author sjaiswal
 * @version 1.0
 * 
 */

function deleteWhenOneEduLeft()
{
	$("#dialog_education").dialog("open");
}

/**
 * function used for update existing education
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function updateEducationinfo(){
	$("input[name=update-eduinfo]").attr("disabled","disabled");
	var idd = addLoadingImage($("input[name=update-eduinfo]"), 'before');
	//var iddd = addLoadingImage($("input[name=update-eduinfo]"), "before");
	$str = $("form#edu-form").serialize();
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/update-edu-info",
		method : "POST",
		data : $str,
		type : "post",
		dataType : "json",
		success : function(jsonData) {
		
			if(jsonData.msg="success"){
				
				$("span#"+idd).remove();
				var edu_id=jsonData[0].educ_id;
				$("div#education"+edu_id).css("background-color","#CABEDB");
				$("div#education"+edu_id).hide();
				var dur_frm=jsonData[0].duration_from.split("-");
				dur_frm=dur_frm[1]+"-"+dur_frm[2];
				var dur_to=jsonData[0].duration_to.split("-");
				dur_to=dur_to[1]+"-"+dur_to[2];
				var html="";
				html += '<h3 >'+jsonData[0].school_title+'<a href="javascript:;" id="'+jsonData[0].educ_id+'" onclick="editEducation(this)"><img class="edit-new-icon"  src="/'+PROJECT_NAME+'/public/images/edit-pencil.png"  />';
				html += '</a></h3>';
				if(jsonData[0].location)
				{
					html += '<p class="exp_company">'+jsonData[0].location+'</p>';
				}
				if(jsonData[0].degreetitle != "" &&  jsonData[0].fieldofstudy_title !=""){
					html += '<p >'+jsonData[0].degreetitle+' ('+jsonData[0].fieldofstudy_title+')</p>';
				}
				else if(jsonData[0].degreetitle == "" && jsonData[0].fieldofstudy_title !=""){
					html += '<p >('+jsonData[0].fieldofstudy_title+')</p>';
				}else if(jsonData[0].fieldofstudy_title =="" && jsonData[0].degreetitle !=""){
					html += '<p >'+jsonData[0].degreetitle+'</p>';
				}
				else if(jsonData[0].degreetitle == "" &&  jsonData[0].fieldofstudy_title ==""){
					html += '<p >None</p>';
				}

				
				html += '<p class="fnt12" >'+jsonData[0].degree_name+'</p>';
				html += '<p class="fnt12 exp_dates">'+Date.parse(dur_frm).toString("MMMM, yyyy")+' - '+Date.parse(dur_to).toString("MMMM, yyyy")+'</p>';
				html += '<p class="fnt12">Grade-'+jsonData[0].grade+'</p>';
				html += '<p class="fnt12">Activities:'+jsonData[0].acitivities+'</p>';
				html += '<p class="fnt12 exp_notes">Notes: '+jsonData[0].notes+'</p>';
				$("input[name=update-eduinfo]").removeAttr('disabled');
				$("div#education"+edu_id).html(html);
				$("#education-form").slideUp();
				$("input[name=add-more]").fadeIn("slow");
				$("div#education"+edu_id).fadeIn('slow');
				$("div#education"+edu_id).animate({backgroundColor: '#fff'}, 1000);
			}			
		}
	});
}
function show_first_time_entry_form()
{
	$("input[name=save-eduinfo]").show();
	$("input[name=add-more]").hide();
	$("input[name=update-eduinfo]").hide();	
	$("#remove-educ").hide();
	$("a#cancel-education").hide();
}

function bindDatePickers()
{
	//Applying datepicker-------------
	$("input[name=from]").datepicker({
		dateFormat: 'dd-mm-yy',
		changeMonth: true,
        changeYear: true,
        yearRange: '1930:c',
        maxDate: '0',
        //showButtonPanel: true,
		onSelect: function( selectedDate ) {
			$("input[name=to]").datepicker( "option", "minDate", selectedDate );
			$(this).trigger("focus").trigger("blur");//to manage validations
		}
	});
	$("input[name=to]").datepicker({
		dateFormat: 'dd-mm-yy',
		changeMonth: true,
        changeYear: true,
        yearRange: '1930:c',
        maxDate: '0',
        //showButtonPanel: true,
		onSelect: function( selectedDate ) {
			$("input[name=from]").datepicker( "option", "maxDate", selectedDate );
			$(this).trigger("focus").trigger("blur");//to manage validations
		}
	});
	//End applying datepicker--------	
}
function destroyDatePickers()
{
	$("input[name=from]").datepicker( "destroy" );
	$("input[name=to]").datepicker( "destroy" );	
}