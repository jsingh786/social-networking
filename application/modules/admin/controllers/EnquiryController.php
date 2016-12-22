<?php

class Admin_EnquiryController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
        
    	
    }
   
    
    /**
     * checking uploaded attachments size 
     * @return boolean(1 for uploaded size less than 20MB)
     * @author sjaiswal
     *
     */
    
    public function checkAttachmentsSizeAction()
    {
    	$params = $this->getRequest()->getParams(); 
    	$total_size_of_uploaded_files = Helper_SizeHandler::getTotalSizeInMb($params['uploads']);
    	
    	if($total_size_of_uploaded_files > 20)
    	{
    		echo Zend_Json::encode(0);	
    	}
    	else 
    	{
    		echo Zend_Json::encode(1);
    	}
    	die;
    	
    }
    
    /**
     * reply for enquiry
     * @author sjaiswal
     *
     */
    
    public function replyAction()
    {
    	$params = $this->getRequest()->getParams();
    	
    	// check if user email is existing ilook user email
    	$checkEmailExist = Extended\ilook_user::getActiveUserIdByEmail ( $params ['email_id'] );
    	
    		$admin_obj = Extended\ilook_user::getUserInfoByUserType(Extended\ilook_user::USER_TYPE_ADMIN);
    		$sender_username = $admin_obj->getFirstname()." ".$admin_obj->getLastname();
    		
    		$bodyText =
    		'Here is reply for your enquiry
    		<br />
    		<b>'.$params['body'].'</b>
    		<br />
    		<br />';
    		
    		$recipent_email = $params['email_id'];
    		$subject = "Reply to your enquiry.";
    		
    		// check if user who enquired is ilook user
    		if($checkEmailExist['id'])
    		{
	    		$user_obj = \Extended\ilook_user::getRowObject($checkEmailExist['id']);
	    		$receiver_username = $user_obj->getFirstname()." ".$user_obj->getLastname();
    		
	    		$usrIDArr = array($checkEmailExist['id']);
	    		$message_info = Helper_common::sendMessage($admin_obj->getId(),
														$usrIDArr, 
														$subject, 
														$params['body'], 
														Extended\message::MSG_TYPE_ENQUIRY,
														$params['uploads'],
														$save_sent_items = false,
														'',
														'',
														'',
														'',
														'',
														'',
													    11,
														$params['enquiry_id']
														);
	    	
	    		Email_Mailer::sendMail ( $subject,
					$bodyText,
					'User',
					$recipent_email,
					$message_info['attachment_file_name'],
					Email_Mailer::DEFAULT_SENDER_NAME,
					Email_Mailer::DEFAULT_SENDER_EMAIL,
					Email_Mailer::DEFAULT_SALUTATION,
					Email_Mailer::DEFAULT_COMPLIMENTARY_CLOSING
					) ;

	    		
	    	 }
	    	else // case of non-ilook user
	    	{
	    		if($params['uploads'])
	    		{
	    			foreach($params['uploads'] as $key => $upload)
	    			{
		    			$temp_file_path = REL_IMAIL_ATTACHMENT_PATH."\\temp\\";
		    			if ( !file_exists( $temp_file_path ) )
		    			{
		    				@mkdir( $temp_file_path, 0777, true );
		    			}
		    			//moves uploaded files from temporary location to permanent loaction.
		    			
		    			$temp_file_name = REL_IMAIL_ATTACHMENT_PATH."\\temp\\".$upload['ts_file_name'];
		    			 
		    			$user_folder = REL_IMAIL_ATTACHMENT_PATH."\\imail_default\\";
		    			
		    			if ( !file_exists( $user_folder ) )
		    			{
		    				@mkdir( $user_folder, 0777, true );
		    			}
		    			// copy temp file to user folder
		    			@copy($temp_file_name, $user_folder.$upload['ts_file_name']);
		    			
		    			// unlink temp file
		    			@unlink($temp_file_name);
		    			
		    			// attachment file name with location
		    			//$message_info['attachment_file_name'][$key] = PUBLIC_PATH."\\".REL_IMAIL_ATTACHMENT_PATH."\\imail_default\\".$upload['ts_file_name'];
		    			$message_info['attachment_file_name'][$key] = REL_IMAIL_ATTACHMENT_PATH."\\imail_default\\".$upload['ts_file_name'];
		    			
	    			}
	    		
	    			
	    			//Email_MailerPHP::sendMail ( $subject, $bodyText, 'User', $recipent_email,$message_info['attachment_file_name']) ;
	    			Email_Mailer::sendMail ( $subject,
						$bodyText,
						'User',
						$recipent_email,
						$message_info['attachment_file_name'],
						Email_Mailer::DEFAULT_SENDER_NAME,
						Email_Mailer::DEFAULT_SENDER_EMAIL,
						Email_Mailer::DEFAULT_SALUTATION,
						Email_Mailer::DEFAULT_COMPLIMENTARY_CLOSING
					) ;
	    		}
	    			
	    		}
	    		
    			echo Zend_Json::encode(1);
    			die;
    
     
    }
      
    /**
     * get enquiry details
     * @author sjaiswal
     *
     */
    
    public function enquiryDetailsAction()
    {
    	//Post parameters recieved from ajax call.
    	$params = $this->getRequest()->getParams();
  
    	if( $params['enquiry_id'] )
    	{
    		$enquiry_details = \Extended\enquiry::getEnquiryDetails($params['enquiry_id']);
    		
    		$result = array();
    		$result['enquiry_id'] = $enquiry_details->getId();
    		$result['type'] = $enquiry_details->getType();
    		$result['phone_number'] = $enquiry_details->getPhone_number();
    		$result['subject'] = $enquiry_details->getSubject();
    		$result['body'] = $enquiry_details->getBody();
    		$result['email_id'] = $enquiry_details->getEmail_id();
    		$result['created_at_date'] = ($enquiry_details->getCreated_at())?($enquiry_details->getCreated_at()->format( "M j, Y" )):"";
    		$result['created_at_time'] = ($enquiry_details->getCreated_at())?($enquiry_details->getCreated_at()->format( "H:i" )):"";
    		$result['final_date_time'] = ($enquiry_details->getCreated_at())?('On'.$enquiry_details->getCreated_at()->format( "jS F Y, g:i A" )):"";
    		
    		if($enquiry_details->getIlookUser())
    		{
    			$result['user_id'] = $enquiry_details->getIlookUser()->getId();
    			$result['sender_firstname'] = $enquiry_details->getilookUser()->getFirstname();
    			$result['sender_lastname'] = $enquiry_details->getilookUser()->getLastname();
    		}
    		else
    		{
    			$result['sender_firstname'] = "New";
    			$result['sender_lastname'] = "User";
    		}
    		 
    		echo Zend_Json::encode( $result );
    		die; 
    	}
    
    }
    
    
    /**
     * view details for enquiry
     * @author sjaiswal
     *
     */
    
    public function viewAction()
    {
    	//Post parameters recieved from ajax call.
    	$params = $this->getRequest()->getParams();
    	 
    	if( $params['enquiry_id'] )
    	{
    		$enquiry_details = \Extended\enquiry::getEnquiryDetails($params['enquiry_id']);
    		 //Zend_Debug::dump($enquiry_details->getEnquiryAttachment()->getName()); die();
    		$respose_array = array();
    		$view_data = array();
    		
    		$response_array['id'] = $enquiry_details->getId();
    		$response_array['phone_number'] = $enquiry_details->getPhone_number();
    		$response_array['email_id'] = $enquiry_details->getEmail_id();
    		$response_array['subject'] = $enquiry_details->getSubject();
    		$response_array['description'] = $enquiry_details->getBody();
    		if(($enquiry_details->getEnquiryAttachment()))
    		{
	    		foreach($enquiry_details->getEnquiryAttachment()  as $key => $attachment)
	    		{
	    			$attachment_data[$key]['attachment_file'] = $attachment->getName();
	    			$attachment_data[$key]['actual_name'] = $attachment->getActual_name();
	    		
	    		}
    		}
    		
    		$response_array['attachment_data'] = $attachment_data;
    		
    		echo Zend_Json::encode( $response_array );
    		die;
    	}
    
    }

    /**
     * get all jobs
     * @author sjaiswal
     *
     */
    public function getAllEnquiryAction()
    {
    	//Post parameters recieved from ajax call.
    	$params = $this->getRequest()->getParams();
    
    	//Zend_Debug::dump($params); die;
    	//columns to be filtered with filter text.
    	$filter_columns = array();
    	$filter_columns[] = "enquiry.type";
    	$filter_columns[] = "enquiry.email_id";
    	$filter_columns[] = "enquiry.phone_number";
    	$filter_columns[] = "enquiry.subject";
    	$filter_columns[] = "enquiry.body";

		$params['countryFilterValue'] = isset($params['countryFilterValue'])?$params['countryFilterValue']:NULL;
    	//Call to method which makes query.
    	$enquiry_collec = \Extended\enquiry::getEnquiryByParameters( $params['limit'],
    			$params['offset'],
    			$params['sort_column'],
    			$params['sort_column_alias'],
    			$params['sort_column_order'],
    			$filter_columns,
    			$params['filterText'],
    			$params['countryFilterValue'] );
    	
    	//For total records.
    	$total_enquiry_collec = \Extended\enquiry::getEnquiryByParameters( null,
    			0,
    			$params['sort_column'],
    			$params['sort_column_alias'],
    			$params['sort_column_order'],
    			$filter_columns,
    			$params['filterText'],
    			$params['countryFilterValue'] );
    
    	$params['total_records'] = count( $total_enquiry_collec );
    	$params['total_pages'] = ceil( count($total_enquiry_collec)/$params['limit'] );
    	$params['current_page'] = ceil( ( $params['offset']/$params['limit'] ) + 1 );
    
    	$respose_array = array();
    	$grid_data_array = array();
    	if( $enquiry_collec )
    	{
    		
    		 foreach ($enquiry_collec as $key=>$enquiry_obj)
    		{
    			if($enquiry_obj[0]->getType() == 1){$type = "Advertisement";}
    			elseif($enquiry_obj[0]->getType() == 2){$type = "Enquiry";}
    			elseif($enquiry_obj[0]->getType() == 3){$type = "Feedback";}
    			$grid_data_array[$key]['id'] 				= $enquiry_obj[0]->getId();
    			$grid_data_array[$key]['number'] 			= $key+intval($params['offset'])+1;
    			$grid_data_array[$key]['type'] 				= $type;
    			$grid_data_array[$key]['phone_number'] 		= $enquiry_obj[0]->getPhone_number();
    			$grid_data_array[$key]['email_id'] 			= $enquiry_obj[0]->getEmail_id();
    			$grid_data_array[$key]['subject'] 			= $enquiry_obj[0]->getSubject();
    			$grid_data_array[$key]['description'] 		= $enquiry_obj[0]->getBody();
    			//$grid_data_array[$key]['attachment_file'] 	= $enquiry_obj['attachment_file'];
    	
    			
   				/* if(!empty($enquiry_obj['attachment_file']))
     			{
     				$grid_data_array[$key]['attachment_file']= $enquiry_obj['attachment_file'];
     			}
    			else
    			{
     				$grid_data_array[$key]['attachment_file'] = "NA";
    			} */
    			 
    		
    			 
    		} 
    	}
    
    	$respose_array['params'] = $params;
    	$respose_array['enquiry_data'] = $grid_data_array;
    
    	echo Zend_Json::encode( $respose_array );
    	die;
    }
    
    /**
     * function used to delete Job..
     *
     * @param  $enquiryId
     * @author sjaiswal
     * @return array
     */
    public function deleteEnquiryAction(){
    
    	
    	$params = $this->getRequest()->getParams();
    	
    	$ids_r = array_filter($this->getRequest()->getParam('ids_r'));
    	 
    	foreach($ids_r as $enquiry_id)
    	{
    		$enquiryId = \Extended\enquiry::deleteEnquiry( $enquiry_id);
    		
    		if($enquiryId)
    		{
    			// delete enquiry attachment directory
    			Helper_common::deleteDir(SERVER_PUBLIC_PATH.'/enquiry/enquiry_'.$enquiryId.'/');
    			
    		}
    	}
    	echo Zend_Json::encode(1);
    	die;
    	
    }
    
    
    /**
     * This action is used for moving uploaded files to
     * temprory location. Becuase user has not sumitted his query yet.
     * The temp location for Enquiry files is user specific.
     *
     * It is must that if user leave the form without submitting the
     * Enquiry then in that case files should be deleted.
     *
     * @author jsingh7
     * @version 1.0
     * @return void
     */
    public function moveUploadedFilesToTempLocationAction()
    {
  
    	$response_arr = array();
    
    	$adapter = new Zend_File_Transfer_Adapter_Http();
    
    	$response_arr['success'] = 0;
    	$response_arr['message'] = 'Uploading initiated.';
    
    	$adapter->setValidators(array(
    			'Size'  => array('min' => 0, 'max' => 20971520) //0KB to 20MB
    	));
    	 
    	//     	$adapter->addValidator('Extension', true,
    	//     			'jpg,jpeg,png,gif');
    	 
    	 
    	$adapter->getValidator("size")->setMessages(array(
    			Zend_Validate_File_Size::TOO_BIG       => "The size of a file you trying to upload, exceeds 20MB, Please try smaller file"
    	));
    	 
    	//If file is not valid.
    	if( !$adapter->isValid() )
    	{
    		$return_r['is_success'] = 0;
    		foreach ( $adapter->getMessages() as $msg )
    		{
    			$response_arr['message'] = $msg.". ";
    		}
    		$response_arr['success'] = 0;
    		echo Zend_Json::encode( $response_arr );
    		die;
    	}
   
    	if( !$adapter->getFileInfo() )//File not uploaded.
    	{
    		$response_arr['success'] = 0;
    		$response_arr['message'] = 'Please upload some file.';
    		echo Zend_Json::encode( $response_arr );
    		die;
    	}
    	else
    	{
    		$mime_type 		= $adapter->getMimeType();
    		$file_info 		= $adapter->getFileInfo();
    		$temp_path 		= $file_info['file']['tmp_name'];//temp path, where from move.
    		$fname 			= $file_info['file']['name'];
    		$size 			= $adapter->getFileSize();
    
    		$unique_name_for_user_temp_folder = uniqid();
    		
    		$ts_file_name = Helper_common::getUniqueNameForFile($fname);
    
    		$temp_loc = REL_IMAIL_ATTACHMENT_PATH."\\temp";
    
    		@mkdir( $temp_loc, 0777, true );
    
    		$adapter->setDestination( realpath( $temp_loc ) );
    		$filterFileRename = new Zend_Filter_File_Rename(
    				array(
    						'target' => $ts_file_name, 'overwrite' => true
    				));
    		$adapter->addFilter( $filterFileRename );
    
    		if( $adapter->receive() ){
    			$response_arr['success'] 						= 1;
    			$response_arr['message'] 						= 'File uploaded to temp location successfully.';
    			$response_arr['unique_name_for_user_temp_folder'] = $unique_name_for_user_temp_folder;
    			$response_arr['ts_file_name'] = $ts_file_name;
    			$response_arr['ts_file_size'] = $size;
    			$response_arr['ts_actual_file_name'] = $fname;
    			 
    		}
    
    		echo Zend_Json::encode( $response_arr );
    		die;
    
    	}
    }
    
    /**
     * Delete the files from the temp location of imail attachment folder.
     * Attachments name comes as a post parameter.
     *
     * @author sjaiswal
     * @version 1.0
     *
     */
    public function discardAttachmentsAction()
    {
    	$params = $this->getRequest()->getParams();
    	$temp_file_name = REL_IMAIL_ATTACHMENT_PATH."\\temp\\".$params['files'];
    	if ( file_exists( $temp_file_name ) )
    	{
    		$temp_file_unlink = unlink($temp_file_name);
    	}
    	if($temp_file_unlink)
    	{
    		echo Zend_Json::encode($params['files']);
    	}
    	die;
    }
    
    /**
     * compose mail by admin
     * @author sjaiswal
     * @version 1.0
     *
     */
    public function composeMailAction()
    {
    	$params = $this->getRequest()->getParams();
    
    	$params['receiver_ids'] = explode(",", $params['receiver_ids']);
    	
    	/* $total_size_of_uploaded_files = Helper_SizeHandler::getTotalSizeInMb($params['uploads']);
    	
    	if($total_size_of_uploaded_files > 20)
    	{
    		echo Zend_Json::encode(0);
    		die;
    	} */
  
    		$admin_obj = Extended\ilook_user::getUserInfoByUserType(Extended\ilook_user::USER_TYPE_ADMIN);
    		
    		$sender_username = $admin_obj->getFirstname()." ".$admin_obj->getLastname();
  
    		$message_info = Helper_common::sendMessage($admin_obj->getId(), 
    													$params['receiver_ids'], 
    													$params['subject'], 
    													$params['message_body'],
    													Extended\message::MSG_TYPE_ENQUIRY,
    													$params['uploads'],
														NULL,
    													$save_sent_items = false);
    		//Zend_Debug::dump($message_info); die();
    			
    			foreach( $params['receiver_ids'] as $receiver_id)
    			{
    				$user_detail = \Extended\ilook_user::getUserdetailById($receiver_id);
    				//Zend_Debug::dump($user_detail['firstname'].''.$user_detail['lastname']); die;
    			
    				if($receiver_id)
    				{
    					 \Email_Mailer::sendMail($params['subject'],
    							$params['message_body'],
    							ucfirst($user_detail['firstname']).' '.$user_detail['lastname'],
    							$user_detail['email'],
    							$message_info['attachment_file_name'],
    							$sender_username,
    							$admin_obj->getEmail(),
    							"Hello ",
    							"Best Regards"
    							);
    				}
    			}
    		
    		echo Zend_Json::encode(1);
    	
    		die;
    	}
    	
}

