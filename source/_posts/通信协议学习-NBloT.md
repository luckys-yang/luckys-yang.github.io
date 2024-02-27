---
title: 通信协议学习-NBloT
cover: /img/num115.webp
comments: false
katex: true
categories:
  - 细化学习
abbrlink: a7a553da
date: 2024-02-20 14:07:54
---

## 前言

{% note blue 'fas fa-fan' flat %}参考文章/博主{% endnote %}



## NB-loT

### 硬件

> 【NB-IoT模组】
>
> - 型号： `移远BC260Y-CN`，链接：[移远](https://www.quectel.com.cn/)
> - 网络类型：支持中国移动、中国联通和中国电信的NB-IoT网络。电信 & 联通的NB-IoT卡由于限制多，故需要实际测试，不保证100%支持
> - 通信速率： `Single Tone`: 25.5 (DL)/16.7 (UL)   `Multi Tone`: 25.5 (DL)/62.5 (UL)，或者Max. 127(DL)/158.5(UL)
> - 支持的通信协议： `UDP/ TCP/ LwM2M/ MQTT/ SNTP/TLS/ SSL/ PPP/ HTTP/ HTTPS/CoAP`
> - 耗流：
>
> 0.8μA @PSM
>
> 0.038mA @ 空闲模式 (eDRX=40.96s)
>
> 0.11mA @ 空闲模式 (DRX=2.56s)

> 【物联网卡】
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231214133703.webp)
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231214133711.webp)
>
> （1）默认配套：**中国移动** NB-IoT上网卡
> （2）300M/年，可用1年，满足测试需求
>
> 开发板支持中国移动NB-IoT卡
>
> NB-IoT卡属于物联网卡的一种，但**NB-IoT卡≠物联网卡**，故物联网卡并非都可用于本模块
>
> 中国电信 & 联通卡的NB-IoT卡由于限制条件多，故非100%支持
>
> 卡激活后，**只能在所激活的省份内使用**
>
> NB-IoT卡一旦激活后，就**不能拔出来插入其它设备**，否则卡会锁定

> 【硬件】
>
> <img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231214134703.webp" style="zoom:67%;" />



### 简介

> 平常所讲的2G、3G、4G中的G其实是Generation的意思，例如2G是指第二代移动通信技术。每一代移动通信技术都有对应的网络制式：
>
> 1. **中国移动**：
>
> - 2G -> GSM
> - 3G -> TD-SCDMA
> - 4G -> TD-LTE
>
> 2. **中国联通**：
>
> - 2G -> GSM
> - 3G -> WCDMA
> - 4G -> TD-LTE、FDD-LTE
>
> 3. **中国电信**：
>
> - 2G -> CDMA1X
> - 3G -> CDMA2000
> - 4G -> TD-LTE、FDD-LTE

> **WPAN**
> WPAN的全称是Low-rate wireless personal area network（低速无线个人区域网络），典型的代表有 `ZigBee、蓝牙` 等，其特点是低复杂度、低功耗、低速率、低成本
>
> **LPWA**
> LPWA的全称是Low Power Wide Area（低速无线广域网），典型的代表有 `NB-IoT、eMTC、Lora和SigFox` 等，具有广覆盖、低功耗、低成本和大连接的特点

> NB-IoT是基于LTE制式的一种移动通信技术，也就是说，**它是4G技术的一种**
>
> 下图是LTE制式通信技术的各个分支对比：
>
> <img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231214135521.webp" style="zoom:67%;" />
>
> LTE Cat-NB即NB-IoT，是基于LTE网络制式而设计的一种 `具有低功耗、低速率、上行通信时延低和下行通信时延较高（相对）` 特点的通信技术，满足对低功耗要求高但是对通信速率要求低的应用场景。上图中，我们还可以看到LTE Cat-M，它支持的通信速率比NB-IoT更高，可以应用于对通信速率要求更高的应用场景，应用场景：
>
> - 环境温湿度、光照度、气体成分等信息的采集上报
> - 火灾、煤气泄漏、水浸等环境异常状态监控与报警场景
> - 外部设备状态信息采集与上报场景，例如远程抄表
>
>  `NB-IoT的下行通信时延较高，约15秒左右（需要以实际测试为准），所以如果把NB-IoT用于下发指令或数据给终端设备，需要考虑这个时延问题。如需对下行通信速率有更快速的要求，可以采用eMTC或CATn等技术`



### 模块常用指令测试

> 需要打开 `ATCmdsTool V5.2.0` 软件，模块使用 USB转串口进行连接，4根线即可，3.3V供电

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231214145715.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231214145731.webp)

|    AT指令     |                             参数                             |                            返回值                            | 作用                       |
| :-----------: | :----------------------------------------------------------: | :----------------------------------------------------------: | -------------------------- |
| AT+QSCLK=<n>  | <n> 整型。 <br>0 禁用休眠模式。 <br>1 启用轻休眠（Light Sleep）和深休眠（Deep Sleep），并通过 PSM_EINT（下降沿）唤醒深休眠<br>2 仅启用轻休眠，并通过主串口唤醒 |                              OK                              | **配置休眠模式**           |
|      ATI      |                              /                               | Quectel_Ltd(模块制造商)<br>Quectel_BC260Y-CN(模块型号)<br>Revision: BC260YCNAAR02A02(制造商修订信息) | **读取模块完整信息**       |
|    AT+CGMM    |                              /                               |                 Quectel_BC260Y-CN<br><br>OK                  | **读取制造商模块号**       |
|    AT+CGMR    |                              /                               |             Revision: BC260YCNAAR02A02<br><br>OK             | **读取制造商修订信息**     |
| AT+CGSN=<snt> | snt: 要读取产品的哪种序列号<br>0:  唯一码<br>1:  国际移动设备识别码<br>2:  国际移动设备识别码的软件版本号<br>3:  软件版本号 |                 MP823G70607252204<br><br>OK                  | **读取模块唯一码**         |
|     同上      |                             同上                             |               +CGSN: 862745063975087<br><br>OK               | **查询IMEI**               |
|     同上      |                             同上                             |              +CGSN: 8627450639750802<br><br>OK               | **查询识别码和软件版本号** |
|     同上      |                             同上                             |                     +CGSN: 02<br><br>OK                      | **查询软件版本号**         |
|   AT+CSCON?   | 第二个返回数值代表状态，1：连接，0：空闲状态；如果没有数据交互，连接状态持续20秒，之后进入到空闲状态中，如果仍然没有数据交互，10秒后从空闲状态进入到PSM睡眠模式，这时候模块不再接收如何下行数据，模块只有在连接和空闲的状态下才能交互数据！ |                    +CSCON: 0,0<br><br>OK                     | **读取信令连接状态**       |
|   AT+CEREG?   | +CEREG:<n>,<stat>[...]<br><stat> Integer type, indicates the EPS registration status<br>1 - Registered, home network<br>其他数值 - 注册不成功 |                    +CEREG: 0,1<br><br>OK                     | **读取网络注册状态**       |
|   AT+CGATT?   |                  0：没有附着<br>1：附着成功                  |                     +CGATT: 1<br><br>OK                      | **读取网络附着状态**       |
|  AT+CGPADDR?  |                              /                               |            +CGPADDR: 0,"100.67.249.195"<br><br>OK            | **读取设备IP地址**         |
|    AT+CSQ     | 模块返回的第1个参数表示强度,越大表示信号越好<br>0：`-113dBm 或更低`<br>1：``-111dBm`<br>2~30： `-109dBm~-53dBm`<br>31：-51dBm 或更高<br>99：未知或无法检测 |                     +CSQ: 8,0<br><br>OK                      | **读取信号强度**           |
|   AT+QBAND?   |                              /                               |                   +QBAND: 5,8,3<br><br>OK                    | **查询模块的工作频段**     |
|  AT+QBAND=n   | 根据NB-IoT所属的营运商选择对应的频段<br>3: 中国联通 5: 中国电信 8: 中国移动 |                              OK                              | **设置模块的工作频段**     |
|   AT+CCLK?    | `+CCLK:[<yy/MM/dd,hh:mm:ss>[<±zz>]`<br>格式： 年月日, 时分秒, 时区 |          +CCLK: "2023/12/14,09:01:13+32"<br><br>OK           | **获取当前时间**           |
|   AT+QRST=1   |                              /                               | OK<br><br>RDY<br><br>+CFUN: 1<br><br>+CPIN: READY<br><br>+IP: 100.85.29.214 | **重启模块**               |



### 程序

> 结合上面，有上传和下发

- MX配置

串口2打开，中断打开，DMA中断不打开，DMA接收循环模式，注意要上拉！

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231213212555.webp)



- 程序编写

{% folding, AllHead.h %}

```cpp
#ifndef __ALLHEAD_H
#define __ALLHEAD_H
#include "main.h"
#include "tim.h"
#include "usart.h"
#include "gpio.h"

#include "CallBack.h"
#include "Public.h"
#include "System.h"
#include "System_Init.h"
#include "Task.h"

# include <string.h>
# include <stdarg.h>
# include <stdlib.h>
# include "stdio.h"
#include "stdint.h"
#include "math.h"

#include "bsp_4GCat_uart.h"
#include "bsp_4GCat.h"

#endif
```

{% endfolding %}

{% folding, CallBack.c %}

```cpp
/***************************************************************************
 * File: CallBack.c
 * Author: Luckys.
 * Date: 2023/06/19
 * description: store interrupt function
****************************************************************************/
#include "AllHead.h"

/* Public variables==========================================================*/
extern uint8_t ucUart1_Rec_Buff[128];
char AT_String[255];
extern const char *TOPIC_PROPERTY_SUB;
/*
* @function: HAL_TIM_PeriodElapsedCallback
* @param: None
* @retval: None
* @brief: timer callback function
*/
void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim)
{
  if (htim->Instance == htim6.Instance) // 1ms
  {
    static uint8_t cat_uart_rx = 0;
    static uint16_t cat_reset_cnt = 0;  // 模块复位所需时间计数

    cat_uart_rx++;

    if (cat_uart_rx >= 50)  // 串口接收回传校验
    {
      cat_uart_rx = 0;
      bsp_4GCat_uart.Bsp_4GCat_Uart_Handler();
    }
    if (bsp_4GCat.Reset_Status != RESET_OVER) // 复位计数
    {
      cat_reset_cnt++;

      if (cat_reset_cnt >= BSP_4GCAT_RESET_TIME)
      {
        cat_reset_cnt = 0;
        bsp_4GCat.Reset_Status = RESET_OVER;  // 复位完成
      }
    }

    System.Task_Marks_Handler();
  }
}

void USART2_IRQHandler(void)
{
	if(__HAL_UART_GET_FLAG(&huart2,UART_FLAG_IDLE) != 0x00u)
	{
		bsp_4GCat_uart.Bsp_4GCat_Uart_Data_Parse();
		__HAL_UART_CLEAR_IDLEFLAG(&huart2);
	}		
  HAL_UART_IRQHandler(&huart2);
}

void USART1_IRQHandler(void)
{
	if(__HAL_UART_GET_FLAG(&huart1,UART_FLAG_IDLE) != 0x00u)
	{
		__HAL_UART_CLEAR_IDLEFLAG(&huart1);
    HAL_UART_DMAStop(&huart1);   // 串口停止DMA接收
		if (strstr((char*)ucUart1_Rec_Buff, (char*)"MQTT_DISABLE") != NULL) // 断开MQTT连接
		{
			bsp_4GCat.bsp_4GCat_Step_Status = TASK_CIOT_MQTT_DISCONN; // 断开
		}
    if (strstr((char*)ucUart1_Rec_Buff, (char*)"GPS_GET") != NULL)
    {
      bsp_4GCat_uart.Bsp_4GCat_Uart_Send_String((const uint8_t *)"AT+CGPSINFO\r\n");
    }
    if (strstr((char*)ucUart1_Rec_Buff, (char*)"CLOSE_SUB") != NULL)  // 退订
    {
      sprintf(AT_String, "AT+CMQTTUNSUB==0,%d,9\r\n", strlen(TOPIC_PROPERTY_SUB));           
      bsp_4GCat_uart.Bsp_4GCat_Uart_Send_String((const uint8_t *)AT_String);
    }
    if (strstr((char*)ucUart1_Rec_Buff, (char*)"CLOSE_SUB_Theme") != NULL)  // 退订
    {       
      bsp_4GCat_uart.Bsp_4GCat_Uart_Send_String((const uint8_t *)TOPIC_PROPERTY_SUB);
    }
    HAL_UART_Receive_DMA(&huart1, ucUart1_Rec_Buff, 128);    
	}
	
	HAL_UART_IRQHandler(&huart1);
}
```

{% endfolding %}

{% folding, System_Init.c %}

```cpp
/***************************************************************************
 * File: System_Init.c
 * Author: Luckys.
 * Date: 2023/06/23
 * description: 存放系统初始化
****************************************************************************/
#include "AllHead.h"

