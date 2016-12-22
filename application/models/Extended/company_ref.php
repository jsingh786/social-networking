<?php
namespace Extended;
/**
 * This class has been made for
 * company related functions.
 *
 * @author RSHARMA   
 * @version 1.0
 */


class company_ref extends \Entities\company_ref
{
	const COMPANY_STATUS_ACTIVE = 1;
	const COMPANY_STATUS_INACTIVE = 0;
	
	/**
	 * returns object of the row.
	 *
	 * @param $id
	 * @return object
	 * @author SHAINA
	 * @version 1.0
	 */
	public static function getRowObject($id)
	{
		$em = \Zend_Registry::get('em');
		$obj = $em->find('\Entities\company_ref', $id);
		$em->getConnection()->close();
		return $obj;
	}
	
	/**
	 * used for save companies 
	 * and check 
	 * if the same value is already exist
	 * get its id and return it
	 * else
	 * Insert the new company and 
	 * return its id
	 * 
	 * @author RSHARMA, jsingh7
	 * @version 1.0
	 * @param string $company
	 * @param integer $added_by
	 * @param boolean $status (optional)
	 * @return identity or FALSE
	 */
	public static function addCompany($company, $added_by, $status=\Extended\company_ref::COMPANY_STATUS_ACTIVE){
		$em = \Zend_Registry::get('em');
		$company_obj = new \Entities\company_ref();
		$stripTags = \Zend_Registry::get('Zend_Filter_StripTags');
		$company_title = trim($stripTags->filter($company));
		$company_obj -> setName($company_title);
		$company_obj -> setStatus($status);
		$company_obj -> setIlook_user_id($added_by);
		$em -> persist($company_obj);
		$em -> flush();
		$insertedId = $company_obj->getId();
		$em->getConnection()->close();
		if($insertedId)
		return $insertedId;
		else
		return FALSE;
	}
	
	/**
	 * used to check
	 * if the same company already exist
	 * get its id and return it
	 *
	 * @param company
	 * @return 0, 1
	 * @author RSHARMA
	 * @version 1.0
	 */
	public static function checkCompany($company){
		
		$em = \Zend_Registry::get('em');
		$sql = "SELECT co.id, co.name FROM \Entities\company_ref co WHERE co.name='".$company."' AND co.status=".\Extended\company_ref::COMPANY_STATUS_ACTIVE;
		$result = $em->createQuery($sql)->getResult();
		$em->getConnection()->close();
		if($result){
			return $result[0]['id'];
		}
		else
		{
			return false;
		}
	}
	
	/**
	 * Returns all matching company's
	 * ids and names.
	 * 
	 * @param string $str_to_match
	 * @param integer $limit
	 * @param integer $offset
	 * @author jsingh7
	 * @author ssharma4[code updated from basic sql query to doctrine query standard]
	 * @return array or FALSE
	 * @version 1.0
	 * 
	 */
	public static function getAllCompanies( $str_to_match, $limit= NULL, $offset=NULL)
	{
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select('comp')
			->from( '\Entities\company_ref', 'comp' )
			->where( "comp.status =:comp_status")
			->andWhere( "comp.name LIKE :comp_name")
			->setFirstResult( $offset )
			->setMaxResults( $limit )
			->setParameter('comp_name','%'.$str_to_match.'%')
			->setParameter('comp_status',self::COMPANY_STATUS_ACTIVE);
		return $q_1->getQuery()->getResult();

	}
	
	/**
	 * Return id of company which has name 'like' name passed.
	 *
	 * @author hkaur5
	 * @param string $company_name
	 * @return integer or boolean
	 */
	static public function getCompanysIdByName( $company_name )
	{
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select('cp')
		->from( '\Entities\company_ref', 'cp' )
		->where( "cp.name LIKE :comp_name")
		->setParameter('comp_name','%'.$company_name.'%');
		$finalResult=$q_1->getQuery()->getResult();
		$em->getConnection()->close();
		if($finalResult)
		{
			return $finalResult[0]->getId();
		}
		else
		{
			return false;
		}
	}
	
	
	
	

	
}