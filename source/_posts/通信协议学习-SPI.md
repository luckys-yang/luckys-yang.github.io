---
title: 通信协议学习-SPI
cover: /img/num173.webp
comments: false
katex: true
categories:
  - 细化学习
abbrlink: e0a9e10b
date: 2024-02-20 14:05:14
---



## 前言

{% note blue 'fas fa-fan' flat %}参考文章/博主{% endnote %}

## SPI

参考：

[SPI协议介绍](https://www.cnblogs.com/amxiang/p/15529412.html)

[理解SPI/Dual SPI/Quad SPI/QPI之间的区别](https://blog.csdn.net/tianizimark/article/details/124608851?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522170840790516800192294280%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=170840790516800192294280&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~baidu_landing_v2~default-1-124608851-null-null.142^v99^control&utm_term=quad%20spi%E5%92%8Cspi%E5%8C%BA%E5%88%AB&spm=1018.2226.3001.4187)

### SPI详解

> `SPI`是一个同步，全双工，高速的通信总线，SPI接口主要应用在 `EEPROM`， `FLASH`， `实时时钟`， `AD转换器` ， 还有 `数字信号处理器和数字信号解码器`之间



{% tip bolt %}SPI分类{% endtip %}

1. 标准SPI
2. Dual SPI(双线串行外设接口)

单向数据传输速度上是标准SPI的双倍，一般情况下用于半双工通信

3. Quad SPI(四线SPI,即数据线最多可以使用4根)

一般情况下用于半双工通信



{% tip bolt %}SPI特点{% endtip %}

- **采用主-从(Master-Slave)的控制方式**

> 规定了在SPI通信中，有一个 `主设备`（通常是微控制器或主板）来控制一个或多个 `从设备`（通常是外围设备，如传感器或存储器）， `主设备` 负责发送和接收数据，而 `从设备` 只是响应 `主设备` 的命令，如果没有时钟则 `从设备` 则不会工作
>
> SPI的通信是同步的，这意味着 `主设备` 生成时钟信号（称为SCK），并且 `从设备` 必须根据这个时钟来传输数据。 `从设备` 不能自己控制或者产生时钟，它们只能响应 `主设备` 提供的时钟信号
>
> `主设备` 还使用一个片选信号（通常称为SS或CS）来选择要与之通信的特定 `从设备`。当 `主设备`要与某个 `从设备` 通信时，它将该 `从设备` 的片选信号置为有效状态，以表明正在与该 `从设备` 进行通信，而其他 `从设备` 将处于非活动状态

- **采用同步方式(Synchronous)传输数据**

> `主设备` 会根据将要交换的数据来产生相应的时钟脉冲(Clock Pulse)， 时钟脉冲组成了时钟信号(Clock Signal) , 时钟信号通过 `时钟极性 (CPOL) `和 `时钟相位 (CPHA) `控制着两个 SPI 设备间何时数据交换以及何时对接收到的数据进行采样, 来保证数据在两个设备之间是同步传输的

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231030152313.webp)

- **数据交换(Data Exchanges)**

SPI 设备间的数据传输之所以又被称为数据交换, 是因为 SPI 协议规定一个 SPI 设备不能在数据通信过程中仅仅只充当一个  `"发送者(Transmitter)"` 或者  `"接收者(Receiver)"`。 在每个 Clock 周期内, SPI 设备都会 `发送并接收` 一个 bit 大小的数据(不管主设备好还是从设备), 相当于该设备有一个 bit 大小的数据被交换了。一个 `从设备` 要想能够接收到 `主设备` 发过来的控制信号, 必须在此之前能够被 `主设备` 进行访问。所以, `主设备` 必须首先通过 `SS/CS` pin 对 `从设备` 进行片选, 把想要访问的 `从设备` 选上. 在数据传输的过程中, 每次接收到的数据必须在下一次数据传输之前被采样. 如果之前接收到的数据没有被读取, 那么这些已经接收完成的数据将有可能会被丢弃, 导致 SPI 物理模块最终失效。 `因此, 在程序中一般都会在 SPI 传输完数据后, 去读取 SPI 设备里的数据, 即使这些数据在我们的程序里是无用的(虽然发送后紧接着的读取是无意义的，但仍然需要从寄存器中读出来)`

- **SPI有四种传输模式**



- **SPI只有主模式和从模式之分**

没有读和写的说法，因为实质上每次SPI是主从设备在交换数据。 `也就是说，你发一个数据必然会收到一个数据；你要收一个数据必须也要先发一个数据`



{% tip bolt %}工作机制{% endtip %}

SPI 设备间通信的一个简单的描述：

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231030163309.webp" style="zoom:67%;" />

SPI 设备在进行通信的过程中,  `Master` 设备和  `Slave` 设备之间会产生一个数据链路回环(Data Loop), 就像上图所画的那样, 通过 `SDO` 和 `SDI` 管脚,  `SSPSR` 控制数据移入移出 `SSPBUF`, `Controller` 确定 SPI 总线的通信模式, `SCK` 传输时钟信号

|     组件     |                             描述                             |
| :----------: | :----------------------------------------------------------: |
|   `SSPBUF`   | 泛指 SPI 设备里面的内部缓冲区, 一般在物理上是以 FIFO(先进先出) 的形式, 保存传输过程中的临时数据 |
|   `SSPSR`    | 泛指 SPI 设备里面的移位寄存器, 它的作用是根据设置好的数据位宽把数据移入或者移出 SSPBUF |
| `Controller` | 泛指 SPI 设备里面的控制寄存器, 可以通过配置它们来设置 SPI 总线的传输模式 |

通常情况下, 我们只需要对上图所描述的四个管脚(pin) 进行编程即可控制整个 SPI 设备之间的数据通信:

`SDI/MISO`：Master input slave output --- 从->主，在 Master 上面也被称为 Rx-Channel，作为数据的入口, 主要用于SPI 设备接收数据

`SDO/MOSI`：Master output slave input--- 主->从， 在 Master 上面也被称为 Tx-Channel，作为数据的出口, 主要用于 SPI 设备发送数据

`SCK/SCLK` ： 串行时钟信号，由主机产生发送给从机， 控制数据交换的时机以及速率

`SS/CS`：片选信号，由主机发送，以控制与哪个从机通信(一般是低电平有效，具体看手册)



> SSPSR

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231031094314.webp)

