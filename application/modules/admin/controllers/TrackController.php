<?php

class Admin_TrackController extends Zend_Controller_Action
{
	/**
	 * This function checks auth storage and
	 * manage redirecting.
	 *
	 * @author Jaskaran
	 * @since 20 June, 2012
	 * @version 1.0
	 * @see Zend_Controller_Action::preDispatch()
	 *
	 */
	public function preDispatch()
	{
		if ( Auth_AdminAdapter::hasIdentity() )
		{
			//Checking admin type and redirecting accordingly
			if( Auth_AdminAdapter::getIdentity()->getRole()->getId() == 1 )//if Admin but not Sub-admin.
			{
				$sec_storage = new Zend_Session_Namespace('admin_secondary_identity_storage');
				if( !$sec_storage->id )
				{
					$this->_helper->redirector( 'index', 'secondary-authentication', 'admin' );
				}
			}
			//Checking if sub-admin and login first time then redirect to change password
			else if( Auth_AdminAdapter::getIdentity()->getRole()->getId() == 2 &&
					Auth_AdminAdapter::getIdentity()->getIs_first_time_login() == 1 )
			{
				$sec_storage = new Zend_Session_Namespace('admin_secondary_identity_storage');
				if( !$sec_storage->id )
				{
					$this->_helper->redirector( 'change-password', 'sub-admins', 'admin' );
				}
			}
		}
		else
		{
			$this->_helper->redirector( 'index', 'index', 'admin' );
		}
	}
    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
        // action body


    }
	/**
	 * This send mails to users so that track to their locations.
	 *
	 * @author ssharma4
	 * @version 1.0
	 */
	public function sendTrackMailToUsersAction()
	{
		$params = $this->getRequest()->getParams();
		$sub_string = preg_replace("/^([^a-zA-Z0-9])*/", "", $params['emailToken'],1);
		$params['emailToken'] = strrev(preg_replace("/^([^a-zA-Z0-9])*/", "",strrev($sub_string),1));
		if(!empty($params['emailToken']))
		{
			$tokensArr = array();
		$tokensArr = explode(",",$params['emailToken']);
			

		foreach($tokensArr as $tokens){
			$hrefUrl = PROJECT_URL.'/'.PROJECT_NAME.'index/investors-look?email='.$tokens;

			$subject = "iLook - London Investors invest 5 Milllion USD in iLook";
			$bodyText =
				'<br>
		    			<p style="margin:0 20px 0 0; padding:0; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#3a3a3a ">Hurray… It’s a Glad News. iLook is a Million Dollar company now!!.</p>
		    			<br />
		    			<p style="margin:0 20px 0 0; padding:0; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#3a3a3a ">iLook managed to get an Angel Investment of 5 Million USD.</p>
		    			<br />
		    			<p style="margin:0 20px 0 0; padding:0; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#3a3a3a ">The CEO and the Management team will be moving to a new office in Canary Wharf, London.</p>
						<br/>
						<p style="margin:0 20px 0 0; padding:0; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#3a3a3a "> Read the full journey of iLook from Scratch to Successful Million Dollar Venture.</p>
						<br/>
						<p style="margin:0 20px 0 0; padding:0; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#3a3a3a ">  <a href="'.$hrefUrl.'">Read More</a> </p>';


				\Email_Mailer::sendMail ( $subject,
					$bodyText,
					'iLookers',
					$tokens,
					array(),
					Email_Mailer::DEFAULT_SENDER_NAME,
					Email_Mailer::DEFAULT_SENDER_EMAIL,
					Email_Mailer::DEFAULT_SALUTATION,
					Email_Mailer::DEFAULT_COMPLIMENTARY_CLOSING
					);


		}
		echo Zend_Json_Encoder::encode(true);die;
		} else {
			echo Zend_Json_Encoder::encode(false);die;
		}
		

	}

}

