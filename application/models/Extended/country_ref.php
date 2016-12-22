<?php
namespace Extended;
/**
 * This class has been made for
 * general purpose functions.
 *
 * @author RSHARMA
 * @version 1.0
 */
class country_ref extends \Entities\country_ref
{
	const  STATUS_ACTIVE = 1;
	const  STATUS_INACTIVE = 0;
	
	/**
	 * returns object of the row.
	 *
	 * @param $id
	 * @return object
	 * @author Jsingh7
	 * @version 1.0
	 */
	public static function getRowObject($id)
	{
		$em = \Zend_Registry::get('em');
		$obj = $em->find('\Entities\country_ref', $id);
		return $obj;
	}
	
	/**
	 * returns object of the row.
	 *
	 * @param $string (name of country)
	 * @return object
	 * @author Jsingh7
	 * @version 1.0
	 */
	public static function getRowObjectByName( $string )
	{
		$em = \Zend_Registry::get('em');
		$obj = $em->getRepository('\Entities\country_ref')->findOneBy(array('name' => $string));
		return $obj;
	}
	
	/**
	 * This function has been made to
	 * get the list of all countries.
	 *
	 * @author RSHARMA, spatial, sjaiswal
	 * @version 1.1
	 */	
	public static function getCountryList()
	{
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select('cf')
		->from('\Entities\country_ref', 'cf')
		->where( 'cf.status = ?1' )
		->setParameter( 1, self::STATUS_ACTIVE )
		->orderBy( 'cf.name', 'ASC' );
		$result= $q_1->getQuery ()->getResult ( \Doctrine\ORM\Query::HYDRATE_ARRAY );
		return $result;
	}
	
	/**
	 * Returns all countries,
	 * which are active and
	 * not have been deleted.
	 * 
	 * @author jsingh7
	 * @version 1.0
	 * @return array-collection
	 */
	public static function getAllActiveCountries()
	{
		$em = \Zend_Registry::get('em');
		$dql = "SELECT con FROM \Entities\country_ref con WHERE con.status = ".self::STATUS_ACTIVE." Order by con.name asc";
		$result= $em->createQuery($dql)->getResult();
		return $result;
	}
	
	/**
	 * Returns only that countries from where users
	 * registered.
	 * 
	 * @author jsingh7
	 * @version 1.0
	 * @return array-collection
	 */
	public static function getAllCountriesUsersRegisteredFrom()
	{
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select('cf')
		->from('\Entities\country_ref', 'cf')
		->innerJoin('cf.countrysUser', 'usr')
		->where( 'cf.status = ?1' )
		->setParameter( 1, self::STATUS_ACTIVE )
		->orderBy( 'cf.name', 'ASC' );
		$result= $q_1->getQuery()->getResult();
		return $result;
	}
	
	/**
	 * Returns only that countries of which jobs are posted
	 *
	 * @author sjaiswal
	 * @version 1.0
	 * @return array-collection
	 */
	public static function getAllCountriesJobsPosted()
	{
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select('cf')
		->from('\Entities\country_ref', 'cf')
		->innerJoin('cf.job', 'job')
		->where( 'cf.status = ?1' )
		->setParameter( 1, self::STATUS_ACTIVE )
		->orderBy( 'cf.name', 'ASC' );
		$result= $q_1->getQuery()->getResult();
		return $result;
	}
}