`SSPSR` 是 SPI 设备内部的移位寄存器(Shift Register). 它的主要作用是根据 SPI 时钟信号状态, 往 `SSPBUF` 里移入或者移出数据, 每次移动的数据大小由 `Bus-Width` 以及 `Channel-Width` 所决定

`Bus-Width` 的作用是指定地址总线到 `Master` 设备之间数据传输的单位

例如, 我们想要往 `Master` 设备里面的 `SSPBUF` 写入 `16 Byte` 大小的数据: 首先, 给 `Master` 设备的配置寄存器设置 `Bus-Width` 为 `Byte`; 然后往 `Master` 设备的 `Tx-Data` 移位寄存器在地址总线的入口写入数据, 每次写入 `1 Byte` 大小的数据(使用 writeb 函数); 写完 `1 Byte` 数据之后, `Master` 设备里面的 `Tx-Data` 移位寄存器会自动把从地址总线传来的 `1 Byte` 数据移入  `SSPBUF` 里; 上述动作一共需要重复执行 `16` 次

`Channel-Width` 的作用是指定 `Master` 设备与 `Slave` 设备之间数据传输的单位。与 `Bus-Width` 相似,  `Master` 设备内部的移位寄存器会依据 `Channel-Width` 自动地把数据从 `Master-SSPBUF` 里通过 `Master-SDO` 管脚搬运到 `Slave` 设备里的 `Slave-SDI` 引脚, `Slave－SSPSR` 再把每次接收的数据移入 `Slave-SSPBUF`里。通常情况下,  `Bus-Width` 总是会大于或等于 `Channel-Width`, 这样能保证不会出现因 `Master` 与 `Slave` 之间数据交换的频率比地址总线与 `Master` 之间的数据交换频率要快, 导致 `SSPBUF` 里面存放的数据为无效数据这样的情况

> SSPBUF

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231031094330.webp)

在每个时钟周期内, `Master` 与 `Slave` 之间交换的数据其实都是 SPI 内部移位寄存器从 `SSPBUF ` 里面拷贝的. 我们可以通过往 `SSPBUF` 对应的寄存器 (Tx-Data / Rx-Data register) 里读写数据, 间接地操控 SPI 设备内部的 `SSPBUF`

例如, 在发送数据之前, 我们应该先往 `Master` 的 `Tx-Data` 寄存器写入将要发送出去的数据, 这些数据会被 `Master-SSPSR` 移位寄存器根据 `Bus-Width` 自动移入 `Master-SSPBUF` 里, 然后这些数据又会被 `Master-SSPSR` 根据 `Channel-Width` 从 `Master-SSPBUF` 中移出, 通过 `Master-SDO` 管脚传给 `Slave-SDI` 管脚, `Slave-SSPSR` 则把从 `Slave-SDI` 接收到的数据移入 `Slave-SSPBUF` 里.。与此同时, `Slave-SSPBUF` 里面的数据根据每次接收数据的大小(Channel-Width), 通过 `Slave-SDO` 发往 `Master-SDI`, `Master-SSPSR` 再把从 `Master-SDI` 接收的数据移入 `Master-SSPBUF`。在单次数据传输完成之后, 用户程序可以通过从 `Master` 设备的 `Rx-Data` 寄存器读取 `Master` 设备数据交换得到的数据



