<?php 
ini_set('memory_limit', '98M');

$o_file = $_GET['image'];
$t_ht = $_GET['h'];
$t_wd = $_GET['w'];
$image_info = getImageSize($o_file);
if(!$image_info)
{
	$o_file="images/images.jpg";
	$image_info = getImageSize($o_file);
}
switch ($image_info['mime']) {
        case 'image/gif':
            if (imagetypes() & IMG_GIF)  { // not the same as IMAGETYPE
                $o_im = imageCreateFromGIF($o_file) ;
            } else {
                $ermsg = 'GIF images are not supported<br />';
            }
            break;
        case 'image/jpeg':
            if (imagetypes() & IMG_JPG)  {
                $o_im = imageCreateFromJPEG($o_file) ;
            } else {
                $ermsg = 'JPEG images are not supported<br />';
            }
            break;
        case 'image/png':
            if (imagetypes() & IMG_PNG)  {
                $o_im = imageCreateFromPNG($o_file) ;
            } else {
                $ermsg = 'PNG images are not supported<br />';
            }
            break;
        case 'image/wbmp':
            if (imagetypes() & IMG_WBMP)  {
                $o_im = imageCreateFromWBMP($o_file) ;
            } else {
                $ermsg = 'WBMP images are not supported<br />';
            }
            break;
        default:
            $ermsg = $image_info['mime'].' images are not supported<br />';
            break;
    }
	if (!isset($ermsg)) {
		
        $o_wd = imagesx($o_im) ;
        $o_ht = imagesy($o_im) ;
		$t_wd = round($o_wd * $t_ht / $o_ht) ;
        $t_im = imageCreateTrueColor($t_wd,$t_ht);
		imageCopyResampled($t_im, $o_im, 0, 0, 0, 0, $t_wd, $t_ht, $o_wd, $o_ht);
		header("Content-type: image/jpeg");
		imageJPEG($t_im,null,60);
		
	}
?>


