<?php
error_reporting(E_ALL & ~E_STRICT & ~E_NOTICE);
// Define path to application directory
defined('APPLICATION_PATH')
    || define('APPLICATION_PATH', realpath(dirname(__FILE__) . '/../../application'));

//Define Project name
defined('PROJECT_NAME')
|| define('PROJECT_NAME', "ilook/");

defined('PROJECT_URL')
|| define('PROJECT_URL', 'http://localhost:8080');

defined('PUBLIC_PATH')
|| define('PUBLIC_PATH', PROJECT_URL."/".PROJECT_NAME."public");

defined('SERVER_PUBLIC_PATH')
|| define('SERVER_PUBLIC_PATH', realpath(dirname(__FILE__) ) );

defined('SERVER_IMAGE_PATH')
|| define('SERVER_IMAGE_PATH', realpath(dirname(__FILE__). '/images' ));

defined('IMAGE_PATH')
|| define('IMAGE_PATH', PUBLIC_PATH."/images");

defined('REL_IMAGE_PATH')
|| define('REL_IMAGE_PATH', 'images');


defined('ADMIN_ID')
|| define('ADMIN_ID', 19);

//Constants
defined('TIME_ZONE')
|| define('TIME_ZONE', 'Asia/Calcutta');

date_default_timezone_set(TIME_ZONE);

//Colors used in project
defined('LIGHT_PURPLE')
|| define('LIGHT_PURPLE', '#CABEDB');


defined('LIBRARY_PATH')
|| define('LIBRARY_PATH', realpath(dirname(__FILE__) . '/../../library'));

defined('DOCTRINE_PATH')
|| define('DOCTRINE_PATH', LIBRARY_PATH . '/Doctrine');

//api key for push notifications
defined('GOOGLE_API_KEY')
|| define("GOOGLE_API_KEY", "AIzaSyAGDX6c6DLEovuFgxMwCyftHANVGl6EBlc");


//Locale
setlocale(LC_MONETARY, 'en_UK');

// Define application environment
defined('APPLICATION_ENV')
     || define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'development'));
//defined('APPLICATION_ENV')
//    || define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'production'));

// Ensure library/ is on include_path
set_include_path(implode(PATH_SEPARATOR, array(
    realpath(LIBRARY_PATH),
    get_include_path(),
)));

//Ensure Doctrine library path
set_include_path(implode(PATH_SEPARATOR, array(
		realpath(DOCTRINE_PATH),
		get_include_path(),
)));

//====================================================================================
// Autoloading zend library===========================================================
//====================================================================================
require_once 'Zend/Application.php';

// Create application, bootstrap, and run

$application = new Zend_Application(
		APPLICATION_ENV,
		APPLICATION_PATH . '/configs/application.ini'
);


//======================================================================================
// Setting connection for doctrine2=====================================================
//======================================================================================

$doctrinePath = LIBRARY_PATH;
		
require_once $doctrinePath . '/Doctrine/Common/ClassLoader.php';
		
// AUTOLOADING============================================

$autoloader = Zend_Loader_Autoloader::getInstance();
$doctrineAutoloader = array(new \Doctrine\Common\ClassLoader(), 'loadClass');
$autoloader->pushAutoloader($doctrineAutoloader, 'Doctrine');

$classLoader = new \Doctrine\Common\ClassLoader('Gedmo', realpath(APPLICATION_PATH . '/../library/'), 'loadClass');
$classLoader->register();
$autoloader->pushAutoloader(array($classLoader, 'loadClass'), 'Gedmo');

$classLoader = new \Doctrine\Common\ClassLoader('Entities', realpath(APPLICATION_PATH . '/models/'), 'loadClass');
$autoloader->pushAutoloader(array($classLoader, 'loadClass'), 'Entities');

$classLoader = new \Doctrine\Common\ClassLoader('Extended', realpath(APPLICATION_PATH . '/models/'), 'loadClass');
$autoloader->pushAutoloader(array($classLoader, 'loadClass'), 'Extended');
	
$classLoader = new \Doctrine\Common\ClassLoader('Symfony', realpath(APPLICATION_PATH . '/../library/Doctrine/'), 'loadClass');
$autoloader->pushAutoloader(array($classLoader, 'loadClass'), 'Symfony');
// 		$autoloader->pushAutoloader(array($classLoader, 'loadClass'), 'ORM');
// 		$autoloader->pushAutoloader(array($classLoader, 'loadClass'), 'DBAL');
// 		$autoloader->pushAutoloader(array($classLoader, 'loadClass'), 'Common');
		
$classLoader = new \Doctrine\Common\ClassLoader('ORM', realpath(APPLICATION_PATH . '/../library/Doctrine/'), 'loadClass');

//SETTING ANNOTATION READER AND DRIVER=====================

// globally used cache driver, in production use APC or memcached
if (APPLICATION_ENV == "development") 
{
	$cache = new \Doctrine\Common\Cache\ArrayCache;
}
else 
{
	$cache = new \Doctrine\Common\Cache\ApcCache;
}

