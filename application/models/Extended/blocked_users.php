<?php
namespace Extended;
use Openfire;
/**
 * This class has been made for
 * general purpose functions.
 *
 * @author jsingh7
 * @version 1.0
 */
class blocked_users extends \Entities\blocked_users
{
	/**
	 * Pass an id and get its object
	 *
	 * @param $id
	 * @return object of that class
	 * @author jsingh7
	 * @version 1.0
	 */
	public static function getRowObject($id)
	{
		$em = \Zend_Registry::get('em');
		$obj = $em->find('\Entities\blocked_users',$id);
		return $obj;
	}
	
	/**
	 * Add users to block list for particular
	 * user and unlinking(unfriend) them.
	 * Remove user from lopgged user's roster after blocking process.
	 *
	 * @param array $users_to_be_blocked
	 * @param integer $blocker_user
	 *
	 * @return array [ array of blocked user ]
	 * @author jsingh7
	 * @author ssharma4
	 * @version 1.1
	 */
	public static function addUsersInBlockList( $users_to_be_blocked, $blocker_user )
	{
		$em = \Zend_Registry::get('em');
		$blocked_users_arr = array();

		foreach ( $users_to_be_blocked as $key=>$user_to_be_blocked )
		{
			//Only block user x if not block by user y before.
			if( ! self::checkIfBlocked($blocker_user, $user_to_be_blocked) )
			{
				$user_to_be_blocked_obj = \Extended\ilook_user::getRowObject( $user_to_be_blocked );
				$blocked_users = new \Entities\blocked_users();
				$blocked_users->setIlookUser( \Extended\ilook_user::getRowObject($blocker_user) );
				$blocked_users->setIlookUserr( $user_to_be_blocked_obj );
				$em->persist($blocked_users);
				
				$blocked_users_arr[$key]['id'] = $user_to_be_blocked_obj->getId();
				$blocked_users_arr[$key]['name'] = $user_to_be_blocked_obj->getFirstname()." ".$user_to_be_blocked_obj->getLastname();
				$blocked_users_arr[$key]['email'] = $user_to_be_blocked_obj->getEmail();
				
				\Extended\link_requests::unlinkUsersByUserIds( $blocker_user, array( $user_to_be_blocked ) );
				
				//Removing users from visitor list from both sides.
				\Extended\who_viewed_profiles::removeUserFromVisitorList($user_to_be_blocked, $blocker_user );
				\Extended\who_viewed_profiles::removeUserFromVisitorList($blocker_user, $user_to_be_blocked );

				//-------------------------------------------------------------------
				//-----Code for remove link from roster starts here------------------
				//-------------------------------------------------------------------
				
				$userToBeBlockedOpObj = \Extended\chat_settings::getRowObject (['ilookUser'=> $user_to_be_blocked]);//get user to be blocked obj.
				$blockerOpObj = \Extended\chat_settings::getRowObject (['ilookUser'=> $blocker_user]);//get blocker obj.

				$openFireMain = new Openfire\Main();
				//Delete blocked user from logged user's (blocker) roster.
				$openFireMain->deleteFromRoster (
												$blockerOpObj->getIlookUser()->getUsername(),
												$userToBeBlockedOpObj->getIlookUser()->getUsername().'@'.$openFireMain::OPENFIRE_DOMAIN
												);
				//Delete logged user(blocker) from blocked user's roster.
				$openFireMain->deleteFromRoster (
												$userToBeBlockedOpObj->getIlookUser()->getUsername(),
												$blockerOpObj->getIlookUser()->getUsername().'@'.$openFireMain::OPENFIRE_DOMAIN
												);

				//-------------------------------------------------------------------
				//-----Code for remove link from roster ends here--------------------
				//-------------------------------------------------------------------
			}
		}
		
		$em->flush();
		
		return $blocked_users_arr;
	}
	
