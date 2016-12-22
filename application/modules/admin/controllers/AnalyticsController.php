<?php

class Admin_AnalyticsController extends Zend_Controller_Action
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

 

}

