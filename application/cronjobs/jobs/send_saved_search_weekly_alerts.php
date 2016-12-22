<?php
/**
 * Cron job for weekly email alerts
 * for saved search to the user who have
 * saved the same.
 *
 * @author jsingh7
 * @version 1.0
 */
include "/../index.php";

//getting all the saved searches with receive alerts option set on weekly basis.
$saved_searches = \Extended\saved_search::getSearchesForWeeklyEmailAlert();
 
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
		$message .= '<div style="width:640px; border:1px solid #e0d7bf; overflow:hidden; margin:0 auto; font-size:12px; font-family:Arial, Helvetica, sans-serif; background:url(images/body-bg.png);" id="outerwrapper">';
		$message .= '<div style="width:100%; padding:0; float: left;" id="content-section">';
		$message .= '<div style="background:#fff; float:left; margin:0; padding:0; width: 100%;" class="job-detail-col1">';
		$message .= '<div style="font-size:16px; margin:0 0 10px 0; color:#fff; padding:1%; text-align:center; float:left; width:98%;background:#4D3574">Your daily job alert for Business Analyst.</div>';
		foreach ( $result["jobs"] as $job )
		{
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
			$message .= '<div class="job-detail-col1-detail" style="width:450px; padding:10px">';
			$message .= '<h4 style="font-size:16px; margin:0; font-weight:bold;color:#48545E;"> <a style=" color: #B084E9; text-decoration: none;"  href="javascript:;">'.$job->getJob_title().'</a></h4>';
			$message .= '<p style="margin:5px 0 0 0;">'.$company.' - '.$city.$state.$country.'</p>';
			$message .= '<p style="margin:5px 0 0 0;"><a  style=" color: #B084E9; text-decoration: none;" class="text-purple-link" href="javascript:;">'.$job->getUrl_fields().'</a></p></div>';
			$message .= '<div class="job-detail-col1" style="background:#fff; float:left; margin:0 0 2px 0; padding:10px; width: 97%;" >';
			$message .= '<h3 style="font-size:15px; margin:0; font-weight:normal; ">Job Description</h3>';
			$message .= '<p style="margin:5px 0 0 0;">'.$job->getJob_description().'</p>';
			$message .= '</div>';
		}
		$message .= '<div style=" background: none repeat scroll 0 0 #F6F6F6; float: left; margin: 2px 0 0; padding: 6px 0; text-align: center; width: 100%; font-size:13px;"><a style="color:#6C518F; text-decoration:none; display:block;" href="javascript:;">To View More visit iLook</a></div>';
		$message .= '</div>';
		$message .= '</div>';
		$message .= '</div>';
	}
		
	Email_Mailer::sendMail(
			"iLook - Daily Jobs Alerts",
			$message,
			$saved_search->getIlookUser()->getFirstname(),
			$saved_search->getIlookUser()->getEmail_for_job_alerts(),
			NULL,
			"ilook",
			"info@ilook.co.in",
			"Dear",
			"Thanks"
	);
}