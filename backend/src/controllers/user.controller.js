// user.controller.js
// Handles user related operations
// like getting all guards

const supabase = require('../config/supabase')

// GET ALL GUARDS
// Only admins can call this
const getGuards = async (req, res) => {
  const { data: guards, error } = await supabase
    .from('users')
    .select('id, full_name, email, phone, building_id, created_at')
    .eq('role', 'guard')
    .order('created_at', { ascending: false })

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json({ guards })
}

module.exports = { getGuards }