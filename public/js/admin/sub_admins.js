$(document).ready(function()
{
	//date picker for expiry date field for create sub-admins page
	$( "#expiry_date" ).datepicker({
		minDate : 0,
		defaultDate: "+1w",
		changeMonth: true,
		changeYear: true,
		numberOfMonths: 1,
		dateFormat:"yy-mm-dd",
		onSelect: function( selectedDate ) {
			$(this).trigger("focus").trigger("blur");//to manage validations
		},
		 beforeShow: function (input, inst) {
		        var rect = input.getBoundingClientRect();
		        setTimeout(function () {
			        inst.dpDiv.css({ top: rect.top + 40, left: rect.left + 0 });
		        }, 0);
		    }
	});
	
	
	
	// validation for create/edit  sub-admins page
	$( "#edit-subadmin" ).validate({
		errorElement: "div",
		rules: {
			first_name: {
				required: true,
				noSpace: true,
				alphaOnly:true,
				minlength: 3,
				maxlength: 30
			},
			last_name: {
				required: true,
				noSpace: true,
				alphaOnly:true,
				minlength: 3,
				maxlength: 30
			},
			email_id: {
				required: true,
				email: true,
				noSpace: true,
				remote: {
					url: "/"+PROJECT_NAME+"admin/sub-admins/check-email-exist-admin",
					type: "post",
					beforeSend:"",
					complete: "",
					data: {
							current_email: function() 
							{
								return $( "#current_email_id" ).val();
							}
					}
				}
			},
			expiry_date: {
				required: true
			},
			password: {
				ilook_admin_password : true,
				minlength : 8,
			},
			cpassword: {
				required: false,
				noSpace: true,
				minlength: 8,
				maxlength: 30,
				equalTo : '#password'
			}
		},
		messages: {
			first_name:{
				noSpace:"Please enter valid first name"
			},
			last_name:{
				noSpace:"Please enter valid last name"
			},
			email_id: {
	            remote: "Not available!"
	        },
	        expiry_date: {
				required: "Please select expiry date"
			},
			profile_pic: {
				required : 'Please upload profile pic'
			},
			cpassword:{
				noSpace:"Please enter confirm password",
				equalTo : "Passwords do not match"
			}
		}
	});
	
	//Alert box confirm users deletion. On ok it calls deleteUser func.
	//Added by hkaur5
    $( "div#dialog_confirm_delete_sub_admins" ).dialog({
	      modal: true,
	      autoOpen: false,
	      draggable:false,
	      width: 372,
	      show: {
	    	  effect: "fade"
	    	  },
		  hide: {
			  effect: "fade"
			  },
	      buttons: {
	    		 OK: function() {
	 	    		$( this ).dialog( "close" );
	 	    		deleteSubAdmins($(this).data('thiss')); 
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
    
	// Checking all checkboxes
	$("input.master_delete_cb").click(function(){
		
		if( $('input.master_delete_cb:checked').length > 0 )
		{
			$("input.delete_cb").attr("checked", "checked");
		}
		else
		{
			$("input.delete_cb").removeAttr("checked");
		}
	});	

	//First time dataload.
	listData( $("div#ilook_dt_wrapper select[name=jquery_dt_length]").val(),
				0, 	
				$('table#jquery_dt th.sorting.active').attr('db_column'),
				$('table#jquery_dt th.sorting.active').attr('db_column_alias'),
				$('table#jquery_dt th.sorting.active').attr('aria-sort'),
				0,
				$('div#ilook_dt_wrapper div.dataTables_filter input').val()
				);

	

	//On click for sort column event binding.
	$('table#jquery_dt th.sorting').click(function(){
		listData( $("div.dataTables_wrapper select[name=jquery_dt_length]").val(), 
					0, 
					$(this).attr('db_column'),
					$(this).attr('db_column_alias'),
					$(this).first().attr('aria-sort'),
					0,
					$('div#ilook_dt_wrapper div.dataTables_filter input').val()
					);
	});
	
	//On filter text change event binding.
	$('div#ilook_dt_wrapper div.dataTables_filter input').keyup(function() {
		if( $(this).val() != jQuery.data(this, "lastvalue") )
		{
			// As we are keeping old sort on this activity so, we have to send value opposite
			// to aria-sort, as aria-sort tells for next sorting.
			var sort = 'ASC';
			if( $('table#jquery_dt th.sorting.active').attr('aria-sort') == 'DESC' )
			{
				sort = 'ASC';	
			}
			else
			{
				sort = 'DESC';	
			}
			listData( $("div.dataTables_wrapper select[name=jquery_dt_length]").val(), 
					0, 
					$('table#jquery_dt th.sorting.active').attr('db_column'),
					$('table#jquery_dt th.sorting.active').attr('db_column_alias'),
					sort,
					1,
					$(this).val()
					);
			jQuery.data(this, "lastvalue", $(this).val());
		}
	});

	//Managing list length.
	$('div#ilook_dt_wrapper div.dataTables_length').change(function() {
		// As we are keeping old sort on this activity so, we have to send value opposite
		// to aria-sort, as aria-sort tells for next sorting.
		var sort = 'ASC';
		if( $('table#jquery_dt th.sorting.active').attr('aria-sort') == 'DESC' )
		{
			sort = 'ASC';	
		}
		else
		{
			sort = 'DESC';	
		}
		listData( $("div.dataTables_wrapper select[name=jquery_dt_length]").val(), 
				0, 
				$('table#jquery_dt th.sorting.active').attr('db_column'),
				$('table#jquery_dt th.sorting.active').attr('db_column_alias'),
				sort,
				1,
				$('div#ilook_dt_wrapper div.dataTables_filter input').val()
				);
	});

	//Pagination
	$('div#ilook_dt_wrapper div#jquery_dt_paginate').on('click', 'span#page_buttons a.paginate_button', function() {
		$('div#ilook_dt_wrapper a#jquery_dt_next').removeClass('disabled');
		$('div#ilook_dt_wrapper a#jquery_dt_previous').removeClass('disabled');
		if($(this).next().length == 0)
		{
			$('div#ilook_dt_wrapper a#jquery_dt_next').addClass('disabled');
		}
		
		if($(this).prev().length == 0)
		{
			$('div#ilook_dt_wrapper a#jquery_dt_previous').addClass('disabled');
		}
		
		listData( $("div.dataTables_wrapper select[name=jquery_dt_length]").val(),
				($(this).attr('data-dt-idx')-1)*$("div.dataTables_wrapper select[name=jquery_dt_length]").val(), 
				$('table#jquery_dt th.sorting.active').attr('db_column'),
				$('table#jquery_dt th.sorting.active').attr('db_column_alias'),
				$('table#jquery_dt th.sorting.active').attr('aria-sort'),
				1,
				$('div#ilook_dt_wrapper div.dataTables_filter input').val()
				);
	});
	
	$('div#ilook_dt_wrapper a#jquery_dt_previous').click(function(){
		if( $('div#ilook_dt_wrapper a.paginate_button.current').prev().length == 1 )
		{	
			$('div#ilook_dt_wrapper a.paginate_button.current').prev().click();
		}
		else
		{
			$(this).addClass('disabled');
		}	
	});
	
	$('div#ilook_dt_wrapper a#jquery_dt_next').click(function(){
		if( $('div#ilook_dt_wrapper a.paginate_button.current').next().length == 1 )
		{	
			$('div#ilook_dt_wrapper a.paginate_button.current').next().click();
		}
		else
		{
			$(this).addClass('disabled');
		}	
	});

	// Deletion
	$("div#ilook_dt_wrapper span.buttons span#delete_records").click(function(){
		var comma_sep = '';
		$('div#ilook_dt_wrapper table#jquery_dt tbody tr td input.delete_cb:checked').each(function( index ) {
			comma_sep += $(this).val();
			comma_sep += ',';
		});
		if( comma_sep.trim() != '' )
		{	
			confirmDeleteSubAdmins( comma_sep.trim() );
		}
		else
		{
			showDefaultMsg('Please select atleast one item.',4);
		}	
	}); 

	// Disable records
	$("div#ilook_dt_wrapper span.buttons span#disable_records").click(function(){
		var comma_sep = '';
		$('div#ilook_dt_wrapper table#jquery_dt tbody tr td input.delete_cb:checked').each(function( index ) {
		
			comma_sep += $(this).val();
			comma_sep += ',';
			
		});
		var selectedcheckboxeslength = $('input.delete_cb:checked').length;
		if( comma_sep.trim() != '' )
		{	
			
			disableSubAdmin( comma_sep.trim(),selectedcheckboxeslength );
		}
		else
		{
			showDefaultMsg('Please select atleast one item.',4);
		}	
});

	// enable records
	$("div#ilook_dt_wrapper span.buttons span#enable_records").click(function(){
		var comma_sep = '';
		$('div#ilook_dt_wrapper table#jquery_dt tbody tr td input.delete_cb:checked').each(function( index ) {
		
			comma_sep += $(this).val();
			comma_sep += ',';
			
		});
		var selectedcheckboxeslength = $('input.delete_cb:checked').length;
		if( comma_sep.trim() != '' )
		{	
			
			enableSubAdmin( comma_sep.trim(),selectedcheckboxeslength );
		}
		else
		{
			showDefaultMsg('Please select atleast one item.',4);
		}	
});


});


/**
 * function for listing sub-admins details
 * 
 * @author jsingh7,sjaiswal
 * @vesion 1.0
 */
function listData( limit, offset, sort_column, sort_column_alias, sort_column_order, keep_old_sorting, filterText )
{
	$('div#jquery_dt_processing').show();
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "admin/sub-admins/get-sub-admins",
        type: "POST",
        dataType: "json",
        data: {
            	'limit':limit,
            	'offset':offset, 
            	'sort_column': sort_column,
            	'sort_column_alias': sort_column_alias,
            	'sort_column_order':sort_column_order,
            	'keep_old_sorting': keep_old_sorting,
            	'filterText': filterText
              },
        timeout: 50000,
        success: function(jsonData) {
        	var tbody = '';
        	if( jsonData.grid_data.length > 0 )
        	{
            	var j;
            	//Customized part
	            for( i in jsonData.grid_data )
	            {
		            j = i;
		            if(j%2 == 0)
		            {
		        		tbody += '<tr role="row" class="odd">';
		            }
		            else
		            {
		        		tbody += '<tr role="row" class="even">';
		            }
		            
		        	tbody += '<td><input type = "checkbox" name = "delete_cb[]" class = "delete_cb" onclick = "syncWithMasterCB()" value = "'+jsonData.grid_data[i].id+'"></td>';
		        	tbody += '<td id = "1">'+jsonData.grid_data[i].number+'</td>';
		        	tbody += '<td class = "2">'+jsonData.grid_data[i].sub_admin_firstname+'</td>';
		        	tbody += '<td class = "3">'+jsonData.grid_data[i].sub_admin_lastname+'</td>';
		        	tbody += '<td class = "4">'+jsonData.grid_data[i].sub_admin_email_id+'</td>';
		        	tbody += '<td class = "5">'+jsonData.grid_data[i].sub_admin_expiry_date+'</td>';
		        	tbody += '<td class = "6">'+jsonData.grid_data[i].sub_admin_profile_picture+'</td>';
		        	tbody += '<td style="text-align:center;" class="5">';
		   
		        	if(jsonData.grid_data[i].status == true)
		        	{ 
		        	tbody += '<a class = "disable" title="enabled-click to disable" href="javascript:void(0);" onclick ="disableSubAdmin('+jsonData.grid_data[i].id+')"></a>';
		        	}
		        	else
		        	{
		        	tbody += '<a class = "enable" title="disabled-click to enable" href="javascript:void(0);" onclick ="enableSubAdmin('+jsonData.grid_data[i].id+')"></a>';
		        	} 
		        	tbody += '<a class = "edit" title="edit" href ="/'+PROJECT_NAME+"admin/sub-admins/edit/id/"+jsonData.grid_data[i].id+'"></a>';
		        	tbody += '<a class = "delete" title="delete" href="javascript:void(0);" onclick ="confirmDeleteSubAdmins('+jsonData.grid_data[i].id+')"></a>';
		        	tbody += '</td>';
		        	
	            }

		        //Information-------------------------------------------------------
	        	var starting_rec = parseInt(jsonData.params.offset)+1;
	        	var ending_rec;
	        	if( jsonData.params.current_page != jsonData.params.total_pages )
	        	{
	        		ending_rec = parseInt(jsonData.params.offset)+parseInt(jsonData.params.limit);
	        	}
	        	else
	        	{
	        		ending_rec = jsonData.params.total_records;
	        	}	
	        	$('div#ilook_dt_wrapper div.dataTables_info').html('Showing '+starting_rec+' to '+ending_rec+' of '+jsonData.params.total_records+' entries');
	        	//------------------------------------------------------------------
        	}
        	else
        	{
        		tbody += '<tr class="odd">';
        		tbody += '<td class="dataTables_empty" valign="top" colspan="10">No records found.</td>';
        		tbody += '</tr>';

        		$('div#ilook_dt_wrapper div.dataTables_info').empty()
        	}	

        	//Setting controls for sort column-----------------------------------
        	if( jsonData.params.keep_old_sorting == 0 )
        	{
	        	$('table#jquery_dt th.sorting').removeClass('sorting_asc');
	        	$('table#jquery_dt th.sorting').removeClass('sorting_desc');
	        	$('table#jquery_dt th.sorting').removeClass('active');
	        	
	        	if( $('table#jquery_dt th.sorting[db_column_alias="'+jsonData.params.sort_column_alias+'"]').attr('aria-sort') == 'DESC')
	        	{
		        	$('table#jquery_dt th.sorting[db_column_alias="'+jsonData.params.sort_column_alias+'"]').removeClass('sorting_asc');
		        	$('table#jquery_dt th.sorting[db_column_alias="'+jsonData.params.sort_column_alias+'"]').addClass('sorting_desc');
		        	$('table#jquery_dt th.sorting[db_column_alias="'+jsonData.params.sort_column_alias+'"]').attr('aria-sort', 'ASC');
		        	$('table#jquery_dt th.sorting[db_column_alias="'+jsonData.params.sort_column_alias+'"]').addClass('active');
	        	}
	        	else
	        	{
		        	$('table#jquery_dt th.sorting[db_column_alias="'+jsonData.params.sort_column_alias+'"]').removeClass('sorting_desc');
		        	$('table#jquery_dt th.sorting[db_column_alias="'+jsonData.params.sort_column_alias+'"]').addClass('sorting_asc');
		        	$('table#jquery_dt th.sorting[db_column_alias="'+jsonData.params.sort_column_alias+'"]').attr('aria-sort', 'DESC');
		        	$('table#jquery_dt th.sorting[db_column_alias="'+jsonData.params.sort_column_alias+'"]').addClass('active');
	        	}
        	}
        	//------------------------------------------------------------------
        	
        	//Setting controls for pagination-----------------------------------
			var page_buttons = '';
			for( var p=1; p <= jsonData.params.total_pages; p++ )
			{
				if( jsonData.params.total_pages > 6 )
				{	
					if( jsonData.params.current_page == 1 
							|| jsonData.params.current_page == 2
							|| jsonData.params.current_page == 3
							|| jsonData.params.current_page == 4
							)
					{	
						if( p == 1 
							|| p == 2
							|| p == 3
							|| p == 4
							|| p == 5
							|| p == jsonData.params.total_pages
						)
						{
							page_buttons += '<a class="paginate_button" aria-controls="jquery_dt" data-dt-idx="'+p+'" tabindex="0">'+p+'</a>';
							if( p == 5 )
							{
								page_buttons += '<span class="ellipsis">...</span>';
							}
						}
					}
					else if(  
							jsonData.params.current_page == jsonData.params.total_pages 
							|| jsonData.params.current_page == jsonData.params.total_pages-1
							|| jsonData.params.current_page == jsonData.params.total_pages-2
							|| jsonData.params.current_page == jsonData.params.total_pages-3
							)
					{
						if( p == 1 
								|| p == jsonData.params.total_pages-4
								|| p == jsonData.params.total_pages-3
								|| p == jsonData.params.total_pages-2
								|| p == jsonData.params.total_pages-1
								|| p == jsonData.params.total_pages
							)
							{
								if( p == jsonData.params.total_pages-4 )
								{
									page_buttons += '<span class="ellipsis">...</span>';
								}
								page_buttons += '<a class="paginate_button" aria-controls="jquery_dt" data-dt-idx="'+p+'" tabindex="0">'+p+'</a>';
							}
					}
					else
					{
						if( p == 1 
								|| p == (jsonData.params.current_page - 1)
								|| p == (jsonData.params.current_page)
								|| p == (parseInt(jsonData.params.current_page) + 1)
								|| p == jsonData.params.total_pages
							)
							{
								
								if(p == jsonData.params.total_pages )
								{
									page_buttons += '<span class="ellipsis">...</span>';
								}
								page_buttons += '<a class="paginate_button" aria-controls="jquery_dt" data-dt-idx="'+p+'" tabindex="0">'+p+'</a>';
								if( p == 1 )
								{
									page_buttons += '<span class="ellipsis">...</span>';
								}
							}
					}
				}
				else
				{
					page_buttons += '<a class="paginate_button" aria-controls="jquery_dt" data-dt-idx="'+p+'" tabindex="0">'+p+'</a>';
				}	
			}
			$('div#ilook_dt_wrapper div.paging_simple_numbers span#page_buttons').html(page_buttons);

        	$('div#ilook_dt_wrapper div.paging_simple_numbers span a.paginate_button').removeClass('current');
        	if( jsonData.params.offset == 0 )
        	{
        		$('div#ilook_dt_wrapper div.paging_simple_numbers span a.paginate_button[data-dt-idx=1]').addClass('current');
        	}
        	else
        	{
            	var page_num = parseInt(jsonData.params.offset/jsonData.params.limit) + parseInt(1);
        		$('div#ilook_dt_wrapper div.paging_simple_numbers span a.paginate_button[data-dt-idx='+page_num+']').addClass('current');
        	}
        	//------------------------------------------------------------------

        	
        	$('div#ilook_dt_wrapper tbody').html(tbody);
	        $('div#jquery_dt_processing').hide();

			//Adding class to show sorted column--------------------------------
	        var header_index = $('table#jquery_dt th.sorting[db_column_alias="'+jsonData.params.sort_column_alias+'"]').attr('position');
        	$('div#ilook_dt_wrapper table.dataTable tbody tr td:nth-child('+header_index+')').addClass('sorting_1');
        	//------------------------------------------------------------------
	        
        }
	});
}


function syncWithMasterCB()
{
	if( isAllCBChecked("input.delete_cb") )
	{
		$("input.master_delete_cb").attr("checked", "checked");
	}
	else
	{
		$("input.master_delete_cb").removeAttr("checked");
	}	
}


/**
 * function for deleting sub-admins 
 * 
 * @author jsingh7,sjaiswal
 * @vesion 1.0
 */
function deleteSubAdmins( ids )
{
	var ids_r = new Array();
	if(jQuery.isNumeric(ids) == true)
	{
		ids_r.push(ids);
	}
	else
	{
		ids_r =  ids.split(",");
	}
		
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "admin/sub-admins/delete-sub-admin",
        type: "POST",
        dataType: "json",
        data: {
            	'ids_r': ids_r
              },
        timeout: 50000,
        success: function(jsonData) {
	        if( jsonData == 1 )
	        {
	        	ids_r = [];
	        	var current_page_btn = $("div.content div#ilook_dt_wrapper div.paging_simple_numbers span#page_buttons a.paginate_button.current");
				var next_sort;
	        	if( $('table#jquery_dt th.sorting.active').attr('aria-sort') == "DESC" )
	        	{
	        		next_sort = "ASC";
	        	}
	        	else
	        	{
	        		next_sort = "DESC";
	        	}	
	        	listData( $("div.dataTables_wrapper select[name=jquery_dt_length]").val(),
	    				(current_page_btn.attr('data-dt-idx')-1)*$("div.dataTables_wrapper select[name=jquery_dt_length]").val(), 
	    				$('table#jquery_dt th.sorting.active').attr('db_column'),
	    				$('table#jquery_dt th.sorting.active').attr('db_column_alias'),
	    				next_sort,
	    				1,
	    				$('div#ilook_dt_wrapper div.dataTables_filter input').val()
	    				);
		        showDefaultMsg('Selected sub-admin(s) has been deleted.',1);
	        }
        }
	});
}


