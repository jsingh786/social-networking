<?php
namespace Extended;
/**
 * This class has been made for
 * general purpose functions.
 *
 * @author hkaur5
 * @version 1.0
 */
class birthday_wishes extends \Entities\birthday_wishes
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
		return $em->find('\Entities\birthday_wishes',$id);
	}
	
	/**
	 * Add wishes.
	 * @param object $ilook_user
	 * @param date $birthdate_of_user
	 * @param string $underlying_text
	 * @param integer $duration_to_display
	 * @author hkaur5
	 * @return boolean 
	 * 
	 */
	public static function addWish( $ilook_user,$underlying_text, $duration_to_display )
	{
		$em = \Zend_Registry::get('em');
		$wish_obj = new \Entities\birthday_wishes();
		$wish_obj->setilookUser($ilook_user);
		$wish_obj->setUnderlying_text($underlying_text);
		$wish_obj->setDuration_to_display($duration_to_display);
		$em->persist($wish_obj);
		$em -> flush();
		return $wish_obj->getId();
	}
	
public static function getWishesForUser( $user_id )
	{

		$user_obj = \Extended\ilook_user::getRowObject( $user_id );

		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select('wsh')
		->from('\Entities\birthday_wishes', 'wsh')
		->where('wsh INSTANCE OF \Entities\birthday_wishes');
		
		$result= $q_1->getQuery ()->getResult ( \Doctrine\ORM\Query::HYDRATE_ARRAY );
		return $result;
	}
}