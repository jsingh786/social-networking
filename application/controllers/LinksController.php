<?php

class LinksController extends Zend_Controller_Action
{
    /**
     * This function checks auth storage and
     * manage redirecting.
     * 
     * @author jsingh7,sjaiswal
     * @author hkaur5
     * @since 20 June, 2012
     * @version 1.1
     * @see Zend_Controller_Action::preDispatch()
     *
     */
    public function preDispatch()
    {
		if( $this->getRequest()->getParam('todo') == "accept_from_email" || $this->getRequest()->getParam('todo') == "decline_from_email")
		{
			$after_login_redirection_session = new Zend_Session_Namespace("after_login_redirection_session");
			// value 4 is used for action 'Links request'
			$after_login_redirection_session->action = 4;
			$after_login_redirection_session->link_reqst_id = $this->getRequest()->getParam('link_req_id');
			$after_login_redirection_session->action_to_do = $this->getRequest()->getParam('todo');
		}

		if ( !Auth_UserAdapter::hasIdentity() )
		{
			$this->_helper->redirector( 'index', 'index' );
		}
    }

    public function init()
    {
        /* Initialize action controller here */

    }

    /**
     * This function display list of links.
     * @author spatial
     * @since 1 Aug, 2013
     * @version 1.0
     *
     */
    public function indexAction()
    {
    	$links = array();
    	$params=$this->getRequest()->getParams();
    	$request = $this->getRequest();
    	$this->view->referer = $request->getHeader('referer');
    	
    	if( ! @$params['list_len'] )
    	{
    		$params['list_len'] = 20;
    	}
    	$this->view->prms = $params;
    	$this->view->userViewState="enable";
	    if( @$params['id'] )//User ID
	    {
	    	$userObj = Extended\ilook_user::getRowObject($params['id']);
	    	$this->view->userViewState="disable";
	    	$userID=$params['id'];
	    	if(Auth_UserAdapter::getIdentity()->getId() == $params['id']  ){
	    		$userObj = Auth_UserAdapter::getIdentity();
	    		$this->view->userViewState="enable";
	    	}
	    }
	    else
	    {
	    	$userObj = Auth_UserAdapter::getIdentity();
	    	$userID = Auth_UserAdapter::getIdentity()->getId();
	    }
	    $links = \Extended\ilook_user::getLinksOfUser($userID);
	    $allLinksCount = Helper_common::getLinksCount();
	
   	 	if(@$params['linkSearch'])
   	 	{
   	 			//Regex to compare search string with all the special characters.
   	 			//And search will continue only if result is not true. 
	    		if(!preg_match('/[\'^�$%&*()}{@#~?><>,|=_+�-]/', $params['linkSearch']))
	    		{
		    		$this->view->linkSearchText=$params['linkSearch'];
		    		$userLinks = $userObj->getLink_list();
		    		if($userLinks!="")
		    		{
		    			$query_str = "";
		    			$query_str .= 'first_name:'.$params['linkSearch'].'*';
		    			$query_str .= ' OR last_name:'.$params['linkSearch'].'*';
		    			 
		    			$links = \Extended\ilook_user::getUsersForLuceneQuery( $query_str );
		    			 
		    			$linkid=array();
		    			for($i=0;$i<count($links);$i++){
		    				$linkid[]=$links[$i]->getId();
		    			}
		    			$userLinksId=explode(",",$userLinks);
		    			$arr_intersection=array_intersect ($linkid,$userLinksId);
		    			$result=implode(",",$arr_intersection);
		    			 
		    			$links = \Extended\ilook_user::getSearchLinksOfUser($result);
			    	}
		    		else
		    		{
		    			$links=array();
		    		}
		    	}
		    	else{
		    		$messages = new \Zend_Session_Namespace ( 'messages' );
		    		$messages->warningMsg = "No valid keywords for search!";
		    		$links=array();
		    	}
	    }
	    
	    $this->view->links=$links;
	    

	    
	    //------ PAGINATION -------
	    if($links)
	    {	
			$paginator = Zend_Paginator::factory($links);
			$paginator->setItemCountPerPage(@$params['list_len']);
			$paginator->setCurrentPageNumber(@$params['page']);
			$this->view->paginator=$paginator;
			$this->view->allLinksCount=$allLinksCount;
	    }
    }

    /**
     * This function display list of recent view profiles.
     * @author spatial
     * @version 1.0
     */
    public function recentlyViewedAction()
    {
    	$loggedin_user = Auth_UserAdapter::getIdentity ();
    	// get parameters...
    	$params = $this->getRequest()->getParams();
  		// set default number of records...
  		if( ! @$params['list_len'] )
    	{
    		$params['list_len'] = 20;
    	}
    	// assign paramters to the prms variable
    	$this->view->prms = $params;
    	// get currently login user id...
        $userID = Auth_UserAdapter::getIdentity()->getId();
        // get visitors for logined user id
    	$visitors = \Extended\who_viewed_profiles::getRecentlyViewedUsers($userID);
    	// get all links count
    	$allLinksCount = Helper_common::getLinksCount();
    	// count visitors..
    	$countVisitors = count($visitors);
    	//$countVisitors=0;
    	if($countVisitors==0)
    	{ 
    		// if count Recently visitors is 0, then show people you may know users.
    		$random_data=array();
    		$params = $this->getRequest()->getParams();
    		if( ! @$params['list_len'] )
    		{
    			$params['list_len'] = 20;
    		}
    		$this->view->prms = $params;
    		
    		
    		//Start of people you may know section
    
	    	//Getting users school ids.
			$edu_collec= $loggedin_user->getUsersEducation();
			$myEduSchoolIds = array ();
			foreach ( $edu_collec as $edu_obj )
			{
				$myEduSchoolIds [] = $edu_obj->getEducation_detailsSchool()->getId();
			}
			
			//Getting users company_ref ids 
			$myExpCompanyIds = array();
			$exp_collec = $loggedin_user->getUsersExperience();
			foreach ( $exp_collec as $exp_obj )
			{
				$myExpCompanyIds[] = $exp_obj->getExperiencesCompany()->getId();
			}	
    	
			// Get users who has sent or received link req from me.
			$getLinkRequestSent = \Extended\link_requests::getLinkRequestSenderOrReceiver ( $userID );
	    	if( $getLinkRequestSent )
	    	{
	    		$requester_accepter_id = array ();
	    		foreach ( $getLinkRequestSent as $key => $r )
	    		{
	    			if( isset($r['accept_user_id']) )
	    			{
	    				$requester_accepter_id [] = $r['accept_user_id'];
	    			}
	    			else if( isset($r['request_user_id']) )
	    			{
	    				$requester_accepter_id [] = $r['request_user_id'];
	    			}
    			}
    		}


	    	$users = Extended\ilook_user::getUsersYouMayKnow( $myExpCompanyIds, $myEduSchoolIds, $userID, $requester_accepter_id, 0, 3);
	    	
    	    	if( $users['data'])
    			{
    				$finalarray = array ();
    		 
		    		foreach ( $users['data'] as $key => $user )
		    		{
		    			$people_you_may_know_obj_arr [] = $user;
		    			 
		    		}
			    	$this->view->youMayKnowUsers = $people_you_may_know_obj_arr;
		    		$this->view->is_more_records = $users['is_more_records'];
		    	}
		    	else if(empty($users['data']))
		    	{
		    		$this->view->youMayKnowUsers = array();
		    	}
    	
    		//End of people you may know section
    		//------ PAGINATION -------
    		/* $paginator = Zend_Paginator::factory($random_data);
    		$paginator->setItemCountPerPage(@$params['list_len']);
    		$paginator->setCurrentPageNumber(@$params['page']);
    		$this->view->paginator=$paginator; */
    		$this->view->allLinksCount=$allLinksCount;
    		$this->view->htmlView="peopleYouMayKnow";
    	}
    	else
    	{
    		// get array of recently visitors id's 
    		for($i=0;$i<count($visitors);$i++)
    		{
    			$recentlyVisitorsID[] = $visitors[$i]->getVisitorsIlook_user()->getId();
    		}
    		
    		// make a comma seperated string.
    		$result=implode(",", $recentlyVisitorsID);
    		
    		// get object of all visitors ids.
    		$visitors = \Extended\ilook_user::getSearchLinksOfUser($result);
    		
    		// if user searching.
    		if( isset($params['linkSearch']) && $params['linkSearch'] )
    		{
    			if(!preg_match('/[\'^�$%&*()}{@#~?><>,|=_+�-]/', $params['linkSearch']))
    			{
    				$this->view->linkSearchText=$params['linkSearch'];
    					$query_str = "";
    					$query_str .= 'first_name:'.$params['linkSearch'].'*';
    					$query_str .= ' OR last_name:'.$params['linkSearch'].'*';
    					$visitors = \Extended\ilook_user::getUsersForLuceneQuery( $query_str );
    					$linkid=array();
    					for($i=0;$i<count($visitors);$i++){
    						$linkid[]=$visitors[$i]->getId();
    					}
    					$arr_intersection=array_intersect ($linkid,$recentlyVisitorsID);
    					$result=implode(",",$arr_intersection);
    					$visitors = \Extended\ilook_user::getSearchLinksOfUser($result);
    			}
    			else
    			{
    				$messages = new \Zend_Session_Namespace ( 'messages' );
    				$messages->warningMsg = "No valid keywords for search!";
    				$visitors=array();
    			}
    		}
    		
    		$this->view->vistors=$visitors;
    		$paginator = Zend_Paginator::factory($visitors);
    		$paginator->setItemCountPerPage(@$params['list_len']);
    		$paginator->setCurrentPageNumber(@$params['page']);
    		$this->view->paginator=$paginator;
    		$this->view->allLinksCount=$allLinksCount;
    	}
    	
    	//------ PAGINATION -------
    	
    }

    public function importAction()
    {
        // action body
    }

    public function gmailImportAction()
    {
       
    }

