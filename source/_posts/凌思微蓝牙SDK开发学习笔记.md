---
title: 凌思微蓝牙SDK开发学习笔记
cover: /img/num160.webp
categories:
  - 蓝牙SDK开发
comments: false
katex: true
password: 20231223
message: 涉及到公司机密,暂未开放
abbrlink: 4223e6b4
date: 2023-12-23 14:16:38
---



## 前言

> 参考文章



> 参考网址

[凌思微LE5010系列-官网](https://www.linkedsemi.com/products/ble-5010-chip.html)

[SDK下载-github](https://github.com/linkedsemi/LS_SDK)

[开发文档](https://docs.linkedsemi.com/doc?id=273&key=20)

[JLink下载](https://www.segger.com/downloads/jlink/JLink_Windows_V660f.exe)

[在线文档](https://ls-ble-sdk.readthedocs.io/zh/latest/index.html)

> 我的代码

[S9旧协议最新V1--2024.2.25](https://github.com/luckys-yang/Blueooth_code-S9KeyBoard_OldProtocol_1)

[蓝牙矩阵遥控器旧协议最新V1-2024.2.25](https://github.com/luckys-yang/Blueooth_code-Remote_OldProtocol_1-)

> 大佬豪哥的代码合集在阿里云网盘里.

## 环境配置

> keil 需要使用5.25版本以上且已激活

1. 去下载最新的SDK压缩包，解压后安装芯片包，我的路径是 `G:\my_code\Blueooth_code\SDK汇总\LS_SDK-release-v2.0\tools\package\MDK\Linkedsemi.DFP.1.0.0.pack`，双击安装即可
2. 打开获取的SDK目录，将 `tools\prog\LinkedSemi\le501x_flash_algo.elf` 文件复制一份并修改文件名为 `le501x_flash_algo.FLM`，并将 `le501x_flash_algo.FLM` 文件拷贝到keil安装目录下的 `ARM\Flash` 路径中
3. 将fromelf执行文件的绝对路径添加系统环境变量中，重启keil生效，该文件所在路径在keil的安装目录下面 `ARM\ARMCC\bin` ，否则在使用keil编译时会报“fromelf不是内部或外部命令，也不是可运行的程序或批处理文件”的警告
4. 下载调试的话

- 量产时，只需要烧录对应工程编译出来的 `XXX_production.hex` 即可，该文件是由上述三个HEX文件合并之后的固件
- 开发调试阶段，只需要提前烧录一次 `XXX_production.hex`，之后便可以正常使用keil调试，否则程序跑不进main函数（先编译然后再修改下面这里再直接烧到板子不要再点编译再下载）
- 在 flash download 选项卡中配置下载选项，不能勾选 `Erase Full Chip` 选项
- 选择 `J-Link` 作为调试工具，选择 `SW` 作为调试

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-03_14-31-49.webp)

> 下载步骤

1. 第一次下载的话需要把蓝牙协议栈相关的也一起写，就是先全局编译一次，再打开【魔术棒】->【Output】那填写 `SMART_S9_production.hex`，然后到【Debug】设置里勾选全部擦除，然后点击下载即可
2. 然后后续下载就不需要这样，只需要勾选擦除扇区即可，然后【Output】那填写 `SMART_S9`，编译下载即可
3. 进入调试功能的话不要加 `_production.hex`！进入后把 `_SEGGER_RTT` 地址记住填写在那个J-Link上位机那，选择 `M0` 芯片进入即可

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-05_16-17-01.webp)



### j-link

推荐下载6.6版本

 默认安装即可，安装完我的路径是 `C:\Program Files (x86)\SEGGER\JLink`，一般调试只需要用到 `JLinkRTTViewer.exe`

1. 需要配置环境，把 `JFlash.exe 、JLinkGDBServerCL.exe` 所在目录路径添加
2. 将SDK包 `tools/prog` 目录下的所有内容拷贝到Jlink的安装路径，无特殊应用直接覆盖原有文件

> jFlash

JFlash可以烧录HEX文件到芯片里，或者读取芯片内的数据

1. File->New project 配置 target device为 LinkedSemi LE501X
2. 导入待烧录hex文件，点击File->Open data file…选择要烧录的hex文件，或者直接将文件拖入JFLash中
3. 在jlink与调试板连接好的情况下， 点击Target->Connect，如果能够连接成功会在LOG窗口最后一行显示“Connected successfully”，否则请检查硬件接线是否正确
4. 芯片内flash全擦操作， Target->Manual Programming->Erase
5. 执行烧录， Target->Production Programming
6. flash数据全部回读，Target->Manual Programming->Read Back



> J-LinkRTTViewer的使用

在使能 JLINK_RTT 功能后（SDK中默认使能），可以使用 `JLinkRTTViewer.exe` 工具查看程序内的log信息

## 脚本文件

脚本文件在 `tools` 文件夹里面名字为 `after_build.bat`，这个在keil里面进行传入参数，具体在：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-03_14-31-19.webp)

```bash
# 传入参数
.\tools\le501x\after_build.bat SMART_S9 . 402866176 ./soc/arm_cm/le501x/bin/fw.hex
```

```bash
# after_build.bat内容
%2\tools\srec_cat.exe -o .\Objects\info_sbl.hex -I %2\soc\arm_cm\le501x\bin\bram.bin -Bin -of 0x18000300 -crc32-l-e -max-a %2\soc\arm_cm\le501x\bin\bram.bin -Bin -of 0x18000300 %2\tools\le501x\info.bin -Bin -of 0x18000000 -gen 0x1800001c 0x18000020 -const-l-e 0x18000300 4 -gen 0x18000020 0x18000024 -const-l-e -l %2\soc\arm_cm\le501x\bin\bram.bin -Bin 4 -gen 0x18000024 0x18000028 -const-l-e %3 4 -gen 0x1800002c 0x18000030 -const-l-e 0x1807c000 4 -gen 0x18000030 0x18000036 -rep-d 0xff 0xff 0xff 0xff 0xff 0xff 
fromelf --bin --output=.\Objects\%1.ota.bin .\Objects\%1.axf
fromelf --i32 --output=.\Objects\%1.hex .\Objects\%1.axf
if "%4" NEQ "" (
%2\tools\srec_cat.exe -Output .\Objects\%1_production_temp.hex -Intel .\Objects\info_sbl.hex -Intel .\Objects\%1.hex -Intel %2\%4 -Intel
) else (
%2\tools\srec_cat.exe -Output .\Objects\%1_production_temp.hex -Intel .\Objects\info_sbl.hex -Intel .\Objects\%1.hex -Intel
)
fromelf -c -a -d -e -v -o .\Objects\%1.asm .\Objects\%1.axf
%2\tools\srec_cat.exe -Output .\Objects\%1_production.hex -I .\Objects\%1_production_temp.hex -I %2\tools\le501x\SMART_S9.ota(data1).bin -Bin -of 0x18057F00 -gen 0x1807BE00 0x1807BE04 -const-l-e 1 4 -gen 0x1807BE04 0x1807BE08 -const-l-e 1 4 -gen 0x1807BE08 0x1807BE0c -const-l-e 0x18034000 4 -gen 0x1807BE0c 0x1807BE10 -const-l-e 0xFFFFFFFF 4 -gen 0x1807BE10 0x1807BE14 -const-l-e 0xFFFFFFFF 4 -gen 0x1807BE14 0x1807BE18 -const-l-e 0xFFFFFFFF 4 -gen 0x1807BE18 0x1807BE1c -const-l-e 0x00000000 4 -gen 0x1807BE1c 0x1807BE20 -const-l-e 0xFFFFFFFF 4 -gen 0x18057E00 0x18057E01 -const-l-e 0x00 1 
```

> 分析上面的内容
>
> 【常用命令】
>
> `【-I】` 是一个指定输入文件的选项
>
> `【-o】` 是一个用于指定输出文件的选项
>
> `【-gen】` 用于生成一些数据，并将其插入到输出文件中，比如：`-gen 0x1807BE00 0x1807BE04 -const-l-e 1 4`
>
> 它后面有一系列参数，第一个参数表示要生成数据的起始地址，第二个参数表示要生成数据的结束地址；`-const-l-e` 表示生成常量，且采用小端字节序（little-endian）；后面的`1` 表示要生成的数据(单位字节)，`4` 表示指定数据长度为4(单位字节)
>
> 

- 第一部分

```bash
# 这是一个执行 SRecord 工具的路径。SRecord 是一个用于处理二进制数据文件的工具
%2\tools\srec_cat.exe
# 指定输出文件为 .\Objects\info_sbl.hex
-o .\Objects\info_sbl.hex
# 读取 bram.bin 二进制文件，并将其作为输入文件
-I %2\soc\arm_cm\le501x\bin\bram.bin -Bin
# 在地址 0x18000300 处插入 CRC32 校验和，并限制数据的最大长度
-of 0x18000300 -crc32-l-e -max-a %2\soc\arm_cm\le501x\bin\bram.bin -Bin
# 将 info.bin 文件插入到地址 0x18000300 处
-of 0x18000300 %2\tools\le501x\info.bin -Bin
# 在地址 0x18000000 处生成一些数据，其中包括地址 0x18000300 处的数据
-of 0x18000000 -gen 0x1800001c 0x18000020 -const-l-e 0x18000300 4
# 在地址 0x18000020 处生成一些数据，其中包括 bram.bin 文件的长度
-gen 0x18000020 0x18000024 -const-l-e -l %2\soc\arm_cm\le501x\bin\bram.bin -Bin 4
# 在地址 0x18000024 处生成一些数据，其中包括第三个传入的参数 %3
-gen 0x18000024 0x18000028 -const-l-e %3 4
# 在地址 0x1800002c 处生成一些数据，其中包括常量值 0x1807c000
-gen 0x1800002c 0x18000030 -const-l-e 0x1807c000 4
# 在地址 0x18000030 处生成一些数据，其中包括六个重复的 0xff
-gen 0x18000030 0x18000036 -rep-d 0xff 0xff 0xff 0xff 0xff 0xff
```

- 第二部分

```bash
# 使用 fromelf 将 %1.axf 转换为二进制格式并保存为 %1.ota.bin
fromelf --bin --output=.\Objects\%1.ota.bin .\Objects\%1.axf
# 使用 fromelf 将 %1.axf 转换为 Intel Hex 格式并保存为 %1.hex
fromelf --i32 --output=.\Objects\%1.hex .\Objects\%1.axf
```

- 第三部分

```bash
# 检查是否有第四个参数。如果有，则执行第一个分支，否则执行第二个分支 则将其与之前生成的文件合并
if "%4" NEQ "" (
# 合并文件生成 %1_production_temp.hex，包括 info_sbl.hex、%1.hex，以及可能的第四个参数 %4。
%2\tools\srec_cat.exe -Output .\Objects\%1_production_temp.hex -Intel .\Objects\info_sbl.hex -Intel .\Objects\%1.hex -Intel %2\%4 -Intel
) else (
# 跟上面一样但是不包括参数4的%4文件
%2\tools\srec_cat.exe -Output .\Objects\%1_production_temp.hex -Intel .\Objects\info_sbl.hex -Intel .\Objects\%1.hex -Intel
)
```

- 第四部分

```bash
# 使用 fromelf 生成 %1.axf 的汇编文件 %1.asm
fromelf -c -a -d -e -v -o .\Objects\%1.asm .\Objects\%1.axf
```

- 第五部分

```bash
# 在 %1_production_temp.hex 的基础上
# -I %2\tools\le501x\SMART_S9.ota(data1).bin -Bin -of 0x18057F00 ：把文件bin的内容插入到首地址0x18057F00的地方
# -gen 0x1807BE00 0x1807BE04 -const-l-e 1 4  : 在地址范围从 0x1807BE00 到 0x1807BE04（4 个字节的长度）插入一个常量值为 1 的数据
# 后面那些也是插入常量，就不写了

%2\tools\srec_cat.exe -Output .\Objects\%1_production.hex -I .\Objects\%1_production_temp.hex -I %2\tools\le501x\SMART_S9.ota(data1).bin -Bin -of 0x18057F00 -gen 0x1807BE00 0x1807BE04 -const-l-e 1 4 -gen 0x1807BE04 0x1807BE08 -const-l-e 1 4 -gen 0x1807BE08 0x1807BE0c -const-l-e 0x18034000 4 -gen 0x1807BE0c 0x1807BE10 -const-l-e 0xFFFFFFFF 4 -gen 0x1807BE10 0x1807BE14 -const-l-e 0xFFFFFFFF 4 -gen 0x1807BE14 0x1807BE18 -const-l-e 0xFFFFFFFF 4 -gen 0x1807BE18 0x1807BE1c -const-l-e 0x00000000 4 -gen 0x1807BE1c 0x1807BE20 -const-l-e 0xFFFFFFFF 4 -gen 0x18057E00 0x18057E01 -const-l-e 0x00 1 
```



## 芯片相关

### 资源

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240203224649.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240203223444.webp)

- 包含32-bit MCU内核，时钟频率可调，最高可达64MHz
- 支持 `BLE5.0` 和 `BLE Mesh`
- cortex-m0架构
- 工作电压范围:  `1.8V ≤ VDD33 ≤ 3.6V`
- 1个高级16位定时器（ADTIM），支持4组PWM，其中3组支持死区互补
- 1个通用32位定时器A（GPTIMA），支持4路PWM
- 1个通用16位定时器B（GPTIMB），支持4路PWM
- 1个通用16位定时器C（GPTIMC），支持2组PWM，其中1组支持死区互补
- 1个基本定时器（BSTIM）
- 1个低功耗定时器（LPTIM）
- 2个I2C接口（支持总线仲裁）
- 2个SPI接口
- 3个UART（可支持ISO7816，LIN，IrDA等）
- 外部高速晶体振荡器: 16MHz
- 内部高速RC振荡器: 24MHz
- 外部低速晶体振荡器: 32.768K
- 内部低速RC振荡器: 32.768KHz
- 12位高精度SAR ADC
- 最大支持9路外部通道
- 支持3路内部通道
  \- 内置温度传感器
  \- 1/8,1/4,1/2,3/8 VDD
  \- 内部1.4V参考
- 2路PDM接口，支持数字MIC
- 1路I2S接口

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-24_11-20-24.webp" style="zoom:80%;" />



### 48P引脚图

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240204082249.webp)

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240204082304.webp" style="zoom:80%;" />

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240204082319.webp" style="zoom:80%;" />





### Flash布局

对于BLE应用，Flash被划分为5个部分，参考[FLASH布局](https://ls-doc.readthedocs.io/zh-cn/latest/src/sdk/arch/flash_layout.html)

其中`Info Page & Second Bootloader`、`BLE Host & Controller Protocol Stack`和`App`三个区域的数据需要预先写入Flash，程序才能正确运行，也就是 `info_sbl.hex`，`fw.hex`，`用户自己代码的.hex` 这3个的整合到一起的 `hex`

BLE Application

|                            Region                            |  Address Range (512KB)  | Size  |  Address Range (1MB)  | Size  |
| :----------------------------------------------------------: | :---------------------: | :---: | :-------------------: | :---: |
|                  OTA Settings(**无线升级**)                  |  0x1807F000-0x1807FFFF  |  4KB  | 0x180FF000-0x180FFFFF |  4KB  |
|       TinyFS Data Storage(**轻量级文件系统 数据存储**)       |  0x1807C000-0x1807EFFF  | 12KB  | 0x180FC000-0x180FEFFF | 12KB  |
|               App(**应用程序(即用户代码区)**)                | 0x18034000 - 0x1807BFFF | 288KB | 0x18034000-0x180FBFFF | 800KB |
| BLE Host& Controller Protocol Stack(**BLE 主机与控制器协议栈**) |  0x18002000-0x18033FFF  | 200KB | 0x18002000-0x18033FFF | 200KB |
| Info Page & Second Bootloader(**信息页与第二阶段引导加载程序**) | 0x18000000 - 0x18001FFF |  8KB  | 0x18000000-0x18001FFF |  8KB  |

 flash一个扇区 是4KB， 一个page 是 256 Bytes



| 类别  | 大小 |          地址           |
| :---: | :--: | :---------------------: |
| SRAM  | 48K  | 0x20000000 ~ 0x2000C000 |
| Falsh | 512K | 0x18000000 ~ 0x18080000 |



### SDK架构

```diff
.
+-- bootloader
|   +-- boot_ram	// 第二个引导加载程序
+-- examples		// 不同类型的演示
|   +-- ble
|   +-- mesh
|   +-- peripheral
|   +-- prop_24g
|   +-- utility
+-- module			// 软件组件
+-- peripheral		// 片上外设驱动程序
|   +-- api
|   +-- inc
|   +-- src
+-- rtos			// 实时操作系统源代码
|   +-- freertos
+-- soc				// 平台相关代码
|   +-- arm_cm
|   |   +-- cmsis
|   |   +-- le501x
+-- tools			// 支持固件构建/测试/运行的工具
```



### 启动流程

- 系统启动分为三个阶段

`Primary Bootloader(主引导加载程序)` -> `Secondary Bootloader （SBL）(次级引导加载程序)`-> `Application(应用程序)`

1. Primary Bootloader

此部分程序被固化在ROM中，芯片生产后就不可修改（也叫Boot ROM）

【1】使能Boot PIN内部下拉电阻

【2】读取Boot PIN电平，根据电平选择启动模式

| Boot PIN Voltage |      Mode       |
| :--------------: | :-------------: |
|       Low        | Boot From Flash |
|       High       | Boot From UART  |

【3】从Flash读取必要配置信息（包括配置信息和SBL存储地址、大小）

【4】若为Flash启动模式，则根据SBL存储地址和大小，将其拷贝到RAM中，跳转到SBL代码开始执行；若为UART启动模式，则等待接收UART数据进行交互

|   IC   | Boot PIN | UART TX | UART RX |
| :----: | :------: | :-----: | :-----: |
| LE501X |   PB14   |  PB00   |  PB01   |

2. Secondary Bootloader （SBL）

SBL存放在Flash中，被Boot ROM拷贝到RAM中执行

SBL会执行下述逻辑：

【1】初始化Flash控制器

【2】加载芯片校准参数

【3】检查OTA状态

【3-1】是否需要执行OTA固件拷贝

【3-2】是否需要跳转到单区OTA镜像执行

【4】最后跳转到应用执行

3. Application

也就是我们的代码，裸机或者RTOS



### 休眠唤醒机制

|                                   |            **LP0**             | **LP1**  |            **LP2**             |         **LP3**         |
| :-------------------------------: | :----------------------------: | :------: | :----------------------------: | :---------------------: |
|      RAM Retention(内存保留)      |               On               |    On    |              Off               |           Off           |
| Low Power Clock (32K)(低功耗时钟) |               On               |   Off    |               On               |           Off           |
|    Power Consumption(能量消耗)    |       12-14uA (64K RAM)        | ≈LP0-1uA |              <1uA              |         <500nA          |
|          Scenario(场景)           |          BLE ADV/CONN          |          | Wakeup from RTC or IO & Reboot | Wakeup from IO & Reboot |
|                                   | Scheduled By SDK Automatically |          |        Triggered by APP        |    Triggered by APP     |



- LP0

LP0通常用于 `BLE广播` 和 `连接状态下` 降低功耗。BLE广播和连接都是周期性地收发数据，仅仅在收发数据的时间段内，需要系统正常工作，其余时段，除了需要维持协议时序的低速时钟工作外，其余模块均不需要工作。

- Bare-Metal应用，大循环消息队列没有待处理的消息
- RTOS应用，除了Idle任务外，没有其他就绪态的任务

上述两种情况下，系统都会调用休眠检查相关代码，若片上外设均处于空闲状态，且BLE在当前一段时间内没有活动（如收发数据和协议处理），则进入LP0休眠流程

在BLE应用场景里，工作、空闲状态是周期性交替出现的， `在空闲状态下，系统就会启动LP0休眠，这是由SDK软件框架自动完成的，不需要应用层专门调用`

- 外设与LP0

在HAL外设库中， `xxx_Init`、 `xxx_DeInit` 分别会设置、清除标记该外设忙状态的全局变量。 `所以外设每一段连续工作阶段开始时都应该调用初始化函数,结束时都应该调用相应的反初始化函数，否则外设忙状态会阻止系统进入LP0`

比如串口数据接收和SPI从设备收发，这时相应外设一直处于工作状态，系统不会休眠。需要进入休眠时，应用必须主动结束监听

LP0模式下，为了避免漏电，IO状态须维持不变。对于使用IO复用功能的外设， `需要在外设初始化前，调用对应的外设IO初始化函数（xxx_io_init），在外设反初始化后，调用对应的外设IO反初始化函数（xxx_io_deinit）`，外设IO初始化函数会配置IO复用功能，外设IO反初始化函数会关闭IO复用功能，恢复为GPIO，且输入输出状态保持不变， `如果外设反初始化后，不进行外设IO反初始化，会造成IO管脚复用状态依然维持，一旦进入LP0后，外设模块掉电，复用状态的IO无法得到正确的输入输出配置，可能产生漏电`

- LP2、LP3

LP2和LP3的特点是 `RAM不保持`。因此唤醒后， `无法恢复现场，只能重新执行启动流程`。调用进入LP2、LP3的函数后，可认为程序的运行到此结束，直到唤醒条件满足，再重新启动系统

> `LE501X` 进入LP2，LP3后，所有管脚均会变为输入使能状态，而上下拉配置可以维持。为了避免引起PCB上IO漏电，进入LP2、LP3的函数进行了如下配置：
>
> - 所有输出高的IO，配置上拉
> - 所有输出低的IO，配置下拉
> - 所有输入使能的IO，维持之前的上下拉配置
> - 所有输入未使能的IO，配置下拉



### 外设驱动框架

驱动源文件分为两部分：

- 外设IP相关，在peripheral目录下，包括外设模块寄存器声明，HAL功能源码和API接口文件
- 芯片平台相关，在soc目录下，包括外设基地址定义和外设MSP（MCU Specific Package）源文件

（同一外设IP在不同芯片平台下，功能特性保持一致，而其复位、时钟、芯片级中断控制及入口各不相同，所以同一外设，不同芯片平台下，其功能逻辑代码使用同一份）

> IO复用初始化，反初始化

对于使用IO管脚的外设，在HAL驱动初始化之前和HAL驱动反初始化之后，分别需要调用IO外设复用功能初始化和反初始化

IO外设复用功能初始化函数会将IO的复用功能配置为对应外设接口，并将该IO在GPIO状态下的输入输出配置为与对应外设接口输入输出一致的状态

IO外设复用功能反初始化函数会将IO的复用功能配置恢复为GPIO。这样在IO复用反初始化后，芯片管脚输入输出维持不变，可确保芯片进入LP0后，IO不会因片内外设电源域掉电，而丢失状态，引起漏电

> HAL初始化、反初始化

`初始化流程`：

- MSP初始化
  - 模块软件复位
  - 注册中断处理函数
  - 清除中断、使能中断
  - 开启模块时钟
- 忙状态置位
- 外设模块寄存器初始化、全局状态初始化

`反初始化流程`：

- MSP反初始化
  - 关闭模块时钟
  - 禁用中断
- 忙状态清零

>  数据传输类外设HAL驱动接口

典型的数据传输类外设包括UART、SPI、IIC。HAL库通常实现了轮询、中断和DMA三种传输接口。

1. 轮询

阻塞传输，等待传输完成后，函数返回。

2. 中断

函数调用后立刻返回，在中断里收发数据，以中断回调的方式通知传输完成。

3. DMA

函数调用后立刻返回，数据搬运由DMA负责，不需要CPU参与，以中断回调的方式通知传输完成



### 代码加密

Flash的 Information 区域中有一个字节的特殊数据，在启动是 RomCode 会去检查这个字节，如果是 0xBA ，就禁用掉 SWD 调试口，这样就能防止固件通过 SWD 接口读出；禁用 SWD 以后，就不能通过 JFlash 去烧录了。如果需要重新烧录程序，需要通过串口先将Flash 的数据擦除掉

- 串口擦除Flash数据

如果需要更新里面的固件，需要先将Flash的数据先擦除；擦除的方法：PB14 拉高，重新上电，通过串口启动。这里串口默认是用的 PB00 和 PB01，任意波特率，设备会自动检测波特率

- 擦除流程：
  - 先发送 0x55 , 会接收设备返回的 0xAA
  - 然后发送 0x5A 0x5A 0x11 0x00 , 设备返回 0xA5 0xA5 0x91 0x00 0xE5

擦除完毕以后去掉 PB14，再重新上电，用JFlash就可以烧录





### 注意

> 在LE501X系统中，只有 `PA00、PA07、PB11、PB15` 四个IO可以在任意状态下触发中断，其余IO只能在CPU工作状态下触发中断，不能在BLE休眠状态下触发中断。
>
> BLE处于广播或者连接时，系统根据广播、连接的间隔定期自动休眠、唤醒，所以这种应用场景，建议使用上述四根IO作为中断

> 5010/5110芯片GPIO上电复位默认高阻状态，但是：
>
> 1. `PB05/PB06`上电默认为SWD仿真功能口，SDK在上电初始化时默认使能了弱下拉；如果用户需要把这两个GPIO当做IO功能使用，需要应用程序把他们设置为GPIO功能模式。
>
>    注意：当用户设置PB05/06为GPIO功能模式后，jlink将无法连接。只有通过复位同时拉高PB14进入boot模式，并且芯片不在加密状态，jlink才能重新芯片
>
> 2. `PC01`上电默认高电平，应用开发时，硬件设计需要注意初始电平特点，建议该IO设计成低电平有效，防止上电时误触发动作
>
> 3. `PB00/PB01`上电默认boot的uart1串口通信功能，默认电平为高电平，应用开发时，如果当普通GPIO功能，建议该IO设计成低电平有效，防止上电时误触发动作。
>
>    注意：PB00/PB01上电默认uart复用功能，但是在SDK软件中，初始化GPIO默认会恢复GPIO功能模式，所以在PB00/PB01上电过程中，从上电到进入用户main初始化IO会有大约30ms左右时间为uart模式，IO呈现高电平状态

> 1. 芯片在LP0模式下，GPIO可以保持睡眠前状态，LP0唤醒后IO不需要重新配置
>
> 2. 芯片在LP2/LP3模式下，GPIO部分控制寄存器失效，GPIO不能保持面前状态，但是GPIO上下拉有效，在SDK中，在进入睡眠流程时通过配置GPIO上下拉电阻状态使GPIO保持睡眠前GPIO电平状态，LP2/LP3唤醒后CPU软件重新复位运行
>
>    注意：在LP2/LP3睡眠时，GPIO虽然保持睡眠前电平状态，但是电平是通过上下拉电阻固定，带载能力会大大降低，应用时需要特别注意。

> 5010/5110芯片支持4个GPIO唤醒： `PA00、PA07、PB11、PB15`。且支持上升沿或下降沿唤醒
>
> 当配置多个唤醒源，且唤醒沿不一致时，如果其中唤醒源上升沿唤醒，会误触发其他配置了下降沿的唤醒源产生下降沿唤醒标志位
>
> 应用时，建议用户两种规避方式：
>
> - `尽量使用上升沿唤醒`
> - `使用下降沿唤醒时，唤醒后通过读取IO输入数据寄存器bit位判断是哪个唤醒IO发生唤醒`

> 目前SDK BLE应用中把GPTIMB和LPTIM定时器应用于内部LRC校准，用户需要 `避免对GPTIMB和LPTIM定时器的使用`

> 1.规则组连续模式采样速度
>
> - 用户在中断方式使用规则组连续转换模式时，需要注意ADC采样速度，**当ADC采样速度大于4M时**，CPU有可能会不能及时通过中断的方式取出当前转换通道ADC转换值，而被下一个通道转换数据覆盖。
>
> - 当用户需要使用规则组多通道连续采样，且速率大于4M时， `建议用户使用DMA的方式读取ADC数据`，SDK中已为用户提供对应HAL库接口。
>
> 2.多通道数据采样
>
> - 无论规则组还是注入组，ADC多通道采样配置只对连续采样模式或者扫描模式有意义。如果用户配置了多个通道采样，但是未使能连续采样模式或扫描模式，每次触发ADC采样，ADC均采样第一个转换通道RSQ1或JSQ1
>
> 3.ADC高速采样
>
> - 当用户需要多通道连续采样，且ADC采样速率大于等于 `8M` 时，建议ADC的转换时间SMPR配置为最大 `15clk`，否则ADC不同通道间会相互干扰影响采样结果。
> - 当用户在ADC采样速度大于等于16M时，如果通过寄存器直接配置的方式修改ADC通道配置参数， `在配置完成后需要delay 10us后再触发ADC采样，否则新配置不能生效`

> 用户在使用DMA时需要注意： `使用DMA的外设，当启动DMA传输的同时，禁止CPU访问该外设所在的总线`，否则，当前DMA数据传输有一定概率出错。
>
> - 当SSI模块使用DMA从RAM传输数据到发送寄存器时，由于SSI模块所在的总线是APB2，所以，此时应用软件应避免CPU去访问APB2总线上的外设，比如ADC、UART1等

> RTC设置一些寄存器时，由于硬件有时钟域同步的要求，软件处理时 `需要增加必要的delay`（至少一个RTC cycle），如RTC_wkuptime_set（设置wakeup时间，更新WKUP寄存器）和RTC_CalendarSet（设置Calendar，配置CTRL寄存器，disable RTC）

> IIC slave receive时，在最后一次FIFO满的时候，需要更新NBYTES的配置，并在当前传输完成时（stop中断）reset IIC模块更新NBYTES
>
> IIC slave不支持byte control，无法实现listen模式

> 【适配1M Flash】
>
> 在使用1M Flash 的5010芯片的时候，需要修改TinyFS数据存储区的基地址
>
> - keil环境
>
>  `找到after_build.bat文件中0x1807c000的数据，然后修改为0x180fc000重新编译即可`
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240203211821.webp)
>
> - vscode环境
>
> 需要改 `info_sbl_merge.py`



## OTA

> 前台OTA

OTA功能以独立的程序映像烧录在芯片Flash特定地址，独立于应用程序映像。在实施OTA升级前，需要跳出应用，重启执行OTA功能。在OTA过程中，不能完成原有应用功能，只有OTA状态呈现，因此称作 前台OTA

> 后台OTA

OTA功能与应用编译在同一程序映像中。实施OTA升级时，原有应用功能依然可以运行，因此称作 后台OTA 

> 双区OTA

可用于应用程序存储的Flash空间一分为二。一部分存储当前运行的应用固件，另一部分存新固件。当新固件全部收到之后，重启，将老固件擦除，新固件搬移到老固件所在的位置。这种方式固件存储区一份为二，因此称作 双区OTA 。这种方式的好处在于，若新固件接收过程中出现异常，老固件可以重新运行

> 单区OTA

当应用程序固件较大，可用于应用程序存储的Flash空间无法容纳两份应用程序固件的时候。固件升级只能通过 单区OTA 的方式进行。在固件升级前，先进入OTA模式，擦除原有固件，接收新固件，若接收失败，则继续维持OTA状态，必须重新接收新固件



- 概念

`Flash可用空间`：Flash会存放信息页，Bootloader，协议栈，持久数据和OTA功能映像等内容，在这些区域之外，Flash剩下的大片连续区域称作 Flash可用空间

`固件大小最大值`：开发者需要对应用程序当前版本和后续一切新版本的程序映像大小最大值有一个估计。双区OTA的条件是：

$$\text{Flash可用空间大小 > 2 * 固件大小最大值}$$

`应用程序映像地址、新固件下载地址`：

在单区OTA中：

$$\text{新固件下载地址 == 应用程序映像地址}$$

在双区OTA中：

$$\text{新固件下载地址 > 应用程序映像地址 + 应用程序大小 并且 新固件不能超出Flash可用空间范围}$$

`OTA功能程序映像地址（仅针对前台OTA）`：前台OTA的OTA功能程序存放地址和执行地址均不同于用户应用程序。OTA功能程序既不能覆盖Flash其他区域信息，又要确保尽可能留出更大的Flash可用空间，因此在编写和链接的时候，要特别注意程序大小及链接地址



## 新建工程

1. 芯片选择 `LE501X`
2. 魔法棒

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-04_13-27-59.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-04_13-28-49.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-04_13-29-08.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-04_13-29-28.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-04_13-29-28.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-04_13-29-52.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-04_13-29-59.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-04_13-30-15.webp)

{% endgallery %}

3. 其他文件则按需加到里面即可



## S9旧协议最新

> 有旧协议+2.4G遥控器+AI+新协议升级(其他新协议控制功能暂未加)
>
> uart1为云台串口，uart3为上位机串口，串口2为2.4g接收(遥控器+AI)

### LED

> 原理图

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-04_16-39-19.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-04_16-39-32.webp)

