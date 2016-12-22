$(document).ready(function(){
	
	bindDatePickers();
	autoComplete( "input[name=company]", "/" + PROJECT_NAME + "profile/get-all-ref-companies" );
	
	//currunt_company checkbox click
	 $("input[name=currunt_company]").change(function() {
	    if(this.checked) {
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
				maxlength : 1500
			},
		}
	});
	//End validations------------
	
	$('.contact-details.add_or_edit current_company').on('change', function () {
        var checked = $(this).prop('checked');
        $('#dp1378181480794.hasDatepicker').prop('disabled', !checked);
    });
	
	  //Alert box for prompting user that only one experience is left.
    $( "div#dialog_experience" ).dialog({
	      modal: true,
	      autoOpen: false,
	      draggable:false,
	      width: 300,
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
	
	//Delete functionality-------
	$("a.delete").click(function(){
		var idd = addLoadingImage( $(this), 'after', 'loading_small_purple.gif', 0, 16 );
		var identity = $('input[name=identity]').val();
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "profile/delete-my-experience",
	        type: "POST",
	        dataType: "json",
	        data: {'id' : identity},
	        timeout: 50000,
	        success: function(jsonData) {
	        	if( jsonData == 1 )
	        	{	
		        	$("div.add_or_edit").slideUp();
		    		clear_form_elements("form#exp");
		    		$("div#"+identity).remove();
		    		$("span#"+idd).remove();
	        	}
	        	if( jsonData == 2 )
	        	{
		    		clear_form_elements("form#exp");
		    		$("div#"+identity).remove();
		    		$("span#"+idd).remove();
	        		show_first_time_entry_form();
	        	}	
	        	if( jsonData == 3 )
	        	{
	        		deleteWhenOneExpLeft();
		    		$("span#"+idd).remove();
	        		
	        	}
	        }
		});
	});
	
	//End delete functionality---
	
	//Prompt user that only one experience is left.
	function deleteWhenOneExpLeft()
	{
		$("#dialog_experience").dialog("open");
	}
	
	
	//Cancel functionality----
	$("a#cancel").click(function(){
		$("div.add_or_edit").slideUp();
		clear_form_elements("form#exp");
		removeFormValidationMessages( validator );
		$("input[name=add]").fadeIn('slow');
		$("div.un-editable-outer").fadeIn('slow');
		$("input[name=to_date]").removeAttr("disabled");
		destroyDatePickers();
		bindDatePickers();
	});
	//End cancel functionality----
	
	//Add button functionality----
	$("input[name=add]").click(function(){
		$(this).hide();
		$("span.delete_span").hide();
		clear_form_elements("form#exp");
		$("div.un-editable-outer").fadeIn('slow');
		$("div.add_or_edit").slideDown();
		destroyDatePickers();
		bindDatePickers();
		 
	});
	//End add button functionality----
	
	//Save functionality--------
	$("input[name=save]").click(function(){
		var thiss = $(this);
		if( $( "form#exp" ).valid() )
		{	
			var idd = addLoadingImage($(this), 'before');
			jQuery.ajax({
				//async: false,
		        url: "/" + PROJECT_NAME + "profile/save-my-experience",
		        type: "POST",
		        dataType: "json",
		        data: $("form#exp").serialize(),
		        timeout: 50000,
		        success: function(jsonData) {
		        	
		        	if( jsonData != 0 )
		        	{
		        		if( jsonData.current_exp_data.new_record == 1 )
		        		{
		        			var row = "";
		        			var todate=$('input#to_date').val();
		        			
				        	row += '<div id="'+jsonData.current_exp_id+'" class="un-editable-outer" style = "background-color:#CABEDB" >';
				        	row += '<h3 style = "font-weight:bold;word-wrap:break-word;">';
				        	row += '<span class="exp_title" >' +jsonData.current_exp_data.emp_job_title+'</span>';
				        	row += '<a id="'+jsonData.current_exp_id+'" class="edit_exp" href="javascript:;" onclick = "editClick(this)">';
				        	row += '<img class = "edit-new-icon" src="'+IMAGE_PATH+'/edit-pencil.png">';
				        	row += '</a>';
				        	row += '</h3>';
				        	row += '<p class="exp_company">'+jsonData.current_exp_data.company_name+'</p>';
				        	row += '<p class="exp_location"> '+jsonData.current_exp_data.location+' </p>';
				        	if(jsonData.current_exp_data.currently_work !=  1)
				        	    {
				        	     row += '<p class="exp_dates"> '+Date.parseExact(jsonData.current_exp_data.experience_from, ["d-M-yyyy"]).toString('MMMM-yyyy')+' - '+Date.parseExact(jsonData.current_exp_data.experience_to, ["d-M-yyyy"]).toString('MMMM-yyyy')+' ('+ jsonData.current_exp_data.date_diff +') </p>';
				        	    }
				        	else
				        		{
				        		 //$("span.notSet").html("Not Set");
				        		 //$("span.notSet").html(Date.parseExact(jsonData.previous_current_exp_job_endate, ["d-M-yyyy"]).toString('MMMM-yyyy'));
				        		 if(jsonData.previous_current_exp_job_endate == null)
				        		  {
				        			  $("span.notSet").html("Not Set");
				        		  }
				        		  else if(jsonData.previous_current_exp_id!= 0  &&  jsonData.previous_current_exp_job_endate != null)
				        		  {
				        			  $("span.notSet").html(Date.parseExact(jsonData.previous_current_exp_job_endate, ["d-M-yyyy"]).toString('MMMM-yyyy'));
				        		  }
				        		 row += '<p class="exp_dates"> '+Date.parseExact(jsonData.current_exp_data.experience_from, ["d-M-yyyy"]).toString('MMMM-yyyy')+' - <span class="notSet">Present</span></p>';				        		
				        		}
				        	
				        	row += '<p class="exp_notes">Notes: '+nl2br(jsonData.current_exp_data.description)+' </p>';
				        	row += '</div>';
				        	$("div#un-editable-outer-wrapper").prepend(row);
				        	$("div#"+jsonData.current_exp_id).animate({backgroundColor: '#fff'}, 7000);
				        	$("div.add_or_edit").slideUp();
				    		clear_form_elements("form#exp");
				    		$("input[name=add]").fadeIn('slow');
				    		$("span#"+idd).remove();
				    		destroyDatePickers();
				    		bindDatePickers();
				    	
		        		}
		        		else
		        		{
		        			
			        		$("div#"+jsonData.current_exp_id+" span.exp_title").html(jsonData.current_exp_data.emp_job_title);
			        		$("div#"+jsonData.current_exp_id+" p.exp_company").html(jsonData.current_exp_data.company_name);
				          if(jsonData.current_exp_data.currently_work !=  1)
			        	    {
				        		$("div#"+jsonData.current_exp_id+" p.exp_dates").html(Date.parseExact(jsonData.current_exp_data.experience_from, ["d-M-yyyy"]).toString('MMMM-yyyy')+' - '+Date.parseExact(jsonData.current_exp_data.experience_to, ["d-M-yyyy"]).toString('MMMM-yyyy')+' (' + jsonData.current_exp_data.date_diff + ')');
			        	    }	
			        	  else
			        		{
			        		  if(jsonData.previous_current_exp_job_endate == null)
			        		  {
			        			  $("span.notSet").html("Not Set");
			        		  }
			        		  else if(jsonData.previous_current_exp_id!= 0  &&  jsonData.previous_current_exp_job_endate != null)
			        		  {
			        			  $("span.notSet").html(Date.parseExact(jsonData.previous_current_exp_job_endate, ["d-M-yyyy"]).toString('MMMM-yyyy'));
			        		  }
			        		  $("div#"+jsonData.current_exp_id+" p.exp_dates").html(Date.parseExact(jsonData.current_exp_data.experience_from, ["d-M-yyyy"]).toString('MMMM-yyyy')+' - <span class="notSet">Present</span></p>');				        		
			        		}

			        		$("div#"+jsonData.current_exp_id+" p.exp_location").html(jsonData.current_exp_data.location);
			        		$("div#"+jsonData.current_exp_id+" p.exp_notes").html("Notes: "+nl2br(jsonData.current_exp_data.description));
			        		$("div#"+jsonData.current_exp_id).css("background-color", "#CABEDB");
			        		
			        		$("div#"+jsonData.current_exp_id).fadeIn("slow");
				        	$("div#"+jsonData.current_exp_id).animate({backgroundColor: '#fff'}, 7000);
				        	$("div.add_or_edit").slideUp();
				    		clear_form_elements("form#exp");
				    	   

				    		$("span#"+idd).remove();
				    		destroyDatePickers();
				    		bindDatePickers();
		        			}
		        	}	
				},
		        error: function(xhr, ajaxOptions, thrownError) {
					//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
				}
		    });
		}	
	});
	//End save functionality----
	
});

