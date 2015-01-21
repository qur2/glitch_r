import {default as replicate} from '../utils/replicate';
import {settingColor$, settingDirection$} from '../intents/glitching_spill';
var Rx = require('rx');
var xtend = require('xtend');


var _channelConfig$ = new Rx.BehaviorSubject({
	'name': 'channel',
	'values': ['red', 'green', 'blue']
});

var _directionConfig$ = new Rx.BehaviorSubject({
	'name': 'direction',
	'values': ['horizontal', 'vertical', 'bidirectional']
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
