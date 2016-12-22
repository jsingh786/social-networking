<?php

class BookmarksController extends Zend_Controller_Action
{
    /**
     * This function checks auth storage and
     * manage redirecting.
     * 
     * @author Shaina
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

    public function init(){
        /* Initialize action controller here */
  
    }

    /**
     * This function display list of bookmarked profiles.
     * @author Shaina Gandhi, Sunny Patial
     * @since 7 Aug, 2013
     * @version 1.0
     * 
     *
     */
    public function indexAction()
    {
    	$params = $this->getRequest()->getParams();
    	if( ! @$params['list_len'] )
    	{
    		$params['list_len'] = 20;
    	}
    	$this->view->prms = $params;
        $userID = Auth_UserAdapter::getIdentity()->getId();
        $bookmarked = \Extended\bookmark_profile::getBookmarkedProfileList($userID);
    	
    	if(@$params['bookmarkSearch'])
    	{
    		if(!preg_match('/[\'^�$%&*()}{@#~?><>,|=_+�-]/', $params['bookmarkSearch']))
    		{
	    		$this->view->bookmarkSearchText=$params['bookmarkSearch'];
	    		$userLinks = $bookmarked;
	    		if(count($userLinks)>0)
	    		{
	    			
	    			$bookmarkId=array();
	    			for($i=0;$i<count($userLinks);$i++)
	    			{ 
	    				
	    				$bookmarkId[]=$userLinks[$i]->getBookmark_profilesUser()->getId();
	    			}
	    			$query_str = "";
	    			$query_str .= 'first_name:'.$params['bookmarkSearch'].'*';
	    			$query_str .= ' OR last_name:'.$params['bookmarkSearch'].'*';
	    			$links = \Extended\ilook_user::getUsersForLuceneQuery( $query_str );
	    			$linkid=array();
	    			for($i=0;$i<count($links);$i++){
	    				
	    				$linkid[]=$links[$i]->getId();
	    			}
	    			$arr_intersection=array_intersect ($linkid,$bookmarkId);
	    			$result=implode(",",$arr_intersection);
	    			if($result!="")
	    			{
	    				$bookmarked = \Extended\bookmark_profile::getSearchBookmarkProfileList($result);
	    			}
	    			else
	    			{
	    				$bookmarked = array();
	    			}
	    		}
	    		else
	    		{
	    			$bookmarked = array();
	    		}
    		}
    		else
    		{
    			$messages = new \Zend_Session_Namespace ( 'messages' );
    			$messages->warningMsg = "No valid keywords for search!";
    			$bookmarked = array();
    		}
    	}
    	
    	
    	$this->view->usr_groups = \Extended\user_bookmark_groups::getEditGroups($userID);
    	$this->view->assign_groups = \Extended\user_bookmark_groups::getCountAssignGroups($userID);
    	$blocked_profiles = \Extended\blocked_users::getAllBlockersAndBlockedUsers($userID);
    	
    	$bm_ids = array();
    	foreach($bookmarked as $bm)
    	{
    		$bm_ids[] = $bm->getBookmark_profilesUser()->getId();
    	}
    
    	//Filter blocked profiles from bookmarked profiles( ids).
    	if($blocked_profiles)
    	{
    		$filtered_bookmarked_profiles = array_diff( $bm_ids, $blocked_profiles );
    	}
    	else
    	{
    		$filtered_bookmarked_profiles = $bm_ids;
    	}
		$this->view->bookmarked= $filtered_bookmarked_profiles;
    	//------ PAGINATION -------
    	$paginator = Zend_Paginator::factory($filtered_bookmarked_profiles);
    	$paginator->setItemCountPerPage(@$params['list_len']);
    	$paginator->setCurrentPageNumber(@$params['page']);
    	$this->view->paginator=$paginator;
    }



