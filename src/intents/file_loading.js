'use strict';
var Rx = require('rx');
import {selectFile$} from '../views/events';


// Internals for file reading mechanics:
// From the raw view event, read the file and push its content as a data URL.
var fileReader = new FileReader();
var fileObserver = Rx.Observer.create(function (file) {
  fileReader.readAsDataURL(file);
});
var fileObservable = Rx.Observable.create(function (obs) {
  fileReader.onloadend = function () {
    obs.onNext(fileReader.result);
  };
  fileReader.onerror = function () {
    obs.onError(fileReader.error);
  };
});

export var addDataURL$ = Rx.Subject.create(fileObserver, fileObservable);

selectFile$.subscribe(
  function (ev) {
    addDataURL$.onNext(ev.currentTarget.files[0]);
  },
  function (err) {
    addDataURL$.onError(err);
  });
