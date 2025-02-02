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

//SERVER_URL = `http://localhost:${PORT}`
SERVER_URL = "https://smart-energy-backend.onrender.com"

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on ${SERVER_URL}`)
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

// gonna subscribe our mqtt to incoming messages from mqtt which is simulating fake ioT sensors signals data
const mqtt = require("mqtt")

// loading mqtt broker details from .env
const MQTT_BROKER = process.env.MQTT_BROKER
const MQTT_PORT = process.env.MQTT_PORT

// connect to the mqtt broker
const mqttClient = mqtt.connect(`mqtt://${MQTT_BROKER}:${MQTT_PORT}`)

const TOPIC = [
  "hvac/floor1",
  "hvac/floor2",
  "lighting/floor1",
  "lighting/floor2",
]

// handle successful connection
mqttClient.on("connect", () => {
  console.log("Connected to MQTT Broker..!")

  // Function to simulate and publish sensor data every 5 seconds
  const publishSensorData = () => {
    TOPIC.forEach((topic) => {
      const value = (Math.random() * (1500 - 500) + 500).toFixed(2) // Generate random value between 500W and 1500W
      mqttClient.publish(topic, value)
      console.log(`Published ${value}W to ${topic}`)
    })
  }

  // Publish data every 5 seconds
  setInterval(publishSensorData, 5000)

  TOPIC.forEach((topic) => mqttClient.subscribe(topic))
})

// handle incoming message or sensor data in this case
mqttClient.on("message", async (topic, message) => {
  const value = parseFloat(message.toString())

  if (!isNaN(value)) {
    try {
      await pool.query(
        "INSERT INTO energy_data (sensor, value) VALUES ($1, $2)",
        [topic, value]
      )
      console.log(`Stored value ${value}W from ${topic} in PostgreSQL`)
    } catch (err) {
      console.error(
        `Error inserting value ${value}W from ${topic} in PostgreSQL`
      )
    }
  } else {
    console.error("Invalid Data received:", message.toString())
  }
})

// handle mqtt connection error
mqttClient.on("error", () => {
  console.error(`Error connecting to MQTT Broker`)
})

// lets create API route to fetch last 10 Energy Readings for our frontend
app.get("/api/readings", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM energy_data ORDER BY timestamp DESC LIMIT 20"
    )

    // Force API to send fresh responses
    res.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    )
    res.set("Expires", "0")
    res.set("Pragma", "no-cache")

    res.json(rows)
  } catch (err) {
    console.error("Error fetching readings:", err.message)
    res.status(500).json({ error: err.message })
  }
})

// Function to delete old records and keep only the latest 1000 entries
const deleteOldRecords = async () => {
  try {
    await pool.query(`
      DELETE FROM energy_data 
      WHERE id NOT IN (
        SELECT id FROM energy_data 
        ORDER BY timestamp DESC 
        LIMIT 1000
      )
    `)
    console.log("Old records deleted, only latest 1000 entries kept.")
  } catch (err) {
    console.error("Error deleting old records:", err.message)
  }
}

// Run cleanup every 0.5 hour (1800000ms)
setInterval(deleteOldRecords, 1800000)
