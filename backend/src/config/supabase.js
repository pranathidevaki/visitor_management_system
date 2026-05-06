// supabase.js
// This file creates ONE connection to Supabase
// that the entire backend can use
// 
// Why one file? Because you don't want to write
// the connection code in every single file.
// Create it once here, import it anywhere.

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

// createClient is like dialing a phone number
// once connected, you can make requests
const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase
// module.exports means "make this available 
// to other files that import it"