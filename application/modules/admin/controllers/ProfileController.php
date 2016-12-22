<?php

class Admin_ProfileController extends Zend_Controller_Action
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
    
		$params = $this->getRequest()->getParams();
	
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
				$params['upload_success'] = $upload_success;
				if(isset($image_upload_success) && !empty($image_upload_success)) {
					$params['image_upload_successful'] = $image_upload_success['is_success'];
					$params['image_name'] = $image_upload_success['image_name'];
				}

    			
    			//If image uploading failed, then show error message
    			if( !$upload_success )
    			{	
	    			$messages = new \Zend_Session_Namespace('admin_messages');
	    			$messages->errorMsg = $image_upload_success['msg'];
    			}
    			else
    			{
    				//Save the data.
		    		$edit_admin_id = \Extended\admin::editAdminOrSubAdmin($params);
		    		$messages = new \Zend_Session_Namespace('admin_messages');
		    		if($edit_admin_id)
		    		{
			    		$messages->successMsg = "Your profile has been updated successfully.";
		    		}
		    		else 
		    		{
		    			$messages->errorMsg = "Oop! An error occurred. Please try again.";
		    		}
    			}	
    		}
    	}
 	
		if( $params['id'] )
		{
			$this->view->admin_details = \Extended\admin::getAdminOrSubAdminDetails($params['id']);
		//Zend_Debug::dump($this->view->admin_details); die;
			
		}
			
    	
    }
    
    
    /**
     * remove profile picture for admin
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
    
    
    /**
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
 
}

