#include <DHT.h>

#define LED_PIN 11
#define LDR_PIN A1
#define PIR_PIN 7
#define DHTPIN 2
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

bool autoMode = true;
bool manualOff = false;

unsigned long motionStart = 0;
bool motionConfirmed = false;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(PIR_PIN, INPUT);

  Serial.begin(9600);
  dht.begin();
}

void loop() {
  // -------- READ WEB COMMANDS --------
  if (Serial.available()) {
    char cmd = Serial.read();
    if (cmd == 'A') { autoMode = true; manualOff = false; }
    if (cmd == 'M') autoMode = false;
    if (cmd == '0') { manualOff = true; analogWrite(LED_PIN, 0); }
    if (cmd == '1') { manualOff = false; analogWrite(LED_PIN, 255); }
  }

  // -------- PIR DEBOUNCE --------
  int pirRaw = digitalRead(PIR_PIN);
  if (pirRaw == HIGH) {
    if (motionStart == 0) motionStart = millis();
    if (millis() - motionStart > 2000) motionConfirmed = true;
  } else {
    motionStart = 0;
    motionConfirmed = false;
  }

  // -------- LDR + AUTO BRIGHTNESS --------
  int light = analogRead(LDR_PIN);
  int brightness = 0;

  if (autoMode && !manualOff) {
    if (motionConfirmed) {
      int inverted = 1023 - light;
      brightness = map(inverted, 0, 1023, 30, 255);
      brightness = constrain(brightness, 30, 255);
      analogWrite(LED_PIN, brightness);
    } else {
      analogWrite(LED_PIN, 0);
    }
  }

  // -------- READ DHT11 --------
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();

  if (isnan(temp) || isnan(hum)) {
    temp = 0;
    hum = 0;
  }

  // -------- SEND TO WEB --------
  Serial.print("T:");
  Serial.print(temp);
  Serial.print(",H:");
  Serial.print(hum);
  Serial.print(",L:");
  Serial.print(light);
  Serial.print(",B:");
  Serial.print(brightness);
  Serial.print(",M:");
  Serial.println(motionConfirmed ? 1 : 0);

  delay(1000);
}
