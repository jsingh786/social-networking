$(document).ready(function(){
	//Minimising menu
	$("div#maximised_menu").fadeOut(function(){
		$("div#minimised_menu").fadeIn();
		$("div.content-right" ).addClass('content-right-full');
		$(".dashboard-knw-adv-outer .left").css("width", "74.5%");
	});
	//--Minimising menu
	

	
});	
//function for to GET LIST OF ANOTHER ALBUMS which work on click event
var getJobCommentRequest = null;
//sunny patial
$(document).ready(function(){
	
	displayCommentBox();
	discardComment();
	updateComment();
	
	    $('#chkAll').click(function(event) {  //on click
	        if(this.checked) { // check select status
	            $('.chkbox').each(function() { //loop through each checkbox
	                this.checked = true;  //select all checkboxes with class "checkbox1"              
	            });
	        }else{
	            $('.chkbox').each(function() { //loop through each checkbox
	                this.checked = false; //deselect all checkboxes with class "checkbox1"                      
	            });        
	        }
	    });
	   
	    $('.deleteMultipleJobs').click(function(event) 
	    {  
		    	var jobIds = [];
		        $('.chkbox:checked').each(function(i)
		        {
		        	jobIds[i] = $(this).val();
		        });
		        if(jobIds.length>0){
		        	 $( "div#delete_job_dialog_confirm" ).dialog( "open" );
		        	// deleteMultipleJobs(jobIds);		        	
		        }
		        else{
		        	// please select job..
		        	$(".alert-box").remove();
		    		$(".alert-box1").remove();
		    		$(".alert-box2").remove();
		        	showDefaultMsg( "Please select job from the list.", 2 );
		        }
    	});
	
	
	  //Alert box for deleting a job.
	    $( "div#delete_job_dialog_confirm" ).dialog({
		      modal: true,
		      autoOpen: false,
		      draggable:false,
		      resizable:false,
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
		    	Cancel: {
		                    click: function () {
		                        $(this).dialog("close");
		                    },
		                    text: 'Cancel',
		                    class: 'only_text'
		             },
		    }
	    });
	    
	//Alert box for closing a job.
    $( "div#close_job_dialog_confirm" ).dialog({
	      modal: true,
	      autoOpen: false,
	      resizable: false,
	      width: 596,
	      show: {
	    	  effect: "fade"
	    	  },
    	  close:function() {
	  			$( this ).dialog( "close" );
	  			//Setting drop down previous value.
	  			$( $(this).data('thisss') ).val( $.data( $(this).data('thisss'), 'current' ) );
	  		},
		  hide: {
			  effect: "fade"
			  },
	      buttons: {
	    	 OK: function() {
	    		$( this ).dialog( "close" );
	    		closingTheJob( $( $(this).data('thisss') ).attr("id") );
	    		},
	    	Cancel: {
	                 click: function () {
	                    $(this).dialog("close");
	                   //Setting drop down previous value.
	         			$( $(this).data('thisss') ).val( $.data( $(this).data('thisss'), 'current' ) );     
	                 },
	                 class: 'only_text',
	                 text : 'Cancel'
	             }
	    }
    });
    //Alert box for changing expiry date of job (renew).
    $( "div#renew_job_dialog_box" ).dialog({
	      modal: true,
	      autoOpen: false,
	      draggable:false,
	      resizable: false,
	      width: 280,
	      height:340,
	      show: {
	    	  effect: "fade"
	    	  },
	      close:function() {
	  			$( this ).dialog( "close" );
	  			//Setting drop down previous value.
	  			$( $(this).data('renew_select_box') ).val( $.data( $(this).data('renew_select_box'), 'current' ) );
	  		},
		  hide: {
			  effect: "fade"
			  },
	      buttons: {
	    	 Renew: function() {
	    		$( this ).dialog( "close" );
	    		renewJobExpiryDate( $( $(this).data('renew_select_box') ).attr("id"),$('input#job_expiry_date').val() );
	    		}/*,
  		Cancel: function() {
  			$( this ).dialog( "close" );
  			//Setting drop down previous value.
  			$( $(this).data('renew_select_box') ).val( $.data( $(this).data('renew_select_box'), 'current' ) );
  		}*/
	    }
  });
    // close links popup on click of cross button.
	$("img.close_popup").click(function(){
		$('div#gmail_popup').bPopup().close();
	});
	
	//Share in side popup click.
	$("input#share_job_with").click(function(){
		shareJob(this);
	});
});
//applying datepicker for renew job popup.
//added by hkaur5
$(function()
		{
			//Applying datepicker-------------
			$("div#renew_job_dialog_box div").datepicker({
				dateFormat: 'dd-mm-yy',
				changeMonth: true,
		        changeYear: true,
		        maxDate: '30D',
		        minDate: '0',
		        onSelect: function( selectedDate ) {
		    		$("#date_to").datepicker( "option", "minDate", selectedDate );
		    		$("input#job_expiry_date").val(selectedDate);
		    	}
		        //showButtonPanel: true,
			});
		});
