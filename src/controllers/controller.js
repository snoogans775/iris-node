const { Router } = require('express')
const { csvToJSON } = require('../utils/csvToJSON')
const { parseFiltersToSQL } = require('../utils/parseFiltersToSQL')
const { parseFiltersToFunction} = require('../utils/parseFiltersToFunction')
const { calculateDuration } = require('../utils/calculateDuration')
const { validateQueryBody } = require('../middleware/validateQueryBody')
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
const TelemetryService = require('../services/telemetry.service')({ fs, path, db, csvToJSON, parseFiltersToSQL })
const IntruderService = require('../services/intruder.service')({ fs, path, db, csvToJSON, parseFiltersToSQL, parseFiltersToFunction, calculateDuration })

const router = Router()

// DIRECT GETS
router.get('/', (req, res, next) => res.status(200).send(''))
router.get('/intruder/:id', IntruderService.fetchById)
router.get('/intruder', IntruderService.fetch)
router.get('/telemetry', IntruderService.fetch)

// DATA LOADER ENDPOINTS
router.post('/telemetry/load', TelemetryService.loadData)
router.post('/intruder/load', IntruderService.loadData)

// QUERY BODY ENDPOINTS
router.post('/telemetry/query', validateQueryBody, TelemetryService.fetchByFilters)
router.post('/intruder/query', validateQueryBody, IntruderService.fetchByFilters)
router.post('/intruder/duration/query', validateQueryBody, IntruderService.fetchByDuration)

module.exports = router