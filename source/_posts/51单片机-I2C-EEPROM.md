---
title: 51单片机-I2C-EEPROM
cover: /img/num13.webp
comments: false
tags:
  - I2C
  - EEPROM
categories:
  - 51系列
abbrlink: 4ff7c91e
date: 2022-04-01 21:40:00
updated: 2022-06-03 16:45:40
---
## I2C

{% note blue 'fas fa-fan' flat %}I2C介绍{% endnote %}

是微电子通信控制领域广泛采用的一种总线标准。它是同步通信的一种特殊形式，具有接口线少，控制方式简单，器件封装形式小，通信速率较高等优点。I2C 总线只有两根双向信号线。`一根是数据线 SDA，另一根是时钟线 SCL`。由于其管脚少，硬件实现简单，可扩展性强等特点，因此被广泛的使用在各大集成芯片内。

{% note blue 'fas fa-fan' flat %}I2C物理层{% endnote %}

I2C 通信设备常用的连接方式如下图所示：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204012201142.png)

它的物理层有如下特点：

- 它是一个 `支持多设备的总线`。“总线”指 `多个设备共用的信号线`。在一个 I2C 通讯总线中，可连接多个 I2C 通讯设备，支持多个通讯主机及多个通讯从机。
- 一个 I2C 总线只使用两条总线线路，一条双向串行数据线 `(SDA)`，一条串行时钟线 `(SCL)`。数据线即用来表示数据，时钟线用于数据收发同步。
- 每个连接到总线的设备都有一个 `独立的地址`，主机可以利用这个地址进行不同设备之间的访问。
- 总线通过上拉电阻接到电源。当 I2C 设备空闲时，会输出高阻态，而当所有设备都空闲，都输出高阻态时，由上拉电阻把总线拉成高电平。
- 多个主机同时使用总线时，为了防止数据冲突，会利用 `仲裁方式`决定由哪个设备占用总线。
- 具有三种传输模式：标准模式传输速率为  `100kbit/s`，快速模式为 `400kbit/s`，高速模式下可达  `3.4Mbit/s`，但目前大多 I2C 设备尚不支持高速模式。
- 连接到相同总线的 IC 数量受到总线的n`最大电容 400pF 限制`

{% note blue 'fas fa-fan' flat %}了解下 I2C 总线常用的一些术语{% endnote %}

 `主机`：启动数据传送并产生时钟信号的设备；

 `从机`：被主机寻址的器件；

 `多主机`：同时有多于一个主机尝试控制总线但不破坏传输；

 `主模式`：用 I2CNDAT 支持自动字节计数的模式； 位 I2CRM,I2CSTT,I2CSTP 控制数据的接收和发送；

 `从模式`：发送和接收操作都是由 I2C 模块自动控制的；

 `仲裁`：是一个在有多个主机同时尝试控制总线但只允许其中一个控制总线并使传输不被破坏的过程；

 `同步`：两个或多个器件同步时钟信号的过程；

 `发送器`：发送数据到总线的器件；

 `接收器`：从总线接收数据的器件。

{% note blue 'fas fa-fan' flat %}I2C协议层{% endnote %}

- 数据有效性规定

I2C 总线进行数据传送时，时钟信号为 `高电平` 期间，数据线上的数据必须保持稳定，只有在 `时钟线上的信号为低电平` 期间，数据线上的高电平或低电平状态才允许变化。每次数据传输都以 `字节为单位` ， `每次传输的字节数不受限制`。如下图：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204012218228.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204021740151.png)

- 起始和停止信号

SCL 线为 `高电平` 期间，SDA 线由 `高电平向低电平的变化` 表示起始信号；SCL线为高电平期间，SDA 线由 `低电平向高电平的变化` 表示终止信号。`起始和终止信号都是由主机发出的`，在起始信号产生后，总线就处于被 `占用` 的状态；在终止信号产生后，总线就处于 `空闲` 状态如下图：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204012221630.png)

