'use strict';
var Rx = require('rx');


export var colorChange$ = new Rx.Subject();
export var directionChange$ = new Rx.Subject();
export var selectFile$ = new Rx.Subject();
export var spillClick$ = new Rx.Subject();
