<?php

class RegistrationController extends Zend_Controller_Action
{

	/**
	 * This function checks auth storage and
	 * manage redirecting.
	 *
	 * @author Jaskaran
	 * @since 20 June, 2012
	 * @version 1.0
	 * @see Zend_Controller_Action::preDispatch()
	 */
	public function preDispatch()
	{
		if ( Auth_UserAdapter::hasIdentity() )
		{
			$this->_helper->redirector( 'contact-details', 'profile' );
		}
	}

	public function init()
	{

	}

	/**
	 * used for ilook-First step of Registeration,
	 * Getting countrylist, industry list from database
	 * Putting all the posted values (from facebook,
	 * twitter and self registered on ilook)in session
	 *
	 * @since 17, June 2013
	 * @author Rsharma, spatial
	 * @version 1.2
	 */
	public function indexAction()
	{
		$params = $this->getRequest()->getParams();

		$step_one_data = new Zend_Session_Namespace('messages');

		if( isset( $step_one_data->errorMsg ) )
		{
			unset( $step_one_data->errorMsg );
		}

		$country_list = \Extended\country_ref::getCountryList();
		$this->view->country = $country_list;

		$industry_list = \Extended\industry_ref::getIndustryList();
		$this->view->industry = $industry_list;

		$step_one_data = new Zend_Session_Namespace('reg_step_one_data');

		if(isset($params['created_from']) && $params['created_from'] == \Extended\ilook_user::USER_CREATED_FROM_ILOOK)
			$step_one_data->usr_arr=$params;
		$step_one_facebook = new Zend_Session_Namespace('reg_step_facebook');
		if($step_one_facebook->usr_arr)
		{

			$this->view->first_name = @$_SESSION['reg_step_facebook']['usr_arr']['first_name'];
			$this->view->last_name = @$_SESSION['reg_step_facebook']['usr_arr']['last_name'];
			$this->view->email = @$_SESSION['reg_step_facebook']['usr_arr']['email'];
			$this->view->password = @$_SESSION['reg_step_facebook']['usr_arr']['password'];
			$this->view->created_from = @$_SESSION['reg_step_facebook']['usr_arr']['created_from'];
			$this->view->search_profile_id = @$_SESSION['reg_step_facebook']['usr_arr']['search_profile_id'];
		}
		else
		{
			$this->view->first_name = @$_SESSION['reg_step_one_data']['usr_arr']['first_name'];
			$this->view->last_name = @$_SESSION['reg_step_one_data']['usr_arr']['last_name'];
			$this->view->email = @$_SESSION['reg_step_one_data']['usr_arr']['email'];
			$this->view->password = @$_SESSION['reg_step_one_data']['usr_arr']['password'];
			$this->view->created_from = @$_SESSION['reg_step_one_data']['usr_arr']['created_from'];
			$this->view->search_profile_id = @$_SESSION['reg_step_one_data']['usr_arr']['search_profile_id'];
		}
	}

