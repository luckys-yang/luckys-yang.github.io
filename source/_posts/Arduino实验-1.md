---
title: Arduino实验-1
cover: /img/num161.webp
categories:
  - Arduino
comments: false
abbrlink: df1d5046
date: 2023-12-26 15:04:30
---



## 前言

> 参考文章

[Arduino 1.8.19集成开发环境下载](https://www.npackd.org/p/ArduinoSA.arduino/1.8.19)

[RFID 与 Arduino | 如何将 RC522 RFID 模块与 Arduino 结合使用](https://www.youtube.com/watch?v=MA3hWp2efZ8)

[上传失败处理](https://forum.arduino.cc/t/avrdude-ser-open-cant-set-com-state-for-com7/1118832/4)

[arduino+RFID控制一个小灯](https://blog.csdn.net/yyq7878748/article/details/117884886)

[在线仿真](https://wokwi.com/projects/new/arduino-uno)

[Arduino库详细](https://www.arduino.cc/reference/en/libraries/)

## vscode配置环境

> 此插件适用于旧版IDE版本：支持的旧版 Arduino IDE 版本为`1.6.x`及以上（但不包括）`2.0.0`，不支持Arduino IDE `2.X.Y`，并且将来没有支持计划

1. vscode搜索插件 `Arduino`
2. 按住`ctrl+,`进入设置界面，进入 `setting.json` 文件

Arduino.path那里设置为自己的安装路径即可，其他的直接复制下面即可

```json
"arduino.path": "D:\\arduino_ide\\Arduino",
"C_Cpp.intelliSenseEngine": "Tag Parser",
"editor.insertSpaces": true,
"files.autoGuessEncoding": true,
"arduino.logLevel": "info",
"explorer.confirmDelete": false,
"editor.detectIndentation": false
```

3. `.vscode文件夹` 里在 `Arduino.json` 添加最后一行，其他的默认不需要跟我下面一样：

```json
{
    "board": "arduino:avr:uno",
    "sketch": "test1.ino",
    "port": "COM27",
    "output": "./Arduino/build"
}
```

4. 在屏幕的右下角可以选择串口和开发板的型号

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231226152816.webp)

5. 编译与上传

在左上角

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231226152935.webp)



## 板子

型号： `Arduino Uno`

> 【供电】
>
> 直流电源插孔：可以使用电源插孔为Arduino开发板供电。电源插孔通常连接到一个适配器。开发板的供电范围可以是5-20V，但制造商建议将其保持在 `7-12V` 之间。高于12V时，稳压芯片可能会过热，低于7V可能会供电不足
>
> VIN引脚：该引脚用于使用外部电源为Arduino Uno开发板供电。电压应控制在上述提到的范围内
>
> USB电缆：连接到计算机时，提供500mA/5V电压

> 在Arduino上，ADC具有 `10位分辨率` ，这意味着它可以通过1,024个数字电平表示模拟电压

- 数字引脚

> 每个引脚可提供/接收最高40 mA的电流。但推荐的电流是20毫安
>
> 所有引脚提供的绝对最大电流为200mA
>
> ●  低于0.8v - 视为0
>
> ●  高于2.0v - 视为1
>
> 板子有两个外部中断：INT0和INT1
>
> `Aref`：模拟输入的参考电压

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231226191335.webp)

- 模拟引脚

> 有6个模拟引脚，它们作为ADC

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231226192107.webp)

- 其他

>  **IOREF**：该引脚是输入/输出参考。它提供了微控制器工作的参考电压
>
> **RESET**： 复位Arduino开发板

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231226192402.webp)



## 模块

### RFID

> Arduino库：https://github.com/omersiar/RFID522-Door-Unlock
>
> 也可以在IDE里面进行安装库：点击「项目」—「加载库」—「管理库」，查找选择「MFC522」最新版本进行安装
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231226192806.webp)
>
> MFRC522芯片
>
> 附带的白卡和钥匙扣是S50卡，每张卡都有自己的标识(UID)

