var call_get_manage_tags;
var call_get_manage_groups;
var call_get_notification_count;
var read_notification_call;

var window_focus;

$(window).focus(function() {
    window_focus = true;
}).blur(function() {
    window_focus = false;
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
	
	//$("div#maximised_menu").css('display','none');
	
$(document).keyup(function(e) {
	  if (e.keyCode == 27) { 
		  $("div.imgareaselect-outer").remove();
			$("div.imgareaselect-selection").parent().remove();
	  }
});
	
//--------------------------------	
	//????? Who has added this code, I am going to comment this, date:12-feb-2015 ?????
	setTimeout(function() {
    	$("div.message_box").slideUp();
    }, 10000);
	
	//click on close button of alert box
	$("div.message_box").on('click', "a.close", function() {
		$(this).slideUp(function(){
    		$(this).remove();
    	});
	});


//Automated regular AJAX calls-----
if( $('input#autoAjaxCall[type=hidden]').val() == 1 )
{	
	showTotalUnreadMyMailCounts();
	//	iMail notification fill up using ajax.
	getLatestFiveImails();
	//	General notification fill up using ajax.
	getLatestSixNotifications();
	//  Code to check the focus on browser tab.
}

setInterval(function()
{
	if( window_focus && $('input#autoAjaxCall[type=hidden]').val() == 1 )
	{
		showTotalUnreadMyMailCounts();
		getLatestFiveImails();
		getLatestSixNotifications();
	}
}, 10000);//time in milliseconds
	
//---------------------------------	

	
	
	$('#closeTagPopup').click(function(){
		$("#tags-menu-popUp").fadeToggle('slow');
	});
	
	$('#closeGroupPopup').click(function(){
		$("#groups-menu-popUp").fadeToggle('slow');
	});
	//logo click
	$('.logo').click(function(){
		location.href = "/"+ PROJECT_NAME +"dashboard/index";
	});
	
	
//	iMail notification popup show/hide functionality.
	$(".mail_notifications_js").mouseover(function()
	{
		$("div#mail-notifi-count").css("visibility","hidden");
		$("div.header-inner-col2 div.header-inner-msg_js").addClass("dashboard-hdr-setting-2");
		$("div.header-inner-msg_js div.unread-mail-count-zero").addClass("dashboard-hdr-setting-2-no-unread-mail-count");
		
		$("div#mail-notifi-count").removeClass("notifi-count");
		$("div#mail-notifi-count").addClass("notifi-count-hover");
		$("div.notifi-count-outer-js").addClass("notifi-count-outer2");
		$("div.mail_notifications_js.notification-dd-outer_js").show();
		
	});
	
	//iMail notification hide count on hover.
	$(".mail_notifications_js").mouseenter(function()
	{
			seenImailMessages();
	});
	
	$(".mail_notifications_js").mouseout(function(){
		$("div#mail-notifi-count").addClass("notifi-count");
		$("div#mail-notifi-count").removeClass("notifi-count-hover");
		$("div.header-inner-col2 div.header-inner-msg_js").removeClass("dashboard-hdr-setting-2");
		$("div.header-inner-msg_js div.unread-mail-count-zero").removeClass("dashboard-hdr-setting-2-no-unread-mail-count");
		$("div.notifi-count-outer-js").removeClass("notifi-count-outer2");
		$("div.mail_notifications_js.notification-dd-outer_js").hide();
	});

	//General notification popup show/hide functionality.
	$(".general_notifications_js").mouseover(function(){
		
		//$("div#gen_notifi_count").css("visibility","hidden");
		$("div.header-inner-col2 div.header-inner-notification_js").addClass("dashboard-hdr-setting-2");
		$("div.header-inner-notification_js div.unread-mail-count-zero").addClass("dashboard-hdr-setting-2-no-unread-mail-count");
		$("div#gen_notifi_count").removeClass("notifi-count");
		$("div#gen_notifi_count").addClass("notifi-count-hover");
		$("div.gen-notifi-count-outer-js").addClass("notifi-count-outer2");
		$("div.general_notifications_js.gen_notification-dd-outer_js").show();
		
	});
	
//	General notification hide count on hover.
	$(".general_notifications_js").mouseenter(function(){
		seenGeneralNotifications();
	});
		
	
	$(".general_notifications_js").mouseout(function(){
		$("div#gen_notifi_count").addClass("notifi-count");
		$("div#gen_notifi_count").removeClass("notifi-count-hover");
		$("div.header-inner-col2 div.header-inner-notification_js").removeClass("dashboard-hdr-setting-2");
		$("div.header-inner-notification_js div.un read-mail-count-zero").removeClass("dashboard-hdr-setting-2-no-unread-mail-count");
		$("div.gen-notifi-count-outer-js").removeClass("notifi-count-outer2");
		$("div.general_notifications_js.gen_notification-dd-outer_js").hide();
	});

//	Settings in header, show/hide functionality.
	$(".settings").mouseover(function(){
		$(".showsettings").children().attr("src",IMAGE_PATH+"/settings-icon-hover.png");
		$(".showsettings").parent().removeClass("header-inner-col3");
		$(".showsettings").parent().addClass("dashboard-hdr-setting");
		$("#divSignIn").show();
	});
	
	$(".settings").mouseout(function(){
		$(".showsettings").children().attr("src",IMAGE_PATH+"/settings-icon.png");
		$(".showsettings").parent().removeClass("dashboard-hdr-setting");
		$(".showsettings").parent().addClass("header-inner-col3");
		$("#divSignIn").hide();
	});


	//MIDDLE MENU RIBBON HIDE SHOW CODE.
	$('div.profile-menu li.always_show').mouseover(function(){
		$(this).children('span.menu_large_item').show();
	});
	$('div.profile-menu li.always_show').mouseout(function(){
		$(this).children('span.menu_large_item').hide();
	});
	
	
	/*
     * This addMethod can be used for to check HTML tags not allowed
     * 
     * @author Sunny Patial
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
     * This addMethod can be used for password.
     * Password must contain at least one numeric and one alphabetic character.
     * 
     * @author jsingh7
     */
    $.validator.addMethod("ilook_password", function (value, element) {
        return this.optional(element) || (value.match(/[a-zA-Z]/) && value.match(/[0-9]/));
    },
        'Password must contain at least one numeric and one alphabetic character.');
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
    }, "Please enter at least one field.");
    
    
    //click on close button of alert box
    $("a.close").click(function(){
    	$(this).parent().parent().slideUp(function(){
    		$(this).remove();
    	});
    });
    
    //Menu resizing-----------------------
    //Maximising
    $("a#maximise_menu").click(function(){
		
    	//If user on dashboard.
    	if( $("input[type=hidden]#is_dashboard" ).val() == 1 )
    	{	
			//banner on dashboard
			$("div#minimize-menu-banner").slideUp(400, function(){
				$('div.links-banner').fadeIn();
				$('div.socialise-banner').fadeIn();
				$('div.socialise-banner-top').slideDown(400, function(){
					$('div.socialise-banner-top').css("visibility", "visible");
					$('div.socialise-banner-bot').css("visibility", "visible");
					$('div.socialise-banner-bot').fadeIn();
				});
				$('div.links-banner-top').slideDown(400, function(){
					$('div.links-banner-top').css("visibility", "visible");
					$('div.links-banner-bot').css("visibility", "visible");
					$('div.links-banner-bot').fadeIn();
				});
				
				$("div#minimised_menu").fadeOut(function(){
					$("div.content-right" ).removeClass('content-right-full');
					$(".dashboard-knw-adv-outer .left").css("width", "71%");
					$("#carousel1").css("padding", "0 0 0 12%");
					$("div#maximised_menu").fadeIn();
				});
			
			});
    	}
    	else
    	{
    		$("div#minimised_menu").fadeOut(function(){
    			if( $("input[type=hidden]#is_socialize" ).val() == 1 )
    			{
    				$("div#socialise-banner").addClass("socialise-banner2");
    				$("div#socialise-banner").removeClass("socialise-banner2-closed");
    			}	
				$("div.content-right" ).removeClass('content-right-full');
				$(".dashboard-knw-adv-outer .left").css("width", "71%");
				$("#carousel1").css("padding", "0 0 0 12%");
				$("div#maximised_menu").css("display", "table-cell");
//				$("div#maximised_menu").fadeIn();
			});
    	}
    });
    
    //Minimising
    $("div#minimise_menu").click(function(){
    	
    	
		$("div#maximised_menu").fadeOut(function(){
			if( $("input[type=hidden]#is_socialize" ).val() == 1 )
			{
				$("div#socialise-banner").addClass("socialise-banner2-closed");
				$("div#socialise-banner").removeClass("socialise-banner2");
			}
			$("div#minimised_menu").fadeIn();
			$("div.content-right" ).addClass('content-right-full');
			$(".dashboard-knw-adv-outer .left").css("width", "74.5%");
			$("#carousel1").css("padding", "0 0 0 18%");
			
			//banner on dashboard
			$('div.socialise-banner-top,div.socialise-banner').css("visibility", "hidden");
			$('div.links-banner-top,div.links-banner').css("visibility", "hidden");
			$('div.socialise-banner-bot').hide();
			$('div.links-banner-bot').hide();
			$('div.socialise-banner-top ,div.socialise-banner ').slideUp("400", function(){
			});
			
			$("div#minimize-menu-banner").fadeIn(300);
			$('div.links-banner-top, div.links-banner').slideUp("400", function(){
			});
		});
    	
    });
    //End menu resizing
    
    // For no after or before space accepting textfields
    $("input[input=text].no_around_space").keyup(function(){
    	this.value=this.value.trim();
    });

	// Calls the selectBoxIt method on your HTML select box
	$("select#advance_search_dd").selectBoxIt({theme: "jqueryui"});

    
    //Search box js
	$( "#advance-search-form" ).validate({
		rules: {
			search: {
				required: true
			}
		},
		messages: {
			search:{
				required:""
			}
		}
	});
	
	   //Search box js
	$( "#search-form" ).validate({
		rules: {
			linkSearch: {
				required: true
			}
		},
		messages: {
			linkSearch:{
				required:""
			},
		}
	});
	
	   //Search box js
	$( "#bookmark-frm" ).validate({
		rules: {
			bookmarkSearch: {
				required: true
			}
		},
		messages: {
			bookmarkSearch:{
				required:""
			},
		}
	});
	
	$("div#advance_search").on("click", function(event){
		if( $( "#advance-search-form" ).valid() )
		{
			advancesearchUser();
		}
	});
	
	
	$("#bksearch").on("click", function(event){
		if( $( "#bookmark-frm" ).valid() )
		{
			bookmarkSearch();
		}
	});
	
	
	
	//Minimised black bar tooltips.
	$("div#minimised_menu div ul li").mouseover(function(){
		$(this).children("span").show();
	});
	$("div#minimised_menu div ul li").mouseout(function(){
		$(this).children("span").hide();
	});
	
	// common search on right side of the whole project
	//change the form action as per selection of select box
	$("#advance_search_dd").change(function()
	{
		var formAction = '/'+PROJECT_NAME ;
		if(this.value == "jobs")
		{
			 $('form#advance-search-form').get(0).setAttribute('action', formAction+'job/search-jobs/');
			 $('a#advance_search_link').prop('href',"/" + PROJECT_NAME +"job/search-jobs");
		}
		else if(this.value == "skills")
		{
			$('form#advance-search-form').get(0).setAttribute('action', formAction+'skills/search-skills/');
			$('a#advance_search_link').prop('href',"/" + PROJECT_NAME +"skills/search-skills/");
		}
		else if(this.value == "people")
		{
			$('form#advance-search-form').get(0).setAttribute('action', formAction+'dashboard/search-results/');
			 $('a#advance_search_link').prop('href',"/" + PROJECT_NAME +"search/people");
		}
		else
		{
			 $('form#advance-search-form').get(0).setAttribute('action', formAction+'dashboard/search-results/');
			 $('a#advance_search_link').prop('href',"/" + PROJECT_NAME +"search/people");
		}
	});
	
	//	Settings menu
	$(".settings-outer-links a:first-child").on( "mouseenter", function() {
		$(this).parents("div.settings-outer").css("z-index", "999999999");
	});
	$(".settings-outer-links a:first-child").on( "mouseleave", function() {
		$(this).parents("div.settings-outer").css("z-index", "9999");
	});
	//	Settings menu
	$(".settings-outer-links a:first-child").on( "mouseenter", function() {
		$(this).parents("div.settings-outer").css("z-index", "999999999")
	});
	$(".settings-outer-links a:first-child").on( "mouseleave", function() {
		$(this).parents("div.settings-outer").css("z-index", "9999")
	});

	
});

