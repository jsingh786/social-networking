$(document).ready(function(){
	//End validations------------
	bindDatePickers();
	
	//Close education bpopup on click of cross icon.
	$("img.closs-edu-bpopup").click(function()
	{
		$('div#add_education_popup').bPopup().close();
	});
	
	//Close experience bpopup on click of cross icon.
   	$("img.close_popup_3").click(function(){
		$('div#add_experience_popup').bPopup().close();
	});
   	
   	//Toggling setting divisions.   
   	$("div.innner_gen_settings").click(function(){
   		$('div.setting_forms').slideUp();
   		var thiss = $(this);
   		
   		if( ! $(this).next("div.setting_forms").is(":visible") )
		{
	   		$(this).next("div.setting_forms").slideDown(function(){
	   			$("a.edit_icon_pencile").fadeIn();
	   			thiss.children("a.edit_icon_pencile").fadeOut();
	   		});
		}
   		else
   		{
   			$("a.edit_icon_pencile").fadeIn();
   		}
   	});
});

/**
 * Validates education form
 * @author hkaur5
 */
function validateEducationForm()
{
	// Education form validations.
	validator = $( "form#edu-form" ).validate({
		rules: {
			school_name:{
				required : true,
				minlength: 2,
				maxlength: 50
			},
			from:{
				required : true
			},
			to:{
				required : true
			},
			grade:{
				required : true,
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
				maxlength :255,
			},
			institute_location:
			{
				required : true
			},
			additional_notes:{
				maxlength :250,
			}
		}
	});
}

/**
 * Validates experience form
 * @author hkaur5
 */
function validateExperienceForm()
{
	//Validations----------------
	validator = $( "form#exp" ).validate({
		rules: {
			company:{
				required : true,
				alphanumericWithHyphensAndSpacesOnly:true,
				maxlength: 100
			},
			title:{
				required : true
			},
			location:{
				required : true
			},
			from_date:{
				required : true
			},
			to_date:{
				required : true
			},
			additional_notes:
			{
				maxlength : 250
			},
		}
	});
} 

function validateChangePswd()
{
	$("form#formChgPassword").validate({
        rules: {
            new_pswd: { 
              required: true,
              minlength: 8,
              maxlength: 20,
              ilook_password:true
            }, 
            cnfrm_pswd: { 
				equalTo: "#new_pswd",
				ilook_password:true,
				minlength: 8,
				maxlength: 20,
				required: true
            },
            
            current_pswd: {
	        	required: true,
	        	minlength: 8,
				maxlength: 20
            }
        },
	  messages:
	  {
	      password: 
	      { 
	    	  required:"the password is required"
	      }
	  }
	});
}


/**
 * Save new status(user type) as selected in from dropdown
 * It checks whether user can change its status to selected one,
 * if not then prompt a popup to fill appropriate info.
 * @param element
 * @author hkaur5
 */
function saveNewUserType( element )
{
	var selected_type = $('select#work_status').val();
	switch(selected_type)
	{
	 	case 1:
	 	case '1':
	 	chgUsrTypToEmpOrRecruitrOrJobskr(element,selected_type,"Employed");
		break;
		
	 	case 2:
	 	case '2':
	 	chgUsrTypToEmpOrRecruitrOrJobskr(element,selected_type,"Jobseeker");
	 	break;
	 	
	 	case 3:
	 	case '3':
	 	changeUserTypeToStudent(element,selected_type);	
	 	break;
	 	
		case 4:
	 	case '4':
	 	chgUsrTypToEmpOrRecruitrOrJobskr(element,selected_type, "Recruiter");
	 	break;

		case 6:
		case '6':
			changeUserTypeToHomeMaker(element,selected_type);
			break;
	};
}
/**
 * Cancels editing user type and collapse the div back.
 * sets user type to its current type if changed in dropdown.
 * @param element
 * @param current_user_type
 * @author hkaur5
 * 
 */
function cancelEditingUserType( element, current_user_type )
{
	$('div#change_user_type').slideUp();
	$('a.edit_status').fadeIn();
	$('select#work_status').val(current_user_type);
}
/**
 * slides up change password.
 * @param element
 * @author hkaur5
 * 
 */
