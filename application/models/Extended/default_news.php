<?php
namespace Extended;

/**
 * This class has been made for
 * general purpose functions.
 *
 * @author jsingh7
 * @version 1.0
 */
class default_news extends \Entities\default_news
{
	const NEWS_TYPE_BBC = 1;
	const NEWS_TYPE_IBN = 2;

	
	/**
	 * save default news entry
	 * @param $news_type
	 * @param $user_id
	 * @author sjaiswal
	 * @version 1.0
	 */
	public static function saveNewsDefault($news_type,$user_id)
	{
			$em = \Zend_Registry::get('em');
			$news_obj = new \Entities\default_news();	
			$news_obj -> setNews_type($news_type);
			$news_obj -> setUser_id($user_id);
			$em -> persist($news_obj);
			$em -> flush();
			
			if($news_obj->getId())
			{	
				return $news_obj->getUser_id();
			}
			else 
			{
				return false;
			}	
	}

	
	/**
	 * update default news entry
	 * @param $news_type
	 * @param $user_id
	 * @author sjaiswal
	 * @version 1.0
	 */
	public static function updateNewsDefault($news_type,$user_id)
	{
		$em = \Zend_Registry::get('em');
			$qb = $em->createQueryBuilder();
			$q_1 = $qb->update('\Entities\default_news', 'default_news')
			->set('default_news.news_type', ':news_type')
			->where($qb->expr()->eq('default_news.user_id', ':user_id'))
			->setParameter('news_type',$news_type)
			->setParameter('user_id', $user_id);
		
		if($q_1->getQuery()->execute())
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	
	
	/**
	 * get default news set for current user
	 * @param $user_id
	 * @author sjaiswal
	 * @version 1.0
	 */
	public static function getDefaultNewsSetForUser($user_id)
	{
		$em = \Zend_Registry::get('em');
		return $em->getRepository('\Entities\default_news')->findOneBy( array( 'user_id' => $user_id ) );
	}
	
}