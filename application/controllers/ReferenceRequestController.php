<?php

class ReferenceRequestController extends Zend_Controller_Action
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
		//Creating session to store provide reference information.
		//Check if ref_requester_id and ref_provider_id is present in url only then session will be created.
		if( $this->getRequest()->getParam('ref_requester_id') && $this->getRequest()->getParam('ref_provider_id') )
		{
			$after_login_redirection_session = new Zend_Session_Namespace('after_login_redirection_session');
			// value 3 is used for action 'Feedback request'
			$after_login_redirection_session->action = 3;
			$after_login_redirection_session->ref_rqstr_id = $this->getRequest()->getParam('ref_requester_id');
			$after_login_redirection_session->ref_provider_id = $this->getRequest()->getParam('ref_provider_id');
			
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
    	if ($user_type == \Extended\ilook_user::USER_TYPE_STUDENT)
    	{
    		$this->view->student = 1;
    	
    	}
		if ( $user_type == \Extended\ilook_user::USER_TYPE_HOME_MAKER )
		{
			$this->view->home_maker = 1;
		}
			$All_exp = \Extended\experience::getAllExperiences($user_id);
    		$job_title = array();
    		if($All_exp)
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
    	//     	Zend_Debug::dump($links_obj);
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
     */
    public function getMyMatchingContactsAction()
    {
    	// action body
    	$params = $this->getRequest()->getParams();
    	$params['keyword'] = $params['q'];
    	$getContacts = \Extended\ilook_user::getMatchingContacts($params['keyword'], Auth_UserAdapter::getIdentity()->getLink_list() );
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
     * @author Shaina, hkaur5
     *
     *
     */
    public function sendReferenceRequestAction()
    {

    	// action body
    	$params = $this->getRequest()->getParams();
    	$zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
    	
    	$requesterId= Auth_UserAdapter::getIdentity()->getId();
    	@$provderId = $params['requester_links'];
    	//Get requester id obj
    	$requester_obj = \Extended\ilook_user::getRowObject(Auth_UserAdapter::getIdentity()->getId());
    	 
    	//If requester is student then display student in 'requested as'.
    	if( $requester_obj->getUser_type() == \Extended\ilook_user::USER_TYPE_STUDENT )
    	{
    		$requested_as = "Student";
    	}
    	else
    	{
	    	$requester_exp = Helper_common::getUserProfessionalInfo( Auth_UserAdapter::getIdentity()->getId() );
	    	$requested_as = $requester_exp[0];
    	}
		$reference_request_msgID=\Extended\reference_request::addReferenceRequest($params['requester_jobs'],
																						$requested_as, 
																						$zend_filter_obj->filter($params['requester_msg']),  
																						$requesterId,  
																						$provderId,
																						\Extended\reference_request::VISIBILITY_CRITERIA_HIDDEN,
																						\Extended\reference_request::IS_ACCEPTED_NO 
    																			);
			$provider_id_arr = array();
			$provider_id_arr[] = $provderId;
    		if( $reference_request_msgID)
    		{
    			$subject = "Reference Request";
    			$requester_name = \Extended\ilook_user::getRowObject($requesterId)->getFirstname()." ".\Extended\ilook_user::getRowObject($requesterId)->getLastname();
    			$message = $requester_name." has sent you a reference request. To Accept the request please click on the Button below.";
    			$message .= '<div class="accept_reference">';
    			$message .= '<a id = "accept_link_req" href = "'.PROJECT_URL.'/'.PROJECT_NAME.'reference-request/provide-reference/rid/'.$reference_request_msgID.'#'.$requesterId.'">Accept</a>';
    			//$message .= '<a id = "decline_link_req" href = "/'.PROJECT_NAME.'links/new-link-request/link_req_id/'.$link_requests_obj->getId().'/todo/decline">Decline</a>';
    			$message .= '</div>';
    				
    			\Helper_common::sendMessage( $requesterId, $provider_id_arr, $subject, $message, \Extended\message::MSG_TYPE_REF_REQ, NULL, FALSE, null, null, null, $reference_request_msgID,null,null,11,null);
    			
    			//Added by sjaiswal.
    			$email_on_ref_req = \Extended\reference_request::checkEmailOnRefReq($provderId);
    			
    			//Condn added by sjaiswal.
    			if($email_on_ref_req=='default' || $email_on_ref_req==true)
    			{
    			
	    			//send an email to the user who receives reference request
	    			$subject = "ilook:: New Reference Request";
	    			$message = '<table width="100%" align="center" cellspacing="0" cellpadding="0" style=" padding:0; font-family:Arial;">
								<tr>
								<td style="padding:20px 0 0 0; margin:0;"></td>
								</tr>
								<tr>
								<td>
								<table width="100%" cellspacing="0" cellpadding="0" style=" padding:10px 0; margin:0; font-family:Arial; background:#ffffff; border:1px solid #c4c4c4;">
								<tr>
								<td style="padding:15px 0;margin:0;" align="center" >
								<p style=" padding:0px 0; margin:0; color: #444444;font-family:Arial; font-size:13px;">'.$requester_name.' has sent you a reference request. To Accept the request please click on the Button below.
								</p>
								</td>
								</tr>
								<tr>
								<td style="padding:0 0 10px 0; margin:0;" align="center">
								<a href="'.PROJECT_URL.'/'.PROJECT_NAME.'reference-request/provide-reference/ref_requester_id/'.$requesterId.'/ref_provider_id/'.$provderId.'" >
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
     * gets the pending reference requests sent to current user ((requests which are not
     * replied to).
     * @author Shaina
     *
     *
     *
     */
    public function pendingRequestAction()
    {
    	$recieved_reference_requests=Extended\reference_request::getPendingReferenceRequests( Auth_UserAdapter::getIdentity ()->getId (),  @$this->getRequest()->getParam("order")?@$this->getRequest()->getParam("order"):"DESC"  );
    	if($recieved_reference_requests)
    	{
    		$params = $this->getRequest()->getParams();
    			
    		if( ! @$params['list_len'] )
    		{
    			$params['list_len'] =10;
    		}
    		$this->view->prms = $params;
    		$this->view->recieved_reference_requests = $recieved_reference_requests;
    		$this->view->order = @$this->getRequest()->getParam("order");
    		$unread_requests= Extended\reference_request::getUnreadReferenceRequests( Auth_UserAdapter::getIdentity ()->getId () );
    	 			//Zend_Debug::dump($unread_requests);die;
    		$count_unread_reference_requests=$unread_requests[0]["num_of_rows"];
    		$this->view->unread_reference_requests=$count_unread_reference_requests ;
    		//------ PAGINATION -------
    		$paginator = Zend_Paginator::factory($recieved_reference_requests);
    		$paginator->setItemCountPerPage(@$params['list_len']);
    		$paginator->setCurrentPageNumber(@$params['page']);
    		$this->view->paginator=$paginator;
    		
    	}
    	else
    	{
    		$this->view->no_pending_reference_requests_msgs="No Pending References";
    
    
    	}
    }
    
    public function provideReferenceAction()
    {
    	$params = $this->getRequest()->getParams();
        $this->view->reference_req_id = @$params['rid'];
        $after_login_redirection_session = new Zend_Session_Namespace('after_login_redirection_session');        

        if( Auth_UserAdapter::hasIdentity() )
        {
        	$logged_in_user_id = Auth_UserAdapter::getIdentity()->getId();
        		
        	//Redirect user to provide feedback page if he/she is logged in, reference session exists and
        	//his/her id mataches with provider id in reference session.
        	if ($after_login_redirection_session->ref_provider_id == $logged_in_user_id )
        	{
        		$ref_rqstr_id = $after_login_redirection_session->ref_rqstr_id;
        			
        		$after_login_redirection_session->unsetAll();
        		$this->_redirect(PROJECT_URL."/".PROJECT_NAME."reference-request/provide-reference#".$ref_rqstr_id );
        	}
        
        	//Redirect to dashboard in case if user has identity(logged in), reference session has formed but reference provider id doesn't match with logged in user id.
        	else if ( $after_login_redirection_session->ref_provider_id && $after_login_redirection_session->ref_provider_id != $logged_in_user_id )
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
     * Saves reference.
     *
     * @author sgandhi
     * @version 1.0
     *
     *
     */
    public function sendReferenceAction()
    {
    	//action body
    	$params = $this->getRequest()->getParams();
    	$zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
    	@$providerId = Auth_UserAdapter::getIdentity()->getId();
    	$receiverId = $params['provider_links'];
    	//Get provider' obj
    	$provider_user_obj = \Extended\ilook_user::getRowObject(Auth_UserAdapter::getIdentity()->getId());
    	
    	//If provider is student then display student in 'provided as' field.
    	if( $provider_user_obj->getUser_type() == \Extended\ilook_user::USER_TYPE_STUDENT )
    	{
    		$provided_as = "Student";
    	}
    	else 
    	{
    		$provider_exp = Helper_common::getUserProfessionalInfo(Auth_UserAdapter::getIdentity()->getId());
    		$provided_as = $provider_exp[0];
    	}
    	
    		$reference_id = \Extended\reference_request::provideReference(
    				$params['requester_jobs'],
    				$provided_as,
    				$zend_filter_obj->filter($params['provider_msg']),
    				$receiverId,
    				$providerId,
    				\Extended\reference_request::VISIBILITY_CRITERIA_HIDDEN,
    				\Extended\reference_request::IS_ACCEPTED_NO,
    				$params['reference_req_id']
    		);
    	if($reference_id)
    	{
    		$messages = new Zend_Session_Namespace('messages');
    		$messages->successMsg = "Reference(s) has been sent";
    		echo Zend_Json::encode( 1 );
    	}
    	
    	die;
    }
    
    /**
     * gets the references provided by current user
     * @author Shaina
     *
     */
    public function providedAction()
    {
    	$reference_provided=Extended\reference_request::getReferenceProvided( Auth_UserAdapter::getIdentity ()->getId (), @$this->getRequest()->getParam("order")?@$this->getRequest()->getParam("order"):"DESC"  );
    	if($reference_provided)
    	{
    		$params = $this->getRequest()->getParams();
    			
    		if( ! @$params['list_len'] )
    		{
    			$params['list_len'] =10;
    		}
    		$this->view->prms = $params;
    		$this->view->reference_provided = $reference_provided;
    		$this->view->order = @$this->getRequest()->getParam("order");
    		
    		//------ PAGINATION -------
    		$paginator = Zend_Paginator::factory($reference_provided);
    		$paginator->setItemCountPerPage(@$params['list_len']);
    		$paginator->setCurrentPageNumber(@$params['page']);
    		$this->view->paginator=$paginator;
    		
    	}
    	else
    	{
    		$this->view->no_reference_provided_msg="No Reference Provided";
    		 
    	}
    }
    /**
     * gets the received references for the current user
     * @author Shaina
     */
    
    public function receivedAction()
    {
    	
    	$reference_received = Extended\reference_request::getReceivedReference( Auth_UserAdapter::getIdentity ()->getId (),@$this->getRequest()->getParam("order")?@$this->getRequest()->getParam("order"):"DESC" );
    	if($reference_received)
    	{
    		$params = $this->getRequest()->getParams();
    		
    		if( ! @$params['list_len'] )
    		{
    			$params['list_len'] =10;
    		}
    		$this->view->prms = $params;
    		
    		$this->view->reference_received = $reference_received;
    	
    		$this->view->order = @$this->getRequest()->getParam("order");
    		$unaccepted_references= Extended\reference_request::countUnAcceptedReceivedReference( Auth_UserAdapter::getIdentity ()->getId () );
    		//     			Zend_Debug::dump($unaccepted_feedbacks);
    		//     			die;
    		$count_unaccepted_references=$unaccepted_references[0]["num_of_rows"];
    		$this->view->unaccepted_references=$count_unaccepted_references;
    		
   	    //------ PAGINATION -------
    	    $paginator = Zend_Paginator::factory($reference_received);
    	    $paginator->setItemCountPerPage(@$params['list_len']);
    	    $paginator->setCurrentPageNumber(@$params['page']);
    	    $this->view->paginator=$paginator;
    		    	}
    	else
    	{
    		$this->view->no_references_received_msg="No References Provided";
    		 
    	}
    }
    /**
     * accept current received reference
     * @author Shaina
     * @version 1.0
     */
    public function acceptReferenceAction()
    {
    	$accepted = Extended\reference_request::updateAcceptedStatus( Auth_UserAdapter::getIdentity ()->getId (), $this->getRequest()->getparam('reference_req_id'), \Extended\reference_request::IS_ACCEPTED_YES, \Extended\reference_request::VISIBILITY_CRITERIA_DISPLAYED  );
    	if($accepted):
			echo Zend_Json::encode( 1 );
		else:
			echo Zend_Json::encode( 0 );
		endif;
		die;
    }
    /**
     * hides the received reference
     * @author Shaina
     */
    public function hideReferenceAction()
    {
    	$reference_id = Extended\reference_request::hideReference( Auth_UserAdapter::getIdentity ()->getId (), $this->getRequest()->getparam('reference_req_id'), \Extended\reference_request::VISIBILITY_CRITERIA_HIDDEN );
    	if($reference_id)
    	{
    		$this->view->reference_not_visible=$reference_id;
    		echo Zend_Json::encode( 1 );
    	}
    	die;
    }
    /**
     * changes the visibility to display of the received reference
     * return json to ajax call
     * @author hkaur5
     */
    public function displayReferenceAction()
    {
    	$reference_id = Extended\reference_request::displayReference( Auth_UserAdapter::getIdentity ()->getId (), $this->getRequest()->getparam('reference_req_id'), \Extended\feedback_requests::VISIBILITY_CRITERIA_DISPLAYED);
    	if($reference_id)
    	{
    	
    		$this->view->reference_visible=$reference_id;
    		echo Zend_Json::encode( 1 );
    	}
    	die;
    }
    /**
     * Deletes the received reference for current user
     * @author Shaina
     */
    public function deleteReferenceAction()
    {
    	$reference_id = Extended\reference_request::deleteReference( Auth_UserAdapter::getIdentity ()->getId (), $this->getRequest()->getparam('reference_req_id'));
    	if($reference_id)
    	{
    		echo Zend_Json::encode( 1 );
    	}
    	die;
    }
    
    /**
     * Deletes the received reference for current user
     * @author Shaina
     */
    public function withdrawalReferenceAction()
    {
    	$reference_id = Extended\reference_request::withdrawalReference( Auth_UserAdapter::getIdentity ()->getId (), $this->getRequest()->getparam('reference_req_id'));
    	if($reference_id)
    	{
    		echo Zend_Json::encode( 1 );
    	}
    	die;
    }
    /**
     * function used to get the "pending reference requests"
     * and "unaccepted received references".
     *
     * @author shaina
     * @version: 1.0
     */
    function getPendingRequestsAndReceivedReferencesCountAction()
    {
    	echo Zend_Json::encode( \Extended\reference_request::countReceivedReferenceAndPendingRequests(Auth_UserAdapter::getIdentity()->getId()) );
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
	   if ( $user_type == \Extended\ilook_user::USER_TYPE_HOME_MAKER )
	   {
		   $result['home_maker']= 1;
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
   			echo Zend_Json::encode( $result );
   		}
   		die;
   		
   }    
}