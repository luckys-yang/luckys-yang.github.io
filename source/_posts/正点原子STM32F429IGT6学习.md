---
title: 正点原子STM32F429IGT6学习
cover: /img/num105.webp
comments: false
categories:
  - 32系列
abbrlink: e7143ef5
date: 2022-11-04 16:55:00
updated: 2022-11-18 10:17:48
---



## 前言

今天师兄给了一块正点原子的 STM32F4系列的板子我学习，这板挺贵的，肯定得学呀！写下此笔记记录...

本笔记涉及到网址及博主文章：

CubeMX官方下载地址：https://www.st.com/zh/development-tools/stm32cubemx.html

[ST官网—STM32F429IG资料](https://www.st.com/content/st_com/zh/products/microcontrollers-microprocessors/stm32-32-bit-arm-cortex-mcus/stm32-high-performance-mcus/stm32f4-series/stm32f429-439/stm32f429ig.html)

[硬汉嵌入式论坛](https://www.armbbs.cn/forum.php?mod=viewthread&tid=93255)

[STM32 ST-LINK Utility下载网址](https://www.st.com/en/development-tools/stsw-link004.html#)

参考博主文章：
https://blog.csdn.net/as480133937/article/details/99935090



## 板子介绍

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221104230848.jpg)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221104230946.jpg)

-  `256KB SRAM`、 `1024KB FLASH` 、 `12个16位定时器` 、 `2个32位定时器` 、 `2个DMA控制器`（共16个通道）、 `6个SPI` 、 `2个全双工I2S` 、 `1个SAI` 、 `3个IIC` 、 `8个串口` 、 `2个USB` （支持HOST /SLAVE）、 `2个CAN` 、 `3个12位ADC` 、 `2个12位DAC` 、 `1个RTC` （带日历功能）、 `1个SDIO接口` 、 `1个FMC接口` 、 `1个TFTLCD控制器` （LTDC）、 `1个10/100M以太网MAC控制器` 、 `1个摄像头接口` 、 `1个硬件随机数生成器` 、以及 `140个通用IO口` 等
- 最高频率是  `180MHz`
- 时钟挂载的外设见《stm32f429ig数据手册》18页



## STM32CubeMx创建工程

`File` --- 等待进度条(在下载一下东西) --- 在`Part Number`输入芯片型号(或者旁边滑动查看) --- 选择 `STM32F429IGTx`，双击

###  下载调试

数据线+FlyMcu(速度慢，烧一次需要等几十秒)

- 数据线连接 `USB 232` 那个口，打开 FlyMcu 软件，设置一下： `DTR的低电平复位，RTS高电平进BootLoader`(一键下载功能)，`编译后执行`，`编译前重装文件`，`波特率76800`

- ST-LINK(SW模式，速度快，可以调试)


## CubeMx配置汇总

###  调试方式配置

CubeMX里 --- `sys` --- 选择《serial Write》

 `Project Manager` --- `Code Generator` --- `Generated files`(勾第一个，即生成独立的.c/.h)

`Project` --- `name`(输入文件名) ---`Location`(文件保存的路径，不要有中文) --- `IDE`(选择MDK) --- `Min Version` 选择 `V5.27`

点击右上角`GENERATE CODE` 生成代码(如果弹窗警告需要下载某些库则点是即可) --- 下完后会出现3个选项(选择《Open Project》) --- 跳转到keil后会弹出需要下载F4软件包完成后编译一下0错误0警告即可

`魔法棒` --- `Debug`选择《ST-Link》,勾《Run to main()》,点击 `setting` --- `port`选择《SW》

`魔法棒` --- `Utilities` 勾《Use Debug Driver》，点击 `setting`---里面会看到一个1M的F4系列软件包，勾《Reset and Run》

`魔法棒` --- `C/C++` --- `Define`填写《USE_HAL_DRIVER,STM32F429xx》，可在stm32f4xx.h `99,140` 行找到



###  配置系统时钟和系统最高频率配置

`RCC` ---选择外部高速时钟《Crystal/Ceramic Resonator》

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221105004458.jpg)

