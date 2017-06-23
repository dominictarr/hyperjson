var h = require('hyperscript')
var hj = require('../')
var pkg = require('./status.json')

function round (n, places) {
  var d = Math.pow(10, places)
  return Math.round(n*d)/d
}

function shortId (id) {
  console.log('id?', /^@/.test(id), id)
  if(/^@/.test(id)) return id.substring(0, 8)
}

function isNumber(n) {
  return 'number' === typeof n
}

function mean (obj) {
  if('object' == typeof obj && isNumber(obj.mean) && isNumber(obj.stdev))
    return h('span.average', round(obj.mean, 2), '+-', round(obj.stdev, 2))
}

var render = hj(
  hj.rule(/^ebt/,
    hj(hj.table(), shortId, hj.basic())
  ),
  mean,
  hj.sections(),
  hj.basic(),
  function (obj) {
    return h('pre', JSON.stringify(obj))
  }
)

var el = render(pkg)

document.body.appendChild(el)

