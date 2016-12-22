<?php
namespace Extended;
class degree_ref extends \Entities\degree_ref
{
	/**
	 * function used for getting list of degree on the basis of keyword
	 * @return type array
	 * @author sunny patial
	 * @version 1.0
	 */
	public static function getDegreeList($keyword){
		
		$em = \Zend_Registry::get('em');
		$records=$em->createQuery("select d.id,d.title from Entities\degree_ref d where d.title LIKE '%".$keyword."%' order by d.title ASC");
		$result=$records->getResult();
		$em->getConnection()->close();
		return $result;
	}
	/**
	 * function used for to save new degree
	 * @return type array
	 * @author sunny patial
	 * @version 1.0
	 */
	public static function saveDegree($id,$degree_title){
		$em = \Zend_Registry::get('em');
		$records=$em->createQuery('select f.id from Entities\degree_ref f where f.title='."'".$degree_title."'");
		$values=$records->getResult();
		if(count($values)>0){
			$degree_id=$values[0]['id'];
		}
		else{
			$degree_obj=new \Entities\degree_ref();
			$degree_obj->setTitle($degree_title);
			$degree_obj->setStatus(1);
			$degree_obj->setIlook_user_id($id);
			$em->persist($degree_obj);
			$em->flush();
			$degree_id=$degree_obj->getId();
		}
		$em->getConnection()->close();
		return $degree_id;
	}
}