/**
 * dissapear imail notification count.
 * @author sjaiswal
 * @version 1.0
 */
function seenImailMessages()
{
		$.ajaxQueue({
			url : "/" + PROJECT_NAME + "mail/set-imail-notification-seen",
			method : "POST",
			data :'',
			dataType : "json",
			success : function(jsonData) 
			{
				$('div#mail-notifi-count').css('visibility','hidden');
				$('div.mail_notifications_js').addClass('unread-mail-count-zero');
			}
	
	});
	
}
/**
 * Set notification status of notification to read.
 * @author hkaur5
 * @param integer notification_id
 */
function readNotifications( my_notification_id, notification_status )
{
		if(!notification_status)
		{
				read_notification_call = $.ajax({
				async : false,
				url : "/" + PROJECT_NAME + "notifications/set-notification-status-read",
				method : "POST",
				data :{'id': my_notification_id },
				dataType : "json",
				success : function(jsonData) 
				{
				if( jsonData['unread_notifications'] && jsonData['unread_notifications']!=0 )
				{
//					$('div#gen_notifi_count').css('visibility','visible');
					$('div.general_notifications_js').removeClass('unread-mail-count-zero');
					 
				}
				else if (jsonData['unread_notifications'] == 0)
				{
//					$('div#gen_notifi_count').css('visibility','hidden');
					$('div.general_notifications_js').addClass('unread-mail-count-zero');
				}
			}
		});
		}
}

/**
 * Set general notification status to seen.
 * @author sjaiswal
 */
function seenGeneralNotifications()
{
	read_notification_call = $.ajax({
		url : "/" + PROJECT_NAME + "notifications/set-general-notification-seen",
		method : "POST",
		data :'',
		dataType : "json",
		success : function(jsonData) 
		{
			$('div#gen_notifi_count').css('visibility','hidden');
			$('div.general_notifications_js').addClass('unread-mail-count-zero');
		
		}
});
	
}
/**
 * Submits search box.
 * 
 * @author sunny patial
 */
function advancesearchUser(){
	$("#advance-search-form").submit();
}

function searchUser()
{
	$("#search-form").submit();
}

