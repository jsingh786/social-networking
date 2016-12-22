<?php

namespace Extended;

/**
 * This class has been made for
 * general purpose functions.
 *
 * @author Shaina
 * @version 1.0
 */
use Doctrine\ORM\Internal\Hydration\ObjectHydrator;

class wall_post extends \Entities\wall_post
{
// 	This defines that what type of post it is.
	const POST_UPDATE_TYPE_TEXT = 0;
	const POST_UPDATE_TYPE_LINK = 1;//URL
	const POST_UPDATE_TYPE_JOB = 2;//Not in use.
	const POST_UPDATE_TYPE_COMPANY = 3;//Not in use.
	const POST_UPDATE_TYPE_GROUP = 4;//Not in use.

	//=====================================================================
	//==> We need to remove this kind of wallposts as per new functionality.
	//=====================================================================
// 	const POST_UPDATE_TYPE_PHOTO = 5;
// 	const POST_UPDATE_TYPE_SHARED_PHOTO = 9;
	//----------------------------------------------------------------------
	
	const POST_UPDATE_TYPE_SHARED_TEXT = 6;
	const POST_UPDATE_TYPE_SHARED_LINK = 7;//Shared URL
	const POST_UPDATE_TYPE_NEWS = 8;
	const POST_UPDATE_TYPE_WISH = 11;
	const POST_UPDATE_TYPE_PROFILE_LINK = 12;//profile URL
	const POST_UPDATE_TYPE_SHARED_PROFILE_LINK = 13;//Shared profile URL.
	const POST_UPDATE_TYPE_PROFILE_PHOTO_CHANGED = 14;//When user chnages his profile photo and automatic post generates on his wall.
	const POST_UPDATE_TYPE_ALBUM = 15;
	const POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM = 16;
	const POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING = 17;
	
	
// 	this defines that post is automatically generated or ceated by user.
	const POST_TYPE_MANUAL = 1;
	const POST_TYPE_AUTO = 2;
	
	const WALL_TYPE_PROFESSIONAL = 1; //Dashboard
	const WALL_TYPE_SOCIALISE = 2;
	
	const VISIBILITY_CRITERIA_PUBLIC = 1;
	const VISIBILITY_CRITERIA_LINKS = 2;
	const VISIBILITY_CRITERIA_LINKS_OF_LINKS = 3;
	
	/**
	 * Pass an id and get its object.
	 *
	 * @param $id
	 * @return object of that class 
	 * @version 1.0
	 */
	public static function getRowObject($id)
	{
		$em = \Zend_Registry::get('em');
		$obj = $em->find('\Entities\wall_post',$id);
		return $obj;
	}
	
	/**
	 * function used to post/share
	 * on wall.
	 * 
	 * @param string $data
	 * @param integer $visibility_criteria
	 * @param integer $to_user
	 * @param integer $from_user
	 * @param integer $original_user
	 * @param integer $post_update_type
	 * @param integer $post_type
	 * @param string $post_text_when_shared
	 * @param integer $wall_type [optional] "default is professional"
	 * @param integer $post_tag_id
	 * @param integer $shared_from_wallpost_id (optional) 
	 * @author jsingh7, rkaur3, nsingh3
	 * @author hkaur5
	 * @author sjaiswal
	 * @version 1.3
	 * @return array with time and identity OR false
	 * 
	 * 
	 */
	public static function post_text( $data, 
			$visibility_criteria, 
			$to_user, 
			$from_user,
			$original_user, 
			$post_update_type,
			$post_type,
			$post_text_when_shared ="", 
			$wall_type = \Extended\wall_post::WALL_TYPE_PROFESSIONAL,
			$post_tag_id = null,
			$shared_from_wallpost_id = null )
	{
		$to_user_arr = array();
		if( !is_array($to_user) )
		{
			$to_user_arr[] = $to_user;
		}
		else
		{
			$to_user_arr = $to_user;
		}	
		$em = \Zend_Registry::get('em');
		$wall_post_obj = new \Entities\wall_post();
		$wall_post_obj -> setPost_update_type( $post_update_type );
		$wall_post_obj -> setPost_type( $post_type );
		$wall_post_obj -> setWall_type($wall_type);
		$wall_post_obj -> setWall_post_text( $data );
		$wall_post_obj -> setVisibility_criteria( $visibility_criteria );
		$wall_post_obj -> setWall_postsFrom_user( $em->find('\Entities\ilook_user', $from_user) );
		$wall_post_obj -> setWall_postsOriginal_user( $em->find('\Entities\ilook_user', $original_user) );
		$wall_post_obj -> setWall_post_text_when_shared( $post_text_when_shared );
		if($post_tag_id)
		{
			$wall_post_obj -> setPostTags( $em->find('\Entities\post_tags', $post_tag_id) );
		}
		if($shared_from_wallpost_id)
		{
			$shared_from_wallpost_obj = \Extended\wall_post::getRowObject($shared_from_wallpost_id);
			if($shared_from_wallpost_obj)
			{
				$wall_post_obj -> setShared_from_wallpost( $shared_from_wallpost_obj );
			}
		}
		$em -> persist( $wall_post_obj );
		$em -> flush();
		
		
		//Adding records for to_users for this wallpost.
// 		foreach ($to_user_arr as $to_user_id)
// 		{	
// 			\Extended\posted_to::addToUserOfWallpost($wall_post_obj->getId(), $to_user_id);
// 		}

		if(is_array($to_user_arr))
		{
			
			\Extended\posted_to::addToUsersOfWallpost($wall_post_obj->getId(), $to_user_arr);
		}
		else
		{
			\Extended\posted_to::addToUserOfWallpost($wall_post_obj->getId(), $to_user_arr);
		}
		
		$ret_r = array();
		$ret_r['wallpost_id'] = $wall_post_obj->getId();
		$ret_r['wallpost_text'] = $wall_post_obj->getWall_post_text();
		$ret_r['created_at'] = \Helper_common::nicetime( $wall_post_obj->getCreated_at()->format("Y-m-d H:i:s") );
		
		// Record admin activity log for posting text on wall(dasboard) 
		// and on sharing text from wall.
		if(\Zend_Registry::get('admin_logged_in_as_user'))
		{
			if(!empty($ret_r))
			{
			\Extended\admin_activity_log::addAdminActivityLog(\Zend_Registry::get('admin_logged_in_as_user'), \Auth_UserAdapter::getIdentity()->getId(), \Extended\admin_activity_log::MODULE_DASHBOARD);
			}
		}
		return $ret_r;
	}
	
	
	/**
	 * function used to post/share
	 * on wall.
	 *
	 * @param string $data
	 * @param integer $visibility_criteria
	 * @param integer $to_user
	 * @param integer $from_user
	 * @param integer $original_user
	 * @param integer $post_update_type
	 * @param integer $post_type
	 * @param string $post_text_when_shared
	 * @param integer $wall_type [optional] "default is professional"
	 * @param integer $post_tag_id 
	 * @param integer $shared_from_wallpost_id (optional)
	 * @author jsingh7
	 * @author hkaur5 
	 * @version 1.0
	 * @return array with time and identity OR false
	 */
	public static function post_url(
			 $data,
			 $url_data, 
			 $visibility_criteria, 
			 $to_user,
			 $from_user, 
			 $original_user,
			 $post_update_type,
			 $post_type,
			 $post_text_when_shared = "",
			 $wall_type = \Extended\wall_post::WALL_TYPE_PROFESSIONAL,
			 $post_tag_id = null,
			 $shared_from_wallpost_id = null)
	{
		
		$to_user_arr = array();
		if( !is_array($to_user) )
		{
			$to_user_arr[] = $to_user;
		}
		else
		{
			$to_user_arr = $to_user;
		}
		$em = \Zend_Registry::get('em');
		$wall_post_obj = new \Entities\wall_post();
		$wall_post_obj -> setPost_update_type( $post_update_type );
		$wall_post_obj -> setPost_type( $post_type );
		$wall_post_obj -> setWall_type( $wall_type );
		$wall_post_obj -> setWall_post_text( $data );
		$wall_post_obj -> setVisibility_criteria( $visibility_criteria );
		$wall_post_obj -> setWall_postsFrom_user( $em->find('\Entities\ilook_user', $from_user));
		$wall_post_obj -> setWall_postsOriginal_user( $em->find('\Entities\ilook_user', $original_user) );
		$wall_post_obj -> setWall_post_text_when_shared( $post_text_when_shared );
		$wall_post_obj -> setLink_data( $url_data );
		if($post_tag_id)
		{
		$wall_post_obj -> setPostTags( $em->find('\Entities\post_tags', $post_tag_id) );
		}
		
		if($shared_from_wallpost_id)
		{
			$shared_from_wallpost_obj = \Extended\wall_post::getRowObject($shared_from_wallpost_id);
			if($shared_from_wallpost_obj)
			{
				$wall_post_obj -> setShared_from_wallpost( $shared_from_wallpost_obj );
			}
		}
		$em -> persist( $wall_post_obj );
		$em -> flush();
			
		//Adding records for to_users for this wallpost.
// 		foreach ($to_user_arr as $to_user_id)
// 		{
// 			\Extended\posted_to::addToUserOfWallpost($wall_post_obj->getId(), $to_user_id);
// 		}

		if(is_array($to_user_arr))
		{
				
			\Extended\posted_to::addToUsersOfWallpost($wall_post_obj->getId(), $to_user_arr);
		}
		else
		{
			\Extended\posted_to::addToUserOfWallpost($wall_post_obj->getId(), $to_user_arr);
		}
		
		$ret_r = array();
		$ret_r['wallpost_id'] = $wall_post_obj->getId();
		$ret_r['wallpost_text'] = $wall_post_obj->getWall_post_text();
		$ret_r['created_at'] = \Helper_common::nicetime( $wall_post_obj->getCreated_at()->format("Y-m-d H:i:s") );
		
		// Record admin activity log for post on wall(dasboard)
		// and on sharing url from wall.
		 if(\Zend_Registry::get('admin_logged_in_as_user'))
		{
			if(!empty($ret_r))
			{
				\Extended\admin_activity_log::addAdminActivityLog(\Zend_Registry::get('admin_logged_in_as_user'), \Auth_UserAdapter::getIdentity()->getId(), \Extended\admin_activity_log::MODULE_DASHBOARD);
			}
		} 
		
		return $ret_r;
			
	}
		
	/**
	 * function used to add record in wallpost table when we
	 * post photos or album on wall or when posting profile
	 * photo on wall.
	 * 
	 * It saves record in wallpost table.
	 * 
	 * @param string  $wall_text
	 * @param integer $visibility_criteria
	 * @param integer $to_user
	 * @param integer $from_user
	 * @param integer $original_user [ Who posted this first ]
	 * @param integer $post_update_type
	 * @param integer $post_type
	 * @param integer $wall_type
	 * @param integer $photo_group_id
	 * @param integer $album_id
	 * @param integer $photo_id [optional]
	 * @param string $wall_text_when_shared [optional]
	 * @param string $shared_from_wallpost_id [optional]
	 * 
	 * @author jsingh7
	 * @version 1.1
	 * @return identity or false
	 */
	public static function post_photo( $wall_text, 
										$visibility_criteria, 
										$to_user, 
										$from_user, 
										$original_user, 
										$post_update_type, 
										$post_type, 
										$wall_type, 
										$photo_group_id, 
										$album_id, 
										$photo_id = null, 
										$wall_text_when_shared = null, 
										$shared_from_wallpost_id = null )
	{
		//Making to_user array so that it can work for single as well as multiple to_user. 
		$to_user_arr = array();
		if( !is_array($to_user) )
		{
			$to_user_arr[] = $to_user;
		}
		else
		{
			$to_user_arr = $to_user;
		}
		
		$em = \Zend_Registry::get('em');
		$wall_post_obj = new \Entities\wall_post();
		$wall_post_obj -> setWall_post_text( $wall_text );
		if( $wall_text_when_shared ):
			$wall_post_obj -> setWall_post_text_when_shared( $wall_text_when_shared );
		endif;
		$wall_post_obj -> setVisibility_criteria( $visibility_criteria );
		$wall_post_obj -> setWall_postsFrom_user($em->find('\Entities\ilook_user', $from_user ) );
		$wall_post_obj -> setWall_postsOriginal_user( $em->find('\Entities\ilook_user', $original_user ) );
		$wall_post_obj -> setPost_update_type( $post_update_type );
		$wall_post_obj -> setPost_type( $post_type );
		$wall_post_obj -> setWall_type($wall_type);
		
		if( $photo_group_id )
		{
			$wall_post_obj -> setPhotoGroup( \Extended\photo_group::getRowObject($photo_group_id) );
		}
		$wall_post_obj -> setWall_postsSocialise_album( \Extended\socialise_album::getRowObject($album_id) );
		$wall_post_obj -> setLike_count(NULL);
		
		if( $photo_id )
		{
		     $wall_post_obj -> setSocialisePhoto( \Extended\socialise_photo::getRowObject( $photo_id ) );
		}
		if($shared_from_wallpost_id)
		{
			$shared_from_wallpost_obj = \Extended\wall_post::getRowObject($shared_from_wallpost_id);
			if($shared_from_wallpost_obj)
			{
				$wall_post_obj -> setShared_from_wallpost( $shared_from_wallpost_obj );
			}
		}
		$em -> persist( $wall_post_obj );
		$em -> flush();
		
		//Adding records for to_users for this wallpost.
// 		foreach ($to_user_arr as $to_user_id)
// 		{
// 			\Extended\posted_to::addToUserOfWallpost($wall_post_obj->getId(), $to_user_id);
// 		}
		if(is_array($to_user_arr))
		{
				
			\Extended\posted_to::addToUsersOfWallpost($wall_post_obj->getId(), $to_user_arr);
		}
		else
		{
			\Extended\posted_to::addToUserOfWallpost($wall_post_obj->getId(), $to_user_arr);
		}
		
		// Record admin activity log for posting photos on wall(socialise)
		if(\Zend_Registry::get('admin_logged_in_as_user'))
		{
			if($wall_post_obj)
			{
					
				\Extended\admin_activity_log::addAdminActivityLog(\Zend_Registry::get('admin_logged_in_as_user'), \Auth_UserAdapter::getIdentity()->getId(), \Extended\admin_activity_log::MODULE_DISPLAY);
			}
		}			
		return $wall_post_obj -> getId();
	}
	
	/**
	 * function used to post wish
	 * on wall.
	 *
	 * @param string  $wall_text
	 * @param integer $visibility_criteria
	 * @param integer $to_user
	 * @param integer $from_user
	 * @param integer $original_user [ Who posted this first ]
	 * @param integer $post_update_type
	 * @param integer $post_type
	 * @param integer $wall_type
	 *
	 * @author jsingh7
	 * @version 1.0
	 * @return identity or false
	 */
	public static function post_wish( $wall_text, $visibility_criteria, $to_user, $from_user, $original_user, $post_update_type, $post_type, $wall_type )
	{
		//\Zend_Debug::dump($album_id);echo 'dg';die;
		//Making to_user array so that it can work for single as well as multiple to_user.
		$to_user_arr = array();
		if( !is_array($to_user) )
		{
			$to_user_arr[] = $to_user;
		}
		else
		{
			$to_user_arr = $to_user;
		}
		$em = \Zend_Registry::get('em');
		$wall_post_obj = new \Entities\wall_post();
		$wall_post_obj -> setWall_post_text( $wall_text );
		$wall_post_obj -> setVisibility_criteria( $visibility_criteria );
		$wall_post_obj -> setWall_postsFrom_user( \Extended\ilook_user::getRowObject( $from_user ) );
		$wall_post_obj -> setWall_postsOriginal_user( \Extended\ilook_user::getRowObject( $original_user ) );
		$wall_post_obj -> setPost_update_type( $post_update_type );
		$wall_post_obj -> setPost_type( $post_type );
		$wall_post_obj -> setWall_type($wall_type);
		$wall_post_obj -> setLike_count(NULL);
		$em -> persist( $wall_post_obj );
		$em -> flush();
		//Adding records for to_users for this wallpost.
// 		foreach ($to_user_arr as $to_user_id)
// 		{
// 			\Extended\posted_to::addToUserOfWallpost($wall_post_obj->getId(), $to_user_id);
// 		}

		if(is_array($to_user_arr))
		{
				
			\Extended\posted_to::addToUsersOfWallpost($wall_post_obj->getId(), $to_user_arr);
		}
		else
		{
			\Extended\posted_to::addToUserOfWallpost($wall_post_obj->getId(), $to_user_arr);
		}
		
		return $wall_post_obj -> getId();
	}
	
