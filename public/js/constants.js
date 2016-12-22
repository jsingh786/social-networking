//IMPORTANT VARIABLES
var url = window.location.href;
var temp_r = url.split("/");
var final_url = temp_r[0] + "//" + temp_r[2] + "/";

var OPENFIRE_DOMAIN = "phpdemo.seasiainfotech.com";
var PROJECT_NAME = "ilook/";
var PROJECT_URL = final_url;
var PUBLIC_PATH = PROJECT_URL+PROJECT_NAME+"public";
var IMAGE_PATH = PUBLIC_PATH+"/images";
var REL_IMAGE_PATH = "images";

var FB_ID = "237353843058853";
var GMAIL_CLIENTID = '678590240478-dp8s7cg2av1gdebbb7kukir63ao153nb.apps.googleusercontent.com';

//Colors used-----------------
var LIGHT_PURPLE = "#CABEDB";
//--Colors used---------------

//Some usefull variables
var MSG_TYPE_GENERAL = 1;
var SUPPORT_TEXT = 'Support';
var SUPPORT_ALL_TEXT = '<div class="icon-like"></div>';

var DEFAULT_ALBUM_NAME = "DEFAULT";// album name of default album, if user upload an image without any album , it goes to default album.


// constants for album photos, user profile photos.

var PREVIEW_NOT_AVAILABLE = 0;



var console_message;
console_message += ".d8888b.   888                       888	";    
console_message += "d88P  Y88b 888                       888    ";
console_message += "Y88b.      888                       888    This is a browser feature intended for ";
console_message += ' "Y888b.   888888  .d88b.  88888b.   888    developers. If someone told you to copy-paste ';
console_message += '    "Y88b. 888    d88""88b 888 "88b  888    something here to enable a iLook feature ';
console_message += '      "888 888    888  888 888  888  Y8P    or "hack" someone\'s account, it is a ';
console_message += "Y88b  d88P Y88b.  Y88..88P 888 d88P         scam and can give them access to your ";
console_message += ' "Y8888P"   "Y888  "Y88P"  88888P"   888    iLook account.';
console_message += "                           888              ";
console_message += "                           888              ";
console_message += "                           888      		";

