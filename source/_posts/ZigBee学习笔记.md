---
title: ZigBee学习笔记
cover: /img/num116.webp
categories:
  - 细化学习
comments: false
abbrlink: 397579f7
date: 2023-11-09 09:10:41
---



## 前言

{% note blue 'fas fa-fan' flat %}资源/网站{% endnote %}

[Zigbee附加资料--百度网盘](https://pan.baidu.com/s/1h5wk0PBC7L1vUvHq_amQzg?pwd=2333#list/path=%2F&parentPath=%2Fsharelink2199637170-1011570584614361)

[善学坊](https://www.sxf-iot.com)

[ZigBee 3.0 开发指南](https://z7po9bxpe4.k.topthink.com/@zigbee-dev-guide/kechengjianjie.html)

[ZigBee 3.0 CC2530 开发指南 小米Aqara资深工程师讲解-B站视频](https://www.bilibili.com/video/BV1k34y1D7Vz/?spm_id_from=888.80997.embed_other.whitelist&t=62&vd_source=5fb3f08926cbdbc6d84b3f2bda38c0b1)

[配套资源下载--公开部分--百度网盘](https://z7po9bxpe4.k.topthink.com/@zigbee-dev-guide/yuandaimaxiazai.html)

[使用CC2530开发板制作Zigbee温湿度传感器并接入Home Assistant](https://blog.csdn.net/qq_53006294/article/details/131791444?ops_request_misc=&request_id=&biz_id=102&utm_term=%E5%96%84%E5%AD%A6%E5%9D%8A&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~sobaiduweb~default-1-131791444.nonecase&spm=1018.2226.3001.4450)

[cc2530 串口实验4--设置时间](https://blog.csdn.net/shawyou/article/details/18196505?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522170039333616800185816659%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fblog.%2522%257D&request_id=170039333616800185816659&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~first_rank_ecpm_v1~rank_v31_ecpm-1-18196505-null-null.nonecase&utm_term=T3CC0%20%3D%200xFA%3B&spm=1018.2226.3001.4450)



## 环境准备

- 下载安装 `IAR Embedded Workbench for 8051 version 10.40.1`
- 下载 `TI Z-Stack 3.0` 
- 下载 `SmartRF Flash Programmer`
- 下载 `串口助手`(这个居然要钱没必要，使用其他普通串口助手即可)
- 安装 `SmartRF04EB` 驱动
- 安装 `USB转串口` 驱动
- 下载 `Xshell 7` (选)
- 下载 `PuTTY` (选)

## 板子资源介绍

> 板子主控：TI(德州仪器) CC2530F256

Flash： `256KB`

RAM： `8KB`

内核： `低功耗8051微控制器内核`

通用IO数量： `21`

USART数量： `2`

12位ADC数量： `8`

定时器数量：`4`

SPI数量：`2`



> 板子其他外设/模块

- 环境温度与环境湿度二合一传感器：原装正品奥松 `DHT11`，[查看技术参数](http://www.aosong.com/products-21.html)
- 继电器：原装正品松乐继电器  `SRD-05VDC-SL`，[查看技术参数](http://www.songle.com/Product_show_id_546.htm)
- 光照传感器： `SXF-GL5516`
- 外部存储器： `M25PE80 1 MB NorFlash`，[查看技术参数](https://gitee.com/study-j/zigbee/tree/master/%E8%AF%BE%E5%A4%96%E8%B5%84%E6%96%99%E5%8F%82%E8%80%83/M25PE80%E6%95%B0%E6%8D%AE%E6%89%8B%E5%86%8C)
- USB转串口芯片： `沁恒 CH340N`，[查看技术参数](https://www.wch.cn/products/CH340.html?)
- 拨码开关： `原装正品KE拨码开关`
- OLED： `0.96寸12864` (SSD1306驱动，SPI协议，3.3v或5v)，[查看技术参数](https://zhuanlan.zhihu.com/p/628861772)
- WiFI模块： `ESP01S`，[查看技术参数](https://gitee.com/study-j/wifi-esp8266/tree/master/ESP8266-01S)
- 仿真器： `smart-rf04eb` (支持在线仿真，程序下载)



> 技术参数

- 型号： `zigbee-std-v3`
- ZigBee 应用协议版本： `ZigBee 3.0`
- ZigBee 核心协议版本： `ZigBee 2007 Pro`
- ZigBee 底层协议： `IEEE 802.15.4`
- ZigBee 无线通信距离： `相邻节点的通信距离约为150米`(建议通信距离为1~50m)
- ZigBee 无线通信速率： `240kb/s（理论值）`
- ZigBee 电磁波频率： `2.4GHz`
- ZigBee 无线通信时延： `< 1秒`
- 供电电压： `4.5~5.5V`
- 供电电流： `0.5~2A`
- 工作温度：`-40°~85°`
- 工作湿度：`10%~90%`
- 发射电流：`26~31mA，28mA(4dBm)`
- 接收电流：`25~30mA，典型27mA`

## CC2530通信模组

> 为什么叫通信模组，因为它不仅是单片机，还是集成无线通信功能的单片机，所以叫通信模组



|      参数      |        描述         |
| :------------: | :-----------------: |
|      型号      |       2530-A        |
|      芯片      |     CC2530F256      |
|      协议      |     ZigBee 3.0      |
| 第三方设备互通 |        支持         |
|   超级自组网   |        支持         |
|    组网数量    | 最大100个(网状网络) |
|    对接方式    |      串口透传       |
|    通信距离    |    150m(无干扰)     |
|    待机功耗    |     <1uA(关机)      |
|      供电      | 3.0~3.6V，典型3.3V  |



<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231118135551.webp" style="zoom:67%;" />

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231118135712.webp" style="zoom:50%;" />



## ZigBee 3.0 介绍

ZigBee可以划分 `4` 个层：

1. 应用层 --- （我们一般就是对应用层进行开发，比如1是开灯0是关灯等等）
2. 网络层 --- （作用：组网）
3. MAC层 --- 使用 IEEE 802.15.4协议（作用：有序地利用物理通信资源来进行可靠通信）
4. 物理层 --- 使用 IEEE 802.15.4协议（作用：一个设备产生电磁波信号发送到另一个设备，另一个设备解读电磁波并且提取数据）

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231118142830.webp" style="zoom:50%;" />

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231118142958.webp" style="zoom:50%;" />

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231118150611.webp" style="zoom:50%;" />

> IEEE：电气和电子工程师协会
>
> 802.15：协会里面的部门
>
> 4：部门里的第4工作组开发的
>
> IEEE 802.15.4协议：低速无线个人区域网络WPAN，具有超低复杂度，超低功耗，低数据传输率

> 自组网：当两个节点超出一定范围后断开了连接，当两个节点重新接近时会自动重新连接的功能

- 技术厂商

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231118150951.webp" style="zoom:50%;" />



- TI-ZStack

主要由 `应用层(目前Z-Stack 3.0)` 和 `内核层Core(目前Core 2.7.1)` 组成

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231118151524.webp" style="zoom:50%;" />



## 安装 TI Z-Stack 3.0

> 可以去官网进行下载最新版：https://www.ti.com/tool/Z-STACK
>
> 此项目使用的版本为 `3.0.1`

`Z-Stack 3.0` 就是TI根据 `ZigBee 3.0` 协议规范而编写的程序（库），开发者可以方便地调用 `Z-Stack 3.0` 中的各个API来进行基于 `ZigBee` 协议的数据通信



{% tip bolt %}安装步骤{% endtip %}

1. 管理员身份打开 `exe`
2. 一直 `Next` 即可，然后安装路径可以自定义一下方便查找

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231118165710.webp)

3. 这里需要安装这些东西，所以全部勾选，然后等待它安装完成即可

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231118165916.webp)



## 安装 SmartRF_Flash_Programmer

> 可以去官网进行下载最新版：https://www.ti.com.cn/tool/cn/FLASH-PROGRAMMER#downloads
>
> 参考文章：[SmartRF Flash Programmer 下载与安装](https://zhuanlan.zhihu.com/p/370210691)
>
> 此项目使用的版本是：`SmartRF Flash Programmer 1.12.8`

`SmartRF Flash Programmer` 是一款编程器软件，可用于对TI的基于 `8051` 的低功耗射频无线 MCU 中的 `Flash` 进行编程



{% tip bolt %}安装步骤{% endtip %}

1. 以管理员身份运行安装包

2. 正常下一步即可，安装路径也可以自定义，方便查找
3. 安装过程中会弹出安装驱动，点击【安装】即可

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231118170953.webp" style="zoom:50%;" />

4. 安装完创建桌面快捷键即可

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231118171014.webp)



## 安装 SmartRF04EB 驱动

> 可以去官网进行下载最新版：https://www.ti.com/tool/download/SWRC212、
>
> 参考文章：[SmartRF04EB 简介和驱动安装](https://zhuanlan.zhihu.com/p/370241426)

`IAR EW for 8051` 或者 `SmartRF Flash Programmer` 还需要配合 `SmartRF04EB` 仿真器才能实现在线程序仿真或固件程序下载。在使用 `SmartRF04EB` 仿真器前，需要先安装其配套的驱动程序



{% tip bolt %}安装步骤{% endtip %}

1. 使用USB线把SmartRF04EB仿真器连接到电脑
2. 解压驱动压缩包
3. 打开电脑的设备管理器，找到其他设备那栏，看到一个带黄色感叹号的SmastRF04EB，然后选择“更新驱动程序软件”，选择“浏览我的计算机……”，单击“浏览”按钮，选择至刚刚解压的文件夹，找到你对应的机型(根据自身电脑的位数选择64位/32位)，进入该文件夹即可，并且勾选“包含子文件夹”，然后单击“下一步”按钮即可
4. 黄色感叹号消失，驱动程序安装成功

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231118172823.webp)



## 安装USB转串口驱动

> 可以去官网进行下载最新版：https://www.wch.cn/downloads/CH341SER_EXE.html
>
> 驱动精灵：https://www.drivergenius.com/

一般如果之前有用过USB转串口的话应该就已经有驱动了不需要安装，但是还是建议安装一下最新版的没有bug

如果安装失败可以使用驱动精灵进行安装



## 新建项目

{% tip bolt %}工程建立与文件添加{% endtip %}

1. 打开IAR，点击【File】-> 【New Workspace】，新建工作空间
2. 依次点击 【File】-> 【Save Workspace As...】，保存工作空间到一个地方
3. 在刚刚保存的项目路径下创建两个文件夹，`APP` 和 `USER`
4. 新建项目，点击【Project】-> 【Create New Project...】，在工作空间里进行新建一个工程
5. 选择【Empty project】，新建一个空工程
6. 添加组与.c和.h

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231118180141.webp)

先点击左上角 `New Document`，创建新的文件然后保存到对应的文件夹里即可

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231119104304.webp)

7. 选择芯片，选择自己的芯片

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231118180801.webp" style="zoom:50%;" />

`注意`：一个工作空间可以包含多个工程，他们都是互相独立的



进入这里将 `XDATA` 改为 `0x1FF`，还有其他一些设置比如hex文件的输出等等

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231118181141.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231118181301.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231118181348.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231118181400.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231118182657.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231118181617.webp)

{% endgallery %}



{% tip bolt %}程序下载{% endtip %}



{% tip bolt %}固件烧录{% endtip %}

在配置并编译链接工程后，IAR 会生成一个 `hex` 文件，这个 `hex` 文件可以作为产品打包发布的固件

鼠标右键点击 `xxx.hex` 文件，然后选择 【Open Containing Folder...】可以查看文件所在目录

> 在实际的开发过程中，一般需要生成两个版本的固件：
>
> - 一个是调试用的Debug版本
> - 一个是产品正式发布的Release版本
>
> 在创建工程时，IAR也默认存在相关的配置。依次点击【Project】和【Edit Configurations...】，选择编辑工程配置
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231118213959.webp)

> 固件烧录步骤如下：
>
> 1. 把开发板通过仿真器连接到电脑上
> 2. 按一下仿真器的复位按键
> 3. 打开 `SmartRF Flash Programmer`，点击 `System-on-Chip`，可以看到识别到的仿真器。接着选中待烧录的固件、选中 `Erase and program`
>
> <img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231118214718.webp" style="zoom:67%;" />





## 我的程序框架

{% folding, CC2530_IO_Config.h %}

```cpp
#ifndef __CC2530_IO_CONFIG_H
#define __CC2530_IO_CONFIG_H

/** @brief  CC2530 GPIO 模式 */
#define CC2530_OUTPUT          0 //!< 输出
#define CC2530_INPUT_PULLUP    1 //!< 上拉输入
#define CC2530_INPUT_PULLDOWN  2 //!< 下拉输入
#define CC2530_INPUT_TRISTATE  3 //!< 悬空

/** @brief  位左移 */
#define CC2530_IO_CTRL_BV(x)    (1<<(x))

/** @brief  配置寄存器：PxSEL  端口功能选择/端口1外设优先级控制：0---通用IO 1---外设功能*/
#define CC2530_REG_PxSEL(port, pin, val) do {                   \
    if (0 == val) P##port##SEL &= ~CC2530_IO_CTRL_BV(pin);      \
    else P##port##SEL |= CC2530_IO_CTRL_BV(pin);                \
} while(0)

/** @brief  配置寄存器：PxDIR  端口方向/端口0外设优先级控制：0---输入 1---输出*/
#define CC2530_REG_PxDIR(port, pin, val) do {                   \
    if (0 == val) P##port##DIR &= ~CC2530_IO_CTRL_BV(pin);      \
    else P##port##DIR |= CC2530_IO_CTRL_BV(pin);                \
} while(0)

/** @brief  配置寄存器：PxINP  端口输入模式控制：0---上拉/下拉 1---三态*/
#define CC2530_REG_PxINP(port, pin, val) do {                   \
    if (0 == val) P##port##INP &= ~CC2530_IO_CTRL_BV(pin);      \
    else P##port##INP |= CC2530_IO_CTRL_BV(pin);                \
} while(0)

/** @brief  输出模式*/
#define CC2530_IO_OUTPUT(port, pin) do {                        \
    CC2530_REG_PxDIR(port, pin, 1);                             \
    CC2530_REG_PxSEL(port, pin, 0);                             \
} while(0)

/** @brief  输入模式*/
#define CC2530_IO_INPUT(port, pin, mode) do {                                  \
    if (1 == (port) && (0 == (pin) || 1 == (pin))) break;                      \
                                                                               \
    CC2530_REG_PxDIR(port, pin, 0);                                            \
    CC2530_REG_PxSEL(port, pin, 0);                                            \
                                                                               \
    if (CC2530_INPUT_TRISTATE == mode) CC2530_REG_PxINP(port, pin, 1);         \
    else {                                                                     \
         CC2530_REG_PxINP(port, pin, 0);                                       \
         if (CC2530_INPUT_PULLUP == mode) CC2530_REG_PxINP(2, (5+port), 0);    \
         else CC2530_REG_PxINP(2, (5+port), 1);                                \
    }                                                                          \
} while(0)

/** @brief  GPIO模式
 *  @warning  P1_0, P1_1 不能设置为输入模式
 */
#define CC2530_IO_CTRL(port, pin, mode) do {                                   \
    if (port > 2 || pin > 7) break;                                            \
                                                                               \
    if (CC2530_OUTPUT == mode) CC2530_IO_OUTPUT(port, pin)                     \
    else CC2530_IO_INPUT(port, pin, mode);                                     \
} while(0)

/** @brief    GPIO 置0/1
 *  @warning  GPIO 必须在输出模式
 */
#define CC2530_GPIO_SET(port, pin)      P##port##_##pin = 1
#define CC2530_GPIO_RESET(port, pin)    P##port##_##pin = 0

/** @brief    获取GPIO状态
 */
#define CC2530_GPIO_READ(port, pin)     P##port##_##pin

#endif
```

{% endfolding %}



## 入门

### 原理图

> CC2530主控

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231119100046.webp" style="zoom:80%;" />

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231122163438.webp)

调试接口使用I/O 引脚 `P2.1` 和 `P2.2` 分别作为调试模式中的调试数据和调试时钟。当设备不在调试模式下，这些I/O 引脚只能用于通用I/O。因此调试接口不干预任何外设I/O 引脚

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231119182115.webp)

外设引脚映射表(手册7.6)：

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231120143358.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231120143413.webp)

{% endgallery %}



### 用户代码

{% folding, AllHead.h %}

```cpp
#ifndef __ALLHEAD_H
#define __ALLHEAD_H

// CC2530头文件
#include "ioCC2530.h"

// C库头文件
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <stdint.h>     // 用到uint8_t那些需要包含

// IO配置头文件
#include "CC2530_IO_Config.h"
#include "CC2530_SPI_Common.h"


// 用户头文件
#include "Public.h"
#include "System.h"
#include "System_Init.h"
#include "Callback.h"
#include "Task.h"

// 外设头文件
#include "Led.h"
#include "Timer.h"
#include "WatchDog.h"
#include "LowPower.h"
#include "USART0.h"
#include "Key.h"
#include "EXTI.h"
#include "bsp_ADC.h"
#include "HW_SPI.h"
#include "SW_SPI.h"
#include "oled_spi.h"
#include "OLED.h"
#include "DHT11.h"
#include "Menu.h"
#include "flash_spi.h"
#include "Flash.h"
#include "Relay.h"

#endif
```

{% endfolding %}

{% folding, CallBack.c %}

```cpp
/***************************************************************************
 * File          : Callback.c
 * Author        : Yang
 * Date          : 2023-11-19
 * description   : 存放中断相关
****************************************************************************/
#include "AllHead.h"

/*
* @function: T3_CallBack
* @param   : None
* @retval  : None
* @brief   : T3中断服务函数
*/
#if USE_TIM3
#pragma vector = T3_VECTOR
__interrupt void T3_CallBack(void)
{
    static uint8_t Key_Cnt = 0;
    static uint8_t Key_Long_Cnt = 0;
    
    T3IF = 0;   // 清除中断标志位(可要可不要，硬件自动清0了)
    
    Key_Cnt++;
    Key_Long_Cnt++;
    
    if (Key_Cnt >= 10)
    {
        Key_Cnt = 0;
        Key.Key_Scan();
    }
    if (Key_Long_Cnt >= 100)
    {
        Key_Long_Cnt = 0;
        Key.Key_Long_Count++;
    }
    
    System.Task_Mask(); // 任务标记
}
#endif

/*
* @function: T1_CallBack
* @param   : None
* @retval  : None
* @brief   : T1中断服务函数
*/
#if USE_TIM1
#pragma vector = T1_VECTOR
__interrupt void T1_CallBack(void)
{
    T1IF = 0;   // 清除中断标志位(可要可不要，硬件自动清0了)
    
    T1IE = 0;
    USART0.Rec_Sta |= 0x8000;
}
#endif

/*
* @function: T4_CallBack
* @param   : None
* @retval  : None
* @brief   : T4中断服务函数
*/
#if USE_TIM4
#pragma vector = T4_VECTOR
__interrupt void T4_CallBack(void)
{
    T4IF = 0;   // 清除中断标志位(可要可不要，硬件自动清0了)
}
#endif

/*
* @function: SleepTimer_CallBack
* @param   : None
* @retval  : None
* @brief   : 低功耗中断服务函数(休眠定时器到时间后会中断)
*/
#pragma vector = ST_VECTOR
__interrupt void SleepTimer_CallBack(void)
{
    STIF = 0;   // 清除中断标志位
}

/*
* @function: USART0_RX_CallBack
* @param   : None
* @retval  : None
* @brief   : 串口0中断服务函数
*/
#pragma vector = URX0_VECTOR
__interrupt void USART0_RX_CallBack(void)
{
    URX0IF = 0;   // 清除中断标志位

    USART0.USART0_Rec_Data_Analyze_1();        // 数据解析
}

/*
* @function: P0_Exti_CallBack
* @param   : None
* @retval  : None
* @brief   : P0外部中断中断服务函数
*/
#if USE_KEY_EXTI
#pragma vector = P0INT_VECTOR
__interrupt void P0_Exti_CallBack(void)
{
    Public.Public_Delay_MS(10);
    Led.Led_Flip();
    
    P0IFG = 0;  // 清除引脚中断标志位
    P0IF = 0;   // 清除P0中断标志位
}
#endif

```

{% endfolding %}

{% folding, Public.h %}

```cpp
#ifndef __PUBLIC_H
#define __PUBLIC_H

// Bool状态枚举
typedef enum
{
    TRUE = 0x01,
    FALSE =0x00
} Bool_Status_et;

typedef struct
{
    void (*Public_Delay_MS)(uint16_t);       // ms延时
    void (*Public_Delay_32MHz_US)(uint16_t);    // us延时
} Public_st;

extern Public_st Public;


#endif
```

{% endfolding %}

{% folding, Public.c %}

```cpp
/***************************************************************************
 * File          : Public.c
 * Author        : Yang
 * Date          : 2023-11-19
 * description   : 存放公共函数相关
****************************************************************************/
#include "AllHead.h"

/* Private function prototypes===============================================*/
static void Public_Delay_MS(uint16_t ms);
static void Public_Delay_32MHz_US(uint16_t us);

/* Public variables==========================================================*/
Public_st Public = 
{
    .Public_Delay_MS = &Public_Delay_MS,
    .Public_Delay_32MHz_US = &Public_Delay_32MHz_US
};

/*
* @function: Public_Delay_MS
* @param   : None
* @retval  : None
* @brief   : ms延时(且告诉编译器不优化)
*/
#pragma optimize=none
static void Public_Delay_MS(uint16_t ms)
{
    uint16_t i, j, k;
    
    if (16 == SYS_CLOCK_FRE_MHz)
    {
        k = 535;
    }
    else if (32 == SYS_CLOCK_FRE_MHz)
    {
        k = 1070;
    }
    
    for (i = 0; i < ms; i++)
    {
        // 经由实际测试可以得出执行535次循环耗时最接近1ms(16MHz下)，如果是32MHz则是1070
        for (j = 0; j < k; j++);
    }
}

/*
* @function: Public_Delay_32MHz_US
* @param   : None
* @retval  : None
* @brief   : us延时(且告诉编译器不优化)，只在32MHz下有用
*/
#pragma optimize=none
static void Public_Delay_32MHz_US(uint16_t us)
{
    for (uint16_t i = 0; i < us; i++)
    {
        asm("NOP");
        asm("NOP");
        asm("NOP");
        asm("NOP");
        asm("NOP");
        asm("NOP");
        asm("NOP");
    }
}
```

{% endfolding %}

{% folding, System.h %}

```cpp
#ifndef __SYSTEM_H
#define __SYSTEM_H

typedef struct
{
    void (*System_Run)(void);
    void (*System_Error)(void);
    void (*Task_Mask)(void);
}System_st;

extern System_st System;

#endif
```

{% endfolding %}

{% folding, System.c %}

```cpp
/***************************************************************************
 * File          : System.c
 * Author        : Yang
 * Date          : 2023-11-19
 * description   : 存放用户系统函数
****************************************************************************/
#include "AllHead.h"

/* Private function prototypes===============================================*/
static void System_Run(void);
static void System_Error(void);
static void Task_Mask(void);
static void Task_Handler(void);

/* Public variables==========================================================*/
System_st System = 
{
    .System_Run = &System_Run,
    .System_Error = &System_Error,
    .Task_Mask = &Task_Mask
};

/*
* @function: System_Run
* @param   : None
* @retval  : None
* @brief   : 系统运行
*/
static void System_Run(void)
{
    Task_Handler();
}

/*
* @function: System_Error
* @param   : None
* @retval  : None
* @brief   : 系统错误
*/
static void System_Error(void)
{
    for (;;)
    {
        
    }
}

/*
* @function: Task_Mask
* @param   : None
* @retval  : None
* @brief   : 任务标记
*/
static void Task_Mask(void)
{
    uint8_t i;
    
    for (i = 0; i < TASK_MAX; i++)
    {
        if (Task[i].Task_Cnt)
        {
            Task[i].Task_Cnt--;     // 递减
            
            if (0 == Task[i].Task_Cnt)
            {
                Task[i].Task_Cnt = Task[i].Task_Timer;      // 重装载
                Task[i].Task_Status = TRUE; // 任务执行标志位置1
            }
        }
    }
}


/*
* @function: Task_Handler
* @param   : None
* @retval  : None
* @brief   : 任务处理函数
*/
static void Task_Handler(void)
{
    uint8_t i;
    
    for (i = 0; i < TASK_MAX; i++)
    {
        if (Task[i].Task_Status)
        {
            Task[i].Task_Status = FALSE;
            Task[i].Task_Handler();     // 执行函数
        }
    }
}
```

{% endfolding %}

{% folding, System_Init.h %}

```cpp
#ifndef __SYSTEM_INIT_H
#define __SYSTEM_INIT_H

// 这里定义工程使用的系统时钟频率
#define SYS_CLOCK_FRE_MHz 32

typedef struct
{
  void (*Hardware_Init)(void);
} System_Init_st;

extern System_Init_st System_Init;


#endif
```

{% endfolding %}

{% folding, System_Init.c %}

```cpp
/***************************************************************************
 * File          : System_Init.c
 * Author        : Yang
 * Date          : 2023-11-19
 * description   : 存放用户系统初始化相关 
****************************************************************************/
#include "AllHead.h"
#include "font_v_picture.h"
/* Private function prototypes===============================================*/
static void Hardware_Init(void);
static void Clock_Init(void);
/* Public variables==========================================================*/
System_Init_st System_Init = 
{
  .Hardware_Init = &Hardware_Init
};


/*
* @function: Clock_Init
* @param   : None
* @retval  : None
* @brief   : 时钟初始化(系统时钟默认是16MHz)
*/
static void Clock_Init(void)
{
    CLKCONCMD &= ~0x40; // 设置系统时钟源为32MHz晶振 --- 1011 1111 & 1100 1001 = 1000 1001
    while (CLKCONSTA & 0x40);   // 等待晶振稳定为32M --- 1100 1001 & 0100 0000
    CLKCONCMD &= ~0x7F; // 设置系统主时钟频率为32MHz --- 1000 1001 & 1000 000 = 1000 0000
}


/*
* @function: Hardware_Init
* @param   : None
* @retval  : None
* @brief   : 硬件初始化
*/
static void Hardware_Init(void)
{
    Clock_Init();       // 时钟初始化
    Led.Led_Init();     // LED初始化
    Key.Key_Init();     // 按键初始化

#if USE_TIM3
    Timer.Timer3_Init(); // 定时器3初始化
#endif
#if USE_TIM1    
    Timer.Timer1_Init();        // 定时器1初始化
#endif
#if USE_TIM4    
    Timer.Timer4_Init();        // 定时器4初始化
#endif
    
    USART0.USART0_Init();       // 串口0初始化
//    LowPower.LowPower_Init();       // 低功耗初始化
    WatchDog.WatchDog_Init();   // 看门狗初始化

#if USE_KEY_EXTI
    EXTI.EXTI_Init();   // 外部中断初始化(按键)
#endif
    
    bsp_ADC.Bsp_ADC_Init();     // ADC初始化(光照传感器)  
    DHT11.DHT11_Init(); // 温湿度初始化

#if USE_OELD  
    OLED.OLED_Init();   // OLED初始化
#endif
    
    Flash.Flash_Init(); // Flash初始化
    
    Relay.Relay_Init(); // 继电器初始化

    EA = 1;     // 打开总中断

    USART0.USART0_Send("Init OK\r\n", strlen("Init OK\r\n"));
    Flash.Flash_Test(); // Flash测试
}
```

{% endfolding %}

{% folding, Task.h %}

```cpp
#ifndef __TASK_H
#define __TASK_H

typedef struct
{
    uint8_t Task_Status;        // 任务状态
    uint16_t Task_Cnt;   // 任务计数
    uint16_t Task_Timer;        // 任务重装载值
    void (*Task_Handler)(void); // 任务函数指针
} Task_st;

extern Task_st Task[];
extern uint8_t TASK_MAX;

#endif
```

{% endfolding %}

{% folding, Task.c %}

```cpp
/***************************************************************************
 * File          : Task.c
 * Author        : Yang
 * Date          : 2023-11-19
 * description   : 任务执行 
****************************************************************************/
#include "AllHead.h"

/* Private function prototypes===============================================*/
static void Task_Handler_5MS(void);
static void Task_Handler_10MS(void);
static void Task_Handler_200MS(void);
static void Task_Handler_500MS(void);
static void Task_Handler_1S(void);
/* Public variables==========================================================*/
Task_st Task[] = 
{
    {FALSE, 5, 5, Task_Handler_5MS},
    {FALSE, 10, 10, Task_Handler_10MS},
    {FALSE, 200, 200, Task_Handler_200MS},
    {FALSE, 500, 500, Task_Handler_500MS},
    {FALSE, 1000, 1000, Task_Handler_1S}
};

uint8_t TASK_MAX = sizeof(Task) / sizeof(Task[0]);

static void Task_Handler_5MS(void)
{
    USART0.USART0_Protocol_Analyze_Handler();
}

static void Task_Handler_10MS(void)
{
    Key.Key_Handler();
}

static void Task_Handler_200MS(void)
{
#if USE_OELD
    Menu.Menu_Handler();
#endif    
}

static void Task_Handler_500MS(void)
{

    WatchDog.WatchDog_Feet();
    Led.Led_Flip();
}

static void Task_Handler_1S(void)
{

}
```

{% endfolding %}

{% folding, main.c %}

```cpp
/***************************************************************************
 * File          : main.c
 * Author        : Yang
 * Date          : 2023-11-19
 * description   : CC2530寄存器学习 
****************************************************************************/
#include "AllHead.h"

void main()
{
    System_Init.Hardware_Init();
    
    for (;;)
    {    
        System.System_Run();
    }
}
```

{% endfolding %}





### GPIO实验

> 除了两个高驱动输出口 `P1.0` 和 `P1.1` 各具备 `20 mA` 的输出驱动能力之外，所有的输出均具备 `4 mA`的驱动能力，而且这两个引脚是没有上拉/下拉功能

> 注意配置为外设I/O 信号的引脚没有上拉/下拉功能，即使外设功能是一个输入

{% tip bolt %}常用寄存器{% endtip %}

【数据手册 7.11】

| 寄存器 |                             说明                             |
| :----: | :----------------------------------------------------------: |
|   P0   | 8位寄存器，8个位分别与P0_0~P0_7一一对应，分别用于设置或读取这8个IO口的电平状态 |
| P0SEL  | 8位寄存器，8个位分别与P0_0~P0_7一一对应，分别配置这8个IO口的 `功能`。如果IO口对应的位为0，表示该IO口用于通用输入/输出；如果为1，表示用于特定的功能 |
| P0DIR  | 8位寄存器，8个位分别与P0_0~P0_7一一对应，分别配置这8个IO口的 `通信方向`。如果IO口对应的位为0，表示该IO口处于输入信号模式；如果为1，表示处于输出信号模式 |
| PERCFG | 其中的第0位用于配置USART0的位置，值为0表示使用位置1，即使用P0_2和P0_3；值为1表示使用位置2，即使用P1_4和P1_5 |

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231119101411.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231119120408.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231119120152.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231119121350.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231119122918.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231119123431.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231119123515.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231120150112.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231122140916.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231122141152.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231122173943.webp)

{% endgallery %}





#### LED

- 硬件连接

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231119100329.webp" style="zoom:67%;" />



#### 按键

- 硬件连接

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231121174910.webp)

- 程序编写







### 时钟

CC2530有两种时钟频率可供开发者使用： `32MHz` 和 `16MHz`

CC2530的默认系统时钟频率是 `16MHz`（可在数据手册里 `CLKCONCMD`寄存器里知道复位值）

注意要使用 `RF 收发器`，必须选择高速且稳定的 `32 MHz` 晶振

- 设备有两个高频振荡器

1.  32 MHz 外部晶振(XOSC)
2. 16 MHz 内部RC 振荡器(RCOSC)

- 设备的两个低频振荡器(这两个32 kHz 振荡器不能同时运行)

1. 32 kHz 外部晶振(XOSC)

2. 32 kHz 内部RC 振荡器(RCOSC)



{% tip bolt %}常用寄存器{% endtip %}

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231119163411.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231119164925.webp)

{% endgallery %}

```cpp
/*
* @function: Clock_Init
* @param   : None
* @retval  : None
* @brief   : 时钟初始化(系统时钟默认是16MHz)
*/
static void Clock_Init(void)
{
    CLKCONCMD &= ~0x40; // 设置系统时钟源为32MHz晶振 --- 1011 1111 & 1100 1001 = 1000 1001
    while (CLKCONSTA & 0x40);   // 等待晶振稳定为32M --- 1100 1001 & 0100 0000
    CLKCONCMD &= ~0x7F; // 设置系统主时钟频率为32MHz --- 1000 1001 & 1000 000 = 1000 0000
}
```



### 中断

CPU有 `18` 个中断源

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231119180659.webp" style="zoom:50%;" />

中断组合成为 `6` 个中断优先组，每组的优先级通过设置寄存器 `IP0` 和 `IP1` 实现。为了给中断（也就是它所在的中断优先组）赋值优先级，需要设置 `IP0` 和 `IP1` 的对应位

当同时收到几个相同优先级的中断请求时，采取轮流探测顺序来判定哪个中断优先响应：

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231119181124.webp" style="zoom:50%;" />

{% tip bolt %}中断常用寄存器{% endtip %}

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231119182527.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231119182655.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231119183759.webp)