系统时钟配置分为6个步骤：① 时钟源参数设置(4~26范围)选择HSE为时钟源，所以必须在RCC配置中开启HSE；② 时钟源选择：HSE还是HSI，这里我们配置选择器选择HSE即可；③ PLL分频系数M配置，分频系数M我们设置为15； ④ 主PLL倍频系数N配置，倍频系数N我们设置为216；⑤ 主PLL分频系数P配置，分频系数P我们配置为2；(216/2=180) ⑥ 系统时钟时钟源选择：PLL,HSI还是HSE，这里毫无疑问，我们选择PLL

###  LED配置

- 管脚图配置：


| 对应原理图网络标号 | 对应原理图管脚 |     选择功能      |
| :----------------: | :------------: | :---------------: |
|        LED0        |      PB0       | GPIO_Output(输出) |
|        LED1        |      PB1       | GPIO_Output(输出) |

- GPIO配置：


| 英文 | Pin Name |                GPIO output level                 |                         GPIO mode                          |                    GPIO Pull-up/Pull-down                    |             Maximum output speed             | User Label |
| ---- | :------: | :----------------------------------------------: | :--------------------------------------------------------: | :----------------------------------------------------------: | :------------------------------------------: | :--------: |
| 中文 | 管脚名字 |                 端口默认输出电平                 |                          端口模式                          |                        端口上拉/下拉                         |                 最大输出速率                 |  用户标注  |
|      |   PB0    | High<br><span style="color:red;">(高电平)</span> | Output push pull<br><span style="color:red;">(推挽)</span> | No pull up and no pull down<br><span style="color:red;">(无上下拉)</span> | High<br><span style="color:red;">(高)</span> |    LED1    |
|      |   PB1    |                       同上                       |                            同上                            |                             同上                             |                     同上                     |    LED0    |

###  KEY配置

- 管脚图配置：


| 对应原理图网络标号 | 对应原理图管脚 |     选择功能     |
| :----------------: | :------------: | :--------------: |
|       WK_UP        |      PA0       | GPIO_Input(输入) |
|        KEY0        |      PH3       | GPIO_Input(输入) |
|        KEY1        |      PH2       | GPIO_Input(输入) |
|        KEY2        |      PC13      | GPIO_Input(输入) |

- GPIO配置：


| 英文 | Pin Name |                        GPIO mode                         |               GPIO Pull-up/Pull-down                | User Label |
| ---- | :------: | :------------------------------------------------------: | :-------------------------------------------------: | :--------: |
| 中文 | 管脚名字 |                         端口模式                         |                    端口上拉/下拉                    |  用户标注  |
|      |  WK_UP   | Input mode<br><span style="color:red;">(输入模式)</span> | pull-down<br><span style="color:red;">(下拉)</span> |   KEY_UP   |
|      |   PH3    |                           同上                           | pull-up<br/><span style="color:red;">(上拉)</span>  |    KEY0    |
|      |   PH2    |                           同上                           |                        同上                         |    KEY1    |
|      |   PC13   |                           同上                           |                        同上                         |    KEY2    |



###  USART配置

- 管脚图配置：


| 对应原理图管脚 | 选择功能  |
| :------------: | :-------: |
|      PA9       | USART1_RX |
|      PA10      | USART1_TX |

- USART1配置：

| 英文 |                            Mode                             |           Hardware Flow Control (RS232)           |
| ---- | :---------------------------------------------------------: | :-----------------------------------------------: |
| 中文 |                            模式                             |                硬件流控制 (RS232)                 |
|      | Asynchronous<br/><span style="color:red;">(异步通信)</span> | Disable<br><span style="color:red;">(禁用)</span> |

| 英文 | Baud Rate |           Hardware Flow Control (RS232)           |                         Word Length                          |                  Parity                  | Stop Bits |                        Data Direction                        | Over Sampling |
| ---- | :-------: | :-----------------------------------------------: | :----------------------------------------------------------: | :--------------------------------------: | :-------: | :----------------------------------------------------------: | :-----------: |
| 中文 |  波特率   |                硬件流控制 (RS232)                 |                           数据长度                           |                 奇偶校验                 |  停止位   |                           数据方向                           |    过采样     |
|      |  115200   | Disable<br><span style="color:red;">(禁用)</span> | 8 Bits (including Parity)<br><span style="color:red;">8 位(包括奇偶校验)</span> | None<span style="color:red;">(无)</span> |     1     | Receive and Transmit<br/><span style="color:red;">接收和发送</span> |  16 Samples   |

 `NVIC Settings` --- `USART1 global interupt` --- 勾选



###  外部中断配置

