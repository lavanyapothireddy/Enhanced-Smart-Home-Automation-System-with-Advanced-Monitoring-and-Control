let port;
let reader;
let writer;

let ledState = 0;
let energyStart = 0;
let totalOnTime = 0;

// ---------- LOGIN ----------
function login() {
  const name = loginName.value;
  const email = loginEmail.value;

  welcomeText.innerText = "Welcome " + name;
  setName.innerText = name;
  setEmail.innerText = email;

  loginOverlay.classList.add("hidden");
  app.classList.remove("hidden");
}

// ---------- LOGOUT ----------
function logout() {
  location.reload();
}

// ---------- PAGE SWITCH ----------
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// ---------- CONNECT ARDUINO ----------
async function connectArduino() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    writer = port.writable.getWriter();
    reader = port.readable.getReader();

    connStatus.innerText = "Connected";
    readSerialData();
  } catch {
    alert("Arduino connection failed");
  }
}

// ---------- READ SERIAL ----------
async function readSerialData() {
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value);
    let lines = buffer.split("\n");
    buffer = lines.pop();

    lines.forEach(processLine);
  }
}

// ---------- PROCESS SENSOR DATA ----------
function processLine(line) {
  line = line.trim();
  let parts = line.split(",");

  parts.forEach(p => {
    if (p.startsWith("T:")) tempValue.innerText = p.split(":")[1];
    if (p.startsWith("H:")) humValue.innerText = p.split(":")[1];
    if (p.startsWith("L:")) lightValue.innerText = p.split(":")[1];
    if (p.startsWith("M:")) motionValue.innerText =
      p.split(":")[1] == "1" ? "Motion Detected" : "No Motion";
    if (p.startsWith("S:")) {
      let current = parseInt(p.split(":")[1]);
      if (current === 1 && ledState === 0) energyStart = Date.now();
      if (current === 0 && ledState === 1) {
        totalOnTime += (Date.now() - energyStart) / 1000;
        updateEnergy();
      }
      ledState = current;
    }
  });
}

// ---------- ENERGY CALCULATION ----------
function updateEnergy() {
  onTime.innerText = totalOnTime.toFixed(1);
  // Assume 10W device
  let energy = (10 * totalOnTime) / 3600;
  energyValue.innerText = energy.toFixed(3);
}

// ---------- ADD DEVICE ----------
function addDevice() {
  const name = prompt("Enter device name");
  if (!name) return;

  const div = document.createElement("div");
  div.className = "device-card";
  div.innerHTML = `
    <h3>${name}</h3>
    <button onclick="turnOn()">TURN ON</button>
    <button onclick="turnOff()">TURN OFF</button>
  `;
  deviceList.appendChild(div);
}

// ---------- APPLIANCE CONTROL ----------
async function turnOn() {
  if (!writer) return alert("Connect Arduino first");
  await writer.write(new TextEncoder().encode("1"));
}

async function turnOff() {
  if (!writer) return alert("Connect Arduino first");
  await writer.write(new TextEncoder().encode("0"));
}