/**
 * function for enable sub-admins 
 * 
 * @author jsingh7,sjaiswal
 * @vesion 1.0
 */
function enableSubAdmin( ids ,checkboxlength)
{
	var ids_r = new Array();
	if(jQuery.isNumeric(ids) == true)
	{
		ids_r.push(ids);
	}
	else
	{
		ids_r =  ids.split(",");
	}
		
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "admin/sub-admins/enable-sub-admin",
        type: "POST",
        dataType: "json",
        data: {
            	'ids_r': ids_r
              },
        timeout: 50000,
        success: function(jsonData) {
	        if( jsonData == 1 )
	        {
	        	ids_r = [];
	        	var current_page_btn = $("div.content div#ilook_dt_wrapper div.paging_simple_numbers span#page_buttons a.paginate_button.current");
				var next_sort;
	        	if( $('table#jquery_dt th.sorting.active').attr('aria-sort') == "DESC" )
	        	{
	        		next_sort = "ASC";
	        	}
	        	else
	        	{
	        		next_sort = "DESC";
	        	}	
	        	listData( $("div.dataTables_wrapper select[name=jquery_dt_length]").val(),
	    				(current_page_btn.attr('data-dt-idx')-1)*$("div.dataTables_wrapper select[name=jquery_dt_length]").val(), 
	    				$('table#jquery_dt th.sorting.active').attr('db_column'),
	    				$('table#jquery_dt th.sorting.active').attr('db_column_alias'),
	    				next_sort,
	    				1,
	    				$('div#ilook_dt_wrapper div.dataTables_filter input').val()
	    				);
	        
		        showDefaultMsg('Sub-admin(s) has been enabled successfully.',1);
				
	        }
        }
	});
}

