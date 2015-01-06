'use strict';
var h = require('virtual-hyperscript');
var events = require('glitch_r/views/events');


function renderFileSelector() {
  return h('div.topButtons', {}, [
    h('input', {
      'ev-change': function (ev) { events.selectFile$.onNext(ev); },
      'type': 'file'
    })
  ]);
}


module.exports = {
  vtree: renderFileSelector,
  // renderFileSelector: renderFileSelector
};
