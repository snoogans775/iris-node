const { parseFiltersToFunction } = require('../src/utils/parseFiltersToFunction')
const input = require('./fixtures/parseFiltersToFunctionInput.json')
const target = require('./fixtures/parseFiltersToFunctionTarget.json')
const assert = require('assert')

;(async function() {
    returnsFunction(input)
    generatesValidFilter(input, target)
})();

function returnsFunction(input) {
    assert.ok(typeof parseFiltersToFunction(input) === 'function')
    console.log('Passed returnsFunction')
}

function generatesValidFilter(input, target) {
    const filter = parseFiltersToFunction(input)
    const result = target.filter(filter)
    console.log('input', input)
    console.log(result)
}