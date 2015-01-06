'use strict';
var Rx = require('rx');


module.exports = {
  selectFile$: new Rx.Subject(),
  shuffleImage$: new Rx.Subject(),
};