function cancelChgPswd( element )
{
	$('div#chg_pswd').slideUp();
	$('a.edit_icon_pencile').fadeIn();
	var validator = $("form#formChgPassword").validate();
	validator.resetForm();
	$("form#formChgPassword")[0].reset();

	
}
/**
 * Change user type to employed, rectruiter or jobseeker by checking if it already has
 * any exp else prompts a dialog to add an exp.
 * @param element
 * @param selected_type
 */
function chgUsrTypToEmpOrRecruitrOrJobskr( element, selected_type, new_user_type )
{
	
	var idd = addLoadingImage( $(element), 'before', 'loading_small_purple.gif', 0, 0, "span_save_user_type" );
	$('input.btn_change_status').hide();
	//Check if user have any experience.
	$.ajax(
	{
		//async: false,
		url : "/" + PROJECT_NAME + "account-settings/check-if-user-has-experience",
		method : "POST",
		type : "post",
		dataType : "json",
		success : function(jsonData)
		{     
			if(jsonData == 1)
			{
				$.ajax(
				{
					//async: false,
					url : "/" + PROJECT_NAME + "account-settings/change-users-type",
					method : "POST",
					data : { "selected_type":selected_type },
					type : "post",
					dataType : "json",
					success : function(jsonData)
					{    
						if( jsonData != 0 )
						{
							$("span#"+idd).remove(); 
							$('input.btn_change_status').fadeIn();
							$('div#change_user_type').slideUp();
							$('div#change_user_type').siblings().children('a').fadeIn();
							showDialogMsg( "Change status", "Your status has changed to "+new_user_type, 5000, 
									{
										buttons: 
										[
										 	{
									            text: "OK",
									            click: function()
									            {
									            	$(this).dialog("close");
									            }
										 	}
									 	],
									    show: 
									    {
									        effect: "fade"
									    },
									    hide: 
									    {
									        effect: "fade"
									    },
									    height: 165,
									    width: 300,
									}
						);

						}
						else
						{
							$("span#"+idd).remove();
							$('input.btn_change_status').fadeIn();
							showDialogMsg( "Change status", "Some error has occured while updating your user type!We will try to fix this soon.", 5000, 
									{
										buttons: 
										[
										 	{
									            text: "OK",
									            click: function()
									            {
									            	$(this).dialog("close");
									            }
										 	}
									 	],
									    show: 
									    {
									        effect: "fade"
									    },
									    hide: 
									    {
									        effect: "fade"
									    },
									    height: 165,
									    width: 300,
									}
						); 
						}
					}
				});
			}
			else
			{
				$("span#"+idd).remove(); 
				$('input.btn_change_status').fadeIn();
				$('div#add_experience_popup').bPopup(
				{
					modalClose: true,
				    easing: 'easeOutBack', //uses jQuery easing plugin
			        speed: 500,
			        amsl:0,
					closeClass : 'close_bpopup',
					zIndex : 2,
			        //transition: 'slideDown',
			        onClose: function() {},
			        onOpen: function() 
			        {
			        	var html = "";
			    		html += '<form id = "exp" action="">';
						html += '<input type = "hidden" name = "identity" value = "" id = "identity"/>';
						html += '<div class="contact-details add_or_edit" style="">';
						html += '<div class="contact-label-span2">';
						html += '<label>Company Name</label>';
						html += '<span>';
						html += '<input type="text" name="company" class="search-one-textbox " maxlength="60">';
						html += '</span>';
						html += '</div>';
						html += '<div class="contact-label-span2">';
						html += '<label>Title</label>';
						html += '<span>';
						html += '<input type="text" name="title" class="search-one-textbox " maxlength="200">';
						html += '</span>';
						html += '</div>';
						html += '<div class="contact-label-span2">';
						html += '<label>Location';
						html += '</label>';
						html += '<span>';
						html += '<input type="text" name="location" class="search-one-textbox " maxlength="80">';
						html += '</span>';
						html += '</div>';
						html += '<div class="contact-label-span2">';
						html += '<label>Time Period';
						html += '</label>';
						html += '<span style="color: #48545E!important;">';
						html += '<input name="currunt_company" id="currunt_company" type="checkbox" value="1" /> I am currently working at';
						html += '</span>';
						html += '</div>';
						html += '<div class="contact-label-span2">';
						html += '<label>&nbsp;</label>';
						html += '<span class="text-grey2" style = "width: 250px;">';
						html += '<label>From</label>';
						html += '<span>';
						html += '<input name="from_date" id="from_date" type="text" value="" readonly/>';
						html += '</span>';
						html += '<br/>';
						html += '<label>';
						html += 'To';
						html += '</label>';
						html += '<span>';
						html += '<input name="to_date" id="to_date" type="text" value="" readonly/>';
						html += '</span>';
						html += '</span>';
						html += '</div>';
						html += '<div class="contact-label-span2">';
						html += '<label>Additional Notes</label>';
						html += '<textarea style="width: 66% !important;margin-left:4px !important;"name="additional_notes" class="textarea2"  cols="10" rows="5"></textarea>';
						html += '</span>';
						html += '</div>';
							
						html += '</div>';
						html += '<div class=" summary-btn-outer bdr-grey2 add_or_edit">';
						html += '<input name="save" type="button"  alt="Save" title="Save"  class="new-save-btn" id="save_exp" value="Save" />';
		//								html += '<a href="javascript:;" id="cancel" class="new-cancel-btn">Cancel</a>';
						html += '</div>';
						html += '</form>';
						$('div#add_experience_box').html(html);
						destroyDatePickers();
			    		bindDatePickers();
						validateExperienceForm();
						autoComplete( "input[name=company]", "/" + PROJECT_NAME + "profile/get-all-ref-companies" );
						//currunt_company checkbox click
						$("input[name=currunt_company]").change(function() 
						{
							if(this.checked) 
							{
						        $("input[name=to_date]").val("");
						        $("input[name=to_date]").attr("disabled", true);
						        $("input[name=to_date]").removeClass("error");
						        $("label[for="+$('input[name=to_date]').attr('id')+"]").remove();
							}
							else
							{
								$("input[name=to_date]").removeAttr("disabled");
							}	
						}); 

						//Save experience inside bpop up.
			        	$('input#save_exp').click(function()
	        			{
			        		if( $( "form#exp" ).valid() )
			        		{	
				        		var idd = addLoadingImage( $(this), 'before', 'loading_small_purple.gif' );
				        		$.ajax(
			        			{
					                url: "/" + PROJECT_NAME + "profile/save-my-experience",
					                type: "POST",
					                dataType: "json",
					                data: $("form#exp").serialize(),
					                timeout: 50000,
					                success: function( jsonData ) 
					                {
					                	$("span#"+idd).remove();
					                	//To close popup on click of cross image.
				                		$('div#add_experience_popup').bPopup().close();
						                
				                }
		        			});
		        		}
        			});
		        }
			});
		}
	}
});
}

