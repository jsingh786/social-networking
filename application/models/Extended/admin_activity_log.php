<?php
namespace Extended;

class admin_activity_log extends \Entities\admin_activity_log
{
	const MODULE_DASHBOARD = 1;
	const MODULE_DISPLAY = 2;
	const MODULE_PHOTOS = 3;
	const MODULE_GENERAL_SETTINGS = 4;
	
	public static function getAdminActivitiesByParameters( $limit = null,
										$offset = null, 
										$orderByColumn = 'acts.id',
										$orderByColumnAlias = 'idd',
										$order = 'DESC',
										array $filter_columns,
										$filterText = null )
	{
		
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		
		$q_1 = $qb_1->select( 'acts' )
		->addSelect( "acts.id as idd" )
		
		->addSelect( "ilk_usr.firstname as ilk_usr_first_name" )
		->addSelect( "ilk_usr.lastname as ilk_usr_last_name" )
		->addSelect( "CONCAT( CONCAT(ilk_usr.firstname, ' '), ilk_usr.lastname) as ilk_usr_full_name" )
		->addSelect( "ilk_usr.email as ilk_usr_email" )
		->addSelect( "ilk_usr.username as ilk_usr_username" )
		
		->addSelect( "admn.firstname as admn_first_name" )
		->addSelect( "admn.lastname as admn_last_name" )
		->addSelect( "CONCAT( CONCAT(admn.firstname, ' '), admn.lastname) as admn_full_name" )
		->addSelect( "admn.email_id as admn_email_id" )
		
		->addSelect( "acts.module as modle" )
		->addSelect( "acts.created_at as datentime" )
		
		->from( '\Entities\admin_activity_log', 'acts' )
		->leftJoin( 'acts.ilookUser', 'ilk_usr' )
		->leftJoin( 'acts.admin', 'admn' );
		
		//List length
		if( $limit )
		{
			$q_1->setFirstResult( $offset )
			->setMaxResults($limit);
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
		return $q_1->getQuery()->getResult();
	}
	
	public static function deleteAdminActivities( array $ids_r )
	{
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->delete('\Entities\admin_activity_log','adm_acts')
		->where( 'adm_acts.id IN (:ids_r)' )
		->setParameter( 'ids_r', $ids_r )
		->getQuery();
		$results = $q_1->execute();
	}
	
	public static function addAdminActivityLog($admin_id, $ilook_user_id, $module_name)
	{
		switch ($module_name)
		{
			case 1:
				$module_name ='Dashboard';
				break;
			case 2:
				$module_name = 'Display';
				break;
			case 3:
				$module_name = 'Photos';
				break;
			case 4:
				$module_name = 'General settings';
				break;
		}
		$em = \Zend_Registry::get('em');
		$admin_activity_log = new \Entities\admin_activity_log();
		$admin_activity_log -> setadmin( \Extended\admin::getRowObject($admin_id ));
		$admin_activity_log -> setilookUser(\Extended\ilook_user::getRowObject($ilook_user_id) );
		$admin_activity_log -> setmodule( $module_name );


		
		$em -> persist($admin_activity_log);
		$em -> flush();
	}
}