- 管脚图配置(以按键引脚为例)

| 对应原理图网络标号 | 对应原理图管脚 |  选择功能   |
| :----------------: | :------------: | :---------: |
|       WK_UP        |      PA0       | GPIO_EXTI0  |
|        KEY0        |      PH3       | GPIO_EXTI3  |
|        KEY1        |      PH2       | GPIO_EXTI2  |
|        KEY2        |      PC13      | GPIO_EXTI13 |

- GPIO配置

| 英文 | Pin Name |                          GPIO mode                           |               GPIO Pull-up/Pull-down                |
| ---- | :------: | :----------------------------------------------------------: | :-------------------------------------------------: |
| 中文 | 管脚名字 |                           端口模式                           |                    端口上拉/下拉                    |
|      |   PA0    | Extemal Interrupt Mode with Rising edge trigger detection<br><span style="color:red;">(带有上升沿触发检测的外部中断模式)</span> | pull-down<br><span style="color:red;">(下拉)</span> |
|      |   PH3    | Extemal Interrupt Mode with Falling edge trigger detection<br/><span style="color:red;">(带有下降沿触发检测的外部中断模式)</span> | pull-up<br/><span style="color:red;">(上拉)</span>  |
|      |   PH2    |                             同上                             |                        同上                         |
|      |   PC13   |                             同上                             |                        同上                         |

 `NVIC` --- 全部勾选Enable





###  基本定时器配置







## LED

硬件连接：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221105171806.png)



```cpp
/*LED.h*/
# ifndef __LED_H
# define __LED_H
# include "stm32f4xx_hal.h"
# include "main.h"

# define LED0_on() HAL_GPIO_WritePin(GPIOB,GPIO_PIN_1,GPIO_PIN_RESET)	//点亮LED0
# define LED0_Reversal() HAL_GPIO_TogglePin(GPIOB,GPIO_PIN_1)	//翻转LED0
# define LED1_Reversal() HAL_GPIO_TogglePin(GPIOB,GPIO_PIN_0)	//翻转LED1

void LED_togg(uint8_t flag);


# endif

/*LED.c*/
# include "LED.h"


//LED交替点亮
void LED_togg(uint8_t flag)
{
	if(0 == flag)
	{
		LED0_Reversal();	//LED0翻转电平状态		
	}
	if(1 == flag)
	{
		LED1_Reversal();	//LED1翻转电平状态		
	}
}

/*mian.c*/
LED_togg(0);
HAL_Delay(500);
LED_togg(1);
```


## KEY

硬件连接：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221106132927.png)

由于外部没接上下拉电阻，所以需要配置内部上下拉电阻(KEY0/1/2是低电平有效，WK_UP是高电平有效)



## USART

硬件连接：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221107155518.png)

```cpp
//结构体
UART_HandleTypeDef huart1;	
```



## 外部中断

- STM32F4 的每个 IO 都可以作为外部中断的中断输入口，这点也是 STM32F4 的强大之处；STM32F429的中断控制器支持22个外部中断/事件请求。每个中断设有状态位，每个中断/事件都有独立的触发和屏蔽设置
- 广义上是指 `外设所产生的中断`。一般在实践中习惯将外部引脚的电平变化所引发的中断叫外部中断；GPIO的外部中断是由于电平变化所引起的，为了避免误触和重复中断，STM32使用 `边沿触发模式` 来触发中断

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221115181201.jpg)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221115181308.jpg)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221115181522.jpg)



22个外部中断：

|   中断线   |                             对应                             |
| :--------: | :----------------------------------------------------------: |
| EXTI线0~15 | 对应外部IO口的输入中断(0-->PA0,PB0,...;1-->PA1,PB1,...)<br>而中断线每次只能连接到1个IO口上 |
|  EXTI线16  |                        连接到PVD输出                         |
|  EXTI线17  |                      连接到RTC闹钟事件                       |
|  EXTI线18  |                   连接到USB OTG FS唤醒事件                   |
|  EXTI线19  |                     连接到以太网唤醒事件                     |
|  EXTI线20  |             连接到USB OTG HS(在FS中配置)唤醒事件             |
|  EXTI线21  |                  连接到RTC入侵和时间戳事件                   |
|  EXTI线22  |                      连接到RTC唤醒事件                       |

- 结构体

