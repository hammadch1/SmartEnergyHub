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

// postgreSQL client
const { Pool } = require("pg")

// postgreSQL connection pool
const pool = new Pool({
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL Database"))
  .catch((err) => console.error("PostgreSQL connection error:", err.message))

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS energy_data (
    id SERIAL PRIMARY KEY,
    sensor TEXT NOT NULL,
    value REAL NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`

pool
  .query(createTableQuery)
  .then(() => console.log("Table energy_data is created"))
  .catch((err) =>
    console.error("Error in creating energy_data table:", err.message)
  )
