$(document).ready(function()
{
	$("#dashboard_post").click(function()
	{
		$(".post-box-display").hide();
		$(".post-box-dashboard").show();
		$('a#dashboard_post').addClass('selected_underlined');
		$('a#display_post').removeClass('selected_underlined');
	});

	$("#display_post").click(function()
	{
		$(".post-box-dashboard").hide();
		$(".post-box-display").show();
		$('a#display_post').addClass('selected_underlined');
		$('a#dashboard_post').removeClass('selected_underlined');
	});
	
	$('#post-box-dashboard-textarea').bind('input propertychange', function (e) 
	{

		extractingUrl(); 
	});
	

	
	// create selected user array on add button in user list popup
	$('button#add_user').click(function(){
		$("input#selected_user_ids").val('');
		$("input#selected_user_ids_display").val('');
		var idArray = new Array();
		$i = 0;
		$("input.select_user_cb:checked").each(function ()
		{
			idArray[$i] = $(this).val();
		    $i++;
		    $("input#selected_user_ids").val(idArray.join(","));
		    $("input#selected_user_ids_display").val(idArray.join(","));
		});
		
	});
	
	// create selected countries array on add button in country list popup
	$('button#add_country').live("click",function(){
		$("input#selected_country_ids").val('');
		$("input#selected_country_ids_display").val('');
		var idArray = new Array();
		$i = 0;
		$("input.select_country_cb:checked").each(function ()
		{
			idArray[$i] = $(this).val();
		    $i++;
		    $("input#selected_country_ids").val(idArray.join(","));
		    $("input#selected_country_ids_display").val(idArray.join(","));
		});
		
	});

	
	
	//---------------------------------------------------------------------------
	// POST PHOTOS TO SOCIALISE WALL SECTION STARTS
	//---------------------------------------------------------------------------
	
	// Confirmation message, if photos uploaded but not posted.
	window.onbeforeunload = function (e) {
		if( $("table[role=presentation] div.template-download").length > 0 )
		{
			var message = "Do you really want to navigate from this page without posting your post?",
			e = e || window.event;
			// For IE and Firefox
			if (e) {
				e.returnValue = message;
			}
			// For Safari
			return message;
		}
	}
	
	//On window unload remove all the temp images( uploaded but not posted on wall )
	$( window ).unload(function() {
		if( $("table[role=presentation] div.template-download").length > 0 )
		{
		    $.ajax(
		    {
		        async: false,
		        url : "/" + PROJECT_NAME + "admin/manage-users/remove-temp-folder-n-data"
			});
	    	
		};
	});
	
	//Switching between "Add Photos" and "Create Album".
	$('div.fileupload-buttons input#add_photos').click(  
			function()
			{
				$("div.fileupload-buttons input#album_title").hide();
				$("div.fileupload-buttons input#just_photos_or_photo_album").val(1);
			}
	);
	$('div.fileupload-buttons input#create_album').click(  
			function()
			{
				$("div.fileupload-buttons input#album_title").fadeIn();
				$("div.fileupload-buttons input#just_photos_or_photo_album").val(2);
			}
	);
	
	//Set option form ajax form.
	var options = 
	{
	        beforeSubmit:  showRequest,  // pre-submit callback 
	        success:       showResponse,  // post-submit callback 
	        dataType : 'json',
	        clearForm : true,
	        data : {},
	        url:       '/'+PROJECT_NAME+'admin/manage-users/post-photos', // override for form's 'action' attribute 
	        dataType:  'json'        // 'xml', 'script', or 'json' (expected server response type) 
	    };

	    // bind form using 'ajaxForm'
	    $('#photo_feed').ajaxForm(options);
	    
	    // On click of share button.
	    $("form#photo_feed input#share").click(function()
	    {
	    	//Check if album title input is 'visible' and it is empty then show alert and stop the code.
	    	if( $('form#fileupload_admin span input#album_title').is(":visible") && $('form#fileupload_admin span input#album_title').prop('value') == "" )
	    	{
	    		showDefaultMsg('Oops! Your album is untitled. Please add name for the album.', 2);
	    		return;
	    	}
	    	if($( "select.share_users_display option:selected").val()== 2 && $('input#selected_user_ids_disaplay').val() == "") // specific users
			{
				showDefaultMsg("Please select atleast one user to proceed.", 2);
				openUserList();
				return;
			}
			else if ($( "select.share_users_display option:selected").val()== 3 && $('input#selected_country_ids_display').val() == "") // countries selected.
			{
				showDefaultMsg("Please select atleast one country to proceed.", 2);
				openCountryList();
				return;
			}
	    	//If there are some images in presentation div.
	    	if( $("table[role=presentation] div.template-download span.preview img").length > 0 )
	    	{
	    		//Change button text and disable it.
	        	$(this).val('sharing');
	        	$(this).attr('disabled','disabled');
	        	options.data.photos_text = $("form#fileupload_admin textarea#photo_text").val();

	        	//if add album option is chosen.
	            if( $("div.fileupload-buttons input#just_photos_or_photo_album").val() == 2 )
	            {
	            	options.url = '/'+PROJECT_NAME+'admin/manage-users/post-album';
	            	options.data.album_title = $('form#fileupload_admin input#album_title').val();
	            }
	            else if( $("div.fileupload-buttons input#just_photos_or_photo_album").val() == 1 )
	            {
	            	options.url = '/'+PROJECT_NAME+'admin/manage-users/post-photos';
	            }	
	        	
	        	$('form#photo_feed').submit();
	    	}
	    	else
	    	{
	    		showDefaultMsg('Please add photo(s) to post on wall.', 2);
	    	}	
	    });
	//---------------------------------------------------------------------------
	// POST PHOTOS TO SOCIALISE WALL SECTION ENDS
	//---------------------------------------------------------------------------
	
	//----------------------------------------------------------------   
	//click on remove button 'cross', to remove extracted URL content.  
    //----------------------------------------------------------------   
	$("div.urlResult").on( "click","img.close_url",function(){
			$('div.urlResult').hide();
			$('input#hidden_url_title').val("");
			$('input#hidden_url_content').val("");
			$('input#hidden_is_url').val(0);
			$('input#hidden_url').val("");
	});
	
	//show cross image.
	$("div.urlResult").mouseover(function(){
		$('img.close_url').css("visibility","visible");
	});
	
	//hide cross image
	$("div.urlResult").mouseout(function(){
		$('img.close_url').css("visibility","hidden");
	});
	
});

