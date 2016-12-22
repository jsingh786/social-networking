var iddd;
var validator;
$(document).ready(function() {
	//Validations----------------
	validator = $( "form#lang" ).validate({
		rules: {
			lang_name:{
				required : true
//				remote:{
//					url: "/"+PROJECT_NAME+"profile/check-lang-exist",
//					type: "post",
//					beforeSend: function() {
//						$("input#save_language").attr("disabled", "disabled");
//						iddd = addLoadingImage( $("input#save_language"), 'before', 'loading_small_purple.gif' );
//					},
//					complete: function(data) {
//						if(data.responseText == "true")
//						{
//							$("input#save_language").removeAttr("disabled");
//						}
//						$("span#"+iddd).remove();
//					},
//					data: {
//						lang_name: function()
//						{
//							return $( "#lang_name" ).val();
//						}
//					}
//				}
			},
			lang_proficiency:{
				required : true
			}
		},
	messages: {
//		lang_name: {
//            remote: "This language has been already added!",
//        },
	}

	});
	//End validations------------
	
	 //Alert box when language already exists.
    $( "div#language_exists" ).dialog({
	      modal: true,
	      autoOpen: false,
	      draggable:false,
	      resizable: false,
	      width: 250,
	      open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); },
	      show: {
	    	  effect: "fade"
	    	  },
		  hide: {
			  effect: "fade"
			  },
	      buttons: {
	    		 OK: function() {
	 	    		$( this ).dialog( "close" );
	 	    		
	    		 }
	      	}
    	});
	
	
	//Delete functionality-------
	$("a.delete").click(function(){
		var idd = addLoadingImage( $(this), 'after', 'loading_small_purple.gif', 0, 16 );
		var identity = $('input[name=identity]').val();
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "profile/delete-my-language",
	        type: "POST",
	        dataType: "json",
	        data: { 'id' : identity },
	        timeout: 50000,
	        success: function(jsonData) {
	        	if( jsonData == 1 )
	        	{	
		        	$("div.add_or_edit").slideUp();
		    		clear_form_elements("form#lang");
		    		$("div#"+identity).remove();
		    		$("span#"+idd).remove();
	        	}
	        	else if( jsonData == 2 )
	        	{
		    		clear_form_elements("form#lang");
		    		$("div#"+identity).remove();
		    		$("span#"+idd).remove();
	        		show_first_time_entry_form();
	        	}	
	        }
		});
	});
	//End delete functionality---
	
	//Cancel functionality----
	$("a#cancel").click(function(){
		$("div.add_or_edit").slideUp();
		clear_form_elements("form#exp");
		removeFormValidationMessages( validator );
		$("input[name=add]").fadeIn('slow');
		$("div.un-editable-outer").fadeIn('slow');
	});
	//End cancel functionality----
	
	//Add button functionality----
	$("input[name=add]").click(function(){
		$(this).hide();
		$("span.delete_span").hide();
		$("a#cancel").show();	
		removeFormValidationMessages( validator );
		clear_form_elements("form#lang");
		$("div.un-editable-outer").fadeIn('slow');
		$("div.add_or_edit").slideDown();
		
		validator.resetForm();
		
	});
	//End add button functionality----
	
	//Save functionality--------
	$("input[name=save]").click(function(){
		var flag = 0;
		jQuery.each( $("div label.lang_name:visible"), function( i, val ) {
			//console.log($(val).text());
			if( $("input#lang_name").val().trim().toUpperCase() == $(this).text().trim().toUpperCase() )
			{
				$( "div#language_exists").dialog( "open" );
				flag = 1;
			}
		});
		if( flag == 0 )
		{	
			var thiss = $(this);
			if( $( "form#lang" ).valid() )
			{	
				var idd = addLoadingImage($(this), 'before');
				jQuery.ajax({
			        url: "/" + PROJECT_NAME + "profile/save-my-language",
			        type: "POST",
			        dataType: "json",
			        data: $("form#lang").serialize(),
			        timeout: 50000,
			        success: function(jsonData) {
			        	if( jsonData != 0 )
			        	{
			        		if( jsonData.new_record == 1 )
			        		{
			        			var row = "";
			        			row += '<div class="un-editable-outer" id = "'+jsonData.id+'" style = "background-color:#CABEDB">';
			        			row += '<label class = "lang_name">'+jsonData.name+'</label>';
			        			row += '<span class="text-grey3"><div class="loader-col1">'+jsonData.proficiency;
			        			row += '</div><div class="loader-col2"><a href="javascript:;" id="'+jsonData.id+'" class="edit_lang fl" onclick="editClick(this)">';
			        			row += '<img src="/'+PROJECT_NAME+'public/images/edit-pencil.png" alt="Edit" align="absmiddle" title="Edit" />';
			        			row += '</a></div></span></div>';
					        	$("div#un-editable-outer-wrapper").prepend(row);
					        	$("div#"+jsonData.id).animate({backgroundColor: '#F2F2F2'}, 7000);
					        	$("div.add_or_edit").slideUp();
					    		clear_form_elements("form#lang");
					    		$("input[name=add]").fadeIn('slow');
					    		$("span#"+idd).remove();
			        		}
			        		else
			        		{
				        		$("div#"+jsonData.id+" label.lang_name").html(jsonData.name);
				        		$("div#"+jsonData.id+" div.loader-col1").html(jsonData.proficiency);
				        		$("div#"+jsonData.id).show();
				        		$("div#"+jsonData.id).css("background-color", "#CABEDB");
					        	$("div#"+jsonData.id).animate({backgroundColor: '#F2F2F2'}, 7000);
					        	$("div.add_or_edit").slideUp();
					    		clear_form_elements("form#lang");
					    		$("input[name=add]").fadeIn('slow');
					    		$("span#"+idd).remove();
			        		}
			        	}
					},
			        error: function(xhr, ajaxOptions, thrownError) {
						//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
					}
			    });
			}
		}
	});
	//End save functionality----
	
});

//Edit functionality----
function editClick(elem)
{
	$("a#cancel").show();
	var thiss = $(elem);
	var idd = addLoadingImage($(elem), 'after','loading_small_purple.gif', 0, 0, "abs" );
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "profile/get-my-language",
        type: "POST",
        dataType: "json",
        data: { "lang_id" : $(elem).attr("id") },
        timeout: 50000,
        success: function(jsonData) {
        	$("input[name=identity]").val(jsonData.id);
        	$("input[name=lang_name]").val(jsonData.name);
        	$("select[name=lang_proficiency]").val(jsonData.proficiency);
        	$("div.un-editable-outer").show();
        	$("div#"+thiss.attr("id")).hide();
        	$("div.add_or_edit").slideDown();
        	$("span#"+idd).remove();
        	$("input[name=add]").fadeIn('slow');
        	$("span.delete_span").fadeIn('slow');
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

//End edit functionality----
function show_first_time_entry_form()
{
	$("input[name=add]").hide();
	$(".add_or_edit").fadeIn('slow');
	$("span.delete_span").hide();
	$("a#cancel").hide();
}