> 程序





### 按键

> 硬件

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240206175911.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240206180143.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240206180505.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240206180513.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240206180008.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240206180217.webp)

{% endgallery %}

> 附1

软开关电路其实就是一个自锁电路，关机状态下，按下按钮k1，D2导通，T1导通(PMOS)，单片机上电，让power lock高电平，让Q5(NPN)导通，让T1不会因为按钮放开而断电。工作状态下，按下k1，key power脚检测到电平变化，power lock拉低，按钮松开的时候T1截止，系统断电，R27是上拉电阻是给MOS管置位的，保证未导通前是高电平



> 程序



> 其他

用到了外部中断，外部中断的函数是弱函数所以只需要重写即可，可在 `ls_soc_gpio.c` 找到

```cpp
void io_exti_callback(uint8_t pin,exti_edge_t edge)
```



### ADC

> 硬件

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-09_15-46-38.webp" style="zoom:80%;" />

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-09_15-49-02.webp" style="zoom:80%;" />

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-09_15-47-08.webp)



> 程序





> 其他

- 用到了ADC回调函数

```cpp
// 注入转换完成回调在非阻塞模式
void  HAL_ADCEx_InjectedConvCpltCallback(ADC_HandleTypeDef* hadc);
```



### Power

> 硬件

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-13_10-07-28.webp" style="zoom:80%;" />



