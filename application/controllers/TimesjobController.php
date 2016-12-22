<?php
class TimesjobController extends Zend_Controller_Action
{
	const JOBS_SIZE_TO_BE_SAVED = 1000;
	protected $log_file_name;
	protected $log_file_dir;
	protected $log_file_path;
	protected $source;

	public function init()
	{
		/* Initialize action controller here */
		$this->log_file_name = 'timesjob_import_log.html';
		$this->log_file_dir  = 'logs/TimesJobs';
		$this->log_file_path = $this->log_file_dir.'/'.$this->log_file_name; //Error log file.
	
		$this->source		 = PUBLIC_PATH.'/parse.xml';
		//Renaming old log at initiation.

		rename($this->log_file_path,
				$this->log_file_dir.'/'.Helper_common::getUniqueNameForFile($this->log_file_name, date('Y_M_d_H_i_s_T').'_'.microtime(true))
			);

	}

	
	public function indexAction()
	{
		// action body
		$org ="A Client of Creative Management Servcies";
		$duplicate ="A Client of Creative Management Services";
	}

	/**
	 * Receive xml through file path.
	 * Creates, Edits or deletes job according to "Action" attribute of XML.
	 * Use mapping values to check if certain values exist in
	 * ilook db(industry, country and type)
	 *
	 * Also write error or success messages to
	 * "timesjob_import_log.html" file.
	 *
	 * @author ssharma4
	 * @version 1.0
	 * @date 10/june/2016
	 */
	public function hitXmlFileAction()
	{
		ini_set('memory_limit', '-1');//overrides the default PHP memory limit.
		ini_set('max_execution_time', 28800); // this will set max_execution time for 8 hours

		//Key is compared with defined timesjob key in application.ini for security purpose to avoid unnecessory hits from unknown user.
		$config 	= Zend_Controller_Front::getInstance()->getParam('bootstrap');
		$options	= $config->getOption('timesjobs');
		$key     	= $this->getRequest()->getParam( 'key' );
		$job_collec = array(); //define variables for xml objects.
		$temp_arr = array(); //Temporary array that holds duplicate values used in removing from jobs array.
		$jobs_array = array(); //Saving array converted from xml object.
		$jobCollecCounter = 0; //job collection intailzer that used to call processing job array function after 1000 collections
		 if($options['key'] == $key){

			 //Initializations.
			 $counter = 0; //Used to check that when to call flush function on entity manager.
			 $error_message = ""; //defines failure reasons of code
			 $success_message = "";//defines code successfully executed after conditions applied
			 //Get user obj by user type admin so that job can be posted by that user.
			 $admin_user_obj = \Extended\ilook_user::getUserInfoByUserType(5);
			 $xml_obj = simplexml_load_file($this->source, 'SimpleXMLElement', LIBXML_NOWARNING|LIBXML_NOERROR|LIBXML_PARSEHUGE);

			 //If $xml_obj is not object.
			 if(is_object($xml_obj))
			 {
				 //Looping on XML object to get array object of job.
				 foreach ($xml_obj->Job as $job_info )
				 {
					 $job_collec[]['job'] = $job_info;
				 }
			 }
			 else
			 {
				 $log_msg = "Invalid XML";
				 Helper_common::logInfo($log_msg, "RED", $this->log_file_path);

			 }

			 //==================================================================================================
			 //loop will cascade SimpleXMLElement Object values to string & collect all values in jobs array.
			 // While creating this array we have followed followin rules.
			 // 1. $temp_arr will keep the latest record in case id reference ID will repeat for edit or add. for e.g. if there is ref ID with action add and agian
			 // 	ref ID repeat with action edit then we will keep edit and remove previous record from array. And vice versa.
			 //	2. If there is any add/edit before delete action will remove that key from array for ADD/EDIT. But delete ref ID will be added to array for
			 //		cleaning that record from DB.
			 //==================================================================================================
			 if($job_collec)
			 {
				 $totalJobCount = count($job_collec);
				 foreach ($job_collec as $key => $job_info) {

					 try //an exception for job parsing into array, if fails save error msg into timesjob_import_log.html
					 {
						 $temp_arr[$key]['referencenumber'] = (string)$job_info['job']->referencenumber;
						 $temp_arr[$key]['action'] = (string)$job_info['job']->ACTION;
						 $temp_arr[$key]['key'] = $key;
						 foreach ($temp_arr as $duplicate_job) {
							 if (($duplicate_job['referencenumber'] == (string)$job_info['job']->referencenumber && $duplicate_job['action'] == 'ADD')
								 || ($duplicate_job['referencenumber'] == (string)$job_info['job']->referencenumber && $duplicate_job['action'] == 'EDIT')
							 ) {
								 unset($jobs_array[$duplicate_job['key']]);
							 }
							 if ($duplicate_job['referencenumber'] == (string)$job_info['job']->referencenumber && $jobs_array[$key]['action_key'] == 'DELETE') {
								 unset($jobs_array[$duplicate_job['key']]);
							 }
						 }
						 if ((string)$job_info['job']->ACTION == 'ADD' || (string)$job_info['job']->ACTION == "EDIT") {
							 $jobs_array[$key]['action_key'] = 'job_add_edit';
							 $jobs_array[$key]['jobTitle'] = (string)$job_info['job']->title;
							 $jobs_array[$key]['dd_industry'] = (string)$job_info['job']->category;
							 $jobs_array[$key]['action'] = (string)$job_info['job']->ACTION;

							 if($job_info['job']->jobtype =='full time'){
								 $job_info['job']->jobtype ='Full Time';
							 }
							 //assign jobtype row obj for saving job type so that can map with saved job types.
							 $jobs_array[$key]['dd_job_type'] = \Extended\job_type::getRowObjectByJobTypeName((string)$job_info['job']->jobtype);
							 $jobs_array[$key]['jobDesc'] = (string)$job_info['job']->url . '<br/>' . (string)$job_info['job']->description . "<br/><b>Experience Level:</b> " . $job_info['job']->experience;

							 //assign country row obj for job country so that can map with saved countries.
							 //if timesjob api job's country not match with saved countries empty value.
							 $countryObj = \Extended\country_ref::getRowObjectByName((string)$job_info['job']->country);
							 if ($countryObj) {
								 $jobs_array[$key]['dd_location'] = $countryObj->getId();
							 } else {
								 $jobs_array[$key]['dd_location'] = '';
							 }
							 $jobs_array[$key]['sender_ref_id'] = (string)$job_info['job']->referencenumber;
							 //assign experience level row obj for job experience level so that can map with saved experience level.
							 $jobs_array[$key]['dd_exp_lvl'] = \Extended\experienece_level::getRowObjectByExperienceLevelName((string)$job_info['job']->experience);
							 $jobs_array[$key]['company'] = (string)$job_info['job']->company;
							 $jobs_array[$key]['webJobUrl'] = (string)$job_info['job']->url;
							 $jobs_array[$key]['created_at'] =  \DateTime::createFromFormat("D, j M Y H:i:s T", (string)$job_info['job']->date);
							 $jobs_array[$key]['applyfrm'] = 1;
							 $jobs_array[$key]['user_id'] = $admin_user_obj->getId();
						 } else if ((string)$job_info['job']->ACTION == 'DELETE') {
							 $jobs_array[$key]['action_key'] = (string)$job_info['job']->ACTION;
							 $jobs_array[$key]['sender_ref_id'] = (string)$job_info['job']->referencenumber;
						 }
					 } catch (Exception $e) {
						 $log_msg = "Some problem occurred while parsing and mapping timesjob XML.";
						 Helper_common::logInfo($log_msg, "red", $this->log_file_path);
						 Helper_common::logInfo($e, "red", $this->log_file_path);
						 continue;
					 }
					 $jobCollecCounter++;
					 if (!($jobCollecCounter % 1000) || ($jobCollecCounter == $totalJobCount)) {
						 //Processing job_arrays.
						 $this->processJobsArrays($jobs_array, $admin_user_obj);
						 unset($temp_arr);// to reduce load while comapring duplicacy from jobs arrays
						 unset($jobs_array);// to reduce load while comapring duplicacy from jobs arrays
					 }
				 }
				 
				 //==================================================================================================
				 //END-Looping on XML object to get array object of job.
				 //==================================================================================================

				 // If $jobs_array is empty then show jobs could not be parsed.
				 //This can happen if their XML does not contain any action attribute.
			 } else {
				 $log_msg =" No jobs Parsed in this job feed.";
				 Helper_common::logInfo($log_msg, "red", $this->log_file_path);
			 }
		 } else {
			 echo "The key did not matched!";
		 }
		die;
	}