|     成员     |                             参数                             |                             注意                             |
| :----------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|  EXTI_Line   |                   EXTI_Line0 - EXTI_Line23                   |       其中EXTI_Line0 - EXTI_Line15是关于GPIO的外部中断       |
|  EXTI_Mode   | EXTI_Mode_Interrupt(中断模式)<br/>EXTI_Mode_Event(事件模式)  | 事件模式是不产生中断的，可以用这个模式产生一个信号来驱动某些外设，以此来做到不占用CPU的算力，之后使用时会提到；另外中断本身也是事件的一种，其实就是将某些需要CPU响应的事件叫做中断，并进入某个函数 |
| EXTI_Trigger | EXTI_Trigger_Rising(上升沿触发)<br/>EXTI_Trigger_Falling(下降沿触发)<br/>EXTI_Trigger_Rising_Falling(上升沿和下降沿触发) |                              /                               |
| EXTI_LineCmd |                DISABLE(失能)<br/>ENABLE(使能)                |                              /                               |

- 配置NVIC需要注意

|    中断通道    |     含义      |   中断服务函数写法   |
| :------------: | :-----------: | :------------------: |
|   EXTI0_IRQn   |   外部中断0   |   EXTI0_IRQHandler   |
|   EXTI1_IRQn   |   外部中断1   |   EXTI1_IRQHandler   |
|   EXTI2_IRQn   |   外部中断2   |   EXTI2_IRQHandler   |
|   EXTI3_IRQn   |   外部中断3   |   EXTI3_IRQHandler   |
|   EXTI4_IRQn   |   外部中断4   |   EXTI4_IRQHandler   |
|  EXTI9_5_IRQn  |  外部中断5-9  |  EXTI9_5_IRQHandler  |
| EXTI15_10_IRQn | 外部中断10-15 | EXTI15_10_IRQHandler |

注意 `外部中断0 到 外部中断4` 有独立的中断优先级和中断服务函数，而 `外部中断5-9` 共用一个中断优先级和中断服务函数， `外部中断10-15` 同理，可以在外部中断5-9中使用 `检测中断标志位的方式来区分是哪个中断触发`

当外部中断触发时，就会在一个叫做 外部中断挂起寄存器 的特点位置写入数据也就是一个标志位，可以使用标准库函数读取和更改标准位，每当这个标志位置为设置状态时就会自动跳转到对应的中断服务函数(为了避免出现异常调用，一般在中断服务函数里做一个验证，读取这个标志位是否为置位状态
而且每当中断服务函数结束并且需要下次中断执行中断服务函数，则需要在函数的最后清除中断标志位)

```cpp
//使用这个函数读取中断标志位
ITStatus EXTI_GetITStatus(uint32_t EXTI_Line)
//返回值
RESET			//没触发中断
SET				//触发了中断 
//清除标志位函数
EXTI_ClearITPendingBit(uint32_t EXTI_Line)    
```



## 定时器

| 定时器 | 通道管脚 | 分辨率(位) |   类型    | 捕获/比较通道 | 级别 | DMA请求 |
| :----: | :------: | :--------: | :-------: | :-----------: | :--: | :-----: |
|  TIM1  |          |     16     | 递增/递减 |   4(有互补)   | 高级 |    Y    |
|  TIM8  |          |     16     | 递增/递减 |   4(有互补)   | 高级 |    Y    |
|  TIM2  |          |     32     | 递增/递减 |       4       | 通用 |    Y    |
|  TIM5  |          |     32     | 递增/递减 |       4       | 通用 |    Y    |
|  TIM3  |          |     16     | 递增/递减 |       4       | 通用 |    Y    |
|  TIM4  |          |     16     | 递增/递减 |       4       | 通用 |    Y    |
|  TIM9  |          |     16     |   递增    |       2       | 通用 |    N    |
| TIM10  |          |     16     |   递增    |       1       | 通用 |    N    |
| TIM11  |          |     16     |   递增    |       1       | 通用 |    N    |
| TIM12  |          |     16     |   递增    |       2       | 通用 |    N    |
| TIM13  |          |     16     |   递增    |       1       | 通用 |    N    |
| TIM14  |          |     16     |   递增    |       1       | 通用 |    N    |
|  TIM6  |          |     16     |   递增    |       0       | 基本 |    Y    |
|  TIM7  |          |     16     |   递增    |       0       | 基本 |    Y    |

