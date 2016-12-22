<?php
class ProfileController extends Zend_Controller_Action
{
	//defined for displaying message for empty picture description for other users
	const EMPTY_PIC_DESC_MSG ='No Description Provided';
	//defined for displaying message for empty picture description for album owner
	const EMPTY_OWNER_PIC_DESC_MSG ='Say Something About This Photo';

    /**
     * This function checks auth storage and
     * manage redirecting.
     * 
     * @author jsingh7
     * @since 20 June, 2012
     * @version 1.0
     * @see Zend_Controller_Action::preDispatch()
     *
     */
    public function preDispatch()
    {
    	$prms = $this->getRequest()->getParams();
    	
    	if ( $prms['action'] == 'iprofile' )
    	{
			//Do nothing.
    	}
		else if ( !Auth_UserAdapter::hasIdentity() )
		{
			if( $this->getRequest()->getParam('id') && $this->getRequest()->getParam('uid') )
    		{ 
	    		$after_login_redirection_session = new Zend_Session_Namespace('after_login_redirection_session');
	    		// value 9 is used for photo action
	    		$after_login_redirection_session->action = 9;
	    		$after_login_redirection_session->photo_id = $this->getRequest()->getParam('id');
	    		$after_login_redirection_session->user_id = $this->getRequest()->getParam('uid');
    		}
			$this->_helper->redirector( 'index', 'index' );
		}
    	
    }


    public function init()
    {   
    	
    }

    
    /**
     * ??????????????????????????????
     *
     * @version ?
     * @author ?
     */
    public function indexAction()
    {
    	if( Auth_UserAdapter::hasIdentity() )
    	{
    		$this->_helper->redirector("index", "dashboard");
    	}
    	else
    	{
    		$this->_helper->redirector("index", "index");
    	}
    }

    /**
     * renders phtml page.
     * @author jsingh7
     * @version 1.0
     */
    public function contactDetailsAction()
    {
        // action body
    }

    /**
     * Handles ajax call to save contact details.
     *
     * @author jsingh7
     * @version 1.0
     * @return json
     */
    public function saveMyContactDetailsAction()
    {
        // action body
        $params = $this->getRequest()->getParams();
        
        $zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
        $username_filtered = $zend_filter_obj->filter( $params['profile'] );
        
        $identity = Extended\ilook_user::updateContactDetails( Auth_UserAdapter::getIdentity()->getId(), $params['tel_1'], $params['tel_2'], $username_filtered);
        $temp = array();
        $temp['tel_1'] = $params['tel_1'];
        $temp['tel_2'] = $params['tel_2'];
        $temp['username'] = $username_filtered;
        if($identity)
        	echo Zend_Json::encode($temp);
        else
        	echo Zend_Json::encode(0);
        die;
    }

    /**
     * Handles ajax call to fetch contact details
     * of logged in user.
     * 
     * @author jsingh7
     * @version 1.0
     * @return json
     */
    public function getMyContactDetailsAction()
    {
    	$temp = array();
    	$temp['tel_1'] = Auth_UserAdapter::getIdentity()->getPhone();
    	$temp['tel_2'] = Auth_UserAdapter::getIdentity()->getPhone_second();
    	$temp['username'] = Auth_UserAdapter::getIdentity()->getUsername();
    	if($temp)
    		echo Zend_Json::encode($temp);
    	else
    		echo Zend_Json::encode(0);
    	die;
    }

    /**
     * Handles ajax call to check username
     * duplicacy.
     * 
     * @author jsingh7
     * @version 1.0
     * @return json
     */
    public function checkUsernameExistAction()
    {
    	$uname_check = \Extended\ilook_user::isUsernameExist( $this->getRequest()->getParam('username'), Auth_UserAdapter::getIdentity()->getUsername() );
    	if($uname_check)
    	{
    		echo Zend_Json::encode(false);
    	}else{
    		echo Zend_Json::encode(true);
    	}
    	die();
    }

    /**
     * This function used to get basic profile information .
     * @author spatial
     * @version 1.0
     */
    public function basicInformationAction()
    {
        // action body
        $em = Zend_Registry::get('em');
        // get country names list
        $country_arr=Extended\country_ref::getCountryList();
        $this->view->countries=$country_arr;
        
        // get indsutry titles list
		$industry_arr = array();
        $industry_arr = Extended\industry_ref::getIndustryList();
        $this->view->industry=$industry_arr;
        
        // get country name as compare to country id 
    	$country_id = $em->getUnitOfWork()->getEntityIdentifier(Auth_UserAdapter::getIdentity()->getUsersCountry());
    	$country = $em->find('\Entities\country_ref', $country_id["id"]);
    	$this->view->country_id=$country_id["id"];
    	$this->view->country_name=$country->getName();
    	
		// get states  list
    	$state_arr = array();
    	$state_arr = Extended\state::getStateList($country_id["id"]);
    	if($state_arr)
    	{
	    	$this->view->stateList = $state_arr;
	    	
	    	// get loged user state name as compare to state id
	    	if(Auth_UserAdapter::getIdentity()->getState()){
	    		$state_id = $em->getUnitOfWork()->getEntityIdentifier(Auth_UserAdapter::getIdentity()->getState());
	    		$state = $em->find('\Entities\state', $state_id["id"]);
		    	
		    	$this->view->state_id = $state_id["id"];
		    	$this->view->state_name = $state->getName();
		    	
		    	$city_arr = array();
		    	$city_arr = Extended\city::getCityList($state_id["id"]);
	    	}
	    	else
	    	{
	    		$city_arr = array();
	    		$city_arr = Extended\city::getCityListUnderCountry($country_id["id"]);
	    	}
	    }
    	else{
    		$city_arr = array();
    		$city_arr = Extended\city::getCityListUnderCountry($country_id["id"]);
    	}
    		// get city  list
    		$this->view->cityList = $city_arr;
	    	// get loged user city name as compare to city id
	    	if(Auth_UserAdapter::getIdentity()->getCity()){ 
	    		$city_id = $em->getUnitOfWork()->getEntityIdentifier(Auth_UserAdapter::getIdentity()->getCity());
	    		$city = $em->find('\Entities\city', $city_id["id"]);
		    	//\Zend_Debug::dump($city_id); die;
		    	$this->view->city_id = $city_id["id"];
		    	$this->view->city_name = $city->getName();
	    	}
	    	else{
	    		$this->view->city_id = '';
	    		$this->view->city_name = '';
	    	}
    	
    	
    	// get industry title as compare to industry id    	
    	@$industry_id = $em->getUnitOfWork()->getEntityIdentifier(Auth_UserAdapter::getIdentity()->getUsersIndustry());
    	if($industry_id)
    	{
    		$industry = $em->find('\Entities\industry_ref',$industry_id["id"]);
    		$this->view->industry_id = $industry_id["id"];
    		$this->view->industry_title = $industry->getTitle();
    	}
    	else
    	{
    		$this->view->industry_id = "";
    		$this->view->industry_title = "";    		
    	}
    	
    }

    /**
     * function used for edit the particular basic info
     * 
     * @author spatial
     * @version 1.0
     * @return json
     *
     */
    public function editBasicInfoAction()
    {
    	$em = Zend_Registry::get('em');
    	
    	// get country name as compare to country id
    	$userid=Auth_UserAdapter::getIdentity()->getId();
    	$userinfo=\Extended\ilook_user::getBasicInformation($userid);
    	$user_industry=\Extended\ilook_user::getUserIndustry($userid);
    	$return_r = array();
    	$return_r['info'] = $userinfo[0];
    	$userObj = \Extended\ilook_user::getRowObject($userid);
    	if($userObj->getState()){
    		$return_r['info']['state'] = $userObj->getState()->getName();
    	}
    	if($userObj->getCity()){
    		$return_r['info']['city'] = $userObj->getCity()->getName();
    	}
    	$genderId = $userObj->getGender();
    	if($genderId == 1){
    		$return_r['info']['gender'] = 'Male';
    	}elseif($genderId == 2){
    		$return_r['info']['gender'] = 'Female';
    	}
    	if(	$user_industry)
    		
    	$return_r['industry'] = $user_industry[0];
    	else
    	
    		$return_r['industry'] = '0';
    	
  
    	echo Zend_Json::encode($return_r);
    	die;
    }

    /**
     * function used for save the basic info
     * 
     * @author spatial
     * @version 1.0
     * @return json
     *
     */
    public function saveBasicInfoAction()
    {
    	$params=$this->getRequest()->getParams();
    	//Zend_Debug::dump($params); die;
    	$id=Auth_UserAdapter::getIdentity()->getId();
    	$result=\Extended\ilook_user::updateBasicInfo($id, $params);
		
    	if($result){
    		$result=array("msg"=>"success");
    	}
    	else{
    		$result=array("msg"=>"error");
    	}
    	echo Zend_Json::encode($result);
    	die;
    }

    /**
     * action of the education.
     * 
     * @author spatial
     * @version 1.0
     * @return json
     *
     */
    public function educationAction()
    {
        // action body
        $id=Auth_UserAdapter::getIdentity()->getId();
        $result=\Extended\education_detail::getEduInfoList($id);
       	$this->view->eduInfoList=$result;
    }

    /**
     * function used for remove the particular education.
     * 
     * @author spatial
     * @version 1.0
     * @return json
     * 
     */
    public function getEducationIdAction()
    {
    	$result=\Extended\education_detail::getEducationIds(Auth_UserAdapter::getIdentity()->getId());
    	echo Zend_Json::encode($result);
    	die;
    }

    public function summaryAction()
    {
        // action body
        
    }

    /**
     * function used for save the new education record
     * 
     * @author spatial
     * @version 1.0
     * @return json
     *
     */
    public function saveEduInfoAction()
    {
    	$zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
    	$params=$this->getRequest()->getParams();
    	
    	$id=Auth_UserAdapter::getIdentity()->getId();
    	$obj=\Extended\ilook_user::getRowObject($id);
    	$education_detail=$obj->getUsersEducation();
    	$total_education=count($education_detail);
    	$school_id=$params["school_id"];
    	$field_study_id=$params["field_stud_id"];

    	$degree_id=$params["degree_id"];
		
    	if($params["degree_id"]=="" || $params["degree_id"]==0)
    	{
    		$degree_title=$zend_filter_obj->filter($params["degree"]);
    		$degree_id=\Extended\degree_ref::saveDegree($id, $degree_title);	
    	}
    	if($params["school_id"]=="" || $params["school_id"]==0)
    	{
    		$school_title = $zend_filter_obj->filter($params["school_name"]);
    		$school_id=\Extended\school_ref::saveSchool($id, $school_title);
    	}
    	if($params["field_stud_id"]=="" || $params["field_stud_id"]==0)
    	{
    		$field_study_title=$zend_filter_obj->filter($params["study_field"]);
    		$field_study_id=\Extended\field_of_study_ref::saveFieldOfStudy($id, $field_study_title);
    	}
    	$result=\Extended\education_detail::addEduInfo($id, $params, $degree_id, $school_id, $field_study_id);
    	if($result)
    	{
    		$result=array("msg"=>"success");
    	}
    	else
    	{
    		$result=array("msg"=>"error");
    	}
    	echo Zend_Json::encode($result);
    	die;
    }

    /**
     * Handles ajax call for summary
     * to getdata.
     * 
     * @author jsingh7
     * @version 1.0
     * @return json
     *
     */
    public function getMySummaryAction()
    {
		$temp = array();
		$striped_prof_exp = strip_tags(Auth_UserAdapter::getIdentity()->getProfessional_exp());
		$striped_prof_goals = strip_tags(Auth_UserAdapter::getIdentity()->getProfessional_goals());
    	$temp['exp'] = $striped_prof_exp;
    	$temp['goals'] = $striped_prof_goals;
    	if($temp)
    		echo Zend_Json::encode($temp);
    	else
    		echo Zend_Json::encode(0);
    	die;
    }

    /**
     * Handles ajax call for summary
     * to setdata.
     * 
     * @author jsingh7
     * @version 1.0
     * @return json
     *
     */
    public function saveMySummaryAction()
    {
		$params=$this->getRequest()->getParams();
		$zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
		
		$prof_exp = $zend_filter_obj->filter($params['prof_exp_val']);

		$prof_goals = isset($params['prof_goals_val']) ? nl2br($params['prof_goals_val']):NULL;
		$user_id = \Auth_UserAdapter::getIdentity()->getId();
		$result=\Extended\ilook_user::updateSummary( $user_id, $prof_exp);
		$saved_prof_exp = Auth_UserAdapter::getIdentity()->getProfessional_exp();
		$saved_prof_goals = Auth_UserAdapter::getIdentity()->getProfessional_goals();
		
		if($result)
		{
			$result=array("msg"=>"success", "prof_exp"=>$saved_prof_exp, "prof_goals"=>$saved_prof_goals);
		}
		else
		{
			$result=array("msg"=>"error");
		}
		echo Zend_Json::encode($result);
		die;
    }

    /**
     * function used for get the education listing
     * 
     * @author spatial
     * @version 1.0
     * @return json
     *
     */
    public function getEducationListingAction()
    {
		
		$id=Auth_UserAdapter::getIdentity()->getId();
		$result=\Extended\education_detail::getEduInfoList($id,1);
		echo Zend_Json::encode($result);
		die;
    }

    /**
     * function used for get the school listing for autocomplete funcitonality
     * 
     * @author spatial
     * @version 1.0
     * @return json
     *
     */
    public function getSchoolsListAction()
    {
		$params=$this->getRequest()->getParams();
		$keyword=$params["term"];
		$result=\Extended\school_ref::getSchoolList($keyword);
		$data_arr=array();
		$i=0;
		while($i<count($result))
		{
			$data_arr[]=array(
					'label'=>$result[$i]['title'],
					'value'=>$result[$i]['title'],
					'id'=>$result[$i]['id']
					);
			$i++;
		}
		echo Zend_Json::encode($data_arr);
		die;
    }

    /**
     * function used for get the degree listing for autocomplete funcitonality
     * 
     * @author spatial
     * @version 1.0
     * @return json
     */
    public function getDegreeListAction()
    {
		$params=$this->getRequest()->getParams();
		$zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
		$term_filtered = $zend_filter_obj->filter( $params["term"] );
		
		$keyword = $term_filtered;
		$result=\Extended\degree_ref::getDegreeList($keyword);
		$data_arr=array();
		$i=0;
		while($i<count($result))
		{
			$data_arr[]=array(
					'label'=>$result[$i]['title'],
					'value'=>$result[$i]['title'],
					'id'=>$result[$i]['id']
			);
			$i++;
		}
		echo Zend_Json::encode($data_arr);
		die;
    }

    /**
     * function used for get the field of study listing for autocomplete funcitonality
     *
     * @author spatial
     * @version 1.0
     * @return json
     *
     */
    public function getFieldOfStudyListAction()
    {
		
		$params=$this->getRequest()->getParams();
		$keyword=$params["term"];
		$result=\Extended\field_of_study_ref::getFieldOfStudyList($keyword);
		$data_arr=array();
		$i=0;
		while($i<count($result))
		{
			$data_arr[]=array(
					'label'=>$result[$i]['title'],
					'value'=>$result[$i]['title'],
					'id'=>$result[$i]['id']
					);
			$i++;
		}
		echo Zend_Json::encode($data_arr);
		die;
    }

    /**
     * function used for edit the particular education
     * 
     * @author spatial
     * @version 1.0
     * @return json
     */
    public function editEducationAction()
    {
		$params=$this->getRequest()->getParams();
		$edit_id=$params["edit_id"];
		$result=\Extended\education_detail::getEditEducationInfo($edit_id);
		echo Zend_Json::encode($result);
		die;
    }

    /**
     * function used for remove the particular education
     * 
     * @author sunny patial
     * @version 1.0
     * @return json
     */
    public function removeEducationAction()
    {
		$params=$this->getRequest()->getParams();
		$edit_id=$params["remove_id"];
		$user_id=Auth_UserAdapter::getIdentity()->getId();
		$result=\Extended\education_detail::deleteEducationInfo($edit_id,$user_id);
		if($result){
			$result_arr=array("msg"=>$result);
		}
		echo Zend_Json::encode($result_arr);
		die;
    }

    /**
     * function used for update the particular education
     * 
     * @author sunny patial
     * @version 1.0
     * @return json
     *
     */
    public function updateEduInfoAction()
    {
		$params=$this->getRequest()->getParams();
		$id=Auth_UserAdapter::getIdentity()->getId();
		$school_id=$params["school_id"];
		$field_study_id=$params["field_stud_id"];
		$degree_id=$params["degree_id"];
		
		if($params["degree_id"]=="" || $params["degree_id"]==0)
		{
			$degree_title=$params["degree"];
			$degree_id=\Extended\degree_ref::saveDegree($id, $degree_title);
		}
		
		if($params["school_id"]=="" || $params["school_id"]==0)
		{
			$school_title=$params["school_name"];
			$school_id=\Extended\school_ref::saveSchool($id, $school_title);
		}
		if($params["field_stud_id"]=="" || $params["field_stud_id"]==0)
		{
			$field_study_title=$params["study_field"];
			$field_study_id=\Extended\field_of_study_ref::saveFieldOfStudy($id, $field_study_title);
		}
		
		$result=\Extended\education_detail::updateEducationInfo($id, $params, $degree_id, $school_id, $field_study_id);
		
		if($result)
		{
			$educ_id=$params["educ_id"];
			$result_arr=\Extended\education_detail::getEditEducationInfo($educ_id);
		}
		else
		{
			$result_arr=array("msg"=>"error");
		}
		echo Zend_Json::encode($result_arr);
		die;
    }

    /**
     * This function used to get skill information
     * @author Sunny Patial
     * @since 1 Aug, 2013
     * @version 1.0
     *
     */
    public function skillsOldAction()
    {
        $result=\Extended\user_skills::getSkillInfoList(Auth_UserAdapter::getIdentity()->getId());
        $this->view->skillInfoList=$result;
    }
    
