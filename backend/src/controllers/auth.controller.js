// auth.controller.js
// This file handles everything related to 
// logging in and registering
//
// Think of a controller as the person who
// answers the door when someone knocks.
// They decide what to do with the request.

const supabase = require('../config/supabase')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// ─────────────────────────────────────
// REGISTER
// Called when someone creates an account
// ─────────────────────────────────────
const register = async (req, res) => {

  // req.body is what the user sent us
  // we pull out the fields we need
  const { full_name, email, password, phone, role } = req.body

  // Basic validation
  // Why? Never trust what the user sends.
  // Always check it makes sense before touching the database
  if (!full_name || !email || !password || !role) {
    return res.status(400).json({ 
      error: 'Please provide full_name, email, password and role' 
    })
    // status 400 means "bad request — you sent wrong data"
  }

  // Check if role is valid
  // We only allow these three roles in our system
  const validRoles = ['resident', 'guard', 'admin']
  if (!validRoles.includes(role)) {
    return res.status(400).json({ 
      error: 'Role must be resident, guard or admin' 
    })
  }

  // Check if email already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)    // eq means "equal to"
    .single()              // we only expect one result

  if (existingUser) {
    return res.status(400).json({ 
      error: 'Email already registered' 
    })
  }

  // Hash the password
  // Why? NEVER store raw passwords in a database.
  // If someone hacks your database, they'd see
  // everyone's passwords. Hashing scrambles it
  // into something unreadable like:
  // "vms123" → "$2a$10$xK9Lm2nP..."
  // bcrypt can CHECK if a password matches the hash
  // but cannot REVERSE the hash back to the password
  const hashedPassword = await bcrypt.hash(password, 10)
  // the 10 means "do 10 rounds of scrambling"
  // more rounds = more secure but slower

  // Save the new user to the database
  const { data: newUser, error } = await supabase
  .from('users')
  .insert({
    full_name,
    email,
    password: hashedPassword,
    phone,
    role,
    building_id: req.body.building_id || null,
    // save building assignment
  })
  .select('id, full_name, email, role')
  .single()

  if (error) {
    return res.status(500).json({ error: error.message })
    // status 500 means "something went wrong on our end"
  }

  // Create a JWT token
  // Why? After registering, the user is now logged in.
  // We give them a token like a wristband at an event.
  // They show this wristband on every future request
  // so we know who they are without them logging in again.
  const token = jwt.sign(
    { id: newUser.id, role: newUser.role },
    // ^ what we put INSIDE the token
    process.env.JWT_SECRET,
    // ^ the secret key used to sign it
    { expiresIn: '7d' }
    // ^ token expires in 7 days, then they must login again
  )

  // Send back the token and user info
  res.status(201).json({
    // 201 means "created successfully"
    message: 'Account created successfully',
    token,
    user: newUser
  })
}

// ─────────────────────────────────────
// LOGIN
// Called when someone logs into their account
// ─────────────────────────────────────
const login = async (req, res) => {

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Please provide email and password' 
    })
  }

  // Find the user by email
  const { data: user, error } = await supabase
    .from('users')
    .select('*')     // get everything including password
    .eq('email', email)
    .single()

  // If no user found with that email
  if (error || !user) {
    return res.status(401).json({ error: 'Invalid email or password' })
    // status 401 means "unauthorized — who are you?"
    // Note: we say "invalid email OR password" not which one
    // is wrong. Why? Security. Don't tell hackers which 
    // part they got right.
  }

  // Check if password matches
  // bcrypt.compare takes the raw password the user typed
  // and compares it to the hashed one in the database
  const passwordMatches = await bcrypt.compare(password, user.password)

  if (!passwordMatches) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  // Create their token
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  // Send back token and user info (without password)
  res.json({
    message: 'Logged in successfully',
    token,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      phone: user.phone
    }
  })
}

// Export both functions so routes can use them
module.exports = { register, login }