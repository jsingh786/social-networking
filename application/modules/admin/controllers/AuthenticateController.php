<?php

class Admin_AuthenticateController extends Zend_Controller_Action
{
	/**
	 * This function checks session and
	 * manage redirecting.
	 * This is specific for authenticate controller.
	 *
	 * @author Jaskaran singh
	 * @version 1.0
	 * @see Zend_Controller_Action::preDispatch()
	 *
	 */
	public function preDispatch()
	{
		if ( Auth_AdminAdapter::hasIdentity() )
		{
			//If logout is called.
			if ('logout' == $this->getRequest ()->getActionName ())
			{
				//Nothing to do here.
			}
			//Checking admin type and redirecting accordingly
			else if( Auth_AdminAdapter::getIdentity()->getRole()->getId() == 1 )//if Admin but not Sub-admin.
			{
				$sec_storage = new Zend_Session_Namespace('admin_secondary_identity_storage');
				if( !$sec_storage->id )
				{
					if ('login-second' != strtolower ( $this->getRequest ()->getActionName () )
						&& 'authenticate' != strtolower ( $this->getRequest ()->getControllerName () )
						)
					{
						$this->_helper->redirector( 'index', 'secondary-authentication', 'admin' );
					}
				}
				else if ('logout' != strtolower ( $this->getRequest ()->getActionName () ))
				{
					if ('login' == strtolower ( $this->getRequest ()->getActionName () ))
					{
						$this->_helper->redirector('index', 'profile', 'admin', array('id'=>Auth_AdminAdapter::getIdentity()->getId()));
					}
				}
			}
			else
			{
				if ('logout' != strtolower ( $this->getRequest ()->getActionName () )) 
				{
					if ('login' == strtolower ( $this->getRequest ()->getActionName () )) 
					{
						$this->_helper->redirector('index', 'profile', 'admin', array('id'=>Auth_AdminAdapter::getIdentity()->getId()));
					}
				}
			}
		}
		else 
		{
			if ('logout' == $this->getRequest ()->getActionName () )
			{
				$this->_helper->redirector ( 'index', 'index', 'admin' );
			}
		}
	}
	
    public function init()
    {
        /* Initialize action controller here */
    }

	public function indexAction() 
	{
		// action body
		if( Auth_UserAdapter::hasIdentity() )
		{
			$this->_helper->redirector("index", "dashboard", 'admin' );
		}
		else
		{
			$this->_helper->redirector("index", "index", 'admin' );
		}
	}
	
	/**
	 * Login using zend_auth component.
	 *
	 * @author Jsingh7
	 * @version 1.0
	 *
	 */
	public function loginAction()
	{
		// action body
		$auth = Zend_Auth::getInstance ();
		$auth->setStorage ( new Zend_Auth_Storage_Session ('ilook_admin') );
		
		$messages = new Zend_Session_Namespace('admin_messages');
		unset( $messages->errorMsg );
		//ckecking email and password validations server side.
		
			
		if( !trim($this->getRequest()->getParam("email")) )
		{
			$messages->errorMsg = 'Email address is required.';
		}
		else if( !trim($this->getRequest()->getParam("pwd")) )
		{
			$messages->errorMsg = 'Password is required.';
		}
		else if( !preg_match('/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/', trim( $this->getRequest()->getParam("email") ) ) )
		{
			$messages->errorMsg = 'Please enter a valid email address.';
		}
		else if( strlen( trim($this->getRequest()->getParam("pwd") ) ) < 8 )
		{
			$messages->errorMsg = 'Please enter at least 8 characters for password.';
		}
		else if ( !preg_match('/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).*$/', trim( $this->getRequest()->getParam("pwd") ) ) )
		{
			$messages->errorMsg = 'Password must contain at least one alphabet, one number and one special character.';
		}
		
		if( $messages->errorMsg )
		{
			$this->_helper->redirector ('index', 'index', 'admin');
		}
		else
		{
		
			$adapter = new Auth_AdminAdapter(
									$this->getRequest()->getParam("email"), 
									$this->getRequest()->getParam("pwd"));
		
			$result = $auth->authenticate($adapter);
	
	
			if ( $result->getCode () == Zend_Auth_Result::FAILURE_CREDENTIAL_INVALID
				|| $result->getCode () == Zend_Auth_Result::FAILURE
				|| $result->getCode () == Zend_Auth_Result::FAILURE_IDENTITY_AMBIGUOUS
				|| $result->getCode () == Zend_Auth_Result::FAILURE_IDENTITY_NOT_FOUND
				|| $result->getCode () == Zend_Auth_Result::FAILURE_UNCATEGORIZED
				)
			{
				$msg = $result->getMessages();
				$messages->errorMsg = $msg [0];
				$this->_helper->redirector ('index', 'index', 'admin');
			}
			else if ( Auth_AdminAdapter::hasIdentity() ) //Successful Login
			{
				$this->_helper->redirector('index', 'profile', 'admin', array('id'=>Auth_AdminAdapter::getIdentity()->getId()));
			}
		}	
	}
	
	public function loginSecondAction()
	{
		$sec_storage = new Zend_Session_Namespace('admin_secondary_identity_storage');
		$gen_password_positions = new Zend_Session_Namespace ('gen_password_positions');
		$positions_arr = explode(',', $gen_password_positions->positions);
		
		$password_submitted = $this->getRequest()->getParam('pwd');
		$actual_password = (string)Auth_AdminAdapter::getIdentity()->getSix_digit_general_password();
		$i = 0;
		foreach ($positions_arr as $position)
		{
			if( $actual_password{$position-1} != $password_submitted{$i} )
			{
				$messages = new Zend_Session_Namespace('admin_messages');
				$messages->errorMsg = 'Password does not match.';
				$this->_helper->redirector( 'index', 'secondary-authentication', 'admin' );
			}
			$i++;
		}
		$sec_storage->id = Auth_AdminAdapter::getIdentity()->getId();
		$this->_helper->redirector('index', 'profile', 'admin', array('id'=>Auth_AdminAdapter::getIdentity()->getId()));
	}
	
	/**
	 * This Action logs out the user.
	 *
	 * @author Ritu
	 * @since 20 March, 2013
	 * @version 1.0
	 *
	 */
	public function logoutAction()
	{
		// action body
		if ( Auth_AdminAdapter::hasIdentity () )
		{
			Auth_AdminAdapter::clearIdentity ();
			
			$sec_storage = new Zend_Session_Namespace('admin_secondary_identity_storage');
			unset($sec_storage->id);
			
			$otp_session = new Zend_Session_Namespace('otp');
			unset($otp_session->verified);
		}
		$this->_helper->redirector ( 'index', 'index', 'admin' );
	}
	
}

