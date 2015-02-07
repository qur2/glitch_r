'use strict';
import {default as replicate} from '../utils/replicate';
import {spillClick$, colorChange$, directionChange$, amountChange$} from '../views/events';
var Rx = require('rx');


var channelMap = {
  red: 0, green: 1, blue: 2
};
var directionMap = {
  horizontal: 0,
  vertical: 1,
  bidirectional: 2
};
var amountMap = {
  1: 0,
  2: 1,
  5: 2
};

export var glitchingSpill$ = new Rx.Subject();
export var settingColor$ = new Rx.Subject();
export var settingDirection$ = new Rx.Subject();
export var settingAmount$ = new Rx.Subject();

replicate(
  colorChange$.map(function (ev) {
    return channelMap[ev.currentTarget.value] || 0;
  }),
  settingColor$
);
replicate(
  directionChange$.map(function (ev) {
    return directionMap[ev.currentTarget.value] || 0;
  }),
  settingDirection$
);
replicate(
  amountChange$.map(function (ev) {
    return amountMap[ev.currentTarget.value] || 0;
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