/**
 * Changes user_type to student,
 * before that it checks if user has any education else 
 * it prompts popup to enter education details.
 * @param element
 * @param selected_user_type
 */
function changeUserTypeToStudent( element, selected_user_type )
{
	var idd = addLoadingImage( $(element), 'before', 'loading_small_purple.gif', 0, 0, "span_save_user_type" );
	$('input.btn_change_status').hide();
	//Check if user have any edducation.
	$.ajax(
	{
	//async: false,
		url : "/" + PROJECT_NAME + "account-settings/check-if-user-has-education",
		method : "POST",
		type : "post",
		dataType : "json",
		success : function(jsonData)
		{     
			if(jsonData == 1)
			{
				
				$.ajax(
				{
					//async: false,
					url : "/" + PROJECT_NAME + "account-settings/change-users-type",
					method : "POST",
					data : { "selected_type":selected_user_type },
					type : "post",
					dataType : "json",
					success : function(jsonData)
					{    
						if( jsonData != 0 )
						{
							$("span#"+idd).remove(); 
							$('input.btn_change_status').fadeIn();
							$('div#change_user_type').slideUp();
							$('div#change_user_type').siblings().children('a').fadeIn();
							showDialogMsg( "Change status", "Your status has changed to student.", 5000, 
										{
											buttons: 
											[
											 	{
										            text: "OK",
										            click: function()
										            {
										            	$(this).dialog("close");
										            }
											 	}
										 	],
										    show: 
										    {
										        effect: "fade"
										    },
										    hide: 
										    {
										        effect: "fade"
										    },
										    height: 160,
										    width: 300,
										}
							); 
					
						}
						else
						{
							$("span#"+idd).remove();
							$('input.btn_change_status').fadeIn();
							showDialogMsg( "Change status", "Some error has occured while changing your user type! We will try to fix this soon.", 5000, 
									{
										buttons: 
										[
										 	{
									            text: "OK",
									            click: function()
									            {
									            	$(this).dialog("close");
									            }
										 	}
									 	],
									    show: 
									    {
									        effect: "fade"
									    },
									    hide: 
									    {
									        effect: "fade"
									    },
									    height: 165,
									    width: 300,
									}
						); 
						}
					}
				});
			}
			else
			{
				$("span#"+idd).remove(); 
				$('input.btn_change_status').fadeIn();
				$('div#add_education_popup').bPopup(
				{
					modalClose: true,
				    easing: 'easeOutBack', //uses jQuery easing plugin
			        speed: 500,
			        amsl:0,
					closeClass : 'close_bpopup',
			        //transition: 'slideDown',
			        onClose: function() {},
			        onOpen: function() 
			        {
			        	
			        	var edu_form = "";
			        	edu_form += '<form name="edu-form" id="edu-form" method="post" action="">';
			        	edu_form += '<input type="hidden" name="school_id" id="school_id" value="" />';
			        	edu_form += '<input type="hidden" name="degree_id" id="degree_id" value="" />';
			        	edu_form += '<input type="hidden" name="field_stud_id" id="field_stud_id" value="" />';
    					edu_form += '<input type="hidden" name="educ_id" id="educ_id" value="" />';
		        		edu_form += '<div class="contact-details" id="education-form">';
				   	    	    
		        		edu_form += '<div style="margin-top: 15px;" class="contact-label-span2-edu">';
		        		edu_form += '<label>Institution name</label>';
	        			edu_form += '<span>';
        				edu_form += '<input type="text" name="school_name" id="school_name" class="search-one-textbox edu-input" value="">';
        				edu_form += '</span>';
    					edu_form += '</div>';
						edu_form += '<div class="contact-label-span2-edu">';
						edu_form += '<label>Location</label>';
						edu_form += '<span> ';
						edu_form += '<input type="text" name="institute_location" id="institute_location" class="search-one-textbox edu-input" value="">';
						edu_form += '</span>';
						edu_form += '</div>';
						edu_form += '<div class="contact-label-span2-edu">';
						edu_form += '<label>Education Level</label>';
						edu_form += '<span>';
						edu_form += '<select name="degree" id="degree" class="dropdown" >';
						edu_form += '<option value = "">Select</option>';
						edu_form += '<option value="Not Specified">Not Specified</option>';
						edu_form += '<option value="High School">High School</option>';
						edu_form += '<option value="Certificate/Diploma">Certificate/Diploma</option>';
						edu_form += '<option value="Bachelor Degree">Bachelor Degree</option>';
						edu_form += '<option value="Masters Degree">Masters Degree</option>';
						edu_form += '<option value="Doctorate">Doctorate</option>';
						edu_form += '<option value="Professional">Professional</option>';
						edu_form += '<option value="Others">Others</option>';
						edu_form += '</select>';
						edu_form += '</span>';
		        		edu_form += '</div>';
		        		edu_form += '<div class="contact-label-span2-edu">';
		        		edu_form += '<label>Degree</label>';
		        		edu_form += '<span>';
		        		edu_form += '<input type="text" name="degree_name" id="degree_name" class="search-one-textbox edu-input" value="">';
		        		edu_form += '</span>';
		        		edu_form += '</div>';
						edu_form += '<div class="contact-label-span2-edu">';
						edu_form += '<label>Field of Study </label> ';
		        		edu_form += '<span> ';
						edu_form += '<input type="text" name="study_field" id="study_field" class="search-one-textbox edu-input" value="">';
						edu_form += '</span>'; 
		        		edu_form += '</div>';
						edu_form += '<div class="contact-label-span2-edu">';
						edu_form += '<label>Dates Attended</label>'; 
	        			edu_form += '<span class="text-grey2" style = "width: 250px;">';
		        		edu_form += '<span>';
	        			edu_form += '<label>';
        				edu_form += 'From';
    					edu_form += '</label>';
						edu_form += '<input type="text" name="from" id="from_date" class="search-one-textbox edu-input date-input" value="" style="width:100px !important;">';
		        		edu_form += '</span> ';
	        			edu_form += '<br />';
		        		edu_form += '<span>';
	        			edu_form += '<label>';
        				edu_form += "To";
    					edu_form += '</label>';
						edu_form += '<input type="text" name="to" id="to_date" class="search-one-textbox edu-input date-input" value="" style="width:100px !important;">';
		        		edu_form += '</span>';
	        			edu_form += '</span> ';
        				edu_form += '</div>';
    					edu_form += '<div class="contact-label-span2-edu">';
    					edu_form += '<label>Grade</label> ';
						edu_form += '<span> ';
						edu_form += '<input type="text" name="grade" id="grade" class="search-one-textbox edu-input" value="">';
						edu_form += '</span> ';
						edu_form += '</div>';
						edu_form += '<div class="contact-label-span2-edu">';
						edu_form += '<label>';
		        		edu_form += 'Activities and Societies';
						edu_form += '</label>';
						edu_form += '<span style="min-height: 115px;"> ';
		        		edu_form += '<textarea name="activities" id="activities" class="textarea-education" style="width: 91%;" cols="" rows="5"></textarea>';
		        		edu_form += '</span>';
	        			edu_form += '</div>';
        				edu_form += '<div class="contact-label-span2-edu">';
        				edu_form += '<label>&nbsp;</label>';
        				edu_form += '<span>';
		        		edu_form += '<font style="font-size: 11px; margin-top: 5px; float: left; width: 100%;">';
		        		edu_form += "Tip : Use commas to separate multiple activities";
	        			edu_form += '</font>';
		        		edu_form += '<br /> ';
    					edu_form += '<font style="font-size: 11px; margin-top: 5px; margin-bottom: 20px; float: left; width: 100%;">';
		        		edu_form += "Example : Alpha Phi Omega, Chamber Chorale, Debate Team";
	        			edu_form += '</font>';
		        		edu_form += '</span>';
	        			edu_form += '</div>';
        				edu_form += '<div class="contact-label-span2-edu"> ';
        				edu_form += '<label>Additional Notes</label> ';
    					edu_form += '<span style="min-height: 115px;">';
		        		edu_form += '<textarea name="additional_notes" id="additional_notes" class="textarea-education" style="width: 91%;" cols="" rows="5"></textarea>';
		        		edu_form += '</span> ';
	        			edu_form += '</div>';
					
        				edu_form += '<label>&nbsp;</label>';
        				edu_form += '</div>';
    					edu_form += '<div class=" summary-btn-outer bdr-grey2 edu-form-save-btn">';
		        		edu_form += '<input name="save-eduinfo" id="save_education" type="button"  alt="Save" title="Save"  class="new-save-btn" value="Save" />';
		        		edu_form += '</div>';
		        		edu_form += '</form>';
		        		$('div#add_education_box').html(edu_form);
		        		destroyDatePickers();
			    		bindDatePickers();
		        		validateEducationForm();
		        	
						//Save education detail inside bpop up.
			        	$('input#save_education').click(function()
			        	{
			        		if( $("form#edu-form").valid() )
			        		{	
				        		var idd = addLoadingImage( $(this), 'before', 'loading_small_purple.gif' );
					        	$.ajax(
					        	{
					                url: "/" + PROJECT_NAME + "profile/save-edu-info",
					                type: "POST",
					                dataType: "json",
					                data: $("form#edu-form").serialize(),
					                timeout: 50000,
					                success: function( jsonData ) 
					                {
					                	if(jsonData['msg']=="success" && jsonData['msg']!= 'error')
					                	{
						                	$("span#"+idd).remove();
						                	
						                	// Close education form bpopup
					                		$('div#add_education_popup').bPopup().close();
					                	}
					                	else if( jsonData['msg'] == 'error')
				                		{
					                		$('div#add_education_popup').bPopup().close();
					                		showDialogMsg( "Save education", "Some error occured while saving your education detail! We will try to fix this soon.", 5000, 
					    							{
					    								buttons: 
					    								[
					    								 	{
					    							            text: "OK",
					    							            click: function()
					    							            {
					    							            	$(this).dialog("close");
					    							            }
					    								 	}
					    							 	],
					    							    show: 
					    							    {
					    							        effect: "fade"
					    							    },
					    							    hide: 
					    							    {
					    							        effect: "fade"
					    							    },
					    							    height: 165,
					    							    width: 300,
					    							    dialogClass: "save_education_dialog"
					    							}
					    					); 
				                		}
					                	else
					                	{
					                		$('div#add_education_popup').bPopup().close();
					                		showDialogMsg( "Save education", "Some error occured while saving your education detail! We will try to fix this soon.", 5000, 
					    							{
					    								buttons: 
					    								[
					    								 	{
					    							            text: "OK",
					    							            click: function()
					    							            {
					    							            	$(this).dialog("close");
					    							            }
					    								 	}
					    							 	],
					    							    show: 
					    							    {
					    							        effect: "fade"
					    							    },
					    							    hide: 
					    							    {
					    							        effect: "fade"
					    							    },
					    							    height: 165,
					    							    width: 300,
					    							    dialogClass: "save_education_dialog"
					    							}
					    					); 
					                	}
							                
					                }
					        	});
			        		}
			        	});
			        }
				});
						
			}
		}
	});
}