	/**
	 * used for ilook-Second step of Registeration, insert data into database
	 * User will enter his information on first step of registration
	 * and redirects to this controller
	 *
	 * @since 17, June 2013
	 * @author Rsharma
	 * @author sjaiswal
	 * @author jsingh7
	 * @version 1.5
	 */
	public function signupAction()
	{
		$params = $this->getRequest()->getParams();
		$messages = new Zend_Session_Namespace('messages');

//     	Server side check for duplicate email.
		$check_email = \Extended\ilook_user::isEmailExist( $params['email'] );//getting email from first step.
		if( $check_email )
		{
			Zend_Session::namespaceUnset("reg_step_one_data");
			$messages->errorMsg = "Oops! This email ID is not available.";
			$this->_helper->redirector('index', 'index');
		}

		// action body
		$user_created_from = \Extended\ilook_user::USER_CREATED_FROM_ILOOK;
		$param_arr = array();

		//New Array formation from posted parameters
		$param_arr['created_from'] = $params['created_from'];
		$param_arr['firstname'] = $params['first_name'];
		$param_arr['lastname'] = $params['last_name'];
		$param_arr['country'] = $params['country'];
		$param_arr['zipcode'] = $params['zipcode'];
		$param_arr['genderlist'] = $params['genderlist'];
		$param_arr['birthday'] = $params['bday'];
		$param_arr['email'] = $params['email'];
		$param_arr['password'] = $params['password'];
		$param_arr['role'] = $params['role'][0];
		$param_arr['search_profile_id'] = @$params['search_profile_id'];
		$param_arr['state'] = @$params['state'];
		$param_arr['city'] = @$params['city'];

		// when role is Employed
		if(isset($params['role'][0]) && ($params['role'][0] == \Extended\ilook_user::USER_TYPE_EMPLOYED || $params['role'][0] == \Extended\ilook_user::USER_TYPE_RECRUITER) )
		{
			$param_arr['employed_jobTitle'] = $params['employed_jobTitle'];
			$param_arr['employed_company'] = $params['employed_company'];
			$param_arr['employed_industry'] = $params['employed_industry'];
			$param_arr['employed_from'] = $params['employed_from'];
			$param_arr['employed_to'] = $params['employed_to'];
			$param_arr['currently_work'] = $params['currently_working'];
		}

		// when role is Job seeker
		if(isset($params['role'][0]) && $params['role'][0]== \Extended\ilook_user::USER_TYPE_JOB_SEEKER )
		{
			$param_arr['jobseeker_jobTitle'] = $params['jobseeker_jobTitle'];
			$param_arr['jobseeker_company'] = $params['jobseeker_company'];
			$param_arr['experience_from'] = $params['experience_from'];
			$param_arr['experience_to'] = $params['experience_to'];
		}

		// when role is Student
		if(isset($params['role'][0]) && $params['role'][0]== \Extended\ilook_user::USER_TYPE_STUDENT )
		{
			$param_arr['college'] = $params['college'];
			$param_arr['student_from'] = $params['student_from'];
			$param_arr['student_to'] = $params['student_to'];
		}

		$create_user_id = \Extended\ilook_user::createUser($param_arr, NULL, NULL);

		// To add experience, first add the company after checking its duplicate existence
		if($create_user_id)
		{
			//adding the information for job seeker and Employed
			if($param_arr['role'] == \Extended\ilook_user::USER_TYPE_JOB_SEEKER || $param_arr['role'] == \Extended\ilook_user::USER_TYPE_EMPLOYED || $param_arr['role'] == \Extended\ilook_user::USER_TYPE_RECRUITER )
			{
				if($param_arr['role'] == \Extended\ilook_user::USER_TYPE_JOB_SEEKER)
				{
					$emp_company = $param_arr['jobseeker_company'];
					$emp_job_title = $param_arr['jobseeker_jobTitle'];
					$exp_from = $param_arr['experience_from'];
					$exp_to = $param_arr['experience_to'];
					$currently_working = 0;
				}
				elseif($param_arr['role'] == \Extended\ilook_user::USER_TYPE_EMPLOYED || $param_arr['role'] == \Extended\ilook_user::USER_TYPE_RECRUITER)
				{
					$emp_company = $param_arr['employed_company'];
					$emp_job_title = $param_arr['employed_jobTitle'];
					$exp_from = $param_arr['employed_from'];
					$exp_to = $param_arr['employed_to'];
					$currently_working = $param_arr['currently_work'];
				}

				$IsCompanyExist = \Extended\company_ref::checkCompany($emp_company, $create_user_id);
				if( $IsCompanyExist )
				{
					//if Company already exists
					$company_id = $IsCompanyExist;
				}
				else
				{
					//if this is a new Company
					$company_status = \Extended\company_ref::COMPANY_STATUS_ACTIVE;
					$add_company = \Extended\company_ref::addCompany($emp_company, $create_user_id, $company_status);
					if( $add_company )
					{
						$company_id = $add_company;
					}
				}

				// form an experience array
				$experience_arr = array();
				$experience_arr['emp_job_title'] = $emp_job_title;
				$experience_arr['emp_company_id'] = $company_id;
				$experience_arr['user_id'] = $create_user_id;
				$experience_arr['experience_from'] = $exp_from;
				$experience_arr['experience_to'] = $exp_to;
				$experience_arr['currently_work'] = $currently_working;

				//add experience
				$add_experience = \Extended\experience::addOrEditExperience( $experience_arr );
			}
			elseif($param_arr['role'] == \Extended\ilook_user::USER_TYPE_STUDENT)
			{
				$education_arr = array();
				$education_arr['from'] = $param_arr['student_from'];
				$education_arr['to'] = $param_arr['student_to'];

				// to add education, first add the school/univ after checking its duplicate existence
				$college_id = \Extended\school_ref::saveSchool( $create_user_id,$param_arr['college'] );
				if( $college_id )
				{
					//add Education details
					$add_education = \Extended\education_detail::addEduInfo( $create_user_id, $education_arr, $degree_id="", $college_id, $field_study_id="" );
				}
			}

			//creating basic message folders for the user.
			\Extended\user_folder::createBasicUserFolders($create_user_id);

			//Code for checking email in import table
			$invitation_senders = \Extended\import_external_contacts::getUsersWhoInvitedThisUser($params['email']);

			if( $invitation_senders )
			{ //if yes
				$registeration_type = \Extended\ilook_user::REGISTRATION_TYPE_INVITED;
				foreach ( $invitation_senders as $invitation_sender )
				{
					$link_request_type = \Extended\link_requests::LINK_REQUEST_TYPE_VIA_MAILER;

					$request_arr = array();
					$request_arr['link_request_type'] = $link_request_type;
					$request_arr['request_user_id'] = $invitation_sender->getImport_external_contactsUser()->getId();
					$request_arr['accept_user_id'] = $create_user_id;
					\Extended\link_requests::sendRequest($request_arr);

				}
				//Delete records form import_external_contacts table.
				\Extended\import_external_contacts::deleteRecords($params['email']);
			}
			else
			{
				$registeration_type = \Extended\ilook_user::REGISTRATION_TYPE_SELF_REGISTERED;
			}
			//Updates Registeration_type in ilook_user table
			\Extended\ilook_user::updateRegisterationType($registeration_type, $create_user_id);

			//sending a verification link on registered email
			$is_mail_sent =Email_CommonMails::verificationEmail($create_user_id, $param_arr['search_profile_id']);
			$is_mail_sent = 1;

			if( $is_mail_sent ){

				Zend_Session::namespaceUnset("reg_step_one_data");
				Zend_Session::namespaceUnset("reg_step_facebook");
				Zend_Session::namespaceUnset("twitterUser");

				//Checks that does this user have full access.
				$this->_helper->redirector('registered', 'registration', 'default');
			}
			else
			{
				// Delete user
				if( $add_experience ):
					\Extended\experience::deleteExperienceByUser( $create_user_id );
				endif;
				if( $add_education ):
					\Extended\education_detail::deleteEducationByUser( $create_user_id );
				endif;

				\Extended\ilook_user::softDeleteUser( $create_user_id );

				\Extended\ilook_user::hardDeleteUser($create_user_id);

				Zend_Session::namespaceUnset("reg_step_facebook");
				Zend_Session::namespaceUnset("twitterUser");
				Zend_Session::namespaceUnset("reg_step_one_data");

				$this->_helper->redirector('registrationerror', 'registration', 'default');
			}

		}
		die;
	}

