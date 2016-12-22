$(document).ready(function(){
	$('a.more_details').click(function(){
		var job_id = $(this).attr('rel'); 
		showMoreDetailView($(this));
	});
});
/**
 * function used to show more details.
 * @author Sunny Patial,nsingh3
 * @version 1.1
 */
function showMoreDetailView(elem)
{
	$("div.more_details").slideUp();
	 var imgPlusToAll = '<img style="width: 9px; height: 8px; border-right-width: 3px; padding-right: 5px;" src="'+IMAGE_PATH+'/plus-purple.png" alt="image not found">More Details';
	$("a.more_details").html(imgPlusToAll);
	var elem_id = $(elem).attr("id");
	
	var job_id = $(elem).attr("rel");
	if ($("div#job-content_"+job_id).hasClass("recommended-job-bg-grey"))
	{
		
		$("div#job-content_"+job_id).removeClass("recommended-job-bg-grey");
		$("div#job-id-"+job_id).removeClass("recommended-job-bg-grey");
    
	}
	else
	{
    	
    	$("div.remove-bg-gray").removeClass("recommended-job-bg-grey");
    	//$("div.job-content").removeClass("recommended-job-bg-grey");
    	$("div#job-content_"+job_id).addClass("recommended-job-bg-grey");
    	$("div#job-id-"+job_id).addClass("recommended-job-bg-grey");
    	
    }
	
//	$("div#"+elem_id).slideDown();
	$("div#"+elem_id).toggle();
	if($("div#job-content_"+job_id).hasClass('recommended-job-bg-grey')){
		var imgPlusText = '<img style="width: 9px; height: 8px; border-right-width: 3px; padding-right: 5px;" src="'+IMAGE_PATH+'/minus_grey.png" alt="image not found">Hide Details';
		 $("a#more_details_"+job_id).html(imgPlusText);
		 //$("a#more_details_"+job_id).find("img").attr({'src' : IMAGE_PATH+'/minus_grey.png'});
     }else{
    	 var imgPlusText = '<img style="width: 9px; height: 8px; border-right-width: 3px; padding-right: 5px;" src="'+IMAGE_PATH+'/plus-purple.png" alt="image not found">More Details';
    	 $("a#more_details_"+job_id).html(imgPlusText);
    	 //$("a#more_details_"+job_id).find("img").attr({'src' : IMAGE_PATH+'/plus-purple.png'});
     }
	
}