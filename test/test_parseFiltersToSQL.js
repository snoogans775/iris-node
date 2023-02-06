const { parseFiltersToSQL } = require('../src/utils/parseFiltersToSQL')
const validInput = require('./fixtures/parseFiltersValidInput.json')
const duplicatesInput = require('./fixtures/parseFiltersDuplicateInput.json')
const assert = require('assert')

describe('#parseFiltersToSQL', function() {
    it('Returns an error on duplicate operators', () => errorOnDuplicates(duplicatesInput))
    it('Returns a string', () => okOnReturnString(validInput))
})

function okOnReturnString(input) {

    assert.ok(typeof parseFiltersToSQL(input) === 'string')
}

function errorOnDuplicates(input) {

    assert.throws(() => parseFiltersToSQL(input), Error)
}