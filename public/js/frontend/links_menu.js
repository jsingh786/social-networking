var window_focus;

$( document ).ready(function() {
	
	setInterval(function()
	{
		if( window_focus )
		{
			getNewLinksAddnewLinksCount();
		}
	}, 10000);//time in milliseconds
	
	$('#minimise_menu').click(function(){
		 $( "div.col1" ).animate({
			 margin: "20px 0 1px 9px",
			 }, 300, function() {
			 // Animation complete.
			 });
		//$("div.col1").css("margin","10px 0 10px 33px");
	});
	$('a#maximise_menu').click(function(){
		 $( "div.col1" ).animate({
			 margin: "20px 10px 1px 18px",
			 }, 300, function() {
			 // Animation complete.
			 });
		// $("div.col1").css("margin","10px 0 10px 3px");
	});
	// double click for Tags..
	$("div.tags-menu-listing-addnewTag").on("click", ".menu-span", function() {
		var id=$(this).attr("rel");
		$(".menu-span").css("display","block");
		$(".menu-span2").css("display","none");
		$("#span_"+id).css("display","none");
		$("#txtgrp_"+id).css("display","block");
	});
	
	// double click for Groups..
	$("div.groups-menu-listing-addnewGroup").on("click", ".menu-span", function() {
		var id=$(this).attr("rel");
		var current_group_input =  $('input#txtgrp_'+id);
		//removing rel1 value for each label(span).
		$("div.groupdiv span.menu-span2").attr('rel1', '');
		$(current_group_input).attr('rel1','current-input');
		$(".menu-span").css("display","block");
		$(".menu-span2").css("display","none");
		$("#span_"+id).css("display","none");
		$("#txtgrp_"+id).css("display","block");
	});
	
	//Hidding photo popup on out click.
	/*$(document).mouseup(function (e)
	{
		var container = $("div.quickview-outer");
		
		if (!container.is(e.target) // if the target of the click isn't the container...
				&& container.has(e.target).length === 0) // ... nor a descendant of the container
		{
			container.hide();
		}
	});*/
	 //Hidding tag edit popup on out click.
	//Added by hkaur5
    /*$(document).mouseup(function (e)
    {
    	var container = $("div#tags-menu-popUp");
    	var container2 = $("div#tag-cross");
    	if (!container.is(e.target) // if the target of the click isn't the container...
    			&& container.has(e.target).length === 0 && !container2.is(e.target) // if the target of the click isn't the container...
    			&& container2.has(e.target).length === 0 && $('#tags-menu-popUp').is(':visible')===true) // ... nor a descendant of the container
    	{
    		container.hide();
    	}
    });*/

	
});
/**
 * function used to show popup tag
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function showGroupMenuPopup(){
	$("#grp-pop").fadeToggle();
}
/**
 * function used to assign labels
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function assignGrpLabels(event){
	var id=$(event).attr("rel");
	$("#span_"+id).html($(event).val());
	$("#event"+id).val($(event).val());
}
/**
 * function used to show navigation menu tag
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function addMenuTag(event){
	$(".editTagPopup").removeAttr("showshortprofiletags");
	var uid=event.uid;
	 
	var title=$("[name=grp-nav-title]").val();
	
	if(title != "")
		{
		$("[name=nav-grp-btn]").attr('disabled','disabled');
		 var ids = addLoadingImage($("[name=nav-grp-btn]"), "before");
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "links/add-new-tag",
        type: "POST",
        dataType: "json",
        data: { "title" : title },
        timeout: 50000,
        success: function(jsonData) {
        		// $("[name=nav-grp-save]").remove();
	    		// $(".group-popup-btn").remove();
	    		$(".spanmsg").remove();
	    		$("span#"+ids).remove();
	    		$("[name=nav-grp-btn]").removeAttr('disabled');
	    		$("[name=grp-nav-title]").val("");
	    		if(jsonData=="exist"){
	    			$("[name=nav-grp-btn]").before('<span class="spanmsg" id="span-tag">Already exist </span>');
	    		}
	    		else{
	    			var tTitle = jsonData.title;
		        	if(tTitle.length>19){
		        		menuTitle=tTitle.substr(0,19)+"...";
		        		popTitle=tTitle.substr(0,16)+"...";
		        	}
		        	else{
		        		menuTitle=tTitle;
		        		popTitle=tTitle;
		        	}
		        	stTitle = tTitle.substr(0,124);
		        	
	    			$("[name=add_grptxt]").remove();
	    			$(".tag-manage-btn").remove();
	    			
	    			html3='';
	        		html3+='<div class="group-popup-col1" id="grp_'+jsonData.id+'">';
	        		html3+='<div class="editpop-cross">';
	        		html3+='<img align="absmiddle" height="8" src="/'+PROJECT_NAME+'public/images/cross-grey.png" grpid="'+jsonData.id+'" uid="'+uid+'" onclick="removeTg(this)" id="imggrp_'+jsonData.id+'">';
	    			html3+='</div>';
					html3+='<div class="group-popup-col1-text">';
					html3+='<span class="menu-span" title="Click to Rename it" style="padding-left:5px;background:none;" id="span_'+jsonData.id+'" rel="'+jsonData.id+'">'+popTitle+'</span>';
					html3+='<input type="text" class="menu-span2" style="width:115px;display:none;" id="txtgrp_'+jsonData.id+'" name="txtgrp_'+jsonData.id+'" rel="'+jsonData.id+'" value="'+jsonData.title+'" onkeyup="assignGrpLabels(this)">';
					html3+='</div>';
					html3+='</div>';
					$("#grp-form").prepend(html3);
		        	
	        		var html2="";
	        		html2+='<a  id="menu_grp_'+jsonData.id+'" title="'+menuTitle+'" class="grp-listing" href="/'+PROJECT_NAME+'links/tag/id/'+jsonData.id+'">';
	        		html2+=menuTitle+'</a>';
	        		
	        		
	        		$("#addNewgrp").remove();
	        		$(".groupdiv").css("height","auto");
	        		$(".grouplist").css("display","block");
	        		$("#grplisting").after(html2);     			
	    		}
	        	
            },
        error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
		}
	 });
	}
	else{
		$("span#"+ids).remove();
		$(".alert-box").remove();
		$(".alert-box1").remove();
		$(".alert-box2").remove();
		showDefaultMsg( "Please add text.", 2 );
	}
}
/**
 * function used to update tags labels text
 * Author: Sunny Patial
 * Date: 5,Aug 2013
 * version: 1.0
 */
