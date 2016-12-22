var customized_for_ilook               = 1;
var customized_for_ilook_file_transfer = 1;
var hide_meta_messages                 = 1;
var hide_video_call_icon               = 1;
var auto_start_otr                     = 0;
var AES_key                            = '!l00k@123#seasia!l00k@123#seasia';
var AES_encryption_enabled             = 1;


$(function() {
   var settings = {
      xmpp: {
         url: 'http://'+OPENFIRE_DOMAIN+':7070/http-bind/',
         domain: OPENFIRE_DOMAIN,
         resource: 'example',
         overwrite: true,
         onlogin: true
      }
   };

   jsxc.init({
      /*loginForm: {
         form: '#form',
         jid: '#username',
         pass: '#password'
      },*/
      logoutElement: $('#logout'),
      numberOfMsg:1000,
      onlineHelp: 'mailto:support@ilook.com',
      timeout:3000,
      busytimeout: 15000,
      notification: true,
      defaultLang: 'en',
      checkFlash: false,
      rosterAppend: 'body',
      root: '/' + PROJECT_NAME + 'jsxc/build/',
      displayRosterMinimized: function() {
         return false;
      },
      // otr: {
      //    debug: false,
      //    SEND_WHITESPACE_TAG: true,
      //    WHITESPACE_START_AKE: true
      // },
      loadSettings: function(username, password, cb) {
         cb(settings);
      },
      xmpp: {
         url: settings.xmpp.url
      }
   });

   //ajax call to get openfire credntials & connect to chat.
   if(!jsxc.storage.getItem('sid'))
   {
      $.ajax({
         type: 'get',
         url: PROJECT_URL+PROJECT_NAME+'dashboard/get-openfire-credentials',
         dataType: 'json',
         success: function (data) {
            jsxc.xmpp.login(data.username + '@' + settings.xmpp.domain, data.password);
         }
      });
   }

});


$(document).ready(function(){


   $( "div#chat_attachment_form img.close_bpopup" ).click(function(){ });

   //Dialog box show if uploaded file size exceeds 20 MB
   $( "div#chat_attachment_dialog_file_size_enq" ).dialog({
      modal: false,
      autoOpen: false,
      draggable:true,
      width: 345,
      show: {
         effect: "fade"
      },
      hide: {
         effect: "fade"
      },
      buttons: {
         OK: {
            click: function () {
               $(this).dialog("close");

            },
            text : 'OK'
         }

      }
   });

   $('input#send_attachment').on('click', function() {
      save_files();
   });
});

function jsxcLogout()
{
   jsxc.xmpp.logout;
}

/*
 * Set profile pic of buddies on behalf of buddyIds
 * @author ssharma4
 *
 * version 1.0
 */
function settingProfilePicsInRoster(){
   //Set logged user profile pic for chat.
   $('div#jsxc_roster div#jsxc_avatar.jsxc_avatar').css('background-image', 'url(' + $("input[type='hidden']#user_chat_profile_pic").val() + ')');

   //Get user's buddies & assign profile pic to them in roster using ajax.
   var buddylist        =  jsxc.storage.getUserItem('buddylist');
   var i                =  0;
   var buddy            =  [];
   var mybuddyusernames =  [];
   //Get username from jid.
   $(buddylist).each(function() {
      buddy = buddylist[i].split("@");
      mybuddyusernames.push(buddy[0]);
      i++;
   });
   //Send usernames to ajax to fetch profile pic.
   $.ajax({
      type: 'post',
      url: PROJECT_URL+PROJECT_NAME+'dashboard/fetch-roster-buddies-profile-pic',
      data:{'myBuddyUsernames':mybuddyusernames},
      dataType: 'json',
      success: function (data) {
         $.each( data, function( key, value ) {

            var dataBid = key+"@"+OPENFIRE_DOMAIN;

            //For roster.
            $("ul#jsxc_buddylist li[data-bid='"+dataBid+"'] div.jsxc_avatar").css('background-image','url('+value+')');

            //for chat windows
            $("div#jsxc_windowList li[data-bid='"+dataBid+"'] div.jsxc_window div.jsxc_avatar").css('background-image','url('+value+')');
         });
      }
   });
}

/*
* Set profile pic of selected buddy chat window.
* @params string bid
* @author ssharma4
*
* version 1.0
*/
function buddyChatWindowPic(bid)
{
   //Set profile pic of roster current chat window.(ssharma4)
   $("ul#jsxc_buddylist li[data-bid='"+bid+"'] div.jsxc_avatar").empty();

   $("div#jsxc_windowList ul li[data-bid='"+bid+"'] div.jsxc_window div.jsxc_bar div.jsxc_avatar").empty();

   var bg = $("ul#jsxc_buddylist li[data-bid='"+bid+"'] div.jsxc_avatar").css('background-image');

   $("div#jsxc_windowList ul li[data-bid='"+bid+"'] div.jsxc_window div.jsxc_bar div.jsxc_avatar").css('background-image',bg);
}

