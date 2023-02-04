const { calculateDuration } = require('../src/utils/calculateDuration')
const input = require('./fixtures/calculateDurationsInput.json')
const assert = require('assert')

;(async function() {
    testOnValidInput(input)
    const invalidatedInput = input.map(record => {
        record.max_timestamp = -100000
        return record
    })
    testOnInvalidInput(invalidatedInput)
})();

function testOnValidInput(input) {
    const result = calculateDuration(input)

    assert.ok(result.every(record => record.duration !== undefined ))
    assert.ok(result.every(record => typeof record.duration === 'number'))
    assert.ok(result.every(record => record.duration >= 0))
    console.log('Passed testOnValidInput')
}

function testOnInvalidInput(input) {

    assert.throws(() => calculateDuration(input), Error)
    console.log('Passed testOnInvalidInput')
}