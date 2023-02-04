// return a raw SQL query
function parseFiltersToSQL(filtersArray) {
    // The filters object has three properties
    // field, operator, value

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

    // It would be nice to sanitize here
    // but the knex ORM will be able to check for some injection
    // when composing the raw query
    // Regardless, this is not production ready
    const whereClauses = filtersArray.reduce((acc, curr) => {
        acc.push(`${curr.field} ${curr.operator} ${curr.value}`)
        return acc
    }, [])

    return `WHERE ${whereClauses.join(' AND ')}`

}

module.exports = { parseFiltersToSQL }