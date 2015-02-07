import {default as replicate} from '../utils/replicate';
import {settingColor$, settingDirection$, settingAmount$} from '../intents/glitching_spill';
var Rx = require('rx');
var xtend = require('xtend');
import {default as fxConf} from '../fx-config.js';


var _channelConfig$ = new Rx.BehaviorSubject({
  'name': 'channel',
  'values': fxConf[0].params[0].values
});

var _directionConfig$ = new Rx.BehaviorSubject({
  'name': 'direction',
  'values': fxConf[0].params[1].values
});

var _amountConfig$ = new Rx.BehaviorSubject({
  'name': 'amount',
  'values': fxConf[0].params[2].values
});


export var channelConfig$ = _channelConfig$.combineLatest(
  settingColor$.startWith(0),
  (config, color) => {
    return xtend({'active': color}, config);
  });

export var directionConfig$ = _directionConfig$.combineLatest(
  settingDirection$.startWith(0),
  (config, direction) => {
    return xtend({'active': direction}, config);
  });

export var amountConfig$ = _amountConfig$.combineLatest(
  settingAmount$.startWith(0),
  (config, amount) => {
    return xtend({'active': amount}, config);
  });

export default channelConfig$.combineLatest(
  directionConfig$,
  amountConfig$,
  (channel, direction, amount) => {
    return {
      name: 'spill',
      params: [channel, direction, amount]
    };
  });
