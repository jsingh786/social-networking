$(document).ready(function(){
	
	bindDatePickers();
	
	//Validations----------------
	validator = $( "form#project_form" ).validate({
		rules: {
			project_name:{
				required : true
			},
			occupation:{
				required : true
			},
			from_date:{
				required : true
			},
			project_url:{
				url : true
			},

			to_date:{
				required : true
			}
		}
	});
	//End validations------------
	
	//Cancel functionality----
	$("a#cancel").click(function(){
		$("div.add_or_edit").slideUp();
		clear_form_elements( "form#project_form" );
		removeFormValidationMessages( validator );
		$("input[name=add]").fadeIn('slow');
		$("div.un-editable-outer").fadeIn('slow');
		destroyDatePickers();
		bindDatePickers();
	});
	//End cancel functionality----

	//Add button functionality----
	$("input[name=add]").click(function(){
		$(this).hide();
		$("span.delete_span").hide();
		clear_form_elements( "form#project_form" );
		$("div.un-editable-outer").fadeIn('slow');
		$("div.add_or_edit").slideDown();
		destroyDatePickers();
		bindDatePickers();
	});
	
	//Delete functionality-------
	$("a.delete").click(function(){
		var idd = addLoadingImage( $(this), 'after', 'loading_small_purple.gif', 0, 16 );
		var identity = $('input[name=identity]').val();
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "profile/delete-my-project",
	        type: "POST",
	        dataType: "json",
	        data: {'id' : identity},
	        timeout: 50000,
	        success: function(jsonData) {
	        	if( jsonData == 1 )
	        	{	
		        	$("div.add_or_edit").slideUp();
		    		clear_form_elements( "form#project_form" );
		    		$("div#"+identity).remove();
		    		$("span#"+idd).remove();
	        	}
	        	if( jsonData == 2 )
	        	{
		    		clear_form_elements( "form#project_form" );
		    		$("div#"+identity).remove();
		    		$("span#"+idd).remove();
	        		show_first_time_entry_form();
	        	}	
	        }
		});
	});
	//End delete functionality---
	
	//Save functionality--------
	$("input[name=save]").click(function(){
		var thiss = $(this);
		if( $( "form#project_form" ).valid() )
		{	
			var idd = addLoadingImage($(this), 'before');
			jQuery.ajax({
		        url: "/" + PROJECT_NAME + "profile/save-my-project",
		        type: "POST",
		        dataType: "json",
		        data: $("form#project_form").serialize(),
		        timeout: 50000,
		        success: function(jsonData) {
		        	if( jsonData != 0 )
		        	{
		        		if( jsonData.new_record == 1 )
		        		{
		        			var row = "";
		        			
				        	row += '<div id="'+jsonData.id+'" class="un-editable-outer" style = "background-color:#CABEDB" >';
				        	row += '<h3>';
				        	row += '<span class="proj_name">'+jsonData.project_name+'</span>';
				        	row += '<a id="'+jsonData.id+'" class="edit_exp" href="javascript:;" onclick = "editClick(this)">';
				        	row += '<img class="edit-new-icon"  src="'+PUBLIC_PATH+'/images/edit-pencil.png">';
				        	row += '</a>';
				        	row += '</h3>';
				        	row += '<p class="proj_occu">'+jsonData.occupation+'</p>';
				        	row += '<p class="proj_dates"> '+Date.parseExact(jsonData.from_date, ["d-M-yyyy"]).toString('MMMM-yyyy')+' - '+Date.parseExact(jsonData.to_date, ["d-M-yyyy"]).toString('MMMM-yyyy')+' ('+ jsonData.date_diff +') </p>';
				        	row += '<p class="proj_url"> '+jsonData.project_url+' </p>';
//				        	row += '<p>Team Members: Lorem ipsum </p>';
				        	row += '<p class="proj_descrip">Description: '+jsonData.project_desc+' </p>';
				        	row += '</div>';
				        	$("div#un-editable-outer-wrapper").prepend(row);
				        	$("div#"+jsonData.id).animate({backgroundColor: '#fff'}, 7000);
				        	$("div.add_or_edit").slideUp();
				    		clear_form_elements("form#project_form");
				    		$("input[name=add]").fadeIn('slow');
				    		$("span#"+idd).remove();
				    		destroyDatePickers();
				    		bindDatePickers();
		        		}
		        		else
		        		{
			        		$("div#"+jsonData.id+" span.proj_name").html(jsonData.project_name);
			        		$("div#"+jsonData.id+" p.proj_occu").html(jsonData.occupation);
			        		$("div#"+jsonData.id+" p.proj_dates").html(Date.parse(jsonData.from_date).toString('MMMM-yyyy')+' - '+Date.parse(jsonData.to_date).toString('MMMM-yyyy')+' (' + jsonData.date_diff + ')');
			        		$("div#"+jsonData.id+" p.proj_url").html(jsonData.project_url);
			        		$("div#"+jsonData.id+" p.proj_descrip").html("Description: "+jsonData.project_desc);
			        		$("div#"+jsonData.id).css("background-color", "#CABEDB");
			        		$("div#"+jsonData.id).fadeIn("slow");
				        	$("div#"+jsonData.id).animate({backgroundColor: '#fff'}, 7000);
				        	$("div.add_or_edit").slideUp();
				    		clear_form_elements("form#project_form");
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


function bindDatePickers()
{
	//Applying datepicker-------------
	$("input[name=from_date]").datepicker({
		dateFormat: 'dd-mm-yy',
		changeMonth: true,
        changeYear: true,
        yearRange: '1930:c',
        maxDate: '0',
        //showButtonPanel: true,
		onSelect: function( selectedDate ) {
			$("input[name=to_date]").datepicker( "option", "minDate", selectedDate );
			$(this).trigger("focus").trigger("blur");//to manage validations
		}
	});
	$("input[name=to_date]").datepicker({
		dateFormat: 'dd-mm-yy',
		changeMonth: true,
        changeYear: true,
        yearRange: '1930:c',
        maxDate: '0',
       // showButtonPanel: true,
		onSelect: function( selectedDate ) {
			$("input[name=from_date]").datepicker( "option", "maxDate", selectedDate );
			$(this).trigger("focus").trigger("blur");//to manage validations
		}
	});	
	//End applying datepicker--------	
}

function editClick(elem)
{
	var thiss = $(elem);
	var idd = addLoadingImage($(elem), 'after');
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "profile/get-my-projects",
        type: "POST",
        dataType: "json",
        data: { "proj_id" : $(elem).attr("id") },
        timeout: 50000,
        success: function(jsonData) {
        	$("input[name=identity]").val(jsonData.id);
        	$("input[name=project_name]").val(jsonData.project_name);
        	$("input[name=occupation]").val(jsonData.occupation);
        	$("input[name=from_date]").val(jsonData.from_date);
        	$("input[name=to_date]").val(jsonData.to_date);
        	$("input[name=project_url]").val(jsonData.project_url);
        	$("textarea[name=project_desc]").val(jsonData.project_desc);
        	$("div.un-editable-outer").show();
        	$("div#"+thiss.attr("id")).hide();
        	$("div.add_or_edit").slideDown();
        	$("span#"+idd).remove();
        	$("input[name=add]").fadeIn('slow');
        	$("span.delete_span").show();
        	removeFormValidationMessages( validator );
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


//End add button functionality----
