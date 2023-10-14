---
title: STC15学习笔记
cover: /img/num154.webp
categories:
  - 51系列
comments: false
abbrlink: 4cf28320
date: 2023-10-08 14:22:14
---



## 前言

> 使用 `STC15W408AS-35I-SOP20` 单片机
>
> 在Keil C开发环境中，可以选择 Intel 8052 编译即可
>
> ISP下载hex文件到单片机即可，设置波特率，尽量设置低一些，一般9600及以下，点击**下载/编程**后，再给目标上电



## 单片机介绍

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231002095455.webp" style="zoom:67%;" />

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231002100211.webp)

头文件的话可以在STC-ISP软件里面找到头文件那，选择对应单片机系列即可有对应头文件，可直接保存文件或者复制代码，此款单片机一般使用 `STC15.h` 或者 `STC15F2K60S2.h` 均可

STC15也有库函数，可在官网直接搜索库函数即可

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231002103130.webp)

## 时钟

STC15W401AS系列单片机也是将系统时钟在管脚 `SysClkO/P5.4` 或 `SysCLKO_2/XTAL2/P1.6` 对外分频输出，但只能进行如下分频： `SysClk/1`,  `SysClk/2`,  `SysClk/4`

系统时钟是指对主时钟进行分频后供给 `CPU、定时器、串行口、SPI、CCP/PWM/PCA、A/D转换` 的实际工作时钟。STC15W4K32S4系列、STC15W401AS系列、STC15W1K08PWM系列及STC15W1K20SLQFP64单片机的主时钟既可以是内部R/C时钟，也可以是外部输入的时钟或外部晶体振荡产生的时钟。

> MCLK是指主时钟频率，MCLKO是主时钟输出。SysClk是指系统时钟频率，SysClkO是指系统时钟输出



## STC15单片机I/O口的四种模式以及配置

> 【STC15数据手册400页】

所有I/O口都可以由软件设置成4种工作模式中的一种，配置时 `配置具体到每一个IO口引脚上的话，需要分别配置 PxM0 和 PxM1 参数(x表示端口组)`，用的是 `|=` 运算，为的是不影响别的位的值，防止和别的IO口配置冲突

> 虽然每个I/0口在弱上拉(准双向口)/强推挽输出/开漏模式时都能承受20mA的灌电流(还是要加限流电阻,如1K，5602，472Q等),在强推挽输出时能输出20mA的拉电流（也要加限流电阻）,但整个芯片的工作电流推荐不要超过90mA， `即从MCU-VCC流入的电流建议不要超过9OmA,从MCU-Gnd流出电流建议不要超过9OmA,整体流入/流出电流建议都不要超过90mA`

> 由于P1.7和P1.6口还可以分别作外部晶体或时钟电路的引脚XTAL1和XTAL2 ，所以P1.7/XTAL1和P1.6/XTAL2上电复位后的模式不一定就是准双向口/弱上拉模式。当P1.7和P1.6口作为 外部晶体或时钟电路的引脚XTAL1和XTAL2使用时，P1.7/XTAL1和P1.6/XTAL2上电复位后的模式是高阻输入

```cpp
比如P0，对应寄存器是P0M0和P0M1，对应寄存器地址是0x94和0x95
----------------------------------------------------------------
|      | Px^7 | Px^6 | Px^5 | Px^4 | Px^3 | Px^2 | Px^1 | Px^0 |
----------------------------------------------------------------
| PxM0 |  0   |   0  |  0   |  0   |  0   |   0  |   0  |  0   |
----------------------------------------------------------------
| PxM1 |  0   |   0  |  0   |  0   |  0   |   0  |   0  |  0   |
----------------------------------------------------------------
具体配置信息如下：
------------------------------------------
| PxM0 | PxM1 |         IO模式           |
------------------------------------------
|0     |0     | 准双向IO(传统8051 IO模式)  |
------------------------------------------
|1     |0     |         推挽输出          |
------------------------------------------
|0     |1     |        高阻态输入         |
------------------------------------------
|1     |1     |       开漏(不常用)        |
------------------------------------------
```

