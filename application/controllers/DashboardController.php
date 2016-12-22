<?php

class DashboardController extends Zend_Controller_Action
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
     * Fetches the user info from database
     * to display on dashboard page
     *
     * 
     * Support Section : RSHARMA
     * Display links with
     * required information like
     * Name, profile pic,
     * company and designation etc for
     * iSupport section.
     * Users are fetched randomly from the
     * database everytime
     *
     * @author RSHARMA
     *
     */
    public function indexAction()
    {
    	$params = $this->getRequest()->getParams();
    	$loggedin_user = Auth_UserAdapter::getIdentity (); 
    	$loggedin_user_id = Auth_UserAdapter::getIdentity ()->getId(); 
    	
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
		$proposedLinkIds = \Extended\link_requests::getLinkRequestSenderOrReceiver ( $loggedin_user_id );
		$proposedLinkIdsArr = array ();
		if( $proposedLinkIds )
    	{
    		foreach ( $proposedLinkIds as $key => $proposedLinkId )
    		{
    			if( isset($proposedLinkId['accept_user_id']) )
    			{
					$proposedLinkIdsArr[] = $proposedLinkId['accept_user_id'];
    			}
    			else if( isset($proposedLinkId['request_user_id']) )
    			{
					$proposedLinkIdsArr[] = $proposedLinkId['request_user_id'];
    			}
    		}
    	}

    	$users = Extended\ilook_user::getUsersYouMayKnow( $myExpCompanyIds, $myEduSchoolIds, $loggedin_user_id, $proposedLinkIdsArr, 0, 3);
   
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
    	
		//Start of support section Redeveloped by nsingh3================
		
		$userLinks = $loggedin_user->getLink_list();
		
		if($userLinks)
		{
			$userLinksIds = explode(',', $userLinks);
			$accountClosedUserIds = array();
			foreach($userLinksIds as $uid)
			{
				$user_obj = \Extended\ilook_user::getRowObject($uid);
				if($user_obj->getAccount_closed_on() )
				{
					$accountClosedUserIds[] = $uid;
				}
			}
			//If there are users whose accounts are closed then remove those from $userLinksIds.
			if($accountClosedUserIds)
			{
				$userLinksIds = array_diff($userLinksIds, $accountClosedUserIds);
			}
			if($userLinksIds)
			{
				shuffle($userLinksIds);
				$c = 1; //incrementer
				$userCount = count($userLinksIds);
				foreach ($userLinksIds as $userLinkId)
				{
					$userLinkObj = \Extended\ilook_user::getRowObject($userLinkId);
					if($c <= $userCount)
					{
						$userRefSkillIds = \Extended\user_skills::getSkillsRefIds($userLinkId);
						
						foreach ($userRefSkillIds as $refSkillsId)
						{
							$userSkills = \Extended\skill_ref::getRowObject($refSkillsId->getUser_skillsSkill()->getId());
							// checking of supported skill by login user.
							$supportedIds = \Extended\support_skill::isSupportedSkill($userLinkId, $userSkills->getId(), $loggedin_user->getId ());
							if(count($supportedIds) == 0 && empty($supportedIds))
							{
								$listOfSkills[$c]['skills'][$userSkills->getId()] = $userSkills->getSkill();
							}
						}
						if($userLinkObj)
						{
							$listOfSkills[$c]['userName'] = ucfirst($userLinkObj->getFirstname()).' '.ucfirst($userLinkObj->getLastname());
							$listOfSkills[$c]['user_username'] = $userLinkObj->getUsername();
							$listOfSkills[$c]['userId'] = $userLinkObj->getId();
							$listOfSkills[$c]['userImage'] = Helper_common::getUserProfessionalPhoto( $userLinkObj->getId(), 2 );
						}
					}
				$c++ ;
				}
			}
    	}
    	$finalUsersSkillList = array();
    	if (isset($listOfSkills) && is_array($listOfSkills))
    	{
	     	foreach ($listOfSkills as $userList)
	     	{
	     		if(isset($userList['skills']))
	     		{
	     			$finalUsersSkillList[] = $userList ;
	     		}
	     	}
    	}	
    	
		if(count($finalUsersSkillList) == 0 && empty($finalUsersSkillList))
		{
			$this->view->support_skills_array = '';
		}
		else
		{
			$this->view->support_skills_array = $finalUsersSkillList;
		}
		// end of support section Redeveloped by nsingh3=================
		
		//recently viewed
		$this->view->prms = $params;
		
		
		// check privacy view profile settings
		$privacy_view_profile_setting = \Extended\privacy_settings::checkPrivacyViewProfileSettings($loggedin_user->getId());
		
		// if privacy setting for view profile is true 
		//(i.e. show my profile when i visit others profile)
		// then only recent visitors can be viewed
		if($privacy_view_profile_setting == true)
		{
		$visitors = \Extended\who_viewed_profiles::getRecentlyViewedDashboardUsers( $loggedin_user->getId() );
		
		$this->view->vistors=$visitors;
		}
    }
    
    /**
     * Used to handle ajax call
     * to set menu size in DB.
     *
     */
    public function setMainMenuSizeAction()
    {
        // action body
        $params = $this->getRequest()->getParams();
        $userid = Auth_UserAdapter::getIdentity()->getId();
		Extended\ilook_user::setMenuSize( $params['size'], $userid );
		echo Zend_Json::encode( $this->getRequest()->getParam("size") );
		die;
    }

    public function setMainMenuMoreOrLessAction()
    {
    	Helper_common::setMainMenuMoreOrLess( $this->getRequest()->getParam("is_more") );
    	die;
    }
    
    
    /**
     * Support skill of a user
     * insert record in `support_skill` table
     * 
     * @author: nsingh3
     * @var 1.0
     */    