/*====================================static function declaration area BEGIN====================================*/
static void Hardware_Init(void);
/*====================================static function declaration area   END====================================*/
System_Init_t System_Init = 
{
    .Hardware_Init = &Hardware_Init
};

/* Public variables==========================================================*/
uint8_t ucUart1_Rec_Buff[128] = {0};    // 串口1接收缓存数组



/*
* @function: Hardware_Init
* @param: None
* @retval: None
* @brief: 硬件模块初始化
*/
static void Hardware_Init(void)
{
#if 1	// 串口1空闲中断+DMA
    __HAL_UART_ENABLE_IT(&huart1, UART_IT_IDLE); // 使能串口空闲中断
    HAL_UART_Receive_DMA(&huart1, ucUart1_Rec_Buff, 128);	
#endif	
    bsp_4GCat_uart.Bsp_4GCat_Uart_Init();   // 模块串口初始化
    printf("Hello\r\n");

	HAL_TIM_Base_Start_IT(&htim6);
}
```

{% endfolding %}

{% folding, Task.c %}

```cpp
/***************************************************************************
 * File: Task.c
 * Author: Luckys.
 * Date: 2023/06/23
 * description: 
****************************************************************************/
#include "AllHead.h"

/* Public variables==========================================================*/
extern const char *TOPIC_PROPERTY_SUB;

/*====================================static function declaration area BEGIN====================================*/
static void TasksHandle_200MS(void);
static void TasksHandle_1S(void);
static void TasksHandle_2S(void);

/*====================================static function declaration area   END====================================*/

Task_t Task[] =
{
				{FALSE, 200, 200, TasksHandle_200MS}, // task Period: 200ms
				{FALSE, 1000, 1000, TasksHandle_1S},	// task Period: 1s
				{FALSE, 2000, 2000, TasksHandle_2S},	// task Period: 2s
};

/*====================================variable definition declaration area BEGIN===================================*/

uint8_t ucTasks_Max = sizeof(Task) / sizeof(Task[0]);

/*====================================variable definition declaration area   END===================================*/

static inline void TasksHandle_200MS(void)
{
	bsp_4GCat.bsp_4GCat_Running();
	bsp_4GCat.bsp_4GCat_Sub_Theme(TOPIC_PROPERTY_SUB);
}

static inline void TasksHandle_1S(void)
{
	bsp_4GCat.bsp_4GCat_Data_Upload_1();
}

static inline void TasksHandle_2S(void)
{ 
	bsp_4GCat.bsp_4GCat_GPS_Handler();
}
```

{% endfolding %}

{% folding, bsp_4GCat.h %}

```cpp
#ifndef __BSP_4GCAT_H
#define __BSP_4GCAT_H

// 使用调试打印(可以打印发送与接收回传数据到上位机串口助手)
#define USE_Debug_Print 0
// 使用正常打印
#define USE_Normal_Print 1
// 模块复位完成所需时间(大概10s)
#define BSP_4GCAT_RESET_TIME (uint16_t)10000
// 等待回传的计数值(测试发现大概正常情况下收到回传是330000左右，所以需要设置比它大几倍即可)
#define BSP_4GCAT_WAIT_COUNT 2000000
// 全自动模式(断开连接后自动重新复位连接)
#define BSP_4GCAT_AUTO_CONNNECT_MODE 1

/* CAT1模块工作步骤列表 */
typedef enum
{
    TASK_CIOT_AT_TEST = 0,  // 【AT】测试模块是否正常
    TASK_CIOT_AT_TEST_RSP,

    TASK_CIOT_CLOSE_ECHO,   // 【ATE0】关闭命令回显
    TASK_CIOT_CLOSE_ECHO_RSP,

    TASK_CIOT_CGATT,    // 【AT+CGATT?】查询网络附着状态  0--未附着 1--已附着成功
    TASK_CIOT_CGATT_RSP,

    TASK_CIOT_CGREG,    // 【AT+CGREG?】查询网络注册状态  0,1--已注册本地网络 0,5--已注册，但是处于漫游状态
    TASK_CIOT_CGREG_RSP,

    TASK_GPS_START, // 【AT+CGNSSPWR=1】 启动GPS
    TASK_GPS_START_RSP,

    TASK_CIOT_MQTT_START,   // 【AT+CMQTTSTART】启动MQTT功能
    TASK_CIOT_MQTT_START_RSP,

    TASK_CIOT_MQTT_OPEN,    // 【AT+CMQTTACCQ=0,[CLIENT_ID],0】打开MQTT连接，CLIENT_ID是上面定义的那个
    TASK_CIOT_MQTT_OPEN_RSP,

    TASK_CIOT_MQTT_CONNECT, // 【AT+CMQTTCONNECT=0,[DOMAIN],60,1,[USERNAME],[PASSWORD]】连接MQTT服务器
    TASK_CIOT_MQTT_CONNECT_RSP,

    TASK_CONNECT_SUCCESS,   // 连接MQTT服务器成功(结束)

    TASK_CIOT_MQTT_DISCONN, // 【AT+CMQTTDISC=0,120】断开MQTT连接
    TASK_CIOT_MQTT_DISCONN_RSP,

    TASK_CIOT_MQTT_CLOSE,   // 【AT+CMQTTREL=0】释放MQTT相关的资源
    TASK_CIOT_MQTT_CLOSE_RSP,

    TASK_CIOT_MQTT_STOP,    // 【AT+CMQTTSTOP】关闭MQTT功能
    TASK_CIOT_MQTT_STOP_RSP,

    TASK_CIOT_RESET,    // 【AT+CRESET】 模块复位
    TASK_CIOT_RESET_RSP,

    TASK_IDLE,  // 空闲状态(空转)
} bsp_4GCat_Mode_Steps_et;

// 返回状态枚举
typedef enum
{
    RET_PASS = -1,    // 成功
    RET_FAIL = 0    // 失败
} bsp_4GCat_Return_Status_et;

// 复位状态枚举
typedef enum
{
    RESET_NOT = 0,   // 未复位
    RESET_OVER = 1,  // 复位完成
} bsp_4GCat_Reset_Status_et;

// 模块接收状态
typedef enum
{
    Rec_Status_None = 0, // 不接收
    Rec_Status_CheckCmd_Plan1 = 1, // 校验指令回传 --- "OK"
    Rec_Status_CheckCmd_Plan2 = 2, // 校验指令回传 --- "+CGATT: 1"
    Rec_Status_CheckCmd_Plan3 = 3, // 校验指令回传 --- "+CGREG: 0,1 / +CGREG: 0,5"
    Rec_Status_CheckCmd_Plan4 = 4, // 校验指令回传 --- "+CMQTTCONNECT: 0,0"
    Rec_Status_CheckCmd_Plan5 = 5, // 校验指令回传 --- ">"
    Rec_Status_CheckCmd_Plan6 = 6, // 校验指令回传 --- "+CGNSSPWR：READY!"
    Rec_Status_CheckCmd_Plan7 = 7, // GPS数据
    Rec_Status_CheckCmd_Plan8 = 8, // 订阅主题成功 --- "+CMQTTSUB: 0,0"
    Rec_Status_MAX = Rec_Status_CheckCmd_Plan8 + 1,     // 枚举成员数量(当做数组的大小)
} bsp_4GCat_Rec_Status_et;

// GNSS信息结构体
typedef struct
{
    float latitude; // 存储纬度信息
    char NS;        // 纬度方向（北纬或南纬）

    float longitude; // 存储经度信息
    char EW;         // 经度方向（东经或西经）

#if 1 /* Ignores */
    struct
    {
        uint16_t year;        // 年份
        uint8_t month;        // 月份
        uint8_t day;          // 日期
        uint8_t hour;         // 小时
        uint8_t minute;       // 分钟
        uint8_t second;       // 秒
        uint16_t millisecond; // 毫秒
    } UTC;                    // 存储协调世界时（UTC）时间信息
#endif

    float altitude; // 存储海拔信息

    float speedOverGround; // 存储地面速度信息
} GNSSInfo_t;

typedef struct
{
    uint8_t bsp_GPS_Relay_Flag; // GPS装备完成标志位
    float Latitude;  // 纬度
    float Longitude; // 经度
} bsp_GPS_st;

typedef struct
{
    uint8_t bsp_4GCat_Sub_Pass_Flag; // 订阅主题成功标志位
    bsp_4GCat_Reset_Status_et Reset_Status; // 复位状态
    uint8_t bsp_4GCat_MQTT_Connect_Flag;    // 连接MQTT服务器标志位
    int8_t bsp_4GCat_Ret_Status_buf[Rec_Status_MAX];    // 存储返回值数组
    bsp_4GCat_Rec_Status_et bsp_4GCat_Rec_Status;   // 模块接收状态
    int16_t bsp_4GCat_Step_Status;  // AT模块工作步骤标记状态

    uint8_t bsp_4GCat_Pub_Buf[254]; // MQTT数据上报存储数组
    uint8_t bsp_4GCat_Pub_Len;  // MQTT数据上报长度

    void (*bsp_4GCat_Running)(void);   // 模块运行
    void (*bsp_4GCat_Data_Upload_1)(void); // 数据上传1
    int8_t (*bsp_4GCat_GPS_Get_Data)(uint8_t*);   // 获取GPS数据
    void (*bsp_4GCat_GPS_Handler)(void);   // GPS处理函数
    void (*bsp_4GCat_Sub_Theme)(const char*);   // 订阅主题
    void (*bsp_4GCat_Sub_Data_Analyze)(uint8_t *);    // 订阅主题数据解析
} bsp_4GCat_st;

extern bsp_4GCat_st bsp_4GCat;
extern bsp_GPS_st bsp_GPS;

#endif
```

{% endfolding %}

{% folding, bsp_4GCat.c %}

```cpp
/***************************************************************************
 * File: bsp_4GCat.c
 * Author: Yang
 * Date: 2023/12/06
 * description: 
 -----------------------------------
通过使能宏【BSP_4GCAT_AUTO_CONNNECT_MODE】决定是否要复位后或者/断开MQTT后重新进行连接
如果开启了MQTT功能需要关闭后下一次才能正常进行连接到MQTT服务器，不能直接复位!!!!
 -----------------------------------
****************************************************************************/
#include "AllHead.h"

/* Private variables=========================================================*/

/* 腾讯云MQTT服务器信息 */
// 域名与端口
static const char *DOMAIN = "tcp://J7X2YMW6IU.iotcloud.tencentdevices.com:1883";
// 客户端ID
static const char *CLIENT_ID = "J7X2YMW6IU";
// 用户名
static const char *USERNAME = "J7X2YMW6IUTH_Sensor_Test;12010126;0M3Y7;1992171084";
// 密码
static const char *PASSWORD = "a88fc461af8202b6933524ec9b5c9d2fac226a35cbc09b9d4150a1d00000406f;hmacsha256";
// 属性发布主题
static const char *TOPIC_PROPERTY_PUB = "$thing/up/property/J7X2YMW6IU/TH_Sensor_Test";
// 订阅MQTT主题
const char *TOPIC_PROPERTY_SUB = "$thing/down/property/J7X2YMW6IU/TH_Sensor_Test";
// 模块超时计数
int16_t bsp_4GCat_Timeout_Count;    
// 模块AT指令字符串
char bsp_4GCat_AT_String[255];  

/* Private function prototypes===============================================*/
static void bsp_4GCat_Running(void);
static void bsp_4GCat_Data_Upload_1(void);

static void bsp_4GCat_Ret_Check(int8_t ret_status);
static void bsp_4GCat_BeforeSending_Parameter_Init(bsp_4GCat_Rec_Status_et rec_status, uint8_t* str);
static void bsp_4GCat_Moduel_Reset(void);
static void bsp_4GCat_Upload_Data_To_Pub(const char* pub_string, const char* pub_data_string);
static void bsp_4GCat_Sub_Theme(const char* sub_string);
static void bsp_4GCat_Sub_Data_Analyze(uint8_t * rec_data);

static void bsp_4GCat_GPS_Handler(void);
static int8_t bsp_4GCat_GPS_Get_Data(uint8_t* data_Str);
static int8_t bsp_4GCat_GPS_Data_Analyze(const char *format, GNSSInfo_t *info);
/* Public variables==========================================================*/
bsp_GPS_st bsp_GPS = 
{
    .bsp_GPS_Relay_Flag = FALSE,
    .Latitude = 0.0,
    .Longitude = 0.0
};

bsp_4GCat_st bsp_4GCat = 
{
    .bsp_4GCat_Sub_Pass_Flag = FALSE,
    .Reset_Status = RESET_NOT,
    .bsp_4GCat_MQTT_Connect_Flag = FALSE,
    .bsp_4GCat_Ret_Status_buf = {RET_FAIL},
    .bsp_4GCat_Rec_Status = Rec_Status_None,
    .bsp_4GCat_Step_Status = TASK_CIOT_AT_TEST,

    .bsp_4GCat_Pub_Buf = {0},
    .bsp_4GCat_Pub_Len = 0,
    
    .bsp_4GCat_Running = &bsp_4GCat_Running,
    .bsp_4GCat_Data_Upload_1 = &bsp_4GCat_Data_Upload_1,
    .bsp_4GCat_GPS_Get_Data = &bsp_4GCat_GPS_Get_Data,
    .bsp_4GCat_GPS_Handler = &bsp_4GCat_GPS_Handler,
    .bsp_4GCat_Sub_Theme = &bsp_4GCat_Sub_Theme,
    .bsp_4GCat_Sub_Data_Analyze = &bsp_4GCat_Sub_Data_Analyze
};

