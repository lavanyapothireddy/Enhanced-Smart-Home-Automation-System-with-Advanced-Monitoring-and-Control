# 🏠 Enhanced Smart Home Automation System with Advanced Monitoring and Control (IoT Project)

A **Smart Home Automation System** built using **Arduino** and sensors to monitor environmental conditions and control home appliances through a **web-based dashboard**.

This project demonstrates the integration of **IoT hardware + web technologies** for real-time monitoring and remote appliance control.

---

## 🎯 Main Objective

The main objective of this project is to **transform traditional home appliances (light, fan, and socket)** into **smart, automated, and remotely controllable devices** using IoT.

### 🔄 How This System Is Different from Traditional Homes

| Appliance | Traditional Home                       | This Smart Home System                                                                                            |
| --------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 💡 Light  | Manually switched ON/OFF               | Automatically adjusts brightness based on sunlight (LDR) and can be controlled from a webpage                     |
| 🌀 Fan    | Manually operated using wall switch    | Automatically turns ON/OFF based on environmental conditions and can be controlled remotely                       |
| 🔌 Socket | Always provides power once switched ON | Smart socket controlled using a relay – power can be turned ON/OFF remotely, improving safety & energy efficiency |

### 🌟 Key Benefits Over Traditional Homes

* ✅ Automation reduces manual effort
* ✅ Saves electricity by avoiding unnecessary usage
* ✅ Remote control improves convenience
* ✅ Smart socket prevents power wastage and enhances safety
* ✅ Real-time monitoring of environment

---

## 📌 Features

* 🌡 Real-time **Temperature & Humidity** monitoring (DHT11)
* 🚶 **Motion Detection** using PIR sensor
* 💡 **Light Intensity Detection** using LDR
* 🔆 Automatic LED brightness control based on sunlight
* 🔌 Appliance control (LED/Fan) using **Relay Module**
* 🌐 Web dashboard for live data & control

---

## 🛠 Tech Stack

### Hardware

* Arduino Uno
* DHT11 Sensor
* PIR Motion Sensor
* LDR Module (Digital)
* Relay Module
* LED
* Fan / Appliance
* Breadboard & Jumper Wires

### Software

* Arduino IDE
* HTML, CSS, JavaScript
* Serial Communication
* VS Code / Browser

---

## 🔌 Circuit Connections

### DHT11

* VCC → 5V
* GND → GND
* DATA → D2

### PIR Sensor

* VCC → 5V
* GND → GND
* OUT → D3

### LDR Module (Digital)

* VCC → 5V
* GND → GND
* D0 → D7

### Relay Module

* VCC → 5V
* GND → GND
* IN1 → D8 (LED)
* IN2 → D9 (Fan)

---

## ⚙️ How It Works

1. Arduino reads data from DHT11, PIR, and LDR sensors.
2. Sensor values are processed and sent via Serial communication.
3. The web dashboard displays live sensor readings.
4. Based on sunlight, LED brightness is adjusted automatically.
5. Appliances are controlled using relay modules.
6. User can manually control devices from the webpage.

---

## 📂 Project Structure

```
Smart-Home-Automation/
│
├── Arduino/
│   └── smart_home.ino
│
├── Web/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── Images/
│   └── circuit_diagram.png
│
└── README.md
```

---

## 🚀 Getting Started

1. Clone the repository

   ```bash
   git clone https://github.com/your-username/Smart-Home-Automation.git
   ```
2. Connect the hardware as per the circuit connections.
3. Upload the Arduino code using Arduino IDE.
4. Open Serial Monitor (9600 baud rate) to verify sensor output.
5. Open `index.html` in a browser to access the dashboard.

---

## ❗ Troubleshooting

* **NaN values on dashboard** → Check sensor wiring & initialization
* **LED/Fan not working** → Verify relay connections
* **Motion always detected** → Adjust PIR sensor sensitivity
* **DHT11 not responding** → Check DATA pin & library installation

---

## 🔮 Future Improvements

* Add ESP8266 / ESP32 for Wi-Fi-based control
* Cloud data logging
* Mobile app integration
* Voice control using AI assistant

---

## 👩‍💻 Author

**Lavanya Pothireddy**
B.Tech CSE | IoT & Smart Systems
GitHub: [https://github.com/lavanyapothireddy](https://github.com/lavanyapothireddy)

---

⭐ If you like this project, give it a star on GitHub!
