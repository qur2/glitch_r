'use strict';
var Rx = require('rx');
import {imageAdded$} from './image';
import {default as replicate} from '../utils/replicate';
import {default as getImageData} from '../utils/image';


export var imageActivated$ = new Rx.Subject();

replicate(
  imageAdded$.map(function (images) {
    return {
      el: images[0],
      imageData: getImageData(images[0])
    };
  }),
  imageActivated$
);