/**
 * function for disable sub-admins 
 * 
 * @author jsingh7,sjaiswal
 * @vesion 1.0
 */
function disableSubAdmin( ids , checkboxlength)
{
	
	var ids_r = new Array();

	
	if(jQuery.isNumeric(ids) == true)
	{
		ids_r.push(ids);
	}
	else
	{
		ids_r =  ids.split(",");
		
	}
	
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "admin/sub-admins/disable-sub-admin",
        type: "POST",
        dataType: "json",
        data: {
            	'ids_r': ids_r
              },
        timeout: 50000,
        success: function(jsonData) {
	        if( jsonData == 1 )
	        {
	        	ids_r = [];
	        	var current_page_btn = $("div.content div#ilook_dt_wrapper div.paging_simple_numbers span#page_buttons a.paginate_button.current");
				var next_sort;
	        	if( $('table#jquery_dt th.sorting.active').attr('aria-sort') == "DESC" )
	        	{
	        		next_sort = "ASC";
	        	}
	        	else
	        	{
	        		next_sort = "DESC";
	        	}	
	        	listData( $("div.dataTables_wrapper select[name=jquery_dt_length]").val(),
	    				(current_page_btn.attr('data-dt-idx')-1)*$("div.dataTables_wrapper select[name=jquery_dt_length]").val(), 
	    				$('table#jquery_dt th.sorting.active').attr('db_column'),
	    				$('table#jquery_dt th.sorting.active').attr('db_column_alias'),
	    				next_sort,
	    				1,
	    				$('div#ilook_dt_wrapper div.dataTables_filter input').val()
	    				);
	        	
				
		        showDefaultMsg('Sub-admin(s) has been disabled successfully.',1);
				
	        }
        }
	});
}

/**
 * opens confirmation dialog box to confirm sub-admin deletion.
 * @author hkaur5
 */
function confirmDeleteSubAdmins(user_ids)
{
	$( "div#dialog_confirm_delete_sub_admins" ).data('thiss',user_ids).dialog( "open" );
}

/**
 * remove sub-admin profile picture
 * @author sjaiswal
 * @param user_id integer
 * @version 1.0
 */

function removeSubAdminProfilePicture(user_id)
{
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "admin/sub-admins/remove-profile-picture",
        type: "POST",
        dataType: "json",
        data: {
            	'user_id': user_id
              },
        timeout: 50000,
        success: function(jsonData) {
	        if( jsonData == 1 )
	        {
		        showDefaultMsg('Profile picture removed.',1);
		        $('#admin_profile_image').hide();
		        $('.cross_image_icon').hide();
			}
			else
			{
				showDefaultMsg('Profile picture not removed.',1);
			}
        }
        
	});
}
