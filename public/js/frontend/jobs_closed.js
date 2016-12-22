$(document).ready(function(){
	displayCommentBox();
	discardComment();
	updateComment();
	//Minimising menu
	$("div#maximised_menu").fadeOut(function(){
		$("div#minimised_menu").fadeIn();
		$("div.content-right" ).addClass('content-right-full');
		$(".dashboard-knw-adv-outer .left").css("width", "74.5%");
	});
});
$(document).ready(function(){
	$('.chkbox').click(function(event){  
		if ($(".chkbox:checked").length > 0)
		{
			$("#chkStatus").hide();
			$("#delMulJobs").fadeIn();
		}
		else
		{
			$("#delMulJobs").hide();
	    	$("#chkStatus").fadeIn();
	    	$("#chkAll").removeAttr("checked");
		}
	});
    $('#chkAll').click(function(event)//on click 
    {
    	$("#chkAll").attr("disabled","disabled");
    	if(this.checked) // check select status
        { 
        	$('.chkbox').each(function()//loop through each checkbox
        	{ 
        		this.checked = true;  //select all checkboxes with class "checkbox1"     
            });
        	$("#chkAll").removeAttr("disabled");
        }
        else
        {
            $('.chkbox').each(function() //loop through each checkbox
            { 
            	this.checked = false; //deselect all checkboxes with class "checkbox1"
            }); 
            $("#chkAll").removeAttr("disabled");
        }
    	if ($(".chkbox:checked").length > 0)
		{
    		$("#chkStatus").hide();
    		$("#delMulJobs").fadeIn();
    	}
    	else{
    		$("#delMulJobs").hide();
        	$("#chkStatus").fadeIn();  
    	}
    });
   
    $('.deleteMultipleJobs').click(function(event)
    {  
	    var jobIds = [];
	    $('.chkbox:checked').each(function(i)
	    {
	    	jobIds[i] = $(this).val();
	    });
	    if(jobIds.length>0)
	    {
	    	$( "div#delete_job_dialog_confirm" ).dialog( "open" );
	        	// deleteMultipleJobs(jobIds);		        	
	    }
	    else
	    {
			// please select job..
			$(".alert-box").remove();
			$(".alert-box1").remove();
			$(".alert-box2").remove();
			showDefaultMsg( "Please select job from the list.", 2 );
	    }
	});
	  //Alert box for deleting a job.
    $( "div#delete_job_dialog_confirm1" ).dialog({
	      modal: true,
	      autoOpen: false,
	      draggable:false,
	      resizable: false,
	      width: 520,
	      show: {
	    	  effect: "fade"
	    	  },
		  hide: {
			  effect: "fade"
			  },
		  close: function() {
			  $("[name=select]").val("");
			},
	      buttons: {
	    		 OK: function() {
	 	    		$( this ).dialog( "close" );
	 	    		deletingTheJob( $( $(this).data('delete_job_dialog') ).attr("id") );
	 	    		},
	 	    	Cancel: {
		                    click: function () {
		                        $(this).dialog("close");
		                        $("[name=select]").val("");
		                    },
		                    text: 'Cancel',
		                    class: 'only_text'
		             },
	    }
    });
    
	  //Alert box for deleting a job.
    $( "div#delete_job_dialog_confirm" ).dialog({
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
	 	    		
	 	    		var jobIds = [];
	 	    		$('.chkbox:checked').each(function(i){
	 	    		jobIds[i] = $(this).val();
	 	    		}); 
	 	    		
	 	    		deleteMultipleJobs(jobIds); 
	 	    		},
    		Cancel: function() {
    			$( this ).dialog( "close" );
    			//Setting drop down previous value.
    			// $( $(this).data('thisss') ).val( $.data( $(this).data('thisss'), 'current' ) );
    		}
	    }
    });
    
});
function performAction( elem )

