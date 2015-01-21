'use strict';
import {channelConfig$, directionConfig$} from '../models/spill';
import {default as replicate} from '../utils/replicate';
import {spillClick$, colorChange$, directionChange$} from './events';
var h = require('virtual-hyperscript');
var Rx = require('rx');


function renderOptions(config, channel) {
  return h('div.glitch-param', {}, config.values.map((v, i) => {
    return h('button',
      {
        'ev-click': function (ev) { channel.onNext(ev); },
        'type': 'button',
        'value': v,
        'className': i == config.active ? 'active' : ''
      }, buttonSymbols[v])
  }));
}

export default channelConfig$.combineLatest(
  directionConfig$,
  (channel, direction) => {
    return {'channel': channel, 'direction': direction};
  }).map((configs) => {
    return h('div.glitch-control', {}, [
      renderOptions(configs.channel, colorChange$),
      renderOptions(configs.direction, directionChange$),
      h('div.glitch-param', {}, [
        h('button',
          {
            'ev-click': function (ev) { spillClick$.onNext(ev); },
            'type': 'button',
            'value': 'spill'
          }, 'GO!'),
      ])
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

function renderGlitchControls() {
  return h('div.glitch-control', {}, [
    h('div.glitch-param', {}, [
      h('button',
        {
          'ev-click': function (ev) { direction$.onNext(ev); },
          'type': 'button',
          'value': 'horizontal'
        }, '↔'),
      h('button',
        {
          'ev-click': function (ev) { direction$.onNext(ev); },
          'type': 'button',
          'value': 'vertical'
        }, '↕'),
      h('button',
        {
          'ev-click': function (ev) { direction$.onNext(ev); },
          'type': 'button',
          'value': 'cross'
        }, '✛'),
    ]),
    h('div.glitch-param', {}, [
      h('button',
        {
          'ev-click': function (ev) { color$.onNext(ev); },
          'type': 'button',
          'value': 'red'
        }, 'R'),
      h('button',
        {
          'ev-click': function (ev) { color$.onNext(ev); },
          'type': 'button',
          'value': 'green'
        }, 'G'),
      h('button',
        {
          'ev-click': function (ev) { color$.onNext(ev); },
          'type': 'button',
          'value': 'blue'
        }, 'B'),
    ]),
    h('div.glitch-param', {}, [
      h('button',
        {
          'ev-click': function (ev) { spillClick$.onNext(ev); },
          'type': 'button',
          'value': 'spill'
        }, 'GO!'),
    ]),
  ]);
}
