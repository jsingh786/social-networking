<?php
/**
 * This is class is only for development and R&D purposes.
 * Not to be used in and site functionality.
 * -- should be removed or blocked before launch --
 *
 * @author jsingh7
 *
 */
class DevelopmentController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */

    }

	/**
     * Calculates the bitwise XOR product of two positive numbers.
     * Please note that $m should be smaller or equal to $n.
     * 
     * @param integer $x
     * @param integer $y
     * @version 1.0
     * @author jsingh7
     * @return integer
     */
    public static function getXORProduct( $m, $n ){
    	
    	if( $m <= $n ){
    		
    		//Get all numbers between $m to $n including $m and $n, in the form of array.
    		$all_numbers = array();
    		for ( $i=$m; $i<=$n; $i++ ){
    			
    			$all_numbers[] = $i;
    		}
    		
    		while (count($all_numbers) > 1) {
	    		
    			$all_numbers[0] = bindec( implode( '', self::getXOROfTwoIntegers( $all_numbers[0], $all_numbers[1] ) ) );
    			unset( $all_numbers[1] );
    			$all_numbers = array_values( $all_numbers );
    		}
    		
    		return $all_numbers[0];
    	}else{
    		
    		trigger_error('$m should be smaller or equal to $n', E_USER_ERROR );
    	}
    }
    
    /**
     * Accepts two positive integers and return array representation
     * for binary value after applying XOR operand on these two integers.
     * 
     * @param integer $a
     * @param integer $b
     * 
     * @author jsingh7
     * @version 1.0
     * @return binary represention in array format
     * 
     */
    public static function getXOROfTwoIntegers( $a, $b ){
    	
    	$final_array = array();
    	$a_array = str_split( decbin($a), 1 );
    	$b_array = str_split( decbin($b), 1 );
    	
    	if( count($a_array) > count($b_array) ){
    		
    		//Check the difference
    		$diff = count($a_array)-count($b_array);
    		
    		//Shifting smaller array with zeros to make both array size same. 
    		for( $i=0; $i<$diff; $i++ ){
    			
    			array_unshift( $b_array, 0 );
    		}
    		
    	}
    	else if ( count($a_array) < count($b_array) )
    	{
    		//Check the difference
    		$diff = count($b_array)-count($a_array);
    		
    		//Shifting smaller array with zeros to make both array size same. 
    		for( $i=0; $i<$diff; $i++ ){
    			
    			array_unshift( $a_array, 0 );
    		}
    	}
    	else 
    	{
    		//Both arrays are of same length
    		//No action item is required.
    	}
    	
    	//Now apply bitXOR operation on both binary numbers which are in array format rigth now.
    	//We will not use standard PHP XOR operand because it gives 1 XOR 1 = 1 but we need 0.
		foreach ( $a_array as $key=>$bit ){
			
			if($bit==$b_array[$key]){
				
				$final_array[$key] = 0;
			}else{
				
				$final_array[$key] = 1;
			}
		}		
		
		return $final_array;
    }
    
    
    /**
     * Accepts positive integer value and returns
     * binary value splited into array.
     *
     * @param integer
     * @author jsingh7
     * @version 1.0
     * @return array
     */
    public static function convertIntToBinaryArray( $integer ){
    	 
    	return str_split( decbin(12001), 1 );
    }
    
    public function indexAction()
    {
		
    }

    
    /* gets the data from a URL */
   public function get_data($url) {
    	$ch = curl_init();
    	$timeout = 5;
    	curl_setopt($ch, CURLOPT_URL, $url);
    	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    	curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
    	$data = curl_exec($ch);
    	curl_close($ch);
    	return $data;
    }
    
    
    
    
    /**
     * for getting filename of all the files present in the Enitites folder.
     * And return values in the $fileNames array.
     * 
     * @author SPATIAL
	 * @author jsingh7
     * @version 1.1
     *
     */
    public function generatedbAction()
    {
     	$entities_path = $_SERVER["DOCUMENT_ROOT"].'/'.PROJECT_NAME.'application/models/Entities/';
    	$d = dir($entities_path) or die("Wrong path: $entities_path");
		while (false !== ($entry = $d->read()))
		{
			if($entry != '.' && $entry != '..' && !is_dir($entry))
				$fileNames[] = str_replace(".php","",$entry);
		}

    	// generate database from model files...
    	$em = Zend_Registry::get('em');
    	$tool = new \Doctrine\ORM\Tools\SchemaTool($em);
    	foreach($fileNames as $key=>$v)
    	{
    		$filepaths = "Entities\\".$v;
    		$classes = array(
    				$em->getClassMetadata($filepaths)
    	);
    		$tool->createSchema($classes);
    	}
    	
    	$d->close();
    	 
    	echo "<h2 style ='color:green'>Tables generated successfully.</h2><br>";
    	echo "<img src = '".IMAGE_PATH."/doctrine2.png'><br>";
    	echo "<h3>Want to know more about Doctrine-2 ORM?<br> Visit : <a href ='http://doctrine-orm.readthedocs.org/en/latest/'>http://doctrine-orm.readthedocs.org/en/latest/</a><h3>";

    	die;
    }

    /**
     * Generates proxies when to run on production mode.
     * i.e autogenerateproxies false.
     * @author jsingh7
     *
     */
     public function generateProxiesAction()
     {
     	$em = Zend_Registry::get('em');
    	$proxyFactory = $em->getProxyFactory();
     	$metadatas = $em->getMetadataFactory()->getAllMetadata();
     	$proxyFactory->generateProxyClasses($metadatas, APPLICATION_PATH . '/models/Proxies');
    	
     	echo "<h2 style ='color:green'>Your doctrine proxies has been created.</h2>";
		
 		echo "<img src = '".IMAGE_PATH."/doctrine.png'>";

 		echo "<h3>What are doctrine proxies?";
     	echo "<h3>A Doctrine proxy is just a wrapper that extends an entity class to provide Lazy Loading for it.

 By default, when you ask the Entity Manager for an entity that is associated with another entity, the associated entity won't be loaded from the database, but wrapped into a proxy object. When your application then requests a property or calls a method of this proxied entity, Doctrine will load the entity from the database (except when you request the ID, which is always known to the proxy).

 This happens fully transparent to your application due to the fact that the proxy extends your entity class.

 Doctrine will by default hydrate associations as lazy load proxies if you don't JOIN them in your query or set the fetch mode to EAGER.

    	<h3>";

     	echo "<img src = '".IMAGE_PATH."/doctrine_lazy_loading.png'>";
    	
 		echo "<h3>Want to know more about doctrine proxy classes?<br> Visit : <a href ='http://doctrine-orm.readthedocs.org/en/latest/reference/advanced-configuration.html'>http://doctrine-orm.readthedocs.org/en/latest/reference/advanced-configuration.html</a><h3>";
		
     	die;
    }

    /**
     * Use this when using autogenerateproxies false,
     * After altering that database.
     *
     * @author jsingh7
     *
     */
   public function clearApcCacheAction()
     {
     	/*$cacheDriver = new \Doctrine\Common\Cache\ApcCache();
 		$cacheDriver->flushAll();*/
		
    	apc_clear_cache();
    	
 		echo "<h2 style ='color:green'>Your APC cache has been cleared for doctrine.</h2>";
		
 		echo "<h3>Want to know more about APC cache?<br> Visit : <a href ='http://php.net/manual/en/book.apc.php'>http://php.net/manual/en/book.apc.php</a><h3>";
		
 		echo "<img src = '".IMAGE_PATH."/php-apc-cache.png'>";
 		die;
     }

    public function generateAnnotationsFromYamlAction()
    {
    	// bootstrap.php
    	require_once "vendor/autoload.php";
    	
    	$em = Zend_Registry::get('em');
    	
    	$paths = array("/path/to/yml-mappings");
    	$config = Setup::createYAMLMetadataConfiguration($paths, $isDevMode);
    	$entityManager = $em::create($dbParams, $config);
    }
    
    public function extractPharAction()
    {
    	$phar = new Phar( 'composer.phar' );
    	$pgz = $phar->convertToExecutable(Phar::ZIP);
    	die;
    }
    
    public function generateSingleTableAction()
    {
    	$em = Zend_Registry::get('em');
    	
    	// 		$classes = array(
    	// 				$em->getClassMetadata('Entities\ilook_user')
    	// 		);
    	// 		$tool = new \Doctrine\ORM\Tools\SchemaTool($em);
    	// 		$tool->createSchema($classes);
    
    	// 		$dql = 'SELECT a FROM \Entities\Taaa a';
    	// 		$data=$em->createQuery($dql)
    	// 		->getResult();
    
    	// 		$user = new \Entities\Taaa;
    	// 		$user->setTitle('dlverma25@gmail.com');
    	// 		$em->persist($user);
    
    	// 		$em->flush();
    
    	// 		\Entities\extended_ilook_user::createUser("fwerf", "erwtret", "rtertre", "rtertre", 1, \Entities\extended_ilook_user::USER_CREATED_FROM_ILOOK );
    	//     	$obj1 = $em->find('\Entities\ilook_user', 2);
    	//     	$em->remove($obj1);
    	//     	$em->flush();
    
    	die;
    }

    public function softDeleteTestAction()
    {
    	// action body
    	$this->view->headTitle()->append('Soft Delete Test');
    	$em = Zend_Registry::get('em');
    	/******************** Create Table ******************/
    	//     	$tool = new \Doctrine\ORM\Tools\SchemaTool($em);
    	//     	$classes = array(
    	// 			$em->getClassMetadata('Entities\country_ref')
    	//     	);
    	//     	$tool->createSchema($classes);
    	/******************** --End Create Table ******************/
    
    	//     	$em->insert('ilook_user', array('username' => 'Jaskaran'));
    	//     	INSERT INTO user (username) VALUES (?) (jwage)
    
    	/******************* Save Table ******************/
    	//     	$country_ref = new \Entities\country_ref;
    	//     	$country_ref->setCode("abc");
    	//     	$country_ref->setName("jaskaran");
    	//     	$country_ref->setStatus(1);
    	//     	$em->persist($country_ref);
    	//     	$em->flush();
    	/******************** --End Save Table ******************/
    	  
    	/******************** Delete Table ******************/
    	//$em->getFilters()->enable('soft-deleteable');
    	//     	$country_ref = $em->find('Entities\country_ref', 3);
    	//     	$em->remove($country_ref);
    	//     	$em->flush();
    	/******************** --End Delete Table ******************/
    	die;
    }

    public function testingAction()                   
    {
    	echo version_compare('1.1', '1.1.1');
    	
    	die;
/*$html = '<img id="12" border="0" src="/imagess/image.jpg"
         alt="Image" width="100" height="100" />hjgdsjajgjsdgsgdjhsdagsj';
$doc = new DOMDocument();
libxml_use_internal_errors(true);
$doc->loadHTML($html); // loads your html
$xpath = new DOMXPath($doc);
$nodelist = $xpath->query("//img"); // find your image
Zend_Debug::dump( $nodelist);
die;
$node = $nodelist->item(0); // gets the 1st image
$value = $node->attributes->getNamedItem('src')->nodeValue;
echo "src=$value\n"; // prints src of image
    	die;*/
    	/**include('../library/simplehtmldom_1_5(1)/simple_html_dom.php');
		 // RAY_temp_rgrodgers.php
		error_reporting(E_ALL);
		
		// ACQUIRE THE RSS FEED AND MAKE AN OBJECT
// 		$url = 'http://rss.jobsearch.monster.com/rssquery.ashx?q=uk';
// 		$url = 'http://feeds.feedburner.com/NdtvNews-TopStories?format=xml';
		$url = 'http://www.ibnlive.com/rss/india.xml';
	//	$url = 'http://feeds.bbci.co.uk/news/business/rss.xml';
		
		$xml = file_get_contents($url);
		$obj = SimpleXML_Load_String($xml);
		
		// ACTIVATE THIS TO SEE THE ENTIRE OBJECT
		// echo '<pre>';
// 		var_dump($obj->channel);
// 		die;
		// REVEAL SOME OF THE PROPERTIES OF THE OBJECT
		$t = (string)$obj->channel->title;
		$d = (string)$obj->channel->pubDate;
		echo '<h2>' . $t . ' PUBLISHED ON ' . $d . '</h2>';
		
		$i = 0;
		// REVEAL SOME OF THE PROPERTIES OF THE ITEMS
		foreach ($obj->channel->item as $item)
		{
		    $t = $item->title;
		    $l = $item->link;
		    $url = $l;
		  	
		    
// 			$html = file_get_html( $url);
// 			$image_container = $html->find('img#story_image_main', 0);
// 			if(!$image_container)
// 			{
// 				$image_container = $html->find('img[alt*='.$item->title.']', 0);
				
// 				if(!$image_container)
// 				{
// 					$image_container = $html->find('img.caption', 0);
// 				}
// 			}
			
				
// 			echo "<div style='width:100px;hieght:100px' class='image_news'>".$image_container."</div>";
		    
		    $d = $item->description;
		    $a = '<a target="_blank" href="'
		       . $l
		       . '">'
		       . $t
		       . '</a>'
		       ;
		    echo '<p>' . $a . '<br/>' . PHP_EOL;
		    echo $d;
		    echo '</p>' . PHP_EOL;
		    $i++;
		
		    
		}
die;*/
    	//=======Disable FATAL Errors!============
    	ini_set('display_errors',0);
    	//========================================
    	 
    	$url = 'http://www.ibnlive.com/rss/india.xml';
    	
    			$xml = file_get_contents($url);
		$obj = SimpleXML_Load_String($xml);
		
		// ACTIVATE THIS TO SEE THE ENTIRE OBJECT
		// echo '<pre>';
		// REVEAL SOME OF THE PROPERTIES OF THE OBJECT
		$t = (string)$obj->channel->title;
		$d = (string)$obj->channel->pubDate;
		echo '<h2>' . $t . ' PUBLISHED ON ' . $d . '</h2>';
		
		$i = 0;
	
//     	Zend_Debug::dump($data);
//     	die;
    	if( $obj->channel )
    	{
    		if( $obj->channel->item )
    		{
    				// REVEAL SOME OF THE PROPERTIES OF THE ITEMS
				foreach ($obj->channel->item as $item)
				{
    				$full_title = $item->title;
//     				echo $full_title;
//     				echo "<br>";
//     				continue;
    				 
    
    						// title..
    							
//     						$full_title = $item->title;
//     						echo $item->title;
//     						continue;
    						if(strlen((string)$item->title)>30)
    						{
    							$title=substr((string)$item->title,0,30)."..";
    						}
    						else
    						{
    							$title= (string)$item->title;
    						}
    						// desc..
    						if(strlen((string)$item->description))
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
    							
    							$desc = Helper_common::showCroppedText($content, 180);
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
    						$articles[] = array(
    								'full_title' => $full_title,
    								'title' => $title,
    								'description' => $desc,
    								'link' => $link,
    								'dateNtime' => $newDate,
    								'image' => $img_src,
    								'videoImg' =>$videoimg
    						);
    			}
    			$records=$articles;
    		}
    	}
    //	Zend_Debug::dump($records);
//     	die;
    	
    	$newsArr = $records;
    	$news_arr = new \Zend_Session_Namespace('News_arr');
    	$news_arr->list = $newsArr;
    	
    	$this->view->news=$newsArr;
      }

    public function createImailsBasicFoldersAction()
    {
    	/*user ImailsBasicFolders automaically generates when user signup, that is before activation.*/
    	$param = $this->getRequest()->getParams();
    	Extended\user_folder::createBasicUserFolders($param['id']);
    	die;
    } 
    
    public function activateUserAction()
    {
    	\Extended\ilook_user::updateUserStatus($this->getRequest()->getParam("user_id"), \Extended\ilook_user::USER_STATUS_ACTIVE);
		die;
    }

    public function deactivateUserAction()
    {
    	\Extended\ilook_user::updateUserStatus($this->getRequest()->getParam("user_id"), \Extended\ilook_user::USER_STATUS_INACTIVE );
		die;
    }

    public function deleteUserAction()
    {
    	\Extended\ilook_user::softDeleteUser($this->getRequest()->getParam("user_id"));
    	\Extended\ilook_user::hardDeleteUser($this->getRequest()->getParam("user_id"));
    	\Extended\ilook_user::deleteLuceneIndex($this->getRequest()->getParam("user_id"));
    	die;
    }

    public function softdeleteUserAction()
    {
    	
    	 \Extended\ilook_user::softDeleteUser($this->getRequest()->getParam("user_id") );
    	 die;
    }
    
    public function harddeleteUserAction()
    {
    	\Extended\ilook_user::hardDeleteUser( $this->getRequest()->getParam("user_id") );
    	die;
    }

    public function phpinfoAction()
    {
    	 
    	phpinfo();
    	die;
    }

    /**
     * Returns count of inbox messages of a user
     * for each message type
     * 
     * 
     *  @author RSHARMA
     *  @version 1.0
     *
     */
    public function getCountsAction()
    {
    	// action body
    	$cnt = \Extended\message::getMailCounts(Auth_UserAdapter::getIdentity()->getId());
    	$cnt_arr = array(); // creating a new array to make msg_type as the key of each sub array
    	foreach($cnt as $count){
    		$cnt_arr[$count['message_type']] = $count;
    	}
    	echo Zend_Json::encode($cnt_arr);
    	die;
    }

    public function getResultForLuceneQueryAction()
    {
//     	$index = Zend_Search_Lucene::open('lucene_file_system_users');
//     	$indexSize = $index->count();
//     	$documents = $index->numDocs();
//     	//Zend_Debug::dump( $documents );
    	
//     	for ($count = 0; $count < $index->maxDoc(); $count++) 
//     	{
//     		if ($index->isDeleted($count)) {
//     			continue;
//     		}
//     		else
//     		{
//     			Zend_Debug::dump($index);
//     		}	
//     	}
//     	die;

    	echo "Lucene Query results<br>";
    	Zend_Debug::dump( \Extended\ilook_user::getUsersForLuceneQuery("email:jsingh7@seasiaconsulting.com" ) );
    	die;
    }

    public function getNoteAction()
    {
    	 
// 		print_r(stream_get_contents( \Extended\notes::getNote(  122, 19 ) ));
	    die;
 
    }

    public function getAllNotesAction()
    {
    	$notes = Extended\notes::getAllNotes( Auth_UserAdapter::getIdentity()->getId() );
    	foreach ( $notes as $note )
    	{
    		echo stream_get_contents( $note->getUser_note() );
    		echo "<br>";
    	}
// 		Zend_Debug::dump( Extended\notes::getAllNotes( Auth_UserAdapter::getIdentity()->getId() ) );
	    die;
    }

    public function filteredAlbumsAction()
    {
    	$fa = Extended\socialise_album::getAlbums(20, 19);
    	Zend_Debug::dump($fa);
    	die;	
    }

    public function getAlbumFolderAction()
    {
		echo Extended\socialise_photo::isPhotoBelongsToDefaultAlbum(4);
		die;
    }

    public function getCoverPhotoAction()
    {
		$cover = Extended\socialise_photo::getCover(15);
		Zend_Debug::dump($cover);
	
		die;
    }

    public function deletephototestingAction()
    {
		\Extended\socialise_photo::deletePhoto("2106");
		die;
    }

    public function getJobLocationAction()
    {
		Helper_common::getCityStateCountryOfAJob(1027);
    }

    public function jobAppliedByMeAction()
    {
		if(Extended\job_applications::isJobAppliedByMe( 1054, 19 ))
		{
			echo 'true';
		}
		else 
		{
			echo 'false';
		}
		die;
    }

    public function tempTableExperimentAction()
    {
		\Extended\message::getSearchedInboxOfUser(19, a, null, null, 1);
		die;
    }

    /**
     * Action having banner
     * of work in progress.
     * 
     * 
     * @author jsingh7
     */
    public function wIPAction()
    {
        // action body
    }
    
	public function testingNotificationInfoAction()
	{
		$notificationObj = \Extended\notifications::getNotificationInfoForUser(34);
		
		$notification_arr = array();
		foreach( $notificationObj as $notification)
		{
			$notification_arr['text'] = $notification->getNotification_text();
			$notification_arr['notification_for'] = $notification->getForIlookUser()->getFirstname();
			$notification_arr['notification_about'] = $notification->getAboutIlookUser()->getFirstname();
			$notification_arr['type'] = $notification->getNotificationType()->getname();
		}
		Zend_Debug::dump($notification_arr);
		die;
	}

	public function testingRegexAction()
	{
		echo Helper_common::makeHyperlinkClickable('hi to all http://localhost/ilook/dashboard');
		die;
	}
	
	public function testingOverloadingAction()
	{
// 		$foo = new \Extended\notifications ;
// 		$a  = $foo->test("hello");
		 
// 		die;
		
// 		Zend_Debug::dump(Helper_common::getUserProfessionalInfo(33));
		echo \Extended\socialise_album_custom_privacy::deleteViewerfromCustomViewersList(19,12);
		die;
// 		$foo = new \Extended\notifications ;
// 		 $a  = $foo->test("hello");
		 
	}
	public function testingCascadeAction()
	{
		\Extended\wall_post::deleteWallpost(2628);
		die;
	}
	public function testingimageAction()
	{
		die;
	}
	
	public function validationTestAction()
	{
		
		Zend_Debug::dump(\Extended\socialise_album::getCountOfAlbum(19));
	}
	
	public function testemailAction()
	{
		if(\Email_MailerPHP::sendMail("test mail", "test new message", "Shilpi","shlpjaiswal7@gmail.com"))
		{ echo "mail sent";
		}
		die;
	}
	
	public function softDeleteAction()
	{
		$em = \Zend_Registry::get('em');
		
// 		foreach ($evm->getListeners() as $listeners) {
// 			foreach ($listeners as $listener) {
// 				if ($listener instanceof SoftDeleteableListener) {
// 					$this->listener = $listener;
// 					Zend_Debug::dump($listener);
// 					break 2;
// 				}
// 			}
// 		}
		
// 		if ($this->listener === null) {
// 			throw new \RuntimeException('Listener "SoftDeleteableListener" was not added to the EventManager!');
// 		}
		
// 		die;
		
		//$em->getFilters()->disable('soft-deleteable');
		
		$art = $em->getRepository('\Entities\test_soft_delete')->findOneBy( array('name' => 'Jaskaran') );
		
		Zend_Debug::dump( $art );
		die;
			
// 		$em->remove($art);
// 		$em->flush();
		
		
// 		$obj = new \Entities\test_soft_delete();
// 		$obj->setName("Jaskaran");
// 		$em->persist($obj);
// 		$em->flush();
// 		$em->getConnection()->close();
		
		die;
	}
	
	
	public function __call($method_name , $parameter)
	{
		if($method_name == "overlodedFunction") //Function overloading logic for function name overlodedFunction
		{
			$count = count($parameter);
			switch($count)
			{
				case "1":
					//Business log in case of overlodedFunction function has 1 argument
					print_r($parameter);
					break;
				case "2": //Incase of 2 parameter
					echo "You are passing 2 parameter";
					break;
				default:
					throw new exception("Bad argument");
			}
		}
		else
		{
			throw new exception("Function $method_name does not exists.");
		}
	}
	
	public function testingpeopleyoumayknowAction()
	{
		 
		//Start of people you may know section================
		$loggedin_user = Auth_UserAdapter::getIdentity ();
		// Start of People you may know for school section
		$edu_dtls = $loggedin_user->getUsersEducation();
		$getLinkRequestSent = \Extended\link_requests::getLinkRequestSenderOrReceiver ( $loggedin_user->getId() );
		if( @$getLinkRequestSent )
		{
			$requests_id = array ();
			foreach ( $getLinkRequestSent as $key => $r )
			{
				if( $r['accept_user_id'] )
				{
					$requests_id [] = $r['accept_user_id'];
				}
				else if( $r['request_user_id'] )
				{
					$requests_id [] = $r['request_user_id'];
				}
			}
		}
		
		$myEduSchoolIds = array ();
		$users_with_same_school = array();
		$requests_id = array ();
		if( $edu_dtls->toArray() )
		{
			foreach ( $edu_dtls as $ed )
			{
				$myEduSchoolIds [] = $ed->getEducation_detailsSchool()->getId ();
			}
		
				
		}
		
		
		// Start of People you may know for experience section
		$exp_dtls = $loggedin_user->getUsersExperience();
		$myExpCompanyIds = array();
		$requests_id = array ();
		$users_with_same_company = array();
		if( $exp_dtls->toArray() )
		{
			foreach ( $exp_dtls as $exp )
			{
				$myExpCompanyIds[] = $exp->getExperiencesCompany()->getId ();
			}
		}
		$getLinkRequestSent = $getLinkRequestSent?$getLinkRequestSent:null;
		$myExpCompanyIds = $myExpCompanyIds?$myExpCompanyIds:null ;
		$myEduSchoolIds = $myEduSchoolIds?$myEduSchoolIds:null ;
		
		$peopleYouMayKnow = Extended\ilook_user::getUsersYouMayKnow($myExpCompanyIds,$myEduSchoolIds,$loggedin_user->getId(),$getLinkRequestSent);
// 		echo count($peopleYouMayKnow);
// 		die;
		foreach( $peopleYouMayKnow as $youMayKnow )
		{
			echo $youMayKnow['id'];
			echo "<br>";
		}
		die;
	}
	
	function getDateForSpecificDayBetweenDates($startDate, $endDate, $weekdayNumber)
	{
		$startDate = strtotime($startDate);
		$endDate = strtotime($endDate);
		 
		$dateArr = array();
		 
		do
		{
			if(date("w", $startDate) != $weekdayNumber)
			{
				$startDate += (24 * 3600); // add 1 day
			}
		} while(date("w", $startDate) != $weekdayNumber);
		 
		 
		while($startDate <= $endDate)
		{
			$dateArr[] = date('Y-m-d', $startDate);
			$startDate += (7 * 24 * 3600); // add 7 days
		}
		 
		return($dateArr);
	}
	
	public function imageTestAction()
	{
		ob_start ();
		
		imagejpeg ( Helper_ImageResizer::smart_resize_image( 'Tulips.png', null, 100, 60, true, 'return', false) );
		$image_data = ob_get_contents ();
		
		ob_end_clean ();
		
		echo base64_encode();
		die;
		
		die;
	}
	
	public function downFileAction()
	{
		ignore_user_abort(true);
		set_time_limit(0); // disable the time limit for this script
		
		$path = "workbench.zip"; // change the path to fit your websites document structure
		$dl_file = preg_replace("([^\w\s\d\-_~,;:\[\]\(\].]|[\.]{2,})", '', $_GET['download_file']); // simple file name validation
		$dl_file = filter_var($dl_file, FILTER_SANITIZE_URL); // Remove (more) invalid characters
		$fullPath = $path.$dl_file;
		
		if ($fd = fopen ($fullPath, "r")) {
			$fsize = filesize($fullPath);
			$path_parts = pathinfo($fullPath);
			$ext = strtolower($path_parts["extension"]);
			switch ($ext) {
				case "pdf":
					header("Content-type: application/pdf");
					header("Content-Disposition: attachment; filename=\"".$path_parts["basename"]."\""); // use 'attachment' to force a file download
					break;
					// add more headers for other content types here
				default;
				header("Content-type: application/octet-stream");
				header("Content-Disposition: filename=\"".$path_parts["basename"]."\"");
				break;
			}
			header("Content-length: $fsize");
			header("Cache-control: private"); //use this to open files directly
			while(!feof($fd)) {
				$buffer = fread($fd, 2048);
				echo $buffer;
			}
		}
		fclose ($fd);
		exit;
	}
	
	/**
	 * jqueryNailThumb testing inside view file.
	 * 
	 * @author jsingh7
	 */
	public function jqueryNailThumbAction()
	{
		
	}
	
	/**
	 * jqueryFileUpload testing action 1.
	 * 
	 * @author jsingh7
	 */
	public function jqueryFileUploadAction()
	{

	}
	
	/**
	 * jqueryFileUpload testing action 2.
	 *
	 * @author jsingh7
	 */
	public function uploadFileAction()
	{
		$upload_handler = new Jqueryfileuploader_uploadhandler(
				array(
						'script_url' => PROJECT_URL.'/'.PROJECT_NAME.'development/upload-file',
						'upload_dir' => SERVER_PUBLIC_PATH.'/temp/imagesss/',
						'upload_url' => PUBLIC_PATH.'/temp/imagesss/',
						'user_dirs' => false,
						'mkdir_mode' => 0755,
						'param_name' => 'files',
						// Set the following option to 'POST', if your server does not support
						// DELETE requests. This is a parameter sent to the client:
						'delete_type' => 'DELETE',
						'access_control_allow_origin' => '*',
						'access_control_allow_credentials' => false,
						'access_control_allow_methods' => array(
								'OPTIONS',
								'HEAD',
								'GET',
								'POST',
								'PUT',
								'PATCH',
								'DELETE'
						),
						'access_control_allow_headers' => array(
								'Content-Type',
								'Content-Range',
								'Content-Disposition'
						),
						// Enable to provide file downloads via GET requests to the PHP script:
						//     1. Set to 1 to download files via readfile method through PHP
						//     2. Set to 2 to send a X-Sendfile header for lighttpd/Apache
						//     3. Set to 3 to send a X-Accel-Redirect header for nginx
						// If set to 2 or 3, adjust the upload_url option to the base path of
						// the redirect parameter, e.g. '/files/'.
						'download_via_php' => false,
						// Read files in chunks to avoid memory limits when download_via_php
						// is enabled, set to 0 to disable chunked reading of files:
						'readfile_chunk_size' => 10 * 1024 * 1024, // 10 MiB
						// Defines which files can be displayed inline when downloaded:
						'inline_file_types' => '/\.(gif|jpe?g|png)$/i',
						// Defines which files (based on their names) are accepted for upload:
// 						'accept_file_types' => '/.+$/i',
						'accept_file_types' => '/\.(gif|jpe?g|png)$/i',
						// The php.ini settings upload_max_filesize and post_max_size
						// take precedence over the following max_file_size setting:
						'max_file_size' => null,
						'min_file_size' => 1,
						// The maximum number of files for the upload directory:
						'max_number_of_files' => null,
						// Defines which files are handled as image files:
						'image_file_types' => '/\.(gif|jpe?g|png)$/i',
						// Use exif_imagetype on all files to correct file extensions:
						'correct_image_extensions' => false,
						// Image resolution restrictions:
						'max_width' => null,
						'max_height' => null,
						'min_width' => 1,
						'min_height' => 1,
						// Set the following option to false to enable resumable uploads:
						'discard_aborted_uploads' => true,
						// Set to 0 to use the GD library to scale and orient imagess,
						// set to 1 to use imagick (if installed, falls back to GD),
						// set to 2 to use the ImageMagick convert binary directly:
						'image_library' => 1,
						// Uncomment the following to define an array of resource limits
						// for imagick:
						/*
						 'imagick_resource_limits' => array(
						 		imagick::RESOURCETYPE_MAP => 32,
						 		imagick::RESOURCETYPE_MEMORY => 32
						 ),
				*/
						// Command or path for to the ImageMagick convert binary:
						'convert_bin' => 'convert',
						// Uncomment the following to add parameters in front of each
						// ImageMagick convert call (the limit constraints seem only
						// to have an effect if put in front):
						/*
						 'convert_params' => '-limit memory 32MiB -limit map 32MiB',
				*/
						// Command or path for to the ImageMagick identify binary:
						'identify_bin' => 'identify',
						'image_versions' => array(
								// The empty image version key defines options for the original image:
								'' => array(
										// Automatically rotate imagess based on EXIF meta data:
										'auto_orient' => true
								),
								// Uncomment the following to create medium sized imagess:
								/*
								 'medium' => array(
								 		'max_width' => 800,
								 		'max_height' => 600
								 ),
				*/
								'thumbnail' => array(
										// Uncomment the following to use a defined directory for the thumbnails
										// instead of a subdirectory based on the version identifier.
										// Make sure that this directory doesn't allow execution of files if you
										// don't pose any restrictions on the type of uploaded files, e.g. by
										// copying the .htaccess file from the files directory for Apache:
										//'upload_dir' => dirname($this->get_server_var('SCRIPT_FILENAME')).'/thumb/',
										//'upload_url' => $this->get_full_url().'/thumb/',
										// Uncomment the following to force the max
										// dimensions and e.g. create square thumbnails:
										'crop' => true,
										'max_width' => 80,
										'max_height' => 80
								)
						),
						'print_response' => true
				)
			);
		die;
	}
	
	
	public function dataTableAction(){
	
	/* 	$row = array();
		
		$output = array(
				"iTotalRecords" => 34,
				"iTotalDisplayRecords" => 34,
				"aaData" => array()
		);
		
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select( 'usr' )
		->from( '\Entities\company', 'usr' );
		
		//Zend_Debug::dump($q_1->getQuery()->getSQL());
		
		echo Zend_Json::encode(
				DataTable_Helper::generateDataTableResponse($q_1,
						$this->getRequest()->getParams(),
						array("__identifier" =>'id','name'),
						array(
		
						),
						array(
								"id" => array(
										"alias"=>"id",
										"fieldName"=>"id"),
								"name" => array(
										"alias"=>"name",
										"fieldName"=>"name"),
						)
				));
		die();
			 */
	
      // Zend_Debug::dump($q_1);
		
		/* foreach($sessions as $session){
			$row[] = "test";
		
			$row[] = "test2";
			$row[] = "test3";
			$output['aaData'][] = $row;
			$row = array();
		}
		echo json_encode( $output ); */
		
	}
	
	
	public function dataTableRecordsAction()
	{
		$get = $this->getRequest()->getParams();
	
		
		$table_name = '\Entities\country_ref';
		$table_columns = array( 'ilook_usr.id', 'ilook_usr.name' );
		
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select( implode(',', $table_columns) )
		->from($table_name, 'ilook_usr');
		
		//filter query
		$qb_2 = $em->createQueryBuilder();
		$q_2 = $qb_2->select( "count(ilook_usr.id)" )
		->from($table_name, 'ilook_usr');
		

		$rResult = DataTable_Helper::ajaxTable($get, true, $q_1, $table_columns )->getArrayResult();

		
		/* Data set length after filtering */
// 		$iFilteredTotal = count($rResult);
		
		/*
		 * Output
		*/
		$output = array(
				"sEcho" => intval($get['sEcho']),
				"iTotalRecords" => DataTable_Helper::getCount($get, $q_1, $table_columns),
				"iTotalDisplayRecords" => DataTable_Helper::getFilteredCount($get, $q_2, $table_columns),
				"aaData" => array()
		);
		
// 		Zend_Debug::dump($rResult);
// 		die;
		
		foreach($rResult as $keyy=>$aRow)
		{
			$row = array();
// 			for ( $i=0 ; $i<count($columns) ; $i++ )
// 			{
// 				if ( $columns[$i] == "version" )
// 				{
// 					/* Special output formatting for 'version' column */
// 					$row[] = ($aRow[ $columns[$i] ]=="0") ? '-' : $aRow[ $columns[$i] ];
// 				}
// 				elseif ( $columns[$i] != '' )
// 				{
// 					/* General output */
// 					$row[] = $aRow[ $columns[$i] ];
// 				}
// 			}

			foreach ( $aRow as $keyyy=>$data )
			{
				$row[$keyyy] = $data;
			}
			$row['checkbox'] = "<input type = 'checkbox' value = '".$aRow['id']."' class = 'datatableCB' id = ''/>";
			
			$output['aaData'][] = $row;
		}
		
		unset($rResult);

		echo Zend_Json::encode($output);
		
		die;
	}
	public function christmasTreeAction()
	{
		define('NUM',5);

		for( $k = NUM-1 ; $k>=1; $k--) {
		  for($i=1;$i<=$k ;$i++ ) {  // 6,5,4,3,2,1
		    echo '&nbsp;';
		  }
		  $i--;
		  for($j=1 ; $j<=NUM-$i ; $j++) {// 1,2,3,4,5,6
		    echo '#';
		  }
		  echo "<br>\n";
		}
		define('NUM2',7);
		
		for( $k = NUM2-1 ; $k>=1; $k--) {
			for($i=1;$i<=$k ;$i++ ) {  // 6,5,4,3,2,1
				echo '&nbsp;';
			}
			$i--;
			for($j=1 ; $j<=NUM2-$i ; $j++) {// 1,2,3,4,5,6
				echo '#';
			}
			echo "<br>\n";
		}

		define('NUM3',9);
		
		for( $k = NUM3-1 ; $k>=1; $k--) {
			for($i=1;$i<=$k ;$i++ ) {  // 6,5,4,3,2,1
				echo '&nbsp;';
			}
			$i--;
			for($j=1 ; $j<=NUM3-$i ; $j++) {// 1,2,3,4,5,6
				echo '#';
			}
			echo "<br>\n";
		}
		die;
	}
	
	public function manageUsersAction()
	{
		// Update last login time of user after login.
// 		$datetime=new \DateTime();
		
// 		$em = \Zend_Registry::get('em');
// 		$ilook_user_obj = $em->find('Entities\ilook_user',3);
// 		$ilook_user_obj->setLast_login($datetime);
// 		$em->persist($ilook_user_obj);
// 		$em -> flush();
// 		die;
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select( 'ussr' )
		->addSelect( "ussr.id as idd" )
// 		->addSelect( "usr.firstname as first_name" )
// 		->addSelect( "usr.lastname as last_name" )
// 		->addSelect( "CONCAT( CONCAT(usr.firstname, ' '), usr.lastname) as user_full_name" )
// 		->addSelect( "usr.username as user_name" )
// 		->addSelect( "usr.created_at as acc_created_at" )
// 		->addSelect( "usr.deleted_at as acc_deleted_at" )
// 		->addSelect( "login_smry.login_time as last_login_time" )
		
		->from( '\Entities\ilook_user', 'ussr' );
		$q_1->leftJoin( 'ussr.usersLogin_summary', 'logsmry' );


		$q_1->setFirstResult(0);
		$q_1->setMaxResults(10);
	
		$q_1->orderBy( 	'ussr.id', 'ASC' );
		
		Zend_Debug::dump( $q_1->getQuery()->getResult() );
		die;
	}
	
	/**
	 * Add provided users as to_users of
	 * given post
	 * 
	 * @author hkaur5
	 *  
	 */
	 public function  addToUserForWallposts()
	 {
	 	$wallpost_ids = array();
	 	
	 	foreach($wallpost_ids as $wallpost_id )
	 	{
			\Extended\posted_to::addToUserOfWallpost($wallpost_id, $ilook_user_id);
	 	}
	 }
	 
	
	 
	 /**
	  * Creates thumbnails (popup, gallery[smart-resize], wall) and temp directories
	  * where it stores all the thumnails after that it create another user directory
	  * if it already does not exist and creates album_albumName directorry inside that.
	  * After that it copy all the temp directories in album directory.
	  * It calls function to photos in database and returns latest image being inserted in album.
	  * @author hkaur5
	  * @return array
	  *
	  */
	 public function addPhotosInExistingAlbumTestAction()
	 {
	 	$this->_helper->layout ()->disableLayout ();
	 	$this->_helper->viewRenderer->setNoRender ( true );
	 
	 	$handle = fopen ( 'php://input', 'r' );
	 	$jsonInput = fgets ( $handle );
	 	//   		$params = Zend_Json::decode ( $jsonInput );
	 	$params = $this->getRequest()->getParams();
	 
	 	$id = $params['current_user_id'];
	 

 		$num_files = count($_FILES['myfile']['name']);
 		//Loop through files ($_FILES) being uploaded.
 		for( $i=0; $i < $num_files; $i++ )
 		{
 
 			$name = $_FILES["myfile"]["name"][$i];
 			$temp_path = $_FILES['myfile']['tmp_name'][$i];
 			$image_name = Helper_common::getUniqueNameForFile( $name );
 
 			// Set upload image path
 			$temp_folder = REL_IMAGE_PATH.'/android_temp_imagess/'.$image_name;
 						
 			move_uploaded_file($temp_path, $temp_folder);
 		}
	 				
	 					
	 	
	 	$code = 200;
	 	$msg = "imagess uploaded successfully!";
	 	$result = "";
	 	echo Helper_common::successFailureMsgs($code,$msg,$result);
	 	exit();
	 }
	 
	 public function uploadSkillsAction()
	 {
	 	// This is the file path to be uploaded. 
	 	$inputFileName = 'ilook-Skills.xlsx';
	 	try { $objPHPExcel = PHPExcel_IOFactory::load($inputFileName); } 
	 	catch(Exception $e) { die('Error loading file "'.pathinfo($inputFileName,PATHINFO_BASENAME).'": '.$e->getMessage());
	 	 } 
	 	 $allDataInSheet = $objPHPExcel->getActiveSheet()->toArray(null,true,true,true); 
	 	 
	 	 foreach ($allDataInSheet as $key=>$sk)
	 	 {
	 	 	if( !\Extended\skill_ref::getRowObjectByColumn('skill', $sk['A']) )
	 	 	{
			 	 $em = \Zend_Registry::get('em');
			 	 $obj = new \Entities\skill_ref();
			 	 $obj->setDescription(null);
			 	 $obj->setSkill( $sk['A'] );
			 	 $obj->setStatus(1);
			 	 $obj->setIlook_user_id(1);
				$em -> persist($obj);
				$em->flush();
	 	 	} 	 
	 	 }
	 }

