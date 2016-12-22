<?php

class Admin_ReportedController extends Zend_Controller_Action
{
	/**
	 * This function checks auth storage and
	 * manage redirecting.
	 *
	 * @author Jaskaran
	 * @since 20 June, 2012
	 * @version 1.0
	 * @see Zend_Controller_Action::preDispatch()
	 *
	 */
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
					$this->_helper->redirector( 'index', 'secondary-authentication', 'admin' );
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
    
    public function deleteReportedUsersAction()
    {
	    $ids_r = array_filter($this->getRequest()->getParam('ids_r'));
    	\Extended\report_abuse::deleteReported( $ids_r );
    	echo Zend_Json::encode(1);
    	die;
    }
    
    public function getReportedUsersAction()
    {
    	//Post parameters recieved from ajax call.
    	$params = $this->getRequest()->getParams();

		//columns to be filtered with filter text.
		$filter_columns = array();
		$filter_columns[] = "CONCAT( CONCAT(reporter.firstname, ' '), reporter.lastname)";
		$filter_columns[] = "reporter.email";
		$filter_columns[] = "CONCAT( CONCAT(prfle_usr.firstname, ' '), prfle_usr.lastname)";
		$filter_columns[] = "prfle_usr.email";
    	
    	//Call to method which makes query.
    	$reported_collec = \Extended\report_abuse::getReportedByParameters( $params['limit'],
    															$params['offset'],
    															$params['sort_column'],
    															$params['sort_column_alias'],
    															$params['sort_column_order'],
    															$filter_columns,
    															$params['filterText'] );
    	
    	//For total records.
    	$total_reported_collec = \Extended\report_abuse::getReportedByParameters( null,
												    			0,
												    			$params['sort_column'],
    															$params['sort_column_alias'],
												    			$params['sort_column_order'],
												    			$filter_columns,
												    			$params['filterText'] );
    	
    	$params['total_records'] = count( $total_reported_collec );
    	$params['total_pages'] = ceil( count($total_reported_collec)/$params['limit'] );
		$params['current_page'] = ceil( ( $params['offset']/$params['limit'] ) + 1 );

    	$respose_array = array();
    	$grid_data_array = array();
    	if( $reported_collec )
    	{
	    	foreach ($reported_collec as $key=>$reported_obj)
	    	{
	    		$grid_data_array[$key]['id'] 					= $reported_obj[0]->getId();
	    		$grid_data_array[$key]['number'] 				= $key+intval($params['offset'])+1;
	    		$grid_data_array[$key]['reporter_firstname'] 	= '<a target = "_blank" href = "/'.PROJECT_NAME.$reported_obj[0]->getIlookUser()->getUsername().'" >'.$reported_obj[0]->getIlookUser()->getFirstname().'</a>';
	    		$grid_data_array[$key]['reporter_lastname'] 	= '<a target = "_blank" href = "/'.PROJECT_NAME.$reported_obj[0]->getIlookUser()->getUsername().'" >'.$reported_obj[0]->getIlookUser()->getLastname().'</a>';
	    		$grid_data_array[$key]['reporter_email'] 		= '<a target = "_blank" href = "/'.PROJECT_NAME.$reported_obj[0]->getIlookUser()->getUsername().'" >'.$reported_obj[0]->getIlookUser()->getEmail().'</a>';
	    		$grid_data_array[$key]['reported_type'] 		= $reported_obj[0]->getType();
	    		switch ( $reported_obj[0]->getType() )
	    		{
	    			case 1:
	    				$grid_data_array[$key]['reported_firstname'] = '<a target = "_blank" href = "/'.PROJECT_NAME.$reported_obj[0]->getProfileUser()->getUsername().'" >'.$reported_obj[0]->getProfileUser()->getFirstname().'</a>';
	    				$grid_data_array[$key]['reported_lastname'] = '<a target = "_blank" href = "/'.PROJECT_NAME.$reported_obj[0]->getProfileUser()->getUsername().'" >'.$reported_obj[0]->getProfileUser()->getLastname().'</a>';
	    				break;
	    			case 2:
	    				$grid_data_array[$key]['reported_firstname'] = '<a target = "_blank" href = "/'.PROJECT_NAME.$reported_obj[0]->getWallPost()->getWall_postsFrom_user()->getUsername().'" >'.$reported_obj[0]->getWallPost()->getWall_postsFrom_user()->getFirstname().'</a>';
	    				$grid_data_array[$key]['reported_lastname'] = '<a target = "_blank" href = "/'.PROJECT_NAME.$reported_obj[0]->getWallPost()->getWall_postsFrom_user()->getUsername().'" >'.$reported_obj[0]->getWallPost()->getWall_postsFrom_user()->getLastname().'</a>';
	    				break;
	    		}
	    		
	    		switch ( $reported_obj[0]->getType() )
	    		{
	    			case 1:
	    				$grid_data_array[$key]['reported_email'] = '<a target = "_blank" href = "/'.PROJECT_NAME.$reported_obj[0]->getProfileUser()->getUsername().'" >'.$reported_obj[0]->getProfileUser()->getEmail().'</a>';
	    				break;
	    			case 2:
	    				$grid_data_array[$key]['reported_email'] = '<a target = "_blank" href = "/'.PROJECT_NAME.$reported_obj[0]->getWallPost()->getWall_postsFrom_user()->getUsername().'" >'.$reported_obj[0]->getWallPost()->getWall_postsFrom_user()->getEmail().'</a>';
	    				break;
	    		}
	    		
	    		switch ( $reported_obj[0]->getType() )
				{
					case 1:
						$grid_data_array[$key]['reported'] = '<a target = "_blank" href = "/'.PROJECT_NAME.$reported_obj[0]->getProfileUser()->getUsername().'" >Take me to the Profile</a>';
						break;
					case 2:
						$grid_data_array[$key]['reported'] = '<a target = "_blank" href = "/'.PROJECT_NAME.'post/detail/id/'.$reported_obj[0]->getWallPost()->getId().'" >Take me to the Post</a>';
						break;
				}
				
	    		switch ( $reported_obj[0]->getType() )
				{
					case 1:
						$grid_data_array[$key]['reported_post_or_profile_id'] = $reported_obj[0]->getProfileUser()->getId();
						$grid_data_array[$key]['reported_profile_user_username'] = $reported_obj[0]->getProfileUser()->getUsername();
						break;
					case 2:
						$grid_data_array[$key]['reported_post_or_profile_id'] = $reported_obj[0]->getWallPost()->getId();
						break;
				}
	    	}
	    	
    	}
    	
    	$respose_array['params'] = $params;
    	$respose_array['grid_data'] = $grid_data_array;
    	
    	echo Zend_Json::encode( $respose_array );
    	die;
    }
    