	/**
	
	/**
	 * Returns wall posts of user in the form of array with two indexes,
	 * first index contains data and other information
	 * regarding more data, means is there any more wallposts available
	 * after this.
	 * -------------------------------------------------------
	 * This function is inpired from getUserWall function but
	 * modified to do most of the work in PHP only and return lite and minimum data to JS.
	 * -------------------------------------------------------
	 * @param integer $userId [loggedin user ]
	 * @param integer $offset
	 * @param integer $limit
	 * @param integer $wall_type [optional][default = WALL_TYPE_PROFESSIONAL], If NULL passed then it will not check wall type.
	 * @param boolean $for_mobile
	 * @param integer $tag_id [optional][default = General], If NULL passed then it will not check tag id.
	 * @author jsingh7
	 * @author sjaiswal
	 * @return array or 0
	 * @version 1.1
	 */
	public static function getUserWall_lite( $userId, $offset = 0 , 
			$limit = 10, $wall_type = self::WALL_TYPE_PROFESSIONAL, 
			$for_mobile = false, $tag_id = 0)
	{
		//------------------------------------------------
		//Fetching records of users who has been blocked.
		//------------------------------------------------
		$blocked_user_ids_arr = \Extended\blocked_users::getAllBlockersAndBlockedUsers($userId);
		//---------------------------------------------------
		//End Fetching records of users who has been blocked.
		//---------------------------------------------------
		
		$return_r = array();
		
		$em = \Zend_Registry::get('em');
		
		// Enable / Disable filter, for specified entity (default is enabled for all)
		$filter = $em->getFilters()->disable('soft-deleteable');
		$filter->disableForEntity('\Entities\wall_post');
		$filter->disableForEntity('\Entities\ilook_user');
		
		$user_obj = \Extended\ilook_user::getRowObject( $userId );
		
		$my_links_r = explode( ",", $user_obj->getLink_list() );
		
		//GETTING RECORDS(WALLPOSTS) ACCORDING TO LIMIT AND OFFSET.
		//QUERY 1
		$qb = $em->createQueryBuilder();
		$q = $qb->select( 'wp.id, wp.last_activity_datetime' )
		->from( '\Entities\wall_post', 'wp' )
		->LeftJoin( 'wp.wall_postsLikes', 'likes' )
		->LeftJoin( 'wp.wall_postsShare', 'shares' )
		->LeftJoin( 'wp.wall_postsComment', 'comments' )
		->leftJoin( 'wp.wall_postsFrom_user', 'fromUser')
		->leftJoin( 'wp.postedTo', 'postdto')
		->LeftJoin( 'wp.postTags', 'postTags' );
		
		if( $wall_type == self::WALL_TYPE_SOCIALISE )
		{
    		$q->leftJoin( 'wp.wall_postsSocialise_album','album');
    		$q->leftJoin( 'album.socialise_albumsSocialise_photo','photo');
    		$q->having('count(photo) > 0 OR wp.post_update_type = 11');
		}
		
		$q->setParameter( 'my_links_r', $my_links_r )
		->setParameter( 1, $userId )
		
		->setFirstResult( $offset )
		->setMaxResults( $limit )
		->groupBy( 'wp.id, wp.last_activity_datetime, wp.post_update_type' )
		->orderBy( 'wp.last_activity_datetime', 'DESC' );
		
		//Checks that post should have at least one To_user. That is post has been posted to aleast one user. 
		$q->having('count(postdto) > 0');
		
		if( $wall_type )
		{
		
			//$q->where( 'wp.wall_postsFrom_user = ?1 AND wp.wall_type = ?4' );
			$q->orWhere( 'postdto.ilookUser = ?1 AND wp.wall_type = ?4' );
			$q->orWhere( 'postdto.ilookUser IN (:my_links_r) AND wp.wall_type = ?4' );
			$q->orWhere( 'likes.likesLiked_by IN (:my_links_r) AND wp.wall_type = ?4' );
			$q->orWhere( 'shares.sharesShared_by IN (:my_links_r) AND wp.wall_type = ?4' );
			$q->orWhere( 'comments.commentsIlook_user IN (:my_links_r) AND wp.wall_type = ?4' );
			$q->andWhere('fromUser.account_closed_on is null');
			if($tag_id)
			{
			$q->andWhere('postTags.id = ?5');
			$q->setParameter( 5, $tag_id );
			}
			if( $blocked_user_ids_arr ):
				$q->setParameter( 'blocked_users_r', $blocked_user_ids_arr );
				$q->andWhere( 'wp.wall_postsFrom_user NOT IN (:blocked_users_r)' );
			endif;
			
			$q->setParameter( 4, $wall_type );
			
		}

 		$q = $q->getQuery()->getResult( \Doctrine\ORM\Query::HYDRATE_ARRAY );

		if( !$q )
		{
			$return_r["data"] = 0;
			$return_r["is_there_more_recs"] = 0;
			return $return_r;
			
		}
		
		$selected_wp_ids_r = array();
		foreach ( $q as $selected_wp_id )
		{
			$selected_wp_ids_r[] = $selected_wp_id['id'];
		}
		
		//GETTING WALL POSTS ACCORDING TO SELECTED RECORDS IN QUERY 1.
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select('wp, fromUsr.id, 
		                      fromUsr.professional_image, 
		                      fromUsr.gender, 
		                      fromUsr.firstname, 
		                      fromUsr.lastname')
		->from( '\Entities\wall_post', 'wp' )
		->LeftJoin( 'wp.wall_postsFrom_user', 'fromUsr' )
		->where( 'wp.id IN (:selected_wp_ids_r)' )
		->setParameter( 'selected_wp_ids_r', $selected_wp_ids_r )
		->orderBy( 'wp.last_activity_datetime', 'DESC' );
		
		// wallpost Comments join
		$q_1->addSelect( 'wall_comments, comment_user' );
		$q_1->LeftJoin( 'wp.wall_postsComment', 'wall_comments' );
		$q_1->LeftJoin( 'wall_comments.commentsIlook_user', 'comment_user' );
		
		// wallpost Likes join
		$q_1->addSelect( 'likes' );
		$q_1->LeftJoin( 'wp.wall_postsLikes', 'likes' );
		$q_1->LeftJoin( 'likes.likesLiked_by', 'likedByUser' );
	
		$q_1 = $q_1->getQuery()->getResult ();

	
		
		if( !$q_1 )
		{
			$return_r["data"] = 0;
			$return_r["is_there_more_recs"] = 0;
			return $return_r;
		}
	
		//Checking that is there any more wall posts to show, checking according to same conditions and cretiria.
		// According to Query 1
		$last_record = end( $q );
		$oldest_datetime = $last_record['last_activity_datetime'];
	
		$qb_2 = $em->createQueryBuilder();
		
		$q_2 = $qb_2->select( 'wp.id' )
        		->from( '\Entities\wall_post', 'wp' )
        		->LeftJoin( 'wp.wall_postsLikes', 'likes' )
        		->LeftJoin( 'wp.wall_postsShare', 'shares' )
        		->LeftJoin( 'wp.wall_postsComment', 'comments' )
        		->leftJoin( 'wp.wall_postsFrom_user','fromUser')
        		->leftJoin( 'wp.postedTo', 'postdto')
				->leftJoin( 'wp.postTags', 'postTags' );
        		if( $wall_type == self::WALL_TYPE_SOCIALISE )
        		{
        			$q_2->leftJoin( 'wp.wall_postsSocialise_album','album');
        			$q_2->leftJoin( 'album.socialise_albumsSocialise_photo','photo');
        			$q_2->having('count(photo) > 0 OR wp.post_update_type = 11');
        		}
        		
        		$q_2->setParameter( 'my_links_r', $my_links_r )
        		->setParameter( 1, $userId )
        		->setParameter( 5, $oldest_datetime )
        		->groupBy( 'wp.id, wp.last_activity_datetime, wp.post_update_type' )
        		->orderBy( 'wp.last_activity_datetime', 'DESC' );
		
		if( $wall_type )
		{
// 			$q_2->where( 'wp.wall_postsFrom_user = ?1 AND wp.wall_type = ?4 AND wp.last_activity_datetime < ?5' );
// 			$q_2->orWhere( 'wp.wall_postsFrom_user IN (:my_links_r) AND wp.wall_type = ?4 AND wp.last_activity_datetime < ?5' );
			
			$q_2->orWhere( 'postdto.ilookUser = ?1 AND wp.wall_type = ?4 AND wp.last_activity_datetime < ?5' );
			$q_2->orWhere( 'postdto.ilookUser IN (:my_links_r) AND wp.wall_type = ?4 AND wp.last_activity_datetime < ?5' );
			
			$q_2->orWhere( 'likes.likesLiked_by IN (:my_links_r) AND wp.wall_type = ?4 AND wp.last_activity_datetime < ?5' );
			$q_2->orWhere( 'shares.sharesShared_by IN (:my_links_r) AND wp.wall_type = ?4 AND wp.last_activity_datetime < ?5' );
			$q_2->orWhere( 'comments.commentsIlook_user IN (:my_links_r) AND wp.wall_type = ?4 AND wp.last_activity_datetime < ?5' );
			$q_2->andWhere('fromUser.account_closed_on is null');
			if($tag_id)
			{
				$q_2->andWhere('postTags.id = :tag_id');
				$q_2->setParameter( 'tag_id', $tag_id );
			}  
			if( $blocked_user_ids_arr ):
				$q_2->setParameter( 'blocked_users_r', $blocked_user_ids_arr );
				$q_2->andWhere( 'wp.wall_postsFrom_user NOT IN (:blocked_users_r)' );
			endif;
			$q_2->setParameter( 4, $wall_type );
		}
	
		//\Zend_Debug::dump($q_2->getQuery ()->getSQL()); die;
		$q_2 = $q_2->getQuery ()->getResult ( \Doctrine\ORM\Query::HYDRATE_ARRAY );
		
		
		foreach ( $q_1 as $key=>$wall_post )
		{
			//WALL POST INFO
			
			$return_r["data"]["wallpost"][$key]['id'] = $wall_post[0]->getId();
			$return_r["data"]["wallpost"][$key]['post_update_type'] = $wall_post[0]->getPost_update_type();
			
			if( $wall_post[0]->getWall_post_text() !=  null ):
				$return_r["data"]["wallpost"][$key]['wallpost_text'] = $wall_post[0]->getWall_post_text();
				$return_r["data"]["wallpost"][$key]['wallpost_text_striped'] = strip_tags($wall_post[0]->getWall_post_text(),'<br>');
			else:
				$return_r["data"]["wallpost"][$key]['wallpost_text'] = "";
				$return_r["data"]["wallpost"][$key]['wallpost_text_striped'] = "";
			endif;
			
			if( $wall_post[0]->getWall_post_text_when_shared() !=  null ):
				$return_r["data"]["wallpost"][$key]['wall_post_text_when_shared'] = $wall_post[0]->getWall_post_text_when_shared();
			else:
				$return_r["data"]["wallpost"][$key]['wall_post_text_when_shared'] = "";
			endif;
			
			$return_r["data"]["wallpost"][$key]['visibility_criteria'] = $wall_post[0]->getVisibility_criteria();
			$return_r["data"]["wallpost"][$key]['wall_type'] = $wall_post[0]->getWall_type();
			$return_r["data"]["wallpost"][$key]['comment_count'] = $wall_post[0]->getWall_postsComment()->count(); 
			$return_r["data"]["wallpost"][$key]['like_count'] = $wall_post[0]->getWall_postsLikes()->count(); 
			$return_r["data"]["wallpost"][$key]['share_count'] = $wall_post[0]->getWall_postsShare()->count();
			$return_r["data"]["wallpost"][$key]['post_type'] = $wall_post[0]->getPost_type();
			$return_r["data"]["wallpost"][$key]['group_id'] = $wall_post[0]->getGroup_id();
			$return_r["data"]["wallpost"][$key]['job_id'] = $wall_post[0]->getJob_id();
			$return_r["data"]["wallpost"][$key]['company_id'] = $wall_post[0]->getCompany_id();
			$return_r["data"]["wallpost"][$key]['did_I_liked'] = self::didUserLikedWallpost($userId, $wall_post[0]->getId());
			$return_r["data"]["wallpost"][$key]['tag_id'] = $wall_post[0]->getPostTags()?$wall_post[0]->getPostTags()->getId():"";
			$return_r["data"]["wallpost"][$key]['sharers_string']["string"] = false;
			$return_r["data"]["wallpost"][$key]['sharers_string']["shared_from_wallpost_exist"] = false;
			
			
			if( $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_PROFILE_LINK || $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_SHARED_PROFILE_LINK )
			{
				$link_data = \Zend_Json::decode( $wall_post[0]->getLink_data() );
				$shared_profile_user_id = $link_data["shared_profile_user_id"];
				
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
				
				$return_r["data"]["wallpost"][$key]['url_data']['url_title'] = $shared_profile_user_obj->getFirstname()." ".$shared_profile_user_obj->getLastname();
				$return_r["data"]["wallpost"][$key]['url_data']['url_content'] = "Check out ".$return_r["data"]["wallpost"][$key]['url_data']['url_title']."'s professional Profile and Connect with ".$him." on iLook.";
				$return_r["data"]["wallpost"][$key]['url_data']['image_src'] = \Helper_common::getUserProfessionalPhoto( $shared_profile_user_obj->getId(), 2 );
			}
			else
			{	
				$return_r["data"]["wallpost"][$key]['url_data'] = \Zend_Json::decode( $wall_post[0]->getLink_data() );
			}
			
			// Get all 'to_users' of current wallpost.
			$to_users = array();
			
			foreach($wall_post[0]->getPostedTo() as $posted_to_user )
			{
				$to_users[] = $posted_to_user->getIlookUser()->getId();
			}
			$return_r["data"]["wallpost"][$key]['is_ok_comment_share_pannel_visible'] = \Helper_common::is_ok_comment_share_pannel_visible( $wall_post[0]->getVisibility_criteria(), $wall_post[0]->getWall_postsFrom_user()->getId(), $to_users, $userId );
			$return_r["data"]["wallpost"][$key]['created_at'] = \Helper_common::nicetime( $wall_post[0]->getCreated_at()->format("Y-m-d H:i:s") );
			$return_r["data"]["wallpost"][$key]['last_activity_datetime'] = $wall_post[0]->getLast_activity_datetime()->format("Y-m-d H:i:s") ;
			$return_r["data"]["wallpost"][$key]['likers_string'] = \Helper_common::getLikersStringByWallpostId( $wall_post[0]->getId(), $userId );

			
			//If post is shared post then get sharer_users string.
			if($wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_SHARED_TEXT 
			    || $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_SHARED_LINK 
			    || $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_SHARED_PROFILE_LINK
			    || $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING)
			{
				if($wall_post[0]->getShared_from_wallpost())
				{
					$return_r["data"]["wallpost"][$key]['sharers_string']["string"] = \Helper_common::getSharerStringforPost($wall_post[0]->getId(), $userId);
					$return_r["data"]["wallpost"][$key]['shared_post_info'] = \Helper_common::getSharedPostInfoArray($wall_post[0]->getId(), $userId);
					$return_r["data"]["wallpost"][$key]['sharers_string']["shared_from_wallpost_exist"] = true;
					//$return_r["data"]["wallpost"][$key]['original_user']['post_created_at'] = \Helper_common::nicetime( $wall_post[0]->getShared_from_wallpost()->getCreated_at()->format("Y-m-d H:i:s") );
				}
				else
				{
					$return_r["data"]["wallpost"][$key]['sharers_string']["string"]  = $wall_post[0]->getWall_postsFrom_user()->getFirstname().' '.$wall_post[0]->getWall_postsFrom_user()->getLastname();
					$return_r["data"]["wallpost"][$key]['shared_post_info'] = null;
					$return_r["data"]["wallpost"][$key]['sharer_user_name'] = $wall_post[0]->getWall_postsFrom_user()->getFirstname().' '.$wall_post[0]->getWall_postsFrom_user()->getLastname();
					$return_r["data"]["wallpost"][$key]['sharers_string']["shared_from_wallpost_exist"] = false;
					//$return_r["data"]["wallpost"][$key]['original_user']['post_created_at'] = "";
					
				}
				
				//Created_at time of original post or photo group=====================================================
				// This has to be checked as post can be created by sharing post or photo from photo detail( Photos may belong to photo group or album)
				if($wall_post[0]->getShared_from_wallpost())
				{
					$return_r["data"]["wallpost"][$key]['original_user']['post_created_at'] = \Helper_common::nicetime( $wall_post[0]->getShared_from_wallpost()->getCreated_at()->format("Y-m-d H:i:s") );
				}
				else if($wall_post[0]->getPhotoGroup())
				{
					$return_r["data"]["wallpost"][$key]['original_user']['post_created_at'] = \Helper_common::nicetime( $wall_post[0]->getPhotoGroup()->getCreated_at()->format("Y-m-d H:i:s") );
					
				}
				else if ($wall_post[0]->getWall_postsSocialise_album())
				{
					$return_r["data"]["wallpost"][$key]['original_user']['post_created_at'] = \Helper_common::nicetime( $wall_post[0]->getWwall_postsSocialise_album()->getCreated_at_timestamp()->format("Y-m-d H:i:s") );
					
				}
				else
				{
					$return_r["data"]["wallpost"][$key]['original_user']['post_created_at'] = "";
				}
			}
			
			//END - Created_at time of original post/photo group=====================================================

			$wall_post_blockedusers = \Extended\blocked_users::getAllBlockersAndBlockedUsers($userId);
			$return_r["data"]["wallpost"][$key]['is_my_wallpost'] = $wall_post[0]->getWall_postsFrom_user()->getId() == $userId?1:0;
			
			
			try {$em->getFilters()->disable('soft-deleteable');} catch (\Exception $e) {}
			
			$original_user_obj = $em->find('\Entities\ilook_user', $wall_post[0]->getWall_postsOriginal_user()->getId());
			
			$return_r["data"]["wallpost"][$key]['original_user']['id'] = $original_user_obj->getId();
			$return_r["data"]["wallpost"][$key]['original_user']['fullname'] = $original_user_obj->getFirstname()." ".$original_user_obj->getLastname();
			$return_r["data"]["wallpost"][$key]['original_user']['user_type'] = $original_user_obj->getUser_type();
			$return_r["data"]["wallpost"][$key]['original_user']['profile_photo'] = \Helper_common::getUserProfessionalPhoto( $original_user_obj->getId(), 3,false,$wall_post_blockedusers);
			$return_r["data"]["wallpost"][$key]['original_user']['photo_medium_size'] = \Helper_common::getUserProfessionalPhoto( $original_user_obj->getId(), 2,false,$wall_post_blockedusers );
			
			
			if(  $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_SHARED_TEXT 
			    || $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_SHARED_LINK 
			    || $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_SHARED_PROFILE_LINK
			   	|| $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING)
			{
				//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				// 'From_user' array contains same values as original_user !Data Redundancy!. 
				// It has been replaced by original user array in dashboard section(javascript where consumed) but not deleted from here as
				// it could have been used in web services and moreover some indexes of 'from_user' are not present in 'original_user' like
				// 'shared_walltext' and 'is_deleted'. Please remove one of the both as it can create confusion on later stages.
				// - hkaur5
				//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				$return_r["data"]["wallpost"][$key]['from_user']['id'] = $original_user_obj->getId();
				$return_r["data"]["wallpost"][$key]['from_user']['user_type'] = $original_user_obj->getUser_type();
				$return_r["data"]["wallpost"][$key]['from_user']['is_deleted'] = $original_user_obj->getDeleted_at()?1:0;
				$return_r["data"]["wallpost"][$key]['from_user']['fullname'] = $original_user_obj->getFirstname()." ".$original_user_obj->getLastname();
				$return_r["data"]["wallpost"][$key]['from_user']['photo'] = \Helper_common::getUserProfessionalPhoto( $original_user_obj->getId(), 3 );
				$return_r["data"]["wallpost"][$key]['from_user']['photo_medium_size'] = \Helper_common::getUserProfessionalPhoto( $original_user_obj->getId(), 2 );
	
				if($wall_post[0]->getShared_from_wallpost())
				{
					$return_r["data"]["wallpost"][$key]['from_user']['shared_walltext'] = $wall_post[0]->getShared_from_wallpost()->getwall_post_text();
				}
				else if( $wall_post[0]->getWall_post_text_when_shared()!= null)
				{
					$return_r["data"]["wallpost"][$key]['from_user']['shared_walltext'] = $wall_post[0]->getWall_post_text_when_shared();
				}
				else
				{
					$return_r["data"]["wallpost"][$key]['from_user']['shared_walltext'] = "";
				}
			}
			else
			{
				$return_r["data"]["wallpost"][$key]["from_user"] = null;
			}
			
			//WALLPOST USER INFO=====================
			$return_r["data"]["wallpost"][$key]['wallpost_user_id'] = $wall_post[0]->getWall_postsFrom_user()->getId();
				
			$return_r["data"]["wallpost"][$key]['wallpost_user_prof_image_path'] = \Helper_common::getUserProfessionalPhoto($wall_post[0]->getWall_postsFrom_user()->getId(), 3 );
			$return_r["data"]["wallpost"][$key]['wallpost_user_prof_image_medium_size_path'] = \Helper_common::getUserProfessionalPhoto($wall_post[0]->getWall_postsFrom_user()->getId(), 2);
			
			$return_r["data"]["wallpost"][$key]['wallpost_user_type'] = $wall_post[0]->getWall_postsFrom_user()->getUser_type();
			$return_r["data"]["wallpost"][$key]['wallpost_user_name'] = $wall_post[0]->getWall_postsFrom_user()->getFirstname()." ".$wall_post[0]->getWall_postsFrom_user()->getLastname();
			$return_r["data"]["wallpost"][$key]['wallpost_user_gender'] = $wall_post[0]->getWall_postsFrom_user()->getGender();
			$return_r["data"]["wallpost"][$key]['is_wallpost_reported_abuse'] = \Extended\report_abuse::getAbuseReport($userId,$wall_post[0]->getId());
			
			//$return_r["data"]["wallpost"][$key]['wallpost_user_name'] = $user_obj->getFirstname()." ".$user_obj->getLastname();
			
			//WALLPOST SOCIALISE PHOTO INFO
			if( $wall_type && $wall_type == self::WALL_TYPE_SOCIALISE )
			{
			    // Getting max first five images of this wall-post
			    if( $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM
			        || $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING 
			        )
			    {
			  
			        $photos = $em->getRepository('\Entities\socialise_photo')->findBy( array(
    			                                                                         'socialise_photosSocialise_album'=>$wall_post[0]->getWall_postsSocialise_album()->getId(), 
    			                                                                         'photoGroup'=>$wall_post[0]->getPhotoGroup()->getId() ),
			                                                                          array('id' => 'ASC'), 5, 0);
			        
			        foreach ( $photos as $keyy => $photo )
			        {
			            $return_r["data"]["wallpost"][$key]['collage'][$keyy]['image_path'] = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_default/wall_thumbnails/thumbnail_".$photo->getImage_name();
			            $return_r["data"]["wallpost"][$key]['collage'][$keyy]['image_id'] = $photo->getId();
			            $return_r["data"]["wallpost"][$key]['collage'][$keyy]['image_desc'] = $photo->getDescription();
			        }
			        
			        $size = @getimagesize( $return_r["data"]["wallpost"][$key]['collage'][0]['image_path'] );
			        
			        $aspect = 1;
			        if( $size )
			        {
				        $width = $size[0];
				        $height = $size[1];
				        $aspect = $height / $width;
			        }
			        if ($aspect >= 1)
			        {
			            //vertical
			           $return_r["data"]["wallpost"][$key]['first_img_portrait_or_landscape'] = 1;
			        }
			        else
			        {
			            //horizontal
			            $return_r["data"]["wallpost"][$key]['first_img_portrait_or_landscape'] = 2;
			        }
			        
			        //First 10 images with some informatiom.
			        if( $for_mobile )
			        {
			        	$photoss = $em->getRepository('\Entities\socialise_photo')->findBy( array(
			        			'socialise_photosSocialise_album'=>$wall_post[0]->getWall_postsSocialise_album()->getId(),
			        			'photoGroup'=>$wall_post[0]->getPhotoGroup()->getId() ),
			        			array(
			        					'id' => 'ASC'
			        			), 10, 0);
			        	
			        	
			        	
				        foreach ( $photoss as $keyymm => $photo )
				        {
	    			            $return_r["data"]["wallpost"][$key]['collage'][$keyymm]['realPhoto'] = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_default/wall_thumbnails/thumbnail_".$photo->getImage_name();
	    			            $return_r["data"]["wallpost"][$key]['collage'][$keyymm]['photoID'] = $photo->getId();
	    			            $return_r["data"]["wallpost"][$key]['collage'][$keyymm]['no_of_comments'] = $photo->getSocialise_photosComment()->count()?$photo->getSocialise_photosComment()->count():0;
	    			            $return_r["data"]["wallpost"][$key]['collage'][$keyymm]['no_of_oks'] = $photo->getSocialise_photosLike()->count()?$photo->getSocialise_photosLike()->count():0;
	    			            $return_r["data"]["wallpost"][$key]['collage'][$keyymm]['no_of_shares'] = $photo->getSocialise_photosShare()->count()?$photo->getSocialise_photosShare()->count():0;
	    			            $return_r["data"]["wallpost"][$key]['collage'][$keyymm]['am_I_ok_this_photo'] = \Extended\socialise_photo::didUserLikedPhoto($userId, $photo->getId());
	    			            
	    			           
	    			           
	    			            
				        }
				        $return_r["data"]["wallpost"][$key]['total_photos_in _album'] = $wall_post[0]->getWall_postsSocialise_album()->getSocialise_albumsSocialise_photo()->count();
				    }	
			        
			    }
			    
			    // Getting max first five images of this wallpost
			    else if( $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_ALBUM )
			    {
			        $photos = $em->getRepository('\Entities\socialise_photo')->findBy( array(
                                        			            'socialise_photosSocialise_album'=>
			                                                         $wall_post[0]->getWall_postsSocialise_album()->getId() ),
                                        			            array(
                                        			                'id' => 'ASC'
                                        			            ), 5, 0);
			        
			        //$album_obj = \Extended\socialise_album::getRowObject($wall_post[0]->getWall_postsSocialise_album()->getId());
			        $album_name = $wall_post[0]->getWall_postsSocialise_album()->getAlbum_name();
		            $album_timestamp = $wall_post[0]->getWall_postsSocialise_album()->getCreated_at_timestamp()->getTimestamp();
		            $return_r["data"]["wallpost"][$key]['album_name'] = $album_name;
		            $return_r["data"]["wallpost"][$key]['album_display_name'] = $wall_post[0]->getWall_postsSocialise_album()->getAlbum_display_name();;
		            $return_r["data"]["wallpost"][$key]['album_id'] = $wall_post[0]->getWall_postsSocialise_album()->getId();
			        foreach ( $photos as $keyy => $photo )
			        {
    			            $image_path = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_".$album_name."_".$album_timestamp."/wall_thumbnails/thumbnail_".$photo->getImage_name();
    			            $return_r["data"]["wallpost"][$key]['collage'][$keyy]['image_path'] = $image_path;
    			            $return_r["data"]["wallpost"][$key]['collage'][$keyy]['image_id'] = $photo->getId();
    			            $return_r["data"]["wallpost"][$key]['collage'][$keyy]['image_desc'] = $photo->getDescription();
    			            
			        }
			         
			        $size = @getimagesize( $return_r["data"]["wallpost"][$key]['collage'][0]['image_path'] );

			        $aspect = 1;
			        if( $size )
			        {
			            $width = $size[0];
			            $height = $size[1];
			            $aspect = $height / $width;
			        }
			        if ($aspect >= 1)
			        {
			            //vertical
			            $return_r["data"]["wallpost"][$key]['first_img_portrait_or_landscape'] = 1;
			        }
			        else
			        {
			            //horizontal
			            $return_r["data"]["wallpost"][$key]['first_img_portrait_or_landscape'] = 2;
			        }
			        
			        if( $for_mobile ==true)
			        {
			        	 $photoss = $em->getRepository('\Entities\socialise_photo')->findBy( array(
                                        			            'socialise_photosSocialise_album'=>
			                                                         $wall_post[0]->getWall_postsSocialise_album()->getId() ),
                                        			            array(
                                        			                'id' => 'ASC'
                                        			            ), 10, 0);
			        	
			         	foreach ( $photoss as $keyymm => $photo )
				        {
				        	
	    			            $image_path = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_".$album_name."_".$album_timestamp."/wall_thumbnails/thumbnail_".$photo->getImage_name();
	    			            $return_r["data"]["wallpost"][$key]['collage'][$keyymm]['realPhoto'] = $image_path;
	    			            $return_r["data"]["wallpost"][$key]['collage'][$keyymm]['photoID'] = $photo->getId();
	    			            $return_r["data"]["wallpost"][$key]['collage'][$keyymm]['no_of_comments'] = $photo->getSocialise_photosComment()->count()?$photo->getSocialise_photosComment()->count():0;
	    			            $return_r["data"]["wallpost"][$key]['collage'][$keyymm]['no_of_oks'] = $photo->getSocialise_photosLike()->count()?$photo->getSocialise_photosLike()->count():0;
	    			            $return_r["data"]["wallpost"][$key]['collage'][$keyymm]['no_of_shares'] = $photo->getSocialise_photosShare()->count()?$photo->getSocialise_photosShare()->count():0;
	    			            $return_r["data"]["wallpost"][$key]['collage'][$keyymm]['am_I_ok_this_photo'] = \Extended\socialise_photo::didUserLikedPhoto($userId, $photo->getId());
	    			            
	    			       		
				        }
				        $return_r["data"]["wallpost"][$key]['total_photos_in _album'] = $wall_post[0]->getWall_postsSocialise_album()->getSocialise_albumsSocialise_photo()->count();
			        }
			        
			    }
			    else if( $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_PROFILE_PHOTO_CHANGED )
			    {
			        
			        $photo = \Extended\socialise_photo::getRowObject( $wall_post[0]->getSocialisePhoto()->getId() );
			        
			        $album_obj = \Extended\socialise_album::getRowObject($photo->getSocialise_photosSocialise_album()->getId() );
			         
			        $album_name = $album_obj->getAlbum_name();
			        $album_timestamp = $album_obj->getCreated_at_timestamp()->getTimestamp();
			        
		            $image_path = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_".\Extended\socialise_album::PROFILE_PHOTOS_ALBUM_NAME."/wall_thumbnails/thumbnail_".$photo->getImage_name();
		            $return_r["data"]["wallpost"][$key]['collage'][0]['image_path'] = $image_path;
		            $return_r["data"]["wallpost"][$key]['collage'][0]['image_id'] = $photo->getId();
		            $return_r["data"]["wallpost"][$key]['collage'][0]['image_desc'] = $photo->getDescription();
			        
			        $size = @getimagesize( $return_r["data"]["wallpost"][$key]['collage'][0]['image_path'] );
			        
			        $aspect = 1;
			        if( $size )
			        {
			            $width = $size[0];
			            $height = $size[1];
			            $aspect = $height / $width;
			        }
			        if ($aspect >= 1)
			        {
			            //vertical
			            $return_r["data"]["wallpost"][$key]['first_img_portrait_or_landscape'] = 1;
			        }
			        else
			        {
			            //horizontal
			            $return_r["data"]["wallpost"][$key]['first_img_portrait_or_landscape'] = 2;
			        }
			        
			        if( $for_mobile ==true)
			        {
			        	
			        	$return_r["data"]["wallpost"][$key]['collage'][0]['realPhoto'] = $image_path;
			        	$return_r["data"]["wallpost"][$key]['collage'][0]['photoID'] = $photo->getId();
			        	$return_r["data"]["wallpost"][$key]['collage'][0]['no_of_comments'] = $photo->getSocialise_photosComment()->count()?$photo->getSocialise_photosComment()->count():0;
			        	$return_r["data"]["wallpost"][$key]['collage'][0]['no_of_oks'] = $photo->getSocialise_photosLike()->count()?$photo->getSocialise_photosLike()->count():0;
			        	$return_r["data"]["wallpost"][$key]['collage'][0]['no_of_shares'] = $photo->getSocialise_photosShare()->count()?$photo->getSocialise_photosShare()->count():0;
			        	$return_r["data"]["wallpost"][$key]['collage'][0]['am_I_ok_this_photo'] = \Extended\socialise_photo::didUserLikedPhoto($userId, $photo->getId());
			        
			        		 
			        }
			    }
			}
			
    		//GET WALLPOST WISH INFO. [Only in case of wallpost with post_update_type = 11]
    		if( $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_WISH )
    		{
    			$wish_obj = \Extended\wishes::getWishByWallpostId( $wall_post[0]->getId() );
    			if( $wish_obj )
    			{
    				$return_r["data"]["wallpost"][$key]['wish']['wish_id'] = $wish_obj->getId();
    				$return_r["data"]["wallpost"][$key]['wish']['underlying_text'] = $wish_obj->getUnderlying_text();
    				$return_r["data"]["wallpost"][$key]['wish']['wish_type'] = \Extended\wishes::getDiscriminatorValue( $wish_obj );
    				if( $return_r["data"]["wallpost"][$key]['wish']['wish_type'] == 1 )//Means wish type new link.
    				{
    					try {$em->getFilters()->disable('soft-deleteable');} catch (\Exception $e) {}
    					$link_ilook_user_obj = $em->find('\Entities\ilook_user', $wish_obj->getLink_ilook_user_id());
    					$return_r["data"]["wallpost"][$key]['wish']['link_ilook_user_id'] = $wish_obj->getLink_ilook_user_id();
    					$return_r["data"]["wallpost"][$key]['wish']['link_ilook_user_name'] = $link_ilook_user_obj->getFirstname()." ".$link_ilook_user_obj->getLastname();
    					$return_r["data"]["wallpost"][$key]['wish']['link_ilook_user_medium_photo'] = \Helper_common::getUserProfessionalPhoto( $wish_obj->getLink_ilook_user_id(), 2 );
    					$return_r["data"]["wallpost"][$key]['wish']['link_ilook_user_professional_info'] = implode( ", ", array_filter(\Helper_common::getUserProfessionalInfo( $wish_obj->getLink_ilook_user_id() ) ));
    				}
    			}
    		}
    			
    		//WALLPOST COMMENTS INFO
    			
    		$ii = 1;
    		$counter = 0;
    		foreach ( array_reverse( $wall_post[0]->getWall_postsComment()->toArray() ) as $keyy=>$comment )
    		{
    			$counter++;
    			//Checking that, is comment hidden on this user's wall?
    			if( ! \Extended\users_comments_visibility::IsCommentHiddenOnUserWall($comment->getId(), $userId) )
    			{
    				
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['id'] = $comment->getId();
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['text'] = $comment->getComment_text();
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['created_at'] = \Helper_common::nicetime($comment->getcreated_at()->format( "Y-m-d H:i:s" ));
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['user_id'] = $comment->getCommentsIlook_user()->getId();
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['user_name'] = $comment->getCommentsIlook_user()->getFirstname()." ".$comment->getCommentsIlook_user()->getLastname();
    					
    				//Check if the commenter user exist in $blocked_user_ids_arr i.e if i have blocked him or he has blocked me?
    				if($blocked_user_ids_arr)
    				{
    					$comment_user_photo_detail = \Extended\comments::getUsersPhotoForComment($comment->getCommentsIlook_user()->getId(), $blocked_user_ids_arr);
    				}
    				
    				else
    				{
    					$comment_user_photo_detail['photo_path'] = \Helper_common::getUserProfessionalPhoto($comment->getCommentsIlook_user()->getId(), 3);
    					$comment_user_photo_detail['is_photo_clickable'] = true;
    				}
    				//End of code to check if the commenter user exist in $blocked_user_ids_arr i.e if i have blocked him or he has blocked me?
    					
    				//Check if commenter user account is closed then make his/her prof_image unclickable.
    				if( $comment->getCommentsIlook_user()->getAccount_closed_on() != null )
    				{
    					$comment_user_photo_detail['photo_path'] = \Helper_common::getUserProfessionalPhoto($comment->getCommentsIlook_user()->getId(), 3);
    					$comment_user_photo_detail['is_photo_clickable'] = false;
    				}
    				//End - Check if commenter user account is closed then make his/her prof_image unclickable. 
    					
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['user_prof_image_path'] = $comment_user_photo_detail['photo_path'];
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['is_user_image_clickable'] = $comment_user_photo_detail['is_photo_clickable'];
    					
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['user_prof_image_medium_path'] = \Helper_common::getUserProfessionalPhoto($comment->getCommentsIlook_user()->getId(), 2);
    				if( $comment->getCommentsIlook_user()->getId() == $userId ):	
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['is_my_comment'] = 1;
    				else:
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['is_my_comment'] = 0;
    				endif;
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['is_hidden'] = 0;
    					
    				$ii--;
    					
    				if( $counter == 2 ):
    				break;
    				endif;
    			}
    			
    			else
    			{
    					
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['id'] = $comment->getId();
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['text'] = $comment->getComment_text();
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['created_at'] = \Helper_common::nicetime($comment->getcreated_at()->format( "Y-m-d H:i:s" ));
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['user_id'] = $comment->getCommentsIlook_user()->getId();
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['user_name'] = $comment->getCommentsIlook_user()->getFirstname()." ".$comment->getCommentsIlook_user()->getLastname();
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['user_prof_image_path'] = \Helper_common::getUserProfessionalPhoto($comment->getCommentsIlook_user()->getId(), 3);
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['user_prof_image_medium_path'] = \Helper_common::getUserProfessionalPhoto($comment->getCommentsIlook_user()->getId(), 2);
// 					$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['user_social_image_path'] = \Helper_common::getUserSocializePhoto($comment->getCommentsIlook_user()->getId(), 3);
    				if( $comment->getCommentsIlook_user()->getId() == $userId ):
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['is_my_comment'] = 1;
    				else:
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['is_my_comment'] = 0;
    				endif;
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['is_hidden'] = 1;
    						
    				$ii--;
    						
    				if( $counter == 2 ):
    				break;
    				endif;
    			}		
    		}
    		
    		
    	}
    	
    	
	    $return_r["is_there_more_recs"] = 0;
	    if( $q_2 )
	    {
	    	$return_r["is_there_more_recs"] = 1;
	    }
	    $em->getFilters()->enable('soft-deleteable');
	   // \Zend_Debug::dump($return_r['data']['wallpost']); die;
		return $return_r;
	}

	/**
	 * Returns detailed information about wallpost
	 * including its comments, likes and everything.
	 *
	 * @param integer $wallpost_id
	 * @param integer $logged_in_user
	 * @param integer $no_of_comments [optional](by default 2)
	 * @author jsingh7
	 * @author sjaiswal
	 *
	 * @version 1.1
	 * @return array
	 */
	public static function getDetailedWallpostInfo( $wallpost_id, $logged_in_user, $no_of_comments = 2, $for_mobile=false )
	{
		//Get users blocked and users who have blocked logged in user.
		$blocked_user = \Extended\blocked_users::getAllBlockersAndBlockedUsers($logged_in_user);

		$wall_post_obj = \Extended\wall_post::getRowObject( $wallpost_id );

		$return_r = array();
		$return_r["wallpost"]['id'] = $wall_post_obj->getId();
		$return_r["wallpost"]['wall_type'] = $wall_post_obj->getWall_type();
		$return_r["wallpost"]['post_update_type'] = $wall_post_obj->getPost_update_type();
		$return_r["wallpost"]['wallpost_text'] = $wall_post_obj->getWall_post_text();
		$return_r["wallpost"]['wallpost_text_striped'] = strip_tags($wall_post_obj->getWall_post_text(),'<br>');
		$return_r["wallpost"]['wallpost_text_when_shared'] = $wall_post_obj->getWall_post_text_when_shared();//Not required as 'shared_walltext' used - hkaur5
		$return_r["wallpost"]['visibility_criteria'] = $wall_post_obj->getVisibility_criteria();
		$return_r["wallpost"]['wall_type'] = $wall_post_obj->getWall_type();
		$return_r["wallpost"]['comment_count'] = $wall_post_obj->getWall_postsComment()->count();
		$return_r["wallpost"]['like_count'] = $wall_post_obj->getWall_postsLikes()->count();
		$return_r["wallpost"]['share_count'] = $wall_post_obj->getWall_postsShare()->count();
		$return_r["wallpost"]['post_type'] = $wall_post_obj->getPost_type();
		$return_r["wallpost"]['group_id'] = $wall_post_obj->getGroup_id();
		$return_r["wallpost"]['job_id'] = $wall_post_obj->getJob_id();
		$return_r["wallpost"]['company_id'] = $wall_post_obj->getCompany_id();
		$return_r["wallpost"]['did_I_liked'] = self::didUserLikedWallpost($logged_in_user, $wall_post_obj->getId());
		$return_r["wallpost"]['url_data'] = \Zend_Json::decode( $wall_post_obj->getLink_data() );
		$return_r["wallpost"]['created_at'] = \Helper_common::nicetime( $wall_post_obj->getCreated_at()->format("Y-m-d H:i") );
		$return_r["wallpost"]['likers_string'] = \Helper_common::getLikersStringByWallpostId( $wall_post_obj->getId(), $logged_in_user );
		$return_r["wallpost"]['sharers_string']["string"] = false;
		$return_r["wallpost"]['sharers_string']["shared_from_wallpost_exist"] = false;
		// Get all 'to_users' of wallpost.
		$to_users = array();
		foreach($wall_post_obj->getPostedTo() as $posted_to_user )
		{
			$to_users[] = $posted_to_user->getIlookUser()->getId();
		}
		$return_r["wallpost"]['is_ok_comment_share_pannel_visible'] = \Helper_common::is_ok_comment_share_pannel_visible( $wall_post_obj->getVisibility_criteria(), $wall_post_obj->getWall_postsFrom_user()->getId(), $to_users, $logged_in_user );
		$return_r["wallpost"]['is_my_wallpost'] = $wall_post_obj->getWall_postsFrom_user()->getId() == $logged_in_user?1:0;
		$return_r["wallpost"]['is_wallpost_reported_abuse'] = \Extended\report_abuse::getAbuseReport($logged_in_user,$wall_post_obj->getId());

		$em = \Zend_Registry::get('em');
		$original_user_obj = $em->find('\Entities\ilook_user', $wall_post_obj->getWall_postsOriginal_user()->getId());

		$return_r["wallpost"]['original_user']['id'] = $original_user_obj->getId();
		$return_r["wallpost"]['original_user']['fullname'] = $original_user_obj->getFirstname()." ".$original_user_obj->getLastname();
		$return_r["wallpost"]['original_user']['user_type'] = $original_user_obj->getUser_type();
		$return_r["wallpost"]['original_user']['photo'] = \Helper_common::getUserProfessionalPhoto( $original_user_obj->getId(), 3 );
		$return_r["wallpost"]['original_user']['photo_medium_size'] = \Helper_common::getUserProfessionalPhoto( $original_user_obj->getId(), 2 );

		if(   $wall_post_obj->getPost_update_type() == self::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING
				|| $wall_post_obj->getPost_update_type() == self::POST_UPDATE_TYPE_SHARED_TEXT
				|| $wall_post_obj->getPost_update_type() == self::POST_UPDATE_TYPE_SHARED_LINK  )// if the wallpost is shared.
		{
			$em = \Zend_Registry::get('em');
			$em->getFilters()->disable('soft-deleteable');
			$original_user_obj = \Extended\ilook_user::getRowObjectAdvanced( $wall_post_obj->getWall_postsOriginal_user()->getId() );

			$return_r["wallpost"]['from_user']['id'] = $original_user_obj->getId();
			$return_r["wallpost"]['from_user']['username'] = $original_user_obj->getUsername();
			$return_r["wallpost"]['from_user']['usertype'] = $original_user_obj->getUser_type();
			$return_r["wallpost"]['from_user']['is_deleted'] = $original_user_obj->getDeleted_at()?1:0;
			$return_r["wallpost"]['from_user']['fullname'] = $original_user_obj->getFirstname()." ".$original_user_obj->getLastname();
			$return_r["wallpost"]['from_user']['photo'] = \Helper_common::getUserProfessionalPhoto( $original_user_obj->getId(), 3 );
			$return_r["wallpost"]['from_user']['photo_medium_size'] = \Helper_common::getUserProfessionalPhoto( $original_user_obj->getId(), 2 );
			$return_r["wallpost"]['from_user']['post_created_at'] = \Helper_common::nicetime( $wall_post_obj->getShared_from_wallpost()->getCreated_at()->format("Y-m-d H:i:s") );
			if($wall_post_obj->getShared_from_wallpost())
			{
				$return_r["wallpost"]['from_user']['shared_walltext'] = $wall_post_obj->getShared_from_wallpost()->getwall_post_text();
			}
			else if( $wall_post_obj->getWall_post_text_when_shared()!= null)
			{
				$return_r["wallpost"]['from_user']['shared_walltext'] = $wall_post_obj->getWall_post_text_when_shared();
			}
			else
			{
				$return_r["wallpost"]['from_user']['shared_walltext'] = "";
			}
			$em->getFilters()->enable('soft-deleteable');
		}
		else
		{
			$return_r["wallpost"]["from_user"] = null;
		}

		//If post is shared post then get sharer_users string.
		if($wall_post_obj->getPost_update_type() == self::POST_UPDATE_TYPE_SHARED_TEXT
				|| $wall_post_obj->getPost_update_type() == self::POST_UPDATE_TYPE_SHARED_LINK
				|| $wall_post_obj->getPost_update_type() == self::POST_UPDATE_TYPE_SHARED_PROFILE_LINK
				|| $wall_post_obj->getPost_update_type() == self::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING)
		{
			if($wall_post_obj->getShared_from_wallpost())
			{
				$return_r["wallpost"]['sharers_string']["string"] = \Helper_common::getSharerStringforPost($wall_post_obj->getId(), $logged_in_user);
				$return_r["wallpost"]['sharers_string']["shared_from_wallpost_exist"] = true;
				$return_r["wallpost"]['original_user']['post_created_at'] = \Helper_common::nicetime( $wall_post_obj->getShared_from_wallpost()->getCreated_at()->format("Y-m-d H:i:s") );
				$return_r["wallpost"]['shared_post_info'] = \Helper_common::getSharedPostInfoArray($wall_post_obj->getId(), $logged_in_user);
			}
			else
			{
				$return_r["wallpost"]['sharers_string']["string"]  =$wall_post_obj->getWall_postsFrom_user()->getFirstname().' '.$wall_post_obj->getWall_postsFrom_user()->getLastname();
				$return_r["wallpost"]['sharers_string']["shared_from_wallpost_exist"] = false;
				$return_r["wallpost"]['original_user']['post_created_at'] = "";
				$return_r["wallpost"]['shared_post_info'] = null;
				$return_r["wallpost"]['sharer_user_name'] = $wall_post_obj->getWall_postsFrom_user()->getFirstname().' '.$wall_post_obj->getWall_postsFrom_user()->getLastname();

			}
// 			\Zend_Debug::dump($return_r["wallpost"]['sharers_string']["string"]);
// 			die;
		}

		//WALLPOST USER INFO
		$return_r["wallpost"]['wallpost_user_id'] = $wall_post_obj->getWall_postsFrom_user()->getId();
		$return_r["wallpost"]['wallpost_user_prof_image_path'] = \Helper_common::getUserProfessionalPhoto($wall_post_obj->getWall_postsFrom_user()->getId(), 3);
		$return_r["wallpost"]['wallpost_user_prof_image_path_medium_size'] = \Helper_common::getUserProfessionalPhoto($wall_post_obj->getWall_postsFrom_user()->getId(), 2);
		$return_r["wallpost"]['wallpost_user_name'] = $wall_post_obj->getWall_postsFrom_user()->getFirstname()." ".$wall_post_obj->getWall_postsFrom_user()->getLastname();
		$return_r["wallpost"]['wallpost_user_username'] = $wall_post_obj->getWall_postsFrom_user()->getUsername();
		$return_r["wallpost"]['wallpost_user_type'] = $wall_post_obj->getWall_postsFrom_user()->getUser_type();
		$return_r["wallpost"]['wallpost_user_gender'] = $wall_post_obj->getWall_postsFrom_user()->getGender();

		//WALLPOST SOCIALISE PHOTO INFO
		if( $wall_post_obj->getWall_type() && $wall_post_obj->getWall_type() == self::WALL_TYPE_SOCIALISE )
		{
			switch( $wall_post_obj->getPost_Update_Type() )
			{

				case \Extended\wall_post::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM:
				case \Extended\wall_post::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING:

					//Get path of images for small collage inside share popup.
					$image_counter = 0;

					//First 10 images with some informatiom.
					if( $for_mobile ==true )
					{

						foreach ( $wall_post_obj->getPhotoGroup()->getSocialisePhoto() as $key=>$photo  )
						{
							$return_r["wallpost"]['collage'][$key]['realPhoto'] = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_default/wall_thumbnails/thumbnail_".$photo->getImage_name();
							$return_r["wallpost"]['collage'][$key]['photoID'] = $photo->getId();
							$return_r["wallpost"]['collage'][$key]['no_of_comments'] = $photo->getComment_count();
							$return_r["wallpost"]['collage'][$key]['no_of_oks'] = $photo->getLike_count();
							$return_r["wallpost"]['collage'][$key]['no_of_shares'] = $photo->getShare_count();
							$return_r["wallpost"]['collage'][$key]['am_I_ok_this_photo'] = self::didUserLikedalbum($logged_in_user, $wall_post_obj->getWall_postsSocialise_album()->getId());

							$size = @getimagesize($return_r["wallpost"]['collage'][0]['realPhoto'] );

							$aspect = 1;
							if( $size )
							{
								$width = $size[0];
								$height = $size[1];
								$aspect = $height / $width;
							}
							if ($aspect >= 1)
							{
								//vertical
								$return_r["wallpost"]['first_img_portrait_or_landscape'] = 1;
							}
							else
							{
								//horizontal
								$return_r["wallpost"]['first_img_portrait_or_landscape'] = 2;
							}

							if ($photo->getComment_count() === null){
								$return_r["wallpost"]['collage'][$key]['no_of_comments'] = 0;
							}
							if ($photo->getLike_count() === null){
								$return_r["wallpost"]['collage'][$key]['no_of_oks'] = 0;
							}
							if ($photo->getShare_count() === null){
								$return_r["wallpost"]['collage'][$key]['no_of_shares'] = 0;
							}
							$image_counter++;
							if( $image_counter == 10 ):
							break;
							endif;
						}
					}

					foreach ( $wall_post_obj->getPhotoGroup()->getSocialisePhoto() as $key=>$photo )
					{
						$return_r["collage"][$key]['image_path'] = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_default/wall_thumbnails/thumbnail_".$photo->getImage_name();
						$return_r["collage"][$key]['image_id'] = $photo->getId();
						$image_counter++;
						if( $image_counter == 5 ):
						break;
						endif;
					}



					break;

				case \Extended\wall_post::POST_UPDATE_TYPE_ALBUM:

					$return_r["wallpost"]['socialize_album_name'] = $wall_post_obj->getWall_postsSocialise_album()->getAlbum_display_name();
					$return_r["wallpost"]['album_name'] = $wall_post_obj->getWall_postsSocialise_album()->getAlbum_name();
					$return_r["wallpost"]['socialize_album_id'] = $wall_post_obj->getWall_postsSocialise_album()->getId();
					$image_counter = 0;
					$album_name = $wall_post_obj->getWall_postsSocialise_album()->getAlbum_name();
					$album_timestamp = $wall_post_obj->getWall_postsSocialise_album()->getCreated_at_timestamp()->getTimestamp();

					//First 10 images with some informatiom.
					if( $for_mobile ==true )
					{

						foreach ( $wall_post_obj->getWall_postsSocialise_album()->getSocialise_albumsSocialise_photo() as $key=>$photo  )
						{
							$return_r["wallpost"]['collage'][$key]['realPhoto'] = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_".$album_name."_".$album_timestamp."/wall_thumbnails/thumbnail_".$photo->getImage_name();
							$return_r["wallpost"]['collage'][$key]['photoID'] = $photo->getId();
							$return_r["wallpost"]['collage'][$key]['no_of_comments'] = $photo->getComment_count();
							$return_r["wallpost"]['collage'][$key]['no_of_oks'] = $photo->getLike_count();
							$return_r["wallpost"]['collage'][$key]['no_of_shares'] = $photo->getShare_count();
							$return_r["wallpost"]['collage'][$key]['am_I_ok_this_photo'] = self::didUserLikedalbum($logged_in_user, $wall_post_obj->getWall_postsSocialise_album()->getId());

							$size = @getimagesize( $return_r["wallpost"]['collage'][0]['realPhoto']);

							$aspect = 1;
							if( $size )
							{
								$width = $size[0];
								$height = $size[1];
								$aspect = $height / $width;
							}
							if ($aspect >= 1)
							{
								//vertical
								$return_r["wallpost"]['first_img_portrait_or_landscape'] = 1;
							}
							else
							{
								//horizontal
								$return_r["wallpost"]['first_img_portrait_or_landscape'] = 2;
							}


							if ($photo->getComment_count() === null){
								$return_r["wallpost"]['collage'][$key]['no_of_comments'] = 0;
							}
							if ($photo->getLike_count() === null){
								$return_r["wallpost"]['collage'][$key]['no_of_oks'] = 0;
							}
							if ($photo->getShare_count() === null){
								$return_r["wallpost"]['collage'][$key]['no_of_shares'] = 0;
							}
							$image_counter++;
							if( $image_counter == 10 ):
							break;
							endif;
						}
					}
					foreach($wall_post_obj->getWall_postsSocialise_album()->getSocialise_albumsSocialise_photo() as $key=>$photo)
					{
						$return_r["collage"][$key]['image_path'] = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_".$album_name."_".$album_timestamp."/wall_thumbnails/thumbnail_".$photo->getImage_name();
						$return_r["collage"][$key]['image_id'] = $photo->getId();



						$image_counter++;
						if( $image_counter == 5 ):
						break;
						endif;
					}


					break;

					case \Extended\wall_post::POST_UPDATE_TYPE_PROFILE_PHOTO_CHANGED:

						$photo = \Extended\socialise_photo::getRowObject( $wall_post_obj->getSocialisePhoto()->getId() );

						$album_obj = \Extended\socialise_album::getRowObject($photo->getSocialise_photosSocialise_album()->getId() );

						$album_name = $album_obj->getAlbum_name();
						$album_timestamp = $album_obj->getCreated_at_timestamp()->getTimestamp();

						$image_path = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_".\Extended\socialise_album::PROFILE_PHOTOS_ALBUM_NAME."/wall_thumbnails/thumbnail_".$photo->getImage_name();
						$return_r['collage'][0]['image_path'] = $image_path;
						$return_r['collage'][0]['image_id'] = $photo->getId();

						if($for_mobile==true)
						{
							$return_r["wallpost"]['collage'][0]['realPhoto'] = $image_path;
							$return_r["wallpost"]['collage'][0]['photoID'] = $photo->getId();
							$return_r["wallpost"]['collage'][0]['no_of_comments'] = $photo->getComment_count();
							$return_r["wallpost"]['collage'][0]['no_of_oks'] = $photo->getLike_count();
							$return_r["wallpost"]['collage'][0]['no_of_shares'] = $photo->getShare_count();
							$return_r["wallpost"]['collage'][0]['am_I_ok_this_photo'] =self::didUserLikedalbum($logged_in_user, $wall_post_obj->getWall_postsSocialise_album()->getId());

							$size = @getimagesize( $return_r["wallpost"]['collage'][0]['realPhoto'] );

							$aspect = 1;
							if( $size )
							{
								$width = $size[0];
								$height = $size[1];
								$aspect = $height / $width;
							}
							if ($aspect >= 1)
							{
								//vertical
								$return_r["wallpost"]['first_img_portrait_or_landscape'] = 1;
							}
							else
							{
								//horizontal
								$return_r["wallpost"]['first_img_portrait_or_landscape'] = 2;
							}

							if ($photo->getComment_count() === null){
								$return_r["wallpost"]['collage'][0]['no_of_comments'] = 0;
							}
							if ($photo->getLike_count() === null){
								$return_r["wallpost"]['collage'][0]['no_of_oks'] = 0;
							}
							if ($photo->getShare_count() === null){
								$return_r["wallpost"]['collage'][0]['no_of_shares'] = 0;
							}
						}
						break;
			}

			$size = @getimagesize( $return_r["collage"][0]['image_path'] );

			$aspect = 1;
			if( $size )
			{
				$width = $size[0];
				$height = $size[1];
				$aspect = $height / $width;
			}
			if ($aspect >= 1)
			{
				//vertical
				$return_r['first_img_portrait_or_landscape'] = 1;
			}
			else
			{
				//horizontal
				$return_r['first_img_portrait_or_landscape'] = 2;
			}

		}

		//GET WALLPOST WISH INFO. [Only in case of wallpost with post_update_type = 11]
		if( $wall_post_obj->getPost_update_type() == self::POST_UPDATE_TYPE_WISH )
		{

			$wish_obj = \Extended\wishes::getWishByWallpostId( $wall_post_obj->getId() );
			if( $wish_obj )
			{
				$return_r["wallpost"]['wish']['wish_id'] = $wish_obj->getId();
				$return_r["wallpost"]['wish']['underlying_text'] = $wish_obj->getUnderlying_text();
				$return_r["wallpost"]['wish']['wish_type'] = \Extended\wishes::getDiscriminatorValue( $wish_obj );
				if( $return_r["wallpost"]['wish']['wish_type'] == 1 )//Means wish type new link.
				{
					$link_ilook_user_obj = \Extended\ilook_user::getRowObject( $wish_obj->getLink_ilook_user_id() );
					$return_r["wallpost"]['wish']['link_ilook_user_id'] = $wish_obj->getLink_ilook_user_id();
					$return_r["wallpost"]['wish']['link_ilook_user_name'] = $link_ilook_user_obj->getFirstname()." ".$link_ilook_user_obj->getLastname();
					$return_r["wallpost"]['wish']['link_ilook_user_username'] = $link_ilook_user_obj->getUsername();
					$return_r["wallpost"]['wish']['link_ilook_user_mediumphoto'] = \Helper_common::getUserProfessionalPhoto( $wish_obj->getLink_ilook_user_id(), 2 );
					$return_r["wallpost"]['wish']['link_ilook_user_professional_info'] = implode( ", ", \Helper_common::getUserProfessionalInfo( $wish_obj->getLink_ilook_user_id() ) );
				}
			}
		}

		//WALLPOST COMMENTS INFO
		$ii = 1;
		$counter = 0;

		foreach ( array_reverse( $wall_post_obj->getWall_postsComment()->toArray() ) as $keyy=>$comment )
		{

			$counter++;
				if($blocked_user)
				{
					$comment_user_photo_detail = \Extended\comments::getUsersPhotoForComment($comment->getCommentsIlook_user()->getId(), $blocked_user);
				}
				else
				{
					$comment_user_photo_detail['photo_path'] = \Helper_common::getUserProfessionalPhoto($comment->getCommentsIlook_user()->getId(), 3);
					$comment_user_photo_detail['is_photo_clickable'] = true;
				}
			//Checking that, is comment hidden on this user's wall?
			if( ! \Extended\users_comments_visibility::IsCommentHiddenOnUserWall($comment->getId(), $logged_in_user) )
			{
				$return_r["wallpost"]['wallpost_comments'][$ii]['id'] = $comment->getId();
				$return_r["wallpost"]['wallpost_comments'][$ii]['text'] = $comment->getComment_text();
				$return_r["wallpost"]['wallpost_comments'][$ii]['created_at'] = \Helper_common::nicetime($comment->getcreated_at()->format( "Y-m-d H:i:s" ));
				$return_r["wallpost"]['wallpost_comments'][$ii]['user_id'] = $comment->getCommentsIlook_user()->getId();
				$return_r["wallpost"]['wallpost_comments'][$ii]['user_name'] = $comment->getCommentsIlook_user()->getFirstname()." ".$comment->getCommentsIlook_user()->getLastname();
				$return_r["wallpost"]['wallpost_comments'][$ii]['user_username'] = $comment->getCommentsIlook_user()->getUsername();
				$return_r["wallpost"]['wallpost_comments'][$ii]['user_prof_image_path'] = $comment_user_photo_detail['photo_path'];
				$return_r["wallpost"]['wallpost_comments'][$ii]['is_user_photo_clickable'] = $comment_user_photo_detail['is_photo_clickable'];
				if( $comment->getCommentsIlook_user()->getId() == $logged_in_user ):
				$return_r["wallpost"]['wallpost_comments'][$ii]['is_my_comment'] = 1;
				else:
				$return_r["wallpost"]['wallpost_comments'][$ii]['is_my_comment'] = 0;
				endif;
				$return_r["wallpost"]['wallpost_comments'][$ii]['is_hidden'] = 0;

				$ii--;

				if( $counter == $no_of_comments ):
				break;
				endif;
			}
			else
			{
				$return_r["wallpost"]['wallpost_comments'][$ii]['id'] = $comment->getId();
				$return_r["wallpost"]['wallpost_comments'][$ii]['text'] = $comment->getComment_text();
				$return_r["wallpost"]['wallpost_comments'][$ii]['created_at'] = \Helper_common::nicetime($comment->getcreated_at()->format( "Y-m-d H:i:s" ));
				$return_r["wallpost"]['wallpost_comments'][$ii]['user_id'] = $comment->getCommentsIlook_user()->getId();
				$return_r["wallpost"]['wallpost_comments'][$ii]['user_name'] = $comment->getCommentsIlook_user()->getFirstname()." ".$comment->getCommentsIlook_user()->getLastname();
				$return_r["wallpost"]['wallpost_comments'][$ii]['user_prof_image_path'] = \Helper_common::getUserProfessionalPhoto($comment->getCommentsIlook_user()->getId(), 3);
// 				$return_r["wallpost"]['wallpost_comments'][$ii]['user_social_image_path'] = \Helper_common::getUserSocializePhoto($comment->getCommentsIlook_user()->getId(), 3);
				if( $comment->getCommentsIlook_user()->getId() == $logged_in_user ):
				$return_r["wallpost"]['wallpost_comments'][$ii]['is_my_comment'] = 1;
				else:
				$return_r["wallpost"]['wallpost_comments'][$ii]['is_my_comment'] = 0;
				endif;
				$return_r["wallpost"]['wallpost_comments'][$ii]['is_hidden'] = 1;

				$ii--;

				if( $counter == $no_of_comments ):
				break;
				endif;
			}
		}

		return $return_r;
	}

	/**
	 *
	 * Returns wallposts which has lastest_activity_datetime
	 * greater than latest_activity_datetime of the wallpost
	 * you are sending to this function.
	 * It works on basis of latest_activity_datetime.
	 *
	 * Used for mobile end working only.
	 *
	 * @param int $userId
	 * @param int $lastWallpostId
	 * @param int $offset
	 * @param int $limit
	 * @param int $wall_type
	 * @param int $for_mobile
	 * @param int $tag_id
	 *
	 * @return array
	 * @author jsingh7, rkaur3, hkaur5,ssharma4(23-sep-2015)
	 * @author sjaiswal(updated tag_id code)
	 * @version 1.0
	 */


	public static function getRecentUpdates( $userId, $offset = 0 , $limit = 10, $wall_type = self::WALL_TYPE_PROFESSIONAL,
											 $last_activity_date_time_obj ,$for_mobile=false,$tag_id = 0)
	{
		//------------------------------------------------
		//Fetching records of users who has been blocked.
		//------------------------------------------------
		$blocked_user_ids_arr = \Extended\blocked_users::getAllBlockersAndBlockedUsers($userId);
		//---------------------------------------------------
		//End Fetching records of users who has been blocked.
		//---------------------------------------------------

		$return_r = array();

		$em = \Zend_Registry::get('em');

		// Enable / Disable filter, for specified entity (default is enabled for all)
		$filter = $em->getFilters()->disable('soft-deleteable');
		$filter->disableForEntity('\Entities\wall_post');
		$filter->disableForEntity('\Entities\ilook_user');

		$user_obj = \Extended\ilook_user::getRowObject( $userId );

		$my_links_r = explode( ",", $user_obj->getLink_list() );

		//GETTING RECORDS(WALLPOSTS) ACCORDING TO LIMIT AND OFFSET.
		//QUERY 1
		$qb = $em->createQueryBuilder();
		$q = $qb->select( 'wp.id, wp.last_activity_datetime' )
			->from( '\Entities\wall_post', 'wp' )
			->LeftJoin( 'wp.wall_postsLikes', 'likes' )
			->LeftJoin( 'wp.wall_postsShare', 'shares' )
			->LeftJoin( 'wp.wall_postsComment', 'comments' )
			->leftJoin( 'wp.wall_postsFrom_user','fromUser')
			->leftJoin( 'wp.postedTo', 'postdto')
			->leftJoin( 'wp.postTags', 'postTags' );

		if( $wall_type == self::WALL_TYPE_SOCIALISE )
		{
			$q->leftJoin( 'wp.wall_postsSocialise_album','album');
			$q->leftJoin( 'album.socialise_albumsSocialise_photo','photo');
			$q->having('count(photo) > 0 OR wp.post_update_type = 11');
		}
		$q->setParameter( 'my_links_r', $my_links_r )
			->setParameter( 1, $userId )
			->setParameter( 6, $last_activity_date_time_obj )
			->setFirstResult( $offset )
			->setMaxResults( $limit )
			->groupBy( 'wp.id, wp.last_activity_datetime, wp.post_update_type' )
			->orderBy( 'wp.last_activity_datetime', 'DESC' );
		//Checks that post should have at least one To_user. That is post has been posted to aleast one user.
		$q->having('count(postdto) > 0');

		if( $wall_type )
		{
			$q->orWhere( 'postdto.ilookUser = ?1 AND wp.wall_type = ?4 AND wp.last_activity_datetime > ?6' );
			$q->orWhere( 'postdto.ilookUser IN (:my_links_r) AND wp.wall_type = ?4 AND wp.last_activity_datetime > ?6' );
			$q->orWhere( 'likes.likesLiked_by IN (:my_links_r) AND wp.wall_type = ?4 AND wp.last_activity_datetime > ?6' );
			$q->orWhere( 'shares.sharesShared_by IN (:my_links_r) AND wp.wall_type = ?4 AND wp.last_activity_datetime > ?6' );
			$q->orWhere( 'comments.commentsIlook_user IN (:my_links_r) AND wp.wall_type = ?4 AND wp.last_activity_datetime > ?6' );
			$q->andWhere('fromUser.account_closed_on is null');
			if( $blocked_user_ids_arr ):
				$q->setParameter( 'blocked_users_r', $blocked_user_ids_arr );
				$q->andWhere( 'wp.wall_postsFrom_user NOT IN (:blocked_users_r)' );
			endif;

			$q->setParameter( 4, $wall_type );
			if($tag_id)
			{
				$q->andWhere('postTags.id = ?5');
				$q->setParameter( 5, $tag_id );
			}
		}

		$q = $q->getQuery()->getResult( \Doctrine\ORM\Query::HYDRATE_ARRAY );

		if( !$q )
		{
			$return_r["data"] = 0;
			$return_r["is_there_more_recs"] = 0;
			return $return_r;

		}

		$selected_wp_ids_r = array();
		foreach ( $q as $selected_wp_id )
		{
			$selected_wp_ids_r[] = $selected_wp_id['id'];
		}

		//GETTING WALL POSTS ACCORDING TO SELECTED RECORDS IN QUERY 1.
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select('wp, fromUsr.id, 
		                      fromUsr.professional_image, 
		                      fromUsr.gender, 
		                      fromUsr.firstname, 
		                      fromUsr.lastname')
			->from( '\Entities\wall_post', 'wp' )
			->LeftJoin( 'wp.wall_postsFrom_user', 'fromUsr' )
			->where( 'wp.id IN (:selected_wp_ids_r)' )
			->setParameter( 'selected_wp_ids_r', $selected_wp_ids_r )
			->orderBy( 'wp.last_activity_datetime', 'DESC' );

		// wallpost Comments join
		$q_1->addSelect( 'wall_comments, comment_user' );
		$q_1->LeftJoin( 'wp.wall_postsComment', 'wall_comments' );
		$q_1->LeftJoin( 'wall_comments.commentsIlook_user', 'comment_user' );

		// wallpost Likes join
		$q_1->addSelect( 'likes' );
		$q_1->LeftJoin( 'wp.wall_postsLikes', 'likes' );
		$q_1->LeftJoin( 'likes.likesLiked_by', 'likedByUser' );

		$q_1 = $q_1->getQuery()->getResult ();

		if( !$q_1 )
		{
			$return_r["data"] = 0;
			$return_r["is_there_more_recs"] = 0;
			return $return_r;
		}

		//Checking that is there any more wall posts to show, checking according to same conditions and cretiria.
		// According to Query 1
		$last_record = end( $q );
		$oldest_datetime = $last_record['last_activity_datetime'];

		$qb_2 = $em->createQueryBuilder();
		$q_2 = $qb_2->select( 'wp.id' )
			->from( '\Entities\wall_post', 'wp' )
			->LeftJoin( 'wp.wall_postsLikes', 'likes' )
			->LeftJoin( 'wp.wall_postsShare', 'shares' )
			->LeftJoin( 'wp.wall_postsComment', 'comments' )
			->leftJoin( 'wp.wall_postsFrom_user','fromUser');
		if( $wall_type == self::WALL_TYPE_SOCIALISE )
		{
			$q_2->leftJoin( 'wp.wall_postsSocialise_album','album');
			$q_2->leftJoin( 'album.socialise_albumsSocialise_photo','photo');
			$q_2->having('count(photo) > 0');

		}
		$q_2->setParameter( 'my_links_r', $my_links_r )
			->setParameter( 1, $userId )
			->setParameter( 5, $last_activity_date_time_obj )
			->groupBy( 'wp.id, wp.last_activity_datetime' )
			->orderBy( 'wp.last_activity_datetime', 'DESC' );

		if( $wall_type )
		{

			$q_2->where( 'wp.wall_postsFrom_user = ?1 AND wp.wall_type = ?4 AND wp.last_activity_datetime < ?5' );
			$q_2->orWhere( 'wp.wall_postsFrom_user IN (:my_links_r) AND wp.wall_type = ?4 AND wp.last_activity_datetime < ?5' );
			$q_2->orWhere( 'likes.likesLiked_by IN (:my_links_r) AND wp.wall_type = ?4 AND wp.last_activity_datetime < ?5' );
			$q_2->orWhere( 'shares.sharesShared_by IN (:my_links_r) AND wp.wall_type = ?4 AND wp.last_activity_datetime < ?5' );
			$q_2->orWhere( 'comments.commentsIlook_user IN (:my_links_r) AND wp.wall_type = ?4 AND wp.last_activity_datetime < ?5' );
			$q_2->andWhere('fromUser.account_closed_on is null');

			if( $blocked_user_ids_arr ):
				$q_2->setParameter( 'blocked_users_r', $blocked_user_ids_arr );
				$q_2->andWhere( 'wp.wall_postsFrom_user NOT IN (:blocked_users_r)' );
			endif;
			$q_2->setParameter( 4, $wall_type );
		}

		$q_2 = $q_2->getQuery ()->getResult ( \Doctrine\ORM\Query::HYDRATE_ARRAY );

		foreach ( $q_1 as $key=>$wall_post )
		{
			//WALL POST INFO
			$return_r["data"]["wallpost"][$key]['id'] = $wall_post[0]->getId();
			$return_r["data"]["wallpost"][$key]['post_update_type'] = $wall_post[0]->getPost_update_type();

			if( $wall_post[0]->getWall_post_text() !=  null ):
				$return_r["data"]["wallpost"][$key]['wallpost_text'] = $wall_post[0]->getWall_post_text();
				$return_r["data"]["wallpost"][$key]['wallpost_text_striped'] = strip_tags($wall_post[0]->getWall_post_text(),'<br>');
			else:
				$return_r["data"]["wallpost"][$key]['wallpost_text'] = "";
				$return_r["data"]["wallpost"][$key]['wallpost_text_striped'] = "";

			endif;

			if( $wall_post[0]->getWall_post_text_when_shared() !=  null ):
				$return_r["data"]["wallpost"][$key]['wall_post_text_when_shared'] = $wall_post[0]->getWall_post_text_when_shared();
			else:
				$return_r["data"]["wallpost"][$key]['wall_post_text_when_shared'] = "";
			endif;

			$return_r["data"]["wallpost"][$key]['visibility_criteria'] = $wall_post[0]->getVisibility_criteria();
			$return_r["data"]["wallpost"][$key]['wall_type'] = $wall_post[0]->getWall_type();
			$return_r["data"]["wallpost"][$key]['comment_count'] = $wall_post[0]->getWall_postsComment()->count();
			$return_r["data"]["wallpost"][$key]['like_count'] = $wall_post[0]->getWall_postsLikes()->count();
			$return_r["data"]["wallpost"][$key]['share_count'] = $wall_post[0]->getWall_postsShare()->count();
			$return_r["data"]["wallpost"][$key]['post_type'] = $wall_post[0]->getPost_type();
			$return_r["data"]["wallpost"][$key]['group_id'] = $wall_post[0]->getGroup_id();
			$return_r["data"]["wallpost"][$key]['job_id'] = $wall_post[0]->getJob_id();
			$return_r["data"]["wallpost"][$key]['company_id'] = $wall_post[0]->getCompany_id();
			$return_r["data"]["wallpost"][$key]['did_I_liked'] = self::didUserLikedWallpost($userId, $wall_post[0]->getId());
			$return_r["data"]["wallpost"][$key]['tag_id'] = $wall_post[0]->getPostTags()?$wall_post[0]->getPostTags()->getId():"";
			$return_r["data"]["wallpost"][$key]['url_data']['post_data'] = $wall_post[0]->getPostTags()?$wall_post[0]->getWall_post_text():"";


			if( $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_PROFILE_LINK || $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_SHARED_PROFILE_LINK )
			{
				$link_data = \Zend_Json::decode( $wall_post[0]->getLink_data() );
				$shared_profile_user_id = $link_data["shared_profile_user_id"];

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

				$return_r["data"]["wallpost"][$key]['url_data']['url_title'] = $shared_profile_user_obj->getFirstname()." ".$shared_profile_user_obj->getLastname();
				$return_r["data"]["wallpost"][$key]['url_data']['url_content'] = "Check out ".$return_r["data"]["wallpost"][$key]['url_data']['url_title']."'s professional Profile and Connect with ".$him." on iLook.";
				$return_r["data"]["wallpost"][$key]['url_data']['image_src'] = \Helper_common::getUserProfessionalPhoto( $shared_profile_user_obj->getId(), 2 );
				$return_r["data"]["wallpost"][$key]['url_data']['post_data'] = $return_r["data"]["wallpost"][$key]['url_data']['post_data'];
			}
			else
			{
				$return_r["data"]["wallpost"][$key]['url_data'] = \Zend_Json::decode( $wall_post[0]->getLink_data() );
			}
			// Get all 'to_users' of current wallpost.
			$to_users = array();

			foreach($wall_post[0]->getPostedTo() as $posted_to_user )
			{
				$to_users[] = $posted_to_user->getIlookUser()->getId();
			}
			$return_r["data"]["wallpost"][$key]['is_ok_comment_share_pannel_visible'] = \Helper_common::is_ok_comment_share_pannel_visible( $wall_post[0]->getVisibility_criteria(), $wall_post[0]->getWall_postsFrom_user()->getId(), $to_users,$userId );
			$return_r["data"]["wallpost"][$key]['created_at'] = \Helper_common::nicetime( $wall_post[0]->getCreated_at()->format("Y-m-d H:i:s") );
			$return_r["data"]["wallpost"][$key]['last_activity_datetime'] = $wall_post[0]->getLast_activity_datetime()->format("Y-m-d H:i:s") ;
			$return_r["data"]["wallpost"][$key]['likers_string'] = \Helper_common::getLikersStringByWallpostId( $wall_post[0]->getId(), $userId );

			//If post is shared post then get sharer_users string.
			if($wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_SHARED_TEXT
				|| $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_SHARED_LINK
				|| $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_SHARED_PROFILE_LINK
				|| $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING)
			{
				if($wall_post[0]->getShared_from_wallpost())
				{
					$return_r["data"]["wallpost"][$key]['sharers_string']["string"] = \Helper_common::getSharerStringforPost($wall_post[0]->getId(), $userId);
					$return_r["data"]["wallpost"][$key]['shared_post_info'] = \Helper_common::getSharedPostInfoArray($wall_post[0]->getId(), $userId);
					$return_r["data"]["wallpost"][$key]['sharers_string']["shared_from_wallpost_exist"] = true;
					$return_r["data"]["wallpost"][$key]['original_user']['post_created_at'] = \Helper_common::nicetime( $wall_post[0]->getShared_from_wallpost()->getCreated_at()->format("Y-m-d H:i:s") );
				}
				else
				{
					$return_r["data"]["wallpost"][$key]['sharers_string']["string"]  = $wall_post[0]->getWall_postsFrom_user()->getFirstname().' '.$wall_post[0]->getWall_postsFrom_user()->getLastname();
					$return_r["data"]["wallpost"][$key]['shared_post_info'] = $wall_post[0]->getWall_postsFrom_user()->getFirstname().' '.$wall_post[0]->getWall_postsFrom_user()->getLastname();
					$return_r["data"]["wallpost"][$key]['sharers_string']["shared_from_wallpost_exist"] = false;
					$return_r["data"]["wallpost"][$key]['original_user']['post_created_at'] = "";

				}
			}

			$return_r["data"]["wallpost"][$key]['is_my_wallpost'] = $wall_post[0]->getWall_postsFrom_user()->getId() == $userId?1:0;


			try {$em->getFilters()->disable('soft-deleteable');} catch (\Exception $e) {}

			$original_user_obj = $em->find('\Entities\ilook_user', $wall_post[0]->getWall_postsOriginal_user()->getId());

			$return_r["data"]["wallpost"][$key]['original_user']['id'] = $original_user_obj->getId();
			$return_r["data"]["wallpost"][$key]['original_user']['fullname'] = $original_user_obj->getFirstname()." ".$original_user_obj->getLastname();
			$return_r["data"]["wallpost"][$key]['original_user']['user_type'] = $original_user_obj->getUser_type();
			$return_r["data"]["wallpost"][$key]['original_user']['photo_medium_size'] = \Helper_common::getUserProfessionalPhoto( $original_user_obj->getId(), 2 );

			if(  $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_SHARED_TEXT
				|| $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_SHARED_LINK
				|| $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_SHARED_PROFILE_LINK
				|| $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING
			)// IF THE WALLPOST IS SHARED ==============> Original user ==> From User
			{
				$return_r["data"]["wallpost"][$key]['from_user']['id'] = $original_user_obj->getId();
				$return_r["data"]["wallpost"][$key]['from_user']['is_deleted'] = $original_user_obj->getDeleted_at()?1:0;
				$return_r["data"]["wallpost"][$key]['from_user']['fullname'] = $original_user_obj->getFirstname()." ".$original_user_obj->getLastname();
				$return_r["data"]["wallpost"][$key]['from_user']['photo'] = \Helper_common::getUserProfessionalPhoto( $original_user_obj->getId(), 3 );
				$return_r["data"]["wallpost"][$key]['from_user']['photo_medium_size'] = \Helper_common::getUserProfessionalPhoto( $original_user_obj->getId(), 2 );

				if($wall_post[0]->getShared_from_wallpost())
				{
					$return_r["data"]["wallpost"][$key]['from_user']['shared_walltext'] = $wall_post[0]->getShared_from_wallpost()->getwall_post_text();
				}
				else if( $wall_post[0]->getWall_post_text_when_shared()!= null)
				{
					$return_r["data"]["wallpost"][$key]['from_user']['shared_walltext'] = $wall_post[0]->getWall_post_text_when_shared();
				}
				else
				{
					$return_r["data"]["wallpost"][$key]['from_user']['shared_walltext'] = "";
				}
			}
			else
			{
				$return_r["data"]["wallpost"][$key]["from_user"] = null;
			}

			//WALLPOST USER INFO
			$return_r["data"]["wallpost"][$key]['wallpost_user_id'] = $wall_post[0]->getWall_postsFrom_user()->getId();
			$return_r["data"]["wallpost"][$key]['wallpost_user_prof_image_path'] = \Helper_common::getUserProfessionalPhoto($wall_post[0]->getWall_postsFrom_user()->getId(), 3);
			$return_r["data"]["wallpost"][$key]['wallpost_user_prof_image_medium_size_path'] = \Helper_common::getUserProfessionalPhoto($wall_post[0]->getWall_postsFrom_user()->getId(), 2);
			$return_r["data"]["wallpost"][$key]['wallpost_user_name'] = $wall_post[0]->getWall_postsFrom_user()->getFirstname()." ".$wall_post[0]->getWall_postsFrom_user()->getLastname();
			$return_r["data"]["wallpost"][$key]['wallpost_user_type'] = $wall_post[0]->getWall_postsFrom_user()->getUser_type();
			$return_r["data"]["wallpost"][$key]['wallpost_user_gender'] = $wall_post[0]->getWall_postsFrom_user()->getGender();
			$return_r["data"]["wallpost"][$key]['is_wallpost_reported_abuse'] = \Extended\report_abuse::getAbuseReport($userId,$wall_post[0]->getId());

			//$return_r["data"]["wallpost"][$key]['wallpost_user_name'] = $user_obj->getFirstname()." ".$user_obj->getLastname();

			//WALLPOST SOCIALISE PHOTO INFO
			if( $wall_type && $wall_type == self::WALL_TYPE_SOCIALISE )
			{
				// Getting max first five images of this wallpost
				if( $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM
					|| $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING
				)
				{
					$photos = $em->getRepository('\Entities\socialise_photo')->findBy( array(
						'socialise_photosSocialise_album'=>$wall_post[0]->getWall_postsSocialise_album()->getId(),
						'photoGroup'=>$wall_post[0]->getPhotoGroup()->getId() ),
						array(
							'id' => 'ASC'
						), 5, 0);



					foreach ( $photos as $keyy => $photo )
					{
						$return_r["data"]["wallpost"][$key]['collage'][$keyy]['image_path'] = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_default/wall_thumbnails/thumbnail_".$photo->getImage_name();
						$return_r["data"]["wallpost"][$key]['collage'][$keyy]['image_id'] = $photo->getId();
						$return_r["data"]["wallpost"][$key]['collage'][$keyy]['image_desc'] = $photo->getDescription();
					}

					$size = @getimagesize( $return_r["data"]["wallpost"][$key]['collage'][0]['image_path'] );

					$aspect = 1;
					if( $size )
					{
						$width = $size[0];
						$height = $size[1];
						$aspect = $height / $width;
					}
					if ($aspect >= 1)
					{
						//vertical
						$return_r["data"]["wallpost"][$key]['first_img_portrait_or_landscape'] = 1;
					}
					else
					{
						//horizontal
						$return_r["data"]["wallpost"][$key]['first_img_portrait_or_landscape'] = 2;
					}

					//First 10 images with some informatiom.
					if( $for_mobile ==true )
					{
						$photoss = $em->getRepository('\Entities\socialise_photo')->findBy( array(
							'socialise_photosSocialise_album'=>$wall_post[0]->getWall_postsSocialise_album()->getId(),
							'photoGroup'=>$wall_post[0]->getPhotoGroup()->getId() ),
							array(
								'id' => 'ASC'
							), 10, 0);

						foreach ( $photoss as $keyy => $photo )
						{
							$return_r["data"]["wallpost"][$key]['collage'][$keyy]['realPhoto'] = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_default/wall_thumbnails/thumbnail_".$photo->getImage_name();
							$return_r["data"]["wallpost"][$key]['collage'][$keyy]['photoID'] = $photo->getId();
							$return_r["data"]["wallpost"][$key]['collage'][$keyy]['no_of_comments'] = $photo->getComment_count();
							$return_r["data"]["wallpost"][$key]['collage'][$keyy]['no_of_oks'] = $photo->getLike_count();
							$return_r["data"]["wallpost"][$key]['collage'][$keyy]['no_of_shares'] = $photo->getShare_count();
							$return_r["data"]["wallpost"][$key]['collage'][$keyy]['am_I_ok_this_photo'] = self::didUserLikedalbum($userId, $wall_post[0]->getWall_postsSocialise_album()->getId());

							if ($photo->getComment_count() === null){
								$return_r["data"]["wallpost"][$key]['collage'][$keyy]['no_of_comments'] = 0;
							}
							if ($photo->getLike_count() === null){
								$return_r["data"]["wallpost"][$key]['collage'][$keyy]['no_of_oks'] = 0;
							}
							if ($photo->getShare_count() === null){
								$return_r["data"]["wallpost"][$key]['collage'][$keyy]['no_of_shares'] = 0;
							}

						}
					}
				}
				// Getting max first five images of this wallpost
				else if( $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_ALBUM )
				{
					$photos = $em->getRepository('\Entities\socialise_photo')->findBy( array(
						'socialise_photosSocialise_album'=>
							$wall_post[0]->getWall_postsSocialise_album()->getId() ),
						array(
							'id' => 'ASC'
						), 5, 0);

					//$album_obj = \Extended\socialise_album::getRowObject($wall_post[0]->getWall_postsSocialise_album()->getId());

					$album_name = $wall_post[0]->getWall_postsSocialise_album()->getAlbum_name();
					$album_timestamp = $wall_post[0]->getWall_postsSocialise_album()->getCreated_at_timestamp()->getTimestamp();
					foreach ( $photos as $keyy => $photo )
					{
						$image_path = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_".$album_name."_".$album_timestamp."/wall_thumbnails/thumbnail_".$photo->getImage_name();
						$return_r["data"]["wallpost"][$key]['collage'][$keyy]['image_path'] = $image_path;
						$return_r["data"]["wallpost"][$key]['collage'][$keyy]['image_id'] = $photo->getId();
						$return_r["data"]["wallpost"][$key]['collage'][$keyy]['image_desc'] = $photo->getDescription();
					}

					$size = @getimagesize( $return_r["data"]["wallpost"][$key]['collage'][0]['image_path'] );

					$aspect = 1;
					if( $size )
					{
						$width = $size[0];
						$height = $size[1];
						$aspect = $height / $width;
					}
					if ($aspect >= 1)
					{
						//vertical
						$return_r["data"]["wallpost"][$key]['first_img_portrait_or_landscape'] = 1;
					}
					else
					{
						//horizontal
						$return_r["data"]["wallpost"][$key]['first_img_portrait_or_landscape'] = 2;
					}


					//First 10 images with some informatiom.
					if( $for_mobile ==true )
					{
						$photoss = $em->getRepository('\Entities\socialise_photo')->findBy( array(
							'socialise_photosSocialise_album'=>
								$wall_post[0]->getWall_postsSocialise_album()->getId() ),
							array(
								'id' => 'ASC'
							), 10, 0);


						foreach ( $photoss as $keyy => $photo )
						{
							$image_path = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_".$album_name."_".$album_timestamp."/wall_thumbnails/thumbnail_".$photo->getImage_name();
							$return_r["data"]["wallpost"][$key]['collage'][$keyy]['realPhoto'] = $image_path;
							$return_r["data"]["wallpost"][$key]['collage'][$keyy]['photoID'] = $photo->getId();
							$return_r["data"]["wallpost"][$key]['collage'][$keyy]['no_of_comments'] = $photo->getComment_count();
							$return_r["data"]["wallpost"][$key]['collage'][$keyy]['no_of_oks'] = $photo->getLike_count();
							$return_r["data"]["wallpost"][$key]['collage'][$keyy]['no_of_shares'] = $photo->getShare_count();
							$return_r["data"]["wallpost"][$key]['collage'][$keyy]['am_I_ok_this_photo'] = self::didUserLikedalbum($userId, $wall_post[0]->getWall_postsSocialise_album()->getId());

							if ($photo->getComment_count() === null){
								$return_r["data"]["wallpost"][$key]['collage'][$keyy]['no_of_comments'] = 0;
							}
							if ($photo->getLike_count() === null){
								$return_r["data"]["wallpost"][$key]['collage'][$keyy]['no_of_oks'] = 0;
							}
							if ($photo->getShare_count() === null){
								$return_r["data"]["wallpost"][$key]['collage'][$keyy]['no_of_shares'] = 0;
							}

						}
					}
				}
				else if( $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_PROFILE_PHOTO_CHANGED )
				{

					$photo = \Extended\socialise_photo::getRowObject( $wall_post[0]->getSocialisePhoto()->getId() );

					$album_obj = \Extended\socialise_album::getRowObject($photo->getSocialise_photosSocialise_album()->getId() );

					$album_name = $album_obj->getAlbum_name();
					$album_timestamp = $album_obj->getCreated_at_timestamp()->getTimestamp();

					$image_path = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_".\Extended\socialise_album::PROFILE_PHOTOS_ALBUM_NAME."/wall_thumbnails/thumbnail_".$photo->getImage_name();
					$return_r["data"]["wallpost"][$key]['collage'][0]['image_path'] = $image_path;
					$return_r["data"]["wallpost"][$key]['collage'][0]['image_id'] = $photo->getId();
					$return_r["data"]["wallpost"][$key]['collage'][0]['image_desc'] = $photo->getDescription();

					$size = @getimagesize( $return_r["data"]["wallpost"][$key]['collage'][0]['image_path'] );

					$aspect = 1;
					if( $size )
					{
						$width = $size[0];
						$height = $size[1];
						$aspect = $height / $width;
					}
					if ($aspect >= 1)
					{
						//vertical
						$return_r["data"]["wallpost"][$key]['first_img_portrait_or_landscape'] = 1;
					}
					else
					{
						//horizontal
						$return_r["data"]["wallpost"][$key]['first_img_portrait_or_landscape'] = 2;
					}
					if( $for_mobile ==true )
					{
						$return_r["data"]["wallpost"][$key]['collage'][0]['realPhoto'] = $image_path;
						$return_r["data"]["wallpost"][$key]['collage'][0]['photoID'] = $photo->getId();
						$return_r["data"]["wallpost"][$key]['collage'][0]['no_of_comments'] = $photo->getComment_count();
						$return_r["data"]["wallpost"][$key]['collage'][0]['no_of_oks'] = $photo->getLike_count();
						$return_r["data"]["wallpost"][$key]['collage'][0]['no_of_shares'] = $photo->getShare_count();
						$return_r["data"]["wallpost"][$key]['collage'][0]['am_I_ok_this_photo'] = self::didUserLikedalbum($userId, $wall_post[0]->getWall_postsSocialise_album()->getId());
					}
				}

			}

			//GET WALLPOST WISH INFO. [Only in case of wallpost with post_update_type = 11]
			if( $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_WISH )
			{
				$wish_obj = \Extended\wishes::getWishByWallpostId( $wall_post[0]->getId() );
				if( $wish_obj )
				{
					$return_r["data"]["wallpost"][$key]['wish']['wish_id'] = $wish_obj->getId();
					$return_r["data"]["wallpost"][$key]['wish']['underlying_text'] = $wish_obj->getUnderlying_text();
					$return_r["data"]["wallpost"][$key]['wish']['wish_type'] = \Extended\wishes::getDiscriminatorValue( $wish_obj );
					if( $return_r["data"]["wallpost"][$key]['wish']['wish_type'] == 1 )//Means wish type new link.
					{
						try {$em->getFilters()->disable('soft-deleteable');} catch (\Exception $e) {}
						$link_ilook_user_obj = $em->find('\Entities\ilook_user', $wish_obj->getLink_ilook_user_id());
						$return_r["data"]["wallpost"][$key]['wish']['link_ilook_user_id'] = $wish_obj->getLink_ilook_user_id();
						$return_r["data"]["wallpost"][$key]['wish']['link_ilook_user_name'] = $link_ilook_user_obj->getFirstname()." ".$link_ilook_user_obj->getLastname();
						$return_r["data"]["wallpost"][$key]['wish']['link_ilook_user_medium_photo'] = \Helper_common::getUserProfessionalPhoto( $wish_obj->getLink_ilook_user_id(), 2 );
						$return_r["data"]["wallpost"][$key]['wish']['link_ilook_user_professional_info'] = implode( ", ", array_filter(\Helper_common::getUserProfessionalInfo( $wish_obj->getLink_ilook_user_id() ) ));
					}
				}
			}

			//WALLPOST COMMENTS INFO

			$ii = 1;
			$counter = 0;
			foreach ( array_reverse( $wall_post[0]->getWall_postsComment()->toArray() ) as $keyy=>$comment )
			{
				$counter++;
				//Checking that, is comment hidden on this user's wall?
				if( ! \Extended\users_comments_visibility::IsCommentHiddenOnUserWall($comment->getId(), $userId) )
				{

					$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['id'] = $comment->getId();
					$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['text'] = $comment->getComment_text();
					$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['created_at'] = \Helper_common::nicetime($comment->getcreated_at()->format( "Y-m-d H:i:s" ));
					$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['user_id'] = $comment->getCommentsIlook_user()->getId();
					$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['user_name'] = $comment->getCommentsIlook_user()->getFirstname()." ".$comment->getCommentsIlook_user()->getLastname();

					//Check if the commenter user exist in $blocked_user_ids_arr i.e if i have blocked him or he has blocked me?
					if($blocked_user_ids_arr)
					{
						$comment_user_photo_detail = \Extended\comments::getUsersPhotoForComment($comment->getCommentsIlook_user()->getId(), $blocked_user_ids_arr);
					}

					else
					{
						$comment_user_photo_detail['photo_path'] = \Helper_common::getUserProfessionalPhoto($comment->getCommentsIlook_user()->getId(), 3);
						$comment_user_photo_detail['is_photo_clickable'] = true;
					}
					//End of code to check if the commenter user exist in $blocked_user_ids_arr i.e if i have blocked him or he has blocked me?

					//Check if commenter user account is closed then make his/her prof_image unclickable.
					if( $comment->getCommentsIlook_user()->getAccount_closed_on() != null )
					{
						$comment_user_photo_detail['photo_path'] = \Helper_common::getUserProfessionalPhoto($comment->getCommentsIlook_user()->getId(), 3);
						$comment_user_photo_detail['is_photo_clickable'] = false;
					}
					//End - Check if commenter user account is closed then make his/her prof_image unclickable.

					$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['user_prof_image_path'] = $comment_user_photo_detail['photo_path'];
					$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['is_user_image_clickable'] = $comment_user_photo_detail['is_photo_clickable'];

					$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['user_prof_image_medium_path'] = \Helper_common::getUserProfessionalPhoto($comment->getCommentsIlook_user()->getId(), 2);
					if( $comment->getCommentsIlook_user()->getId() == $userId ):
						$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['is_my_comment'] = 1;
					else:
						$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['is_my_comment'] = 0;
					endif;
					$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['is_hidden'] = 0;

					$ii--;

					if( $counter == 2 ):
						break;
					endif;
				}

				else
				{

					$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['id'] = $comment->getId();
					$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['text'] = $comment->getComment_text();
					$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['created_at'] = \Helper_common::nicetime($comment->getcreated_at()->format( "Y-m-d H:i:s" ));
					$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['user_id'] = $comment->getCommentsIlook_user()->getId();
					$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['user_name'] = $comment->getCommentsIlook_user()->getFirstname()." ".$comment->getCommentsIlook_user()->getLastname();
					$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['user_prof_image_path'] = \Helper_common::getUserProfessionalPhoto($comment->getCommentsIlook_user()->getId(), 3);
					$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['user_prof_image_medium_path'] = \Helper_common::getUserProfessionalPhoto($comment->getCommentsIlook_user()->getId(), 2);
// 					$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['user_social_image_path'] = \Helper_common::getUserSocializePhoto($comment->getCommentsIlook_user()->getId(), 3);
					if( $comment->getCommentsIlook_user()->getId() == $userId ):
						$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['is_my_comment'] = 1;
					else:
						$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['is_my_comment'] = 0;
					endif;
					$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['is_hidden'] = 1;

					$ii--;

					if( $counter == 2 ):
						break;
					endif;
				}
			}
		}

		$return_r["is_there_more_recs"] = 0;
		if( $q_2 )
		{
			$return_r["is_there_more_recs"] = 1;
		}
		$em->getFilters()->enable('soft-deleteable');

		return $return_r;

	}
	/*public static function getRecentUpdates( $userId, $offset = 0 , $limit = 10, $wall_type = self::WALL_TYPE_PROFESSIONAL, $last_activity_date_time_obj ,$for_mobile=false)
	{
		//------------------------------------------------
		//Fetching records of users who has been blocked.
		//------------------------------------------------
		$blocked_user_ids_arr = \Extended\blocked_users::getAllBlockersAndBlockedUsers($userId);
		//---------------------------------------------------
		//End Fetching records of users who has been blocked.
		//---------------------------------------------------
		
		$return_r = array();
		
		$em = \Zend_Registry::get('em');
		
		// Enable / Disable filter, for specified entity (default is enabled for all)
		$filter = $em->getFilters()->disable('soft-deleteable');
		$filter->disableForEntity('\Entities\wall_post');
		$filter->disableForEntity('\Entities\ilook_user');
		
		$user_obj = \Extended\ilook_user::getRowObject( $userId );
		
		$my_links_r = explode( ",", $user_obj->getLink_list() );
		
		//GETTING RECORDS(WALLPOSTS) ACCORDING TO LIMIT AND OFFSET.
		//QUERY 1
		$qb = $em->createQueryBuilder();
		$q = $qb->select( 'wp.id, wp.last_activity_datetime' )
		->from( '\Entities\wall_post', 'wp' )
		->LeftJoin( 'wp.wall_postsLikes', 'likes' )
		->LeftJoin( 'wp.wall_postsShare', 'shares' )
		->LeftJoin( 'wp.wall_postsComment', 'comments' )
		->leftJoin( 'wp.wall_postsFrom_user','fromUser');
		if( $wall_type == self::WALL_TYPE_SOCIALISE )
		{
    		$q->leftJoin( 'wp.wall_postsSocialise_album','album');
    		$q->leftJoin( 'album.socialise_albumsSocialise_photo','photo');
    		$q->having('count(photo) > 0 OR wp.post_update_type = 11');
		}
		$q->setParameter( 'my_links_r', $my_links_r )
		->setParameter( 1, $userId )
		->setParameter( 6, $last_activity_date_time_obj )
		->setFirstResult( $offset )
		->setMaxResults( $limit )
		->groupBy( 'wp.id, wp.last_activity_datetime, wp.post_update_type' )
		->orderBy( 'wp.last_activity_datetime', 'DESC' );
		
		if( $wall_type )
		{
			$q->where( 'wp.wall_postsFrom_user = ?1 AND wp.wall_type = ?4 AND wp.last_activity_datetime > ?6' );
			$q->orWhere( 'wp.wall_postsFrom_user IN (:my_links_r) AND wp.wall_type = ?4 AND wp.last_activity_datetime > ?6' );
			$q->andWhere('fromUser.account_closed_on is null');
			if( $blocked_user_ids_arr ):
				$q->setParameter( 'blocked_users_r', $blocked_user_ids_arr );
				$q->andWhere( 'wp.wall_postsFrom_user NOT IN (:blocked_users_r)' );
			endif;
			
			$q->setParameter( 4, $wall_type );
		}
		
 		$q = $q->getQuery()->getResult( \Doctrine\ORM\Query::HYDRATE_ARRAY );
 		
		if( !$q )
		{
			$return_r["data"] = 0;
			$return_r["is_there_more_recs"] = 0;
			return $return_r;
			
		}
		
		$selected_wp_ids_r = array();
		foreach ( $q as $selected_wp_id )
		{
			$selected_wp_ids_r[] = $selected_wp_id['id'];
		}
		
		//GETTING WALL POSTS ACCORDING TO SELECTED RECORDS IN QUERY 1.
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select('wp, fromUsr.id, 
		                      fromUsr.professional_image, 
		                      fromUsr.gender, 
		                      fromUsr.firstname, 
		                      fromUsr.lastname')
		->from( '\Entities\wall_post', 'wp' )
		->LeftJoin( 'wp.wall_postsFrom_user', 'fromUsr' )
		->where( 'wp.id IN (:selected_wp_ids_r)' )
		->setParameter( 'selected_wp_ids_r', $selected_wp_ids_r )
		->orderBy( 'wp.last_activity_datetime', 'DESC' );
		
		// wallpost Comments join
		$q_1->addSelect( 'wall_comments, comment_user' );
		$q_1->LeftJoin( 'wp.wall_postsComment', 'wall_comments' );
		$q_1->LeftJoin( 'wall_comments.commentsIlook_user', 'comment_user' );
		
		// wallpost Likes join
		$q_1->addSelect( 'likes' );
		$q_1->LeftJoin( 'wp.wall_postsLikes', 'likes' );
		$q_1->LeftJoin( 'likes.likesLiked_by', 'likedByUser' );
	
		$q_1 = $q_1->getQuery()->getResult ();
		
		if( !$q_1 )
		{
			$return_r["data"] = 0;
			$return_r["is_there_more_recs"] = 0;
			return $return_r;
		}
	
		//Checking that is there any more wall posts to show, checking according to same conditions and cretiria.
		// According to Query 1
		$last_record = end( $q );
		$oldest_datetime = $last_record['last_activity_datetime'];
	
		$qb_2 = $em->createQueryBuilder();
		$q_2 = $qb_2->select( 'wp.id' )
        		->from( '\Entities\wall_post', 'wp' )
        		->LeftJoin( 'wp.wall_postsLikes', 'likes' )
        		->LeftJoin( 'wp.wall_postsShare', 'shares' )
        		->LeftJoin( 'wp.wall_postsComment', 'comments' )
        		->leftJoin( 'wp.wall_postsFrom_user','fromUser');
        		if( $wall_type == self::WALL_TYPE_SOCIALISE )
        		{
        			$q_2->leftJoin( 'wp.wall_postsSocialise_album','album');
        			$q_2->leftJoin( 'album.socialise_albumsSocialise_photo','photo');
        			$q_2->having('count(photo) > 0');
        		}
        		$q_2->setParameter( 'my_links_r', $my_links_r )
        		->setParameter( 1, $userId )
        		->setParameter( 5, $last_activity_date_time_obj )
        		->groupBy( 'wp.id, wp.last_activity_datetime' )
        		->orderBy( 'wp.last_activity_datetime', 'DESC' );
		
		if( $wall_type )
		{
			$q_2->where( 'wp.wall_postsFrom_user = ?1 AND wp.wall_type = ?4 AND wp.last_activity_datetime > ?5' );
			$q_2->orWhere( 'wp.wall_postsFrom_user IN (:my_links_r) AND wp.wall_type = ?4 AND wp.last_activity_datetime > ?5' );
			
			$q_2->andWhere('fromUser.account_closed_on is null');
			if( $blocked_user_ids_arr ):
				$q_2->setParameter( 'blocked_users_r', $blocked_user_ids_arr );
				$q_2->andWhere( 'wp.wall_postsFrom_user NOT IN (:blocked_users_r)' );
			endif;
			$q_2->setParameter( 4, $wall_type );
		}
		
	
		$q_2 = $q_2->getQuery ()->getResult ( \Doctrine\ORM\Query::HYDRATE_ARRAY );
		foreach ( $q_1 as $key=>$wall_post )
		{
			//WALL POST INFO
			$return_r["data"]["wallpost"][$key]['id'] = $wall_post[0]->getId();
			$return_r["data"]["wallpost"][$key]['post_update_type'] = $wall_post[0]->getPost_update_type();
			
			if( $wall_post[0]->getWall_post_text() !=  null ):
				$return_r["data"]["wallpost"][$key]['wallpost_text'] = $wall_post[0]->getWall_post_text();
			else:
				$return_r["data"]["wallpost"][$key]['wallpost_text'] = "";
			endif;
			
			if( $wall_post[0]->getWall_post_text_when_shared() !=  null ):
				$return_r["data"]["wallpost"][$key]['wall_post_text_when_shared'] = $wall_post[0]->getWall_post_text_when_shared();
			else:
				$return_r["data"]["wallpost"][$key]['wall_post_text_when_shared'] = "";
			endif;
			
			$return_r["data"]["wallpost"][$key]['visibility_criteria'] = $wall_post[0]->getVisibility_criteria();
			$return_r["data"]["wallpost"][$key]['wall_type'] = $wall_post[0]->getWall_type();
			$return_r["data"]["wallpost"][$key]['comment_count'] = $wall_post[0]->getWall_postsComment()->count(); 
			$return_r["data"]["wallpost"][$key]['like_count'] = $wall_post[0]->getWall_postsLikes()->count(); 
			$return_r["data"]["wallpost"][$key]['share_count'] = $wall_post[0]->getWall_postsShare()->count();
			$return_r["data"]["wallpost"][$key]['post_type'] = $wall_post[0]->getPost_type();
			$return_r["data"]["wallpost"][$key]['group_id'] = $wall_post[0]->getGroup_id();
			$return_r["data"]["wallpost"][$key]['job_id'] = $wall_post[0]->getJob_id();
			$return_r["data"]["wallpost"][$key]['company_id'] = $wall_post[0]->getCompany_id();
			$return_r["data"]["wallpost"][$key]['did_I_liked'] = self::didUserLikedWallpost($userId, $wall_post[0]->getId());
			
			
			if( $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_PROFILE_LINK || $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_SHARED_PROFILE_LINK )
			{
				$link_data = \Zend_Json::decode( $wall_post[0]->getLink_data() );
				$shared_profile_user_id = $link_data["shared_profile_user_id"];
				
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
				
				$return_r["data"]["wallpost"][$key]['url_data']['url_title'] = $shared_profile_user_obj->getFirstname()." ".$shared_profile_user_obj->getLastname();
				$return_r["data"]["wallpost"][$key]['url_data']['url_content'] = "Check out ".$return_r["data"]["wallpost"][$key]['url_data']['url_title']."'s professional Profile and Connect with ".$him." on iLook.";
				$return_r["data"]["wallpost"][$key]['url_data']['image_src'] = \Helper_common::getUserProfessionalPhoto( $shared_profile_user_obj->getId(), 2 );
			}
			else
			{	
				$return_r["data"]["wallpost"][$key]['url_data'] = \Zend_Json::decode( $wall_post[0]->getLink_data() );
			}
			$return_r["data"]["wallpost"][$key]['is_ok_comment_share_pannel_visible'] = \Helper_common::is_ok_comment_share_pannel_visible( $wall_post[0]->getVisibility_criteria(), $wall_post[0]->getWall_postsFrom_user()->getId(), array($userId),$userId );
			$return_r["data"]["wallpost"][$key]['created_at'] = \Helper_common::nicetime( $wall_post[0]->getCreated_at()->format("Y-m-d H:i:s") );
			$return_r["data"]["wallpost"][$key]['last_activity_datetime'] = $wall_post[0]->getLast_activity_datetime()->format("Y-m-d H:i:s") ;
			$return_r["data"]["wallpost"][$key]['likers_string'] = \Helper_common::getLikersStringByWallpostId( $wall_post[0]->getId(), $userId );
			
			
			$return_r["data"]["wallpost"][$key]['is_my_wallpost'] = $wall_post[0]->getWall_postsFrom_user()->getId() == $userId?1:0;
			
			
			try {$em->getFilters()->disable('soft-deleteable');} catch (\Exception $e) {}
			
			$original_user_obj = $em->find('\Entities\ilook_user', $wall_post[0]->getWall_postsOriginal_user()->getId());
			
			$return_r["data"]["wallpost"][$key]['original_user']['id'] = $original_user_obj->getId();
			$return_r["data"]["wallpost"][$key]['original_user']['fullname'] = $original_user_obj->getFirstname()." ".$original_user_obj->getLastname();
			$return_r["data"]["wallpost"][$key]['original_user']['photo_medium_size'] = \Helper_common::getUserProfessionalPhoto( $original_user_obj->getId(), 2 );
			
			if(  $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_SHARED_TEXT 
			    || $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_SHARED_LINK 
			    || $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_SHARED_PROFILE_LINK
			   )// IF THE WALLPOST IS SHARED ==============> Original user ==> From User
			{
				$return_r["data"]["wallpost"][$key]['from_user']['id'] = $original_user_obj->getId();
				$return_r["data"]["wallpost"][$key]['from_user']['is_deleted'] = $original_user_obj->getDeleted_at()?1:0;
				$return_r["data"]["wallpost"][$key]['from_user']['fullname'] = $original_user_obj->getFirstname()." ".$original_user_obj->getLastname();
				$return_r["data"]["wallpost"][$key]['from_user']['photo'] = \Helper_common::getUserProfessionalPhoto( $original_user_obj->getId(), 3 );
				$return_r["data"]["wallpost"][$key]['from_user']['photo_medium_size'] = \Helper_common::getUserProfessionalPhoto( $original_user_obj->getId(), 2 );
				
				if( $wall_post[0]->getWall_post_text_when_shared()!= null)
				{
					$return_r["data"]["wallpost"][$key]['from_user']['shared_walltext'] = $wall_post[0]->getWall_post_text_when_shared();
				}
				else
				{
					$return_r["data"]["wallpost"][$key]['from_user']['shared_walltext'] = "";
				}
			}
			else
			{
				$return_r["data"]["wallpost"][$key]["from_user"] = null;
			}
			
			//WALLPOST USER INFO
			$return_r["data"]["wallpost"][$key]['wallpost_user_id'] = $wall_post[0]->getWall_postsFrom_user()->getId();
			$return_r["data"]["wallpost"][$key]['wallpost_user_prof_image_path'] = \Helper_common::getUserProfessionalPhoto($wall_post[0]->getWall_postsFrom_user()->getId(), 3);
			$return_r["data"]["wallpost"][$key]['wallpost_user_prof_image_medium_size_path'] = \Helper_common::getUserProfessionalPhoto($wall_post[0]->getWall_postsFrom_user()->getId(), 2);
			$return_r["data"]["wallpost"][$key]['wallpost_user_name'] = $wall_post[0]->getWall_postsFrom_user()->getFirstname()." ".$wall_post[0]->getWall_postsFrom_user()->getLastname();
			$return_r["data"]["wallpost"][$key]['wallpost_user_gender'] = $wall_post[0]->getWall_postsFrom_user()->getGender();
			$return_r["data"]["wallpost"][$key]['is_wallpost_reported_abuse'] = \Extended\report_abuse::getAbuseReport($userId,$wall_post[0]->getId());
			
			//$return_r["data"]["wallpost"][$key]['wallpost_user_name'] = $user_obj->getFirstname()." ".$user_obj->getLastname();
			
			//WALLPOST SOCIALISE PHOTO INFO
			if( $wall_type && $wall_type == self::WALL_TYPE_SOCIALISE )
			{
			    // Getting max first five images of this wallpost
			    if( $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM
			        || $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING 
			        )
			    {
			        $photos = $em->getRepository('\Entities\socialise_photo')->findBy( array(
    			                                                                         'socialise_photosSocialise_album'=>$wall_post[0]->getWall_postsSocialise_album()->getId(), 
    			                                                                         'photoGroup'=>$wall_post[0]->getPhotoGroup()->getId() ),
			                                                                          array(
			                                                                              'id' => 'ASC'
			                                                                          ), 5, 0);
			        

			        
			        foreach ( $photos as $keyy => $photo )
			        {
			            $return_r["data"]["wallpost"][$key]['collage'][$keyy]['image_path'] = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_default/wall_thumbnails/thumbnail_".$photo->getImage_name();
			            $return_r["data"]["wallpost"][$key]['collage'][$keyy]['image_id'] = $photo->getId();
			        }
			        
			        $size = @getimagesize( $return_r["data"]["wallpost"][$key]['collage'][0]['image_path'] );
			        
			        $aspect = 1;
			        if( $size )
			        {
				        $width = $size[0];
				        $height = $size[1];
				        $aspect = $height / $width;
			        }
			        if ($aspect >= 1)
			        {
			            //vertical
			           $return_r["data"]["wallpost"][$key]['first_img_portrait_or_landscape'] = 1;
			        }
			        else
			        {
			            //horizontal
			            $return_r["data"]["wallpost"][$key]['first_img_portrait_or_landscape'] = 2;
			        }
			        
			        //First 10 images with some informatiom.
			        if( $for_mobile ==true )
			        {
			        	$photoss = $em->getRepository('\Entities\socialise_photo')->findBy( array(
			        			'socialise_photosSocialise_album'=>$wall_post[0]->getWall_postsSocialise_album()->getId(),
			        			'photoGroup'=>$wall_post[0]->getPhotoGroup()->getId() ),
			        			array(
			        					'id' => 'ASC'
			        			), 10, 0);
			        
			        	foreach ( $photoss as $keyy => $photo )
			        	{
			        		$return_r["data"]["wallpost"][$key]['collage'][$keyy]['realPhoto'] = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_default/wall_thumbnails/thumbnail_".$photo->getImage_name();
			        		$return_r["data"]["wallpost"][$key]['collage'][$keyy]['photoID'] = $photo->getId();
			        		$return_r["data"]["wallpost"][$key]['collage'][$keyy]['no_of_comments'] = $photo->getComment_count();
			        		$return_r["data"]["wallpost"][$key]['collage'][$keyy]['no_of_oks'] = $photo->getLike_count();
			        		$return_r["data"]["wallpost"][$key]['collage'][$keyy]['no_of_shares'] = $photo->getShare_count();
			        		$return_r["data"]["wallpost"][$key]['collage'][$keyy]['am_I_ok_this_photo'] = self::didUserLikedalbum($userId, $wall_post[0]->getWall_postsSocialise_album()->getId());
			        		
			        		if ($photo->getComment_count() === null){
			        			$return_r["data"]["wallpost"][$key]['collage'][$keyy]['no_of_comments'] = 0;
			        		}
			        		if ($photo->getLike_count() === null){
			        			$return_r["data"]["wallpost"][$key]['collage'][$keyy]['no_of_oks'] = 0;
			        		}
			        		if ($photo->getShare_count() === null){
			        			$return_r["data"]["wallpost"][$key]['collage'][$keyy]['no_of_shares'] = 0;
			        		}
			        
			        	}
			        }
			    }
			    // Getting max first five images of this wallpost
			    else if( $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_ALBUM )
			    {
			        $photos = $em->getRepository('\Entities\socialise_photo')->findBy( array(
                                        			            'socialise_photosSocialise_album'=>
			                                                         $wall_post[0]->getWall_postsSocialise_album()->getId() ),
                                        			            array(
                                        			                'id' => 'ASC'
                                        			            ), 5, 0);
			        
			        //$album_obj = \Extended\socialise_album::getRowObject($wall_post[0]->getWall_postsSocialise_album()->getId());
			        
		            $album_name = $wall_post[0]->getWall_postsSocialise_album()->getAlbum_name();
		            $album_timestamp = $wall_post[0]->getWall_postsSocialise_album()->getCreated_at_timestamp()->getTimestamp();
			        foreach ( $photos as $keyy => $photo )
			        {
    			            $image_path = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_".$album_name."_".$album_timestamp."/wall_thumbnails/thumbnail_".$photo->getImage_name();
    			            $return_r["data"]["wallpost"][$key]['collage'][$keyy]['image_path'] = $image_path;
    			            $return_r["data"]["wallpost"][$key]['collage'][$keyy]['image_id'] = $photo->getId();
			        }
			         
			        $size = @getimagesize( $return_r["data"]["wallpost"][$key]['collage'][0]['image_path'] );

			        $aspect = 1;
			        if( $size )
			        {
			            $width = $size[0];
			            $height = $size[1];
			            $aspect = $height / $width;
			        }
			        if ($aspect >= 1)
			        {
			            //vertical
			            $return_r["data"]["wallpost"][$key]['first_img_portrait_or_landscape'] = 1;
			        }
			        else
			        {
			            //horizontal
			            $return_r["data"]["wallpost"][$key]['first_img_portrait_or_landscape'] = 2;
			        }
			        
			        
			        //First 10 images with some informatiom.
			        if( $for_mobile ==true )
			        {
			        	  $photoss = $em->getRepository('\Entities\socialise_photo')->findBy( array(
                                        			            'socialise_photosSocialise_album'=>
			                                                         $wall_post[0]->getWall_postsSocialise_album()->getId() ),
                                        			            array(
                                        			                'id' => 'ASC'
                                        			            ), 10, 0);
			        	 
			        	
			        	foreach ( $photoss as $keyy => $photo )
			        	{
			        		$image_path = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_".$album_name."_".$album_timestamp."/wall_thumbnails/thumbnail_".$photo->getImage_name();
    			            $return_r["data"]["wallpost"][$key]['collage'][$keyy]['realPhoto'] = $image_path;
    			            $return_r["data"]["wallpost"][$key]['collage'][$keyy]['photoID'] = $photo->getId();
			        		$return_r["data"]["wallpost"][$key]['collage'][$keyy]['no_of_comments'] = $photo->getComment_count();
			        		$return_r["data"]["wallpost"][$key]['collage'][$keyy]['no_of_oks'] = $photo->getLike_count();
			        		$return_r["data"]["wallpost"][$key]['collage'][$keyy]['no_of_shares'] = $photo->getShare_count();
			        		$return_r["data"]["wallpost"][$key]['collage'][$keyy]['am_I_ok_this_photo'] = self::didUserLikedalbum($userId, $wall_post[0]->getWall_postsSocialise_album()->getId());
			        		 
			        		if ($photo->getComment_count() === null){
			        			$return_r["data"]["wallpost"][$key]['collage'][$keyy]['no_of_comments'] = 0;
			        		}
			        		if ($photo->getLike_count() === null){
			        			$return_r["data"]["wallpost"][$key]['collage'][$keyy]['no_of_oks'] = 0;
			        		}
			        		if ($photo->getShare_count() === null){
			        			$return_r["data"]["wallpost"][$key]['collage'][$keyy]['no_of_shares'] = 0;
			        		}
			        		 
			        	}
			        }
			    }
			    else if( $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_PROFILE_PHOTO_CHANGED )
			    {
			        
			        $photo = \Extended\socialise_photo::getRowObject( $wall_post[0]->getSocialisePhoto()->getId() );
			        
			        $album_obj = \Extended\socialise_album::getRowObject($photo->getSocialise_photosSocialise_album()->getId() );
			         
			        $album_name = $album_obj->getAlbum_name();
			        $album_timestamp = $album_obj->getCreated_at_timestamp()->getTimestamp();
			        
		            $image_path = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_".\Extended\socialise_album::PROFILE_PHOTOS_ALBUM_NAME."/wall_thumbnails/thumbnail_".$photo->getImage_name();
		            $return_r["data"]["wallpost"][$key]['collage'][0]['image_path'] = $image_path;
		            $return_r["data"]["wallpost"][$key]['collage'][0]['image_id'] = $photo->getId();
			        
			        $size = @getimagesize( $return_r["data"]["wallpost"][$key]['collage'][0]['image_path'] );
			        
			        $aspect = 1;
			        if( $size )
			        {
			            $width = $size[0];
			            $height = $size[1];
			            $aspect = $height / $width;
			        }
			        if ($aspect >= 1)
			        {
			            //vertical
			            $return_r["data"]["wallpost"][$key]['first_img_portrait_or_landscape'] = 1;
			        }
			        else
			        {
			            //horizontal
			            $return_r["data"]["wallpost"][$key]['first_img_portrait_or_landscape'] = 2;
			        }
			        if( $for_mobile ==true )
			        {
				        $return_r["data"]["wallpost"][$key]['collage'][0]['realPhoto'] = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_default/wall_thumbnails/thumbnail_".$photo->getImage_name();
				        $return_r["data"]["wallpost"][$key]['collage'][0]['photoID'] = $photo->getId();
				        $return_r["data"]["wallpost"][$key]['collage'][0]['no_of_comments'] = $photo->getComment_count();
				        $return_r["data"]["wallpost"][$key]['collage'][0]['no_of_oks'] = $photo->getLike_count();
				        $return_r["data"]["wallpost"][$key]['collage'][0]['no_of_shares'] = $photo->getShare_count();
				        $return_r["data"]["wallpost"][$key]['collage'][0]['am_I_ok_this_photo'] = self::didUserLikedalbum($userId, $wall_post[0]->getWall_postsSocialise_album()->getId());
			        }
			    }
			    
			}
			
    		//GET WALLPOST WISH INFO. [Only in case of wallpost with post_update_type = 11]
    		if( $wall_post[0]->getPost_update_type() == self::POST_UPDATE_TYPE_WISH )
    		{
    			$wish_obj = \Extended\wishes::getWishByWallpostId( $wall_post[0]->getId() );
    			if( $wish_obj )
    			{
    				$return_r["data"]["wallpost"][$key]['wish']['wish_id'] = $wish_obj->getId();
    				$return_r["data"]["wallpost"][$key]['wish']['underlying_text'] = $wish_obj->getUnderlying_text();
    				$return_r["data"]["wallpost"][$key]['wish']['wish_type'] = \Extended\wishes::getDiscriminatorValue( $wish_obj );
    				if( $return_r["data"]["wallpost"][$key]['wish']['wish_type'] == 1 )//Means wish type new link.
    				{
    					try {$em->getFilters()->disable('soft-deleteable');} catch (\Exception $e) {}
    					$link_ilook_user_obj = $em->find('\Entities\ilook_user', $wish_obj->getLink_ilook_user_id());
    					$return_r["data"]["wallpost"][$key]['wish']['link_ilook_user_id'] = $wish_obj->getLink_ilook_user_id();
    					$return_r["data"]["wallpost"][$key]['wish']['link_ilook_user_name'] = $link_ilook_user_obj->getFirstname()." ".$link_ilook_user_obj->getLastname();
    					$return_r["data"]["wallpost"][$key]['wish']['link_ilook_user_medium_photo'] = \Helper_common::getUserProfessionalPhoto( $wish_obj->getLink_ilook_user_id(), 2 );
    					$return_r["data"]["wallpost"][$key]['wish']['link_ilook_user_professional_info'] = implode( ", ", array_filter(\Helper_common::getUserProfessionalInfo( $wish_obj->getLink_ilook_user_id() ) ));
    				}
    			}
    		}
    			
    		//WALLPOST COMMENTS INFO
    			
    		$ii = 1;
    		$counter = 0;
    		foreach ( array_reverse( $wall_post[0]->getWall_postsComment()->toArray() ) as $keyy=>$comment )
    		{
    			$counter++;
    			//Checking that, is comment hidden on this user's wall?
    			if( ! \Extended\users_comments_visibility::IsCommentHiddenOnUserWall($comment->getId(), $userId) )
    			{
    				
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['id'] = $comment->getId();
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['text'] = $comment->getComment_text();
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['created_at'] = \Helper_common::nicetime($comment->getcreated_at()->format( "Y-m-d H:i:s" ));
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['user_id'] = $comment->getCommentsIlook_user()->getId();
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['user_name'] = $comment->getCommentsIlook_user()->getFirstname()." ".$comment->getCommentsIlook_user()->getLastname();
    					
    				//Check if the commenter user exist in $blocked_user_ids_arr i.e if i have blocked him or he has blocked me?
    				if($blocked_user_ids_arr)
    				{
    					$comment_user_photo_detail = \Extended\comments::getUsersPhotoForComment($comment->getCommentsIlook_user()->getId(), $blocked_user_ids_arr);
    				}
    				
    				else
    				{
    					$comment_user_photo_detail['photo_path'] = \Helper_common::getUserProfessionalPhoto($comment->getCommentsIlook_user()->getId(), 3);
    					$comment_user_photo_detail['is_photo_clickable'] = true;
    				}
    				//End of code to check if the commenter user exist in $blocked_user_ids_arr i.e if i have blocked him or he has blocked me?
    					
    				//Check if commenter user account is closed then make his/her prof_image unclickable.
    				if( $comment->getCommentsIlook_user()->getAccount_closed_on() != null )
    				{
    					$comment_user_photo_detail['photo_path'] = \Helper_common::getUserProfessionalPhoto($comment->getCommentsIlook_user()->getId(), 3);
    					$comment_user_photo_detail['is_photo_clickable'] = false;
    				}
    				//End - Check if commenter user account is closed then make his/her prof_image unclickable. 
    					
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['user_prof_image_path'] = $comment_user_photo_detail['photo_path'];
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['is_user_image_clickable'] = $comment_user_photo_detail['is_photo_clickable'];
    					
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['user_prof_image_medium_path'] = \Helper_common::getUserProfessionalPhoto($comment->getCommentsIlook_user()->getId(), 2);
    				if( $comment->getCommentsIlook_user()->getId() == $userId ):	
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['is_my_comment'] = 1;
    				else:
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['is_my_comment'] = 0;
    				endif;
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['is_hidden'] = 0;
    					
    				$ii--;
    					
    				if( $counter == 2 ):
    				break;
    				endif;
    			}
    			
    			else
    			{
    					
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['id'] = $comment->getId();
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['text'] = $comment->getComment_text();
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['created_at'] = \Helper_common::nicetime($comment->getcreated_at()->format( "Y-m-d H:i:s" ));
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['user_id'] = $comment->getCommentsIlook_user()->getId();
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['user_name'] = $comment->getCommentsIlook_user()->getFirstname()." ".$comment->getCommentsIlook_user()->getLastname();
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['user_prof_image_path'] = \Helper_common::getUserProfessionalPhoto($comment->getCommentsIlook_user()->getId(), 3);
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['user_prof_image_medium_path'] = \Helper_common::getUserProfessionalPhoto($comment->getCommentsIlook_user()->getId(), 2);
// 					$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['user_social_image_path'] = \Helper_common::getUserSocializePhoto($comment->getCommentsIlook_user()->getId(), 3);
    				if( $comment->getCommentsIlook_user()->getId() == $userId ):
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['is_my_comment'] = 1;
    				else:
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['is_my_comment'] = 0;
    				endif;
    				$return_r["data"]["wallpost"][$key]['wallpost_comments'][$ii]['is_hidden'] = 1;
    						
    				$ii--;
    						
    				if( $counter == 2 ):
    				break;
    				endif;
    			}		
    		}
    	}
    	
	    $return_r["is_there_more_recs"] = 0;
	    if( $q_2 )
	    {
	    	$return_r["is_there_more_recs"] = 1;
	    }
	    $em->getFilters()->enable('soft-deleteable');
	  
		return $return_r;
				
	}*/
		
	
	
	/**
	 * Increaments wall post like count.
	 * 
	 * @param integer $wallpost_id
	 * @return identity or false
	 * @author jsingh7
	 * @version 1.0
	 */
	public static function likeCountIncreament( $wallpost_id )
	{
		$em = \Zend_Registry::get('em');
		$obj = self::getRowObject( $wallpost_id );
		
		if( $obj->getLike_count() ):
		$obj->setLike_count( $obj->getLike_count() + 1 );
		else:
		$obj->setLike_count( 1 );
		endif;
		
		$obj->setLast_activity_datetime( new \DateTime() );
		
		$em -> persist( $obj );
		$em -> flush();
		$em->getConnection()->close();
		return $obj->getId();
	}
	
	/**
	 * Decreaments wall post like count.
	 * 
	 * @param integer $wallpost_id
	 * @return identity or false
	 * @author jsingh7
	 * @version 1.0
	 */
	public static function likeCountDecreament( $wallpost_id )
	{
		$em = \Zend_Registry::get('em');
		$obj = self::getRowObject( $wallpost_id );
		
		if( $obj->getLike_count() ):
		$obj->setLike_count( $obj->getLike_count() - 1 );
		endif;
		$em -> persist( $obj );
		$em -> flush();
		$em->getConnection()->close();
		return $obj->getId();
	}
	
	/**
	 * Increaments wall post comment count.
	 *
	 * @param integer $wallpost_id
	 * @return count or false
	 * @author jsingh7
	 * @version 1.0
	 */
	public static function commentCountIncreament( $wallpost_id )
	{
		$em = \Zend_Registry::get('em');
		$obj = self::getRowObject( $wallpost_id );
		if( $obj )
		{	
			if( $obj->getComment_count() ):
			$obj->setComment_count( $obj->getComment_count() + 1 );
			else:
			$obj->setComment_count( 1 );
			endif;
			
			$obj->setLast_activity_datetime( new \DateTime() );
			
			$em -> persist( $obj );
			$em -> flush();
			$em->getConnection()->close();
			if(  $obj->getComment_count() )
			{	
				return $obj->getComment_count();
			}
			else
			{
				return false;
			}
		}	
	}
	
	/**
	 * update last activity datetime of wallpost.
	 *
	 * @param integer $wallpost_id
	 * @return last activity date time or false
	 * @author hkaur5
	 * @version 1.0
	 */
	public static function updateLastActivityDateTime( $wallpost_id )
	{
		$em = \Zend_Registry::get('em');
		$obj = self::getRowObject( $wallpost_id );
		if( $obj )
		{	
			$obj->setLast_activity_datetime( new \DateTime() );
			
			$em -> persist( $obj );
			$em -> flush();
			$em->getConnection()->close();
			if(  $obj->getLast_activity_datetime() )
			{	
				return $obj->getLast_activity_datetime();
			}
			else
			{
				return false;
			}
		}	
	}
	
	/**
	 * Decreaments wall post comment count.
	 *
	 * @param integer $wallpost_id
	 * @return true or false
	 * @author jsingh7
	 * @version 1.0
	 */
	public static function commentCountDecreament( $wallpost_id )
	{
		$em = \Zend_Registry::get('em');
		$obj = self::getRowObject( $wallpost_id );
		if( $obj )
		{	
			if( $obj->getComment_count() ):
			$obj->setComment_count( $obj->getComment_count() - 1 );
			else:
			endif;
			$em -> persist( $obj );
			$em -> flush();
			$em->getConnection()->close();
			if(  $obj->getId() )
			{	
				return true;
			}
			else
			{
				return false;
			}
		}	
	}
	
	/**
	 * checks that did user liked paticular
	 * wall post or not.
	 * 
	 * @param integer $user_id
	 * @param integer $wallpost_id
	 * @return boolean
	 * @version 1.0
	 * @author jsingh7
	 */
	public static function didUserLikedWallpost( $user_id, $wallpost_id )
	{
		$em = \Zend_Registry::get('em');
		$likesObj = $em->getRepository('\Entities\likes')->findBy(array('likesLiked_by' => $user_id, 'likesWall_post' => $wallpost_id));
		$em->getConnection()->close();
		if($likesObj):
		return 1;
		else:
		return 0;
		endif;
	}
	
	/**
	 * checks that did user liked paticular
	 * socialize album or not.
	 *
	 * @param integer $user_id
	 * @param integer $album_id
	 * @return boolean
	 * @version 1.0
	 * @author ssharma4
	 */
	public static function didUserLikedalbum( $user_id, $album_id )
	{
		$em = \Zend_Registry::get('em');
		$likesObj = $em->getRepository('\Entities\likes')->findBy(array('likesLiked_by' => $user_id, 'likesSocialise_album' => $album_id));
		$em->getConnection()->close();
		if($likesObj):
		return 1;
		else:
		return 0;
		endif;
	}
	
	/**
	 * get wallpost info
	 *
	 * @param integer $wallpost_id
	 * @return array
	 * @version 1.1
	 * @author jsingh7
	 * @author sjaiswal
	 */
	public static function getWallpostInfo( $wallpost_id )
	{
		$em = \Zend_Registry::get('em');
		$em->getFilters()->disable('soft-deleteable');
		$qb_1 = $em->createQueryBuilder();
		
		$wall_post_obj = \Extended\wall_post::getRowObject( $wallpost_id );
		if( $wall_post_obj->getPost_update_type() == \Extended\wall_post::POST_UPDATE_TYPE_ALBUM)
		{
			$q_1 = $qb_1->select( 'wp, fromUsr, sp' )
			->from( '\Entities\wall_post', 'wp' )
			->LeftJoin( 'wp.wall_postsFrom_user', 'fromUsr' )
			->LeftJoin( 'wp.socialisePhoto', 'sp' )
			->where( 'wp.id = ?1' )
			->setParameter( 1, $wallpost_id );
		}
		else if($wall_post_obj->getPost_update_type() == \Extended\wall_post:: POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM ||
			$wall_post_obj->getPost_update_type() == \Extended\wall_post:: POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING)
		{
			$q_1 = $qb_1->select( 'wp, fromUsr, photo_group, sp, wall_album' )
			->from( '\Entities\wall_post', 'wp' )
			->LeftJoin( 'wp.wall_postsFrom_user', 'fromUsr' )
			->LeftJoin( 'wp.photoGroup', 'photo_group' )
			->LeftJoin( 'photo_group.socialisePhoto', 'sp' )
			->LeftJoin( 'sp.socialise_photosSocialise_album', 'wall_album' )
			->where( 'wp.id = ?1' )
			->setParameter( 1, $wallpost_id );
		}
		else
		{

			$q_1 = $qb_1->select( 'wp,fromUsr' )
				->from( '\Entities\wall_post', 'wp' )
				->LeftJoin( 'wp.wall_postsFrom_user', 'fromUsr' )
				->where( 'wp.id = ?1' )
				->setParameter( 1, $wallpost_id );
		}

		$q_1_collec = $q_1->getQuery()->getResult ();

		if( $q_1_collec )
		{
			$return_r = array();
			$return_r['wallpost_id'] = $q_1_collec[0]->getId();
			$return_r['wallpost_wall_type'] = $q_1_collec[0]->getWall_type();
			$return_r["wallpost_user_id"] = $q_1_collec[0]->getWall_postsFrom_user()->getId();
			$return_r["wallpost_created_at"] = \Helper_common::nicetime( $q_1_collec[0]->getCreated_at()->format("Y-m-d H:i:s") );
			$return_r["wallpost_text"] =  $q_1_collec[0]->getWall_post_text();
			/*  same as above? =>  */$return_r["wallpost_user_text"] =  $q_1_collec[0]->getWall_post_text();
			if($q_1_collec[0]->getShared_from_wallpost())
			{
				$return_r["wallpost_user_text_old"] = $q_1_collec[0]->getShared_from_wallpost()->getWall_post_text();
			}
			else 
			{
				$return_r["wallpost_user_text_old"] = $q_1_collec[0]->getWall_post_text_when_shared();
			}
			$return_r["post_update_type"] =  $q_1_collec[0]->getPost_Update_Type();
			$return_r["original_user_id"] =  $q_1_collec[0]->getWall_postsOriginal_user()->getId();
			$return_r["original_user_type"] =  $q_1_collec[0]->getWall_postsOriginal_user()->getUser_type();
			$return_r["original_post_update_type_text"] = \Helper_common::getTxtAccordingToPostUpdateType($q_1_collec[0]->getPost_Update_Type());
			$return_r["original_user_gender"] =  $q_1_collec[0]->getWall_postsOriginal_user()->getGender();
			$return_r["original_user_profile_photo_small"] =  \Helper_common::getUserProfessionalPhoto($q_1_collec[0]->getWall_postsOriginal_user()->getId(), 3);
			$return_r["original_user_profile_photo_medium"] =  \Helper_common::getUserProfessionalPhoto($q_1_collec[0]->getWall_postsOriginal_user()->getId(), 2);
			$return_r["original_user_full_name"] =  $q_1_collec[0]->getWall_postsOriginal_user()->getFirstname().' '
													.$q_1_collec[0]->getWall_postsOriginal_user()->getLastname();
		 	// cases for post update type
			switch( $q_1_collec[0]->getPost_Update_Type() )
			{
				case \Extended\wall_post::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM:
				case \Extended\wall_post::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING:

					//Get path of images for small collage inside share popup.
					$image_counter = 0;
					
					foreach ( $q_1_collec[0]->getPhotoGroup()->getSocialisePhoto() as $key=>$photo )
					{
						$return_r["collage"][$key]['image_path'] = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_default/wall_thumbnails/thumbnail_".$photo->getImage_name();
						$return_r["collage"][$key]['gallery_image_path'] = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_default/gallery_thumbnails/thumbnail_".$photo->getImage_name();
						$return_r["collage"][$key]['original_image_path'] = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_default/original_photos/".$photo->getImage_name();
						$return_r["collage"][$key]['popup_image_path'] = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_default/popup_thumbnails/thumbnail_".$photo->getImage_name();
						$return_r["collage"][$key]['image_posted_by'] = $photo->getSocialise_photosPosted_by()->getId();
						$return_r["collage"][$key]['image_name'] = $photo->getImage_name();
						$image_counter++;
						if( $image_counter == 5 ):
						break;
						endif;
					}
					
     	 			break;
				break;
					
				case \Extended\wall_post::POST_UPDATE_TYPE_ALBUM:
				$image_counter = 0;
				$album_name = $q_1_collec[0]->getWall_postsSocialise_album()->getAlbum_name();
				$album_timestamp = $q_1_collec[0]->getWall_postsSocialise_album()->getCreated_at_timestamp()->getTimestamp();
				foreach ( $q_1_collec[0]->getWall_postsSocialise_album()->getSocialise_albumsSocialise_photo() as $key=>$photo )
				{
					$return_r["collage"][$key]['image_path'] = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_".$album_name."_".$album_timestamp."/wall_thumbnails/thumbnail_".$photo->getImage_name();
					$return_r["collage"][$key]['gallery_image_path'] = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_".$album_name."_".$album_timestamp."/gallery_thumbnails/thumbnail_".$photo->getImage_name();
					$return_r["collage"][$key]['original_image_path'] = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_".$album_name."_".$album_timestamp."/original_photos/".$photo->getImage_name();
					$return_r["collage"][$key]['popup_image_path'] = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_".$album_name."_".$album_timestamp."/popup_thumbnails/thumbnail_".$photo->getImage_name();
					$return_r["collage"][$key]['image_posted_by'] = $photo->getSocialise_photosPosted_by()->getId();
					$return_r["collage"][$key]['image_name'] = $photo->getImage_name();
					
					$image_counter++;
					if( $image_counter == 5 ):
					break;
					endif;
				}
				break;

				case \Extended\wall_post::POST_UPDATE_TYPE_PROFILE_PHOTO_CHANGED:

					$profile_pic_name = $q_1_collec[0]->getSocialisePhoto()->getImage_name();
					$photo_posted_by_user_id = $q_1_collec[0]->getSocialisePhoto()->getSocialise_photosPosted_by()->getId();
					$album_name = $q_1_collec[0]->getWall_postsSocialise_album()->getAlbum_name();
					
						$return_r["collage"][0]['image_path'] = IMAGE_PATH."/albums/user_".$photo_posted_by_user_id."/album_".$album_name."/wall_thumbnails/thumbnail_".$profile_pic_name;
						$return_r["collage"][0]['gallery_image_path'] = IMAGE_PATH."/albums/user_".$photo_posted_by_user_id."/album_".$album_name."/gallery_thumbnails/thumbnail_".$profile_pic_name;
						$return_r["collage"][0]['original_image_path'] = IMAGE_PATH."/albums/user_".$photo_posted_by_user_id."/album_".$album_name."/original_photos/".$profile_pic_name;
						$return_r["collage"][0]['popup_image_path'] = IMAGE_PATH."/albums/user_".$photo_posted_by_user_id."/album_".$album_name."/popup_thumbnails/thumbnail_".$profile_pic_name;
						$return_r["collage"][0]['image_name'] = $profile_pic_name;
				
				
				break;
				
				case self::POST_UPDATE_TYPE_LINK:
				case self::POST_UPDATE_TYPE_SHARED_LINK:
					$return_r["url_data"] = \Zend_Json::decode( $q_1_collec[0]->getLink_data() );
					
				break;
				
				case self::POST_UPDATE_TYPE_PROFILE_LINK:
				case self::POST_UPDATE_TYPE_SHARED_PROFILE_LINK:
					$link_data  = \Zend_Json::decode( $q_1_collec[0]->getLink_data() );
					$shared_profile_user_obj = \Extended\ilook_user::getRowObject( $link_data['shared_profile_user_id'] );
					$return_r["url_data"]['url_title'] = $shared_profile_user_obj->getFirstname()." ".$shared_profile_user_obj->getLastname();
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
				break;
				
			}
			
			$size = @getimagesize( $return_r["collage"][0]['image_path'] );

			$aspect = 1;
	        if( $size )
	        {
		        $width = $size[0];
		        $height = $size[1];
		        $aspect = $height / $width;
	        }
	        if ($aspect >= 1)
	        {
	            //vertical
	           $return_r['first_img_portrait_or_landscape'] = 1;
	        }
	        else
	        {
	            //horizontal
	            $return_r['first_img_portrait_or_landscape'] = 2;
	        }
					
			$em->getFilters()->enable('soft-deleteable');
			return $return_r;
		}
		else
		{
			$em->getFilters()->enable('soft-deleteable');
			return false;
		}	
	}
	/**
	 * Increments wall post Share count.
	 *
	 * @param integer $wallpost_id
	 * @return identity or false
	 * @author jsingh7
	 * @version 1.0
	 */
	public static function shareCountIncreament( $wallpost_id )
	{
		$em = \Zend_Registry::get('em');
		$obj = self::getRowObject( $wallpost_id );
		
		if( $obj->getShare_count() ):
		$obj->setShare_count( $obj->getShare_count() + 1 );
		else:
		$obj->setShare_count( 1 );
		endif;
		
		$obj->setLast_activity_datetime( new \DateTime() );
		
		$em -> persist( $obj );
		$em -> flush();
		$em->getConnection()->close();
		return $obj->getId();
	}
	
	
	/**
	 * <Depreciated>
	 * 
	 * Checks that, does specific user have posted the photo
	 * on his wall or not.
	 * 
	 * @param integer $photo_id
	 * @param integer $user_id
	 * @return wall_post_id or false
	 * 
	 * @author jsingh7, nsingh3
	 * @version 1.0
	 */
	public static function checkWallpostByPhotoNUser( $photo_id, $user_id )
	{
		$em = \Zend_Registry::get('em');
		$wall_post_obj = $em->getRepository('\Entities\wall_post')
					->findBy( array('wall_postsTo_user' => $user_id, 'wall_postsFrom_user' => $user_id, 'socialisePhoto' => $photo_id ));
		
		foreach ($wall_post_obj as $wall_post)
		{
			
			if($wall_post)
			{
				return $wall_post->getId();
			}
			else
			{
				return false;
			}
		}
	}
	
	/**
	 * Checks that does specific wish has wallpost.
	 *
	 * @param integer $wish_id
	 * @return wall_post_id or false
	 *
	 * @author jsingh7, nsingh3
	 * @version 1.0
	 */
	public static function checkWallpostByWish( $wish_id )
	{
		$wish_obj = \Extended\wishes::getRowObject( $wish_id );
		if( $wish_obj->getWallPost() )
		{	
			if( $wish_obj->getWallPost()->getId() )
			{
				return $wish_obj->getWallPost()->getId();
			}
			else
			{
				return FALSE;
			}
		}
		else
		{
			return FALSE;
		}	
	}
	

	/**
	 * function used to get list of wallID's on the basis of photo id
	 * @param $photoID
	 * @return array
	 * @author Sunny Patial.
	 */
	public static function getWallPostOnTheBasisOfId($photoID){
		
		$em = \Zend_Registry::get('em');
		$result=$em->createQueryBuilder()->select('wall.id')
		->from('\Entities\wall_post', 'wall')
		->where('wall.wall_postsSocialise_photo = :id')
		->setParameter('id', $photoID)
		->getQuery()
		->getResult();
		return $result;
	}
	
	/**
	 * Changes the wallpost privacy(Visibility_criteria)
	 * 
	 * @param intger $wallpost_id
	 * @param integer $privacy
	 * @author jsingh7
	 */
	public static function changeWallpostPrivacy( $wallpost_id, $privacy )
	{
		$em = \Zend_Registry::get('em');
		$wallpost_obj = self::getRowObject($wallpost_id);
		$wallpost_obj -> setVisibility_criteria( $privacy );
		$em -> persist( $wallpost_obj );
		$em -> flush();
		$em->getConnection()->close();
		
		$ret_r = array();
		$ret_r['wallpost_id'] = $wallpost_obj -> getId();
		$ret_r['privacy'] = $wallpost_obj -> getVisibility_criteria();
		
		return $ret_r;
	}
	
	/**
	 * This function has been made for deleting
	 * that wallposts which does not have any relation
	 * to other tables such as socialise_photo etc.
	 * 
	 * Note : For deleting wallpost associated with
	 * photo use  \Extended\socialise_photo::deletePhoto( $photo_id, $user_id )
	 * 
	 * @author jsingh7,sjaiswal
	 * @param integer $wallpost_id
	 * @return boolean
	 * version 1.1
	 */
	public static function deleteWallpost( $wallpost_id )
	{
		try
		{
			$em = \Zend_Registry::get('em');
			
			$all_comments_on_wallpost_r = array();
			$hidden_records_for_all_comments_on_wallpost_r = array();
			$all_likes_on_wallpost_r = array();
			
			$wallpost_obj = self::getRowObject( $wallpost_id );
			
			//Getting all comments on a wallpost.
			//-----------------------------------------------------
			if( $wallpost_id )
			{
				$qb_1 = $em->createQueryBuilder();
				$q_1 = $qb_1->select( 'comm' )
				->from( '\Entities\comments', 'comm' )
				->where( 'comm.commentsWall_post = ?1' )
				->setParameter( '1', $wallpost_id );
				$all_comments_on_wallpost = $q_1->getQuery()->getResult();
			
				foreach ( $all_comments_on_wallpost as $comment_on_wallpost )
				{
					$all_comments_on_wallpost_r[] = $comment_on_wallpost->getId();
				}
			}
			
			//Getting records of hidden comments on wallpost.
			//-----------------------------------------------------
			if( $all_comments_on_wallpost_r )
			{
				$qb_1 = $em->createQueryBuilder();
				$q_1 = $qb_1->select('ucv')
				->from( '\Entities\users_comments_visibility', 'ucv' )
				->where( 'ucv.comments IN (:comment_ids)' )
				->setParameter('comment_ids', $all_comments_on_wallpost_r );
				$hidden_records_for_all_comments_on_wallpost = $q_1->getQuery()->getResult();
				foreach ( $hidden_records_for_all_comments_on_wallpost as $hidden_record_for_all_comments_on_wallpost )
				{
					$hidden_records_for_all_comments_on_wallpost_r[] = $hidden_record_for_all_comments_on_wallpost->getId();
				}
			}
			
			//Getting all likes on wallpost.
			//-----------------------------------------------------
			if( $wallpost_id )
			{
				$qb_1 = $em->createQueryBuilder();
				$q_1 = $qb_1->select('lk')
				->from( '\Entities\likes', 'lk' )
				->where( 'lk.likesWall_post = ?1' )
				->setParameter('1', $wallpost_id );
				$all_likes_on_wallpost = $q_1->getQuery()->getResult();
					
				foreach ( $all_likes_on_wallpost as $like_on_wallpost )
				{
					$all_likes_on_wallpost_r[] = $like_on_wallpost->getId();
				}
			}
			
			//Deleting records for comments, which hide them[deleting records from users_comments_visibility table].
			if( $hidden_records_for_all_comments_on_wallpost_r )
			{
				$qb_1 = $em->createQueryBuilder();
				$qb_1->delete('\Entities\users_comments_visibility', 'ucv3');
				$qb_1->where( 'ucv3.id IN (:hidden_comments_ids)' );
				$qb_1->setParameter(':hidden_comments_ids', $hidden_records_for_all_comments_on_wallpost_r);
				$qb_1->getQuery()->execute();
			}
			
			//Deleting all comments, wether on wallpost.
			if( $all_comments_on_wallpost_r )
			{
				$qb_1 = $em->createQueryBuilder();
				$qb_1->delete('\Entities\comments', 'comm');
				$qb_1->where( 'comm.id IN (:comments_ids)' );
				$qb_1->setParameter(':comments_ids', $all_comments_on_wallpost_r);
				$qb_1->getQuery()->execute();
			}
			
			//Deleting all likes, wether on wallpost.
			if( $all_likes_on_wallpost_r )
			{
				$qb_1 = $em->createQueryBuilder();
				$qb_1->delete('\Entities\likes', 'lks');
				$qb_1->where( 'lks.id IN (:likes_ids)' );
				$qb_1->setParameter(':likes_ids', $all_likes_on_wallpost_r);
				$qb_1->getQuery()->execute();
			}
			
			//Removing records from share table for wallpost.
			if( $wallpost_id )
			{
				$qb_1 = $em->createQueryBuilder();
				$qb_1->delete('\Entities\share', 'shr');
				$qb_1->where( 'shr.sharesWall_post  = ?1' );
				$qb_1->setParameter('1', $wallpost_id );
				$qb_1->getQuery()->execute();
			}

			// Cascade remove will work if we use remove($obj).
			$em->remove($wallpost_obj);
			$em->flush();
			

			
			return 1;
			
		}
		catch (\Exception $e)
		{
			return 0;
		}
	}
	
	
	/**
	 * Updates wallpost text.
	 *
	 * @param intger $wallpost_id
	 * @param integer $wallpost_text
	 * @return array ( wallpost_id=>identity, wallpost_text=>updated text )
	 * @author jsingh7
	 * @author hkaur5 (admin activity)
	 */
	public static function updateWallpostText( $wallpost_id, $wallpost_text )
	{
		$em = \Zend_Registry::get('em');
		$wallpost_obj = self::getRowObject( $wallpost_id );
		$wallpost_obj -> setWall_post_text( \Helper_common::makeHyperlinkClickable( $wallpost_text, 1 ) );
		$em -> persist( $wallpost_obj );
		$em -> flush();
	
		$ret_r = array();
		$ret_r['wallpost_id'] = $wallpost_obj -> getId();
		$ret_r['wallpost_text'] = $wallpost_obj -> getWall_post_text();
		
		// Record admin activity log for post on wall(dasboard and socialise)
		if(\Zend_Registry::get('admin_logged_in_as_user'))
		{
			if(!empty($ret_r))
			{
				if($wallpost_obj->getWall_type() == 1)
				{
					\Extended\admin_activity_log::addAdminActivityLog(\Zend_Registry::get('admin_logged_in_as_user'), \Auth_UserAdapter::getIdentity()->getId(), \Extended\admin_activity_log::MODULE_DASHBOARD);
				}
				else if ($wallpost_obj->getWall_type() == 2)
				{
					\Extended\admin_activity_log::addAdminActivityLog(\Zend_Registry::get('admin_logged_in_as_user'), \Auth_UserAdapter::getIdentity()->getId(), \Extended\admin_activity_log::MODULE_DISPLAY);
				}
					
			}
		}
		return $ret_r;
	}
	
	/**
	 * Returns the photos with some data
	 * for photo slider which used to scroll images on display wall.
	 * 
	 * @param integer $userId
	 * @param integer $wallpost_id
	 * @param integer $userId
	
	 * @return collection array
	 * @author ssharma4
	 * @author jsingh7
	 */

	public function loadImagesForSlider( $user_id, $wallpost_id=null,$album_id=null, $last_photo_id, $limit_for_photos )
	{
		
		$em = \Zend_Registry::get('em');
		// In this section need to find album id by wall post id
		if($wallpost_id)
		{
			//Check that whether the wallpost is of type album or just group in default album.
			$wallpost_obj = self::getRowObject( $wallpost_id );
			
			//Getting album ID corresponding to wallpost.
			switch ( $wallpost_obj->getPost_update_type() ) {
					
				case self::POST_UPDATE_TYPE_ALBUM:
				case self::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM:
				case self::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING:
				case self::POST_UPDATE_TYPE_PROFILE_PHOTO_CHANGED:
					$album_id = $wallpost_obj->getWall_postsSocialise_album()->getId();
					break;
			
				default:
					return false;
					break;
			}
		}
		
		
		$album_obj = \Extended\socialise_album::getRowObject($album_id);
		
		$album = $em->createQueryBuilder();
		
		$album = $album->select('sp')
				->from( '\Entities\socialise_photo', 'sp' )
				->leftJoin( 'sp.socialise_photosSocialise_album','sa')
				->where('sa.id = ?1')
				->andWhere('sp.id > ?2')
				->setParameter( 1, $album_id)
				->setParameter( 2, $last_photo_id)
				->setMaxResults( $limit_for_photos )
				->orderBy( 'sa.id', 'ASC' )
				->getQuery()
				->getResult();
		$return_r =array();
		if($album){
			$last_photo = end($album);
			$last_photo_id = $last_photo->getId();
			
			
			
			if($wallpost_id){
				foreach ( $album as $keyy => $photo )
				{
					if( strtolower($album_obj->getAlbum_name()) == strtolower(\Extended\socialise_album::DEFAULT_ALBUM_NAME)
							||strtolower($album_obj->getAlbum_name()) == strtolower(\Extended\socialise_album::COVER_PHOTOS_ALBUM_NAME)
							||strtolower($album_obj->getAlbum_name()) == strtolower(\Extended\socialise_album::PROFILE_PHOTOS_ALBUM_NAME)
					)
					{
						$image_path = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_default/wall_thumbnails/thumbnail_".$photo->getImage_name();
				
					}else
					{
						$album_name = $album_obj->getAlbum_name();
						$album_timestamp = $album_obj->getCreated_at_timestamp()->getTimestamp();
							
						$image_path = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_".$album_name."_".$album_timestamp."/wall_thumbnails/thumbnail_".$photo->getImage_name();
					}
				
				
					$return_r['collage'][$keyy]['realPhoto'] = $image_path;
					$return_r['collage'][$keyy]['photoID'] = $photo->getId();
					if($photo->getDescription())
					{
						$return_r['collage'][$keyy]['image_desc'] = $photo->getDescription();
					}
					else
					{
						$return_r['collage'][$keyy]['image_desc'] = "";
					}
					$return_r['collage'][$keyy]['no_of_comments'] = $photo->getComment_count();
					$return_r['collage'][$keyy]['no_of_oks'] = $photo->getLike_count();
					$return_r['collage'][$keyy]['no_of_shares'] = $photo->getShare_count();
					$return_r['collage'][$keyy]['am_I_ok_this_photo'] = self::didUserLikedalbum($user_id,$album_id);
						
						
					if ($photo->getComment_count() === null){
						$return_r['collage'][$keyy]['no_of_comments'] = 0;
					}
					if ($photo->getLike_count() === null){
						$return_r['collage'][$keyy]['no_of_oks'] = 0;
					}
					if ($photo->getShare_count() === null){
						$return_r['collage'][$keyy]['no_of_shares'] = 0;
					}
						
				}
			}else{
				foreach ( $album as $keyy => $photo )
				{
					if( strtolower($album_obj->getAlbum_name()) == strtolower(\Extended\socialise_album::DEFAULT_ALBUM_NAME)
							||strtolower($album_obj->getAlbum_name()) == strtolower(\Extended\socialise_album::COVER_PHOTOS_ALBUM_NAME)
							||strtolower($album_obj->getAlbum_name()) == strtolower(\Extended\socialise_album::PROFILE_PHOTOS_ALBUM_NAME)
					)
					{
						$image_path = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_default/wall_thumbnails/thumbnail_".$photo->getImage_name();
				
					}else
					{
						$album_name = $album_obj->getAlbum_name();
						$album_timestamp = $album_obj->getCreated_at_timestamp()->getTimestamp();
							
						$image_path = IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_".$album_name."_".$album_timestamp."/wall_thumbnails/thumbnail_".$photo->getImage_name();
					}
				
				
					$return_r['imagesListing'][$keyy]['realPhoto'] = $image_path;
					$return_r['imagesListing'][$keyy]['photoID'] = $photo->getId();
					
					if($photo->getDescription())
					{
						$return_r['imagesListing'][$keyy]['image_desc'] = $photo->getDescription();
					}
					else
						
					{
						$return_r['imagesListing'][$keyy]['image_desc'] = "";
					}
					$return_r['imagesListing'][$keyy]['no_of_comments'] = $photo->getComment_count();
					$return_r['imagesListing'][$keyy]['no_of_oks'] = $photo->getLike_count();
					$return_r['imagesListing'][$keyy]['no_of_shares'] = $photo->getShare_count();
					$return_r['imagesListing'][$keyy]['am_I_ok_this_photo'] = self::didUserLikedalbum($user_id,$album_id);
				
				
					if ($photo->getComment_count() === null){
						$return_r['imagesListing'][$keyy]['no_of_comments'] = 0;
					}
					if ($photo->getLike_count() === null){
						$return_r['imagesListing'][$keyy]['no_of_oks'] = 0;
					}
					if ($photo->getShare_count() === null){
						$return_r['imagesListing'][$keyy]['no_of_shares'] = 0;
					}
				
				}
			}
			$return_r['last_photo_id'] = $last_photo_id;
		
			return $return_r;
		}else{
			return false;
		}
		
		
	}
	
	/**
	 * Fetch usesrs who has shared this post($post_obj) i.e records where shared_from_wallpost is same as 
	 * given wallpost_obj
	 * @param object/integer $post_obj
	 * @param string $link_list(optional) if only links are required.
	 * @return array users
	 */
	public static function getUsersWhoSharedThisPost($post_obj, $link_list = null)
	{
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select('IDENTITY(wp.wall_postsFrom_user) as user_id')
		->from('\Entities\wall_post', 'wp');
		$q_1->where( 'wp.shared_from_wallpost =?1' );
		if($link_list)
		{
			$q_1->leftJoin( "wp.wall_postsFrom_user","ilook_user" )
			->andWhere( 'ilook_user.id IN ('.$link_list.')' );
		}
		$q_1->groupby( 'wp.wall_postsFrom_user' );
		$q_1->setParameter( 1, $post_obj );
		$q_1 = $q_1->getQuery()->getResult();
// 		$q_1 = $q_1->getQuery()->getSQL();
// 		echo  $q_1;
// 		die;
// 		\Zend_Debug::dump($q_1);
// 		die;
		return ($q_1);
	}
	
	
	/**
	 * Get object of all wallposts which are shared from this post i.e
	 * where shared_from_wallpost is same as given wallpost_id
	 * @param integer $wallpost_id
	 * @return Object
	 */
	public static function getAllPostsSharedFromThisPost($wallpost_id)
	{
		$em = \Zend_Registry::get('em');
		 
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select('wp')
		->from( '\Entities\wall_post', 'wp' )
		->where( 'wp.shared_from_wallpost = ?1' )
		->setParameter( '1', $wallpost_id );
		$q_1 = $q_1->getQuery();
		$ret = $q_1->getResult();
		return $ret;
	}
	
	/**
	 * Get all the wallposts where user has commented.
	 * Also if post_update_type is provided then only those type of posts will be
	 * checked.
	 * @param integer $user_id
	 * @param integer $post_update_type
	 * @author hkaur5
	 */
	public static function getAllwallpostsWhereUserCommented($user_id, $post_update_type)
	{
		$em = \Zend_Registry::get('em');
			
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select('wp')
		->from( '\Entities\wall_post', 'wp' )
		->leftJoin('wp.wall_postsComment','cmnts')
		
		->where('cmnts.commentsIlook_user = ?1');
		if($post_update_type)
		{
			$q_1->andWhere('wp.post_update_type = ?2');
		}
		$q_1->setParameter( '1', $user_id );
		$q_1->setParameter( '2', $post_update_type );
		$q_1 = $q_1->getQuery();
		$ret = $q_1->getResult();
		return $ret;
	}
	
}
