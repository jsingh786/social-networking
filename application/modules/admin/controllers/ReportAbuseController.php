<?php

class Admin_ReportAbuseController extends Zend_Controller_Action
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
		if ( !Auth_AdminAdapter::hasIdentity() )
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
    
    public function getReportedUsersAction()
    {
    	
    	echo Zend_Json::encode( 
    					\Extended\report_abuse::getDataForDataTables(
    									$this->getRequest()->getParams()));
    	die;
    }
}