> 附1

`BAT_STDBY` 引脚低电平则表示充电完成





### Encoder

> 硬件

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-14_14-17-05.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-14_14-17-24.webp)

> 软件





> 附1

高级定时器ADTIM是16位的

数字功能的引脚都可以任意映射

初始化的话参考STM32 HAL库生成的的编码器初始化代码即可，大致一样



### UART

> 硬件

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-15_10-14-15.webp)



> 附1

 `uart1为云台串口，uart3为上位机串口，串口2为2.4g接收(遥控器+AI)`

```cpp
void HAL_UART_TxCpltCallback(UART_HandleTypeDef *huart)	// 串口发送完成回调函数
```

旧协议解析和新协议解析都有，新协议是用作固件升级用！



### HID

```cpp
/* HID设备描述符 */
const uint8_t hid_report_map[] =
{
    0x05, 0x0c, /* USAGE_PAGE (Consumer Devices) 用途页，指定设备的功能--消费类设备*/	
    0x09, 0x01, /* USAGE (Consumer Control) 用途--消费者控制*/
    0xa1, 0x01, /* COLLECTION (Application) 表示应用集合，必须要以 END_COLLECTION 来结束它 描述--消费者控制*/

    0x15, 0x00,       /* LOGICAL_MINIMUM (0) 也就是Usage的取值最小范围--逻辑最小值为 0*/
    0x25, 0x01,       /* LOGICAL_MAXIMUM (1) 也就是Usage的取值最大范围--逻辑最大值为 1*/
    0x09, 0xEA,       /* (Volume Down) */
    0x09, 0xE9,       /* (Volume Up) */
    0x09, 0x82,       /* Usage (Mode Step) 前后摄像头切换 发0x04 */
    0x09, 0xA0,       /* Usage (VCR Plus) 拍照/录像切换  发0x08 */
    0x0A, 0x2D, 0x02, /* Usage (AC Zoom In) 低位在前高位在后 发0x10 */
    0x0A, 0x2E, 0x02, /* Usage (AC Zoom Out) */
    0x0A, 0x32, 0x02, /* Usage (Tracking Decrement) */
    0x0A, 0x32, 0X02, /* Usage (tracking Increment) */
    0x75, 0x01,       /* REPORT_SIZE (1) */
    0x95, 0x08,       /* REPORT_COUNT (8) */
    0x81, 0x02,       /* Input (Data,Value,Relative,Bit Field) */

    0xc0 /* END_COLLECTION */
};
```

