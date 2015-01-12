'use strict';
var h = require('virtual-hyperscript');
import {imageGlitched$} from '../models/glitch';
import {imageActivated$} from '../models/active_image';
import {default as ImageData} from '../utils/image_data_polyfill';


function renderImagePreview(glitchConf) {
  var canvas = document.createElement('canvas');
  canvas.style['max-width'] = '400px';
  canvas.width = glitchConf.el.width;
  canvas.height = glitchConf.el.height;
  var ctx = canvas.getContext('2d');
  ctx.putImageData(glitchConf.imageData, 0, 0);
  return canvas;
}

export default imageActivated$.merge(imageGlitched$).map(renderImagePreview);
