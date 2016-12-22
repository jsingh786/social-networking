var validator;
$(document).ready(function(){
	// remove skill
	$("#remove-skill").click(function(){
		removeSkill();
	});
	
	// validate form
	validateSkillForm();
	
	// Auto search for skills.
	skillRecords();
	
	// display add more skill module
	$("input[name=add-more]").click(function(){
			addMoreSkill();
		});
	// cancel skill here
	$("a#cancel").click(function(){
			cancelSkill();
		});
	// check whether form is valid or not then save it...
	$("input[name=save-skillinfo]").click(function(){
		if( $( "form#skill-form" ).valid() )
		{	
			saveSkillinfo();
		}	
	});
	// check whether form is valid or not then save it...
	$("input[name=update-skillinfo]").click(function(){
		if( $( "form#skill-form" ).valid() )
		{	
			updateSkillinfo();
		}	
	});
});
/**
 * function used for get skills records from the skill table
 * to setdata.
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function skillRecords(){
		var cache = {};
	    $( "input#skill_name" ).autocomplete({
	      minLength: 2,
	      source: function( request, response ) {
	  		var term = request.term;
	        if ( term in cache ) {
	          response( cache[ term ] );
	          return;
	        }
	 
	        $.getJSON( "/" + PROJECT_NAME + "profile/get-skill-list", request, function( data, status, xhr ) {
	          cache[ term ] = data;
	          response( data );
	        });
	      }, 
	      select: function(evt, ui){
	       }	   
	});		
}
/**
 * function used for cancel the new or existing record
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function cancelSkill(){
	var id=$("#user_skill_id").val();
	$("#skill"+id).fadeIn("slow");
	$("#skills-form").slideUp();
	$("input[name=add-more]").fadeIn("slow");
	
}
/**
 * function used for add more skill
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function addMoreSkill(){
	removeFormValidationMessages( validator );
	clear_form_elements("#skill-form");
	$(".un-editable-outer").fadeIn("slow");
	$("#skills-form").slideDown();
	$("input[name=add-more]").hide();
	
	$("a#cancel").fadeIn("slow");
	$("input[name=save-skillinfo]").show();
	$("input[name=update-skillinfo]").hide();
	$("#remove-skill").hide();
}
/**
 * function used for validate the skill form
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function validateSkillForm(){
	// validate form.....
	validator = $( "form#skill-form" ).validate({
		rules: {
			skill_name:{
				required : true,
				maxlength : 100
			}
		}
	});
}
/**
 * Saves skill(s),
 * and triggers renderNewSkills()
 *
 * @author sunny patial, jsingh7
 * @version 1.0 
 */
function saveSkillinfo(){
	$("input[name=save-skillinfo]").attr("disabled","disabled");
	var iddd = addLoadingImage($("input[name=save-skillinfo]"), "before");
	$str = $("form#skill-form").serialize();
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/save-skill-info",
		method : "POST",
		data : $str,
		type : "post",
		dataType : "json",
		success : function(jsonData){
			if( jsonData != "")
			{
				renderNewSkills(jsonData, iddd);
			}
			else if( jsonData == false )
			{
				$("span#"+iddd).remove();
				$("#skills-form").slideUp();
				$("input[name=add-more]").fadeIn("slow");
				$("input[name=save-skillinfo]").removeAttr('disabled');
			}
			else
			{
				alert("Some error occured, please try again.");
			}	
		}
	});
}

/**
 * function used for update existing skill
 *
 * @author sunny patial, jsingh7
 * @version 1.1
 * 
 */
