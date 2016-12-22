<?php
class Admin_ManageUsersController extends Zend_Controller_Action
{
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
					$this->_helper->redirector( 'secondary-authentication', 'index', 'admin' );
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

    /**
     * Generates data for listing of users
     * in the form of datatable.
     * 
     * @author jsingh7
     */
    public function getAllIlookUsersAction()
    {
		//Post parameters recieved from ajax call.
		$params = $this->getRequest()->getParams();

		//columns to be filtered with filter text.
		$filter_columns = array();
		$filter_columns[] = "CONCAT( CONCAT(usr.firstname, ' '), usr.lastname)";
		$filter_columns[] = "usr.username";
		$filter_columns[] = "usr.email";
		$filter_columns[] = "city.name";
		

		//Converting date format.
		if($params['toDateFilterValue'] || $params['fromDateFilterValue'])
		{
			
			$params['fromDateFilterValue'] = date("Y-m-d 00:00:00", strtotime($params['fromDateFilterValue']));
			$params['toDateFilterValue'] = date("Y-m-d 00:00:00", strtotime($params['toDateFilterValue']));
		}
		 
		//Call to method which makes query.
		$user_collec = \Extended\ilook_user::getIlookUsersByParameters( $params['limit'],
				$params['offset'],
				$params['sort_column'],
				$params['sort_column_order'],
				$filter_columns,
				$params['filterText'],
				$params['countryFilterValue'], 
				null,
				$params['fromDateFilterValue'],
				$params['toDateFilterValue'],
				$params['createdFromPortalValue']
				);
		
		//Zend_Debug::dump($user_collec);
		//For total records.
		$total_user_collec = \Extended\ilook_user::getIlookUsersByParameters( null,
				0,
				$params['sort_column'],
				$params['sort_column_order'],
				$filter_columns,
				$params['filterText'],
				$params['countryFilterValue'],
				null,
				$params['fromDateFilterValue'],
				$params['toDateFilterValue'],
				$params['createdFromPortalValue']
				);
		 
		$params['total_records'] = count( $total_user_collec );
		$params['total_pages'] = ceil( count($total_user_collec)/$params['limit'] );
		$params['current_page'] = ceil( ( $params['offset']/$params['limit'] ) + 1 );
	
		$respose_array = array();
		$grid_data_array = array();
		if( $user_collec )
		{
			foreach ($user_collec as $key=>$user_obj)
			{
				/* Zend_Debug::dump($user_obj[0]->getUsersCountry()->getName()); 
				Zend_Debug::dump($user_obj[0]->getCity()->getName());  */
				$grid_data_array[$key]['id'] 		= $user_obj[0]->getId();
				$grid_data_array[$key]['number'] 	= $key+intval($params['offset'])+1;
				$grid_data_array[$key]['firstname'] = '<a target = "_blank" href = "/'.PROJECT_NAME.$user_obj[0]->getUsername().'" >'.$user_obj[0]->getFirstname().'</a>';
				$grid_data_array[$key]['lastname'] 	= '<a target = "_blank" href = "/'.PROJECT_NAME.$user_obj[0]->getUsername().'" >'.$user_obj[0]->getLastname().'</a>';
				$grid_data_array[$key]['email'] 	= '<a target = "_blank" href = "/'.PROJECT_NAME.$user_obj[0]->getUsername().'">'.$user_obj[0]->getEmail().'</a>';
				$grid_data_array[$key]['user_name'] = '<a target = "_blank" href = "/'.PROJECT_NAME.$user_obj[0]->getUsername().'" >'.$user_obj[0]->getUsername().'</a>';
				$grid_data_array[$key]['acc_created_at'] = $user_obj[0]->getCreated_at()->format('j-M-Y h:i A');
				if(is_object($user_obj[0]->getAccount_closed_on()))
				{
					$grid_data_array[$key]['acc_closed_on']= $user_obj[0]->getAccount_closed_on()->format('j-M-Y');
				}
				else
				{
					$grid_data_array[$key]['acc_closed_on'] = "NA";
				}
				if(is_object($user_obj[0]->getLast_login()))
				{
					$grid_data_array[$key]['last_login'] = $user_obj[0]->getLast_login()->format('j-M-Y h:i A');
				}	
				else
				{
					$grid_data_array[$key]['last_login'] = "NA";
				}
				
				$grid_data_array[$key]['country']= $user_obj[0]->getUsersCountry()->getName();
				if(is_object($user_obj[0]->getCity()))
				{
				$grid_data_array[$key]['city']= $user_obj[0]->getCity()->getName();
				}
				$grid_data_array[$key]['user_status']= $user_obj[0]->getStatus();
				$grid_data_array[$key]['user_verified']= $user_obj[0]->getVerified();
			}
		}
		 
		$respose_array['params'] = $params;
		$respose_array['user_data'] = $grid_data_array;
		 
		echo Zend_Json::encode( $respose_array );
		die;
    }