因为系统初始化Systemlnit函数里初始化APB 1总线时钟为4分频即42M，APB2总线时钟为2分频即84M,所以 `TIM1、 TIM8- TIM11`的时钟为APB2时钟的两倍即168M， `TIM2~ TIM7、TIM12~TIM14` 的时钟为APB1的时钟的两倍即84M(<span style="color:red;">注意这个智能硬件定时器有用到</span>)



## 停更说明

由于板子Bug很多暂时停更了



## 附3：CubeMX中英文对照/含义解释

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221105114734.png)

|                 英文                 |           中文           |
| :----------------------------------: | :----------------------: |
|        Open Existing Projects        |       打开项目工程       |
|      Start My project from MCU       |    从MCU开始我的项目     |
|    Start My project from STBoard     |  从ST开发板开始我的项目  |
| Start My project from Cross Selector | 从交叉选择器启动我的项目 |
|           CHECK FOR UPDATE           |         检查更新         |
|            INSTALL/REMOVE            |     安装/移除软件包      |

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221105120114.png)

|      英文       |   中文   |
| :-------------: | :------: |
|   New Project   | 新建工程 |
|  Load Project   | 导入工程 |
| Import Project  | 引入项目 |
|  Save Project   | 保存工程 |
| Save Project As | 另存工程 |
|  Close Project  | 关闭工程 |
| Generate Report | 生成报告 |
| Recent Projects | 最近工程 |
|      Exit       | 退出软件 |

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221105121102.png)

|       英文        |                    中文                    |
| :---------------: | :----------------------------------------: |
|       Help        |        帮助(STM32CubeMX的用户手册)         |
|       About       |        关于(STM32CubeMX的版本信息)         |
| Docs & Resources  |                 文档和资源                 |
|  Tutorial Videos  |                  教程视频                  |
|   Refresh Data    | 更新数据(更新MCU/BOARD数据，HAL库版本信息) |
| User Preferences  |  用户设定(是否允许ST公司获取你的使用数据)  |
| Check for Updates |                  检测更新                  |
| Manage embedded…  |                 软件包管理                 |
| Updater Settings  |                  更新设置                  |





![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96/202205091414613.jpg)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96/202205091421289.jpg)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96/202205091424150.jpg)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221105110401.jpg)

cubeMX管脚图颜色含义：

|                         颜色                         |                             含义                             |
| :--------------------------------------------------: | :----------------------------------------------------------: |
| <span style="color:rgb(255,246,204);"> 浅黄色</span> | 表示 `不可配置引脚` 电源专用引脚以浅黄色突出显示。其配置 `不能更改` |
|  <span style="color:rgb(187,204,0);">深黄色</span>   | 表示 `你配置了一个I/O口的功能`，但是没有初始化相对应的外设功能 引脚处于 `no mode` 状态 |
|    <span style="color:rgb(0,204,68);">绿色</span>    |                         表示配置成功                         |

cubeMX外设配置图标含义：

|            图标            |                             含义                             |
| :------------------------: | :----------------------------------------------------------: |
|    圆圈中间一个勾(绿色)    |                          表示没问题                          |
| 三角形中间一个感叹号(黄色) | 表示警告，对应配置出现问题 点击该选项即可 `外设配置` 界面查看 |



## 附5：所用到HAL库函数汇总

GPIO类：

|       函数名       |            作用            |  返回值   | 注意点 |
| :----------------: | :------------------------: | :-------: | :----: |
| HAL_GPIO_TogglePin |        翻转电平状态        |     /     |   /    |
|  HAL_GPIO_ReadPin  |   读取指定的输入端口引脚   | RESET/SET |   /    |
| HAL_GPIO_WritePin  | 设置或清除选定的数据端口位 |     /     |   /    |

USART类：

|       函数名        |                   作用                   |                            返回值                            |                            注意点                            |
| :-----------------: | :--------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|  HAL_UART_Transmit  |          串口发送指定长度的数据          | 如果超时没发送完成，则不再发送，返回超时标志(HAL_TIMEOUT)；成功返回HAL_OK |                              /                               |
| HAL_UART_Receive_IT | 串口中断接收，以中断方式接收指定长度数据 |                              /                               | 直到接收到指定长度数据，而后关闭中断，进入中断接收回调函数，不再触发接收中断 |
|  HAL_GPIO_WritePin  |        设置或清除选定的数据端口位        |                              /                               |                              /                               |