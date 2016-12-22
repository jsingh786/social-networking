<?php
namespace Extended;
use Proxies\__CG__\Entities\role;

/**
 * This class has been made for
 * general purpose functions.
 *
 * @author jsingh7
 * @version 1.0
 */
class admin extends \Entities\admin
{
	const IS_ADMIN = 1;
	const IS_SUB_ADMIN = 2;
	
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
		$obj = $em->find('\Entities\admin',$id);
		return $obj;
	}

	/**
	 * Returns all admins
	 * [Admin are those who have role ID = 1]
	 *
	 * @return Array collection
	 * @author jsingh7
	 * @version 1.0
	 */
	public static function getAdmins()
	{
		$em = \Zend_Registry::get('em');
		return $em->getRepository('\Entities\admin')->findBy(array('role' => SELF::IS_ADMIN));
	}

	/**
	 * get all admin/sub-admins.
	 * 
	 * @author jsingh7
	 * @version 1.0
	 */
	public static function getAllActiveAdminNSubAdmins()
	{
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select('adm')
				->from( '\Entities\admin', 'adm' )
				->where( 'adm.status = '.true );
		return $q_1->getQuery()->getResult();
	}
	
	/**
	 * Returns array of admins information by email id.
	 *
	 * @param string $email
	 *
	 * @return object
	 * @author jsingh7
	 * @version 1.0
	 */
	public static function getAdminNSubAdminByEmail( $email )
	{
		$em = \Zend_Registry::get('em');
		return $em->getRepository('\Entities\admin')->findOneBy( array( 'email_id' => $email ) );
	}
	
	/**
	 * Checks for email duplicacy.
	 * @param $email
	 * @param $current_edit_email (optional)
	 * @return IDENTITY or false
	 * @author sjaiswal
	 * @version 1.0
	 */
	public static function isEmailExist( $email)
	{
		
		$em = \Zend_Registry::get('em');
		$user = $em->getRepository('\Entities\admin')->findOneBy( array( 'email_id' => $email ) );
		
		if( $user )
		{
			return $user->getEmail_id();
		}
		else
		{
			return false;
		}
	}
	
	/**
	 * Checks for email duplicacy.
	 * @param $email
	 * @param $current_edit_email (optional)
	 * @return IDENTITY or false
	 * @author sjaiswal
	 * @version 1.0
	 */
	public static function isEmailExistEdit( $email ,$current_edit_email)
	{
	
		$em = \Zend_Registry::get('em');
		$user = $em->getRepository('\Entities\admin')->findOneBy( array( 'email_id' => $email ) );
	
		if( $user || $email == $current_edit_email )
		{
			//echo "true";
			return $user->getEmail_id();
		}
		else
		{
			//echo "false";
			return false;
		}
	}
	
	
	/**
	 * creates sub-admins and send one time password email
	 * @param array $params
	 * @author sjaiswal
	 * @version 1.0
	 */
	public static function createSubAdmin(array $params)
	{
		if($params)
		{
			$em = \Zend_Registry::get('em');
			$admin_obj = new \Entities\admin();	
			$admin_obj -> setFirstname($params['first_name'] );
			$admin_obj -> setLastname($params['last_name'] );
			$admin_obj -> setEmail_id($params['email_id'] );
			$admin_obj -> setPassword(md5($params['password']));
			$admin_obj -> setStatus(1);
			$admin_obj -> setExpiry_date(\DateTime::createFromFormat( "Y-m-d H:i:s", $params['expiry_date'].' 00:00:00' ));
			$admin_obj -> setIs_first_time_login(1);
			$role_obj = $em->find('\\Entities\\role', self::IS_SUB_ADMIN);
			$admin_obj -> setRole($role_obj);
			
			if($params['image_upload_successful'] == 1)
			{
				$admin_obj -> setProfile_picture($params['image_name']);
			}
			
			$em -> persist($admin_obj);
			$em -> flush();
			
			if($admin_obj->getId() && $params['upload_success']  == 1)
			{	
				return true;
			}
			else if(!$admin_obj->getId())
			{
				return false;
			}	
		
		}

	}
	
	
	/**
	 * edit admin or sub-admin details
	 * @author sjaiswal
	 * @params array $params
	 * @version 1.0
	 */
	public static function editAdminOrSubAdmin(array $params)
	{	
		
		if($params)
		{
			$em = \Zend_Registry::get('em');
			$qb = $em->createQueryBuilder();
			$q_1 = $qb->update('\Entities\admin', 'subadmin')
			->set('subadmin.firstname', ':firstname')
			->set('subadmin.lastname', ':lastname')
			->set('subadmin.email_id', ':email_id')
			->where($qb->expr()->eq('subadmin.id', ':id'))
			->setParameter('firstname', $params['first_name'])
			->setParameter('lastname', $params['last_name'])
			->setParameter('email_id', $params['email_id'])
			
			->setParameter('id', $params['id']);

			if (isset($params['expiry_date']))
			{
				$q_1->set('subadmin.expiry_date', ':expiry_date')
				->setParameter('expiry_date', \DateTime::createFromFormat( "Y-m-d H:i:s", $params['expiry_date'].' 00:00:00'));
			}
			
			
			if($params['password'] != "")
			{
				$q_1->set('subadmin.password', ':password')
				->setParameter('password', md5($params['password']));
			}
			if($params['general_password'] != "")
			{
				$q_1->set('subadmin.six_digit_general_password', ':six_digit_general_password')
				->setParameter('six_digit_general_password', $params['general_password']);
			}
			if(isset($params['image_upload_successful']) && $params['image_upload_successful']  == 1)
			{
				$q_1->set('subadmin.profile_picture', ':profile_picture')
				->setParameter('profile_picture', $params['image_name']);
			}
			
			if($q_1->getQuery()->execute() && $params['upload_success']  == 1)
			{
				$em->clear();
				return true;
			}
			else if(!$q_1->getQuery()->execute())
			{
				return false;
			}
		}
		
	}
	

	/**
	 * get admin or sub-admin details
	 * @author sjaiswal
	 * @param integer $id 
	 * @version 1.0
	 */
	static public function getAdminOrSubAdminDetails($id)
	{
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select('sub_admin')
				->from('\Entities\admin', 'sub_admin')
				->where( 'sub_admin.id='.$id );
		return $q_1->getQuery ()->getResult ();
	}
	
	
	/**
	 * get sub-admins with certain params
	 * @param int $limit
	 * @param int $offset
	 * @param string $orderByColumn
	 * @param string $orderByColumnAlias
	 * @param string $order
	 * @param array $filter_columns
	 * @param string $filterText
	 * @version 1.0
	 * @author sjaiswal
	 */
	public static function getSubAdminsByParameters( $limit = null,
										$offset = null, 
										$orderByColumn = 'sub_admin.id',
										$orderByColumnAlias = 'idd',
										$order = 'DESC',
										array $filter_columns,
										$filterText = null )
	{	
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		
		$q_1 = $qb_1->select( 'sub_admin' )
		->addSelect( "sub_admin.id as idd" )
		->addSelect( "sub_admin.firstname as sub_admin_first_name" )
		->addSelect( "sub_admin.lastname as sub_admin_last_name" )
		->addSelect( "CONCAT( CONCAT(sub_admin.firstname, ' '), sub_admin.lastname) as sub_admin_full_name" )
		->addSelect( "sub_admin.email_id as sub_admin_email_id" )
		->addSelect( "sub_admin.status as sub_admin_status" )
		->from( '\Entities\admin', 'sub_admin' );
		

		//List length
		if( $limit )
		{
			$q_1->setFirstResult( $offset )
			->setMaxResults( $limit );
		}

		//Sorting
		if( $orderByColumn && $order )
		{
			$q_1->orderBy( 	$orderByColumn, $order );
		}
		
		//Filtering
		if( $filter_columns && $filterText )
		{
			foreach ( $filter_columns as $key => $filter_column )
			{
				$q_1->orWhere( $filter_column.' LIKE :word'.$key)
				->setParameter('word'.$key, '%'.$filterText.'%');
			}
		}
		
		$q_1->andWhere( 'sub_admin.role='.self::IS_SUB_ADMIN );
		return $q_1->getQuery()->getResult();
// 		echo $q_1->getQuery()->getSql(); die;
	}
	
	/**
	 * delete sub admin record
	 * @author sjaiswal
	 * @param array of ids to be deleted 
	 * @version 1.0
	 */
	public static function deleteSubAdmin( array $ids_r )
	{
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->delete('\Entities\admin','r_a')
		->where( 'r_a.id IN (:ids_r)' )
		->setParameter( 'ids_r', $ids_r )
		->getQuery();
		$results = $q_1->execute();
	}
	
	/**
	 * enable sub admin record
	 * @author sjaiswal
	 * @param array of ids to enable
	 * @version 1.0
	 */
	
	public static function enableSubAdmin( array $ids_r )
	{
		$em = \Zend_Registry::get('em');
		$qb = $em->createQueryBuilder();
		$q_1 = $qb->update('\Entities\admin', 'subadmin')
		->set('subadmin.status', '?1')
		->where('subadmin.id IN (:id)')
		->setParameter('1', 'True')
		->setParameter('id', $ids_r)
		->getQuery();
		$q_1->execute();
	}
	
	
	/**
	 * disable sub admin record
	 * @author sjaiswal
	 * @param array of ids to disable
	 * @version 1.0
	 */
	
	public static function disableSubAdmin( array $ids_r )
	{
		$em = \Zend_Registry::get('em');
		$qb = $em->createQueryBuilder();
		$q_1 = $qb->update('\Entities\admin', 'subadmin')
		->set('subadmin.status', '?1')
		->where('subadmin.id IN (:id)')
		->setParameter('1', 'False')
		->setParameter('id', $ids_r)
		->getQuery();
		 $q_1->execute();
	}
	
	
	/**
	 * add admin Profile picture
	 * @author sjaiswal
	 * @param string $image_name
	 * @param string $temp_image_name
	 * @version 1.0
	 */
	
	public static function addProfilePic($image_name,$temp_image_name)
	{
		
		// This is the root path where we have all the profie photos 
		$profile_photo_path = REL_IMAGE_PATH.'\\admin_profile/';
		
		if($image_name)
		{
		//get unique name for image file;
		$unique_image_name = \Helper_common::getUniqueNameForFile($image_name);
		}
		$image_upload_path = $profile_photo_path."".$unique_image_name;
		
		$return_r = array();
		$return_r['is_success'] = 0;
		$return_r['msg'] = "Success";
		$adapter = new \Zend_File_Transfer_Adapter_Http();
		
		// Limit the size of a image from 1kb to 5mb
		
		$adapter->setValidators(array(
				'Size'  => array('min' => 1024, 'max' => 5242880)
		));

		$adapter->addValidator('Extension', true,
				'jpg,jpeg,png,gif');
		
		$adapter->getValidator("Extension")->setMessages(array(
				\Zend_Validate_File_Extension::FALSE_EXTENSION   => "Please upload only 'jpg, jpeg, png, gif' image."
		)); 
	

		$adapter->getValidator("size")->setMessages(array(
    			\Zend_Validate_File_Size::TOO_BIG       => "Please upload maximum 5 MB size file.",
    			\Zend_Validate_File_Size::TOO_SMALL     => "The size of a file you trying to upload, is too small, Please try file of atleast 1KB size."
    					
    			));
		
		$adapter->getValidator("Upload")->setMessages(array(
				\Zend_Validate_File_Upload::NO_FILE    => "Please upload image to proceed.",
				
		)); 
		$adapter->getValidator("upload")->setMessages(array(
				\Zend_Validate_File_Upload::INI_SIZE      => "The size of a file you trying to upload, exceeds 5MB, Please try smaller file."
		));
		
	
		$messages = new \Zend_Session_Namespace('admin_messages');
		
		//If file is not valid.
		if( !$adapter->isValid() )
		{
			foreach ( $adapter->getMessages() as $msg )
			{
				$return_r['msg'] = $msg;
			}
				
			$messages->errorMsg = $msg;
			$return_r['is_success'] = 0;
		}
		else
		{
			// If admin_profile directory does not exist 
			if ( !file_exists( $profile_photo_path ) )
			{
				// create admin_profile directory
				if( mkdir( $profile_photo_path, 0777, true ) )
				{
					//Uploading file to original directory.
					$adapter->setDestination( realpath( $profile_photo_path ) );
					$filterFileRename = new \Zend_Filter_File_Rename( array( 'target' => $unique_image_name, 'overwrite' => true ));
					$adapter->addFilter( $filterFileRename );
					if( $adapter->receive() )
					{
						if(\Helper_ImageResizer::smart_resize_image( $profile_photo_path."/".$unique_image_name, NULL, 200, 200, false, $profile_photo_path."/".$unique_image_name, false))
						{
								
							//echo \Zend_Json::encode($unique_image_name);
							//die;
							$return_r['is_success'] = 1;
						}
					}
				}
			}
			else
			{
				
				//Uploading file to original directory.
					$adapter->setDestination( realpath( $profile_photo_path ) );
					$filterFileRename = new \Zend_Filter_File_Rename( array( 'target' => $unique_image_name, 'overwrite' => true ));
					$adapter->addFilter( $filterFileRename );
					if( $adapter->receive() )
					{
						if(\Helper_ImageResizer::smart_resize_image( $profile_photo_path."/".$unique_image_name, NULL, 200,200, false, $profile_photo_path."/".$unique_image_name, false))
						{
								
							//echo \Zend_Json::encode($unique_image_name);
							$return_r['is_success'] = 1;
							//die;
						}
					}
			}
			
		}
		
		$return_r['image_name'] = $unique_image_name;
		
		return $return_r;
	
	}
	
	/**
	 * returns id of active sub admin for given email_id.
	 * @param String email
	 * @return integer id|boolean false
	 * @author hkaur5
	 */
	public static function getActiveSubAdminIdByEmail( $email )
	{
		$id = 2;
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select('adm')
		->from( '\Entities\admin', 'adm' )
		->leftjoin('adm.role', 'rl')
		->where( 'adm.status = 1')
		->andWhere('rl.id = ?1')
		->andWhere('adm.email_id =:email_idd')
		->setParameter('email_idd', $email)
		->setParameter(1, $id);
		$res = $q_1->getQuery()->getResult();
		if( $res )
		{
			$subadmin_id = $res[0]->getId();
			return $subadmin_id;
		}
		else
		{
			return false;
		}
	}
	
	/**
	 * Set given password of given subadmin id.
	 * @param integer $sub_admin_id
	 * @param string $post_pswd
	 * @param int $is_first_time_login
	 * @return 0,1 and 2.
	 * @author hkaur5
	 * @author sjaiswal
	 */
	public static function saveSubadminPswd( $sub_admin_id, $post_pswd, $is_first_time_login = null)
	{
			$em = \Zend_Registry::get('em');
			$adminObj=\Extended\admin::getRowObject($sub_admin_id);
			
			// get old password 
			$old_password = $adminObj->getPassword();
			
			if($post_pswd != $old_password)
			{
				//set new password
				$adminObj->setPassword($post_pswd);
				if($is_first_time_login)
				{
					$adminObj->setIs_first_time_login(0);
				}
				$em->persist($adminObj);
				$em->flush();
				$id=$adminObj->getId();
			}
		

			if($post_pswd == $old_password)
			{
				return 0; // if old pswd and new password are same
			}
			else if($id == $sub_admin_id)
			{	
				return 1; // if password changed successfully
			}
			else
			{
				return 2; // if any error occured
			}
	
	}
	
	/**
	 * get total sub-admins count
	 * @author sjaiswal
	 * @return integer (sub-admins count)
	 * @version 1.0
	 */
	
	public function getSubAdminsCount()
	{
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select('count(sub_admin)')
		->from('\Entities\admin', 'sub_admin')
		->andWhere( 'sub_admin.role='.self::IS_SUB_ADMIN );
		$result = $q_1->getQuery()->getResult();
		return $result[0][1];
		
	}
	
	
	/**
	 * Deleting sub-amdins profile picture by matching user id.
	 * @author sjaiswal
	 * @param integer $user_id
	 * @version 1.0
	 *
	 */
	public static function removeProfilePictureByUserId($user_id)
	{
		$em = \Zend_Registry::get('em');
	
		//updating profile picture to null
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->update('\Entities\admin','subadmin')
		->set('subadmin.profile_picture', '?2')
		->where('subadmin.id = ?1')
		->setParameter( 1, $user_id )
		->setParameter( 2, '' );
		$q_1 = $q_1->getQuery ();
		return $q_1->execute();
		
	}
	
	
	/**
	 * update job status on basis of status.
	 * @author sjaiswal
	 * @param array $job_id
	 * @param integer $status
	 * @version 1.0
	 *
	 */
	public static function updateJobStatus($job_id,$status)
	{
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->update('\Entities\job','job')
		->set('job.jobStatus', '?1')
		->where( 'job.id IN (:job_ids)' )
		->setParameter( 'job_ids', $job_id )
		->setParameter( 1, $status );
		$q_1 = $q_1->getQuery ();
		return $q_1->execute();
	
	}

	/**
	 * Returns array of admins information by admin type
	 *
	 * @param constant role
	 *
	 * @return object
	 * @author ssharma4
	 * @version 1.0
	 */
	public static function getAdminbyrole( )
	{
		$em = \Zend_Registry::get('em');
		return $em->getRepository('\Entities\admin')->findOneBy( array( 'role' =>admin::IS_ADMIN ) );
	}
}