    /**
     * Set user account close date and change user status to zero.
     * @author hkaur5
     *
     */
    public function deleteUser()
    {
		$prms = $this->getRequest()->getParams();
		
		foreach( $prms['ids_r']  as $user_id)
		{
			$user_obj = \Extended\ilook_user::getRowObject($user_id);    
			
			//Check if user is not yet deleted only then deactivate him/her.
			if($user_obj)
			{
				if($user_obj->getAccount_closed_on() == null)
				{
					$users_to_be_deleted[] = $user_id;
				}
			}
		}
		if(!empty($users_to_be_deleted))
		{
			foreach( $users_to_be_deleted as $user_to_be_deleted )
			{
				//Deactivate users.
				\Extended\ilook_user::setAccountClosedDate($user_to_be_deleted);
				\Extended\ilook_user::updateUserStatus($user_to_be_deleted,0);
			}
			return 1;
		}
		else
		{
			return 2;
		}
		
		die;
		
    }

    /**
     * Disable users(array)
     * @author hkaur5
     * @return json_encode 1 or 0
     */
    public function disableUserAction()
    {
		$prms = $this->getRequest()->getParams();
		foreach( $prms['ids_r']  as $user_id)
		{
			$user_obj = \Extended\ilook_user::getRowObject($user_id);
				
			//Check if user is enabled only then disable him/her.
			if($user_obj)
			{
				if($user_obj->getStatus() == 1)
				{
					$users_to_be_disabled[] = $user_id;
				}
			}
		}
		if(!empty($users_to_be_disabled))
		{
			foreach( $users_to_be_disabled as $user_id )
			{
				\Extended\ilook_user::updateUserStatus($user_id,0);
			}
		}
		echo  Zend_Json::encode(1);
		die;
    }
    /**
     * Enable users(array)
     * @author hkaur5
     * @return json_encode 1 or 0
     */
    public function enableUserAction()
    {
		$prms = $this->getRequest()->getParams();
		foreach( $prms['ids_r']  as $user_id)
		{
			$user_obj = \Extended\ilook_user::getRowObject($user_id);
		
			//Check if user are disabled only then enable him/her.
			if($user_obj)
			{
				if($user_obj->getStatus() == 0)
				{
					$users_to_be_enabled[] = $user_id;
				}
			}
		}
		if(!empty($users_to_be_enabled))
		{
			foreach($users_to_be_enabled as $user_id )
			{
				\Extended\ilook_user::updateUserStatus($user_id, 1);
			}
		}
		echo  Zend_Json::encode(1);
		die;
    }

    /**
     * This Action first of all check if otp is received in params, validates 
     * otp and create otp-verified session after validating it delete given users,
     * if otp is not proided it check session and delete given users
     * and if both are not present then it create new otp for admin.
     *
     * @author hkaur5
     *
     *
     *
     */
    public function checkOtpSessionOrOtpOrGenerateNewOtpAction()
    {
		$otp_session = new Zend_Session_Namespace('otp');
		
		//For salutation in OTP mail.
		$admin_subadmin = 'Admin';
		if(Auth_AdminAdapter::getIdentity()->getRole()->getId() == 2)
		{
			$admin_subadmin = 'Sub admin';
		}
// 		Zend_Debug::dump($otp_session);
// 		die;
		
		$params = $this->getRequest()->getParams();
		
		$admin_otp_to_delete_user = $params['admin_otp_to_delete_user'];
		
		//For salutation 
		$admin_subadmin = 'Admin';
		if(Auth_AdminAdapter::getIdentity()->getRole()->getId() == 2)
		{
			$admin_subadmin = 'Sub admin';
		}
		
		//If admin/sub admin has enetered otp to validate.
		if($admin_otp_to_delete_user)
		{
			$otp_validate = \Extended\otp::validateOtp($admin_otp_to_delete_user, Auth_AdminAdapter::getIdentity()->getId());
			//If otp is validated successfuly.
			if($otp_validate)
			{
				//otp session set to 1.
				$otp_session->verified = 1;
				
				$deleted_users = self::deleteUser($params['ids_r']);
				if( $deleted_users)
				{
					echo Zend_Json::encode(3); 
				}
				else
				{
					echo Zend_Json::encode(0);
				}
				
			}
			else 
			{
				$otp_session->verified = 0;
				echo Zend_Json::encode(4);
				
			}
			die;
		}
		
		//Check if otp session is there then delete users
		if($otp_session->verified)
		{
			$deleted_users = self::deleteUser($params['ids_r']);
			echo Zend_Json::encode(1);
		
			die;                 
		}
		
		//If there is no OTP in session
		else
		{
			//Generating and creating OTP.
			$otp_value = \Extended\otp::createOtp( Auth_AdminAdapter::getIdentity()->getId() );
			$admin_obj = \Extended\admin::getRowObject(Auth_AdminAdapter::getIdentity()->getId() );
			
			//Sending otp in email top admin or sub admin.
			$mesage = 'Your OTP is '.$otp_value.'. This OTP is valid for 30 minutes and will work for current session.';
			\Email_Mailer::sendMail('OTP - One time password',
									$mesage,
									$admin_obj->getFirstname().' '.$admin_obj->getLastname(), 
									$admin_obj->getEmail_id(),
									array(),
									'iLook Team',
									'',
									'Hello '.$admin_subadmin);
			echo Zend_Json::encode(2);
			die;
		}
		
    }