function bookmarkSearch(){
	$("#bookmark-frm").submit();
}

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
function AJAXCaller(URL, data010101, successFunc, errorFunc, timeOut, typeOfRequest, typeOfData, asyncValue ) {
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
 * @author jsingh7, sunny patial
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
 * @author jsingh7, sunny patial
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
 * Function used to check that 
 * is all checkboxes checked or not.
 * 
 * @param selector of checkboxes with same class, such as $("div#abc input.cb")
 * @returns boolean
 * @author jsingh7
 * @version 1.0
 */
function isAllChecked( selector ) 
{
    if (!$( selector+':not(:checked)').length == true) // Is all checked
    {
        return true;
    } else {
        return false;
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
 * To show messages in the default way
 * on the top of the page.
 * 
 * @param string text
 * @param int type (1 = "success", 2 = "error", 3 = "warning")
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
		row = "<div class='alert-box message_box'>";
		break;
	case 2:
		row = "<div class='alert-box1 message_box'>";
		break;
	case 3:
		row = "<div class='alert-box2 message_box'>";
		break;

	default:
		row = "<div class='alert-box message_box'>";
		break;
	}
	row += "<div class='alert-cross'><a href='javascript:;' class = 'close'><img src='/"+PROJECT_NAME+"public/images/cross-white.png' alt='Close' title='Close' width='9' height='8'/></a></div>";
	row += "<div class='alert-message'>"+text+"</div>";
	row += "</div>";
	row = $(row);
	$("div.before_msg").after(row);
	
	//Smooth scrolling top.
	$('html, body').stop().animate({
        scrollTop: 0
    }, 1500);
	
	//click on close button of alert box
	$("div.message_box").on('click', "a.close", function() {
		$(this).parents("div.message_box").slideUp(function(){
    		$(this).remove();
    	});
	});
	
    setTimeout(function() 
    {
    	row.slideUp(function(){
    		$(this).remove();
    	});
    }, 10000);
}

/**
 * Pops up the jquery UI dialog
 * anywhere any time you want.
 * 
 * dialogClass:"fixed" for fixing dialog box on page.
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



function share_twitter(share_link){
	//We tell our browser not to follow that link
	// e.preventDefault();
	 
	//We get the URL of the link
	var loc = share_link;
	 
	//We get the title of the link
	var title = escape($("#sharetxt").val());
	 
	//We trigger a new window with the Twitter dialog, in the middle of the page
	window.open('http://twitter.com/share?url=' + loc + '&text=' + title + '&', 'twitterwindow', 'height=450, width=550, top='+($(window).height()/2 - 225) +', left='+$(window).width()/2 +', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
}
/**
 * function used to show navigation tag popup
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function loadTagPopup(event)
{
	$(".manage-pop-outer").hide();
	var uid=event.id;
	var attr = $(event).attr('show');
	if (typeof attr !== 'undefined' && attr !== false) {
		// ...... not going for server request...
		var element = $("#tags-menu-popUp");
		element.fadeToggle('slow');
	}
	else{
		// remove attribute onclick...
    	$("[name="+event.name+"]").removeAttr("onclick");
		// ..... going for server request...
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "links/get-manage-tags",
	        type: "POST",
	        dataType: "json",
	        data: { "user_id" : uid },
	        timeout: 50000,
	        beforeSend: function(){
	        	// embed loading image file..
	    		var loadingHtml = '<div id="loading" style="display:table-cell;width:170px;height:195px;text-align:center;vertical-align:middle;padding-left:0px;margin-top:89px;">';
	    		loadingHtml += '<img src="'+IMAGE_PATH+'/loading_medium_purple.gif">';
	    		loadingHtml += '</div>';
	    		$(".tags-menu-listing-addnewTag").append(loadingHtml);
	    		$("#tags-menu-popUp").fadeToggle('slow');
	    	},
	        success: function(jsonData) {
	        	if(jsonData.length>0){
		        	html="";
		        	html+='<div class="group-popup-top">';
		        	html+='<input maxlength="124" type="text" style="width:95%;" name="grp-nav-title">';
		        	html+='<input id="'+uid+'" type="button" name="nav-grp-btn" onclick="addMenuTag(this)" value="+ Add Tag" class=" btn-blue mt5 job-popup-btn" alt="+ Add Tag" title="Add Tag">';
		        	html+='</div>';
		            
		        	html+='<div class="grouplist">';
		        	html+='<div class="group-popup-mid" style="overflow-y:auto;">';
		        	html+='<form name="grp-form" id="grp-form" method="post" action="">';
		        	var j=0;
		        	for(var i=0;i<jsonData.length;i++){
		        		
		        	html+='<div class="group-popup-col1" id="grp_'+jsonData[i]["tag_id"]+'">';
		        	html+='<div class="editpop-cross">';
		        	html+='<img title="Delete tag" id="imggrp_'+jsonData[i]["tag_id"]+'" onclick="removeTg(this)" uid="'+uid+'" grpid="'+jsonData[i]["tag_id"]+'" height="8" align="absmiddle" src="/'+PROJECT_NAME+'public/images/cross-grey.png">';
		        	html+='</div>';
		        	html+='<div class="group-popup-col1-text">';
		        	html+='<span class="menu-span" title="Click to Rename it" style="padding-left:7px; background:none;" id="span_'+jsonData[i]["tag_id"]+'" rel="'+jsonData[i]["tag_id"]+'">';
		        	var tTitle = jsonData[i]["tag_title"];
		        	if(tTitle.length>19){
		        		html+=tTitle.substr(0,19)+"...";
		        	}
		        	else{
		        		html+=tTitle;	
		        	}
		        	tTitle = tTitle.substr(0,124);
		        	html+='</span>';
		        	html+='<input class="menu-span2" style="width:115px;display:none;height:16px;margin-left:2px;" type="text" onKeyPress="check_length(this)" onKeyDown="check_length(this)" id="txtgrp_'+jsonData[i]["tag_id"]+'" name="txtgrp_'+jsonData[i]["tag_id"]+'" rel="'+jsonData[i]["tag_id"]+'" value="'+tTitle+'" maxlength="124" onkeyup="assignGrpLabels(this)" />';
		        	html+='</div>';
		        	html+='</div>';

		        	}
		        	html+='</form>';
		        	html+='</div>';
		        	html+='<div class="group-popup-btn">';
		        	html+='<input type="button" value="Save" name="nav-grp-save" class="btn-blue mt5 job-popup-save-btn" alt="Update" title="Update" onclick="updateLabels()">';
		        	html+='</div>';
		        	html+='</div>';
		        	$("[name="+event.name+"]").removeAttr('disabled');
		        	$(".tags-menu-listing-addnewTag").empty();
		        	$(".tags-menu-listing-addnewTag").append(html);
		        	$(".grouplist").css("display","block");
		        	$(".tags-menu-listing-addnewTag").css("height","auto");
		        }else{
		        	$(".tags-menu-listing-addnewTag").css("height","54pspan_33x");
		        	html="";
		        	html+='<div class="group-popup-top">';
		        	html+='<input maxlength="124" type="text" style="width:95%;" name="grp-nav-title">';
		        	html+='<input id="'+uid+'" type="button" name="nav-grp-btn" onclick="addMenuTag(this)" value="+ Add Tag" class=" btn-blue mt5 job-popup-btn" alt="+ Add Tag" title="Add Tag">';
		        	html+='</div>';
		            
		        	html+='<div class="grouplist">';
		        	html+='<div class="group-popup-mid" style="overflow-y:auto;">';
		        	html+='<form name="grp-form" id="grp-form" method="post" action="">';
		        	
		        	html+='</form>';
		        	html+='</div>';
		        	html+='<div class="group-popup-btn">';
		        	html+='<input type="button" value="Save" name="nav-grp-save" class="btn-blue mt5 job-popup-save-btn" alt="Update" title="Update" onclick="updateLabels()">';
		        	html+='</div>';
		        	html+='</div>';
		        	
		        	$("[name="+event.name+"]").removeAttr('disabled');
		        	$(".tags-menu-listing-addnewTag").empty();
		        	$(".tags-menu-listing-addnewTag").append(html);
		        	$(".tags-menu-listing-addnewTag").css("height","auto");
		        }	
	        	// add attribute onclick...
	        	$("[name="+event.name+"]").attr("onclick","loadTagPopup(this);");
	        	$("[name=getnav]").attr("show","yes");
	        	$("[name=add_grptxt]").attr("show","yes");
	        },
	        error: function(xhr, ajaxOptions, thrownError) {
				alert("Server Error.");
			}
		 });
		
	}
}

/**
 * function used to show navigation bookmark popup
 * @author spatial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function loadBookmarkPopup(event)
{
	// hide textbox in the popup
	$(".menu-span2").hide();
	// display text...
	$(".menu-span").show();
	// hide manage  popups..
	$(".manage-pop-outer").hide();
	$("#tag-manage-outertags").hide();
	
	var uid=event.id;
	$('span.spanmsg').remove();
	var attr = $(event).attr('show');
	if (typeof attr !== 'undefined' && attr !== false) {
		// ...... not going for server request...
		$("#groups-menu-popUp").fadeToggle('slow');
	}
	else{
		// remove attribute onclick...
    	$("[name="+event.name+"]").removeAttr("onclick");
		// ..... going for server request...
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "bookmarks/get-manage-groups",
	        type: "POST",
	        dataType: "json",
	        data: { "user_id" : uid },
	        timeout: 50000,
	        beforeSend: function(){
	        	// embed loading image file..
	    		var loadingHtml = '<div id="loading" style="display:table-cell;width:170px;height:195px;text-align:center;vertical-align:middle;padding-left:0px;margin-top:89px;">';
	    		loadingHtml += '<img src="'+IMAGE_PATH+'/loading_medium_purple.gif">';
	    		loadingHtml += '</div>';
	    		$(".groups-menu-listing-addnewGroup").append(loadingHtml);
	    		$("#groups-menu-popUp").fadeToggle('slow');
	    	},
	        success: function(jsonData) {
	        	if(jsonData.length>0)
		        {
		        	$("#loading2_"+uid).css("display","none");
		        	html="";
		        	html+='<div class="group-popup-top">';
		        	html+='<input maxlength="124" type="text" style="width:95%;" name="grp-nav-title">';
		        	html+='<input id="'+uid+'" type="button" name="nav-grp-btn" onclick="addMenuGroup(this)" value="+ Add Group" class=" btn-blue mt5 job-popup-btn" alt="+ Add Group" title="Add Group">';
		        	html+='</div>';
		            
		        	html+='<div class="grouplist">';
		        	html+='<div class="group-popup-mid" style="overflow-y:auto;">';
		        	html+='<form name="grp-form" id="grp-form" method="post" action="">';
		        	var j=0;
		        	for(var i=0;i<jsonData.length;i++)
		        	{
			        	html+='<div class="group-popup-col1" id="grp_'+jsonData[i]["group_id"]+'">';
			        	html+='<div class="editpop-cross">';
			        	html+='<img   id="imggrp_'+jsonData[i]["group_id"]+'" onclick="removeGrp(this)" uid="'+uid+'" grpid="'+jsonData[i]["group_id"]+'" height="8" align="absmiddle" title="Hide comment"src="/'+PROJECT_NAME+'public/images/cross-grey.png">';
			        	html+='</div>';
			        	html+='<div class="group-popup-col1-text">';
			        	html+='<span class="menu-span GrpTxt" style="padding:0px;background:none;" title="Click to Rename it" id="span_'+jsonData[i]["group_id"]+'" rel="'+jsonData[i]["group_id"]+'">';
			        	var tTitle = jsonData[i]["group_title"];
			        	if(tTitle.length>19){
			        		html+=tTitle.substr(0,19)+"...";
			        	}
			        	else{
			        		html+=tTitle;	
			        	}
			        	tTitle = tTitle.substr(0,124);
			        	
			        	html+='</span>';
			        	html+='<input class="menu-span2 GrpInput" style="width:115px;display:none;height:16px;margin-left:2px;" type="text" rel1 = "" onKeyPress="check_length(this)" onKeyDown="check_length(this)"  id="txtgrp_'+jsonData[i]["group_id"]+'" name="txtgrp_'+jsonData[i]["group_id"]+'" rel="'+jsonData[i]["group_id"]+'" value="'+jsonData[i]["group_title"]+'" maxlength="124" onkeyup="assignGrpLabels(this)" />';
			        	html+='</div>';
			        	html+='</div>';
		        	}
		        	html+='</form>';
		        	html+='</div>';
		        	html+='<div class="group-popup-btn">';
		        	html+='<input type="button" value="Save" name="nav-grp-save" class="btn-blue mt5 job-popup-save-btn" alt="Update" title="Update" onclick="updateGroupLabels(this)">';
		        	html+='</div>';
		        	html+='</div>';
		        	$("[name="+event.name+"]").removeAttr('disabled');
		        	$(".groups-menu-listing-addnewGroup").empty();
		        	$(".groups-menu-listing-addnewGroup").append(html);
		        	$(".grouplist").css("display","block");
		        	$(".groups-menu-listing-addnewGroup").css("height","auto");
	        	}
	        	else
	        	{
	        		$(".tags-menu-listing-addnewTag").css("height","54pspan_33x");
	        		html="";
		        	html+='<div class="group-popup-top">';
		        	html+='<input maxlength="124" type="text" style="width:95%;" name="grp-nav-title">';
		        	html+='<input id="'+uid+'" type="button" name="nav-grp-btn" onclick="addMenuGroup(this)" value="+ Add Group" class=" btn-blue mt5 job-popup-btn" alt="+ Add Group" title="Add Group">';
		        	html+='</div>';
		            
		        	html+='<div class="grouplist">';
		        	html+='<div class="group-popup-mid" style="overflow-y:auto;">';
		        	html+='<form name="grp-form" id="grp-form" method="post" action="">';
		        	
		        	html+='</form>';
		        	html+='</div>';
		        	html+='<div class="group-popup-btn">';
		        	html+='<input type="button" value="Save" name="nav-grp-save" class="btn-blue mt5 job-popup-save-btn" alt="Update" title="Update" onclick="updateGroupLabels(this)">';
		        	html+='</div>';
		        	html+='</div>';
		        	
		        	$("[name="+event.name+"]").removeAttr('disabled');
		        	$(".groups-menu-listing-addnewGroup").empty();
		        	$(".groups-menu-listing-addnewGroup").append(html);
		        	$(".groups-menu-listing-addnewGroup").css("height","auto");
		        }
	        	// add attribute onclick...
	        	$("[name="+event.name+"]").attr("onclick","loadBookmarkPopup(this);");
	        	$("[name=getnav]").attr("show","yes");
	        	$("[name=add_grptxt]").attr("show","yes");
	        },
	        error: function(xhr, ajaxOptions, thrownError) {
	        	$('div.message_box').remove();
	        	showDefaultMsg( "Unable to add group.Please try again.", 2 );   
			}
		 });
		
	}
}
/**
 * function used to remove tag.
 * 
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function removeTg(event)
{
	$(".editTagPopup").removeAttr("showshortprofiletags");
	$(".editpop-cross").attr('disabled','disabled');
	var grpid=$(event).attr("grpid");
	var uid=$(event).attr("uid");
	$("#imggrp_"+grpid).removeAttr("onclick");
	$("#imggrp_"+grpid).css("max-width","20px");
	$("#imggrp_"+grpid).attr("src", "/"+PROJECT_NAME+"public/images/loading_small_black.gif");
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "links/delete-tag",
        type: "POST",
        dataType: "json",
        data: { "id" : grpid },
        timeout: 50000,
        success: function(jsonData) 
        {
        	$(".editpop-cross").removeAttr('disabled');
        	$("#grp_"+grpid).remove();
        	$("#menu_grp_"+grpid).remove();
        	$(".editTagPopup").removeAttr('showshortprofiletags');
        	$(".groupdiv").css("height","auto");
        	if ($('#grp-form').is(':empty')){
        		var html='';
        		html+='<a onclick="loadTagPopup(this);" href="javascript:;" id="12" name="add_grptxt">';
				html+='Add Tag';
				html+='</a>';
        		$("#grplisting").after(html);
        		$(".grouplist").hide();
        	}
        	$(".message_box").remove();
        	showDefaultMsg( "Tag deleted successfully.", 1 );  
        },
        error: function(xhr, ajaxOptions, thrownError) {
        	alert("Server Error.");
		}
	 });
}

/**
 * function used to show manage popup tag
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function showManagePopup(){
	$("#tags-menu-popUp").hide();
	$("#groups-menu-popUp").hide();
	$(".quickview-outer").css("display","none");
	// $(".quickview").html("");
	$(".manage-pop").css("display","block");
	$(".manage-pop-outer").fadeToggle();
	$(".quickview-outer-second  quickview-outer").hide();
	$("#tag-manage-outertags").hide(); 	
	$(".msg-popup-outer").hide();
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
 * function send invitation to particular user from the user listing pages.
 * @author spatial
 * version: 1.0
 */
function inviteToLink(event)
{
	$(".message_box").remove();
	var acceptUser = event.id;
	// change dashboard invitation icon...
	$("img#dashboard-invitation_"+acceptUser).attr("disabled","disabled");

	AJAXCaller(
		"/" + PROJECT_NAME + "links/send-link-request",
		{'accept_user':acceptUser, link_req_through_pub_view: 0},
		successFunc,
		errorHandle,
		50000,
		"POST",
		"json",
		false
	)
       
	function successFunc(jsonData) {
		// if invitation already sent.
		if(jsonData.requestStatus=="already sent invitation"){
			$("#user-status_"+acceptUser).empty();
			var html = '';
			html+='<a rel="'+jsonData.requestID["requestID"]+'" id="'+acceptUser+'" class="cursor-style invite_'+acceptUser+' accept-request" class="cursor-style" title="Accept Request" href="javascript:;" onclick="acceptRequestFromListing(this)">';
			//html+='<img src="'+IMAGE_PATH+'/accept-request-icon.png" alt="Accept Request"/>';
			html+='</a>';
			html+='<a rel="'+jsonData.requestID["requestID"]+'" id="'+acceptUser+'" class="cursor-style decline_'+acceptUser+' decline-request" class="cursor-style" title="Decline Request" href="javascript:;" onclick="cancelRequestFromListing(this)">';
			//html+='<img src="'+IMAGE_PATH+'/decline-request-icon.png" alt="Decline Request"/>';
			html+='</a>';
			$("#user-status_"+acceptUser).html(html);
			// popup start...
			// icon
			$("#statusIcon-"+acceptUser).empty();
			var html2 = '';
			html2+='<img src="'+IMAGE_PATH+'/small-accept-request-icon.png" alt="Accept Request"/>';
			$("#statusIcon-"+acceptUser).html(html2);
			// title
			$("#statusTitle-"+acceptUser).empty();
			var html3 = '';
			html3+='<a rel="'+jsonData.requestID["requestID"]+'" id="'+acceptUser+'" class="text-grey2-link" title="Accept Request" href="javascript:;" onclick="acceptRequestFromListing(this)">Accept Request</a>';
			$("#statusTitle-"+acceptUser).html(html3);
			// remove previous decline request icon..
			$("#cancel-request-icon-text-"+acceptUser).remove();

			// add decline icon...
			var html4='';
			html4+='<div class="col2" id="cancel-request-icon-text-'+acceptUser+'">';
			html4+='<span class="iconWidth" id="statusIcon-'+acceptUser+'">';
			html4+='<img src="/'+PROJECT_NAME+'public/images/small-decline-request-icon.png" align="absmiddle" />';
			html4+='</span>';
			html4+='<span class="textWidth" id="statusTitle-'+acceptUser+'">';
			html4+='<a id="'+acceptUser+'" rel="'+jsonData.requestID["requestID"]+'" class="text-grey2-link decline-request" title="Decline Request" href="javascript:;" onclick="cancelRequestFromListing(this)">Decline</a>';
			html4+='</span>';
			html4+='</div>';
			$("#statusIcon-"+acceptUser).parent().after(html4);
			showDefaultMsg( jsonData.uname+" already sent link request to you.", 1 );
		}
		else{
			$("#user-status_"+acceptUser).empty();
			// hide div on dashboard.. slowly slowly
			$('div.you-may-know-column_'+acceptUser).hide("slow");
			// check div is hide or not..
			// $(".invite-mails-outer").is(":visible")
			if($(".you-may-input").is(":visible")==false && $(".invite-mails-outer").is(":visible")==true){
				$(".you-may-input").show();
			}
			if($(".invite-mails-outer").is(":visible")==false){
				$(".invite-mails-outer").show();
			}
			var html = '';
			html+='<a rel="'+jsonData+'" id="'+acceptUser+'" class="cursor-style invite_'+acceptUser+' cancel-request" class="cursor-style" title="Cancel Request" href="javascript:;" onclick="cancelRequestFromListing(this)">';
			//html+='<img src="'+IMAGE_PATH+'/cancel-request-icon.png" alt="Cancel Request"/>';
			html+='</a>';
			$("#user-status_"+acceptUser).html(html);
			$("#statusIcon-"+acceptUser).empty();
			var html2 = '';
			html2+='<img src="'+IMAGE_PATH+'/small-cancel-request-icon.png" alt="Cancel Request"/>';
			$("#statusIcon-"+acceptUser).html(html2);
			$("#statusTitle-"+acceptUser).empty();
			var html3 = '';
			html3+='<a rel="'+jsonData+'" id="'+acceptUser+'" class="text-grey2-link cursor-style invite_'+acceptUser+'" class="cursor-style" title="Cancel Request" href="javascript:;" onclick="cancelRequestFromListing(this)">Cancel Request</a>';
			$("#statusTitle-"+acceptUser).html(html3);
			showDefaultMsg( "Your link request has been sent successfully.", 1 );
		}
	}
	function errorHandle(xhr, ajaxOptions, thrownError){
		alert("Oops! an error occured. Please try again.");
	}
}

/**
 * function used to cancel the link request from the user listing pages
 * Author: Sunny patial
 * version: 1.0
 */
function cancelRequestFromListing(event){
	var profileID=event.id;
	$(".message_box").remove();
	jQuery.ajax({
		async: false,
        url: "/" + PROJECT_NAME + "profile/cancel-request",
        type: "POST",
        dataType: "json",
        data: "cancel_request="+event.rel+"&profileID="+profileID+"&type=request",
        success: function(jsonData) {
        	$("div#cancel-request-icon-text-"+profileID).remove();
        	if(jsonData.requestStatus=="already canceled"){
        		// for gridview..
	        	$("#user-status_"+profileID).empty();
	        	var html = '';
        		html+='<a id="'+profileID+'" class="cursor-style invite_'+profileID+' invitation-request" title="Invite to Link" href="javascript:;" onclick="inviteToLink(this)">';
            	//html+='<img src="'+IMAGE_PATH+'/invitation-request-icon.png" alt="Invite to Link"/>';
            	html+='</a>';
            	$("#user-status_"+profileID).html(html);
            	// for user popup
            	$("#statusIcon-"+profileID).empty();
            	var html2 = '';
            	html2+='<img src="'+IMAGE_PATH+'/small-invitation-request-icon.png" alt="Invite to Link"/>';
            	$("#statusIcon-"+profileID).html(html2);
            	// for user popup title
            	$("#statusTitle-"+profileID).empty();
            	var html3 = '';
            	html3+='<a rel="'+jsonData+'" id="'+profileID+'" class="text-grey2-link cursor-style invite_'+profileID+' invitation-request" title="Invite to Link" href="javascript:;" onclick="inviteToLink(this)">Invite to Link</a>';
            	$("#statusTitle-"+profileID).html(html3);
	        	// hide textarea...
	        	$(".quickview-mid_"+profileID).slideUp();
	        	showDefaultMsg( "Link request has been already cancelled by "+jsonData.uname+".", 1 );
        	}
        	else{
        		if(jsonData.msg){
        			$("#user-status_"+profileID).empty();
        			// for gridview..
        			var html = '';
        			html+='<a id="'+profileID+'" class="cursor-style invite_'+profileID+' invitation-request" title="Invite to Link" href="javascript:;" onclick="inviteToLink(this)">';
        			//html+='<img src="'+IMAGE_PATH+'/invitation-request-icon.png" alt="Invite to Link"/>';
        			html+='</a>';
        			$("#user-status_"+profileID).html(html);
        			$("#statusIcon-"+profileID).empty();
        			// for user popup
        			var html2 = '';
        			html2+='<img src="'+IMAGE_PATH+'/small-invitation-request-icon.png" alt="Invite to Link"/>';
        			$("#statusIcon-"+profileID).html(html2);
        			$("#statusTitle-"+profileID).empty();
        			// for user popup title
        			var html3 = '';
        			html3+='<a rel="'+jsonData+'" id="'+profileID+'" class="text-grey2-link cursor-style invite_'+profileID+'" title="Invite to Link" href="javascript:;" onclick="inviteToLink(this)">Invite to Link</a>';
        			$("#statusTitle-"+profileID).html(html3);
        			showDefaultMsg(jsonData.msg, 1 );
        		}
        		else if(jsonData==1){
        			$("#user-status_"+profileID).empty();
        			// for gridview..
        			var html = '';
        			html+='<a id="'+profileID+'" class="cursor-style invite_'+profileID+' invitation-request" title="Invite to Link" href="javascript:;" onclick="inviteToLink(this)">';
        			//html+='<img src="'+IMAGE_PATH+'/invitation-request-icon.png" alt="Invite to Link"/>';
        			html+='</a>';
        			$("#user-status_"+profileID).html(html);
        			$("#statusIcon-"+profileID).empty();
        			// for user popup
        			var html2 = '';
        			html2+='<img src="'+IMAGE_PATH+'/small-invitation-request-icon.png" alt="Invite to Link"/>';
        			$("#statusIcon-"+profileID).html(html2);
        			$("#statusTitle-"+profileID).empty();
        			// for user popup title
        			var html3 = '';
        			html3+='<a rel="'+jsonData+'" id="'+profileID+'" class="text-grey2-link cursor-style invite_'+profileID+'" title="Invite to Link" href="javascript:;" onclick="inviteToLink(this)">Invite to Link</a>';
        			$("#statusTitle-"+profileID).html(html3);
        			showDefaultMsg( "Your link request has been cancelled.", 1 );
        		}
        		else if(jsonData==2){
        			$("#user-status_"+profileID).empty();
            		// for gridview..
            		var html = '';
            		html+='<a class="cursor-style" title="Send Mail" href="'+PROJECT_URL+PROJECT_NAME+'mail/compose#to_user:'+profileID+'">';
            		html+='<img src="'+IMAGE_PATH+'/mail-icon2.png" alt="Send Mail"/>';
            		html+='</a>';
            		$("#user-status_"+profileID).html(html);
            		$("#statusIcon-"+profileID).empty();
            		// for user popup
            		var html2 = '';
            		html2+='<img src="'+IMAGE_PATH+'/small-unlink-icon.png" alt="Unlink"/>';
            		$("#statusIcon-"+profileID).html(html2);
            		$("#statusTitle-"+profileID).empty();
            		// for user popup title
            		var html3 = '';
            		html3+='<a id="delete_'+jsonData+'" class="text-grey2-link" id="'+profileID+'" title="Unlink" href="javascript:;" onclick="unLink('+jsonData+','+profileID+')">Unlink</a>';
            		$("#statusTitle-"+profileID).html(html3);
            		
            		$("#cancel-request-icon-text-"+profileID).remove();
            		$(".quickview-mid_"+profileID).slideDown();
        			showDefaultMsg( "Your link request has been accepted and can't be cancelled.", 1 );
        		}
        		else if(jsonData==3){
        			$("#user-status_"+profileID).empty();
        			// for gridview..
        			var html = '';
        			html+='<a id="'+profileID+'" class="cursor-style invite_'+profileID+' invitation-request" title="Invite to Link" href="javascript:;" onclick="inviteToLink(this)">';
        			//html+='<img src="'+IMAGE_PATH+'/invitation-request-icon.png" alt="Invite to Link"/>';
        			html+='</a>';
        			$("#user-status_"+profileID).html(html);
        			$("#statusIcon-"+profileID).empty();
        			// for user popup
        			var html2 = '';
        			html2+='<img src="'+IMAGE_PATH+'/small-invitation-request-icon.png" alt="Invite to Link"/>';
        			$("#statusIcon-"+profileID).html(html2);
        			$("#statusTitle-"+profileID).empty();
        			// for user popup title
        			var html3 = '';
        			html3+='<a rel="'+jsonData+'" id="'+profileID+'" class="cursor-style invite_'+profileID+' invitation-request" title="Invite to Link" href="javascript:;" onclick="inviteToLink(this)">Invite to Link</a>';
        			$("#statusTitle-"+profileID).html(html3);
        			if(event.type=="decline"){
        				showDefaultMsg( "Your link request has been declined.", 1 );
        			}
        			else{
        				showDefaultMsg( "Your link request has been cancelled.", 1 );
        			}
        		}
        	}
        	
        },
        error: function(xhr, ajaxOptions, thrownError) {
        	//alert(thrownError);
        	alert("Server Error.");
		}
    });
}


/**
 * function used to accept user link request from the list of users
 * @author Sunny patial
 * @version 1.0
 */
function acceptRequestFromListing(event){
	$(".message_box").remove();
	var profileID=event.id;
	var acceptId=event.rel;
	jQuery.ajax({
		async: false,
        url: "/" + PROJECT_NAME + "profile/accept-request",
        type: "POST",
        dataType: "json",
        data: "accept_request="+acceptId+"&profileID="+profileID,
        success: function(jsonData) {
        	$("#cancel-request-icon-text-"+profileID).remove();
        	if(jsonData.requestStatus=="already canceled"){
        		// for gridview..
	        	$("#user-status_"+profileID).empty();
	        	var html = '';
        		html+='<a id="'+profileID+'" class="cursor-style invite_'+profileID+' invitation-request" title="Invite to Link" href="javascript:;" onclick="inviteToLink(this)">';
            	//html+='<img src="'+IMAGE_PATH+'/invitation-request-icon.png" alt="Invite to Link"/>';
            	html+='</a>';
            	$("#user-status_"+profileID).html(html);
            	// for user popup
            	$("#statusIcon-"+profileID).empty();
            	var html2 = '';
            	html2+='<img src="'+IMAGE_PATH+'/small-invitation-request-icon.png" alt="Invite to Link"/>';
            	$("#statusIcon-"+profileID).html(html2);
            	// for user popup title
            	$("#statusTitle-"+profileID).empty();
            	var html3 = '';
            	html3+='<a rel="'+jsonData+'" id="'+profileID+'" class="text-grey2-link cursor-style invite_'+profileID+' invitation-request" title="Invite to Link" href="javascript:;" onclick="inviteToLink(this)">Invite to Link</a>';
            	$("#statusTitle-"+profileID).html(html3);
	        	// hide textarea...
	        	$(".quickview-mid_"+profileID).slideUp();
	        	showDefaultMsg( "Link request already cancelled by "+jsonData.uname, 1 );
        	}
        	else{
        		$("#user-status_"+profileID).empty();
        		// for gridview..
        		var html = '';
        		html+='<a class="cursor-style compose-mail" title="Send Mail" href="'+PROJECT_URL+PROJECT_NAME+'mail/compose#to_user:'+profileID+'">';
        		//html+='<img src="'+IMAGE_PATH+'/mail-icon2.png" alt="Send Mail"/>';
        		html+='</a>';
        		$("#user-status_"+profileID).html(html);
        		$("#statusIcon-"+profileID).empty();
        		// for user popup
        		var html2 = '';
        		html2+='<img src="'+IMAGE_PATH+'/small-unlink-icon.png" alt="Unlink"/>';
        		$("#statusIcon-"+profileID).html(html2);
        		$("#statusTitle-"+profileID).empty();
        		// for user popup title
        		var html3 = '';
        		html3+='<a id="delete_'+jsonData+'" class="text-grey2-link" id="'+profileID+'" title="Unlink" href="javascript:;" onclick="unLink('+jsonData+','+profileID+')">Unlink</a>';
        		$("#statusTitle-"+profileID).html(html3);
        		$(".quickview-mid_"+profileID).slideDown();
        		showDefaultMsg( "You have accepted the link request.", 1 );        		
        	}
		},
        error: function(xhr, ajaxOptions, thrownError) {
        	alert("Server Error.");
		}
    });
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
 * function used to discard note regarding particular users
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function discardNote(event){
	$("#note-msg").remove();
	$("[name=discardNote_"+event.id+"]").attr('disabled','disabled');
	var ids = addLoadingImage($("[name=discardNote_"+event.id+"]"), "after");
	var txt="";
	var uid=event.id;
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "links/save-note",
        type: "POST",
        dataType: "json",
        data: { "user_id" : uid, "note" : txt },
        timeout: 50000,
        success: function(jsonData) {
        		$("span#"+ids).remove();
            	if(jsonData.msg=="success"){
            		CKEDITOR.instances["note_"+event.id].setData("");
            		$(".message_box").remove();
        			showDefaultMsg( "Note successfully discarded.", 1 );
            		$("[name=discardNote_"+event.id+"]").removeAttr('disabled');
            		$("#displayNotes").fadeToggle('slow');
            	}
            	else{
            		$("[name=discardNote_"+event.id+"]").removeAttr('disabled');
            		$("[name=discardNote_"+event.id+"]").before('<span class="spanmsg" id="note-msg" style="color:red;">Server Error</span>');
            	}
            },
        error: function(xhr, ajaxOptions, thrownError) {
        	alert("Server Error.");
		}
	 });
}


