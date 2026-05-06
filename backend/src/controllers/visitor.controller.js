// visitor.controller.js
// Handles everything related to visitors:
// → submitting a visitor (resident)
// → viewing visitors (resident sees theirs, admin sees all)
// → approving or rejecting (admin)
// → searching by ID (guard)

const supabase = require('../config/supabase')

// ─────────────────────────────────────
// SUBMIT VISITOR
// Called when a resident submits a visitor
// ─────────────────────────────────────
const submitVisitor = async (req, res) => {

  // We know WHO is submitting because
  // the auth middleware already decoded
  // the token and put the user on req.user
  const residentId = req.user.id

  const { 
    full_name, 
    id_number, 
    phone, 
    reason, 
    visitor_type_id,
    building_id,
    visit_date 
  } = req.body

  // Validate required fields
  if (!full_name || !id_number || !building_id) {
    return res.status(400).json({ 
      error: 'Please provide full_name, id_number and building_id' 
    })
  }

  // Insert visitor into database
  const { data: visitor, error } = await supabase
    .from('visitors')
    .insert({
      full_name,
      id_number,
      phone,
      reason,
      visitor_type_id,
      building_id,
      visit_date,
      resident_id: residentId,
      status: 'pending'
      // always starts as pending
      // admin will change it to approved or rejected
    })
    .select('*')
    .single()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  // Also create a notification for the admin
  // so they know a new visitor was submitted
  await supabase
    .from('notifications')
    .insert({
      message: `New visitor submitted: ${full_name}`,
      type: 'new_visitor',
      // we'll notify all admins
      // for now we just log it
    })

  res.status(201).json({
    message: 'Visitor submitted successfully',
    visitor
  })
}

// ─────────────────────────────────────
// GET MY VISITORS
// Called when a resident wants to see
// all the visitors THEY submitted
// ─────────────────────────────────────
const getMyVisitors = async (req, res) => {

  const residentId = req.user.id

  const { data: visitors, error } = await supabase
    .from('visitors')
    .select(`
      *,
      visitor_types (name, category)
    `)
    // the visitor_types part is a JOIN
    // it means "also bring me the visitor type
    // details linked to this visitor"
    // instead of just getting an ID like:
    // visitor_type_id: "abc-123"
    // you get the full object:
    // visitor_types: { name: "Family", category: "Visit" }
    .eq('resident_id', residentId)
    .order('created_at', { ascending: false })
    // newest visitors first

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json({ visitors })
}

// ─────────────────────────────────────
// GET ALL VISITORS
// Only admins can call this
// Returns every visitor in the system
// ─────────────────────────────────────
const getAllVisitors = async (req, res) => {

  const { data: visitors, error } = await supabase
    .from('visitors')
    .select(`
      *,
      visitor_types (name, category),
      users!visitors_resident_id_fkey (full_name, email, phone)
    `)
    // users!visitors_resident_id_fkey means:
    // "join the users table using the resident_id foreign key"
    // this brings us the resident's details too
    .order('created_at', { ascending: false })

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json({ visitors })
}

// ─────────────────────────────────────
// UPDATE VISITOR STATUS
// Called when admin approves or rejects
// ─────────────────────────────────────
const updateVisitorStatus = async (req, res) => {

  // the visitor ID comes from the URL
  // example: PUT /visitors/abc-123
  // req.params.id = "abc-123"
  const { id } = req.params
  const { status, comment } = req.body

  // Validate status
  const validStatuses = ['approved', 'rejected', 'pending', 'cancelled']
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      error: 'Status must be approved, rejected, pending or cancelled' 
    })
  }

  // Update the visitor
  const { data: visitor, error } = await supabase
    .from('visitors')
    .update({ status })
    .eq('id', id)
    .select('*, users!visitors_resident_id_fkey (full_name)')
    .single()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  if (!visitor) {
    return res.status(404).json({ error: 'Visitor not found' })
    // 404 means "not found"
  }

  // Notify the resident their visitor was approved/rejected
  await supabase
    .from('notifications')
    .insert({
      user_id: visitor.resident_id,
      message: `Your visitor ${visitor.full_name} has been ${status}`,
      type: status === 'approved' ? 'approval' : 'rejection',
      is_read: false
    })

  res.json({
    message: `Visitor ${status} successfully`,
    visitor
  })
}