	/**
	 * Remove users from block list for particular
	 * user say user x.
	 *
	 * @param array $Unblocked_users
	 * @param integer $blocker_user
	 *
	 * @return array [ array of unblocked user ]
	 * @author jsingh7
	 * @version 1.0
	 */
	public static function removeUsersFromBlockList( $users_to_be_unblocked, $blocker_user )
	{   
		$em = \Zend_Registry::get('em');
		$unblocked_users_arr = array();
		if( $users_to_be_unblocked )
		{
			foreach ( $users_to_be_unblocked as $key=>$user_to_be_unblocked )
			{
				$blocking_record = $em->getRepository('\Entities\blocked_users')->findOneBy( array( 'ilookUser' => $blocker_user, 'ilookUserr' => $user_to_be_unblocked ) );
				$em->remove( $blocking_record );
				$unblocked_users_arr[$key] = $user_to_be_unblocked;
			}
		}
		$em->flush();
		return $unblocked_users_arr;
	}
	
	/**
	 * Checks if user p is blocked by
	 * user q.
	 *
	 * @param $blocker_user
	 * @param $blocked_user
	 * @return boolean
	 * @author jsingh7
	 * @version 1.0
	 */
	public static function checkIfBlocked( $blocker_user, $blocked_user )
	{
		$em = \Zend_Registry::get('em');
		$result = $em->getRepository('\Entities\blocked_users')->findBy( array( 'ilookUser' => $blocker_user, 'ilookUserr' => $blocked_user ) );
		if( $result ):
			return 1;
		else:
			return 0;
		endif;
	}
	
	/**
	 * Returns the records of user_ids which have been
	 * blocked by user a. If he have not blocked any, the method
	 * will return false.
	 * 
	 * @param integer $user_id
	 *
	 * @return array collection or false
	 * @author jsingh7
	 * @version 1.0
	 */
	public static function getUsersBlockedByUserA( $user_id )
	{
		$em = \Zend_Registry::get('em');
		$result = $em->getRepository('\Entities\blocked_users')->findBy( array( 'ilookUser' => $user_id ) );
		if( $result ):
			return $result;
		else:
			return false;
		endif;
	}
	
	/**
	 * Get users who blocked a particular
	 * user.
	 *
	 * @param integer $user_id
	 *
	 * @return array collection or false
	 * @author jsingh7
	 * @version 1.0
	 */
	public static function getUsersWhoBlockedUserA( $user_id )
	{
		$em = \Zend_Registry::get('em');
		$result = $em->getRepository('\Entities\blocked_users')->findBy( array( 'ilookUserr' => $user_id ) );
		if( $result ):
		return $result;
		else:
		return false;
		endif;
	}
	
	/**
	 * Return users who have blocked given user id and blocked by given user id,
	 * it eliminates users own id if present.
	 * @param integer $user_id
	 * @return array if any record found else false
	 * @author hakur5
	 */
	public static function getAllBlockersAndBlockedUsers($userId)
	{
		//Fetching records of users who has been blocked.
		$blocked_user_ids_arr = array();
		
		//Gettting users I have blocked.
		$blocking_records = \Extended\blocked_users::getUsersBlockedByUserA( $userId );
		if( $blocking_records )
		{
			foreach ( $blocking_records as $blocking_record )
			{
				$blocked_user_ids_arr[$blocking_record->getIlookUserr()->getId()] = $blocking_record->getIlookUserr()->getId();
				$blocked_user_ids_arr[$blocking_record->getIlookUser()->getId()] = $blocking_record->getIlookUser()->getId();
			}
		}
		
		
		//Gettting users who blocked me.
		$blocking_records = \Extended\blocked_users::getUsersWhoBlockedUserA( $userId );
		if( $blocking_records )
		{
			foreach ( $blocking_records as $blocking_record )
			{
				$blocked_user_ids_arr[$blocking_record->getIlookUser()->getId()] = $blocking_record->getIlookUser()->getId();
				$blocked_user_ids_arr[$blocking_record->getIlookUserr()->getId()] = $blocking_record->getIlookUserr()->getId();
			}
		}
		
		//Removing current/login user from array.
		unset($blocked_user_ids_arr[$userId]);
		if(count($blocked_user_ids_arr) != 0 )
		{
			return $blocked_user_ids_arr;
		}
		else
		{
			return false;
		}
	}
	
}