<?php

class Admin_SubAdminsController extends Zend_Controller_Action
{
	/**
	 * This function checks auth storage and
	 * manage redirecting.
	 *
	 * @author Jsingh7
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
    	if(Auth_AdminAdapter::getIdentity()->getRole()->getId() == 2)
    	{
    		$this->_redirect( PROJECT_URL."/".PROJECT_NAME."admin/sub-admins/edit/".Auth_AdminAdapter::getIdentity()->getId());
    	}
    	
    }

    public function createAction()
    {
        // action body
    }
    
    
    /**
     *
     * used to get subadmins list
     * @author sjaiswal
     * @version 1.0
     */
    public function getSubAdminsAction()
    {
    	$params = $this->getRequest()->getParams();
    	
    	//columns to be filtered with filter text.
    	$filter_columns = array();
    	$filter_columns[] = "CONCAT( CONCAT(sub_admin.firstname, ' '), sub_admin.lastname)";
    	$filter_columns[] = "sub_admin.email_id";
    	
    	//Call to method which makes query.
    	$sub_admin_collec = \Extended\admin::getSubAdminsByParameters( $params['limit'],
    			$params['offset'],
    			$params['sort_column'],
    			$params['sort_column_alias'],
    			$params['sort_column_order'],
    			$filter_columns,
    			$params['filterText'] );
    	
    	//For total records.
    	$total_sub_admin_collec = \Extended\admin::getSubAdminsByParameters( null,
    			0,
    			$params['sort_column'],
    			$params['sort_column_alias'],
    			$params['sort_column_order'],
    			$filter_columns,
    			$params['filterText'] );
    	
    	
    	$params['total_records'] = count( $total_sub_admin_collec );
    	$params['total_pages'] = ceil( count($total_sub_admin_collec)/$params['limit'] );
    	$params['current_page'] = ceil( ( $params['offset']/$params['limit'] ) + 1 );
    	
    	
    	$response_array = array();
    	$grid_data_array = array();
    	if( $sub_admin_collec )
    	{
    		foreach ($sub_admin_collec as $key=>$sub_admin_obj)
    		{
    			$grid_data_array[$key]['id'] 						= $sub_admin_obj[0]->getId();
    			$grid_data_array[$key]['status'] 					= $sub_admin_obj[0]->getStatus();
    			$grid_data_array[$key]['number'] 					= $key+intval($params['offset'])+1;
    			$grid_data_array[$key]['sub_admin_firstname'] 		= $sub_admin_obj[0]->getFirstname();
    			$grid_data_array[$key]['sub_admin_lastname'] 		= $sub_admin_obj[0]->getLastname();
    			$grid_data_array[$key]['sub_admin_email_id'] 		= $sub_admin_obj[0]->getEmail_id();
    			$grid_data_array[$key]['sub_admin_expiry_date'] 	= $sub_admin_obj[0]->getExpiry_date()?$sub_admin_obj[0]->getExpiry_date()->format('j-M-Y'):'Not Set';
    			$grid_data_array[$key]['sub_admin_profile_picture'] =
    			$sub_admin_obj[0]->getProfile_picture()?'<img width="50px" height="50px" src="'.IMAGE_PATH.'/admin_profile/'.$sub_admin_obj[0]->getProfile_picture().'">'
    			:'<img width="50px" height="50px" src="'.IMAGE_PATH.'/profile-img60.png">';
    		}
    	}
 
    	$response_array['params'] = $params;
    	$response_array['grid_data'] = $grid_data_array;
    	 
    	echo Zend_Json::encode( $response_array );
    	die;
    	
    }
    
    /**
     *
     * used to delete subadmins record
     * @author sjaiswal
     * @version 1.0
     */
    public function deleteSubAdminAction()
    {
    	$ids_r = array_filter($this->getRequest()->getParam('ids_r'));
    	\Extended\admin::deleteSubAdmin( $ids_r );
    	echo Zend_Json::encode(1);
    	die;
    }
    
    
    /**
     *
     * used to enable subadmin record
     * @author sjaiswal
     * @version 1.0
     */
    public function enableSubAdminAction()
    {
    	$ids_r = array_filter($this->getRequest()->getParam('ids_r'));
    	\Extended\admin::enableSubAdmin( $ids_r );
    	echo Zend_Json::encode(1);
    	die;
    }
    
