$(document).ready(function(){

	showMyInboxMailCount();
	
	setInterval(function()
	{
		if( window_focus )
		{
			showMyInboxMailCount();
		}
	}, 10000);//time in milliseconds
	
	// showing up popup menu to manage bulk mails by jsingh7
	$("a#manage_mails").click(function(){
		if( isAtLeastOneCheckboxChecked( "div#mail_holder input.mail_list_cb" ) == true )
		{
			//Do your code.
			$("#manage_pop_1").fadeToggle();
		}
		else
		{
			//Do your code.
			alert("Please select atleast one mail to manage.");
		}
	});
	

	$("#hide").click(function(){
		$("#manage_pop_1").fadeToggle();
	});

	
});

/**
 * 
 */
function showMyInboxMailCount()
{
//	console.log("getting counts");
	$.ajaxQueue({
        url: "/" + PROJECT_NAME + "mail/get-unread-mail-counts-inbox-typewise",
        type: "POST",
        dataType: "json",
        data: {},
        timeout: 50000,
        success: function(jsonData) {
        //	console.log(jsonData);
        	if( jsonData[1] !== undefined )
        	{
	        	$(".inbox_email_uread_count").html(jsonData[1].cnt);
        	}
        	else
        	{
        		$(".inbox_email_uread_count").html("");
        	}	
        	if( jsonData[2] !== undefined )
        	{
	        	$(".inbox_link_req_uread_count").html(jsonData[2].cnt);
        	}
        	else
        	{
        		$(".inbox_link_req_uread_count").html("");        		
        	}	
        	if( jsonData[5] !== undefined )
        	{
        		$(".inbox_feedbk_req_uread_count").html(jsonData[5].cnt);
        	}
        	else
        	{
        		$(".inbox_feedbk_req_uread_count").html("");        		
        	}	
        	if( jsonData[6] !== undefined )
        	{
        		$(".inbox_ref_req_uread_count").html(jsonData[6].cnt);
        	}
        	else
        	{
        		$(".inbox_ref_req_uread_count").html("");        		
        	}	
        	if( jsonData[3] !== undefined )
        	{
        		$(".inbox_job_invitation_uread_count").html(jsonData[3].cnt);
        	}
        	else
        	{
        		$(".inbox_job_invitation_uread_count").html("");        		
        	}	

        }
	});
}
/**
 * Returns count of unread messages of
 * each message type of trash
 * of a user
 * 
 * @author Shaina
 * @version 1.0
 */
function showMyTrashMailCounts()
{
	if(call_get_count instanceof Object)
	{
		call_get_count.abort();
	}
	call_get_count = jQuery.ajax({
        url: "/" + PROJECT_NAME + "mail/get-trash-mail-counts",
        type: "POST",
        dataType: "json",
        data: {},
        timeout: 50000,
        success: function(jsonData) {
        	if( jsonData[1] !== undefined )
        	{
	        	$(".trash_email_uread_count").html(jsonData[1].cnt);
        	}
        	else
        	{
        		$(".inbox_email_uread_count").html("");
        	}	
        	
        }
	});
}

function isImageExist(image_url)
{
	var http = new XMLHttpRequest();
    http.open('HEAD', image_url, false);
    http.send();
    return http.status != 404;
    
}
function formCollage()
{
	//Resizing the wall thumbnails with jquery.
	$( 'img.jquerynailthumb' ).each(function( index ) {
	
    	jQuery( this ).nailthumb(
    			{
    				onStart:function(container){
    					 isImageExist( container.children('img').attr('src') );
    					if( ! isImageExist( container.children('img').attr('src') ) )
    					{
    						
    						container.children().removeClass('jquerynailthumb');
    						container.css('cursor:default');
    					}	
    					else
    					{
    						
    						
    					}
                    },
                    width: $(this).attr('rel_width'),
                    height: $(this).attr('rel_height'),
                    method:'crop',
    				onFinish:function(container){
                        container.children().removeClass('jquerynailthumb');
                    }
    			}
    		);
    });
}



/* remove attachments from imail temp reply folder 
 * @author sjaiswal
 */
function discardTempFilesforReply()
{
	if( $("form#fileattach_reply table[role=presentation] div.template-download").length > 0 )
	{
		$.ajax({
			async: false,
	        url : "/"+PROJECT_NAME+"mail/discard-attachments-for-reply",
	        data: "",
	        type: "POST"
		});
		
		$("form#fileattach_reply tbody.files").empty();
	}
}
/* remove attachments from imail temp forward folder 
 * @author sjaiswal
 */
function discardTempFilesforForward()
{
	if( $("form#fileattach_forward table[role=presentation] div.template-download").length > 0 )
	{
		$.ajax({
			async: false,
			url : "/"+PROJECT_NAME+"mail/discard-attachments-for-forward",
			data: "",
			type: "POST"
		});
		
		$("form#fileattach_forward tbody.files").empty();
	}
	
}
/**
 * attach files with forward mail content
 * param object fileData[conatins message details]
 * @author ssharma4
 */
function addFilesToBeForwarded(fileData) {
	if(fileData){
		var attchemnts = fileData.attachments;
		for(var i=0;i<attchemnts.length ;i++){
			attchemnts[i].deleteUrl = PROJECT_URL+PROJECT_NAME+'mail/initailise-jquery-file-upload-forward?file='+attchemnts[i].name;
			attchemnts[i].url = PUBLIC_PATH+'/imails/temp/forward/user_'+attchemnts[i].msg_sender_id+'/'+attchemnts[i].name;
			attchemnts[i].deleteType = 'DELETE';
			attchemnts[i].type = 'image/'+attchemnts[i].ext;
		}
		//copy files to be forwarded to user in 'imails_message_id_user_id' folder if attachment is not empty.
		if(attchemnts!="") {

			handlePaste(fileData);//Call ajax to copy file in temp/forward/user_logged_id folder.
			$('#fileupload').fileupload('option', 'done').call($('#fileupload'), $.Event('done'), {result: {files: attchemnts}});// Init fileuploader if not initialized
		}
	}

}
/**
 * make an ajax call to mail controller to copy files in temp folder to meet blueimp requirements.
 * param object fileData[conatins message details]
 * @author ssharma4
 */
function handlePaste(fileData)
{
	$.ajax({
		url:PROJECT_URL+PROJECT_NAME+'mail/copy-forwarded-files-to-temp-folder',
		dataType:'json',
		type: "POST",
		data:{'files':fileData},
		success:function(result){
			console.log(result);
		}

	})
}