<?php
class SocialiseController extends Zend_Controller_Action
{
     /**
     * This function checks auth storage and
     * manage redirecting.
     *
     * @author Jaskaran
     * @since 20 June, 2012
     * @version 1.0
     * @see Zend_Controller_Action::preDispatch()
     *
     */
    public function preDispatch()
    {
         if ( !Auth_UserAdapter::hasIdentity() )
         {
             $this->_helper->redirector( 'index', 'index' );
         }
    }
    public function init()
    {
        /* Initialize action controller here */
    	
    }

    public function indexAction()
    {
        // action body
		if( Auth_UserAdapter::hasIdentity() )
		{
			  $this->_helper->redirector("index", "dashboard");
		}
		else
		{
			  $this->_helper->redirector("index", "index");
		}
    }

    public function photoFeedAction()
    {
        // action body 	
    	$exclude_this_wish = array();
        $wishes = \Extended\wishes::getWishesForUser( Auth_UserAdapter::getIdentity()->getId(),5, 0 );

        Foreach ($wishes['data'] as $wish)
        {
        	if(\Extended\wishes::didUserCommentedOndWish($wish->getId(), Auth_UserAdapter::getIdentity()->getId()))
        	{
        		$exclude_this_wish[] =$wish->getId();
        	}
        }
      
        $this->view->exclude_this_wish = $exclude_this_wish;
        $this->view->wishes_collec = $wishes['data'];
        $this->view->count_wishes = count($wishes['data']);
        $this->view->is_more_wishes = $wishes['is_more_records'];
	}
    
    /**
     * Uploads photo for default album.
     * 
     * @author jsingh7
     * @version 1.0
     */
    public function uploadDefaultAlbumPhotoAction()
    {
	    // action body
	    $return_r = array();
	    $return_r['is_success'] = 0;
	    $return_r['msg'] = "Process initiated";
    
     	$adapter = new Zend_File_Transfer_Adapter_Http();
     
     	$adapter->setValidators(array(
              'Size'  => array('min' => 1024, 'max' => 5242880) 
    	));
    
     	$adapter->addValidator('Extension', true,
              'jpg,jpeg,png,gif');

    	$adapter->getValidator("size")->setMessages(array(
              Zend_Validate_File_Size::TOO_BIG       => "The size of a file you trying to upload, exceeds 5MB, Please try smaller file",
              Zend_Validate_File_Size::TOO_SMALL      => "The size of a file you trying to upload, is too small, Please try file of atleast 1KB size"
    	));
    
     	$adapter->getValidator("upload")->setMessages(array(
              Zend_Validate_File_Upload::INI_SIZE      => "Please select photo/image to post a feed"
    	));
    
// 		REQUIRED APC NOR UPLOADPROGRESS EXTENSION INSTALLED.
		$upload  = Zend_File_Transfer_Adapter_Http::getProgress();
		while (!$upload['done']) 
		{
			$upload = Zend_File_Transfer_Adapter_Http::getProgress($upload);
			//print "\nActual progress:".$upload['message'];
			// do whatever you need
		}
    
	     //If file is not valid.
    	if( !$adapter->isValid() )
    	{
			$return_r['is_success'] = 0;
			foreach ( $adapter->getMessages() as $msg )
			{    
				$return_r['msg'] = $msg.". ";
			}
			echo Zend_Json::encode( $return_r );
			die;
		}         
    	if( !$adapter->getFileInfo() )//File not uploaded.
    	{
			$return_r['is_success'] = 0;
			$return_r['msg'] = "Please upload some photo";
			echo Zend_Json::encode( $return_r );
			die;
    	}
    	else // uploading photos to user directory inside images>albums>user_x, where x = user_id.
    	{
			$file_info = $adapter->getFileInfo();
			$mime_type = $adapter->getMimeType();
			$temp_path = $file_info['photo']['tmp_name'];//temp path, where from move.
			$fname = $file_info['photo']['name'];
			$size = $adapter->getFileSize();
          
			$ts_img_name = Helper_common::getUniqueNameForFile($fname);
          
			//creating or checking user default album directory to upload image.
			$userDirectory = REL_IMAGE_PATH.'\\albums\\user_'.Auth_UserAdapter::getIdentity()->getId();
			$userAlbumDirectory = REL_IMAGE_PATH.'\\albums\\user_'.Auth_UserAdapter::getIdentity()->getId().'\\album_default';
			$galleryDirectory = REL_IMAGE_PATH.'\\albums\\user_'.Auth_UserAdapter::getIdentity()->getId().'\\album_default\\gallery_thumbnails';
			$wallDirectory = REL_IMAGE_PATH.'\\albums\\user_'.Auth_UserAdapter::getIdentity()->getId().'\\album_default\\wall_thumbnails';
			$popupDirectory = REL_IMAGE_PATH.'\\albums\\user_'.Auth_UserAdapter::getIdentity()->getId().'\\album_default\\popup_thumbnails';
			$originalDirecory = REL_IMAGE_PATH.'\\albums\\user_'.Auth_UserAdapter::getIdentity()->getId().'\\album_default\\original_photos';
          
			// Creating directories
			if ( !file_exists( $userDirectory ) )
			{
				if( mkdir( $userDirectory, 0777, true ) )
				{
					if( mkdir( $userAlbumDirectory, 0777, true ) )
					{
						if( mkdir( $originalDirecory, 0777, true ) )
						{
							$adapter->setDestination( realpath( $originalDirecory ) );
							$filterFileRename = new Zend_Filter_File_Rename(
                                      array(
                                                'target' => $ts_img_name, 'overwrite' => true
                                      ));
                            $adapter->addFilter( $filterFileRename );
                            if( $adapter->receive() )
                            {
                                  if( mkdir( $popupDirectory, 0777, true ) )
                                  {
                                       if( Helper_common::generateThumbnail( $originalDirecory."/".$ts_img_name, $popupDirectory."/thumbnail_".$ts_img_name, 800, 800 ) )
                                       {
                                           if( mkdir( $wallDirectory, 0777, true ) )
                                           {
                                                if( Helper_common::generateThumbnail(
                                                                                      $originalDirecory."/".$ts_img_name, 
                                                                                      $wallDirectory."/thumbnail_".$ts_img_name, 
                                                                                      435, 
                                                                                      435 
                                                                                      ) )
                                                {
                                                     if( mkdir( $galleryDirectory, 0777, true ) )
                                                     {
                                                         if( Helper_ImageResizer::smart_resize_image( $originalDirecory."/".$ts_img_name, NULL, 176, 176, false, $galleryDirectory."/thumbnail_".$ts_img_name, false) )
                                                         {
																	//Making entry to DB.
																$default_album_id = \Extended\socialise_album::isThisTypeOfAlbumExists( Auth_UserAdapter::getIdentity()->getId(), \Extended\socialise_album::DEFAULT_ALBUM_NAME );
																if( !$default_album_id )
                                                                {
                                                                        $album_data = \Extended\socialise_album::addAlbum( Auth_UserAdapter::getIdentity()->getId() , \Extended\socialise_album::DEFAULT_ALBUM_NAME, \Extended\socialise_album::VISIBILITY_CRITERIA_PUBLIC, 1, \Extended\socialise_album::DEFAULT_ALBUM_NAME );
                                                                        if( $album_data )
                                                                        {
                                                                             $photo_info = \Extended\socialise_photo::addPhotos($album_data['id'], Auth_UserAdapter::getIdentity()->getId(), array('0'=>$ts_img_name), $this->getRequest()->getParam("privacy"), $this->getRequest()->getParam("photo_text"));
                                                                             $photo_id_r = array_keys($photo_info);
                                                                             $photo_obj = \Extended\socialise_photo::getRowObject($photo_id_r[0]);
                                                                             $wall_post_id = \Extended\wall_post::post_photo("", $this->getRequest()->getParam("privacy"), Auth_UserAdapter::getIdentity()->getId(), Auth_UserAdapter::getIdentity()->getId(), Auth_UserAdapter::getIdentity()->getId(), \Extended\wall_post::POST_UPDATE_TYPE_PHOTO, \Extended\wall_post::POST_TYPE_MANUAL, \Extended\wall_post::WALL_TYPE_SOCIALISE, $photo_id_r[0], $album_data['id']);
                                                                             
                                                                             $return_r['wall_post_id'] = $wall_post_id;
                                                                             $return_r['album_id'] = $album_data['id'];
                                                                             $return_r['user_id'] = Auth_UserAdapter::getIdentity()->getId();
                                                                             $return_r['user_gender'] = Auth_UserAdapter::getIdentity()->getGender();
                                                                             $return_r['user_name'] = Auth_UserAdapter::getIdentity()->getFirstname()." ".Auth_UserAdapter::getIdentity()->getLastname();
                                                                             $return_r['user_image'] = Helper_common::getUserProfessionalPhoto( Auth_UserAdapter::getIdentity()->getId(), 3 );
                                                                             $return_r['feed_image'] = IMAGE_PATH."/albums/user_".Auth_UserAdapter::getIdentity()->getId()."/album_default/wall_thumbnails/thumbnail_".$ts_img_name;
                                                                             $return_r['photo_text'] = $this->getRequest()->getParam("photo_text");
                                                                             $return_r['image_created_at'] = $photo_obj->getCreated_at()->format('F d, Y');
                                                                             $return_r['is_ok_comment_share_pannel_visible'] = \Helper_common::is_ok_comment_share_pannel_visible(  $this->getRequest()->getParam("privacy"), Auth_UserAdapter::getIdentity()->getId(), array(Auth_UserAdapter::getIdentity()->getId()), Auth_UserAdapter::getIdentity()->getId() );
                                                                             $return_r['privacy'] = $this->getRequest()->getParam("privacy");
                                                                             $return_r['is_success'] = 1;
                                                                             $return_r['msg'] = "Photo uploaded successfully.";
                                                                             
                                                                        }
                                                                        else
                                                                        {
                                                                             $return_r['is_success'] = 0;
                                                                             $return_r['msg'] = "Error in saving album information! Please try again.";
                                                                             echo Zend_Json::encode( $return_r );
                                                                             die;
                                                                        }     
                                                                   }
                                                                   else
                                                                   {
                                                                        $photo_info = \Extended\socialise_photo::addPhotos($default_album_id, Auth_UserAdapter::getIdentity()->getId(), array('0'=>$ts_img_name), $this->getRequest()->getParam("privacy"), $this->getRequest()->getParam("photo_text"));
                                                                        $photo_id_r = array_keys($photo_info);
                                                                        $photo_obj = \Extended\socialise_photo::getRowObject($photo_id_r[0]);
                                                                        $wall_post_id = \Extended\wall_post::post_photo("", $this->getRequest()->getParam("privacy"), Auth_UserAdapter::getIdentity()->getId(), Auth_UserAdapter::getIdentity()->getId(), Auth_UserAdapter::getIdentity()->getId(), \Extended\wall_post::POST_UPDATE_TYPE_PHOTO, \Extended\wall_post::POST_TYPE_MANUAL, \Extended\wall_post::WALL_TYPE_SOCIALISE, $photo_id_r[0], $default_album_id);
                                                                        
                                                                        $return_r['wall_post_id'] = $wall_post_id;
                                                                        $return_r['album_id'] = $default_album_id;
                                                                        $return_r['user_id'] = Auth_UserAdapter::getIdentity()->getId();
                                                                        $return_r['user_gender'] = Auth_UserAdapter::getIdentity()->getGender();
                                                                        $return_r['user_name'] = Auth_UserAdapter::getIdentity()->getFirstname()." ".Auth_UserAdapter::getIdentity()->getLastname();
                                                                        $return_r['user_image'] = Helper_common::getUserProfessionalPhoto( Auth_UserAdapter::getIdentity()->getId(), 3 );
                                                                        $return_r['feed_image'] = IMAGE_PATH."/albums/user_".Auth_UserAdapter::getIdentity()->getId()."/album_default/wall_thumbnails/thumbnail_".$ts_img_name;
                                                                        $return_r['photo_text'] = $this->getRequest()->getParam("photo_text");
                                                                        $return_r['image_created_at'] = $photo_obj->getCreated_at()->format('F d, Y');
                                                                        $return_r['is_ok_comment_share_pannel_visible'] = \Helper_common::is_ok_comment_share_pannel_visible(  $this->getRequest()->getParam("privacy"), Auth_UserAdapter::getIdentity()->getId(), array(Auth_UserAdapter::getIdentity()->getId()), Auth_UserAdapter::getIdentity()->getId() );
                                                                        $return_r['privacy'] = $this->getRequest()->getParam("privacy");
                                                                        $return_r['is_success'] = 1;
                                                                        $return_r['msg'] = "Photo uploaded successfully.";
                                                                        
                                                                   }
                                                                   
                                                                   //--------------------
                                                               echo Zend_Json::encode( $return_r );
                                                               die;
                                                         }
                                                         else
                                                         {
                                                              $return_r['is_success'] = 0;
                                                              $return_r['msg'] = "Error in generating or moving gallery thumbnails to directory, please try again.";
                                                              echo Zend_Json::encode( $return_r );
                                                              die;
                                                         }    
                                                     }
                                                     else
                                                     {
                                                          $return_r['is_success'] = 0;
                                                         $return_r['msg'] = "Error in creating directory for gallery thumbnails, please try again.";
                                                         echo Zend_Json::encode( $return_r );
                                                         die;
                                                     }    
                                                }
                                                else
                                                {
                                                     $return_r['is_success'] = 0;
                                                     $return_r['msg'] = "Error in generating or moving wall thumbnails to directory, please try again.";
                                                     echo Zend_Json::encode( $return_r );
                                                     die;
                                                }    
                                           }
                                           else
                                           {
                                                $return_r['is_success'] = 0;
                                                $return_r['msg'] = "Error in creating directory for wall thumbnails, please try again.";
                                                echo Zend_Json::encode( $return_r );
                                                die;
                                           }
                                       }
                                       else
                                       {
                                            $return_r['is_success'] = 0;
                                            $return_r['msg'] = "Error in creating directory for popup thumbnails, please try again.";
                                            echo Zend_Json::encode( $return_r );
                                            die;
                                       }    
                                 }
                                 else
                                 {
                                      $return_r['is_success'] = 0;
                                      $return_r['msg'] = "Error in creating directory for popup thumbnails, please try again.";
                                      echo Zend_Json::encode( $return_r );
                                      die;
                                 }    
							}
							else 
							{
								$return_r['is_success'] = 0;
								$return_r['msg'] = "Error in moving photo(s) to user directory, please try again.";
								echo Zend_Json::encode( $return_r );
								die;
							}
						}
                        else
                        {
                             $return_r['is_success'] = 0;
                             $return_r['msg'] = "Error in creating directory to store photo(s), please try again.";
                             echo Zend_Json::encode( $return_r );
                             die;
                        }
                   }
                   else
                   {
                        $return_r['is_success'] = 0;
                        $return_r['msg'] = "Error in creating album directory to store photo(s), please try again.";
                        echo Zend_Json::encode( $return_r );
                        die;
                   }                                
               }
               else
               {
                   $return_r['is_success'] = 0;
                   $return_r['msg'] = "Error in creating user directory to store photo(s), please try again.";
                   echo Zend_Json::encode( $return_r );
                   die;
               }    
          }
          else
          {
              //This case will occur when user directory exists but album dir does not.
              if ( !file_exists( $userAlbumDirectory ) )
              {
                   if( mkdir( $userAlbumDirectory, 0777, true ) )
                   {
                        if( mkdir( $originalDirecory, 0777, true ) )
                        {
                             if( mkdir( $wallDirectory, 0777, true ) )
                             {
                                  if( mkdir( $popupDirectory, 0777, true ) )
                                  {
                                       if( mkdir( $galleryDirectory, 0777, true ) )
                                       {
                                       }
                                       else
                                       {
                                            $return_r['is_success'] = 0;
                                            $return_r['msg'] = "Error in creating directory for gallery directory, please try again.";
                                            echo Zend_Json::encode( $return_r );
                                            die;
                                       }
                                  }
                                  else
                                  {
                                      $return_r['is_success'] = 0;
                                      $return_r['msg'] = "Error in creating directory for popup thumbnails, please try again.";
                                      echo Zend_Json::encode( $return_r );
                                      die;
                                  }         
                             }
                             else
                             {
                                  $return_r['is_success'] = 0;
                                  $return_r['msg'] = "Error in creating directory for wall thumbnails, please try again.";
                                  echo Zend_Json::encode( $return_r );
                                  die;
                             }    
                        }
                        else
                        {
                             $return_r['is_success'] = 0;
                             $return_r['msg'] = "Error in creating directory to store photo(s), please try again.";
                             echo Zend_Json::encode( $return_r );
                             die;
                        }    
                   }
                   else
                   {
                        $return_r['is_success'] = 0;
                        $return_r['msg'] = "Error in creating user directory to store photo(s), please try again.";
                        echo Zend_Json::encode( $return_r );
                        die;
                   }    
              }
              //------------------
              
              $adapter->setDestination( realpath( $originalDirecory ) );
              $filterFileRename = new Zend_Filter_File_Rename(
                        array(
                                  'target' => $ts_img_name, 'overwrite' => true
                        ));
              $adapter->addFilter( $filterFileRename );
              if( $adapter->receive() )
              {
                   if( Helper_common::generateThumbnail(
                             $originalDirecory."/".$ts_img_name,
                             $popupDirectory."/thumbnail_".$ts_img_name,
                             800,
                             800
                   ))
                   {
                        if( Helper_common::generateThumbnail(
                                  $originalDirecory."/".$ts_img_name,
                                  $wallDirectory."/thumbnail_".$ts_img_name,
                                  435,
                                  435
                        ))
                        {
                             if( Helper_ImageResizer::smart_resize_image( $originalDirecory."/".$ts_img_name, NULL, 176, 176, false, $galleryDirectory."/thumbnail_".$ts_img_name, false) )
                             {
                                  
     //                                Making entry to DB.
                                  $default_album_id = \Extended\socialise_album::isThisTypeOfAlbumExists( Auth_UserAdapter::getIdentity()->getId(), \Extended\socialise_album::DEFAULT_ALBUM_NAME );
                                  if( !$default_album_id )
                                  {
                                       $album_data = \Extended\socialise_album::addAlbum( Auth_UserAdapter::getIdentity()->getId() , \Extended\socialise_album::DEFAULT_ALBUM_NAME, \Extended\socialise_album::VISIBILITY_CRITERIA_PUBLIC, 1, \Extended\socialise_album::DEFAULT_ALBUM_NAME );
                                       if( $album_data )
                                       {
                                           $photo_info = \Extended\socialise_photo::addPhotos($album_data['id'], Auth_UserAdapter::getIdentity()->getId(), array('0'=>$ts_img_name), $this->getRequest()->getParam("privacy"), $this->getRequest()->getParam("photo_text") );
                                           $photo_id_r = array_keys($photo_info);
                                       //     Zend_Debug::dump($photo_id_r);die;
                                           $photo_obj = \Extended\socialise_photo::getRowObject($photo_id_r[0]);
                                           $wall_post_id = \Extended\wall_post::post_photo("", $this->getRequest()->getParam("privacy"), Auth_UserAdapter::getIdentity()->getId(), Auth_UserAdapter::getIdentity()->getId(), Auth_UserAdapter::getIdentity()->getId(), \Extended\wall_post::POST_UPDATE_TYPE_PHOTO, \Extended\wall_post::POST_TYPE_MANUAL, \Extended\wall_post::WALL_TYPE_SOCIALISE, $photo_id_r[0], $album_data['id']);
                                           
                                           $return_r['wall_post_id'] = $wall_post_id;
                                           $return_r['album_id'] = $album_data['id'];
                                           $return_r['user_id'] = Auth_UserAdapter::getIdentity()->getId();
                                           $return_r['user_name'] = Auth_UserAdapter::getIdentity()->getFirstname()." ".Auth_UserAdapter::getIdentity()->getLastname();
                                           $return_r['user_image'] = Helper_common::getUserProfessionalPhoto( Auth_UserAdapter::getIdentity()->getId(), 3 );
                                           $return_r['feed_image'] = IMAGE_PATH."/albums/user_".Auth_UserAdapter::getIdentity()->getId()."/album_default/wall_thumbnails/thumbnail_".$ts_img_name;
                                           $return_r['photo_text'] = $this->getRequest()->getParam("photo_text");
                                           $return_r['image_created_at'] = $photo_obj->getCreated_at()->format('F d, Y');
                                           $return_r['is_ok_comment_share_pannel_visible'] = \Helper_common::is_ok_comment_share_pannel_visible(  $this->getRequest()->getParam("privacy"), 
                                           																											Auth_UserAdapter::getIdentity()->getId(), 
                                           																											array(Auth_UserAdapter::getIdentity()->getId()), 
                                           																											Auth_UserAdapter::getIdentity()->getId() );
                                           $return_r['privacy'] = $this->getRequest()->getParam("privacy");
                                           $return_r['is_success'] = 1;
                                           $return_r['msg'] = "Photo uploaded successfully.";
                                       }
                                       else
                                       {
                                           $return_r['is_success'] = 0;
                                            $return_r['msg'] = "Error in saving album information! Please try again.";
                                           echo Zend_Json::encode( $return_r );
                                           die;
                                       }
                                  }
								else
								{
									$photo_info = \Extended\socialise_photo::addPhotos($default_album_id, Auth_UserAdapter::getIdentity()->getId(), array('0'=>$ts_img_name), $this->getRequest()->getParam("privacy"), $this->getRequest()->getParam("photo_text") );
                                       $photo_id_r = array_keys($photo_info);
                                           $photo_obj = \Extended\socialise_photo::getRowObject($photo_id_r[0]);
                                           $wall_post_id = \Extended\wall_post::post_photo("", $this->getRequest()->getParam("privacy"), Auth_UserAdapter::getIdentity()->getId(), Auth_UserAdapter::getIdentity()->getId(), Auth_UserAdapter::getIdentity()->getId(), \Extended\wall_post::POST_UPDATE_TYPE_PHOTO, \Extended\wall_post::POST_TYPE_MANUAL, \Extended\wall_post::WALL_TYPE_SOCIALISE, $photo_id_r[0], $default_album_id);
                                           
                                           $return_r['wall_post_id'] = $wall_post_id;
                                           $return_r['album_id'] = $default_album_id;
                                           $return_r['user_id'] = Auth_UserAdapter::getIdentity()->getId();
                                           $return_r['user_name'] = Auth_UserAdapter::getIdentity()->getFirstname()." ".Auth_UserAdapter::getIdentity()->getLastname();
                                           $return_r['user_image'] = Helper_common::getUserProfessionalPhoto( Auth_UserAdapter::getIdentity()->getId(), 3 );
                                           $return_r['feed_image'] = IMAGE_PATH."/albums/user_".Auth_UserAdapter::getIdentity()->getId()."/album_default/wall_thumbnails/thumbnail_".$ts_img_name;
                                           $return_r['photo_text'] =$this->getRequest()->getParam("photo_text");
                                           $return_r['image_created_at'] = $photo_obj->getCreated_at()->format('F d, Y');
                                           $return_r['is_ok_comment_share_pannel_visible'] = \Helper_common::is_ok_comment_share_pannel_visible(  $this->getRequest()->getParam("privacy"), Auth_UserAdapter::getIdentity()->getId(), array(Auth_UserAdapter::getIdentity()->getId()), Auth_UserAdapter::getIdentity()->getId() );
                                           $return_r['privacy'] = $this->getRequest()->getParam("privacy");
                                           $return_r['is_success'] = 1;
                                           $return_r['msg'] = "Photo uploaded successfully.";
                                  }
                                  //--------------------
                                  echo Zend_Json::encode( $return_r );
                                  die;
                             }
                             else
                             {
                                  $return_r['is_success'] = 0;
                                  $return_r['msg'] = "Error in generating or moving gallery thumbnails to directory, please try again.";
                                  echo Zend_Json::encode( $return_r );
                                  die;
                             }
                        }
                        else
                        {
                             $return_r['is_success'] = 0;
                             $return_r['msg'] = "Error in generating or moving wall thumbnails to directory, please try again.";
                             echo Zend_Json::encode( $return_r );
                             die;
                        }
                   }
                   else
                   {
                        $return_r['is_success'] = 0;
                        $return_r['msg'] = "Error in generating or moving popup thumbnails to directory, please try again.";
                        echo Zend_Json::encode( $return_r );
                        die;
                   }
              }
              else
              {
                   $return_r['is_success'] = 0;
                   $return_r['msg'] = "Error in moving photo(s) to user directory, please try again.";
                   echo Zend_Json::encode( $return_r );
                   die;
              }    
          }
    	}
    }
    