前缀是 `0x09`，通过手册1可以知道是 `Lobal前缀类型`，`0000 10 nn`是属于 `Usage标签`，通过文档提示需要去看另一个手册2

去找，有个 `Usage Types (Controls)` 里面有 `Re-Trigger Control (RTC)`, 找到 `Consumer Page (0x0C)` 这里面都是消费者控制

`0xEA`---RTC类型，通过一个控件或按钮来减小音频设备的音量大小

`0xE9`---RTC类型，通过一个控件或按钮来增大音频设备的音量大小

前缀是 `0x0A`，通过手册1可以知道是 `Lobal前缀类型`，`0000 10 nn`是属于 `Usage标签`，找到 `Consumer Page (0x0C)` 

`0x22D`---Sel类型，焦距加

`0x22E`---Sel类型，焦距加

### Boot

> 需要创建一个头文件存储程序基地址宏定义，然后在 `ble.ld` 里引用，这个头文件需要放在 `ble.ld` 同文件夹下否则找不到路径

```bash
#! armcc -E
#include "BootConfig.h"
#define FLASH_BASE_USER CURRENT_FIRMWARE_ADDR
#include "common.ld"
```

{% folding, BootConfig.h %}

```cpp
#ifndef __BOOTCONFIG_H
#define __BOOTCONFIG_H

/* ----------------固件升级配置-----------------
 * 			数据区0链接起始地址 0x18034000
 * 			数据区1链接起始地址 0x18057F00						*/
#define CURRENT_FIRMWARE_ADDR 0x18034000	/* 链接起始地址 */

#endif
```

