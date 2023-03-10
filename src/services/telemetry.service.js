module.exports = function ({
    fs,
    path,
    db,
    csvToJSON,
    parseFiltersToSQL
}) {
    const appDir = path.dirname(require.main.filename);

    async function loadData(req, res, next) {
        try {
            const telemetryCSV = await fs.readFileSync(
                path.join(appDir, 'data', 'telemetry_bec.csv'),
                'utf8'
            )
            const json = await csvToJSON(telemetryCSV)

            // For this demo, we will truncate data before operating
            await db('telemetry').del()

            // Batching to prevent sqlite errors
            let rowCount = 0
            let batchSize = 200
            const startingLength = json.length
            while (json.length > 0) {
                console.log(`Processing telemetry batch up to position ${json.length}`)
                const insert = await db('telemetry').insert(json.splice(0, batchSize))
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
            const page = req.query.page ?? 0
            const pageSize = 1000
            const records = await db('telemetry')
                .select('*')
                .limit(pageSize)
                .offset(parseInt(page) * pageSize)
            return res.status(200).json({
                status: 'success',
                data: records
            })
        } catch (err) {
            console.error(err)
            return res.status(500).json({
                status: 'failure',
                message: err
            })
        }
    }

    async function fetchByFilters(req, res, next) {
        try {
            const filters = req.body.filters
            const filtersAsWhereClause = parseFiltersToSQL(filters)
            const result = await db.raw(`SELECT * FROM telemetry ${filtersAsWhereClause}`)
            return res.status(200).json({
                status: 'success',
                count: result.length,
                data: result
            })
        } catch (err) {
            console.error(err)
            res.status(500).json({
                status: 'failure',
                message: err
            })
        }
    }

    return {
        loadData,
        fetch,
        fetchByFilters,
    }
}