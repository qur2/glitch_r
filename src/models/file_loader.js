'use strict';
var Rx = require('rx');
var FileLoadingIntent = require('../intents/file_loading');

// TODO switch to <img> element to avoid src async setting and easy access to width and height attrs

// Use `.scan()` to emit a growing stack of data urls.
// TODO: The stack should probably have a limited size.
var dataURLAdded$ = FileLoadingIntent.addDataURL$.scan([],
  function (acc, dataURL) {
    return acc.concat([dataURL]);
  });

module.exports = {
  dataURLAdded$: dataURLAdded$,
};
