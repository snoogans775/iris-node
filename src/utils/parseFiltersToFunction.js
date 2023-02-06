// return a function be used with Array.prototype.filter()
function parseFiltersToFunction(filtersArray) {
    const duplicateFilters = filtersArray.reduce((acc, curr, comparatorIndex, arr) => {
        const match = arr.filter((f, targetIndex) => {
            const valuesMatch = (f.field === curr.field) && (f.operator === curr.operator)
            const indexNotMatch = comparatorIndex != targetIndex
            return valuesMatch && indexNotMatch
        })
        if(match.length > 0 ) {
            acc.push(curr)
            acc.push(match)
        }
        return acc
    }, [])

    if( duplicateFilters.length > 0 ) {
        throw new Error(`Can not process duplicate filters: Error: ${JSON.stringify(duplicateFilters)}`)
    }

    return function(record) {
        const filterResults = filtersArray.map(filter => {
            const {field, operator, value} = filter
            switch(operator) {
                case '<':
                    return record[field] < value
                case '<=':
                    return record[field] <= value
                case '>':
                    return record[field] > value
                case '>=':
                    return record[field] >= value
                case '=':
                    return record[field] === value
                default:
                    return false
            }
        })

        return filterResults.every(r => r === true)
    }

}

module.exports = { parseFiltersToFunction }