    /**
     * It sends OTP to logged in admin or sub-admin.
     *
     *  @author jsingh7
     *  @version 1.0
     *  
     *
     */
    public static function sendOTPAction()
    {
    	//Generating and creating OTP.
    	$otp_value = \Extended\otp::createOtp( Auth_AdminAdapter::getIdentity()->getId() );
    	$admin_obj = \Extended\admin::getRowObject(Auth_AdminAdapter::getIdentity()->getId() );

    	//For salutation
    	$admin_subadmin = 'Admin';
    	if(Auth_AdminAdapter::getIdentity()->getRole()->getId() == 2)
    	{
    		$admin_subadmin = 'Sub admin';
    	}
    	
    	//Sending otp in email top admin or sub admin.
    	$mesage = 'Your OTP is '.$otp_value.'. This OTP is valid for 30 minutes and will work for current session.';
    	\Email_Mailer::sendMail('OTP - One time password',
    			$mesage,
    			$admin_obj->getFirstname().' '.$admin_obj->getLastname(),
    			$admin_obj->getEmail_id(),
    			array(),
    			'iLook Team',
    			'',
    			'Hello '.$admin_subadmin);
    	echo Zend_Json::encode(1);
    	die;
    }

    /**
     * This action is for following purpose.
     *
     * On clicking �Log In as user� the admin will be displayed with a screen where in
     * the admin will enter the below details, to log in into the users account
     * Email: Email Id of user.
     * Request Password: On clicking this option a temporary password valid for only 30
     * mins will be generated and sent to the Admin or Sub Admin�s email id whoever is
     * requesting. Using this password Admin/SA and can login in the same screen that
     * is used to request the password.
     * Enter Password: The admin/sub admin will enter the password.
     * Once the password is entered successfully the admin/sub admin will be able to
     * login successfully.
     * Everytime admin/sub admin wish to login to users account, they will have to
     * generate a OTP, the user can only use the account for two hours after using the
     * generated OTP (to be used within 30 minutes.)
     *
     * @version 1.0
     * @author jsingh7
     *
     */
    public function loginAsUserAction()
    {
         // action body
         // fetching email id from session
    	 $email_id_for_login = new Zend_Session_Namespace('email_id_for_login');
    	 $this->view->email_id = $email_id_for_login->value;
    	 unset($email_id_for_login->value);
    	 
    	 
    	 $after_login_redirection_session = new Zend_Session_Namespace('after_login_redirection_session');
    	 // value 8 is used for action 'Post detail'
    	 $after_login_redirection_session->action = 8;

    }

    public function authenticateAdminToLoginAsUserAction()
    {
		// action body
    	$this->_helper->layout()->disableLayout(); //<== Layout is disabled.
    	
		$auth = Zend_Auth::getInstance ();
		$auth->setStorage ( new Zend_Auth_Storage_Session ( 'ilook_user' ) );
		$adapter = new Auth_AdminAsUserAdapter ( $this->getRequest ()->getParam ( "email" ), $this->getRequest ()->getParam ( "OTP" ) );
		$result = $auth->authenticate ( $adapter );
		
		$messages = new Zend_Session_Namespace ( 'admin_messages' );
		if ($result->getCode () == Zend_Auth_Result::FAILURE_CREDENTIAL_INVALID) 
		{
			$msg = $result->getMessages ();
			$messages->errorMsg = $msg [0];
			$this->_helper->redirector ( 'login-as-user', 'manage-users', 'admin' );
		} 
		else if (Auth_UserAdapter::hasIdentity ()) // Successful Login
		{
			$logged_in_usr_id = Auth_UserAdapter::getIdentity ()->getId ();
			$login_ip = \Zend_Controller_Front::getInstance ()->getRequest ()->getServer ( 'REMOTE_ADDR' );
			$country = "Search by IP";
			$login_summ_id = \Extended\login_summary::saveLoginSummary ( $logged_in_usr_id, $login_ip, $country );
			
			$login_summary = new \Zend_Session_Namespace('login_summary');
			$login_summary->id = $login_summ_id;
			
			// Update last login time of user after login.
			\Extended\ilook_user::updateLastLoginTime( Auth_UserAdapter::getIdentity()->getId() );

			// Redirection by sessions
			$after_login_redirection_session = new Zend_Session_Namespace('after_login_redirection_session');
			
			switch($after_login_redirection_session->action)
			{
				
				case 8: // For action post detail
					if( $after_login_redirection_session->post_id )
					{
						$post_id =  $after_login_redirection_session->post_id;
						unset($after_login_redirection_session->post_id);
						if( $post_id )
						{	
							$this->_redirect( PROJECT_URL."/".PROJECT_NAME."post/detail/id/".$post_id );
						}
						else
						{
							$this->_helper->redirector ( 'index', 'dashboard','default' );
						}
						$after_login_redirection_session->unsetAll();
					}
					else
					{
						$after_login_redirection_session->unsetAll();
						$this->_helper->redirector ( 'index', 'dashboard','default' );
					}
					break;
					
				default:
					$after_login_redirection_session->unsetAll();
					$this->_helper->redirector ( 'index', 'dashboard','default' );
					break;
			}
			
// 			$messages->successMsg = 'You have successfully logged in to frontend as '.Auth_UserAdapter::getIdentity()->getFirstname().' '.Auth_UserAdapter::getIdentity()->getLastname().'. ';
// 			$messages->successMsg .= 'If you have blocked popups in your web browser then the system will not be able to open the frontend in new tab. you may open or click ';
// 			$messages->successMsg .= '<b><a href = "'.PROJECT_URL.'/'.PROJECT_NAME.'" target = "_blank">'.PROJECT_URL.'/'.PROJECT_NAME.'</a></b> manually.';
		
    }
    }
    
    
 /**
    * Get active users list.
    * @param int responsetype (optional)
    * @author hkaur5
    * @return json
    * @version 1.0
    *
    */
    public function getActiveIlookUsersAction()
    {	
    	//Post parameters recieved from ajax call.
    	$params = $this->getRequest()->getParams();
    		
    	//columns to be filtered with filter text.
    	$filter_columns = array();
    	$filter_columns[] = "CONCAT( CONCAT(usr.firstname, ' '), usr.lastname)";
    	$filter_columns[] = "usr.email";
    		
    	//Call to method which makes query.
    	$user_collec = \Extended\ilook_user::getIlookUsersByParameters( $params['limit'],
    			$params['offset'],
    			$params['sort_column'],
     			$params['sort_column_order'],
    			$filter_columns,
    			$params['filterText'],
    			$params['countryFilterValue'],
    			1 );
    	if( $user_collec )
    	{
    		foreach ($user_collec as $key=>$user_obj)
    		{
    			$user_data_array[$key]['firstname'] = $user_obj[0]->getFirstname();
    			$user_data_array[$key]['lastname'] 	= $user_obj[0]->getLastname();
    			$user_data_array[$key]['email'] = $user_obj[0]->getEmail();
    			$user_data_array[$key]['id'] = $user_obj[0]->getId();
    		}
	    		
	    	$response_array['params'] = $params;
	    	$response_array['user_data'] = $user_data_array;
    		
    		echo Zend_Json::encode( $response_array );
    	}
    	else 
    	{
    		echo Zend_Json::encode( 0 );
    	}
    	die;
	}
	
