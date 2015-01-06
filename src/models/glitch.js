'use strict';
var Rx = require('rx');
var GlitchingIntent = require('glitch_r/intents/glitching');
var ImageActivatedModel = require('glitch_r/models/active_image');
var replicate = require('glitch_r/utils/replicate');
// var FileLoadingIntent = require('../intents/file_loading');


var imageGlitched$ = new Rx.Subject();

replicate(
  GlitchingIntent.glitchImage$.combineLatest(
    ImageActivatedModel.imageActivated$.merge(imageGlitched$),
    function (a, b) {
      return {
        el: b.el,
        glitch: a,
        imageData: b.imageData,
        pixOrder: b.pixOrder
      };
    }).distinctUntilChanged(
    function (glitchConf) {
      return glitchConf.glitch;
    }).map(glitchImagePromise).concatAll(),
  imageGlitched$
);


module.exports = {
  imageGlitched$: imageGlitched$,
};


function glitchImagePromise(glitchConf) {
  var p = new Promise(function(resolve, reject) {
    var worker = new Worker('/src/utils/pixel_compute.js?w=' + glitchConf.el.width + '&i=' + 1 + '&o=shuffle');
    worker.onmessage = function (evt) {
      resolve({
        el: glitchConf.el,
        imageData: glitchConf.imageData,
        pixOrder: new Uint32Array(evt.data)
      });
    };
    worker.onerror = function(err) {
      reject(err);
    };
    worker.postMessage(
      glitchConf.pixOrder.buffer,
      [glitchConf.pixOrder.buffer]
    );
  });
  return p;
}
