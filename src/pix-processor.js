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
  var i, r = new Int32Array(z - a + 1);
  for (i = 0; i <= z - a; i++) r[i] = z - i;
  return r;
}
function range(a, z, step) {
  if (arguments.length == 1) {
    z = a; a = 0; step = 1;
  }
  else if (arguments.length == 2) {
    step = 1;
  }
  var i, r = [];
  for (i = a; i < z; i += step) r.push(i);
  return r;
};

function getHorizontalNeighbors(i, n, width, height) {
  return range(-n+i, i).concat(i+1, n+i+1);
}
function getVerticalNeighbors(i, n, width, height) {
  return range(-n*width+i, i, width).concat(range(i, (n+1)*width+i, width).slice(1));
}

function spillColor(imageData, draft, width, height, params) {
  var i, j, v, vv, c = params.channel || 0, pixels, area;
  if (params.direction == 0) {
    area = getHorizontalNeighbors;
  } else if (params.direction == 1) {
    area = getVerticalNeighbors;
  } else {
    area = function (i, n, w, h) {
      return getHorizontalNeighbors(i, n, w, h).concat(
        getVerticalNeighbors(i, n, w, h)
      );
    }
  }
  pixels = area(width * height - 1, params.amount, width, height);
  for (i = width * height - 1; i >= 0; i--) {
    v = imageData[i*4+c];
    for (j = pixels.length-1; j >= 0; j--) {
      vv = imageData[pixels[j]*4+c];
      if (v > vv) {
        draft[pixels[j]*4+c] = (v + vv) / 2;
      }
      // decrement neighbor for next iteration instead of recomputing
      // the array
      pixels[j]--;
    }
  }
  return draft;
}

function whiteUpDarkDown(imageData, draft, width, height, params) {
  var i, j, v, pixels, treshold = 190;
  pixels = getVerticalNeighbors(width * height - 1, params.amount, width, height);
  for (i = width * height - 1; i >= 0; i--) {
    v = imageData[i*4] + imageData[i*4+1] + imageData[i*4+2];
    if (v < treshold) {
      // darken lower pixels
      for (j = pixels.length-1; j >= params.amount; j--) {
        draft[pixels[j]*4] /= 2;
        draft[pixels[j]*4+1] /= 2;
        draft[pixels[j]*4+2] /= 2;
      }
    }
    if (v > 255 * 3 - treshold) {
      // lighten upper pixels
      for (j = pixels.length/2; j >= 0; j--) {
        draft[pixels[j]*4] *= 1.5;
        draft[pixels[j]*4+1] *= 1.5;
        draft[pixels[j]*4+2] *= 1.5;
      }
    }
    for (j = pixels.length-1; j >= 0; j--) {
      // decrement neighbor for next iteration instead of recomputing
      // the array
      pixels[j]--;
    }
  }
  return draft;
}

export default function pixProcess(ev) {
  var width = ev.data.width;
  var height = ev.data.height;
  var imageData = new Uint8ClampedArray(ev.data.dataBuffer);
  // TODO Would be faster with an empty array rather than a copy?
  // var draft = new Uint8ClampedArray(new ArrayBuffer(ev.data.dataBuffer.byteLength));
  var draft = new Uint8ClampedArray(ev.data.dataBuffer.slice(0));
  var glitch;
  switch (ev.data.o) {
    case 'spill': glitch = spillColor; break;
    case 'bwsplit': glitch = whiteUpDarkDown; break;
  }
  glitch(imageData, draft, width, height, params);
  self.postMessage({
    dataBuffer: draft.buffer
  }, [draft.buffer]);
  self.close();
};

self.onmessage = pixProcess;
