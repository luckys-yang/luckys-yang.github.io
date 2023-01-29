---
title: 51单片机-DAC数模转换
cover: /img/num20.webp
comments: false
katex: true
tags:
  - DAC
categories:
  - 51系列
abbrlink: dc3a704d
date: 2022-04-06 19:25:00
updated: 2022-06-03 17:43:20
---
## DAC

{% note blue 'fas fa-fan' flat %}DAC简介{% endnote %}

DAC（Digital to analog converter）即 `数字模拟转换器`，它可以将数字信号转换为模拟信号，`它的功能与 ADC 相反`；DAC 主要由 `数字寄存器、模拟电子开关、位权网络、求和运算放大器和基准电压源（或恒流源）`组成。`出于成本考虑，在实际开发应用中，使用较多的是通过 PWM 来模拟 DAC 输出`。

{% note blue 'fas fa-fan' flat %}DAC 的主要技术指标{% endnote %}

- 分辨率

  DAC 的分辨率是 输入数字量的最低有效位（LSB）发生变化时，所对应的输出模拟量（电压或电流）的变化量它反映了输出模拟量的最小变化值。分辨率与输入数字量的位数有确定的关系，可以表示成
  $$\frac{FS}{2^n}$$

  FS 表示满量程输入值，n 为二进制位数。对于 5V 的满量程，采用８位的 DAC 时，分辨率为 `5V/256＝19.5mV`；当采用12位的 DAC 时，分辨率则为 `5V/4096＝1.22mV`。 `显然，位数越多分辨率就越高`

- 线性度

  线性度（也称非线性误差）是 `实际转换特性曲线与理想直线特性之间的最大偏差`。常以相对于满量程的百分数表示。如 `±１％是指实际输出值与理论值之差在满刻度的±１％以内`。

- 绝对精度和相对精度

  绝对精度（简称精度）是指在整个刻度范围内，任一输入数码所对应的模拟量实际输出值与理论值之间的最大误差。绝对精度是由 DAC 的 `增益误差`（当输入数码为全 1 时，实际输出值与理想输出值之差）、`零点误差`（数码输入为全０时，DAC 的非零输出值）、`非线性误差`和 `噪声` 等引起的。绝对精度（即最大误差）应小于 1 个 LSB。 `相对精度与绝对精度表示同一含义`，用最大误差相对于满刻度的百分比表示。

- 建立时间

  建立时间是指输入的数字量发生满刻度变化时，输出模拟信号达到满刻度值的±1/2LSB 所需的时间。是描述 D/A 转换速率的一个动态指标。根据建立时间的长短，可以将 DAC 分成 `超高速`（＜1μS)、`高速`（10～1μS）、`中速`（100～10μS）、`低速`（≥100μS）几档。

{% note blue 'fas fa-fan' flat %}DAC工作原理{% endnote %}

下面以 `Ｔ型电阻网络DAC` 来介绍。其内部结构图如下所示：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204062042060.jpg)

DAC 输出电压计算公式：
$$V0 = Vref \times \frac{z}{256}$$

`z` 表示单片机给的数字量，`vref` 为参考电压，通常我们是接在系统电源上，即 5V，数值 `256` 表示 DAC 精度为 8 位。



## PWM

{% note blue 'fas fa-fan' flat %}PWM简介{% endnote %}

PWM 中文意思是脉冲宽度调制，简称 `脉宽调制`。它是利用微处理器的数字输出来对模拟电路进行控制的一种非常有效的技术，其控制简单、灵活和动态响应好等优点而成为电力电子技术最广泛应用的控制方式，其应用领域包括测量，通信，功率控制与变换，电动机控制、伺服控制、调光、开关电源，甚至某些音频放大器。

也可以这样理解：

PWM 是 `一种对模拟信号电平进行数字编码的方法`。通过高分辨率计数器的使用，方波的占空比被调制用来对一个具体模拟信号的电平进行编码。 `PWM 信号仍然是数字的`，因为在给定的任何时刻，满幅值的直流供电要么完全有(ON)，要么完全无(OFF)。电压或电流源是以一种通(ON)或断(OFF)的重复脉冲序列被加到模拟负载上去的。通的时候即是直流供电被加到负载上的时候，断的时候即是供电被断开的时候。 `只要带宽足够，任何模拟值都可以使用 PWM 进行编码`。

PWM 对应模拟信号的等效图，如下图所示：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204062052975.jpg)

`a `是一个正弦波即模拟信号，`b `是一个数字脉冲波形即数字信号。我们知道在计算机系统中只能识别是 1 和 0，对于 51 单片机芯片，要么输出高电平（5V），要么输出低电平（0），假如要输出 1.5V 的电压，那么就必须通过相应的处理，比如本章所要讲解的 PWM 输出，其实从上图也可以看到， `只要保证数字信号脉宽足够就可以使用 PWM 进行编码，从而输出1.5V 的电压`。

