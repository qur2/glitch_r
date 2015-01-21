'use strict';
/* global self, location */
var lcgRand = require('lcg-random');


var params = JSON.parse(decodeURIComponent(location.search.slice(1)));
if (console !== undefined) {
  console.log(params);
}

/**
 * Computes the dual of an array: permutes indexes and values.
 *
 *       0, 1, 2, 3, 4, 5, 6, 7, 8, 9
 * dual([5, 8, 4, 7, 1, 6, 3, 0, 9, 2]);
 *   -> [7, 9, 9, 6, 2, 0, 5, 3, 4, 8]
 *
 * 5 is the 0th element in the input. In the output, 0 is the 5th element.
 *
 * @param  {Array of integers} src The array to permute
 * @return {Array of integers}     The permutted array
 */
function dual(src) {
  var dest = new (src.constructor)(src.length);
  for (var i = src.length-1; i >= 0; i--) {
    dest[src[i]] = i;
  }
  return dest;
}

// Fisher–Yates shuffle
// http://bost.ocks.org/mike/shuffle/
function shuffle(arr) {
  // use a predictable random function for repeatability
  var rand = lcgRand({seed: params.s});
  var m = arr.length, t, i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(rand() * m--);

    // And swap it with the current element.
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }

  return arr;
}

function range(a, z) {
  if (z === undefined) {
    z = a;
    a = 0;
  }
  var i, r = new Uint32Array(z - a);
  for (i = a; i < z; r[i] = i, i++);
  return r;
}

function spillColor(imageData, width, height, params) {
  var i, j, v, vv, c = params.channel || 0;
  for (i = imageData.length-4; i >= 0; i-=4) {
    v = imageData[i+c];
    for (j = params.amount+1; j > 0; j--) {
      vv = imageData[i+c+j*4];
      if (v > vv) {
        imageData[i+c+j*4] = (v + vv) / 2
      }
      vv = imageData[i+c-j*4];
      if (v > vv) {
        imageData[i+c-j*4] = (v + vv) / 2
      }
    }
  }
}

export default function pixProcess(ev) {
  var width = ev.data.width;
  var height = ev.data.height;
  var imageData = new Uint8ClampedArray(ev.data.dataBuffer);
  var glitch;
  switch (ev.data.o) {
    case 'spill': glitch = spillColor; break;
    default: glitch = spillColor;
  }
  glitch(imageData, width, height, params);
  self.postMessage({
    dataBuffer: imageData.buffer
  }, [imageData.buffer]);
  self.close();
};

self.onmessage = pixProcess;
