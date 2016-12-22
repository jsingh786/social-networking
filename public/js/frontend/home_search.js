$("document").ready(function(){
	//logo click
	$('#logo-inner').click(function(){
		location.href = "/"+ PROJECT_NAME ;
	});

	autoComplete( "form#home_search input#search_by_fname", "/" + PROJECT_NAME + "index/get-all-active-users/column_name/firstname" );
	autoComplete( "form#home_search input#search_by_lname", "/" + PROJECT_NAME + "index/get-all-active-users/column_name/lastname" );
	
	//Validations----------------
	validator = $( "form#home_search" ).validate({
		groups: {
            names: "first_name last_name"
        },
		rules: {
			first_name:{
				noSpace : true,
				alphaOnly : true,
				require_from_group: [1, ".search-one-textbox"]
			},
			last_name:{
				noSpace : true,
				alphaOnly : true
				//require_from_group: [1, ".search-one-textbox"]
			}
		}
	});
	//End validations------------
	
	$("a#home_search_btn").click(function(){
		if( $( "form#home_search" ).valid() )
		{	
			$("form#home_search").submit();
		}
	});
	
	//Setting up countries dropdown-----
	/*$('#my-dropdown3').sSelect().change(function(){
		$("input[name=country]").val( $('#my-dropdown3').getSetSSValue() );
	});*/
	
	$('#my-dropdown3').on('change', function() {
		$("input[name=country]").val( $(this).find(":selected").val() );
	});
	//Survey for input[name=country] value change.
	surveyInput('input[name=country]', function(){
		if( $( "form#home_search" ).valid() )
		{	
			$("form#home_search").submit();
		}
	}); 
	
	//Modal message dialog-box----------
	$( "#dialog_signup_or_login" ).dialog({
	      modal: true,
	      autoOpen: false,
	      show: {
	    	  effect: "fade"
	    	  },
    	  hide: {
    		  effect: "fade"
    		  },
	      buttons: {
	        'Sign In': function() {
	          $( this ).dialog( "close" );
	          setSession($("form#registeration_step1 input[name=search_profile_id]").val());
	          $("form#login input[name=email]").focus();
	        },
	        'Create an Account': function() {
			  $( this ).dialog( "close" );
			  $("form#registeration_step1 input[name=first_name]").focus();
	        }
	      }
	    });
	 $( ".signup_or_login_first" ).click(function() {
		 $( "#dialog_signup_or_login" ).dialog( "open" );
	 	});
});

function setSession(sessionval){
	$.ajax({
		url : "/" + PROJECT_NAME + "index/set-session",
		method : "POST",
		data : "id="+sessionval,
		type : "post",
		dataType : "json",
		success : function(jsonData){
		}
	});
}