/**
 * Used to fetch latest five imails whether unread or read
 * 
 * @author jsingh7,sjaiswal
 * version 1.1
 */
function getLatestFiveImails()
{
	//if div that list imails is empty.
	if( $("div.mail_notifications_js div.notification-dd-content-js").children().length <= 0 )
	{
		$("div.mail_notifications_js div.notification-dd-content-js").html("<div style='width: 392px; text-align: center;'><img src = '"+IMAGE_PATH+"/loading_small_purple.gif' alt = 'wait...'/></div>");
	}
	$.ajaxQueue({
		url : "/" + PROJECT_NAME + "mail/get-latest-five-imails",
		method : "POST",
		data : "",
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			var htmll = "";
			if( jsonData.unread_imails_available == 1 )
			{
				for( i in jsonData.imails_data )
				{	
					// check whether mail is unread or read
					if(jsonData.imails_data[i]['read']== 0 )
					{
					htmll += '<div class="col1 unread">';
					}
					else
					{
					htmll += '<div class="col1">';	
					}
					if( jsonData.imails_data[i]['type'] == 2 )
					{
		    			switch ( jsonData.imails_data[i]['link_state'] ) 
		    			{
		    				case 1:
		    				case '1':
		    					htmll += '<div class="accept-ignore"><label>Request Sent</label></div>';
		    				break;
		    				case 2:
		    				case '2':
		    					htmll += '<div class="accept-ignore" ><a href="/'+PROJECT_NAME+'links/new-link-request/link_req_id/'+jsonData.imails_data[i]['link_request_id']+'/todo/accept" 	class="text-purple-link">Accept</a> | <a href="/'+PROJECT_NAME+'links/new-link-request/link_req_id/'+jsonData.imails_data[i]['link_request_id']+'/todo/decline" class="text-purple-link">Ignore</a></div>';
		    				break;
		    				case 3:
		    				case '3':
		    					htmll += '<div class="accept-ignore"><label>Accepted</label></div>';
		    				break;
		    				case 0:
		    				case '0':
		    					htmll += '<div class="accept-ignore"><label>Declined</label></div>';
		    				break;
		    				
		    				default:
		    					htmll += '<div class="accept-ignore"><a href="/'+PROJECT_NAME+'links/new-link-request/link_req_id/'+jsonData.imails_data[i]['link_request_id']+'/todo/accept" 	class="text-purple-link">Accept</a> | <a href="javascript:;" class="text-purple-link">Ignore</a></div>';
		    				break;
		    			}
					}
					if( jsonData.imails_data[i]['type'] == 5 )
					{
						htmll += '<div class="accept-ignore"><a href="/'+PROJECT_NAME+'feedback/provide-feedback/fid/'+jsonData.imails_data[i]['feedback_request_id']+'#'+jsonData.imails_data[i]['sender_id']+'" class="text-purple-link">Accept</a></div>';
					}
					if( jsonData.imails_data[i]['type'] == 6 )
					{
						htmll += '<div class="accept-ignore"><a href="/'+PROJECT_NAME+'reference-request/provide-reference/rid/'+jsonData.imails_data[i]['reference_request_id']+'#'+jsonData.imails_data[i]['sender_id']+'" class="text-purple-link">Accept</a></div>';
					}
	
					switch (jsonData.imails_data[i]['type']) {
					case 1:
						htmll += '<a href="/'+PROJECT_NAME+'mail/inbox?mail_id='+jsonData.imails_data[i]['mail_id']+'">';
						break;	
					case 2:
						htmll += '<a  href="/'+PROJECT_NAME+'mail/link-requests?mail_id='+jsonData.imails_data[i]['mail_id']+'">';
						break;
					case 3:
						htmll += '<a href="/'+PROJECT_NAME+'mail/job-invitation-requests?mail_id='+jsonData.imails_data[i]['mail_id']+'">';
						break;
					case 5:
						htmll += '<a href="/'+PROJECT_NAME+'mail/feedback-request?mail_id='+jsonData.imails_data[i]['mail_id']+'">';
						break;
					case 6:
						htmll += '<a href="/'+PROJECT_NAME+'mail/reference-request?mail_id='+jsonData.imails_data[i]['mail_id']+'">';
						break;
					default:
						htmll += '<a href="/'+PROJECT_NAME+'mail/inbox?mail_id='+jsonData.imails_data[i]['mail_id']+'">';
						break;
					}	
					htmll += '<div class="left image_holder_outer"><div class = "image_holder"><img src="'+jsonData.imails_data[i]['sender_image']+'"></div></div>';
					htmll += '<div class="mid">';
					htmll += '<h4 title = "'+jsonData.imails_data[i]['sender_name']+'">'+showCroppedText(jsonData.imails_data[i]['sender_name'], 18)+'</h4>';
					var subject;
					if( jsonData.imails_data[i]['subject'].trim() == "" )
					{
						subject = '<i>No subject</i>';
					}
					else
					{
						subject = jsonData.imails_data[i]['subject'];
					}
					htmll += '<h5>';
					htmll += ''+showCroppedText(subject, 25)+'';
					htmll += '</h5>';
					htmll += '<p class="text-purple-link contents">';
					htmll += showCroppedText(jsonData.imails_data[i]['contents'],50);
					htmll += '</p>';
					htmll += '</div>';
					htmll += '<div class="right">';
					htmll += jsonData.imails_data[i]['created_at'];
					htmll += '</div>';
					htmll += '</a></div>';
				}
			}
			else
			{
				htmll += '<div class="no-mail">';
				htmll += '<img src="'+IMAGE_PATH+'/no-mail.png" alt = ""/><span>No Mails to display</span>';
				htmll += '</div>';
			}
			
			$("div.mail_notifications_js div.notification-dd-content-js").html(htmll);
		}
	});
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
 * Shows up notifications popup,
 * where user can see different type of notifications
 * and navigate to respctive detail page.
 * @author hkaur5
 */
