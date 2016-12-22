<?php

class FeedbackController extends Zend_Controller_Action
{
	/**
	 * This function checks auth storage and
	 * manage redirecting.
	 *
	 * @author jsingh7,sjaiswal
	 * @since 20 June, 2012
	 * @version 1.1
	 * @see Zend_Controller_Action::preDispatch()
	 *
	 */
	public function preDispatch()
	{
		//Creating session to store provide feedback information.
		//Check if fdbck_requester_id and fdbck_provider_id is present in url only then session will be created.
		if( $this->getRequest()->getParam('fdbck_requester_id') && $this->getRequest()->getParam('fdbck_provider_id') )
		{
			$after_login_redirection_session = new Zend_Session_Namespace('after_login_redirection_session');
			// value 2 is used for action 'Feedback request'
			$after_login_redirection_session->action = 2;
			$after_login_redirection_session->fdbk_rqstr_id = $this->getRequest()->getParam('fdbck_requester_id');
			$after_login_redirection_session->provider_id = $this->getRequest()->getParam('fdbck_provider_id');
			 
		}
		if( !Auth_UserAdapter::hasIdentity() )
		{
			$this->_helper->redirector( 'index', 'index' );
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
    		$this->_helper->redirector("index", "dashboard");
    	}
    	else
    	{
    		$this->_helper->redirector("index", "index");
    	}
    }

    public function requestAction()
    {
        $user_id = Auth_UserAdapter::getIdentity()->getId();
    	$user_obj =  \Extended\ilook_user::getRowObject($user_id);
    	$user_type = $user_obj->getUser_type();
    	if ( $user_type == \Extended\ilook_user::USER_TYPE_STUDENT )
    	{
    		$this->view->student = 1;
    	}
		if ( $user_type == \Extended\ilook_user::USER_TYPE_HOME_MAKER )
		{
			$this->view->home_maker = 1;
		}
    		$All_exp = \Extended\experience::getAllExperiences($user_id);
    		$job_title = array();
    		if( $All_exp )
    		{	
	    		foreach ( $All_exp as $exp )
	    		{
	    			$job_title[] =  $exp->getJob_title();
	    	
	    		}
    		}	
    		if($job_title)
    		{
    			 $this->view->jobs = $job_title;
    		}
    }

