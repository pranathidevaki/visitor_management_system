// settings.routes.js
const express = require('express')
const router = express.Router()
const { authenticate, authorize } = require('../middleware/auth.middleware')
const {
  getBuildings,
  createBuilding,
  getVisitorTypes,
  createVisitorType
} = require('../controllers/settings.controller')

// Buildings
router.get('/buildings',      authenticate, getBuildings)
router.post('/buildings',     authenticate, authorize('admin'), createBuilding)

// Visitor Types
router.get('/visitor-types',  authenticate, getVisitorTypes)
router.post('/visitor-types', authenticate, authorize('admin'), createVisitorType)

module.exports = router