{% endgallery %}

最右边是P0端口的中断过程，其相关寄存器依次为 `P0` 、 `PICTL.P0ICON` 、 `P0IFG` 、 `P0IEN` 、 `P0IF` 、 `EA` 和 `IEN1.P0IE`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231122113921.webp)

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231122114259.webp" style="zoom:50%;" />















### 定时器实验

CC2530有 `4` 个定时器：1个16位的(TIM1)、2个8位的(TIM3和TIM4)

> 定时器1 是一个独立的16 位定时器，支持典型的定时/计数功能，比如输入捕获，输出比较和PWM 功能。定时器有五个独立的捕获/比较通道

> 定时器3 和4 是两个8 位的定时器。每个定时器有两个独立的比较通道



{% tip bolt %}TIM1常用寄存器{% endtip %}

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231119202858.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231119203010.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231119203040.webp)

{% endgallery %}



{% tip bolt %}TIM3/4常用寄存器{% endtip %}

定时器3和4的寄存器一样的只是名字不一样，定时器1的寄存器不一样

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231119173103.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231119174241.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231119174358.webp)

{% endgallery %}



{% tip bolt %}TIM1/3/4共用寄存器{% endtip %}

**中断未决**：已经检测到了一个中断请求，但还没有被处理的中断，即发生了中断

**无中断未决**：当前没有中断需要被处理

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231119174904.webp" style="zoom: 67%;" />



> 定时计算公式：
>
> $$\text{(频率 单位Hz) = 系统时钟/预分频/重装载值}$$
>
> $$\text{(定时时间 单位S)=1/频率}$$



#### 计时查询触发

> 需要手动清除标志位

```cpp
/*
* @function: Timer1_Init
* @param   : None
* @retval  : None
* @brief   : 定时器1初始化
*/
static void Timer1_Init(void)
{
    /*配置定时器1为1ms --- 32000000/32/1000 = 1000Hz 1/1000Hz = 0.001s*/
    T1CTL = 0x0A;   // 【控制寄存器】模模式，32分频 --- 0000 1010
    T1CC0H = 0x03;      // 定时器高8位
    T1CC0L = 0xE8;   // 定时器低8位
    T1CCTL0 |= 0x04; // 【捕获/比较控制寄存器】设置模式为比较模式 --- 0100 0000 | 0000 0100
}

// 主循环
in main(void)
{
    if (T1IF)	// 判断是否发生中断
    {
        T1IF = 0; // 清除标志位
        if (++Cnt > 200)
        {
            Cnt = 0;
            Led.Led_Flip();
        }        
    }
}
```



#### 计时中断触发

> 使用T3定时1ms

{% folding, Timer.c %}

```cpp
/*
* @function: Timer_Init
* @param   : None
* @retval  : None
* @brief   : 定时器初始化
*/
static void Timer_Init(void)
{
    /*配置定时器3为1ms --- 32000000/128/250 = 1000Hz 1/1000Hz = 0.001s*/
    T3CTL = 0xFA;   // 【控制寄存器】模模式，128分频，中断使能，定时器开启 --- 1111 1010
    T3CC0 = 0xFA;   // 【捕获/比较值寄存器】MAX是255 --- 1111 1010
    T3CCTL0 |= 0x04; // 【捕获/比较控制寄存器】设置模式为比较模式 --- 0100 0000 | 0000 0100
    T3IE = 1;   // 【T3中断使能】使能T3定时器中断
    EA = 1;	// 打开总中断
}
```

{% endfolding %}

{% folding, Callback.c %}

```cpp
/*
* @function: T3_CallBack
* @param   : None
* @retval  : None
* @brief   : T3中断服务函数
*/
#pragma vector = T3_VECTOR
__interrupt void T3_CallBack(void)
{
    T3IF = 0;   // 清除中断标志位(可要可不要，硬件自动清0了)
    
    System.Task_Mask(); // 任务标记
}
```

{% endfolding %}

> 使用T4定时1ms

{% folding, Timer.c %}

```cpp
/*
* @function: Timer1_Init
* @param   : None
* @retval  : None
* @brief   : 定时器1初始化
*/
static void Timer1_Init(void)
{
    /*配置定时器1为1ms --- 32000000/32/1000 = 1000Hz 1/1000Hz = 0.001s*/
    T1CTL = 0x0A;   // 【控制寄存器】模模式，32分频，中断使能 --- 0000 1010
    T1CC0H = 0x03;      // 定时器高8位
    T1CC0L = 0xE8;   // 定时器低8位
    T1CCTL0 |= 0x04; // 【捕获/比较控制寄存器】设置模式为比较模式 --- 0100 0000 | 0000 0100
    T1IE = 1;   // 【T1中断使能】使能T1定时器中断
}
```

{% endfolding %}

{% folding, Callback.c %}

```cpp
#pragma vector = T1_VECTOR
__interrupt void T1_CallBack(void)
{
    T1IF = 0;   // 清除中断标志位(可要可不要，硬件自动清0了)
    
    static uint16_t Led_Cnt = 0;
    
    Led_Cnt++;
    
    if (Led_Cnt >= 1000)
    {
        Led_Cnt = 0;
        Led.Led_Flip();
    }
}
```

{% endfolding %}



#### 看门狗

如果一个应用不需要看门狗功能，可以配置看门狗定时器为一个间隔定时器，这样可以用于在选定的时间间隔产生中断

● 四个可选的定时器间隔
● 看门狗模式
● 定时器模式
● 在定时器模式下产生中断请求

`WDT` 可以配置为 `一个看门狗定时器` 或 `一个通用的定时器`， `WDT` 模块的运行由 `WDCTL` 寄存器控制，看门狗定时器包括一个 `15` 位计数器，它的频率由 `32kHz` 时钟源规定

在看门狗模式下， `WDT` 不会产生一个中断请求

`WDT` 运行在一个频率为 `32.768 kHz`（当使用32 kHz XOSC）的看门狗定时器时钟上。这个时钟频率的超时期限等于 `1.9ms，15.625 ms，0.25 s 和1s`，分别对应 `64，512，8192 和32768` 的计数值设置

`喂狗`：当0xA跟随0x5写到【WDCTL寄存器】bit[7:4]，定时器被清除（即加载0）。注意定时器仅写入0xA后，在1个看门狗时钟周期内写入0x5时被清除



{% tip bolt %}寄存器{% endtip %}

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231119220205.webp" style="zoom: 67%;" />

- 程序编写

{% folding, WatchDog.h %}

```cpp
#ifndef __WATCHDOG_H
#define __WATCHDOG_H

typedef struct
{
    void (*WatchDog_Init)(void);        // 看门狗初始化
    void (*WatchDog_Feet)(void);   // 看门狗喂狗
} WatchDog_st;


extern WatchDog_st WatchDog;

#endif
```

{% endfolding %}

{% folding, WatchDog.c %}

```cpp
/***************************************************************************
 * File          : WatchDog.c
 * Author        : Yang
 * Date          : 2023-11-19
 * description   : 看门狗
 -----------------------------------
  
 -----------------------------------   
****************************************************************************/
#include "Allhead.h"

/* Private function prototypes===============================================*/
static void WatchDog_Init(void);
static void WatchDog_Feet(void);
/* Public variables==========================================================*/
WatchDog_st WatchDog = 
{
    .WatchDog_Init = &WatchDog_Init,
    .WatchDog_Feet = &WatchDog_Feet
};

/*
* @function: WatchDog_Init
* @param   : None
* @retval  : None
* @brief   : 看门狗初始化
*/
static void WatchDog_Init(void)
{
    WDCTL = 0x00;       // 【看门狗定时器控制寄存器】停止看门狗
    WDCTL = 0x08;       // 【看门狗定时器控制寄存器】开启看门狗模式，定时时间为1S(需要运行在32KHz XOSC下) --- 0000 1000
}

/*
* @function: WatchDog_Feet
* @param   : None
* @retval  : None
* @brief   : 喂狗
*/
static void WatchDog_Feet(void)
{
    // 在看门狗模式下，当 0xA 后面跟着 0x5 写入 bit[7:4] (即写入寄存器高4位)时,定时器被清零
    WDCTL |= (0xA << 4);
    WDCTL |= (0x5 << 4);
}
```

{% endfolding %}





#### 低功耗定时器

睡眠定时器的主要功能如下：

●  `24` 位的定时器正计数器，运行在 `32kHz ` 的时钟频率(可以是 `RCOSC` 或 `XOSC` )
●  `24` 位的比较器，具有中断和DMA 触发功能
●  `24` 位捕获

注意如果电压降到 `2V` 以下同时处于 `PM2`，睡眠间隔将会受到影响

> CC2530有以下集中电源管理模式：
>
> **（1）全功能模式**
> 高频晶振（16M或者32M）和低频晶振（32.768K RCOSC/XOSC）全部工作，数字处理器模块正常工作
>
> **（2）空闲模式**
> 除了CPU内核停止运行之外，其他和全功能模式一样
>
> **（3）PM1**
> 高频晶振关闭，低频晶振正常工作，数字核心模块正常工作
>
> **（4）PM2**
> 低频晶振工作，数字核心模块关闭，系统通过RESET，外部中断或者休眠计数器溢出唤醒
>
> **（5）PM3**
> 晶振全部关闭，数字处理器核心模块关闭，系统只能通过RESET或者外部中断唤醒，此模式功耗最低

> 由于休眠定时器工作的时钟频率是 `32768` HZ，也就是计数 `32768次为1秒`
>
> 配置休眠时间时，只需要把当前的计数器数值读出来，加上我们需要定时的时间计数值再重新设置到寄存器中即可



{% tip bolt %}低功耗相关寄存器{% endtip %}

`ST0，ST1,ST2` 一起组成 `24` 位睡眠计数器

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231120093242.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231120093334.webp)

{% endgallery %}

{% tip bolt %}电源管理相关寄存器(手册4.3){% endtip %}

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231120094745.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231120095041.webp)

{% endgallery %}



- 程序编写

{% folding, LowPower.h %}

```cpp
#ifndef __LOWPOWER_H
#define __LOWPOWER_H

typedef enum
{
    POWER_MODE_IDLE = 0x00,     // 空闲模式【对应寄存器00】
    POWER_MODE_PM1 = 0x01,      // 供电模式1【对应寄存器01】
    POWER_MODE_PM2 = 0x02,      // 供电模式2【对应寄存器10】
    POWER_MODE_PM3 = 0x03,      // 供电模式3【对应寄存器11】
    POWER_MODE_ACTIVE = 0x04,   // 恢复到正常模式
    _POWER_MODE_MAX = POWER_MODE_ACTIVE, // 最大值
} LowPower_Mode_et;

typedef struct
{
    void (*LowPower_Init)(void); // 低功耗初始化
    void (*LowPower_Set_SleepTime)(uint8_t);   // 设置睡眠时间
    void (*LowPower_Set_Mode)(LowPower_Mode_et);      // 设置低功耗模式
} LowPower_st;

extern LowPower_st LowPower;
#endif
```

{% endfolding %}

{% folding, LowPower.c %}

```cpp
/***************************************************************************
 * File          : LowPower.c
 * Author        : Yang
 * Date          : 2023-11-20
 * description   : 低功耗模式
 -----------------------------------
  
 -----------------------------------   
****************************************************************************/
#include "AllHead.h"

/* Private function prototypes===============================================*/
static void LowPower_Init(void);
static void LowPower_Set_SleepTime(uint8_t sec);
static void LowPower_Set_Mode(LowPower_Mode_et mode);

/* Public variables==========================================================*/
LowPower_st LowPower = 
{
    .LowPower_Init = &LowPower_Init,
    .LowPower_Set_SleepTime = &LowPower_Set_SleepTime,
    .LowPower_Set_Mode = &LowPower_Set_Mode
};


/*
* @function: LowPower_Init
* @param   : None
* @retval  : None
* @brief   : 低功耗初始化
*/
static void LowPower_Init(void)
{
    ST0 = 0;    // 【休眠定时器0寄存器】 --- 清0
    ST1 = 0;    // 【休眠定时器1寄存器】 --- 清0
    ST2 = 0;    // 【休眠定时器2寄存器】 --- 清0
    STIE = 1;   // 使能睡眠定时器中断
    STIF = 0;   // 清除中断标志位   
}

/* 
* @function: LowPower_Set_SleepTime
* @param   : sec -> 秒
* @retval  : None
* @brief   : 设置休眠时间
*/
static void LowPower_Set_SleepTime(uint8_t sec)
{
    uint32_t sleep_time = 0;
    /*先读出计数器里的值，因为它分3个寄存器存储所以需要最后合并*/
    sleep_time = (uint32_t)ST0;   // 【7:0】
    sleep_time |= (uint32_t)ST1 << 8;      // 【15:8】
    sleep_time |= (uint32_t)ST2 << 16;     // 【23:16】

    sleep_time += (uint32_t)sec * 32768;        // 更新睡眠时间

    /*设置计数器*/
    ST2 = (uint8_t)(sleep_time >> 16);    // 【23:16】
    ST1 =(uint8_t)(sleep_time >> 8);      // 【15:8】
    ST0 = (uint8_t)(sleep_time);  // 【7:0】
}

/*
* @function: LowPower_Set_Mode
* @param   : None
* @retval  : None
* @brief   : 设置低功耗模式
*/
static void LowPower_Set_Mode(LowPower_Mode_et mode)
{
    if (mode > _POWER_MODE_MAX)
    {
        return;
    }
    
    if (POWER_MODE_ACTIVE == mode)
    {
        PCON |= 0x00;   // 不进入低功耗
        return;
    }
    
    SLEEPCMD |= mode;   // 设置模式
    PCON = 0x01;        // 【0位写1】进入低功耗
}
```

