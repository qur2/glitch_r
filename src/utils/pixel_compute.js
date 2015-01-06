function parseQS(qs) {
  var o = {}, param, k, v;
  qs.substr(1).split("&").forEach(function (item) {
    param = item.split("=");
    o[param[0]] = decodeURIComponent(param[1]);
  });
  return o;
}

var params = parseQS(this.location.search);
console.log(params);


function glitch(pixOrder, iterCount, width) {
  while (iterCount--) {
    _sort(pixOrder, width);
  }
}

function _sort(m, l) {
  var tmp, more = false;
  for (var i = 0, ii = m.length; i < ii; i++) {
    // if i'm bigger than the element under me
    if (m[i] > m[i + l]) {
      // if i should be on a row bigger than the one i'm on currently
      if (Math.floor(m[i] / l) > Math.floor(i / l)) {
        tmp = m[i];
        m[i] = m[i + l];
        m[i + l] = tmp;
        more = true;
      // if i belong to the row i'm on currently
      // } else {
      //     tmp = m[i+l];
      //     m.splice(i+l, 1);
      //     m.splice(i, 0, tmp);
      }
    }
    // if i'm bigger than my right neighbor
    else if (m[i] > m[i + 1]) {
      tmp = m[i];
      m[i] = m[i + 1];
      m[i + 1] = tmp;
      more = true;
    }
  }
  return more;
}


// Fisher–Yates shuffle
// http://bost.ocks.org/mike/shuffle/
function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}


onmessage = function (ev) {
  var pixOrder = new Int32Array(ev.data);
  switch (params.o) {
    case 'shuffle': shuffle(pixOrder, params.i, params.w); break;
    default: glitch(pixOrder, params.i, params.w);
  }
  postMessage(pixOrder.buffer, [pixOrder.buffer]);
};
