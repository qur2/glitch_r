'use strict';
var Rx = require('rx');
import {addDataURL$} from '../intents/file_loading';
import {default as replicate} from '../utils/replicate';


export var imageAdded$ = new Rx.Subject();

replicate(
  addDataURL$.map(
    loadImagePromise
  ).concatAll().scan([], function (acc, image) {
    return [image].concat(acc);
  }),
  imageAdded$
);

/**
 * Using the given `dataURL`, creates a <img> tag.
 * It's embedded in a promise for `onload` async mechanic.
 * @see  http://stackoverflow.com/questions/4776670/should-setting-an-image-src-to-data-url-be-available-immediately
 * @param  {String} dataURL
 * @return {Image}
 */
function loadImagePromise(dataURL) {
  var p = new Promise(function(resolve, reject) {
    var img = document.createElement('img');
    img.onload = function () {
      resolve(img);
    };
    img.onerror = function(err) {
      reject(err);
    };
    img.src = dataURL;
  });
  return p;
}