    /**
     * This manages the redirection to post detail page.
     * 
     * @author jsingh7
     * @version 1.0
     */
    public function directionsForPostDetailsAction()
    {
    	//Check if the user of the owner of the post detail is logged in?
    	$wallpost_obj = \Extended\wall_post::getRowObject($this->getRequest()->getParam('post_id'));
    	if( $wallpost_obj )
    	{
    		//If some user has already logged in.(does not matter that user logged in with which mode [direct or admin])
    		if( Auth_UserAdapter::hasIdentity() )
    		{
    			//if logged in user is same as of post owner.
    			if( Auth_UserAdapter::getIdentity()->getId() == $wallpost_obj->getWall_postsFrom_user()->getId() )
    			{
    				$this->_helper->redirector( 'detail', 'post', 'default', array( 'id' => $this->getRequest()->getParam('post_id') ) );
    			}
    			else//if logged in user is different than post owner.
    			{
    				$messages = new Zend_Session_Namespace('admin_messages');
    				$messages->noticeMsg = 'Please log in to this account to see the post detail.';
    				 
    				//storing email id in session
    				$email_id_for_login = new Zend_Session_Namespace('email_id_for_login');
    				$email_id_for_login->value = $wallpost_obj->getWall_postsFrom_user()->getEmail();
    				
    				//storing post id in session
    				$after_login_redirection_session = new Zend_Session_Namespace('after_login_redirection_session');
    				$after_login_redirection_session->post_id = $this->getRequest()->getParam('post_id');
    				
    			
    				$this->_helper->redirector( 'login-as-user', 'manage-users', 'admin');
    				
    			}
    		}
    		else //If user is not logged in.
    		{
    			//Direct to Log in as user page, with prefilled user email id.
    			//When admin logs in, open the post detail page. do this with storing reference value in session.
    			$messages = new Zend_Session_Namespace('admin_messages');
    			$messages->noticeMsg = 'Please log in to this account to see the post detail.';
    			
    			//storing email id in session
    			$email_id_for_login = new Zend_Session_Namespace('email_id_for_login');
    			$email_id_for_login->value = $wallpost_obj->getWall_postsFrom_user()->getEmail();
    			
    			//storing post id in session
    			$after_login_redirection_session = new Zend_Session_Namespace('after_login_redirection_session');
    			$after_login_redirection_session->post_id = $this->getRequest()->getParam('post_id');
    		
    			$this->_helper->redirector( 'login-as-user', 'manage-users', 'admin');
    		}
    		
    	}
    	else
    	{
    		$this->_helper->redirector( 'is-not-available', 'error', 'default', array( 'message' => 'The post you are looking for does not exist anymore.' ) );
    	}		
    }
}

