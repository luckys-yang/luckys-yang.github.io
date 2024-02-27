---
title: 通信协议学习-WiFi
cover: /img/num168.webp
comments: false
katex: true
categories:
  - 细化学习
abbrlink: 521e139f
---

## 前言

{% note blue 'fas fa-fan' flat %}参考文章/博主{% endnote %}

[(一）STM32连上阿里云（附开源代码）](https://blog.csdn.net/fang_dz999/article/details/112283742?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522168812875616800182774388%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fblog.%2522%257D&request_id=168812875616800182774388&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~first_rank_ecpm_v1~rank_v31_ecpm-2-112283742-null-null.268^v1^koosearch&utm_term=stm32%20%E6%B8%A9%E6%B9%BF%E5%BA%A6%E9%98%BF%E9%87%8C%E4%BA%91&spm=1018.2226.3001.4450)

[(二)STM32上传数据到阿里云网页](https://blog.csdn.net/fang_dz999/article/details/118055091?spm=1001.2014.3001.5502)

[(三)STM32上传数据网页以及手机app](https://blog.csdn.net/fang_dz999/article/details/118056172?spm=1001.2014.3001.5502)

[stm32 app 连上阿里云](https://blog.csdn.net/weixin_45642495/article/details/118069124?spm=1001.2014.3001.5502)



## WiFi

- 常用AT命令

> AT+GMR  ----  查看模块版本信息
>
> AT+CIFSR ---- 查看IP地址
>
> AT+CIOBAUD=9600 ---- 波特率修改为9600
>
> AT+CWMODE=2 ---- 开启AP模式
>
> AT+CWSAP="ESP8266","0123456789",11,3 ---- 设置WiFi名称，密码
>
> AT+RST ---- 重启生效

> - 特殊返回值
>
> 配网成功后会返回：
>
> ```cpp
> WIFI CONNECTED
> WIFI GOT IP
> 
> OK
> ```
>
> 

### ESP-01S

{% note blue 'fas fa-fan' flat %}阿里云连接{% endnote %}

> 基于STM32F103ZET6连接阿里云

- 模块信息

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230621175441.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230621180316.webp)

使用USB转TTL模块连接WiFi模块在上位机进行测试

模块3.3V的电源一定不能由USB转TTL模块提供，它带不动

> 项目遇到的问题：
>
> 1. ESP01S模块有时候连接成功了但是如果此时按复位的话会一直发送AT命令失败，原因是连接成功的那次最后是进入了透传模式的，所以复位的话它还是处于透传模式所以发AT命令没用，解决方法是在连接时第一句应该是退出透传模式指令，然后再写其他的，然后又有其他问题就是使用AT命令复位的话经常失败，后面我使用了直接把RST引脚写低电平然后延时100ms再写高电平这样就解决了

> 查看模块的信息
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230628105947.webp)
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230628110306.webp)



- 硬件电路

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230624082338.webp)

- MX配置

PC12设置成开漏输出即可，默认高电平，因为低电平复位

使用UART3进行通信

然后使用一个定时器用作接收计数

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ%E6%88%AA%E5%9B%BE20230629210321.webp)

- 阿里云

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ%E6%88%AA%E5%9B%BE20230629211353.webp)



- 程序编写

用到几个文件夹

