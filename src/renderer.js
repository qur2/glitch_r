'use strict';
/*
 * Renderer component.
 * Subscribes to vtree observables of all view components
 * and renders them as real DOM elements to the browser.
 */
var h = require('virtual-hyperscript');
var VDOM = require('virtual-dom');
var isVirtualNode = require('virtual-dom/vnode/is-vnode');
var DOMDelegator = require('dom-delegator');
import {default as FileSelector} from './views/file_selector';
import {default as ImagePreview} from './views/image_preview';
import {default as renderGlitchControls} from './views/glitch_controls';

var delegator;


function renderVTree(vtree, containerSelector) {
  // Find and prepare the container
  var container = window.document.querySelector(containerSelector);
  if (container === null) {
    console.error('Couldn\'t render into unknown \'' + containerSelector + '\'');
    return false;
  }
  var rootNode;
  if (vtree.subscribe) {
    rootNode = VDOM.create('div');
    vtree.subscribe((vnode) => {
      container.innerHTML = '';
      container.appendChild(isVirtualNode(vnode) ? VDOM.create(vnode) : vnode);
    });
  } else {
    var vnode = vtree();
    rootNode = isVirtualNode(vnode) ? VDOM.create(vnode) : vnode;
    container.appendChild(rootNode);
  }
}

function appendTo(parent, node) {
  parent.appendChild(node);
}
function prependTo(parent, node) {
  parent.insertBefore(node, parent.firstChild);
}

function insertVTree(vtree, containerSelector, prepend) {
  // Find and prepare the container
  var container = window.document.querySelector(containerSelector);
  if (container === null) {
    console.error('Couldn\'t render into unknown \'' + containerSelector + '\'');
    return false;
  }
  var rootNode;
  var f = (prepend && true) ? prependTo : appendTo;
  if (vtree.subscribe) {
    rootNode = VDOM.create('div');
    vtree.subscribe((vnode) => {
      f(container, isVirtualNode(vnode) ? VDOM.create(vnode) : vnode);
    });
  }
}


export default function init() {
  delegator = new DOMDelegator();
  renderVTree(FileSelector, '.file-selector');
  renderVTree(renderGlitchControls, '.glitch-controls');
  insertVTree(ImagePreview, '.image-preview', true);
}