    /**
     * Adds value to database for further reference
     * sends email.
     *
     * Made for ajax call.
     *
     * @author jsingh7
     * @version 1.0
     *
     */
    public function sendInvitationAction()
    {
    	$emails_r = $this->getRequest()->getParam("emails");
    	$counter = 0;
    	$failedEmails = "";
    	$len = count( $emails_r );
    	$i = 0;
    	if( $emails_r )
    	{
	    	foreach ( $emails_r as $eml )
	    	{
	    		$mail_sent = FALSE;
	    		$message = Auth_UserAdapter::getIdentity()->getFirstname()." ".Auth_UserAdapter::getIdentity()->getLastname().", has sent you invitation to join iLook. You can sign up in just two simple steps on ".PROJECT_URL."/".PROJECT_NAME;
	    		$mail_sent = Email_Mailer::sendMail("ilook : Link Request", $message, "", trim($eml), array(), "", "", "Hi", "ilook team" );
	    		if( $mail_sent )
	    		{
	    			$result = \Extended\import_external_contacts::addImportedEmail( trim($eml), Auth_UserAdapter::getIdentity()->getId());
		    		if( $result )
		    		{
			    		$counter++;
		    		}
	    		}
	    		else
	    		{
	    			if( $i != $len - 1 )
	    			{
	    				$failedEmails .= trim($eml).", ";
	    			}
	    			else
	    			{
	    				$failedEmails .= trim($eml);
	    			}
	    		}	
	    		$i++;
	    	}
	    	$ret_r = array();
	    	$ret_r['total_sent'] = $counter;
	    	$ret_r['failed'] = $failedEmails;
	    	echo Zend_Json::encode($ret_r);
    	}
	    die;
    }
    
    /**
     * Adds value to database for further reference
     * sends email.
     *
     * Made for ajax call.
     *
     * @param comma seprated emails strings
     * @author jsingh7
     * @version 1.0
     *
     */
    public function sendInvitationIndividualAction()
    {
    	$semi_colon_sep_emails = $this->getRequest()->getParam("comma_sep_emails");
    	$link_request_type = \Extended\link_requests::LINK_REQUEST_TYPE_VIA_ILOOK;
    	$emails_r = explode(";", $semi_colon_sep_emails);
    	$emails_to_be_excluded = array();
    	$blocked_users_emails = array();
    	$ret_r = array();
    	$link_reqs_sent = array();
    	$counter = 0;
    	$failedEmails = "";
    	$len = count( $emails_r );
    	$i = 0;
		$query_str="";
    	foreach ( $emails_r as $key=> $email )
    	{
    		$query_str .= 'email:'.$email;
    		if ($i != $len - 1)
    		{
    			$query_str .=" OR ";
    		}
    		$i++;
    	}
    	$blocked_users = \Extended\blocked_users::getAllBlockersAndBlockedUsers(Auth_UserAdapter::getIdentity()->getId());
    	
    	//Finding emails/users which are already registered with ilook.
    	$ilook_users = \Extended\ilook_user::getUsersForLuceneQuery( $query_str, null, TRUE );
    	
    	//Sending link request to users which are already present on ilook.
    	$request_arr = array();
    	
    	if($ilook_users)
    	{
    		foreach ($ilook_users as $ilook_user)
    		{
	    		$emails_to_be_excluded[] = $ilook_user->getEmail();

	    		//If user is blocked or has blocked you then don't send link request.
	    		if($blocked_users)
	    		{
	    			if(!in_array($ilook_user->getId(), $blocked_users))
	    			{
		    			$link_reqs_sent[] = \Extended\link_requests::sendRequestLite( Auth_UserAdapter::getIdentity()->getId(),$ilook_user->getId(),$link_request_type );
						
	    			}
	    		}
	    		else
	    		{
	    			$link_reqs_sent[] = \Extended\link_requests::sendRequestLite(Auth_UserAdapter::getIdentity()->getId(),$ilook_user->getId(),$link_request_type);
	    			
	    		}
    		}
    		
    		//Count total link request sent.
    		if(!empty($link_reqs_sent))
	    	{
	    		foreach($link_reqs_sent as $link_req_sent)
	    		{
	    			//Reuests which are sent only during this call not earlier.
	    			if($link_req_sent['request_status'] == 1)//Not an 'already sent' link request
	    			{
	    				$total_link_reqs_sent[] = $link_req_sent['link_request_id'];
	    			}
	    		}
	    		$ret_r['no_of_link_req_sent'] = count($total_link_reqs_sent);
	    	}
    	}
    	
    	//Excluding emails of already registered users.
    	$emails_to_be_invited = array_diff($emails_r, $emails_to_be_excluded);
    	
    	//Removing logged in user's id from emails of users to be invited.
    	if( ($logged_in_user_index = array_search(Auth_UserAdapter::getIdentity()->getEmail(), $emails_to_be_invited)) !== false)
    	{
    		unset($emails_to_be_invited[$logged_in_user_index]);
    	}
    
    	
    	if( !(empty($emails_to_be_invited )) )
    	{	
	    	foreach ( $emails_to_be_invited as $em )
	    	{
	    		$mail_sent = FALSE;
	    		$message = Auth_UserAdapter::getIdentity()->getFirstname()." ".Auth_UserAdapter::getIdentity()->getLastname().", has sent you invitation to join iLook. You can sign up in just two simple steps on ".PROJECT_URL."/".PROJECT_NAME;
	    		$mail_sent = Email_Mailer::sendMail(
					"ilook : Link Request",
					$message, "",
					trim($em),
					array(),
					Email_Mailer::DEFAULT_SENDER_NAME,
					Email_Mailer::DEFAULT_SENDER_EMAIL,
					Email_Mailer::DEFAULT_SALUTATION,
					Email_Mailer::DEFAULT_COMPLIMENTARY_CLOSING
					);
	    		if( $mail_sent )
	    		{
	    			$result = \Extended\import_external_contacts::addImportedEmail( trim($em), Auth_UserAdapter::getIdentity()->getId());
		    		if( $result )
		    		{
			    		$counter++;
		    		}
	    		}
	    		else
	    		{
	    			if( $i != $len - 1 )
	    			{
	    				$failedEmails .= trim($em).", ";
	    			}
	    			else
	    			{
	    				$failedEmails .= trim($em);
	    			}
	    		}	
	    		$i++;
	    	}
	    	
	    	$ret_r['total_sent'] = $counter;
	    	$ret_r['failed'] = $failedEmails;
    	}
    	else
    	{
    		$ret_r['no_invitations'] = 1;
    	}
    	
    	echo Zend_Json::encode($ret_r);
	    die;
    }
    
    
    function curl($url, $method = 'get', $header = null, $postdata = null, $includeheader=FALSE, $timeout = 60)
    {
    	
    	$s = curl_init();
    	curl_setopt($s,CURLOPT_URL, $url);
    	if ($header)
    	{
    		curl_setopt($s,CURLOPT_HTTPHEADER, $header);
	    	/*if ($this->debug)*/
	    	curl_setopt($s,CURLOPT_VERBOSE, FALSE);
	    	curl_setopt($s,CURLOPT_TIMEOUT, $timeout);
	    	curl_setopt($s,CURLOPT_CONNECTTIMEOUT, $timeout);
	    	curl_setopt($s,CURLOPT_MAXREDIRS, 3);
	    	curl_setopt($s,CURLOPT_RETURNTRANSFER, true);
	    	curl_setopt($s,CURLOPT_FOLLOWLOCATION, 1);
	    	curl_setopt($s,CURLOPT_COOKIEJAR, 'cookie.txt');
	    	curl_setopt($s,CURLOPT_COOKIEFILE, 'cookie.txt');
	    	if(strtolower($method) == 'post')
	    	{
	    		curl_setopt($s,CURLOPT_POST, true);
	    		curl_setopt($s,CURLOPT_POSTFIELDS, $postdata);
	    	}
	    	else if(strtolower($method) == 'delete')
	    	{
	    		curl_setopt($s,CURLOPT_CUSTOMREQUEST, 'DELETE');
	    	}
	    	else if(strtolower($method) == 'put')
	    	{
	    		curl_setopt($s,CURLOPT_CUSTOMREQUEST, 'PUT');
	    		curl_setopt($s,CURLOPT_POSTFIELDS, $postdata);
	    	}
	    	curl_setopt($s,CURLOPT_HEADER, $includeheader);
	    	//curl_setopt($s,CURLOPT_USERAGENT, 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1');
	    	curl_setopt($s, CURLOPT_SSL_VERIFYPEER, false);
	    
	    	$html    = curl_exec($s);
	    	$status = curl_getinfo($s, CURLINFO_HTTP_CODE);
	    
	    	curl_close($s);
	    	return $html;
    	}
    }
    
    public function zahooContactsImportAction()
    {
    	
    }

