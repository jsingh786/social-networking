<?php
namespace Extended;
/**
 * This class has been made for
 * general purpose functions.
 *
 * @author Shaina
 * @version 1.0
 */
class comments extends \Entities\comments
{
    const type_wallpost_comment = 1;
    const type_photo_comment = 2;
    const type_album_comment = 3;
    
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
		$obj = $em->find('\Entities\comments',$id);
		$em->getConnection()->close();
		return $obj;
	}
	
	/**
	 * Posting a comment
	 * for a wallpost, photo, album etc.
	 *
	 * You can pass all the three variables(wallpost, photo, album) in one function call, it will add three records.
	 *
	 * @param text $comments_text
	 * @param integer $comment_by_user_id
	 * @param integer $same_comment_id (ONLY IN CASE WHEN COMMENT ON PHOTO/ALBUM)[id of same comment that is added on photofeed-wallpost, required in case if you are adding comment for photo or album.] 
	 * @param integer $wallpost_id [optional]
	 * @param integer $socialise_photo_id [optional]
	 * @param integer $socialise_album_id [optional]
	 *
	 * @return indentity or FALSE
	 *
	 * @author jsingh7
	 * @version 1.0
	 */
	public static function addComment( $comments_text, $comment_by_user_id, $same_comment_id, $wallpost_id = null, $socialise_photo_id = null, $socialise_album_id = null )
	{
		$em = \Zend_Registry::get('em');
		
		$filterObj = \Zend_Registry::get('Zend_Filter_StripTags');
		$comments_text = $filterObj->filter($comments_text);
		if( $wallpost_id )
		{
			$commentsObj = new \Entities\comments();
			$commentsObj->setComment_text($comments_text);
			$commentsObj->setCommentsIlook_user( \Extended\ilook_user::getRowObject( $comment_by_user_id ) );
			$commentsObj->setCommentsWall_post( \Extended\wall_post::getRowObject($wallpost_id) );
			$commentsObj->setType( self::type_wallpost_comment );
				
			$commentsObj->setCreated_at( new \DateTime() );
			$em->persist( $commentsObj );
			
			// Record activity log for admin on add comment on dasboard wallpost.
			if(\Zend_Registry::get('admin_logged_in_as_user'))
			{
				if($commentsObj)
				{
					if($commentsObj->getCommentsWall_post()->getWall_type() == 1)
					{
						\Extended\admin_activity_log::addAdminActivityLog(\Zend_Registry::get('admin_logged_in_as_user'), \Auth_UserAdapter::getIdentity()->getId(), \Extended\admin_activity_log::MODULE_DASHBOARD);
					}
					else if($commentsObj->getCommentsWall_post()->getWall_type() == 2)
					{
						\Extended\admin_activity_log::addAdminActivityLog(\Zend_Registry::get('admin_logged_in_as_user'), \Auth_UserAdapter::getIdentity()->getId(), \Extended\admin_activity_log::MODULE_DISPLAY);
					}
				}
			}
			$em->flush();
		}
		if( $socialise_photo_id )
		{
			$commentsObj = new \Entities\comments();
			$commentsObj->setComment_text($comments_text);
			$commentsObj->setCommentsIlook_user( \Extended\ilook_user::getRowObject( $comment_by_user_id ) );
			$commentsObj->setCommentsSocialise_photo( \Extended\socialise_photo::getRowObject($socialise_photo_id) );
			$commentsObj->setType( self::type_photo_comment );
			
			$commentsObj->setCreated_at( new \DateTime() );
			$commentsObj->setSame_comment_id( $same_comment_id );
			$em->persist( $commentsObj );
			
			// Record activity log for admin on add comment on photo.
			if(\Zend_Registry::get('admin_logged_in_as_user'))
			{
				if($commentsObj)
				{
					$ilook_user_id = $commentsObj->getCommentsIlook_user()->getId();
					$admin_id = \Zend_Registry::get('admin_logged_in_as_user');
					\Extended\admin_activity_log::addAdminActivityLog($admin_id, $ilook_user_id, \Extended\admin_activity_log::MODULE_PHOTOS);
				}
			}
			$em->flush();
		}
		if( $socialise_album_id )
		{
			$commentsObj = new \Entities\comments();
			$commentsObj->setComment_text($comments_text);
			$commentsObj->setCommentsIlook_user( \Extended\ilook_user::getRowObject( $comment_by_user_id ) );
			$commentsObj->setCommentsSocialise_album( \Extended\socialise_album::getRowObject($socialise_album_id) );
			$commentsObj->setType( self::type_album_comment );
			
			$commentsObj->setCreated_at( new \DateTime() );
			$commentsObj->setSame_comment_id( $same_comment_id );
			$em->persist( $commentsObj );
			
			
			$em->flush();
		}
	
		return $commentsObj->getId();
	}
	
	/**
	 * Edit the comment using comment id.
	 * 
	 * @param integer $comment_id
	 * @param text $comments_text
	 * @author jsingh7
	 * @return id or FALSE
	 * @version 1.0
	 */
	static public function editComment( $comment_id, $comments_text )
	{
		$em = \Zend_Registry::get('em');
		$commentsObj = $em->find('\Entities\comments', $comment_id);
		$commentsObj->setComment_text( $comments_text );
		$em->persist( $commentsObj );
		
		$sameCommentsObj = $em->getRepository('\Entities\comments')->findOneBy( array('same_comment_id'=>$commentsObj->getId()) );
		if( $sameCommentsObj )
		{	
			$sameCommentsObj->setComment_text( $comments_text );
			$em->persist( $sameCommentsObj );
		}
		$em->flush();
		
		$comment_arr = array('id'=>$commentsObj->getId(), 'text'=>$commentsObj->getComment_text());

		// Record admin activity log for edit comment(photos and socialise wall/collage)
		if(\Zend_Registry::get('admin_logged_in_as_user'))
		{
			if(!empty($comment_arr))
			{
				//Display wall
				\Extended\admin_activity_log::addAdminActivityLog(\Zend_Registry::get('admin_logged_in_as_user'), \Auth_UserAdapter::getIdentity()->getId(), \Extended\admin_activity_log::MODULE_DISPLAY);
				
				//Photos
				if ($sameCommentsObj)
				{
					if($sameCommentsObj->getCommentsSocialise_photo())
					{
						\Extended\admin_activity_log::addAdminActivityLog(\Zend_Registry::get('admin_logged_in_as_user'), \Auth_UserAdapter::getIdentity()->getId(), \Extended\admin_activity_log::MODULE_PHOTOS);
					}
				}
					
			}
		}
		return $comment_arr;
	}
	
	/**
	 * Edit the comment using comment id.
	 *
	 * @param integer $comment_id
	 * @param text $comments_text
	 * @author jsingh7
	 * @return id or FALSE
	 * @version 1.0
	 */
	static public function editPhotoComment( $comment_id, $comments_text )
	{
		$ret_array = array();
		$em = \Zend_Registry::get('em');
		$commentsObj = $em->find('\Entities\comments', $comment_id);
		$commentsObj->setComment_text( $comments_text );
		$em->persist( $commentsObj );
		if( $commentsObj->getSame_comment_id())
		{
			$sameCommentsObj = $em->find('\Entities\comments', $commentsObj->getSame_comment_id());
			if( $sameCommentsObj )
			{
				$sameCommentsObj->setComment_text( $comments_text );
				$em->persist( $sameCommentsObj );
			}
		}
		$em->flush();
		
		$ret_array['photo_comment_id'] = $comment_id;
		$ret_array['text'] =  $commentsObj->getComment_text();
		if( $commentsObj->getSame_comment_id() )
		{
			$ret_array['wallpost_comment_id'] = $commentsObj->getSame_comment_id();
		}	
		return $ret_array;
	}
	
	
	/**
	 * Edit the dashboard comment using comment id.
	 *
	 * @param integer $comment_id
	 * @param text $comments_text
	 * @author Sunny Patial
	 * @author hkaur5
	 * @return id or FALSE
	 * @version 1.0
	 */
	static public function editCommentOfDashboardWallpost( $comment_id, $comments_text )
	{
		$em = \Zend_Registry::get('em');
		$commentsObj = $em->find('\Entities\comments', $comment_id);
		$commentsObj->setComment_text( $comments_text );
		$em->persist( $commentsObj );
		$em->flush();
	
		
		$comment_arr = array('id'=>$commentsObj->getId(), 'text'=>$commentsObj->getComment_text());
		
		// Record admin activity log on editing wallpost comment(Dashboard).
		if(\Zend_Registry::get('admin_logged_in_as_user'))
		{
			if($commentsObj)
			{
				\Extended\admin_activity_log::addAdminActivityLog(\Zend_Registry::get('admin_logged_in_as_user'), \Auth_UserAdapter::getIdentity()->getId(), \Extended\admin_activity_log::MODULE_DASHBOARD);
			}
		}
		
		return $comment_arr;
	}
	/**
	 * Return array of comments for wallpost.
	 * @author hkaur5
	 * @param wallpost_id
	 */
	public static function getAllCommentsForWallpost( $wallpost_id)
	{
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select('cmnt')
		->from('\Entities\comments', 'cmnt')
		->where( 'cmnt.commentsWall_post =?1' )
		->setParameter( 1, $wallpost_id )
		->getQuery()
		->getResult();
		return ($q_1);
	}
	
	/**
	 * Return array of comments for photo.
	 * @author hkaur5
	 * @param photo_id
	 */
	public static function getAllCommentsForPhoto( $photo_id)
	{
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select('cmnt')
		->from('\Entities\comments', 'cmnt')
		->where( 'cmnt.commentsSocialise_photo =?1' )
		->setParameter( 1, $photo_id )
		->getQuery()
		->getResult();
		return ($q_1);
	}
	/**
	 * Return array of comments for album.
	 * @author hkaur5
	 * @param $album_id
	 */
	public static function getAllCommentsForAlbum( $album_id)
	{
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select('cmnt')
		->from('\Entities\comments', 'cmnt')
		->where( 'cmnt.commentsSocialise_album =?1' )
		->setParameter( 1, $album_id )
		->getQuery()
		->getResult();
		return ($q_1);
	}
	
	/**
	 * Returns array of comments with associated
	 * user in addition with info about more comments
	 * are available or not.
	 * 
	 * @param integer $user_id
	 * @param integer $wallpost_id
	 * @param integer $offset [optional]
	 * @param integer $limit [optional]
	 * @param array $logged_in_usersBlocked_users_arr ( users blocked by or user who has blocked -> user who is currently loggedin) [optional]
	 * @return array
	 * @version 1.0
	 * @author jsingh7
	 */
	public static function getCommentsForWallpost( $user_id, $wallpost_id, $offset = 0, $limit = 4, $logged_in_usersBlocked_users_arr = null, $for_mobile_app = 0 )
	{
		$ret_r = array();
		$em = \Zend_Registry::get('em');
		$qb = $em->createQueryBuilder();
		$q = $qb->select( 'comm, fromUsr.id, fromUsr.professional_image,fromUsr.account_closed_on, fromUsr.gender, fromUsr.firstname, fromUsr.lastname' )
		->from( '\Entities\comments', 'comm' )
		->leftJoin( 'comm.commentsIlook_user', 'fromUsr' )
		->where( 'comm.commentsWall_post = ?1' )
		->setParameter( 1, $wallpost_id )
		->setFirstResult( $offset )
		->setMaxResults( $limit )
		->orderBy( 'comm.id', 'DESC' );
		$q = $q->getQuery()->getResult( \Doctrine\ORM\Query::HYDRATE_ARRAY );
		

		
		$lastWallPostID = end( $q );
		
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select( 'comm' )
		->from('\Entities\comments', 'comm')
		->where( 'comm.commentsWall_post = ?1' )
		->andWhere( 'comm.id < ?2' )
		->setParameter( 1, $wallpost_id )
		->setParameter( 2, $lastWallPostID[0]['id'] );
		$q_1 = $q_1->getQuery()->getResult( \Doctrine\ORM\Query::HYDRATE_ARRAY );
		if( $q_1 )
		{	
			$ret_r["is_there_more_recs"] = 1;
		}
		else
		{
			$ret_r["is_there_more_recs"] = 0;
		}
		$ii = 2;
		$counter = 0;
		foreach ( $q as $key=>$data )
		{
			//If user is blocked then changing photo detail accordingly.
			if($logged_in_usersBlocked_users_arr)
			{
				$comment_user_photo_detail = \Extended\comments::getUsersPhotoForComment($data['id'], $logged_in_usersBlocked_users_arr);
			}
			else
			{
				$comment_user_photo_detail['photo_path'] = ($for_mobile_app == 1) ? \Helper_common::getUserProfessionalPhoto($data['id'], 0) : \Helper_common::getUserProfessionalPhoto($data['id'], 3);
				$comment_user_photo_detail['is_photo_clickable'] = true;
			}
			//Check if commenter user's account is closed then making his/her photo unclickable.
			if( $data['account_closed_on'] != null )
			{
				$comment_user_photo_detail['photo_path'] = ($for_mobile_app == 1) ? \Helper_common::getUserProfessionalPhoto($data['id'], 0) : \Helper_common::getUserProfessionalPhoto($data['id'], 3);
				$comment_user_photo_detail['is_photo_clickable'] = false;
			}
			//End of code of changing photo detail accordingly.
			
			
			if( \Extended\users_comments_visibility::IsCommentHiddenOnUserWall($data[0]['id'], $user_id ) )
			{
				$ret_r['data'][$key]['is_hidden'] = 1;
			}
			else
			{
				$ret_r['data'][$key]['is_hidden'] = 0;
			}
			
			if( $data['id'] == $user_id )
			{
				$ret_r['data'][$key]['is_my_comment'] = 1;
			}
			else
			{
				$ret_r['data'][$key]['is_my_comment'] = 0;
			}
			$ret_r['data'][$key]['comment_id'] = $data[0]['id'];
			$ret_r['data'][$key]['comment_text'] = $data[0]['comment_text'];
			$ret_r['data'][$key]['comment_user_id'] = $data['id'];
			$ret_r['data'][$key]['comment_profes_image'] = $comment_user_photo_detail['photo_path'];
			$ret_r['data'][$key]['is_user_photo_clickable'] = $comment_user_photo_detail['is_photo_clickable'];
			$ret_r['data'][$key]['comment_profes_image_medium_size'] = \Helper_common::getUserProfessionalPhoto($data['id'], 2);
			$ret_r['data'][$key]['comment_user_name'] = $data['firstname']." ".$data['lastname'];
			$ret_r['data'][$key]['created_at'] = \Helper_common::nicetime( $data[0]['created_at']->format("Y-m-d H:i:s") );
			
		}	
		return $ret_r;
	}
	
	
	/**
	 * Returns array of comments with associated
	 * user and album in addition with info about more comments
	 * are available or not.
	 *
	 * @param integer $user_id
	 * @param integer $album_id
	 * @param integer $offset [optional]
	 * @param integer $limit [optional]
	 * @param array $logged_in_usersBlocked_users_arr ( users blocked by or user who has blocked -> user who is currently loggedin) [optional]
	 * @return array
	 * @version 1.0
	 * @author hkaur5
	 */
	public static function getCommentsForAlbum( $user_id, $album_id, $offset = 0, $limit = 4, $logged_in_usersBlocked_users_arr = null )
	{
		$ret_r = array();
		$em = \Zend_Registry::get('em');
		$qb = $em->createQueryBuilder();
		$q = $qb->select( 'comm, fromUsr.id, fromUsr.professional_image,fromUsr.account_closed_on, fromUsr.gender, fromUsr.firstname, fromUsr.lastname' )
		->from( '\Entities\comments', 'comm' )
		->leftJoin( 'comm.commentsIlook_user', 'fromUsr' )
		->where( 'comm.commentsSocialise_album = ?1' )
		->setParameter( 1, $album_id )
		->setFirstResult( $offset )
		->setMaxResults( $limit )
		->orderBy( 'comm.id', 'DESC' );
		$q = $q->getQuery()->getResult( \Doctrine\ORM\Query::HYDRATE_ARRAY );
	
	
	
		$lastWallPostID = end( $q );
	
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select( 'comm' )
		->from('\Entities\comments', 'comm')
		->where( 'comm.commentsSocialise_album = ?1' )
		->andWhere( 'comm.id < ?2' )
		->setParameter( 1, $album_id )
		->setParameter( 2, $lastWallPostID[0]['id'] );
		$q_1 = $q_1->getQuery()->getResult( \Doctrine\ORM\Query::HYDRATE_ARRAY );
		if( $q_1 )
		{
			$ret_r["is_there_more_recs"] = 1;
		}
		else
		{
			$ret_r["is_there_more_recs"] = 0;
		}
		$ii = 2;
		$counter = 0;
		foreach ( $q as $key=>$data )
		{
			//If user is blocked then changing photo detail accordingly.
			if($logged_in_usersBlocked_users_arr)
			{
				$comment_user_photo_detail = \Extended\comments::getUsersPhotoForComment($data['id'], $logged_in_usersBlocked_users_arr);
			}
			else
			{
				$comment_user_photo_detail['photo_path'] = \Helper_common::getUserProfessionalPhoto($data['id'], 3);
				$comment_user_photo_detail['is_photo_clickable'] = true;
			}
			//Check if commenter user's account is closed then making his/her photo unclickable.
			if( $data['account_closed_on'] != null )
			{
				$comment_user_photo_detail['photo_path'] = \Helper_common::getUserProfessionalPhoto($data['id'], 3);
				$comment_user_photo_detail['is_photo_clickable'] = false;
			}
			//End of code of changing photo detail accordingly.
				
				
			if( \Extended\users_comments_visibility::IsCommentHiddenOnUserWall($data[0]['id'], $user_id ) )
			{
				$ret_r['data'][$key]['is_hidden'] = 1;
			}
			else
			{
				$ret_r['data'][$key]['is_hidden'] = 0;
			}
				
			if( $data['id'] == $user_id )
			{
				$ret_r['data'][$key]['is_my_comment'] = 1;
			}
			else
			{
				$ret_r['data'][$key]['is_my_comment'] = 0;
			}
			$ret_r['data'][$key]['comment_id'] = $data[0]['id'];
			$ret_r['data'][$key]['comment_text'] = $data[0]['comment_text'];
			$ret_r['data'][$key]['comment_user_id'] = $data['id'];
			$ret_r['data'][$key]['comment_profes_image'] = $comment_user_photo_detail['photo_path'];
			$ret_r['data'][$key]['is_user_photo_clickable'] = $comment_user_photo_detail['is_photo_clickable'];
			$ret_r['data'][$key]['comment_profes_image_medium_size'] = \Helper_common::getUserProfessionalPhoto($data['id'], 2);
			$ret_r['data'][$key]['comment_user_name'] = $data['firstname']." ".$data['lastname'];
			$ret_r['data'][$key]['created_at'] = \Helper_common::nicetime( $data[0]['created_at']->format("Y-m-d H:i") );
				
		}
		return $ret_r;
	}
	/**
	 * Edit the comment using comment id. [modified to prevent xss ] 
	 *
	 * @param integer $comment_id
	 * @param integer $user id
	 * @param text $comments_text
	 * @author jsingh7
	 * @return id or FALSE
	 * @version 1.0
	 */
	/*
	static public function editCommentOfWallpostAndRelatedPhotoOLD( $comment_id, $user_id, $comments_text )
	{
		$em = \Zend_Registry::get('em');
		$em->getRepository('\Entities\comments')->findOneBy(array('id' => $comment_id, 'commentsIlook_user' => $user_id));
		$commentsObj = $commentsObj->setComment_text( $comments_text );
		$em->persist( $commentsObj );
		$em->flush();
	
		$em = \Zend_Registry::get('em');
		$sameCommentsObj = $em->getRepository('\Entities\comments')->findOneBy( array('same_comment_id'=>$commentsObj->getId(), 'commentsIlook_user' => $user_id) );
		$sameCommentsObj->setComment_text( $comments_text );
		$em->persist( $sameCommentsObj );
		$em->flush();
	
		$em->getConnection()->close();
		return $commentsObj->getId();
	}
	*/
		
	/**
	 * Returns array of comments with associated
	 * user info in addition with info about more comments
	 * are available or not.
	 *
	 * @param integer $photo_id
	 * @param integer $offset [optional]
	 * @param integer $limit [optional]
	 * @param integer $loggedinUserId [optional]
	 * * @param array $logged_in_usersBlocked_users_arr ( users blocked by or user who has blocked -> user who is currently loggedin) [optional]
	 * @return array
	 * @version 1.0
	 * @author jsingh7
	 */
	public static function getCommentsForPhotoDetail( $photo_id, $offset = 0, $limit = 6, $loggedinUserId = null, $logged_in_usersBlocked_users_arr = null )
	{
		if(! $loggedinUserId )
		{
			$loggedinUserId = \Auth_UserAdapter::getIdentity()->getId();
		}	
		$ret_r = array();
		$em = \Zend_Registry::get('em');
		$qb = $em->createQueryBuilder();
		$q = $qb->select( 'comm, fromUsr.id, fromUsr.professional_image, fromUsr.gender, fromUsr.firstname, fromUsr.lastname' )
		->from( '\Entities\comments', 'comm' )
		->leftJoin( 'comm.commentsIlook_user', 'fromUsr' )
		->where( 'comm.commentsSocialise_photo = ?1' )
		->setParameter( 1, $photo_id )
		->setFirstResult( $offset )
		->setMaxResults( $limit )
		->orderBy( 'comm.id', 'DESC' );
		$q = $q->getQuery()->getResult( \Doctrine\ORM\Query::HYDRATE_ARRAY );
	
		$lastCommentID = end( $q );
	
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select( 'comm' )
		->from('\Entities\comments', 'comm')
		->where( 'comm.commentsSocialise_photo = ?1' )
		->andWhere( 'comm.id < ?2' )
		->setParameter( 1, $photo_id )
		->setParameter( 2, $lastCommentID[0]['id'] );
		$q_1 = $q_1->getQuery()->getResult( \Doctrine\ORM\Query::HYDRATE_ARRAY );
		if( $q_1 )
		{
			$ret_r["is_there_more_recs"] = 1;
		}
		else
		{
			$ret_r["is_there_more_recs"] = 0;
		}
		$ii = 2;
		$counter = 0;
		//echo "<pre>"; print_r($q); die;
		foreach ( $q as $key=>$data )
		{
			// Managing profile photo of commenter if he/she has blocked the logged in user or being blocked.
			if($logged_in_usersBlocked_users_arr)
			{
				$comment_user_photo_detail = \Extended\comments::getUsersPhotoForComment($data['id'], $logged_in_usersBlocked_users_arr);
			}
			else
			{
				$comment_user_photo_detail['photo_path'] = \Helper_common::getUserProfessionalPhoto($data['id'], 3);
				$comment_user_photo_detail['is_photo_clickable'] = true;
			}
			// END Managing profile photo of commenter if he/she has blocked the logged in user or being blocked.
			if( \Extended\users_comments_visibility::IsCommentHiddenOnUsersPhotoDetail($data[0]['id'], $loggedinUserId ) )
			{
				$ret_r['data'][$key]['is_hidden'] = 1;
			}
			else
			{
				$ret_r['data'][$key]['is_hidden'] = 0;
			}
				
			if( $data['id'] == $loggedinUserId )
			{
				$ret_r['data'][$key]['is_my_comment'] = 1;
			}
			else
			{
				$ret_r['data'][$key]['is_my_comment'] = 0;
			}
			$ret_r['data'][$key]['comment_id'] = $data[0]['id'];
			$ret_r['data'][$key]['same_comment_id'] = $data[0]['same_comment_id'];
			$ret_r['data'][$key]['comment_text'] = $data[0]['comment_text'];
			$ret_r['data'][$key]['comment_user_id'] = $data['id'];
			$ret_r['data'][$key]['comment_profes_image'] = $comment_user_photo_detail['photo_path'];
			$ret_r['data'][$key]['is_user_photo_clickable'] = $comment_user_photo_detail['is_photo_clickable'];
			$ret_r['data'][$key]['comment_user_name'] = $data['firstname']." ".$data['lastname'];
			$ret_r['data'][$key]['created_at'] = \Helper_common::nicetime( $data[0]['created_at']->format("Y-m-d H:i:s") );
				
		}

		return $ret_r;
	}
	
	
	/**
	 * Delete the comment using comment id and same comment id.
	 * Returns Ids of comments that deleted in the form of array.
	 *
	 * @param integer $comment_id
	 * @author jsingh7
	 * @return array or FALSE
	 * @version 1.0
	 */
	static public function deleteComment( $comment_id )
	{
		$ret_array = array();
		$em = \Zend_Registry::get('em');
		
		$comment_obj = self::getRowObject( $comment_id );

		$ret_array['comment_id'] = $comment_id;
		
		//==================================================================================
		//Keeping in mind that comment is getting deleted from photo detail/slider 
		// OR comment is getting deleted from albums which has wallposts on socialise wall.		
		//==================================================================================
		
		if( $comment_obj->getSame_comment_id() )
		{
			//Getting wallpost id.
			$same_comment_obj = self::getRowObject( $comment_obj->getSame_comment_id() );//'Comment' which has comment id value = same_comment_id.
			if( $same_comment_obj->getCommentsWall_post() )
			{
				$ret_array['wallpost_id'] = $same_comment_obj->getCommentsWall_post()->getId();
			}
// 			if($comment_obj->getCommentsSocialise_album())
// 			{
// 				$ret_array['album_id'] = $comment_obj->getCommentsSocialise_album()->getID();
// 			}
			$qb_1 = $em->createQueryBuilder();
			$q_1 = $qb_1->delete('\Entities\comments','comm')
			->where( 'comm.id = ?1' )
			->orWhere( 'comm.id = ?2' )
			->setParameter( 1, $comment_id )
			->setParameter( 2, $comment_obj->getSame_comment_id() )
			->getQuery();
			$results = $q_1->execute();
			$ret_array['same_comment_id'] = $comment_obj->getSame_comment_id();
			
		}
		//===============================================================
		// Keeping in mind that comment is getting deleted from wallpost.
		// Or from such albums which does not has any wallposts i.e albums like default album.
		//===============================================================
		else
		{
			//get wallpost id.
			if( $comment_obj->getCommentsWall_post() )
			{
				$ret_array['wallpost_id'] = $comment_obj->getCommentsWall_post()->getId();
			}
			else if($comment_obj->getCommentsSocialise_album())
			{
				$ret_array['album_id'] = $comment_obj->getCommentsSocialise_album()->getId();
			}
			$qb_1 = $em->createQueryBuilder();
			$q_1 = $qb_1->delete('\Entities\comments','comm')
			->where( 'comm.id = ?1' )
			->orWhere( 'comm.same_comment_id = ?1' )
			->setParameter( 1, $comment_id )
			->getQuery();
			$results = $q_1->execute();
		}
		
		$em->flush();
		
		if( $results ):
		return $ret_array;
		else:
		return FALSE;
		endif;
	}
	
	/**
	 * function used to delete dashboard wall comments on the basis of comment id
	 * @param $comment_id
	 * @author Sunny Patial
	 * @since 6,Feb 2014
	 *
	 */
	public static function deleteDashboardWallComments($comment_id){
		$em = \Zend_Registry::get('em');
		$q = $em->createQuery('delete from \Entities\comments c where c.id='.$comment_id);
		$numDeleted = $q->execute();
		if($numDeleted){
			return TRUE;
		}
		else{
			return FALSE;
		}
	}
	/**
	 * function used to delete comments on the basis of wall id
	 * @param $wallID
	 * @author Sunny Patial
	 * @since 6,Feb 2014
	 *
	 */
	public static function deleteCommentsOnTheBasisOfWallId($wallID){
	
		$em = \Zend_Registry::get('em');
		$q = $em->createQuery('delete from \Entities\comments c where c.commentsWall_post='.$wallID);
		$numDeleted = $q->execute();
	}
	/**
	 * function used to delete comments on the basis of photo id
	 * @param $wallID
	 * @author Sunny Patial
	 * @since 6,Feb 2014
	 *
	 */
	public static function deleteCommentsOnTheBasisOfPhotoId($photoID){
	
		$em = \Zend_Registry::get('em');
		$q = $em->createQuery('delete from \Entities\comments c where c.commentsSocialise_photo='.$photoID);
		$numDeleted = $q->execute();
	}
	
	/**
	 * Returns suitable photo according to if commenter is in blocked list of current user .
	 * @param int $commenter_user_id ( user to whom comment belong )
	 * @param array $comment_photo_arr 
	 * @author hkaur5
	 */
	public static function getUsersPhotoForComment($commenter_user_id, $blocked_user_arr)
	{
		$comment_photo_arr = array();
		//Check if the commenter user exist in $blocked_user_ids_arr i.e if i have blocked him or he has blocked me?
		if(in_array( $commenter_user_id, $blocked_user_arr ))
		{
			//user is female.
			if( $commenter_user_id == \Extended\ilook_user::USER_GENDER_FEMALE )
			{
				$comment_photo_arr['photo_path'] = IMAGE_PATH."/profile/default_profile_image_female_small.png";
			}
			else
			{
				$comment_photo_arr['photo_path'] = IMAGE_PATH."/profile/default_profile_image_male_small.png";
			}
			//should profile picture be clickable.
			$comment_photo_arr['is_photo_clickable'] = false;
		}
		else
		{
			$comment_photo_arr['photo_path'] = \Helper_common::getUserProfessionalPhoto( $commenter_user_id, 3 );
			$comment_photo_arr['is_photo_clickable'] = true;
		}
		
		return $comment_photo_arr;
		//End of code to check if the commenter user exist in $blocked_user_ids_arr i.e if i have blocked him or he has blocked me?
	}
	
	/**
	 * Returns current comment details with associated
	 * user
	 * 
	 * @param integer $user_id
	 * @param integer $wallpost_id
	 * @param array $logged_in_usersBlocked_users_arr ( users blocked by or user who has blocked -> user who is currently loggedin) [optional]
	 * @return array
	 * @version 1.0
	 * @author ssharma4
	 */
	public static function getcurrentCommentForMobileWallpost( $user_id, $wallpost_id, $comm_id,$logged_in_usersBlocked_users_arr = null, $for_mobile_app = 0 )
	{
		$ret_r = array();
		$em = \Zend_Registry::get('em');
		$qb = $em->createQueryBuilder();
		$q = $qb->select( 'comm, fromUsr.id, fromUsr.professional_image,fromUsr.account_closed_on, fromUsr.gender, fromUsr.firstname, fromUsr.lastname' )
		->from( '\Entities\comments', 'comm' )
		->leftJoin( 'comm.commentsIlook_user', 'fromUsr' )
		->where( 'comm.commentsWall_post = ?1' )
		->andWhere('comm.id = ?2')
		->setParameter( 1, $wallpost_id )
		->setParameter( 2, $comm_id )
		->orderBy( 'comm.id', 'DESC' );
		$q = $q->getQuery()->getResult( \Doctrine\ORM\Query::HYDRATE_ARRAY );
		
		$counter = 0;
		foreach ( $q as $key=>$data )
		{
			//If user is blocked then changing photo detail accordingly.
			if($logged_in_usersBlocked_users_arr)
			{
				$comment_user_photo_detail = \Extended\comments::getUsersPhotoForComment($data['id'], $logged_in_usersBlocked_users_arr);
			}
			else
			{
				$comment_user_photo_detail['photo_path'] = ($for_mobile_app == 1) ? \Helper_common::getUserProfessionalPhoto($data['id'], 0) : \Helper_common::getUserProfessionalPhoto($data['id'], 3);
				$comment_user_photo_detail['is_photo_clickable'] = true;
			}
			//Check if commenter user's account is closed then making his/her photo unclickable.
			if( $data['account_closed_on'] != null )
			{
				$comment_user_photo_detail['photo_path'] = ($for_mobile_app == 1) ? \Helper_common::getUserProfessionalPhoto($data['id'], 0) : \Helper_common::getUserProfessionalPhoto($data['id'], 3);
				$comment_user_photo_detail['is_photo_clickable'] = false;
			}
			//End of code of changing photo detail accordingly.
				
				
			if( \Extended\users_comments_visibility::IsCommentHiddenOnUserWall($data[0]['id'], $user_id ) )
			{
				$ret_r['is_hidden'] = 1;
			}
			else
			{
				$ret_r['is_hidden'] = 0;
			}
				
			if( $data['id'] == $user_id )
			{
				$ret_r['is_my_comment'] = 1;
			}
			else
			{
				$ret_r['is_my_comment'] = 0;
			}
			$ret_r['comment_id'] = $data[0]['id'];
			$ret_r['comment_text'] = $data[0]['comment_text'];
			$ret_r['comment_user_id'] = $data['id'];
			$ret_r['comment_profes_image'] = $comment_user_photo_detail['photo_path'];
			$ret_r['is_user_photo_clickable'] = $comment_user_photo_detail['is_photo_clickable'];
			$ret_r['comment_profes_image_medium_size'] = \Helper_common::getUserProfessionalPhoto($data['id'], 2);
			$ret_r['comment_user_name'] = $data['firstname']." ".$data['lastname'];
			$ret_r['created_at'] = \Helper_common::nicetime( $data[0]['created_at']->format("Y-m-d H:i:s") );
				
		}
		return $ret_r;
	}
}