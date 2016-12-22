

$(document).ready(function()
{
	
	//Rotate image
	$('body').on('click','img#rotate_image.rotate_image_icon',function(){
		$(this).removeClass('rotate_image_icon');
		elem = this;
		var img_src         = $('form#upload_thumb input#img_src').val();
		var res_arr		    = img_src.split("/");
		var fullArr  	    = res_arr.length;
		var arrIndex		= parseInt(fullArr)-parseInt(1);
		var prof_pic_name   = res_arr[arrIndex];
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "profile/rotate-profile-picture-before-uploading",
	        type: "POST",
	        dataType: "json",
	        data: {'prof_pic_name':prof_pic_name },
//			cache: false,
	        timeout: 50000,
	        success: function(jsonData) 
	        {
	        	$(elem).addClass('rotate_image_icon');
	        	if(jsonData == 1 )
	        	{
	        		var angle = $('input#rotation_angle').val();
	        		var remove_angle  = parseInt(angle)-parseInt(90);
	        		if(angle > 360)
        			{
	        			angle = angle/5;
        			}
	        		if(angle == 0)
	        		{
	        			angle = (parseInt(angle)+parseInt(90));
	        		}
	        		
	        		//main image rotation.
	      		  	$('img#big').addClass("rotate"+angle);
	      		  	$('img#big').removeClass("rotate"+remove_angle);
	      		  	
	      		  	//Preview image rotation.
	      		  	$('div#previewImg img').addClass("rotate_small"+angle);
	      		  	$('div#previewImg img').removeClass("rotate_small"+remove_angle);
	      		  	
	      		  	//Set new rotation angle.
	      		  	$('input#rotation_angle').val(parseInt(angle)+parseInt(90));
	      		  	console.log('value'+$('input#rotation_angle').val());
	        	}
	        	else
        		{
	        		showDialogMsg('Error', 'Unable to rotate this image!',0,{
		        		buttons: [
		        		        	
		        		  	        {
		        		  	            text: "OK",
		        		  	            click: function(){
		        		  	                $(this).dialog("close");
		        		  	            }
		        		  	        }
		        		  	    ],
		        		  	    modal:true,
		        		  	    show: {
		        		  	        effect: "fade"
		        		  	    },
		        		  	    hide: {
		        		  	        effect: "fade"
		        		  	    },
		        		  	    dialogClass: "rotate_img_error_dialog",
		        		  	    height: 150,
		        		  	    width: 300 
		        			});
        		}
	        },
	        error: function(xhr, ajaxOptions, thrownError) {
	        	$(elem).addClass('rotate_icon');
	        	showDialogMsg('Error', 'Unable to rotate this image!',0,{
	        		buttons: [
	        	
	        		  	        {
	        		  	            text: "OK",
	        		  	            click: function(){
	        		  	                $(this).dialog("close");
	        		  	            }
	        		  	        }
	        		  	    ],
	        		  	    modal:true,
	        		  	    show: {
	        		  	        effect: "fade"
	        		  	    },
	        		  	    hide: {
	        		  	        effect: "fade"
	        		  	    },
	        		  	    dialogClass: "rotate_img_error_dialog",
	        		  	    height: 150,
	        		  	    width: 300 
	        			});
	        	
	        }
		});
	
	});
	
});


//Used for upload and crop image functionality.

