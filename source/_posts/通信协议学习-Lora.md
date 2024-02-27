---
title: 通信协议学习-Lora
cover: /img/num167.webp
comments: false
katex: true
categories:
  - 细化学习
abbrlink: 647ac476
---

## 前言

{% note blue 'fas fa-fan' flat %}参考文章/博主{% endnote %}

[LORA模块ATK-LORA-01资料--正点原子 ](http://www.openedv.com/docs/modules/iot/atk-lora-01.html)

[LoRa SX1278无线模块的STM32 HAL驱动程序-SPI](https://blog.domski.pl/stm32-hal-driver-for-lora-sx1278-wireless-module/)

[STM32F103_LORA](https://github.com/swiftjiang/STM32F103_LORA/tree/master)



## LORA

### LORA基础知识

Lora，基于 `扩频调制技术`，具备抗干扰强、传输距离远、速率心低、非连接，通过广播通信的一种无线技术。适用于水电力表、传感器、工业、农业等应用

{% tip bolt %}ATK-LORA-01 模块{% endtip %}

模块设计是采用高效的 `ISM` 频段射频 `SX1278` 扩频芯片，模块的工作频率在 `410Mhz~441Mhz`，以 `1Mhz` 频率为步进信道，共 `32` 个信道。可通过 `AT` 指令在线修改串口速率，发射功率，空中速率，工作模式等各种参数，并且支持固件升级功能

> 特点

1. 工业频段： `433Mhz` 免申请频段
2. 多种功率等级（最大 `20dBm，最大100mW`）
3. 多种串口波特率、空中速率、工作模式
4. 支持空中唤醒功能，低接收功耗
5. 双 `512` 环形 `FIFO`
6. 频率 `410-441Mhz`，提供 `32` 个信道
7. 接收灵敏度达  `-136dBm`，传输距离 `3000` 米
8. 自动分包传输，保证数据包的完整性

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231109170708.webp" style="zoom:50%;" />

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231109170728.webp" style="zoom:50%;" />

> 实物图

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231109171305.webp" style="zoom:67%;" />

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231109171328.webp" style="zoom:67%;" />

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231110115703.webp" style="zoom:50%;" />

模块在初次上电时， `AUX` 引脚为输入状态模式，若 `MD0` 与 `AUX` 引脚同时接入 `3.3V` TTL 高电平，并且保持 `1` 秒时间（引脚电平不变），则模块会进入固件升级模式，等待固件升级。否则进入无线通信模式（ `AUX` 引脚会变回输出状态模式，用于指示模块的工作状态）

模块的引脚电平是 `3.3V`

`MD0`、 `AUX` 引脚悬空下为低电平

{% note red 'fas fa-fan' flat %}注意{% endnote %}

当退出配置功能（ `MD0=0` ），模块会重新配置参数，在配置过程中， `AUX` 保持高电平，完成后输出 `低电平`，模块返回 `空闲` 状态

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231109170954.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231110083956.webp)

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231110085534.webp" style="zoom:67%;" />

> 了解

- 透明传输

即透传数据，例如： `A` 设备发 `5` 字节数据 `AA BB CC DD EE` 到 `B` 设备， `B` 设备就收到数据 `AA BB CC DD EE`。（透明传输，针对设备相同地址、相同的通信信道之间通信，用户数据可以是 `字符或16 进制` 数据形式）

- 定向传输

即定点传输，例如： `A` 设备（地址为： `0x1400`，信道为 `0x17`（ `23 信道433Mhz`））需要向 `B` 设备（地址为 `0x1234`，信道为 `0x10`（ `16 信道、426Mhz`））发送数据 `AA BB CC`，其通信格式为： `12 34 10 AA BB CC`，其中 `1234` 为模块 `B` 的地址， `10` 为信道，则模块B 可以收到 `AA BB CC`。同理，如果 `B` 设备需要向 `A` 设备发送数据 `AA BB CC`，其通信格式为： `14 00 17 AA BB CC`，则 `A` 设备可以收到 `AA BB CC`。（定向传输，可实现设备间地址和通信信道不同之间通信，数据格式为16 进制，发送格式： `高位地址+低位地址+信道+用户数据`）

- 广播与数据监听

将模块地址设置为 `0xFFFF`，可以监听相同信道上的所有模块的数据传输；发送的数据，可以被相同信道上任意地址的模块收到，从而起到广播和监听的作用

- 休眠时间

对接收方来说是监听间隔的时间；对发射方来说，是持续发射唤醒码的时间。当模块工作模式在 `“唤醒模式”` 时，会在用户数据前自动添加配置休眠时间的唤醒码，当模块工作模式在 `“省电模式”` 时，以配置的休眠时间为监听间隔的时间

- SNR

信噪比（越大越稳定）

- RSSI

接收信号的强度指示（越大越稳定）

> AUX详解

- 功能1：串口数据输出指示（用于唤醒休眠的外部MCU）

- 功能2：无线发射指示

`缓冲区空`：内部 `512` 字节缓冲区的数据，都被写入到无线芯片（自动分包），当 `AUX=0`时用户连续发起小于 `512` 字节数据，不会溢出。当 `AUX=1` 时缓冲区不为空，内部 `512` 字节缓存区的数据，尚未全部写入到无线芯片并开启发射，此时模块有可能在等待用户数据结束超时，或正在进行无线分包发射。注意：  `AUX=0` 代表模块全部串口数据通过无线发射完毕

- 功能3：模块正在配置过程中（在模块复位和退出配置功能的时候）



{% note red 'fas fa-fan' flat %}注意{% endnote %}

上述 `功能1` 和 `功能2`，输出 `高电平` 优先，即：满足任何一个输出高电平条件， `AUX` 就输出 `高电平`；当所有高电平条件均不满足时，AUX 就输出 `低电平`

用户从配置功能退出返回通信功能或在复位过程中，模块会重新设置用户参数，期间 `AUX` 输出 `高电平`



> 固件升级功能

上电后，同时检测到 `MD0` 与 `AUX` 引脚都为 `高电平`，并且持续 `1S` 时间，模块则进入固件升级功能



> 功能

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231110084725.webp" style="zoom:67%;" />

|       模式        |                             发送                             | 接收                                                         |
| :---------------: | :----------------------------------------------------------: | ------------------------------------------------------------ |
|   【0】一般模式   | 模块接收来自串口的用户数据，模块发射无线数据包长度为 `58` 字节，当用户输入数据达到 `58` 字节时，模块将启动无线发射，此时用户可以继续输入需要发射的数据，当用户需要传输的字节 `小于 58 字节` 时，模块等待 `1` 个字节时间，若无用户数据继续输入，则认为数据终止，此时模块将所有数据都包经无线发出，当模块开始发送第一包用户数据时， `AUX` 引脚将输出 `高电平`，当模块把所有数据通过RF 芯片并启动发射后， `AUX` 输出 `低电平`。此时表明最后一包无线数据已经发射完毕，用户可以继续输入长达 `512` 字节的数据，通过 `模式0` 发出的数据包，只能被处于 `模式0`、 `模式1` 的接收模块收到 | 模块一直打开无线接收功能，可以接收来自 `模式0`、 `模式1` 发出的数据包。收到数据包后，模块 `AUX` 输出 `高电平`， `2-3ms` 延迟后，开始将无线数据通过串口 `TXD` 引脚发出，所有无线数据都通过串口输出后，模块将 `AUX` 引脚输出 `低电平` |
|   【1】唤醒模式   | 模块启动数据包发射的条件与 `AUX` 功能等于 `模式0`，唯一不同的是：模块会在每个数据包前自动添加唤醒码（休眠时间），唤醒码的长度取决于用户参数中设置的休眠时间。唤醒码的目的是用于唤醒 `工作模式2` 的接收模块。所以， `模式1` 发射的数据可以被 `模式0、1、2` 接收到 | 等同于 `模式0`                                               |
|   【2】省电模式   | 模块处于休眠状态，串口将关闭，无法接收来自外部MCU 的串口数据，所以该模式不具有无线发射的功能 | 在 `模式2` 下，要求发射方必须工作在 `模式1`，无线模块定时监听唤醒码，一旦收到有效的唤醒码后，模块将持续处于接收状态，在等待整个有效数据包接收接收完毕，然后模块将 `AUX` 输出 `高电平`，并延迟 `2-3ms` 后，打开串口将收到的无线数据通过 `TXD` 发出，完毕后将 `AUX` 输出 `低电平`。无线模块将继续进入 `“休眠-监听”` 的工作状态，通过设置不同的唤醒时间，模块具有不同的接收响应延迟和功耗，用户需要在通讯延迟时间和平均功耗之间取得一个平衡点 |
| 【3】信号强度模式 |                 同一般模式 `（模式0）` 一致                  | 输出信号强度的信息                                           |



> 数据流控制

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231110115055.webp" style="zoom:50%;" />



### 透传

{% tip bolt %}点对点{% endtip %}

1. 地址相同、信道相同、无线速率（非串口波特率）相同的两个模块，一个模块发送，另外一个模块接收（必须是：一个发，一个收）
2. 每个模块都可以做发送/接收
3. 数据完全透明，所发即所得

{% note simple %}

发送模块（1 个）：数据

接收模块（1 个）：数据

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231110105856.webp)

{% endnote %}

{% tip bolt %}点对多{% endtip %}

1. 地址相同、信道相同、无线速率（非串口波特率）相同的模块，任意一个模块发送，其他模块都可以接收到
2. 每个模块都可以做发送/接收
3. 数据完全透明，所发即所得

{% note simple %}

发送模块（1 个）：数据

接收模块（N 个）：数据

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231110110316.webp" style="zoom:67%;" />

{% endnote %}

{% tip bolt %}广播监听{% endtip %}

1. 模块地址为0XFFFF，则该模块处于广播监听模式，发送的数据可以被相同速率和信道的其他所有模块接收到（广播）；同时，可以监听相同速率和信道上所有模块的数据传输（监听）
2. 广播监听无需地址相同

{% note simple %}

发送模块（1 个）：数据

接收模块（N 个）：数据

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231110110559.webp" style="zoom:67%;" />

{% endnote %}



### 定向传输

{% tip bolt %}点对点{% endtip %}

1. 模块发送时可修改地址和信道，用户可以指定数据发送到任意地址和信道
2. 可以实现组网和中继功能

{% note simple %}

发送模块（1 个）：地址+信道+数据

接收模块（1 个）：数据

点对点（透传）：模块地址、信道、速率相同

点对点（定向）：模块地址可变、信道可变，速率相同

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231110111902.webp" style="zoom:67%;" />

{% endnote %}



### 广播监听

1. 模块地址为0XFFFF，则该模块处于广播监听模式，发送的数据可以被具有相同速率和信道的其他所有模块接收到（广播）；同时，可以监听相同速率和信道上所有模块的数据传输（监听）
2. 广播监听无需地址相同
3. 信道地址可设置。当地址为0XFFFF 时，为广播模式；为其他时，为定向传输模式

{% note simple %}

发送模块（1 个）：0XFFFF+信道+数据

接收模块（N 个）：数据

发送模块（1 个）：地址(非0XFFFF)+信道+数据

接收模块（1 个）：数据

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231110112321.webp" style="zoom:67%;" />

{% endnote %}



### 模块配置与通信测试

{% tip bolt %}配置查询{% endtip %}

首先是接线

| USB转UART模块 | LORA模块 |
| :-----------: | :------: |
|   VCC(3.3V)   |   VCC    |
|      GND      |   GND    |
|      RXD      |   TXD    |
|      TXD      |   RXD    |

需要进入配置功能，AUX悬空，MD0接高电平即可，打开上位机，波特率默认就是 `115200(这个波特率是配置模式的跟通信的不是同一个)`点击【查询配置】即可：

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231110170005.webp" style="zoom:67%;" />

{% tip bolt %}透传Test{% endtip %}

修改配置后就点击【保存配置】选项就上位机自动发送AT指令了，设置完就把 `MD0` 悬空即可，两个模块设置一样即可

> Lora模块1

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231110170409.webp" style="zoom:50%;" />

> Lora模块2

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231110171430.webp" style="zoom:50%;" />

- 实验现象

需要注意就是串口波特率要设置为之前我们设置的那个 `9600`，要一致

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231110172849.webp" style="zoom:50%;" />



{% tip bolt %}定向传输Test{% endtip %}

> Lora模块1

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231110200859.webp" style="zoom:50%;" />

> Lora模块2

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231110201158.webp" style="zoom:50%;" />

- 实验现象

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231110200256.webp" style="zoom:50%;" />



### 程序编写

> 使用两个Lora模块，两块STM32F407VET6核心板
>
> LoraA --- 地址0 信道23 定向
>
> LoraB --- 地址12 信道3 定向

- MX配置

`AUX` 引脚要设置为外部中断，上升沿触发，默认下拉，默认低电平

`MD0` 引脚要设置为推挽输出，下拉，默认低电平

串口需要打开中断(不使用空闲中断+DMA)

需要一个计数定时器 --- 配置为10ms

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231118124401.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231118124349.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231118124415.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231118124438.webp)

