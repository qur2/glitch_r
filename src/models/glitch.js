'use strict';
var Rx = require('rx');
var GlitchingIntent = require('glitch_r/intents/glitching');
var ImageActivatedModel = require('glitch_r/models/active_image');
var replicate = require('glitch_r/utils/replicate');
var ImageData = require('glitch_r/utils/image_data_polyfill');
var extend = require('xtend');


var seed = Date.now();

var imageGlitched$ = new Rx.Subject();

/**
 * This is a bit tricky: an observable is replicated in a subject and this subject is used to feed the observable.
 * @param  {[type]} a              [description]
 * @param  {[type]} b)             [description]
 * @param  {[type]} imageGlitched$ [description]
 * @return {[type]}                [description]
 */
replicate(
  GlitchingIntent.glitchImage$.combineLatest(
    ImageActivatedModel.imageActivated$.merge(imageGlitched$),
    function (a, b) {
      return extend(a, b);
    }).distinctUntilChanged(
    function (glitchConf) {
      return glitchConf.t;
    }).map(glitchImagePromise).concatAll(),
  imageGlitched$
);


module.exports = {
  imageGlitched$: imageGlitched$,
  seed: seed
};


function glitchImagePromise(glitchConf) {
  console.log(glitchConf);
  var p = new Promise(function(resolve, reject) {
    var worker = new Worker('/dist/js/pixel_compute.js?' + JSON.stringify(glitchConf.extra));
    worker.onmessage = function (ev) {
      resolve({
        el: glitchConf.el,
        imageData: new ImageData(
          new Uint8ClampedArray(ev.data.dataBuffer),
          glitchConf.el.width,
          glitchConf.el.height
        ),
      });
    };
    worker.onerror = function(err) {
      reject(err);
    };
    worker.postMessage({
      dataBuffer: glitchConf.imageData.data.buffer,
      width: glitchConf.imageData.width,
      height: glitchConf.imageData.height,
      o: glitchConf.o
    }, [glitchConf.imageData.data.buffer]);
  });
  return p;
}
