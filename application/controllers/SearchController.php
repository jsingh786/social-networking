<?php
class SearchController extends Zend_Controller_Action
{
    public function init()
    {
        /* Initialize action controller here */

    }

    public function indexAction()
    {
        // action body
    	if( Auth_UserAdapter::hasIdentity() )
    	{
    		$this->_helper->redirector("index", "dashboard");
    	}
    	else
    	{
    		$this->_helper->redirector("index", "index");
    	}
    }

    /**
     * Refine all the parameters used in advance search and calls function to search user on basis of those parameters.
     * @author hkaur5
     * @return array
     */
    public function peopleAction()
    {
        // action body
    	$this->view->allCountriesObj = \Extended\country_ref::getAllActiveCountries();
    	$this->view->allIndustriesObj = \Extended\industry_ref::getAllActiveIndustries();
    	$params = $this->getRequest()->getParams();
    	$stripTags = Zend_Registry::get('Zend_Filter_StripTags');
    	if( ! @$params['list_len'] )
    	{
    		$params['list_len'] = 6;
    	}
    	$this->view->prms = $params;
    	if (  trim( $this->getRequest()->getParam('name') ) != '')
    	{
			// removing white spaces at the beginning and end of the string
			$chuncks = explode(" ", preg_replace('/\s\s+/', ' ', $stripTags->filter($params['name'])));

			if ( $chuncks ) {
				$temp_str = "";
				foreach ($chuncks as $chunk) {
					$temp_str .= preg_replace( "/\W+/", '', $chunk )." ";

				}
			}

    		$name = trim( $temp_str );

    		//Filtering company name.
    		$company = preg_replace( '/\s\s+/', ' ', $stripTags->filter( @$params['company_name'] ) );
    		$chuncks_comp = explode(" ", $company);
    		$temp_str = "";
    		foreach ( $chuncks_comp as $chunk_comp )
    		{
    			$temp_str .= preg_replace( "/\W+/", '', $chunk_comp )." ";
    		}
    		$company = trim( $temp_str );
    		//Filtering skill_name.
    		$skill_name = preg_replace( '/\s\s+/', ' ', $stripTags->filter( @$params['skill'] )) ;
    		$chuncks = explode(" ", $skill_name );
    		$temp_str = "";
    		foreach ( $chuncks as $chunk )
    		{
    			$temp_str .= preg_replace( "/\W+/", '', $chunk )." ";
    		}
    		
    		$skill = trim( $temp_str );
    		//Filtering language_name.
    		$language_name = preg_replace( '/\s\s+/', ' ', $stripTags->filter( @$params['language'] )) ;
    		$chuncks_language = explode(" ", $language_name );
    		$temp_str = "";
    		foreach ( $chuncks_language as $chunk_lang )
    		{
    			$temp_str .= preg_replace( "/\W+/", '', $chunk_lang )." ";
    		}
    		
    		$language = trim( $temp_str );
    		 
    		$country = $params['country_list'];
    		$state = $params['state_list'];
    		$city = $params['city_list'];
    		$industry = $params['industry'];

    		if($language == "" && $language == " ")
    		{
    			$language = null;
    		}
    		
    		if($skill == "" && $skill == " ")
    		{
    			$skill = null;
    		}
    		if($company == "" && $company == " ")
    		{
    			$company = null;
    		}
    		$searched_users= Extended\ilook_user::getSearchResult(Auth_UserAdapter::getIdentity()->getId(), $name, $country, $state, $city, $company, $skill, $industry, $language);
			
    		$this->view->users = $searched_users;
    		$search_complete = "1";
    		$result = array('search_complete'=> $search_complete ,  'users'=> $searched_users );

    		$this->view->result = $result;
    		if($searched_users)
    		{
    			$paginator = Zend_Paginator::factory($searched_users);
    			$paginator->setItemCountPerPage(@$params['list_len']);
    			$paginator->setCurrentPageNumber(@$params['page']);
    			$this->view->paginator=$paginator;
    		}
    	}
    }
    
}



