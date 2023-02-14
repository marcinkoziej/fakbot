import vo from 'vo'
import debug from 'debug'

const log = debug('try')

function * g () {
  yield 3
  yield 5
  yield 1000
}

log(vo(g)())
