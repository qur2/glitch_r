'use strict';
import {default as replicate} from '../utils/replicate';
import {glitchingSpill$} from './glitching_spill';
var Rx = require('rx');


/**
 * Big merge of intents for all glitching effects.
 * Enables models to listen to all glitching intents through this subject.
 */
export var glitchImage$ = new Rx.Subject();

replicate(glitchingSpill$, glitchImage$);