> ```cpp
> Px   -> 表示端口组置低电平或者高电平(0/1)
> Pxx  -> 表示端口组某个引脚置低电平或者高电平(0/1)    
> ```



## 定时器/计数器

> 寄存器

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231009095212.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231009092217.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231009092619.webp)



> 定时器初始化一般步骤

```cpp
1. 首先配置AUXR寄存器
2. 再配置TMOD寄存器
3. 设置低8位和高8位初始值
4. 清除标志位(TCON寄存器里的)
5. 启动定时器(TCON寄存器里的)    
```

也可以在ISP里面直接生成：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231009094841.webp)

## 串口

> 对于STC15系列单片机， `串口2只能使用定时器2作为波特率发生器`，不能够选择其他定时器作为其波特率发生器; `而串口1默认选择定时器2作为其波特率发生器，也可以选择定时器1作为其波特率发生器`; `串口3默认选择定时器2作为其波特率发生器，也可以选择定时器3作为其波特率发生器`; `串口4默认选择定时器2作为其波特率发生器，也可以选择定时器4作为其波特率发生器`
>
> 两个中断请求标志位必须软件清0不能硬件清0

> 寄存器

这个寄存器可以把串口1的引脚进行复用

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231009152642.webp)



{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231009111829.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231009111842.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231009111857.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231009111908.webp)

{% endgallery %}



> 串口初始化一般步骤

```cpp
1. 看需不需要复用(AUXR1寄存器)
2. 工作模式(SCON寄存器)
3. 选择定时器作为波特率发生器
4. 定时器的基本配置(分频，定时器初值)
5. 定时器中断是否启动(IE2寄存器)
6. 启动定时器(AUXR)    
5. 启动串口1中断(IE寄存器里的ES位)    
```

也可以使用ISP进行配置

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231009113659.webp)



## 中断

> 寄存器

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231009150718.webp" style="zoom:50%;" />

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231009150902.webp" style="zoom:80%;" />



## PWM

> 介绍

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231009231501 (1).webp)

PCA定时器简介:

PCA模块是程序可编程计数器/定时器模块，用于在单片机中生成定时器/计数器信号。

PCA模块可以帮助用户通过适当的程序设置生成准确的计时器/计数器信号，并在开发各种应用时提供了很大的灵活性。

PCA模块包括三个独立的定时器/计数器，分别是PCA0，PCA1和PCA2。它们的主要区别在于它们的工作模式和功能不同。以下是三个模块的简要说明：

1. PCA0：

该模块是一个多功能模块，可以作为定时器或计数器来使用。它具有多种计时和模式选择功能，并且可以将其输出信号引导到可编程I/O管脚 上。

2. PCA1：

该模块仅可用作定时器，具有比PCA0更精确的计时器基准，并可输出具有可定制占空比的PWM信号。

3. PCA2：

该模块仅可用作计数器，具有与PCA0类似的计数器功能，可以出发中断。它还可以输出方波信号、比较器输出和计数器输入捕获信号。

`由于所有模块共用仅有的PCA定时器，所有它们的输出频率相同，各个模块的输出占空比是独立变化的，与使用的捕获寄存器{EPCnL,CCAPnL[7:0]}有关`

`三个PCA模块共用一个计数器`

-  PCA的三个引脚

`ECI` 是Capture Input引脚，用于捕获外部引脚的信号。

`CCP0` 和 `CCP1` 是Capture/Compare/PWM功能的引脚之一，它们可以用于PWM输出或者捕获外部引脚的信号。

`CCP2`  是另一个比较模块的引脚，可以被用于PWM输出或者比较外部引脚的信号。



> 寄存器

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231009155109.webp" style="zoom:67%;" />

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231009155950.webp" style="zoom:67%;" />

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231009160329.webp)

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231009185531.webp" style="zoom:67%;" />

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231009190029.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231010162913.webp)





