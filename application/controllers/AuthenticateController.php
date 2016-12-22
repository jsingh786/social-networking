<?php
class AuthenticateController extends Zend_Controller_Action {
	
	/**
	 * This function checks session and
	 * manage redirecting.
	 * This is specific for authenticate controller.
	 *
	 * @author Jsingh7
	 * @version 1.0
	 * @see Zend_Controller_Action::preDispatch()
	 *
	 */
	public function preDispatch() {
		
		if($this->getRequest()->getParams())
		{
			
		}
		if (Auth_UserAdapter::hasIdentity ()) 
		{
			if ('logout' != strtolower ( $this->getRequest ()->getActionName () )) 
			{
				if ('login' == strtolower ( $this->getRequest ()->getActionName () )) 
				{
					$this->_helper->redirector ( 'index', 'dashboard' );
				}
			}
		}
		else 
		{
			if ('logout' == $this->getRequest ()->getActionName ()) 
			{
				$this->_helper->redirector ( 'index', 'index' );
			}
		
		}
	}
	
	public function init() 
	{
	}
	
	public function indexAction() 
	{
		// action body
		if( Auth_UserAdapter::hasIdentity() )
		{
			$this->_helper->redirector("index", "dashboard");
		}
		else
		{
			$this->_helper->redirector("index", "index");
		}	
	}
	
