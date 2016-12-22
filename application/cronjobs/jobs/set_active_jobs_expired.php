<?php
/**
 * Used for updating the job status to expire from active
 * If they have not set expiry date it will expire after 30 days else on expiry date.
 *
 * @author nsingh3, jsingh7
 * @version 1.0
 */
include "/../index.php";

$getJobList = \Extended\job::getAllActiveJobs();

if($getJobList)
{
	foreach ($getJobList as $jobDetail)
	{
		$status_expired = 2;
		//Does job has expiry date.
		if( $jobDetail->getExpiry_date() )
		{
			$todayDate = new DateTime();
			
			if( $jobDetail->getExpiry_date() < $todayDate )
			{
				\Extended\job::changeJobStatus( $jobDetail->getId(), $status_expired );
			}
		}
		else
		{		
			// if job posted before 30 days then it should expire.
			$totalDays = $jobDetail->getCreated_at()->diff(new datetime())->days;
			if($totalDays && $totalDays >= 30)
			{
				\Extended\job::changeJobStatus( $jobDetail->getId(), $status_expired );
			}
		}	
	}
}