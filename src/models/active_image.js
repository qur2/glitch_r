'use strict';
var Rx = require('rx');
var ImageModel = require('glitch_r/models/image');
var replicate = require('glitch_r/utils/replicate');
var getImageData = require('glitch_r/utils/image');


var imageActivated$ = new Rx.Subject();

replicate(
  ImageModel.imageAdded$.map(function (images) {
    return {
      el: images[0],
      imageData: getImageData(images[0]),
      pixOrder: range(images[0].height * images[0].width)
    };
  }),
  imageActivated$
);


module.exports = {
  imageActivated$: imageActivated$,
};


function range(a, z) {
  if (z === undefined) {
    z = a;
    a = 0;
  }
  var i, r = new Uint32Array(z - a);
  for (i = a; i < z; r[i] = i, i++);
  return r;
}
