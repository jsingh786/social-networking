<?php
/**
 * Cron job for birthday
 * wishes.
 *
 * @author hkaur5
 * @version 1.0
 */
include "/../index.php";

$all_ilook_users_obj = \Extended\ilook_user::getAllActiveIlookUsers();

if($all_ilook_users_obj)
{
	foreach( $all_ilook_users_obj as $ilook_user )
	{
		if($ilook_user->getBirthday())
		{
			$birthdate_of_user_obj = \DateTime::createFromFormat( "d-m-Y", $ilook_user->getBirthday() );
			$birthdate_of_user = $birthdate_of_user_obj->format('d-m');
			$todayDate = date('d-m');
			if( $birthdate_of_user == $todayDate )
			{
				$underlying_text = $ilook_user->getFirstname()." is celebrating birthday on ".$birthdate_of_user_obj->format("jS F"); 
				$duration_to_display = 1;
				$save_wish = \Extended\birthday_wishes::addWish($ilook_user,$underlying_text, $duration_to_display );
			} 
		}
	}
	
}
else
{
	echo"no active users";
}
	die;



