'use strict';
var Rx = require('rx');
var events = require('glitch_r/views/events');


var glitchImage$ = new Rx.Subject();

events.shuffleImage$.subscribe(
  function (ev) {
  	console.log(ev);
    glitchImage$.onNext(ev.currentTarget.value + ev.timeStamp);
  },
  function (err) {
    glitchImage$.onError(err);
  });


module.exports = {
    glitchImage$: glitchImage$,
};
