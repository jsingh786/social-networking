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
				$('div#ilook_dt_wrapper select[name = "country_filter"]').val()
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
					$('div#ilook_dt_wrapper select[name = "country_filter"]').val()
				);
	});
	
	//On filter text change event binding.
	$('div#ilook_dt_wrapper div.dataTables_filter input').keyup(function() 
	{
		if( $(this).val() != jQuery.data(this, "lastvalue") )
		{
			listData( $("div.dataTables_wrapper select[name=jquery_dt_length]").val(), 
					0, 
					$('table#jquery_dt th.sorting.active').attr('db_column'),
					$('table#jquery_dt th.sorting.active').attr('db_column_alias'),
					$('table#jquery_dt th.sorting.active').attr('aria-sort'),
					1,
					$(this).val(),
					$('div#ilook_dt_wrapper select[name = "country_filter"]').val()
					);
			jQuery.data(this, "lastvalue", $(this).val());
		}
	});

	//On changing country filter drop down.
	$('div#ilook_dt_wrapper select[name = "country_filter"]').change(function() {
			listData( $("div.dataTables_wrapper select[name=jquery_dt_length]").val(), 
					0, 
					$('table#jquery_dt th.sorting.active').attr('db_column'),
					$('table#jquery_dt th.sorting.active').attr('db_column_alias'),
					$('table#jquery_dt th.sorting.active').attr('aria-sort'),
					1,
					$('div#ilook_dt_wrapper div.dataTables_filter input').val(),
					$('div#ilook_dt_wrapper select[name = "country_filter"]').val()
					);
			jQuery.data(this, "lastvalue", $(this).val());
	});

	//Managing list length.
	$('div#ilook_dt_wrapper div.dataTables_length').change(function() {

		listData( $("div.dataTables_wrapper select[name=jquery_dt_length]").val(), 
				0, 
				$('table#jquery_dt th.sorting.active').attr('db_column'),
				$('table#jquery_dt th.sorting.active').attr('db_column_alias'),
				$('table#jquery_dt th.sorting.active').attr('aria-sort'),
				1,
				$('div#ilook_dt_wrapper div.dataTables_filter input').val(),
				$('div#ilook_dt_wrapper select[name = "country_filter"]').val()
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
				$('div#ilook_dt_wrapper select[name = "country_filter"]').val()
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

	// Delete or close jobs which are marked .
	$("div#ilook_dt_wrapper span.buttons span#close_records,div#ilook_dt_wrapper span.buttons span#delete_records").click(function(){
		var comma_sep = '';
		$('div#ilook_dt_wrapper table#jquery_dt tbody tr td input.delete_cb:checked').each(function( index ) {
			comma_sep += $(this).val();
			comma_sep += ',';
		});
		
		
		if( comma_sep.trim() != '' )
		{	
			if($(this).attr('id') == "close_records")
			{
				confirmCloseJob(comma_sep.trim()); // close jobs
			}
			else if($(this).attr('id') == "delete_records")
			{
				confirmDeleteJob(comma_sep.trim()); // delete jobs
			}
			
		}
		else
		{
			showDefaultMsg('Please select atleast one item.',4);
		}	
	}); 

	
	//Alert box confirm job deletion. On ok it calls deleteJobs func.
	//Added by sjaiswal
    $( "div#dialog_confirm_delete_jobs" ).dialog({
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
	 	    		
	 	    
	 	    		deleteJobs($(this).data('thiss')); 
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
    

	//Alert box confirm users deletion. On ok it calls deleteUser func.
	//Added by hkaur5,sjaiswal
    $( "div#dialog_confirm_close_jobs" ).dialog({
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
	 	    		closeJobs($(this).data('thiss')); 
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
    
    
	
});

/**
 * Listing of jobs with sorting, pagination and filteration.
 * @author jsingh7,sjaiswal
 * 
 * @param integer no. of records you want to display
 * @param integer from where you want to start records
 * @param string name of columns on which sorting is to be done - corresponding to db values
 * @param string Alias of columns on which sorting is to be done - corresponding to db values
 * @param string order of colums to be sorted
 * @param boolean whether to keep current order or not
 * @param string text on basis of which filteration to be done
 * @return html
 */
function listData( limit, offset, sort_column, sort_column_alias, sort_column_order, keep_old_sorting, filterText, countryFilterValue )
{
	$('div#jquery_dt_processing').show();
	jQuery.ajax({
        url: "/" + PROJECT_NAME + "admin/jobs/get-all-jobs",
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
            	'countryFilterValue': countryFilterValue
              },
        timeout: 50000,
        success: function(jsonData) {
        	var tbody = '';
        	if( jsonData.job_data.length > 0 )
        	{
            	var j;
            	//Customized part
	            for( i in jsonData.job_data )
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
		        	tbody += '<td><input type = "checkbox" name = "delete_cb[]" class = "delete_cb" onclick = "syncWithMasterCB()" value = "'+jsonData.job_data[i].id+'"></td>';
		        	tbody += '<td id = "1">'+jsonData.job_data[i].number+'</td>';
		        	tbody += '<td class = "2">'+jsonData.job_data[i].job_reference+'</td>';
		        	tbody += '<td class = "3"><a href="#" title="'+jsonData.job_data[i].job_title+'">'+showCroppedText(jsonData.job_data[i].job_title,20)+'</a></td>';
		        	tbody += '<td class = "4">'+jsonData.job_data[i].posted_by_email+'</td>';
		        	tbody += '<td class = "5">'+jsonData.job_data[i].posted_by_username+'</td>';
		        	tbody += '<td class = "6">'+jsonData.job_data[i].posted_date+'</td>';
		        	tbody += '<td class = "7">'+jsonData.job_data[i].expired_date+'</td>';
		        	tbody += '<td class = "8">'+jsonData.job_data[i].country+'</td>';
		        	tbody += '<td class = "8">'+jsonData.job_data[i].company+'</td>';
		        	tbody += '<td class = "8">'+jsonData.job_data[i].industry+'</td>';
		        	tbody += '<td class = "9" style = "text-align:center;">';
					
		        	// if job status is active or expired admin can close job
		        	if(jsonData.job_data[i].job_status == 4) // job status is closed
		        	{
		        		tbody += '<a  title="Closed job" style="cursor:default" class = "acc_deleted" href="javascript:void(0);" ></a>';
		        	}
		        	else  // job status is active or expired
		        	{
		        		tbody += '<a title="Click to Close job" class = "close_icon" href="javascript:void(0);" onclick ="confirmCloseJob('+jsonData.job_data[i].id+')"></a>';
		        	}
		        	
		        	tbody += '<a title="Delete job" class="delete" href="javascript:void(0);" onclick="confirmDeleteJob('+jsonData.job_data[i].id+')"></a>';
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
	 * opens confirmation dialog box to confirm close job.
	 * @author sjaiswal
	 */
	function confirmCloseJob(job_ids)
	{
		$( "div#dialog_confirm_close_jobs" ).data('thiss',job_ids).dialog( "open" );
		
	}
	
	/**
	 * opens confirmation dialog box to delete jobs.
	 * @author sjaiswal
	 */
	function confirmDeleteJob(job_ids)
	{
		$( "div#dialog_confirm_delete_jobs" ).data('thiss',job_ids).dialog( "open" );
		
	}
	
	
	
	/**
	 * function for deleting sub-admins 
	 * 
	 * @author jsingh7,sjaiswal
	 * @vesion 1.0
	 */
	function closeJobs( ids )
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
	        url: "/" + PROJECT_NAME + "admin/jobs/close-jobs",
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
			        showDefaultMsg('Selected jobs has been closed.',1);
		        }
	        }
		});
	}

	
	/**
	 * function for deleting sub-admins 
	 * 
	 * @author jsingh7,sjaiswal
	 * @vesion 1.0
	 */
	function deleteJobs( ids )
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
	        url: "/" + PROJECT_NAME + "admin/jobs/delete-jobs",
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
			        showDefaultMsg('Selected jobs has been deleted.',1);
		        }
	        }
		});
	}
