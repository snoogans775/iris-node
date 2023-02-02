const { Router } = require('express')
const { csvToJSON } = require('../utils/csvToJSON')
const { parseFilters } = require('../utils/parseFilters')
const fs = require('fs')
const path = require('path')
const knex = require('knex')
const db = knex({
    client: 'sqlite3',
    connection: {
        filename: path.join(path.dirname(require.main.filename), 'data', 'database.sqlite'),
        useNullAsDefault: true,
    }
})

// SET UP SERVICES
const TelemetryService = require('../services/telemetry.service')({fs, path, db, csvToJSON, parseFilters})
const IntruderService = require('../services/intruder.service')({fs, path, db, csvToJSON})

const router = Router()

router.get('/', (req, res, next) => res.status(200).send(''))
router.post('/telemetry/load', TelemetryService.loadData)
router.post('/intruder/load', IntruderService.loadData)
router.post('/telemetry/query', TelemetryService.fetch)
router.post('/intruder/query', TelemetryService.fetch)

module.exports = router