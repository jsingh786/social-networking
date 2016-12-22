<?php
class IndexController extends Zend_Controller_Action
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
	 *
	 *
	 */
	public function preDispatch()
	{
		
		if (Auth_UserAdapter::hasIdentity()) {

			//If user is logged in and still using public profile view's invite to link option.
			//In this case redirecting to send link request function.
			$prms = $this->getRequest()->getParams();

			//temporary condition
			if($prms['action']!='investors-look'){
				if ($prms['invite']) {
					$link_request_accepter_id = $prms['invite'];
					$this->_redirect(PROJECT_URL . "/" . PROJECT_NAME . "links/send-link-request/accept_user/" . $link_request_accepter_id . '/link_req_through_pub_view/1');
				}

				//If someone clicked on view full profile through public view even when logged in.
				if ($prms['full_prof']) {
					$id = $prms['full_prof'];
					$user_obj = \Extended\ilook_user::getRowObject($id);
					if ($user_obj) {
						$username = $user_obj->getUsername();
						$this->_redirect(PROJECT_URL . "/" . PROJECT_NAME . $username);
					} else {
						$this->_helper->redirector("is-not-available", "error", 'default', array('message' => 'Oops! this profile does not exist.'));
					}
				}

				if ($prms['email']) {
					$this->_redirect(PROJECT_URL .'/' . PROJECT_NAME . 'index/investors-look?email='.$prms["email"]);

				}
				$this->_helper->redirector('index', 'dashboard');
			}

		}

		//If signup form step one is already filled, then redirect.
		$step_one_data = new Zend_Session_Namespace('reg_step_one_data');
		if (isset($step_one_data->usr_arr) && count($step_one_data->usr_arr) != 0) {
			$this->_helper->redirector('index', 'registration');
		}

	}

	public function init()
	{
		/* Initialize action controller here */
	}

	public function indexAction()
	{

		// if 'Keep me logged in', was checked.
		$prms = $this->getRequest()->getParams();

		//If someone has invited user through public view and is not logged in.
		if (isset($prms['invite'])) {

			$after_login_redirection_session = new Zend_Session_Namespace('after_login_redirection_session');
			$after_login_redirection_session->action = 6;
			$after_login_redirection_session->invite_to_connect_through_profile = $prms['invite'];
		}


		//If someone clicked on view full profile through public view and is not logged in.
		if (isset($prms['full_prof'])) {

			$after_login_redirection_session = new Zend_Session_Namespace('after_login_redirection_session');
			$after_login_redirection_session->action = 7;
			$after_login_redirection_session->full_prof = $prms['full_prof'];
		}
		
		if (@$_COOKIE['ilook_user_email'] && @$_COOKIE['ilook_user_password']) {
			$this->_helper->redirector('login', 'authenticate');
		}
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
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 */
	public function checkEmailExistAction()
	{
		$params = $this->getRequest()->getParams();
		$email_check = \Extended\ilook_user::isEmailExist($params['email']);

		if ($email_check) {
			echo Zend_Json::encode(false);
		} else {
			echo Zend_Json::encode(true);
		}
		die();
	}

	/**
	 * Action associated with home page
	 * search without login
	 *
	 * @author jsingh7
	 * @version 1.0
	 *
	 *
	 */
	public function homeSearchAction()
	{
		// action body
		//$this->_helper->layout()->disableLayout();
		$params = $this->getRequest()->getParams();
		$this->view->prms = $params;
		$fname = trim(@$params ["first_name"]);
		$lname = trim(@$params ["last_name"]);

		if ($fname || $lname) {
			$query_str = "";
			if ($fname) {
				$query_str .= 'first_name:' . $fname . '*';
			}
			if ($lname) {
				$query_str .= ' AND last_name:' . $lname . '*';
			}
			if (@$params['country']) {
				$result = \Extended\ilook_user::getUsersForLuceneQuery($query_str, $params['country']);
			} else {
				$result = \Extended\ilook_user::getUsersForLuceneQuery($query_str);
			}

			//------ PAGINATION -------
			$paginator = Zend_Paginator::factory($result);
			$paginator->setItemCountPerPage(@$params['list_len']);
			$paginator->setCurrentPageNumber(@$params['page']);
			$this->view->paginator = $paginator;

			$this->view->countries = Extended\country_ref::getAllActiveCountries();

			if (@$params['country']) {
				$this->view->country = Extended\country_ref::getRowObject($params['country'])->getName();
			}
		} else {
			$this->_helper->redirector('index', 'index');
		}
	}

	/**
	 * returns all users with active status.
	 * used for ajax call.
	 * accepts post or get params (column_name, term)
	 *
	 * @author jsingh7
	 * @version 1.0
	 */
	public function getAllActiveUsersAction()
	{
		// action body
		$result = Extended\ilook_user::getAllActiveUsers($this->getRequest()->getParam("column_name"), $this->getRequest()->getParam("term"));
		$temp = array();
		if (@$result) {
			foreach ($result as $key => $res) {
				$temp[$key]['label'] = $res['column_name'];
				$temp[$key]['value'] = $res['column_name'];
			}
		}
		echo Zend_Json::encode($temp);
		die;
	}

	/**
	 * Action to show some details of profile
	 * because user in not logged in.
	 *
	 * @author Jsingh7
	 * @version 1.0
	 *
	 *
	 *
	 *
	 *
	 *
	 */
	public function shortProfileAction()
	{
		// action body
		//$this->_helper->layout()->disableLayout();
		$this->view->prms = $this->getRequest()->getParams();
		$this->view->user_collec = Extended\ilook_user::getRowObject($this->getRequest()->getParam('id'));

	}

	public function setSessionAction()
	{
		$after_login_redirection_session = new Zend_Session_Namespace('after_login_redirection_session');

		// value 1 is used for action 'Profile'
		$after_login_redirection_session->action = 1;

		// store user id 
		$after_login_redirection_session->OpenthisProfileFirst = $this->getRequest()->getParam('id');
		echo Zend_Json::encode($after_login_redirection_session);
		die;
	}

	public function generalAction()
	{
		// action body
	}

	/**
	 * Action to fetch visitor's curent location from his email address & display static page
	 * because user in not logged in.
	 *
	 * @author ssharma4
	 * @version 1.0
	 */
	public function investorsLookAction()
	{
		$params = $this->getRequest()->getParams();
		if (!isset($params['email'])) {
			$params['email'] = '';
		}
		$ch = curl_init();
		curl_setopt_array(
			$ch, array(
			CURLOPT_URL => 'http://ipinfo.io/' . $_SERVER['REMOTE_ADDR'],
			CURLOPT_RETURNTRANSFER => true
		));

		$output = curl_exec($ch);


		$location = json_decode($output);


		if (isset($params['email']) && $params['email'] != "") {


			//sent mail here to admin to track user current location details
			$subject = "iLook : Track Location Details";
			$bodyText =
				'<br>
			
		    			<p style="margin:0 20px 0 0; padding:0; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#3a3a3a ">Please find below mentioned location details of visitor with email ID: ' . $params['email'] . '</p>
						
		    			<br />
		    			<p style="margin:0 20px 0 0; padding:0; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#3a3a3a ">IP Address: ' . $_SERVER['REMOTE_ADDR'] . '</p>
		    			<p style="margin:0 20px 0 0; padding:0; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#3a3a3a ">Country: ' . $location->country . '</p>
		    			<p style="margin:0 20px 0 0; padding:0; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#3a3a3a ">State: ' . $location->region . '</p>
		    			<p style="margin:0 20px 0 0; padding:0; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#3a3a3a ">City: ' . $location->city . '</p>
		    			<p style="margin:0 20px 0 0; padding:0; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#3a3a3a ">Zipcode: ' . $location->postal . '</p>
		    			<p style="margin:0 20px 0 0; padding:0; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#3a3a3a ">Location LatLong: ' . $location->loc . '</p>
		    			
						';

			$adminDetails = \Extended\admin::getAdminbyrole();

			\Email_Mailer::sendMail ( $subject, $bodyText, 'iLook Admin', $adminDetails->getEmail_id() );


		}

	}

}





