<?php
namespace Extended;
/**
 * This class has been made for
 * general purpose functions.
 *
 * @author Sunny Patial
 * @version 1.0
 */
class education_detail extends \Entities\education_detail
{
	/**
	 * function used for add education info
	 * @param integer $userid, array $edu_arr with specific indexes..
	 * @return identity
	 * @author sunny patial
	 * @version 1.0
	 */
	public static function addEduInfo($userid,$params, $degree_id="", $school_id="", $field_study_id=""){
		$em = \Zend_Registry::get('em');
		$stripTags = \Zend_Registry::get('Zend_Filter_StripTags');
		
		$degree_obj=$em->find('\Entities\degree_ref',$degree_id);
		$field_study_obj=$em->find('\Entities\field_of_study_ref',$field_study_id);
		$school_detail_obj=$em->find('\Entities\school_ref',$school_id);
		$user_detail_obj=$em->find('\Entities\ilook_user',$userid);
		
		$education_obj=new \Entities\education_detail();
		
		$education_obj->setDuration_from(@$params["from"]);
		$education_obj->setDuration_to(@$params["to"]);
		$education_obj->setGrade(@$params["grade"]);
		$education_obj->setLocation(@$stripTags->filter($params["institute_location"]));
		$education_obj->setAcitivities(@$stripTags->filter($params["activities"]));
		$education_obj->setNotes(@$stripTags->filter($params["additional_notes"]));
		$education_obj->setDegree(@$stripTags->filter($params["degree_name"]));
		$education_obj->setEducation_detailsDegree(@$degree_obj);
		$education_obj->setEducationsUser(@$user_detail_obj);
		$education_obj->setEducation_detailsField_of_study_ref(@$field_study_obj);
		$education_obj->setEducation_detailsSchool(@$school_detail_obj);
		$em->persist(@$education_obj);
		$em->flush();
		$Eduid = $education_obj->getId();
		$em->getConnection()->close();
		return $Eduid;
	}
	/**
	 * function used for get list of the education info as per user id
	 * @param integer $id
	 * @return array
	 * @author sunny patial
	 * @version 1.0
	 */
	public static function getEduInfoList($id,$limit=""){
		$em = \Zend_Registry::get('em');
		$records=$em->createQuery('select e.id as educ_id,
				e.duration_from,
				e.duration_to, e.grade,e.location,
				e.acitivities, e.notes, e.degree as degree_name, u.id as user_id,
				d.id,d.title as degreetitle,f.id as fieldofstudy_id,
				f.title as fieldofstudy_title,
				s.id as school_id,s.title as school_title
				 from \Entities\education_detail e 
				LEFT JOIN e.education_detailsDegree d 
				LEFT JOIN e.educationsUser u 
				LEFT JOIN e.education_detailsField_of_study_ref f 
				LEFT JOIN e.education_detailsSchool s where e.educationsUser='.$id.' order by e.id desc');

		if($limit!="" && $limit!=0){
			$records=$records->setMaxResults(1);
		}
		$result=$records->getResult();
		return $result;
	}
	/**
	 * function used for get the particular education info
	 *
	 * @author sunny patial
	 * @version 1.0
	 * @return array
	 */
	public static function getEditEducationInfo($id){
		$em = \Zend_Registry::get('em');
		$records=$em->createQuery('select e.id as educ_id,
				e.duration_from,
				e.duration_to,e.grade,e.degree as degree_name,
				e.acitivities,e.notes,e.location,
				u.id as user_id,
				d.id,d.title as degreetitle,
				f.id as fieldofstudy_id,
				f.title as fieldofstudy_title,
				s.id as school_id,
				s.title as school_title from \Entities\\education_detail e 
				LEFT JOIN e.education_detailsDegree d 
				LEFT JOIN e.educationsUser u 
				LEFT JOIN e.education_detailsField_of_study_ref f 
				LEFT JOIN e.education_detailsSchool s where e.id='.$id);
		$result=$records->getResult();
		return $result;
	}
	/**
	 * function used for delete particular education info
	 *
	 * @author sunny patial
	 * @version 1.0
	 * @return 1
	 */
	public static function deleteEducationInfo($id,$user_id){
		$em = \Zend_Registry::get('em');
		
		$ilook_user_obj = \Extended\ilook_user::getRowObject($user_id);
		$user_type = $ilook_user_obj->getUser_type();
		if( $user_type == \Extended\ilook_user::USER_TYPE_STUDENT
		)
		{
			if( self::getUserEduCount($user_id) <= 1 )
			{
				return 3;
			}
		}
		$records=$em->createQuery('delete from \Entities\\education_detail e where e.id='.$id);
		if($records->getResult())
		{
			$records2=$em->createQuery('select e.id from \Entities\\education_detail e where e.educationsUser='.$user_id);
		 	
		 	if( $records2->getResult() )
		 	{	
		 		$em->getConnection()->close();
				return 1;
		 	}	
			else
			{
				$em->getConnection()->close();
				return 2;
			}	
		}
		else
		{
			$em->getConnection()->close();
			return 0;
		}
	}
	/**
	 * function used for update particular education info
	 *
	 * @author sunny patial
	 * @version 1.0
	 * @return 1
	 */
	public static function updateEducationInfo($id, $params, $degree_id, $school_id, $field_study_id){

		$em = \Zend_Registry::get('em');
		
		$stripTags = \Zend_Registry::get('Zend_Filter_StripTags');
		$education_obj=$em->find('\Entities\\education_detail',$params["educ_id"]);
		$education_obj->setDuration_from($params["from"]);
		$education_obj->setDuration_to($params["to"]);
		if(isset($params["grade"])) {
			$education_obj->setGrade($params["grade"]);
		}

		$education_obj->setLocation(isset($params["institute_location"])?$params["institute_location"]:'');
		$education_obj->setDegree(isset($params["degree_name"])?$params["degree_name"]:'');

		$education_obj->setAcitivities(isset($params["activities"])?$stripTags->filter($params["activities"]):'');

		$education_obj->setNotes(isset($params["additional_notes"])?$stripTags->filter($params["additional_notes"]):'');

		if(isset($field_study_id) && !empty($field_study_id) )
		{
			$field_study_obj=$em->find('\Entities\field_of_study_ref',$field_study_id);
			$education_obj->setEducation_detailsField_of_study_ref($field_study_obj);
		}
		if(isset($school_id) && !empty($school_id))
		{
			$school_detail_obj=$em->find('\Entities\school_ref',$school_id);
			$education_obj->setEducation_detailsSchool($school_detail_obj);
		}

		if(isset($degree_id) && !empty($degree_id))
		{
			$degree_obj=$em->find('\Entities\degree_ref',$degree_id);
			$education_obj->setEducation_detailsDegree($degree_obj);
		}
		$em->persist($education_obj);
		$em->flush();
		return true;		
	}
	/**
	 * function used for get education detail on the basis of user id.
	 * @author sunny patial
	 * @version 1.0
	 */
	public static function getEducationIds($id){
		$em = \Zend_Registry::get('em');
		$records=$em->createQuery('select e.id from \Entities\\education_detail e where e.educationsUser='.$id);
		$result=$records->getResult();
		$em->getConnection()->close();
		return $result;
	}
	/**
	 * function used for get list of the education info as per user id
	 * 
	 * @param integer $id
	 * @return array of school_ref ids
	 * @author shaina
	 * @version 1.0
	 */
	public static function getEduSchoolInfoList($userid){
		$em = \Zend_Registry::get('em');
		$records=$em->createQuery('select e from \Entities\\education_detail e where e.educationsUser = '.$userid);
		$result=$records->getResult();
		//echo "<pre>";
		//print_r($result);
		//die;
		$em->getConnection()->close();
		return $result;
	}
	/**
	 * Applies query on education details (
	 * the table which contains education records of ilook user
	 * )
	 * Returns users, who are not your friends
	 * but matches at least one of your school.
	 * 
	 * @param array $link_req_sent_recieved_ids ( link requests recieved or sent )
	 * @param array $edu_school_ids ( your education in schools ids )
	 * @param integer $loggedin_user_id ( your login id )
	 * @param integer $limit optional
	 * @return collection array of users matched according to education.
	 * 
	 * @author shaina, jsingh7
	 * @version 1.1
	 */
	public static function getYouMayKnowPeopleBySchool( $link_req_sent_recieved_ids, $edu_school_ids, $loggedin_user_id )
	{
		$em = \Zend_Registry::get('em');
		
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select(
							'max(edu_dtl.id) as edu_id,
							 IDENTITY(edu_dtl.educationsUser) as ilook_user_id,
							 max(edu_dtl.education_detailsSchool) as school_ref_id'
							)
		->from( '\Entities\\education_detail', 'edu_dtl' )
		->where( 'edu_dtl.educationsUser != ?1' )
		->setParameter( 1, $loggedin_user_id )
		->groupBy( "edu_dtl.educationsUser" );
		
		//check is edu user sent friend request to other same edu user and vice versa.
		if( $link_req_sent_recieved_ids )
		{
			$q_1->setParameter( 'link_req_sent_recieved_ids', $link_req_sent_recieved_ids);
			$q_1->andWhere('edu_dtl.educationsUser NOT IN (:link_req_sent_recieved_ids)');
		}
		
		//fetch same edu school ids
		if( $edu_school_ids )
		{
			$q_1->setParameter( 'edu_school_ids', $edu_school_ids);
			$q_1->andWhere('edu_dtl.education_detailsSchool IN (:edu_school_ids)');
		}
		$user_ids_related_by_edu = array ();
		if ($q_1->getQuery ()->getResult ())//Array of ( edu_id, ilook_user_id, school_ref_id ) 
		{
			foreach ( $q_1->getQuery ()->getResult () as $ids ) 
			{
				$user_ids_related_by_edu [] = $ids ['ilook_user_id'];
			}
		}
		else 
		{
			return array ();
		}
		
		//get unquine user ids related by edu
		$unquie_user_ids_related_by_edu = array_unique ( $user_ids_related_by_edu );
		
		//Fetching records of users who has been blocked.
		$blocked_user_ids_arr = array();
		$blocking_records = \Extended\blocked_users::getUsersBlockedByUserA( $loggedin_user_id );
		if( $blocking_records )
		{
			foreach ( $blocking_records as $blocking_record )
			{
				$blocked_user_ids_arr[] = $blocking_record->getIlookUserr()->getId();
			}
		}
		
		
		//get user with same edu ids having status 1
		$qb_2 = $em->createQueryBuilder();
		$q_2 = $qb_2->select ( 'usr' )
				->from ( '\Entities\ilook_user', 'usr' )
				->where ( 'usr.id IN (:ids)' )
				->andWhere('usr.status = 1')
				->setParameters ( array ('ids' => $unquie_user_ids_related_by_edu ) );
				if( $blocked_user_ids_arr ):
					$q_2->setParameter( 'blocked_users_r', $blocked_user_ids_arr );
					$q_2->andWhere( 'usr.id NOT IN (:blocked_users_r)' );
				endif;
		
	
		$ret = $q_2->getQuery ()->getResult ();
		$em->getConnection()->close();
		return $ret;
	}
	/**
	 * Applies query on education details (
	 * the table which contains education records of ilook user
	 * )
	 * Returns education records of people, who are not your friends
	 * but matches at least one of your school.
	 * 
	 * @param array $link_req_sent_recieved_ids ( link requests recieved or sent )
	 * @param array $edu_school_ids ( your education in schools ids )
	 * @param integer $loggedin_user_id ( your login id )
	 * @param integer $limit optional
	 * @return collection array of users matched according to education.
	 * 
	 * @author shaina
	 * @version 1.0
	 */
		public static function getYouMayKnowPeopleBySchools( $link_req_sent_recieved_ids, $edu_school_ids,$loggedin_user_id )
	{
		$em = \Zend_Registry::get('em');
		
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select('max(edu_dtl.id) as edu_id,
				IDENTITY(edu_dtl.educationsUser) as ilook_user_id,
				max(edu_dtl.education_detailsSchool) as school_ref_id'
		)
		->from('\Entities\\education_detail', 'edu_dtl')
		->where('edu_dtl.educationsUser != ?1')
		->setParameter( 1, $loggedin_user_id)
		->groupBy("edu_dtl.educationsUser");
		//check is edu user sent friend request to other same edu user and vice versa.
		//also
		if( $link_req_sent_recieved_ids )
		{
			$q_1->setParameter( 'link_req_sent_recieved_ids', $link_req_sent_recieved_ids);
			$q_1->andWhere('edu_dtl.educationsUser NOT IN (:link_req_sent_recieved_ids)');
		}
		
		//fetch same edu school ids
		if( $edu_school_ids )
		{
			$q_1->setParameter( 'edu_school_ids', $edu_school_ids);
			$q_1->andWhere('edu_dtl.education_detailsSchool IN (:edu_school_ids)');
		}
		
		$user_ids_related_by_edu = array ();
		if ($q_1->getQuery ()->getResult ())//Array of ( edu_id, ilook_user_id, school_ref_id )
		{
			foreach ( $q_1->getQuery ()->getResult () as $ids )
			{
				$user_ids_related_by_edu [] = $ids ['ilook_user_id'];
			}
		}
		else
		{
			return array ();
		}
		//get unquine user ids related by edu
		$unquie_user_ids_related_by_edu = array_unique ( $user_ids_related_by_edu );
		//get user with same edu ids having status 1
		
		$qb_2 = $em->createQueryBuilder ();
		$q_2 = $qb_2->select ( 'usr' )
		->from ( '\Entities\ilook_user', 'usr' )
		->where ( 'usr.id IN (:ids)' )
		->andWhere('usr.status = 1')
		->setParameters ( array ('ids' => $unquie_user_ids_related_by_edu ) );
		
				
		$ret = $q_2->getQuery ()->getResult ();
		$em->getConnection()->close();
		return $ret;
			}
	
	/*public static Function getEducationDetail()
	{
		$education_detail=array();
		$education_detail['Title']=$this->getEducation_detailsSchool()->getTitle();
		$education_detail['Degree']=$this->getEducation_detailsDegree()->getTitle();
		return $education_detail;
	}*/
			
	/**
	 * Returns one education of the user 
	 * ordered by end date and then by id.
	 * 
	 * @param integer $user_id
	 * @author rkaur3
	 * @version 1.0
	 * @return array collection
	 */	
	 public static function getOneLatestEduForUser( $user_id )
	 {
	 	$em = \Zend_Registry::get('em');
	 	$qb_1 = $em->createQueryBuilder ();
	 	$q_1 = $qb_1->select ( 'edu' )
	 	->from ( '\Entities\education_detail', 'edu' )
	 	->where( 'edu.educationsUser = ?1' )
	 	->setParameter( 1, $user_id)
	 	->OrderBy( 'edu.duration_to', 'DESC')
	 	->addOrderBy('edu.id', 'DESC')
	 	->setMaxResults(1);
	 	
	 	$ret = $q_1->getQuery ()->getResult( );
	 	$em->getConnection()->close();
	 	return $ret;
	 }
	
	/**
	 * function used to update degree,institution name and location of education_details
	 * @author rkaur3
	 * @version 1.0
	 */		
	public static function updateEduDetails( $edu_id, $school_id, $degree_name, $location )
	{
		
		$em = \Zend_Registry::get('em');
		
		$school_detail_obj=$em->find('\Entities\school_ref',$school_id);
		$education_obj=$em->find('\Entities\education_detail',$edu_id);
		$education_obj->setDegree(@$degree_name);
		$education_obj->setEducation_detailsSchool($school_detail_obj);
		$education_obj->setLocation($location);
		$em->persist($education_obj);
		$em->flush();
		$em->getConnection()->close();
		return true;
	}
	
	
	/**
	 * Returns number of education
	 * added by user.
	 *
	 * @param integer $user_id
	 * @return integer
	 * @author sjaiswal
	 * @version 1.0
	 */
	public static function getUserEduCount( $user_id )
	{
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder ();
		$q_1 = $qb_1->select ( 'count(edu.id)' )
		->from ( '\Entities\education_detail', 'edu' )
		->where( 'edu.educationsUser = ?1' )
		->setParameter( 1, $user_id);
		$ret = $q_1->getQuery ()->getResult();
		$em->getConnection()->close();
		return $ret[0][1];
	}
	
	
	/**
	 * Removes education linked with user id
	 * provided as a argument.
	 *
	 * @param integer $user_id
	 *
	 * @return boolean
	 * @author jsingh7
	 * @version 1.0
	 */
	public static function deleteEducationByUser( $user_id )
	{
		$em = \Zend_Registry::get('em');
		$edu_mixed = $em->getRepository( "\\Entities\\education_detail" )->findBy( array( 'educationsUser' => $user_id ) );
		if( $edu_mixed )
		{
			foreach ( $edu_mixed as $exp )
			{
				$em->remove( $exp );
			}
		}
	
		$em->flush();
		$em->getConnection()->close();
		return TRUE;
	}
	
}