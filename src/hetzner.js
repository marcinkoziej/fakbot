const vo = require('vo')
const log = require('debug')('fakbot')
const {getBrowser, sleepFor} = require('./kit')


function upc (url, creds) {
  const br = getBrowser()

  function * workflow () {
    yield br
      .goto(url)
      .viewport(1000, 600)

    yield br
      .type('[name=username]', creds.username)
      .type('[name=password]', creds.password)
      .click('[type=submit]')

    yield sleepFor(15000)

    yield br
      .on('download', (state, item) => {
        log(`download:${state} ${JSON.stringify(item, null, 2)}`)
      })
    // .goto(`${url}/bills_payments/`)
      .goto(`${url}/bills_payments/billoverview.updatebillspayments?action=get_pdf_bill&invoice_id=1725871065&invoice_number=000149556995`)

    yield br
      .waitDownloadsComplete()
      .end()
  }

  return vo(workflow)
    .catch((error) => {
      console.log(error)
    })
    .then((data) => {
      console.log('fin.')
      console.log(data)
    })
}
