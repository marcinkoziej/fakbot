import { settings } from 'cluster'

const fs = require('fs')
const Nightmare = require('nightmare')
// require('nightmare-download-manager')(Nightmare)
require('nightmare-inline-download')(Nightmare)
const vo = require('vo')
const log = require('debug')('fakbot')


export function signIn(browser, url, fields, clickConsent) {
  browser = browser.goto(url)

  if (clickConsent)
    browser = browser.click(clickConsent)

  for (const [field, val] of Object.entries(fields)) {
    browser = browser.type(`[name="${field}"]`, val)
  }

  return browser.click('[type=submit]')
}

export function waitClick(browser, href) {
  return browser
    .wait(`[href="${href}"]`)
    .click(`[href="${href}"]`)
}

export function getBrowser(settings) {
  let b = Nightmare(Object.assign({
    width: 1400, height: 800,
    show: true,
    pollInterval: 800,
    webPreferences: { images: true },
    waitTimeout: 120 * 1000,
    paths: {
      downloads: process.cwd()
    }
  }))

  if (settings.useragent) {
    b = b.useragent(settings.useragent)
  }

  return b
}

export function sleepFor (ms) {
  return vo(() => {
    log('start waiting')
    return new Promise((resolve, _reject) => {
      log('setTimeout')
      setTimeout(() => {
        log('rrring')
        resolve()
      }, ms)
    })
  })
}


export function logDownload(browser) {
    return browser.on('download', (state, item) => {
      console.log(`Download: ${state} ${JSON.stringify(item, null, 2)}`)
    })
}

export function downloadTo (yearmon, number) {
  const dir = `${process.cwd()}/${yearmon}`
  const fn = number.replace(/\//g, "_") + ".pdf"

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, 0o755)
  }
  // make this dir
  return `${dir}/${fn}`
}

export function getTable(selector) {
  function textNodesUnder(node){
    var justSpace = /^\s*$/
    var all = [];
    for (node=node.firstChild;node;node=node.nextSibling){
      if (node.nodeType==3) {
        if (!justSpace.test(node.textContent))
          all.push(node.textContent);
      } else {
        all = all.concat(textNodesUnder(node));
      }
    }
    return all;
  }

  const t = document.querySelector(selector)
  return Array.from(t.children)
    .map((r) => Array.from(r.children)
        .map(textNodesUnder))
}
