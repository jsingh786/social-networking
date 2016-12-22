$(document).ready(function(){
	
	validator = $( "form#skill-form" ).validate({
		rules: {
			skill_name:{
				required : true,
				maxlength : 100
			}
		}
	});
	
	// Auto search for skills.
	skillRecords();
	
	//Show/hide skill supporters.
	$("div.showskills").click(function(){
		if($('div#skill_'+$(this).attr("skill")+':visible').length==0)
		{
			$("img.plus_minus#img_"+$(this).attr("skill")).attr("src",IMAGE_PATH+"/minus_grey.png");
		}
		else
		{
			$("img.plus_minus#img_"+$(this).attr("skill")).attr("src",IMAGE_PATH+"/plus_grey.png");
		}
		
		$("div#skill_"+$(this).attr("skill")).slideToggle();
		
	});
	
	$("input#add").click(function(){
		$("div.contact-details").slideDown();
	});
	
	$("a#cancel").click(function(){
		$("div.contact-details").slideUp();
		removeFormValidationMessages( validator );
	});
	
	
	// check whether form is valid or not, then save it.
	$("input[name=save-skillinfo]").click(function(){
		if( $( "form#skill-form" ).valid() )
		{	
			saveSkillinfo();
		}	
	});
	
	//Skills edit click.
	$("div#edit_controls img#edit").click(function(){
		$("img.plus_minus").hide();
		$("img.remove_skill").fadeIn();
		$(this).hide();
		$("label#done_edit").fadeIn();
		$("input#add").hide();
	});
	$("label#done_edit").click(function(){
		$("img.plus_minus").fadeIn();
		$("img.remove_skill").hide();
		$(this).hide();
		$("div#edit_controls img#edit").fadeIn();
		$("input#add").fadeIn();
	});
	
	$("img.remove_skill").click(function(){
		removeSkill(this, $(this).attr("rel"));
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
	      select: function(evt, ui){}	   
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
			
			if( jsonData != 0 )
			{
				$("input#skill_name").val("");
				$("a#cancel").show();
				for( i in jsonData )
				{	
					var template = "";
					template += '<div class="slide-down-content">';
					template += '<div class="slide-down-content-left" style="">';
					template += '<span style="cursor: pointer;" title="Supported by 0 link">0</span>';
					template += '<span>';
					template += ' <img class = "own_skill" src="'+IMAGE_PATH+'/icon-support.png" alt="thumb" title="">';
					template += '</span>';
					template += '</div>';						
					template += '<div class="slide-down-content-right">';
					template += '<div class="font-arial slide-down-inner showskills" skill="'+jsonData[i]['user_skill_id']+'">';
					template += '<label title = "'+jsonData[i]['user_skill_name']+'">'+showCroppedText(jsonData[i]['user_skill_name'], 70)+'</label>';
					template += '<img id="img_'+jsonData[i]['user_skill_id']+'" class="plus_minus" style="float:right;" src="'+IMAGE_PATH+'/plus_grey.png">';
					template += '</div>';
					template += '<div class = "delete-icon">';
					template += '<img id="img_'+jsonData[i]['user_skill_id']+'" class="remove_skill" rel="'+jsonData[i]['user_skill_id']+'" style="float: right; width: 16px; display: none;" src="'+IMAGE_PATH+'/remove.png">';
					template += '</div>';
					template += '<div id="skill_'+jsonData[i]['user_skill_id']+'" class="slide-down-inner-container" style="display: none;">';
					template += '<span id="no_skills">No Skill Supporter Found!</span>';
					template += '</div>';
					template += '</div>';
					template += '</div>';
					template = $(template);
					$("div.accord-content").prepend(template);
				}
				
				$("span#"+iddd).remove();
				$("div#skills-form").slideUp();
				$("input[name=add-more]").fadeIn("slow");
				$("input[name=save-skillinfo]").removeAttr('disabled');
				
				$("img.own_skill").click(function(){
					alert('You cant support your own skill.');
				});
				
				//Unbinding and binding click event of toggle again.
				$("div.showskills").unbind( "click" );
				
				$("div.showskills").click(function(){
					if($('div#skill_'+$(this).attr("skill")+':visible').length==0)
					{
						$("img.plus_minus#img_"+$(this).attr("skill")).attr("src",IMAGE_PATH+"/minus_grey.png");
					}
					else
					{
						$("img.plus_minus#img_"+$(this).attr("skill")).attr("src",IMAGE_PATH+"/plus_grey.png");
					}
					$("div#skill_"+$(this).attr("skill")).slideToggle();
				});
				
				//Unbinding and binding click event.
				$("img.remove_skill").unbind( "click" );
				$("img.remove_skill").click(function(){
					removeSkill(this, $(this).attr("rel"));
				});
				
				//Show edit controls.
				$("div#edit_controls").show();
			}
			else
			{
				alert("Error occured, please try again.");
			}	
		}
	});
}

function removeSkill(elem, user_skill_id)
{
	
	$( "#dialog-confirm" ).dialog({
		 resizable: false,
		 height:200,
		 width:303,
		 modal: true,
		 buttons: {
			 "Yes": function() 
			 {
				 $( this ).dialog( "close" );
				 var iddd = addLoadingImage( $(elem), "after", "loading_small_purple.gif", 0, 0, "delete_loading");
				 $.ajax({
						url : "/" + PROJECT_NAME + "profile/remove-skill",
						method : "POST",
						data : "user_skill_id="+user_skill_id,
						type : "post",
						dataType : "json",
						success : function(jsonData) 
						{
							if( jsonData.is_deleted == 1 )
							{
								$("img#img_"+user_skill_id).parents("div.slide-down-content").remove();
								$("span#"+iddd).remove();
								if( jsonData.do_user_have_skills == 0 )
								{
									$("div#skills-form").show();
									$("div#edit_controls").hide();
									$("a#cancel").hide();
									$("label#done_edit").hide();
									$("div#edit_controls img#edit").fadeIn();
								}
								$('div.message_box').remove();
								showDefaultMsg( "Skill deleted successfully.", 1 );
							}
						}
					});
				 
			 },
			 Cancel: {
                 click: function () {
                     $(this).dialog("close");
                 },
                 class: 'only_text',
                 text : 'Cancel'
             }
		 }

});
}