//     public function supportAction()
//     {
//         // action body
//     	$SupporterID = Auth_UserAdapter::getIdentity()->getId();
//         $params = $this->getRequest()->getParams();
//         $user_id = $params['user_id'];
//         foreach($params['skills'] as $skill_id){
// 	       \Extended\support_skill::insertSupportSkill($skill_id, $user_id, $SupporterID);
// 	   	}
//         echo Zend_Json::encode( true );
//         die;
//     }
    
    /**
     * function used to support the skill .
     * Made for Ajax  call.
     *
     * @author nsingh3
     * @version 1.0
     *
     */
    public function supportAction()
    {
    	// action body
    	$supporter_id = Auth_UserAdapter::getIdentity()->getId();
    	$params = $this->getRequest()->getParams();
    	$skill_user_id = $params['user_id'];
    	$skill_id = $params['skill_id'];
    	if($skill_id && $skill_user_id){
			$no_of_supporters = \Extended\user_skills::supportSomebodysSkill( $supporter_id, $skill_id, $skill_user_id );
    	}
    	echo Zend_Json::encode( true );
    	die;
    }
   
        
    /**
     * Remove/Hide a contact(Link) from support section
     * 
     * @author: RSHARMA
     */
    public function RemoveFromSupportSectionAction()
    {
    	
    }
    
    /**
     * Used to search advanced results.
     * @author spatial, jsingh7
     * @version 1.1
     */
    public function searchResultsAction()
    {
		$this->view->allCountriesObj = \Extended\country_ref::getAllActiveCountries();
		$this->view->allIndustriesObj = \Extended\industry_ref::getAllActiveIndustries();

		$stripTags = Zend_Registry::get('Zend_Filter_StripTags');
		$params = $this->getRequest()->getParams();


		if (!isset($params['list_len']))
    	{
    		$params['list_len'] = 20;
    	}
    	$this->view->prms = $params;
    	$this->view->linkText = isset($params['search'])?$params['search']:'';
    	$current_user_id = Auth_UserAdapter::getIdentity()->getId();
    	
    	//Searching for every keyword.
    	if (isset($params['search']) && $stripTags->filter($params['search']))
    	{
			// removing white spaces at the beginning and end of the string
    		$keyword_r = explode(" ", preg_replace('/\s\s+/', ' ', $stripTags->filter($params['search'])));

    		$query_str = '';
    		if ($keyword_r)
    		{
    			$i = 0;
    			$new_keyword_r = array();
    			foreach( $keyword_r as $wordd )
    			{
					//\w+ matches 1 or more word characters (i.e., [a-zA-Z0-9_]).
    				$refined_word = preg_replace( "/\W+/", '', $wordd );
    				if( $refined_word )
    				{
    					$new_keyword_r[] = $refined_word;
    				}
    			}
    			
    			$words = count($new_keyword_r);
    			foreach ( $new_keyword_r as $word )
    			{
    				$query_str .= 'first_name:'.$word.'*';
    				$query_str .= ' OR last_name:'.$word.'*';
    				if(++$i !== $words)
    				{
    					$query_str .= " OR ";
    				}
    			}
    			
    			
    			if( $query_str )
    			{
    				//Fetching records of users who has been blocked.
					$blocked_user_ids_arr = array();
		
					//Gettting users I have blocked.
					$blocking_records = \Extended\blocked_users::getUsersBlockedByUserA( $current_user_id );
					if( $blocking_records )
					{
						foreach ( $blocking_records as $blocking_record )
						{	
							$blocked_user_ids_arr[$blocking_record->getIlookUserr()->getId()] = $blocking_record->getIlookUserr()->getId();
							$blocked_user_ids_arr[$blocking_record->getIlookUser()->getId()] = $blocking_record->getIlookUser()->getId();
						}
					}
					
			
					//Gettting users who blocked me.
					$blocking_records = \Extended\blocked_users::getUsersWhoBlockedUserA( $current_user_id );
					if( $blocking_records )
					{
						foreach ( $blocking_records as $blocking_record )
						{
							$blocked_user_ids_arr[$blocking_record->getIlookUser()->getId()] = $blocking_record->getIlookUser()->getId();
							$blocked_user_ids_arr[$blocking_record->getIlookUserr()->getId()] = $blocking_record->getIlookUserr()->getId();
						}
					}
			
					//Removing current/login user from array.
					unset($blocked_user_ids_arr[$current_user_id]);

    				$links = \Extended\ilook_user::getUsersForLuceneQuery( $query_str, null, TRUE, $blocked_user_ids_arr );

    			}
    			else
    			{
    				$messages = new \Zend_Session_Namespace ( 'messages' );
    				$messages->warningMsg = "Try using with simpler keyword(s).";
    				$links=array();
    			}
    		}
    		else
    		{
    			$links=array();
    		}	
    	}
    	else
    	{
    		$links=array();
    	}
    	 
    	$this->view->links=$links;
    	//------ PAGINATION -------
    	if($links)
    	{
    		$paginator = Zend_Paginator::factory($links);
    		$paginator->setItemCountPerPage(@$params['list_len']);
    		$paginator->setCurrentPageNumber(@$params['page']);
    		$this->view->paginator=$paginator;
    	}
    }
    
    /**
     * Saves data to wall post.
     * Triggered with ajax call.
     * 
     * @author jsingh7
     * @author sjaiswal
     * @version 1.1
     */
	public function postOnWallAction()
    {
    
    	$privacy = 1;
    	switch ( $this->getRequest()->getParam('privacy') )
    	{
    		case 1:
    		$privacy = \Extended\wall_post::VISIBILITY_CRITERIA_PUBLIC;
    		break;
    		
    		case 2:
    		$privacy = \Extended\wall_post::VISIBILITY_CRITERIA_LINKS;
    		break;
    		
    		case 3:
    		$privacy = \Extended\wall_post::VISIBILITY_CRITERIA_LINKS_OF_LINKS;
    		break;
    	}
    	
    	$zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
    	
    	if( @$this->getRequest()->getParam("is_url") ) //Sharing a link on wall.
    	{
    	
    		$url_data = array();
    		$url_data['url_title'] = $this->getRequest()->getParam("url_title");
    		$url_data['url_content'] = $this->getRequest()->getParam("url_content");
    		$url_data['image_src'] = $this->getRequest()->getParam("image_src");
    		$url_data['url'] = $this->getRequest()->getParam("url");
    		$url_data['post_data'] = trim($this->getRequest()->getParam("post_data"));
    		
    		
    		$result = \Extended\wall_post::post_url( 
    										Helper_common::makeHyperlinkClickable( $zend_filter_obj->filter( $this->getRequest()->getParam('post_data') )),
    										json_encode($url_data),
						    				$this->getRequest()->getParam('privacy'),
						    				Auth_UserAdapter::getIdentity()->getId(),
						    				Auth_UserAdapter::getIdentity()->getId(),
						    				Auth_UserAdapter::getIdentity()->getId(),
						    				\Extended\wall_post::POST_UPDATE_TYPE_LINK,
						    				\Extended\wall_post::POST_TYPE_MANUAL,
    										'',
    										\Extended\wall_post::WALL_TYPE_PROFESSIONAL,
    										$this->getRequest()->getParam('post_tag')
    												);
    	}
    	/* else if ( @$this->getRequest()->getParam("is_profile_url") ) //Sharing a profile url.
    	{
    		$profile_url_data = array();
    		$profile_url_data['shared_profile_user_id'] = $this->getRequest()->getParam("profile_share_user_id");
    		$profile_url_data['url'] = PROJECT_URL."/".PROJECT_NAME.'profile/iprofile/id/'.$this->getRequest()->getParam("profile_share_user_id");
    		$result = \Extended\wall_post::post_url(
					    				'<a href="'.PROJECT_URL."/".PROJECT_NAME.'profile/iprofile/id/'.$this->getRequest()->getParam("profile_share_user_id").'" target="_blank">'.PROJECT_URL."/".PROJECT_NAME.'profile/iprofile/id/'.$this->getRequest()->getParam("profile_share_user_id").'</a>',
					    				json_encode($profile_url_data),
					    				\Extended\wall_post::VISIBILITY_CRITERIA_LINKS,
					    				Auth_UserAdapter::getIdentity()->getId(),
					    				Auth_UserAdapter::getIdentity()->getId(),
					    				Auth_UserAdapter::getIdentity()->getId(),
					    				\Extended\wall_post::POST_UPDATE_TYPE_PROFILE_LINK,
					    				\Extended\wall_post::POST_TYPE_MANUAL
					    				);
    	} */
    	else //Sharing simple text on wall.
    	{
    		$result = \Extended\wall_post::post_text(
											Helper_common::makeHyperlinkClickable($this->getRequest()->getParam('post_data')),
											$this->getRequest()->getParam('privacy'),
											Auth_UserAdapter::getIdentity()->getId(), 
											Auth_UserAdapter::getIdentity()->getId(), 
											Auth_UserAdapter::getIdentity()->getId(), 
											\Extended\wall_post::POST_UPDATE_TYPE_TEXT, 
											\Extended\wall_post::POST_TYPE_MANUAL,
    										'',
    										\Extended\wall_post::WALL_TYPE_PROFESSIONAL,
    										$this->getRequest()->getParam('post_tag')
											);
    	}	
    	if( $result )
		{
			$temp_r = array();
			$temp_r['wallpost_id'] = $result['wallpost_id'];
			$temp_r['user_id'] = Auth_UserAdapter::getIdentity()->getId();
			$temp_r['fname'] = Auth_UserAdapter::getIdentity()->getFirstname();
			$temp_r['lname'] = Auth_UserAdapter::getIdentity()->getLastname();
			$temp_r['user_type'] = Auth_UserAdapter::getIdentity()->getUser_type();
			$temp_r['user_image'] = Helper_common::getUserProfessionalPhoto(Auth_UserAdapter::getIdentity()->getId(),3);
			$temp_r['gender'] = Auth_UserAdapter::getIdentity()->getGender();
			$temp_r['wall_post_text'] = $result['wallpost_text'];
			$temp_r['created_at'] = $result['created_at'];
			$temp_r['privacy'] = $this->getRequest()->getParam('privacy');
			$temp_r['post_tag_id'] = $this->getRequest()->getParam('post_tag');
			$temp_r['is_ok_comment_share_pannel_visible'] = \Helper_common::is_ok_comment_share_pannel_visible( $privacy, Auth_UserAdapter::getIdentity()->getId(), array (Auth_UserAdapter::getIdentity()->getId()), Auth_UserAdapter::getIdentity()->getId() );
			
			if( $this->getRequest()->getParam("is_url") )
			{				
				$temp_r['post_update_type'] = \Extended\wall_post::POST_UPDATE_TYPE_LINK;
			}
			else
			{
				$temp_r['post_update_type'] = \Extended\wall_post::POST_UPDATE_TYPE_TEXT;
			}
					
			if( @$this->getRequest()->getParam("is_url") )
			{	
				$temp_r['url_data']['url_title'] = $url_data['url_title'];
				$temp_r['url_data']['url_content'] = $url_data['url_content'];
				$temp_r['url_data']['image_src'] = $url_data['image_src'];
				$temp_r['url_data']['url'] = $url_data['url'];
				$temp_r['url_data']['post_data'] = $url_data['post_data'];
			}
			else if( @$this->getRequest()->getParam("is_profile_url") )
			{
				$shared_profile_user_obj = \Extended\ilook_user::getRowObject( $this->getRequest()->getParam("profile_share_user_id") );
				
				switch ( $shared_profile_user_obj->getGender() ) {
					case 1:
					$him = "him";
					break;
					case 2:
					$him = "her";
					break;
					
					default:
					$him = "him";
					break;
				}
				
				$temp_r['url_data']['url_title'] = $shared_profile_user_obj->getFirstname()." ".$shared_profile_user_obj->getLastname();
				$temp_r['url_data']['url'] = $profile_url_data['url'];
				$temp_r['url_data']['url_content'] = "Check out ".$temp_r['url_data']['url_title']." professional Profile and Connect with ".$him." on iLook.";
				$temp_r['url_data']['image_src'] = Helper_common::getUserProfessionalPhoto( $this->getRequest()->getParam("profile_share_user_id"), 2 );
			}
			else 
			{
				$temp_r['url_data'] = "";
			}
			
			
			echo Zend_Json::encode( $temp_r );
		}
		else 
		{
			echo Zend_Json::encode( 0 );			
		}
		die;
    }
    
    /**
     * Returns wall posts for the user.
     * 
     *@author jsingh7,
     *@author sjaiswal
     *@version 1.1
     */
    public function getMyWallAction()
    {   
    	echo Zend_Json::encode( 
    			\Extended\wall_post::getUserWall_lite( 
    			Auth_UserAdapter::getIdentity()->getId() , 
    			$this->getRequest()->getParam("offset"), 
    			10,
    			\Extended\wall_post::WALL_TYPE_PROFESSIONAL,
    			'',
    			$this->getRequest()->getParam('tag_id') ) );
    	die;
    }
    
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
     * Add comment for the wallpost
     * and related photo.
     * Also increaments comment count
     * in wallpost and socialisephoto
     * table.
     * Used for ajax call.
     *
     * @author jsingh7,sjaiswal
     * @version 1.1
     * @return json.
     */
    public function addCommentToTheWallpostAndRelatedPhotoAction()
    {
    	try {
    		//getting the wall post object.
    		$wall_post_obj = \Extended\wall_post::getRowObject( $this->getRequest()->getParam( 'wallpost_id' ) );
    	
    		if( $wall_post_obj )
			{
	    		//Making a entry to like table for wallpost.
	    		$filterObj = Zend_Registry::get('Zend_Filter_StripTags');
	    		$comm_text = $filterObj->filter($this->getRequest()->getParam( 'comment' ) );
	    		$comment_on_wallpost_id = \Extended\comments::addComment( $comm_text, Auth_UserAdapter::getIdentity()->getId(), NULL, $wall_post_obj->getId() );
	    		
	    		$comments_obj = \Extended\comments::getRowObject( $comment_on_wallpost_id );
	    
	    		//setting like count for wall post.
	    		$comment_count = \Extended\wall_post::commentCountIncreament( $wall_post_obj->getId() );
	    
	    		$ret_r = array();
	    		$ret_r['comm_id'] = $comment_on_wallpost_id;
	    		$ret_r['comm_text'] = $comm_text;
	    		$ret_r['commenter_id'] = Auth_UserAdapter::getIdentity()->getId();
	    		$ret_r['commenter_fname'] = Auth_UserAdapter::getIdentity()->getFirstname();
	    		$ret_r['commenter_lname'] = Auth_UserAdapter::getIdentity()->getLastname();
	    		$ret_r['commenter_small_image'] = Helper_common::getUserProfessionalPhoto(Auth_UserAdapter::getIdentity()->getId(), 3);
	    		$ret_r['comment_count'] = $comment_count;
	    		$ret_r['wp_id'] = $wall_post_obj->getId();
	    		$ret_r['created_at'] = Helper_common::nicetime( $comments_obj->getCreated_at()->format( "Y-m-d H:i:s" ));
	    		
	    	
	    		//gathering information for sending email to user on whom post, comment is done.
	    		$subject = "iLook - New comment on your post";
	    		$msg='';
	    		/* $msg = "<p style='margin:20px 20px 0 0; padding:0; font-size:14px; font-family:Arial, Helvetica, sans-serif; color:#3a3a3a'>
	    		".ucfirst($ret_r['commenter_fname'])." ".ucfirst($ret_r['commenter_lname'])." commented on your <a href='".PROJECT_URL.'/'.PROJECT_NAME.'post/detail/id/'.$ret_r['wp_id'].'/uid/'.$wall_post_obj->getWall_postsFrom_user()->getId()."'>Post.</a></p>
	    		<p style='margin:20px 20px 0 0; padding:0; font-size:14px; font-family:Arial, Helvetica, sans-serif; color:#3a3a3a'>
	    		 <b>'".$ret_r['comm_text']."'</b>
	    		</p>"; */
	    		$msg = "<p style='margin:20px 20px 0 0; padding:0; font-size:14px; font-family:Arial, Helvetica, sans-serif; color:#3a3a3a'>
	    		".ucfirst($ret_r['commenter_fname'])." ".ucfirst($ret_r['commenter_lname'])." commented on your <a href='".PROJECT_URL.'/'.PROJECT_NAME.'post/detail/id/'.$ret_r['wp_id']."'>Post.</a></p>
	    		<p style='margin:20px 20px 0 0; padding:0; font-size:14px; font-family:Arial, Helvetica, sans-serif; color:#3a3a3a'>
	    		 <b>'".$ret_r['comm_text']."'</b>
	    		</p>";
	    		$recipient_name = ucfirst($wall_post_obj->getWall_postsFrom_user()->getFirstname())." ".ucfirst($wall_post_obj->getWall_postsFrom_user()->getLastname());
	    		$recipient_email = $wall_post_obj->getWall_postsFrom_user()->getEmail();

	    		
	    		// check if user is not commenting on his own post, only then mail will be sent
	    		if(Auth_UserAdapter::getIdentity()->getId() != $wall_post_obj->getWall_postsFrom_user()->getId())
	    		{
		    		//sending email to user on whom post comment is done
		    		\Email_Mailer::sendMail($subject,
		    				$msg,
		    				$recipient_name,
		    				$recipient_email,
		    				array(),
		    				"iLook Team",
		    				Auth_UserAdapter::getIdentity()->getEmail(),
		    				"Hello ",
		    				"Thank you");
	    		}
	    		echo Zend_Json::encode($ret_r);
			}
			else
			{
				//Photo doesnot exist.
				echo Zend_Json::encode(2);
			}	
    
    	} catch (Exception $e) {
    
    		echo Zend_Json::encode(0);
    	}
    	die;
    }
    /**
     * Returns comments for wallpost.
     * Used for ajax call for displaying comments
     * and again called when to show more comments.
     *
     * @author jsingh7
     * @version 1.0
     */
    public function getCommentsForWallpostAction()
    {
    	$params = $this->getRequest()->getParams();
    	//Get users blocked and users who have blocked logged in user.
    	$blocked_user = \Extended\blocked_users::getAllBlockersAndBlockedUsers(Auth_UserAdapter::getIdentity()->getId());
    	echo Zend_Json::encode( \Extended\comments::getCommentsForWallpost(\Auth_UserAdapter::getIdentity()->getId(), $params['wallpost_id'], $params['offset'], 10, $blocked_user) );
    	die;
    }
    /**
     * Used for edit the comment.
     *
     * @author jsingh7
     */
    public function editCommentAction()
    {
    	 
    	$params = $this->getRequest()->getParams();
    	
    	
    	$zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
    	$comment_text_filtered = $zend_filter_obj->filter( $params['comment_text'] );
    	
    	echo Zend_Json::encode( \Extended\comments::editCommentOfDashboardWallpost( $params['comment_id'], $comment_text_filtered ) );
    	die;
    }
    
    /**
     * Used for deleting the comment.
     * Delete rocords regarding comments from following tables:
     * 1.Comments
     * 2.wallpost
     * 3.users_comments_visibility
     *
     * @author Sunny Patial
     */
    public function deleteCommentAction()
    {
    	if( $this->getRequest()->getParam('wallpost_id') &&  $this->getRequest()->getParam('comment_id') )
    	{
    		$is_deleted = \Extended\comments::deleteDashboardWallComments( $this->getRequest()->getParam('comment_id'), Auth_UserAdapter::getIdentity()->getId() );
    		
    		if( $is_deleted )
    		{
    			//setting comment count for wall post.
    			$comment_on_wallpost_count = \Extended\wall_post::commentCountDecreament( $this->getRequest()->getParam('wallpost_id') );
    			//setting comment count for photo
    		  
    		}
    		//removing hidden comment records.
    		\Extended\users_comments_visibility::unhideComment( $this->getRequest()->getParam('comment_id') );
    
    		if( $is_deleted && $comment_on_wallpost_count )
    		{
    			echo Zend_Json::encode( 1 );
    		}
    		else
    		{
    			echo Zend_Json::encode( 0 );
    		}
    	}
    	else
    	{
    		echo Zend_Json::encode( 0 );
    	}
    	die;
    }
    
    /**
     * Adds like for the wallpost.
     * Also increaments like count
     * in wallpost
     * table.
     * Used for ajax call.
     *
     * @author dsingh
     * @version 1.0
     * @return json.
     */
    public function okTheWallpostAction()
    {
    	try {
    
    		//getting the wall post object.
    		$wall_post_obj = \Extended\wall_post::getRowObject( $this->getRequest()->getParam( 'wallpost_id' ) );
    		if( $wall_post_obj )
    		{	
	    		//Making a entry to like table for wallpost.
	    		$result = \Extended\likes::setOrUnsetOK( Auth_UserAdapter::getIdentity()->getId(), 0, $wall_post_obj->getId() );
	    
	    		if( $result == "wallpost_ok_added.")
	    		{
		    		//setting like count for wall post.
		    		\Extended\wall_post::likeCountIncreament( $wall_post_obj->getId() );
	    		}	
	    		
	    		//fetching likers string.
	    		$ret_arr = array();
	    		$ret_arr['likers_string'] = Helper_common::getLikersStringByWallpostId($this->getRequest()->getParam( 'wallpost_id' ), Auth_UserAdapter::getIdentity()->getId());
	    		$ret_arr['wallpost_id'] = $this->getRequest()->getParam( 'wallpost_id' );
	    		$ret_arr['is_success'] = 1;
	    		
	    		echo Zend_Json::encode($ret_arr);
    		}
    		else
    		{
    			//Post doesnot exist.
    			$ret_arr = array();
    			$ret_arr['is_success'] = 2;
    			echo Zend_Json::encode($ret_arr);
    		}		
    
    	} catch (Exception $e) {
    		
    		$ret_arr = array();
    		$ret_arr['is_success'] = 0;
    		echo Zend_Json::encode($ret_arr);
    	}
    	die;
    }
    
    
    /**
     *  Post/share wallpost on wall taking forward Master/original post information.
     *	The new post created takes values from imidiate wallpost in case no originl wallpost column exist 
     *	else take values of original/master wallpost.
     *
     *  In some cases(of shared posts) root wallpost may not eixist as this relation was developed on later stages. 
     *  
     * @author Dalip
     * @author hkaur5 ( changed some part of function )
     */
    public function shareFromWallAction()
    {
    	
    	$prms = $this->getRequest()->getParams();
    	
        $zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
      	$privacy = $prms['privacysett'];
      	
      	$old_text = isset($prms['old_text'])?$prms['old_text']:NULL;
     	$new_text = $zend_filter_obj->filter($prms['new_text']);
     //   $from_user = $prms['from_user'];
      
        $wallpost_id = $prms['wallpost_id'];//parent wallpost.
        $post_update_type = $prms['post_update_type'];
        
        
        $parent_wallpost_obj = \Extended\wall_post::getRowObject($wallpost_id);
        if( ! $parent_wallpost_obj )
        {
        	//Wallpost Doesnot exist.
        	echo Zend_Json::encode( 2 );
        	die;
        }	
        
     	$to_user = Auth_UserAdapter::getIdentity()->getId();
     	
     	$em = \Zend_Registry::get('em');
     	
     	$owner_of_original_wallpost_obj = $parent_wallpost_obj->getwall_postsFrom_user();

     	 switch ( $privacy )
     	 {
     	 	case 1:
     	 		$privacy = \Extended\wall_post::VISIBILITY_CRITERIA_PUBLIC;
     	 		break;
     	 
     	 	case 2:
     	 		$privacy = \Extended\wall_post::VISIBILITY_CRITERIA_LINKS;
     	 		break;
     	 
     	 	case 3:
     	 		$privacy = \Extended\wall_post::VISIBILITY_CRITERIA_LINKS_OF_LINKS;
     	 		break;
     	 }
     	 
		if( $post_update_type == \Extended\wall_post::POST_UPDATE_TYPE_LINK || $post_update_type == \Extended\wall_post::POST_UPDATE_TYPE_SHARED_LINK )
		{
			$result = \Extended\wall_post::post_url(
					$new_text,
					$parent_wallpost_obj->getLink_data(),
					$privacy, 
					$to_user, 
					$to_user,
					$owner_of_original_wallpost_obj->getId(),
					\Extended\wall_post::POST_UPDATE_TYPE_SHARED_LINK,
					\Extended\wall_post::POST_TYPE_MANUAL,
					null,
					\Extended\wall_post::WALL_TYPE_PROFESSIONAL,
					null,
					$parent_wallpost_obj->getId()
				);
		}
		else if( $post_update_type == \Extended\wall_post::POST_UPDATE_TYPE_PROFILE_LINK || $post_update_type == \Extended\wall_post::POST_UPDATE_TYPE_SHARED_PROFILE_LINK )
		{
			$result = \Extended\wall_post::post_url(
					$new_text,
					$parent_wallpost_obj->getLink_data(),
					$privacy,
					$to_user,
					$to_user,
					$owner_of_original_wallpost_obj->getId(),
					\Extended\wall_post::POST_UPDATE_TYPE_SHARED_PROFILE_LINK,
					\Extended\wall_post::POST_TYPE_MANUAL,
					null,
					\Extended\wall_post::WALL_TYPE_PROFESSIONAL,
					null,
					$parent_wallpost_obj->getId()
			);
		}
     	else if( $post_update_type == \Extended\wall_post::POST_UPDATE_TYPE_TEXT || $post_update_type == \Extended\wall_post::POST_UPDATE_TYPE_SHARED_TEXT )
     	{	
     		
     	 	$result = \Extended\wall_post::post_text(
	     	 		$new_text, 
	     	 		$privacy, 
	     	 		$to_user,
	     	 		$to_user,
	     	 		$owner_of_original_wallpost_obj->getId(), 
	     	 		\Extended\wall_post::POST_UPDATE_TYPE_SHARED_TEXT,
	     	 		\Extended\wall_post::POST_TYPE_MANUAL,
	     	 		null,
	     	 		\Extended\wall_post::WALL_TYPE_PROFESSIONAL,
     	 			null,
     	 			$parent_wallpost_obj->getId()
     	 		);
     	}
     	
     	$udpateShareCount = \Extended\wall_post::shareCountIncreament($wallpost_id);
     	$addNewShare = \Extended\share::addShareInfo($to_user, $wallpost_id);
   
     	  
     	 if( $result )
     	 {
     	
     	 	
     	 	$new_wallpost_obj = \Extended\wall_post::getRowObject( $result['wallpost_id'] );
     	 	$temp_r = array();
     	 	$temp_r['wallpost_id'] =  $result['wallpost_id'];
     	 	
     	 	if( $post_update_type == \Extended\wall_post::POST_UPDATE_TYPE_PROFILE_LINK || $post_update_type == \Extended\wall_post::POST_UPDATE_TYPE_SHARED_PROFILE_LINK ):
     	 	$link_data = Zend_Json::decode( $new_wallpost_obj->getLink_data() );
     	 	$shared_profile_user_id = $link_data['shared_profile_user_id'];
     	 	
     	 	$shared_profile_user_obj = \Extended\ilook_user::getRowObject( $shared_profile_user_id );
     	 	
     	 	switch ( $shared_profile_user_obj->getGender() ) {
     	 		case 1:
     	 			$him = "him";
     	 			break;
     	 		case 2:
     	 			$him = "her";
     	 			break;
     	 				
     	 		default:
     	 			$him = "him";
     	 			break;
     	 	}
     	 	
     	 	$temp_r['link_data']['url_title'] = $shared_profile_user_obj->getFirstname()." ".$shared_profile_user_obj->getLastname();
     	 	$temp_r['link_data']['url_content'] = "Check out ".$temp_r['link_data']['url_title']."'s professional Profile and Connect with ".$him." on iLook.";
     	 	$temp_r['link_data']['image_src'] = \Helper_common::getUserProfessionalPhoto( $shared_profile_user_obj->getId(), 2 );
     	 	
     	 	else:
     	 	$temp_r['link_data'] = Zend_Json::decode( $new_wallpost_obj->getLink_data() );
     	 	endif;
     	 	
     	 	$temp_r['user_id'] = Auth_UserAdapter::getIdentity()->getId();
     	 	$temp_r['fname'] = Auth_UserAdapter::getIdentity()->getFirstname();
     	 	$temp_r['lname'] = Auth_UserAdapter::getIdentity()->getLastname();
     	 	$temp_r['user_type'] = Auth_UserAdapter::getIdentity()->getUser_type();
     	 	$temp_r['user_image'] = Helper_common::getUserProfessionalPhoto($temp_r['user_id'], 3);
     	 	$temp_r['gender'] = Auth_UserAdapter::getIdentity()->getGender();
     	 	$temp_r['wall_post_text'] = $new_text;
     	 	$temp_r['is_url'] = $this->getRequest()->getParam("is_url");
     	 	// Data related root user i.e user of original wallpost from where sharing initiated. From_user = from_user of original post.
     	 	$temp_r['from_user_fullname'] = $owner_of_original_wallpost_obj->getFirstname().' '.$owner_of_original_wallpost_obj->getLastname();
     	 	$temp_r['from_user_image'] = Helper_common::getUserProfessionalPhoto($owner_of_original_wallpost_obj->getId(), 3);
     	 	$temp_r['from_user_id'] = $owner_of_original_wallpost_obj->getId();
     	 	$temp_r['from_user_user_type'] = $owner_of_original_wallpost_obj->getUser_type();
     	 	$temp_r['from_user_is_deleted'] =$owner_of_original_wallpost_obj->getDeleted_at()?1:0;
     	 	$temp_r['from_user_wall_text'] = $parent_wallpost_obj->getWall_post_text();
     	 	$temp_r['from_user_wall_text'] = $parent_wallpost_obj->getWall_post_text();
     	 	$temp_r['from_user_wallpost_created_at'] = \Helper_common::nicetime( $parent_wallpost_obj->getCreated_at()->format("Y-m-d H:i:s") );
     	 	//----------------------------------------------------------------------------------
     	 	
    // 	 	$temp_r['from_user_post_created_at'] = \Helper_common::nicetime( $parent_wallpost_obj()->getCreated_at()->format("Y-m-d H:i:s") );
     	 
     	 	$temp_r['url_data'] = "";
     	 	$temp_r['created_at'] = $result['created_at'];
     	 	$temp_r['privacy'] = $privacy;
     	 	$temp_r['is_ok_comment_share_pannel_visible'] = \Helper_common::is_ok_comment_share_pannel_visible( $privacy, Auth_UserAdapter::getIdentity()->getId(), array(Auth_UserAdapter::getIdentity()->getId()), Auth_UserAdapter::getIdentity()->getId() );
     	 	$temp_r['sharers_string']['string'] = \Helper_common::getSharerStringforPost($result['wallpost_id'],Auth_UserAdapter::getIdentity()->getId());
     	 	$temp_r['sharers_string']['shared_from_wallpost_exist'] = true;
     	 
     	 	echo Zend_Json::encode( $temp_r );
     	 }
     	 else
     	 {
     	 	echo Zend_Json::encode( 0 );
     	 } 
     	 die;
    }

    /**
     * Fetch photofeed info for ajax call
     *
     * @author jsingh7
     *
     */
    public function getDashboardInfoAction()
    {	
    	$params = $this->getRequest()->getParams();
    	$result = \Extended\wall_post::getWallpostInfo( $params['wallpost_id'] );
    	if( $result )
    	{
    		echo Zend_Json::encode( $result );
    	}
    	else
    	{
//     		wallpost doesnot exist.
    		echo Zend_Json::encode( 2 );
    	}
    	die;
    }
    
    /**
     *  Call getWallpostInfo($wallpost_id)
     *  Here we will check post type and then decide if it is
     * 	root/original or child/shared.
     * 	if it is shared wallpost then 
     *  get its root wallpost and pass its id to getWallpostInfo instead of wallpost_id we are
     *  getting from params.
     *  
     *  @return json_encoded array
     *  @abstract Use it to get info of wallpost in case you want to get info of root wallpost.
     *  @author hkaur5 
     */
    public function getInfoOfOriginalWallpostAction()
    {
    	$wallpost_id =  $this->getRequest()->getParam('wallpost_id');
    	
    	$wallpost_obj = \Extended\wall_post::getRowObject($wallpost_id);


    	//In case of shared wallposts.
    	if( $wallpost_obj->getPost_update_type() == 6
    		||$wallpost_obj->getPost_update_type() == 7
    			)
    	{
    		if($wallpost_obj->getShared_from_wallpost())
    		{
    			$result = \Extended\wall_post::getWallpostInfo( $wallpost_obj->getShared_from_wallpost()->getId() );
    		}
    		else
    		{
    			$result = \Extended\wall_post::getWallpostInfo( $wallpost_id );
    			
    		}
    	}
    	//In case of normal wallpost
    	else
    	{
    		$result = \Extended\wall_post::getWallpostInfo( $wallpost_id );

    	}
    	
    	//Send response to ajax function
    	if( $result )
    	{
    		echo Zend_Json::encode( $result );
    	}
    	else
    	{
    		//wallpost doesnot exist.
    		echo Zend_Json::encode( 2 );
    	}
    	die;
    }
    
    /**
     * Removes like for the wallpost
      * Also decrements like count
     * in wallpost 
     * table.
     * Used for ajax call.
     *
     * @author dsingh
     * @version 1.0
     * @return json.
     */
    public function notOkTheWallpostAction()
    {
    	try {
    
    		//getting the wall post object.
    		$wall_post_obj = \Extended\wall_post::getRowObject( $this->getRequest()->getParam( 'wallpost_id' ) );
    
    		if( $wall_post_obj )
    		{
	    		//Making/removing a entry to like table for wallpost.
	    		$result = \Extended\likes::setOrUnsetOK( Auth_UserAdapter::getIdentity()->getId(), 1, $wall_post_obj->getId() );
	    
	     		if( $result == "wallpost_ok_deleted." )
	     		{	
	    			//setting like count for wall post.
	    			\Extended\wall_post::likeCountDecreament( $wall_post_obj->getId() );
	     		}	
	     		
	     		//fetching likers string.
	     		$ret_arr = array();
	     		$ret_arr['likers_string'] = Helper_common::getLikersStringByWallpostId($this->getRequest()->getParam( 'wallpost_id' ), Auth_UserAdapter::getIdentity()->getId());
	     		$ret_arr['wallpost_id'] = $this->getRequest()->getParam( 'wallpost_id' );
	     		$ret_arr['is_success'] = 1;
	     		
	    		echo Zend_Json::encode($ret_arr);
    		}
    		else
    		{
    			//Post doest not exist.
    			$ret_arr = array();
    			$ret_arr['is_success'] = 2;
    			echo Zend_Json::encode($ret_arr);
    		}	
    
    	}
    	catch (Exception $e) 
    	{
    		
    		$ret_arr = array();
    		$ret_arr['is_success'] = 0;
    		echo Zend_Json::encode($ret_arr);
    	}
    	die;
    }
    
    /**
     * get-who-shared-wall 
     * this action is use for shared popup listing
     * @author nsingh3
     */
    
    public function getWhoSharedWallAction()
    {
    	$params = $this->getRequest()->getParams();
    die;
    }
    

    public function changePrivacyOfWallpostAction()
    {
    	$params = $this->getRequest()->getParams();
    	$result_r = \Extended\wall_post::changeWallpostPrivacy( $params['wallpost_id'], $params["privacy_to_set"] );
    	echo Zend_Json::encode($result_r);
    	die;
    }
    
    /**
     * This action is for ajax call, to delete wallpost
     * on dashboard wall.
     * 
     * @author jsingh7
     */
    public function deleteWallpostAction()
    {
    	
    	if( \Extended\wall_post::deleteWallpost( $this->getRequest()->getParam('wallpost_id') ) )
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
     * Used to update wallpost text.
     * Made for ajax call.
     * 
     * @author jsingh7
     */
    public function updateWallpostTextAction()
    {
    	$params = $this->getRequest()->getParams();
    	
    	$zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
    	
    	$ret_arr = array();
    	if( isset($params['update_photo_text']) )
    	{
    		$result = \Extended\socialise_photo::updatePhotoDesc( $params['wallpost_id'], $params['wallpost_text'] );
	    	$ret_arr['wallpost_id'] = $result['wallpost_id'];
	    	$ret_arr['wallpost_text'] = $result['photo_desc'];
    	}
    	else
    	{
    		$result = \Extended\wall_post::updateWallpostText( $params['wallpost_id'], $params['wallpost_text'] );
	    	$ret_arr['wallpost_id'] = $result['wallpost_id'];
	    	$ret_arr['wallpost_text'] = $result['wallpost_text'];
    	}
    	
    	if( $ret_arr ):
    		echo Zend_Json::encode($ret_arr);
    	else:
    		echo Zend_Json::encode(0);
    	endif;
    	die;
    }
    
    /**
     * Function used to share wall link to individual emails.
     * 
     * [The name of function is not appropriate.] 
     * 
     * @author spatial
     * @author sjaiswal
     * @author hkaur5 ( album part )
     * @author jsingh7 ( Shared text on wall is not getting shared to individual. Fixed. )
     * @version 1.1
     */
    public function sendWallLinkToIndividualEmailsAction()
    {
    	$prms = $this->getRequest()->getParams();
    	$zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
    	
    	$for_album = FALSE;
    	$subject = "Status Updates";
    	$shareMSG  = $zend_filter_obj->filter($prms["share_text_msg"]);
    	$c_userID = Auth_UserAdapter::getIdentity()->getId();
    	$c_userObj = \Extended\ilook_user::getRowObject($c_userID);
    	$c_username = $c_userObj->getFirstname()." ".$c_userObj->getLastname();
    	$album_id = null;
    	// This case will be executed in case when albums such as default,
    	// cover photo, profile photos are shared to individual/send as mail.
    	$for_album = isset( $prms['for_album'] ) ? $prms['for_album']:NULL;
    	if($for_album)
    	{
    		$album_id = $prms["wallpost_id"];
    	}
    	else
    	{
	    	$resultArr = \Extended\wall_post::getWallpostInfo($prms["wallpost_id"]);
    	}
    	$is_my_wallpost = "";
    	$userArr = explode(",",$prms["receiver_id"]);
    	$filteredArr = array_unique($userArr);
    	
    	
    	for( $i=0; $i<count($filteredArr); $i++)
    	{
    		$userObj = \Extended\ilook_user::getRowObject($filteredArr[$i]);
    		$msg_receiver = $userObj->getFirstname()." ".$userObj->getLastname();
    		$usrIDArr = array($filteredArr[$i]);
    		$iMailMsg = Helper_common::getWallpostTemplateForMail(
														    	$c_username,
												    			$msg_receiver,
														    	$shareMSG,
    															$prms["wallpost_id"], 
    															$album_id
    															);
    		$wallpostarray = \Extended\wall_post::getWallpostInfo($prms["wallpost_id"]);
    		$messageArray = array('wallpost_detail'=>$wallpostarray);
    		//print_r($iMailMsg);die;
    		$content_json = Zend_Json::encode ( $messageArray );
    		$result = Helper_common::sendMessage($c_userID, $usrIDArr, $subject, $iMailMsg, Extended\message::MSG_TYPE_GENERAL, NULL, false, null, 1,null, null, null, $resultArr["wallpost_id"],11,null,null,null,$content_json);
    		//GCM implementation--added by ptripathi
/*     		$aboutUserId = Auth_UserAdapter::getIdentity()->getId();
    		$text = "has shared a status update with you.";
    		$notificationType = 10;
    		$forUserId = $filteredArr[$i];
    		\Helper_gcm::addGcmNotifOnUserActions($aboutUserId,$text,$notificationType,$forUserId); */
    		
    		// Record admin activity log for share post with individual(dasboard and socialise)
    		if(\Zend_Registry::get('admin_logged_in_as_user'))
    		{
    			if($result)
    			{
    				if($resultArr["wallpost_wall_type"] == 1)
    				{
    					\Extended\admin_activity_log::addAdminActivityLog(\Zend_Registry::get('admin_logged_in_as_user'), \Auth_UserAdapter::getIdentity()->getId(), \Extended\admin_activity_log::MODULE_DASHBOARD);
    				}
    				else if ($resultArr["wallpost_wall_type"] == 2)
    				{
    					\Extended\admin_activity_log::addAdminActivityLog(\Zend_Registry::get('admin_logged_in_as_user'), \Auth_UserAdapter::getIdentity()->getId(), \Extended\admin_activity_log::MODULE_DISPLAY);
    				}
    					
    			}
    		}
    	}
    	
     	echo Zend_Json::encode ( TRUE );
     	die;
    }
    
    /**
     * Send Post content in report abuse mail after fetching template for post
     * using getWallpostTemplateForMail
     * 
     * @author hkaur5
     *  $params content_json added by vimal2524 to save json format of wallpost
     * @version 1.0
     */
    public function sendReportAbuseMailAction()
    {
    	$prms = $this->getRequest()->getParams();
    	$zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
    	
    	$for_album = FALSE;
    	$subject = "Report Abuse";
    
    	
    	$logged_in_user_id = Auth_UserAdapter::getIdentity()->getId();
    	$logged_in_user_Obj = \Extended\ilook_user::getRowObject($logged_in_user_id);
    	$logged_in_user_name = $logged_in_user_Obj->getFirstname()." ".$logged_in_user_Obj->getLastname();
    	$album_id = null;
    	$userObj = \Extended\ilook_user::getRowObject($prms["receiver_id"]);
    	$msg_receiver = $userObj->getFirstname()." ".$userObj->getLastname();
    	$receiver_user_id_arr = array($prms["receiver_id"]);
    	
    	if($zend_filter_obj->filter($prms["report_abuse_msg"]) == "")
    	{
    		$report_abuse_msg  = "Hi ".$msg_receiver.', '.$logged_in_user_name." does not like the content you have posted.";
    	}
    	else 
    	{
    		$report_abuse_msg  = $zend_filter_obj->filter($prms["report_abuse_msg"]);
    	}
    	$iMailMsg = Helper_common::getWallpostTemplateForMail(
														    	$logged_in_user_name,
												    			$msg_receiver,
														    	$report_abuse_msg,
    															$prms["wallpost_id"], 
    															$album_id
    															);
    	$wallpostarray = \Extended\wall_post::getWallpostInfo($prms["wallpost_id"]);
    	$messageArray = array('wallpost_detail'=>$wallpostarray);
    	//print_r($iMailMsg);die;
    	$content_json = Zend_Json::encode ( $messageArray );
    		
    	$result = Helper_common::sendMessage(
    										$logged_in_user_id, 
							    			$receiver_user_id_arr, 
							    			$subject, 
							    			$iMailMsg, 
							    			Extended\message::MSG_TYPE_GENERAL, 
							    			NULL, 
							    			false, 
							    			null, 
							    			1,
							    			null, 
							    			null, 
							    			null, 
							    			null,
							    			11,
							    			null, 
							    			null,
							    			$prms["wallpost_id"],
    										$content_json);
    	
    	if($result)
    	{
     		echo Zend_Json::encode ( TRUE );
    	}
    	else
    	{
     		echo Zend_Json::encode ( FALSE );
    	}
     	die;
    }
    
    public function validationTestAction()
    {
    	
    }
    
    /**
     * used for ajax call.
     * echo json of users who liked post
     *
     * @author jsingh7
     * @author hkaur5
     * @version 1.0
     */
    public function getWhoLikePostAction()
    {
    	$user_info = array();
    	if($this->getRequest()->getParam( 'wallpost_id' ))
    	{
    		if( \Extended\wall_post::getRowObject( $this->getRequest()->getParam( 'wallpost_id' ) ))
    		{
		    	$ppl_who_liked = \Extended\likes::getUserslikedWallpostOrAlbumOrPhoto( $this->getRequest()->getParam( 'wallpost_id' ),
		    																			null,
																		    			null,
																		    			$this->getRequest()->getParam( 'limit' ),
																		    			$this->getRequest()->getParam( 'offset' ));
		    	if($ppl_who_liked)
		    	{
			    	foreach( $ppl_who_liked['data'] as $key=>$user_who_liked )
			    	{
			    		$mutual_arr=\Extended\ilook_user::getMutualLinks(\Auth_UserAdapter::getIdentity()->getId(), $user_who_liked->getLikesLiked_by()->getId());
						$mutualFrdsCount = count($mutual_arr);
						if(\Auth_UserAdapter::getIdentity()->getId() == $user_who_liked->getLikesLiked_by()->getId()){
							$user_info[$key]["mutual_count"] =  "Me";
						}
						else{
							$user_info[$key]["mutual_count"] =  $mutualFrdsCount;
							
						}
						$user_info[$key]["user_id"] = $user_who_liked->getLikesLiked_by()->getId();
						$user_info[$key]["user_image"] = \Helper_common::getUserProfessionalPhoto($user_who_liked->getLikesLiked_by()->getId(), 3);			
						$user_info[$key]["user_full_names"] = $user_who_liked->getLikesLiked_by()->getFirstname()." ".$user_who_liked->getLikesLiked_by()->getLastname();
						$user_info[$key]["link_info"] = \Extended\link_requests::getFriendRequestState( $user_who_liked->getLikesLiked_by()->getId() );
			    	}
// 			    	For view more records option 
			    	$result = array('user_info'=>$user_info, 'is_more_records'=>$ppl_who_liked['is_more_records']);
			    	echo Zend_Json::encode( $result );
		    	}
		    	else
		    	{
		    		echo Zend_Json::encode( 0 );
		    	}
    		}
    		else
    		{
    			echo Zend_Json::encode( 0 );
    		}
    	}
    	else
    	{
    		echo Zend_Json::encode( 0 );
    	}
    	
    	
    	die;
    }
    
    
    /**
     *
     * @author spatial
     * @since 1 Aug, 2013
     * @version 1.0
     *
     */
    public function cancelRequestAction()
    {
    	$params = $this->getRequest()->getParams();
    
    	// link request id. object
    	// 		cancel_request = request_id.
    	$accept_req_obj=\Extended\link_requests::getRowObject($params["cancel_request"]);
    
    	// if record present into the database.
    	if($accept_req_obj)
    	{
    		// Profile Owner links listing using ,
    		$profileOwnerLinksListing=$accept_req_obj->getLink_requestsSenderUser()->getLink_list();
    		// Profile Owner user id...
    		$profileOwnerID=$accept_req_obj->getLink_requestsSenderUser()->getId();
    			
    			
    		// Visitor links listing using ,
    		$visitorLinksListing=$accept_req_obj->getLink_requestsRecieverUser()->getLink_list();
    		// Visitor user id...
    		$visitorID=$accept_req_obj->getLink_requestsRecieverUser()->getId();
    			
    			
    		// Generate array from visitor links listing. Explode with ,
    		$visitorLinksArr=explode( ",", $visitorLinksListing );
    			
    		if(in_array($profileOwnerID, $visitorLinksArr))
    		{
    			// search Profile Owner ID from Visitor links listing array
    			$indexCompleted = array_search($profileOwnerID, $visitorLinksArr);
    			// Remove Profile Owner ID from Visitor links listing array
    			unset($visitorLinksArr[$indexCompleted]);
    			// Implode new listing for visitor listing.. using ,
    			$visitorLinksListing=implode(",", $visitorLinksArr);
    		}
    			
    		// Generate array from Profile Owner links listing. Explode with ,
    		$profileOwnerLinksArr=explode(",",$profileOwnerLinksListing);
    			
    		if(in_array($visitorID, $profileOwnerLinksArr))
    		{
    			// search Visitor ID from Profile Owner links listing array
    			$indexCompleted = array_search($visitorID, $profileOwnerLinksArr);
    			// Remove Visitor ID from ProfileOwner links listing array
    			unset($profileOwnerLinksArr[$indexCompleted]);
    			// Implode new listing for Profile Owner listing.. using ,
    			$profileOwnerLinksListing=implode(",", $profileOwnerLinksArr);
    		}
    			
    		// remove row from link_request table.
    		$delete_request = \Extended\link_requests::deleteRequest($params);
    			
    		if( $delete_request == 1 )
    		{
    			// request canceled by "requested" user..
    			echo Zend_Json::encode($delete_request);
    		}
    		else if( $delete_request == 2 )
    		{
    			// for request accepted by user... now we can't canceled request by requesting user.
    			echo Zend_Json::encode($delete_request);
    		}
    		// for unlink the links
    		else if( $delete_request == 3 )
    		{
    			$final_arr=array($profileOwnerID=>$profileOwnerLinksListing,$visitorID=>$visitorLinksListing);
    			$result=\Extended\ilook_user::updateRequestedLinks($final_arr);
    			if($result){
    				$currentUser=Auth_UserAdapter::getIdentity()->getId();
    				$TagsExist=\Extended\link_tags::getAssignedTags($currentUser, $params["profileID"]);
    				$tagsarr=array();
    				$removeLinks=\Extended\link_tags::removeAllTags($currentUser,$params["profileID"],$tagsarr);
    					
    				// Zend_Debug::dump($params["profileID"]);
    				// 					$start = microtime(true);
    				\Extended\socialise_photo_custom_privacy::deleteViewerfromCustomViewersList($currentUser, $params['profileID']);
    				// 					echo $time_elapsed_us = microtime(true) - $start;
    				// 					die;
    				echo Zend_Json::encode($delete_request);
    			}
    		}
    	}
    	// if no record present into the database.
    	else
    	{
    		$userObj = \Extended\ilook_user::getRowObject($params["profileID"]);
    		$userName = ucwords($userObj->getFirstname()." ".$userObj->getLastname());
    		$cancel_request = array("requestStatus"=>"already canceled","uname"=>$userName);
    		echo Zend_Json::encode($cancel_request);
    	}
    	die;
    }
    
    /**
     * This function used to invite the other users
     * @author spatial
     * @since 1 Aug, 2013
     * @version 1.0
     *
     */
    public function inviteToConnectAction()
    {
    	$params=$this->getRequest()->getParams();
    	$link_request_type = \Extended\link_requests::LINK_REQUEST_TYPE_VIA_ILOOK;
    	$request_user=Auth_UserAdapter::getIdentity()->getId();
    	$request_arr = array();
    	$request_arr['link_request_type'] = $link_request_type;
    	$request_arr['request_user_id'] = $request_user;
    	$request_arr['accept_user_id'] = $params["accept_user"];
    	$send_link_request = \Extended\link_requests::sendRequest($request_arr);
    	if($send_link_request["request-status"]=="already sent"){
    		$userObj = \Extended\ilook_user::getRowObject($params["accept_user"]);
    		$userName = ucwords($userObj->getFirstname()." ".$userObj->getLastname());
    		$request = array("requestID"=>$send_link_request,"requestStatus"=>"already sent invitation","uname"=>$userName);
    		echo Zend_Json::encode($request);
    	}
    	else{
    		echo Zend_Json::encode($send_link_request);
    	}
    	die;
    }
    
    /**
     * This function used to accept the link request

     * @author Sunny Patial
	 * @author ssharma4[replace Extended(link_request::accept_request) function call to common function call]
     * @version 1.2
     *
     */
    public function acceptRequestAction()
    {
    	$params=$this->getRequest()->getParams();
		//Save acceptance,add notification record & add link to roster.
		$accept_request = \Helper_links::add($params["accept_request"]);
		//Get details so that can clear user buddylist from localstorage.
		$accepterObj = \Extended\ilook_user::getRowObject(Auth_UserAdapter::getIdentity()->getId());
		// if no record present in the database.
		if( !$accept_request )
		{
			$userObj = \Extended\ilook_user::getRowObject($params["profileID"]);
			$userName = $userObj->getFirstname()." ".$userObj->getLastname();
			$accept_request = array("requestStatus"=>"already cancelled", "uname"=>$userName ,"accepter" => $accepterObj->getUsername());
		}
		else
		{
			$accept_request = array("accept_request"=>$accept_request ,"accepter" => $accepterObj->getUsername());
		}
    
    	echo Zend_Json::encode( $accept_request );
    	die;
    }
    
    /**
     * used for ajax call.
     * Fetches record of users who has shared photo and 
	 * sends user info array to ajax call.
     * echo json of users who shard wallpost.
     * @author jsingh7
     * @author hkaur5
     * @version 1.0
     */
    public function getWhoSharedPostAction()
    {
    	$user_id_arr = array();
    	$user_info = array();
    	$is_more_records = "";
    	
    	//Creating string which contain logged_in_user's links and user himself.============
    	//When only links of logged in user is required.
    	if($this->getRequest()->getParam('logged_in_user_id')!== null
    			&& $this->getRequest()->getParam('logged_in_user_id')!="undefined"
    			&& $this->getRequest()->getParam('logged_in_user_id')!= false)
    	{
    		$link_list_str = \Extended\ilook_user::getRowObject($this->getRequest()->getParam('logged_in_user_id'))->getLink_list();
    		
    		if($link_list_str)
    		{
    			$link_list_str .= ','.$this->getRequest()->getParam('logged_in_user_id');
    		}
    		else
    		{
    			$link_list_str .= $this->getRequest()->getParam('logged_in_user_id');
    		}
    		
    	}
    	else
    	{
    		$link_list_str = null;
    	}
    	 
    	//===================================================================================
    	if($this->getRequest()->getParam( 'wallpost_id' )){
    		if( \Extended\wall_post::getRowObject( $this->getRequest()->getParam( 'wallpost_id' ) ))
    		{
    			$ppl_who_shared = \Extended\share::getDistinctUserRecordsByWallpostIdOrALbumIdOrPhotoId($this->getRequest()->getParam( 'wallpost_id' ),1, $link_list_str);
    			$limit = $this->getRequest()->getParam( 'limit');
    			$offset = $this->getRequest()->getParam( 'offset');
    			
    			//Applying offset and limit on users record.
    			if($offset != null)
    			{
    				$user_record_sliced = array_slice( $ppl_who_shared, $offset, $limit );
	    			
    				//Find is more record available by applying nxt_offset.
	    			$is_more_records = array_slice( $ppl_who_shared, ($offset+$limit));
// 	    			Zend_Debug::dump($ppl_who_shared);
// 	    			echo $offset+$limit;
// 	    			Zend_Debug::dump($is_more_records) ;
// 	    			die;
    			}
    			else
    			{
    				$user_record_sliced = $ppl_who_shared;
    			}
    			foreach ($user_record_sliced as $rec)
    			{
    				$user_id_arr[] = $rec['user_id'];
    			}
    			
    			//implode ids of users_who_shared_post.
    			$user_ids_str = implode(',', $user_id_arr);
    			
    			//Get object of users_who_shared_post.
 				$user_obj = Extended\ilook_user::getUsersByUserIdString($user_ids_str);
    			if($user_obj){
    				foreach( $user_obj as $key=>$user )
    				{
    					$mutual_arr=\Extended\ilook_user::getMutualLinks(\Auth_UserAdapter::getIdentity()->getId(), $user->getId());
    					$mutualFrdsCount = count($mutual_arr);
    					if(\Auth_UserAdapter::getIdentity()->getId() == $user->getId()){
    						$user_info[$key]["mutual_count"] =  "Me";}
    					else{
    						$user_info[$key]["mutual_count"] =  $mutualFrdsCount;}
    					$user_info[$key]["user_id"] = $user->getId();
    					$user_info[$key]["user_image"] = \Helper_common::getUserProfessionalPhoto($user->getId(), 3);
    					$user_info[$key]["user_full_names"] = $user->getFirstname()." ".$user->getLastname();
    					$user_info[$key]["link_info"] = \Extended\link_requests::getFriendRequestState( $user->getId() );
    				}
    				$result = array('user_info'=>$user_info, 'is_more_records'=>count($is_more_records));
    				echo Zend_Json::encode( $result );
    			}
    			else{
    				echo Zend_Json::encode( 0 );}
    		}
    		else{
    			echo Zend_Json::encode( 0 );}
    	}
    	else{
    		echo Zend_Json::encode( 0 );}
    	die;
    }
    
    
    /**
     * This function used to send Report abuse to admin
     * @author spatial
     * @author sjaiswal
     * @since 5 Aug, 2013
     * @version 1.1
     */
	public function abuseReportAction()
    {
    	
    	$params=$this->getRequest()->getParams();
    	$current_user_id = Auth_UserAdapter::getIdentity()->getId();
    	$em = \Zend_Registry::get('em');
    	$wallpost_owner_info = $em->find('\Entities\ilook_user',$params["wallpost_owner_id"]);
//     	$wallpost_owner_info = \Extended\ilook_user::getRowObject($params["wallpost_owner_id"]);
    	$wallpost_owner_fullname = $wallpost_owner_info->getFirstname()." ".$wallpost_owner_info->getLastname();
    	\Extended\report_abuse::addAbuseReport($current_user_id,$params["post_id"],$params["wallpost_owner_id"]);
    	$wallInfo=Extended\wall_post::getRowObject($params["post_id"]);
    	          
 
    	$userName = Auth_UserAdapter::getIdentity()->getFirstname()." ".Auth_UserAdapter::getIdentity()->getLastname();
    	$msg='';
    	$msg = "<p style='margin:20px 20px 0 0; padding:0; font-size:14px; font-family:Arial, Helvetica, sans-serif; color:#3a3a3a'>
    				A wall post has been reported abuse.
    			</p>
	    		<p style='margin:20px 20px 0 0; padding:0; font-size:14px; font-family:Arial, Helvetica, sans-serif; color:#3a3a3a'>
	    			".$wallpost_owner_fullname."'s wall post has been reported abuse by ".$userName.".
	    		</p>";
    			
    	$subject="iLook - A wall post has been reported abuse";
    	$result=Email_Mailer::sendMail ( $subject, $msg, "Admin", 'reportabuse@ilook.net', array(), "iLook Team","","Hello ","Best Regards");
    	if($result){
    		$msg=array("msg"=>"success");
    	}
    	echo Zend_Json::encode($msg); 
    	die;
    }
	/**
	 * To get openfire credentials if user exist in openfire.
	 * @author ssharma4
	 * @version 1.0
	 * @date 09_aug_16
	 */
    public function getOpenfireCredentialsAction()
	{
		$user_obj = \Extended\ilook_user::getRowObject(Auth_UserAdapter::getIdentity()->getId());

		try {

			$openFireMain = new Openfire\Main();

			if(!$openFireMain->isUserExist( $user_obj->getUsername())) {
				$openfirePassword = Helper_common::generatePassword(10);
				//creating user on openfire.
				$openFireMain->createUser(
					['username' => $user_obj->getUsername(),
						'password' => base64_encode($openfirePassword),
						'name' => $user_obj->getFirstname() . ' ' . $user_obj->getLastname(),
						'email' => $user_obj->getEmail()
					]
				);

			}
			// Fetch user details if user exist on openfire.
			$openfireObj = \Extended\chat_settings::getRowObject(
				['ilookUser' => Auth_UserAdapter::getIdentity()->getId()]);
			$openfireCredentialArr =array();
			if($openfireObj){
				$openfireCredentialArr['username'] = $openfireObj->getIlookUser()->getUsername();
				$openfireCredentialArr['password'] = base64_decode($openfireObj->getOpenfire_password());
				echo Zend_Json::encode($openfireCredentialArr);
			}else {
				echo Zend_Json::encode(false);
			}


		} catch (\Exception $e){

			Helper_common::logInfo($e, 'red');
		}


		die;
	}
	/**
	 * get buddies details using lucene indexing
	 * @author ssharma4
	 * @version 1.0
	 */
	public function fetchRosterBuddiesProfilePicAction()
	{
		$params	=	$this->getRequest()->getParams();
		$links 	=	array();

		if (isset($params['myBuddyUsernames'])) {

			foreach ($params['myBuddyUsernames'] as $buddyusername) {

				$query_str = 'username:'.$buddyusername;
				$buddyData = \Extended\ilook_user::getUsersForLuceneQuery(
					$query_str,
					null,
					null,
					null,
					true,
					false
				);
				if ($buddyData) {

					$links[$buddyusername] =Helper_common::getUserProfessionalPhoto($buddyData[0]->getId(), 3);
				}
			}
		}

		echo Zend_Json::encode($links);die;
	}
}