> Controller

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231031101049.webp)

`Master` 设备里面的 `Controller` 主要通过时钟信号(Clock Signal)以及片选信号(Slave Select Signal)来控制 `Slave` 设备。 `Slave` 设备会一直等待, 直到接收到 `Master` 设备发过来的片选信号, 然后根据时钟信号来工作

`Master` 设备的片选操作必须由程序所实现。例如: 由程序把 `SS/CS` 管脚的时钟信号拉低电平, 完成 SPI 设备数据通信的前期工作; 当程序想让 SPI 设备结束数据通信时, 再把 `SS/CS` 管脚上的时钟信号拉高电平



{% tip bolt %}Timing{% endtip %}

下图通过 `Master` 设备与 `Slave` 设备之间交换 `1 Byte` 数据来说明 SPI 协议的工作机制：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231030173543.webp)

> SPI相关的缩写或说法

`CKPOL/CPOL/POL/Polariity`：(时钟)极性

`CKPHA/CPHA/PHA/Phase`：(时钟)相位

`Edge`：边沿，即时钟电平变化的时刻，即上升沿(rising edge) 或 下降沿(falling edge)

对于一个时钟周期内，有两个edge，分别称为：

1. `Leading edge = 前一个边沿 = 第一个边沿`，对于开始电压是1，那么就是1变成0的时候，对于开始电压是0，那么就是0变成1的时候
2. `Trailing edge = 后一个边沿 = 第二个边沿`，对于开始电压是1，那么就是0变成1的时候（即在第一次1变成0之后，才可能有后面的0变成1），对于开始电压是0，那么就是1变成0的时候

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231031082651.webp)

> SPI的相位和极性

CPOL和CPHA，分别都可以是0或时1，对应的四种组合就是：

- `Mode 0` CPOL=0, CPHA=0
- `Mode 1` CPOL=0, CPHA=1
- `Mode 2` CPOL=1, CPHA=0
- `Mode 3` CPOL=1, CPHA=1

> CPOL极性

先说什么是SCLK时钟的空闲时刻，其就是当SCLK在发送8个bit比特数据之前和之后的状态，于此对应的，SCLK在发送数据的时候，就是正常的工作的时候，有效active的时刻了

SPI的CPOL，表示当SCLK空闲的时候，其电平的值是低电平0还是高电平1：

- `CPOL=0`，时钟空闲时候的电平是低电平，所以当SCLK有效的时候，就是高电平，就是所谓的 `active-high`
- `CPOL=1`，时钟空闲时候的电平是高电平，所以当SCLK有效的时候，就是低电平，就是所谓的 `active-low`

> CPHA 相位

相位，对应着数据采样是在第几个边沿（edge），是第一个边沿还是第二个边沿， `0` 对应着第一个边沿， `1` 对应着第二个边沿

`CPHA=0`，表示第一个边沿：

- 对于 `CPOL=0`，idle时候的是低电平，第一个边沿就是从低变到高，所以是上升沿
- 对于 `CPOL=1`，idle时候的是高电平，第一个边沿就是从高变到低，所以是下降沿

`CPHA=1`，表示第二个边沿：

- 对于 `CPOL=0`，idle时候的是低电平，第二个边沿就是从高变到低，所以是下降沿
- 对于 `CPOL=1`，idle时候的是高电平，第一个边沿就是从低变到高，所以是上升沿

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231031085730.webp)

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230518195013.webp" style="zoom:67%;" />



> 软件中如何设置SPI的极性和相位

SPI分 `主设备` 和 `从设备`，两者通过SPI协议通讯

而设置SPI的模式，是 `从设备` 的模式，决定了 `主设备` 的模式

所以要先去搞懂 `从设备` 的SPI是何种模式，然后再将 `主设备` 的SPI的模式，设置和 `从设备` 相同的模式，即可正常通讯

对于 `从设备` 的SPI是什么模式，有两种：

- 固定的，由SPI从设备硬件决定的

SPI从设备，具体是什么模式，相关的datasheet中会有描述，需要自己去datasheet中找到相关的描述，即：

关于SPI从设备，在空闲的时候，是高电平还是低电平，即决定了 `CPOL是0还是1`

然后再找到关于设备是在上升沿还是下降沿去采样数据，这样就是， `在定了CPOL的值的前提下，对应着可以推算出CPHA是0还是1了`

- 可配置的，由软件自己设定

从设备也是一个SPI控制器，4种模式都支持，此时只要自己设置为某种模式即可

然后知道了从设备的模式后，再去将SPI主设备的模式，设置为和从设备模式一样即可

对于如何配置SPI的CPOL和CPHA的话，不多细说，多数都是直接去写对应的SPI控制器中对应寄存器中的CPOL和CPHA那两位，写0或写1即可