/*=========================================== 应用层函数 ===========================================*/

/*
 * @function: bsp_4GCat_Running
 * @param: None
 * @retval: None
 * @brief: 模块运行
 */
static void bsp_4GCat_Running(void)
{
    // 未复位成功则退出
    if (bsp_4GCat.Reset_Status != RESET_OVER)
    {
        return;
    }
    switch (bsp_4GCat.bsp_4GCat_Step_Status)
    {
    case TASK_CIOT_AT_TEST:	// 【发送AT测试是否正常】
    {
        /*状态复位*/
        bsp_4GCat_BeforeSending_Parameter_Init(Rec_Status_CheckCmd_Plan1, (uint8_t *)"AT\r\n");    
        break;
    }
    case TASK_CIOT_AT_TEST_RSP:	// 【判断回传--- "OK"】
    {
        bsp_4GCat_Ret_Check(bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan1]);
        break;
    }
    case TASK_CIOT_CLOSE_ECHO:  // 【关闭命令回显】
    {
        /*状态复位*/
        bsp_4GCat_BeforeSending_Parameter_Init(Rec_Status_CheckCmd_Plan1, (uint8_t *)"ATE0\r\n");     
        break;
    }
    case TASK_CIOT_CLOSE_ECHO_RSP: // 【判断回传--- "OK"】
    {
        bsp_4GCat_Ret_Check(bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan1]);        
        break;
    }
    case TASK_CIOT_CGATT:   // 【查询网络附着状态】
    {
        /*状态复位*/
        bsp_4GCat_BeforeSending_Parameter_Init(Rec_Status_CheckCmd_Plan2, (uint8_t *)"AT+CGATT?\r\n");       
        break;
    }
    case TASK_CIOT_CGATT_RSP:   // 【判断回传--- "+CGATT: 1"】
    {
        bsp_4GCat_Ret_Check(bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan2]);       
        break;
    }
    case TASK_CIOT_CGREG:   // 【查询网络注册状态】
    {
        /*状态复位*/
        bsp_4GCat_BeforeSending_Parameter_Init(Rec_Status_CheckCmd_Plan3, (uint8_t *)"AT+CGREG?\r\n");             
        break;
    }
    case TASK_CIOT_CGREG_RSP:   // 【判断回传--- "+CGREG: 0,1"/"+CGREG: 0,5"】
    {
        bsp_4GCat_Ret_Check(bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan3]);        
        break;
    }
    case TASK_GPS_START:    // 启动GPS
    {
        /*状态复位*/
        bsp_4GCat_BeforeSending_Parameter_Init(Rec_Status_CheckCmd_Plan6, (uint8_t *)"AT+CGNSSPWR=1\r\n");        
        break;
    }
    case TASK_GPS_START_RSP:    // 【判断回传--- "+CGNSSPWR：READY!",这里需要等久点大概10s,而且不能直接单片机复位，需要断电再上电或者模块复位才能有RELAY】
    {
        if (RET_PASS == bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan6])
        {
            bsp_GPS.bsp_GPS_Relay_Flag = TRUE;
            bsp_4GCat.bsp_4GCat_Rec_Status = Rec_Status_None;
            bsp_4GCat.bsp_4GCat_Step_Status++;
        }
        else
        {
            ++bsp_4GCat_Timeout_Count;

            if (bsp_4GCat_Timeout_Count >= 50)
            {
#if USE_Normal_Print
                printf("GPS OPEN ERROR\r\n");
#endif          
                bsp_GPS.bsp_GPS_Relay_Flag = FALSE;      
                bsp_4GCat.bsp_4GCat_Step_Status++;  // 强制跳过
            }
        }
        break;
    }
    case TASK_CIOT_MQTT_START:  // 【启动MQTT】
    {
        /*状态复位*/
        bsp_4GCat_BeforeSending_Parameter_Init(Rec_Status_CheckCmd_Plan1, (uint8_t *)"AT+CMQTTSTART\r\n");
        break;
    }
    case TASK_CIOT_MQTT_START_RSP:   // 【判断回传--- "OK"】
    {
        if (RET_PASS == bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan1])
        {
            bsp_4GCat.bsp_4GCat_Rec_Status = Rec_Status_None;
            bsp_4GCat.bsp_4GCat_Step_Status++;
        }
        else
        {
            ++bsp_4GCat_Timeout_Count;

            if (bsp_4GCat_Timeout_Count >= 5)
            {
                bsp_4GCat_Timeout_Count = 0;
                // 直接复位(重发不生效)
                bsp_4GCat_Moduel_Reset();    // 复位
            }
        }        
        break;
    }
    case TASK_CIOT_MQTT_OPEN:   // 【打开MQTT连接】
    {
        /*状态复位*/
        Public.Memory_Clear((uint8_t*)bsp_4GCat_AT_String, strlen((char*)bsp_4GCat_AT_String)); // 清0
        sprintf(bsp_4GCat_AT_String,"AT+CMQTTACCQ=0,\"%s\",0\r\n",CLIENT_ID);
        bsp_4GCat_BeforeSending_Parameter_Init(Rec_Status_CheckCmd_Plan1, (uint8_t *)bsp_4GCat_AT_String);
        break;
    }
    case TASK_CIOT_MQTT_OPEN_RSP:   // 【判断回传--- "OK"】
    {
        bsp_4GCat_Ret_Check(bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan1]);       
        break;
    }
    case TASK_CIOT_MQTT_CONNECT:    // 【连接MQTT服务器】
    {
        /*状态复位*/
        Public.Memory_Clear((uint8_t*)bsp_4GCat_AT_String, strlen((char*)bsp_4GCat_AT_String)); // 清0
        sprintf(bsp_4GCat_AT_String,"AT+CMQTTCONNECT=0,\"%s\",60,1,\"%s\",\"%s\"\r\n",DOMAIN,USERNAME,PASSWORD);
        bsp_4GCat_BeforeSending_Parameter_Init(Rec_Status_CheckCmd_Plan4, (uint8_t *)bsp_4GCat_AT_String);        
        break;
    }
    case TASK_CIOT_MQTT_CONNECT_RSP:    // 【判断回传--- "+CMQTTCONNECT: 0,0"】
    {
        if (RET_PASS == bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan4])
        {
            bsp_4GCat.bsp_4GCat_Rec_Status = Rec_Status_None;
            bsp_4GCat.bsp_4GCat_Step_Status++;
        }
        else
        {
            ++bsp_4GCat_Timeout_Count;

            if (bsp_4GCat_Timeout_Count >= 5)
            {
                bsp_4GCat_Timeout_Count = 0;
                // +(重发不生效)
                bsp_4GCat_Moduel_Reset();    // 复位
            }
        }         
    }
    case TASK_CONNECT_SUCCESS:  // 连接MQTT服务器成功
    {
        bsp_4GCat.bsp_4GCat_MQTT_Connect_Flag = TRUE;
        bsp_4GCat.bsp_4GCat_Step_Status = TASK_IDLE;
#if USE_Normal_Print
        printf("MQTT CONNECT SUCCESS\r\n");
#endif        
        break;
    }
    case TASK_IDLE: // 空闲状态
    {
        break;
    }
    case TASK_CIOT_MQTT_DISCONN:   // 【断开MQTT连接】
    {
        bsp_4GCat.bsp_4GCat_MQTT_Connect_Flag = FALSE;
        bsp_4GCat.bsp_4GCat_Sub_Pass_Flag = FALSE;
        bsp_4GCat_BeforeSending_Parameter_Init(Rec_Status_CheckCmd_Plan1, (uint8_t *)"AT+CMQTTDISC=0,120\r\n");
        break;
    }
    case TASK_CIOT_MQTT_DISCONN_RSP:    // 【判断回传---"OK"】
    {
        bsp_4GCat_Ret_Check(bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan1]);
        break;
    }
    case TASK_CIOT_MQTT_CLOSE:  // 【释放MQTT相关的资源】
    {
        bsp_4GCat_BeforeSending_Parameter_Init(Rec_Status_CheckCmd_Plan1, (uint8_t *)"AT+CMQTTREL=0\r\n");
        break;
    }
    case TASK_CIOT_MQTT_CLOSE_RSP:  // 【判断回传---"OK"】
    {
        bsp_4GCat_Ret_Check(bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan1]);
        break;
    }
    case TASK_CIOT_MQTT_STOP:   // 【关闭MQTT功能】
    {
        bsp_4GCat_BeforeSending_Parameter_Init(Rec_Status_CheckCmd_Plan1, (uint8_t *)"AT+CMQTTSTOP\r\n");
        break;
    }
    case TASK_CIOT_MQTT_STOP_RSP:   // 【判断回传---"OK"】
    {
        bsp_4GCat_Ret_Check(bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan1]);
        break;
    }
    default:break;
    }
}

/*
* @function: bsp_4GCat_Data_Upload_1
* @param: None
* @retval: None
* @brief: 数据上传1
*/
static void bsp_4GCat_Data_Upload_1(void)
{
    static float a = 0,b = 0,c = 0,d = 0;
    Public.Memory_Clear((uint8_t*)bsp_4GCat.bsp_4GCat_Pub_Buf, strlen((char*)bsp_4GCat.bsp_4GCat_Pub_Buf));
    sprintf((char *)bsp_4GCat.bsp_4GCat_Pub_Buf, "{\"method\":\"report\",\"params\":{\"temp\":%.1f,\"humi\":%.1f,\"longitude\":%f,\"latitude\":%f}}", ++a, ++b, ++c, ++d);
    bsp_4GCat_Upload_Data_To_Pub(TOPIC_PROPERTY_PUB, (char*)bsp_4GCat.bsp_4GCat_Pub_Buf);
}

/*=========================================== 中间层函数 ===========================================*/

/*
* @function: bsp_4GCat_Ret_Check
* @param: None
* @retval: None
* @brief: 回传结果检测
*/
static void bsp_4GCat_Ret_Check(int8_t ret_status)
{
    if (RET_PASS == ret_status)
    {
        bsp_4GCat.bsp_4GCat_Rec_Status = Rec_Status_None;
        bsp_4GCat.bsp_4GCat_Step_Status++;
    }
    else
    {
        ++bsp_4GCat_Timeout_Count;

        if (bsp_4GCat_Timeout_Count >= 8)
        {
            bsp_4GCat.bsp_4GCat_Step_Status--;
        }
    }
}

/*
* @function: bsp_4GCat_BeforeSending_Parameter_Init
* @param: None
* @retval: None
* @brief: 参数初始化且发送
*/
static void bsp_4GCat_BeforeSending_Parameter_Init(bsp_4GCat_Rec_Status_et rec_status, uint8_t* str)
{
        /*状态复位*/
        bsp_4GCat.bsp_4GCat_Rec_Status = rec_status;
        bsp_4GCat.bsp_4GCat_Ret_Status_buf[rec_status] = RET_FAIL;
        bsp_4GCat_Timeout_Count = 0;

        bsp_4GCat_uart.Bsp_4GCat_Uart_Send_String((uint8_t *)str);
        bsp_4GCat.bsp_4GCat_Step_Status++;
}

/*
* @function: bsp_4GCat_Moduel_Reset
* @param: None
* @retval: None
* @brief: 模块复位
*/
static void bsp_4GCat_Moduel_Reset(void)
{
    bsp_4GCat.bsp_4GCat_MQTT_Connect_Flag = FALSE; // 标志位置0
    bsp_4GCat.Reset_Status = RESET_NOT; // 未复位
    bsp_4GCat.bsp_4GCat_Sub_Pass_Flag = FALSE;  // 订阅主题完成标志位置0
    bsp_4GCat_uart.Bsp_4GCat_Uart_Send_String((uint8_t *)"AT+CRESET\r\n");
#if BSP_4GCAT_AUTO_CONNNECT_MODE
    bsp_4GCat.bsp_4GCat_Step_Status = TASK_CIOT_AT_TEST;    // AT模式
#endif
#if USE_Normal_Print
        printf("RESET...\r\n");
#endif
}