{% endgallery %}

- 程序编写

{% folding, Lora_Config.h %}

```cpp
#ifndef __LORA_CONFIG_H
#define __LORA_CONFIG_H
#include "AllHead.h"

// Lora设备工作模式枚举
typedef enum
{
    // 配置模式
    Config_Mode = 0x00,
    // 接收模式
    Rec_Mode = 0x01,
    // 发送模式
    Send_Mode = 0x02
} Lora_Device_Mode_et;

// 记录Lora模块的AUX引脚中断状态枚举
typedef enum
{
    // 关闭
    OFF = 0x00,
    // 上升沿
    Rising = 0x01,
    // 下降沿
    Falling = 0x02
} Lora_AUX_Interrupt_Status_et;

// 模块附加配置信息结构体
typedef struct
{
    GPIO_TypeDef *MD0_Port;                  // MD0端口组
    uint16_t MD0_Pin;                        // MD0引脚
    GPIO_TypeDef *AUX_Port;                  // AUX端口组
    uint16_t AUX_Pin;                        // AUX引脚
    UART_HandleTypeDef *huart;               // 所用串口
    TIM_HandleTypeDef *htim;                 // 所用定时器
    Lora_Device_Mode_et device_mode;         // Lora设备工作模式(值为 Lora_Device_Mode_et枚举)
    Lora_AUX_Interrupt_Status_et AUX_Status; // Lora设备的AUX引脚中断状态(值为 Lora_AUX_Interrupt_Status_et枚举)
} Lora_Parameter_st;

// 模块基本配置
typedef struct
{
    Lora_Parameter_st *Lora_X; // 模块附加配置信息结构体指针
    uint16_t addr;             // 设备地址
    uint8_t channel;           // 信道
    uint8_t tx_power;          // 发射功率
    uint8_t air_speed;         // 空中速率
    uint8_t sleep_time;        // 休眠时间
    uint8_t mode;              // 工作模式
    uint8_t send_status;       // 发送状态
    uint8_t baud_rate;         // 串口波特率
    uint8_t parity;            // 校验位
} _LoraConfig_st;

// 空中速率(单位:Kbps)
#define LORA_SPEED_0K3 0  // 0.3
#define LORA_SPEED_1K2 1  // 1.2
#define LORA_SPEED_2K4 2  // 2.4
#define LORA_SPEED_4K8 3  // 4.8
#define LORA_SPEED_9K6 4  // 9.6
#define LORA_SPEED_19K2 5 // 19.2

// 休眠时间(单位:秒)
#define LORA_SLEEP_TIME_1S 0 // 1秒
#define LORA_SLEEP_TIME_2S 1 // 2秒

// 工作模式
#define LORA_MODE_GEN 0   // 一般模式
#define LORA_MODE_WAKE 1  // 唤醒模式
#define LORA_MODE_SLEEP 2 // 省电模式

// 发射功率
#define LORA_TX_POWER_11dBm 0 // 11dBm
#define LORA_TX_POWER_14Bbm 1 // 14dBm
#define LORA_TX_POWER_17Bbm 2 // 17dBm
#define LORA_TX_POWER_20Bbm 3 // 20dBm

// 发送状态
#define LORA_SEND_STATUS_Tran 0 // 透明传输
#define LORA_SEND_STATUS_Oire 1 // 定向传输

// 串口波特率(单位:bps)
#define LORA_TTLBPS_1200 0   // 1200
#define LORA_TTLBPS_2400 1   // 2400
#define LORA_TTLBPS_4800 2   // 4800
#define LORA_TTLBPS_9600 3   // 9600
#define LORA_TTLBPS_19200 4  // 19200
#define LORA_TTLBPS_38400 5  // 38400
#define LORA_TTLBPS_57600 6  // 57600
#define LORA_TTLBPS_115200 7 // 115200

// 串口数据校验
#define LORA_TTLPAR_8N1 0 // 8位数据
#define LORA_TTLPAR_8E1 1 // 8位数据+1位偶校验
#define LORA_TTLPAR_8O1 2 // 8位数据+1位奇校验

// 设备出厂默认参数
#define LORA_ADDR 0                            // 设备地址
#define LORA_CHANNEL 23                        // 通信信道
#define LORA_TX_POWER LORA_TX_POWER_20Bbm      // 发射功率
#define LORA_AIR_SPEED LORA_SPEED_19K2         // 空中速率
#define LORA_SLEEP_TIME LORA_SLEEP_TIME_1S     // 休眠时间
#define LORA_MODE LORA_MODE_GEN                // 工作模式
#define LORA_SEND_STATUS LORA_SEND_STATUS_Tran // 发送状态
#define LORA_TTLBPS LORA_TTLBPS_9600           // 波特率
#define LORA_TTLPAR LORA_TTLPAR_8N1            // 校验位

#endif
```

