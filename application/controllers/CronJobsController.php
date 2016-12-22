<?php

class CronJobsController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    }
	
   
    public function indexAction()
    {
        // action body
    }
	
    /**
     * Code is same as cron job for delete_account
     * 
     * Executes after 30 days of deletion of account.
     * [when user deletes his account, in acutual data remains there only for 30 days.
     * but after 30 days data removed.]
     *
     * @author jsingh7
     * @version 1.0
     */
    public function userDeleteAccountAction()
    {
    	$em = \Zend_Registry::get('em');
    	
    	$user_ids_to_be_deleted = \Extended\ilook_user::getUsersReadyToBeDeleted();

    	if( $user_ids_to_be_deleted )
    	{
    		//===================================================================================
    		//Remove all the cover letters and CVs for the users.
    		//===================================================================================
    		$user_ids_arr = array();
    		foreach ( $user_ids_to_be_deleted as $user_id_to_be_deleted )
    		{
    			$user_ids_arr[] = $user_id_to_be_deleted["id"];
    		}
    		\Extended\job_applications::deleteCoverltrAndCVOfUser( $user_ids_arr );
    	
    	
    		foreach ( $user_ids_to_be_deleted as $user_id_to_be_deleted )
    		{
    	
    			//===================================================================================
    			//Remove imails received and sent by user( actually automatic sent ) of type link request ( MSG_TYPE_LINK_REQ ).
    			//===================================================================================
    			$new_arr = array();
    			foreach ( \Extended\link_requests::getLinkRequestSentOrRecieved ( $user_id_to_be_deleted['id'] ) as $temp )
    			{
    				$new_arr[] = $temp->getId();
    			}
    	
    			if( $new_arr )
    			{
    				foreach ( $new_arr as $link_req_id )
    				{
    					$message_obj = $em->getRepository('\Entities\message')->findOneBy(array('link_req_id' => $link_req_id) );
    					if($message_obj)
    					{
    						\Extended\message::deleteMessagePermanently( $message_obj->getId(), false );
    					}
    				}
    				$em->flush();
    			}
    	
    			//===================================================================================
    			//Remove all the album directories of user from server.
    			//===================================================================================
    			Helper_common::removeUserAlbum( $user_id_to_be_deleted['id'] );
    	
    			//===================================================================================
    			//Remove all the profile pictures of user from server directories of user.
    			//===================================================================================
    			Helper_common::removeProfileImagesOfUser( $user_id_to_be_deleted['id'] );
    	
    			//===================================================================================
    			/* Remove "deleted user" from [comma separated links ids] from user table from the records of his links
    			 * and also empty his row of comma seperated link ids.
    			*/
    			//===================================================================================
    			//First get links of user.
    			$Userlinks_arr = \Extended\link_requests::getLinkList($user_id_to_be_deleted['id']);
    	
    			if( $Userlinks_arr )
    			{
    				\Extended\link_requests::removeUserFromCommaSepLinkList( $Userlinks_arr, $user_id_to_be_deleted['id'], true );



				}
    	
    			//===================================================================================
    			//Remove "deleted user" from [comma separated supporter ids] from user_skills table on the basis of support_skill table.
    			//===================================================================================
    			\Extended\user_skills::deleteUserFromSupportedIds( $user_id_to_be_deleted['id'] );
    	
    			//===================================================================================
    			//Deleting wish on the basis of new_link_id only.
    			//===================================================================================
    			\Extended\new_link_wishes::deleteWishOfTypeLinkReq( 0, $user_id_to_be_deleted['id'] );
    	
    	
    			//===================================================================================
    			//Remove user from user lucene indexing.
    			//===================================================================================
    			\Extended\ilook_user::deleteLuceneIndex( $user_id_to_be_deleted['id'] );
    	
    			//===================================================================================
    			//Soft delete the user and cascade delete all the related things.
    			//===================================================================================
    			\Extended\ilook_user::softDeleteUser( $user_id_to_be_deleted['id'] );
    		}
    	}
    	die;
    }
    /**
     * Same code as
     * Cron job for daily email alerts
     * for saved search to the user who have
     * saved the same.
     *
     * @author jsingh7
     * @author hkaur5
     * @version 1.0
     */
    public function jobsSendSavedSearchDailyAlertsAction()
    {
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
    			$message .= '<td>';
    			$message .= '</td>';
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
		die;
    }
    
    /**
     * Cron job for birthday
     * wishes.
     *
     * @author hkaur5
     * @version 1.0
     */
    public function birthdayWishesAction()
    {
    	$all_ilook_users_obj = \Extended\ilook_user::getAllActiveIlookUsers();
    	
    	$em = \Zend_Registry::get('em');
    	$qb_1 = $em->createQueryBuilder();
    	$q_1 = $qb_1->select('
    			usr.birthday
    			')
    			->from( '\Entities\ilook_user', 'usr' )
    			->where( 'usr.status='.\Extended\ilook_user::USER_STATUS_ACTIVE )
    			->andWhere( 'usr.verified=1' );
    	$q_1 = $q_1->getQuery();
    	//$ret = $q_1->getResult( \Doctrine\ORM\Query::HYDRATE_ARRAY );
    	$ret = $q_1->getResult();
    	if($all_ilook_users_obj)
    	{
    		foreach( $all_ilook_users_obj as $ilook_user )
    		{
    			if($ilook_user->getBirthday())
    			{
    				$birthdate_of_user_obj = \DateTime::createFromFormat( "d-m-Y", $ilook_user->getBirthday() );
    				$birthdate_of_user = $birthdate_of_user_obj->format('d-m');
    				$todayDate = date('d-m');
//     				echo $birthdate_of_user."==";
    				
//     				echo $todayDate;
//     				echo "<br>";
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
    }
    
    
    /**
     * Cron job for work anniversary.
     *
     * @author hkaur5
     */
    public function workAnniversaryAction()
    {
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
    	die;
    }
    
    /**
     * Fetch all unverified users and send verification mail to them.
     * @return void
     * @author hkaur5
	 * @author jsingh[Moved the code of this function to Email_CommonMails class for reusage.]
     */
	public function sendVerificationMailToUnverifiedUsersAction()
	{
		//******************************************************************************//
		// Script to send verification mail to all unverified users
		//******************************************************************************//
		$unverified_users = \Extended\ilook_user::getUnverifiedUsers();
		foreach($unverified_users as $unverified_user)
		{
			Email_CommonMails::verificationEmail($unverified_user['id']);
		}
		die;
	}
	
/*
 * store-old-users-settings-for-chat
 * To save chat setings for existing users on iLook & add them on opeenfire server.
 * @author ssharma4
 * @version 1.0
 * @date 11_aug_16
 */
	public function storeOldUsersSettingsForChatAction()
	{
		//get all verfied users.
		$allVerifiedUsers =\Extended\ilook_user::getIlookUsersByParameters(null,
			null,
			null,
			null,
			array(),
			null,
			null,
			null,
			null,
			null,
			null,
			true
		);
		
		//save all user's default chat settings [chat=>ON,read_receipt=>1] & add on openfire server.
		foreach($allVerifiedUsers as $verifiedUser){

			$IsOpenfireUser =\Extended\chat_settings::getRowObject(['ilookUser' => $verifiedUser[0]->getId()]);
			if (!$IsOpenfireUser) {
				$openfirePassword = Helper_common::generatePassword(10);
				//Set up chatsettings for openfire chat.
				//creating user on openfire.
				try {
					$openFireMain = new Openfire\Main();
					$openFireMain->createUser(
						['username' => $verifiedUser[0]->getUsername(),
							'password' => $openfirePassword,
							'name' => $verifiedUser[0]->getFirstname() . ' ' . $verifiedUser[0]->getLastname(),
							'email' => $verifiedUser[0]->getEmail()
						]
					);

				}catch (\Exception $e){
					Helper_common::logInfo($e, 'red');
				}
				// persisting openfire user data on iLook DB (required only).
				\Extended\chat_settings::add(['iLookUser' => $verifiedUser[0]->getId(),'openfire_password'=>base64_encode($openfirePassword)]);
			}
		}
		
		die;
	}

	/*
     * addLinksToRoster
     * Function gets links of user & add them in user's roster & logged user into link's roster.
     * @author ssharma4
     * @version 1.0
     * @date 15_nov_16
     */
	public function addLinksToRosterAction()
	{
		$id=Auth_UserAdapter::getIdentity()->getId();
		//Getting chat settings of the user, who have received link request(friend request).
		$chat_settings = \Extended\chat_settings::getRowObject (['ilookUser'=>$id]);

		if ($chat_settings) {
			$links = \Extended\ilook_user::getLinksOfUser($id);
			foreach ($links as $link) {

				//Getting chat settings of new link id.
				$linkChatSettingObj = \Extended\chat_settings::getRowObject(['ilookUser' => $link->getId()]);

				if ($linkChatSettingObj) {
					try {
						$openFireMain = new Openfire\Main();

						//Adding link request into logged user's roster.
						$openFireMain->addToRoster(
							$chat_settings->getIlookUser()->getUsername(),
							$linkChatSettingObj->getIlookUser()->getUsername() . '@' . $openFireMain::OPENFIRE_DOMAIN,
							$linkChatSettingObj->getIlookUser()->getFirstname() . ' ' . $linkChatSettingObj->getIlookUser()->getLastname(),
							Openfire\Constants::SUBSCRIPTION_TYPE
						);
						//Adding logged user into link request's roster.
						$openFireMain->addToRoster(
							$linkChatSettingObj->getIlookUser()->getUsername(),
							$chat_settings->getIlookUser()->getUsername() . '@' . $openFireMain::OPENFIRE_DOMAIN,
							$chat_settings->getIlookUser()->getFirstname() . ' ' . $chat_settings->getIlookUser()->getLastname(),
							Openfire\Constants::SUBSCRIPTION_TYPE
						);

					} catch (\Exception $e) {

					}
				}
			}

		}
		die;
	}

	/*
     * save-default-notification-settings
     * One time function to save default notification settings for existing users.
     * @author ssharma4
     * @version 1.0
     * @date 20_oct_16
     */
	public static function saveDefaultNotificationSettingsAction()
	{
		//get all verfied users.
		$allVerifiedUsers =\Extended\ilook_user::getIlookUsersByParameters(null,
			null,
			null,
			null,
			array(),
			null,
			null,
			null,
			null,
			null,
			null,
			true
		);

		//save all user's default chat settings [chat=>ON,read_receipt=>1] & add on openfire server.
		foreach($allVerifiedUsers as $verifiedUser) {
			$postData = array(
				'link_request' => 1,
				'feedback_request' => 1,
				'reference_request' => 1,
				'job_invite' => 1,
				'general_notification' => 1
			);
			\Extended\notification_settings::saveNotificationSettings($verifiedUser[0]->getId(), $postData);

		}
		die;
	}
}