{% tip bolt %}注意{% endtip %}

>  数据发送是先发高再发低 

> `注意`：一般来说模式0和模式3是匹配(都是上升沿采集下降沿数据变化)，模式1和模式2是匹配的(都是下降沿采集上升沿数据变化)，如果不匹配的话通讯就会出问题
>
> `注意`：MOSI和MISO不能交叉连接





### 编程示例1

`介绍`：基于STM32F103ZET6，采用SPI，Flash型号采用 `W25Q64JV`

- 硬件连接

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230522084355.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230522090219.webp)



- 芯片手册阅读

> 基本信息：芯片的工作电压在2.7V到3.6V的电源上，电流消耗地至断电1uA，每个页面256字节，一次最多可编程256字节

> 只能1变0，不能0变1，所以需要擦除才能0变1

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230522083108.webp)

> 常用指令集：
>
> | 指令 |                      作用                       |
> | :--: | :---------------------------------------------: |
> | 0x06 |                     写使能                      |
> | 0x04 |                     写禁止                      |
> | 0x05 | 读状态寄存器1，可判断芯片是否准备接收下一条指令 |
> | 0x03 |                     读数据                      |
> | 0x02 |                     页编程                      |
> | 0x20 |                    扇区擦除                     |
> | 0xC7 |                    芯片擦除                     |
> | 0x9F |                  读设备ID信息                   |

> `这里需要注意`，STM32自带有硬件SPI接口，但硬件的SPI接口CS引脚在传输完数据之后并不会自动拉高，一直是低电平，这不符合W25Q64JV芯片的时序要求，所以在初始化时，不使用硬件SPI的CS引脚，使用普通的GPIO口功能驱动W25Q64JV的CS引脚，通过编程拉低或者拉高CS引脚，达到芯片的时序要求，W25Q64JV的CS引脚是接到32单片机的SPI3_NSS引脚的，只是不使用这个NSS功能，用普通IO口

> 内部框图：
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/37f50a7e3685418f9fd97a68443e1d18.webp)

> 用到的时序：
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230522092351.webp)
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230522092432.webp)

> 这个可以判断是否写完，执行写操作时是1，写完执行完后变0
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230522093255.webp)



- MX配置

> 1. 需要注意的是这里硬件NSS必须要禁止，因为一旦使能它只输出低电平，但是这个芯片它CS引脚需要有时间高电平，所以我们这里使用软件模拟CS，即PA15，默认是高电平的(总线空闲状态)
> 2. 因为这个芯片支持最大100MHz，这个SPI3是挂载在APB1下是36MHz，所以需要分频，一般选择2分频即可

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230522085613.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230522090634.webp)

- 程序编写

{% folding, Myinit.c %}

```cpp
void vHardware_Init(void)
{
    // 启动定时器6
    Timer6.Timer6_Start_IT();
    // 读取Flash芯片ID
    SPI_Flash.ReadJedecID();
}
```

{% endfolding %}

{% folding, SPI_Flash.h %}

```cpp
#ifndef __SPI_FLASH_H
#define __SPI_FLASH_H
#include "AllHead.h"

//定义CS引脚
#define SET_SPI_Flash_CS    HAL_GPIO_WritePin(GPIOA,GPIO_PIN_15,GPIO_PIN_SET)
#define CLR_SPI_Flash_CS    HAL_GPIO_WritePin(GPIOA,GPIO_PIN_15,GPIO_PIN_RESET)

//指令宏定义
#define     W25X_WriteEnable        0x06        //写使能
#define     W25X_WriteDisable       0x04        //写禁止
#define     W25X_ReadStatusRg1      0x05        //读状态寄存器1
#define     W25X_ReadData           0x03        //读数据
#define     W25X_PageProgram        0x02 	    //页编程
#define  	W25X_SectorErase		0x20 		//扇区擦除
#define  	W25X_ChipErase			0xC7 		//芯片擦除
#define  	W25X_ReadJedecID        0x9F 		 //读设备ID

#define     SPI_FLASH_PageSize      256         //页面最大字节长度
#define     Flash_Status1_BUSY      1        	//忙碌标志位
#define     Dummy_Byte              0xFF        //假数据

typedef struct
{
    uint32_t jedecID;	// 设备标志符->制造商+内存类型+容量
    void (*ReadjedecID)(void);	// 读取设备标志符
    void (*EraseSector)(uint32_t);	// 擦除扇区(4KB)
    void (*EraseTotal)(void);	// 擦除全部
    void (*WritePage)(uint8_t*,uint32_t,uint16_t);	// 写入页(256字节，写入长度不超过256字节)
    void (*WriteUnfixed)(uint8_t*,uint32_t,uint32_t);	// 写入不固定长度数据
    void (*ReadUnfixed)(uint8_t*,uint32_t,uint32_t);	// 读取不固定长度数据
}SPI_Flash_t;


extern SPI_Flash_t SPI_Flash; 

#endif
```

