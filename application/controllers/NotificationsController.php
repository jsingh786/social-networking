<?php

class NotificationsController extends Zend_Controller_Action
{
	/**
	 * This function checks auth storage and
	 * manage redirecting.
	 *
	 * @author jsingh7
	 * @version 1.0
	 * @see Zend_Controller_Action::preDispatch()
	 *
	 *
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
	
    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
        // action body
    }

    public function getNotificationsAction()
    {
    	$notificationObj = \Extended\notifications::getLatestSixNotificationsForUser( Auth_UserAdapter::getIdentity()->getId(), 6 );
    	$blocked_users = \Extended\blocked_users::getAllBlockersAndBlockedUsers(Auth_UserAdapter::getIdentity()->getId());
    	$notification_arr = array();
    	$i = 0;
    	if($notificationObj['notifications'])
    	{
			foreach( $notificationObj['notifications'] as  $notification )
			{
				$notification_arr['data'][$i]['id'] = $notification->getId();
				$notification_arr['data'][$i]['text'] = $notification->getNotification_text();
				$notification_arr['data'][$i]['notification_for'] = $notification->getForIlookUser()->getFirstname()." ". $notification->getForIlookUser()->getLastname();
				$notification_arr['data'][$i]['notification_for_id'] = $notification->getForIlookUser()->getId();
				$notification_arr['data'][$i]['notification_about'] = $notification->getAboutIlookUser()->getFirstname()." ".$notification->getAboutIlookUser()->getLastname();
				$notification_arr['data'][$i]['notification_about_id'] = $notification->getAboutIlookUser()->getId();
				$notification_arr['data'][$i]['type'] = $notification->getNotificationType()->getname();
				$notification_arr['data'][$i]['type_id'] = $notification->getNotificationType()->getId();
				$notification_arr['data'][$i]['time'] = Helper_common::nicetime_3($notification->getTime_stamp()->format("Y-m-d H:i"));
				$notification_arr['data'][$i]['about_user_image'] =  Helper_common::getUserProfessionalPhoto( $notification->getAboutIlookUser()->getId(), 3, false, $blocked_users );
				$notification_arr['data'][$i]['is_read'] =  $notification->getIs_read();
				$notification_arr['data'][$i]['notification_id'] =  $notification->getId();
				$notification_arr['data'][$i]['wallpost_id'] =  $notification->getWallpost_id();
				
				//Getting object of associated socialise photo.
				if($notification->getSocialize_photo_id())
				{
					$socialise_photo_obj = \Extended\socialise_photo::getRowObject( $notification->getSocialize_photo_id() );
					
					if( $socialise_photo_obj )
					{
						//Get image name from socialise_photo object.
						$socialise_photo_name = $socialise_photo_obj->getImage_name();
						$notification_arr['data'][$i]['photo_name'] =  $socialise_photo_name;
						
						//Get socialise album name from socialise_photo object
						$socialise_album_name = $socialise_photo_obj->getSocialise_photosSocialise_album()->getAlbum_name();
						$album_created_at = $socialise_photo_obj->getSocialise_photosSocialise_album()->getCreated_at_timestamp()->getTimestamp();
						if( strtolower($socialise_album_name) == strtolower(\Extended\socialise_album::DEFAULT_ALBUM_NAME)
							||strtolower($socialise_album_name) == strtolower(\Extended\socialise_album::PROFILE_PHOTOS_ALBUM_NAME )
							||strtolower($socialise_album_name) == strtolower(\Extended\socialise_album::COVER_PHOTOS_ALBUM_NAME ) )
						{
							$notification_arr['data'][$i]['album_name'] = $socialise_album_name;
						}
						else
						{
							$notification_arr['data'][$i]['album_name'] = $socialise_album_name.'_'.$album_created_at;
						}
						
						//Get socialise photo's owner id.
						$socialise_photo_owner_id = $socialise_photo_obj->getsocialise_photosPosted_by()->getId();
						$notification_arr['data'][$i]['socialise_photo_owner_id'] = $socialise_photo_owner_id;
					}
					else 
					{
						$notification_arr['data'][$i]['photo_name'] = "";
					}
				}
				else
				{
					$notification_arr['data'][$i]['photo_name'] = "";
				}
				
				//Get information for socialise album associated with notification.
				if(($notification->getNotificationType()->getId() == 23 
					||$notification->getNotificationType()->getId() == 24
					||$notification->getNotificationType()->getId() == 25 )
					&&($notification->getSocialize_album_id() != null))
				{
				
					$socialise_album_obj = \Extended\socialise_album::getRowObject($notification->getSocialize_album_id());
					$notification_arr['data'][$i]['album_owner_id'] = $socialise_album_obj->getSocialise_albumIlook_user()->getId();
					$notification_arr['data'][$i]['album_id'] = $notification->getSocialize_album_id();
				}
				
	// 			if( $notification->getIs_read() ==0 )
	// 			{
	// 				Extended\notifications::readNotification($notification->getId());
	// 			}
				$i++;
			}
    	}
		
		$notification_arr['count']['unread_notifications'] = \Extended\notifications::countUnreadNotificationOfUser( Auth_UserAdapter::getIdentity()->getId() );
		
		$notification_arr['count']['unseen_notifications'] = \Extended\notifications::countUnSeenNotificationOfUser( Auth_UserAdapter::getIdentity()->getId() );
		$notification_arr['is_more_notifications'] = $notificationObj['is_more_notifications'];
		echo Zend_Json::encode($notification_arr);
		die;
    }

    /**
     * Set notification is_read status to read.
     * @author hkaur5
     *
     */
    public function setNotificationStatusReadAction()
    {
		$id = $this->getRequest()->getParam('id');
		if($id)
		{
// 		foreach( $data as $notification_id)
// 			{
				$result = \Extended\notifications::readNotification($id);
// 			}
		}
		$unread_notification_arr = array();
		$unread_notification_count = \Extended\notifications::countUnreadNotificationOfUser( Auth_UserAdapter::getIdentity()->getId() );
		$unread_notification_arr ['unread_notifications'] = $unread_notification_count[0]['num_of_rows'];
		echo Zend_Json::encode($unread_notification_arr);
		die;
    }
    
    
    /**
     * Set notification is_seen status to seen(ie. 1).
     * @author sjaiswal
     * @version 1.0
     *
     */
    public function setGeneralNotificationSeenAction()
    {
    	
    	if(Auth_UserAdapter::getIdentity()->getId())
    	{
    		$result = \Extended\notifications::seenNotification(Auth_UserAdapter::getIdentity()->getId());
    	}
    	$unseen_notification_arr = array();
    	$unseen_notification_count = \Extended\notifications::countUnseenNotificationOfUser( Auth_UserAdapter::getIdentity()->getId() );
    	$unseen_notification_arr ['unseen__notifications'] = $unseen_notification_count[0]['num_of_rows'];
    	//GCM implementation--added by ptripathi
    	$aboutUserId = Auth_UserAdapter::getIdentity()->getId();
    	$text = "";
    	$notificationType = \Helper_gcm::UNSEEN_NOTIFICATION_COUNT_TYPE;
    	$forUserId = Auth_UserAdapter::getIdentity()->getId();
    	\Helper_gcm::create($aboutUserId,$text,$notificationType,$forUserId);
    	
    	//APNS implementation
    	$em = \Zend_Registry::get('em');
    	    	$message = array(
					'notification_type' => $notificationType
			);
    	$silent = true;
    	$notification_count_array = \Extended\notifications::countUnSeenNotificationOfUser( Auth_UserAdapter::getIdentity()->getId() );
    	$notification_count = $notification_count_array[0]['num_of_rows'];
    	
    	$NotificationsForUserObj =  $em->find('\Entities\ilook_user', $forUserId );
/*     	$device_token = array($NotificationsForUserObj->getDevice_token());
    	\Helper_apns::pushnotificationApns($device_token,$message,$aboutUserId,$notification_count,$silent);  */
    	//check if OS_X device token not empty--foreach on tokens
    	$OS_X_device_token_value = $NotificationsForUserObj->getOS_X_device_token();
    	if(!empty($OS_X_device_token_value)){
    		$OS_X_device_token_array = explode(',',$OS_X_device_token_value);
    		//$device_token = array($NotificationsForUserObj->getDevice_token());
    		foreach ($OS_X_device_token_array as $key=>$val){
    			// applying condition for not running this code on localhost
    			$front = \Zend_Controller_Front::getInstance();
    			if($front->getRequest()->getHttpHost() != 'localhost' 
					&& $front->getRequest()->getHttpHost() != 'localhost:8080' 
					)
    			{
    				\Helper_apns::pushnotificationApns($val, $message,$aboutUserId,$forUserId,$notification_count,$silent);
    			}
    		}
    	
    	}
    	
    	echo Zend_Json::encode($unseen_notification_arr);
    	die;
    }
	/**
	 * Get notification of logged in user grouped by date.
	 * 
	 * @author nsingh3, hkaur5
	 * @version 1.0
	 */
    public function viewAllNotificationsAction()
    {
    	$notificationObj = \Extended\notifications::getNotifications( Auth_UserAdapter::getIdentity()->getId(), 10, 0 );
    	$notification_arr = array();
    	if($notificationObj['notifications'])
    	{
    		foreach ($notificationObj['notifications'] as $key=>$notificationDetail)
    		{
				$notificationDate = $notificationDetail->getDatee ()->format ( 'F d' );
				if( $notificationDate == date('F d') )
				{
					$notificationDate = "Today";
				}
				if( $notificationDate == date( 'F d', strtotime("-1 days") ) )
				{
					$notificationDate = "Yesterday";
				}
				$notification_arr [$notificationDate] [$key] ["id"] = $notificationDetail->getId();
				$notification_arr [$notificationDate] [$key] ["is_read"] = $notificationDetail->getIs_read();
				$notification_arr [$notificationDate] [$key] ["about_user"] = $notificationDetail->getAboutIlookUser ()->getFirstname () . " " . $notificationDetail->getAboutIlookUser ()->getLastname ();
				$notification_arr [$notificationDate] [$key] ["for_user"] = $notificationDetail->getForIlookUser ()->getFirstname () . " " . $notificationDetail->getforIlookUser ()->getLastname ();
				$notification_arr [$notificationDate] [$key] ["about_user_id"] = $notificationDetail->getAboutIlookUser ()->getId();
				$notification_arr [$notificationDate] [$key] ["about_user_username"] = $notificationDetail->getAboutIlookUser ()->getUsername();
				$notification_arr [$notificationDate] [$key] ["for_user_id"] = $notificationDetail->getForIlookUser ()->getId();
				$notification_arr [$notificationDate] [$key] ["datee"] = $notificationDetail->getdatee ()->format( 'F d' );
				$notification_arr [$notificationDate] [$key] ["time_stamp"] = $notificationDetail->getTime_stamp ()->format ( 'h:i' );
				$notification_arr [$notificationDate] [$key] ["type"] = $notificationDetail->getNotificationType ()->getId();
				$notification_arr [$notificationDate] [$key] ["text"] =  $notificationDetail->getNotification_text();
				$notification_arr [$notificationDate] [$key] ["notification_date"] =  $notificationDate;
				$notification_arr [$notificationDate] [$key] ["wallpost_id"] =  $notificationDetail->getWallpost_id();
// 				if(  $notificationDetail->getIs_read() == 0 )
// 				{
// 					Extended\notifications::readNotification( $notificationDetail->getId());
// 				}
    		}
    		$unread_notifications_count = \Extended\notifications::countUnreadNotificationOfUser( Auth_UserAdapter::getIdentity()->getId() );
    		$this->view->uread_notifications = $unread_notifications_count[0]['num_of_rows'];
    		$this->view->allNotifications = $notification_arr;
    		$this->view->is_more_notifications = $notificationObj['is_more_notifications'];
    		$this->view->offset = $notificationObj['offset'];
    		    	/* echo "<pre>";
  				Zend_Debug::dump( $notificationObj);
    				die (); */
    	}
    	else
    	{
    		$this->view->allNotifications = '';
    	}
    	
    }
    /**
     * Get more notifications according to given offset and limit.
     * @author hkaur5
     */
    public function viewMoreNotificationsAction()
    {	
      	$notificationObj = \Extended\notifications::getNotifications( Auth_UserAdapter::getIdentity()->getId(), 10, $this->getRequest()->getParam('offset') );
    	$notification_arr = array();
    	if($notificationObj['notifications'])
    	{
    		foreach ($notificationObj['notifications'] as $key=>$notificationDetail)
    		{
				
    			$notificationDate = $notificationDetail->getDatee ()->format ( 'F d' );
				if( $notificationDate == date('F d') )
				{
					$notificationDate = "Today";
				}
				if( $notificationDate == date( 'F d', strtotime("-1 days") ) )
				{
					$notificationDate = "Yesterday";
				}
				$notification_arr [$notificationDate] [$key] ["id"] = $notificationDetail->getId();
				$notification_arr [$notificationDate] [$key] ["is_read"] = $notificationDetail->getIs_read();
				$notification_arr [$notificationDate] [$key] ["about_user"] = $notificationDetail->getAboutIlookUser ()->getFirstname () . " " . $notificationDetail->getAboutIlookUser ()->getLastname ();
				$notification_arr [$notificationDate] [$key] ["for_user"] = $notificationDetail->getForIlookUser ()->getFirstname () . " " . $notificationDetail->getforIlookUser ()->getLastname ();
				$notification_arr [$notificationDate] [$key] ["about_user_id"] = $notificationDetail->getAboutIlookUser ()->getId();
				$notification_arr [$notificationDate] [$key] ["for_user_id"] = $notificationDetail->getForIlookUser ()->getId();
				$notification_arr [$notificationDate] [$key] ["datee"] = $notificationDetail->getdatee ()->format ( 'Y-m-d' );
				$notification_arr [$notificationDate] [$key] ["time_stamp"] = $notificationDetail->getTime_stamp ()->format ( 'h:i' );
				$notification_arr [$notificationDate] [$key] ["type"] = $notificationDetail->getNotificationType()->getId();
				$notification_arr [$notificationDate] [$key] ["text"] =  $notificationDetail->getNotification_text();
				$notification_arr [$notificationDate] [$key] ["notification_date"] =  $notificationDate;
				$notification_arr [$notificationDate] [$key] ["wallpost_id"] =  $notificationDetail->getWallpost_id();
				
// 				if(  $notificationDetail->getIs_read() == 0 )
// 				{
// 					Extended\notifications::readNotification( $notificationDetail->getId());
// 				}
    		}
    		$unread_notifications_count_arr = \Extended\notifications::countUnreadNotificationOfUser( Auth_UserAdapter::getIdentity()->getId() );
    		$unread_notifications_count = $unread_notifications_count_arr[0]['num_of_rows'];
    		$result = array( 'notifications'=>$notification_arr, 'is_more'=>$notificationObj['is_more_notifications'],'unread_notifications_count'=>$unread_notifications_count );
    	}
    	else
    	{
    		$result  = '';
    	}
		echo Zend_Json::encode($result);
		die;
    }
    
   
    /**
     * Send notifications on ok the wallpost or photo
     * @author hkaur5
     */
    public function sendOkNotificationAction()
    {
    	//getting the wall post object.
    	$params = $this->getRequest()->getParams();
    	if($params['wallpost_id'])
    	{
	    	//getting the wall post object.
	    	$wall_post_obj = \Extended\wall_post::getRowObject($params['wallpost_id']);
	    	 
	    	if(is_object($wall_post_obj))
	    	{
	    		switch($wall_post_obj->getWall_type())
	    		{
	    			case 1:
	    			$notification_type = 8;
	    			break;
	    			case 2:
	    			$notification_type = 13;
	    			break;
	    		} 
		    	
		    	//Making a entry to like table for wallpost.
		    	$result = \Extended\notifications::addNotificationsOnOkTheWallpost( Auth_UserAdapter::getIdentity()->getId(), $wall_post_obj->getId(), $notification_type );
		    	if ($result)
		    	{
		    		echo Zend_Json::encode(true);
		    	}
		    	else
		    	{
		    		echo Zend_Json::encode(false);
		    	}
	    	}
    	}
    	if($params['photo_id'])
    	{
    		$photo_obj = \Extended\socialise_photo::getRowObject( $params['photo_id'] );
    		if(is_object( $photo_obj ) )
    		{
    			//Making an entry to notification table for photo notification.
    			if(\Extended\notifications::addNotificationsOnOkThePhoto( Auth_UserAdapter::getIdentity()->getId(), $params['photo_id'], 20 ))
    			{
    				echo Zend_Json::encode(true);
    			}
    			else
    			{
    				echo Zend_Json::encode(false);
    			}
    		}
    		else
    		{
    			echo Zend_Json::encode(false);
    		}
    	}
    	if($params['album_id'])
    	{
    		$album_obj = \Extended\socialise_album::getRowObject( $params['album_id'] );
    		if(is_object( $album_obj ) )
    		{
    			//Making an entry to notification table for photo notification.
    			if(\Extended\notifications::addNotificationsOnOkTheAlbum( Auth_UserAdapter::getIdentity()->getId(), $params['album_id'] ))
    			{
    				echo Zend_Json::encode(true);
    			}
    			else
    			{
    				echo Zend_Json::encode(false);
    			}
    		}
    		else
    		{
    			echo Zend_Json::encode(false);
    		}
    	}
    	die;
    }
    /**
     * Send notifications when comment on wallpost or photo.
     * @author hkaur5
     */
    public function sendCommentNotificationAction()
    {
    	$params = $this->getRequest()->getParams();
    	
    	if($params['wallpost_id'])
    	{
    		//getting the wall post object.
	    	$wall_post_obj = \Extended\wall_post::getRowObject( $params[ 'wallpost_id' ] );
	    	if(is_object($wall_post_obj))
	    	{
	    		switch($wall_post_obj->getWall_type())
	    		{
	    			case 1:
	    			$notification_type = 9;
	    			break;
	    			case 2:
	    			$notification_type = 14;
	    			break;
	    		
	    		}
				
		    	//Making a entry to like table for wallpost.
		    	$result = \Extended\notifications::addNotificationsWhenCommentOnTheWallpost( Auth_UserAdapter::getIdentity()->getId(), $wall_post_obj->getId(), $notification_type );
	    	 
		    	if ($result)
		    	{
		    		echo Zend_Json::encode(true);
		    	}
		    	else
		    	{
		    		echo Zend_Json::encode(false);
		    	}
	    	}
    	}
    	if($params['photo_id'])
    	{
			$photo_obj = \Extended\socialise_photo::getRowObject( $params['photo_id'] );
	    	
			if( is_object($photo_obj ) )
			{
				//Making an entry to notification table for photo notification.
				if(\Extended\notifications::addNotificationsWhenCommentThePhoto( Auth_UserAdapter::getIdentity()->getId(), $params['photo_id'], 21 ))
				{
					echo Zend_Json::encode(true);
				}
				else
				{
					echo Zend_Json::encode(false);
				}
			}
			else
			{
				echo Zend_Json::encode(false);
			}
    	}
    	if($params['album_id'])
    	{
			$album_obj = \Extended\socialise_album::getRowObject( $params['album_id'] );
	    	
			if( is_object($album_obj ) )
			{
				//Making an entry to notification table for photo notification.
				if(\Extended\notifications::addNotificationsWhenCommentTheAlbum( Auth_UserAdapter::getIdentity()->getId(), $params['album_id'], 25 ))
				{
					echo Zend_Json::encode(true);
				}
				else
				{
					echo Zend_Json::encode(false);
				}
			}
			else
			{
				echo Zend_Json::encode(false);
			}
    	}
    	die;
    }
    /**
     * Send notifications when any user share wallpost/photo.
     * @author hkaur5
     */
    public function sendShareNotificationAction()
    {
    	$params = $this->getRequest()->getParams();

		if (isset($params['wallpost_id']) && $params['wallpost_id']!="")
    	{
	    	//getting the wall post object.
	    	$wall_post_obj = \Extended\wall_post::getRowObject( $params['wallpost_id'] );
	    	if(is_object($wall_post_obj))
	    	{

	    		switch($wall_post_obj->getWall_type())
	    		{
	    			case 1:
	    				$notification_type = 10;
	    				break;
	    			case 2:
	    				$notification_type = 15;
	    				break;
	    		}
		    	//Making a entry to notification table for wallpost.
		    	$result = \Extended\notifications::addNotificationsOnSharingWallpost( Auth_UserAdapter::getIdentity()->getId(), $wall_post_obj->getId(), $notification_type );

				if ($result)
		    	{
		    		echo Zend_Json::encode(true);
		    	}
		    	else
		    	{
		    		echo Zend_Json::encode(false);
		    	}
	    	}
    	}
    	else if (isset($params['photo_id']) && $params['photo_id']!="")
		{
    	    $photo_obj = \Extended\socialise_photo::getRowObject( $params['photo_id'] );
    		 
    	    if( is_object($photo_obj ) )
			{
				//Making an entry to notification table for share photo notification.
				if(\Extended\notifications::addNotificationsOnSharingThePhoto( Auth_UserAdapter::getIdentity()->getId(), $params['photo_id'], 22 ))
				{
					echo Zend_Json::encode(true);
				}
				else
				{
					echo Zend_Json::encode(false);
				}
			}
			else
			{
				echo Zend_Json::encode(false);
			}
		}
		else if (isset($params['album_id']) && $params['album_id']!="")
		{
    	    $album_obj = \Extended\socialise_album::getRowObject( $params['album_id'] );
    		 
    	    if( is_object($album_obj ) )
			{
				//Making an entry to notification table for share photo notification.
				if(\Extended\notifications::addNotificationsOnSharingTheAlbum( Auth_UserAdapter::getIdentity()->getId(), $params['album_id'], 25 ))
				{
					echo Zend_Json::encode(true);
				}
				else
				{
					echo Zend_Json::encode(false);
				}
			}
			else
			{
				echo Zend_Json::encode(false);
			}
		}
		die;
    }

}



