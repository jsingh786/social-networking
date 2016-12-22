<?php
namespace Extended;
/**
 * This class has been made for
 * general purpose functions.
 *
 * @author Sunny Patial
 * @version 1.0
 */
class bookmark_profile extends \Entities\bookmark_profile
{
	const BOOKMARKED_STATUS = 1;
	const UNBOOKMARKED_STATUS = 0;
	/**
	 * Pass an id and get its object
	 *
	 * @param $id
	 * @return object of that class
	 * @author Shaina
	 * @version 1.0
	 */
	public static function getRowObject($id)
	{
		$em = \Zend_Registry::get('em');
		$obj = $em->find('\Entities\bookmark_profile',$id);
		$em->getConnection()->close();
		return $obj;
	}
	
	
	
	/**
	 * function used for assign bookmark to users
	 * @param integer $assign_user, $profile_user, $assign_status
	 * @return latestId
	 * @author sunny patial
	 * @version 1.0
	 */
	public static function addBookmarkStatus($assign_user, $profile_user, $assign_status){
		$em = \Zend_Registry::get('em');
		$records=$em->createQuery('select b.id from \Entities\bookmark_profile b where b.bookmark_profilesAssignByUser='.$assign_user.' and b.bookmark_profilesUser='.$profile_user);
		$result=$records->getResult();
		if($result){
			$bookmarkObj = $em->find('\Entities\bookmark_profile',$result[0]["id"]);
			$bookmarkObj->setStatus($assign_status);
			$em->persist($bookmarkObj);
			$em->flush();
			$em->getConnection()->close();
			return $bookmarkObj->getId();
		}
		else{
			$assign_user=$em->find('\Entities\ilook_user',$assign_user);
			$profile_user=$em->find('\Entities\ilook_user',$profile_user);
			$bookmarkObj = new \Entities\bookmark_profile();
			$bookmarkObj->setStatus($assign_status);
			$bookmarkObj->setBookmark_profilesAssignByUser($assign_user);
			$bookmarkObj->setBookmark_profilesUser($profile_user);
			$em->persist($bookmarkObj);
			$em->flush();
			$em->getConnection()->close();
			return $bookmarkObj->getId();
		}
	}
	/**
	 * function used for get bookmark status
	 * @author sunny patial
	 * @version 1.0
	 */
	public static function getBookmarkStatus($current_user, $profile_user){
		$em = \Zend_Registry::get('em');
		$records=$em->createQuery('select b.status from \Entities\bookmark_profile b where b.bookmark_profilesAssignByUser='.$current_user.' and b.bookmark_profilesUser='.$profile_user);
		$result = $records->getResult();
		if($result){
			$status=$result[0]['status'];
		}
		else{
			$status=0;
		}
		$em->getConnection()->close();
		return $status;
	}
	
	/**
	 * This function will get list of
	 * bookmarked profile users for
	 * given user_id
	 *
	 * @param identity
	 * @return array of accept_user_ids
	 * @author Shaina Gandhi, Updated by Sunny Patial
	 * @version 1.0
	 */
	public static function getBookmarkedProfileList($id)
	{
		$em = \Zend_Registry::get('em');
		$userID = \Auth_UserAdapter::getIdentity()->getId();
		$statusActive=\Extended\ilook_user::USER_STATUS_ACTIVE;
		$records = $em->createQuery('select bok from 
									\Entities\bookmark_profile bok, 
									\Entities\ilook_user usr
									 
									where bok.bookmark_profilesAssignByUser='.$userID.' 
									and bok.bookmark_profilesUser!='.$id.' 
									and bok.status='.$statusActive.' 
									and usr.id = bok.bookmark_profilesUser 
									and usr.account_closed_on is null
									and usr.status='.$statusActive
				
				);
		$em->getConnection()->close();
// 		\Zend_Debug::dump( $records->getResult(\Doctrine\ORM\Query::HYDRATE_ARRAY) );
// 		die;
		return  $records->getResult();
	}
	/**
	 * This function will get list of
	 * searched bookmarked profile users for
	 * given user_id
	 *
	 * @param identity
	 * @return array of accept_user_ids
	 * @author Sunny Patial
	 * @version 1.0
	 */
	public static function getSearchBookmarkProfileList($ids)
	{
		$em = \Zend_Registry::get('em');
		$userID = \Auth_UserAdapter::getIdentity()->getId();
		$records = $em->createQuery('select book from 
				\Entities\bookmark_profile book 
				where book.bookmark_profilesAssignByUser='.$userID.' 
				and 
				book.bookmark_profilesUser in ('.$ids.') 
				and 
				book.status=1' );
		$em->getConnection()->close();
		return  $records->getResult ();
	}
	
	/**
	 * function used to remove bookmark
	 * Author: Sunny Patial
	 * Date: 5,Aug 2013
	 * version: 1.0
	 */
	public static function removeBookmark($currentUser, $profileUser)
	{
		$em = \Zend_Registry::get('em');
			$records=$em->createQuery('delete from \Entities\bookmark_profile l where l.bookmark_profilesAssignByUser='.$currentUser.' and l.bookmark_profilesUser='.$profileUser);
			$result=$records->getResult();
		$em->getConnection()->close();
		if($result){
			return true;
		}
		else{
			return false;
		}
	}
	
	/**
	 * Return no. of profiles bookmarked by me,
	 * if no result is found then return false.
	 * @param user_id ( bookmark profile assigned by user )
	 * @author hkaur5
	 * @version 1.0
	 */
	public static function countProfilesBookmarkedByMe( $user_id )
	{
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select('
				count(b_p.id) as num_of_rows
				')
				->from('\Entities\bookmark_profile', 'b_p')
				->where( 'b_p.bookmark_profilesAssignByUser='.$user_id )
				->andWhere('b_p.status = 1');
	
	
		$q_1 = $q_1->getQuery ()->getResult ();
	
		$em->getConnection()->close();
		if( $q_1 )
		{
			return $q_1[0]['num_of_rows'];
		}
		else if ( $q_1[0]["num_of_rows"] == 0)
		{
			return false;
		}
	}
}