	/**
	 * This function is made to process job_arrays Array, produced by hitXmlFileeAction().
	 * ==================================================================================================
	 * Looping for jobs on basis of 'action attribute' of job data(from source)for timesjobs.
	 * This block will Add/edit/delete jobs using jobs array created from timesjob XML.
	 *
	 * Here we will check the jobs array  industry, country and type to match in our db, to check
	 * whether the values provided by timesjob exist in our DB and therefore the job can be added to
	 * ilook or not.
	 *
	 * Note - industry is fetched from the mapped id timesjob_category_mapping & type, country from xml file provide as
	 * these three  are mandaory fields
	 * According to various checks we will write error or success msgs to log file.
	 * ==================================================================================================
	 * @param Array $jobs_array
	 * @param object $admin_user_obj
	 * @throws Zend_Exception
	 * @author ssharma
	 * @author jsingh7
	 * @version 1.0
	 * @date 29/june/2016
	 */
	protected function processJobsArrays(Array $jobs_array, $admin_user_obj)
	{
		foreach ($jobs_array as $key=>$job)
		{
			$result_catch	= "";
			try {
				//---------------------------------------------------------------------------------------
				// Checking if country, job_type and industry ids sent from timesjob exist on iLook.
				//---------------------------------------------------------------------------------------
				if($job['action_key'] == "job_add_edit")
				{
					$job['expireDate'] = \DateTime::createFromFormat( "d-m-Y h:i:s", date('d-m-Y h:i:s', strtotime("+1 months")));//set times job expiry date after 2 months.
					$industry_obj = \Extended\timesjob_category_mapping::getCategory($job['dd_industry']);
					if($industry_obj)
					{
						$job['dd_industry'] = $industry_obj;
						$job['industry_exist_in_ilook'] = true;
					}
					else
					{
						$job['industry_exist_in_ilook'] = false;
					}
					$job_type_obj = \Extended\job_type::getRowObject($job['dd_job_type']);
					if($job_type_obj)
					{
						$job['job_type_exist_in_ilook'] = true;
					}
					else
					{
						$job['job_type_exist_in_ilook'] = false;
					}
					$country_obj = \Extended\country_ref::getRowObject($job['dd_location']);
					if($country_obj)
					{
						$job['country_exist_in_ilook'] = true;
					}
					else
					{
						$job['country_exist_in_ilook'] = false;
					}
				}
				//---------------------------------------------------------------------------------------
				// End checking country, job_type and industry.
				//---------------------------------------------------------------------------------------

				//Switch case which will work on basis of Action parameter sent by timesjob i.e Add, Edit and Delete.
				switch($job['action_key'])
				{
					case 'job_add_edit'://If action is ADD/Edit then add/edit new job.
						if($job['sender_ref_id'])
						{
							$job_exist = \Extended\job::getJobBySenderReFId($job['sender_ref_id']);
							if(empty($job_exist)) //If job does not exist in DB.
							{
								if( $job['dd_industry']
									&& $job['dd_job_type']
									&& $job['jobTitle']
									&& $job['dd_location']
									&& $job['dd_exp_lvl']
									&& $job['company']
									&& $job['applyfrm']
									&& $job['sender_ref_id']
									&& $job['industry_exist_in_ilook']
									&& $job['job_type_exist_in_ilook']
									&& $job['country_exist_in_ilook']
								) {
									$job['sender_ref_type'] =\Extended\job::SENDER_REF_TIMES_JOB;
									$job_id = \Extended\job::createNewJob($job, $admin_user_obj->getId(), FALSE);
									if($job_id){
										$success_message = "Job added to iLook. Sender reference ID:".$job['sender_ref_id'].".";
									}
									$success_message = "Job added to iLook. Sender reference ID:".$job['sender_ref_id'].".";
								} else {

									$error_message = "Job cannot be created. Data missing. Sender reference ID:".$job['sender_ref_id'].".";
								}
							}
							else
							{
								//Edit job details if reference number already exist in db
								$job_id = \Extended\job::updateJob($job, FALSE);
								if($job_id == 2){
									$success_message = "Job cannot be updated. No job for this reference id present on iLook. Sender reference ID:".$job['sender_ref_id'].".";
								} else if($job_id == 1) {
									$success_message = "Job updated on iLook. Sender reference ID:".$job['sender_ref_id'].".";
								}
							}
						}
						else
						{
							$error_message = "Job cannot be created. Sender_reference_id is missing. Sender reference ID:".$job['sender_ref_id'].".";
						}
						break;
					//If previously added job is to be deleted.
					case 'DELETE':

						if($job['sender_ref_id']) {
							$jobObj = \Extended\job::getJobBySenderReFId($job['sender_ref_id']);
							if($jobObj) {

								$res = \Extended\job::deleteJob($jobObj[0]->getId(), FALSE);
								if($res) {
									$success_message= "Job deleted. Sender reference ID:".$job['sender_ref_id'].".";
								} else {
									$error_message = "Some error occured while deleting job.Sender reference ID:".$job['sender_ref_id'].".";
								}
							} else {
								$error_message = "Job cannot be deleted as job for this reference id is not present on iLook. Sender reference ID:".$job['sender_ref_id'].".";
							}
						} else {
							$error_message = "Job cannot be deleted. Sender_reference_id missing. Sender reference ID:".$job['sender_ref_id'].".";
						}
				}// End switch statement.
				//Create msg for printing in error log.
				if($success_message!= "")
				{
					$log_msg = $success_message;
					Helper_common::logInfo($log_msg, "green", $this->log_file_path);
				}
				if($error_message!= "")
				{
					$log_msg = $error_message;
					Helper_common::logInfo($log_msg, "red", $this->log_file_path);
				}

			}/*try end*/ catch (Exception $e) {

				$result_catch .="<pre>";
				$result_catch .="<br><br>";
				$result_catch .= " Oops! an exception occured. Sender reference ID:".$job['sender_ref_id']."<br>";
				$result_catch .="========================================================<br>";
				$result_catch .=$e;
				$result_catch .="<br>";
				$result_catch .="========================================================<br>";
				$result_catch .="</pre>";
				$log_msg 		= $result_catch;
				Helper_common::logInfo($log_msg, "red", $this->log_file_path);
				//=====================================================================================
				continue;
			} //catch end.

			//Empty msgs.
			$error_message 	= "";
			$success_message 	= "";
		}//for loop end.

		//Save data to DB.
		$em = \Zend_Registry::get('em');
		$em->flush();
		$em->clear();

		// When doing batch processing,
		// Closes the EntityManager.
		// All entities that are currently managed by this EntityManager become detached.
		// The EntityManager may no longer be used after it is closed.
		$em->getConnection()->close(); //refresh the cache.
		//================================================================================
		// END-Add, update and delete jobs on basis of 'action' of job data from timesjob.
		//================================================================================
	}
}
