<?php


class JobController extends Zend_Controller_Action
{
    /**
     * This function checks auth storage and
     * manage redirecting.
     *
     * @author jsingh7
     * @version 1.0
     * @see Zend_Controller_Action::preDispatch()
     */
    public function preDispatch()
    {
		$after_login_redirection_session = new Zend_Session_Namespace("after_login_redirection_session");
    	if( $this->getRequest()->getParam('job_id') && $this->getRequest()->getParam('receiver_id') )
    	{
    		// value 5 is used for action 'Jobs section'
    		$after_login_redirection_session->action = 5;
    		$after_login_redirection_session->job_id = $this->getRequest()->getParam('job_id');
    		$after_login_redirection_session->receiver_id = $this->getRequest()->getParam('receiver_id');
    		
    	}
    	if( Auth_UserAdapter::hasIdentity() && $after_login_redirection_session->job_id && $after_login_redirection_session->receiver_id == Auth_UserAdapter::getIdentity()->getId() )
    	{
    		$job_id =  $after_login_redirection_session->job_id;
    		$after_login_redirection_session->unsetAll();
    		$this->_redirect( PROJECT_URL."/".PROJECT_NAME."job/job-detail/job_id/".$job_id );
    	}
    	else if ( Auth_UserAdapter::hasIdentity() && $after_login_redirection_session->job_id && $after_login_redirection_session->receiver_id != Auth_UserAdapter::getIdentity()->getId())
    	{
    		$after_login_redirection_session->unsetAll();
    		$this->_helper->redirector( 'index', 'index' );
    	}
		else if ( !Auth_UserAdapter::hasIdentity() && $this->getRequest()->getParam('action') != 'job-detail')
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
    	$this->_helper->redirector( 'recommended-jobs', 'job' );
    }

    /**
     * function used to display "create job" page.
     * used to create new job
     * @author spatial
     * @version 1.0
     *
     */
    public function createJobAction()
    {
    	$requestArr = new Zend_Session_Namespace('requestArr');
  
    	if($requestArr->jobArr)
    	{
    		$this->view->jobArray=$requestArr->jobArr;
    		$countryListArr=explode(",",$requestArr->jobArr["dd_location"]);
    		$this->view->countryValue = $requestArr->jobArr["dd_location"];
    		if(isset($requestArr->jobArr["dd_state"]) && $countryListArr[1]==1)
    		{
    			$this->view->stateListing = \Extended\state::getStateList($countryListArr[0]);
    			$this->view->cityListing = \Extended\city::getCityList($requestArr->jobArr["dd_state"]);
    			$this->view->stateValue = $requestArr->jobArr["dd_state"];
				if(isset($requestArr->jobArr["dd_city"])) {
					$this->view->cityValue = $requestArr->jobArr["dd_city"];
				}

    		}
    		else if($countryListArr[1]==0)
    		{
    			$this->view->cityListing = \Extended\city::getCityListUnderCountry($countryListArr[0]);
				if(isset($requestArr->jobArr["dd_city"])) {
					$this->view->cityValue = $requestArr->jobArr["dd_city"];
				}
    		}
    		if(isset($requestArr->jobArr["dd_salary"]))
    		{
    			$this->view->salaryListing = \Extended\salary_range::getSalaryListing($countryListArr[0]);
    		}
    		Zend_Session::namespaceUnset('requestArr');
    	}
    	
    	$this->view->countActiveJobs=\Extended\job::getCountOfJobs(Auth_UserAdapter::getIdentity()->getId(), "Active");
    	$this->view->countExpiredJobs=\Extended\job::getCountOfJobs(Auth_UserAdapter::getIdentity()->getId(), "Expired");
    	$this->view->countClosedJobs=\Extended\job::getCountOfJobs(Auth_UserAdapter::getIdentity()->getId(), "Closed");
    	
    	$requestparams=$this->_request->getParams();

		if (isset($requestparams['expireDate']) && !empty($requestparams['expireDate'])) {

			$expireDate = \DateTime::createFromFormat("d-m-Y", $requestparams['expireDate']);
			$requestparams['expireDate'] = $expireDate->format('d-m-Y');

		}

        // countries list..
        $this->view->countryListing=\Extended\country_ref::getCountryList();
        // industries list..
        $this->view->industryListing=\Extended\industry_ref::getIndustryList();
        // experience level list..
        $this->view->experience_level=\Extended\experienece_level::getExperienceList();
       // job type list...
        $this->view->job_type=\Extended\job_type::getJobTypeList();
        // job status list...
        $this->view->job_status=\Extended\job_status::getJobStatusList();
        // job function list...
        $this->view->job_functions=\Extended\job_function::getJobFunctionList();

        // submit form..
		if (isset($requestparams['jobCreation'])) {

	    	// Valid formats.....
	    	$valid_formats = Zend_Registry::get('config')->image->extensions->toArray();
	    	// define size of the image 2MB maximum 1024*1024.
	    	$limit_size=2048000;
	    	
	    	$name = $_FILES['jobImage']['name'];
	    	$size = $_FILES['jobImage']['size'];
	    	if(strlen($name))
	    	{

	    		$ext=pathinfo($name,PATHINFO_EXTENSION);
	    		
	    		if(in_array($ext,$valid_formats))
	    		{
	    			if( $size < $limit_size )
	    			{
	    				// Set the upload folder path
	    				$target_path = REL_IMAGE_PATH."/jobs/";
	    				// Set temp path of the image.
	    				$temp_path=$_FILES['jobImage']['tmp_name'];
	    				// Set the file name
	    				$image_name = Helper_common::getUniqueNameForFile( $name );
	    				// Set upload image path
	    				$image_upload_path = $target_path.$image_name;
	    				
	    				if( move_uploaded_file($temp_path,$image_upload_path) ) 
	    				{
	    					// image uploaded by user
	    					$requestparams['image_name'] = $image_name;
	    					
	    					$result=\Extended\job::createNewJob($requestparams, Auth_UserAdapter::getIdentity()->getId());
	    					
	    					if($result)
	    					{
	    						$messages = new Zend_Session_Namespace('messages');
	    						$messages->successMsg = "Job created successfully";
	    						$this->_redirect('job/job-detail/job_id/'.$result);
	    					}
	    					else
	    					{

	    						$messages = new Zend_Session_Namespace('messages');
	    						$messages->errorMsg = "Server Error.";
	    						$requestArr = new Zend_Session_Namespace('requestArr');
	    						$requestArr->jobArr = $requestparams;
	    						$this->_redirect('job/create-job');
	    					}
	    				} 
	    				else
	    				{

	    					$messages = new Zend_Session_Namespace('messages');
			    			$messages->errorMsg = "Due to some server error we can't upload your image.";
			    			$requestArr = new Zend_Session_Namespace('requestArr');
    						$requestArr->jobArr = $requestparams;
			    			$this->_redirect('job/create-job');
	    				}
	    			}
	    			else
	    			{
	    				$messages = new Zend_Session_Namespace('messages');
	    				$messages->errorMsg = "Job image Size should not exceed more than 2MB.";
	    				$requestArr = new Zend_Session_Namespace('requestArr');
    					$requestArr->jobArr = $requestparams;
	    				$this->_redirect('job/create-job');
	    			}
	    		}
	    		else
	    		{
	    			$messages = new Zend_Session_Namespace('messages');
    				$messages->errorMsg = "Invalid Image.";
    				$requestArr = new Zend_Session_Namespace('requestArr');
    				$requestArr->jobArr = $requestparams;
    				$this->_redirect('job/create-job');
	    		}
	    	}
	    	else
	    	{
	    		// no image uploaded by user
	    		$result=\Extended\job::createNewJob($requestparams, Auth_UserAdapter::getIdentity()->getId());
	    		if($result)
	    		{
	    			$messages = new Zend_Session_Namespace('messages');
	    			$messages->successMsg = "Job created successfully";
	    			$this->_redirect('job/job-detail/job_id/'.$result);
	    		}
	    		else
	    		{
	    			$messages = new Zend_Session_Namespace('messages');
	    			$messages->errorMsg = "Server Error.";
	    			$requestArr = new Zend_Session_Namespace('requestArr');
	    			$requestArr->jobArr = $requestparams;
	    			$this->_redirect('job/create-job');
	    		}
	    	}
        }	
        
    }


    /**
     * function used to get list of states according to country id
     * @param country_id
     * @author Sunny Patial
     * @return json_array
     * @version 1.0
     *
     */
    public function getStatesAction()
    {
    	$country_id=$this->_getParam("country_id");
    	echo Zend_Json::encode(\Extended\state::getStateList($country_id));
    	die;
    }

    /**
     * Action for ajax call,
     * Fills cities dropdown according to state selected.
     *
     * @author jsingh7
     * @version 1.0
     *
     *
     */
    public function getResponseForStateSelectedAction()
    {
    	$state_id = $this->getRequest()->getParam("state_id");
		$userID = Auth_UserAdapter::getIdentity()->getId();
		$userObj = \Extended\ilook_user::getRowObject($userID);
		
    	$ret_array = array();
	
    	$cities = \Extended\city::getAllActiveCitiesForState($state_id);
    	foreach ( $cities as $key=>$city )
    	{
    		$ret_array['options'][$key]['id'] = $city->getId();
    		$ret_array['options'][$key]['name'] = $city->getName();
    	}	
    	$ret_array['count'] = count($cities);
		$ret_array['user_seletced_city'] = $userObj->getCity()->getId();
    	echo Zend_Json::encode( $ret_array );
    	die;
    }

    /**
     * function used to get list of cities according to state id
     * @param state_id
     * @author Sunny Patial
     * @return json_array
     * @version 1.0
     *
     */
    public function getCitiesAction()
    {
    	$state_id=$this->_getParam("state_id");
    	echo Zend_Json::encode(\Extended\city::getCityList($state_id));
    	die;
    }

    /**
     * function used to get list of cities according to country id
     * @param state_id
     * @author Sunny Patial
     * @return json_array
     * @version 1.0
     *
     *
     *
     */
    public function getCitiesUnderCountryAction()
    {
    	$country_id=$this->_getParam("country_id");
    	echo Zend_Json::encode(\Extended\city::getCityListUnderCountry($country_id));
    	die;
    }

    /**
     * function used to get list of states according to country id
     * @author spatial
     * @return json_array
     * @version 1.0
     *
     *
     *
     *
     */
    public function getSalaryRangeAction()
    {
    	$country_id=$this->_getParam("country_id");
    	echo Zend_Json::encode(\Extended\salary_range::getSalaryListing($country_id));
    	die;
    }

    /**
     * function used to get list of salaries according to country id
     *
     * @author jsingh7
	 * @
     * @return json_array
     * @version 1.0
     *
     *
     *
     */
    public function getSalaryRangesByCountryAction()
    {
		$userID = Auth_UserAdapter::getIdentity()->getId();
		$userObj = \Extended\ilook_user::getRowObject($userID);
		
		$country_id= $userObj->getUsersCountry()->getId();
    	$salaries = \Extended\salary_range::getSalaryByCountry( $country_id );
    	$temp_r = array();
    	foreach ( $salaries as $key=>$salary )
    	{
    		$temp_r[$key]['id'] = $salary->getId();
    		$temp_r[$key]['min_salary'] = $salary->getMin_salary();
    		$temp_r[$key]['max_salary'] = $salary->getMax_salary();
    		$temp_r[$key]['Currency_sym'] = $salary->getCountryRef()->getCurrency_symbol();
    	}	
    	echo Zend_Json::encode( $temp_r );
    	die;
    }
    
	/**
	 *	??????????????
	 *
	 * @author ?
	 * @version ?
	 */
    public function searchJobsAction()
    {
    	$allParams = $this->_getAllParams();
    	// common search text
    	if(isset($allParams['search']))
    	{
    		$this->view->commonSearchByJobTitle = $allParams['search'];
    	}
		$current_user_obj 					= \Extended\ilook_user::getRowObject(Auth_UserAdapter::getIdentity()->getId());
    	$this->view->search_id 				= $this->getRequest()->getParam("search_id");
		$this->view->allJobTypesObj 		= \Extended\job_type::getAllJobTypes();
		$this->view->allExperienceLevelsObj = \Extended\experienece_level::getAllExperienceLevels();
		$this->view->allCountriesObj 		= \Extended\country_ref::getAllActiveCountries();
		$this->view->allIndustriesObj 		= \Extended\industry_ref::getAllActiveIndustries();
		$this->view->receiveAlertsObj 		= \Extended\recieve_alerts::getAllOptionsForReceivingAlerts();
		$email_for_job_alerts 				= $current_user_obj->getEmail_for_job_alerts();
		$this->view->email_for_job_alerts  	= $email_for_job_alerts;
    }