{% endfolding %}



> 固件升级采用方案：**boot+app1+app2（A/B分区、乒乓升级）**
>
> 其他方式可参考：[史上最牛逼的单片机升级总结——究极骚气之boot0+boot1+app（boot+app双升级）](https://blog.csdn.net/weixin_49460546/article/details/134727372?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_utm_term~default-0-134727372-blog-126912837.235^v43^pc_blog_bottom_relevance_base6&spm=1001.2101.3001.4242.1&utm_relevant_index=3)

两个大小相同的分区APP1、APP2，如果当前在APP1分区执行代码，升级时就把固件下载到APP2分区。升级成功后设备重启，模组切换到APP2分区执行；下次再升级就切换到APP1分区，一直这样轮询。

- 优点


① 出厂时设备上有两套可以正常工作的系统，升级时确保设备上始终有一个可以工作的系统，方便维修和售后

② OTA升级可在系统的后台进行，所以更新过程中，用户可以正常使用设备，数据更新完成后，仅需要用户重启一次设备进入新系统（这场景熟不熟悉）

③ 如果OTA升级失败，设备可以回退到升级前的旧系统，并且可以尝试再次更新升级

- 缺点

① 需要和app相同大小的额外flash空间

② 同样在处理升级失败时的逻辑比较复杂

③ 不能对boot进行升级

- 其他注意

需要准备两份区域的固件BIN，升级时先读取程序里现在是在哪个区，然后在另一个区进行升级选择对应的固件BIN



> 附1

程序里单个数据区大小是 `575` 页

```cpp
#define DATA0_ADDR_BASE 0x18034000  // 数据区0基地址(默认)
#define DATA1_ADDR_BASE 0x18057F00  // 数据区1基地址
```

$$575\times256=147200‬Byte=\text{0x23F00}$$

$$\text{默认的数据0区域+单个数据区大小等于数据区1的起始地址：}\text{0x18034000}+\text{0x23F00}=\text{0x18057F00‬}$$

$$\text{数据1区域+单个数据区大小等存放固件信息的起始地址：}\text{0x18057F00}+\text{0x23F00}=\text{0x1807BE00}$$

即最终固件信息留有 `12K` 空间



#### Flash

> 基础知识

- 非易失存储器常见类型

1. OTP（One Time Programmable）一次性可编程存储，程序烧入后不可再次更改和清除
2. EPROM(Erasable Programmable ROM) 可擦除可编程只读存储器，利用高电压写入，曝光于紫外线抹除清空
3. EEPROM（Eraseable programmable read only memory）电可擦编程只读内存，类似EPROM，抹除方式使用高电场
4. Flash memory快闪存储器，读写速度和容量上要远远高于E2PROM，价格也便宜的多，嵌入式领域常用存储

- Flash的典型分类— `NorFlash（贵/容量小/读快写慢）` 与 `NandFlash（便宜/容量大/读慢写快）`

芯片的是 `Nor Flash`，与 `NAND Flash` 相比， `Nor Flash` 具有较低的存储密度和较高的成本，但具有较快的读取速度、较低的读取延迟和较好的随机访问性能

扇区：是 NOR Flash 存储器中的一个连续区域，它是最小的可擦除单元，每个扇区通常具有相同的大小，擦除操作只能以扇区为单位进行，即整个扇区的数据将被清除

块：是 NOR Flash 存储器中的一个更大的逻辑单元，它由多个扇区组成，块的大小可以是扇区大小的倍数，块是 NOR Flash 存储器进行读取和编程操作的最小单位

- 5010X上的Flash

|  页大小  | 扇区大小 | 芯片大小 |
| :------: | :------: | :------: |
| 256Bytes | 4KBytes  |  512KB   |



> 注意问题

1. 写入前要先做擦除处理
2. 需要按页擦除
3. 页写入有两种方式：Quad-SPI(快点)，和普通SPI



#### BootLoader

Boot Loader 就是在内核运行之前运行的一段小程序。通过它我们初始化硬件设备、建立内存空间的映射图，从而将系统的软硬件环境带到一个合适的状态，以便为最终调用操作系统内核准备好正确的环境

Boot Loader 是特定于硬件的，每种不同的 CPU 体系结构都有不同的 BootLoader。有些 BootLoader 也支持多种体系结构的 CPU，比如 U-Boot 就同时支持 ARM 体系结构和 MIPS 体系结构。因此，建立一个通用的 Boot Loader 几乎是不可能的

> 固件升级并编写Bootloader时，需要注意以下几个关键点

1. 熟悉硬件和数据手册：在开发过程中，确保充分理解STM32微控制器的特性和功能。阅读相关数据手册，了解其内存布局、外设接口以及其他重要信息。
2. 选择合适的通信接口：根据项目需求选择合适的通信接口进行固件升级，如串口、I2C、SPI、USB等。确保所选接口可以与外部设备（如PC）正常通信。（后续会使用CAN UART）
3. 定义固件升级协议：设计一个简单且可靠的通信协议，用于在Bootloader和外部设备之间传输数据。协议应包括命令、地址、数据长度、数据包校验等信息。
4. 保留足够的Bootloader空间：为Bootloader预留足够的程序存储空间。Bootloader的大小可能会随着功能的增加而增大，因此预留一定的余量非常重要。
5. 安全和鲁棒性：确保Bootloader代码具有良好的异常处理和错误检测能力。避免因意外情况导致的设备损坏或不可恢复状态。
6. 可扩展性：在设计Bootloader时考虑到未来可能的功能扩展。保持代码结构清晰，易于维护和升级。
7. 测试与验证：在实际硬件上对Bootloader进行充分测试，确保其下载、擦除、写入等操作的正确性和稳定性。

> IAP框架

1. 单片机从基地址启动

`引导区代码启动` --> `跳转到boot` --> `没有检测到标志位` --> `跳转到app` --> `检查是否发生代码升级事件` --> `给flash写入标志` --> `系统重启` --> `引导区代码启动` --> `跳转到boot`  --> `检测到标志位` --> `启动接收` --> `从新的地址启动app`

2. 单片机从基地址启动

`boot区代码启动` --> `没有检测到标志位` --> `跳转到app` --> `检查到发生代码升级事件` --> `给flash写入标志` --> `系统重启` --> `boot区代码启动` --> `检测到标志位` --> `启动接收` --> `覆盖原app代码` --> `启动app`

3. 单片机从基地址启动

`app代码启动` --> `检测到代码升级事件` --> `跳转到接收代码` --> `启动接收` --> `系统重启`



> 代码的跳转

- SP指针

p指针值就是当前sram的堆栈地址，在编译的hex文件可以清晰的看出：sp指针的起始值就在hex文件的开头

m3内核(arm的其他内核待考察)的sp指针有psp跟msp两种，在普通的前后台系统中，这两者无需分辨，但是在rtos系统中要注意这两个区别：中断会使用msp指针，线程代码使用psp指针。在做iap跳转时要注意对这两个sp指针的差异从而正确初始化sp指针

参考：[Cortex-M3 双堆栈指针MSP&PSP](https://www.cnblogs.com/utank/p/11264175.html)

### BLE

- 流程

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-24_11-27-41.webp" style="zoom:80%;" />

> 广播的数据包里的小数据包顺序需要注意：`必须按照 adv_type/data_buf/length 的顺序传递`

> 断开连接后执行顺序是：`gap_manager_callback` -> `dev_manager_callback`

> MAC地址采用 `随机可解析私有地址`，最高字节保持不变，其他则为随机数

> 广播步骤：
>
> 1. 创建广播 `Bsp_BlueTooth_Create_adv_Obj`
> 2. 获取广播句柄
> 3. 开始广播 `Bsp_BlueTooth_Start_adv`

> 蓝牙串口服务：
>
> 需要先了解几个官方的结构体(`ls_ble.h`)
>
> 然后就是先进行属性的声明然后再进行服务的声明(相当于属性声明是在服务声明里)
>
> - 通用枚举
>
> ```cpp
> /**
>   * @brief Service and attribute permissions definition.(服务和属性权限定义)
>   */
> enum svc_att_perm
> {
>     PERM_NO_AUTH = 0,                           /*!< 表示非认证状态，即无需认证*/
>     PERM_UNAUTH,                                /*!< 表示未认证状态，即未经认证*/
>     PERM_AUTH,                                  /*!< 表示已认证状态，即已经认证*/
>     PERM_SEC_CON,                               /*!< 表示安全连接状态，即安全连接下的权限*/
> };
> 
> /**
>   * @brief Length of UUID(UUID长度)
>   */
> enum uuid_length
> {
>     UUID_LEN_16BIT = 0,                             /*!< 16bits UUID*/
>     UUID_LEN_32BIT,                                 /*!< 32bits UUID*/
>     UUID_LEN_128BIT,                                /*!< 128bits UUID*/
> };
> ```
>
> - 属性声明
>
> ```cpp
> /**
>   * @brief Characteristics properities.(特征特性)
>   */
> struct char_properties
> {
>     uint8_t broadcast: 1,                           /*!< 服务器特性配置描述符中的特性值广播启用*/
>             rd_en: 1,                               /*!< 读请求使能读请求使能*/
>             wr_cmd: 1,                              /*!< 写命令使能*/
>             wr_req: 1,                              /*!< 写请求使能*/
>             ntf_en: 1,                              /*!< 启用通知*/
>             ind_en: 1,                              /*!< 指示启动*/
>             wr_signed: 1,                           /*!< 写签名使能*/
>             ext_prop: 1;                            /*!< 扩展属性启用*/
> };
> 
> /**
>   * @brief Characteristics permissions(特征权限)
>   */
> struct char_permissions
> {
>     uint8_t rd_perm: 2,                             /*!< 读取权限。 请参阅::svc_att_perm*/
>             wr_perm: 2,                             /*!< 写入权限。 请参阅::svc_att_perm*/
>             ind_perm: 2,                            /*!< 表示允许。 请参阅::svc_att_perm*/
>             ntf_perm: 2;                            /*!< 通知权限。 请参阅::svc_att_perm*/
> };
> 
> /**
>   * @brief Attribute declaration.(属性声明)
>   */
> struct att_decl
> {
>     const uint8_t *uuid;                            /*!< 属性的 UUID*/
>     struct
>     {
>         uint16_t max_len: 12,                       /*!< 属性支持的最大长度（以字节为单位）*/
>                  eks: 1,                             /*!< 1 表示加密密钥大小必须为 16 字节*/
>                  uuid_len: 2,                        /*!< UUID 的长度。 参考::uuid_length*/
>                  read_indication: 1;                 /*!< 触发读取指示。 0表示数据库中有数据，1表示读取请求将转发给应用程序*/
>     } s;
>     struct char_permissions char_perm;              /*!< 特征权限*/
>     struct char_properties char_prop;               /*!< 特征特性*/
> };
> ```
>
> - 服务声明
>
> ```cpp
> /**
>   * @brief Service declaration.(服务声明)
>   */
> struct svc_decl
> {
>     const uint8_t *uuid;                            /*!< 服务的 UUID*/
>     struct att_decl *att;                           /*!< 服务中包含的属性*/
>     uint8_t nb_att;                                 /*!< 服务中包含的属性数量*/
>     uint8_t    sec_lvl: 2,                          /*!< 安全级别。参考 ::svc_att_perm*/
>                uuid_len: 2,                            /*!< UUID 的长度。参考 ::uuid_length*/
>                secondary: 1;                           /*!< 0 = 主要服务，1 = 次要服务*/
> };
> ```



- 设备管理器中的事件类型( `dev_evt_type`)

> ```cpp
> STACK_INIT -- - 栈初始化事件
> STACK_READY -- - 栈就绪事件
> PROFILE_ADDED -- - 添加配置文件事件
> SERVICE_ADDED -- - 添加服务事件
> ADV_OBJ_CREATED -- - 创建广播对象事件
> SCAN_OBJ_CREATED -- - 创建扫描对象事件
> INIT_OBJ_CREATED -- - 创建初始化对象事件
> ADV_STARTED -- - 广播开始事件
> ADV_STOPPED -- - 广播停止事件
> ADV_UPDATED -- - 广播数据更新事件
> SCAN_STARTED -- - 扫描开始事件
> SCAN_STOPPED -- - 扫描停止事件
> INIT_STARTED -- - 初始化开始事件
> INIT_STOPPED -- - 初始化停止事件
> OBJ_DELETED -- - 对象删除事件
> ADV_REPORT -- - 接收广播报告事件
> SCAN_REQ_IND -- - 表示接收到扫描请求事件
> ```

- GAP 中的事件类型(`gap_evt_type`)

> ```cpp
> CONNECTED -- - 连接事件
> DISCONNECTED -- - 断开连接事件
> CONN_PARAM_REQ -- - 连接参数请求事件
> CONN_PARAM_UPDATED -- - 连接参数更新事件
> MASTER_PAIR_REQ, -- - 主机配对请求事件
> SLAVE_SECURITY_REQ -- - 从机安全请求事件
> PAIR_DONE -- - 配对完成事件
> ENCRYPT_FAIL -- - 加密失败事件
> ENCRYPT_DONE -- - 加密完成事件
> DISPLAY_PASSKEY -- - 显示配对码事件
> REQUEST_PASSKEY -- - 请求配对码事件
> NUMERIC_COMPARE -- - 数字比对事件
> REQUEST_LEGACY_OOB -- - 请求传统OOB事件
> REQUEST_SC_OOB -- - 请求安全连接OOB事件
> GET_DEV_INFO_DEV_NAME -- - 获取设备信息中的设备名称
> GET_DEV_INFO_APPEARANCE -- - 获取设备信息中的外观图标
> GET_DEV_INFO_SLV_PRE_PARAM -- - 获取设备信息中的从机首选参数
> GET_DEV_INFO_PEER_RSSI -- - 获取连接RSSI指示
> PHY_UPDATED -- - 物理层更新事件
> ```

- GATT 中的事件类型(`gatt_evt_type`)

> ```cpp
> SERVER_READ_REQ --- 服务器读请求
> SERVER_WRITE_REQ --- 服务器写请求
> SERVER_NOTIFICATION_DONE --- 服务器发送通知完成
> SERVER_INDICATION_DONE --- 服务器发送指示完成
> 
> CLIENT_RECV_NOTIFICATION --- 客户端接收通知
> CLIENT_RECV_INDICATION --- 客户端接收指示
> CLIENT_PRIMARY_SVC_DIS_IND --- 客户端主服务发现指示
> CLIENT_INCL_SVC_DIS_IND --- 客户端包含服务发现指示
> CLIENT_CHAR_DIS_BY_UUID_IND --- 客户端按UUID发现特征指示
> CLIENT_CHAR_DESC_DIS_BY_UUID_IND --- 客户端按UUID发现特征描述符指示
> CLIENT_RD_CHAR_VAL_BY_UUID_IND --- 客户端按UUID读特征值指示
> CLIENT_WRITE_WITH_RSP_DONE --- 客户端写响应完成指示
> CLIENT_WRITE_NO_RSP_DONE --- 客户端写无响应完成指示
> CLIENT_DISC_OP_DONE --- 客户端发现操作完成指示
> 
> MTU_CHANGED_INDICATION --- MTU交换指示，适用于客户端和服务器
> GATT_EVT_MAX --- GATT事件最大值
> ```

- BLE程序整体步骤执行：

> 先看看几个库结构体：
>
> ```cpp
> /**
>   * @brief Device event union.
>   */
> union dev_evt_u
> {
>     struct profile_added_evt profile_added;         /*!< 表示配置文件添加事件*/ 
>     struct service_added_evt service_added;         /*!< 表示服务添加事件*/ 
>     struct obj_created_evt obj_created;             /*!< 表示对象创建事件*/ 
>     struct started_evt started;                     /*!< 表示启动事件*/ 
>     struct adv_updated_evt adv_updated;             /*!< 表示广播更新事件*/ 
>     struct stopped_evt stopped;                     /*!< 表示停止事件*/ 
>     struct obj_deleted_evt deleted;                 /*!< 表示对象删除事件*/ 
>     struct adv_report_evt adv_report;               /*!< 表示广播报告事件*/ 
>     struct scan_req_ind_evt scan_req_ind;           /*!< 表示扫描请求指示事件*/ 
> };
> ```
>
> 配置文件相关：
>
> ```cpp
> /**
>   * @brief Profile added event.(添加配置文件事件)
>   */
> struct profile_added_evt
> {
>     uint16_t start_hdl;                             /*!< 表示配置文件的起始句柄（handle）*/ 
>     enum prf_id id;                                 /*!< 配置文件的ID*/ 
> };
> 
> /**
>   * @brief Profile IDs.(配置文件ID)
>   */
> enum prf_id
> {
>     PRF_DIS_SERVER,                                 /*!< 表示设备信息服务配置文件*/ 
>     PRF_MESH,                                       /*!< 表示Mesh配置文件*/ 
>     PRF_LS_MESH,                                    /*!< 表示LS Mesh配置文件*/ 
>     PRF_FOTA_SERVER,                                /*!< 表示FOTA服务器服务配置文件*/ 
>     PRF_HID,                                        /*!< 表示HID（Human Interface Device）配置文件*/ 
>     PRF_BASS,                                       /*!< 表示电池服务配置文件*/ 
>     PRF_ANCS,                                       /*!< 表示苹果通知中心服务配置文件*/
> };
> 
> ///Type of operation HID events
> enum hid_evt_type
> {
>     HID_REPORT_READ,/**< 读取报告值配置 */
>     HID_NTF_CFG,/**< 报告通知配置值 */
>     HID_NTF_DONE,/**< 报告通知完成 */
>     HID_REPORT_WRITE,/**< 修改/设置报告值 */
> };
> ```

> 文件系统tinyfs相关结构体：
>
> ```cpp
> /*表示嵌入式文件系统中可能发生的错误代码*/
> enum tinyfs_error_code
> {
>     TINYFS_NO_ERROR,	// 没有错误，操作成功
>     TINYFS_RECORD_DATA_CORRUPTED,	// 记录数据损坏
>     TINYFS_INSUFFICIENT_NODE_BUF,	// 节点缓冲区不足
>     TINYFS_INSUFFICIENT_RECORD_DATA_BUF,	// 记录数据缓冲区不足
>     TINYFS_DIR_IDX_OVERFLOW,	// 目录索引溢出，即目录数量达到了最大限制
>     TINYFS_PARENT_DIR_NOT_FOUND,	// 上级目录未找到
>     TINYFS_DIR_NOT_EXISTED,	// 目录不存在
>     TINYFS_DIR_NOT_EMPTY,	// 目录不为空，无法执行删除操作
>     TINYFS_DIR_KEY_ALREADY_EXISTED,	// 目录键已经存在
>     TINYFS_RECORD_KEY_ALREADY_EXISTED,	// 记录键已经存在
>     TINYFS_RECORD_KEY_NOT_FOUND,	// 记录键未找到
>     TINYFS_TMP_BUF_OVERFLOW,	// 临时缓冲区溢出
> };
> ```

> 配对设置结构体：
>
> ```cpp
> /**
>   * @brief SEC_KEY_DIST_FLAG 定义安全密钥分发标志。
>   */
> enum gap_key_dist
> {
>     KDIST_NONE             =  0,           /*!< 无需分发密钥 */
>     KDIST_ENCKEY           = (1 << 0),     /*!< 分发加密和主标识信息 */
>     KDIST_IDKEY            = (1 << 1),     /*!< 分发身份和地址信息 */
>     KDIST_SIGNKEY          = (1 << 2),     /*!< 分发签名信息 */
> };
> 
> /**
>   * @brief BLE_GAP_IO_CAPS 定义 BLE GAP 输入输出能力。
>   */
> enum gap_io_caps
> {
>     BLE_GAP_IO_CAPS_DISPLAY_ONLY,           /*!< 仅显示 */
>     BLE_GAP_IO_CAPS_DISPLAY_YESNO,          /*!< 显示并允许是/否输入 */
>     BLE_GAP_IO_CAPS_KEYBOARD_ONLY,          /*!< 仅键盘输入 */
>     BLE_GAP_IO_CAPS_NONE,                   /*!< 无输入输出能力 */
>     BLE_GAP_IO_CAPS_KEYBOARD_DISPLAY,       /*!< 键盘和显示 */
> };
> 
> /**
>   * @brief SEC_AUTH_FLAG 定义安全认证标志。
>   */
> enum gap_pair_auth
> {
>     AUTH_NONE              =  0,           /*!< 无认证要求 */
>     AUTH_BOND              = (1 << 0),     /*!< 绑定标志 */
>     AUTH_MITM              = (1 << 2),     /*!< MITM 标志（中间人攻击保护） */
>     AUTH_SEC_CON           = (1 << 3),     /*!< 安全连接标志 */
>     AUTH_KEY_PRESS_NOTIFY  = (1 << 4),     /*!< 按键通知标志 */
> };
> 
> 
> /**
>   * @brief Set security parameter.(设置安全参数)
>   */
> struct pair_feature
> {
>     uint8_t iocap;                          /*!< 设置 IO 能力，指示设备的输入输出能力。可能的取值包括 gap_io_caps 中定义的值*/
>     uint8_t oob;                            /*!< 指示是否支持 Out-of-Band（OOB）数据交换。可能的取值包括 gap_pair_oob 中定义的值*/
>     uint8_t auth;                           /*!< 设置认证方式，指示设备的认证模式。可能的取值包括 gap_pair_auth 中定义的值*/
>     uint8_t key_size;                       /*!< 指示支持的最大长期密钥（LTK）大小，范围为 7 到 16 字节*/
>     uint8_t ikey_dist;                      /*!< 设置初始密钥分发方式，指示在初始连接中要分发哪些密钥。可能的取值包括 gap_key_dist 中定义的值*/
>     uint8_t rkey_dist;                      /*!< 设置响应密钥分发方式，指示在连接建立后对方设备要分发哪些密钥。可能的取值同样包括 gap_key_dist 中定义的值*/
> };
> ```

1. 没电->开机(单独测试正常)

```cpp
注意：一定要在配置文件添加宏定义，否则开机卡死
#define SDK_MAX_PROFILE_NUM 2			 // BLE_PROFILE数量    

1. STACK_INIT: 堆栈的初始化
    
2. STACK_READY: 【1】获取MAC地址 【2】调用添加服务函数dev_manager_add_service添加蓝牙服务 【3】用户相关初始化(定时器,开机上推)
    
3. SERVICE_ADDED：通过svc_added_service_cnt变量来进行多次添加服务，先添加 if(svc_added_service_cnt == 0)的,然后调用添加服务函数dev_manager_add_service
    
4. SERVICE_ADDED： 添加 if(svc_added_service_cnt == 1)的,然后调用dev_manager_prf_bass_server_add添加了一个 BASS（Battery Service）的服务器配置文件(才会触发进入【PROFILE_ADDED】)
    
5. PROFILE_ADDED： 执行用户函数Bsp_BlueTooth_prf_Added_Handler，先执行【PRF_BASS】(原因看上面函数名dev_manager_prf_bass...，这里是bass)，【1】调用prf_bass_server_callback_init 【2】调用dev_manager_prf_hid_server_add添加一个HID的服务配置文件
    
6. PROFILE_ADDED： 执行用户函数Bsp_BlueTooth_prf_Added_Handler，执行【PRF_HID】，【1】hid服务回调初始化 【2】创建一个新的目录，并将其添加到嵌入式文件系统中【3】创建广播对象执行Bsp_BlueTooth_Create_adv_Obj
    
7. ADV_OBJ_CREATED：【1】断言看看创建广播对象是否成功【2】存储广播句柄【3】如已开机则进行开始广播
```

2. 有电->开机(需要在初始化那重新广播！！！否则连接不上)(+测试正常)

```cpp
1. 调用广播开始函数
2. ADV_STARTED   
```

3. 关机(测试+正常)

```cpp
1. ADV_STOPPED
```

4. 开机后->匹配+连接(+测试正常)

```cpp
1. STACK_READY：打印信号强度，MAC地址
2. ADV_STOPPED：无操作
/************以下跳到GAP操作***************/
3. CONNECTED：【1】LED4亮 【2】连接标志位置1 【3】存储连接ID 【4】读取文件tinyfs 【5】调用hid_ntf_cfg_init函数报告通知配置
4. MASTER_PAIR_REQ：【1】调用gap_manager_slave_pair_response_send函数 从机交换配对信息(进行一系列配对操作后..)
5. PAIR_DONE：【1】配对完成，无操作
6. GET_DEV_INFO_DEV_NAME：把蓝牙名称存储到结构体 
7. CONN_PARAM_UPDATED：连接参数更新事件 无操作
/************以下跳到GATT操作***************/   
8. SERVER_READ_REQ：服务器读请求 触发DIS_SVC_IDX_PNP_ID_VAL  
/************以下跳到GAP操作***************/    
9. CONN_PARAM_UPDATED：连接参数更新事件 无操作
```

5. 匹配+连接后->发送HID描述符给手机(因为发了两次不同的所以回复也是回复两次，正常是一发一回)

```cpp
/**********触发prf_hid_server_callback(HID 服务器的回调函数)**************/
1. HID_NTF_DONE：打印
2. HID_NTF_DONE：打印   
/************以下跳到GATT操作***************/   
3. SERVER_NOTIFICATION_DONE：服务器发送通知完成，ble_server_tx_busy忙信号置1(表示不忙)   
4. SERVER_NOTIFICATION_DONE：服务器发送通知完成，ble_server_tx_busy忙信号置1(表示不忙)     
```

6. 连接状态下->关机(测试+正常)

```cpp
/************以下跳到GAP操作***************/  
1. DISCONNECTED：断开连接后需要操作的功能(LED灭等，打开广播启动)
```

7. APP(主机)发送数据到按键板(从机)

```cpp
/************以下跳到GATT操作***************/
1. SERVER_WRITE_REQ: 触发接收
```

8. 按键板(从机)发送数据到APP(主机)

```cpp
1. SERVER_NOTIFICATION_DONE：通知从机数据已经发完
```



### 问题/注意

> 用到的定时器是向协议栈注册的，所以需要初始化协议栈，这个函数是处理所有回调函数的：
>
> ```cpp
> void dev_manager_init(void (*cb)(enum dev_evt_type,union dev_evt_u *));
> ```

> 需要失能低功耗模式，否则可能按键等都没效果，然后单独放一个头文件，把这个头文件加到 `sdk_config.h`
>
> ```cpp
> #define SDK_DEEP_SLEEP_ENABLE 0 // 失能低功耗模式
> ```

> 蓝牙与外设中断存在竞争关系，考虑到中断上下文切换，**不可在外设中断中调用BLE相关API**



## S9旧协议最新(两主一从)

> 两主一从图：
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-27_18-40-24.webp)









## 矩阵遥控器(蓝牙)

> 配套 矩阵按键工程和原理图
>
> 下载使用探针
>
> 配套【S9_V2】两主一从

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-20_09-32-28.webp)

