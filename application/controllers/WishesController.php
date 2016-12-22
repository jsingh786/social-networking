<?php

class WishesController extends Zend_Controller_Action
{
	
	public function preDispatch()
	{
		
		if ( !Auth_UserAdapter::hasIdentity() )
		{
			$this->_helper->redirector( 'index', 'index' );
		}
	}
    public function init()
    {
    	
        /* Initialize action controller here */

    }

    public function indexAction()
    {
    	$params = $this->getRequest()->getParams();
		$wishes = \Extended\wishes::getWishesForUser( Auth_UserAdapter::getIdentity()->getId(),10,0 );
		$this->view->wishes_collec = $wishes['data'];
        $this->view->is_more_wishes = $wishes['is_more_records'];
    }
    
    public function loadMoreWishesAction()
    {
    	$params = $this->getRequest()->getParams();
    	$wishes_info_arr = array();
    	$wishes = \Extended\wishes::getWishesForUser( Auth_UserAdapter::getIdentity()->getId(),$params['limit'],$params['offset'] );
  
    	$wishes_data = $wishes['data'];
		$wishes_is_more="";
    	if($wishes['is_more_records'])
    	{
    		$wishes_is_more = $wishes['is_more_records'];
    	}
    	if($wishes)
    	{
    		foreach( $wishes_data as $key=>$wish )
    		{
				$wishes_info_arr[$key]['wish_id'] = $wish->getId();
				$wishes_info_arr[$key]['type'] = \Extended\wishes::getDiscriminatorValue($wish);
    			switch($wishes_info_arr[$key]['type'])
    			{
    				case 1:
	    				$wishes_info_arr[$key]['wish_about_user_id'] = $wish->getIlookUser()->getId();
	    				$wishes_info_arr[$key]['wish_about_user_prof_photo'] = Helper_common::getUserProfessionalPhoto( $wish->getIlookUser()->getId(), 3 );
	    				$wishes_info_arr[$key]['wish_about_user_name'] = $wish->getIlookUser()->getFirstname().' '.$wish->getIlookUser()->getLastname();
	    				$wishes_info_arr[$key]['wish_about_user_username'] = $wish->getIlookUser()->getUsername();
	    				$new_link_obj = \Extended\ilook_user::getRowObject( $wish->getLink_ilook_user_id(), TRUE );
	    				$wishes_info_arr[$key]['new_link_name'] = $new_link_obj->getFirstname()." ".$new_link_obj->getLastname();
	    				$wishes_info_arr[$key]['new_link_username'] = $new_link_obj->getUsername();
	    				if(Helper_common::getUserProfessionalInfo(  $new_link_obj->getId() ))
	    				{
	    					$wishes_info_arr[$key]['new_link_prof_info'] = Helper_common::getUserProfessionalInfo(  $new_link_obj->getId() );
	    				}
	    				$wishes_info_arr[$key]['new_link_prof_photo'] = Helper_common::getUserProfessionalPhoto( $new_link_obj->getId(), 3 );
    				break;
    			
	    			case 2:
	    				$wishes_info_arr[$key]['wish_about_user_prof_photo'] = Helper_common::getUserProfessionalPhoto( $wish->getIlookUser()->getId(), 3 );
	    				$wishes_info_arr[$key]['wish_about_user_id'] = $wish->getIlookUser()->getId();
	    				$wishes_info_arr[$key]['wish_about_user_name'] = $wish->getIlookUser()->getFirstname().' '.$wish->getIlookUser()->getLastname();
	    				$wishes_info_arr[$key]['wish_underlying_text'] =  $wish->getUnderlying_text();
	    			break;
	    			
	    			case 3:
	    				$wishes_info_arr[$key]['wish_about_user_prof_photo'] = Helper_common::getUserProfessionalPhoto( $wish->getIlookUser()->getId(), 3 );
	    				$wishes_info_arr[$key]['wish_about_user_id'] = $wish->getIlookUser()->getId();
	    				$wishes_info_arr[$key]['wish_about_user_name'] = $wish->getIlookUser()->getFirstname().' '.$wish->getIlookUser()->getLastname();
	    				$wishes_info_arr[$key]['wish_underlying_text'] =  $wish->getUnderlying_text();
	    			break;
	    			
	    			case 5:
	    				$wishes_info_arr[$key]['wish_about_user_prof_photo'] = Helper_common::getUserProfessionalPhoto( $wish->getIlookUser()->getId(), 3 );
	    				$wishes_info_arr[$key]['wish_about_user_id'] = $wish->getIlookUser()->getId();
	    				$wishes_info_arr[$key]['wish_about_user_name'] = $wish->getIlookUser()->getFirstname().' '.$wish->getIlookUser()->getLastname();
					break;
					
    			}
    			
    		}
	    		$wish_arr = array();
	    		$wish_arr['data'] = $wishes_info_arr;
	    		$wish_arr['is_more'] = $wishes_is_more;
    			echo Zend_Json::encode($wish_arr);
    			die;
    	}
    	else 
    	{
    		echo Zend_Json::encode(0);
    		die;
    	}
    }


}