- 应答响应

每当发送器件传输完一个字节的数据后，后面必须紧跟一个 `校验位` ，这个校验位是 `接收端通过控制SDA（数据线）来实现的` ，以提醒发送端数据我这边已经接收完成，数据传送可以继续进行，这个校验位其实就是数据或地址传输过程中的 `响应`。响应包括 `“应答(ACK)”和“非应答(NACK)”` 两种信号，若希望对方继续发送数据，则需要向对方发送“应答(ACK)”信号即特定的低电平脉冲，发送方会继续发送下一个数据；若接收端希望结束数据传输，则向对方发送“非应答(NACK)”信号即特定的高电平脉冲，发送方接收到该信号后会产生一个停止信号，结束信号传输。应答响应时序图如下：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204012224705.png)

每一个字节必须保证是 8 位长度。 `数据传送时，先传送最高位（MSB），每一个被传送的字节后面都必须跟随一位应答位（即一帧共有 9 位）。` 这些信号中，起始信号是必需的，结束信号和应答信号都可以不要。

- 总线的寻址方式

I2C 总线寻址按照从机地址位数可分为两种， `一种是 7 位，另一种是 10位`。采用 7 位的寻址字节（寻址字节是起始信号后的第一个字节）的位定义如下：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204012226815.png)

 `D7～D1` 位组成从机的地址。 `D0` 位是数据传送方向位，为“ 0”时表示主机向从机写数据，为“1”时表示主机由从机读数据。在一个系统中可能希望接入多个相同的从机，从机地址中可编程部分决定了可接入总线该类器件的最大数目，如一个从机的  `7 位寻址位有 4 位是固定位，3 位是可编程位`，这时仅能寻址 8 个同样的器件，即可以有 8 个同样的器件接入到该 I2C 总线系统中。

- 数据传输

I2C 总线上传送的数据信号是广义的，既包括地址信号，又包括真正的数据信号。在起始信号后必须传送一个 `从机的地址（7 位）`，第 8 位是数据的传送方向位（R/W），用“ 0”表示主机发送（写）数据（W），“ 1”表示主机接收数据（R）

 `在总线的一次数据传送过程中，可以有以下几种组合方式`：

- a、主机向从机发送数据，数据传送方向在整个传送过程中不变

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204012234270.png)

{% note red 'fas fa-fan' flat %}注意{% endnote %}

有阴影部分表示 `数据由主机向从机传送`，无阴影部分则表示 `数据由从机向主机传送`。 `A` 表示应答， `A非` 表示非应答（高电平）。 `S` 表示起始信号， `P` 表示终止信号。

- b、主机在第一个字节后，立即从从机读数据

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204012236130.png)

- c、在传送过程中，当需要改变传送方向时，起始信号和从机地址都被重复产生一次，但两次读/写方向位正好相反

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204012237370.png)



## AT24C02 介绍

AT24C01/02/04/08/16...是一个  `1K/2K/4K/8K/16K ` 位串行 CMOS，内部含有 `128/256/512/1024/2048 个 8 位字节` ，AT24C01 有一个  `8 字节页写缓冲器` ，AT24C02/04/08/16 有一个  `16 字节页写缓冲器`；该器件通过 I2C 总线接口进行操作，它有一个专门的 `写保护功能`。我们开发板上使用的是 AT24C02(EEPROM)芯片，此芯片具有 I2C 通信接口，芯片内保存的数据在掉电情况下都不丢失，所以通常用于存放一些比较重要的数据等。AT24C02 芯片管脚及外观图如下图所示：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204021347972.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204021347233.png)

 `AT24C02 器件地址为 7 位，高 4 位固定为 1010，低 3 位由 A0/A1/A2 信号线的电平决定`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204021350894.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204021737478.png)