### 矩阵按键

> 硬件

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-25_15-23-27.webp" style="zoom:80%;" />



> 检测过程：
>
> 1. 初始化PA07,PA00,PB15为输入模式，PA08,PA09为输出模式，输入设置内部上拉，即高电平，输出设置输出高电平
> 2. 设置1ms定时器，在定时器里面进行下面操作：
>
> 【1】输出检测
>
> 通过一个变量来循环切换每一列，输出低电平，然后期间其他列输出高电平
>
> 【2】输入检测
>
> 通过不同变量存储所有输入的电平状态然后进行分开处理，第0列对应检测的行是 `上 中 下`，第1列对应检测的行是 `左 右 拍照`，然后传入对应的按键指针和按键电平状态到 `事件检测` 函数

> `事件检测` 具体步骤(以UP键举例)：
>
> - 短按单击
>
> 1. 一直没有按键按下，函数返回【10】,当按键按下瞬间，进行 按下消抖事件置位，函数返回【6】,如果进入 按下消抖事件，消抖时间是20ms，所以期间会一直返回【1】，返回10次(10x2=20ms)，完成消抖会进行按下次数++，把消抖时间也加到长按时间里，保存此时的电平，如果是第一次按下则按键检查开始事件置1，然后按键处于按下状态，然后进行判断是否为长按(通过按下持续时间进行判断)，期间会一直返回【5】,通过调试发现单击一次持续时间大概在100ms以内，所以单击的话接下来松开把 松开消抖事件置1，返回【9】，然后进入 松开消抖事件，进行检测时间递增，期间会一直返回【2】，返回10次(10x2=20ms)，直到到达设置的消抖时间，然后把当前值保存起来，如果松开前是长按事件则进行长按恢复，最后清除长按事件标志位，再清除松开消抖事件标志位，然后进入电平松开判断，在那等待检测时间到，期间一直输入【7】，只要检测时间没到还是可以进行单击的，那只要在检测时间内按下一次就算双击，按下多一次就三击以此类推，检测时间到就进入进行判断几个按下，进入对应的操作函数，完成后进行参数清除，最后清除 按键检查开始事件
>
> ```cpp
> 调试打印是：
> 6
> 1 1 1 1 1 1 1 1 1 1
> 5 5 5 5 5 5 5 5 5 5    
> 5 5 5 5 5 5 5 5 5 5
> 5 5 5 5 5 5 5 5 5 5
> 5 5 5 5 5 5 5 5 5 5
> 5 5 5 5 5 5 5 5  
> 9    
> 2 2 2 2 2 2 2 2 2 2   
> 7 7 ...    
> ```
>
> 

