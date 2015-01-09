'use strict';
var Rx = require('rx');
var FileLoadingIntent = require('glitch_r/intents/file_loading');
var replicate = require('glitch_r/utils/replicate');


var imageAdded$ = new Rx.Subject();

replicate(
  FileLoadingIntent.addDataURL$.map(
    loadImagePromise
  ).concatAll().scan([], function (acc, image) {
    return [image].concat(acc);
  }),
  imageAdded$
);


module.exports = {
  imageAdded$: imageAdded$,
};


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
