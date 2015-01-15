'use strict';
var Rx = require('rx');
import {spill$} from '../views/events';


export var glitchImage$ = new Rx.Subject();

spill$.subscribe(
  function (evs) {
    var o = evs[0].currentTarget.value;
    var color = evs[1].currentTarget.value;
    var direction = evs[2].currentTarget.value;
    glitchImage$.onNext({
      o: o,
      t: evs[0].timeStamp,
      extra: {
        channel: color == 'red' ? 0 : (color == 'green' ? 1 : 2),
        direction: direction,
        amount: 2
      }
    });
  },
  function (err) {
    glitchImage$.onError(err);
  });