{% endfolding %}

> 读取ID的时序：
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230522102807.webp)

{% folding, SPI_Flash.c %}

```cpp
#include "AllHead.h"

/*====================================静态内部变量/函数声明区 BEGIN====================================*/
static void SPI_Flash_ReadFlashID(void);
static void SPI_Flash_EraseSector(uint32_t);
static void SPI_Flash_EraseTotal(void);
static void SPI_Flash_WritePage(uint8_t*,uint32_t,uint16_t);
static void SPI_Flash_WriteUnfixed(uint8_t*,uint32_t,uint32_t);
static void SPI_Flash_ReadUnfixed(uint8_t*,uint32_t,uint32_t);

static uint8_t SPI_Flash_ReadByte(void);	// 从Flash读一个字节
static void SPI_Flash_WriteByte(uint8_t);	// 给Flash写一个字节
static void SPI_Flash_WriteEnable(void);	// Flash使能
static void SPI_Flash_WaitForWriteEnd(void);	// 等待Flash写入完成
/*====================================静态内部变量/函数声明区    END====================================*/

/*====================================变量区 BEGIN====================================*/
SPI_Flash_t SPI_Flash = 
{
   .0,
   .SPI_Flash_ReadFlashID,
   .SPI_Flash_EraseSector,
   .SPI_Flash_EraseTotal,
   .SPI_Flash_WritePage,
   .SPI_Flash_WriteUnfixed,
   .SPI_Flash_ReadUnfixed
};
/*====================================变量区    END====================================*/

/*
* @name   SPI_Flash_ReadByte
* @brief  从Flash读取一个字节
* @param  None
* @retval 返回读到的字节   
*/
static uint8_t SPI_Flash_ReadByte()
{
    uint8_t ReceiveByte;
    //等待模式读取一个字节，并判断函数执行是否正确，正确则返回读取到的字节，错误则返回错误数据
    if(HAL_SPI_Receive(&hspi3,&ReceiveByte,1,0x0A) != HAL_OK)
    {
        ReceiveByte = Dummy_Byte;       //错误数据 
    }
    return ReceiveByte;
}

/*
* @name   SPI_Flash_WriteByte
* @brief  Flash写入一个字节
* @param  None
* @retval None   
*/
static void SPI_Flash_WriteByte(uint8_t Byte)
{
    uint8_t SendByte = Byte;
    //等待模式写入一个字节
    HAL_SPI_Transmit(&hspi3,&SendByte,1,0x0A);
}

/*
* @name   SPI_Flash_WriteEnable
* @brief  Flash写使能
* @param  None
* @retval None   
*/
static void SPI_Flash_WriteEnable()
{
    //选择Flash芯片：CS引脚输出低电平
    CLR_SPI_Flash_CS;
    //发送命令：写使能0x06
    SPI_Flash_WriteByte(W25X_WriteEnable);
    //禁用Flash芯片：CS引脚输出高电平
    SET_SPI_Flash_CS;
}

/*
* @name   SPI_Flash_WaitForWriteEnd
* @brief  等待SPI写入完成
* @param  None
* @retval None   
*/
static void SPI_Flash_WaitForWriteEnd()
{
    uint8_t Flash_Status = 0;
    //选择Flash芯片：CS引脚输出低电平
    CLR_SPI_Flash_CS;
    //写入命令：读取状态寄存器1
    SPI_Flash_WriteByte(W25X_ReadStatusRg1);
    //等待数据写入完成，不断读取BUSY位状态，如果为1，则继续读，如果为0，则退出
    Timer6.usDelay_Timer = 0;
    do
    {
        Flash_Status = SPI_Flash_ReadByte();
		// 超时机制
        if(Timer6.usDelay_Timer >= TIMER_10s)
        {
            break;
        }
    } while((Flash_Status&Flash_Status1_BUSY) == Flash_Status1_BUSY);
    
    //禁用Flash芯片：CS引脚输出高电平
    SET_SPI_Flash_CS;
}

static void SPI_Flash_ReadFlashID(void)
{
	uint8_t buf[3];

	// 选择Flash芯片：CS输出低电平
	CLR_SPI_Flash_CS;
	// 发送命令
	SPI_Flash_WriteByte(W25X_ReadjedecID);
	buf[0] = SPI_Flash_ReadByte();
	buf[1] = SPI_Flash_ReadByte();
	buf[2] = SPI_Flash_ReadByte();
	// 禁用Flash：CS输出高电平
	SET_SPI_Flash_CS;
	SPI_Flash.JedecID = (buf[0]<< 16) + (buf[1] << 8) + buf[2];
	printf("ID:0x%.6X\r\n",SPI_Flash.JedecID);
}

/*
* @name   SPI_Flash_EraseSector
* @brief  扇区擦除
* @param  SectorAddr：待擦除的地址,要求为4K的倍数
* @retval None   
*/
static void SPI_Flash_EraseSector(uint32_t SectorAddr)
{
    //检测Flash是否处于忙碌状态
    SPI_Flash_WaitForWriteEnd();

    //Flash写使能，允许擦除
    SPI_Flash_WriteEnable();

    //选择Flash芯片：CS引脚输出低电平
    CLR_SPI_Flash_CS;

    //发送扇区擦除指令
    SPI_Flash_WriteByte(W25X_SectorErase);
    //发送擦除扇区地址的高字节
    SPI_Flash_WriteByte((SectorAddr & 0xFF0000) >> 16);
    //发送擦除扇区地址的中字节
    SPI_Flash_WriteByte((SectorAddr & 0x00FF00) >> 8);
    //发送擦除扇区地址的低字节
    SPI_Flash_WriteByte((SectorAddr & 0x0000FF));

    //禁用Flash芯片：CS引脚输出高电平
    SET_SPI_Flash_CS;

    //等待擦除完毕
    SPI_Flash_WaitForWriteEnd();
    printf("扇区擦除成功!\r\n");
}

// 擦除全部
static void SPI_Flash_EraseTotal(void)
{
	// Flash使能
	SPI_Flash_WriteEnable();
	// 擦整片
	CLR_SPI_Flash_CS;
	SPI_Flash_WriteByte(W25X_ChipErase);
	SET_SPI_Flash_CS;
	SPI_Flash_WaitForWriteEnd();
}

/*
* @name   SPI_Flash_ReadUnfixed
* @brief  读取不固定长度数据
* @param  pWriteBuffer：存放读取数据的缓存指针
            WriteAddr：待读取的地址
            WriteLength：读取数据的长度
* @retval None   
*/
static void SPI_Flash_ReadUnfixed(uint8_t* pReadBuffer,uint32_t ReadAddr,uint32_t ReadLength)
{
    //检测Flash是否处于忙碌状态
    SPI_Flash_WaitForWriteEnd();

    //选择Flash芯片：CS引脚输出低电平
    CLR_SPI_Flash_CS;

    //发送命令，读取数据
    SPI_Flash_WriteByte(W25X_ReadData);

    //发送24位地址
    SPI_Flash_WriteByte((ReadAddr & 0xFF0000) >> 16);
    SPI_Flash_WriteByte((ReadAddr & 0x00FF00) >> 8);
    SPI_Flash_WriteByte((ReadAddr & 0x0000FF));

    //开始读取数据
    while(ReadLength--)
    {
        //读取一个字节
        *pReadBuffer = SPI_Flash_ReadByte();
        //指向下一个字节缓冲区
        pReadBuffer++;
    }
    //禁用Flash芯片：CS引脚输出高电平
    SET_SPI_Flash_CS;
}

// 页写入--有风险
static void SPI_Flash_WritePage(uint8_t* pWriteBuffer,uint32_t WriteAddr,uint16_t WriteLength)
{
	SPI_Flash_WriteEnable();
	CLR_SPI_Flash_CS;
	SPI_Flash_WriteByte(W25X_PageProgram);
	// 发送地址高字节
	SPI_Flash_WriteByte((WriteAddr & 0xFF0000) >> 16);
	// 发送地址中字节
	SPI_Flash_WriteByte((WriteAddr & 0x00FF00) >> 8);
	// 发送地址低字节
	SPI_Flash_WriteByte(WriteAddr & 0xFF);

	if(WriteLength > SPI_Flash_PageSize)
	{
		WriteLength = SPI_Flash_PageSize;
		printf("Error\r\n");
	}
	// 开始写入数据
	while(WriteLength--)
	{
		// 读取一个字节
		SPI_Flash_WriteByte(*pWriteBuffer);
		// 指向下一个字节缓冲区
		pWriteBuffer++;
	}
	SET_SPI_Flash_CS;
	SPI_Flash_WaitForWriteEnd();
}

// 写入不固定长度数据
static void SPI_Flash_WriteUnfixed(uint8_t *pWriteBuffer, uint32_t WriteAddr, uint32_t WriteLength)
{
	uint32_t PageNumofWriteLength = WriteLength / SPI_FLASH_PageSize;			 // 待写入页数
	uint8_t NotEnoughNumofPage = WriteLength % SPI_FLASH_PageSize;				 // 不足一页的数量
	uint8_t WriteAddrPageAlignment = WriteAddr % SPI_FLASH_PageSize;			 // 如果取余为0，则地址页对齐，可以写
	uint8_t NotAlignmentNumofPage = SPI_FLASH_PageSize - WriteAddrPageAlignment; // 地址不对齐部分，最多可以写入的字节数量

	// 写入地址页对齐
	if (0 == WriteAddrPageAlignment)
	{
		// 待待写入数据不足一页
		if (0 == PageNumofWriteLength)
		{
			SPI_Flash_WritePage(pWriteBuffer, WriteAddr, WriteLength);
		}
		// 代写入数据超过一页
		else
		{
			// 先写入整页
			while (PageNumofWriteLength--)
			{
				SPI_Flash_WritePage(pWriteBuffer, WriteAddr, SPI_FLASH_PageSize);
				pWriteBuffer += SPI_FLASH_PageSize;
				WriteAddr += SPI_FLASH_PageSize;
			}
			// 再写入不足一页的数据
			if (NotEnoughNumofPage > 0)
			{
				SPI_Flash_WritePage(pWriteBuffer, WriteAddr, NotEnoughNumofPage);
			}
		}
	}
	// 写入地址与页不对齐
	else
	{
		// 待写入数据不足一页
		if (0 == PageNumofWriteLength)
		{
			// 不足一页的数据<=地址不对齐部分
			if (NotEnoughNumofPage <= NotAlignmentNumofPage)
			{
				SPI_Flash_WritePage(pWriteBuffer, WriteAddr, WriteLength);
			}
			// 不足一页的数据 > 地址不对齐部分
			else
			{
				// 先写地址不对齐部分允许写入的最大长度
				SPI_Flash_WritePage(pWriteBuffer, WriteAddr, NotAlignmentNumofPage);
				pWriteBuffer += NotAlignmentNumofPage;
				WriteAddr += NotAlignmentNumofPage;
				// 再写没写完的数据
				SPI_Flash_WritePage(pWriteBuffer, WriteAddr, NotEnoughNumofPage - NotAlignmentNumofPage);
			}
		}
		// 待写数据超过一页
		else
		{
			// 先写地址不对齐部分允许写入的最大长度，此时地址对齐了
			SPI_Flash_WritePage(pWriteBuffer, WriteAddr, NotAlignmentNumofPage);
			pWriteBuffer += NotAlignmentNumofPage;
			WriteAddr += NotAlignmentNumofPage;
			// 地址对齐后，重新计算写入页数与不足一页的数量
			WriteLength -= NotAlignmentNumofPage;
			PageNumofWriteLength = WriteLength / SPI_FLASH_PageSize;
			NotEnoughNumofPage = WriteLength % SPI_FLASH_PageSize;
			// 先写入整页
			while (PageNumofWriteLength--)
			{
				SPI_Flash_WritePage(pWriteBuffer, WriteAddr, SPI_FLASH_PageSize);
				pWriteBuffer += SPI_FLASH_PageSize;
				WriteAddr += SPI_FLASH_PageSize;
			}
			// 再写入不足一页的数据
			if (NotEnoughNumofPage > 0)
			{
				SPI_Flash_WritePage(pWriteBuffer, WriteAddr, NotEnoughNumofPage);
			}
		}
	}
}
```