    /**
     * Used for ajax call.
     * Returns image feed posts for the user.
     * 
     *@author jsingh7
     *@version 1.0
     */
    public function getMyImagefeedsAction()
    {
	    echo Zend_Json::encode( \Extended\wall_post::getUserWall_lite( Auth_UserAdapter::getIdentity()->getId() , $this->getRequest()->getParam("offset"), 10, Extended\wall_post::WALL_TYPE_SOCIALISE ) );
	    die;
    }
    
    /**
     * Adds like for the wallpost
     * and Album
     *
     * @author jsingh7
     * @version 1.0
     * @return json.
     */
    public function okTheWallpostAction()
    {
    	
	    try
	    {
			//getting the wall post object.
			$wall_post_obj = \Extended\wall_post::getRowObject( $this->getRequest()->getParam('wallpost_id') );
			
			if( $wall_post_obj )
			{
			    $result = \Extended\likes::setOrUnsetOK( Auth_UserAdapter::getIdentity()->getId(), 0, $wall_post_obj->getId() );			
			    \Extended\wall_post::likeCountIncreament( $wall_post_obj->getId() );
			    
			    /* 	If post update type is 16 or 17,
			       	that is POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM,
			    	POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING
			    	And there is single photo in group in default album
			    	then also add record in like table for photo. */
			    if((
				    	$wall_post_obj->getPost_update_type() == \extended\wall_post::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM
						|| $wall_post_obj->getPost_update_type() == \extended\wall_post::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING
			    	))
			    {
			    	if( $wall_post_obj->getPhotoGroup()->getSocialisePhoto()->count() == 1 )
				    {
				    	$group_photos = $wall_post_obj->getPhotoGroup()->getSocialisePhoto();
				    	\Extended\likes::setOrUnsetOK( Auth_UserAdapter::getIdentity()->getId(), 0, NULL, $group_photos[0]->getId() );
				    	
				    }
			    }
			    
			    
    			// If post update type is 15,
    			// that is POST_UPDATE_TYPE_ALBUM
    			// then add record in like table also for album.
    			if( $wall_post_obj->getPost_update_type() == \extended\wall_post::POST_UPDATE_TYPE_ALBUM )
    			{
    			    \Extended\likes::setOrUnsetOK( Auth_UserAdapter::getIdentity()->getId(), 0, NULL, NULL, $wall_post_obj->getWall_postsSocialise_album()->getId() );
    			}
    			else if( $wall_post_obj->getPost_update_type() == \extended\wall_post::POST_UPDATE_TYPE_PROFILE_PHOTO_CHANGED )
    			{
    			    \Extended\likes::setOrUnsetOK( Auth_UserAdapter::getIdentity()->getId(), 0, NULL, $wall_post_obj->getSocialisePhoto()->getId() );
    			}
    			
    			//fetching likers string.
    			$ret_arr = array();
    			$ret_arr['likers_string'] = Helper_common::getLikersStringByWallpostId( $this->getRequest()->getParam('wallpost_id'), Auth_UserAdapter::getIdentity()->getId() );
    			$ret_arr['wallpost_id'] = $this->getRequest()->getParam( 'wallpost_id' );
    			$ret_arr['is_success'] = 1;
    			 
    			echo Zend_Json::encode($ret_arr);
			}
			else
			{
			    //Wallpost doesnot exist anymore.
			    $ret_arr = array();
			    $ret_arr['is_success'] = 2;
			    	
			    echo Zend_Json::encode($ret_arr);
			}
	     }
	     catch (Exception $e) 
	     {
	          
	         echo $e;
	         
	          $ret_arr = array();
	          $ret_arr['is_success'] = 0;
	          
	          echo Zend_Json::encode($ret_arr);
	    }
    	die; 
    }
    /**
     * Adds like for Album
     *
     * @author hkaur5
     * @version 1.0
     * @return json.
     */
    public function okTheAlbumAction()
    {
	    try 
	    {
			//getting the wall post object.
			$album_obj = \Extended\socialise_album::getRowObject( $this->getRequest()->getParam('album_id') );
			
			if( $album_obj )
			{

				$result_like = \Extended\likes::setOrUnsetOK( Auth_UserAdapter::getIdentity()->getId(), 0, NULL, NULL, $album_obj->getId() );
    			
				if($result_like)
				{
	    			//fetching likers string.
	    			$ret_arr = array();
	    			$ret_arr['likers_string'] = Helper_common::getLikersStringByAlbumId( $this->getRequest()->getParam('album_id'), Auth_UserAdapter::getIdentity()->getId() );
	    			$ret_arr['album_id'] = $this->getRequest()->getParam( 'album_id' );
	    			$ret_arr['is_success'] = 1;
				}
    				echo Zend_Json::encode($ret_arr);
			}
			else
			{
			    //Wallpost doesnot exist anymore.
			    $ret_arr = array();
			    $ret_arr['is_success'] = 2;
			    	
			    echo Zend_Json::encode($ret_arr);
			}
	     }
	     catch (Exception $e) 
	     {
	          
	         echo $e;
	         
	          $ret_arr = array();
	          $ret_arr['is_success'] = 0;
	          
	          echo Zend_Json::encode($ret_arr);
	    }
    	die; 
    }
    

    
    /**
     * Adds like for the wallpost
     * and related wish.
     * Also increaments like count
     * in wallpost
     * table.
     * Used for ajax call.
     *
     * @author jsingh7
     * @version 1.0
     * @return json.
     */
    public function okTheWallpostOfTypeWishAction()
    {
    	$wish_id = $this->getRequest()->getParam('wish_id');
    	$wall_post_id = $this->getRequest()->getParam('wallpost_id');
    	
   		if( $wish_id )
   		{
   			$user_id = Auth_UserAdapter::getIdentity()->getId();
   			$is_wallpost_exist = \Extended\wall_post::checkWallpostByWish( $wish_id );
	   		
	   		if( $is_wallpost_exist )
	   		{
	   			$wall_post_id = $is_wallpost_exist;
	   		}
	   		else
	   		{
	   			$wish_obj = \Extended\wishes::getRowObject( $wish_id );

	   			$to_user_id = $wish_obj->getIlookUser()->getId();
	   			$from_user_id = $wish_obj->getIlookUser()->getId();
	   			$original_user_id = $wish_obj->getIlookUser()->getId();
	   			$post_update_type = \Extended\wall_post::POST_UPDATE_TYPE_WISH;
	   			$post_type = \Extended\wall_post::POST_TYPE_MANUAL;
	   			$wall_type = \Extended\wall_post::WALL_TYPE_SOCIALISE;
	   			$wall_post_id =  \Extended\wall_post::post_wish("", \Extended\wall_post::VISIBILITY_CRITERIA_LINKS, $to_user_id, $from_user_id, $original_user_id, $post_update_type, $post_type, $wall_type );
	   			
	   			$em = \Zend_Registry::get('em');
	   			$wish_obj->setWallPost( \Extended\wall_post::getRowObject( $wall_post_id ) );
	   			$em -> persist($wish_obj);
	   			$em -> flush();
	   			$em->getConnection()->close();
	   		}
   		}

   		if( $wall_post_id )
   		{
   			//getting the wall post object.
   			$wall_post_obj = \Extended\wall_post::getRowObject( $wall_post_id );
   				
   			//Making a entry to like table for wallpost.
   			$result_wallpost = 	\Extended\likes::setOrUnsetOK( Auth_UserAdapter::getIdentity()->getId(), 0, $wall_post_obj->getId() );
   				
   			//setting like count for wall post.
   			if($result_wallpost == "wallpost_ok_added." )
   			{
   				\Extended\wall_post::likeCountIncreament( $wall_post_obj->getId() );
   			}
   			
   			// getting ok likers string.
   			$likers = array();
   			
   			$em = \Zend_Registry::get('em');
   			$likesCollec = $em->getRepository('\Entities\likes')->findBy(array('likesWall_post' => $wall_post_obj->getId()));
   			
   			//Create wallpost object again to get new likes. 			
   			foreach( $likesCollec as $key=>$likee )
   			{
   				$likers[$key] = $likee->getLikesLiked_by()->getId();
   			}
   		
   			$ret_arr['likers_string'] = \Helper_common::getLikersString ( $likers, \Auth_UserAdapter::getIdentity()->getId() );
   			$ret_arr['wallpost_id'] = $wall_post_id;
   			$wish_obj = \Extended\wishes::getWishByWallpostId($wall_post_id);
   			$ret_arr['wish_id'] = $wish_obj->getId();
   			$ret_arr['is_success'] = 1;
   			
   			echo Zend_Json::encode( $ret_arr );
   		}
   		else
   		{   			
   			$ret_arr['is_success'] = 0;
   			
   			echo Zend_Json::encode( $ret_arr );
   		}	
   		
   		
    	die; 
    }
    

    
    /**
     * Removes like for the wallpost
     * and related photo.
     * Also decrements like count
     * in wallpost and socialisephoto
     * table.
     * Used for ajax call.
     *
     * @author jsingh7
     * @version 1.0
     * @return json.
     */
    public function notOkTheWallpostAction()
    {
        try {
          
         //getting the wall post object.
         $wall_post_obj = \Extended\wall_post::getRowObject( $this->getRequest()->getParam( 'wallpost_id' ) );
         if( $wall_post_obj )
         {
	         //Making/removing a entry to like table for wallpost.
	         \Extended\likes::setOrUnsetOK( Auth_UserAdapter::getIdentity()->getId(), 1, $wall_post_obj->getId() );
	         
	         /* 	If post update type is 16 or 17,
			       	that is POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM,
			    	POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING
			    	And there is single photo in group in default album
			    	then also add record in like table for photo. */
			if((
				$wall_post_obj->getPost_update_type() == \extended\wall_post::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM
				|| $wall_post_obj->getPost_update_type() == \extended\wall_post::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING
			))
			{
		    	if( $wall_post_obj->getPhotoGroup()->getSocialisePhoto()->count() == 1 )
			    {
         			$group_photos = $wall_post_obj->getPhotoGroup()->getSocialisePhoto();
         			\Extended\likes::setOrUnsetOK( Auth_UserAdapter::getIdentity()->getId(), 1, NULL, $group_photos[0]->getId() );
         		}
			}
	         
	         // If post update type is 15,
    		 // that is POST_UPDATE_TYPE_ALBUM
	         if( $wall_post_obj->getPost_update_type() == \extended\wall_post::POST_UPDATE_TYPE_ALBUM )
	         {
	           \Extended\likes::setOrUnsetOK( Auth_UserAdapter::getIdentity()->getId(), 1, null, null, $wall_post_obj->getWall_postsSocialise_album()->getId() );
	         }
	         else if( $wall_post_obj->getPost_update_type() == \extended\wall_post::POST_UPDATE_TYPE_PROFILE_PHOTO_CHANGED )
	         {
	             \Extended\likes::setOrUnsetOK( Auth_UserAdapter::getIdentity()->getId(), 1, NULL, $wall_post_obj->getSocialisePhoto()->getId() );
	         }
	        
	         
	          //fetching likers string.
	         $ret_arr = array();
	         $ret_arr['likers_string'] = Helper_common::getLikersStringByWallpostId($this->getRequest()->getParam( 'wallpost_id' ), Auth_UserAdapter::getIdentity()->getId());
	         $ret_arr['wallpost_id'] = $this->getRequest()->getParam( 'wallpost_id' );
	         $ret_arr['is_success'] = 1;
	         echo Zend_Json::encode($ret_arr);
         }
         else
         {
         	//Wallpost doesnot exist anymore.
         	$ret_arr = array();
         	$ret_arr['is_success'] = 2;
         	echo Zend_Json::encode($ret_arr);
         }	
         
     } catch (Exception $e) {
          $ret_arr = array();
          $ret_arr['is_success'] = 0;
          echo Zend_Json::encode($ret_arr);
    }
    die; 
    }
    /**
     * Removes like for the album
     * Also decrements like count
     * in album table.
     * Used for ajax call.
     *
     * @author hkaur5
     * @version 1.0
     * @return json.
     */
    public function notOkTheAlbumAction()
    {
    try {
          
		//getting the wall post object.
		$album_obj = \Extended\socialise_album::getRowObject( $this->getRequest()->getParam( 'album_id' ) );
		if( $album_obj )
		{
			//Making/removing a entry to like table for album.
			$result_album = \Extended\likes::setOrUnsetOK( Auth_UserAdapter::getIdentity()->getId(), 1, null, null, $album_obj->getId() );
	         
	         
			if( $result_album == "socialise_album_ok_deleted." )
			{
              //setting like count for photo 
               \Extended\socialise_album::likeCountDecreament( $album_obj->getId() );
			}
	         
	          //fetching likers string.
	         $ret_arr = array();
	         $ret_arr['likers_string'] = Helper_common::getLikersStringByAlbumId($this->getRequest()->getParam( 'album_id' ), Auth_UserAdapter::getIdentity()->getId());
	         $ret_arr['album_id'] = $this->getRequest()->getParam( 'album_id' );
	         $ret_arr['is_success'] = 1;
	         echo Zend_Json::encode($ret_arr);
         }
         else
         {
         	//Wallpost doesnot exist anymore.
         	$ret_arr = array();
         	$ret_arr['is_success'] = 2;
         	echo Zend_Json::encode($ret_arr);
         }	
         
	} 
	catch (Exception $e) 
	{
          $ret_arr = array();
          $ret_arr['is_success'] = 0;
          echo Zend_Json::encode($ret_arr);
	}
    die; 
    }
    
    
    /**
     * Removes like for the wallpost
     * Also decrements like count
     * in wallpost
     * table.
     * Used for ajax call.
     *
     * @author jsingh7
     * @version 1.0
     * @return json.
     */
    public function notOkTheWallpostOfTypeWishAction()
    {
    	$wish_id = $this->getRequest()->getParam('wish_id');
    	$wall_post_id = $this->getRequest()->getParam('wallpost_id');
    	 
    	if( $wish_id )
    	{
    		$is_wallpost_exist = \Extended\wall_post::checkWallpostByWish( $wish_id );
    		//Associated Wallpost must exist in this case.
    		$wall_post_id = $is_wallpost_exist ;
    	}
    	 
    
    	if( $wall_post_id )
    	{
    		//     	getting the wall post object.
    		$wall_post_obj = \Extended\wall_post::getRowObject( $wall_post_id );
    			
    		//Making/removing a entry to like table for wallpost.
        	 $result_wallpost = \Extended\likes::setOrUnsetOK( Auth_UserAdapter::getIdentity()->getId(), 1, $wall_post_obj->getId() );
    			
    			
    		//setting like count for wall post.
	    	if( $result_wallpost == "wallpost_ok_deleted." )
	        {
	        	//setting like count for wall post.
	        	\Extended\wall_post::likeCountDecreament( $wall_post_obj->getId() );
	        }
    
    		// getting ok likers string.
    		$likers = array();
    		foreach( $wall_post_obj->getWall_postsLikes() as $key=>$like )
    		{
    			$likers[$key] = $like->getLikesLiked_by()->getId();
    		}
    		 
    		$ret_arr['likers_string'] = \Helper_common::getLikersString ( $likers, \Auth_UserAdapter::getIdentity()->getId() );
    		$ret_arr['wallpost_id'] = $wall_post_id;
    		$wish_obj = \Extended\wishes::getWishByWallpostId($wall_post_id);
    		$ret_arr['wish_id'] = $wish_obj->getId();
    		$ret_arr['is_success'] = 1;
    
    		echo Zend_Json::encode( $ret_arr );
    	}
    	else
    	{
    		$ret_arr['is_success'] = 0;
    
    		echo Zend_Json::encode( $ret_arr );
    	}
    	die;
    }
    