{% endfolding %}



> PM1，PM2进入低功耗后任务正常运行，Task里喂狗也正常
>
> PM3的话只能外部中断和复位唤醒
>
> 全功能模式的话跟平时没什么区别





### 串口

- 硬件连接

板子默认使用了 `P0_2` 和 `P0_3` 作为USART0的引脚,需要把拨码开关的 `1,2` 位拨到

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231120144120.webp)



CC2530有两个串口，分别是 `串口0` 和 `串口1`，它们能够分别运行于 `异步UART模式` 或者 `同步SPI 模式`

波特率设置是需要通过 `UxGCR` 和 `UxBAUD` 寄存器进行设置的，具体值可参考手册16.4给的推荐值：

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231120154250.webp" style="zoom:67%;" />



{% tip bolt %}相关寄存器{% endtip %}

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231120132950.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231120160245.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231120160348.webp)

{% endgallery %}

串口数据接收与发送缓存寄存器是 `UxDBUF`，中文手册上面可能写出了写成 `UxBUF`，英文的正常

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231120184637.webp)



- 程序编写

{% folding, USART0.h %}

```cpp
#ifndef __USART0_H
#define __USART0_H

#define USART0_RX_MAX_LEN 250
// 通信协议数据长度
#define USART0_Protocol_Len 8


// 常用波特率枚举
typedef enum
{
    USART_BAUD_2400 = 0x00,
    USART_BAUD_4800 = 0x01,
    USART_BAUD_9600 = 0x02,
    USART_BAUD_115200 = 0x03
} USART_Baud_et;

// 奇偶校验枚举
typedef enum
{
    USART_PARITY_ODD = 0x00,   // 奇校验
    USART_PARITY_EVEN = 0x01    // 偶校验
} USART_Check_et;

// 串口接收/发送状态枚举
typedef enum
{
    USART_STATUS_RX = 0x00,     // 接收状态
    USART_STATUS_TX = 0x01,     // 发送状态
} USART_Status_et;

typedef struct
{
    uint16_t Rec_Sta;    // 接收数据长度/数据接收完成标志位
    char Rec_Byte;      // 串口0接收的一个字节数据
    char RecData_Buff[USART0_RX_MAX_LEN];       // 串口0接收缓存数组
    void (*USART0_Init)(void);  // 串口0初始化
    void (*USART0_Send)(uint8_t *data, uint8_t len);       // 串口0发送数据函数
    void (*USART0_Rec_Data_Analyze_1)(void);      // 串口0接收数据解析1
    void (*USART0_Rec_Handler_1)(void);    // 串口0接收数据处理
    void (*USART0_Protocol_Analyze_Handler)(void); // 串口0协议解析
} USART0_st;

extern USART0_st USART0;
extern USART_Status_et USART0_Status;

#endif
```

{% endfolding %}

{% folding, USART0.c %}

```cpp
/***************************************************************************
 * File          : USART0.c
 * Author        : Yang
 * Date          : 2023-11-20
 * description   : 串口0
 -----------------------------------
  
 -----------------------------------   
****************************************************************************/
#include "AllHead.h"

/* Private function prototypes===============================================*/
static void USART0_Init(void);
static void USART0_Baud_Parity_Set(USART_Baud_et baud, USART_Check_et parity);     
static void USART0_Send(uint8_t *data, uint8_t len);     
static void USART0_Rec_Data_Analyze_1(void);
static void USART0_Rec_Handler_1(void);
static void USART0_Protocol_Analyze_Handler(void);
/* Public variables==========================================================*/
USART0_st USART0 = 
{
    .Rec_Sta = 0,
    .Rec_Byte = 0,
    .RecData_Buff = {0},
    .USART0_Init = &USART0_Init,
    .USART0_Send = &USART0_Send,
    .USART0_Rec_Data_Analyze_1 = &USART0_Rec_Data_Analyze_1,
    .USART0_Rec_Handler_1 = &USART0_Rec_Handler_1,
    .USART0_Protocol_Analyze_Handler = &USART0_Protocol_Analyze_Handler
};

USART_Status_et USART0_Status;  // 串口0状态


/*
* @function: USART0_Init
* @param   : None
* @retval  : None
* @brief   : 串口0初始化
*/
static void USART0_Init(void)
{
    PERCFG |= 0x00;      // 【外设控制寄存器】配置P0_2和P0_3用作串口0的TX（发送端）和RX（接收端）
    CC2530_REG_PxSEL(0, 2, 1);  // 配置P0_2为外设功能
    CC2530_REG_PxSEL(0, 3, 1);  // 配置P0_3为外设功能
    P2DIR &= ~0xC0;     // 【端口0外设优先级控制寄存器】将USART0作为第1优先级 --- xxxx xxxx & 0011 1111

    U0CSR |= 0x80;      // 设置USART0工作模式为UART0 --- 1000 0000
    
    USART0_Baud_Parity_Set(USART_BAUD_115200, USART_PARITY_ODD);   // 波特率，奇偶校验设置 --- 115200,奇校验
    UTX0IF = 0; // 清除发送中断标志位
    URX0IE = 1; // 打开接收中断标志位
    
    U0CSR |= 0x40;      // 使能接收 --- 1000 0000 | 0100 0000 = 1100 0000

    USART0_Status = USART_STATUS_RX;    // 默认接收状态
}

/*
* @function: USART0_Baud_Parity_Set
* @param   : None
* @retval  : None
* @brief   : 串口波特率，奇偶校验设置
*/
static void USART0_Baud_Parity_Set(USART_Baud_et baud, USART_Check_et parity)
{
    if (USART_PARITY_ODD == parity)     // 奇校验
    {
        U0UCR &= ~0x20; // 【UART 控制】
    }
    else if (USART_PARITY_EVEN == parity)       // 偶校验
    {
        U0UCR |= 0x38;
    }
    
    U0GCR &= ~0x1F;     // 【U0通用控制寄存器】把波特率设置位清0
    
    switch(baud)
    {
        case USART_BAUD_2400:
        {
            U0BAUD = 59;        // 【U0波特率控制寄存器】，查手册表
            U0GCR = 6;  // 【U0通用控制寄存器】，查手册表
            break;
        }
        case USART_BAUD_4800:
        {
            U0BAUD = 59;        // 【U0波特率控制寄存器】，查手册表
            U0GCR = 7;  // 【U0通用控制寄存器】，查手册表            
            break;
        }
        case USART_BAUD_9600:
        {
            U0BAUD = 59;        // 【U0波特率控制寄存器】，查手册表
            U0GCR = 8;  // 【U0通用控制寄存器】，查手册表            
            break;
        }
        case USART_BAUD_115200:
        {
            U0BAUD = 216;        // 【U0波特率控制寄存器】，查手册表
            U0GCR = 11;  // 【U0通用控制寄存器】，查手册表            
            break;
        }
        default:
        {
            U0BAUD = 59;        // 【U0波特率控制寄存器】，查手册表
            U0GCR = 8;  // 【U0通用控制寄存器】，查手册表            
            break;
        }
    }
}

/*
* @function: USART0_Send
* @param   : data -> 要发送的数据 len -> 发送长度
* @retval  : None
* @brief   : 串口0发送函数
*/
static void USART0_Send(uint8_t *data, uint8_t len)
{
    uint8_t i;
    
    for (i = 0; i < len; i++)
    {
        U0DBUF = data[i];        // 数据存储到【数据缓存寄存器】
        while (0 == UTX0IF);    // 等待发送完成
        UTX0IF = 0;     // 清除中断标志位
    }
}

/*
* @function: USART0_Rec_Data_Analyze_1
* @param   : None
* @retval  : None
* @brief   : 串口0接收数据解析1
*/
static void USART0_Rec_Data_Analyze_1(void)
{
    USART0.Rec_Byte = U0DBUF;
    
    if (USART_STATUS_RX == USART0_Status)       // 判断是不是接收状态
    {
        if (0 == (USART0.Rec_Sta & 0x8000))     // 完成标志位为0则进入
        {
            if (USART0.Rec_Sta < USART0_RX_MAX_LEN)     // 还可以接收数据
            {
                if (0 == USART0.Rec_Sta)
                {
                    T4CNT = 0; // CNT清0，否则有时接收的数据会丢失！！！
                    T4IE = 1;   // 打开定时器中断
                    T4IF = 0;   // 清除定时器中断标志位
                }
//                if ('\n' == USART0.Rec_Byte)    // 判断结束符
//                {
//                    USART0.RecData_Buff[USART0.Rec_Sta - 1] = 0;        // 去掉前面的 '\r'这样就不会换行了
//                    USART0.Rec_Sta |= 0x8000;   // 接收完成标志位置1
//                }
//                else
//                {
                    USART0.RecData_Buff[USART0.Rec_Sta++] = USART0.Rec_Byte;
//                }
            }
            else
            {
                USART0.Rec_Sta |= 0x8000;   // 强制接收完成标志位置1
            }
        }
    }
    else
    {
        USART0.Rec_Byte = 0;
    }
}

/*
* @function: USART0_Rec_Handler_1
* @param   : None
* @retval  : None
* @brief   : 串口0接收数据处理1
*/
static void USART0_Rec_Handler_1(void)
{
    uint16_t rx_len = 0;
    
    if (USART0.Rec_Sta & 0x8000)
    {
        rx_len = USART0.Rec_Sta & 0x7FFF;       // 会算上最后的0
        USART0.RecData_Buff[rx_len] = 0;        // 添加结束符
        USART0_Status = USART_STATUS_TX;        // 设置为发送状态
        USART0.USART0_Send((uint8_t*)USART0.RecData_Buff,strlen(USART0.RecData_Buff));  // 发送回去
        memset(USART0.RecData_Buff, 0, rx_len - 1);     // 清空数组等待下次接收
        USART0.Rec_Byte = 0;    // 接收的最新字节清0
        USART0.Rec_Sta = 0;     // 接收完成标志位置0
        USART0_Status = USART_STATUS_RX;        // 设置为接收状态
    }           
}

/*
* @function: USART0_Protocol_Analyze_Handler
* @param   : None
* @retval  : None
* @brief   : 串口0协议解析
*/
static void USART0_Protocol_Analyze_Handler(void)
{
    uint8_t temp_arr[USART0_Protocol_Len] = {0x00};
    uint8_t i = 0, Index = 0, rx_len = 0;
 
    if (USART0.Rec_Sta & 0x8000)
    {
        USART0_Status = USART_STATUS_TX;        // 设置为发送状态
        
        rx_len = USART0.Rec_Sta & 0x7FFF;       // 会算上最后的0

        for (i = 0; i < rx_len; i++)
        {
            if (0 == Index)
            {
                if (USART0.RecData_Buff[i] != 0xAA)
                {
                    continue;
                }
            }
            temp_arr[Index] = USART0.RecData_Buff[i];
            if (USART0_Protocol_Len == Index)
            {
                break;
            }
            Index++;
        }
        // 数据处理
        if (USART0_Protocol_Len == Index)
        {
            if ((0xAA == temp_arr[0]) && (0xBB == temp_arr[7]))     // 判断帧头帧尾
            {
                if (0x01 == temp_arr[1])
                {
                    switch (temp_arr[2])
                    {
                        case 0x01:  // AA 01 01 00 00 00 00 BB
                        {
                            Led.Led_Open();
                            break;
                        }
                        case 0x02:  // AA 01 02 00 00 00 00 BB
                        {
                            Led.Led_Close();
                            break;
                        }                    
                        default:break;
                    }
                }
            }
        }
        memset(USART0.RecData_Buff, 0, rx_len - 1);     // 清空数组等待下次接收
        USART0.Rec_Byte = 0;    // 接收的最新字节清0
        USART0.Rec_Sta = 0;     // 接收完成标志位置0
        USART0_Status = USART_STATUS_RX;        // 设置为接收状态        
    }    
}
```

{% endfolding %}

{% folding, Callback.c %}

```cpp
/*
* @function: USART0_RX_CallBack
* @param   : None
* @retval  : None
* @brief   : 串口0中断服务函数
*/
#pragma vector = URX0_VECTOR
__interrupt void USART0_RX_CallBack(void)
{
    URX0IF = 0;   // 清除中断标志位

    USART0.USART0_Rec_Data_Analysis_1();	// 数据解析
}
```

{% endfolding %}

> 加一个定时器10ms间隔进行计数接收中断写法，在上面基础上修改或者添加
>
> 这种的话很稳
>
> 下面有两种定时器示例：T1和T4，T4只能最大定时1ms所以需要在中断里面进行递增10次才算10ms

{% folding, USART0.c %}

```cpp
/*
* @function: USART0_Rec_Data_Analysis_1
* @param   : None
* @retval  : None
* @brief   : 串口0接收数据解析1
*/
static void USART0_Rec_Data_Analysis_1(void)
{
    USART0.Rec_Byte = U0DBUF;
    
    if (USART_STATUS_RX == USART0_Status)       // 判断是不是接收状态
    {
        if (0 == (USART0.Rec_Sta & 0x8000))     // 完成标志位为0则进入
        {
            if (USART0.Rec_Sta < USART0_RX_MAX_LEN)     // 还可以接收数据
            {
                if (0 == USART0.Rec_Sta)
                {
                    T1CNTH = 0; // CNT清0，否则有时接收的数据会丢失！！！
                    T1CNTL = 0;
                    T1IE = 1;   // 打开定时器中断
                    T1IF = 0;   // 清除定时器中断标志位
//                    T4CNT = 0; // CNT清0，否则有时接收的数据会丢失！！！
//                    T4IE = 1;   // 打开定时器中断
//                    T4IF = 0;   // 清除定时器中断标志位                    
                }
                    USART0.RecData_Buff[USART0.Rec_Sta++] = USART0.Rec_Byte;
            }
            else
            {
                USART0.Rec_Sta |= 0x8000;   // 强制接收完成标志位置1
            }
        }
    }
    else
    {
        USART0.Rec_Byte = 0;
    }
}
```

{% endfolding %}

{% folding, Timer.c %}

```cpp
/*
* @function: Timer1_Init
* @param   : None
* @retval  : None
* @brief   : 定时器1初始化
*/
static void Timer1_Init(void)
{
    /*配置定时器1为1ms --- 32000000/32/10000 = 100Hz 1/100Hz = 0.01s*/
    T1CTL = 0x0A;   // 【控制寄存器】模模式，32分频，中断使能 --- 0000 1010
    T1CC0H = 0x27;      // 定时器高8位
    T1CC0L = 0x10;   // 定时器低8位
    T1CCTL0 |= 0x04; // 【捕获/比较控制寄存器】设置模式为比较模式 --- 0100 0000 | 0000 0100
    T1IE = 0;   // 【T1中断使能】不使能T1定时器中断
}

//static void Timer4_Init(void)
//{
//    /*配置定时器3为1ms --- 32000000/128/250 = 1000Hz 1/1000Hz = 0.001s*/
//    T4CTL = 0xFA;   // 【控制寄存器】模模式，128分频，中断使能，定时器开启 --- 1111 1010
//    T4CC0 = 0xFA;   // 【捕获/比较值寄存器】MAX是255 --- 1111 1010
//    T4CCTL0 |= 0x04; // 【捕获/比较控制寄存器】设置模式为比较模式 --- 0100 0000 | 0000 0100
//    T4IE = 0;   // 【T4中断使能】不使能T4定时器中断
//}       
```

{% endfolding %}

{% folding, Callback.c %}

```cpp
/*
* @function: T1_CallBack
* @param   : None
* @retval  : None
* @brief   : T1中断服务函数
*/
#if USE_TIM1
#pragma vector = T1_VECTOR
__interrupt void T1_CallBack(void)
{
    T1IF = 0;   // 清除中断标志位(可要可不要，硬件自动清0了)
    
    T1IE = 0;	// 停止定时器中断
    USART0.Rec_Sta |= 0x8000;	// 接收标志位置1
}

//#pragma vector = T4_VECTOR
//__interrupt void T4_CallBack(void)
//{
//    T4IF = 0;   // 清除中断标志位(可要可不要，硬件自动清0了)
//    
//    static uint8_t usart_Cnt = 0;
//    
//    usart_Cnt++;
//    
//    if (usart_Cnt >= 10)
//    {
//        usart_Cnt = 0;
//        T4IE = 0;
//        USART0.Rec_Sta |= 0x8000;        
//    }
//}
```

{% endfolding %}



### ADC实验

CC2530中内置了多个ADC采样通道，例如 `AIN0~AIN7`、 `VDD/3`、 `芯片内置的温度传感器` 等，CC2530提供了8位、10位、12位和14位的模数转换采样分辨率可供开发者使用                                                                                                   

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231122162219.webp" style="zoom:67%;" />

{% tip bolt %}相关寄存器{% endtip %}

单个通道的话使用  `ADCCON3` 即可

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231122195303.webp)

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231122202644.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231122203142.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231122204534.webp)



{% endgallery %}





#### 光照传感器

{% tip bolt %}模块信息{% endtip %}

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231118132717.webp" style="zoom:50%;" />

其输出电压值范围是 `0~1.65v`，越亮电压越小，这是一个模拟信号值

- 硬件连接

引脚连接到 `P0_7`，需要把拨码开关打到ADC那

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231122163156.webp" style="zoom:67%;" />

- 程序编写

{% folding, bsp_ADC.h %}

```cpp
#ifndef __BSP_ADC_H
#define __BSP_ADC_H

#define LightSensor_Port 0
#define LightSensor_Pin 7



typedef struct
{
    void (*Bsp_ADC_Init)(void);
    uint8_t (*Bsp_ADC_Get_Value)(void);  
} bsp_ADC_st;


extern bsp_ADC_st bsp_ADC;

#endif

```

{% endfolding %}

{% folding, bsp_ADC.c %}

```cpp
/***************************************************************************
 * File          : bsp_ADC.c
 * Author        : Yang
 * Date          : 2023-11-22
 * description   : ADC
 -----------------------------------
  
 -----------------------------------   
****************************************************************************/
#include "AllHead.h"

/* Private function prototypes===============================================*/
static void Bsp_ADC_Init(void);
static uint8_t Bsp_ADC_Get_Value(void);     
     
/* Public variables==========================================================*/
bsp_ADC_st bsp_ADC = 
{
    .Bsp_ADC_Init = &Bsp_ADC_Init,
    .Bsp_ADC_Get_Value = &Bsp_ADC_Get_Value
};

/*
* @function: Bsp_ADC_Init
* @param   : None
* @retval  : None
* @brief   : ADC初始化
*/
static void Bsp_ADC_Init(void)
{
    P0SEL |= 0x80;      // 【端口0功能选择寄存器】外设功能 --- 1000 0000
    CC2530_REG_PxDIR(0, 7, 0);  // 设置为输入模式,引脚复位默认已经是上拉
    APCFG |= 0x80;      // 【模拟外设IO配置寄存器】 --- 使能ADC通道7
}

/*
* @function: Bsp_ADC_Get_Value
* @param   : None
* @retval  : None
* @brief   : 获取ADC值
*/
static uint8_t Bsp_ADC_Get_Value(void)
{
    uint16_t result;
    
    ADCCON3 = 0x07; // 【ADC控制3寄存器】内部参考电压，512抽取率，AIN7 --- 0011 0111

    while (!(ADCCON1 & 0x80));  // 【ADC控制1寄存器】等待数据采集

    result = (uint16_t)ADCL;
    result |= (uint16_t)ADCH << 8;
    result = result >> 8;
    
    return ((uint8_t)result);
}
```

{% endfolding %}



### OLED

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231123100438.webp" style="zoom:50%;" />

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231123100500.webp" style="zoom:67%;" />

|         引脚         |
| :------------------: |
|         GND          |
|   VCC `(2.8~5.5V)`   |
| SCL(D0)-- `SPI时钟`  |
| SDA(D1)-- `SPI数据`  |
|    CS-- `SPI片选`    |
|     RES-- `复位`     |
| DC-- `数据/命令选择` |



- 硬件连接

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231123105525.webp)



{% tip bolt %}硬件SPI相关寄存器{% endtip %}

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231123125022.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231123131206.webp)

{% endgallery %}



> 使用硬件SPI

需要把板子把拨码开关的 `第8、9和10位` 分别打到 `CLK`、 `SDI` 和 `SDO` 端(其实SDO可以不拨过去因为没用上)

- 共用部分代码

{% folding, CC2530_SPI_Common.h %}

```cpp
#ifndef __CC2530_SPI_COMMON_H
#define __CC2530_SPI_COMMON_H

/*
SPI参数：交替、位顺序、时钟极性、时钟相位
*/
// alternate
#define SPI1_ALT2        3  // CC2530 - SCK:P1_5, MISO:P1_6, MOSI:P1_7
// bit order
#define SPI_BITORDER_MSB 0  // MSB
#define SPI_BITORDER_LSB 1  // LSB
// clock polarity
#define SPI_CPOL_LOW     0  // low level
#define SPI_CPOL_HIGH    1  // high level
// clock phase
#define SPI_CPHA_FIRST   0  // sample in first edge
#define SPI_CPHA_SECOND  1  // sample in second edge

/*
SPI引脚 --- 输出，输入，输出高、低电平，获取电平状态
*/
// 输出
#define SPI_GPIO_OUTPUT(port,pin) CC2530_IO_CTRL(port,pin,CC2530_OUTPUT)
//输入
#define SPI_GPIO_INPUT(port,pin) CC2530_IO_CTRL(port,pin,CC2530_INPUT_PULLUP)
// 输出高电平
#define SPI_GPIO_SET(port,pin) CC2530_GPIO_SET(port,pin)
// 输出低电平
#define SPI_GPIO_RESET(port,pin) CC2530_GPIO_RESET(port,pin)
// 获取电平
#define SPI_GPIO_READ(port,pin) CC2530_GPIO_READ(port,pin)

/*
SPI CS引脚初始化
*/
#define SPI_CS_INIT(cs_port,cs_pin) do {   \
   SPI_GPIO_OUTPUT(cs_port,cs_pin); \
   SPI_GPIO_SET(cs_port,cs_pin); \
} while(0)

/*
SPI 选择/释放SPI芯片
*/
#define SPI_CS_SELECT(cs_port,cs_pin) CC2530_GPIO_RESET(cs_port,cs_pin)
#define SPI_CS_RELEASE(cs_port,cs_pin) CC2530_GPIO_SET(cs_port,cs_pin)

#endif
```

{% endfolding %}



- 程序编写

{% folding, HW_SPI.h %}

