// expects an array of { max_timestamp: number, min_timestamp: number}
// returns a new array with a duration property on every record
function calculateDuration(array) {
    return array.map(record => {
        // check for null, undefined or 0
        if (!record.max_timestamp || record.max_timestamp <= 0) {
            throw new Error('Missing or invalid parameter: max_timestamp')
        }
        if (!record.min_timestamp || record.min_timestamp <= 0) {
            throw new Error('Missing or invalid  parameter: m_timestamp')
        }
        return {
            ...record,
            duration: _getDuration(record)
        }
    })
}

function _getDuration(record) {
    return parseInt(record.max_timestamp) - parseInt(record.min_timestamp)
}

module.exports = { calculateDuration }