// standard annotation reader
$annotationReader = new Doctrine\Common\Annotations\AnnotationReader;
$cachedAnnotationReader = new Doctrine\Common\Annotations\CachedReader(
		$annotationReader, // use reader
		$cache // and a cache driver
);
// create a driver chain for metadata reading
$driverChain = new Doctrine\ORM\Mapping\Driver\DriverChain();
// load superclass metadata mapping only, into driver chain
// also registers Gedmo annotations.NOTE: you can personalize it

Gedmo\DoctrineExtensions::registerAbstractMappingIntoDriverChainORM(
		$driverChain, // our metadata driver chain, to hook into
		$cachedAnnotationReader // our cached annotation reader
);
// standard annotation reader
$annotationReader1 = new Doctrine\Common\Annotations\AnnotationReader;
$cachedAnnotationReader1 = new Doctrine\Common\Annotations\CachedReader(
		$annotationReader1, // use reader
		$cache // and a cache driver
		);
// now we want to register our application entities,
// for that we need another metadata driver used for Entity namespace
$annotationDriver = new Doctrine\ORM\Mapping\Driver\AnnotationDriver(
		$cachedAnnotationReader1, // our cached annotation reader
		 APPLICATION_PATH.'/models' // paths to look in
);
// NOTE: driver for application Entity can be different, Yaml, Xml or whatever
// register annotation driver for our application Entity namespace
$driverChain->addDriver($annotationDriver, 'Entities');

//CONFIGURATION============================================

// General ORM Configuration.
$config = new \Doctrine\ORM\Configuration();
$config->setProxyDir(APPLICATION_PATH . '/models/Proxies');
$config->setProxyNamespace('Proxies');

if (APPLICATION_ENV == "development")
{
	$config->setAutoGenerateProxyClasses(true);
}
else
{
	$config->setAutoGenerateProxyClasses(false);
}
		
//Registering custom functions
$config->addCustomStringFunction('DATEADD', LIBRARY_PATH.'/DoctrineExtensions/DateAdd');


// register metadata driver
//No need to use default annotation driver ====> $driverImpl = $config->newDefaultAnnotationDriver(APPLICATION_PATH . '/models/Entities');
//====> $config->setMetadataDriverImpl($driverImpl);

$config->setMetadataDriverImpl($driverChain);
// use our allready initialized cache driver
$config->setMetadataCacheImpl($cache);
$config->setQueryCacheImpl($cache);
		
		
// SETTING EVENT MANAGER REGARDING BEHAVIOURS==================
 
// create event manager and hook prefered extension listeners
$evm = new Doctrine\Common\EventManager();
// gedmo extension listeners, remove which are not used

// sluggable
$sluggableListener = new Gedmo\Sluggable\SluggableListener;
// you should set the used annotation reader to listener, to avoid creating new one for mapping drivers
$sluggableListener->setAnnotationReader($cachedAnnotationReader);
$evm->addEventSubscriber($sluggableListener);

// tree
$treeListener = new Gedmo\Tree\TreeListener;
$treeListener->setAnnotationReader($cachedAnnotationReader);
$evm->addEventSubscriber($treeListener);
		
// loggable, not used in example
$loggableListener = new Gedmo\Loggable\LoggableListener;
$loggableListener->setAnnotationReader($cachedAnnotationReader);
$evm->addEventSubscriber($loggableListener);

// timestampable
$timestampableListener = new Gedmo\Timestampable\TimestampableListener;
$timestampableListener->setAnnotationReader($cachedAnnotationReader);
$evm->addEventSubscriber($timestampableListener);

// SoftDeleteable
$softDeleteableListener = new Gedmo\SoftDeleteable\SoftDeleteableListener;
$softDeleteableListener->setAnnotationReader($cachedAnnotationReader);
$evm->addEventSubscriber($softDeleteableListener);
		
// translatable
$translatableListener = new Gedmo\Translatable\TranslatableListener;
// current translation locale should be set from session or hook later into the listener
// most important, before entity manager is flushed
$translatableListener->setTranslatableLocale('en');
$translatableListener->setDefaultLocale('en');
$translatableListener->setAnnotationReader($cachedAnnotationReader);
$evm->addEventSubscriber($translatableListener);

// sortable, not used in example
$sortableListener = new Gedmo\Sortable\SortableListener;
$sortableListener->setAnnotationReader($cachedAnnotationReader);
$evm->addEventSubscriber($sortableListener);

// SETTING CONNECTION OBJECT INTO ZEND_REGISTRY============
$db_options = $application->getOption('db');
$conn =  \Doctrine\DBAL\DriverManager::getConnection( $db_options );
Zend_Registry::set('conn', $conn);

// FINALLY, CREATE ENTITY MANAGER==========================
$em =  \Doctrine\ORM\EntityManager::create($db_options, $config, $evm);
Zend_Registry::set('em', $em);

Doctrine\Common\Annotations\AnnotationRegistry::registerFile('Doctrine/ORM/Mapping/Driver/DoctrineAnnotations.php');
