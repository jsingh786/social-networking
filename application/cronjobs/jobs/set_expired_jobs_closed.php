<?php
/**
 * Used for updating the job status closed from expired,
 * if they are 15 days old.
 *
 * @author jsingh7
 * @version 1.0
 */
include "/../index.php";
$jobList = \Extended\job::getAllExpiredJobs();

if($jobList)
{
	foreach ($jobList as $job)
	{
		$jobId = $job->getId();
		$totalDays = $job->getCreated_at()->diff(new datetime())->days;
		if($totalDays && $totalDays >= 15)
		{
			$updateJobStatus = \Extended\job::changeJobStatus($jobId, 4);
		}
	}
}