    /**
     * Deletes saved searches.
     * @author hkaur5
     *
     */
    public function deleteSavedSearchAction()
    {
    	$params = $this->getRequest()->getParams();
    	$result = \Extended\saved_search::deleteCurrentSavedSearch($params['saved_search_id']);
    	if($result)
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
     * used to send saved job data 
     * to client side in the form of
     * JSON.
     * 
     * @author jsingh7	
     * @version 1.0
     */
    public function getSavedSearchAction()
    {
    	if( $this->getRequest()->getParam( "search_id" ) )
    	{
    		$result = \Extended\saved_search::getSearchRecord( $this->getRequest()->getParam( "search_id" ) );
    		
    		if( $result )
    		{
    			$saved_search_r = array();
    			$saved_search_r['job_title'] = $result->getJob_title();
    			$saved_search_r['country'] = $result->getCountryRef()?$result->getCountryRef()->getId():null;
    			$saved_search_r['state'] = $result->getState()?$result->getState()->getId():null;
    			$saved_search_r['city'] = $result->getCity()?$result->getCity()->getId():null;
    			$saved_search_r['company'] = $result->getCompany()?$result->getCompany()->getName():null;;
    			$saved_search_r['industry'] = $result->getIndustryRef()?$result->getIndustryRef()->getId():null;
    			$saved_search_r['salary'] = $result->getSalaryRange()?$result->getSalaryRange()->getId():null;
    			$saved_search_r['job_type'] = $result->getJobType()?$result->getJobType()->getId():null;
    			$saved_search_r['experience_level'] = $result->getExperieneceLevel()?$result->getExperieneceLevel()->getId():null;
    			$saved_search_r['date_from'] = $result->getDate_from()?$result->getDate_from()->format("d-m-Y"):NULL;
    			$saved_search_r['date_to'] = $result->getDate_to()?$result->getDate_to()->format("d-m-Y"):NULL;
    			echo Zend_Json::encode($saved_search_r);
    		}
    		else
    		{	
    			echo Zend_Json::encode(0);
    		}	
    	}
    	else
    	{	
    		echo Zend_Json::encode(0);
    	}
    	die;
    }

    /**
     *  Call to search job function with all the parameters sent through ajax call and set search parameteres cookies.
     *  Also find country of user through IP detection if Lat&long are sent.
     *  
     *  @author ?
     * 	@author hkaur5 ( worked on finding country through IP detection and restricting job gate jobs)
	 *
	 * @author ssharma4 (worked on updating code i.e. country from lat,long is changed into logged user country).
     * 	
     *  @return json_encoded jobs array
     * 
     */
    public function getSearchResultsAction()
    {
		// action body
    	$jobGateOff = false;
		$stripTags = Zend_Registry::get('Zend_Filter_StripTags');
		$params = $this->getRequest()->getParams();
		
		$ip_detection = false;

		$userID = Auth_UserAdapter::getIdentity()->getId();
		$userObj = \Extended\ilook_user::getRowObject($userID);

		//Get ID of country according to iLook database.
		if( $userObj ){

			//get logged user country for getting corrsponding states list
			$Logged_in_user_country_id= $userObj->getUsersCountry()->getId();
		}
		 
		//------------------------------------------------------------------------------------------------------------
		// Turning on jobGateOff flag if country selected by user does not match with country detected through IP
		// else if user has not selected any country then send country detected through IP as a searching param.
		//-------------------------------------------------------------------------------------------------------------
		if(isset($params['country']) && $params['country']!="")
		{
			if($Logged_in_user_country_id != $params['country'])
			{
				$jobGateOff = true;
			}
		}
		else
		{
			$params['country'] = $Logged_in_user_country_id;
		}
		
		//--------------------------------------------------------------------------------------------------------------
		
		//Job Title.
		// /\s\s+/ removes multiple spaces in between the string and replace them with single space. 
		$job_title = preg_replace( '/\s\s+/', ' ', $stripTags->filter( @$params['job_title'] ) );
		
		
		$chuncks = explode(" ", $job_title);
		
		$temp_str = "";
		
		foreach ( $chuncks as $chunk )
		{
			$temp_str .= preg_replace( "/\W+/", '', $chunk )." ";
		}
		
		if( !$job_title )
		{
			$jobs_r['error'] = "Oops! It seems that you have entered invalid keyword(s) for search. Try using simpler keyword(s).";
			echo Zend_Json::encode($jobs_r);
			die;
		}
		
		//state
		$state = @$params['state'];
		
		//city
		$city = @$params['city'];
		
		//company
		$company = "";
		if (isset($params['company']) && $params['company']!="") {
			$company = preg_replace( '/\s\s+/', ' ', $stripTags->filter( $params['company'] ) );
			$temp_str = "";
			$chuncks = explode(" ", $company);
			foreach ( $chuncks as $chunk )
			{
				$temp_str .= preg_replace( "/\W+/", '', $chunk )." ";
			}
			$company = trim( $temp_str );
		}

		
		//Industry
		$industry_id		= isset($params['industry']) ? $params['industry']:NULL;
		
		//Salary Range
		$salary 			= isset($params['salary']) ? $params['salary']:NULL;
		
		//job_type
		$job_type 			= isset($params['job_type']) ? $params['job_type']:NULL;
		
		//Salary Range
		$experience_level 	= isset($params['experience_level']) ? $params['experience_level']:NULL;
		
		//date posted
		$date_from 			= isset($params['date_from']) ? $params['date_from']:NULL;// format d-m-Y eg : 30-01-2014
		$date_to 			= isset($params['date_to']) ? $params['date_to']:NULL; // format d-m-Y eg : 30-01-2014
		
//		Removing all the cookies of both the forms code is in layout file according action controller called.
		setcookie("simple_search_job_title", "", time()-60*60*24*30, "/");
		setcookie("simple_search_country", "", time()-60*60*24*30, "/");
		setcookie("simple_search_state", "", time()-60*60*24*30, "/");
		setcookie("simple_search_city", "", time()-60*60*24*30, "/");
		
		
		setcookie("advance_search_job_title", "", time()-60*60*24*30, "/");
		setcookie("advance_search_country", "", time()-60*60*24*30, "/");
		setcookie("advance_search_state", "", time()-60*60*24*30, "/");
		setcookie("advance_search_city", "", time()-60*60*24*30, "/");
		setcookie("advance_search_company", "", time()-60*60*24*30, "/");
		setcookie("advance_search_industry", "", time()-60*60*24*30, "/");
		setcookie("advance_search_salary", "", time()-60*60*24*30, "/");
		setcookie("advance_search_salary", "", time()-60*60*24*30, "/");
		setcookie("advance_search_job_typ", "", time()-60*60*24*30, "/");
		setcookie("advance_search_experience_level", "", time()-60*60*24*30, "/");
		setcookie("advance_search_date_from", "", time()-60*60*24*30, "/");
		setcookie("advance_search_date_to", "", time()-60*60*24*30, "/");
		
// 		Setting cookies to retrieve search for simple search form.
		$expire = time()+60*60*24*30;//30 days
		if( $params['search_type']== 'simple')
		{
			
			setcookie("simple_search_job_title", $params['job_title'], $expire, "/");
			if (isset($params['state'])) {
				setcookie("simple_search_state", $params['state'], $expire, "/");
			}
			if (isset($params['city'])) {
				setcookie("simple_search_city", $params['city'], $expire, "/");
			}
		}
//		Setting cookies to retrieve search for advance search form.
		else if ( $params['search_type']== 'advance')
		{
			if (isset($params['job_title'])) {
				setcookie("advance_search_job_title", $params['job_title'], $expire, "/");
			}
			if (isset($params['state'])) {
				setcookie("advance_search_state", $params['state'], $expire, "/");
			}
			if (isset($params['city'])) {
				setcookie("advance_search_city", $params['city'], $expire, "/");
			}
			if (isset($params['company'])) {
				setcookie("advance_search_company", $params['company'], $expire, "/");
			}
			if (isset($params['industry'])) {
				setcookie("advance_search_industry", $params['industry'], $expire, "/");
			}
			if (isset($params['salary'])) {
				setcookie("advance_search_salary", $params['salary'], $expire, "/");
			}
			if (isset($params['job_type'])) {
				setcookie("advance_search_job_type", $params['job_type'], $expire, "/");
			}
			if (isset($params['experience_level'])) {
				setcookie("advance_search_experience_level", $params['experience_level'], $expire, "/");
			}
			if (isset($params['date_from'])) {
				setcookie("advance_search_date_from", $params['date_from'], $expire, "/");
			}
			if (isset($params['date_to'])) {
				setcookie("advance_search_date_to", $params['date_to'], $expire, "/");
			}
		}
		
// 		Getting results for search parameters
		$result = \Extended\job::getSearchResults( 	$job_title,
													$params['country'],
													$state,
													$city,
													$company,
													$industry_id,
													$salary,
													$job_type,
													$experience_level,
													$date_from,
													$date_to,
													10,
													$params['offset'],
													null,
													$jobGateOff
												);
		$jobs_r = array();
		if($result['jobs'])
		{	
			foreach ( $result['jobs'] as $key=>$job )
			{
				$jobs_r['job'][$key]['job_id'] = $job->getId();
				$jobs_r['job'][$key]['job_title'] = $job->getJob_title();
				$jobs_r['job'][$key]['job_desc'] = $job->getJob_description();
				$jobs_r['job'][$key]['job_reference'] = $job->getJob_reference();
				$jobs_r['job'][$key]['job_reference'] = $job->getJob_reference();
				$jobs_r['job'][$key]['company_name'] = Helper_common::showCroppedText($job->getCompany()->getName(),'50');
				$jobs_r['job'][$key]['industry_name'] = $job->getIndustryRef()->getTitle();
				$jobs_r['job'][$key]['company_url'] = $job->getUrl_fields();
    			$jobs_r['job'][$key]['apply_from'] = $job->getApply_from();
				$jobs_r['job'][$key]['country'] = ucfirst(strtolower($job->getCountryRef()?$job->getCountryRef()->getName():""));
				if($job->getApply_from())
				{
					$jobs_r['job'][$key]['comply_job_apply_url'] = $job->getCompany_job_apply_url();
					
				}
				else
				{
					$jobs_r['job'][$key]['comply_job_apply_url'] = "";
				}
				
				// if job posted by him self or not.
				$em = \Zend_Registry::get('em');
				try {$em->getFilters()->disable('soft-deleteable');} catch (\Exception $e) {}
				if($job->getIlookUser()->getId())
				{
					if($job->getIlookUser()->getId() == Auth_UserAdapter::getIdentity()->getId())
					{
						$jobs_r['job'][$key]['job_posted_by'] = 1 ;
					}
					else
					{
						$jobs_r['job'][$key]['job_posted_by'] = 2 ;
					}
				}
				if( $job->getState() )
				{	
					$jobs_r['job'][$key]['state'] = ucfirst(strtolower($job->getState()?$job->getState()->getName():""));
				}
				else
				{
					$jobs_r['job'][$key]['state'] = "";
				}		
				$jobs_r['job'][$key]['city'] = ucfirst(strtolower($job->getCity()?$job->getCity()->getName():""));
				
				$curr_sym = "";
				if( $job->getSalaryRange() )
				{
					if( $job->getSalaryRange()->getCountryRef() )
					{
						$curr_sym = $job->getSalaryRange()->getCountryRef()->getCurrency_symbol();
					}
					$jobs_r['job'][$key]['salaryRange'] = $curr_sym." ".$job->getSalaryRange()->getMin_salary()." - ".$job->getSalaryRange()->getMax_salary();
				}
				else
				{	
					$jobs_r['job'][$key]['salaryRange'] = "";
				}	
				$jobs_r['job'][$key]['jobType'] = $job->getJobType()->getName();
				if( $job->getExperieneceLevel() )
				{
					$jobs_r['job'][$key]['experieneceLevel'] = $job->getExperieneceLevel()->getDescription();
				}
				else
				{
					$jobs_r['job'][$key]['experieneceLevel'] = "";
				}
				
				if($job->getJob_image())
				{
					$jobs_r['job'][$key]['job_image'] = IMAGE_PATH.'/jobs/'.$job->getJob_image();
				}
				//Default image for job
				else 
				{
					$jobs_r['job'][$key]['job_image'] = IMAGE_PATH.'/job_default_image.png';
				}
// 				$jobs_r['job'][$key]['job_creator_image'] = Helper_common::getUserProfessionalPhoto( $job->getIlookUser()->getId() );
				$jobs_r['job'][$key]['time_of_post'] = Helper_common::nicetime( $job->getCreated_at()->format("Y-m-d H:i") );
				$jobs_r['job'][$key]['is_saved'] = \Extended\saved_jobs::isJobSavedByMe($job->getId(), Auth_UserAdapter::getIdentity()->getId());
				$jobs_r['job'][$key]['is_applied'] = \Extended\job_applications::isJobAppliedByMe($job->getId(), Auth_UserAdapter::getIdentity()->getId());
			
				$jobs_r['job'][$key]['can_apply'] = \Extended\job::canApply($job->getId())?1:0;
				
			}
		}
		else
		{
			$jobs_r['job'] = null;
		}
		//Show warning msg iff country selected by user is diff from country detected through ip.
		$jobs_r['show_job_gate_off_warning_msg'] = $jobGateOff;
		$jobs_r['job_gate_off_warning_msg'] = "There could be some jobs matching your search criteria but these jobs have country specific restrictions and cannot be searched when you are not actually present in that country.";
		$jobs_r['is_more_jobs'] = $result['is_more_jobs'];
		$jobs_r['error'] = 0;
	
		echo Zend_Json::encode($jobs_r);
		die;
    }

    /**
     * Fetch job details on basis of saved search criteria
	 * @param integer search_id
     * @author ?
	 * @author ssharma4
     */
    public function getSearchResultsForSavedSearchAction()
    {
    	if( $this->getRequest()->getParam( "search_id" ) )
    	{
    		$result = \Extended\saved_search::getSearchRecord( $this->getRequest()->getParam( "search_id" ) );
    		if( $result )
    		{

    			$saved_search_r = array();
    			$saved_search_r['job_title'] = $result->getJob_title();
    			$saved_search_r['country'] = $result->getCountryRef()?$result->getCountryRef()->getId():null;
    			$saved_search_r['state'] = $result->getState()?$result->getState()->getId():null;
    			$saved_search_r['city'] = $result->getCity()?$result->getCity()->getId():null;
    			$saved_search_r['company'] = $result->getCompany()?$result->getCompany()->getName():null;;
    			$saved_search_r['industry'] = $result->getIndustryRef()?$result->getIndustryRef():null;
    			$saved_search_r['salary'] = $result->getSalaryRange()?$result->getSalaryRange()->getId():null;
    			$saved_search_r['job_type'] = $result->getJobType()?$result->getJobType()->getId():null;
    			$saved_search_r['experience_level'] = $result->getExperieneceLevel()?$result->getExperieneceLevel()->getId():null;
    			$saved_search_r['date_from'] = $result->getDate_from()?$result->getDate_from()->format("d-m-Y"):NULL;
    			$saved_search_r['date_to'] = $result->getDate_to()?$result->getDate_to()->format("d-m-Y"):NULL;

				//Calling function for listing.
    			$result  = \Extended\job::getSearchResults(
    					$saved_search_r['job_title'],
    					$saved_search_r['country'],
    					$saved_search_r['state'],
    					$saved_search_r['city'],
    					$saved_search_r['company'],
    					$saved_search_r['industry'],
    					$saved_search_r['salary'],
    					$saved_search_r['job_type'],
    					$saved_search_r['experience_level'],
    					$saved_search_r['date_from'],
    					$saved_search_r['date_to'],
    					10,
    					$this->getRequest()->getParam( 'offset' ),
						'DESC',
						false
    			);
    			$jobs_r = array();
    			if($result['jobs'])
    			{
    				foreach ( $result['jobs'] as $key=>$job )
    				{
    					$jobs_r['job'][$key]['job_id'] = $job->getId();
    					
    					// if job posted by him self or not.
    					$em = \Zend_Registry::get('em');
    					try {$em->getFilters()->disable('soft-deleteable');
    					} catch (\Exception $e) {
    					}
    					if($job->getIlookUser()->getId() == Auth_UserAdapter::getIdentity()->getId())
    					{
    						$jobs_r['job'][$key]['job_posted_by'] = 1 ;
    					}
    					else
    					{
    						$jobs_r['job'][$key]['job_posted_by'] = 2 ;
    					}
    					$jobs_r['job'][$key]['job_title'] = $job->getJob_title();
    					$jobs_r['job'][$key]['job_reference'] = $job->getJob_reference();
    					$jobs_r['job'][$key]['company_name'] = $job->getCompany()->getName();
    					$jobs_r['job'][$key]['industry_name'] = $job->getIndustryRef()->getTitle();
    					$jobs_r['job'][$key]['company_url'] = $job->getUrl_fields();
    					$jobs_r['job'][$key]['apply_from'] = $job->getApply_from();
    					if( $job->getCountryRef() )
    					{
	    					$jobs_r['job'][$key]['country'] = $job->getCountryRef()->getName();
    					}	
    					else
    					{
    						$jobs_r['job'][$key]['country'] = "";
    					}	
    					if( $job->getState() )
    					{
    						$jobs_r['job'][$key]['state'] = $job->getState()->getName();
    					}
    					else
    					{
    						$jobs_r['job'][$key]['state'] = "";
    					}
    					if( $job->getCity() )
    					{
    						$jobs_r['job'][$key]['city'] = $job->getCity()->getName();
    					}
    					else
    					{
    						$jobs_r['job'][$key]['city'] = "";
    					}
    					if( $job->getSalaryRange() )
    					{		
    						$jobs_r['job'][$key]['salaryRange'] = $job->getSalaryRange()->getCountryRef()->getCurrency_symbol()." ".$job->getSalaryRange()->getMin_salary()." - ".$job->getSalaryRange()->getMax_salary();
    					}	
    					$jobs_r['job'][$key]['jobType'] = $job->getJobType()->getName();
    					
    					if( $job->getExperieneceLevel() )
    					{
    						$jobs_r['job'][$key]['experieneceLevel'] = $job->getExperieneceLevel()->getDescription();
    					}
    					else
    					{
    						$jobs_r['job'][$key]['experieneceLevel'] = "";
    					}	
    						
    					if($job->getJob_image())
    					{
    						$jobs_r['job'][$key]['job_image'] =  IMAGE_PATH.'/jobs/'.$job->getJob_image();
    					}
    					//Default image for job
    					else
    					{
    						$jobs_r['job'][$key]['job_image'] =  IMAGE_PATH.'/job_default_image.png';
    					}
//     					$jobs_r['job'][$key]['job_creator_image'] = Helper_common::getUserProfessionalPhoto( $job->getIlookUser()->getId() );
    					$jobs_r['job'][$key]['time_of_post'] = Helper_common::nicetime( $job->getCreated_at()->format("Y-m-d H:i") );
    					$jobs_r['job'][$key]['is_saved'] = \Extended\saved_jobs::isJobSavedByMe($job->getId(), Auth_UserAdapter::getIdentity()->getId());
    					$jobs_r['job'][$key]['is_applied'] = \Extended\job_applications::isJobAppliedByMe($job->getId(), Auth_UserAdapter::getIdentity()->getId());
    					$jobs_r['job'][$key]['can_apply'] = \Extended\job::canApply($job->getId());
    					$jobs_r['job'][$key]['job_desc'] = $job->getJob_description();
    				}
    			}
    			else
    			{
    				$jobs_r['job'] = null;
    			}
    			$jobs_r['is_more_jobs'] = $result['is_more_jobs'];
    			
    			echo Zend_Json::encode($jobs_r);
    			die;
    		}
    		else
    		{
    			echo Zend_Json::encode(0);
    		}
    	}
    	else
    	{
    		echo Zend_Json::encode(0);
    	}
    	die;
    }

    /**
     * function used to display the list of active jobs with OLD design.
     * @author Sunny Patial
     * @version 1.0
     *
     *
     *
     */
    public function myJobsAction()
    {
    	$userId=Auth_UserAdapter::getIdentity()->getId();
    	$requestparams = $this->getRequest()->getParams();
    	
    	if( ! @$requestparams['list_len'] )
    	{
    		$requestparams['list_len'] = 1;
    	}
    	if( ! @$requestparams['page'] )
    	{
    		$requestparams['page'] = 1;
    	}
    	$this->view->countActiveJobs=\Extended\job::getCountOfJobs($userId, "Active");
    	$this->view->countExpiredJobs=\Extended\job::getCountOfJobs($userId, "Expired");
    	$this->view->countClosedJobs=\Extended\job::getCountOfJobs($userId, "Closed");
    	
        if(isset($requestparams["order-by"]) && $requestparams["order-by"]=="asc")
        {
    		$this->view->orderBy="asc";
    		$jobListing=\Extended\job::getJobsListing($userId,"ASC","Active");
    		$this->view->jobsListing=$jobListing;
    	}
    	else
    	{
    		$this->view->orderBy="desc";
    		$jobListing=\Extended\job::getJobsListing($userId,"DESC","Active");
    		$this->view->jobsListing=$jobListing;
    	}
    	// pagination..
    	$paginator = Zend_Paginator::factory($jobListing);
    	$paginator->setItemCountPerPage(@$requestparams['list_len']);
    	$paginator->setCurrentPageNumber(@$requestparams['page']);
    	$this->view->paginator=$paginator;
    }

    public function applyAction()
    {
    	
       $params = $this->getRequest()->getParams();
        $job_id = $params['jobid'] ;

        // if user try to apply his own job then redirect it to error page
        if(Extended\job::isJobPostedByUser($job_id, Auth_UserAdapter::getIdentity()->getId())){
        	$this->_helper->redirector( 'is-not-available', 'error' );
        }
        //To check whether job has been saved or not.
        $applyToJob['job_apply_status'] = Extended\job_applications::isJobAppliedByMe($job_id, Auth_UserAdapter::getIdentity()->getId());
        if($applyToJob['job_apply_status'] == 1){
        	$job_application = Extended\job_applications::getJobApplications($job_id, Auth_UserAdapter::getIdentity()->getId());
        	$applyToJob['job_applied_on_date'] = $job_application[0]->getCreated_at()->format("F j, Y");
        }
        $obj = \Extended\job::getRowObject($job_id);
        $applyToJob['job_id'] = $job_id;
       
        if($obj->getJob_title()){
        	$applyToJob['job_title'] = $obj->getJob_title();
        }
        else{
        	$applyToJob['job_title'] = "";
        }
        $applyToJob['job_reference'] = $obj->getJob_reference();
        $applyToJob['job_description'] = $obj->getJob_description();
        $applyToJob['company_name'] = $obj->getCompany()->getName();
        $applyToJob['industry_name'] = $obj->getIndustryRef()->getTitle();
        if($obj->getCity()){
        	$applyToJob['city'] = $obj->getCity()->getName();
        }
        else{
        	$applyToJob['city'] = NULL;
        }
        if($obj->getState()){
        	$applyToJob['state'] = $obj->getState()->getName();
        }
        else{
        	$applyToJob['state'] = NULL;
        }
        if($obj->getCountryRef()){
        	$applyToJob['country'] = $obj->getCountryRef()->getName();
        }
        else{
        	$applyToJob['country'] = NULL;
        }
        if($obj->getSalaryRange()){
        	$applyToJob['salary_range'] = $obj->getSalaryRange()->getCountryRef()->getCurrency_symbol()." ".$obj->getSalaryRange()->getMin_salary()." - ".$obj->getSalaryRange()->getMax_salary();
        }
        else{
        	$applyToJob['salary_range'] = NULL;
        }
        $applyToJob['job_type'] = $obj->getJobType()->getName();
        if($obj->getExperieneceLevel()){
        	$applyToJob['experience_level'] = $obj->getExperieneceLevel()->getDescription();
        }
        else{
        	$applyToJob['experience_level'] = "";
        }
        $applyToJob['job_image'] = $obj->getJob_image();
        $applyToJob['created_at'] = $obj->getCreated_at()->format("F j, Y") ;
       // echo "<pre>"; print_r($applyToJob); die;
        $this->view->applyToJob = $applyToJob ;
    }

    /**
     * recommended Jobs Action.
     * @author nsingh3
     *
     *
     *
     */
    public function recommendedJobsAction()
    {
    	
    }

    /**
     * Gets job details.
     * @author hkaur5,sjaiswal
     */
    public function jobDetailAction()
    {

    	
    	$params = $this->getRequest()->getParams();
    	$this->view->logged_in = false;
    	$after_login_redirection_session = new Zend_Session_Namespace("after_login_redirection_session");
		$user_id =NULL;
    	//Following session functionality to be used only in case user has identity.
    	if(Auth_UserAdapter::hasIdentity())
    	{
	    	if( Auth_UserAdapter::hasIdentity() && $after_login_redirection_session->job_id && $after_login_redirection_session->receiver_id == Auth_UserAdapter::getIdentity()->getId() )
	    	{
	    		$params["job_id"] =  $after_login_redirection_session->job_id;
	    		$after_login_redirection_session->unsetAll();
	    	}
	    	else if ( Auth_UserAdapter::hasIdentity() && $after_login_redirection_session->job_id && $after_login_redirection_session->receiver_id != Auth_UserAdapter::getIdentity()->getId())
	    	{
	    		$after_login_redirection_session->unsetAll();
	    		$this->_helper->redirector( 'index', 'index' );
	    	}
	    	 
	    	 
	    	else if ( !Auth_UserAdapter::hasIdentity() )
	    	{
	    		$this->_helper->redirector( 'index', 'index' );
	    	}
	    	
	    	if( isset($params['section']) )
	    	{	
	    		$this->view->section = $params['section'];
	    	}	
	    	$user_id = Auth_UserAdapter::getIdentity()->getId();
    	}
    	
    	$job_id = $params["job_id"];
    	
    	
    	//Following functionality to be used only in case user has identity.
    	if(Auth_UserAdapter::hasIdentity())
    	{
	    	//To check whether job has been saved or not.
	    	$this->view->job_saved = Extended\saved_jobs::isJobSavedByMe($job_id, $user_id);
	    	//To check whether job has been saved or not.
	    	$this->view->job_applied_by_me = Extended\job_applications::isJobAppliedByMe($job_id, $user_id);
	    	$this->view->logged_in = true;
    	}
    	
    	//Checking whether id is passed in url else redirecting to error page.
    	if($job_id)
    	{
    		$jobObj=Extended\job::getRowObject( $job_id );
    	}
    	else
    	{
    		$this->_redirect(PROJECT_URL."/".PROJECT_NAME."job/is-not-available");
    	}	
    	//check if job obj exist only then send job array to view.
    	
    	
		if($jobObj)
		{
			
			if($jobObj->getSender_ref_id())
			{
				$ip =  $_SERVER['REMOTE_ADDR'];
				$key = 'b90b45d4bd53c881501d8dc95cefa0b4585c88e790f811972065213fbf39ab8f';
				$url = "http://api.ipinfodb.com/v3/ip-city/?key=$key&ip=$ip&format=xml";
				$url = trim($url);
				$d = file_get_contents($url);
				$xml_obj = simplexml_load_string($d);
				$country_name_detected = (string)$xml_obj->countryName;
				 
				//Get ID of country according to iLook database.
				if( $country_name_detected ){
					$country_obj = \Extended\country_ref::getRowObjectByName(trim($country_name_detected));
					if( $country_obj ){
						$Logged_in_user_country_id = $country_obj->getId();
					}
				}
				if($Logged_in_user_country_id != $jobObj->getCountryRef()->getId())
				{
					$this->_helper->redirector('is-not-available','error', 'default',array("message" => "This job is not accessible outside it's location.") );
				}
			}
	    	$job_detail_r = array(); 	
    		$job_detail_r['job_id'] = $job_id;
    		$job_detail_r['company_job_apply_url'] = $jobObj->getCompany_job_apply_url();
    		$job_detail_r['job_ref_id'] = $jobObj->getJob_reference();
    		$em = \Zend_Registry::get('em');
    		try {$em->getFilters()->disable('soft-deleteable');} catch (\Exception $e) {}
    		$job_detail_r['job_created_by'] = $jobObj->getIlookUser()->getId();
    		$job_detail_r['job_title'] = $jobObj->getJob_title();
    		$job_detail_r['job_image'] = $jobObj->getJob_image();
    		$job_detail_r['url_fields'] = $jobObj->getUrl_fields();
    		$job_detail_r['job_reference'] = $jobObj->getJob_reference();
    		if( $jobObj->getCompany() )
    		{	
    			$job_detail_r['company_name'] = $jobObj->getCompany()->getName();
    		}
    		else
    		{
    			$job_detail_r['company_name'] = "";
    		}

    		if( $jobObj->getCompany_desc())
    		{
    			$job_detail_r['company_desc'] = $jobObj->getCompany_desc();
    			
    		}
    		else
    		{
    			$job_detail_r['company_desc'] = "";
    		}
    		$job_detail_r['responsibilities'] = $jobObj->getResponsibilities();
    		$job_detail_r['industry_name'] = $jobObj->getIndustryRef()->getTitle();
    	
			$job_detail_r['skills_expertise'] = $jobObj->getSkills_n_expertise();
    		
    		$job_detail_r['country'] = $jobObj->getCountryRef()->getName();
    		$job_detail_r['apply_from'] = $jobObj->getApply_from();
    		$job_detail_r['company_url'] = $jobObj->getUrl_fields();
    		$job_detail_r['company_job_url'] = $jobObj->getCompany_job_url();
    		if( $jobObj->getState() )
    		{
    			$job_detail_r['state'] = $jobObj->getState()->getName();
    		}
    		else
    		{
    			$job_detail_r['state'] = "";
    		}
    		if( $jobObj->getCity() ){
    			$job_detail_r['city'] = $jobObj->getCity()->getName();
    		}
    		else{
    			$job_detail_r['city'] = "";
    		}
    		//$job_detail_r['job_function'] = $jobObj->getJobFunction()->getDescription();
    		
    		
    		$job_detail_r['description'] = $jobObj->getJob_description();
    		
    		if($jobObj->getSalaryRange()){
    			$job_detail_r['salaryRange'] = $jobObj->getSalaryRange()->getCountryRef()->getCurrency_symbol()." ".$jobObj->getSalaryRange()->getMin_salary()." - ".$jobObj->getSalaryRange()->getMax_salary();
    		}
    		else
    		{
    			$job_detail_r['salaryRange'] = "";
    		}
   			$job_detail_r['jobType'] = $jobObj->getJobType()->getName();
   			

   			if($jobObj->getExperieneceLevel())
   			{
   				$job_detail_r['experienceLevel'] = $jobObj->getExperieneceLevel()->getDescription();
   			}
			else
			{
				$job_detail_r['experienceLevel'] = "";
			}
			
    		$job_detail_r['job_creator_image'] = Helper_common::getUserProfessionalPhoto( $jobObj->getIlookUser()->getId() );
    		$job_detail_r['time_of_post'] =$jobObj->getCreated_at()->format("F j, Y");
    		$job_detail_r['job_posted_by'] = $jobObj->getJob_posted_by();
    		//Get application data of job.
    		$job_applications = Extended\job_applications::getJobApplications($job_id, $user_id);
    		if($job_applications)
    		{
    			$job_detail_r['applied_on'] =$job_applications[0]->getCreated_at()->format("F j, Y");
    		}
    		else
    		{
    			$job_detail_r['applied_on'] = "";
    		}
    		if(Auth_UserAdapter::hasIdentity())
    		{
    			$job_detail_r['is_posted_by_me'] = Extended\job::isJobPostedByUser($jobObj->getId(), Auth_UserAdapter::getIdentity()->getId())?1:0 ;
    		}
    			//echo "<pre>"; print_r($job_detail_r); die;
    		$this->view->job_detail = $job_detail_r;

		}
		// If job obj does not exist then Error page will be displayed.
		else 
		{
			$this->_redirect(PROJECT_URL."/".PROJECT_NAME."job/is-not-available");
		}
		
	
    	
    }
    
    
    /**
     * applyJobAction :- this action is used to apply the job after that delete the
     * saved job from saved table
     * @author nsingh3
     *
     *
     *
     */
    public function applyJobAction()
    {
    	$params = $this->getRequest()->getParams();
    	// action body
    	$return_r = array();
    	$return_r['is_success'] = 0;
    	$return_r['msg'] = "Process initiated";
    	$return_r['job_id'] = $params['job_id'] ;
    	 
    	$adapter = new Zend_File_Transfer_Adapter_Http();
    	 
    	$adapter->setValidators(array(
    			'Size'  => array('min' => 1024, 'max' => 5242880)
    			));
    			 
    			$adapter->addValidator('Extension', true,
    			'doc,docx,pdf');
    			$adapter->getValidator("Extension")->setMessages(array(
    					Zend_Validate_File_Extension::FALSE_EXTENSION      => "Please upload only doc, docx, pdf file."
    			));
    			
    			$adapter->getValidator("size")->setMessages(array(
    					Zend_Validate_File_Size::TOO_BIG       => "Please upload maximum 5 MB size file",
    					Zend_Validate_File_Size::TOO_SMALL      => "The size of a file you trying to upload, is too small, Please try file of atleast 1KB size"
    					
    			));
    					 
    					$adapter->getValidator("upload")->setMessages(array(
    	Zend_Validate_File_Upload::INI_SIZE      => "Please upload maximum 5 MB size file."
    	));
    	 
    	//If file is not valid.
    	if( !$adapter->isValid() )
    	{
    		$return_r['is_success'] = 0;
			foreach ( $adapter->getMessages() as $msg )
			{
			    //$return_r['msg'] = $msg.". ";
			    $return_r['msg'] = $msg.". ";
			}
			$return_r['job_id'] = $params['job_id'] ;
			echo Zend_Json::encode( $return_r );
			die;
    	}
		if( !$adapter->getFileInfo() )//File not uploaded.
		{
			$return_r['is_success'] = 0;
		    $return_r['msg'] = "Please upload some file";
		   	$return_r['job_id'] = $params['job_id'] ;
		    echo Zend_Json::encode( $return_r );
		    die;
		}
		else
		{
			$application_cl = NULL;
			$applicant_cv   = NULL;
			foreach ( $adapter->getFileInfo() as $key=>$filee )
			{
				$temp_path = $filee['tmp_name'];//temp path, where from move.
				$fname = $filee['name'];
				$ts_img_name = Helper_common::getUniqueNameForFile($fname);
				if( $key == "applicant_cv" )
				{
					$applicant_cv = $ts_img_name ;
					move_uploaded_file( $temp_path, "jobs/cv/". $ts_img_name );
				}
				else if( $key == "application_cl" )
				{		
					$application_cl = $ts_img_name ;
					move_uploaded_file( $temp_path, "jobs/cover_letter/". $ts_img_name );
				}
			}
		}
		
		
		// insertion into job application table
		$zend_filter_obj = Zend_Registry::get('Zend_Filter_StripTags');
		
		$applicant_msg_filtered = $zend_filter_obj->filter( $params['applicant_msg'] );
		$insertJobApplication = \Extended\job_applications::applyToJobApplication($applicant_msg_filtered, $applicant_cv, $application_cl, $params['job_id'], Auth_UserAdapter::getIdentity()->getId());	
		if($insertJobApplication)
		{
			// delete the saved job
			$deleteSavedJob = \Extended\saved_jobs::deleteSavedJobOfUser( $params['job_id'], Auth_UserAdapter::getIdentity()->getId() );
			$return_r['is_success'] = 1;
			$return_r['msg'] = "Successfully Applied";
			$return_r['job_id'] = $params['job_id'] ;
			$job_application = Extended\job_applications::getJobApplications($params['job_id'], Auth_UserAdapter::getIdentity()->getId());
			$return_r['job_applied_date'] = $job_application[0]->getCreated_at()->format("dS M Y");
			echo Zend_Json::encode( $return_r );
			die;
		}
		else
		{
			$return_r['is_success'] = 0;
			$return_r['msg'] = "Server error ";
			$return_r['job_id'] = $params['job_id'] ;
			echo Zend_Json::encode( $return_r );
			die;
		}
    
    }

    /**
     * function used to get the list of job Applicants.
     * @author Sunny Patial
     * @version 1.0
     *
     *
     *
     */
    public function getApplicantsAction()
    {
    	
    	$params = $this->getRequest()->getParams();
    	$job_id = $params["job_id"];
    	$totalRec = 3;
    	$startingRec = $params["recordStart"];
    	$applicants = \Extended\job_applications::getJobApplicants($job_id,$totalRec,$startingRec);
    	$isMoreCandidatesAvailable = \Extended\job_applications::isMoreApplicantsAvaliable($job_id,$totalRec,$startingRec);
    	
    	$imgArr=array();
    	for($i=0;$i<count($applicants);$i++){
    		$imgName=$applicants[$i]['ilookUser']['professional_image'];
    		$filename="images/profile/small_thumbnails/thumbnail_".$imgName;
    		if($imgName!="" && file_exists($filename)){
    			$applicants[$i]['ilookUser']['professional_image']=IMAGE_PATH."/profile/small_thumbnails/thumbnail_".$imgName;
    		}
    		else{
    			if($applicants[$i]['ilookUser']['gender']==Extended\ilook_user::USER_GENDER_MALE){
    				$applicants[$i]['ilookUser']['professional_image']=IMAGE_PATH."/profile/default_profile_image_male_small.png";
    			}
    			else{
    				$applicants[$i]['ilookUser']['professional_image']=IMAGE_PATH."/profile/default_profile_image_female_small.png";
    			}
    		}
    	}
    	$candidatesAvailabilty=array("isMoreCandidatesAvailable"=>$isMoreCandidatesAvailable);
    	$finalArr=array("availabiltyStatus"=>$candidatesAvailabilty,"applicantsList"=>$applicants);
    	echo Zend_Json::encode($finalArr);
    	die;
    }

    /**
     * function used to get the list of shortListed Candidates.
     * @author Sunny Patial
     * @version 1.0
     *
     *
     *
     */
    public function getShortlistedCandidatesAction()
    {
    	 
    	$params = $this->getRequest()->getParams();
    	$job_id = $params["job_id"];
    	$totalRec = 3;
    	$startingRec = $params["recordStart"];
    	$isMoreCandidatesAvailable = \Extended\job_applications::isMoreCandidatesAvaliable($job_id,$totalRec,$startingRec);
    	
    	$applicants = \Extended\job_applications::getShortListedCandidates($job_id,$totalRec,$startingRec);
    	$imgArr=array();
    	for($i=0;$i<count($applicants);$i++){
    		$imgName=$applicants[$i]['ilookUser']['professional_image'];
    		$filename="images/profile/small_thumbnails/thumbnail_".$imgName;
    		if($imgName!="" && file_exists($filename)){
    			$applicants[$i]['ilookUser']['professional_image']=IMAGE_PATH."/profile/small_thumbnails/thumbnail_".$imgName;
    		}
    		else{
    			if($applicants[$i]['ilookUser']['gender']==Extended\ilook_user::USER_GENDER_MALE){
    				$applicants[$i]['ilookUser']['professional_image']=IMAGE_PATH."/profile/default_profile_image_male_small.png";
    			}
    			else{
    				$applicants[$i]['ilookUser']['professional_image']=IMAGE_PATH."/profile/default_profile_image_female_small.png";
    			}
    		}
    	}
    	$candidatesAvailabilty=array("isMoreCandidatesAvailable"=>$isMoreCandidatesAvailable);
    	$finalArr=array("availabiltyStatus"=>$candidatesAvailabilty,"candidatesList"=>$applicants);
    	
    	echo Zend_Json::encode($finalArr);
    	die;
    	
    }

    public function myApplicationsAction()
    {
        $params = $this->getRequest()->getParams();
      //  $ilook_user_id = $params['uid'];
        if( ! @$params['list_len'] )
        {
        	$params['list_len'] = 10;
        }
        if( ! @$params['page'] )
        {
        	$params['page'] = 1;
        }
            
        if(isset($params['uid']) && $params['uid'] == Auth_UserAdapter::getIdentity()->getId())
        {
        
        	$applied_jobs = \Extended\job_applications::getMyJobApplications( $params['uid'] );
        }
        else if (isset($params['uid']) && $params['uid']!=Auth_UserAdapter::getIdentity()->getId())
        {
        
        	$this->_redirect(PROJECT_URL."/".PROJECT_NAME."job/is-not-available");
        }
        else
        {
        	
       		$applied_jobs = \Extended\job_applications::getMyJobApplications( Auth_UserAdapter::getIdentity()->getId());
        }
		$applied_job_r = array();
		if($applied_jobs )
		{
    		foreach ( $applied_jobs as $key=>$applied_job )
			{
				$applied_jobs_r['job'][$key]['job_id'] = $applied_job->getJob()->getId();
				$applied_jobs_r['job'][$key]['id'] = $applied_job->getId();
				$applied_jobs_r['job'][$key]['job_title'] = $applied_job->getJob()->getJob_title();
				$applied_jobs_r['job'][$key]['job_reference'] = $applied_job->getJob()->getJob_reference();
				$applied_jobs_r['job'][$key]['company_name'] = $applied_job->getJob()->getCompany()->getName();
				$applied_jobs_r['job'][$key]['industry_name'] = $applied_job->getJob()->getIndustryRef()->getTitle();
				$applied_jobs_r['job'][$key]['country'] = $applied_job->getJob()->getCountryRef()->getName();
				if( $applied_job->getJob()->getState() )
				{	
					$applied_jobs_r['job'][$key]['state'] = $applied_job->getJob()->getState()->getName();
				}
				else
				{
					$applied_jobs_r['job'][$key]['state'] = "";
				}		
				if( $applied_job->getJob()->getCity() )
				{
					$applied_jobs_r['job'][$key]['city'] = $applied_job->getJob()->getCity()->getName();
				}
				else 
				{
					$applied_jobs_r['job'][$key]['city'] = "";
				}
				//$applied_jobs_r['job'][$key]['job_function'] = $applied_job->getJob()->getJobFunction()->getDescription();
				$applied_jobs_r['job'][$key]['description'] = $applied_job->getJob()->getJob_description();
				if( $applied_job->getJob()->getSalaryRange() )
				{	
					$applied_jobs_r['job'][$key]['salaryRange'] = $applied_job->getJob()->getSalaryRange()->getCountryRef()->getCurrency_symbol()." ".$applied_job->getJob()->getSalaryRange()->getMin_salary()." - ".$applied_job->getJob()->getSalaryRange()->getMax_salary();
				}
				else
				{
					$applied_jobs_r['job'][$key]['salaryRange'] = "";
				}		
				$applied_jobs_r['job'][$key]['jobType'] = $applied_job->getJob()->getJobType()->getName();
				
				if($applied_job->getJob()->getExperieneceLevel())
				{
					$applied_jobs_r['job'][$key]['experienceLevel'] = $applied_job->getJob()->getExperieneceLevel()->getDescription();
				}
				else
				{
					$applied_jobs_r['job'][$key]['experienceLevel'] = "";
				}
				
// 				$applied_jobs_r['job'][$key]['job_creator_image'] = Helper_common::getUserProfessionalPhoto( $applied_job->getJob()->getIlookUser()->getId() );
				$applied_jobs_r['job'][$key]['time_of_post'] = $applied_job->getJob()->getCreated_at()->format("Y-m-d H:i");
				$applied_jobs_r['job'][$key]['applied_on_date'] = $applied_job->getCreated_at()->format("F j, Y");
				$applied_jobs_r['job'][$key]['applied_on_time'] =Helper_common::nicetime_2( $applied_job->getCreated_at()->format("Y-m-d H:i"));
				$applied_jobs_r['job'][$key]['job_image'] = $applied_job->getJob()->getJob_image();
				$applied_jobs_r['job'][$key]['job_posted_by'] = $applied_job->getJob()->getJob_posted_by();
			}
		}
		else
		{
			$applied_jobs_r = "";
		}
		
        $this->view->applied_jobs = $applied_jobs_r;
        // pagination..
        if($applied_jobs_r)
        {
        $paginator = Zend_Paginator::factory($applied_jobs_r['job']);
        $paginator->setItemCountPerPage( $params['list_len'] );
        $paginator->setCurrentPageNumber( $params['page'] );
        $this->view->paginator=$paginator;
        }
//         Zend_Debug::dump($paginator);
//         die;
    }

    /**
     * function used to get the make Applicants as a Shortlisted Candidates.
     * @author Sunny Patial
     * @version 1.0
     *
     *
     *
     */
    public function moveToShortlistedCandidatesAction()
    {
		$params = $this->getRequest()->getParams();
		$result=\Extended\job_applications::changeCandidateStatus($params["profile_id"], $params["job_id"], \Extended\job_applications::SHORTLIST_CANDIDATE);
    	$countCandidates = \Extended\job_applications::countCandidates($params["job_id"]);
		$countApplicants = \Extended\job_applications::countApplicants($params["job_id"]);
		if($result){
			echo Zend_Json::encode(array("msg"=>1, "applicants"=>$countApplicants, "candidates"=>$countCandidates));
			
		}
		else
		{
			echo Zend_Json::encode(array("msg"=>0, "applicants"=>$countApplicants, "candidates"=>$countCandidates));
		}
		die;
    }

    /**
     * function used to remove the applicant from the Shorlisted list.
     * @author Sunny Patial
     * @version 1.0
     *
     *
     *
     */
    public function removeFromShortlistedCandidatesAction()
    {
		$params = $this->getRequest()->getParams();
		$result=\Extended\job_applications::changeCandidateStatus($params["profile_id"], $params["job_id"], \Extended\job_applications::NOT_SHORTLISTED_CANDIDATE);
		$countCandidates = \Extended\job_applications::countCandidates($params["job_id"]);
		$countApplicants = \Extended\job_applications::countApplicants($params["job_id"]);
		if($result){
			echo Zend_Json::encode(array("msg"=>1, "applicants"=>$countApplicants, "candidates"=>$countCandidates));
			
		}
		else
		{
			echo Zend_Json::encode(array("msg"=>0, "applicants"=>$countApplicants, "candidates"=>$countCandidates));
		}
		die;
    }

    /**
     * Calls saveSearch method.
     *
     * @author jsingh7
     *
     *
     *
     *
     *
     *
     */
    public function saveSearchAction()
    {
    	$current_user_obj = \Extended\ilook_user::getRowObject(Auth_UserAdapter::getIdentity()->getId());
    	$email_for_job_alerts = $current_user_obj->getEmail_for_job_alerts();
    	extract($this->getRequest()->getParams());
    	//Is search already saved?
    	$name_already_exist = \Extended\saved_search::isSearchAlreadySaved( $search_name, Auth_UserAdapter::getIdentity()->getId() );
    	if( $name_already_exist )
    	{
    		echo Zend_Json::encode(array('status'=>2));
    		die;
    	}
    	
    	//Saving search.

    	$result = \Extended\job::saveSearch( $this->getRequest()->getParams(), Auth_UserAdapter::getIdentity()->getId() );
    	
    	if($result)
    	{
    		echo Zend_Json::encode(array('status'=>1, 'id'=>$result));
    	}
    	else
    	{    		
    		echo Zend_Json::encode(array('status'=>0));
    	}
    	die;
    }

    /**
     * Change job status.
     *
     * @author Shaina.
     * @version 1.0
     *
     *
     *
     *
     *
     */
    public function changeMyJobsStatusAction()
    {
    	// action body
    	$userId=Auth_UserAdapter::getIdentity()->getId();
    	$status_active = $this->getRequest()->getParam('status_active');
    	$changeJobStatus=\Extended\job::changeJobStatus($this->getRequest()->getParam('id'),$status_active);
    	echo Zend_Json::encode($changeJobStatus);
    	die;
    }

    /**
     * function used to delete candidate from the Applicant listing
     * @author Sunny Patial
     * @version 1.0
     *
     *
     *
     */
    public function deleteApplicantAction()
    {
    	$params = $this->getRequest()->getParams();
    	$result=\Extended\job_applications::deleteCandidate($params["job_id"], $params["profile_id"]);
   		$countCandidates = \Extended\job_applications::countCandidates($params["job_id"]);
		$countApplicants = \Extended\job_applications::countApplicants($params["job_id"]);
		if($result){
			echo Zend_Json::encode(array("msg"=>1, "applicants"=>$countApplicants, "candidates"=>$countCandidates));
			
		}
		else
		{
			echo Zend_Json::encode(array("msg"=>0, "applicants"=>$countApplicants, "candidates"=>$countCandidates));
		}
    	die;
    }

    /**
     * Get saved searches for current user. 
     * @author hkaur5
     *
     *
     *
     *
     *
     *
     */
    public function getSavedSearchesAction()
    {
    	$params = $this->getRequest()->getParams();
    	$result= \Extended\saved_search::getAllSavedSearchesForAUser($params['user_id']);
    	$search_r = array();
    	foreach($result as $key=>$search)
    	{
    		$search_r[$key]['search_name'] = $search->getSave_search_name();
    		$search_r[$key]['id'] =$search->getId();
	    	
    	}
//     	Zend_Debug::dump($search_r);
//     	die;
    	echo Zend_Json::encode($search_r);
    	die;
    }

    /**
     * update search name.
     * @author hkaur5
     *
     *
     *
     *
     *
     *
     */
    public function updateSavedSearchNameAction()
    {
    		
    		$params=$this->getRequest()->getParams();
    		$result=\Extended\saved_search::updateCurrentSavedSearchName($params["search_id"],$params["search_name"]);
    		
    		$search_r = array();
    		if($result!="exist" && $result!="0")
    		{
    		$search_r['search_name'] =$result->getSave_search_name();
    		$search_r['search_id'] =$result->getId();
    		}
    		else if( $result=="exist")
    		{
    			$search_r['exist'] = "exist";
    		}
    		echo Zend_Json::encode($search_r);
    		die;
    	
    }

    /**
     * function used to display the list of Expired Jobs
     * @author Sunny Patial
     * @version 1.0
     *
     *
     *
     */
    public function expiredJobsAction()
    {
    	$userId=Auth_UserAdapter::getIdentity()->getId();
    	$requestparams = $this->getRequest()->getParams();
    	
    	if( ! @$requestparams['list_len'] )
    	{
    		$requestparams['list_len'] = 20;
    	}
    	if( ! @$requestparams['page'] )
    	{
    		$requestparams['page'] = 1;
    	}
    	$this->view->countActiveJobs=\Extended\job::getCountOfJobs($userId, "Active");
    	$this->view->countExpiredJobs=\Extended\job::getCountOfJobs($userId, "Expired");
    	$this->view->countClosedJobs=\Extended\job::getCountOfJobs($userId, "Closed");
    	
    	if(isset($requestparams["order-by"]) && $requestparams["order-by"]=="asc")
    	{
    		$this->view->orderBy="asc";
    		$jobListing=\Extended\job::getJobsListing($userId,"ASC","Expired");
    		$this->view->jobsListing=$jobListing;
    	}
    	else
    	{
    		$this->view->orderBy="desc";
    		$jobListing=\Extended\job::getJobsListing($userId,"DESC","Expired");
    		$this->view->jobsListing=$jobListing;
    	}
    	// pagination..
    	$paginator = Zend_Paginator::factory($jobListing);
    	$paginator->setItemCountPerPage(@$requestparams['list_len']);
    	$paginator->setCurrentPageNumber(@$requestparams['page']);
    	$this->view->paginator=$paginator;
    	
    }

    /**
     * function used to display the list of Closed Jobs
     * @author Sunny Patial
     * @version 1.0
     *
     *
     *
     */
    public function closedJobsAction()
    {
    	$userId=Auth_UserAdapter::getIdentity()->getId();
    	$requestparams = $this->getRequest()->getParams();
    	 
    	if( ! @$requestparams['list_len'] )
    	{
    		$requestparams['list_len'] = 20;
    	}
    	if( ! @$requestparams['page'] )
    	{
    		$requestparams['page'] = 1;
    	}
    	$this->view->countActiveJobs=\Extended\job::getCountOfJobs($userId, "Active");
    	$this->view->countExpiredJobs=\Extended\job::getCountOfJobs($userId, "Expired");
    	$this->view->countClosedJobs=\Extended\job::getCountOfJobs($userId, "Closed");
    	 
    	if(isset($requestparams["order-by"]) && $requestparams["order-by"]=="asc")
    	{
    		$this->view->orderBy="asc";
    		$jobListing=\Extended\job::getJobsListing($userId,"ASC","Closed");
    		$this->view->jobsListing=$jobListing;
    	}
    	else
    	{
    		$this->view->orderBy="desc";
    		$jobListing=\Extended\job::getJobsListing($userId,"DESC","Closed");
    		$this->view->jobsListing=$jobListing;
    	}
    	// pagination..
    	$paginator = Zend_Paginator::factory($jobListing);
    	$paginator->setItemCountPerPage(@$requestparams['list_len']);
    	$paginator->setCurrentPageNumber(@$requestparams['page']);
    	$this->view->paginator=$paginator;
    }

    /**
     * Calls saveJob method.
     *
     * @author jsingh7
     *
     *
     *
     *
     *
     *
     */
    public function saveJobAction()
    {
    	$result = \Extended\saved_jobs::saveJob( $this->getRequest()->getParam('job_id'), Auth_UserAdapter::getIdentity()->getId() );
    	if($result)
    	{
    		echo Zend_Json::encode(array('status'=>1, 'id'=>$result));
    	}
    	else
    	{
    		echo Zend_Json::encode(array('status'=>0));
    	}
    	die;
    }

    /**
     * Calls UnsaveJob method.
     *
     * @author hkaur5
     *
     *
     *
     */
    public function unsaveJobAction()
    {
		$result = \Extended\saved_jobs::UnsaveJob( $this->getRequest()->getParam('job_id'), Auth_UserAdapter::getIdentity()->getId() );
		if($result)
		{
			//$messages = new Zend_Session_Namespace('messages');
	    	//$messages->successMsg = "Job unsaved successfully.";
			echo Zend_Json::encode(1);
		}
		else
		{
			//$messages = new Zend_Session_Namespace('messages');
			//$messages->errorMsg = "Some error has occured while unsaving job.Please try again.";
			echo Zend_Json::encode(0);
		}
		die;
    }

    /**
     * Used to fetch all saved jobs of login user.
     * @author nsingh3
     *
     *
     *
     */
    public function savedJobsAction()
    {
        // action body
    	$savedJobs = \Extended\saved_jobs::getSavedJobsListing(Auth_UserAdapter::getIdentity()->getId());
    	
    	if($savedJobs)
    	{
    		$savedJobCount = 0 ;
    		
    		foreach ($savedJobs as $savedJobDetail)
    		{	
    			//Getting Id of corresponding job.
    			if(is_object($savedJobDetail->getJob()))
    			{    			
	    			$jobDetial = \Extended\job::getRowObject($savedJobDetail->getJob()->getId());
	    			$result[$savedJobCount]['job_id'] = $jobDetial->getId();
	    			$result[$savedJobCount]['job_title'] = $jobDetial->getJob_title();
	    			$result[$savedJobCount]['job_reference'] = $jobDetial->getJob_reference();
	    			$result[$savedJobCount]['company'] = $jobDetial->getCompany()->getName();
	    			if( is_resource( $jobDetial->getCompany_desc() ) )
	    			{
	    				$result[$savedJobCount]['description'] = stream_get_contents( $jobDetial->getJob_description() );
	    			}
	    			else 
	    			{
	    				$result[$savedJobCount]['description'] = $jobDetial->getJob_description();
	    			}
	    			$result[$savedJobCount]['industry'] = $jobDetial->getIndustryRef()->getTitle();
	    			$result[$savedJobCount]['apply_from'] = $jobDetial->getApply_from();
	    			$result[$savedJobCount]['company_url'] = $jobDetial->getUrl_fields();
	    			$result[$savedJobCount]['company_job_apply_url'] = $jobDetial->getCompany_job_apply_url();
	    			if( $jobDetial->getCity() )
	    			{	
	    				$result[$savedJobCount]['city'] = $jobDetial->getCity()->getName();
	    			}
	    			else
	    			{
	    				$result[$savedJobCount]['city'] = "";
	    			}
	    			if( $jobDetial->getState() )
	    			{
	    				$result[$savedJobCount]['state'] = $jobDetial->getState()->getName();
	    			}
	    			else
	    			{
	    				$result[$savedJobCount]['state'] = "";
	    			}
	    			if( $jobDetial->getCountryRef() )
	    			{
		    			$result[$savedJobCount]['country'] = $jobDetial->getCountryRef()->getName();
	    			}
	    			else
	    			{
	    				$result[$savedJobCount]['country'] = "";
	    			}
	    			if( $jobDetial->getSalaryRange() )
	    			{	
	    				$result[$savedJobCount]['salary_range'] = $jobDetial->getSalaryRange()->getCountryRef()->getCurrency_symbol()." ".$jobDetial->getSalaryRange()->getMin_salary()." - ".$jobDetial->getSalaryRange()->getMax_salary();
	    			}
	    			else
	    			{
	    				$result[$savedJobCount]['salary_range'] = "";
	    			}		
	    			$result[$savedJobCount]['job_type'] = $jobDetial->getJobType()->getName();
	    			
	    			if($jobDetial->getExperieneceLevel())
	    			{
		    			$result[$savedJobCount]['experience_level'] = $jobDetial->getExperieneceLevel()->getDescription();
	    			}
	    			else
	    			{
	    				$result[$savedJobCount]['experience_level'] = "";
	    			}
// 	    			$result[$savedJobCount]['job_creator_image'] = Helper_common::getUserProfessionalPhoto($jobDetial->getIlookUser()->getId());
	    			$result[$savedJobCount]['job_image'] =$jobDetial->getJob_image();
	    			$result[$savedJobCount]['is_applied_by_me'] =\Extended\job_applications::isJobAppliedByMe( $jobDetial->getId(), Auth_UserAdapter::getIdentity()->getId());
	    			$result[$savedJobCount]['can_apply'] =\Extended\job::canApply( $jobDetial->getId() );
	    			$result[$savedJobCount]['job_status'] =\Extended\job::getStatusOfJob( $jobDetial->getId() );
	    			$result[$savedJobCount]['created_at'] = $savedJobDetail->getCreated_at()->format("F j, Y") ;
	    			
	    			$savedJobCount++ ;
    			}
    		}
    		//------ PAGINATION -------
    		if($result)
    		{
    			$paginator = Zend_Paginator::factory($result);
    			$paginator->setItemCountPerPage(10);
    			$paginator->setCurrentPageNumber( @$this->getRequest()->getParam('page') );
    			$this->view->paginator=$paginator;
    		}
    	}
    }

    public function isNotAvailableAction()
    {
        // action body
    	Zend_Layout::getMvcInstance()->assign('disableMainMenu', TRUE);
    }

    /**
     * function used to display the list of Active Jobs
     * @author Sunny Patial
     * @version 1.0
     *
     *
     *
     */
    public function activeJobsAction()
    {
       $userId=Auth_UserAdapter::getIdentity()->getId();
    	$requestparams = $this->getRequest()->getParams();
    	
    	if( ! @$requestparams['list_len'] )
    	{
    		$requestparams['list_len'] = 20;
    	}
    	if( ! @$requestparams['page'] )
    	{
    		$requestparams['page'] = 1;
    	}
    	$this->view->countActiveJobs=\Extended\job::getCountOfJobs($userId, "Active");
    	$this->view->countExpiredJobs=\Extended\job::getCountOfJobs($userId, "Expired");
    	$this->view->countClosedJobs=\Extended\job::getCountOfJobs($userId, "Closed");
    	
        if(isset($requestparams["order-by"]) && $requestparams["order-by"]=="asc")
        {
    		$this->view->orderBy="asc";
    		$jobListing=\Extended\job::getJobsListing($userId,"ASC","Active");
    		$this->view->jobsListing=$jobListing;
    	}
    	else
    	{
    		$this->view->orderBy="desc";
    		$jobListing=\Extended\job::getJobsListing($userId,"DESC","Active");
    		$this->view->jobsListing=$jobListing;
    	}
    	// pagination..
    	if($jobListing)
    	{
	    	$paginator = Zend_Paginator::factory($jobListing);
	    	$paginator->setItemCountPerPage(@$requestparams['list_len']);
	    	$paginator->setCurrentPageNumber(@$requestparams['page']);
	    	$this->view->paginator=$paginator;
    	}
    }

    public function shareJobAction()
    {
    	//action body
    	$params = $this->getRequest()->getParams();
    	
    	$job = \Extended\job::getRowObject( $params['job_id'] );
    	
    	$users_str = trim( $params['users_str'], "," );
    	
    	if( $users_str )
    	{
    		$receivers = $users_str;
    		$receivers_r = explode(",", $receivers);
    		if( $receivers_r )
    		{
    			//Sending imail message.
				$imail_message = "";
				$imail_message .= '<div style="width:100%; overflow:hidden; margin:0 auto; font-size:12px; font-family:Arial, Helvetica, sans-serif; background:url(images/body-bg.png);" id="outerwrapper">';
				$imail_message .= '<div style="width:100%; padding:0; float: left;" id="content-section">';
				$imail_message .= '<div style="background:#fff; float:left; margin:0; padding:0; width: 100%;" class="job-detail-col1">';
				$imail_message .= '<div class="job-detail-col1-detail" style="width:450px; padding:10px">';
				$imail_message .= '<h4 style="font-size:16px; margin:0; font-weight:bold;color:#48545E;">';
				$imail_message .= '<a target="_blank" style=" color: #6C518F; text-decoration: none;"  href="'.PROJECT_URL.'/'.PROJECT_NAME.'job/job-detail/job_id/'.$params['job_id'].'">'.$job->getJob_title().'</a>';
				$imail_message .= '</h4>';
				if( $job->getCompany() )
				{
					$imail_message .= '<p style="margin:5px 0 0 0;">'.$job->getCompany()->getName().' - ';
				}
				else
				{
					$imail_message .= '<p style="margin:5px 0 0 0;">No company name - ';
				}
				if( $job->getCity() )
				{
					$imail_message .= $job->getCity()->getName().', ';
				}
				if( $job->getState() )
				{
					$imail_message .= $job->getState()->getName().', ';
				}
				if( $job->getCountryRef() )
				{
					$imail_message .= $job->getCountryRef()->getName();
				}
				$imail_message .= '</p>';
				$imail_message .= '<p style="margin:5px 0 0 0;">';
				$imail_message .= '<a style="color: #6C518F; text-decoration: none;" class="text-purple-link" href="'.$job->getUrl_fields().'">'.$job->getUrl_fields().'</a>';
				$imail_message .= '</p>';
				$imail_message .= '</div>';
				$imail_message .= '</div>';
				$imail_message .= '<div class="job-detail-col1" style="background:#fff; float:left; margin:0 0 2px 0; padding:10px; width: 97%;" >';
				$imail_message .= '<h3 style="font-size:15px; margin:0; font-weight:normal;color:#6C518F ">Job Description</h3>';
				if( is_resource( $job->getJob_description() ) )
				{
					$job_desc_str = stream_get_contents( $job->getJob_description() );
					$imail_message .= '<p style="margin:5px 0 0 0;">'.$job_desc_str.'</p>';
				}
				else
				{
					$imail_message .= '<p style="margin:5px 0 0 0;">'.$job->getJob_description().'</p>';
				}
				
				$imail_message .= '</div>';
// 				$imail_message .= '<div style=" background: none repeat scroll 0 0 #F6F6F6; float: left; margin: 2px 0 0; padding: 6px 0; text-align: center; width: 100%; font-size:13px;">';
// 				$imail_message .= '<a style="color:#6C518F; text-decoration:none; display:block;" href="javascript:;">To View More visit iLook</a>';
// 				$imail_message .= '</div>';
				$imail_message .= '</div>';
				$imail_message .= '</div>';
    			 
    			\Helper_common::sendMessage( Auth_UserAdapter::getIdentity()->getId(), $receivers_r, "Job Invitation Request", $imail_message, \Extended\message::MSG_TYPE_JOB_REQ, NULL, FALSE, null, null, null, null, $params['job_id'] ,null, 29);
    			
    			foreach ( $receivers_r as $receiver )
    			{
    				$link_to_job_detail_page = PROJECT_URL.'/'.PROJECT_NAME.'job/job-detail/job_id/'.$job->getId().'/receiver_id/'.$receiver;
    			//Sending email message.
    			$email_message = "";
    			$email_message .= '<table width="100%" align="center" cellspacing="0" cellpadding="0" style=" padding:0; font-family:Arial;">
									<tr>
									<td style="padding:20px 0 0 0; margin:0;"></td>
									</tr>
									<tr>
									<td>
									<table width="100%" cellspacing="0" cellpadding="0" style=" padding:10px 0; margin:0; font-family:Arial; background:#ffffff; border:1px solid #c4c4c4;">
									<tr>
									<td style="padding:5px 0 0 15px;margin:0;">
									<a href="'.$link_to_job_detail_page.'" style=" padding:0px 0px; margin:0; color:#6C518F;font-family:Arial; font-size:16px; text-decoration:none;">'.$job->getJob_title().'</a>
									</td>
									</tr>';
									if( $job->getCompany() )
									{
									$email_message  .= '<tr>
									<td style="padding:5px 0 0 15px;margin:0;">
									<p style=" padding:0px 0px; margin:0; color:#444444;
									font-family:Arial; font-size:13px;">'.$job->getCompany()->getName().'</p>
									</td>
									</tr>';
									}
									else
									{
									$email_message  .= 	'<tr>
										<td style="padding:5px 0 0 15px;margin:0;">
										<p style=" padding:0px 0px; margin:0; color:#444444;font-family:Arial; font-size:13px;">No company name -</p>
										</td>
										</tr>';
									}
									$email_message  .= '<tr>
									<td style="padding:5px 0 0 15px;margin:0;">
									<a href="'.$job->getUrl_fields().'" style=" padding:0px 0px; margin:0; color:#6C518F;font-family:Arial; font-size:13px; text-decoration:none;">'.$job->getUrl_fields().'</a>
									</td>
									</tr>
									<tr>
									<td style="padding:5px 15px 10px 15px;margin:0;">
									<h2 style=" padding:5px 0px; margin:0; color:#444;font-family:Arial; font-size:15px;">Job Description</h2>
									<p style=" padding:0px 0px; margin:0; color: #4c4c4c;font-family:Arial; font-size:13px;">'.
									$job->getJob_description().
									'</tr>
									</td>
									</tr>
									</table>
									</table>';
    			
    			
    				
    				
    				$user = \Extended\ilook_user::getRowObject($receiver);
    				// check email settings for job invite 
    				$email_on_job_invite = \Extended\job::checkEmailOnJobInvite($receiver);
    				if($email_on_job_invite=='default' || $email_on_job_invite==true)
    				{
    					
    				\Email_Mailer::sendMail(
						"Job Invitation Request",
						$email_message,
						$user->getFirstname(),
						$user->getEmail(),
						array(),
						Email_Mailer::DEFAULT_SENDER_NAME,
						Email_Mailer::DEFAULT_SENDER_EMAIL,
						Email_Mailer::DEFAULT_SALUTATION,
						Email_Mailer::DEFAULT_COMPLIMENTARY_CLOSING
						);

    				
    				}
    			}	
    			
    			echo Zend_Json::encode(1);
    		}
    		else
    		{
    			echo Zend_Json::encode(2);//No receivers selected.
    		}	
    	}
    	else
    	{
    		echo Zend_Json::encode(2);//No receivers selected.
    	}
    	die;
    }


    /**
     * function used to display the job in detail
     * @author Sunny Patial
     * @version 1.0
     *
     *
     *
     */
    public function detailAction()
    {
    	$userId=Auth_UserAdapter::getIdentity()->getId();
    	$requestparams = $this->getRequest()->getParams();
    	 
    	$this->view->countActiveJobs=\Extended\job::getCountOfJobs($userId, "Active");
    	$this->view->countExpiredJobs=\Extended\job::getCountOfJobs($userId, "Expired");
    	$this->view->countClosedJobs=\Extended\job::getCountOfJobs($userId, "Closed");
    	 
    	$jobListing=\Extended\job::getJobsDetail($requestparams["id"]);
    	$this->view->jobsListing=$jobListing;
    }

    /**
     * function used to get the comment on the basis of JobId.
     * @author Sunny Patial
     * @version 1.0
     *
     *
     *
     */
    public function getCommentAction()
    {
    	$params = $this->getRequest()->getParams();
    	$jobObj=\Extended\job::getRowObject($params["jobID"]);
    	$comment=$jobObj->getComments();
    	$title=$jobObj->getJob_title();
    	$resultArr=array("title"=>$title,"comment"=>$comment);
    	echo Zend_Json::encode($resultArr);
    	die;
    }

    /**
     * function used to update the comment on the basis of JobId.
     * @author Sunny Patial
     * @version 1.0
     *
     *
     *
     */
    public function updateCommentAction()
    {
    	$params = $this->getRequest()->getParams();
    	$jobObj=\Extended\job::updateComment($params["jobID"], $params["comment"]);
    	if($jobObj){
    		echo Zend_Json::encode(array("msg"=>"success"));
    	}
    	else{
    		echo Zend_Json::encode(array("msg"=>"fail"));
    	}
    	die;
    }

    /**
     * function used to delete multiple jobs.
     * @author Sunny Patial
     * @version 1.0
     *
     *
     *
     */
    public function deleteMultipleJobsAction()
    {
    	$params=$this->getRequest()->getParams();
    	$jobIdsArr=explode(",", $params['jobIDs']);
    	// delete saved jobs
//     	Zend_Debug::dump($jobIdsArr);
//     	die;
    	
    	for($i=0;$i<count($jobIdsArr);$i++)
    	{
    		$deleteSavedJob = \Extended\saved_jobs::deleteSavedJobByID($jobIdsArr[$i]);
    	}
    	if($deleteSavedJob)
    	{
    		// delete job applications
    		for($i=0;$i<count($jobIdsArr);$i++)
    		{
	    		$resutl=\Extended\job_applications::deleteApplicants($jobIdsArr[$i]);
    		}
	    	if($resutl)
	    	{
	    		// delete jobs
	    		for($i=0;$i<count($jobIdsArr);$i++)
	    		{
	    			$result=\Extended\job::deleteJob($jobIdsArr[$i]);
	    		}
	    		if($result)
	    		{
	    			echo Zend_Json::encode(array("msg"=>"success"));
	    			$messages = new Zend_Session_Namespace('messages');
	    			$messages->successMsg = "Job Removed.";
	    		}
	    		else
	    		{

	    			echo Zend_Json::encode(array("msg"=>"error"));
	    			$messages = new Zend_Session_Namespace('messages');
	    			$messages->successMsg = "Server Error.";
	    		}
	    	}
	    	else
	    	{

	    		echo Zend_Json::encode(array("msg"=>"error"));
	    		$messages = new Zend_Session_Namespace('messages');
	    		$messages->successMsg = "Server Error.";
	    	}
    	}
    	else
    	{
    		echo Zend_Json::encode(array("msg"=>"error"));
    		$messages = new Zend_Session_Namespace('messages');
    		$messages->successMsg = "Server Error.";
    	}
    	die;
    }

    public function getMyLinksAction()
    {
    	$links_obj = Extended\ilook_user::getLinksOfUser( Auth_UserAdapter::getIdentity()->getId() );
    	//     	Zend_Debug::dump($links_obj);
    	$contacts_r = array();
    	foreach ( $links_obj as $key=>$lk )
    	{
    		$contacts_r[$key]['user_id'] = $lk->getId();
    		$contacts_r[$key]['first_name'] = Helper_common::showCroppedText($lk->getFirstname(), 15);
    		$contacts_r[$key]['last_name'] = Helper_common::showCroppedText($lk->getLastname(), 15);
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
     * Used for handling ajax call
     * to change status of job to closed.
     *
     * @author jsingh7
     * @version 1.0
     *
     *
     *
     */
    public function setJobStatusClosedAction()
    {
    	if( \Extended\job::ChangeJobStatus( $this->getRequest()->getParam('job_id'), 4 ) )
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
     * Set new expiy date of current job.
     * @author hkaur5
     *
     *
     *
     */
    public function setNewExpiryDateOfJobAction()
    {
    	if($this->getRequest()->getParam('expiry_date') )
    	{
    		$job = \Extended\job::ChangeJobExpiryDate( $this->getRequest()->getParam('job_id'), $this->getRequest()->getParam('expiry_date') );
    	}
    	
    	if( $job )
    	{
    		$messages = new Zend_Session_Namespace('messages');
			$messages->successMsg = "Job renewed successfully.";
    		echo Zend_Json::encode(1);
    	}
    	else
    	{
    		$messages = new Zend_Session_Namespace('messages');
    		$messages->errorMsg = "You have not selected any date to renew job.";
    		echo Zend_Json::encode(0);
    	}
    	die;
    }

    /**
     * Set new expiy date of current job.
     * @author hkaur5
     *
     *
     *
     */
    public function renewJobAndChangeStatusToActiveAction()
    {
    	if($this->getRequest()->getParam('expiry_date') )
    	{
	    	$jobExpiry = \Extended\job::ChangeJobExpiryDate( $this->getRequest()->getParam('job_id'), $this->getRequest()->getParam('expiry_date') );
	    	$jobStatus = \Extended\job::changeJobStatus( $this->getRequest()->getParam('job_id'),1 );
    	}
    	if($jobExpiry && $jobStatus)
    	{
    		$messages = new Zend_Session_Namespace('messages');
			$messages->successMsg = "Job renewed successfully.";
    		echo Zend_Json::encode(1);
    	}
    	else
    	{
    		$messages = new Zend_Session_Namespace('messages');
    		$messages->errorMsg = "Job renewed successfully.";
    		echo Zend_Json::encode(0);
    	}
    	die;
    }

    /**
     * delete-jobs 
     * @author nsingh3
     * @version 1.0
     *
     *
     *
     */
    public function deleteJobAction()
    {
    	$params = $this->getRequest()->getParams();
    	foreach ($params['job_ids'] as $job_id)
    	{
    		$deleteSavedJob = \Extended\saved_jobs::deleteSavedJobByID($job_id);
    	}
    	$messages = new Zend_Session_Namespace('messages');
    	$messages->successMsg = "Job(s) has been deleted successfully.";
    	echo Zend_Json::encode(1);
    	die;
    }

    /**
     * Handles ajax call for listing recommended jobs.
     * removed geolocation concept to get current country & use logged user's country[ssharma4]
     * @author spatial
     * @author Jsingh7
	 * @author ssharma4
     * 
     * @version 1.2
     */
    public function getMoreRecommendedJobsAction()
    {
    	$requestparams 				= $this->getRequest()->getParams();
    	$userId						= Auth_UserAdapter::getIdentity()->getId();
    	$industry_id				= 0;
    	$Logged_in_user_country_id 	= 0;//Logged in user country ID is required to show him/her his/her country's jobs only.

		$userObj = \Extended\ilook_user::getRowObject($userId);

		//Get ID of country according to iLook database.
    	if( $userObj ){
			$Logged_in_user_country_id= $userObj->getUsersCountry()->getId();
    	}	
    	//-----------------------------------------------------------------
    	$allMyJobTitles_r 		= \Extended\experience::getAllJobTitlesOfUser( Auth_UserAdapter::getIdentity()->getId() );
    	$jobTitleChunks 		= array();
    	
    	foreach ( $allMyJobTitles_r as $myJobTitle ){
    		
    		$chunks = explode( " ", preg_replace('/\s+/', ' ',$myJobTitle['job_title']) );
    		
    		foreach ( $chunks as $chunk ){
    			
    			$jobTitleChunks[] = $chunk;
    		}
    	}
    	//Fetching job ids which I already applied.
    	$AppliedJobsByMe 		= \Extended\job_applications::getMyJobApplications(Auth_UserAdapter::getIdentity()->getId());
    	$AppliedJobsByMe_r 		= array();
    	foreach ( $AppliedJobsByMe as $AppliedJobByMe )
    	{
    		$AppliedJobsByMe_r[] = $AppliedJobByMe->getJob()->getId();
    	}
    	//Setting industry ID of user.
    	if( Auth_UserAdapter::getIdentity()->getUsersIndustry() ){
    		$industry_id 		= Auth_UserAdapter::getIdentity()->getUsersIndustry()->getId();
    	}
    	
    	$recommendedJobs 		= \Extended\job::getRecomendedJobs( $jobTitleChunks, 
    																$industry_id,
    																$Logged_in_user_country_id,
    																Auth_UserAdapter::getIdentity()->getId(),
    																$AppliedJobsByMe_r, 
    																$requestparams["recordLimit"], 
    																$requestparams["offset"]  );

    	$jobAvailability 		= $recommendedJobs["is_more_records"];
    	$jobArr					=array();
    	if(count($recommendedJobs['data'])>0){
    		foreach ($recommendedJobs['data'] as $job)
    		{
    			if($job->getJob_image()!=null){
					$imgPath=IMAGE_PATH.'/jobs/'.$job->getJob_image();
				}
				else{
					$imgPath=IMAGE_PATH.'/job_default_image.png';
				}
				
				//if( count( $job->getJob_applications() ) > 0 )
				if(\Extended\job_applications::isJobAppliedByMe($job->getId(), Auth_UserAdapter::getIdentity()->getId()))
				{
					$appStatus = 1;
				}
				else
				{
					$appStatus = 0;
				}
				if( \Extended\saved_jobs::isJobSavedByMe($job->getId(), $userId) )
				{
					$saveStatus = 1;
				}
				else
				{
					$saveStatus = 0;
				}
				
				if( $job->getSalaryRange() )
				{
					$salaryRange = $job->getCountryRef()->getCurrency_symbol()." ".$job->getSalaryRange()->getMin_salary()." - ".$job->getSalaryRange()->getMax_salary();
				}
				else
				{
					$salaryRange = "";
				}
				
				if( $job->getExperieneceLevel() )
				{
					$exp_lvl = $job->getExperieneceLevel()->getDescription();
				}
				else
				{
					$exp_lvl = "";
				}		
				if( is_resource($job->getJob_description()))
				{
					$job_description_str = stream_get_contents($job->getJob_description());
				}
				else
				{
					$job_description_str = $job->getJob_description();
				}
				$jobArr[] = 
					array(
						"jobId"=>$job->getId(),
						"companyLogo"=>$imgPath,
						"jobTitle"=>$job->getJob_title(),
						"jobReference"=>$job->getJob_reference(),
						"companyName"=> Helper_common::showCroppedText($job->getCompany()->getName(),'50'),
						"industryTitle"=>$job->getIndustryRef()->getTitle().", ".\Extended\job::getCityStateCountryOfAJob($job->getId()),
						"salaryTitle"=>$salaryRange,
						"jobTypeTitle"=>$job->getJobType()->getName(),
						"experienceYearTitle"=>$exp_lvl,
						"postedDate"=>Helper_common::nicetime( $job->getCreated_at()->format("Y-m-d H:i") ),
						"jobAppStatus"=>$appStatus,
						"jobSaveStatus"=>$saveStatus,
						"jobDesc"=>$job_description_str,
						"apply_from"=>$job->getApply_from(),
						"company_job_url"=>$job->getCompany_job_url(),
						"company_job_apply_url"=> $job->getCompany_job_apply_url(),
						"is_saved" => \Extended\saved_jobs::isJobSavedByMe($job->getId(), Auth_UserAdapter::getIdentity()->getId()),
						"is_applied" => \Extended\job_applications::isJobAppliedByMe($job->getId(), Auth_UserAdapter::getIdentity()->getId()),
						"can_apply" => \Extended\job::canApply($job->getId())?1:0
						); 
			}
		}
		$jobAvailabilty=array("isJobAvailable"=>$jobAvailability);
		$finalArr=array("availabiltyStatus"=>$jobAvailabilty,"jobsList"=>$jobArr);
		echo Zend_Json::encode($finalArr);
    	die;
    }

    /**
     * used for ajax call.
     * to fill up job detail in renew popup.
     *
     *
     *
     */
    public function getJobDetailAction()
    {
    	$jobDetailObj = \Extended\job::getJobDetailById( $this->getRequest()->getParam("job_id") );
    	$jobDetail = array();
    	$jobDetail['id'] = $jobDetailObj[0]->getId();
    	$jobDetail['job_reference'] = $jobDetailObj[0]->getJob_reference();
    	$jobDetail['job_title'] = $jobDetailObj[0]->getJob_title();
		$jobDetail['job_image'] = \Extended\job::getJobImage($jobDetailObj[0]->getId());
    	$jobDetail['company_name'] = $jobDetailObj[0]->getCompany()->getName();
    	$jobDetail['jobTypeTitle'] = $jobDetailObj[0]->getJobType()->getName();
    	$jobDetail['postedDate'] = $jobDetailObj[0]->getCreated_at()->format("d-m-Y");
    	$jobDetail['industryTitle'] = $jobDetailObj[0]->getIndustryRef()->getTitle();
    	$jobDetail['job_location'] = \Extended\job::getCityStateCountryOfAJob($jobDetailObj[0]->getId());
    	
    	if($jobDetailObj[0]->getSalaryRange())
    	{
    		$jobDetail['salary'] = $jobDetailObj[0]->getSalaryRange()->getCountryRef()->getCurrency_symbol()." ".$jobDetailObj[0]->getSalaryRange()->getMin_salary()." - ".$jobDetailObj[0]->getSalaryRange()->getMax_salary();
    	}
    	else
    	{
    		$jobDetail['salary'] = '';
    	}
    	
    	if( $jobDetailObj[0]->getExperieneceLevel() )
    	{
    		$jobDetail['experience'] = $jobDetailObj[0]->getExperieneceLevel()->getDescription();
    	}
    	else
    	{
    		$jobDetail['experience'] = "";
    	}
    	if($jobDetailObj[0]->getExpiry_date()) {
			$jobDetail['expiry_date'] = $jobDetailObj[0]->getExpiry_date()->format("d-m-Y");
		}

    	echo Zend_Json::encode($jobDetail);
    	die;
    }

    public function getActiveClosedExpiredJobsCountAction()
    {
    	$totalcount=array("active"=>\Extended\job::getCountOfJobs(Auth_UserAdapter::getIdentity()->getId(), "Active"),"expired"=>\Extended\job::getCountOfJobs(Auth_UserAdapter::getIdentity()->getId(), "Expired"),"closed"=>\Extended\job::getCountOfJobs(Auth_UserAdapter::getIdentity()->getId(), "Closed"));
    	echo Zend_Json::encode($totalcount);
    	die;
    }

    /**
     * function used to retrieve all applicants for particular job
     * @author Sunny Patial
     * @param id integer.
     *
     */
    public function receivedApplicationsAction()
    {
        $params = $this->getRequest()->getParams();
        if(isset($params["order"]) && $params["order"]!="")
        {
        	if($params["order"]=="asc")
        	{
        		$orderBy = $params["order"];
        		$this->view->order = "Descending.";
        		$this->view->orderby = "desc";
        	}
			else
			{
				$orderBy = "desc";
				$this->view->order = "Ascending.";
				$this->view->orderby = "asc";
			}
        }
        else
        {
        	$orderBy = "desc";
        	$this->view->order = "Ascending.";
        	$this->view->orderby = "asc";
        }
        $userID = Auth_UserAdapter::getIdentity()->getId();
        // job detail
		$this->view->jobDetail = \Extended\job::getRowObject($params["id"]);
        // check job posted by current user or not..
        $validateUser = \Extended\job::isJobPostedByUser($params["id"], $userID);
		// if yes...
		if($validateUser)
		{
	    	if( ! @$params['list_len'] )
	    	{
	    		$params['list_len'] = 20;
	    	}
	    	$this->view->prms = $params;
	        
	    	$applicants = \Extended\job_applications::getApplicants($userID, $params["id"], $orderBy);
	    	
	    	$this->view->blocked_profiles = \Extended\blocked_users::getAllBlockersAndBlockedUsers($userID);

	    	$this->view->applicants=$applicants;
	    	//------ PAGINATION -------
	    	$paginator = Zend_Paginator::factory($applicants);
	    	$paginator->setItemCountPerPage(@$params['list_len']);
	    	$paginator->setCurrentPageNumber(@$params['page']);
	    	$this->view->paginator=$paginator;
		} 
		else
		{
			// if not valid, job created user....
			$this->_redirect(PROJECT_URL."/".PROJECT_NAME."profile/is-not-available");
		}   	
    	
    }

    /**
     * function used to retrieve all shortlisted candidates for particular job
     * @author Sunny Patial
     * @param id integer.
     *
     */
    public function shortlistedApplicationsAction()
    {
        $params = $this->getRequest()->getParams();
        if(isset($params["order"]) && $params["order"]!="")
        {
        	if($params["order"]=="asc")
        	{
        		$orderBy = $params["order"];
        		$this->view->order = "Descending.";
        		$this->view->orderby = "desc";
        	}
			else
			{
				$orderBy = "desc";
				$this->view->order = "Ascending.";
				$this->view->orderby = "asc";
			}
        }
        else
        {
        	$orderBy = "desc";
        	$this->view->order = "Ascending.";
        	$this->view->orderby = "asc";
        }
        $userID = Auth_UserAdapter::getIdentity()->getId();
        // job detail
		$this->view->jobDetail = \Extended\job::getRowObject($params["id"]);
        // check job posted by current user or not..
        $validateUser = \Extended\job::isJobPostedByUser($params["id"], $userID);
		// if yes...
		if($validateUser)
		{
	    	if( ! @$params['list_len'] )
	    	{
	    		$params['list_len'] = 20;
	    	}
	    	$this->view->prms = $params;
	        
	    	$applicants = \Extended\job_applications::getCandidates($userID, $params["id"], $orderBy);
	   		$this->view->applicants=$applicants;
	   		$this->view->blocked_profiles = \Extended\blocked_users::getAllBlockersAndBlockedUsers($userID);
	    	//------ PAGINATION -------
	    	$paginator = Zend_Paginator::factory($applicants);
	    	$paginator->setItemCountPerPage(@$params['list_len']);
	    	$paginator->setCurrentPageNumber(@$params['page']);
	    	$this->view->paginator=$paginator;
		} 
		else
		{
			// if not valid, job created user....
			$this->_redirect(PROJECT_URL."/".PROJECT_NAME."profile/is-not-available");
		}   	
    }
    
    /**
     * Action for ajax call,
     * Fills states dropdown according to logged user's country.
     * If country does not have states, it hides states
     * dropdown and fills cities.
	 *
     *
     * @author jsingh7
	 * @author ssharma4
     * @version 1.0
     *
     */
    public function getResponseForCountrySelectedAction()
    {
		$userID = Auth_UserAdapter::getIdentity()->getId();
		$userObj = \Extended\ilook_user::getRowObject($userID);
		//get logged user country for getting corrsponding states list
		$country_id= $userObj->getUsersCountry()->getId();

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
    				$ret_array['options'][$key]['id'] = $state->getId();
    				$ret_array['options'][$key]['name'] = utf8_decode( $state->getName() );
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
    				$ret_array['options'][$key]['name'] = utf8_decode( $city->getName() );
    			}
    		}
			$ret_array['user_seletced_state'] = $userObj->getState()->getId();
			$ret_array['user_seletced_city'] = $userObj->getCity()->getId();
    	}
    	echo Zend_Json::encode( $ret_array );
    	die;
    }
    
    public function receiveJobg8FilesAction()
    {
    	echo "iLook will receive Jobg8 files here.";
    	die;
    }
    
    public function monsterJobsUsAction()
    {
    	/* echo "iLook will receive monster jobs here.";
    	die; */
    }

	/**
	 * Render view
	 * View contain script to render monster
	 * jobs for canada along with keyword and place based search
	 * @author hkaur5
	 *
	 */
	public function monsterJobsCaAction()
    {
    	/* echo "iLook will receive monster jobs here.";*/

    }

	/**
	 * Render view
	 * View contain script to render monster
	 * jobs for france along with keyword and place based search
	 * @author hkaur5
	 *
	 */
	public function monsterJobsFrAction()
    {
    	/* echo "iLook will receive monster jobs here.";*/
	}

	/**
	 * Render view
	 * View contain script to render monster
	 * jobs for netherlands along with keyword and place based search
	 * @author hkaur5
	 *
	 */
	public function monsterJobsNlAction()
    {
    	/* echo "iLook will receive monster jobs here.";*/

    }

	/**
	 * Render view
	 * View contain script to render monster
	 * jobs for dutch along with keyword and place based search
	 * @author ssharma4
	 *
	 */
	public function monsterJobsDeAction()
	{
		/* echo "iLook will receive monster jobs here.";*/

	}

	/**
	 * Render view
	 * View contain script to render monster
	 * jobs for india along with keyword and place based search
	 * @author ssharma4
	 *
	 */
	public function monsterJobsInAction()
	{
		/* echo "iLook will receive monster jobs here.";*/

	}
    public function monsterJobsUkAction()
    {
    	/* echo "iLook will receive monster jobs here.";
    	die; */
    }

	/**
	 * Created to setup Indeed Job UI.
	 *
	 * @author ssharma4
	 * @version 1.0
	 *
	 */
	public function indeedJobsAction()
	{

	}

	/**
	 * Fetch indeed jobs from indeed website using api with provided query parameters.
	 * Set limit on fetching records.
	 *
	 * @author ssharma4
	 * @version 1.0
	 *
	 */
	public function moreIndeedJobsAction()
	{
		$params 						= $this->getRequest()->getParams();
		$job_collec 					= array();
		$indeed_job_current_Settings 	= array();
		$indeed_job_current_Settings['is_more_jobs'] = 0;
		//Setting up required query parameters for getting jobs from indeed job api.
		$indeedUrl = self::setIndeedJobsQueryUrlAction($params);

		/****************************************************************************************/
		/************* Send url to curl for indeed jobs & outputs in xml feeds format.***********/
		/****************************************************************************************/
		$ndeedJobObj 			= new \Indeedjobs\Indeedapi();
		$indeedJobs 			= $ndeedJobObj->getIndeedJobs($indeedUrl);
		$xml_obj 				= simplexml_load_string($indeedJobs['cURLResponse']);

		//If $xml_obj is not object.
		if(is_object($xml_obj))
		{
			//Looping on XML object to get array object of job.
			for ($i =0; $i<count($xml_obj->results->result);$i++)
			{
				if($xml_obj->results->result[$i]->expired =='false'){
					$job_collec[]	= $xml_obj->results->result[$i];
				}

			}
			//Indeed jobs current settings.
			$indeed_job_current_Settings['radius'] 			= $xml_obj->radius;
			$indeed_job_current_Settings['start'] 			= $xml_obj->start;
			$indeed_job_current_Settings['end'] 			= $xml_obj->end;
			$indeed_job_current_Settings['location'] 		= $xml_obj->location;

			if( isset($xml_obj->totalresults) && isset($xml_obj->end) && (int)$xml_obj->end < (int)$xml_obj->totalresults ) {
				$indeed_job_current_Settings['is_more_jobs'] = (int)$xml_obj->totalresults -(int)$xml_obj->end;
			}
		}
		if(isset($params['job_type'])) {
			$jobType 		= ucfirst($params['job_type']);
		} else {
			$jobType 		= 'Fulltime';
		}
		$result = array('job' => $job_collec,
						'is_more_jobs' =>$indeed_job_current_Settings['is_more_jobs'],
						'current_search_criteria' => $indeed_job_current_Settings,
						'error' =>0,
						'jobType' =>$jobType
					);
		echo Zend_Json::encode($result);die;

	}

	/**
	 * Setup indeed job api url to get xml feeds.
	 *
	 * @param array $params
	 * @author ssharma4
	 * @version 1.0
	 *
	 * @return string
	 */
	public function setIndeedJobsQueryUrlAction($params)
	{
		//Get current country of user from profile.
		$userId						= Auth_UserAdapter::getIdentity()->getId();
		$userObj 					= \Extended\ilook_user::getRowObject($userId);
		//Get ID of country according to iLook database.
		if( $userObj ){
			$country_name= $userObj->getUsersCountry()->getName();
			if(!isset($params['place'])) {
				$params['place'] =  str_replace(" ","_",$userObj->getState()->getName());
			}

		}
		//An array that contains indeed job api supported countries.
		$supported_countries = array(
			'Antarctica' 	=>	'aq',
			'Argentina' 	=>	'ar',
			'Australia'		=>	'au',
			'Austria'		=>	'at',
			'Bahrain'		=>	'bh',
			'Belgium'		=>	'be',
			'Brazil'		=>	'br',
			'Canada'		=>	'ca',
			'Chile'			=>	'cl',
			'China'			=>	'cn',
			'Colombia'		=>	'co',
			'Costa Rica'	=>	'cr',
			'Czech Republic'=>	'cz',
			'Denmark'		=>	'dk',
			'Ecuador'		=>	'ec',
			'Egypt'			=>	'eg',
			'Finland'		=>	'fi',
			'France'		=>	'fr',
			'Germany'		=>	'de',
			'Greece'		=>	'gr',
			'Hong Kong'		=>	'hk',
			'Hungary'		=>	'hu',
			'India'			=>	'in',
			'Indonesia'		=>	'id',
			'Ireland'		=>	'ie',
			'Israel'		=>	'il',
			'Italy'			=>	'it',
			'Japan'			=>	'jp',
			'Kuwait'		=>	'kw',
			'Luxembourg'	=>	'lu',
			'Malaysia'		=>	'my',
			'Mexico'		=>	'mx',
			'Morocco'		=>	'ma',
			'Netherlands'	=>	'nl',
			'New Zealand'	=>	'nz',
			'Nigeria'		=>	'ng',
			'Norway'		=>	'no',
			'Oman'			=>	'om',
			'Pakistan'		=>	'pk',
			'Panama'		=>	'pa',
			'Peru'			=>	'pe',
			'Philippines'	=>	'ph',
			'Poland'		=>	'pl',
			'Portugal'		=>	'pt',
			'Qatar'			=>	'qa',
			'Romania'		=>	'ro',
			'Russia'		=>	'ru',
			'Saudi Arabia'	=>	'sa',
			'Singapore'		=>	'sg',
			'South Africa'	=>	'za',
			'South Korea'	=>	'kr',
			'Spain'			=>	'es',
			'Sweden'		=>	'se',
			'Switzerland'	=>	'ch',
			'Taiwan'		=>	'tw',
			'Thailand'		=>	'th',
			'Turkey'		=>	'tr',
			'Ukraine'		=>	'ua',
			'United Arab Emirates'	=>	'ae',
			'United Kingdom'		=>	'gb',
			'United States'			=>	'us',
			'Uruguay'				=>	'uy',
			'Venezuela'				=>	've',
			'Vietnam'				=>	'vn'
		);

		foreach ($supported_countries as $key => $supported_country) {
			if($key == $country_name) {
				$country_code =  $supported_country;
			}
		}
		$indeedUrl="";
		if(isset($params['keyword']) && $params['keyword']!="") {
			$indeedUrl  .="&q=".$params['keyword'];
		}else {
			$indeedUrl  .= "&q=";
		}
		// Use a postal code or a "city, state/province/region" combination.
		if(isset($params['place'])) {

			$indeedUrl  .= "&l=".str_replace(" ","_",$params['place']);
		} else {
			$indeedUrl  .= "&l=";
		}
		// Distance from search location ("as the crow flies"). Default is 100.
		if(isset($params['radius'])) {
			$indeedUrl  .= "&radius=".$params['radius'];
		} else {
			$indeedUrl  .= "&radius=100";
		}
		//To show only jobs from job boards use "jobsite". For jobs from direct employer websites use "employer".
		if(isset($params['search_type'])) {
			$indeedUrl .="&st=".$params['search_type'];
		} else {
			$indeedUrl 		.="&st=";
		}

		//Job type. Allowed values: "fulltime", "parttime", "contract", "internship", "temporary".
		if(isset($params['job_type'])) {
			$indeedUrl .="&jt=".$params['job_type'];
		} else {
			$indeedUrl 		.="&jt=fulltime";
		}

		if( isset($params['offset'])) {
			$indeedUrl     .= "&start=".$params['offset'];	    // Start value for pagination.
			$indeedUrl     .= "&limit=20";		// limit of jobs to be displayed.
		} else {
			$indeedUrl     .= "&start=1";	    // Start value for pagination.
			$indeedUrl     .= "&limit=20";		// limit of jobs to be displayed.
		}
		// Number of days back to search.
		if( isset($params['fromage'])) {
			$indeedUrl     .= "&fromage=".$params['fromage'];
		} else {
			$indeedUrl     .= "&fromage=";
		}
		// Filter duplicate results. 0 turns off duplicate job filtering. Default is 1.
		if( isset($params['filter'])) {
			$indeedUrl     .= "&filter=".$params['filter'];
		} else {
			$indeedUrl     .= "&filter=";
		}
		$indeedUrl 			.= "&latlong=1"; // Returns latitude and longitude information for each job result

		if(isset($country_code)) {
			$indeedUrl 		.= "&co=".$country_code; // Search within country wher user is located now.
		} else {
			$indeedUrl 		.= "&co=us";    // Search within default country if nothing is obtained.
		}

		$indeedUrl 		    .= "&chnl=";  	 // Channel Name: Group API requests to a specific channel.
		$indeedUrl 		    .= "&sort=date"; //
		$indeedUrl 	   		.= "&userip=".$_SERVER['REMOTE_ADDR'];		 //Ip of employee/student.
		$indeedUrl 	   		.= "&useragent=".$_SERVER['HTTP_USER_AGENT'];//Browser Info of employee/student.

		return $indeedUrl;
	}
}







