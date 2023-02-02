const { parseFilters } = require('../src/utils/parseFilters')
const assert = require('assert')

errorOnDuplicates()
okOnReturnString()


function okOnReturnString() {
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
    console.log('Passed okOnReturnString')
}

function errorOnDuplicates() {
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
    console.log('Passed errorOnDuplicate')
}