{
	var action = $(elem).val();
	var element = elem;
	switch( action )
	{
		case '7':
			promptBeforeDeletingJob( element);
			break;
	}
}
/**
 * Prompts a dialog box to confirm from user to delete a job.
 * @author hkaur5
 * @param elem
 */
function promptBeforeDeletingJob( elem )
{   
    $( "div#delete_job_dialog_confirm1").data('delete_job_dialog', elem).dialog( "open" );
}
/**
 * Deletes the current job.
 * @param hkaur5
 * @author job_id
*/
function deletingTheJob( job_id )
{
	var jobb_id = job_id;
	__addOverlay();
	$.ajax({
		url : "/" + PROJECT_NAME + "job/delete-multiple-jobs",
		method : "POST",
		data : "jobIDs="+jobb_id,
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			if(jsonData.msg=="success")
			{
				__removeOverlay();
				window.location.href=document.documentURI;
			}
			else
			{
				window.location.href=document.documentURI;
			}
		}
	});	
}
/**
 * function used to display Comment Box
 * @author Sunny Patial
 * @version 1.0
 */
function displayCommentBox(){
	$(".commentBtns").click(function(e) {
		$(".commentBtns").fadeIn();
		$(".commentUpdateBox").hide();
		$("#commentBtn_"+$(e.currentTarget).attr("rel")).hide();
		$("#commentUpdateBox_"+$(e.currentTarget).attr("rel")).fadeIn();
	});
}
/**
 * function used, when click on discard link..
 * @author Sunny Patial
 * @version 1.0
 */
function discardComment(){
	$(".discardLink").click(function(e) {
		$("#commentUpdateBox_"+$(e.currentTarget).attr("rel")).hide();
		$("#commentBtn_"+$(e.currentTarget).attr("rel")).fadeIn();
		var text=$("#orignalCmnt_"+$(e.currentTarget).attr("rel")).val();
		$("#jobComment_"+$(e.currentTarget).attr("rel")).val(text);
	});
}
/**
 * function used, to update the comment.
 * @author Sunny Patial
 * @version 1.0
 */
function updateComment(){
	$(".updateLink").click(function(e) {
		//idsString contain Album id,Photo id.
		var jobId=$(e.currentTarget).attr("rel");
		var commentText=$("#jobComment_"+jobId).val();
		$("#imgsave_"+jobId).attr("src", "/"+PROJECT_NAME+"public/images/loading_small_black.gif");
		$("#imgsave_"+jobId).fadeIn();
		$.ajax({
			url : "/" + PROJECT_NAME + "job/update-comment",
			method : "POST",
			data : "jobID="+jobId+"&comment="+commentText,
			type : "post",
			dataType : "json",
			beforeSend: function(){
				
			 },
			success : function(jsonData) {
				$("#imgsave_"+jobId).hide();
				if(jsonData.msg="success"){
					if(commentText.length>16){
						$("#commentBtn_"+jobId).val(commentText.substr(0,16)+"...");
					}
					else{
						$("#commentBtn_"+jobId).val(commentText);
					}
					$("#jobComment_"+jobId).val(commentText);
					$("#orignalCmnt_"+jobId).val(commentText);
					
					$("#commentUpdateBox_"+jobId).hide();
					if(commentText!=""){
						$("#commentBtn_"+jobId).attr("src","/"+PROJECT_NAME+"public/images/comments-icon-purple.png");
					}
					else{
						$("#commentBtn_"+jobId).attr("src","/"+PROJECT_NAME+"public/images/comments-icon-grey.png");
					}
					$("#commentBtn_"+jobId).fadeIn();
					
				}
			}
		});		
	});
}
/**
 * checks the option selected from action select box and preform the function for each.
 * @author Sunny Patial
 * @param elem
 */
function deleteMultipleJobs(jobIds){
	$.ajax({
		url : "/" + PROJECT_NAME + "job/delete-multiple-jobs",
		method : "POST",
		data : "jobIDs="+jobIds,
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
