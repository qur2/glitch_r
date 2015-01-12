'use strict';
var h = require('virtual-hyperscript');
import {shuffleImage$} from './events';


export default function renderGlitchControls() {
  return h('div.topButtons', {}, [
    h('button', {
      'ev-click': function (ev) { shuffleImage$.onNext(ev); },
      'type': 'button',
      'value': 'spill-red'
    }, 'Spill red'),
    h('button', {
      'ev-click': function (ev) { shuffleImage$.onNext(ev); },
      'type': 'button',
      'value': 'spill-blue'
    }, 'Spill blue'),
    h('button', {
      'ev-click': function (ev) { shuffleImage$.onNext(ev); },
      'type': 'button',
      'value': 'spill-green'
    }, 'Spill green')
  ]);
}
