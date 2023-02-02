const { csvToJSON } = require('../src/utils/csvToJSON')
const fs = require('fs')
const path = require('path')
const assert = require('assert')

;( async function() {
    const csv = fs.readFileSync('./data/intruder_bec.csv', 'utf8')
    okOnReturnJSON(csv)
})()

async function okOnReturnJSON(csv) {
    const json = await csvToJSON(csv)
    console.log(typeof json)
    assert.ok(typeof json === 'object')
    console.log(`Passed okOnReturnJSON`)
}