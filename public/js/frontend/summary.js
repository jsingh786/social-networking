$(document).ready(function(){
	
	//
	if ($('span#is_summary input[type=hidden]').val() == 'not_available'){
		$("div#view_summary").hide();
		$("span#edit_summary_btn").hide();
		$("a#cancel").hide();
		$("div#edit_summary").show();
		
	}
	//
//	var validator;
	
	$("span#edit_summary_btn").click(function(){
		getAndFillMySummary( $(this) );
	});
	$("a#cancel").click(function(){
		$("div#view_summary").fadeIn("slow");
		$("span#edit_summary_btn").fadeIn("slow");
		$("div#edit_summary").hide();
	});
	
	// validate form.....
	validator = $( "form#edit_summary" ).validate({
		rules: {
			getProfessional_exp:{
				maxlength: 1500,
				required: true
//				require_from_group:[1, ".group-required"]
			},
			getProfessional_goals:{
				maxlength: 100
				
//				require_from_group:[1, ".group-required"]
			}
		}
	});
	
	
	$("input[name=save]").click(function(){
		
		if( $( "form#edit_summary" ).valid() )
		{	
			saveSummaryDetails($(this));
		}
	});

	

});

/**
 * Function to save summary details
 * version1.0
 */
function saveSummaryDetails(elem)
{
	var prof_exp = $('textarea#getProfessional_exp').val();
	var prof_goal = $('textarea#getProfessional_goals').val();
	var dataa = $("form#edit_summary").serialize();
	var idd = addLoadingImage(elem, 'before');
	
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "profile/save-my-summary",
        type: "POST",
        dataType: "json",
        data: {'dataa':dataa, 'prof_exp_val':prof_exp, 'prof_goals_val':prof_goal},
//	        cache: false,
        timeout: 50000,
        success: function(jsonData) {	    
        	$("div#view_summary.contact-details span#prof_exp").html( nl2br(jsonData.prof_exp) );
        	$("div#view_summary.contact-details span#goals").html( jsonData.prof_goals);
        	$("span#"+idd).remove();
        	
        	$("div#view_summary").fadeIn("slow");
        	
    		$("span#edit_summary_btn").fadeIn("slow");
    		$("div#edit_summary").hide();
		},
        error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
		}
    });
}

/**
 * Function to get and fill summary
 * of logged in user with ajax.
 * 
 * @author jsingh7
 * @version 1.0
 */
function getAndFillMySummary( elem )
{
	var iddd = addLoadingImage(elem, "before", 'loading_small_purple.gif', 30, 0, 'basic-info-loader');
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "profile/get-my-summary",
        type: "POST",
        dataType: "json",
        async : false,
        data: {},
//        cache: false,
        timeout: 50000,
        success: function(jsonData) {
        	$("input[name=getProfessional_exp]").text(jsonData.exp);
        	$("input[name=getProfessional_goals]").text(jsonData.goals);
        	$("span#"+iddd).remove();
        	$("div#view_summary").hide();
    		$("span#edit_summary_btn").hide();
    		$("a#cancel").show();
    		$("div#edit_summary").fadeIn("slow");
		},
        error: function(xhr, ajaxOptions, thrownError) {
			//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
		}
    });
}