- 接线

|                RFID模块                 | Arduino板 |
| :-------------------------------------: | :-------: |
| SDA【在SPI接口中为NSS（从机标志管脚）】 |    10     |
|                   SCK                   |    13     |
|       MOSI【MCU输出，RC522接收】        |    11     |
|       MISO【RC522输出，MCU接收】        |    12     |
|           IRQ【中断请求输出】           |     /     |
|                   GND                   |    GND    |
|                   RST                   |     9     |
|                  3.3V                   |   3.3V    |



### 舵机

- 安装库

在 Mega 以外的板上，使用该库会禁用`analogWrite()` 引脚 9 和 10 上的 (PWM) 功能

- 接线

|       舵机       | Arduino板 |
| :--------------: | :-------: |
|       红色       |    5V     |
|    黑色/棕色     |    GND    |
| 黄色、橙色或白色 | PWM信号线 |



### 定时器

板子有三个定时器

> **timer0**：一个被Arduino的delay(), millis()和micros()使用的**8位**定时器
> **timer1**：一个被Arduino的Servo()库使用的**16位**定时器
> **timer2**：一个被Arduino的Tone()库使用的**8位**定时器



### 整合代码

{% folding, test1.ino %}

```cpp
#include <MFRC522.h>
#include <Servo.h>

/*========================引脚宏定义========================*/
// 从机片选引脚
#define RFID_SDA_PIN 10
// RFID复位引脚
#define RFID_RST_PIN 9
// LED1引脚(绿)
#define LED1_PIN 2
// LED2引脚(红)
#define LED2_PIN 3
// LED3引脚(蓝)
#define LED3_PIN 4
// 舵机引脚
#define Servo_PIN 5
// 蜂鸣器引脚
#define Buzzer_PIN 6

/*========================其他宏定义========================*/
#define RFID_MAX_ID 2 // 最大ID用户数量
#define USE_RFID_Debug 1  // RFID使用串口打印调试功能

/*========================全局变量========================*/
/*RFID相关*/
MFRC522 rfid(RFID_SDA_PIN, RFID_RST_PIN); // 实例化
MFRC522::MIFARE_Key key;

typedef struct 
{
  bool isRFID_ID_Flag;  // RFID符合标志位
  byte ID_PICC_Arr[RFID_MAX_ID][4];  // 存储已知的RFID卡秘钥
} bsp_RFID_st;

bsp_RFID_st bsp_RFID = 
{
  .isRFID_ID_Flag = false,
  .ID_PICC_Arr = {
    {0x86, 0x01, 0x6C, 0x1F},
    {0xCA, 0x0D, 0x55, 0xD3},
    },
};

/*LED相关*/
typedef enum
{
  LED_ON = 0,
  LED_OFF = 1
} LED_Status_et;

/*Servo相关*/
Servo my_servo; // 创建一个舵机对象

typedef struct 
{
  bool Servo_Start_Count_Flag;  // 舵机转动完成标志位
} bsp_Servo_st;

bsp_Servo_st bsp_Servo = 
{
  .Servo_Start_Count_Flag = false,
};

/*Buzzer相关*/
typedef enum
{
  BUZZER_ON = 0,
  BUZZER_OFF = 1
} Buzzer_Status_et;

typedef struct 
{
  bool Buzzer_Ring_Flag;  // 蜂鸣器响一段时间标志位
} bsp_Buzzer_st;

bsp_Buzzer_st bsp_Buzzer = 
{
  .Buzzer_Ring_Flag = false,
};

/*========================函数声明========================*/
static void BSP_RFID_Init(void);  // RFID初始化
static void BSP_RFID_Check(void); // RFID检测
static void printHex(byte *buffer, byte bufferSize);  // 打印十六进制
static void printDec(byte *buffer, byte bufferSize);  // 打印十进制
static void BSP_RFID_Handler(void); // RFID处理函数

static void LED_Init(void); // LED初始化
static void LED_Control(uint8_t led_pin, LED_Status_et led_status); // LED控制亮灭
static void LED_Flip(uint8_t led_pin);  // 控制LED翻转

static void UART_Init(void);  // 串口初始化

static void Servo_Init(void); // 舵机初始化
static void Servo_Conntrol_Angle(uint8_t angle);  // 控制舵机转动角度

static void Timer2_Init(void);  // 定时器2初始化

static void Buzzer_Init(void);  // 蜂鸣器初始化
static void Buzzer_Control(Buzzer_Status_et buzzer_status); // 控制蜂鸣器
static void Buzzer_Ring(void);  // 控制蜂鸣器响一段时间

void setup()
{
  UART_Init();     // 串口初始化
  LED_Init();      // LED初始化
  Buzzer_Init();  // 蜂鸣器初始化
  Servo_Init(); // 舵机初始化
  Timer2_Init();  // 定时器2初始化
  BSP_RFID_Init(); // RFID初始化
}

void loop()
{
  BSP_RFID_Check();   // RFID检测
}

/*==============================BUZZER==============================*/
static void Buzzer_Init(void)
{
  pinMode(Buzzer_PIN, OUTPUT);  // 输出模式
  Buzzer_Control(BUZZER_OFF); // 默认关闭
}

// 控制蜂鸣器
static void Buzzer_Control(Buzzer_Status_et buzzer_status)
{
  if (BUZZER_ON == buzzer_status)
  {
    digitalWrite(Buzzer_PIN, LOW);
  }
  else
  {
    digitalWrite(Buzzer_PIN, HIGH);
  }
}

// 控制蜂鸣器响一段时间
static void Buzzer_Ring(void)
{
  Buzzer_Control(BUZZER_ON);
  bsp_Buzzer.Buzzer_Ring_Flag = true;
}

/*==============================Servo==============================*/
// 舵机初始化
static void Servo_Init(void)
{
  my_servo.attach(Servo_PIN); // 初始化舵机引脚
  Servo_Conntrol_Angle(0);  // 控制舵机角度(默认复位0°)
}

// 控制舵机转动角度
static void Servo_Conntrol_Angle(uint8_t angle)
{
  my_servo.write(angle);
}
/*==============================LED==============================*/
// LED初始化
static void LED_Init(void)
{
  pinMode(LED1_PIN, OUTPUT);  // 输出模式
  pinMode(LED2_PIN, OUTPUT);  // 输出模式
  pinMode(LED3_PIN, OUTPUT);  // 输出模式

  // 默认全灭
  LED_Control(LED1_PIN, LED_OFF);
  LED_Control(LED2_PIN, LED_OFF);
  LED_Control(LED3_PIN, LED_OFF);
}

// LED控制
static void LED_Control(uint8_t led_pin, LED_Status_et led_status)
{
  if (LED_ON == led_status)
  {
    digitalWrite(led_pin, LOW);
  }
  else
  {
    digitalWrite(led_pin, HIGH);
  }
}

// 控制LED翻转
static void LED_Flip(uint8_t led_pin)
{
  static uint8_t flag = false;

  if (flag)
  {
    LED_Control(led_pin, LED_ON);
  }
  else
  {
    LED_Control(led_pin, LED_OFF);
  }
  flag = !flag;
}

/*==============================RFID==============================*/

// 将字节数组作为十六进制值输出打印
static void printHex(byte *buffer, byte bufferSize)
{
  for (byte i = 0; i < bufferSize; i++)
  {
    Serial.print(buffer[i] < 0x10 ? " 0" : " "); // 比较当前字节的值是否小于16（0x10的十六进制值为16）小于则前面补0大于则不需要直接补空格
    Serial.print(buffer[i], HEX);
  }
}

// 将字节数组作为十进制值输出打印
static void printDec(byte *buffer, byte bufferSize)
{
  for (byte i = 0; i < bufferSize; i++)
  {
    Serial.print(buffer[i] < 0x10 ? " 0" : " ");
    Serial.print(buffer[i], DEC);
  }
}

// RFID初始化
static void BSP_RFID_Init(void)
{
  SPI.begin();     // SPI初始化
  rfid.PCD_Init(); // MFRC522初始化
}

// 检测RFID
static void BSP_RFID_Check(void)
{
  // 判断上一个处理完没
  if (bsp_RFID.isRFID_ID_Flag)
  {
    return;
  }
  // 检测是否有新卡(返回true，表示检测到新卡 | 返回false，表示未检测到新卡)
  if (!rfid.PICC_IsNewCardPresent())  // 没有新卡则直接退出
  {
    return;
  }

  // 读取卡片的 UID(需要先调用【PICC_IsNewCardPresent】检测是否有新卡 读取成功返回1 失败返回0)
  if (!rfid.PICC_ReadCardSerial())
  {
    return;
  }

  MFRC522::PICC_Type piccType = rfid.PICC_GetType(rfid.uid.sak);  // 获取卡类型

#if USE_RFID_Debug
  Serial.print(F("PICC type: "));
  Serial.println(rfid.PICC_GetTypeName(piccType));  // 打印卡类型
#endif

  // 检查卡是不是经典类型，不是则强制退出
  if ((piccType != MFRC522::PICC_TYPE_MIFARE_MINI) &&
      (piccType != MFRC522::PICC_TYPE_MIFARE_1K) &&
      (piccType != MFRC522::PICC_TYPE_MIFARE_4K))
  {

#if USE_RFID_Debug    
    Serial.println(F("Your tag is not of type MIFARE Classic.")); // 打印错误提示
#endif

    return;
  }

#if USE_RFID_Debug
    // 打印卡ID
    Serial.println(F("The NUID tag is:"));
    Serial.print(F("In hex: "));
    printHex(rfid.uid.uidByte, rfid.uid.size);  // 打印十六进制
    Serial.println(); // 换行

    Serial.print(F("In dec: "));
    printDec(rfid.uid.uidByte, rfid.uid.size);    // 打印十进制
    Serial.println();
#endif

  // 判断卡ID是否符合
  for (byte i = 0; i < RFID_MAX_ID; i++)
  {
      if (rfid.uid.uidByte[0] == bsp_RFID.ID_PICC_Arr[i][0])
      {
        if (rfid.uid.uidByte[1] == bsp_RFID.ID_PICC_Arr[i][1])
        {
          if (rfid.uid.uidByte[2] == bsp_RFID.ID_PICC_Arr[i][2])
          {
            if (rfid.uid.uidByte[3] == bsp_RFID.ID_PICC_Arr[i][3])
            {
              bsp_RFID.isRFID_ID_Flag = true; // 标志位置1
              BSP_RFID_Handler();
            }
          }
        }
      }
  }

  rfid.PICC_HaltA();  // 将卡片进入休眠状态
  rfid.PCD_StopCrypto1();  // 停止 Crypto1 加密协议
}

// RFID处理函数
static void BSP_RFID_Handler(void)
{
  if (bsp_RFID.isRFID_ID_Flag)
  {
    LED_Control(LED1_PIN, LED_ON);
    LED_Control(LED2_PIN, LED_OFF);
    Buzzer_Ring();
    Servo_Conntrol_Angle(180);
    bsp_Servo.Servo_Start_Count_Flag = true; // 开始计数
#if USE_RFID_Debug    
    Serial.print(F("PASS"));
#endif
  }
}

/*==============================OTHER==============================*/
// 串口初始化
static void UART_Init(void)
{
  Serial.begin(9600); // 波特率9600
}

// 定时器2初始化
static void Timer2_Init(void)
{
  // (15 + 1) * 64μs = 1ms
  TCCR2A = 0;
  TCCR2B = 0;
  TCNT2 = 0;
  OCR2A = 15;
  TCCR2A |= (1 << WGM21);
  TCCR2B |= (1 << CS22) | (1 << CS21) | (1 << CS20);
  TIMSK2 |= (1 << OCIE2A);
  // 启用中断
  sei();
}

// 定时器2中断函数
ISR(TIMER2_COMPA_vect)
{
  static uint8_t sys_led_Cnt = 0;
  static uint16_t Servo_Cnt = 0;
  static uint16_t Buzzer_Cnt = 0;

  sys_led_Cnt++;

  // 判断是否达到阈值
  if (sys_led_Cnt >= 200) // 系统运行灯
  {
    sys_led_Cnt = 0;
    LED_Flip(LED3_PIN);
  }

  if (bsp_Servo.Servo_Start_Count_Flag)
  {
    Servo_Cnt++;
    if (Servo_Cnt >= 2000)  // 2s
    {
      Servo_Cnt = 0;
      LED_Control(LED1_PIN, LED_OFF);
      LED_Control(LED2_PIN, LED_ON);      
      Servo_Conntrol_Angle(0);
      bsp_Servo.Servo_Start_Count_Flag = false;
      bsp_RFID.isRFID_ID_Flag = false;
    }
  }

  if (bsp_Buzzer.Buzzer_Ring_Flag)  // 蜂鸣器响一段时间计数
  {
    Buzzer_Cnt++;
    if (Buzzer_Cnt >= 100)
    {
      Buzzer_Cnt = 0;
      bsp_Buzzer.Buzzer_Ring_Flag = false;
      Buzzer_Control(BUZZER_OFF); // 关闭蜂鸣器
    }
  }
}
```