{% endfolding %}

{% folding, main.c %}

```cpp
uint8_t Tx_Buffer[] = "嵌入式-培养人才，加油！Yang";
const uint8_t BufferSize = sizeof(Tx_Buffer)/sizeof(Tx_Buffer[0]);
uint8_t Rx_Buffer[BufferSize];

//芯片测试

//擦除扇区
SPI_Flash.EraseSector(0x00000000);
// 写入不定长数据
SPI_Flash.WriteUnfixed(Tx_Buffer,0x00000088,BufferSize);
// 读出不定长数据
SPI_Flash.ReadUnfixed(Rx_Buffer,0x00000088,BufferSize);
printf("读出的数据为：%s\r\n",Rx_Buffer);
```

{% endfolding %}



### 编程示例2

> 模拟SPI

- 接线

{% note simple %}

    单片机GND   ----  屏幕GND
    单片机3.3V  ----  屏幕VCC
    单片机PB11   ----  屏幕CS【片选CS】
    单片机PB10   ----  屏幕AO【寄存器/数据选择】
    单片机PB12  ----  屏幕RESET【复位】
    单片机PA8   ----  屏幕LED【背光】
    单片机PB13   ----  屏幕SCK【总线时钟】
    单片机PC3  ----  屏幕SDA【总线写数据信号MOSI】
{% endnote %}