{% endfolding %}

{% folding, Lora.h %}

```cpp
#ifndef __LORA_H
#define __LORA_H

#include "AllHead.h"

/*使用Debug*/
#define USE_Lora_Debug 0

/*Lora所用串口*/
// LoraA设备
#define USE_Serial_LoraA &huart2

/*Lora所用计数定时器*/
// LoraA设备
#define USE_Timer_LoraA &htim6

/*Lora AUX 中断线*/
#define LORA_A_EXTI_LINE EXTI9_5_IRQn

/*Lora调试打印函数*/
#define Lora_Debug_Print printf
/*Lora毫秒延时函数*/
#define Lora_Delay_MS HAL_Delay
/*Lora发送数据函数*/
#define Lora_Send_Print bsp_UART2.Bsp_UART_Printf

typedef struct
{
    void (*Lora_Init)(_LoraConfig_st *, bsp_UART_Parameter_st *);
    void (*Lora_Parameter_Set)(_LoraConfig_st *, bsp_UART_Parameter_st *);
    void (*Lora_Send_Data_Tran)(_LoraConfig_st *, bsp_UART_Parameter_st *, const uint8_t *);
    void (*Lora_Send_Data_Oire)(_LoraConfig_st *, bsp_UART_Parameter_st *, const uint16_t, const uint8_t, const uint8_t *, size_t);
    void (*Lora_Rec_Handler)(_LoraConfig_st *, bsp_UART_Parameter_st *);
} Lora_st;

extern _LoraConfig_st LoraConfig_A;
extern Lora_st Lora;

#endif

```

{% endfolding %}

{% folding, Lora.c %}

