let port;
let writer;
let devices = [];
let autoMode = false;
let onTime = 0;
let energy = 0;

// -------- LOGIN --------
function login() {
  const name = document.getElementById("loginName").value.trim();
  const email = document.getElementById("loginEmail").value.trim();
  if (!name || !email) { alert("Please enter name and email"); return; }

  document.getElementById("loginOverlay").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  document.getElementById("welcomeText").innerText = "Welcome " + name;
  document.getElementById("setName").innerText = name;
  document.getElementById("setEmail").innerText = email;
}

function showRegister() {
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("registerForm").classList.remove("hidden");
}

function showLogin() {
  document.getElementById("registerForm").classList.add("hidden");
  document.getElementById("loginForm").classList.remove("hidden");
}

function register() { alert("Registration successful! Please login."); showLogin(); }

// -------- PAGE NAVIGATION --------
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(pageId).classList.remove("hidden");
}

// -------- DEVICES --------
function addDevice() {
  const name = prompt("Enter appliance name:");
  if (!name) return;
  devices.push({ id: Date.now(), name });
  renderDevices();
}

function renderDevices() {
  const container = document.getElementById("deviceList");
  container.innerHTML = "";
  if (devices.length === 0) { container.innerHTML = "<p class='empty'>No devices added</p>"; return; }

  devices.forEach(device => {
    const card = document.createElement("div");
    card.className = "device-card";
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center">
        <h3>${device.name}</h3>
        <div>
          <button onclick="editDevice(${device.id})">✏️</button>
          <button onclick="removeDevice(${device.id})">🗑</button>
        </div>
      </div>
      <button onclick="controlDevice('${device.name}','ON')">TURN ON</button>
      <button onclick="controlDevice('${device.name}','OFF')">TURN OFF</button>
      ${device.name.toLowerCase() === 'led' ? `<button onclick="controlDevice('${device.name}','AUTO')">AUTO MODE</button>` : ""}
    `;
    container.appendChild(card);
  });
}

function editDevice(id) {
  const device = devices.find(d => d.id === id);
  const newName = prompt("Edit appliance name:", device.name);
  if (newName) { device.name = newName; renderDevices(); }
}

function removeDevice(id) { devices = devices.filter(d => d.id !== id); renderDevices(); }

// -------- DEVICE CONTROL --------
function controlDevice(device, action) {
  if (!port) { alert("Arduino not connected!"); return; }

  // Trim spaces & convert to lowercase
  device = device.trim().toLowerCase();
  console.log("Device:", device, "Action:", action); // debug

  if (device.includes("light")) {
    if (action === "ON") sendToArduino("1");
    else if (action === "OFF") sendToArduino("0");
    else if (action === "AUTO") sendToArduino("A");

  }else if (device.includes("fan")) {
  if (action === "ON") sendToArduino("F");
  else if (action === "OFF") sendToArduino("f");
  else if (action === "AUTO") sendToArduino("T");

} else if (device.includes("socket")) {
  if (action === "ON") sendToArduino("S");
  else if (action === "OFF") sendToArduino("s");
  else if (action === "AUTO") sendToArduino("C");
}else {
    alert("Unknown device: " + device);
  }
}


// -------- CONNECT ARDUINO --------
async function connectArduino() {
  if (!("serial" in navigator)) { alert("Web Serial API not supported"); return; }
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    writer = port.writable.getWriter();
    document.getElementById("connStatus").innerText = "Connected";
    document.getElementById("connStatus").style.color = "green";
    readSensors(); // start reading sensors
  } catch (err) { console.error(err); alert("Connection failed!"); }
}

// -------- SEND TO ARDUINO --------
async function sendToArduino(cmd) {
  if (port && writer) {
    const data = new TextEncoder().encode(cmd);
    await writer.write(data);
    console.log("Sent:", cmd);
  }
}

// -------- READ SENSORS --------
async function readSensors() {
  if (!port) return;
  const reader = port.readable.getReader();
  let buffer = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += new TextDecoder().decode(value);
      let lines = buffer.split("\n");
      buffer = lines.pop();
      for (let line of lines) {
        line = line.trim();
        if (line.startsWith("T:")) {
          const parts = line.split(",");
          document.getElementById("tempValue").innerText = parts[0].split(":")[1];
          document.getElementById("humValue").innerText = parts[1].split(":")[1];
          document.getElementById("motionValue").innerText = parts[2].split(":")[1] == "1" ? "Detected" : "No";
          document.getElementById("lightValue").innerText = parts[3].split(":")[1];
        }
      }
    }
  } catch (err) { console.error(err); }
  finally { reader.releaseLock(); }
}

// -------- ENERGY SIMULATION --------
setInterval(() => {
  onTime += Math.random() * 2;
  energy += Math.random() * 0.5;
  document.getElementById("onTime").innerText = onTime.toFixed(1);
  document.getElementById("energyValue").innerText = energy.toFixed(2);
}, 3000);
