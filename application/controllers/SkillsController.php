<?php

class SkillsController extends Zend_Controller_Action
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
    }

    public function indexAction()
    {
        // action body
    }

    /**
     * function used to get skills for login user
     * @author sjaiswal
     * @version 1.0
     *
     */
    public function mySkillsAction()
    {
    	//$this->view->skillInfo=\Extended\user_skills::getSkillInfoList(Auth_UserAdapter::getIdentity()->getId());
    	$skills = \Extended\user_skills::getSkillsByUserId( Auth_UserAdapter::getIdentity()->getId() );
    	$my_blocked_users = \Extended\blocked_users::getAllBlockersAndBlockedUsers(Auth_UserAdapter::getIdentity()->getId());
    	$skill_data_arr = array();
    	
    	foreach ($skills as $key=>$skill)
    	{
    		$skill_data_arr[$key]['skill_id'] = $skill->getId();
    		$skill_data_arr[$key]['skill_ref_name'] = $skill->getUser_skillsSkill()->getSkill();
    		$skill_data_arr[$key]['skill_ref_id'] = $skill->getUser_skillsSkill()->getId();

			//Fetching skill supports
			$is_supported = false;
			$supporters = array();
			if( $skill->getSupported_ids() )
			{
				$is_supported = true;
				$supporters = explode(",", $skill->getSupported_ids());

				foreach ( $supporters as $keyy=>$supporter )
				{
					$supporter_obj = \Extended\ilook_user::getRowObject($supporter);

					// get job Title,company name and other info
					$jobDetailsArr = Helper_common::getUserProfessionalInfo($supporter_obj->getId());

					if($supporter_obj)
					{
						$skill_data_arr[$key]['skill_support'][$keyy]['id'] = $supporter_obj->getId();
						$skill_data_arr[$key]['skill_support'][$keyy]['supporter_id'] = $supporter_obj->getId();
						$skill_data_arr[$key]['skill_support'][$keyy]['supporter_name'] = $supporter_obj->getFirstname()." ".$supporter_obj->getLastname();
						$skill_data_arr[$key]['skill_support'][$keyy]['supporter_links'] = count(explode(',',$supporter_obj->getLink_list()));
						$skill_data_arr[$key]['skill_support'][$keyy]['supporter_job_title'] = isset($jobDetailsArr[0])?$jobDetailsArr[0]:NULL;
						$skill_data_arr[$key]['skill_support'][$keyy]['supporter_company'] = isset($jobDetailsArr[1])?$jobDetailsArr[1]:NULL;

						if($my_blocked_users)
						{
							$skill_data_arr[$key]['skill_support'][$keyy]['supporter_small_image'] = Helper_common::getUserProfessionalPhoto( $supporter_obj->getId(), 3, false, $my_blocked_users );
						}
						else
						{
							$skill_data_arr[$key]['skill_support'][$keyy]['supporter_small_image'] = Helper_common::getUserProfessionalPhoto( $supporter_obj->getId(), 3 );
						}
						$skill_data_arr[$key]['skill_support'][$keyy]['skill_holder_id'] = $supporter_obj->getId();
					}
				}
			}
			$skill_data_arr[$key]['is_supported'] = $is_supported;
		}
		$this->view->skills_info = $skill_data_arr;
    	
    }

    /**
     * function used for get skill listing for autocomplete funcitonality
     * 
     * @author spatial
     * @version 1.0
     * @return json
     *
     */
    public function getSkillListAction()
    {
    	$result=\Extended\skill_ref::getSkillList($this->getRequest()->getParam("term"));
    	$data_arr=array();
    	$i=0;
    	while($i<count($result)){
    		$data_arr[]=array(
    				'label'=>$result[$i]['skill'],
    				'value'=>$result[$i]['skill'],
    				'id'=>$result[$i]['id']
    		);
    		$i++;
    	}
    	echo Zend_Json::encode($data_arr);
    	die;
    }

    /**
     * function used for save the new skill record,
     * handles multiple skill with comma seperation.
     * @author spatial, jsingh7
     * @version 1.1
     * 
     *
     */
    public function saveSkillInfoAction()
    {
    	$params=$this->getRequest()->getParams();
    	 
    	$skill_chunks = explode(",", $params['skill_name']);
    	$skills_r = array();
    	$stripTags = Zend_Registry::get('Zend_Filter_StripTags');
    	foreach ($skill_chunks as $skill)
    	{
    		$skills_r[] = @$stripTags->filter( trim($skill) );
    	}
    	 
    	$result_id = "";
    	$saved_skills_r = array();
    	$return_r = array();
    	foreach ( $skills_r as $key => $skl )
    	{
    		if( $skl )
    		{
    			$skill_reff = \Extended\skill_ref::getRowObjectByColumn('skill', $skl);
    			if( !$skill_reff )//checking that is skill exist in reference table or not.
    			{
    				//skill do not exist";
    				$skill_id = \Extended\skill_ref::saveSkill(Auth_UserAdapter::getIdentity()->getId(), $skl);
    			}
    			else
    			{
    				// skill exist";
    				$skill_id = $skill_reff[0]->getId();
    			}
    			$result_id = \Extended\user_skills::addSkillInfo( Auth_UserAdapter::getIdentity()->getId(), $skill_id );
    			$return_r[$key]['user_skill_id'] = $result_id;
    			$return_r[$key]['user_skill_name'] = $skl;
    		}
    	}
    	 
    	 
    	if( $return_r )
    	{
    		echo Zend_Json::encode( $return_r );
    	}
    	else
    	{
    		echo Zend_Json::encode( 0 );
    	}
    	die;
    }

    /**
     * Accepts skill id(s) and returns set of ids and names
     * 
     * @author jsingh7
     * @version 1.0
     * @return json
     * 
     *
     */
    public function getNewlyAddedSkillsAction()
    {
    	$user_skill_obj = \Extended\user_skills::getUserSkillsById( $this->getRequest()->getParam("new_skills") );
    	$temp = array();
    	foreach( $user_skill_obj as $key=>$user_skill_obj )
    	{
    		$temp[$key]['user_skill_id'] = $user_skill_obj->getId();
    		$temp[$key]['user_skill_name'] = $user_skill_obj->getUser_skillsSkill()->getSkill();
    	}
    	echo Zend_Json::encode( $temp );
    	die;
    }

    /**
     * Action to handle ajax call to remove
     * skill.
     * 
     * @author spatial, jsingh7
     * @version 1.1
     * 
     *
     */
    public function removeSkillAction()
    {
 
    	$result = \Extended\user_skills::deleteSkill( $this->getRequest()->getParam("user_skill_id"), Auth_UserAdapter::getIdentity()->getId() );
    	$doUserHaveSkills = \Extended\user_skills::doUserHaveSkills( Auth_UserAdapter::getIdentity()->getId() );
    
    	$result_arr=array();
    	$result_arr['is_deleted'] = 0;
    	$result_arr['do_user_have_skills'] = 0;
    	if( $doUserHaveSkills )
    	{
    		$result_arr['do_user_have_skills'] = 1;
    	}
    	if($result)
    	{
    		$result_arr['is_deleted'] = 1;
    	}
    	echo Zend_Json::encode( $result_arr );
    	die;
    }
    
    /**
     * function to show skill supporters on skill supporters page
     * @author sjaiswal
     * @version 1.0
     *
     */
    public function skillSupportersAction()
    {
    	$params=$this->getRequest()->getParams();
    	
    	// action body
    	$skills_supporters= \Extended\user_skills::getUserSkillSupporters( Auth_UserAdapter::getIdentity()->getId() ,$params['skillId']);
		$my_blocked_users = \Extended\blocked_users::getAllBlockersAndBlockedUsers(Auth_UserAdapter::getIdentity()->getId());
		
    	if( ! @$params['list_len'] )
    	{
    		$params['list_len'] = 20;
    	}
    	
    	if( $skills_supporters )
    	{
    		$paginator = Zend_Paginator::factory( $skills_supporters );
    		$paginator->setItemCountPerPage( @$params['list_len'] );
    		$paginator->setCurrentPageNumber( @$params['page'] );
    		$this->view->paginator=$paginator;
    		$this->view->my_blocked_users=$my_blocked_users;
    	}
    
    	$this->view->skills_info = $skills_supporters;
    	$this->view->params = $params;
    	
    }
    
    /**
     * function to show skill supporters who are recruiter 
     * @author sjaiswal
     * @version 1.0
     *
     */
    public function skillRecruitersAction()
    {
    	$params=$this->getRequest()->getParams();
    	$user_types = array( \Extended\ilook_user::USER_TYPE_RECRUITER );
    	
    	if($params['user'] == 'within_ilook')
    	{
	    	// get followers within ilook
	    	$skills_recruiters= \Extended\user_skills::getSkillUsers($params['skillId'], $user_types);
	    	
	    	$this->view->my_blocked_users = \Extended\blocked_users::getAllBlockersAndBlockedUsers(Auth_UserAdapter::getIdentity()->getId());
	    	if( ! @$params['list_len'] )
	    	{
	    		$params['list_len'] = 20;
	    	}
	    	 
	    	if( $skills_recruiters )
	    	{
	    		$paginator = Zend_Paginator::factory( $skills_recruiters );
	    		$paginator->setItemCountPerPage( @$params['list_len'] );
	    		$paginator->setCurrentPageNumber( @$params['page'] );
	    		$this->view->paginator=$paginator;
	    	} 
	    	$this->view->skills_info = $skills_recruiters;
	    
	    	// end of get followers within ilook
    	}
    	
    	// start of get followers within links
    	if($params['user'] == 'within_links')
    	{
	    	$skills_recruiters_within_links= \Extended\user_skills::getSkillUsersWithinLinks($params['skillId'],		
																				    		 $user_types,
																				    		 Auth_UserAdapter::getIdentity()->getId()
    													   								     );
    	
	    	 if( ! @$params['list_len'] )
	    	{
	    		$params['list_len'] = 20;
	    	}
	    	
	    	if( $skills_recruiters_within_links )
	    	{
	    		$paginator_within_links = Zend_Paginator::factory( $skills_recruiters_within_links );
	    		$paginator_within_links->setItemCountPerPage( @$params['list_len'] );
	    		$paginator_within_links->setCurrentPageNumber( @$params['page'] );
	    		$this->view->paginator_within_links=$paginator_within_links;
	    	} 
	    	$this->view->skills_info_within_links = $skills_recruiters_within_links;
	    	
    	}
    	
    	$this->view->params = $params;
    	$this->view->skill_ref_id = $params['skillId'];
    	 
    	// end of get followers within links
    
    	 
    }
    
    /**
     * function to show skill supporters who are other than recruiter
     * (i.e. employed, job seeker, student & home maker)
     * @author sjaiswal
	 * @author ssharma4(support for home maker)
     * @version 1.1
     *
     */
    public function skillIndividualsAction()
    {
    	$params=$this->getRequest()->getParams();
    	$user_types = array( \Extended\ilook_user::USER_TYPE_EMPLOYED, \Extended\ilook_user::USER_TYPE_JOB_SEEKER ,\Extended\ilook_user::USER_TYPE_STUDENT,\Extended\ilook_user::USER_TYPE_HOME_MAKER);
    	if($params['user'] == 'within_ilook')
    	{
		// get followers within ilook
    	$skills_Individual= \Extended\user_skills::getSkillUsers($params['skillId'], $user_types);
    	$this->view->my_blocked_users = \Extended\blocked_users::getAllBlockersAndBlockedUsers(Auth_UserAdapter::getIdentity()->getId());
    	if( ! @$params['list_len'] )
    	{
    		$params['list_len'] = 20;
    	}
    	if( $skills_Individual )
    	{
    		$paginator = Zend_Paginator::factory( $skills_Individual );
    		$paginator->setItemCountPerPage( @$params['list_len'] );
    		$paginator->setCurrentPageNumber( @$params['page'] );
    		$this->view->paginator=$paginator;
    	}
    	$this->view->skills_info = $skills_Individual;
    	
    	// end of get followers within ilook
    	}
    	
    	
    	// start of get followers within links
    	if($params['user'] == 'within_links')
    	{
    		$skills_individual_within_links= \Extended\user_skills::getSkillUsersWithinLinks($params['skillId'],
    				$user_types,
    				Auth_UserAdapter::getIdentity()->getId()
    		);
    		 
    		if( ! @$params['list_len'] )
    		{
    			$params['list_len'] = 20;
    		}
    	
    		if( $skills_individual_within_links )
    		{
    			$paginator_within_links = Zend_Paginator::factory( $skills_individual_within_links );
    			$paginator_within_links->setItemCountPerPage( @$params['list_len'] );
    			$paginator_within_links->setCurrentPageNumber( @$params['page'] );
    			$this->view->paginator_within_links=$paginator_within_links;
    		}
    		$this->view->skills_info_within_links = $skills_individual_within_links;
    	
    	}
    	 
    	$this->view->params = $params;
    	$this->view->skill_ref_id = $params['skillId'];
    	
    	// end of get followers within links
    	
    
    }
    
    /**
     * function to search recruiters or individuals on basis of skills they are following
     * @author jsingh7,sjaiswal
	 * @author ssharma4 [home maker option based updates]
     * @version 1.2
     *
     */
    public function searchSkillsAction()
    {
    	$user_detail = Extended\ilook_user::getRowObject(Auth_UserAdapter::getIdentity()->getId());
    	
        // action body
        if( $this->_request->isGet() )
        {	
        	$stripTags = Zend_Registry::get('Zend_Filter_StripTags');
        	$params = $this->getRequest()->getParams();
        	//Zend_Debug::dump($params); die;
        	if( ! @$params['list_len'] )
        	{
        		$params['list_len'] = 20;
        	}
        	$this->view->prms = $params;
        	$this->view->search = @$params['search'];
        	
        	if (  trim( @$params['search'] ) != '' )
        	{
        		//Filtering first name.
        		$filtered_str_string = preg_replace( '/\s\s+/', ' ', $stripTags->filter( $params['search'] ) );
        		$chuncks = explode(" ", $filtered_str_string);
        		$temp_str = "";
        		foreach ( $chuncks as $chunk )
        		{
        			$temp_str .= preg_replace( "/\W+/", '', $chunk )." ";
        		}
        		 
        		$filtered_str_string = trim( $temp_str );
        		if ($user_detail->getUser_type() 	== 1
					|| $user_detail->getUser_type() == 2
					||$user_detail->getUser_type() 	== 3
					||$user_detail->getUser_type() 	== 6
				)
        		{
        		$user_types = array( \Extended\ilook_user::USER_TYPE_RECRUITER );
        		}
        		else if($user_detail->getUser_type() == 4)
        		{
        		$user_types =  array( \Extended\ilook_user::USER_TYPE_EMPLOYED, \Extended\ilook_user::USER_TYPE_JOB_SEEKER ,\Extended\ilook_user::USER_TYPE_STUDENT,\Extended\ilook_user::USER_TYPE_HOME_MAKER);
        		}
        		$searched_recruiter_skills = Extended\skill_ref::getSearchResult(
        															$filtered_str_string, 
        															$user_types
        															);
        		
        		if( $searched_recruiter_skills )
        		{
        			$paginator = Zend_Paginator::factory( $searched_recruiter_skills );
        			$paginator->setItemCountPerPage( @$params['list_len'] );
        			$paginator->setCurrentPageNumber( @$params['page'] );
        			$this->view->paginator=$paginator;
        			$this->view->user_type=$user_detail->getUser_type();
        		}
        	}
        }
    }
    
    /**
	 * function used to follow a skill
	 * Made for Ajax  call.
	 * @author sjaiswal
	 * @version 1.0
	 *
	 */
    public function saveFollowedSkillAction()
    {
    	$params = $this->getRequest()->getParams();
    	$skill_id = $params['skill_id'];
    	$user_id = $params['user_id'];
    	$followers = \Extended\user_skills::followSkill( $skill_id, $user_id );
    	$return_follower['user_skill_id'] = $followers;
    	$return_follower['skill_id'] = $skill_id;
    	$return_follower['user_id'] = $user_id;
    	
    	 if($return_follower['user_skill_id'] != 0 )
    	{
    		echo Zend_Json::encode( $return_follower ); 
    	}
    	else
    	{
    		echo Zend_Json::encode( 0 );
    	}  
    	die;
    }
    
    /**
     * function used to show skills of a user and get recruiter for that skills
     * @author sjaiswal
     * @version 1.0
     *
     */
    public function recruiterForYourSkillsAction()
    {
    	$skills = \Extended\user_skills::getSkillsByUserId( Auth_UserAdapter::getIdentity()->getId() );
    	$my_blocked_users = \Extended\blocked_users::getAllBlockersAndBlockedUsers(Auth_UserAdapter::getIdentity()->getId());
    	$user_types = array( \Extended\ilook_user::USER_TYPE_RECRUITER );
    	
    	$skill_data_arr = array();
    	foreach ( $skills as $key=>$skill )
    	{
    		$skill_data_arr[$key]['skill_id'] = $skill->getId();
    		$skill_data_arr[$key]['skill_ref_name'] = $skill->getUser_skillsSkill()->getSkill();
    		$skill_data_arr[$key]['skill_ref_id'] = $skill->getUser_skillsSkill()->getId();
    	}
    	
    	$this->view->skills_info = $skill_data_arr;
    
    }
    
    
    /**
     * function used to show skills of a user and get individual for that skills
     * @author sjaiswal
     * @version 1.0
     *
     */
    public function individualForYourSkillsAction()
    {
    	$skills = \Extended\user_skills::getSkillsByUserId( Auth_UserAdapter::getIdentity()->getId() );
    	$skill_data_arr = array();
    	foreach ( $skills as $key=>$skill )
    	{
    		$skill_data_arr[$key]['skill_id'] = $skill->getId();
    		$skill_data_arr[$key]['skill_ref_name'] = $skill->getUser_skillsSkill()->getSkill();
    		$skill_data_arr[$key]['skill_ref_id'] = $skill->getUser_skillsSkill()->getId();
    	}
    	 
    	$this->view->skills_info = $skill_data_arr;
    
    }
    
    
    /**
     * ajax function used to get recruiter for clicked user skill
     * @ integer $skill_id id of skill 
     * @author sjaiswal
     * @version 1.0
     *
     */
    public function recruiterForSkillsAction()
    {
    	$params = $this->getRequest()->getParams();
    	$user_types = array( \Extended\ilook_user::USER_TYPE_RECRUITER );
    	$skills_recruiters= \Extended\user_skills::getSkillUsersWithinLinks($params['skill_id'], $user_types,Auth_UserAdapter::getIdentity()->getId());
    	
    	/* array structure 
    	array (size=2)
    	0 => int 1009
    	1 => int 3
    	array structure */
		$html = '';
    	if($skills_recruiters)
		{
			$html .= Helper_common::displayUsersGridView( Auth_UserAdapter::getIdentity()->getId(), $skills_recruiters,null, null,null,"No Recruiter for this skill" ); 
		}
		else
		{
			$html .= Helper_common::displayUsersGridView( Auth_UserAdapter::getIdentity()->getId(), $skills_recruiters=NULL,null, null,null,"No Recruiter for this skill" ); 
		}
    	
    	
    	$result  = array('html'=>$html );
    	if($result != 0 )
    	{
    		echo Zend_Json::encode( $result );
    	}
    	else
    	{
    		echo Zend_Json::encode( 0 );
    	}
    	die;
   
    }
    
    /**
     * ajax function used to get recruiter for clicked user skill
     * @author sjaiswal
     * @version 1.0
     *
     */
    public function individualForSkillsAction()
    {
    	$params = $this->getRequest()->getParams();
    	$user_types = array( \Extended\ilook_user::USER_TYPE_EMPLOYED, \Extended\ilook_user::USER_TYPE_JOB_SEEKER ,\Extended\ilook_user::USER_TYPE_STUDENT,\Extended\ilook_user::USER_TYPE_HOME_MAKER);
    	$skills_recruiters= \Extended\user_skills::getSkillUsersWithinLinks($params['skill_id'], $user_types, Auth_UserAdapter::getIdentity()->getId());
		$html = '';
		if($skills_recruiters)
		{
			$html .= Helper_common::displayUsersGridView( Auth_UserAdapter::getIdentity()->getId(), $skills_recruiters,null, null,null,"No Individual for this skill" );
		}
    	else
		{
			$html .= Helper_common::displayUsersGridView( Auth_UserAdapter::getIdentity()->getId(), $skills_recruiters=NULL,null, null,null,"No Individual for this skill" );
		}
    	$result  = array('html'=>$html );
    
    	if($result != 0 )
    	{
    		echo Zend_Json::encode( $result );
    	}
    	else
    	{
    		echo Zend_Json::encode( 0 );
    	}
    	die;
    	 
    }
    
   
}
