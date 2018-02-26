/*
 * MIRSI - Monitoramento Inteligente e Remoto da Saúde do Idoso 
 * Prototipo de um sistema para monitoramento remoto da saúde do idoso 
 * Microcontrolador: ESP866
 * Plataforma: NodeMCU 1.0
 * Sensores: Temperatura, Pulso e Acelerômetro
 * Conexão: wi-fi
 * Autor: Cícero Moura (Tudo posso naquele que me fortalece!)
 * Data Inicial: 01/08/2017
 * Ultima Atualização: 27/01/2017
*/

//Inclusão das bibliotecas
#include <Ticker.h>
#include <Wire.h>
#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <MPU6050.h>

//Definição dos pinos
#define pinoPulseSensor A0
#define mpuSDA D5
#define mpuSDL D6

//Dados para conectar ao Wi-FI
const char* ssid = "wifi";
const char* senha = "senha";

//dados da API para enviar os dados
const char* urlAPI = "urlWebAPI";
const int apiPorta = 443;

WiFiClientSecure client;

// Variáveis volateis
// do sensor de Batimento cardiaco
volatile int BPM;
volatile int Signal;
volatile int IBI = 600;
volatile boolean Pulse = false;
volatile boolean QS = false;
Ticker flipper;

//Variaveis do MPU6050
MPU6050 mpu;
Vector aclNormalizado;
Vector girNormalizado;
float temperatura;
//boolean detectorQuedas = false;


/*
 * Configurações iniciais
 */
void setup(){
  Serial.begin(115200);

  setupWiFI();
  setupPulseSensor();
  setupMPU();
}

/*
 * Execução dedicada do sketch
 */
void loop(){
  if (QS == true){ 
        QS = false; 
  }

  
  lerDadosMPU();
//  detectarQuedas();
  enviarDadosAPI();
  
  delay(2000);
}

/*
 * Inicializa o Wi-Fi
 * NodeMCU
 */
void setupWiFI() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, senha);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    //Serial.print(".");
  }
  /*Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());*/
}

/*
 * Inicializa o sensor de batimentos cardiaco
 * Pulse Sensor Amped
 */
void setupPulseSensor() {
  interruptSetup();
}

/*
 * Inicializa o Acelerometro e Giroscópio
 * MPU-6050
 */
void setupMPU() {
  Wire.begin(mpuSDA, mpuSDL);
  
  while(!mpu.begin(MPU6050_SCALE_2000DPS, MPU6050_RANGE_2G)) {
    Serial.println("Could not find a valid MPU6050 sensor, check wiring!");
    delay(500);
  }

  mpu.calibrateGyro();
  mpu.setThreshold(3);

  /*mpu.setAccelPowerOnDelay(MPU6050_DELAY_3MS);
  mpu.setIntFreeFallEnabled(true);
  mpu.setIntZeroMotionEnabled(false);
  mpu.setIntMotionEnabled(false);
  mpu.setDHPFMode(MPU6050_DHPF_5HZ);
  mpu.setFreeFallDetectionThreshold(17);
  mpu.setFreeFallDetectionDuration(2);  
  
  
  attachInterrupt(0, doInt, RISING);*/
}

/*void doInt() {
  detectorQuedas = true;  
}

void detectarQuedas() {
   
  if (detectorQuedas) {
    detectorQuedas = false;
  }
  
}*/

/*
 * Realiza a leitura do Acelerômetro, Giroscópio e Temperatura (ºC)
 * e reorna a leitura do sensor
 */
void lerDadosMPU() {
  aclNormalizado = mpu.readNormalizeAccel();
  girNormalizado = mpu.readNormalizeGyro();
  temperatura = mpu.readTemperature() + 0.5;
  
  /*Serial.print(" Xnorm = ");
  Serial.print(aclNormalizado.XAxis);
  Serial.print(" Ynorm = ");
  Serial.print(aclNormalizado.YAxis);
  Serial.print(" Znorm = ");
  Serial.println(aclNormalizado.ZAxis);

  Serial.print(" Xnorm = ");
  Serial.print(girNormalizado.XAxis);
  Serial.print(" Ynorm = ");
  Serial.print(girNormalizado.YAxis);
  Serial.print(" Znorm = ");
  Serial.println(girNormalizado.ZAxis);

  Serial.print(" Temp = ");
  Serial.print(temperatura);
  Serial.println(" *C");*/
}

/*
 * Monta mensagem e url para enviar os dados
 */
String montaURL() {
  String msg;
  
  msg.concat("GET /api/save/get?");
  msg.concat("bpm=");
  msg.concat(BPM);
  msg.concat("&temperatura=");
  msg.concat(temperatura);
  msg.concat("&aclX=");
  msg.concat(aclNormalizado.XAxis);
  msg.concat("&aclY=");
  msg.concat(aclNormalizado.YAxis);
  msg.concat("&aclZ=");
  msg.concat(aclNormalizado.ZAxis);
  msg.concat("&girX=");
  msg.concat(girNormalizado.XAxis);
  msg.concat("&girY=");
  msg.concat(girNormalizado.YAxis);
  msg.concat("&girZ=");
  msg.concat(girNormalizado.ZAxis);
  //msg.concat("&detectorQuedas=");
  //msg.concat(detectorQuedas);
  msg.concat(" HTTP/1.1\r\nHost: ");
  msg.concat(urlAPI);
  msg.concat("\r\nConnection: close\r\n\r\n");
  
  return msg;
}

/*
 * Envia os dados para a API Online
 */
void enviarDadosAPI() {
  
  if (!client.connect(urlAPI, apiPorta)) {
    //Serial.println("connection failed");
    ESP.restart();
  }

  String url = montaURL();
  //Serial.print("requesting URL: ");
  Serial.println(url);

  client.print(url);

  //Serial.println("request sent");
  /*while (client.connected()) {
    String line = client.readStringUntil('\n');
    if (line == "\r") {
      Serial.println("headers received");
      break;
    }
  }*/
}