PWM 的输出其实就是 `对外输出脉宽可调（即占空比调节）的方波信号`，信号频率是由 `T` 的值决定，占空比由 `C` 的值决定。其示意图如图所示：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204062055402.jpg)

 `PWM 输出频率是不变的，改变的是 C 的值`，此值的改变将导致 PWM 输出信号占空比的改变。占空比其实就是 `一个周期内高电平时间与周期的比值`。而频率的话可以使用 51 单片机的定时器确定。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204062057078.jpg)

PWM 输出控制管脚接在单片机 `P2.1` 管脚上，DAC1 为 PWM 输出信号，将其连接一个LED，这样可以通过指示灯的状态直观的反映出 PWM 输出电压值变化。LM358 芯片与这些电容电阻构成了一个跟随电路， `即输入是多少，输出即为多大电压，输出电压范围是 0-5V`。输出信号由 J52 端子的 DAC1 引出，在其端子上还有一个 `AIN3 脚`，它是上一篇文章介绍 ADC 时的 `外部模拟信号输入通道`。如果使用短接片将 DAC1 和 AIN3 短接，这样就可以使用 XPT2046 芯片采集检测PWM 输出信号。



## 软件编写

main.c

```cpp
# include "pwm.h"


void main()
{
	u8 dir=0;//默认为0
	u8 duty=0;
	pwm_init(0xFF,0xF6,100,0);//定时时间为0.01ms，PWM周期是100*0.01ms=1ms，占空比为0%
    
    while(1)
    {
       if(dir==0)//当dir为递增方向
			 {
				 duty++;//占空比递增
				 //数值越小占空比越小呼吸灯越快
				 if(duty==20)//当到达一定值切换方向，占空比最大能到100，但到达70左右再递增，肉眼也分辨不出亮度变化	
					 dir=1;
			 }
			 else
			 {
				 duty--;
				 if(duty==0)//当到达一定值切换方向	
					 dir=0;
			 }
			 pwm_set_duty_cycle(duty);//设置占空比
			 delay_ms(1);//短暂延时，让呼吸灯有一个流畅的效果
    }    
}
```

pwm.c

```cpp
# include "pwm.h"

u8 gtim_h=0;//保存定时器初值高8位
u8 gtim_l=0;//保存定时器初值低8位
u8 gtim_scale=0;//保存PWM周期=定时器初值*tim_scale
u8 gduty=0;//保存PWM占空比



void delay_ms(u16 ms)
{
	u16 i,j;
	for(i=ms;i>0;i--)
	{
		for(j=110;j>0;j--);
	}
}

/*******************************************************************************
* 函 数 名       : pwm_init
* 函数功能		 : PWM初始化函数
* 输    入       : tim_h：定时器高8位
				   tim_l：定时器低8位
				   tim_scale：PWM周期倍数：定时器初值*tim_scale
				   duty：PWM占空比（要小于等于tim_scale）
* 输    出    	 : 无
*******************************************************************************/
void pwm_init(u8 time_h,u8 time_l,u8 time_scale,u8 duty)
{
	gtim_h=time_h;//将传入的初值保存在全局变量中，方便中断函数继续调用
	gtim_l=time_l;
	gtim_scale=time_scale;
	gduty=duty;
	
	TMOD|=0x01;//选择为定时器0模式，工作方式1
	TH0=gtim_h;//定时初值设置 
	TL0=gtim_l;
	ET0=1;//打开定时器0中断允许
	EA=1;//打开总中断
	TR0=1;//打开定时器
}


/*******************************************************************************
* 函 数 名       : pwm_set_duty_cycle
* 函数功能		 : PWM设置占空比
* 输    入       : duty：PWM占空比（要小于等于tim_scale）
* 输    出    	 : 无
*******************************************************************************/
void pwm_set_duty_cycle(u8 duty)
{
	gduty=duty;
}

void pwm() interrupt 1  //定时器0中断函数
{
	static u16 time=0;	
		
	TH0=gtim_h;//定时初值设置 
	TL0=gtim_l;
	
	time++;
	if(time>=gtim_scale)
		time=0;
	if(time<=gduty)
		PWM=1;
	else
		PWM=0;
}


```

pwm.h

```cpp
# ifndef _pwm_H
# define _pwm_H

# include "reg52.h"
typedef unsigned char u8;
typedef unsigned int u16;

sbit PWM=P2^1;//管脚定义

void delay_ms(u16 ms);
void pwm_init(u8 time_h,u8 time_l,u8 time_scale,u8 duty);
void pwm_set_duty_cycle(u8 duty);
# endif
```
{% note blue 'fas fa-fan' flat %}实验现象{% endnote %}

<div class="video-bilibili">
  <iframe
    src="https://player.bilibili.com/player.html?aid=637892903&bvid=BV1SY4y1v7ws&cid=569428053&page=1"
    scrolling="no"
    border="0"
    frameborder="no"
    framespacing="0"
    high_quality="1"
    danmaku="1"
    allowfullscreen="true"
  ></iframe>
</div>