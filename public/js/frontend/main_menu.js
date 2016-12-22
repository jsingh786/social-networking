var call_get_count;
var call_link_count;
$( document ).ready(function() {
	$('input[name=Filedata]').change(function(){
		getImage();		
	});
	
	$('#profileimg').click(function(e) {
		$("div#content").empty();
		displayImageUploadMsg();
	});
	// for minimize click image
	$('#editProfileImg2').click(function(e) {
		$("div#content").empty();
		displayImageUploadMsg();
	});
	$("#removeImage").click(function(){
		if($("#remImg").val()!=""){
			removeImage();
		}
	});
	clickForImagePreview();
	$("img#closePopup").click(function(){
		$("#magnify").bPopup().close();
		$("#popupPreview").empty();
	});
	
	
	$('body').on('click','img#rotate_image_view_popup.rotate_icon',function(){
		
		//Removeing this class untill ajax completes so that 
		//once image roatates successfully only then next call can be made.
		$(this).removeClass('rotate_icon');
		elem = this;
		var img_src         = $('input#prof_pic').val();
		
		var res_arr		    = img_src.split("/");
		var fullArr  	    = res_arr.length;
		var arrIndex		= parseInt(fullArr)-parseInt(1);
		var prof_pic_name   = res_arr[arrIndex];
		jQuery.ajax({
	        url: "/" + PROJECT_NAME + "profile/rotate-profile-picture-thumbnails",
	        type: "POST",
	        dataType: "json",
	        data: {'prof_pic_name':prof_pic_name },
//			cache: false,
	        timeout: 50000,
	        success: function(jsonData) 
	        {
	        	$(elem).addClass('rotate_icon');
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
	        		
	        		//popup image rotation with css.
	        		//Adding css Class.
	      		  	$('img#orignalImage').addClass("rotate_small"+angle);
	      		  	//Removing previous angle/css class.
	      		  	$('img#orignalImage').removeClass("rotate_small"+remove_angle);
	      		  	
	      		  	//menu_maximize image rotation.
	      		  	//Adding css Class.
	      		  	$('img#profileLogo_small').addClass("rotate_small"+angle);
	      			//Removing previous angle/css class.
	      		  	$('img#profileLogo_small').removeClass("rotate_small"+remove_angle);
	      		  	
	      		  	//menu_minimize image rotation.
	      		  	//Adding css Class.
	      		  	$('img#profileLogo').addClass("rotate_small"+angle);
	      			//Removing previous angle/css class.
	      		  	$('img#profileLogo').removeClass("rotate_small"+remove_angle);
	      		  	
	      		  	//Set new rotation angle.
	      		  	$('input#rotation_angle').val(parseInt(angle)+parseInt(90));
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

function clickForImagePreview(){
	$("div.profileImg").unbind();
	$("div.profileImg").click(function(){
		if($( "div.profilePic" ).hasClass( "profileImg" )){
			$("#popupPreview").empty();
			$("#popupPreview").html('<img id="orignalImage" src="/'+PROJECT_NAME+'public/images/loading_large_black.gif" style="max-width:800px;max-height:600px;" />');
			$("#magnify").bPopup({amsl:0});
			getOriginalImage($(this).attr("rel"));	
		};	
	});
}
function getOriginalImage(uid){
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/get-orignal-image",
		method : "POST",
		data : "user_id="+uid,
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			
				if(jsonData == PREVIEW_NOT_AVAILABLE){
					$("#popupPreview").empty();
					$("#popupPreview").html("<p style='color:white;font-size:18px;font-weight:bold;'>Sorry, image preview not available.</p>");
				}
				else{
					$("#popupPreview").empty();
					$("#popupPreview").html('<img id="orignalImage" src="'+jsonData.fullImagePath+'" style="max-width:800px;max-height:600px;" />');
					if(jsonData.my_image)
					{
						$('div#magnify div#rotate_img').html('<img title="rotate right 90deg" class="rotate_icon" id="rotate_image_view_popup" src ="'+IMAGE_PATH+'/rotate-icon.png"/>');
					}
					$('input#prof_pic').val(jsonData.fullImagePath);
				}
			}
		});
}

// function used to display message for upload profile image.
function displayImageUploadMsg(){
	var html="";
	html=html+'<div id="uploadMsg" style="color: #48545E;font-size: 24px; text-align: center;margin-top: 250px; height: 302px;">';
	html=html+'Upload Your Profile Image.';
	html=html+'</div>';
	$("#content").append(html);
	$("#content").css("display","block");
	$("div#wrap").bPopup({
		modalClose: false,
		closeClass : 'close_bpopup',
		positionStyle: 'fixed',
		zIndex: 4
    });
}

// function used to Upload Image for cropping purpose.
function getImage(){
	
	var formData = new FormData($("#uploadProfileImg")[0]);
	$('div#dvLoading').show();
    $.ajax({
        url: "/" + PROJECT_NAME + "profile/upload-crop-img",
        type: 'POST',
        beforeSend:function(){
        },
        data: formData,
        async: false,
        success: function (response_data) {
        	if(response_data==1){
	        		$('#dvLoading').hide();
	        		$(".alert-box").remove();
	        		$(".alert-box1").remove();
	        		showDefaultMsg( "Please upload file with jpeg,bmp,jpg,png format.", 2 );
			   }
			   else if(response_data==2){
				   $('#dvLoading').hide();
				   $(".alert-box").remove();
				   $(".alert-box1").remove();
				   showDefaultMsg( "Upload less than 2mb image size.", 2 );
			   }
			   else if(response_data==3){
				   $('#dvLoading').hide();
				   $(".alert-box").remove();
				   $(".alert-box1").remove();
				   showDefaultMsg( "Due to some server error we can't upload your image.", 2 );
			   }
			   else if(response_data==4){
				   $('#dvLoading').hide();
				   $(".alert-box").remove();
				   $(".alert-box1").remove();
				   showDefaultMsg( "Some server problems occured.", 2 );
			   }
			   else{
				   var img_name=response_data.split("/");
				   $("#imgc").attr("src", IMAGE_PATH+"/profile/crop_thumbnails/"+img_name[3]);
				   $("#prev").attr("src", IMAGE_PATH+"/profile/crop_thumbnails/"+img_name[3]);
				   $("#cropimg").bPopup();
			   }
        },
        cache: false,
        contentType: false,
        processData: false
    });
    return false;
}
// with this function user can remove his profie image
// @author: Sunny Patial.
function removeImage(){
	var filepath=$("#remImg").val();
	$('#dvLoading').show();
	$.ajax({
		url : "/" + PROJECT_NAME + "profile/remove-image",
		method : "POST",
		data : "filepath="+filepath,
		type : "post",
		dataType : "json",
		success : function(jsonData) {
			if(jsonData){
				$("#profileimg").html("Upload");
				$("#sremid").hide();
				$("#profileLogo").attr("src","/" + PROJECT_NAME + "public/images/profile/"+jsonData.image);
				$("#profileLogo_small").attr("src","/" + PROJECT_NAME + "public/images/profile/"+jsonData.smallImage);
				$('#dvLoading').hide();
				$("#remImg").val("");	
				$(".alert-box").remove();
				showDefaultMsg( "Profile image successfully removed.", 1 );
				$(".profile-img-closed").removeClass("profileImg");
            	$(".profile-img").removeClass("profileImg");
            	clickForImagePreview();
			}
		}
	});
}