/**
 * Changes user_type to home maker.
 * @param element
 * @param selected_user_type
 * @author ssharma4
 */
function changeUserTypeToHomeMaker( element, selected_user_type )
{
	var idd = addLoadingImage( $(element), 'before', 'loading_small_purple.gif', 0, 0, "span_save_user_type" );
	$('input.btn_change_status').hide();

	$.ajax(
		{
			url : "/" + PROJECT_NAME + "account-settings/change-users-type",
			method : "POST",
			data : { "selected_type":selected_user_type },
			type : "post",
			dataType : "json",
			success : function(jsonData)
			{
				if( jsonData != 0 )
				{
					$("span#"+idd).remove();
					$('input.btn_change_status').fadeIn();
					$('div#change_user_type').slideUp();
					$('div#change_user_type').siblings().children('a').fadeIn();
					showDialogMsg( "Change status", "Your status has changed to Home maker.", 5000,
						{
							buttons:
								[
									{
										text: "OK",
										click: function()
										{
											$(this).dialog("close");
										}
									}
								],
							show:
							{
								effect: "fade"
							},
							hide:
							{
								effect: "fade"
							},
							height: 160,
							width: 300,
						}
					);

				}
				else
				{
					$("span#"+idd).remove();
					$('input.btn_change_status').fadeIn();
					showDialogMsg( "Change status", "Some error has occured while changing your user type! We will try to fix this soon.", 5000,
						{
							buttons:
								[
									{
										text: "OK",
										click: function()
										{
											$(this).dialog("close");
										}
									}
								],
							show:
							{
								effect: "fade"
							},
							hide:
							{
								effect: "fade"
							},
							height: 165,
							width: 300,
						}
					);
				}
			}
		});
}
/**
 * Save new password.
 * @author hkaur5
 * @param element ( save button )
 * 
 */
 function saveNewPassword( element )
 {
	
	 var new_pswd = $('input#cnfrm_pswd').val();
	 var crnt_pswd = $('input#current_pswd').val();
	 validateChangePswd();
	 if( $( "form#formChgPassword" ).valid() )
	 {
		 var idd = addLoadingImage( $(element), 'before', 'loading_small_purple.gif', 0, 0, "span_save_password" );
//		 $('input#btn_change_pswd').hide();
		 $.ajax(
		 {
			//async: false,
			url : "/" + PROJECT_NAME + "authenticate/chg-pswrd",
			method : "POST",
			type : "post",
			data : {"new_pswd": new_pswd,"crnt_pswd":crnt_pswd},
			dataType : "json",
			success : function(jsonData)
			{     
				if(jsonData == 1)
				{
					$("span#"+idd).remove();
//					$('input#btn_change_pswd').fadeIn();
					showDialogMsg( "Change Password", "Your password has been changed successfully.", 5000, 
					{
							buttons: 
							[
							 	{
						            text: "OK",
						            click: function()
						            {
						            	$(this).dialog("close");
						            }
							 	}
						 	],
						    show: 
						    {
						        effect: "fade"
						    },
						    hide: 
						    {
						        effect: "fade"
						    },
						    height: 155,
						    width: 250,
						}
					); 
					$( "form#formChgPassword" )[0].reset();
					$("div#chg_pswd").slideUp();
					$("a.edit_icon_pencile").show();
					
					
				}
				else if( jsonData == 2 )
				{
					$("span#"+idd).remove();
					showDialogMsg( "Change Password", "Current Password does not matched.", 5000, 
									{
										buttons: 
										[
										 	{
									            text: "OK",
									            click: function()
									            {
									            	$(this).dialog("close");
									            }
										 	}
									 	],
									    show: 
									    {
									        effect: "fade"
									    },
									    hide: 
									    {
									        effect: "fade"
									    },
									    height: 150,
									    width: 300,
									}
					); 
					$( "form#formChgPassword" )[0].reset();
					
				}
				else if(jsonData == 3)
				{
					$("span#"+idd).remove();
					showDialogMsg( "Change Password", "New password selected is same as your old password.", 5000, 
									{
										buttons: 
										[
										 	{
									            text: "OK",
									            click: function()
									            {
									            	$(this).dialog("close");
									            }
										 	}
									 	],
									    show: 
									    {
									        effect: "fade"
									    },
									    hide: 
									    {
									        effect: "fade"
									    },
									    height: 165,
									    width: 300,
									}
					); 
					$( "form#formChgPassword input#new_pswd" ).val('');
					$( "form#formChgPassword input#cnfrm_pswd" ).val('');
				}
				else if(jsonData == 0)
				{
					$("span#"+idd).remove();
					showDialogMsg( "Change Password", "Some error has occured while reseting your password! We will fix this soon.", 5000, 
									{
										buttons: 
										[
										 	{
									            text: "OK",
									            click: function()
									            {
									            	$(this).dialog("close");
									            }
										 	}
									 	],
									    show: 
									    {
									        effect: "fade"
									    },
									    hide: 
									    {
									        effect: "fade"
									    },
									    height: 165,
									    width: 300,
									}
					); 
					$( "form#formChgPassword" )[0].reset();
				}
				else
				{
					$("span#"+idd).remove();
					showDialogMsg( "Change Password", "Some error has occured while reseting your password! We will fix this soon.", 5000, 
									{
										buttons: 
										[
										 	{
									            text: "OK",
									            click: function()
									            {
									            	$(this).dialog("close");
									            }
										 	}
									 	],
									    show: 
									    {
									        effect: "fade"
									    },
									    hide: 
									    {
									        effect: "fade"
									    },
									    height: 165,
									    width: 300,
									}
					); 
					$( "form#formChgPassword" )[0].reset();
				}
			}
		});
	 }
				
 }