/*
* @function: bsp_4GCat_Upload_Data_To_Pub
* @param: pub_string -> 发送到的目的地主题 pub_data_string -> 要上传到主题的数据内容
* @retval: None
* @brief: 上传数据到MQTT主题
*/
static void bsp_4GCat_Upload_Data_To_Pub(const char* pub_string, const char* pub_data_string)
{
    uint8_t step = 0;    // 运行到哪步计数
    uint32_t timeout = 0; // 重发超时时间计数
    static uint16_t error_count = 0; // 错误计数(复位)

    if (bsp_4GCat.bsp_4GCat_MQTT_Connect_Flag)
    {
        switch (step)
        {
        case 0: // 设置待发布的主题的字符串长度(回车后会出现一个尖括号)
        {
            timeout = 0;
            bsp_4GCat.bsp_4GCat_Rec_Status = Rec_Status_CheckCmd_Plan5;
            bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan5] = RET_FAIL;
            Public.Memory_Clear((uint8_t*)bsp_4GCat_AT_String, strlen((char*)bsp_4GCat_AT_String)); // 清0

            // 设置待发布的主题的字符串长度
            sprintf(bsp_4GCat_AT_String, "AT+CMQTTTOPIC=0,%d\r\n", strlen(pub_string));
            bsp_4GCat_uart.Bsp_4GCat_Uart_Send_String((uint8_t *)bsp_4GCat_AT_String);

            step++;
        }
        case 1: // 判断">" 后输入主题(不能有回车),会返回 "OK"
        {
            // 超时等待
            while (1)
            {
                if (RET_PASS == bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan5])
                {
                    // 发送目的地主题
#if 0                    
                    printf("-----%d------\r\n",timeout);
#endif                    
                    error_count = 0;
                    timeout = 0;

                    bsp_4GCat.bsp_4GCat_Rec_Status = Rec_Status_CheckCmd_Plan1;
                    bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan1] = RET_FAIL; 

                    bsp_4GCat_uart.Bsp_4GCat_Uart_Send_String((const uint8_t *)pub_string);
                    
                    step++;
                    break;  // 退出循环
                }

                timeout++;
                if (timeout >= BSP_4GCAT_WAIT_COUNT)
                {
                    error_count++;
                    goto error_handling;
                }                
            }
        }
        case 2: // 发送完成判断回传 "OK" 再继续操作
        {
            while (1)
            {
                if (RET_PASS == bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan1])
                {
                    timeout = 0;
                    bsp_4GCat.bsp_4GCat_Rec_Status = Rec_Status_None;

                    step++;
                    break;
                }

                timeout++;
                if (timeout >= BSP_4GCAT_WAIT_COUNT)
                {
                    error_count++;
                    goto error_handling;
                }                
            }
        }
        case 3: // 设置要发送的数据长度(会出现一个尖括号)
        {
            timeout = 0;
            bsp_4GCat.bsp_4GCat_Rec_Status = Rec_Status_CheckCmd_Plan5;
            bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan5] = RET_FAIL;
            Public.Memory_Clear((uint8_t*)bsp_4GCat_AT_String, strlen((char*)bsp_4GCat_AT_String)); // 清0

            // 设置要发送的数据长度
            sprintf(bsp_4GCat_AT_String, "AT+CMQTTPAYLOAD=0,%d\r\n", strlen(pub_data_string));
            bsp_4GCat_uart.Bsp_4GCat_Uart_Send_String((uint8_t *)bsp_4GCat_AT_String);

            step++;
        }
        case 4: // 判断 ">" 后将要发送的消息(不需要回车),会返回 "OK"
        {
            // 超时等待
            while (1)
            {
                if (RET_PASS == bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan5])
                {
                    // 发送目的地主题
                    error_count = 0;
                    timeout = 0;

                    bsp_4GCat.bsp_4GCat_Rec_Status = Rec_Status_CheckCmd_Plan1;
                    bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan1] = RET_FAIL;

                    bsp_4GCat_uart.Bsp_4GCat_Uart_Send_String((const uint8_t *)pub_data_string);

                    step++;
                    break;  // 退出循环
                }

                timeout++;
                if (timeout >= BSP_4GCAT_WAIT_COUNT)
                {
                    error_count++;
                    goto error_handling;
                }                 
            }            
        }
        case 5: // 发送完成判断回传 "OK" 再继续操作
        {
            while (1)
            {
                if (RET_PASS == bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan1])
                {
                    timeout = 0;
                    bsp_4GCat.bsp_4GCat_Rec_Status = Rec_Status_None;

                    step++;
                    break;
                }
                
                timeout++;
                if (timeout >= BSP_4GCAT_WAIT_COUNT)
                {
                    error_count++;
                    goto error_handling;
                }                
            }            
        }
        case 6: // 发送数据到指定主题，会返回 "OK"
        {
            // 向指定的主题发布消息
            bsp_4GCat_uart.Bsp_4GCat_Uart_Send_String((uint8_t *)"AT+CMQTTPUB=0,1,60\r\n");            
            break;
        }
        default:
            break;
        }
    }
    // 错误处理
    error_handling:
    {
        if (error_count >= 10) // 长时间发送失败
        {
            error_count = 0;
            bsp_4GCat_Moduel_Reset();   // 复位
        }
        return;
    }    
}

/*
* @function: bsp_4GCat_Sub_Theme
* @param: sub_string -> 待订阅的主题
* @retval: None
* @brief: 订阅主题
*/
static void bsp_4GCat_Sub_Theme(const char* sub_string)
{
    uint8_t step = 0;    // 运行到哪步计数
    uint32_t timeout = 0; // 重发超时时间计数
    static uint16_t error_count = 0; // 错误计数(复位)

    if (bsp_4GCat.bsp_4GCat_MQTT_Connect_Flag)
    {
        if (FALSE == bsp_4GCat.bsp_4GCat_Sub_Pass_Flag) // 未订阅主题则进行订阅
        {
            switch (step)
            {
                case 0: // 配置订阅的主题(回车后会返回一个 ">")
                {
                    /*状态复位*/
                    timeout = 0;
                    bsp_4GCat.bsp_4GCat_Rec_Status = Rec_Status_CheckCmd_Plan5;
                    bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan5] = RET_FAIL;    
                    Public.Memory_Clear((uint8_t*)bsp_4GCat_AT_String, strlen((char*)bsp_4GCat_AT_String)); // 清0

                    sprintf(bsp_4GCat_AT_String, "AT+CMQTTSUBTOPIC=0,%d,1\r\n", strlen(sub_string));           
                    bsp_4GCat_uart.Bsp_4GCat_Uart_Send_String((uint8_t *)bsp_4GCat_AT_String);
                    step++;
                }
                case 1: // 等待 ">" 然后发送需要订阅的主题
                {
                    // 超时等待
                    while (1)
                    {
                        if (RET_PASS == bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan5])
                        {       
                            error_count = 0;
                            timeout = 0;

                            bsp_4GCat.bsp_4GCat_Rec_Status = Rec_Status_CheckCmd_Plan1;
                            bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan1] = RET_FAIL; 

                            bsp_4GCat_uart.Bsp_4GCat_Uart_Send_String((const uint8_t *)sub_string);
                            
                            step++;
                            break;  // 退出循环
                        }

                        timeout++;
                        if (timeout >= BSP_4GCAT_WAIT_COUNT)
                        {
                            timeout = 0;
                            error_count++;
                            goto error_handling;
                        }                
                    }                    
                }
                case 2: // 返回 "OK"
                {
                    while (1)
                    {
                        if (RET_PASS == bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan1])
                        {
                            timeout = 0;
                            bsp_4GCat.bsp_4GCat_Rec_Status = Rec_Status_None;

                            step++;
                            break;
                        }
                        
                        timeout++;
                        if (timeout >= BSP_4GCAT_WAIT_COUNT)
                        {
                            timeout = 0;
                            error_count++;
                            goto error_handling;
                        }                
                    }  
                }
                case 3: // 订阅主题【返回"+CMQTTSUB: 0,0"】
                {
                    bsp_4GCat.bsp_4GCat_Rec_Status = Rec_Status_CheckCmd_Plan8;
                    bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan8] = RET_FAIL;                    
                    bsp_4GCat_uart.Bsp_4GCat_Uart_Send_String((const uint8_t *)"AT+CMQTTSUB=0\r\n");
                    step++;
                }
                case 4: // 判断回传 "+CMQTTSUB: 0,0"
                {
                    while (1)
                    {
                        if (RET_PASS == bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan8])
                        {
                            timeout = 0;
                            error_count = 0;
                            bsp_4GCat.bsp_4GCat_Sub_Pass_Flag = TRUE;
                            bsp_4GCat.bsp_4GCat_Rec_Status = Rec_Status_None;
                            break;
                        }

                        timeout++;
                        if (timeout >= BSP_4GCAT_WAIT_COUNT)
                        {
                            timeout = 0;
                            error_count++;
                            break;
                        }                 
                    }                    
                    break;
                }
                default:break;
            }           
        }
    }  
    error_handling:
    {
        if (error_count >= 10) // 长时间发送失败
        {
            error_count = 0;
            bsp_4GCat_Moduel_Reset();   // 复位
        }
        return;    
    }       
}

/*
* @function: bsp_4GCat_Sub_Data_Analyze
* @param: rec_data -> 接收的数据
* @retval: None
* @brief: 订阅主题的数据解析
*/
static void bsp_4GCat_Sub_Data_Analyze(uint8_t * rec_data)
{
    if (FALSE == bsp_4GCat.bsp_4GCat_Sub_Pass_Flag)
    {
        return;
    }
    uint16_t len = 0;
    len = sizeof((char *)rec_data); // 长度
    uint8_t temp[len];

    Public.Memory_Copy((char *)temp, (char *)rec_data, len); // 复制

    // 数据判断
    if (strstr((char *)rec_data, "\"switch_1\":1") != NULL)
    {
        HAL_GPIO_WritePin(GPIOA,GPIO_PIN_0,GPIO_PIN_RESET);
    }
    if (strstr((char *)rec_data, "\"switch_1\":0") != NULL)
    {   
        HAL_GPIO_WritePin(GPIOA,GPIO_PIN_0,GPIO_PIN_SET);
    }    
}

/*=========================================== GPS相关函数 ===========================================*/
/*
* @function: bsp_4GCat_GPS_Handler
* @param: None
* @retval: None
* @brief: GPS处理函数
*/
static void bsp_4GCat_GPS_Handler(void)
{
    uint8_t step = 0;
    uint32_t timeout = 0; // 重发超时时间计数
    static uint16_t error_count = 0; // 错误计数

    if (FALSE == bsp_GPS.bsp_GPS_Relay_Flag)    // GPS未准备则退出
    {
        return;
    }
    switch (step)
    {
        case 0: // 手动获取经纬度,会返回 经纬度数据和"OK"
        {
            timeout = 0;
            bsp_4GCat.bsp_4GCat_Rec_Status = Rec_Status_CheckCmd_Plan7;
            bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan7] = RET_FAIL;
            bsp_4GCat_uart.Bsp_4GCat_Uart_Send_String((const uint8_t *)"AT+CGPSINFO\r\n");            
            step++;
        }   
        case 1: // 提取经纬度数据
        {
            while (1)
            {
                if (RET_PASS == bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan7])
                {
                    timeout = 0;
                    error_count = 0;
                    bsp_4GCat.bsp_4GCat_Rec_Status = Rec_Status_None;
                    break;
                }

                timeout++;
                if (timeout >= BSP_4GCAT_WAIT_COUNT)
                {
                    error_count++;
                    bsp_GPS.Latitude = 0;
                    bsp_GPS.Longitude = 0;
                    break;
                }                 
            }
            break;
        }
        default:break;
    }
    // 错误处理---直接GPS准备完成标志位置0
    if (error_count >= 10)
    {
        error_count = 0;
        bsp_GPS.bsp_GPS_Relay_Flag = FALSE;
    }
}

/*
* @function: bsp_4GCat_GPS_Get_Data
* @param: data_Str -> 接收数组
* @retval: 成功--RET_PASS 失败--RET_FAIL
* @brief: 获取GPS数据
*/
static int8_t bsp_4GCat_GPS_Get_Data(uint8_t* data_Str)
{
    uint16_t len = 0;
    GNSSInfo_t info;

    len = strlen((char *)data_Str); // 长度
    uint8_t temp[len];

    Public.Memory_Copy((char *)temp, (char *)data_Str, len); // 复制

    if (bsp_4GCat_GPS_Data_Analyze((char *)temp, &info) != RET_PASS)
    {
        return RET_FAIL;
    }

    float lat, lon;
    float minutes;

    lat = ((uint16_t)info.latitude) / 100;
    minutes = info.latitude - lat * 100;
    lat += minutes / 60;

    lon = ((uint16_t)info.longitude) / 100;
    minutes = info.longitude - lon * 100;
    lon += minutes / 60;

    if (info.NS == 'S')
    {
        lat = -lat;
    }
    if (info.EW == 'W')
    {
        lon = -lon;
    }
    // 获取经纬度
    bsp_GPS.Latitude = lat;
    bsp_GPS.Longitude = lon;

    return RET_PASS;
}

