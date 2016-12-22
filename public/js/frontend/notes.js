$(document).ready(function(){
	//Checking/unchecking checkboxes
	//Checking all checkboxes onclick of main chechbox.
	$("input#check_all_notes").click(function()
	{
		//check on click of main checkbox if all the checkboxes 
		//already selected then uncheck them.
		var isAllChecked = isAllCBChecked("input.check_note");
		if( isAllChecked == 1)
		{
			$("input.check_note").prop("checked", false);
			 $('span#delete_multiple_notes').fadeOut();
		}
		else
		{	
			$("input.check_note").prop('checked', true);
			 $('span#delete_multiple_notes').fadeIn();
		}
		if( isAtLeastOneCheckboxChecked( "input.check_note" ) == true )
		{
			$("span#delete_multiple_notes").fadeIn();
		}
		else
		{
			$("span#delete_multiple_notes").hide();
		}
	});
	//Checking whether all checkboxes are checked then
	//main checkbox should also be checked otherwise unchecked.
	$("input.check_note").click(function()
	{
		var isAllChecked = isAllCBChecked("input.check_note");
		if( isAllChecked == 1 )
		{
			$("input#check_all_notes").prop('checked', true);
			 $('span#delete_multiple_notes').fadeIn();
		}	
		else 
		{
			$("input#check_all_notes").prop('checked', false);
			$('span#delete_multiple_notes').fadeOut();
		}
		if( isAtLeastOneCheckboxChecked( "input.check_note" ) == true )
		{
			$("span#delete_multiple_notes").fadeIn();
		}
		else
		{
			$("span#delete_multiple_notes").hide();
		}
	});
	//Opening confirm dialogbox onlick of delete button.
	//And checking whether any note is seleted or not.
    $('span#delete_multiple_notes').click(function(event)
    {  
    	var elem = $(this);
	    var notes_ids = [];
	    $('.check_note:checked').each(function(i)
	    {
	    	notes_ids[i] = $(this).val();
	    });
	    if(notes_ids.length>0)
	    {
	    	$( "div#dialog_confirm_delete_selected_notes" ).data('thiss',elem).dialog( "open" );
	    }
	    else
	    {
			// please select note..
			$(".alert-box").remove();
			$(".alert-box1").remove();
			$(".alert-box2").remove();
			showDefaultMsg( "Please select note from the list.", 2 );
	    }
    });
	  //Alert box for deleting multiple notes.
    $( "div#dialog_confirm_delete_selected_notes" ).dialog({
	      modal: true,
	      autoOpen: false,
	      draggable:false,
	      width: 520,
	      show: {
	    	  effect: "fade"
	    	  },
		  hide: {
			  effect: "fade"
			  },
	      buttons: {
	    		 OK: function() {
	 	    		$( this ).dialog( "close" );
	 	    		
	 	    		var notes_ids = [];
	 	    		$('.check_note:checked').each(function(i){
	 	    		notes_ids[i] = $(this).val();
	 	    		}); 
	 	    		
	 	    		deleteMultipleNotes(notes_ids, $(this).data('thiss')); 
	 	    		},
	 	    	 Cancel: {
	 	                 click: function () {
	 	                     $(this).dialog("close");
	 	                 },
	 	                 class: 'only_text',
	 	                 text : 'Cancel'
	 	             }
	      			}
    });
	//Modal message dialog-box----------
	$( "#dialog_confirm" ).dialog({
	      modal: true,
	      autoOpen: false,
	      width: 250,
	      show: {
	    	  effect: "fade"
	    	  },
		  hide: {
			  effect: "fade"
			  },
	      buttons: {
	    	'Cancel': {
	                 click: function () {
	                     $(this).dialog("close");
	                 },
	                 class: 'only_text',
	                 text : 'Cancel'
	             },
			'Delete': function(){
				 $( this ).dialog("close");
				deleteNote( $( this ).data('thisss') );
			}
	      }
	});

	// Applying ckeditor on edit button click
	$("span.edit_note").click(function()
	{  
		$('.editor_div').css('display','block');
		$("div#cke_editor1").hide();
		for ( var instance in CKEDITOR.instances ) 
		{
            CKEDITOR.instances[instance].updateElement(); 
        }
		var note_id = $( this ).attr("rel");
		var thiss = this;
		
		$("span.save_note").hide();
		$("span.edit_note").show();
		
		
//		$(thiss).parent("p.clickable_note").hide();
		var loading_img = addLoadingImage($(this),"before");
		$.ajax({
			async: false,
			url : "/" + PROJECT_NAME + "profile/get-current-note",
			method : "POST",
			data : { 'note_id' : $(this).attr("rel") },
			type : "post",
			dataType : "json",
			success : function(jsonData){
				
				
					$("span#"+loading_img).remove();
					$("div.clickable_note").show();
					$("div.formatted_full_note").hide();
//					$(thiss).parent("p.clickable_note").hide();
					$("div#clickable_note_"+note_id).hide();
					$("div#formatted_full_note_"+note_id).hide();
					$("div#formatted_full_note_1_"+note_id).hide();
					
//					$(thiss).siblings('p.clickable_note').hide();
					$(thiss).hide();
					$("div.editor_div").html("");
					$("div#editor_div_"+$(thiss).attr("rel")).html("<textarea class = 'editor1' id = 'editor1' name = 'editor1'></textarea>");
					$(thiss).siblings("span.save_note").fadeIn();  
					CKEDITOR.replace( 'editor1', {
							uiColor: '#6C518F',
							toolbar: [
										{ name: 'basicstyles', items : [ 'Bold','Italic','TextColor',"BGColor" ] },
										{ name: 'paragraph', items : [ 'NumberedList','BulletedList' ] },
									],
							removePlugins : 'elementspath'
					});
					CKEDITOR.instances.editor1.setData(jsonData);
					CKEDITOR.addCss(".cke_editable{background-color: #F2F2F2}");
//					CKEDITOR.editor1.resize( '75%', '75%');
				}
			});
		});
	
	//Save note from ckeditor
	$("span.save_note").click(function()
	{  
		var note_id1 = $(this).attr("rel");
		var thiss1 = this;
		var profile_user_id = $(this).attr("rel1");
        var txt = CKEDITOR.instances.editor1.getData();
		//checking the value inside editor.
//		var editor_val1 = CKEDITOR.instances.editor1.document.getBody().getChild(0).getText() ;;
        if(txt !=="" && txt.length != 0)
		{
			$(this).attr("disabled","disabled");
			var loading_img = addLoadingImage($(this),"before");
			jQuery.ajax({
		        url: "/" + PROJECT_NAME + "profile/save-note-in-editor",
		        type: "POST",
		        dataType: "json",
		        data: { "profile_user_id" : profile_user_id , "note" : txt },
		        timeout: 50000,
		        success: function(jsonData) {
		        	$('.editor_div').css('display','none');
		        	if(jsonData)
		        	{
		        		
		        		$("div#clickable_note_"+note_id1).hide();
		        		$(thiss1).hide();
		        		$(thiss1).siblings("span.edit_note").fadeIn();  
		        		$("span#"+loading_img).remove();
		            	
	//	            		$(".cke_inner cke_reset").hide();
		            		CKEDITOR.instances.editor1.destroy();
		            		$(".editor1").hide();
		            		if(jsonData.strip_note.length <= 140)
		            		{
		            			console.log("formatted"+jsonData.formatted_full_note);
		            			$("div#formatted_full_note_1_"+note_id1).fadeIn('slow');// To display the note paragraph again after editing and saving note.
		            			$("div#formatted_full_note_1_"+note_id1).html(jsonData.formatted_full_note);//To display the saved note in clickable p tag .
		            		
		            		}
		            		else
		            		{
		            			console.log("cropped"+jsonData.cropped_note);
		            			$("div#clickable_note_"+note_id1).fadeIn('slow');// To display the note paragraph again after editing and saving note.
		            			$("div#clickable_note_"+note_id1).html(jsonData.cropped_note+'<span onclick="showMoreNote(this);" title="show more" rel="'+note_id1+'" id="show_more_'+note_id1+'" class="show_more">More>></span>');//To display the saved note in clickable p tag .
		            			
		            			$("div#formatted_full_note_"+note_id1).html(jsonData.formatted_full_note+'<span title="show less" onclick="showLessNote(this);" rel="'+note_id1+'" id="show_less_'+note_id1+'" class="show_less">&lt;&lt;Less</span>');//To display the saved note in clickable p tag .
		            		}
		            		$(".alert-box").remove();
		            		$(".alert-box1").remove();
		        			$(".alert-box2").remove();
		        			showDefaultMsg( "Note saved successfully.", 1 );
		            		$(thiss1).removeAttr('disabled');
		            	}
		            
		            },
		        error: function(xhr, ajaxOptions, thrownError) {
					alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
				}
			 });
		}
		else
		{
			alert("You cannot make an empty note. Please insert some text.");
			
		}
			
	});
	
	
	$('span.delete_note').click(function()
	{	
		$( "#dialog_confirm" ).data( 'thisss', $(this) ).dialog( "open" );
	});
    //Hiding editor on esc key click.
    $( document ).on( 'keydown', function ( e ) 
    {
    	var elem = $("div#cke_editor1");
        if ( e.keyCode === 27 ) {
            $( elem ).hide();
            $(elem).parent().parent().children('p.clickable_note').show();
    		$(elem).parent('.editor_div').siblings('.fr').children('#edit_notes_form').children('.edit_delete_note').children('span[name=save_note]').hide();
    		$(elem).parent('.editor_div').siblings('.fr').children('#edit_notes_form').children('.edit_delete_note').children('span[name=edit_note]').show();
        }
    });
	
});
/**
 * showing full note in its actual formatted form
 * on click of the note that is shown as plain cropped text.
 * @param elem (control which is clicked to
 */
