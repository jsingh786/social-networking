<?php
namespace Extended;
/**
 * This class has been made for
 * general purpose functions.
 *
 * @author Shaina
 * @version 1.0
 */
class city extends \Entities\city
{
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
		$obj = $em->find('\Entities\city',$id);
		$em->getConnection()->close();
		return $obj;
	}
	/**
	 * This function has been made to
	 * get the list of states on the basis of state id
	 *
	 * @author Sunny Patial
	 * @version 1.0
	 */
	public static function getCityList($state_id)
	{
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select('c')
		->from('\Entities\city', 'c')
		->where( 'c.state = ?1' )
		->setParameter( 1, $state_id )
		->orderBy( 'c.name', 'ASC' );
		$result= $q_1->getQuery ()->getResult ( \Doctrine\ORM\Query::HYDRATE_ARRAY );
		$em->getConnection()->close();
		return $result;
	}
	
	/**
	 * This function has been made to
	 * get the list of cities on the basis of country id
	 *
	 * @author Sunny Patial
	 * @version 1.0
	 */
	public static function getCityListUnderCountry($country_id)
	{
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select('c')
		->from('\Entities\city', 'c')
		->where( 'c.countryRef = ?1' )
		->setParameter( 1, $country_id )
		->orderBy( 'c.name', 'ASC' );
		$result= $q_1->getQuery ()->getResult ( \Doctrine\ORM\Query::HYDRATE_ARRAY );
		$em->getConnection()->close();
		return $result;
	}
	
	/**
	 * Returns array collection
	 * of cities.
	 *
	 * @author jsingh7
	 * @version 1.0
	 */
	public static function getAllActiveCitiesForCountry( $country_id )
	{
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select('ct')
		->from('\Entities\city', 'ct')
		->where( 'ct.countryRef = ?1' )
		->andWhere( 'ct.status = 1' )
		->setParameter( 1, $country_id )
		->orderBy( 'ct.name', 'ASC' );;
		$result= $q_1->getQuery ()->getResult ();
		$em->getConnection()->close();
		return $result;
	}
	/**
	 * Returns array collection
	 * of states.
	 *
	 * @author jsingh7
	 * @version 1.0
	 */
	public static function getAllActiveCitiesForState( $state_id )
	{
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select('ct')
		->from('\Entities\city', 'ct')
		->where( 'ct.state = ?1' )
		->andWhere( 'ct.status = 1' )
		->setParameter( 1, $state_id )
		->orderBy( 'ct.name', 'ASC' );
		return $q_1->getQuery ()->getResult ();;
	}
	/**
	 * Returns array collection
	 * of city by matching city_name.
	 *
	 * @author hkaur5
	 * @param string $city_name
	 * @return object array
	 * @version 1.0
	 */
	public static function getCityByName( $city_name )
	{
		
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select('ct')
		->from('\Entities\city', 'ct')
		->where( "ct.name =?1" )
		->setParameter( 1,$city_name );
		$result= $q_1->getQuery ()->getResult ();
		$em->getConnection()->close();
		return $result;
	}
}