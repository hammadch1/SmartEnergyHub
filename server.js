// load required modules
require("dotenv").config() // loads all environment variables from our .env file
const express = require("express") // web framework for API
const cors = require("cors") // allows frontend to call our API

// intialize our express app
const app = express()
app.use(cors())
app.use(express.json())

// load environment variables
const PORT = process.env.PORT || 5001 // assigns port in .env file if not empty else 5000

console.log("Server is starting...")

// define a basic API route
app.get("/", (req, res) => {
  res.send("SmartEnergyHub API is running...!")
})

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

const { Pool } = require("pg") // PostgreSQL client

// PostgreSQL Connection Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

// Test the database connection
pool
  .connect()
  .then(() => console.log("🗄️ Connected to PostgreSQL database"))
  .catch((err) => console.error("❌ PostgreSQL connection error:", err.message))