	/**
	* get all countries list
	* @author sjaiswal
	* @return array
	* @version 1.1
	*
	*/
	public function getCountryListAction()
	{
		$country_collec = \Extended\country_ref::getAllCountriesUsersRegisteredFrom();
		
		foreach ($country_collec as $key=>$country_obj)
		{
			$country_array[$key]['id'] = $country_obj->getId();
			$country_array[$key]['name'] 	= $country_obj->getName();
		}
		
		if($country_collec)
		{
			echo Zend_Json::encode($country_array);
		}
		else
		{
			echo Zend_Json::encode( 0 );
		}
		die;
	}

    
	/**
	 * post to user wall from admin for different post update types
	 * here default privacy is links of links for posting data.
	 * 
	 * @version 1.0
     * @author sjaiswal
     *
	 * 
	 */
    public function postToUserWallAction()
    {
    	if($this->_request->isPost())
		{
			$params = $this->getRequest()->getParams();
			
			// set privacy to links of links
			$privacy = \Extended\wall_post::VISIBILITY_CRITERIA_LINKS_OF_LINKS;
			
			$zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
			
			// get all users array on selecting 'specific users'
			if ($params['selected_share_option'] == 1)
			{
				//Call to method which makes query.
				$user_collec = \Extended\ilook_user::getIlookUsersByParameters( null,
						null,
						null,
						null,
						array(),
						null,
						null,
						1 );
					
			
				foreach($user_collec as $key=>$user_obj)
				{
					$user_array[] = $user_obj[0]->getId();
				}
			}
			// get selected users array on selecting 'specific users'
			else if ($params['selected_share_option'] == 2)
			{
				if( $params['selected_user_ids'] )
				{
					$user_array = explode(",", $params['selected_user_ids']);
				}
				else
				{
					echo Zend_Json::encode(0);
					die;
				}
			}
			// get selected countries array on selecting 'country' option
			else if ($params['selected_share_option'] == 3)
			{
				if( $params['selected_country_ids'] )
				{	
					$array_list = explode(",",$params['selected_country_ids']);
					$ilook_user_by_country = \Extended\ilook_user::getActiveIlookUserByCountryId($array_list);
					$user_array = array();
					foreach($ilook_user_by_country as $key=>$value)
					{
						$user_array[] = $value['id'];
					}
				}
				else
				{
					echo Zend_Json::encode(0);
					die;
				}
			}
			
			//Sharing a link on wall.
			if( $this->getRequest()->getParam("is_url") )
			{
				$url_data = array();
				$url_data['url_title'] = $this->getRequest()->getParam("url_title");
				$url_data['url_content'] = $this->getRequest()->getParam("url_content");
				$url_data['image_src'] = $this->getRequest()->getParam("image_src");
				$url_data['url'] = $this->getRequest()->getParam("url");
			
				$result = \Extended\wall_post::post_url(
						Helper_common::makeHyperlinkClickable( $zend_filter_obj->filter( $this->getRequest()->getParam('post_data') )),
						json_encode($url_data),
						$this->getRequest()->getParam('privacy'),
						$user_array,
						\Extended\ilook_user::getUserInfoByUserType(\Extended\ilook_user::USER_TYPE_ADMIN)->getId(),
						\Extended\ilook_user::getUserInfoByUserType(\Extended\ilook_user::USER_TYPE_ADMIN)->getId(),
						\Extended\wall_post::POST_UPDATE_TYPE_LINK,
						\Extended\wall_post::POST_TYPE_MANUAL
				);
			}
			else //Sharing simple text on wall.
			{
	
				 $result = \Extended\wall_post::post_text(
						Helper_common::makeHyperlinkClickable($zend_filter_obj->filter( $this->getRequest()->getParam('post_data'))),
						$this->getRequest()->getParam('privacy'),
						$user_array,
						\Extended\ilook_user::getUserInfoByUserType(\Extended\ilook_user::USER_TYPE_ADMIN)->getId(),
						\Extended\ilook_user::getUserInfoByUserType(\Extended\ilook_user::USER_TYPE_ADMIN)->getId(),
						\Extended\wall_post::POST_UPDATE_TYPE_TEXT,
						\Extended\wall_post::POST_TYPE_MANUAL
				);
			}
			
			
			
			
			if( $result )
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
    
    
    /**
    /**
     * Return extracting url.
     *
     * @author jsingh7
     * @version 1.1
     */
    public function extractUrlAction()
    {
    	$params = $this->getRequest()->getParams();
    	 
    	echo Zend_Json::encode( Helper_common::extractURL( $params['url'] ) );
    	die;
    }
    
    /**
     * Initialing the Blueimp jquery file upload.
     *
     * @author jsingh7
     * @version 1.0
     */
    public function initailiseJqueryFileUploadAction()
    {
    	$user_id = \Extended\ilook_user::getUserInfoByUserType(\Extended\ilook_user::USER_TYPE_ADMIN)->getId();
    	$upload_handler = new Jqueryfileuploader_uploadhandler(
    			array(
    					'script_url' => PROJECT_URL.'/'.PROJECT_NAME.'admin/manage-users/initailise-jquery-file-upload',
    					'upload_dir' => SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$user_id.'/',
    					'upload_url' => PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$user_id.'/',
    					'user_dirs' => false,
    					'mkdir_mode' => 0755,
    					'param_name' => 'files',
    					// Set the following option to 'POST', if your server does not support
    					// DELETE requests. This is a parameter sent to the client:
    					'delete_type' => 'DELETE',
    					'access_control_allow_origin' => '*',
    					'access_control_allow_credentials' => false,
    					'access_control_allow_methods' => array(
    							'OPTIONS',
    							'HEAD',
    							'GET',
    							'POST',
    							'PUT',
    							'PATCH',
    							'DELETE'
    					),
    					'access_control_allow_headers' => array(
    							'Content-Type',
    							'Content-Range',
    							'Content-Disposition'
    					),
    					// Enable to provide file downloads via GET requests to the PHP script:
    					//     1. Set to 1 to download files via readfile method through PHP
    					//     2. Set to 2 to send a X-Sendfile header for lighttpd/Apache
    					//     3. Set to 3 to send a X-Accel-Redirect header for nginx
    					// If set to 2 or 3, adjust the upload_url option to the base path of
    					// the redirect parameter, e.g. '/files/'.
    					'download_via_php' => false,
    					// Read files in chunks to avoid memory limits when download_via_php
    					// is enabled, set to 0 to disable chunked reading of files:
    					'readfile_chunk_size' => 10 * 1024 * 1024, // 10 MiB
    					// Defines which files can be displayed inline when downloaded:
    					'inline_file_types' => '/\.(gif|jpe?g|png)$/i',
    					// Defines which files (based on their names) are accepted for upload:
    					// 						'accept_file_types' => '/.+$/i',
    					'accept_file_types' => '/\.(gif|jpe?g|png)$/i',
    					// The php.ini settings upload_max_filesize and post_max_size
    					// take precedence over the following max_file_size setting:
    					'max_file_size' => null,
    					'min_file_size' => 1,
    					// The maximum number of files for the upload directory:
    					'max_number_of_files' => null,
    					// Defines which files are handled as image files:
    					'image_file_types' => '/\.(gif|jpe?g|png)$/i',
    					// Use exif_imagetype on all files to correct file extensions:
    					'correct_image_extensions' => false,
    					// Image resolution restrictions:
    					'max_width' => null,
    					'max_height' => null,
    					'min_width' => 1,
    					'min_height' => 1,
    					// Set the following option to false to enable resumable uploads:
    					'discard_aborted_uploads' => true,
    					// Set to 0 to use the GD library to scale and orient images,
    					// set to 1 to use imagick (if installed, falls back to GD),
    					// set to 2 to use the ImageMagick convert binary directly:
    					'image_library' => 1,
    					// Uncomment the following to define an array of resource limits
    					// for imagick:
    					/*
    					 'imagick_resource_limits' => array(
    					 		imagick::RESOURCETYPE_MAP => 32,
    					 		imagick::RESOURCETYPE_MEMORY => 32
    					 ),
    	*/
    					// Command or path for to the ImageMagick convert binary:
    					'convert_bin' => 'convert',
    					// Uncomment the following to add parameters in front of each
    					// ImageMagick convert call (the limit constraints seem only
    					// to have an effect if put in front):
    					/*
    					 'convert_params' => '-limit memory 32MiB -limit map 32MiB',
    	*/
    					// Command or path for to the ImageMagick identify binary:
    					'identify_bin' => 'identify',
    					'image_versions' => array(
    							// The empty image version key defines options for the original image:
    							'original_photos' => array(
    									// Automatically rotate images based on EXIF meta data:
    									'auto_orient' => true
    							),
    							'popup_thumbnails' => array(
    									'max_width' => 800,
    									'max_height' => 800
    							),
    							'wall_thumbnails' => array(
    									'max_width' => 570,
    									'max_height' => 570
    							),
    							// Uncomment the following to create medium sized images:
    							/*
    							 'medium' => array(
    							 		'max_width' => 800,
    							 		'max_height' => 600
    							 ),
    	*/
    							'gallery_thumbnails' => array(
    									// Uncomment the following to use a defined directory for the thumbnails
    									// instead of a subdirectory based on the version identifier.
    									// Make sure that this directory doesn't allow execution of files if you
    									// don't pose any restrictions on the type of uploaded files, e.g. by
    									// copying the .htaccess file from the files directory for Apache:
    									//'upload_dir' => dirname($this->get_server_var('SCRIPT_FILENAME')).'/thumb/',
    									//'upload_url' => $this->get_full_url().'/thumb/',
    									// Uncomment the following to force the max
    									// dimensions and e.g. create square thumbnails:
    									'crop' => true,
    									'max_width' => 176,
    									'max_height' => 176
    							),
    							'thumbnail' => array(
    									'crop' => true,
    									'max_width' => 80,
    									'max_height' => 80
    							)
    					),
    					'print_response' => true
    			)
    	);
    	die;
    }
    
    
    
    /**
     * Post photos -> add photos to default album( create default album if not present),
     * create wallpost and save photos in user directory (directory where all default pictures of particular users goes).
     * Privacy of photos will be public( as photos do not have to_users and admin do not have any links, so photos of admin should be public) 
     * and wallpost will be links of links.
     * @author hkaur5
     * @version 1.1
     */
    public function postPhotosAction()
    {
    	$prms = $this->getRequest()->getParams();
    	
    	// set privacy to links of links
    	$privacy = \Extended\wall_post::VISIBILITY_CRITERIA_LINKS_OF_LINKS;
    	$to_users = array();
    	if(!empty($prms['users_option']))
    	{
	    	switch ($prms['users_option'])
	    	{
	    		case 1: // get all users array on selecting 'specific users'
	    		//Call to method which makes query.
	    		$user_collec = \Extended\ilook_user::getIlookUsersByParameters( null,
													    						null,
													    						null,
													    						null,
													    						array(),
													    						null,
													    						null,
	    																		1 );
	    					
	    					
	    		foreach($user_collec as $key=>$user_obj)
	    		{
	    			$to_users[] = $user_obj[0]->getId();
	    		}
	    		break;			
	    			
	    		case 2:// get selected users array on selecting 'specific users'
	    		$to_users = explode(",", $prms['selected_user_ids_display']);
	    		break;
	    			
	    		case 3:// get selected countries array on selecting 'country' option
	    		$countries = explode(",",$prms['selected_country_ids_display']);
	    		$ilook_user_by_country = \Extended\ilook_user::getActiveIlookUserByCountryId($countries);
	    		
	    		foreach($ilook_user_by_country as $key=>$value)
	    		{
	    			$to_users[] = $value['id'];
	    		}
	    		break;	
	    			
	    	}
    	}
    	else
    	{
    		echo Zend_Json::encode( 2 );
    		die;
    	}
    	$filtered_to_users = array_filter($to_users);
    	if(empty($filtered_to_users))
    	{
    		echo Zend_Json::encode( 3 );
    		die;
    	}    	
    	
    	$zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
    	$photo_text_filtered = $zend_filter_obj->filter( $prms["photos_text"] );
    	$logged_in_user_id = \Extended\ilook_user::getUserInfoByUserType(\Extended\ilook_user::USER_TYPE_ADMIN)->getId();

    	//getting paths to user default album directory to store images.
    	$userDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id;
    	$userAlbumDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id.'\\album_default';
    	$galleryDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id.'\\album_default\\gallery_thumbnails';
    	$wallDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id.'\\album_default\\wall_thumbnails';
    	$popupDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id.'\\album_default\\popup_thumbnails';
    	$originalDirecory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id.'\\album_default\\original_photos';
    
    	// Creating directories
    	if ( !file_exists( $userDirectory ) )
    	{
    		mkdir( $userDirectory, 0777, true );
    		mkdir( $userAlbumDirectory, 0777, true );
    		mkdir( $originalDirecory, 0777, true );
    		mkdir( $popupDirectory, 0777, true );
    		mkdir( $wallDirectory, 0777, true );
    		mkdir( $galleryDirectory, 0777, true );
    	}
    	//
    	else
    	{
    		//This case will occur when user directory exists but album dir does not.
    		if ( !file_exists( $userAlbumDirectory ) )
    		{
    			mkdir( $userAlbumDirectory, 0777, true );
    			mkdir( $originalDirecory, 0777, true );
    			mkdir( $wallDirectory, 0777, true );
    			mkdir( $popupDirectory, 0777, true );
    			mkdir( $galleryDirectory, 0777, true );
    		}
    	}
    
    	//Copy files to directories.
    	$image_files = Helper_common::dirToArray(SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$logged_in_user_id);
    	 
    	foreach ( $image_files['original_photos'] as $original_photo )
    	{
    		@rename( SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$logged_in_user_id.'/original_photos/'.$original_photo,
    				$originalDirecory.'\\'.$original_photo );
    	}
    	foreach ( $image_files['popup_thumbnails'] as $popup_thumbnail )
    	{
    		@rename( SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$logged_in_user_id.'/popup_thumbnails/'.$popup_thumbnail,
    				$popupDirectory.'\\thumbnail_'.$popup_thumbnail );
    	}
    	foreach ( $image_files['wall_thumbnails'] as $wall_thumbnail )
    	{
    		@rename( SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$logged_in_user_id.'/wall_thumbnails/'.$wall_thumbnail,
    				$wallDirectory.'\\thumbnail_'.$wall_thumbnail );
    	}
    	foreach ( $image_files['gallery_thumbnails'] as $gallery_thumbnail )
    	{
    		@rename( SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$logged_in_user_id.'/gallery_thumbnails/'.$gallery_thumbnail,
    				$galleryDirectory.'\\thumbnail_'.$gallery_thumbnail );
    	}
    
    	@Helper_common::deleteDir(SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$logged_in_user_id);
    
    	//Create photo group for these photos.
    	$photo_group_id = \Extended\photo_group::addPhotoGroup( $logged_in_user_id );
    
    
    	//Making entry to DB.
    	$default_album_id = \Extended\socialise_album::isThisTypeOfAlbumExists( $logged_in_user_id, \Extended\socialise_album::DEFAULT_ALBUM_NAME );
    
    	//Getting the id of default album.
    	if( !$default_album_id )
    	{
    		$album_data = \Extended\socialise_album::addAlbum(
    				$logged_in_user_id,
    				\Extended\socialise_album::DEFAULT_ALBUM_NAME,
    				\Extended\socialise_album::VISIBILITY_CRITERIA_PUBLIC,
    				1,
    				\Extended\socialise_album::DEFAULT_ALBUM_NAME );
    		$album_id = $album_data['id'];
    	}
    	else
    	{
    		$album_id = $default_album_id;
    	}
    
    
    	//Adding entry to wallpost table.
    	$wall_post_id = \Extended\wall_post::post_photo(
    			$photo_text_filtered,
    			$privacy,
    			$to_users,
    			$logged_in_user_id,
    			$logged_in_user_id,
    			\Extended\wall_post::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM,
    			\Extended\wall_post::POST_TYPE_MANUAL,
    			\Extended\wall_post::WALL_TYPE_SOCIALISE,
    			$photo_group_id,
    			$album_id );
    
    	//Adding records to socialise_photo table for every image.
    	if( $album_id )
    	{
    		$photo_info = \Extended\socialise_photo::addPhotos(
    				$album_id,
    				$logged_in_user_id,
    				$image_files['original_photos'],
    				\Extended\socialise_photo::VISIBILITY_CRITERIA_PUBLIC,
    				'',
    				$photo_group_id
    		);
    		 
    		if( $photo_info )
    		{
//     			$return_r['is_success'] = 1;
//     			$return_r['msg'] = "Photos posted successfully.";
    			echo Zend_Json::encode( 1 );
    			die;
    		}
    		else
    		{
//     			$return_r['is_success'] = 0;
//     			$return_r['msg'] = "Oops! An error occured while posting your photos. Please try again.";
    			echo Zend_Json::encode( 4 );
    			die;
    		}
    	}
    	else
    	{
//     		$return_r['is_success'] = 0;
//     		$return_r['msg'] = "Oops! An error occured while posting your photos. Please try again.";
    		echo Zend_Json::encode( 5 );
    		die;
    	}
    }
    
    /**
     * Post album -> add album(privacy public), add photos(privacy public), add wallpost( with links of links privacy) and save photos in directory.
     *  Privacy of photos and albums will be public( as photos and albums do not have to_users and admin do not have any links, so photos of admin should be public) 
     * and wallpost will be links of links.
     * @author hkaur5
     * version 1.1
     */
    public function postAlbumAction()
    {
    
    	$logged_in_user_id = \Extended\ilook_user::getUserInfoByUserType(\Extended\ilook_user::USER_TYPE_ADMIN)->getId();
    	$prms = $this->getRequest()->getParams();
    	
    	// set privacy to links of links
    	$privacy = \Extended\wall_post::VISIBILITY_CRITERIA_LINKS_OF_LINKS;
    	$to_users = array();
    	 
   
    	if($prms['users_option'] == 1 || $prms['users_option'] == 2 || $prms['users_option'] == 3)
    	{
    		switch ($prms['users_option'])
    		{
    			case 1: // get all users array on selecting 'specific users'
    				//Call to method which makes query.
    				$user_collec = \Extended\ilook_user::getIlookUsersByParameters( null,
    				null,
    				null,
    				null,
    				array(),
    				null,
    				null,
    				1 );
    	
    	
    				foreach($user_collec as $key=>$user_obj)
    				{
    					$to_users[] = $user_obj[0]->getId();
    				}
    				break;
    	
    			case 2:// get selected users array on selecting 'specific users'
    				$to_users = explode(",", $prms['selected_user_ids_display']);
    				break;
    	
    			case 3:// get selected countries array on selecting 'country' option
    				$countries = explode(",",$prms['selected_country_ids_display']);
    				$ilook_user_by_country = \Extended\ilook_user::getActiveIlookUserByCountryId($countries);
    		   
    				foreach($ilook_user_by_country as $key=>$value)
    				{
    					$to_users[] = $value['id'];
    				}
    				break;
    	
    		}
    	}
    	else
    	{
//     		$return_r['is_success'] = 0;
//     		$return_r['msg'] = "No users selected for posting photos. Please try again.";
    		echo Zend_Json::encode( 2 );
    		die;
    	}
    	
    	$filtered_to_users = array_filter($to_users);
    	
    	if(empty($filtered_to_users))
    	{
//     		$return_r['is_success'] = 0;
//     		$return_r['msg'] = "No users selected for posting photos. Please try again.";
    		echo Zend_Json::encode( 3 );
    		die;
    	}
    	$zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
    
    	$new_album_name = $this->getRequest()->getParam('album_title');
    	$wallpost_text = $zend_filter_obj->filter($prms['photos_text']);
    
    	 
    	//Adding album data to database.
    	$album_data = \Extended\socialise_album::addAlbum(
    			$logged_in_user_id,
    			$new_album_name,
    			\Extended\socialise_photo::VISIBILITY_CRITERIA_PUBLIC,
    			1,
    			$new_album_name );
    
    	$album_timestamp = $album_data['directoryTime']->getTimestamp();
    
    	//getting paths to user default album directory to store images.
    	$userDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id;
    	$userAlbumDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id.'\\album_'.$album_data['album_dir_name'].'_'.$album_timestamp;
    	$galleryDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id.'\\album_'.$album_data['album_dir_name'].'_'.$album_timestamp.'\\gallery_thumbnails';
    	$wallDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id.'\\album_'.$album_data['album_dir_name'].'_'.$album_timestamp.'\\wall_thumbnails';
    	$popupDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id.'\\album_'.$album_data['album_dir_name'].'_'.$album_timestamp.'\\popup_thumbnails';
    	$originalDirecory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id.'\\album_'.$album_data['album_dir_name'].'_'.$album_timestamp.'\\original_photos';
    
    	// Creating directories.
    	if ( !file_exists( $userDirectory ) )
    	{
    		mkdir( $userDirectory, 0777, true );
    		mkdir( $userAlbumDirectory, 0777, true );
    		mkdir( $originalDirecory, 0777, true );
    		mkdir( $popupDirectory, 0777, true );
    		mkdir( $wallDirectory, 0777, true );
    		mkdir( $galleryDirectory, 0777, true );
    	}
    	//
    	else
    	{
    		//This case will occur when user directory exists but album dir does not.
    		if ( !file_exists( $userAlbumDirectory ) )
    		{
    			mkdir( $userAlbumDirectory, 0777, true );
    			mkdir( $originalDirecory, 0777, true );
    			mkdir( $wallDirectory, 0777, true );
    			mkdir( $popupDirectory, 0777, true );
    			mkdir( $galleryDirectory, 0777, true );
    		}
    	}
    
    	//Copy files to directories.
    	$image_files = Helper_common::dirToArray(SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$logged_in_user_id);
    	foreach ( $image_files['original_photos'] as $original_photo )
    	{
    		@rename( SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$logged_in_user_id.'/original_photos/'.$original_photo,
    				$originalDirecory.'\\'.$original_photo );
    	}
    	foreach ( $image_files['popup_thumbnails'] as $popup_thumbnail )
    	{
    		@rename( SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$logged_in_user_id.'/popup_thumbnails/'.$popup_thumbnail,
    				$popupDirectory.'\\thumbnail_'.$popup_thumbnail );
    	}
    	foreach ( $image_files['wall_thumbnails'] as $wall_thumbnail )
    	{
    		@rename( SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$logged_in_user_id.'/wall_thumbnails/'.$wall_thumbnail,
    				$wallDirectory.'\\thumbnail_'.$wall_thumbnail );
    	}
    	foreach ( $image_files['gallery_thumbnails'] as $gallery_thumbnail )
    	{
    		@rename( SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$logged_in_user_id.'/gallery_thumbnails/'.$gallery_thumbnail,
    				$galleryDirectory.'\\thumbnail_'.$gallery_thumbnail );
    	}
    
    	@Helper_common::deleteDir(SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$logged_in_user_id);
    
    	if( $album_data )
    	{
    		$photo_info = \Extended\socialise_photo::addPhotos(
    				$album_data['id'],
    				$logged_in_user_id,
    				$image_files['original_photos'],
    				\Extended\socialise_photo::VISIBILITY_CRITERIA_PUBLIC,
    				''
    		);
    		 
    
    		$wall_post_id = \Extended\wall_post::post_photo(
    				$wallpost_text,
    				$privacy,
    				$to_users,
    				$logged_in_user_id,
    				$logged_in_user_id,
    				\Extended\wall_post::POST_UPDATE_TYPE_ALBUM,
    				\Extended\wall_post::POST_TYPE_MANUAL,
    				\Extended\wall_post::WALL_TYPE_SOCIALISE,
    				NULL,
    				$album_data['id'] );
    
    		 
//     		$return_r['is_success'] = 1;
//     		$return_r['msg'] = "Album posted successfully on selected user(s) wall.";
    		echo Zend_Json::encode( 1 );
    		die;
    
    	}
    	else
    	{
//     		$return_r['is_success'] = 0;
//     		$return_r['msg'] = "Oops! An error occured while posting your album. Please try again.";
    		echo Zend_Json::encode( 4 );
    		die;
    	}
    }
    
    /**
     * Removing the temporary folders and data for
     * socialise wall photo upload.
     * location: public/images/albums/temp_storage_for_socialize_wall_photos_post
     *
     * @author hkaur5
     * @version 1.0
     */
    public function removeTempFolderNDataAction()
    {
    	$user_id = \Extended\ilook_user::getUserInfoByUserType(\Extended\ilook_user::USER_TYPE_ADMIN)->getId();
    	Helper_common::deleteDir(SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$user_id.'/');
    }
}





