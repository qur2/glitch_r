'use strict';
var h = require('virtual-hyperscript');
import {selectFile$} from './events';


export default function renderFileSelector() {
  return h('div.uk-form-file', {}, [
      h('a.uk-button.uk-button-primary', {}, 'Choose an image…'),
      h('input', {
        'ev-change': function (ev) { selectFile$.onNext(ev); },
        'type': 'file',
      }),
  ]);
}
