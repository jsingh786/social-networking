<?php
namespace Extended;
/**
 * This class has been made for
 * general purpose functions.
 *
 * @author Sunny Patial
 * @version 1.0
 */
class certification extends \Entities\certification
{
	/**
	 * function used for get list of the education info as per user id
	 * @param integer $id
	 * @return array
	 * @author sunny patial
	 * @version 1.0
	 */
	public static function getCertificationInfoList($id,$limit=""){
		$em = \Zend_Registry::get('em');
		$records=$em->createQuery('select c from \Entities\certification c where c.certificationsUser='.$id.' order by c.id desc');
		if($limit!="" && $limit!=0){
			$records=$records->setMaxResults(1);
		}
		$result=$records->getResult();
		$em->getConnection()->close();
		return $result;
	}
	/**
	 * function used for add education info
	 * @param integer $userid, array $edu_arr with specific indexes..
	 * @return identity
	 * @author sunny patial
	 * @version 1.0
	 */
	public static function addCertificationInfo($userid,$params){
		$em = \Zend_Registry::get('em');
		$user_detail_obj=$em->find('\Entities\ilook_user',$userid);
	
		$certification_obj=new \Entities\certification();
		$certification_obj->setName(@$params["certification_name"]);
		$certification_obj->setAutority(@$params["authority"]);
		$certification_obj->setLicense_number(@$params["lincense_number"]);
		if($params["expired"])
		{
			$certification_obj->setIs_expired(0);
		}
		else
		{
			$certification_obj->setIs_expired(1);
		}
		if(@$params["from"])
			$certification_obj->setCertification_date( new \DateTime($params["from"]) );
		if( !$params["expired"])
		{
			if($params["expiry_date"] && !$params["expired"])
			{
				$certification_obj->setExpiry_date( new \DateTime($params["expiry_date"]) );
			}
		}
		$certification_obj->setCertificationsUser(@$user_detail_obj);
		$em->persist(@$certification_obj);
		$em->flush();
		$Certificationid = $certification_obj->getId();
		$em->getConnection()->close();
		return $Certificationid;
	}
	/**
	 * function used for get the particular certification info
	 *
	 * @author sunny patial
	 * @version 1.0
	 * @return array
	 */
	public static function getEditCertificationInfo($id){
		$em = \Zend_Registry::get('em');
		$records=$em->createQuery('select c.id,c.name as certification_name,c.autority,c.license_number,c.is_expired,c.certification_date, c.expiry_date, u.id as user_id from \Entities\certification c JOIN c.certificationsUser u where c.id='.$id.'');
		$result=$records->getResult();
		$em->getConnection()->close();
		return $result;
	}
	/**
	 * function used for update particular education info
	 *
	 * @author sunny patial
	 * @version 1.0
	 * @return 1
	 */
	public static function updateCertificationInfo($params){
		$em = \Zend_Registry::get('em');
		$certification_obj=$em->find('\Entities\certification',$params["certi_id"]);
		$certification_obj->setName($params["certification_name"]);
		$certification_obj->setAutority($params["authority"]);
		$certification_obj->setLicense_number($params["lincense_number"]);
		if(@$params["expired"])
		{
			$certification_obj->setIs_expired(0);
		}
		else
		{
			$certification_obj->setIs_expired(1);
		}
		if(@$params["from"]){
			$certification_obj->setCertification_date( new \DateTime($params["from"]) );
		}
		if( @$params["expired"]== '0')
		{
			if( @$params["expiry_date"] &&  !$params["expired"])
			{
				$certification_obj->setCertification_date( new \DateTime($params["expiry_date"]) );
			}
		}
		$em->persist($certification_obj);
		$em->flush();
		$em->getConnection()->close();
		return true;
	}
	/**
	 * function used for delete particular education info
	 *
	 * @author sunny patial
	 * @version 1.0
	 * @return 1
	 */
	public static function deleteCertificationInfo($id,$user_id){
		$em = \Zend_Registry::get('em');
		$records=$em->createQuery('delete from \Entities\certification e where e.id='.$id);
		if($records->getResult())
		{
			$records2=$em->createQuery('select e.id from \Entities\certification e where e.certificationsUser='.$user_id);
			$em->flush();
			
		 	if( $records2->getResult() )
				return 1;
			else
				return 2;
		}
		else
		{
			return 0;
		}
		
	}
}