import paho.mqtt.client as mqtt
import random
import time

# Define MQTT Broker
# BROKER = "localhost"
# Define MQTT Broker (Change from localhost to a free broker or your backend URL)
BROKER = "mqtt.eclipseprojects.io"  # Use a free MQTT broker
PORT = 1883
TOPICS = ["hvac/floor1", "hvac/floor2", "lighting/floor1", "lighting/floor2"]

# Updated callback for Paho MQTT v2 API
def on_connect(client, userdata, flags, reason_code, properties):
    if reason_code == 0:
        print("Connected to MQTT Broker!")
    else:
        print(f"Failed to connect, return code {reason_code}")

# Initialize MQTT Client with modern API
client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)  # Use latest version
client.on_connect = on_connect

# Connect to the broker with error handling
try:
    client.connect(BROKER, PORT, 60)
    client.loop_start()  # Start background thread to handle communication
except Exception as e:
    print(f"Connection failed: {e}")
    exit(1)

# Publish simulated HVAC & lighting energy usage data
while True:
    for topic in TOPICS:
        energy_usage = round(random.uniform(500, 1500), 2)  # Simulated kWh
        client.publish(topic, str(energy_usage))
        print(f"Published {energy_usage}W to {topic}")
    time.sleep(5)  # Send updates every 5 seconds