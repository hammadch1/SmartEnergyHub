# 📜 SmartEnergyHub
**A real-time IoT Energy Monitoring System using MQTT, Node.js, PostgreSQL, and React.**

🚀 **Live Demo**: [SmartEnergyHub Frontend](https://hammadch1.github.io/SmartEnergyHub/)  
🖥️ **Backend API**: [SmartEnergyHub API](https://smart-energy-backend.onrender.com/api/readings)

---

## 📌 Features
✅ Real-time energy data visualization 📊  
✅ MQTT broker-based IoT sensor simulation 🔌  
✅ PostgreSQL database integration 🗄️  
✅ Automatic old data cleanup 🧹  
✅ Fully deployed on **Render** (Backend) & **GitHub Pages** (Frontend) 🚀  

---

## 📁 Tech Stack
- **Frontend**: React, Chart.js, Axios  
- **Backend**: Node.js, Express, PostgreSQL, MQTT.js  
- **Database**: PostgreSQL (hosted on Render)  
- **MQTT Broker**: `mqtt.eclipseprojects.io`  
- **Deployment**:  
  - **Frontend** → GitHub Pages  
  - **Backend** → Render  

---

## 📜 Installation (Local Setup)

### 1️⃣ Clone the Repository
bash script:
```
git clone https://github.com/hammadch1/SmartEnergyHub.git
cd SmartEnergyHub
```

## 2️⃣ Backend Setup
bash script:
```
cd server
npm install
cp .env.example .env  # Add PostgreSQL & MQTT details
node server.js
```

## 3️⃣ Frontend Setup
bash script:
```
cd ../smart-energy-dashboard
npm install
npm start
```

---

## ⚙️ Backend API Routes
Method	Endpoint	Description
GET	/api/readings	Fetch latest energy readings

---

## 🛠️ Troubleshooting
1️⃣ MQTT Data Not Updating?
Ensure the backend is correctly publishing simulated data. If needed, restart the backend.

---

## PostgreSQL Storage Issues?
The backend automatically deletes old data to manage storage limits.

---

## 📜 Contributions
Contributions are welcome! Feel free to fork, star, and submit pull requests.

---

## 📌 Maintained by: Muhammad Hammad Chaudhary 🚀