## 多文档工程

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204021413927.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204021413183.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204021413185.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204021413918.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204021413364.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204021417763.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204021421435.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204021424087.png)

 然后public文件也是按照上面步骤操作创建.c文件一般除了主文件其他的文件一般都是一个.c文件和.h文件

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204021436707.png)



 最终效果

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204021534171.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204021536956.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204021536801.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204021534247.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204021534000.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204021534860.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204021534521.png)



## 软件编写


main.c

```cpp
# include "public.h"
# include "key.h"
# include "smg.h"
# include "at24c02.h"

# define EEPROM_ADDRESS 30

void main()
{
	u8 key_temp=0;
	u8 save_value=0;
	u8 save_buf[3];
	while(1)
	{
		key_temp=key_scan(0);
		if(key_temp==KEY1_PRESS)
		{
			at24c02_write_one_byte(EEPROM_ADDRESS,save_value);
		}
		else if(key_temp==KEY2_PRESS)
		{
			save_value=at24c02_read_one_byte(EEPROM_ADDRESS);
		}
		else if(key_temp==KEY3_PRESS)
		{
			
			if(save_value==255)
			{
				save_value=255;
			}
			save_value++;
		}
		else if(key_temp==KEY4_PRESS)
		{
			save_value=0;
		}
		save_buf[0]=save_value/100;//百位
		save_buf[1]=save_value%100/10;//十位
		save_buf[2]=save_value%100%10;//个位
		smg_display(save_buf,6);
	}
}
```

public.h

```cpp
# ifndef _public_H
# define _public_H

# include "reg52.h"

typedef unsigned char u8;
typedef unsigned int u16; 

void delay_10us(u16 ten_us);
void delay_ms(u16 ms);

# endif
```

public.c

```cpp
# include "public.h"

void delay_10us(u16 ten_us)//当传入 Ten_us=1时，大约延时10us
{
	while(ten_us--);
}

void delay_ms(u16 ms)
{
	u16 i,j;
	for(i=ms;i>0;i--)
	{
		for(j=110;j>0;j--);
	}
}
```

key.h

```cpp
# ifndef _key_H
# define _key_H

# include "public.h"

sbit KEY1=P3^1;
sbit KEY2=P3^0;
sbit KEY3=P3^2;
sbit KEY4=P3^3;

# define KEY1_PRESS 1
# define KEY2_PRESS 2
# define KEY3_PRESS 3
# define KEY4_PRESS 4
# define KEY_UNPRESS 0

u8 key_scan(u8 mode);

# endif
```

key.c

```cpp
# include "key.h"

u8 key_scan(u8 mode)
{
	static u8 key=1;
	if(mode)key=1;
	if(key==1 && (KEY1==0||KEY2==0||KEY3==0||KEY4==0))
	{
		delay_10us(1000);//消抖
		key=0;
		if(KEY1==0)
			return KEY1_PRESS;
		else if(KEY2==0)
			return KEY2_PRESS;
		else if(KEY3==0)
			return KEY3_PRESS;
		else if(KEY4==0)
			return KEY4_PRESS;
	}
	else if(KEY1==1&&KEY2==1&&KEY3==1&&KEY4==1)
	{
		key=1;
	}
	return KEY_UNPRESS;
}
```

smg.h

```cpp
# ifndef _smg_H
# define _smg_H

# include "public.h"

sbit A0=P2^2;
sbit A1=P2^3;
sbit A2=P2^4;
# define SMG_A0_F_PORT P0//宏定义数码管P0端口
extern u8 gsmg_code[17];  //注意要加extern 

void smg_display(u8 dat[],u8 pos);
# endif
```

smg.c

