// user.routes.js
const express = require('express')
const router = express.Router()
const { authenticate, authorize } = require('../middleware/auth.middleware')
const { getGuards } = require('../controllers/user.controller')

// Only admins can see guards list
router.get('/guards', authenticate, authorize('admin'), getGuards)

module.exports = router