    /**
     * Uses open inviter library
     * to fetch all emails after
     * authenticating.
     * 
     * Filter contacts in ilook and outside ilook.
     * 
     * Made for ajax call.
     * 
     * @author jsingh7
     * @version 1.0
     *
     *
     */
    public function yahooAuthenticationAndGetEmailsAction()
    {
		$inviter = new OpenInviter_Service(); // Create the Object of Opne Invitor
    	$plugins = $inviter->getPlugins('email','yahoo');
    	$email_id =  $this->getRequest()->getParam("yahoo_email");
    	$password =  $this->getRequest()->getParam("yahoo_pwd");
    	//  Create URL 
    	
    	$consumer_key	= 'dj0yJmk9TXFTdjlGZGZpeVdpJmQ9WVdrOVUyNHdaRXRRTnpZbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD01Yg--';
    	$secret_key		= '722511486a8976a92796695b7ef16e08fd825beb' ;
    	$session_id     = 'Sn0dKP76' ;
    	$request_token = 'pSqvVdBu3AZCRk5oPQGm2VyV8NzV7K_QR2_jW08lbKOKzXf8PjiMdQiU8U6e.vclyfk2mdjzCMBKB9T6vVsz.FGFTMeHWzR1bb.F8CXS0ArjgpKGySXCINGUCFq1sBE1L4i_Sd_j6CljoV4ems4nlwBG96fNo5UJ85vdETcFhQe4QK9FcKN_MOAij8cmCmAuVPUMA5mk.NbyyQ--';
    	
   
    	/* $url = 'https://login.yahoo.com/WSLogin/V1/get_auth_token';
    	$url .='?oauth_consumer_key='.$consumer_key;
    	$url .='&login='.$email_id;
    	$url .='&passwd='.$password; */
        
    	$date = new DateTime();
    	
    	$url = "http://developer.messenger.yahooapis.com/v1/session";
    	$url .="?oauth_consumer_key=".$consumer_key;
    	$url .="&oauth_nonce=".rand(10000000, 99999999);
    	$url .="&oauth_signature=".$secret_key."%26".$request_token;
    	$url .="&oauth_signature_method=PLAINTEXT";
    	$url .="&oauth_timestamp=".$date->getTimestamp();
    	$url .="&oauth_token=".$request_token;
    	$url .="&oauth_version=1.0";
    	$url .="&notifyServerToken=1";
    	
    	
    	//string postdata = "{\"presenceState\" : " + state + ", \"presenceMessage\" : \"" + status + "\"}";
    	//string rs = fetchURL(url, true, postdata);
    	
    	
    	
    	
    	
    	
    	
	    //prepare url
	    $url = 'http://developer.messenger.yahooapis.com/v1/contacts';
	    $url .= '?oauth_consumer_key='.$oauth_access_token;		
	    $url .= '&oauth_nonce='. uniqid(rand());
	    $url .= '&oauth_signature='.$oauth_token_secret. '%26'. $oauth_token_secret;
	    $url .= '&oauth_signature_method=PLAINTEXT';
	    $url .= '&oauth_timestamp='. time();
	    $url .= '&oauth_token='. urlencode($oauth_access_token);
	    $url .= '&oauth_version=1.0';    
	    $url .= '&sid='. $session_id;
	    $url .= '&fields=%2Bpresence';
	    $url .= '&fields=%2Bgroups';
	    $url .= '&fields=%2Baddressbook';
	    
	    
	    
			
	    //additional header
	    $header[] = 'Content-type: application/json; charset=utf-8';		
	    $rs = self::curl($url, 'get', $header);
				
	    if (stripos($rs, 'contact') === false) return false;
	    
	    $js = json_decode($rs, true);
	    
	    
	    
    	$result=$inviter->getContacts( $this->getRequest()->getParam("yahoo_email"), $this->getRequest()->getParam("yahoo_pwd"), "yahoo" );
//     	$result=$inviter->getContacts( 'sonam.mehta87@yahoo.com', 'Mind@123', "yahoo" );
    	Zend_Debug::dump($result);
    	die;
    	if( @$result )
    	{
    		$in_my_contacts_r = array();
    		$not_in_my_contacts_r = array();
    		
    		foreach( $result as $email=>$label )
    		{
    			$query_str = "";
    			$result = "";
    			if( $email )
    			{
    				$query_str .= 'email:'.$email;
    				$result = \Extended\ilook_user::getUsersForLuceneQuery( $query_str, "", TRUE );
    			}
    			
    			if( $result )
    			{
    				$in_my_contacts_r[$email]["ilook_user_id"] = $result[0]->getId();
    				$in_my_contacts_r[$email]["fname"] = $result[0]->getFirstname();
    				$in_my_contacts_r[$email]["lname"] = $result[0]->getLastname();
    				$in_my_contacts_r[$email]["email"] = $result[0]->getEmail();
    				if( @$result[0]->getProfessional_image() )
    				{
	    				$in_my_contacts_r[$email]["prof_image"] = IMAGE_PATH."/profile/small_thumbnails/thumbnail_".$result[0]->getProfessional_image();
    				}
    				else
    				{
    					switch ( $result[0]->getGender() ) 
    					{
    						case \Extended\ilook_user::USER_GENDER_MALE:
    						$in_my_contacts_r[$email]["prof_image"] = IMAGE_PATH."/profile/default_profile_image_male_small.png";
    						break;
    						case \Extended\ilook_user::USER_GENDER_FEMALE:
    						$in_my_contacts_r[$email]["prof_image"] = IMAGE_PATH."/profile/default_profile_image_female_small.png";
    						break;
    						default:
    						$in_my_contacts_r[$email]["prof_image"] = IMAGE_PATH."/profile/default_profile_image_male_small.png";
    						break;
    					}
    				}	
    				$in_my_contacts_r[$email]["link_info"] = \Extended\link_requests::getFriendRequestState( $result[0]->getId() );
    			}
    			else
    			{
    				$not_in_my_contacts_r[] = $email;
    			}		
    		}
    		
    		$temp_r = array();
    		$temp_r['in_my_contacts'] = $in_my_contacts_r;
    		$temp_r['not_in_my_contacts'] = $not_in_my_contacts_r;
    		
    		echo Zend_Json::encode( $temp_r );
    	}
    	else
    	{
	    	$msg = $inviter->getMessages();
	    	echo Zend_Json::encode( $msg );
    	}
    	die;
    }
    
    public function yahooContactsImportAction()
    {
    	
    }
    
/**
    * Accepts google response of email contacts.
    * Filter contacts in ilook and outside ilook.
    *
    * Made for ajax call.
    *
    * @author jsingh7,sjaiswal
    * @version 1.0
    *
    */
  public function getEmailsFromGoogleResponseAction()
    {
   
    	// convert json to array 
    	$google_response = json_decode($this->getRequest()->getParam("google_response"), true);
    	
    	if($google_response)
    	{
    		$in_my_contacts_r = array();
    		$not_in_my_contacts_r = array();
    		
    		$query_str = "";
    		$result = "";
    		$i = 0;
    		foreach($google_response as $google_email)
    		{
    		
    			$query_str = 'email:'.$google_email;
    			
    			$result = \Extended\ilook_user::getUsersForLuceneQuery( $query_str, "", TRUE );
    
    		if( !empty($result) )
    		{
    			$in_my_contacts_r[ $google_email]["ilook_user_id"] = $result[0]->getId();
    			$in_my_contacts_r[ $google_email]["ilook_user_id"] = $result[0]->getId();
    			$in_my_contacts_r[ $google_email]["fname"] = $result[0]->getFirstname();
    			$in_my_contacts_r[ $google_email]["lname"] = $result[0]->getLastname();
    			$in_my_contacts_r[ $google_email]["email"] = $result[0]->getEmail();
    			if( @$result[0]->getProfessional_image() )
    			{
    				$in_my_contacts_r[ $google_email]["prof_image"] = IMAGE_PATH."/profile/small_thumbnails/thumbnail_".$result[0]->getProfessional_image();
    			}
    			else
    			{
    				switch ( $result[0]->getGender() )
    				{
    					case \Extended\ilook_user::USER_GENDER_MALE:
    						$in_my_contacts_r[ $google_email]["prof_image"] = IMAGE_PATH."/profile/default_profile_image_male_small.png";
    						break;
    					case \Extended\ilook_user::USER_GENDER_FEMALE:
    						$in_my_contacts_r[ $google_email]["prof_image"] = IMAGE_PATH."/profile/default_profile_image_female_small.png";
    						break;
    					default:
    						$in_my_contacts_r[ $google_email]["prof_image"] = IMAGE_PATH."/profile/default_profile_image_male_small.png";
    						break;
    				}
    			}
    			$in_my_contacts_r[ $google_email]["link_info"] = \Extended\link_requests::getFriendRequestState( $result[0]->getId() );
    		}
    		else
    		{
    			$not_in_my_contacts_r[] = $google_email;
    		}
    	
    		}
    		
    	
    		$temp_r = array();
    		$temp_r['in_my_contacts'] = $in_my_contacts_r;
    		$temp_r['not_in_my_contacts'] = $not_in_my_contacts_r;
    		
    		echo Zend_Json::encode( $temp_r );
    	} 
  
    	die;
    }
    
