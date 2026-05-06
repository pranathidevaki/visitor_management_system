// auth.middleware.js
// This is the BOUNCER.
// Before any protected route runs,
// this middleware checks:
// 1. Did you send a token?
// 2. Is the token valid?
// 3. Who are you?
//
// If all good → let them through
// If not → block them

const jwt = require('jsonwebtoken')

const authenticate = (req, res, next) => {
  // next means "ok everything is fine, continue
  // to the actual route handler"

  // Tokens are sent in the request headers
  // like an invisible label attached to the request
  // The format is: "Bearer eyJhbGc..."
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  // Split "Bearer eyJhbGc..." into ["Bearer", "eyJhbGc..."]
  // and take the second part [1]
  const token = authHeader.split(' ')[1]

  try {
    // jwt.verify checks if the token is valid
    // and decodes what's inside it
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach the user info to the request
    // so the next function knows who's asking
    req.user = decoded
    // now any route after this can use req.user.id
    // and req.user.role

    next()
    // everything is fine, move on

  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// This middleware checks if the user has the right ROLE
// Why? A guard shouldn't access admin pages.
// A resident shouldn't approve visitors.
const authorize = (...roles) => {
  // the ... means "accept any number of roles"
  // example: authorize('admin', 'guard')
  // means only admins and guards can pass

  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'You do not have permission to do this' 
      })
      // 403 means "forbidden — I know who you are
      // but you're not allowed here"
    }
    next()
  }
}

module.exports = { authenticate, authorize }