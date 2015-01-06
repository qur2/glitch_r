'use strict';
var h = require('virtual-hyperscript');
var GlitchModel = require('glitch_r/models/glitch');
var ActiveImageModel = require('glitch_r/models/active_image');
// var GlitchModel = require('glitch_r/models/glitch');
var getImageData = require('glitch_r/utils/image');


function renderImagePreview(glitchConf) {
  var canvas = document.createElement('canvas');
  canvas.style['max-width'] = '400px';
  canvas.width = glitchConf.el.width;
  canvas.height = glitchConf.el.height;

  var imageData = getImageData(glitchConf.el);
  updateImgData(glitchConf.imageData, imageData, glitchConf.pixOrder);
  var ctx = canvas.getContext('2d');
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

var vtree$ = ActiveImageModel.imageActivated$.merge(GlitchModel.imageGlitched$).map(renderImagePreview);


module.exports = {
  vtree$: vtree$
};


function updateImgData(src, dest, pixorder) {
  for (var i = pixorder.length - 1; i >= 0; i--) {
    dest.data[i * 4] = src.data[pixorder[i] * 4];
    dest.data[i * 4 + 1] = src.data[pixorder[i] * 4 + 1];
    dest.data[i * 4 + 2] = src.data[pixorder[i] * 4 + 2];
    dest.data[i * 4 + 3] = src.data[pixorder[i] * 4 + 3];
  }
  return dest;
}
