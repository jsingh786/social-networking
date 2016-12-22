<?php

class Admin_RecoveryController extends Zend_Controller_Action
{

    public function preDispatch()
    {
		
		if ( Auth_AdminAdapter::hasIdentity() )
		{
			if( $this->getRequest()->getActionName() != 'reset-password')
			$this->_helper->redirector( 'index', 'manage-users', 'admin' );
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

    public function passwordAction()
    {
        // action body
    }

    /**
     * Made for ajax call
     * that user with this email exist or not.
     * 
     * @author jsingh7
     * @version 1.0
     *
     */
    public function checkEmailAction()
    {
    	$params = $this->getRequest ()->getParams ();
    	$result = Extended\admin::getActiveSubAdminIdByEmail( $params ['email'] );
    
    	if ($result)
    	{
    		echo Zend_Json::encode ( TRUE );
    	}
    	else
    	{
    		echo Zend_Json::encode ( FALSE );
    	}
    	die();
    }

    public function sendResetPswdEmailAction()
    {
    	$params = $this->getRequest ()->getParams ();
		$email = $params ['email'];
		
		// call forgotPassword method to get user id
		$sub_admin_id = Extended\admin::getActiveSubAdminIdByEmail( $params ['email'] );
		$subadmin_obj = Extended\admin::getRowObject($sub_admin_id);
	
		if ( $subadmin_obj )
		{
			$sub_admin_id_encoded = base64_encode ( $sub_admin_id );
			
			$new_password  = Helper_common::generatePassword();
			$bodyText = '<br>You have requested to change your password. System has generated new password for you: <b>'.$new_password.'</b>';
			$bodyText .= '<br>If you would like to set it as your password, please click on "Reset my password" link given below:';
			$bodyText .= '<br><br><a href="'.PROJECT_URL."/".PROJECT_NAME."admin/index/index?id=" . $sub_admin_id_encoded.'&pswd='.$new_password.'" style="margin:0 0 0 0; text-decoration:none; padding:0; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#b084e9 "> Reset my password</a>';
			$bodyText .= '<br><br>If you are unable to click on the link, you can also copy the below URL and paste it into your browser manually.';
			$bodyText .= '<br>'.PROJECT_URL."/".PROJECT_NAME."admin/index/index?id=".$sub_admin_id_encoded.'&pswd='.$new_password;
			
			$recipent_email = $params ['email'];
			$subject = "Click on the following link to reset your account password.";
			if(Email_Mailer::sendMail ( $subject,
				$bodyText,
				$subadmin_obj->getFirstname(),
				$recipent_email,
				array(),
				Email_Mailer::DEFAULT_SENDER_NAME,
				Email_Mailer::DEFAULT_SENDER_EMAIL,
				Email_Mailer::DEFAULT_SALUTATION,
				Email_Mailer::DEFAULT_COMPLIMENTARY_CLOSING
				))
			{
				echo Zend_Json::encode ( TRUE );
			}
			else
			{
				echo Zend_Json::encode ( FALSE );
			}
		}
		else
		{
			echo Zend_Json::encode ( FALSE );			
		}	
		die;
    }
	
    public function resetPasswordAction()
    {
    	$params = $this->getRequest ()->getParams ();
		if ( Auth_AdminAdapter::hasIdentity() )
		{
			$messages = new Zend_Session_Namespace ( 'admin_messages' );
			$messages->successMsg = "You are already logged in.";
			$this->_helper->redirector ( 'index', 'manage-users' );
		}
		else
		{
				if (! empty ( $params ))
				{
					$sub_admin_id = base64_decode ( $params ["id"] );
					$sub_admin_obj = \Extended\admin::getRowObject($sub_admin_id);
					if ($sub_admin_obj) 
					{
						if($params['pswd'] &&  $params['id'])
						{
							$newpwd = md5($params['pswd']);
							$res = Extended\admin::saveSubadminPswd( $sub_admin_id, $newpwd );
							if($res)
							{
								$messages = new Zend_Session_Namespace ( 'admin_messages' );
								$messages->successMsg = "Your password updated successfully.";
								
							}
						}
					}
					else 
					{
						$messages = new Zend_Session_Namespace ( 'admin_messages' );
						$messages->errorMsg = "Error in reseting your password! Please try again.";
						$this->_helper->redirector ( 'index', 'index' );
					}
				}
		}
    }


}





