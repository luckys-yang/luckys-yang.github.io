---
title: 51单片机-ADC模数转换
cover: /img/num19.webp
comments: false
katex: true
tags:
  - ADC
categories:
  - 51系列
abbrlink: 9fed9db0
date: 2022-04-06 09:29:00
updated: 2022-06-03 17:39:30
---
## ADC介绍

{% note blue 'fas fa-fan' flat %}简介{% endnote %}

ADC（analog to digital converter）也称为 `模数转换器`，是指一个将模拟信号转变为数字信号。单片机在采集模拟信号时，通常都需要在前端加上 A/D 芯片。

{% note blue 'fas fa-fan' flat %}ADC 的主要技术指标{% endnote %}

- 分辨率

  ADC 的分辨率是指 `对于允许范围内的模拟信号`，它能输出离散数字信号值的个数。这些信号值通常用二进制数来存储，因此分辨率经常用 `比特` 作为单位，且这些离散值的个数是2 的幂指数。

  例如：12 位 ADC 的分辨率就是 12 位，或者说分辨率为满刻度的1/(2^12)。一个 10V 满刻度的 12 位 ADC 能分辨输入电压变化最小值是(公式)：
  $$10V \times \frac{1}{(2^{12})} = 2.4mV$$

- 转换误差

  ​		转换误差 `通常是以输出误差的最大值形式给出`。它表示 A/D 转换器实际输出的数字量和理论上的输出数字量之间的差别。常用 `最低有效位的倍数`表示。例如给出相对误差 `≤±LSB/2，这就表明实际输出的数字量和理论上应得到的输出数字量之间的误差小于最低位的半个字`。

- 转换速率

  ​ ADC 的转换速率是能够重复进行数据转换的速度，即每秒转换的次数。而完成一次 A/D 转换所需的时间（包括稳定时间），则是 `转换速率的倒数`。

{% note blue 'fas fa-fan' flat %}ADC转换原理{% endnote %}

AD 转换器（ADC）将模拟量转换为数字量通常要经过 4 个步骤： `采样、保持、量化和编码`

-  `采样`

  采样即是将一个时间上连续变化的模拟量转换为时间上离散变化的模拟量

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204061114124.png)

-  `保持`

  将采样结果存储起来，直到下次采样，这个过程叫做保持。一般采样器和保持电路一起总称为采样保持电路

-  `量化`

  将采样电平归化为与之接近的离散数字电平，这个过程叫做量化

-  `编码`

  将量化后的结果按照一定数制形式表示就是编码

将采样电平（模拟值）转换为数字值时，主要有两类方法：`直接比较型与间接比较型`。

- 直接比较型

  就是将输入模拟信号直接与标准的参考电压比较，从而得到数字量。常见的有并行 ADC 和逐次比较型 ADC。

- 间接比较型

  输入模拟量不是直接与参考电压比较，而是将二者变为中间的某种物理量在进行比较，然后将比较所得的结果进行数字编码。常见的有双积分型 ADC。

{% note blue 'fas fa-fan' flat %}逐次逼近型 ADC{% endnote %}

采用逐次逼近法的 AD 转换器是有一个 `比较器、DA 转换器、缓冲寄存器和控制逻辑电路` 组成，基本原理是：从高位到低位逐次试探比较，就像用天平秤物体，从重到轻逐级增减砝码进行试探；如下图所示：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204061123688.png)

 `逐次逼近法的转换过程是`：初始化时将逐次逼近寄存器各位清零，转换开始时，先将逐次逼近寄存器最高位置 1，送入 DA 转换器，经 DA转换后生成的模拟量送入比较器，称为 U0，与送入比较器的待转换的模拟量 Ux进行比较，若 `U0<Ux`，该位 1 被保留，否则被清除。然后再将逐次逼近寄存器次高位置 1，将寄存器中新的数字量送 DA 转换器，输出的 U0 再与 Ux 比较，若 `U0<Ux`，该位 1 被保留，否则被清除。重复此过程，直至逼近寄存器最低位。转换结束后，将逐次逼近寄存器中的数字量送入缓冲寄存器，得到数字量的输出。逐次逼近的操作过程是在一个控制电路的控制下进行的。

{% note blue 'fas fa-fan' flat %}双积分型 ADC{% endnote %}

采用双积分法的 AD 转换器由 `电子开关、积分器、比较器和控制逻辑等部件` 组成。其基本原理：将输入电压变换成与其平均值成正比的时间间隔，再把此时间间隔转换成数字量，属于间接转换；

如下图所示：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204061129010.png)

 `双积分法 AD 转换的过程是`：先将开关接通待转换的模拟量 Vi，Vi 采样输入到积分器，积分器从零开始进行固定时间 T 的正向积分，时间 T 到后，开关再接通与 Vi 极性相反的基准电压 Vref，将 Vref输入到积分器，进行反向积分，直到输出为 0V 时停止积分。Vi 越大，积分器输出电压越大，反向积分时间也越长。计数器在反向积分时间内所计的数值，就是输入模拟电压 Vi 所对应的数字量，实现了 AD 转换。



