// This js code has been provided by designers.

$(document).ready(function(){
	if($('#my-dropdown, #my-dropdown2, #my-dropdown4, #my-dropdown5, #my-dropdown6').length > 0)
	{
	    $('#my-dropdown, #my-dropdown2, #my-dropdown4, #my-dropdown5, #my-dropdown6').sSelect();
	
	    //set max height
	    $('#my-dropdownCountries').sSelect({ddMaxHeight: '300px'});
	
	    //set value on click
	    $('#setVal').click(function(){
	        $('#my-dropdown5').getSetSSValue('4');
	    });
	
	    //get value on click
	    $('#getVal').click(function(){
	        alert('The value is: '+$('#my-dropdown5').getSetSSValue());
	    });
	
	    //alert change event
	    $('#my-dropdownChange').sSelect().change(function(){alert('changed')});
	
	    //add options to select and update
	    $('#addOptions').click(function(){
	        $('#my-dropdown6').append('<option value="newOpt">New Option</option>').resetSS();
	        return false;
	    });
	}  
});