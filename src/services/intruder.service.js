module.exports = function ({
    fs,
    path,
    db,
    csvToJSON
}) {
    const appDir = path.dirname(require.main.filename);

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
            const filters = req.body.filters
            const filtersAsWhereClause = parseFilters(filters)
            console.log(filtersAsWhereClause)
            const result = await db.raw(`SELECT * FROM intruder ${filtersAsWhereClause}`)
            return res.status(200).json({
                status: 'success',
                count: result.length,
                data: result
            })
        } catch(err) {
            console.error(err)
            res.status(500).json({status: 'failure', error: err})
        }
    }

    return {
        loadData,
        fetch
    }
}