```cpp
#ifndef __HW_SPI_H
#define __HW_SPI_H

/*
硬件SPI参数：交替、位顺序、时钟极性、时钟相位
*/
// alternate
#define HW_SPI1_ALT2        3  // CC2530 - SCK:P1_5, MISO:P1_6, MOSI:P1_7
// bit order
#define HW_SPI_BITORDER_MSB 0  // MSB
#define HW_SPI_BITORDER_LSB 1  // LSB
// clock polarity
#define HW_SPI_CPOL_LOW     0  // low level
#define HW_SPI_CPOL_HIGH    1  // high level
// clock phase
#define HW_SPI_CPHA_FIRST   0  // sample in first edge
#define HW_SPI_CPHA_SECOND  1  // sample in second edge



typedef struct
{
    uint8_t Alternate;  // 交替
    uint8_t BitOrder;   // 位顺序
    uint8_t CPOL;       // 极性
    uint8_t CPHA;       // 相位
} _HW_SPI_Parameter_st;

typedef struct
{
    void (*HW_SPI_Init)(_HW_SPI_Parameter_st *spi_device); // 硬件SPI初始化
    int (*HW_SPI_TxByte)(uint8_t alternate, uint8_t dat);  // 硬件SPI发送一个字节
    uint8_t (*HW_SPI_RxByte)(uint8_t alternate);   // 硬件SPI接收一个字节
} HW_SPI_st;


extern HW_SPI_st HW_SPI;

#endif
```

{% endfolding %}

{% folding, HW_SPI.c %}

```cpp
/***************************************************************************
 * File          : HW_SPI.c
 * Author        : Yang
 * Date          : 2023-11-23
 * description   : 硬件SPI
 -----------------------------------
  OLED --- SCK:P1_5, MOSI:P1_6, MISO:P1_7
 -----------------------------------   
****************************************************************************/
#include "AllHead.h"

/* Private function prototypes===============================================*/
static void HW_SPI_Init(_HW_SPI_Parameter_st *spi_device);
static void CC2530_SPI1_Init(uint8_t alternate, uint8_t bit_order, uint8_t cpol, uint8_t cpha);
static int HW_SPI_TxByte(uint8_t alternate, uint8_t dat);
static uint8_t HW_SPI_RxByte(uint8_t alternate);

static int CC2530_SPI1_TxByte(uint8_t dat);
static uint8_t CC2530_SPI1_RxByte(void);
/* Public variables==========================================================*/
HW_SPI_st HW_SPI = 
{
    .HW_SPI_Init = &HW_SPI_Init,
    .HW_SPI_TxByte = &HW_SPI_TxByte,
    .HW_SPI_RxByte = &HW_SPI_RxByte
};

/*
* @function: HW_SPI_Init
* @param   : None
* @retval  : None
* @brief   : 硬件SPI初始化
*/
static void HW_SPI_Init(_HW_SPI_Parameter_st *spi_device)
{
    switch (spi_device->Alternate)
    {
        case HW_SPI1_ALT2:
        {
            CC2530_SPI1_Init(HW_SPI1_ALT2, spi_device->BitOrder, spi_device->CPOL, spi_device->CPHA);
            break;
        }
        default:break;
    }
}


/*
* @function: CC2530_SPI1_Init
* @param   : None
* @retval  : None
* @brief   : SPI1初始化
*/
static void CC2530_SPI1_Init(uint8_t alternate, uint8_t bit_order, uint8_t cpol, uint8_t cpha)
{
    U1CSR = 0;  // 模式选择 UART1 SPI 模式为主
    U1GCR |= 0x11;      // 设置波特率
    U1BAUD = 0x00;
    
    if (HW_SPI1_ALT2 == alternate)
    {
        PERCFG |= 0x02; // 将 USART1 I/O 设置为 P1 引脚上的备用 2 个位置 --- 0000 0010

        P1SEL |= 0xE0;  // 外设功能 --- 1110 0000
    }
    /* 位顺序 */
    if (HW_SPI_BITORDER_MSB == bit_order)       
    {
        U1GCR |= (1 << 5);      // 高位先传
    }
    else
    {
        U1GCR &= ~(1 << 5);     // 低位先传
    }
    /*设置极性*/
    if (HW_SPI_CPOL_HIGH == cpol)
    {
        U1GCR |= (1 << 7);      // 正时钟
    }
    else
    {
        U1GCR &= ~(1 << 7);     // 负时钟
    }
    /*设置相位*/
    if (HW_SPI_CPHA_FIRST == cpha)
    {
        U1GCR &= ~(1 << 6);     
    }
    else
    {
        U1GCR |= (1 << 6);
    }
    
    P2SEL &= ~0x20;     // 设置串口1优先于T3
    U1CSR |= 0x40;      // 启动SPI
}

/*
* @function: HW_SPI_TxByte
* @param   : None
* @retval  : SUCCESS: 0, Other: -1
* @brief   : 硬件spi发送一个字节
*/
static int HW_SPI_TxByte(uint8_t alternate, uint8_t dat)
{
    int ret = -1;
    
    if (HW_SPI1_ALT2 == alternate)
    {
        ret = CC2530_SPI1_TxByte(dat);
    }
    
    return ret;
}

/*
* @function: HW_SPI_RxByte
* @param   : None
* @retval  : 接收到的字节数据
* @brief   : 硬件SPI接收一个字节
*/
static uint8_t HW_SPI_RxByte(uint8_t alternate)
{
    uint8_t dat = 0x00;
    
    if (HW_SPI1_ALT2 == alternate)
    {
        dat = CC2530_SPI1_RxByte();
    }
    return dat;
}

/*
* @function: CC2530_SPI1_TxByte
* @param   : None
* @retval  : SUCCESS: 0, Other: -1
* @brief   : CC2530发送一个字节
*/
static int CC2530_SPI1_TxByte(uint8_t dat)
{
    uint16_t timeout = 6420;    // 32MHZ ~6ms, 16MHZ ~12ms
    
    U1CSR &= ~0x02;     // 【USART1控制和状态】字节还未传输
    U1DBUF = dat;
    
    while (!(U1CSR & 0x02))     // 等待发送完成,发送完对应位置1
    {
        if (0 == --timeout)
        {
            break;
        }
    }
    
    return (0 == timeout) ? -1 : 0;
}

/*
* @function: CC2530_SPI1_RxByte
* @param   : None
* @retval  : None
* @brief   : CC2530接收一个字节
*/
static uint8_t CC2530_SPI1_RxByte(void)
{
    uint8_t dat = U1DBUF;
    
    return dat;
}
```

{% endfolding %}



- 软件模拟SPI

{% folding, SW_SPI.h %}

```cpp
#ifndef __SW_SPI_H
#define __SW_SPI_H


#define SW_SPI_TX 0
#define SW_SPI_RX 1

#define SW_SPI_SCK_DELAY() do{}while(0)

/* 
 *  @brief  TX a bit by SW-SPI bus:
 *	@param  SDA_Port, SDA_Pin - SDA GPIO.
 *	@param  bitOrder - MSB/LSB.
 *	@param  b - byte.
 */
#define SW_SPI_TX_BIT( SDA_Port, SDA_Pin, bitOrder, b ) do {        \
        if ((bitOrder) == SPI_BITORDER_MSB) {                       \
        if (((b) & 0x80) == 0) SPI_GPIO_RESET(SDA_Port, SDA_Pin);   \
        else SPI_GPIO_SET(SDA_Port, SDA_Pin);                       \
        (b) <<= 1;                                                  \
    }                                                               \
    else{                                                           \
        if(((b) & 0x01) == 0) SPI_GPIO_RESET(SDA_Port, SDA_Pin);    \
        else SPI_GPIO_SET(SDA_Port, SDA_Pin);                       \
        (b) >>= 1;                                                  \
    }                                                               \
} while(0)

/** @brief  RX a bit From SW-SPI bus:
 *	@param  SDA_Port, SDA_Pin - SDA GPIO.
 *	@param  bitOrder - MSB/LSB.
 *	@param  b - byte.
 */
#define SW_SPI_RX_BIT( SDA_Port, SDA_Pin, bitOrder, b ) do {    \
    if ((bitOrder) == SPI_BITORDER_MSB) {                       \
        (b) <<= 1;                                              \
        if (SPI_GPIO_READ(SDA_Port, SDA_Pin)) (b) |= 0x01;       \
        else (b) &= 0xFE;                                       \
    }                                                           \
    else {                                                      \
        (b) >>= 1;                                              \
        if(SPI_GPIO_READ(SDA_Port, SDA_Pin)) (b) |= 0x80;        \
        else (b) &= ~0x80;                                      \
    }                                                           \
} while(0)

/*  @brief  CPOL = 1, CPHA = 1; TX/RX a byte.
 *	@param  CLK_Port, CLK_Pin - SPI CLOCK GPIO.
 *	@param  SDA_Port, SDA_Pin - SPI DATA GPIO.
 *	@param  bitOrder - MSB/LSB.
 *	@param  opt - SW_SPI_TX_BYTE, SW_SPI_RX_BYTE.
 *	@param  b - byte.
 */
#define SW_SPI_MODE4_BYTE(CLK_Port, CLK_Pin, SDA_Port, SDA_Pin, bitOrder, opt, b) do {  \
    for (uint8_t __SW_SPI_I = 0; __SW_SPI_I < 8; __SW_SPI_I++) {                          \
        SPI_GPIO_RESET(CLK_Port, CLK_Pin);                                              \
        SW_SPI_SCK_DELAY();                                                             \
        if ((opt) == SW_SPI_TX) SW_SPI_TX_BIT(SDA_Port, SDA_Pin, bitOrder, b);          \
        else SW_SPI_RX_BIT(SDA_Port, SDA_Pin, bitOrder, b);                             \
        SPI_GPIO_SET(CLK_Port, CLK_Pin);                                                \
        SW_SPI_SCK_DELAY();                                                             \
    }                                                                                   \
} while(0)

/*  @brief  CPOL = 0, CPHA = 0; TX/RX a byte.
 *	@param  CLK_Port, CLK_Pin - SPI CLOCK GPIO.
 *	@param  SDA_Port, SDA_Pin - SPI DATA GPIO.
 *	@param  bitOrder - MSB/LSB.
 *	@param  opt - SW_SPI_TX_BYTE, SW_SPI_RX_BYTE.
 *	@param  b - byte.
 */
#define SW_SPI_MODE1_BYTE(CLK_Port, CLK_Pin, SDA_Port, SDA_Pin, bitOrder, opt, b) do { \
    SW_SPI_MODE4_BYTE(CLK_Port,CLK_Pin,SDA_Port,SDA_Pin, bitOrder,opt, b );	           \
    SPI_GPIO_RESET(CLK_Port, CLK_Pin);                                                 \
} while(0)

/*  @brief  CPOL = 0, CPHA = 1; TX/RX a byte.
 *	@param  CLK_Port, CLK_Pin - SPI CLOCK GPIO.
 *	@param  SDA_Port, SDA_Pin - SPI DATA GPIO.
 *	@param  bitOrder - MSB/LSB.
 *	@param  opt - SW_SPI_TX_BYTE, SW_SPI_RX_BYTE.
 *	@param  b - byte.
 */
#define SW_SPI_MODE2_BYTE(CLK_Port, CLK_Pin, SDA_Port, SDA_Pin, bitOrder, opt, b) do { \
    for (uint8_t __SW_SPI_I = 0; __SW_SPI_I < 8; __SW_SPI_I++) {                         \
        SPI_GPIO_SET(CLK_Port, CLK_Pin);                                               \
        SW_SPI_SCK_DELAY();                                                            \
        if((opt) == SW_SPI_TX) SW_SPI_TX_BIT(SDA_Port, SDA_Pin, bitOrder, b);          \
        else SW_SPI_RX_BIT(SDA_Port, SDA_Pin, bitOrder, b);                            \
        SPI_GPIO_RESET(CLK_Port, CLK_Pin);                                             \
        SW_SPI_SCK_DELAY();                                                            \
    }                                                                                  \
} while(0)

/*  @brief  CPOL = 1, CPHA = 0; TX/RX a byte.
 *	@param  CLK_Port, CLK_Pin - SPI CLOCK GPIO.
 *	@param  SDA_Port, SDA_Pin - SPI DATA GPIO.
 *	@param  bitOrder - MSB/LSB.
 *	@param  opt - SW_SPI_TX_BYTE, SW_SPI_RX_BYTE.
 *	@param  b - byte.
 */
#define SW_SPI_MODE3_BYTE(CLK_Port, CLK_Pin, SDA_Port, SDA_Pin, bitOrder, opt, b ) do { \
    SW_SPI_MODE2_BYTE(CLK_Port,CLK_Pin,SDA_Port,SDA_Pin, bitOrder,opt,b);               \
    SPI_GPIO_SET(CLK_Port, CLK_Pin);                                                    \
} while(0)

/*  @brief  Send a byte to SPI-Slave.
 *	@param  CLK_Port, CLK_Pin - SPI CLOCK GPIO.
 *	@param  SDA_Port, SDA_Pin - SPI DATA GPIO.
 *	@param  bitOrder - MSB/LSB.
 *  @param  CPOL, CPHA - Clock polarity, Clock phase.
 *	@param  opt - SW_SPI_TX_BYTE, SW_SPI_RX_BYTE.
 *	@param  b - byte.
 */
#define SW_SPI_BYTE(CLK_Port, CLK_Pin, SDA_Port, SDA_Pin, bitOrder, CPOL, CPHA, opt, b) \
    if((CPOL) == SPI_CPOL_LOW && (CPHA) == SPI_CPHA_FIRST)                              \
        SW_SPI_MODE1_BYTE(CLK_Port,CLK_Pin,SDA_Port,SDA_Pin,bitOrder,opt,b);            \
    else if((CPOL) == SPI_CPOL_LOW && (CPHA) == SPI_CPHA_SECOND)                        \
        SW_SPI_MODE2_BYTE(CLK_Port,CLK_Pin,SDA_Port,SDA_Pin,bitOrder,opt,b);            \
    else if((CPOL) == SPI_CPOL_HIGH && (CPHA) == SPI_CPHA_FIRST)                        \
        SW_SPI_MODE3_BYTE(CLK_Port,CLK_Pin,SDA_Port,SDA_Pin,bitOrder,opt,b);            \
    else if((CPOL) == SPI_CPOL_HIGH && (CPHA) == SPI_CPHA_SECOND)                       \
        SW_SPI_MODE4_BYTE(CLK_Port,CLK_Pin,SDA_Port,SDA_Pin,bitOrder,opt,b)


/*  @brief	Initial SW-SPI Clock.
 */
#define SW_SPI_INIT_CLK(CLK_Port, CLK_Pin, CPOL) do {               \
    SPI_GPIO_OUTPUT(CLK_Port, CLK_Pin);                             \
    if((CPOL) == SPI_CPOL_LOW) SPI_GPIO_RESET(CLK_Port, CLK_Pin);   \
    else SPI_GPIO_SET(CLK_Port, CLK_Pin);                           \
} while(0)

/*  @brief	Initial SW-SPI mode as MOSI/MISO.
 */
#define SW_SPI_INIT_MOSI(MO_Port, MO_Pin)   SPI_GPIO_OUTPUT(MO_Port, MO_Pin)
#define SW_SPI_INIT_MISO(MI_Port, MI_Pin)   SPI_GPIO_OUTPUT(MI_Port, MI_Pin)

/*  @brief	Init. SW-SPI bus.
 *  @param 	CLK_Port, CLK_Pin - SPI Clock GPIO.
 *  @param 	SDA_Port, SDA_Pin - SPI Data GPIO.
 *  @param 	MO_Port, MO_Pin - SPI MOSI GPIO.
 *  @param 	MI_Port, MI_Pin - SPI MISO GPIO.
 *	@param 	CPOL - Clock polarity.
 */
#define SW_SPI_INIT(CLK_Port, CLK_Pin, MO_Port, MO_Pin, MI_Port, MI_Pin, CPOL ) do { \
    SW_SPI_INIT_CLK(CLK_Port, CLK_Pin, CPOL);                                        \
    SW_SPI_INIT_MOSI(MO_Port, MO_Pin);                                               \
    SW_SPI_INIT_MISO(MI_Port, MI_Pin);                                               \
} while(0)

/*  @brief	Tx a byte by SW-SPI bus.
 *  @param  CLK_Port, CLK_Pin - SPI CLOCK GPIO.
 *  @param  MO_Port, MO_Pin - SPI MOSI GPIO.
 *  @param  bitOrder - MSB/LSB.
 *  @param  CPOL, CPHA - Clock polarity, Clock phase.
 *  @param  b - byte.
 *  @note	CS chosen by user.
 */
#define SwSPITxByte(CLK_Port, CLK_Pin, MO_Port, MO_Pin, bitOrder, CPOL, CPHA, b) \
    SW_SPI_BYTE(CLK_Port, CLK_Pin, MO_Port, MO_Pin, bitOrder, CPOL, CPHA, SW_SPI_TX, b)

/*  @brief	Rx a byte by SW(Software) SPI bus.
 *  @param  CLK_Port, CLK_Pin - SPI CLOCK GPIO.
 *  @param  MI_Port, MI_Pin - SPI MISO GPIO.
 *  @param  bitOrder - MSB/LSB.
 *  @param  CPOL, CPHA - Clock polarity, Clock phase.
 *  @param  b - byte.
 *  @note	CS chosen by user.
 */
#define  SwSPIRxByte(CLK_Port, CLK_Pin, MI_Port, MI_Pin, bitOrder, CPOL, CPHA, b) \
    SW_SPI_BYTE(CLK_Port, CLK_Pin, MI_Port, MI_Pin, bitOrder, CPOL, CPHA, SW_SPI_RX, b)

#endif

```

{% endfolding %}

{% folding, SW_SPI.c %}

```cpp
/***************************************************************************
 * File          : SW_SPI.c
 * Author        : Yang
 * Date          : 2023-11-23
 * description   : 软件模拟SPI
 -----------------------------------
  
 -----------------------------------   
****************************************************************************/
#include "AllHead.h"
     
/* Private function prototypes===============================================*/

/* Public variables==========================================================*/




```

{% endfolding %}



- OLED部分(兼容软硬件SPI)

{% folding, oled_spi.h %}

```cpp
#ifndef __OLED_SPI_H
#define __OLED_SPI_H


// 进行选择硬件SPI还是模拟SPI
#if !defined(USE_SPI_HW) && !defined(USE_SPI_SW)
    #define USE_SPI_SW
#endif

// 使用软件SPI
#ifdef USE_SPI_SW

/* SCK */
#define OLED_SPI_SCK_Port 1
#define OLED_SPI_SCK_Pin 5
/* SDA */
#define OLED_SPI_SDA_Port 1
#define OLED_SPI_SDA_Pin 6

#endif

/* CS */
#define OLED_SPI_CS_Port 2
#define OLED_SPI_CS_Pin 0
/* DC */
#define OLED_SPI_DC_Port 1
#define OLED_SPI_DC_Pin 4
/* RST */
#define OLED_SPI_RST_Port 1
#define OLED_SPI_RST_Pin 0

typedef struct
{
    void (*OLED_SPI_Init)(void);
    void (*OLED_SPI_Send_CMD)(uint8_t);
    void (*OLED_SPI_Send_Data)(uint8_t);
} OLED_SPI_st;


extern OLED_SPI_st OLED_SPI;



#endif

```

{% endfolding %}

{% folding, oled_spi.c %}

```cpp
/***************************************************************************
 * File          : oled_spi.c
 * Author        : Yang
 * Date          : 2023-11-23
 * description   : OLED SPI适配层
 -----------------------------------
  
 -----------------------------------   
****************************************************************************/
#include "AllHead.h"
     
/* Private function prototypes===============================================*/
static void OLED_SPI_Init(void);
static void OLED_SPI_Send_CMD(uint8_t cmd);
static void OLED_SPI_Send_Byte(uint8_t byte);
static void OLED_SPI_Send_Data(uint8_t data);
/* Public variables==========================================================*/
OLED_SPI_st OLED_SPI = 
{
    .OLED_SPI_Init = &OLED_SPI_Init,
    .OLED_SPI_Send_CMD = &OLED_SPI_Send_CMD,
    .OLED_SPI_Send_Data = &OLED_SPI_Send_Data
};


/*
* @function: OLED_SPI_Init
* @param   : None
* @retval  : None
* @brief   : OLED SPI 初始化
*/
static void OLED_SPI_Init(void)
{
#ifdef USE_SPI_SW
    SW_SPI_INIT_CLK(OLED_SPI_SCK_Port, OLED_SPI_SCK_Pin,SPI_CPOL_HIGH);
    SW_SPI_INIT_MOSI(OLED_SPI_SDA_Port, OLED_SPI_SDA_Pin);
#else
    _HW_SPI_Parameter_st _HW_SPI_OLED = 
    {
        .Alternate = HW_SPI1_ALT2,
        .BitOrder = HW_SPI_BITORDER_MSB,
        .CPOL = HW_SPI_CPOL_HIGH,
        .CPHA = HW_SPI_CPHA_SECOND
    };
    
    HW_SPI.HW_SPI_Init(&_HW_SPI_OLED);  // 初始化
#endif
    SPI_CS_INIT(OLED_SPI_CS_Port,OLED_SPI_CS_Pin); 
    SPI_GPIO_OUTPUT(OLED_SPI_DC_Port,OLED_SPI_DC_Pin);
    SPI_GPIO_OUTPUT(OLED_SPI_RST_Port,OLED_SPI_RST_Pin);
}

/*
* @function: OLED_SPI_Send_CMD
* @param   : None
* @retval  : None
* @brief   : OLED SPI 发送命令
*/
static void OLED_SPI_Send_CMD(uint8_t cmd)
{
    SPI_CS_SELECT(OLED_SPI_CS_Port,OLED_SPI_CS_Pin);
    SPI_GPIO_RESET(OLED_SPI_DC_Port,OLED_SPI_DC_Pin);
    OLED_SPI_Send_Byte(cmd);    // 发送
    SPI_CS_RELEASE(OLED_SPI_CS_Port,OLED_SPI_CS_Pin);
}

/*
* @function: OLED_SPI_Send_Data
* @param   : None
* @retval  : None
* @brief   : OLED SPI 发送数据
*/
static void OLED_SPI_Send_Data(uint8_t data)
{
    SPI_CS_SELECT(OLED_SPI_CS_Port,OLED_SPI_CS_Pin);
    SPI_GPIO_SET(OLED_SPI_DC_Port,OLED_SPI_DC_Pin);
    OLED_SPI_Send_Byte(data);    // 发送
    SPI_CS_RELEASE(OLED_SPI_CS_Port,OLED_SPI_CS_Pin);    
}


/*
* @function: OLED_SPI_Send_Byte
* @param   : None
* @retval  : None
* @brief   : OLED SPI 发送一个字节
*/
static void OLED_SPI_Send_Byte(uint8_t byte)
{
#ifdef USE_SPI_SW
SwSPITxByte(OLED_SPI_SCK_Port, OLED_SPI_SCK_Pin,
            OLED_SPI_SDA_Port, OLED_SPI_SDA_Pin,
            SPI_BITORDER_MSB,
            SPI_CPOL_HIGH, HW_SPI_CPHA_SECOND,
            byte);    
#else
    HW_SPI.HW_SPI_TxByte(HW_SPI1_ALT2,byte);
#endif
}



```

{% endfolding %}

{% folding, OLED.h %}