function shareBtnOption(){
	$("input.chk_all").click(function(){
		if($("input.chk_all").prop('checked') == true){
			//  $("input.gmail_cb").prop("checked",true);
			$("#gmail_import").fadeIn();
		}
		else{
			// $("input.gmail_cb").prop("checked",false);
			$("#gmail_import").fadeOut();
		}
	}); 
	
	$("input.gmail_cb").click(function(){
		if(parseInt($("input.gmail_cb:checked").length)>0){
			$("#gmail_import").fadeIn();
		}
		else{
			$("#gmail_import").fadeOut();
		} 
	 });
}
/**
 * checks the option selected from action select box and preform the function for each.
 * @author jsingh7
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
function performAction( elem )
{
	var action = $(elem).val();
	var element = elem;
	var jobId = $(elem).attr('id');
	
	switch( action )
	{
		case '4':
			promptBeforeClosingAJob( element );
			break;
		case '5':
			promptForRenewingAJob( element, jobId);
			break;
		case '6':
			shareJobPopup( element );
			break;
		
	}
}

/**
 * prompts an alert to ask for setting status of job to close.
 * @param elem
 * @author jsingh7
 */
function promptBeforeClosingAJob( elem )
{   
    $( "div#close_job_dialog_confirm" ).data('thisss', elem).dialog( "open" );
}
/**
 * Prompts a dialog box to renew a job when renew option is selected frokm actions.
 * @author hkaur5,nsingh3
 * @param elem(html control to renew job)
 * @param jobId
 */
function promptForRenewingAJob( elem, jobId )
{  
	$('div#append_div').remove();
	__addOverlay();
	$.ajax({
		url : "/" + PROJECT_NAME + "job/get-job-detail",
		method : "POST",
		data : { 'job_id' : jobId },
		type : "post",
		dataType : "json",
		beforeSend: function(){
			
		 },
		success : function(jsonData) 
		{
			var html = '';
			html += '<div id="append_div">';
			html += '<div class="chkbx-img img" style="float: left; width: auto;">';
			html += '<div style="width: 60px; border: 1px solid rgb(196, 196, 196); vertical-align: middle; text-align: center; margin: auto; float: none;">';
			html += '<img style="max-height: 60px; max-width: 60px;" src="'+PUBLIC_PATH+'/Imagehandler/GenerateImage.php?image='+ jsonData.job_image +'&amp;h=60&amp;w=60">';
			html += '</div>';
			html += '</div>';
			html += '<div class="mid" style="margin: 0px 0px 0px 10px; float: left; text-align: left; width: 330px;">';
			html += '<h4 style="cursor: default;">'+ jsonData.job_title +' | <font>'+ jsonData.job_reference +'</font></h4>';
			html += '<p style="cursor: default;">'+jsonData.company_name+'</p>';
			html += '<p style="cursor: default;">'+ jsonData.industryTitle +', '+ jsonData.job_location +'</p>';
			html += '<p style="cursor: default;">'+ jsonData.salary +' | '+ jsonData.jobTypeTitle +' | '+ jsonData.experience +'</p>';
			html +='</div>';
			html += '<div style="width: 100%; float: left; text-align: left; margin: 10px 0px; border-top: 1px solid rgb(149, 149, 149); padding: 10px 0px;" class="right">';
			html += '<div class="top" style="width: auto; float: left;">Posted Job : '+ jsonData.postedDate +' </div>';
			html += '<div id="save_job_button_holder_1067" class="bot" style="float: right;">';
			html += 'Expired Job : '+ jsonData.expiry_date +'';
			html += '</div>';
			html += '</div>';
			html += '<div style="width:100%; float:right;">New expiry date :</div>';
			html += '</div>';
			$(".job_expiry_date").parent().prepend(html);
			__removeOverlay();
		}
	});	
	
    $( "div#renew_job_dialog_box" ).data('renew_select_box', elem).dialog( "open" );
}
/**
 * Set status of job to closed.
 * @param job_id
 * @author jsingh7
 */
