import React from "react"
// import react hooks (useEffect, useState) -> needed for data and auto-refreshing
import { useEffect, useState } from "react"
// axios -> used to make HTTP requests to our backend
import axios from "axios"
// for data visualization
import { Line } from "react-chartjs-2"
import "chart.js/auto"

// stores the API endpoint so we can fetch sensor data

function App() {
  // creates energyData state -> holds sensor data, initially it's an empty array ([])
  const [energyData, setEnergyData] = useState([])

  // makes the GET request to API Route in our backend & updates the energy state with the response
  const fetchData = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL)

      console.log("Fetched Data:", response.data) // Debug log

      if (Array.isArray(response.data)) {
        setEnergyData(response.data)
      } else {
        console.error("Invalid API response format:", response.data)
      }
    } catch (error) {
      console.error("Error fetching the response:", error)
    }
  }
  // calls fetch data once when the component loads & sets a data refresh interval of every 5 seconds
  useEffect(() => {
    fetchData()

    const interval = setInterval(fetchData, 5000) // refresh every 5s

    return () => clearInterval(interval)
  }, [])

  // prepare data for visualization, sets timetstamp on x-axis and energy values on y-axis and defines line chart style
  const sortedData = [...energyData].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  )

  const uniqueTimestamps = [
    ...new Set(sortedData.map((entry) => entry.timestamp)),
  ]

  const getSensorData = (sensorName) =>
    uniqueTimestamps.map((timestamp) => {
      const entry = sortedData.find(
        (e) => e.sensor === sensorName && e.timestamp === timestamp
      )
      return entry ? entry.value : null // Ensure null values instead of skipping
    })

  const chartData =
    energyData.length > 0
      ? {
          labels: uniqueTimestamps.map((timestamp) =>
            new Date(timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          ),
          datasets: [
            {
              label: "HVAC Floor 1",
              data: getSensorData("hvac/floor1"),
              spanGaps: true,
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderWidth: 3, // Ensure thick lines
              pointRadius: 5, // Ensure points are visible
            },
            {
              label: "HVAC Floor 2",
              data: getSensorData("hvac/floor2"),
              spanGaps: true,
              borderColor: "rgb(54, 162, 235)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderWidth: 3,
              pointRadius: 5,
            },
            {
              label: "Lighting Floor 1",
              data: getSensorData("lighting/floor1"),
              spanGaps: true,
              borderColor: "rgb(255, 206, 86)",
              backgroundColor: "rgba(255, 206, 86, 0.2)",
              borderWidth: 3,
              pointRadius: 5,
            },
            {
              label: "Lighting Floor 2",
              data: getSensorData("lighting/floor2"),
              spanGaps: true,
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderWidth: 3,
              pointRadius: 5,
            },
          ],
        }
      : { labels: [], datasets: [] } // Fix: Prevent empty dataset errors

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>
        <span img="📊" /> Smart Energy Dashboard
      </h1>
      <div style={{ width: "100%", height: "500px" }}>
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: true, // Keeps chart properly visible on screen
            elements: {
              line: {
                tension: 0.2, // Smoothens the lines slightly
                borderWidth: 3, // Thicker lines for better visibility
              },
              point: {
                radius: 5, // Larger points for clarity
              },
            },
            scales: {
              x: {
                ticks: {
                  autoSkip: true, // ✅ Forces even spacing
                  maxTicksLimit: 10, // ✅ Shows at most 10 timestamps to fit well
                },
              },
              y: {
                beginAtZero: false, // Keeps the values relative to min/max of dataset
              },
            },
          }}
        />
      </div>
    </div>
  )
}

export default App
