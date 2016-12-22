<?php
/**
 * Executes after 30 days of deletion of account.
 * [when user deletes his account, in acutual data remains there only for 30 days.
 * but after 30 days data removed.]
 * Delete user from openfire server when deleted from iLook.
 * Delete user from links's roster also.
 *
 * @author jsingh7
 * @author ssharma4 [todo add your contribution to this]
 * @version 1.0
 */
include "/../index.php";

$em = \Zend_Registry::get('em');

$user_ids_to_be_deleted = \Extended\ilook_user::getUsersReadyToBeDeleted();


if( $user_ids_to_be_deleted )
{
	//===================================================================================
	//Remove all the cover letters and CVs for the users.
	//===================================================================================
	$user_ids_arr = array();
	foreach ( $user_ids_to_be_deleted as $user_id_to_be_deleted )
	{
		$user_ids_arr[] = $user_id_to_be_deleted["id"];
	}
	\Extended\job_applications::deleteCoverltrAndCVOfUser( $user_ids_arr );


	foreach ( $user_ids_to_be_deleted as $user_id_to_be_deleted )
	{
		
		//===================================================================================
		//Remove imails received and sent by user( actually automatic sent ) such as of type link request ( MSG_TYPE_LINK_REQ ).
		//===================================================================================
		$new_arr = array();
		foreach ( \Extended\link_requests::getLinkRequestSentOrRecieved ( $user_id_to_be_deleted['id'] ) as $temp )
		{
			$new_arr[] = $temp->getId();
		}
		
		if( $new_arr )
		{
			foreach ( $new_arr as $link_req_id )
			{
				$message_obj = $em->getRepository('\Entities\message')->findOneBy(array('link_req_id' => $link_req_id) );
				if($message_obj)
				{
					\Extended\message::deleteMessagePermanently( $message_obj->getId(), false );
				}
			}
			$em->flush();
		}
		
		//===================================================================================
		//Remove all the album directories of user from server.
		//===================================================================================
		Helper_common::removeUserAlbum( $user_id_to_be_deleted['id'] );
		
		//===================================================================================
		//Remove all the profile pictures of user from server directories of user.
		//===================================================================================
		Helper_common::removeProfileImagesOfUser( $user_id_to_be_deleted['id'] );

		//===================================================================================
		/* Remove "deleted user" from [comma separated links ids] from user table from the records of his links
		 * and also empty his row of comma separated link ids.
		 */
		//===================================================================================
		//First get links of user.
		$Userlinks_arr = \Extended\link_requests::getLinkList($user_id_to_be_deleted['id']);
		
		//Get user to be deleted obj.
		$user_id_to_be_deleted_op_obj = \Extended\chat_settings::getRowObject (['ilookUser'=> $user_id_to_be_deleted['id']]);
		if( $Userlinks_arr )
		{
			\Extended\link_requests::removeUserFromCommaSepLinkList( $Userlinks_arr, $user_id_to_be_deleted['id'], true );
			foreach ($Userlinks_arr as $links) {

				//-------------------------------------------------------------------
				//-----Code for remove user from roster starts here------------------
				//-------------------------------------------------------------------
				$openFireMain = new Openfire\Main();

				//Get user's link obj.
				$user_id_to_be_deleted_links_op_obj = \Extended\chat_settings::getRowObject (['ilookUser'=> $links]);
				//Delete links from user to be deleted roster.
				$openFireMain->deleteFromRoster (
													$user_id_to_be_deleted_links_op_obj->getIlookUser()->getUsername(),
													$user_id_to_be_deleted_op_obj->getIlookUser()->getUsername().'@'.$openFireMain::OPENFIRE_DOMAIN
												);
				//Delete user to be deleted from links roster.
				$openFireMain->deleteFromRoster (
													$user_id_to_be_deleted_op_obj->getIlookUser()->getUsername(),
													$user_id_to_be_deleted_links_op_obj->getIlookUser()->getUsername().'@'.$openFireMain::OPENFIRE_DOMAIN
												);
				//-------------------------------------------------------------------
				//-----Code for remove user from roster ends here--------------------
				//-------------------------------------------------------------------

			}
		}

		//===================================================================================
		//Remove user from openfire server.
		//===================================================================================
		$openFireMain->deleteUser($user_id_to_be_deleted_op_obj->getIlookUser()->getUsername());

		//===================================================================================
		//Remove "deleted user" from [comma separated supporter ids] from user_skills table on the basis of support_skill table.
		//===================================================================================
		\Extended\user_skills::deleteUserFromSupportedIds( $user_id_to_be_deleted['id'] );
		
		//===================================================================================
		//Deleting wish on the basis of new_link_id only.
		//===================================================================================
		\Extended\new_link_wishes::deleteWishOfTypeLinkReq( 0, $user_id_to_be_deleted['id'] );
		
		
		//===================================================================================
		//Remove user from user lucene indexing.
		//===================================================================================
		\Extended\ilook_user::deleteLuceneIndex( $user_id_to_be_deleted['id'] );


		//===================================================================================
		//Soft delete the user and cascade delete all the related things.
		//===================================================================================
		\Extended\ilook_user::softDeleteUser( $user_id_to_be_deleted['id'] );
	}
}