    /**
     * This function used to display user tooltip
     * @author Sunny Patial
     * @since 1 Aug, 2013
     * @version 1.0
     *
     */
    public function getTooltipAction()
    {
    	$params=$this->_request->getParams();
    	$user_detail=\Extended\ilook_user::getRowObject($params["user_id"]);
    	if( is_object($user_detail) )
    	{	
	    	if($user_detail->getPhone()!="")
	    	{
	    		$phone=$user_detail->getPhone();
	    	}
	    	else
	    	{
	    		$phone=$user_detail->getPhone();
	    	}
	    	$filename="images/profile/big_thumbnails/thumbnail_".$user_detail->getProfessional_image();
	    	if($user_detail->getProfessional_image()!="" && file_exists($filename))
	    	{
	    		$img_name=IMAGE_PATH."/profile/big_thumbnails/thumbnail_".$user_detail->getProfessional_image();
	    	}
	    	else
	    	{
	    			if($user_detail->getGender()==Extended\ilook_user::USER_GENDER_MALE)
	    			{
						$img_name=IMAGE_PATH."/profile/default_profile_image_male_big.png";
					}
					else
					{
						$img_name=IMAGE_PATH."/profile/default_profile_image_female_big.png";
					}
	    	}
	    	
	    	$links = explode ( ",", $user_detail->getLink_list () );
	    	
	    	$newlinksArray = array ();
	    	foreach ( $links as $lks )
	    	{
	    		$newlinksArray [] = $lks;
	    	}
	    	$friendRequestState=\Extended\link_requests::getFriendRequestState($params["user_id"]);
	    	$linkID=$friendRequestState["link_id"];
	    	$result = in_array(\Auth_UserAdapter::getIdentity()->getId(),$newlinksArray);
	    	$current_user = Auth_UserAdapter::getIdentity()->getId();
	    	$bookmark_status = \Extended\bookmark_profile::getBookmarkStatus($current_user, $params["user_id"]);
 	    	$report_abuse=\Extended\report_abuse::getAbuseReportProfile($current_user,$params["user_id"]);
	    	
	    	// Get Summary information
	    	$showSummary=0;
	    	$showExperience=0;
	    	$showEdulist=0;
	    	$showSkills=0;
	    	$showProject=0;
	    	$showLanguage=0;
	    	$showPublication=0;
	    	$showHonorsAndAwards=0;
	    	$showCertiList=0;
	    	$showVolunteer=0;
	    	$showPersonal=0;
	    	$showAdditionalInfo=0;
	    	
	    	
	    	if($user_detail->getHobbies()!="")
	    	{
	    		$showAdditionalInfo=1;
	    	}
	    	if($user_detail->getHonors_n_awards()!="")
	    	{
	    		$showHonorsAndAwards=1;
	    	}
	    	if($user_detail->getProfessional_exp()!="" || $user_detail->getProfessional_goals()!=""){
	    		$showSummary=1;
	    	}
	    	// Get Education information list....
	    	$eduInfoList=\Extended\education_detail::getEduInfoList($user_detail->getId());
	    	if($eduInfoList)
	    	{
	    		$showEdulist=1;
	    	}
	    	// Get Certifications list....
	    	$certificationInfoList=\Extended\certification::getCertificationInfoList($user_detail->getId());
	    	if($certificationInfoList)
	    	{
	    		$showCertiList=1;
	    	}
	    	// Get Publication information list....
	    	$mypublications=Extended\publication::getAllPublications($user_detail->getId());
	    	if($mypublications)
	    	{
	    		$showPublication=1;
	    	}
	    	// Get Volunteering information list....
	    	$volunteering=\Extended\volunteering_n_causes::getVolunteeringInformation($user_detail->getId());
	    	if($volunteering)
	    	{
	    		$showVolunteer=1;
	    	}
	    	// Get User profile Information
	    	$userinfo=\Extended\ilook_user::getUserInformation($user_detail->getId());
	    	$personalInfo = $userinfo[0];
	    	if($personalInfo)
	    	{
	    		$showPersonal=1;
	    	}
	    	// Get User experiences....
	    	$myExps = Extended\experience::getAllExperiences( $user_detail->getId() );
	    	if($myExps)
	    	{
	    		$showExperience=1;
	    	}
	    	// Get User Projects.......
	    	$myProj = Extended\project::getAllProjects( $user_detail->getId() );
	    	if($myProj)
	    	{
	    		$showProject=1;
	    	}
	    	// get all languages of the login user.
	    	$languages = Extended\user_languages::getAllLanguages( $user_detail->getId() );
	    	if($languages)
	    	{
	    		$showLanguage=1;
	    	}
	    	// get all skills of the login users..
	    	$skillInfoList=\Extended\user_skills::getSkillInfoList($user_detail->getId());
	    	if($skillInfoList)
	    	{
	    		$showSkills=1;
	    	}
	    	// get note regarding particular user...
	    	$profile_user = $params["user_id"];
	    	$notesTitle=@stream_get_contents(\Extended\notes::getNote(Auth_UserAdapter::getIdentity()->getId(),$profile_user));
	    	if($notesTitle)
	    	{
	    		$notes=$notesTitle;
	    	}
	    	else
	    	{
	    		$notes="";
	    	}
	    	if(isset($params["jobid"]))
	    	{
	    		$userShortlisted = \Extended\job_applications::isUserShortlisted($params["jobid"], $params["user_id"]);
	    	}
	    	else
	    	{
	    		$userShortlisted = 0;
	    	}
	    	// link status..
	    	$linkStatus = \Extended\link_requests::getFriendRequestState($params["user_id"], \Auth_UserAdapter::getIdentity()->getId());
	    	
	    	//Block Status of user.
	    	$isBlocked = \Extended\blocked_users::checkIfBlocked( \Auth_UserAdapter::getIdentity()->getId() , $params["user_id"] );
	    	
	    	$userDetail=array("login_user_id"=>\Auth_UserAdapter::getIdentity()->getId(),"profile_id"=>$user_detail->getId(),"full_name"=>$user_detail->getFirstname()." ".$user_detail->getLastname(),
	    			"profile_username"=>$user_detail->getUsername(),
	    			"profile_image"=>$img_name,
	    			"profile_phone"=>$phone,
	    			"profile_email"=>$user_detail->getEmail(),
	    			"bookmark_status"=>$bookmark_status,
	    			"jobseeker_display_flag"=>$user_detail->getJobseeker_display_flag(),
	    			"link_list"=>$result,
	    			"link_id"=>$linkID,
	    			"Abused_report"=>$report_abuse,
	    			"showSummary"=>$showSummary,
	    			"showExperience"=>$showExperience,
	    			"showEdulist"=>$showEdulist,
	    			"showSkills"=>$showSkills,
	    			"showProject"=>$showProject,
	    			"showLanguage"=>$showLanguage,
	    			"showPublication"=>$showPublication,
	    			"showHonorsAndAwards"=>$showHonorsAndAwards,
	    			"showCertiList"=>$showCertiList,
	    			"showVolunteer"=>$showVolunteer,
	    			"showPersonal"=>$showPersonal,
	    			"showShortlistedType"=>$userShortlisted,
					"showAdditionalInfo"=>$showAdditionalInfo,
	    			"linkStatus"=>$linkStatus,
	    			"notesTitle"=>$notes,
	    			"isBlocked"=>$isBlocked
	    	);
    	}
    	else
    	{
    		$userDetail = array( "user_removed"=>1 );
    	}	
    	//$a = intersect_arrays($params["user_id"],$newlinksArray);

    	echo Zend_Json::encode($userDetail);
    	die;
    }

    /**
     * This function used to send message through tooltip popup
     * @author Sunny Patial,Shaina
     * @since 1 Aug, 2013
     * @version 1.0,1.1
     *
     *
     */
    public function sendMessageAction()
    {
		$em = \Zend_Registry::get('em');
		$zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
		
		$params=$this->_request->getParams();
		
		$recieverID = $params["user_id"];
		
		$senderID = Auth_UserAdapter::getIdentity()->getId();
		
		$subject=$params["msg_type"];
		$msg = $zend_filter_obj->filter($params["msg"]);
		
	
		$textmsgID=\Extended\message::addMessage( $subject, $msg, $senderID, $recieverID, \Extended\message::MSG_TYPE_GENERAL );
		if($textmsgID)
		{
			$msguser=\Extended\message_user::addMessageUsers($senderID, $recieverID, $textmsgID);
			if($msguser)
			{
				$recieve_user_folder=\Extended\user_folder::getUserFolder($recieverID, Extended\folder::FOLDER_INBOX);
				if($recieve_user_folder)
				{
					$result=\Extended\message_folder::addMessageStatus($textmsgID, $msguser, $recieve_user_folder);
					if($result)
					{
						$sent_user_folder=\Extended\user_folder::getUserFolder(Auth_UserAdapter::getIdentity()->getId(), Extended\folder::FOLDER_SENT_ITEMS);
						if($sent_user_folder)
						{
							$result=\Extended\message_folder::addMessageStatus($textmsgID, $msguser, $sent_user_folder);
									
						}
					}
	
				}
			}
	
		}
		if($result)
		{
		    $msg=array("msg"=>"success");
		}
		else
		{
		    $msg=array("msg"=>"fail");
		}
		echo Zend_Json::encode($msg);
		die;
			
		
    }

    /**
     * This function change the bookmark status
     * @author Sunny Patial
     * @since 1 Aug, 2013
     * @version 1.0
     *
     *
     */
    public function bookmarkStatusAction()
    {
		$params=$this->getRequest()->getParams();
		 $assign_user = Auth_UserAdapter::getIdentity()->getId();
	 	$profile_user = $params["user_id"];
		$assign_status = $params["status"];
		$result = \Extended\bookmark_profile::addBookmarkStatus($assign_user, $profile_user, $assign_status);
		if($result){
			if($assign_status==0){
				echo Zend_Json::encode(array("status"=>0));
			}
			else{
				echo Zend_Json::encode(array("status"=>1));
			}
		}
		die;
    }

    /**
     * This function delete the recently viewed profile
     * @since 1 Aug, 2013
     * @version 1.0
     * @author sunny
     *
     */
    public function deleteRecentlyViewedProfileAction()
    {
		$params=$this->getRequest()->getParams();
		$link_id = explode ( ",", Auth_UserAdapter::getIdentity ()->getLink_list () );
		//Zend_Debug::dump($link_id);
		$userID = Auth_UserAdapter::getIdentity()->getId();
		$profile_user = $params["user_id"];
		if(in_array($profile_user, $link_id))
		{
			$indexCompleted = array_search($profile_user, $link_id);
			unset($link_id[$indexCompleted]);
			$link_id_arr=implode(",", $link_id);
		}
		$result = \Extended\link_requests::deleteLinks($userID,$profile_user);
		if($result)
		{
			$final_arr=array("currentUser"=>$userID,"linksID"=>$link_id_arr);
			$update_list=\Extended\ilook_user::updateRequestedUserLinks( $final_arr);
			if($update_list)
			{
				$result_arr=array("msg"=>$result);
			}
		}
		echo Zend_Json::encode($result);die;
		
    }

    /**
     * function used for getting all tags added and assigned by the users.
     * Author: Sunny Patial,Shaina
     * Date: 2,Aug 2013
     * version: 1.0
     * return: encoded array
     *
     */
    public function getEditTagsAction()
    {
		$params=$this->getRequest()->getParams();
		$profile_user=$params["user_id"];
		$current_user = Auth_UserAdapter::getIdentity()->getId();
		$usr_tags = \Extended\user_tags::getEditTags($current_user);
		$assignedTags = \Extended\link_tags::getAssignedTags($current_user, $profile_user);
		foreach($assignedTags as $v){
			
			for($i=0;$i<count($usr_tags);$i++){
				if($usr_tags[$i]['tag_id']==$v->getLink_tagsUser_tags()->getId()){
					$usr_tags[$i]['is_checked']=1;
				}
			}
		}
		echo Zend_Json::encode($usr_tags);
		die;
    }

    /**
     * function used to get all tags of the current user
     * Author: Sunny Patial
     * Date: 22, Aug 2013
     * version: 1.0
     * return: encoded array
     *
     */
    public function getManageTagsAction()
    {
		$params=$this->getRequest()->getParams();
		$current_user = Auth_UserAdapter::getIdentity()->getId();
		$usr_tags = \Extended\user_tags::getEditTags($current_user);
		echo Zend_Json::encode($usr_tags);
		die;
    }

    /**
     * function used to get all tags of the current user
     * Author: Sunny Patial
     * Date: 22, Aug 2013
     * version: 1.0
     * return: encoded array
     *
     */
    public function getCheckedTagsAction()
    {
    	$params=$this->getRequest()->getParams();
    	$current_user = Auth_UserAdapter::getIdentity()->getId();
    	$checkedTags = \Extended\link_tags::getCheckedAssignedTags($current_user,@$params["user_id"]);
    	$usr_tags = \Extended\user_tags::getEditTags($current_user);
    	foreach($checkedTags as $ck=>$cv){
    		foreach($usr_tags as $uk=>$uv){
    			if($uv['tag_id']==$cv){
    				$usr_tags[$uk]['type']="checked";
    			}
    		}
    	}
    	echo Zend_Json::encode($usr_tags);
    	die;
    }
    /**
     * function used for add new tag
     * Author: Sunny Patial,Shaina
     * Date: 2,Aug 2013
     * version: 1.0
     *
     */
    public function addNewTagAction()
    {
		$params=$this->getRequest()->getParams();
		
		$current_user = Auth_UserAdapter::getIdentity()->getId();
		$tag_title = $params["title"];
		
		$return_arr = \Extended\user_tags::addTags($current_user, $tag_title);
		echo Zend_Json::encode($return_arr);
    	die;
    }