    public function getMyLinksAction()
    {
    	$links_obj = Extended\ilook_user::getLinksOfUser( Auth_UserAdapter::getIdentity()->getId() );
    	$contacts_r = array();
    	foreach ( $links_obj as $key=>$lk )
    	{
    		$contacts_r[$key]['user_id'] = $lk->getId();
    		$contacts_r[$key]['first_name'] = $lk->getFirstname();
    		$contacts_r[$key]['last_name'] = $lk->getLastname();
    		$contacts_r[$key]['email'] = $lk->getEmail();
    		$contacts_r[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($lk->getId(), 3);
    	}
    	echo Zend_json::encode($contacts_r);
    	die;
    }

    /**
     * Returns user info,
     * accepts user_id.
     * 
     * @author jsingh7
     * @version 1.0
     *
     *
     *
     *
     */
    public function getUserInfoAction()
    {
    	// action body
    	$user_info = \Extended\ilook_user::getUserdetailById( $this->getRequest()->getParam('user_id') );
    	echo Zend_Json::encode($user_info);
    	die;
    }

    /**
     * In request feedback, for token input
     * it gets the params, searches and
     * matches the entered
     * keyword with the links of a
     * logged-in user who are also in lucene
     * files
     * Returns Json of user info
     * @author RSHARMA
     * 
     *
     *
     *
     *
     */
    public function getMyMatchingContactsAction()
    {
    	// action body
    	$params = $this->getRequest()->getParams();
    	$params['keyword'] = $params['q'];
    	$getContacts = \Extended\ilook_user::getMatchingContacts($params['keyword'], Auth_UserAdapter::getIdentity()->getLink_list() );
    	;
    	$Json_arr = array();
    	if( $getContacts )
    	{
    		$i = 0;
    		foreach($getContacts as $contact)
    		{
    			$Json_arr[$i]['id'] = $contact->getId();
	    		$Json_arr[$i]['first_name'] = $contact->getFirstname();
	    		$Json_arr[$i]['last_name'] = $contact->getLastname();
	    		$Json_arr[$i]['email'] = $contact->getEmail();
	    		$Json_arr[$i]['url'] = Helper_common::getUserProfessionalPhoto($contact->getId(), 3);
	    		$i++;
    		}
    	}
    	if($Json_arr)
    	{
    		$json_response = Zend_Json::encode($Json_arr);
    	}
    	else
    	{
    		$json_response = Zend_Json::encode($Json_arr);
    	}
    	echo $json_response;
    	die;
    }

    /**
     * This function posts the value through
     * ajax and insert the request parameters to database.
     * @author hkaur5,sjaiswal
     * @version 1.1
     *
     */
    public function sendFeedbackRequestAction()
    {
    	// action body
    	$zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
    	$params = $this->getRequest()->getParams();
    	$requesterId= Auth_UserAdapter::getIdentity()->getId();
    	$provderId = $params['requester_links'];
    	//Get requester id obj 
    	$requester_obj = \Extended\ilook_user::getRowObject($requesterId);
    	
    	//If requester is student then display student in 'requested as'.
    	if( $requester_obj->getUser_type() == \Extended\ilook_user::USER_TYPE_STUDENT )
    	{
    		$requested_as = "Student";
    	}
    	else 
    	{
	    	$requester_exp = Helper_common::getUserProfessionalInfo($requesterId);
	    	$requested_as = $requester_exp[0];
    	}

    	$feedback_request_id = \Extended\feedback_requests::addFeedbackRequest( 
    																			$params['requester_jobs'],
    																			$requested_as,
    																			$zend_filter_obj->filter($params['requester_msg']),  
    																			$requesterId,  
    																			$provderId,
    																			\Extended\feedback_requests::VISIBILITY_CRITERIA_HIDDEN,
    																			\Extended\feedback_requests::IS_ACCEPTED_NO 
    																			);
    	$provider_id_arr = array();
    	$provider_id_arr[] = $provderId;
    	
    	if( $feedback_request_id)
    	{
    		$subject = "Feedback Request";
    		$requester_name = \Extended\ilook_user::getRowObject($requesterId)->getFirstname()." ".\Extended\ilook_user::getRowObject($requesterId)->getLastname();
    		$message = $requester_name." has sent you a Feedback request. To Accept the request please click on the Button below.";
    		$message .= '<div class="accept_feedback">';
    		$message .= '<a id = "accept_link_req" href = "'.PROJECT_URL.'/'.PROJECT_NAME.'feedback/provide-feedback/fid/'.$feedback_request_id.'#'.$requesterId.'">Accept</a>';
    		$message .= '</div>';
			
			//Added by sjaiswal.
			$email_on_feedback_req = \Extended\feedback_requests::checkEmailOnFeedbackReq($provderId);
			\Helper_common::sendMessage( $requesterId, $provider_id_arr, $subject, $message, \Extended\message::MSG_TYPE_FEEDBACK_REQ, NULL, FALSE, null, null, $feedback_request_id,null,null,null,11,null);
			
			//Condn added by sjaiswal.
			if($email_on_feedback_req=='default' || $email_on_feedback_req==true)
			{		
	    		//send an email to the user who receives feedback request
	    		$subject = "ilook:: New Feedback Request";
	    		$message = "";
	    		$message = '<table width="100%" align="left" cellspacing="0" cellpadding="0" style=" padding:0; font-family:Arial;">
							<tr>
							<td style="padding:20px 0 0 0; margin:0;"></td>
							</tr>
							<tr>
							<td>
							<table width="100%" cellspacing="0" cellpadding="0" style=" padding:10px 0; margin:0; font-family:Arial; background:#ffffff; border:1px solid #c4c4c4;">
							<tr>
							<td style="padding:15px 0;margin:0;" align="center" >
							<p style=" padding:0px 0; margin:0; color: #444444;font-family:Arial; font-size:13px;">'.$requester_name.' has sent you a Feedback request. To Accept the request please click on the Button below.
							</p>
							</td>
							</tr>
							<tr>
							<td style="padding:0 0 10px 0; margin:0;" align="center">
							<a href="'.PROJECT_URL.'/'.PROJECT_NAME.'feedback/provide-feedback/fdbck_requester_id/'.$requesterId.'/fdbck_provider_id/'.$provderId.'" >
							<img src="'.PUBLIC_PATH.'/images/accept-btn.jpg" style="line-height:0; font-size:0" alt=""/>
							</a>
							</td>
							</tr>
							</td>
							</tr>
							</table>
							</table>';
	    		$obj = \Extended\ilook_user::getRowObject($provderId);
	    		$send_mail = Email_Mailer::sendMail(
					$subject,
					$message,
					$obj->getFirstname(),
					$obj->getEmail(),
					array(),
					Email_Mailer::DEFAULT_SENDER_NAME,
					Email_Mailer::DEFAULT_SENDER_EMAIL,
					Email_Mailer::DEFAULT_SALUTATION,
					Email_Mailer::DEFAULT_COMPLIMENTARY_CLOSING
				);


			}
    	}
    	echo Zend_Json::encode( 1 );
    	die;
    }

    /**
     * gets the pending feedback requests sent to current user ((requests which are not
     * replied to).
     * @author hkaur5
     *
     */
    public function pendingRequestAction()
    {
    	$recieved_feedback_requests=Extended\feedback_requests::getPendingFeedbackRequestsCount( Auth_UserAdapter::getIdentity ()->getId(), @$this->getRequest()->getParam("order")?@$this->getRequest()->getParam("order"):"DESC"  );
		if($recieved_feedback_requests)
		{
			$params = $this->getRequest()->getParams();
			
			if( ! @$params['list_len'] )
			{
				$params['list_len'] =10;
			}
		$this->view->prms = $params;
		$this->view->recieved_feedback_requests = $recieved_feedback_requests;
		$this->view->order = @$this->getRequest()->getParam("order");
		$unread_requests= Extended\feedback_requests::getUnreadFeedbackRequestsCount( Auth_UserAdapter::getIdentity ()->getId () );
		$count_unread_feedback_requests=$unread_requests[0]["num_of_rows"];
		$this->view->unread_feedback_requests=$count_unread_feedback_requests ;
		
		//------ PAGINATION -------
		$paginator = Zend_Paginator::factory($recieved_feedback_requests);
		$paginator->setItemCountPerPage(@$params['list_len']);
		$paginator->setCurrentPageNumber(@$params['page']);
		$this->view->paginator=$paginator;
		
		}
		else
		{
			$this->view->no_pending_feedback_requests_msgs="No Pending Feedbacks";
		
   		 
   		 }
    }

    public function provideFeedbackAction()
    {
        // action body

        $params = $this->getRequest()->getParams();
        $this->view->feedback_id = isset($params['fid'])?$params['fid']:NULL;
    	$after_login_redirection_session = new Zend_Session_Namespace('after_login_redirection_session');

    	if( Auth_UserAdapter::hasIdentity() )
    	{
    		$logged_in_user_id = Auth_UserAdapter::getIdentity()->getId();
    		//Redirect user to provide feedback page if he/she is logged in, feedback session exists and
    		//his/her id mataches with provider id in feedback session.
    		if ( $after_login_redirection_session->provider_id && $after_login_redirection_session->provider_id == $logged_in_user_id )
    		{
    			$fdbk_rqstr_id = $after_login_redirection_session->fdbk_rqstr_id;
    			$after_login_redirection_session->unsetAll();
    			$this->_redirect(PROJECT_URL."/".PROJECT_NAME."feedback/provide-feedback#".$fdbk_rqstr_id );
    		}
    			
    		//Redirect to dashboard in case if user has identity(logged in), feedback session has formed but feedback provider id doesn't match with logged in user id.
    		else if (  $after_login_redirection_session->provider_id && $after_login_redirection_session->provider_id != $logged_in_user_id )
    		{
    			$after_login_redirection_session->unsetAll();
    			$this->_helper->redirector( 'index', 'index' );
    		}
    	}
    	else if( !Auth_UserAdapter::hasIdentity() )
		{
			$this->_helper->redirector( 'index', 'index' );
		}
    		
    	
       
    }

    /**
     * Used for ajax call,
     * Saves feedback.
     *
     * @author hkaur5
     * @version 1.0
     *
     *
     */
    public function sendFeedbackAction()
    {
//     	action body
    	$zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
    	$params = $this->getRequest()->getParams();
 	
    	$providerId = Auth_UserAdapter::getIdentity()->getId();
    	$receiverId = $params['provider_links'];
    	//Get provider'obj
    	$provider_user_obj = \Extended\ilook_user::getRowObject($providerId);
    	 
    	//If provider is student then display student in 'provided as' field.
    	if( $provider_user_obj->getUser_type() == \Extended\ilook_user::USER_TYPE_STUDENT )
    	{
    		$provided_as = "Student";
    	}
    	else
    	{
    		$provider_exp = Helper_common::getUserProfessionalInfo( $providerId );
			if( $provider_exp ) {
				$provided_as = $provider_exp[0];
			}
    		
    	}
    	$feedback_ID = \Extended\feedback_requests::provideFeedback(
									    				$params['requester_jobs'],
    													$provided_as,
									    				$zend_filter_obj->filter($params['provider_msg']),
									    				$receiverId,
									    				$providerId,
									    				\Extended\feedback_requests::VISIBILITY_CRITERIA_HIDDEN,
									    				\Extended\feedback_requests::IS_ACCEPTED_NO,
    													$params['fdbk_id']
    		);
    	if($feedback_ID)
    	{
    		$messages = new Zend_Session_Namespace('messages');
    		$messages->successMsg = "Feedback(s) has been sent";
    		echo Zend_Json::encode( 1 );
    	}
//     	else if($feedback_ID == 2)
//     	{
//     		echo Zend_Json::encode( 2 );
//     	}
    	die;
    }

    /**
     * gets the feedbacks provided by current user
     * @author hkaur5
     *
     */
    public function providedAction()
    {
    	$feedback_provided=Extended\feedback_requests::getFeedbackProvided( Auth_UserAdapter::getIdentity ()->getId (),@$this->getRequest()->getParam("order")?@$this->getRequest()->getParam("order"):"DESC"  );
    	if($feedback_provided)
    	{$params = $this->getRequest()->getParams();
			
			if( ! @$params['list_len'] )
			{
				$params['list_len'] =10;
			}
			$this->view->prms = $params;
    		$this->view->feedback_provided = $feedback_provided;
    		$this->view->order = @$this->getRequest()->getParam("order");
    		
    		//------ PAGINATION -------
    		$paginator = Zend_Paginator::factory($feedback_provided);
    		$paginator->setItemCountPerPage(@$params['list_len']);
    		$paginator->setCurrentPageNumber(@$params['page']);
    		$this->view->paginator=$paginator;
    	}
    	else
    	{
    		$this->view->no_feedback_provided_msg="No Feedbacks Provided";
   		
   		 }
    }
    /**
     * gets the received feedbacks for the current user 
     * @author hkaur5
     */

    public function receivedAction()
    {
// 	Zend_Debug::dump($feedback_by_acceptance);
// 	die;
   	$feedback_received = Extended\feedback_requests::getReceivedFeedback( Auth_UserAdapter::getIdentity()->getId(),@$this->getRequest()->getParam("order")?@$this->getRequest()->getParam("order"):"DESC" );
    	if($feedback_received)
    	{
    		$params = $this->getRequest()->getParams();
    		
    		if( ! @$params['list_len'] )
    		{
    			$params['list_len'] =10;
    		}
    		$this->view->prms = $params;
    		
    		$this->view->feedback_received = $feedback_received;
    		$this->view->order = @$this->getRequest()->getParam("order");
    		$unaccepted_feedbacks= Extended\feedback_requests::countReceivedFeedback( Auth_UserAdapter::getIdentity ()->getId () );
    		$count_unaccepted_feedbacks=$unaccepted_feedbacks[0]["num_of_rows"];
    	    $this->view->unaccepted_feedbacks=$count_unaccepted_feedbacks;
    	    
    	    //------ PAGINATION -------
    	    $paginator = Zend_Paginator::factory($feedback_received);
    	    $paginator->setItemCountPerPage(@$params['list_len']);
    	    $paginator->setCurrentPageNumber(@$params['page']);
    	    $this->view->paginator=$paginator;
    	}
    	else
    	{
    		$this->view->no_feedbacks_received_msg="No Feedbacks Provided";
   		
   		 }
    }
	/**
	 * accept current received feedback
	 * @author hkaur5
	 * @version 1.0
	 */
	public function acceptFeedbackAction()
	{
		$feedback_id = Extended\feedback_requests::updateAcceptedStatus( Auth_UserAdapter::getIdentity ()->getId (), $this->getRequest()->getparam('feedback_req_id'), \Extended\feedback_requests::IS_ACCEPTED_YES, \Extended\feedback_requests::VISIBILITY_CRITERIA_DISPLAYED  );
		
		if($feedback_id):
			echo Zend_Json::encode( 1 );
		else:
			echo Zend_Json::encode( 0 );
		endif;
		die;
	}
	/**
	 * hides the received feedback
	 * return json to ajax call
	 * @author hkaur5
	 */
	public function hideFeedbackAction()
	{
		$feedback_id = Extended\feedback_requests::hideFeedback( Auth_UserAdapter::getIdentity ()->getId (), $this->getRequest()->getparam('feedback_req_id'), \Extended\feedback_requests::VISIBILITY_CRITERIA_HIDDEN);
		if($feedback_id)
		{
			$this->view->feedback_not_visible=$feedback_id;
			echo Zend_Json::encode( 1 );
		}
		die;
	}
	/**
	 * changes the visibility to display of the received feedback 
	 * return json to ajax call
	 * @author hkaur5
	 */
	public function displayFeedbackAction()
	{
		$feedback_id = Extended\feedback_requests::displayFeedback( Auth_UserAdapter::getIdentity ()->getId (), $this->getRequest()->getparam('feedback_req_id'), \Extended\feedback_requests::VISIBILITY_CRITERIA_DISPLAYED);
		if($feedback_id)
		{
			$this->view->feedback_visible=$feedback_id;
			echo Zend_Json::encode( 1 );
		}
		die;
	}
	/**
	 * Deletes the received feedback for current user
	 * @author hkaur5
	 */
	public function deleteFeedbackAction()
	{
		$feedback_id = Extended\feedback_requests::deleteFeedback( Auth_UserAdapter::getIdentity ()->getId (), $this->getRequest()->getparam('feedback_req_id'));
		if($feedback_id)
		{
			echo Zend_Json::encode( 1 );
		}
		die;
	}
	/**
	 * function used to get the "pending feedback requests"
	 * and "unaccepted received feedbacks".
	 * 
	 * @author hkaur5
	 * @version: 1.0
	 */
	function getPendingRequestsAndReceivedFeedbacksCountAction()
	{
		echo Zend_Json::encode( \Extended\feedback_requests::countReceivedFeedbackAndPendingRequests(Auth_UserAdapter::getIdentity()->getId()) );
		die;
	}
	
	/**
	 * Get all jobs of user.
	 * @author hkaur5
	 */
	function getAllJobsOfLinkAction( )
	{
		$user_id = $this->getRequest()->getParam('user_id');
		$user_obj =  \Extended\ilook_user::getRowObject($user_id);
		$user_type = $user_obj->getUser_type();
		$result = array();
		if ($user_type == \Extended\ilook_user::USER_TYPE_STUDENT)
		{
			$result['student'] =  1;
			
		}
		if ($user_type == \Extended\ilook_user::USER_TYPE_HOME_MAKER)
		{
			$result['home_maker'] =  1;
		}
		$All_exp = \Extended\experience::getAllExperiences($user_id);
		if($All_exp)
		{
			$job_title = array();
			foreach ( $All_exp as $exp )
			{
				$job_title[] =  $exp->getJob_title();
	
			}
			$result['jobs'] = $job_title;
			echo Zend_Json::encode( $result );
			
		}
		else
		{
			$result['jobs'] = "";
			echo Zend_Json::encode($result);
		}
		die;
		 
	}	
}












