module.exports = function ({
    fs,
    path,
    db,
    csvToJSON,
    parseFiltersToSQL,
    parseFiltersToFunction,
    calculateDuration,
}) {
    const appDir = path.dirname(require.main.filename)

    async function loadData(req, res, next) {
        try {
            const intruderCSV = await fs.readFileSync(
                path.join(appDir, 'data', 'intruder_bec.csv'),
                'utf8'
            )
            const json = await csvToJSON(intruderCSV)

            // For this demo, we will truncate data before operating
            await db('intruder').del()

            // Batching to prevent sqlite errors
            let rowCount = 0
            let batchSize = 200
            const startingLength = json.length
            while (json.length > 0) {
                console.log(`Processing intruder batch up to position ${json.length}`)
                const insert = await db('intruder').insert(json.splice(0, batchSize))
                rowCount = insert
            }
            res.status(200).json({
                status: 'success',
                message: `${rowCount} rows added from ${startingLength} records`
            })
        } catch (err) {
            console.error(err)
            res.status(500).json({ status: 'failure', error: err })
        }
    }

    async function fetch(req, res, next) {
        try {
            const page = req.query.page
            const pageSize = 1000
            const records = await db('intruder')
                .select('*')
                .limit(pageSize)
                .offset(parseInt(page) * pageSize)
            return res.status(200).json({
                status: 'success',
                data: records
            })
        } catch(err) {
            console.error(err)
            return res.status(500).json({
                status: 'failure',
                message: err
            })
        }
    }

    async function fetchById(req, res, next) {
        try {
            const id = req.params.id
            const attempt = await db('intruder')
                .where('unique_identifier', '=', id)
            return res.status(200).json({
                status: 'success',
                data: attempt ?? null
            })
        } catch(err) {
            console.error(err)
            return res.status(500).json({
                status: 'success',
                message: err
            })
        }
    }

    async function fetchByFilters(req, res, next) {
        try {
            const filters = req.body.filters

            const filtersAsWhereClause = parseFiltersToSQL(filters)

            const result = await db.raw(`SELECT * FROM intruder ${filtersAsWhereClause}`)

            return res.status(200).json({
                status: 'success',
                count: result.length,
                data: result
            })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ status: 'failure', error: err })
        }
    }

    async function fetchByDuration(req, res, next) {
        const filters = req.body?.filters

        if (filters.some(f => f.field !== 'duration') === true) {
            return res.status(400).json({
                status: 'failure',
                message: 'You may only use the `duration` filter with this endpoint'
            })
        }

        const filterDurations = parseFiltersToFunction(filters)

        try {
            // Get durations from intruder records
            const recordsFilteredByDuration = await db('intruder')
                .select('unique_identifier')
                .max('timestamp as max_timestamp')
                .min('timestamp as min_timestamp')
                .groupBy('unique_identifier')
                .then(records => calculateDuration(records))
                .then(records => records.filter(filterDurations))

            return res.status(200).json({
                status: 'success',
                data: recordsFilteredByDuration
            })

        } catch (err) {
            console.error(err)
            return res.status(500).json({
                status: 'failure',
                error: err
            })
        }
    }

    return {
        loadData,
        fetch,
        fetchById,
        fetchByFilters,
        fetchByDuration
    }
}