> 1. esp8266
> 2. hmac(无需改动)
> 3. iot
> 4. mqtt(默认即可，只需要改transport.c)
>
> 把这几个文件夹放到一个名称为 `aliyun` 的文件夹即可
>
> 部分改动代码如下：
>
> {% note red 'fas fa-fan' flat %}esp8266文件夹{% endnote %}
>
> {% folding, esp8266.h %}
>
> ```cpp
> #ifndef __ESP8266_H
> #define __ESP8266_H
> #include "AllHead.h"
> 
> //【网络连接信息】在下方修改设置您的路由器热点和物联网平台IP地址+端口号信息
> #define SSID "yang520" // 无线路由器热点名称【必须按您的实际情况修改】
> #define PASS "00000000"   // 无线路由器热点密码【必须按您的实际情况修改】
> 
> #define IOT_DOMAIN_NAME "iot-06z00b2xuy7fxl9.mqtt.iothub.aliyuncs.com" // 云服务器IP地址【必须按您的实际情况修改】
> #define IOT_PORTNUM 	"1883" // 云服务器端口号
> 
> typedef struct
> {
>     uint8_t Connect_Server_Flag; // 连接成功服务器标志位
>     void (*ESP8266_Init)(void);  // ESP8266初始化
>     uint8_t (*ESP8266_Send_Cmd)(char *, char *, uint16_t);  // ESP8266发送指令（底层函数）
>     uint8_t* (*ESP8266_Check_Cmd)(uint8_t *);   // ESP8266检查指令（底层函数）
>     uint8_t (*ESP8266_Connect_IOTServer)(void); // ESP8266连接到物联网平台服务器
>     uint8_t (*ESP8266_Quit_Trans)(void);    // ESP8266退出透传模式（底层函数）
>     uint8_t (*ESP8266_Connect_Server)(void);    // ESP8266连接到服务器
>     uint8_t (*ESP8266_Connect_AP)(void);    // ESP8266连接AP设备（无线路由器）
>     void (*ESP8266_Send_Heart)(void);   // 发送心跳包
> }ESP8266_t;
> 
> extern ESP8266_t ESP8266;
> 
> #endif#ifndef __ESP8266_H
> #define __ESP8266_H
> #include "AllHead.h"
> 
> //【网络连接信息】在下方修改设置您的路由器热点和物联网平台IP地址+端口号信息
> #define SSID "yang520" // 无线路由器热点名称【必须按您的实际情况修改】
> #define PASS "00000000"   // 无线路由器热点密码【必须按您的实际情况修改】
> 
> #define IOT_DOMAIN_NAME "iot-06z00b2xuy7fxl9.mqtt.iothub.aliyuncs.com" // 云服务器IP地址【必须按您的实际情况修改】
> #define IOT_PORTNUM 	"1883" // 云服务器端口号
> 
> typedef struct
> {
>     uint8_t Connect_Server_Flag; // 连接成功服务器标志位
>     void (*ESP8266_Init)(void);  // ESP8266初始化
>     uint8_t (*ESP8266_Send_Cmd)(char *, char *, uint16_t);  // ESP8266发送指令（底层函数）
>     uint8_t* (*ESP8266_Check_Cmd)(uint8_t *);   // ESP8266检查指令（底层函数）
>     uint8_t (*ESP8266_Connect_IOTServer)(void); // ESP8266连接到物联网平台服务器
>     uint8_t (*ESP8266_Quit_Trans)(void);    // ESP8266退出透传模式（底层函数）
>     uint8_t (*ESP8266_Connect_Server)(void);    // ESP8266连接到服务器
>     uint8_t (*ESP8266_Connect_AP)(void);    // ESP8266连接AP设备（无线路由器）
>     void (*ESP8266_Send_Heart)(void);   // 发送心跳包
> }ESP8266_t;
> 
> extern ESP8266_t ESP8266;
> 
> #endif
> ```
>
> {% endfolding %}
>
> {% folding, esp8266.c %}
>
> ```cpp
> /***************************************************************************
>  * File: esp8266.c
>  * Author: Luckys.
>  * Date: 2023/06/30
>  * description: ESP8266底层
> ****************************************************************************/
> #include "AllHead.h"
> 
> /*====================================static function declaration area BEGIN====================================*/
> 
> static void ESP8266_Init(void);
> static uint8_t ESP8266_Send_Cmd(char *cmd, char *ack, uint16_t waittime);
> static uint8_t *ESP8266_Check_Cmd(uint8_t *str);
> static uint8_t ESP8266_Connect_IOTServer(void);
> static uint8_t ESP8266_Quit_Trans(void);
> static uint8_t ESP8266_Connect_Server(void);
> static uint8_t ESP8266_Connect_AP(void);
> static void ESP8266_Send_Heart(void);
> 
> /*====================================static function declaration area   END====================================*/
> ESP8266_t ESP8266 = 
> {
> 	FALSE,
> 	ESP8266_Init,
> 	ESP8266_Send_Cmd,
> 	ESP8266_Check_Cmd,
> 	ESP8266_Connect_IOTServer,
> 	ESP8266_Quit_Trans,
> 	ESP8266_Connect_Server,
> 	ESP8266_Connect_AP,
> 	ESP8266_Send_Heart
> };
> 
> 
> /*
> * @function: ESP8266_Init
> * @param: None
> * @retval: None
> * @brief: ESP8266初始化
> */
> static void ESP8266_Init(void)
> {
> 	uint8_t rx_error_num;
> 
> 	rx_error_num = ESP8266.ESP8266_Connect_IOTServer();
> 
> 	if (0 == rx_error_num)
> 	{
> 		while (IOT.IOT_Connect());
> 		ESP8266.Connect_Server_Flag = TRUE;	// 标志位置1(心跳包才开始发送)
> 		printf("连接服务器成功!\r\n");
> 		HAL_Delay(100);
> 		IOT.IOT_Subscribe();
> 	}
> 	else
> 	{
> 		printf("WiFi错误,错误码:%d!\r\n", rx_error_num);
> 	}
> }
> 
> /*
> * @function: ESP8266_Send_Cmd
> * @param: cmd -> 命令 ack -> 回应值  waittime -> 等待时间
> * @retval: 0 --- 成功 1 --- 失败
> * @brief: ESP8266发送指令（底层函数）
> */
> static uint8_t ESP8266_Send_Cmd(char *cmd, char *ack, uint16_t waittime)
> {
> 	uint8_t res = 0;
> 	USART3_RX_STA = 0;
> 	
> 	memset(USART3_RX_BUF, 0, USART3_REC_LEN); // 将串口3的缓存空间清0
> 	WIFI_printf("%s\r\n", cmd);				  // 调用WIFI模块专用的发送函数
> 	if (waittime)							  // 需要等待应答
> 	{
> 		while (--waittime) // 等待倒计时
> 		{
> 			Public.Public_Delay_ms(10);
> 			if (USART3_RX_STA & 0x8000) // 接收到期待的应答结果
> 			{
> 				if (ESP8266_Check_Cmd((uint8_t *)ack))
> 				{
> 					printf("回复信息:%s\r\n", (uint8_t *)ack); // 反馈应答信息
> 					break;									   // 得到有效数据
> 				}
> 				USART3_RX_STA = 0; // 串口3标志位清0
> 			}
> 		}
> 		if (waittime == 0)
> 			res = 1;
> 	}
> 	return res;
> }
> 
> /*
> * @function: ESP8266_Check_Cmd
> * @param: str -> 需要寻找的子串字符串 
> * @retval: 非0 -> 返回子串找到的位置 0 -> 没找到
> * @brief: ESP8266检查指令（底层函数）
> */
> static uint8_t *ESP8266_Check_Cmd(uint8_t *str)
> {
> 	char *strx = 0;
> 
> 	if (USART3_RX_STA & 0X8000) // 接收到一次数据了
> 	{
> 		USART3_RX_BUF[USART3_RX_STA & 0X7FFF] = 0; // 添加结束符
> 		printf("%s\r\n", (char *)USART3_RX_BUF);
> 		strx = strstr((const char *)USART3_RX_BUF, (const char *)str);
> 	}
> 	return (uint8_t *)strx;
> }
> 
> /*
> * @function: ESP8266_Quit_Trans
> * @param: None
> * @retval: 0 --- 成功 1 --- 失败
> * @brief: ESP8266退出透传模式（底层函数）
> */
> static uint8_t ESP8266_Quit_Trans(void)
> {
> 	while ((USART3->SR & 0X40) == 0); // 等待发送空
> 	USART3->DR = '+';
> 	HAL_Delay(15); // 大于串口组帧时间(10ms)
> 	while ((USART3->SR & 0X40) == 0); // 等待发送空
> 	USART3->DR = '+';
> 	HAL_Delay(15); // 大于串口组帧时间(10ms)
> 	while ((USART3->SR & 0X40) == 0); // 等待发送空
> 	USART3->DR = '+';
> 	Public.Public_Delay_ms(500);					
> 	return ESP8266_Send_Cmd("AT", "OK", 20); // 退出透传判断
> }
> 
> /*
> * @function: ESP8266_Connect_IOTServer
> * @param: None
> * @retval: 0 --- 成功 1 --- 失败
> * @brief: ESP8266连接到物联网平台服务器
> */
> static uint8_t ESP8266_Connect_IOTServer(void)
> {
> 	/*状态检测*/
> 	// 【1】
> 	printf("准备配置模块\r\n");
> 	Public.Public_Delay_ms(100);
> 	ESP8266_Send_Cmd("AT", "OK", 50);
> 	// 【2】
> 	printf("准备退出透传模式\n");
> 	if (ESP8266_Quit_Trans())
> 	{
> 		printf("退出透传模式失败，准备重启\r\n");
> 		return 6;
> 	}
> 	else
> 		printf("退出透传模式成功\r\n");
> 	// 【3】
> 	printf("准备关闭回显\r\n");
> 	if (ESP8266_Send_Cmd("ATE0", "OK", 50))
> 	{
> 		printf("关闭回显失败准备重启\r\n");
> 		return 1;
> 	}
> 	else
> 		printf("关闭回显成功\r\n");
> 	// 【4】
> 	printf("查询模块是否在线\r\n");
> 	if (ESP8266_Send_Cmd("AT", "OK", 50))
> 	{
> 		printf("模块不在线准备重启\r\n");
> 		return 1;
> 	}
> 	else
> 		printf("设置查询在线成功\r\n");
> 	// 【5】
> 	printf("准备设置STA模式\r\n");
> 	if (ESP8266_Send_Cmd("AT+CWMODE=1", "OK", 50))
> 	{
> 		printf("设置STA模式失败准备重启\r\n");
> 		return 1;
> 	}
> 	else
> 		printf("设置STA模式成功\r\n");
> 	// 【6】
> 	printf("准备重启\r\n");
> 	if (ESP8266_Send_Cmd("AT+RST", "OK", 50))
> 	{
> 		printf("重启失败，准备重启\r\n");
> 		return 2;
> 	}
> 	else
> 		printf("重启成功，等待三秒\r\n");
> 	Public.Public_Delay_ms(3000);
> 	// 【7】
> 	printf("准备取消自动连接\r\n");
> 	if (ESP8266_Send_Cmd("AT+CWAUTOCONN=0", "OK", 50))
> 	{
> 		printf("取消自动连接失败，准备重启\r\n");
> 		return 3;
> 	}
> 	else
> 		printf("取消自动连接成功\r\n");
> 	// 【8】
> 	printf("准备链接路由器\r\n");
> 	if (ESP8266_Connect_AP())
> 	{
> 		printf("连接路由器失败,热点没找到\r\n");
> 		return 4;
> 	}
> 	else
> 		printf("连接路由器成功\r\n");
> 	Public.Public_Delay_ms(4000);
> 	// 【9】
> 	printf("准备开启DHCP\r\n");
> 	if (ESP8266_Send_Cmd("AT+CWDHCP=1,1", "OK", 100))
> 	{
> 		printf("开启DHCP失败，准备重启\r\n");
> 		return 7;
> 	}
> 	else
> 		printf("设置DHCP成功\r\n");
> 	// 【10】	
> 	printf("设置为关闭多路连接\r\n");
> 	if (ESP8266_Send_Cmd("AT+CIPMUX=0", "OK", 100))
> 	{
> 		printf("关闭多路连接失败，准备重启\r\n");
> 		return 7;
> 	}
> 	else
> 		printf("设置关闭多路连接成功\r\n");
> 	// 【11】
> 	printf("准备链接服务器\r\n");
> 	if (ESP8266_Connect_Server())
> 	{
> 		printf("连接服务器失败，等待重启\r\n");
> 		return 8;
> 	}
> 	else
> 		printf("连接服务器成功\r\n");
> 	// 【12】	
> 	printf("准备退出透传模式\n");
> 	if (ESP8266_Quit_Trans())
> 	{
> 		printf("退出透传模式失败，准备重启\r\n");
> 		return 6;
> 	}
> 	else
> 		printf("退出透传模式成功\r\n");
> 	// 【13】
> 	printf("设置为透传模式\r\n");
> 	if (ESP8266_Send_Cmd("AT+CIPMODE=1", "OK", 50))
> 	{
> 		printf("设置透传失败，准备重启\r\n");
> 		return 6;
> 	}
> 	else
> 		printf("设置透传成功\r\n");
> 	// 【14】
> 	printf("设置开启透传模式\r\n");
> 	if (ESP8266_Send_Cmd("AT+CIPSEND", "OK", 1000))
> 	{
> 		printf("开启透传失败，准备重启\r\n");
> 		return 9;
> 	}
> 	else
> 		printf("开启透传成功\r\n");
> 
> 	USART3_RX_STA = 0;
> 	Public.Memory_Clear(USART3_RX_BUF,USART3_REC_LEN);
> 	return 0; // 一切顺利返回0
> }
> 
> /*
> * @function: ESP8266_Connect_AP
> * @param: None
> * @retval: 0 -> 成功 1 -> 失败
> * @brief: ESP8266连接AP设备（无线路由器）
> */
> static uint8_t ESP8266_Connect_AP(void)
> {
> 	uint8_t i = 5;
> 	char *p = (char *)malloc(50); // 分配存储空间的指针
> 
> 	sprintf((char *)p, "AT+CWJAP=\"%s\",\"%s\"", SSID, PASS); // 发送连接AT指令
> 	while (ESP8266_Send_Cmd(p, "WIFI GOT IP", 500) && i)	  // 循环判断等待连接AP的结果
> 	{
> 		printf("链接AP失败，尝试重新连接\r\n"); // 连接失败的反馈信息
> 		i--;
> 	}
> 	free(p); // 释放分配的空间和指针
> 	if (i)
> 		return 0;
> 	else
> 		return 1;
> }
> 
> /*
> * @function: ESP8266_Connect_Server
> * @param: None
> * @retval: 0 -> 成功 1 -> 失败
> * @brief: ESP8266连接到服务器
> */
> static uint8_t ESP8266_Connect_Server(void)
> {
> 	uint8_t i = 10;
> 	char *p = (char *)malloc(50); // 分配存储空间的指针
> 	sprintf((char *)p, "AT+CIPSTART=\"TCP\",\"%s\",\%s", IOT_DOMAIN_NAME, IOT_PORTNUM);
> 	while (ESP8266_Send_Cmd(p, "CONNECT", 1000) && i)
> 	{
> 		printf("链接服务器失败，尝试重新连接\r\n");
> 		i--;
> 	}
> 	free(p); // 释放分配的空间和指针
> 	if (i)
> 		return 0;
> 	else
> 		return 1;
> }
> 
> /*
> * @function: ESP8266_Send_Heart
> * @param: None
> * @retval: None
> * @brief: 发送心跳包
> */
> static void ESP8266_Send_Heart(void)
> {
> 	static uint8_t send_Cnt; // 记录连续发送心跳包失败的数量
> 	uint8_t i;
> 
> 	if (ESP8266.Connect_Server_Flag)
> 	{
> 		IOT.IOT_Ping();														 // 发送Ping心跳包
> 		if (MQTTPacket_read(IOT.Buf, IOT.Buflen, transport_getdata) == PINGRESP) // 判断心跳包是不回复确认
> 		{
> 			printf("心跳成功\r\n"); // 回复0xD0，0x00时表示心跳成功的回复
> 			send_Cnt = 0;
> 		}
> 		else
> 		{
> 			send_Cnt++;
> 			printf("心跳失败\r\n"); // 无回复表示失败
> 			for (i = 0; i < 30; i++)
> 			{
> 				IOT.IOT_Ping();
> 				if (MQTTPacket_read(IOT.Buf, IOT.Buflen, transport_getdata) == PINGRESP) // 判断心跳包是不回复确认
> 				{
> 					printf("心跳成功\r\n"); // 回复0xD0，0x00时表示心跳成功的回复
> 					send_Cnt = 0;
> 					break;
> 				}
> 			}
> 		}
> 		if (send_Cnt != 0) // 如果快速发送心跳包20次后无回复，则复位WIFI模块重新连接
> 		{
> 			while (ESP8266.ESP8266_Connect_IOTServer()); // AT指令连接TCP连接云服务器（IP和端口参数在esp8266.h文件内修改设置）
> 			while (IOT.IOT_Connect());		  // 用MQTT协议+三元组信息连接阿里云物联网平台（三元组参数在iot.h文件内修改设置）
> 			send_Cnt = 0; // 计算标志清0
> 		}
> 		USART3_RX_STA = 0; // 串口3接收标志位清0		
> 	}
> }
> 
> 
> 
> ```
>
> {% endfolding %}
>
> {% note red 'fas fa-fan' flat %}iot文件夹{% endnote %}
>
> {% folding, iot.h %}
>
> ```cpp
> #ifndef __IOT_H
> #define __IOT_H
> 
> //【三元组信息】在下方修改设置您的物联网云平台提供的三元组信息
> #define  PRODUCTKEY           "ikjyg0aBLnO" // 产品ID（ProductKey）【必须按您的实际情况修改】
> #define  PRODUCTKEY_LEN       strlen(PRODUCTKEY) // 产品ID长度
> #define  DEVICENAME			 "ESP8266" // 设备名（DeviceName）【必须按您的实际情况修改】
> #define  DEVICENAME_LEN       strlen(DEVICENAME) // 设备名长度
> #define  DEVICESECRE          "ddca5d04d49afc1d4ed6effe579d73a3" // 设备秘钥（DeviceSecret）【必须按您的实际情况修改】
> #define  DEVICESECRE_LEN      strlen(DEVICESECRE) // 设备秘钥长度
> 
> #define  TOPIC_SUBSCRIBE		"/ikjyg0aBLnO/ESP8266/user/get" // 订阅权限的地址【必须按您的实际情况修改】
> #define  TOPIC_QOS				0  // QoS服务质量数值（0/1）
> #define  MSGID					1  // 信息识别ID
> 
> #define  TOPIC_PUBLISH			"/ikjyg0aBLnO/ESP8266/user/update/error" // 发布权限的地址【必须按您的实际情况修改】
> 
> #define  MQTTVERSION			4 // MQTT协议版本号（3表示V3.1，4表示V3.1.1）
> #define  KEEPALIVEINTERVAL		120 // 保活计时器，服务器收到客户端消息（含心跳包）的最大间隔（单位是秒）
> 
> 
> typedef struct
> {
>     uint16_t Buflen;
>     uint8_t Buf[200];
>     char ClientID[128];
>     char Username[128];
>     char Password[128];
>     uint8_t (*IOT_Connect)(void);   // IOT物联网平台连接
>     void (*IOT_Ping)(void); // 发送心跳包PING（保持与云服务器的连接）
>     uint8_t (*IOT_Subscribe)(void);    // subscribe主题订阅（订阅成功后才能接收订阅消息）
>     uint8_t (*IOT_Publish)(char*);  // publish主题发布（参数是发布信息内容，用双引号包含）
> }IOT_t;
> 
> 
> extern IOT_t IOT;
> 
> #endif
> 
> ```
>
> {% endfolding %}
>
> {% folding, iot.c %}
>
> ```cpp
> /***************************************************************************
>  * File: iot.c
>  * Author: Luckys.
>  * Date: 2023/06/30
>  * description: 开发板ESP8266应用层
> ****************************************************************************/
> #include "AllHead.h"
> 
> /*====================================static function declaration area BEGIN====================================*/
> 
> static uint8_t IOT_Connect(void);
> static void IOT_Ping(void);
> static uint8_t IOT_Subscribe(void);
> static uint8_t IOT_Publish(char*);
> 
> /*====================================static function declaration area   END====================================*/
> IOT_t IOT = 
> {
> 	200,
> 	{0},
> 	{0},
> 	{0},
> 	{0},
> 	IOT_Connect,
> 	IOT_Ping,
> 	IOT_Subscribe,
> 	IOT_Publish
> };
> 
> 
> /*
> * @function: IOT_Connect
> * @param: None
> * @retval: None
> * @brief: IOT物联网平台连接
> */
> static uint8_t IOT_Connect(void)
> {
> 	uint16_t a;
> 	uint32_t len;
> 	char temp[128];
> 
> 	printf("开始连接云端服务器\r\n");
> 	MQTTPacket_connectData data = MQTTPacket_connectData_initializer;//配置部分可变头部的值
> 	IOT.Buflen = sizeof(IOT.Buf);
> 	memset(IOT.Buf,0,IOT.Buflen);
> 	memset(IOT.ClientID,0,128);//客户端ID的缓冲区全部清零
> 	sprintf(IOT.ClientID,"%s|securemode=3,signmethod=hmacsha1|",DEVICENAME);//构建客户端ID，并存入缓冲区
> 	memset(IOT.Username,0,128);//用户名的缓冲区全部清零
> 	sprintf(IOT.Username,"%s&%s",DEVICENAME,PRODUCTKEY);//构建用户名，并存入缓冲区
> 
> 	// Username_len = strlen(IOT.Username);
> 
> 	memset(temp,0,128);//临时缓冲区全部清零
> 	sprintf(temp,"clientId%sdeviceName%sproductKey%s",DEVICENAME,DEVICENAME,PRODUCTKEY);//构建加密时的明文
> 	utils_hmac_sha1(temp,strlen(temp),IOT.Password,DEVICESECRE,DEVICESECRE_LEN);//以DeviceSecret为秘钥对temp中的明文，进行hmacsha1加密，结果就是密码，并保存到缓冲区中
> 	// Password_len = strlen(IOT.Password);//计算用户名的长度
> 
> 	printf("ClientId:%s\r\n",IOT.ClientID);
> 	printf("Username:%s\r\n",IOT.Username);
> 	printf("Password:%s\r\n",IOT.Password);
> 
> 	//【重要参数设置】可修改版本号、保活时间
> 	data.MQTTVersion = MQTTVERSION; //MQTT协议版本号
> 	data.clientID.cstring = IOT.ClientID; //客户端标识，用于区分每个客户端xxx为自定义，后面为固定格式
> 	data.keepAliveInterval = KEEPALIVEINTERVAL; //保活计时器，定义了服务器收到客户端消息的最大时间间隔,单位是秒
> 	data.cleansession = 1; //该标志置1服务器必须丢弃之前保持的客户端的信息，将该连接视为“不存在”
> 	data.username.cstring = IOT.Username; //用户名 DeviceName&ProductKey
> 	data.password.cstring = IOT.Password; //密码，工具生成
> 	
> 	len = MQTTSerialize_connect(IOT.Buf, IOT.Buflen, &data);//构造连接的报文
> 	transport_sendPacketBuffer(0,IOT.Buf, len);//发送连接请求
> 
> 	unsigned char sessionPresent, connack_rc;
> 	a=0;
> 	while(MQTTPacket_read(IOT.Buf, IOT.Buflen, transport_getdata) != CONNACK || a>1000)//等待胳回复
> 	{
> 		HAL_Delay(10);//必要的延时等待
> 		a++;//超时计数加1
> 	}
> 	if(a>1000)NVIC_SystemReset();//当计数超时，则复位单片机
> 
> 	while(MQTTDeserialize_connack(&sessionPresent, &connack_rc, IOT.Buf, IOT.Buflen) != 1 || connack_rc != 0);
> 	if(connack_rc != 0)
> 	{
> 		printf("连接回复:%uc\r\n",connack_rc);
> 	}
> 	printf("连接成功!\r\n");
> 	return 0;//执行成功返回0
> }
> 
> /*
> * @function: IOT_Ping
> * @param: None
> * @retval: None
> * @brief: 发送心跳包PING（保持与云服务器的连接）
> */
> static void IOT_Ping(void)
> {
> 	uint32_t len;
> 
> 	len = MQTTSerialize_pingreq(IOT.Buf, IOT.Buflen); // 计算数据长度
> 	transport_sendPacketBuffer(0, IOT.Buf, len);  // 发送数据
> 	HAL_Delay(200);							  // 必要的延时等待
> 	printf("发送心跳包Ping... ");
> }
> 
> /*
> * @function: IOT_Subscribe
> * @param: None
> * @retval: 0 -> 成功 1 -> 失败
> * @brief: subscribe主题订阅（订阅成功后才能接收订阅消息）
> */
> static uint8_t IOT_Subscribe(void)
> {
> 	uint32_t len;
> 	int req_qos = TOPIC_QOS;
> 
> 	MQTTString topicString = MQTTString_initializer; // 定义Topic结构体并初始化
> 	topicString.cstring = TOPIC_SUBSCRIBE;
> 	len = MQTTSerialize_subscribe(IOT.Buf, IOT.Buflen, 0, MSGID, 1, &topicString, &req_qos); // 订阅发送数据编码
> 	transport_sendPacketBuffer(0, IOT.Buf, len);
> 	HAL_Delay(100);												   // 必要的延时等待
> 	if (MQTTPacket_read(IOT.Buf, IOT.Buflen, transport_getdata) == SUBACK) // 等待订阅回复
> 	{
> 		unsigned short submsgid;
> 		int subcount;
> 		int granted_qos;
> 		MQTTDeserialize_suback(&submsgid, 1, &subcount, &granted_qos, IOT.Buf, IOT.Buflen); // 回复的订阅确认数据解码
> 		if (granted_qos != 0)														// qos不为0表示订阅成功
> 		{
> 			printf("订阅成功 GrantedQoS=%d\r\n", granted_qos);
> 			return 0; // 订阅成功
> 		}
> 	}
> 	printf("订阅失败\r\n");
> 	return 1; // 订阅失败
> }
> 
> /*
> * @function: IOT_Publish
> * @param: None
> * @retval: 
> * @brief: publish主题发布（参数是发布信息内容，用双引号包含）
> */
> static uint8_t IOT_Publish(char* payload)
> {
> 	uint32_t len;
> 
> 	MQTTString topicString = MQTTString_initializer; // 定义Topic结构体并初始化
> 	topicString.cstring = TOPIC_PUBLISH;
> 	int payloadlen = strlen(payload); // 用函数计算发布信息内容的长度
> 	printf("发布信息：%.*s\r\n", payloadlen, payload);
> 	// 将要发送的信息payload通过MQTTSerialize_publish编码后用transport_sendPacketBuffer发送给云服务器
> 	len = MQTTSerialize_publish(IOT.Buf, IOT.Buflen, 0, 0, 0, 0, topicString,
> 								(unsigned char *)payload, payloadlen); // 发布数据编码
> 	transport_sendPacketBuffer(0, IOT.Buf, len);						   // 发送编码好的最终数据
> 	HAL_Delay(100);													   // 必要的延时等待
> 	return 1;
> }
> 
> ```
>
> {% endfolding %}
>
> {% note red 'fas fa-fan' flat %}mqtt文件夹{% endnote %}
>
> {% folding, transport.h %}
>
> ```cpp
> #ifndef _TRAN_S
> #define _TRAN_S
> int transport_sendPacketBuffer(int sock, unsigned char* buf, int buflen);
> int transport_getdata(unsigned char* buf, int count);
> int transport_getdatanb(void *sck, unsigned char* buf, int count);
> int transport_open(char* host, int port);
> int transport_close(int sock);
> 
> #endif
> ```
>
> {% endfolding %}
>
> {% folding, transport.c %}
>
> ```cpp
> /***************************************************************************
>  * File: transport.c
>  * Author: Luckys.
>  * Date: 2023/06/30
>  * description: 传输层
>  -----------------------------------
> 注意：
> 	这个只需要把下面的串口换成当前WiFi模块的串口即可
>  -----------------------------------
> ****************************************************************************/
> #include "AllHead.h"
> 
> #if !defined(SOCKET_ERROR)
> 	/** error in socket operation */
> 	#define SOCKET_ERROR -1
> #endif
> 
> int transport_sendPacketBuffer(int sock, unsigned char* buf, int buflen)
> {
> 	USART3_RX_STA = 0;
> 	Public.Memory_Clear(USART3_RX_BUF, USART3_REC_LEN);
> 	HAL_UART_Transmit(&huart3, buf, buflen, 1000); // 调用串口3发送HAL库函数
> 	return buflen;
> }
> 
> int transport_getdata(unsigned char* buf, int count)
> {
> 	memcpy(buf, (const char *)USART3_RX_BUF, count);
> 	USART3_RX_STA = 0;						  // 接收标志位清0
> 	Public.Memory_Clear(USART3_RX_BUF, USART3_REC_LEN);	// 缓存清0
> 	return count;
> }
> 
> int transport_getdatanb(void *sck, unsigned char* buf, int count)
> {
> 	return 0;
> }
> 
> /**
> return >=0 for a socket descriptor, <0 for an error code
> @todo Basically moved from the sample without changes, should accomodate same usage for 'sock' for clarity,
> removing indirections
> */
> int transport_open(char* addr, int port)
> {
> 	return 0;
> }
> 
> int transport_close(int sock)
> {
> 	return 0;
> }
> 
> ```
>
> {% endfolding %}
>
> `注意`：其余文件在工程里找

