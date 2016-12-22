// To check is window is focused or not.
var window_focus;

$(window).focus(function() {
    window_focus = true;
}).blur(function() {
    window_focus = false;
});

//code for icontains make working
jQuery.expr[":"].icontains = jQuery.expr.createPseudo(function (arg) {                                                                                                                                                                
    return function (elem) {                                                            
        return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;        
    };                                                                                  
});

/*
* jQuery.ajaxQueue - A queue for ajax requests
* 
* (c) 2011 Corey Frang
* Dual licensed under the MIT and GPL licenses.
*
* Requires jQuery 1.5+
*/ 
(function($) {

// jQuery on an empty object, we are going to use this as our Queue
var ajaxQueue = $({});

$.ajaxQueue = function( ajaxOpts ) {
    var jqXHR="",
        dfd = $.Deferred(),
        promise = dfd.promise();

    // queue our ajax request
    ajaxQueue.queue( doRequest );

    // add the abort method
    promise.abort = function( statusText ) {

        // proxy abort to the jqXHR if it is active
        if ( jqXHR ) {
            return jqXHR.abort( statusText );
        }

        // if there wasn't already a jqXHR we need to remove from queue
        var queue = ajaxQueue.queue(),
            index = $.inArray( doRequest, queue );

        if ( index > -1 ) {
            queue.splice( index, 1 );
        }

        // and then reject the deferred
        dfd.rejectWith( ajaxOpts.context || ajaxOpts,
            [ promise, statusText, "" ] );

        return promise;
    };

    // run the actual query
    function doRequest( next ) {
        jqXHR = $.ajax( ajaxOpts )
            .done( dfd.resolve )
            .fail( dfd.reject )
            .then( next, next );
    }

    return promise;
};

})(jQuery);



$(document).ready(function(){
	
	//Menu tabs UI handling.
	$("#adminmenu li").mousedown(function(event){
		switch (event.which) {
        case 1:
        	$("#adminmenu li").removeClass('active');
        	$(this).addClass('active');
            break;
            }
	});
	
	
	//For show and hiding messages--
	setTimeout(function() {
    	$("div.alert-box").fadeOut(function(){
    		$(this).remove();
    	});
    }, 15000);
	
	//click on close button of alert box
	$("div#message_holder").on('click', "div.alert-box", function() {
		$(this).fadeOut(function(){
    		$(this).remove();
    	});
	});
	//------------------------------
	
	
	/*
     * This addMethod can be used for to check HTML tags not allowed
     * 
     * @author jsingh7
     */	 
	jQuery.validator.addMethod("noHTML", function(value, element) {
	    // return true - means the field passed validation
	    // return false - means the field failed validation and it triggers the error
	    return this.optional(element) || /^([a-z0-9]+)$/.test(value);
	}, "No HTML tags are allowed!");
	/*
     * This addMethod can be used for multiple emails semicolon seprated.
     * spaces betweem emails and semicolons are allowed and should be handled at server side.
     * 
     * @author jsingh7
     */	 
	$.validator.addMethod("multiemail", function(value, element) {
         if (this.optional(element)) {
             return true;
         }
         var emails = value.split( new RegExp( "\\s*;\\s*", "gi" ) );
         valid = true;
         for(var i in emails) {
             value = emails[i];
             valid=valid && jQuery.validator.methods.email.call(this, value,element);
         }
         return valid;}, "Invalid email format");
	
    /*
     * @author jsingh7
     */
    $.validator.addMethod("noSpace", function(value, element) { 
    	  return value.indexOf(" ") < 0; 
    	}, "No space please.");
    /*
     * @author jsingh7
     */
    $.validator.addMethod("alphaOnly", function(value, element) {
    	  return this.optional(element) || /^[a-z]+$/i.test(value);
    	}, "Letters only please.");
    
    /*
     * @author jsingh7
     */
    $.validator.addMethod("alphaWithSpace", function(value, element) {
    	  return this.optional(element) || /^[-\sa-zA-Z]+$/i.test(value);
    	}, "Letters only please."); 

    /*
     * @author jsingh7
     */
    $.validator.addMethod("ilook_admin_password", function(value, element) {
    	return this.optional(element) || /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).*$/i.test(value);
    }, 'Password must contain at least one alphabet, one number and one special character.');
    
    /*
     * @author jsingh7
     */
    $.validator.addMethod("alphanumericWithHyphensAndSpacesOnly", function(value, element) {
    	return this.optional(element) || /^[A-Za-z0-9\-\ ]+$/i.test(value);
    }, "Alphabets, numbers and hyphens only please."); 
    
    /*
     * To apply 'at least on field require' check.
     * can be used like this ( require_from_group: [1, ".search-one-textbox"] ).
     * Need to define group also (groups: { names: "first_name last_name" },)
     *
     * @author jsingh7
     */
    $.validator.addMethod("require_from_group", function (value, element, options) {
        var numberRequired = options[0];
        var selector = options[1];
        var fields = $(selector, element.form);
        var filled_fields = fields.filter(function () {
            // it's more clear to compare with empty string
            return $(this).val() != "";
        });
        var empty_fields = fields.not(filled_fields);
        // we will mark only first empty field as invalid
        if (filled_fields.length < numberRequired && empty_fields[0] == element) {
            return false;
        }
        return true;
        // {0} below is the 0th item in the options field
    }, jQuery.format("Please enter at least one field."));
    
    
    //click on close button of alert box
    $("a.close").click(function(){
    	$(this).parent().parent().slideUp(function(){
    		$(this).remove();
    	});
    });
        
    // For no after or before space accepting textfields
    $("input[input=text].no_around_space").keyup(function(){
    	this.value=this.value.trim();
    });	
});