    /**
     * Action for skills section.
     * 
     * @author jsingh7
     * @version 1.0
     *
     */
    public function skillsAction()
    {
        $skills = \Extended\user_skills::getSkillsByUserId( Auth_UserAdapter::getIdentity()->getId() );
        
        $my_blocked_users = \Extended\blocked_users::getAllBlockersAndBlockedUsers(Auth_UserAdapter::getIdentity()->getId());
        $skill_data_arr = array();

        foreach ( $skills as $key=>$skill )
        {
        	$skill_data_arr[$key]['skill_id'] = $skill->getId();
        	$skill_data_arr[$key]['skill_ref_name'] = $skill->getUser_skillsSkill()->getSkill();
        	$skill_data_arr[$key]['skill_ref_id'] = $skill->getUser_skillsSkill()->getId();
        	
        	//Fetching skill supports
        	$supporters = array();
			$is_supported = false;
        	if( $skill->getSupported_ids() )
        	{
				$is_supported = true;
        		$supporters = explode(",", $skill->getSupported_ids());
        		
        		foreach ( $supporters as $keyy=>$supporter )
        		{
        			$supporter_obj = \Extended\ilook_user::getRowObject($supporter);
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
     * function used for get the school listing for autocomplete funcitonality
     *
     * @author sunny patial
     * @version 1.0
     * @return json
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
     *
     * @author spatial, jsingh7
     * @version 1.1
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
	    			$skill_id = \Extended\skill_ref::saveSkill(Auth_UserAdapter::getIdentity()->getId(), $skl);
	    		}
	    		else
	    		{
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
     * !!!!!No Longer in use!!!!!
     * !!!!! function name is not according to functionality!!!!!
     *
     * function used for get the education listing
     *
     * @author sunny patial
     * @version 1.0
     * @return json
     *
     */
    public function getSkillListingAction()
    {
    	$result=\Extended\user_skills::getSkillInfoList( Auth_UserAdapter::getIdentity()->getId(), 1 );
    	echo Zend_Json::encode($result);
    	die;
    }

    /**
     * action associated with view.
     *
     * @author jsingh7
     *
     */
    public function experienceAction()
    {
        // action body      
        $this->view->myExps = Extended\experience::getAllExperiences( Auth_UserAdapter::getIdentity()->getId() );
    }

    /**
     * Handles ajax call.
     * 
     * @author jsingh7
     */
    public function getMyExperienceAction()
    {
		$rowObj = Extended\experience::getRowObject( $this->getRequest()->getParam("exp_id") );
		$myExpsArray = array();
		$myExpsArray["id"] = $rowObj->getId();
		$myExpsArray["job_title"] = $rowObj->getJob_title();
		$myExpsArray["experiencesCompany"] = $rowObj->getExperiencesCompany()->getName();
		//$sdate = ""; 
		//$edate = "";
		if( $rowObj->getJob_startdate()  )
		{
			$sdate = $rowObj->getJob_startdate()->format('d-m-Y');
		}
		else
		{
			$sdate = "";
		}
		if( $rowObj->getJob_enddate() )
		{
			$edate = $rowObj->getJob_enddate()->format('d-m-Y');
		}
		else
		{
			$edate = "";
		}	
			
		 
		$myExpsArray["job_startdate"] = $sdate;
		$myExpsArray["job_enddate"] = $edate;
		$myExpsArray["location"] = $rowObj->getLocation();
		$myExpsArray["currently_work"] = $rowObj->getCurrently_work();
		$myExpsArray["description"] = $rowObj->getDescription();
		echo Zend_Json::encode($myExpsArray);
		die;
    }

    /**
     * function used for edit the particular education
     *
     * @author sunny patial
     * @version 1.0
     * @return json
     *
     */
    public function editSkillAction()
    {
		$params=$this->getRequest()->getParams();
		$result=\Extended\user_skills::getEditSkillInfo($params["edit_id"]);
		echo Zend_Json::encode($result);
		die;
    }

    /**
     * function used for update the particular education
     *
     * @author sunny patial
     * @version 1.0
     * @return json
     *
     */
    public function updateSkillInfoAction()
    {
    	$params=$this->getRequest()->getParams();
    	
    	$stripTags = Zend_Registry::get('Zend_Filter_StripTags');
    	$new_name_for_skill = @$stripTags->filter( trim($params['skill_name']) );
    	if( @$new_name_for_skill )
    	{	
	    	$skill_reff = \Extended\skill_ref::getRowObjectByColumn('skill', $new_name_for_skill);
	    	if( !$skill_reff )//checking that is skill exist in reference table or not.
	    	{
	    		$skill_id = \Extended\skill_ref::saveSkill(Auth_UserAdapter::getIdentity()->getId(), $new_name_for_skill);
	    	}
	    	else
	    	{
	    		$skill_id = $skill_reff[0]->getId();
	    	}
	    	$result = \Extended\user_skills::updateSkillInfo( Auth_UserAdapter::getIdentity()->getId(), $skill_id, $params['user_skill_id'] );
	    	if( $result )
	    	{
	    		//Skill saved/linked with user.
	    		echo Zend_Json::encode( $result );
	    	}
	    	else
	    	{
	    		//Error while saving skill.
	    		echo Zend_Json::encode( FALSE );
	    	}	
    	}
    	else
    	{
    		//Please enter valid name for skill.
    		echo Zend_Json::encode( FALSE );
    	}
    	die;	
    }

    /**
     * Action to handle ajax call to remove
     * skill.
     *
     * @author spatial, jsingh7
     * @version 1.1
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
     * function used for remove the particular skill
     *
     * @author sunny patial
     * @version 1.0
     * @return json
     *
     */
    public function getSkillIdAction()
    {
		$result=\Extended\user_skills::getSkillInfoIds(Auth_UserAdapter::getIdentity()->getId());
		echo Zend_Json::encode($result);
		die;
    }

    /**
     * handles ajax call from jquery autocomplete
     * for companies.
     *
     * @author jsingh7
     * @version 1.0
     *
     */
    public function getAllRefCompaniesAction()
    {
		$allCompanies = \Extended\company_ref::getAllCompanies( $this->getRequest()->getParam('term') );
		$temp = array();
		if($allCompanies)
		{
			foreach ( $allCompanies as $key=>$com )
			{
				$temp[$key]['id'] = $com->getId();
				$temp[$key]['label'] = $com->getName();
				$temp[$key]['value'] = $com->getName();
			}
		}	
		echo Zend_Json::encode($temp);
		die;
    }

    /**
     * Handles ajax call for adding an experience.
     * @author jsingh7
	 * @author ssharma4 [Modified code to avoid undefined parameter error]
     *
     */
    public function saveMyExperienceAction()
    {
		$params = $this->getRequest()->getParams();
		$zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
		$comp_id = \Extended\company_ref::checkCompany( $params["company"] );
		if( !$comp_id )
		{
			$comp_id = \Extended\company_ref::addCompany($params["company"], Auth_UserAdapter::getIdentity()->getId() );
		}
		
		$curt_wrk_yes = \Extended\experience::CURRENTLY_WORK_YES;
		$curt_wrk_no = \Extended\experience::CURRENTLY_WORK_NO;
		$temp = array();
		
		// get data where user is currently working previous
		$get_previous_currently_working = \Extended\experience::getCurrentlyWorkingUserData(Auth_UserAdapter::getIdentity()->getId());
		
		$temp["emp_company_id"] = $comp_id;
		$temp["company_name"] = $params["company"];
		$temp["emp_job_title"] = $zend_filter_obj->filter($params["title"]);
		$temp["user_id"] = Auth_UserAdapter::getIdentity()->getId();
		$temp["description"] = $zend_filter_obj->filter($params["additional_notes"]);
		$temp["currently_work"] = @$params["currunt_company"]?$curt_wrk_yes:$curt_wrk_no;
		$temp["experience_from"] = @$params["from_date"];
		$temp["experience_to"] = @$params["to_date"];
		
		$diff = "";
		if( @$params["from_date"] && @$params["to_date"] )
		{
			$days = intVal( DateTime::createFromFormat( "d-m-Y H:i:s", $params ['from_date']." 00:00:00" )->diff( DateTime::createFromFormat("d-m-Y H:i:s", $params['to_date']." 00:00:00" ) )->d );
			$months = intVal( DateTime::createFromFormat( "d-m-Y H:i:s", $params['from_date']." 00:00:00" )->diff( DateTime::createFromFormat("d-m-Y H:i:s", $params['to_date']." 00:00:00" ) )->m );
			$years = intVal( DateTime::createFromFormat( "d-m-Y H:i:s", $params['from_date']." 00:00:00" )->diff( DateTime::createFromFormat("d-m-Y H:i:s", $params['to_date']." 00:00:00" ) )->y );
			// for years, months and days
			if($months == 0 && $years == 0 && $days >= 1) 
				$diff = $days. ' day(s)';
			elseif($months == 0 && $years >= 1 && $days == 0)  
				$diff = $years.' year(s)';
			elseif($months == 0 && $years >= 1 && $days >= 1)
				$diff = $years.' year(s) '. $days.' day(s)';
			elseif($months >= 1 && $years == 0 && $days == 0)
				$diff = $months.' month(s)';
			elseif($months >= 1 && $years == 0 && $days >= 1)
				$diff = $months.' month(s) '.$days.' day(s)';
			elseif($months >= 1 && $years >= 1 && $days == 0)
				$diff = $years. ' year(s) '.$months.' month(s) ';
			elseif($months >= 1 && $years >= 1 && $days >= 1)
				$diff = $years.' year(s) '.$months.' month(s) '.$days.' day(s)';
			else
			{	
				$diff = $years.' year(s) '.$months.' month(s) ';
			}
		}
		$temp["date_diff"] = $diff;
		
		$temp["location"] = $zend_filter_obj->filter($params["location"]);
		
		$id = 0;
		if( !$params['identity'] )
		{
			$temp["new_record"] = 1;
			$id = Extended\experience::addOrEditExperience($temp);
		}
		else
		{	
			$temp["new_record"] = 0;
			$id = Extended\experience::addOrEditExperience($temp, $params['identity']);
		}

		$exp_arr = array();
		$exp_arr['current_exp_id'] 					= $id;
		$exp_arr['previous_current_exp_id']			= isset($get_previous_currently_working[0]['id'])?$get_previous_currently_working[0]['id']:0;
		$exp_arr['previous_current_exp_job_endate'] = isset($get_previous_currently_working[0]['job_enddate'])?$get_previous_currently_working[0]['job_enddate']->format('d-m-Y'):NULL;
		$exp_arr['current_exp_data'] 				= $temp;
		
		if( $exp_arr )
		{
			echo Zend_Json::encode( $exp_arr );		
		}
		else
		{			
			echo Zend_Json::encode( 0 );		
		}	
		die;
    }

    /**
     * This function used to get user information
     * @author Sunny Patial,rkaur3
     * @since 1 Aug, 2013
     * @version 1.1
     */
    public function additionalInfoAction()
    {
        $field_arr=array("usr.id,usr.hobbies");
        $user_id = \Auth_UserAdapter::getIdentity()->getId();
        $result=\Extended\ilook_user::getUserInfo($field_arr,$user_id);
        $this->view->additional_info=$result;
    }

    /**
     * function used for edit the particular basic info
     * 
     * @author sunny patial
     * @version 1.0
     * @return json
     */
    public function editAdditionalInfoAction()
    {
    	$field_arr=array("usr.id,usr.hobbies");
    	$user_id = \Auth_UserAdapter::getIdentity()->getId();
        $result=\Extended\ilook_user::getUserInfo($field_arr,$user_id);
    	echo Zend_Json::encode($result);
    	die;
    }

    /**
     * function used for save the basic info
     * 
     * @author sunny patial
     * @version 1.0
     * @return json
     * 
     */
    public function saveAdditionalInfoAction()
    {
    	$params=$this->getRequest()->getParams();
    	$result=\Extended\ilook_user::updateAdditionalInfo(Auth_UserAdapter::getIdentity()->getId(), $params);
    	if($result){
    		$result=array("msg"=>"success");
    	}
    	else{
    		$result=array("msg"=>"error");
    	}
    	echo Zend_Json::encode($result);
    	die;
    }

    /**
     * This function used to display honors and award view information
     * @author Sunny Patial
     * @since 1 Aug, 2013
     * @version 1.0
     */
    public function honoursNAwardsAction()
    {
        $field_arr=array("usr.id,usr.honors_n_awards");
        $user_id = \Auth_UserAdapter::getIdentity()->getId();
        $result=\Extended\ilook_user::getUserInfo($field_arr,$user_id);
        $this->view->honours_awards=$result;
    }

    /**
     * function used for edit the particular honors and awards info
     *
     * @author sunny patial
     * @version 1.0
     * @return json
     *
     */
    public function editHonoursNAwardsAction()
    {
    
    	$field_arr=array("usr.id,usr.honors_n_awards");
    	$user_id = \Auth_UserAdapter::getIdentity()->getId();
    	$result=\Extended\ilook_user::getUserInfo($field_arr,$user_id);
    	echo Zend_Json::encode($result);
    	die;
    }

    /**
     * This function used to display languages
     * @author Sunny Patial
     * @version 1.0
     * 
     */
    public function languagesAction()
    {
        // action body
        $this->view->languages = Extended\user_languages::getAllLanguages( Auth_UserAdapter::getIdentity()->getId() );

    }

    /**
     * function used for save the basic info	
     * @params,$userid
     * @author spatial, rkaur3
     * @version 1.1
     * @return json
     *
     */
    public function saveHonoursNAwardsAction()
    {
    	$params=$this->getRequest()->getParams();
    	$user_id = \Auth_UserAdapter::getIdentity()->getId();
    	$result=\Extended\ilook_user::updateHonoursNAward($params,$user_id);
    	if($result){
    		$result=array("msg"=>"success");
    	}
    	else{
    		$result=array("msg"=>"error");
    	}
    	echo Zend_Json::encode($result);
    	die;
    }

    /**
     * handles ajax call to fetch
     * language of user.
     * @author ?
     */
    public function getMyLanguageAction()
    {
		$rowObj = Extended\user_languages::getRowObject( $this->getRequest()->getParam("lang_id") );
		$mylangArray = array();
		$mylangArray["id"] = $rowObj->getId();
		$mylangArray["name"] = $rowObj->getLanguage();
		$mylangArray["proficiency"] = $rowObj->getProficiency();
		echo Zend_Json::encode($mylangArray);
		die;
    }

    /**
     * Handles ajax call.
     * @author jsingh7
     */
    public function saveMyLanguageAction()
    {
    	
		$params = $this->getRequest()->getParams();
    	$zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
    	
    	$lang_name_filtered = $zend_filter_obj->filter( $params["lang_name"] );
    	
		$temp = array();
		if( @$params['identity'] )
		{
			$id = \Extended\user_languages::addOrEditLanguage( ucfirst( $lang_name_filtered ), $params["lang_proficiency"], Auth_UserAdapter::getIdentity(), $params['identity'] );
			$temp["new_record"] = 0;
		}	
		else
		{	
			$id = \Extended\user_languages::addOrEditLanguage( ucfirst( $lang_name_filtered ), $params["lang_proficiency"], Auth_UserAdapter::getIdentity() );
			$temp["new_record"] = 1;
		}
		
		$temp["id"] = $id;
		$temp["name"] = ucfirst($lang_name_filtered);
		$temp["proficiency"] = $params["lang_proficiency"];
		
		echo Zend_Json::encode( $temp );
		die;
    }
	
    /**
     * function used for remove the particular experience.
     * 
     * @author jsingh7
     * @version 1.0
     * @return json
     */
    public function deleteMyExperienceAction()
    {
		$result = Extended\experience::deleteExperience($this->getRequest()->getParam("id"), Auth_UserAdapter::getIdentity()->getId() );
		if($result)
			echo Zend_Json::encode($result);
		die;
    }

    /**
     * function used for remove the particular language.
     * 
     * @author jsingh7
     * @version 1.0
     * @return json
     */
    public function deleteMyLanguageAction()
    {
		$result=\Extended\user_languages::deleteLanguage($this->getRequest()->getParam("id"), Auth_UserAdapter::getIdentity()->getId() );
		if($result)
			echo Zend_Json::encode($result);
		die;
    }

    public function certificationsAction()
    {
        $result=\Extended\certification::getCertificationInfoList(Auth_UserAdapter::getIdentity()->getId());
        //echo "<pre>";
        //print_r($result);
        //die;
        
        $this->view->certificationInfoList=$result;
    }

    /**
     * Saves certification record
     *
     * @author sunny patial
     * @version 1.0
     * @return json
     *
     */
    public function saveCertificationInfoAction()
    {
    
    	$params=$this->getRequest()->getParams();
    	$result=\Extended\certification::addCertificationInfo(Auth_UserAdapter::getIdentity()->getId(), $params);
    	if($result){
    		$result=array("cert_data"=>$params,"cert_id"=>$result);
    	}
    	else{
    		$result=array("msg"=>"error");
    	}
    	echo Zend_Json::encode($result);
    	die;
    }

    /**
     * function used for get the certification listing
     *
     * @author sunny patial
     * @version 1.0
     * @return json
     *
     */
    public function getCertificationListingAction()
    {
    
    	$id=Auth_UserAdapter::getIdentity()->getId();
    	$result=\Extended\certification::getCertificationInfoList($id,1);
    	echo Zend_Json::encode($result);
    	die;
    }

    /**
     * function used for edit the particular certification
     *
     * @author sunny patial
     * @version 1.0
     * @return json
     */
    public function editCertificationAction()
    {
    	$params=$this->getRequest()->getParams();
    	$result=\Extended\certification::getEditCertificationInfo($params["edit_id"]);
    	echo Zend_Json::encode($result);
    	die;
    }

    /**
     * function used for remove the particular certification
     *
     * @author sunny patial
     * @version 1.0
     * @return json
     */
    public function removeCertificationAction()
    {
    	$user_id=Auth_UserAdapter::getIdentity()->getId();
    	$params=$this->getRequest()->getParams();
    	$result=\Extended\certification::deleteCertificationInfo($params["remove_id"],$user_id);
    	if($result){
    		$result_arr=array("msg"=>$result);
    	}
    	
    	echo Zend_Json::encode($result_arr);
    	die;
    }

    /**
     * function used for update the particular certification
     *
     * @author sunny patial
     * @version 1.0
     * @return json
     */
    public function updateCertificationInfoAction()
    {
    	$params=$this->getRequest()->getParams();
    	$id=Auth_UserAdapter::getIdentity()->getId();
    	$result=\Extended\certification::updateCertificationInfo($params);
    	if($result){
    		$certi_id=$params["certi_id"];
    		$result_arr=\Extended\certification::getEditCertificationInfo($certi_id);
    	}
    	else{
    		$result_arr=array("msg"=>"error");
    	}
    	echo Zend_Json::encode($result_arr);
    	die;
    }

    /**
     * This function get volunteering information
     * @author Sunny Patial
     * @since 1 Aug, 2013
     * @version 1.0
     * 
     */
    public function volunteeringAction()
    {
        // action body
    	$id=Auth_UserAdapter::getIdentity()->getId();
    	$result=\Extended\volunteering_n_causes::getVolunteeringInformation($id);
    	$this->view->volunteeringInfoList=$result;
    }

    /**
     * function used for save the new voluntery record
     * 
     * @author sunny patial
     * @version 1.0
     * @return json
     */
    public function saveVolunInfoAction()
    {
    
    	$params=$this->getRequest()->getParams();
    	$id=Auth_UserAdapter::getIdentity()->getId();
    	$result=\Extended\volunteering_n_causes::addVolunInfo($id, $params);
    	echo Zend_Json::encode($result);
    	die;
    }

    /**
     * function used for get the voluntery listing
     * 
     * @author sunny patial
     * @version 1.0
     * @return json
     */
    public function getVolunteeringListingAction()
    {
    
    	$id=Auth_UserAdapter::getIdentity()->getId();
    	$result=\Extended\volunteering_n_causes::getVolunteeringInformation($id,1);
    	echo Zend_Json::encode($result);
    	die;
    }

    /**
     * function used for edit the particular voluntery
     *
     * @author sunny patial
     * @version 1.0
     * @return json
     */
    public function editVolunteeringAction()
    {
		$params=$this->getRequest()->getParams();
		$edit_id=$params["edit_id"];
		$result=\Extended\volunteering_n_causes::editVolunInfo($edit_id);
		echo Zend_Json::encode($result);
		die;
    }

    /**
     * function used for remove the particular voluntery
     *
     * @author sunny patial
     * @version 1.0
     * @return json
     *
     */
    public function removeVolunteeringAction()
    {
		$params=$this->getRequest()->getParams();
		$edit_id=$params["remove_id"];
		$user_id=Auth_UserAdapter::getIdentity()->getId();
		$result=\Extended\volunteering_n_causes::deleteVolunteerInfo($edit_id,$user_id);
		if($result){
			$result_arr=array("msg"=>$result);
		}
		echo Zend_Json::encode($result_arr);
		die;
    }

    /**
     * function used for update the particular voluntery
     *
     * @author sunny patial
     * @version 1.0
     * @return json
     *
     */
    public function updateVolunteeringInfoAction()
    {
		$params=$this->getRequest()->getParams();
		$result=\Extended\volunteering_n_causes::updateVolunteeringInfo($params);
		echo Zend_Json::encode($result);
		die;
    }

    /**
     * This function used to get personal information
     * @author Sunny Patial
     * @version 1.0
     */
    public function personalInformationAction()
    {
        // action body
    	$em = Zend_Registry::get('em');
    	// get country names list
    	$em = Zend_Registry::get('em');
    	// get country name as compare to country id
    	$userid=Auth_UserAdapter::getIdentity()->getId();
    	$userinfo=\Extended\ilook_user::getPersonalInformation($userid);
    	$this->view->personalInfo=$userinfo[0];
    }

    /**
     * function used for edit the particular personal information
     * 
     * @author sunny patial
     * @version 1.0
     * @return json
     * 
     */
    public function editPersonalInfoAction()
    {
    	 
    	$em = Zend_Registry::get('em');
    	// get country name as compare to country id
    	$userid=Auth_UserAdapter::getIdentity()->getId();
    	$userinfo=\Extended\ilook_user::getPersonalInformation($userid);
    	$userinfo=$userinfo[0];
    	echo Zend_Json::encode($userinfo);
    	die;
    }

    /**
     * function used for save the personal information
     * 
     * @author sunny patial
     * @version 1.0
     * @return json
     * 
     */
    public function savePersonalInfoAction()
    {
    	
    	$params=$this->getRequest()->getParams();
    
    	
    	$id=Auth_UserAdapter::getIdentity()->getId();
    	$result=\Extended\ilook_user::updatePersonalInfo($id, $params);
    	if($result){
    		$result=array("msg"=>"success");
    	}
    	else{
    		$result=array("msg"=>"error");
    	}
    	echo Zend_Json::encode($result);
    	die;
    }

    /**
     * action associated with view.
     * 
     * @author jsingh7
     */
    public function publicationsAction()
    {
        // action body
    	$this->view->mypublications = Extended\publication::getAllPublications( Auth_UserAdapter::getIdentity()->getId() );
    }

    /**
     * saves the projects added by user
     * handles it with ajax call
     *
     * @author RSHARMA
     */
    public function projectsAction()
    {
        // action body
    	$this->view->myProj = Extended\project::getAllProjects( Auth_UserAdapter::getIdentity()->getId() );
    	 
    }

    /**
     * Handles ajax call for adding a project.
     * @author RSHARMA
     *
     */
    public function saveMyProjectAction()
    {
    	$params = $this->getRequest()->getParams();
    	$temp = array();
    	$temp["project_name"] = $params["project_name"];
    	$temp["occupation"] = $params["occupation"];
    	$temp["from_date"] = $params["from_date"];
    	$temp["to_date"] = $params["to_date"];    	
    	$temp["project_url"] = $params["project_url"];
    	$temp["user_id"] = Auth_UserAdapter::getIdentity()->getId();
    	$temp["project_desc"] = $params["project_desc"];
    	$id = 0;
    	
    	
    	$days = intVal( DateTime::createFromFormat( "d-m-Y H:i:s", $params ['from_date']." 00:00:00" )->diff( DateTime::createFromFormat("d-m-Y H:i:s", $params['to_date']." 00:00:00" ) )->d );
    	$months = intVal( DateTime::createFromFormat( "d-m-Y H:i:s", $params['from_date']." 00:00:00" )->diff( DateTime::createFromFormat("d-m-Y H:i:s", $params['to_date']." 00:00:00" ) )->m );
    	$years = intVal( DateTime::createFromFormat( "d-m-Y H:i:s", $params['from_date']." 00:00:00" )->diff( DateTime::createFromFormat("d-m-Y H:i:s", $params['to_date']." 00:00:00" ) )->y );
    	// for years, months and days
    	if($months == 0 && $years == 0 && $days >= 1)
    	$diff = $days. ' day(s)';
    	elseif($months == 0 && $years >= 1 && $days == 0)
    	$diff = $years.' year(s)';
    	elseif($months == 0 && $years >= 1 && $days >= 1)
    	$diff = $years.' year(s) '. $days.' day(s)';
    	elseif($months >= 1 && $years == 0 && $days == 0)
    	$diff = $months.' month(s)';
    	elseif($months >= 1 && $years == 0 && $days >= 1)
    	$diff = $months.' month(s) '.$days.' day(s)';
    	elseif($months >= 1 && $years >= 1 && $days == 0)
    	$diff = $years. ' year(s) '.$months.' month(s) ';
    	elseif($months >= 1 && $years >= 1 && $days >= 1)
    	$diff = $years.' year(s) '.$months.' month(s) '.$days.' day(s)';
    	else
    	{
    		$diff = $years.' year(s) '.$months.' month(s) ';
    	}
    	
    	$temp["date_diff"] = $diff;
    	
    	if( !$params['identity'] )
    	{
    		$temp["new_record"] = 1;
    		$id = Extended\project::addOrEditProject($temp);
    	}
    	else
    	{
    		$temp["new_record"] = 0;
    		$id = Extended\project::addOrEditProject($temp, $params['identity']);
    	}
    	
    	if( $id )
    	{
    		$temp["id"] = $id;
    		echo Zend_Json::encode( $temp );
    	}
    	else
    	{
    		echo Zend_Json::encode( $temp );
    	}
    	die;
    	
    }

    /**
     * Handles ajax call for getting a project.
     * @author RSHARMA
     */
    public function getMyProjectsAction()
    {
    	$rowObj = Extended\project::getRowObject( $this->getRequest()->getParam("proj_id") );
    	$myProjArray = array();
    	$myProjArray["id"] = $rowObj->getId();
    	$myProjArray["project_name"] = $rowObj->getName();
    	$myProjArray["occupation"] = $rowObj->getOccupation();
    	$myProjArray["from_date"] = $rowObj->getFrom_datee()->format('d-m-Y');
    	$myProjArray["to_date"] = $rowObj->getTo_datee()->format('d-m-Y');
    	$myProjArray["project_url"] = $rowObj->geturl();
    	$myProjArray["project_desc"] = $rowObj->getDescprition();
    	echo Zend_Json::encode($myProjArray);
    	die;
    }

    /**
     * handles ajax call to save publication,
     * echo json data to ajax call accordingly
     * if update or add.
     *
     * @author jsingh7
     * @version 1.0
     * @return json
     */
    public function saveMyPublicationAction()
    {
    	$params = $this->getRequest()->getParams();
    	$temp = array();
    	$temp["title"] = $params["title"];
    	$temp["publication_or_publisher"] = $params["publication_or_publisher"];
    	$temp["publication_date"] = $params["publication_date"];
    	$temp["publication_url"] = $params["publication_url"];
    	$temp["author"] = $params["author"];
    	$temp["activities_n_socities"] = $params["activities_n_socities"];
    	$temp["ilook_user"] = Auth_UserAdapter::getIdentity();
    	
    	$id = 0;
    	if( !$params['identity'] )
    	{
    		$temp["new_record"] = 1;
    		$id = Extended\publication::addOrEdit($temp);
    	}
    	else
    	{
    		$temp["new_record"] = 0;
    		$id = Extended\publication::addOrEdit($temp, $params['identity']);
    	}
    	
    	if( $id )
    	{
    		$temp["id"] = $id;
    		echo Zend_Json::encode( $temp );
    	}
    	else
    	{
    		echo Zend_Json::encode( $temp );
    	}
    	die;
    }

    /**
     * Removes the particular project.
     *
     * @author RSHARMA
     * @version 1.0
     * @return json
     *
     */
    public function deleteMyProjectAction()
    {
    	$result = Extended\project::deleteProject( $this->getRequest()->getParam("id"), Auth_UserAdapter::getIdentity()->getId() );
    	if($result)
    		echo Zend_Json::encode($result);
    	die;
    }

    /**
     * Handles ajax call to get logged in user's publications
     * using posted publication id.
     * 
     * @author jsingh7
     */
    public function getMyPublicationAction()
    {
    	$rowObj = Extended\publication::getRowObject( $this->getRequest()->getParam("pub_id") );
    	$myExpsArray = array();
    	$myExpsArray["id"] = $rowObj->getId();
    	$myExpsArray["title"] = $rowObj->getTitle();
    	$myExpsArray["publisher"] = $rowObj->getPublisher();
    	$myExpsArray["datee"] = $rowObj->getPublish_date()->format('d-m-Y');
    	$myExpsArray["url"] = $rowObj->getUrl();
    	$myExpsArray["author"] = $rowObj->getAuthor();
    	$myExpsArray["activities"] = $rowObj->getActivites_and_socities();
    	echo Zend_Json::encode($myExpsArray);
    	die;
    }

    /**
     * function used for remove the particular publication.
     *
     * @author jsingh7
     * @version 1.0
     * @return json
     */
    public function deleteMyPublicationAction()
    {
    	$result = Extended\publication::deletePublication($this->getRequest()->getParam("id"), Auth_UserAdapter::getIdentity()->getId() );
    	if($result)
    		echo Zend_Json::encode($result);
    	die;
    }

    /**
     * Used to display profile contents.
     * 
     * @author spatial
     * @author sjaiswal
     * @author jsingh7
     * @version 1.0
     * @return json
     *
     */
    public function iprofileAction()
    {
    	
    	$params=$this->getRequest()->getParams();
    	
    	if( $params['username'] )
    	{
    		if( \Extended\ilook_user::getObjectWithUsername( $params['username'] ) )
    		{
    			$params['id'] = \Extended\ilook_user::getObjectWithUsername( $params['username'] )->getId();
    		}
    		else
    		{
    			$this->_helper->redirector( "is-not-available", "error", 'default', array('message'=>'Oops! this profile does not exist.') );
    		}
    	}
    	else if($params['id'])
    	{
    		
    		$user_obj = \Extended\ilook_user::getRowObject($params['id']);
    		
    		//This redirection is applied so that if url is like
    		// ilook/profile/iprofile/id/1 then also it will convert it to 
    		// ilook/username and then routing will work on it.
    		if($user_obj)
    		{
    			$user_name = $user_obj->getUsername();
    			$this->_redirect(PROJECT_URL."/".PROJECT_NAME.$user_name);
    		}
    		else
    		{
    			$this->_helper->redirector( "is-not-available", "error", 'default', array('message'=>'Oops! this profile does not exist.') );
    		}
    		
    		//Do nothing.
    	}
    	else
    	{
    		$this->_helper->redirector( "is-not-available", "error" );
    	}	
    	
    	$this->public_view = false;
    	
    	//Getting object of user.
    	if( $params['id'] )//profile owner user ID
    	{
    		$this->view->userId = $params['id'];
    		
    		$userObj = Extended\ilook_user::getRowObject( $params['id'] );
    		if( !$userObj )
    		{
    			$this->_helper->redirector( "is-not-available", "error", "default", array( 'message'=>'This profile does not exist.' ) );
    		}
    		if( $userObj->getVerified() == 0 )
    		{
    			$this->_forward( "is-not-available", "error", "default", array( 'message'=>'This profile is not active.' ) );
    		}	
    	}
    	else
    	{
    		$this->_forward( "is-not-available", "error" );
    		return;
    	}
    	
    	//If user is not logged in.
    	if( !Auth_UserAdapter::hasIdentity() )
    	{
    		$this->view->public_view = true;
    		
    			//Check if profile owner user_id is in list of blocked users by me.==========
    			$is_profile_visible = 1;
    			 if($userObj)
    			 {
	    			// Checking if user account is closed =========================================
	    			$user_account_closed = $userObj->getAccount_closed_on();
	    			if(is_object($user_account_closed))
	    			{
	    				$is_profile_visible = 0;
	    			}
	    			//==============================================================================
	    			 
	    			if( ! $userObj )
	    			{
	    				$this->_forward( "is-not-available", "error", null, array( "message"=> "The profile you are looking for has been removed.") );
	    				return;
	    			}
	    			else if( ! $is_profile_visible )
	    			{
	    				$this->_forward( "is-not-available", "error",  null, array( "message"=> "This profile you are looking for is not visible to you.") );
	    				return;
	    			}
	    		
	    			$this->view->user_obj = $userObj;
	    			$id = $params['id'];
	    			$this->view->profileId = $id;
	    		
	    			// Get Education information list....
	    			$result=\Extended\education_detail::getEduInfoList($id);
	    			$this->view->eduInfoList=$result;
	    			 
	    			// Get User profile Information
	    			$userinfo=\Extended\ilook_user::getUserInformation($id);
	    			$this->view->personalInfo = $userinfo[0];
	    		
	    			// Get User experiences....
	    			$this->view->myExps = Extended\experience::getAllExperiences( $id );
	    		
	    			// Get User Country and Industry titles.
	    			$em = Zend_Registry::get('em');
	    		
	    			
	    			// get country name as compare to country id
	    			$country_id = $em->getUnitOfWork()->getEntityIdentifier($userObj->getUsersCountry());
	    		
	    			
	    			// get industry title as compare to industry id
	    			$industry_id = @$em->getUnitOfWork()->getEntityIdentifier($userObj->getUsersIndustry());
	    			if($industry_id)
	    			{
	    				$industry = $em->find('\Entities\industry_ref',$industry_id["id"]);
	    				$this->view->industry_title=$industry->getTitle();
	    			}
	    			else
	    			{
	    				$this->view->industry_title="";
	    			}
	    			
	    			
	    			
	    			// get all languages of the login user.
	    			$this->view->languages = Extended\user_languages::getAllLanguages( $id );
	    			// get all skills of the login users..
	    			$this->view->skillInfoList=\Extended\user_skills::getSkillInfoList($params['id']);
	    		
	    			
	    			
	    			
	    			if( $userObj->getGender() == \Extended\ilook_user::USER_GENDER_MALE)
	    			{
	    				$this->view->him_or_her = 'him';
	    			}
	    			else if( $userObj->getGender() == \Extended\ilook_user::USER_GENDER_FEMALE)
	    			{
	    				$this->view->him_or_her = 'her';
	    			}
	    			else
	    			{
	    				$this->view->him_or_her = 'him';
	    			}
	    			
	    			
	    			
	    			if( $userObj->getCoverPhoto()
	    					&& file_exists(REL_IMAGE_PATH.'\\cover_photo\\user_'.$id.'\\'.$userObj->getCoverPhoto()->getName()))
	    			{
	    				$this->view->profile_hldr_cvr_photo = IMAGE_PATH.'/cover_photo/user_'.$id.'/'.$userObj->getCoverPhoto()->getName();
	    				$this->view->profile_hldr_cvr_photo_name = $userObj->getCoverPhoto()->getName();
	    				 
	    				// Here we are calculating that if top postion of cover photo for width of 202px(my-iprofile) is 'x' then top for width 283px(iprofile-logout) will be (283*x/202).
	    				$this->view->profile_hldr_cvr_photo_y_position = (283*$userObj->getCoverPhoto()->getY_position())/251;
	    			}
	    			else if( !$userObj->getCoverPhoto() && $userObj->getGender() == \Extended\ilook_user::USER_GENDER_FEMALE)
	    			{
	    				$this->view->profile_hldr_cvr_photo = IMAGE_PATH.'/cover-female-default.png';
	    		
	    			}
	    			else if( !$userObj->getCoverPhoto() && $userObj->getGender() == \Extended\ilook_user::USER_GENDER_MALE)
	    			{
	    				$this->view->profile_hldr_cvr_photo = IMAGE_PATH.'/cover-male-default.png';
	    		
	    			}
	    			else
	    			{
	    				$this->view->profile_hldr_cvr_photo = IMAGE_PATH.'/cover-male-default.png';
	    			}
    				
    			}
    			else
    			{
    				$this->_forward( "is-not-available", "error" );
    				return;
    			}
    		
    	}
    	else 
    	{
	    	$my_id = Auth_UserAdapter::getIdentity()->getId();
		    		
	    		if( $userObj )
	    		{	
		    		
		    		//Check if profile owner user_id is in list of blocked users by me.==========
		    		$is_profile_visible = 1;
		    		if( \Extended\blocked_users::checkIfBlocked( $my_id, $params['id'] ) )
		    		{
		    			$is_profile_visible = 0;
		    		}
		    		//Check if profile owner user_id has blocked me.
		    		if( \Extended\blocked_users::checkIfBlocked( $params['id'], $my_id ) )
		    		{
		    			$is_profile_visible = 0;
		    		}
		    		//=============================================================================
		    		
		    		// Checking if user account is closed =========================================
		    		$user_account_closed = $userObj->getAccount_closed_on(); 
		    		if(is_object($user_account_closed))
		    		{
		    			$is_profile_visible = 0;
		    		}
		    		//==============================================================================
		    		
		    		if( ! $userObj )
		    		{
		    			$this->_forward( "is-not-available", "error", null, array( "message"=> "The profile you are looking for has been removed.") );
		    			return;
		    		}
		    		else if( ! $is_profile_visible )
		    		{
		    			$this->_forward( "is-not-available", "error",  null, array( "message"=> "This profile you are looking for is not visible to you.") );
		    			return;
		    		}
		    		else
		    		{
		    			if( $params['id'] != $my_id )
		    			{
		    				
		    				// check privacy view profile settings
		    				$privacy_view_profile_setting_about_user = \Extended\privacy_settings::checkPrivacyViewProfileSettings($my_id);
		    				$privacy_view_profile_setting_for_user = \Extended\privacy_settings::checkPrivacyViewProfileSettings($params['id']);
		    				
		    				// check if both users show profile settings are true
		    				if($privacy_view_profile_setting_about_user == true && $privacy_view_profile_setting_for_user == true )
		    				{
			    				//Don't call this method if "admin logged as user".
			    				if( !Zend_Registry::get('admin_logged_in_as_user') )
			    				{	
			    					\Extended\who_viewed_profiles::insertProfileViewedDateTime($my_id, $userObj->getId());
			    				}
		    				}
		    			}
		    			else
		    			{
		    				$this->_helper->redirector('my-iprofile', 'profile');
		    			}
		
		    			$this->view->friendRequestState=\Extended\link_requests::getFriendRequestState($userObj->getId());    			
		    		}
		    	
		    	
			    	$this->view->user_obj = $userObj;
			        $id = $params['id'];
			        $this->view->username = $userObj->getUsername();
			        $this->view->profileId = $id;
			        $this->view->current_user_id = $my_id;
			        
			        // Get Education information list....
			        $result=\Extended\education_detail::getEduInfoList($id);
			       	$this->view->eduInfoList=$result;
			     
			       	// Get User profile Information
			       	$userinfo=\Extended\ilook_user::getUserInformation($id);
			       	$this->view->personalInfo = $userinfo[0];
			       	
			       	// Get User experiences....
			       	$this->view->myExps = Extended\experience::getAllExperiences( $id );
			       	
			       	// Get User Country and Industry titles.
			       	$em = Zend_Registry::get('em');
			       	
			       	// get country name as compare to country id
			       	$country_id = $em->getUnitOfWork()->getEntityIdentifier($userObj->getUsersCountry());
			       	
			       	// get industry title as compare to industry id
			       	$industry_id = @$em->getUnitOfWork()->getEntityIdentifier($userObj->getUsersIndustry());
					if($industry_id)
					{
						$industry = $em->find('\Entities\industry_ref',$industry_id["id"]);
						$this->view->industry_title=$industry->getTitle();
					}
					else
					{
						$this->view->industry_title="";
					}
					// get all languages of the login user.
			       	$this->view->languages = Extended\user_languages::getAllLanguages( $id );
			       	// get all skills of the login users..
			       	$this->view->skillInfoList=\Extended\user_skills::getSkillInfoList($params['id']);
			       	// get bookmark status..
			       	$this->view->bookmark_status = \Extended\bookmark_profile::getBookmarkStatus($my_id, $id);
					
			       	if( $userObj->getGender() == \Extended\ilook_user::USER_GENDER_MALE)
			       	{
			       		$this->view->him_or_her = 'him';
			       	}
			       	else if( $userObj->getGender() == \Extended\ilook_user::USER_GENDER_FEMALE)
			       	{
			       		$this->view->him_or_her = 'her';
			       	}
			       	else 
			       	{
			       		$this->view->him_or_her = 'him';
			       	}
			       	//get user received refernces 
			        $reference_received = Extended\reference_request::getAllReceivedReferenceForProfile( $id );
			        $this->view->reference_received = $reference_received;
			        //get user received feedbacks with visibility is set to 1
			        $this->view->reference_received_visible= Extended\reference_request::getVisibleReceivedReference( $id,'desc', \Extended\feedback_requests::VISIBILITY_CRITERIA_DISPLAYED, \Extended\feedback_requests:: IS_ACCEPTED_YES, Auth_UserAdapter::getIdentity()->getId() );
			        //get user received feedback 
			        $this->view->feedback_received= Extended\feedback_requests::getAllReceivedFeedbackForProfile( $id);
			        //get user received feedbacks with visibility is set to 1
			        $this->view->feedback_received_visible= Extended\feedback_requests::getVisibleReceivedFeedback( $id,'desc', \Extended\feedback_requests::VISIBILITY_CRITERIA_DISPLAYED, \Extended\feedback_requests:: IS_ACCEPTED_YES, Auth_UserAdapter::getIdentity()->getId() );
			
			        $this->view->usersblockedNBlocked_by = \Extended\blocked_users::getAllBlockersAndBlockedUsers($my_id);
					if( $userObj->getCoverPhoto() 
					&& file_exists(REL_IMAGE_PATH.'\\cover_photo\\user_'.$id.'\\'.$userObj->getCoverPhoto()->getName()))
			        {
			        	$this->view->profile_hldr_cvr_photo = IMAGE_PATH.'/cover_photo/user_'.$id.'/'.$userObj->getCoverPhoto()->getName();
			        	$this->view->profile_hldr_cvr_photo_name = $userObj->getCoverPhoto()->getName();
			        	
			        	// Here we are calculating that if top postion of for width of 202px(my-iprofile) is 'x' then top for width 267px(iprofile) will be (267*x/202).
			        	$this->view->profile_hldr_cvr_photo_y_position = (267*$userObj->getCoverPhoto()->getY_position())/251;
			        }
					else if( !$userObj->getCoverPhoto() && $userObj->getGender() == \Extended\ilook_user::USER_GENDER_FEMALE)
					{
						$this->view->profile_hldr_cvr_photo = IMAGE_PATH.'/cover-female-default.png';
					
					}
					else if( !$userObj->getCoverPhoto() && $userObj->getGender() == \Extended\ilook_user::USER_GENDER_MALE)
					{
						$this->view->profile_hldr_cvr_photo = IMAGE_PATH.'/cover-male-default.png';
					
					}
					else
					{
						$this->view->profile_hldr_cvr_photo = IMAGE_PATH.'/cover-male-default.png';
					}
						
		       		//Notification logic start.
		       		$aboutUserId = $my_id;
		       		$forUserId = $params['id'];
		       		$text = 'viewed your Profile';
		       		$notificationType = 2;
		       		
		       		// check privacy view profile settings
		       		$privacy_view_profile_setting_about_user = \Extended\privacy_settings::checkPrivacyViewProfileSettings($aboutUserId);
		       		$privacy_view_profile_setting_for_user = \Extended\privacy_settings::checkPrivacyViewProfileSettings($forUserId);

		       		//already viewed profile by about_user and not read by for_user
		       		$notification_already_exist_id = Extended\notifications::getExistingUnseenNotificationId( $forUserId, $aboutUserId, $notificationType, 0 );
		       		
		       		// check general notification settings
		       		$general_notification_setting = \Extended\notifications::checkGeneralNotifications($forUserId);
			       		
			       		// send notification only if there are default settings or settings to true
		       		if($general_notification_setting=='default' || $general_notification_setting==true)
		       		{
		       			// check if both users show profile settings are true
						if($privacy_view_profile_setting_about_user == true && $privacy_view_profile_setting_for_user == true )
						{ 
				       		//If same notification already exist then only update time of existing record.
				       		if( $notification_already_exist_id )
				       		{
				       			\Extended\notifications::updateNotificationTime($notification_already_exist_id);
				       		}
				       		//else if notification is not already existing then add new record.
				       		else
				       		{
					       		// insert record into notifications table
					       		\Extended\notifications::addNewNotification($aboutUserId, $forUserId, $text, $notificationType, 0);
				       		}
					     } 
			       		 
		       		}
			       		//Notification logic end.
			       		
		       		if(\Extended\notes::getNote($my_id,$params['id'])!="")
		       		{
		       			// get note regarding particular user.
		       			$this->view->userNote=\Extended\notes::getNote($my_id,$id);      
		       			
		       		}
		       		else
		       		{
		       			$this->view->userNote="";
		       		}
    			}
		    	else
		    	{
		    		$this->_forward( "is-not-available", "error" );
		    		return;
		    	}
    	}
    }
    
    /**
     * Display logged in user's profile contents.
     * @author hkaur5
     * @version 1.0
     * @return json
     */
    public function myIprofileAction()
    {
    	$userObj = Auth_UserAdapter::getIdentity();
    	 $current_user_id = $userObj->getId();
        $this->view->userId = $current_user_id;
        $this->view->user_obj=$userObj;
        $this->view->profileId=$current_user_id;
        $this->view->current_user_id = $current_user_id;
        // Get Education information list....
        $result=\Extended\education_detail::getEduInfoList($current_user_id);
       	$this->view->eduInfoList=$result;
       
       	// Get User profile Information
       	$userinfo=\Extended\ilook_user::getUserInformation($current_user_id);
       	$this->view->personalInfo = $userinfo[0];
       	
       	// Get User experiences....
       	$this->view->myExps = Extended\experience::getAllExperiences( $current_user_id );
       
       	
       	// Get User Country and Industry titles.
       	$em = Zend_Registry::get('em');
       	// get country name as compare to country id
       	$country_id = $em->getUnitOfWork()->getEntityIdentifier($userObj->getUsersCountry());
       	
       	// get industry title as compare to industry id
       	$industry_id = @$em->getUnitOfWork()->getEntityIdentifier($userObj->getUsersIndustry());
		if($industry_id)
		{
			$industry = $em->find('\Entities\industry_ref',$industry_id["id"]);
			$this->view->industry_title=$industry->getTitle();
		}
		else
		{
			$this->view->industry_title="";
		}
		
		// get all languages of the login user.
       	$this->view->languages = Extended\user_languages::getAllLanguages( $current_user_id );
       	$this->view->skillInfoList=\Extended\user_skills::getSkillInfoList($current_user_id );
       	// get bookmark status..
       	$this->view->bookmark_status = \Extended\bookmark_profile::getBookmarkStatus($current_user_id, $current_user_id);
		//get user received refernces 
        $reference_received = Extended\reference_request::getAllReceivedReferenceForProfile( $current_user_id );
        if($reference_received)
        {
      	  	$this->view->reference_received = $reference_received;
        }
        // User's cover photo
		if($userObj->getCoverPhoto())
		{
        	$this->view->my_cover_photo = IMAGE_PATH.'/cover_photo/user_'.$current_user_id.'/'.$userObj->getCoverPhoto()->getName();
        	$this->view->my_cover_photo_name = $userObj->getCoverPhoto()->getName();
        	$this->view->my_cover_photo_y_position = $userObj->getCoverPhoto()->getY_position();
		}
		else if( !$userObj->getCoverPhoto() && $userObj->getGender() == \Extended\ilook_user::USER_GENDER_FEMALE)
		{
			$this->view->default_cover_photo = IMAGE_PATH.'/cover-female-default.png';
		
		}
		else if( !$userObj->getCoverPhoto() && $userObj->getGender() == \Extended\ilook_user::USER_GENDER_MALE)
		{
			$this->view->default_cover_photo = IMAGE_PATH.'/cover-male-default.png';
		
		}
		else
		{
			$this->view->default_cover_photo = IMAGE_PATH.'/cover-male-default.png';
		}
        //get user received feedbacks with visibility is set to 1
        $this->view->reference_received_visible= Extended\reference_request::getVisibleReceivedReference( $current_user_id,'desc', \Extended\feedback_requests::VISIBILITY_CRITERIA_DISPLAYED, \Extended\feedback_requests:: IS_ACCEPTED_YES );
        //get user received feedback 
        $this->view->feedback_received= Extended\feedback_requests::getAllReceivedFeedbackForProfile( $current_user_id);
        //get user received feedbacks with visibility is set to 1
        $this->view->feedback_received_visible= Extended\feedback_requests::getVisibleReceivedFeedback( $current_user_id,'desc', \Extended\feedback_requests::VISIBILITY_CRITERIA_DISPLAYED, \Extended\feedback_requests:: IS_ACCEPTED_YES );
 		
        
       	$this->view->usersblockedNBlocked_by = \Extended\blocked_users::getAllBlockersAndBlockedUsers($current_user_id);
       	
    }

    /**
     * function used for Upload profile image.
     * @author sunny patial
     * @version 1.0
     * @return json
     * 
     * @deprecated since last few releases.
     * 
     */
/*    public function uploadProfileImgAction()
    {
    	// Valid formats.....
    	$valid_formats = Zend_Registry::get('config')->image->extensions->toArray();
    	// define size of the image 2MB maximum 1024*1024....
    	$limit_size=2097152;
    	
    	$name = @$_FILES['Filedata']['name'];
    	$size = @$_FILES['Filedata']['size'];
    	if(strlen($name))
    	{
    		list($txt, $ext) = explode(".", $name);
    		$ext=pathinfo($name,PATHINFO_EXTENSION);
    		if(in_array($ext,$valid_formats))
    		{
    			if($size<$limit_size)
    			{
    				// echo "now its better size....";
    				// Set the upload folder path
    				$target_path = "images/profile/";
    				// Set temp path of the image....
    				$temp_path=$_FILES['Filedata']['tmp_name'];
    				// Set the file name
    				$image_name = $txt."_".time().".".$ext;
    				// Set upload image path
    				$image_upload_path = $target_path.$image_name;
    				
    				if(move_uploaded_file($temp_path,$image_upload_path)) {
    					// Set 131*131 thumbnail...
    					// Set thumbnail directory...
    					$thumbnail_directory=$target_path."big_thumbnails/";
    					// Set thumbnail name...
    					$thumb_name=$thumbnail_directory.'thumbnail_'.$image_name;
    					// Set width and height of the thumbnail...
    					$thumb_width=131;
    					$thumb_height=131;
    					$thumb=Helper_common::generateThumbnail($image_upload_path, $thumb_name, $thumb_width, $thumb_height);
    					if($thumb){
    						$profile_thumb=$thumb;
    						// Set 83*83 thumbnail...
    						// Set thumbnail directory....
    						$thumbnail_directory=$target_path."medium_thumbnails/";
    						// Set thumbnail name....
    						$thumb_name=$thumbnail_directory.'thumbnail_'.$image_name;
    						$thumb_width=83;
    						$thumb_height=83;
    						$thumb=Helper_common::generateThumbnail($image_upload_path, $thumb_name, $thumb_width, $thumb_height);
    						if($thumb){
    							// Set 50*50 thumbnail...
	    						// Set thumbnail directory....
	    						$thumbnail_directory=$target_path."small_thumbnails/";
	    						// Set thumbnail name....
	    						$thumb_name=$thumbnail_directory.'thumbnail_'.$image_name;
	    						$thumb_width=50;
	    						$thumb_height=50;
	    						$thumb=Helper_common::generateThumbnail($image_upload_path, $thumb_name, $thumb_width, $thumb_height);
	    						if($thumb){
	    							
	    							$user_id=Auth_UserAdapter::getIdentity()->getId();
	    							$result=Extended\ilook_user::updateProfileImageName($image_name, $user_id);
	    							if($result){
	    								unlink($image_upload_path);
	    								echo $profile_thumb;
	    							}
	    							else{
	    								// echo "Some server problems occured";
	    								echo "4";
	    							}
    							}   
    						}    						
    					}
    					
    					
    				} 
    				else{
    					// echo "Due to some server error we can't upload your image...";
    					echo "3";
    				}
    			}
    			else{
    				// echo "Upload less than 2mb image size...";
    				echo "2";
    			}
    		}
    		else{
    			// echo "invalid Image....";
    			echo "1";
    		}
    	}
    	else{
    		// echo "invalid image....";
    		echo "1";
    	}
    	die;	    	
    }
    */

    /**
     * function used for Upload profile image
     * @author sunny patial
     * @author jsingh7(Moderator)
     * @version 1.0
     * @return json
     */
    public function uploadCropImgAction()
    {
    	$params = $this->getRequest()->getParams();
    	
    	$user_id = Auth_UserAdapter::getIdentity()->getId();
    	
    	if( !file_exists(REL_IMAGE_PATH.'/profile/temp_croping_images/display_to_crop_thumbnails/user_'.$user_id ) )
    	{
    		mkdir( REL_IMAGE_PATH.'/profile/temp_croping_images/display_to_crop_thumbnails/user_'.$user_id, 0777, true );
    	}
    	if( !file_exists(REL_IMAGE_PATH.'/profile/temp_croping_images/original_copy/user_'.$user_id ) )
    	{
    		mkdir( REL_IMAGE_PATH.'/profile/temp_croping_images/original_copy/user_'.$user_id, 0777, true );
    	}
    	if( !file_exists(REL_IMAGE_PATH.'/profile/temp_croping_images/cropped_thumbnails/user_'.$user_id ) )
    	{
    		mkdir( REL_IMAGE_PATH.'/profile/temp_croping_images/cropped_thumbnails/user_'.$user_id, 0777, true );
    	}
    	
    	if($params['act'] == 'thumb'){
    	
    		$arr = array(
    				'uploaddir' 	=> REL_IMAGE_PATH.'/profile/temp_croping_images/cropped_thumbnails/user_'.$user_id.'/',
    				'tempdir'		=> "public/".REL_IMAGE_PATH.'/profile/temp_croping_images/temp/',
    				'height'		=> $_POST['height'],
    				'width'			=> $_POST['width'],
    				'x'				=> $_POST['x'],
    				'y'				=> $_POST['y'],
    				'img_src'		=> $_POST['img_src'],
    				'thumb'			=> true
    		);
    		$assido= new Asido_Func();
    		$assido->resizeThumb($arr);
    		
    		exit;
    	}
    	elseif($params['act'] == 'upload'){
    		
    		/*
    		 Array
			(
			    [controller] => profile
			    [action] => upload-crop-img
			    [act] => upload
			    [module] => default
			    [height] => 450
			    [width] => 450
			    [chkFrm] => upload_big
			    [progress_id] => 1427266392330
			)
    		 */
    		
    		$big_arr = array(
    				'uploaddir'	=> REL_IMAGE_PATH.'/profile/temp_croping_images/display_to_crop_thumbnails/user_'.Auth_UserAdapter::getIdentity()->getId().'/',
    				'tempdir'	=> REL_IMAGE_PATH.'/profile/temp_croping_images/original_copy/user_'.Auth_UserAdapter::getIdentity()->getId().'/',
    				'height'	=> $_POST['height'],
    				'width'		=> $_POST['width'],
    				'x'			=> 0,
    				'y'			=> 0
    		);
    			
    	$assido= new Asido_Func();
    	$image_name = $assido->resizeImg($big_arr);
    	
    		// resizeImg($big_arr);
    	}
    	else
    	{
    		//
    	}
    	
    	die;
    }
    
	/**
	 * Uploads profile image.
	 * Make the different sizes of photos 
	 * for both ALBUMS IMAGES and PROFILE IMAGES
	 * and perserve it in respective folders for profile and albums both.
	 * 
	 * @see /ilook/docs/README.txt for folders information
	 * 
	 * @author Sunny Patial
	 * @author jsingh7 (Moderator)
	 * <samp>
	 * Much improvement has been done.
	 * logic, bugs fixing etc.
	 * </samp>
	 * @version 1.1
	 * 
	 */
    public function setProfileImageAction()
    {
   		/*parameters we are receiving are------------------------------------
   		img_unique_name  = for example 9622bea537f76c1f7f50187ddb1d0d34.png
   		type = crop (always) as we do not have without crop now.
   		--------------------------------------------------------------------*/
   		
    	$params = $this->getRequest()->getParams();
    	
    	// This is the root path where we have all the profie photos of required sizes.
    	$profile_photo_path = REL_IMAGE_PATH."/profile/";
    	
    	$img_unique_name = $params["img_unique_name"];
    	
//     	if( $params["type"] == "crop" )
//     	{
    		$image_upload_path = $profile_photo_path."temp_croping_images/cropped_thumbnails/user_".Auth_UserAdapter::getIdentity()->getId()."/".$img_unique_name;
//     		echo $params["img_unique_name"];
//     		die;
//     	}
//     	else
//     	{
//     		// set uploaded path for the original images....   
//     		$image_upload_path=$profile_photo_path.$params["img_unique_name"];
//     	}
    	
    	// upload and Set 800*800px thumbnail.
    	$thumbnail_directory 	= $profile_photo_path."popup_thumbnails/";
    	$cropThumb_name			= $thumbnail_directory.'thumbnail_'.$params["img_unique_name"];
    	
    	if(file_exists($image_upload_path))
    	{
	    	$thumb = Helper_common::generateThumbnail($image_upload_path, $cropThumb_name, 800, 800);
	    	if($thumb)
	    	{
		    	// Upload and Set 131*131px thumbnail.
		    	$thumbnail_directory = $profile_photo_path."big_thumbnails/";
		    	$bigThumb_name		 = $thumbnail_directory.'thumbnail_'.$params["img_unique_name"];
		    	
		    	$thumb = Helper_common::generateThumbnail($image_upload_path, $bigThumb_name, 131, 131);
		    	if($thumb)
		    	{
		    		$profile_thumb = $thumb;
		    		// Upload and Set 83*83px thumbnail.
		    		$thumbnail_directory = $profile_photo_path."medium_thumbnails/";
		    		$mediumThumb_name	 = $thumbnail_directory.'thumbnail_'.$params["img_unique_name"];
		    		$thumb				 = Helper_common::generateThumbnail($image_upload_path, $mediumThumb_name, 83, 83);
		    		if($thumb){
		    			// Upload and Set 50*50px thumbnail.
		    			$thumbnail_directory=$profile_photo_path."small_thumbnails/";
		    			$smallThumb_name=$thumbnail_directory.'thumbnail_'.$params["img_unique_name"];
		    			$thumb=Helper_common::generateThumbnail($image_upload_path, $smallThumb_name, 50, 50);
		    			if($thumb)
		    			{
		    				if($params["type"] == "crop"){
			    				// copy the cropped image into the profile directory.
			    				copy($image_upload_path,$profile_photo_path."popup_thumbnails/thumbnail_".$params["img_unique_name"]);
		    				}
		    				          
		    				
		    				
// 		    				$result = Extended\ilook_user::updateProfileImageName($params["img_unique_name"], Auth_UserAdapter::getIdentity()->getId());
		    				$result = Extended\ilook_user::updateColumnValues( Auth_UserAdapter::getIdentity()->getId(), 
		    																array( 'professional_image' => $params["img_unique_name"] ) 
		    																);
		    				
// 							Posting profile photo on wall and saving it in album (Profile Photos).
							self::uploadProfilePhotoToTheAlbum( $params["img_unique_name"] );
		    				
		    				
		    				if($result){
		    					
		    					$result_arr = array("msg" => "success", "thumb_name" => $profile_thumb);
		    					echo Zend_Json::encode($result_arr);
		    				}
		    				else
		    				{
		    					$result_arr=array( "msg" => "error", "error_id" => 4 );
		    					echo Zend_Json::encode($result_arr);
		    				}
		    			} 
		    			else
		    			{
		    				// Rolling back
		    				// Removing image from the server.
		    				unlink($mediumThumb_name);
		    				unlink($bigThumb_name);
		    				unlink($cropThumb_name);
		    				// upload correct dimension image file.
		    				$result_arr=array("msg"=>"error","error_id"=>5);
		    				echo Zend_Json::encode($result_arr);
		    			}
		    		}
		    		else{
		    			// Rolling back
		    			// Removing image from the server.
		    			unlink($bigThumb_name);
		    			unlink($cropThumb_name);
		    			// upload correct dimension image file
	    				$result_arr=array("msg"=>"error","error_id"=>5);
	    				echo Zend_Json::encode($result_arr);
		    		}
		    	}
		    	else
		    	{
		    		// Rolling back
		    		// Removing image from the server.
		    		unlink($cropThumb_name);
    				$result_arr=array("msg"=>"error", "error_id"=>5);
    				echo Zend_Json::encode($result_arr);
		    	}    		
	    	}
	    	else
	    	{
    			$result_arr=array("msg"=>"error", "error_id"=>5);
    			echo Zend_Json::encode($result_arr);
	    		 
	    	}   
    	}
    	else
    	{
    		// File does not exist.
    		$result_arr=array("msg"=>"error", "error_id"=>6);
    		echo Zend_Json::encode($result_arr);
    	}
    	
    	//Emptying the used files after the process completion.
    	$files = glob($profile_photo_path."temp_croping_images/display_to_crop_thumbnails/user_".Auth_UserAdapter::getIdentity()->getId()."/*"); // get all file names
    	foreach($files as $file){ // iterate files
    		if(is_file($file))
    			unlink($file); // delete file
    	}
    	$files = glob($profile_photo_path."temp_croping_images/original_copy/user_".Auth_UserAdapter::getIdentity()->getId()."/*"); // get all file names
    	foreach($files as $file){ // iterate files
    		if(is_file($file))
    			unlink($file); // delete file
    	}
    	$files = glob($profile_photo_path."temp_croping_images/cropped_thumbnails/user_".Auth_UserAdapter::getIdentity()->getId()."/*"); // get all file names
    	foreach($files as $file){ // iterate files
    		if(is_file($file))
    			unlink($file); // delete file
    	}
    	
    	die;
    }

    /**
     * function used for remove profile image.
     * @author spatial
     * @version 1.0
     * @return json
     *
     */
    public function removeImageAction()
    {
    	$params=$this->getRequest()->getParams();
    	$user_id=Auth_UserAdapter::getIdentity()->getId();
    	$userObj = \Extended\ilook_user::getRowObject($user_id);
//     	$result=Extended\ilook_user::updateProfileImageName("", $user_id);
    	$result = Extended\ilook_user::updateColumnValues( Auth_UserAdapter::getIdentity()->getId(),
    			array( 'professional_image' => '' )
    	);
    	if($result){
    		$big_thumbnail="images/profile/big_thumbnails/".$params["filepath"];
    		$medium_thumbnail="images/profile/medium_thumbnails/".$params["filepath"];
    		$small_thumbnail="images/profile/small_thumbnails/".$params["filepath"];
    		$originalname=explode("thumbnail_",$params["filepath"]);
    		// $orginal_image="images/profile/".$originalname[1];
    		unlink($big_thumbnail);
    		unlink($medium_thumbnail);
    		unlink($small_thumbnail);
    		// unlink($orginal_image);
    		if(\Extended\ilook_user::USER_GENDER_MALE==$userObj->getGender())
    		{
    			$bigImg="default_profile_image_male_big.png";
    			$smallImg="default_profile_image_male_small.png";
    		}
    		else if(\Extended\ilook_user::USER_GENDER_FEMALE==$userObj->getGender()){
    			$bigImg="default_profile_image_female_big.png";
    			$smallImg="default_profile_image_female_small.png";
    		}
    		echo $defaultImage=Zend_Json::encode(array("image"=>$bigImg,"smallImage"=>$smallImg));
    	}
    	die;
    }


    /**
     * This function used to invite the other users
     * @author spatial
     * @version 1.0
     * 
     */
    public function inviteToConnectAction()
    {
		$params=$this->getRequest()->getParams();
		$link_request_type = \Extended\link_requests::LINK_REQUEST_TYPE_VIA_ILOOK;
		$request_user=Auth_UserAdapter::getIdentity()->getId();
		
		$request_arr = array();
		$request_arr['link_request_type'] = $link_request_type;
		$request_arr['request_user_id'] = $request_user;
		$request_arr['accept_user_id'] = $params["accept_user"];
		$send_link_request = \Extended\link_requests::sendRequest($request_arr);
		
		if($send_link_request["request-status"]=="already sent")
		{
			$userObj = \Extended\ilook_user::getRowObject($params["accept_user"]);
			$userName = ucwords($userObj->getFirstname()." ".$userObj->getLastname());
			$request = array("requestID"=>$send_link_request,"requestStatus"=>"already sent invitation","uname"=>$userName);
			echo Zend_Json::encode($request);
		}
		else
		{
			echo Zend_Json::encode($send_link_request);
		}
		die;
    }

    /**
     * This function used to cancel the request.
     * 
     * --------------------------------------------------------------------------------
     * Cancel which request? link request, feedback request, reference request?
     * Please change the name of the function accordingly.
     * Please do not put (...) after every line of comment, usually this means that there is more text to come.
     * 
     * Do not write sunny patial as author but spatial.
     * 
     * - jsingh7
     * 
     * The action's code has been changed on 10 mar 2015 - jsingh7
     * --------------------------------------------------------------------------------
     * 
     * @author spatial
     * @version 1.0
     * 
     */
    public function cancelRequestAction()
    {
    	$params = $this->getRequest()->getParams();
    	
    	$flag1 = false;
    	if( isset($params["type"]) && $params["type"] == "request" )
    	{
    		$flag1 = true;
    	}
    	
    	$result = \Extended\link_requests::unlinkUsersByLinkReqId( $params["cancel_request"], $flag1 );
    	
    	switch ( $result ) 
    	{
    		case 0:
    		case 1:
    		case 2:
    			echo Zend_Json::encode( $result );
    		break;
    		case 3:
				if( $params["profileID"] )
				{	
					$currentUser = Auth_UserAdapter::getIdentity()->getId();
					$TagsExist=\Extended\link_tags::getAssignedTags($currentUser, $params["profileID"] );
					$tagsarr=array();
					$removeLinks=\Extended\link_tags::removeAllTags($currentUser,$params["profileID"],$tagsarr);
					\Extended\socialise_photo_custom_privacy::deleteViewerfromCustomViewersList($currentUser, $params['profileID']);
				}
				echo Zend_Json::encode( $result );
    		break;
    		
    		default:
    			echo Zend_Json::encode( $result );
    		break;
    	}
    	die;
    }

    /**
     * This function used to accept the link request
     * 
     * @author spatial
	 * @author ssharma4[replace Extended(link_request::accept_request) function call to common function call]
     * @version 1.2
     * 
     */
    public function acceptRequestAction()
    {
		$params=$this->getRequest()->getParams();
		//Save acceptance,add notification record & add link to roster.
		$accept_request = \Helper_links::add($params["accept_request"]);
		// if no record present in the database.
		//Get details so that can clear user buddylist from localstorage.
		$accepter = \Extended\ilook_user::getRowObject(Auth_UserAdapter::getIdentity()->getId());
		if( !$accept_request )
		{
			$userObj = \Extended\ilook_user::getRowObject($params["profileID"]);

			$userName = $userObj->getFirstname()." ".$userObj->getLastname();
			$accept_request = array("requestStatus"=>"already cancelled", "uname"=>$userName,"accepter"=>$accepter->getUsername());
		} else {
			$accept_request = array("accept_request"=>$accept_request, "accepter"=>$accepter->getUsername());
		}
		echo Zend_Json::encode( $accept_request );
		die;
    }

    /**
     * When User will enter the email in Registeration step-first
     * With the help of jquery remote this function will check the
     * availability of that email in database
     * and returns true or false accordingly.
     * 
     * @author rsharma
     * @version 1.1
     *
     */
    public function checkLangExistAction()
    {
		$params = $this->getRequest()->getParams();
		$lang_check = \Extended\user_languages::isLanguageExist( trim( $params['lang_name'] ), Auth_UserAdapter::getIdentity()->getId() );
	
		if($lang_check){
			echo Zend_Json::encode(false);
		}else{
			echo Zend_Json::encode(true);
		}
		die();
    }
    
	/**
	 * function used to generate pdf report with user selected options.
	 * @author spatial
	 * @version 1.0
	 *
	 */
    public function generateReportContactInformationAction()
    {
    	$params=$this->getRequest()->getParams();
		// user id...
		if( @$params['id'] )
		{
			$this->view->userId=$params['id'];
			$userObj = Extended\ilook_user::getRowObject($params['id']);
			// if user not present into the database...
			if(!$userObj)
			{
				$this->_redirect(PROJECT_URL."/".PROJECT_NAME."error/is-not-available");
			}
			else
			{
				$result = \Extended\who_viewed_profiles::insertProfileViewedDateTime(Auth_UserAdapter::getIdentity()->getId(), $userObj->getId());
				$this->view->friendRequestState=\Extended\link_requests::getFriendRequestState($userObj->getId());
			}
		}
		else
		{
			$this->view->userId="";
			$userObj = Auth_UserAdapter::getIdentity();
		}
		$this->view->user_obj=$userObj;
		$id=$userObj->getId();
		$username = $userObj->getUsername();
		$this->view->current_user_id=Auth_UserAdapter::getIdentity()->getId();
		
		// get profile image of the user...
		@$filename=REL_IMAGE_PATH."/profile/big_thumbnails/thumbnail_".$userObj->getProfessional_image();
		if($userObj->getProfessional_image()!="" && file_exists($filename)){
			$img_name=IMAGE_PATH."/profile/big_thumbnails/thumbnail_".$userObj->getProfessional_image();
		}
		else{
			if($userObj->getGender()==Extended\ilook_user::USER_GENDER_MALE){
				$img_name=IMAGE_PATH."/profile/default_profile_image_male_big.png";
			}
			else{
				$img_name=IMAGE_PATH."/profile/default_profile_image_female_big.png";
			}
		}
		
		// Required pdf files....
		require_once('tcpdf/config/lang/eng.php');
		require_once('tcpdf/tcpdf.php');
		require('tcpdf/htmlcolors.php');
		
		// Create object of the custom pdf class...
		$pdf = new Helper_MyPdf(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
		
		// Get User profile Information
		$userinfo=\Extended\ilook_user::getUserInformation($id);
		$personalInfo = $userinfo[0];
		$pdf->img = IMAGE_PATH."/logo.png";
		$pdf->profileTitle = $personalInfo["firstname"]." ".$personalInfo["lastname"];
		
		// set document information
		$pdf->SetCreator(PDF_CREATOR);
		$pdf->SetAuthor('ilook developers');
		$pdf->SetTitle($personalInfo["firstname"]." ".$personalInfo["lastname"]);
		$pdf->SetSubject($personalInfo["firstname"].' Profile');
		$pdf->SetKeywords('Profile detail');

		// set header and footer fonts
		$pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
		$pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

		// set default monospaced font
		$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

		// set margins
		$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
		// Set top margin of the pdf file...
		$pdf->SetHeaderMargin(10);
		$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

		// set auto page breaks
		$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);
		
		// set image scale factor
		$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

		// set some language-dependent strings (optional)
		if (@file_exists(dirname(__FILE__).'/lang/eng.php')) {
		    require_once(dirname(__FILE__).'/lang/eng.php');
		    $pdf->setLanguageArray($l);
		}
		$pdf->AddPage();

		// User profile image...
		$pdf->SetXY(17, 19);
		$pdf->Image($img_name, '', '', '', '', '', PROJECT_URL.'/'.PROJECT_NAME.$username, '', true, 150, '', false, false, 1, false, false, false);

		// Profile info... 
		$pdf->SetXY(58, 18);
		$pdf->SetFont('', 'B', 11, '', true);
		$pdf->Cell(35, 5, ucwords($personalInfo["firstname"].' '.$personalInfo['lastname']));
		$pdf->Ln(7);
		$pdf->SetFont('', '', 11, '', true);
		$pdf->SetXY(58, 23);
		$pdf->Cell(35, 5, $personalInfo['email']);
		$pdf->Ln(7);
		$pdf->SetXY(58, 28);
		$pdf->Cell(35, 5, PROJECT_URL."/".PROJECT_NAME.$username);
		$pdf->Ln(7);
		$pdf->SetXY(58, 33);
		$pdf->Cell(35, 5, $personalInfo["phone"]);
		$pdf->Ln(7);
		 
		// Heading
		$pdf->SetXY(15, 58);
		
		$html="";
		$html=$html.'<style type="text/css">
		h4 {
		    font-family: arial;
		    font-weight: normal;
		    padding: 0;    
		}
		body {
		    font-family: arial;
		    font-size: 13px;
		}
		img {
		    border: medium none;
		}
		h4 {
		    font-size: 16px;
		}
		h1 {
		    font-family: arial;
		    font-weight: normal;
		    padding: 0;    
		}
		h2 {
		    font-family: arial;
		    font-weight: normal;
		    padding: 0;    
		}
		h3 {
		    font-family: arial;
		    font-weight: normal;
		    padding: 0;    
		}
		h4 {
		    font-family: arial;
		    font-weight: normal;
		    padding: 0;    
		}
		h5 {
		    font-family: arial;
		    font-weight: normal;
		    padding: 0;    
		}
		h3 {
		    font-size: 18px;
		}
		
		.wrapper {
		    margin: 0 auto;
		    width: 940px;
		}
		.pdf-report-outer{
		                background:#fff;
		                margin:0;
		                padding:2% 2%;
		                float:left;
		                width:96%;
		}
		.pdf-report-hdr{
		                margin:0;
		                padding:0 0 10px 0;
		                float:left;
		                border-bottom:1px solid #e0e0e0;
		                width:100%;
		}
		.pdf-report-content{
		                margin:0 0 0 0;
		                padding:0 0 0 0;
		                float:left;
		                width:100%;
		}
		.pdf-pic-outer{
		                margin:20px 0 0 0;
		                padding:0 0 0 0;
		                float:left;
		                width:100%;
		}
		.pdf-pic-left{
		                margin:0 0 0 0;
		                padding:0 0 0 0;
		                float:left;
		                width:100px;
		                height:130px;
		}
		.pdf-pic-right{
		                margin:1% 0 0 1%;
		                padding:0 0 0 0;
		                float:left;
		                width:500px;
		}
		.pdf-pic-right h4{
						font-weight:bold;
		                margin:0;
		                text-transform:capitalize;
		}
		.pdf-pic-right p{
		                margin:0;
		}
		.pdf-col1{
		                width:100%;
		                margin:0px 0 0 5px;
		                float:left;
		                border-bottom:solid 1px black;
		}
		.pdf-div-hr{
			border-bottom:solid 1px black;
			}
		.pdf-col1-hdr{
		                width:100%;
		                margin:0 0 0 0;
		                float:left;
		                border-bottom:1px solid #bdbdbd;
		}
		.pdf-col1-content{
		                width:100%;
		                margin:0 0 0 0;
		                float:left;
		                text-align:justify;
		}
		.pdf-col1-content .heading{
						font-weight:bold;
		                font-size:16px;
		                width:100%;
		                margin:0;
		                padding:0;
		}
		.pdf-label-outer{
		                width:100%;
		                margin:10px 0 0 0;
		                padding:0;
		                float:left;
		}
		.pdf-col1-content label{
						font-weight:bold;
		                font-size:13px;
		                width:150px;
		                margin:0;
		                padding:0 10px 0 0;
		                float:left;
		                color:#6C518F;
		                text-align:right;
		                background:url(../images/lablel-dot.png) no-repeat right center;
		}
		.pdf-col1-content span{
		                font-size:13px;
		                width:auto;
		                margin:0 0 0 10px;
		                padding:0;
		                float:left;
		                max-width:700px;
		}
		.wrapper{
			width:940px;
			margin:0 auto;
		}
		
		.bdr-grey2{
			border-bottom:1px solid #dedede;
			margin:0;
			padding:10px 0 10px 0;
			float:left;
			width:100%;
		}
		</style>';

		if(@$params["summary"]==1){
		// Summary detail start
		$html = $html.'<font style="font-size:45px !important;font-weight:bold;">Summary</font><br><br/>';
		$pdf->SetFont('helvetica', '', 9, '', true);
		if($userObj->getProfessional_exp()!=""){
			 $html = $html.$userObj->getProfessional_exp();
		}
		if($userObj->getProfessional_goals()!=""){
			$html = $html.$userObj->getProfessional_goals();
		}
		$html = $html.'<div class="pdf-div-hr"></div>';
		// Summary detail start end.
		}

		if(@$params["exp"]==1){
		// Experience detail start....
		
			$experienceListing = Extended\experience::getAllExperiences( $id );
			//Zend_Debug::dump($experienceListing);
			if(count($experienceListing)>0)
			{
				$html = $html.'<br/><font style="font-size:45px !important;font-weight:bold;">Experience</font><br><br/>';
				foreach($experienceListing as $exp)
				{
				 if($exp->getJob_startdate())
				 {
				   $from = $exp->getJob_startdate()->format('F-Y');
				   if($exp->getCurrently_work() != '1')
                   {
	                 if($exp->getJob_enddate()!='')
                        {
                        $to = $exp->getJob_enddate()->format('F-Y');
                        }
	                 else
	                    {
	                    $to = $exp->getJob_enddate();
	                    }     		 
                   }
                   else
                   {
                       $to = 'Present';
                   }		  
		                          
	                    $getDate = $from." - ".$to;
	                    if($to == "Present")
	                    {
	                    	$dayDiff = "";
	                    }
	                    if($exp->getCurrently_work() != '1')
	                    {
	                      if($exp->getJob_enddate()!='')
	                      {
	                        $days = intVal( $exp->getJob_startdate()->diff( $exp->getJob_enddate() )->d );
							$months = intVal( $exp->getJob_startdate()->diff($exp->getJob_enddate())->m );
							$year = intVal( $exp->getJob_startdate()->diff($exp->getJob_enddate())->y );
							
							// for years, months and days
							if($months == 0 && $year == 0 && $days >= 1)  
								$diff = $days. ' day(s)';
							elseif($months == 0 && $year >= 1 && $days == 0)  
								$diff = $year.' year(s)';
							elseif($months == 0 && $year >= 1 && $days >= 1)
								$diff = $year.' year(s) '. $days.' day(s)';
							elseif($months >= 1 && $year == 0 && $days == 0)
								$diff = $months.' month(s)';
							elseif($months >= 1 && $year == 0 && $days >= 1)
								$diff = $months.' month(s) '.$days.' day(s)';
							elseif($months >= 1 && $year >= 1 && $days == 0)
								$diff = $year. ' year(s) '.$months.' month(s) ';
							elseif($months >= 1 && $year >= 1 && $days >= 1)
								$diff = $year.' year(s) '.$months.' month(s) '.$days.' day(s)';
							else
							{	
								$diff = $year.' year(s) '.$months.' month(s) ';
							}
								$dayDiff = '<b>(' . $diff . ')</b>';
		    			}
		    			else
		    			{
		    				$dayDiff = "Not Set";
		    			}
	                    }
					  }
					  else
					  {
					    $getDate = $exp->getJob_startdate()->format('F-Y')." - <span class='notSet'>Currently Working</span>";
					  }
					   //Zend_Debug::dump($exp);
				$html = $html.'<table>
				<tr>
				<td style="width:15%;color:#6C518F;">Job Title:</td>
				<td style="width:75%;">'.$exp->getJob_title().'</td>
				</tr>
					
					<tr>
					<td style="width:15%;color:#6C518F;">Company:</td>
					<td style="width:75%;">'.$exp->getExperiencesCompany()->getName().'</td>
					</tr>';
					if($exp->getJob_startdate())
					{
					$html = $html.'<tr>
					<td style="width:15%;color:#6C518F;">Time Period:</td>
					<td style="width:75%;">'.@$getDate.' '.$dayDiff.'</td>
					</tr>';
					}
					
					$html = $html.'<tr>
					<td style="width:15%;color:#6C518F;">Location:</td>
					<td style="width:75%;">'.$exp->getLocation().'</td>
					</tr>';
					
					$html = $html.'<tr>
					<td style="width:15%;color:#6C518F;">Description:</td>
					<td style="width:75%;">'.$exp->getDescription().'</td>
					</tr>';
					
					$html = $html.'<tr>
					<td style="width:15%;color:#6C518F;"></td>
					<td style="width:75%;"></td>
					</tr>
					</table>';
				}
				
				$html = $html.'<div class="pdf-div-hr"></div>';
				
			}
			
		// Experience detail end....
		}

		// Education detail start....
		if(@$params["educ"]==1){
		
			$educationListing=\Extended\education_detail::getEduInfoList($id);
			if(count($educationListing)>0){
				$html = $html.'<br/><font style="font-size:45px !important;font-weight:bold;">Education</font><br>';
				for($i=0;$i<count($educationListing);$i++){
		
					$html = $html.'<table>
					
					<tr>
					<td style="width:15%;color:#6C518F;">College:</td>
					<td style="width:75%;">'.$educationListing[$i]["school_title"].'</td>
					</tr>
					
					<tr>
					<td style="width:15%;color:#6C518F;">Education Level:</td>
					<td style="width:75%;">'.$educationListing[$i]["degreetitle"].' ('.$educationListing[$i]["fieldofstudy_title"].')</td>
					</tr>
					
					<tr>
					<td style="width:15%;color:#6C518F;">Degree:</td>
					<td style="width:75%;">'.$educationListing[$i]["degree_name"].'</td>
					</tr>
					
					<tr>
					<td style="width:15%;color:#6C518F;">Time Period:</td>
					<td style="width:75%;">'.date("F, Y", strtotime($educationListing[$i]["duration_from"])).' - '.date("F, Y", strtotime($educationListing[$i]["duration_to"])).'</td>
					</tr>
					
					<tr>
					<td style="width:15%;color:#6C518F;">Grade:</td>
					<td style="width:75%;">'.$educationListing[$i]["grade"].'</td>
					</tr>
					
					<tr>
					<td style="width:15%;color:#6C518F;">Activities:</td>
					<td style="width:75%;">'.$educationListing[$i]["acitivities"].'</td>
					</tr>
					
					<tr>
					<td style="width:15%;color:#6C518F;">Description:</td>
					<td style="width:75%;">'.$educationListing[$i]["notes"].'</td>
					</tr>
					
					<tr>
					<td style="width:15%;color:#6C518F;"></td>
					<td style="width:75%;"></td>
					</tr>
					</table>';
				}
				$html = $html.'<div class="pdf-div-hr"></div>';
			}
		
		}
		// Education detail end....

		// Projects detail start....
		if(@$params["projects"]==1){
			$projects = Extended\project::getAllProjects($id);
			if($projects){
			$html = $html.'<br/><font style="font-size:45px !important;font-weight:bold;">Projects</font><br>';
				for($i=0;$i<count($projects);$i++){
				
					$pDate = $projects[$i]->getFrom_datee()->format('F-Y')." - ".$projects[$i]->getTo_datee()->format('F-Y');
						
					$days = intVal( $projects[$i]->getFrom_datee()->diff($projects[$i]->getTo_datee())->d );
						
					$months = intVal( $projects[$i]->getFrom_datee()->diff($projects[$i]->getTo_datee())->m );
						
					$year = intVal( $projects[$i]->getFrom_datee()->diff($projects[$i]->getTo_datee())->y );
						
						
					// for months and days
					if($months == 0 && $year == 0 && $days >= 1)
						$diff = $days. ' day(s)';
					elseif($months == 0 && $year >= 1 && $days == 0)
					$diff = $year.' year(s)';
					elseif($months == 0 && $year >= 1 && $days >= 1)
					$diff = $year.' year(s) '. $days.' day(s)';
					elseif($months >= 1 && $year == 0 && $days == 0)
					$diff = $months.' month(s)';
					elseif($months >= 1 && $year == 0 && $days >= 1)
					$diff = $months.' month(s) '.$days.' day(s)';
					elseif($months >= 1 && $year >= 1 && $days == 0)
					$diff = $year. ' year(s) '.$months.' month(s) ';
					elseif($months >= 1 && $year >= 1 && $days >= 1)
					$diff = $year.' year(s) '.$months.' month(s) '.$days.' day(s)';
					else
					{
						$diff = $year.' year(s) '.$months.' month(s) ';
					}
				
					
					$html = $html.'<table>
					<tr>
					<td style="width:15%;color:#6C518F;">Project Name:</td>
					<td colspan="2" >'.$projects[$i]->getName().'</td>
					</tr>
					<tr>
					<td style="width:15%;color:#6C518F;">Occupation:</td>
					<td colspan="2" >'.$projects[$i]->getOccupation().'</td>
					</tr>
					<tr>
					<td style="width:15%;color:#6C518F;">Date:</td>
					<td colspan="2" >'.$pDate.'('.$diff.')</td>
					</tr>
					<tr>
					<td style="width:15%;color:#6C518F;">URL:</td>
					<td colspan="2">'.$projects[$i]->getUrl().'</td>
					</tr>
					<tr>
					<td style="width:15%;color:#6C518F;">Description:</td>
					<td colspan="2">'.$projects[$i]->getDescprition().'</td>
					</tr>
					<tr>
					<td colspan="3"><hr></td>
					</tr>
					</table>';
				}
				$html = $html.'<div class="pdf-div-hr"></div>';
			}
		}

		// Projects detail end....		
		if(@$params["language"]==1){
			$languages = Extended\user_languages::getAllLanguagesWithProficiency($id);
			if($languages){
				$html = $html.'<br/><font style="font-size:45px !important;font-weight:bold;">Languages</font><br><br/>';
				$pdf->SetFont('helvetica', '', 12, '', true);
				$html = $html.'<table>';
				for($i=0;$i<count($languages);$i++){
					
					$html=$html.'<tr>';
					$html=$html.'<td colspan="3" style="font-size:40px;"><label>'.$languages[$i]["language"].'(<font  style="color:#6C518F;">'.$languages[$i]["proficiency"].'</font>)</label></td>';
					$html=$html.'</tr>';
				}
				$html = $html.'<div class="pdf-div-hr"></div>';
			}
		}
		
		// Languages detail end....
		if(@$params["public"]==1){
			// Publication detail start....
		
			$publicationListing=Extended\publication::getAllPublications($id);
			if($publicationListing){
				$html = $html.'<br/><font style="font-size:45px !important;font-weight:bold;">Publication</font><br>';
				foreach($publicationListing as $mypubs){
					$html = $html.'<table>
					<tr>
					<td colspan="3" style="font-size:40px;"><label style="color:#6C518F;">Title:</label> '.$mypubs->getTitle().'</td>
					</tr>
					<tr>
					<td style="width:7%;"></td>
					<td style="width:15%;color:#6C518F;">Publisher :</td><td>'.$mypubs->getPublisher().'</td>
					</tr>
					<tr>
					<td style="width:7%;"></td>
					<td style="width:15%;color:#6C518F;">Author:</td><td>'.$mypubs->getAuthor().'</td>
					</tr>
					<tr>
					<td style="width:7%;"></td>
					<td style="width:15%;color:#6C518F;">Activities:</td><td style="width:80%;">'.$mypubs->getActivites_and_socities().'</td>
					</tr></table>';
				}
				$html = $html.'<div class="pdf-div-hr"></div>';
		
			}
			// Publication detail end....
		}

		if(@$params["honors"]==1){
			$personInfo=\Extended\ilook_user::getPersonalInformation($id);
			$personInf=$personInfo[0];
			if($personInf['honors_n_awards']!=''){
				$hawards = $personInf['honors_n_awards'];
				// Honours  detail start
				$html = $html.'<font style="font-size:45px !important;font-weight:bold;">Honours & Awards</font><br>';
				$pdf->SetFont('helvetica', '', 9, '', true);
				$html = $html.$hawards;
				$html = $html.'<div class="pdf-div-hr"></div>';
				// Honours detail start end.
			}
		}
		
		if(@$params["certification"]==1){
		// Certification detail start....
		
			$certification=\Extended\certification::getCertificationInfoList($id);
			if($certification){
			$html = $html.'<font style="font-size:45px !important;font-weight:bold;">Certification</font><br>';
				foreach($certification as $cl){
				
					$html = $html.'<table>
					<tr>
					<td colspan="3" style="font-size:40px;"><label style="color:#6C518F;">Certificate:</label> '.strtoupper($cl->getName()).'</td>
					</tr>
					<tr>
					<td style="width:7%;"></td>
					<td style="width:15%;color:#6C518F;">Authority :</td><td>'.$cl->getAutority().'</td>
					</tr>
					<tr>
					<td style="width:7%;"></td>
					<td style="width:15%;color:#6C518F;">License Number:</td><td>'.$cl->getLicense_number().'</td>
					</tr>
					<tr>
					<td style="width:7%;"></td>
					<td style="width:15%;color:#6C518F;">Date:</td><td style="width:80%;">'.$cl->getCertification_date()->format("F, Y").'</td>
					</tr></table>';
				}
				$html = $html.'<div class="pdf-div-hr"></div>';
			}
			
		// Certification detail end....
		}
		
		if(@$params["volunteer"]==1){
		// Voluntering and causes detail start....
		
			$volunteer=\Extended\volunteering_n_causes::getVolunteeringInformation($id);
			if($volunteer){
			$html = $html.'<br/><font style="font-size:45px !important;font-weight:bold;">Volunteering & Causes</font><br>';
				for($i=0;$i<count($volunteer);$i++){
					$html = $html.'<table>
					<tr>
					<td colspan="3" style="font-size:40px;"><label style="color:#6C518F;">Organization:</label> '.$volunteer[$i]["organization"].'</td>
					</tr>
					<tr>
					<td style="width:7%;"></td>
					<td style="width:15%;color:#6C518F;">Role :</td><td>'.$volunteer[$i]["role"].'</td>
					</tr>
					<tr>
					<td style="width:7%;"></td>
					<td style="width:15%;color:#6C518F;">Cause:</td><td>'.$volunteer[$i]["cause"].'</td>
					</tr>
					<tr>
					<td style="width:7%;"></td>
					<td style="width:15%;color:#6C518F;">Description:</td><td>'.$volunteer[$i]["description"].'</td>
					</tr></table>';
				
				}
				$html = $html.'<div class="pdf-div-hr"></div>';
			}
			
		// Voluntering and causes detail end....
		}

	if(@$params["personal"]==1){
	// Personal info detail start....
	
		$personInfo=\Extended\ilook_user::getPersonalInformation($id);
		$personInf=$personInfo[0];
		$html = $html.'<br/><font style="font-size:45px !important;font-weight:bold;">Personal Info</font><br><br/>';
		if(isset($personInf['phone']) &&  $personInf['phone']!=''){
			$phnno = $personInf['phone'];
		}
		else{
			$phnno = "--";
		}
		if(isset($personInf['address']) &&  $personInf['address']!=''){
			$addr = $personInf['address'];
		}
		else{
			$addr = "--";
		}
		if(isset($personInf['address_second']) &&  $personInf['address_second']!=''){
			$addr2 = $personInf['address_second'];
		}
		else{
			$addr2 = "--";
		}
		if(isset($personInf['birthday']) && $personInf['birthday']!=''){
			$birth = $personInf['birthday'];
		}
		else{
			$birth = "--";
		}
		if(isset($personInf['martial_status']) &&  $personInf['martial_status']==Extended\ilook_user::STATUS_MARRIED){
			$martialStatus = "Married";
		}
		else if(isset($personInf['martial_status']) &&  $personInf["martial_status"]==Extended\ilook_user::STATUS_UNMARRIED){
			$martialStatus = "Unmarried";
		}
		else{
			$martialStatus = "--";
		}
			
		if(isset($personInf['im_type']) &&  $personInf["im_type"]==Extended\ilook_user::MESSENGER_GMAIL){
			$imType = "Gmail";
		}
		else if(isset($personInf['im_type']) &&  $personInf["im_type"]==Extended\ilook_user::MESSENGER_YAHOO){
			$imType = "Yahoo";
		}
		else if(isset($personInf['im_type']) &&  $personInf["im_type"]==Extended\ilook_user::MESSENGER_SKYPE){
			$imType = "Skype";
		}
		else if(isset($personInf['im_type']) &&  $personInf["im_type"]==Extended\ilook_user::MESSENGER_PIDGIN){
			$imType = "Pidgin";
		}
		else{
			$imType = "--";
			
		}
			
		if(isset($personInf['instant_messenger']) &&  $personInf['instant_messenger']!=''){
			$instantMssger = $personInf['instant_messenger'];
		}
		else{
			$instantMssger = "--";
		}
		if(isset($personInf['nationality']) &&  $personInf['nationality']!=''){
			$nationality = $personInf['nationality'];
		}
		else{
			$nationality = "--";
		}
		if(isset($personInf['website_url']) &&  $personInf['website_url']!=''){
			$webUrl = $personInf['website_url'];
		}
		else{
			$webUrl = "--";
		}
		if(isset($personInf['linkedin_url']) && $personInf['linkedin_url']!=''){
			$linkedUrl = $personInf['linkedin_url'];
		}
		else{
			$linkedUrl = "--";
		}
		if( isset($personInf['_url']) && $personInf['_url']!=''){
			$facebookUrl = $personInf['facebook_url'];
	    }
	    else{
	    	$facebookUrl = "--";
	    }
	    if(isset($personInf['twitter_url']) && $personInf['twitter_url']!=''){
	    	$twitterUrl = $personInf['twitter_url'];
	    }
	    else{
	    	$twitterUrl = "--";
	    }
	    if(isset($personInf['gender']) && $personInf["gender"]==\Extended\ilook_user::USER_GENDER_MALE)
	    {
	    	$usrGender="Male";
	    }
	    else
	    {
	    	$usrGender="Female";
	    }
	    $asdf=$martialStatus;
	    $html = $html.'<table>
	    <tr>
	    <td style="color:#6C518F;">Phone number:</td><td>'.$phnno.'</td>
	    </tr>
	    <tr>
	    <td style="color:#6C518F;">Address1:</td><td>'.$addr.'</td>
	    </tr>
	    <tr>
	    <td style="color:#6C518F;">Address2:</td><td>'.$addr2.'</td>
	    </tr>
	    <tr>
	    <td style="color:#6C518F;">Website:</td><td>'.$webUrl.'</td>
	    </tr>
	     <tr>
	    <td style="color:#6C518F;">Linkedin:</td><td>'.$linkedUrl.'</td>
	    </tr>
	     <tr>
	    <td style="color:#6C518F;">Facebook:</td><td>'.$facebookUrl.'</td>
	    </tr>
	    <tr>
	    <td style="color:#6C518F;">Twitter:</td><td>'.$twitterUrl.'</td>
	    </tr>
	    <tr>
	    <td style="color:#6C518F;">IM:</td><td>'.$instantMssger.'</td>
	    </tr>
	    <tr>
	    <td style="color:#6C518F;">Messenger Type:</td><td>'.@$imType.'</td>
	    </tr>
	    <tr>
	    <td style="color:#6C518F;">Birthday:</td><td>'.$birth.'</td>
	    </tr>
	     <tr>
	    <td style="color:#6C518F;">Gender:</td><td>'.$usrGender.'</td>
	    </tr>
	    <tr>
	    <td style="color:#6C518F;>Marital Status:</td><td>'.$martialStatus.'</td>
	    </tr>
	    <tr>
	    <td style="color:#6C518F;>Nationality:</td><td>'.$nationality.'</td>
	    </tr>
	    
	   
	   
	    </table><div class="pdf-div-hr"></div>';
	    
	    
	    // Personal info detail end....
	    }
    
	    if(@$params["hobby"]==1){
	    	// Additional info detail start....
	    	$html = $html.'<br/><font style="font-size:45px !important;font-weight:bold;">Additional Info</font><br><br/>';
	    	$html = $html.'<table><tr>
	    	<td>'.$personalInfo['hobbies'].'</td>
	    	</tr></table><div class="pdf-div-hr"></div>';
	    	// Additional info detail end.....
	    }
   
	    // set core font
	    $pdf->SetFont('helvetica', '', 9);
  		
	    // output the HTML content
	    $pdf->writeHTML($html, true, 0, true, true);
    
		$pdf->Ln();
    
	    // reset pointer to the last page
	    $pdf->lastPage();
	    //echo $html; die;
    
		$fileName="pdf/user_pdf/".$personalInfo["firstname"]."_".$personalInfo['lastname']."_".date('d-m-y').".pdf";
		//Close and output PDF document
		$pdf->Output($fileName, 'FD');
		unlink($fileName);
		die;
    }

    /**
     * lists notes
     * 
     * @author sgandhi
     * @version 1.0
     */
    public function notesAction()
    {
    	$stripTags = \Zend_Registry::get('Zend_Filter_StripTags');
    	$params = $this->getRequest()->getParams();
    	if( ! @$params['list_len'] )
    	{
    		$params['list_len'] =10;
    	}
    	$this->view->prms = $params;
    	//Filtering note text.
		if(isset($params['note_search'])) {
			$this->view->note_text 	= $params['note_search'];
			$note_text				= $params['note_search'];
			$text = preg_replace( '/\s\s+/', ' ', $stripTags->filter( $note_text ) );
			$chuncks = explode(" ", $text);
			$temp_r = array();
			foreach ( $chuncks as $chunk )
			{
				$temp_r[] = preg_replace( "/\W+/", '', $chunk );
			}
			$myNotes =(Extended\notes::getAllNotes( Auth_UserAdapter::getIdentity()->getId(), $temp_r ));
			//------ PAGINATION -------
			if($myNotes)
			{
				$paginator = Zend_Paginator::factory($myNotes);
				$paginator->setItemCountPerPage(@$params['list_len']);
				$paginator->setCurrentPageNumber(@$params['page']);
				$this->view->paginator=$paginator;
			}
		}


        else 
        {
	        $this->view->paginator=false;
        } 
    }
    
    
    /**
     * Get note for current note id.
     * @author hkaur5
     * @version 1.0
     */
    public function getCurrentNoteAction()
    {
    	$params = $this->getRequest()->getParams();

    	$full_note=Extended\notes::getUniqueNote( $params['note_id']);
    	
    	echo Zend_Json::encode($full_note);
    	die;
    }

    /**
     * This function used to render the notes text.
     * @author sgandhi
     * @version 1.0
     */
    public function getNoteAction()
    {
    	
    	$params=$this->getRequest()->getParams();
    	//$profile_user = $params["user_id"];
    	$current_user = Auth_UserAdapter::getIdentity()->getId();
    	$result=\Extended\notes::getNotes($current_user);
    	if($result){
    		//$txt=array("txt_note"=>$result);
    		echo Zend_Json::encode($result);
    	}
    	else{
//     		$txt=array("txt_note"=>"");
    		echo Zend_Json::encode(0);
    	}
    
    	die;
    }
    
    /**
     * Deletes the current note.
     * @author hkaur5
     */
    public function deleteCurrentNoteAction()
    {
    	
    	$params = $this->getRequest()->getParams();
    	$note_id = Extended\notes::deleteNote( $params['note_id']);
    	if($note_id)
    	{
    		echo Zend_Json::encode(array("msg"=>"success"));
	    	$messages = new Zend_Session_Namespace('messages');
	    	$messages->successMsg = "Note deleted.";
	    }
	    else
	    {
			echo Zend_Json::encode(array("msg"=>"error"));
			$messages = new Zend_Session_Namespace('messages');
			$messages->errorMsg = "An error occurred! Please try again.";
		}
    	die;
    }
    
    /**
     * function used to delete multiple notes.
     * @author hkaur5
     */
    public function deleteMultipleNotesAction()
   	{
    	$params=$this->getRequest()->getParams();
    	$notes_ids_arr=explode(",", $params['notes_ids']);

		for($i=0;$i<count($notes_ids_arr);$i++)
		{
			$result=\Extended\notes::deleteNote($notes_ids_arr[$i]);
    	}
		if($result)
		{
	    	echo Zend_Json::encode(array("msg"=>"success"));
	    	$messages = new Zend_Session_Namespace('messages');
	    	$messages->successMsg = "Note(s) deleted.";
	    }
	    else
	    {
			echo Zend_Json::encode(array("msg"=>"error"));
			$messages = new Zend_Session_Namespace('messages');
			$messages->errorMsg = "An error occurred! Please try again.";
		}
		die;
	}

    /**
     * This function use to save notes regarding any user with in the popup.
     * @author spatial
     * @version 1.0
     */
    public function saveNoteAction()
    {
    	$params=$this->getRequest()->getParams();
    	$profile_user_id = $params["profile_user_id"];
    	$current_user = Auth_UserAdapter::getIdentity()->getId();
    	$result=\Extended\notes::addNote($current_user,$profile_user_id,$params["note"]);
    	if($result)
    	{
    		$msg=array("msg"=>"success");
    	}
    	echo Zend_Json::encode($msg);
    	die;
    }
    /**
     * This function use to save notes for a user. 
     * @author hkaur5
     * @version 1.1
     */
    public function saveNoteInEditorAction()
    {
    	$params=$this->getRequest()->getParams();
    	$profile_user_id = $params["profile_user_id"];
    	$current_user = Auth_UserAdapter::getIdentity()->getId();
    	$user_note=\Extended\notes::edit_and_saveNote($current_user,$profile_user_id,$params["note"]);
    	$strip_tag_note =strip_tags( $user_note );
    	$cropped_note = Helper_common::showCroppedText($strip_tag_note, 250);
    	$note = array('formatted_full_note'=>$user_note, 'strip_note'=>$strip_tag_note, 'cropped_note'=> $cropped_note);
    	echo Zend_Json::encode($note);
    	die;
    }

    public function feedbackRequestAction()
    {
       $this->view->feedbackRequest = Extended\feedback_requests::getAllfeedbackRequests( Auth_UserAdapter::getIdentity()->getId() );
    }
    
	/**
	 * function used to show listing of user albums..
	 * @author spatial, hkaur5
	 * @version 1.1
	 */
    public function photoAlbumsAction()
    {
    	$params=$this->getRequest()->getParams();
    	

    	//Fetching All albums of login user without filtering according to uid. 
    	
    	// if user has passed uid in url.
    	if( isset($params['uid']) )
    	{
    		$userObj = \Extended\ilook_user::getRowObject($params['uid']);
    		//if user not found, redirect to error page.
    		if(!$userObj)
    		{
    			$this->_helper->redirector('is-not-available', 'error', 'default', array('message'=>'Oops! this profile does not exists.'));
    		}
    		
    		//Getting albums after filtering on basis of privacy.
			$filtered_albums = Extended\socialise_album::getAlbums($params['uid'], Auth_UserAdapter::getIdentity()->getId());

			if(!($filtered_albums['album_info']) && Auth_UserAdapter::getIdentity()->getId() == $params['uid']  )
			{
				$this->view->loginUserAlbum=true;// variable to check that user is owner or not.
			}
    	}
    	// if user has not passed any uid in url.
    	else if(!isset($params['uid']))
    	{

    		$this->view->loginUserAlbum=true;
    	}
        else
        {
        	$this->_helper->redirector('is-not-available', 'error', 'default' );
        }
    }
    
    /**
     * sets and updates the visibility_criteria of socialize album for current user.
     * @author hkaur5
     * @version 1.1 
     * @see AccountSettings/changePrivacyOfAllAlbums
     */
    public function changePrivacyOfAlbumAction()
    {
    	$params=$this->getRequest()->getParams();
    	$is_changed =  Extended\socialise_album::setAlbumVisibility( Auth_UserAdapter::getIdentity()->getId(), $params['privacy'], $params['album_id'] );
    	$album_obj = \Extended\socialise_album::getRowObject($params['album_id']);
    	
    	//If privacy changed then send albums visibility crriteria.
    	if( $is_changed )
    	{
    		echo Zend_Json::encode(array('album_visibility_criteria'=>$album_obj->getVisibility_criteria()));
    		die;
    	}
    	else 
    	{
    		echo Zend_Json::encode(0);
    		die;
    	}
    	
    	
    }
    /**
     * Gets the links of current user.
     * @author hkaur5
     * @version 1.1
     * @see mail/get-my-links
     */
    public function getMyLinksForCustomViwerPopUpAction()
    {
    	$params = $this->getRequest()->getParams();
    	$links_obj = Extended\ilook_user::getLinksOfUser( Auth_UserAdapter::getIdentity()->getId() );
    	$contacts_r = array();
    	if($links_obj)
    	{
    		foreach ( $links_obj as $key=>$lk )
    		{
	    		$contacts_r[$key]['user_id'] = $lk->getId();
	    		$contacts_r[$key]['first_name'] = $lk->getFirstname();
	    		$contacts_r[$key]['last_name'] = $lk->getLastname();
	    		$contacts_r[$key]['email'] = $lk->getEmail();
	    		$contacts_r[$key]['prof_image'] = Helper_common::getUserProfessionalPhoto($lk->getId(), 3);
    		}
	    	//Get all the contacts which are set as custom viewer of all albums of current user .
	    	$custom_viewers = \Extended\socialise_album_custom_privacy::getCustomViewerForCurrentAlbum(Auth_UserAdapter::getIdentity()->getId(),$params['current_album_id'] );
	    	//Array to store custom_viewer of all albums of current user.
	    	$custom_viewers_r = array();
	    	if($custom_viewers)
	    	{
		    	foreach($custom_viewers  as $key=>$custom_viewer)
		    	{
		    		$custom_viewers_r[$key]['user_id'] = $custom_viewer->getIlookUser()->getId();
		    		
		    	}
	    	}
	    	$return_r = array();
	    	$return_r['custom_set_links'] = $custom_viewers_r;
	    	$return_r['all_links'] = $contacts_r;
    	  	if($return_r)
    		{
	    	echo Zend_json::encode($return_r);
    		}
    
    		else    
    		{
	    		$return_r['custom_set_links'] = "";
	    		$return_r['all_links'] = "";
		    	echo Zend_json::encode($return_r);
    		}
		}
	    else
	    {
	    	$return_r['all_links'] = "";
		    echo Zend_json::encode($return_r);
	    }
    	die;
    }
    /** 
     * Adds custom viewer to album and sets its privacy to custom.
     * @author hkaur5
     * @version 1.0 
     */
    public function setCustomPrivacyAndViewersForAlbumAction()
    {
    	$params = $this->getRequest()->getParams();
    	$is_changed_to_custom =  Extended\socialise_album:: setAlbumVisibilityToCustom( Auth_UserAdapter::getIdentity()->getId(),Extended\socialise_album::VISIBILITY_CRITERIA_CUSTOM , $params['album_id'] );
    	
    	if($is_changed_to_custom)
    	{
	    	$custom_viewer_ids_r = explode(",", $params['custom_viewer']);
	    	if ($custom_viewer_ids_r)
	    	{
		    	if(\Extended\socialise_album_custom_privacy::addCustomViewersOfCurrentAlbum( $custom_viewer_ids_r, $params['album_id'], Auth_UserAdapter::getIdentity()->getId() ))
		    	{
		    		echo Zend_json::encode(1);
		    	}
		    	else 
		    	{
		    		echo Zend_json::encode(0);
		    	}
	    	}
    	}
    	die;
    		
    }

    /**
     * This action is for listing all the photos
     * of the user in grid view.
     * 
     * @version 1.0
     * @author unknown
     * @author hkaur5
     */
    public function photosAction()
    {
    	
    	$params=$this->getRequest()->getParams();
    	$logged_in_user = Auth_UserAdapter::getIdentity()->getId();
    	
    	if( $params['uid'] && $params['id'] )//If user id and album id both exist.
    	{
    		//The edit options are the options to edit photo such as make it album cover etc.
    		$this->view->editOptions = "disable";
    		$this->view->userId = $params['uid'];
    		$this->view->current_user_id = $logged_in_user;
    		
    		//------------------------------------------------
    		//Fetching records of users who has been blocked.
    		//------------------------------------------------
    		$this->view->blocked_user_ids_arr = \Extended\blocked_users::getAllBlockersAndBlockedUsers($params['uid']);
    		//---------------------------------------------------
    		//End Fetching records of users who has been blocked.
    		//---------------------------------------------------
    		$userObj = Extended\ilook_user::getRowObject( $params['uid'] );
    		if( !$userObj )
    		{
    			$this->_helper->redirector( 'is-not-available', 'error' );
    		}
    		else //User exist.
    		{
    			$this->view->uid = $userObj->getId();
    			
	    		if( $logged_in_user == $userObj->getId() )
	    		{
	    			$this->view->editOptions = "enable";
	    			$this->view->loginUserAlbum = true;
	    		}    
	    		
	    		
    			$albumObj = Extended\socialise_album::getRowObject( $params["id"] );
    			$filtered_albums = \Extended\socialise_album::getAllAlbumIdsByPrivacy($params['uid'], $logged_in_user);
    				
    			if( $albumObj )//If album exist in database.
    			{
    				//Check if the 'album id in url' is present in filtered albums array,
    				//this is to check if this user can view this album else forward him/her to error page.
	    			if( in_array($albumObj->getId(), $filtered_albums) )
	    			{
	    				$this->view->sys_albums = false;
	    				
	    				//Albums which are created by system.
	    				if($albumObj->getAlbum_display_name() == \Extended\socialise_album::DEFAULT_ALBUM_NAME
	    					||$albumObj->getAlbum_display_name() == \Extended\socialise_album::PROFILE_PHOTOS_ALBUM_DISPLAY_NAME
	    					||$albumObj->getAlbum_display_name() == \Extended\socialise_album::COVER_PHOTOS_ALBUM_DISPLAY_NAME
	    					)
	    				{
	    					$this->view->sys_albums = true;
	    				}
	    				
	    				
	    				if( strtolower( $albumObj->getAlbum_name() ) == strtolower(\Extended\socialise_album::DEFAULT_ALBUM_NAME ))
	    				{
	    					$albName=strtolower($albumObj->getAlbum_name());
	    				}
	    				else
	    				{
	    					$albName=$albumObj->getAlbum_name()."_".$albumObj->getCreated_at_timestamp()->getTimestamp();
	    				}
	    				$this->view->albId = $albumObj->getId();
	    				$this->view->visibility_criteria = $albumObj->getVisibility_criteria();
	    				$this->view->albName = $albumObj->getAlbum_display_name();
	    				$this->view->alb_name = $albumObj->getAlbum_name();
	    				$this->view->albName2 = "album_".$albName;
	    				$this->view->enableOtherAlbumLink = 0;
	    				//$limit = 12; // initail limit of pictures shown
	    				//$offset = 0; // initial offset on page load
	    				//$this->view->photoListing = Extended\socialise_photo::getPhotosByUserIdNAlbumId( $userObj->getId(), $albumObj->getId(),$limit,$offset);
	    				
	    				//Check if more albums exist other than dedfault and currentr album,
	    				//as to check if user can perform actions like 'move to other album'.
	    				$resultArr=Extended\socialise_album::getRemainingAlbumListing( $albumObj->getId(), $userObj->getId() );
	    				
	    				if( count($resultArr) > 0 )
	    				{
	    					$this->view->enableOtherAlbumLink = 1;
	    				}
	    			}
	    			else
	    			{
	    				$this->_forward("is-not-available", "error");
	    			}
    			}
    			else
    			{
    				$this->_helper->redirector("is-not-available", "error");
    			}
    		}
    	}
    	else
    	{
    		$this->_helper->redirector('is-not-available', 'error');
    	}
    }

    /**
     * Album detail page in editable form where user can make chanes and save.
     * @author hkaur5
     * 
     * 
     */
    public function editAlbumAction()
    {
    	$params  = $this->getRequest()->getParams();
    	$userObj = Auth_UserAdapter::getIdentity();
    	if( $params['id'])//If user id and album id both exist.
    	{
	    	$album_obj = \Extended\socialise_album::getRowObject($params['id']);
	    	$album_owner_user_id = $album_obj->getSocialise_albumIlook_user()->getId();
	  
	    	
	    	//Check if logged in user is owner of album
    		if($album_owner_user_id == Auth_UserAdapter::getIdentity()->getId())
    		{
    			
    			//Albums which are created by system can not be edited.
    			if($album_obj->getAlbum_display_name() == \Extended\socialise_album::DEFAULT_ALBUM_NAME
    					||$album_obj->getAlbum_display_name() == \Extended\socialise_album::PROFILE_PHOTOS_ALBUM_DISPLAY_NAME
    					||$album_obj->getAlbum_display_name() == \Extended\socialise_album::COVER_PHOTOS_ALBUM_DISPLAY_NAME
    			)
    			{
    				$this->_helper->redirector( "is-not-available", "error", 'default', array('message'=>'This Album can not be eidted.') );
    			}
    			$this->view->uid = $userObj->getId();
    			 
    			$albumObj = Extended\socialise_album::getRowObject( $params["id"] );
    	
    			if( $albumObj )//If album exist in database.
    			{
    				if( strtolower( $albumObj->getAlbum_name() ) == strtolower(\Extended\socialise_album::DEFAULT_ALBUM_NAME ))
    				{
    					$albName=strtolower($albumObj->getAlbum_name());
    				}
    				else
    				{
    					$albName=$albumObj->getAlbum_name()."_".$albumObj->getCreated_at_timestamp()->getTimestamp();
    				}
    				$this->view->albId = $albumObj->getId();
    				$this->view->visibility_criteria = $albumObj->getVisibility_criteria();
    				$this->view->albName = $albumObj->getAlbum_display_name();
    				$this->view->alb_name = $albumObj->getAlbum_name();
    				$this->view->albName2 = $albName;
    				$this->view->enableOtherAlbumLink = 0;
    		    
    				//Check if more albums exist other than default and currentr album,
    				//as to check if user can perform actions like 'move to other album'.
    				$resultArr=Extended\socialise_album::getRemainingAlbumListing( $albumObj->getId(), $userObj->getId() );
    		    
    				if( count($resultArr) > 0 )
    				{
    					$this->view->enableOtherAlbumLink = 1;
    				}
    			}
    			else
    			{
    				$this->_helper->redirector("is-not-available", "error");
    			}
    		}
    		else
    		{
    			$this->_helper->redirector( "is-not-available", "error", 'default', array('message'=>'You are not authorized to access this page.') );
    		}
    	}
    	else
    	{
    		$this->_helper->redirector('is-not-available', 'error');
    	}
    }
    
    /**
     * Calls function to save album details and 
     * returns boolean result to ajax call
     * 
     * @author hkaur5
     * 
     */
    public function updateAlbumDetailsAction()
    {
    	$params = $this->getRequest()->getParams();
    	
    	$is_album_updated = \Extended\socialise_album::updateALbumDetails($params);
    	
    	//Update Photos descriptions.
    	if($is_album_updated)
    	{
				if($params['photo_id_desc_arr'])
				{
	    		// creating an array with index as photo_id and value as photo_desc. FOR updatePhotoDesc.
					$photo_id_desc_arr = array();
					foreach(json_decode($params['photo_id_desc_arr']) as $id_desc_arr)
					{
						foreach($id_desc_arr as $id=>$desc)
						{
							$photo_desc_update = \Extended\socialise_photo::updatePhotoDesc(null, $desc, $id);
						}
					}
					
					if($photo_desc_update)
					{
						$return = true;	
					}
				}
				//------------------------------------------------------------------
    	}
    	
    	//Update Album custom viewers if any and only if privacy seleceted is custom.
    	if( $is_album_updated && $params['custom_viewers_comma_seperated'] && $params['privacy'] == 4 )
    	{
    		$custom_viewer_ids_r = explode(",", $params['custom_viewers_comma_seperated']);
    		if ($custom_viewer_ids_r)
    		{
    			if(\Extended\socialise_album_custom_privacy::addCustomViewersOfCurrentAlbum( $custom_viewer_ids_r, $params['album_id'], Auth_UserAdapter::getIdentity()->getId() ))
    			{
    				$return = true;	
    			}
    			else
    			{
    				$return = false;	
    			}
    		}
    	}
    	
    	
    	echo Zend_Json::encode($return);
    	die;
    }
    /**
     * ??????????????????????????????
     *
     * @version ?
     * @author unknown
     */
    public function photoDetailAction()
    {
        $params=$this->getRequest()->getParams();
    	if( $params['uid'] )//User ID
    	{
    		$this->view->userId=$params['uid'];
    		$userObj = Extended\ilook_user::getRowObject($params['uid']);
    		if(!$userObj)
    		{
    			$this->_helper->redirector('is-not-available', 'error', 'default' );
    		}
    		else if(Auth_UserAdapter::getIdentity()->getId()==$params['uid'])
    		{
    			$this->view->userId="";
    			$userObj = Auth_UserAdapter::getIdentity();
    			$this->view->loginUserAlbum=true;
    		}
    	}
    	else
    	{
    		$this->view->userId="";
    		$userObj = Auth_UserAdapter::getIdentity();
    		$this->view->loginUserAlbum=true;
    	}
    	$this->view->user_obj=$userObj;
    	$id=$userObj->getId();
    	$this->view->albumUserID=$id;
    	
    	$photo_id = $params["id"];
        $this->view->photoDetail=Extended\socialise_photo::getRowObject($photo_id);
        //Zend_Debug::dump( $this->view->photoDetail);die;
        $this->view->uid=Auth_UserAdapter::getIdentity()->getId();
        $this->view->did_i_liked_this = \Extended\socialise_photo::didUserLikedPhoto( Auth_UserAdapter::getIdentity()->getId(), $photo_id );
    }
    
    /**
     * function used to remove temp directory of the particular user.
     * @author spatial
     * @version ?
     */
    public function removeTempDirectoryAction()
    {
    	$id=Auth_UserAdapter::getIdentity()->getId();
    	$dir=REL_IMAGE_PATH.'/albums/temp/user_'.$id.'/';
    	$result=Helper_common::deleteDir($dir);
    	$resultArr=array("msg"=>$result);
    	die;
    }
    
	/**
	 * Add photos.
	 * Create temp directories and thumbnails in temp directory.
	 * @author spatial
	 */
    public function addMorePhotosAction()
    {
    	
    	$id=Auth_UserAdapter::getIdentity()->getId();
    	
    	//Creating directories in temp directories.
    	$userDirectory=REL_IMAGE_PATH.'/albums/temp/user_'.$id;
    	$thumbnailsDirectory=REL_IMAGE_PATH.'/albums/temp/user_'.$id.'/thumbnails';
    	$popUpDirectory=REL_IMAGE_PATH.'/albums/temp/user_'.$id.'/popup_thumbnails';
    	$galleryDirectory=REL_IMAGE_PATH.'/albums/temp/user_'.$id.'/gallery_thumbnails';
    	$originalDirecory=REL_IMAGE_PATH.'/albums/temp/user_'.$id.'/original_photos';
    	$wallDirecory=REL_IMAGE_PATH.'/albums/temp/user_'.$id.'/wall_thumbnails';
    	
    	
    	// Create direcories.
    	if (!file_exists($userDirectory)) 
    	{
    		if(mkdir($userDirectory, 0777, true))
    		{
    			mkdir($thumbnailsDirectory, 0777, true);
    			mkdir($popUpDirectory, 0777, true);
    			mkdir($galleryDirectory, 0777, true);
    			mkdir($originalDirecory, 0777, true);
    			mkdir($wallDirecory, 0777, true);
    			$result="success";	
    		}
    		else
    		{
    			echo "Failed to create user directories!";
    		}
    	}
    	else
    	{
    		$result="success";
    	}
    	if($result=="success")
    	{
    		$name = $_FILES['myfile']['name'];
    		$temp_path = $_FILES['myfile']['tmp_name'];

    		$image_name = Helper_common::getUniqueNameForFile( $name );
    		
    		
    		// Set the upload folder path
    		$target_path = $originalDirecory."/";

    		
    		// Set upload image path
    		$image_upload_path = $target_path.$image_name;
    		
    		if(move_uploaded_file($temp_path, $image_upload_path)) 
    		{
    			// Set 800*800 popup thumbnail...
    			// Set popup directory...
    			$thumbnail_directory=$popUpDirectory."/";
    			// Set thumbnail name...
    			$thumb_name=$thumbnail_directory.'thumbnail_'.$image_name;
    			// Set width and height of the thumbnail...
    			$thumb_width=800;
    			$thumb_height=800;
    			$thumb=Helper_common::generateThumbnail($image_upload_path, $thumb_name, $thumb_width, $thumb_height);
	    		
	    		if($thumb)
	    		{
	    			// Set 435*333 thumbnail...
	    			// Set thumbnail directory...
	    			$thumbnail_directory=$wallDirecory."/";
	    			// Set thumbnail name...
	    			$thumb_name=$thumbnail_directory.'thumbnail_'.$image_name;
	    			// Set width and height of the thumbnail...
	    			$thumb_width=435;
	    			$thumb_height=435;
	    			$thumb=Helper_common::generateThumbnail($image_upload_path, $thumb_name, $thumb_width, $thumb_height);
	    			
	    			if($thumb)
	    			{
		    			// Set 174*174 thumbnail...
		    			// Set thumbnail directory...
		    			$thumbnail_directory=$galleryDirectory."/";
		    			// Set thumbnail name...
		    			$thumb_name=$thumbnail_directory.'thumbnail_'.$image_name;
		    			// Set width and height of the thumbnail...
		    			$thumb_width=176;
		    			$thumb_height=176;
		    			$thumb =Helper_ImageResizer::smart_resize_image($image_upload_path, NULL, $thumb_width, $thumb_height, false, $thumb_name, false);
		    			// $thumb=Helper_common::generateThumbnail($image_upload_path, $thumb_name, $thumb_width, $thumb_height);
		    			if($thumb)
		    			{
		    				$profile_thumb=$thumb;
		    				// Set 129*129 thumbnail...
		    				// Set thumbnail directory....
		    				$thumbnail_directory=$thumbnailsDirectory."/";
		    				// Set thumbnail name....
		    				$thumb_name=$thumbnail_directory.'thumbnail_'.$image_name;
		    				$thumb_width=131;
		    				$thumb_height=131;
		    				$thumb =Helper_ImageResizer::smart_resize_image($image_upload_path, NULL, $thumb_width, $thumb_height, false, $thumb_name, false);
		    				// $thumb=Helper_common::generateThumbnail($image_upload_path, $thumb_name, $thumb_width, $thumb_height);
		    				if($thumb)
		    				{
		    					// $thumbImg=array("img"=>$thumb);
		    					$return_arr = array('image_path'=>$thumb_name, 'image_name'=>$image_name);
		    					echo Zend_Json::encode($return_arr);
		    				}
		    				else
		    				{
		    					
		    					// popup_thumbnail directory uploading issue....
		    				}
		    			}	
		    			else
		    			{
		    				
		    				// gallery directory uploading issue....
		    			}
	    			}
	    			else
	    			{
	    				
	    				// wall directory uploading issue....
	    			}
	    		}
    			else
    			{
    				
    				// thumbnail directory uploading issue....
    			}
	    	}
    		else
    		{
    			// echo "Due to some server error we can't upload your image...";
    			echo "3";
    		}
    	}
    	else
    	{
    		echo "Failed to create user directories.";
    	}
    	die;
    }
    
    /**
     * Store album information to the socialise_album,
     * store images information to the socialise_photo,
     * move album photos from temp directory to the user_id actual directory.
     * 
     * @return array of album information in json encoded form.
     * @author spatial
     */
	public function postPhotosAction()
	{
		$params = $this->getRequest()->getParams();
		
		$current_user = Auth_UserAdapter::getIdentity()->getId();
		
		//original directory in temp folder.
		$originalDirecory = REL_IMAGE_PATH.'/albums/temp/user_'.$current_user.'/original_photos';
		
		//Count files with in the directory.
		$count = Helper_common::countDirectoryFiles($originalDirecory);
		
		$album_title = base64_decode($params["album_title"]);
		$album_privacy = $params["album_privacy"];
		
		//Store album info.
		$result = \Extended\socialise_album::addAlbum($current_user, $album_title, $album_privacy, $count, $album_title);
		
		if($result)
		{
			$userDirectory = REL_IMAGE_PATH.'/albums/user_'.$current_user;
			
			//=========================================================================
			// Moving photos from temporary location to permanent user album directory. 
			//=========================================================================
			
			// create directory.
			if ( !file_exists($userDirectory) )
			{
				mkdir($userDirectory, 0777, true);
				$dirresult="success";
			}
			else
			{
				$dirresult="success";
			}
			if($dirresult=="success")
			{
				//Temp user_userid dir.
				$srcDirectory = REL_IMAGE_PATH.'/albums/temp/user_'.$current_user;
				
				//Original directory inside permanent user dir.
				$readDirectory = $srcDirectory."/"."/original_photos/";
				$photosArr = array_diff(scandir($readDirectory), array('..', '.'));
				
				
				$galleryDirectory=$srcDirectory."/"."/gallery_thumbnails/";
				$photosArr2 =array_diff(scandir($galleryDirectory), array('..', '.'));
				
				$gallerythumbs=array();
				
				foreach( $photosArr2 as $k=>$v )
				{
					$imgThumb = explode("thumbnail_",$v);
					$gallerythumbs[] = $imgThumb[1];
				}
				$finalphotosArr = array_intersect($photosArr, $gallerythumbs);
				
				// creating an array with index as photo_name and value as photo_desc. FOR ADD PHOTOS.
				$photo_desc_name_arr = array();
				foreach(json_decode($params['photo_name_desc_arr']) as $name_desc_arr)
				{
					foreach($name_desc_arr as $name=>$desc)
					{
						$photo_desc_name_arr[$name]= $desc;
					}
				}
				//------------------------------------------------------------------
				
				\Extended\socialise_photo::addPhotos($result["id"], $current_user, $finalphotosArr, $album_privacy,null, null, null, $photo_desc_name_arr);
				
				// Making album inside permanent user_userid derectory
				$albumDirectory=$userDirectory."/album_".Helper_common::removeSpecialCharFrmString($album_title)."_".$result["directoryTime"]->getTimestamp();
				
				// create album directory.
				mkdir($albumDirectory, 0777, true);
				
				// move all files(directories) from the temp user dir to permanent album dir.
				Helper_common::rcopy($srcDirectory, $albumDirectory);
				
				// delete temp user directory.
				Helper_common::deleteDir($srcDirectory);
				
				// delete thumbnails directory inside permanent user's album.
				Helper_common::deleteDir(REL_IMAGE_PATH.'/albums/user_'.$current_user.'/album_'.Helper_common::removeSpecialCharFrmString($album_title).'_'.$result["directoryTime"]->getTimestamp().'/thumbnails');
				
				$latestImage=\Extended\socialise_photo::getLatestPhoto($result["id"]);
				$linkurl=PROJECT_URL."/".PROJECT_NAME.'profile/photos/uid/'.$current_user.'/id/'.$result["id"];
				$imgurl=IMAGE_PATH.'/albums/user_'.$current_user.'/album_'.Helper_common::removeSpecialCharFrmString($album_title).'_'.$result["directoryTime"]->getTimestamp().'/gallery_thumbnails/thumbnail_'.$latestImage;

				$finalPhotos=\Extended\socialise_photo::countAlbumImages($result["id"]);
				$finalResultArr=array("link"=>$linkurl,"img"=>$imgurl,"album"=>$result['name'],"numbers"=>$finalPhotos, "current_user_id"=>$current_user,"album_visibility_criteria"=>$result['album_visibility_criteria']);
				
				//=========================================================================
				// Creating wallpost for this album.
				//=========================================================================
				
				//if album information saved then add wallpost information.
				if( $result )
				{
					$photo_visibility_criteria = $result['album_visibility_criteria'];
					$to_user_id = $result['album_posted_by_user_id'];
					$from_user_id = $to_user_id;
					$original_user_id = $to_user_id;
					$post_update_type = \Extended\wall_post::POST_UPDATE_TYPE_ALBUM;
					$post_type = \Extended\wall_post::POST_TYPE_MANUAL;
					$wall_type = \Extended\wall_post::WALL_TYPE_SOCIALISE;
					$album_id = $result['id'];
					$wall_post_id =  \Extended\wall_post::post_photo( "",
																	$photo_visibility_criteria, 
																	$to_user_id, 
																	$from_user_id, 
																	$original_user_id, 
																	$post_update_type, 
																	$post_type, 
																	$wall_type, 
																	null, 
																	$album_id);
				}
				
				echo Zend_Json::encode($finalResultArr);
			}
		}
		die;
	}
	
	/**
	* function used to store images information to the socialise_photo
	* move album photos from temp directory to the existing album directory.
	* 
	* @author spatial
	* @version ?
	*/
	public function postPhotosUnderExistingAlbumAction()
	{
		$params=$this->getRequest()->getParams();
		$current_user = Auth_UserAdapter::getIdentity()->getId();
		
		// Count files with in the directory.
		$existingAlbum_name = $params["album_name"];
		$album_privacy 		= isset($params["album_privacy"])?$params["album_privacy"]:null;
		$album_id 			= $params["album_id"];
		
		// count album counter...
		// $albumCounter=\Extended\socialise_album::getAlbumCount($album_id);
		$userDirectory=REL_IMAGE_PATH.'/albums/user_'.$current_user;
		
		// create directory..
		if (!file_exists($userDirectory)) 
		{
			mkdir($userDirectory, 0777, true);
			$dirresult="success";
		}
		else
		{
			$dirresult="success";
		}
		if($dirresult=="success")
		{
			$srcDirectory=REL_IMAGE_PATH.'/albums/temp/user_'.$current_user;
			
			// $countresult=\Extended\socialise_album::updateImageCount($album_id, $count+$albumCounter);
			$readDirectory=$srcDirectory."/"."/original_photos/";
			
			$photosArr =array_diff(scandir($readDirectory), array('..', '.'));
			
			$galleryDirectory=$srcDirectory."/"."/gallery_thumbnails/";
			$photosArr2 =array_diff(scandir($galleryDirectory), array('..', '.'));
			$gallerythumbs=array();
			
			foreach($photosArr2 as $k=>$v)
			{
				$imgThumb=explode("thumbnail_",$v);
				$gallerythumbs[]=$imgThumb[1];
			}
			
			$finalphotosArr=array_intersect($photosArr, $gallerythumbs);
			
			//Creating an array with index as photo_name and value as photo_desc. FOR ADD PHOTOS.
			$photo_desc_name_arr = array();
			foreach(json_decode($params['photo_name_desc_arr']) as $name_desc_arr)
			{
				foreach($name_desc_arr as $name=>$desc)
				{
					$photo_desc_name_arr[$name]= $desc;
				}
			}
			//------------------------------------------------------------------
			
			$resultImage=\Extended\socialise_photo::addPhotos($album_id, $current_user, $finalphotosArr, $album_privacy, null, null, null, $photo_desc_name_arr);
			
			if($resultImage)
			{
				//Update last date time of wallpost associated with this album.
				$album_obj = \Extended\socialise_album::getRowObject($album_id);
				$wallpost_collec = $album_obj->getSocialise_albumsWall_post();
				foreach( $wallpost_collec as $wp )
				{
					$wallpost_id = $wp->getId();
				}
				\Extended\wall_post::updateLastActivityDateTime($wallpost_id);
			}
			$albumDirectory=$userDirectory."/".$existingAlbum_name;
			
			// move all files from the
			Helper_common::rcopy($srcDirectory, $albumDirectory);
			
			// delete temp user directory..
			Helper_common::deleteDir($srcDirectory);
			
			// delete thumbnails directory...
			Helper_common::deleteDir(REL_IMAGE_PATH.'/albums/user_'.$current_user.'/'.$existingAlbum_name.'/thumbnails');
			
			 // create image url links and image path.
			$linkurl=array();
			$imgurl=array();
			$imgId=array();
			
			foreach( $resultImage as $k=>$v )
			{
				$imgId[]=$k;
				$image_obj = \Extended\socialise_photo::getRowObject($k);
				$photo_desc[] = $image_obj->getDescription();
				$linkurl[]=PROJECT_URL."/".PROJECT_NAME.'profile/photo-detail/id/'.$k;
				$imgurl[]=IMAGE_PATH.'/albums/user_'.$current_user.'/'.$existingAlbum_name.'/gallery_thumbnails/thumbnail_'.$v; 
			}
			
			//Check if any other album exist for this user(other than default)
			$resultArr=Extended\socialise_album::getRemainingAlbumListing($params["album_id"], Auth_UserAdapter::getIdentity()->getId());
			
			$enableMoveToOtherAlbumLink = 0;
			
			if( count( $resultArr ) > 0 && strtolower($existingAlbum_name)!=strtolower( \Extended\socialise_album::DEFAULT_ALBUM_NAME )
			&& strtolower($existingAlbum_name)!=strtolower( \Extended\socialise_album::PROFILE_PHOTOS_ALBUM_NAME )
			&& strtolower($existingAlbum_name)!=strtolower( \Extended\socialise_album::COVER_PHOTOS_ALBUM_NAME) )
			{
				$enableMoveToOtherAlbumLink = 1;
			}
			
			$finalResultArr=array("link"=>$linkurl,"img"=>$imgurl,"uid"=>$current_user,"albumId"=>$album_id,"photoId"=>$imgId,"moveOtherAlbumLinkStatus"=>$enableMoveToOtherAlbumLink, 'photo_desc'=>$photo_desc);
			echo Zend_Json::encode($finalResultArr); 
		}
		die;
	}
	
	/**
	 * function used to get user popup image.
	 * @author spatial
	 * @version ?
	 */
	public function getOrignalImageAction()
	{
		$params=$this->getRequest()->getParams();
		$getObj=\Extended\ilook_user::getRowObject($params["user_id"]);
		
		
		if($params["user_id"] == Auth_UserAdapter::getIdentity()->getId())
		{
			$my_profile_pic = 1;
		}
		
		$realImg=REL_IMAGE_PATH."/profile/popup_thumbnails/thumbnail_".$getObj->getProfessional_image();
		$fullImagePath=IMAGE_PATH.'/profile/popup_thumbnails/thumbnail_'.$getObj->getProfessional_image();
		
		
		if(!file_exists($realImg))
		{
			echo Zend_Json::encode(\Extended\ilook_user::PREVIEW_NOT_AVAILABLE);
		}
		else
		{
			echo stripslashes(Zend_Json::encode(array('fullImagePath'=>$fullImagePath,"my_image"=>$my_profile_pic)));
		}
		die;
	}
 	
	/**
	 * function used to edit the particular basic info
	 *
	 * @author dsingh, jsingh7, sgandhi
	 * @version 1.0
	 *
	 */
	public function saveFlagStatusAction()
	{
		$flag_status = intval( $this->getRequest()->getParam('flag_status') );
		if( $flag_status && $flag_status >= 2 && $flag_status <= 4 )
		{
			$jobseeker_display_flag = \Extended\ilook_user::setJobseekerFlag(Auth_UserAdapter::getIdentity()->getId(), $flag_status);
			if( $jobseeker_display_flag ):
				echo Zend_Json::encode( $jobseeker_display_flag );
			else:
				echo Zend_Json::encode(0);
			endif;
		}
		else
		{
			echo Zend_Json::encode(0);
		}	
		die;
	}
	
	/**
	 *  check the existing wall post photo if not exist then insert the new wall post photo.
	 *  after the insertion like the wallpost
	 *  
	 *  @author jsingh7, nsingh3
	 *  @version 1.1
	 */
	public function okTheAlbumPhotoAndWallpostAction()
	{
		$params=$this->getRequest()->getParams();
		
		// this condition is use for check the photo id if photo id is available then proceed else return false 
		if($params['photo_id'])
		{
			$user_id = Auth_UserAdapter::getIdentity()->getId();
			$is_wallpost_exist = \Extended\wall_post::checkWallpostByPhotoNUser($params['photo_id'] , $params['photo_posted_by_user_id']);
		
			//If wallpost already exists.
			if( $is_wallpost_exist )
			{
				$wall_post_id = $is_wallpost_exist;
			}
			else
			{
				$photo_obj = \Extended\socialise_photo::getRowObject($params['photo_id']);
				if( $photo_obj )
				{
					$photo_visibility_criteria = $photo_obj->getVisibility_criteria();
						
					// if photo visibility criteria is custom then wallpost visibility creteria change into visibility creteria me only
					switch ($photo_visibility_criteria) {
						case 4:
							$photo_visibility_criteria =  \Extended\wall_post::VISIBILITY_CRITERIA_ME_ONLY;
							break;
					}
					$to_user_id = $photo_obj->getSocialise_photosPosted_by()->getId();
					$from_user_id = $to_user_id;
					$original_user_id = $to_user_id;
					$post_update_type = \Extended\wall_post::POST_UPDATE_TYPE_PHOTO;
					$post_type = \Extended\wall_post::POST_TYPE_MANUAL;
					$wall_type = \Extended\wall_post::WALL_TYPE_SOCIALISE;
					$album_id = $photo_obj->getSocialise_photosSocialise_album()->getId();
					$wall_post_id =  \Extended\wall_post::post_photo("", $photo_visibility_criteria, $to_user_id, $from_user_id, $original_user_id, $post_update_type, $post_type, $wall_type, $params['photo_id'], $album_id);
				}
				else
				{
					echo Zend_Json::encode(2);
					die;
				}	
			}
		
			if($wall_post_id)
			{
				//     	getting the wall post object.
				$wall_post_obj = \Extended\wall_post::getRowObject( $wall_post_id );
				if( $wall_post_obj )
				{		
					//     	Making a entry to like table for wallpost.
				    $result_wallpost = 	\Extended\likes::setOrUnsetOK( Auth_UserAdapter::getIdentity()->getId(), 0, $wall_post_obj->getId() );
						
					//     	Making a entry to like table for photo.
					$result_photo = \Extended\likes::setOrUnsetOK( Auth_UserAdapter::getIdentity()->getId(), 0, null, $wall_post_obj->getWall_postsSocialise_photo()->getId() );
						
					//setting like count for wall post.
					if($result_wallpost == "wallpost_ok_added." )
					{
						
						\Extended\wall_post::likeCountIncreament( $wall_post_obj->getId() );
					
					}	
					//setting like count for photo
					if($result_photo == "socialise_photo_ok_added." ){
						
						\Extended\socialise_photo::likeCountIncreament( $wall_post_obj->getWall_postsSocialise_photo()->getId() );
					
					}	
					// get ok likers string..
					$photo_obj = \Extended\socialise_photo::getRowObject($params['photo_id']);
					$likers = array();
					foreach( $photo_obj->getSocialise_photosLike() as $key=>$like )
					{
						$likers[$key] = $like->getLikesLiked_by()->getId();
					}
					$ok_string = \Helper_common::getLikersString ( $likers, \Auth_UserAdapter::getIdentity()->getId() );
					
					echo Zend_Json::encode(array("status"=>1,"ok_string"=>$ok_string, 'wallpost_id'=>$wall_post_id, 'photo_id'=>$params['photo_id']));
				}
				else
				{
					echo Zend_Json::encode(2);
					die;
				}		
			}
		}
		else
		{
			echo Zend_Json::encode(0);
		}
		die;
	}	
	
	/**
	 *  this function is use for dislike (Not ok) the album photo 
	 *
	 *  @author jsingh7, nsingh3
	 *  @version 1.1
	 */
	public function notOkTheAlbumPhotoAndWallpostAction()
	{

		$params=$this->getRequest()->getParams();
		
		// this condition is use for check the photo id if photo id is available then procede else return false 
		if($params['photo_id']){
			$user_id = Auth_UserAdapter::getIdentity()->getId();
			$is_wallpost_exist = \Extended\wall_post::checkWallpostByPhotoNUser($params['photo_id'] , $params['photo_posted_by_user_id']);
		
			// this condition is use based upon exist wallpost
			if( $is_wallpost_exist )
			{
					//     	getting the wall post object.
		    	$wall_post_obj = \Extended\wall_post::getRowObject( $is_wallpost_exist );
		    	if( $wall_post_obj )
		    	{
		    	
						//     	Making/removing a entry to like table for wallpost.
			    	$result_wallpost = \Extended\likes::setOrUnsetOK( Auth_UserAdapter::getIdentity()->getId(), 1, $wall_post_obj->getId() );
			    	
						//     	Making/removing a entry to like table for photo.
			    	$result_photo = \Extended\likes::setOrUnsetOK( Auth_UserAdapter::getIdentity()->getId(), 1, null, $wall_post_obj->getWall_postsSocialise_photo()->getId() );
			    	
				    	//setting like count for wall post.
			    	if( $result_wallpost == "wallpost_ok_deleted." )
		              {
		              	
				    	\Extended\wall_post::likeCountDecreament( $wall_post_obj->getId() );
		              
		              }
			 		   	//setting like count for photo 
			    	if( $result_photo == "socialise_photo_ok_deleted." )
		              {
		              	
		              	\Extended\socialise_photo::likeCountDecreament( $wall_post_obj->getWall_postsSocialise_photo()->getId() );
		              
		              }
		              
		              $photo_obj = \Extended\socialise_photo::getRowObject($params['photo_id']);
		              $likers = array();
		              foreach( $photo_obj->getSocialise_photosLike() as $key=>$like )
		              {
		              	$likers[$key] = $like->getLikesLiked_by()->getId();
		              }
		              $ok_string = \Helper_common::getLikersString ( $likers, \Auth_UserAdapter::getIdentity()->getId() );
		              
		              $ret_arr = array();
		              $ret_arr['ok_string'] = $ok_string;
		              $ret_arr['wallpost_id'] = $is_wallpost_exist;
		              $ret_arr['photo_id'] = $params['photo_id'];
		              $ret_arr['status'] = 1;
		              echo Zend_Json::encode($ret_arr);
		    	}
		    	else
		    	{
		    		echo Zend_Json::encode(array('status'=>2));
		    	}	
    		}
			else
			{
				echo Zend_Json::encode(array('status'=>0));
			}
		}else{
			echo Zend_Json::encode(array('status'=>0));
		}
		die;
	}
	
	/**
	 * get the list of photo likes
	 *
	 * @author nsingh3
	 * @version 1.0
	 */
	public function getWhoLikePhotoAction()
	{	
	 	
		$photo_id = $this->getRequest()->getParam( 'photo_id' );
	
// 		$photo_posted_by_user_id = $this->getRequest()->getParam( 'photo_posted_by_user_id' ) ;
		
// 		$is_wallpost_exist = \Extended\wall_post::checkWallpostByPhotoNUser($photo_id , $photo_posted_by_user_id);
		
		if($photo_id)
		{
			if( \Extended\socialise_photo::getRowObject($photo_id))
			{
				$ppl_who_liked = \Extended\likes::getUserslikedWallpostOrAlbumOrPhoto(  null, 
																						null, 
																						$photo_id,
																						$this->getRequest()->getParam( 'limit' ),
																		    			$this->getRequest()->getParam( 'offset' ));
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
			    	//For view more records option.
			    	$result = array('user_info'=>$user_info, 'is_more_records'=>$ppl_who_liked['is_more_records']);
			    	echo Zend_Json::encode( $result );
		    	}//No user record
		    	else
		    	{
		    		echo Zend_Json::encode(0);
		    	}
			}//Photo does not exist for given photo id.
			else
			{
				echo Zend_Json::encode(0);
			}
		}//No photo id provided.
		else 
		{
			echo Zend_Json::encode(0);
		}
		die;
	}

	 /**
     * Add comment for the photo detail and related wallpost if wallpost not exist then create the wallpost
     * Also increaments comment count
     * 
     * @author nsingh3,jsingh7,shaina
     * @version 1.1
     */
	public function addCommentToThePhotoAndRelatedWallpostAction()
	{
		$param = $this->getRequest()->getParams();
		
		$photo_id = $param['photo_id'] ;
		$photo_posted_by_user_id = $param['album_posted_by'];
		$comment = $param['comment'] ;
		
		$is_wallpost_exist = \Extended\wall_post::checkWallpostByPhotoNUser($photo_id , $photo_posted_by_user_id);
		if($is_wallpost_exist){
			$wall_post_id = $is_wallpost_exist ;
		}
		else 
		{
			$photo_obj = \Extended\socialise_photo::getRowObject($photo_id);
			if( $photo_obj )
			{	
				$photo_visibility_criteria = $photo_obj->getVisibility_criteria();
					
				// if photo visibiilty criteria is custom then wallpost visibility creteria change into visibility creteria me only
				switch ($photo_visibility_criteria) {
					case 4:
						$photo_visibility_criteria =  \Extended\wall_post::VISIBILITY_CRITERIA_ME_ONLY ;
						break;
				}
				$to_user_id = $photo_obj->getSocialise_photosPosted_by()->getId();
				$from_user_id = $photo_obj->getSocialise_photosPosted_by()->getId();
				$post_update_type = \Extended\wall_post::POST_UPDATE_TYPE_PHOTO;
				$post_type = \Extended\wall_post::POST_TYPE_AUTO;
				$wall_type = \Extended\wall_post::WALL_TYPE_SOCIALISE;
				$album_id = $photo_obj->getSocialise_photosSocialise_album()->getId();
				
				$wall_post_id =  \Extended\wall_post::post_photo("", $photo_visibility_criteria, $to_user_id, $from_user_id,$photo_posted_by_user_id, $post_update_type, $post_type, $wall_type, $photo_id, $album_id);
				//Zend_Debug::dump($wall_post_id);die;$wall_text, $visibility_criteria, $to_user, $from_user, $original_user, $post_update_type, $post_type, $wall_type, $photo_id, $album_id 
			}
			else
			{
				echo Zend_Json::encode(2);
				die;
			}	
		}
		if($wall_post_id)
		{
			//getting the wall post object.
    		$wall_post_obj = \Extended\wall_post::getRowObject( $wall_post_id );
    		if( $wall_post_obj )
    		{
	    		//Making a entry to like table for wallpost.
	    		$filterObj = Zend_Registry::get('Zend_Filter_StripTags');
	    		$comm_text = nl2br($filterObj->filter($this->getRequest()->getParam( 'comment' ) ));
	    		$comment_on_wallpost_id = \Extended\comments::addComment( $comm_text, Auth_UserAdapter::getIdentity()->getId(), NULL, $wall_post_obj->getId() );
	    		$comment_on_photo_id = \Extended\comments::addComment( $comm_text, Auth_UserAdapter::getIdentity()->getId(), $comment_on_wallpost_id, NULL, $wall_post_obj->getWall_postsSocialise_photo()->getId() );
	    		$comments_obj = \Extended\comments::getRowObject( $comment_on_wallpost_id );
	    		
	    		//setting like count for wall post.
	    		$comment_count = \Extended\wall_post::commentCountIncreament( $wall_post_obj->getId() );
	    
	    		//setting like count for photo
	    		\Extended\socialise_photo::commentCountIncreament( $wall_post_obj->getWall_postsSocialise_photo()->getId() );
	    
	    		$ret_r = array();
	    		$ret_r['comm_id'] = $comment_on_wallpost_id;
	    		$ret_r['wall_comm_id'] = $comment_on_photo_id;
	    		$ret_r['comm_text'] = $comm_text;
	    		$ret_r['commenter_id'] = Auth_UserAdapter::getIdentity()->getId();
	    		$ret_r['commenter_fname'] = Auth_UserAdapter::getIdentity()->getFirstname();
	    		$ret_r['commenter_lname'] = Auth_UserAdapter::getIdentity()->getLastname();
	    		$ret_r['commenter_small_image'] = Helper_common::getUserProfessionalPhoto(Auth_UserAdapter::getIdentity()->getId(), 3);
	    		$ret_r['comment_count'] = $comment_count;
	    		$ret_r['wp_id'] = $wall_post_obj->getId();
	    		$ret_r['created_at'] = Helper_common::nicetime( $comments_obj->getCreated_at()->format( "Y-m-d H:i:s" ));
	    		echo Zend_Json::encode($ret_r);
    		}
    		else
    		{
    			echo Zend_Json::encode(2);
    			die;
    		}	
		}
		else 
		{
			echo Zend_Json::encode(0);
		}
		die;
	}
	
	/**
	 * function used to edit the particular basic info.
	 * Made for Ajax  call. 
	 *
	 * @author dsingh , jsingh7
	 * @version 1.0
	 *
	 */
	public function saveSupportedSkillsAction()
	{
			// action body
			$supporter_id = Auth_UserAdapter::getIdentity()->getId();
			$params = $this->getRequest()->getParams();
			$skill_user_id = $params['user_id'];
			$skill_id = $params['skill_id'];
			$temp_r = array();

			$userObj = Extended\ilook_user::getRowObject($supporter_id);
			
			@$filename=REL_IMAGE_PATH."/profile/big_thumbnails/thumbnail_".$userObj->getProfessional_image();
			if($userObj->getProfessional_image()!="" && file_exists($filename)){
				$img_name=IMAGE_PATH."/profile/big_thumbnails/thumbnail_".$userObj->getProfessional_image();
			}
			else{
				if($userObj->getGender()==Extended\ilook_user::USER_GENDER_MALE){
					$img_name=IMAGE_PATH."/profile/default_profile_image_male_big.png";
				}
				else{
					$img_name=IMAGE_PATH."/profile/default_profile_image_female_big.png";
				}
			}
			
			// Get User profile Information
			 $userinfo = \Extended\ilook_user::getUserInformation($supporter_id);
			 $userinfo['profile_photo'] = $img_name; 

	        if( $this->didIAlreadySupported( $supporter_id, $skill_user_id, $skill_id ))
	        {
	        	//I have already supported this skill of this user.
	           $no_of_supporters = \Extended\user_skills::unSupportSomebodysSkill( $supporter_id, $skill_id, $skill_user_id );
	        	$userinfo['no_of_supporters'] = $no_of_supporters;
	        	$userinfo['support_type'] = 0;
	        	echo Zend_Json::encode( $userinfo );
	        }
	        else
	        {
	        	$no_of_supporters = \Extended\user_skills::supportSomebodysSkill( $supporter_id, $skill_id, $skill_user_id );
	        	//echo Zend_Json::encode( $no_of_supporters );
	        	$userinfo['no_of_supporters'] = $no_of_supporters;
	        	$userinfo['support_type'] = 1;
	        	echo Zend_Json::encode( $userinfo );
	        }
        	die;
	}
	
	/**
	 * function used to check if a user has alrady supported a skill or not 
	 * Made for Ajax  call.
	 * @ integer $supporter_id id of person who is supporting a skill, logged in user
	 * @ integer $skill_user_id id of person whos skills is being supported.
	 * @ integer $skill_id id of skill being supported 
	 * @author dsingh , jsingh7
	 * @version 1.0
	 *
	 */
	public function didIAlreadySupported( $supporter_id , $skill_user_id, $skill_id )
	{
		$supporter_r = \Extended\user_skills::getUserSkillSupporters($skill_user_id, $skill_id);
		
		if( $supporter_r )
		{
			//$supporter_r = explode(",",$supporter_r);
			if( in_array(Auth_UserAdapter::getIdentity()->getId(), $supporter_r) )
			{
				return TRUE;
			}
			else
			{
				return FALSE;
			}
		}
		else
		{
			return FALSE;
		}	
	}
	
    /**
	 * function used to show listing of user albums.
	 * 
	 * @author sgandhi, spatial, hkaur5
	 * @version 1.2
	 * 
	 */
	public function photoAlbumsProfileListingAction()
	{
		$photo_album = array ();
		$finalArr=array();
		
		$params = $this->getRequest()->getParams();
		
		$logged_in_user_id = Auth_UserAdapter::getIdentity()->getId();
		$userObj = Extended\ilook_user::getRowObject( $params['uid'] );
		
		$user_album_count = \Extended\socialise_album::getUsersCountOfAlbum($params['uid']);
		
		
		$albums = array();
		if( $user_album_count )
		{
			//Code added by jsingh7=================
			$all_viewable_albums = \Extended\socialise_album::getAllAlbumIdsByPrivacy( $params['uid'], $logged_in_user_id );
			
			$offset = ( intval( $params['page'] ) - 1 ) * intval( $params['limit'] );
			
			$all_viewable_albums_fragment = array_slice($all_viewable_albums, $offset, $params['limit']);
			
			$total_fragments = ceil( count($all_viewable_albums)/ $params['limit'] );
			if($all_viewable_albums_fragment)
			{
				$albums = \Extended\socialise_album::getDetailOfAlbums( $all_viewable_albums_fragment );
			}
			$finalArr['is_there_more_albums'] = 1;
			
			if( $total_fragments == $params['page'] )
			{
			    $finalArr['is_there_more_albums'] = 0;
			}
			//====================================		
		}
		
		
		//If array collection is available.
		if(	$albums )
		{
			foreach( $albums as $key=>$album )
			{
				$album_cover  = Extended\socialise_photo::getCover( $album->getId() );//Geting cover photo of album.
				$photo_album ['id'] = $album->getId();//Id of album.
				$photo_album ['uid'] = $userObj->getId();//Id of owner of album.
				$photo_album ['photo_count'] = \Extended\socialise_photo::countAlbumImages($album->getId());//photo count of album.
				
				//if album_name is DEFAULT then store album name as album_default else append underscore and timestamp.
				if(strtolower( $album->getAlbum_name()) == strtolower(\Extended\socialise_album::DEFAULT_ALBUM_NAME)
					|| $album->getAlbum_name() == \Extended\socialise_album::PROFILE_PHOTOS_ALBUM_NAME
					|| $album->getAlbum_name() == \Extended\socialise_album::COVER_PHOTOS_ALBUM_NAME
				)
				{
					$albName= strtolower($album->getAlbum_name());
				}
				else
				{
					$albName = $album->getAlbum_name()."_".$album->getCreated_at_timestamp()->getTimestamp();
				}
			
				//Storing album_name.
				$photo_album ['alb_name'] =	$photo_album ['album_name'] = ucfirst(strtolower($album->getAlbum_display_name()));
				
				if( $album_cover )
				{
					//putting album name from $album_cover array into photo_album array.
					$realPath=REL_IMAGE_PATH."/albums/user_".$params['uid']."/album_".$albName."/gallery_thumbnails/thumbnail_".$album_cover->getImage_name();
					
					if($album_cover->getImage_name()!="" && file_exists($realPath))
					{
						$photo_album ['socialise_albums_socialise_photo'] =IMAGE_PATH."/albums/user_".$params['uid']."/album_".$albName."/gallery_thumbnails/thumbnail_".$album_cover->getImage_name();
					}
					else
					{
						$photo_album ['socialise_albums_socialise_photo'] = IMAGE_PATH."/no_image.png";
					}
				}
				else 
				{
					$photo_album ['socialise_albums_socialise_photo'] = IMAGE_PATH."/no_image.png";
				}
				//Putting photo_album array into final array.
				$finalArr["album_info"][] = $photo_album;
			}
			
			$finalArr["albums_owner_name"] = $userObj->getFirstname()." ".$userObj->getLastname();
		}
	
		//if user viewing his/her own profile and does not added any albums.
		else if( !$all_viewable_albums && $params['uid']== $logged_in_user_id )
		{
			$finalArr["login_user_no_album_msg"] = "You have not added any album";
		}
		//if profile holder has not added any albums and some other user is viewing his/her profile.
		else if($user_album_count == 0  && $params['uid']!= $logged_in_user_id )
		{
			$finalArr["not_a_login_user_no_album_msg"]= "has not added albums.";
			$finalArr['albums_owner_name'] = $userObj->getFirstname()." ".$userObj->getLastname();
		}
		//if profile holder has not shared any album with current user.
		else if( !$all_viewable_albums && $params['uid'] != $logged_in_user_id && $user_album_count > 0 )
		{
			$finalArr["not_a_login_user_no_album_msg"] = "does not share any albums with you.";
			$finalArr['albums_owner_name'] = $userObj->getFirstname()." ".$userObj->getLastname();
		}
		
		//else just store album_owner_name in photo_album array.
		else 
		{
			$finalArr["albums_owner_name"] = $userObj->getFirstname()." ".$userObj->getLastname();
		}
		
		echo Zend_Json::encode($finalArr);
		die;
	}
		
	
	/**
	 * Used for ajax call.
	 * Returns image comments for the user.
	 *
	 *@author nsingh3
	 *@version 1.0
	 */
	public function getPhotoDetailCommentsAction()
	{
		$params = $this->getRequest()->getParams();
		$photo_id = $params['photo_id'] ;
		$photo_posted_by_user_id = $params['album_posted_by'];
		$limit = $params['limit'];
		
// 		$wall_post_id = \Extended\wall_post::checkWallpostByPhotoNUser(Auth_UserAdapter::getIdentity()->getId(), $photo_id , $photo_posted_by_user_id);
		
		echo Zend_Json::encode( \Extended\comments::getCommentsForPhotoDetail( $photo_id, $params['offset'], $limit ) );
		die;
	}
	
	/**
	 * function used to show listing of links
	 * 
	 * @author shaina, spatial
	 * @version 1.0
	 *
	 */
	public function linksProfileListingAction()
	{
		$params=$this->getRequest()->getParams();
		$current_user = Auth_UserAdapter::getIdentity()->getId();
		if( $params['uid'] )//User ID
		{
			$this->view->userId=$params['uid'];
			$userObj = Extended\ilook_user::getRowObject($params['uid']);
			//if user not found, redirect to error page.
			if(!$userObj)
			{
				$this->_helper->redirector('is-not-available', 'error', 'default' );
			}
			//if user is login user, means he is viewing his own profile.
			else if( Auth_UserAdapter::getIdentity()->getId() == $params['uid'] )
			{
				$userObj = Auth_UserAdapter::getIdentity();
				$this->view->loginUserAlbum=true;// variable to check that user is owner or not.
			}
	
		}
		//If no uid in URl.
		else
		{
			$this->view->userId="";
			$userObj = Auth_UserAdapter::getIdentity();
			$this->view->loginUserAlbum=true;
		}
		$links = \Extended\ilook_user::getLinksOfUser($userObj->getId());

		$gridViewIDEnabled = NULL;
		if($params['uid']==Auth_UserAdapter::getIdentity()->getId())
		{
			$gridViewIDEnabled = 1;
		}
		if($links)
		{
			// links detail.
			for( $i = 0;$i < count($links); $i++ )
			{
				$linkArr[] = $links[$i]->getId();
			}
			
			//============================================================
			//	Fetching users(array) I have blocked and users who have blocked me,
			// 	to eliminate this array elements from links.
			//============================================================
			
			//Gettting users I have blocked.
			$blocked_user_ids_arr = \Extended\blocked_users::getAllBlockersAndBlockedUsers($current_user);

			if($blocked_user_ids_arr)
			{
				$filtered_linkArr = array_diff($linkArr, $blocked_user_ids_arr);
			}
			else
			{
				$filtered_linkArr = $linkArr;
			}

			//============================================================
			//	Ends 
			//============================================================
			
			$links_arr = Helper_common::displayUsersGridView(Auth_UserAdapter::getIdentity()->getId(),$filtered_linkArr,0,$gridViewIDEnabled);
			
			$mutual_link_status = 1;
       		if(Auth_UserAdapter::getIdentity()->getId() == $params['uid'])
       		{
       			$mutual_link_status = 0;
       		} 
       	
       			echo Zend_Json::encode(array("my_profile"=>0, "links"=>$links_arr,
       					"mutual_status"=>$mutual_link_status,"profile_holder_id"=>$params['uid']));
       		die;
		 
		}	
		else
		{
			if(Auth_UserAdapter::getIdentity()->getId() == $params['uid'])
			{
				echo Zend_Json::encode(array("my_profile"=>1, "links"=>''));
			}
			else
			{
				echo Zend_Json::encode(array("my_profile"=>0, "links"=>''));
			}
			die;
		}
	}

	/**
	 * ??????????????????????????????
	 *
	 * @version ?
	 * @author unknown
	 */
	public function mutualLinksListingAction()
	{
		$params=$this->getRequest()->getParams();
		$gridViewIDEnabled = NULL;
		if($params['uid']==Auth_UserAdapter::getIdentity()->getId()){
			$gridViewIDEnabled = 1;
		}
		// mutual links detail...
		$mutual_arr=\Extended\ilook_user::getMutualLinks(Auth_UserAdapter::getIdentity()->getId(), $params['uid']);
		
		$mutual_link_status = 1;
		if(Auth_UserAdapter::getIdentity()->getId()==$params['uid'])
		{
			$mutual_link_status = 0;
		}
		$mutual_links_arr = array();
		if( $mutual_arr ) {
			for($i=0;$i<count($mutual_arr);$i++)
			{
				$mutual_link = \Extended\ilook_user::getRowObject($mutual_arr[$i]);
				$mutualLinksArr[] = $mutual_link->getId();
				$mutual_links_arr = Helper_common::displayUsersGridView(Auth_UserAdapter::getIdentity()->getId(),$mutualLinksArr,0,$gridViewIDEnabled);

			}
		}

		echo Zend_Json::encode(array("mutual_links"=>$mutual_links_arr));
		die;
	}
	
	
	/**
	 * Fetches record of users who has shared photo and 
	 * sends user info array to ajax call.
	 * @author hkaur5
	 * @return json array
	 * @version
	 */
	public function getWhoSharedPhotoAction()
	{
		$user_id_arr = array();
		$user_info = array();
		$is_more_records = "";

		if($this->getRequest()->getParam( 'photo_id' )){
			if( \Extended\socialise_photo::getRowObject( $this->getRequest()->getParam( 'photo_id' ) )){
				$ppl_who_shared = \Extended\share::getDistinctUserRecordsByWallpostIdOrALbumIdOrPhotoId($this->getRequest()->getParam( 'photo_id' ),3);
				if($ppl_who_shared) {

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
							$user_info[$key]["mutual_count"] =  "Me";
						}
						else{
							$user_info[$key]["mutual_count"] =  $mutualFrdsCount;
						}
						$user_info[$key]["user_id"] = $user->getId();
						$user_info[$key]["user_image"] = \Helper_common::getUserProfessionalPhoto($user->getId(), 3);
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
			else{
				echo Zend_Json::encode( 0 );
			}
			} else {
				echo Zend_Json::encode( 0 );
			}
		}
		else{
			echo Zend_Json::encode( 0 );
		}
		die;
	}
	
	/**
	 * function used to get the list of another Albums from current Album 
	 * According to current user id.
	 * @author spatial
	 * @version
	 */
	public function getOtherAlbumsForUserAction(){
		$finalArr=array();
		$params = $this->getRequest()->getParams();
		$resultArr=Extended\socialise_album::getRemainingAlbumListing($params["albumID"], Auth_UserAdapter::getIdentity()->getId());
		for($i=0;$i<count($resultArr);$i++)
		{
			$finalArr[$i]=array("id"=>$resultArr[$i]['id'],"album_name"=>$resultArr[$i]['album_display_name']);
		}
		echo Zend_Json::encode($finalArr);
		die;
	}
	
	/**
	 * function used to Move photo to other album.
	 * @author spatial
	 * @version
	 */
	public function movePhotoToOtherAlbumAction()
	{
		$params = $this->getRequest()->getParams();
		$em = \Zend_Registry::get('em');
		$photoObj=$em->find('\Entities\socialise_photo',$params["photoID"]);
		$albumObj = $em->find('\Entities\socialise_album',$params["albumID"]);
		$oldAlbumObj = $em->find('\Entities\socialise_album',$params["prevAlbumID"]);
		$target_path = REL_IMAGE_PATH."/albums/"."user_".Auth_UserAdapter::getIdentity()->getId()."/album_";
		
		// gallery thumbnails image paths..
		$galleryImgSour=$target_path.$oldAlbumObj->getAlbum_name()."_".$oldAlbumObj->getCreated_at_timestamp()->getTimestamp()."/gallery_thumbnails/thumbnail_".$photoObj->getImage_name();
		$galleryImgDest=$target_path.$albumObj->getAlbum_name()."_".$albumObj->getCreated_at_timestamp()->getTimestamp()."/gallery_thumbnails/thumbnail_".$photoObj->getImage_name();
		
		// popup thumbnails image paths..
		$popupImgSour=$target_path.$oldAlbumObj->getAlbum_name()."_".$oldAlbumObj->getCreated_at_timestamp()->getTimestamp()."/popup_thumbnails/thumbnail_".$photoObj->getImage_name();
		$popupImgDest=$target_path.$albumObj->getAlbum_name()."_".$albumObj->getCreated_at_timestamp()->getTimestamp()."/popup_thumbnails/thumbnail_".$photoObj->getImage_name();
		
		// wall thumbnails image paths..
		$wallImgSour=$target_path.$oldAlbumObj->getAlbum_name()."_".$oldAlbumObj->getCreated_at_timestamp()->getTimestamp()."/wall_thumbnails/thumbnail_".$photoObj->getImage_name();
		$wallImgDest=$target_path.$albumObj->getAlbum_name()."_".$albumObj->getCreated_at_timestamp()->getTimestamp()."/wall_thumbnails/thumbnail_".$photoObj->getImage_name();
		
		// original thumbnails image paths..
		$originalImgSour=$target_path.$oldAlbumObj->getAlbum_name()."_".$oldAlbumObj->getCreated_at_timestamp()->getTimestamp()."/original_photos/".$photoObj->getImage_name();
		$originalImgDest=$target_path.$albumObj->getAlbum_name()."_".$albumObj->getCreated_at_timestamp()->getTimestamp()."/original_photos/".$photoObj->getImage_name();
		
		// update into the database
		$resultArr=\Extended\socialise_photo::moveImageToOtherAlbum(Auth_UserAdapter::getIdentity()->getId(), $params["albumID"], $params["photoID"]);
		if($resultArr)
		{
			
			// move gallery thumbnails...
			@copy($galleryImgSour, $galleryImgDest);
			@unlink($galleryImgSour);
			
			// move wall thumbnails...
			@copy($wallImgSour, $wallImgDest);
			@unlink($wallImgSour);
			
			// move popup thumbnails...
			@copy($popupImgSour, $popupImgDest);
			@unlink($popupImgSour);
			
			// move orignal thumbnails...
			@copy($originalImgSour, $originalImgDest);
			@unlink($originalImgSour);
			echo Zend_Json::encode(1);
		}
	die;
	}
	
	/**
	 * function used to make as album cover photo.
	 * @author spatial
	 * @version
	 */
	public function makeAsCoverPhotoAction(){
		$params = $this->getRequest()->getParams();
		$resultArr=\Extended\socialise_photo::makeImageAsCover(Auth_UserAdapter::getIdentity()->getId(), $params["albumID"], $params["photoID"]);
		if($resultArr){
			echo Zend_Json::encode(1);
		}
		else{
			echo Zend_Json::encode(0);
		}
		die;
	}
	
	/**
	 * function used to update the comment of photo
	 * According to current current comment id.
	 * !-- Not in use --!
	 * @deprecated
	 * @author nsingh3
	 * @version
	 */
	public function editCommentAction()
	{
		$params = $this->getRequest()->getParams();
		
		$zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
		$comment_text_filtered = $zend_filter_obj->filter( ($params['comment_text']) );
		
		echo Zend_Json::encode( \Extended\comments::editComment( $params['comment_id'], nl2br($comment_text_filtered) ) );
		die;
	}
	
	/**
	 * Used for deleting the comment.
	 * Delete rocords regarding comments from following tables:
	 * 1.Comments
	 * 2.socialise_photo
	 * 3.users_comments_visibility
	 *
	 * @author nsingh3
	 * @version
	 */
	public function deleteCommentAction()
	{
		
		if( $this->getRequest()->getParam('comment_id') )
		{
			$is_deleted = \Extended\comments::deleteComment( $this->getRequest()->getParam('comment_id'), Auth_UserAdapter::getIdentity()->getId() );
			if( $is_deleted )
			{
				//get photo object
				$photo_obj = \Extended\socialise_photo::getRowObject($this->getRequest()->getParam('photo_id'));
				
				//setting comment count for photo.
				$comment_on_photo_count = \Extended\socialise_photo::commentCountDecreament( $this->getRequest()->getParam('photo_id'));
	
			}
			//removing hide comment records.
			\Extended\users_comments_visibility::unhideComment( $this->getRequest()->getParam('comment_id') );
		
			if( $is_deleted  && $comment_on_photo_count )
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
	 * Hides user comment from photo detail.
	 * 
	 * @author unknown
	 * @version
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
	 * Deletes photo.
	 * 
	 * @author jsingh7
	 * @version 1.0
	 */
	public function deleteAlbumPhotoAction()
	{
		// delete photo from socialise_photo
		$result = \Extended\socialise_photo::deletePhoto( $this->getRequest()->getParam("photoID"), Auth_UserAdapter::getIdentity()->getId() );
		if($result):
			echo Zend_Json::encode(1);
		else:
			echo Zend_Json::encode(0);
		endif;
		die;
	}
	
	/**
	 * Deletes albums all photo and album itself.
	 *
	 * @author hkaur5
	 * @version 1.0
	 */
	public function deleteMyAlbumAction()
	{
		// delete photo from socialise_photo
		$params = $this->getRequest()->getParams();
		$logged_in_user_id  = Auth_UserAdapter::getIdentity()->getId();
		$album_id = $params['album_id'];
		$album_obj = \Extended\socialise_album::getRowObject($album_id);
		if($album_obj)
		{
			//Check if current user is owner of album
			if( $logged_in_user_id == $album_obj->getSocialise_albumIlook_user()->getId() )
			{
				//Get array of photos of current album.
				$albums_photos_arr = \Extended\socialise_photo::getPhotosByUserIdNAlbumId( $logged_in_user_id, $album_id ); 
				
				$photo_count_of_album = \Extended\socialise_photo::countAlbumImages( $album_id );
				
				//If there are any photos in album
				if($albums_photos_arr)
				{
					foreach( $albums_photos_arr['data'] as $albums_photo )
					{
						\Extended\socialise_photo::deletePhoto( $albums_photo['id'], $logged_in_user_id );
					}
				}
				
				\Extended\socialise_album::deleteAlbum( $album_id );
// 				Zend_Debug::dump( $album_deleted );
// 				echo '<br>';
// 				Zend_Debug::dump( $photos_deleted );
// 				die;
				echo Zend_Json::encode(1);
			}
		}
		else
		{
			echo Zend_Json::encode(1);
		}
		die;
		
	}
	
	/**
	 * add-description-to-the-photo
	 * @author nsingh3
	 * @var 1.0
	 */
	public function addDescriptionToThePhotoAction()
	{
		$params = $this->getRequest()->getParams();
		//echo "<pre>"; print_r($params); 
		if($params['photo_text']!=""){
			if($params['photo_id'] && $params['photo_text'])
			{
				$result = \Extended\socialise_photo::editDescription( $params['photo_id'],  addslashes($params['photo_text']) );
				if($result){
					echo Zend_Json::encode($result);
					die;
				}else{
					echo Zend_Json::encode(0);
					die;
				}
			}
			else 
			{
				echo Zend_Json::encode(0);
			}			
		}
		else{
			echo Zend_Json::encode(2);
		}
		die;
	}
	/**
	 * get-companies list for job section
	 * @author spatial
	 * @version 1.0
	 */
	public function getAllCompaniesAction()
	{
		$allCompanies = \Extended\company::getAllCompanies( $this->getRequest()->getParam('term') );
		$temp = array();
		if($allCompanies)
		{
			foreach ( $allCompanies as $key=>$com )
			{
				$temp[$key]['id']    = $com->getId();
				$temp[$key]['label'] = Helper_common::showCroppedText($com['name'], 67);
				$temp[$key]['value'] = $com->getName();
			}
		}
		echo Zend_Json::encode($temp);
		die;
	}
	
	/**
	 * getPhotoThumbPathAction is used to get the thumb photo url for sharing popup of photo detail
	 * @author nsingh3,sjaiswal
	 * @var 1.1
	 */
	public function getPhotoThumbPathAction()
	{
		$params = $this->getRequest()->getParams();
		$imgObj = \Extended\socialise_photo::getRowObject($params['photo_id']);
		if( $imgObj )
		{	
			$albumName = $imgObj->getSocialise_photosSocialise_album()->getAlbum_name(); 
			
			if( strtolower( $albumName ) == strtolower( \Extended\socialise_album::DEFAULT_ALBUM_NAME ) )
			{
				$imgThumbPath = IMAGE_PATH."/albums/user_".$params['photo_posted_by']."/album_default/gallery_thumbnails/thumbnail_".$imgObj->getImage_name();
			}
			elseif(strtolower( $albumName ) == strtolower( \Extended\socialise_album::PROFILE_PHOTOS_ALBUM_NAME))
			{	
				$imgThumbPath = IMAGE_PATH."/albums/user_".$params['photo_posted_by']."/album_".$albumName."/gallery_thumbnails/thumbnail_".$imgObj->getImage_name();;
			}
			else	
			{
				$imgThumbPath = IMAGE_PATH."/albums/user_".$params['photo_posted_by']."/album_".str_replace(" ", "%20", $albumName."_".$imgObj->getSocialise_photosSocialise_album()->getCreated_at_timestamp()->getTimestamp() )."/gallery_thumbnails/thumbnail_".$imgObj->getImage_name();
			}
		}
		else
		{
			//Photo doesnot exist.
			echo Zend_Json::encode(2);
			die;
		} 
		echo Zend_Json::encode($imgThumbPath);
		die;
	}
	
	/**
	 * Get detail of the photo.
	 * This action is for ajax call.
	 * 
	 * @author Spatial, Jsingh7
	 * @version 1.1
	 */
	public function getPhotoDetailAction()
	{
		$params = $this->getRequest()->getParams();
		//Get users blocked and users who have blocked logged in user.
		$blocked_user = \Extended\blocked_users::getAllBlockersAndBlockedUsers(Auth_UserAdapter::getIdentity()->getId());
// 		Zend_Debug::dump($params);
		//Check which parameter is received?
		if( isset( $params["photo_id"] ) && $params["photo_id"] != "" )
		{
			$photo_id = $params["photo_id"];
			$photo_obj = \Extended\socialise_photo::getRowObject( $params["photo_id"] );
		
			if(!$photo_obj)
			{
				echo Zend_Json::encode(2);
				die;
			}
		}
		elseif ( isset( $params["wallpost_id"] ) && $params["wallpost_id"] != "" )
		{
			$wallpost_obj = \Extended\wall_post::getRowObject( $params["wallpost_id"] );
		
			if( $wallpost_obj )
			{
				$photo_id = $wallpost_obj->getSocialisePhoto()->getId();
			}
			else 
			{
				//Wallpost doesnot exist.
				echo Zend_Json::encode(2);
				die;
			}
		}
		
		//Get photo detail.
		$result = Helper_photoAlbums::getPhotoDetailInfo( $photo_id, Auth_UserAdapter::getIdentity()->getId(), $blocked_user );
		if( $result )
		{
			echo Zend_Json::encode($result);
		}
		else
		{
			echo Zend_Json::encode(2);
		}		
		die;
	}
	
	
	/**
	 * get next photo detail....
	 * @author Sunny patial
	 */
	public function getNextPhotoDetailAction()
	{
		$params = $this->getRequest()->getParams();
		// get photo detail..
		$photoID = \Extended\socialise_photo::getNextPhotoID($params["photo_id"]);
		$result = Helper_photoAlbums::getPhotoDetailInfo($photoID, Auth_UserAdapter::getIdentity()->getId());
		echo Zend_Json::encode($result);
		die;
	}
	/**
	 * get previous photo detail..
	 * @author Sunny patial
	 */
	public function getPreviousPhotoDetailAction(){
		$params = $this->getRequest()->getParams();
		// get photo detail..
		$photoID = \Extended\socialise_photo::getPrevPhotoID($params["photo_id"]);
		$result = Helper_photoAlbums::getPhotoDetailInfo($photoID, Auth_UserAdapter::getIdentity()->getId());
		echo Zend_Json::encode($result);
		die;
	}
	/**
	 * @author Sunny Patial
	 */
	public function downloadFileAction()
	{
		$params = $this->getRequest()->getParams();
		// directory name..
		$directory = $params["directory"];		
		// file name..
		$file =  $params["file"];
		// file name..
		$userDirectory =  "user_".$params["uid"];
		// download directory..
		$download_path = REL_IMAGE_PATH."/albums/".$userDirectory.'/'.$directory."/original_photos/";
		// create array with file information
		$args = array(
				'download_path'		=>	$download_path,
				'file'				=>	$file,
				'extension_check'	=>	TRUE,
				'referrer_check'	=>	FALSE,
				'referrer'			=>	NULL,
		);
		
		$download = new Helper_DownloadFile( $args );
		// Pre Download Hook
		$download_hook = $download->get_download_hook();
		// Download
		if( $download_hook['download'] == TRUE ) 
		{
			// Let's download file 
			$download->get_download();
		}
		die;
	}
	/**
	 * @author Sunny Patial
	 */
	public function savePhotoDescriptionAction()
	{
		$params = $this->getRequest()->getParams();
		// photo ID..
		$photoID = $params["photo_id"];
		// photo Description..
		$photoDesc = $params["desc"];
		$result = \Extended\socialise_photo::editDescription($photoID, $photoDesc);
		if($result){
			echo Zend_Json::encode(1);
		}
		else{
			echo Zend_Json::encode(0);
		}
		die;
	}
	/**
	 * Fetch remaining comments of photo.
	 * @author spatial
	 * @return json encoded photo comments array.
	 */	
	public function getPhotoMoreCommentsAction()
	{
		$params = $this->getRequest()->getParams();
		
		//Get users blocked and users who have blocked logged in user.
		$blocked_user = \Extended\blocked_users::getAllBlockersAndBlockedUsers(Auth_UserAdapter::getIdentity()->getId());

		// photo ID..
		$photoID = $params["photo_id"];
		// photo offset..
		$photoOffset = $params["offset"];
		$numberOfRecords = $params["nor"];
		//Getting latest five comments of user.
		$latest_five_comments = \Extended\comments::getCommentsForPhotoDetail( $photoID, $photoOffset, $numberOfRecords, \Auth_UserAdapter::getIdentity()->getId(),$blocked_user );
		
		if($latest_five_comments[data])
		{
			foreach ( $latest_five_comments[data] as $keyy=>$comment )
			{
				$photo_detail_info["latest_five_comments"][$keyy]["comment_id"] = $comment["comment_id"];
				$photo_detail_info["latest_five_comments"][$keyy]["same_comment_id"] = $comment["same_comment_id"];
				$photo_detail_info["latest_five_comments"][$keyy]["commenter_name"] = $comment["comment_user_name"];
				$photo_detail_info["latest_five_comments"][$keyy]["commenter_id"] = $comment["comment_user_id"];
				$photo_detail_info["latest_five_comments"][$keyy]["comment_text"] = $comment["comment_text"];
				$photo_detail_info["latest_five_comments"][$keyy]["comment_profes_image"] = $comment["comment_profes_image"];
				$photo_detail_info["latest_five_comments"][$keyy]["created_at"] = $comment["created_at"];
				$photo_detail_info["latest_five_comments"][$keyy]["is_my_comment"] = $comment["is_my_comment"];
				$photo_detail_info["latest_five_comments"][$keyy]["is_hidden"] = $comment["is_hidden"];
			}
			$photo_detail_info["is_there_more_comments"] = $latest_five_comments["is_there_more_recs"];
		}

		echo Zend_Json::encode($photo_detail_info);
		die;
	}
	/**
	 * Send notifications on ok the wallpost
	 * @author hkaur5
	 */
	public function sendOkNotification()
	{
		//getting the wall post object.
		$wall_post_obj = \Extended\wall_post::getRowObject( $this->getRequest()->getParam( 'wallpost_id' ) );
		 
		//Making a entry to like table for wallpost.
		$result = \Extended\notifications::addNotificationsOnOkTheWallpost( Auth_UserAdapter::getIdentity()->getId(), $wall_post_obj->getId() );
		if ($result)
		{
			echo Zend_Json::encode(true);
			die;
		}
	}
	/**
	 * Send email of shared post to individual seleted link's email
	 * @author Unknown
	 * @return zend encoded json
	 */
	public function sendLinkToInvidualEmailAction()
	{
		$params = $this->getRequest()->getParams();
		$subject = Email_Mailer::SUBJECT_SHARE_POST;
		$photoID  = $params["photo_id"];
		$photoObj = \Extended\socialise_photo::getRowObject($photoID);
		$shareMSG  = $params["share_text_msg"];
		$c_userID = Auth_UserAdapter::getIdentity()->getId();
		$c_userObj = \Extended\ilook_user::getRowObject($c_userID);
		$c_username = $c_userObj->getFirstname()." ".$c_userObj->getLastname();
		$bodyText =
		'<table width="800" border="0" cellspacing="0" cellpadding="0" align="center" style="font-family:Arial, Helvetica, sans-serif;">
		<tr>
		<td valign="top" style="background:#fff; padding-bottom:20px;"><table width="100%" border="0" cellpadding="10" cellspacing="0">
		<br />
		<p style="margin:0 20px 0 0; padding:0; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#3a3a3a ">
		'+$c_username+' has shared the photo, that you be interested in.
		</p>
		<br />
		<p style="margin:0 20px 0 0; padding:0; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#3a3a3a ">
		'.$shareMSG.'
		</p>
		<br />
		<p style="margin:0 20px 0 0; padding:0; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#3a3a3a ">Please click on this link: </p>
		<br />
		<a href="'.PROJECT_URL.'/'.PROJECT_NAME . "profile/photo-detail/id/" . $photoID.'" style="margin:0 0 0 0; text-decoration:none; padding:0; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#b084e9 ">'. PROJECT_URL."/".PROJECT_NAME . "profile/photo-detail/id/" . $photoID. '</a>
		<br />
		<br />
		<p style="margin:0 20px 0 0; padding:0; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#3a3a3a ">If you are unable to click on the link, you can also copy the URL and paste
		it into your browser manually </p>
		<br /><br />
		</td>
		</tr>
		</table>';
		$userArr = explode(",",$params["receiver_id"]);
		$filteredArr = array_unique($userArr);
		$iMailMsg = array();
		for($i=0;$i<count($filteredArr);$i++)
		{
			$userObj = \Extended\ilook_user::getRowObject($filteredArr[$i]);
			$msg_receiver = $userObj->getFirstname()." ".$userObj->getLastname();
			$photoArr = array();
			$usrIDArr = array($filteredArr[$i]); 
			//Zend_Debug::dump($photoObj->getPhotoGroup());
			//Zend_Debug::dump($photoObj->getSocialise_photosSocialise_album()->getId());
			
			if($photoObj->getWallPost())
			{
			$photoArr["wallpost_id"] = $photoObj->getWallPost()->getId();
			}
			
			//if album_name is DEFAULT then store album name as album_default else append underscore and timestamp.
			if(strtolower( $photoObj->getSocialise_photosSocialise_album()->getAlbum_name()) == strtolower(\Extended\socialise_album::DEFAULT_ALBUM_NAME)
					|| $photoObj->getSocialise_photosSocialise_album()->getAlbum_name() == \Extended\socialise_album::PROFILE_PHOTOS_ALBUM_NAME
					|| $photoObj->getSocialise_photosSocialise_album()->getAlbum_name() == \Extended\socialise_album::COVER_PHOTOS_ALBUM_NAME
			)
			{
				$albName= strtolower($photoObj->getSocialise_photosSocialise_album()->getAlbum_name());
			}
			else
			{
				$albName = $photoObj->getSocialise_photosSocialise_album()->getAlbum_name()."_".$photoObj->getSocialise_photosSocialise_album()->getCreated_at_timestamp()->getTimestamp();
			}

			$photoArr["photo_id"] = $photoID;
			$photoArr["photo_path"] = IMAGE_PATH.'/albums/user_'.$photoObj->getSocialise_photosPosted_by()->getId().'/album_'.$albName.'/wall_thumbnails/thumbnail_'.$photoObj->getImage_name();
			$photoArr["photo_desc"] = $photoObj->getDescription();
			$iMailMsg = Helper_common::getPhotopostTemplateForMail(
																	$photoArr, 
																	$c_username,
												    				$msg_receiver,
																	$shareMSG
																	);
			$result = Helper_common::sendMessage($c_userID, $usrIDArr, $subject, $iMailMsg, Extended\message::MSG_TYPE_GENERAL, NULL, false, null, 1 );
		}
		// Record admin activity log on sharing photos with individual.
		if(\Zend_Registry::get('admin_logged_in_as_user'))
		{
			if($result)
			{	
				\Extended\admin_activity_log::addAdminActivityLog(\Zend_Registry::get('admin_logged_in_as_user'), \Auth_UserAdapter::getIdentity()->getId(), \Extended\admin_activity_log::MODULE_PHOTOS);
			}
		}
		echo Zend_Json::encode ( TRUE );
		die;
	}
	
	/**
	 * 
	 * 
	 * 
	 * @author jsingh7
	 * @version 1.0
	 */
	public function blockUserAction()
	{
		
		\Extended\blocked_users::addUsersInBlockList(
									array($this->getRequest()->getParam("user_to_be_blocked_id")), 
									Auth_UserAdapter::getIdentity()->getId());
		echo Zend_Json::decode(1);
		die;
	}
	
	/**
	 * Uploads photo for cover album in temp folder inside albums folder.
	 *
	 * @author hkaur5
	 * @version 1.0
	 */
	public function uploadCoverPhotoNGenrateThumbAction()
	{
		$current_user_id = Auth_UserAdapter::getIdentity()->getId();
		$current_user_obj = Auth_UserAdapter::getIdentity();
		$coverUserDirectory = REL_IMAGE_PATH.'\\cover_photo\\user_'.$current_user_id;
		
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
				Zend_Validate_File_Upload::INI_SIZE      => "The size of a file you trying to upload, exceeds 5MB, Please try smaller file"
		));
		
		//If file is not valid.
		if( !$adapter->isValid() )
		{
			$return_r['is_success'] = 0;
			foreach ( $adapter->getMessages() as $msg )
			{
				$return_r['msg'] = $msg.". ";
			}
			
			//So that if some error occur then previous cover photo can be retained.
			$return_r['set_prev_cover'] = 1;
			if($current_user_obj->getCoverPhoto())
			{
				$return_r['prev_cover_position'] = $current_user_obj->getCoverPhoto()->getY_position();
				$return_r['prev_cover_name'] = $current_user_obj->getCoverPhoto()->getName();
				
			}
			else
			{
				$return_r['prev_cover_default'] = 1;
				$return_r['user_gender'] = $current_user_obj->getGender();
			}
			echo Zend_Json::encode( $return_r );
			die;
		}
		else // uploading photos to user directory inside images>albums>temp>user_x, where x = user_id.
		{
			$file_info   =  $adapter->getFileInfo();
			$mime_type   =  $adapter->getMimeType();
			$temp_path   =  $file_info['file']['tmp_name'];//temp path, where from move.
			$fname       =  $file_info['file']['name'];
			$size        =  $adapter->getFileSize();
			$ts_img_name =  Helper_common::getUniqueNameForFile($fname);
	
			//Creating temp directory and directories inside temp folder.
			
			// If user's 'user_x' directory does not exist ( where x is user's id ).
			if ( !file_exists( $coverUserDirectory ) )
			{
				// create users user_x directory ( where x is user's id ).
				if( mkdir( $coverUserDirectory, 0777, true ) )
				{
					//Uploading file to original directory.
					$adapter->setDestination( realpath( $coverUserDirectory ) );
					$filterFileRename = new Zend_Filter_File_Rename( array( 'target' => $ts_img_name, 'overwrite' => true ));
					$adapter->addFilter( $filterFileRename );
					if( $adapter->receive() )
					{
						if(Helper_ImageResizer::smart_resize_image( $coverUserDirectory."/".$ts_img_name, NULL, 888, 0, true, $coverUserDirectory."/".$ts_img_name, false))
						{
					
							echo Zend_Json::encode($ts_img_name);
							die;
						}
					}
				}
			}
			else
			{
				//Uploading file to original directory.
				$adapter->setDestination( realpath( $coverUserDirectory ) );
				$filterFileRename = new Zend_Filter_File_Rename( array( 'target' => $ts_img_name, 'overwrite' => true ));
				$adapter->addFilter( $filterFileRename );
				if( $adapter->receive() )
				{
					if(Helper_ImageResizer::smart_resize_image( $coverUserDirectory."/".$ts_img_name, NULL, 888, 0, true, $coverUserDirectory."/".$ts_img_name, false))
					{
			
						
						echo Zend_Json::encode($ts_img_name);
						die;
					}
				}
			}
			
		}
	}
	
	/**
	 * 
	 */
	public function saveCoverPhotoAction()
	{
		$params = $this->getRequest()->getParams();
		$user_obj = Auth_UserAdapter::getIdentity();
		$user_id = Auth_UserAdapter::getIdentity()->getId();
		if($params['save_new_cover'])
		{
			$coverUserDirectory = REL_IMAGE_PATH.'\\cover_photo\\user_'.$user_id;
			//Deleting user's previously added cover photo once user has uploaded new cover photo.
			$files = glob($coverUserDirectory."/*"); // get all file names
			
			foreach($files as $file)// iterate files
			{
				//Replacing '/' with '\' so that we can match path of files with previously added photos.
				$file_name = str_replace('/', '\\', $file);
				//Deleting files which were previously added as cover photo.
				if(is_file($file) && $file_name != $coverUserDirectory.'\\'.$params['cover_img_name'])
				{
					unlink($file); // delete file
				}
			}
			$cover_photo_obj = \Extended\cover_photo::saveUserCoverPhoto( $user_obj, $params['cover_img_name'], 0,$params['img_position_top'] );
			self::uploadCoverPhotoToAlbum($cover_photo_obj->getName());
			
			if($cover_photo_obj)
			{
				
				echo Zend_Json::encode(array( "cover_photo_name"=>$cover_photo_obj->getName(), "y_position"=>$cover_photo_obj->getY_position(),'cover_photo_user_id'=>$user_id ) );
				
			}
			
			//Cover photo failed to save but some cover photo exist in database.
			else if(!$cover_photo_obj && $user_obj->getCoverPhoto() )
			{
				echo Zend_Json::encode(array("prev_covr_photo_name"=>$user_obj->getCoverPhoto()->getName(),"prev_cvr_photo_y_position"=>$user_obj->getCoverPhoto()->getY_position()));
			}
				
			//failed to save cover photo and no cover photo exist in database.
			//Set default cover photo.
			else if(!$cover_photo_obj && !$user_obj->getCoverPhoto())
			{
				echo Zend_Json::encode(array("user_gender"=>$user_obj->getGender()));
			}
			else
			{
				echo Zend_Json::encode(array("user_gender"=>$user_obj->getGender()));
			}
			
		}
		
		// Saving only position of previous cover photo.
		else
		{
			$y_position = $params['img_position_top'];
			$em = \Zend_Registry::get('em');
			$cover_photo_obj =	$em->getRepository( '\Entities\cover_photo' )->findOneBy( array( 'ilookUser' => $user_id ) );
			$cover_photo_obj->setY_position($y_position);
			$em->persist($cover_photo_obj);
			$em->flush();
			echo Zend_Json::encode(array( "cover_photo_name"=>$cover_photo_obj->getName(), "y_position"=>$cover_photo_obj->getY_position(),'cover_photo_user_id'=>$user_id ) );
		}
		die;
	}
	
	/**
	 * If cancel param's value is reposition then send database value of cover photo position
	 * else delete currently uploaded cover photo from directory and return
	 * previously set cover photo info .
	 * 
	 * @return array of cover photo info
	 * @author hkaur5
	 */
	public function cancelCoverPhotoChangesAction()
	{
		$params = $this->getRequest()->getParams();
		$user_obj = Auth_UserAdapter::getIdentity();
		$user_id = $user_obj->getId();
		if( $params['cancel'] == 'reposition')
		{
			if($user_obj->getCoverPhoto())
			{
				echo Zend_Json::encode(array("crnt_cvr_photo_y_position"=>$user_obj->getCoverPhoto()->getY_position()));
			}
			else
			{
				echo Zend_Json::encode(array("user_gender"=>$user_obj->getGender()));
			}
		}
		else if($params['cancel'] == 'uploading')
		{
			$cover_photo_path = REL_IMAGE_PATH.'\\cover_photo\\user_'.$user_id.'\\'.$params['cover_img_name'];
			
			//Delete cover photo uploaded currently.
			unlink($cover_photo_path);
			if( $user_obj->getCoverPhoto() )
			{
				echo Zend_Json::encode(array("prev_covr_photo_name"=>$user_obj->getCoverPhoto()->getName(),"prev_cvr_photo_y_position"=>$user_obj->getCoverPhoto()->getY_position()));
			}
			else
			{
				echo Zend_Json::encode(array("user_gender"=>$user_obj->getGender()));
			}
		}
		die;
	}
	
	public function deleteCoverPhotoAction()
	{
		$prms = $this->getRequest()->getParams();
		$user_id = Auth_UserAdapter::getIdentity()->getId();
		
		$coverUserDirectory = REL_IMAGE_PATH.'\\cover_photo\\user_'.$user_id;
		$files = glob($coverUserDirectory."/*"); // get all file names
		foreach($files as $file)// iterate files
		{
				unlink($file); // delete file
		}
		if(\Extended\cover_photo::deleteCoverPhotoByUserId($user_id))
		{
			echo Zend_Json::encode(array("deleted" => 1, "user_gender"=>Auth_UserAdapter::getIdentity()->getGender()));
		}
		else
		{
			echo Zend_Json::encode(array("not_delete" =>1, "user_gender"=>Auth_UserAdapter::getIdentity()->getGender()));
		}
		die;
	}
	
	/**
	 * Return data to ajax call for showing cover photo menu options.
	 * @author hkaur5
	 * @return jsonData 
	 */
	public function getMenuOptionsForCvrPhotoAction()
	{
		$prms = $this->getRequest()->getParams();
		$current_user_id = Auth_UserAdapter::getIdentity()->getId();
		$current_user_obj = Auth_UserAdapter::getIdentity();
		if(!$current_user_obj->getCoverPhoto() && $prms['cover_photo_name'] = "default_cover_photo.jpg")
		{
			echo Zend_Json::encode( 2 );
		}
		else if ( $current_user_obj->getCoverPhoto() && $prms['cover_photo_name'] != "default_cover_photo.jpg")
		{
			echo Zend_Json::encode( 1 );
		}
			
		die;
		
		
	}
	
	/**
	 * Posting profile photo on wall as a wallpost
	 * and saving it in album also.
	 * 
	 * @param string $profile_image_name
	 * 
	 * @author jsingh7
	 * @version 1.0
	 * 
	 */
	public static function uploadProfilePhotoToTheAlbum( $profile_image_name )
	{
		$return_r = array();
		$return_r['is_success'] = 0;
		$return_r['msg'] = "Process initiated";
		
		//creating or checking user profile pictures album directory to upload image.
		$user_id = Auth_UserAdapter::getIdentity()->getId();
		$userDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$user_id;
		$userAlbumDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$user_id.'\\album_profile_photos';
		$galleryDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$user_id.'\\album_profile_photos\\gallery_thumbnails';
		$wallDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$user_id.'\\album_profile_photos\\wall_thumbnails';
		$popupDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$user_id.'\\album_profile_photos\\popup_thumbnails';
		$originalDirecory = REL_IMAGE_PATH.'\\albums\\user_'.$user_id.'\\album_profile_photos\\original_photos';
		
		// if original Directory is missing create it
		if ( !file_exists( $originalDirecory ) )
		{
			mkdir( $originalDirecory, 0777, true );
		}
		// if popup Directory is missing create it 
		if ( !file_exists( $popupDirectory ) )
		{
			mkdir( $popupDirectory, 0777, true );
		}
		// if wall Directory is missing create it
		if ( !file_exists( $wallDirectory ) )
		{
			mkdir( $wallDirectory, 0777, true );
		}
		// if gallery Directory is missing create it
		if ( !file_exists( $galleryDirectory ) )
		{
			mkdir( $galleryDirectory, 0777, true );
		}
		

			
		// Creating directories 
		// If main user directory is missing, then create it
		if ( !file_exists( $userDirectory ) )
		{
			if( mkdir( $userDirectory, 0777, true ) )
			{
				if( mkdir( $userAlbumDirectory, 0777, true ) )
				{
					if( copy( REL_IMAGE_PATH.'/profile/popup_thumbnails/thumbnail_'.$profile_image_name,
							$originalDirecory.'/'.$profile_image_name ) )
					{
						// popup image should be of 800*800px size. If the source image is greater than
						// 800*800px size, means if the hieght or width is greater that 800px only than
						// resizing is required.
						$is_popup_image_set = 0;
						
						list($width, $height, $type, $attr) = getimagesize($originalDirecory."/".$profile_image_name);
						
						if( $width > 800 || $height > 800 )
						{
							if( Helper_ImageResizer::smart_resize_image(
														$originalDirecory."/".$profile_image_name,
														NULL, 
														800, 
														800, 
														true, 
														$popupDirectory."/thumbnail_".$profile_image_name, 
														false))
							{
								$is_popup_image_set = 1;
							}
						}
						else
						{
							if( copy($originalDirecory."/".$profile_image_name,
									$popupDirectory."/thumbnail_".$profile_image_name) )
							{
								$is_popup_image_set = 1;
							}
						}	
					}
					else
					{
						//error handling, process stopped in between.
						$return_r['is_success'] = 0;
						$return_r['msg'] = "process stopped in between";
					}	
				
					//Now check is popup image has been set, and proceed with wall size image.
					if( $is_popup_image_set )
					{
						if( mkdir( $wallDirectory, 0777, true ) )
						{
							$is_wall_image_set = 0;
							if( $width > 435 || $height > 435 )
							{
								if( Helper_ImageResizer::smart_resize_image(
										$originalDirecory."/".$profile_image_name,
										NULL,
										435,
										435,
										true,
										$wallDirectory."/thumbnail_".$profile_image_name,
										false))
								{
									$is_wall_image_set = 1;
								}
							}
							else
							{
								if( copy($originalDirecory."/".$profile_image_name,
										$wallDirectory."/thumbnail_".$profile_image_name) )
								{
									$is_wall_image_set = 1;
								}
							}
						}
						else
						{
							//error handling, process stopped in between.
							$return_r['is_success'] = 0;
							$return_r['msg'] = "process stopped in between";
						}
					}
					
					//Now check is wall image has been set, and proceed with gallary size image.
					if( $is_wall_image_set )
					{
						if( mkdir( $galleryDirectory, 0777, true ) )
						{
							if( Helper_ImageResizer::smart_resize_image(
								$originalDirecory."/".$profile_image_name,
								NULL,
								176,
								176,
								false,
								$galleryDirectory."/thumbnail_".$profile_image_name,
								false))
							{
								//-----------------------------------------------------
								// SUCCESS in filling up all album directories.
								// Now proceed with database entries.
								//-----------------------------------------------------
								
								// Check if PROFILE_PHOTOS_ALBUM already exist or not?
								$profile_photos_album_id = \Extended\socialise_album::isThisTypeOfAlbumExists( $user_id, \Extended\socialise_album::PROFILE_PHOTOS_ALBUM_NAME );
								if( !$profile_photos_album_id )
								{
									$album_data = \Extended\socialise_album::addAlbum( $user_id, \Extended\socialise_album::PROFILE_PHOTOS_ALBUM_NAME, \Extended\socialise_album::VISIBILITY_CRITERIA_PUBLIC, 1, \Extended\socialise_album::PROFILE_PHOTOS_ALBUM_DISPLAY_NAME );
									if( $album_data )
									{
										$photo_info = \Extended\socialise_photo::addPhotos($album_data['id'],
																							$user_id, 
																							array('0'=>$profile_image_name), null, "");
										$photo_id_r = array_keys($photo_info);
										$photo_obj = \Extended\socialise_photo::getRowObject( $photo_id_r[0] );
										
										$his_her = \Auth_UserAdapter::getIdentity()->getGender() == \Extended\ilook_user::USER_GENDER_FEMALE?"her":"his";
										$wp_text = "";//\Auth_UserAdapter::getIdentity()->getFirstname()." ".\Auth_UserAdapter::getIdentity()->getLastname()." has changed ".$his_her." profile photo.";
										$wall_post_id = \Extended\wall_post::post_photo($wp_text,
																						\Extended\wall_post::VISIBILITY_CRITERIA_LINKS,
																						$user_id,
																						$user_id,
																						$user_id,
																						\Extended\wall_post::POST_UPDATE_TYPE_PROFILE_PHOTO_CHANGED, 
																						\Extended\wall_post::POST_TYPE_AUTO, 
																						\Extended\wall_post::WALL_TYPE_SOCIALISE, 
																						NULL, 
																						$album_data['id'],
										                                                $photo_id_r[0]);
											
										$return_r['wall_post_id'] 						= $wall_post_id;
										$return_r['album_id'] 							= $album_data['id'];
										$return_r['user_id'] 							= $user_id;
										$return_r['user_name'] 							= Auth_UserAdapter::getIdentity()->getFirstname()." ".Auth_UserAdapter::getIdentity()->getLastname();
										$return_r['user_image'] 						= Helper_common::getUserProfessionalPhoto( $user_id, 3 );
										$return_r['feed_image'] 						= IMAGE_PATH."/albums/user_".$user_id."/album_default/wall_thumbnails/thumbnail_".$profile_image_name;
										$return_r['photo_text'] 						= "";
										$return_r['image_created_at'] 					= $photo_obj->getCreated_at()->format('F d, Y');
										$return_r['is_ok_comment_share_pannel_visible'] = \Helper_common::is_ok_comment_share_pannel_visible(  \Extended\wall_post::VISIBILITY_CRITERIA_LINKS, 
																																				$user_id,
																																				array($user_id),
																																				$user_id );
										$return_r['privacy'] = \Extended\wall_post::VISIBILITY_CRITERIA_LINKS;
										$return_r['is_success'] = 1;
										$return_r['msg'] = "Photo added successfully";
											
									}
									else
									{
										//error handling, process stopped in between.
										$return_r['is_success'] = 0;
										$return_r['msg'] = "process stopped in between";
									}
								}
								else
								{
									
									$photo_info = \Extended\socialise_photo::addPhotos( $profile_photos_album_id, 
																						$user_id, 
																						array('0'=>$profile_image_name), null, "");
									$photo_id_r = array_keys($photo_info);
									$photo_obj = \Extended\socialise_photo::getRowObject($photo_id_r[0]);
									
									$his_her = \Auth_UserAdapter::getIdentity()->getGender() == \Extended\ilook_user::USER_GENDER_FEMALE?"her":"his";
									$wp_text = "";//\Auth_UserAdapter::getIdentity()->getFirstname()." ".\Auth_UserAdapter::getIdentity()->getLastname()." has changed ".$his_her." profile photo.";
									$wall_post_id = \Extended\wall_post::post_photo($wp_text, 
																					\Extended\wall_post::VISIBILITY_CRITERIA_LINKS, 
																					$user_id, 
																					$user_id, 
																					$user_id, 
																					\Extended\wall_post::POST_UPDATE_TYPE_PROFILE_PHOTO_CHANGED,
																					\Extended\wall_post::POST_TYPE_AUTO,
																					\Extended\wall_post::WALL_TYPE_SOCIALISE,
																					NULL,
																					$profile_photos_album_id,
									                                                $photo_id_r[0]);
								
									$return_r['wall_post_id'] 						= $wall_post_id;
									$return_r['album_id'] 							= $profile_photos_album_id;
									$return_r['user_id'] 							= $user_id;
									$return_r['user_name'] 							= Auth_UserAdapter::getIdentity()->getFirstname()." ".Auth_UserAdapter::getIdentity()->getLastname();
									$return_r['user_image'] 						= Helper_common::getUserProfessionalPhoto( $user_id, 3 );
									$return_r['feed_image'] 						= IMAGE_PATH."/albums/user_".$user_id."/album_default/wall_thumbnails/thumbnail_".$profile_image_name;
									$return_r['photo_text'] 						= "";
									$return_r['image_created_at'] 					= $photo_obj->getCreated_at()->format('F d, Y');
									$return_r['is_ok_comment_share_pannel_visible'] = \Helper_common::is_ok_comment_share_pannel_visible(  \Extended\wall_post::VISIBILITY_CRITERIA_LINKS, 
																																			$user_id, 
																																			array($user_id), 
																																			$user_id );
									$return_r['privacy'] = \Extended\wall_post::VISIBILITY_CRITERIA_LINKS;
									$return_r['is_success'] = 1;
									$return_r['msg'] = "Photo added successfully";
								
								}
							}
							else
							{
								//error handling, process stopped in between.
								$return_r['is_success'] = 0;
								$return_r['msg'] = "process stopped in between";
							}
						}
						else
						{
							//error handling, process stopped in between.
							$return_r['is_success'] = 0;
							$return_r['msg'] = "process stopped in between";
						}
					}
					else
					{
						//error handling, process stopped in between.
						$return_r['is_success'] = 0;
						$return_r['msg'] = "process stopped in between";
					}	
				}
			}	
		}	
		else
		{
			//This case will occur when user directory exists but album( album_profile_photos ) dir does not.
			if ( !file_exists( $userAlbumDirectory ) )
			{
				if( mkdir( $userAlbumDirectory, 0777, true ) )
				{
					//nothing to do.
				}
				else
				{
					$return_r['is_success'] = 0;
					$return_r['msg'] = "process stopped in between";
	
				}
			}
				
			//After making directories inside user_x, move photos into them.
			if( copy(REL_IMAGE_PATH.'/profile/popup_thumbnails/thumbnail_'.$profile_image_name,
								 $originalDirecory.'/'.$profile_image_name) )
			{
				// popup image should be of 800*800px size. If the source image is greater than
				// 800*800px size, means if the hieght or width is greater that 800px only than
				// resizing is required.
				$is_popup_image_set = 0;
				list($width, $height, $type, $attr) = getimagesize($originalDirecory."/".$profile_image_name);
				if( $width > 800 || $height > 800 )
				{
					if( Helper_ImageResizer::smart_resize_image(
							$originalDirecory."/".$profile_image_name,
							NULL,
							800,
							800,
							true,
							$popupDirectory."/thumbnail_".$profile_image_name,
							false))
					{
						$is_popup_image_set = 1;
					}
				}
				else
				{
					if( copy($originalDirecory."/".$profile_image_name,
							$popupDirectory."/thumbnail_".$profile_image_name) )
					{
						$is_popup_image_set = 1;
					}
				}
				//Now check is popup image has been set, and proceed with wall size image.
				if( $is_popup_image_set )
				{
					$is_wall_image_set = 0;
					if( $width > 435 || $height > 435 )
					{
						if( Helper_ImageResizer::smart_resize_image(
								$originalDirecory."/".$profile_image_name,
								NULL,
								435,
								435,
								true,
								$wallDirectory."/thumbnail_".$profile_image_name,
								false))
						{
							$is_wall_image_set = 1;
						}
					}
					else
					{
						if( copy($originalDirecory."/".$profile_image_name, $wallDirectory."/thumbnail_".$profile_image_name) )
						{
							$is_wall_image_set = 1;
						}
					}
				
					//Now check is wall image has been set, and proceed with gallary size image.
					if( $is_wall_image_set )
					{
						if( Helper_ImageResizer::smart_resize_image(
								$originalDirecory."/".$profile_image_name,
								NULL,
								176,
								176,
								false,
								$galleryDirectory."/thumbnail_".$profile_image_name,
								false))
						{
							//-----------------------------------------------------
							// SUCCESS in filling up all album directories.
							// Now proceed with database entries.
							//-----------------------------------------------------
				
							// Check if PROFILE_PHOTOS_ALBUM already exist or not?
							$profile_photos_album_id = \Extended\socialise_album::isThisTypeOfAlbumExists( $user_id, \Extended\socialise_album::PROFILE_PHOTOS_ALBUM_NAME );
							if( !$profile_photos_album_id )
							{
								$album_data = \Extended\socialise_album::addAlbum( $user_id , \Extended\socialise_album::PROFILE_PHOTOS_ALBUM_NAME, \Extended\socialise_album::VISIBILITY_CRITERIA_PUBLIC, 1, \Extended\socialise_album::PROFILE_PHOTOS_ALBUM_DISPLAY_NAME );
								if( $album_data )
								{
									$photo_info = \Extended\socialise_photo::addPhotos($album_data['id'],
											$user_id,
											array('0'=>$profile_image_name), null, "");
									$photo_id_r = array_keys($photo_info);
									$photo_obj = \Extended\socialise_photo::getRowObject( $photo_id_r[0] );
									
									$his_her = \Auth_UserAdapter::getIdentity()->getGender() == \Extended\ilook_user::USER_GENDER_FEMALE?"her":"his";
									$wp_text = "";//\Auth_UserAdapter::getIdentity()->getFirstname()." ".\Auth_UserAdapter::getIdentity()->getLastname()." has changed ".$his_her." profile photo.";
									$wall_post_id = \Extended\wall_post::post_photo($wp_text,
											\Extended\wall_post::VISIBILITY_CRITERIA_LINKS,
											$user_id,
											$user_id,
											$user_id,
											\Extended\wall_post::POST_UPDATE_TYPE_PROFILE_PHOTO_CHANGED,
											\Extended\wall_post::POST_TYPE_AUTO,
											\Extended\wall_post::WALL_TYPE_SOCIALISE,
											NULL,
											$album_data['id'],
									        $photo_id_r[0]);
										
									$return_r['wall_post_id'] 						= $wall_post_id;
									$return_r['album_id'] 							= $album_data['id'];
									$return_r['user_id'] 							= $user_id;
									$return_r['user_name'] 							= Auth_UserAdapter::getIdentity()->getFirstname()." ".Auth_UserAdapter::getIdentity()->getLastname();
									$return_r['user_image'] 						= Helper_common::getUserProfessionalPhoto( $user_id, 3 );
									$return_r['feed_image'] 						= IMAGE_PATH."/albums/user_".$user_id."/album_default/wall_thumbnails/thumbnail_".$profile_image_name;
									$return_r['photo_text'] 						= "";
									$return_r['image_created_at'] 					= $photo_obj->getCreated_at()->format('F d, Y');
									$return_r['is_ok_comment_share_pannel_visible'] = \Helper_common::is_ok_comment_share_pannel_visible(  \Extended\wall_post::VISIBILITY_CRITERIA_LINKS,
																																			$user_id,
																																			array($user_id),
																																			$user_id );
									$return_r['privacy'] = \Extended\wall_post::VISIBILITY_CRITERIA_LINKS;
									$return_r['is_success'] = 1;
									$return_r['msg'] = "Photo added successfully";
										
								}
								else
								{
									//error handling, process stopped in between.
									$return_r['is_success'] = 0;
									$return_r['msg'] = "process stopped in between";
								}
							}
							else
							{
									
								$photo_info = \Extended\socialise_photo::addPhotos( $profile_photos_album_id,
										$user_id,
										array('0'=>$profile_image_name), null, "");
								$photo_id_r = array_keys($photo_info);
								$photo_obj = \Extended\socialise_photo::getRowObject($photo_id_r[0]);
								
								$his_her = \Auth_UserAdapter::getIdentity()->getGender() == \Extended\ilook_user::USER_GENDER_FEMALE?"her":"his";
								$wp_text = "";//\Auth_UserAdapter::getIdentity()->getFirstname()." ".\Auth_UserAdapter::getIdentity()->getLastname()." has changed ".$his_her." profile photo.";
								$wall_post_id = \Extended\wall_post::post_photo($wp_text,
										\Extended\wall_post::VISIBILITY_CRITERIA_LINKS,
										$user_id,
										$user_id,
										$user_id,
										\Extended\wall_post::POST_UPDATE_TYPE_PROFILE_PHOTO_CHANGED,
										\Extended\wall_post::POST_TYPE_AUTO,
										\Extended\wall_post::WALL_TYPE_SOCIALISE,
										NULL,
										$profile_photos_album_id,
								        $photo_id_r[0]);
				
								$return_r['wall_post_id'] 						= $wall_post_id;
								$return_r['album_id'] 							= $profile_photos_album_id;
								$return_r['user_id'] 							= $user_id;
								$return_r['user_name'] 							= Auth_UserAdapter::getIdentity()->getFirstname()." ".Auth_UserAdapter::getIdentity()->getLastname();
								$return_r['user_image'] 						= Helper_common::getUserProfessionalPhoto( $user_id, 3 );
								$return_r['feed_image'] 						= IMAGE_PATH."/albums/user_".$user_id."/album_default/wall_thumbnails/thumbnail_".$profile_image_name;
								$return_r['photo_text'] 						= "";
								$return_r['image_created_at'] 					= $photo_obj->getCreated_at()->format('F d, Y');
								$return_r['is_ok_comment_share_pannel_visible'] = \Helper_common::is_ok_comment_share_pannel_visible(  \Extended\wall_post::VISIBILITY_CRITERIA_LINKS,
																																		$user_id,
																																		array($user_id),
																																		$user_id );
								$return_r['privacy'] = \Extended\wall_post::VISIBILITY_CRITERIA_LINKS;
								$return_r['is_success'] = 1;
								$return_r['msg'] = "Photo added successfully";
				
							}
						}
						else
						{
							//error handling, process stopped in between.
							$return_r['is_success'] = 0;
							$return_r['msg'] = "process stopped in between";
						}
					}
					else
					{
						//error handling, process stopped in between.
						$return_r['is_success'] = 0;
						$return_r['msg'] = "process stopped in between";
					}
				}
				else
				{
					//error handling, process stopped in between.
					$return_r['is_success'] = 0;
					$return_r['msg'] = "process stopped in between";
				}
			}
			else
			{
				$return_r['is_success'] = 0;
				$return_r['msg'] = "process stopped in between";
			}
		}
	}
	
	
	/**
	 * Handles ajax call to get user albums on window scroll
	 * @author sjaiswal, jsingh7
	 * @return json
	 * @version 1.1
	 */
	
	public function getMyAlbumsAction()
	{
		$params 				= $this->getRequest()->getParams();
		
		$all_viewable_albums 	= \Extended\socialise_album::getAllAlbumIdsByPrivacy(Auth_UserAdapter::getIdentity()->getId(), Auth_UserAdapter::getIdentity()->getId());

		if( ! $all_viewable_albums )
		{
			echo Zend_Json::encode( 0 );
			die;
		}
		
		$offset 						= ( intval( $params['page'] ) -1 ) * intval( $params['limit'] );
		
		$all_viewable_albums_fragment 	= array_slice($all_viewable_albums, $offset, $params['limit']);

		$total_fragments 				= ceil( count($all_viewable_albums)/ $params['limit'] );
		
		$albums 						= \Extended\socialise_album::getDetailOfAlbums( $all_viewable_albums_fragment,['id','DESC'] );
		$current_user_id 				= Auth_UserAdapter::getIdentity()->getId();
		$userObj 						= Extended\ilook_user::getRowObject($current_user_id);
		
		$finalArr['is_there_more_albums'] = 1;
		
		if( $total_fragments == $params['page'] )
		{
            $finalArr['is_there_more_albums'] = 0;
		}

		//If collection of filtered albums is returned.
		if(	$albums )
		{
			foreach( $albums as $key=>$album )
			{
				$album_cover  							= Extended\socialise_photo::getCover( $album->getId() );//Getting cover photo of album.
				$photo_album ['id'] 					= $album->getId();//Id of album.
				$photo_album ['uid'] 					= $userObj->getId();//Id of owner of album.
				$photo_album ['photo_count'] 			= \Extended\socialise_photo::countAlbumImages($album->getId());//photo count of album.
				$photo_album ['visibility_criteria'] 	= $album->getVisibility_criteria();
				
				//if album_name is DEFAULT then store album name as album_default else append underscore and timestamp.
				if(strtolower( $album->getAlbum_name()) == strtolower(\Extended\socialise_album::DEFAULT_ALBUM_NAME)
					|| $album->getAlbum_name() == \Extended\socialise_album::PROFILE_PHOTOS_ALBUM_NAME
					|| $album->getAlbum_name() == \Extended\socialise_album::COVER_PHOTOS_ALBUM_NAME
				)
				{
					$albName							= strtolower($album->getAlbum_name());
				}
				else
				{
					$albName 							= $album->getAlbum_name()."_".$album->getCreated_at_timestamp()->getTimestamp();
				}
			
				//Storing album_name.
				$photo_album ['alb_name'] 				= $photo_album ['album_name'] = ucfirst(strtolower($album->getAlbum_display_name()));
				
				if( $album_cover )
				{
					//putting album name from $album_cover array into photo_album array.
					$realPath=REL_IMAGE_PATH."/albums/user_".$current_user_id."/album_".$albName."/gallery_thumbnails/thumbnail_".$album_cover->getImage_name();
					
					if($album_cover->getImage_name()!="" && file_exists($realPath))
					{
						$photo_album ['socialise_albums_socialise_photo'] =IMAGE_PATH."/albums/user_".$current_user_id."/album_".$albName."/gallery_thumbnails/thumbnail_".$album_cover->getImage_name();
					}
					else
					{
						$photo_album ['socialise_albums_socialise_photo'] = IMAGE_PATH."/no_image.png";
					}
				}
				else 
				{
					$photo_album ['socialise_albums_socialise_photo'] = IMAGE_PATH."/no_image.png";
				}
				
				//Putting photo_album array into final array.
				$finalArr["album_info"][] = $photo_album;
			}
		}
		
		echo Zend_Json::encode( $finalArr );
		die;
	}
	
	/**
	 * Handles ajax call to get album pictures on window scroll
	 * @author sjaiswal
	 * @author achaudhary["changed the code so now photos return No description
	 * instead Say Something About This Photo when other user sees the album"]
	 * @return json
	 * @version 1.1
	 */
	public function getAlbumPicturesAction()
	{
		$params = $this->getRequest()->getParams();
		$album_owner_id = $params['albumOwnerId']; 
		$user_id = Auth_UserAdapter::getIdentity()->getId();
		
		$albumPictures = Extended\socialise_photo::getPhotosByUserIdNAlbumId
						( $album_owner_id, $params['albumId'] ,$params['limit'],$params['offset']);
		
		$pictureDetails = array();
		
		$album_obj = \Extended\socialise_album::getRowObject($params['albumId']);
		
		$pictureDetails['total_pictures'] = $album_obj->getSocialise_albumsSocialise_photo()->count();
		
		if($albumPictures)
		{
    			foreach($albumPictures['data'] as $key=>$picture)
    			{
					$pictureDetails['data'][$key]["photo_id"] = $picture['id'];
					if($user_id == $album_owner_id && !$picture['description'])
                    {
                        $picture['description'] = self::EMPTY_OWNER_PIC_DESC_MSG;
                    }
                    else if($user_id != $album_owner_id && !$picture['description'])
                    {
                        $picture['description'] = self::EMPTY_PIC_DESC_MSG;
                    }
					 $pictureDetails['data'][$key]["description"] = $picture['description'];
					 $pictureDetails['data'][$key]["created_at"] = $picture['socialise_photosSocialise_album']['created_at_timestamp']->getTimestamp();
    				 $pictureDetails['data'][$key]["image_name"] = $picture['image_name'];
    				 $pictureDetails['data'][$key]["album_display_name"] = $picture['socialise_photosSocialise_album']['album_display_name'];
    				 $pictureDetails['data'][$key]["album_name"] = $picture['socialise_photosSocialise_album']['album_name'];
    				 $pictureDetails['data'][$key]["album_id"] = $picture['socialise_photosSocialise_album']['id'];
    				 $pictureDetails['data'][$key]["linkurl"]=PROJECT_URL."/".PROJECT_NAME.'profile/photo-detail/id/'.$picture['id'];
    				 if( $params['albumOwnerId'] == Auth_UserAdapter::getIdentity()->getId() ):
    				 	$pictureDetails['data'][$key]["is_my_photo"] = 1;
    				 else:
    				 	$pictureDetails['data'][$key]["is_my_photo"] = 0;
    				 endif;
    				 
    				 if(strtolower($pictureDetails['data'][$key]["album_name"]) == strtolower(\Extended\socialise_album::DEFAULT_ALBUM_NAME)
    				 		|| strtolower($pictureDetails['data'][$key]["album_name"]) == strtolower(\Extended\socialise_album::PROFILE_PHOTOS_ALBUM_NAME)
    				 		|| strtolower($pictureDetails['data'][$key]["album_name"]) == strtolower(\Extended\socialise_album::COVER_PHOTOS_ALBUM_NAME))
    				 {
    					 $pictureDetails['data'][$key]["imgurl"]=IMAGE_PATH.'/albums/user_'.$album_owner_id.'/album_'.strtolower($pictureDetails['data'][$key]["album_name"]).'/gallery_thumbnails/thumbnail_'.$picture['image_name'];
    				 }
    				 else
    				 {
    				 	$pictureDetails['data'][$key]["imgurl"]=IMAGE_PATH.'/albums/user_'.$album_owner_id.'/album_'.$pictureDetails['data'][$key]["album_name"].'_'.
    				 			$pictureDetails['data'][$key]["created_at"].'/gallery_thumbnails/thumbnail_'.$picture['image_name'];
    				 }
    				 if(strtolower($pictureDetails['data'][$key]["album_name"]) == strtolower(\Extended\socialise_album::DEFAULT_ALBUM_NAME) 
    				 		|| strtolower($pictureDetails['data'][$key]["album_name"]) == strtolower(\Extended\socialise_album::PROFILE_PHOTOS_ALBUM_NAME)
    				 		|| strtolower($pictureDetails['data'][$key]["album_name"]) == strtolower(\Extended\socialise_album::COVER_PHOTOS_ALBUM_NAME))
    				 {
    				 	$real_image_path = REL_IMAGE_PATH."/albums/user_".$album_owner_id."/album_".$picture['socialise_photosSocialise_album']['album_name']."/gallery_thumbnails/thumbnail_".$picture['image_name'];
    				 }
    				 else
    				 {
    				 	$real_image_path = REL_IMAGE_PATH."/albums/user_".$album_owner_id."/album_".$picture['socialise_photosSocialise_album']['album_name'].'_'. $pictureDetails['data'][$key]["created_at"]."/gallery_thumbnails/thumbnail_".$picture['image_name'];
    				 }
    				 if(file_exists($real_image_path))
    				 {
    				 	$pictureDetails['data'][$key]["realPath"]= 1;
    				 }
    				 else 
    				 {
    				 	$pictureDetails['data'][$key]["realPath"] = 0;
    				 }
    				 //Check if any other album exist for this user(other than default)
    				 $resultArr=Extended\socialise_album::getRemainingAlbumListing($pictureDetails['data'][$key]["album_id"], Auth_UserAdapter::getIdentity()->getId());
    				 
    				 $enableMoveToOtherAlbumLink = 0;
    				 
    				 if( count( $resultArr ) > 0 && strtolower($pictureDetails['data'][$key]["album_name"])!=strtolower( \Extended\socialise_album::DEFAULT_ALBUM_NAME )
						&& strtolower($pictureDetails['data'][$key]["album_name"])!=strtolower( \Extended\socialise_album::PROFILE_PHOTOS_ALBUM_NAME )
						&& strtolower($pictureDetails['data'][$key]["album_name"])!=strtolower( \Extended\socialise_album::COVER_PHOTOS_ALBUM_NAME ) )
    				 {
    				 	$enableMoveToOtherAlbumLink = 1;
    				 }
    				 
    				 $pictureDetails['data'][$key]["moveOtherAlbumLinkStatus"] = $enableMoveToOtherAlbumLink;
    		
    			}
    		
    		$pictureDetails['is_there_more_pictures'] = $albumPictures['isThereMorePhotos'];
		}
		echo Zend_Json::encode($pictureDetails);
		die;
		
	}
	/**
	 * Saving cover photo in directories and 
	 * making album as well
	 *
	 * @param string $cover_image_name
	 *
	 * @author                  
	 * @version 1.0
	 *
	 */
	public function uploadCoverPhotoToAlbum($cover_image_name)
	{
	
		$return_r = array();
		$return_r['is_success'] = 0;
		$return_r['msg'] = "Process initiated";
	
		//creating or checking user profile pictures album directory to upload image.
		$user_id = Auth_UserAdapter::getIdentity()->getId();
		$userDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$user_id;
		$userAlbumDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$user_id.'\\album_cover_photos';
		$galleryDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$user_id.'\\album_cover_photos\\gallery_thumbnails';
		$wallDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$user_id.'\\album_cover_photos\\wall_thumbnails';
		$popupDirectory = REL_IMAGE_PATH.'\\albums\\user_'.$user_id.'\\album_cover_photos\\popup_thumbnails';
		$originalDirecory = REL_IMAGE_PATH.'\\albums\\user_'.$user_id.'\\album_cover_photos\\original_photos';
	
		// if original Directory is missing create it
		if ( !file_exists( $originalDirecory ) )
		{
			mkdir( $originalDirecory, 0777, true );
		}
		// if popup Directory is missing create it
		if ( !file_exists( $popupDirectory ) )
		{
			mkdir( $popupDirectory, 0777, true );
		}
		// if wall Directory is missing create it
		if ( !file_exists( $wallDirectory ) )
		{
			mkdir( $wallDirectory, 0777, true );
		}
		// if gallery Directory is missing create it
		if ( !file_exists( $galleryDirectory ) )
		{
			mkdir( $galleryDirectory, 0777, true );
		}
	
	
			
		// Creating directories
		// If main user directory is missing, then create it
		if ( !file_exists( $userDirectory ) )
		{
			if( mkdir( $userDirectory, 0777, true ) )
			{
				if( mkdir( $userAlbumDirectory, 0777, true ) )
				{
					if( copy( REL_IMAGE_PATH.'/cover_photo/user_'.$user_id.'/'.$cover_image_name,
							$originalDirecory.'/'.$cover_image_name ) )
					{
						// popup image should be of 800*800px size. If the source image is greater than
						// 800*800px size, means if the hieght or width is greater that 800px only than
						// resizing is required.
						$is_popup_image_set = 0;
	
						list($width, $height, $type, $attr) = getimagesize($originalDirecory."/".$cover_image_name);
	
						if( $width > 800 || $height > 800 )
						{
							if( Helper_ImageResizer::smart_resize_image(
									$originalDirecory."/".$cover_image_name,
									NULL,
									800,
									800,
									true,
									$popupDirectory."/thumbnail_".$cover_image_name,
									false))
							{
								$is_popup_image_set = 1;
							}
						}
						else
						{
							if( copy($originalDirecory."/".$cover_image_name,
									$popupDirectory."/thumbnail_".$cover_image_name) )
							{
								$is_popup_image_set = 1;
							}
						}
					}
					else
					{
						//error handling, process stopped in between.
						$return_r['is_success'] = 0;
						$return_r['msg'] = "process stopped in between";
					}
	
					//Now check is popup image has been set, and proceed with wall size image.
					if( $is_popup_image_set )
					{
						if( mkdir( $wallDirectory, 0777, true ) )
						{
							$is_wall_image_set = 0;
							if( $width > 435 || $height > 435 )
							{
								if( Helper_ImageResizer::smart_resize_image(
										$originalDirecory."/".$cover_image_name,
										NULL,
										435,
										435,
										true,
										$wallDirectory."/thumbnail_".$cover_image_name,
										false))
								{
									$is_wall_image_set = 1;
								}
							}
							else
							{
								if( copy($originalDirecory."/".$cover_image_name,
										$wallDirectory."/thumbnail_".$cover_image_name) )
								{
									$is_wall_image_set = 1;
								}
							}
						}
						else
						{
							//error handling, process stopped in between.
							$return_r['is_success'] = 0;
							$return_r['msg'] = "process stopped in between";
						}
					}
						
					//Now check is wall image has been set, and proceed with gallary size image.
					if( $is_wall_image_set )
					{
						if( mkdir( $galleryDirectory, 0777, true ) )
						{
							if( Helper_ImageResizer::smart_resize_image(
									$originalDirecory."/".$cover_image_name,
									NULL,
									176,
									176,
									false,
									$galleryDirectory."/thumbnail_".$cover_image_name,
									false))
							{
								//-----------------------------------------------------
								// SUCCESS in filling up all album directories.
								// Now proceed with database entries.
								//-----------------------------------------------------
	
								// Check if COVER_PHOTOS_ALBUM already exist or not?
								$cover_photos_album_id = \Extended\socialise_album::isThisTypeOfAlbumExists( $user_id, \Extended\socialise_album::COVER_PHOTOS_ALBUM_NAME );
								if( !$cover_photos_album_id )
								{
									//Add album to database
									$album_data = \Extended\socialise_album::addAlbum( $user_id, \Extended\socialise_album::COVER_PHOTOS_ALBUM_NAME, \Extended\socialise_album::VISIBILITY_CRITERIA_PUBLIC, 1, \Extended\socialise_album::COVER_PHOTOS_ALBUM_DISPLAY_NAME);
									
									if( $album_data )
									{
										//If album created then add photos to db.
										$photo_info = \Extended\socialise_photo::addPhotos($album_data['id'],
												$user_id,
												array('0'=>$cover_image_name), null, "");
										if($photo_info)
										{
											return true;
										}
											
									}
									else
									{
										//error handling, process stopped in between.
										$return_r['is_success'] = 0;
										$return_r['msg'] = "process stopped in between";
									}
								}
								else
								{
										
									//If album 
									$photo_info = \Extended\socialise_photo::addPhotos( $cover_photos_album_id,
											$user_id,
											array('0'=>$cover_image_name), null, "");
									if($photo_info)
									{
										return true;
									}
	
								}
							}
							else
							{
								//error handling, process stopped in between.
								$return_r['is_success'] = 0;
								$return_r['msg'] = "process stopped in between";
							}
						}
						else
						{
							//error handling, process stopped in between.
							$return_r['is_success'] = 0;
							$return_r['msg'] = "process stopped in between";
						}
					}
					else
					{
						//error handling, process stopped in between.
						$return_r['is_success'] = 0;
						$return_r['msg'] = "process stopped in between";
					}
				}
			}
		}
		else
		{
			//This case will occur when user directory exists but album( album_cover_photos ) dir does not.
			if ( !file_exists( $userAlbumDirectory ) )
			{
				if( mkdir( $userAlbumDirectory, 0777, true ) )
				{
					//nothing to do.
				}
				else
				{
					$return_r['is_success'] = 0;
					$return_r['msg'] = "process stopped in between";
	
				}
			}
	
			//After making directories inside user_x, move photos into them.
			if( copy(REL_IMAGE_PATH.'/cover_photo/user_'.$user_id.'/'.$cover_image_name,
					$originalDirecory.'/'.$cover_image_name) )
			{
				// popup image should be of 800*800px size. If the source image is greater than
				// 800*800px size, means if the hieght or width is greater that 800px only than
				// resizing is required.
				$is_popup_image_set = 0;
				list($width, $height, $type, $attr) = getimagesize($originalDirecory."/".$cover_image_name);
				if( $width > 800 || $height > 800 )
				{
					if( Helper_ImageResizer::smart_resize_image(
							$originalDirecory."/".$cover_image_name,
							NULL,
							800,
							800,
							true,
							$popupDirectory."/thumbnail_".$cover_image_name,
							false))
					{
						$is_popup_image_set = 1;
					}
				}
				else
				{
					if( copy($originalDirecory."/".$cover_image_name,
							$popupDirectory."/thumbnail_".$cover_image_name) )
					{
						$is_popup_image_set = 1;
					}
				}
				//Now check is popup image has been set, and proceed with wall size image.
				if( $is_popup_image_set )
				{
					$is_wall_image_set = 0;
					if( $width > 435 || $height > 435 )
					{
						if( Helper_ImageResizer::smart_resize_image(
								$originalDirecory."/".$cover_image_name,
								NULL,
								435,
								435,
								true,
								$wallDirectory."/thumbnail_".$cover_image_name,
								false))
						{
							$is_wall_image_set = 1;
						}
					}
					else
					{
						if( copy($originalDirecory."/".$cover_image_name, $wallDirectory."/thumbnail_".$cover_image_name) )
						{
							$is_wall_image_set = 1;
						}
					}
	
					//Now check is wall image has been set, and proceed with gallary size image.
					if( $is_wall_image_set )
					{
						if( Helper_ImageResizer::smart_resize_image(
								$originalDirecory."/".$cover_image_name,
								NULL,
								176,
								176,
								false,
								$galleryDirectory."/thumbnail_".$cover_image_name,
								false))
						{
							//-----------------------------------------------------
							// SUCCESS in filling up all album directories.
							// Now proceed with database entries.
							//-----------------------------------------------------
	
							// Check if PROFILE_PHOTOS_ALBUM already exist or not?
							$cover_photos_album_id = \Extended\socialise_album::isThisTypeOfAlbumExists( $user_id, \Extended\socialise_album::COVER_PHOTOS_ALBUM_NAME );
							if( !$cover_photos_album_id )
							{
								$album_data = \Extended\socialise_album::addAlbum( $user_id , \Extended\socialise_album::COVER_PHOTOS_ALBUM_NAME, \Extended\socialise_album::VISIBILITY_CRITERIA_PUBLIC, 1, \Extended\socialise_album::COVER_PHOTOS_ALBUM_DISPLAY_NAME );
								if( $album_data )
								{
									$photo_info = \Extended\socialise_photo::addPhotos($album_data['id'],
											$user_id,
											array('0'=>$cover_image_name), null, "");
									
									if($photo_info)
									{
										return true;
									}
	
								}
								else
								{
									//error handling, process stopped in between.
									$return_r['is_success'] = 0;
									$return_r['msg'] = "process stopped in between";
								}
							}
							else
							{
									
								$photo_info = \Extended\socialise_photo::addPhotos( $cover_photos_album_id,
										$user_id,
										array('0'=>$cover_image_name), null, "");
								if($photo_info)
								{
									return true;
								}
	
							}
						}
						else
						{
							//error handling, process stopped in between.
							$return_r['is_success'] = 0;
							$return_r['msg'] = "process stopped in between";
						}
					}
					else
					{
						//error handling, process stopped in between.
						$return_r['is_success'] = 0;
						$return_r['msg'] = "process stopped in between";
					}
				}
				else
				{
					//error handling, process stopped in between.
					$return_r['is_success'] = 0;
					$return_r['msg'] = "process stopped in between";
				}
			}
			else
			{
				$return_r['is_success'] = 0;
				$return_r['msg'] = "process stopped in between";
			}
		}
	}
	
	/**
	 * Rotate images(profile picture on temporary location) (rigt 90 deg).
	 * @author hkaur5
	 * @return json_encoded 1 or 0
	 * @version 1.1
	 */
	public function rotateProfilePictureBeforeUploadingAction()
	{
		$params = $this->getRequest()->getParams();
		$profile_pic_name = $params['prof_pic_name'];
		$current_user_id = Auth_UserAdapter::getIdentity()->getId();
		$img_path = IMAGE_PATH.'/profile/temp_croping_images/display_to_crop_thumbnails/user_'.$current_user_id.'/'.$profile_pic_name;
		$rel_img_path = REL_IMAGE_PATH.'\\profile\\temp_croping_images\\display_to_crop_thumbnails\\user_'.$current_user_id.'\\'.$profile_pic_name;
		if(file_exists($rel_img_path)){
			$ext = pathinfo($img_path, PATHINFO_EXTENSION);
		
			switch($ext){
				case 'jpeg':
				case 'jpg':
					$source = imagecreatefromjpeg($img_path);
					
					if($source)
					{
						$rotate =  imagerotate($source, -90,1);
		
						if($rotate!= False){
							$result = imagejpeg($rotate,$rel_img_path, 100);
						}
						else{
							$result = 0;
						}
					}
					else{
						$result = 0;
					}
					break;
		
				case 'png':
					$source = imagecreatefrompng($img_path);
					if($source){
						$rotate =  imagerotate($source, -90,1);
						if($rotate!= False){
							$result = imagepng($rotate,$rel_img_path);
						}
						else{
							$result = 0;
						}
					}
					else{
						$result = 0;
					}
					break;
		
				case 'gif':
					$source = imagecreatefromgif($img_path);
					if($source){
						$rotate =  imagerotate($source, -90,1);
						if($rotate!= False){
							$result = imagegif($rotate,$rel_img_path,null, 75);
						}
						else{
							$result = 0;
						}
					}
					else{
						$result = 0;
					}
					break;
			}
		}
		else
		{
			echo Zend_Json::encode(0);
			die;
				
		}
		if($result){
			echo Zend_Json::encode(1);
		}
		else{
			echo Zend_Json::encode(0);
		}
		die;
	}
	
	/**
	 * Rotate all thumbnails of profile picture at 90 degree(left) of current user.
	 * @author hkaur5
	 * @return json_encoded 1 or 0
	 * @version 1.1
	 */
	public function rotateProfilePictureThumbnailsAction()
	{

		$params = $this->getRequest()->getParams();
		$profile_pic_name = $params['prof_pic_name'];
		$current_user_id = Auth_UserAdapter::getIdentity()->getId();
		
		// Path of various thumbnails of profile picture.
		$big_thumb_path = IMAGE_PATH.'/profile/big_thumbnails/'.$profile_pic_name;
		$med_thumb_path = IMAGE_PATH.'/profile/medium_thumbnails/'.$profile_pic_name;
		$small_thumb_path = IMAGE_PATH.'/profile/small_thumbnails/'.$profile_pic_name;
		$popup_thumb_path = IMAGE_PATH.'/profile/popup_thumbnails/'.$profile_pic_name;
		
		//Relative image paths for all thumbnails.
		$big_thumb_rel_path = REL_IMAGE_PATH.'\\profile\\big_thumbnails\\'.$profile_pic_name;
		$med_thumb_rel_path = REL_IMAGE_PATH.'\\profile\\medium_thumbnails\\'.$profile_pic_name;
		$small_thumb_rel_path = REL_IMAGE_PATH.'\\profile\\small_thumbnails\\'.$profile_pic_name;
		$popup_thumb_rel_path = REL_IMAGE_PATH.'\\profile\\popup_thumbnails\\'.$profile_pic_name;
		
		if(file_exists($big_thumb_rel_path)
				&& file_exists($med_thumb_rel_path)
				&& file_exists($small_thumb_rel_path)
				&& file_exists($popup_thumb_rel_path))
		{
			$ext = pathinfo($big_thumb_path, PATHINFO_EXTENSION);
		
			switch($ext)
			{
				case 'jpeg':
				case 'jpg':
					$source_big_thumb = imagecreatefromjpeg($big_thumb_path);
					$source_med_thumb = imagecreatefromjpeg($med_thumb_path);
					$source_small_thumb = imagecreatefromjpeg($small_thumb_path);
					$source_popup_thumb = imagecreatefromjpeg($popup_thumb_path);
		
					if($source_big_thumb
					&& $source_med_thumb
					&& $source_small_thumb
					&& $source_popup_thumb)
					{
						$rotate_big_thumb   =  imagerotate($source_big_thumb, -90,1);
						$rotate_med_thumb   =  imagerotate($source_med_thumb, -90,1);
						$rotate_small_thumb =  imagerotate($source_small_thumb, -90,1);
						$rotate_popup_thumb =  imagerotate($source_popup_thumb, -90,1);
							
						if($rotate_big_thumb)
						{
		
							$result_big = imagejpeg($rotate_big_thumb,$big_thumb_rel_path, 100);
						}
						if($rotate_med_thumb)
						{
							$result_med = imagejpeg($rotate_med_thumb,$med_thumb_rel_path, 100);
		
						}
						if($rotate_small_thumb)
						{
							$result_small = imagejpeg($rotate_small_thumb,$small_thumb_rel_path, 100);
		
						}
						if($rotate_popup_thumb)
						{
							$result_popup = imagejpeg($rotate_popup_thumb,$popup_thumb_rel_path, 100);
						}
					}
					else
					{
						echo Zend_Json::encode(0);
						die;
					}
					break;
				case 'png':
					$source_big_thumb = imagecreatefrompng($big_thumb_path);
					$source_med_thumb = imagecreatefrompng($med_thumb_path);
					$source_small_thumb = imagecreatefrompng($small_thumb_path);
					$source_popup_thumb = imagecreatefrompng($popup_thumb_path);
					
					if($source_big_thumb
							&& $source_med_thumb
							&& $source_small_thumb
							&& $source_popup_thumb)
					{
						$rotate_big_thumb   =  imagerotate($source_big_thumb, -90,1);
						$rotate_med_thumb   =  imagerotate($source_med_thumb, -90,1);
						$rotate_small_thumb =  imagerotate($source_small_thumb, -90,1);
						$rotate_popup_thumb =  imagerotate($source_popup_thumb, -90,1);
							
						if($rotate_big_thumb)
						{
					
							$result_big = imagepng($rotate_big_thumb,$big_thumb_rel_path);
						}
						if($rotate_med_thumb)
						{
							$result_med = imagepng($rotate_med_thumb,$med_thumb_rel_path);
					
						}
						if($rotate_small_thumb)
						{
							$result_small = imagepng($rotate_small_thumb,$small_thumb_rel_path);
					
						}
						if($rotate_popup_thumb)
						{
							$result_popup = imagepng($rotate_popup_thumb,$popup_thumb_rel_path);
						}
					}
					else
					{
						echo Zend_Json::encode(0);
						die;
					}
					break;
		
				case 'gif':
					$source_big_thumb = imagecreatefromgif($big_thumb_path);
					$source_med_thumb = imagecreatefromgif($med_thumb_path);
					$source_small_thumb = imagecreatefromgif($small_thumb_path);
					$source_popup_thumb = imagecreatefromgif($popup_thumb_path);
					
					if($source_big_thumb
							&& $source_med_thumb
							&& $source_small_thumb
							&& $source_popup_thumb)
					{
						$rotate_big_thumb   =  imagerotate($source_big_thumb, -90,1);
						$rotate_med_thumb   =  imagerotate($source_med_thumb, -90,1);
						$rotate_small_thumb =  imagerotate($source_small_thumb, -90,1);
						$rotate_popup_thumb =  imagerotate($source_popup_thumb, -90,1);
							
						if($rotate_big_thumb)
						{
					
							$result_big = imagegif($rotate_big_thumb,$big_thumb_rel_path);
						}
						if($rotate_med_thumb)
						{
							$result_med = imagegif($rotate_med_thumb,$med_thumb_rel_path);
					
						}
						if($rotate_small_thumb)
						{
							$result_small = imagegif($rotate_small_thumb,$small_thumb_rel_path);
					
						}
						if($rotate_popup_thumb)
						{
							$result_popup = imagegif($rotate_popup_thumb,$popup_thumb_rel_path);
						}
					}
					else
					{
						echo Zend_Json::encode(0);
						die;
					}
					break;
			}
		}
		else
		{
			echo Zend_Json::encode(0);
			die;
		}
		if($rotate_popup_thumb)
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
	 * Action for ajax call,
	 * Fills states dropdown according to logged user's country.
	 * If country does not have states, it hides states
	 * dropdown and fills cities.
	 *
	 *
	 * @author ssharma4
	 * @version 1.0
	 *
	 */
	public function getResponseForCountrySelectedAction()
	{
		$country_id = $this->getRequest()->getParam("country_id");
		$ret_array = array();
		//do country have states.
		$country_obj = \Extended\country_ref::getRowObject($country_id);
		if( $country_obj )
		{
			if( $country_obj->getHave_states() )
			{
				$states = \Extended\state::getAllActiveStatesForCountry($country_id);
				$ret_array['have_states'] = 1;
				$ret_array['count'] = count($states);
				foreach ( $states as $key=>$state )
				{
					$ret_array['options'][$key]['id'] 	= $state->getId();
					$ret_array['options'][$key]['name'] = $state->getName() ;
				}
			}
			else
			{
				$cities = \Extended\city::getAllActiveCitiesForCountry($country_id);
				$ret_array['have_states'] = 0;
				$ret_array['count'] = count($cities);
				foreach ( $cities as $key=>$city )
				{
					$ret_array['options'][$key]['id'] = $city->getId();
					$ret_array['options'][$key]['name'] = $city->getName();
				}
			}
		}
		echo Zend_Json::encode( $ret_array );
		die;
	}
}