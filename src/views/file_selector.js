'use strict';
var h = require('virtual-hyperscript');
import {selectFile$} from './events';


export default function renderFileSelector() {
  return h('div.topButtons', {}, [
    h('input', {
      'ev-change': function (ev) { selectFile$.onNext(ev); },
      'type': 'file'
    })
  ]);
}