    /**
     *
     * used to disable subadmins record
     * @author sjaiswal
     * @version 1.0
     */
    public function disableSubAdminAction()
    {
    	$ids_r = array_filter($this->getRequest()->getParam('ids_r'));
    	\Extended\admin::disableSubAdmin( $ids_r );
    	echo Zend_Json::encode(1);
    	die;
    }
    
    
    /**
     *
     * used to create/edit subadmin record
     * @author sjaiswal
     * @version 1.0
     */
    
    public function editAction()
    {
		$params = $this->getRequest()->getParams();
		//check if already 25 sub-admins are created 
  
		if(!$params['id'])
		{
			if(\Extended\admin::getSubAdminsCount() == 25)
			{
				$messages = new \Zend_Session_Namespace('admin_messages');
				$messages->errorMsg = "You cannot create more than 25 sub-admins";
				$this->_redirect( PROJECT_URL."/".PROJECT_NAME."admin/sub-admins");
			}
		}
		
    	if( $this->_request->isPost() )
    	{
    		// used for checking whether to edit or create
    		// for edit case
    		if($params['id']) 
    		{
    			$upload_success = 1;
    			if($_FILES['profile_pic']['name'])
    			{
    				$image_upload_success = \Extended\admin::addProfilePic($_FILES['profile_pic']['name'],$_FILES['profile_pic']['tmp_name']);
    					
    				if($image_upload_success['msg'] !='Success')
    				{
    					$upload_success = 0;
    				}
    			}
    	
    			$params['image_upload_successful'] = $image_upload_success['is_success'];
    			$params['upload_success'] = $upload_success;
    			$params['image_name'] = $image_upload_success['image_name'];
    			
    			//If image uploading failed, then show error message
    			if( !$upload_success )
    			{	
	    			$messages = new \Zend_Session_Namespace('admin_messages');
	    			$messages->errorMsg = $image_upload_success['msg'];
    			}
    			else
    			{
    				//Save the data.
		    		$edit_subadmin_id = \Extended\admin::editAdminOrSubAdmin($params);
		    		$messages = new \Zend_Session_Namespace('admin_messages');
		    		if($edit_subadmin_id)
		    		{
			    		$messages->successMsg = "Your profile has been updated successfully.";
		    		}
		    		else 
		    		{
		    			$messages->errorMsg = "Error while updating sub-admin .";
		    		}
    			}	
    		}
    		//  for create case
	    	else
    		{
    			$upload_success = 1;
    		 	if($_FILES['profile_pic']['name'])
				{
					$image_upload_success = \Extended\admin::addProfilePic($_FILES['profile_pic']['name'],$_FILES['profile_pic']['tmp_name']);
					
					if($image_upload_success['msg'] !='Success')
					{
						$upload_success = 0;
					}
				}
				
				$params['image_upload_successful'] = $image_upload_success['is_success'];
				$params['upload_success'] = $upload_success;
				$params['image_name'] = $image_upload_success['image_name'];
				$params['password'] = \Helper_common::generatePassword(8);	
				if( !$upload_success )
				{
					$messages = new \Zend_Session_Namespace('admin_messages');
					$messages->errorMsg = $image_upload_success['msg'];
					
				}
				else 
				{		
		    		$create_subadmin_id = \Extended\admin::createSubAdmin($params);
		    		$messages = new \Zend_Session_Namespace('admin_messages');
	    			if($create_subadmin_id)
		    		{	
		    			$messages->successMsg = "Sub-admin created successfully.";
		    			//send mail to subadmin regarding password
		    			$subject = "iLook Sub-admin: Password";
		    			$bodyText =
		    			'<br>
		    			<p style="margin:0 20px 0 0; padding:0; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#3a3a3a ">Your are registered as iLook sub-admin</p>
		    			<br />
		    			<p style="margin:0 20px 0 0; padding:0; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#3a3a3a ">Your password is ' .$params['password']. '</p>
		    			<br />
		    			<p style="margin:0 20px 0 0; padding:0; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#3a3a3a ">Please login to admin panel to reset your password.</p>';
		    			
		    			\Email_Mailer::sendMail ( $subject,
							$bodyText,
							$params['first_name'].' '.$params['last_name'],
							$params['email_id'],
							array(),
							Email_Mailer::DEFAULT_SENDER_NAME,
							Email_Mailer::DEFAULT_SENDER_EMAIL,
							Email_Mailer::DEFAULT_SALUTATION,
							Email_Mailer::DEFAULT_COMPLIMENTARY_CLOSING
							);
		    					
		    			$this->_redirect( PROJECT_URL."/".PROJECT_NAME."admin/sub-admins");
		    		}
		    		else
		    		{
		    			$messages->errorMsg = "Error while creating sub-admin .";
		    		}
				}
    		}
    	}
 	
		if( $params['id'] )
		{
			$this->view->subadmin_details = \Extended\admin::getAdminOrSubAdminDetails($params['id']);
		}
			
    	
    }
    
    
    /**
     * When admin will enter email in create sub-admin
     * With the help of jquery remote this function will check the
     * availability of that email in database
     * and returns true or false accordingly.
     *
     * @author sjaiswal
     * @version 1.0
     *
     */
    public function checkEmailExistAdminAction()
    {
    	$params = $this->getRequest()->getParams();
    
    	$email_check = \Extended\admin::isEmailExist($params['email_id']);
    
    	//Zend_Debug::dump($email_check); die;
    	if($params['email_id'] == $params['current_email']){
    		echo Zend_Json::encode(true);
    	}else if($email_check){
    		echo Zend_Json::encode(false);
    	}else {
    		echo Zend_Json::encode(true);
    	}
    	die();
    }
    