```cpp
#ifndef __OLED_H
#define __OLED_H


#define OLED12864_PAGE      8    //!< Total pages
#define OLED12864_X         128  //!< Max X
#define OLED12864_Y         64   //!< Max Y

/** @brief   Font Table Configuretion.
 *  8x16
 */
#define FONT_TABLE_8x16           FontTable_V_8X16                //!< 8x16 ASCII Char.
#define FONT_TABLE_CHINESE_16x16  FontTable_Chinese_V_16X16       //!< 16x16 Chinese Char.
#define FONT_TABLE_CHINESE_SIZE   FONTTABLE_CHINESE_V_16x16_NUM   //!< Length of the table.

typedef enum
{
    OLED_Line1 = 0,  
    OLED_Line2 = 1,
    OLED_Line3 = 2,
    OLED_Line4 = 3,
} OLED091_Line_t;

typedef struct
{
    void (*OLED_Init)(void);    // OLED初始化
    void (*OLED_Clear)(void);   // OLED清屏
    void (*OLED_Display_x16_String)(uint8_t, uint8_t, const uint8_t *); // OLED显示字符串
    void (*OLED_Display_Picture)(uint8_t, uint8_t, uint8_t, uint8_t, const uint8_t *);  // OLED显示图标
    void (*padString)(char *str, int size);
} OLED_st;


extern OLED_st OLED;



#endif
```

{% endfolding %}

{% folding, OLED.c %}

```cpp
/***************************************************************************
 * File          : OLED.c
 * Author        : Yang
 * Date          : 2023-11-23
 * description   : OLED
 -----------------------------------
  OLED 显示8x16的话一行可以显示16个字符
 -----------------------------------   
****************************************************************************/
#include "AllHead.h"
#include "font_v_8x16.h"
#include "font_chinese_v_16x16.h"
/* Private function prototypes===============================================*/
static void OLED_Init(void);
static void OLED_Config(void);
static void OLED_Reset(void);
static void OLED_Clear(void);
static void OLED_Set_Cursor(uint8_t page, uint8_t x);
static void OLED_Display_x16_String(uint8_t line, uint8_t column, const uint8_t *str);
static void OLED_Display_8x16_Char(uint16_t x, uint16_t page, uint8_t ch);
static void OLED_Display_16x16_Chinese(uint16_t x, uint16_t page,uint8_t chL, uint8_t chR);
static void OLED_Display_Picture(uint8_t x, uint8_t y, uint8_t picWidth, uint8_t picHeight, const uint8_t *pic);
static void padString(char *str, int size);
/* Public variables==========================================================*/
OLED_st OLED = 
{
    .OLED_Init = &OLED_Init,
    .OLED_Clear = &OLED_Clear,
    .OLED_Display_x16_String = &OLED_Display_x16_String,
    .OLED_Display_Picture = &OLED_Display_Picture,
    .padString = &padString
};

/*
* @function: OLED_Init
* @param   : None
* @retval  : None
* @brief   : OLED初始化
*/
static void OLED_Init(void)
{
    OLED_SPI.OLED_SPI_Init();   // SPI初始化
    
    OLED_Config();      // OLED配置
    OLED_Clear();       // OLED清屏
    OLED_Set_Cursor(0, 0);      // 设置起始坐标
}


/*
* @function: OLED_Config
* @param   : None
* @retval  : None
* @brief   : OLED配置
*/
static void OLED_Config(void)
{
    OLED_Reset();       // 复位
    
    OLED_SPI.OLED_SPI_Send_CMD(0xae);  // --turn off oled panel
    OLED_SPI.OLED_SPI_Send_CMD(0x00);  // ---set low column address
    OLED_SPI.OLED_SPI_Send_CMD(0x10);  // ---set high column address
    OLED_SPI.OLED_SPI_Send_CMD(0x40);  // --set start line address  Set Mapping  
                                    //   RAM Display Start Line (0x00~0x3F)
    OLED_SPI.OLED_SPI_Send_CMD(0x81);  // --set contrast control register
    OLED_SPI.OLED_SPI_Send_CMD(0xcf);  // --Set SEG Output Current Brightness
    OLED_SPI.OLED_SPI_Send_CMD(0xa1);  // --Set SEG/Column Mapping     
    OLED_SPI.OLED_SPI_Send_CMD(0xc8);  // --Set COM/Row Scan Direction  
    OLED_SPI.OLED_SPI_Send_CMD(0xa6);  // --set normal display
    OLED_SPI.OLED_SPI_Send_CMD(0xa8);  // --set multiplex ratio(1 to 64)
    OLED_SPI.OLED_SPI_Send_CMD(0x3f);  // --1/64 duty
    OLED_SPI.OLED_SPI_Send_CMD(0xd3);  // --set display offset Shift Mapping RAM 
                                    //   Counter(0x00~0x3F)
    OLED_SPI.OLED_SPI_Send_CMD(0x00);  // --not offset
    OLED_SPI.OLED_SPI_Send_CMD(0xd5);  // --set display clock divide
                                    //   ratio/oscillator oscillator frequency
    OLED_SPI.OLED_SPI_Send_CMD(0x80);  // --set divide ratio, Set Clock as 100 
                                    //   Frames/Sec
    OLED_SPI.OLED_SPI_Send_CMD(0xd9);  // --set pre-charge period
    OLED_SPI.OLED_SPI_Send_CMD(0xf1);  // --Set Pre-Charge as 15 Clocks & Discharge 
                                    //   as 1 Clock
    OLED_SPI.OLED_SPI_Send_CMD(0xda);  // --set com pins hardware configuration
    OLED_SPI.OLED_SPI_Send_CMD(0x12);
    OLED_SPI.OLED_SPI_Send_CMD(0xdb);  // --set vcomh
    OLED_SPI.OLED_SPI_Send_CMD(0x40);  // --Set VCOM Deselect Level
    OLED_SPI.OLED_SPI_Send_CMD(0x20);  // --Set Page Addressing Mode (0x00/0x01/0x02)
    OLED_SPI.OLED_SPI_Send_CMD(0x02);  //
    OLED_SPI.OLED_SPI_Send_CMD(0x8d);  // --set Charge Pump enable/disable
    OLED_SPI.OLED_SPI_Send_CMD(0x14);  // --set(0x10) disable
    OLED_SPI.OLED_SPI_Send_CMD(0xa4);  // --Disable Entire Display On (0xa4/0xa5)
    OLED_SPI.OLED_SPI_Send_CMD(0xa6);  // --Disable Inverse Display On (0xa6/a7) 
    OLED_SPI.OLED_SPI_Send_CMD(0xaf);  // --turn on oled panel   
}

/*
* @function: OLED_Reset
* @param   : None
* @retval  : None
* @brief   : OLED复位
*/
static void OLED_Reset(void)
{
    SPI_GPIO_RESET(OLED_SPI_RST_Port,OLED_SPI_RST_Pin);
    Public.Public_Delay_MS(60);
    SPI_GPIO_SET(OLED_SPI_RST_Port,OLED_SPI_RST_Pin);
}

/*
* @function: OLED_Clear
* @param   : None
* @retval  : None
* @brief   : OLED清屏
*/
static void OLED_Clear(void)
{
    uint8_t page, x;
    
    for (page = 0; page < OLED12864_PAGE; page++)
    {
        OLED_SPI.OLED_SPI_Send_CMD(0xb0 + page);
        OLED_SPI.OLED_SPI_Send_CMD(0x01);
        OLED_SPI.OLED_SPI_Send_CMD(0x10);
        
        for (x = 0; x < OLED12864_X; x++)
        {
            OLED_SPI.OLED_SPI_Send_Data(0);
        }
    }    
}

/*
* @function: OLED_Set_Cursor
* @param   : None
* @retval  : None
* @brief   : OLED设置坐标
*/
static void OLED_Set_Cursor(uint8_t page, uint8_t x)
{
    OLED_SPI.OLED_SPI_Send_CMD( 0xb0 + page );
    OLED_SPI.OLED_SPI_Send_CMD( ((x & 0xf0)>>4)|0x10 );
    OLED_SPI.OLED_SPI_Send_CMD( (x & 0x0f)|0x01 );    
}

/*
* @function: OLED_Display_x16_String
* @param   : None
* @retval  : None
* @brief   : 显示ASCII码-8x16，显示中文-16x16
*/
static void OLED_Display_x16_String(uint8_t line, uint8_t column, const uint8_t *str)
{
    if (!str || line > 3)
    {
        return;
    }

    uint8_t page = line * 2;    // 2 page per line
    const uint8_t *ptext = str; // text

    /* Show text */
    while (*ptext != 0)
    {
        /* ASCII Code: 0~127 */
        if ((*ptext) < 128)
        {
            /* End of line */
            if ((column + 8) > OLED12864_X)
                return;

            /* Show 8x16 ASCII Char. */
            OLED_Display_8x16_Char(column, page, *ptext);
            column += 8;

            ptext++;
        }
        /* Chinese 16x16 characters */
        else
        {
            /* End of line */
            if ((column + 16) > OLED12864_X)
                return;

            OLED_Display_16x16_Chinese(column, page, *ptext, *(ptext + 1));
            column += 16;

            ptext += 2;
        }
    } /* while(*ptext != 0) */
}

/*
* @function: OLED_Display_8x16_Char
* @param   : None
* @retval  : None
* @brief   : 显示8x16字符
*/
static void OLED_Display_8x16_Char(uint16_t x, uint16_t page, uint8_t ch)
{
    uint16_t charIndex;

    /* index of font table, height: 16 */
    if (ch > 32)
        charIndex = (ch - 32) * 16;
    else
        charIndex = 0;

    /* Set first page */
    OLED_Set_Cursor(page, x);
    for (uint8_t j = 0; j < 8; j++)
    {
        OLED_SPI.OLED_SPI_Send_Data(FONT_TABLE_8x16[charIndex + j]);
    }

    /* Set second page */
    OLED_Set_Cursor(page + 1, x);
    for (uint8_t j = 0; j < 8; j++)
    {
        OLED_SPI.OLED_SPI_Send_Data(FONT_TABLE_8x16[charIndex + j + 8]);
    }
}

/*
* @function: OLED_Display_16x16_Chinese
* @param   : None
* @retval  : None
* @brief   : 显示16x16字符
*/
static void OLED_Display_16x16_Chinese(uint16_t x, uint16_t page,uint8_t chL, uint8_t chR)
{
    for (uint16_t i = 0; i < FONT_TABLE_CHINESE_SIZE; i++)
    {
        if (FONT_TABLE_CHINESE_16x16[i].Char16x16[0] != chL || FONT_TABLE_CHINESE_16x16[i].Char16x16[1] != chR)
            continue;

        OLED_Set_Cursor(page, x);
        for (uint8_t j = 0; j < 16; j++)
        {
            OLED_SPI.OLED_SPI_Send_Data(FONT_TABLE_CHINESE_16x16[i].code[j]);
        }

        OLED_Set_Cursor(page + 1, x);
        for (uint8_t j = 0; j < 16; j++)
        {
            OLED_SPI.OLED_SPI_Send_Data(FONT_TABLE_CHINESE_16x16[i].code[j + 16]);
        }
        break;
    }
}

/*
* @function: OLED_Display_Picture
* @param   : None
* @retval  : None
* @brief   : OLED显示图标
*/
static void OLED_Display_Picture(uint8_t x, uint8_t y, uint8_t picWidth, uint8_t picHeight, const uint8_t *pic)
{
    if (x > 127 || y > 64)
        return;

    uint16_t charIndex = 0;
    uint8_t xs = x, xe = x + picWidth - 1;
    uint8_t ys = y / 8, ye = (y + picHeight - 1) / 8;

    for (uint8_t line = ys; line < ye; line++)
    {
        OLED_Set_Cursor(line, x);
        for (uint8_t column = xs; column < (xe + 1); column++)
        {
            OLED_SPI.OLED_SPI_Send_Data(pic[charIndex++]);
        }
    }
}

/*
* @function: OLED_Display_Picture
* @param   : None
* @retval  : None
* @brief   : OLED补全空格
*/
static void padString(char *str, int size)
{
    int len = strlen(str);
    if (len >= size)
    {
        return; // 字符串已经够长了，不需要添加空格
    }
    for (int i = len; i < size; i++)
    {
        if (i < size - 1)
        {
            str[i] = ' '; // 在字符串末尾添加空格
        }
        else
        {
            str[i] = '\0'; // 添加字符串结束符
        }
    }
}
```

{% endfolding %}



### DHT11

- 硬件连接

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231123215051.webp)



- 程序编写

{% folding, DHT11.h %}

```cpp
#ifndef __DHT11_H
#define __DHT11_H

// 端口引脚
#define DHT11_Port 0
#define DHT11_Pin 6

typedef struct
{
    uint8_t DHT11_Over_Falg;    // 完成标志位
    uint8_t Temp;       // 温度
    uint8_t Humi;       // 湿度
    void (*DHT11_Init)(void);   // DHT11初始化
    void (*DHT11_Get_Data)(void);  // DHT11获取数据
} DHT11_st;


extern DHT11_st DHT11;

#endif
```

{% endfolding %}

{% folding, DHT11.c %}

```cpp
/***************************************************************************
 * File          : DHT11.c
 * Author        : Yang
 * Date          : 2023-11-23
 * description   : DHT11温湿度
 -----------------------------------
  
 -----------------------------------   
****************************************************************************/
#include "AllHead.h"

/* Private define============================================================*/
#define DHT11_FALSE         0
#define DHT11_TRUE          1

/* DHT11 Status Code. */
#define DHT11_SC_ERR                DHT11_FALSE
#define DHT11_SC_OK                 DHT11_TRUE
#define DHT11_SC_HUMI_OUTOFRANGE    0xF1
#define DHT11_SC_TEMP_OUTOFRANGE    0xF2
#define DHT11_SC_HT_OUTOFRANGE      0xF3

/* Delay Functions. */   
#define DHT11_DELAY_US(x)   Public.Public_Delay_32MHz_US((x))
#define DHT11_DELAY_MS(x)   Public.Public_Delay_MS((x))
   
/* Set DHT11 GPIO mode. */
#define DHT11_IO_OUTPUT()   CC2530_IO_CTRL(DHT11_Port, DHT11_Pin, CC2530_OUTPUT)
#define DHT11_IO_INPUT()    CC2530_IO_CTRL(DHT11_Port, DHT11_Pin, CC2530_INPUT_PULLDOWN)

/* Set DHT11 GPIO Level. */ 
#define DHT11_IO_SET(port, pin, level) do { \
  if(level) CC2530_GPIO_SET(port, pin);         \
  else CC2530_GPIO_RESET(port, pin);            \
} while(0)

#define DHT11_IO_SET_LO()  DHT11_IO_SET(DHT11_Port, DHT11_Pin, 0)
#define DHT11_IO_SET_HI()  DHT11_IO_SET(DHT11_Port, DHT11_Pin, 1)

/*  Get DHT11 GPIO Status. */
#define DHT11_IO_GET(port, pin) CC2530_GPIO_READ(port, pin)
#define DHT11_IO()              DHT11_IO_GET(DHT11_Port, DHT11_Pin)

/* HT11 Measurement range detection. */ 
#define DHT11_TEMP_OK(t)    ((t) <= 50)
#define DHT11_HUMI_OK(h)    ((h) >= 20 && (h) <= 95)


/* Private function prototypes===============================================*/
static void DHT11_Init(void);
static uint8_t DHT11_Read_Byte(void);
static uint8_t DHT11_Check_Data(uint8_t temp, uint8_t humi);
static void DHT11_Get_Data(void);

/* Public define==========================================================*/
DHT11_st DHT11 =
{
    .DHT11_Over_Falg = FALSE,
    .Temp = 0,
    .Humi = 0,
    .DHT11_Init = &DHT11_Init,
    .DHT11_Get_Data = &DHT11_Get_Data
};     


/*
* @function: DHT11_Init
* @param   : None
* @retval  : None
* @brief   : 初始化
*/
static void DHT11_Init(void)
{
    DHT11_IO_OUTPUT();
    DHT11_IO_SET_HI();
}

/*
* @function: DHT11_Read_Byte
* @param   : None
* @retval  : 读取的字节数据
* @brief   : DHT11读取一个字节
*/
static uint8_t DHT11_Read_Byte(void)
{
    uint8_t dat = 0;

    for (uint8_t i = 0; i < 8; i++)
    {
        uint16_t cnt = 5350; // ~5ms

        /* Busy */
        while (!DHT11_IO() && cnt--);
        if (!cnt)
        {
            break;
        }

        /* Read bit based on high-level duration:
         *      26~28us: 0
         *      >70us:   1
         */
        DHT11_DELAY_US(50);
        if (DHT11_IO())
        {
            dat <<= 1;
            dat |= 1;
        }
        else
        {
            dat <<= 1;
            continue;
        }

        /* Waiting end */
        cnt = 1070; // ~1ms
        while (DHT11_IO() && cnt--);
        if (!cnt)
        {
            break;
        }
    }

    return dat;    
}

/*
* @function: DHT11_Check_Data
* @param   : None
* @retval  : None
* @brief   : DHT11校验数据
*/
static uint8_t DHT11_Check_Data(uint8_t temp, uint8_t humi)
{
    if (DHT11_HUMI_OK(humi))
    {
        if (DHT11_TEMP_OK(temp))
        {
            return DHT11_SC_OK;
        }
        else
        {
            return DHT11_SC_TEMP_OUTOFRANGE;
        }
    }

    if (DHT11_TEMP_OK(temp))
    {
        return DHT11_SC_HUMI_OUTOFRANGE;
    }
    else
    {
        return DHT11_SC_HT_OUTOFRANGE;
    }
}

/*
* @function: DHT11_Get_Data
* @param   : None
* @retval  : None
* @brief   : None
*/
static void DHT11_Get_Data(void)
{
    uint8_t HumiI, HumiF, TempI, TempF, CheckSum;
    
    DHT11.DHT11_Over_Falg = FALSE;

    /* >18ms, keeping gpio low-level */
    DHT11_IO_SET_LO();
 //   DHT11_DELAY_MS(30);

    DHT11_IO_SET_HI();

    /* Wait 20~40us then read ACK */
    DHT11_DELAY_US(32);
    DHT11_IO_INPUT();
    
    if (!DHT11_IO())
    {
        uint16_t cnt = 1070; // ~1ms

        /* Wait for the end of ACK */
        while (!DHT11_IO() && cnt--);
        if (!cnt)
        {
            goto Exit;
        }

        /* ~80us, DHT11 GPIO will be set after ACK */
        cnt = 1070; // ~1ms
        DHT11_DELAY_US(80);
        
        while (DHT11_IO() && cnt--);
        if (!cnt)
        {
            goto Exit;
        }

        /* Read data */
        HumiI = DHT11_Read_Byte();
        HumiF = DHT11_Read_Byte();
        TempI = DHT11_Read_Byte();
        TempF = DHT11_Read_Byte();
        CheckSum = DHT11_Read_Byte();

        /* Checksum */
        if (CheckSum == (HumiI + HumiF + TempI + TempF))
        {
            DHT11.Temp = TempI;
            DHT11.Humi = HumiI;

            DHT11.DHT11_Over_Falg = DHT11_Check_Data(TempI, HumiI);
            return;
        }
    }

Exit:
    DHT11_Init();
}
```

{% endfolding %}

{% folding, main.c %}

```cpp
uint8_t tempStr[50], humiStr[50];

DHT11.DHT11_Get_Data();
if (DHT11.DHT11_Over_Falg)
{
    sprintf((char *)tempStr, "Temp: %d", DHT11.Temp);
    sprintf((char *)humiStr, "Humi: %d", DHT11.Humi);
}
OLED.OLED_Display_x16_String(0, 0, tempStr);
OLED.OLED_Display_x16_String(1, 0, humiStr);
Public.Public_Delay_MS(1000);
```

{% endfolding %}



### NOR Flash

NOR Flash存储器的读取速度快、存储可靠性高、支持使用随机地址访问存储空间支持，但是存储容量小、价格贵，多用于保存电子产品的程序

- M25PE80

这是一款NOR Flash，其容量是 `1024KB（8M bit）`。另外，CC2530F256的内部也带有Flash存储器，其容量是 `256KB`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231126204642.webp)

- 硬件连接

需要把板子的 `第8,9,10位` 拨码开关打到 `ON端`



- 程序编写

{% folding, flash_spi.h %}

```cpp
#ifndef __FLASH_SPI_H
#define __FLASH_SPI_H

#if !defined(FLASH_SPI_SW) && !defined(FLASH_SPI_HW)
  #define FLASH_SPI_HW
#endif
   
/*
 *  SPI GPIOs:
 *  SCK : P1_5, 
 *  MOSI: P1_6,
 *  MISO: P1_7,
 *  CS  : P1_2,
 *  DC  : P1_4,
 *  RST : Don't need.
 */   
#ifdef HAL_FLASH_SPI_SW

/* SCK */
#define FLASH_SPI_SCK_Port 1
#define FLASH_SPI_SCK_Pin 5
/* MOSI */
#define FLASH_SPI_MO_Port 1
#define FLASH_SPI_MO_Pin 6
/* MISO */
#define FLASH_SPI_MI_Port 1
#define FLASH_SPI_MI_Pin 7

#endif

/* CS */
#define FLASH_SPI_CS_Port 1
#define FLASH_SPI_CS_Pin 1
/* RST */
#define FLASH_SPI_RST_Port SPI_IGNORE_IO
#define FLASH_SPI_RST_Pin SPI_IGNORE_IO

/*
SPI 选择/释放SPI芯片
*/
#define FLASH_SELECT()  do {                                             \
    SPI_CS_SELECT(FLASH_SPI_CS_Port, FLASH_SPI_CS_Pin);              \
    for(uint8_t _FLASH_CS_DELAY = 0; _FLASH_CS_DELAY < 10; _FLASH_CS_DELAY++); \
} while(0)

#define FLASH_RELEASE() SPI_CS_RELEASE(FLASH_SPI_CS_Port, FLASH_SPI_CS_Pin)
 
 
typedef struct
{
    void (*Flash_SPI_Init)(void);
    void (*Flash_SPI_Tx_Byte)(uint8_t byte);
    uint8_t (*Flash_SPI_Rx_Byte)(void);
} Flash_SPI_st;


extern Flash_SPI_st Flash_SPI;

#endif

```

{% endfolding %}

{% folding, flash_spi.c %}