function getLatestSixNotifications()
{
	//if div that list imails is empty.
	if( $("div.general_notifications_js div.gen-notification-dd-content-js").children().length <= 0 )
	{
		$("div.general_notifications_js div.gen-notification-dd-content-js").html("<div style='width: 340px; text-align: center;'><img src = '"+IMAGE_PATH+"/loading_small_purple.gif' alt = 'wait...'/></div>");
	}
	$.ajaxQueue({
		url : "/" + PROJECT_NAME + "notifications/get-notifications",
		method : "POST",
		data : "",
		type : "post",
		dataType : "json",
		success : function(jsonData) 
		{
			var htmll = '';
			if(jsonData)
			{
				$("div.general_notifications_js div.gen-notification-dd-content-js").empty();
				if (jsonData.data)
				{
					htmll +='<form name="notification-popup-form" id="notification-popup-form">';
					
					for( i in jsonData.data )
					{	
						var nid = jsonData.data[i]['notification_id'];
						var about_user = jsonData.data[i]['notification_about_id'];
						var wp_id = jsonData.data[i]['wallpost_id'];
						switch (jsonData.data[i]['type_id'])
						{
							case 1:
								//Link requests accepted.
								htmll += '<a style="color:black;" class="click_notification" href="/'+PROJECT_NAME+'profile/iprofile/id/'+about_user+'/nid/'+nid+'">';
								break;
							case 2:
								//Viewed your profile.
								htmll += '<a style="color:black;" class="click_notification" href="/'+PROJECT_NAME+'profile/iprofile/id/'+about_user+'/nid/'+nid+'">';
								break;
							case 3:
								//Skill supported.
								htmll += '<a style="color:black;" class="click_notification" href="/'+PROJECT_NAME+'profile/skills/nid/'+nid+'">';
								break;
							case 4:
								//New link.
								htmll += '<a style="color:black;" class="click_notification" href="/'+PROJECT_NAME+'profile/iprofile/id/'+about_user+'/nid/'+nid+'">';
								break;
							case 8 :
							case 9:
							case 10:
							case 13:
							case 14:
							case 15:
								// case for ok wall post
								htmll += '<a style="color:black;" class="click_notification" href="/'+PROJECT_NAME+'post/detail/id/'+wp_id+'/nid/'+nid+'">';
//								htmll += '<a style="color:black;" class="click_notification" href="javascript:;">';
								break;
//							case 9 :
//								// case for comment on wall post
//								htmll += '<a style="color:black;" class="click_notification" href="/'+PROJECT_NAME+'post/detail/id/'+wp_id+'/nid/'+nid+'">';
////								htmll += '<a style="color:black;" class="click_notification" href="javascript:;">';
//								break;
//							case 10 :
//								// case for share wall post
//								htmll += '<a style="color:black;" class="click_notification" href="/'+PROJECT_NAME+'post/detail/id/'+wp_id+'/nid/'+nid+'">';
////								htmll += '<a style="color:black;" class="click_notification" href="javascript:;">';
//								break;
							case 18 :
								// case for share wall post
								htmll += '<a style="color:black;" class="click_notification" href="/'+PROJECT_NAME+'reference-request/received/nid/'+nid+'">';
								break;
							case 19 :
								// case for share wall post
								htmll += '<a style="color:black;" class="click_notification" href="/'+PROJECT_NAME+'feedback/received/nid/'+nid+'">';
								break;
							case 23 :
							case 24 :
							case 25 :
								// case for share wall post
								htmll += '<a style="color:black;" class="click_notification" href="/'+PROJECT_NAME+'profile/photos/uid/'+jsonData.data[i]['album_owner_id']+'/id/'+jsonData.data[i]['album_id']+'/nid/'+nid+'">';
								break;
							default:
								htmll += '<a style="color:black; cursor:default !important" class="click_notification">';
								break;
						}
						if(jsonData.data[i]['is_read'] == 0)
						{
							
							htmll += '<div class="col1 unread">';
						}
						else
						{
							htmll += '<div class="col1">';
							
						}
						htmll += '<div class="left image_holder_outer"><div class = "image_holder"><img src="'+jsonData.data[i]['about_user_image']+'"/></div></div>';
						htmll += '<div class="mid">';
						htmll += '<h4 title="'+jsonData.data[i]['notification_about']+'">'+showCroppedText(jsonData.data[i]['notification_about'], 18)+'</h4>';
						//htmll += '<a href="/'+PROJECT_NAME+'post/detail/id/'+jsonData.data[i]['wallpost_id']+'">';
						htmll += '<h5>'+jsonData.data[i]['text']+'</h5>';
						htmll += '<p class="notification_time">'+jsonData.data[i]['time']+'</p>';

						
	                           
						htmll += '</div>';
						if( jsonData.data[i]['photo_name'] !="" )
						{
							var socialise_image_path = IMAGE_PATH+'/albums/user_'+jsonData.data[i]['socialise_photo_owner_id']+'/album_'+jsonData.data[i]['album_name']+'/wall_thumbnails/thumbnail_'+jsonData.data[i]['photo_name'];
							htmll += '<div class="right">';
							htmll += '<div class="img_outer" style=" border: 1px solid #C0C0C0;display: inline-block; float: right; margin: 0;padding: 0;">';
							htmll += '<div class="img_inner" style=" display:table-cell;text-align:center;vertical-align: middle;">';
							htmll += '<img alt="image is not available" style="max-width:70px;max-height:70px;" src="'+PUBLIC_PATH+'/Imagehandler/GenerateImage.php?image='+socialise_image_path+'&h=70&w=70"/>';
							htmll += '</div>';
							htmll += '</div>';
							htmll += '</div>';
						}
						htmll += '</div>';
						htmll +='</a>';
						if ( jsonData.data[i]['is_read'] == 0)
						{
							htmll += '<input name="notification_ids[]" id="notification_id" type="hidden" value="'+jsonData.data[i]['notification_id']+'"/>';
						}
					}
					htmll += '</form>';
					
				}
			
				else
				{
					htmll += '<div class="no-mail no-notifications">';
					htmll += '<img src="'+IMAGE_PATH+'/speaker-icon.png" alt = ""/><span>No Notifications to display</span>';
					htmll += '</div>';
				}
			}
			if(jsonData.count.unseen_notifications[0]['num_of_rows'] && jsonData.count.unseen_notifications[0]['num_of_rows'] !=0 )
				
			{
				$('div#gen_notifi_count').css('visibility','visible');
				//This class is removed so as red circle can appar on speaker icon.
//				$("div#gen_notifi_count").removeClass('zero_notification');
				$("div#general_notifications span#unread_notification_count").html(jsonData.count.unseen_notifications[0]['num_of_rows']);
			
			}
			else
			{
				$("div#general_notifications span#unread_notification_count").html('&nbsp;');
				$('div#gen_notifi_count').css('visibility','hidden');
			}
			if(jsonData.is_more_notifications)
			{
				htmll += '<a href ="/'+ PROJECT_NAME +'notifications/view-all-notifications" >';
				htmll += '<div class="view_all_notifications" ><div><span id="view_all">View all notifications</span></div></div>';
				htmll += '</a>';
			}
			$("div.general_notifications_js div.gen-notification-dd-content-js").html(htmll);
		}
	});
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
 * Show value at the top header for inbox unread mail count.
 * 
 * @author jsingh7
 */
function showTotalUnreadMyMailCounts()
{
//	console.log("getting counts");
	 $.ajaxQueue({
        url: "/" + PROJECT_NAME + "mail/get-unread-mail-counts-inbox",
        type: "POST",
        dataType: "json",
        data: {},
        timeout: 50000,
        success: function(jsonData) {
        //	console.log(jsonData);
        	if( jsonData == 0 )
        	{
        		$('div.mail_notifications_js').addClass('unread-mail-count-zero');
        		$('div.notifi-count-outer-js div.notifi-count-hover, div.notifi-count-outer-js div.notifi-count').css('visibility','hidden'); 
        	}	
        	else if( jsonData !== undefined )
        	{
        		$("div#mail-notifi-count").css('visibility','visible');
	        	$("div.mail_notifications span#uread_mail_count").html(jsonData);
	        	$('div.mail_notifications_js').removeClass('unread-mail-count-zero');
        	}
        	else
        	{
        	}
        }
	});
}

/**
 * nl2br function is used for retaining html tags into view pages  
 * @author nsingh3
 */
function nl2br (str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}


/** check whether a string is valid url or not
@author sjaiswal
*/
function is_valid_url(str) {
	var urlPattern = /\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?������]))/i;
	  if(!urlPattern.test(str)) {  
	    return false;
	  } else {
	    return true;
	  }
	}