`介绍`：基于STM32F407VET6，软件模拟SPI驱动 ST7735S LCD屏幕

{% tip bolt %}时序{% endtip %}

可以看到SCL在低电平时数据是可以改变的，也就是SCL低电平空闲，极性就是 `CPOL=0`，SDA数据是在SCL第一个沿稳定，第二沿时才可以被改变，所以相当于第一个沿采样数据，也就是相位是 `CPAL=0`，也就是SPI模式 `0`

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231031180126.webp" style="zoom:67%;" />

{% tip bolt %}模拟SPI的引脚操作{% endtip %}

```cpp
// 置1操作(bit set/reset register)
#define	LCD_SCL_SET  	HAL_GPIO_WritePin(LCD_SCK_GPIO_Port,LCD_SCK_Pin,GPIO_PIN_SET)
#define	LCD_SDA_SET  	HAL_GPIO_WritePin(LCD_SDA_GPIO_Port,LCD_SDA_Pin,GPIO_PIN_SET)
#define	LCD_CS_SET  	HAL_GPIO_WritePin(LCD_CS_GPIO_Port,LCD_CS_Pin,GPIO_PIN_SET)
#define	LCD_DC_SET  	HAL_GPIO_WritePin(LCD_AO_GPIO_Port,LCD_AO_Pin,GPIO_PIN_SET)
#define	LCD_RES_SET  	HAL_GPIO_WritePin(LCD_RESET_GPIO_Port,LCD_RESET_Pin,GPIO_PIN_SET)
// 置0操作(bit reset register)
#define	LCD_SCL_CLR  	HAL_GPIO_WritePin(LCD_SCK_GPIO_Port,LCD_SCK_Pin,GPIO_PIN_RESET)
#define	LCD_SDA_CLR  	HAL_GPIO_WritePin(LCD_SDA_GPIO_Port,LCD_SDA_Pin,GPIO_PIN_RESET)
#define	LCD_CS_CLR  	HAL_GPIO_WritePin(LCD_CS_GPIO_Port,LCD_CS_Pin,GPIO_PIN_RESET)
#define	LCD_DC_CLR  	HAL_GPIO_WritePin(LCD_AO_GPIO_Port,LCD_AO_Pin,GPIO_PIN_RESET)
#define	LCD_RES_CLR  	HAL_GPIO_WritePin(LCD_RESET_GPIO_Port,LCD_RESET_Pin,GPIO_PIN_RESET)
```