```cpp
/***************************************************************************
 * File          : flash_spi.c
 * Author        : Yang
 * Date          : 2023-11-26
 * description   : Flash
 -----------------------------------
  
 -----------------------------------   
****************************************************************************/
#include "AllHead.h"

/* Private function prototypes===============================================*/
static void Flash_SPI_Init(void);
static void Flash_SPI_Tx_Byte(uint8_t byte);     
static uint8_t Flash_SPI_Rx_Byte(void);     
/* Public variables==========================================================*/
Flash_SPI_st Flash_SPI = 
{
    .Flash_SPI_Init = &Flash_SPI_Init,
    .Flash_SPI_Tx_Byte = &Flash_SPI_Tx_Byte,
    .Flash_SPI_Rx_Byte = &Flash_SPI_Rx_Byte
};


/*
* @function: Flash_SPI_Init
* @param   : None
* @retval  : None
* @brief   : Flash SPI 初始化
*/
static void Flash_SPI_Init(void)
{
#ifdef FALSH_SPI_SW
    // 初始化软件SPI
    SW_SPI_INIT(FLASH_SPI_SCK_Port, FLASH_SPI_SCK_Pin, FLASH_SPI_MO_Port, FLASH_SPI_MO_Pin, FLASH_SPI_MI_Port, FLASH_SPI_MI_Pin, SPI_CPOL_HIGH);
#else
    _HW_SPI_Parameter_st _HW_SPI_Flash = 
    {
        .Alternate = HW_SPI1_ALT2,
        .BitOrder = HW_SPI_BITORDER_MSB,
        .CPOL = HW_SPI_CPOL_HIGH,
        .CPHA = HW_SPI_CPHA_SECOND
    };
    HW_SPI.HW_SPI_Init(&_HW_SPI_Flash);
#endif
    SPI_CS_INIT(FLASH_SPI_CS_Port,FLASH_SPI_CS_Pin); 
    
    /* Reset Flash */
#if defined(FLASH_SPI_RST_Port) && \
    FLASH_SPI_RST_Port != SPI_IGNORE_IO && \
    FLASH_SPI_RST_Pin != SPI_IGNORE_IO

    SPI_GPIO_OUTPUT(FLASH_SPI_RST_Port, FLASH_SPI_RST_Pin);
    SPI_GPIO_CLEAR(FLASH_SPI_RST_Port, FLASH_SPI_RST_Pin);
    for(uint16_t delay = 0; delay < 1070; delay++);
    SPI_GPIO_SET(FLASH_SPI_RST_Port, FLASH_SPI_RST_Pin);
#endif
}

/*
* @function: Flash_SPI_Tx_Byte
* @param   : None
* @retval  : None
* @brief   : Flash SPI发送一个字节
*/
static void Flash_SPI_Tx_Byte(uint8_t byte)
{
#ifdef FLASH_SPI_SW
    SwSPITxByte(FLASH_SPI_SCK_Port, FLASH_SPI_SCK_Pin, FLASH_SPI_MO_Port, FLASH_SPI_MO_Pin, SPI_BITORDER_MSB, SPI_CPOL_HIGH, SPI_CPHA_SECOND, byte);
#else
    HW_SPI.HW_SPI_TxByte(HW_SPI1_ALT2, byte);
#endif
}

/*
* @function: Flash_SPI_Rx_Byte
* @param   : None
* @retval  : None
* @brief   : Flash SPI接收一个字节
*/
static uint8_t Flash_SPI_Rx_Byte(void)
{
    uint8_t dat;
    
#ifdef FLASH_SPI_SW
    SwSPIRxByte(FLASH_SPI_SCK_Port, FLASH_SPI_SCK_Pin, FLASH_SPI_MI_Port, FLASH_SPI_MI_Pin, SPI_BITORDER_MSB, SPI_CPOL_HIGH, SPI_CPHA_SECOND, dat);
#else
    Flash_SPI_Tx_Byte(0);       // 发送一个假的
    dat = HW_SPI.HW_SPI_RxByte(HW_SPI1_ALT2);
#endif 
    
    return dat;
}


```

{% endfolding %}

{% folding, Flash.h %}

```cpp
#ifndef __FLASH_H
#define __FLASH_H

/*
 *  M25PExx 型号配置：USE_M25PE80、USE_M25PE40、USE_M25PE20
 */     
#if !defined(USE_M25PE80) && !defined(USE_M25PE40) && !defined(USE_M25PE20)
    #define USE_M25PE80
#endif

/*
  * M25PExx 页面大小、扇区、子扇区和页面：
  * 1个扇区 = 16个子扇区,
  * 1子扇区= 16页，
  * 1 页 = 256 字节。
  */
#if defined(USE_M25PE80)
    #define USE_M25PExx_PAGE_SIZE 256
    #define USE_M25PExx_LAST_ADDR 0xFFFFF
    #define USE_M25PExx_SECTORS 16
    #define USE_M25PExx_SUBSECTORS 256
    #define USE_M25PExx_PAGES 4096
#elif defined(USE_M25PE40)
#elif defined(USE_M25PE20)
#endif
      
typedef struct
{
    void (*Flash_Init)(void);
    int (*Flash_Read)(uint32_t, uint8_t *, uint16_t);
    int (*Flash_Write)(uint32_t, uint8_t *, uint16_t);
    int (*Flash_Check)(void);    
    void (*Flash_Test)(void);
} Flash_st;
      
extern Flash_st Flash;

#endif
```

{% endfolding %}

{% folding, Flash.c %}

```cpp
/***************************************************************************
 * File          : Flash.c
 * Author        : Yang
 * Date          : 2023-11-26
 * description   : Flash
 -----------------------------------
  
 -----------------------------------   
****************************************************************************/
#include "AllHead.h"

/* Private define============================================================*/
/* M25PExx Commands. */
#define M25PExx_CMD_READ_STU_REG    0x05  // read status register
#define M25PExx_CMD_FAST_READ       0x0B  // read data bytes at higher speed
#define M25PExx_CMD_WRT_EN          0x06  // write enable
#define M25PExx_CMD_PW              0x0A  // page write
#define M25PExx_CMD_PP              0x02  // page program
#define M25PExx_CMD_PAGE_ER         0xDB  // page erase
#define M25PExx_CMD_SUBSEC_ER       0x20  // subsector erase
#define M25PExx_CMD_SEC_ER          0xD8  // sector erase
#define M25PExx_CMD_BULK_ER         0xC7  // bulk erase

/*  M25PExx Flags. */
#define M25PExx_DUMMY               0x00 // dummy byte
#define M25PExx_STAT_WIP            0x01 // nor flash write stat in progress


/* Private function prototypes===============================================*/
static void Flash_Init(void);
static int Flash_Read(uint32_t addr, uint8_t *pBuf, uint16_t len);
static int Flash_Write(uint32_t addr, uint8_t *pBuf, uint16_t len);
static int Flash_Check(void);
static void Flash_Test(void);
/* Public variables==========================================================*/
Flash_st Flash = 
{
    .Flash_Init = &Flash_Init,
    .Flash_Read = &Flash_Read,
    .Flash_Write = &Flash_Write,
    .Flash_Check = &Flash_Check,
    .Flash_Test = &Flash_Test
};


/*
* @function: Flash_Init
* @param   : None
* @retval  : None
* @brief   : Flash初始化
*/
static void Flash_Init(void)
{
    Flash_SPI.Flash_SPI_Init(); // SPI初始化
}

/*
* @function: Flash_Read
* @param   : addr -> 将要读取的数据所在的存储器地址  pBuf -> 变量指针，用于保存储器中读出来的数据  len -> 指定从存储器中读取多少个字节的数据
* @retval  : 成功返回0，失败返回-1
* @brief   : Flash读取数据
*/
static int Flash_Read(uint32_t addr, uint8_t *pBuf, uint16_t len)
{
    uint8_t *pData = pBuf;
    
    if ((addr > USE_M25PExx_LAST_ADDR) || (Flash_Check() != 0))
    {
        return -1;
    }
    FLASH_SELECT();     // 选中
    // 在快速阅读模式下 通过添加八个“虚拟”时钟来完成的
    Flash_SPI.Flash_SPI_Tx_Byte(M25PExx_CMD_FAST_READ);
    Flash_SPI.Flash_SPI_Tx_Byte((uint8_t)(addr >> 16));
    Flash_SPI.Flash_SPI_Tx_Byte((uint8_t)(addr >> 8));
    Flash_SPI.Flash_SPI_Tx_Byte((uint8_t)(addr));
    
    Flash_SPI.Flash_SPI_Tx_Byte(0);
    
    while (len--)
    {
        *pData++ = Flash_SPI.Flash_SPI_Rx_Byte();
    }
    FLASH_RELEASE();
    
    return 0;
}

/*
* @function: Flash_Write
* @param   : addr -> 说明把数据写入到存储器的哪个地址 pBuf -> 变量指针，指向将要写入到存储器的数据  len -> 指定把多少个字节的数据写入到存储器中
* @retval  : None
* @brief   : Flash写数据
*/
static int Flash_Write(uint32_t addr, uint8_t *pBuf, uint16_t len)
{
    uint8_t *pData = pBuf;
    
    if ((addr + len) > USE_M25PExx_LAST_ADDR)
    {
        return -1;
    }
    
    while (len)
    {
        if (Flash_Check() != 0)
        {
            return -1;
        }
        
        FLASH_SELECT();     // 选中
        Flash_SPI.Flash_SPI_Tx_Byte(M25PExx_CMD_WRT_EN);
        FLASH_RELEASE();
        
        FLASH_SELECT();     // 选中
        Flash_SPI.Flash_SPI_Tx_Byte(M25PExx_CMD_PW);
        Flash_SPI.Flash_SPI_Tx_Byte((uint8_t)(addr >> 16));
        Flash_SPI.Flash_SPI_Tx_Byte((uint8_t)(addr >> 8));
        Flash_SPI.Flash_SPI_Tx_Byte((uint8_t)(addr));
    
        // 只能在任意一页边界内写入，因此请为下一页做好准备如果还有字节则写入
        uint8_t cnt = 0 - (uint8_t)addr;
    
        if (cnt)
        {
            addr += cnt;
        }
        else
        {
            addr += USE_M25PExx_PAGE_SIZE;
        }

        do
        {
            Flash_SPI.Flash_SPI_Tx_Byte(*pData);

            cnt--;
            len--;
            pData++;
        } while (len && cnt);
        
        FLASH_RELEASE();        
    }
    
    return 0;
}

/*
* @function: Flash_Check
* @param   : None
* @retval  : None
* @brief   : Flash校验
*/
static int Flash_Check(void)
{
    uint16_t delay = 0;
    uint8_t retry = 20;

    FLASH_SELECT();

    do
    {
        while (delay--); // delay
        delay = 1070; // 32MHZ: ~1ms

        Flash_SPI.Flash_SPI_Tx_Byte(M25PExx_CMD_READ_STU_REG);
    } while ((Flash_SPI.Flash_SPI_Rx_Byte() & M25PExx_STAT_WIP) && retry--);

    FLASH_RELEASE();        

    return (retry == 0) ? -1 : 0;    
}

/*
* @function: Flash_Test
* @param   : None
* @retval  : None
* @brief   : Flash测试
*/
static void Flash_Test(void)
{
    uint8_t write_val = 0;
    uint8_t read_val = 0;
    char str[50];
    
    sprintf(str, "write: %d\r\n", write_val);
    USART0.USART0_Send((uint8_t*)str, strlen(str));
    // 写入
    if (Flash.Flash_Write(0x12345, &write_val, 1) != 0)
    {
        USART0.USART0_Send("Write error\r\n", strlen("Write error\r\n"));
    }
    Public.Public_Delay_MS(500);
    // 读取
    if (Flash.Flash_Read(0x12345, &read_val, 1) != 0)
    {
        USART0.USART0_Send("Read error\r\n", strlen("Read error\r\n"));
    }
    else
    {
        sprintf((char*)str, "read: %d\r\n", read_val);
        USART0.USART0_Send((uint8_t*)str, strlen(str));
    }
}
```

{% endfolding %}



### 继电器

用螺丝刀拧开第1、2号口的螺丝，分别塞入零线后再拧紧螺丝，如图所示。此时，继电器充当了一个开关，可以控制零线的断开或者闭合，从而控制灯泡的开关

- 硬件连接

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231127085145.webp" style="zoom:67%;" />

可以用来控制12V的灯带

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231127112037.webp" style="zoom:50%;" />

- 程序编写

{% folding, Relay.h %}

```cpp
#ifndef __RELAY_H
#define __RELAY_H

#define RELAY_Port 0
#define RELAY_Pin 5

typedef enum
{
    RELAY_ON = 0,
    RELAY_OFF = 1
} Relay_Status_et;

typedef struct
{
    Relay_Status_et Relay_Status;       // 当前的继电器状态
    void (*Relay_Init)(void);   // 继电器初始化
    void (*Relay_Open)(void);   // 打开继电器
    void (*Relay_Close)(void);     // 关闭继电器
    void (*Relay_Flip)(void);      // 翻转继电器
} Relay_st;

extern Relay_st Relay;

#endif
```

{% endfolding %}

{% folding, Relay.c %}

```cpp
/***************************************************************************
 * File          : Relay.c
 * Author        : Yang
 * Date          : 2023-11-27
 * description   : 
 -----------------------------------
  
 -----------------------------------   
****************************************************************************/
#include "AllHead.h"

/* Private function prototypes===============================================*/
static void Relay_Init(void);
static void Relay_Open(void);
static void Relay_Close(void);
static void Relay_Flip(void);
/* Public variables==========================================================*/
Relay_st Relay = 
{
    .Relay_Status = RELAY_OFF,
    .Relay_Init = &Relay_Init,
    .Relay_Open = &Relay_Open,
    .Relay_Close = &Relay_Close,
    .Relay_Flip = &Relay_Flip
};


/*
* @function: Relay_Init
* @param   : None
* @retval  : None
* @brief   : 继电器初始化
*/
static void Relay_Init(void)
{
    CC2530_IO_CTRL(RELAY_Port, RELAY_Pin, CC2530_OUTPUT);
    Relay_Close();
}

/*
* @function: Relay_Open
* @param   : None
* @retval  : None
* @brief   : 打开继电器
*/
static void Relay_Open(void)
{
    CC2530_GPIO_SET(0, 5);      // 输出高电平
    Relay.Relay_Status = RELAY_ON;      
}

/*
* @function: Relay_Close
* @param   : None
* @retval  : None
* @brief   : 关闭继电器
*/
static void Relay_Close(void)
{
    CC2530_GPIO_RESET(0, 5);      // 输出低电平
    Relay.Relay_Status = RELAY_OFF;
}

/*
* @function: Relay_Flip
* @param   : None
* @retval  : None
* @brief   : None
*/
static void Relay_Flip(void)
{
    if (RELAY_ON == Relay.Relay_Status)
    {
        Relay_Close();
    }
    else
    {
        Relay_Open();
    }
}
```

{% endfolding %}



### 问题

> DHT11不能在TASK里运行，原因是中断打开的原因，导致DHT11数据采集有问题，把中断关闭就没问题 --- 待解决2023.11.25



## Z-Statck 3.0详解

{% gallery %} 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231127114123.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231127124817.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231127125645.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231127125830.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231127130326.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231127130710.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231127130946.webp)

{% endgallery %}



### OSAL详解

OSAL（Operating System Abstraction Layer，系统抽象层），可以通俗地理解为一个简化版的操作系统，为Z-Stack的正确运行提供了内存管理、中断管理和任务调度等基本功能

> 打开 `\zstack\HomeAutomation\SampleSwitch\CC2530DB` 工程
>
> 看主函数：
>
> {% folding, ZMain.c %}
>
> ```cpp
> int main(void)
> {
>     // Turn off interrupts
>     osal_int_disable(INTS_ALL); // 关闭所有中断
> 
>     // Initialization for board related stuff such as LEDs
>     HAL_BOARD_INIT(); // 初始化板载资源，比如PA、时钟源等
> 
>     // Make sure supply voltage is high enough to run
>     zmain_vdd_check(); // 检测供电电压是否可以支撑芯片正常运行
> 
>     // Initialize board I/O
>     InitBoard(OB_COLD); // 初始化板载I/O，比如按键配置为输入
> 
>     // Initialze HAL drivers
>     HalDriverInit(); // 初始化硬件适配层，比如串口、显示器等
> 
>     // Initialize NV System
>     osal_nv_init(NULL); // 初始化NV（芯片内部FLASH的一块空间）
> 
>     // Initialize the MAC
>     ZMacInit(); // 初始化MAC层（数据链路层）
> 
>     // Determine the extended address
>     zmain_ext_addr(); // 确定芯片的物理地址
> 
> #if defined ZCL_KEY_ESTABLISH
>     // Initialize the Certicom certificate information.
>     zmain_cert_init(); // 初始化认证信息
> #endif
> 
>     // Initialize basic NV items
>     zgInit(); // 初始化存储在NV中的协议栈全局信息，如网络启动方式等
> 
> #ifndef NONWK
>     // Since the AF isn't a task, call it's initialization routine
>     afInit(); // 初始化AF(射频)
> #endif
> 
>     // Initialize the operating system
>     osal_init_system(); // 初始化OSAL(操作系统抽象层)
> 
>     // Allow interrupts
>     osal_int_enable(INTS_ALL); // 使能所有中断
> 
>     // Final board initialization
>     InitBoard(OB_READY); // 初始化板载IO资源，比如按键
> 
>     // Display information about this device
>     zmain_dev_info(); // 在显示器上显示设备物理地址
> 
>     /* Display the device info on the LCD */
> #ifdef LCD_SUPPORTED
>     zmain_lcd_init(); // 在显示器上显示设备信息，比如制造商等
> #endif
> 
> #ifdef WDT_IN_PM1
>     /* If WDT is used, this is a good place to enable it. */
>     WatchDogEnable(WDTIMX); // 启动看门狗功能
> #endif
> 
>     osal_start_system(); // 进入系统轮询
> 
>     return 0; // Shouldn't get here.
> }
> ```
>
> {% endfolding %}
>
> 里面有两个关键的函数调用：
>
> ```cpp
> osal_init_system();	// 初始化OSAL，包括初始化任务池
> osal_start_system();	// 轮询任务池
> ```
>
> 分别就是：
>
> {% folding, osal_init_system %}
>
> ```cpp
> uint8 osal_init_system(void)
> {
> #if !defined USE_ICALL && !defined OSAL_PORT2TIRTOS
>     // Initialize the Memory Allocation System
>     osal_mem_init(); // 初始化内存分配系统
> #endif               /* !defined USE_ICALL && !defined OSAL_PORT2TIRTOS */
> 
>     // Initialize the message queue
>     osal_qHead = NULL; // 初始化消息队列
> 
>     // Initialize the timers
>     osalTimerInit(); // 初始化OSAL定时器
> 
>     // Initialize the Power Management System
>     osal_pwrmgr_init(); // 初始化电源管理系统
> 
> #ifdef USE_ICALL
>     /* Prepare memory space for service enrollment */
>     osal_prepare_svc_enroll();
> #endif /* USE_ICALL */
> 
>     // Initialize the system tasks.
>     osalInitTasks(); // 初始化任务池
> 
> #if !defined USE_ICALL && !defined OSAL_PORT2TIRTOS
>     // Setup efficient search for the first free block of heap.
>     osal_mem_kick();
> #endif /* !defined USE_ICALL && !defined OSAL_PORT2TIRTOS */
> 
> #ifdef USE_ICALL
>     // Initialize variables used to track timing and provide OSAL timer service
>     osal_last_timestamp = (uint_least32_t)ICall_getTicks();
>     osal_tickperiod = (uint_least32_t)ICall_getTickPeriod();
>     osal_max_msecs = (uint_least32_t)ICall_getMaxMSecs();
>     /* Reduce ceiling considering potential latency */
>     osal_max_msecs -= 2;
> #endif /* USE_ICALL */
> 
>     return (SUCCESS);
> }
> ```
>
> {% endfolding %}
>
> 在以上代码中，可以找到找到一个任务池初始化函数 `osalInitTasks()`。顾名思义，它的工作内容就是 `初始化任务池`
>
> {% folding, osal_start_system %}
>
> ```cpp
> void osal_start_system(void)
> {
> #ifdef USE_ICALL
>     /* Kick off timer service in order to allocate resources upfront.
>      * The first timeout is required to schedule next OSAL timer event
>      * as well. */
>     ICall_Errno errno = ICall_setTimer(1, osal_msec_timer_cback,
>                                        (void *)osal_msec_timer_seq,
>                                        &osal_timerid_msec_timer);
>     if (errno != ICALL_ERRNO_SUCCESS)
>     {
>         ICall_abort();
>     }
> #endif /* USE_ICALL */
> 
> #if !defined(ZBIT) && !defined(UBIT)
>     for (;;) // 主循环
> #endif
>     {
>         osal_run_system(); // 系统轮询调度
> 
> #ifdef USE_ICALL
>         ICall_wait(ICALL_TIMEOUT_FOREVER);
> #endif /* USE_ICALL */
>     }
> }
> ```
>
> {% endfolding %}
>
> 在 `osal_start_system()` 函数的主循环中，循环调用了 `osal_run_system()` 函数，该函数主要工作 `轮询任务池`
>
> {% folding, osal_run_system %}
>
> ```cpp
> void osal_run_system(void)
> {
>     uint8 idx = 0;
> 
>     /* 更新时间，并整理出到期的任务。系统的时钟周期是：320us */
>     osalTimeUpdate();
>     Hal_ProcessPoll(); // 硬件适配层中断查询
> 
>     do
>     {
>         if (tasksEvents[idx]) // 查看是否有任务需要处理
>         {
>             break;
>         }
>     } while (++idx < tasksCnt); // 轮询整个任务池
> 
>     if (idx < tasksCnt) // 循环结束后，如果idx < tasksCnt表示任务池有任务需要处理
>     {
>         uint16 events;
>         halIntState_t intState;
>         HAL_ENTER_CRITICAL_SECTION(intState); // 关闭中断
>         events = tasksEvents[idx];            // evets中保存了该任务中的待处理事件
>         tasksEvents[idx] = 0;                 // 清空此任务中的所有待处理事件
>         HAL_EXIT_CRITICAL_SECTION(intState);  // 恢复中断
> 
>         activeTaskID = idx;
>         events = (tasksArr[idx])(idx, events); // 处理任务中的事件
>         activeTaskID = TASK_NO_TASK;
> 
>         HAL_ENTER_CRITICAL_SECTION(intState); // 关闭中断
>         tasksEvents[idx] |= events;           // 保存还没被处理的事件到任务中
>         HAL_EXIT_CRITICAL_SECTION(intState);  // 恢复中断
>     }
> 
> #if defined(POWER_SAVING) && !defined(USE_ICALL)
>     else                             // Complete pass through all task events with no activity? {
>         osal_pwrmgr_powerconserve(); // 如果没有任务需要处理则进入低功耗
> }
> #endif
> 
> /* Yield in case cooperative scheduling is being used. */
> #if defined(configUSE_PREEMPTION) && (configUSE_PREEMPTION == 0) {
> osal_task_yield();
> }
> #endif
> ```
>
> {% endfolding %}
>
> 在上述代码中，重点讲解一下其中的这个 `do-while` 循环，这个循环的主要作用是轮询整个任务池，也就是看一下有没有要处理的任务。循环中只有一个条件判断，如果条件成立，那么就结束循环
>
> 其中的 `tasksEvents` 是一个 `uint16` 类型的数组，其中的每一个元素都表示一种类型的任务，也就是说， `tasksEvents` 就是一个任务池， `tasksCnt` 是这个任务池的大小





{% tip bolt %}任务池初始化{% endtip %}

Z-Stack可以被分成多个层次：

1. MAC层
2. NWK（网络层）
3. HAL（硬件适配层）
4. APP（应用层）

每一个层次都有一个对应的任务来处理本层次的事务，例如MAC层对应一个MAC层的任务、网络层对应一个网络层的任务、HAL对应一个HAL的任务，以及应用层对应一个应用层的任务等，这些各个层次的任务构成一个任务池

{% folding, osalInitTasks %}

