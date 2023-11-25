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