	/**
	 * change password for sub-admins 
	 * @param int $userid
	 * @param string $password
	 * return type boolean
	 * @author Devi Lal, hkaur5
	 * @author sjaiswal
	 * @version 1.1
	 * @return boolean true 
	 */
	public function changePasswordAction()
	{
		if($this->_request->isPost())
		{
			$is_first_time_login = 1;
			
			$save_pswd = \Extended\admin::saveSubadminPswd(Auth_AdminAdapter::getIdentity()->getId(),md5($_POST['password']),$is_first_time_login);
			// Set given password of given subadmin id, returns boolean.
			if ($save_pswd == 0)
			{
				echo Zend_Json::encode(0);
			}
			else if($save_pswd == 1 )
			{
				echo Zend_Json::encode(1);
			} 
			else if($save_pswd == 2)
			{
				echo Zend_Json::encode(2);
			}
			
			die;
		}
	}
	

	/**
	 * remove profile picture for sub-admin
	 * return type boolean
	 * @author sjaiswal
	 * @return boolean  
	 * @version 1.0
	 */
	public function removeProfilePictureAction()
	{
		$prms = $this->getRequest()->getParams();
		$user_id = $prms['user_id'];
		
		$subadmin_obj = \Extended\admin::getRowObject($user_id);
		
		if($subadmin_obj)
		{
		//get image name 
		$image_name = $subadmin_obj->getProfile_picture(); 
		}
		
		$adminProfileDirectory = REL_IMAGE_PATH.'\\admin_profile\\';
		//$image = glob($adminProfileDirectory."/".$image_name);
		 @unlink($adminProfileDirectory.'/'.$image_name); // get and delete file
		
		if(\Extended\admin::removeProfilePictureByUserId($user_id))
		{
			echo Zend_Json::encode(1);
		}
		else
		{
			echo Zend_Json::encode(0);
		} 
		die;
		
	}


}