function extractingUrl()
{
	var getUrl  = $('#post-box-dashboard-textarea'); //url to extract from text field
	//user types url in text field		
	
	//url to match in the text field
	var match_url = /\b(https?):\/\/([\-A-Z0-9.]+)(\/[\-A-Z0-9+&@#\/%=~_|!:,.;]*)?(\?[A-Z0-9+&@#\/%=~_|!:,.;]*)?/i;
	
	//returns true and continue if matched url is found in text field
	if (match_url.test(getUrl.val())) 
	{
		$("#results").hide();
		$("#loading_indicator").show(); //show loading indicator image
		var extracted_url = getUrl.val().match(match_url)[0]; //extracted first url from text field
			
		//ajax request to be sent to extract-process.php
		$.post('/'+PROJECT_NAME+'admin/manage-users/extract-url',{'url': extracted_url}, function(data)
		{       
			if( data == 0 )
			{
				$("#loading_indicator").hide(); //show loading indicator image
				return;
			}
			
			//Putting the values of url;- title and content into hidden fields.
			$('input#hidden_url_title').val(data.title);
			$('input#hidden_url_content').val(data.content);
			$('input#hidden_url').val(data.url);
			
			//checking wheteher the text is url and then settiing the value of hidden feild is_url.
			if(data)
			{
				$('input#hidden_is_url').val(1);
			}
			else
			{
				$('input#hidden_is_url').val(0);
			}
			extracted_images = data.images;
			total_images = parseInt(data.images.length-1);
			img_arr_pos = total_images;
			
			if(total_images>0)
			{
				inc_image = '<div class="extracted_thumb" id="extracted_thumb"><img src="'+data.images[img_arr_pos]+'" width="100" height="100"></div>';
			}
			else
			{
				inc_image ='';
			}
			
			//content to be loaded in #results element
			var content = '<div class = "extracted_url">'+ inc_image +'<div class="extracted_content"><h4><a class="text-dark-purple" href="'+extracted_url+'" target="_blank">'+data.title+'</a><img title = "remove" class = "close_url"  src ="'+IMAGE_PATH+'/cross-grey.png"/></h4><p>'+data.content+'</p>';
			if(total_images>0)
			{
				content += '<div class="thumb_sel"><span class="prev_thumb" id="thumb_prev">&nbsp;</span><span class="next_thumb" id="thumb_next">&nbsp;</span> </div><span class="small_text" id="total_imgs">'+img_arr_pos+' of '+total_images+'</span><span class="small_text">&nbsp;&nbsp;Choose a Thumbnail</span>';
			}			
			content += '</div></div>';
			
			//load results in the element
			$("#results").html(content); //append received data into the element
			$("#results").fadeIn("slow"); //show results with slide down effect
			$("#loading_indicator").hide(); //hide loading indicator image
		},'json');
	}



	//user clicks previous thumbail
	$("body").on("click","#thumb_prev", function(e){		
		if(img_arr_pos>0) 
		{
			img_arr_pos--; //thmubnail array position decrement
			
			//replace with new thumbnail
			$("#extracted_thumb").html('<img src="'+extracted_images[img_arr_pos]+'" width="100" height="100">');
			
			//show thmubnail position
			$("#total_imgs").html((img_arr_pos) +' of '+ total_images);
		}
	});
	
	//user clicks next thumbail
	$("body").on("click","#thumb_next", function(e){		
		if(img_arr_pos<total_images)
		{
			img_arr_pos++; //thmubnail array position increment
			
			//replace with new thumbnail
			$("#extracted_thumb").html('<img src="'+extracted_images[img_arr_pos]+'" width="100" height="100">');
			
			//replace thmubnail position text
			$("#total_imgs").html((img_arr_pos) +' of '+ total_images);
		}
	});
}


/**
 * function for opening user popup on selecting 'specific users' option 
 * from dropdown
 * @author sjaiswal
 * @version 1.0
 */
function openUserPopup(elem)
{
	elem = typeof elem !== 'undefined' ? elem : "";
	if(elem !="")
	{
		$('input#users_option').val($(elem).val());
	}
	$( "div#dialog_user_list" ).dialog( "close" );
	$( "div#dialog_country_list" ).dialog( "close" );
	// open user list on selecting option Specific users
	if ($('select.share_users option:selected').val() == 2 || $('select.share_users_display option:selected').val() == 2) 
	{
		openUserList();
	}
	
	if($('select.share_users option:selected').val() == 3 || $('select.share_users_display option:selected').val() == 3)
	{
		openCountryList();
	}
}


/**
 * function for posting on dasboard from admin 
 * @author sjaiswal
 * @version 1.0
 */
function postUpdateOnDashboardFromAdmin(elem)
{
		if( $("textarea#post-box-dashboard-textarea").val().trim != "" )
		{
			if( $("textarea#post-box-dashboard-textarea").val().trim() == "" )
			{
				showDefaultMsg("Please add some text to post an update.", 2);
				return;
			}
			
			if($( "select.share_users option:selected").val()== 2 && $('#selected_user_ids').val() == "") // specific users
			{
				showDefaultMsg("Please select atleast one user to proceed.", 2);
				openUserList();
				return;
			}
			else if ($( "select.share_users option:selected").val()== 3 && $('#selected_country_ids').val() == "") // countries selected.
			{
				showDefaultMsg("Please select atleast one country to proceed.", 2);
				openCountryList();
				return;
			}
	
			$(elem).val('sharing'); 
			$(elem).attr('disabled','disabled');
			jQuery.ajax({
		        url: "/" + PROJECT_NAME + "admin/manage-users/post-to-user-wall",
		        type: "POST",
		        dataType: "json",
		        data: { 'post_data' : $("textarea#post-box-dashboard-textarea").val(), 'privacy' : 3, 
		        		'is_url' : $("input[type=hidden]#hidden_is_url").val(),
		        		'url' : $("input[type=hidden]#hidden_url").val(), 
		        		'url_content' : $("input[type=hidden]#hidden_url_content").val(), 
		        		'url_title' : $("input[type=hidden]#hidden_url_title").val(), 
		        		'image_src' : $("div#extracted_thumb img").attr("src"),
		        		'selected_share_option':$( "select.share_users option:selected").val(),
		        		'selected_user_ids':$("input[type=hidden]#selected_user_ids").val(),
		        		'selected_country_ids':$("input[type=hidden]#selected_country_ids").val()
		        		 },
		       // timeout: 500000,
		        success: function( jsonData ) {
		        	$(elem).val('share');
					$(elem).removeAttr('disabled');
		        	//thiss.show(); // show share button
		        	//$("span#"+idd).remove(); // remove loading image
		        	$("textarea#post-box-dashboard-textarea").val(""); // empty post textarea
		        	closeUrl();
		        	if(jsonData == 1 )
		        	{
		        		showDefaultMsg( "Post has been posted on user(s) wall.", 1 );
		        	}
		        	else
		        	{
		        		showDefaultMsg( "Oops! an error occured. Please try again.", 2 );
		        	}
		        	
		        },
		        error: function(xhr, ajaxOptions, thrownError) {

		        }
			});
		}	
}

/**
 * closes the url div and sets the is_url to zero
 * and empties the value of url_title and url_commnent values.
 * @author hkaur5
 * @version 1.0
 */
function closeUrl()
{
	$('div.urlResult').hide();
	$('input#hidden_url_title').val("");
	$('input#hidden_url_content').val("");
	$('input#hidden_url').val("");
	$('input#hidden_is_url').val(0);
}

//pre-submit callback 
function showRequest(formData, jqForm, options) {
    // formData is an array; here we use $.param to convert it to a string to display it 
    // but the form plugin does this for you automatically when it submits the data 
//    var queryString = $.param(formData); 
    
    // jqForm is a jQuery object encapsulating the form element.  To access the 
    // DOM element for the form do this: 
    // var formElement = jqForm[0]; 
 
//    alert('About to submit: \n\n' + queryString); 
 
    // here we could return false to prevent the form from being submitted; 
    // returning anything other than false will allow the form submit to continue 
    return true; 
}
 
// post-submit callback 
function showResponse(responseText, statusText, xhr, $form)  {
    // for normal html responses, the first argument to the success callback 
    // is the XMLHttpRequest object's responseText property
 
    // if the ajaxForm method was passed an Options Object with the dataType 
    // property set to 'xml' then the first argument to the success callback 
    // is the XMLHttpRequest object's responseXML property
 
    // if the ajaxForm method was passed an Options Object with the dataType 
    // property set to 'json' then the first argument to the success callback 
    // is the json data object returned by the server

//    console.log('status: ' + statusText + '\n\nresponseText: \n' + responseText + 
//        '\n\nThe output div should have already been updated with the responseText.');
//    console.log(responseText);
    
	if( responseText == 1 )
    {
		//Empty div which contains photos.
    	$("form#fileupload_admin table[role=presentation] tbody.files").empty();
    	
    	showDefaultMsg( "Post has been posted on user(s) wall.", 1 );
    }
    else
    {
	    showDefaultMsg( "Oops! an error occured. Please try again.", 2 );
    }
	//Reset form.
	$('form#photo_feed').reset;
	
	//Reset share select dropdown.
	$('select.share_users_display').val("1");
	
	//Hide loading image.
	$('img.loading_options').hide();
	
	//Fade in button.
	$("form#photo_feed input#share").val('share');
	$("form#photo_feed input#share").removeAttr('disabled');
	
	//Empty values of album and photo_text textarea.
	$("form#fileupload_admin input#album_title").val("");
    $("form#fileupload_admin textarea#photo_text").val("");
}