/**
 * Clear all the data from form.
 * 
 * @param form selector
 * @author Jaskaran Singh
 * @since 8-oct-2012
 * @version 1.0
 */
function clear_form_elements(formm) {
	

    $(formm).find(':input').each(function () {
        switch (this.type) {
            case 'password':
            case 'select-multiple':
            case 'select-one':
            case 'hidden':
            case 'text':

            case 'textarea':
                $(this).val('');
                break;
            case 'checkbox':
            case 'radio':
                this.checked = false;
        }
    });

    $("input[name=to_date]").removeAttr("disabled");
}

/**
 * Common function for ajax call.
 *
 * @param URL
 * @param data010101
 * @param successFunc
 * @param errorFunc
 * @param timeOut
 * @returns jQuery.ajax object
 * @author jsingh7
 * @author jsingh7 [Made it more dynamic]
 * @version 1.1
 */
function AJAXCaller(URL, data010101, successFunc, errorFunc, timeOut, asyncValue ) {
	var xhr;
	errorFunc = typeof errorFunc !== 'undefined' ? errorFunc : errorHandle;
	timeOut = typeof timeOut !== 'undefined' ? timeOut : 50000;
	typeOfRequest = typeof typeOfRequest !== 'undefined' ? typeOfRequest : "POST";
	typeOfData = typeof typeOfData !== 'undefined' ? typeOfData : "json";
	asyncValue = typeof asyncValue !== 'undefined' ? asyncValue : true;
	xhr = jQuery.ajax({
		url: URL,
		type: typeOfRequest,
		dataType: typeOfData,
		data: data010101,
		cache: false,
		timeout: timeOut,
		success: successFunc,
		async: asyncValue,
		error: errorFunc
	});

	function errorHandle(xhr, ajaxOptions, thrownError) {
		//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
	}

	return xhr;
}

/**
 * Common function to add loading image.
 * Accepts three parameters elem, position, image_name.
 * 
 * Available images names are 'loading_small_purple.gif', 'loading_medium_purple.gif', 'loading_large_purple.gif', 'loading_small_black.gif', 'loading_medium_black.gif', 'loading_large_black.gif', 'loading_small_black_purple.gif', 'loading_medium_black_purple.gif', 'loading_large_black_purple.gif', 'tiny_loader.gif' 
 *
 * @param elem
 * @param position ("before", "after")
 * @param image_name (optional)
 * @param width (optional) else it will take 0px
 * @param height (optional) else it will take 0px
 * @param additional_class
 * @returns span's id
 * @author jsingh7
 * @since 19-June-2013
 * @version 1.0
 * 
 */
