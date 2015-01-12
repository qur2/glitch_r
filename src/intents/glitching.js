'use strict';
var Rx = require('rx');
import {shuffleImage$} from '../views/events';


export var glitchImage$ = new Rx.Subject();

shuffleImage$.subscribe(
  function (ev) {
    var v = ev.currentTarget.value.split('-');
    glitchImage$.onNext({
      o: v[0],
      t: ev.timeStamp,
      extra: {
        channel: v[1] == 'red' ? 0 : (v[1] == 'green' ? 1 : 2),
        amount: 2
      }
    });
  },
  function (err) {
    glitchImage$.onError(err);
  });
