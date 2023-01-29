---
title: 51单片机-LED
cover: /img/num6.webp
comments: false
tags:
  - LED
categories:
  - 51系列
abbrlink: 3a4682cc
date: 2022-03-03 17:34:00
updated: 2022-09-24 16:45:02
---


## 前言



今天是寒假的第二天，之前通过某宝买了51单片机板想学学单片机但是在校没时间现在放寒假了终于可以尽情的学习单片机了虽然大二才有单片机课程，但是我想提前学习，昨天边看教程边耍，感觉还不错。由于没有数电模电基础所以电路看不懂但是教程视频里说不会影响只要有C语言基础就行，等以后学了数电模电再看前面的电路视频不迟。
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96/Image1.jpg)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96/Image.jpg)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96/Image2.jpg)
单片机最小系统：⑴`晶振电路`（2）`复位电路`（3）`电源电路`（4）`下载电路`
GPIO（generalpurposeintputoutput）是通用输入输出端口的简称，可以通过软件来控制其输入和输出。
51单片机引脚分类：
（1）`电源引脚`：引脚图中的VCC、GND都属于电源引脚。
（2）`晶振引脚`：引脚图中的XTAL1、XTAL2都属于晶振引脚。
（3）`复位引脚`：引脚图中的RST/VPD属于复位引脚，不做其他功能使用。
（4）`下载引脚`：51单片机的串口功能引脚（TXD、RXD）可以作为下载引脚使用。
（5）`GPIO引脚`：引脚图中带有Px.x等字样的均属于GPIO引脚。从引脚图可以看出，GPIO占用了芯片大部分的引脚，共达32个，分为了4组，P0、P1、P2、P3，每组为8个IO，而且在P3组中每个IO都具备额外功能，只要通过相应的寄存器设置即可配置对应的附加功能，同一时刻，每个引脚只能使用该引脚104的一个功能


![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/bY6zAx.png)

 点亮LED还是挺简单的，因为是<font color='orange'>正极</font>流进来所以要给P20<font color='orange'>低电平</font>就行了

```cpp
# include "reg52.h"
sbit LED1=P2^0;
void main()
{
    LED1=0;
    while(1);
}
```

然后是流水灯：

```cpp
# include "reg52.h"
typedef unsigned int u16;
# define LED_PORT	P2

void delay_10us(u16 ten_us)
{
	while(ten_us--);
}
void main()
{
	int i=0;
    while(1)
	{
			for(i=0;i<8;i++)
	     {
			LED_PORT=~(0x01<<i);//流水灯
			delay_10us(50000);
 		 }
	}
	
	
	while(1);
}
```

还有一种流水灯的做法是用库函数：<font color='red'># include "intrins.h"</font>

```cpp
# include "reg52.h"
# include "intrins.h"
typedef unsigned int u16;
# define LED_PORT	P2
 
void delay_10us(u16 ten_us)
{
	while(ten_us--);
}
void main()
{
	int i=0;
	LED_PORT=~0x01;//首先第一个LED亮
	delay_10us(50000);//延时480毫秒左右
	while(1)
	{
				for(i=0;i<7;i++)
			{
					LED_PORT=_crol_(LED_PORT,1);//LED左边开始每次移动1位
					delay_10us(50000);
			}
				for(i=0;i<7;i++)
			{
					LED_PORT=_cror_(LED_PORT,1);
					delay_10us(50000);
			}	
	}
	
	
	while(1);
}
```

<font color='orange'>_crol_和_cror_</font>都是库函数，<font color='orange'>每次移动后不会自动补0而是把前面移出去的补到后面去</font>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/bYg1JK.md.png)

{% note blue 'fas fa-fan' flat %}实验现象{% endnote %}

<div class="video-bilibili">
  <iframe
    src="https://player.bilibili.com/player.html?aid=680507409&bvid=BV1dS4y1T7Tq&cid=480480018&page=1"
    scrolling="no"
    border="0"
    frameborder="no"
    framespacing="0"
    high_quality="1"
    danmaku="1"
    allowfullscreen="true"
  ></iframe>
</div>



  