    /**
     * Add comment for the wallpost
     * and related photo.
     * Also increaments comment count
     * in wallpost and socialisephoto
     * table.
     * Used for ajax call.
     * 
     * @author jsingh7
     * @version 1.0
     * @return json.
     */
    public function addCommentToTheWallpostAction()
    {
    try {
          //getting the wall post object.
		$wall_post_obj = \Extended\wall_post::getRowObject( $this->getRequest()->getParam( 'wallpost_id' ) );
    	if( $wall_post_obj )
    	{
			//Making a entry to like table for wallpost.
	        $filterObj = Zend_Registry::get('Zend_Filter_StripTags');
	        $comm_text = $filterObj->filter( $this->getRequest()->getParam( 'comment' ) );
	        $comment_on_wallpost_id = \Extended\comments::addComment( $comm_text, Auth_UserAdapter::getIdentity()->getId(), NULL, $wall_post_obj->getId() );
	        //setting like count for wall post.
	        $comment_count = \Extended\wall_post::commentCountIncreament( $wall_post_obj->getId() );
	        
	        //Adding comment for album in comments table( for special case only. )
	        if( $wall_post_obj->getPost_update_type() == \Extended\wall_post::POST_UPDATE_TYPE_ALBUM )
	        {
				$comment_on_photo_id = \Extended\comments::addComment( $comm_text, Auth_UserAdapter::getIdentity()->getId(), $comment_on_wallpost_id, NULL, NULL, $wall_post_obj->getWall_postsSocialise_album()->getId() );
	        }
	        
	        //Adding comment for photo in comments table( for special case only. )
	        if( $wall_post_obj->getPost_update_type() == \Extended\wall_post::POST_UPDATE_TYPE_PROFILE_PHOTO_CHANGED )
	        {
	            $comment_on_photo_id = \Extended\comments::addComment( $comm_text, Auth_UserAdapter::getIdentity()->getId(), $comment_on_wallpost_id, NULL, $wall_post_obj->getSocialisePhoto()->getId() );
	        }
	        
	        //Adding comment for photo in comments table when there is only one photo
	        //in group inside default album.
	        if( 
	        	$wall_post_obj->getPost_update_type() == \Extended\wall_post::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM
				|| $wall_post_obj->getPost_update_type() == \Extended\wall_post::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING
	        )
	        {
	        	if( $wall_post_obj->getPhotoGroup()->getSocialisePhoto()->count() == 1 )
	        	{
	        		$photo_obj = $wall_post_obj->getPhotoGroup()->getSocialisePhoto();
		        	$comment_on_photo_id = \Extended\comments::addComment( $comm_text, Auth_UserAdapter::getIdentity()->getId(), $comment_on_wallpost_id, NULL, $photo_obj[0]->getId() );
	        	}
	        }
	        
	        $comments_obj = \Extended\comments::getRowObject( $comment_on_wallpost_id );
	        
	        $ret_r = array();
	        $ret_r['comm_id'] = $comment_on_wallpost_id;
	        $ret_r['comm_text'] = $comm_text;
	        $ret_r['commenter_id'] = Auth_UserAdapter::getIdentity()->getId();
	        $ret_r['commenter_fname'] = Auth_UserAdapter::getIdentity()->getFirstname();
	        $ret_r['commenter_lname'] = Auth_UserAdapter::getIdentity()->getLastname();
	        $ret_r['commenter_small_image'] = Helper_common::getUserProfessionalPhoto(Auth_UserAdapter::getIdentity()->getId(), 3);
	        $ret_r['comment_count'] = $wall_post_obj->getWall_postsComment()->count();
	        $ret_r['wp_id'] = $wall_post_obj->getId();
	        $ret_r['created_at'] = Helper_common::nicetime( $comments_obj->getCreated_at()->format( "Y-m-d H:i:s" ));
	        
	        //gathering information for sending email to user on whom post, comment is done.
	        $subject = "iLook - User commented on your post";
	        $msg='';
	        $msg = "<p style='margin:20px 20px 0 0; padding:0; font-size:14px; font-family:Arial, Helvetica, sans-serif; color:#3a3a3a'>
	        ".ucfirst($ret_r['commenter_fname'])." ".ucfirst($ret_r['commenter_lname'])." commented on your <a href='".PROJECT_URL.'/'.PROJECT_NAME."post/detail/id/".$ret_r['wp_id']."'>Post.</a></p>
	        <p style='margin:20px 20px 0 0; padding:0; font-size:14px; font-family:Arial, Helvetica, sans-serif; color:#3a3a3a'>
	        <b>'".$ret_r['comm_text']."'</b>
	        </p>";
	        $recipient_name = ucfirst($wall_post_obj->getWall_postsFrom_user()->getFirstname())." ".ucfirst($wall_post_obj->getWall_postsFrom_user()->getLastname());
	        $recipient_email = $wall_post_obj->getWall_postsFrom_user()->getEmail();
	        
	         
	        // check if user is not commenting on his own post, only then mail will be sent
	        if(Auth_UserAdapter::getIdentity()->getId() != $wall_post_obj->getWall_postsFrom_user()->getId())
	        {
	        	//sending email to user on whom post comment is done
	        	\Email_Mailer::sendMail($subject,
	        			$msg,
	        			$recipient_name,
	        			$recipient_email,
	        			array(),
	        			"iLook Team",
	        			Auth_UserAdapter::getIdentity()->getEmail(),
	        			"Hello ",
	        			"Thank you");
	        }
	        echo Zend_Json::encode($ret_r);
    	}
    	else
    	{
    		//Wallpost doesnot exist anymore.
    		echo Zend_Json::encode(2);
    	}
	}
	catch (Exception $e) 
	{
		echo Zend_Json::encode(0);
	}
    die;
}

/**
 * Add comment for the Album
 * Also increaments comment count
 * in Album table.
 * Used for ajax call.
 *
 * @author hkaur5
 * @version 1.0
 * @return json.
 */
public function addCommentToTheAlbumAction()
{
		$current_user_obj = Auth_UserAdapter::getIdentity();
	try {
		//getting the album's object.
		$album_obj = \Extended\socialise_album::getRowObject( $this->getRequest()->getParam( 'album_id' ) );

		if( $album_obj )
		{
			//Making a entry to comment table for album's comment .
			$filterObj = Zend_Registry::get('Zend_Filter_StripTags');
			$comm_text = $filterObj->filter( $this->getRequest()->getParam( 'comment' ) );
			 
			$comment_on_album_id = \Extended\comments::addComment( $comm_text, $current_user_obj->getId(), null, NULL, NULL, $album_obj->getId() );
			 
			$comments_obj = \Extended\comments::getRowObject( $comment_on_album_id );
			 
			 
			$ret_r = array();
			$ret_r['comm_id'] = $comment_on_album_id;
			$ret_r['comm_text'] = $comm_text;
			$ret_r['commenter_id'] = $current_user_obj->getId();
			$ret_r['commenter_fname'] = $current_user_obj->getFirstname();
			$ret_r['commenter_lname'] = $current_user_obj->getLastname();
			$ret_r['commenter_small_image'] = Helper_common::getUserProfessionalPhoto($current_user_obj->getId(), 3);
			$ret_r['comment_count'] = $album_obj->getSocialise_albumsComment()->count();
			$ret_r['wp_id'] = $album_obj->getId();
			$ret_r['created_at'] = Helper_common::nicetime( $comments_obj->getCreated_at()->format( "Y-m-d H:i:s" ));
			
			//gathering information for sending email to user on whom post, comment is done.
			$subject = "iLook - User commented on your album";
			$msg='';
			$msg = "<p style='margin:20px 20px 0 0; padding:0; font-size:14px; font-family:Arial, Helvetica, sans-serif; color:#3a3a3a'>
			".ucfirst($ret_r['commenter_fname'])." ".ucfirst($ret_r['commenter_lname'])." commented on your <a href='".PROJECT_URL.'/'.PROJECT_NAME."profile/photos/uid/".$album_obj->getSocialise_albumIlook_user()->getId()."/id/".$ret_r['wp_id']."'>album</a></p>
			<p style='margin:20px 20px 0 0; padding:0; font-size:14px; font-family:Arial, Helvetica, sans-serif; color:#3a3a3a'>
			<b>'".$ret_r['comm_text']."'</b>
			</p>";
			$recipient_name = ucfirst($album_obj->getSocialise_albumIlook_user()->getFirstname())." ".ucfirst($album_obj->getSocialise_albumIlook_user()->getLastname());
			$recipient_email = $album_obj->getSocialise_albumIlook_user()->getEmail();
			
			// check if user is not commenting on his own post, only then mail will be sent
			if(Auth_UserAdapter::getIdentity()->getId() != $album_obj->getSocialise_albumIlook_user()->getId())
			{
				//sending email to user on whom post comment is done
				\Email_Mailer::sendMail($subject,
						$msg,
						$recipient_name,
						$recipient_email,
						array(),
						"iLook Team",
						Auth_UserAdapter::getIdentity()->getEmail(),
						"Hello ",
						"Thank you");
    		
			}
			echo Zend_Json::encode($ret_r);
		}
		else
		{
			//Album does not exist anymore.
			echo Zend_Json::encode(2);
		}
	}
	catch (Exception $e)
	{
		echo Zend_Json::encode(0);
	}
	die;
}
    
    /**
     * Add comment for the wallpost.
     * Also increaments comment count
     * in wallpost
     * table.
     * Used for ajax call.
     * 
     * @author jsingh7,sjaiswal
     * @version 1.1
     * @return json.
     */
    public function addCommentToTheWallpostOfTypeWishAction()
    {
		$wish_id = $this->getRequest()->getParam('wish_id');   
	
		$wall_post_id = $this->getRequest()->getParam('wallpost_id');
    	
		if( $wish_id )
		{
			$user_id = Auth_UserAdapter::getIdentity()->getId();
			$is_wallpost_exist = \Extended\wall_post::checkWallpostByWish( $wish_id );
			$wish_obj = \Extended\wishes::getRowObject( $wish_id );
		
			$wish_type = \Extended\wishes::getDiscriminatorValue($wish_obj); 
			
			if( $is_wallpost_exist )
			{
				$wall_post_id = $is_wallpost_exist;
			}
			else
			{
				$wish_obj = \Extended\wishes::getRowObject( $wish_id );
				
			
				$to_user_id = $wish_obj->getIlookUser()->getId();
				$from_user_id = $wish_obj->getIlookUser()->getId();
				$original_user_id = $wish_obj->getIlookUser()->getId();
				$post_update_type = \Extended\wall_post::POST_UPDATE_TYPE_WISH;
				$post_type = \Extended\wall_post::POST_TYPE_MANUAL;
				$wall_type = \Extended\wall_post::WALL_TYPE_SOCIALISE;
				$wall_post_id =  \Extended\wall_post::post_wish("", \Extended\wall_post::VISIBILITY_CRITERIA_LINKS, $to_user_id, $from_user_id, $original_user_id, $post_update_type, $post_type, $wall_type );
				 
				$em = \Zend_Registry::get('em');
				$wish_obj->setWallPost( \Extended\wall_post::getRowObject( $wall_post_id ) );
				$em -> persist($wish_obj);
				$em -> flush();
				$em->getConnection()->close();
			}
		}
		if( $wall_post_id )
		{
			//getting the wall post object.
			$wall_post_obj = \Extended\wall_post::getRowObject( $wall_post_id );
    
			//Making a entry to like table for wallpost.
			$filterObj = Zend_Registry::get('Zend_Filter_StripTags');
          	$comm_text = $filterObj->filter( $this->getRequest()->getParam( 'comment' ) );
          	$comment_on_wallpost_id = \Extended\comments::addComment( $comm_text, Auth_UserAdapter::getIdentity()->getId(), NULL, $wall_post_obj->getId() );
          	$comments_obj = \Extended\comments::getRowObject( $comment_on_wallpost_id );
          
          	//setting like count for wall post.
          	$comment_count = \Extended\wall_post::commentCountIncreament( $wall_post_obj->getId() );
    
			$ret_r = array();
			$ret_r['comm_id'] = $comment_on_wallpost_id;
			$ret_r['comm_text'] = $comm_text;
			$ret_r['commenter_id'] = Auth_UserAdapter::getIdentity()->getId();
			$ret_r['commenter_fname'] = Auth_UserAdapter::getIdentity()->getFirstname();
			$ret_r['commenter_lname'] = Auth_UserAdapter::getIdentity()->getLastname();
			$ret_r['commenter_small_image'] = Helper_common::getUserProfessionalPhoto(Auth_UserAdapter::getIdentity()->getId(), 3);
			$ret_r['comment_count'] = $comment_count;
			$ret_r['wp_id'] = $wall_post_id;
			$wish_obj = \Extended\wishes::getWishByWallpostId($wall_post_id);
			$ret_r['wish_id'] = $wish_obj->getId();
			$ret_r['created_at'] = Helper_common::nicetime( $comments_obj->getCreated_at()->format( "Y-m-d H:i:s" ));
			
			$subject = 'iLook : Wish';
			
			//Commented as not in use.
// 			switch ($wish_type)
// 			{
// 			case 1:
// 			$message = Auth_UserAdapter::getIdentity()->getFirstname().' '.Auth_UserAdapter::getIdentity()->getLastname()
// 			.' sent you wish on new link</br>'.$comm_text.'';
// 			break;
// 			case 2:
// 			$message = Auth_UserAdapter::getIdentity()->getFirstname().' '.Auth_UserAdapter::getIdentity()->getLastname()
// 			.' sent you wish on new job</br>'.$comm_text.'';
// 			break;
// 			case 3:
// 			$message = Auth_UserAdapter::getIdentity()->getFirstname().' '.Auth_UserAdapter::getIdentity()->getLastname()
// 			.' sent you wish on job anniversary</br>'.$comm_text.'';
// 			break;
// 			case 4:
// 			$message = Auth_UserAdapter::getIdentity()->getFirstname().' '.Auth_UserAdapter::getIdentity()->getLastname()
// 			.' sent you wish on marriage anniversary</br>'.$comm_text.'';
// 			break;
// 			case 5:
// 			$message = Auth_UserAdapter::getIdentity()->getFirstname().' '.Auth_UserAdapter::getIdentity()->getLastname()
// 			.' sent you birthday wishes</br>'.$comm_text.'';
// 			break;
			
// 			}
			//send mail when one user send any wishes to another user
			//Email_Mailer::sendMail($subject, $message, $wish_obj->getilookUser()->getFirstname()." ".$wish_obj->getilookUser()->getLastname(), $wish_obj->getilookUser()->getEmail(), array(), "", "", "Hi", "Thanks</br>ilook team" );
			
			
			//gathering information for sending email to user on whom post, comment is done.
			$subject = "iLook - User commented on your wish";
			$msg='';
			$msg = "<p style='margin:20px 20px 0 0; padding:0; font-size:14px; font-family:Arial, Helvetica, sans-serif; color:#3a3a3a'>
			".ucfirst($ret_r['commenter_fname'])." ".ucfirst($ret_r['commenter_lname'])." commented on your <a href='".PROJECT_URL.'/'.PROJECT_NAME."post/detail/id/".$ret_r['wp_id']."'>wish</a></p>
			<p style='margin:20px 20px 0 0; padding:0; font-size:14px; font-family:Arial, Helvetica, sans-serif; color:#3a3a3a'>
			<b>'".$ret_r['comm_text']."'</b>
			</p>";
			$recipient_name = ucfirst($wall_post_obj->getWall_postsFrom_user()->getFirstname())." ".ucfirst($wall_post_obj->getWall_postsFrom_user()->getLastname());
			$recipient_email = $wall_post_obj->getWall_postsFrom_user()->getEmail();
			 
			
			// check if user is not commenting on his own post, only then mail will be sent
			if(Auth_UserAdapter::getIdentity()->getId() != $wall_post_obj->getWall_postsFrom_user()->getId())
			{
				//sending email to user on whom post comment is done
				\Email_Mailer::sendMail($subject,
						$msg,
						$recipient_name,
						$recipient_email,
						array(),
						"iLook Team",
						Auth_UserAdapter::getIdentity()->getEmail(),
						"Hello ",
						"Thank you");
			}
			//\Email_Mailer::sendMail($subject, $comm_text, Auth_UserAdapter::getIdentity()->getFirstname().' '.Auth_UserAdapter::getIdentity()->getLastname(), Auth_UserAdapter::getIdentity()->getEmail());
			echo Zend_Json::encode($ret_r);
    		die;
    	}
    }
    
    /**
     * function used to send report abuse to admin mail
     *
     *@author Sunny Patial
     *@version 1.0
     */
    public function reportAbuseAction()
    {
    $params=$this->getRequest()->getParams();
    $wallInfo=Extended\wall_post::getRowObject($params["wall_id"]);
    $imageName=$wallInfo->getWall_postsSocialise_photo()->getImage_name();
    $albumName=$wallInfo->getWall_postsSocialise_photo()->getSocialise_photosSocialise_album()->getAlbum_name();
    $albumTme=$wallInfo->getWall_postsSocialise_photo()->getSocialise_photosSocialise_album()->getCreated_at_timestamp()->getTimeStamp();
    $imagePath=IMAGE_PATH."/albums/user_".$wallInfo->getWall_postsFrom_user()->getId()."/album_".$albumName."/wall_thumbnails/thumbnail_".$imageName;
    $userId = Auth_UserAdapter::getIdentity()->getId();
    $userName = Auth_UserAdapter::getIdentity()->getFirstname()." ".Auth_UserAdapter::getIdentity()->getLastname();
    $msg='';
    $msg=$msg.'<div style="width:100%;">';
    $msg=$msg.'<label style="font-weight:bold;">Dear Admin</label>';
    $msg=$msg.'<p style="margin-left:10px;">A wall post has been report abused</p>';
    $msg=$msg.'<table border="1" style="margin-left:10px;">';
    $msg=$msg.'<tr><td>Report abused by name</td><td>'.$userName.'</td></tr>';
    $msg=$msg.'<tr><td>Report abused by id</td><td>'.$userId.'</td></tr>';
    $msg=$msg.'<tr><td>Wall post type</td><td>Photo</td></tr>';
    $msg=$msg.'<tr><td>Wal post PhotoPath</td><td>'.$imagePath.'</td></tr>';
    $msg=$msg.'<tr><td>Wall post id</td><td>'.$params["wall_id"].'</td></tr>';
    $msg=$msg.'</table>';
    $msg=$msg.'</div>';
    $adminEmail=\Extended\ilook_user::getRowObject(ADMIN_ID)->getEmail();
    $subject="Socialise wall post reported abuse";
    $result=Email_Mailer::sendMail ( $subject, $msg, "Admin", $adminEmail, array(), "iLook Team","","Hello ","Best Regards");
    if($result):
          // for success
          Zend_Json::encode(1);
    else:
          // for failure
          Zend_Json::encode(0);
    endif;
    die;
    }
    