function AESEncrypt(msg)
{
   var key = aesjs.util.convertStringToBytes(AES_key);

   // Convert text to bytes
   var text = msg;
   var textBytes = aesjs.util.convertStringToBytes(text);

   // The counter is optional, and if omitted will begin at 0
   var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
   var encryptedBytes = aesCtr.encrypt(textBytes);
   return encryptedBytes.toString();
}

function AESDecrypt(encryptedBytes)
{
   encryptedBytes = encryptedBytes.split(",").map(Number);
   var key = aesjs.util.convertStringToBytes(AES_key);

   // The counter mode of operation maintains internal state, so to
   // decrypt a new instance must be instantiated.
   var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
   var decryptedBytes = aesCtr.decrypt(encryptedBytes);

   // Convert our bytes back into text
   var decryptedText = aesjs.util.convertBytesToString(decryptedBytes);
   return decryptedText;
}

/**
 * Parse all the URLs in the message portion and modify them in case if
 * URL points to some Document or Image.
 *
 * @param bid for eg: munishgarg-1480403448@phpdemo.seasiainfotech.com
 * @author jsingh7
 */
function modifyUrls(bid)
{
   //Getting all the divs which holds messages in side the chat window.
   var divs = $("ul li[data-bid='"+bid+"'] div.jsxc_window div.jsxc_chatmessage div:first-child");

   //Itrating all the divs.
   divs.each(function( index, element ) {

      // Check if there is anchor tag inside div.
      if($(element).children('a').length >= 1) {

         //Parse each anchor to modify it.
         $(element).children('a').each(function (indexx, elementt) {

            //Appending span for preview.
            $(element).append(
               attachmentPreview($(elementt).attr('href'))
            );
         });
      }
   });
}

function attachmentPreview(UrlOfFile)
{
   var IsPreviewRequired = 0;
   // Check the extension(type) of file.
   var UrlOfFileParts = UrlOfFile.split('.');


   // Decide thumbnail according to extension(type)
   var thumbnailPath = '';
   switch (UrlOfFileParts[UrlOfFileParts.length-1].toLowerCase()) {

      //IMAGES
      case 'png': case 'jpg': case 'jpeg': case 'gif': case 'bmp': case 'jfif': case 'tiff': case 'svg':
         thumbnailPath = PUBLIC_PATH+'/Imagehandler/GenerateImage.php?image='+ UrlOfFile +'&amp;h=200&amp;w=200';
         IsPreviewRequired = 1;
         break;

      //DOCS
      case 'doc': case 'docx': case 'wpd': case 'wp': case 'wp7': case 'odt':
         thumbnailPath = IMAGE_PATH+'/document.png';
         IsPreviewRequired = 1;
         break;

      //PDF
      case 'pdf':
         thumbnailPath = IMAGE_PATH+'/pdf.png';
         IsPreviewRequired = 1;
         break;

      //SPREADSHEETS
      case 'xlsx': case 'xls':
         thumbnailPath = IMAGE_PATH+'/spreadsheet.png';
         IsPreviewRequired = 1;
      break;

      //AUDIO
      case 'act': case 'aiff': case 'aac': case 'amr': case 'ape': case 'au': case 'awb': case 'dct': case 'dss': case 'dvf':
      case 'flac': case 'gsm': case 'iklax': case 'ivs': case 'm4a': case 'mmf': case 'mp3': case 'mpc': case 'msv': case 'oga':
      case 'opus': case 'ra': case 'rm': case 'raw': case 'sln': case 'tta': case 'vox': case 'wav': case 'wma': case 'wv':
         thumbnailPath = IMAGE_PATH+'/sound.png';
         IsPreviewRequired = 1;
      break;

      //VIDEO
      case 'webm': case'mkv': case'flv': case'vob': case'ogg': case'ogv': case'drc': case'gifv': case'mng': case'avi':
      case'qt': case'mov': case'wmv': case'yuv': case'rmvb': case'asf': case'mp4': case'm4v': case'm4p': case'mpg':
      case'mp2': case'mpeg': case'mpe': case'mpv': case'm2v': case'svi': case'3gp': case'3g2': case'mxf': case'oq':
      case'nsv': case'f4v': case'f4p': case'f4a': case'f4b':
      thumbnailPath = IMAGE_PATH+'/video.png';
      IsPreviewRequired = 1;
      break;

      //COMPRESSED
      case 'rar': case 'zip':  case 'tgz': case 'tbz2': case 'tlz': case 'gz': case 'bz2':
      thumbnailPath = IMAGE_PATH+'/compressed.png';
      IsPreviewRequired = 1;
      break;
   }

   if(IsPreviewRequired == 1) {
      return '<span class = "preview">' +
          '<img src="' + thumbnailPath + '"/> ' +
          '<a class = "download" href="' + UrlOfFile + '" download> ' +
          '</span>';
   }
   else {
      return '';
   }
}

