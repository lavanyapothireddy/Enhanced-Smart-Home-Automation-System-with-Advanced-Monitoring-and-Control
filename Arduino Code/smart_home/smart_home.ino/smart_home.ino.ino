#include <DHT.h>

#define DHTPIN 2
#define DHTTYPE DHT11
#define PIR 3
#define RELAY 4     // Fan
#define LED 5       // Light
#define BUZZER 6
#define LDR A1      // LDR sensor connected to analog pin
#define CHARGER A0 

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
  pinMode(PIR, INPUT);
}

void loop() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();
  int light = analogRead(LDR);
  int motion = digitalRead(PIR);
  int socketValue = analogRead(SOCKET);

  // Battery logic
  String chargingStatus = socketValue > 900 ? "Fully Charged" : "Charging";

  Serial.print("{");
  Serial.print("\"temperature\":"); Serial.print(temp); Serial.print(",");
  Serial.print("\"humidity\":"); Serial.print(hum); Serial.print(",");
  Serial.print("\"light\":"); Serial.print(light); Serial.print(",");
  Serial.print("\"motion\":"); Serial.print(motion); Serial.print(",");
  Serial.print("\"charging\":\""); Serial.print(chargingStatus); Serial.print("\"");
  Serial.println("}");

  delay(2000);
}