	/**
	 * Login using zend_auth component.
	 * 
	 * @author Jsingh7
	 * @author sjaiswal
	 * @author hkaur5
	 * @version 1.1
	 *           
	 */
	public function loginAction()
	{
		//Flags
		$Log_in_with_cookies = false;// Will set true if cookies credentials found.

		// action body
		$auth = Zend_Auth::getInstance ();
		$auth->setStorage ( new Zend_Auth_Storage_Session ( 'ilook_user' ) );

// 		if 'Keep me logged in', was checked.
		if( @$_COOKIE['ilook_user_email'] && @$_COOKIE['ilook_user_password'] )
		{
			$Log_in_with_cookies = true;
			$adapter = new Auth_UserAdapter ( $_COOKIE['ilook_user_email'], base64_decode($_COOKIE['ilook_user_password']), Extended\ilook_user::USER_CREATED_FROM_ILOOK );
		}
		else
		{
			$adapter = new Auth_UserAdapter ( $this->getRequest()->getParam( "email" ), $this->getRequest()->getParam( "password" ), Extended\ilook_user::USER_CREATED_FROM_ILOOK );
		}
		
		$result = $auth->authenticate ( $adapter );

		if ( $result->getCode() == Zend_Auth_Result::FAILURE_CREDENTIAL_INVALID )
		{
			if($Log_in_with_cookies)
			{
				$expire=time()-60*60*24*30;//30 days
				setcookie("ilook_user_email", $this->getRequest()->getParam('email'),$expire, "/");
				setcookie("ilook_user_password", base64_encode( $this->getRequest()->getParam("password") ),$expire, "/");
			}

			$messages = new Zend_Session_Namespace ( 'messages' );
			$msg = $result->getMessages ();
			$messages->errorMsg = $msg [0];
			$this->_helper->redirector ( 'index', 'index' );
		}
		else if ( Auth_UserAdapter::hasIdentity() ) // Successful Login
		{
			$logged_in_usr_id = Auth_UserAdapter::getIdentity()->getId();
			$login_ip = \Zend_Controller_Front::getInstance()->getRequest()->getServer('REMOTE_ADDR');
			$country = "Search by IP";
			$login_summ_id = \Extended\login_summary::saveLoginSummary ( $logged_in_usr_id, $login_ip, $country );
			
			$login_summary = new \Zend_Session_Namespace('login_summary');
			$login_summary->id = $login_summ_id;
			
			
			// 	if 'Keep me logged in', is checked
			if( $this->getRequest()->getParam("rememberMe") == "1" )
			{
				$expire=time()+60*60*24*30;//30 days
				setcookie("ilook_user_email", $this->getRequest()->getParam('email'),$expire, "/");
				setcookie("ilook_user_password", base64_encode( $this->getRequest()->getParam("password") ),$expire, "/");
			}
			else
			{
				$expire=time()-60*60*24*30;//30 days
				setcookie("ilook_user_email", $this->getRequest()->getParam('email'),$expire, "/");
				setcookie("ilook_user_password", base64_encode( $this->getRequest()->getParam("password") ),$expire, "/");
			}
			
			// Update last login time of user after login.
			$datetime=new \DateTime();
			$em = \Zend_Registry::get('em');
			$ilook_user_obj = $em->find('Entities\ilook_user',Auth_UserAdapter::getIdentity()->getId());
			$ilook_user_obj->setLast_login($datetime);
			$em->persist($ilook_user_obj);
			$em -> flush();
		
			// Redirection by sessions
			$after_login_redirection_session = new Zend_Session_Namespace('after_login_redirection_session');


			switch($after_login_redirection_session->action)
			{
				case 1: // for action 'profile'
					$loginSummarycnt = \Extended\login_summary::loginSummaryCount(Auth_UserAdapter::getIdentity());
					if( $after_login_redirection_session->OpenthisProfileFirst )
					{
						//storing user id in variable
						$user_id = $after_login_redirection_session->OpenthisProfileFirst;
						$after_login_redirection_session->unsetAll();
						$this->_helper->redirector ( 'iprofile', 'profile', "default", array("id" => $user_id) );
					}
					else if( $loginSummarycnt[0]['num_of_rows'] == 1 )
					{
						$after_login_redirection_session->unsetAll();
						$this->_helper->redirector ( 'iprofile', 'profile', 'default', array( 'id'=>$logged_in_usr_id ) );
					}
					else
					{
						$after_login_redirection_session->unsetAll();
						$this->_helper->redirector ( 'index', 'dashboard' );
					}
						
					break;
				case 2: // for action 'provide_feedback'
					//Redirect to provide feedback if feedback session exist and fdbck provider
					//id matched with logged in user id.
					if( $after_login_redirection_session->provider_id )
					{
						if( $after_login_redirection_session->provider_id == $logged_in_usr_id )
						{
							$fdbk_rqstr_id = $after_login_redirection_session->fdbk_rqstr_id;
							$after_login_redirection_session->unsetAll();
							$this->_redirect( PROJECT_URL."/".PROJECT_NAME."feedback/provide-feedback#".$fdbk_rqstr_id );
						}
						else
						{
							$after_login_redirection_session->unsetAll();
							$this->_helper->redirector ( 'index', 'dashboard' );
						}
					}
					else
					{
						$after_login_redirection_session->unsetAll();
						$this->_helper->redirector ( 'index', 'dashboard' );
					}
						
					break;
				case 3: // for action 'provide_ref'
					//------------ Redirection according to Provide reference session ---------//
					//Redirect to provide reference if reference session exist and reference provider id
					// matched with logged in user id.
					if( $after_login_redirection_session->ref_provider_id )
					{
						if( $after_login_redirection_session->ref_provider_id == $logged_in_usr_id )
						{
							$ref_rqstr_id = $after_login_redirection_session->ref_rqstr_id;
							$after_login_redirection_session->unsetAll();
							$this->_redirect( PROJECT_URL."/".PROJECT_NAME."reference-request/provide-reference#".$ref_rqstr_id );
						}
						else
						{
							$after_login_redirection_session->unsetAll();
							$this->_helper->redirector ( 'index', 'dashboard' );
						}
					}
					else
					{
						$after_login_redirection_session->unsetAll();
						$this->_helper->redirector ( 'index', 'dashboard' );
					}
					break;
						
				case 4: // for action 'new_link_request'
					//Redirection for new link request in case new_link_request session exist
					if( $after_login_redirection_session->action_to_do )
					{
						if ( $after_login_redirection_session->action_to_do == "accept_from_email")
						{
							$link_req_id = $after_login_redirection_session->link_reqst_id;
							$after_login_redirection_session->unsetAll();
							$this->_redirect( PROJECT_URL."/".PROJECT_NAME."links/new-link-request/link_req_id/".$link_req_id."/todo/accept" );
			
						}
						else if ( $after_login_redirection_session->action_to_do == "decline_from_email")
						{
							$link_req_id = $after_login_redirection_session->link_reqst_id;
							$after_login_redirection_session->unsetAll();
							$this->_redirect( PROJECT_URL."/".PROJECT_NAME."links/new-link-request/link_req_id/".$link_req_id."/todo/decline" );
						}
						else
						{
							$after_login_redirection_session->unsetAll();
							$this->_helper->redirector ( 'index', 'dashboard' );
						}
					}
					else
					{
						$after_login_redirection_session->unsetAll();
						$this->_helper->redirector ( 'index', 'dashboard' );
					}
					break;
						
				case 5: // for action 'job_detail'
					if( $after_login_redirection_session->receiver_id )
					{
						if ( $after_login_redirection_session->receiver_id == $logged_in_usr_id )
						{
							$job_id =  $after_login_redirection_session->job_id;
							$receiver_id = $after_login_redirection_session->receiver_id;
							$after_login_redirection_session->unsetAll();
							$this->_redirect( PROJECT_URL."/".PROJECT_NAME."job/job-detail/job_id/".$job_id.'/receiver_id/'.$receiver_id );
						}
						else
						{
							$after_login_redirection_session->unsetAll();
							$this->_helper->redirector ( 'index', 'dashboard' );
						}
					}
					else
					{
						$after_login_redirection_session->unsetAll();
						$this->_helper->redirector ( 'index', 'dashboard' );
					}
					break;
				case 6: // For action send-link-request
					if( $after_login_redirection_session->invite_to_connect_through_profile )
					{
						$link_request_accepter_id =  $after_login_redirection_session->invite_to_connect_through_profile;
						$after_login_redirection_session->unsetAll();
						$this->_redirect( PROJECT_URL."/".PROJECT_NAME."links/send-link-request/accept_user/".$link_request_accepter_id.'/link_req_through_pub_view/1' );
					}
					else
					{
						$after_login_redirection_session->unsetAll();
						$this->_helper->redirector ( 'index', 'dashboard' );
					}
					break;
						
				case 7: // For action iprofile
					if( $after_login_redirection_session->full_prof )
					{
						$id =  $after_login_redirection_session->full_prof;
						$user_obj = \Extended\ilook_user::getRowObject($id);
						$after_login_redirection_session->unsetAll();
						if($user_obj)
						{
							$username = $user_obj->getUsername();
							$this->_redirect( PROJECT_URL."/".PROJECT_NAME.$username );
						}
						else 
						{
							$this->_helper->redirector ( 'index', 'dashboard' );
						}
					}
					else
					{
						$after_login_redirection_session->unsetAll();
						$this->_helper->redirector ( 'index', 'dashboard' );
					}
					break;
					case 8: // For action post detail
						if( $after_login_redirection_session->post_detail_id )
						{
							$id =  $after_login_redirection_session->post_detail_id;
							
							$after_login_redirection_session->unsetAll();
							/* unset($after_login_redirection_session->post_detail_id);
							unset($after_login_redirection_session->action); */
							if($id)
							{
								$this->_redirect( PROJECT_URL."/".PROJECT_NAME.'post/detail/id/'.$id );
							}
							else
							{
								$this->_helper->redirector ( 'index', 'dashboard' );
							}
						}
						else
						{
							$after_login_redirection_session->unsetAll();
							$this->_helper->redirector ( 'index', 'dashboard' );
						}
				break;
				case 9: // For action photo 
					if( $after_login_redirection_session->photo_id )
					{
						$photo_id =  $after_login_redirection_session->photo_id;
						$user_id =  $after_login_redirection_session->user_id;
						//$user_obj = \Extended\ilook_user::getRowObject($id);
						$after_login_redirection_session->unsetAll();
						if($photo_id && $user_id)
						{
							$this->_redirect( PROJECT_URL."/".PROJECT_NAME.'profile/photos/uid/'.$user_id.'/id/'.$photo_id);
						}
						else
						{
							$this->_helper->redirector ( 'index', 'dashboard' );
						}
					}
					else
					{
						$after_login_redirection_session->unsetAll();
						$this->_helper->redirector ( 'index', 'dashboard' );
					}
					break;
						
				default:
					$after_login_redirection_session->unsetAll();
					$this->_helper->redirector ( 'index', 'dashboard' );
					break;
			}
		}
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
		//When redirected from delete account.
		if( $this->getRequest()->getParam("activity") == "account_deleted" )
		{
			$messages = new Zend_Session_Namespace ( 'messages' );
			$messages->successMsg = "Your account has been deleted successfully. If you do not log in with in 30 days your account will be permanently deleted.";
		}

		
		if ( Auth_UserAdapter::hasIdentity () )
		{
			Auth_UserAdapter::clearIdentity ();
			
			$admin_logged_in_as_user = new Zend_Session_Namespace('admin_logged_in_as_user');
			unset($admin_logged_in_as_user->admin_id);
			
			//unset cookie
			$expire=time()-60*60*24*30;//30 days
			
			//unset sdmenu cookies
			setcookie("sdmenu_my_menu", "", $expire, "/");
			
			//Unset Registeration data due to issue in user registered with facebook
			if( $_SESSION['reg_step_one_data'] )
			{
				unset($_SESSION['reg_step_one_data']);
			}
			
			$after_login_redirection_session = new Zend_Session_Namespace('after_login_redirection_session');
	
			$after_login_redirection_session->unsetAll();
			//Zend_Debug::dump($_SESSION); die();

			//Clearing job search cookies
			setcookie("simple_search_job_title", "", $expire, "/");
			setcookie("simple_search_country", "", $expire, "/");
			setcookie("simple_search_state", "", $expire, "/");
			setcookie("simple_search_city", "", $expire, "/");
			
			setcookie("advance_search_job_title", "", $expire, "/");
			setcookie("advance_search_country", "", $expire, "/");
			setcookie("advance_search_state", "", $expire, "/");
			setcookie("advance_search_city", "", $expire, "/");
			setcookie("advance_search_company", "", $expire, "/");
			setcookie("advance_search_industry", "", $expire, "/");
			setcookie("advance_search_salary", "", $expire, "/");
			setcookie("advance_search_salary", "", $expire, "/");
			setcookie("advance_search_job_typ", "", $expire, "/");
			setcookie("advance_search_experience_level", "", $expire, "/");
			setcookie("advance_search_date_from", "", $expire, "/");
			setcookie("advance_search_date_to", "", $expire, "/");
			
			//Logging logout datetime.
			Extended\login_summary::addLogoutDatetime ();
			$this->_helper->redirector ( 'index', 'index' );
		
		}
	}
	/**
	 * Purpose:This method is used for forgot password
	 * user enter email then mail will be sent to user.
	 * url of reset password sent in mail.
	 * id and first name of user sent with url
	 * 
	 * @author Devi Lal,Ravneet
	 * @version 1.1
	 *         
	 *         
	 */
	public function forgotPasswordAction() {
		
	}
	/**
	 * function to send forgot password email.
	 * 
	 * @author Ravneet
	 * @version 1.1
	 */
	public function forgotpwdAction()
	{
		$params = $this->getRequest ()->getParams ();
		$email = $params ['email'];
		
		// call forgotPassword method to get user id
		$result = Extended\ilook_user::getActiveUserIdByEmail ( $email );

		if ( $result )
		{
			$resultUserId = base64_encode ( $result ["id"] );
			$user_id = ( $result ["id"] );
			
			$bodyText =
			'<table width="800" border="0" cellspacing="0" cellpadding="0" align="center" style="font-family:Arial, Helvetica, sans-serif;">
				<tr>
					<td valign="top" style="background:#fff; padding-bottom:20px;"><table width="100%" border="0" cellpadding="10" cellspacing="0">
					<br />
					<p style="margin:0 20px 0 0; padding:0; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#3a3a3a ">We have recieved your email requesting your iLook password to reset. </p>
					<br />
					<p style="margin:0 20px 0 0; padding:0; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#3a3a3a ">Your email address <a href="#" style="color:#b084e9; text-decoration:none">'.$email.'</a></p>
					<br />
					<p style="margin:0 20px 0 0; padding:0; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#3a3a3a ">If you would like to reset your password, please click on this link: </p>
					<br />
					<a href="'.PROJECT_URL."/".PROJECT_NAME."Authenticate/reset-password?forgot_id=" . $resultUserId.'" style="margin:0 0 0 0; text-decoration:none; padding:0; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#b084e9 ">'. PROJECT_URL.'/'.PROJECT_NAME . "Authenticate/reset-password?forgot_id=" . $resultUserId.'</a>
					<br />
					<br />
					</td>
				</tr>
			</table>';
				
			$recipent_email = $email;
			$subject = "Click on the following link to reset your account password.";
			if(Email_Mailer::sendMail (
				$subject,
				$bodyText,
				$result ["firstname"],
				$recipent_email,
				array(),
				Email_Mailer::DEFAULT_SENDER_NAME,
				Email_Mailer::DEFAULT_SENDER_EMAIL,
				Email_Mailer::DEFAULT_SALUTATION,
				Email_Mailer::DEFAULT_COMPLIMENTARY_CLOSING ) )
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
	
	/**
	 * purpose:This method is used to reset user password
	 * 
	 * @author Devi Lal,Ravneet
	 * @version 1.1
	 *       
	 */
	public function resetPasswordAction() 
	{
		$params = $this->getRequest ()->getParams ();
		if (Auth_UserAdapter::hasIdentity () )
		{
			$messages = new Zend_Session_Namespace ( 'messages' );
			$messages->successMsg = "You are already logged In.";
			$this->_helper->redirector ( 'index', 'index' );
		}
		else
		{
			if ($this->getRequest()->isPost())
			{
				if (! empty ( $params ))
				{
					$user_id = base64_decode ( $params ["forgot_id"] );
					$result = Extended\ilook_user::getUserFirstname ( $user_id );
					$firstname = $result ["firstname"];
				
					if (! empty ( $user_id )) 
					{
						$newpwd = md5($params['pwd']);
						$res = Extended\ilook_user::changePassword ( $user_id, $newpwd );
						$messages = new Zend_Session_Namespace ( 'messages' );
						$messages->successMsg = "Your password updated successfully.";
						$this->_helper->redirector ( 'index', 'index' );
					}
					else 
					{
						$messages = new Zend_Session_Namespace ( 'messages' );
						$messages->errorMsg = "Error in reseting your password! Please try again.";
						$this->_helper->redirector ( 'index', 'index' );
					}
				}
			}
		}
	}
	
	/**
	 * Made for ajax call
	 * that user with this email exist or not.
	 * 
	 * @author jsingh7
	 * @version 1.0
	 */
	public function checkEmailAction() 
	{
		$params = $this->getRequest ()->getParams ();
		$result = Extended\ilook_user::getActiveUserIdByEmail ( $params ['emailForgot'] );
		
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
	
	/**
	 * Changes users password if correct old pswd provided.
	 * check if given value matches with user's current encrypted password,
	 * if yes then it changes user's password to new provided value.
	 * @author hkaur5
	 * @version 1.0
	 * @return integer 1( password chanegd ), 2( current password you are providing does not match with current password ), 3(current and new pswd are same), 0(pswd not changed due to some error in query)
	 * 
	 */
	public function chgPswrdAction()
	{
		$current_user_obj = Auth_UserAdapter::getIdentity();
		$current_password = $current_user_obj->getEnc_password();
		$params = $this->getRequest()->getParams();

			if($current_password == md5($params['crnt_pswd']) )
			{
				if($current_password != md5($params['new_pswd']))
				{
					$is_pswd_chgd = \Extended\ilook_user::changePassword(Auth_UserAdapter::getIdentity()->getId(), md5($params['new_pswd']) );
					if($is_pswd_chgd)
					{
						echo Zend_Json::encode(1);
					}
					else
					{
						echo Zend_Json::encode(0);
					}
				}
				else
				{
					echo Zend_Json::encode(3);
				}
			}
			else
			{
				echo Zend_Json::encode(2);
			}

		die;
		
	}
}