    /**
     * used for ajax call.
     * echo json of users who liked post
     * 
     * @author jsingh7
     * @version 1.0
     */
    public function getWhoLikePostAction()
    {
    	$user_info = array();
    	if($this->getRequest()->getParam( 'wallpost_id' ))
    	{
    		if( \Extended\wall_post::getRowObject( $this->getRequest()->getParam( 'wallpost_id' ) ))
    		{
		    	$ppl_who_liked = \Extended\likes::getUserslikedWallpostOrAlbumOrPhoto( $this->getRequest()->getParam( 'wallpost_id' ), 
																		    			null,
																		    			null,  
		    																			$this->getRequest()->getParam( 'limit'), 
		    																			$this->getRequest()->getParam( 'offset')  
	    																			);
		    	

		    	if($ppl_who_liked)
		    	{
			    	foreach( $ppl_who_liked['data'] as $key=>$user_who_liked )
			    	{
			    		$mutual_arr=\Extended\ilook_user::getMutualLinks(\Auth_UserAdapter::getIdentity()->getId(), $user_who_liked->getLikesLiked_by()->getId());
						$mutualFrdsCount = count($mutual_arr);
						if(\Auth_UserAdapter::getIdentity()->getId() == $user_who_liked->getLikesLiked_by()->getId()){
							$user_info[$key]["mutual_count"] =  "Me";
						}
						else{
							$user_info[$key]["mutual_count"] =  $mutualFrdsCount;
							
						}
                        $blocked_user = \Extended\blocked_users::getAllBlockersAndBlockedUsers(\Auth_UserAdapter::getIdentity()->getId());

                        $user_info[$key]["user_id"] = $user_who_liked->getLikesLiked_by()->getId();
						$user_info[$key]["user_image"] = \Helper_common::getUserProfessionalPhoto($user_who_liked->getLikesLiked_by()->getId(), 3,false,$blocked_user);
						$user_info[$key]["user_full_names"] = $user_who_liked->getLikesLiked_by()->getFirstname()." ".$user_who_liked->getLikesLiked_by()->getLastname();
						$user_info[$key]["link_info"] = \Extended\link_requests::getFriendRequestState( $user_who_liked->getLikesLiked_by()->getId() );
			    	}
			    	//For view more records option 
					$result = array('user_info'=>$user_info, 'is_more_records'=>$ppl_who_liked['is_more_records']);
			    	echo Zend_Json::encode( $result );
		    	}
		    	else
		    	{
		    		echo Zend_Json::encode( 0 );
		    	}
    		}
    		else
    		{
    			echo Zend_Json::encode( 0 );
    		}
    	}
    	else
    	{
    		echo Zend_Json::encode( 0 );
    	}
    	
    	
    	die;
    }
    
    /**
     * used for ajax call.
     * echo json of users who liked post
     *
     * @author hkaur5
     * @version 1.0
     */
    public function getWhoLikedAlbumAction()
    {
    	$user_info = array();
    	if($this->getRequest()->getParam( 'album_id' ))
    	{
    		if( \Extended\socialise_album::getRowObject( $this->getRequest()->getParam( 'album_id' ) ))
    		{
    			$ppl_who_liked = \Extended\likes::getUserslikedWallpostOrAlbumOrPhoto( null,
																    					$this->getRequest()->getParam( 'album_id' ),
																    					null,
																    					$this->getRequest()->getParam( 'limit'),
																    					$this->getRequest()->getParam( 'offset')
															    						);
    		  
    		  
    			if($ppl_who_liked)
    			{
    				foreach( $ppl_who_liked['data'] as $key=>$user_who_liked )
    				{
    					$mutual_arr=\Extended\ilook_user::getMutualLinks(\Auth_UserAdapter::getIdentity()->getId(), $user_who_liked->getLikesLiked_by()->getId());
    					$mutualFrdsCount = count($mutual_arr);
    					if(\Auth_UserAdapter::getIdentity()->getId() == $user_who_liked->getLikesLiked_by()->getId()){
    						$user_info[$key]["mutual_count"] =  "Me";
    					}
    					else{
    						$user_info[$key]["mutual_count"] =  $mutualFrdsCount;
    							
    					}
    					$user_info[$key]["user_id"] = $user_who_liked->getLikesLiked_by()->getId();
    					$user_info[$key]["user_image"] = \Helper_common::getUserProfessionalPhoto($user_who_liked->getLikesLiked_by()->getId(), 3);
    					$user_info[$key]["user_full_names"] = $user_who_liked->getLikesLiked_by()->getFirstname()." ".$user_who_liked->getLikesLiked_by()->getLastname();
    					$user_info[$key]["link_info"] = \Extended\link_requests::getFriendRequestState( $user_who_liked->getLikesLiked_by()->getId() );
    				}
    				//For view more records option
    				$result = array('user_info'=>$user_info, 'is_more_records'=>$ppl_who_liked['is_more_records']);
    				echo Zend_Json::encode( $result );
    			}
    			else
    			{
    				echo Zend_Json::encode( 0 );
    			}
    		}
    		else
    		{
    			echo Zend_Json::encode( 0 );
    		}
    	}
    	else
    	{
    		echo Zend_Json::encode( 0 );
    	}
    	 
    	 
    	die;
    }
    
    /**
     * used for ajax call.
     * echo json of users who liked wish post
     * 
     * @author hkaur5
     * @version 1.0
     */
    public function getWhoLikeWishPostAction()
    {
        $user_info = array();
        if($this->getRequest()->getParam( 'wish_id' ))
        {
        	//Check if wish object exist.
        	$wish_obj = \Extended\wishes::getRowObject($this->getRequest()->getParam('wish_id'));
        	if( $wish_obj->getWallPost() )
        	{
        		//Getting wallpost_id for wish
        		$wall_post_id = $wish_obj->getWallPost()->getId();
        		$ppl_who_liked = \Extended\likes::getUserslikedWallpostOrAlbumOrPhoto( $wall_post_id);
        		if($ppl_who_liked)
        		{
        			foreach( $ppl_who_liked['data'] as $key=>$user_who_liked )
        			{
        				$mutual_arr=\Extended\ilook_user::getMutualLinks(\Auth_UserAdapter::getIdentity()->getId(), $user_who_liked->getLikesLiked_by()->getId());
        				$mutualFrdsCount = count($mutual_arr);
        				if(\Auth_UserAdapter::getIdentity()->getId() == $user_who_liked->getLikesLiked_by()->getId()){
        					$user_info[$key]["mutual_count"] =  "Me";
        				}
        				else{
        					$user_info[$key]["mutual_count"] =  $mutualFrdsCount;
        						
        				}
                        $blocked_user = \Extended\blocked_users::getAllBlockersAndBlockedUsers(\Auth_UserAdapter::getIdentity()->getId());

                        $user_info[$key]["user_id"] = $user_who_liked->getLikesLiked_by()->getId();
        				$user_info[$key]["user_image"] = \Helper_common::getUserProfessionalPhoto($user_who_liked->getLikesLiked_by()->getId(), 3,false,$blocked_user);
        				$user_info[$key]["user_full_names"] = $user_who_liked->getLikesLiked_by()->getFirstname()." ".$user_who_liked->getLikesLiked_by()->getLastname();
        				$user_info[$key]["link_info"] = \Extended\link_requests::getFriendRequestState( $user_who_liked->getLikesLiked_by()->getId() );
        			}
        			//For pagination which is not yet implemented.
        			// 			    	$user_info['more_records'] = $ppl_who_liked['is_more_records'];
        			echo Zend_Json::encode( $user_info );
        		}
        		else
        		{
        			echo Zend_Json::encode( 0 );
        		}
        	}
        	else
        	{
        		echo Zend_Json::encode( 0 );
        	}
        }
        else
        {
        	echo Zend_Json::encode( 0 );
        }
         
         
        die;
        
    }
    /**
     * used for ajax call.
     * echo json of user_info who shard wallpost.
     * Fetches record of users who has shared photo and 
	 * sends user info array to ajax call.
     * @author jsingh7
     * @author hkaur5
     * @version 1.0
     */
    public function getWhoSharedPostAction()
    {
    	$user_id_arr = array();
    	$user_info = array();
    	$is_more_records = "";

    	//Creating string which contain logged_in_user's links and user himself.============
    	
    	if($this->getRequest()->getParam('logged_in_user_id')!== null 
    		&& $this->getRequest()->getParam('logged_in_user_id')!="undefined"
    			&& $this->getRequest()->getParam('logged_in_user_id')!= false)
    	{
	    	$link_list_str = \Extended\ilook_user::getRowObject($this->getRequest()->getParam('logged_in_user_id'))->getLink_list();
    		if($link_list_str)
    		{
    			$link_list_str .= ','.$this->getRequest()->getParam('logged_in_user_id');
    		}
    		else
    		{
    			$link_list_str .= $this->getRequest()->getParam('logged_in_user_id');
    		}
    	}
    	else
    	{
    		$link_list_str = null;
    	}
    	
    	//===================================================================================
    	if($this->getRequest()->getParam( 'wallpost_id' )){
    		if( \Extended\wall_post::getRowObject( $this->getRequest()->getParam( 'wallpost_id' ) ))
    		{
    			$ppl_who_shared = \Extended\share::getDistinctUserRecordsByWallpostIdOrALbumIdOrPhotoId($this->getRequest()->getParam( 'wallpost_id' ),1, $link_list_str);
    			
    			if($ppl_who_shared)
	    		{
	    			$limit = $this->getRequest()->getParam( 'limit');
	    			$offset = $this->getRequest()->getParam( 'offset');
	    			
	    			//Applying offset and limit on users record.
	    			if(isset($offset))
	    			{
	    				$user_record_sliced = array_slice( $ppl_who_shared, $offset, $limit );
		    			//Find is more record available by applying nxt_offset.
		    			$is_more_records = array_slice( $ppl_who_shared, ($offset+$limit));
	    			}
	    			else
	    			{
	    				$user_record_sliced = $ppl_who_shared;
	    			}
	    			foreach ($user_record_sliced as $rec)
	    			{
	    				$user_id_arr[] = $rec['user_id'];
	    			}
	    			//implode ids of users_who_shared_post.
	    			$user_ids_str = implode(',', $user_id_arr);
	    			
	    			//Get object of users_who_shared_post.
	 				$user_obj = Extended\ilook_user::getUsersByUserIdString($user_ids_str);
	    			if($user_obj){
	    				foreach( $user_obj as $key=>$user )
	    				{
	    					$mutual_arr=\Extended\ilook_user::getMutualLinks(\Auth_UserAdapter::getIdentity()->getId(), $user->getId());
	    					$mutualFrdsCount = count($mutual_arr);
	    					if(\Auth_UserAdapter::getIdentity()->getId() == $user->getId()){
	    						$user_info[$key]["mutual_count"] =  "Me";}
	    					else{
	    						$user_info[$key]["mutual_count"] =  $mutualFrdsCount;
                            }

                            $blocked_user = \Extended\blocked_users::getAllBlockersAndBlockedUsers(\Auth_UserAdapter::getIdentity()->getId());

                            $user_info[$key]["user_id"] = $user->getId();
	    					$user_info[$key]["user_image"] = \Helper_common::getUserProfessionalPhoto($user->getId(), 3,false,$blocked_user);
	    					$user_info[$key]["user_full_names"] = $user->getFirstname()." ".$user->getLastname();
	    					$user_info[$key]["link_info"] = \Extended\link_requests::getFriendRequestState( $user->getId() );
	    				}
	    				$result = array('user_info'=>$user_info, 'is_more_records'=>count($is_more_records));
	    				echo Zend_Json::encode( $result );
	    			}
	    			else{
	    				echo Zend_Json::encode( 0 );
	    			}
	    		}
    			else
    			{
    				echo Zend_Json::encode( 0 );
    			}
    	
    		}
    		else
    		{
    			echo Zend_Json::encode( 0 );
    		}
    	}
    	else
    	{
    		echo Zend_Json::encode( 0 );
    	}
    	die;
    }
    /**
     * used for ajax call.
     * echo json of users who shared album.
     *
     * @author jsingh7
     * @author hkaur5
     * @version 1.0
     */
    public function getWhoSharedAlbumAction()
    {
// 	    echo Zend_Json::encode( \Extended\share::getUsersForalbum( $this->getRequest()->getParam( 'album_id' ) ) );
// 	    die;
    	$user_id_arr = array();
    	$user_info = array();
    	$is_more_records = "";
    	if($this->getRequest()->getParam( 'album_id' )){
    		if( \Extended\socialise_album::getRowObject( $this->getRequest()->getParam( 'album_id' ) )){
    			$ppl_who_shared = \Extended\share::getDistinctUserRecordsByWallpostIdOrALbumIdOrPhotoId($this->getRequest()->getParam( 'album_id' ),2);
    			if($ppl_who_shared)
	    			{
	    			$limit = $this->getRequest()->getParam( 'limit');
	    			$offset = $this->getRequest()->getParam( 'offset');
	    			
	    			//Applying offset and limit on users record.
	    			if(offset)
	    			{
	    				$user_record_sliced = array_slice( $ppl_who_shared, $offset, $limit );
		    			//Find is more record available by applying nxt_offset.
		    			$is_more_records = array_slice( $ppl_who_shared, ($offset+$limit));
	    			}
	    			else
	    			{
	    				$user_record_sliced = $ppl_who_shared;
	    			}
	    			
	    			//Find is more record available.
	    			$is_more_records = array_slice( $ppl_who_shared, ($offset+$limit));
	    			foreach ($user_record_sliced as $rec)
	    			{
	    				$user_id_arr[] = $rec['user_id'];
	    			}
	    			
	    			//implode ids of users_who_shared_post.
	    			$user_ids_str = implode(',', $user_id_arr);
	    			
	    			//Get object of users_who_shared_post.
	 				$user_obj = Extended\ilook_user::getUsersByUserIdString($user_ids_str);
	    			if($user_obj){
	    				foreach( $user_obj as $key=>$user )
	    				{
	    					$mutual_arr=\Extended\ilook_user::getMutualLinks(\Auth_UserAdapter::getIdentity()->getId(), $user->getId());
	    					$mutualFrdsCount = count($mutual_arr);
	    					if(\Auth_UserAdapter::getIdentity()->getId() == $user->getId()){
	    						$user_info[$key]["mutual_count"] =  "Me";}
	    					else{
	    						$user_info[$key]["mutual_count"] =  $mutualFrdsCount;}
                            $blocked_user = \Extended\blocked_users::getAllBlockersAndBlockedUsers(\Auth_UserAdapter::getIdentity()->getId());

                            $user_info[$key]["user_id"] = $user->getId();
	    					$user_info[$key]["user_image"] = \Helper_common::getUserProfessionalPhoto($user->getId(), 3,false,$blocked_user);
	    					$user_info[$key]["user_full_names"] = $user->getFirstname()." ".$user->getLastname();
	    					$user_info[$key]["link_info"] = \Extended\link_requests::getFriendRequestState( $user->getId() );
	    				}
	    				$result = array('user_info'=>$user_info, 'is_more_records'=>count($is_more_records));
	    				echo Zend_Json::encode( $result );
	    			}
	    			else{
	    				echo Zend_Json::encode( 0 );}
	    		}
    			else{
    				echo Zend_Json::encode( 0 );}
    			}
    		else
    		{
    			echo Zend_Json::encode( 0 );
    		}
    	}
    	else{
    		echo Zend_Json::encode( 0 );}
    	die;
    }
    
    /**
     * Returns comments for wallpost.
     * Used for ajax call for displaying comments
     * and again called when to show more comments.
     * 
     * @author jsingh7
     * @version 1.0
     */
    public function getCommentsForWallpostAction()
    {
    $params = $this->getRequest()->getParams();
    //Get users blocked and users who have blocked logged in user.
	$blocked_user = \Extended\blocked_users::getAllBlockersAndBlockedUsers(Auth_UserAdapter::getIdentity()->getId());
	
	echo Zend_Json::encode( \Extended\comments::getCommentsForWallpost( \Auth_UserAdapter::getIdentity()->getId(), $params['wallpost_id'], $params['offset'], 10, $blocked_user ) );
	

	die;
    }
    /**
     * Returns comments for wallpost.
     * Used for ajax call for displaying comments
     * and again called when to show more comments.
     * 
     * @author jsingh7
     * @version 1.0
     */
    public function getCommentsForAlbumAction()
    {
    $params = $this->getRequest()->getParams();
    //Get users blocked and users who have blocked logged in user.
	$blocked_user = \Extended\blocked_users::getAllBlockersAndBlockedUsers(Auth_UserAdapter::getIdentity()->getId());
	
	echo Zend_Json::encode( \Extended\comments::getCommentsForAlbum( \Auth_UserAdapter::getIdentity()->getId(), $params['album_id'], $params['offset'], 10, $blocked_user ) );
	

	die;
    }
    
