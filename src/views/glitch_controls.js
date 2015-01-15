'use strict';
import {default as replicate} from '../utils/replicate';
import {spill$} from './events';
var h = require('virtual-hyperscript');
var Rx = require('rx');


var color$ = new Rx.Subject();
var direction$ = new Rx.Subject();
var spillClick$ = new Rx.Subject();

var colorAndDirection$ = color$.combineLatest(
  direction$,
  (colorEv, directionEv) => {
    return [colorEv, directionEv];
  });

replicate(
  spillClick$.combineLatest(
    colorAndDirection$,
    (clickEv, colorAnddirectionEvs) => {
      return [clickEv].concat(colorAnddirectionEvs);
    }).distinctUntilChanged(
    (evs) => {
      // fire only when the click is updated
      return evs[0].timeStamp;
    }),
    spill$
);

export default function renderGlitchControls() {
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
