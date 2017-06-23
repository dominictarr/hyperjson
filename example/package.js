
var hj = require('../')
var pkg = require('../package.json')
var render = hj(
    hj.sections(),
    hj.basic()
  )
var el = render(pkg)

document.body.appendChild(el)



