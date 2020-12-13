
const vo = require('vo')
const log = require('debug')('fakbot')
const {getBrowser, signIn, waitClick, downloadTo, getTable} = require('./kit')

export function innogy (settings = {}) {
  if (!settings.username || !settings.password) throw "Provide username and password"
  const UA = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/78.0'

  const br = getBrowser(Object.assign({useragent: UA}, settings))

  function * workflow () {
    yield signIn(br, 'https://moje.innogy.pl/', {
      "UserName": settings.username,
      "Password": settings.password
    }, '#acceptCookies')
    yield waitClick(br, '/Faktury-i-platnosci')

    let rows = []
    const table = ".finance-history-table tbody"
    yield br
      .wait(table)
      .evaluate(getTable, table)
      .then((data) => {
        rows = data
      })

    let idx = 0
    for (const [info, amo, dt] of rows) {
      idx += 1
      let yearmo = null

      const [title, num] = info

      if (title.startsWith("Faktura rozliczeniowa")) {
        const [d, m, y] = dt[0].split('.')
        yearmo = `${y}-${m}`

        log(`Fetch ${title} ${num} (row ${idx}) for ${yearmo}`)
        yield br
          .click(`${table} tr:nth-child(${idx}) a[href*="GetDocument"]`)
          .download(downloadTo(yearmo, num))
      }
    }


    yield br.end()
  }

  return vo(workflow)
    .catch((error) => {
      console.log(error)
    })
}
