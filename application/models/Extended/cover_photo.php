<?php
namespace Extended;
/**
 * This class has been made for
 * general purpose functions.
 *
 * @author hkaur5
 * @version 1.0
 */


class cover_photo extends \Entities\cover_photo
{

	/**
	 * Pass an id and get its object
	 *
	 * @param $id
	 * @return object of that class
	 * @author hkaur5
	 */
	public static function getRowObject($id)
	{
		$em = \Zend_Registry::get('em');
		$obj = $em->find('\Entities\cover_photo',$id);
		$em->getConnection()->close();
		return $obj;
	}
	
	/**
	 *  Save user's cover photo.
	 *  @param string name
	 *  @param object user
	 *  @param integer x-position
	 *  @param integer y-position
	 */
	public static function saveUserCoverPhoto( $user_obj, $name, $x_position=0, $y_position )
	{
		$em = \Zend_Registry::get('em');
		$cover_photo_arr_obj = $em->getRepository('\Entities\cover_photo')->findBy( array('ilookUser'=>$user_obj->getId()) );
		if( count($cover_photo_arr_obj) == 0 )
		{
			$cover_photo_obj = new \Entities\cover_photo();
			$cover_photo_obj->setIlookUser($user_obj);
		}
		else 
		{
			$cover_photo_obj = $cover_photo_arr_obj[0];
		}
		$cover_photo_obj->setName($name);
		$cover_photo_obj->setX_position($x_position);
		$cover_photo_obj->setY_position($y_position);
		$em->persist($cover_photo_obj);
		$em->flush();
		return $cover_photo_obj;
	}
	
	/**
	 * Deleting user's cover photo by matching user id.
	 * @author hkaur5
	 * @param integer $user_id 
	 * 
	 */
	public static function deleteCoverPhotoByUserId($user_id)
	{
		$em = \Zend_Registry::get('em');
		
		//Deleting all previously set photo_custom_privacy records for the photos.
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->delete('\Entities\cover_photo','cp')
		->where('cp.ilookUser = ?1')
		->setParameter( 1, $user_id );
		$q_1 = $q_1->getQuery ();
		return $q_1->execute();
		
	}
}
?>