    /**
     * function used for assign tags to users
     * Author: Sunny Patial
     * Date: 5,Aug 2013
     * version: 1.0
     *
     *
     */
    public function assignTagsAction()
    {
		$params=$this->getRequest()->getParams();
		$profile_user = $params["user_id"];
		$current_user = Auth_UserAdapter::getIdentity()->getId();
		// delete all the assign tags.
		$result=\Extended\link_tags::removeAllTags($current_user,$profile_user,$params["tags_arr"]);
		if($result){
			for($i=0;$i<count(@$params["tags_arr"]);$i++){
				$add_tags=\Extended\link_tags::assignTags($current_user, $profile_user, $params["tags_arr"][$i]['value']);
			}
			$msg=array("msg"=>"success");
			echo Zend_Json::encode($msg);
		}
		die;
    }

    /**
     * This function use to save notes regarding any user with in the popup
     * @author Sunny Patial
     * @since 1 Aug, 2013
     * @version 1.0
     * 
     *
     *
     */
    public function saveNoteAction()
    {
		$params=$this->getRequest()->getParams();
		$profile_user = $params["user_id"];
		$current_user = Auth_UserAdapter::getIdentity()->getId();
		$result=\Extended\notes::addNote($current_user,$profile_user,$params["note"]);
		//Zend_Debug::dump($result);die;
		if($result){
			$msg=array("msg"=>"success");
		}
		echo Zend_Json::encode($msg);
		die;
    }

    /**
     * This function used to render the notes text
     * @author Spatial
     * @since 1 Aug, 2013
     * @version 1.0
     * 
     *
     *
     */ 
    public function getNoteAction()
    {
		$params=$this->getRequest()->getParams();
		$profile_user = $params["user_id"];
		$current_user = Auth_UserAdapter::getIdentity()->getId();
		$result=\Extended\notes::getNote($current_user,$profile_user);
		if($result)
		{
// 			$txt=array("txt_note"=>$result);
			echo Zend_Json::encode($result);
		}
		else
		{
// 			$txt=array("txt_note"=>"");
			echo Zend_Json::encode("");
		}
		
		die;
    }

    /**
     * This function used to send Report abuse to admin when current user report abuse someones' profile
     * 
     * @author spatial	
     * @author sjaiswal	
     * @since 5 Aug, 2013
     * @version 1.1
     * 
     */
    public function abuseReportAction()
    {
		$profile_owner_info = \Extended\ilook_user::getRowObject( $this->getRequest()->getParam("user_id") );
		\Extended\report_abuse::addProfileAbuseReport(Auth_UserAdapter::getIdentity()->getId(), $this->getRequest()->getParam("user_id") );
		$profile_owner_fullname = $profile_owner_info->getFirstname()." ".$profile_owner_info->getLastname();
		$userName = Auth_UserAdapter::getIdentity()->getFirstname()." ".Auth_UserAdapter::getIdentity()->getLastname();
		
		
		$msg='';
		$msg = "<p style= padding:0; font-size:14px; font-family:Arial, Helvetica, sans-serif; color:#3a3a3a'>
		A profile has been reported abuse.
		</p>
		<p style = 'padding:0; font-size:14px; font-family:Arial, Helvetica, sans-serif; color:#3a3a3a'>
		".$profile_owner_fullname."'s profile has been reported abused by ".$userName."
		</p>";
		 
		$subject="iLook - A profile has been reported abuse";
		
		$result=Email_Mailer::sendMail ( $subject, $msg, "Admin", 'reportabuse@ilook.net', array(), "iLook Team","","Hello ","Best Regards");
		if($result){
			$msg=array("msg"=>"success");
		}
		echo Zend_Json::encode($msg);
		die;
    }

    public function removeProfileReportAbuseAction()
    {
    	//Getting object of profile owner user.
    	if(\Extended\report_abuse::removeProfileAbuseReport( Auth_UserAdapter::getIdentity()->getId(),$this->getRequest()->getParam("user_id") ))
    	{
    	
    		echo Zend_Json::encode(1);
    	}
    	else 
    	{
    		echo Zend_Json::encode(0);
    	}
    	die;
    }
    
    
    /**
     * This function used to get abuse report information
     * @author Sunny Patial
     * @since 5 Aug, 2013
     * @version 1.0
     * 
     *
     *
     */
    public function getAbuseReportAction()
    {
		$params=$this->getRequest()->getParams();
		$profile_user = $params["user_id"];
		$current_user = Auth_UserAdapter::getIdentity()->getId();
		$result=\Extended\report_abuse::getAbuseReport($current_user,$profile_user);
		if($result){
			$txt=array("abuse_id"=>$result);
			echo Zend_Json::encode($txt);
		}
	
		die;
    }
	/**
	 * This action lists link requests.
	 *
	 * If link_req_id and todo_parameter is send in url, this function
	 * can automatically accept or decline that link request
	 * according to todo_parameter.
	 *
	 * It also checks that after_login_redirection_session session, which
	 * forms when user try to accept link request from email.
	 *
	 * @author spatial
	 * @author jsingh7
	 * @author hkaur5
	 * @author ssharma4 [code optimization]
	 * @author jsingh [code optimization]
	 * @version 1.3
	 */
    public function newLinkRequestAction()
    {
    	$params = $this->getRequest()->getParams();
    	$after_login_redirection_session = new Zend_Session_Namespace("after_login_redirection_session");
    	
    	//This will check after_login_redirection_session if user tried to accept/reject the link request
		//form email.
		//It will also todo_parameter in URL if user tried to accept/reject link request from imail.
		//Otherwise link_req_id post parameter is must to execute this action.
    	if( $after_login_redirection_session->action_to_do == "accept_from_email")
    	{
			$link_req_id = $after_login_redirection_session->link_reqst_id;
    		$after_login_redirection_session->unsetAll();
    		$params['todo'] = 'accept';
    	}
    			
    	else if ($after_login_redirection_session->action_to_do == "decline_from_email")
    	{
			$link_req_id = $after_login_redirection_session->link_reqst_id;
    		$after_login_redirection_session->unsetAll();
    		$params['todo'] = 'decline';
    	}
		else if (isset($params['todo']))
		{
			$link_req_id = $this->getRequest()->getParam('link_req_id');
		}
    	

    	// Store message in session in case when
    	// user has invited other user from his/her public profile view.
    	// $params['link_req_through_pub_view'] sent from send_link_request action.
		if (isset($params['link_req_through_pub_view'])) {
			switch ($params['link_req_through_pub_view'] )
			{
				//Link request sent successfully.
				case 1:
					$messages = new Zend_Session_Namespace('messages');
					$messages->successMsg = "Your link request has been sent successfully";
					break;

				case 2: // Own profile
					$messages = new Zend_Session_Namespace('messages');
					$messages->successMsg = "Your link request can't be sent as it was your own profile";
					break;
				case 3: // Already sent.
					$messages = new Zend_Session_Namespace('messages');
					$messages->successMsg = "Your link request is already waiting for ".$params['accepter_name']." response";
					break;

				case 4: // To whom you have invited his/her's request is already pending on your side.
					$messages = new Zend_Session_Namespace('messages');
					$messages->successMsg = $params['requester_name']."'s link request is already pending";
					break;

				case 5: // Aready in links.
					$messages = new Zend_Session_Namespace('messages');
					$messages->successMsg = $params['accepter_name'].' is already in your links';
					break;
				case 6: // user in block user list.
					$messages = new Zend_Session_Namespace('messages');
					$messages->errorMsg = 'You do not have access to send link request to '.$params["accepter_name"];
					break;
			}
		}
	
    	if( isset($params['todo']) && $params['todo'] == "accept" )
    	{

    		$link_req_obj = \Extended\link_requests::getRowObject($link_req_id);
    		
			if( $link_req_obj )
			{
				//Checking that may be this user is already in my links.
	    		if (!(\Extended\ilook_user::isUserMyLink( Auth_UserAdapter::getIdentity()->getId(), $link_req_obj->getLink_requestsSenderUser()->getId())))
	    		{

					//Accepting link request.
					\Helper_links::add($link_req_id);
					$messages = new Zend_Session_Namespace ( 'messages' );
					$messages->successMsg = "You are now linked with ".$link_req_obj->getLink_requestsSenderUser()->getFirstname().".";

				}
	    		else
	    		{
					//Show msg that user is already in your links.
					$messages = new Zend_Session_Namespace ( 'messages' );
					$messages->successMsg = $link_req_obj->getLink_requestsSenderUser()->getFirstname()." is already in your links!";

				}
			}
			else
			{
				//Show msg if you have already declined this link request.
				$messages = new Zend_Session_Namespace ( 'messages' );
				$messages->successMsg = "You have already declined this link request.";
			}


    	}
    	// End if user comes form inbox to accept link request---------------------------

    	
    	//If user comes form imails inbox to decline link request------------------------
    	if( isset($params['todo']) && $params['todo'] == "decline" )
    	{
	    	$link_req_obj = \Extended\link_requests::getRowObject($link_req_id);
	    	if( $link_req_obj )
	    	{
		    	//Creating array of link req to send as parameter for delete request.
		    	$link_req_arr = array();
		    	$link_req_arr['type'] = $link_req_obj->getLink_request_type();
		    	$link_req_arr['cancel_request'] = $link_req_obj->getId();
	    		if( $link_req_obj->getIs_confirmed() )
	    		{
	    			//Show msg if you have already declined this link request.
	    			$messages = new Zend_Session_Namespace ( 'messages' );
	    			$messages->successMsg = "You are already linked with ".$link_req_obj->getLink_requestsSenderUser()->getFirstname().".";
	    		}
	    		else
	    		{
	    			//decline ( just remove the record form link_request table. )
	    			if( \Extended\link_requests::deleteRequest( $link_req_arr ) )
	    			{
	    				$messages = new Zend_Session_Namespace ( 'messages' );
	    				$messages->successMsg = "Link request has been declined successfully.";
	    			}
	    			else
	    			{
	    				$messages = new Zend_Session_Namespace ( 'messages' );
	    				$messages->errorMsg = "Error! in handling link request, please try again.";
	    			}	
	    		}	
	    	}
	    	else
	    	{
	    		//Show msg if you have already declined this link request.
	    		$messages = new Zend_Session_Namespace ( 'messages' );
	    		$messages->errorMsg = "You have already declined this link request.";
	    	}
    	}
    	// End if user came form inbox to decline link request--------------------------

    	if( ! isset($params['list_len']) )
    	{
    		$params['list_len'] = 20;
    	}
    	$this->view->prms = $params;
    	
        // get all link requests
        $requests=\Extended\link_requests::getActiveLinkRequest(Auth_UserAdapter::getIdentity()->getId());
     	foreach($requests as $k=>$v)
     	{
     		$linksRequestArr[] = $v->getLink_requestsSenderUser()->getId();
     	}
        if(isset($params['linkSearch']))
        {
        	$this->view->searchText = $params['linkSearch'];
        	if(!preg_match('/[\'^�$%&*()}{@#~?><>,|=_+�-]/', $params['linkSearch'])){
        		$this->view->linkSearchText=$params['linkSearch'];
        			$query_str = "";
        			$query_str .= 'first_name:'.$params['linkSearch'].'*';
        			$query_str .= ' OR last_name:'.$params['linkSearch'].'*';
        
        			$requests = \Extended\ilook_user::getUsersForLuceneQuery( $query_str );
        			
        			$linkid=array();
        			for($i=0;$i<count($requests);$i++){
        				$linkid[]=$requests[$i]->getId();
        			}
        			$arr_intersection=array_intersect ($linkid,$linksRequestArr);
        			$result=implode(",",$arr_intersection);
        			$requests = \Extended\link_requests::getSearchingRequests($result);        			
        	}
        	else
        	{
        		$messages = new \Zend_Session_Namespace ( 'messages' );
        		$messages->warningMsg = "No valid keywords for search!";
        		$requests=array();
        	}
        
        }
        
        if(!$requests && !isset($params['linkSearch']))
        {
        	$loggedin_user = Auth_UserAdapter::getIdentity ();
			$loggedin_user_id = Auth_UserAdapter::getIdentity ()->getId(); 
			
			if( ! @$params['list_len'] )
			{
				$params['list_len'] = 20;
			}
			$this->view->prms = $params;



			// Start of people you may know section=================================
	    	
			// Getting users school ids.
			$edu_collec= $loggedin_user->getUsersEducation();
			$myEduSchoolIds = array ();
			foreach ( $edu_collec as $edu_obj )
			{
				$myEduSchoolIds [] = $edu_obj->getEducation_detailsSchool()->getId();
			}
			
			// Getting users company_ref ids 
			$myExpCompanyIds = array();
			$exp_collec = $loggedin_user->getUsersExperience();
			foreach ( $exp_collec as $exp_obj )
			{
				$myExpCompanyIds[] = $exp_obj->getExperiencesCompany()->getId();
			}	
	    	
			// Get users who has sent or received link req from me.
			$getLinkRequestSent = \Extended\link_requests::getLinkRequestSenderOrReceiver ( $loggedin_user_id );
			$requester_accepter_id = array ();
			if( $getLinkRequestSent )
			{
	    		foreach ( $getLinkRequestSent as $key => $r )
	    		{
	    			if( isset($r['accept_user_id'] ) )
	    			{
	    				$requester_accepter_id [] = $r['accept_user_id'];
	    			}
	    			else if( isset($r['request_user_id']) )
	    			{
	    				$requester_accepter_id [] = $r['request_user_id'];
	    			}
	    		}
	    	}
			
	    	// Fetch records of people you may know.
	    	$users = Extended\ilook_user::getUsersYouMayKnow( $myExpCompanyIds, 
											    			$myEduSchoolIds, 
											    			$loggedin_user_id, 
											    			$requester_accepter_id, 
											    			0, 
											    			9
	    			);
	    	 
	    	$people_you_may_know_ids_arr = $users['data'];
	
	    	// If records exists.
			if( $users['data'])
    		{
    			$finalarray = array ();
    		 
	    		foreach ( $users['data'] as $key => $user )
	    		{
	    			$people_you_may_know_obj_arr [] = $user;
	    			 
	    		}
		    	$this->view->youMayKnowUsers = $people_you_may_know_obj_arr;
		    	$this->view->is_more_records = $users['is_more_records'];
    		}
	    	else if(empty($users['data']))
	    	{
	    		$this->view->youMayKnowUsers = array();
	    	}
	        $this->view->htmlView="peopleYouMayKnow";
	        
		//End of people you may know section--------------------------------------------
		}
        else
        {
        	//------ PAGINATION -------
        	$paginator = Zend_Paginator::factory($requests);
        	$paginator->setItemCountPerPage( @$params['list_len'] );
        	$paginator->setCurrentPageNumber( @$params['page'] );
        	$this->view->paginator=$paginator;
        	$this->view->htmlView="newLinkRequest";
        }

    }

