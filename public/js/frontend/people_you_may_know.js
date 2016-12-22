$(document).ready(function(){
	
	
});

/**
 * Fetch more records of people you may know
 * according to offset and limit sent.
 * @param element
 * @author hkaur5
 */
function loadMorePeopleYouMayKnow(element)
{
	$(element).hide();
	
	$('div.see_more_you_may_know').html('<img class="loading_options" style="" src="'+IMAGE_PATH+'/loading_small_purple.gif"/>');
	var offset = $("input#offsett").val();
	var limit = $("input#recordLimit").val();
	
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "links/load-more-people-you-may-know",
        type: "POST",
        dataType: "json",
        data : { 'offset':offset, 'limit':limit  },
        success: function(jsonData) 
        {
        	if(jsonData)
    		{
        		$('div.see_more_you_may_know').hide();
        		$('div#user_records').append(jsonData.html);
        		
    		}
        	$("#offsett").val( parseInt(offset)+parseInt(limit) );
		}
	});
}