$(function() {

/// load about
$("#show_details").click(function () {
	$("#about_details").slideToggle("slow");
}); 

$("input[name=cropFullImage]").click(function () {
	makeProfileImage("crop");
});

$("input[name=profileFullImage]").click(function () {
	makeProfileImage("original");
});

$('form#upload_big').submit(function(){
	$("#chkFrm").val("upload_big");	
});

$("#close-popup").click(function(){
	removeImageSelectionArea();
	$("#wrap").bPopup().close();
});

/**
 * ????????????????????????
 * 
 * @author spatial
 * @author jsingh7(moderator)
 * @version 1.1
 */
function makeProfileImage(type)
{
	
	var img_src	= $("div#div_upload_thumb").children().attr("src");

	if(img_src != "undefined")
	{
		var iddd = addLoadingImage($("#btnLoading"), "after", 'loading_small_purple.gif', 0, 25);
		$("input[name=profileFullImage]").attr("disabled","disabled");
		
		var res_arr		= img_src.split("/");
		var fullArr  	= res_arr.length;
		var arrIndex	= parseInt(fullArr)-parseInt(1);
		var imgName		= res_arr[arrIndex];
		
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "profile/set-profile-image",
	        type: "POST",
	        dataType: "json",
	        data: { "img_unique_name" : imgName, "type" : type },
	        success: function(jsonData) {
	        	$(".alert-box").remove(); //?
	        	$(".alert-box1").remove(); //?
	        	
	        	if(jsonData.error_id == 5){
	        		removeImageSelectionArea();
	        		$("#wrap").bPopup().close(); 
	        		showDefaultMsg( "Invalid format of the image, please try with another image.", 2 ); 
	        	}
	        	else if(jsonData.error_id == 6){
	        		removeImageSelectionArea();
	        		$("#wrap").bPopup().close(); 
	        		showDefaultMsg( "Oops! An error ocurred Image not uploaded on the server, please try again.", 2 ); 
	        	}
	        	else{
	        		removeImageSelectionArea();
	            	$("#profileimg").html("Edit");
	    			$("#sremid").fadeIn("slow");
	            	var imgpath=jsonData.thumb_name;
	            	var img_name=imgpath.split("/");
	            	$("div.profile-img img#profileLogo").css("border","0");
	            	$("div.profile-img img#profileLogo").attr("src", IMAGE_PATH+"/profile/big_thumbnails/"+img_name[3]);
	            	$("div.profile-img-closed img#profileLogo_small").attr("src",IMAGE_PATH+"/profile/small_thumbnails/"+img_name[3]);
	            	$("#remImg").val(img_name[3]);
	            	$("span#"+iddd).remove();
	            	$("input[name=profileFullImage]").removeAttr("disabled");
	            	$("#wrap").bPopup().close(); 
	            	showDefaultMsg( "Profile photo has been updated.", 1 );
	            	$(".profile-img-closed").addClass("profileImg");
	            	$(".profile-img").addClass("profileImg");
	            	clickForImagePreview();
	        	}
	        },
	        error: function(xhr, ajaxOptions, thrownError) {
				//alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			}
		});
	}
	else
	{
		showDialogMsg( "Oops!", "An Exception has occured. We will fix it soon.", 5000, 
			{
			    buttons: [
			        {
			            text: "OK",
			            click: function(){
			                $(this).dialog("close");
			            }
			        }
			    ],
			    show: {
			        effect: "fade"
			    },
			    hide: {
			        effect: "fade"
			    },
			    dialogClass: "general_dialog_message",
			    height: 200,
			    width: 300
			}		
		);
	}
}


function removeImageSelectionArea(){
	$("#content").empty();
	displayImageUploadMsg();
	$(".imgareaselect-outer").prev().remove();
	$(".imgareaselect-outer").remove();
}

//function used to display image for cropping purposes.
function displayCropImage(){
	
	$("#content").empty();
	var html="";
	html=html+'<div id="uploaded">';
	html=html+'<span>2</span>';
	html=html+'<h4 style="padding-left: 23px; font-size:13px; margin-bottom: 2px; margin-top:40px; text-transform: none;">Click and set the thumbnail dimension</h4>';
	html=html+'<div id="div_upload_big"></div>';
	html=html+'</div><!-- uploaded-->';

	html=html+'<div id="thumbnail">';
	html=html+'<h3 style="text-transform: none;margin-bottom: 15px;">Preview</h3>';
	html=html+'<div id="previewImg"></div>  ';     
	//html=html+'<h3 style="margin-top:50px;">Thumbnail</h3>';
	html=html+'<div id="div_upload_thumb" style="display:none;"></div>';
	html=html+'<input type="hidden" name="img_src" class="img_src" size="35" />';
	html=html+'<input type="hidden" name="height" class="height" size="5" />';
	html=html+'<input type="hidden" name="width" class="width" size="5"/>';
	html=html+'<input type="hidden" class="y1"  size="5"/>';
	html=html+'<input type="hidden" class="x1" size="5" />';
	html=html+'<input type="hidden" class="y2" size="5" />';
	html=html+'<input type="hidden" class="x2" size="5" />';
	html=html+'<span>3</span>';
	html=html+'<div class="btns" style="position:relative;float:left;padding:30px 0 10px 0px;width:88%;">';
	html=html+'<form name="upload_thumb" id="upload_thumb" method="post" action="'+PROJECT_URL+PROJECT_NAME+'.profile/upload-crop-img/act/thumb" target="upload_target">';
	html=html+'<img title="rotate right 90deg" class="rotate_image_icon" id="rotate_image" src ="'+IMAGE_PATH+'/rotate-icon.png">';
	html=html+'<input type="hidden" name="img_src" id="img_src" class="img_src" />'; 
	html=html+'<input type="hidden" name="height" value="0" id="height" class="height" />';
	html=html+'<input type="hidden" name="width" value="0" id="width" class="width" />';
	html=html+'<input type="hidden" id="y1" class="y1" name="y" />';
	html=html+'<input type="hidden" id="x1" class="x1" name="x" />';
	html=html+'<input type="hidden" id="y2" class="y2" name="y1" />';
	html=html+'<input type="hidden" id="x2" class="x2" name="x1" />';                        
	html=html+'<input type="hidden" id="rotation_angle" value="0" name="rotation_angle" />';                        
	html=html+'<input type="submit" name="thumbnail" class="btn-purple" value="Set image" style="float: left; margin-left:15px;" />';
	
	html=html+'<input type="button" name="cropFullImage" class="btn-purple" value="Set Cropped Image as a Profile Picture" style = "display:none;"/>';
	// html=html+'<input type="button" name="profileFullImage" class="btn-purple" value="Set Full Image as a Profile Picture" style="background: none repeat scroll 0 0 #6B508E;border: 0 none;color: #FFFFFF;cursor: pointer;font-family: oswaldlight;font-size: 16px;height: 32px;padding: 0 5px;width: 210px;float:left;" />';
	html=html+'</form>';
	html=html+'<span id="btnLoading" style="margin-left:5px;"></span>';
	html=html+'</div>';
	
	html=html+'</div>';
	
	$("#content").append(html);
	$('[name=thumbnail]').click(function(){
		addLoadingImage($("#btnLoading"), "after", 'loading_small_purple.gif', 0, 25, 'set-img-loader');
		$("#chkFrm").val("upload_thumb");
	});
	$("input[name=cropFullImage]").click(function () {
		makeProfileImage("crop");
	}); 
	$("input[name=profileFullImage]").click(function () {
		makeProfileImage("original");
	}); 
}

function showErrorMessage(err){
	var html="";
	html = html+'<div style="font-size: 24px; text-align: center; margin-top: 250px; height: 302px; color:#48545E;" id="uploadMsg">'+err+'</div>';
	$("#content").append(html);
}

function previewImg(img, selection) {
    if (!selection.width || !selection.height)
        return;
		
    //200 is the #preview dimension, change this to your liking
    var scaleX = 131 / selection.width; 
    var scaleY = 131 / selection.height;

    $('#previewImg img').css({
        width: Math.round(scaleX * 450),
        height: Math.round(scaleY * 450),
        marginLeft: -Math.round(scaleX * selection.x1),
        marginTop: -Math.round(scaleY * selection.y1)
    });
    
    $('.x1').val(selection.x1);
    $('.y1').val(selection.y1);
    $('.x2').val(selection.x2);
    $('.y2').val(selection.y2);
    $('.width').val(selection.width);
    $('.height').val(selection.height);    
}

$("form#upload_big").submit(function() {
	
	var fname = $("#chkFrm").val();	
	var imgprop='';
	
	//check if they have made a thumbnail selection
	var imgprop='';
	var iddd = addLoadingImage($("input[name=action]"), "after", 'loading_small_purple.gif', 0, 20);
	$("#progress_id").val(iddd);
	
	displayCropImage();
	$('#big').imgAreaSelect({hide:true});
	$('#upload_target').unbind().load( function(){
		var imge = $('#upload_target').contents().find('body ').html();
		$("div.imgareaselect-outer").remove();
		$("div.imgareaselect-selection").parent().remove();
		if(imge==1){
			$("span#"+$("#progress_id").val()).remove();
			$("#content").empty();
			showErrorMessage("Please choose an image to upload.");
		}
		else if(imge==2){
			$("span#"+$("#progress_id").val()).remove();
			$("#content").empty();
			showErrorMessage("Please upload only jpg, png, gif images.");
		}
		else if(imge==3){
			$("span#"+$("#progress_id").val()).remove();
			$("#content").empty();
			showErrorMessage("Maximum upload file size is 5MB");
		}
		else{
			var fname = $("#chkFrm").val();	
			var makeProf = 0;
			if(fname=='upload_thumb'){
				
				//Removing previously set angle(css classes) from main_menu profile photos.
				$('img#profileLogo_small').removeClass('rotate_small360');
				$('img#profileLogo_small').removeClass('rotate_small90');
				$('img#profileLogo_small').removeClass('rotate_small270');
				$('img#profileLogo_small').removeClass('rotate_small180');
				//maximized
				$('img#profileLogo').removeClass('rotate_small360');
				$('img#profileLogo').removeClass('rotate_small90');
				$('img#profileLogo').removeClass('rotate_small270');
				$('img#profileLogo').removeClass('rotate_small180');
				//END Removing previously set angle(css classes) from menu profile photos.
				
				var imgprop='style="width:131px;height:131px;"';
				$("input[name=thumbnail]").attr("disabled","disabled");
				var iddd = addLoadingImage($("#btnLoading"), "after", 'loading_small_purple.gif', 0, 25);
				if($('#x1').val() =="" || $('#y1').val() =="" || $('#width').val() <="0" || $('#height').val() <="0"){
					alert("You must make a selection first");
					$("span#"+iddd).remove();
					$("input[name=thumbnail]").removeAttr("disabled");
					return false;
				}
				else{
					makeProf = 1;
				}
			}
			if(fname == 'upload_big'){
				
				// load to preview image
				var img_id = 'big';
				
				// get image source , this will be passed into PHP
				$('.img_src').attr('value',imge);				
				$('#previewImg').html('<img src="'+PUBLIC_PATH+'/'+imge+'" />');
				
			}
			$('#div_'+fname).html('<img id="'+img_id+'" src="'+PUBLIC_PATH+'/'+imge+'" '+imgprop+'  />');						
			$('#upload_thumb').show();
			//area select plugin http://odyniec.net/projects/imgareaselect/examples.html
			$('img#big').imgAreaSelect({
				aspectRatio:'1:1',
				handles: true,
				fadeSpeed: 200,
				resizeable:true,
				maxHeight:450,
				maxWidth:450,
				minHeight:50,
				minWidth:50,
				show : true,
				x1: 120,
				y1: 120,
				x2: 320, 
				y2: 320,
				onInit : previewImg,
				onSelectChange: previewImg,
				});
			$("input.imgcls").removeAttr("disabled");
			$("span#"+$("#progress_id").val()).remove();
			$("span#"+iddd).remove();
			$("#content").fadeIn();
			
			// we have to remove the values
			$('.width , .height , .x1 , .y1 , #file').val('');
			if(makeProf==1){
				makeProfileImage("crop");
			}
		}
	  });
  });
});