function addLoadingImage(elem, position, image_name, width, height, additional_class)
{
	image_name = typeof image_name !== 'undefined' ? image_name : "loading_small_purple.gif";
	width = typeof width !== 'undefined' ? width : "0";
	height = typeof height !== 'undefined' ? height : "0";
	additional_class = typeof additional_class !== 'undefined' ? additional_class : "";
	
	var unique_num = new Date().getTime();
	
	var obj = "<span class = 'loading "+additional_class+"' id = '"+unique_num+"' ><table><tr><td style = 'width:"+width+"px; height:"+height+"px'><img src = '/" + PROJECT_NAME + "public/images/" + image_name + "' alt = 'Wait...' /></td></tr></table></span>";
	
	
	elem.siblings("span.loading").remove();
	if( position == "before" )
	{
		$(obj).insertBefore( elem );
	}
	else if( position == "after" )
	{
		$(obj).insertAfter( elem );
	}
	return unique_num;
}

/**
 * clear validation messages from form
 * and remove error class from input tags etc.
 *
 * @param object [Form and its set of rules] 
 * @author jsingh7
 * @since 20-June-2013
 * @version 1.0
 */
function removeFormValidationMessages( formObj )
{
	formObj.resetForm();
	$("input.error").removeClass("error");
	$("select.error").removeClass("error");
	$("textarea.error").removeClass("error");
}


/**
 * Commom function for jquery UI autocomplete.	
 *
 * @param selector, url, min_length(int)(optional)
 * @author jsingh7
 * @version 1.0
 */
function autoComplete( selector, url, min_length)
{
	min_length = typeof min_length !== 'undefined' ? min_length : 1;
	var cache = {};
	$( selector ).autocomplete({
		minLength: min_length,
		source: function( request, response ) {
		var term = request.term;
		if ( term in cache ) {
		response( cache[ term ] );
		return;
		}
		$.getJSON( url, request, function( data, status, xhr ) {
		cache[ term ] = data;
		response( data );
		});
		}
	});
}

/**
 * Common function to check any field is empty or not with in the form or div etc
 * 
 * @author jsingh7
 * @version 1.0
 */
function checkFormHasValues( selector ){
	var i=0;
	$(selector+" :text, :file, :checkbox, select, textarea").each(function() {		
		if(($(this).is(":checkbox") && !$(this).is(":checked")) || $.trim($(this).val()) === "")
		    {
				i=i+1;
		    }
		});
	return i;
}

/**
 * returns no of controls in the form.
 * 
 * @author jsingh7
 * @version 1.0
 */
function checkNumberOfFields( selector ){
	var i=0;
	$(selector+" :text, :file, :checkbox, select, textarea").each(function() {		
		i=i+1;
	});
	return i;
}

/**
 * Function used to check, that are all checkboxes are checked or not.
 * 
 * @author jsingh7
 * @param all_checkboxs (common selector of all checkboxes in list)
 * @version 1.0
 * @returns boolean
 */
function isAllCBChecked( all_checkboxs )
{
    if (!$(all_checkboxs+':not(:checked)').length == true) // Is all checked
    {
        return 1;
    } 
    else 
    {
        return 0;
    }
}

/**
 * For no after or before space accepting textfields
 * 
 * @param selector of container tag
 * @author jsingh7
 * @version 1.0
 */
function no_around_spaces( selector )
{
	$( selector+">input[type=text]" ).keyup(function(){
		this.value=this.value.trim();
	});
}

/**
 * Pops up the jquery UI dialog
 * anywhere any time you want.
 * 
 * @param string heading
 * @param string message
 * @param integer hide_after_duration in miliseconds [if 0 then do not hide.]
 * @param JSON settings_json
 * <code>
 * for e,g.
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
	    width: 300
	}
 * </code>
 * @return unique id of dialog div.
 * @author jsingh7
 * @see http://api.jqueryui.com/dialog/
 */