```cpp
/***************************************************************************
 * File: Lora.c
 * Author: Luckys.
 * Date: 2023/11/01
 * description: 
-----------------------------------
采用结构体封装模块化编程，面向对象思想！

移植需要修改的地方：
Lora.c/Lora.h/Lora_Config.h
    【1】看自己工程进行替换Lora.h里面的对应宏
        Lora调试打印函数
        Lora毫秒延时函数
        Lora所用串口(新增的话直接新增一行即可) --- 串口使用普通中断接收，使用接收回调函数
        Lora所用计数定时器(新增的话直接新增一行即可) --- 定时器频率设置为10ms，需要打开中断，也使用回调函数
        Lora AUX 所用的中断线宏 --- 在Lora_AUX_Init函数，优先级的话可在里面进行修改(默认0,0)，也可以进行宏定义替换(这个我没弄没必要感觉)
    【2】每一个Lora设备必须要在Lora.c顶部定义两个结构体变量
        _LoraConfig_st xxx
        Lora_Parameter_st xxx
    【3】修改AUX与MD0引脚定义，在Lora_Parameter_Init函数(看你板子怎么接)
        AUX：外部中断、默认上升沿触发、默认下拉、默认低电平
        MD0：推挽输出、下拉、默认低电平
    【4】修改HAL_GPIO_EXTI_Callback函数
        里面的串口STA那些需要手动看你串口去替换
    【5】修改HAL_TIM_PeriodElapsedCallback函数
        里面是Lora设备所用的计数器相关处理，需要看你定时器和串口去替换
bsp_UART.c/bsp_UART.h
    【1】修改HAL_UART_RxCpltCallback函数
        手动修改里面所用的串口设备结构体与Lora设备结构体 
    【2】每一个串口设备需要手动创建一个全局的数组(发送与接收)   
    【3】修改宏
        每一个串口设备都有一个最大发送长度、最大接收长度
        上位机打印串口(默认串口1)  
-----------------------------------
****************************************************************************/
#include "AllHead.h"

/* Private function prototypes===============================================*/
static void Lora_Parameter_Init(void);
static uint8_t* Lora_Check_CMD(bsp_UART_Parameter_st *bsp_uart_device, uint8_t *str);
static uint8_t Lora_Send_CMD(_LoraConfig_st *Lora_device, bsp_UART_Parameter_st *bsp_uart_device, uint8_t *cmd, uint8_t *ack, uint16_t wait_time);
static void Lora_Init(_LoraConfig_st *Lora_device, bsp_UART_Parameter_st *bsp_uart_device);
static void Lora_AUX_Init(_LoraConfig_st *Lora_device, Lora_AUX_Interrupt_Status_et Interrupt_status, IRQn_Type irqn, uint32_t pre_priority, uint32_t sub_priority);
static void Lora_Parameter_Set(_LoraConfig_st *Lora_device, bsp_UART_Parameter_st *bsp_uart_device);
static void Lora_Send_Data_Tran(_LoraConfig_st *Lora_device, bsp_UART_Parameter_st *bsp_uart_device, const uint8_t *str);
static void Lora_Send_Data_Oire(_LoraConfig_st *Lora_device, bsp_UART_Parameter_st *bsp_uart_device, const uint16_t target_addr, const uint8_t target_channel, const uint8_t *arr, size_t size);
static void Lora_Rec_Handler(_LoraConfig_st *Lora_device, bsp_UART_Parameter_st *bsp_uart_device);

static void Lora_SET_Pin(GPIO_TypeDef *port, uint16_t gpio);
static void Lora_CLR_Pin(GPIO_TypeDef *port, uint16_t gpio);
static uint8_t Lora_Read_Pin(GPIO_TypeDef *port, uint16_t gpio);
/* Public variables==========================================================*/
// Lora设备 --- LoraA
_LoraConfig_st LoraConfig_A;    
Lora_Parameter_st Lora_Parameter_A;

Lora_st Lora = 
{
    .Lora_Init = &Lora_Init,
    .Lora_Parameter_Set = &Lora_Parameter_Set,
    .Lora_Send_Data_Tran = &Lora_Send_Data_Tran,
    .Lora_Send_Data_Oire = &Lora_Send_Data_Oire,
    .Lora_Rec_Handler = &Lora_Rec_Handler
};

/*
* @function: Lora_Parameter_Init
* @param: None
* @retval: None
* @brief: Lora参数初始化
*/
static void Lora_Parameter_Init(void)
{
    /*************** Lora设备1 ***************/
	LoraConfig_A.Lora_X = &Lora_Parameter_A;	// 要申请内存再把地址赋值
    LoraConfig_A.Lora_X->device_mode = Config_Mode;      // 设备状态
    LoraConfig_A.Lora_X->AUX_Status = OFF;               // AUX中断状态
    LoraConfig_A.Lora_X->htim = USE_Timer_LoraA;         // 所用计数定时器
    LoraConfig_A.Lora_X->huart = USE_Serial_LoraA;       // 所用串口
    LoraConfig_A.Lora_X->MD0_Port = LoraA_MD0_GPIO_Port; // MD0端口组
    LoraConfig_A.Lora_X->MD0_Pin = LoraA_MD0_Pin;        // MD0引脚
    LoraConfig_A.Lora_X->AUX_Port = LoraA_AUX_GPIO_Port; // AUX端口组
    LoraConfig_A.Lora_X->AUX_Pin = LoraA_AUX_Pin;        // AUX引脚

    LoraConfig_A.addr = 0;             // 设备地址
    LoraConfig_A.air_speed = LORA_AIR_SPEED;   // 空中速率
    LoraConfig_A.baud_rate = LORA_TTLBPS;      // 串口波特率
    LoraConfig_A.channel = 23;       // 信道
    LoraConfig_A.mode = LORA_MODE;             // 工作模式
    LoraConfig_A.send_status = LORA_SEND_STATUS_Oire;    // 发送状态 --- 定向
    LoraConfig_A.parity = LORA_TTLPAR;         // 校验位
    LoraConfig_A.sleep_time = LORA_SLEEP_TIME; // 休眠时间
    LoraConfig_A.tx_power = LORA_TX_POWER;     // 发射功率
}


/*
* @function: Lora_Init
* @param: Lora_device -> Lora设备结构体指针
* @retval: None
* @brief: Lora初始化
*/
static void Lora_Init(_LoraConfig_st *Lora_device, bsp_UART_Parameter_st *bsp_uart_device)
{
    int8_t retry = 3;

    Lora_Parameter_Init();  // Lora参数初始化
	
    Lora_CLR_Pin(Lora_device->Lora_X->MD0_Port, Lora_device->Lora_X->MD0_Pin);  // MD0置0
    Lora_CLR_Pin(Lora_device->Lora_X->AUX_Port, Lora_device->Lora_X->AUX_Pin);  // AUX置0

    while (Lora_Read_Pin(Lora_device->Lora_X->AUX_Port, Lora_device->Lora_X->AUX_Pin))    // 空闲状态 -- AUX=0
    {
        Lora_Debug_Print("device Busy!\r\n");
        Lora_Delay_MS(500);
    }

    bsp_UART.Bsp_UART_Init(&bsp_UART2 ,LoraConfig_A.Lora_X->huart, LoraConfig_A.Lora_X->htim); // 初始化串口

    Lora_SET_Pin(Lora_device->Lora_X->MD0_Port, Lora_device->Lora_X->MD0_Pin);  // MD0置1 --- 进入AT模式
	
    Lora_Delay_MS(40);

#if USE_Lora_Debug
	Lora_Debug_Print("%d--%d\r\n",HAL_GPIO_ReadPin(Lora_device->Lora_X->MD0_Port,Lora_device->Lora_X->MD0_Pin),HAL_GPIO_ReadPin(Lora_device->Lora_X->AUX_Port, Lora_device->Lora_X->AUX_Pin));
#endif

    while (retry--)
    {
        if (0 == Lora_Send_CMD(Lora_device, bsp_uart_device, (uint8_t*)"AT", (uint8_t*)"OK", 70))   // 检测到
        {
            Lora_Debug_Print("device Success!\r\n");
            break;
        }
    }
    if (retry <= 0) // 检测不到
    {
        Lora_Debug_Print("device Faild!\r\n");
    }
    Lora_Parameter_Set(Lora_device, bsp_uart_device);
    HAL_Delay(500);

#if 1
#if 0
    // 透传测试
    Lora_Send_Data_Tran(Lora_device, bsp_uart_device,(uint8_t*)"12345");
#endif    
    // 定向测试
#if 1    
    uint8_t arr[6] = {0x01,0x02,0x03,0x00,0x00,0xAA};
    Lora_Send_Data_Oire(Lora_device, bsp_uart_device, 12, 3, arr, sizeof(arr)/sizeof(arr[0])); 
#endif
#endif
}

/*
* @function: Lora_Check_CMD
* @param: bsp_uart_device -> 串口设备
* @retval: 0 -> 没有得到期待的应答结果  其他 -> 期待的应答结果的位置(str的位置)
* @brief: 检测接收到的应答
*/
static uint8_t* Lora_Check_CMD(bsp_UART_Parameter_st *bsp_uart_device, uint8_t *str)
{
    char* strx = 0;
	uint16_t rx_len = 0;

    if (bsp_uart_device->usUART_RX_STA & 0x8000)    // 接收到数据
    {
		rx_len = bsp_uart_device->usUART_RX_STA & 0x7FFF;
        bsp_uart_device->puc_UART_Rx_Buffer[rx_len] = 0;   // 添加结束符
        strx = strstr((const char*)bsp_uart_device->puc_UART_Rx_Buffer, (const char*)str);
		memset((char*)bsp_uart_device->puc_UART_Rx_Buffer, 0x00, rx_len);   // 缓冲区清0
    }
    return (uint8_t*)strx;
}

/*
* @function: Lora_Send_CMD
* @param: Lora_device -> Lora设备结构体指针 bsp_uart_device -> 串口设备 cmd -> 待发送的命令字符串(不需要\r\n)  ack -> 应答字符串(为0表示不需要应答) wait_time -> 超时时间(单位:10ms)
* @retval: 0 -> 发送成功  1 -> 发送失败
* @brief: Lora发送命令
*/
static uint8_t Lora_Send_CMD(_LoraConfig_st *Lora_device, bsp_UART_Parameter_st *bsp_uart_device, uint8_t *cmd, uint8_t *ack, uint16_t wait_time)
{
    uint8_t Res = 0;

    bsp_uart_device->usUART_RX_STA = 0;
    
    if ((uint32_t)cmd <= 0xFF)  // cmd 的地址小于等于 0XFF，表示 cmd 是一个单字节的命令
    {
        while (0 == (Lora_device->Lora_X->huart->Instance->SR & 0x40));
        Lora_device->Lora_X->huart->Instance->DR = (uint32_t)cmd;
    }
    else
    {
        bsp_UART.Bsp_UART_Printf(Lora_device, bsp_uart_device, "%s\r\n", cmd);  // 发送命令
    }
	
    if (ack && wait_time)   // 需要等待应答
    {
        while (--wait_time)
        {
            Lora_Delay_MS(10);

            if (bsp_uart_device->usUART_RX_STA & 0x8000)    // 接收到数据
            {
                if (Lora_Check_CMD(bsp_uart_device, ack))   // 不等于0表示应答正确
                {
                    bsp_uart_device->usUART_RX_STA = 0;
                    break;
                }
            }
        }
        if (0 == wait_time) // 超时了
        {
            Res = 1;    
        }
    }

    return Res;
}

/*
* @function: Lora_AUX_Init
* @param: Lora_device -> Lora设备结构体指针 Interrupt_status -> AUX中断状态 irqn -> 中断线 pre_priority -> 抢占优先级 sub_priority -> 子优先级
* @retval: None
* @brief: AUX引脚中断配置
*/
static void Lora_AUX_Init(_LoraConfig_st *Lora_device, Lora_AUX_Interrupt_Status_et Interrupt_status, IRQn_Type irqn, uint32_t pre_priority, uint32_t sub_priority)
{
    GPIO_InitTypeDef GPIO_Initure;

    if (OFF == Interrupt_status) // 关闭
    {
        HAL_NVIC_DisableIRQ(irqn); // 失能中断线
    }
    else
    {
        if (Rising == Interrupt_status) // 上升沿
        {
            GPIO_Initure.Pin = Lora_device->Lora_X->AUX_Pin; // AUX引脚
            GPIO_Initure.Mode = GPIO_MODE_IT_RISING;         // 上升沿触发
        }
        else if (Falling == Interrupt_status) // 下降沿
        {
            GPIO_Initure.Pin = Lora_device->Lora_X->AUX_Pin; // AUX引脚
            GPIO_Initure.Mode = GPIO_MODE_IT_FALLING;        // 下降沿触发
        }
        HAL_GPIO_Init(Lora_device->Lora_X->AUX_Port, &GPIO_Initure); // 端口初始化
        __HAL_GPIO_EXTI_CLEAR_IT(Lora_device->Lora_X->AUX_Pin);      // 清除中断标志位
        HAL_NVIC_SetPriority(irqn, pre_priority, sub_priority);      // 设置中断优先级
        HAL_NVIC_EnableIRQ(irqn);                                    // 使能中断
    }
    Lora_device->Lora_X->AUX_Status = Interrupt_status; // 记录中断模式
}

/*
* @function: Lora_Parameter_Set
* @param: Lora_device -> Lora设备结构体指针 bsp_uart_device -> 串口设备
* @retval: None
* @brief: Lora模块参数设置发送
*/
static void Lora_Parameter_Set(_LoraConfig_st *Lora_device, bsp_UART_Parameter_st *bsp_uart_device)
{
    uint8_t send_buff[20];
    uint8_t lora_addr_H = 0, lora_addr_L = 0;   // 设备地址高低位 

    bsp_UART.Bsp_UART_Config(Lora_device, bsp_uart_device, LORA_TTLBPS_115200, LORA_TTLPAR_8N1); // 进入配置模式前需要设置串口波特率和校验位(115200 8N1)
    bsp_UART.Bsp_UART_RxTx_Setting(Lora_device, bsp_uart_device, 1); // 开启对应串口收发

    while (Lora_Read_Pin(Lora_device->Lora_X->AUX_Port, Lora_device->Lora_X->AUX_Pin));    // 空闲状态 -- AUX=0

    Lora_SET_Pin(Lora_device->Lora_X->MD0_Port, Lora_device->Lora_X->MD0_Pin);  // MD0置1 --- 进入AT模式
    Lora_Delay_MS(40);
    Lora_device->Lora_X->device_mode = Config_Mode; // 设备模式标记为 【配置模式】

    lora_addr_H = (Lora_device->addr >> 8) & 0xFF;  // 高8位
    lora_addr_L = Lora_device->addr & 0xFF; // 低8位

    /**********开始设置并且发送至模块************/
    sprintf((char*)send_buff, "AT+ADDR=%02x,%02x", lora_addr_H, lora_addr_L);   // 设置【设备地址】
    if (1 == Lora_Send_CMD(Lora_device, bsp_uart_device, send_buff, (uint8_t*)"OK", 50))
    {
        Lora_Debug_Print("Error 1\r\n");
        return;
    }

    sprintf((char*)send_buff, "AT+WLRATE=%d,%d", Lora_device->channel, Lora_device->air_speed);   // 设置【信道】【空中速率】
    if (1 == Lora_Send_CMD(Lora_device, bsp_uart_device, send_buff, (uint8_t*)"OK", 50))
    {
        Lora_Debug_Print("Error 2\r\n");
        return;
    }

    sprintf((char*)send_buff, "AT+TPOWER=%d", Lora_device->tx_power);   // 设置【发射功率】
    if (1 == Lora_Send_CMD(Lora_device, bsp_uart_device, send_buff, (uint8_t*)"OK", 50))
    {
        Lora_Debug_Print("Error 3\r\n");
        return;
    } 

    sprintf((char*)send_buff, "AT+CWMODE=%d", Lora_device->mode);   // 设置【工作模式】
    if (1 == Lora_Send_CMD(Lora_device, bsp_uart_device, send_buff, (uint8_t*)"OK", 50))
    {
        Lora_Debug_Print("Error 4\r\n");
        return;
    }   

    sprintf((char*)send_buff, "AT+TMODE=%d", Lora_device->send_status);   // 设置【发送状态】
    if (1 == Lora_Send_CMD(Lora_device, bsp_uart_device, send_buff, (uint8_t*)"OK", 50))
    {
        Lora_Debug_Print("Error 5\r\n");
        return;
    }
    
    sprintf((char*)send_buff, "AT+WLTIME=%d", Lora_device->sleep_time);   // 设置【睡眠时间】
    if (1 == Lora_Send_CMD(Lora_device, bsp_uart_device, send_buff, (uint8_t*)"OK", 50))
    {
        Lora_Debug_Print("Error 6\r\n");
        return;
    }   

    sprintf((char*)send_buff, "AT+UART=%d,%d", Lora_device->baud_rate, Lora_device->parity);   // 设置【波特率】【数据校验位】
    if (1 == Lora_Send_CMD(Lora_device, bsp_uart_device, send_buff, (uint8_t*)"OK", 50))
    {
        Lora_Debug_Print("Error 7\r\n");
        return;
    }

    Lora_CLR_Pin(Lora_device->Lora_X->MD0_Port, Lora_device->Lora_X->MD0_Pin);  // MD0置0 --- 进入通信模式
    Lora_Delay_MS(40);
    while (Lora_Read_Pin(Lora_device->Lora_X->AUX_Port, Lora_device->Lora_X->AUX_Pin));    // 空闲状态 -- AUX=0

    Lora_device->Lora_X->device_mode = Rec_Mode; // 设备模式标记为 【接收模式】

    bsp_UART.Bsp_UART_Config(Lora_device, bsp_uart_device, Lora_device->baud_rate, Lora_device->parity); // 返回通信，更新串口配置(波特率、数据校验位)
	bsp_uart_device->usUART_RX_STA = 0;
    Lora_AUX_Init(Lora_device, Rising, LORA_A_EXTI_LINE, 0, 0); // 重新设置中断边沿 --- 上升沿
}

/***********************************  发送与接收应用层 ***********************************/

/*
* @function: Lora_Send_Data_Tran
* @param: Lora_device -> Lora设备结构体指针 bsp_uart_device -> 串口设备 str -> 待发送数据
* @retval: None
* @brief: 透明传输--发送数据
*/
static void Lora_Send_Data_Tran(_LoraConfig_st *Lora_device, bsp_UART_Parameter_st *bsp_uart_device, const uint8_t *str)
{
    if (LORA_SEND_STATUS_Tran == Lora_device->send_status)  // 透明传输
    {
        bsp_UART.Bsp_UART_Printf(Lora_device, bsp_uart_device, "%s\r\n", str);
    }
}

/*
* @function: Lora_Send_Data_Oire
* @param: Lora_device -> Lora设备结构体指针 bsp_uart_device -> 串口设备  target_addr -> 目标地址  target_channel -> 目标信道 arr -> 待发送数据数组(十六进制) size -> 数组大小
* @retval: None
* @brief: 定向传输--发送数据
*/
static void Lora_Send_Data_Oire(_LoraConfig_st *Lora_device, bsp_UART_Parameter_st *bsp_uart_device, const uint16_t target_addr, const uint8_t target_channel, const uint8_t *arr, size_t size)
{
    uint16_t len = 0;
	uint16_t i;
	
    len = size + 3; // 数据的个数 + 3(地址高低位和信道)

    uint8_t *p_arr = (uint8_t*)malloc(len * sizeof(uint8_t));

    *(p_arr + 0) = (target_addr >> 8) & 0xFF; // 高位目标地址
    *(p_arr + 1) = target_addr & 0xFF;  // 低位目标地址
    *(p_arr + 2) = target_channel;  // 目标信道

    for (i = 0; i < size; i++) // 数据进行复制
    {
        *(p_arr + i + 3) = arr[i];
    }
	
    for (uint16_t j = 0; j < len; j++)
    {
        while (RESET == __HAL_UART_GET_FLAG(Lora_device->Lora_X->huart, UART_FLAG_TXE));    // 循环发送,待发送完成
        HAL_UART_Transmit(Lora_device->Lora_X->huart, &p_arr[j], 1, 5000);
    }
	HAL_UART_Transmit(Lora_device->Lora_X->huart, (uint8_t*)"\0", 1, 5000);
    free(p_arr);
}

/*
* @function: Lora_Rec_Handler
* @param: None
* @retval: None
* @brief: Lora接收处理函数
*/
static void Lora_Rec_Handler(_LoraConfig_st *Lora_device, bsp_UART_Parameter_st *bsp_uart_device)
{
    uint16_t rx_len = 0;
    uint16_t i;

    if (bsp_uart_device->usUART_RX_STA & 0x8000)
    {
        
        rx_len = bsp_uart_device->usUART_RX_STA & 0x7FFF;
		*(bsp_uart_device->puc_UART_Rx_Buffer + rx_len) = 0;   // 添加结束符
        bsp_uart_device->usUART_RX_STA = 0;

        if (LORA_SEND_STATUS_Tran == Lora_device->send_status)
        {
            Lora_Debug_Print("%s", bsp_uart_device->puc_UART_Rx_Buffer);    // 打印到上位机显示
        }
        else if (LORA_SEND_STATUS_Oire == Lora_device->send_status)
        {
             for (i = 0; i < rx_len; i++)
             {
                 printf("%02x ",*(bsp_uart_device->puc_UART_Rx_Buffer + i));
                 // while (RESET == __HAL_UART_GET_FLAG(USE_PC_Debug_Serial, UART_FLAG_TXE));    // 循环发送,待发送完成
                 // HAL_UART_Transmit(USE_PC_Debug_Serial, &bsp_uart_device->puc_UART_Rx_Buffer[i], 1, 1000);
            }
        }
        memset((char*)bsp_uart_device->puc_UART_Rx_Buffer, 0x00, rx_len);   // 缓冲区清0
    }
}

/***********************************  AUX引脚中断 ***********************************/
/*
* @function: HAL_GPIO_EXTI_Callback
* @param: GPIO_Pin -> 引脚
* @retval: None
* @brief: 外部中断回调函数
*/
void HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin)
{
    if (LoraConfig_A.Lora_X->AUX_Pin == GPIO_Pin)
    {
        if (Rising == LoraConfig_A.Lora_X->AUX_Status)  // 上升沿(发送:开始发送数据 接收:数据开始输出)
        {
            if (Rec_Mode == LoraConfig_A.Lora_X->device_mode)   // 接收模式
            {
                bsp_UART2.usUART_RX_STA = 0;    // 计数清0
            }
            LoraConfig_A.Lora_X->AUX_Status = Falling;  // 设置为下降沿(发送:数据已发送完 接收:数据输出结束)
        }
        else if (Falling == LoraConfig_A.Lora_X->AUX_Status)    // 下降沿
        {
            if (Rec_Mode == LoraConfig_A.Lora_X->device_mode)   // 接收模式
            {
                bsp_UART2.usUART_RX_STA |= 0x8000;  // 接收完成
            }
            else if (Send_Mode == LoraConfig_A.Lora_X->device_mode) // 发送模式(串口数据发送完毕)
            {
                LoraConfig_A.Lora_X->device_mode = Rec_Mode;    // 进入接收模式
            }
            LoraConfig_A.Lora_X->AUX_Status = Rising;  // 设置为上升沿
        }
        Lora_AUX_Init(&LoraConfig_A, LoraConfig_A.Lora_X->AUX_Status, LORA_A_EXTI_LINE, 1, 0); // 重新设置中断边沿
    }
}

/*
* @function: HAL_TIM_PeriodElapsedCallback
* @param: None
* @retval: None
* @brief: 定时器回调函数
*/
void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim)
{
    if (htim->Instance == htim6.Instance)
    {
        /*********Lora设备1***********/
        bsp_UART2.usUART_RX_STA |= 0x8000;  // 接收标记完成
        HAL_TIM_Base_Stop_IT(&htim6);  // 关闭定时器
    }
}

/***********************************  底层函数 ***********************************/
/*
* @function: Lora_Set_Pin
* @param: port -> 引脚端口组 gpio -> 引脚
* @retval: None
* @brief: 设置引脚为高电平
*/
static void Lora_SET_Pin(GPIO_TypeDef *port, uint16_t gpio)
{
    HAL_GPIO_WritePin(port, gpio, GPIO_PIN_SET);
}

/*
* @function: Lora_CLR_Pin
* @param: port -> 引脚端口组 gpio -> 引脚
* @retval: None
* @brief: 设置引脚为低电平
*/
static void Lora_CLR_Pin(GPIO_TypeDef *port, uint16_t gpio)
{
    HAL_GPIO_WritePin(port, gpio, GPIO_PIN_RESET);
}

/*
* @function: Lora_Read_Pin
* @param: port -> 引脚端口组 gpio -> 引脚
* @retval: 1/0
* @brief: 读取电平
*/
static uint8_t Lora_Read_Pin(GPIO_TypeDef *port, uint16_t gpio)
{
    return HAL_GPIO_ReadPin(port, gpio);
}
```