- 我的程序

> 心跳的话放任务里即可，10s发送一次

```cpp
static void TasksHandle_10S(void)
{
    ESP8266.ESP8266_Send_Heart();
}
```

> 初始化，定时器是接收所需要的，打开串口3接收，ESP8266初始化

```cpp
HAL_TIM_Base_Start_IT(&htim6);
HAL_UART_Receive_IT(&huart3,(uint8_t*)&USART3_NewData,1);
ESP8266.ESP8266_Init();
```

> 定时器6中断回调

```cpp
void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim) // 定时器中断回调函数
{
	if (htim == &htim6) // 判断是否是定时器2中断（定时器到时表示一组字符串接收结束）
	{
		USART3_RX_BUF[USART3_RX_STA & 0X7FFF] = 0;			  // 添加结束符
		USART3_RX_STA |= 0x8000;							  // 接收标志位最高位置1表示接收完成
		__HAL_TIM_CLEAR_FLAG(&htim6, TIM_EVENTSOURCE_UPDATE); // 清除TIM2更新中断标志
		__HAL_TIM_DISABLE(&htim6);							  // 关闭定时器2
	}
	if (htim == &htim7)
	{
		System.Task_Marks_Handler();
	}
}
```

> 串口3相关

{% folding, UART3.h %}

