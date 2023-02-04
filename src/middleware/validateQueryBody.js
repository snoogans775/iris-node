function validateQueryBody(req, res, next) {
    const filters = req.body.filters
    const validOperators = ['<', '>', '<=', '>=', '=']

    if(filters === undefined) {
        return res.status(400).json({
            status: 'failure',
            message: 'No `filters` payload found in request.'
        })
    }

    const hasInvalidOperators = filters.some(f => !validOperators.includes(f.operator))
    if(hasInvalidOperators) {
        return res.status(400).json({
            status: 'failure',
            message: `Invalid request. Only the following operators are valid: ${validOperators.join(', ')}
            `
        }) 
    }

    next()
}

module.exports = { validateQueryBody }