    /**
     * Fetch photofeed info for ajax call
     * 
     * @author jsingh7
     * 
     */
    public function getPhotofeedInfoAction()
    {
	    $params = $this->getRequest()->getParams();
	    
   	 	$result = \Extended\wall_post::getWallpostInfo( $params['wallpost_id'] );
   	 
		echo Zend_Json::encode( $result );
	    die;
    }
    
    
    /**
     *  Call getWallpostInfo($wallpost_id)
     *  Here we will check post type and then decide if it is
     * 	root/original or child/shared.
     * 	if it is shared wallpost then
     *  get its root wallpost and pass its id to getWallpostInfo instead of wallpost_id we are
     *  getting from params.
     *
     *  Seperately made for Socialise section though already present in dashboard section because socialise section functionality
     *  may differ in future for this particular thing.
     *  @return json_encoded array
     *  @abstract Use it to get info of wallpost in case you want to get info of root wallpost.
     *  @author hkaur5
     */
    public function getInfoOfOriginalWallpostAction()
    {
    	$wallpost_id =  $this->getRequest()->getParam('wallpost_id');
    	 
    	$wallpost_obj = \Extended\wall_post::getRowObject($wallpost_id);
    	//In case of shared wallposts.
    	if( $wallpost_obj->getPost_update_type() == 17)
    	{
    		if($wallpost_obj->getShared_from_wallpost())
    		{
    			$result = \Extended\wall_post::getWallpostInfo( $wallpost_obj->getShared_from_wallpost()->getId() );
    		}
    		else
    		{
    			$result = \Extended\wall_post::getWallpostInfo( $wallpost_id );
    		}
    	}
        
    	//In case of normal wallpost
    	else
    	{
    		$result = \Extended\wall_post::getWallpostInfo( $wallpost_id );
    	}
    	 
    	//Send response to ajax function
    	if( $result )
    	{
    		echo Zend_Json::encode( $result );
    	}
    	else
    	{
    		//     		wallpost doesnot exist.
    		echo Zend_Json::encode( 2 );
    	}
    	die;
    }
    /**
     * Fetch Album info for ajax call
     *
     * @author hkaur5
     *
     */
    public function getAlbumInfoAction()
    {
    	$params = $this->getRequest()->getParams();

    	$result = \Extended\socialise_album::getSocialiseAlbumInfo( $params['album_id'] );
    
    	if( $result ):
    	echo Zend_Json::encode( $result );
    	else:
    	//Wallpost doesnot exist anymore.
    	echo Zend_Json::encode( 2 );
    	endif;
    	die;
    }
    
    
    /**
     * Posts photofeed on user wall from wall
     * Or share photo from detail page
     * when there is no associated wallpost.
     * 
     * @author jsingh7,sjaiswal
     * @version 1.1
     *
     */
    public function sharePhotofeedFromWallAction()
    {
    	$prms = $this->getRequest()->getParams();
    	
    	$zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
    	$photo_text_filtered = $zend_filter_obj->filter( $this->getRequest()->getParam("photo_text") );
    	
    	$logged_in_user_id = Auth_UserAdapter::getIdentity()->getId();
        
        //getting paths to user default album directory to store images.
        $userDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id;
        $userAlbumDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id.'\\album_default';
        $galleryDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id.'\\album_default\\gallery_thumbnails';
        $wallDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id.'\\album_default\\wall_thumbnails';
        $popupDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id.'\\album_default\\popup_thumbnails';
        $originalDirecory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id.'\\album_default\\original_photos';
        
        // Creating directories
        if ( !file_exists( $userDirectory ) )
        {
            mkdir( $userDirectory, 0777, true );
            mkdir( $userAlbumDirectory, 0777, true );
            mkdir( $originalDirecory, 0777, true );
            mkdir( $popupDirectory, 0777, true );
            mkdir( $wallDirectory, 0777, true );
            mkdir( $galleryDirectory, 0777, true );
        }
        else
        {
        	//This case will occur when user directory exists but album dir does not.
            if ( !file_exists( $userAlbumDirectory ) )
            {
                mkdir( $userAlbumDirectory, 0777, true );
                mkdir( $originalDirecory, 0777, true );
                mkdir( $wallDirectory, 0777, true );
                mkdir( $popupDirectory, 0777, true );
                mkdir( $galleryDirectory, 0777, true );
            }
        }

        //===================================================================
        //share in case of single photo i.e. share photo on photo detail page
        //===================================================================
        if( $prms['shared_from_photodetail_to_wall'] == 1 )
        {
        	
        	//Create photo group for these photos.
        	$photo_group_id = \Extended\photo_group::addPhotoGroup( Auth_UserAdapter::getIdentity()->getId() );
        	
        	$imgObj = \Extended\socialise_photo::getRowObject($prms['photo_id']);
        	$album_owner_id = $imgObj->getSocialise_photosSocialise_album()->getSocialise_albumIlook_user()->getId();
        	 
        	$album_name = $imgObj->getSocialise_photosSocialise_album()->getAlbum_name();
        	$album_timestamp = $imgObj->getSocialise_photosSocialise_album()->getCreated_at_timestamp()->getTimestamp();
        	$img_id = $imgObj->getId();
        	 
        	if( strtolower($album_name)== strtolower(\Extended\socialise_album::DEFAULT_ALBUM_NAME) )
        	{
        		$albName =  \Extended\socialise_album::DEFAULT_ALBUM_NAME;
        	}
        	else if(strtolower($album_name)== strtolower(\Extended\socialise_album::PROFILE_PHOTOS_ALBUM_NAME ))
        	{
        		$albName = \Extended\socialise_album::PROFILE_PHOTOS_ALBUM_NAME;
        	}
        	else if(strtolower($album_name)== strtolower(\Extended\socialise_album::COVER_PHOTOS_ALBUM_NAME ))
        	{
        		$albName = \Extended\socialise_album::COVER_PHOTOS_ALBUM_NAME;
        	}
        	else
        	{
        		$albName = $album_name."_".$album_timestamp;
        	}
        	 
        	$image_path = IMAGE_PATH."/albums/user_".$album_owner_id."/album_".$albName."/wall_thumbnails/thumbnail_".$imgObj->getImage_name();
        	$gallery_image_path = IMAGE_PATH."/albums/user_".$album_owner_id."/album_".$albName."/gallery_thumbnails/thumbnail_".$imgObj->getImage_name();
        	$original_image_path = IMAGE_PATH."/albums/user_".$album_owner_id."/album_".$albName."/original_photos/".$imgObj->getImage_name();
        	$popup_image_path = IMAGE_PATH."/albums/user_".$album_owner_id."/album_".$albName."/popup_thumbnails/thumbnail_".$imgObj->getImage_name();
 
        	$unique_image_name = Helper_common::getUniqueNameForFile($imgObj->getImage_name());
        	$new_image_name = 'thumbnail_'.$unique_image_name;

        	// copy image in gallery thumbnails directory
        	copy( $gallery_image_path, $galleryDirectory."/".$new_image_name);
        	
        	// copy image in original photos directory
        	copy( $original_image_path, $originalDirecory."/".$unique_image_name);
        	
        	// copy image in popup thumbnails directory
        	copy( $popup_image_path, $popupDirectory."/".$new_image_name);
        	
        	//copy image in wall thumbnails directory
        	if( copy( $image_path, $wallDirectory."/".$new_image_name ) )
        	

        	//Getting the id of default album.
        	$default_album_id = \Extended\socialise_album::isThisTypeOfAlbumExists( Auth_UserAdapter::getIdentity()->getId(), \Extended\socialise_album::DEFAULT_ALBUM_NAME );
        	
        	if( !$default_album_id )
        	{
        		//Making entry to DB.
        		$album_data = \Extended\socialise_album::addAlbum(
        				Auth_UserAdapter::getIdentity()->getId(),
        				\Extended\socialise_album::DEFAULT_ALBUM_NAME,
        				\Extended\socialise_album::VISIBILITY_CRITERIA_PUBLIC,
        				1,
        				\Extended\socialise_album::DEFAULT_ALBUM_NAME );
        		$album_id = $album_data['id'];
        	}
        	else
        	{
        		$album_id = $default_album_id;
        	}
        	
        	
        	//get photo details
        	$photo_detail = \Extended\socialise_photo::getPhotoInfo($img_id);
        	
        	
        	//Adding entry to wallpost table for sharing photos
        	$wall_post_id = \Extended\wall_post::post_photo(
        			$photo_text_filtered,
        			$this->getRequest()->getParam("privacy"),
        			Auth_UserAdapter::getIdentity()->getId(),
        			Auth_UserAdapter::getIdentity()->getId(),
        			$imgObj->getSocialise_photosPosted_by()->getId(),
        			\Extended\wall_post::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING,
        			\Extended\wall_post::POST_TYPE_MANUAL,
        			\Extended\wall_post::WALL_TYPE_SOCIALISE,
        			$photo_group_id,
        			$album_id,
        			null,
        			$photo_detail['wallpost_text'] );
        	
        	if($album_id)
        	{
        		//adding entry to socialise photo table
        		$photo_info = \Extended\socialise_photo::addPhotos(
        				$album_id,
        				Auth_UserAdapter::getIdentity()->getId(),
        				$unique_image_name,
        				$this->getRequest()->getParam("privacy"),
        				'',
        				$photo_group_id,
        				1
        		);
        		

        		if( $photo_info )
        		{
        			
        			$return_r['wall_post_id'] = $wall_post_id;
        			$return_r['album_id'] = $album_id;
        			$return_r['user_id'] = Auth_UserAdapter::getIdentity()->getId();
        			$return_r['user_type'] = Auth_UserAdapter::getIdentity()->getUser_type();
        			$return_r['user_gender'] = Auth_UserAdapter::getIdentity()->getGender();
        			$return_r['user_name'] = Auth_UserAdapter::getIdentity()->getFirstname()." ".Auth_UserAdapter::getIdentity()->getLastname();
        			$return_r['user_image'] = Helper_common::getUserProfessionalPhoto( Auth_UserAdapter::getIdentity()->getId(), 3 );
        		
        			//Get photos of the new group, created just above.
        			$em = \Zend_Registry::get('em');
        			$em->refresh( \Extended\photo_group::getRowObject($photo_group_id) );
        			$photo_group_obj = \Extended\photo_group::getRowObject($photo_group_id);
 
        			//Get obj of photo that is shared.
        			$shared_photo_obj = \Extended\socialise_photo::getRowObject($img_id);
        			
        			
        			
        			$share_info_id = \Extended\share::addShareInfo(
        					$logged_in_user_id,
        					null,
        					$img_id
        					);
        			
        			//The image belongs to a group and it is single inside it.
        			//Insert share record for its wallpost also.
        			if( $imgObj->getPhotoGroup() )
        			{
        				if( $imgObj->getPhotoGroup()->getSocialisePhoto()->count() == 1 )
        				{
        					$share_info_id = \Extended\share::addShareInfo(
        							$logged_in_user_id,
        							$imgObj->getPhotoGroup()->getWallPost()->getId()
        					);
        					$return_r['source_wall_post_id'] = $imgObj->getPhotoGroup()->getWallPost()->getId();
        				}
        			}
        			
        			 
        			$share_count_of_album = '';
        			$share_count_of_photo  = $shared_photo_obj->getSocialise_photosShare()->count();
        	
        			$k = 0;
        			foreach ( $photo_group_obj->getSocialisePhoto() as $photo )
        			{
        				$return_r['collage'][$k]['image_path'] = IMAGE_PATH."/albums/user_".$logged_in_user_id."/album_default/wall_thumbnails/thumbnail_".$photo->getImage_name();
        				$return_r['collage'][$k]['image_id'] = $photo->getId();
        				$k++;
        			}
        		
        			
        			$current_datetime_obj = new \DateTime();
        			$return_r['collage_description'] = $photo_text_filtered;
        			$return_r['collage_description_when_shared'] = $photo_detail['wallpost_text'];
        			
        			// original user data
        			$return_r['original_user_id'] = $photo_detail['original_user_id'];
        			$return_r['original_user_full_name'] = $photo_detail['original_user_full_name'];
        			$return_r['original_user_type'] = $photo_detail['original_user_type'];
        			$return_r['original_user_prof_pic'] = Helper_common::getUserProfessionalPhoto( $album_owner_id,3);
        			
        			
        			$return_r['original_user_post_created_at'] = \Helper_common::nicetime($imgObj->getCreated_at()->format("Y-m-d H:i"));
        			// original user data ends.
        			
        			
        			$return_r['collage_created_at'] = \Helper_common::nicetime( $current_datetime_obj->format("Y-m-d H:i") );
        			$return_r['is_ok_comment_share_pannel_visible'] = \Helper_common::is_ok_comment_share_pannel_visible(  $this->getRequest()->getParam("privacy"), Auth_UserAdapter::getIdentity()->getId(), array(Auth_UserAdapter::getIdentity()->getId()), Auth_UserAdapter::getIdentity()->getId() );
        			$return_r['privacy'] = $this->getRequest()->getParam("privacy");
        			$return_r['post_update_type'] = \Extended\wall_post::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING;
        			$return_r['is_success'] = 1;
        			$return_r['msg'] = "Photo uploaded successfully.";
        			$return_r['share_count_of_photo'] = $share_count_of_photo;
        			
        			echo Zend_Json::encode( $return_r );
        			die;
        		}
        		else
        		{
        			$return_r['is_success'] = 0;
        			$return_r['msg'] = "Oops! An error occured while posting your photos. Please try again.";
        			echo Zend_Json::encode( $return_r );
        			die;
        		}
        	}
        	else
        	{
        		$return_r['is_success'] = 0;
        		$return_r['msg'] = "Oops! An error occured while posting your photos. Please try again.";
        		echo Zend_Json::encode( $return_r );
        		die;
        	}
    
        }
        
        /*===================================================================
        sharing wallpost from socialise wall.
        It covers following cases:
        POST_UPDATE_TYPE_ALBUM
        POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM
        POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING
        POST_UPDATE_TYPE_PROFILE_PHOTO_CHANGED
        ===================================================================*/
        if( $prms['shared_from_wall_to_wall'] )
        {
        	
        	//get record from database
        	$wallpost_info = \Extended\wall_post::getWallpostInfo( $prms['wallpost_id'] );
        	
        	
        	$post_update_type = $wallpost_info['post_update_type'];
      
        	//Create photo group for these photos.
        	$photo_group_id = \Extended\photo_group::addPhotoGroup( Auth_UserAdapter::getIdentity()->getId() );
 
        	// case when post update type is 14 i.e profile picture is shared
        	if(
                $wallpost_info['post_update_type'] == \Extended\wall_post::POST_UPDATE_TYPE_PROFILE_PHOTO_CHANGED
                && isset($wallpost_info['image_name'])
            )
        	{
        		$unique_image_name = Helper_common::getUniqueNameForFile($wallpost_info['image_name']);
        		$new_image_name = 'thumbnail_'.$unique_image_name;
        		$image_path = $wallpost_info['image_path'];
        		$gallery_image_path = $wallpost_info['gallery_image_path'];
        		$original_image_path = $wallpost_info['original_image_path'];
        		$popup_image_path = $wallpost_info['popup_image_path'];
        		 
        		// copy image in gallery thumbnails directory
        		copy( $gallery_image_path, $galleryDirectory."/".$new_image_name);
        		 
        		// copy image in original photos directory
        		copy( $original_image_path, $originalDirecory."/".$unique_image_name);
        		 
        		// copy image in popup thumbnails directory
        		copy( $popup_image_path, $popupDirectory."/".$new_image_name);
        		 
        		//copy image in wall thumbnails directory
        		if( copy( $image_path, $wallDirectory."/".$new_image_name ) )
        		{
        			//Getting the id of default album.
        			$default_album_id = \Extended\socialise_album::isThisTypeOfAlbumExists( Auth_UserAdapter::getIdentity()->getId(), \Extended\socialise_album::DEFAULT_ALBUM_NAME );
        		
        			if( !$default_album_id )
        			{
        				//Making entry to DB.
        				$album_data = \Extended\socialise_album::addAlbum(
        						Auth_UserAdapter::getIdentity()->getId(),
        						\Extended\socialise_album::DEFAULT_ALBUM_NAME,
        						\Extended\socialise_album::VISIBILITY_CRITERIA_PUBLIC,
        						1,
        						\Extended\socialise_album::DEFAULT_ALBUM_NAME );
        				$album_id = $album_data['id'];
        			}
        			else
        			{
        				$album_id = $default_album_id;
        			}
        		}
        		
        	}
        	else 
        	{
        		$unique_image_name_db = array();
	        	foreach( $wallpost_info['collage'] as  $single_image )
	        	{
	        		$unique_image_name = Helper_common::getUniqueNameForFile($single_image['image_name']);
	        		$unique_image_name_db[] = Helper_common::getUniqueNameForFile($single_image['image_name']);
	        		$new_image_name = 'thumbnail_'.$unique_image_name;
	        		//$new_image_name = 'thumbnail_'.$single_image['image_name'];
	        		$image_path = $single_image['image_path'];
	        		$gallery_image_path = $single_image['gallery_image_path'];
	        		$original_image_path = $single_image['original_image_path'];
	        		$popup_image_path = $single_image['popup_image_path'];
	        		
	        		// copy image in gallery thumbnails directory
	        		copy( $gallery_image_path, $galleryDirectory."/".$new_image_name);
	        		
	        		// copy image in original photos directory
	        		copy( $original_image_path, $originalDirecory."/".$unique_image_name);
	        		
	        		// copy image in popup thumbnails directory
	        		copy( $popup_image_path, $popupDirectory."/".$new_image_name);
	        		
	        		//copy image in wall thumbnails directory
	        		if( copy( $image_path, $wallDirectory."/".$new_image_name ) )
	        		{		
	        			//Getting the id of default album.
	        			$default_album_id = \Extended\socialise_album::isThisTypeOfAlbumExists( Auth_UserAdapter::getIdentity()->getId(), \Extended\socialise_album::DEFAULT_ALBUM_NAME );
	   
	        			 if( !$default_album_id )
	        			 {
		        			//Making entry to DB.
	        			 	$album_data = \Extended\socialise_album::addAlbum(
	        			 			Auth_UserAdapter::getIdentity()->getId(),
	        			 			\Extended\socialise_album::DEFAULT_ALBUM_NAME,
	        			 			\Extended\socialise_album::VISIBILITY_CRITERIA_PUBLIC,
	        			 			1,
	        			 			\Extended\socialise_album::DEFAULT_ALBUM_NAME );
	        			 	$album_id = $album_data['id'];
	        			 }
	        			 else
	        			 {
	        			 	$album_id = $default_album_id;	
	        			 }
	        		} 
	        	}
        	}
  
        	//Adding entry to wallpost table for sharing photos
        	$wall_post_id = \Extended\wall_post::post_photo(
        			$photo_text_filtered,
        			$this->getRequest()->getParam("privacy"),
        			Auth_UserAdapter::getIdentity()->getId(),
        			Auth_UserAdapter::getIdentity()->getId(),
        			$wallpost_info['wallpost_user_id'],
        			\Extended\wall_post::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING,
        			\Extended\wall_post::POST_TYPE_MANUAL,
        			\Extended\wall_post::WALL_TYPE_SOCIALISE,
        			$photo_group_id,
        			$album_id,
        			null,
        			$wallpost_info['wallpost_text'],
        			$prms['wallpost_id'] );
      
        	if( $album_id )
        	{
        		if($wallpost_info['post_update_type'] == \Extended\wall_post::POST_UPDATE_TYPE_PROFILE_PHOTO_CHANGED)
        		{
        			$photo_names_arr = $unique_image_name;
        		}
        		else 
        		{
	        		$photo_names_arr = array();
	        		foreach ( $unique_image_name_db as $photo_name )
	        		{
	        			$photo_names_arr[] = $photo_name;
	        		}	
        		}
        		
        	
        		//adding entry to socialise photo table
        		$photo_info = \Extended\socialise_photo::addPhotos(
        				$album_id,
        				Auth_UserAdapter::getIdentity()->getId(),
        				$photo_names_arr,
        				$this->getRequest()->getParam("privacy"),
        				'',
        				$photo_group_id
        		);
        	
        		if( $photo_info )
        		{
        			$return_r['wall_post_id'] = $wall_post_id;
        			$return_r['album_id'] = $album_id;
        			$return_r['user_id'] = Auth_UserAdapter::getIdentity()->getId();
        			$return_r['user_gender'] = Auth_UserAdapter::getIdentity()->getGender();
        			$return_r['user_name'] = Auth_UserAdapter::getIdentity()->getFirstname()." ".Auth_UserAdapter::getIdentity()->getLastname();
        			$return_r['user_image'] = Helper_common::getUserProfessionalPhoto( Auth_UserAdapter::getIdentity()->getId(), 3 );
        			 
        			//Get photos of the new group, created just above.
        			$em = \Zend_Registry::get('em');
        			$em->refresh( \Extended\photo_group::getRowObject($photo_group_id) );
        			$photo_group_obj = \Extended\photo_group::getRowObject($photo_group_id);
        			
        			//====================================================================
        			// Adding data for share table
        			//====================================================================
        			
        			//Get obj of obj of wallpost that is shared.
					$shared_wallpost_obj = \Extended\wall_post::getRowObject($prms['wallpost_id']);
        			
        	
        			if( $shared_wallpost_obj->getPost_update_type() == \Extended\wall_post::POST_UPDATE_TYPE_ALBUM )
        			{
        				$share_info_id = \Extended\share::addShareInfo(
        															$logged_in_user_id, 
									        						$prms['wallpost_id'], 
									        						null, 
																	$shared_wallpost_obj->getWall_postsSocialise_album()->getId());
        				$share_count_of_album = $shared_wallpost_obj->getWall_postsSocialise_album()->getShare()->count();
        				$share_count_of_post  = $shared_wallpost_obj->getWall_postsShare()->count();
        			}
        			elseif ($shared_wallpost_obj->getPost_update_type() == \Extended\wall_post::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM 
        					|| $shared_wallpost_obj->getPost_update_type() == \Extended\wall_post::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING  )
        			{
        				$share_info_id = \Extended\share::addShareInfo(
										        						$logged_in_user_id, 
										        						$prms['wallpost_id'], 
										        						null, 
										        						null);
        				$share_count_of_album = '';
        				$share_count_of_post  = $shared_wallpost_obj->getWall_postsShare()->count();
        			}	
        			elseif($shared_wallpost_obj->getPost_update_type() == \Extended\wall_post::POST_UPDATE_TYPE_PROFILE_PHOTO_CHANGED)
        			{
        				$share_info_id = \Extended\share::addShareInfo(
        						$logged_in_user_id,
        						$prms['wallpost_id'],
        						null,
        						null);
        				$share_count_of_album = '';
        				$share_count_of_post  = $shared_wallpost_obj->getWall_postsShare()->count();
        				
        			}
        			//====================================================================
        			//Adding data for share table Ends
        			//====================================================================
        		
		        			$k = 0;
		        			foreach ( $photo_group_obj->getSocialisePhoto() as $photo )
		        			{
		        				$return_r['collage'][$k]['image_path'] = IMAGE_PATH."/albums/user_".$logged_in_user_id."/album_default/wall_thumbnails/thumbnail_".$photo->getImage_name();
		        				$return_r['collage'][$k]['image_id'] = $photo->getId();
		        				$size = getimagesize( $return_r['collage'][$k]['image_path'] );
		        				$k++;
		        				$width = $size[0];
		        				$height = $size[1];
		        				$aspect = $height / $width;
		        				if ($aspect >= 1)
		        				{
		        				//vertical
		        				$return_r['first_img_portrait_or_landscape'] = 1;
		        				}
		        				else
		        				{
		        				//horizontal
		        				$return_r['first_img_portrait_or_landscape'] = 2;
		        				} 
		        			}
		        		
        
        			$return_r['collage_description'] = $photo_text_filtered;
        			$return_r['collage_description_when_shared'] = $wallpost_info['wallpost_text'];
        			$current_datetime_obj = new \DateTime();
        			$return_r['collage_created_at'] = \Helper_common::nicetime( $current_datetime_obj->format("Y-m-d H:i") );
        			$return_r['is_ok_comment_share_pannel_visible'] = \Helper_common::is_ok_comment_share_pannel_visible(  $this->getRequest()->getParam("privacy"), Auth_UserAdapter::getIdentity()->getId(), array(Auth_UserAdapter::getIdentity()->getId()), Auth_UserAdapter::getIdentity()->getId() );
        			$return_r['privacy'] = $this->getRequest()->getParam("privacy");
        			$return_r['post_update_type'] = \Extended\wall_post::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING;
        			$return_r['is_success'] = 1;
        			$return_r['msg'] = "Photo uploaded successfully.";
        			$return_r['original_user_id'] = $wallpost_info['original_user_id'];
        			$return_r['original_user_full_name'] = $wallpost_info['original_user_full_name'];
        			$return_r['original_user_type'] = $wallpost_info['original_user_type'];
        			$return_r['original_user_prof_pic'] = Helper_common::getUserProfessionalPhoto( $wallpost_info['original_user_id'],3);
        			$return_r['original_user_post_created_at'] = $wallpost_info['wallpost_created_at'];
//         			$return_r['original_user']['id'] = $wallpost_info['original_user_id'];
//         			$return_r['original_user']['fullname'] = $wallpost_info['original_user_full_name'];
        			$return_r['share_count_of_album'] = $share_count_of_album;
        			$return_r['share_count_of_post'] = $share_count_of_post;
        			$return_r['sharers_string']['string'] = Helper_common::getSharerStringforPost($wall_post_id,$logged_in_user_id);
					$return_r['sharers_string']['shared_from_wallpost_exist'] = true;
     	 	
        			
        			echo Zend_Json::encode( $return_r );
        			die;
        		}
        		else
        		{
        			$return_r['is_success'] = 0;
        			$return_r['msg'] = "Oops! An error occured while posting your photos. Please try again.";
        			echo Zend_Json::encode( $return_r );
        			die;
        		}
        	}
        	else
        	{
        		$return_r['is_success'] = 0;
        		$return_r['msg'] = "Oops! An error occured while posting your photos. Please try again.";
        		echo Zend_Json::encode( $return_r );
        		die;
        	}
	
        }
        
        //==============================================================================
        // Sharing albums from albums section, which does not has associated wallpost [ no wallpost id ]. 
        // i.e. albums like default, profile pictures and cover photo etc.
        //==============================================================================
        else if($prms['sharing_album_only'])
        {
        	//get record from database
        	$album_info = \Extended\socialise_album::getSocialiseAlbumInfo($prms['album_id']);
        	
        	//Create photo group for these photos.
        	$photo_group_id = \Extended\photo_group::addPhotoGroup( Auth_UserAdapter::getIdentity()->getId() );
        	
        	foreach( $album_info['collage'] as  $single_image )
        	{
        		$unique_image_name = Helper_common::getUniqueNameForFile($single_image['image_name']);
        		$unique_image_name_db[] = Helper_common::getUniqueNameForFile($single_image['image_name']);
        		$new_image_name = 'thumbnail_'.$unique_image_name;
        		$image_path = $single_image['image_path'];
        		$gallery_image_path = $single_image['gallery_image_path'];
        		$original_image_path = $single_image['original_image_path'];
        		$popup_image_path = $single_image['popup_image_path'];
        		
        		
        		// copy image in gallery thumbnails directory
        		copy( $gallery_image_path, $galleryDirectory."/".$new_image_name);
        	
        		// copy image in original photos directory
        		copy( $original_image_path, $originalDirecory."/".$unique_image_name);
        	
        		// copy image in popup thumbnails directory
        		copy( $popup_image_path, $popupDirectory."/".$new_image_name);
        	
        		//copy image in wall thumbnails directory
        		if( copy( $image_path, $wallDirectory."/".$new_image_name ) )
        		{
        			//Getting the id of default album.
        			$default_album_id = \Extended\socialise_album::isThisTypeOfAlbumExists( Auth_UserAdapter::getIdentity()->getId(), \Extended\socialise_album::DEFAULT_ALBUM_NAME );
        			 
        			if( !$default_album_id )
        			{
        				//Making entry to DB.
        				$album_data = \Extended\socialise_album::addAlbum(
        						Auth_UserAdapter::getIdentity()->getId(),
        						\Extended\socialise_album::DEFAULT_ALBUM_NAME,
        						\Extended\socialise_album::VISIBILITY_CRITERIA_PUBLIC,
        						1,
        						\Extended\socialise_album::DEFAULT_ALBUM_NAME );
        				$album_id = $album_data['id'];
        			}
        			else
        			{
        				$album_id = $default_album_id;
        			}
        		}
        	}
        	
        	//Adding entry to wallpost table for sharing photos
        	$wall_post_id = \Extended\wall_post::post_photo(
        			$photo_text_filtered,
        			$this->getRequest()->getParam("privacy"),
        			Auth_UserAdapter::getIdentity()->getId(),
        			Auth_UserAdapter::getIdentity()->getId(),
        			$album_info["original_user_id"],
        			\Extended\wall_post::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING,
        			\Extended\wall_post::POST_TYPE_MANUAL,
        			\Extended\wall_post::WALL_TYPE_SOCIALISE,
        			$photo_group_id,
        			$album_id,
        			null,
        			null );
        	
        	if( $album_id )
        	{
        		$photo_names_arr = array();
        		foreach ( $unique_image_name_db as $unique_image_name )
        		{
        			$photo_names_arr[] = $unique_image_name;
        		}
        	
        		//adding entry to socialise photo table
        		$photo_info = \Extended\socialise_photo::addPhotos(
        				$album_id,
        				Auth_UserAdapter::getIdentity()->getId(),
        				$photo_names_arr,
        				$this->getRequest()->getParam("privacy"),
        				'',
        				$photo_group_id
        		);
        	
        	
        		if( $photo_info )
        		{
        			$return_r['wall_post_id'] = $wall_post_id;
        			$return_r['album_id'] = $album_id;
        			$return_r['user_id'] = Auth_UserAdapter::getIdentity()->getId();
        			$return_r['user_gender'] = Auth_UserAdapter::getIdentity()->getGender();
        			$return_r['user_name'] = Auth_UserAdapter::getIdentity()->getFirstname()." ".Auth_UserAdapter::getIdentity()->getLastname();
        			$return_r['user_image'] = Helper_common::getUserProfessionalPhoto( Auth_UserAdapter::getIdentity()->getId(), 3 );
        	
        			//Get photos of the new group, created just above.
        			$em = \Zend_Registry::get('em');
        			$em->refresh( \Extended\photo_group::getRowObject($photo_group_id) );
        			$photo_group_obj = \Extended\photo_group::getRowObject($photo_group_id);
        			 
        			//====================================================================
        			// Adding data for share table
        			//====================================================================
        			 
        			//Get obj of obj of wallpost that is shared.
        			$shared_album_obj = \Extended\socialise_album::getRowObject($prms['album_id'] );
        			 
        			 
        				$share_info_id = \Extended\share::addShareInfo(
        						$logged_in_user_id,
        						null,
        						null,
        						$prms['album_id']);
        				$share_count_of_album = $shared_album_obj->getShare()->count();
        			//====================================================================
        			//Adding data for share table Ends
        			//====================================================================
        			$k = 0;
        			foreach ( $photo_group_obj->getSocialisePhoto() as $photo )
        			{
        				$return_r['collage'][$k]['image_path'] = IMAGE_PATH."/albums/user_".$logged_in_user_id."/album_default/wall_thumbnails/thumbnail_".$photo->getImage_name();
        				$return_r['collage'][$k]['image_id'] = $photo->getId();
        				$size = getimagesize( $return_r['collage'][$k]['image_path'] );
        				$k++;
        				$width = $size[0];
        				$height = $size[1];
        				$aspect = $height / $width;
        				if ($aspect >= 1)
        				{
        					//vertical
        					$return_r['first_img_portrait_or_landscape'] = 1;
        				}
        				else
        				{
        					//horizontal
        					$return_r['first_img_portrait_or_landscape'] = 2;
        				}
        			}
        	
        			$return_r['collage_description'] = $photo_text_filtered;
//         			$return_r['collage_description_when_shared'] = $wallpost_info['wallpost_text'];
        			$current_datetime_obj = new \DateTime();
        			$return_r['collage_created_at'] = \Helper_common::nicetime( $current_datetime_obj->format("Y-m-d H:i") );
        			$return_r['is_ok_comment_share_pannel_visible'] = \Helper_common::is_ok_comment_share_pannel_visible(  $this->getRequest()->getParam("privacy"), Auth_UserAdapter::getIdentity()->getId(), array(Auth_UserAdapter::getIdentity()->getId()), Auth_UserAdapter::getIdentity()->getId() );
        			$return_r['privacy'] = $this->getRequest()->getParam("privacy");
        			$return_r['post_update_type'] = \Extended\wall_post::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING;
        			$return_r['is_success'] = 1;
        			$return_r['msg'] = "Photo uploaded successfully.";
        			$return_r['original_user_id'] = $album_info['original_user_id'];
        			$return_r['original_user_full_name'] = $album_info['original_user_full_name'];
        			$return_r['share_count_of_album'] = $share_count_of_album;
        			$return_r['share_count_of_post'] = '';
        			echo Zend_Json::encode( $return_r );
        			die;
        		}
        		else
        		{
        			$return_r['is_success'] = 0;
        			$return_r['msg'] = "Oops! An error occured while posting your photos. Please try again.";
        			echo Zend_Json::encode( $return_r );
        			die;
        		}
        	}
        	else
        	{
        		$return_r['is_success'] = 0;
        		$return_r['msg'] = "Oops! An error occured while posting your photos. Please try again.";
        		echo Zend_Json::encode( $return_r );
        		die;
        	}
        }
        
}
    	
    	
    	

