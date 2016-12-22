<?php

class Admin_ActivitiesController extends Zend_Controller_Action
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

    public function deleteAdminActivitiesAction()
    {
    	$ids_r = array_filter($this->getRequest()->getParam('ids_r'));
    	\Extended\admin_activity_log::deleteAdminActivities( $ids_r );
    	echo Zend_Json::encode(1);
    	die;
    }
    
    public function getAdminActivitiesAction()
    {
    	//Post parameters recieved from ajax call.
    	$params = $this->getRequest()->getParams();
    	 
    	//columns to be filtered with filter text.
    	$filter_columns = array();
    	$filter_columns[] = "ilk_usr.firstname";
    	$filter_columns[] = "ilk_usr.lastname";
    	$filter_columns[] = "CONCAT( CONCAT(ilk_usr.firstname, ' '), ilk_usr.lastname)";
    	$filter_columns[] = "ilk_usr.email";
    	$filter_columns[] = "ilk_usr.username";
    	$filter_columns[] = "admn.firstname";
    	$filter_columns[] = "admn.lastname";
    	$filter_columns[] = "CONCAT( CONCAT(admn.firstname, ' '), admn.lastname)";
    	$filter_columns[] = "admn.email_id";
    	$filter_columns[] = "acts.module";
    	$filter_columns[] = "acts.created_at";
    	 
    	//Call to method which makes query.
    	$acts_collec = \Extended\admin_activity_log::getAdminActivitiesByParameters( $params['limit'],
    			$params['offset'],
    			$params['sort_column'],
    			$params['sort_column_alias'],
    			$params['sort_column_order'],
    			$filter_columns,
    			$params['filterText'] );
//     	 Zend_Debug::dump($acts_collec);
//     	 die;
    	//For total records.
    	$total_acts_collec = \Extended\admin_activity_log::getAdminActivitiesByParameters( null,
    			0,
    			$params['sort_column'],
    			$params['sort_column_alias'],
    			$params['sort_column_order'],
    			$filter_columns,
    			$params['filterText'] );
    	 
    	$params['total_records'] = count( $total_acts_collec );
    	$params['total_pages'] = ceil( count($total_acts_collec)/$params['limit'] );
    	$params['current_page'] = ceil( ( $params['offset']/$params['limit'] ) + 1 );
    
    	$respose_array = array();
    	$grid_data_array = array();
    	if( $acts_collec )
    	{
    		foreach ( $acts_collec as $key=>$acts_obj )
    		{
    			
    			$grid_data_array[$key]['id'] 					= $acts_obj[0]->getId();
    			$grid_data_array[$key]['number'] 				= $key+intval($params['offset'])+1;
    			$grid_data_array[$key]['ilook_user_firstname'] 	= '<a target = "_blank" href = "/'.PROJECT_URL.'/'.PROJECT_NAME.'profile/iprofile/id/'.$acts_obj[0]->getIlookUser()->getId().'" >'.$acts_obj[0]->getIlookUser()->getFirstname().'</a>';
    			$grid_data_array[$key]['ilook_user_lastname'] 	= '<a target = "_blank" href = "/'.PROJECT_URL.'/'.PROJECT_NAME.'profile/iprofile/id/'.$acts_obj[0]->getIlookUser()->getId().'" >'.$acts_obj[0]->getIlookUser()->getLastname().'</a>';
    			$grid_data_array[$key]['ilook_user_email_id'] 		= '<a target = "_blank" href = "/'.PROJECT_URL.'/'.PROJECT_NAME.'profile/iprofile/id/'.$acts_obj[0]->getIlookUser()->getId().'" >'.$acts_obj[0]->getIlookUser()->getEmail().'</a>';
    			$grid_data_array[$key]['ilook_user_username'] 	= '<a target = "_blank" href = "/'.PROJECT_URL.'/'.PROJECT_NAME.'profile/iprofile/id/'.$acts_obj[0]->getIlookUser()->getId().'" >'.$acts_obj[0]->getIlookUser()->getUsername().'</a>';

    			$grid_data_array[$key]['admin_firstname'] 		= $acts_obj[0]->getAdmin()->getFirstname();
    			$grid_data_array[$key]['admin_lastname'] 		= $acts_obj[0]->getAdmin()->getLastname();
    			$grid_data_array[$key]['admin_email_id'] 		= $acts_obj[0]->getAdmin()->getEmail_id();
    			
    			$grid_data_array[$key]['module'] 				= $acts_obj[0]->getModule();
    			
    			$grid_data_array[$key]['date_n_time'] 			= $acts_obj[0]->getCreated_at()->format('j-M-Y h:i:s A');
    		}
    
    	}
    	 
    	$respose_array['params'] = $params;
    	$respose_array['grid_data'] = $grid_data_array;
    	 
    	echo Zend_Json::encode( $respose_array );
    	die;
    }

}

