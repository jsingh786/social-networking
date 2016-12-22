<?php
//error_reporting(E_ALL && ~E_WARNING && ~E_NOTICE);
// Define path to application directory
defined('APPLICATION_PATH')
    || define('APPLICATION_PATH', realpath(dirname(__FILE__) . '/../application'));

//Define Project name
defined('PROJECT_NAME')
|| define('PROJECT_NAME', "ilook/");

defined('PROJECT_URL')
|| define( 'PROJECT_URL', "http://".$_SERVER['HTTP_HOST'] );

defined('PUBLIC_PATH')
|| define('PUBLIC_PATH', PROJECT_URL."/".PROJECT_NAME."public");


defined('SERVER_PUBLIC_PATH')
|| define('SERVER_PUBLIC_PATH', realpath(dirname(__FILE__) ) );

defined('SERVER_IMAGE_PATH')
|| define('SERVER_IMAGE_PATH', realpath(dirname(__FILE__). '/images' ));

defined('IMAGE_PATH')
|| define('IMAGE_PATH', PUBLIC_PATH."/images");

defined('ENQUIRY_ATTACHMENT_PATH')
|| define('ENQUIRY_ATTACHMENT_PATH', PUBLIC_PATH."/enquiry");

defined('REL_IMAGE_PATH')
|| define('REL_IMAGE_PATH', 'images');

defined('REL_ENQUIRY_ATTACHMENT_PATH')
|| define('REL_ENQUIRY_ATTACHMENT_PATH', 'enquiry');

defined('REL_CHAT_ATTACHMENT_PATH')
|| define('REL_CHAT_ATTACHMENT_PATH', 'chat_files');

defined('REL_IMAIL_ATTACHMENT_PATH')
|| define('REL_IMAIL_ATTACHMENT_PATH', 'imails');

defined('ADMIN_ID')
|| define('ADMIN_ID', 1);

//Constants
defined('TIME_ZONE')
|| define('TIME_ZONE', 'Asia/Calcutta');

date_default_timezone_set(TIME_ZONE);

//Colors used in project
defined('LIGHT_PURPLE')
|| define('LIGHT_PURPLE', '#CABEDB');


defined('LIBRARY_PATH')
|| define('LIBRARY_PATH', realpath(dirname(__FILE__) . '/../library'));

defined('DOCTRINE_PATH')
|| define('DOCTRINE_PATH', LIBRARY_PATH . '/Doctrine');


//api key for push notifications
defined('GOOGLE_API_KEY')
|| define("GOOGLE_API_KEY", "AIzaSyAGDX6c6DLEovuFgxMwCyftHANVGl6EBlc");


//Locale
setlocale(LC_MONETARY, 'en_UK');

// Define application environment
//defined('APPLICATION_ENV')
//     || define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'development'));
defined('APPLICATION_ENV')
     || define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'production'));


// Ensure library/ is on include_path
set_include_path(implode(PATH_SEPARATOR, array(
    realpath(APPLICATION_PATH . '/../library'),
    get_include_path(),
)));

//Ensure Doctrine library path
set_include_path(implode(PATH_SEPARATOR, array(
		realpath(DOCTRINE_PATH),
		get_include_path(),
)));

/** Zend_Application */
require_once 'Zend/Application.php';

// Create application, bootstrap, and run

$application = new Zend_Application(
    APPLICATION_ENV,
    APPLICATION_PATH . '/configs/application.ini'
);


$application->bootstrap()->run();