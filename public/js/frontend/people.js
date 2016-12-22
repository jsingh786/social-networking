$(document).ready(function(){
	setTabStatus();
	validator = $( "form#advance_search_people" ).validate(
	{
		rules: 
		{
			name:
			{
				required : true
			},
		}
	});
});

function setTabStatus()
{
	if($("#usersCount").val()>0)
	{
		$("#edit-basic-info").hide();
		$(".tabStatus").html("+");
	}
	else if($("#usersCount").val()==0)
	{
		$("#edit-basic-info").hide();
		$(".tabStatus").html("-");
	}
	else
	{
		$("#edit-basic-info").show();
		$(".tabStatus").html("-");
	}
	 $(".advanced-search-inner").click(function(){
		 
		 $("#edit-basic-info").slideToggle("slow");
		 if ($(".tabStatus").html()=="+") 
		 {
			 $(".tabStatus").html("-");
		 } 
		 else
		 {
			 $(".tabStatus").html("+");
		 }
	 });
	
	 //Show/hide advanced search panel
	    $("div.jobs-rt-hdr").click(function(){
	    	
	    	 $( "div.summary-outer" ).slideToggle( function() {
	    		 if($("div.summary-outer").is(":hidden"))
	    		 {
	    			$("div.jobs-rt-hdr div.slide-down h3").css({"background": "url('"+IMAGE_PATH+"/plus_grey.png') " +
	    			" no-repeat scroll 145px center rgba(0, 0, 0, 0)","color":"#6E6E6E",
	    			"font-weight":"bold"});
	    			$("div.jobs-rt-hdr").css("background",'#FFF none repeat scroll 0% 0%');
	    			
	    		 }else{
	    			$("div.jobs-rt-hdr div.slide-down h3").css({"background": "url('"+IMAGE_PATH+"/minus-new.png')  no-repeat scroll 145px center rgba(0, 0, 0, 0)","color":"#ffffff","font-weight":"bold"});
	    			$("div.jobs-rt-hdr").css("background",'#6C518F none repeat scroll 0% 0%');
	    			
	    		 }
	    	});
	    });
}