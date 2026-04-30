#include <DHT.h>

#define DHT_TYPE DHT11

#define LIGHT_PIN   11
#define FAN_PIN      8

#define PIR_PIN      3
#define LDR_PIN      A0
#define DHT_PIN      2

DHT dht(DHT_PIN, DHT_TYPE);

bool autoLight = false;

void setup() {
  pinMode(LIGHT_PIN, OUTPUT);
  pinMode(FAN_PIN, OUTPUT);   

  pinMode(PIR_PIN, INPUT);
  pinMode(LDR_PIN, INPUT);

  digitalWrite(LIGHT_PIN, LOW);  // Light OFF initially
  digitalWrite(FAN_PIN, LOW);    // Fan OFF initially

  Serial.begin(9600);
  dht.begin();
}

void loop() {

  // Serial commands for manual control
  while (Serial.available()) {
    char cmd = Serial.read();
    if (cmd == '\n' || cmd == '\r' || cmd == ' ') continue;

    switch (cmd) {
      // Light control
      case '1': digitalWrite(LIGHT_PIN, HIGH); autoLight = false; break;
      case '0': digitalWrite(LIGHT_PIN, LOW);  autoLight = false; break;
      case 'A': autoLight = true; break;  // Auto mode

      // Fan control
      case 'F': digitalWrite(FAN_PIN, HIGH); break;
      case 'f': digitalWrite(FAN_PIN, LOW);  break;
    }
  }

  // Auto light mode based on LDR
  if (autoLight) {
    int ldrValue = analogRead(LDR_PIN);
    digitalWrite(LIGHT_PIN, ldrValue < 500 ? HIGH : LOW);  // Adjust threshold if needed
  }

  // Send sensor readings to Serial
  Serial.print("T:");
  Serial.print(dht.readTemperature());
  Serial.print(",H:");
  Serial.print(dht.readHumidity());
  Serial.print(",M:");
  Serial.print(digitalRead(PIR_PIN));
  Serial.print(",L:");
  Serial.println(analogRead(LDR_PIN));

  delay(2000);  // 2-second interval
}
