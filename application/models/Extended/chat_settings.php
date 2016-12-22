<?php
namespace Extended;
/**
 * This class has been made for
 * chat settings related functions.
 *
 * @author kkaur5   
 * @version 1.0
 */


class chat_settings extends \Entities\chat_settings
{
	/**
	 * Returns object of the record on basis of column name - value pair.
	 *
	 * @param Array $columnNameValuePair ['id'=>123]
	 * @return null|object
	 * @author jsingh7
	 * @version 1.1
	 *
	 */
	public static function getRowObject(Array $columnNameValuePair)
	{
		$em = \Zend_Registry::get('em');
		return $em->getRepository('\Entities\chat_settings')->findOneBy($columnNameValuePair);
	}
	
	/**
	 * update user chat setting.
	 * Type can be 'chat' or '?'

	 * @author kkaur5
	 * @param conatains indexes status, type, user_id, openfire_password[optional][base64]
	 * 
	 * 
	 */
	public static function updateUserChatSetting($params)
	{
		
		$em = \Zend_Registry::get('em');
		$chat_obj = $em->getRepository('\Entities\chat_settings')->findOneBy(array( 'ilookUser'=>$params['user_id'] ));

		if( ! $chat_obj )
		{
			$chat_obj = new \Entities\chat_settings();
			if( $params['type'] == 'chat')
			{
				$chat_obj->setChat_on( $params['status'] );
				$chat_obj->setRead_receipt( 1 );
			}
			else
			{
				$chat_obj->setChat_on( 1 );
				$chat_obj->setRead_receipt( $params['status'] );
			}

		}
		else if( $params['type'] == 'chat')
		{
			$chat_obj->setChat_on( $params['status'] );
		}
		else
		{
			$chat_obj->setRead_receipt( $params['status'] );
		}

		// openfire_password passed in params array.
		if( isset($params['openfire_password']) ){
			$chat_obj->setOpenfire_password($params['openfire_password']);
		}

		$chat_obj->setIlookUser( \Extended\ilook_user::getRowObject( $params['user_id'] ) );

		$em->persist($chat_obj);
		$em->flush();

		return $chat_obj->getId();
	}
	
	/**
	 * check chat status of any user 
	 * @author kkaur5
	 **/
	public static function checkChatOrReadStatus($user_id)
	{
		$em = \Zend_Registry::get('em');
		$chat = $em->getRepository('\Entities\chat_settings')->findOneBy(array( 'ilookUser'=>$user_id ));
		
		return $chat;
	}
	/**
	 * Adds record for openfire user
	 * in iLook database.
	 * @param array $params[openfire_password,iLookUser,status,type]
	 * @return object
	 * @author jsingh7
	 * @version 1.0
	 */
	public static function add($params)
	{
		$em = \Zend_Registry::get('em');
		$obj = new \Entities\chat_settings();
		$obj->setChat_on( 1 );
		$obj->setRead_receipt( 1 );
		$obj->setOpenfire_password($params['openfire_password']);
		$obj->setIlookUser(\Extended\ilook_user::getRowObject( $params['iLookUser'] ));
		$em->persist($obj);
		$em->flush();
		return $obj;

	}

}
?>