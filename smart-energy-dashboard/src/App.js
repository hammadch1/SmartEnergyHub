import React from "react"
// import react hooks (useEffect, useState) -> needed for data and auto-refreshing
import { useEffect, useState } from "react"
// axios -> used to make HTTP requests to our backend
import axios from "axios"

// stores the API endpoint so we can fetch sensor data
const API_URL = "https://localhost:5001/api/readings" // BACKEND API URL

function App() {
  // creates energyData state -> holds sensor data, initially it's an empty array ([])
  const [energyData, setEnergyData] = useState([])

  // makes the GET request to API Route in our backendand updates the energy state with the response
  const fetchData = async () => {
    try {
      const response = await axios(API_URL)
      setEnergyData(response.data)
    } catch (error) {
      console.error("Error fetching the response:", error)
    }
  }
  // calls fetch data once when the component loads & sets a data refresh interval of every 5 seconds
  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000) // refresh every 5s
    return () => clearInterval(interval)
  })

  // prepare data for visualization, sets timetstamp on x-axis and energy values on y-axis and defines line chart style
  const chartData = {
    labels: energyData.map((energy) =>
      new Date(energy.timestamp).toLocaleTimeString()
    ),
    datasets: {
      label: "Energy Consumption (W)",
      data: energyData.map((energy) => energy.value),
      borderColor: "rgb(75, 192, 192)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
    },
  }

  return <h1>Smart Energy Dashboard is running!</h1>
}

export default App
