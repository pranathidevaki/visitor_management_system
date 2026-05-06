const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const supabase = require('./config/supabase')
const authRoutes = require('./routes/auth.routes')
const visitorRoutes = require('./routes/visitor.routes')
const userRoutes = require('./routes/user.routes')
const settingsRoutes = require('./routes/settings.routes')   // ADD THIS

const app = express()

app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/visitors', visitorRoutes)
app.use('/users', userRoutes)
app.use('/settings', settingsRoutes)                         // ADD THIS

app.get('/health', async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('count')

  if (error) {
    return res.json({ 
      server: 'running', 
      database: 'connection failed',
      error: error.message 
    })
  }

  res.json({ 
    server: 'running', 
    database: 'connected to Supabase!'
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})