    /**
     * This function display listing of people you may know.
     * @author Sgandhi, Spatial
     * @version 1.0
     *
     */
    public function peopleYouMayKnowAction()
    {
    	$random_data=array();
		$params = $this->getRequest()->getParams();
		
		
		$loggedin_user = Auth_UserAdapter::getIdentity ();
		$loggedin_user_id = Auth_UserAdapter::getIdentity ()->getId(); 
		
		if( ! @$params['list_len'] )
		{
			$params['list_len'] = 20;
		}
		$this->view->prms = $params;
    	
		// Start of people you may know section=================================
    	
		// Getting users school ids.
		$edu_collec= $loggedin_user->getUsersEducation();
		$myEduSchoolIds = array ();
		foreach ( $edu_collec as $edu_obj )
		{
			$myEduSchoolIds [] = $edu_obj->getEducation_detailsSchool()->getId();
		}
		
		// Getting users company_ref ids 
		$myExpCompanyIds = array();
		$exp_collec = $loggedin_user->getUsersExperience();
		foreach ( $exp_collec as $exp_obj )
		{
			$myExpCompanyIds[] = $exp_obj->getExperiencesCompany()->getId();
		}	
    	
		// Get users who has sent or received link req from me.
		$getLinkRequestSent = \Extended\link_requests::getLinkRequestSenderOrReceiver ( $loggedin_user_id );
    	if( $getLinkRequestSent )
    	{
    		$requester_accepter_id = array ();
    		foreach ( $getLinkRequestSent as $key => $r )
    		{
    			if( isset($r['accept_user_id']) )
    			{
    				$requester_accepter_id [] = $r['accept_user_id'];
    			}
    			else if( $r['request_user_id'] )
    			{
    				$requester_accepter_id [] = $r['request_user_id'];
    			}
    		}
    	}
		
    	// Fectch records of people you may know.
    	$users = Extended\ilook_user::getUsersYouMayKnow( $myExpCompanyIds, 
										    			$myEduSchoolIds, 
										    			$loggedin_user_id, 
										    			$requester_accepter_id, 
										    			0, 
										    			10
    			);
    	 
    	// If records exists.
		if( $users['data'])
    	{
			$finalarray = array ();
    		 
	    	foreach ( $users['data'] as $key => $user )
	    	{
	    		$people_you_may_know_obj_arr [] = $user;
	    			 
	    	}
		   	$this->view->youMayKnowUsers = $people_you_may_know_obj_arr;
		   	$this->view->is_more_records = $users['is_more_records'];
    	}
	    else if(empty($users['data']))
	    {
	    	$this->view->youMayKnowUsers = array();
	    }
		// End of people you may know section==============================
 
			
		// if user search.
		if(@$params['linkSearch'])
		{
			// create array of the "people you may know" ids..
			for( $i = 0; $i < count( $random_data ); $i++ )
			{
				$peopleYouMayKnowID[] = $random_data[$i]->getId();
			}
			if(!preg_match('/[\'^�$%&*()}{@#~?><>,|=_+�-]/', $params['linkSearch']))
			{
				$this->view->linkSearchText=$params['linkSearch'];
				$query_str = "";
				$query_str .= 'first_name:'.$params['linkSearch'].'*';
				$query_str .= ' OR last_name:'.$params['linkSearch'].'*';
				$users = \Extended\ilook_user::getUsersForLuceneQuery( $query_str );
				$linkid = array();
				for($i = 0; $i < count($users); $i++)
				{
					$linkid[]=$users[$i]->getId();
				}
				$arr_intersection = array_intersect ($linkid,$peopleYouMayKnowID);
				$result = implode(",",$arr_intersection);
				$random_data = \Extended\ilook_user::getSearchLinksOfUser($result);
			}
			else
			{
				$messages = new \Zend_Session_Namespace ( 'messages' );
				$messages->warningMsg = "No valid keywords for search!";
				$random_data=array();
			}
		}
	}
	
	/**
	 *  #TO BE TESTED YET#
	 *	Fetch users you-may-know record on basis of offset and limit for load more peopele you know ajax call.
	 * 	@param $_POST
	 * 	@author hkaur5
	 * 	
	 * 	@return json_encoded html or null
	 */
	public function loadMorePeopleYouMayKnowAction()
	{
		$loggedin_user = Auth_UserAdapter::getIdentity ();
		$loggedin_user_id = Auth_UserAdapter::getIdentity ()->getId();
		$params = $this->getRequest()->getParams();
		 
		// Start of people you may know section=================================
		 
		// Getting users school ids.
		$edu_collec= $loggedin_user->getUsersEducation();
		$myEduSchoolIds = array ();
		foreach ( $edu_collec as $edu_obj )
		{
			$myEduSchoolIds [] = $edu_obj->getEducation_detailsSchool()->getId();
		}
		
		// Getting users company_ref ids
		$myExpCompanyIds = array();
		$exp_collec = $loggedin_user->getUsersExperience();
		foreach ( $exp_collec as $exp_obj )
		{
			$myExpCompanyIds[] = $exp_obj->getExperiencesCompany()->getId();
		}
		 
		// Get users who has sent or received link req from me.
		$getLinkRequestSent = \Extended\link_requests::getLinkRequestSenderOrReceiver ( $loggedin_user_id );
		if( $getLinkRequestSent )
		{
			$requester_accepter_id = array ();
			foreach ( $getLinkRequestSent as $key => $r )
			{
				if( $r['accept_user_id'] )
				{
					$requester_accepter_id [] = $r['accept_user_id'];
				}
				else if( $r['request_user_id'] )
				{
					$requester_accepter_id [] = $r['request_user_id'];
				}
			}
		}
		
		// Fectch records of people you may know.
		$users = Extended\ilook_user::getUsersYouMayKnow( $myExpCompanyIds,
				$myEduSchoolIds,
				$loggedin_user_id,
				$requester_accepter_id,
				$params['offset'],
				$params['limit']
		);
		
	 	
	 	if( $users['data'])
	 	{
				$finalarray = array ();
				 
				foreach ( $users['data'] as $key=>$user )
				{
					$people_you_may_know_arr[$key] = $user->getId();
				}
			
			$html .= Helper_common::displayUsersGridView(Auth_UserAdapter::getIdentity ()->getId(),$people_you_may_know_arr,null,null,null,"Invite your contacts to ilook and increase <br> your network for more activities");
			if($users['is_more_records'])
			{
				$html .= '<div class="see_more_you_may_know job-content view_more">';
				$html .= '<p>';
				$html .= '<a href="javascript:;" onclick="loadMorePeopleYouMayKnow(this);" class="see_more_you_may_know_text text-dark-purple">';
				$html .= 'View More';
				$html .= '</a>';
				$html .= '</p>';
				$html .= '</div>';
			}
			
			$result  = array('is_more_data' =>$users['is_more_records'], 'html'=>$html );
		 
		}
		else
		{
			$result = null;
		}
		echo zend_json::encode($result);
		die;
		// End of people you may know section==============================
	}
    /**
     * Sends link request.
     * 
     * @param [in the form of POST or GET] string "accept_user" [comma seperated]
     * @return boolean[1 or 0]
     * @author sgandhi, spatial, jsingh7
     * @since 12 Aug, 2013
     * @version 1.2
     */
    public function inviteToConnectAction()
    {
    	try 
    	{
    		$accept_user_ids = explode( ",", $this->getRequest()->getParam("accept_user") );
    		foreach ( $accept_user_ids as $accept_user_id )
    		{
				$request_arr = array();
				$request_arr['link_request_type'] = \Extended\link_requests::LINK_REQUEST_TYPE_VIA_ILOOK;
				$request_arr['request_user_id'] = Auth_UserAdapter::getIdentity()->getId();
				$request_arr['accept_user_id'] = $accept_user_id;
				$send_link_request = \Extended\link_requests::sendRequest($request_arr);
    		}
			echo Zend_Json::encode(1);
    	}
    	catch (Exception $e) 
    	{
			echo Zend_Json::encode(0);
    	}
		die;
    }
	
