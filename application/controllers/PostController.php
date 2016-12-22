<?php

class PostController extends Zend_Controller_Action
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
	
		if(Auth_UserAdapter::hasIdentity())
		{
			if($this->getRequest()->getParam('id'))
			{
				
				$after_login_redirection_session = new Zend_Session_Namespace('after_login_redirection_session');
				// value 8 is used for post detail
				$after_login_redirection_session->action = 8;
				$after_login_redirection_session->post_detail_id = $this->getRequest()->getParam('id');	
				
			}
		}
		else if( !Auth_UserAdapter::hasIdentity() )
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
    }

    /**
     * Returns wall posts details for user.
     *
     *@author sjaiswal
     *@version 1.0
     */
    public function detailAction()
    {
        // action body
    	//get params from url
    	$params=$this->getRequest()->getParams(); 
    	
    	$id = Auth_UserAdapter::getIdentity()->getId();
    	
    	
    	if( $params['id'] )// wall post id 
    	{
	    	if( ! \Extended\wall_post::getRowObject( $params['id'] ) )
	    	{
	    		$this->_forward('is-not-available', 'error', 'default', array('message' => 'The post has been removed.'));
	    	}
    	else
    	{		
	        // set value for post data 
	        $this->view->post_data = \Extended\wall_post::getDetailedWallpostInfo($params['id'], $id);
	        $this->view->current_user_id  = Auth_UserAdapter::getIdentity ()->getId ();
	        
	        //Start of people you may know section
	        
	        // Start of People you may know for school section
	        $edu_dtls = Auth_UserAdapter::getIdentity ()->getUsersEducation();
	        
	        
	        $myEduSchoolIds = array ();
	        $users_with_same_school = array();
	        $requests_id = array ();
	        if( $edu_dtls->toArray() )
	        {	
	        	foreach ( $edu_dtls as $ed )
	        	{
	        		
	        		$myEduSchoolIds [] = $ed->getEducation_detailsSchool ()->getId ();
	        	}
	        	$links = explode ( ",", Auth_UserAdapter::getIdentity ()->getLink_list () );
	        
	        	$getLinkRequestSent = \Extended\link_requests::getLinkRequestSentOrRecieved ( $id );
	
	        	
	        	if( $getLinkRequestSent )
	        	{
	        		$requests_id = array ();
	        		foreach ( $getLinkRequestSent as $key => $r )
	        		{
	        			if( $r->getLink_requestsRecieverUser() )
	        			{
	        				$requests_id [] = $r->getLink_requestsRecieverUser()->getId();
	        			}
	        			else if( $r->getLink_requestsSenderUser() )
	        			{
	        				$requests_id [] = $r->getLink_requestsSenderUser()->getId();
	        			}
	        		}
	        	}
	        	$users_with_same_school = \Extended\education_detail::getYouMayKnowPeopleBySchool ( $requests_id, $myEduSchoolIds ,$id);
	        
	        	// End of People you may know for school section
	        }
	        
	        
	        // Start of People you may know for experience section
	        $exp_dtls = Auth_UserAdapter::getIdentity()->getUsersExperience ();
	        $myExpCompanyIds = array();
	        $requests_id = array ();
	        $users_with_same_company = array();
	        if( $exp_dtls->toArray() )
	        {
	        	foreach ( $exp_dtls as $exp )
	        	{
	        		$myExpCompanyIds[] = $exp->getExperiencesCompany()->getId ();
	        	}
	        	$exp_links = explode ( ",", Auth_UserAdapter::getIdentity ()->getLink_list () );
	        	$getLinkRequestSent = \Extended\link_requests::getLinkRequestSenderOrReceiver($id);
	        	if( $getLinkRequestSent )
	        	{
	        		$requests_id = array ();
	        		foreach ( $getLinkRequestSent as $r )
	        		{
	        			if( isset($r['accept_user_id']) )
	        			{
	        				$requests_id [] = $r['accept_user_id'];
	        			}
	        			else if( isset($r['request_user_id']) )
	        			{
	        				$requests_id [] = $r['request_user_id'];
	        			}
	        		}
	        	}
	        	$users_with_same_company = \Extended\experience::getYouMayKnowPeopleByExperiences ( $requests_id, $myExpCompanyIds, $id );
	        }
	        // End of People you may know for experience section
	        
	        // start merging array of same company and same school user ids
	        if($users_with_same_school || $users_with_same_company)
	        {
	        	$newMergeeeArray = array_merge ( $users_with_same_school, $users_with_same_company );
	        	$finalarray = array ();
	        		
	        	if ($newMergeeeArray)//Array of ( exp_id, ilook_user_id, company_ref_id )
	        	{
	        		foreach ( $newMergeeeArray as $ids )
	        		{
	        			$finalarray[] = $ids->getId();
	        		}
	        	}
	        	$newMergeArray = array_unique($finalarray);		
	        }
	        else if($users_with_same_school)
	        {
	        	$newMergeArray = $users_with_same_school;
	        }
	        else
	        {
	        	$newMergeArray = $users_with_same_company;
	        }
	        shuffle ( $newMergeArray );
	        $random_data = array ();
	        
	        if( $newMergeArray )
	        {
	        	foreach ( $newMergeArray as $key => $data ) {
	        		$random_data [] = \Extended\ilook_user::getRowObject($data);
	        		if ($key == 2)
	        		{
	        			break;
	        		}
	        	}
	        }
	       
	        $this->view->youMayKnowUsers = $random_data;
	        //End of people you may know section
	        
	    	} 
    	}
    }
    
    /**
     * Adds like for the wallpost.
     * Also increments like count
     * in wallpost
     * table.
     * Used for ajax call.
     *
     * @author sjaiswal
     * @version 1.0
     * @return json.
     */
    public function okTheWallpostAction()
    {
    	try {
    
    		//getting the wall post object.
    		$wall_post_obj = \Extended\wall_post::getRowObject( $this->getRequest()->getParam( 'wallpost_id' ) );
    		if( $wall_post_obj )
    		{	
	    		//Making a entry to like table for wallpost.
	    		$result = \Extended\likes::setOrUnsetOK( Auth_UserAdapter::getIdentity()->getId(), 0, $wall_post_obj->getId() );
	    
	    		if( $result == "wallpost_ok_added.")
	    		{
	    			//setting like count for wall post.
	    			\Extended\wall_post::likeCountIncreament( $wall_post_obj->getId() );
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
     * Removes like for the wallpost
     * Also decrements like count
     * in wallpost
     * table.
     * Used for ajax call.
     *
     * @author sjaiswal
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
	    		$result = \Extended\likes::setOrUnsetOK( Auth_UserAdapter::getIdentity()->getId(), 1, $wall_post_obj->getId() );
	    
	    		if( $result == "wallpost_ok_deleted." )
	    		{
	    			//setting like count for wall post.
	    			\Extended\wall_post::likeCountDecreament( $wall_post_obj->getId() );
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
     * Send notifications on ok the wallpost
     * @author hkaur5
     */
    public function sendOkNotificationAction()
    {
    	//getting the wall post object.
    	$wall_post_obj = \Extended\wall_post::getRowObject( $this->getRequest()->getParam( 'wallpost_id' ) );
    	 
    	//Making a entry to like table for wallpost.
    	$result = \Extended\notifications::addNotificationsOnOkTheWallpost( Auth_UserAdapter::getIdentity()->getId(), $wall_post_obj->getId() );
    	
    	die;
    }
    
    /**
     * Fetch photofeed info for ajax call
     *
     * @author jsingh7
     *
     */
    public function getDashboardInfoAction()
    {
    	$params = $this->getRequest()->getParams();
    	$result = \Extended\wall_post::getWallpostInfo( $params['wallpost_id'] );
    	if( $result )
    	{
    		echo Zend_Json::encode( \Extended\wall_post::getWallpostInfo( $params['wallpost_id'] ) );
    	}
    	else 
    	{
//     		Wallpost doesnot exist.
    		echo Zend_Json::encode(2);
    	}	
    	die;
    }
    
    /**
     * This action is for ajax call, to delete wallpost
     * on dashboard wall.
     *
     * @author jsingh7
     */
    public function deleteWallpostAction()
    {
    	if( \Extended\wall_post::deleteWallpost( $this->getRequest()->getParam('wallpost_id') ) )
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
     * Used for edit the comment.
     *
     * @author jsingh7
     */
    public function editCommentAction()
    {
    
    	$params = $this->getRequest()->getParams();
    	
    	$zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
    	$comment_text_filtered = $zend_filter_obj->filter( $params['comment_text']);
    	
    	echo Zend_Json::encode( \Extended\comments::editCommentOfDashboardWallpost( $params['comment_id'], $comment_text_filtered ) );
    	die;
    }
    
    /**
     * Used for edit the comment.
     *
     * @author sjaiswal
     */
    public function changePrivacyOfWallpostAction()
    {
    	$params = $this->getRequest()->getParams();
    	$result_r = \Extended\wall_post::changeWallpostPrivacy( $params['wallpost_id'], $params["privacy_to_set"] );
    	echo Zend_Json::encode($result_r);
    	die;
    }
    
    /**
     * This function used to send Report abuse to admin
     * @author spatial
     * @author sjaiswal
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
    	$msg = "<p style='margin:20px 20px 0 0; padding:0; font-size:14px; font-family:Arial, Helvetica, sans-serif; color:#3a3a3a'>
    				A wall post has been reported abuse.
    			</p>
	    		<p style='margin:20px 20px 0 0; padding:0; font-size:14px; font-family:Arial, Helvetica, sans-serif; color:#3a3a3a'>
	    			".$wallpost_owner_fullname."'s wall post has been reported abuse by ".$userName.".
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