{% endfolding %}



### 串口

> 板子只有一个硬件串口，但是不够的话可以使用软串口，只需要两个数字IO口代替TX和RX
>
> 常用的软串口库： `SoftwareSerial库` 、 `AltSoftSerial库` 、 `NewSoftSerial库`



### 实验2整合代码

{% folding, test2.ino  %}

```cpp
#include <SoftwareSerial.h>
/*========================引脚宏定义========================*/
// LED1引脚(绿)
#define LED1_PIN 2
// 蜂鸣器引脚
#define Buzzer_PIN 6
// 软件串口引脚-TX
#define SOFT_UART_TX_PIN 9
// 软件串口引脚-RX
#define SOFT_UART_RX_PIN 8
// 继电器1
#define Relay1_PIN 3
// 继电器2
#define Relay2_PIN 4
/*========================其他宏定义========================*/


/*========================全局变量========================*/
/*LED相关*/
typedef enum
{
  LED_ON = 0,
  LED_OFF = 1
} LED_Status_et;

/*Buzzer相关*/
typedef enum
{
  BUZZER_ON = 0,
  BUZZER_OFF = 1
} Buzzer_Status_et;

typedef struct 
{
  bool Buzzer_Ring_Flag;  // 蜂鸣器响一段时间标志位
} bsp_Buzzer_st;

bsp_Buzzer_st bsp_Buzzer = 
{
  .Buzzer_Ring_Flag = false,
};

/*WiFi模块相关*/
SoftwareSerial wifi_uart(SOFT_UART_RX_PIN, SOFT_UART_TX_PIN);  // 创建一个对象(RX, TX)


typedef struct
{
  String wifi_rx_data;  // WiFi接收缓存字符串
} bsp_wifi_st;

bsp_wifi_st bsp_wifi = 
{
  .wifi_rx_data = "",
};

/*RELAY相关*/
typedef enum
{
  RELAY_ON = 0,
  RELAY_OFF = 1
} Relay_Status_et;

/*========================函数声明========================*/
static void LED_Init(void); // LED初始化
static void LED_Control(uint8_t led_pin, LED_Status_et led_status); // LED控制亮灭
static void LED_Flip(uint8_t led_pin);  // 控制LED翻转

static void UART_Init(void);  // 串口初始化
// static void UART_Rx_Handler(void);  // 串口接收处理函数

static void Timer2_Init(void);  // 定时器2初始化

static void Buzzer_Init(void);  // 蜂鸣器初始化
static void Buzzer_Control(Buzzer_Status_et buzzer_status); // 控制蜂鸣器
static void Buzzer_Ring(void);  // 控制蜂鸣器响一段时间

static void WiFi_Init(void); // WiFi初始化
static void WiFi_Get_Data(void);  // WiFi模块获取数据
static void WiFi_Rx_Handler(void);  // WiFi接收处理

static void Relay_Init(void); // 继电器初始化
static void Relay_Control(uint8_t relay_pin, Relay_Status_et status); // 控制继电器

void setup()
{
  UART_Init();     // 串口初始化
  LED_Init();      // LED初始化
  Buzzer_Init();  // 蜂鸣器初始化
  Relay_Init(); // 继电器初始化
  Timer2_Init();  // 定时器2初始化
  WiFi_Init();  // WiFi初始化
}

void loop()
{
  WiFi_Get_Data();  // 获取数据
  // UART_Rx_Handler();  // 串口接收处理
  WiFi_Rx_Handler();  // 处理数据
}

/*==============================RELAY==============================*/
// 继电器初始化
static void Relay_Init(void)
{
  pinMode(Relay1_PIN, OUTPUT);  // 输出模式
  pinMode(Relay2_PIN, OUTPUT);  // 输出模式
  Relay_Control(Relay1_PIN, RELAY_OFF);
  Relay_Control(Relay2_PIN, RELAY_OFF);
}

// 控制继电器
static void Relay_Control(uint8_t relay_pin, Relay_Status_et status)
{
  if (RELAY_ON == status)
  {
    digitalWrite(relay_pin, HIGH);
  }
  else
  {
    digitalWrite(relay_pin, LOW);
  }
}

/*==============================BUZZER==============================*/
static void Buzzer_Init(void)
{
  pinMode(Buzzer_PIN, OUTPUT);  // 输出模式
  Buzzer_Control(BUZZER_OFF); // 默认关闭
}

// 控制蜂鸣器
static void Buzzer_Control(Buzzer_Status_et buzzer_status)
{
  if (BUZZER_ON == buzzer_status)
  {
    digitalWrite(Buzzer_PIN, LOW);
  }
  else
  {
    digitalWrite(Buzzer_PIN, HIGH);
  }
}

// 控制蜂鸣器响一段时间
static void Buzzer_Ring(void)
{
  Buzzer_Control(BUZZER_ON);
  bsp_Buzzer.Buzzer_Ring_Flag = true;
}

/*==============================LED==============================*/
// LED初始化
static void LED_Init(void)
{
  pinMode(LED1_PIN, OUTPUT);  // 输出模式
  
  // 默认全灭
  LED_Control(LED1_PIN, LED_OFF);
}

// LED控制
static void LED_Control(uint8_t led_pin, LED_Status_et led_status)
{
  if (LED_ON == led_status)
  {
    digitalWrite(led_pin, LOW);
  }
  else
  {
    digitalWrite(led_pin, HIGH);
  }
}

// 控制LED翻转
static void LED_Flip(uint8_t led_pin)
{
  static uint8_t flag = false;

  if (flag)
  {
    LED_Control(led_pin, LED_ON);
  }
  else
  {
    LED_Control(led_pin, LED_OFF);
  }
  flag = !flag;
}

/*==============================WiFi==============================*/
// WiFi模块初始化
static void WiFi_Init(void)
{
  wifi_uart.begin(115200);  // 波特率
  wifi_uart.println("AT+CWMODE=2\r\n");  // 模式2
  delay(1000);
  wifi_uart.println("AT+RST\r\n"); // 复位
  delay(5000);
  delay(2000);  
  wifi_uart.println("AT+CWSAP=\"ESP8266\",\"12345678\",11,0\r\n");  // 设置wifi
  delay(1000);  
  wifi_uart.println("AT+CIPMUX=1\r\n");  // 多连接
  delay(1000);
  wifi_uart.println("AT+CIPSERVER=1,8899\r\n");  // 设置端口号
  delay(1000);  
  Serial.println("system init OK");
}
  
// 获取wifi数据
static void WiFi_Get_Data(void)
{
  while (wifi_uart.available() > 0)
  {
    bsp_wifi.wifi_rx_data += char(wifi_uart.read());  // 读取数据
    delay(4);
  }
}

// wifi接收处理函数
static void WiFi_Rx_Handler(void)
{
  if (bsp_wifi.wifi_rx_data != "")
  {
    Serial.println(bsp_wifi.wifi_rx_data);  // 打印数据
    Serial.println("\r\n");

    if (('+' == bsp_wifi.wifi_rx_data[2]) && ('I' == bsp_wifi.wifi_rx_data[3]) && ('P' == bsp_wifi.wifi_rx_data[4]))  // MCU接收到的数据为+IPD
    {
      if (('D' == bsp_wifi.wifi_rx_data[5]) && (',' == bsp_wifi.wifi_rx_data[8]))
      {
        // 数据解析
        if ('0' == bsp_wifi.wifi_rx_data[11])
        {
          Relay_Control(Relay1_PIN, RELAY_ON);
          Buzzer_Ring();
          Serial.println("Open Relay1\r\n");
        }
        if ('1' == bsp_wifi.wifi_rx_data[11])
        {
          Relay_Control(Relay1_PIN, RELAY_OFF);
          Serial.println("Close Relay1\r\n");
        }   
        if ('2' == bsp_wifi.wifi_rx_data[11])
        {
          Relay_Control(Relay2_PIN, RELAY_ON);
          Buzzer_Ring();
          Serial.println("Open Relay2\r\n");
        }
        if ('3' == bsp_wifi.wifi_rx_data[11])
        {
          Relay_Control(Relay2_PIN, RELAY_OFF);
          Serial.println("Close Relay2\r\n");
        }                     
      }
    }
  }

  bsp_wifi.wifi_rx_data = String("");
}



/*==============================OTHER==============================*/
// 串口初始化
static void UART_Init(void)
{
  Serial.begin(9600); // 波特率9600
}

// 串口接收
// static void UART_Rx_Handler(void)
// {
//   if (Serial.available())
//   {
//     String order = "";
//     while (Serial.available())
//     {
//       char chr = (char)Serial.read();
//       order += chr;
//       delay(2);
//     }
//     order.trim();
//     wifi_uart.println(order);
//   }
// }

// 定时器2初始化
static void Timer2_Init(void)
{
  // (15 + 1) * 64μs = 1ms
  TCCR2A = 0;
  TCCR2B = 0;
  TCNT2 = 0;
  OCR2A = 15;
  TCCR2A |= (1 << WGM21);
  TCCR2B |= (1 << CS22) | (1 << CS21) | (1 << CS20);
  TIMSK2 |= (1 << OCIE2A);
  // 启用中断
  sei();
}

// 定时器2中断函数
ISR(TIMER2_COMPA_vect)
{
  static uint8_t sys_led_Cnt = 0;
  static uint16_t Servo_Cnt = 0;
  static uint16_t Buzzer_Cnt = 0;

  sys_led_Cnt++;

  // 判断是否达到阈值
  if (sys_led_Cnt >= 200) // 系统运行灯
  {
    sys_led_Cnt = 0;
    LED_Flip(LED1_PIN);
  }

  if (bsp_Buzzer.Buzzer_Ring_Flag)  // 蜂鸣器响一段时间计数
  {
    Buzzer_Cnt++;
    if (Buzzer_Cnt >= 100)
    {
      Buzzer_Cnt = 0;
      bsp_Buzzer.Buzzer_Ring_Flag = false;
      Buzzer_Control(BUZZER_OFF); // 关闭蜂鸣器
    }
  }
}

```

{% endfolding %}



## 问题

> 编译出现对应多个库时，会优先选择电脑的而不是你工程的库文件夹里的，解决方法是可以重新命名或者使用全路径头文件，或者把本地的那个库文件夹压缩成压缩包再把库文件删除即可