// ─────────────────────────────────────
// SEARCH VISITOR
// Called by guard to find a visitor by ID number
// ─────────────────────────────────────
const searchVisitor = async (req, res) => {
  const { id_number, phone } = req.query
  const guardId = req.user.id

  if (!id_number && !phone) {
    return res.status(400).json({ 
      error: 'Please provide id_number or phone to search' 
    })
  }

  // Get the guard's building first
  const { data: guard } = await supabase
    .from('users')
    .select('building_id')
    .eq('id', guardId)
    .single()

  // Build the query
  let query = supabase
    .from('visitors')
    .select(`
      *,
      visitor_types (name, category),
      users!visitors_resident_id_fkey (full_name, phone)
    `)

  // Filter by ID or phone
  if (id_number) {
    query = query.eq('id_number', id_number)
  } else if (phone) {
    query = query.eq('phone', phone)
  }

  // If guard has a building, only show visitors for that building
  // This is the key security feature
  if (guard?.building_id) {
    query = query.eq('building_id', guard.building_id)
  }

  const { data: visitors, error } = await query
    .order('created_at', { ascending: false })

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  if (!visitors || visitors.length === 0) {
    return res.status(404).json({ 
      error: 'No visitor found with that ID or phone number',
      canManualCheckin: true
    })
  }

  res.json({ visitors })
}

// ─────────────────────────────────────
// CHECK IN
// Called by guard when visitor arrives
// ─────────────────────────────────────
const checkIn = async (req, res) => {

  const guardId = req.user.id
  const { visitor_id, notes } = req.body

  if (!visitor_id) {
    return res.status(400).json({ error: 'visitor_id is required' })
  }

  // First check if visitor is approved
  const { data: visitor, error: findError } = await supabase
    .from('visitors')
    .select('*')
    .eq('id', visitor_id)
    .single()

  if (findError || !visitor) {
    return res.status(404).json({ error: 'Visitor not found' })
  }

  if (visitor.status !== 'approved') {
    return res.status(403).json({ 
      error: `Cannot check in visitor with status: ${visitor.status}`,
      status: visitor.status
    })
  }

  // Create a check in log
  const { data: log, error: logError } = await supabase
    .from('visitor_logs')
    .insert({
      visitor_id,
      guard_id: guardId,
      action: 'check_in',
      notes
    })
    .select('*')
    .single()

  if (logError) {
    return res.status(500).json({ error: logError.message })
  }

  // Notify the resident their visitor has arrived
  await supabase
    .from('notifications')
    .insert({
      user_id: visitor.resident_id,
      message: `Your visitor ${visitor.full_name} has arrived`,
      type: 'arrival',
      is_read: false
    })

  res.json({
    message: 'Visitor checked in successfully',
    log
  })
}

// ─────────────────────────────────────
// CHECK OUT
// Called by guard when visitor leaves
// ─────────────────────────────────────
const checkOut = async (req, res) => {

  const guardId = req.user.id
  const { visitor_id, notes } = req.body

  if (!visitor_id) {
    return res.status(400).json({ error: 'visitor_id is required' })
  }

  // Create a check out log
  const { data: log, error } = await supabase
    .from('visitor_logs')
    .insert({
      visitor_id,
      guard_id: guardId,
      action: 'check_out',
      notes
    })
    .select('*')
    .single()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json({
    message: 'Visitor checked out successfully',
    log
  })
}

// MANUAL CHECK IN
// Called by guard for unregistered visitors
const manualCheckIn = async (req, res) => {
  const guardId = req.user.id
  const { full_name, id_number, phone, reason, building_id } = req.body

  if (!full_name || !id_number) {
    return res.status(400).json({ 
      error: 'Full name and ID number are required' 
    })
  }

  // Create visitor record with approved status
  const { data: visitor, error: visitorError } = await supabase
  .from('visitors')
  .insert({
    full_name,
    id_number,
    phone: phone || null,
    reason: reason || null,
    building_id: building_id || null,
    // if building_id is empty string, save null instead
    status: 'approved',
    resident_id: guardId,
  })
  .select('*')
  .single()

  if (visitorError) {
    return res.status(500).json({ error: visitorError.message })
  }

  // Create check in log immediately
  await supabase
    .from('visitor_logs')
    .insert({
      visitor_id: visitor.id,
      guard_id: guardId,
      action: 'check_in',
      notes: 'Manual check in by guard'
    })

  res.status(201).json({
    message: 'Visitor manually checked in successfully',
    visitor
  })
}

module.exports = { 
  submitVisitor, 
  getMyVisitors, 
  getAllVisitors, 
  updateVisitorStatus,
  searchVisitor,
  checkIn,
  checkOut,
  manualCheckIn    // ADD THIS
}