短按 6 1 5 9 2 7 双击则是两个短按

长按 4 9 2 7  长按期间一直是4

## 普通遥控器(2.4G)

> 此遥控器代码无需写属于外包

> 用在系列：【S9旧协议最新】





## 常用函数



- 设置上下拉模式


```cpp
// 参数1：引脚
// 参数2：模式(无，上拉，下拉，上下拉)
void io_pull_write(uint8_t pin,io_pull_type_t pull)
```

- 设置中断


```cpp
// 参数1：引脚
// 参数2：中断沿(上升沿，下降沿，上下沿都触发)
void io_exti_config(uint8_t pin,exti_edge_t edge)
```

- 设置引脚低电平

```cpp
void io_clr_pin(uint8_t pin)
```

- 设置引脚高电平

```cpp
void io_set_pin(uint8_t pin)
```

- 设置IO为输出模式

```cpp
void io_cfg_output(uint8_t pin)
```

- 初始化ADC(模数转换器)输入通道5的引脚多路复用

```cpp
void pinmux_adc12b_in5_init(void)
```

- 初始化ADC(模数转换器)输入通道4的引脚多路复用

```cpp
void pinmux_adc12b_in4_init(void)
```

- 获取ADC注入组转换结果

```cpp
uint32_t HAL_ADCEx_InjectedGetValue(ADC_HandleTypeDef* hadc, uint32_t InjectedRank)
```

