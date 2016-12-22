<?php

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{
	public function _initSessionTimeOut()
	{
		$ilook_user_session_storage = new Zend_Session_Namespace('ilook_user');
		$ilook_user_session_storage->setExpirationSeconds(7200); // 2 hours
		
		$ilook_admin_session_storage = new Zend_Session_Namespace('ilook_admin');
		$ilook_admin_session_storage->setExpirationSeconds(7200); // 2 hours

		$ilook_admin_sec_session_storage = new Zend_Session_Namespace('admin_secondary_identity_storage');
		$ilook_admin_sec_session_storage->setExpirationSeconds(7200); // 2 hours
			
		$ilook_admin_otp_session = new Zend_Session_Namespace('otp');
		$ilook_admin_otp_session->setExpirationSeconds(7200); // 2 hours
	}
	

	
	protected function _initAutoLoad ()
	{
		$autoLoader = Zend_Loader_Autoloader::getInstance();
	
		$resourceLoader = new Zend_Loader_Autoloader_Resource(
				array(
						'basePath' => APPLICATION_PATH,
						'namespace' => 'Application',
						'resourceTypes' => array(
								'form' => array(
										'path' => 'forms/',
										'namespace' => 'Form'
								),
								'model' => array(
										'path' => 'models/',
										'namespace' => 'Model'
								)
						)
				)
		);
		return $autoLoader;
	}
	
	/**
	 * for doctrine initialization 
	 * and connection.
	 * 
	 * @author JSINGH7, DLVERMA
	 * @return \Doctrine\ORM\EntityManager
	 * @see http://docs.doctrine-project.org
	 * @see https://github.com/l3pp4rd/DoctrineExtensions/blob/master/doc/annotations.md
	 */
	protected function _initDoctrine()
	{
		//GETTING OPTIONS FROM APPLICATION.INI===================
		
		$options = $this->getOptions();
		
		$doctrinePath = $options['includePaths']['library'];
		require_once $doctrinePath . '/Doctrine/Common/ClassLoader.php';
		
		// AUTOLOADING============================================
		
		$autoloader = Zend_Loader_Autoloader::getInstance();
		$doctrineAutoloader = array(new \Doctrine\Common\ClassLoader(), 'loadClass');
		$autoloader->pushAutoloader($doctrineAutoloader, 'Doctrine');
		
		$classLoader = new \Doctrine\Common\ClassLoader('Gedmo', realpath(__DIR__ . '/../library/'), 'loadClass');
		$classLoader->register();
		$autoloader->pushAutoloader(array($classLoader, 'loadClass'), 'Gedmo');
		
		$classLoader = new \Doctrine\Common\ClassLoader('Entities', realpath(__DIR__ . '/models/'), 'loadClass');
		$autoloader->pushAutoloader(array($classLoader, 'loadClass'), 'Entities');

		$classLoader = new \Doctrine\Common\ClassLoader('Extended', realpath(__DIR__ . '/models/'), 'loadClass');
		$autoloader->pushAutoloader(array($classLoader, 'loadClass'), 'Extended');
			
		$classLoader = new \Doctrine\Common\ClassLoader('Symfony', realpath(__DIR__ . '/../library/Doctrine/'), 'loadClass');
		$autoloader->pushAutoloader(array($classLoader, 'loadClass'), 'Symfony');
// 		$autoloader->pushAutoloader(array($classLoader, 'loadClass'), 'ORM');
// 		$autoloader->pushAutoloader(array($classLoader, 'loadClass'), 'DBAL');
// 		$autoloader->pushAutoloader(array($classLoader, 'loadClass'), 'Common');
		
		$classLoader = new \Doctrine\Common\ClassLoader('ORM', realpath(__DIR__ . '/../library/Doctrine/'), 'loadClass');
		
		//SETTING ANNOTATION READER AND DRIVER=====================
		
		// globally used cache driver, in production use APC or memcached
		if (APPLICATION_ENV == "development")
		{
			//$cache = new \Doctrine\Common\Cache\ArrayCache;
			$cache = new \Doctrine\Common\Cache\ApcCache;
			$cache->setNamespace( str_replace("/", "", 'NS_APC'.PROJECT_NAME) );
		}
		else
		{
// 			$cache = new \Doctrine\Common\Cache\RedisCache;
			//$cache = new \Doctrine\Common\Cache\ArrayCache;
			$cache = new \Doctrine\Common\Cache\ApcCache;
			$cache->setNamespace( str_replace("/", "", 'NS_APC'.PROJECT_NAME) );
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
		
		// Doctrine2 ORM proxies Configuration.
		$config = new \Doctrine\ORM\Configuration();
		$config->setProxyDir(APPLICATION_PATH . '/models/Proxies');
		$config->setProxyNamespace('Proxies');
		
		if (APPLICATION_ENV == "development")
		{
			//$config->setAutoGenerateProxyClasses(true);
			$config->setAutoGenerateProxyClasses(false);
		}
		else
		{
			$config->setAutoGenerateProxyClasses(false);
		}
		
		//Registering custom functions.
		$config->addCustomStringFunction('DATEADD', LIBRARY_PATH.'/DoctrineExtensions/DateAdd');
		
		
		// register metadata driver
		//No need to use default annotation driver ====> $driverImpl = $config->newDefaultAnnotationDriver(APPLICATION_PATH . '/models/Entities');
		//====> $config->setMetadataDriverImpl($driverImpl);

		$config->setMetadataDriverImpl($driverChain);
		
		// use our already initialized cache driver
		$config->setMetadataCacheImpl($cache);
		$config->setQueryCacheImpl($cache);
		$config->setResultCacheImpl($cache);
		
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
		
		$config->addFilter('soft-deleteable', 'Gedmo\SoftDeleteable\Filter\SoftDeleteableFilter');
		
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


		Zend_Registry::set('doctrine_cache', $cache);

		// SETTING CONNECTION OBJECT INTO ZEND_REGISTRY============
		$conn =  \Doctrine\DBAL\DriverManager::getConnection( $options['db'] );
		$conn->getConfiguration()->setSQLLogger(null);
		Zend_Registry::set('conn', $conn);

		// FINALLY, CREATE ENTITY MANAGER==========================
		$em =  \Doctrine\ORM\EntityManager::create($options['db'], $config, $evm);
		$em->getFilters()->enable('soft-deleteable');
		Zend_Registry::set('em', $em);

	}

	public function _initAnnotation()
	{
		Doctrine\Common\Annotations\AnnotationRegistry::registerFile('Doctrine/ORM/Mapping/Driver/DoctrineAnnotations.php');
	}
	
	
	
	protected function _initSiteModules()
	{
		//Don't forget to bootstrap the front controller as the resource may not been created yet...
		$this->bootstrap("frontController");
		$front = $this->getResource("frontController");
		//Add modules dirs to the controllers for default routes...
		$front->addModuleDirectory(APPLICATION_PATH . '/modules');
	}
	
	protected function _initLayoutHelper ()
	{
		$this->bootstrap('frontController');
		$layout = Zend_Controller_Action_HelperBroker::addHelper(
				new ModuleLayoutLoader());
	}
	
	protected function _initSession()
	{
		Zend_Session::start();
	}
	
	protected function _initHtmlFilter() {
		$allowedTags = array('p','b','br','strong'); // Allowed tags
		$allowedAttributes = array('href'); // Allowed attributes
		$stripTags = new Zend_Filter_StripTags($allowedTags, $allowedAttributes);
		Zend_Registry::set('Zend_Filter_StripTags', $stripTags);
	}
	
	protected function _initConfig()
	{
		$config = new Zend_Config($this->getOptions(), true);
		Zend_Registry::set('config', $config);

		Zend_Registry::set('admin_logged_in_as_user', 0);
		$admin_logged_in_as_user = new Zend_Session_Namespace('admin_logged_in_as_user');
		Zend_Registry::set('admin_logged_in_as_user', $admin_logged_in_as_user->admin_id);
		
		return $config;
	}
	
	protected function _initLocale()
	{
		/*try
		{
			$locale = new Zend_Locale('auto');
		}
		catch (Zend_Locale_Exception $e) 
		{
			$locale = new Zend_Locale('en_UK');
		}*/
		$locale = new Zend_Locale('en_UK');
		Zend_Registry::set('Zend_Locale', $locale);
	}
	
	protected function _initPOTCreater()
	{
// 		$obj = new Helper_potcreator();
// 		$obj->set_root = APPLICATION_PATH . '/views';
// 		$obj->set_exts('php|phtml');
// 		$obj->set_regular('/_[_|e]\([\"|\']([^\"|\']+)[\"|\']\)/i');
// 		$obj->set_base_path('..');
// 		$obj->set_read_subdir(true);

// 		$potfile = APPLICATION_PATH.'/languages/abc.pot';
// 		$obj->write_pot($potfile);
		//readfile($potfile);
	}
	
	protected function _initTranslation()
	{
// 		$translate = new Zend_Translate(
// 				array(
// 						'adapter' => 'gettext',
// 						'disableNotices' => true,
// 						'locale'  => 'en',
// 						'scan'    => Zend_Translate::LOCALE_DIRECTORY
// 				)
// 		);
		
// 		Zend_Registry::set('Zend_Translate', $translate);
		
// 		$translate->addTranslation(
//             array(
//                 'content'   => APPLICATION_PATH.'/languages/abc.mo'
//             )
//         );
	}
	
	protected function _initPlaceholders()
	{
		$this->bootstrap('View');
		$view = $this->getResource('View');
		//$view->doctype('XHTML1_STRICT');
		$view->doctype('HTML4_LOOSE');
	
		// Set the initial title and separator:
		$view->headTitle('ilook')
		->setSeparator(' - ');
	}
	protected function _initFirePHP()
	{
		$logger = new Zend_Log();
		$writer = new Zend_Log_Writer_Firebug();
		$logger->addWriter($writer);
		Zend_Registry::set('FirePHP_logger', $logger);
	}
	
	/**
	 * Routing has been done for some URLs in library/Helper_Seo.php
	 *
	 * However it is not a good practice to override everything!
	 * Remember that standard URLs in ZF helps you find quickly
	 * the controller and action you call for the current page view.
	 *
	 * @author jsingh7
	 * @version 1.0
	 * @see http://www.stoimen.com/blog/2009/10/27/zend-framework-custom-urls/
	 */
	public function _initRoutes()
	{
		// 		Customized URL for profile page.
		$frontController = Zend_Controller_Front::getInstance();
		$frontController->registerPlugin(
				new Helper_Seo($frontController->getRouter()));
	
		/* 		$this->bootstrap('FrontController');
		 $front = $this->getResource('FrontController');
		Zend_Debug::dump($front);
		echo $module=$front->getDefaultAction();
		echo "<br>".$controller=$front->getDefaultAction();
		echo "<br>".$action=$front->getDefaultAction();
	
		die;
		$frontController = Zend_Controller_Front::getInstance();
		$router = $frontController->getRouter();
	
		$router->addRoute("^[a-zA-Z0-9_.-]*$", new Zend_Controller_Router_Route("/:id",
				array('route' => '/ilook','module' => 'default',"controller" => "profile", "action" => "iprofile", 'id' => 1),
				array('id' => '^[a-zA-Z0-9_.-]*$'))); */
	
	}
}

 class ModuleLayoutLoader extends Zend_Controller_Action_Helper_Abstract
 // looks up layout by module in application.ini
 {
 	public function preDispatch()
 	{
 		$bootstrap = $this->getActionController()
 		->getInvokeArg('bootstrap');
 		$config = $bootstrap->getOptions();
 		$module = $this->getRequest()->getModuleName();
 		if (isset($config[$module]['resources']['layout']['layout']) && isset($config[$module]['resources']['layout']['layoutPath']))
 		{
 			$layoutScript = $config[$module]['resources']['layout']['layoutPath'];
 			$layoutName = $config[$module]['resources']['layout']['layout'];
 			$this->getActionController()->getHelper('layout')->setLayoutPath($layoutScript);
 			$this->getActionController()->getHelper('layout')->setLayout($layoutName );
 		}
 	}
 }


