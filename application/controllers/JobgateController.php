<?php

class JobgateController extends Zend_Controller_Action
{
	protected $xml_response_log;
	protected $log_file_name;
	protected $log_file_dir;
	protected $log_file_path;

    public function init()
    {
		/* Initialize action controller here */
		$this->log_file_name = 'jobgate_import_log.html';
		$this->log_file_dir = 'logs/JobGate/';
		$this->log_file_path  = $this->log_file_dir.'/'.$this->log_file_name; //Error log file.

		//Renaming ald log at initiation.
		rename($this->log_file_path,
			$this->log_file_dir.'/'.Helper_common::getUniqueNameForFile($this->log_file_name, date('Y_M_d_H_i_s_T').'_'.microtime(true))
		);
    }

    public function indexAction()
    {
        // action body
    }

    /**
     * Receive xml through $_POST and parses it to get 
     * job object.
     * Create, amend or delete jobs according to "Action" attribute 
     * of XML. 
     * Use mapping values to check if certain values exist in
     * ilook db(industry, country and type).
     * Also write error or success messages to
     * "jobgate_import_log.html" file.
     * 
     * @author hkaur5
     *
     */
 	public function receiveXmlFileAction()
    {
    	/* create a dom document with encoding utf8 */
    	$domtree = new DOMDocument('1.0', 'UTF-8');
    	 
    	/* create the root element of the xml tree */
    	$xmlRoot = $domtree-> createElement("Jobs");
    	
    	/* append it to the document created */
    	$xmlRoot = $domtree->appendChild($xmlRoot);

    	/* get the xml printed */
    	$response_for_jobGate =  $domtree->saveXML();
    	
    	$date           = new DateTime();
    	$admin_user_obj = \Extended\ilook_user::getUserInfoByUserType(5);


		if($_POST)
		//if(1)
		{
			if(isset($_POST['data']))
			//if(1)
			{
				$raw_xml = $_POST['data'];
				//$raw_xml = '';
		    	$xml_obj = simplexml_load_string($raw_xml);
		    	$job_params = array();
				$job = array();
				$jobs = array();
				
				//==================================================================================================
				//Looping on XML object to get array object of job.
				//==================================================================================================
				
				//If $xml_obj is not object show msg that we have not rreceived any jobs. 
				if(is_object($xml_obj))
				{
					foreach ($xml_obj->Job as $job_info )
					{
					     	$job[]['job'] = $job_info;
					}
				}
				else
				{
					$log_msg = "No jobs sent in xml";
					Helper_common:: logInfo($log_msg, "blue", $this->log_file_path);
					die;
				}
			
				foreach($job as $key=>$job_info)
				{
					try
					{
						if((string)$job_info['job']->Attributes() == 'Amend' 
							|| (string)$job_info['job']->Attributes() == 'Post')
						{
					    	$jobs[$key]['jobTitle'] = (string)$job_info['job']->Position[0];
					    	$jobs[$key]['dd_industry'] = (string)$job_info['job']->Classification;
					    	$jobs[$key]['dd_job_type'] = (string)$job_info['job']->EmploymentType;
					    	$jobs[$key]['action'] = (string)$job_info['job']->Attributes();
					    	$jobs[$key]['jobDesc'] = (string)$job_info['job']->Description[0];
					    	$jobs[$key]['dd_location'] = (string)$job_info['job']->Country;
					    	$jobs[$key]['dd_state_jobg8'] = (string)$job_info['job']->Location;
					    	$jobs[$key]['dd_city_jobg8'] = (string)$job_info['job']->Area;
					    	$jobs[$key]['webJobUrl'] = (string)$job_info['job']->ApplicationURL[0];
					    	$jobs[$key]['image_name']= (string)$job_info['job']->logourl[0];
							$jobs[$key]['sender_ref_id']= (string)$job_info['job']->SenderReference[0];
					    	$jobs[$key]['dd_exp_lvl']= 7;
					    	$jobs[$key]['company']= (string)$job_info['job']->AdvertiserName;
					    	$jobs[$key]['applyfrm']= 1;
					    	$jobs[$key]['user_id']= $admin_user_obj->getId();
							$jobs[$key]['expireDate'] = \DateTime::createFromFormat( "d-m-Y", date('d-m-Y', strtotime("+1 years")));
						}
						else if((string)$job_info['job']->Attributes() == 'Delete')
						{
							$jobs[$key]['action'] = (string)$job_info['job']->Attributes();
							$jobs[$key]['sender_ref_id']= (string)$job_info['job']->SenderReference[0];
						}
						if((string)$job_info['job']->Attributes() == 'Amend')
						{
							$jobs[$key]['expireDate']  = '';
						}
						
					}
					catch(Exception $e)
					{
						$log_msg = "Could not parse job. Some problem occurred while parsing jobgate XML.";
						Helper_common:: logInfo($log_msg, "red", $this->log_file_path);
						continue;
					}
				}
				
				// If $jobs is empty then show jobs could not be parsed.
				// This can happen if their XML does not contain any action attribute.
				if(!$jobs)
				{
					$log_msg = "No jobs Parsed.";
					Helper_common:: logInfo($log_msg, "blue", $this->log_file_path);
					die;
				}
				//==================================================================================================
				//END-Looping on XML object to get array object of job.
				//==================================================================================================

				//==================================================================================================
				// Looping for Add, update and delete jobs on basis of 'action attribute' of job data(from xml) from 
				// jobg8.
				// This block will Add, Amend and Delete jobs using jobs array created from jobgate XML. 
				//
				// Here we will check the jobs array  industry, country and type to match in our db, to check
				// whether the value ids provided by jobgate exist in our DB and therefore the job can be added to 
				// ilook or not. 
				// 
				// Note -  City and State ids are fetched from our DB on basis of names from jobgate,
				// while industry, type and country are fetched from the mapped ids jobgate provide as these three 
				// are mandaory fields
				//
				// According to various checks we will write error or success msgs to log file.
				//
				//
				//==================================================================================================
				$totalNumOfJobsCollected 	= count($jobs);
				$counter 					= 0;
				$save_to_db 				= false;
				$update_in_db 				= false;
				$delete_from_db 			= false;
				$successful 				= false;
				$result						= 'No msg';
				foreach ($jobs as $key=>$job)
				{
					
					$result_catch 	= "";
					$result 		= "";
					$final_msg 		= "";
					
					try {
						
						//---------------------------------------------------------------------------------------
						//Fetching city and state Id from DB on basis of state_name and city_name sent by jobg8
						//---------------------------------------------------------------------------------------
						if($job['dd_state_jobg8'])
						{
							$state_obj = \Extended\state::getStateByName(trim($job['dd_state_jobg8']));
							if(!empty($state_obj))
							{
								$job['dd_state'] = $state_obj[0]->getId();
							}
						}


						if($job['dd_city_jobg8'])
						{
							$city_obj = \Extended\city::getCityByName(trim($job['dd_city_jobg8']));
							if(!empty ($city_obj))
							{
								$job['dd_city'] = $city_obj[0]->getId();
							}
						}
						//----------------------------------------------------------------------------------------------
						// END Fetching city and state Id from DB on basis of state_name and city_name sent by jobg8
						//----------------------------------------------------------------------------------------------
						
						//---------------------------------------------------------------------------------------
						// Checking if country, job_type and industry ids sent from jobgate exist on ilook.
						//---------------------------------------------------------------------------------------
						if($job['action'] == "Post" || $job['action'] == "Amend")
						{
							$industry_obj = \Extended\industry_ref::getRowObject($job['dd_industry']);
							if($industry_obj)
							{
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


						//Switch case which will work on basis of Action parameter sent by jobg8 i.e Post, Amend or Delete.
						switch($job['action'])
						{
							//If action is Post then add new job.
							case 'Post':
								if($job['sender_ref_id'])
								{
									//Check if job with this reference id exist then don't add job.
									$job_exist = \Extended\job::getJobBySenderReFId($job['sender_ref_id'], \Extended\job::SENDER_REF_JOBG8);
									if(empty($job_exist))
									{
										if($job['dd_industry']
											&& $job['dd_job_type']
											&& $job['jobTitle']
											&& $job['dd_location']
											&& $job['webJobUrl']
											&& $job['dd_exp_lvl']
											&& $job['company']
											&& $job['applyfrm']
											&& $job['sender_ref_id']
											&& $job['jobTitle']
											&& $job['industry_exist_in_ilook']
											&& $job['job_type_exist_in_ilook']
											&& $job['country_exist_in_ilook']
										){
											if(++$counter === $totalNumOfJobsCollected) {
												$save_to_db = true;
											}
											$job['sender_ref_type'] =\Extended\job::SENDER_REF_JOBG8;

											try{
												\Extended\job::createNewJob($job, $admin_user_obj->getId(), $save_to_db);//Create new job.
												$result_success = "Job added to ilook. Sender reference ID:".$job['sender_ref_id'].".";
												$successful = "True";
											}
											catch (\Exception $e)
											{
												$result_success = "Some error occurred while adding job. Sender reference ID:".$job['sender_ref_id'].".";
												$successful = "False";
												\Helper_common::logInfo($e, "red" );
											}
										}
										else{
											$result_failure = "Job cannot be created. Data missing. Sender reference ID:".$job['sender_ref_id'].".";
											$successful = "False";
										}
									}
									else
									{
										$result_failure = "Job cannot be created.Job already exist on ilook. Sender reference ID:".$job['sender_ref_id'].".";
										$successful = "True";
									}
								}	
								else
								{
									$result_failure = "Job cannot be created. Sender_reference_id is missing. Sender reference ID:".$job['sender_ref_id'].".";
									$successful = "False";
								}
								break;
								
							//If action is 'amend' then add previously added jobs.
							case 'Amend':
								if($job['sender_ref_id']){
									if(++$counter === $totalNumOfJobsCollected) {
										$update_in_db = true;
									}
									try{
										$job_id = \Extended\job::updateJob($job, $update_in_db);
										if($job_id == 2){
											$result_success = "Job cannot be updated. No job for this reference id present on ilook. Sender reference ID:".$job['sender_ref_id'].".";
											$successful = "False";
										}
										else if($job_id == 1)
										{
											$result_success = "Job updated on ilook. Sender reference ID:".$job['sender_ref_id'].".";
											$successful = "True";
										}
									}
									catch (\Exception $e){
										$result_success = "Some error occurred while updating job. Sender reference ID:".$job['sender_ref_id'].".";
										$successful = "False";
										\Helper_common::logInfo($e, "red" );
									}
								}
								else{
									$result_failure = "Job could not be updated. Sender_reference_id missing. Sender reference ID:".$job['sender_ref_id'].".";
									$successful = "False";
								}
								break;
								
							//If previously added job is to be deleted.
							case 'Delete':
								
								if($job['sender_ref_id'])
								{
									$jobObj = \Extended\job::getJobBySenderReFId($job['sender_ref_id'], \Extended\job::SENDER_REF_JOBG8);
									if($jobObj)
									{
										if(++$counter === $totalNumOfJobsCollected) {
											$delete_from_db = true;
										}
										try{
											\Extended\job::deleteJob($jobObj[0]->getId(), $delete_from_db);
											$result_success= "Job deleted. Sender reference ID:".$job['sender_ref_id'].".";
											$successful = "True";
										}
										catch(\Exception $e){
											$result_failure = "Some error occured while deleting job.Sender reference ID:".$job['sender_ref_id'].".";
											$successful = "False";
											\Helper_common::logInfo($e, "red");
										}
									}
									else
									{
										$result_failure = "Job cannot be deleted as job for this reference id is not present on ilook. Sender reference ID:".$job['sender_ref_id'].".";
										$successful = "False";
									}
								}
								else
								{
										$result_failure = "Job cannot be deleted. Sender_reference_id missing. Sender reference ID:".$job['sender_ref_id'].".";
										$successful = "False";
								}

												
						} // End switch statement.
						
						//Create msg for printing in error log.
						if($result_success!= "")
						{
							$log_msg = $result_success;
							Helper_common:: logInfo($log_msg, "green", $this->log_file_path);
							$result = $result_success;
						}
						
						if($result_failure!= "")
						{
							$log_msg = $result_failure;
							Helper_common:: logInfo($log_msg, "red", $this->log_file_path);
							$result = $result_failure;
						}
						
						//Creating XML to send response to jobg8===========================================
				    	$currentTrack = $domtree->createElement("Job");
				    	$currentTrack = $xmlRoot->appendChild($currentTrack);
				    	 
				    	
				    	$currentTrack->appendChild($domtree->createElement('SenderReference',$job['sender_ref_id']));
				    	$currentTrack->appendChild($domtree->createElement('Successful',$successful));
				    	if($successful)
				    	{
				    		$currentTrack->appendChild($domtree->createElement('Message'));
				    	}
				    	else
				    	{
				    		$currentTrack->appendChild($domtree->createElement('Message', $result));
				    		
				    	}
				    
				    	//=====================================================================================
						
					}/*try end*/ catch (Exception $e) {
						
						$result_catch .="<pre>";
						$result_catch .="<br><br>";
						$result_catch .="Oops! an exception occured. Sender reference ID:".$job['sender_ref_id']."<br>";
						$result_catch .="========================================================<br>";
						$result_catch .=$e;
						$result_catch .="<br>";
						$result_catch .="========================================================<br>";
						$result_catch .="</pre>";
						$successful = "False";
						
						
						$log_msg = $result_catch;
						Helper_common:: logInfo($log_msg, "red", $this->log_file_path);
						
						
						//Creating XML to send response to jobg8===========================================
						$currentTrack = $domtree->createElement("Job");
						$currentTrack = $xmlRoot->appendChild($currentTrack);


						$currentTrack->appendChild($domtree->createElement('SenderReference',$job['sender_ref_id']));
						$currentTrack->appendChild($domtree->createElement('Successful',$successful));
						$currentTrack->appendChild($domtree->createElement('Message', $e));

						//=====================================================================================
						continue;
					} //catch end.
					
					//Empty msgs.
					$result_failure = "";
					$result_success = "";
					$result = "";
					$successful = "";
				}//for loop end.
				
				//================================================================================
				// END-Add, update and delete jobs on basis of 'action' of job data from jobg8.
				//================================================================================
				

				//------------------------------------------------------------------------------------------
				//  Response For job gate according to the above block where 
				// '$response_for_jobGate-$domtree' is manipulated for success and error cases.
				//------------------------------------------------------------------------------------------
				$response_for_jobGate =  $domtree->saveXML();
				//Removing XML version tag as per jobgate requirement for response.
				$customXML = new SimpleXMLElement($response_for_jobGate);
				$dom = dom_import_simplexml($customXML);
				$response_for_jobGate = $dom->ownerDocument->saveXML($dom->ownerDocument->documentElement);
				//Helper_common::logInfoToFile2($response_for_jobGate, 'black', $this->log_file_path);
				echo  $response_for_jobGate;
				//---------------------------------------------------------------------------------------------
				// End - Response block.
				//---------------------------------------------------------------------------------------------
				
        	}
        	else
        	{
        		$log_msg = "No XML found in Data parameter.";
        		Helper_common:: logInfo($log_msg, "blue", $this->log_file_path);
        	}
        }
        else
        {
        	$log_msg = "No job feeds from jobgate.";
        	Helper_common:: logInfo($log_msg, "blue", $this->log_file_path);
        }
    	die;
    }
}