/**
 * open popup for attachment form inside chat window.
 *
 * @param receiver_id
 * @author ssharma4
 *
 * @version 1.0
 */
function openChatAttachmentForm(receiver_id)
{
   $("form#myAwesomeDropzone").click(function(){ $(".dz-message").hide();});

   $("div#chat_attachment_form input#receiver_id").val(receiver_id);
   //Bpopup for enquiry form.
   $("div#chat_attachment_form").bPopup({
      closeClass:'close_bpopup',
      modalClose: false,
      scrollBar: true,
      zIndex : 110,
      escClose: true,
      amsl: 0,

      onClose: function() {

         // clear attachments uploaded
         $("div#temp_uploads_info").empty();

         //Remove all the temporary uploaded files-----------
         if( $("div#temp_uploads_info span").length > 0 )
         {
            var temp_path_info_arr = {};

            $.each( $("div#temp_uploads_info span"), function( key, value ) {
               var temp_path_info_inner_arr = {};

               temp_path_info_inner_arr.ts_file_name 	= $(this).attr("ts_file_name");
               temp_path_info_inner_arr.ts_file_size 	= $(this).attr("ts_file_size");

               temp_path_info_arr['index_'+key] = temp_path_info_inner_arr;

            });
         };

      },
      onOpen: function(){
         //if want some action on open popup.
      }

   });
}

/**
 * remove attachments from temp folder
 * @author ssharma4
 * @version 1.0
 */
function removeattachment(filename)
{
   //Remove all the temporary uploaded files-----------
   if( $("div#temp_uploads_info span").length > 0 )
   {
      $.ajax({
         url : "/"+PROJECT_NAME+"ChatAttachment/discard-attachments",
         data: {
            'files':filename
         },
         type: "POST",
         success: function(jsonData) {
            if(jsonData)
            {
               $('span[ts_file_name='+jsonData+']').remove();
            }
         }
      });

   };

}

/**
 * Save files to chat_files folder.
 * As well display image corresponding to file type in chat window.
 * @author ssharma4
 * @version 1.0
 */
function save_files() {

   var iddd = addLoadingImage($("#send_attachment"), "before", "loading_small_purple.gif", 0, 21);
   var temp_path_info_arr = {};
   var bid = $("div#chat_attachment_form input#receiver_id").val();
   $("#send_attachment").hide();

   $.each($(" div#chat_attachment_form div#temp_uploads_info span"), function (key, value) {

      temp_path_info_inner_arr = {};
      temp_path_info_inner_arr.ts_file_name = $(this).attr("ts_file_name");
      temp_path_info_inner_arr.ts_file_size = $(this).attr("ts_file_size");
      temp_path_info_inner_arr.ts_actual_file_name = $(this).attr("ts_actual_file_name");

      temp_path_info_arr['index_' + key] = temp_path_info_inner_arr;
   });


   if (temp_path_info_arr != "") {
      // send attachment ajax call
      jQuery.ajax({
         url: "/" + PROJECT_NAME + "ChatAttachment/move-attachment-to-permanent-loc",
         type: "POST",
         dataType: "json",
         beforeSend: function () {
            $("span#" + iddd).remove();
            $("#send_attachment").show();
            $('div#chat_attachment_form').bPopup().close();
            $("div#temp_uploads_info").empty();

            // clear uploaded image div
            $("div.dz-complete").remove();
            $("div.dz-message").show();
         },
         data: {
            'uploads': temp_path_info_arr,
            'receiver_username': $("div#chat_attachment_form input#receiver_id").val()
         },
         timeout: 50000,
         success: function (files) {
            if (files != "") {
               $.each(files, function (key, value) {

                  //Send Message to openfire server through JSXC function.
                  var msgObj = jsxc.gui.window.postMessage({
                     bid: bid,
                     direction: jsxc.Message.OUT,
                     msg: PUBLIC_PATH + '/' + value.file_path
                  });
               });
            }
         }
      });
   }
}