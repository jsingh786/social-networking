<?php
class Admin_JobsController extends Zend_Controller_Action
{
    public function preDispatch()
    {
		if ( Auth_AdminAdapter::hasIdentity() )
		{
			//Checking admin type and redirecting accordingly
			if( Auth_AdminAdapter::getIdentity()->getRole()->getId() == 1 )//if Admin but not Sub-admin.
			{
				$sec_storage = new Zend_Session_Namespace('admin_secondary_identity_storage');
				if( !$sec_storage->id )
				{
					$this->_helper->redirector( 'secondary-authentication', 'index', 'admin' );
				}
			}
			//Checking if sub-admin and login first time then redirect to change password
			else if( Auth_AdminAdapter::getIdentity()->getRole()->getId() == 2 &&
					Auth_AdminAdapter::getIdentity()->getIs_first_time_login() == 1 )
			{
				$sec_storage = new Zend_Session_Namespace('admin_secondary_identity_storage');
				if( !$sec_storage->id )
				{
					$this->_helper->redirector( 'change-password', 'sub-admins', 'admin' );
				}
			}
		}
		else
		{
			$this->_helper->redirector( 'index', 'index', 'admin' );
		}
	
		
    }

    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
        // action body
    }
    
    
    /**
     * get jobs with pagination.
	 * Reduce code to get total job count using getJobsByParameters(ssharma4).
	 * 
     * @author sjaiswal
	 * @author ssharma4 
     * @version 1.2
     */
    public function getAllJobsAction()
    {
    	//Post parameters recieved from ajax call.
    	$params = $this->getRequest()->getParams();
    		
    	//columns to be filtered with filter text.
    	$filter_columns = array();
    	$filter_columns[] = "job.job_title";
    	$filter_columns[] = "job.job_reference";
    	$filter_columns[] = "ilook_user.email";
    	$filter_columns[] = "CONCAT( CONCAT(ilook_user.firstname, ' '), ilook_user.lastname)";
    	$filter_columns[] = "country_ref.name";
    	$filter_columns[] = "company.name";
    	$filter_columns[] = "industry_ref.title";
    		
    	//Call to method which makes query.
    	$job_collec = \Extended\job::getJobsByParameters( $params['limit'],
    			$params['offset'],
    			$params['sort_column'],
    			$params['sort_column_alias'],
    			$params['sort_column_order'],
    			$filter_columns,
    			$params['filterText'],
    			$params['countryFilterValue'] );
    	$params['total_records'] = $job_collec['total_records'];
    	$params['total_pages'] = ceil( $job_collec['total_records']/$params['limit'] );
    	$params['current_page'] = ceil( ( $params['offset']/$params['limit'] ) + 1 );
		$jobData = $job_collec['data'];
    	$respose_array = array();
    	$grid_data_array = array();
    	if( $job_collec )
    	{
    		foreach ($jobData as $key=>$job)
    		{
    			$grid_data_array[$key]['id'] 				= $job['idd'];
    			$grid_data_array[$key]['number'] 			= $key+intval($params['offset'])+1;
    			$grid_data_array[$key]['job_reference'] 	= $job['job_reference'];
    			$grid_data_array[$key]['job_title'] 		= $job['job_title'];
    			$grid_data_array[$key]['posted_by_username']= '<a target = "_blank" href = "/'.PROJECT_URL.'/'.PROJECT_NAME.$job['username'].'" >'.$job['user_full_name'].'</a>';
    			$grid_data_array[$key]['posted_by_email'] 	= $job['email'];
				$grid_data_array[$key]['posted_date'] 		= $job['posted_date']->format('j-M-Y h:i A');
				if ($job['expiry_date'])
				{
					$grid_data_array[$key]['expired_date'] = $job['expiry_date']->format('j-M-Y');
				}
				else
				{
					$grid_data_array[$key]['expired_date'] = 'Not Set';
				}
    			$grid_data_array[$key]['country'] 			= $job['country_name'];
    			$grid_data_array[$key]['company'] 			= $job['company_name'];
    			$grid_data_array[$key]['industry'] 			= $job['industry_name'];
    			$grid_data_array[$key]['job_type'] 			= $job['job_type_name'];
    			if(is_object($job['posted_date']))
    			{
    				$grid_data_array[$key]['posted_date']= $job['posted_date']->format('j-M-Y');
    			}
    			else
    			{
    				$grid_data_array[$key]['posted_date'] = "NA";
    			}
    			$grid_data_array[$key]['job_status']=$job['job_status_id'];

    		}
    	}
    		
    	$respose_array['params'] = $params;
    	$respose_array['job_data'] = $grid_data_array;
    	echo Zend_Json::encode( $respose_array );
    	die;
    }
    
    
    /**
     *
     * used to close jobs
     * @author sjaiswal
     * @version 1.0
     */
    public function closeJobsAction()
    {
    	$status = Extended\job::STATUS_CLOSED;
    	$ids_r = array_filter($this->getRequest()->getParam('ids_r'));
    	\Extended\admin::updateJobStatus( $ids_r ,$status);
    	echo Zend_Json::encode(1);
    	die;
    }
    
    /**
     *
     * used to delete jobs
     * @author sjaiswal
     * @version 1.0
     */
    public function deleteJobsAction()
    {
    	$ids_r = array_filter($this->getRequest()->getParam('ids_r'));
    	
    	foreach($ids_r as $job_id)
    	{
    		\Extended\job::deleteJob( $job_id);
    	}
    	echo Zend_Json::encode(1);
    	die;
    }

   
}