/**
 * Apply date picker.
 * @author hkaur5
 * 
 */
function bindDatePickers()
{
	//Applying datepicker-------------
	$("input[name=from_date]").datepicker(
	{
		dateFormat: 'dd-mm-yy',
		changeMonth: true,
        changeYear: true,
        showButtonPanel: false,
        yearRange: '1930:c',
        maxDate: '0',
		onSelect: function( selectedDate ) 
		{
			
			$("input[name=to_date]").datepicker( "option", "minDate", selectedDate );
			$(this).trigger("focus").trigger("blur");//to manage validations
		}
	});
	
	$("input[name=to_date]").datepicker({
		dateFormat: 'dd-mm-yy',
		changeMonth: true,
        changeYear: true,
        showButtonPanel: false,
        yearRange: '1930:c',
        maxDate: '0',
		onSelect: function( selectedDate ) {
			$("input[name=from_date]").datepicker( "option", "maxDate", selectedDate );
			$(this).trigger("focus").trigger("blur");//to manage validations
		}
	});

	$("input[name=from]").datepicker(
		{
			dateFormat: 'dd-mm-yy',
			changeMonth: true,
			changeYear: true,
			showButtonPanel: false,
			yearRange: '1930:c',
			maxDate: '0',
			onSelect: function( selectedDate )
			{

				$("input[name=to]").datepicker( "option", "minDate", selectedDate );
				$(this).trigger("focus").trigger("blur");//to manage validations
			}
		});

	$("input[name=to]").datepicker({
		dateFormat: 'dd-mm-yy',
		changeMonth: true,
		changeYear: true,
		showButtonPanel: false,
		yearRange: '1930:c',
		maxDate: '0',
		onSelect: function( selectedDate ) {
			$("input[name=from]").datepicker( "option", "maxDate", selectedDate );
			$(this).trigger("focus").trigger("blur");//to manage validations
		}
	});
	//End applying datepicker--------	
}