function closingTheJob( job_id )
{
	var jobb_id = job_id;
	__addOverlay();
	$.ajax({
		url : "/" + PROJECT_NAME + "job/set-job-status-closed",
		method : "POST",
		data : { 'job_id' : job_id },
		type : "post",
		dataType : "json",
		beforeSend: function(){
			
		 },
		success : function(jsonData) 
		{
			__removeOverlay();
//			$("tr#"+jobb_id).slideUp();
			window.location.href=document.documentURI;
		}
	});	
}
/**
 * Change expiry date of job and set to the new date selected.
 * @author hkaur5
 * @param job_id
 * @param string new_expiry_date
 */
function renewJobExpiryDate( job_id, new_expiry_date )
{
	__addOverlay();
	$.ajax({
		url : "/" + PROJECT_NAME + "job/renew-job-and-change-status-to-active",
		method : "POST",
		data : { 'job_id' : job_id , 'expiry_date' : new_expiry_date},
		type : "post",
		dataType : "json",
		beforeSend: function(){
			
		 },
		success : function(jsonData) {
			console.log(jsonData);
			__removeOverlay();
			window.location.href=document.documentURI;
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
function shareJobPopup(elem){
	__addOverlay();
	ShowContactsPopup(elem.id);
}
/**
 * Show links popup,
 * fetches and show up links
 * to add for share job.
 * 
 * @author Sunny Patial
 */
function ShowContactsPopup(id)
{
	ajax_call = jQuery.ajax(
	{
        url: "/" + PROJECT_NAME + "job/get-my-links",
        type: "POST",
        dataType: "json",
        data: {},
        timeout: 50000,
        success: function(jsonData) {
        	if( jsonData )
        	{
	        	__removeOverlay();
	        	accessHtml = "";
	        	var counter = 0;
	        	accessHtml += '<input type="hidden" name="UjobId" id="UjobId" value="'+id+'" /><ul><li><label><span><input type="checkbox" id = "gmail_main_cb" name="gmail_main_cb" value="" class="chk_all" /></span><span><b>Select All</b></span></label></li></ul>';
	        	accessHtml += '<ul>';
	        	
		    		for( i in jsonData )
		    		{
		    			
		    			accessHtml += '<li class = "mail_contacts">';
		    			accessHtml += '<span class = "import_cb">';
		    			accessHtml += '<input type="checkbox" class = "gmail_cb" name="emails[]" value="'+i+'" rel = "'+ jsonData[i].user_id +'" rel1 = "'+ jsonData[i].first_name +'" rel2 = "'+ jsonData[i].last_name +'" rel3 = "'+ jsonData[i].email +'" />';
		    			accessHtml += '</span>';
		    			accessHtml += "<div style = 'width:25px; height:25px; display:inline-block;margin: 4px 0;'><div style = 'width:25px; height:25px; display : table-cell; vertical-align: middle; text-align: center;'>" + "<img style = 'max-width: 25px; max-height: 25px; border: medium none ! important;' src='" + jsonData[i].prof_image + "' title='" + jsonData[i].first_name + " " + jsonData[i].last_name + "'/></div></div>" + "<div style='display: inline-block; padding-left: 10px;'><div class='full_name'>" + showCroppedText( jsonData[i].first_name + " " + jsonData[i].last_name, 15 ) + "</div><div class='email'>" + jsonData[i].email + "</div></div></li>";
		            	counter++;
		    		}
	        	
	        	
	    		accessHtml += '</ul>';
	    		
	            $("#modal_contacts").html(accessHtml);
	        	
	        	$('#gmail_popup').bPopup({
	        	    easing: 'easeOutBack', //uses jQuery easing plugin
	                speed: 1000,
	                transition: 'slideDown',
					closeClass : 'close_bpopup',
	                onOpen: function() {
	                }, 
	    		},
	        	function() {
	    			//Checking/unchecking checkboxes
	            	$("div#modal_contacts ul li input#gmail_main_cb").click(function(){
	            		var isAllChecked = isAllCBChecked("div#modal_contacts ul li input.gmail_cb");
	            		if( isAllChecked == 1)
	            		{
	            			$("div#modal_contacts ul li input.gmail_cb").prop("checked", false);
	            		}
	            		else
	            		{	
	            			$("div#modal_contacts ul li input.gmail_cb").prop('checked', true);
	            		}
	            		if( isAtLeastOneCheckboxChecked( "input.gmail_cb" ) == true )
	            		{
	            			$("input#gmail_import_btn").fadeIn();
	            		}
	            		else
	            		{
	            			$("input#gmail_import_btn").hide();
	            		}
	            	});
	            	$("div#modal_contacts ul li input.gmail_cb").click(function(){
	            		var isAllChecked = isAllCBChecked("div#modal_contacts ul li input.gmail_cb");
	            		if( isAllChecked == 1 )
	            		{
	            			$("div#modal_contacts ul li input#gmail_main_cb").prop('checked', true);
	            		}	
	            		else
	            		{
	            			$("div#modal_contacts ul li input#gmail_main_cb").prop('checked', false);
	            		}
	            		if( isAtLeastOneCheckboxChecked( "input.gmail_cb" ) == true )
	            		{
	            			$("input#gmail_import_btn").fadeIn();
	            		}
	            		else
	            		{
	            			$("input#gmail_import_btn").hide();
	            		}
	            	});
	            	
	            	if( counter < 0 )
	            	{
	            		$("#modal_contacts").html("<label>Oops! No contacts found to send message.</label>");
	            	}
	    		});
	        	shareBtnOption();
        	}
        	else
        	{
        		__removeOverlay();
        		$("div.message_box").remove();
        		showDefaultMsg( "You do not have any links. You may search a person to add him/her to send link request.", 1 );
        	}	
        }
	});
}
/**
 * Makes ajax call for sharing
 * a job.
 * 
 * @param job_id
 * @param elem
 * @author Sunny Patial
 */
function shareJob( elem ){
	var usersStr = "";
	$.each( $("input.gmail_cb:checked"), function( key, value ) {
		usersStr += $(value).attr("rel")+",";
		});
	var element = elem;
	$(elem).hide();
	var idd = addLoadingImage( $(elem), 'before', 'loading_medium_purple.gif', 94, 20 );
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "job/share-job",
        type: "POST",
        dataType: "json",
        data: { 'job_id' : $("#UjobId").val(), 'users_str' : usersStr },
//		cache: false,
        timeout: 50000,
        success: function(jsonData) {
        	//Show dialog after sharing.
        	if( jsonData == 1 )
        	{
        		$('span#'+idd).remove();
        		$(element).fadeIn();
        		$('div#gmail_popup').bPopup().close();
        		showDefaultMsg( "Job shared successfully.", 1 );
        	}
        	else
        	{
        		$('span#'+idd).remove();
        		$(element).fadeIn();
        		$('div#gmail_popup').bPopup().close();
        		showDefaultMsg( "Job not shared, please try again.", 2 )
        	}
        }
	});
}
