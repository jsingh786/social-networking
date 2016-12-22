<?php

class NewsController extends Zend_Controller_Action
{

    /**
     * This function checks auth storage and
     * manage redirecting.
     * 
     * @author jsingh7
     * @since 20 June, 2013
     * @version 1.0
     * @see Zend_Controller_Action::preDispatch()
     *
     *
     */
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
	/**
	 * This function displays bbc news in news section
	 * The function is updated as news has stopped fetching images(ssharma4).
	 * @author spatial
	 * @author ssharma4
	 * @since 24 June, 2016
	 * @version 1.2
	 */
    public function indexAction()
    {
		$records=array();//used to stores all feeds
		//get feeds from below mentioned links for business,science and enviromnment.
		$feed = array(
			"business"=>"http://feeds.bbci.co.uk/news/video_and_audio/business/rss.xml",
			"science and environment"=>"http://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
			"technology"=>"http://feeds.bbci.co.uk/news/technology/rss.xml"
		);

		//loop will hit url & get contents & assign values into child array(articles)
		//After than All articles like  business articles assigned in parent array(records)
		foreach($feed as $key=>$dd) {
			$xmlDoc = new DOMDocument();
			$xmlDoc->load($dd);
			$items = $xmlDoc->getElementsByTagName('item');
			foreach ($items as $key => $item) {
				$full_title = $item->getElementsByTagName('title')->item(0)->childNodes->item(0)->nodeValue;//get article title
				$link = $item->getElementsByTagName('link')->item(0)->childNodes->item(0)->nodeValue;//get links for article here
				$desc = $item->getElementsByTagName('description')->item(0)->childNodes->item(0)->nodeValue;//get article description
				$media = $item->getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'thumbnail');//get images for articles

				foreach ($media as $thumb) {
					$image = $thumb->getAttribute('url');
					break;
				}

				$full_title = isset($full_title) ? (string)$full_title:NULL;
				if(strlen((string)$full_title)>22)
				{
					$title=substr((string)$full_title,0,22)."..";
				}
				else
				{
					$title= isset($item->title) ? (string)$item->title:NULL;
				}
				// link..
				if (preg_match("/VIDEO/", $full_title))
				{
					$link = (string)$link;
				}
				else if (preg_match("/AUDIO/", $full_title))
				{
					$link = (string)$link;
				}
				else
				{
					$link = str_replace("http://www.bbc.co.uk/", PROJECT_URL."/".PROJECT_NAME."news/detail/", (string)$link);
				}
				$newDate = "";
				if( isset($item->pubDate)) {

					$newDate = date('l, F j, Y g:iA ', strtotime((string)$item->pubDate));
				}


				// video img..
				$videoimg = 0;
				if ( isset($item->title) && preg_match("/VIDEO/", (string)$item->title) || isset($item->title) && preg_match("/AUDIO/", (string)$item->title))
				{
					$videoimg = 1;
				}
				$articles[] = array(
					'full_title' => $full_title,
					'title' => $title,
					'description' => $desc,
					'link' => $link,
					'dateNtime' => $newDate,
					'image' => PUBLIC_PATH.'/Imagehandler/GenerateImage.php?image='.$image.'&h=200&w=356',
					'videoImg' =>$videoimg
				);
			}

			$records[]=$articles;
			$articles =array();

		}
		$newsArr = array_merge($records[0], $records[1], $records[2]);
		$news_arr = new \Zend_Session_Namespace('News_arr');
		$news_arr->list = $newsArr;
		$this->view->news=$newsArr;
    }

	public static function xmltoarray($root) {
			$result = array();

			if ($root->hasAttributes()) {
				$attrs = $root->attributes;
				foreach ($attrs as $attr) {
					$result['@attributes'][$attr->name] = $attr->value;
				}
		}

		if ($root->hasChildNodes()) {
			$children = $root->childNodes;
			if ($children->length == 1) {
				$child = $children->item(0);
				if ($child->nodeType == XML_TEXT_NODE) {
					$result['_value'] = $child->nodeValue;
					return count($result) == 1
						? $result['_value']
						: $result;
				}
			}
			$groups = array();
			foreach ($children as $child) {
				if (!isset($result[$child->nodeName])) {
					$result[$child->nodeName] = self::xmltoarray($child);
				} else {
					if (!isset($groups[$child->nodeName])) {
						$result[$child->nodeName] = array($result[$child->nodeName]);
						$groups[$child->nodeName] = 1;
					}
					$result[$child->nodeName][] = self::xmltoarray($child);
				}
			}
		}

		return $result;
	}

    public function newsDetailAction()
    {
        // action body
    }

    public function detailAction()
    {

    	$params=$this->_getAllParams();


    	$keys=array();
    	$values=array();
    	foreach($params as $k=>$v){
    		$keys[]=$k;
    		$values[]=$v;
    	}
		$parameters ="";
    	for($i=2;$i<(count($values)-1);$i++){
    		$parameters.=$keys[$i]."/".$values[$i]."/";
    	}

    	$page=file_get_contents("http://www.bbc.co.uk/".substr($parameters, 0, -1));

		$doc = new DOMDocument();
		libxml_use_internal_errors(true);
		if($page)
		{
		$doc->loadHTML($page);
		}
		// get heading of the news..
		$newsHeading = $doc->getElementsByTagName('h1');
		foreach($newsHeading as $heading) {
			if ($heading->getAttribute('class') === 'story-body__h1') {
				
				$this->view->heading=$heading->nodeValue;
				break;
			}
		}
		// get date of the news..
		$newsDate = $doc->getElementsByTagName('span');
	
		foreach($newsDate as $date) {
			if ($date->getAttribute('class') === 'story-date') {
				$this->view->date=$date->nodeValue;
				break;
			}
		}
		// get all images of the news..
		$xpath = new DOMXPath($doc);
		$srcs = $xpath->query("//div[@class='story-body']//img/attribute::src");
		$imgsrc = array();
		foreach ($srcs as $src) {
			$imgsrc[]=$src->value;
		}
		$this->view->img=$imgsrc;
		// get other content of the news..
    	
		$paragraph = $doc->getElementsByTagName('p');
		$parag=array();
		foreach($paragraph as $para) {
			if ($para->getAttribute('class') === 'story-body__introduction') {
				$this->view->introduction=$introduction=$para->nodeValue;
			}
			else{
				if($para->nodeValue!=""){
				if (strpos($para->nodeValue,'BBC is not responsible') !== false || strpos($para->nodeValue,'terms and conditions') !== false || strpos($para->nodeValue,'@bbc.co.uk') !== false) {
				 	break;
				 }
				 $parag[]=$para->nodeValue;
				}
		
			}
		}
		
		$this->view->paragNews=$parag;
    }

    public function newsListAction()
    {
		$news_arr2 = new \Zend_Session_Namespace('News_arr2');
		if($news_arr2)
		{
			$newsList = self::getBBCNewsList();
			$newsArr=Zend_Json::encode($newsList);
			$news_arr2 = new \Zend_Session_Namespace('News_arr2');
			$news_arr2->list = $newsArr;
		}
		die;
    }

    public function remainingNewsAction()
    {
		$newsList = self::getBBCNewsList();
		echo  Zend_Json::encode($newsList);
		die;
    }

    /**
     * Retrive news detail list.
     * @param int $id
     * @return string
     * @version 1.0
     * @author Sunny Patial.
     *
     *
     */
    public static function getBBCNewsList($offSet = null)
    {
		$feed = array(
				"business"=>"http://feeds.bbci.co.uk/news/business/rss.xml",
				"science and environment"=>"http://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
				"technology"=>"http://feeds.bbci.co.uk/news/technology/rss.xml"
		);
		$records=array();
		foreach($feed as $key=>$dd)
		{
			$data = file_get_contents($dd);
			$data = simplexml_load_string($data);
			$namespace = "http://search.yahoo.com/mrss/";
			$articles = array();
			if( $data->channel )
			{
				if( $data->channel->item )
				{
					foreach ( $data->channel->item as $item )
					{
						$media = $item->children('http://search.yahoo.com/mrss/');
						$image = array();
						
						
						if( $media->thumbnail[1] )
						{
							if( $media->thumbnail[1]->attributes() )
							{
								foreach($media->thumbnail[1]->attributes() as $key => $value)
								{
									$image[$key] = (string)$value;
								}
								$image = $image['url'];
								// title..
								$full_title = (string)$item->title;
								if(strlen((string)$item->title)>22)
								{
									$title=substr((string)$item->title,0,22)."..";
								}
								else
								{
									$title= (string)$item->title;
								}

								// desc..
								if(strlen((string)$item->description)>200)
								{
									$desc = substr((string)$item->description,0,200)."..";
								}
								else
								{
									$desc = (string)$item->description;
								}
								// link..
								if (preg_match("/VIDEO/", (string)$item->title)) 
								{
									$link = (string)$item->guid;
								}
								else if (preg_match("/AUDIO/", (string)$item->title)) 
								{
									$link = (string)$item->guid;
								}
								else
								{
									$link = str_replace("http://www.bbc.co.uk/", PROJECT_URL."/".PROJECT_NAME."news/detail/", (string)$item->guid);
								}
								// time..
								$timestamp = strtotime((string)$item->pubDate);
								$newDate = date('l, F j, Y g:iA ', $timestamp);
								// video img..
								$videoimg = 0;
								if (preg_match("/VIDEO/", (string)$item->title) || preg_match("/AUDIO/", (string)$item->title)) 
								{
									$videoimg = 1;
								}
								$news[] = array(
										'full_title' => $full_title,
										'title' => $title,
										'description' => $desc,
										'link' => $link,
										'dateNtime' => $newDate,
										'image' => $item->children($namespace)->thumbnail[1]->attributes(),
										'videoImg' =>$videoimg
								);
							}
						}
					}

					$records[]=$articles;
				}
			}
		}

		$newsArr = array_merge($records[0],$records[1],$records[2]);
		return $newsArr;
    }




	/**
	 * Parse XML from http://www.ibnlive.com/rss/india.xml
	 * for news listing page
	 * Modified fetching date code format according to bbc news.
	 * @author hkaur5
	 * @author ssharma4
	 * @version 1.1
	 */
	public function ibnAction()
	{
		//=======Disable FATAL Errors!============
			ini_set('display_errors',0);
		//========================================
		$url = 'http://www.ibnlive.com/rss/india.xml';

		$xml = file_get_contents($url);
		$obj = SimpleXML_Load_String($xml);

		$i = 0;

		if( $obj->channel )
		{
			if( $obj->channel->item )
			{

				foreach ($obj->channel->item as $item)
				{
					$full_title = $item->title;

					if(strlen((string)$item->title)>30)
					{

						$title= Helper_common::showCroppedText((string)$item->title, 30);
					}
					else
					{
						$title= (string)$item->title;
					}

					//Removing image from description , also storing image src.
					if(strlen((string)$item->description) )
					{
						$html = $item->description;
						$doc = new DOMDocument();
						libxml_use_internal_errors(true);
						$doc->loadHTML($html); // loads your html
						$xpath = new DOMXPath($doc);
						$nodelist = $xpath->query("//img"); // find your image

						$node = $nodelist->item(0); // gets the 1st image
						$img_src = $node->attributes->getNamedItem('src')->nodeValue;


						$content = $item->description;
						$content = preg_replace("/<img[^>]+\>/i", "", $content);
					}

					//Cropping description.
					if(strlen((string)$item->description) >160)
					{

						$desc = Helper_common::showCroppedText($content, 160);
					}
					else
					{
						$desc = $content;
					}

					// news link.
					$link = (string)$item->link;
					// news time.
					$newDate = $newDate = date('l, F j, Y g:iA ', strtotime((string)$item->pubDate));

					//Storing values in array.
					$articles[] = array(
						'full_title' => $full_title,
						'title' => $title,
						'description' => $desc,
						'link' => $link,
						'dateNtime' => $newDate,
						'image' => $img_src,
					);
				}
				$records=$articles;
			}
		}


		$newsArr = $records;
		$news_arr = new \Zend_Session_Namespace('News_arr');
		$news_arr->list = $newsArr;

		$this->view->news=$newsArr;

	}
    

    public function setNewsTypeAsDefaultAction()
    {
    	$params=$this->_getAllParams();
   
    	$default_news_set = Extended\default_news::getDefaultNewsSetForUser(Auth_UserAdapter::getIdentity()->getId());

    	// if default news set for current user update entry else save new entry
    	if(!$default_news_set)
    	{
    	Extended\default_news::saveNewsDefault($params['news_type'],Auth_UserAdapter::getIdentity()->getId());
    	}
    	else
    	{
    	Extended\default_news::updateNewsDefault($params['news_type'],Auth_UserAdapter::getIdentity()->getId());
    	}
    	echo Zend_Json::encode(true);
    	die();
    }

    /**
     * Scrap various details from ibn news url for news detail page.
     * worked on updated ibn live url
     * @author hkaur5
	 * @author ssharma4
	 * @version 1.2
     * 
     */
    public function detailIbnAction()
    {
    	$params=$this->getRequest()->getParams();
		$page =	file_get_contents($params['link']);
    	//Parsing url page to scrap various elements required.
    	$doc = new DOMDocument();
		libxml_use_internal_errors(true);
		if($page)
		{
			$doc->loadHTML($page);
		}
		
		//Get heading of the news.
		$newsHeading = $doc->getElementsByTagName('h1');
		
	
		foreach($newsHeading as $heading) 
		{
			$this->view->heading = $heading->nodeValue;
			break;
		}

		//Get date of the news.
		$newsDate = $doc->getElementsByTagName('div');
		$xpath = new DOMXPath($doc);
		$newsDate = $xpath->query("//div[@class='clearfix']/div/span");
		foreach($newsDate as $date)
		{
			//Date may contain two values | seperated. Explode to get first value.
			$date_explode = explode('|', $date->nodeValue);

			//Remove text "posted on:".
			$date_filtered = preg_replace("/^First published: /", "",$date_explode[0]);
			//Changing date format to required format.
			$this->view->date = DateTime::createFromFormat( "M d, Y, H:i A T", trim($date_filtered) )->format("l, F j, h:iA");
		}

		//Get news image source value.
		$xpath = new DOMXPath($doc);
		$srcs = $xpath->query("//div[@class='articleimg']//img/attribute::src");

		$imgsrc = array();
		foreach ($srcs as $src)
		{
			$imgsrc[]=$src->value;
		}
		$this->view->img=$imgsrc;


		//Get news description.
		$xpath = new DOMXPath($doc);
		$news_paras = $xpath->query("//div[@id='article_body']//p");


		$parag = array();
		foreach ($news_paras as $news_para)
		{

			$parag[]=$news_para->nodeValue;
		}
		$this->view->paragNews=$parag;


		$introduction =  $xpath->query("//div[@class='intro']");
		foreach($introduction as $intro)
		{

			$this->view->introduction= $intro->nodeValue;

		}
		
    }
}









