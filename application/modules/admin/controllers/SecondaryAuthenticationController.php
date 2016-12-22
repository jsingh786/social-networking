<?php

class Admin_SecondaryAuthenticationController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
        // action body
    	// action body
    	if ( Auth_AdminAdapter::hasIdentity() )
    	{
    		if( Auth_AdminAdapter::getIdentity()->getRole()->getId() == 1 )//if Admin but not Sub-admin.
    		{
    			$ask_digits_arr = array();
    			$ask_digits_arr[0]['sentence'] = 'Please enter 1st, 2nd and 3rd digit of your general password.';
    			$ask_digits_arr[0]['positions'] = '1,2,3';
    			$ask_digits_arr[1]['sentence'] = 'Please enter 1st, 3rd and 4th digit of your general password.';
    			$ask_digits_arr[1]['positions'] = '1,3,4';
    			$ask_digits_arr[2]['sentence'] = 'Please enter 2nd, 4th and 5th digit of your general password.';
    			$ask_digits_arr[2]['positions'] = '2,4,5';
    			$ask_digits_arr[3]['sentence'] = 'Please enter 1st, 5th and 6th digit of your general password.';
    			$ask_digits_arr[3]['positions'] = '1,5,6';
    			$ask_digits_arr[4]['sentence'] = 'Please enter 4th, 5th and 6th digit of your general password.';
    			$ask_digits_arr[4]['positions'] = '4,5,6';
    			$ask_digits_arr[5]['sentence'] = 'Please enter 3rd, 4th and 5th digit of your general password.';
    			$ask_digits_arr[5]['positions'] = '3,4,5';
    			$ask_digits_arr[6]['sentence'] = 'Please enter 2nd, 4th and 6th digit of your general password.';
    			$ask_digits_arr[6]['positions'] = '2,4,6';
    			$ask_digits_arr[7]['sentence'] = 'Please enter 1st, 4th and 5th digit of your general password.';
    			$ask_digits_arr[7]['positions'] = '1,4,5';
    			$ask_digits_arr[8]['sentence'] = 'Please enter 2nd, 3rd and 4th digit of your general password.';
    			$ask_digits_arr[8]['positions'] = '2,3,4';
    	
    			shuffle($ask_digits_arr);
    	
    			$this->view->ask_digits = $ask_digits_arr[0];
    			$gen_password_positions = new Zend_Session_Namespace ('gen_password_positions');
    			$gen_password_positions->positions = $ask_digits_arr[0]['positions'];
    		}
    		else
    		{
    			$this->_helper->redirector( 'index', 'index', 'admin' );
    		}
    	}
    }


}