{% endfolding %}

{% folding, AllHead.h %}

```cpp
#ifndef __ALLHEAD_H
#define __ALLHEAD_H

#include "main.h"
#include "dma.h"
#include "tim.h"
#include "usart.h"
#include "gpio.h"

#include <stdio.h>
#include <string.h>
#include <stdarg.h>
#include <stdlib.h>

#include "Lora_Config.h"
#include "bsp_UART.h"
#include "Lora.h"

#endif

```

{% endfolding %}

{% folding, bsp_UART.h %}

```cpp
#ifndef __BSP_UART_H
#define __BSP_UART_H
#include "AllHead.h"

/*串口设备1*/
// 最大接收长度
#define UART2_MAX_RX_Len 128
// 最大发送长度
#define UART2_MAX_TX_Len 400
// 上位机打印串口
#define USE_PC_Debug_Serial &huart1

// 串口参数初始化结构体
typedef struct
{
    uint8_t *puc_UART_Tx_Buffer;  // 发送缓存数组指针
    uint8_t *puc_UART_Rx_Buffer;  // 接收缓存数组指针
    uint16_t usUART_RX_STA;       // 接收数据长度/数据接收完成标志位
    uint8_t USART_NewData; // 存储接收的一个字节
    uint16_t UART_MAX_Rec_Len;    // 串口最大接收长度
    uint16_t UART_MAX_Tx_Len;     // 串口最大发送长度
} bsp_UART_Parameter_st;

// 应用层结构体
typedef struct
{
    void (*Bsp_UART_Init)(bsp_UART_Parameter_st *, UART_HandleTypeDef *, TIM_HandleTypeDef *);   // 串口初始化
	void (*Bsp_UART_Printf)(_LoraConfig_st *, bsp_UART_Parameter_st *, char*, ...);	// 串口发送
    void (*Bsp_UART_Config)(_LoraConfig_st *, bsp_UART_Parameter_st *, uint8_t, uint8_t);
    void (*Bsp_UART_RxTx_Setting)(_LoraConfig_st *, bsp_UART_Parameter_st *, uint8_t);    
} bsp_UART_st;

extern bsp_UART_Parameter_st bsp_UART2;
extern bsp_UART_st bsp_UART;

#endif
```