/*
* @function: bsp_4GCat_GPS_Data_Analyze
* @param: None
* @retval: None
* @brief: 数据解析
*/
static int8_t bsp_4GCat_GPS_Data_Analyze(const char *format, GNSSInfo_t *info)
{
    char *start = strstr(format, "+CGPSINFO: ");

    if (NULL == start)
    {
        return RET_FAIL;
    }

    if (strlen(start) < 35)
    {
        return RET_FAIL;
    }

    start += 11; // Skip the header.

    uint8_t flag = 0;
    uint8_t finish = 0;

    char value[24];
    Public.Memory_Clear((uint8_t*)value, sizeof(value));

    for (uint8_t counter = 0; *start != 0; start++)
    {
        if (*start == ',')
        {
        }
        else if (*start == '\r')
        {
            finish = 1;
        }
        else
        {
            value[counter++] = *start;
            continue;
        }

        switch (flag++)
        {
            case 0:
            {
                info->latitude = (float)atof(value);
                break;
            }
            case 1:
            {
                info->NS = value[0];
                break;
            }
            case 2:
            {
                info->longitude = (float)atof(value);
                break;
            }
            case 3:
            {
                info->EW = value[0];
                break;
            }
            case 4:
            {
                info->UTC.year = (uint16_t)atoi(&value[4]);
                value[4] = 0;
                info->UTC.month = (uint8_t)atoi(&value[2]);
                value[2] = 0;
                info->UTC.day = (uint8_t)atoi(&value[0]);
                break;
            }
            case 5:
            {
                info->UTC.millisecond = (uint16_t)atoi(&value[7]);
                value[6] = 0;
                info->UTC.second = (uint8_t)atoi(&value[4]);
                value[4] = 0;
                info->UTC.minute = (uint8_t)atoi(&value[2]);
                value[2] = 0;
                info->UTC.hour = (uint8_t)atoi(&value[0]);
                break;
            }
            case 6:
            {
                info->altitude = (float)atof(value);
                break;
            }
            case 7:
            {
                info->speedOverGround = (float)atof(value);
                break;
            }
            default:
            {
                finish = 1;
                break;
            }
        }

        if (finish)
        {
            break;
        }
        counter = 0;
        Public.Memory_Clear((uint8_t*)value, sizeof(value));
    }

    return RET_PASS;
}
```

{% endfolding %}

{% folding, bsp_4GCat_uart.h %}

```cpp
#ifndef __BSP_4GCAT_UART_H
#define __BSP_4GCAT_UART_H
#include "AllHead.h"

// 模块使用的串口
#define BSP_4GCat_USE_Serial huart2
// 模块使用定时器
#define BSP_4GCat_USE_Timer htim7
// 串口接收最大长度
#define BSP_4GCat_Rec_MAX_LEN 168

typedef struct
{
	uint8_t ucUart_Rec_Over_Flag;	// 串口接收完成标志位
	uint16_t usUart_Rec_Len;	// 串口接收数据长度
    uint8_t *pucRec_Buffer; // 接收缓存指针
    void (*Bsp_4GCat_Uart_Init)(void); // 串口初始化
    void (*Bsp_4GCat_Uart_Send_String)(const uint8_t *); // 串口发送字符串
    void (*Bsp_4GCat_Uart_Data_Parse)(void);   // 串口数据解析
    void (*Bsp_4GCat_Uart_Handler)(void);  // 串口处理函数
} bsp_4GCat_uart_st;

extern bsp_4GCat_uart_st bsp_4GCat_uart;

#endif
```

{% endfolding %}

{% folding, bsp_4GCat_uart.c %}

```cpp
/***************************************************************************
 * File: bsp_4GCat_uart.c
 * Author: Yang
 * Date: 2023/12/06
 * description: 
 -----------------------------------
串口接线：
        PA2(TX) --- 模块RX
        PA3(RX) --- 模块TX
        GND --- GND
        5V --- 5V
 -----------------------------------
****************************************************************************/
#include "AllHead.h"

/* Private variables=========================================================*/
static uint8_t uc4GCat_Uart_Rec_Temp_Arr[BSP_4GCat_Rec_MAX_LEN];        // 串口接收临时缓存数组
static uint8_t uc4GCat_Uart_Rec_Arr[BSP_4GCat_Rec_MAX_LEN];   // 模块串口接收数组

/* Private function prototypes===============================================*/
static void Bsp_4GCat_Uart_Init(void);
static void Bsp_4GCat_Uart_Send_String(const uint8_t *pStr);
static void Bsp_4GCat_Uart_Data_Parse(void);
static void Bsp_4GCat_Uart_Handler(void);
/* Public variables==========================================================*/
bsp_4GCat_uart_st bsp_4GCat_uart =
{
				.ucUart_Rec_Over_Flag = FALSE,
				.usUart_Rec_Len = 0,
				.pucRec_Buffer = uc4GCat_Uart_Rec_Arr,
				.Bsp_4GCat_Uart_Init = &Bsp_4GCat_Uart_Init,
				.Bsp_4GCat_Uart_Send_String = &Bsp_4GCat_Uart_Send_String,
				.Bsp_4GCat_Uart_Data_Parse = &Bsp_4GCat_Uart_Data_Parse,
				.Bsp_4GCat_Uart_Handler = &Bsp_4GCat_Uart_Handler
};

/*
 * @function: Bsp_4GCat_Uart_Init
 * @param: None
 * @retval: None
 * @brief: 串口初始化
 */
static void Bsp_4GCat_Uart_Init(void)
{
    __HAL_UART_ENABLE_IT(&BSP_4GCat_USE_Serial, UART_IT_IDLE); // 使能串口空闲中断
    HAL_UART_Receive_DMA(&BSP_4GCat_USE_Serial, uc4GCat_Uart_Rec_Temp_Arr, (uint16_t)BSP_4GCat_Rec_MAX_LEN);                                                       // 接收清0
}

/*
 * @function: Bsp_4GCat_Uart_Send_String
 * @param: None
 * @retval: None
 * @brief: 串口发送字符串
 */
static void Bsp_4GCat_Uart_Send_String(const uint8_t *pStr)
{
        HAL_UART_Transmit(&BSP_4GCat_USE_Serial, pStr, strlen((const char *)pStr), 5000);
#if USE_Debug_Print				
		HAL_UART_Transmit(&huart1, pStr, strlen((const char *)pStr), 5000);
#endif				
}

/*
 * @function: Bsp_4GCat_Uart_Data_Parse
 * @param: None
 * @retval: None
 * @brief: 串口接收数据解析
 */
static void Bsp_4GCat_Uart_Data_Parse(void)
{
	HAL_UART_DMAStop(&BSP_4GCat_USE_Serial);   // 串口停止DMA接收
	bsp_4GCat_uart.usUart_Rec_Len = BSP_4GCat_Rec_MAX_LEN - __HAL_DMA_GET_COUNTER(&hdma_usart2_rx);
	Public.Memory_Copy((char*)bsp_4GCat_uart.pucRec_Buffer, (char*)uc4GCat_Uart_Rec_Temp_Arr, bsp_4GCat_uart.usUart_Rec_Len);
	bsp_4GCat_uart.ucUart_Rec_Over_Flag = TRUE;
}

/*
 * @function: Bsp_4GCat_Uart_Handler
 * @param: None
 * @retval: None
 * @brief: 串口接收处理函数
 */
static void Bsp_4GCat_Uart_Handler(void)
{
	if (bsp_4GCat_uart.ucUart_Rec_Over_Flag)
	{
		switch (bsp_4GCat.bsp_4GCat_Rec_Status)
		{
			case Rec_Status_None:
			{
				break;
			}
			case Rec_Status_CheckCmd_Plan1:
			{
				if (strstr((char*)bsp_4GCat_uart.pucRec_Buffer, (char*)"OK") != NULL)
				{
					bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan1] = RET_PASS;
				}
				else
				{
					bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan1] = RET_FAIL;
				}
				break;
			}
			case Rec_Status_CheckCmd_Plan2:
			{
				if (strstr((char*)bsp_4GCat_uart.pucRec_Buffer, (char*)"+CGATT: 1") != NULL)
				{
					bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan2] = RET_PASS;
				}
				else
				{
					bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan2] = RET_FAIL;
				}				
				break;
			}
			case Rec_Status_CheckCmd_Plan3:
			{
				if (strstr((char*)bsp_4GCat_uart.pucRec_Buffer, (char*)"+CGREG: 0,1") != NULL)
				{
					bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan3] = RET_PASS;
				}
				else if (strstr((char*)bsp_4GCat_uart.pucRec_Buffer, (char*)"+CGREG: 0,5") != NULL)
				{
					bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan3] = RET_PASS;
				}
				else
				{
					bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan3] = RET_FAIL;
				}				
				break;
			}
			case Rec_Status_CheckCmd_Plan4:
			{
				if (strstr((char*)bsp_4GCat_uart.pucRec_Buffer, (char*)"+CMQTTCONNECT: 0,0") != NULL)
				{
					bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan4] = RET_PASS;
				}
				else
				{
					bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan4] = RET_FAIL;
				}				
				break;
			}
			case Rec_Status_CheckCmd_Plan5:
			{
				if (strstr((char*)bsp_4GCat_uart.pucRec_Buffer, (char*)">") != NULL)
				{
					bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan5] = RET_PASS;
				}
				else
				{
					bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan5] = RET_FAIL;
				}				
				break;
			}
			case Rec_Status_CheckCmd_Plan6:
			{
				if (strstr((char*)bsp_4GCat_uart.pucRec_Buffer, (char*)"READY") != NULL)
				{
					bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan6] = RET_PASS;
				}
				else
				{
					bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan6] = RET_FAIL;
				}				
				break;
			}
			case Rec_Status_CheckCmd_Plan7:
			{
				bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan7] = bsp_4GCat.bsp_4GCat_GPS_Get_Data(bsp_4GCat_uart.pucRec_Buffer);
				break;
			}
			case Rec_Status_CheckCmd_Plan8:
			{
				if (strstr((char*)bsp_4GCat_uart.pucRec_Buffer, (char*)"+CMQTTSUB: 0,0") != NULL)
				{
					bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan8] = RET_PASS;
				}
				else
				{
					bsp_4GCat.bsp_4GCat_Ret_Status_buf[Rec_Status_CheckCmd_Plan8] = RET_FAIL;
				}				
				break;
			}
			default:break;
		}
		// 订阅主题发送过来的数据解析
		bsp_4GCat.bsp_4GCat_Sub_Data_Analyze(bsp_4GCat_uart.pucRec_Buffer);
		bsp_4GCat_uart.ucUart_Rec_Over_Flag = FALSE;

#if USE_Debug_Print		
		printf("%s\r\n",bsp_4GCat_uart.pucRec_Buffer);
#endif

		Public.Memory_Clear(bsp_4GCat_uart.pucRec_Buffer,bsp_4GCat_uart.usUart_Rec_Len);
		bsp_4GCat_uart.usUart_Rec_Len = 0;
		HAL_UART_Receive_DMA(&BSP_4GCat_USE_Serial, uc4GCat_Uart_Rec_Temp_Arr, (uint16_t)BSP_4GCat_Rec_MAX_LEN);
	}
}
```

{% endfolding %}

- 实验现象

正常



### 使用UDP与私有服务器通信

> PuTTY登陆的话还是跟4G一样，使用那个IP，用户名，密码
>
> 使用移远串口调试助手

- 打开串口助手

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231214190312.webp)

- 登陆远程服务器

登陆后输入指令进入UDP服务

```bash
./udpserver
```

- 串口助手输入指令

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231214191833.webp" style="zoom:67%;" />

```bash
AT	// 测试
# OK
AT+QSCLK=0	// 禁止模块休眠
# OK
AT+QIOPEN=0,0,"UDP","1.15.27.206",12301	// 创建UDP链接
# OK
# +QIOPEN: 0,0
AT+QISEND=0,13	// 配置待发送数据的长度，会出现一个>
# >
{"value":123}	// 输入数据(没有回车换行)
# OK
# SEND OK
AT+QICLOSE=0	// 关闭连接
# OK
# CLOSE OK
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231214192647.webp)



### 使用TCP与私有服务器通信

- 登陆远程服务器

登陆后输入指令进入TCP服务

```bash
./tcpserver
```

- 串口助手输入指令

```bash
AT	// 测试
# OK
AT+QSCLK=0	// 禁止模块休眠
# OK
AT+QIOPEN=0,0,"TCP","1.15.27.206",12300	// 创建TCP链接
# OK
# +QIOPEN: 0,0
AT+QISEND=0,13	// 配置待发送数据的长度，会出现一个>
# >
{"value":123}	// 输入数据(没有回车换行)
# OK
# SEND OK
AT+QICLOSE=0	// 关闭连接
# OK
# CLOSE OK
```

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231214194140.webp" style="zoom:67%;" />



### 使用MQTT与私有云服务器通信

- 启动MQTT服务，puTTY输入：

```bash
./killall
./mosquitto -v
```

- 使用MQTT.fx连接云服务器

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206115040.webp)

然后点击连接即可，然后订阅主题

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206120956.webp)

- 使用模块连接云服务器进行发布与订阅测试

