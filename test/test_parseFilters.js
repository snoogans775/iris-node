const { parseFiltersToSQL } = require('../src/utils/parseFiltersToSQL')
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

    assert.ok(typeof parseFiltersToSQL(valid) === 'string')
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

    assert.throws(() => parseFiltersToSQL(duplicates), Error)
    console.log('Passed errorOnDuplicate')
}