```cpp
#ifndef __USART3_H_
#define __USART3_H_
#include "AllHead.h"

#define USART3_REC_LEN  200 // 定义USART1最大接收字节数

typedef struct
{
    uint8_t USART3_RX_BUF[USART3_REC_LEN];  // 接收缓冲,最大USART_REC_LEN个字节
    uint16_t USART3_RX_STA; // 接收状态标记(bit15：接收完成标志，bit14：接收到0x0d，bit13~0：接收到的有效字节数目)
    uint8_t USART3_NewData; // 当前串口中断接收的1个字节数据的缓存
    void (*WIFI_printf)(char *, ...);   // WIFI模块通信，使用UART3，这是专用的printf函数
    void (*WIFI_TCP_SEND)(char *, ...); // WIFI模块在TCP模式下的数据发送：TCP发送的规定是先发AT+CIPSEND=数量，等待返回“>“后再发送数据内容
}UART3_t;

extern UART3_t UART3;

#endif
```

{% endfolding %}

{% folding, UART3.c %}

```cpp
/***************************************************************************
 * File: UART3.c
 * Author: Luckys.
 * Date: 2023/06/30
 * description: 串口3
****************************************************************************/
#include "AllHead.h"

/*====================================static function declaration area BEGIN====================================*/

static void WIFI_printf(char *, ...);
static void WIFI_TCP_SEND(char *, ...);

/*====================================static function declaration area   END====================================*/

UART3_t UART3 = 
{
	{0},
	0,
	0,
	WIFI_printf,
	WIFI_TCP_SEND
};

/*
* @function: HAL_UART_RxCpltCallback
* @param: None
* @retval: None
* @brief: 串口接收中断回调函数
*/
void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart)
{
	if (huart == &huart3) // 接收完的一批数据,还没有被处理,则不再接收其他数据
	{
		if (UART3.USART3_RX_STA < USART3_REC_LEN) // 还可以接收数据
		{
			__HAL_TIM_SET_COUNTER(&htim6, 0); // 计数器清空
			if (0 == UART3.USART3_RX_STA)			  // 使能定时器2的中断
			{
				__HAL_TIM_ENABLE(&htim6); // 使能定时器2
			}
			UART3.USART3_RX_BUF[UART3.USART3_RX_STA++] = UART3.USART3_NewData; // 最新接收数据放入数组
		}
		else
		{
			UART3.USART3_RX_STA |= 0x8000; // 强制标记接收完成
		}

		HAL_UART_Receive_IT(&huart3, (uint8_t *)&UART3.USART3_NewData, 1); // 再开启串口3接收中断
	}
}

/*
* @function: WIFI_printf
* @param: None
* @retval: None
* @brief: WIFI模块通信，使用UART3，这是专用的printf函数
*/
static void WIFI_printf(char *fmt, ...)
{
	char buff[USART3_REC_LEN + 1]; // 用于存放转换后的数据 [长度]
	uint16_t i = 0;
	va_list arg_ptr;

	va_start(arg_ptr, fmt);
	vsnprintf(buff, USART3_REC_LEN + 1, fmt, arg_ptr); // 数据转换
	i = strlen(buff);								   // 得出数据长度
	if (strlen(buff) > USART3_REC_LEN)
		i = USART3_REC_LEN;									// 如果长度大于最大值，则长度等于最大值（多出部分忽略）
	HAL_UART_Transmit(&huart3, (uint8_t *)buff, i, 0xffff); // 串口发送函数（串口号，内容，数量，溢出时间）
	va_end(arg_ptr);
}

/*
* @function: WIFI_TCP_SEND
* @param: None
* @retval: None
* @brief: WIFI模块在TCP模式下的数据发送：TCP发送的规定是先发AT+CIPSEND=数量，等待返回“>“后再发送数据内容。
*/
static void WIFI_TCP_SEND(char *fmt, ...)
{
	char buff[USART3_REC_LEN + 1]; // 用于存放转换后的数据 [长度]
	uint16_t i = 0;
	va_list arg_ptr;

	va_start(arg_ptr, fmt);
	vsnprintf(buff, USART3_REC_LEN + 1, fmt, arg_ptr); // 数据转换
	i = strlen(buff);								   // 得出数据长度
	if (strlen(buff) > USART3_REC_LEN)
		i = USART3_REC_LEN;									// 如果长度大于最大值，则长度等于最大值（多出部分忽略）
	UART3.WIFI_printf("AT+CIPSEND=%d\r\n", i);					// 先发送AT指令和数据数量
	HAL_Delay(100);											// 毫秒延时等待WIFI模块返回">"，此处没做返回是不是">"的判断。稳定性要求高的项目要另加判断。
	HAL_UART_Transmit(&huart3, (uint8_t *)buff, i, 0xffff); // 发送数据内容（串口号，内容，数量，溢出时间）
	va_end(arg_ptr);
}

```

