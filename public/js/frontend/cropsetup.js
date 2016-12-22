$(function($){
  // Create variables (in this scope) to hold the API and image size
  var jcrop_api,
      boundx,
      boundy,
      // Grab some information about the preview pane
      $preview = $('#preview-pane'),
      $pcnt = $('#preview-pane .preview-container'),
      $pimg = $('#preview-pane .preview-container img'),
      xsize = $pcnt.width(),
      ysize = $pcnt.height();
    
   
  $('#cropImgTarget').Jcrop({
    onChange: updatePreview,
    onSelect: updatePreview,
    bgOpacity: 0.5,
    aspectRatio: xsize / ysize
  },function(){
    // Use the API to get the real image size
    var bounds = this.getBounds();
    boundx = bounds[0];
    boundy = bounds[1];

    jcrop_api = this; // Store the API in the jcrop_api variable

    // Move the preview into the jcrop container for css positioning
    $preview.appendTo(jcrop_api.ui.holder);
  });

  function updatePreview(c) {
    if (parseInt(c.w) > 0) {
      var rx = xsize / c.w;
      var ry = ysize / c.h;
        
      $('#x').val(c.x);
      $('#y').val(c.y);
      $('#w').val(c.w);
      $('#h').val(c.h);

      $pimg.css({
        width: Math.round(rx * boundx) + 'px',
        height: Math.round(ry * boundy) + 'px',
        marginLeft: '-' + Math.round(rx * c.x) + 'px',
        marginTop: '-' + Math.round(ry * c.y) + 'px'
      });
    }
  }

});