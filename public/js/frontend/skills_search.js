$(document).ready(function(){
	
});

/**
 * Function to follow skill on search skills 
 * @Param: integer skill_id, Id of a skill 
 * @Param: integer user_id (id of user who is following skill)
 * Author: sjaiswal
 * Version: 1.0
*/

function followSomeSkill(skill_id, user_id, elem)
{
	$(elem).addClass('grey');
    var val = $(elem).val();
        	jQuery.ajax({
            url: "/" + PROJECT_NAME + "skills/save-followed-skill",
            type: "POST",
            dataType: "json",
            data: { "skill_id" : skill_id, "user_id" : user_id},    
            success: function( jsonData ) 
            {
            	$(elem).removeClass('grey');
            	$(elem).val('Following');
            	$(elem).removeAttr("onclick"); 		
            },
            error: function(xhr, ajaxOptions, thrownError) {
            	alert(thrownError);
    		}
    	 });
        	 
}
