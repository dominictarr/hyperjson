var h = require('hyperscript')

function isString (s) {
  return 'string' == typeof s
}

function isObject (o) {
  return o && 'object' == typeof o && !Array.isArray(o)
}

function isObjectOf(o, isType) {
  if(!isObject(o)) return false
  for(var k in o)
    if(!isType(o[k])) return false
  return true
}

function each (obj, iter) {
  for(var k in obj)
    iter(obj[k], k)
}

var keys = Object.keys

module.exports = function () {
  var renderers = [].slice.call(arguments)
  return function render (obj, key) {
    var _render = 'function' != typeof this ? render : this
      
    for(var i = 0; i < renderers.length; i++) {
      var el
      if(renderers[i])
        el = renderers[i].call(render, obj, key)
      if(el) return el
    }
  }
}

module.exports.table = function (renderKey, renderValue) {
  return function (obj) {
    renderValue = renderValue || this
    renderKey = renderKey || this
    if(!isObjectOf(obj, isObject)) return
    var cols = {}
    each(obj, function (v) {
      each(v, function (_, k) {
        cols[k] = true
      })
    })
    return h('table',
      h('tr',
        [' '].concat(keys(cols)).map(function (e) { return h('th', e) })
      ),
      keys(obj).map(function (key) {
        var row = obj[key]
        return h('tr',
          renderKey.call(renderKey, key),
          keys(cols).map(function (key) {
            return h('td', row[key] ? renderValue.call(renderValue, row[key], key) : '_')
          })
        )
      })
    )
  }
}

module.exports.basic = function () {
  return function (value) {
    if(!isObject(value)) return h('span.'+typeof value, ''+value)
  }
}

module.exports.sections = function (render, isMulti) {
  isMulti = isMulti || function (o) {
    return isObject(o) || (isString(o) && o.split('\n').length>1)
  }
  return function (obj, key) {
    if(!isObject(obj)) return
    render = render || this
    var el = h('ul')
    for(var k in obj) {
      var value = render.call(this, obj[k], k)
      if(value.innerText.split('\n').length > 1)
        el.appendChild(h('li.section', h('em', k), h('p', value)))
      else
        el.appendChild(h('li.section', h('em', k), ': ', h('span', value)))

    }
    return el
  }
}

module.exports.mixed = function (render) {

}

module.exports.rule = function (match, render) {
  return function (obj, key) {
    console.log('RULE', key)
    if(!isString(key)) return
    if(match.exec(key)) {
      return render.call(this, obj, key)
    }
  }
}