```cpp
# include "smg.h"

u8 gsmg_code[]={0x3f,0x06,0x5b,0x4f,0x66,0x6d,0x7d,0x07,0x7f,
			  0x6f,0x77,0x7c,0x39,0x5e,0x79,0x71};//定义数组存放0-F段码,gsmg中g代表全局变量

void smg_display(u8 dat[],u8 pos)
{
	u8 i=0;
	u8 pos_temp=pos-1;
	
	for(i=pos_temp;i<8;i++)
	{
		switch(i)
		{
				case 0:A0=1;A1=1;A2=1;break;//Y7//板子从左边数第一个数码管，下面以此类推
				case 1:A0=0;A1=1;A2=1;break;//Y6
				case 2:A0=1;A1=0;A2=1;break;//Y5
				case 3:A0=0;A1=0;A2=1;break;//Y4
				case 4:A0=1;A1=1;A2=0;break;//Y3
				case 5:A0=0;A1=1;A2=0;break;//Y2
				case 6:A0=1;A1=0;A2=0;break;//Y1
				case 7:A0=0;A1=0;A2=0;break;//Y0
		}
			SMG_A0_F_PORT=gsmg_code[dat[i-pos_temp]];
			delay_10us(100);//延时1毫秒左右
			SMG_A0_F_PORT=0x00;//消影
	}
}
```

icc.h

```cpp
# ifndef _iic_H
# define _iic_H

# include "public.h"
sbit IIC_SCL=P2^1;
sbit IIC_SDA=P2^0;

void iic_start();
void iic_stop();
void iic_ack();
void iic_nack();
u8 iic_wait_ack();
void iic_write_byte(u8 dat);
u8 iic_read_byte(u8 ack);

# endif
```

icc.c

```cpp
# include "iic.h"

/********************************************************************
***********
* 函 数 名 : iic
_start
* 函数功能 : 产生 IIC 起始信号
* 输 入 : 无
* 输 出 : 无
*********************************************************************
**********/
void iic_start()
{
	IIC_SCL=1;
	IIC_SDA=1;
	delay_10us(1);
	IIC_SDA=0;//当SCL为高电平时，SDA由高变低
	delay_10us(1);
	IIC_SCL=0;//钳住I2C总线，准备发送或接收数据
}
/********************************************************************
***********
* 函 数 名 : iic
_stop
* 函数功能 : 产生 IIC 停止信号
* 输 入 : 无
* 输 出 : 无
*********************************************************************
**********/
void iic_stop()
{
	IIC_SCL=1;
	IIC_SDA=0;
	delay_10us(1);
	IIC_SDA=1;//当 SCL 为高电平时，SDA 由低变为高
	delay_10us(1);
}
/********************************************************************
***********
* 函 数 名 : iic
_ack
* 函数功能 : 产生 ACK 应答
* 输 入 : 无
* 输 出 : 无
*********************************************************************
**********/
void iic_ack()
{
	IIC_SCL=0;
	IIC_SDA=0;//SDA为低电平
	delay_10us(1);
	IIC_SCL=1;
	delay_10us(1);
	IIC_SCL=0;
}
/********************************************************************
***********
* 函 数 名 : iic
_nack
* 函数功能 : 产生 NACK 非应答
* 输 入 : 无
* 输 出 : 无
*********************************************************************
**********/
void iic_nack()
{
	IIC_SCL=0;
	IIC_SDA=1;//SDA为高电平
	delay_10us(1);
	IIC_SCL=1;
	delay_10us(1);
	IIC_SCL=0;
}
/********************************************************************
***********
* 函 数 名 : iic
_wait
_ack
* 函数功能 : 等待应答信号到来
* 输 入 : 无
* 输 出 : 1，接收应答失败
0，接收应答成功
*********************************************************************
**********/
u8 iic_wait_ack()
{
	u8 time_temp=0;
	IIC_SCL=1;
	delay_10us(1);
	while(IIC_SDA)//等待 SDA 为低电平
	{
		time_temp++;
		if(time_temp>100)//超时则强制结束 IIC 通信
		{
			iic_stop();
			return 1;
		}
	}
	IIC_SCL=0;
	return 0;
}
/********************************************************************
***********
* 函 数 名 : iic
_write
_byte
* 函数功能 : IIC 发送一个字节
* 输 入 : dat：发送一个字节
* 输 出 : 无
*********************************************************************
**********/
void iic_write_byte(u8 dat)
{
	u8 i=0;
	IIC_SCL=0;//为0数据才可以改变
	for(i=0;i<8;i++)
	{
		 if((dat&0x80)>0)//比较最高位
			 IIC_SDA=1;
		 else
			 IIC_SDA=0;
		 dat<<=1;//左移一位
		 delay_10us(1);
		 IIC_SCL=1;//为1数据稳定等待下一次传输
		 delay_10us(1);
		 IIC_SCL=0;
		 delay_10us(1); 
	}
}

/********************************************************************
***********
* 函 数 名 : iic
_read
_byte
* 函数功能 : IIC 读一个字节
* 输 入 : ack=1 时，发送 ACK，ack=0，发送 nACK
* 输 出 : 应答或非应答
*********************************************************************
**********/
u8 iic_read_byte(u8 ack)
{
	u8 i=0;
	u8 receive=0;//保存读取的数据
	for(i=0;i<8;i++)//循环 8 次将一个字节读出，先读高再传低位
	{
		IIC_SCL=0;
		delay_10us(1);
		IIC_SCL=1;
		receive<<=1;
		if(IIC_SDA)
			receive++;
		delay_10us(1);
	}
	if(!ack)
		iic_nack();
	else
		iic_ack();
	return receive;//返回出去
}
```