	/**
	 * When User will enter the email in Registeration step-first
	 * With the help of jquery remote this function will check the
	 * availability of that email in database
	 * and returns true or false accordingly.
	 *
	 * @since 18, June 2013
	 * @author Ritu
	 * @version 1.1
	 */
	public function checkEmailExistAction(){
		$params = $this->getRequest()->getParams();
		$email_check = \Extended\ilook_user::isEmailExist($params['email']);

		if($email_check){
			echo Zend_Json::encode(false);
		}else{
			echo Zend_Json::encode(true);
		}
		die();
	}

	/**
	 * Used for fetching the industry list
	 * and assigning it to view to use in
	 * js file
	 * @author Ritu
	 * @version 1.0
	 */
	public function industryListAction(){
		$industry_list = \Extended\industry_ref::getIndustryList();
		$this->view->industry = $industry_list ;
	}

	/**
	 * function used for get the school listing for autocomplete functionality
	 *
	 * @author RSHARMA
	 * @version 1.0
	 * @return json
	 *
	 */
	public function getSchoolsListAction()
	{
		$params=$this->getRequest()->getParams();
		$keyword=$params["term"];
		$result=\Extended\school_ref::getSchoolList($keyword);
		$data_arr=array();
		$i=0;
		while($i<count($result)){
			$data_arr[]=array(
				'label'=>$result[$i]['title'],
				'value'=>$result[$i]['title'],
				'id'=>$result[$i]['id']
			);
			$i++;
		}
		echo Zend_Json::encode($data_arr);
		die;
	}

	/**
	 * handles ajax call from jquery autocomplete
	 * for companies.
	 *
	 * @author RSHARMA
	 * @author ssharma4
	 * @version 1.1
	 */
	public function getAllRefCompaniesAction()
	{
		$allCompanies = \Extended\company_ref::getAllCompanies( $this->getRequest()->getParam('term'),$offset = 0, $limit = 20 );
		$temp = array();
		if($allCompanies)
		{
			foreach ( $allCompanies as $key=>$com )
			{
				$temp[$key]['id'] = $com->getId();
				$temp[$key]['label'] = $com->getName();
				$temp[$key]['value'] = $com->getName();
			}
		}
		echo Zend_Json::encode($temp);
		die;
	}

