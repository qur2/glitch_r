'use strict';
var h = require('virtual-hyperscript');
var events = require('glitch_r/views/events');


function renderGlitchControls() {
  return h('div.topButtons', {}, [
    h('button', {
      'ev-click': function (ev) { events.shuffleImage$.onNext(ev); },
      'type': 'button',
      'value': 'shuffle'
    }, 'Shuffle!')
  ]);
}


module.exports = {
  vtree: renderGlitchControls,
  // renderFileSelector: renderFileSelector
};
