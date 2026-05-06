// settings.controller.js
// Handles buildings and visitor types

const supabase = require('../config/supabase')

// ─────────────────────────────────────
// BUILDINGS
// ─────────────────────────────────────
const getBuildings = async (req, res) => {
  const { data: buildings, error } = await supabase
    .from('buildings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json({ buildings })
}

const createBuilding = async (req, res) => {
  const { name, address } = req.body

  if (!name) {
    return res.status(400).json({ error: 'Building name is required' })
  }

  const { data: building, error } = await supabase
    .from('buildings')
    .insert({ name, address })
    .select('*')
    .single()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.status(201).json({ building })
}

// ─────────────────────────────────────
// VISITOR TYPES
// ─────────────────────────────────────
const getVisitorTypes = async (req, res) => {
  const { data: visitorTypes, error } = await supabase
    .from('visitor_types')
    .select('*')
    // removed the order by created_at for now

  if (error) {
    console.log('Visitor types error:', error)
    return res.status(500).json({ error: error.message })
  }

  res.json({ visitorTypes })
}

const createVisitorType = async (req, res) => {
  const { name, category } = req.body

  if (!name || !category) {
    return res.status(400).json({ 
      error: 'Name and category are required' 
    })
  }

  const { data: visitorType, error } = await supabase
    .from('visitor_types')
    .insert({ name, category })
    .select('*')
    .single()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.status(201).json({ visitorType })
}

module.exports = { 
  getBuildings, 
  createBuilding,
  getVisitorTypes,
  createVisitorType
}