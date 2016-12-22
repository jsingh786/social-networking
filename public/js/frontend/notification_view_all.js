$(document).ready(function(){
	var unread_notifications_count = $('input#unread_notification_count').val();
	$('td#unread_notification_count').html(unread_notifications_count);
});
function viewMore()
{
	if(parseInt($('input#more_notifications').val()) != 0)
	{
		$('div.show_more').hide();
    	$('div.loading').show();
    	viewMoreNotifications();
     }

}
function viewMoreNotifications()
{
	var offset = parseInt( $('input#offset').val());
	 jQuery.ajax({
	        url: "/" + PROJECT_NAME + "notifications/view-more-notifications",
	        type: "POST",
	        dataType: "json",
	        data: {"offset":offset},
//			cache: false,
	        timeout: 50000,
	        success: function(jsonData)
	        {
	        	if(jsonData)
	        	{
//	        		setting is_more hidden field for further use
	        		if(jsonData['is_more'])
    				{
    					$('input#more_notifications').val(jsonData['is_more']);
    				}
	        		$('div.loading').hide();
		        	for ( i in jsonData['notifications'] )
		        	{	
		        		for( j in jsonData['notifications'][i] )
		        		{
		        			var one_notification = "";
		        			
		        			
		        			one_notification += '<div class="today-notification-data">';
		        			one_notification += '<div class="today-notification-icon">';
		        			switch (jsonData['notifications'][i][j]['type']) 
							{
							case 1:
								one_notification +='<img style="margin-top:-4px;" src="'+IMAGE_PATH+'/link-icon.png" alt="" />';
								break;
							case 2:
								one_notification +='<img src="'+IMAGE_PATH+'/eye-icon.png" alt="" />';
								break;
							case 3:
								one_notification +='<img style="margin-top:-4px;" src="'+IMAGE_PATH+'/icon-support-notifications.png" alt="" />';
								break;
							case 4:
								one_notification +='<img style="margin-top:-4px;" src="'+IMAGE_PATH+'/link-icon.png" alt="" />';
								break;
							case 8:
							case 13:
							case 20:
							case 23:
								one_notification +='<img style="" src="'+IMAGE_PATH+'/tick-hover.png" alt="" />';
								break;
							case 9:
							case 14:
							case 21:
							case 24:
								one_notification +='<img style="" src="'+IMAGE_PATH+'/comments-icon.png" alt="" />';
								break;
							case 10:
							case 15:
							case 22:
							case 25:
								one_notification +='<img style="" src="'+IMAGE_PATH+'/share-icon.png" alt="" />';
								break;
							}
		        			one_notification += '</div>';
		        			
		        			var about_user = +jsonData['notifications'][i][j]['about_user_id'];
		        			var wlpost_id = +jsonData['notifications'][i][j]['wallpost_id'];
		       
		        			var nid = +jsonData['notifications'][i][j]['id'];
		        			switch (jsonData['notifications'][i][j]['type']) 
							{
		        			
							case 1:
								one_notification += '<a  class="view_notification" href="/'+PROJECT_NAME+'profile/iprofile/id/'+about_user+'/nid/'+nid+'">';
								break;
							case 2:
								one_notification += '<a class="view_notification" href="/'+PROJECT_NAME+'profile/iprofile/id/'+about_user+'/nid/'+nid+'">';
								break;
							case 3:
								one_notification += '<a class="view_notification" href="/'+PROJECT_NAME+'profile/skills/nid/'+nid+'">';
								break;
							case 4:
								one_notification += '<a class="view_notification" href="/'+PROJECT_NAME+'profile/iprofile/id/'+about_user+'/nid/'+nid+'">';
								break;
							case 8 :
							case 9:
							case 10:
							case 13:
							case 14:
							case 15:
								// case for ok wall post
								one_notification += '<a style="color:black;" class="view_notification" href="/'+PROJECT_NAME+'post/detail/id/'+wlpost_id+'/nid/'+nid+'">';
//								one_notification += '<a style="color:black;" class="view_notification" href="javascript:;">';
							    break;
//							case 9 :
//								// case for comment on wall post
////								one_notification += '<a style="color:black;" class="view_notification" href="/'+PROJECT_NAME+'post/detail/id/'+wlpost_id+'/nid/'+nid+'">';
//								one_notification += '<a style="color:black;" class="view_notification" href="javascript:;">';
//								break;
//							case 10 :
//								// case for share wall post
////								one_notification += '<a style="color:black;" class="view_notification" href="/'+PROJECT_NAME+'post/detail/id/'+wlpost_id+'/nid/'+nid+'">';
//								one_notification += '<a style="color:black;" class="view_notification" href="javascript:;">';
//								break;
							case 18 :
								// case when refernce is received.
								one_notification += '<a style="color:black;" class="view_notification" href="/'+PROJECT_NAME+'reference-request/received/nid/'+nid+'">';
								break;
							case 19 :
								// case when feedback is received.
								one_notification += '<a style="color:black;" class="view_notification" href="/'+PROJECT_NAME+'feedback/received/nid/'+nid+'">';
								break;
							case 23 :
							case 24 :
							case 25 :
								// case of ok album.
								one_notification += '<a style="color:black;" class="view_notification" href="/'+PROJECT_NAME+'profile/photos/uid/'+jsonData['notifications'][i][j]['album_owner_id']+'/id/'+jsonData['notifications'][i][j]['album_id']+'/nid/'+nid+'">';
								break;
							default:
								one_notification += '<a style="color:black; cursor:default !important" class="view_notification">';
								break;
							}
		        			one_notification += '<div class="today-notification-detail">';
		        			one_notification += '<font class="text-purple2">'+jsonData['notifications'][i][j]['about_user']+'</font>';
		        			one_notification += '<font style="color:black">&nbsp;'+jsonData['notifications'][i][j]['text']+'</font>&nbsp;';
		        			one_notification += '<span>'+jsonData['notifications'][i][j]['time_stamp']+'</span>';
		        			one_notification += '</div>';
		        			one_notification += '</div>';
		        			one_notification += '</a>';
		        			
		        			
		        			//If this group of notifications are already present on the page, append into that. 
		        			if(jsonData['notifications'][i][j]['notification_date'] == $("div.today-notification-outer").last().attr('id'))
		        			{
		        				$("div.today-notification-outer").last().append( one_notification );
		        			}
		        			else
		        			{
		        				var new_header = "";
		        				new_header += '<div id="Today" class="today-notification-hdr"> '+jsonData['notifications'][i][j]['notification_date']+' </div>';
		        				$("div.main_outer_div").append( new_header );
		        				
		        				var new_outer_div = "";
		        				new_outer_div += '<div id="'+jsonData['notifications'][i][j]['notification_date']+'" class="today-notification-outer"></div>';
		        				$("div.main_outer_div").append( new_outer_div );
		        				
		        				$("div.today-notification-outer").last().append( one_notification );
		        			}
		        			//Setting offset.
				        	$("input#offset").val( parseInt( $("input#offset").val() ) + 1 );
		        		}	
		        	}
		        	//Show show more div
		        	if(jsonData['is_more'])
		        	{
		        		$('div.real').show();
		        	}
		        	'<input name="unread_notification_show_more" id="unread_notification_show_more" type="hidden" value="'+jsonData['unread_notifications_count']+'"/>'; 
		        	var unread_notifications_count_for_show_more = $('input#unread_notification_show_more').val();
		        	$('td#unread_notification_count').html(unread_notifications_count_for_show_more);
	        	}
	        }
	 });
	 
	
	
}