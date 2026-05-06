// auth.routes.js
// This file just defines the DOORS (routes)
// and connects them to the right controller function
//
// The controller does the actual work.
// The route just says "this door leads to that room"

const express = require('express')
const router = express.Router()
const { register, login } = require('../controllers/auth.controller')

// POST /auth/register → goes to register function
router.post('/register', register)

// POST /auth/login → goes to login function
router.post('/login', login)

module.exports = router