function showMoreNote(elem)
{
		var note_id = $(elem).attr('rel');
		$(elem).parent('div#clickable_note_'+note_id).hide();
		$(elem).parent('div#clickable_note_'+note_id).siblings('div#formatted_full_note_'+note_id).fadeIn(1000);
		

}
/**
 * Show cropped text on clicking 'less'.
 * @param elem(control that is clicked to show less text)
 */
function showLessNote(elem)
{
		var note_id = $(elem).attr('rel');
		$(elem).parent('div#formatted_full_note_'+note_id).hide();
		$(elem).parent('div#formatted_full_note_'+note_id).siblings('div#clickable_note_'+note_id).fadeIn(1000);

}
/**
 * Deletes Note.
 * @param Object of button on click which dialog opens.
 * 
 * @author hkaur5
 * 
 */
function deleteNote( elem )
{
		var thissss = elem;
		var loading_img = addLoadingImage(thissss, "after");
		$.ajax({
			url : "/" + PROJECT_NAME + "profile/delete-current-note",
			method : "POST",
			data : { 'note_id' : thissss.attr("rel") },
			type : "post",
			dataType : "json",
			success : function(jsonData)
			{
				if(jsonData.msg=="success")
				{
					 window.location.href=document.documentURI;
//					 $("span#"+loading_img).remove();
//					 $("div.alert-box").remove();
//					 showDefaultMsg( "Your note has been deleted.", 1 );
//
//					 $(thissss).parents("div.mail-grey-hdr-col1").remove();
				}
				else
				{
					 window.location.href=document.documentURI;
				}
			}
		});
}
/**
 * Deleting multiple notes seleted.
 * @author hkaur5
 * @param array notes_ids
 */
function deleteMultipleNotes(notes_ids, delete_button )
{
	$(delete_button).hide();
	var loading_img1 = addLoadingImage(delete_button, "after",'loading_small_purple.gif', 0, 20);
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/delete-multiple-notes",
		method : "POST",
		data : "notes_ids="+notes_ids,
		type : "post",
		dataType : "json",
		beforeSend: function(){
			
		},
		success : function(jsonData) {
			if(jsonData.msg=="success"){
				 window.location.href=document.documentURI;
			}
			else{
				 window.location.href=document.documentURI;
			}
		}
	});	
}