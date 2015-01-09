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
      imageData: getImageData(images[0])
    };
  }),
  imageActivated$
);


module.exports = {
  imageActivated$: imageActivated$,
};