/**
     * function used for getting all tags added and assigned by the users.
     * Author: Sunny Patial,Shaina
     * Date: 2,Aug 2013
     * version: 1.0
     * return: encoded array
     *
     */
    public function getEditGroupsAction()
    {
    	$params=$this->getRequest()->getParams();
    	$profile_user=$params["user_id"];
    	$current_user = Auth_UserAdapter::getIdentity()->getId();
    	$usr_groups = \Extended\user_bookmark_groups::getEditGroups($current_user);
    	$assignedGropus = \Extended\link_bookmark_groups::getAssignedGroups($current_user, $profile_user);
    	foreach($assignedGropus as $v){
    			if ($usr_groups){
    		for($i=0;$i<count($usr_groups);$i++){
    			if($usr_groups[$i]['group_id']==$v->getLink_groupsUser_groups()->getId()){
    				$usr_groups[$i]['is_checked']=1;
    			}
    		}
    			}
    	}
    	echo Zend_Json::encode($usr_groups);
    	die;
    }

    /**
     * function used for add new tag
     * @author spatial, sgandhi
     * Date: 2,Aug 2013
     * version: 1.0
     *
     */
    public function addNewGroupAction()
    {
    	$params=$this->getRequest()->getParams();
    	$current_user = Auth_UserAdapter::getIdentity()->getId();
    	$group_title = $params["title"];
    	$return_arr = \Extended\user_bookmark_groups::addGroups($current_user,$group_title);
    	echo Zend_Json::encode($return_arr);
    	die;
    }

    /**
     * function used for assign tags to users
     * Author: Sunny Patial
     * Date: 5,Aug 2013
     * version: 1.0
     * 
     *
     */
    public function assignGroupsAction()
    {
    	$params=$this->getRequest()->getParams();
    	
    	$profile_user = $params["user_id"];
    	$current_user = Auth_UserAdapter::getIdentity()->getId();
    	
    	// delete all the assign tags.
    	$result=\Extended\link_bookmark_groups::removeAllGroups($current_user,$profile_user,$params["groups_arr"]);
    	
    	
    	if($result)
    	{
    		for( $i=0; $i<count($params["groups_arr"]); $i++ )
    		{
    			$add_groups=\Extended\link_bookmark_groups::assignGroups( $current_user, $profile_user, $params["groups_arr"][$i]['value'] );
    		}
    		$msg=array("msg"=>"success");
    		echo Zend_Json::encode($msg);
    	}
    	die;
    }
    /**
     * function used to delete the group
     * Author: Sunny Patial
     * Date: 5,Aug 2013
     * version: 1.0
     */
    public function deleteGroupAction()
    {
    	$params=$this->getRequest()->getParams();
    	$link_groups=\Extended\link_bookmark_groups::deleteAssignedGroups($params["id"]);
    	$result=\Extended\user_bookmark_groups::deleteGroup($params["id"]);
    	if($result){
    		echo Zend_Json::encode($result);
    	}
    	else{
    		$result=array("msg"=>"fail");
    		echo Zend_Json::encode($result);
    	}
    	die;
    }
    /**
     * function used to update the group title
     * Author: Sunny Patial
     * Date: 5,Aug 2013
     * version: 1.0
     */
    public function updateGroupAction()
    {
		$params=$this->getRequest()->getParams();
		$result=\Extended\user_bookmark_groups::updateGroup($params["grps"]);
		echo Zend_Json::encode($result);
		die;
    }
    /**
     * function used to remove the bookmark status
     * Author: Sunny Patial
     * Date: 5,Aug 2013
     * version: 1.0
     */
    public function removeBookmarkAction()
    {
		$params=$this->getRequest()->getParams();
		$currentUser=Auth_UserAdapter::getIdentity()->getId();
		$bookmark_users=$params["bookmarks"];
		for($i=0;$i<count($bookmark_users);$i++){
			$profile_user=$bookmark_users[$i];
			$result=\Extended\bookmark_profile::removeBookmark($currentUser, $profile_user);
		}
		if($result){
			for($i=0;$i<count($bookmark_users);$i++){
				$profile_user=$bookmark_users[$i];
				$res=\Extended\link_bookmark_groups::removeBookmarkLinks($currentUser, $profile_user);
			}
			if($res){
				$msg=array("msg"=>"success");
			}
			else{
				$msg=array("msg"=>"fail");
			}
    	}
    	else{
    		$msg=array("msg"=>"fail");
    	}
    	echo Zend_Json::encode($msg);
    	die;
    }
    /**
     * function used to send multiple messages to the links
     * Author: Sunny Patial
     * Date: 5,Aug 2013
     * version: 1.0
     */
    public function sendMultipleMsgesAction()
    {
		$em = \Zend_Registry::get('em');
		$params=$this->_request->getParams();
		$senderID = Auth_UserAdapter::getIdentity()->getId();
		$subject="Message from ".Auth_UserAdapter::getIdentity()->getFirstname()." ".Auth_UserAdapter::getIdentity()->getLastname();
		$msg=$params["msg"];
		$profileUser=$params["bookmark_users"];
	
		for($i=0;$i<count($profileUser);$i++){
			$recieverID=$profileUser[$i];
	
			$textmsgID=\Extended\message::addMessage( $subject, $msg, $senderID, $recieverID, \Extended\message::MSG_TYPE_GENERAL );
			if($textmsgID)
			{
				$msguser=\Extended\message_user::addMessageUsers($senderID, $recieverID, $textmsgID);
				if($msguser)
				{
					$recieve_user_folder=\Extended\user_folder::getUserFolder($recieverID, Extended\folder::FOLDER_INBOX);
					if($recieve_user_folder)
					{
						$result=\Extended\message_folder::addMessageStatus($textmsgID, $msguser, $recieve_user_folder);
						if($result)
						{
							$sent_user_folder=\Extended\user_folder::getUserFolder(Auth_UserAdapter::getIdentity()->getId(), Extended\folder::FOLDER_SENT_ITEMS);
							if($sent_user_folder)
							{
								$result=\Extended\message_folder::addMessageStatus($textmsgID, $msguser, $sent_user_folder);
									
							}
						}
	
					}
				}
	
			}
	
	
		}
		if($result){
			$msg=array("msg"=>"success");
		}
		else{
			$msg=array("msg"=>"fail");
		}
		echo Zend_Json::encode($msg);
		die;		
    }

    /**
     * function used for get particular user groups
     * Author: Sunny Patial
     * Date: 20,Aug 2013
     * version: 1.0
     * return: encoded array
     *
     */
    public function getManageGroupsAction()
    {
		$current_user = Auth_UserAdapter::getIdentity()->getId();
		$usr_groups = \Extended\user_bookmark_groups::getEditGroups($current_user);
		echo Zend_Json::encode($usr_groups);
		die;
    }
    /**
     * function used for get particular user groups
     * Author: Sunny Patial
     * Date: 20,Aug 2013
     * version: 1.0
     * return: encoded array
     *
     */
	 public function getCheckedGroupsAction()
    {
		$params=$this->_request->getParams();
    	$current_user = Auth_UserAdapter::getIdentity()->getId();
    	$checkedGroups = \Extended\link_bookmark_groups::getCheckedAssignedGroups($current_user,@$params["user_id"]);
    	$usr_groups = \Extended\user_bookmark_groups::getEditGroups($current_user);
    	foreach($checkedGroups as $ck=>$cv){
    		foreach($usr_groups as $uk=>$uv){
    			if($uv['group_id']==$cv){
    				$usr_groups[$uk]['type']="checked";
    			}
    		}
    	}
		echo Zend_Json::encode($usr_groups);
		die;
    }
    /**
     * function used to remove the bookmark status
     * Author: Sunny Patial
     * Date: 5,Aug 2013
     * version: 1.0
     */
    public function assignMultipleGroupsAction()
    {
		$params=$this->_request->getParams();
		$current_user = Auth_UserAdapter::getIdentity()->getId();
		for($i=0;$i<count($params["user"]);$i++){
			$profile_user = $params["user"][$i];
			$result=\Extended\link_bookmark_groups::removeAllGroups($current_user,$profile_user,$params["groups"]);
			if($result){
				for($j=0;$j<count($params["groups"]);$j++){
					$add_groups=\Extended\link_bookmark_groups::assignGroups($current_user, $profile_user, $params["groups"][$j]['value']);
				}
			} 
		}
    	// delete all the assign tags.
    	$msg=array("msg"=>"success");
    	echo Zend_Json::encode($msg);
    	die;
    }
    /**
     * function used to get groups list Action
     * Author: Sunny Patial
     * Date: 5,Aug 2013
     * version: 1.0
     */
    public function groupAction()
    {
        $params = $this->getRequest()->getParams();
        $this->view->bookmarkGrpID=$params["id"];
        if( ! @$params['list_len'] )
        {
        	$params['list_len'] = 20;
        }
        $this->view->prms = $params;
        $getRowobj = \Extended\user_bookmark_groups ::getRowObject(@$params["id"]);
        
        if($getRowobj)
        {
        	$group_title =  $getRowobj -> getGroup_title();
        	$this->view->group_title = $group_title;
        	$current_user = Auth_UserAdapter::getIdentity()->getId();
        	$groupUsers=\Extended\link_bookmark_groups::getUsersByGroupIDAndGroupOwner($current_user, $params["id"]);
        	
        	
        	
        	if(@$params['bookmarkSearch'])
        	{
        		if(!preg_match('/[\'^�$%&*()}{@#~?><>,|=_+�-]/', $params['bookmarkSearch'])){
        			$this->view->bookmarkSearchText=$params['bookmarkSearch'];
        			$userLinks = $groupUsers;
        			if(count($userLinks)>0)
        			{
        				$linkId=array();
        				for($i=0;$i<count($userLinks);$i++)
        				{
        		    
        					$linkId[]=$userLinks[$i]->getLink_groupsAssignedUser()->getId();
        				}
        				$query_str = "";
        				$query_str .= 'first_name:'.$params['bookmarkSearch'].'*';
        				$query_str .= ' OR last_name:'.$params['bookmarkSearch'].'*';
        				$links = \Extended\ilook_user::getUsersForLuceneQuery( $query_str );
        				$luceneid=array();
        				for($i=0;$i<count($links);$i++)
        				{
        		    
        					$luceneid[]=$links[$i]->getId();
        				}
        				$arr_intersection=array_intersect ($luceneid,$linkId);
        				$result=implode(",",$arr_intersection);
        				if($result!="")
        				{
        					$groupUsers = \Extended\link_bookmark_groups::getSearchGroupUsers($current_user, $params["id"], $result);
        				}
        				else
        				{
        					$groupUsers = array();
        				}
        			}
        			else
        			{
        				$groupUsers = array();
        			}
        		}
        		else
        		{
        			$messages = new \Zend_Session_Namespace ( 'messages' );
        			$messages->warningMsg = "No valid keywords for search!";
        			$groupUsers = array();
        		}
        	}
        	
        	$groupUsers_ids = array();
        	
        	foreach ($groupUsers as $gu )
        	{
        		$groupUsers_ids[] = $gu->getLink_groupsAssignedUser()->getId();
        	}
        	//Filter blocked profiles from bookmarked profiles( ids).
        	$blocked_profiles = \Extended\blocked_users::getAllBlockersAndBlockedUsers($current_user);
        	if($blocked_profiles)
        	{
        		$filtered_bookmarkedGroup_profiles = array_diff( $groupUsers_ids, $blocked_profiles );
        	}
        	else
        	{
        		$filtered_bookmarkedGroup_profiles = $groupUsers_ids;
        	}
        	$this->view->links=$filtered_bookmarkedGroup_profiles;
        	//------ PAGINATION -------
        	$paginator = Zend_Paginator::factory($filtered_bookmarkedGroup_profiles);
        	$paginator->setItemCountPerPage(@$params['list_len']);
        	$paginator->setCurrentPageNumber(@$params['page']);
        	$this->view->paginator=$paginator;
        }
        else
        {
        	$this->_redirect(PROJECT_URL."/".PROJECT_NAME."profile/is-not-available");
        }
    }
    /**
     * function used to delete bookmarked profile by the user
     * Author: Sunny Patial
     * Date: 5,Aug 2013
     * version: 1.0
     */
	function deleteBookmarkedProfileAction(){
		$params=$this->getRequest()->getParams();
		$currentUser=Auth_UserAdapter::getIdentity()->getId();
		$profile_user=$params["user_id"];
		$result=\Extended\bookmark_profile::removeBookmark($currentUser, $profile_user);
		if($result){
			$res=\Extended\link_bookmark_groups::removeBookmarkLinks($currentUser, $profile_user);
			if($res){
				$msg=array("msg"=>"success");
			}
			else{
				$msg=array("msg"=>"fail");
			}
		}
		else{
			$msg=array("msg"=>"fail");
		}
		echo Zend_Json::encode($msg);
		die;
	}
	/**
	 * function used to remove the bookmark status
	 * Author: Sunny Patial
	 * Date: 5,Aug 2013
	 * version: 1.0
	 */
	public function removeBookmarkGroupAction()
	{
		$params=$this->getRequest()->getParams();
		$grpID=$params["grp_id"];
		$currentUser=Auth_UserAdapter::getIdentity()->getId();
		$bookmark_users=$params["bookmarks"];
		for($i=0;$i<count($bookmark_users);$i++){
			$profile_user=$bookmark_users[$i];
			$result=\Extended\link_bookmark_groups::removeBookmarkLinksBYGroup($currentUser, $profile_user, $grpID);
		}
		if($result){
			
			$msg=array("msg"=>"success");
		}
		else{
			$msg=array("msg"=>"fail");
		}
		echo Zend_Json::encode($msg);
		die;
	}
	/**
	 * function used to remove bookmark group assigned by the user
	 * Author: Sunny Patial
	 * Date: 5,Aug 2013
	 * version: 1.0
	 */
	function deleteBookmarkedProfileGroupAction(){
		$params=$this->getRequest()->getParams();
		$grpID=$params["grp_id"];
		$currentUser=Auth_UserAdapter::getIdentity()->getId();
		$profile_user=$params["user_id"];
		$result=\Extended\link_bookmark_groups::removeBookmarkLinksBYGroup($currentUser, $profile_user, $grpID);
		if($result){
				$msg=array("msg"=>"success");		
		}
		else{
			$msg=array("msg"=>"fail");
		}
		echo Zend_Json::encode($msg);
		die;
	}
}

