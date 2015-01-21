'use strict';
var Rx = require('rx');
var extend = require('xtend');
import {glitchImage$} from '../intents/glitching';
import {imageActivated$} from './active_image';
import {default as replicate} from '../utils/replicate';
import {default as ImageData} from '../utils/image_data_polyfill';


export var seed = Date.now();
export var imageGlitched$ = new Rx.Subject();
var imageAddedOrGlitched$ = imageActivated$.merge(imageGlitched$);

/**
 * This is a bit tricky: an observable is replicated in a subject and this subject is used to feed the observable.
 * TODO Simplify using withLatestFrom when available.
 * @param  {[type]} a              [description]
 * @param  {[type]} b)             [description]
 * @param  {[type]} imageGlitched$ [description]
 * @return {[type]}                [description]
 */
replicate(
  glitchImage$.withLatestFrom(
    imageAddedOrGlitched$,
    function (g, i) {
      return extend(g, i);
    }).filter(
      function (g) {
        // discard object referencing a neutered array
        return g.imageData.data.length > 0;
      }).map(glitchImagePromise).concatAll(),
  imageGlitched$
);

function glitchImagePromise(glitchConf) {
  var p = new Promise(function(resolve, reject) {
    var worker = new Worker('/dist/js/pix-processor.js?' + JSON.stringify(glitchConf.extra));
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
