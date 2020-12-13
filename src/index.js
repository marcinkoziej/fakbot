const {pgnig} = require('./pgnig')
const {innogy} = require('./innogy')
const {getBrowser} = require('./kit')
const yargs = require('yargs')

function testDownload() {
  const br = getBrowser()

  function * flow() {
    yield br.goto('https://github.com/rosshinkley/nightmare-download-manager')
      .on('download', (state, item) => {
        console.log(`Download: ${state} ${JSON.stringify(item, null, 2)}`)
      })
      .click('get-repo')
      .click('[data-target="get-repo.modal"] > ul > li > a')
      .waitDownloadsComplete()


  }

  return vo(flow)
    .catch(e => console.error(e))
    .then(d => console.log('fin.', d))
}


function credsEnv(site) {
  return {
    username: process.env[site.toUpperCase() + '_USERNAME'],
    password: process.env[site.toUpperCase() + '_PASSWORD'],
  }
}

export function cli () {
  const argv = yargs
        .scriptName('fakbot')
        .option('username', {
          alias: 'u',
          type: 'string',
          describe: 'Username to sign in with'
        })
        .option('password', {
          alias: 'p',
          type: 'string',
          describe: 'Password to sign in with'
        })
        .command('pgnig', 'Get invoices from PGNIG', {}, opts =>
          pgnig(Object.assign(credsEnv('pgnig'), opts))
        )
        .command('innogy', 'Get invoices from INNOGY', {}, opts =>
          innogy(Object.assign(credsEnv('innogy'), opts))
        )
        .argv
}
