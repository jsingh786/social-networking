<?php
class MailController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    }

    /**
     * This function checks auth storage and
     * manage redirecting.
     * 
     * @author jsingh7
     * @since 20 June, 2013
     * @version 1.0
     * @see Zend_Controller_Action::preDispatch()
     */
    public function preDispatch()
    {
    	if ( !Auth_UserAdapter::hasIdentity() )
    	{
    		$this->_helper->redirector( 'index', 'index' );
    	}  	
    }

    public function indexAction()
    {
        // action body        
    }

    /**
     * action for inbox view
     *
     * @author jsingh7
     */
    public function inboxAction()
    {
        // action body
    }

    /**
     * Returns all necessary data for inbox listing
     * for logged in user.
     * handles ajax call.
     *
     * @author jsingh7
     * @auther sjaiswal
     * @return json
     * @version 1.1
     *
     */
    public function getMyInboxAction()
    {
    	$page = $this->getRequest()->getParam( 'page' );
    	$cur_page = $page;
    	$page -= 1;
    	$per_page = 8;
    	$previous_btn = true;
    	$next_btn = true;
    	$first_btn = true;
    	$last_btn = true;
    	$start = $page * $per_page;
    	$current_user = Auth_UserAdapter::getIdentity()->getId();
    	$msg_type = array(Extended\message::MSG_TYPE_GENERAL, Extended\message::MSG_TYPE_ENQUIRY);
    	$my_inbox_messages = Extended\message::getInboxOfUser( $current_user, $per_page, $start, $msg_type );
    	
    	//Users blocked by current user or blocked current user.
    	$blocked_profiles = \Extended\blocked_users::getAllBlockersAndBlockedUsers($current_user);
    	
    	foreach ( $my_inbox_messages as $key=>$msgs ){
    		
    		//Checking if sender is in blocked profiles then setting prof_image as default.
    		if($blocked_profiles){
    			
	    		if( in_array($msgs['msg_sender_id'], $blocked_profiles)){
	    			
	    			//Setting image for user. So that there would be no need to apply conditions on json.
	    			$my_inbox_messages[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['msg_sender_id'], 3, false, $blocked_profiles );
	    		}
	    		else
	    		{
	    			//setting image for user. So that there would be no need to apply conditions on json.
	    			$my_inbox_messages[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['msg_sender_id'], 3);
	    		}
    		}
    		else 
    		{
	    		//setting image for user. So that there would be no need to apply conditions on json.
	    		$my_inbox_messages[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['msg_sender_id'], 3);
    		}
    		$my_inbox_messages[$key]['content'] =  strip_tags($msgs['contents']);;
			// setting datetime. So that there is no need to apply funtions for datetime in json.
			$my_inbox_messages[$key]['created_at'] = Helper_common::nicetime( $msgs['created_at']->format( "Y-m-d H:i:s" ) );
			
			// settings for displaying reply or not
			$my_inbox_messages[$key]['can_reply'] = 1;
			
			
			//Check if user blocked and vice versa, also check if user has been removed/deleted permanently
			// or reply is not allowed for this msg in database.
			$em = \Zend_Registry::get('em');
			$em->clear();
			if( \Extended\blocked_users::checkIfBlocked( $my_inbox_messages[$key]['msg_receiver_id'],$my_inbox_messages[$key]['msg_sender_id'] )
					|| \Extended\blocked_users::checkIfBlocked( $my_inbox_messages[$key]['msg_sender_id'],$my_inbox_messages[$key]['msg_receiver_id'] )
					|| ! \Extended\ilook_user::getRowObject( $my_inbox_messages[$key]['msg_sender_id'] )
					|| $my_inbox_messages[$key]['hide_reply_forward_opt']
					|| $msgs['sender_account_closed_on'] != null
			)
			{
				$my_inbox_messages[$key]['can_reply'] = 0;
			}
			
			$my_inbox_messages[$key]['can_forward'] = 1;
			//Check if forward option is disaboled for msg.
			if( $my_inbox_messages[$key]['hide_reply_forward_opt'] )
			{
				$my_inbox_messages[$key]['can_forward'] = 0;
			}

    	}
    	
    	$my_inbox_messages_count = Extended\message::getInboxCountOfUser( Auth_UserAdapter::getIdentity()->getId(), Extended\message::MSG_TYPE_GENERAL );
    	$count = $my_inbox_messages_count[0]["num_of_rows"];
    	$no_of_paginations = ceil($count / $per_page);
    	
    	/* ---------------Calculating the starting and ending values for the loop----------------------------------- */
    	if ($cur_page >= 7) {
    		$start_loop = $cur_page - 3;
    		if ($no_of_paginations > $cur_page + 3)
    			$end_loop = $cur_page + 3;
    		else if ($cur_page <= $no_of_paginations && $cur_page > $no_of_paginations - 6) {
    			$start_loop = $no_of_paginations - 6;
    			$end_loop = $no_of_paginations;
    		} else {
    			$end_loop = $no_of_paginations;
    		}
    	} else {
    		$start_loop = 1;
    		if ($no_of_paginations > 7)
    			$end_loop = 7;
    		else
    			$end_loop = $no_of_paginations;
    	}
    	/* ----------------------------------------------------------------------------------------------------------- */
    	
    	$msg = "";
    	$msg .= "<div class='pagination mail-all-hdr'><ul>";
    	
    	// FOR ENABLING THE FIRST BUTTON
    	if ($first_btn && $cur_page > 1)
    	 {
    		$msg .= "<li p='1' class='active' title=First> << </li>";
    	 } 
    	 else if ($first_btn) 
    	 {
    	    $msg .= "<li p='1' class='inactive' title=First> << </li>";
    	 }
    	
    	// FOR ENABLING THE PREVIOUS BUTTON
    	if ($previous_btn && $cur_page > 1) 
    	{
    		$pre = $cur_page - 1;
    		$msg .= "<li p='$pre' class='active'title=Previous> < </li>";
    	} 
    	else if ($previous_btn)
    	{
    		$msg .= "<li class='inactive' title=Previous> < </li>";
    	}
    	
    	// TO ENABLE THE NEXT BUTTON
    	if ($next_btn && $cur_page < $no_of_paginations) {
    		$nex = $cur_page + 1;
    	    $msg .= "<li p='$nex' class='active' title=Next> > </li>";
    	} 
    	else if ($next_btn) 
    	{
    		$msg .= "<li class='inactive' title=Next> > </li>";
    	}
    	
    	// TO ENABLE THE END BUTTON
    	if ($last_btn && $cur_page < $no_of_paginations)
    	 {
        	$msg .= "<li p='$no_of_paginations' class='active' title=Last> >> </li>";
    	 } 
    	else if ($last_btn) 
    	 {
    	  	$msg .= "<li p='$no_of_paginations' class='inactive' title=Last> >> </li>";
    	}
    	
    	$total_string = "<div class='total' a='$no_of_paginations'>Page <b>" . $cur_page . "</b> of <b>$no_of_paginations</b></div>";
    	
    	// TO ENABLE THE GO TO SEARCH.
    	$msg = $msg . "</ul>"  . $total_string .  "</div>";  // Content for pagination
    	 
//		Pagination merged with data array.
		$ret_array = array();
		$ret_array['records'] = $my_inbox_messages;
		$ret_array['pagination'] = $msg;
    	echo Zend_Json::encode( $ret_array );
    	die;
    }

    /**
     * Returns all necessary searched data for inbox listing
     * for logged in user.
     * handles ajax call.
     *
     * @author jsingh7
     * @return json
     * @version 1.0
     *
     *
     */
    public function getMySearchedInboxAction()
    {
    	$search_text = $this->getRequest()->getParam( 'search_text' );
    	$page = $this->getRequest()->getParam( 'page' );
    	$cur_page = $page;
    	$page -= 1;
    	$per_page = 8;
    	$previous_btn = true;
    	$next_btn = true;
    	$first_btn = true;
    	$last_btn = true;
    	$start = $page * $per_page;
		
    	$current_user = Auth_UserAdapter::getIdentity()->getId();
    	$blocked_profiles = \Extended\blocked_users::getAllBlockersAndBlockedUsers($current_user);
    	$my_inbox_messages = Extended\message::getSearchedInboxOfUser( Auth_UserAdapter::getIdentity()->getId(), $search_text, $per_page, $start, Extended\message::MSG_TYPE_GENERAL );
		$my_inbox_messages_r = array();
    	foreach ( $my_inbox_messages as $key=>$msgs )
    	{
    		
    		$sender_user_obj = \Extended\ilook_user::getRowObjectAdvanced($msgs['sclr6']);
    		$sender_account_closed_on = $sender_user_obj->getAccount_closed_on();
    		
    		$my_inbox_messages_r[$key]['id'] = $msgs['id0'];
    		$my_inbox_messages_r[$key]['subject'] = $msgs['subject1'];
    		$my_inbox_messages_r[$key]['content'] = strip_tags($msgs['contents2']);
    		$my_inbox_messages_r[$key]['sender_firstname'] = $msgs['firstname8'];
    		$my_inbox_messages_r[$key]['sender_lastname'] = $msgs['lastname9'];
    		$my_inbox_messages_r[$key]['mark_read'] = $msgs['mark_read13'];
    		
    		if($blocked_profiles)
    		{
    			if(in_array($msgs['sclr6'], $blocked_profiles))
    			{
		    		//setting image for user. So that there would be no need to apply conditions on json.
		    		$my_inbox_messages_r[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['sclr6'], 3, false, $blocked_profiles);
    			}
    			else 
    			{
    				$my_inbox_messages_r[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['sclr6'], 3 );
    			}
    		}
    		else 
    		{
    			$my_inbox_messages_r[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['sclr6'], 3 );
    		}
    			
    		// setting datetime. So that there is no need to apply funtions for datetime in json.
    		$temp = explode(".", $msgs['created_at5']);
    		$dateTimeObj = \datetime::createfromformat('Y-m-d H:i:s', $temp[0] );
    		$my_inbox_messages_r[$key]['created_at'] = Helper_common::nicetime( $dateTimeObj->format( "Y-m-d H:i:s" ) );
    		// settings for displaying reply or not
    		$my_inbox_messages[$key]['can_reply'] = 1;
    			
    			
    		//Check if user blocked and vice versa, also check if user has been removed/deleted permanently
    		// or reply is not allowed for this msg in database.
    		$em = \Zend_Registry::get('em');
    		$em->clear();
    		if( \Extended\blocked_users::checkIfBlocked( $msgs['sclr7'],$msgs['sclr6'] )
    				|| \Extended\blocked_users::checkIfBlocked( $msgs['sclr6'],$msgs['sclr7'] )
    				|| ! \Extended\ilook_user::getRowObject( $msgs['sclr6'] )
    				|| $msgs['hide_reply_forward_opt']
    				|| $sender_account_closed_on != null
    		)
    		{
    			$my_inbox_messages[$key]['can_reply'] = 0;
    		}
    			
    		$my_inbox_messages[$key]['can_forward'] = 1;
    		//Check if forward option is disaboled for msg.
    		if( $msgs['hide_reply_forward_opt'] )
    		{
    			$my_inbox_messages[$key]['can_forward'] = 0;
    		}
    	}
    	
    	$my_inbox_messages_for_count = Extended\message::getSearchedInboxOfUser( Auth_UserAdapter::getIdentity()->getId(), $search_text, null, 0, Extended\message::MSG_TYPE_GENERAL );
    	$count = count($my_inbox_messages_for_count);
    	
    	$no_of_paginations = ceil($count / $per_page);
    	 
    	/* ---------------Calculating the starting and ending values for the loop----------------------------------- */
    	if ($cur_page >= 7) {
    		$start_loop = $cur_page - 3;
    		if ($no_of_paginations > $cur_page + 3)
    			$end_loop = $cur_page + 3;
    		else if ($cur_page <= $no_of_paginations && $cur_page > $no_of_paginations - 6) {
    			$start_loop = $no_of_paginations - 6;
    			$end_loop = $no_of_paginations;
    		} else {
    			$end_loop = $no_of_paginations;
    		}
    	} else {
    		$start_loop = 1;
    		if ($no_of_paginations > 7)
    			$end_loop = 7;
    		else
    			$end_loop = $no_of_paginations;
    	}
    	/* ----------------------------------------------------------------------------------------------------------- */
    	$msg = "";
    	$msg .= "<div class='pagination mail-all-hdr'><ul>";
    	 
       	// FOR ENABLING THE FIRST BUTTON
    	if ($first_btn && $cur_page > 1) {
    		$msg .= "<li p='1' class='active' title=First> << </li>";
    	} else if ($first_btn) {
    		$msg .= "<li p='1' class='inactive' title=First> << </li>";
    	}
    	
    	// FOR ENABLING THE PREVIOUS BUTTON
    	if ($previous_btn && $cur_page > 1) {
    		$pre = $cur_page - 1;
    		$msg .= "<li p='$pre' class='active'title=Previous> < </li>";
    	} else if ($previous_btn) {
    		$msg .= "<li class='inactive' title=Previous> < </li>";
    	}

    	
    	// TO ENABLE THE NEXT BUTTON
    	if ($next_btn && $cur_page < $no_of_paginations) {
    		$nex = $cur_page + 1;
    		$msg .= "<li p='$nex' class='active' title=Next> > </li>";
    	} else if ($next_btn) {
    		$msg .= "<li class='inactive' title=Next> > </li>";
    	}
    	
    	// TO ENABLE THE END BUTTON
    	if ($last_btn && $cur_page < $no_of_paginations)
    	 {
    	  $msg .= "<li p='$no_of_paginations' class='active' title=Last> >> </li>";
    	 } 
    	 else if ($last_btn) 
    	 {
    	  $msg .= "<li p='$no_of_paginations' class='inactive' title=Last> >> </li>";
    	 }
    	 
    	$total_string = "<div class='total' a='$no_of_paginations'>Page <b>" . $cur_page . "</b> of <b>$no_of_paginations</b></div>";
    	 
    	$msg = $msg . "</ul>"  . $total_string . "</div>";  // Content for pagination
    	 
    	//Pagination merged with data array.
    	$ret_array = array();
    	$ret_array['records'] = $my_inbox_messages_r;
    	$ret_array['pagination'] = $msg;
    	//Zend_Debug::dump($ret_array);die;
    	echo Zend_Json::encode( $ret_array );
    	die;
    }
    
    public function composeAction()
    {
        // action body
        $this->view->param = $this->getRequest()->getParams();
    }

    /**
     * This function posts the value through 
     * ajax and insert the mail parameters to database.
     * 
     * @author RSHARMA, jsingh7
     * @author sjaiswal (added attachment code)
     * @version 1.1
     */
    public function sendMailAction()
    {
    	// action body.
    	$zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
    
    	$allParams = $this->getRequest()->getParams();

    	// Unserailise form data
    	parse_str($allParams['str'], $params);

    	$attachments = isset($allParams['temp_path_info_arr']) ? $allParams['temp_path_info_arr'] : array();
    	
    	$messages = new Zend_Session_Namespace('messages');
    	
    	$senderID = Auth_UserAdapter::getIdentity()->getId();
    	$sender_folder_id = \Extended\user_folder::getUserFolder($senderID, \Extended\folder::FOLDER_SENT_ITEMS);
    	
    	$messageBody = Helper_common::makeHyperlinkClickable(@$params['message_body']);
    	
    	//Filtering msg subject for html tags.
    	//Added by hkaur
    	$subject = $zend_filter_obj->filter( @$params['subject'] );
    	$receiver_ids_array = array_unique( $params['receiver_ids'] );
		$msageId = \Extended\message::addMessage( $subject, $messageBody, @$senderID, $receiver_ids_array,
					@$params['msg_type'] );
		
		if( $msageId )
		{
			$i = 0;
    		foreach ($receiver_ids_array as $key=>$reciverID )
    		{
    			if( $reciverID != 0 )
    			{
		    		$msguser = \Extended\message_user::addMessageUsers(@$senderID, @$reciverID, $msageId, 11);
		    		if($msguser)
		    		{
		    			$Receiver_folder_id = \Extended\user_folder::getUserFolder( $reciverID, \Extended\folder::FOLDER_INBOX );
		    			
		    			//linking messages with sender and receiver folders
		    			
		    			//note : when links msg to sender's folder uses message_user records of first receiver. 
		    			//Because one record is required of message_user to add entry in message_folder.
		    			if($sender_folder_id)
		    			{
		    				if( $i == 0 )//Don't use $key.
		    				{
		    					\Extended\message_folder::addMessageStatus($msageId, $msguser, $sender_folder_id);
								$i++;
		    				}
		    			}
		    			 
		    			if($Receiver_folder_id)
		    			{
		    				\Extended\message_folder::addMessageStatus($msageId, $msguser, $Receiver_folder_id);
		    			}
	    			}
    			}
	    	}
	    	
 	   		//saving attachments in specific directories and making entry in message attachment table.
    		$em = \Zend_Registry::get('em');
    		$em->clear();
 	   		$messageObj = \Extended\message::getRowObject($msageId);
	    	if ($messageObj)
	    	{
	    		if ($messageObj->getMessagesMessage_folder())
	    		{
		    		foreach ($messageObj->getMessagesMessage_folder() as $msg_fldr)
		    		{
		    			// directory naming is according to message id and users' inbox id(user_folder_id)
		    			
		    			// If already inbox ID
		    			if(\Extended\user_folder::getRowObject(
		    							 $msg_fldr->getMessage_foldersUser_folder()->getId())
		    							->getUser_foldersFolder()->getId()  == Extended\folder::FOLDER_INBOX)
		    			{	
		    				$user_inbox_id = $msg_fldr->getMessage_foldersUser_folder()->getId();
		    			}
		    			else
		    			{
		    				$user_inbox_id = \Extended\user_folder::getUserInboxIdByUserFolderId(
												$msg_fldr->getMessage_foldersUser_folder()->getId());
		    			}
		    					
		    			$imail_folder = REL_IMAIL_ATTACHMENT_PATH."\\imail_".$msg_fldr->getMessage_foldersMessage()->getId()."_".$user_inbox_id;


						$message_info['attachment_file_name'] =array();
		    			//Add entry to attachment table.
		    			// case when attachment is present
		    			if( $attachments && $msageId )
		    			{
		    				foreach($attachments as $key => $attachment)
		    				{
		    					if(isset($allParams['imail_type']) && $allParams['imail_type'] == 'forward')
		    					{
		    						//moves uploaded files from temporary location to permanent loaction.
		    						$temp_file_name = REL_IMAIL_ATTACHMENT_PATH."\\temp\\forward\\user_".$senderID."\\".$attachment['ts_file_name'];
		    					}
		    					else
		    					{
		    						$temp_file_name = REL_IMAIL_ATTACHMENT_PATH."\\temp\\user_".$senderID."\\".$attachment['ts_file_name'];
		    					}
								
		    					if ( !file_exists( $imail_folder ) )
		    					{
		    						mkdir( $imail_folder, 0777, true );
		    					}
		    					
		    					// copy temp file to user folder
		    					copy($temp_file_name, $imail_folder."\\".$attachment['ts_file_name']);
		    			
		    					// attachment file name with location
		    					$message_info['attachment_file_name'][$key] = $imail_folder."\\".$attachment['ts_file_name'];

		    				}
		    			}
		    		}
	    		}
	    	}
			

			if ($attachments && $msageId) {
				foreach ($attachments as $key => $attachment) {

					$attachment['ts_actual_file_name'] = Helper_common::removeTimestampFromFilename($attachment['ts_file_name']);

					// add attachment entry to database
					$result = \Extended\message_attachment::addMessageAttachment($msageId, $attachment);
				}
			}

			//Remove the temp imails dir for the user's imails attachments.
			Helper_common::deleteDir(SERVER_PUBLIC_PATH . '/imails/temp/user_' . $senderID);
		}

 	   	// sending email to every receiver 
 	   	foreach($receiver_ids_array as $receiver_id)
 	   	{
	 	   	if($receiver_id!=0)
	 	   	{
				$user_detail = \Extended\ilook_user::getUserdetailById($receiver_id);
 				\Email_Mailer::sendMail($subject,
	 	   				$messageBody,
	 	   				$user_detail['firstname']."".$user_detail['lastname'],
	 	   				$user_detail['email'],
	 	   				$message_info['attachment_file_name'],
	 	   				Auth_UserAdapter::getIdentity()->getFirstname()." ".Auth_UserAdapter::getIdentity()->getLastname(),
	 	   				Auth_UserAdapter::getIdentity()->getEmail()
				);
	 	   	}
			else if($receiver_id==0)
			{
				$adminCollec = \Extended\admin::getAdmins();
				foreach($adminCollec as $admin) {
					\Email_Mailer::sendMail($subject,
						$messageBody,
						$admin->getFirstname() . "" . $admin->getLastname(),
						$admin->getEmail_id(),
						$message_info['attachment_file_name'],
						Auth_UserAdapter::getIdentity()->getFirstname() . " " . Auth_UserAdapter::getIdentity()->getLastname(),
						Auth_UserAdapter::getIdentity()->getEmail()
					);
				}
			}
 	   	}

 	   	if( in_array(0, $receiver_ids_array) && count($receiver_ids_array) > 1 )
 	   	{
 	   		
	 	   	$messages->successMsg .= "Mail has been sent to iLook Administrator and other recipients.";
 	   	}
 	   	else if( in_array(0, $receiver_ids_array) && count($receiver_ids_array) == 1 )
 	   	{
 	   		$messages->successMsg .= "Mail has been sent to ilook Administrator.";
 	   	}
 	   	else
 	   	{
 	   		$messages->successMsg .= "Mail sent.";
 	   	}
 	   	

		die;
    }

	/**
	 * @throws Exception
	 * @throws Zend_Exception
	 */
    public function sendRplyMailAction()
    {
    	// action body
    	$zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
    	$allParams = $this->getRequest()->getParams();
    	// unserailise form data
    	parse_str($allParams['str'],$params);
    	$attachments = isset($allParams['temp_path_info_arr']) ? $allParams['temp_path_info_arr'] :NULL;
    	$senderID = Auth_UserAdapter::getIdentity()->getId();
    	$receiverId = $params['receiver_idss'];
    	$subjects 	= $zend_filter_obj->filter( $params['subjects'] );
    	$msageId 	= \Extended\message::addMessage($subjects, $params['message_bodys'], $senderID, $params['receiver_idss'],$params['msg_type']);

		if ($msageId)
		{
			foreach($params['receiver_idss'] as $key=>$reciverID)
			{

				//$key = 0 condition is removed because it is not sending reply to multiple users.
				$msguser = \Extended\message_user::addMessageUsers(@$senderID, @$reciverID, $msageId, 12);

					if ($msguser)
					{
							//get folder id for sender and receiver + two enteries for message folder
							$Receiver_folder_id = \Extended\user_folder::getUserFolder($reciverID, \Extended\folder::FOLDER_INBOX);
							$sender_folder_id = \Extended\user_folder::getUserFolder($senderID, \Extended\folder::FOLDER_SENT_ITEMS);
							if($sender_folder_id)
							{
								if($key == 0)
								{
									\Extended\message_folder::addMessageStatus($msageId, $msguser, $sender_folder_id);
								}
							}
							
							if($Receiver_folder_id)
							{
								\Extended\message_folder::addMessageStatus($msageId, $msguser, $Receiver_folder_id);

							}

					}

			}
			//saving attachments in specific directories and making entry in message attachment table.
			$em = \Zend_Registry::get('em');
			$em->clear();
			$messageObj = \Extended\message::getRowObject($msageId);
			if ($messageObj)
			{
				if ($messageObj->getMessagesMessage_folder())
				{
					foreach ($messageObj->getMessagesMessage_folder() as $msg_fldr)
					{
						// directory naming is according to message id and users' inbox id(user_folder_id)

						// If already inbox ID
						if (\Extended\user_folder::getRowObject(
										 $msg_fldr->getMessage_foldersUser_folder()->getId())
										->getUser_foldersFolder()->getId()  == Extended\folder::FOLDER_INBOX)
						{
							$user_inbox_id = $msg_fldr->getMessage_foldersUser_folder()->getId();
						}
						else
						{
							$user_inbox_id = \Extended\user_folder::getUserInboxIdByUserFolderId($msg_fldr->getMessage_foldersUser_folder()->getId());
						}

						$imail_folder = REL_IMAIL_ATTACHMENT_PATH."\\imail_".$msg_fldr->getMessage_foldersMessage()->getId()."_".$user_inbox_id;

						// Add entry to attachment table.
						// case when attachment is present.
						if ($attachments && $msageId)
						{
							foreach($attachments as $key => $attachment)
							{
								//moves uploaded files from temporary location to permanent loaction.
								$temp_file_name = REL_IMAIL_ATTACHMENT_PATH."\\temp\\reply\\user_".$senderID."\\".$attachment['ts_file_name'];

								if ( !file_exists( $imail_folder ) )
								{
									mkdir( $imail_folder, 0777, true );
								}

								// copy temp file to user folder
								copy($temp_file_name, $imail_folder."\\".$attachment['ts_file_name']);

								// attachment file name with location
								$message_info['attachment_file_name'][$key] = $imail_folder."\\".$attachment['ts_file_name'];

							}
						}
					}

					if( $attachments && $msageId )
					{
						foreach($attachments as $key => $attachment)
						{
							// get actual file name
							$attachment['ts_actual_file_name'] = Helper_common::removeTimestampFromFilename($attachment['ts_file_name']);

							// add attachment entry to database
							$result = \Extended\message_attachment::addMessageAttachment($msageId, $attachment);
						}
					}
					//Remove the temp imails dir for the user's imails attachments.
					Helper_common::deleteDir(SERVER_PUBLIC_PATH.'/imails/temp/reply/user_' . $senderID);
				}
			}

			echo Zend_Json::encode('success');
		}
     die;
    }
    
    /**
     * In compose mail, for token input
     * it gets the params, searches and 
     * matches the entered
     * keyword with the links of a
     * logged-in user who are also in lucene
     * files 
     * Returns Json of user info
     *@author RSHARMA
     *
     */
    public function getMyMatchingContactsAction()
    {
    	// action body
    	$params = $this->getRequest()->getParams();
    	$params['keyword'] = $params['q'];
    	
    	$getContacts = \Extended\ilook_user::getMatchingContacts( $params['keyword'],
			Auth_UserAdapter::getIdentity()->getLink_list() );

    	$Json_arr = array();
    	
    	if( $getContacts )
    	{	
    		$i = 0;
	    	foreach($getContacts as $contact)
	    	{
	    		$Json_arr[$i]['id'] = $contact->getId();
	    		$Json_arr[$i]['first_name'] = $contact->getFirstname();
	    		$Json_arr[$i]['last_name'] = $contact->getLastname();
	    		$Json_arr[$i]['email'] = $contact->getEmail();
	    		$Json_arr[$i]['url'] = Helper_common::getUserProfessionalPhoto($contact->getId(), 3);
	    		$i++ ;
	    	}
    	}
    	
    	if($Json_arr)
    	{
    		$json_response = Zend_Json::encode($Json_arr);
    	}
    	else
    	{
    		$json_response = Zend_Json::encode($Json_arr);
    	}	
    	echo $json_response;
    	die;
    }

    /**
     * Returns all necessary data for message detail
     * for logged in user.
     * handles ajax call.
     *
     * marks msg as read.
     *
     * @author jsingh7
	 * @author sjaiswal [todo What you have added in this function?]
     * @return json
     * @version 1.1
     *
     */
    public function getMsgDetailAction()
    {
    	$current_user = Auth_UserAdapter::getIdentity()->getId();
    	//Users blocked by current user or blocked current user.
    	$blocked_profiles = \Extended\blocked_users::getAllBlockersAndBlockedUsers($current_user);
    	
    	$detail = Extended\message::getMessageDetails( $this->getRequest()->getParam("message_id") );

      	$mail_detail 				= array();
    	$mail_detail['msg_id'] 		= $detail[0]['id'];
    	$mail_detail['subject'] 	= $detail[0]['subject'];
    	$mail_detail['contents'] 	= $detail[0]['contents'];
    	$mail_detail['msg_type'] 	= $detail[0]['type'];
    	
    	$mail_detail['nail_thumbs_exist'] = 1;//todo Please add description.
    	if($detail[0]['wallpost_id'])
    	{
	    	if(\Extended\wall_post::getRowObject($detail[0]['wallpost_id']))
	    	{
	    		$mail_detail['nail_thumbs_exist'] = 1;
	    	}
	    	else
	    	{
	    		$mail_detail['nail_thumbs_exist'] = 0;
	    	}
    	}
    	
    	if($detail[0]['enquiry_id'])
    	{
    		$mail_detail['enquiry_id'] = $detail[0]['enquiry_id'];
    	}
    	
    	$mail_detail['hide_reply_forward_opt'] = $detail[0]['hide_reply_forward_opt'];
    	$mail_detail['type'] = $detail[0]['type'];
    	$mail_detail['created_at_date'] = $detail[0]['created_at']?$detail[0]['created_at']->format( "M j, Y" ):"";
    	$mail_detail['created_at_time'] = $detail[0]['created_at']->format( "H:i" );
    	$mail_detail['final_date_time'] = "On ".$detail[0]['created_at']->format( "jS F Y, g:i A" );
    	$mail_detail['msg_sender_id'] = $detail[0]['msg_sender_id'];
    	$mail_detail['msg_receiver_id'] = $detail[0]['msg_receiver_id'];
    	$mail_detail['sender_firstname'] = $detail[0]['sender_firstname'];
    	$mail_detail['sender_lastname'] = $detail[0]['sender_lastname'];
    	
    	if(Auth_UserAdapter::getIdentity())
    	{
    		$mail_detail['login_user_email'] = Auth_UserAdapter::getIdentity()->getEmail();
    	}
    	$receiver = array();

		if($detail[0][0]->getMessagesMessage_user())
		{
			foreach ($detail[0][0]->getMessagesMessage_user() as $message_user)
			{
				$receiver[]=$message_user->getMessage_usersRecieverUser()->getFirstname().' '.$message_user->getMessage_usersRecieverUser()->getLastname();
			}
		}
    	for($i=0; $i<count($detail); $i++)
    	{

    	}
    	$receiverString=implode(", ", $receiver);
    	$mail_detail['reciever_names'] = $receiverString;
    	
    	if($blocked_profiles)
    	{
	    	//Checking if sender is in blocked profiles then setting prof_image as default.
	    	if( in_array($mail_detail['msg_sender_id'], $blocked_profiles))
	    	{
		    	//setting image for user. So that there would be no need to apply conditions on json.
		    	$mail_detail['sender_prof_image'] = Helper_common::getUserProfessionalPhoto($mail_detail['msg_sender_id'], 3, false, $blocked_profiles);
	    	}
	    	else
	    	{
	    		//setting image for user. So that there would be no need to apply conditions on json.
	    		$mail_detail['sender_prof_image'] = Helper_common::getUserProfessionalPhoto($mail_detail['msg_sender_id'], 3);
	    	}
    	}
    	else
    	{
    		//setting image for user. So that there would be no need to apply conditions on json.
    		$mail_detail['sender_prof_image'] = Helper_common::getUserProfessionalPhoto($mail_detail['msg_sender_id'], 3);
    	}
    	
    	// settings for displaying reply or not
		$mail_detail['can_reply'] = 1;
			
		//Check if user blocked and vice versa, also check if sender has been removed/deleted permanently
		// or reply is not allowed for this msg in database.
		$em = \Zend_Registry::get('em');
		$em->clear();
		//todo Please add desc here.
		if( \Extended\blocked_users::checkIfBlocked( $detail[0]['msg_receiver_id'],$detail[0]['msg_sender_id'] )
				|| \Extended\blocked_users::checkIfBlocked( $detail[0]['msg_sender_id'],$detail[0]['msg_receiver_id'] )
				|| ! \Extended\ilook_user::getRowObjectAdvanced( $detail[0]['msg_sender_id'] )
				|| $detail[0]['hide_reply_forward_opt']
				|| $detail[0]['sender_account_closed_on'] != null
		)
		{
			$mail_detail['can_reply'] = 0;
		}
    	
		$mail_detail['can_forward'] = 1;
    	//Check if forward option is disabled for msg.
    	if( $detail[0]['hide_reply_forward_opt'] || $detail[0]['type'] == Extended\message::MSG_TYPE_ENQUIRY)
    	{
    		$mail_detail['can_forward'] = 0;
    	}
    	
    	//Checking for attachments
    	$mail_detail['has_attachements'] 			= 0;
    	if( $detail[0][0]->getMessageMessage_attachment()->count() ){
	    	
	    	$mail_detail['has_attachements'] 			= 1;
	    	$mail_detail['num_of_attachements'] 		= $detail[0][0]->getMessageMessage_attachment()->count();
	    	
	    	foreach ( $detail[0][0]->getMessageMessage_attachment() as $key=>$attachemnt){
	    		
		    	$mail_detail['attachments'][$key]['name'] 		= $attachemnt->getName();
		    	$mail_detail['attachments'][$key]['actual_name']= $attachemnt->getActual_name();
		    	$mail_detail['attachments'][$key]['ext'] 		= pathinfo( $attachemnt->getName(), PATHINFO_EXTENSION );
		    	$mail_detail['attachments'][$key]['size'] 		= $attachemnt->getSize();
	    	}
    	}
		$mail_detail['folder_id'] = \Extended\user_folder::getUserFolder( Auth_UserAdapter::getIdentity()->getId(), \Extended\folder::FOLDER_INBOX );

		//Marking msg as read.
		\Extended\message_folder::MarkReadUnreadMessage( $this->getRequest()->getParam("message_id"), $mail_detail['folder_id'], \Extended\message_folder::MARK_AS_READ );
    	echo Zend_Json::encode( $mail_detail );
    	die;
    }
    
    
    /**
     * Returns all necessary data for message detail
     * in case of msg type enquiry.
     * handles ajax call.
     *
     *
     * @author jsingh7,sjaiswal
     * @return json
     * @version 1.1
     *
     */
    public function getEnquiryMsgDetailAction()
    {
    	//Zend_Debug::dump($this->getRequest()->getParams()); die();
    	$current_user = Auth_UserAdapter::getIdentity()->getId();
    	//Users blocked by current user or blocked current user.
    	$blocked_profiles = \Extended\blocked_users::getAllBlockersAndBlockedUsers($current_user);

    	if($this->getRequest()->getParam("msgId_OR_enquiryId"))
    	{
    	$detail = Extended\message::getEnquiryMessageDetails( $this->getRequest()->getParam("msgId_OR_enquiryId"),
    												 		  $this->getRequest()->getParam("checkType"));
    	}
    	
    	$mail_detail = array();
    	$mail_detail['msg_id'] = $detail[0]['id'];
    	$mail_detail['subject'] = $detail[0]['subject'];
    	//$mail_detail['contents'] = strip_tags($detail[0]['contents'], '\n');
    	$mail_detail['contents'] = $detail[0]['contents'];
    	$mail_detail['msg_type'] = $detail[0]['type'];
    
    	$mail_detail['type'] = $detail[0]['type'];
    	$mail_detail['created_at_date'] = $detail[0]['created_at']->format( "M j, Y" );
    	$mail_detail['created_at_time'] = $detail[0]['created_at']->format( "H:i" );
    	$mail_detail['final_date_time'] = "On ".$detail[0]['created_at']->format( "jS F Y, g:i A" );
    	$mail_detail['sender_firstname'] = $detail[0]['sender_firstname'];
    	$mail_detail['sender_lastname'] = $detail[0]['sender_lastname'];
    	
    	echo Zend_Json::encode( $mail_detail );
    	die;
    }

    public function sentItemsAction()
    {
        // action body
    }

    /**
     * Returns all necessary data for inbox listing
     * for logged in user.
     * handles ajax call.
     * 
     * @author jsingh7
     * @return json
     * @version 1.0
     * 
     */
    public function getMySentItemsAction()
    {
    	$sent_mail_detail_array = array();
    	$page = $this->getRequest()->getParam( 'page' );
    	$cur_page = $page;
    	$page -= 1;
    	$per_page = 8;
    	$previous_btn = true;
    	$next_btn = true;
    	$first_btn = true;
    	$last_btn = true;
    	$start = $page * $per_page;

    	$my_sent_messages = Extended\message::getSentItemsOfUser( Auth_UserAdapter::getIdentity()->getId(), $per_page, $start, Extended\message::MSG_TYPE_GENERAL );
    	$sent_mail_detail_array = $my_sent_messages;
    	foreach ( $sent_mail_detail_array as $key=>$msgs )
    	{
    		//setting image for user. So that there would be no need to apply conditions on json.
    		$sent_mail_detail_array[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['msg_sender_id'], 3);
    			
    		// setting datetime. So that there is no need to apply funtions for datetime in json.
    		$sent_mail_detail_array[$key]['created_at'] = Helper_common::nicetime( $msgs['created_at']->format( "Y-m-d H:i:s" ) );

    		$sent_mail_detail_array[$key]['sender_id'] = $msgs['msg_sender_id'];
    		$sent_mail_detail_array[$key]['sender_firstname'] = $msgs['sender_firstname'];
    		$sent_mail_detail_array[$key]['sender_lastname'] = $msgs['sender_lastname'];
    		$sent_mail_detail_array[$key]['content'] = strip_tags($msgs['contents']);
    	}    	
    	
    	
    	$my_sent_messages_for_count = Extended\message::getSentItemsOfUser( Auth_UserAdapter::getIdentity()->getId(), null, 0, Extended\message::MSG_TYPE_GENERAL );
    	$count = count($my_sent_messages_for_count);
    	$no_of_paginations = ceil($count / $per_page);
    	 
    	/* ---------------Calculating the starting and ending values for the loop----------------------------------- */
    	if ($cur_page >= 7) 
    	{
    		$start_loop = $cur_page - 3;
    		if ($no_of_paginations > $cur_page + 3)
    			$end_loop = $cur_page + 3;
    		else if ($cur_page <= $no_of_paginations && $cur_page > $no_of_paginations - 6) {
    			$start_loop = $no_of_paginations - 6;
    			$end_loop = $no_of_paginations;
    		} else {
    			$end_loop = $no_of_paginations;
    		}
    	} 
    	else 
    	{
    		$start_loop = 1;
    		if ($no_of_paginations > 7)
    			$end_loop = 7;
    		else
    			$end_loop = $no_of_paginations;
    	}
    	/* ----------------------------------------------------------------------------------------------------------- */
    	$msg = "";
    	$msg .= "<div class='pagination mail-all-hdr'><ul>";
    	 
        	// FOR ENABLING THE FIRST BUTTON
    	if ($first_btn && $cur_page > 1) {
    		$msg .= "<li p='1' class='active' title=First> << </li>";
    	} else if ($first_btn) {
    		$msg .= "<li p='1' class='inactive' title=First> << </li>";
    	}
		
    	// FOR ENABLING THE PREVIOUS BUTTON
    	if ($previous_btn && $cur_page > 1) {
    		$pre = $cur_page - 1;
    		$msg .= "<li p='$pre' class='active'title=Previous> < </li>";
    	} else if ($previous_btn) {
    		$msg .= "<li class='inactive' title=Previous> < </li>";
    	}

    	
    	// TO ENABLE THE NEXT BUTTON
    	if ($next_btn && $cur_page < $no_of_paginations) {
    		$nex = $cur_page + 1;
    		$msg .= "<li p='$nex' class='active' title=Next> > </li>";
    	} else if ($next_btn) {
    		$msg .= "<li class='inactive' title=Next> > </li>";
    	}
    	
    	// TO ENABLE THE END BUTTON
    	if ($last_btn && $cur_page < $no_of_paginations)
    	 {
    	  $msg .= "<li p='$no_of_paginations' class='active' title=Last> >> </li>";
    	 } 
    	 else if ($last_btn) 
    	 {
    	  $msg .= "<li p='$no_of_paginations' class='inactive' title=Last> >> </li>";
    	 }
    
    	$total_string = "<div class='total' a='$no_of_paginations'>Page <b>" . $cur_page . "</b> of <b>$no_of_paginations</b></div>";
    	$goto = "<div class = 'goTo'><input type='text' class='goto' size='1' style='margin-top:-1px;'/><input type='button' id='go_btn' class='go_button' value='Go'/></div>";
    	$msg = $msg . "</ul>"  . $total_string ."</div>";  // Content for pagination
    	 
    	//Pagination merged with data array.
    	$ret_array = array();
    	$ret_array['records'] = $sent_mail_detail_array;
    	$ret_array['pagination'] = $msg;
    	echo Zend_Json::encode( $ret_array );
    	die;
    }

    public function getMySearchedSentItemsAction()
    {
    	$page = $this->getRequest()->getParam( 'page' );
    	$search_text = $this->getRequest()->getParam('search_text');
    	$cur_page = $page;
    	$page -= 1;
    	$per_page = 8;
    	$previous_btn = true;
    	$next_btn = true;
    	$first_btn = true;
    	$last_btn = true;
    	$start = $page * $per_page;
    	
    	$my_searched_sent_messages = Extended\message::getSearchedSentItemsOfUser( Auth_UserAdapter::getIdentity()->getId(), $search_text, $per_page, $start, Extended\message::MSG_TYPE_GENERAL );
    	$my_searched_sent_messages_r = array();
    	foreach ( $my_searched_sent_messages as $key=>$msgs )
    	{
    		//setting image for user. So that there would be no need to apply conditions on json.
    		$my_searched_sent_messages_r[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['sclr5'], 3);
    		 
    		// setting datetime. So that there is no need to apply funtions for datetime in json.
    		$temp = explode(".", $msgs['created_at4']);
    		$dateTimeObj = \datetime::createfromformat('Y-m-d H:i:s', $temp[0] );
    		$my_searched_sent_messages_r[$key]['created_at'] = Helper_common::nicetime( $dateTimeObj->format( "Y-m-d H:i:s" ) );
    	
    		$my_searched_sent_messages_r[$key]['sender_id'] = $msgs['sclr5'];
    		$my_searched_sent_messages_r[$key]['sender_firstname'] = $msgs['sclr7'];
    		$my_searched_sent_messages_r[$key]['sender_lastname'] = $msgs['sclr8'];
    		$my_searched_sent_messages_r[$key]['subject'] = $msgs['subject1'];
    		$my_searched_sent_messages_r[$key]['content'] = $msgs['contents2'];
    		$my_searched_sent_messages_r[$key]['id'] = $msgs['id0'];
    	}
    	
    	$my_searched_sent_messages_for_count = Extended\message::getSearchedSentItemsOfUser(Auth_UserAdapter::getIdentity()->getId(), $search_text, null, 0, Extended\message::MSG_TYPE_GENERAL );
    	$count = count($my_searched_sent_messages_for_count);
    	$no_of_paginations = ceil($count / $per_page);
    	
    	/* ---------------Calculating the starting and ending values for the loop----------------------------------- */
    	if ($cur_page >= 7) {
    		$start_loop = $cur_page - 3;
    		if ($no_of_paginations > $cur_page + 3)
    			$end_loop = $cur_page + 3;
    		else if ($cur_page <= $no_of_paginations && $cur_page > $no_of_paginations - 6) {
    			$start_loop = $no_of_paginations - 6;
    			$end_loop = $no_of_paginations;
    		} else {
    			$end_loop = $no_of_paginations;
    		}
    	} else {
    		$start_loop = 1;
    		if ($no_of_paginations > 7)
    			$end_loop = 7;
    		else
    			$end_loop = $no_of_paginations;
    	}
    	/* ----------------------------------------------------------------------------------------------------------- */
    	$msg = "";
    	$msg .= "<div class='pagination mail-all-hdr'><ul>";
    	 
       	// FOR ENABLING THE FIRST BUTTON
    	if ($first_btn && $cur_page > 1) {
    		$msg .= "<li p='1' class='active' title=First> << </li>";
    	} else if ($first_btn) {
    		$msg .= "<li p='1' class='inactive' title=First> << </li>";
    	}
    	
    	// FOR ENABLING THE PREVIOUS BUTTON
    	if ($previous_btn && $cur_page > 1) {
    		$pre = $cur_page - 1;
    		$msg .= "<li p='$pre' class='active'title=Previous> < </li>";
    	} else if ($previous_btn) {
    		$msg .= "<li class='inactive' title=Previous> < </li>";
    	}

    	
    	// TO ENABLE THE NEXT BUTTON
    	if ($next_btn && $cur_page < $no_of_paginations) {
    		$nex = $cur_page + 1;
    		$msg .= "<li p='$nex' class='active' title=Next> > </li>";
    	} else if ($next_btn) {
    		$msg .= "<li class='inactive' title=Next> > </li>";
    	}
    	
    	// TO ENABLE THE END BUTTON
    	if ($last_btn && $cur_page < $no_of_paginations)
    	 {
    	  $msg .= "<li p='$no_of_paginations' class='active' title=Last> >> </li>";
    	 } 
    	 else if ($last_btn) 
    	 {
    	  $msg .= "<li p='$no_of_paginations' class='inactive' title=Last> >> </li>";
    	 }
    	
    	$total_string = "<div class='total' a='$no_of_paginations'>Page <b>" . $cur_page . "</b> of <b>$no_of_paginations</b></div>";
    	$goto = "<div class = 'goTo'><input type='text' class='goto' size='1' style='margin-top:-1px;'/><input type='button' id='go_btn' class='go_button' value='Go'/></div>";
    	$msg = $msg . "</ul>"  . $total_string . "</div>";  // Content for pagination
    	 
    	//Pagination merged with data array.
    	$ret_array = array();
    	$ret_array['records'] = $my_searched_sent_messages_r;
    	$ret_array['pagination'] = $msg;
    	echo Zend_Json::encode( $ret_array );
    	die;
    }
    
    public function getMyLinksAction()
    {
    	$links_obj = Extended\ilook_user::getLinksOfUser( Auth_UserAdapter::getIdentity()->getId() );
    	$contacts_r = array();
    	foreach ( $links_obj as $key=>$lk )
    	{
    		$contacts_r[$key]['user_id'] = $lk->getId();
    		$contacts_r[$key]['first_name'] = $lk->getFirstname();
    		$contacts_r[$key]['last_name'] = $lk->getLastname();
    		$contacts_r[$key]['email'] = $lk->getEmail();
    		$contacts_r[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($lk->getId(), 3);
    	}
    	if($contacts_r):
	    	echo Zend_json::encode($contacts_r);
    	else:
	    	echo Zend_json::encode(0);
    	endif;
    	die;
    }

    /**
     * Repond to ajax call after
     * marking message read in
     * message folder table.
     * 
     *  @author jsingh7
     *  @version 1.0
     *
     *
     */
    public function markReadInboxItemAction()
    {
		$msg_ids_r = explode( ",", $this->getRequest()->getParam("msg_ids") );
		$my_folder_id = \Extended\user_folder::getUserFolder( Auth_UserAdapter::getIdentity()->getId(), \Extended\folder::FOLDER_INBOX );
		foreach ( $msg_ids_r as $msg_id )
		{
			\Extended\message_folder::MarkReadUnreadMessage( $msg_id, $my_folder_id, \Extended\message_folder::MARK_AS_READ );
		}
		echo Zend_Json::encode(1);
		die;
    }

    /**
     * Repond to ajax call after
     * marking message unread in
     * message folder table.
     *
     *  @author jsingh7
     *  @version 1.0
     *
     *
     */
    public function markUnreadInboxItemAction()
    {
		$msg_ids_r = explode( ",", $this->getRequest()->getParam("msg_ids") );
		$my_folder_id = \Extended\user_folder::getUserFolder( Auth_UserAdapter::getIdentity()->getId(), \Extended\folder::FOLDER_INBOX );
		foreach ( $msg_ids_r as $msg_id )
		{
			\Extended\message_folder::MarkReadUnreadMessage( $msg_id, $my_folder_id, \Extended\message_folder::MARK_AS_UNREAD );
		}
		echo Zend_Json::encode(1);
		die;
    }

    /**
     * Repond to ajax call after
     * marking message unread in
     * message folder table.
     *
     *  @author jsingh7
     *  @version 1.0
     *
     *
     */
    public function moveMsgToArchiveAction()
    {
		$msg_ids_r = explode( ",", $this->getRequest()->getParam("msg_ids") );
		$my_inbox_folder_id = \Extended\user_folder::getUserFolder( Auth_UserAdapter::getIdentity()->getId(), \Extended\folder::FOLDER_INBOX );
		$my_archive_folder_id = \Extended\user_folder::getUserFolder( Auth_UserAdapter::getIdentity()->getId(), \Extended\folder::FOLDER_ARCHIVE );
		
		foreach ( $msg_ids_r as $msg_id )
		{
			\Extended\message_folder::moveMessageToFolder($my_inbox_folder_id, $msg_id, $my_archive_folder_id);
		}
		echo Zend_Json::encode(1);
		die;
    }

    /**
     * Repond to ajax call after
     * marking message unread in
     * message folder table.
     *
     *  @author Sgandhi
     *  @version 1.0
     *
     */
    public function moveSentMsgToArchiveAction()
    {
		$msg_ids_r = explode( ",", $this->getRequest()->getParam("msg_ids") );
		$my_inbox_folder_id = \Extended\user_folder::getUserFolder( Auth_UserAdapter::getIdentity()->getId(), \Extended\folder::FOLDER_SENT_ITEMS);
		$my_archive_folder_id = \Extended\user_folder::getUserFolder( Auth_UserAdapter::getIdentity()->getId(), \Extended\folder::FOLDER_ARCHIVE );
	
		foreach ( $msg_ids_r as $msg_id )
		{
			\Extended\message_folder::moveMessageToFolder($my_inbox_folder_id, $msg_id, $my_archive_folder_id);
		}
		echo Zend_Json::encode(1);
		die;
    }

    /**
     * Repond to ajax call after
     * marking delete message in
     * message folder table.
     *
     *  @author Sgandhi
     *  @version 1.0
     *
     */
    public function moveInboxMsgToTrashAction()
    {
		$msg_ids_r = explode( ",", $this->getRequest()->getParam("msg_ids") );
		$my_inbox_folder_id = \Extended\user_folder::getUserFolder( Auth_UserAdapter::getIdentity()->getId(), \Extended\folder::FOLDER_INBOX );
		$my_archive_folder_id = \Extended\user_folder::getUserFolder( Auth_UserAdapter::getIdentity()->getId(), \Extended\folder::FOLDER_TRASH );
	
		foreach ( $msg_ids_r as $msg_id )
		{
			\Extended\message_folder::moveMessageToFolder($my_inbox_folder_id, $msg_id, $my_archive_folder_id);
		}
		echo Zend_Json::encode(1);
		die;
    }

    /**
     * Repond to ajax call after
     * marking delete message in
     * message folder table.
     *
     *  @author Sgandhi
     *  @version 1.0
     *
     */
    public function moveSentMsgToTrashAction()
    {
		$msg_ids_r = explode( ",", $this->getRequest()->getParam("msg_ids") );
		$my_inbox_folder_id = \Extended\user_folder::getUserFolder( Auth_UserAdapter::getIdentity()->getId(), \Extended\folder::FOLDER_SENT_ITEMS );
		$my_archive_folder_id = \Extended\user_folder::getUserFolder( Auth_UserAdapter::getIdentity()->getId(), \Extended\folder::FOLDER_TRASH );
	
		foreach ( $msg_ids_r as $msg_id )
		{
			\Extended\message_folder::moveMessageToFolder($my_inbox_folder_id, $msg_id, $my_archive_folder_id);
		}
		echo Zend_Json::encode(1);
		die;
    }

    /**
     * Returns all necessary data for archive listing
     * for logged in user.
     * handles ajax call.
     *
     * @author Sgandhi,sjaiswal
     * @return json
     * @version 1.1
     *
     */
    public function getMyArchiveAction()
    {
		$page = $this->getRequest()->getParam( 'page' );
		$cur_page = $page;
		$page -= 1;
		$per_page = 8;
		$previous_btn = true;
		$next_btn = true;
		$first_btn = true;
		$last_btn = true;
		$start = $page * $per_page;
		 
		$current_user = Auth_UserAdapter::getIdentity()->getId();
		$my_archive_messages = Extended\message::getArchiveOfUser( $current_user, $per_page, $start );
		
		//Users blocked by current user or blocked current user.
		$blocked_profiles = \Extended\blocked_users::getAllBlockersAndBlockedUsers($current_user);
		foreach ( $my_archive_messages as $key=>$msgs )
		{
			if($blocked_profiles)
			{
				//Checking if sender is in blocked profiles then setting prof_image as default.
				if( in_array($msgs['msg_sender_id'], $blocked_profiles))
				{
					$my_archive_messages[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['msg_sender_id'], 3, false, $blocked_profiles);
				}
				else 
				{
					$my_archive_messages[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['msg_sender_id'], 3);
				}
			}
			else 
			{
				$my_archive_messages[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['msg_sender_id'], 3);
			}
			// setting datetime. So that there is no need to apply funtions for datetime in json.
			$my_archive_messages[$key]['created_at'] = Helper_common::nicetime( $msgs['created_at']->format( "Y-m-d H:i:s" ) );
			$my_archive_messages[$key]['content'] = strip_tags($msgs['contents']);
			// settings for displaying reply or not
			$my_archive_messages[$key]['can_reply'] = 1;
			
			//Check if user blocked and vice versa, also check if user has been removed/deleted permanently
			// or reply is not allowed for this msg in database.  
			$em = \Zend_Registry::get('em');
			$em->clear();
			
			if( \Extended\blocked_users::checkIfBlocked( $my_archive_messages[$key]['msg_receiver_id'],$my_archive_messages[$key]['msg_sender_id'] )
				|| \Extended\blocked_users::checkIfBlocked( $my_archive_messages[$key]['msg_sender_id'],$my_archive_messages[$key]['msg_receiver_id'] ) 
				|| ! \Extended\ilook_user::getRowObject( $my_archive_messages[$key]['msg_sender_id'] )
				|| $my_archive_messages[$key]['hide_reply_forward_opt']
				|| $msgs['sender_account_closed_on'] != null
				)
			{
				$my_archive_messages[$key]['can_reply'] = 0;
			}
			
			
			
			$my_archive_messages[$key]['can_forward'] = 1;
			//Check if forward option is disaboled for msg.
			if( $my_archive_messages[$key]['hide_reply_forward_opt'])
			{
				$my_archive_messages[$key]['can_forward'] = 0;
			}
		}
		 
		$my_archive_messages_count = Extended\message::getArchiveCountOfUser( Auth_UserAdapter::getIdentity()->getId() );

		$count = $my_archive_messages_count[0]["num_of_rows"];
		$no_of_paginations = ceil($count / $per_page);
		
		
		/* ------Calculating the starting and ending values for the loop------- */
		if ($cur_page >= 7) 
		{
			$start_loop = $cur_page - 3;
			if ($no_of_paginations > $cur_page + 3)
				$end_loop = $cur_page + 3;
			else if ($cur_page <= $no_of_paginations && $cur_page > $no_of_paginations - 6) 
			{
				$start_loop = $no_of_paginations - 6;
				$end_loop = $no_of_paginations;
			}
			else 
			{
				$end_loop = $no_of_paginations;
			}
		} 
		else 
		{
			$start_loop = 1;
			if ($no_of_paginations > 7)
				$end_loop = 7;
			else
				$end_loop = $no_of_paginations;
		}
		
		/* ----------------------------------------------------------------------------------------------------------- */
		$msg = "";
		$msg .= "<div class='pagination mail-all-hdr'><ul>";
		 
        	// FOR ENABLING THE FIRST BUTTON
    	if ($first_btn && $cur_page > 1) {
    		$msg .= "<li p='1' class='active' title=First> << </li>";
    	} else if ($first_btn) {
    		$msg .= "<li p='1' class='inactive' title=First> << </li>";
    	}
    	
    	// FOR ENABLING THE PREVIOUS BUTTON
    	if ($previous_btn && $cur_page > 1) {
    		$pre = $cur_page - 1;
    		$msg .= "<li p='$pre' class='active'title=Previous> < </li>";
    	} else if ($previous_btn) {
    		$msg .= "<li class='inactive' title=Previous> < </li>";
    	}

    	
    	// TO ENABLE THE NEXT BUTTON
    	if ($next_btn && $cur_page < $no_of_paginations) {
    		$nex = $cur_page + 1;
    		$msg .= "<li p='$nex' class='active' title=Next> > </li>";
    	} else if ($next_btn) {
    		$msg .= "<li class='inactive' title=Next> > </li>";
    	}
    	
    	// TO ENABLE THE END BUTTON
    	if ($last_btn && $cur_page < $no_of_paginations)
    	 {
    	  $msg .= "<li p='$no_of_paginations' class='active' title=Last> >> </li>";
    	 } 
    	 else if ($last_btn) 
    	 {
    	  $msg .= "<li p='$no_of_paginations' class='inactive' title=Last> >> </li>";
    	 }
    	
		$total_string = "<div class='total' a='$no_of_paginations'>Page <b>" . $cur_page . "</b> of <b>$no_of_paginations</b></div>";
		$goto = "<div class = 'goTo'><input type='text' class='goto' size='1' style='margin-top:-1px;'/><input type='button' id='go_btn' class='go_button' value='Go'/></div>";
		$msg = $msg . "</ul>"  . $total_string . "</div>";  // Content for pagination
		 
		// Pagination merged with data array.
		$ret_array = array();
		$ret_array['records'] = $my_archive_messages;
		$ret_array['pagination'] = $msg;
		echo Zend_Json::encode( $ret_array );
		die;
    }
    /**
     * Returns all necessary searched data for archive listing
     * for logged in user.
     * handles ajax call.
     *
     * @author hkaur5
     * @return json
     * @version 1.0
     *
     *
     */
    public function getMySearchedArchiveAction()
    {
    	$search_text = $this->getRequest()->getParam( 'search_text' );
    	$page = $this->getRequest()->getParam( 'page' );
    	$cur_page = $page;
    	$page -= 1;
    	$per_page = 8;
    	$previous_btn = true;
    	$next_btn = true;
    	$first_btn = true;
    	$last_btn = true;
    	$start = $page * $per_page;
    	
    	$current_user = Auth_UserAdapter::getIdentity()->getId();
    	//Users blocked by current user or blocked current user.
    	$blocked_profiles = \Extended\blocked_users::getAllBlockersAndBlockedUsers($current_user);
    	
    	$my_searched_archive_messages = Extended\message::getSearchedArchiveOfUser( $current_user, $search_text, $per_page, $start);

    	$my_searched_archive_messages_r = array();
    	foreach ( $my_searched_archive_messages as $key=>$msgs )
    	{
    		$sender_user_obj = \Extended\ilook_user::getRowObjectAdvanced($msgs['sclr5'], true);
    		$sender_account_closed_on = $sender_user_obj->getAccount_closed_on();

    		$my_searched_archive_messages_r[$key]['id'] = $msgs['id0'];
    		$my_searched_archive_messages_r[$key]['subject'] = $msgs['subject1'];
    		$my_searched_archive_messages_r[$key]['content'] =  strip_tags($msgs['contents2']);
    		$my_searched_archive_messages_r[$key]['sender_firstname'] = $msgs['firstname7'];
    		$my_searched_archive_messages_r[$key]['sender_lastname'] = $msgs['lastname8'];
    		$my_searched_archive_messages_r[$key]['mark_read'] = $msgs['mark_read12'];
    		
    		if($blocked_profiles)
    		{
	    		//Checking if sender is in blocked profiles then setting prof_image as default.
	    		if( in_array($msgs['sclr5'], $blocked_profiles))
	    		{
		    		//setting image for user. So that there would be no need to apply conditions on json.
		    		$my_searched_archive_messages_r[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['sclr5'], 3, false, $blocked_profiles );
	    		}
	    		else 
	    		{
	    			//setting image for user. So that there would be no need to apply conditions on json.
	    			$my_searched_archive_messages_r[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['sclr5'], 3);
	    		}
    		}
    		else 
    		{
    			//setting image for user. So that there would be no need to apply conditions on json.
    			$my_searched_archive_messages_r[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['sclr5'], 3);
    		}
    		// setting datetime. So that there is no need to apply funtions for datetime in json.
    		$temp = explode(".", $msgs['created_at4']);
    		$dateTimeObj = \datetime::createfromformat('Y-m-d H:i:s', $temp[0] );
    		$my_searched_archive_messages_r[$key]['created_at'] = Helper_common::nicetime( $dateTimeObj->format( "Y-m-d H:i:s" ) );
    		
    		// settings for displaying reply or not
    		$my_inbox_messages[$key]['can_reply'] = 1;
    		 
    		 
    		//Check if user blocked and vice versa, also check if user has been removed/deleted permanently
    		// or reply is not allowed for this msg in database.
    		$em = \Zend_Registry::get('em');
    		$em->clear();
    		if( \Extended\blocked_users::checkIfBlocked( $msgs['sclr6'],$msgs['sclr5'] )
    				|| \Extended\blocked_users::checkIfBlocked( $msgs['sclr5'],$msgs['sclr6'] )
    				|| ! \Extended\ilook_user::getRowObject( $msgs['sclr5'] )
    				|| $msgs['hide_reply_forward_opt']
    				|| $sender_account_closed_on != null
    		)
    		{
    			$my_inbox_messages[$key]['can_reply'] = 0;
    		}
    		 
    		$my_inbox_messages[$key]['can_forward'] = 1;
    		//Check if forward option is disaboled for msg.
    		if( $msgs['hide_reply_forward_opt'] )
    		{
    			$my_inbox_messages[$key]['can_forward'] = 0;
    		}
    	}
    	 
    	$my_searched_archive_messages_for_count = Extended\message::getSearchedArchiveOfUser( Auth_UserAdapter::getIdentity()->getId(), $search_text, null, 0);
    	$count = count($my_searched_archive_messages_for_count);
    	 
    	$no_of_paginations = ceil($count / $per_page);
    	
    	/* ---------------Calculating the starting and ending values for the loop----------------------------------- */
    	if ($cur_page >= 7) 
    	{
    		$start_loop = $cur_page - 3;
    		if ($no_of_paginations > $cur_page + 3)
    			$end_loop = $cur_page + 3;
    		else if ($cur_page <= $no_of_paginations && $cur_page > $no_of_paginations - 6) 
    		{
    			$start_loop = $no_of_paginations - 6;
    			$end_loop = $no_of_paginations;
    		} 
    		else 
    		{
    			$end_loop = $no_of_paginations;
    		}
    	} else {
    		$start_loop = 1;
    		if ($no_of_paginations > 7)
    			$end_loop = 7;
    		else
    			$end_loop = $no_of_paginations;
    	}
    	/* ----------------------------------------------------------------------------------------------------------- */
    	$msg = "";
    	$msg .= "<div class='pagination mail-all-hdr'><ul>";
    	
       	// FOR ENABLING THE FIRST BUTTON
    	if ($first_btn && $cur_page > 1) 
    	{
    		$msg .= "<li p='1' class='active' title=First> << </li>";
    	} else if ($first_btn) 
    	{
    		$msg .= "<li p='1' class='inactive' title=First> << </li>";
    	}
    	
    	// FOR ENABLING THE PREVIOUS BUTTON
    	if ($previous_btn && $cur_page > 1) 
    	{
    		$pre = $cur_page - 1;
    		$msg .= "<li p='$pre' class='active'title=Previous> < </li>";
    	} 
    	else if ($previous_btn) 
    	{
    		$msg .= "<li class='inactive' title=Previous> < </li>";
    	}

    	
    	// TO ENABLE THE NEXT BUTTON
    	if ($next_btn && $cur_page < $no_of_paginations) {
    		$nex = $cur_page + 1;
    		$msg .= "<li p='$nex' class='active' title=Next> > </li>";
    	} else if ($next_btn) {
    		$msg .= "<li class='inactive' title=Next> > </li>";
    	}
    	
    	// TO ENABLE THE END BUTTON
    	if ($last_btn && $cur_page < $no_of_paginations)
    	 {
    	  $msg .= "<li p='$no_of_paginations' class='active' title=Last> >> </li>";
    	 } 
    	 else if ($last_btn) 
    	 {
    	  $msg .= "<li p='$no_of_paginations' class='inactive' title=Last> >> </li>";
    	 }
    	
    	$total_string = "<div class='total' a='$no_of_paginations'>Page <b>" . $cur_page . "</b> of <b>$no_of_paginations</b></div>";
    	
    	$msg = $msg . "</ul>"  . $total_string . "</div>";  // Content for pagination
    	
    	//Pagination merged with data array.
    	$ret_array = array();
    	$ret_array['records'] = $my_searched_archive_messages_r;
    	$ret_array['pagination'] = $msg;
    	echo Zend_Json::encode( $ret_array );
    	die;
    }
    
    /**
     * Returns all necessary 
     * data for link request listing in inbox for logged in user.
     * handles ajax call.
     * 
     * @author jsingh7
     * @return json
     * @version 1.0
     * 
     *
     */
    public function getMyLinkRequestsAction()
    {
    	$page = $this->getRequest()->getParam( 'page' );
    	$cur_page = $page;
    	$page -= 1;
    	$per_page = 8;
    	$previous_btn = true;
    	$next_btn = true;
    	$first_btn = true;
    	$last_btn = true;
    	$start = $page * $per_page;
    	$msg_type = array(Extended\message::MSG_TYPE_LINK_REQ);
    	$my_inbox_link_req_messages = Extended\message::getInboxOfUser( Auth_UserAdapter::getIdentity()->getId(), $per_page, $start, $msg_type );
			
    	//Users blocked by current user or blocked current user.
    	$blocked_profiles = \Extended\blocked_users::getAllBlockersAndBlockedUsers(Auth_UserAdapter::getIdentity()->getId());
    	foreach ( $my_inbox_link_req_messages as $key=>$msgs )
    	{
    		if($blocked_profiles)
    		{
	    		//Checking if sender is in blocked profiles then setting prof_image as default.
	    		if( in_array($msgs['msg_sender_id'], $blocked_profiles))
	    		{
		    		//setting image for user. So that there would be no need to apply conditions on json.
		    		$my_inbox_link_req_messages[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['msg_sender_id'], 3, false, $blocked_profiles );
	    		}
	    		else
	    		{
	    			//setting image for user. So that there would be no need to apply conditions on json.
	    			$my_inbox_link_req_messages[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['msg_sender_id'], 3);
	    		}
    		}
    		else
    		{
    			//setting image for user. So that there would be no need to apply conditions on json.
    			$my_inbox_link_req_messages[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['msg_sender_id'], 3);
    		}
    		
    		
    		// setting datetime. So that there is no need to apply funtions for datetime in json.
    		$my_inbox_link_req_messages[$key]['created_at'] = Helper_common::nicetime( $msgs['created_at']->format( "Y-m-d H:i:s" ) );
    	}
    	 
    	$my_inbox_messages_count = Extended\message::getInboxCountOfUser( Auth_UserAdapter::getIdentity()->getId(), Extended\message::MSG_TYPE_LINK_REQ );
    	$count = $my_inbox_messages_count[0]["num_of_rows"];
    	$no_of_paginations = ceil($count / $per_page);
    	 
    	/* ---------------Calculating the starting and ending values for the loop----------------------------------- */
    	if ($cur_page >= 7) {
    		$start_loop = $cur_page - 3;
    		if ($no_of_paginations > $cur_page + 3)
    			$end_loop = $cur_page + 3;
    		else if ($cur_page <= $no_of_paginations && $cur_page > $no_of_paginations - 6) {
    			$start_loop = $no_of_paginations - 6;
    			$end_loop = $no_of_paginations;
    		} else {
    			$end_loop = $no_of_paginations;
    		}
    	} else {
    		$start_loop = 1;
    		if ($no_of_paginations > 7)
    			$end_loop = 7;
    		else
    			$end_loop = $no_of_paginations;
    	}
    	/* ----------------------------------------------------------------------------------------------------------- */
    	$msg = "";
    	$msg .= "<div class='pagination mail-all-hdr'><ul>";
    	 
       	// FOR ENABLING THE FIRST BUTTON
    	if ($first_btn && $cur_page > 1) {
    		$msg .= "<li p='1' class='active' title=First> << </li>";
    	} else if ($first_btn) {
    		$msg .= "<li p='1' class='inactive' title=First> << </li>";
    	}
    	
    	// FOR ENABLING THE PREVIOUS BUTTON
    	if ($previous_btn && $cur_page > 1) {
    		$pre = $cur_page - 1;
    		$msg .= "<li p='$pre' class='active'title=Previous> < </li>";
    	} else if ($previous_btn) {
    		$msg .= "<li class='inactive' title=Previous> < </li>";
    	}

    	
    	// TO ENABLE THE NEXT BUTTON
    	if ($next_btn && $cur_page < $no_of_paginations) {
    		$nex = $cur_page + 1;
    		$msg .= "<li p='$nex' class='active' title=Next> > </li>";
    	} else if ($next_btn) {
    		$msg .= "<li class='inactive' title=Next> > </li>";
    	}
    	
    	// TO ENABLE THE END BUTTON
    	if ($last_btn && $cur_page < $no_of_paginations)
    	 {
    	  $msg .= "<li p='$no_of_paginations' class='active' title=Last> >> </li>";
    	 } 
    	 else if ($last_btn) 
    	 {
    	  $msg .= "<li p='$no_of_paginations' class='inactive' title=Last> >> </li>";
    	 }
    	
    	$total_string = "<div class='total' a='$no_of_paginations'>Page <b>" . $cur_page . "</b> of <b>$no_of_paginations</b></div>";
    	$goto = "<div class = 'goTo'><input type='text' class='goto' size='1' style='margin-top:-1px;'/><input type='button' id='go_btn' class='go_button' value='Go'/></div>";
    	$msg = $msg . "</ul>"  . $total_string ."</div>";  // Content for pagination
    		
    	//Pagination merged with data array.
    	$ret_array = array();
    	$ret_array['records'] = $my_inbox_link_req_messages;
    	$ret_array['pagination'] = $msg;
    	echo Zend_Json::encode( $ret_array );
    	die;
    }
    /**
     * Returns all necessary searched data for link requests mails listing
     * for logged in user.
     * handles ajax call.
     *
     * @author hkaur5
     * @return json
     * @version 1.0
     *
     *
     */
    public function getMySearchedLinkRequestsAction()
    {
    	$search_text = $this->getRequest()->getParam( 'search_text' );
    	$page = $this->getRequest()->getParam( 'page' );
    	$cur_page = $page;
    	$page -= 1;
    	$per_page = 8;
    	$previous_btn = true;
    	$next_btn = true;
    	$first_btn = true;
    	$last_btn = true;
    	$start = $page * $per_page;
    
    	$current_user = Auth_UserAdapter::getIdentity()->getId();
    	//Users blocked by current user or blocked current user.
    	$blocked_profiles = \Extended\blocked_users::getAllBlockersAndBlockedUsers($current_user);
    	
    	$my_inbox_messages = Extended\message::getSearchedInboxOfUser( $current_user, $search_text, $per_page, $start, Extended\message::MSG_TYPE_LINK_REQ );
		$my_inbox_messages_r = array();
    	foreach ( $my_inbox_messages as $key=>$msgs )
    	{
    		$my_inbox_messages_r[$key]['id'] = $msgs['id0'];
    		$my_inbox_messages_r[$key]['subject'] = $msgs['subject1'];
    		$my_inbox_messages_r[$key]['content'] = $msgs['contents2'];
    		$my_inbox_messages_r[$key]['sender_firstname'] = $msgs['firstname8'];
    		$my_inbox_messages_r[$key]['sender_lastname'] = $msgs['lastname9'];
    		$my_inbox_messages_r[$key]['mark_read'] = $msgs['mark_read13'];
    		
    		if($blocked_profiles)
    		{
    			//Checking if sender is in blocked profiles then setting prof_image as default.
    			if( in_array($msgs['sclr6'], $blocked_profiles))
    			{
		    		//setting image for user. So that there would be no need to apply conditions on json.
		    		$my_inbox_messages_r[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['sclr6'], 3, false, $blocked_profiles);
    			}
    			else
    			{
    				//setting image for user. So that there would be no need to apply conditions on json.
    				$my_inbox_messages_r[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['sclr6'], 3);
    			}	
    		}
    		else 
    		{
    			//setting image for user. So that there would be no need to apply conditions on json.
    			$my_inbox_messages_r[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['sclr6'], 3);
    		}
    		// setting datetime. So that there is no need to apply funtions for datetime in json.
    		$temp = explode(".", $msgs['created_at5']);
    		$dateTimeObj = \datetime::createfromformat('Y-m-d H:i:s', $temp[0] );
    		$my_inbox_messages_r[$key]['created_at'] = Helper_common::nicetime( $dateTimeObj->format( "Y-m-d H:i:s" ) );
    	}
    	
    	$my_inbox_messages_for_count = Extended\message::getSearchedInboxOfUser( Auth_UserAdapter::getIdentity()->getId(), $search_text, null, 0, Extended\message::MSG_TYPE_LINK_REQ );
    	$count = count($my_inbox_messages_for_count);
    	
    	$no_of_paginations = ceil($count / $per_page);
    	 
    	/* ---------------Calculating the starting and ending values for the loop----------------------------------- */
    	if ($cur_page >= 7) {
    		$start_loop = $cur_page - 3;
    		if ($no_of_paginations > $cur_page + 3)
    			$end_loop = $cur_page + 3;
    		else if ($cur_page <= $no_of_paginations && $cur_page > $no_of_paginations - 6) {
    			$start_loop = $no_of_paginations - 6;
    			$end_loop = $no_of_paginations;
    		} else {
    			$end_loop = $no_of_paginations;
    		}
    	} else {
    		$start_loop = 1;
    		if ($no_of_paginations > 7)
    			$end_loop = 7;
    		else
    			$end_loop = $no_of_paginations;
    	}
    	/* ----------------------------------------------------------------------------------------------------------- */
    	$msg = "";
    	$msg .= "<div class='pagination mail-all-hdr'><ul>";
    	
    	
    	// FOR ENABLING THE FIRST BUTTON
    	if ($first_btn && $cur_page > 1) {
    		$msg .= "<li p='1' class='active' title=First> << </li>";
    	} else if ($first_btn) {
    		$msg .= "<li p='1' class='inactive' title=First> << </li>";
    	}
    	 
    	// FOR ENABLING THE PREVIOUS BUTTON
    	if ($previous_btn && $cur_page > 1) {
    		$pre = $cur_page - 1;
    		$msg .= "<li p='$pre' class='active'title=Previous> < </li>";
    	} else if ($previous_btn) {
    		$msg .= "<li class='inactive' title=Previous> < </li>";
    	}
    	
    	// TO ENABLE THE NEXT BUTTON
    	if ($next_btn && $cur_page < $no_of_paginations) {
    		$nex = $cur_page + 1;
    		$msg .= "<li p='$nex' class='active' title=Next> > </li>";
    	} else if ($next_btn) {
    		$msg .= "<li class='inactive' title=Next> > </li>";
    	}
    	 
    	// TO ENABLE THE END BUTTON
    	if ($last_btn && $cur_page < $no_of_paginations)
    	{
    		$msg .= "<li p='$no_of_paginations' class='active' title=Last> >> </li>";
    	}
    	else if ($last_btn)
    	{
    		$msg .= "<li p='$no_of_paginations' class='inactive' title=Last> >> </li>";
    	}
    	 
    	$total_string = "<div class='total' a='$no_of_paginations'>Page <b>" . $cur_page . "</b> of <b>$no_of_paginations</b></div>";
    	 
    	$msg = $msg . "</ul>"  . $total_string ."</div>";  // Content for pagination
    	 
    	//Pagination merged with data array.
    	$ret_array = array();
    	$ret_array['records'] = $my_inbox_messages_r;
    	$ret_array['pagination'] = $msg;
    	echo Zend_Json::encode( $ret_array );
    	die;
    }
    
    /**
     * Returns all necessary
     * data for mail job invitation request listing in inbox for logged in user.
     * handles ajax call.
     *
     * @author nsingh3
     * @return json
     * @version 1.0
     *
     *
     */
    public function getMyJobInvitationRequestsAction()
    {
    	$page = $this->getRequest()->getParam( 'page' );
    	$cur_page = $page;
    	$page -= 1;
    	$per_page = 8;
    	$previous_btn = true;
    	$next_btn = true;
    	$first_btn = true;
    	$last_btn = true;
    	$start = $page * $per_page;

    	$current_user = Auth_UserAdapter::getIdentity()->getId();
    	$msg_type = array(Extended\message::MSG_TYPE_JOB_REQ);
    	$my_inbox_link_req_messages = Extended\message::getInboxOfUser( $current_user, $per_page, $start, $msg_type );

    	//Users blocked by current user or blocked current user.
    	$blocked_profiles = \Extended\blocked_users::getAllBlockersAndBlockedUsers($current_user);
    	
    	foreach ( $my_inbox_link_req_messages as $key=>$msgs )
    	{
    		if($blocked_profiles)
    		{
	    		//Checking if sender is in blocked profiles then setting prof_image as default.
	    		if( in_array($msgs['msg_sender_id'], $blocked_profiles))
	    		{
		    		//setting image for user. So that there would be no need to apply conditions on json.
		    		$my_inbox_link_req_messages[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['msg_sender_id'], 3, false, $blocked_profiles);
	    		}
	    		else
	    		{
	    			//setting image for user. So that there would be no need to apply conditions on json.
	    			$my_inbox_link_req_messages[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['msg_sender_id'], 3);
	    		}
    		}
    		else
    		{
    			//setting image for user. So that there would be no need to apply conditions on json.
    			$my_inbox_link_req_messages[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['msg_sender_id'], 3);
    		}
    		
    		// setting datetime. So that there is no need to apply funtions for datetime in json.
    		$my_inbox_link_req_messages[$key]['created_at'] = Helper_common::nicetime( $msgs['created_at']->format( "Y-m-d H:i:s" ) );
    	}
    
    	$my_inbox_messages_count = Extended\message::getInboxCountOfUser( Auth_UserAdapter::getIdentity()->getId(), Extended\message::MSG_TYPE_JOB_REQ );
    	$count = $my_inbox_messages_count[0]["num_of_rows"];
    	$no_of_paginations = ceil($count / $per_page);
    
    	/* ---------------Calculating the starting and ending values for the loop----------------------------------- */
    	if ($cur_page >= 7) {
    		$start_loop = $cur_page - 3;
    		if ($no_of_paginations > $cur_page + 3)
    			$end_loop = $cur_page + 3;
    		else if ($cur_page <= $no_of_paginations && $cur_page > $no_of_paginations - 6) {
    			$start_loop = $no_of_paginations - 6;
    			$end_loop = $no_of_paginations;
    		} else {
    			$end_loop = $no_of_paginations;
    		}
    	} else {
    		$start_loop = 1;
    		if ($no_of_paginations > 7)
    			$end_loop = 7;
    		else
    			$end_loop = $no_of_paginations;
    	}
    	/* ----------------------------------------------------------------------------------------------------------- */
    	$msg = "";
    	$msg .= "<div class='pagination mail-all-hdr'><ul>";
    
       	// FOR ENABLING THE FIRST BUTTON
    	if ($first_btn && $cur_page > 1) {
    		$msg .= "<li p='1' class='active' title=First> << </li>";
    	} else if ($first_btn) {
    		$msg .= "<li p='1' class='inactive' title=First> << </li>";
    	}
    	
    	// FOR ENABLING THE PREVIOUS BUTTON
    	if ($previous_btn && $cur_page > 1) {
    		$pre = $cur_page - 1;
    		$msg .= "<li p='$pre' class='active'title=Previous> < </li>";
    	} else if ($previous_btn) {
    		$msg .= "<li class='inactive' title=Previous> < </li>";
    	}

    	// TO ENABLE THE NEXT BUTTON
    	if ($next_btn && $cur_page < $no_of_paginations) {
    		$nex = $cur_page + 1;
    		$msg .= "<li p='$nex' class='active' title=Next> > </li>";
    	} else if ($next_btn) {
    		$msg .= "<li class='inactive' title=Next> > </li>";
    	}
    	
    	// TO ENABLE THE END BUTTON
    	if ($last_btn && $cur_page < $no_of_paginations)
    	 {
    	  $msg .= "<li p='$no_of_paginations' class='active' title=Last> >> </li>";
    	 } 
    	 else if ($last_btn) 
    	 {
    	  $msg .= "<li p='$no_of_paginations' class='inactive' title=Last> >> </li>";
    	 }
    	$total_string = "<div class='total' a='$no_of_paginations'>Page <b>" . $cur_page . "</b> of <b>$no_of_paginations</b></div>";
    	$goto = "<div class = 'goTo'><input type='text' class='goto' size='1' style='margin-top:-1px;'/><input type='button' id='go_btn' class='go_button' value='Go'/></div>";
    	$msg = $msg . "</ul>"  . $total_string . "</div>";  // Content for pagination
    
    	//	Pagination merged with data array.
    	$ret_array = array();
    	$ret_array['records'] = $my_inbox_link_req_messages;
    	$ret_array['pagination'] = $msg;
    	echo Zend_Json::encode( $ret_array );
    	die;
    }
    
    /**
     * Returns all necessary searched data for job invitation requests mails listing
     * for logged in user.
     * handles ajax call.
     *
     * @author hkaur5
     * @return json
     * @version 1.0
     *
     */
    public function getMySearchedJobInvitationRequestsAction()
    {
    	$search_text = $this->getRequest()->getParam( 'search_text' );
    	$page = $this->getRequest()->getParam( 'page' );
    	
    	$cur_page = $page;
    	$page -= 1;
    	$per_page = 8;
    	$previous_btn = true;
    	$next_btn = true;
    	$first_btn = true;
    	$last_btn = true;
    	$start = $page * $per_page;
    	$current_user = Auth_UserAdapter::getIdentity()->getId();
    	//Users blocked by current user or blocked current user.
    	$blocked_profiles = \Extended\blocked_users::getAllBlockersAndBlockedUsers($current_user);
    
    	
    	$my_inbox_messages = Extended\message::getSearchedInboxOfUser( $current_user, $search_text, $per_page, $start, Extended\message::MSG_TYPE_JOB_REQ );
    	$my_inbox_messages_r = array();
    	foreach ( $my_inbox_messages as $key=>$msgs )
    	{
    		$my_inbox_messages_r[$key]['id'] = $msgs['id0'];
    		$my_inbox_messages_r[$key]['subject'] = $msgs['subject1'];
    		$my_inbox_messages_r[$key]['contents'] = $msgs['contents2'];
    		$my_inbox_messages_r[$key]['sender_firstname'] = $msgs['firstname8'];
    		$my_inbox_messages_r[$key]['sender_lastname'] = $msgs['lastname9'];
    		$my_inbox_messages_r[$key]['mark_read'] = $msgs['mark_read13'];
    		
    		if($blocked_profiles)
    		{
	    		//Checking if sender is in blocked profiles then setting prof_image as default.
	    		if( in_array($msgs['sclr6'], $blocked_profiles))
	    		{
		    		//setting image for user. So that there would be no need to apply conditions on json.
		    		$my_inbox_messages_r[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['sclr6'], 3, false, $blocked_profiles);
	    		}
	    		else
	    		{
	    			$my_inbox_messages_r[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['sclr6'], 3);
	    		}
    		}
    		else 
    		{
    			$my_inbox_messages_r[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['sclr6'], 3);
    		}
    		// setting datetime. So that there is no need to apply funtions for datetime in json.
    		$temp = explode(".", $msgs['created_at5']);
    		$dateTimeObj = \datetime::createfromformat('Y-m-d H:i:s', $temp[0] );
    		$my_inbox_messages_r[$key]['created_at'] = Helper_common::nicetime( $dateTimeObj->format( "Y-m-d H:i:s" ) );
    	}

    	$my_inbox_messages_for_count = Extended\message::getSearchedInboxOfUser( Auth_UserAdapter::getIdentity()->getId(), $search_text, NULL, 0, Extended\message::MSG_TYPE_JOB_REQ );
     	$count = count($my_inbox_messages_for_count);
    	
    	$no_of_paginations = ceil($count / $per_page);
    
    	/* ---------------Calculating the starting and ending values for the loop----------------------------------- */
    	if ($cur_page >= 7) {
    		$start_loop = $cur_page - 3;
    		if ($no_of_paginations > $cur_page + 3)
    			$end_loop = $cur_page + 3;
    		else if ($cur_page <= $no_of_paginations && $cur_page > $no_of_paginations - 6) {
    			$start_loop = $no_of_paginations - 6;
    			$end_loop = $no_of_paginations;
    		} else {
    			$end_loop = $no_of_paginations;
    		}
    	} else {
    		$start_loop = 1;
    		if ($no_of_paginations > 7)
    			$end_loop = 7;
    		else
    			$end_loop = $no_of_paginations;
    	}
    	/* ----------------------------------------------------------------------------------------------------------- */
    	$msg = "";
    	$msg .= "<div class='pagination mail-all-hdr'><ul>";
    
    	// FOR ENABLING THE FIRST BUTTON
    	if ($first_btn && $cur_page > 1) {
    		$msg .= "<li p='1' class='active' title=First> << </li>";
    	} else if ($first_btn) {
    		$msg .= "<li p='1' class='inactive' title=First> << </li>";
    	}
    	
    	// FOR ENABLING THE PREVIOUS BUTTON
    	if ($previous_btn && $cur_page > 1) {
    		$pre = $cur_page - 1;
    		$msg .= "<li p='$pre' class='active'title=Previous> < </li>";
    	} else if ($previous_btn) {
    		$msg .= "<li class='inactive' title=Previous> < </li>";
    	}

    	// TO ENABLE THE NEXT BUTTON
    	if ($next_btn && $cur_page < $no_of_paginations) {
    		$nex = $cur_page + 1;
    		$msg .= "<li p='$nex' class='active' title=Next> > </li>";
    	} else if ($next_btn) {
    		$msg .= "<li class='inactive' title=Next> > </li>";
    	}
    	
    	// TO ENABLE THE END BUTTON
    	if ($last_btn && $cur_page < $no_of_paginations)
    	 {
    	  $msg .= "<li p='$no_of_paginations' class='active' title=Last> >> </li>";
    	 } 
    	 else if ($last_btn) 
    	 {
    	  $msg .= "<li p='$no_of_paginations' class='inactive' title=Last> >> </li>";
    	 }
    	$total_string = "<div class='total' a='$no_of_paginations'>Page <b>" . $cur_page . "</b> of <b>$no_of_paginations</b></div>";
    	$goto = "<div class = 'goTo'><input type='text' class='goto' size='1' style='margin-top:-1px;'/><input type='button' id='go_btn' class='go_button' value='Go'/></div>";
    	$msg = $msg . "</ul>"  . $total_string . "</div>";  // Content for pagination
    
    	//	Pagination merged with data array.
    	$ret_array = array();
    	$ret_array['records'] = $my_inbox_messages_r;
    	$ret_array['pagination'] = $msg;
    	echo Zend_Json::encode( $ret_array );
    	die;
    }
    
    public function archiveAction()
    {
    	 
    }

    /**
     * Repond to ajax call after
     * marking message delete in
     * message folder table.
     * 
     *  @author Sgandhi
     *  @version 1.0
     *
     */
    public function moveArchiveMsgToTrashAction()
    {
		$msg_ids_r = explode( ",", $this->getRequest()->getParam("msg_ids") );
		$my_archive_folder_id = \Extended\user_folder::getUserFolder( Auth_UserAdapter::getIdentity()->getId(), \Extended\folder::FOLDER_ARCHIVE );
		$my_trash_folder_id = \Extended\user_folder::getUserFolder( Auth_UserAdapter::getIdentity()->getId(), \Extended\folder::FOLDER_TRASH );
	
		foreach ( $msg_ids_r as $msg_id )
		{
			\Extended\message_folder::moveMessageToFolder($my_archive_folder_id, $msg_id, $my_trash_folder_id);
		}
		echo Zend_Json::encode(1);
		die;
    	
    }

    /**
     * Repond to ajax call after
     * marking delete message in
     * message folder table.
     * 
     *  @author Sgandhi
     *  @version 1.0
     */
    public function linkRequestsAction()
    {
        // action body
    }
    
    /**
     * jobInvitationRequest
     *  @author nsingh3
     *  @version 1.0
     */
    public function jobInvitationRequestsAction()
    {
    	// action body
    }
    
    /**
     * Returns count of inbox messages of a user
     * for each message type
     * 
     *  @author RSHARMA
     *  @version 1.0
     */
    public function getUnreadMailCountsInboxTypewiseAction()
    {
    	// action body
    	$cnt = \Extended\message::getMailCounts(Auth_UserAdapter::getIdentity()->getId(), 1);
    	$cnt_arr = array(); // creating a new array to make msg_type as the key of each sub array
    	foreach($cnt as $count){
    		$cnt_arr[$count['message_type']] = $count;
    	}
    	echo Zend_Json::encode($cnt_arr);
    	die;
    }
    
    /**
     * Returns count of inbox messages of a user
     * collectively.
     * 
     *  @author RSHARMA
     *  @version 1.0
     */
    public function getUnreadMailCountsInboxAction()
    {
    	// action body
    	$cnts = \Extended\message::getMailCounts(Auth_UserAdapter::getIdentity()->getId());
    	
    	$sum = 0;
    	foreach ( $cnts as $cnt )
    	{
    		$sum += intval( $cnt["cnt"] );
    	}	
    	
    	echo Zend_Json::encode( $sum );
    	die;
    }
    
    /**
     * Returns user info,
     * accepts user_id.
     * 
     * @author jsingh7
     * @version 1.0
     */
    public function getUserInfoAction()
    {
    	// action body
    	$user_info = \Extended\ilook_user::getUserdetailById( $this->getRequest()->getParam('user_id') );
		echo Zend_Json::encode($user_info);
    	die;
    }
    
    /**
     * action for trash view
     *
     * @author Shaina
     *
     *
     *
     */
    public function trashAction()
    {
    	// action body
    }
    
    /**
     * Returns all necessary data for trash listing
     * for logged in user.
     * handles ajax call.
     *
     * @author sgandi,sjaiswal
     * @return json
     * @version 1.0

     *
     */
    public function getMyTrashAction()
    {
    	$page = $this->getRequest()->getParam( 'page' );
    	$cur_page = $page;
    	$page -= 1;
    	$per_page = 8;
    	$previous_btn = true;
    	$next_btn = true;
    	$first_btn = true;
    	$last_btn = true;
    	$start = $page * $per_page;
    	
    	$current_user = Auth_UserAdapter::getIdentity()->getId();
    	
    	//Users blocked by current user or blocked current user.
    	$blocked_profiles = \Extended\blocked_users::getAllBlockersAndBlockedUsers($current_user);
    	
    	$my_trash_messages = Extended\message::getTrashOfUser( $current_user, $per_page, $start, NULL );
     	   
    	foreach ( $my_trash_messages as $key=>$msgs )
    	{
    		if($blocked_profiles)
    		{
	    		//Checking if sender is in blocked profiles then setting prof_image as default.
	    		if( in_array($msgs['msg_sender_id'], $blocked_profiles))
	    		{
		    		//setting image for user. So that there would be no need to apply conditions on json.
					$my_trash_messages[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['msg_sender_id'], 3, false, $blocked_profiles );
	    		}
	    		else
	    		{
	    			//setting image for user. So that there would be no need to apply conditions on json.
	    			$my_trash_messages[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['msg_sender_id'], 3);
	    		}
    		}
    		else
    		{
    			//setting image for user. So that there would be no need to apply conditions on json.
    			$my_trash_messages[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['msg_sender_id'], 3);
    		}
    		
    		// setting datetime. So that there is no need to apply funtions for datetime in json.
    		$my_trash_messages[$key]['created_at'] = Helper_common::nicetime( $msgs['created_at']->format( "Y-m-d H:i:s" ) );
    		$my_trash_messages[$key]['content'] = strip_tags( $msgs['contents']);
    	}
    	 
    	$count = count( Extended\message::getTrashOfUser( Auth_UserAdapter::getIdentity()->getId(), NULL, NULL, NULL ));
    	$no_of_paginations = ceil($count / $per_page);
    	 
    	/* ---------------Calculating the starting and ending values for the loop----------------------------------- */
    	if ($cur_page >= 7) 
    	{
    		$start_loop = $cur_page - 3;
    		if ($no_of_paginations > $cur_page + 3)
    			$end_loop = $cur_page + 3;
    		else if ($cur_page <= $no_of_paginations && $cur_page > $no_of_paginations - 6) {
    			$start_loop = $no_of_paginations - 6;
    			$end_loop = $no_of_paginations;
    		} 
    		else 
    		{
    			$end_loop = $no_of_paginations;
    		}
    	} 
    	else {
    		$start_loop = 1;
    		if ($no_of_paginations > 7)
    			$end_loop = 7;
    		else
    			$end_loop = $no_of_paginations;
    	}
    	/* ----------------------------------------------------------------------------------------------------------- */
    	$msg = "";
    	$msg .= "<div class='pagination mail-all-hdr'><ul>";
    	 
        	// FOR ENABLING THE FIRST BUTTON
    	if ($first_btn && $cur_page > 1)
    	 {
         $msg .= "<li p='1' class='active' title=First> << </li>";
    	 } 
    	 else if ($first_btn) 
    	 {
    	 $msg .= "<li p='1' class='inactive' title=First> << </li>";
    	 }
    	
    	// FOR ENABLING THE PREVIOUS BUTTON
    	 if ($previous_btn && $cur_page > 1) 
    	 {
    		$pre = $cur_page - 1;
    		$msg .= "<li p='$pre' class='active'title=Previous> < </li>";
    	 } 
    	 else if ($previous_btn) 
    	 {
    		$msg .= "<li class='inactive' title=Previous> < </li>";
    	 }
    	

    	// TO ENABLE THE NEXT BUTTON
    	if ($next_btn && $cur_page < $no_of_paginations) 
    	{
    		$nex = $cur_page + 1;
    	    $msg .= "<li p='$nex' class='active' title=Next> > </li>";
    	}
    	else if ($next_btn)
    	{
    		$msg .= "<li class='inactive' title=Next> > </li>";
    	}
    	
    	// TO ENABLE THE END BUTTON
    	if ($last_btn && $cur_page < $no_of_paginations) 
    	{
    		$msg .= "<li p='$no_of_paginations' class='active' title=Last> >> </li>";
    	} 
    	else if ($last_btn)
    	{
    	   	$msg .= "<li p='$no_of_paginations' class='inactive' title=Last> >> </li>";
    	}
    	    	 
    	$total_string = "<div class='total' a='$no_of_paginations'>Page <b>" . $cur_page . "</b> of <b>$no_of_paginations</b></div>";
    	 
    	// TO ENABLE THE GO TO SEARCH.
        $msg = $msg . "</ul>"  . $total_string . "</div>";  // Content for pagination
    	 
    	//	Pagination merged with data array.
    	$ret_array = array();
    	$ret_array['records'] = $my_trash_messages;
    	$ret_array['pagination'] = $msg;

    	echo Zend_Json::encode( $ret_array );
    	die;
    }
    
    /**
     * Returns all necessary searched data for archive listing
     * for logged in user.
     * handles ajax call.
     *
     * @author hkaur5
     * @return json
     * @version 1.0
     *
     *
     */
    public function getMySearchedTrashAction()
    {
    	$search_text = $this->getRequest()->getParam( 'search_text' );
    	$page = $this->getRequest()->getParam( 'page' );
    	$cur_page = $page;
    	$page -= 1;
    	$per_page = 8;
    	$previous_btn = true;
    	$next_btn = true;
    	$first_btn = true;
    	$last_btn = true;
    	$start = $page * $per_page;
    
    	$current_user = Auth_UserAdapter::getIdentity()->getId();
    	//Users blocked by current user or blocked current user.
    	$blocked_profiles = \Extended\blocked_users::getAllBlockersAndBlockedUsers($current_user);
    	
    	$my_searched_trash_messages = Extended\message::getSearchedTrashOfUser( $current_user, $search_text, $per_page, $start, NULL );
    	$my_searched_trash_messages_r = array();
    	foreach ( $my_searched_trash_messages as $key=>$msgs )
    	{
    		
    		$my_searched_trash_messages_r[$key]['id'] = $msgs['id0'];
    		$my_searched_trash_messages_r[$key]['subject'] = $msgs['subject1'];
    		$my_searched_trash_messages_r[$key]['content'] = strip_tags($msgs['contents2']);
    		$my_searched_trash_messages_r[$key]['sender_firstname'] = $msgs['firstname7'];
    		$my_searched_trash_messages_r[$key]['sender_lastname'] = $msgs['lastname8'];
    		$my_searched_trash_messages_r[$key]['mark_read'] = $msgs['mark_read12'];
    		$my_searched_trash_messages_r[$key]['msg_sender_id'] = $msgs['sclr5'];
    		 
    		if($blocked_profiles)
    		{
	    		//Checking if sender is in blocked profiles then setting prof_image as default.
	    		if( in_array($msgs['sclr5'], $blocked_profiles))
	    		{
		    		//setting image for user. So that there would be no need to apply conditions on json.
		    		$my_searched_trash_messages_r[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['sclr5'], 3, false, $blocked_profiles);
	    		}
	    		else
	    		{
	    			$my_searched_trash_messages_r[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['sclr5'], 3);
	    		}
    		}
    		else
    		{
    			$my_searched_trash_messages_r[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['sclr5'], 3);
    		} 
    		// setting datetime. So that there is no need to apply funtions for datetime in json.
    		$temp = explode(".", $msgs['created_at4']);
    		$dateTimeObj = \datetime::createfromformat('Y-m-d H:i:s', $temp[0] );
    		$my_searched_trash_messages_r[$key]['created_at'] = Helper_common::nicetime( $dateTimeObj->format( "Y-m-d H:i:s" ) );
    		
    	}
    
    	$my_searched_trash_messages_for_count = Extended\message::getSearchedTrashOfUser( Auth_UserAdapter::getIdentity()->getId(), $search_text, null, 0, Extended\message::MSG_TYPE_GENERAL );
    	$count = count($my_searched_trash_messages_for_count);
    
    	$no_of_paginations = ceil($count / $per_page);
    	 
    	/* ---------------Calculating the starting and ending values for the loop----------------------------------- */
    	if ($cur_page >= 7) {
    		$start_loop = $cur_page - 3;
    		if ($no_of_paginations > $cur_page + 3)
    			$end_loop = $cur_page + 3;
    		else if ($cur_page <= $no_of_paginations && $cur_page > $no_of_paginations - 6) {
    			$start_loop = $no_of_paginations - 6;
    			$end_loop = $no_of_paginations;
    		} else {
    			$end_loop = $no_of_paginations;
    		}
    	} else {
    		$start_loop = 1;
    		if ($no_of_paginations > 7)
    			$end_loop = 7;
    		else
    			$end_loop = $no_of_paginations;
    	}
    	/* ----------------------------------------------------------------------------------------------------------- */
    	$msg = "";
    	$msg .= "<div class='pagination mail-all-hdr'><ul>";
    	 
    	// FOR ENABLING THE FIRST BUTTON
    	if ($first_btn && $cur_page > 1) {
    		$msg .= "<li p='1' class='active' title=First> << </li>";
    	} else if ($first_btn) {
    		$msg .= "<li p='1' class='inactive' title=First> << </li>";
    	}
    	 
    	// FOR ENABLING THE PREVIOUS BUTTON
    	if ($previous_btn && $cur_page > 1) {
    		$pre = $cur_page - 1;
    		$msg .= "<li p='$pre' class='active'title=Previous> < </li>";
    	} else if ($previous_btn) {
    		$msg .= "<li class='inactive' title=Previous> < </li>";
    	}
    	 
    	 
    	// TO ENABLE THE NEXT BUTTON
    	if ($next_btn && $cur_page < $no_of_paginations) {
    		$nex = $cur_page + 1;
    		$msg .= "<li p='$nex' class='active' title=Next> > </li>";
    	} else if ($next_btn) {
    		$msg .= "<li class='inactive' title=Next> > </li>";
    	}
    	 
    	// TO ENABLE THE END BUTTON
    	if ($last_btn && $cur_page < $no_of_paginations) {
    		$msg .= "<li p='$no_of_paginations' class='active' title=Last> >> </li>";
    	} else if ($last_btn) {
    		$msg .= "<li p='$no_of_paginations' class='inactive' title=Last> >> </li>";
    	}
    	 
    	$total_string = "<div class='total' a='$no_of_paginations'>Page <b>" . $cur_page . "</b> of <b>$no_of_paginations</b></div>";
    	 
    	// TO ENABLE THE GO TO SEARCH.
    	$msg = $msg . "</ul>"  . $total_string . "</div>";  // Content for pagination
    	 
    	// Pagination merged with data array.
    	$ret_array = array();
    	$ret_array['records'] = $my_searched_trash_messages_r;
    	$ret_array['pagination'] = $msg;
    	echo Zend_Json::encode( $ret_array );
    	die;
    }
    /**
     * Repond to ajax call after
     * marking message read in
     * message folder table.
     *
     *  @author Shaina
     *  @version 1.0
     *
     *
     */
    public function markReadTrashItemAction()
    {
    	$msg_ids_r = explode( ",", $this->getRequest()->getParam("msg_ids") );
    	$my_folder_id = \Extended\user_folder::getUserFolder( Auth_UserAdapter::getIdentity()->getId(), \Extended\folder::FOLDER_TRASH );
    	foreach ( $msg_ids_r as $msg_id )
    	{
    		\Extended\message_folder::MarkReadUnreadMessage( $msg_id, $my_folder_id, \Extended\message_folder::MARK_AS_READ );
    	}
    	echo Zend_Json::encode(1);
    	die;
    }
    
    /**
     * Repond to ajax call after
     * marking message unread in
     * message folder table.
     *
     *  @author Shaina
     *  @version 1.0
     *
     *
     */
    public function markUnreadTrashItemAction()
    {
    	$msg_ids_r = explode( ",", $this->getRequest()->getParam("msg_ids") );
    	$my_folder_id = \Extended\user_folder::getUserFolder( Auth_UserAdapter::getIdentity()->getId(), \Extended\folder::FOLDER_TRASH );
    	foreach ( $msg_ids_r as $msg_id )
    	{
    		\Extended\message_folder::MarkReadUnreadMessage( $msg_id, $my_folder_id, \Extended\message_folder::MARK_AS_UNREAD );
    	}
    	echo Zend_Json::encode(1);
    	die;
    }
    /**
     * Repond to ajax call after
     * marking message delete in
     * message folder table.
     *
     *  @author Sgandhi
     *  @version 1.0
     *
     */
    public function moveTrashMsgToInboxAction()
    {
    	$msg_ids_r = explode( ",", $this->getRequest()->getParam("msg_ids") );
    	$my_trash_folder_id = \Extended\user_folder::getUserFolder( Auth_UserAdapter::getIdentity()->getId(), \Extended\folder::FOLDER_TRASH );
    	$my_inbox_folder_id = \Extended\user_folder::getUserFolder( Auth_UserAdapter::getIdentity()->getId(), \Extended\folder::FOLDER_INBOX );
    
    	foreach ( $msg_ids_r as $msg_id )
    	{
    		\Extended\message_folder::moveMessageToFolder($my_trash_folder_id, $msg_id, $my_inbox_folder_id);
    	}
    	echo Zend_Json::encode(1);
    	die;
    	 
    }
    /**
     * Returns count of trash messages of a user
     * for each message type
     *
     *
     *  @author Shaina
     *  @version 1.0
     */
    public function getTrashMailCountsAction()
    {
    	// action body
    	$cnt = \Extended\message::getTrashMailCounts(Auth_UserAdapter::getIdentity()->getId());
    	$cnt_arr = array(); // creating a new array to make msg_type as the key of each sub array
    	foreach($cnt as $count){
    		$cnt_arr[$count['message_type']] = $count;
    	}
    	echo Zend_Json::encode($cnt_arr);
    	die;
    }
    /**
     * Repond to ajax call after
     * marking message delete in
     * message folder table.
     *
     *  @author Sgandhi
     *  @version 1.0
     *
     */
    public function deleteTrashAction()
    {
    	$params = $this->getRequest()->getParams();
    	$msg_ids_r = explode( ",", $params["msg_ids"]);
		if(  \Extended\message_folder::removeTrashMessage(
				$msg_ids_r,
				Auth_UserAdapter::getIdentity()->getId()
				) )
		{
    		echo Zend_Json::encode( 1 );
		}
		else
		{
    		echo Zend_Json::encode( 0 );			
		}		
    	die;
    }
    
    /**
     * action for inbox view
     *
     * @author jsingh7
     */
    public function feedbackRequestAction()
    {
    
    }
    
    /**
     * Returns all necessary data for Feedback Request listing
     * for logged in user.
     * handles ajax call.
     *
     * @author Sgandhi
     * @return json
     * @version 1.0
     *
     *
     */
    public function getMyFeedbackRequestAction()
    {
    	$page = $this->getRequest()->getParam( 'page' );
    	$cur_page = $page;
    	$page -= 1;
    	$per_page = 8;
    	$previous_btn = true;
    	$next_btn = true;
    	$first_btn = true;
    	$last_btn = true;
    	$start = $page * $per_page;
    	 
    	$current_user = Auth_UserAdapter::getIdentity()->getId();
    	$my_feedback_messages = Extended\message::getFeedbackRequestOfUser( $current_user, $per_page, $start, Extended\message::MSG_TYPE_FEEDBACK_REQ );
    	
    	//Users blocked by current user or blocked current user.
    	$blocked_profiles = \Extended\blocked_users::getAllBlockersAndBlockedUsers($current_user);
    	
    	foreach ( $my_feedback_messages as $key=>$msgs )
    	{
    		if($blocked_profiles)
    		{
	    		//Checking if sender is in blocked profiles then setting prof_image as default.
	    		if( in_array($msgs['msg_sender_id'], $blocked_profiles))
	    		{
		    		//setting image for user. So that there would be no need to apply conditions on json.
					$my_feedback_messages[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['msg_sender_id'], 3, false, $blocked_profiles);
	    		}
	    		else
	    		{
	    			//setting image for user. So that there would be no need to apply conditions on json.
	    			$my_feedback_messages[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['msg_sender_id'], 3);
	    		}
    		}
    		else
    		{
    			//setting image for user. So that there would be no need to apply conditions on json.
    			$my_feedback_messages[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['msg_sender_id'], 3);
    		}
	    	// setting datetime. So that there is no need to apply funtions for datetime in json.
    		$my_feedback_messages[$key]['created_at'] = Helper_common::nicetime( $msgs['created_at']->format( "Y-m-d H:i:s" ) );
    	}
    	 
    	$my_feedback_messages_count = Extended\message::getFeedbackRequestCountOfUser( Auth_UserAdapter::getIdentity()->getId(), Extended\message::MSG_TYPE_FEEDBACK_REQ );
    	$count = $my_feedback_messages_count[0]["num_of_rows"];
    	$no_of_paginations = ceil($count / $per_page);
    	 
    	/* ---------------Calculating the starting and ending values for the loop----------------------------------- */
    	if ($cur_page >= 7) {
    		$start_loop = $cur_page - 3;
    		if ($no_of_paginations > $cur_page + 3)
    			$end_loop = $cur_page + 3;
    		else if ($cur_page <= $no_of_paginations && $cur_page > $no_of_paginations - 6) {
    			$start_loop = $no_of_paginations - 6;
    			$end_loop = $no_of_paginations;
    		} else {
    			$end_loop = $no_of_paginations;
    		}
    	} else {
    		$start_loop = 1;
    		if ($no_of_paginations > 7)
    			$end_loop = 7;
    		else
    			$end_loop = $no_of_paginations;
    	}
    	/* ----------------------------------------------------------------------------------------------------------- */
    	$msg = "";
    	$msg .= "<div class='pagination mail-all-hdr'><ul>";
    	// FOR ENABLING THE FIRST BUTTON
    	if ($first_btn && $cur_page > 1) {
    	    $msg .= "<li p='1' class='active' title=First> << </li>";
    	} else if ($first_btn) {
    		$msg .= "<li p='1' class='inactive' title=First> << </li>";
    	}
    	 
    	// FOR ENABLING THE PREVIOUS BUTTON
    	if ($previous_btn && $cur_page > 1) {
    		$pre = $cur_page - 1;
    		$msg .= "<li p='$pre' class='active'title=Previous> < </li>";
    	} else if ($previous_btn) {
    		$msg .= "<li class='inactive' title=Previous> < </li>";
    	}
    	 
    	 
    	// TO ENABLE THE NEXT BUTTON
    	if ($next_btn && $cur_page < $no_of_paginations) {
    		$nex = $cur_page + 1;
    		$msg .= "<li p='$nex' class='active' title=Next> > </li>";
    	} else if ($next_btn) {
    		$msg .= "<li class='inactive' title=Next> > </li>";
    	}
    	 
    	// TO ENABLE THE END BUTTON
    	if ($last_btn && $cur_page < $no_of_paginations) {
    		$msg .= "<li p='$no_of_paginations' class='active' title=Last> >> </li>";
    	} else if ($last_btn) {
    	   $msg .= "<li p='$no_of_paginations' class='inactive' title=Last> >> </li>";
    	}
    	     	$total_string = "<div class='total' a='$no_of_paginations'>Page <b>" . $cur_page . "</b> of <b>$no_of_paginations</b></div>";
    	 
    	// TO ENABLE THE GO TO SEARCH.
    
    	$msg = $msg . "</ul>"  . $total_string ."</div>";  // Content for pagination
    	 
    	// Pagination merged with data array.
    	$ret_array = array();
    	$ret_array['records'] = $my_feedback_messages;
    	$ret_array['pagination'] = $msg;
    	echo Zend_Json::encode( $ret_array );
    	die;
    }
    
    /**
     * Returns all necessary searched data for feedback requests mails listing
     * for logged in user.
     * handles ajax call.
     *
     * @author hkaur5
     * @return json
     * @version 1.0
     *
     *
     */
    public function getMySearchedFeedbackRequestsAction()
    {
    	$search_text = $this->getRequest()->getParam( 'search_text' );
    	$page = $this->getRequest()->getParam( 'page' );
    	$cur_page = $page;
    	$page -= 1;
    	$per_page = 8;
    	$previous_btn = true;
    	$next_btn = true;
    	$first_btn = true;
    	$last_btn = true;
    	$start = $page * $per_page;

    	$current_user = Auth_UserAdapter::getIdentity()->getId();
    	//Users blocked by current user or blocked current user.
    	$blocked_profiles = \Extended\blocked_users::getAllBlockersAndBlockedUsers($current_user);
    	
    	$my_inbox_messages = Extended\message::getSearchedInboxOfUser( $current_user, $search_text, $per_page, $start, Extended\message::MSG_TYPE_FEEDBACK_REQ );
    	$my_inbox_messages_r = array();
    	foreach ( $my_inbox_messages as $key=>$msgs )
    	{
    		$my_inbox_messages_r[$key]['id'] = $msgs['id0'];
    		$my_inbox_messages_r[$key]['subject'] = $msgs['subject1'];
    		$my_inbox_messages_r[$key]['contents'] = $msgs['contents2'];
    		$my_inbox_messages_r[$key]['sender_firstname'] = $msgs['firstname8'];
    		$my_inbox_messages_r[$key]['sender_lastname'] = $msgs['lastname9'];
    		$my_inbox_messages_r[$key]['mark_read'] = $msgs['mark_read13'];
    		
    		if($blocked_profiles)
    		{
    			if( in_array($msgs['sclr6'], $blocked_profiles))
    			{
		    		//setting image for user. So that there would be no need to apply conditions on json.
		    		$my_inbox_messages_r[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['sclr6'], 3, false, $blocked_profiles);
    		
    			}
    			else 
    			{
    				//setting image for user. So that there would be no need to apply conditions on json.
    				$my_inbox_messages_r[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['sclr6'], 3);
    			}
    		}
    		else
    		{
    			//setting image for user. So that there would be no need to apply conditions on json.
    			$my_inbox_messages_r[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['sclr6'], 3);
    		}
    		// setting datetime. So that there is no need to apply funtions for datetime in json.
    		$temp = explode(".", $msgs['created_at5']);
    		$dateTimeObj = \datetime::createfromformat('Y-m-d H:i:s', $temp[0] );
    		$my_inbox_messages_r[$key]['created_at'] = Helper_common::nicetime( $dateTimeObj->format( "Y-m-d H:i:s" ) );
    	}
    	 
    	$my_inbox_messages_for_count = Extended\message::getSearchedInboxOfUser( Auth_UserAdapter::getIdentity()->getId(), $search_text, null, 0, Extended\message::MSG_TYPE_FEEDBACK_REQ );
    	$count = count($my_inbox_messages_for_count);
    	 
    	$no_of_paginations = ceil($count / $per_page);
    
    	/* ---------------Calculating the starting and ending values for the loop----------------------------------- */
    	if ($cur_page >= 7) {
    		$start_loop = $cur_page - 3;
    		if ($no_of_paginations > $cur_page + 3)
    			$end_loop = $cur_page + 3;
    		else if ($cur_page <= $no_of_paginations && $cur_page > $no_of_paginations - 6) {
    			$start_loop = $no_of_paginations - 6;
    			$end_loop = $no_of_paginations;
    		} else {
    			$end_loop = $no_of_paginations;
    		}
    	} else {
    		$start_loop = 1;
    		if ($no_of_paginations > 7)
    			$end_loop = 7;
    		else
    			$end_loop = $no_of_paginations;
    	}
    	/* ----------------------------------------------------------------------------------------------------------- */
    	$msg = "";
    	$msg .= "<div class='pagination mail-all-hdr'><ul>";
    
    	// FOR ENABLING THE FIRST BUTTON
    	if ($first_btn && $cur_page > 1) {
    		$msg .= "<li p='1' class='active' title=First> << </li>";
    	} else if ($first_btn) {
    		$msg .= "<li p='1' class='inactive' title=First> << </li>";
    	}
    
    	// FOR ENABLING THE PREVIOUS BUTTON
    	if ($previous_btn && $cur_page > 1) {
    		$pre = $cur_page - 1;
    		$msg .= "<li p='$pre' class='active'title=Previous> < </li>";
    	} else if ($previous_btn) {
    		$msg .= "<li class='inactive' title=Previous> < </li>";
    	}
    
      	// TO ENABLE THE NEXT BUTTON
    	if ($next_btn && $cur_page < $no_of_paginations) {
    		$nex = $cur_page + 1;
    		$msg .= "<li p='$nex' class='active' title=Next> > </li>";
    	} else if ($next_btn) {
    		$msg .= "<li class='inactive' title=Next> > </li>";
    	}
    
    	// TO ENABLE THE END BUTTON
    	if ($last_btn && $cur_page < $no_of_paginations) {
   			$msg .= "<li p='$no_of_paginations' class='active' title=Last> >> </li>";
    	} else if ($last_btn) {
    		$msg .= "<li p='$no_of_paginations' class='inactive' title=Last> >> </li>";
    	}
    
    	$total_string = "<div class='total' a='$no_of_paginations'>Page <b>" . $cur_page . "</b> of <b>$no_of_paginations</b></div>";
    
    	// TO ENABLE THE GO TO SEARCH.
    	$msg = $msg . "</ul>"  . $total_string ."</div>";  // Content for pagination
    
    	//	Pagination merged with data array.
    	$ret_array = array();
    	$ret_array['records'] = $my_inbox_messages_r;
    	$ret_array['pagination'] = $msg;
    
    	echo Zend_Json::encode( $ret_array );
    	die;
    }
    /**
     * action for Reference Requests view
     *
     * @author Shaina
     *
     *
     *
     */
    public function referenceRequestAction()
    {
    	
    }
    
    
    /**
     * Returns all necessary
     * data for reference request listing in inbox for logged in user.
     * handles ajax call.
     *
     * @author Shaina
     * @return json
     * @version 1.0
     *
     *
     */
    public function getMyReferenceRequestsAction()
    {
    	$page = $this->getRequest()->getParam( 'page' );
    	$cur_page = $page;
    	$page -= 1;
    	$per_page = 8;
    	$previous_btn = true;
    	$next_btn = true;
    	$first_btn = true;
    	$last_btn = true;
    	$start = $page * $per_page;
    	$current_user = Auth_UserAdapter::getIdentity()->getId();
    	$my_inbox_ref_req_messages = Extended\message::getReferenceRequestOfUser( $current_user, $per_page, $start, Extended\message::MSG_TYPE_REF_REQ );
    	
    	//Users blocked by current user or blocked current user.
    	$blocked_profiles = \Extended\blocked_users::getAllBlockersAndBlockedUsers($current_user);
    	foreach ( $my_inbox_ref_req_messages as $key=>$msgs )
    	{
    		if($blocked_profiles)
    		{
	    		//Checking if sender is in blocked profiles then setting prof_image as default.
	    		if( in_array($msgs['msg_sender_id'], $blocked_profiles))
	    		{
		    		//setting image for user. So that there would be no need to apply conditions on json.
		    		$my_inbox_ref_req_messages[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['msg_sender_id'], 3, false, $blocked_profiles );
	    		}
    		else
    		{
    			//setting image for user. So that there would be no need to apply conditions on json.
    			$my_inbox_ref_req_messages[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['msg_sender_id'], 3);
    		}
    		}
    		else
    		{
    			//setting image for user. So that there would be no need to apply conditions on json.
    			$my_inbox_ref_req_messages[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['msg_sender_id'], 3);
    		}
    		// setting datetime. So that there is no need to apply funtions for datetime in json.
    		$my_inbox_ref_req_messages[$key]['created_at'] = Helper_common::nicetime( $msgs['created_at']->format( "Y-m-d H:i:s" ) );
    	}
    	$my_inbox_messages_count = Extended\message::getReferenceRequestCountOfUser( Auth_UserAdapter::getIdentity()->getId(), Extended\message::MSG_TYPE_REF_REQ );
    	$count = $my_inbox_messages_count[0]["num_of_rows"];
    	$no_of_paginations = ceil($count / $per_page);
    	/* ---------------Calculating the starting and ending values for the loop----------------------------------- */
    	if ($cur_page >= 7) {
    		$start_loop = $cur_page - 3;
    		if ($no_of_paginations > $cur_page + 3)
    			$end_loop = $cur_page + 3;
    		else if ($cur_page <= $no_of_paginations && $cur_page > $no_of_paginations - 6) {
    			$start_loop = $no_of_paginations - 6;
    			$end_loop = $no_of_paginations;
    		} else {
    			$end_loop = $no_of_paginations;
    		}
    	} else {
    		$start_loop = 1;
    		if ($no_of_paginations > 7)
    			$end_loop = 7;
    		else
    			$end_loop = $no_of_paginations;
    	}
    	/* ----------------------------------------------------------------------------------------------------------- */
    	$msg = "";
    	$msg .= "<div class='pagination mail-all-hdr'><ul>";
    	
    	
    	// FOR ENABLING THE FIRST BUTTON
    	if ($first_btn && $cur_page > 1) {
    		$msg .= "<li p='1' class='active' title=First> << </li>";
    	} else if ($first_btn) {
    		$msg .= "<li p='1' class='inactive' title=First> << </li>";
    	}
    	
    	// FOR ENABLING THE PREVIOUS BUTTON
    	if ($previous_btn && $cur_page > 1) {
    		$pre = $cur_page - 1;
    		$msg .= "<li p='$pre' class='active'title=Previous> < </li>";
    	} else if ($previous_btn) {
    		$msg .= "<li class='inactive' title=Previous> < </li>";
    	}
    	
    	// TO ENABLE THE NEXT BUTTON
    	if ($next_btn && $cur_page < $no_of_paginations) {
    		$nex = $cur_page + 1;
    		$msg .= "<li p='$nex' class='active' title=Next> > </li>";
    	} else if ($next_btn) {
    		$msg .= "<li class='inactive' title=Next> > </li>";
    	}

    	// TO ENABLE THE END BUTTON
    	if ($last_btn && $cur_page < $no_of_paginations) {
    		$msg .= "<li p='$no_of_paginations' class='active' title=Last> >> </li>";
    	} else if ($last_btn) {
    		$msg .= "<li p='$no_of_paginations' class='inactive' title=Last> >> </li>";
    	}
    	
     	$total_string = "<div class='total' a='$no_of_paginations'>Page <b>" . $cur_page . "</b> of <b>$no_of_paginations</b></div>";
    	$goto = "<div class = 'goTo'><input type='text' class='goto' size='1' style='margin-top:-1px;'/><input type='button' id='go_btn' class='go_button' value='Go'/></div>";
    	$msg = $msg . "</ul>"  . $total_string . "</div>";  // Content for pagination
    
    	//	Pagination merged with data array.
    	$ret_array = array();
    	$ret_array['records'] = $my_inbox_ref_req_messages;
    	$ret_array['pagination'] = $msg;
    	echo Zend_Json::encode( $ret_array );
    	die;
    }
    /**
     * Returns all necessary searched data for reference requests mails listing
     * for logged in user.
     * handles ajax call.
     *
     * @author hkaur5
     * @return json
     * @version 1.0
     *
     *
     */
    public function getMySearchedReferenceRequestsAction()
    {
    	$search_text = $this->getRequest()->getParam( 'search_text' );
    	$page = $this->getRequest()->getParam( 'page' );
    	$cur_page = $page;
    	$page -= 1;
    	$per_page = 8;
    	$previous_btn = true;
    	$next_btn = true;
    	$first_btn = true;
    	$last_btn = true;
    	$start = $page * $per_page;
    
    	$current_user = Auth_UserAdapter::getIdentity()->getId();
    	//Users blocked by current user or blocked current user.
    	$blocked_profiles = \Extended\blocked_users::getAllBlockersAndBlockedUsers($current_user);
    	
    	$my_inbox_messages = Extended\message::getSearchedInboxOfUser( $current_user, $search_text, $per_page, $start, Extended\message::MSG_TYPE_REF_REQ );
    	$my_inbox_messages_r = array();
    	foreach ( $my_inbox_messages as $key=>$msgs )
    	{
    		$my_inbox_messages_r[$key]['id'] = $msgs['id0'];
    		$my_inbox_messages_r[$key]['subject'] = $msgs['subject1'];
    		$my_inbox_messages_r[$key]['contents'] = $msgs['contents2'];
    		$my_inbox_messages_r[$key]['sender_firstname'] = $msgs['firstname8'];
    		$my_inbox_messages_r[$key]['sender_lastname'] = $msgs['lastname9'];
    		$my_inbox_messages_r[$key]['mark_read'] = $msgs['mark_read13'];
    
    		
    		if($blocked_profiles)
    		{
    			//Checking if sender is in blocked profiles then setting prof_image as default.
	    		if( in_array($msgs['sclr6'], $blocked_profiles ))
	    		{
		    		//setting image for user. So that there would be no need to apply conditions on json.
		    		$my_inbox_messages_r[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['sclr6'], 3, false, $blocked_profiles );
	    		}
	    		else 
	    		{
	    			$my_inbox_messages_r[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['sclr6'], 3);
	    		}
    		}
    		else 
    		{
    			$my_inbox_messages_r[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($msgs['sclr6'], 3);
    		}
    		// setting datetime. So that there is no need to apply funtions for datetime in json.
    		$temp = explode(".", $msgs['created_at5']);
    		$dateTimeObj = \datetime::createfromformat('Y-m-d H:i:s', $temp[0] );
    		$my_inbox_messages_r[$key]['created_at'] = Helper_common::nicetime( $dateTimeObj->format( "Y-m-d H:i:s" ) );
    	}
    
    	$my_inbox_messages_for_count = Extended\message::getSearchedInboxOfUser( Auth_UserAdapter::getIdentity()->getId(), $search_text, null, 0, Extended\message::MSG_TYPE_REF_REQ );
    	$count = count($my_inbox_messages_for_count);
    
    	$no_of_paginations = ceil($count / $per_page);
    
    	/* ---------------Calculating the starting and ending values for the loop----------------------------------- */
    	if ($cur_page >= 7) {
    		$start_loop = $cur_page - 3;
    		if ($no_of_paginations > $cur_page + 3)
    			$end_loop = $cur_page + 3;
    		else if ($cur_page <= $no_of_paginations && $cur_page > $no_of_paginations - 6) {
    			$start_loop = $no_of_paginations - 6;
    			$end_loop = $no_of_paginations;
    		} else {
    			$end_loop = $no_of_paginations;
    		}
    	} else {
    		$start_loop = 1;
    		if ($no_of_paginations > 7)
    			$end_loop = 7;
    		else
    			$end_loop = $no_of_paginations;
    	}
    	/* ----------------------------------------------------------------------------------------------------------- */
    	$msg = "";
    	$msg .= "<div class='pagination mail-all-hdr'><ul>";
    
    
    	// FOR ENABLING THE FIRST BUTTON
    	if ($first_btn && $cur_page > 1) {
    		$msg .= "<li p='1' class='active' title=First> << </li>";
    	} else if ($first_btn) {
    		$msg .= "<li p='1' class='inactive' title=First> << </li>";
    	}
    	
    	// FOR ENABLING THE PREVIOUS BUTTON
    	if ($previous_btn && $cur_page > 1) {
    		$pre = $cur_page - 1;
    		$msg .= "<li p='$pre' class='active'title=Previous> < </li>";
    	} else if ($previous_btn) {
    		$msg .= "<li class='inactive' title=Previous> < </li>";
    	}
    	
    	// TO ENABLE THE NEXT BUTTON
    	if ($next_btn && $cur_page < $no_of_paginations) {
    		$nex = $cur_page + 1;
    		$msg .= "<li p='$nex' class='active' title=Next> > </li>";
    	} else if ($next_btn) {
    		$msg .= "<li class='inactive' title=Next> > </li>";
    	}

    	// TO ENABLE THE END BUTTON
    	if ($last_btn && $cur_page < $no_of_paginations) {
    		$msg .= "<li p='$no_of_paginations' class='active' title=Last> >> </li>";
    	} else if ($last_btn) {
    		$msg .= "<li p='$no_of_paginations' class='inactive' title=Last> >> </li>";
    	}
    
    	$total_string = "<div class='total' a='$no_of_paginations'>Page <b>" . $cur_page . "</b> of <b>$no_of_paginations</b></div>";
   
    	$msg = $msg . "</ul>"  . $total_string . "</div>";  // Content for pagination
    
    	//Pagination merged with data array.
    	$ret_array = array();
    	$ret_array['records'] = $my_inbox_messages_r;
    	$ret_array['pagination'] = $msg;
    	echo Zend_Json::encode( $ret_array );
    	die;
    }
    /**
     * Repond to ajax call after
     * marking message read in
     * message folder table.
     *
     *  @author Shaina
     *  @version 1.0
     *
     *
     */
    public function markReadArchiveItemAction()
    {
    	$msg_ids_r = explode( ",", $this->getRequest()->getParam("msg_ids") );
    	$my_folder_id = \Extended\user_folder::getUserFolder( Auth_UserAdapter::getIdentity()->getId(), \Extended\folder::FOLDER_ARCHIVE );
    	foreach ( $msg_ids_r as $msg_id )
    	{
    		\Extended\message_folder::MarkReadUnreadMessage( $msg_id, $my_folder_id, \Extended\message_folder::MARK_AS_READ );
    	}
    	echo Zend_Json::encode(1);
    	die;
    }
    
    /**
     * Repond to ajax call after
     * marking message unread in
     * message folder table.
     *
     *  @author Shaina
     *  @version 1.0
     *
     *
     */
    public function markUnreadArchiveItemAction()
    {
    	$msg_ids_r = explode( ",", $this->getRequest()->getParam("msg_ids") );
    	$my_folder_id = \Extended\user_folder::getUserFolder( Auth_UserAdapter::getIdentity()->getId(), \Extended\folder::FOLDER_ARCHIVE );
    	foreach ( $msg_ids_r as $msg_id )
    	{
    		\Extended\message_folder::MarkReadUnreadMessage( $msg_id, $my_folder_id, \Extended\message_folder::MARK_AS_UNREAD );
    	}
    	echo Zend_Json::encode(1);
    	die;
    }
    /**
     * Repond to ajax call after
     * marking message delete in
     * message folder table.
     *
     *  @author Sgandhi
     *  @version 1.0
     *
     */
    public function moveArchiveMsgToInboxAction()
    {
    	$msg_ids_r = explode( ",", $this->getRequest()->getParam("msg_ids") );
    	$my_trash_folder_id = \Extended\user_folder::getUserFolder( Auth_UserAdapter::getIdentity()->getId(), \Extended\folder::FOLDER_ARCHIVE );
    	$my_inbox_folder_id = \Extended\user_folder::getUserFolder( Auth_UserAdapter::getIdentity()->getId(), \Extended\folder::FOLDER_INBOX );
    
    	foreach ( $msg_ids_r as $msg_id )
    	{
    		\Extended\message_folder::moveMessageToFolder($my_trash_folder_id, $msg_id, $my_inbox_folder_id);
    	}
    	echo Zend_Json::encode(1);
    	die;
    }
    
    /**
     * For ajax call by imail notification section.
     * @author jsingh7,sjaiswal,hkaur5
     */
    public function getLatestFiveImailsAction()
    {
    	$imails = \Extended\message::getInboxOfUser(Auth_UserAdapter::getIdentity()->getId(), 5, 0, null, 0 );
    	$imails_r = array();
    	$blocked_users = \Extended\blocked_users::getAllBlockersAndBlockedUsers(Auth_UserAdapter::getIdentity()->getId());
    	
    	if( $imails )
    	{
    		foreach ( $imails as $key=>$imail )
    		{
    			//Check sender and reciever link state.
    			if( $imail['type'] == \Extended\message::MSG_TYPE_LINK_REQ )
    			{
	    			$link_state = \Extended\link_requests::getFriendRequestState( $imail['msg_sender_id'], $imail['msg_receiver_id'] );
	    			$imails_r[$key]['link_state'] = $link_state['friend_type'];
    			}
    			if($imail['type'] == \Extended\message::MSG_TYPE_FEEDBACK_REQ)
    			{
    				$imails_r[$key]['feedback_request_id'] = $imail['feedback_request_id'];
    			}
    			if($imail['type'] == \Extended\message::MSG_TYPE_REF_REQ)
    			{
    				$imails_r[$key]['reference_request_id'] = $imail['reference_request_id'];
    			}
    			$imails_r[$key]['mail_id'] = $imail['id'];
    			$imails_r[$key]['subject'] = $imail['subject'];
    			$imails_r[$key]['type'] = $imail['type'];
    			$imails_r[$key]['created_at'] = Helper_common::nicetime_3( $imail['created_at']->format("Y-m-d H:i") );
    			$imails_r[$key]['sender_name'] = $imail['sender_firstname']." ".$imail['sender_lastname'];
    			$imails_r[$key]['sender_image'] = Helper_common::getUserProfessionalPhoto( $imail['msg_sender_id'], 3, false, $blocked_users );
    			$imails_r[$key]['sender_id'] = $imail['msg_sender_id'];
    			$imails_r[$key]['link_request_id'] = $imail['link_request_id'];
    			$imails_r[$key]['read'] = $imail['mark_read'];
    			//$imails_r[$key]['contents'] = Helper_common::removeHtmlFromString($imail['contents']);
    			$imails_r[$key]['contents'] = strip_tags($imail['contents'], '<br><br/>');
    		}
    	}
    	if( $imails_r )
    	{
    		$ret_array = array();
    		$ret_array['unread_imails_available'] = 1;
    		$ret_array['imails_data'] = $imails_r;
    		echo Zend_Json::encode($ret_array);
    	}
    	else 
    	{
    		$ret_array = array();
    		$ret_array['unread_imails_available'] = 0;
    		$ret_array['imails_data'] = $imails_r;
    		echo Zend_Json::encode($ret_array);
    	}
    	die;
    }
    
    
	 /**
	  * set imail notification seen 
	  * @author sjaiswal
	  * @version 1.0
	 */
	public function setImailNotificationSeenAction()
    {
    	//Marking msg as seen all inbox imails of logged user.
    	$my_inbox_id = \Extended\user_folder::getUserFolder( Auth_UserAdapter::getIdentity()->getId(), \Extended\folder::FOLDER_INBOX );
    	echo Zend_Json::encode(\Extended\message_folder::markImailsSeen($my_inbox_id));
    	
    	//GCM implementation--added by ptripathi
    	$aboutUserId = Auth_UserAdapter::getIdentity()->getId();
    	$text = "";
    	$notificationType = \Helper_gcm::MAIL_COUNT_TYPE;
    	$forUserId = Auth_UserAdapter::getIdentity()->getId();
    	\Helper_gcm::create($aboutUserId,$text,$notificationType,$forUserId);
    	
    	//APNS implementation
    	$em = \Zend_Registry::get('em');
    	$message = array(
					'notification_type' => $notificationType
			);
    	$silent= true;
    	$notification_count_array =  \Extended\message::getMailCounts($forUserId);
    	if(empty($notification_count_array)){
    		$notification_count = 0;
    	}else{
    		$notification_count = $notification_count_array[0]['cnt']; //count
    	}
    	$NotificationsForUserObj =  $em->find('\Entities\ilook_user', $forUserId );
 
/*     	$device_token = array($NotificationsForUserObj->getDevice_token());
    	\Helper_apns::pushnotificationApns($device_token,$message,$aboutUserId,$notification_count,$silent); */
    	
    	//check if OS_X device token not empty--foreach on tokens
    	$OS_X_device_token_value = $NotificationsForUserObj->getOS_X_device_token();
    	if(!empty($OS_X_device_token_value)){
    		$OS_X_device_token_array = explode(',',$OS_X_device_token_value);
    		foreach ($OS_X_device_token_array as $key=>$val){
    			
    			// applying condition for not running this code on localhost
    			$front = \Zend_Controller_Front::getInstance();
    			if($front->getRequest()->getHttpHost() != 'localhost' 
					&& $front->getRequest()->getHttpHost() != 'localhost:8080' 
					)
    			{
    				\Helper_apns::pushnotificationApns($val, $message,$aboutUserId,$forUserId,$notification_count,$silent);
    			}
    		}
    	}
    	
    	die;
    }
    
    /**
     * Initialing the Blueimp jquery file upload .
     *
     * @author jsingh7
     * @version 1.0
     */
    public function initailiseJqueryFileUploadAction()
    {
    	$user_id = Auth_UserAdapter::getIdentity()->getId();
    	$upload_handler = new Jqueryfileuploader_uploadhandler(
    			array(
    					'script_url' => PROJECT_URL.'/'.PROJECT_NAME.'mail/initailise-jquery-file-upload',
    					'upload_dir' => SERVER_PUBLIC_PATH.'/imails/temp/user_'.$user_id.'/',
    					'upload_url' => PUBLIC_PATH.'/imails/temp/user_'.$user_id.'/',
    					'user_dirs' => false,
    					'mkdir_mode' => 0755,
    					'param_name' => 'files',
    					// Set the following option to 'POST', if your server does not support
    					// DELETE requests. This is a parameter sent to the client:
    					'delete_type' => 'DELETE',
    					'access_control_allow_origin' => '*',
    					'access_control_allow_credentials' => false,
    					'access_control_allow_methods' => array(
    							'OPTIONS',
    							'HEAD',
    							'GET',
    							'POST',
    							'PUT',
    							'PATCH',
    							'DELETE'
    					),
    					'access_control_allow_headers' => array(
    							'Content-Type',
    							'Content-Range',
    							'Content-Disposition'
    					),
    					// Enable to provide file downloads via GET requests to the PHP script:
    					//     1. Set to 1 to download files via readfile method through PHP
    					//     2. Set to 2 to send a X-Sendfile header for lighttpd/Apache
    					//     3. Set to 3 to send a X-Accel-Redirect header for nginx
    					// If set to 2 or 3, adjust the upload_url option to the base path of
    					// the redirect parameter, e.g. '/files/'.
    					'download_via_php' => false,
    					// Read files in chunks to avoid memory limits when download_via_php
    					// is enabled, set to 0 to disable chunked reading of files:
    					'readfile_chunk_size' => 10 * 1024 * 1024, // 10 MiB
    					// Defines which files can be displayed inline when downloaded:
    					//'inline_file_types' => '/\.(gif|jpe?g|png|docx|doc|pdf|txt)$/i',
    					'inline_file_types' => '/.+$/i',
    					// Defines which files (based on their names) are accepted for upload:
    				 	'accept_file_types' => '/.+$/i',
    					//'accept_file_types' => '/\.(gif|jpe?g|png|docx|doc|pdf|txt)$/i',
    					// The php.ini settings upload_max_filesize and post_max_size
    					// take precedence over the following max_file_size setting:
    					'max_file_size' => null,
    					'min_file_size' => 1,
    					// The maximum number of files for the upload directory:
    					'max_number_of_files' => null,
    					// Defines which files are handled as image files:
    					'image_file_types' => '/\.(gif|jpe?g|png)$/i',
    					// Use exif_imagetype on all files to correct file extensions:
    					'correct_image_extensions' => false,
    					// Image resolution restrictions:
    					'max_width' => null,
    					'max_height' => null,
    					'min_width' => 1,
    					'min_height' => 1,
    					// Set the following option to false to enable resumable uploads:
    					'discard_aborted_uploads' => true,
    					// Set to 0 to use the GD library to scale and orient images,
    					// set to 1 to use imagick (if installed, falls back to GD),
    					// set to 2 to use the ImageMagick convert binary directly:
    					'image_library' => 1,
    					// Uncomment the following to define an array of resource limits
    					// for imagick:
    					/*
    					 'imagick_resource_limits' => array(
    					 		imagick::RESOURCETYPE_MAP => 32,
    					 		imagick::RESOURCETYPE_MEMORY => 32
    					 ),
    	*/
    					// Command or path for to the ImageMagick convert binary:
    					'convert_bin' => 'convert',
    					// Uncomment the following to add parameters in front of each
    					// ImageMagick convert call (the limit constraints seem only
    					// to have an effect if put in front):
    					/*
    					 'convert_params' => '-limit memory 32MiB -limit map 32MiB',
    	*/
    					// Command or path for to the ImageMagick identify binary:
    					'identify_bin' => 'identify',
    					'image_versions' => array(
    							// The empty image version key defines options for the original image:
    							// Uncomment the following to create medium sized images:
    							/*
    							 'medium' => array(
    							 		'max_width' => 800,
    							 		'max_height' => 600
    							 ),
    	*/
    					),
    					'disableImagePreview' => true,
    					'print_response' => true
    			)
    	);
    	die;
    }
    
    
    /**
     * Initialing the Blueimp jquery file upload for reply imails
     *
     * @author jsingh7
     * @author sjaiswal
     * @version 1.1
     */
    public function initailiseJqueryFileUploadReplyAction()
    {
    	$user_id = Auth_UserAdapter::getIdentity()->getId();
    	$upload_handler = new Jqueryfileuploader_uploadhandler(
    			array(
    					'script_url' => PROJECT_URL.'/'.PROJECT_NAME.'mail/initailise-jquery-file-upload-reply',
    					'upload_dir' => SERVER_PUBLIC_PATH.'/imails/temp/reply/user_'.$user_id.'/',
    					'upload_url' => PUBLIC_PATH.'/imails/temp/reply/user_'.$user_id.'/',
    					'user_dirs' => false,
    					'mkdir_mode' => 0755,
    					'param_name' => 'files',
    					// Set the following option to 'POST', if your server does not support
    					// DELETE requests. This is a parameter sent to the client:
    					'delete_type' => 'DELETE',
    					'access_control_allow_origin' => '*',
    					'access_control_allow_credentials' => false,
    					'access_control_allow_methods' => array(
    							'OPTIONS',
    							'HEAD',
    							'GET',
    							'POST',
    							'PUT',
    							'PATCH',
    							'DELETE'
    					),
    					'access_control_allow_headers' => array(
    							'Content-Type',
    							'Content-Range',
    							'Content-Disposition'
    					),
    					// Enable to provide file downloads via GET requests to the PHP script:
    					//     1. Set to 1 to download files via readfile method through PHP
    					//     2. Set to 2 to send a X-Sendfile header for lighttpd/Apache
    					//     3. Set to 3 to send a X-Accel-Redirect header for nginx
    					// If set to 2 or 3, adjust the upload_url option to the base path of
    					// the redirect parameter, e.g. '/files/'.
    					'download_via_php' => false,
    					// Read files in chunks to avoid memory limits when download_via_php
    					// is enabled, set to 0 to disable chunked reading of files:
    					'readfile_chunk_size' => 10 * 1024 * 1024, // 10 MiB
    					// Defines which files can be displayed inline when downloaded:
    					//'inline_file_types' => '/\.(gif|jpe?g|png|docx|doc|pdf|txt)$/i',
    					'inline_file_types' => '/.+$/i',
    					// Defines which files (based on their names) are accepted for upload:
    					// 						'accept_file_types' => '/.+$/i',
    					//'accept_file_types' => '/\.(gif|jpe?g|png|docx|doc|pdf|txt)$/i',
    					'accept_file_types' => '/.+$/i',
    					// The php.ini settings upload_max_filesize and post_max_size
    					// take precedence over the following max_file_size setting:
    					'max_file_size' => null,
    					'min_file_size' => 1,
    					// The maximum number of files for the upload directory:
    					'max_number_of_files' => null,
    					// Defines which files are handled as image files:
    					'image_file_types' => '/\.(gif|jpe?g|png)$/i',
    					// Use exif_imagetype on all files to correct file extensions:
    					'correct_image_extensions' => false,
    					// Image resolution restrictions:
    					'max_width' => null,
    					'max_height' => null,
    					'min_width' => 1,
    					'min_height' => 1,
    					// Set the following option to false to enable resumable uploads:
    					'discard_aborted_uploads' => true,
    					// Set to 0 to use the GD library to scale and orient images,
    					// set to 1 to use imagick (if installed, falls back to GD),
    					// set to 2 to use the ImageMagick convert binary directly:
    					'image_library' => 1,
    					// Uncomment the following to define an array of resource limits
    					// for imagick:
    					/*
    					 'imagick_resource_limits' => array(
    					 		imagick::RESOURCETYPE_MAP => 32,
    					 		imagick::RESOURCETYPE_MEMORY => 32
    					 ),
    	*/
    					// Command or path for to the ImageMagick convert binary:
    					'convert_bin' => 'convert',
    					// Uncomment the following to add parameters in front of each
    					// ImageMagick convert call (the limit constraints seem only
    					// to have an effect if put in front):
    					/*
    					 'convert_params' => '-limit memory 32MiB -limit map 32MiB',
    	*/
    					// Command or path for to the ImageMagick identify binary:
    					'identify_bin' => 'identify',
    					'image_versions' => array(
    							// The empty image version key defines options for the original image:
    							// Uncomment the following to create medium sized images:
    							/*
    							 'medium' => array(
    							 		'max_width' => 800,
    							 		'max_height' => 600
    							 ),
    	*/
    					),
    					'disableImagePreview' => true,
    					'print_response' => true
    			)
    	);
    	die;
    }
    
    
    /**
     * Initialing the Blueimp jquery file upload for forward imails
     *
     * @author jsingh7
     * @author sjaiswal
     * @version 1.0
     */
    public function initailiseJqueryFileUploadForwardAction()
    {
    	$user_id = Auth_UserAdapter::getIdentity()->getId();
    	$upload_handler = new Jqueryfileuploader_uploadhandler(
    			array(
    					'script_url' => PROJECT_URL.'/'.PROJECT_NAME.'mail/initailise-jquery-file-upload-forward',
    					'upload_dir' => SERVER_PUBLIC_PATH.'/imails/temp/forward/user_'.$user_id.'/',
    					'upload_url' => PUBLIC_PATH.'/imails/temp/forward/user_'.$user_id.'/',
    					'user_dirs' => false,
    					'mkdir_mode' => 0755,
    					'param_name' => 'files',
    					// Set the following option to 'POST', if your server does not support
    					// DELETE requests. This is a parameter sent to the client:
    					'delete_type' => 'DELETE',
    					'access_control_allow_origin' => '*',
    					'access_control_allow_credentials' => false,
    					'access_control_allow_methods' => array(
    							'OPTIONS',
    							'HEAD',
    							'GET',
    							'POST',
    							'PUT',
    							'PATCH',
    							'DELETE'
    					),
    					'access_control_allow_headers' => array(
    							'Content-Type',
    							'Content-Range',
    							'Content-Disposition'
    	),
    					// Enable to provide file downloads via GET requests to the PHP script:
    					//     1. Set to 1 to download files via readfile method through PHP
    					//     2. Set to 2 to send a X-Sendfile header for lighttpd/Apache
    					//     3. Set to 3 to send a X-Accel-Redirect header for nginx
    					// If set to 2 or 3, adjust the upload_url option to the base path of
    					// the redirect parameter, e.g. '/files/'.
    					'download_via_php' => false,
    					// Read files in chunks to avoid memory limits when download_via_php
    					// is enabled, set to 0 to disable chunked reading of files:
    					'readfile_chunk_size' => 10 * 1024 * 1024, // 10 MiB
    					// Defines which files can be displayed inline when downloaded:
    					//'inline_file_types' => '/\.(gif|jpe?g|png|docx|doc|pdf|txt)$/i',
    					'inline_file_types' => '/.+$/i',
    					// Defines which files (based on their names) are accepted for upload:
    					// 						'accept_file_types' => '/.+$/i',
    					//'accept_file_types' => '/\.(gif|jpe?g|png|docx|doc|pdf|txt)$/i',
    					'accept_file_types' => '/.+$/i',
    					// The php.ini settings upload_max_filesize and post_max_size
    					// take precedence over the following max_file_size setting:
    					'max_file_size' => null,
    					'min_file_size' => 1,
    					// The maximum number of files for the upload directory:
    					'max_number_of_files' => null,
    					// Defines which files are handled as image files:
    					'image_file_types' => '/\.(gif|jpe?g|png)$/i',
    					// Use exif_imagetype on all files to correct file extensions:
    					'correct_image_extensions' => false,
    					// Image resolution restrictions:
    					'max_width' => null,
    					'max_height' => null,
    					'min_width' => 1,
    					'min_height' => 1,
    					// Set the following option to false to enable resumable uploads:
    					'discard_aborted_uploads' => true,
    					// Set to 0 to use the GD library to scale and orient images,
    					// set to 1 to use imagick (if installed, falls back to GD),
    					// set to 2 to use the ImageMagick convert binary directly:
    					'image_library' => 1,
    					// Uncomment the following to define an array of resource limits
    					// for imagick:
    					/*
    					 'imagick_resource_limits' => array(
    					 		imagick::RESOURCETYPE_MAP => 32,
    					 		imagick::RESOURCETYPE_MEMORY => 32
    					 ),
    	*/
    	// Command or path for to the ImageMagick convert binary:
    	'convert_bin' => 'convert',
    	// Uncomment the following to add parameters in front of each
    	// ImageMagick convert call (the limit constraints seem only
    	// to have an effect if put in front):
    	/*
    	 'convert_params' => '-limit memory 32MiB -limit map 32MiB',
    	*/
    	// Command or path for to the ImageMagick identify binary:
    	'identify_bin' => 'identify',
    	'image_versions' => array(
    	// The empty image version key defines options for the original image:
    	// Uncomment the following to create medium sized images:
    	/*
    	 'medium' => array(
    	 		'max_width' => 800,
    	 		'max_height' => 600
    	 ),
    	*/
    	),
    					'disableImagePreview' => true,
    					'print_response' => true
    			)
    	);
    	die;
    }
    
    
    /**
     * Delete the files from the temp location of imail attachment folder
     *
     * @author sjaiswal
     * @version 1.0
     *
     */
    public function discardAttachmentsForReplyAction()
    {
    	$user_id = Auth_UserAdapter::getIdentity()->getId();
    	
    	if(Helper_common::deleteDir(SERVER_PUBLIC_PATH.'/imails/temp/reply/user_'.$user_id.'/'))
    	{
    		echo Zend_Json::encode(1);
    	}
    	else
    	{
    		echo Zend_Json::encode(0);
    	}
    	die();
    }

    /**
     * Delete the files from the temp location of imail attachment folder in case of forward.
     *
     * @author sjaiswal
     * @version 1.0
     *
     */
    public function discardAttachmentsForForwardAction()
    {
    	$user_id = Auth_UserAdapter::getIdentity()->getId();
    	
    	if(Helper_common::deleteDir(SERVER_PUBLIC_PATH.'/imails/temp/forward/user_'.$user_id.'/'))
    	{
    		echo Zend_Json::encode(1);
    	}
    	else
    	{
    		echo Zend_Json::encode(0);
    	}
    	die();
    }
    
    
    
    
    /**
     * Delete the files from the temp location of imail attachment folder
     *
     * @author sjaiswal
     * @version 1.0
     *
     */
    
    public function discardAttachmentsForComposeAction()
    {
    	$user_id = Auth_UserAdapter::getIdentity()->getId();
    	
    	if(Helper_common::deleteDir(SERVER_PUBLIC_PATH.'/imails/temp/user_'.$user_id.'/'))
    	{
    		echo Zend_Json::encode(1);
    	}
    	else
    	{
    		echo Zend_Json::encode(0);
    	}
    	die();
    	 
    }

	/**
	 * Copy attached images to temp folder in user_logged_id directory.
	 * Create new diectory if not exists to copy images.
	 *
	 * params Array files
	 * @author ssharma4
	 */
	public function copyForwardedFilesToTempFolderAction()
	{
		$params = $this->_request->getParams();
		$user_id = Auth_UserAdapter::getIdentity()->getId();
		for($i=0;$i<count($params['files']['attachments']);$i++){

			if(!is_dir('imails/temp/forward/user_'.$user_id)):
				mkdir('imails/temp/forward/user_'.$user_id);
			endif;
			// source folder or file
			 $src = 'imails/imail_'.$params["files"]["msg_id"].'_'.$params["files"]["folder_id"].'/'.$params["files"]["attachments"][$i]["name"];
			// destination folder or file
			$dest = 'imails/temp/forward/user_'.$user_id.'/'.$params["files"]["attachments"][$i]["name"];

			copy($src, $dest);
		}
		echo 'success';die;
	}
}