## XPT2046芯片介绍

XPT2046 是一款 ` 4 线制电阻式触摸屏控制器`，内含 `12 位分辨率 125KHz转换速率逐步逼近型 A/D 转换器`。

{% note blue 'fas fa-fan' flat %}主要特性{% endnote %}

① 工作电压范围为1.5V～5.25V

② 支持1.5V～5.25V的数字 I/O 口

③ 内建2.5V参考电压源

④ 电源电压测量（0V~6V）

⑤ 内建结温测量功能

⑥ 触摸压力测量

⑦ 采用 3 线制 SPI 通信接口

⑧ 具有自动省电功能

{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204061235226.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204061236878.jpg)
{% endgallery %}


 `单端和差分模式`输入配置如下图所示：

 {% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204061239309.jpg)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204061239990.jpg)
{% endgallery %}

典型工作时序如下图：

前 8 个时钟用来通过 DIN 引脚输入控制字节。当转换器获取有关下一次转换的足够信息后，接着根据获得的信息设置输入多路选择器和参考源输入，并进入采样模式，如果需要，将启动触摸面板驱动器。3 个多时钟周期后，控制字节设置完成，转换器进入转换状态。这时，输入采样－保持器进入保持状态，触摸面板驱动器停止工作（单端工作模式）。接着的 12 个时钟周期将完成真正的模数转换。如果是度量比率转换方式（SER/DFR＝0），驱动器在转换过程中将一直工作，第 13 个时钟将输出转换结果的最后一位。剩下的 3 个多时钟周期将用来完成被转换器忽略的最后字节（DOUT 置低）

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204061243451.png)

在对 XPT2046 进行控制时， `控制字节由 DIN 输入的控制字命令`格式如下所示：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204061246157.jpg)



## 软件编写

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204061247842.png)

XPT2046 芯片的控制管脚接至单片机 `P3.4~P3.7` 管脚上，XPT2046 芯片的 ADC 输入转换通道分别接入了 AD1 电位器、NTC1 热敏传感器、GR1 光敏传感器，还有一个外接通道 AIN3 接在 DAC（PWM）模块的 J52 端子上供外部模拟信号检测。

{% note red 'fas fa-fan' flat %}注意{% endnote %}

XPT2046的 DOUT 脚与 DS18B20 温度传感器均连接到单片机的P3.7，因此`该两个外设资源不能同时使用，可以分时复用`

main.c

```cpp
# include "smg.h"
# include "xpt2046.h"


void main()
{
	u16 dac_value=0;
	float adc_vol;//ADC电压值
	u8 adc_buf[3];
	while(1)
	{
		dac_value=xpt2046_read_adc_value(0X94);//测量电位器  1001 0100
		adc_vol=5.0*dac_value/4096;//将读取的AD值转换为电压(注意是5.0这样得出的结果才是小数)
		dac_value=adc_vol*10;//放大10倍，即保留小数点后一位
		adc_buf[0]=gsmg_code[dac_value/10]|0x80;//小数点
		adc_buf[1]=gsmg_code[dac_value%10];
		adc_buf[2]=0x3e;//显示单位V
		smg_display(adc_buf,6);
	}
}
```

smg.c

```cpp
# include "smg.h"


u8 gsmg_code[17]={0x3f,0x06,0x5b,0x4f,0x66,0x6d,0x7d,0x07,
				0x7f,0x6f,0x77,0x7c,0x39,0x5e,0x79,0x71};

void delay_10us(u16 ten_us)//当传入 Ten_us=1时，大约延时10us
{
	while(ten_us--);
}
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
			SMG_A0_F_PORT=dat[i-pos_temp];//传送段选数据
			delay_10us(100);//延时1毫秒左右
			SMG_A0_F_PORT=0x00;//消影
	}
}
```

smg.h

```cpp
# ifndef _smg_H
# define _smg_H

# include "xpt2046.h"

sbit A0=P2^2;
sbit A1=P2^3;
sbit A2=P2^4;
# define SMG_A0_F_PORT P0//宏定义数码管P0端口


void delay_10us(u16 ten_us);
extern u8 gsmg_code[17];  //注意要加extern 
void smg_display(u8 dat[],u8 pos);
# endif
```

xpt2046.c