/**
 * Returns name of icon image for particular extension.
 * [For this project, these image files is in public images folder]
 * 
 * @param string ext
 * 
 * @author jsingh7
 * @version 1.0
 * @return string
 */
function getAttachmentIconByExtention( ext ){
	
	switch ( ext.toLowerCase() ) {
	
		//Images
		case 'png':
		case 'jpg':
		case 'jpeg':
		case 'gif':
		case 'bmp':
		case 'jfif':
		case 'tiff':
		case 'svg':
			return 'attachment-image.png';
			break;

		//Documents
		case 'doc':
		case 'docx':
		case 'wpd':
		case 'wp':
		case 'wp7':
		case 'odt':
			return 'attachment-doc.png';
			break;
		
		//Adobe document
		case 'pdf':
			return 'attachment-pdf.png';
			break;
		
		//Spreadsheet
		case 'xlsx':
		case 'xls':
			return 'attachment-xl.png';
			break;
			
		//Audio
		case 'act':
		case 'aiff':
		case 'aac':
		case 'amr':
		case 'ape':
		case 'au':
		case 'awb':
		case 'dct':
		case 'dss':
		case 'dvf':
		case 'flac':
		case 'gsm':
		case 'iklax':
		case 'ivs':
		case 'm4a':
		case 'mmf':
		case 'mp3':
		case 'mpc':
		case 'msv':
		case 'oga':
		case 'opus':
		case 'ra':
		case 'rm':
		case 'raw':
		case 'sln':
		case 'tta':
		case 'vox':
		case 'wav':
		case 'wma':
		case 'wv':
			return 'attachment-audio.png';
			break;

		//Vedios
		case 'webm':
		case 'mkv':
		case 'flv':
		case 'vob':
		case 'ogg':
		case 'ogv':
		case 'drc':
		case 'gifv':
		case 'mng':
		case 'avi':
		case 'qt':
		case 'mov':
		case 'wmv':
		case 'yuv':
		case 'rmvb':
		case 'asf':
		case 'mp4':
		case 'm4v':
		case 'm4p':
		case 'mpg':
		case 'mp2':
		case 'mpeg':
		case 'mpe':
		case 'mpv':
		case 'm2v':
		case 'svi':
		case '3gp':
		case '3g2':
		case 'mxf':
		case 'roq':
		case 'nsv':
		case 'f4v':
		case 'f4p':
		case 'f4a':
		case 'f4b':
			return 'attachment-video.png';
			break;
		
		case 'rar':
		case 'zip':
			return 'attachment-zip.png';
			break;	
			
		default:
			return 'attachment-file.png';
			break;
	}
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

function logout()
{
	jsxcLogout();
	window.location.href =PROJECT_URL+PROJECT_NAME+'authenticate/logout';
}