	/**
	 * It verifies the link clicked by user
	 * which was sent in his mail after
	 * registeration.
	 *
	 * The name of action is not appropriate please read documentation before use -Jaskaran
	 *
	 * @param Last parmater is $is_first_time_login = 1;
	 * @author RSHARMA
	 * @version 1.0
	 *
	 */
	public function verificationByLinkAction(){

		$params = $this->getRequest()->getParams();
		if (isset($params['reg_1'])) {

			$user_id = base64_decode($params['reg_1']);
			$messages = new Zend_Session_Namespace('messages');
			if(isset($user_id))
			{
				$user_obj = \Extended\ilook_user::getRowObject($user_id);
				if($user_obj)
				{
					if(!$user_obj->getVerified())
					{
						$user_obj = \Extended\ilook_user::markAsVerified( $user_id );
						\Extended\ilook_user::updateUserStatus( $user_id, \Extended\ilook_user::USER_STATUS_ACTIVE );

						if( $user_obj->getVerified() )
						{
							$res=\Extended\import_external_contacts::retrieveLinkRequestedUsers($user_obj->getEmail());
							$link_request_type = \Extended\link_requests::LINK_REQUEST_TYPE_VIA_ILOOK;
							$request_user=$user_id;

							if($res)
							{
								foreach($res as $v)
								{
									if($v->getImport_external_contactsUser()->getId())
									{
										$request_arr = array();
										$request_arr['link_request_type'] = $link_request_type;
										$request_arr['request_user_id'] = $v->getImport_external_contactsUser()->getId();
										$request_arr['accept_user_id'] = $request_user;
										$send_link_request = \Extended\link_requests::sendRequest($request_arr);
									}
								}
							}

							//Adding auto wallposts on wall. These wallposts were added to database as fixtures.
							$wallpost_ids_arr = array( 4278, 4281, 4282, 4283, 4284, 4285, 4286, 4287, 4288, 4289,
								4290, 4291, 4292, 4293, 4294, 4295, 4296, 4297, 4298, 4299, 4300,
								4304, 4305, 4306, 4307, 4308, 4309, 4310, 4311, 4312, 4313, 4314,
								4315, 4316, 4317 );
							\Extended\posted_to::addToUserOfWallposts( $wallpost_ids_arr, $user_id );
							$postData = array(
											'link_request' => 1,
											'feedback_request' => 1,
											'reference_request' => 1,
											'job_invite' => 1,
											'general_notification' => 1
										);
							\Extended\notification_settings::saveNotificationSettings($user_id,$postData);

							// Registering user to chat--------------------------
							//Set up chatsettings for openfire chat.
							$openfirePassword = Helper_common::generatePassword(10);
							$chat_settings = array( 'status' => 1, 'type' => 1,
								'iLookUser' => $user_id,
								'openfire_password'=>base64_encode($openfirePassword)
							);


							//creating user on openfire.
							$createOpenfireUserHits = 0;
							tryTocreateUserOnOpenfireServer:

							$openFireMain = new Openfire\Main();
							$response = $openFireMain->createUser(
								['username' => $user_obj->getUsername(),
									'password' => $openfirePassword,
									'name' => $user_obj->getFirstname() . ' ' . $user_obj->getLastname(),
									'email' => $user_obj->getEmail()
								]
							);
							$createOpenfireUserHits++;
							if( $response['http_code'] == 201 || $response['http_code'] == 200 )
							{
								// persisting openfire user data on iLook DB (required only).
								\Extended\chat_settings::add($chat_settings);
							}
							else
							{
								sleep(5); //Wait for 5 seconds, may be server is busy.
								if($createOpenfireUserHits <= 100) { //it will try hundred times.
									goto tryTocreateUserOnOpenfireServer;
								}
							}

							// End Registering user to chat------------------------

							$messages->successMsg = "Congratulations, You have successfully registered with iLook! Please Login to continue.";

							if(isset($params['sp_1']) && $params['sp_1']!=""){

								$this->_helper->redirector('iprofile', 'profile','default',array('id'=>base64_decode($params['sp_1'])));
							}
							else{
								$this->_helper->redirector('index', 'index');
							}
						}
					}
					else
					{
						$messages->successMsg = "Your account is already verified! Please login to continue.";
						$this->_helper->redirector('index', 'index');
					}
				}
				else
				{
					$messages->errorMsg = "Your registeration process has not successfully completed. Please contact admin for help.";

					$this->_helper->redirector('index', 'index');
				}
			}
		}
		$this->_helper->redirector('index', 'index');
		die;
	}

	public function clearSessionAction(){
		$step_one_data = new Zend_Session_Namespace('reg_step_one_data');
		unset($step_one_data->usr_arr);
		echo Zend_Json::encode(true);
		die;
	}

