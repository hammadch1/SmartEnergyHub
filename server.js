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
  TOPIC.forEach((topic) => mqttClient.subscribe(topic))
})

// handle incoming message or sensor data in this case
mqttClient.on("message", async (topic, message) => {
  const value = parseFloat(message.toString())
  try {
    await pool.query(
      "INSERT INTO energy_data (sensor, value) VALUES ($1, $2)",
      [topic, value]
    )
    console.log(`Stored value ${value}W from ${topic} in PostgreSQL`)
  } catch (err) {
    console.error(`Error inserting value ${value}W from ${topic} in PostgreSQL`)
  }
})

// handle mqtt connection error
mqttClient.on("error", () => {
  console.error(`Error connecting to MQTT Broker`)
})