{% endfolding %}



{% note blue 'fas fa-fan' flat %}实验现象{% endnote %}

> 通过阿里云发布消息，单片机会收到
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ%E6%88%AA%E5%9B%BE20230630162909.webp)

> 单片机发布消息，阿里云会收到
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ%E6%88%AA%E5%9B%BE20230630162928.webp)



- 上传温湿度/其他状态 到阿里云

1. 首先在阿里云【设备】那创建自定义功能，这里示例创建一个温度，一个开关， `标识符` 唯一的每一个设备，不能中文，创建完点击发布即可

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ%E6%88%AA%E5%9B%BE20230630205249.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ%E6%88%AA%E5%9B%BE20230630205129.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ%E6%88%AA%E5%9B%BE20230630205320.webp)

{% endgallery %}

2. 然后我们需要上传则需要去看上传的头，这两个，一个是上报对应温度一个是设置对应按钮，把这个头复制到程序里即可

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230630222741.webp)

3. 调试，查看格式，需要设备在线才能调试，可以先使用 MQTT.fx连接阿里云先，然后在阿里云里进行调试即可，然后可以把获得的格式复制到MQTT.fx进行测试，改一下数值发送看看，这个格式就是单片机发送的格式我们需要复制到单片机即

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230630223311.webp)

> 单独设置，这样的消息格式则只有温度，开关则不在里面

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230630223459.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230630224132.webp)

