const path = require('path')
const express = require('express')
const AdminService = require('../services/admin.service')(express)

const router = express.Router()

router.use('/', AdminService.index)

module.exports = router