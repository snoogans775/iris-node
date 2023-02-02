const { parseFilters } = require('./../src/utils/parseFilters')
const assert = require('assert')

assertErrorOnDuplicates()
assertOkOnString()


function assertOkOnString() {
    const valid = [
        {
            "field": "altitude",
            "operator": "<",
            "value": "100"
        },
        {
            "field": "altitude",
            "operator": ">",
            "value": "0"
        }
    ]

    assert.ok(typeof parseFilters(valid) === 'string')
    console.log('passed')
}

function assertErrorOnDuplicates() {
    const duplicates = [
        {
            "field": "altitude",
            "operator": "<",
            "value": "100"
        },
        {
            "field": "altitude",
            "operator": "<",
            "value": "0"
        }
    ]

    assert.throws(() => parseFilters(duplicates), Error)
    console.log('passed')
}