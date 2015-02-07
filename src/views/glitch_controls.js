/** @jsx h */
'use strict';
import {default as fxConf} from '../fx-config.js';
import {default as replicate} from '../utils/replicate';
import {default as spillConfig$} from '../models/spill';
import {spillClick$, colorChange$, directionChange$, amountChange$} from './events';
var h = require('virtual-hyperscript');
var Rx = require('rx');
var xtend = require('xtend');


var controlTypes = fxConf.reduce((acc, fx) => {
  var o = {};
  fx.params.map((param) => {
    o[param.name] = param.type;
  });
  return xtend(acc, o);
}, {});

var paramSubjects = {
  channel: colorChange$,
  direction: directionChange$,
  amount: amountChange$
};

function renderEnum(config, subject$) {
  return h('div.uk-button-group', {}, [
      h('button.uk-button.q-button-label', {disabled: true}, config.name)
    ].concat(config.values.map((v, i) => {
    return h('button.uk-button',
      {
        'ev-click': function (ev) { subject$.onNext(ev); },
        'type': 'button',
        'value': v,
        'className': i == config.active ? 'uk-button-primary' : ''
      }, buttonSymbols[v])
  })));
}

// style input fields and tune event handling!!!!!!

function renderRange(config, subject$) {
  return h('div.uk-button-group', {}, [
    h('button.uk-button.q-button-label', {disabled: true}, config.name),
    h('input.uk-form-small',
      {
        'ev-blur': function (ev) { subject$.onNext(ev); },
        'type': 'number',
        'value': config.active,
        'min': config.values[0],
        'max': config.values[1] || 10,
        'step': config.values[2] || 1,
      })
  ]);
}

function renderInput(config) {
  var type = controlTypes[config.name];
  var subject$ = paramSubjects[config.name];
  var render;
  switch (type) {
    case 'range': render = renderRange; break;
    default: render = renderEnum;
  }
  return render(config, subject$);
}

export default spillConfig$.map((config) => {
    return h('fieldset', {}, config.params.map(renderInput).concat([
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