	/**
	 * Action for ajax call,
	 * Fills states dropdown according to country selected.
	 * If country selected does not have states, it hides states
	 * dropdown and fills cities.
	 *
	 * @author jsingh7,sjaiswal
	 * @version 1.1
	 *
	 */
	public function getResponseForCountrySelectedAction()
	{
		$params = $this->getRequest()->getParam("country_id");
		$params_array = explode(',', $params);
		$country_id = $params_array[0];
		$ret_array = array();

		//do country have states.
		$country_obj = \Extended\country_ref::getRowObject($country_id);
		if( $country_obj )
		{
			if( $country_obj->getHave_states() )
			{
				$states = \Extended\state::getAllActiveStatesForCountry($country_id);
				$ret_array['have_states'] = 1;
				$ret_array['count'] = count($states);
				foreach ( $states as $key=>$state )
				{
					$ret_array['options'][$key]['id'] = $state->getId();
					$ret_array['options'][$key]['name'] = utf8_decode($state->getName());

				}
			}
			else
			{
				$cities = \Extended\city::getAllActiveCitiesForCountry($country_id);
				$ret_array['have_states'] = 0;
				$ret_array['count'] = count($cities);
				foreach ( $cities as $key=>$city )
				{
					$ret_array['options'][$key]['id'] = $city->getId();
					$ret_array['options'][$key]['name'] = utf8_decode($city->getName());
				}
			}
		}
		echo Zend_Json::encode( $ret_array );

		die;
	}

	/**
	 * Action for ajax call,
	 * Fills cities dropdown according to state selected.
	 *
	 * @author jsingh7
	 * @version 1.0
	 *
	 *
	 */
	public function getResponseForStateSelectedAction()
	{
		$state_id = $this->getRequest()->getParam("state_id");
		$ret_array = array();

		$cities = \Extended\city::getAllActiveCitiesForState($state_id);
		foreach ( $cities as $key=>$city )
		{
			$ret_array['options'][$key]['id'] = $city->getId();
			$ret_array['options'][$key]['name'] = $city->getName();
		}

		echo Zend_Json::encode( $ret_array );
		die;
	}

	/**
	 * function used to get list of cities according to country id
	 * @param state_id
	 * @author Sunny Patial
	 * @return json_array
	 * @version 1.0
	 *
	 *
	 *
	 */
	public function getCitiesUnderCountryAction()
	{
		$country_id=$this->_getParam("country_id");
		echo Zend_Json::encode(\Extended\city::getCityListUnderCountry($country_id));
		die;
	}

	/**
	 * function used to get list of cities according to state id
	 * @param state_id
	 * @author Sunny Patial
	 * @return json_array
	 * @version 1.0
	 *
	 *
	 */
	public function getCitiesAction()
	{
		$state_id=$this->_getParam("state_id");
		echo Zend_Json::encode(\Extended\city::getCityList($state_id));
		die;
	}


	/**
	 * function used to get country, state and city of user according to ip address
	 * @author sjaiswal
	 * @return json
	 * @version 1.0
	 */
	function getIpDetailsAction() {

		$ip =  $_SERVER['REMOTE_ADDR'];
		$key = 'b90b45d4bd53c881501d8dc95cefa0b4585c88e790f811972065213fbf39ab8f';
		$url = "http://api.ipinfodb.com/v3/ip-city/?key=$key&ip=$ip&format=json";
		$url = trim($url);
		$d = file_get_contents($url);
		echo $d;
		die;


	}
	/**
	 * function used to get list of states according to country id
	 * @param country_id
	 * @author Sunny Patial
	 * @return json_array
	 * @version 1.0
	 *
	 */
	public function getStatesAction()
	{
		$country_id=$this->_getParam("country_id");
		echo Zend_Json::encode(\Extended\state::getStateList($country_id));
		die;
	}


	/**
	 * This action is used as an inbetween landing page after successful signup.
	 * Redirects to index/index
	 * @author hkaur5
	 * @return void
	 */

	public function registeredAction()
	{
		//$this->_helper->redirector('index', 'index', 'default');
		$this->view->message = 'Your registration is successful. A verification link is sent to your email id.'.'</br>';
		$this->view->message .= 'You will be able to login only after you verify by clicking this link';

	}
	/**
	 * This action is used as an inbetween landing page after error in signup.
	 * @author sjaiswal
	 * @return void
	 */

	public function registrationerrorAction()
	{
		//$this->_helper->redirector('index', 'index', 'default');
		$this->view->message = "User did not register successfully, In case if you are unable to reuse this email ID to register on iLook, please contact us.";

	}


}

