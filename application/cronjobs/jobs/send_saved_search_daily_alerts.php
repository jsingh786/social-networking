<?php
/**
 * Cron job for daily email alerts
 * for saved search to the user who have
 * saved the same.
 *
 * @author jsingh7
 * @version 1.0
 */
include "/../index.php";

//getting all the saved searches with receive alerts option set on daily basis.
$saved_searches = \Extended\saved_search::getSearchesForDailyEmailAlert();
    	
//for each saved_search get latest 10 search results and email them to the user who have saved them.
foreach ( $saved_searches as $saved_search )
{
	$result = \Extended\job::getSearchResults(
					$saved_search->getJob_title(), 
					$saved_search->getCountryRef(), 
					$saved_search->getState(), 
					$saved_search->getCity(), 
					$saved_search->getCompany(), 
					$saved_search->getIndustryRef(), 
					$saved_search->getSalaryRange(), 
					$saved_search->getJobType(), 
					$saved_search->getExperieneceLevel(), 
					$saved_search->getDate_from()?$saved_search->getDate_from()->format('d-m-Y'):NULL, 
					$saved_search->getDate_to()?$saved_search->getDate_to()->format('d-m-Y'):NULL, 
					10, 
					null,
					"DESC"
			);
	if( count($result["jobs"]) )
	{
		
				$message = "";
    			//Empty table prepended for spacing.
    			$message .= '<table width="100%" cellpadding="0" cellspacing="0">';
    			$message .= '<tr>';
    			$message .= '<td height="40px">&nbsp;</td>';
    			$message .= '</tr>';
    			$message .= '</table>';
    			
    			$message .= '<table width="100%" style="border:1px solid #e0d7bf; FONT-FAMILY: Arial, Helvetica, sans-serif;" cellpadding="0" cellspacing="0">';
    			$message .= '<tr>';
    			$message .= '<td style="background:#4d3574; padding:10px; color:#fff; text-align:center; font-size:16px;">Your daily job alert.</td>';
    			$message .= '</tr>';
    			foreach ( $result["jobs"] as $job )
    			{
    				$link_to_job_detail_page = PROJECT_URL.'/'.PROJECT_NAME.'job/job-detail/job_id/'.$job->getId().'/receiver_id/'.$saved_search->getIlookUser()->getId();
    				$company = "";
    				if( $job->getCompany() )
    				{
    					$company = $job->getCompany()->getName();
    				}
    				$city = "";
    				if( $job->getCity() )
    				{
    					$city = $job->getCity()->getName().", ";
    				}
    				$state = "";
    				if( $job->getState() )
    				{
    					$state = $job->getState()->getName().", ";
    				}
    				$country = "";
    				if( $job->getCountryRef() )
    				{
    					$country = $job->getCountryRef()->getName();
    				}
	    			$message .= '<tr>';
	    			$message .= '<td style="padding:10px;" valign="middle">';
	    			$message .= '<h4 style="margin-bottom:0; padding-bottom:0; color:#b084e9;">'.$job->getJob_title().'</h4>';
	    			$message .= '<p style="margin-top:0; font-size:13px; padding-top:0;">'.$company.' - '.$city.$state.$country.'</p>';
	    			$message .= '</td>';
	    			$message .= '</tr>';
	    			$message .= '<tr>';
	    			$message .= '<td style="padding:10px;" valign="middle">';
	    			$message .= '<h4 style="margin-bottom:0; font-weight:normal; padding-bottom:0;">Job Description</h4>';
	    			$message .= '<p style="margin-top:0; font-size:13px; padding-top:0;"><span>'.$job->getJob_description().'</span></p>';
	    			$message .= '</td>';
	    			$message .= '</tr>';
    			}
    			$message .= '<td height="40px" align="center" valign="middle" style="color:#6c518f; font-weight:normal; font-size:14px;"><a style="color:#6c518f;text-decoration:none;" href="'.$link_to_job_detail_page.'">To View More visit ilook.com</a></td>';
    			$message .= '</tr>';
    			$message .= '</table>';
    		}
    		Email_Mailer::sendMail(
    				"iLook - Daily Jobs Alerts",
    				$message,
    				$saved_search->getIlookUser()->getFirstname(),
    				$saved_search->getIlookUser()->getEmail_for_job_alerts(),
    				NULL,
    				"iLook Team",
    				"info@ilook.co.in",
    				"Dear",
    				"Thanks"
    		);
}