```cpp
# include "xpt2046.h"


/*******************************************************************************
* 函 数 名       : xpt2046_wirte_data
* 函数功能		 : XPT2046写数据
* 输    入       : dat：写入的数据
* 输    出    	 : 无
*******************************************************************************/
void xpt2046_write_data(u8 dat)
{
	u8 i=0;
	CLK=0;
	_nop_();
	for(i=0;i<8;i++)//循环8次，每次传输一位，共一个字节
	{
		DIN=dat>>7;//先传高位再传低位
		dat<<=1;//将低位移到高位
		CLK=0;//CLK由低到高产生一个上升沿，从而写入数据
		_nop_();
		CLK=1;
		_nop_();
	}
}

/*******************************************************************************
* 函 数 名       : xpt2046_read_data
* 函数功能		 : XPT2046读数据
* 输    入       : 无
* 输    出    	 : XPT2046返回12位数据
*******************************************************************************/
u16 xpt2046_read_data()
{
	u8 i=0;
	u16 dat=0;
	CLK=0;
	_nop_();
	for(i=0;i<12;i++)//循环12次，每次读取一位，大于一个字节数，所以返回值类型是u16
	{
		dat<<=1;
		CLK=1;
		_nop_();
		CLK=0;//CLK由高到低产生一个下降沿，从而读取数据
		_nop_();
		dat|=DOUT;//先读取高位，再读取低位。
	}
	return dat;
}
/*******************************************************************************
* 函 数 名       : xpt2046_read_adc_value
* 函数功能		 : XPT2046读AD数据
* 输    入       : cmd：指令
* 输    出    	 : XPT2046返回AD值
*******************************************************************************/
u16 xpt2046_read_adc_value(u8 cmd)
{
	u16 adc_value=0;
	u8 i=0;
	CS=0;//先拉低时钟
	CLK=0;//使能XPT2046
	xpt2046_write_data(cmd);//发送命令字
	for(i=6; i>0; i--);//延时等待转换结果
	CLK = 1;
	_nop_();
	CLK = 0;//发送一个时钟，清除BUSY
	_nop_();
	adc_value=xpt2046_read_data();
	CS=1;//关闭XPT2046
	return adc_value;
}
```


xpt2046.h

```cpp
# ifndef _xpt2046_H
# define _xpt2046_H

# include "reg52.h"
# include "intrins.h"
typedef unsigned char u8;
typedef unsigned int u16;

sbit DOUT=P3^7;//输出
sbit CLK=P3^6;//时钟
sbit DIN=P3^4;//输入
sbit CS=P3^5;//片选

void xpt2046_write_data(u8 dat);
u16 xpt2046_read_data();
u16 xpt2046_read_adc_value(u8 cmd);
# endif
```

{% note blue 'fas fa-fan' flat %}实验现象{% endnote %}

调节电位器 `AD1` 时，数码管上显示的电压值也将变化。对于光敏电阻和热敏电阻以及 AIN3 外部采集通道实验，只需改 `main.c` 中 `xpt2046_read_adc_value的值`即可

- `电位器`对应的采集通道命令：`0X94`
- `光敏电阻`对应的采集通道命令：`0XA4`
- `热敏电阻`对应的采集通道命令：`0XD4`
- `外部输入AIN3`对应的采集通道命令：`0XE4`

<div class="video-bilibili">
  <iframe
    src="https://player.bilibili.com/player.html?aid=767913479&bvid=BV1Vr4y1p7UE&cid=569057004&page=1"
    scrolling="no"
    border="0"
    frameborder="no"
    framespacing="0"
    high_quality="1"
    danmaku="1"
    allowfullscreen="true"
  ></iframe>
</div>


## 光敏控制蜂鸣器响和LED亮

其他代码参考上面的例子，只需更改 `main.c` 即可

main.c

```cpp
# include "smg.h"
# include "xpt2046.h"

sbit BEEP=P2^5;//蜂鸣器
sbit LED1=P2^0;//LED1

void main()
{
	u16 dac_value=0;
	float adc_vol;//ADC电压值
	u8 adc_buf[3];
	u16 i=2000;
	while(1)
	{
		
		dac_value=xpt2046_read_adc_value(0XA4);//测量电位器  1001 0100
		adc_vol=5.0*dac_value/4096;//将读取的AD值转换为电压(注意是5.0这样得出的结果才是小数)
		dac_value=adc_vol*10;//放大10倍，即保留小数点后一位
        
		if(adc_vol<1)//光敏小于1则响并且LED1亮
		{
			while(i--)
		{
			
			BEEP=!BEEP;
			delay_10us(100);
			LED1=0;			
		}
		LED1=1;
		i=2000;//赋0就不会再响了
		BEEP=1;//这赋0或者1都行
		}
        
		adc_buf[0]=gsmg_code[dac_value/10]|0x80;//小数点
		adc_buf[1]=gsmg_code[dac_value%10];
		adc_buf[2]=0x3e;//显示单位V
		smg_display(adc_buf,6);
	}
}
```

<div class="video-bilibili">
  <iframe
    src="https://player.bilibili.com/player.html?aid=595416601&bvid=BV13q4y1a7xn&cid=569088160&page=1"
    scrolling="no"
    border="0"
    frameborder="no"
    framespacing="0"
    high_quality="1"
    danmaku="1"
    allowfullscreen="true"
  ></iframe>
</div>