function updateSkillinfo(){
	$("input[name=update-skillinfo]").attr("disabled","disabled");
	var iddd = addLoadingImage($("input[name=update-skillinfo]"), "before");
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/update-skill-info",
		method : "POST",
		data : $("form#skill-form").serialize(),
		type : "post",
		dataType : "json",
		success : function(jsonData) 
		{
			if(jsonData)
			{
				$("span#"+iddd).remove();
				$("div#skill"+jsonData.user_skill_id).css("background-color","#CABEDB");
				var htmml="";
				htmml += '<h3 style="text-transform:none;">'+jsonData.user_skill_name+'<a id="'+jsonData.user_skill_id+'" href="javascript:;" onclick="editSkill(this)"><img  src="/'+PROJECT_NAME+'/public/images/icon-pencil.png" width="16" height="16" />';
				htmml += '</a>';
				htmml += '</h3>';
				$("input[name=update-skillinfo]").removeAttr('disabled');
				$("div#skill"+jsonData.user_skill_id).html(htmml);
				$("div#skill"+jsonData.user_skill_id).fadeIn('slow');
				$("div#skill"+jsonData.user_skill_id).animate({backgroundColor: ''}, 1000);
				$("div#skills-form").slideUp();
				$("input[name=add-more]").fadeIn("slow");
			}			
		}
	});
}

/**
 * Renders newly added skills
 * at the top of the listing.
 *
 * @author sunny patial, jsingh7
 * @version 1.1
 * 
 */
function renderNewSkills(skillsAdded, id){
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/get-newly-added-skills",
		method : "POST",
		data : { "new_skills" : skillsAdded },
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			
			$("span#"+id).remove();
			$("#skills-form").slideUp();
			$("input[name=add-more]").fadeIn("slow");
			
			for( i in jsonData )
			{	
				var html="";
				html += '<div class="un-editable-outer" id="skill'+jsonData[i].user_skill_id+'" style = "background-color:'+LIGHT_PURPLE+';" >';
				html += '<h3 style="text-transform:none;">'+jsonData[i].user_skill_name+'<a id="'+jsonData[i].user_skill_id+'" href="javascript:;" onclick="editSkill(this)"><img  src="/'+PROJECT_NAME+'/public/images/icon-pencil.png" width="16" height="16" />';
				html += '</a>';
				html += '</h3></div>';
				
				//console.log(jsonData[i].user_skill_id);
				$("div#skills_outer").prepend(html);
				$("div#skill"+jsonData[i].user_skill_id).animate({backgroundColor: ''}, 1000);
			}	
			$("input[name=save-skillinfo]").removeAttr('disabled');
		}
	});
}
/**
 * function used for edit the particular skill
 * Opens skill form.
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function editSkill(elem){
	$("a#cancel").fadeIn("slow");
	var iddd = addLoadingImage($(elem), "after", 'loading_small_purple.gif', 0, 14, 'fr');
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/edit-skill",
		method : "POST",
		data : "edit_id="+elem.id,
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			$("div.un-editable-outer").fadeIn();
			removeFormValidationMessages( validator );
			$("span#"+iddd).remove();
			$("div#skill"+elem.id).hide();
			$("input[name=save-skillinfo]").hide();
			$("input[name=update-skillinfo]").show();
			$("input[type=hidden]#skill_id").val(jsonData[0].skill_id);
			$("input[type=hidden]#user_skill_id").val(elem.id);
			$("input#skill_name").val(jsonData[0].user_skill);
			$("div#skills-form").slideDown();
			$("a#remove-skill").show();
			//Smooth scrolling top.
    		$('html, body').stop().animate({
    	        scrollTop: 0
    	    }, 1000);
		}
	});
}
/**
 * function used for remove the particular skill
 *
 * @author sunny patial
 * @version 1.0
 * 
 */
function removeSkill(){
	var iddd = addLoadingImage($("#remove-skill"), "after", "loading_small_purple.gif", 0, 14);
	var id=$("#user_skill_id").val();
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/remove-skill",
		method : "POST",
		data : "remove_id="+id,
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			$("span#"+iddd).remove();
			$("#skill"+id).remove();
			if(jsonData.msg==2){
				clear_form_elements("#skill-form");
				show_first_time_entry_form();
			}
			else{
				$("#skills-form").hide();
				$("input[name=add-more]").fadeIn("slow");
			}
		}
	});
}

function show_first_time_entry_form()
{
	$("input[name=save-skillinfo]").show();
	$("input[name=add-more]").hide();
	$("input[name=update-skillinfo]").hide();	
	$("#remove-skill").hide();
	$("a#cancel").hide();
}