'use strict';
var Rx = require('rx');
var events = require('glitch_r/views/events');


var glitchImage$ = new Rx.Subject();

events.shuffleImage$.subscribe(
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


module.exports = {
    glitchImage$: glitchImage$,
};
