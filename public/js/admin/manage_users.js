$(document).ready(function()
{
	$('input#otp_delete_user').val("");

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
	
	//Validation for otp form.
	$( "form#otp_delete_user_form" ).validate({	
		rules: {
			otp_delete_user:{
				required: true,
				minlength: 6,
				maxlength:6
			}
		}
	});
	//First time dataload.
	listData( $("div#ilook_dt_wrapper select[name=jquery_dt_length]").val(),
				0, 	
				$('table#jquery_dt th.sorting.active').attr('db_column'),
				$('table#jquery_dt th.sorting.active').attr('db_column_alias'),
				$('table#jquery_dt th.sorting.active').attr('aria-sort'),
				0,
				$('div#ilook_dt_wrapper div.dataTables_filter input').val(),
				$('div#ilook_dt_wrapper select[name = "country_filter"]').val(),
				$('div#ilook_dt_wrapper input[name = "from_date"]').val(),
				$('div#ilook_dt_wrapper input[name = "to_date"]').val(),
				$('div#ilook_dt_wrapper select#created_from_portal').val()
			);

	//On click for sort column event binding.
	$('table#jquery_dt th.sorting').click(function()
	{
		listData( $("div.dataTables_wrapper select[name=jquery_dt_length]").val(), 
					0, 
					$(this).attr('db_column'),
					$(this).attr('db_column_alias'),
					$(this).first().attr('aria-sort'),
					0,
					$('div#ilook_dt_wrapper div.dataTables_filter input').val(),
					$('div#ilook_dt_wrapper select[name = "country_filter"]').val(),
					$('div#ilook_dt_wrapper input[name = "from_date"]').val(),
					$('div#ilook_dt_wrapper input[name = "to_date"]').val(),
					$('div#ilook_dt_wrapper select#created_from_portal').val()
				);
	});
	
	//On filter text change event binding.
	$('div#ilook_dt_wrapper div.dataTables_filter input').keyup(function() 
	{
		if( $(this).val() != jQuery.data(this, "lastvalue") )
		{
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
					$(this).val(),
					$('div#ilook_dt_wrapper select[name = "country_filter"]').val(),
					$('div#ilook_dt_wrapper input[name = "from_date"]').val(),
					$('div#ilook_dt_wrapper input[name = "to_date"]').val(),
					$('div#ilook_dt_wrapper select#created_from_portal').val()
					);
			jQuery.data(this, "lastvalue", $(this).val());
		}
	});

	//On changing country filter drop down.
	$('div#ilook_dt_wrapper select[name = "country_filter"]').change(function() {
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
					$('div#ilook_dt_wrapper div.dataTables_filter input').val(),
					$('div#ilook_dt_wrapper select[name = "country_filter"]').val(),
					$('div#ilook_dt_wrapper input[name = "from_date"]').val(),
					$('div#ilook_dt_wrapper input[name = "to_date"]').val(),
					$('div#ilook_dt_wrapper select#created_from_portal').val()
					);
			jQuery.data(this, "lastvalue", $(this).val());
	});
	
	//On changing user created_from portal filter drop down.
	$('div#ilook_dt_wrapper select#created_from_portal').change(function() {
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
				$('div#ilook_dt_wrapper div.dataTables_filter input').val(),
				$('div#ilook_dt_wrapper select[name = "country_filter"]').val(),
				$('div#ilook_dt_wrapper input[name = "from_date"]').val(),
				$('div#ilook_dt_wrapper input[name = "to_date"]').val(),
				$('div#ilook_dt_wrapper select#created_from_portal').val()
				
		);
		jQuery.data(this, "lastvalue", $(this).val());
	});
	

	//Managing list length.
	$('div#ilook_dt_wrapper div.dataTables_length').change(function() {
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
				$('div#ilook_dt_wrapper div.dataTables_filter input').val(),
				$('div#ilook_dt_wrapper select[name = "country_filter"]').val(),
				$('div#ilook_dt_wrapper input[name = "from_date"]').val(),
				$('div#ilook_dt_wrapper input[name = "to_date"]').val(),
				$('div#ilook_dt_wrapper select#created_from_portal').val()
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
				($(this).attr('data-dt-idx')-1)*$("div.dataTables_wrapper select[name=jquery_dt_length]").val(), 
				$('table#jquery_dt th.sorting.active').attr('db_column'),
				$('table#jquery_dt th.sorting.active').attr('db_column_alias'),
				sort,
				1,
				$('div#ilook_dt_wrapper div.dataTables_filter input').val(),
				$('div#ilook_dt_wrapper select[name = "country_filter"]').val(),
				$('div#ilook_dt_wrapper input[name = "from_date"]').val(),
				$('div#ilook_dt_wrapper input[name = "to_date"]').val(),
				$('div#ilook_dt_wrapper select#created_from_portal').val()
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
	

	// Deletion of users which are marked .
	// Delete 
	$("div#ilook_dt_wrapper span.buttons span#delete_records , div#ilook_dt_wrapper span.buttons span#disable_records, div#ilook_dt_wrapper span.buttons span#enable_records").click(function()
	{
		var comma_sep = '';
		$('div#ilook_dt_wrapper table#jquery_dt tbody tr td input.delete_cb:checked').each(function( index ) {
			comma_sep += $(this).val();
			comma_sep += ',';
		});
		
		if( comma_sep.trim() != '' )
		{	
			if($(this).attr('id') == "disable_records")
			{
				changeUserStatus(comma_sep.trim(),0);
			}
			else if($(this).attr('id') == "enable_records")
			{
				changeUserStatus(comma_sep.trim(),1);
			}
			else if($(this).attr('id') == "delete_records")
			{
				confirmDeleteUser( comma_sep.trim() );
			}
		}
		else
		{
			showDefaultMsg('Please select atleast one item.',2);
		}	
	});

	//Alert box confirm users deletion. On ok it calls deleteUser func.
	//Added by hkaur5
    $( "div#dialog_confirm_delete_users" ).dialog({
	      modal: true,
	      autoOpen: false,
	      draggable:false,
	      width: 370,
	      show: {
	    	  effect: "fade"
	    	  },
		  hide: {
			  effect: "fade"
			  },
	      buttons: {
	    		 OK: function() {
	 	    		$( this ).dialog( "close" );
	 	    		
	 	    
	 	    		deleteUser($(this).data('thiss')); 
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
    
	//Alert box for OTP. On Ok it calls verifyOtpAndDeleteUser(x,y)
	//Added by hkaur5
    $( "div#dialog_otp" ).dialog({
	      modal: true,
	      autoOpen: false,
	      draggable:true,
	      width: 260,
	      show: {
	    	  effect: "fade"
	    	  },
		  hide: {
			  effect: "fade"
			  },
	      buttons: {
	    		 OK: function() 
	    		 {
	    			 if($("form#otp_delete_user_form" ).valid())
    				 {
		 	    		$( this ).dialog( "close" );
		 	    		
		 	    		var otp = $('input#otp_delete_user').val();
		 	    		verifyOtpAndDeleteUser(otp, $(this).data('thiss')); 
    				 }
	 	    	},
	 	    	 Cancel: {
	 	                 click: function () 
	 	                 {
	 	                     $(this).dialog("close");
	 	                 },
	 	                 class: 'only_text',
	 	                 text : 'Cancel'
	 	             }
	      			}
    });
    
    
    
    destroyDatePickers();
	bindDatePickers();
});

/**
 * Listing of users with sorting, pagination and filteration.
 * @author jsingh7
 * 
 * @param integer limit (no. of records you want to display)
 * @param integer offset (from where you want to start records)
 * @param string sort_column (name of columns on which sorting is to be done - corresponding to db values)
 * @param string sort_column_alias (Alias of columns on which sorting is to be done - corresponding to db values)
 * @param string sort_column_order (order of colums to be sorted)
 * @param boolean keep_old_sorting (whether to keep current order or not)
 * @param string countryFilterValue (text on bais of which filteration to be done)
 * @param string fromDateFilterValue
 * @param string toDateFilterValue
 * @param integer createdFromPortalValue
 * @return html
 */
function listData( limit, 
					offset, 
					sort_column, 
					sort_column_alias, 
					sort_column_order, 
					keep_old_sorting, 
					filterText, 
					countryFilterValue,
					fromDateFilterValue,
					toDateFilterValue,
					createdFromPortalValue
					)
{

	$('div#jquery_dt_processing').show();
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "admin/manage-users/get-all-ilook-users",
        type: "POST",
        dataType: "json",
        data: {
            	'limit':limit,
            	'offset':offset, 
            	'sort_column': sort_column,
            	'sort_column_alias': sort_column_alias,
            	'sort_column_order':sort_column_order,
            	'keep_old_sorting': keep_old_sorting,
            	'filterText': filterText,
            	'countryFilterValue': countryFilterValue,
            	'fromDateFilterValue': fromDateFilterValue,
            	'toDateFilterValue':toDateFilterValue,
				'createdFromPortalValue':createdFromPortalValue
              },
        timeout: 50000,
        success: function(jsonData) {
        	var tbody = '';
        	if( jsonData.user_data.length > 0 )
        	{
            	var j;
            	//Customized part
	            for( i in jsonData.user_data )
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
		        	tbody += '<td><input type = "checkbox" name = "delete_cb[]" class = "delete_cb" onclick = "syncWithMasterCB()" value = "'+jsonData.user_data[i].id+'"></td>';
		        	tbody += '<td id = "1">'+jsonData.user_data[i].number+'</td>';
		        	tbody += '<td class = "2">'+jsonData.user_data[i].firstname+'</td>';
		        	tbody += '<td class = "3">'+jsonData.user_data[i].lastname+'</td>';
		        	tbody += '<td class = "4">'+jsonData.user_data[i].email+'</td>';
		        	tbody += '<td class = "5">'+jsonData.user_data[i].acc_created_at+'</td>';
		        	tbody += '<td class = "6">'+jsonData.user_data[i].user_name+'</td>';
		        	tbody += '<td class = "7">'+jsonData.user_data[i].last_login+'</td>';
		        	tbody += '<td class = "8">'+jsonData.user_data[i].acc_closed_on+'</td>';
		        	if(jsonData.user_data[i].city)
		        	{
		        	tbody += '<td class = "9">'+jsonData.user_data[i].country+','+jsonData.user_data[i].city+'</td>';
		        	}
		        	else
		        	{
		        	tbody += '<td class = "9">'+jsonData.user_data[i].country+'</td>';
		        	}
		        	tbody += '<td class = "10" style = "text-align:center;">';
					
		        	if( jsonData.user_data[i].user_verified )
					{
						if(jsonData.user_data[i].user_status)
						{
			        		tbody += '<a title="Enabled - Click to disable" class = "block" onclick = "changeUserStatus('+jsonData.user_data[i].id+','+0+')" target="_blank"></a>';
						}
						else
						{
							tbody += '<a title="Disabled - Click to enable" class = "unblock" onclick = "changeUserStatus('+jsonData.user_data[i].id+','+1+')" target="_blank"></a>';
						}
					}
					else
					{
						tbody += '<span title="Account not verified" class = "unblock"></span>';
					}
		        	
		        	if(jsonData.user_data[i].acc_closed_on != 'NA')
		        	{
		        		tbody += '<a  title="Closed user" style="cursor:default" class = "acc_deleted" href="javascript:void(0);" onclick =""></a>';
		        	}
		        	else
		        	{
		        		tbody += '<a title="Click to Close account" class = "delete" href="javascript:void(0);" onclick ="confirmDeleteUser('+jsonData.user_data[i].id+')"></a>';
		        	}
		        	tbody += '</td>';
		        	tbody += '</tr>';
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

	        	//----------------------------------
	        	//------------------------------------------------------------------
        	}
        	else
        	{
        		tbody += '<tr class="odd">';
        		tbody += '<td class="dataTables_empty" valign="top" colspan="10">No records found.</td>';
        		tbody += '</tr>';

        		$('div#ilook_dt_wrapper div.dataTables_info').empty();
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

        	//Special case for this module only.
        	$('span#num_of_users').html(jsonData.params.total_records);
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
 * opens confirmation dialog box to confirm user deletion.
 * @author hkaur5
 */
function confirmDeleteUser(user_ids)
{
	$( "div#dialog_confirm_delete_users" ).data('thiss',user_ids).dialog( "open" );
}

/**
 * Check otp session, if present then deleted user
 * otherwise generate new otp and opens dialog box to enter otp.
 * @param ids of users to be deleted.
 * @author hkaur5
 * 
 */
function deleteUser( ids )
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
        url: "/" + PROJECT_NAME + "admin/manage-users/check-otp-session-or-otp-or-generate-new-otp",
        type: "POST",
        dataType: "json",
        data: {
            	'ids_r': ids_r
              },
        timeout: 50000,
        success: function(jsonData) 
        {
	        if( jsonData == 1 )
	        {
	        	ids_r = [];
	        	var current_page_btn = $("div.content div#ilook_dt_wrapper div.paging_simple_numbers span#page_buttons a.paginate_button.current");
//				var next_sort;
//	        	if( $('table#jquery_dt th.sorting.active').attr('aria-sort') == "DESC" )
//	        	{
//	        		next_sort = "ASC";
//	        	}
//	        	else
//	        	{
//	        		next_sort = "DESC";
//	        	}	
        	   	//alert('Selected records has been deleted.');
	        	listData( $("div.dataTables_wrapper select[name=jquery_dt_length]").val(),
	    				(current_page_btn.attr('data-dt-idx')-1)*$("div.dataTables_wrapper select[name=jquery_dt_length]").val(), 
	    				$('table#jquery_dt th.sorting.active').attr('db_column'),
	    				$('table#jquery_dt th.sorting.active').attr('db_column_alias'),
	    				$('table#jquery_dt th.sorting.active').attr('aria-sort'),
	    				0,
	    				$('div#ilook_dt_wrapper div.dataTables_filter input').val(),
	    				$('div#ilook_dt_wrapper select[name = "country_filter"]').val(),
	    				$('div#ilook_dt_wrapper input[name = "from_date"]').val(),
	    				$('div#ilook_dt_wrapper input[name = "to_date"]').val(),
	    				$('div#ilook_dt_wrapper select#created_from_portal').val()
	    				
	    				);
	        	showDefaultMsg('User(s) account has been closed and status has been disabled.', 1);
		     
	        }
	        else if( jsonData == 5)
	        {
	        	ids_r = [];
	        	var current_page_btn = $("div.content div#ilook_dt_wrapper div.paging_simple_numbers span#page_buttons a.paginate_button.current");
//				var next_sort;
//	        	if( $('table#jquery_dt th.sorting.active').attr('aria-sort') == "DESC" )
//	        	{
//	        		next_sort = "ASC";
//	        	}
//	        	else
//	        	{
//	        		next_sort = "DESC";
//	        	}	
        	   	//alert('Selected records has been deleted.');
        	   	
	        	listData( $("div.dataTables_wrapper select[name=jquery_dt_length]").val(),
	    				(current_page_btn.attr('data-dt-idx')-1)*$("div.dataTables_wrapper select[name=jquery_dt_length]").val(), 
	    				$('table#jquery_dt th.sorting.active').attr('db_column'),
	    				$('table#jquery_dt th.sorting.active').attr('db_column_alias'),
	    				$('table#jquery_dt th.sorting.active').attr('aria-sort'),
	    				0,
	    				$('div#ilook_dt_wrapper div.dataTables_filter input').val(),
	    				$('div#ilook_dt_wrapper select[name = "country_filter"]').val(),
	    				$('div#ilook_dt_wrapper input[name = "from_date"]').val(),
						$('div#ilook_dt_wrapper input[name = "to_date"]').val(),
						$('div#ilook_dt_wrapper select#created_from_portal').val()
	    				);
	        	showDefaultMsg('User(s) account has been closed and status has been disabled.', 1);
	        }
	        else if( jsonData == 2 )
	        {
	        	$('input#otp_delete_user').val('');
	        	$( "div#dialog_otp" ).data('thiss',ids_r).dialog( "open" );
	        }
        }
	});
}

/**
 * Ajax call to validate otp and if validated then deletes 
 * selected user
 * @author hkaur5
 * @param string otp
 * @param integer ids of users to be deleted
 */
function verifyOtpAndDeleteUser( otp, ids_r )
{
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "admin/manage-users/check-otp-session-or-otp-or-generate-new-otp",
        type: "POST",
        dataType: "json",
        data: {
            	'admin_otp_to_delete_user':otp, 'ids_r': ids_r
              },
        timeout: 50000,
        success: function(jsonData) 
        {
	        if( jsonData == 3 || jsonData == 5)
	        {
	        	ids_r = [];
	        	var current_page_btn = $("div.content div#ilook_dt_wrapper div.paging_simple_numbers span#page_buttons a.paginate_button.current");
//			/	var next_sort;
//	        	if( $('table#jquery_dt th.sorting.active').attr('aria-sort') == "DESC" )
//	        	{
//	        		next_sort = "ASC";
//	        	}
//	        	else
//	        	{
//	        		next_sort = "DESC";
//	        	}
        	 //	alert('Selected records has been deleted.');
	        	listData( $("div.dataTables_wrapper select[name=jquery_dt_length]").val(),
	    				(current_page_btn.attr('data-dt-idx')-1)*$("div.dataTables_wrapper select[name=jquery_dt_length]").val(), 
	    				$('table#jquery_dt th.sorting.active').attr('db_column'),
	    				$('table#jquery_dt th.sorting.active').attr('db_column_alias'),
	    				$('table#jquery_dt th.sorting.active').attr('aria-sort'),
	    				0,
	    				$('div#ilook_dt_wrapper div.dataTables_filter input').val(),
	    				$('div#ilook_dt_wrapper select[name = "country_filter"]').val(),
	    				$('div#ilook_dt_wrapper input[name = "from_date"]').val(),
						$('div#ilook_dt_wrapper input[name = "to_date"]').val(),
						$('div#ilook_dt_wrapper select#created_from_portal').val()
	    				);
	        	showDefaultMsg('User(s) deleted successfully.', 1);
	        }
	        else if( jsonData == 4 )
	        {
	        	showDefaultMsg('You have entered wrong otp. Your otp is either expired or incorrect, Try again with new OTP.', 2);
	        }
	        else if( !jsonData )
        	{
	        	showDefaultMsg('Some error occured while deleting user. Please try again.', 2);
        	}
        }
	});
}

	/**
	 * ajax call to enable users
	 * @param integer user_ids
	 * @author hkaur5 
	 */
	function changeUserStatus( user_ids, status)
	{
		var ids_r = new Array();
		if(jQuery.isNumeric(user_ids) == true)
		{
			ids_r.push(user_ids);
		}
		else
		{
			ids_r =  user_ids.split(",");
		}
		
		var action = "enable-user";
		var msg = "enabled";
		if(status)
		{
			action = "enable-user";
			msg = "enabled";
		}
		else 
		{
			action = "disable-user";
			msg = "disabled";
		}
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "admin/manage-users/"+action,
	        type: "POST",
	        dataType: "json",
	        data: {
	            	'ids_r': ids_r
	              },
	        timeout: 50000,
	        success: function(jsonData) 
	        {
		        if( jsonData == 1)
		        {
		        	ids_r = [];
		        	var current_page_btn = $("div.content div#ilook_dt_wrapper div.paging_simple_numbers span#page_buttons a.paginate_button.current");
//					var next_sort;
//		        	if( $('table#jquery_dt th.sorting.active').attr('aria-sort') == "DESC" )
//		        	{
//		        		next_sort = "ASC";
//		        	}
//		        	else
//		        	{
//		        		next_sort = "DESC";
//		        	}
	        	 //	alert('Selected records has been deleted.');
		        	listData( $("div.dataTables_wrapper select[name=jquery_dt_length]").val(),
		    				(current_page_btn.attr('data-dt-idx')-1)*$("div.dataTables_wrapper select[name=jquery_dt_length]").val(), 
		    				$('table#jquery_dt th.sorting.active').attr('db_column'),
		    				$('table#jquery_dt th.sorting.active').attr('db_column_alias'),
		    				$('table#jquery_dt th.sorting.active').attr('aria-sort'),
		    				0,
		    				$('div#ilook_dt_wrapper div.dataTables_filter input').val(),
		    				$('div#ilook_dt_wrapper select[name = "country_filter"]').val(),
		    				$('div#ilook_dt_wrapper input[name = "from_date"]').val(),
							$('div#ilook_dt_wrapper input[name = "to_date"]').val(),
							$('div#ilook_dt_wrapper select#created_from_portal').val()
		    				);
		        	showDefaultMsg('User(s) '+msg+' successfully.', 1);

		        }
		        else
	        	{
		        	showDefaultMsg('Oops some error occured! Please try again.');
	        	}
	        }
		});
		
	}
	
	
	function bindDatePickers()
	{
		//Applying datepicker-------------
		$("input[name=from_date]").datepicker({
			dateFormat: 'yy-mm-dd',
			changeMonth: true,
	        changeYear: true,
	        showButtonPanel: false,
	        yearRange: '2015:c',
	        maxDate: '0',
			onSelect: function( selectedDate ) {
				
				$("input[name=to_date]").datepicker( "option", "minDate", selectedDate);
			//	$("input[name=to_date]").datepicker( "option", "minDate", '+1d');
				$(this).trigger("focus").trigger("blur");//to manage validations
				
				listData( $("div.dataTables_wrapper select[name=jquery_dt_length]").val(), 
								0, 
								$('table#jquery_dt th.sorting.active').attr('db_column'),
								$('table#jquery_dt th.sorting.active').attr('db_column_alias'),
								$('table#jquery_dt th.sorting.active').attr('aria-sort'),
								1,
								$('div#ilook_dt_wrapper div.dataTables_filter input').val(),
								$('div#ilook_dt_wrapper select[name = "country_filter"]').val(),
								$('div#ilook_dt_wrapper input[name = "from_date"]').val(),
								$('div#ilook_dt_wrapper input[name = "to_date"]').val(),
								$('div#ilook_dt_wrapper select#created_from_portal').val()
								);
	
			}
		});
		
		$("input[name=to_date]").datepicker({
			dateFormat: 'yy-mm-dd',
			changeMonth: true,
	        changeYear: true,
	        showButtonPanel: false,
	        yearRange: '2015:c',
	        maxDate: '0',
			onSelect: function( selectedDate ) {
				$("input[name=from_date]").datepicker( "option", "maxDate", selectedDate );
				$(this).trigger("focus").trigger("blur"); // To manage validations
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
								$('div#ilook_dt_wrapper div.dataTables_filter input').val(),
								$('div#ilook_dt_wrapper select[name = "country_filter"]').val(),
								$('div#ilook_dt_wrapper input[name = "from_date"]').val(),
								$('div#ilook_dt_wrapper input[name = "to_date"]').val(),
								$('div#ilook_dt_wrapper select#created_from_portal').val()
								);
			}
		});
		//End applying datepicker--------	
	}
	function destroyDatePickers()
	{
		$("input[name=from_date]").datepicker( "destroy" );
		$("input[name=to_date]").datepicker( "destroy" );	
	}