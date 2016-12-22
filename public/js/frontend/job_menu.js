var call_get_count;
$(document).ready(function(){
	getActiveClosedExpiredJobsCount();
	setInterval(function(){
		getActiveClosedExpiredJobsCount();
	}, 60000);//time in milliseconds
	 //hide span on double click and show textbox to edit search name.
    //added by hkaur5
	$("div.groupdiv").on("click", ".menu-span", function() 
	{
		var id=$(this).attr("rel"); // search id 
		var current_search_span =  $('span#span_'+id);
		var current_search_input =  $('input#txtgrp_'+id);
		//removing rel1 value for each label(span).
		$("div.groupdiv span.menu-span").attr('rel1', '');
		$("div.groupdiv input.menu-span2").attr('rel1', '');
		$(current_search_span).attr('rel1','current-span');
		$(current_search_input).attr('rel1','current-input');
		$(".menu-span").css("display","block");
		$(".menu-span2").css("display","none");
		$("#span_"+id).css("display","none");
		$("#txtgrp_"+id).css("display","block");
	});
	
	 //Hidding post edit save search popup on out click.
	//Added by hkaur5
    $(document).mouseup(function (e)
    {
    	var container = $("div#grp-pop");
    	
    	if (!container.is(e.target) // if the target of the click isn't the container...
    			&& container.has(e.target).length === 0) // ... nor a descendant of the container
    	{
    		container.hide();
    	}
    });
});
function getActiveClosedExpiredJobsCount(){
	if(call_get_count instanceof Object)
	{
		call_get_count.abort();
	}
	call_get_count = jQuery.ajax({
        url: "/" + PROJECT_NAME + "job/get-active-closed-expired-jobs-count",
        type: "POST",
        dataType: "json",
        data: {},
        timeout: 50000,
        success: function(jsonData) {
        	if( jsonData.active !== undefined )
        	{
	        	$(".active-cnt").html(jsonData.active);
        	}
        	else
        	{
        		$(".active-cnt").html("0");
        	}	
        	if( jsonData.expired !== undefined )
        	{
	        	$(".expired-cnt").html(jsonData.expired);
        	}
        	else
        	{
        		$(".expired-cnt").html("0");
        	}
        	if( jsonData.closed !== undefined )
        	{
	        	$(".closed-cnt").html(jsonData.closed);
        	}
        	else
        	{
        		$(".closed-cnt").html("0");
        	}
        }
	});
}		
/**
}
 * function used to update saved searches names inside popup.
 * @auther hkaur5
 * @param elem
 */
function updateSearchName(elem)
{
	$('span.spanmsg').remove();
	
	var element = elem;
	var current_span = $(elem).parent().parent().children('div').children('form').find('span[rel1=current-span]');
	var search_id = $(current_span).attr('rel');
	var updated_search_name = $(current_span).siblings('input').val();
	if ($(current_span).siblings('input').attr('rel1') == "current-input")
	{
		$("div.message_box").remove();
		$(elem).hide();
		var ids = addLoadingImage($("[name=nav-grp-save]"), "before");
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "job/update-saved-search-name",
	        type: "POST",
	        dataType: "json",
	        data: { "search_id" : search_id, "search_name" : updated_search_name},
	        timeout: 50000,
	        success: function(jsonData)
	        {
	        	if(jsonData["search_id"] && jsonData['search_name'] )
	        	{
	    		$("span#"+ids).remove();
	    		$(element).fadeIn();
	    		$('a#search_'+jsonData["search_id"]).replaceWith('<a class="cross-outer" rel ="'+jsonData["search_id"]+'" href="/'+PROJECT_NAME+"job/search-jobs/search_id/"+jsonData['search_id']+'" title = "'+jsonData['search_name']+'" id = "search_"'+jsonData['search_name']+'" >'+showCroppedText( jsonData["search_name"] ,15 )+'</a>'); 
	    		$(current_span).siblings('input').css('display','none');
	    		$(current_span).replaceWith('<span class="menu-span" rel1="" title="Click to Rename" style="padding:0px;background:none;" id="span_'+jsonData['search_id']+'" rel="'+jsonData['search_id']+'">'+showCroppedText(jsonData["search_name"],12)+'</span>');
	    		$(current_span).css('display','block');
	        	}
	        	else if(jsonData["exist"])
	        	{
	        		$("span#"+ids).remove();
	        		$('span.spanmsg').remove();
	        		$(element).fadeIn();
	        		$("[name=nav-grp-save]").after('<span class="spanmsg" id="span-tag">Already exist </span>');
	        	}
	       
	        },
	        error: function(xhr, ajaxOptions, thrownError) {
	        	
	        	$("span#"+ids).remove();
	        	$(element).fadeIn();
	        	$("div.message_box").remove();
	        	showDefaultMsg( "An error occurred! Please try again.", 2 );
			}
		 });
	}
	else
	{
		$("div.message_box").remove();
		showDefaultMsg( "Please edit and then click update.", 2 );
		
	}
}
/**
 * function used to show saved job searches  popup
 * @author hkaur5
 * @param elem
 */