```cpp
void osalInitTasks(void)
{
    uint8 taskID = 0;

    tasksEvents = (uint16 *)osal_mem_alloc(sizeof(uint16) * tasksCnt);
    osal_memset(tasksEvents, 0, (sizeof(uint16) * tasksCnt));

    macTaskInit(taskID++);
    nwk_init(taskID++);
#if !defined(DISABLE_GREENPOWER_BASIC_PROXY) && (ZG_BUILD_RTR_TYPE)
    gp_Init(taskID++);
#endif
    Hal_Init(taskID++);
#if defined(MT_TASK)
    MT_TaskInit(taskID++);
#endif
    APS_Init(taskID++);
#if defined(ZIGBEE_FRAGMENTATION)
    APSF_Init(taskID++);
#endif
    ZDApp_Init(taskID++);
#if defined(ZIGBEE_FREQ_AGILITY) || defined(ZIGBEE_PANID_CONFLICT)
    ZDNwkMgr_Init(taskID++);
#endif
// Added to include TouchLink functionality
#if defined(INTER_PAN)
    StubAPS_Init(taskID++);
#endif
// Added to include TouchLink initiator functionality
#if defined(BDB_TL_INITIATOR)
    touchLinkInitiator_Init(taskID++);
#endif
// Added to include TouchLink target functionality
#if defined(BDB_TL_TARGET)
    touchLinkTarget_Init(taskID++);
#endif
    zcl_Init(taskID++);
    bdb_Init(taskID++);
    zclSampleSw_Init(taskID++);
#if (defined OTA_CLIENT) && (OTA_CLIENT == TRUE)
    zclOTA_Init(taskID);
#endif
}
```

这个函数首先申请了一个任务池存储空间，也就是这个 `tasksEvents` 数组。接着调用了很多带有 `“init”` 字样的函数，这些函数的作用是初始化各个层次的任务，例如：

- 调用 `macTaskInit()` 函数初始化 `MAC层` 的任务
- 调用 `nwk_init()` 函数初始化 `网络层` 的任务
- 调用 `zclSampleSw_Init()` 函数初始化 `应用层` 的任务

{% endfolding %}



{% tip bolt %}事件处理函数{% endtip %}

 `OSAL_SampleSw.c` 文件中还定义了一个数组，代码如下：

{% folding, OSAL_SampleSw.c %}

```cpp
// 创建一个元素类型为pTaskEventHandlerFn的数组
const pTaskEventHandlerFn tasksArr[] = {
    macEventLoop,   // 第1个数组元素
    nwk_event_loop, // 第2个数组元素
//
// 第3个数组元素
#if !defined(DISABLE_GREENPOWER_BASIC_PROXY) && (ZG_BUILD_RTR_TYPE)
    gp_event_loop,
#endif
    //
    // 第4个数组元素
    Hal_ProcessEvent,
// 第5个数组元素
#if defined(MT_TASK)
    MT_ProcessEvent,
#endif
    //
    // 第6个数组元素
    APS_event_loop,
//
// 第7个数组元素
#if defined(ZIGBEE_FRAGMENTATION)
    APSF_ProcessEvent,
#endif
    //
    // 第8个数组元素
    ZDApp_event_loop,
//
// 第9个数组元素
#if defined(ZIGBEE_FREQ_AGILITY) || defined(ZIGBEE_PANID_CONFLICT)
    ZDNwkMgr_event_loop,
#endif
//
// 第10个数组元素
// Added to include TouchLink functionality
#if defined(INTER_PAN)
    StubAPS_ProcessEvent,
#endif
//
// 第11个数组元素
// Added to include TouchLink initiator functionality
#if defined(BDB_TL_INITIATOR)
    touchLinkInitiator_event_loop,
#endif
//
// 第12个数组元素
// Added to include TouchLink target functionality
#if defined(BDB_TL_TARGET)
    touchLinkTarget_event_loop,
#endif
    //
    zcl_event_loop,         // 第13个数组元素
    bdb_event_loop,         // 第14个数组元素
    zclSampleSw_event_loop, // 第15个数组元素
//
// 第16个数组元素
#if (defined OTA_CLIENT) && (OTA_CLIENT == TRUE)
    zclOTA_event_loop
#endif

};
```

{% endfolding %}

这个数组类型变量 `pTaskEventHandlerFn` 是一个函数指针类型变量，用于指向事件对应的处理函数，因此这段代码定义了一个事件处理函数数组，这个数组中的 `每一个元素均表示某一个层次任务的事件处理函数`：

- `MAC层` 任务对应的事件处理函数是 `macEventLoop()`，它专门处理 `MAC层` 任务中的事件
- `网络层` 任务对应的事件处理函数是 `nwk_event_loop()`，它专门处理 `网络层` 任务中的事件
- `应用层` 任务对应的事件处理函数是 `zclSampleSw_event_loop()`，它专门处理 `应用层` 任中的事件



{% tip bolt %}事件的应用{% endtip %}

每个层次的事件处理函数的参数都包含 `1个 task id` 和 `1个 events` 参数

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231127170319.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231127170359.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231127170431.webp)

{% endgallery %}

> 以应用层事件处理函数为例，它的第2个参数 ` events` 表示了一个事件集合，其中包含了 `0个或多个` 待处理的事件。然而， `events` 是一个 `16位` 的变量，它是怎么样表示一个事件集合的呢？
>
> 答案是Z-Stack 3.0采用了 `独热码（one-hot code）`的方式对事件类型进行编码。

- events的分类

`events` 的最高位为 `1` 时，表示这是 `系统事件集合` ，即events中的事件全是 `系统事件`

`events` 的最高位为 `0` 时，表示这是 `用户事件集合` ，即events中的事件全是 `用户事件`（用户事件可以由开发者自行定义其含义，以及相应的处理）

- 独热码

采用独热码的方式，把所有的**用户事件编码**列举出来，并从中分析独热码的规律

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231127171449.webp" style="zoom: 67%;" />

从这些编码中，可以得出2个规律：

1. 除了用于表示系统事件或者用户事件的最高位， `其他15个比特位中，只有1位为1，其他位均为0`
2. 使用 `15个比特位` 表示 `15种用户事件`

利用规律1，可以很容易地理解为什么events可以表示一个事件集合。现在假设 `events` 的值为 `0000 0000 0101 0101`，其中的 `右起第1、3、5和7位为1`，于是可以理解为事件集合events包含了 `用户事件A、C、E和G`

利用规律2，可以得到 `events` 最多可以包含 `15种用户事件`



{% tip bolt %}定义用户事件{% endtip %}

可以使用以下方法在 `zcl_samplesw.h` 文件中定义一个用户事件：

1. 定义事件名称和对应的编码

```cpp
#define SAMPLEAPP_TEST_EVT 0x0040
```

2. 把它复制到 `zcl_samplesw.h` 文件中的如图所示位置

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231127195531.webp" style="zoom:67%;" />



{% tip bolt %}处理用户事件{% endtip %}

可以在 `zcl_samplesw.c` 文件中的应用层事件处理函数中添加相关的处理

> `events & SAMPLEAPP_TEST_EVT` 让事件集合参数 `events` 与预定义的事件类型 `SAMPLEAPP_TEST_EVT` 做 `与运算` ，判断 `events` 中的 `右起第3位是否为1`。如果为 `1` ，那么 `events & SAMPLEAPP_TEST_EVT` 的值为 `1` ，这表示事件集合参数 `events` 包含 `SAMPLEAPP_TEST_EVT` 这个事件，因此程序执行对应的处理代码

> 利用 `events ^ SAMPLEAPP_TEST_EVT` 把 `events` 中的 `第3位清0` ，然后把这个值作为函数的返回值，表示 `events中的这个事件已经被处理了`

{% folding, zcl_samplesw.c %}

```cpp
uint16 zclSampleSw_event_loop(uint8 task_id, uint16 events)
{
  afIncomingMSGPacket_t *MSGpkt;
  (void)task_id; // Intentionally unreferenced parameter

  // 用户事件：SAMPLESW_TOGGLE_TEST_EVT
  if (events & SAMPLESW_TOGGLE_TEST_EVT)
  {
    osal_start_timerEx(zclSampleSw_TaskID, SAMPLESW_TOGGLE_TEST_EVT, 500);
    zclGeneral_SendOnOff_CmdToggle(SAMPLESW_ENDPOINT, &zclSampleSw_DstAddr, FALSE, 0);

    // 消除已经处理的事件然后返回未处理的事件
    return (events ^ SAMPLESW_TOGGLE_TEST_EVT);
  }

  // SYS_EVENT_MSG：0x8000表示系统事件，也就是说检测uint16最高位
  if (events & SYS_EVENT_MSG)
  {
    // 省略系统事件的处理代码
    // ....
    // 消除系统事件标识然后返回未处理的事件
    return (events ^ SYS_EVENT_MSG);
  }

#if ZG_BUILD_ENDDEVICE_TYPE
  // 用户事件：SAMPLEAPP_END_DEVICE_REJOIN_EVT
  if (events & SAMPLEAPP_END_DEVICE_REJOIN_EVT)
  {
    bdb_ZedAttemptRecoverNwk();
    return (events ^ SAMPLEAPP_END_DEVICE_REJOIN_EVT);
  }
#endif
  // 用户事件：SAMPLEAPP_LCD_AUTO_UPDATE_EVT
  if (events & SAMPLEAPP_LCD_AUTO_UPDATE_EVT)
  {
    UI_UpdateLcd();
    return (events ^ SAMPLEAPP_LCD_AUTO_UPDATE_EVT);
  }
  // 用户事件：SAMPLEAPP_KEY_AUTO_REPEAT_EVT
  if (events & SAMPLEAPP_KEY_AUTO_REPEAT_EVT)
  {
    UI_MainStateMachine(UI_KEY_AUTO_PRESSED);
    return (events ^ SAMPLEAPP_KEY_AUTO_REPEAT_EVT);
  }

  // 处理刚才自己定义的用户事件：SAMPLEAPP_TEST_EVT
  if (events & SAMPLEAPP_TEST_EVT)
  {
    printf("Hello World!\r\n");
    // 消除已经处理的事件然后返回未处理的事件
    return (events ^ SAMPLEAPP_TEST_EVT);
  }

  // Discard unknown events
  return 0;
}
```

{% endfolding %}



{% tip bolt %}触发用户事件{% endtip %}

前面已经定义好事件类型和对应的处理方式了，但是需要在 `OSAL` 中触发该事件后， `OSAL` 才会执行对应的处理代码， `OSAL` 提供了专门的API来触发事件。展开OSAL层，可以找到 `OSAL_Timers.h` 文件

如果希望在触发事件的 `3s` 后处理刚才自定义的事件，可在应用层初始化函数 `zclSampleSw_Init()` 的末尾位置添加如下代码：

```cpp
osal_start_timerEx(
    zclSampleSw_TaskID, // 标记本事件属于应用层任务
    SAMPLEAPP_TEST_EVT, // 标记本事件的类型
    3000);              // 表示3000ms后才处理这个事件

// 其中，zclSampleSw_TaskID是一个全局变量，用于标记这个事件是属于应用层任务的
```



{% tip bolt %}使用动态内存{% endtip %}

Z-Stack 3.0 中动态内存分配的API在 `OSAL_Memory.h` 文件中，一般申请完动态内存后可以调用内存操作API来使用这些内存



{% tip bolt %}代码测试{% endtip %}

在事件触发那写

{% folding, zcl_samplesw.c %}

```cpp
uint16 zclSampleSw_event_loop(uint8 task_id, uint16 events)
{
  // 省略其他代码....

  // 处理刚才自己定义的用户事件：SAMPLEAPP_TEST_EVT
  if (events & SAMPLEAPP_TEST_EVT)
  {
    char *str = "Hello World!\r\n";

    char *mem = osal_mem_alloc(32); // 动态申请32个字节的内存空间

    if (mem != NULL)
    {
      osal_memset(mem, 0, 32);                 // 清0内存空间
      osal_memcpy(mem, str, osal_strlen(str)); // 字符串拷贝
      printf(mem);
      osal_mem_free(mem);
    }

    osal_start_timerEx(zclSampleSw_TaskID, SAMPLEAPP_TEST_EVT, 3000); // 重新触发事件，3000ms后执行

    // 消除已经处理的事件然后返回未处理的事件
    return (events ^ SAMPLEAPP_TEST_EVT);
  }
  return 0;
}
```

{% endfolding %}

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231128092544.webp" style="zoom:67%;" />



### HAL文件结构和工程结构

首先就是打开 Z-Stack 3.0 的压缩包，打开里面的项目 `SampleSwitch`，这个就是以后我们编写程序的项目了，不需要新建工程

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231128203622.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231128204230.webp)

- HAL的架构

>  初始化

初始化函数 `Hal_Init` 在 `hal_drivers.h` 里

```cpp
/**************************************************************************************************
 * @fn      Hal_Init
 *
 * @brief   Hal Initialization function.
 *
 * @param   task_id - Hal TaskId
 *
 * @return  None
 **************************************************************************************************/
void Hal_Init( uint8 task_id )
{
  /* Register task ID */
  Hal_TaskID = task_id;

#ifdef CC2591_COMPRESSION_WORKAROUND
  osal_start_reload_timer( Hal_TaskID, PERIOD_RSSI_RESET_EVT, PERIOD_RSSI_RESET_TIMEOUT );
#endif
}
```

> 驱动程序初始化

在 `hal_drivers.c` 里，找到驱动初始化函数 `HalDriverInit`，这个函数主要作用是针对各种硬件外设进行初始化

需要用指定的外设就定义对应宏就可以了

{% folding, hal_drivers.h %}

```cpp
/**************************************************************************************************
 * @fn      Hal_DriverInit
 *
 * @brief   Initialize HW - These need to be initialized before anyone.
 *
 * @param   task_id - Hal TaskId
 *
 * @return  None
 **************************************************************************************************/
void HalDriverInit (void)
{
  /* TIMER */
// 定时器，通过设置宏定义HAL_TIMER为TRUE来使能该功能
#if (defined HAL_TIMER) && (HAL_TIMER == TRUE)
#endif

  /* ADC */
// 模数转换功能，通过设置宏定义HAL_ADC为TRUE来使能该功能  
#if (defined HAL_ADC) && (HAL_ADC == TRUE)
  HalAdcInit();
#endif

  /* DMA */
// DMA（直接存储器访问），通过设置宏定义HAL_DMA为TRUE来使能该功能  
#if (defined HAL_DMA) && (HAL_DMA == TRUE)
  // Must be called before the init call to any module that uses DMA.
  HalDmaInit();
#endif

  /* AES */
// AES（高级加密标准），通过设置宏定义HAL_AES为TRUE来使能该功能  
#if (defined HAL_AES) && (HAL_AES == TRUE)
  HalAesInit();
#endif

  /* LCD */
// 显示器，通过设置宏定义HAL_LCD为TRUE来使能该功能  
#if (defined HAL_LCD) && (HAL_LCD == TRUE)
  HalLcdInit();
#endif

  /* LED */
// LED，通过设置宏定义HAL_LED为TRUE来使能该功能  
#if (defined HAL_LED) && (HAL_LED == TRUE)
  HalLedInit();
#endif

  /* UART */
// 串口，通过设置宏定义HAL_UART为TRUE来使能该功能  
#if (defined HAL_UART) && (HAL_UART == TRUE)
  HalUARTInit();
#endif

  /* KEY */
// 按键，通过设置宏定义HAL_KEY为TRUE来使能该功能  
#if (defined HAL_KEY) && (HAL_KEY == TRUE)
  HalKeyInit();
#endif
  
  /* SPI */
// SPI，通过设置宏定义HAL_SPI为TRUE来使能该功能  
#if (defined HAL_SPI) && (HAL_SPI == TRUE)
  HalSpiInit();
#endif

  /* HID */
// HID（Human Interface Device），通过设置宏定义HAL_HID为TRUE来使能该功能  
#if (defined HAL_HID) && (HAL_HID == TRUE)
  usbHidInit();
#endif
}
```

{% endfolding %}



> 事件处理

HAL的事件处理函数 `Hal_ProcessEvent()` 在 `hal_drivers.c` 文件中，它的主要作用是处理HAL层的事件

{% folding, hal_drivers.c %}

```cpp
/**************************************************************************************************
 * @fn      Hal_ProcessEvent
 *
 * @brief   Hal Process Event
 *
 * @param   task_id - Hal TaskId
 *          events - events
 *
 * @return  None
 **************************************************************************************************/
uint16 Hal_ProcessEvent( uint8 task_id, uint16 events )
{
  uint8 *msgPtr;

  (void)task_id;  // Intentionally unreferenced parameter

  if ( events & SYS_EVENT_MSG )
  {
    msgPtr = osal_msg_receive(Hal_TaskID);

    while (msgPtr)
    {
      /* Do something here - for now, just deallocate the msg and move on */

      /* De-allocate */
      osal_msg_deallocate( msgPtr );
      /* Next */
      msgPtr = osal_msg_receive( Hal_TaskID );
    }
    return events ^ SYS_EVENT_MSG;
  }
// 蜂鸣器事件，需要宏定义HAL_BUZZER为TRUE才使能该事件
#if (defined HAL_BUZZER) && (HAL_BUZZER == TRUE)
  if (events & HAL_BUZZER_EVENT)
  {
    HalBuzzerStop();
    return events ^ HAL_BUZZER_EVENT;
  }
#endif
// RSSI重置事件，需要宏定义PERIOD_RSSI_RESET_EVT为TRUE才使能该事件
#ifdef CC2591_COMPRESSION_WORKAROUND
  if ( events & PERIOD_RSSI_RESET_EVT )
  {
    macRxResetRssi();
    return (events ^ PERIOD_RSSI_RESET_EVT);
  }
#endif
  // LED闪烁事件
  if ( events & HAL_LED_BLINK_EVENT )
  {
#if (defined (BLINK_LEDS)) && (HAL_LED == TRUE)
    HalLedUpdate();
#endif /* BLINK_LEDS && HAL_LED */
    return events ^ HAL_LED_BLINK_EVENT;
  }
  // 按键事件
  if (events & HAL_KEY_EVENT)
  {
#if (defined HAL_KEY) && (HAL_KEY == TRUE)
    /* Check for keys */
    HalKeyPoll();

    /* if interrupt disabled, do next polling */
    if (!Hal_KeyIntEnable)
    {
      osal_start_timerEx( Hal_TaskID, HAL_KEY_EVENT, 100);
    }
#endif
    return events ^ HAL_KEY_EVENT;
  }
// 低功耗事件，需要宏定义HAL_SLEEP_TIMER_EVENT为TRUE才使能该事件
#if defined POWER_SAVING
  if ( events & HAL_SLEEP_TIMER_EVENT )
  {
    halRestoreSleepLevel();
    return events ^ HAL_SLEEP_TIMER_EVENT;
  }

  if ( events & HAL_PWRMGR_HOLD_EVENT )
  {
    (void)osal_pwrmgr_task_state(Hal_TaskID, PWRMGR_HOLD);

    (void)osal_stop_timerEx(Hal_TaskID, HAL_PWRMGR_CONSERVE_EVENT);
    (void)osal_clear_event(Hal_TaskID, HAL_PWRMGR_CONSERVE_EVENT);

    return (events & ~(HAL_PWRMGR_HOLD_EVENT | HAL_PWRMGR_CONSERVE_EVENT));
  }

  if ( events & HAL_PWRMGR_CONSERVE_EVENT )
  {
    (void)osal_pwrmgr_task_state(Hal_TaskID, PWRMGR_CONSERVE);
    return events ^ HAL_PWRMGR_CONSERVE_EVENT;
  }
#endif

  return 0;
}
```

{% endfolding %}



> HAL轮询

在 `hal_drivers.c` 文件中，可以找到 `Hal_ProcessPoll()` 函数，这个函数的主要作用是轮询那些需要快速处理的功能模块

```cpp
/**************************************************************************************************
 * @fn      Hal_ProcessPoll
 *
 * @brief   This routine will be called by OSAL to poll UART, TIMER...
 *
 * @param   task_id - Hal TaskId
 *
 * @return  None
 **************************************************************************************************/
void Hal_ProcessPoll ()
{
// 是否进入低功耗模式  
#if defined( POWER_SAVING )
  /* Allow sleep before the next OSAL event loop */
  ALLOW_SLEEP_MODE();
#endif
  
  /* UART Poll */
// 串口  
#if (defined HAL_UART) && (HAL_UART == TRUE)
  HalUARTPoll();
#endif
  
  /* SPI Poll */
// SPI  
#if (defined HAL_SPI) && (HAL_SPI == TRUE)
  HalSpiPoll();
#endif

  /* HID poll */
// HID  
#if (defined HAL_HID) && (HAL_HID == TRUE)
  usbHidProcessEvents();
#endif
 
}
```



{% note red 'fas fa-fan' flat %}注意{% endnote %}

在进行适配层前需要把裁剪UI步骤先完成，不然会影响到下面的实验效果！！！



{% tip bolt %}裁剪应用层UI{% endtip %}

需要把一些用不到的功能代码去掉，比如【APP】下的 `zcl_sampleapps_ui.c` 和 `zcl_sampleapps_ui.h`，这两个文件是针对TI的评估板而设计的UI，在产品开发过程并不需要用到，而且还会影响其他的开发工作，因此需要把它们裁剪掉，右击文件，选择 `Remove`， `zcl_samplesw.c` 文件中会调用到这些UI，也需要把其全部删除，在里面搜索 `UI_`把相关函数也删除

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231201172905.webp)





### 硬件适配层-LED

{% tip bolt %}常用API{% endtip %}

> `void HalLedInit( void )`
>
> - `功能`：初始化LED

> `uint8 HalLedSet( uint8 led, uint8 mode )`
>
> - `功能`：开关LED
> - `led`：用于指定待设定的LED
> - `mode`：指定工作模式

> `void HalLedBlink( uint8 leds, uint8 cnt, uint8 duty, uint16 time )`
>
> - `功能`：闪烁LED
> - `leds`：用于指定LED
> - `cnt`：用于指定闪烁的次数
> - `duty`：用于指定LED是开启状态时的占空比
> - `time`：用于指定每次闪烁的时间周期（单位：ms）



{% tip bolt %}程序编写{% endtip %}

>  `hal_led.h` 进行LED引脚编号定义，默认支持4个LED

> LED的物理映射
>
> 在调用LED API之前，需要配置好LED的物理映射定义。LED的物理映射定义在 `hal_board_cfg.h` 文件( `Components\hal\target\CC2530EB\hal_board_cfg.h` )

> 需要在设置里添加宏才能使用
>
> ```cpp
> HAL_LED=TRUE
> ```



{% folding, hal_board_cfg.h %}

```cpp
#define LED1_BV           BV(4)
#define LED1_SBIT         P0_4
#define LED1_DDR          P0DIR
#define LED1_POLARITY     ACTIVE_HIGH
```

{% endfolding %}

{% folding, zcl_samplesw.c %}

```cpp
/*========================= USER BEGIN =========================*/
#include <stdio.h>
/*========================== USER END ==========================*/

void zclSampleSw_Init( byte task_id )
{
  /*========================= USER BEGIN =========================*/
  osal_start_timerEx(zclSampleSw_TaskID, USERAPP_TEST_EVT, 0); // 定义触发事件
  /*========================== USER END ==========================*/    
}

uint16 zclSampleSw_event_loop( uint8 task_id, uint16 events )
{
/*========================= USER BEGIN =========================*/
  if (events & USERAPP_TEST_EVT)
  {
    printf("LED Flip!\r\n");
    HalLedBlink(HAL_LED_1, 10, 30, 1000); // 指定第1个LED, 闪烁次数是10, 指定50%的时间LED是开启状态, 指定闪烁周期是1s

    return (events ^ USERAPP_TEST_EVT);
  }
/*========================== USER END ==========================*/    
}
```

