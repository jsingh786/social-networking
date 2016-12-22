<?php

class Admin_IndexController extends Zend_Controller_Action
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
    		if( Auth_AdminAdapter::getIdentity()->getRole()->getId() != 1 )
    		{	
    			$this->_helper->redirector( 'edit', 'sub-admins', 'admin', array('id'=>Auth_AdminAdapter::getIdentity()->getId()) );
    		}
    		else if( Auth_AdminAdapter::getIdentity()->getRole()->getId() == 1 )
    		{
    			$sec_storage = new Zend_Session_Namespace('admin_secondary_identity_storage');
    			if( !$sec_storage->id )
    			{
    				$this->_helper->redirector( 'index', 'secondary-authentication', 'admin' );
    			}
    			else
    			{
    				$this->_helper->redirector( 'edit', 'sub-admins', 'admin', array('id'=>Auth_AdminAdapter::getIdentity()->getId()));
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
    	
    	
    	
    }

    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
    	$params = $this->getRequest ()->getParams ();
        // action body
        
    	//Reset sub admin password if url has id and pswd as parameters.
    	if ( isset($params['pswd']) && $params['pswd']!="" &&  $params['id']!= "")
    	{
    		$sub_admin_id = base64_decode ( $params ["id"] );
    		$sub_admin_obj = \Extended\admin::getRowObject($sub_admin_id);
    		
    		//If sub admin exist.
    		if ($sub_admin_obj)
    		{
    			$newpwd = md5($params['pswd']);
    				
    			//Set new password.
    			$res = Extended\admin::saveSubadminPswd( $sub_admin_id, $newpwd );
    			if($res)
    			{
    				$messages = new Zend_Session_Namespace ( 'admin_messages' );
    				$messages->successMsg = "Your password updated successfully.";
    			}
    			else
    			{
    				$messages = new Zend_Session_Namespace ( 'admin_messages' );
    				$messages->errorMsg = "Some server error occurred while reseting your password.";
    			}
    		}
    		// If sub admin obj does not exist.
    		else
    		{
    			$messages = new Zend_Session_Namespace ( 'admin_messages' );
    			$messages->errorMsg = "Some server error occurred while reseting your password.";
    		}
    	}
    }
    
   
    
      
  
}
