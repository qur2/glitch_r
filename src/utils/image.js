'use strict';


export default function getImageData(image) {
  var canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