> 8位PWM模式

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231009192953.webp" style="zoom: 80%;" />

首先通过CCAPWM使能比较器和PWM输出，利用CMOD设置时钟源，再将CL中的数值与CCAPnL中的比较，大于等于输出高电平，小于输出低电平，当CL溢出后(0xFF->0x00)，CCAPnH中的数据会载入CCAPnL中

当PWM为8位时：

$\text{PWM的频率=}\frac{\text{PCA时钟输入源频率}}{256}$

 `PCA时钟输入源可以从以下8种中选择一种：SYSclk， SYSclk/2， SYSclk/4，SYSclk/6，SYSclk/8，SYSclk/12,定时器0的溢出，ECI/P1.2输入`

> 例如我的外部时钟是11.0592MHz，程序里进行12分频，然后再除以256，即：
>
> $\text{PWM频率}=\frac{11.0592MHz}{12}\div256=3.6KHz$

> $\text{n位PWM占空比} = (2^n - [CCAPxH=CCAPxL]) \div 2^n$
>
> x表示第几路PCA模块
>
> 在写程序时，$2^n$ 和 $CCAPxH$ 的值需要转化为16进制：
>
> 如8位PWM：
>
> $(100H - [CCAP0H=CCAP0L])\div100H$



## IAP

STC15系列单片机内部集成了大容量的EEPROM，其与程序空间是分开的。利用 `ISP/IAP` 技术可将内部Data Flash当EEPROM，擦写次数在10万次以上。EEPROM可分为若干个扇区，每个扇区包含512字节。使用时，建议同一次修改的数据放在同一个扇区，不是同一次修改的数据放在不同的扇区，不一定要用满。数据存储器的擦除操作是按扇区进行的。

EEPROM可用于保存一些需要在应用过程中修改并且掉电不丢失的参数数据。在用户程序中，可以对EEPROM进行字节读/字节编程/扇区擦除操作。 `在工作电压Vcc偏低时，建议不要进行EEPROM/IAP操作`

`它只能把字节中的1写为0，不能在把0写位1，要写1的话，只能擦除数据，擦除后存储器字节上的数据就会变成0xFF，全部变为1`

> 寄存器

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231012110500.webp)

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231012094920.webp" style="zoom:67%;" />

> `0`：空闲；`1`：读；`2`：字节编程； `3`：扇区擦除

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231012100940.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231012101152.webp)

手册有例程参考



## 看门狗

> 寄存器

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231012120222.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231012120312.webp)







## 注意

> 下载程序时这里不要勾
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231002103419.webp)
>
> 勾了也不怕，下载程序时把这两个引脚短接到GND即可

> vscode里打开51项目需要配置系统头文件路径：
>
> ```json
> {
>     "configurations": [
>         {
>             "name": "Target 1",
>             "includePath": [
>                 "g:\\my_code\\STC15\\Control485Out\\USER",
>                 "g:\\my_code\\STC15\\Control485Out\\APP",
>                 "C:\\Keil_v5\\UV4\\INC\\STC",
>                 "C:\\Keil_v5\\UV4\\INC"
>             ],
>             "defines": [
>                 "__C51__",
>                 "__VSCODE_C51__",
>                 "reentrant=",
>                 "compact=",
>                 "small=",
>                 "large=",
>                 "data=",
>                 "idata=",
>                 "pdata=",
>                 "bdata=",
>                 "xdata=",
>                 "code=",
>                 "bit=char",
>                 "sbit=char",
>                 "sfr=char",
>                 "sfr16=int",
>                 "sfr32=int",
>                 "interrupt=",
>                 "using=",
>                 "_at_=",
>                 "_priority_=",
>                 "_task_="
>             ],
>             "intelliSenseMode": "${default}"
>         }
>     ],
>     "version": 4
> }
> ```

> 单片机的寄存器上电默认的状态是未确定的，需要用户在程序里进行配置

