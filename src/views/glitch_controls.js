'use strict';
import {channelConfig$, directionConfig$} from '../models/spill';
import {default as replicate} from '../utils/replicate';
import {spillClick$, colorChange$, directionChange$} from './events';
var h = require('virtual-hyperscript');
var Rx = require('rx');


function renderOptions(title, config, subject$) {
  return h('div.uk-button-group', {}, [
      h('button.uk-button.uk-button-small', {disabled: true}, title)
    ].concat(config.values.map((v, i) => {
    return h('button.uk-button.uk-button-small',
      {
        'ev-click': function (ev) { subject$.onNext(ev); },
        'type': 'button',
        'value': v,
        'className': i == config.active ? 'uk-button-primary' : ''
      }, buttonSymbols[v])
  })));
}

export default channelConfig$.combineLatest(
  directionConfig$,
  (channel, direction) => {
    return {'channel': channel, 'direction': direction};
  }).map((configs) => {
    return h('fieldset', {}, [
      renderOptions('color', configs.channel, colorChange$),
      renderOptions('direction', configs.direction, directionChange$),
      h('button.uk-button.uk-button-small',
        {
          'ev-click': function (ev) { spillClick$.onNext(ev); },
          'type': 'button',
          'value': 'spill'
        }, 'Spill!'),
    ]);
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