- 启用ADC，中断注入组的转换

```cpp
HAL_StatusTypeDef HAL_ADCEx_InjectedStart_IT(ADC_HandleTypeDef* hadc)
```

- 初始化 GPTIMA1_CH1 的引脚复用功能以及配置定时器通道的输入/输出属性和默认值

```cpp
void pinmux_gptima1_ch1_init(uint8_t pin, bool output, uint8_t default_val)
```

- 初始化TIM编码器接口并初始化关联句柄

```cpp
HAL_StatusTypeDef HAL_TIM_Encoder_Init(TIM_HandleTypeDef *htim, TIM_Encoder_InitTypeDef *sConfig)
```

- 启动TIM编码器接口

```cpp
HAL_StatusTypeDef HAL_TIM_Encoder_Start(TIM_HandleTypeDef *htim, uint32_t Channel)
```

- 设置引脚mux功能为uart1(配置gpio)

```cpp
void pinmux_uart1_init(uint8_t txd, uint8_t rxd)
```

- 初始化UART

```cpp
HAL_StatusTypeDef HAL_UART_Init(UART_HandleTypeDef *huart)
```

- 以非阻塞模式接收一定数量的数据

```cpp
HAL_StatusTypeDef HAL_UART_Receive_IT(UART_HandleTypeDef *huart, uint8_t *pData, uint16_t Size)
```

- Flash页擦除

```cpp
void hal_flash_page_erase(uint32_t offset);
```

- Quad-SPI方式页写入

```cpp
void hal_flash_quad_page_program(uint32_t offset,uint8_t *data,uint16_t length);
```

- 广播数据打包的宏(宏的参数必须按照 adv_type/data_buf/length 的顺序传递)

```cpp
#define ADV_DATA_PACK(buf,field_nums,...) (adv_data_pack((buf),(field_nums),__VA_ARGS__) - (buf))
```

- 临界区操作

```cpp
// 进入临界区，防止中断打断操作
uint32_t cpu_stat = enter_critical();

// 用户代码部分.....

// 退出临界区
exit_critical(cpu_stat);
```



## 按键板协议调试

> 注意

- 数据长度为0的话，数据内容那直接为空即可
- 数据校验目前暂时是校验数据内容部分



## 总结

1. 裸机代码开发不能用while(1)，功能模块添加到定时器回调函数中，函数中仅调用API和计时，其他的封装到外部，这样代码逻辑看起来更加整洁
2. 定时器、ADC、串口等外设，基本都是调用回调函数进行操作
3. 采样电路设计为2/3分压(因为电池电压4.2V，ADC仅采集到3.3V)，采样电阻可以用200K（ADC采集更稳定，因为阻抗越大，变化越不敏感，更适用于采集电池电压计算电量值），在电路2/3分压处，一端接入ADC输入端，一端接I/O口，采集时拉低电平，不采集时拉高以降低功耗，另一端接的是Vbat
4. 蓝牙协议格式： `len+type+data(len=type+data)`