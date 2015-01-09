'use strict';
var h = require('virtual-hyperscript');
var GlitchModel = require('glitch_r/models/glitch');
var ActiveImageModel = require('glitch_r/models/active_image');
// var GlitchModel = require('glitch_r/models/glitch');
var ImageData = require('glitch_r/utils/image_data_polyfill');


function renderImagePreview(glitchConf) {
  var canvas = document.createElement('canvas');
  canvas.style['max-width'] = '400px';
  canvas.width = glitchConf.el.width;
  canvas.height = glitchConf.el.height;
  var ctx = canvas.getContext('2d');
  ctx.putImageData(glitchConf.imageData, 0, 0);
  return canvas;
}

var vtree$ = ActiveImageModel.imageActivated$.merge(GlitchModel.imageGlitched$).map(renderImagePreview);


module.exports = {
  vtree$: vtree$
};
