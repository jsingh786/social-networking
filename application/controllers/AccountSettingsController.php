<?php

class AccountSettingsController extends Zend_Controller_Action
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
     */
    public function preDispatch()
    {
		if ( !Auth_UserAdapter::hasIdentity() )
		{
			$this->_helper->redirector( 'index', 'index' );
		}
    }

    public function init(){
       
    }

    public function indexAction()
    {
        // action body
    }

    /**
     * Action for privacy phtml.
     * 
     * @author jsingh7
     * @version 1.0
     */
    public function privacyAction()
    {
    	$current_user_obj = Auth_UserAdapter::getIdentity();//Added by hkaur5
    	$params=$this->getRequest()->getParams();
    	$this->view->params = $params;
    	$this->view->logged_in_user_id = $current_user_obj->getID();
    	
    	//check if id passed in url and is of logged in user.
    	if( @$params['id'] && $params['id'] == $current_user_obj->getId())//User ID
    	{
    		$this->view->userId=$params['id'];
    	}
    	else if( !$params['id'] && $params['id'] != $current_user_obj->getId() )
    	{
    		$this->_helper->redirector ( 'is-not-available','error','default');
    	}
    	else if( $params['id'] && $params['id'] != $current_user_obj->getId() )
    	{
    		$this->_helper->redirector ( 'is-not-available','error','default');
    	}
    	
    	$blocked_users = \Extended\blocked_users::getUsersBlockedByUserA( $current_user_obj->getId() );
    	$blocked_users_arr = array();
    	if( $blocked_users )
    	{
    		foreach ( $blocked_users as $key=>$blocked_user )
    		{
    			$blocked_users_arr[$key]['id'] = $blocked_user->getIlookUserr()->getId();
    			$blocked_users_arr[$key]['name'] = $blocked_user->getIlookUserr()->getFirstname()." ".$blocked_user->getIlookUserr()->getLastname();
    			$blocked_users_arr[$key]['email'] = $blocked_user->getIlookUserr()->getEmail();
    		}
    	}
    	
    	$this->view->blocked_users = $blocked_users_arr;
    	
    	// get users albums visibility criteria
    	$get_visiblity_criteria = \Extended\socialise_album::getUsersAlbumsPrivacy ( Auth_UserAdapter::getIdentity()->getId());
    	$this->view->visiblity_criteria = $get_visiblity_criteria;
    	
    	//get data from privacy settings table
    	$get_privacy_settings = \Extended\privacy_settings::getPrivacySettingsData ( Auth_UserAdapter::getIdentity()->getId());
    	$this->view->privacy_settings = $get_privacy_settings;
    }

    /**
     * sets and updates the visibility_criteria of socialize album for current user .
     * @author hkaur5
     * !! deprecated 
     *
     */
    /*public function changePrivacyOfAllAlbumsAction()
    {
    	$params=$this->getRequest()->getParams();
    	$is_changed =  Extended\socialise_album::setAlbumsVisibility( Auth_UserAdapter::getIdentity()->getId(), $params['privacy'] );
    	if( $is_changed )
    	{
    		echo Zend_Json::encode(1);
    		die;
    	}
    	
    }*/
    
    /**
     * set privacy settings.
     * @author sjaiswal
     * @version 1.0
     */
     public function changePrivacySettingsAction()
    {
    	$params=$this->getRequest()->getParams();
    	
    	
    	// set visibility criteria for albums
    	if($params['privacy_album'] != null)
    	{
    		$is_changed =  Extended\socialise_album::setAlbumsVisibility( Auth_UserAdapter::getIdentity()->getId(), $params['privacy_album'] );
    	}
    	 
    	// check if privacy settings for view profile exist for a user
    	$privacy_settings_array = \Extended\privacy_settings::checkIlookUserIdExist(Auth_UserAdapter::getIdentity()->getId());
    	
    	
    	if($params['privacy_view_profile'] != null)
    	{
    	    // if current user record present update record else save in notification settings
	    	if($privacy_settings_array)
	    	{
	    		$privacy_settings = Extended\privacy_settings::updatePrivacySettings( Auth_UserAdapter::getIdentity()->getId(), $params['privacy_view_profile'] );;
	    	}
	    	else
	    	{
	    		$privacy_settings = Extended\privacy_settings::addPrivacySettings( Auth_UserAdapter::getIdentity()->getId(), $params['privacy_view_profile'] );
	    	}
    	}
    		
    	if( $privacy_settings || $is_changed)
    	{
    		echo Zend_Json::encode(1);
    		
    	}
    	die;
    	 
    }
 
    /**
     * Adds custom viewer id's who can view all photos of each albums of user for
     * current user.
     * @author hkaur5
     * @version 1.0 
     *
     */
    public function setCustomViewerAlbumsAction()
    {
    	$params = $this->getRequest()->getParams();
    	$custom_viewer_ids_r = explode( ",", $params['custom_viewer'] );
    	if(\Extended\socialise_album_custom_privacy::addCustomViewersOfAllAlbums( Auth_UserAdapter::getIdentity()->getId(), $custom_viewer_ids_r ))
    	{
    		echo Zend_json::encode(1);
    	}
    	else
    	{
    		echo Zend_json::encode(0);
    	}
    	die;
    }

    /**
     * Gets the links of current user.
     * @author hkaur5
     * @version 1.1
     * @see mail/get-my-links
     *
     */
    public function getMyLinksAction()
    {
    	$current_user_obj = Auth_UserAdapter::getIdentity();
    	$links_obj = Extended\ilook_user::getLinksOfUser( $current_user_obj->getId() );
    	$contacts_r = array();
    	foreach ( $links_obj as $key=>$lk )
    	{
    		$contacts_r[$key]['user_id'] = $lk->getId();
    		$contacts_r[$key]['first_name'] = $lk->getFirstname();
    		$contacts_r[$key]['last_name'] = $lk->getLastname();
    		$contacts_r[$key]['email'] = $lk->getEmail();
    		$contacts_r[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($lk->getId(), 3);
    	}
    	//Get all the contacts which are set as custom viewer of all albums of current user .
    	$custom_viewers = Extended\socialise_album_custom_privacy::getCustomViewerForAllAlbums(Auth_UserAdapter::getIdentity()->getId() );
    	//array to store custom_viewer of all albums of current user.
    	$custom_viewers_r = array();
    	
    	foreach($custom_viewers  as $key=>$custom_viewer)
    	{
    		$custom_viewers_r[$key]['user_id'] = $custom_viewer->getIlookUser()->getId();
    		
    	}
    	
    	$return_r = array();
    	$return_r['custom_set_links'] = $custom_viewers_r;
    	$return_r['all_links'] = $contacts_r;
    	if($return_r):
	    	echo Zend_json::encode($return_r);
    
    	else:
	    	echo Zend_json::encode(0);
    	endif;
    	die;
    }

    public function generalAction()
    {
    	$current_user_obj = Auth_UserAdapter::getIdentity();
    	$params=$this->getRequest()->getParams();
   		
    	//check if id passed in url and is of logged in user.
    	if( @$params['id'] && $params['id'] == $current_user_obj->getId())//User ID
    	{
    		
	    	$this->view->params = $params;
	    	$this->view->logged_in_user_id = $current_user_obj->getID();
    		$this->view->userId=$params['id'];
    		
    		$userObj = \Extended\ilook_user::getRowObject( $params['id'] );
    		
	    	$user_current_type = $userObj->getUser_type();
	    	 
	    	$this->view->user_current_type = $user_current_type;
    	}
    	
    	else if( !$params['id'] && $params['id'] != $current_user_obj->getId() )
    	{
    		$this->_helper->redirector ( 'is-not-available','profile');
    		die;
    	}
    }
    /**
     * Return response to ajax call,
     * checks count of user experience and return 1 
     * if user has any experience else return zero.
     * @author hkaur5
     * @param int logged_in_user_id
     */
    public function checkIfUserHasExperienceAction()
    {
    	$current_user_obj = Auth_UserAdapter::getIdentity();
    	if( $current_user_obj->getId() )
    	{
    		$experience_count = \Extended\experience::getUserExpCount($current_user_obj->getId());
    		
    		if($experience_count)
    		{
    			echo Zend_json::encode(1);
    			
    		}
    		else
    		{
    			echo Zend_json::encode(0);
    		}
    		die;
    	}
    }
    
    
    /**
     * Return response to ajax call,
     * checks count of user education and return 1
     * if user has any experience else return zero.
     * @author hkaur5
     * @param int logged_in_user_id
     */
    public function checkIfUserHasEducationAction()
    {
    	$current_user_obj = Auth_UserAdapter::getIdentity();
    	if( $current_user_obj->getId() )
    	{
    		$edu_count = \Extended\education_detail::getUserEduCount($current_user_obj->getId());
    
    
    		if($edu_count)
    		{
    			echo Zend_json::encode(1);
    			 
    		}
    		else
    		{
    			echo Zend_json::encode(0);
    		}
    		die;
    	}
    }
    
    /**
     * Changes user's user_type/working_status 
     * to employed, user can be previously 
     * student, recruiter or job seeker 
     * @author hkaur5
     */
    public function changeUsersTypeAction()
    {
    	$logged_in_user = Auth_UserAdapter::getIdentity()->getId();
    	$params = $this->getRequest()->getParams();
    
    	$new_user_type = \Extended\ilook_user::changeUserType( $logged_in_user, $params['selected_type'] );
    	
    	if( $new_user_type )
    	{
    		echo Zend_json::encode( $new_user_type );
    	}
    	else
    	{
    		echo Zend_json::encode( 0 );
    	}
    	die;
    }
	
	/**
	 * Action to block user, used with ajax call.
	 * 
	 * @author jsingh7
	 * @version 1.0
	 */
	public function blockUsersAction()
	{	
		$users_blocked = \Extended\blocked_users::addUsersInBlockList( $this->getRequest()->getParam('users_to_be_blocked'), Auth_UserAdapter::getIdentity()->getId() );
		
		if( $users_blocked )
		{
			echo Zend_Json::encode( $users_blocked );
		}
		else
		{
			echo Zend_Json::encode( 0 );
		}
		die;
	}

	/**
	 * Action to unblock user, used with ajax call.
	 * 
	 * @author jsingh7
	 * @version 1.0
	 */
	public function unblockUsersAction()
	{	
		$users_unblocked = \Extended\blocked_users::RemoveUsersFromBlockList( array($this->getRequest()->getParam('user_to_be_unblocked')), Auth_UserAdapter::getIdentity()->getId() );
		if( $users_unblocked )
		{
			echo Zend_Json::encode( $users_unblocked );
		}
		else
		{
			echo Zend_Json::encode( 0 );
		}
		die;
	}
	
	
	/**
	 * This function is used for notifications settings whether 
	 * email or general notifications
	 * @author sjaiswal
	 * @version 1.0
	 */
	public function notificationsAction()
	{
		$current_user_obj = Auth_UserAdapter::getIdentity();
		$params=$this->getRequest()->getParams();
		$this->view->params = $params;
		$this->view->logged_in_user_id = $current_user_obj->getID();
		 
		//check if id passed in url and is of logged in user.
		if( @$params['id'] && $params['id'] == $current_user_obj->getId())//User ID
		{
			$this->view->userId=$params['id'];
		}
		else if( !$params['id'] && $params['id'] != $current_user_obj->getId() )
		{
			$this->_helper->redirector ( 'is-not-available','profile');
		}
		
		if( $this->_request->isPost('notification_settings') )
		{
			//get post data
			$postData = $this->_request->getPost();
			$notification_settings_array = \Extended\notification_settings::checkIlookUserIdExist(Auth_UserAdapter::getIdentity()->getId());
		
			// if current user record present update record else save in notification settings
			if($notification_settings_array)
			{
			$notification_settings = \Extended\notification_settings::updateNotificationSettings ( Auth_UserAdapter::getIdentity()->getId(),$postData);
			}
			else
			{
			$notification_settings = \Extended\notification_settings::saveNotificationSettings ( Auth_UserAdapter::getIdentity()->getId(),$postData);
			}
			
			$messages = new Zend_Session_Namespace('messages');
			$messages->successMsg = "Settings updated successfully";
			
			
				
		}	
		
		//get data from notification settings table
		$get_notification_settings = \Extended\notification_settings::getNotificationSettingsData ( Auth_UserAdapter::getIdentity()->getId());
		$this->view->notification_settings = $get_notification_settings;
	}
	
	
	public function closeAccountAction()
	{
		if( \Extended\ilook_user::setAccountClosedDate( Auth_UserAdapter::getIdentity()->getId() ) ):
			echo Zend_Json::encode(1);
		else:
			echo Zend_Json::encode(0);
		endif;
		die;
	}
	
	
}