> 也可以自由组合，像这样的话，则温度和湿度一起组合，格式就不一样了，id也不一样这个需要注意，得到这个格式就可以像之前那样去MQTT.fx进行粘贴调试看看效果，然后再粘贴到单片机程序里

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230630231101.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230630231342.webp)



{% note blue 'fas fa-fan' flat %}实验现象{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230630232305.webp)



- 上传温湿度/其他状态 到阿里云，且手机APP也能同时收到

> 这个需要创建两个设备，一个是单片机连接用，一个是手机APP连接用，然后手机端订阅主题，单片机负责发送数据到模型显示和发送主题那，这样就实现了模型那会显示数据，手机APP也能同时显示【在上面的基础上搞，已经存在一个名为【ESP8266】的设备了
>
> 用产品里的自定义Topic，其中的发布类Topic来发布数据，用订阅类Topic来订阅数据，来进行多个设备之间的数据的传递
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230701130501.webp)

1. 创建第二个设备【my_app】，然后推荐使用 `技小新-MQTT单片机编程小工具`，直接把三元组复制到那生成即可

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230701125412.webp)

2. 安卓程序里修改，主要修改这几个，然后下面那个是数据的接收处理，看实际情况修改即可，host那需要注意前面必须要有 `tcp://`，不能去掉，不然连接不上阿里云！，只需要替换它后面部分即可，订阅主题那写 `get`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230701125629.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230701125648.webp)

3. 开通一个云产品流转服务，按要求设置，注意要选 【get】，操作那如果不止2个设备可以多加几个设备，最后开启服务即可

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230701130741.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230701130810.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230701130853.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230701130937.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230701131010.webp)

{% endgallery %}

4. 单片机程序

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230701131528.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230701131538.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230701131552.webp)







{% note blue 'fas fa-fan' flat %}连接巴法云{% endnote %}

> 1. 前往 [巴法云](https://cloud.bemfa.com/)注册，新建主题即可

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230628124042.webp)

> 2. 打开 MQTT.fx，配置文件填写信息，TLS/SSL 那不要勾，Use Username/Password那也不需要勾

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230628130018.webp)

> 3. 连接，订阅主题即可

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230628135809.webp)

- 程序编写

待加