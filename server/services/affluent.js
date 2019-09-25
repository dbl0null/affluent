const puppeteer = require('puppeteer')
const config = require('../../config')
const delay = require('../lib/delay')
const numeral = require('numeral')

const selectors = {
  loginUser: 'form.login-form > div:nth-child(2) > input',
  loginPass: 'form.login-form > div:nth-child(3) > input',
  loginSubmit: 'form.login-form > div.form-actions > button',
  dateStart:'div.calendar.left input',
  dateEnd:'div.calendar.right input',
  dateSubmit: '#drp_global > div > button.applyBtn.btn.btn-sm.btn-success'
}

/**
 * Extract values from data table
 * @returns {string[][]}
 */
function parseTable () {
  return Array.from(document.querySelectorAll('#DataTables_Table_0 > tbody > tr'))
    .map(row => Array.from(row.querySelectorAll('td'))
      .map(col => col.innerText))
}

/**
 * Check if we have more pages in data table
 * @returns {boolean}
 */
function nextPage () {
  return !document.querySelector('.next').classList.contains('disabled')
}

/**
 * Convert string parameters to normal values
 * @param date
 * @param commissions
 * @param sales
 * @param leads
 * @param clicks
 * @param epc
 * @param impressions
 * @param cr
 * @returns {{date: Date, commissions: Number, leads: Number, clicks: Number, epc: Number, impressions: Number, sales: Number, cr: Number}}
 */
function normalizeRow (date, commissions, sales, leads, clicks, epc, impressions, cr) {
  return {
    date: new Date(date),
    commissions: numeral(commissions).value(),
    sales: numeral(sales).value(),
    leads: numeral(leads).value(),
    clicks: numeral(clicks).value(),
    epc: numeral(epc).value(),
    impressions: numeral(impressions).value(),
    cr: numeral(cr.replace('%', '')).value()
  }
}

/**
 * Log into account
 * @param page
 * @returns {Promise<void>}
 */
async function logIn (page) {
  await page.goto('https://publisher-dev.affluent.io')

  const waiter = page.waitForNavigation()

  await page.type(selectors.loginUser, config.affluent.login)
  await page.type(selectors.loginPass, config.affluent.password)
  await page.click(selectors.loginSubmit)

  await waiter
}

/**
 * Fill date range and submit it
 * @param page
 * @returns {Promise<void>}
 */
async function fillDateRange (page) {
  await page.goto('https://publisher-dev.affluent.io/list?type=dates')

  await delay(1000)

  // open date popup
  await page.click('#datepicker')

  const dateStartElement = await page.$(selectors.dateStart)
  const dateEndElement = await page.$(selectors.dateEnd)

  //fill values
  await dateStartElement.focus()
  await dateStartElement.click({ clickCount: 3})
  await dateStartElement.type('08/01/2019')

  await dateEndElement.focus()
  await dateEndElement.click({ clickCount: 3})
  await dateEndElement.type('08/31/2019')

  // submit date range
  await page.focus(selectors.dateSubmit)
  await page.click(selectors.dateSubmit)

  return delay(1000)
}

/**
 * Parse data
 * @returns {Promise<Observable<*[]>>}
 */
async function getData () {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  await logIn(page)
  await fillDateRange(page)

  let rows = await page.evaluate(parseTable)

  while (await page.evaluate(nextPage)) {
    await page.click('.next > a')
    await delay(500)

    rows = rows.concat(await page.evaluate(parseTable))
  }

  await browser.close()

  return rows.map(row => normalizeRow(...row))
}

module.exports = { getData }

if (require.main === module) {
  getData()
    .then(result => console.log(result, result.length))
    .catch(error => console.error(error))
}