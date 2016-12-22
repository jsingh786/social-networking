<?php

class DummyController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
        // action body
    }

    public function displayAction()
    {
        // action body
    	$this->_helper->layout ()->disableLayout ();
    	
    	if ( Auth_UserAdapter::hasIdentity () )
    	{
    		Auth_UserAdapter::clearIdentity ();
    			
    		//unset cookie
    		$expire=time()-60*60*24*30;//30 days
    		setcookie("ilook_user_email",$this->getRequest()->getParam('email'),$expire, "/");
    		setcookie("ilook_user_password",$this->getRequest()->getParam("password"),$expire, "/");
    		
    		//Logging logout datetime.
    		Extended\login_summary::addLogoutDatetime ();
    	}
    }


}



