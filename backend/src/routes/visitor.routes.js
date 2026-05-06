// visitor.routes.js
// Connects URLs to controller functions
// Also uses middleware to protect routes

const express = require('express')
const router = express.Router()
const { authenticate, authorize } = require('../middleware/auth.middleware')

const {
  submitVisitor,
  getMyVisitors,
  getAllVisitors,
  updateVisitorStatus,
  searchVisitor,
  checkIn,
  checkOut,
  manualCheckIn    // ADD THIS
} = require('../controllers/visitor.controller')

// All routes here require authentication
// meaning you MUST send a valid token
// authenticate runs first, then the controller

// RESIDENT ROUTES
router.post('/', authenticate, authorize('resident'), submitVisitor)
// only residents can submit visitors

router.get('/my', authenticate, authorize('resident'), getMyVisitors)
// only residents can see their own visitors

// ADMIN ROUTES
router.get('/all', authenticate, authorize('admin'), getAllVisitors)
// only admins can see all visitors

router.put('/:id/status', authenticate, authorize('admin'), updateVisitorStatus)
// only admins can approve or reject
// :id means any visitor ID goes here

// GUARD ROUTES
router.get('/search', authenticate, authorize('guard'), searchVisitor)
// Add this line with the other guard routes
router.post('/manual', authenticate, authorize('guard'), manualCheckIn)
// only guards can search visitors

router.post('/checkin', authenticate, authorize('guard'), checkIn)
router.post('/checkout', authenticate, authorize('guard'), checkOut)

module.exports = router