function updateLabels()
{
	$(".alert-box").remove();
	$(".alert-box1").remove();
	$(".alert-box2").remove();
	var ids = addLoadingImage($("[name=nav-grp-save]"), "before");
	var str=$("form#grp-form").serializeArray();
	var existenceArr = new Array();
	for(var i=0;i<str.length;i++){
		var result = existenceArr.indexOf(str[i].value);
		existenceArr[i] = str[i].value; 
		if(result==0){
			$("span#"+ids).remove();
			showDefaultMsg( "User can't update tag with same title.", 2 );
			return false;
		}
	}
	
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "links/update-tag",
        type: "POST",
        dataType: "json",
        data: { "tags" : str },
        timeout: 50000,
        success: function(jsonData) {
        	$("span#"+ids).remove();
        	if (jsonData =="exist")
        	{
        		$("[name=nav-grp-save]").before('<span class="spanmsg" id="span-tag">Already exist </span>');
        	}
        	else
	        {
        		$(".grp-listing").remove();  
	        	var html="";
	        	for(var i=0;i<jsonData.length;i++)
	        	{
	        		var tTitle = jsonData[i]["tag_title"];
		        	if(tTitle.length>19){
		        		tTitle=tTitle.substr(0,19)+"...";
		        		popTitle=tTitle.substr(0,16)+"...";
		        	}
		        	else{
		        		tTitle=tTitle;
		        		popTitle=tTitle;
		        	}
	        		html+='<a class="grp-listing" title="'+tTitle+'" id="menu_grp_'+jsonData[i]['tag_id']+'" href="/'+PROJECT_NAME+'links/tag/id/'+jsonData[i]['tag_id']+'">';
	        		html+=tTitle+'</a>';
	        		$("#span_"+jsonData[i]['tag_id']).html(popTitle);
	        	}
	        	$(".menu-span2").hide();
	        	$(".menu-span").fadeIn();
	        	$("#grplisting").after(html);  
	        	$("#tags-menu-popUp").fadeToggle('slow');
		        }
	        	
        	},
        
        error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
		}
	 });
}
function getNewLinksAddnewLinksCount(){
	$.ajaxQueue({
        url: "/" + PROJECT_NAME + "links/get-new-links-and-add-links-count",
        type: "POST",
        dataType: "json",
        data: {},
        timeout: 50000,
        success: function(jsonData) {
        	if( jsonData.totalLinks !== undefined )
        	{
	        	$(".my-links").html(jsonData.totalLinks);
        	}
        	else
        	{
        		$(".my-links").html("0");
        	}	
        	if( jsonData.totalRequests !== undefined )
        	{
	        	$(".link-requests").html(jsonData.totalRequests);
        	}
        	else
        	{
        		$(".link-requests").html("0");
        	}

        }
	});
}