    /** 
     * Sends link request from user A to user B.
     * It handles case when user has been redirected through public profile view 
     * by using parameter 'link_req_through_pub_view == 1'.
     * Further it sends email and imail for new link request to accept_user
     * 
     * This function is used for both when sent request when user is in logged in state and when
     * he is redirected from public profile view.
     * @author spatial
     * @author hkaur5
     * @version 1.0
     *
     */
    public function sendLinkRequestAction()
    {
		$params				= $this->getRequest()->getParams();
		$link_request_type 	= \Extended\link_requests::LINK_REQUEST_TYPE_VIA_ILOOK;
    	$request_user 		= Auth_UserAdapter::getIdentity()->getId();
    	$accepter_user_obj 	= \Extended\ilook_user::getRowObject( $params["accept_user"] );
    	$accepter_name 		= $accepter_user_obj->getFirstname()." ".$accepter_user_obj->getLastname();
    	$request_user_obj	= \Extended\ilook_user::getRowObject( $request_user );
		$requester_name		= $request_user_obj->getFirstname()." ".$request_user_obj->getLastname();

    	//Block user list of requester user.
    	$blocked_users = \Extended\blocked_users::getAllBlockersAndBlockedUsers($request_user);
    	
    	//-------------------------ELSE IF statements for redirection---------------------------//
    	
    	//When user is trying to send link request to his own profile.
    	if($params["accept_user"] == Auth_UserAdapter::getIdentity()->getId())
    	{
    		$this->_redirect( PROJECT_URL.'/'.PROJECT_NAME.'links/new-link-request/link_req_through_pub_view/2' );
    	}
    	//If link request accepter is in blocked user list of link requester.
    	else if($blocked_users)
    	{
    		if(in_array($params['accept_user'], $blocked_users))
    		{
    			$this->_redirect( PROJECT_URL.'/'.PROJECT_NAME.'links/new-link-request/link_req_through_pub_view/6/accepter_name/'.$accepter_name);
    		}
    		
    		// If user has been redirected on send link request through public profile view,
    		// check if link request state/friend_type is 1, 2, 3 ( refer \Extended\link_requests::getFriendRequestState)
    		// then redirect to new link request page to show respective messages.
    		else if($params['link_req_through_pub_view'] == 1)
    		{
				getRedirectURL($params["accept_user"], $accepter_name);
    		}
    	}
    	
    	// If user has been redirected on send link request through public profile view,
    	// check if link request state/friend_type is 1, 2, 3 ( refer \Extended\link_requests::getFriendRequestState)
    	// then redirect to new link request page to show respective messages.
    	else if( isset($params['link_req_through_pub_view']) && $params['link_req_through_pub_view'] == 1 )
    	{
			getRedirectURL($params["accept_user"], $accepter_name);
    	}
    	//-------------------------END ELSE IF statements for redirection------------------------//
    	
    	$request_arr 						= array();
    	$request_arr['link_request_type'] 	= $link_request_type;
    	$request_arr['request_user_id'] 	= $request_user;
		$request_arr['requester_name'] 		= $requester_name;
    	$request_arr['accept_user_id'] 		= $params["accept_user"];

    	$send_link_request = \Extended\link_requests::sendRequest($request_arr);
    	//Redirection when user has come from public profile view after link request is sent.
    	if(isset($params['link_req_through_pub_view']) && $params['link_req_through_pub_view'] == 1)
    	{
    		Helper_common::sendLinkRequestImail($send_link_request, false);
    		Helper_email::sendLinkRequestEmail($send_link_request);
    		$this->_redirect( PROJECT_URL.'/'.PROJECT_NAME.'links/new-link-request/link_req_through_pub_view/1' );
    	}
    	//------------End of code for public profile view--------------------------------------//
		
    	if($send_link_request["request-status"]=="already sent")
    	{
    		$request = array("requestID"=>$send_link_request['requestID'],"requestStatus"=>"already sent invitation","uname"=>$accepter_name);
    		echo Zend_Json::encode($request);

    		if($send_link_request)
    		{
    			Helper_common::sendLinkRequestImail($send_link_request["requestID"], false);
				$text = " has sent you a link request";
				$notificationType = \Helper_gcm::UNSEEN_NOTIFICATION_COUNT_TYPE;
				$link_request_obj = \Extended\link_requests::getRowObject($send_link_request["requestID"]);
				$requester_id = $link_request_obj->getLink_requestsSenderUser()->getId();
				$forUserId = $link_request_obj->getLink_requestsRecieverUser()->getId();
				
				\Helper_gcm::create($requester_id,$text,$notificationType,$forUserId);
    		}
    	}
    	else
    	{
    		if($send_link_request)
    		{
    			Helper_common::sendLinkRequestImail($send_link_request, false );
    			Helper_email::sendLinkRequestEmail($send_link_request);
				$text = " has sent you a link request";
				$notificationType = \Helper_gcm::UNSEEN_NOTIFICATION_COUNT_TYPE;
				$link_request_obj = \Extended\link_requests::getRowObject($send_link_request);
				$requester_id = $link_request_obj->getLink_requestsSenderUser()->getId();
				$forUserId = $link_request_obj->getLink_requestsRecieverUser()->getId();

				\Helper_gcm::create($requester_id, $text, $notificationType, $forUserId);
				echo Zend_Json::encode($send_link_request);
    		}

    	}

		// If user has been redirected on send link request through public profile view,
		// check if link request state/friend_type is 1, 2, 3 ( refer \Extended\link_requests::getFriendRequestState)
		// then redirect to new link request page to show respective messages.
		function getRedirectURL($accept_user_id, $accepter_name)
		{
			$link_req_state = \Extended\link_requests::getFriendRequestState($accept_user_id, Auth_UserAdapter::getIdentity()->getId());
			switch($link_req_state['friend_type'])
			{
				case 1: // you have already sent request.
					$this->_redirect( PROJECT_URL.'/'.PROJECT_NAME.'links/new-link-request/link_req_through_pub_view/3/accepter_name/'.$accepter_name );
					break;
				case 2: // Other user has already sent request
					$this->_redirect( PROJECT_URL.'/'.PROJECT_NAME.'links/new-link-request/link_req_through_pub_view/4/reqster_name/'.$accepter_name );
					break;
				case 3: // Already friends.
					$this->_redirect( PROJECT_URL.'/'.PROJECT_NAME.'links/new-link-request/link_req_through_pub_view/5/accepter_name/'.$accepter_name);
					break;
			}
		}
    	die;
    }
    
    /**
     * This function used to cancel the request.
     * 
     * --------------------------------------------------------------------
     * Action code was useless, Object oriented approach was not followed!
     * Has been changed - jsingh7 
     * on 10 mar 2015
     * --------------------------------------------------------------------
     * 
     * @author sgandhi
     * @version 1.1
     * 
     */
    public function deleteRequestAction()
    {
    	$params = $this->getRequest()->getParams();
    	 
    	$flag1 = false;
    	if( @$params["type"] == "request" )
    	{
    		$flag1 = true;
    	}
    	 
    	$result = \Extended\link_requests::unlinkUsersByLinkReqId( $params["cancel_request"], $flag1 );
    	 
    	switch ( $result )
    	{
    		case 0:
    		case 1:
    		case 2:
    			echo Zend_Json::encode( $result );
    			break;
    		case 3:
    			if (isset($params["profileID"]))
    			{	
	    			$currentUser = Auth_UserAdapter::getIdentity()->getId();
	    			$TagsExist=\Extended\link_tags::getAssignedTags($currentUser, $params["profileID"] );
	    			$tagsarr=array();
	    			$removeLinks=\Extended\link_tags::removeAllTags($currentUser,$params["profileID"],$tagsarr);
	    			\Extended\socialise_photo_custom_privacy::deleteViewerfromCustomViewersList($currentUser, $params['profileID']);
    			}
    			echo Zend_Json::encode( $result );
    			break;
    	
    		default:
    			echo Zend_Json::encode( $result );
    			break;
    	}
    	die;
    }

