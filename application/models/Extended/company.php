<?php
namespace Extended;
/**
 * This class has been made for
 * general purpose functions.
 *
 * @author Shaina
 * @version 1.0
 */
class company extends \Entities\company
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
		$obj = $em->find('\Entities\company',$id);
		$em->getConnection()->close();
		return $obj;
	}
	/**
	 * Returns all matching company's
	 * ids and names.
	 *
	 * @param string $str_to_match
	 * @author spatial
	 * @return array or FALSE
	 * @version 1.0
	 *
	 */
	public static function getAllCompanies( $str_to_match )
	{
		$em = \Zend_Registry::get('em');
		$sql = "SELECT comp.id, comp.name FROM \Entities\company comp WHERE comp.name LIKE '%".$str_to_match."%' order by comp.name ASC";
		$result = $em->createQuery($sql)->getResult();
		$em->getConnection()->close();
		if($result){
			return $result;
		}
		else
		{
			return false;
		}
	}
	
	/**
	 * Returns company id
	 * by matching name.
	 * 
	 * @param string $company_name
	 * @author jsingh7
	 * @version 1.0
	 */
	public static function getCompanyIdByName( $company_name )
	{
		if( $company_name )
		{	
			$em = \Zend_Registry::get('em');
			$query = $em->createQuery('select c.id from Entities\company c where c.name='."'".$company_name."'");
			$result = $query->getResult();
			if( $result )
			{
				return $result[0]['id'];
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
	 * used for save companies
	 * and check
	 * if the same value is already exist
	 * get its id and return it
	 * else
	 * Insert the new company and
	 * return its id
	 *
	 * @author jsingh7
	 * @version 1.0
	 * @param string $company
	 * @return identity or FALSE
	 */
	public static function addCompany($company){
		
		$company =str_replace("'", "''", $company);
		
		$em = \Zend_Registry::get('em');
		$company_obj = new \Entities\company();
		$stripTags = \Zend_Registry::get('Zend_Filter_StripTags');
		$company_title = trim($stripTags->filter($company));
		$company_obj -> setName($company_title);
		$em -> persist($company_obj);
		$em -> flush();
		$insertedId = $company_obj->getId();
		if($insertedId)
			return $insertedId;
		else
			return FALSE;
	}

	/**
	 * Check if company_name sent is a new record or already present in db.
	 * if already present then get id else add new record and get id of that record to insert in job table.
	 *
	 * @author ssharma4
	 * @version 1.0
	 * @param string $company
	 * @return identity or FALSE
	 */
	public static function findCompanyForJobPortal($company){
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select('c.id')
			->from('\Entities\company', 'c')
			->where( "c.name =?1" )
			->setParameter( 1, $company );
		$values=$q_1->getQuery()->getResult();

		if(count($values)>0)
		{
			$company_id=$values[0]['id'];
		}
		else
		{
			$company_obj=new \Entities\company();
			$company_obj->setName(stripslashes($company));
			$em->persist($company_obj);
			$em->flush();
			$company_id=$company_obj->getId();
		}
		return $company_id;
	}
	
}