```bash
AT	// 测试
# OK
AT+QSCLK=0	// 禁止模块休眠
# OK
AT+QMTOPEN=0,"1.15.27.206",1883	// 打开MQTT连接
# OK
# +QMTOPEN: 0,0
AT+QMTCONN=0,"iotdevice"	// 连接服务器
# OK
# +QMTCONN: 0,0,0
AT+QMTSUB=0,1,"topic/report",2	// 订阅了“topic/report”这个主题
# OK
# +QMTSUB: 0,1,0,2
# +QMTRECV: 0,1,"topic/report","　this  that "
// 测试
AT+QMTSUB=0,1,"topic/write",2	// 订阅
# OK
# +QMTSUB: 0,1,0,2
AT+QMTUNS=0,2,"topic/write"	// 退订
# OK
# +QMTUNS: 0,2,0
```

MQTT.fx往订阅的主题发布消息，则串口助手会收到

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231214200408.webp" style="zoom:50%;" />

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231214200525.webp)

串口助手发送消息到MQTT.fx：

```bash
AT+QMTPUB=0,0,0,0,"topic/pub",13	// 向 "topic/pub" 主题发送消息数据，数据长度为13
# >
{"value":123}	// 不能有回车
# OK
# +QMTPUB: 0,0,0
```

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231214201631.webp" style="zoom:67%;" />



### 上传数据到腾讯云

- 腾讯云部分跟4GCat上传数据一样步骤即可

- MX配置

跟4G配置一样

任务调度所需定时器，1ms

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231215113955.webp" style="zoom:67%;" />

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231215114014.webp)

- 程序编写

也是跟4G模块程序大致一样，部分不一样如下

{% folding, CallBack.c %}

```cpp
/***************************************************************************
 * File: CallBack.c
 * Author: Luckys.
 * Date: 2023/06/19
 * description: store interrupt function
****************************************************************************/
#include "AllHead.h"

/* Public variables==========================================================*/
extern uint8_t ucUart1_Rec_Buff[128];
char AT_String[255];
extern const char *TOPIC_PROPERTY_SUB;
/*
* @function: HAL_TIM_PeriodElapsedCallback
* @param: None
* @retval: None
* @brief: timer callback function
*/
void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim)
{
  if (htim->Instance == htim4.Instance) // 1ms
  {
    static uint8_t cat_uart_rx = 0;
    static uint16_t cat_reset_cnt = 0;  // 模块复位所需时间计数

    cat_uart_rx++;

    if (cat_uart_rx >= 50)  // 串口接收回传校验
    {
      cat_uart_rx = 0;
      bsp_NBLOT_uart.Bsp_NBLOT_Uart_Handler();
    }
    if (bsp_NBLOT.Reset_Status != RESET_OVER) // 复位计数
    {
      cat_reset_cnt++;

      if (cat_reset_cnt >= BSP_NBLOT_RESET_TIME)
      {
        cat_reset_cnt = 0;
        bsp_NBLOT.Reset_Status = RESET_OVER;  // 复位完成
      }
    }

    System.Task_Marks_Handler();
  }
}

void USART2_IRQHandler(void)
{
	if(__HAL_UART_GET_FLAG(&huart2,UART_FLAG_IDLE) != 0x00u)
	{
		bsp_NBLOT_uart.Bsp_NBLOT_Uart_Data_Parse();
		__HAL_UART_CLEAR_IDLEFLAG(&huart2);
	}		
  HAL_UART_IRQHandler(&huart2);
}

void USART1_IRQHandler(void)
{
	if(__HAL_UART_GET_FLAG(&huart1,UART_FLAG_IDLE) != 0x00u)
	{
		__HAL_UART_CLEAR_IDLEFLAG(&huart1);
    HAL_UART_DMAStop(&huart1);   // 串口停止DMA接收
		if (strstr((char*)ucUart1_Rec_Buff, (char*)"MQTT_DISABLE") != NULL) // 断开MQTT连接
		{
			bsp_NBLOT.bsp_NBLOT_Step_Status = TASK_CIOT_MQTT_DISCONN; // 断开
		}
    HAL_UART_Receive_DMA(&huart1, ucUart1_Rec_Buff, 128);    
	}
	
	HAL_UART_IRQHandler(&huart1);
}
```

{% endfolding %}

{% folding, System_Init.c %}

```cpp
/***************************************************************************
 * File: System_Init.c
 * Author: Luckys.
 * Date: 2023/06/23
 * description: 
****************************************************************************/
#include "AllHead.h"

/*====================================static function declaration area BEGIN====================================*/
static void Hardware_Init(void);
/*====================================static function declaration area   END====================================*/
System_Init_t System_Init = 
{
    .Hardware_Init = &Hardware_Init
};

/* Public variables==========================================================*/
uint8_t ucUart1_Rec_Buff[128] = {0};    // 



/*
* @function: Hardware_Init
* @param: None
* @retval: None
* @brief: 
*/
static void Hardware_Init(void)
{
#if 1	
    __HAL_UART_ENABLE_IT(&huart1, UART_IT_IDLE); // 
    HAL_UART_Receive_DMA(&huart1, ucUart1_Rec_Buff, 128);	
#endif	
    bsp_NBLOT_uart.Bsp_NBLOT_Uart_Init();   // 
    printf("Hello\r\n");
	HAL_TIM_Base_Start_IT(&htim4);
}
```

{% endfolding %}

{% folding, Task.c %}

```cpp
/***************************************************************************
 * File: Task.c
 * Author: Luckys.
 * Date: 2023/06/23
 * description: 
****************************************************************************/
#include "AllHead.h"

/* Public variables==========================================================*/
extern const char *TOPIC_PROPERTY_SUB;

/*====================================static function declaration area BEGIN====================================*/
static void TasksHandle_200MS(void);
static void TasksHandle_1S(void);
static void TasksHandle_2S(void);

/*====================================static function declaration area   END====================================*/

Task_t Task[] =
{
				{FALSE, 200, 200, TasksHandle_200MS}, // task Period: 200ms
				{FALSE, 1000, 1000, TasksHandle_1S},	// task Period: 1s
				{FALSE, 2000, 2000, TasksHandle_2S},	// task Period: 2s
};

/*====================================variable definition declaration area BEGIN===================================*/

uint8_t ucTasks_Max = sizeof(Task) / sizeof(Task[0]);

/*====================================variable definition declaration area   END===================================*/

static inline void TasksHandle_200MS(void)
{
	HAL_GPIO_TogglePin(LED_GPIO_Port,LED_Pin);
	bsp_NBLOT.bsp_NBLOT_Running();
}

static inline void TasksHandle_1S(void)
{
	bsp_NBLOT.bsp_NBLOT_Data_Upload_1();
}

static inline void TasksHandle_2S(void)
{ 

}
```

{% endfolding %}

{% folding, bsp_NBLOT.h %}

```cpp
#ifndef __BSP_NBLOT_H
#define __BSP_NBLOT_H

// 使用调试打印(可以打印发送与接收回传数据到上位机串口助手)
#define USE_Debug_Print 1
// 使用正常打印
#define USE_Normal_Print 1
// 模块复位完成所需时间(大概5s)
#define BSP_NBLOT_RESET_TIME (uint16_t)5000
// 等待回传的计数值(测试发现大概正常情况下收到回传是330000左右，所以需要设置比它大几倍即可)
#define BSP_NBLOT_WAIT_COUNT 2000000
// 全自动模式(断开连接后自动重新复位连接)
#define BSP_NBLOT_AUTO_CONNNECT_MODE 1

/* CAT1模块工作步骤列表 */
typedef enum
{
    TASK_CIOT_AT_TEST = 0,  // 【AT】测试模块是否正常
    TASK_CIOT_AT_TEST_RSP,

    TASK_NBIOT_DISABLE_PSM,   // 【AT+QSCLK=0】禁止模块休眠
    TASK_NBIOT_DISABLE_PSM_RSP,

    TASK_NBIOT_DISABLE_ECHO,    // 【ATE0】关闭回显
    TASK_NBIOT_DISABLE_ECHO_RSP,

    TASK_NBIOT_SET_BAND,    // 【AT+QBAND=1,8】设置模块的工作频段  3: 中国联通 5: 中国电信 8: 中国移动
    TASK_NBIOT_SET_BAND_RSP,

    TASK_NBIOT_DHCP,    // 【AT+CGPADDR?】读取设备IP地址
    TASK_NBIOT_DHCP_RSP,

    TASK_CIOT_MQTT_OPEN,    // 【AT+QMTOPEN=0,[CLIENT_ID],1883】打开MQTT连接，CLIENT_ID是上面定义的那个
    TASK_CIOT_MQTT_OPEN_RSP,

    TASK_CIOT_MQTT_CONNECT, // 【AT+QMTCONN=0,[CLIENT_ID],[USERNAME],[PASSWORD]】连接MQTT服务器
    TASK_CIOT_MQTT_CONNECT_RSP,

    TASK_CONNECT_SUCCESS,   // 连接MQTT服务器成功(结束)

    TASK_CIOT_MQTT_DISCONN, // 【AT+CMQTTDISC=0,120】断开MQTT连接
    TASK_CIOT_MQTT_DISCONN_RSP,

    TASK_CIOT_RESET,    // 【AT+CRESET】 模块复位
    TASK_CIOT_RESET_RSP,

    TASK_IDLE,  // 空闲状态(空转)
} bsp_NBLOT_Mode_Steps_et;

// 返回状态枚举
typedef enum
{
    RET_PASS = -1,    // 成功
    RET_FAIL = 0    // 失败
} bsp_NBLOT_Return_Status_et;

// 复位状态枚举
typedef enum
{
    RESET_NOT = 0,   // 未复位
    RESET_OVER = 1,  // 复位完成
} bsp_NBLOT_Reset_Status_et;

// 模块接收状态
typedef enum
{
    Rec_Status_None = 0, // 不接收
    Rec_Status_CheckCmd_Plan1 = 1, // 校验指令回传 --- "OK"
    Rec_Status_CheckCmd_Plan2 = 2, // 校验指令回传 --- "+CGPADDR:  / OK"
    Rec_Status_CheckCmd_Plan3 = 3, // 校验指令回传 --- "+QMTOPEN: "
    Rec_Status_CheckCmd_Plan4 = 4, // 校验指令回传 --- "+QMTCONN: "
    Rec_Status_CheckCmd_Plan5 = 5, // 校验指令回传 --- ">"
    Rec_Status_CheckCmd_Plan6 = 6, // 校验指令回传 --- "+QMTPUB: "
    Rec_Status_MAX = Rec_Status_CheckCmd_Plan6 + 1,     // 枚举成员数量(当做数组的大小)
} bsp_NBLOT_Rec_Status_et;

typedef struct
{
    bsp_NBLOT_Reset_Status_et Reset_Status; // 复位状态
    uint8_t bsp_NBLOT_MQTT_Connect_Flag;    // 连接MQTT服务器标志位
    int8_t bsp_NBLOT_Ret_Status_buf[Rec_Status_MAX];    // 存储返回值数组
    bsp_NBLOT_Rec_Status_et bsp_NBLOT_Rec_Status;   // 模块接收状态
    int16_t bsp_NBLOT_Step_Status;  // AT模块工作步骤标记状态

    uint8_t bsp_NBLOT_Pub_Buf[254]; // MQTT数据上报存储数组
    uint8_t bsp_NBLOT_Pub_Len;  // MQTT数据上报长度

    void (*bsp_NBLOT_Running)(void);   // 模块运行
    void (*bsp_NBLOT_Data_Upload_1)(void); // 数据上传1
} bsp_NBLOT_st;

extern bsp_NBLOT_st bsp_NBLOT;

#endif
```

{% endfolding %}

{% folding, bsp_NBLOT.c %}

