<?php

class PageController extends Zend_Controller_Action
{

    /**
     * This function runs before dispatching 
     * any controller
     * @author sjaiswal
     * @version 1.0
     * @see Zend_Controller_Action::preDispatch()
     *
     *
     */
    public function preDispatch()
    {
    	// code for disabling main menu on pages 
    	//Zend_Layout::getMvcInstance()->assign('disableMainMenu', true);

    }

    public function init()
    {
    	Zend_Layout::getMvcInstance()->assign('disableMainMenu', true);
    }

    public function indexAction()
    {
    
    	
    }
    
    /**
     * Action associated with about us page
     *
     * @author sjaiswal
     * @version 1.0
     */
    public function aboutUsAction()
    {
    
    }
    
    /**
     * Action associated with cookies page.
     *
     * @author jsingh7
     * @version 1.0
     */
    public function cookiesAction()
    {
    
    }
    
    /**
     * Action associated with privacy policy page
     *
     * @author sjaiswal
     * @version 1.0
     */
    public function privacyPolicyAction()
    {
    	
    }
    
    /**
     * Action associated with advertisement page
     *
     * @author sjaiswal
     * @version 1.0
     */
    public function advertisementAction()
    {
    	 
    }
    
    /**
     * Action associated with help page
     *
     * @author sjaiswal
     * @version 1.0
     */
    public function helpAction()
    {
    
    }
    
    /**
     * Action associated with help page
     *
     * @author hkaur5
     * @version 1.0
     */
    public function helpLinksAction()
    {
    
    }
    
    /**
     * Action associated with help page
     *
     * @author hkaur5
     * @version 1.0
     */
    public function helpSettingsAction()
    {
    
    }
    
    /**
     * Action associated with help page
     *
     * @author hkaur5
     * @version 1.0
     */
    public function helpProfileAction()
    {
    
    }
    
    /**
     * Action associated with help page
     *
     * @author hkaur5
     * @version 1.0
     */
    public function helpJobsAction()
    {
    	
    }
    
    /**
     * Action associated with help page
     *
     * @author hkaur5
     * @version 1.0
     */
    public function helpNotificationsAction()
    {
    	
    }
    
    /**
     * Action associated with help page
     *
     * @author hkaur5
     * @version 1.0
     */
    public function helpSkillsAction()
    {
    	
    }
    
    /**
     * Action associated with help page
     *
     * @author hkaur5
     * @version 1.0
     */
    public function helpDashboardAction()
    {
    	
    }
    
    /**
     * Action associated with help page
     *
     * @author hkaur5
     * @version 1.0
     */
    public function helpSearchAction()
    {
    	
    }
    /**
     * Action associated with help page
     *
     * @author hkaur5
     * @version 1.0
     */
    public function helpDisplayAction()
    {
    	
    }
    
    /**
     * Action associated with terms page
     *
     * @author sjaiswal
     * @version 1.0
     */
    public function termsAction()
    {
    
    }
}







