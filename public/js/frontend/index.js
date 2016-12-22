/**
 * Created by jsingh7 on 8/10/2016.
 */
$(document).ready(function() {

    /*--Validations for Login form - starts here by RSharma---*/
    $("#login").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
            }
        }
    });

    /*--Validations for Login form - ends here by RSharma---*/

    /*--Validations for registeration step-1 - starts here by RSharma---*/
    var school_url = "/" + PROJECT_NAME + "registration/get-schools-list";
    var company_url = "/" + PROJECT_NAME + "registration/get-all-ref-companies";
    autoComplete('input[type=text]#college', school_url);
    autoComplete('input[type=text]#employed_company', company_url);

    $("#registeration_step1").validate(
        {
            rules: {
                first_name: {
                    required: true,
                    noSpace: true,
                    alphaOnly: true,
                    minlength: 3,
                    maxlength: 30
                },
                last_name: {
                    required: true,
                    noSpace: true,
                    alphaOnly: true,
                    minlength: 3,
                    maxlength: 30
                },
                email: {
                    required: true,
                    email: true,
                    noSpace: true,
                    remote: {
                        url: "/" + PROJECT_NAME + "index/check-email-exist",
                        type: "post",
                        beforeSend: function () {
                            $("div#tick-box-image").html("<img style = 'margin-top: 5px;' src = '" + IMAGE_PATH + "/loading_small_black_purple.gif'>");
                        },
                        complete: function (data) {
                            if (data.responseText == "true") {
                                //console.log('hello');
                                $("div#tick-box-image").html("<img src = '" + IMAGE_PATH + "/tick-white.png' alt='Ok' title='Ok'>");
                            }
                            else {
                                $("div#tick-box-image").html("");
                            }
                        },
                        data: {
                            email: function () {
                                return $("form#registeration_step1 input#email").val();
                            }
                        }
                    }
                },
                password: {
                    required: true,
                    ilook_password: true,
                    minlength: 8,
                    maxlength: 20,
                    noSpace: true

                }
            },
            messages: {
                first_name: {
                    noSpace: "Please enter valid first name"
                },
                last_name: {
                    noSpace: "Please enter valid last name"
                },
                email: {
                    remote: "Not available!",
                }
            }
        });

    /*--Validations for registration step-1 - end here by RSharma---*/

    /*--Validations for registration step-2 - starts here by RSharma---*/
    jQuery.validator.addMethod("specialChars", function (value, element) {
        var regex = new RegExp("^[a-zA-Z0-9_ ]*$");
        var key = value;

        if (!regex.test(key)) {
            return false;
        }
        return true;
    }, "Please do not enter Special Characters");

});

/** function for slideshow on home page
 *
 */
function slideShow() {

    //Set the opacity of all images to 0
    $('#gallery a').css({opacity: 0.0});

    //Get the first image and display it (set it to full opacity)
    $('#gallery a:first').css({opacity: 1.0});

    //Set the caption background to semi-transparent
    $('#gallery .caption').css({opacity: 1});

    //Resize the width of the caption according to the image width
    $('#gallery .caption').css({width: $('#gallery a').find('img').css('width')});

    //Get the caption of the first image from REL attribute and display it
    $('#gallery .slider_content').html($('#gallery a:first').find('img').attr('rel'))
        .animate({opacity: 1}, 400);

    //Call the gallery function to run the slideshow, 6000 = change to next image after 6 seconds
    setInterval('gallery()',6000);

}

function gallery() {

    //if no IMGs have the show class, grab the first image
    var current = ($('#gallery a.show')?  $('#gallery a.show') : $('#gallery a:first'));

    //Get next image, if it reached the end of the slideshow, rotate it back to the first image
    var next = ((current.next().length) ? ((current.next().hasClass('caption'))? $('#gallery a:first') :current.next()) : $('#gallery a:first'));

    //Get next image caption
    var caption = next.find('img').attr('rel');

    //Set the fade in effect for the next image, show class has higher z-index
    next.css({opacity: 0.0})
        .addClass('show')
        .animate({opacity: 1.0}, 1000);

    //Hide the current image
    current.animate({opacity: 0.0}, 1000)
        .removeClass('show');

    //Set the opacity to 0 and height to 1px
    $('#gallery .caption').animate({opacity: 0.0}, { queue:false, duration:50 }).animate({height: '1px'}, { queue:true, duration:300 });

    //Animate the caption, opacity to 0.7 and heigth to 100px, a slide up effect
    $('#gallery .caption').animate({opacity: 1},49 ).animate({height: '49px'},500 );

    //Display the content
    $('#gallery .slider_content').html(caption);

}