```cpp
/***************************************************************************
 * File: bsp_NBLOT.c
 * Author: Yang
 * Date: 2023/12/15
 * description: 
 -----------------------------------

 -----------------------------------
****************************************************************************/
#include "AllHead.h"

/* Private variables=========================================================*/

/* 腾讯云MQTT服务器信息 */
// 域名
static const char *DOMAIN = "J7X2YMW6IU.iotcloud.tencentdevices.com";
// 客户端ID
static const char *CLIENT_ID = "J7X2YMW6IU";
// 用户名
static const char *USERNAME = "J7X2YMW6IUTH_Sensor_Test;12010126;0M3Y7;1992171084";
// 密码
static const char *PASSWORD = "a88fc461af8202b6933524ec9b5c9d2fac226a35cbc09b9d4150a1d00000406f;hmacsha256";
// 属性发布主题
static const char *TOPIC_PROPERTY_PUB = "$thing/up/property/J7X2YMW6IU/TH_Sensor_Test";
// 模块超时计数
int16_t bsp_NBLOT_Timeout_Count;    
// 模块AT指令字符串
char bsp_NNBLOT_AT_String[255];  

/* Private function prototypes===============================================*/
static void bsp_NBLOT_Running(void);
static void bsp_NBLOT_Data_Upload_1(void);

static void bsp_NBLOT_Ret_Check(int8_t ret_status);
static void bsp_NBLOT_BeforeSending_Parameter_Init(bsp_NBLOT_Rec_Status_et rec_status, uint8_t* str);
static void bsp_NBLOT_Moduel_Reset(void);
static void bsp_NBLOT_Upload_Data_To_Pub(const char* pub_string, const char* pub_data_string);
/* Public variables==========================================================*/

bsp_NBLOT_st bsp_NBLOT = 
{
    .Reset_Status = RESET_NOT,
    .bsp_NBLOT_MQTT_Connect_Flag = FALSE,
    .bsp_NBLOT_Ret_Status_buf = {RET_FAIL},
    .bsp_NBLOT_Rec_Status = Rec_Status_None,
    .bsp_NBLOT_Step_Status = TASK_CIOT_AT_TEST,

    .bsp_NBLOT_Pub_Buf = {0},
    .bsp_NBLOT_Pub_Len = 0,
    
    .bsp_NBLOT_Running = &bsp_NBLOT_Running,
    .bsp_NBLOT_Data_Upload_1 = &bsp_NBLOT_Data_Upload_1
};

/*=========================================== 应用层函数 ===========================================*/

/*
 * @function: bsp_NBLOT_Running
 * @param: None
 * @retval: None
 * @brief: 模块运行
 */
static void bsp_NBLOT_Running(void)
{
    // 未复位成功则退出
    if (bsp_NBLOT.Reset_Status != RESET_OVER)
    {
        return;
    }
    switch (bsp_NBLOT.bsp_NBLOT_Step_Status)
    {
    case TASK_CIOT_AT_TEST:	// 【发送AT测试是否正常】
    {
        /*状态复位*/
        bsp_NBLOT_BeforeSending_Parameter_Init(Rec_Status_CheckCmd_Plan1, (uint8_t *)"AT\r\n");    
        break;
    }
    case TASK_CIOT_AT_TEST_RSP:	// 【判断回传--- "OK"】
    {
        bsp_NBLOT_Ret_Check(bsp_NBLOT.bsp_NBLOT_Ret_Status_buf[Rec_Status_CheckCmd_Plan1]);
        break;
    }
    case TASK_NBIOT_DISABLE_PSM:  // 【禁止模块休眠】
    {
        /*状态复位*/
        bsp_NBLOT_BeforeSending_Parameter_Init(Rec_Status_CheckCmd_Plan1, (uint8_t *)"AT+QSCLK=0\r\n");     
        break;
    }
    case TASK_NBIOT_DISABLE_PSM_RSP: // 【判断回传--- "OK"】
    {
        bsp_NBLOT_Ret_Check(bsp_NBLOT.bsp_NBLOT_Ret_Status_buf[Rec_Status_CheckCmd_Plan1]);        
        break;
    }
    case TASK_NBIOT_DISABLE_ECHO:   // 【关闭回显】
    {
        /*状态复位*/
        bsp_NBLOT_BeforeSending_Parameter_Init(Rec_Status_CheckCmd_Plan1, (uint8_t *)"ATE0\r\n");        
        break;
    }
    case TASK_NBIOT_DISABLE_ECHO_RSP:   // 【判断回传--- "OK"】
    {
        bsp_NBLOT_Ret_Check(bsp_NBLOT.bsp_NBLOT_Ret_Status_buf[Rec_Status_CheckCmd_Plan1]);
        break;
    }
    case TASK_NBIOT_SET_BAND:   // 【设置模块的工作频段】
    {
        /*状态复位*/
        bsp_NBLOT_BeforeSending_Parameter_Init(Rec_Status_CheckCmd_Plan1, (uint8_t *)"AT+QBAND=1,8\r\n");       
        break;
    }
    case TASK_NBIOT_SET_BAND_RSP:   // 【判断回传--- "OK"】
    {
        bsp_NBLOT_Ret_Check(bsp_NBLOT.bsp_NBLOT_Ret_Status_buf[Rec_Status_CheckCmd_Plan1]);       
        break;
    }
    case TASK_NBIOT_DHCP:   // 【读取设备IP地址】
    {
        /*状态复位*/
        bsp_NBLOT_BeforeSending_Parameter_Init(Rec_Status_CheckCmd_Plan2, (uint8_t *)"AT+CGPADDR?\r\n");             
        break;
    }
    case TASK_NBIOT_DHCP_RSP:   // 【判断回传--- "+CGPADDR: 0,"xxx.xxx.xxx.xxx""】
    {
        bsp_NBLOT_Ret_Check(bsp_NBLOT.bsp_NBLOT_Ret_Status_buf[Rec_Status_CheckCmd_Plan2]);        
        break;
    }
    case TASK_CIOT_MQTT_OPEN:   // 【打开MQTT连接】
    {
        /*状态复位*/
        Public.Memory_Clear((uint8_t*)bsp_NNBLOT_AT_String, strlen((char*)bsp_NNBLOT_AT_String)); // 清0
        sprintf(bsp_NNBLOT_AT_String,"AT+QMTOPEN=0,\"%s\",1883\r\n",DOMAIN);
        bsp_NBLOT_BeforeSending_Parameter_Init(Rec_Status_CheckCmd_Plan3, (uint8_t *)bsp_NNBLOT_AT_String);
        break;
    }
    case TASK_CIOT_MQTT_OPEN_RSP:   // 【判断回传--- "+QMTOPEN: "】
    {
        if (RET_PASS == bsp_NBLOT.bsp_NBLOT_Ret_Status_buf[Rec_Status_CheckCmd_Plan3])
        {
            bsp_NBLOT.bsp_NBLOT_Rec_Status = Rec_Status_None;
            bsp_NBLOT.bsp_NBLOT_Step_Status++;
        }
        else
        {
            ++bsp_NBLOT_Timeout_Count;

            if (bsp_NBLOT_Timeout_Count >= 5)
            {
                bsp_NBLOT_Timeout_Count = 0;
                // +(重发不生效)
                bsp_NBLOT_Moduel_Reset();    // 复位
            }
        }              
        break;
    }
    case TASK_CIOT_MQTT_CONNECT:    // 【连接MQTT服务器】
    {
        /*状态复位*/
        Public.Memory_Clear((uint8_t*)bsp_NNBLOT_AT_String, strlen((char*)bsp_NNBLOT_AT_String)); // 清0
        sprintf(bsp_NNBLOT_AT_String,"AT+QMTCONN=0,\"%s\",\"%s\",\"%s\"\r\n",CLIENT_ID,USERNAME,PASSWORD);
        bsp_NBLOT_BeforeSending_Parameter_Init(Rec_Status_CheckCmd_Plan4, (uint8_t *)bsp_NNBLOT_AT_String);        
        break;
    }
    case TASK_CIOT_MQTT_CONNECT_RSP:    // 【判断回传--- "+QMTCONN: "】
    {
        if (RET_PASS == bsp_NBLOT.bsp_NBLOT_Ret_Status_buf[Rec_Status_CheckCmd_Plan4])
        {
            bsp_NBLOT.bsp_NBLOT_Rec_Status = Rec_Status_None;
            bsp_NBLOT.bsp_NBLOT_Step_Status++;
        }
        else
        {
            ++bsp_NBLOT_Timeout_Count;

            if (bsp_NBLOT_Timeout_Count >= 5)
            {
                bsp_NBLOT_Timeout_Count = 0;
                // +(重发不生效)
                bsp_NBLOT_Moduel_Reset();    // 复位
            }
        }         
    }
    case TASK_CONNECT_SUCCESS:  // 连接MQTT服务器成功
    {
        bsp_NBLOT.bsp_NBLOT_MQTT_Connect_Flag = TRUE;
        bsp_NBLOT.bsp_NBLOT_Step_Status = TASK_IDLE;
#if USE_Normal_Print
        printf("MQTT CONNECT SUCCESS\r\n");
#endif        
        break;
    }
    case TASK_IDLE: // 空闲状态
    {
        break;
    }
    case TASK_CIOT_MQTT_DISCONN:   // 【断开MQTT连接】
    {
        bsp_NBLOT.bsp_NBLOT_MQTT_Connect_Flag = FALSE;
        bsp_NBLOT_BeforeSending_Parameter_Init(Rec_Status_CheckCmd_Plan1, (uint8_t *)"AT+QMTDISC=0\r\n");
        break;
    }
    case TASK_CIOT_MQTT_DISCONN_RSP:    // 【判断回传---"OK"】
    {
        bsp_NBLOT_Ret_Check(bsp_NBLOT.bsp_NBLOT_Ret_Status_buf[Rec_Status_CheckCmd_Plan1]);
        break;
    }
    default:
    {
        bsp_NBLOT.bsp_NBLOT_Step_Status = TASK_IDLE;
        break;
    }
    }
}

/*
* @function: bsp_NBLOT_Data_Upload_1
* @param: None
* @retval: None
* @brief: 数据上传1
*/
static void bsp_NBLOT_Data_Upload_1(void)
{
    static float a = 0,b = 0,c = 0,d = 0;
    Public.Memory_Clear((uint8_t*)bsp_NBLOT.bsp_NBLOT_Pub_Buf, strlen((char*)bsp_NBLOT.bsp_NBLOT_Pub_Buf));
    sprintf((char *)bsp_NBLOT.bsp_NBLOT_Pub_Buf, "{\"method\":\"report\",\"params\":{\"temp\":%.1f,\"humi\":%.1f,\"longitude\":%f,\"latitude\":%f}}", ++a, ++b, ++c, ++d);
    bsp_NBLOT_Upload_Data_To_Pub(TOPIC_PROPERTY_PUB, (char*)bsp_NBLOT.bsp_NBLOT_Pub_Buf);
}

/*=========================================== 中间层函数 ===========================================*/

/*
* @function: bsp_NBLOT_Ret_Check
* @param: None
* @retval: None
* @brief: 回传结果检测
*/
static void bsp_NBLOT_Ret_Check(int8_t ret_status)
{
    static uint16_t error_counter = 0;

    if (RET_PASS == ret_status)
    {
        error_counter = 0;
        bsp_NBLOT.bsp_NBLOT_Rec_Status = Rec_Status_None;
        bsp_NBLOT.bsp_NBLOT_Step_Status++;
#if 0        
        printf("1234\r\n");
#endif        
    }
    else
    {
        ++bsp_NBLOT_Timeout_Count;

        if (bsp_NBLOT_Timeout_Count >= 8)
        {
            error_counter++;
            bsp_NBLOT.bsp_NBLOT_Step_Status--;
        }
    }

    if (error_counter >= 10)
    {
        bsp_NBLOT_Moduel_Reset();   // 复位
    }
}

/*
* @function: bsp_NBLOT_BeforeSending_Parameter_Init
* @param: None
* @retval: None
* @brief: 参数初始化且发送
*/
static void bsp_NBLOT_BeforeSending_Parameter_Init(bsp_NBLOT_Rec_Status_et rec_status, uint8_t* str)
{
        /*状态复位*/
        bsp_NBLOT.bsp_NBLOT_Rec_Status = rec_status;
        bsp_NBLOT.bsp_NBLOT_Ret_Status_buf[rec_status] = RET_FAIL;
        bsp_NBLOT_Timeout_Count = 0;

        bsp_NBLOT_uart.Bsp_NBLOT_Uart_Send_String((uint8_t *)str);
        bsp_NBLOT.bsp_NBLOT_Step_Status++;
}

/*
* @function: bsp_NBLOT_Moduel_Reset
* @param: None
* @retval: None
* @brief: 模块复位
*/
static void bsp_NBLOT_Moduel_Reset(void)
{
    bsp_NBLOT.bsp_NBLOT_MQTT_Connect_Flag = FALSE; // 标志位置0
    bsp_NBLOT.Reset_Status = RESET_NOT; // 未复位
    bsp_NBLOT_uart.Bsp_NBLOT_Uart_Send_String((uint8_t *)"AT+QRST=1\r\n");
#if BSP_NBLOT_AUTO_CONNNECT_MODE
    bsp_NBLOT.bsp_NBLOT_Step_Status = TASK_CIOT_AT_TEST;    // AT模式
#endif
#if USE_Normal_Print
        printf("RESET...\r\n");
#endif
}

/*
* @function: bsp_NBLOT_Upload_Data_To_Pub
* @param: pub_string -> 发送到的目的地主题 pub_data_string -> 要上传到主题的数据内容
* @retval: None
* @brief: 上传数据到MQTT主题
*/
static void bsp_NBLOT_Upload_Data_To_Pub(const char* pub_string, const char* pub_data_string)
{
    uint8_t step = 0;    // 运行到哪步计数
    uint32_t timeout = 0; // 重发超时时间计数
    static uint16_t error_count = 0; // 错误计数(复位)

    if (bsp_NBLOT.bsp_NBLOT_MQTT_Connect_Flag)
    {
        switch (step)
        {
        case 0: // // 向 "xxx" 主题发送消息数据，数据长度为xx
        {
            timeout = 0;
            bsp_NBLOT.bsp_NBLOT_Rec_Status = Rec_Status_CheckCmd_Plan5;
            bsp_NBLOT.bsp_NBLOT_Ret_Status_buf[Rec_Status_CheckCmd_Plan5] = RET_FAIL;
            Public.Memory_Clear((uint8_t*)bsp_NNBLOT_AT_String, strlen((char*)bsp_NNBLOT_AT_String)); // 清0

            // 设置待发布的主题和要发送的数据长度
            sprintf(bsp_NNBLOT_AT_String, "AT+QMTPUB=0,0,0,0,\"%s\",%d\r\n", pub_string, strlen(pub_data_string));
            bsp_NBLOT_uart.Bsp_NBLOT_Uart_Send_String((uint8_t *)bsp_NNBLOT_AT_String);

            step++;
        }
        case 1: // 判断回传 ">" 发送数据
        {
            // 超时等待
            while (1)
            {
                if (RET_PASS == bsp_NBLOT.bsp_NBLOT_Ret_Status_buf[Rec_Status_CheckCmd_Plan5])
                {
                    // 发送数据
#if 0                    
                    printf("-----%d------\r\n",timeout);
#endif
                    error_count = 0;
                    timeout = 0;

                    bsp_NBLOT.bsp_NBLOT_Rec_Status = Rec_Status_CheckCmd_Plan6;
                    bsp_NBLOT.bsp_NBLOT_Ret_Status_buf[Rec_Status_CheckCmd_Plan6] = RET_FAIL;

                    bsp_NBLOT_uart.Bsp_NBLOT_Uart_Send_String((const uint8_t *)pub_data_string);

                    step++;
                    break; // 退出循环
                }

                timeout++;
                if (timeout >= BSP_NBLOT_WAIT_COUNT)
                {
                    error_count++;
                    goto error_handling;
                }
            }
        }
        case 2: //判断回传 "OK"/"+QMTPUB: 0,0,0"
        {
            // 超时等待
            while (1)
            {
                if (RET_PASS == bsp_NBLOT.bsp_NBLOT_Ret_Status_buf[Rec_Status_CheckCmd_Plan6])
                {           
                    error_count = 0;
                    timeout = 0;

                    bsp_NBLOT.bsp_NBLOT_Rec_Status = Rec_Status_None;
                    bsp_NBLOT.bsp_NBLOT_Ret_Status_buf[Rec_Status_None] = RET_FAIL; 

                    step++;
                    break;  // 退出循环
                }

                timeout++;
                if (timeout >= BSP_NBLOT_WAIT_COUNT)
                {
                    error_count++;
                    goto error_handling;
                }                
            }
        }
        default:
            break;
        }
    }
    // 错误处理
    error_handling:
    {
        if (error_count >= 10) // 长时间发送失败
        {
            error_count = 0;
            bsp_NBLOT.bsp_NBLOT_Step_Status = TASK_CIOT_MQTT_DISCONN; // 断开
        }
        return;
    }    
}
```

