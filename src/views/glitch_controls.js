/** @jsx h */
'use strict';
import {default as spillConfig$} from '../models/spill';
import {default as replicate} from '../utils/replicate';
import {spillClick$, colorChange$, directionChange$, amountChange$} from './events';
var h = require('virtual-hyperscript');
var Rx = require('rx');


var paramSubjects = {
  channel: colorChange$,
  direction: directionChange$,
  amount: amountChange$
};

function renderEnum(config) {
  return h('div.uk-button-group', {}, [
      h('button.uk-button.q-button-label', {disabled: true}, config.name)
    ].concat(config.values.map((v, i) => {
    return h('button.uk-button',
      {
        'ev-click': function (ev) { paramSubjects[config.name].onNext(ev); },
        'type': 'button',
        'value': v,
        'className': i == config.active ? 'uk-button-primary' : ''
      }, buttonSymbols[v] || v)
  })));
}

export default spillConfig$.map((config) => {
    return h('fieldset', {}, config.params.map(renderEnum).concat([
      h('button.uk-button.uk-button-small',
        {
          'ev-click': function (ev) { spillClick$.onNext(ev); },
          'type': 'button',
          'value': 'spill'
        }, 'Spill!')
    ]));
  });

var buttonSymbols = {
  'horizontal': '━',
  'vertical': '┃',
  'bidirectional': '✛',
  // http://codepoints.net/mathematical_alphanumeric_symbols
  'red': '𝖱',
  'green': '𝖦',
  'blue': '𝖡',
};
