$(document).ready(function(){
	
	$("input[name=publication_date]").datepicker({
		dateFormat: 'dd-mm-yy',
		changeMonth: true,
        changeYear: true,
        yearRange: '1930:c',
        maxDate: '0',
        //showButtonPanel: true
	});
	
	//Validations----------------
	validator = $( "form#publications" ).validate({
		rules: {
			title:{
				required : true
			},
			publication_or_publisher:{
				required : true
			},
			publication_url:{
				url : true
			},
			publication_date:{
				required : true
			},
			activities_n_socities:
			{
				maxlength : 250
			}
		}
	});
	//End validations------------
	
	//Cancel functionality----
	$("a#cancel").click(function(){
		$("div.add_or_edit").slideUp();
		clear_form_elements("form#exp");
		removeFormValidationMessages( validator );
		$("input[name=add]").fadeIn('slow');
		$("div.un-editable-outer").fadeIn('slow');
		destroyDatePickers();
		bindDatePickers();
	});
	//End cancel functionality----
	
	//Delete functionality-------
	$("a.delete").click(function(){
		var idd = addLoadingImage( $(this), 'after', 'loading_small_purple.gif', 0, 16 );
		var identity = $('input[name=identity]').val();
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "profile/delete-my-publication",
	        type: "POST",
	        dataType: "json",
	        data: {'id' : identity},
	        timeout: 50000,
	        success: function(jsonData) {
	        	if( jsonData == 1 )
	        	{	
		        	$("div.add_or_edit").slideUp();
		    		clear_form_elements("form#publications");
		    		$("div#"+identity).remove();
		    		$("span#"+idd).remove();
	        	}
	        	if( jsonData == 2 )
	        	{
		    		clear_form_elements("form#publications");
		    		$("div#"+identity).remove();
		    		$("span#"+idd).remove();
	        		show_first_time_entry_form();
	        	}	
	        }
		});
	});
	//End delete functionality---
	
	//Add button functionality----
	$("input[name=add]").click(function(){
		$(this).hide();
		$("span.delete_span").hide();
		clear_form_elements("form#publications");
		$("div.un-editable-outer").fadeIn('slow');
		$("div.add_or_edit").slideDown();
	});
	//End add button functionality----
	
	//Save functionality--------
	$("input[name=save]").click(function(){
		var thiss = $(this);
		if( $( "form#publications" ).valid() )
		{	
			var idd = addLoadingImage($(this), 'before');
			jQuery.ajax({
		        url: "/" + PROJECT_NAME + "profile/save-my-publication",
		        type: "POST",
		        dataType: "json",
		        data: $("form#publications").serialize(),
		        timeout: 50000,
		        success: function(jsonData) {
		        	if( jsonData != 0 )
		        	{
		        		if( jsonData.new_record == 1 )
		        		{
		        			var row = "";
		        			
		        			row += '<div class="un-editable-outer" id = "'+jsonData.id+'" style = "background-color:#CABEDB">';
		        			row += '<h3><span class = "title">'+jsonData.title+'</span><a href="javascript:;" onclick="editClick(this)" class = "edit_exp" id = "'+jsonData.id+'">';
		        			row += '<img src="/'+PROJECT_NAME+'public/images/icon-pencil.png" alt="Edit" title="Edit" width="16" height="16" /></a></h3>';
		        			row += '<p class = "publisher">'+jsonData.publication_or_publisher+'</p>';
		        			row += '<p class = "datee">'+Date.parseExact(jsonData.publication_date, ["d-M-yyyy"]).toString('MMMM-yyyy')+'</p>';
		        			row += '<p class = "url">'+jsonData.publication_url+'</p>';
		        			row += '<p class = "author"><strong>Author</strong> : '+jsonData.author+'</p>';
		        			row += '<p class = "activites"><strong>Activites </strong> : '+jsonData.activities_n_socities+'</p></div>';
				        	
				        	$("div#un-editable-outer-wrapper").prepend(row);
				        	$("div#"+jsonData.id).animate({backgroundColor: '#fff'}, 7000);
				        	$("div.add_or_edit").slideUp();
				    		clear_form_elements("form#publications");
				    		$("input[name=add]").fadeIn('slow');
				    		$("span#"+idd).remove();
		        		}
		        		else
		        		{
			        		$("div#"+jsonData.id+" span.title").html(jsonData.title);
			        		$("div#"+jsonData.id+" p.publisher").html(jsonData.publication_or_publisher);
			        		$("div#"+jsonData.id+" p.datee").html(Date.parseExact(jsonData.publication_date, ["d-M-yyyy"]).toString('MMMM-yyyy') );
			        		$("div#"+jsonData.id+" p.url").html(jsonData.publication_url);
			        		$("div#"+jsonData.id+" p.author").html("<strong>Author</strong> : "+jsonData.author);
			        		$("div#"+jsonData.id+" p.activites").html("<strong>Activites </strong> : "+jsonData.activities_n_socities);
			        		$("div#"+jsonData.id).css("background-color", "#CABEDB");
			        		$("div#"+jsonData.id).fadeIn("slow");
				        	$("div#"+jsonData.id).animate({backgroundColor: '#fff'}, 7000);
				        	$("div.add_or_edit").slideUp();
				    		clear_form_elements("form#publications");
				    		$("span#"+idd).remove();
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
	var idd = addLoadingImage($(elem), 'after');
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "profile/get-my-publication",
        type: "POST",
        dataType: "json",
        data: { "pub_id" : $(elem).attr("id") },
        timeout: 50000,
        success: function(jsonData) {
        	$("input[name=identity]").val(jsonData.id);
        	$("input[name=title]").val(jsonData.title);
        	$("input[name=publication_or_publisher]").val(jsonData.publisher);
        	$("input[name=publication_date]").val(jsonData.datee);
        	$("input[name=publication_url]").val(jsonData.url);
        	$("input[name=author]").val(jsonData.author);
        	$("textarea[name=activities_n_socities]").val(jsonData.activities);
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
//End edit functionality----

function show_first_time_entry_form()
{
	$("input[name=add]").hide();
	$(".add_or_edit").fadeIn("slow");
	$("span.delete_span").hide();
	$("a#cancel").hide();
}