{% endfolding %}



{% tip bolt %}实验现象{% endtip %}

LED以1s周期进行闪烁10次，亮灭各占50%(即500ms)



### 硬件适配层-按键

{% tip bolt %}程序编写{% endtip %}

> 在 `hal_key.h` 
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231129104340.webp)

> `hal_board_cfg.h`里进行物理引脚映射

> 需要在设置里添加宏才能使用
>
> ```cpp
> HAL_KEY=TRUE
> ISR_KEYINTERRUPT
> ```



{% folding, hal_board_cfg.h %}

```cpp
/* S1 */
#define PUSH1_BV          BV(1)
#define PUSH1_SBIT        P0_1

#if defined (HAL_BOARD_CC2530EB_REV17)
  #define PUSH1_POLARITY    ACTIVE_LOW
#elif defined (HAL_BOARD_CC2530EB_REV13)
  #define PUSH1_POLARITY    ACTIVE_LOW
#else
  #error Unknown Board Indentifier
#endif
```

{% endfolding %}

> 按键需要在 `zclSampleSw_Init` 注册(默认已注册)： 
>
> ```cpp
> RegisterForKeys( zclSampleSw_TaskID );
> ```

> 按键属于系统事件，按键处理函数是 `zclSampleSw_HandleKeys`

> 在初始化函数HalKeyInit中有个地方需要说明，这个函数中有一段代码（用了快配置HAL_KEY_SW_6这个按键的引脚为输入功能）ZStack的本意是S1按键引脚P0_1可以用来驱动LED，就是和按键复用了，是否用作LED取决于宏ENABLE_LED4_DISABLE_S1是否定义，但是协议栈没有开源的那部分代码中定义了这个宏，也算是ZStack的一个Bug，所以这段代码我们需做修改，把预编译去掉（注释掉），否则按键引脚不会被配置为输入：
>
> ```cpp
> void HalKeyInit( void )
> {
> // #if ! defined ENABLE_LED4_DISABLE_S1
>   HAL_KEY_SW_6_DIR &= ~(HAL_KEY_SW_6_BIT);    /* Set pin direction to Input */
> // #endif
> }
> ```



{% folding, zcl_samplesw.c %}

```cpp
uint16 zclSampleSw_event_loop( uint8 task_id, uint16 events )
{
    // 省略...
  if ( events & SYS_EVENT_MSG )
  {
      // 省略...
        case KEY_CHANGE:	// 自动进入
          zclSampleSw_HandleKeys( ((keyChange_t *)MSGpkt)->state, ((keyChange_t *)MSGpkt)->keys );
          break;
      // 省略...
  }    
}

// 按键中断触发处理
static void zclSampleSw_HandleKeys( byte shift, byte keys )
{
   UI_MainStateMachine(keys);
  /*========================= USER BEGIN =========================*/
  if (keys & HAL_KEY_SW_6)
  {
    HalLedBlink(HAL_LED_1, 1, 50, 1000);
  }
  /*========================== USER END ==========================*/
}
```

{% endfolding %}



### 硬件适配层-串口

使用串口前，需要首先配置一下串口，函数写在 `zcl_samplesw.c`

{% folding, zcl_samplesw.c %}

```cpp
/*========================= USER BEGIN =========================*/
#include <stdio.h>

#define UART_MAX_LEN 128  // 串口接收最大长度
static uint8 ucUART_Rx_Buff[UART_MAX_LEN];  // 接收缓存数组

static void User_UART_Init(void);
static void UART_CallBack(uint8 port, uint8 event);
/*========================== USER END ==========================*/

void zclSampleSw_Init( byte task_id )
{
    // ...
    
  /*========================= USER BEGIN =========================*/
  User_UART_Init();     // 串口配置初始化
  /*========================== USER END ==========================*/
}

/*========================= USER BEGIN =========================*/
/*
* @function: User_UART_Init
* @param: None
* @retval: None
* @brief: 串口初始化
*/
static void User_UART_Init(void)
{
    halUARTCfg_t uartConfig;

    uartConfig.configured = TRUE; // 允许配置
    uartConfig.baudRate = HAL_UART_BR_115200; // 波特率
    uartConfig.flowControl = FALSE; // 关闭硬件流控
    uartConfig.flowControlThreshold = 0;  // 和流控相关
    uartConfig.rx.maxBufSize = UART_MAX_LEN;
    uartConfig.tx.maxBufSize = 0; // 发送缓冲区大小 --- 不需要发送缓冲区，所以设置长度为0
    uartConfig.idleTimeout = 6; // 默认超时时间
    uartConfig.intEnable = TRUE;  // 使能中断
    uartConfig.callBackFunc = UART_CallBack;  // 设置回调函数

    HalUARTOpen(HAL_UART_PORT_0, &uartConfig);  // 打开串口0
}

/*
* @function: UART_CallBack
* @param: None
* @retval: None
* @brief: 串口中断回调函数
*/
static void UART_CallBack(uint8 port, uint8 event)
{
    uint8 rxlen = Hal_UART_RxBufLen(HAL_UART_PORT_0); // 获取当前串口接收缓冲区有多少字节的数据 

    if (rxlen != 0)
    {
      HalUARTRead(HAL_UART_PORT_0, ucUART_Rx_Buff, rxlen);  // 从串口缓冲区中读取数据
      HalUARTWrite(HAL_UART_PORT_0, ucUART_Rx_Buff, rxlen); // 通过串口发送数据
    }
}
/*========================== USER END ==========================*/
```

{% endfolding %}

> 需要在设置里添加宏才能使用
>
> ```cpp
> HAL_UART=TRUE
> INT_HEAP_LEN=2048
> ```



### 硬件适配层-显示屏

{% tip bolt %}常用API{% endtip %}

> `void HalLcdWriteString ( char *str, uint8 option)`
>
> - `功能`：在指定的行中显示字符串
> - `str`：要显示的字符串
> - `option`：在哪一行显示数据

> `void HalLcdWriteValue ( uint32 value, const uint8 radix, uint8 option)`
>
> - `功能`：在指定行用指定进制显示数值
> - `value`：待显示的数值
> - `radix`：指定的进制
> - `option`：在哪一行显示数据





删除协议栈中的hal文件夹，把这个新的替换上去

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231130215220.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231130215243.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231130215301.webp)

{% endgallery %}

然后添加路径：

```bash
$PROJ_DIR$\..\..\..\..\..\Components\hal\target\CC2530EB\Common
$PROJ_DIR$\..\..\..\..\..\Components\hal\target\CC2530EB\SPI
$PROJ_DIR$\..\..\..\..\..\Components\hal\target\CC2530EB\HW_LCD\Font
$PROJ_DIR$\..\..\..\..\..\Components\hal\target\CC2530EB\HW_LCD\HAL_LCD_SPI
$PROJ_DIR$\..\..\..\..\..\Components\hal\target\CC2530EB\HW_LCD\HAL_OLED
$PROJ_DIR$\..\..\..\..\..\Components\hal\target\CC2530EB\HW_LCD\HAL_TFT
```

然后如果需要启动OLED功能，需要打开宏：

```cpp
HAL_LCD=TRUE
HAL_LCD_OLED12864
```

如果是TFT的话则需要打开下面的宏：

```cpp
HAL_LCD=TRUE
```



### 硬件适配层-ADC



> 需要添加宏才能使用
>
> ```cpp
> HAL_ADC=TRUE
> ```

{% tip bolt %}常用API{% endtip %}

> `uint16 HalAdcRead ( uint8 channel, uint8 resolution )`
>
> - `功能`：读取ADC的值
> - `channel`：取值范围是0 ~ 7，分别对应CC2530的P0_0 ~ P0_7引脚
> - `resolution`：采样精度





### 常用API

{% tip bolt %}OSAL_Timers.h{% endtip %}

> `uint8 osal_start_timerEx( uint8 task_id, uint16 event_id, uint32 timeout_value )`
>
> - `功能`：触发事件
>
> - `task_id`：任务ID，用于标记这个事件是属于哪一个层次的任务
> - `event_id`：事件ID，用于标记这个事件的类型
> - `timeout_value`：表示多少毫秒后才处理这个事件



{% tip bolt %}OSAL_Memory.h{% endtip %}

> `void *osal_mem_alloc( uint16 size )`
>
> - `功能`：动态申请内存空间
> - `size`：申请多少个字节的内存空间
> - `返回值`：返回该内存空间的指针

> `void osal_mem_free( void *ptr )`
>
> - `功能`：动态释放内存空间
> - `ptr`：待释放的内存空间指针



{% tip bolt %}OSAL.h{% endtip %}

> `void *osal_memcpy( void*, const void GENERIC *, unsigned int )`
>
> - `功能`：把内存空间的内容复制到另一个内存空间中
> - `void *`：目标内存空间
> - `void GENERIC *`：源内存空间
> - `unsigned int`：复制多少个字节

> `void *osal_memset( void *dest, uint8 value, int len )`
>
> - `功能`：把内存空间的值设置为指定的值
> - `dest`：内存空间
> - `value`：指定的值
> - `len`：把从dest起的len个字节的存储空间的值设置为value



## ZigBee 3.0网络编程

### 网络原理

{% tip bolt %}协议层次结构{% endtip %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231201101453.webp)

> **IEEE 802.14.4 PHY layer**：物理层，其工作内容由IEEE 802.15.4定义，主要作用是将一个设备的数据转换为电磁波信号之后发送到另一个设备，再由另一个设备解读电磁波信号获取数据

> **EE 802.14.4 MAC layer**：MAC层，其工作内容由IEEE 802.15.4定义，其主要作用是控制多个网络设备有序地利用物理通信资源电磁波来通信

> **Network （NWK）layer**：网络层，负责多个设备之间的组网、数据传输以及网络安全管理等

> **Application layer**：应用层，可以划分为以下两个层次：
> （1） `Application Support（APS）Sub-Layer`：应用支持子层，是网络层到应用框架层的过渡，提供数据的收发、安全加密，以及设备地址管理等功能
> （2） `Application Framework`：应用框架层，由一个或者多个应用端点（EndPoint）组成。应用端点是不同设备间通信的出入口，同时也是描述设备具备哪些功能的基础
>
> <img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231201101837.webp" style="zoom:50%;" />
>
> 其中的端点0为特殊端点，端点255用于向其他端点的广播，端点241~254是保留端点

> **ZigBee Cluster Library（ZCL）**：ZigBee集群库，由ZigBee联盟定义，是ZigBee 3.0的基础，也是不同厂商设备能够互联互通的基础

> **ZigBee Device Objects（ZDO）**：ZigBee设备对象，也就是应用端点0，它是应用层其他端点与应用子层管理实体交互的中间件，主要提供的功能如下：
> （1）管理ZigBee设备
> （2）创建、扫描及加入网络
> （3）应用端点绑定、解绑
> （4）安全管理

> **Base Device Behavior（BDB）**：ZigBee基础设备行为，定义设备的行为规范，以确保不同厂商设备间的互操作性，基础设备行为规范的范围定义如下：
> （1）基础设备所需的环境
> （2）基础设备的初始化（initialization）过程
> （3）基础设备的 Commissioning 过程
> （4）基础设备的重置（reset）过程
> （5）基础设备的安全（security）过程



{% tip bolt %}IEEE 802.15.4协议{% endtip %}

这个协议是专门为低速无线个人区域网络（Low-rate wireless personal area network，WPAN）而设计的，具有超低复杂度、超低功耗、低数据传输率的特点



#### 物理层

IEEE 802.15.4的物理层作为Zigbee协议结构的最低层，提供了最基础的服务。通常地，作为ZigBee技术的应用开发者，只需通俗地理解物理层的主要作用是将一个设备的数据转换为电磁波信号之后发送到另一个设备，再由另一个设备解读电磁波信号获取数据

IEEE 802.15.4提供了基于2.4GHz、868MHz以及915MHz电磁波频带的3两种物理层协议。这3者之间存在一些差异：

- **地域差异**
  在世界各地均能使用 `2.4GHz` ，但是 `868MHz` 和 `915MHz` 只能分别在欧洲和美国中使用。因此，在中国，ZigBee协议是基于 `2.4GHz` 的

- **通信速率差异**
   `2.4GHz` 物理层支持240kb/s的数据率，而 `868MHz` 和 `915MHz` 物理层的数据率分别是20kb/s和40kb/s

- **信道数量的差异**
   `868MHz` 频段定义了一个信道， `915MHz` 频段定义了10个信道， `2.4GHz` 频段定义了16个信道

`2.4GHz` 频段的信道定义在ZStack 3.0的工程文件 `Tools/f8wConfig.cfg` 中，配置文件中默认开启的是 `2.4G` 频段的 `11信道`

```cpp
/* Default channel is Channel 11 - 0x0B */
// Channels are defined in the following:
//         0      : 868 MHz     0x00000001
//         1 - 10 : 915 MHz     0x000007FE
//        11 - 26 : 2.4 GHz     0x07FFF800
//
//-DMAX_CHANNELS_868MHZ     0x00000001
//-DMAX_CHANNELS_915MHZ     0x000007FE
//-DMAX_CHANNELS_24GHZ      0x07FFF800
//-DDEFAULT_CHANLIST=0x04000000  // 26 - 0x1A
//-DDEFAULT_CHANLIST=0x02000000  // 25 - 0x19
//-DDEFAULT_CHANLIST=0x01000000  // 24 - 0x18
//-DDEFAULT_CHANLIST=0x00800000  // 23 - 0x17
//-DDEFAULT_CHANLIST=0x00400000  // 22 - 0x16
//-DDEFAULT_CHANLIST=0x00200000  // 21 - 0x15
//-DDEFAULT_CHANLIST=0x00100000  // 20 - 0x14
//-DDEFAULT_CHANLIST=0x00080000  // 19 - 0x13
//-DDEFAULT_CHANLIST=0x00040000  // 18 - 0x12
//-DDEFAULT_CHANLIST=0x00020000  // 17 - 0x11
//-DDEFAULT_CHANLIST=0x00010000  // 16 - 0x10
//-DDEFAULT_CHANLIST=0x00008000  // 15 - 0x0F
//-DDEFAULT_CHANLIST=0x00004000  // 14 - 0x0E
//-DDEFAULT_CHANLIST=0x00002000  // 13 - 0x0D
//-DDEFAULT_CHANLIST=0x00001000  // 12 - 0x0C
-DDEFAULT_CHANLIST=0x00000800  // 11 - 0x0B
```

在不同的信道中创建的ZigBee网络互不干扰，但在相同的信道下，也可以组建多个独立的ZigBee网络，那么如何区分在相同的信道下构建间的多个ZigBee网络？

答案是每个ZigBee网络都会被分配一个唯一的ID号，称为 `“PanID”`，可以利用PanID来区分相同信道中的不同ZigBee网络



#### MAC层

如果有多个网络设备都要发送数据，那么需要怎么控制它们有序地来发送数据呢？

为了解决这个问题，媒体接入 `控制层（MAC，Media Access Control）`

媒体接入控制层，是建立在物理层之上，它不关心数据是怎么转换成电磁波信号、电磁波的频率是多少等，它只关心自己负责那部分，也就是：

- 第1，将设备划分为协调器和普通设备
- 第2，协调器产生并发送信标帧，普通设备根据协调器的信标帧与协调器同步
- 第3，个域网的关联和取消关联
- 第4，确保无线信道的通信安全
- 第5，支持带有冲突避免的载波侦听多路访问（CSMA/CA）
- 第6，提供时槽保障（GTS，Guaranteed Time Slot）服务
- 第7，提供不同设备之间的MAC层的可靠传输服务

`MAC地址`：ZigBee 网络的中的每一个设备都会有一个固定的MAC地址，也称为物理地址或者IEEE地址，用于标识MAC层设备的地址。MAC这是一个 `64位的二进制地址`，通常由芯片厂商在芯片生产过程固化到芯片中的



#### 网络层

ZigBee网络层基于IEEE 802.15.4协议之上，是ZigBee协议的核心部分，所以人们也通俗地称为“核心协议”，它主要负责以下3方面的工作:

- 多设备组网
- 数据传输
- 网络安全管理

> 多设备组网详解

- 网络拓扑结构

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231201110231.webp)

- Zigbee设备角色

处于网络中的设备我们们可以通俗地称为 `“网络节点”`。ZigBee 网络节点有以下3种类型：

**协调器**（Coordinator）：充当ZigBee网络的网关（中心节点）角色，通常负责ZigBee协议与NB-IoT、WiFi等其他协议的转换、在特定的信道组建网络等，同时具备路由器的功能

**路由器**（Router）：又称为中继器，负责数据路由。所有的终端设备都需要通过协调器或者路由器加入到网络中

**终端设备**（End Device）：又称为叶子节点，必须通过协调器或者路由器才能加入到ZigBee网络中。例如在智能家居场景中，终端设备通常就是是温湿度传感器、无线开关按钮或者各种生活电器等等

- 组网特性

ZigBee组网有3个主要特性。第1，支持构建和维护超过10,000个网络节点的网状网络，远远超过蓝牙的8个和WiFi的32个。它的好处在于：

1. 一方面可以让更多设备加入到自动化控制和远程控制中，设备数量上的局限不复存在
2. 另一方面，在网状网络中，两个网络节点之间有1条或以上的通信链路，可以提供多通道通信服务。在复杂的工业场景下，往往不能保证每条无线网络通信链路始终畅通，多通道通信能够使得当某条链路堵塞后使用其他链路来通信，确保了通信的稳定性
3. **支持动态路由**，即根据各个网络节点的实时状态来动态计算网络中任意两个节点之间的最优通信路径。举个例子，例如在网状网络的场景下，任意两个节点之间可能有多条通信路径，通过计算各个路径的实时质量从而动态选择最优的通信路径
4. **支持自组网**，即在网络节点被拆散开，因为超出通信范围而无法通信之后，当他们再次回到通信范围内相聚的时候，彼此之间能够自动重新构建网络来实现数据通信



> 数据传输详解

数据传输是指设备之间的控制指令和设备的状态信息等数据的传输。举个例子，以空调为例，这里所说的控制指令是指空调的开关、制冷温度设定、工作模式设定等指令；状态信息是指空调在某个时刻的状态，例如设定的温度是多少、室内温度是多少、工作模式是什么等



> 安全管理

网络安全管理是指数据的加密解密等



> 网络地址

处于网络中的ZigBee设备都会被分配一个用于标识的网络地址，通过这个网络地址可以找到对应的设备。ZigBee网络地址是一个16位的地址（0x0000 - 0xFFFF）。在ZStack 3.0中，有几个特殊网络地址需要了解一下：

（1）协调器的网络地址为固定的 `0x0000`
（2） `0xFFFF` - 这是一个对整个ZigBee进行广播的广播地址
（3） `0xFFFD` - 只对打开接收的设备进行广播的地址
（4） `0xFFFC` - 只对协调器和路由设备广播的地址
（5） `0xFFFE` - 用作无效地址
（6） `0xFFF8 ~0xFFFB` - 保留地址
（7） `0x0001~0xFFF7` 被分配到ZigBee网络中的设备，作为网络地址使用



### ZigBee BDB

> 简介

ZigBee设备在相互发送数据之前，需要先组建网络。 `BDB（Base Device Behavior，设备基本行为）` 是ZigBee 3.0 的一个新特性，为各个ZigBee设备提供了一套统一的机制，**让它们正确地组建ZigBee网络**。BDB主要包含以下3方面的内容：

- **Commissioning Modes**：Commissioning模式，定义了ZigBee设备之间组网的基本规范
- **BDB Security**：定义了一些网络安全规范
- **Reset Methods**：开发者可以使用多个复位方法

在协议栈的 `BDB` 文件夹里面可以找到BDB相关的代码文件

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231201113818.webp" style="zoom:50%;" />

`备注`：由于BDB Security和Reset Methods这两部分，开发者一般接触的比较少，所以暂时不展开讲解。**Commissioning Modes是ZigBee组网的核心内容**



> BDB Commissioning Modes

BDB提供了4种主要的 `Commissioning` 模式给开发者使用，分别是 `Network Steering`、 `Network Formation`、 `Finding and Binding（F & B）`和 `Touchlink`

- Network Steering

定义了设备如何加入到ZigBee网络中，具体方式如下：

1. 如果设备还没有在ZigBee网络中，那么它们会寻找一个合适的ZigBee网络并加入到其中
2. 特别地，对于路由器类型的设备，在入网成功后，允许其它设备通过本设备来加入到这个ZigBee网络中

所有需要加入到ZigBee网络中的设备都必须要支持Network Steering

- Network Formation

Network Formation 规定协调器类型的设备需要去建立一个中心信任的安全网络。这种网络的特点是所有需要加入到网络中的设备都需要经过信任中心的同意才能加入，而协调器本身就是这个信任中心

类似地，对于路由器类型的设备，如果条件允许的话会创建一个分布式安全网络。这里暂时不展开讲解这种网络了

所有的协调器类型设备都必须要支持 Network Formation ，而对于路由器类型的设备来说，这是可选的模式

- Finding and Binding（F & B）

ZigBee 3.0是使用 `Cluster（集群）` 来描述设备的功能的。每种设备都有各自的功能，都有各自的一系列 `Cluster` 。这里的发现与绑定是指ZigBee设备的 `Cluster` 之间的相互发现、相互绑定

所有的ZigBee设备都必须要支持Finding and Binding（F & B）

- Touchlink

一般用于两个ZigBee设备之间直接进行通信

> 假设现在有两个支持Toucklink的ZigBee设备：
>
> - 一个是无线按钮，支持通过Touchlink的方式发送一个恢复出厂设置的指令；
> - 另一个是灯，支持接收通过Touchlink方式发来的恢复出厂设置指令并执行相应的处理
>
> 用户可以拿着这个按钮靠近这个灯，**让两者相距约2cm**，然后按下按钮发送指令，这个灯会收到指令并执行相应处理。
>
> 如果用户**把按钮拿远一些测试**，会发现灯收不到这个指令。如果用户把这个按钮拿去靠近**一个新买的相同的灯**测试，会发现这个灯也会收到这个指令

> `特点`：
>
> - 通信距离短，约2cm。按钮向灯发送指令时，灯会通过检测按钮的网络信号强度来判断按钮的距离，从而决定是否处理该指令
> - 设备之间可以直接通信，可以把这个按钮拿去直接跟一个新买的相同的灯通信

Touchlink用得相对比较少，ZigBee设备并不一定都需要支持Touchlink，开发者可以让自己开发的设备支持或不支持这个功能



在编译代码的时候可以选择不同的网络角色，从而编写不同角色的程序，可以选择待开发设备的对应的工作模式

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231202111319.webp)



#### 组网实验

> 处理组网失败需要在 `zcl_samplesw.c` 里找到一个 `zclSampleSw_ProcessCommissioningStatus` 的函数，这个函数就是专门处理 `Commissioning` 结果的，例如协调器创建网络是否成功、设备是否成功加入到网络等
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231202122114.webp)



> mini板子充当协调器；标准板充当路由器



### 常用API

- 头文件 `bdb_interface.h`

> `void bdb_StartCommissioning(uint8 mode)`
>
> `功能`：协调器组建网络/路由器或终端设备加入网络
>
> `mode`：模式(在bdb.h里定义了)，7种