function showDialogMsg( heading, message, hide_after_duration, settings_json )
{
	$("div.main_content_holder div.general_dialog_message").remove();

	var curr_timestp = jQuery.now();
	
	var dialog_html = "<div id = '"+curr_timestp+"' class='general_dialog_message' title='"+heading+"'>"+message+"</div>";
	
	$("div.main_content_holder").append( dialog_html );
	
	
	$("div.main_content_holder div.general_dialog_message").dialog(settings_json);
	//Open dialog.
	$( "div.main_content_holder div.general_dialog_message" ).dialog( "open" );

	if( hide_after_duration != 0 )
	{
		$("div#"+curr_timestp)
		.delay(hide_after_duration)
		.queue(function(){
			$( this )
			.dialog( "close" )
			.dequeue(); // take this function out of queue a.k.a dequeue a.k.a notify done
			// so the next function on the queue continues execution...
		});
	}
	
	return curr_timestp;
}


/**
 * Checks that is at least one checkbox is selected.
 * 
 * @author jsingh7
 * @param selector ( common selctor of group of checkboxes )
 * @returns boolean
 */
function isAtLeastOneCheckboxChecked( selector )
{
	return $(selector+':checkbox').is(':checked');
}

/**
 * Survey on input value change.
 * 
 * @author jsingh7
 */ 
function surveyInput(selector, callback) {
	   var input = $(selector);
	   var oldvalue = input.val();
	   setInterval(function(){
	      if (input.val()!=oldvalue){
	          oldvalue = input.val();
	          callback();
	      }
	   }, 100);
}

/**
 * Returns broken string with symbol (...),
 * if length exceeds.
 *
 * @param string str
 * @param integer len
 * @param string tail
 * @author jsingh7
 * @version 1.0
 */
function showCroppedText(str, len, tail)
{
	len = typeof len !== 'undefined' ? len : 40;
	tail = typeof tail !== 'undefined' ? tail : "...";
	if( $.trim(str).length > len+1 )
	{
		return str.substr(0, len) + tail;
	}
	else
	{
		return str;
	}	
}

/**
 * Getting parameters from URL
 * using jQuery.
 * 
 * <samp>
 * "http://dummy.com/?technology=jquery&blog=jquerybyexample".
 * var tech = GetURLParameter('technology');
 * var blog = GetURLParameter('blog');
 * </samp>
 * 
 * @param sParam
 * @returns param value
 * @version 1.0
 * @author jsingh7
 */
function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

/**
 * This is a functions that scrolls to div with id #{blah}
 * 
 * @author jsingh7
 * @version 1.0
 * @param [for e.g. id of div]
 */ 
function goToByScroll(id){
      // Remove "link" from the ID
    id = id.replace("link", "");
      // Scroll
    $('html,body').animate({
        scrollTop: $("#"+id).offset().top},
        1500);
}

/**
 * nl2br function is used for retaining html tags into view pages  
 * @author nsingh3
 */
function nl2br (str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

/**
 * To show messages in the default way
 * on the top of the page.
 * 
 * @param string text
 * @param int type (1 = "success", 2 = "error", 3 = "warning", 4 = "notice")
 * @author jsingh7
 * @version 1.0
 * 
 */
function showDefaultMsg( text, type )
{
	var row = "";
	switch (type) 
	{
		case 1:
			row = '<div title = "Dismiss" class="alert-box success_messg"><span>success: </span>'+text+'</div>';
			break;
		case 2:
			row = '<div title = "Dismiss" class="alert-box error_messg"><span>Error: </span>'+text+'</div>';
			break;
		case 3:
			row = '<div title = "Dismiss" class="alert-box warning_messg"><span>Warning: </span>'+text+'</div>';
			break;
	
		case 4:
			row = '<div title = "Dismiss" class="alert-box notice_messg"><span>Notice: </span>'+text+'</div>';
		break;
	}
	
	row = $(row);
	$("div#message_holder").prepend(row);
	
	//click on close button of alert box
	$("div#message_holder").on('click', "div.alert-box", function() {
		   $(this).fadeOut(function(){
    		$(this).remove();
    	});
	});
	
    setTimeout(function() 
    {
    	row.fadeOut(function(){
    		$(this).remove();
    	});
    }, 15000);
}

/**
 * Strip html from string
 * @param string
 * @returns string without html
 * @author hkaur5
 */
function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