{% tip bolt %}向SPI总线发送一个字节数据{% endtip %}

```cpp
static void SPI_ST7735_Write_Data(uint8_t Data)
{
    uint8_t i;

    for(i = 0; i < 8; i++)
    {
        if (Data & 0x80)
        {
            LCD_SDA_SET;    // 输出数据
        }
        else
        {
            LCD_SDA_CLR;    
        }
        LCD_SCL_CLR;
        LCD_SCL_SET;	// 表示SCL时钟信号处于上升沿，开始一位数据传送
        Data <<= 1;
    }
}
```



{% tip bolt %}发送数据/命令函数{% endtip %}

```cpp
/*
* @function: ST7735_Write_CMD
* @param: CMD -> 待写入命令
* @retval: None
* @brief: 向液晶屏写一个字节命令
*/
static void ST7735_Write_CMD(uint8_t CMD)
{
    // CS拉低通信开始，CS拉高通信结束
    LCD_CS_CLR;
    LCD_DC_CLR;
    SPI_ST7735_Write_Data(CMD);
    LCD_CS_SET;
}

/*
* @function: ST7735_Write_DATA_8BIT
* @param: DATA -> 待写入数据
* @retval: None
* @brief: 向液晶屏写1个字节数据
*/
static void ST7735_Write_DATA_8BIT(uint8_t DATA)
{
    LCD_CS_CLR;
    LCD_DC_SET;
    SPI_ST7735_Write_Data(DATA);
    LCD_CS_SET;    
}

/*
* @function: ST7735_Write_DATA_16BIT
* @param: DATA -> 待写入数据
* @retval: None
* @brief: 向液晶屏写2个字节数据
*/
static void ST7735_Write_DATA_16BIT(uint16_t DATA)
{
    LCD_CS_CLR;
    LCD_DC_SET;
    SPI_ST7735_Write_Data(DATA >> 8);   // 先高再低
    SPI_ST7735_Write_Data(DATA);
    LCD_CS_SET;    
}
```



> 硬件SPI

基于上面，只是把SCL和SDA引脚用硬件SPI代替，修改一下发送单字节数据函数即可

- MX配置

这里Mode选择这几个都可以

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231031202357.webp)

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231031185925.webp" style="zoom:67%;" />

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231031185941.webp)

- 程序

```cpp
/*
* @function: SPI_ST7735_Write_Data
* @param: Data -> 一个字节数据
* @retval: None
* @brief: 向SPI总线传输一个字节数据
*/
static void SPI_ST7735_Write_Data(uint8_t Data)
{
	HAL_SPI_Transmit(&hspi2,&Data,sizeof(Data),HAL_MAX_DELAY);
}
```

如果加DMA的话，直接MX打开即可，配置默认，需要打开DMA中断和SPI中断(程序里不需要处理)，然后把发送函数改成：

```cpp
HAL_SPI_Transmit_DMA(&hspi2,&Data,sizeof(Data));
```