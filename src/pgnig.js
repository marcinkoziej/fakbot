
const vo = require('vo')
const log = require('debug')('fakbot')
const {signIn, getBrowser, waitClick, logDownload, downloadTo} = require('./kit')

export function pgnig (creds, settings = {}) {
  const br = getBrowser(settings)

  function * workflow () {
    yield signIn(br, 'https://ebok.pgnig.pl/', {
      identificator: creds.username,
      accessPin: creds.password
    })

    yield waitClick(br, '/faktury')

    // yield br
    //   .on('download', (state, item) => {
    //     log(`download:${state} ${JSON.stringify(item, null, 2)}`)
    //   })

    let numbers = []
    yield br
      .wait('.table-invoices')
      .wait(1000)
      .evaluate(() => {
        const l = Array
          .from(document.querySelectorAll('.table-invoices .invoice-number u'))
          .map((a) => a.innerHTML)

        return l
      })
      .then((nums) => {
        nums.forEach(x => numbers.push(x))
      })

    numbers = numbers.map((n, idx) => {
      if (n.startsWith('VG')) {
        return [n, idx]
      } else {
        return null
      }
    }).filter(x => x)

    log(`Getting these invoice numbers:`, numbers)

    let yearmon = null

    for (const [n, idx] of numbers) {
      yield br
        .click(`.table-invoices .table-row:nth-child(${idx+2}) .invoice-number u`)
        .wait(200)
        .evaluate(() => {
          const x = document.querySelector(".agreementModal .contentSection div:nth-child(2) b")
          if (x) {
            return x.innerHTML
          } else {
            return null
          }
        })
        .then((dt) => {
          if (dt) {
            const [d, m, y] = dt.split(/-/)
            yearmon = `${y}-${m}`
          }
        })

      log(`Invoice ${n} (row index ${idx}) is for ${yearmon}`)

      yield br
        .wait('[href^="/crm/get-invoice-pdf"]')
        .click('[href^="/crm/get-invoice-pdf"]')
        .download(downloadTo(yearmon, n))
    }

    yield br
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