//Edit functionality----
function editClick(elem)
{
	var thiss = $(elem);
	var idd = addLoadingImage($(elem), 'after','loading_small_purple.gif', 0, 14, 'fr');

	jQuery.ajax({
        url: "/" + PROJECT_NAME + "profile/get-my-experience",
        type: "POST",
        dataType: "json",
        data: { "exp_id" : $(elem).attr("id") },
        timeout: 50000,
        success: function(jsonData) 
        {
        	 
        	
        	$("input[name=identity]").val(jsonData.id);
        	$("input[name=title]").val(jsonData.job_title);
        	$("input[name=company]").val(jsonData.experiencesCompany);
        	$("input[name=location]").val(jsonData.location);
        	$("input[name=from_date]").val(jsonData.job_startdate);
        	$("input[name=to_date]").val(jsonData.job_enddate);
        	if( jsonData.currently_work ==  1 )
        	{
        		$("input[name=currunt_company]").prop('checked',true);
        		$("input[name=to_date]").attr('disabled','disabled');
    			$("input[name=to_date]").val('');

        	}
        	else
        	{
        		$("input[name=currunt_company]").removeAttr("checked");
        		$("input[name=to_date]").removeAttr("disabled");
        	}
        	$("textarea[name=additional_notes]").val(jsonData.description);
        	$("div.un-editable-outer").show();
        	$("div#"+thiss.attr("id")).hide();
        	$("div.add_or_edit").slideDown();
        	$("div.add_or_edit").scrollTop(300);
        	$("span#"+idd).remove();
        	$("input[name=add]").fadeIn('slow');
        	$("span.delete_span").show();
        	removeFormValidationMessages( validator );
        	//$("input[name=to_date]").removeAttr("disabled");
        	
    		
        	//Smooth scrolling top.
    		$('html, body').stop().animate({
    	        scrollTop: 0
    	    }, 1000);
    		
 
    		
		},
        error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
		}
    });
}
//End edit functionality----

function bindDatePickers()
{
	//Applying datepicker-------------
	$("input[name=from_date]").datepicker({
		dateFormat: 'dd-mm-yy',
		changeMonth: true,
        changeYear: true,
        showButtonPanel: false,
        yearRange: '1930:c',
        maxDate: '0',
		onSelect: function( selectedDate ) {
			
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
	//End applying datepicker--------	
}
function destroyDatePickers()
{
	$("input[name=from_date]").datepicker( "destroy" );
	$("input[name=to_date]").datepicker( "destroy" );	
}

function show_first_time_entry_form()
{
	$("input[name=add]").hide();
	$(".add_or_edit").fadeIn("slow");
	$("span.delete_span").hide();
	$("a#cancel").hide();
	
}
