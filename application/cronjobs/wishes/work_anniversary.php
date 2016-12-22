<?php
/**
 * Cron job for work anniversary.
 *
 * @author hkaur5
 */
include "/../index.php";
$all_ilook_users_obj = \Extended\ilook_user::getAllActiveIlookUsers();

if($all_ilook_users_obj)
{
	foreach( $all_ilook_users_obj as $ilook_user )
	{
		if($ilook_user->getUsersExperience())
		{
// 			print_r($ilook_user->getUsersExperience());
			$experiences = \Extended\experience::getAllExperiences($ilook_user->getId(),1);
			if($experiences)
			{
				if( $experiences[0]->getCurrently_work() )
				{
					$work_start_date = $experiences[0]->getJob_startdate()->format( "d-m" );
					$todayDate = date('d-m');
					$work_start_year =  $experiences[0]->getJob_startdate()->format( "y" );
					$currentYear = date('y');
					if( $work_start_date == $todayDate && ( $currentYear - $work_start_year > 0 ) )
					{
						$time_duration =  date('Y') - $experiences[0]->getJob_startdate()->format('Y');
						$underlying_text = "Completing ".$time_duration. " year(s) at " .$experiences[0]->getExperiencesCompany()->getName()." this ".$experiences[0]->getJob_startdate()->format("F");
						$duration_to_display = 1;
						$save_wish = \Extended\job_anniversary_wishes::addWish($ilook_user,$underlying_text, $duration_to_display );
					}
				}
			}
		}
	}
}