    /**
     * Used for edit the comment.
     * 
     * @author jsingh7
     */
    public function editCommentAction()
    {
    	$params = $this->getRequest()->getParams();
    	$zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
    	$comment_text_filtered = $zend_filter_obj->filter( $params['comment_text'] );
    	
    	echo Zend_Json::encode( \Extended\comments::editComment( $params['comment_id'], $comment_text_filtered ) );
    	die;
    }

    /**
     * Used for edit the comment.
     * 
     * @author jsingh7
     */
    public function editPhotoCommentAction()
    {
    	$params = $this->getRequest()->getParams();
    	
    	$zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
    	$comment_text_filtered = $zend_filter_obj->filter( $params['comment_text'] );
    	echo Zend_Json::encode( \Extended\comments::editPhotoComment( $params['comment_id'], $comment_text_filtered ) );
    	die;
    }
    
    
    /**
     * Used for edit the comment. [modified to prevent xss attack]
     *
     * @author jsingh7
     */
    /*
    public function editCommentAction()
    {
     
     $params = $this->getRequest()->getParams();
    echo Zend_Json::encode( \Extended\comments::editCommentOfWallpostAndRelatedPhoto( $params['comment_id'], Auth_UserAdapter::getIdentity()->getId(), $params['comment_text'] ) );
    die;
    }
    */
    
    /**
     * Used for deleting the comment.
     * Delete rocords regarding comments from following tables:
     * 1.Comments
     * 3.socialise_photo
     * 4.users_comments_visibility
     * 
     * @author jsingh7
     */
    public function deleteCommentAction()
    {
        if( $this->getRequest()->getParam('comment_id') )
        {
        	
    		  $is_deleted = \Extended\comments::deleteComment( $this->getRequest()->getParam('comment_id'), Auth_UserAdapter::getIdentity()->getId() );
             
             //Removing hidden comment records.
             \Extended\users_comments_visibility::unhideComment( $this->getRequest()->getParam('comment_id') );
             
             if( $is_deleted )
             {
                   echo Zend_Json::encode( $is_deleted );
             }
             else
             {
                   echo Zend_Json::encode( 0 );          
             }
        }
        else
        {
              echo Zend_Json::encode( 0 );
        }    
        die;
    }
    
    /**
     * 
     */
    public function hideCommentOfUserAction()
    {
    $params = $this->getRequest()->getParams();
    if(\Extended\users_comments_visibility::hideCommentOfUser( Auth_UserAdapter::getIdentity()->getId(), $params['comment_id'] ) )
    {
          echo Zend_Json::encode(1);
    }
    else
    {
          echo Zend_Json::encode(0);
    }
    die;
    }
    
    /**
     * Fetching comment detail on basis of comment_id
     * @author unknown
     * @return JsonArrayType ( json encode array of comment detail )
     */
    public function showCommentOfUserAction()
    {
    $params = $this->getRequest()->getParams();
    //Get users blocked and users who have blocked logged in user.
    $blocked_user = \Extended\blocked_users::getAllBlockersAndBlockedUsers(Auth_UserAdapter::getIdentity()->getId());
    
    $comments_obj = \Extended\comments::getRowObject( $params['comment_id'] );
    
    if($blocked_user)
    {
    	$comment_user_photo_detail = \Extended\comments::getUsersPhotoForComment($comments_obj->getCommentsIlook_user()->getId(), $blocked_user);
    }
    else
    {
    	$comment_user_photo_detail['photo_path'] = \Helper_common::getUserProfessionalPhoto($comments_obj->getCommentsIlook_user()->getId(), 3);
    	$comment_user_photo_detail['is_photo_clickable'] = true;
    }
    if( $comments_obj->getCommentsIlook_user()->getAccount_closed_on())
    {
    	$comment_user_photo_detail['photo_path'] = \Helper_common::getUserProfessionalPhoto($comments_obj->getCommentsIlook_user()->getId(), 3);
    	$comment_user_photo_detail['is_photo_clickable'] = false;
    }
     $ret_r = array();
    $ret_r['comm_id'] = $params['comment_id'];
    $ret_r['comm_text'] = $comments_obj->getComment_text();
    $ret_r['same_comm_id'] = $comments_obj->getSame_comment_id();
    $ret_r['commenter_id'] = $comments_obj->getCommentsIlook_user()->getId();
    $ret_r['commenter_fname'] = $comments_obj->getCommentsIlook_user()->getFirstname();
    $ret_r['commenter_lname'] = $comments_obj->getCommentsIlook_user()->getLastname();
    $ret_r['commenter_small_image'] = $comment_user_photo_detail['photo_path'];
    $ret_r['is_user_photo_clickable'] = $comment_user_photo_detail['is_photo_clickable'];
    $ret_r['wp_id'] = $comments_obj->getId();
    $ret_r['created_at'] = Helper_common::nicetime( $comments_obj->getCreated_at()->format( "Y-m-d H:i:s" ));
    echo Zend_Json::encode($ret_r);
    die;
    }
	
    public function unhideCommentOfUserAction()
	{
		$params = $this->getRequest()->getParams();
		if(\Extended\users_comments_visibility::showCommentOfUser( Auth_UserAdapter::getIdentity()->getId(), $params['comment_id'] ) )
		{
				  echo Zend_Json::encode(1);
		}
		else
		{
			  echo Zend_Json::encode(0);
		}
		die; 
    }
    