    /**
     * This function used to accept the link request
     *
     * @author Shaina Gandhi, nsingh3
	 * @author ssharma4[replace Extended(link_request::accept_request) function call to common function call]
	 * @since 12 Aug 2013, 22 Aug 2014
     * @version 1.1
     * 
     */
    public function acceptRequestAction()
    {
		//Save acceptance,add notification record & add link to roster.
		$link_req_id =   \Helper_links::add($this->getRequest()->getParam('link_request_id'));
		echo Zend_Json::encode($link_req_id);
		die;
    }

    
    /**
     * function used to delete the tag
     * Author: Sunny Patial
     * Date: 5,Aug 2013
     * version: 1.0
     */
    public function deleteTagAction()
    {
		$params=$this->getRequest()->getParams();
		$link_tags=\Extended\link_tags::deleteAssignedTags($params["id"]);
		$result=\Extended\user_tags::deleteTag($params["id"]);
		if($result){
    		echo Zend_Json::encode($result);
    	}
    	else{
    		$result=array("msg"=>"fail");
    		echo Zend_Json::encode($result);
    	}
    	die;
    }
    /**
     * function used to update the tag
     * Author: Sunny Patial
     * Date: 5,Aug 2013
     * version: 1.0
     */
    public function updateTagAction()
    {
		$params=$this->getRequest()->getParams();
		$result=\Extended\user_tags::updateTag($params["tags"]);
		echo Zend_Json::encode($result);
		die;
    }
    /**
     * function used to add active bookmarks status
     * Author: Sunny Patial
     * Date: 5,Aug 2013
     * version: 1.0
     */
    public function addBookmarkAction()
    {
		$params=$this->getRequest()->getParams();
		$currentUser=Auth_UserAdapter::getIdentity()->getId();
		$status=\Extended\bookmark_profile::BOOKMARKED_STATUS;
		$bookmark_users=$params["bookmarks"];
		for($i=0;$i<count($bookmark_users);$i++){
			$profile_user=$bookmark_users[$i];
			$result = \Extended\bookmark_profile::addBookmarkStatus($currentUser, $profile_user, $status);
		}
		if($result){
			$msg=array("msg"=>"success");
		}
		else{
			$msg=array("msg"=>"fail");
		}
		echo Zend_Json::encode($msg);
		die;
    }
    /**
     * function used to send multiple messages
     * Author: Sunny Patial
     * Date: 5,Aug 2013
     * version: 1.0
     */
    public function sendMultipleMsgesAction()
    {
		$em = \Zend_Registry::get('em');
		$params=$this->_request->getParams();
		$senderID = Auth_UserAdapter::getIdentity()->getId();
		$subject="Message from ".Auth_UserAdapter::getIdentity()->getFirstname()." ".Auth_UserAdapter::getIdentity()->getLastname();
		$msg=$params["msg"];
		$profileUser=$params["bookmark_users"];
		
		$zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
		
		//Filtering msg and subject for html tags.
		//Added by hkaur5
		$msg = $zend_filter_obj->filter( $msg );
		$subject = $zend_filter_obj->filter( $subject );
		
	
		for($i=0;$i<count($profileUser);$i++){
			$recieverID=$profileUser[$i];
	
			$textmsgID=\Extended\message::addMessage( $subject, $msg, $senderID, $recieverID, \Extended\message::MSG_TYPE_GENERAL );
			if($textmsgID)
			{
				$msguser=\Extended\message_user::addMessageUsers($senderID, $recieverID, $textmsgID);
				if($msguser)
				{
					$recieve_user_folder=\Extended\user_folder::getUserFolder($recieverID, Extended\folder::FOLDER_INBOX);
					if($recieve_user_folder)
					{
						$result=\Extended\message_folder::addMessageStatus($textmsgID, $msguser, $recieve_user_folder);
						if($result)
						{
							$sent_user_folder=\Extended\user_folder::getUserFolder(Auth_UserAdapter::getIdentity()->getId(), Extended\folder::FOLDER_SENT_ITEMS);
							if($sent_user_folder)
							{
								$result=\Extended\message_folder::addMessageStatus($textmsgID, $msguser, $sent_user_folder);
									
							}
						}
	
					}
				}
	
			}
	
	
		}
		if($result){
			$msg=array("msg"=>"success");
		}
		else{
			$msg=array("msg"=>"fail");
		}
		echo Zend_Json::encode($msg);
		die;
	
    }
    /**
     * function used to assign multiple tags
     * Author: Sunny Patial
     * Date: 5,Aug 2013
     * version: 1.0
     */
    public function assignMultipleTagsAction()
    {
		$params=$this->_request->getParams();
		$current_user = Auth_UserAdapter::getIdentity()->getId();
		for($i=0;$i<count($params["user"]);$i++){
			$profile_user = $params["user"][$i];
			$result=\Extended\link_tags::removeAllTags($current_user,$profile_user,$params["tags_arr"]);
		}
		if($result)
		{
			for($j=0;$j<count($params["tags_arr"]);$j++)
			{
				for($i=0;$i<count($params["user"]);$i++)
				{
					$profile_user = $params["user"][$i];
				$add_tags=\Extended\link_tags::assignTags($current_user, $profile_user, $params["tags_arr"][$j]['value']);
				}
			}
			$msg=array("msg"=>"success");
		}
		// delete all the assign tags.
		echo Zend_Json::encode($msg);
		die;
    }
    /**
     * function used to get list of tags
     * Author: Sunny Patial
     * Date: 5,Aug 2013
     * version: 1.0
     */
    public function tagAction()
    {
    	
        $params = $this->getRequest()->getParams();
        if( ! @$params['list_len'] )
        {
        	$params['list_len'] = 20;
        }
        $this->view->prms = $params;
        $getRowobj = \Extended\user_tags::getRowObject(@$params["id"]);
        if($getRowobj){
	        $tag_title =  $getRowobj -> getTag_title(); 
	        
	        $this->view->tag_title = $tag_title;
	        $current_user = Auth_UserAdapter::getIdentity()->getId();
	        $tagUsers=\Extended\link_tags::getTagUsers($current_user, $params["id"]);
	        
	        $allLinksCount = Helper_common::getLinksCount();
	        
	        if(isset($params['linkSearch']))
	        {
	        	if(!preg_match('/[\'^�$%&*()}{@#~?><>,|=_+�-]/', $params['linkSearch'])){
		        	$this->view->linkSearchText=$params['linkSearch'];
		        	$userLinks = $tagUsers;
		        	if(count($userLinks)>0)
		        	{
		        		 
		        		$linkId=array();
		        		for($i=0;$i<count($userLinks);$i++)
		        		{
		        
		        			$linkId[]=$userLinks[$i]->getLink_tagsAssignedUser()->getId();
		        		}
		        		$query_str = "";
		        		$query_str .= 'first_name:'.$params['linkSearch'].'*';
		        		$query_str .= ' OR last_name:'.$params['linkSearch'].'*';
		        		$links = \Extended\ilook_user::getUsersForLuceneQuery( $query_str );
		        		$luceneid=array();
		        		for($i=0;$i<count($links);$i++)
		        		{
		        
		        			$luceneid[]=$links[$i]->getId();
		        		}
		        		$arr_intersection=array_intersect ($luceneid,$linkId);
		        		$result=implode(",",$arr_intersection);
		        		if($result!="")
		        		{
		        			$tagUsers = \Extended\link_tags::getSearchTagUsers($current_user, $params["id"], $result);
		        		}
		        		else
		        		{
		        			$tagUsers = array();
		        		}
		        	}
		        	else
		        	{
		        		$tagUsers = array();
		        	}
	        	}
	        	else
	        	{
	        		$messages = new \Zend_Session_Namespace ( 'messages' );
	        		$messages->warningMsg = "No valid keywords for search!";
	        		$tagUsers = array();
	        	}
	        }
	        
	        //Extracting tagged user's ids 
	        $tag_user_ids = array();
	        
	        foreach( $tagUsers as $tag_user )
	        {
	        	$tag_user_ids[] = $tag_user->getLink_tagsAssignedUser()->getId();
	        }
	        //Filter blocked profiles from bookmarked profiles( ids).
	        $blocked_profiles = \Extended\blocked_users::getAllBlockersAndBlockedUsers($current_user);
	        if($blocked_profiles)
	        {
	        	$filtered_tagged_profiles = array_diff( $tag_user_ids, $blocked_profiles );
	        }
	        else
	        {
	        	$filtered_tagged_profiles = $tag_user_ids;
	        }
	        
	        
	        
	        
	        
	        $this->view->links=$tagUsers;
	
	        //------ PAGINATION -------
	        $paginator = Zend_Paginator::factory($filtered_tagged_profiles);
	        $paginator->setItemCountPerPage(@$params['list_len']);
	        $paginator->setCurrentPageNumber(@$params['page']);
	        $this->view->paginator=$paginator;
	        $this->view->allLinksCount=$allLinksCount;
        	
        }
        else{
        	$this->_redirect(PROJECT_URL."/".PROJECT_NAME."profile/is-not-available");
        }
		
    }
    /**
     * function used to remove the bookmark status
     * Author: Sunny Patial
     * Date: 5,Aug 2013
     * version: 1.0
     */
    public function removeFromTagAction()
    {
    	$params=$this->getRequest()->getParams();
    	$tagID=$params["tagID"];
    	$currentUser=Auth_UserAdapter::getIdentity()->getId();
    	$profileID=$params["profileID"];
    	for($i=0;$i<count($profileID);$i++){
    		$profile_user=$profileID[$i];
    		$result=\Extended\link_tags::removeLinkTags($tagID, $profile_user, $currentUser);
    	}
    	if($result){
    			
    		$msg=array("msg"=>"success");
    	}
    	else{
    		$msg=array("msg"=>"fail");
    	}
    	echo Zend_Json::encode($msg);
    	die;
    }
	public function removeLinksTagAction(){
		$params = $this->getRequest()->getParams();
		$current_user = Auth_UserAdapter::getIdentity()->getId();
		$profileID=$params["profileID"];
		$tagID=$params["tagID"];
		$removeLinks=\Extended\link_tags::removeLinkTags($tagID, $profileID, $current_user);
		if($removeLinks){
			$msg=array("msg"=>"success");
		}
		else{
			$msg=array("msg"=>"error");
		}
		echo Zend_Json::encode($msg);
		die;
	}
	/**
	 * function used to get the "total number of links" and "total number of requests"
	 * Author: Sunny Patial
	 * Date: 4,Dec 2013
	 * version: 1.0
	 */
	function getNewLinksAndAddLinksCountAction(){
		$totalcount=array("totalLinks"=>Helper_common::getLinksCount(),"totalRequests"=>Helper_common::getRequestCount());
		echo Zend_Json::encode($totalcount);
		die;
	}
	
	function getTagUsersAction(){
		$current_user = Auth_UserAdapter::getIdentity()->getId();
		$params = $this->_request->getParams();
		$tagUsers=\Extended\link_tags::getTagUsersCount($current_user, $params["tagID"]);
		echo Zend_Json::encode(array("totalLinks"=>$tagUsers));
		die;
	}

}