at24c02.h

```cpp
# ifndef _at24c02_H
# define _at24c02_H

# include "public.h"

void at24c02_write_one_byte(u8 addr,u8 dat);
u8 at24c02_read_one_byte(u8 addr);
# endif
```

at24c02.c

```cpp
# include "at24c02.h"
# include "iic.h"

/********************************************************************
***********
* 函 数 名 : at24c02
_write
_one
_byte
* 函数功能 : 在 AT24CXX 指定地址写入一个数据
* 输 入 : addr:写入数据的目的地址
dat:要写入的数据
* 输 出 : 无
*********************************************************************
**********/
void at24c02_write_one_byte(u8 addr,u8 dat)
{
	iic_start();
	iic_write_byte(0xA0);//发送写命令(前面4位固定，后面三位接gnd所以是0)
	iic_wait_ack();
	iic_write_byte(addr);//发送写地址
	iic_wait_ack();
	iic_write_byte(dat);//发送字节
	iic_wait_ack();
	iic_stop();//产生一个停止条件
	delay_ms(10);
}
/********************************************************************
***********
* 函 数 名 : at24c02
_read
_one
_byte
* 函数功能 : 在 AT24CXX 指定地址读出一个数据
* 输 入 : addr:开始读数的地址
* 输 出 : 读到的数据
*********************************************************************
**********/
u8 at24c02_read_one_byte(u8 addr)
{
	u8 temp=0;
	iic_start();
	iic_write_byte(0xa0);//发送写命令
	iic_wait_ack();
	iic_write_byte(addr);//发送写地址
	iic_wait_ack();
	iic_start();
	iic_write_byte(0xa1);//进入接收模式
	iic_wait_ack();
	temp=iic_read_byte(0);//读取字节
	iic_stop();//产生一个停止条件
	return temp;//返回读取的数据
}
```

{% note blue 'fas fa-fan' flat %}实验现象{% endnote %}

使用 USB 线将开发板和电脑连接成功后（电脑能识别开发板上 CH340 串口），把编译后产生的.hex 文件烧入到芯片内，实现现象如下：码管右 3 位显示 0，按 K1 键将数据写入到 EEPROM 内保存，按 K2 键读取 EEPROM 内保存的数据，按K3 键显示数据加 1，按 K4 键显示数据清零，最大能写入的数据是 255

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204022051371.jpg)
