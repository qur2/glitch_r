'use strict';
import {default as fxConf} from '../fx-config.js';
import {default as replicate} from '../utils/replicate';
import {spillClick$, colorChange$, directionChange$, amountChange$} from '../views/events';
var Rx = require('rx');
var xtend = require('xtend');


var paramMap = fxConf.reduce((acc, fx) => {
  var o = {};
  fx.params.map((param) => {
    o[param.name] = param.values;
  });
  return xtend(acc, o);
}, {});

export var glitchingSpill$ = new Rx.Subject();
export var settingColor$ = new Rx.Subject();
export var settingDirection$ = new Rx.Subject();
export var settingAmount$ = new Rx.Subject();

replicate(
  colorChange$.map(function (ev) {
    return paramMap['channel'].indexOf(ev.currentTarget.value);
  }),
  settingColor$
);
replicate(
  directionChange$.map(function (ev) {
    return paramMap['direction'].indexOf(ev.currentTarget.value);
  }),
  settingDirection$
);
replicate(
  amountChange$.map(function (ev) {
    return parseInt(ev.currentTarget.value) || 1;
  }),
  settingAmount$
);

replicate(
  spillClick$.withLatestFrom(
    settingColor$.startWith(0), settingDirection$.startWith(0), settingAmount$.startWith(0),
    (clickEv, color, direction, amount) => {
      return {
        o: 'spill',
        t: clickEv.timeStamp,
        extra: {channel: color, direction: direction, amount: amount}
      };
    }),
  glitchingSpill$
);