{% endfolding %}

{% folding, bsp_UART.c %}

```cpp
/***************************************************************************
 * File: xxx.c
 * Author: Luckys.
 * Date: 2023/11/01
 * description: 
 -----------------------------------
Lora所用串口 --- USART3
    波特率 --- 115200
    使用普通中断+定时器接收一帧数据计数
 -----------------------------------
****************************************************************************/
#include "AllHead.h"

/* Private variables=========================================================*/


/* Private variables=========================================================*/
uint8_t ucUART2_Rec_Arr[UART2_MAX_RX_Len];  // 接收数组
uint8_t ucUART2_Tx_Arr[UART2_MAX_TX_Len];  // 发送数组
/* Private function prototypes===============================================*/
static void Bsp_UART_Init(bsp_UART_Parameter_st *bsp_uart_device, UART_HandleTypeDef *uartx, TIM_HandleTypeDef *htim);
static void Bsp_UART_Data_Receive(_LoraConfig_st *Lora_device, bsp_UART_Parameter_st *bsp_uart_device);
static void Bsp_UART_Printf(_LoraConfig_st *Lora_device, bsp_UART_Parameter_st *bsp_uart_device, char* fmt, ...);
static void Bsp_UART_Config(_LoraConfig_st *Lora_device, bsp_UART_Parameter_st *bsp_uart_device, uint8_t bps, uint8_t parity);
static void Bsp_UART_RxTx_Setting(_LoraConfig_st *Lora_device, bsp_UART_Parameter_st *bsp_uart_device, uint8_t status);

/* Public variables==========================================================*/
// 串口2
bsp_UART_Parameter_st bsp_UART2 = 
{
    .puc_UART_Tx_Buffer = ucUART2_Tx_Arr,
    .puc_UART_Rx_Buffer = ucUART2_Rec_Arr,
    .usUART_RX_STA = 0, 
    .USART_NewData = 0,
    .UART_MAX_Rec_Len = UART2_MAX_RX_Len,
    .UART_MAX_Tx_Len = UART2_MAX_TX_Len
};

bsp_UART_st bsp_UART = 
{
    .Bsp_UART_Init = &Bsp_UART_Init,
	.Bsp_UART_Printf = &Bsp_UART_Printf,
    .Bsp_UART_Config = &Bsp_UART_Config,
    .Bsp_UART_RxTx_Setting = &Bsp_UART_RxTx_Setting
};

/*
* @function: Bsp_UART_Init
* @param: uartx -> 串口结构体  htim -> 定时器结构体
* @retval: None
* @brief: 串口初始化
*/
static void Bsp_UART_Init(bsp_UART_Parameter_st *bsp_uart_device, UART_HandleTypeDef *uartx, TIM_HandleTypeDef *htim)
{
    __HAL_UART_DISABLE_IT(uartx, UART_IT_TC);  // 关闭发送完成中断
    __HAL_UART_ENABLE_IT(uartx, UART_IT_RXNE); // 使能接收中断
	HAL_UART_Receive_IT(uartx,(uint8_t*)&bsp_uart_device->USART_NewData,1);   // 打开接收中断
    HAL_TIM_Base_Stop(htim);    // 停止定时器
    bsp_uart_device->usUART_RX_STA = 0;    // 接收清0

}

/*
* @function: fputc
* @param: None
* @retval: None
* @brief: 串口1重定向
*/
int fputc(int ch, FILE *f)
{
    HAL_UART_Transmit(USE_PC_Debug_Serial, (uint8_t*)&ch, 1, 0xFFFF);

    return ch;
}

/*
* @function: Bsp_UART_Data_Receive
* @param: Lora_device -> Lora设备结构体指针  bsp_uart_device -> 串口设备结构体指针
* @retval: None
* @brief: 串口数据接收
*/
static void Bsp_UART_Data_Receive(_LoraConfig_st *Lora_device, bsp_UART_Parameter_st *bsp_uart_device)
{
    uint8_t Res;

    if (Lora_device != NULL) // 判断是否为空
    {
        if (0 == (bsp_uart_device->usUART_RX_STA & 0x8000)) // 接收完成标志位置1
        {
            if ((bsp_uart_device->usUART_RX_STA) < (bsp_uart_device->UART_MAX_Rec_Len)) // 还可以接收数据
            {
                if (Config_Mode == Lora_device->Lora_X->device_mode) // 配置模式下则启动计数定时器超时
                {
                    Lora_device->Lora_X->htim->Instance->CNT = 0;	// 计数器清0

                    if (0 == bsp_uart_device->usUART_RX_STA) //  如果没有接收到任何数据
                    {
                        HAL_TIM_Base_Start_IT(Lora_device->Lora_X->htim); // 使能定时器
                        __HAL_TIM_CLEAR_FLAG(Lora_device->Lora_X->htim, TIM_FLAG_UPDATE);   // 清除中断标志位
                    }
                }
                bsp_uart_device->puc_UART_Rx_Buffer[bsp_uart_device->usUART_RX_STA++] = bsp_uart_device->USART_NewData;   // 存储接收的值
            }
            else
            {
                bsp_uart_device->usUART_RX_STA |= 0x8000; // 强制接收标志位置1
            }
        }
		HAL_UART_Receive_IT(Lora_device->Lora_X->huart,(uint8_t*)&bsp_uart_device->USART_NewData,1);
    }
    else
    {
        // 可添加非Lora模块数据接收处理(需要参数传入NULL)
    }
}


/*
* @function: Bsp_UART_Printf
* @param: Lora_device -> Lora设备结构体指针  bsp_uart_device -> 串口设备结构体指针
* @retval: None
* @brief: 串口打印
*/
static void Bsp_UART_Printf(_LoraConfig_st *Lora_device, bsp_UART_Parameter_st *bsp_uart_device, char* fmt, ...)
{
    uint16_t i, j;

    va_list ap;
    va_start(ap, fmt);
    vsprintf((char*)bsp_uart_device->puc_UART_Tx_Buffer, fmt, ap);
    va_end(ap);
    i = strlen((const char*)bsp_uart_device->puc_UART_Tx_Buffer);
    
    for (j = 0; j < i; j++)
    {
        while (0 == (Lora_device->Lora_X->huart->Instance->SR & 0x40));	// 循环发送 --- 判断状态寄存器里的TC位是否置1
		Lora_device->Lora_X->huart->Instance->DR = ((bsp_uart_device->puc_UART_Tx_Buffer[j]));	// 把数据存到数据寄存器里
    }
}

/*
* @function: Bsp_UART_Config
* @param: Lora_device -> Lora设备结构体指针  bsp_uart_device -> 串口设备 bps -> 波特率宏 parity -> 校验位宏
* @retval: None
* @brief: 串口配置 --- 波特率(1200~115200) 校验位(无、偶、奇)
*/
static void Bsp_UART_Config(_LoraConfig_st *Lora_device, bsp_UART_Parameter_st *bsp_uart_device, uint8_t bps, uint8_t parity)
{
    static uint32_t bound = 0;

    switch (bps)
    {
    case LORA_TTLBPS_1200:
    {
        bound = 1200;
        break;
    }
    case LORA_TTLBPS_2400:
    {
        bound = 2400;
        break;
    }
    case LORA_TTLBPS_4800:
    {
        bound = 4800;
        break;
    }
    case LORA_TTLBPS_9600:
    {
        bound = 9600;
        break;
    }
    case LORA_TTLBPS_19200:
    {
        bound = 19200;
        break;
    }
    case LORA_TTLBPS_38400:
    {
        bound = 38400;
        break;
    }
    case LORA_TTLBPS_57600:
    {
        bound = 57600;
        break;
    }
    case LORA_TTLBPS_115200:
    {
        bound = 115200;
        break;
    }
    default:break;
    }

    __HAL_UART_DISABLE(Lora_device->Lora_X->huart); // 关闭串口
    
    /************* 初始化 ***************/
    Lora_device->Lora_X->huart->Init.BaudRate = bound;	// 波特率
	Lora_device->Lora_X->huart->Init.StopBits = UART_STOPBITS_1;	// 一个停止位
	
	if (LORA_TTLPAR_8N1 == parity)	// 无校验
	{
		Lora_device->Lora_X->huart->Init.WordLength = UART_WORDLENGTH_8B;	// 8个数据位
		Lora_device->Lora_X->huart->Init.Parity = UART_PARITY_NONE;
	}
	else if (LORA_TTLPAR_8E1 == parity)	// 偶校验
	{
		Lora_device->Lora_X->huart->Init.WordLength = UART_WORDLENGTH_9B;	// 9个数据位
		Lora_device->Lora_X->huart->Init.Parity = UART_PARITY_EVEN;
	}
	else if (LORA_TTLPAR_8O1 == parity)	// 奇校验
	{
		Lora_device->Lora_X->huart->Init.WordLength = UART_WORDLENGTH_9B;	// 9个数据位
		Lora_device->Lora_X->huart->Init.Parity = UART_PARITY_ODD;
	}
	HAL_UART_Init(Lora_device->Lora_X->huart);	// 初始化串口
	Bsp_UART_Init(bsp_uart_device,Lora_device->Lora_X->huart,Lora_device->Lora_X->htim);    // 初始化串口
}

/*
* @function: Bsp_UART_RxTx_Setting
* @param: Lora_device -> Lora设备结构体指针  bsp_uart_device -> 串口设备 status -> 收发状态使能(0 -- 关闭接收  1 -- 开启收发)
* @retval: None
* @brief: 串口收发设置
*/
static void Bsp_UART_RxTx_Setting(_LoraConfig_st *Lora_device, bsp_UART_Parameter_st *bsp_uart_device, uint8_t status)
{
    __HAL_UART_DISABLE(Lora_device->Lora_X->huart); // 关闭串口

    /************* 初始化 ***************/
    if (status)
    {
        Lora_device->Lora_X->huart->Init.Mode = UART_MODE_TX_RX;    // 收发模式
    }
    else
    {
        Lora_device->Lora_X->huart->Init.Mode = UART_MODE_TX;    // 只发
    }
    HAL_UART_Init(Lora_device->Lora_X->huart);  // 初始化串口
	Bsp_UART_Init(bsp_uart_device,Lora_device->Lora_X->huart,Lora_device->Lora_X->htim);
}

void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart)
{
	Bsp_UART_Data_Receive(&LoraConfig_A, &bsp_UART2);   // LoraA --- 串口数据接收
}
```

{% endfolding %}

{% folding, main.c %}

```cpp
#include "AllHead.h"

int main(void)
{
    Lora.Lora_Init(&LoraConfig_A, &bsp_UART2);
    
    while(1)
    {
        Lora.Lora_Rec_Handler(&LoraConfig_A, &bsp_UART2);
    }
}
```

{% endfolding %}

- 实验现象

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231118125348.webp" style="zoom: 67%;" />







### 问题

> 接收存在问题，经常会丢失最后一个字节，如果发送端发送有`\r\n` 的话倒不会影响真实数据，丢失也是丢失最后的0x0A不影响，但是没有的话则会把真实数据最后一个字节丢失，原因未找到
>
> 暂时代替方案是在最后发送完真实数据后再发一个0表示占位的