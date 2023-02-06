const { calculateDuration } = require('../src/utils/calculateDuration')
const input = require('./fixtures/calculateDurationsInput.json')
const invalidInput = require('./fixtures/calculateDurationsInvalidInput.json')
const assert = require('assert')

describe('#calculateDurations', function() {
    it('Passes on valid input', () => testOnValidInput(input))
    it('Throws error on invalid input', () => testOnInvalidInput(invalidInput))
});

function testOnValidInput(input) {
    const result = calculateDuration(input)

    assert.ok(result.every(record => record.duration !== undefined ))
    assert.ok(result.every(record => typeof record.duration === 'number'))
    assert.ok(result.every(record => record.duration >= 0))
}

function testOnInvalidInput(input) {

    assert.throws(() => calculateDuration(input), Error)
}