{% endfolding %}

{% folding, bsp_NBLOT_uart.h %}

```cpp
#ifndef __BSP_NBLOT_UART_H
#define __BSP_NBLOT_UART_H
#include "AllHead.h"

// 模块使用的串口
#define BSP_NBLOT_USE_Serial huart2
// 串口接收最大长度
#define BSP_NBLOT_Rec_MAX_LEN 168

typedef struct
{
	uint8_t ucUart_Rec_Over_Flag;	// 串口接收完成标志位
	uint16_t usUart_Rec_Len;	// 串口接收数据长度
    uint8_t *pucRec_Buffer; // 接收缓存指针
    void (*Bsp_NBLOT_Uart_Init)(void); // 串口初始化
    void (*Bsp_NBLOT_Uart_Send_String)(const uint8_t *); // 串口发送字符串
    void (*Bsp_NBLOT_Uart_Data_Parse)(void);   // 串口数据解析
    void (*Bsp_NBLOT_Uart_Handler)(void);  // 串口处理函数
} bsp_NBLOT_uart_st;

extern bsp_NBLOT_uart_st bsp_NBLOT_uart;

#endif
```

{% endfolding %}

{% folding, bsp_NBLOT_uart.c %}

```cpp
/***************************************************************************
 * File: bsp_NBLOT_uart.c
 * Author: Yang
 * Date: 2023/12/06
 * description: 
 -----------------------------------
串口接线：
        PA2(TX) --- 模块RX
        PA3(RX) --- 模块TX
        GND --- GND
        3.3V --- 3.3V
 -----------------------------------
****************************************************************************/
#include "AllHead.h"

/* Private variables=========================================================*/
static uint8_t NBLOT_Uart_Rec_Temp_Arr[BSP_NBLOT_Rec_MAX_LEN];        // 串口接收临时缓存数组
static uint8_t NBLOT_Uart_Rec_Arr[BSP_NBLOT_Rec_MAX_LEN];   // 模块串口接收数组

/* Private function prototypes===============================================*/
static void Bsp_NBLOT_Uart_Init(void);
static void Bsp_NBLOT_Uart_Send_String(const uint8_t *pStr);
static void Bsp_NBLOT_Uart_Data_Parse(void);
static void Bsp_NBLOT_Uart_Handler(void);
/* Public variables==========================================================*/
bsp_NBLOT_uart_st bsp_NBLOT_uart =
{
				.ucUart_Rec_Over_Flag = FALSE,
				.usUart_Rec_Len = 0,
				.pucRec_Buffer = NBLOT_Uart_Rec_Arr,
				.Bsp_NBLOT_Uart_Init = &Bsp_NBLOT_Uart_Init,
				.Bsp_NBLOT_Uart_Send_String = &Bsp_NBLOT_Uart_Send_String,
				.Bsp_NBLOT_Uart_Data_Parse = &Bsp_NBLOT_Uart_Data_Parse,
				.Bsp_NBLOT_Uart_Handler = &Bsp_NBLOT_Uart_Handler
};

/*
 * @function: Bsp_NBLOT_Uart_Init
 * @param: None
 * @retval: None
 * @brief: 串口初始化
 */
static void Bsp_NBLOT_Uart_Init(void)
{
    __HAL_UART_ENABLE_IT(&BSP_NBLOT_USE_Serial, UART_IT_IDLE); // 使能串口空闲中断
    HAL_UART_Receive_DMA(&BSP_NBLOT_USE_Serial, NBLOT_Uart_Rec_Temp_Arr, (uint16_t)BSP_NBLOT_Rec_MAX_LEN);                                                       // 接收清0
}

/*
 * @function: Bsp_NBLOT_Uart_Send_String
 * @param: None
 * @retval: None
 * @brief: 串口发送字符串
 */
static void Bsp_NBLOT_Uart_Send_String(const uint8_t *pStr)
{
        HAL_UART_Transmit(&BSP_NBLOT_USE_Serial, pStr, strlen((const char *)pStr), 5000);
#if USE_Debug_Print				
		HAL_UART_Transmit(&huart1, pStr, strlen((const char *)pStr), 5000);
#endif				
}

/*
 * @function: Bsp_NBLOT_Uart_Data_Parse
 * @param: None
 * @retval: None
 * @brief: 串口接收数据解析
 */
static void Bsp_NBLOT_Uart_Data_Parse(void)
{
	HAL_UART_DMAStop(&BSP_NBLOT_USE_Serial);   // 串口停止DMA接收
	bsp_NBLOT_uart.usUart_Rec_Len = BSP_NBLOT_Rec_MAX_LEN - __HAL_DMA_GET_COUNTER(&hdma_usart2_rx);
	Public.Memory_Copy((char*)bsp_NBLOT_uart.pucRec_Buffer, (char*)NBLOT_Uart_Rec_Temp_Arr, bsp_NBLOT_uart.usUart_Rec_Len);
	bsp_NBLOT_uart.ucUart_Rec_Over_Flag = TRUE;
}

/*
 * @function: Bsp_NBLOT_Uart_Handler
 * @param: None
 * @retval: None
 * @brief: 串口接收处理函数
 */
static void Bsp_NBLOT_Uart_Handler(void)
{
	if (bsp_NBLOT_uart.ucUart_Rec_Over_Flag)
	{
		switch (bsp_NBLOT.bsp_NBLOT_Rec_Status)
		{
			case Rec_Status_None:
			{
				break;
			}
			case Rec_Status_CheckCmd_Plan1:
			{
				if (strstr((char*)bsp_NBLOT_uart.pucRec_Buffer, (char*)"OK") != NULL)
				{
					bsp_NBLOT.bsp_NBLOT_Ret_Status_buf[Rec_Status_CheckCmd_Plan1] = RET_PASS;
				}
				else
				{
					bsp_NBLOT.bsp_NBLOT_Ret_Status_buf[Rec_Status_CheckCmd_Plan1] = RET_FAIL;
				}
				break;
			}
			case Rec_Status_CheckCmd_Plan2:
			{
				if (strstr((char*)bsp_NBLOT_uart.pucRec_Buffer, (char*)"OK") != NULL)	// 寻找子串"OK"
				{
					char *start = strstr((char*)bsp_NBLOT_uart.pucRec_Buffer, (char*)"+CGPADDR: ");	// 寻找子串"+CGPADDR: "

					if (NULL == start)
					{
						bsp_NBLOT.bsp_NBLOT_Ret_Status_buf[Rec_Status_CheckCmd_Plan2] = RET_FAIL;
					}
					else
					{
						char *ip = start + 13;	// 获取 IP 地址的起始位置
						char *end = strchr(ip, '"');	// 获取 IP 地址的结束位置

						if (NULL == end)
						{
							bsp_NBLOT.bsp_NBLOT_Ret_Status_buf[Rec_Status_CheckCmd_Plan2] = RET_FAIL;
						}
						else
						{
							*end = 0;	// 在 IP 地址的结束位置处添加 '\0' 字符，表示字符串的结束

							if (strlen(ip) < 7)	// 如果 IP 地址的长度小于 7
							{
								bsp_NBLOT.bsp_NBLOT_Ret_Status_buf[Rec_Status_CheckCmd_Plan2] = RET_FAIL;
							}
							else
							{
								bsp_NBLOT.bsp_NBLOT_Ret_Status_buf[Rec_Status_CheckCmd_Plan2] = RET_PASS;
							}
						}
					}
				}
				else
				{
					bsp_NBLOT.bsp_NBLOT_Ret_Status_buf[Rec_Status_CheckCmd_Plan2] = RET_FAIL;
				}				
				break;
			}
			case Rec_Status_CheckCmd_Plan3:
			{
				if (strstr((char*)bsp_NBLOT_uart.pucRec_Buffer, (char*)"+QMTOPEN: ") != NULL)
				{
					bsp_NBLOT.bsp_NBLOT_Ret_Status_buf[Rec_Status_CheckCmd_Plan3] = RET_PASS;
				}
				else
				{
					bsp_NBLOT.bsp_NBLOT_Ret_Status_buf[Rec_Status_CheckCmd_Plan3] = RET_FAIL;
				}				
				break;
			}
			case Rec_Status_CheckCmd_Plan4:
			{
				if (strstr((char*)bsp_NBLOT_uart.pucRec_Buffer, (char*)"+QMTCONN: ") != NULL)
				{
					bsp_NBLOT.bsp_NBLOT_Ret_Status_buf[Rec_Status_CheckCmd_Plan4] = RET_PASS;
				}
				else
				{
					bsp_NBLOT.bsp_NBLOT_Ret_Status_buf[Rec_Status_CheckCmd_Plan4] = RET_FAIL;
				}				
				break;
			}
			case Rec_Status_CheckCmd_Plan5:
			{
				if (strstr((char*)bsp_NBLOT_uart.pucRec_Buffer, (char*)">") != NULL)
				{
					bsp_NBLOT.bsp_NBLOT_Ret_Status_buf[Rec_Status_CheckCmd_Plan5] = RET_PASS;
				}
				else
				{
					bsp_NBLOT.bsp_NBLOT_Ret_Status_buf[Rec_Status_CheckCmd_Plan5] = RET_FAIL;
				}				
				break;
			}
			case Rec_Status_CheckCmd_Plan6:
			{
				if (strstr((char*)bsp_NBLOT_uart.pucRec_Buffer, (char*)"+QMTPUB: ") != NULL)
				{
					bsp_NBLOT.bsp_NBLOT_Ret_Status_buf[Rec_Status_CheckCmd_Plan6] = RET_PASS;
				}
				else
				{
					bsp_NBLOT.bsp_NBLOT_Ret_Status_buf[Rec_Status_CheckCmd_Plan6] = RET_FAIL;
				}				
				break;
			}
			default:break;
		}
		bsp_NBLOT_uart.ucUart_Rec_Over_Flag = FALSE;

#if USE_Debug_Print		
		printf("%s\r\n",bsp_NBLOT_uart.pucRec_Buffer);
#endif

		Public.Memory_Clear(bsp_NBLOT_uart.pucRec_Buffer,bsp_NBLOT_uart.usUart_Rec_Len);
		bsp_NBLOT_uart.usUart_Rec_Len = 0;
		HAL_UART_Receive_DMA(&BSP_NBLOT_USE_Serial, NBLOT_Uart_Rec_Temp_Arr, (uint16_t)BSP_NBLOT_Rec_MAX_LEN);
	}
}
```

{% endfolding %}

- 实验现象

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231215144224.webp" style="zoom:67%;" />