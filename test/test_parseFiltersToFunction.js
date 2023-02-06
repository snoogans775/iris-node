const { parseFiltersToFunction } = require('../src/utils/parseFiltersToFunction')
const input = require('./fixtures/parseFiltersToFunctionInput.json')
const target = require('./fixtures/parseFiltersToFunctionTarget.json')
const assert = require('assert')

describe('#parseFiltersToFunction', function() {
    it('Returns a function', () => returnsFunction(input))

    // This test is very bespoke, it only applies to
    // the computed `duration` property returned by calculateDuration
    // the fixtures are not flexible
    it('Generates a valid filter', () => generatesValidFilter(input, target))
})

function returnsFunction(input) {
    assert.ok(typeof parseFiltersToFunction(input) === 'function')
}

function generatesValidFilter(input, target) {
    const filter = parseFiltersToFunction(input)
    const result = target.filter(filter)
    const greaterThanFilter = input.find(i => i.operator === '>')
    const lessThanFilter = input.find(i => i.operator === '<')
    assert.ok(result.every(durationRecord => {
        return durationRecord.duration > greaterThanFilter.value &&
        durationRecord.duration < lessThanFilter.value
    }))
}