/**
 * Unbind datepicker.
 * @author hkaur5
 */
function destroyDatePickers()
{
	$("input[name=from_date]").datepicker( "destroy" );
	$("input[name=to_date]").datepicker( "destroy" );	
}

/**
 * Ajax call to close the account of user.
 *
 * @param elem [the element on which we are clicking]
 * @return void
 * @author jsingh7
 * @version 1.0
 */
function closeAccount( elem )
{
	var message = "Please click 'Delete' to delete your account. <br><br> <i>Note - If you do not login within 30 days, your account will be permanently deleted.</i>";
	var close_acc_div_id = showDialogMsg( 'Delete Account', message, 0, 
			 		{ buttons: [
			 		             { 
			 		            	 text: "Delete", 
			 		            	 click: function(){
			 		            		 
			 		            		__addOverlay();
			 		            		$.ajax(
			 						        	{
			 						                url: "/" + PROJECT_NAME + "account-settings/close-account",
			 						                type: "POST",
			 						                dataType: "json",
			 						                data: $("form#edu-form").serialize(),
			 						                timeout: 50000,
			 						                complete: function(){
			 						            	// Handle the complete event
			 						                	__removeOverlay();
			 						            	},
			 						                success: function( jsonData ) 
			 						                {
			 						                	if( jsonData )
			 						                	{
			 						                		$("div#"+close_acc_div_id).dialog( "close" );
			 						                		window.location.replace( PROJECT_URL+PROJECT_NAME+"authenticate/logout/activity/account_deleted" );
			 						                	}
			 						                	else
			 						                	{
			 						                		//Close the previous dialog.
			 						                		$("div#"+close_acc_div_id).dialog( "close" );
			 						                		//Show error dialog.
			 						                		showDialogMsg( "Error!", "Oops! Error occured while deleting your account.<br> Please try after sometime or if problem persists please contact administrator.", 0, 
			 						                				{
					 						                		    buttons: [
					 						                		        {
					 						                		            text: "OK",
					 						                		            click: function(){
					 						                		                $(this).dialog("close");
					 						                		            }
					 						                		        }
					 						                		    ],
					 						                		    show: {
					 						                		        effect: "fade"
					 						                		    },
					 						                		    hide: {
					 						                		        effect: "fade"
					 						                		    },
					 						                		    dialogClass: "general_dialog_message",
					 						                		    height: 200,
					 						                		    width: 350
			 						                				}
			 						                			);
			 						                		}
			 						                	},
			 						                	error: function(jqXHR,error, errorThrown) { 
			 						                       if(jqXHR.status&&jqXHR.status==400)
			 						                       {
			 						                            alert(jqXHR.responseText); 
			 						                       }else{
			 						                           alert("Something went wrong");
			 						                       }
			 						                  }
			 						        	});
			 		            		 
			 		            		 	}
			 		             },
			 		             { 
			 		            	 text: "Cancel", 
			 		            	 class: 'only_text',
			 		            	 click: function(){ 
			 		            		 $(this).dialog("close"); 
			 		            	 } 
			 		             }
			 		          ],
			 		  modal: true,        
			 		  show: { effect: "fade" }, 
			 		  hide: { effect: "fade" }, 
			 		  dialogClass: "general_dialog_message",
			 		  height: 200, width: 350 
			 		  }

	);
}
