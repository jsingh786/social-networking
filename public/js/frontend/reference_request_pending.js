$(document).ready(function(){
	//Expanding the feedback that are showing up as cropped.
	$("span.show_more").click(function(){
		var ref_id = $(this).attr("rel");
		$('div#clickable_text_div_'+ref_id).hide();
		$("div#full_text_"+ref_id).fadeIn(1000);
	});
	//Collapsing feedback text back to cropped form.
	$("span.show_less").click(function(){
		var ref_id = $(this).attr("rel");
		$('div#full_text_'+ref_id).hide();
		$("div#clickable_text_div_"+ref_id ).fadeIn(1000);
	});
});	
