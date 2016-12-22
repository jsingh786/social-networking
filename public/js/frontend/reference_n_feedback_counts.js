var call_get_count;
var call_get_count_2;
$( document ).ready(function() {
	getPendingRequestsReceivedFeedbackCount();
	getPendingRequestsReceivedReferenceCount();
	setInterval(function()
	{
		getPendingRequestsReceivedFeedbackCount();
		getPendingRequestsReceivedReferenceCount();
	}, 60000);//time in milliseconds
});
function getPendingRequestsReceivedFeedbackCount()
{
	if(call_get_count instanceof Object)
	{
		call_get_count.abort();
	}
	call_get_count = jQuery.ajax({
    url: "/" + PROJECT_NAME + "feedback/get-pending-requests-and-received-feedbacks-count",
    type: "POST",
    dataType: "json",
    data: {},
    timeout: 50000,
    success: function(jsonData) {
    	//Showing pending feedback count. 
    	if( jsonData.pending_requests !== undefined )
    	{
        	$("font.my-pending-requests").html(jsonData.pending_requests);
        	$("label.pending_fdbk_unread_count").html(jsonData.pending_requests);
    	}
    	else
    	{
    		$("font.my-pending-requests").html("");
    		$("label.pending_fdbk_unread_count").html("");
    	}
    	
    	//Showing received feedback count.
    	if( jsonData.recieved_feedbacks !== undefined )
    	{
        	$("font.my-received-feedbacks").html(jsonData.recieved_feedbacks);
        	$("label.received_fdbk_unread_count").html(jsonData.recieved_feedbacks);
    	}
    	else
    	{
    		$("font.my-received-feedbacks").html("");
    		$("label.received_fdbk_unread_count").html("");
    	}

    }
});
}
function getPendingRequestsReceivedReferenceCount()
{
	if(call_get_count_2 instanceof Object)
	{
		call_get_count_2.abort();
	}
	call_get_count_2 = jQuery.ajax({
    url: "/" + PROJECT_NAME + "reference-request/get-pending-requests-and-received-references-count",
    type: "POST",
    dataType: "json",
    data: {},
    timeout: 50000,
    success: function(jsonData) {
    	if( jsonData.pending_requests !== undefined )
    	{
        	$("font.my-pending-ref-requests").html(jsonData.pending_requests);
        	$("label.pending_ref_uread_count").html(jsonData.pending_requests);
    	}
    	else
    	{
    		$("font.my-pending-ref-requests").html("");
    		$("label.pending_ref_uread_count").html("");
    	}	
    	if( jsonData.recieved_references !== undefined )
    	{
        	$("font.my-received-references").html(jsonData.recieved_references);
        	$("label.received_ref_unread_count").html(jsonData.recieved_references);
    	}
    	else
    	{
    		$("font.my-received-references").html("");
    		$("label.received_ref_unread_count").html("");
    	}

    }
});
}