    /**
     * This action is for ajax call, to delete only photo-wallpost
     * on socialise wall.
     *
     * @author jsingh7
     */
    public function deleteCollageTypeWallpostAction()
    {
        try {
            
        	$wallpost_obj = \Extended\wall_post::getRowObject( $this->getRequest()->getParam('wallpost_id') );
        	
        	switch ( $wallpost_obj->getPost_update_type() ) {
        	    
        	    case \Extended\wall_post::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM_BY_SHARING :
        	    case \Extended\wall_post::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM :
        	        	
        	       //Remove image files.
        	       foreach ( $wallpost_obj->getPhotoGroup()->getSocialisePhoto() as $photo )
        	       {
            	       @unlink(REL_IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_default/original_photos/".$photo->getImage_name() );
            	       @unlink(REL_IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_default/gallery_thumbnails/thumbnail_".$photo->getImage_name() );
            	       @unlink(REL_IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_default/popup_thumbnails/thumbnail_".$photo->getImage_name() );
            	       @unlink(REL_IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_default/wall_thumbnails/thumbnail_".$photo->getImage_name() );
        	       }
        	       
        	       //get photo_group id, call delete query on that,
        	       //the cascade in photo_group table will handle other associated
        	       //things need to be deleted.
        	       \Extended\photo_group::deletePhotoGroup( $wallpost_obj->getPhotoGroup()->getId() );
        	       
        	       
        	    break;
    
        	    case \Extended\wall_post::POST_UPDATE_TYPE_ALBUM :
        	    	
        	        //Remove image files.
        	        foreach ( $wallpost_obj->getWall_postsSocialise_album()->getSocialise_albumsSocialise_photo() as $photo )
        	        {
        	            Helper_common::deleteDir( REL_IMAGE_PATH."/albums/user_".$photo->getSocialise_photosPosted_by()->getId()."/album_".$photo->getSocialise_photosSocialise_album()->getAlbum_name()."_".$photo->getSocialise_photosSocialise_album()->getCreated_at_timestamp()->getTimeStamp() );
        	        }
        	        
        	        //get socialise_album_id, call delete query on that,
        	        //the cascade in socialise_album table will handle other associated
        	        //things need to be deleted.
        	        \Extended\socialise_album::deleteAlbum( $wallpost_obj->getWall_postsSocialise_album()->getId() );
        	        
        	    break;
        	    
        	    case \Extended\wall_post::POST_UPDATE_TYPE_PROFILE_PHOTO_CHANGED :
        	    		
        	    	//get socialise_photo_id, call delete query on that,
        	    	//the cascade in socialise_photo table will handle other associated
        	    	//things need to be deleted.
        	    	\Extended\socialise_photo::deletephoto( $wallpost_obj->getSocialisePhoto()->getId(),$wallpost_obj->getWall_postsFrom_user()->getId());
        	    		
        	    	break;
        	}
        	echo Zend_Json::decode( 1 );
    	
        } catch (Exception $e) {
            echo Zend_Json::decode( 0 );
        }
        die;
    }
    
    /**
     * This action is for ajax call, to get wish info.
     *
     * @author jsingh7
     */   
    public function getWishInfoAction()
    {
    	
    	$wish_obj = \Extended\wishes::getDetailedWishInfo( $this->getRequest()->getParam('wish_id'), Auth_UserAdapter::getIdentity()->getId() );
    	
    	if( $wish_obj )
    	{
	    	echo Zend_Json::encode( $wish_obj );
    	}
    	else
    	{
    		echo Zend_Json::encode( 0 );
    	}
    	die;
    }
    
    /**
     * Action/Function handles ajax call to show more comments
     * on photo.
     * 
     * @version 1.0
     * @author jsingh7
     */
    public function getMoreCommentsForWishAction()
    {
    	$params = $this->getRequest()->getParams();
    	
    	//Getting 10 more comments of for wish/wallpost.
    	$wish_obj = \Extended\wishes::getRowObject( $params["wish_id"] );
    	if( $wish_obj->getWallPost() )
    	{
	    	$wallpost_id = $wish_obj->getWallPost()->getId();
	    	$comments = \Extended\comments::getCommentsForWallpost( \Auth_UserAdapter::getIdentity()->getId(), $wallpost_id, $params["offset"], 10);
	    	
	    	echo Zend_Json::encode($comments);
    	}
    	else
    	{
    		echo Zend_Json::encode(0);
    	}	
    	die;
    }
    
    /**
     * Get the list of photo likes.
     *
     * @author nsingh3
     * @author hakur5
     * @version 1.0
     */
    public function getWhoLikePhotoAction()
    {
//     	$photo_id = $this->getRequest()->getParam( 'photo_id' ) ;
//     	$photo_posted_by_user_id = $this->getRequest()->getParam( 'photo_posted_by_user_id' ) ;
//     	$is_wallpost_exist = \Extended\wall_post::checkWallpostByPhotoNUser($photo_id , $photo_posted_by_user_id);
//     	if($is_wallpost_exist){
//     		echo Zend_Json::encode( \Extended\likes::getUsersForWallpost($is_wallpost_exist ) );
//     	}
//     	else
//     	{
//     		return ;
//     	}
//     	die;
    	$user_info = array();
    	if($this->getRequest()->getParam( 'photo_id' ))
    	{
    		if( \Extended\wall_post::getRowObject( $this->getRequest()->getParam( 'photo_id' ) ))
    		{
    			$ppl_who_liked = \Extended\likes::getUserslikedWallpostOrAlbumOrPhoto(	null, 
																    					null, 
																    					$this->getRequest()->getParam('photo_id'),
    																					$this->getRequest()->getParam('limit'),
    																					$this->getRequest()->getParam('offset'));
    			if($ppl_who_liked)
    			{
    				foreach( $ppl_who_liked['data'] as $key=>$user_who_liked )
    				{
    					$mutual_arr=\Extended\ilook_user::getMutualLinks(\Auth_UserAdapter::getIdentity()->getId(), $user_who_liked->getLikesLiked_by()->getId());
    					$mutualFrdsCount = count($mutual_arr);
    					if(\Auth_UserAdapter::getIdentity()->getId() == $user_who_liked->getLikesLiked_by()->getId()){
    						$user_info[$key]["mutual_count"] =  "Me";
    					}
    					else{
    						$user_info[$key]["mutual_count"] =  $mutualFrdsCount;
    							
    					}
    					$user_info[$key]["user_id"] = $user_who_liked->getLikesLiked_by()->getId();
    					$user_info[$key]["user_image"] = \Helper_common::getUserProfessionalPhoto($user_who_liked->getLikesLiked_by()->getId(), 3);
    					$user_info[$key]["user_full_names"] = $user_who_liked->getLikesLiked_by()->getFirstname()." ".$user_who_liked->getLikesLiked_by()->getLastname();
    					$user_info[$key]["link_info"] = \Extended\link_requests::getFriendRequestState( $user_who_liked->getLikesLiked_by()->getId() );
    				}
    				//For pagination which is not yet implemented.
    				//$user_info['more_records'] = $ppl_who_liked['is_more_records'];
    				echo Zend_Json::encode( $user_info );
    			}
    			else
    			{
    				echo Zend_Json::encode( 0 );
    			}
    		}
    		else
    		{
    			echo Zend_Json::encode( 0 );
    		}
    	}
    	else
    	{
    		echo Zend_Json::encode( 0 );
    	}
    	 
    	 
    	die;
    }
    
    /**
     * Initialing the Blueimp jquery file upload.
     * 
     * @author jsingh7
     * @version 1.0
     */
    public function initailiseJqueryFileUploadAction()
    {
        $user_id = Auth_UserAdapter::getIdentity()->getId();
        $upload_handler = new Jqueryfileuploader_uploadhandler(
            array(
                'script_url' => PROJECT_URL.'/'.PROJECT_NAME.'socialise/initailise-jquery-file-upload',
                'upload_dir' => SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$user_id.'/',
                'upload_url' => PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$user_id.'/',
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
                'inline_file_types' => '/\.(gif|jpe?g|png)$/i',
                // Defines which files (based on their names) are accepted for upload:
        // 						'accept_file_types' => '/.+$/i',
                'accept_file_types' => '/\.(gif|jpe?g|png)$/i',
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
                    'original_photos' => array(
                        // Automatically rotate images based on EXIF meta data:
                        'auto_orient' => true
                    ),
                    'popup_thumbnails' => array(
                        'max_width' => 800,
                        'max_height' => 800
                    ),
                    'wall_thumbnails' => array(
                        'max_width' => 570,
                        'max_height' => 570
                    ),
                    // Uncomment the following to create medium sized images:
                    /*
                     'medium' => array(
                         'max_width' => 800,
                         'max_height' => 600
                     ),
        */
                    'gallery_thumbnails' => array(
                        // Uncomment the following to use a defined directory for the thumbnails
                        // instead of a subdirectory based on the version identifier.
                        // Make sure that this directory doesn't allow execution of files if you
                        // don't pose any restrictions on the type of uploaded files, e.g. by
                        // copying the .htaccess file from the files directory for Apache:
                        //'upload_dir' => dirname($this->get_server_var('SCRIPT_FILENAME')).'/thumb/',
                        //'upload_url' => $this->get_full_url().'/thumb/',
                        // Uncomment the following to force the max
                        // dimensions and e.g. create square thumbnails:
                        'crop' => true,
                        'max_width' => 176,
                        'max_height' => 176
                    ),
                    'thumbnail' => array(
                        'crop' => true,
                        'max_width' => 80,
                        'max_height' => 80
                    )
                ),
                'print_response' => true
            )
        );
        die;
    }
    
    /**
     * Removing the temporary folders and data for
     * socialise wall photo upload.
     * location: public/images/albums/temp_storage_for_socialize_wall_photos_post
     *
     * @author jsingh7
     * @version 1.0
     */
    public function removeTempFolderNDataAction()
    {
        $user_id = Auth_UserAdapter::getIdentity()->getId();
        Helper_common::deleteDir(SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$user_id.'/');
    }
    
    /**
     * 
     * @author jsingh7
     * @version 1.0
     */
    public function postPhotosAction()
    {
    	
    	$zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
    	$photo_text_filtered = $zend_filter_obj->filter( $this->getRequest()->getParam("photos_text") );
        $logged_in_user_id = Auth_UserAdapter::getIdentity()->getId();
        
        //getting paths to user default album directory to store images.
        $userDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id;
        $userAlbumDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id.'\\album_default';
        $galleryDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id.'\\album_default\\gallery_thumbnails';
        $wallDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id.'\\album_default\\wall_thumbnails';
        $popupDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id.'\\album_default\\popup_thumbnails';
        $originalDirecory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id.'\\album_default\\original_photos';
        
        //Checking count. It should not be more than 10.
        if ( Helper_common::countDirectoryFiles( SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$logged_in_user_id.'/original_photos/' ) <= 10 )
        {
	        // Creating directories
	        if ( !file_exists( $userDirectory ) )
	        {
	            mkdir( $userDirectory, 0777, true );
	            mkdir( $userAlbumDirectory, 0777, true );
	            mkdir( $originalDirecory, 0777, true );
	            mkdir( $popupDirectory, 0777, true );
	            mkdir( $wallDirectory, 0777, true );
	            mkdir( $galleryDirectory, 0777, true );
	        }
	        
	        //
	        else
	        {
	            //This case will occur when user directory exists but album dir does not.
	            if ( !file_exists( $userAlbumDirectory ) )
	            {
	                mkdir( $userAlbumDirectory, 0777, true );
	                mkdir( $originalDirecory, 0777, true );
	                mkdir( $wallDirectory, 0777, true );
	                mkdir( $popupDirectory, 0777, true );
	                mkdir( $galleryDirectory, 0777, true );
	            }
	        }
        
	        //Copy files to directories.
	        $image_files = self::dirToArray(SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$logged_in_user_id);
	     
	        foreach ( $image_files['original_photos'] as $original_photo )
	        {
	            @rename( SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$logged_in_user_id.'/original_photos/'.$original_photo, 
	                    $originalDirecory.'\\'.$original_photo );
	        }
	        foreach ( $image_files['popup_thumbnails'] as $popup_thumbnail )
	        {
	            @rename( SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$logged_in_user_id.'/popup_thumbnails/'.$popup_thumbnail, 
	                    $popupDirectory.'\\thumbnail_'.$popup_thumbnail );
	        }
	        foreach ( $image_files['wall_thumbnails'] as $wall_thumbnail )
	        {
	            @rename( SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$logged_in_user_id.'/wall_thumbnails/'.$wall_thumbnail, 
	                    $wallDirectory.'\\thumbnail_'.$wall_thumbnail );
	        }
	        foreach ( $image_files['gallery_thumbnails'] as $gallery_thumbnail )
	        {
	            @rename( SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$logged_in_user_id.'/gallery_thumbnails/'.$gallery_thumbnail, 
	                    $galleryDirectory.'\\thumbnail_'.$gallery_thumbnail );
	        }
        
	        @Helper_common::deleteDir(SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$logged_in_user_id);
	        
	        //Create photo group for these photos.
	        $photo_group_id = \Extended\photo_group::addPhotoGroup( Auth_UserAdapter::getIdentity()->getId() );
	        
	        
	        //Making entry to DB.
			$default_album_id = \Extended\socialise_album::isThisTypeOfAlbumExists( Auth_UserAdapter::getIdentity()->getId(), \Extended\socialise_album::DEFAULT_ALBUM_NAME );

			//Getting the id of default album.
			if( !$default_album_id )
	        {
	            $album_data = \Extended\socialise_album::addAlbum( 
	                                                        Auth_UserAdapter::getIdentity()->getId(), 
	                                                        \Extended\socialise_album::DEFAULT_ALBUM_NAME, 
	                                                        \Extended\socialise_album::VISIBILITY_CRITERIA_PUBLIC, 
	                                                        1, 
	                                                        \Extended\socialise_album::DEFAULT_ALBUM_NAME );
	            $album_id = $album_data['id'];
	        }
	        else
	        {
	            $album_id = $default_album_id;
	        }

        
	        //Adding entry to wallpost table.
	        $wall_post_id = \Extended\wall_post::post_photo(
	                                                $photo_text_filtered,
	                                                $this->getRequest()->getParam("privacy"),
	                                                Auth_UserAdapter::getIdentity()->getId(),
	                                                Auth_UserAdapter::getIdentity()->getId(),
	                                                Auth_UserAdapter::getIdentity()->getId(),
	                                                \Extended\wall_post::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM,
	                                                \Extended\wall_post::POST_TYPE_MANUAL,
	                                                \Extended\wall_post::WALL_TYPE_SOCIALISE,
	                                                $photo_group_id,
	                                                $album_id );
	        
	        //Adding records to socialise_photo table for every image.
	        if( $album_id )
	        {
	        
	        	//Creating an array with index as photo_name and value as photo_desc. FOR ADD PHOTOS.
	        	$photo_desc_name_arr = array();
	        	foreach($this->getRequest()->getParam('photo_name_desc_arr') as $name_desc_arr)
	        	{
	        		foreach($name_desc_arr as $name=>$desc)
	        		{
	        			$photo_desc_name_arr[$name]= $desc;
	        		}
	        	}
	        	//------------------------------------------------------------------
	             $photo_info = \Extended\socialise_photo::addPhotos(
	                                                        $album_id, 
	                                                        Auth_UserAdapter::getIdentity()->getId(), 
	                                                        $image_files['original_photos'], 
	                                                        $this->getRequest()->getParam("privacy"), 
	                                                        '',
	                                                        $photo_group_id,
	             											null,
	             											$photo_desc_name_arr
	                                                        );
	             
	             if( $photo_info )
	             {
	                 $return_r['wall_post_id'] = $wall_post_id;
	                 $return_r['wallpost_text'] = $photo_text_filtered;
	                 $return_r['album_id'] = $album_id;
	                 $return_r['user_id'] = Auth_UserAdapter::getIdentity()->getId();
	                 $return_r['user_type'] = Auth_UserAdapter::getIdentity()->getUser_type();
	                 $return_r['user_gender'] = Auth_UserAdapter::getIdentity()->getGender();
	                 $return_r['user_name'] = Auth_UserAdapter::getIdentity()->getFirstname()." ".Auth_UserAdapter::getIdentity()->getLastname();
	                 $return_r['user_image'] = Helper_common::getUserProfessionalPhoto( Auth_UserAdapter::getIdentity()->getId(), 3 );
	                 
	                 $iii = 0;
	                 foreach ( $photo_info as $key=>$photo_name )
	                 {
	                    $return_r['collage'][$iii]['image_path'] = IMAGE_PATH."/albums/user_".Auth_UserAdapter::getIdentity()->getId()."/album_default/wall_thumbnails/thumbnail_".$photo_name;
	                    $return_r['collage'][$iii]['image_id'] = $key;
	                    if( $iii == 4 )
	                    {    
	                        break;
	                    }
	                    $iii++;
	                 }
	                 
	                 $size = getimagesize( $return_r['collage'][0]['image_path'] );
	                 $width = $size[0];
	                 $height = $size[1];
	                 $aspect = $height / $width;
	                 if ($aspect >= 1) 
	                 {
	                     //vertical
	                     $return_r['first_img_portrait_or_landscape'] = 1;
	                 }
	                 else
	                 {
	                     //horizontal
	                     $return_r['first_img_portrait_or_landscape'] = 2;
	                 }
	                 
	                 $return_r['collage_description'] = $photo_text_filtered;
	                 $current_datetime_obj = new \DateTime();
	                 $return_r['collage_created_at'] = \Helper_common::nicetime( $current_datetime_obj->format("Y-m-d H:i") );
	                 $return_r['is_ok_comment_share_pannel_visible'] = \Helper_common::is_ok_comment_share_pannel_visible(  $this->getRequest()->getParam("privacy"), Auth_UserAdapter::getIdentity()->getId(), array(Auth_UserAdapter::getIdentity()->getId()), Auth_UserAdapter::getIdentity()->getId() );
	                 $return_r['privacy'] = $this->getRequest()->getParam("privacy");
	                 $return_r['post_update_type'] = \Extended\wall_post::POST_UPDATE_TYPE_GROUP_IN_DEFAULT_ALBUM;
	                 $return_r['is_success'] = 1;
	                 $return_r['msg'] = "Photo uploaded successfully.";
	                 
	                 echo Zend_Json::encode( $return_r );
	                 die;
	            }
	            else
	            {
	                 $return_r['is_success'] = 0;
	                 $return_r['msg'] = "Oops! An error occured while posting your photos. Please try again.";
	                 echo Zend_Json::encode( $return_r );
	                 die;
	            } 
	       }
	       else
	       {
	           $return_r['is_success'] = 0;
	           $return_r['msg'] = "Oops! An error occured while posting your photos. Please try again.";
	           echo Zend_Json::encode( $return_r );
	           die;
	       }
    	}
    	else
    	{
    		$return_r['is_success'] = 0;
    		$return_r['msg'] = "Oops! You can post maximum 10 photos only.";
    		echo Zend_Json::encode( $return_r );
    		die;
    	}	
    }
    
    /**
     * 
     * @author jsingh7
     */
    public function postAlbumAction()
    {
        $logged_in_user_id = Auth_UserAdapter::getIdentity()->getId();
        
    	//Checking count. It should not be more than 10.
    	if ( Helper_common::countDirectoryFiles( SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$logged_in_user_id.'/original_photos/' ) <= 10 )
    	{
        
	        $zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
	        
	        $new_album_name = $this->getRequest()->getParam('album_title');
	        $wallpost_text = $zend_filter_obj->filter($this->getRequest()->getParam('photos_text'));
	        $privacy = $this->getRequest()->getParam('privacy');
	        
	     
	        //Adding album data to database.
	        $album_data = \Extended\socialise_album::addAlbum(
	                                            $logged_in_user_id,
	                                            $new_album_name,
	                                            $privacy,
	                                            1,
	                                            $new_album_name );
	        
	        $album_timestamp = $album_data['directoryTime']->getTimestamp();
	        
	        //getting paths to user default album directory to store images.
	        $userDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id;
	        $userAlbumDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id.'\\album_'.$album_data['album_dir_name'].'_'.$album_timestamp;
	        $galleryDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id.'\\album_'.$album_data['album_dir_name'].'_'.$album_timestamp.'\\gallery_thumbnails';
	        $wallDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id.'\\album_'.$album_data['album_dir_name'].'_'.$album_timestamp.'\\wall_thumbnails';
	        $popupDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id.'\\album_'.$album_data['album_dir_name'].'_'.$album_timestamp.'\\popup_thumbnails';
	        $originalDirecory = REL_IMAGE_PATH.'\\albums\\user_'.$logged_in_user_id.'\\album_'.$album_data['album_dir_name'].'_'.$album_timestamp.'\\original_photos';
	        
	        // Creating directories.
	        if ( !file_exists( $userDirectory ) )
	        {
	            mkdir( $userDirectory, 0777, true );
	            mkdir( $userAlbumDirectory, 0777, true );
	            mkdir( $originalDirecory, 0777, true );
	            mkdir( $popupDirectory, 0777, true );
	            mkdir( $wallDirectory, 0777, true );
	            mkdir( $galleryDirectory, 0777, true );
	        }
	        //
	        else
	        {
	            //This case will occur when user directory exists but album dir does not.
	            if ( !file_exists( $userAlbumDirectory ) )
	            {
	                mkdir( $userAlbumDirectory, 0777, true );
	                mkdir( $originalDirecory, 0777, true );
	                mkdir( $wallDirectory, 0777, true );
	                mkdir( $popupDirectory, 0777, true );
	                mkdir( $galleryDirectory, 0777, true );
	            }
	        }
	        
	        //Copy files to directories.
	        $image_files = self::dirToArray(SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$logged_in_user_id);
	        foreach ( $image_files['original_photos'] as $original_photo )
	        {
	            @rename( SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$logged_in_user_id.'/original_photos/'.$original_photo,
	                $originalDirecory.'\\'.$original_photo );
	        }
	        foreach ( $image_files['popup_thumbnails'] as $popup_thumbnail )
	        {
	            @rename( SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$logged_in_user_id.'/popup_thumbnails/'.$popup_thumbnail,
	                $popupDirectory.'\\thumbnail_'.$popup_thumbnail );
	        }
	        foreach ( $image_files['wall_thumbnails'] as $wall_thumbnail )
	        {
	            @rename( SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$logged_in_user_id.'/wall_thumbnails/'.$wall_thumbnail,
	                $wallDirectory.'\\thumbnail_'.$wall_thumbnail );
	        }
	        foreach ( $image_files['gallery_thumbnails'] as $gallery_thumbnail )
	        {
	            @rename( SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$logged_in_user_id.'/gallery_thumbnails/'.$gallery_thumbnail,
	                $galleryDirectory.'\\thumbnail_'.$gallery_thumbnail );
	        }
	        
	        @Helper_common::deleteDir(SERVER_PUBLIC_PATH.'/images/albums/temp_storage_for_socialize_wall_photos_post/user_'.$logged_in_user_id);
	        
	        if( $album_data )
	        {
	        	
	        		//Creating an array with index as photo_name and value as photo_desc. FOR ADD PHOTOS.
	        		$photo_desc_name_arr = array();
	        		foreach($this->getRequest()->getParam('photo_name_desc_arr') as $name_desc_arr)
	        		{
	        			foreach($name_desc_arr as $name=>$desc)
	        			{
	        				$photo_desc_name_arr[$name]= $desc;
	        			}
	        		}
	        		//------------------------------------------------------------------
	        		
	            $photo_info = \Extended\socialise_photo::addPhotos(
	                                        $album_data['id'],
	                                        $logged_in_user_id,
	                                        $image_files['original_photos'],
	                                        $privacy,
	                                        '',
	            							null,
	            							null,
	            							$photo_desc_name_arr
	                                    );
	           
	            
	            $wall_post_id = \Extended\wall_post::post_photo(                         
	                            $wallpost_text,
	                            $privacy,
	                            $logged_in_user_id,
	                            $logged_in_user_id,
	                            $logged_in_user_id,
	                            \Extended\wall_post::POST_UPDATE_TYPE_ALBUM,
	                            \Extended\wall_post::POST_TYPE_MANUAL,
	                            \Extended\wall_post::WALL_TYPE_SOCIALISE,
	                            NULL,
	                            $album_data['id'] );
	            
	            $return_r['album_id'] = $album_data['id'];
	            $return_r['wall_post_id'] = $wall_post_id;
	            $return_r['album_name'] = $album_data['name'];
	            $return_r['user_id'] = $logged_in_user_id;
	            $return_r['user_type'] = Auth_UserAdapter::getIdentity()->getUser_type();
	            $return_r['user_gender'] = Auth_UserAdapter::getIdentity()->getGender();
	            $return_r['user_name'] = Auth_UserAdapter::getIdentity()->getFirstname()." ".Auth_UserAdapter::getIdentity()->getLastname();
	            $return_r['user_image'] = Helper_common::getUserProfessionalPhoto( $logged_in_user_id, 3 );
	      
	             
	            $iii = 0;
	            foreach ( $photo_info as $key=>$photo_name )
	            {
	                $return_r['collage'][$iii]['image_path'] = IMAGE_PATH."/albums/user_".$logged_in_user_id."/album_".$album_data['album_dir_name']."_".$album_timestamp."/wall_thumbnails/thumbnail_".$photo_name;
	                $return_r['collage'][$iii]['image_id'] = $key;
	                if( $iii == 4 )
	                {
	                    break;
	                }
	                $iii++;
	            }
	            
	            
	            $size = getimagesize( $return_r['collage'][0]['image_path'] );
	            $width = $size[0];
	            $height = $size[1];
	            $aspect = $height / $width;
	            if ($aspect >= 1)
	            {
	                //vertical
	                $return_r['first_img_portrait_or_landscape'] = 1;
	            }
	            else
	            {
	                //horizontal
	                $return_r['first_img_portrait_or_landscape'] = 2;
	            }
	             
	            $return_r['collage_description'] = $wallpost_text;
	            $current_datetime_obj = new \DateTime();
	            $return_r['collage_created_at'] = \Helper_common::nicetime( $current_datetime_obj->format("Y-m-d H:i") );
	            $return_r['is_ok_comment_share_pannel_visible'] = \Helper_common::is_ok_comment_share_pannel_visible(  $privacy, $logged_in_user_id, array($logged_in_user_id), $logged_in_user_id );
	            $return_r['privacy'] = $privacy;
	            $return_r['post_update_type'] = \Extended\wall_post::POST_UPDATE_TYPE_ALBUM;
	            $return_r['is_success'] = 1;
	            $return_r['msg'] = "Photo uploaded successfully.";
	            echo Zend_Json::encode( $return_r );
	            die;
	            
	        }
	        else
	        {
	            $return_r['is_success'] = 0;
	            $return_r['msg'] = "Oops! An error occured while posting your album. Please try again.";
	            echo Zend_Json::encode( $return_r );
	            die;
	        }
    	}
    	else
    	{
    		$return_r['is_success'] = 0;
    		$return_r['msg'] = "Oops! You can post maximum 10 photos only.";
    		echo Zend_Json::encode( $return_r );
    		die;
    	}	
    }
    
    /**
     * 
     * @param unknown_type $dir
     * @return multitype:NULL unknown
     */
    public static function dirToArray($dir)
    {
    
        $result = array();
    
        $cdir = scandir($dir);
        foreach ($cdir as $key => $value)
        {
            if (!in_array($value,array(".","..")))
            {
                if (is_dir($dir . DIRECTORY_SEPARATOR . $value))
                {
                    $result[$value] = self::dirToArray($dir . DIRECTORY_SEPARATOR . $value);
                   
                }
                else
                {
                    $result[] = $value;
                }
            }
        }
        return $result;
    }
    
    
    /**
     *  Function for OK photo on photo detail page.
     *
     *  @author sjaiswal
     *  @version 1.0
     */
    public function okThePhotoAction()
    {
    	$params=$this->getRequest()->getParams();
    	$ret_array = array();
    	
    	// this condition is use for check the photo id if photo id is available then proceed else return false
    	if($params['photo_id'])
    	{
    		$user_id = Auth_UserAdapter::getIdentity()->getId();
    		$photo_obj = \Extended\socialise_photo::getRowObject($params['photo_id']);
    
            if($photo_obj)
			{
				//Making a entry to like table for photo.
				$result_photo = \Extended\likes::setOrUnsetOK( Auth_UserAdapter::getIdentity()->getId(), 0, null, $params['photo_id']);
    
				/* 	If there is single photo inside the group
					in default album, then also OK its 
					associated wallpost.
				*/
				if( $photo_obj->getPhotoGroup() )
				{
					if( $photo_obj->getPhotoGroup()->getSocialisePhoto()->count() == 1 )
					{
						\Extended\likes::setOrUnsetOK( Auth_UserAdapter::getIdentity()->getId(), 0, $photo_obj->getPhotoGroup()->getWallPost()->getId() );
						$ret_array['wallpost_id'] = $photo_obj->getPhotoGroup()->getWallPost()->getId();
					}
				}	
				
				
				//Adding OK for wallpost in likes table (for special case only).
				if( $photo_obj->getWallPost() )
				{
					if( $photo_obj->getWallPost()->getPost_update_type() == \Extended\wall_post::POST_UPDATE_TYPE_PROFILE_PHOTO_CHANGED )
					{
						\Extended\likes::setOrUnsetOK( Auth_UserAdapter::getIdentity()->getId(), 0, $photo_obj->getWallPost()->getId() );
						$ret_array['wallpost_id'] = $photo_obj->getWallPost()->getId();
					}
				}
    				
				// get ok likers string..
				$likers = array();
				foreach( $photo_obj->getSocialise_photosLike() as $key=>$like )
				{
					$likers[$key] = $like->getLikesLiked_by()->getId();
				}
				$ok_string = \Helper_common::getLikersString ( $likers, \Auth_UserAdapter::getIdentity()->getId() );
    				
				$ret_array['status'] = 1;
				$ret_array['ok_string'] = $ok_string;
				$ret_array['photo_id'] = $params['photo_id'];
    			
				echo Zend_Json::encode($ret_array);
			}
    	}
    	else
    	{
    		echo Zend_Json::encode(0);
    	}
    	die;
    }
    
      /**
     *  function for not ok  photo on photo detail page
     *
     *  @author sjaiswal
     *  @version 1.0
     */
    public function notOkThePhotoAction()
    {
    	$params=$this->getRequest()->getParams(); 
		$ret_arr = array();
    	// this condition is use for check the photo id if photo id is available then procede else return false
    	if($params['photo_id'])
    	{
			$photo_obj = \Extended\socialise_photo::getRowObject($params['photo_id']);
    		$user_id = Auth_UserAdapter::getIdentity()->getId();
    		
			// Making/removing a entry to like table for photo.
			$result_photo = \Extended\likes::setOrUnsetOK( Auth_UserAdapter::getIdentity()->getId(), 1, null, $params['photo_id']);
    
			/* 	If there is single photo inside the group
			 in default album, then also NOT/OK its
			 associated wallpost.
			*/
			if( $photo_obj->getPhotoGroup() )
			{
				if( $photo_obj->getPhotoGroup()->getSocialisePhoto()->count() == 1 )
				{
					\Extended\likes::setOrUnsetOK( Auth_UserAdapter::getIdentity()->getId(), 1, $photo_obj->getPhotoGroup()->getWallPost()->getId() );
					$ret_arr['wallpost_id'] = $photo_obj->getPhotoGroup()->getWallPost()->getId();
				}
			}
			
			//Removing OK for wallpost in likes table (for special case only).
			if( $photo_obj->getWallPost() )
			{
				if( $photo_obj->getWallPost()->getPost_update_type() == \Extended\wall_post::POST_UPDATE_TYPE_PROFILE_PHOTO_CHANGED )
				{
					\Extended\likes::setOrUnsetOK( Auth_UserAdapter::getIdentity()->getId(), 1, $photo_obj->getWallPost()->getId() );
					$ret_arr['wallpost_id'] = $photo_obj->getWallPost()->getId();
				}
			}
			
			$likers = array();
			foreach( $photo_obj->getSocialise_photosLike() as $key=>$like )
			{
				$likers[$key] = $like->getLikesLiked_by()->getId();
			}
			$ok_string = \Helper_common::getLikersString ( $likers, \Auth_UserAdapter::getIdentity()->getId() );
    
			$ret_arr['ok_string'] = $ok_string;
			$ret_arr['photo_id'] = $params['photo_id'];
			$ret_arr['status'] = 1;
			echo Zend_Json::encode($ret_arr);
    	}
    	else
    	{
    		echo Zend_Json::encode(array('status'=>0));
    	}
    	die;
    }

    /**
     * Add comment for photo on photo detail page 
     * Also increment comment count
     *
     * @author sjaiswal
     * @version 1.0
     */
    public function addCommentToThePhotoAction()
    {
    	$param = $this->getRequest()->getParams();
    
    	$ret_r = array();
    	
    	$photo_id = $param['photo_id'] ;
    	$photo_posted_by_user_id = $param['album_posted_by'];
    	$comment = $param['comment'] ;
    
    	//Making a entry to like table for wallpost.
    	$filterObj = Zend_Registry::get('Zend_Filter_StripTags');
    	$comm_text = nl2br($filterObj->filter($this->getRequest()->getParam( 'comment' ) ));
    	$comment_on_photo_id = \Extended\comments::addComment( $comm_text, Auth_UserAdapter::getIdentity()->getId(), NULL, NULL, $photo_id );
    	$comments_obj = \Extended\comments::getRowObject( $comment_on_photo_id );
   
    	//setting comment count for photo
    	\Extended\socialise_photo::commentCountIncreament( $photo_id );
    			
    	// get socialise photo object 
    	$socialisephoto_obj = \Extended\socialise_photo::getRowObject( $photo_id );
    	
    	
    	//Adding comment for wallpost in comments table( for special case only. )
    	if( $socialisephoto_obj->getWallPost() )
    	{
    		if( $socialisephoto_obj->getWallPost()->getPost_update_type() == \Extended\wall_post::POST_UPDATE_TYPE_PROFILE_PHOTO_CHANGED )
    		{
    			$wallpost_comment_id = \Extended\comments::addComment( $comm_text, Auth_UserAdapter::getIdentity()->getId(), null, $socialisephoto_obj->getWallPost()->getId() );
    			//Adding same comment id in photo comment record.
    			$photo_comment_obj = \Extended\comments::getRowObject($comment_on_photo_id);
    			$photo_comment_obj->setSame_comment_id($wallpost_comment_id);
    			$em = Zend_Registry::get('em');
    			$em->persist( $photo_comment_obj );
    			$em->flush();
    			
    			$ret_r['wallpost_id'] = $socialisephoto_obj->getWallPost()->getId();
    			$ret_r['wallpost_comment_id'] = $wallpost_comment_id;
    		}
    	}
    	
    	/* 	If there is single photo inside the group
    	 in default album, then also add comment for its
    	associated wallpost.
    	*/
    	if( $socialisephoto_obj->getPhotoGroup() )
    	{
    		if( $socialisephoto_obj->getPhotoGroup()->getSocialisePhoto()->count() == 1 )
    		{
    			$wallpost_comment_id = \Extended\comments::addComment( $comm_text, Auth_UserAdapter::getIdentity()->getId(), null, $socialisephoto_obj->getPhotoGroup()->getWallPost()->getId() );
    			//Adding same comment id in photo comment record.
    			$photo_comment_obj = \Extended\comments::getRowObject($comment_on_photo_id);
    			$photo_comment_obj->setSame_comment_id($wallpost_comment_id);
    			$em = Zend_Registry::get('em');
    			$em->persist( $photo_comment_obj );
    			$em->flush();
    			$ret_r['wallpost_id'] = $socialisephoto_obj->getPhotoGroup()->getWallPost()->getId();
    			$ret_r['wallpost_comment_id'] = $wallpost_comment_id;
    		}
    	}
    	
    			
    	$ret_r['comment_id'] = $comment_on_photo_id;
    	$ret_r['comm_text'] = $comm_text;
    	$ret_r['commenter_id'] = Auth_UserAdapter::getIdentity()->getId();
    	$ret_r['commenter_fname'] = Auth_UserAdapter::getIdentity()->getFirstname();
    	$ret_r['commenter_lname'] = Auth_UserAdapter::getIdentity()->getLastname();
    	$ret_r['commenter_small_image'] = Helper_common::getUserProfessionalPhoto(Auth_UserAdapter::getIdentity()->getId(), 3);
    	$ret_r['comment_count'] = $socialisephoto_obj->getSocialise_photosComment()->count();
    	$ret_r['created_at'] = Helper_common::nicetime( $comments_obj->getCreated_at()->format( "Y-m-d H:i:s" ));
    	
    	
    	//gathering information for sending email to user on whom post, comment is done.
    	$subject = "iLook - User commented on your photo";
    	$msg='';
    	$msg = "<p style='margin:20px 20px 0 0; padding:0; font-size:14px; font-family:Arial, Helvetica, sans-serif; color:#3a3a3a'>
    	".ucfirst($ret_r['commenter_fname'])." ".ucfirst($ret_r['commenter_lname'])." commented on your photo</p>
    	<p style='margin:20px 20px 0 0; padding:0; font-size:14px; font-family:Arial, Helvetica, sans-serif; color:#3a3a3a'>
    	<b>'".$ret_r['comm_text']."'</b>
    	</p>";
    	$recipient_name = ucfirst($socialisephoto_obj->getSocialise_photosPosted_by()->getFirstname())." ".ucfirst($socialisephoto_obj->getSocialise_photosPosted_by()->getLastname());
    	$recipient_email = $socialisephoto_obj->getSocialise_photosPosted_by()->getEmail();
    		
    	// check if user is not commenting on his own post, only then mail will be sent
    	if(Auth_UserAdapter::getIdentity()->getId() != $socialisephoto_obj->getSocialise_photosPosted_by()->getId())
    	{
    		//sending email to user on whom post comment is done
    		\Email_Mailer::sendMail(
                    $subject,
    				$msg,
    				$recipient_name,
    				$recipient_email,
    				array(),
    				"iLook Team",
    				Auth_UserAdapter::getIdentity()->getEmail(),
    				"Hello ",
    				"Thank you");
    	}
    	
    	echo Zend_Json::encode($ret_r);
    		
    	die;
    }
    
    
    /**
     * Fetch photo info for ajax call
     *
     * @author jsingh7
     *
     */
    public function getPhotoInfoAction()
    {
    	$params = $this->getRequest()->getParams();
    	//Zend_Debug::dump($params); die();
    
    	$result = \Extended\socialise_photo::getPhotoInfo( $params['photo_id'] );
    	 
    	if( $result ):
    	echo Zend_Json::encode( $result );
    	else:
    	//Wallpost doesnot exist anymore.
    	echo Zend_Json::encode( 2 );
    	endif;
    	die;
    }
    
    /**
     * This function used to send Report abuse to admin
     * @author spatial
     * @author sjaiswal
     * @since 5 Aug, 2013
     * @version 1.1
     *
     *
     */
    public function abuseReportAction()
    {
    	$params=$this->getRequest()->getParams();
    	$current_user_id = Auth_UserAdapter::getIdentity()->getId();
    	$wallpost_owner_info = \Extended\ilook_user::getRowObject($params["wallpost_owner_id"]);
    	$wallpost_owner_fullname = $wallpost_owner_info->getFirstname()." ".$wallpost_owner_info->getLastname();
    	\Extended\report_abuse::addAbuseReport($current_user_id,$params["post_id"],$params["wallpost_owner_id"]);
    	$wallInfo=Extended\wall_post::getRowObject($params["post_id"]);
    	
 
    	$userName = Auth_UserAdapter::getIdentity()->getFirstname()." ".Auth_UserAdapter::getIdentity()->getLastname();
    	$msg='';
    	$msg = "<p style='padding:0; font-size:14px; font-family:Arial, Helvetica, sans-serif; color:#3a3a3a'>
    				A wall post has been reported abuse.
    			</p>
	    		<p style='padding:0; font-size:14px; font-family:Arial, Helvetica, sans-serif; color:#3a3a3a'>
	    			".$wallpost_owner_fullname."'s wall post has been reported abuse by ".$userName."
	    		</p>";
    			
    	$subject="iLook - A wall post has been reported abuse";
    	$result=Email_Mailer::sendMail ( $subject, $msg, "Admin", 'reportabuse@ilook.net', array(), "iLook Team","","Hello ","Best Regards");
    	if($result){
    		$msg=array("msg"=>"success");
    	}
    	echo Zend_Json::encode($msg); 
    	die;
    }
    
    
}