function loadSavedSearchesPopup(elem){
	$(".groupdiv").css("height","30px");
	var uid=elem.id;
	$("[name="+elem.name+"]").attr("disabled","disabled");
	$(".group-popup-top").remove();
	$(".grouplist").remove();
	$("div.groupdiv").html('<div style="position: absolute;bottom:17px;display:table-cell;width:170px;height:auto;text-align:center;vertical-align:middle;padding-left:0px;margin-top:89px;" id="loading"><img src="'+IMAGE_PATH+'/loading_medium_purple.gif"></div>');
	
	$("#grp-pop").fadeIn('slow');
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "job/get-saved-searches",
        type: "POST",
        dataType: "json",
        data: { "user_id" : uid },
        timeout: 50000,
        success: function(jsonData) 
        {
        	if(!(jsonData == 0))
        	{
        		$(".groupdiv").css("height","auto");
	        	html="";
	        	html+='<div class="grouplist">';
	        	html+='<div class="group-popup-mid" style="overflow-y:auto;">';
	        	html+='<form name="grp-form" id="grp-form" method="post" action="">';
	        	var i=0;
	        	for(i in jsonData)
	        	{
	        		
		        	html+='<div class="group-popup-col1" id="grp_'+jsonData[i]["id"]+'">';
		        	html+='<div class="editpop-cross">';
		        	html+='<img class = "delete_search" title="Delete search" id="imggrp_'+jsonData[i]["id"]+'" onclick="deleteSearch(this)" rel="'+jsonData[i]["id"]+'" height="8" align="absmiddle" src="/'+PROJECT_NAME+'public/images/cross-grey.png">';
		        	html+='</div>';
		        	html+='<div class="group-popup-col1-text" rel="'+jsonData[i]["id"]+'">';
		        	html+='<span class="menu-span" rel1="" title="Double click to Rename" style="cursor: pointer;padding:0px;background:none;" id="span_'+jsonData[i]["id"]+'" rel="'+jsonData[i]["id"]+'">';
		        	html+=showCroppedText(jsonData[i]["search_name"],12);
		        	html+='</span>';
		        	html+='<input maxlength = 100 rel1="" class="menu-span2" style="width:115px;display:none;" type="text" id="txtgrp_'+jsonData[i]["id"]+'" name="txtgrp_'+jsonData[i]["id"]+'" rel="'+jsonData[i]["id"]+'" value="'+jsonData[i]["search_name"]+'"/>';
		        	html+='</div>';
		        	html+='</div>';

	        	}
	        	html+='</form>';
	        	html+='</div>';
	        	html+='<div class="group-popup-btn">';
	        	html+='<input type="button" value="Update" name="nav-grp-save" class="btn-blue mt5 update_save_search" alt="Update" title="Update" onclick="updateSearchName(this)">';
	        	html+='</div>';
	        	html+='</div>';
	        	$("[name="+elem.name+"]").removeAttr('disabled');
	        	$(".groupdiv").html(html);
	        	$(".grouplist").css("display","block");
	        	$(".groupdiv").css("height","auto");
	        }
        	else
	        {
        		$("div.tag-popup-arrow").remove();
        		$("div.groupdiv").remove();
        		$("div.message_box").remove();
        		showDefaultMsg( "No searches have been saved yet.", 2 ); 
	        }
        },
        error: function(xhr, ajaxOptions, thrownError) 
        {
        	$("div.message_box").remove();
        	showDefaultMsg( "An error occurred! Please try again.", 2 );
		}
	 });	    
}
/**
 * Delete saved search on click of cross.
 * @param elem.
 * @author hkaur5
 * 
 */
function deleteSearch(elem)
{
	$(".editpop-cross").attr('disabled','disabled');
	var search_id=$(elem).attr("rel");
	//var uid=$(event).attr("uid");
	$("#imggrp_"+search_id).removeAttr("onclick");
	$("#imggrp_"+search_id).css("max-width","20px");
	$("#imggrp_"+search_id).attr("src", "/"+PROJECT_NAME+"public/images/loading_small_black.gif");
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "job/delete-saved-search",
        type: "POST",
        dataType: "json",
        data: { "saved_search_id" : search_id },
        timeout: 50000,
        success: function(jsonData) 
        {
        	if(jsonData == 1)
        	{
        		$("div#grp_"+search_id).remove();
        		$("a#search_"+search_id).remove();
//        		$(".alert-box").remove();
//    			$(".alert-box1").remove();
//    			$(".alert-box2").remove();
//            	showDefaultMsg( "serach deleted successfully.", 1 );     
//        		
        	}
        	else if( jsonData == 0 )
			{
				$("div.message_box").remove();
				showDefaultMsg( "An error occurred! Please try again.", 2 );
			}	
        }
	});
        		
}