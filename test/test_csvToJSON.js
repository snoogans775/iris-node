const { csvToJSON } = require('../src/utils/csvToJSON')
const fs = require('fs')
const assert = require('assert')

describe('#csvToJSON', function() {
    const csv = fs.readFileSync('./data/intruder_bec.csv', 'utf8')
    it('parsesCSV to JSON', () => okOnReturnJSON(csv))
})

async function okOnReturnJSON(csv) {
    const json = await csvToJSON(csv)
    assert.ok(typeof json === 'object')
}