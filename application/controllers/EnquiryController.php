<?php

class EnquiryController extends Zend_Controller_Action
{
	
    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
        // action body
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
    			'Size'  => array('min' => 1024, 'max' => 10485760) //1KB to 10MB
    	));
    	
//     	$adapter->addValidator('Extension', true,
//     			'jpg,jpeg,png,gif');
    	
    	
    	$adapter->getValidator("size")->setMessages(array(
    			Zend_Validate_File_Size::TOO_BIG       => "The size of a file you trying to upload, exceeds 10MB, Please try smaller file"
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
    		
    		$temp_loc = REL_ENQUIRY_ATTACHMENT_PATH."\\temp";
    		
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
	 * Saves enquiry data in to enquiry tables in database
	 * Also moves uploaded files from temporary location to permanent location.
	 * 
	 * @author Jsingh7
	 * @author sjaiswal
	 * @version 1.1
	 * @return void
	 */
	public function sendEnquiryAction()
	{
		//Saves enquiry data in to enquiry tables in database
		$params = $this->getRequest()->getParams();
		$enquiry_id = \Extended\enquiry::addEnquiry($params);
		
		if($enquiry_id)
		{	
			if(isset($params['uploads']))
			{
				foreach($params['uploads'] as $upload)
				{
					// add attachment entry to database
					$result = \Extended\enquiry_attachment::addEnquiryAttachment($enquiry_id,$upload);
					
					//moves uploaded files from temporary location to permanent loaction.
			
					 $temp_file_name = REL_ENQUIRY_ATTACHMENT_PATH."\\temp\\".$upload['ts_file_name'];
					
					 $enquiry_folder = REL_ENQUIRY_ATTACHMENT_PATH."\\enquiry_".$enquiry_id."\\";
					 
					
					if ( !file_exists( $enquiry_folder ) )
	    			{
						@mkdir( $enquiry_folder, 0777, true );
					}
					// copy temp file to user folder
					copy($temp_file_name, $enquiry_folder.$upload['ts_file_name']);
					
					// unlink temp file
					unlink($temp_file_name);
					
				}
		 }
		 echo Zend_Json::encode(1);
		}
		
		die;
		
	}
	
	/**
	 * Delete the files from the temp location of enquiry attachment folder.
	 * Attachments name comes as a post parameter.
	 * 
	 * @author sjaiswal
	 * @version 1.0
	 * 
	 */
    public function discardAttachmentsAction()
    {
    	$params = $this->getRequest()->getParams();
    	$temp_file_name = REL_ENQUIRY_ATTACHMENT_PATH."\\temp\\".$params['files'];
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
     * checking uploaded attachments size
     * @return boolean(1 for uploaded size less than 20MB)
     * @author sjaiswal
     *
     */  
    public function checkAttachmentsSizeAction()
    {
    	$params = $this->getRequest()->getParams();
    	if(isset($params['uploads'])) {
		
    	$total_size_of_uploaded_files = Helper_SizeHandler::getTotalSizeInMb($params['uploads']);
    
    	if($total_size_of_uploaded_files > 20)
    	{
    		echo Zend_Json::encode(0);
    	}
    	else
    	{
    		echo Zend_Json::encode(1);
    	}
		} else {
		echo Zend_Json::encode(1);
		}		
    	die;
    	 
    }
}

