$(document).ready(function(){
	$( "#dialog_confirm" ).dialog({modal: true,autoOpen: false});
});
function removeFromList(id){
	$('#user_'+id).slideUp("slow");
}
function changebgColor(userid, clr, flag){
	$('#user_'+userid).css('background-color', clr);
	var Allcheckbx = $("form#"+userid+" input[type=checkbox]");
	if(Allcheckbx.filter(":checked").length > 0 && Allcheckbx.length != Allcheckbx.filter(":checked").length){
		$('#supportTitle_'+userid).html(SUPPORT_TEXT);
	}
	else{
		$('#supportTitle_'+userid).html(SUPPORT_ALL_TEXT);
	}
	
	if(flag == 1){
		$('#supportDiv_'+userid).css("visibility", "visible");
		$('#support_'+userid).css("visibility", "visible");
	}else{
		$('#supportDiv_'+userid).css("visibility", "visible");
		$('#support_'+userid).css("visibility", "visible");
	}
	
}

function check_all_n_confirm(link_id){
	var support_title = $("#supportTitle_"+link_id).html();
	if(support_title == SUPPORT_ALL_TEXT ){
		$("#supportTitle_"+link_id).hide();
		$("form#"+link_id+" input[type=checkbox]").prop('checked', true);
		Supportskills(link_id);
	}else if( support_title == SUPPORT_TEXT  ){
		$("#supportTitle_"+link_id).hide();
		Supportskills(link_id);
	}
}

function Supportskills(link_id, user_id){
	
	$('div#support_img_'+user_id+' img').removeAttr("onclick");
	
	var oldSrc = IMAGE_PATH+'/icon-support2.png';
	var newSrc = IMAGE_PATH+'/icon-support2-hover.png';
	$('div#support_img_'+user_id+' img[src="' + oldSrc + '"]').attr('src', newSrc);
	
     // Code to hide or show loading image
	jQuery.ajax({
	url: "/" + PROJECT_NAME + "dashboard/support",
    type: "POST",
    dataType: "json",
    data: { 'user_id' : user_id, 'skill_id': link_id},
    timeout: 50000,
    success: function(response) {
    	if(response == true){
    		$('div#user_'+user_id).hide("slow");     		
    		}
    	}
	});
}

function disableElements(el) {
    for (var i = 0; i < el.length; i++) {
        el[i].disabled = true;

        disableElements(el[i].children);
    }
}

function enableElements(el) {
    for (var i = 0; i < el.length; i++) {
        el[i].disabled = false;

        enableElements(el[i].children);
    }
}