// 	 public static function solution($X, $A)
// 	 {
// 	 	$leftSame = 0;
// 		$rightSame = 0;
// 		$leftDiff = 0;
// 		$rightDiff = 0;
// 		$index = 0;
		
// 		for($i = 0; $i < count ( $A ); $i ++) {
// 			if ($A [$i] == $X) {
// 				$leftSame += 1;
// 			} else {
// 				$leftDiff += 1;
// 			}
			
// 			if ($i > ((count ( $A ) - 1) - $i)) {
// 				break;
// 			}
			
// 			if ($A [(count ( $A ) - 1) - $i] == $X) {
// 				$rightSame += 1;
// 			} else {
// 				$rightDiff += 1;
// 			}
			
// 			if ($leftSame == $rightDiff) {
// 				$index = $i;
// 			}
			
// 			if ($leftDiff == $rightSame) {
// 				$index = count ( $A ) - 1 - $i;
// 			}
// 		}
		
// 		return $index;
// 	}
	
	
	function solution($A, $B) {
		/*
		 * if($ A < 0 || $ B < 0) return -1;
		 */
		$sum = isEven ( $A ) + isEven ( $B );
		$num = 0;
		if ($B > $A)
			$num = ceil ( $B / 2 );
		else
			$num = ceil($A/2)
		;
		if ($sum == 0 || $sum == 2) {
			if (! isEven ( $num ))
				$num ++;
			$num = calculate ( $A, $B, $num );
			if (! isEven ( $num ))
				$num ++;
		} else {
			if (isEven ( $num ))
				$num ++;
			$num = calculate ( $A, $B, $num );
			if (isEven ( $num ))
				$num ++;
		}
		$num = intval ( $num );
		if ($num > 100000000) {
			$num = - 2;
		}
		return intval ( $num );
	}
	function calculate($A, $B, $num) {
		$max = $num * 3;
		$add = $max - ($A + $B);
		if ($add > 0)
			$add = 0;
		else
			$add = abs ( $add );
		$num += ceil ( $add / $num );
		
		return $num;
	}
	function isEven($num) {
		$odd = $num % 2;
		if ($odd == 1)
			return 0;
		return 1;
	}

	public static function GetBinary( $array )
	{
		$num = self::GetDecimal($array);
	
		
		$myArray = self::GetNegabinary(-1 * $num);
		return $myArray;
	}
	public static function GetDecimal($array)
	{
		$decimalNum = 0;
		for ($i = 0; $i < count($array); $i++)
		{
			$decimalNum += $array[$i] * (pow(-2, $i));
		}
		return self::intval_32bits($decimalNum);
	}
	
	public static function intval_32bits($value)
	{
		$value = ($value & 0xFFFFFFFF);
		if ($value & 0x80000000) $value = -(($value & 0xFFFFFFFF) + 1);
		return $value;
	}
	
     public static function  GetBit($num)
        {
        	

            $retValues = array();

            $remainder = $num % 2;
            
            if ($remainder < 0)
                $remainder = $remainder * -1;
            $quotient = $num / 2;

            if ($num == ($quotient * -2 + $remainder))
                $retValues[0] = $quotient;
            else if ($num == (($quotient + 1) * -2 + $remainder))
                $retValues[0] = $quotient + 1;
            else if ($num == (($quotient * -1) * -2 + $remainder))
                $retValues[0] = $quotient * -1;
            else if ($num == ((($quotient * -1) + 1) * -2 + $remainder))
                $retValues[0] = ($quotient * -1) + 1;

            $retValues[1] = $remainder;
            return $retValues;
        }
	
	
	public static function GetNegabinary($number)
	{
		
	$nexNum = 0;
	$lstInt = array();
	
	
	 while (true)
            {
                $receivedBit = self::GetBit($number);
                $lstInt[] = $receivedBit[1];
                $number = $receivedBit[0];
                
               	
                if ($number == 0)
                    break;
            }
	die;
	return $lstInt;
	}
	

	public static function countUnreadNotificationOfUser($user_id)
	{
		$em = \Zend_Registry::get('em');
		$qb_1 = $em->createQueryBuilder();
		$q_1 = $qb_1->select('
				count(notfctn.id) as num_of_rows
				')
				->from( '\Entities\notifications', 'notfctn' )
				->where( 'notfctn.forIlookUser ='.$user_id )
				->andwhere('notfctn.is_read = 0');
		$q_1 = $q_1->getQuery();
	
		$ret = $q_1->getResult();
	
		return $ret;
	}
	
	
	public static function abc( $registrationIdsArray, $messageData )
	{
		 
		$apiKey = 'AIzaSyBANLyRa71T4GEIyCimPrPzKYJ3Qr7MKkU';
		$headers = array("Content-Type:" . "application/json", "Authorization:" . "key=" . $apiKey);
		 
		$data = array(
				'data' => $messageData,
				'registration_ids' => $registrationIdsArray
		);
	
		$ch = curl_init();
	
		curl_setopt( $ch, CURLOPT_HTTPHEADER, $headers );
		curl_setopt( $ch, CURLOPT_URL, "https://android.googleapis.com/gcm/send" );
		curl_setopt( $ch, CURLOPT_SSL_VERIFYHOST, 0 );
		curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, 0 );
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
		curl_setopt( $ch, CURLOPT_POSTFIELDS, json_encode($data));
	
		$response = curl_exec($ch);
		curl_close($ch);
		 
		$result =  json_decode($response);
		print_r($result);die;
		Zend_Debug::dump($result); die;
		//now working with multiple device tokens so no need to update old device token
		/* 	   	//Update registration id of user on basis of canonical_ids.
		 if($result->canonical_ids !=0 && $result->canonical_ids !=NULL)
		 {
		$canonical_id = $result->canonical_ids;
		$em = \Zend_Registry::get('em');
		$qb = $em->createQueryBuilder();
		$q = $qb->update('\Entities\ilook_user', 'u')
		->set('u.device_token', $canonical_id)
		->where('u.device_token = ?1')
		->setParameter(1, $data['registration_ids'][0])
		->getQuery();
		$p = $q->execute();
	
		} */
		return $response;
	}
	
	public function sendVerificationMailToUnverifiedUsersAction()
	{
		/* create a dom document with encoding utf8 */
		$domtree = new DOMDocument('1.0', 'UTF-8');

		/* create the root element of the xml tree */
		$xmlRoot = $domtree-> createElement("Jobs");

		/* append it to the document created */
		$xmlRoot = $domtree->appendChild($xmlRoot);

		/* get the xml printed */
		$response_for_jobGate =  $domtree->saveXML();

		//Creating XML to send response to jobg8===========================================
		$currentTrack = $domtree->createElement("Job");
		$currentTrack = $xmlRoot->appendChild($currentTrack);


		$currentTrack->appendChild($domtree->createElement('SenderReference',1112223));
		$currentTrack->appendChild($domtree->createElement('Successful'));
		$currentTrack->appendChild($domtree->createElement('Message'));

		//=====================================================================================

		$response_for_jobGate =  $domtree->saveXML();
		//Removing XML version tag as per jobgate requirement for response.
		$customXML = new SimpleXMLElement($response_for_jobGate);

		$dom = dom_import_simplexml($customXML);
		$response_for_jobGate = $dom->ownerDocument->saveXML($dom->ownerDocument->documentElement);
		file_put_contents('logs/app_log.html', $response_for_jobGate , FILE_APPEND);
		die;

		//******************************************************************************//
		// Script to send verification mail to all unverified users
		//******************************************************************************//
	
		$unverified_users = \Extended\ilook_user::getUnverifiedUsers();
		die;
		foreach($unverified_users as $unverified_user)
		{
	
			$user_id = $unverified_user['id'];
			$user_id_enc = base64_encode($user_id);
			$verification_link = PROJECT_URL."/".PROJECT_NAME."registration/verification-by-link/reg_1/".$user_id_enc;
	
	
			$subject = "ilook - Verify your Registration";
			$message = "Please click the verify button to confirm your email address<br><br>
			<a href='".$verification_link."' style='text-decoration:none; margin-left: 23%;'>
			<img src='".PUBLIC_PATH."/imagess/verify-btn.png' style='line-height:0; font-size:0' alt=''/></a>
			<br><br>
			If you can't see the verify button you can click <a href='".$verification_link."'>here</a>.
			";
			$obj = \Extended\ilook_user::getRowObject($user_id );
			$send_mail = Email_Mailer::sendMail($subject, $message, $obj->getFirstname(), $obj->getEmail());
			echo $send_mail;
			echo '<br>';
			echo $user_id ;
	
		}
		die;
	}
	public function autocompleteLocationAction()
	{
		$this->_helper->layout->disableLayout();
	}

	public function removeMessageFromTrashAction()
	{
		\Extended\message_folder::deleteMessageFromTrashForSpecificUser(1041, 1048);
		die;

	}
	public function testshapeAction()
	{
		$shapeObj = new \Shapes\Test();
		$shapeObj->main();
		die;

	}

	public function createaccountAction()
	{
		$OFObj = new \Openfire\Main();
		$OFObj->createUser();
		die;
	}
}