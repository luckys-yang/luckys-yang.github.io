---
title: KST51-学习笔记
cover: /img/num109.webp
comments: false
categories:
  - 51系列
abbrlink: 6ffec537
date: 2022-09-26 13:14:00
updated: 2022-11-06 17:56:05
---
##  开发板介绍

这是学校发的 KST-51开发板，芯片也是 `STC89C52RC`

- 整个单 片机的工作电流，不要超过 `50mA`，单个 IO 口总电流不要超过 `6mA`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220926142732.jpg) 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220926143104.jpg) 

`同学拿到板子测试板子发现第二个数码管b段应该是坏了没亮(刚换的新板子呀，应该是生产工艺问题)`

##  部分硬件部分

{% note red 'fas fa-fan' flat %} 最小系统 {% endnote %}

`工作电压`：5.5V～3.4V（5V 单片机）

还有一种常用的工作电压范围是 2.7V～3.6V、典型值是 `3.3V 的单片机`

晶振通常分为 `无源晶振`v和 `有源晶振` 两种类型，无源晶振两侧通常都会有个电容，一般其容值都选在  `10pF~40pF` 之间如果手册没有要求，我们用 `20pF` 就 是比较好的选择，这是一个长久以来的经验值，具有极其普遍的适用性

{% note red 'fas fa-fan' flat %} 准双向IO口 {% endnote %}

但是实际上在我们的单片机 IO 口内部，也有一个 `上拉电阻` 的存在。我们的按键是接到了 P2 口上，P2 口上电默认是 `准双向 IO 口`，我们来简单 了解一下这个准双向 IO 口的电路：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220929134731.jpg) 

```cpp
//分析(首先说明一点，就是我们现在绝大多数单片机的 IO 口都是使用 MOS 管而非三极管，但用在这里的 MOS 管其原理和三极管是一样的，因此在这里我用三极管替代它来进行原理讲解)
方框内的电路都是指单片机内部部分，方框外的就是我们外接的上拉电阻和按键；当我们要读取外部按键信号的时候，单片机必须先给该引脚(内部输出)写 "1"，也就是高电平，这样我们才能正确读取到外部按键信号。

    缘由：当内部输出是高电平，经过一个反向器变成低电平，NPN 三极管不会导通，那么单片机IO 口从内部来看，由于上拉电阻 R 的存在，所以是一个高电平。当外部没有按键按下将电平拉低的话，VCC 也是+5V，它们之间虽然有 2 个电阻，但是没有压差，就不会有电流，线上所有的位置都是高电平，这个时候我们就可以正常读取到按键的状态了。
    当内部输出是个低电平，经过一个反相器变成高电平，NPN 三极管导通，那么单片机的内部 IO 口就是个低电平，这个时候，外部虽然也有上拉电阻的存在，但是两个电阻是并联关系，不管按键是否按下，单片机的 IO 口上输入到单片机内部的状态都是低电平，我们就无法正常读取到按键的状态了
//结论
这种具有上拉的准双向 IO 口，如果要正常读取外部信号的状态，必须首先得保证自己内部输出的是 1，如果内部输出 0，则无论外部信号是 1 还是 0，这个引脚读进来的都是 0。 


//补充：NPN跟PNP相反，NPN是高电平导通低电平截止，NPN导通条件是基极电压高于发射极电压
```

实际上我们的单 片机 IO 口还有另外三种状态，分别是 `开漏、推挽、高阻态`

![这里按照实际情况用 MOS 管画图示意](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220930185454.jpg) 

```cpp
//三极管是靠电流导通的，而 MOS 管是靠电压导通的，在单片机 IO 口状态这一块内容上，我们可以把 MOS 管当三极管来理解
●开漏输出
开漏输出和准双向 IO 的唯一区别，就是开漏输出把内部的上拉电阻去掉了。开漏输出如果要输出高电平时，T2 关断，IO 电平要靠外部的上拉电阻才能拉成高电平，如果没有外部上拉电阻 IO 电平就是一个不确定态。标准 51 单片机的 P0 口默认就是开漏输出，如果要用的时候外部需要加上拉电阻
●强推挽输出
当内部输出一个高电平时，通过 MOS 管直接输出电流，没有电阻的限流，电流输出能力也比较大；如果内部输出一个低电平，那反向电流也可以很大，强推挽的一个特点就是驱动能力强
●高阻态
通常我们用来做输入引脚的时候，可以将 IO 口设置成高阻态，高阻态引脚本身如果悬空，用万用表测量的时候可能是高可能是低，它的状态完全取决于外部输入信号的电平，高阻态引脚对 GND 的等效电阻很大（理论上相当于无穷大，但实际上总是有限值而非无穷大），所以称之为高阻
```

```cpp
//上下拉电阻
上拉电阻就是将不确定的信号通过一个电阻拉到高电平，同时此电阻也起到一个限流作用，下拉就是下拉到低电平，常用的上下拉电阻值大多选取在 1K 到 10K 之间
```

{% note red 'fas fa-fan' flat %} 单片机RAM区域划分{% endnote %}

```cpp
STC89C52 共有 512 字节的 RAM，是用来保存数据的，比如我们定义的变量都是直接存在 RAM 里边的，51 单片机的 RAM 分为两个部分，一块是片内 RAM，一块是片外 RAM
以下是几个 Keil C51 语言中的关键字，代表了 RAM 不同区域的划分：
●data：片内 RAM 从 0x00~0x7F 
●idata：片内 RAM 从 0x00~0xFF 
●pdata：片外 RAM 从 0x00~0xFF 
●xdata：片外 RAM 从 0x0000~0xFFFF 
data 是 idata 的一部分，pdata 是 xdata 的一部分
//补充1
(1)我们定义一个变量 a，可以这样：unsigned char data a=0，而我们前边定义变量时都没有加 data 这	  个关键字，是因为在 Keil 默认设置下，data 是可以省略的
(2)data 区域 RAM 的访问在汇编语言中用的是直接寻址，执行速度是最快的。如果你定义成 idata，不仅仅	可以访问 data 区域，还可以访问 0x80H~0xFF 的范围，但加了 idata 关键字后，访问的时候 51 单	    片机用的是通用寄存器间接寻址，速度较 data会慢一些,在绝大多数情况下，我们使用内部 RAM 的时	    候，只用 data 就可以了
(3)我们的 STC89C52 共有 512 字节的 RAM，分为 256 字节的片内 RAM 和 256 字节的片外RAM。一般情    况下，我们是使用 data 区域，data 不够用了，我们就用 xdata，如果希望程序执行效率尽量高一点，    就使用 pdata 关键字来定义
```





##  LED模块

- 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220926230113.jpg) 

{% note blue 'fas fa-fan' flat %} 补充知识 {% endnote %}

二极管最重要的特性是 `单方向导电性`，在电路中，`电流只能从二极管的正极流入，负极流出`

发光二极管 `长脚为正，短脚为负`。如果脚一样长，发光二极管里面的 `大点是负极，小的是正极`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220926144226.jpg) 

当加在二极管两端的正向电压很小时，二极管仍然不能导通，流过二极管的正向电流十分微弱。只有当正向电压达到某一数值（这一数值称为“门坎电压”，又称 `死区电压`， `锗管约为0.1V，硅管约为0.5V`）以后，二极管才能直正导通。导通后二极管两端的电压基本上保持不变（锗管约为0.3V，硅管约为0.7V），称为二极管的 `正向压降`

三极管：三极管是一种控制元件，主要用来 `控制电流的大小`，箭头方向表示 `电流的流向`，同时表示了三极管的极性， `箭头朝外的表示为NPN型、箭头方向朝里的表示为PNP型`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220926145148.jpg) 

三极管正常工作时有三个区间： `截止区、放大区和饱和区`，它具有 `放大和开关两个功能`，在这里就是利用它的特性把三极管作为开关控制LED的亮灭

- `三极管饱和`-----实现电子开关的“开”功能
- `三极管截止`-----实现电子开关的“关”功能

`口诀`：导通电压顺箭头过，电压导通，电流控制(解释看下面用法特点)

三极管用法特点：

关键点在于 b 极（基极）和 e 极（发射极）之间的电压情况， `对于PNP 而言，e 极电压只要高于 b 极 0.7V 以上，这个三极管 e 极和 c 极之间就可以顺利导通。`也就是说，控制端在 b 和 e 之间，被控制端是 e 和 c 之间。 `同理，NPN 型三极管的导通电压是 b 极比 e 极高 0.7V`，总之是<span style="color:# e80daf">箭头的始端比末端高 0.7V 就可以导通三极管的 e 极和 c 极</span>

<span style="color:red;">b作为控制端，NPN型三极管，高电平导通，低电平关断；PNP型三极管，高电平关断，低电平导通</span>

NPN和PNP三极管的接法有些不同， `NPN型三极管当下管使用，控制灯泡的负极；PNP型三极管当上管使用，控制灯泡的正极`。

点亮LED需要的原理图：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220926192238.jpg) 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220926220254.jpg) 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220926220312.jpg) 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220926220347.jpg) 

```cpp
//注意1
电路图右侧所有的 LED 下侧的线最终都连到一根黑色的粗线上去了，大家注意，这个地方不是实际的完全连到一起，而是一种总线的画法，画了这种线以后，表示这是个总线结构。而所有的名字一样的节点是一一对应的连接到一起，其他名字不一样的，是不连在一起的。比如左侧的 DB0 和右侧的最右边的 LED2 小灯下边的DB0 是连在一起的，而和 DB1 等其他线不是连在一起的
```

三极管基极通过一个 `1K` 的电阻接到了单片机的 `74HC138芯片`上的 `LEDS6`端口上， `发射极直接接到 5V 的电源上`，集电极上分别连了8个 LED 小灯，8个LED小灯分别连了 `330Ω电阻`。如果 `LEDS6` 由我们的程序给一个 `高电平 1`，那么 `基极 b 和发射极 e 都是 5V`，也就是说 `e到 b 不会产生一个 0.7V 的压降，这个时候，发射极和集电极也就不会导通，LED 小灯也就不会亮。`如果程序给 `LEDS6` `一个低电平 0`，这时  `e 极还是 5V，于是 e 和 b 之间产生了压差，三极管 e 和 b 之间也就导通了`，三极管 e 和 b 之间大概有 0.7V 的压降，那还有（5-0.7）V 的电压会在电阻 R47 上；这时候根据二极管特性只要负极加个 `低电平0` 就可以点亮LED 小灯了。(当然还需要设置74HC138芯片的一些端口值)

###  74HC245芯片

74HC245 是个 `双向缓冲器`(DIR 是方向引脚，当它高电平时：右侧B编号电压等于左侧A编号对应电压；当 DIR低电平：左侧A编号电压等于右侧B编号对应电压)，作用是电流驱动缓冲，不起到任何逻辑控制的效果，稳定工作在 `70mA` 电流是没有问题的，比单片机的 8 个 IO 口大多了，所以我们可 以把他接在 `小灯和 IO 口之间做缓冲`，这个地方 `控制端是左侧接的是 P0 口，我 们要求 B 等于 A 的状态，所以 1 脚我们直接接的 5V 电源，即高电平`

问：已经在电源 VCC 那地方加了一个三极管驱动了， 为何还要再加 245 驱动芯片呢？

<span style="color:# e80daf">从电源正极到负极的电流水管的粗细都要满足要求，任何 一个位置的管子过细，都会出现瓶颈效应，电流在整个通路中细管处会受到限制而降低，所 以在电路通路的每个位置上，都要保证通道足够畅通，这个 74HC245 的作用就是消除单片机 IO 这一环节的瓶颈</span>



###  74HC138芯片

在我们设计单片机电路的时候，单片机的 IO 口数量是有限的，有时并满足不了我们的 设计需求，比如我们的 STC89C52 一共有 32 个 IO 口，但是我们为了控制更多的器件，就要使用一些外围的数字芯片，这种数字芯片由简单的输入逻辑来控制输出逻辑，如 74HC138， `三八译码器，就是把 3 种输入状态翻译成 8 种输出状态`

前面我们知道需要给 `LEDS6` 一个 `低电平 0`才能点亮LED，所以需要设置<span style="text-decoration: overline;color:red"> Y6</span>，看芯片手册真值表：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220926204759.jpg) 

 `74HC138` 特有3个使能输入端： `两个低有效（E1和E2==G2）和一个高有效（E3==G1）`。除非E1和E2置低且E3置高，否则74HC138将保持所有输出为高；3位二进制加权地址输入 `A0, A1和A2(即A,B,C)`；并当使能时，提供8个互斥的低有效输出 `Y0~Y7`

想让 <span style="text-decoration: overline;color:red"> Y6</span>为低电平，则需要设置：

- ADDR3(E3)：1
- ADDR2(A2)：1
- ADDR1(A1)：1
- ADDR0(A0)：0
- ENLED(E1+E2)：0

###  程序编写

```cpp
# include "reg52.h"

sbit LED2 = P0^0;	//LED2
sbit ADDR0 = P1^0;	//A0
sbit ADDR1 = P1^1;	//A1
sbit ADDR2 = P1^2;	//A2
sbit ADDR3 = P1^3;	//E3
sbit ENLED = P1^4;	//E1+E2


int main()
{
	ENLED = 0;
	ADDR0 = 0;
	ADDR1 = 1;
	ADDR2 = 1;
	ADDR3 = 1;
	
	LED2 = 0;	//点亮LED2
	while(1);
}
```

```cpp
//补充1
直接操作 P0 端口组可以控制 8个LED亮灭 ---> P0 = 0x00; 或 P0 = 0xFF;
//补充2
流水灯的话 ---> ~(0x01<<i) 不断左移即可循环0~8次(取反就是控制只有一个LED亮，不会递增)
也可以用左移函数 ---> _crol_(P0,1);//每次左移一位后面不会自动补0，循环次数大于LED数即可，需要先设置 P0 = 0xFE; 表示第一个LED亮的状态（头文件：# include "intrins.h"）
如果换成 ---> 0xFE<<i 的话会变成循环递增效果 也就是左移后跟在后面的LED还是处于亮的状态 (因为左移后后面补0,0相当于亮)
注意需要把for循环放 while(1){}里面，不要直接写 while(1);在main函数最下面
```

##  定时器

`时钟周期`：时钟周期 T 是时序中最小的时间单位，具体计算方法是： 

```cpp
//KST-51单片机开发板用的晶振是11.0952M
1/时钟源频率
时钟周期=1/11059200 秒
```

`机器周期`：我们的单片机完成一个操作的最短时间，在其标准架构下 `一个机器周期是 12 个时钟周期，也就是 12/11059200 秒`

定时器和计数器是单片机内部的同一个模块，通过配置 `SFR`（特殊功能寄存器）可以实现两种不同的功能，我们大多数情况下是使用定时器功能

```cpp
//注
SFR 不用去背因为太多了，可以在头文件看到
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220927133234.jpg) 

```cpp
//补充1
定时器内部有一个寄存器，我们让它开始计数后，这个寄存器的值每经过一个机器周期就会自动加 1，因此，我们可以把机器周期理解为定时器的计数周期。就像我们的钟表，每经过一秒，数字自动加 1，而这个定时器就是每过一个机器周期的时间，也就是 12/11059200 秒，数字自动加 1
//补充2
那定时器加到多少才会溢出呢？后面会讲到定时器有多种工作模式，分别使用不同的位宽（指使用多少个二进制位），假如是 16 位的定时器，也就是 2 个字节，最大值就是 65535，那么加到 65535 后，再加 1 就算溢出，如果有其他位数的话，道理是一样的，对于 51 单片机来说，溢出后，这个值会直接变成 0。从某一个初始值开始，经过确定的时间后溢出，这个过程就是定时的含义。 
```

标准的 51 单片机内部有 `T0 和 T1` 这两个定时器(有的还会增多几个)

{% note blue 'fas fa-fan' flat %} 需要记住 {% endnote %}

控制端分定时器1和定时器0，即 `TF1,TR1` 和 `TF0,TR0`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220927133632.jpg) 

外部中断1相关寄存器位：

- 其中 `IE1` 是外部中断标志位， 当外部中断发生后，这一位被 `自动置 1`，和定时器中断标志位 TF 相似，进入中断后会 `自动清零`，也可以软件清零
-  `IT1` 是设置外部中断类型的，如果为 `0`，表示 `低电平触发`，如果为 `1`，那么 P3.3 从高电平到低电平的 `下降沿` 发生才可以触发中断



```cpp
//注1
只要写到硬件置 1 或者清 0的，就是指一旦符合条件，单片机将自动完成的动作，只要写软件置 1 或者清 0 的，是指我们必须用程序去完成这个动作
//注2
寄存器分配表上不可位寻址和可位寻址区别？
比如 TCON 有一个位叫 TR1，我们可以在程序中直接进行 TR1 = 1 这样的操作。但对 TMOD 里的位比如(T1)M1 = 1 这样的操作就是错误的。我们要操作就必须一次操作这整个字节，也就是必须一次性对 TMOD 所有位操作，不能对其中某一位单独进行操作
```

```cpp
//定时器1过程讲解
TR1 = 1 以后，定时器值就会每经过一个机器周期自动加 1，当我们程序中写 TR1 = 0 以后，定时器就会停止加 1，其值会保持不变化。TF1，这个是一个标志位，他的作用是告诉我们定时器溢出了。比如我们的定时器设置成 16 位的模式，那么每经过一个机器周期，TL1 加 1 一次，当 TL1 加到 255 后，再加 1，TL1 变成 0，TH1 会加 1 一次，如此一直加到 TH1 和 TL1 都是 255（即 TH1 和 TL1 组成的 16 位整型数为 65535）以后，再加 1 一次，就会溢出了，TH1 和 TL1 同时都变为 0，只要一溢出，TF1 马上自动变成 1，告诉我们定时器溢出了，仅仅是提供给我们一个信号，让我们知道定时器溢出了，它不会对定时器是否继续运行产生任何影响。
```

工作模式的选择就由 `TMOD` 来控制

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220927135515.jpg)  

```cpp
//模式1和模式2(重点学)
●模式 1：是 THn 和 TLn 组成了一个 16 位的定时器，计数范围是 0～65535，溢出后，只要不对 THn 和 TLn 重新赋值，则从 0 开始计数
●模式 2：是 8 位自动重装载模式，只有 TLn 做加 1 计数，计数范围 0～255，THn 的值并不发生变化，而是保持原值，TLn 溢出后，TFn 就直接置 1 了，并且 THn 原先的值直接赋给 TLn，然后 TLn 从新赋值的这个数字开始计数。这个功能可以用来产生串口的通信波特率，我们讲串口的时候要用到，还有时间等需要精确的时间时用
```

以 `定时器0+模式 1` 的电路示意图讲解：

图上可以看出来， `下边部分电路是控制了上边部分`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220927141344.jpg) 

```cpp
OSC框：表示时钟频率，因为 1 个机器周期等于 12 个时钟周期，所以那个 d 就等于 12
//流程
● 在 GATE 位为 1 的情况下，经过一个非门变成 0，或门电路结果要想是 1 的话，那 INT0 即 P3.2 引脚
必须是 1 的情况下，这个时候定时器才会工作，而 INT0 引脚是 0 的情况下，定时器不工作，这就是 GATE 位的作用
● 当 GATE 位为 0 的时候，经过一个非门会变成 1，那么不管 INT0 引脚是什么电平，经过或门电路后都肯定是 1，定时器就会工作
● 要想让定时器工作，就是自动加 1，从图上看有两种方式，第一种方式是那个开关打到上边的箭头，就是 C/T = 0 的时候，一个机器周期 TL 就会加 1 一次，当开关打到下边的箭头，即 C/T =1 的时候，T0 引脚即 P3.4 引脚来一个脉冲，TL 就加 1 一次，这也就是计数器功能。
```

```cpp
//定时器0配置步骤
第一步：设置特殊功能寄存器 TMOD，配置好工作模式。 

第二步：设置计数寄存器 TH0 和 TL0 的初值。 

第三步：设置 TCON，通过 TR0 置 1 来让定时器开始计数。 

第四步：判断 TCON 寄存器的 TF0 位，监测定时器溢出情况。
```

```cpp
//定时器时间计算
我们的晶振是 11.0592M，时钟周期就是 1/11059200，机器周期是 12/11059200，假如要定时 20ms，就是 0.02 秒，要经过 x 个机器周期得到 0.02 秒，我们来算一下 x*12/11059200=0.02，得到 x= 18432
先给 TH0 和 TL0 一个初始值，让它们经过 18432 个机器周期后刚好达到 65536，也就是溢出，溢出后可以通过检测 TF0 的值得知，就刚好是 0.02 秒。那么初值 y = 65536 - 18432 = 47104，转成 16 进制
就是 0xB800，也就是 TH0 = 0xB8，TL0 = 0x00
//注1
如果初值直接给一个 0x0000，一直到 65536 溢出，定时器定时值最大也就是 71ms 左右，所以如果需要定时更加长时间可以通过重复定时计数的方法
//注2
如果开启了中断那个TH0,TL0 的计算需要加 "13" 做为补偿值，没中断可不加！！！
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96/QQ%E6%88%AA%E5%9B%BE20221011200836.jpg) 



```cpp
//有时候为了不影响其他位需要单独操作某4位
TMOD 是不能单独操作的，它高4位是定时器1的，低4位是定时器0的，所以需要开启定时器0而不影响定时器1则需要：TMOD &= 0xF0;TMOD |= 0x01
    第一步与 0xF0 做&运算后，TMOD 的高 4 位不变，低 4 位清零，变成了 xxxx 0000；然后再进行第二步与 0x01 进行|运算，那么高 7 位均不变，最低位变成 1 
```



###  程序编写

```cpp
# include "reg52.h"
# include "intrins.h"

sbit LED = P0 ^ 0;
sbit ADDR0 = P1 ^ 0;
sbit ADDR1 = P1 ^ 1;
sbit ADDR2 = P1 ^ 2;
sbit ADDR3 = P1 ^ 3;
sbit ENLED = P1 ^ 4;



int main()
{
    unsigned char cnt = 0;	//记录T0溢出次数
    ENLED = 0;
    ADDR0 = 0;
    ADDR1 = 1;
    ADDR2 = 1;
    ADDR3 = 1;
    TMOD = 0x01;	//模式1
    TH0 = 0xB8;	//高位
    TL0 = 0x00;	//低位
    TR0 = 1;	//启动定时器0
    while(1)
    {
        if(TF0 == 1)	//如果溢出
        {
            TF0 = 0;	//清除溢出标志位
            TH0 = 0xB8;	//重新赋值
            TL0 = 0x00;	//重新赋值
            cnt++;	//溢出次数+1
        }
        if(cnt >= 50)	//溢出50次相当于 50*20ms=1s
        {
            cnt = 0;	//溢出计数清0；
            LED = ~LED;	//LED状态取反
        }
    }
}
```

##  数码管

数码管分为 `共阳和共阴` 两种，共阴数码管就是 8 只 LED 小灯的阴极是连接在一起的， `阴极是公共端`，由 `阳极来控制单个小灯的亮灭`；同理，共阳数码管就是阳极接在一起。

原理图：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220927150416.jpg) 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220927150448.jpg) 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220926220312.jpg) 

<span style="color:red;">问</span>：为什么数码管上边有 2 个 com 呢？

<span style="color:# e80daf">一方面是 2 个可以起到对称的效果，刚好是 10 个引脚，另 外一个方面，公共端通过的电流较大，并联电路电流之和等于总电流，用2 个 com 可以把公共电流平均到 2 个引脚上去，降低单条线路承受的电流</span>

数码管的 8 个段，我们直接当成 8 个 LED 小灯来控制，那就是 `a、b、c、d、e、f、g、dp` 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbdUGHP.png)



###  静态数码管程序编写

```cpp
# include "reg52.h"
# include "intrins.h"

typedef unsigned char u8;
typedef unsigned int u16;
# define SMG_PORT P0	//宏定义数码管P0端口


sbit ADDR0 = P1 ^ 0;
sbit ADDR1 = P1 ^ 1;
sbit ADDR2 = P1 ^ 2;
sbit ADDR3 = P1 ^ 3;
sbit ENLED = P1 ^ 4;

u8 code gsmg[] =
{
    0xC0, 0xF9, 0xA4, 0xB0, 0x99, 0x92, 0x82, 0xF8,
    0x80, 0x90, 0x88, 0x83, 0xC6, 0xA1, 0x86, 0x8E
};	//数码管段码0~F

int main()
{
    u8 cnt = 0;	//记录T0溢出次数
    u8 sec = 0;	//记录经过的秒数
    ENLED = 0;
    ADDR0 = 0;	//配置数码管DS1
    ADDR1 = 0;
    ADDR2 = 0;
    ADDR3 = 1;
    TMOD = 0x01;	//模式1
    TH0 = 0xB8;	//高位
    TL0 = 0x00;	//低位
    TR0 = 1;	//启动定时器0
    while(1)
    {
        if(TF0 == 1)	//如果溢出
        {
            TF0 = 0;	//清除溢出标志位
            TH0 = 0xB8;	//重新赋值
            TL0 = 0x00;	//重新赋值
            cnt++;	//溢出次数+1
        }
        if(cnt >= 50)	//溢出50次相当于 50*20ms=1s
        {
            cnt = 0;	//溢出计数清0；
            SMG_PORT = gsmg[sec];
            sec++;
            if(sec >= 16)
            {
                sec = 0;
            }
        }
    }
}
```

###  动态数码管程序编写

多个数码管显示数字的时候，我们实际上是 `轮流点亮数码管`（一个时刻内只有一个数码管是亮的），利用人眼的 `视觉暂留` 现象（也叫余辉效应），就可以做到看起来是所有数码管都 同时亮了，这就是 `动态显示，也叫做动态扫描`

<span style="color:red;">问</span>：那么一个数码管需要点亮多长时间呢？要多长时间完成一次全部数码管的扫 描呢？

<span style="color:# e80daf">整体扫描时间=单个数码管点亮时间*数码管个数，10ms 以内</span>

只要 `刷新率大于 100Hz`，即 `刷新时间小于 10ms`，就可以做到 `无闪烁`，这也 就是我们的动态扫描的 `硬性指标`

```cpp
//数码管显示消隐 
鬼影的产生一般在数码管位选和段选产生的瞬态造成的
//解决方法1：
关闭段：在 switch(i)这句程序之前，加一句 P0=0xFF;这样就把数码管所有的段都关闭了，当把“ADDR”的值全部搞定后，再给 P0 赋对应的值即可
//解决方法2：
关闭位：在 switch(i)这句程序之前，加上一句 ENLED=1；等到把 ADDR2=0; ADDR1=0; ADDR0=0; i++; P0=LedBuff[0];这几条刷新程序全部写完后，再加上一句 ENLED=0；然后再进行 break 操作即可。
```

```cpp
//数码管抖动
解决方法是用中断
```

中断函数写好后， `每当满足中断条件而触发中断后，系统就会自动来调用中断函数`。比如我们上面这个程序，平时一直在主程序 while(1)的循环中执行，假如程序有 100 行，当执 行到 50 行时，定时器溢出了，那么单片机就会立刻跑到中断函数中执行中断程序，中断程序执行完毕后再自动返回到刚才的第 50 行处继续执行下面的程序，这样 `就保证了动态显示间隔是固定的 1ms，不会因为程序执行时间不一致的原因导致数码管显示的抖动了`

```cpp
//注
还有一点需要注意：程序应该尽量减少全局变量的使用，能用局部变量代替尽量代替
全局变量在其定义后所有函数都能用，但是静态局部变量只能在一个函数里面用。
```

已优化的main.c

```cpp
//功能计数只显示有效位，需要倒计时只需把sec=0改成999999,sec--即可
# include "reg52.h"
# include "intrins.h"

typedef unsigned char u8;
typedef unsigned int u16;
typedef unsigned long u32;
# define SMG_PORT P0	//宏定义数码管P0端口


sbit ADDR0 = P1 ^ 0;
sbit ADDR1 = P1 ^ 1;
sbit ADDR2 = P1 ^ 2;
sbit ADDR3 = P1 ^ 3;
sbit ENLED = P1 ^ 4;

u8 code gsmg[] =
{
    0xC0, 0xF9, 0xA4, 0xB0, 0x99, 0x92, 0x82, 0xF8,
    0x80, 0x90, 0x88, 0x83, 0xC6, 0xA1, 0x86, 0x8E
};	//数码管段码0~F

u8 LedBuff[6] =
{
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
};	//数码管显示缓冲区，初值 0xFF 确保启动时都不亮


u8 flag = 0;	//1s定时标志
u32 sec = 0;	//记录经过的秒数(注意用long，因为999999超出int类型范围)

int main()
{



    EA = 1;	//使能总中断
    ENLED = 0;
    ADDR3 = 1;	//只需改变ADDR0~2的值
    TMOD = 0x01;	//模式1
    TH0 = 0xFC;	//高位，定时1ms
    TL0 = 0x67;	//低位
    ET0 = 1;	//使能定时器0中断
    TR0 = 1;	//启动定时器0

    while(1)
    {
        if(flag == 1)	//判断1s定时标志
        {
            flag = 0;	//清除中断标志
            sec++;
            if(sec <= 0)
            {
                sec = 0;
            }
            LedBuff[0] = gsmg[sec % 10];	//个位
            LedBuff[1] = gsmg[sec / 10 % 10];	//十位
            LedBuff[2] = gsmg[sec / 100 % 10];	//百位
            LedBuff[3] = gsmg[sec / 1000 % 10];	//千位
            LedBuff[4] = gsmg[sec / 10000 % 10];	//万位
            LedBuff[5] = gsmg[sec / 100000 % 10];	//十万位
        }


    }
}

void InterruptTimer0() interrupt 1
{
    static u16 cnt = 0;	//记录T0中断次数(注意不要使用u8类型否则数码管不会亮)
	static u8 i = 0;	//动态扫描的索引
    TH0 = 0xFC;	//重新赋值
    TL0 = 0x67;	//重新赋值
    cnt++;	//中断计数加1
    if(cnt >= 1000)	//中断1000次相当于 1000*1ms=1s
    {
        cnt = 0;	//溢出计数清0；
        flag = 1;	//设置中断标志位
    }
	//只显示有效位
    if(sec <= 9)
    {
        LedBuff[1] = 0xFF;
        LedBuff[2] = 0xFF;
        LedBuff[3] = 0xFF;
        LedBuff[4] = 0xFF;
        LedBuff[5] = 0xFF;
    }
    else if(sec <= 99)
    {
        LedBuff[2] = 0xFF;
        LedBuff[3] = 0xFF;
        LedBuff[4] = 0xFF;
        LedBuff[5] = 0xFF;
    }
    else if(sec <= 999)
    {
        LedBuff[3] = 0xFF;
        LedBuff[4] = 0xFF;
        LedBuff[5] = 0xFF;
    }
    else if(sec <= 9999)
    {
        LedBuff[4] = 0xFF;
        LedBuff[5] = 0xFF;
    }
    else if(sec <= 99999)
    {
        LedBuff[5] = 0xFF;
    }
    //以下代码完成数码管动态扫描刷新
    SMG_PORT = 0xFF;	//显示消影
    switch(i)
    {
    case 0:
        ADDR2 = 0;
        ADDR1 = 0;
        ADDR0 = 0;
        i++;
        SMG_PORT = LedBuff[0];
        break;
    case 1:
        ADDR2 = 0;
        ADDR1 = 0;
        ADDR0 = 1;
        i++;
        SMG_PORT = LedBuff[1];
        break;
    case 2:
        ADDR2 = 0;
        ADDR1 = 1;
        ADDR0 = 0;
        i++;
        SMG_PORT = LedBuff[2];
        break;
    case 3:
        ADDR2 = 0;
        ADDR1 = 1;
        ADDR0 = 1;
        i++;
        SMG_PORT = LedBuff[3];
        break;
    case 4:
        ADDR2 = 1;
        ADDR1 = 0;
        ADDR0 = 0;
        i++;
        SMG_PORT = LedBuff[4];
        break;
    case 5:
        ADDR2 = 1;
        ADDR1 = 0;
        ADDR0 = 1;
        i = 0;
        SMG_PORT = LedBuff[5];
        break;
    default:
        break;
    }

}
```
 

```cpp
//除了上面方法显示有效位还可以这样
char j;	//这里用char，用unsigned char数码管亮一下就没了(具体原因是unsigned char 无负数，而我们第二个for循环j=0时再--就溢出了所以要注意数据类型！！！)
while(1)
    {
		
        if(flag == 1)	//判断1s定时标志
        {
            flag = 0;	//清除中断标志
            sec++;
            
            buf[0] = sec%10;	//个位
            buf[1] = sec/10%10;	//十位
            buf[2] = sec/100%10;	//百位
            buf[3] = sec/1000%10;	//千位
            buf[4] = sec/10000%10;	//万位
            buf[5] = sec/100000%10;	//十万位
			//从最高为开始，遇到0不显示，遇到非0退出循环
            for (j=5; j>=1; j--)
            {
                if (buf[j] == 0)
                    LedBuff[j] = 0xFF;
                else
                    break;
            }
			//将剩余的有效数字位如实转换
            for ( ; j>=0; j--)  //for()起始未对j操作，j即保持上个循环结束时的值
            {
                LedBuff[j] = gsmg[buf[j]];
            }
        }
    }
```

```cpp
//switch语句那部分可以拿下面的代替，更加简洁
//以下代码完成数码管动态扫描刷新

    SMG_PORT = 0xFF;	//显示消影
    P1 = (P1 & 0xF8) | i;	//0xF8:1111 1000，低3位对应ADDR0~ADDR2，跟i又是对应关系
	SMG_PORT = LedBuff[i];
	if(i>5)
        i=0;
	else
        i++;
    
```



##  中断

定时器是单片机模块的一个资源，确确实实存在的一个模块， 而中断，是单片机的一种 `运行机制`；标准 51 单片机中控制中断的寄存器有两个，一个是 `中断使能寄存器`，另一个是 `中断优先级寄存器`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220927224910.jpg) 

中断号：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220927231958.jpg) 

<span style="color:red;">问</span>：单片机又怎样找到这个中断函数呢？

<span style="color:# e80daf">靠的就是中断向量地址，所以 interrupt 后面中断函数编号的数字 x 就是根据中断向 量得出的，它的计算方法是 x*8+3=向量地址</span>

中断优先级有两种，一种是 `抢占优先级`，一种是 `固有优先级`

```cpp
●抢占优先级：优先级高的中断可以打断优先级低的中断的执行，从而形成嵌套。当然反过来，优先级低的中断是不能打断优先级高的中断的
●固有优先级(上图默认优先级那)：在中断优先级的编号中，一般都是数字越小优先级越高；这里的优先级与抢占优先级的一个不同点就是，它不具有抢占的特性，也就是说即使在低优先级中断执行过程中又发生了高优先级的中断，那么这个高优先级的中断也只能等到低优先级中断执行完后才能得到响应
```

<span style="color:red;">问</span>：既然不能抢占，那么这个优先级有什么用呢？

<span style="color:# e80daf">多个中断同时存在时的仲裁；比如出于某种原因我们暂时关闭了总 中断，即 EA=0，执行完一段代码后又重新使能了总中断，即 EA=1，那么在这段时间里就很 可能有多个中断都发生了，但因为总中断是关闭的，所以它们当时都得不到响应，而当总中 断再次使能后，它们就会在同时请求响应了，很明显，这时也必需有个先后顺序才行，这就 是非抢占优先级的作用了——如表上图中，谁优先级最高先响应谁，然后按编号排队，依次得到响应。</span>

抢占优先级寄存器：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221019095308.jpg)

```cpp
复位值是 0，当给某一位赋 1后，它的优先级就比别的优先级高了
```



##  点阵

原理图

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220928112159.jpg) 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220928112238.jpg) 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220926220312.jpg) 

```cpp
//注意
控制点阵左侧引脚的 74HC138
是原理图上的 U4，8 个引脚自上而下依次由 U4 的 Y0～Y7 输出来控制。
```

点亮原理跟点亮数码管一样，通过控制 `74HC138芯片` 输入端即可， `把一个 8*8点阵理解成是 8 个数码管`

```cpp
//取模软件的使用
打开软件-->新建图像-->选择8*8-->点击左侧模拟动画(放大镜放大)-->就可以填你喜欢的图案-->点击"参数设置"菜单里的"其他选项"设置参数-->选择"取模方式"这个菜单，点一下"C51 格式"-->在"点阵生成区"就有生成的数据了
//注1
取模软件是把黑色取为 1，白色取为 0，但我们点阵是 1 对应 LED 熄灭，0 对应 LED点亮，所以我们要选"修改图像"菜单里的"黑白反显图像"这个选项，再点击"基本操作"菜单里边的“保存图像”可以把我们设计好的图片进行保存
//注2
P0 口控制的是一行，所以用"横向取模"如果控制的是一列，就要选"纵向取模"。选中"字节倒序"这个选项，是因为上面原理图中左边是低位 DB0，右边是高位 DB7，所以是字节倒序
```

```cpp
//取模软件的原理
在这个图片里，黑色的一个格子表示一位二进制的 1，白色的一个格子表示一位二进制的 0。第一个字节是
0xFF，其实就是这个 8*8 图形的第一行，全黑就是 0xFF；第二个字节是 0x99，低位在左边，高位在右边，大家注意看，黑色的表示 1，白色的表示 0，就组成了 0x99 这个数值
```



###  程序编写

点亮点阵左上角一个LED

```cpp
# include <reg52.h>

sbit LED = P0^0;
sbit ADDR0 = P1^0;
sbit ADDR1 = P1^1;
sbit ADDR2 = P1^2;
sbit ADDR3 = P1^3;
sbit ENLED = P1^4;

void main()
{
    ENLED = 0;
    ADDR3 = 0;   //使能U4使之正常输出
    ADDR2 = 0;
    ADDR1 = 0;
    ADDR0 = 0;
    LED = 0;      //向P0.0写入0来点亮左上角的一个点
    while(1);     //程序停止在这里
}
```
 


点亮一行

```cpp
//直接操作 P0=0x00 即可
```

点亮全部

```cpp
# include <reg52.h>

sbit ADDR0 = P1^0;
sbit ADDR1 = P1^1;
sbit ADDR2 = P1^2;
sbit ADDR3 = P1^3;
sbit ENLED = P1^4;

void main()
{
    EA = 1;       //使能总中断
    ENLED = 0; 
    ADDR3 = 0;    //因为需要动态改变ADDR0-2的值，所以不需要再初始化了
    TMOD = 0x01;  //设置T0为模式1
    TH0  = 0xFC;  //为T0赋初值0xFC67，定时1ms
    TL0  = 0x67;
    ET0  = 1;     //使能T0中断
    TR0  = 1;     //启动T0
    while (1);    //程序停在这里，等待定时器中断
}
/* 定时器0中断服务函数 */
void InterruptTimer0() interrupt 1
{
    static unsigned char i = 0;  //动态扫描的索引

    TH0 = 0xFC;  //重新加载初值
    TL0 = 0x67;
    //以下代码完成LED点阵动态扫描刷新
    P0 = 0xFF;   //显示消隐
    switch (i)
    {
        case 0: ADDR2=0; ADDR1=0; ADDR0=0; i++; P0=0x00; break;
        case 1: ADDR2=0; ADDR1=0; ADDR0=1; i++; P0=0x00; break;
        case 2: ADDR2=0; ADDR1=1; ADDR0=0; i++; P0=0x00; break;
        case 3: ADDR2=0; ADDR1=1; ADDR0=1; i++; P0=0x00; break;
        case 4: ADDR2=1; ADDR1=0; ADDR0=0; i++; P0=0x00; break;
        case 5: ADDR2=1; ADDR1=0; ADDR0=1; i++; P0=0x00; break;
        case 6: ADDR2=1; ADDR1=1; ADDR0=0; i++; P0=0x00; break;
        case 7: ADDR2=1; ADDR1=1; ADDR0=1; i=0; P0=0x00; break;
        default: break;
    }
}
```
 

点亮爱心

```cpp
u8 code imga[] = {0xFF, 0x99, 0x00, 0x00, 0x00, 0x81, 0xC3, 0xE7};//全局变量爱心的模
//中间部分跟上面一样
//修改中断函数的switch即可
 switch(i)
    {
    case 0:
        ADDR2 = 0;
        ADDR1 = 0;
        ADDR0 = 0;
        i++;
        P0 = imga[0];
        break;
    case 1:
        ADDR2 = 0;
        ADDR1 = 0;
        ADDR0 = 1;
        i++;
        P0 = imga[1];
        break;
    case 2:
        ADDR2 = 0;
        ADDR1 = 1;
        ADDR0 = 0;
        i++;
        P0 = imga[2];
        break;
    case 3:
        ADDR2 = 0;
        ADDR1 = 1;
        ADDR0 = 1;
        i++;
        P0 = imga[3];
        break;
    case 4:
        ADDR2 = 1;
        ADDR1 = 0;
        ADDR0 = 0;
        i++;
        P0 = imga[4];
        break;
    case 5:
        ADDR2 = 1;
        ADDR1 = 0;
        ADDR0 = 1;
        i++;
        P0 = imga[5];
        break;
    case 6:
        ADDR2 = 1;
        ADDR1 = 1;
        ADDR0 = 0;
        i++;
        P0 = imga[6];
        break;
    case 7:
        ADDR2 = 1;
        ADDR1 = 1;
        ADDR0 = 1;
        i = 0;
        P0 = imga[7];
        break;
    default:
        break;
    }
```
 

向上移动动画(纵向)
```cpp
//向上移动是默认的，刷新索引是++的
# include <reg52.h>

sbit ADDR0 = P1^0;
sbit ADDR1 = P1^1;
sbit ADDR2 = P1^2;
sbit ADDR3 = P1^3;
sbit ENLED = P1^4;

unsigned char code image[] = {  //图片的字模表
    0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,
    0xC3,0xE7,0xE7,0xE7,0xE7,0xE7,0xC3,0xFF,
    0x99,0x00,0x00,0x00,0x81,0xC3,0xE7,0xFF,
    0x99,0x99,0x99,0x99,0x99,0x81,0xC3,0xFF,
    0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF
};

void main()
{
    EA = 1;       //使能总中断
    ENLED = 0;    //使能U4，选择LED点阵
    ADDR3 = 0;
    TMOD = 0x01;  //设置T0为模式1
    TH0  = 0xFC;  //为T0赋初值0xFC67，定时1ms
    TL0  = 0x67;
    ET0  = 1;     //使能T0中断
    TR0  = 1;     //启动T0
    while (1);
}
/* 定时器0中断服务函数 */
void InterruptTimer0() interrupt 1
{
    static unsigned char i = 0;  //动态扫描的索引
    static unsigned char tmr = 0;  //250ms软件定时器
    static unsigned char index = 0;  //图片刷新索引

    TH0 = 0xFC;  //重新加载初值
    TL0 = 0x67;
    //以下代码完成LED点阵动态扫描刷新
    P0 = 0xFF;   //显示消隐
    switch (i)
    {
        case 0: ADDR2=0; ADDR1=0; ADDR0=0; i++; P0=image[index+0]; break;
        case 1: ADDR2=0; ADDR1=0; ADDR0=1; i++; P0=image[index+1]; break;
        case 2: ADDR2=0; ADDR1=1; ADDR0=0; i++; P0=image[index+2]; break;
        case 3: ADDR2=0; ADDR1=1; ADDR0=1; i++; P0=image[index+3]; break;
        case 4: ADDR2=1; ADDR1=0; ADDR0=0; i++; P0=image[index+4]; break;
        case 5: ADDR2=1; ADDR1=0; ADDR0=1; i++; P0=image[index+5]; break;
        case 6: ADDR2=1; ADDR1=1; ADDR0=0; i++; P0=image[index+6]; break;
        case 7: ADDR2=1; ADDR1=1; ADDR0=1; i=0; P0=image[index+7]; break;
        default: break;
    }
    //以下代码完成每250ms改变一帧图像
    tmr++;
    if (tmr >= 250)  //达到250ms时改变一次图片索引
    {
        tmr = 0;
        index++;
        if (index >= 32)  //图片索引达到32后归零
        {
            index = 0;
        }
    }
}
```
 

向下移动(纵向)

```cpp
//向下移的话只需改数组顺序即可(即U放第一I放最后中间不用动)
//然后使图片刷新索引--即可
unsigned char code image[] = {  //图片的字模表
    0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,
    0x99,0x99,0x99,0x99,0x99,0x81,0xC3,0xFF,
    0x99,0x00,0x00,0x00,0x81,0xC3,0xE7,0xFF,
    0xC3,0xE7,0xE7,0xE7,0xE7,0xE7,0xC3,0xFF,
    0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF
};

 static unsigned char index = 31;  //图片刷新索引
 if (tmr >= 250)  //达到250ms时改变一次图片索引
    {
        tmr = 0;
        if (index == 0)  //图片索引31~0递减循环
            index = 31;
        else
            index--;	//注意这里要判断了再--防止内存溢出
    }
```

 

向左移动(横向)

```cpp
# include <reg52.h>

sbit ADDR0 = P1^0;
sbit ADDR1 = P1^1;
sbit ADDR2 = P1^2;
sbit ADDR3 = P1^3;
sbit ENLED = P1^4;

unsigned char code image[30][8] = {
    {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF},  //动画帧1
    {0xFF,0x7F,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F},  //动画帧2
    {0xFF,0x3F,0x7F,0x7F,0x7F,0x7F,0x7F,0x3F},  //动画帧3
    {0xFF,0x1F,0x3F,0x3F,0x3F,0x3F,0x3F,0x1F},  //动画帧4
    {0xFF,0x0F,0x9F,0x9F,0x9F,0x9F,0x9F,0x0F},  //动画帧5
    {0xFF,0x87,0xCF,0xCF,0xCF,0xCF,0xCF,0x87},  //动画帧6
    {0xFF,0xC3,0xE7,0xE7,0xE7,0xE7,0xE7,0xC3},  //动画帧7
    {0xFF,0xE1,0x73,0x73,0x73,0xF3,0xF3,0xE1},  //动画帧8
    {0xFF,0x70,0x39,0x39,0x39,0x79,0xF9,0xF0},  //动画帧9
    {0xFF,0x38,0x1C,0x1C,0x1C,0x3C,0x7C,0xF8},  //动画帧10
    {0xFF,0x9C,0x0E,0x0E,0x0E,0x1E,0x3E,0x7C},  //动画帧11
    {0xFF,0xCE,0x07,0x07,0x07,0x0F,0x1F,0x3E},  //动画帧12
    {0xFF,0x67,0x03,0x03,0x03,0x07,0x0F,0x9F},  //动画帧13
    {0xFF,0x33,0x01,0x01,0x01,0x03,0x87,0xCF},  //动画帧14
    {0xFF,0x99,0x00,0x00,0x00,0x81,0xC3,0xE7},  //动画帧15
    {0xFF,0xCC,0x80,0x80,0x80,0xC0,0xE1,0xF3},  //动画帧16
    {0xFF,0xE6,0xC0,0xC0,0xC0,0xE0,0xF0,0xF9},  //动画帧17
    {0xFF,0x73,0x60,0x60,0x60,0x70,0x78,0xFC},  //动画帧18
    {0xFF,0x39,0x30,0x30,0x30,0x38,0x3C,0x7E},  //动画帧19
    {0xFF,0x9C,0x98,0x98,0x98,0x9C,0x1E,0x3F},  //动画帧20
    {0xFF,0xCE,0xCC,0xCC,0xCC,0xCE,0x0F,0x1F},  //动画帧21
    {0xFF,0x67,0x66,0x66,0x66,0x67,0x07,0x0F},  //动画帧22
    {0xFF,0x33,0x33,0x33,0x33,0x33,0x03,0x87},  //动画帧23
    {0xFF,0x99,0x99,0x99,0x99,0x99,0x81,0xC3},  //动画帧24
    {0xFF,0xCC,0xCC,0xCC,0xCC,0xCC,0xC0,0xE1},  //动画帧25
    {0xFF,0xE6,0xE6,0xE6,0xE6,0xE6,0xE0,0xF0},  //动画帧26
    {0xFF,0xF3,0xF3,0xF3,0xF3,0xF3,0xF0,0xF8},  //动画帧27
    {0xFF,0xF9,0xF9,0xF9,0xF9,0xF9,0xF8,0xFC},  //动画帧28
    {0xFF,0xFC,0xFC,0xFC,0xFC,0xFC,0xFC,0xFE},  //动画帧29
    {0xFF,0xFE,0xFE,0xFE,0xFE,0xFE,0xFE,0xFF}   //动画帧30
};

void main()
{
    EA = 1;       //使能总中断
    ENLED = 0;    //使能U4，选择LED点阵
    ADDR3 = 0;
    TMOD = 0x01;  //设置T0为模式1
    TH0  = 0xFC;  //为T0赋初值0xFC67，定时1ms
    TL0  = 0x67;
    ET0  = 1;     //使能T0中断
    TR0  = 1;     //启动T0
    while (1);
}
/* 定时器0中断服务函数 */
void InterruptTimer0() interrupt 1
{
    static unsigned char i = 0;  //动态扫描的索引
    static unsigned char tmr = 0;  //250ms软件定时器
    static unsigned char index = 0;  //图片刷新索引

    TH0 = 0xFC;  //重新加载初值
    TL0 = 0x67;
    //以下代码完成LED点阵动态扫描刷新
    P0 = 0xFF;   //显示消隐
    switch (i)
    {
        case 0: ADDR2=0; ADDR1=0; ADDR0=0; i++; P0=image[index][0]; break;
        case 1: ADDR2=0; ADDR1=0; ADDR0=1; i++; P0=image[index][1]; break;
        case 2: ADDR2=0; ADDR1=1; ADDR0=0; i++; P0=image[index][2]; break;
        case 3: ADDR2=0; ADDR1=1; ADDR0=1; i++; P0=image[index][3]; break;
        case 4: ADDR2=1; ADDR1=0; ADDR0=0; i++; P0=image[index][4]; break;
        case 5: ADDR2=1; ADDR1=0; ADDR0=1; i++; P0=image[index][5]; break;
        case 6: ADDR2=1; ADDR1=1; ADDR0=0; i++; P0=image[index][6]; break;
        case 7: ADDR2=1; ADDR1=1; ADDR0=1; i=0; P0=image[index][7]; break;
        default: break;
    }
    //以下代码完成每250ms改变一帧图像
    tmr++;
    if (tmr >= 250)  //达到250ms时改变一次图片索引
    {
        tmr = 0;
        index++;
        if (index >= 30)  //图片索引达到30后归零
        {
            index = 0;
        }
    }
}
```

 

```cpp
//向右移动(横向)
代码跟左移一样，只需把模的数组生成时把 "字节倒序" 关闭了重新生成即可
```



```cpp
//0~9的模
unsigned char code image[11][8] = {
    {0xC3, 0x81, 0x99, 0x99, 0x99, 0x99, 0x81, 0xC3},  //数字0
    {0xEF, 0xE7, 0xE3, 0xE7, 0xE7, 0xE7, 0xE7, 0xC3},  //数字1
    {0xC3, 0x81, 0x9D, 0x87, 0xC3, 0xF9, 0xC1, 0x81},  //数字2
    {0xC3, 0x81, 0x9D, 0xC7, 0xC7, 0x9D, 0x81, 0xC3},  //数字3
    {0xCF, 0xC7, 0xC3, 0xC9, 0xC9, 0x81, 0xCF, 0xCF},  //数字4
    {0x81, 0xC1, 0xF9, 0xC3, 0x87, 0x9D, 0x81, 0xC3},  //数字5
    {0xC3, 0x81, 0xF9, 0xC1, 0x81, 0x99, 0x81, 0xC3},  //数字6
    {0x81, 0x81, 0x9F, 0xCF, 0xCF, 0xE7, 0xE7, 0xE7},  //数字7
    {0xC3, 0x81, 0x99, 0xC3, 0xC3, 0x99, 0x81, 0xC3},  //数字8
    {0xC3, 0x81, 0x99, 0x81, 0x83, 0x9F, 0x83, 0xC1},  //数字9
    {0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00},  //全亮
};
```



###  动画显示

这张图片共有 `40` 行， `每 8 行组成一张点阵图片`，并且每向上移动一行就出现了一张新图片，一共组成了 `32` 张图片(如果需要别的图案动画可以去刚刚的软件取 8*40 自己搞)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220928205655.png)

```cpp
//注
用一个变量 index 来代表每张图片的起始位置，每次从 index 起始向下数 8 行代表了当前的图片，250ms 改变一张图片，然后不停的动态刷新，这样图片就变成动画了。首先我们要对显示的图片进行横向取模，虽然这是 32 张图片，由于我们每一张图片都是和下一行连续的，所以实际的取模值只需要 40 个字节就可以完成
```

{% note blue 'fas fa-fan' flat %} 横向移动 {% endnote %}

```cpp
//方法1：把板子侧过来纵向取模
```

```cpp
//补充
我们在进行硬件电路设计的时候，也得充分考虑软件编程的方便性。因为我们的程序是用 P0 来控制点阵的整行，所以对于我们这样的电路设计，上下移动程序是比较好编写的。那如果我们设计电路的时候知道我们的图形要左右移动，那我们设计电路画板子的时候就要尽可能的把点阵横过来放，有利于我们编程方便，减少软件工作量
```

```cpp
//方法2 利用二维数组实现
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220928211407.png)

最上面的图形是横向连在一起的效果，而实际上我们要把它分解为  `30 个帧`， 每帧图片单独取模，取出来都是 `8` 个字节的数据，一共就是 `30*8` 个数据，我们用一个二维数组来存储它们(取模软件里还是选横向，字节倒序)

```cpp
每 250ms 更改一张图片，每 1ms在定时器中断里刷新单张图片的某一行
//记住！！！
不管是上下移动还是左右移动，大家要建立一种概念，就是我们是对一帧帧的图片的切换，这种切换带给我们的视觉效果就是一种动态的了
实际上大家也得理解成是 30 张图片的切换显示，而并非是真正的“移动”
```
<div class="video-bilibili">
  <iframe
    src="https://player.bilibili.com/player.html?aid=858502543&bvid=BV1UV4y1T7Qb&cid=845914367&page=1"
    scrolling="no"
    border="0"
    frameborder="no"
    framespacing="0"
    high_quality="1"
    danmaku="1"
    allowfullscreen="true"
  ></iframe>
</div>

##  按键

{% note blue 'fas fa-fan' flat %} 分析常见按键图 {% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220929134357.jpg) 

```cpp
//分析
4 条输入线接到单片机的 IO 口上，当按键 K1 按下时，+5V 通过电阻 R1 然后再通过按键 K1 最终进入 GND 形成一条通路，那么这条线路的全部电压都加到了 R1 这个电阻上，KeyIn1 这个引脚就是个低电平。当松开按键后，线路断开，就不会有电流通过，那么 KeyIn1和+5V 就应该是等电位，是一个高电平。我们就可以通过 KeyIn1 这个 IO 口的高低电平来判断是否有按键按下。
```

{% note blue 'fas fa-fan' flat %} 开发板矩阵按键 {% endnote %}

`使用 8 个 IO 口来实现了 16 个按键`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220929134107.jpg) 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220929142140.jpg) 

```cpp
//补充1
绝大多数情况下，按键是不会一直按住的，所以我们通常检测按键的动作并不是检测一 个固定的电平值，而是检测电平值的变化，即按键在按下和弹起这两种状态之间的变化，只要发生了这种变化就说明现在按键产生动作了
//补充2
我们可以把每次扫描到的按键状态都保存起来，当一次按键状态扫描进来的时候，与前一次的状态做比较，如果发现这两次按键状态不一致，就说明按键产生动作了。当上一次的状态是未按下而现在是按下，此时按键的动作就是"按下"；当上一次的状态是按下而现在是未按下，此时按键的动作就是"弹起"。显然，每次按键动作都会包含一次"按下"和一次"弹起"，我们可以任选其一来执行程序，或者两个都用
```

```cpp
//消抖有硬件消抖和软件消抖，硬件的成本和复杂度高，所以一般软件消抖,可在检测到按键状态后延时10ms再操作，但是用延时效率不高，所以采用中断检测的方法比较好，避免通过延时消抖占用单片机执行时间
//过程
启用一个定时中断，每 2ms 进一次中断，扫描一次按键状态并且存储起来，连续扫描 8 次后，看看这连续 8 次的按键状态是否是一致的。8 次按键的时间大概是 16ms，这 16ms 内如果按键状态一直保持一致，那就可以确定现在按键处于稳定的阶段，而非处于抖动的阶段；按键按下通常都会保持 100ms 以上，所以扫描一个按键完全够时间
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220929153615.jpg) 



###  程序编写

简单测试按键

```cpp
//KeyOut1 输出一个低电平，KeyOut2、KeyOut3、KeyOut4 都必须输出高电平，它们都输出高电平才能保证与它们相连的三路按键不会对这一路产生干扰
# include <reg52.h>
sbit ADDR0 = P1^0;
sbit ADDR1 = P1^1;
sbit ADDR2 = P1^2;
sbit ADDR3 = P1^3;
sbit ENLED = P1^4;
sbit LED9 = P0^7;
sbit LED8 = P0^6;
sbit LED7 = P0^5;
sbit LED6 = P0^4;
sbit KEY1 = P2^4;//4~7是输入
sbit KEY2 = P2^5;
sbit KEY3 = P2^6;
sbit KEY4 = P2^7;

void main()
{
    
    ENLED = 0;   //选择独立LED进行显示
    ADDR3 = 1;	//因为是点亮LED所以设置为1
    ADDR2 = 1;	
    ADDR1 = 1;
    ADDR0 = 0;
    P2 = 0xF7;   //P2.3置0，即KeyOut1输出低电平	1111 0111

	while (1)
    {
        //将按键扫描引脚的值传递到LED上
        LED9 = KEY1;  //按下时为0，对应的LED点亮
        LED8 = KEY2;
        LED7 = KEY3;
        LED6 = KEY4;
    }
}
```
 

按键扫描演示

```cpp
# include <reg52.h>

sbit ADDR0 = P1^0;
sbit ADDR1 = P1^1;
sbit ADDR2 = P1^2;
sbit ADDR3 = P1^3;
sbit ENLED = P1^4;
sbit KEY1 = P2^4;
sbit KEY2 = P2^5;
sbit KEY3 = P2^6;
sbit KEY4 = P2^7;

unsigned char code LedChar[] = {  //数码管显示字符转换表
    0xC0, 0xF9, 0xA4, 0xB0, 0x99, 0x92, 0x82, 0xF8,
    0x80, 0x90, 0x88, 0x83, 0xC6, 0xA1, 0x86, 0x8E
};

void main()
{
    bit backup = 1;  //定义一个位变量，保存前一次扫描的按键值
    unsigned char cnt = 0;  //定义一个计数变量，记录按键按下的次数
    
    ENLED = 0;   //选择数码管DS1进行显示
    ADDR3 = 1;
    ADDR2 = 0;
    ADDR1 = 0;
    ADDR0 = 0;
    P2 = 0xF7;   //P2.3置0，即KeyOut1输出低电平
    P0 = LedChar[cnt];   //显示按键次数初值

	while (1)
    {
        if (KEY4 != backup)   //当前值与前次值不相等说明此时按键有动作
        {
            if (backup == 0)  //如果前次值为0，则说明当前是由0变1，即按键弹起
            {
                cnt++;        //按键次数+1
                if (cnt >= 10)
                {             //只用1个数码管显示，所以加到10就清零重新开始
                    cnt = 0;
                }
                P0 = LedChar[cnt];  //计数值显示到数码管上
            }
            backup = KEY4;   //更新备份为当前值，以备进行下次比较
        }
    }
}
//试几次按键扫描演示程序，会发现有时候按下1次加了却不止1次，为什么出现这种问题？原因就是按键抖动
```
 

按键消抖

检测一个按键花费时间是： `2ms*8=16ms`

```cpp
# include <reg52.h>

sbit ADDR0 = P1^0;
sbit ADDR1 = P1^1;
sbit ADDR2 = P1^2;
sbit ADDR3 = P1^3;
sbit ENLED = P1^4;
sbit KEY1 = P2^4;
sbit KEY2 = P2^5;
sbit KEY3 = P2^6;
sbit KEY4 = P2^7;

unsigned char code LedChar[] = {  //数码管显示字符转换表
    0xC0, 0xF9, 0xA4, 0xB0, 0x99, 0x92, 0x82, 0xF8,
    0x80, 0x90, 0x88, 0x83, 0xC6, 0xA1, 0x86, 0x8E
};
bit KeySta = 1;  //当前按键状态

void main()
{
    bit backup = 1;  //按键值备份，保存前一次的扫描值，默认是1表示未按下
    unsigned char cnt = 0;  //按键计数，记录按键按下的次数
    
    EA = 1;       //使能总中断
    ENLED = 0;    //选择数码管DS1进行显示
    ADDR3 = 1;
    ADDR2 = 0;
    ADDR1 = 0;
    ADDR0 = 0;
    TMOD = 0x01;  //设置T0为模式1
    TH0  = 0xF8;  //为T0赋初值0xF8CD，定时2ms
    TL0  = 0xCD;
    ET0  = 1;     //使能T0中断
    TR0  = 1;     //启动T0
    P2 = 0xF7;    //P2.3置0，即KeyOut1输出低电平
    P0 = LedChar[cnt];   //显示按键次数初值
	
    while (1)
    {
        if (KeySta != backup)  //当前值与前次值不相等说明此时按键有动作
        {
            if (backup == 0)   //如果前次值为0，则说明当前是弹起动作
            {
                cnt++;         //按键次数+1
                if (cnt >= 10)
                {              //只用1个数码管显示，所以加到10就清零重新开始
                    cnt = 0;
                }
                P0 = LedChar[cnt];  //计数值显示到数码管上
            }
            backup = KeySta;   //更新备份为当前值，以备进行下次比较
        }
    }
}
/* T0中断服务函数，用于按键状态的扫描并消抖 */
void InterruptTimer0() interrupt 1
{
    static unsigned char keybuf = 0xFF;  //扫描缓冲区，保存一段时间内的扫描值
    
    TH0 = 0xF8;  //重新加载初值
    TL0 = 0xCD;
    keybuf = (keybuf<<1) | KEY4;  //缓冲区左移一位，并将当前扫描值移入最低位
    if (keybuf == 0x00)
    {   //连续8次扫描值都为0，即16ms内都只检测到按下状态时，可认为按键已按下
        KeySta = 0;
    }
    else if (keybuf == 0xFF)
    {   //连续8次扫描值都为1，即16ms内都只检测到弹起状态时，可认为按键已弹起
        KeySta = 1;
    }
    else
    {}  //其它情况则说明按键状态尚未稳定，则不对KeySta变量值进行更新
}
```

 

矩阵按键扫描

扫描间隔时间和消抖时间，因为现在有 4 个 KeyOut 输出，要中断 4 次才能完成一次全部按键的扫描，显然再采用 2ms 中断判断 8 次扫描值的方式时间就太长了 `(2*4*8=64ms)`，那么我们就改用 1ms 中断判断 4 次采样值( `即只判断低4位0000 xxxx` )，这样消抖时间还是 16ms`(1*4*4)`

```cpp
# include <reg52.h>

sbit ADDR0 = P1^0;
sbit ADDR1 = P1^1;
sbit ADDR2 = P1^2;
sbit ADDR3 = P1^3;
sbit ENLED = P1^4;
sbit KEY_IN_1  = P2^4;
sbit KEY_IN_2  = P2^5;
sbit KEY_IN_3  = P2^6;
sbit KEY_IN_4  = P2^7;
sbit KEY_OUT_1 = P2^3;
sbit KEY_OUT_2 = P2^2;
sbit KEY_OUT_3 = P2^1;
sbit KEY_OUT_4 = P2^0;

unsigned char code LedChar[] = {  //数码管显示字符转换表
    0xC0, 0xF9, 0xA4, 0xB0, 0x99, 0x92, 0x82, 0xF8,
    0x80, 0x90, 0x88, 0x83, 0xC6, 0xA1, 0x86, 0x8E
};
unsigned char KeySta[4][4] = {  //全部矩阵按键的当前状态
    {1, 1, 1, 1},  {1, 1, 1, 1},  {1, 1, 1, 1},  {1, 1, 1, 1}
};

void main()
{
    unsigned char i, j;
    unsigned char backup[4][4] = {  //按键值备份，保存前一次的值
        {1, 1, 1, 1},  {1, 1, 1, 1},  {1, 1, 1, 1},  {1, 1, 1, 1}
    };
    
    EA = 1;       //使能总中断
    ENLED = 0;    //选择数码管DS1进行显示
    ADDR3 = 1;
    ADDR2 = 0;
    ADDR1 = 0;
    ADDR0 = 0;
    TMOD = 0x01;  //设置T0为模式1
    TH0  = 0xFC;  //为T0赋初值0xFC67，定时1ms
    TL0  = 0x67;
    ET0  = 1;     //使能T0中断
    TR0  = 1;     //启动T0
    P0 = LedChar[0];   //默认显示0
	
    while (1)
    {
        for (i=0; i<4; i++)  //循环检测4*4的矩阵按键
        {
            for (j=0; j<4; j++)
            {
                if (backup[i][j] != KeySta[i][j])  //检测按键动作
                {
                    if (backup[i][j] != 0)         //按键按下时执行动作
                    {
                        P0 = LedChar[i*4+j];       //将编号显示到数码管
                    }
                    backup[i][j] = KeySta[i][j];   //更新前一次的备份值
                }
            }
        }
    }
}
/* T0中断服务函数，扫描矩阵按键状态并消抖 */
void InterruptTimer0() interrupt 1
{
    unsigned char i;
    static unsigned char keyout = 0;  //矩阵按键扫描输出索引
    static unsigned char keybuf[4][4] = {  //矩阵按键扫描缓冲区
        {0xFF, 0xFF, 0xFF, 0xFF},  {0xFF, 0xFF, 0xFF, 0xFF},
        {0xFF, 0xFF, 0xFF, 0xFF},  {0xFF, 0xFF, 0xFF, 0xFF}
    };
    
    TH0 = 0xFC;  //重新加载初值
    TL0 = 0x67;
    //将一行的4个按键值移入缓冲区
    keybuf[keyout][0] = (keybuf[keyout][0] << 1) | KEY_IN_1;
    keybuf[keyout][1] = (keybuf[keyout][1] << 1) | KEY_IN_2;
    keybuf[keyout][2] = (keybuf[keyout][2] << 1) | KEY_IN_3;
    keybuf[keyout][3] = (keybuf[keyout][3] << 1) | KEY_IN_4;
    //消抖后更新按键状态
    for (i=0; i<4; i++)  //每行4个按键，所以循环4次
    {
        if ((keybuf[keyout][i] & 0x0F) == 0x00)	//只判断低4位即可
        {   //连续4次扫描值为0，即4*4ms内都是按下状态时，可认为按键已稳定的按下
            KeySta[keyout][i] = 0;
        }
        else if ((keybuf[keyout][i] & 0x0F) == 0x0F)
        {   //连续4次扫描值为1，即4*4ms内都是弹起状态时，可认为按键已稳定的弹起
            KeySta[keyout][i] = 1;
        }
    }
    //执行下一次的扫描输出
    keyout++;                //输出索引递增
    keyout = keyout & 0x03;  //索引值加到4即归零
    switch (keyout)          //根据索引，释放当前输出引脚，拉低下次的输出引脚，P2口默认高电平，而且只要不去改变它它状态是不会改变所以不必重新设置
    {
        case 0: KEY_OUT_4 = 1; KEY_OUT_1 = 0; break;
        case 1: KEY_OUT_1 = 1; KEY_OUT_2 = 0; break;
        case 2: KEY_OUT_2 = 1; KEY_OUT_3 = 0; break;
        case 3: KEY_OUT_3 = 1; KEY_OUT_4 = 0; break;
        default: break;
    }
}

```
```cpp
中断函数中扫描 KeyIn 输入和切换 KeyOut 输出的顺序与前面提到的顺序不同，程序中我首先对所有的 KeyIn 输入做了扫描、消抖，然后才切换到了下一次的 KeyOut 输出，也就是说我们中断每次扫描的实际是上一次输出选择的那行按键，这是为什么呢？因为任何信号从输出到稳定都需要一个时间，有时它足够快而有时却不够快，这取决于具体的电路设计，我们这里的输入输出顺序的颠倒就是为了让输出信号有足够的时
间（一次中断间隔）来稳定，并有足够的时间来完成它对输入的影响，当你的按键电路中还有硬件电容消抖时，这样处理就是绝对必要的了
```
 

简单加法减法计算器 

```cpp
//上是加，下是减，不支持连续加减

# include <reg52.h>

sbit ADDR0 = P1^0;
sbit ADDR1 = P1^1;
sbit ADDR2 = P1^2;
sbit ADDR3 = P1^3;
sbit ENLED = P1^4;
sbit KEY_IN_1  = P2^4;
sbit KEY_IN_2  = P2^5;
sbit KEY_IN_3  = P2^6;
sbit KEY_IN_4  = P2^7;
sbit KEY_OUT_1 = P2^3;
sbit KEY_OUT_2 = P2^2;
sbit KEY_OUT_3 = P2^1;
sbit KEY_OUT_4 = P2^0;

unsigned char code LedChar[] = {  //数码管显示字符转换表
    0xC0, 0xF9, 0xA4, 0xB0, 0x99, 0x92, 0x82, 0xF8,
    0x80, 0x90, 0x88, 0x83, 0xC6, 0xA1, 0x86, 0x8E
};
unsigned char LedBuff[6] = {  //数码管显示缓冲区
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
};
unsigned char code KeyCodeMap[4][4] = { //矩阵按键编号到标准键盘键码的映射表
    { 0x31, 0x32, 0x33, 0x26 }, //数字键1、数字键2、数字键3、向上键
    { 0x34, 0x35, 0x36, 0x25 }, //数字键4、数字键5、数字键6、向左键
    { 0x37, 0x38, 0x39, 0x28 }, //数字键7、数字键8、数字键9、向下键
    { 0x30, 0x1B, 0x0D, 0x27 }  //数字键0、ESC键、  回车键、 向右键
};
unsigned char KeySta[4][4] = {  //全部矩阵按键的当前状态
    {1, 1, 1, 1},  {1, 1, 1, 1},  {1, 1, 1, 1},  {1, 1, 1, 1}
};

void KeyDriver();

void main()
{
    EA = 1;       //使能总中断
    ENLED = 0;    //选择数码管进行显示
    ADDR3 = 1;
    TMOD = 0x01;  //设置T0为模式1
    TH0  = 0xFC;  //为T0赋初值0xFC67，定时1ms
    TL0  = 0x67;
    ET0  = 1;     //使能T0中断
    TR0  = 1;     //启动T0
    LedBuff[0] = LedChar[0];  //上电显示0
	
    while (1)
    {
        KeyDriver();   //调用按键驱动函数
    }
}
/* 将一个有符号长整型的数字显示到数码管上，num-待显示数字 */
void ShowNumber(long num)
{
    signed char i;
    unsigned char sign;
    unsigned char buf[6];
    
    if (num < 0)  //首先提取并暂存符号位
    {
        sign = 1;
        num = -num;
    }
    else
    {
        sign = 0;
    }
    for (i=0; i<6; i++)   //把长整型数转换为6位十进制的数组
    {
        buf[i] = num % 10;
        num = num / 10;
    }
    for (i=5; i>=1; i--)  //从最高位起，遇到0转换为空格，遇到非0则退出循环
    {
        if (buf[i] == 0)
            LedBuff[i] = 0xFF;
        else
            break;
    }
    if (sign != 0)        //负数时，需在最前面添加负号
    {
        if (i < 5)        //当有效位数小于6位时添加负号，否则显示结果将是错的
        {
            LedBuff[i+1] = 0xBF;
        }
    }
    for ( ; i>=0; i--)    //剩余低位都如实转换为数码管显示字符
    {
        LedBuff[i] = LedChar[buf[i]];
    }
}
/* 按键动作函数，根据键码执行相应的操作，keycode-按键键码 */
void KeyAction(unsigned char keycode)
{
    static char oprt = 0;    //用于保存加减运算符
    static long result = 0;  //用于保存运算结果
    static long addend = 0;  //用于保存输入的加数
    
    if ((keycode>=0x30) && (keycode<=0x39))  //输入0-9的数字
    {
        addend = (addend*10)+(keycode-0x30); //整体十进制左移，新数字进入个位
        ShowNumber(addend);    //运算结果显示到数码管
    }
    else if (keycode == 0x26)  //向上键用作加号
    {
        oprt = 0;              //设置运算符变量
        result = addend;       //运算数存到结果中，准备进行加减
        addend = 0;            //清零运算数，准备接收下一个运算数
        ShowNumber(addend);    //刷新数码管显示
    }
    else if (keycode == 0x28)  //向下键用作减号
    {
        oprt = 1;              //设置运算符变量
        result = addend;       //运算数存到结果中，准备进行加减
        addend = 0;            //清零运算数，准备接收下一个运算数
        ShowNumber(addend);    //刷新数码管显示
    }
    else if (keycode == 0x0D)  //回车键，执行加减运算
    {
        if (oprt == 0)
        {
            result += addend;  //进行加法运算
        }
        else
        {
            result -= addend;  //进行减法运算
        }
        addend = 0;
        ShowNumber(result);    //运算结果显示到数码管
    }
    else if (keycode == 0x1B)  //Esc键，清零结果
    {
        addend = 0;
        result = 0;
        ShowNumber(addend);    //清零后的加数显示到数码管
    }
}
/* 按键驱动函数，检测按键动作，调度相应动作函数，需在主循环中调用 */
void KeyDriver()
{
    unsigned char i, j;
    static unsigned char backup[4][4] = {  //按键值备份，保存前一次的值
        {1, 1, 1, 1},  {1, 1, 1, 1},  {1, 1, 1, 1},  {1, 1, 1, 1}
    };
    
    for (i=0; i<4; i++)  //循环检测4*4的矩阵按键
    {
        for (j=0; j<4; j++)
        {
            if (backup[i][j] != KeySta[i][j])    //检测按键动作
            {
                if (backup[i][j] != 0)           //按键按下时执行动作
                {
                    KeyAction(KeyCodeMap[i][j]); //调用按键动作函数
                }
                backup[i][j] = KeySta[i][j];     //刷新前一次的备份值
            }
        }
    }
}
/* 按键扫描函数，需在定时中断中调用，推荐调用间隔1ms */
void KeyScan()
{
    unsigned char i;
    static unsigned char keyout = 0;   //矩阵按键扫描输出索引
    static unsigned char keybuf[4][4] = {  //矩阵按键扫描缓冲区
        {0xFF, 0xFF, 0xFF, 0xFF},  {0xFF, 0xFF, 0xFF, 0xFF},
        {0xFF, 0xFF, 0xFF, 0xFF},  {0xFF, 0xFF, 0xFF, 0xFF}
    };

    //将一行的4个按键值移入缓冲区
    keybuf[keyout][0] = (keybuf[keyout][0] << 1) | KEY_IN_1;
    keybuf[keyout][1] = (keybuf[keyout][1] << 1) | KEY_IN_2;
    keybuf[keyout][2] = (keybuf[keyout][2] << 1) | KEY_IN_3;
    keybuf[keyout][3] = (keybuf[keyout][3] << 1) | KEY_IN_4;
    //消抖后更新按键状态
    for (i=0; i<4; i++)  //每行4个按键，所以循环4次
    {
        if ((keybuf[keyout][i] & 0x0F) == 0x00)
        {   //连续4次扫描值为0，即4*4ms内都是按下状态时，可认为按键已稳定的按下
            KeySta[keyout][i] = 0;
        }
        else if ((keybuf[keyout][i] & 0x0F) == 0x0F)
        {   //连续4次扫描值为1，即4*4ms内都是弹起状态时，可认为按键已稳定的弹起
            KeySta[keyout][i] = 1;
        }
    }
    //执行下一次的扫描输出
    keyout++;                //输出索引递增
    keyout = keyout & 0x03;  //索引值加到4即归零
    switch (keyout)          //根据索引，释放当前输出引脚，拉低下次的输出引脚
    {
        case 0: KEY_OUT_4 = 1; KEY_OUT_1 = 0; break;
        case 1: KEY_OUT_1 = 1; KEY_OUT_2 = 0; break;
        case 2: KEY_OUT_2 = 1; KEY_OUT_3 = 0; break;
        case 3: KEY_OUT_3 = 1; KEY_OUT_4 = 0; break;
        default: break;
    }
}
/* 数码管动态扫描刷新函数，需在定时中断中调用 */
void LedScan()
{
    static unsigned char i = 0;  //动态扫描的索引
    
    P0 = 0xFF;   //显示消隐
    switch (i)
    {
        case 0: ADDR2=0; ADDR1=0; ADDR0=0; i++; P0=LedBuff[0]; break;
        case 1: ADDR2=0; ADDR1=0; ADDR0=1; i++; P0=LedBuff[1]; break;
        case 2: ADDR2=0; ADDR1=1; ADDR0=0; i++; P0=LedBuff[2]; break;
        case 3: ADDR2=0; ADDR1=1; ADDR0=1; i++; P0=LedBuff[3]; break;
        case 4: ADDR2=1; ADDR1=0; ADDR0=0; i++; P0=LedBuff[4]; break;
        case 5: ADDR2=1; ADDR1=0; ADDR0=1; i=0; P0=LedBuff[5]; break;
        default: break;
    }
}
/* T0中断服务函数，用于数码管显示扫描与按键扫描 */
void InterruptTimer0() interrupt 1
{
    TH0 = 0xFC;  //重新加载初值
    TL0 = 0x67;
    LedScan();   //调用数码管显示扫描函数
    KeyScan();   //调用按键扫描函数
}

```
 

##  电机

步进电机属于控制类电机，它是 `将脉冲信号转换成一个转动角度` 的电机，在非 超载的情况下，电机的转速、停止的位置只取决于 `脉冲信号的频率和脉冲数`

步进电机又分为 `反应式、永磁式和混合式` 三种

```cpp
●反应式步进电机：结构简单成本低，但是动态性能差、效率低、发热大、可靠性难以保证，所以现在基本已经被淘汰了。 

●永磁式步进电机：动态性能好、输出力矩较大，但误差相对来说大一些，因其价格低而广泛应用于消费性产品。 

●混合式步进电机：综合了反应式和永磁式的优点，力矩大、动态性能好、步距角小，精度高，但是结构相对来说复杂，价格也相对高，主要应用于工业
```

```cpp
//28BYJ-48 型号具体含义(4 相永磁式减速步进电机)
28——步进电机的有效最大外径是 28 毫米 
B——表示是步进电机 
Y——表示是永磁式 
J——表示是减速型 
48——表示四相八拍
```

```cpp
步进电机的单四拍模式——单相绕组通电四节拍
八拍模式
双四拍(4 相步进电机的最佳工作模式)

步进电机一共有 5 根引线，其中红色的是公共端，连接到 5V 电源，接下来的橙、黄、粉、蓝就对应了 A、B、C、D 相；如果要导通 A 相绕组，就只需将橙色线接地即可，B 相则黄色接地，依此类推
```

绕组控制顺序表：(必须按顺序不能跳过哪步否则电机不会被磁力吸附)

`橙、黄、粉、蓝 --- A、B、C、D`

`A --> AB --> B --> BC --> C --> CD --> D --> DA` 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220930225257.jpg) 

原理图：

板子需要把 `跳线帽` 跳到左边那列(J13~J16)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220930225508.jpg) 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220926220312.jpg) 

<span style="color:red;">问</span>：如果大家既想让显示部分正常工作，又想让电机工作该怎么办呢？

<span style="color:# e80daf">跳线帽保持在右侧，用杜邦线把步进电机的控制引脚 （即左侧的排针）连接到其它的暂不使用的单片机 IO 上即可</span>

```cpp
单片机的 IO 口可以直接输出 0V 和 5V 的电压，但是电流驱动能力，也就是带载能力非常有限，所以我们在每相的控制线上都增加一个三极管来提高驱动能力。由图中可以看出，若要使 A 相导通，则必须是 Q2 导通，此时 A 相也就是橙色线就相当于接地了，于是 A 相绕组导通，此时单片机 P1 口低 4 位应输出 0b1110，即 0xE；如要 A、B 相同时导通，那么就是 Q2、Q3 导通，P1 口低 4 位应输出 0b1100，即 0xC，依此类推，我们可以得到下面的八拍节拍的 IO 控制代码数组： 
unsigned char code BeatCode[8] = { 0xE, 0xC, 0xD, 0x9, 0xB, 0x3, 0x7, 0x6 }; 
```

```cpp
●启动频率
就是步进电机在空载情况下能够正常启动的最高脉冲频率，如果脉冲频率高于该值，电机就不能正常启动
//计算公式
单位是 P.P.S，即每秒脉冲数，这里的意思就是说：电机保证在你每秒给出 550 个步进脉冲的情况下，可以正常启动。那么换算成单节拍持续时间就是 1s/550=1.8ms，为了让电机能够启动，我们控制节拍刷新时间大于 1.8ms 就可以了(脉冲频率为 550 HZ，就是一秒种发出550个脉冲，每个脉冲占用的时间就是脉冲周期;计算公式：脉冲周期 = 1 秒 / 脉冲频率)
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220930231807.jpg) 

<span style="color:red;">问</span>：八拍模式时，步进电机转过一圈是需要 64 个节拍，而我们程序中是每个节拍持 续 2ms，那么转一圈就应该是 128ms，即 1 秒钟转 7 圈多，可怎么看上去它好像是 7 秒多才 转了一圈呢？

<span style="color:# e80daf">原因在于 "减速" 上，位于最中心的那个白色小齿轮才是步进电机 的转子输出，64 个节拍只是让这个小齿轮转了一圈，然后它带动那个浅蓝色的大齿轮，这就 是一级减速，每 2 个齿轮都构成一级减速，一共就有了 4 级减速；电机参数表中的减速比是1:64，转子转 64 圈，最终输出轴才会 转一圈，也就是需要 `64*64=4096` 个节拍输出轴才转过一圈，`2ms*4096=8192ms`，8 秒多才转 一圈；4096 个节拍转动一圈，那么一个节拍转动的 角度——步进角度就是 `360/4096`，看一下表中的步进角度参数 `5.625/64`，算一下就知道这两个值是相等的</span>

<span style="color:red;">问</span>：厂家的参数为什么会有误差呢？

<span style="color:# e80daf">28BYJ-48 最初的设计目的是用来控制空调的扇叶的，扇叶的活动范围是不会超过180度的在这种应用场合下，厂商给出一个近似的整数减速比 1:64 已经足够精确了，这也是合情合理的；我们不一定是要用它来驱动空调扇叶，我们可 以让它转动很多圈来干别的</span>





###  程序编写

这里只用到了 `P1` 中的低4位，养成好习惯把整个 `P1` 先赋给一个变量，然后不影响到其他位的状态

步进电机基础演示

```cpp
# include <reg52.h>

unsigned char code BeatCode[8] = {  //步进电机节拍对应的IO控制代码
    0xE, 0xC, 0xD, 0x9, 0xB, 0x3, 0x7, 0x6
};

void delay();

void main()
{
    unsigned char tmp;  //定义一个临时变量
    unsigned char index = 0;  //定义节拍输出索引
    
	while (1)
    {
        tmp = P1;                    //用tmp把P1口当前值暂存
        tmp = tmp & 0xF0;            //用&操作清零低4位(0xF0:1111 0000)
        tmp = tmp | BeatCode[index]; //用|操作把节拍代码写到低4位
        P1  = tmp;                   //把低4位的节拍代码和高4位的原值送回P1
        index++;                     //节拍输出索引递增
        index = index & 0x07;        //用&操作实现到8归零
        delay();                     //延时2ms，即2ms执行一拍
    }
}
/* 软件延时函数，延时约2ms */
void delay()
{
    unsigned int i = 200;
	
    while (i--);
}
```
 

中断转动任意角度

- 运行后会发现角度并不精确，这是因为真实准确的减速比并不是这个值 `1:64`，而是 `1:63.684`，所以把程序里 `4096 改成4076` 会发现误差小很多了 
- `StartMotor 函数`中对 `EA` 的两次操作是因为：STC89C52 单片机是 `8 `位单片机(即按一个字节进行的)，要操作 `多个字节`（不论是读还是写）就必须分多次进行了； `beats 这个变量是 unsigned long 型，它要占用 4 个字节，那么对它的赋值最少也要分 4 次才能完成`；<span style="color:# e80daf">所以执行前先关闭了中断，而等它执行完后，才又重新打开了中断。在它执行过程中单片机是不 会响应中断的，即中断函数 InterruptTimer0 不会被执行，即使这时候定时器溢出了，中断发生了，也只能等待 EA 重新置 1 后，才能得到响应，中断函数 InterruptTimer0 才会被执行</span>

```cpp
# include <reg52.h>

unsigned long beats = 0;  //电机转动节拍总数

void StartMotor(unsigned long angle);

void main()
{
    EA = 1;       //使能总中断
    TMOD = 0x01;  //设置T0为模式1
    TH0  = 0xF8;  //为T0赋初值0xF8CD，定时2ms
    TL0  = 0xCD;
    ET0  = 1;     //使能T0中断
    TR0  = 1;     //启动T0
    
    StartMotor(360*2+180);  //控制电机转动2圈半
	while (1);
}
/* 步进电机启动函数，angle-需转过的角度 */
void StartMotor(unsigned long angle)
{
    //在计算前关闭中断，完成后再打开，以避免中断打断计算过程而造成错误
    EA = 0;
    beats = (angle * 4076) / 360; //实测为4076拍转动一圈
    EA = 1;
}
/* T0中断服务函数，用于驱动步进电机旋转 */
void InterruptTimer0() interrupt 1
{
    unsigned char tmp;  //临时变量
    static unsigned char index = 0;  //节拍输出索引
    unsigned char code BeatCode[8] = {  //步进电机节拍对应的IO控制代码
        0xE, 0xC, 0xD, 0x9, 0xB, 0x3, 0x7, 0x6
    };
    
    TH0 = 0xF8;  //重新加载初值
    TL0 = 0xCD;
    if (beats != 0)  //节拍数不为0则产生一个驱动节拍
    {
        tmp = P1;                    //用tmp把P1口当前值暂存
        tmp = tmp & 0xF0;            //用&操作清零低4位
        tmp = tmp | BeatCode[index]; //用|操作把节拍代码写到低4位
        P1  = tmp;                   //把低4位的节拍代码和高4位的原值送回P1
        index++;                     //节拍输出索引递增
        index = index & 0x07;        //用&操作实现到8归零
        beats--;                     //总节拍数-1
    }
    else  //节拍数为0则关闭电机所有的相
    {
        P1 = P1 | 0x0F;
    }
}

```

 

按键控制电机

- `1~9`键：是转动圈数，`上下`键：正转和反转，`左右`键：+90度和-90度
- `中断函数用一个静态bit变量实现二分频，即2ms定时，用于控制电机` 

```cpp
# include <reg52.h>

sbit KEY_IN_1  = P2^4;
sbit KEY_IN_2  = P2^5;
sbit KEY_IN_3  = P2^6;
sbit KEY_IN_4  = P2^7;
sbit KEY_OUT_1 = P2^3;
sbit KEY_OUT_2 = P2^2;
sbit KEY_OUT_3 = P2^1;
sbit KEY_OUT_4 = P2^0;

unsigned char code KeyCodeMap[4][4] = { //矩阵按键编号到标准键盘键码的映射表
    { 0x31, 0x32, 0x33, 0x26 }, //数字键1、数字键2、数字键3、向上键
    { 0x34, 0x35, 0x36, 0x25 }, //数字键4、数字键5、数字键6、向左键
    { 0x37, 0x38, 0x39, 0x28 }, //数字键7、数字键8、数字键9、向下键
    { 0x30, 0x1B, 0x0D, 0x27 }  //数字键0、ESC键、  回车键、 向右键
};
unsigned char KeySta[4][4] = {  //全部矩阵按键的当前状态
    {1, 1, 1, 1},  {1, 1, 1, 1},  {1, 1, 1, 1},  {1, 1, 1, 1}
};
signed long beats = 0;  //电机转动节拍总数

void KeyDriver();

void main()
{
    EA = 1;       //使能总中断
    TMOD = 0x01;  //设置T0为模式1
    TH0  = 0xFC;  //为T0赋初值0xFC67，定时1ms
    TL0  = 0x67;
    ET0  = 1;     //使能T0中断
    TR0  = 1;     //启动T0
	
    while (1)
    {
        KeyDriver();   //调用按键驱动函数
    }
}
/* 步进电机启动函数，angle-需转过的角度 */
void StartMotor(signed long angle)
{
    //在计算前关闭中断，完成后再打开，以避免中断打断计算过程而造成错误
    EA = 0;
    beats = (angle * 4076) / 360; //实测为4076拍转动一圈
    EA = 1;
}
/* 步进电机停止函数 */
void StopMotor()
{
    EA = 0;
    beats = 0;
    EA = 1;
}
/* 按键动作函数，根据键码执行相应的操作，keycode-按键键码 */
void KeyAction(unsigned char keycode)
{
    static bit dirMotor = 0;  //电机转动方向
    
    if ((keycode>=0x30) && (keycode<=0x39))  //控制电机转动1-9圈
    {
        if (dirMotor == 0)
            StartMotor(360*(int)(keycode-0x30));
        else
            StartMotor(-360*(int)(keycode-0x30));
    }
    else if (keycode == 0x26)  //向上键，控制转动方向为正转
    {
        dirMotor = 0;
    }
    else if (keycode == 0x28)  //向下键，控制转动方向为反转
    {
        dirMotor = 1;
    }
    else if (keycode == 0x25)  //向左键，固定正转90度
    {
        StartMotor(90);
    }
    else if (keycode == 0x27)  //向右键，固定反转90度
    {
        StartMotor(-90);
    }
    else if (keycode == 0x1B)  //Esc键，停止转动
    {
        StopMotor();
    }
}
/* 按键驱动函数，检测按键动作，调度相应动作函数，需在主循环中调用 */
void KeyDriver()
{
    unsigned char i, j;
    static unsigned char backup[4][4] = {  //按键值备份，保存前一次的值
        {1, 1, 1, 1},  {1, 1, 1, 1},  {1, 1, 1, 1},  {1, 1, 1, 1}
    };
    
    for (i=0; i<4; i++)  //循环检测4*4的矩阵按键
    {
        for (j=0; j<4; j++)
        {
            if (backup[i][j] != KeySta[i][j])    //检测按键动作
            {
                if (backup[i][j] != 0)           //按键按下时执行动作
                {
                    KeyAction(KeyCodeMap[i][j]); //调用按键动作函数
                }
                backup[i][j] = KeySta[i][j];     //刷新前一次的备份值
            }
        }
    }
}
/* 按键扫描函数，需在定时中断中调用，推荐调用间隔1ms */
void KeyScan()
{
    unsigned char i;
    static unsigned char keyout = 0;   //矩阵按键扫描输出索引
    static unsigned char keybuf[4][4] = {  //矩阵按键扫描缓冲区
        {0xFF, 0xFF, 0xFF, 0xFF},  {0xFF, 0xFF, 0xFF, 0xFF},
        {0xFF, 0xFF, 0xFF, 0xFF},  {0xFF, 0xFF, 0xFF, 0xFF}
    };

    //将一行的4个按键值移入缓冲区
    keybuf[keyout][0] = (keybuf[keyout][0] << 1) | KEY_IN_1;
    keybuf[keyout][1] = (keybuf[keyout][1] << 1) | KEY_IN_2;
    keybuf[keyout][2] = (keybuf[keyout][2] << 1) | KEY_IN_3;
    keybuf[keyout][3] = (keybuf[keyout][3] << 1) | KEY_IN_4;
    //消抖后更新按键状态
    for (i=0; i<4; i++)  //每行4个按键，所以循环4次
    {
        if ((keybuf[keyout][i] & 0x0F) == 0x00)
        {   //连续4次扫描值为0，即4*4ms内都是按下状态时，可认为按键已稳定的按下
            KeySta[keyout][i] = 0;
        }
        else if ((keybuf[keyout][i] & 0x0F) == 0x0F)
        {   //连续4次扫描值为1，即4*4ms内都是弹起状态时，可认为按键已稳定的弹起
            KeySta[keyout][i] = 1;
        }
    }
    //执行下一次的扫描输出
    keyout++;                //输出索引递增
    keyout = keyout & 0x03;  //索引值加到4即归零
    switch (keyout)          //根据索引，释放当前输出引脚，拉低下次的输出引脚
    {
        case 0: KEY_OUT_4 = 1; KEY_OUT_1 = 0; break;
        case 1: KEY_OUT_1 = 1; KEY_OUT_2 = 0; break;
        case 2: KEY_OUT_2 = 1; KEY_OUT_3 = 0; break;
        case 3: KEY_OUT_3 = 1; KEY_OUT_4 = 0; break;
        default: break;
    }
}
/* 电机转动控制函数 */
void TurnMotor()
{
    unsigned char tmp;  //临时变量
    static unsigned char index = 0;  //节拍输出索引
    unsigned char code BeatCode[8] = {  //步进电机节拍对应的IO控制代码
        0xE, 0xC, 0xD, 0x9, 0xB, 0x3, 0x7, 0x6
    };
    
    if (beats != 0)  //节拍数不为0则产生一个驱动节拍
    {
        if (beats > 0)  //节拍数大于0时正转
        {
            index++;               //正转时节拍输出索引递增
            index = index & 0x07;  //用&操作实现到8归零
            beats--;               //正转时节拍计数递减
        }
        else            //节拍数小于0时反转
        {
            index--;               //反转时节拍输出索引递减
            index = index & 0x07;  //用&操作同样可以实现到-1时归7
            beats++;               //反转时节拍计数递增
        }
        tmp = P1;                    //用tmp把P1口当前值暂存
        tmp = tmp & 0xF0;            //用&操作清零低4位
        tmp = tmp | BeatCode[index]; //用|操作把节拍代码写到低4位
        P1  = tmp;                   //把低4位的节拍代码和高4位的原值送回P1
    }
    else  //节拍数为0则关闭电机所有的相
    {
        P1 = P1 | 0x0F;
    }
}
/* T0中断服务函数，用于按键扫描与电机转动控制 */
void InterruptTimer0() interrupt 1
{
    static bit div = 0;
    
    TH0 = 0xFC;  //重新加载初值
    TL0 = 0x67;
    KeyScan();   //执行按键扫描
    //用一个静态bit变量实现二分频，即2ms定时，用于控制电机
    div = ~div;
    if (div == 1)
    {
        TurnMotor();
    }
}
```

 

##  蜂鸣器

原理图：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221001102625.jpg) 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221001103851.jpg) 

```cpp
//分析
蜂鸣器电流依然相对较大，因此需要用三极管驱动，并且加了一个 100 欧的电阻作为限流电阻。此外还加了一个 D4 二极管，这个二极管叫做续流二极管。我们的蜂鸣器是感性器件，当三极管导通给蜂鸣器供电时，就会有导通电流流过蜂鸣器。而我们知道，电感的一个特点就是电流不能突变，导通时电流是逐渐加大的，这点没有问题，但当关断时，经“电源-三极管-蜂鸣器-地”这条回路就截断了，过不了任何电流了，那么储存的电流往哪儿去呢，就是经过这个 D4 和蜂鸣器自身的环路来消耗掉了，从而就避免了关断时由于电感电流造成的反向冲击
```

```cpp
//重装载计算
reload = 65536 - (11059200/12)/(frequ*2);  //由给定频率计算定时器重载值
T0RH = (unsigned char)(reload >> 8);  //16位重载值分解为高低两个字节,因为51单片机是8位的需要分两次写入
T0RL = (unsigned char)reload;
```



###  程序编写

蜂鸣器演示

```cpp
# include <reg52.h>

sbit BUZZ = P1^6;  //蜂鸣器控制引脚
unsigned char T0RH = 0;  //T0重载值的高字节
unsigned char T0RL = 0;  //T0重载值的低字节

void OpenBuzz(unsigned int frequ);
void StopBuzz();

void main()
{
    unsigned int i;
    
    TMOD = 0x01;  //配置T0工作在模式1，但先不启动
    EA = 1;       //使能全局中断
    
    while (1)
    {
        OpenBuzz(4000);          //以4KHz的频率启动蜂鸣器
        for (i=0; i<40000; i++);
        StopBuzz();              //停止蜂鸣器
        for (i=0; i<40000; i++);
        OpenBuzz(1000);          //以1KHz的频率启动蜂鸣器
        for (i=0; i<40000; i++);
        StopBuzz();              //停止蜂鸣器
        for (i=0; i<40000; i++);
    }
}
/* 蜂鸣器启动函数，frequ-工作频率 */
void OpenBuzz(unsigned int frequ)
{
    unsigned int reload;    //计算所需的定时器重载值
    
    reload = 65536 - (11059200/12)/(frequ*2);  //由给定频率计算定时器重载值
    T0RH = (unsigned char)(reload >> 8);  //16位重载值分解为高低两个字节
    T0RL = (unsigned char)reload;
    TH0  = 0xFF;  //设定一个接近溢出的初值，以使定时器马上投入工作
    TL0  = 0xFE;
    ET0  = 1;     //使能T0中断
    TR0  = 1;     //启动T0
}
/* 蜂鸣器停止函数 */
void StopBuzz()
{
    ET0 = 0;   //禁用T0中断
    TR0 = 0;   //停止T0
}
/* T0中断服务函数，用于控制蜂鸣器发声 */
void InterruptTimer0() interrupt 1
{
    TH0 = T0RH;   //重新加载重载值
    TL0 = T0RL;
    BUZZ = ~BUZZ; //反转蜂鸣器控制电平
}

```

 

门铃

```cpp
# include "reg52.h"

typedef unsigned int u16;
typedef unsigned char u8;

sbit beep = P1 ^ 6;
u8 ding, dong, flag, stop;
u16 n;
void delay(u16 i)
{
    while(i--);
}
void time0init()      //定时器0初始化
{
    TMOD = 0X01;   //定时器0 方式1
    TH0 = 0Xff;
    TL0 = 0X06; //定时250us
    //    TR0=1;
    EA = 1;
    ET0 = 1;
	TR0 = 1;  //打开定时器0
}
void biaohaoinit()       //各个标号初始化
{
    ding = 0;      //叮声音  计数标志
    dong = 0;      //咚声音  计数标志
    n = 0;      //定时0.5s标志
    flag = 0;
    stop = 0;     //结束标志
}
void main()
{
    time0init();
    biaohaoinit();
    while(1)
    {
        
    }
}
void time0() interrupt 1
{
    n++;
    TH0 = 0Xff;
    TL0 = 0X06; //250us
    if(n == 2000)      //定时0.5s  叮响0.5秒，咚响0.5秒
    {
        n = 0;
        if(flag == 0)
        {
            flag = ~flag;
        }
        else
        {
            flag = 0;
            stop = 1;
            //TR0 = 0;    //关闭定时器0
        }
    }
    if(flag == 0)
    {
        //通过改变定时计数时间可以改变门铃的声音
        ding++;              //叮
        if(ding == 1)
        {
            ding = 0;
            beep = ~beep;
        }
    }
    else
    {
        dong++;
        if(dong == 2)        //咚
        {
            dong = 0;
            beep = ~beep;
        }
    }
}

```
 

##  综合实例-秒表

- `回车键`：开启/暂停；`Esc`：清0

 
```cpp
# include <reg52.h>

sbit ADDR3 = P1^3;
sbit ENLED = P1^4;
sbit KEY1 = P2^4;
sbit KEY2 = P2^5;
sbit KEY3 = P2^6;
sbit KEY4 = P2^7;

unsigned char code LedChar[] = {  //数码管显示字符转换表
    0xC0, 0xF9, 0xA4, 0xB0, 0x99, 0x92, 0x82, 0xF8,
    0x80, 0x90, 0x88, 0x83, 0xC6, 0xA1, 0x86, 0x8E
};
unsigned char LedBuff[6] = {  //数码管显示缓冲区
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
};
unsigned char KeySta[4] = {  //按键当前状态
    1, 1, 1, 1
};

bit StopwatchRunning = 0;  //秒表运行标志
bit StopwatchRefresh = 1;  //秒表计数刷新标志
unsigned char DecimalPart = 0;  //秒表的小数部分
unsigned int  IntegerPart = 0;  //秒表的整数部分
unsigned char T0RH = 0;  //T0重载值的高字节
unsigned char T0RL = 0;  //T0重载值的低字节

void ConfigTimer0(unsigned int ms);
void StopwatchDisplay();
void KeyDriver();

void main()
{
    EA = 1;      //开总中断
    ENLED = 0;   //使能选择数码管
    ADDR3 = 1;
    P2 = 0xFE;   //P2.0置0，选择第4行按键作为独立按键
	ConfigTimer0(2);  //配置T0定时2ms
    
    while (1)
    {
        if (StopwatchRefresh)  //需要刷新秒表示数时调用显示函数
        {
            StopwatchRefresh = 0;
            StopwatchDisplay();
        }
        KeyDriver();  //调用按键驱动函数
    }
}
/* 配置并启动T0，ms-T0定时时间 */
void ConfigTimer0(unsigned int ms)
{
    unsigned long tmp;  //临时变量
    
    tmp = 11059200 / 12;      //定时器计数频率
    tmp = (tmp * ms) / 1000;  //计算所需的计数值
    tmp = 65536 - tmp;        //计算定时器重载值
    tmp = tmp + 18;           //补偿中断响应延时造成的误差
    T0RH = (unsigned char)(tmp>>8);  //定时器重载值拆分为高低字节
    T0RL = (unsigned char)tmp;
    TMOD &= 0xF0;   //清零T0的控制位
    TMOD |= 0x01;   //配置T0为模式1
    TH0 = T0RH;     //加载T0重载值
    TL0 = T0RL;
    ET0 = 1;        //使能T0中断
    TR0 = 1;        //启动T0
}
/* 秒表计数显示函数 */
void StopwatchDisplay()
{
	signed char i;
	unsigned char buf[4];  //数据转换的缓冲区
    
    //小数部分转换到低2位
    LedBuff[0] = LedChar[DecimalPart%10];
    LedBuff[1] = LedChar[DecimalPart/10];
    //整数部分转换到高4位
    buf[0] = IntegerPart%10;
    buf[1] = (IntegerPart/10)%10;
    buf[2] = (IntegerPart/100)%10;
    buf[3] = (IntegerPart/1000)%10;
    for (i=3; i>=1; i--)  //整数部分高位的0转换为空字符
    {
        if (buf[i] == 0)
            LedBuff[i+2] = 0xFF;
        else
            break;
    }
    for ( ; i>=0; i--)  //有效数字位转换为显示字符
    {
        LedBuff[i+2] = LedChar[buf[i]];
    }
    LedBuff[2] &= 0x7F;  //点亮小数点
}
/* 秒表启停函数 */
void StopwatchAction()
{
    if (StopwatchRunning)    //已启动则停止
        StopwatchRunning = 0;
    else                     //未启动则启动
        StopwatchRunning = 1;
}
/* 秒表复位函数 */
void StopwatchReset()
{
    StopwatchRunning = 0;  //停止秒表
    DecimalPart = 0;       //整数小数清零计数值
    IntegerPart = 0;
    StopwatchRefresh = 1;  //置刷新标志
}
/* 按键驱动函数，检测按键动作，调度相应动作函数，需在主循环中调用 */
void KeyDriver()
{
    unsigned char i;
    static unsigned char backup[4] = {1,1,1,1};

    for (i=0; i<4; i++)  //循环检测4个按键
    {
        if (backup[i] != KeySta[i])  //检测按键动作
        {
            if (backup[i] != 0)      //按键按下时执行动作
            {
                if (i == 1)          //Esc键复位秒表
                    StopwatchReset();
                else if (i == 2)     //回车键启停秒表
                    StopwatchAction();
            }
            backup[i] = KeySta[i];   //刷新前一次的备份值
        }
    }
}
/* 按键扫描函数，需在定时中断中调用 */
void KeyScan()
{
    unsigned char i;
    static unsigned char keybuf[4] = {  //按键扫描缓冲区
        0xFF, 0xFF, 0xFF, 0xFF
    };
    
    //按键值移入缓冲区
    keybuf[0] = (keybuf[0] << 1) | KEY1;
    keybuf[1] = (keybuf[1] << 1) | KEY2;
    keybuf[2] = (keybuf[2] << 1) | KEY3;
    keybuf[3] = (keybuf[3] << 1) | KEY4;
    //消抖后更新按键状态
    for (i=0; i<4; i++)
    {
        if (keybuf[i] == 0x00)
        {   //连续8次扫描值为0，即16ms内都是按下状态时，可认为按键已稳定的按下
            KeySta[i] = 0;
        }
        else if (keybuf[i] == 0xFF)
        {   //连续8次扫描值为1，即16ms内都是弹起状态时，可认为按键已稳定的弹起
            KeySta[i] = 1;
        }
    }
}
/* 数码管动态扫描刷新函数，需在定时中断中调用 */
void LedScan()
{
    static unsigned char i = 0;  //动态扫描索引
    
    P0 = 0xFF;             //关闭所有段选位，显示消隐
    P1 = (P1 & 0xF8) | i;  //位选索引值赋值到P1口低3位
    P0 = LedBuff[i];       //缓冲区中索引位置的数据送到P0口
    if(i>5)
        i=0;
    else
        i++;
}
/* 秒表计数函数，每隔10ms调用一次进行秒表计数累加 */
void StopwatchCount()
{
    if (StopwatchRunning)  //当处于运行状态时递增计数值
    {
        DecimalPart++;           //小数部分+1
        if (DecimalPart >= 100)  //小数部分计到100时进位到整数部分
        {
            DecimalPart = 0;
            IntegerPart++;       //整数部分+1
            if (IntegerPart >= 10000)  //整数部分计到10000时归零
            {
                IntegerPart = 0;
            }
        }
        StopwatchRefresh = 1;    //设置秒表计数刷新标志
    }
}
/* T0中断服务函数，完成数码管、按键扫描与秒表计数 */
void InterruptTimer0() interrupt 1
{
    static unsigned char tmr10ms = 0;

    TH0 = T0RH;  //重新加载重载值
    TL0 = T0RL;
    LedScan();   //数码管扫描显示
    KeyScan();   //按键扫描
    //定时10ms进行一次秒表计数
    tmr10ms++;
    if (tmr10ms >= 5)
    {
        tmr10ms = 0;
        StopwatchCount();  //调用秒表计数函数
    }
}

```
 

##  PWM知识

它的中文名字是 `脉冲宽度调制`，一种说法是它 `利用微处理器的数字输出来对模拟电路进行控制的一种有效的技术，其实就是使用数字信号 达到一个模拟信号的效果`(改变脉冲宽度来实现不同的效果)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221001142129.jpg) 

```cpp
//占空比
占空比是指高电平的时间占整个周期的比例
//分析
这是一个周期是 10ms，即频率是 100Hz 的波形，但是每个周期内，高低电平脉冲宽度各不相同，这就是 PWM 的本质，第一部分波形的占空比是 40%，第二部分波形占空比是 60%，第三部分波形占空比是 80%，这就是 PWM 的解释
//计算
周期与频率的关系是互为倒数，周期单位是s，所以需要转换,如上面：
10ms=0.01s--1/0.01s=100Hz
100Hz=1/100=0.01s=10ms
```



###  程序编写

- 利用 `2个定时器+2个中断`

呼吸灯

```cpp
# include <reg52.h>

sbit PWMOUT = P0^0;
sbit ADDR0 = P1^0;
sbit ADDR1 = P1^1;
sbit ADDR2 = P1^2;
sbit ADDR3 = P1^3;
sbit ENLED = P1^4;

unsigned long PeriodCnt = 0;  //PWM周期计数值
unsigned char HighRH = 0;  //高电平重载值的高字节
unsigned char HighRL = 0;  //高电平重载值的低字节
unsigned char LowRH  = 0;  //低电平重载值的高字节
unsigned char LowRL  = 0;  //低电平重载值的低字节
unsigned char T1RH = 0;    //T1重载值的高字节
unsigned char T1RL = 0;    //T1重载值的低字节

void ConfigTimer1(unsigned int ms);
void ConfigPWM(unsigned int fr, unsigned char dc);

void main()
{
    EA = 1;     //开总中断
    ENLED = 0;  //使能独立LED
    ADDR3 = 1;
    ADDR2 = 1;
    ADDR1 = 1;
    ADDR0 = 0;
    
    ConfigPWM(100, 10);  //配置并启动PWM
    ConfigTimer1(50);    //用T1定时调整占空比
    while (1);
}
/* 配置并启动T1，ms-定时时间 */
void ConfigTimer1(unsigned int ms)
{
    unsigned long tmp;  //临时变量
    
    tmp = 11059200 / 12;      //定时器计数频率
    tmp = (tmp * ms) / 1000;  //计算所需的计数值
    tmp = 65536 - tmp;        //计算定时器重载值
    tmp = tmp + 12;           //补偿中断响应延时造成的误差
    T1RH = (unsigned char)(tmp>>8);  //定时器重载值拆分为高低字节
    T1RL = (unsigned char)tmp;
    TMOD &= 0x0F;   //清零T1的控制位
    TMOD |= 0x10;   //配置T1为模式1
    TH1 = T1RH;     //加载T1重载值
    TL1 = T1RL;
    ET1 = 1;        //使能T1中断
    TR1 = 1;        //启动T1
}
/* 配置并启动PWM，fr-频率，dc-占空比 */
void ConfigPWM(unsigned int fr, unsigned char dc)
{
    unsigned int high, low;
    
    PeriodCnt = (11059200/12) / fr; //计算一个周期所需的计数值
    high = (PeriodCnt*dc) / 100;    //计算高电平所需的计数值
    low  = PeriodCnt - high;        //计算低电平所需的计数值
    high = 65536 - high + 12;       //计算高电平的定时器重载值并补偿中断延时
    low  = 65536 - low  + 12;       //计算低电平的定时器重载值并补偿中断延时
    HighRH = (unsigned char)(high>>8); //高电平重载值拆分为高低字节
    HighRL = (unsigned char)high;
    LowRH  = (unsigned char)(low>>8);  //低电平重载值拆分为高低字节
    LowRL  = (unsigned char)low;
    TMOD &= 0xF0;   //清零T0的控制位
    TMOD |= 0x01;   //配置T0为模式1
    TH0 = HighRH;   //加载T0重载值
    TL0 = HighRL;
    ET0 = 1;        //使能T0中断
    TR0 = 1;        //启动T0
    PWMOUT = 1;     //输出高电平
}
/* 占空比调整函数，频率不变只调整占空比 */
void AdjustDutyCycle(unsigned char dc)
{
    unsigned int  high, low;
    
    high = (PeriodCnt*dc) / 100;    //计算高电平所需的计数值
    low  = PeriodCnt - high;        //计算低电平所需的计数值
    high = 65536 - high + 12;       //计算高电平的定时器重载值并补偿中断延时
    low  = 65536 - low  + 12;       //计算低电平的定时器重载值并补偿中断延时
    HighRH = (unsigned char)(high>>8); //高电平重载值拆分为高低字节
    HighRL = (unsigned char)high;
    LowRH  = (unsigned char)(low>>8);  //低电平重载值拆分为高低字节
    LowRL  = (unsigned char)low;
}
/* T0中断服务函数，产生PWM输出 */
void InterruptTimer0() interrupt 1
{
    if (PWMOUT == 1)  //当前输出为高电平时，装载低电平值并输出低电平
    {
        TH0 = LowRH;
        TL0 = LowRL;
        PWMOUT = 0;
    }
    else              //当前输出为低电平时，装载高电平值并输出高电平
    {
        TH0 = HighRH;
        TL0 = HighRL;
        PWMOUT = 1;
    }
}
/* T1中断服务函数，定时动态调整占空比 */
void InterruptTimer1() interrupt 3
{
    static bit dir = 0;
    static unsigned char index = 0;
    unsigned char code table[13] = {  //占空比调整表
        5, 18, 30, 41, 51, 60, 68, 75, 81, 86, 90, 93, 95
    };

    TH1 = T1RH;  //重新加载T1重载值
    TL1 = T1RL;
    AdjustDutyCycle(table[index]); //调整PWM的占空比
    if (dir == 0)  //逐步增大占空比
    {
        index++;
        if (index >= 12)
        {
            dir = 1;
        }
    }
    else          //逐步减小占空比
    {
        index--;
        if (index == 0)
        {
            dir = 0;
        }
    }
}


```
 

##  综合实例-红绿灯

 
```cpp
//左边绿灯(刚亮时蜂鸣器响一下)，中间黄灯，右边红灯
# include <reg52.h>
# include <intrins.h>

sbit  ADDR3 = P1^3;
sbit  ENLED = P1^4;
sbit beep = P1 ^ 6;

unsigned char code LedChar[] = {  //数码管显示字符转换表
    0xC0, 0xF9, 0xA4, 0xB0, 0x99, 0x92, 0x82, 0xF8,
    0x80, 0x90, 0x88, 0x83, 0xC6, 0xA1, 0x86, 0x8E
};
unsigned char LedBuff[7] = {  //数码管+独立LED显示缓冲区
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
};
bit flag1s = 1;          //1秒定时标志
unsigned char T0RH = 0;  //T0重载值的高字节
unsigned char T0RL = 0;  //T0重载值的低字节

void ConfigTimer0(unsigned int ms);
void TrafficLight();


void main()
{
    EA = 1;      //开总中断
    ENLED = 0;   //使能数码管和LED
    ADDR3 = 1;
	ConfigTimer0(1);  //配置T0定时1ms
    while (1)
    {
        if (flag1s)  //每秒执行一次交通灯刷新
        {
            flag1s = 0;
            TrafficLight();
        }
    }
}

void Delay1ms()		//@11.0592MHz
{
	unsigned char i, j;

	_nop_();
	i = 2;
	j = 199;
	do
	{
		while (--j);
	} while (--i);
}


/* 配置并启动T0，ms-T0定时时间 */
void ConfigTimer0(unsigned int ms)
{
    unsigned long tmp;  //临时变量
    
    tmp = 11059200 / 12;      //定时器计数频率
    tmp = (tmp * ms) / 1000;  //计算所需的计数值
    tmp = 65536 - tmp;        //计算定时器重载值
    tmp = tmp + 13;           //补偿中断响应延时造成的误差
    T0RH = (unsigned char)(tmp>>8);  //定时器重载值拆分为高低字节
    T0RL = (unsigned char)tmp;
    TMOD &= 0xF0;   //清零T0的控制位
    TMOD |= 0x01;   //配置T0为模式1
    TH0 = T0RH;     //加载T0重载值
    TL0 = T0RL;
    ET0 = 1;        //使能T0中断
    TR0 = 1;        //启动T0
}

/* 交通灯显示刷新函数 */
void TrafficLight()
{
    static unsigned char color = 2;  //颜色索引：0-绿色/1-黄色/2-红色
    static unsigned char timer = 0;  //倒计时定时器
	unsigned int i =0;
    
    if (timer == 0) //倒计时到0时，切换交通灯
    {
        switch (color)  //LED8/9代表绿灯，LED5/6代表黄灯，LED2/3代表红灯
        {
            case 0:     //切换到黄色，亮3秒
                color = 1;
                timer = 2;
                LedBuff[6] = 0xE7;	//1110 0111
                break;
            case 1:     //切换到红色，亮30秒
                color = 2;
                timer = 29;
                LedBuff[6] = 0xFC;	//1111 1100
                break;
            case 2:     //切换到绿色，亮40秒
				for(i=0;i<20;i++)
				{
					beep = ~beep;
					Delay1ms();
				}	
				beep = 1;
                color = 0;
                timer = 39;
                LedBuff[6] = 0x3F;	//0011 1111
                break;
            default:
                break;
        }
    }
    else  //倒计时未到0时，递减其计数值
    {
        timer--;
    }
    LedBuff[0] = LedChar[timer%10];  //倒计时数值个位显示
    LedBuff[1] = LedChar[timer/10];  //倒计时数值十位显示
}
/* LED动态扫描刷新函数，需在定时中断中调用 */
void LedScan()
{
    static unsigned char i = 0;  //动态扫描索引
    
    P0 = 0xFF;             //关闭所有段选位，显示消隐
    P1 = (P1 & 0xF8) | i;  //位选索引值赋值到P1口低3位
    P0 = LedBuff[i];       //缓冲区中索引位置的数据送到P0口
    if (i < 6)             //索引递增循环，遍历整个缓冲区
        i++;
    else
        i = 0;
}


/* T0中断服务函数，完成LED扫描和秒定时 */
void InterruptTimer0() interrupt 1
{
    static unsigned int tmr1s = 0;  //1秒定时器
    TH0 = T0RH;  //重新加载重载值
    TL0 = T0RL;
    LedScan();   //LED扫描显示
    tmr1s++;     //1秒定时的处理
    if (tmr1s >= 1000)
    {
        tmr1s = 0;
        flag1s = 1;  //设置秒定时标志
    }
	
}
```
 

##  综合实例-长按

 

```cpp
# include <reg52.h>

sbit BUZZ  = P1^6;
sbit ADDR3 = P1^3;
sbit ENLED = P1^4;
sbit KEY_IN_1  = P2^4;
sbit KEY_IN_2  = P2^5;
sbit KEY_IN_3  = P2^6;
sbit KEY_IN_4  = P2^7;
sbit KEY_OUT_1 = P2^3;
sbit KEY_OUT_2 = P2^2;
sbit KEY_OUT_3 = P2^1;
sbit KEY_OUT_4 = P2^0;

unsigned char code LedChar[] = {  //数码管显示字符转换表
    0xC0, 0xF9, 0xA4, 0xB0, 0x99, 0x92, 0x82, 0xF8,
    0x80, 0x90, 0x88, 0x83, 0xC6, 0xA1, 0x86, 0x8E
};
unsigned char LedBuff[7] = {  //数码管+独立LED显示缓冲区
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
};
unsigned char code KeyCodeMap[4][4] = { //矩阵按键编号到标准键盘键码的映射表
    { 0x31, 0x32, 0x33, 0x26 }, //数字键1、数字键2、数字键3、向上键
    { 0x34, 0x35, 0x36, 0x25 }, //数字键4、数字键5、数字键6、向左键
    { 0x37, 0x38, 0x39, 0x28 }, //数字键7、数字键8、数字键9、向下键
    { 0x30, 0x1B, 0x0D, 0x27 }  //数字键0、ESC键、  回车键、 向右键
};
unsigned char KeySta[4][4] = {  //全部矩阵按键的当前状态
    {1, 1, 1, 1},  {1, 1, 1, 1},  {1, 1, 1, 1},  {1, 1, 1, 1}
};
unsigned long pdata KeyDownTime[4][4] = {  //每个按键按下的持续时间，单位ms
    {0, 0, 0, 0},  {0, 0, 0, 0},  {0, 0, 0, 0},  {0, 0, 0, 0}
};
bit enBuzz = 0;     //蜂鸣器使能标志
bit flag1s = 0;     //1秒定时标志
bit flagStart = 0;  //倒计时启动标志
unsigned char T0RH = 0;  //T0重载值的高字节
unsigned char T0RL = 0;  //T0重载值的低字节
unsigned int  CountDown = 0;  //倒计时计数器

void ConfigTimer0(unsigned int ms);
void ShowNumber(unsigned long num);
void KeyDriver();

void main()
{
    EA = 1;       //使能总中断
    ENLED = 0;    //选择数码管和独立LED
    ADDR3 = 1;
    ConfigTimer0(1);  //配置T0定时1ms
    ShowNumber(0);    //上电显示0
	
    while (1)
    {
        KeyDriver();  //调用按键驱动函数
        if (flagStart && flag1s) //倒计时启动且1秒定时到达时，处理倒计时
        {
            flag1s = 0;
            if (CountDown > 0)   //倒计时未到0时，计数器递减
            {
                CountDown--;
                ShowNumber(CountDown); //刷新倒计时数显示
                if (CountDown == 0)    //减到0时，执行声光报警
                {
                    enBuzz = 1;        //启动蜂鸣器发声
                    LedBuff[6] = 0x00; //点亮独立LED
                }
            }
        }
    }
}
/* 配置并启动T0，ms-T0定时时间 */
void ConfigTimer0(unsigned int ms)
{
    unsigned long tmp;  //临时变量
    
    tmp = 11059200 / 12;      //定时器计数频率
    tmp = (tmp * ms) / 1000;  //计算所需的计数值
    tmp = 65536 - tmp;        //计算定时器重载值
    tmp = tmp + 28;           //补偿中断响应延时造成的误差
    T0RH = (unsigned char)(tmp>>8);  //定时器重载值拆分为高低字节
    T0RL = (unsigned char)tmp;
    TMOD &= 0xF0;   //清零T0的控制位
    TMOD |= 0x01;   //配置T0为模式1
    TH0 = T0RH;     //加载T0重载值
    TL0 = T0RL;
    ET0 = 1;        //使能T0中断
    TR0 = 1;        //启动T0
}
/* 将一个无符号长整型的数字显示到数码管上，num-待显示数字 */
void ShowNumber(unsigned long num)
{
    signed char i;
    unsigned char buf[6];
    
    for (i=0; i<6; i++)   //把长整型数转换为6位十进制的数组
    {
        buf[i] = num % 10;
        num = num / 10;
    }
    for (i=5; i>=1; i--)  //从最高位起，遇到0转换为空格，遇到非0则退出循环
    {
        if (buf[i] == 0)
            LedBuff[i] = 0xFF;
        else
            break;
    }
    for ( ; i>=0; i--)    //剩余低位都如实转换为数码管显示字符
    {
        LedBuff[i] = LedChar[buf[i]];
    }
}
/* 按键动作函数，根据键码执行相应的操作，keycode-按键键码 */
void KeyAction(unsigned char keycode)  //按键动作函数，根据键码执行相应动作
{
    if (keycode == 0x26)       //向上键，倒计时设定值递增
    {
        if (CountDown < 9999)  //最大计时9999秒
        {
            CountDown++;
            ShowNumber(CountDown);
        }
    }
    else if (keycode == 0x28)  //向下键，倒计时设定值递减
    {
        if (CountDown > 1)     //最小计时1秒
        {
            CountDown--;
            ShowNumber(CountDown);
        }
    }
    else if (keycode == 0x0D)  //回车键，启动倒计时
    {
        flagStart = 1;         //启动倒计时
    }
    else if (keycode == 0x1B)  //Esc键，取消倒计时
    {
        enBuzz = 0;            //关闭蜂鸣器
        LedBuff[6] = 0xFF;     //关闭独立LED
        flagStart = 0;         //停止倒计时
        CountDown = 0;         //倒计时数归零
        ShowNumber(CountDown);
    }
}
/* 按键驱动函数，检测按键动作，调度相应动作函数，需在主循环中调用 */
void KeyDriver()
{
    unsigned char i, j;
    static unsigned char pdata backup[4][4] = {  //按键值备份，保存前一次的值
        {1, 1, 1, 1},  {1, 1, 1, 1},  {1, 1, 1, 1},  {1, 1, 1, 1}
    };
    static unsigned long pdata TimeThr[4][4] = {  //快速输入执行的时间阈值
        {1000, 1000, 1000, 1000},  {1000, 1000, 1000, 1000},
        {1000, 1000, 1000, 1000},  {1000, 1000, 1000, 1000}
    };
    
    for (i=0; i<4; i++)  //循环扫描4*4的矩阵按键
    {
        for (j=0; j<4; j++)
        {
            if (backup[i][j] != KeySta[i][j])     //检测按键动作
            {
                if (backup[i][j] != 0)            //按键按下时执行动作
                {
                    KeyAction(KeyCodeMap[i][j]);  //调用按键动作函数
                }
                backup[i][j] = KeySta[i][j];      //刷新前一次的备份值
            }
            if (KeyDownTime[i][j] > 0)            //检测执行快速输入
            {
                if (KeyDownTime[i][j] >= TimeThr[i][j])
                {                                 //达到阈值时执行一次动作
                    KeyAction(KeyCodeMap[i][j]);  //调用按键动作函数
                    TimeThr[i][j] += 200; //时间阈值增加200ms，长按时数字递增的速度
                }
            }
            else   //按键弹起时复位阈值时间
            {
                TimeThr[i][j] = 1000;  //恢复1s的初始阈值时间
            }
        }
    }
}
/* 按键扫描函数，需在定时中断中调用 */
void KeyScan()
{
    unsigned char i;
    static unsigned char keyout = 0;   //矩阵按键扫描输出索引
    static unsigned char keybuf[4][4] = {  //矩阵按键扫描缓冲区
        {0xFF, 0xFF, 0xFF, 0xFF},  {0xFF, 0xFF, 0xFF, 0xFF},
        {0xFF, 0xFF, 0xFF, 0xFF},  {0xFF, 0xFF, 0xFF, 0xFF}
    };

    //将一行的4个按键值移入缓冲区
    keybuf[keyout][0] = (keybuf[keyout][0] << 1) | KEY_IN_1;
    keybuf[keyout][1] = (keybuf[keyout][1] << 1) | KEY_IN_2;
    keybuf[keyout][2] = (keybuf[keyout][2] << 1) | KEY_IN_3;
    keybuf[keyout][3] = (keybuf[keyout][3] << 1) | KEY_IN_4;
    //消抖后更新按键状态
    for (i=0; i<4; i++)  //每行4个按键，所以循环4次
    {
        if ((keybuf[keyout][i] & 0x0F) == 0x00)
        {   //连续4次扫描值为0，即4*4ms内都是按下状态时，可认为按键已稳定的按下
            KeySta[keyout][i] = 0;
            KeyDownTime[keyout][i] += 4;  //按下的持续时间累加
        }
        else if ((keybuf[keyout][i] & 0x0F) == 0x0F)
        {   //连续4次扫描值为1，即4*4ms内都是弹起状态时，可认为按键已稳定的弹起
            KeySta[keyout][i] = 1;
            KeyDownTime[keyout][i] = 0;   //按下的持续时间清零
        }
    }
    //执行下一次的扫描输出
    keyout++;        //输出索引递增
    keyout &= 0x03;  //索引值加到4即归零
    switch (keyout)  //根据索引，释放当前输出引脚，拉低下次的输出引脚
    {
        case 0: KEY_OUT_4 = 1; KEY_OUT_1 = 0; break;
        case 1: KEY_OUT_1 = 1; KEY_OUT_2 = 0; break;
        case 2: KEY_OUT_2 = 1; KEY_OUT_3 = 0; break;
        case 3: KEY_OUT_3 = 1; KEY_OUT_4 = 0; break;
        default: break;
    }
}
/* LED动态扫描刷新函数，需在定时中断中调用 */
void LedScan()
{
    static unsigned char i = 0;  //动态扫描索引
    
    P0 = 0xFF;             //关闭所有段选位，显示消隐
    P1 = (P1 & 0xF8) | i;  //位选索引值赋值到P1口低3位
    P0 = LedBuff[i];       //缓冲区中索引位置的数据送到P0口
    if (i < 6)             //索引递增循环，遍历整个缓冲区
        i++;
    else
        i = 0;
}
/* T0中断服务函数，完成数码管、按键扫描与秒定时 */
void InterruptTimer0() interrupt 1
{
    static unsigned int tmr1s = 0;  //1秒定时器
    
    TH0 = T0RH;   //重新加载重载值
    TL0 = T0RL;
    if (enBuzz)   //蜂鸣器发声处理
        BUZZ = ~BUZZ;  //驱动蜂鸣器发声
    else
        BUZZ = 1;      //关闭蜂鸣器
    LedScan();   //LED扫描显示
    KeyScan();   //按键扫描
    if (flagStart)  //倒计时启动时处理1秒定时
    {
        tmr1s++;
        if (tmr1s >= 1000)
        {
            tmr1s = 0;
            flag1s = 1;
        }
    }
    else  //倒计时未启动时1秒定时器始终归零
    {
        tmr1s = 0;
    }
}
```
 


##  综合实例-数码管LED同时运行

 
```cpp
# include <reg52.h>

sbit ADDR0 = P1^0;
sbit ADDR1 = P1^1;
sbit ADDR2 = P1^2;
sbit ADDR3 = P1^3;
sbit ENLED = P1^4;

unsigned char code LedChar[] = {  //数码管显示字符转换表
    0xC0, 0xF9, 0xA4, 0xB0, 0x99, 0x92, 0x82, 0xF8,
    0x80, 0x90, 0x88, 0x83, 0xC6, 0xA1, 0x86, 0x8E
};
unsigned char LedBuff[7] = {  //数码管+独立LED显示缓冲区，初值0xFF确保启动时都不亮
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
};
bit flag200ms = 0;  //200ms定时标志
bit flag1s = 0;     //1s定时标志

void ShowCount();
void FlowingLight();

void main()
{
    EA = 1;       //使能总中断
    ENLED = 0;    //使能U3
    ADDR3 = 1;    //因为需要动态改变ADDR0-2的值，所以不需要再初始化了
    TMOD = 0x01;  //设置T0为模式1
    TH0  = 0xFC;  //为T0赋初值0xFC67，定时1ms
    TL0  = 0x67;
    ET0  = 1;     //使能T0中断
    TR0  = 1;     //启动T0
    
    while (1)
    {
        if (flag200ms)  //200ms刷新一次流水灯
        {
            flag200ms = 0;
            FlowingLight();
        }
        if (flag1s)   //1s刷新一次计数值
        {
            flag1s = 0;
            ShowCount();
        }
    }
}
/* 流水灯实现函数 */
void FlowingLight()
{
    static unsigned char dir = 0;   //移位方向变量dir，用于控制移位的方向
    static unsigned char shift = 0x01;  //循环移位变量shift，并赋初值0x01

    LedBuff[6] = ~shift;      //循环移位变量取反，控制8个LED
    if (dir == 0)             //移位方向变量为0时，左移
    {
        shift = shift << 1;   //循环移位变量左移1位
        if (shift == 0x80)    //左移到最左端后，改变移位方向
        {
            dir = 1;
        }
    }
    else                      //移位方向变量不为0时，右移
    {
        shift = shift >> 1;   //循环移位变量右移1位
        if (shift == 0x01)    //右移到最右端后，改变移位方向
        {
            dir = 0;
        }
    }
}
/* 秒计数显示函数 */
void ShowCount()
{
    char i;  //循环变量
    unsigned char buf[6];   //中间转换缓冲区
    static unsigned long sec = 0;  //记录经过的秒数
    
    sec++;  //秒计数自加1
    buf[0] = sec%10;  //将sec按十进制位从低到高依次提取到buf数组中
    buf[1] = sec/10%10;
    buf[2] = sec/100%10;
    buf[3] = sec/1000%10;
    buf[4] = sec/10000%10;
    buf[5] = sec/100000%10;
    for (i=5; i>=1; i--)  //从最高为开始，遇到0不显示，遇到非0退出循环
    {
        if (buf[i] == 0)
            LedBuff[i] = 0xFF;
        else
            break;
    }
    for ( ; i>=0; i--)  //将剩余的有效数字位如实转换
    {
        LedBuff[i] = LedChar[buf[i]];
    }
}
/* 定时器0中断服务函数 */
void InterruptTimer0() interrupt 1
{
    static unsigned char i = 0;   //动态扫描的索引
    static unsigned char cnt200 = 0;  //200ms定时
    static unsigned int cnt1000 = 0;  //1000ms即1s定时

    TH0 = 0xFC;  //重新加载初值
    TL0 = 0x67;
    cnt200++;    //200ms定时
    if (cnt200 >= 200)
    {
        cnt200 = 0;
        flag200ms = 1;
    }
    cnt1000++;   //1s定时
    if (cnt1000 >= 1000)
    {
        cnt1000 = 0;
        flag1s = 1;
    }
    //以下代码完成数码管动态扫描刷新
    P0 = 0xFF;   //显示消隐
    switch (i)
    {
        case 0: ADDR2=0; ADDR1=0; ADDR0=0; i++; P0=LedBuff[0]; break;
        case 1: ADDR2=0; ADDR1=0; ADDR0=1; i++; P0=LedBuff[1]; break;
        case 2: ADDR2=0; ADDR1=1; ADDR0=0; i++; P0=LedBuff[2]; break;
        case 3: ADDR2=0; ADDR1=1; ADDR0=1; i++; P0=LedBuff[3]; break;
        case 4: ADDR2=1; ADDR1=0; ADDR0=0; i++; P0=LedBuff[4]; break;
        case 5: ADDR2=1; ADDR1=0; ADDR0=1; i++; P0=LedBuff[5]; break;
        case 6: ADDR2=1; ADDR1=1; ADDR0=0; i=0; P0=LedBuff[6]; break;
        default: break;
    }
}
```
 

##  UART串口通信

UART串行通信是单片机最常用的一种通信技术，通常用于 `单片机和电脑` 之间以及 `单片机和单片机` 之间的通信

```cpp
//基础知识1
通信按照基本类型可以分为 "并行通信"和 "串行通信"。并行通信时数据的各个位同时传送，可以实现字节为单位通信，但是通信线多占用资源多，成本高；串行通信，就如同一条车道，一次只能一辆车过去，如果低位在前高位在后的话一位一位的发送出去，要发送 8 次才能发送完一个字节
//基础知识2
STC89C52 有两个引脚是专门用来做 UART 串行通信的，一个是 "P3.0" 一个是 "P3.1"(即 "RXD 和 TXD")
●RXD：Receive External Data (接收外部设备数据)
●TXD：Transmit Data (传输数据)
如果两个单片机想通信，则需要 "RXD1-->TXD2 TXD1-->RXD2  GND1-->GND2"连接才能正常通信
```

<span style="color:red;">问</span>：每发送一位需要拉低或拉高一段时间，这个 "一段时间" 大概多久？

<span style="color:# e80daf">这涉及到 "波特率" 问题(发送二进制数据位的速率，习惯上用 `baud` 表示)，即我们发送一位二进制数据 的持续时间= `1/baud`，在通信之前，`单片机 1 和单片机 2 首先都要明确的约定好它们之间的通信波特率，必须保持一致，收发双方才能正常实现通信`，</span>

<span style="color:red;">问</span>：约定好速度后，我们还要考虑第二个问题，数据什么时候是起始，什么时候是结束呢？

<span style="color:# e80daf">不管是提前接收还是延迟接收，数据都会接收错误。在 UART 通信的时候， `一个字节是 8 位`， 规定 `当没有通信信号发生时，通信线路保持高电平`，当要 `发送数据之前，先发一位 0 表示起始位`，然后 `发送 8 位数据位`，数据位是 `先低后高`的顺序，数据位发完后 `再发一位 1 表示停止位`，加起来一共发送 `10位`；而接收方呢，原本一直保持的高电平， `一旦检测到了一位低电平`，那就知道了要 `开始准备接收数据`了，接收到 8 位数据位后，然后 `检测到高电平(停止位)`，再 `准备下一个数据的接收`</span>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221001202151.jpg) 

```cpp
//了解即可
●RS232 通信接口 ：就是台式电脑那些 "9针"和"9孔"(公头/母头)串行接口，虽然RS232也有 "RXD","TXD","GND"，但是却不能直接和单片机连接，因为它们的电平不相同，不是所有的电路都是 5V 代表高电平而 0V 代表低电平的，对于RS232标准来说，它是 "反逻辑"，即 "低电平代表的是 1，而高电平代表的是 0"，所以需要用一个电平转换芯片 "MAX232" 作为中间人将它们两电平互相转化从而可以互相通信
//要记
●USB 转串口通信，笔记本跟单片机如何通信呢那就需要在电路上添加一个 "USB 转串口芯片"，就可以成功实现 USB 通信协议和标准UART 串行通信协议的转换
```

```cpp
//计算模式2装载值(因为8位最大是256)
TH0 = 256 - (11059200/12)/baud;	//(11059200/12)/baud;(机器周期的个数) 
//接收时
TL0=256-((256-TH0)>>1); 	//256-TH0是机器周期的个数然后右移一位就是除2 让TL0为半个波特率为开始
//发送时不用一半必须是一个波特率周期，TL0 = TH0;即可
```

{% note blue 'fas fa-fan' flat %} UART **模块介绍**  {% endnote %}

51单片机的UART 串口的结构由串行口控制寄存器 `SCON`、 `发送` 和 `接收` 电路三部分构成

- 串口控制寄存器 SCON：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221013134420.jpg) 

模式1： `1 位起始位，8 位数据位和 1 位停止位`

波特率发生器：波特率发生器只能由 `定时器 T1 `或 `定时器 T2 `产生，<span style="color:red;">定时器 T1必须使用模式 2，也就是自动重装载模式</span>

```cpp
//定时器的重载值计算公式为：
TH1 = TL1 = 256 - 晶振值/12 /2/16 /波特率
 ○解释   
256︰定时器模式2(8位的溢出值)
晶振值:11059200
12:一个机器周期(STC89C52中一个时钟周期等于12个时钟周期,具体看芯片手册)
16︰串口模块将一位信号采集16次，将其中7,8,9次取出来，如果这三次中两次对如果是高电平就认为这位数据是1.
波特率:要设定的波特率
//电源管理寄存器 PCON，设置它可以将波特率提高一倍
PCON |= 0x80
//此时公式是：           
TH1 = TL1 = 256 - 晶振值/12 /16 /波特率
```

- SBUF 寄存器

串口通信的发送和接收电路在物理上有 2 个名字相同的 SBUF 寄存器，它们的地址也都 是 `0x99`，但是一个用来做 `发送缓冲`，一个用来做 `接收缓冲`

###  CH340T芯片

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221001203606.jpg) 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221001204230.jpg) 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221001203905.jpg) 

```cpp

"6,7脚"-->"D-,D+"  "3,4脚"-->通过跳线到"TXD,RXD"
CH340T 的电路里 3 脚位置加了个 4148 的二极管，是一个小技巧。因为 STC89C52 这个单片机下载程序时需要冷启动，就是先点下载后上电，上电瞬间单片机会先检测需要不需要下载程序。虽然单片机的 VCC 是由开关来控制，但是由于 CH340T 的 3 脚是输出引脚，如果没有此二极管，开关后级单片机在断电的情况下，CH340T 的 3 脚和单片机的 P3.0（即 RXD）引脚连在一起，有电流会通过这个引脚流入后级电路并且给后级的电容充电，造成后级有一定幅度的电压，这个电压值虽然只有两三伏左右，但是可能会影响到正常的冷启动。加了二极管后，一方面不影响通信，另外一个方面还可以消除这种不良影响
```

###  波形图分析

分析仪和示波器的作用，就是把通信过程的波形抓出来进行分析

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221013184229.jpg) 

`波形左边是低位，右边是高位`，上边这个波形是 `电脑发送给单片机`的，下边这个波形是 `单片机回发给电脑`的

```cpp
● 以上边的波形为例，左边第一位是起始位 0，从低位到高位依次是 1000 1100，顺序倒一下就是 
    0011 0001，就是数据 0x31，也就是 ASCII 码表里的‘1’
//每个数据位都给标了一个白色的点，表示是数据，起始位和无数据的时候都没有这个白点
//时间标 T1 和 T2 的差值在右边显示出来是 0.102ms，大概是 9600 分之一，稍微有点偏差，在容许范围内即可    
●    
```

<span style="color:red;">问</span>：用文本格式直接发送一个“12”，串口调试助手返回十六进制显示的是 31、32 两个数据，而数码管显示的是 32，为什么？

<span style="color:# e80daf">对于 ASCII 码表来说，数字本身是字符而非数据，所以如果发送“12”的话，实际上是 是分别发送了“1”和“2”两个字符，单片机呢，先收到第一个字符“1”，在数码管上会显 示出 31 这个对应数字，但是马上就又收到了“2”这个字符，数码管瞬间从 31 变成了 32， 而我们视觉上呢，是没有办法发现这种快速变化的，所以我们感觉数码管直接显示的是 32</span>





###  程序编写


- `波特率 9600，校验位选 N，数据位 8，停止位 1`
- 这个程序经过测试发现发送数据跟接收的不一样，毕竟是模拟UART

IO口模拟UART通信(了解即可)
```cpp
//程序分析
配置波特率的时候，我们用的是定时器 T0 的模式 2(8位自动装载模式)。模式 2 中，不再是 TH0 代表高 8 位，TL0 代表低 8 位了，而只有 TL0 在进行计数，当 TL0 溢出后，不仅仅会让 TF0 变 1，而且还会将 TH0 中的内容重新自动装到 TL0 中，"好处是：可以把想要的定时器初值提前存在 TH0 中，当 TL0 溢出后，TH0 自动把初值就重新送入 TL0 了，全自动的"
    
接收函数最开始启动半个波特率周期，因为时序上的误差以及信号稳定性的问题很容易读错数据，所以我们希
望在信号最稳定的时候去读数据。除了信号变化的那个沿的位置外，其它位置都很稳定,比如一位数据时间是1T，那就在0.5T那读取
    
一旦读到了起始信号，我们就把当前状态设定成接收状态，并且打开定时器中断，第一次是半个周期进入中断后，对起始位进行二次判断一下，确认一下起始位是低电平，而不是一个干扰信号。以后每经过 1/9600 秒进入一次中断，并且把这个引脚的状态读到 RxdBuf 里边。等待接收完毕之后，我们再把这个 RxdBuf 加 1，再通过 TXD 引脚发送出去，同样需要先发一位起始位，然后发 8 个数据位，再发结束位，发送完毕后，程序运行到 while (PIN_RXD)，等待第二轮信号接收的开始。
    

RxBuf不是自动完成的，是需要编程人员根据PIN_RXD的状态决定的。如果PIN_RXD的状态为1，则说明发过来数据为1，则将这个1放到RxdBuf的高位，也就是要将RxdBuf的最高位变成1了。是"先移动再赋值"
```



```cpp
# include <reg52.h>

sbit PIN_RXD = P3^0;  //接收引脚定义
sbit PIN_TXD = P3^1;  //发送引脚定义

bit RxdOrTxd = 0;  //指示当前状态为接收还是发送
bit RxdEnd = 0;    //接收结束标志
bit TxdEnd = 0;    //发送结束标志
unsigned char RxdBuf = 0;  //接收缓冲器
unsigned char TxdBuf = 0;  //发送缓冲器

void ConfigUART(unsigned int baud);
void StartTXD(unsigned char dat);
void StartRXD();

void main()
{
    EA = 1;   //开总中断
    ConfigUART(9600);  //配置波特率为9600
    
    while (1)
    {
        while (PIN_RXD);    //等待接收引脚出现低电平，即起始位
        StartRXD();         //启动接收
        while (!RxdEnd);    //等待接收完成
        StartTXD(RxdBuf); //接收到的数据+1后，发送回去
        while (!TxdEnd);    //等待发送完成
    }
}
/* 串口配置函数，baud-通信波特率 */
void ConfigUART(unsigned int baud)
{
    TMOD &= 0xF0;   //清零T0的控制位
    TMOD |= 0x02;   //配置T0为模式2
    TH0 = 256 - (11059200/12)/baud;  //计算T0重载值
}
/* 启动串行接收 */
void StartRXD()
{
    TL0 = 256 - ((256-TH0)>>1);  //接收启动时的T0定时为半个波特率周期
    ET0 = 1;        //使能T0中断
    TR0 = 1;        //启动T0
    RxdEnd = 0;     //清零接收结束标志
    RxdOrTxd = 0;   //设置当前状态为接收
}
/* 启动串行发送，dat-待发送字节数据 */
void StartTXD(unsigned char dat)
{
    TxdBuf = dat;   //待发送数据保存到发送缓冲器
    TL0 = TH0;      //T0计数初值为重载值
    ET0 = 1;        //使能T0中断
    TR0 = 1;        //启动T0
    PIN_TXD = 0;    //发送起始位
    TxdEnd = 0;     //清零发送结束标志
    RxdOrTxd = 1;   //设置当前状态为发送
}
/* T0中断服务函数，处理串行发送和接收 */
void InterruptTimer0() interrupt 1
{
    static unsigned char cnt = 0; //位接收或发送计数

    if (RxdOrTxd)  //串行发送处理
    {
        cnt++;
        if (cnt <= 8)  //低位在先依次发送8bit数据位
        {
            PIN_TXD = TxdBuf & 0x01;	//&0x01表示发送最低位
            TxdBuf >>= 1;
        }
        else if (cnt == 9)  //发送停止位
        {
            PIN_TXD = 1;
        }
        else  //发送结束
        {
            cnt = 0;    //复位bit计数器
            TR0 = 0;    //关闭T0
            TxdEnd = 1; //置发送结束标志
        }
    }
    else  //串行接收处理
    {
        if (cnt == 0)     //处理起始位
        {
            if (!PIN_RXD) //起始位为0时，清零接收缓冲器，准备接收数据位
            {
                RxdBuf = 0;
                cnt++;
            }
            else          //起始位不为0时，中止接收
            {
                TR0 = 0;  //关闭T0
            }
        }
        else if (cnt <= 8)   //处理8位数据位
        {
            RxdBuf >>= 1;    //低位在先，所以将之前接收的位向右移
            if (PIN_RXD)     //接收脚为1时，缓冲器最高位置1，
            {                //而为0时不处理即仍保持移位后的0
                RxdBuf |= 0x80;
            }
            cnt++;
        }
        else  //停止位处理
        {
            cnt = 0;         //复位bit计数器
            TR0 = 0;         //关闭T0
            if (PIN_RXD)     //停止位为1时，方能认为数据有效
            {
                RxdEnd = 1;  //置接收结束标志
            }
        }
    }
}
```
 

{% note blue 'fas fa-fan' flat %} UART串口程序  {% endnote %}

```cpp
//编写串口通信程序的基本步骤：
1、配置串口为模式 1。 
2、配置定时器 T1 为模式 2，即自动重装模式。 
3、根据波特率计算 TH1 和 TL1 的初值，如果有需要可以使用 PCON 进行波特率加倍。 
4、打开定时器控制寄存器 TR1，让定时器跑起来
5、打开串口中断（因为实际开发是很少用循环的）  
//注1:使用T1定时器做波特率发生器时不要使能 T1 的中断
//注2：请注意一点，因为接收和发送触发的是同一个串口中断，所以在串口中断函数中就必须先判断是哪种中断，然后再作出相应的处理（UART中断号是4）   
```

main.c

```cpp
# include <reg52.h>

void ConfigUART(unsigned int baud);

void main()
{
	EA = 1;	//打开总中断
    ConfigUART(9600);  //配置波特率为9600
    
    while (1);
}
/* 串口配置函数，baud-通信波特率 */
void ConfigUART(unsigned int baud)
{
    SCON  = 0x50;  //配置串口为模式1  0101 0000
    TMOD &= 0x0F;  //清零T1的控制位	0000 0000 & 0000 1111
    TMOD |= 0x20;  //配置T1为模式2	0000 1111 | 0010 0000
    TH1 = 256 - (11059200/12/32)/baud;  //计算T1重载值
    TL1 = TH1;     //初值等于重载值
    ET1 = 0;       //禁止T1中断
	ES = 1;	//打开串口中断
    TR1 = 1;       //启动T1
}

void InterruptUart() interrupt 4
{
	if(RI)	//等待接收完成（未完成时是0完成后置1）
	{
		RI = 0;	//清零接收中断标志位
		SBUF = SBUF + 1;	//接收到的数据+1后，发送回去
	}
	if(TI)	//等待发送完成（未完成时是0完成后置1）
	{
		TI = 0;	//清零发送中断标志位
	}
}

```
 

- 每接到任意字节数据后都改变流水的流动/停止状态

main.c

```cpp
/*
每接到任意字节数据后都改变流水的流动/停止状态，流水灯定时2s
*/

# include <reg52.h>


sbit ADDR3 = P1^3;
sbit ENLED = P1^4;
# define SMG_PORT P1
# define LED_PORT P0

unsigned char code SMG[]={
	0xC0, 0xF9, 0xA4, 0xB0, 0x99, 0x92, 0x82, 0xF8,
    0x80, 0x90, 0x88, 0x83, 0xC6, 0xA1, 0x86, 0x8E};	//0~F
unsigned char SMG_buffer[7]={0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};//缓冲区
unsigned char T0RH;	//T0重装载高字节
unsigned char T0RL;	//T0重装载低字节
unsigned char RxdByte;	//存接收的数据
unsigned char flag200ms = 0;	//200ms标志符 0：未到时间 1：已到时间
unsigned char runflag = 1;	//流水灯运行标志符


void Timer0_init(unsigned int ms);	//定时器0初始化
void Uart_init(unsigned int baud);	//定时器1初始化(uart)
void SMG_scan();	//数码管刷新
void RunLed_scan();	//流水灯显示


void main()
{
	EA = 1;	//开启总中断
	ADDR3 = 1;
	ENLED = 0;
	Timer0_init(1);	//定时1ms
	Uart_init(9600);	//波特率9600
	
	while(1)
	{
		if(runflag == 0)
		{
			SMG_buffer[6] = 0xFF;	//熄灭
		}
		else
		{
			if(flag200ms !=0)	//200ms刷新一次
			{
				flag200ms = 0;
				RunLed_scan();
				
			}
		}
		
		SMG_buffer[0] = SMG[RxdByte&0x0F];
		SMG_buffer[1] = SMG[RxdByte>>4];
	}
}

void Timer0_init(unsigned int ms)
{
	unsigned long tmp;	//临时变量
	tmp = 11059200/12;	//频率
	tmp = 65536-(tmp*ms)/1000;	//计算所需装载值
	tmp = tmp+13;	//中断补偿
	T0RH = (unsigned char)(tmp>>8);	//高字节
	T0RL = (unsigned char)tmp;	//低字节
	TMOD &= 0xF0;	//清定时器0控制位
	TMOD |= 0x01;	//配置T0为模式1
	TH0 = T0RH;	//加载重载值
	TL0 = T0RL;
	ET0 = 1;	//使能T0中断
	TR0 = 1;	//使能T0
}

void Uart_init(unsigned int baud)
{
	SCON = 0x50;	//串口模式1
	TMOD &= 0xF0;	//清T1控制位
	TMOD |= 0x20;	//配置T1为模式2
	TH1 = 256 - (11059200/12/32)/baud;	//计算T1重载值
	TL1 = TH1;
	ET1 = 0;	//禁止T1中断
	ES = 1;	//开启串口中断
	TR1 = 1;	//使能T1
}

void SMG_scan()
{
	static unsigned char i = 0;
	LED_PORT = 0xFF;	//消影
	SMG_PORT = (SMG_PORT & 0xF8)|i;	//低3位根据i不断切换
	LED_PORT = SMG_buffer[i];	//把索引送到缓冲区
	if(i<6)
		i++;
	else
		i = 0;
}

void RunLed_scan()
{
	static unsigned char dir = 0;	//移位方向 0：左移 1：右移
	static unsigned char shit = 0x01;	//需要移位的数值
	SMG_buffer[6] = ~shit;	//取反显示对应流水灯
	if(dir == 0)
	{
		shit = shit<<1;	//左移一位
		if(shit == 0x80)	//当左移到最高位则改变方向
		{
			dir = 1;
		}
	}
	else
		{
			shit = shit>>1;	//右移一位
			if(shit == 0x01)
			{
				dir = 0;
			}	
		}
}

void InterruptTimer0() interrupt 1
{
	static unsigned int cnt = 0;
	TH0 = T0RH;	//重新装载
	TL0 = T0RL;
	SMG_scan();
	cnt++;
	if(cnt>=2000)
	{
		cnt = 0;
		flag200ms = 1;	//标志符置1
		
	}
	
	
}

void InterruptUart() interrupt 4
{
	if(RI)	//当开始接收
	{
		RI = 0;	//清0
		RxdByte = SBUF;	//接收的数据存到变量
		SBUF = RxdByte;	//接收到的数据又直接发回，用于验证
		runflag = !runflag;	//每收到一个字节改变一次流水灯标志
		
	}
	if(TI)
	{
		TI = 0;
	}
}
```

 

- 当接收到大写 "B"，蜂鸣器响(要用文本模式发送才有效)

main.c
```cpp
//就是在上面代码的基础上加，先定义一个flag控制蜂鸣器状态的(0表示关)，在串口中断那当接收到数据，flag取反，在定时器0那一直扫描当flag==0表示是关闭的，==1则BUZZ = ~BUZZ;
sbit BUZZ  = P1^6;
unsigned char flagBuzz = 0; //蜂鸣器控制标志
//定时器0添加
if (flagBuzz == 0)
        BUZZ = 1;      //蜂鸣器关闭
    else
        BUZZ = ~BUZZ;  //蜂鸣器鸣叫
//串口中断添加
if (RxdByte == 'B')  //接收到大写字母B时改变一次蜂鸣器控制标志
        {
            flagBuzz = !flagBuzz;
        }
```
 

USART发送“open1# ”，数码管显示666，并且返回命令

main.c
```cpp
# include "reg52.h"
# include "string.h"
# include "stdio.h"

sbit ADDR3 = P1^3;
sbit ENLED = P1^4;
# define SMG_PORT P1
# define LED_PORT P0

//结构体
typedef struct
{
	unsigned char receive_buff[20];	//接收存放数组
	unsigned char len;	//长度
	unsigned char receive_flag;	//中断标志
}USART;

USART usart_1 = {0};


unsigned char code SMG[]={
    0xC0, 0xF9, 0xA4, 0xB0, 0x99, 0x92, 0x82, 0xF8,
    0x80, 0x90, 0x88, 0x83, 0xC6, 0xA1, 0x86, 0x8E};    //0~F
unsigned char SMG_buffer[6]={0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};//缓冲区
unsigned char T0RH;    //T0重装载高字节
unsigned char T0RL;    //T0重装载低字节

void Timer0_init(unsigned int ms);    //定时器0初始化
void Uart_init(unsigned int baud);    //定时器1初始化(uart)
char putchar(char c);
void SMG_scan();    //数码管刷新



void main()
{
    EA = 1;    //开启总中断
    ADDR3 = 1;
    ENLED = 0;
    Timer0_init(1);    //定时1ms
    Uart_init(9600);    //波特率9600
    while(1)
    {
		if(usart_1.receive_flag == 1)
		{
			printf("%s\r\n",usart_1.receive_buff);
			if(strcmp("open1",usart_1.receive_buff) == 0)
			{
				SMG_buffer[0] = SMG[3];
				SMG_buffer[1] = SMG[3];
				SMG_buffer[2] = SMG[3];
			}
			else if(strcmp("open2",usart_1.receive_buff) == 0)
			{
				SMG_buffer[0] = SMG[6];
				SMG_buffer[1] = SMG[6];
				SMG_buffer[2] = SMG[6];
			}
			usart_1.receive_flag = 0;
		}
    }
}

void Timer0_init(unsigned int ms)
{
    unsigned long tmp;    //临时变量
    tmp = 11059200/12;    //频率
    tmp = 65536-(tmp*ms)/1000;    //计算所需装载值
    tmp = tmp+13;    //中断补偿
    T0RH = (unsigned char)(tmp>>8);    //高字节
    T0RL = (unsigned char)tmp;    //低字节
    TMOD &= 0xF0;    //清定时器0控制位
    TMOD |= 0x01;    //配置T0为模式1
    TH0 = T0RH;    //加载重载值
    TL0 = T0RL;
    ET0 = 1;    //使能T0中断
    TR0 = 1;    //使能T0
}

void Uart_init(unsigned int baud)
{
    SCON = 0x50;    //串口模式1
    TMOD &= 0xF0;    //清T1控制位
    TMOD |= 0x20;    //配置T1为模式2
    TH1 = 256 - (11059200/12/32)/baud;    //计算T1重载值
    TL1 = TH1;
    ET1 = 0;    //禁止T1中断
    ES = 1;    //开启串口中断
    TR1 = 1;    //使能T1
}

void SMG_scan()
{
    static unsigned char i = 0;
    LED_PORT = 0xFF;    //消影
    SMG_PORT = (SMG_PORT & 0xF8)|i;    //低3位根据i不断切换
    LED_PORT = SMG_buffer[i];    //把索引送到缓冲区
    if(i<6)
        i++;
    else
        i = 0;
}

//重定向peintf
char putchar(char c)
{
	SBUF = c;     //写入发送缓冲寄存器
	while(!TI);    //等待发送完成，TI发送溢出标志位 置1
	TI = 0;
	return c;  //返回给函数的调用者printf
}





void InterruptTimer0() interrupt 1
{
    TH0 = T0RH;    //重新装载
    TL0 = T0RL;
    SMG_scan();  
}

void InterruptUart() interrupt 4
{
    if(RI)    //当开始接收
    {
		unsigned char temp = 0;
		RI = 0;    //清0
		temp = SBUF;
		if(temp == '# ')
		{
			usart_1.receive_buff[usart_1.len] = '\0';
			usart_1.receive_flag = 1;	//接收一帧数据完成标志
			usart_1.len = 0;	//清0长度
		}
		else
		{
			usart_1.receive_buff[usart_1.len++] = temp;
		}
    }
}
```
 



##  综合实例-数码管显示分秒毫秒

main.c
```cpp
# include<reg52.h>

sbit ADDR0 = P1 ^ 0;
sbit ADDR1 = P1 ^ 1;
sbit ADDR2 = P1 ^ 2;
sbit ADDR3 = P1 ^ 3;
sbit ENLED = P1 ^ 4;
# define LED_PORT P0
# define SMG_PORT P1

unsigned int T0RH;	//重装载高位
unsigned int T0RL;	//重装载低位
unsigned int msec;	//毫秒(0~1000)
unsigned char sec;	//秒(0~60)
unsigned char min;	//分(0~60)
bit StopwatchRefresh = 0;	//刷新标记,1:刷新 0:不刷新

unsigned char code SMG[]={ 
	0xC0, 0xF9, 0xA4, 0xB0, 0x99, 0x92, 0x82, 0xF8,
	0x80, 0x90, 0x88, 0x83, 0xC6, 0xA1, 0x86, 0x8E};	//0~F
unsigned char SMG_buffer[6]={0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};	//显示缓冲区


void Timer_init(unsigned int ms);	//定时器初始化
void Smg_scan();	//数码管扫描
void Timer_transform();	//时间转换
void Smg_display();	//数码管显示

void main()
{
	EA = 1;	//总中断
    ENLED = 0;
	ADDR3 = 1;
	Timer_init(2);	//定时2ms
	
    while(1)
    {
		if(StopwatchRefresh)
		{
			StopwatchRefresh = 0;
			Smg_display();
		}
    }
}

void Timer_init(unsigned int ms)
{
	unsigned long tmp;	//临时变量
	tmp = 11059200/12;	//频率
	tmp = (tmp*ms)/1000;	//所需计数值
	tmp = 65536 - tmp;	//重载值
	tmp = tmp + 13;	//中断补偿
	T0RH = (unsigned char)(tmp>>8);	//右移8位
	T0RL = (unsigned char)tmp;
	TMOD &= 0xF0;	//低4位清0
	TMOD |= 0x01;	//模式1
	TH0 = T0RH;
	TL0 = T0RL;
	ET0 = 1;	//使能T0中断
	TR0 = 1;	//使能T0定时
}

void Smg_scan()
{
	static unsigned char i = 0;	//扫描索引
	LED_PORT = 0xFF;	//消影
	SMG_PORT = (SMG_PORT & 0xF8)|i;
	LED_PORT = SMG_buffer[i];
		if(i>=5)
		i=0;
	else
		i++;
}

void Timer_transform()
{
	msec++;
	if(msec>=100)
	{
		msec = 0;
		sec++;
		if(sec>=60)
		{
			sec = 0;
			min++;
		}
	}
	StopwatchRefresh = 1;	//刷新标记置1
}

void Smg_display()
{
	SMG_buffer[0] = SMG[msec%10];
	SMG_buffer[1] = SMG[msec/10];
	SMG_buffer[2] = SMG[sec%10];
	SMG_buffer[3] = SMG[sec/10];
	SMG_buffer[4] = SMG[min%10];
	SMG_buffer[5] = SMG[min/10];
	
	SMG_buffer[2] &= 0x7F;	//点亮小数点
	SMG_buffer[4] &= 0x7F;	//点亮小数点
}

void InterruptTimer0() interrupt 1
{
	static int time10ms = 0;	//10ms标记
	TH0 = T0RH;	//重新加载初值
	TL0 = T0RL;
	Smg_scan();
	time10ms++;
	if(time10ms>=5)	//当10ms时
	{
		time10ms = 0;	//清0
		Timer_transform();
	}
	
}
```
 

##  1602液晶

数据手册重要内容：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221014225318.jpg) 

这个 `2mA` 仅仅是指液晶，而它的黄绿背光都是用 LED 做的，所以功耗 不会太小的， `一二十毫安` 还是有的

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221014225547.jpg) 

```cpp
//分析
● 液晶的电源 1 脚 2 脚以及背光电源 15 脚 16 脚，正常接即可
● 3 脚叫做液晶显示偏压信号，调整显示的黑点和不显示的之间的对比度，调好就清晰多了
● 4 脚是数据命令选择端(这个引脚我们接到了 ADDR0 上，通过跳线帽和 P1.0 连接)；高电平是数据，低电平是命令
● 5 脚是读写选择端
● 6 脚是使能信号(很重要！)，这个引脚我们通过跳线帽接到了 ENLCD 上
● 7 到 14 引脚就是 8 个数据引脚了，我们就是通过这 8 个引脚读写数据和命令的
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221014230736.jpg) 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221014231030.jpg) 

第一行对应液晶屏是： `0x00~0x0F`

第二行对应液晶屏是： `0x40~0x4F`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221014231607.jpg) 

这个状态字节有 `8` 个位，最高位表示了当前液晶是不是“忙”，如果这个位是 `1 `表示液 晶正“忙”，禁止我们读写数据或者命令，如果是 `0`，则可以进行读写

```cpp
//1602 的基本操作时序，一共有 4 个(单片机读外部状态前，必须先保证自己是高电平)
//分析：
首先把用到的总线接口做一个统一声明
# define LCD1602_DB P0 	//根据原理图可以知道P0组是控制上面8个状态字
sbit LCD1602_RS = P1^0; 	//数据选择端
sbit LCD1602_RW = P1^1; 	//读写选择端
sbit LCD1602_E = P1^5;    	//使能信号
● 读状态(RS=L，R/W=H，E=H) 
//因为P0口总线也是流水灯数码管等等共用的，读取后如果一直是高电平会影响其他外设所以读完需要拉低电平
LCD1602_DB = 0xFF;    
LCD1602_RS = 0;
LCD1602_RW = 1;
do{
    LCD1602_E = 1;	//使能
    sta = LCD1602_DB; //读取状态字
    LCD1602_E = 0; //读完撤销使能，防止液晶输出数据干扰 P0 总线
}while (sta & 0x80);//最高位等于 1 表示液晶正忙，重复检测直到其等于 0 为止 
● 读数据(RS=H，R/W=H，E=H)不常用
● 写指令(RS=L，R/W=L，D0~D7=指令码，E=高脉冲) 
这个指令一共有 4 条语句，其中前三条语句顺序无所谓，但是 E=高脉冲这一句很关键。E=高脉冲，意思就是：E 使能引脚先从低拉高，再从高拉低，形成一个高脉冲
● 写数据(RS=H，R/W=L，D0~D7=数据，E=高脉冲)
写数据和写指令是类似的，就是把 RS 改成 H，把总线改成数据即可    
```

<span style="color:red;">注</span>：这里用的1602液晶所使用的接口时序是摩托罗拉公司所创立的 `6800时序` ，还有另外一种时序是 Intel 公司的 `8080时序`，也有部分液晶模块采用，只是相对来说 比较少见



1602 液晶的使能引脚 E， 高电平的时候是 `有效`，低电平的时候是 `无效`，前面也提到了高电平时会影响 P0 口，因此正常情况下，如果我们没有使用液晶的话，那么程序开始写一句 `LCD1602_E=0`，就可以避免1602 干扰到其它外设。我们之前的程序没有加这句，是因为我们板子在这个引脚上加了一个 `15K 的下拉电阻`，这个下拉电阻就可以保证这个引脚上电后默认是 `低电平`(但是在实际开发过程中，就不必要这样了。如果这是个实际产品，能用软件去处理的，我们就不会用硬件去实现)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221015001628.jpg) 

{% note blue 'fas fa-fan' flat %} 1602液晶的指令介绍 {% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221015123551.jpg) 

- 显示模式设置

写指令 `0x38`，设置 16x2 显示，5x7 点阵，8 位数据接口。这条指令对我们这个液晶来说是固定的，必须写 0x38(仔细看会发现我们的液晶实际上内部点阵是 5x8 的)

- 显示开/关以及光标设置指令

这里有 2 条指令，<span style="color:red;">第一条指令</span>，一个字节中 8 位，其中高 5 位是固定的 `0b00001`，低 3位我们分别用 `DCB 从高到低表示`， `D=1` 表示开显示， `D=0` 表示关显示； `C=1` 表示显示光标， `C=0` 表示不显示光标； `B=1` 表示光标闪烁， `B=0 `表示光标不闪烁；<span style="color:red;">第二条指令</span>，高 6 位是固定的 `0b000001`，低 2 位我们分别用  `NS 从高到低表示`，其中 `N=1 `表示读或者写一个字符后，指针自动加 1，光标自动加 1， `N=0 `表示读或者写一个字符 后指针自动减 1，光标自动减 1； `S=1` 表示写一个字符后，整屏显示左移(N=1)或右移(N=0)，以达到光标不移动而屏幕移动的效果，如同我们的计算器输入一样的效果，而  `S=0` 表示写一 个字符后，整屏显示不移动

- 清屏指令

固定的，写入 `0x01` 表示显示清屏，其中包含了数据指针清零，所有的显示清零。写入 `0x02` 则仅仅是数据指针清零，显示不清零

- RAM 地址设置指令

该指令码的 `最高位为 1`， `低 7 位为 RAM 的地址`，RAM 地址与液晶上字符的关系如上映射图所示。通常， `我们在读写数据之前都要先设置好地址，然后再进行数据的读写操作`

###  通信时序解析

所谓“时序”从字面意义上来理解，一是 `时间问题`，二是 `顺序问题`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221015144108.jpg) 

```cpp
//分析读操作
RS 引脚和 R/W 引脚，这两个引脚先进行变化，因为是读操作，所以 R/W 引脚首先要置为高电平，而不管它原来是什么。(读指令还是读数据，都是读操作，而且都有可能，所以 RS 引脚既有可能是置为高电平，也有可能是置为低电平)，而 RS 和 R/W 变化了经过 Tsp1 这么长时间后，使能引脚 E 才能从低电平到高电平发生变化，经过了 tD 这么长时间后，LCD1602 输出 DB 的数据就是有效数据了(就可以来读取 DB 的数据了)，读完了之后，我们要先把使能 E 拉低，经过一段时间后 RS、R/W 和 DB 才可以变化继续为下一次读写做准备了
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221015153636.jpg) 

```cpp
//分析写操作
写操作时序和读操作时序的差别，就是写操作时序中，DB 的改变是由单片机来完成的，因此要放到使能引脚 E 的变化之前进行操作
    如：
① 当我们要写指令字，设置LCD1602的工作方式时：需要把RS置为低电平，RW置为低电平，然后将数据送到数据口D0~D7，最后E引脚一个高脉冲将数据写入
② 当我们要写入数据字，在1602上实现显示时：需要把RS置为高电平，RW置为低电平，然后将数据送到数据口D0~D7，最后E引脚一个高脉冲将数据写入
    
1、注意时间轴，如果没有标明(其实大部分也都是不标明的)，那么从左往右的方向为时间正向轴，即时间在增长。
2、上图框出并注明了看懂此图的一些常识：
(1).时序图最左边一般是某一根引脚的标识，表示此行图线体现该引脚的变化，上图分别标明了RS、R/W、E、DB0~DB7四类引脚的时序变化。
(2).有线交叉状的部分，表示电平在变化，如上所标注。
(3).应该比较容易理解，如上图右上角所示，两条平行线分别对应高低电平，也正好吻合(2)中电平变化的说法。
(4).上图下，密封的菱形部分，注意要密封，表示数据有效，Valid Data这个词也显示了这点。
3、需要十分严重注意的是，时序图里各个引脚的电平变化，基于的时间轴是一致的。一定要严格按照时间轴的增长方向来精确地观察时序图。要让器件严格的遵守时序图的变化。在类似于18B20这样的单总线器件对此要求尤为严格。
4、以上几点，并不是LCD1602的时序图所特有的，绝大部分的时序图都遵循着这样的一般规则，所以要慢慢的习惯于这样的规则。    
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221015144127.jpg) 

```cpp
tC：指的是使能引脚 E 从本次上升沿到下次上升沿的最短时间是 400ns，而我们单片机
因为速度较慢，一个机器周期就是 1us 多，而一条 C 语言指令肯定是一个或者几个机器周期
的，所以这个条件完全满足。 
    
tPW：指的是使能引脚 E 高电平的持续时间最短是 150ns，同样由于我们的单片机比较
慢，这个条件也完全满足。 
    
tR, tF：指的是使能引脚 E 的上升沿时间和下降沿时间，不能超过 25ns，别看这个数很
小，其实这个时间限值是很宽裕的，我们实际用示波器测了一下开发板的这个引脚上升沿和
下降沿时间大概是 10ns 到 15ns 之间，完全满足。 
    
tSP1：指的是 RS 和 R/W 引脚使能后至少保持 30ns，使能引脚 E 才可以变成高电平，这
个条件同样也完全满足。 
    
tHD1：指的是使能引脚 E 变成低电平后，至少保持 10ns 之后，RS 和 R/W 才能进行变
化，这个条件也完全满足。 
    
tD：指的是使能引脚 E 变成高电平后，最多 100ns 后，1602 就把数据送出来了，那么我
们就可以正常去读取状态或者数据了。 
    
tHD2：指的是读操作过程中，使能引脚 E 变成低电平后，至少保持 20ns，DB 数据总线
才可以进行变化，这个条件也完全满足。
    
tSP2：指的是 DB 数据总线准备好后，至少保持 40ns，使能引脚 E 才可以从低到高进行
使能变化，这个条件也完全满足。 
    
tHD2：指的是写操作过程中，要引脚 E 变成低电平后，至少保持 10ns，DB 数据总线才
可以变化，这个条件也完全满足
```



```cpp
要懂得估计主控芯片的指令时间，可以在官方数据手册上查到MCU的一些级别参数。比如我们现在用STC51做为主控芯片，外部11.0592MHz晶振，指令周期就是一个时钟周期为(1/11.0592MHz)s，所以至少确定了它执行一条指令的时间是us级别的。我们看到，以上给的时间参数全部是ns级别的，所以即便我们在程序里不加延时程序，也应该可以很好的配合LCD1602的时序要求了
如何看这个表？
比如我们在时序图里可以找到TR1，对应时序参数表，可以查到这个是E上升沿/下降沿时间，最大值为25ns，表示E引脚上的电平变化，必须在最大为25ns之内的时间完成    
```



###  程序编写

简单显示

main.c
```cpp
# include <reg52.h>

# define LCD1602_DB  P0
sbit LCD1602_RS = P1^0;
sbit LCD1602_RW = P1^1;
sbit LCD1602_E  = P1^5;

void InitLcd1602();
void LcdShowStr(unsigned char x, unsigned char y, unsigned char *str);

void main()
{
    unsigned char str[] = "Kingst Studio";

    InitLcd1602();
    LcdShowStr(2, 0, str);
    LcdShowStr(0, 1, "Welcome to KST51");
    while (1);
}
/* 等待液晶准备好 */
void LcdWaitReady()
{
	static unsigned char sta;
	LCD1602_RS = 0;
	LCD1602_RW = 0;
	do{
		LCD1602_E = 1;	//使能
		sta = LCD1602_DB;	//读取状态字
		LCD1602_E = 0;	//读完撤销使能，防止液晶输出数据干扰 P0 总线
	}while(sta&0x80);	//最高位等于 1 表示液晶正忙，重复检测直到其等于 0 为止
	
	
     //读取状态字
        
   //bit7等于1表示液晶正忙，重复检测直到其等于0为止
}
/* 向LCD1602液晶写入一字节命令，cmd-待写入命令值 */
void LcdWriteCmd(unsigned char cmd)
{
    LcdWaitReady();
    LCD1602_RS = 0;
    LCD1602_RW = 0;
    LCD1602_DB = cmd;
    LCD1602_E  = 1;
    LCD1602_E  = 0;
}
/* 向LCD1602液晶写入一字节数据，dat-待写入数据值 */
void LcdWriteDat(unsigned char dat)
{
    LcdWaitReady();
    LCD1602_RS = 1;
    LCD1602_RW = 0;
    LCD1602_DB = dat;
    LCD1602_E  = 1;
    LCD1602_E  = 0;
}
/* 设置显示RAM起始地址，亦即光标位置，(x,y)-对应屏幕上的字符坐标 */
void LcdSetCursor(unsigned char x, unsigned char y)
{
    unsigned char addr;
    
    if (y == 0)  //由输入的屏幕坐标计算显示RAM的地址
        addr = 0x00 + x;  //第一行字符地址从0x00起始
    else
        addr = 0x40 + x;  //第二行字符地址从0x40起始
    LcdWriteCmd(addr | 0x80);  //设置RAM地址
}
/* 在液晶上显示字符串，(x,y)-对应屏幕上的起始坐标，str-字符串指针 */
void LcdShowStr(unsigned char x, unsigned char y, unsigned char *str)
{
    LcdSetCursor(x, y);   //设置起始地址
    while (*str != '\0')  //连续写入字符串数据，直到检测到结束符
    {
        LcdWriteDat(*str++);  //先取str指向的数据，然后str自加1,优先级一样从右往左
    }
}
/* 初始化1602液晶 */
void InitLcd1602()
{
    LcdWriteCmd(0x38);  //16*2显示，5*7点阵，8位数据接口
    LcdWriteCmd(0x0C);  //显示器开，光标关闭，闪烁关闭	0000 1100
    LcdWriteCmd(0x06);  //文字不动，地址自动+1 0000 0110
    LcdWriteCmd(0x01);  //清屏
}

```
 

实现左移

main.c

```cpp
# include <reg52.h>

# define LCD1602_DB  P0
sbit LCD1602_RS = P1^0;
sbit LCD1602_RW = P1^1;
sbit LCD1602_E  = P1^5;

unsigned char T0RH;	//高字节
unsigned char T0RL;	//低字节
bit flag500ms = 0;	//500ms标记
unsigned char code str1[] = "STM32 Nice";	//待显示第一行
unsigned char code str2[] = "Love You  ";	//待显示第二行需保持与第一行字符串等长，较短的行可用空格补齐

void Timer0_init(unsigned char ms);	
void InitLcd1602();
void LcdShowStr(unsigned char x, unsigned char y, unsigned char *str,unsigned char len);

void main()
{
	unsigned char i = 0;
	unsigned char index = 0;	//移动索引
	unsigned char buffer1[16+sizeof(str1)+16];//缓冲区(因为一行只能显示16个字符前面16个空格和后面16个是过渡)
	unsigned char buffer2[16+sizeof(str2)+16];
	EA = 1;	//总中断
	Timer0_init(10);	//定时10ms
	InitLcd1602();	//初始化液晶
	//缓冲区开头先填充空格
	for(i=0;i<16;i++)
	{
		buffer1[i]=' ';
		buffer2[i]=' ';
	}
	for(i=0;i<(sizeof(str1))-1;i++)
	{
		buffer1[16+i] = str1[i];
		buffer2[16+i] = str2[i];
	}
	for(i=(16+sizeof(str1)-1);i<sizeof(buffer2);i++)
	{
		buffer1[i]=' ';
		buffer2[i]=' ';
	}
	while(1)
	{
		if(flag500ms)//每500ms移动一次屏幕
		{
			flag500ms = 0;
			//从缓冲区抽出需显示的一段字符显示到液晶上
			LcdShowStr(0,0,buffer1+index,16);
			LcdShowStr(0,1,buffer2+index,16);
			index++;	//移动索引++
			if(index>=(16+sizeof(str1)-1))
			{//起始位置达到字符串尾部后即返回从头开始
				index = 0;
			}
			
		}
	}
	
	
}

void Timer0_init(unsigned char ms)
{
	unsigned long tmp;	//临时变量
	tmp = 11059200/12;
	tmp = 65536-(tmp*ms)/1000;
	tmp = tmp + 13;
	T0RH = (unsigned char)(tmp>>8);
	T0RL = (unsigned char)tmp;
	TMOD &= 0xF0;	//T0清除控制位
	TMOD |= 0x01;	//T0模式1
	TH0 = T0RH;	//重装载
	TL0 = T0RL;
	ET0 = 1;	//使能T0中断
	TR0 = 1;	//使能T0
}
/* 等待液晶准备好 */
void LcdWaitReady()
{
	unsigned char sta;
	LCD1602_DB = 0xFF;
	LCD1602_RS = 0;
	LCD1602_RW = 1;
	do{
		LCD1602_E = 1;	//使能
		sta = LCD1602_DB;	//读取状态字
		LCD1602_E = 0;	//读完撤销使能，防止液晶输出数据干扰 P0 总线
	}while(sta&0x80);	//最高位等于 1 表示液晶正忙，重复检测直到其等于 0 为止
	
	
     //读取状态字
        
   //bit7等于1表示液晶正忙，重复检测直到其等于0为止
}
/* 向LCD1602液晶写入一字节命令，cmd-待写入命令值 */
void LcdWriteCmd(unsigned char cmd)
{
    LcdWaitReady();
    LCD1602_RS = 0;
    LCD1602_RW = 0;
    LCD1602_DB = cmd;
    LCD1602_E  = 1;
    LCD1602_E  = 0;
}
/* 向LCD1602液晶写入一字节数据，dat-待写入数据值 */
void LcdWriteDat(unsigned char dat)
{
    LcdWaitReady();
    LCD1602_RS = 1;
    LCD1602_RW = 0;
    LCD1602_DB = dat;
    LCD1602_E  = 1;
    LCD1602_E  = 0;
}
/* 设置显示RAM起始地址，亦即光标位置，(x,y)-对应屏幕上的字符坐标 */
void LcdSetCursor(unsigned char x, unsigned char y)
{
    unsigned char addr;
    
    if (y == 0)  //由输入的屏幕坐标计算显示RAM的地址
        addr = 0x00 + x;  //第一行字符地址从0x00起始
    else
        addr = 0x40 + x;  //第二行字符地址从0x40起始
    LcdWriteCmd(addr | 0x80);  //设置RAM地址
}
/* 在液晶上显示字符串，(x,y)-对应屏幕上的起始坐标，str-字符串指针 len-需显示的字符长度*/
void LcdShowStr(unsigned char x, unsigned char y, unsigned char *str,unsigned char len)
{
    LcdSetCursor(x, y);   //设置起始地址
    while (len--)  //连续写入len个字符数据
    {
        LcdWriteDat(*str++);  //先取str指向的数据，然后str自加1
    }
}
/* 初始化1602液晶 */
void InitLcd1602()
{
    LcdWriteCmd(0x38);  //16*2显示，5*7点阵，8位数据接口
    LcdWriteCmd(0x0C);  //显示器开，光标关闭，闪烁关闭	0000 1100
    LcdWriteCmd(0x06);  //文字不动，地址自动+1 0000 0110
    LcdWriteCmd(0x01);  //清屏
}

void InterruptTimer0() interrupt 1
{
	static unsigned char cnt = 0;
	TH0 = T0RH;	//重装载
	TL0 = T0RL;
	cnt++;
	if(cnt>=50)
	{
		cnt = 0;
		flag500ms = 1;
	}
}

```
 

##  I2C与EEPROM

UART 通信多用于板间通信，比如单片机和电脑，这个设备和另外一个 设备之间的通信，I2C 多用于板内通信

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221015182607.jpg) 

I2C 总线是由时钟总线 `SCL` 和数据总线 `SDA` 两条线构成，连接到总线上的所 有器件的 SCL 都连到一起，所有 SDA 都连到一起，I2C 总线是 `开漏引脚并联` 的结构，因此我们外部要添加上拉电阻， `所有接入的器件保持高电平，这条线才是高电平，而任何一个器件 输出一个低电平，那这条线就会保持低电平，因此可以做到任何一个器件都可以拉低电平， 也就是任何一个器件都可以作为主机`；但绝大多数情况下我们都是用单片机来做主机， 而总线上挂的多个器件，每一个都像电话机一样有自己唯一的地址，在信息传输的过程中， 通过这唯一的地址就可以正常识别到属于自己的信息，在 KST-51 开发板上，就挂接了 2 个I2C 设备，一个是 `24C02`，一个是 `PCF8591`

I2C详见另一篇文章(软件模拟I2C)：

<post cid="101" cover="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221003140600.webp" />

###  EEPROM芯片

板子上的 EEPROM 器件型号是 `24C02`，设备地址高4位是固定的 `0b1010`，低3位由原理图可知是接地(即低电平)，所以设备地址是 `0b1010000`(0x50)，如果发送的这个地址确实存在，那么这个地址的器件应该回应一个 `ACK`(拉低 SDA 即输出“0”)，如果不存在，就没“人”回应 `ACK`(SDA将保持高电平即“1”)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221015214549.jpg) 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221015221322.jpg) 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221015215057.jpg) 

一般都是使用 EEPROM 来保存数据， 特点就是 `掉电后不丢失`，是一个容量大小是 `2Kbits`， 也就是 256 个字节的 EEPROM。一般情况下，EEPROM 拥有  `30 万到 100 万次` 的寿命，也就是它可以反复写入 30-100 万次，而 `读取次数是无限的`

```cpp
//EEPROM 写数据流程(按顺序!)
● 第一步，首先是 I2C 的起始信号，接着跟上首字节，也就是我们前边讲的 I2C 的器件地址，并且在读写方向上选择“写”操作。 

● 第二步，发送数据的存储地址。24C02 一共 256 个字节的存储空间，地址从 0x00～0xFF，我们想把数据存储在哪个位置，此刻写的就是哪个地址。 

● 第三步，发送要存储的数据第一个字节、第二个字节……注意在写数据的过程中，EEPROM 每个字节都会回应一个“应答位 0”，来告诉我们写 EEPROM 数据成功，如果没有回应答位，说明写入不成功。 

在写数据的过程中，每成功写入一个字节，EEPROM 存储空间的地址就会自动加 1，当加到 0xFF 后，再写一个字节，地址会溢出又变成了 0x00
```

```cpp
//EEPROM 读数据流程(按顺序!)
● 第一步，首先是 I2C 的起始信号，接着跟上首字节，也就是我们前边讲的 I2C 的器件地址，并且在读写方向上选择“写”操作。
    这个地方可能有同学会诧异，我们明明是读数据为何方向也要选“写”呢？刚才说过了，24C02 一共有 256 个地址，我们选择写操作，是为了把所要读的数据的存储地址先写进去，告诉 EEPROM 我们要读取哪个地址的数据。这就如同我们打电话，先拨总机号码（EEPROM 器件地址），而后还要继续拨分机号码（数据地址），而拨分机号码这个动作，主机仍然是发送方，方向依然是“写”。 

● 第二步，发送要读取的数据的地址，注意是地址而非存在 EEPROM 中的数据，通知 EEPROM 我要哪个分机的信息。 

● 第三步，重新发送 I2C 起始信号和器件地址，并且在方向位选择“读”操作。 

这三步当中，每一个字节实际上都是在“写”，所以每一个字节 EEPROM 都会回应一个“应答位 0”。 

● 第四步，读取从器件发回的数据，读一个字节，如果还想继续读下一个字节，就发送一个“应答位 ACK(0)”，如果不想读了，告诉 EEPROM，我不想要数据了，别再发数据了，那就发送一个“非应答位 NAK(1)”。 
```

```cpp
//注意
A、在本例中单片机是主机，24C02 是从机；
B、无论是读是写，SCL 始终都是由主机控制的；
C、写的时候应答信号由 从机 给出，表示从机是否正确接收了数据；
D、读的时候应答信号则由 主机 给出，表示是否继续读下去。
```



###  程序编写

很明显也就是要求 SCL 的高低电平持续时间都不短于 `5us`，因此我们在时序函 数中通过插入 `I2CDelay()` 这个总线延时函数，加上改变 SCL 值语句本身占用的至少一个周期，来达到这个速度限制。如果以后需要提高速度，那么只需要减小这里的总线延时时间即可

- 0x50 是：0101 0000 左移一位后(写:0 读:1)：1010 0000，这个程序只是测试设备地址所以读或者写都可以，为了方便这里程序使用 `<<1`，表示写

main.c

```cpp
/*
寻址I2C总线上存在的和不存在的地址，将应答状态显示到液晶上
*/

# include <reg52.h>
# include <intrins.h>

# define I2CDelay()  {_nop_();_nop_();_nop_();_nop_();}	//延时4us
sbit I2C_SCL = P3^7;
sbit I2C_SDA = P3^6;

bit I2CAddressing(unsigned char addr);
extern void InitLcd1602();
extern void LcdShowStr(unsigned char x, unsigned char y, unsigned char *str);

void main()
{
    bit ack;
    unsigned char str[10];

    InitLcd1602();   //初始化液晶
    
    ack = I2CAddressing(0x50); //查询地址为0x50的器件
    str[0] = '5';              //将地址和应答值转换为字符串
    str[1] = '0';
    str[2] = ':';
    str[3] = (unsigned char)ack + '0';
    str[4] = '\0';
    LcdShowStr(0, 0, str);     //显示到液晶上
    
    ack = I2CAddressing(0x62); //查询地址为0x62的器件
    str[0] = '6';              //将地址和应答值转换为字符串
    str[1] = '2';
    str[2] = ':';
    str[3] = (unsigned char)ack + '0';
    str[4] = '\0';
    LcdShowStr(8, 0, str);     //显示到液晶上
    
    while (1);
}
/* 产生总线起始信号 */
void I2CStart()
{
    I2C_SDA = 1; //首先确保SDA、SCL都是高电平
    I2C_SCL = 1;
    I2CDelay();
    I2C_SDA = 0; //先拉低SDA
    I2CDelay();
    I2C_SCL = 0; //再拉低SCL
}
/* 产生总线停止信号 */
void I2CStop()
{
    I2C_SCL = 0; //首先确保SDA、SCL都是低电平
    I2C_SDA = 0;
    I2CDelay();
    I2C_SCL = 1; //先拉高SCL
    I2CDelay();
    I2C_SDA = 1; //再拉高SDA
    I2CDelay();
}
/* I2C总线写操作，dat-待写入字节，返回值-从机应答位的值 */
bit I2CWrite(unsigned char dat)
{
    bit ack;  //用于暂存应答位的值
    unsigned char mask;  //用于探测字节内某一位值的掩码变量

    for (mask=0x80; mask!=0; mask>>=1) //从高位到低位依次进行
    {
        if ((mask&dat) == 0)  //该位的值输出到SDA上
            I2C_SDA = 0;
        else
            I2C_SDA = 1;
        I2CDelay();1
        I2C_SCL = 1;          //拉高SCL
        I2CDelay();
        I2C_SCL = 0;          //再拉低SCL，完成一个位周期
    }
    I2C_SDA = 1;   //8位数据发送完后，主机释放SDA，以检测从机应答(因为应答是拉低，所以拉高才能判断会不会被拉低待会)
    I2CDelay();
    I2C_SCL = 1;   //拉高SCL
    ack = I2C_SDA; //读取此时的SDA值，即为从机的应答值
    I2CDelay();
    I2C_SCL = 0;   //再拉低SCL完成应答位，并保持住总线

    return ack;    //返回从机应答值
}
/* I2C寻址函数，即检查地址为addr的器件是否存在，返回值-从器件应答值 */
bit I2CAddressing(unsigned char addr)
{
    bit ack;

    I2CStart();  //产生起始位，即启动一次总线操作
    ack = I2CWrite(addr<<1);  //器件地址需左移一位，因寻址命令的最低位
                              //为读写位，用于表示之后的操作是读或写
    I2CStop();   //不需进行后续读写，而直接停止本次总线操作
    
    return ack;
}

```
 

Lcd1602.c

```cpp
# include <reg52.h>

# define LCD1602_DB  P0
sbit LCD1602_RS = P1^0;
sbit LCD1602_RW = P1^1;
sbit LCD1602_E  = P1^5;

/* 等待液晶准备好 */
void LcdWaitReady()
{
    unsigned char sta;
    
    LCD1602_DB = 0xFF;
    LCD1602_RS = 0;
    LCD1602_RW = 1;
    do {
        LCD1602_E = 1;
        sta = LCD1602_DB; //读取状态字
        LCD1602_E = 0;
    } while (sta & 0x80); //bit7等于1表示液晶正忙，重复检测直到其等于0为止
}
/* 向LCD1602液晶写入一字节命令，cmd-待写入命令值 */
void LcdWriteCmd(unsigned char cmd)
{
    LcdWaitReady();
    LCD1602_RS = 0;
    LCD1602_RW = 0;
    LCD1602_DB = cmd;
    LCD1602_E  = 1;
    LCD1602_E  = 0;
}
/* 向LCD1602液晶写入一字节数据，dat-待写入数据值 */
void LcdWriteDat(unsigned char dat)
{
    LcdWaitReady();
    LCD1602_RS = 1;
    LCD1602_RW = 0;
    LCD1602_DB = dat;
    LCD1602_E  = 1;
    LCD1602_E  = 0;
}
/* 设置显示RAM起始地址，亦即光标位置，(x,y)-对应屏幕上的字符坐标 */
void LcdSetCursor(unsigned char x, unsigned char y)
{
    unsigned char addr;
    
    if (y == 0)  //由输入的屏幕坐标计算显示RAM的地址
        addr = 0x00 + x;  //第一行字符地址从0x00起始
    else
        addr = 0x40 + x;  //第二行字符地址从0x40起始
    LcdWriteCmd(addr | 0x80);  //设置RAM地址
}
/* 在液晶上显示字符串，(x,y)-对应屏幕上的起始坐标，str-字符串指针 */
void LcdShowStr(unsigned char x, unsigned char y, unsigned char *str)
{
    LcdSetCursor(x, y);   //设置起始地址
    while (*str != '\0')  //连续写入字符串数据，直到检测到结束符
    {
        LcdWriteDat(*str++);
    }
}
/* 初始化1602液晶 */
void InitLcd1602()
{
    LcdWriteCmd(0x38);  //16*2显示，5*7点阵，8位数据接口
    LcdWriteCmd(0x0C);  //显示器开，光标关闭
    LcdWriteCmd(0x06);  //文字不动，地址自动+1
    LcdWriteCmd(0x01);  //清屏
}

```
 

- 用单字节读写模式访问EEPROM，每次+1后写回,每次开机都会把数据读取出来然后又加1，`Lcd1602.c`不变
- 这里跟多字节写入有点区别，因为只写入一个字节，而且上电后重新写入的时间肯定超过 `5ms`，所以这里不用对应答位做处理

i2c.c

```cpp
# include <reg52.h>
# include <intrins.h>

# define I2CDelay()  {_nop_();_nop_();_nop_();_nop_();}
sbit I2C_SCL = P3^7;
sbit I2C_SDA = P3^6;

/* 产生总线起始信号 */
void I2CStart()
{
    I2C_SDA = 1; //首先确保SDA、SCL都是高电平
    I2C_SCL = 1;
    I2CDelay();
    I2C_SDA = 0; //先拉低SDA
    I2CDelay();
    I2C_SCL = 0; //再拉低SCL
}
/* 产生总线停止信号 */
void I2CStop()
{
    I2C_SCL = 0; //首先确保SDA、SCL都是低电平
    I2C_SDA = 0;
    I2CDelay();
    I2C_SCL = 1; //先拉高SCL
    I2CDelay();
    I2C_SDA = 1; //再拉高SDA
    I2CDelay();
}
/* I2C总线写操作，dat-待写入字节，返回值-从机应答位的值 */
bit I2CWrite(unsigned char dat)
{
    bit ack;  //用于暂存应答位的值
    unsigned char mask;  //用于探测字节内某一位值的掩码变量

    for (mask=0x80; mask!=0; mask>>=1) //从高位到低位依次进行
    {
        if ((mask&dat) == 0)  //该位的值输出到SDA上
            I2C_SDA = 0;
        else
            I2C_SDA = 1;
        I2CDelay();
        I2C_SCL = 1;          //拉高SCL
        I2CDelay();
        I2C_SCL = 0;          //再拉低SCL，完成一个位周期
    }
    I2C_SDA = 1;   //8位数据发送完后，主机释放SDA，以检测从机应答
    I2CDelay();
    I2C_SCL = 1;   //拉高SCL
    ack = I2C_SDA; //读取此时的SDA值，即为从机的应答值
    I2CDelay();
    I2C_SCL = 0;   //再拉低SCL完成应答位，并保持住总线

    return (~ack); //应答值取反以符合通常的逻辑：
                   //0=不存在或忙或写入失败，1=存在且空闲或写入成功
}
/* I2C总线读操作，并发送非应答信号，返回值-读到的字节 */
unsigned char I2CReadNAK()
{
    unsigned char mask;
    unsigned char dat;

    I2C_SDA = 1;  //首先确保主机释放SDA
    for (mask=0x80; mask!=0; mask>>=1) //从高位到低位依次进行
    {
        I2CDelay();
        I2C_SCL = 1;      //拉高SCL
        if(I2C_SDA == 0)  //读取SDA的值
            dat &= ~mask; //为0时，dat中对应位清零
        else
            dat |= mask;  //为1时，dat中对应位置1
        I2CDelay();
        I2C_SCL = 0;      //再拉低SCL，以使从机发送出下一位
    }
    I2C_SDA = 1;   //8位数据发送完后，拉高SDA，发送非应答信号
    I2CDelay();
    I2C_SCL = 1;   //拉高SCL
    I2CDelay();
    I2C_SCL = 0;   //再拉低SCL完成非应答位，并保持住总线

    return dat;
}
/* I2C总线读操作，并发送应答信号，返回值-读到的字节 */
unsigned char I2CReadACK()
{
    unsigned char mask;
    unsigned char dat;

    I2C_SDA = 1;  //首先确保主机释放SDA
    for (mask=0x80; mask!=0; mask>>=1) //从高位到低位依次进行
    {
        I2CDelay();
        I2C_SCL = 1;      //拉高SCL
        if(I2C_SDA == 0)  //读取SDA的值
            dat &= ~mask; //为0时，dat中对应位清零
        else
            dat |= mask;  //为1时，dat中对应位置1
        I2CDelay();
        I2C_SCL = 0;      //再拉低SCL，以使从机发送出下一位
    }
    I2C_SDA = 0;   //8位数据发送完后，拉低SDA，发送应答信号
    I2CDelay();
    I2C_SCL = 1;   //拉高SCL
    I2CDelay();
    I2C_SCL = 0;   //再拉低SCL完成应答位，并保持住总线

    return dat;
}

```
 
main.c

```cpp
/*
用单字节读写模式访问EEPROM，每次+1后写回,每次开机都会把数据读取出来然后又加1
*/

# include <reg52.h>

extern void InitLcd1602();
extern void LcdShowStr(unsigned char x, unsigned char y, unsigned char *str);
extern void I2CStart();
extern void I2CStop();
extern unsigned char I2CReadNAK();
extern bit I2CWrite(unsigned char dat);
unsigned char E2ReadByte(unsigned char addr);
void E2WriteByte(unsigned char addr, unsigned char dat);

void main()
{
    unsigned char dat;
    unsigned char str[10];

    InitLcd1602();   //初始化液晶
    dat = E2ReadByte(0x02);    //读取指定地址上的一个字节
    str[0] = (dat/100) + '0';  //转换为十进制字符串格式
    str[1] = (dat/10%10) + '0';
    str[2] = (dat%10) + '0';
    str[3] = '\0';
    LcdShowStr(0, 0, str);     //显示在液晶上
    dat++;                     //将其数值+1
    E2WriteByte(0x02, dat);    //再写回到对应的地址上
    
    while (1);
}

/* 读取EEPROM中的一个字节，addr-字节地址 */
unsigned char E2ReadByte(unsigned char addr)
{
    unsigned char dat;
    
    I2CStart();
    I2CWrite(0x50<<1); //寻址器件，后续为写操作
    I2CWrite(addr);    //写入存储地址
    I2CStart();        //发送重复启动信号
    I2CWrite((0x50<<1)|0x01); //寻址器件，后续为读操作
    dat = I2CReadNAK();       //读取一个字节数据
    I2CStop();
    
    return dat;
}
/* 向EEPROM中写入一个字节，addr-字节地址 */
void E2WriteByte(unsigned char addr, unsigned char dat)
{
    I2CStart();
    I2CWrite(0x50<<1); //寻址器件，后续为写操作
    I2CWrite(addr);    //写入存储地址
    I2CWrite(dat);     //写入一个字节数据
    I2CStop();
}
```
 

EEPROM多字节读写操作时序，只需改变 `main.c`

- 给 EEPROM 发送数据后，先保存在了 EEPROM的缓存里，EEPROM 必须要把缓存中的数据搬移到“非易失”的区域，才能达到掉电不丢失的效果。而往非易失区域写需要一定的时间，每种器件不完全一样，24C02 的 这个写入时间最高不超过 `5ms` (在往非易失区域写的过程，EEPROM 是不会再响应我们的访问的，不仅接收不到我们的数据，我们即使用 I 2C 标准的寻址模式去寻址，EEPROM 都不会 应答，就如同这个总线上没有这个器件一样。数据写入非易失区域完毕后，EEPROM 再次恢 复正常，可以正常读写了)

- `MemToStr`函数 把每一个字节的数据高 4 位 和低 4 位分开，和 9 进行比较，如果小于等于 9，则直接加‘0’转为 0～9 的 ASCII 码；如果 大于 9，则先减掉 10 再加‘A’即可转为 A～F 的 ASCII 码

main.c

```cpp
/*
用多字节读写模式访问EEPROM，依次+1,+2,+3...后写回
*/

# include <reg52.h>

extern void InitLcd1602();
extern void LcdShowStr(unsigned char x, unsigned char y, unsigned char *str);
extern void I2CStart();
extern void I2CStop();
extern unsigned char I2CReadACK();
extern unsigned char I2CReadNAK();
extern bit I2CWrite(unsigned char dat);
void E2Read(unsigned char *buf, unsigned char addr, unsigned char len);
void E2Write(unsigned char *buf, unsigned char addr, unsigned char len);
void MemToStr(unsigned char *str, unsigned char *src, unsigned char len);

void main()
{
    unsigned char i;
    unsigned char buf[5];
    unsigned char str[20];

    InitLcd1602();   //初始化液晶
    E2Read(buf, 0x90, sizeof(buf));   //从E2中读取一段数据
    MemToStr(str, buf, sizeof(buf));  //转换为十六进制字符串
    LcdShowStr(0, 0, str);            //显示到液晶上
    for (i=0; i<sizeof(buf); i++)     //数据依次+1,+2,+3...
    {
        buf[i] = buf[i] + 1 + i;
    }
    E2Write(buf, 0x90, sizeof(buf));  //再写回到E2中
    
    while(1);
}
/* 将一段内存数据转换为十六进制格式的字符串，
   str-字符串指针，src-源数据地址，len-数据长度 */
void MemToStr(unsigned char *str, unsigned char *src, unsigned char len)
{
    unsigned char tmp;

    while (len--)
    {
        tmp = *src >> 4;           //先取高4位
        if (tmp <= 9)              //转换为0-9或A-F
            *str++ = tmp + '0';
        else
            *str++ = tmp - 10 + 'A';
        tmp = *src & 0x0F;         //再取低4位
        if (tmp <= 9)              //转换为0-9或A-F
            *str++ = tmp + '0';
        else
            *str++ = tmp - 10 + 'A';
        *str++ = ' ';              //转换完一个字节添加一个空格
        src++;
    }
	*str = '\0';                   //添加字符串结束符
}
/* E2读取函数，buf-数据接收指针，addr-E2中的起始地址，len-读取长度 */
void E2Read(unsigned char *buf, unsigned char addr, unsigned char len)
{
    do {                       //用寻址操作查询当前是否可进行读写操作
        I2CStart();
        if (I2CWrite(0x50<<1)) //应答则跳出循环，非应答则进行下一次查询
        {
            break;
        }
        I2CStop();
    } while(1);
    I2CWrite(addr);            //写入起始地址
    I2CStart();                //发送重复启动信号
    I2CWrite((0x50<<1)|0x01);  //寻址器件，后续为读操作
    while (len > 1)            //连续读取len-1个字节
    {
        *buf++ = I2CReadACK(); //最后字节之前为读取操作+应答
        len--;
    }
    *buf = I2CReadNAK();       //最后一个字节为读取操作+非应答
    I2CStop();
}
/* E2写入函数，buf-源数据指针，addr-E2中的起始地址，len-写入长度 */
void E2Write(unsigned char *buf, unsigned char addr, unsigned char len)
{
    while (len--)
    {
        do {                       //用寻址操作查询当前是否可进行读写操作
            I2CStart();
            if (I2CWrite(0x50<<1)) //应答则跳出循环，非应答则进行下一次查询
            {
                break;
            }
            I2CStop();
        } while(1);
        I2CWrite(addr++);  //写入起始地址
        I2CWrite(*buf++);  //写入一个字节数据
        I2CStop();         //结束写操作，以等待写入完成
    }
}

```
 

EEPROM 的页写入

- 24C01、24C02 这两个型号是 8 个字节一个页，256个字节一共32页
- 分配好页之后，如果我们在同一个页内连续写入几个字节后，最后再发送停止位的时序。EEPROM 检测到这个停止位后，就会一次性把这一页的数据写到非易失区域，就不需要像上面那样写一个字节检测一次了，并且页写入的时间也不会超过 5ms。如果我们写入的数据跨页了，那么写完了一页之后，我们要发送一个停止位，然后等待并且检测 EEPROM 的空闲模式，一直等到把上一页数据完全写到非易失区域后，再进行下一页的写入，这样就可以在很大程度上提高数据的写入效率

eeprom.c

```cpp
/*
EEPROM芯片24C02读写驱动模块
*/
# include <reg52.h>

extern void I2CStart();
extern void I2CStop();
extern unsigned char I2CReadACK();
extern unsigned char I2CReadNAK();
extern bit I2CWrite(unsigned char dat);

/* E2读取函数，buf-数据接收指针，addr-E2中的起始地址，len-读取长度 */
void E2Read(unsigned char *buf, unsigned char addr, unsigned char len)
{
    do {                       //用寻址操作查询当前是否可进行读写操作
        I2CStart();
        if (I2CWrite(0x50<<1)) //应答则跳出循环，非应答则进行下一次查询
        {
            break;
        }
        I2CStop();
    } while(1);
    I2CWrite(addr);            //写入起始地址
    I2CStart();                //发送重复启动信号
    I2CWrite((0x50<<1)|0x01);  //寻址器件，后续为读操作
    while (len > 1)            //连续读取len-1个字节
    {
        *buf++ = I2CReadACK(); //最后字节之前为读取操作+应答
        len--;
    }
    *buf = I2CReadNAK();       //最后一个字节为读取操作+非应答
    I2CStop();
}
/* E2写入函数，buf-源数据指针，addr-E2中的起始地址，len-写入长度 */
void E2Write(unsigned char *buf, unsigned char addr, unsigned char len)
{
    while (len > 0)
    {
        //等待上次写入操作完成
        do {                       //用寻址操作查询当前是否可进行读写操作
            I2CStart();
            if (I2CWrite(0x50<<1)) //应答则跳出循环，非应答则进行下一次查询
            {
                break;
            }
            I2CStop();
        } while(1);
        //按页写模式连续写入字节
        I2CWrite(addr);           //写入起始地址
        while (len > 0)
        {
            I2CWrite(*buf++);     //写入一个字节数据
            len--;                //待写入长度计数递减
            addr++;               //E2地址递增
            if ((addr&0x07) == 0) //检查地址是否到达页边界，24C02每页8字节，
            {                     //所以检测低3位是否为零即可
                break;            //到达页边界时，跳出循环，结束本次写操作
            }
        }
        I2CStop();
    }
}

```
 

main.c

```cpp
/*
用连续读与分页写模式访问EEPROM，依次+1,+2,+3...后写回
*/

# include <reg52.h>

extern void InitLcd1602();
extern void LcdShowStr(unsigned char x, unsigned char y, unsigned char *str);
extern void E2Read(unsigned char *buf, unsigned char addr, unsigned char len);
extern void E2Write(unsigned char *buf, unsigned char addr, unsigned char len);
void MemToStr(unsigned char *str, unsigned char *src, unsigned char len);

void main()
{
    unsigned char i;
    unsigned char buf[5];
    unsigned char str[20];

    InitLcd1602();   //初始化液晶
    E2Read(buf, 0x8E, sizeof(buf));   //从E2中读取一段数据
    MemToStr(str, buf, sizeof(buf));  //转换为十六进制字符串
    LcdShowStr(0, 0, str);            //显示到液晶上
    for (i=0; i<sizeof(buf); i++)     //数据依次+1,+2,+3...
    {
        buf[i] = buf[i] + 1 + i;
    }
    E2Write(buf, 0x8E, sizeof(buf));  //再写回到E2中
    
    while(1);
}
/* 将一段内存数据转换为十六进制格式的字符串，
   str-字符串指针，src-源数据地址，len-数据长度 */
void MemToStr(unsigned char *str, unsigned char *src, unsigned char len)
{
    unsigned char tmp;

    while (len--)
    {
        tmp = *src >> 4;           //先取高4位
        if (tmp <= 9)              //转换为0-9或A-F
            *str++ = tmp + '0';
        else
            *str++ = tmp - 10 + 'A';
        tmp = *src & 0x0F;         //再取低4位
        if (tmp <= 9)              //转换为0-9或A-F
            *str++ = tmp + '0';
        else
            *str++ = tmp - 10 + 'A';
        *str++ = ' ';              //转换完一个字节添加一个空格
        src++;
    }
	*str = '\0';                   //添加字符串结束符
}

```
 

##  综合实例-红绿灯+EEPROM

uart.c

```cpp
# include <reg52.h>

bit flagFrame = 0;  //帧接收完成标志，即接收到一帧新数据
bit flagTxd = 0;    //单字节发送完成标志，用来替代TXD中断标志位
unsigned char cntRxd = 0;   //接收字节计数器
unsigned char pdata bufRxd[64];  //接收字节缓冲区

extern void UartAction(unsigned char *buf, unsigned char len);

/* 串口配置函数，baud-通信波特率 */
void ConfigUART(unsigned int baud)
{
    SCON  = 0x50;  //配置串口为模式1
    TMOD &= 0x0F;  //清零T1的控制位
    TMOD |= 0x20;  //配置T1为模式2
    TH1 = 256 - (11059200/12/32)/baud;  //计算T1重载值
    TL1 = TH1;     //初值等于重载值
    ET1 = 0;       //禁止T1中断
    ES  = 1;       //使能串口中断
    TR1 = 1;       //启动T1
}
/* 串口数据写入，即串口发送函数，buf-待发送数据的指针，len-指定的发送长度 */
void UartWrite(unsigned char *buf, unsigned char len)
{
    while (len--)  //循环发送所有字节
    {
        flagTxd = 0;      //清零发送标志
        SBUF = *buf++;    //发送一个字节数据
        while (!flagTxd); //等待该字节发送完成
    }
}
/* 串口数据读取函数，buf-接收指针，len-指定的读取长度，返回值-实际读到的长度 */
unsigned char UartRead(unsigned char *buf, unsigned char len)
{
    unsigned char i;
    
    if (len > cntRxd)  //指定读取长度大于实际接收到的数据长度时，
    {                  //读取长度设置为实际接收到的数据长度
        len = cntRxd;
    }
    for (i=0; i<len; i++)  //拷贝接收到的数据到接收指针上
    {
        *buf++ = bufRxd[i];
    }
    cntRxd = 0;  //接收计数器清零
    
    return len;  //返回实际读取长度
}
/* 串口接收监控，由空闲时间判定帧结束，需在定时中断中调用，ms-定时间隔 */
void UartRxMonitor(unsigned char ms)
{
    static unsigned char cntbkp = 0;
    static unsigned char idletmr = 0;

    if (cntRxd > 0)  //接收计数器大于零时，监控总线空闲时间
    {
        if (cntbkp != cntRxd)  //接收计数器改变，即刚接收到数据时，清零空闲计时
        {
            cntbkp = cntRxd;
            idletmr = 0;
        }
        else                   //接收计数器未改变，即总线空闲时，累积空闲时间
        {
            if (idletmr < 30)  //空闲计时小于30ms时，持续累加
            {
                idletmr += ms;
                if (idletmr >= 30)  //空闲时间达到30ms时，即判定为一帧接收完毕
                {
                    flagFrame = 1;  //设置帧接收完成标志
                }
            }
        }
    }
    else
    {
        cntbkp = 0;
    }
}
/* 串口驱动函数，监测数据帧的接收，调度功能函数，需在主循环中调用 */
void UartDriver()
{
    unsigned char len;
    unsigned char pdata buf[40];

    if (flagFrame) //有命令到达时，读取处理该命令
    {
        flagFrame = 0;
        len = UartRead(buf, sizeof(buf));  //将接收到的命令读取到缓冲区中
        UartAction(buf, len);  //传递数据帧，调用动作执行函数
    }
}
/* 串口中断服务函数 */
void InterruptUART() interrupt 4
{
    if (RI)  //接收到新字节
    {
        RI = 0;  //清零接收中断标志位
        if (cntRxd < sizeof(bufRxd)) //接收缓冲区尚未用完时，
        {                            //保存接收字节，并递增计数器
            bufRxd[cntRxd++] = SBUF;
        }
    }
    if (TI)  //字节发送完毕
    {
        TI = 0;   //清零发送中断标志位
        flagTxd = 1;  //设置字节发送完成标志
    }
}
```
 
main.c

```cpp
/*

从EEPROM地址0x10起始保存保存3种灯的亮灯时间，读取时检查其有效性
通过UART串口命令可以分别修改3种时间，接收命令时同样检查其有效性
时间设定命令为“setr xx”、“setg xx”、“sety xx” (xx为两位有效数字)
*/

# include <reg52.h>

sbit  ADDR3 = P1^3;
sbit  ENLED = P1^4;

unsigned char code LedChar[] = {  //数码管显示字符转换表
    0xC0, 0xF9, 0xA4, 0xB0, 0x99, 0x92, 0x82, 0xF8,
    0x80, 0x90, 0x88, 0x83, 0xC6, 0xA1, 0x86, 0x8E
};
unsigned char LedBuff[7] = {  //数码管+独立LED显示缓冲区
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
};
bit flag1s = 1;          //1秒定时标志
unsigned char T0RH = 0;  //T0重载值的高字节
unsigned char T0RL = 0;  //T0重载值的低字节
unsigned char RedTime, GrnTime, YlwTime; //红灯、绿灯、黄灯的设定时间

void ConfigTimer0(unsigned int ms);
void GetLightTime();
void TrafficLight();
extern void E2Read(unsigned char *buf, unsigned char addr, unsigned char len);
extern void E2Write(unsigned char *buf, unsigned char addr, unsigned char len);
extern void UartDriver();
extern void ConfigUART(unsigned int baud);
extern void UartRxMonitor(unsigned char ms);
extern void UartWrite(unsigned char *buf, unsigned char len);

void main()
{
    EA = 1;            //开总中断
    ENLED = 0;         //使能数码管和独立LED
    ADDR3 = 1;
    ConfigTimer0(1);   //配置T0定时1ms
    ConfigUART(9600);  //配置波特率为9600
    GetLightTime();    //获取交通灯设定时间
    
    while (1)
    {
        UartDriver();  //调用串口驱动
        if (flag1s)    //每秒执行一次交通灯刷新
        {
            flag1s = 0;
            TrafficLight();
        }
    }
}
/* 从E2PROM中获取设定的灯亮时间 */
void GetLightTime()
{
    unsigned char buf[4];
    
    E2Read(buf, 0x10, 3);  //从地址0x10开始的3个字节保存三种灯的时间
    if ((buf[0]<1) || (buf[0]>99))  //检查红灯时间是否有效，有效范围1～99
        RedTime = 30;       //无效时，取默认值30
    else
        RedTime = buf[0];   //有效时，取该设定值
    
    if ((buf[1]<1) || (buf[1]>99))  //检查绿灯时间是否有效，有效范围1～99
        GrnTime = 40;       //无效时，取默认值40
    else
        GrnTime = buf[1];   //有效时，取该设定值
    
    if ((buf[2]<1) || (buf[2]>10))  //检查黄灯时间是否有效，有效范围1～10
        YlwTime = 3;        //无效时，取默认值3
    else
        YlwTime = buf[2];   //有效时，取该设定值
}
/* 设置灯亮时间，保存时间到E2并更新当前值
   str-包含设定时间数值的字符串指针，light-灯颜色索引
   返回值-时间已正确设定返回1，否则返回0 */
unsigned char SetLightTime(unsigned char *str, unsigned char light)
{
    unsigned char i;
    unsigned char tmp = 0;
    unsigned char result = 0;
    
    for (i=0; i<2; i++)  //最多取两位字符，转换为单字节数值
    {
        if ((*str >= '0') && (*str <= '9'))  //0~9为有效字符
        {
            tmp *= 10;         //先前的数据扩大10倍，即按十进制左移1位
            tmp += (*str-'0'); //当前字符数值填充到个位上
            str++;             //字符指针递增，准备下一次检测
        }
        else  //遇到无效字符即退出
        {
            break;
        }
    }
    switch (light)  //检查设定值是否有效
    {
        case 0:  //检查红灯时间
            if ((tmp>=1) && (tmp<=99))
            {
                RedTime = tmp;
                result = 1;
            }
            break;
        case 1:  //检查绿灯时间
            if ((tmp>=1) && (tmp<=99))
            {
                GrnTime = tmp;
                result = 1;
            }
            break;
        case 2:  //检查黄灯时间
            if ((tmp>=1) && (tmp<=10))
            {
                YlwTime = tmp;
                result = 1;
            }
            break;
        default:
            break;
    }
    if (result != 0)  //如果设定值有效则同时保存到E2中
    {
        E2Write(&tmp, 0x10+light, 1);
    }
    
    return result;
}

/* 交通灯显示刷新函数 */
void TrafficLight()
{
    static unsigned char color = 2;  //颜色索引：0-绿色/1-黄色/2-红色
    static unsigned char timer = 0;  //倒计时定时器
    
    if (timer == 0) //倒计时到0时，切换交通灯
    {
        switch (color)  //LED8/9代表绿灯，LED5/6代表黄灯，LED2/3代表红灯
        {
            case 0:     //切换到黄色
                color = 1;
                timer = YlwTime - 1;
                LedBuff[6] = 0xE7;
                break;
            case 1:     //切换到红色
                color = 2;
                timer = RedTime - 1;
                LedBuff[6] = 0xFC;
                break;
            case 2:     //切换到绿色
                color = 0;
                timer = GrnTime - 1;
                LedBuff[6] = 0x3F;
                break;
            default:
                break;
        }
    }
    else  //倒计时未到0时，递减其计数值
    {
        timer--;
    }
    LedBuff[0] = LedChar[timer%10];  //倒计时数值个位显示
    LedBuff[1] = LedChar[timer/10];  //倒计时数值十位显示
}
/* 内存比较函数，比较两个指针所指向的内存数据是否相同，
   ptr1-待比较指针1，ptr2-待比较指针2，len-待比较长度
   返回值-两段内存数据完全相同时返回1，不同返回0 */
bit CmpMemory(unsigned char *ptr1, unsigned char *ptr2, unsigned char len)
{
    while (len--)
    {
        if (*ptr1++ != *ptr2++)  //遇到不相等数据时即刻返回0
        {
            return 0;
        }
    }
    return 1;  //比较完全部长度数据都相等则返回1
}
/* 串口动作函数，根据接收到的命令帧执行响应的动作
   buf-接收到的命令帧指针，len-命令帧长度 */
void UartAction(unsigned char *buf, unsigned char len)
{
    unsigned char i;
    unsigned char code cmd0[] = "setr ";  //设置红灯时间
    unsigned char code cmd1[] = "setg ";  //设置绿灯时间
    unsigned char code cmd2[] = "sety ";  //设置黄灯时间
    unsigned char code cmdLen[] = {       //命令长度汇总表
        sizeof(cmd0)-1, sizeof(cmd1)-1, sizeof(cmd2)-1,
    };
    unsigned char code *cmdPtr[] = {      //命令指针汇总表
        &cmd0[0],  &cmd1[0], &cmd2[0],
    };

    for (i=0; i<sizeof(cmdLen); i++)  //遍历命令列表，查找相同命令
    {
        if (len >= cmdLen[i])  //首先接收到的数据长度要不小于命令长度
        {
            if (CmpMemory(buf, cmdPtr[i], cmdLen[i]))  //比较相同时退出循环
            {
                break;
            }
        }
    }
    if (i < sizeof(cmdLen))
    {
        buf[len] = '\0';     //为接收到的字符串添加结束符
        if (SetLightTime(buf+cmdLen[i], i) != 0)
        {
            buf[len++] = '\r';  //有效命令被执行后，在原命令帧之后添加
            buf[len++] = '\n';  //回车换行符后返回给上位机，表示已执行
            UartWrite(buf, len);
        }
        else  //未能正确设置时间时返回“错误参数”信息
        {
            UartWrite("bad parameter.\r\n", sizeof("bad parameter.\r\n")-1);
        }
    }
    else  //命令无效时返回“错误命令”信息
    {
        UartWrite("bad command.\r\n", sizeof("bad command.\r\n")-1);
    }
}
/* 配置并启动T0，ms-T0定时时间 */
void ConfigTimer0(unsigned int ms)
{
    unsigned long tmp;  //临时变量
    
    tmp = 11059200 / 12;      //定时器计数频率
    tmp = (tmp * ms) / 1000;  //计算所需的计数值
    tmp = 65536 - tmp;        //计算定时器重载值
    tmp = tmp + 33;           //补偿中断响应延时造成的误差
    T0RH = (unsigned char)(tmp>>8);  //定时器重载值拆分为高低字节
    T0RL = (unsigned char)tmp;
    TMOD &= 0xF0;   //清零T0的控制位
    TMOD |= 0x01;   //配置T0为模式1
    TH0 = T0RH;     //加载T0重载值
    TL0 = T0RL;
    ET0 = 1;        //使能T0中断
    TR0 = 1;        //启动T0
}
/* LED动态扫描刷新函数，需在定时中断中调用 */
void LedScan()
{
    static unsigned char i = 0;  //动态扫描索引
    
    P0 = 0xFF;             //关闭所有段选位，显示消隐
    P1 = (P1 & 0xF8) | i;  //位选索引值赋值到P1口低3位
    P0 = LedBuff[i];       //缓冲区中索引位置的数据送到P0口
    if (i < 6)             //索引递增循环，遍历整个缓冲区
        i++;
    else
        i = 0;
}
/* T0中断服务函数，执行串口接收监控和蜂鸣器驱动 */
void InterruptTimer0() interrupt 1
{
    static unsigned int tmr1s = 0;  //1秒定时器
    
    TH0 = T0RH;  //重新加载重载值
    TL0 = T0RL;
    LedScan();   //LED扫描显示
    UartRxMonitor(1);  //串口接收监控
    tmr1s++;     //1秒定时的处理
    if (tmr1s >= 1000)
    {
        tmr1s = 0;
        flag1s = 1;  //设置秒定时标志
    }
}

```
 

##  实时时钟 DS1302

`BCD码`：用 4 位二进制数 来表示 1 位十进制数中的 0～9 这 10 个数字，日期时间在时钟芯片中的存储格式就是 BCD 码，直接 `取出表示十进制 1 位数字的 4 个二进制位然后再加上 0x30 就可组成一个ASCII码字节`

需要注意：<span style="color:red;">DS1302低位在前，高位在后</span>

SPI可参考另一篇文章(SPI总线原理与驱动)：

<post cid="102" cover="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221003140600.webp" />

```cpp
//对上面的补充
● CPHA=1，就表示数据的输出是在一个时钟周期的第一个沿上
● CPHA=0，就表示数据的采样是在一个时钟周期的第一个沿上
● CPOL=1 那就是下降沿
● CPOL=0 那就是上升沿   
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221017134845.jpg) 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221017144535.jpg) 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96/202204042319365.jpg) 

```cpp
//引脚对应
CE:P1^7
SCLK:P3^5
I/O:P3^4
//初始化步骤
默认下 CE 和 SCLK 引脚是低电平，所以要拉低(CE=0;SCLK=0;)
//注意读是读D0~D7的，前面的8位是指令地址一般是写    
//DS1302SingleRead()函数
看时序图得：先选中片选，所以CE先置1，完成读操作后再取消选中置0(CE=1;...CE=0;)
//DS1302SingleWrite()函数
看时序图得：先选中片选，所以CE先置1，完成写操作后再取消选中置0(CE=1;...CE=0;)
//DS1302ByteWrite()函数
先把数据准备好，I/O可能是0可能是1，然后SCLK拉高产生一个上升沿再拉低产生一个下降沿，就把数据写进去了然后变化数据再拉高拉低...(I/O=0或者1...;SCLK=1;SCLK=0;)    
//DS1302ByteRead()函数
先读取 IO 线上的数据，再拉高 SCLK 产生上升沿再拉低产生一个下降沿    
```



```cpp
//引脚分析
● 1 脚 VCC2 是主电源正极的引脚
● 2 脚 X1 和 3 脚 X2 是晶振输入和输出引脚
● 4 脚 GND是负极
● 5 脚 CE 是使能引脚，接单片机的 IO 口
● 6 脚 I/O 是数据传输引脚，接单片机的 IO 口
● 7 脚 SCLK 是通信时钟引脚，接单片机的 IO 口
● 8 脚 VCC1 是备用电源引脚(由于不方便所以接了一个 10uF 的电容，这个电容就相当于一个电量很小的电池,掉电仍维持 DS1302 运行 1 分钟左右，如果不需要掉电运行可以悬空)
```

```cpp
//DS1302 电路的一个重点就是晶振电路
它所使用的晶振是一个 32.768k 的晶振，晶振外部也不需要额外添加其它的电容或者电阻了。时钟的精度，首先取决于晶振的精度以及晶振的引脚负载电容。如果晶振不准或者负载电容过大或过小，都会导致时钟误差过大。在这一切都搞定后，最终一个考虑因素是晶振的温漂。随着温度的变化，晶振的精度也会发生变化，因此，在实际的系统中，其中一种方法就是经常校对。比如我们所用的电脑的时钟，通常我们会设置一个选项“将计算机设置与 internet 时间同步”。选中这个选项后，一般过一段时间，我们的计算机就会和 internet 时间校准同步一次
```

DS1302芯片寄存器可参考文章：

<post cid="45" cover="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221003140600.webp" />



###  程序编写

用单次读写模式访问DS1302，并将日期时间显示在液晶上

- 需要注意时间顺序是 `秒分时日月周年`
- 程序里 `unsigned char psec=0xAA` 这个AA是任意的目的是为了跟系统时间做对比，保证第一次上电会更新设置好的时间，AA的十进制是170，而秒的范围是 0~60,所以第一次上电一定会刷新

```cpp
//计算 2022年10月17日 星期1 15:02:00
● 秒:第7位是CH(0表示芯片时钟运行，1反之)，6~4位:十位，3~0位:个位 0000 0000 -> 0x00
● 分:第7位是0，6~4位:十位，3~0位:个位 0000 0010 -> 0x02
● 时:第7位是12/24格式选择(1表示12小时制，0反之)，第6位:0，第5~4位:A/P(1表示下午,0反之)或者十位，3~0位:个位 0001 0101 -> 0x15
● 日:第7~6位:0，5~4位:十位，3~0位:个位 0001 0111 -> 0x17
● 月:第7~5位:0，第4位:1/0，3~0位:个位 0001 0000 ->0x10
● 周:第7~4位:0，第3~0位:星期几 0000 0001 ->0x01
● 年:第7~4位:十位，第3~0位:个位 0010 0010 ->0x22	//默认是20xx年
● 写保护：第7位:WP(1表示只读不写，0表示可写可读,写数据必须给0)，第6~0位：全0   0000 0000 -> 0x00
● 时钟突发模式：第7~1位：1011 111，第0位：写：0 读：1  1011 1110 -> 0xBE  1011 1111 -> 0xBF  
```

```cpp
//"写"的寄存器地址(最低位0：写，1：读)
● 秒：1000 0000 -> 0x80
● 分：1000 0010 -> 0x82
● 时：1000 0100 -> 0x84
● 日：1000 0110 -> 0x86
● 月：1000 1000 -> 0x88
● 周：1000 1010 -> 0x8A
● 年：1000 1100 -> 0x8C
● 写保护：1000 1110 -> 0x8E  
```

main.c

```cpp
 /*
用单次读写模式访问DS1302，并将日期时间显示在液晶上
*/

# include <reg52.h>

sbit DS1302_CE = P1^7;
sbit DS1302_CK = P3^5;
sbit DS1302_IO = P3^4;

bit flag200ms = 0;       //200ms定时标志
unsigned char T0RH = 0;  //T0重载值的高字节
unsigned char T0RL = 0;  //T0重载值的低字节

void ConfigTimer0(unsigned int ms);
void InitDS1302();
unsigned char DS1302SingleRead(unsigned char reg);
extern void InitLcd1602();
extern void LcdShowStr(unsigned char x, unsigned char y, unsigned char *str);

void main()
{
    unsigned char i;
    unsigned char psec=0xAA;  //秒备份，初值AA确保首次读取时间后会刷新显示
    unsigned char time[8];    //当前时间数组
    unsigned char str[12];    //字符串转换缓冲区

    EA = 1;           //开总中断
    ConfigTimer0(1);  //T0定时1ms
    InitDS1302();     //初始化实时时钟
    InitLcd1602();    //初始化液晶
    
    while (1)
    {
        if (flag200ms)  //每200ms读取依次时间
        {
            flag200ms = 0;
            for (i=0; i<7; i++)  //读取DS1302当前时间
            {
                time[i] = DS1302SingleRead(i);
            }
            if (psec != time[0]) //检测到时间有变化时刷新显示
            {
                str[0] = '2';  //添加年份的高2位：20
                str[1] = '0';
                str[2] = (time[6] >> 4) + '0';  //“年”高位数字转换为ASCII码
                str[3] = (time[6]&0x0F) + '0';  //“年”低位数字转换为ASCII码
                str[4] = '-';  //添加日期分隔符
                str[5] = (time[4] >> 4) + '0';  //“月”
                str[6] = (time[4]&0x0F) + '0';
                str[7] = '-';
                str[8] = (time[3] >> 4) + '0';  //“日”
                str[9] = (time[3]&0x0F) + '0';
                str[10] = '\0';
                LcdShowStr(0, 0, str);  //显示到液晶的第一行
                
                str[0] = (time[5]&0x0F) + '0';  //“星期”
                str[1] = '\0';
                LcdShowStr(11, 0, "week");
                LcdShowStr(15, 0, str);  //显示到液晶的第一行
                
                str[0] = (time[2] >> 4) + '0';  //“时”
                str[1] = (time[2]&0x0F) + '0';
                str[2] = ':';  //添加时间分隔符
                str[3] = (time[1] >> 4) + '0';  //“分”
                str[4] = (time[1]&0x0F) + '0';
                str[5] = ':';
                str[6] = (time[0] >> 4) + '0';  //“秒”
                str[7] = (time[0]&0x0F) + '0';
                str[8] = '\0';
                LcdShowStr(4, 1, str);  //显示到液晶的第二行
                
                psec = time[0];  //用当前值更新上次秒数
            }
        }
    }
}
/* 发送一个字节到DS1302通信总线上 */
void DS1302ByteWrite(unsigned char dat)
{
    unsigned char mask;
    
    for (mask=0x01; mask!=0; mask<<=1)  //低位在前，逐位移出
    {
        if ((mask&dat) != 0) //首先输出该位数据
            DS1302_IO = 1;
        else
            DS1302_IO = 0;
        DS1302_CK = 1;       //然后拉高时钟
        DS1302_CK = 0;       //再拉低时钟，完成一个位的操作
    }
    DS1302_IO = 1;           //最后确保释放IO引脚
}
/* 由DS1302通信总线上读取一个字节 */
unsigned char DS1302ByteRead()
{
    unsigned char mask;
    unsigned char dat = 0;
    
    for (mask=0x01; mask!=0; mask<<=1)  //低位在前，逐位读取
    {
        if (DS1302_IO != 0)  //首先读取此时的IO引脚，并设置dat中的对应位
        {
            dat |= mask;
        }
        DS1302_CK = 1;       //然后拉高时钟
        DS1302_CK = 0;       //再拉低时钟，完成一个位的操作
    }
    return dat;              //最后返回读到的字节数据
}
/* 用单次写操作向某一寄存器写入一个字节，reg-寄存器地址，dat-待写入字节 */
void DS1302SingleWrite(unsigned char reg, unsigned char dat)
{
    DS1302_CE = 1;                   //使能片选信号
    DS1302ByteWrite((reg<<1)|0x80);  //发送写寄存器指令
    DS1302ByteWrite(dat);            //写入字节数据
    DS1302_CE = 0;                   //除能片选信号
}
/* 用单次读操作从某一寄存器读取一个字节，reg-寄存器地址，返回值-读到的字节 */
unsigned char DS1302SingleRead(unsigned char reg)
{
    unsigned char dat;
    
    DS1302_CE = 1;                   //使能片选信号
    DS1302ByteWrite((reg<<1)|0x81);  //发送读寄存器指令
    dat = DS1302ByteRead();          //读取字节数据
    DS1302_CE = 0;                   //除能片选信号
    
    return dat;
}
/* DS1302初始化，如发生掉电则重新设置初始时间 */
void InitDS1302()
{
    unsigned char i;
    unsigned char code InitTime[] = {  //2022年10月17日 星期1 15:02:00
        0x00,0x02,0x15, 0x17, 0x10, 0x01, 0x22
    };//秒分时日月周年
    
    DS1302_CE = 0;  //初始化DS1302通信引脚
    DS1302_CK = 0;
    i = DS1302SingleRead(0);  //读取秒寄存器
    if ((i & 0x80) != 0)      //由秒寄存器最高位CH的值判断DS1302是否已停止，1表示已断电
    {
        DS1302SingleWrite(7, 0x00);  //撤销写保护以允许写入数据(7:0000 0111；7<<1:0000 1110；|0x81:0000 1110|1000 0001 == 1000 1111；读保护寄存器地址)
        for (i=0; i<7; i++)          //设置DS1302为默认的初始时间,0x80,82,84,86,88,8A,8C，利用(i++)左移1位
        {
            DS1302SingleWrite(i, InitTime[i]);
        }
    }
}
/* 配置并启动T0，ms-T0定时时间 */
void ConfigTimer0(unsigned int ms)
{
    unsigned long tmp;  //临时变量
    
    tmp = 11059200 / 12;      //定时器计数频率
    tmp = (tmp * ms) / 1000;  //计算所需的计数值
    tmp = 65536 - tmp;        //计算定时器重载值
    tmp = tmp + 12;           //补偿中断响应延时造成的误差
    T0RH = (unsigned char)(tmp>>8);  //定时器重载值拆分为高低字节
    T0RL = (unsigned char)tmp;
    TMOD &= 0xF0;   //清零T0的控制位
    TMOD |= 0x01;   //配置T0为模式1
    TH0 = T0RH;     //加载T0重载值
    TL0 = T0RL;
    ET0 = 1;        //使能T0中断
    TR0 = 1;        //启动T0
}
/* T0中断服务函数，执行200ms定时 */
void InterruptTimer0() interrupt 1
{
    static unsigned char tmr200ms = 0;
    
    TH0 = T0RH;  //重新加载重载值
    TL0 = T0RL;
    tmr200ms++;
    if (tmr200ms >= 200)  //定时200ms
    {
        tmr200ms = 0;
        flag200ms = 1;
    }
}

```
 

<span style="color:red;">注 </span>：断电超过1分钟左右再打开程序可能就重新开始了，因为有那个电容所以才能维持1分钟左右

突发读写模式( `BURST` 模式)

- 突发模式也分为 `RAM 突发模式` 和 `时钟突发模式`，这里只用第二种

```cpp
//为什么使用 BURST模式?
当单片机定时器时间到了 200ms 后，我们连续把 DS1302 的时间参数的 7 个字节读了出来。但是不管怎么读，都会有一个时间差，在极端的情况下就会出现这样一种情况：假如我们当前的时间是 00:00:59，我们先读秒，读到的秒是 59，然后再去读分钟，而就在读完秒到还未开始读分钟的这段时间内，刚好时间进位了，变成了 00:01:00 这个时间，我们读到的分钟就是 01，显示在液晶上就会出现一个 00:01:59，这个时间很明显是错误的。出现这个问题的概率极小，但却是实实在在可能存在的。
```



```cpp
当我们写指令到DS1302 的时候，只要我们将要写的 5 位地址全部写1，即读操作用 0xBF，写操作用 0xBE，这样的指令送给 DS1302 之后，它就会自动识别出来是 burst 模式，马上把所有的 8 个字节同时锁存到另外的 8 个字节的寄存器缓冲区内，这样时钟继续走，而我们读数据是从另外一个缓冲区内读取的。
    同样的道理，如果我们用 burst 模式写数据，那么我们也是先写到这个缓冲区内，最终 DS1302 会把这个缓冲区内的数据一次性送到它的时钟寄存器内
//注意：
要注意的是，不管是读还是写，只要使用时钟的 burst 模式，则必须一次性读写 8 个寄存器，要把时钟的寄存器完全读出来或者完全写进去
```

main.c

```cpp
//在上一个例程添加与修改
void DS1302BurstRead(unsigned char *dat);

void main()
{
    ...
    DS1302BurstRead(time); //读取DS1302当前时间
    ...
}
/* 用突发模式连续写入8个寄存器数据，dat-待写入数据指针 */
void DS1302BurstWrite(unsigned char *dat)
{
    unsigned char i;
    
    DS1302_CE = 1;
    DS1302ByteWrite(0xBE);  //发送突发写寄存器指令
    for (i=0; i<8; i++)     //连续写入8字节数据
    {
        DS1302ByteWrite(dat[i]);
    }
    DS1302_CE = 0;
}
/* 用突发模式连续读取8个寄存器的数据，dat-读取数据的接收指针 */
void DS1302BurstRead(unsigned char *dat)
{
    unsigned char i;
    
    DS1302_CE = 1;
    DS1302ByteWrite(0xBF);  //发送突发读寄存器指令
    for (i=0; i<8; i++)     //连续读取8个字节
    {
        dat[i] = DS1302ByteRead();
    }
    DS1302_CE = 0;
}
/* DS1302初始化，如发生掉电则重新设置初始时间 */
void InitDS1302()
{
    unsigned char dat;
    unsigned char code InitTime[] = {  //2022年10月17日 星期1 15:02:00
        0x00,0x02,0x15, 0x17, 0x10, 0x01, 0x22
    };
    
    DS1302_CE = 0;  //初始化DS1302通信引脚
    DS1302_CK = 0;
    dat = DS1302SingleRead(0);  //读取秒寄存器
    if ((dat & 0x80) != 0)      //由秒寄存器最高位CH的值判断DS1302是否已停止
    {
        DS1302SingleWrite(7, 0x00);  //撤销写保护以允许写入数据
        DS1302BurstWrite(InitTime);  //设置DS1302为默认的初始时间
    }
}
```
 

##  红外通信

{% note blue 'fas fa-fan' flat %} 红外光的基本原理 {% endnote %}

 `红外发射管` 发射红外线的强度也会随着电流的增大而增强； `红外接收管` 内部是一个具有红外光敏感特征的 PN 节，属于 `光敏二极管`，但是它只对红外光有反应。 `无红外光时，光敏管不导通，有红外光时，光敏管导通形成光电流`，并且在一 定范围内电流随着红外光的强度的增强而增大，这种红外发射和接收对管在小车、机器人避障以及红外循迹小车中有所应用

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221018174839.jpg) 

```cpp
//分析上面原理图
● 发射控制和接收检测都是接到单片机的 IO 口上的
● 发射部分：当发射控制输出高电平时，三极管 Q1(PNP) 不导通，红外发射管 L1 不会发射红外信号；当发射控制输出低电平的时候，通过三极管 Q1 导通让 L1 发出红外光
● 接收部分：R4 是一个电位器，我们通过调整电位器给 LM393 的 2 脚提供一个阈值电压，这个电压值的大小可以根据实际情况来调试确定。而红外光敏二极管 L2 收到红外光的时候，会产生电流，并且随着红外光的从弱变强，电流会从小变大。当没有红外光或者说红外光很弱的时候，3 脚的电压就会接近 VCC，如果 3 脚比 2 脚的电压高的话，通过 LM393 比较器后，接收检测引脚输出一个高电平。当随着光强变大，电流变大，3 脚的电压值等于 VCC-I*R3，电压就会越来越小，当小到一定程度，比 2 脚的电压还小的时候，接收检测引脚就会变为低电平
//避障
这个电路用于避障的时候，发射管先发送红外信号，红外信号会随着传送距离的加大逐渐衰减，如果遇到障碍物，就会形成红外反射。当反射回来的信号比较弱时，光敏二极管 L2接收的红外光较弱，比较器 LM393 的 3 脚电压高于 2 脚电压，接收检测引脚输出高电平，说明障碍物比较远；当反射回来的信号比较强，接收检测引脚输出低电平，说明障碍物比较近了
//寻迹
用于小车循迹的时候，必须要有黑色和白色的轨道。当红外信号发送到黑色轨道时，黑色因为吸光能力比较强，红外信号发送出去后就会被吸收掉，反射部分很微弱。白色轨道就会把大部分红外信号反射回来。通常情况下的循迹小车，需要应用多个红外模块同时检测，从多个角度判断轨道，根据判断的结果来调整小车使其按照正常循迹前行    
```

```cpp
//补充1：LM393比较器
同相端电压大于反向端电压时，输出高电平；同相端电压小于反向端电压时，输出低电平；
```

{% note blue 'fas fa-fan' flat %} 红外遥控通信原理 {% endnote %}

平时用到的红外遥控器里的红外通信，通常是使用 `38K` 左右的载波进行调制

`调制`：就是用待传送信号去控制某个高频信号的幅度、相位、频率等参量变化的过程， 即用一个信号去装载另一个信号

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221018194643.jpg) 

```cpp
//原理
原始信号就是我们要发送的一个数据“0”位或者一位数据“1”位，而所谓 38K 载波就是频率为 38K 的方波信号，调制后信号就是最终我们发射出去的波形。我们使用原始信号来控制 38K 载波，当信号是数据“0”的时候，38K 载波毫无保留的全部发送出去，当信号是数据“1”的时候，不发送任何载波信号
//电路实现
38K 载波，我们可以用 455K 晶振，经过 12 分频得到 37.91K，也可以由时基电路 NE555来产生，或者使用单片机的 PWM 来产生。当信号输出引脚输出高电平时，Q2 截止，不管38K 载波信号如何控制 Q1，右侧的竖向支路都不会导通，红外管 L1 不会发送任何信息。当信号输出是低电平的时候，那么 38K 载波就会通过 Q1 释放出来，在 L1 上产生 38K 的载波信号
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221018195056.jpg) 

正常的通信来讲，接收端要首先对信号通过监测、放大、滤波、解调等等一系列电路处 理，然后输出基带信号。但是红外通信的一体化接收头 `HS0038B`，已经把这些电路全部集成 到一起了，我们只需要把这个电路接上去，就可以直接输出我们所要的基带信号

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221018195355.jpg) 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221018222808.jpg) 

```cpp
//分析电路
● 由于红外接收头内部放大器的增益很大，很容易引起干扰，因此在接收头供电引脚上必须加上滤波电容，官方手册给的值是 4.7uF，我们这里直接用的 10uF，手册里还要求在供电引脚和电源之间串联 100 欧的电阻，进一步降低干扰
● 这个电路图是接收上面那个发来的波形
● 当 HS0038B 监测到有 38K的红外信号时，就会在 OUT 引脚输出低电平，当没有 38K 的时候，OUT 引脚就会输出高电平
//那我们单片机在接收这个基带信号数据的时候，如何判断接收到的是什么数据，应该遵循什么协议呢？  
● 要想让 HS0038B 识别到 38K的红外信号，那么这个 38K 的载波必须要大于 10 个周期，这就限定了红外通信的基带信号的比特率必须不能高于 3800，所以常用的红外通信协议——NEC 协议
```

{% note blue 'fas fa-fan' flat %} NEC协议红外遥控器 {% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221018215619.jpg) 

NEC协议一次完整的传输包含:  `引导码、8位用户码、8位用户反码、8位数据码(键码)、8位数据反码、一位停止位`

```cpp
● 停止位主要起隔离作用，一般不进行判断，编程时我们也不予理会
● 4个字节的数据(32位):  用户码+用户反码+数据码+数据反码。  这里的反码可以用来校验数据是否传输正确，没有丢包
● 引导码: 9ms 的载波+4.5ms 的空闲
重点:  NEC协议传输数据位的时候，0和1的区分是依靠收到的高、低电平的持续时间来进行区分的---这是解码关键    
● 比特值“0”：560us 的载波+560us 的空闲。 比特值“1”：560us 的载波+1.68ms 的空闲
● HS0038B 这个红外一体化接收头，当收到有载波的信号的时候，会输出一个低电平，空闲的时候会输出高电平
● 对于我们的遥控器来说，不同的按键，就是键码和键码反码的区分，用户码是一样的
● 当您长时间按住遥控按钮，在这种情况下，使用NEC协议的红外遥控器将会发射一个以110ms为周期的重复码。也就是说，每一次用户按下遥控器按钮，遥控器在发送一次指令码后，就不会再发送指令码了，而是发送一段重复码
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221018222035.jpg) 

所以解码程序编程时常用到了 `外部中断+定时器` 方式

###  程序编写

- 红外接收引脚 `IRD` 接到了 `P3.3` 引脚上，这个引脚的第二功能就是 `INT1`(外部中断 1)
- INT1中断函数里的时间判定范围计算是 `x=s*(11059200/12)`
- `if (TH1 >= 0x40)` 这里TL1计数满则进位TH1，时间计算： `TH1*256*12/11059200 s = 17.7ms`
- `return (TH1*256 + TL1);` 返回高8位加低8位的和，也可以写成 `(TH1<<8)|TL1` TL1和TH1都是一个16位数二进制数，TH1作为高8位数，往左移8位，就要乘256，比如两个十进制数，TL1=8,TH1=6。你要得到68这个数。那么TH1就要乘10，往左移一位
- `PT0 = 1;`   配置T0中断为高优先级，可消除接收时的闪烁，因为固有优先级是不会抢占的得设置为抢占优先级

<span style="color:red;"> 问</span>：当我们按下遥控器按键的时候，数码管显示的数字会闪烁，这是什么原因呢？

<span style="color:# e80daf">单片机的程序都是顺序执行的，一旦我们按下遥控器按键，单片机就会进入遥控器解码的中断程序内，而这个程序执行的时间又比较长，要几十个毫秒，而如果数码管动态刷新间隔超过10ms后就会感觉到闪烁，因此这个闪烁是由于程序执行红外解码时，延误了数码管动态刷新造成的，所以解决方法就是设置定时器0中断为高优先级，因为定时器中断执行时间也就几十个us不会对解码有很大的影响</span>


infrared.c

```cpp
# include <reg52.h>

sbit IR_INPUT = P3^3;  //红外接收引脚

bit irflag = 0;  //红外接收标志，收到一帧正确数据后置1
unsigned char ircode[4];  //红外代码接收缓冲区

/* 初始化红外接收功能 */
void InitInfrared()
{
    IR_INPUT = 1;  //确保红外接收引脚被释放
    TMOD &= 0x0F;  //清零T1的控制位
    TMOD |= 0x10;  //配置T1为模式1
    TR1 = 0;       //停止T1计数
    ET1 = 0;       //禁止T1中断
    IT1 = 1;       //设置INT1为负边沿触发
    EX1 = 1;       //使能INT1中断
}
/* 获取当前高电平的持续时间 */
unsigned int GetHighTime()
{
    TH1 = 0;  //清零T1计数初值
    TL1 = 0;
    TR1 = 1;  //启动T1计数
    while (IR_INPUT)  //红外输入引脚为1时循环检测等待，变为0时则结束本循环
    {
        if (TH1 >= 0x40)
        {            //当T1计数值大于0x4000，即高电平持续时间超过约18ms时，
            break;   //强制退出循环，是为了避免信号异常时，程序假死在这里。
        }
    }
    TR1 = 0;  //停止T1计数

    return (TH1*256 + TL1);  //T1计数值合成为16bit整型数，并返回该数
}
/* 获取当前低电平的持续时间 */
unsigned int GetLowTime()
{
    TH1 = 0;  //清零T1计数初值
    TL1 = 0;
    TR1 = 1;  //启动T1计数
    while (!IR_INPUT)  //红外输入引脚为0时循环检测等待，变为1时则结束本循环
    {
        if (TH1 >= 0x40)
        {            //当T1计数值大于0x4000，即低电平持续时间超过约18ms时，
            break;   //强制退出循环，是为了避免信号异常时，程序假死在这里。
        }
    }
    TR1 = 0;  //停止T1计数

    return (TH1*256 + TL1);  //T1计数值合成为16bit整型数，并返回该数
}
/* INT1中断服务函数，执行红外接收及解码 */
void EXINT1_ISR() interrupt 2
{
    unsigned char i, j;
    unsigned char byt;
    unsigned int time;
    
    //接收并判定引导码的9ms低电平
    time = GetLowTime();
    if ((time<7833) || (time>8755))  //时间判定范围为8.5～9.5ms，
    {                                //超过此范围则说明为误码，直接退出
        IE1 = 0;   //退出前清零INT1中断标志
        return;
    }
    //接收并判定引导码的4.5ms高电平
    time = GetHighTime();
    if ((time<3686) || (time>4608))  //时间判定范围为4.0～5.0ms，
    {                                //超过此范围则说明为误码，直接退出
        IE1 = 0;
        return;
    }
    //接收并判定后续的4字节数据
    for (i=0; i<4; i++)  //循环接收4个字节
    {
        for (j=0; j<8; j++)  //循环接收判定每字节的8个bit
        {
            //接收判定每bit的560us低电平
            time = GetLowTime();
            if ((time<313) || (time>718)) //时间判定范围为340～780us，
            {                             //超过此范围则说明为误码，直接退出
                IE1 = 0;
                return;
            }
            //接收每bit高电平时间，判定该bit的值
            time = GetHighTime();
            if ((time>313) && (time<718)) //时间判定范围为340～780us，
            {                             //在此范围内说明该bit值为0
                byt >>= 1;   //因低位在先，所以数据右移，高位为0
            }
            else if ((time>1345) && (time<1751)) //时间判定范围为1460～1900us，
            {                                    //在此范围内说明该bit值为1
                byt >>= 1;   //因低位在先，所以数据右移，
                byt |= 0x80; //高位置1
            }
            else  //不在上述范围内则说明为误码，直接退出
            {
                IE1 = 0;
                return;
            }
        }
        ircode[i] = byt;  //接收完一个字节后保存到缓冲区
    }
    irflag = 1;  //接收完毕后设置标志
    IE1 = 0;     //退出前清零INT1中断标志
}
```
 

main.c

```cpp
# include <reg52.h>

sbit ADDR3 = P1^3;
sbit ENLED = P1^4;

unsigned char code LedChar[] = {  //数码管显示字符转换表
    0xC0, 0xF9, 0xA4, 0xB0, 0x99, 0x92, 0x82, 0xF8,
    0x80, 0x90, 0x88, 0x83, 0xC6, 0xA1, 0x86, 0x8E
};
unsigned char LedBuff[6] = {  //数码管显示缓冲区
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
};
unsigned char T0RH = 0;  //T0重载值的高字节
unsigned char T0RL = 0;  //T0重载值的低字节

extern bit irflag;
extern unsigned char ircode[4];
extern void InitInfrared();
void ConfigTimer0(unsigned int ms);

void main()
{
    EA = 1;      //开总中断
    ENLED = 0;   //使能选择数码管
    ADDR3 = 1;
    InitInfrared();   //初始化红外功能
    ConfigTimer0(1);  //配置T0定时1ms
    PT0 = 1;        //配置T0中断为高优先级，启用本行可消除接收时的闪烁
    
    while (1)
    {
        if (irflag)  //接收到红外数据时刷新显示
        {
            irflag = 0;
            LedBuff[5] = LedChar[ircode[0] >> 4];  //用户码显示
            LedBuff[4] = LedChar[ircode[0]&0x0F];
            LedBuff[1] = LedChar[ircode[2] >> 4];  //键码显示
            LedBuff[0] = LedChar[ircode[2]&0x0F];
        }
    }
}
/* 配置并启动T0，ms-T0定时时间 */
void ConfigTimer0(unsigned int ms)
{
    unsigned long tmp;  //临时变量
    
    tmp = 11059200 / 12;      //定时器计数频率
    tmp = (tmp * ms) / 1000;  //计算所需的计数值
    tmp = 65536 - tmp;        //计算定时器重载值
    tmp = tmp + 13;           //补偿中断响应延时造成的误差
    T0RH = (unsigned char)(tmp>>8);  //定时器重载值拆分为高低字节
    T0RL = (unsigned char)tmp;
    TMOD &= 0xF0;   //清零T0的控制位
    TMOD |= 0x01;   //配置T0为模式1
    TH0 = T0RH;     //加载T0重载值
    TL0 = T0RL;
    ET0 = 1;        //使能T0中断
    TR0 = 1;        //启动T0
}
/* LED动态扫描刷新函数，需在定时中断中调用 */
void LedScan()
{
    static unsigned char i = 0;  //动态扫描索引
    
    P0 = 0xFF;                  //关闭所有段选位，显示消隐
    P1 = (P1 & 0xF8) | i;       //位选索引值赋值到P1口低3位
    P0 = LedBuff[i];            //缓冲区中索引位置的数据送到P0口
    if (i < sizeof(LedBuff)-1)  //索引递增循环，遍历整个缓冲区
        i++;
    else
        i = 0;
}
/* T0中断服务函数，执行数码管扫描显示 */
void InterruptTimer0() interrupt 1
{
    TH0 = T0RH;  //重新加载重载值
    TL0 = T0RL;
    LedScan();   //数码管扫描显示
}
```
 

##  温度传感器DS18B20

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221019100701.jpg)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221019114333.jpg)

DS18B20参考另一篇文章(51单片机-温度传感器)：

<post cid="39" cover="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221003140600.webp"/>

###  程序编写

液晶屏显示温度

main.c

```cpp
# include <reg52.h>

bit flag1s = 0;          //1s定时标志
unsigned char T0RH = 0;  //T0重载值的高字节
unsigned char T0RL = 0;  //T0重载值的低字节

void ConfigTimer0(unsigned int ms);
unsigned char IntToString(unsigned char *str, int dat);
extern bit Start18B20();
extern bit Get18B20Temp(int *temp);
extern void InitLcd1602();
extern void LcdShowStr(unsigned char x, unsigned char y, unsigned char *str);

void main()
{
    bit res;
    int temp;        //读取到的当前温度值
    int intT, decT;  //温度值的整数和小数部分
    unsigned char len;
    unsigned char str[12];

    EA = 1;            //开总中断
    ConfigTimer0(10);  //T0定时10ms
    Start18B20();      //启动DS18B20
    InitLcd1602();     //初始化液晶
    
    while (1)
    {
        if (flag1s)  //每秒更新一次温度
        {
            flag1s = 0;
            res = Get18B20Temp(&temp);  //读取当前温度
            if (res)                    //读取成功时，刷新当前温度显示
            {
                intT = temp >> 4;             //分离出温度值整数部分
                decT = temp & 0xF;            //分离出温度值小数部分
                len = IntToString(str, intT); //整数部分转换为字符串
                str[len++] = '.';             //添加小数点
                decT = (decT*10) / 16;        //二进制的小数部分转换为1位十进制位
                str[len++] = decT + '0';      //十进制小数位再转换为ASCII字符
                while (len < 6)               //用空格补齐到6个字符长度
                {
                    str[len++] = ' ';
                }
                str[len] = '\0';              //添加字符串结束符
                LcdShowStr(0, 0, str);        //显示到液晶屏上
            }
            else                        //读取失败时，提示错误信息
            {
                LcdShowStr(0, 0, "error!");
            }
            Start18B20();               //重新启动下一次转换
        }
    }
}
/* 整型数转换为字符串，str-字符串指针，dat-待转换数，返回值-字符串长度 */
unsigned char IntToString(unsigned char *str, int dat)
{
    signed char i = 0;
    unsigned char len = 0;
    unsigned char buf[6];
    
    if (dat < 0)  //如果为负数，首先取绝对值，并在指针上添加负号
    {
        dat = -dat;
        *str++ = '-';
        len++;
    }
    do {          //先转换为低位在前的十进制数组
        buf[i++] = dat % 10;
        dat /= 10;
    } while (dat > 0);
    len += i;     //i最后的值就是有效字符的个数
    while (i-- > 0)   //将数组值转换为ASCII码反向拷贝到接收指针上
    {
        *str++ = buf[i] + '0';
    }
    *str = '\0';  //添加字符串结束符
    
    return len;   //返回字符串长度
}
/* 配置并启动T0，ms-T0定时时间 */
void ConfigTimer0(unsigned int ms)
{
    unsigned long tmp;  //临时变量
    
    tmp = 11059200 / 12;      //定时器计数频率
    tmp = (tmp * ms) / 1000;  //计算所需的计数值
    tmp = 65536 - tmp;        //计算定时器重载值
    tmp = tmp + 12;           //补偿中断响应延时造成的误差
    T0RH = (unsigned char)(tmp>>8);  //定时器重载值拆分为高低字节
    T0RL = (unsigned char)tmp;
    TMOD &= 0xF0;   //清零T0的控制位
    TMOD |= 0x01;   //配置T0为模式1
    TH0 = T0RH;     //加载T0重载值
    TL0 = T0RL;
    ET0 = 1;        //使能T0中断
    TR0 = 1;        //启动T0
}
/* T0中断服务函数，完成1秒定时 */
void InterruptTimer0() interrupt 1
{
    static unsigned char tmr1s = 0;
    
    TH0 = T0RH;  //重新加载重载值
    TL0 = T0RL;
    tmr1s++;
    if (tmr1s >= 100)  //定时1s
    {
        tmr1s = 0;
        flag1s = 1;
    }
}
```
 

- 和I2C寻址类似，1-Wire总线开始也要检测是否存在相应的器件， `若存在相应器件，会返回一个低电平脉冲`
-  只有在单片机 `释放总线`（拉高电平）的情况下， `单片机才能从从机上读取数据`，这点和其它两个通信协议是一样的
- 读数据是单片机读，那么就必须是在 `释放总线的情况下读取数据的`，同样的，读数据前也要 `先产生一个2us的低电平脉冲`，然后再 `迅速拉高`（因为必须在 `15us` 的时间内读取数据）

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221020001614.jpg)

- LSB `0~3位` 是温度值的小数部分， `4~10位` 是温度值的整数部分，`11~15` 位是符号位(全0是正全1是负)
- 由于12位精度是 `0.0625` 度，所以如果需要保留1位小数则乘以10，保留2位乘以100...以此类推

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221020140946.jpg)

- 如果需要显示2位小数需要改：

```cpp
*temp = (*temp)*100;
*temp = *temp + (LSB&0x0F)*6.25;

LedBuff[1] = gsmg[(temp % 10)];	//小数部分个位
LedBuff[2] = gsmg[((temp % 1000) %100) /10 ];//小数部分十位
LedBuff[3] = gsmg[(temp % 1000) / 100];	//整数部分个位
LedBuff[4] = gsmg[temp / 1000];	//整数部分十位

LedBuff[0] = gsmg[12];	//显示C
LedBuff[3] &= 0x7F;	//小数点
```



DS18B20.c

```cpp
# include <reg52.h>
# include <intrins.h>

sbit IO_18B20 = P3^2;  //DS18B20通信引脚

/* 软件延时函数，延时时间(t*10)us */
void DelayX10us(unsigned char t)
{
    do {
        _nop_();
        _nop_();
        _nop_();
        _nop_();
        _nop_();
        _nop_();
        _nop_();
        _nop_();
    } while (--t);
}
/* 复位总线，获取存在脉冲，以启动一次读写操作 */
bit Get18B20Ack()
{
    bit ack;
    
    EA = 0;   //禁止总中断
    IO_18B20 = 0;     //产生500us复位脉冲
    DelayX10us(50);
    IO_18B20 = 1;
    DelayX10us(6);    //延时60us
    ack = IO_18B20;   //读取存在脉冲（注意，存在脉冲是一个低电平脉冲）
    while(!IO_18B20); //等待存在脉冲结束,如果存在脉冲没有结束（一直为0），就会一直执行while循环
    EA = 1;   //重新使能总中断
    
    return ack;
}
/* 向DS18B20写入一个字节，dat-待写入字节 */
void Write18B20(unsigned char dat)
{
    unsigned char mask;
    
    EA = 0;   //禁止总中断
    for (mask=0x01; mask!=0; mask<<=1)  //低位在先，依次移出8个bit
    {
        IO_18B20 = 0;         //产生2us低电平脉冲
        _nop_();
        _nop_();
        if ((mask&dat) == 0)  //输出该bit值
            IO_18B20 = 0;
        else
            IO_18B20 = 1;
        DelayX10us(6);        //延时60us
        IO_18B20 = 1;         //拉高通信引脚
    }
    EA = 1;   //重新使能总中断
}
/* 从DS18B20读取一个字节，返回值-读到的字节 */
unsigned char Read18B20()
{
    unsigned char dat;
    unsigned char mask;
    
    EA = 0;   //禁止总中断
    for (mask=0x01; mask!=0; mask<<=1)  //低位在先，依次采集8个bit
    {
        IO_18B20 = 0;         //产生2us低电平脉冲
        _nop_();
        _nop_();
        IO_18B20 = 1;         //结束低电平脉冲，等待18B20输出数据
        _nop_();              //延时2us
        _nop_();
        if (!IO_18B20)        //读取通信引脚上的值
            dat &= ~mask;
        else
            dat |= mask;
        DelayX10us(6);        //再延时60us
    }
    EA = 1;   //重新使能总中断

    return dat;
}
/* 启动一次18B20温度转换，返回值-表示是否启动成功 */
bit Start18B20()
{
    bit ack;
    
    ack = Get18B20Ack();   //执行总线复位，并获取18B20应答
    if (ack == 0)          //如18B20正确应答，则启动一次转换
    {
        Write18B20(0xCC);  //跳过ROM操作,我们的开发板上1-Wire总线上只挂了一个器件
        Write18B20(0x44);  //启动一次温度转换
    }
    return ~ack;   //ack=0表示操作成功，所以返回值对其取反
}
/* 读取DS18B20转换的温度值，返回值-表示是否读取成功 */
bit Get18B20Temp(int *temp)
{
    bit ack;
    unsigned char LSB, MSB; //16bit温度值的低字节和高字节
    
    ack = Get18B20Ack();    //执行总线复位，并获取18B20应答
    if (ack == 0)           //如18B20正确应答，则读取温度值
    {
        Write18B20(0xCC);   //跳过ROM操作
        Write18B20(0xBE);   //发送读命令
        LSB = Read18B20();  //读温度值的低字节
        MSB = Read18B20();  //读温度值的高字节
        *temp = ((int)MSB << 8) + LSB;  //合成为16bit整型数
    }
    return ~ack;  //ack==0表示操作应答，所以返回值为其取反值
}
```
 

数码管显示温度(占用4个数码管)

main.c
```cpp
/*
控制DS18B20测量温度并将温度值显示到数码管上
*/

# include <reg52.h>

sbit ADDR3 = P1^3;
sbit ENLED = P1^4;
bit flag1s = 0;          //1s定时标志
unsigned char T0RH = 0;  //T0重载值的高字节
unsigned char T0RL = 0;  //T0重载值的低字节

void ConfigTimer0(unsigned int ms);
extern bit Start18B20();
extern bit Get18B20Temp(int *temp);
extern void SMG_display(int temp);
extern void SMG_scan();

void main()
{
    int temp;        //读取到的当前温度值
	bit ack;
    EA = 1; 
	ENLED = 0;   //使能选择数码管
    ADDR3 = 1;	//开总中断
    ConfigTimer0(1);  //T0定时1ms，不能定太久否则数码管闪烁
    Start18B20();      //启动DS18B20

    
    while (1)
    {
        if (flag1s)  //每秒更新一次温度
        {
            flag1s = 0;
            ack=Get18B20Temp(&temp);  //读取当前温度
			if(ack)
			{
				SMG_display(temp);
			}
            Start18B20();  //重新启动下一次转换
        }
    }
}

/* 配置并启动T0，ms-T0定时时间 */
void ConfigTimer0(unsigned int ms)
{
    unsigned long tmp;  //临时变量
    
    tmp = 11059200 / 12;      //定时器计数频率
    tmp = (tmp * ms) / 1000;  //计算所需的计数值
    tmp = 65536 - tmp;        //计算定时器重载值
    tmp = tmp + 12;           //补偿中断响应延时造成的误差
    T0RH = (unsigned char)(tmp>>8);  //定时器重载值拆分为高低字节
    T0RL = (unsigned char)tmp;
    TMOD &= 0xF0;   //清零T0的控制位
    TMOD |= 0x01;   //配置T0为模式1
    TH0 = T0RH;     //加载T0重载值
    TL0 = T0RL;
    ET0 = 1;        //使能T0中断
    TR0 = 1;        //启动T0
}
/* T0中断服务函数，完成1秒定时 */
void InterruptTimer0() interrupt 1
{
    static unsigned int tmr1s = 0;
    
    TH0 = T0RH;  //重新加载重载值
    TL0 = T0RL;
    tmr1s++;
	SMG_scan();
    if (tmr1s >= 1000)  //定时1s
    {
        tmr1s = 0;
        flag1s = 1;
    }
}
```
 
DS18B20.c

跟上一个程序一样只改了下面这两个函数替换即可

```cpp
/* 从DS18B20读取一个字节，返回值-读到的字节 */
unsigned char Read18B20()
{
    unsigned char dat;
    unsigned char i;
    
    EA = 0;   //禁止总中断
    for (i=0;i<8;i++)  //低位在先，依次采集8个bit
    {
        IO_18B20 = 0;         //产生2us低电平脉冲
        _nop_();
        _nop_();
		dat>>=1;
        IO_18B20 = 1;         //结束低电平脉冲，等待18B20输出数据
        _nop_();              //延时2us
        _nop_();
        if (IO_18B20)        //读取通信引脚上的值
            dat |= 0x80;
        DelayX10us(6);        //再延时60us
    }
    EA = 1;   //重新使能总中断

    return dat;
}
/* 读取DS18B20转换的温度值，返回值-表示是否读取成功 */
bit Get18B20Temp(int *temp)
{
    bit ack;
    unsigned char LSB, MSB; //16bit温度值的低字节和高字节
    
    ack = Get18B20Ack();    //执行总线复位，并获取18B20应答
    if (ack == 0)           //如18B20正确应答，则读取温度值
    {
        Write18B20(0xCC);   //跳过ROM操作
        Write18B20(0xBE);   //发送读命令
        LSB = Read18B20();  //读温度值的低字节
        MSB = Read18B20();  //读温度值的高字节
        *temp = ((int)MSB << 8) | LSB;  //注意这里是左移八位，将MSB高八位的0移走！现在16位温度值已经完成了
		*temp >>=4;	//取整数部分，小数部分是低4位所以右移
		*temp = (*temp)*10;	//整数部分扩大10倍
		*temp = *temp + (LSB&0x0F)*0.625;	//把扩大的跟小数扩大的10倍相加
    }
    return ~ack;  //ack==0表示操作应答，所以返回值为其取反值
}
```
 
SMG.c

```cpp
# include "reg52.h"

# define SMG_PORT P1	//宏定义数码管P1端口
# define LED_PORT P0	//段

unsigned char code gsmg[] =
{
    0xC0, 0xF9, 0xA4, 0xB0, 0x99, 0x92, 0x82, 0xF8,
    0x80, 0x90, 0x88, 0x83, 0xC6, 0xA1, 0x86, 0x8E
};	//数码管段码0~F

unsigned char LedBuff[6] =
{
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
};	//数码

void SMG_display(int temp)
{
   	LedBuff[1] = gsmg[(temp % 10)];	//小数部分
	LedBuff[2] = gsmg[(temp % 100) / 10];	//整数部分个位
	LedBuff[3] = gsmg[temp / 100];	//整数部分十位

	LedBuff[0] = gsmg[12];	//显示C
	LedBuff[2] &= 0x7F;	//小数点
}

void SMG_scan()
{
	static unsigned char i = 0;
	LED_PORT = 0xFF;	//显示消影
    SMG_PORT = (SMG_PORT & 0xF8) | i;	//0xF8:1111 1000，低3位对应ADDR0~ADDR2，跟i又是对应关系
	LED_PORT = LedBuff[i];
	if(i>=5)
        i=0;
	else
        i++;
}
```
 

##  AD/DA模数转换

ADC参考另一篇文章(51单片机-ADC模数转换)：

<post cid="49" cover="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221003140600.webp"/>

- ADC 的位数

一个 `n` 位的 ADC 表示这个 ADC 共有 `2 的 n 次方` 个刻度。8 位的 ADC，输出的是从 0～255 一共 256 个数字量，也就是 2 的 8 次方个数据刻度

- 基准源(基准电压)

要想把输入 ADC 的信号测量准确， 那么基准源首先要准；假如我们的基准源应该是 5.10V，但是实际上提供的却是 4.5V， 这样误把 4.5V 当成了 5.10V 来处理的话，偏差也会比较大

- 分辨率

分辨率是数字量变化一个最小刻度时，模拟信号的变化量，定义为满刻度量程与 2 n -1 的 比值；假定 5.10V 的电压系统，使用 8 位的 ADC 进行测量，那么相当于 0～255 一共 256 个 刻度把 5.10V 平均分成了 255 份，那么分辨率就是 5.10/255 = 0.02V

- INL（积分非线性度）和 DNL（差分非线性度）

一般容易混淆两个概念就是分辨率和精度，认为分辨率越高，则精度越高，而实际上， `两者并没有必然的联系`；分辨率是用来描述刻度划分的，而精度是用来 描述准确程度的；

`INL` 指的是 ADC 器件在所有的数值上对应的模拟值，和真实值之间误差最大的那一个点的误差值，是 ADC 最重要的一个精度指标，单位是 `LSB` (最低有效位的意思)，那么它实际上对应的就是 ADC 的分辨率

`DNL` 表示的是 ADC 相邻两个刻度之间最大的差异，单位也是 LSB，一把分辨率是 1 毫米的尺子，相邻的刻度之间并不都刚好是 1 毫米，而总是会存在或大或小的误差。同理，一 个 ADC 的两个刻度线之间也不总是准确的等于分辨率，也是存在误差，这个误差就是 DNL。一个基准为 5.10V 的 8 位 ADC，假定它的 DNL 是 0.5LSB，那么当它的转换结果从 100 增加 到 101 时，理想情况下实际电压应该增加 0.02V，但 DNL 为 0.5LSB 的情况下实际电压的增 加值是在 0.01～0.03V 之间。值得一提的是 DNL 并非一定小于 1LSB，很多时候它会等于或 大于 1LSB，这就相当于是一定程度上的刻度紊乱，当实际电压保持不变时，ADC 得出的结 果可能会在几个数值之间跳动，很大程度上就是由于这个原因（但并不完全是，因为还有无 时无处不在的干扰的影响）

- 转换速率 

转换速率，是指 ADC 每秒能进行采样转换的最大次数，单位是 sps（或 s/s、sa/s，即 samples  per second），它与 ADC 完成一次从模拟到数字的转换所需要的时间互为倒数关系。ADC 的种类比较多，其中 `积分型的 ADC 转换时间是毫秒级的`，属于低速 ADC； `逐次逼近型 ADC转换时间是微秒级的`，属于中速 ADC； `并行/串行的 ADC 的转换时间可达到纳秒级`，属于高速 ADC

###  PCF8591

PCF8591 是一个单电源低功耗的 8 位 CMOS 数据采集器件，具有 `4 路模拟输入`， `1 路模拟输出` 和一个 `串行 I 2C 总线接口` 用来与单片机通信

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221020151039.jpg)

```cpp
//分析
//右图：
引脚 1、2、3、4 是 4 路模拟输入
引脚 5、6、7 是 I2C 总线的硬件地址，
8 脚是数字地 GND，
9 脚和 10 脚是 I2C 总线的 SDA 和 SCL。
12 脚是时钟选择引脚，如果接高电平表示用外部时钟输入，接低电平则用内部时钟，这里使用内部时钟
同时 11 脚悬空
13 脚是模拟地 AGND
14 脚是基准源
15 脚是 DAC 的模拟输出
16 脚是供电电源 VCC
//左图
J17 的 3 脚和 4 脚用跳线帽短路起来，那么现在 Vref 的基准源就是 2.5V
AIN0 实测的就是电位器的分压值
AIN1 和 AIN2 测的是 GND的值
AIN3 测的是+5V 的值
    //注意：AIN3 虽然测的是+5V 的值，但是对于AD 来说，只要输入信号超过 Vref 基准源，它得到的始终都是最大值，即 255，也就是说它实际上无法测量超过其 Vref 的电压信号的。需要注意的是，所有输入信号的电压值都不能超过 VCC，即+5V，否则可能会损坏 ADC 芯片    
```

PCF8591 的 ADC 是 `逐次逼近型的`，转换速率算是中速，但是它的速度瓶颈在 I 2C 通信 上。由于 I 2C 通信速度较慢，所以最终的 PCF8591 的转换速度，直接取决于 I 2C 的通信速率。 由于 I 2C 速度的限制，所以 PCF8591 得算是个 `低速的 AD 和 DA 的集成`

`Vref 基准电压` 的提供有两种方法。一是采用简易的原则，直接接到 VCC 上去，但是由 于 VCC 会受到整个线路的用电功耗情况影响，一来不是准确的 5V，实测大多在 4.8V 左右， 二来随着整个系统负载情况的变化会产生波动，所以只能用在简易的、对精度要求不高的场 合。方法二是 `使用专门的基准电压器件，比如 TL431，它可以提供一个精度很高的 2.5V 的电压基准`

`TL431`介绍

```cpp
1、TL431的KA之间最大只能承受36V的电压。
2、KA之间需要流过1mA的电流才能正常工作。
3、低动态输出阻抗：0.22Ω（典型值）。
4、TL431的工作温度一般都是85℃，在应用的时候需要注意环境温度
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221020164805.jpg)



单片机对 PCF8591 进 行初始化，一共发送三个字节即可：

- 第一个字节PCF8591器件地址：由于 `A2,A1,A0` 接地，故前面7位为：`0100 1000`(0x48) ，第一位是读写位(0:写1:读)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221020152533.jpg)

- 第二个字节PCF8591 控制寄存器

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221020160841.jpg)

```cpp
● 第 3,7位固定为 0
● 控制字节的第 6 位是 DA 使能位，这一位置 1 表示 DA 输出引脚使能，会产生模拟电压输出功能
● 第 4 位和第 5 位可以实现把 PCF8591 的 4 路模拟输入配置成单端模式和差分模式    
● 第 2 位是自动增量控制位，自动增量的意思就是，比如我们一共有 4 个通道，当我们全部使用的时候，读完了通道 0，下一次再读，会自动进入通道 1 进行读取，不需要我们指定下一个通道，由于 A/D 每次读到的数据，都是上一次的转换结果，所以在使用自动增量功能的时候，要特别注意，当前读到的是上一个通道的值
● 控制字节的第 0 位和第 1 位就是通道0~3选择位(00、01、10、11)   
```

- 第三个字节 D/A 数据寄存器：仅仅使用 A/D 功能的话，就可以不发送第三个字节





###  程序编写

简单显示 `AIN0,AIN1,AIN3` 电压在液晶(因为AIN2跟AIN1一样故没显示)

- 显示结果是 AIN1接地故保持是 `0V`，AIN3 是基准源2.5V故也保持 `2.5V`，AIN0可以通过扭动板子电位器使输出 `0~2.5V`
- 这里控制字节是 `0x40|chn`(也就是只使能了DA和选择通道号其余的暂时不操作)
- `val = (val*25) / 255;` 255：因为这是8位的ADC，输出数字量是0～255
- `GetADCValue()`函数里那两条读语句作用：当前的转换结果总是在下一个字节的 8 个 SCL 上才能读出，因此我们这里第一条语句的作用是产生一个整体的 SCL 时钟提供给 PCF8591 进行 A/D 转换， 第二次是读取当前的转换结果。如果我们只使用第二条语句的话，每次读到的都是上一次的 转换结果

main.c

```cpp
/*
将模拟输入通道0、1、3的电压值显示到液晶上
*/

# include <reg52.h>

bit flag300ms = 1;       //300ms定时标志
unsigned char T0RH = 0;  //T0重载值的高字节
unsigned char T0RL = 0;  //T0重载值的低字节

void ConfigTimer0(unsigned int ms);
unsigned char GetADCValue(unsigned char chn);
void ValueToString(unsigned char *str, unsigned char val);
extern void I2CStart();
extern void I2CStop();
extern unsigned char I2CReadACK();
extern unsigned char I2CReadNAK();
extern bit I2CWrite(unsigned char dat);
extern void InitLcd1602();
extern void LcdShowStr(unsigned char x, unsigned char y, unsigned char *str);

void main()
{
    unsigned char val;
    unsigned char str[10];
    
    EA = 1;            //开总中断
    ConfigTimer0(10);  //配置T0定时10ms
    InitLcd1602();     //初始化液晶    
    LcdShowStr(0, 0, "AIN0  AIN1  AIN3");  //显示通道指示
    
    while (1)
    {
        if (flag300ms)
        {
            flag300ms = 0;
            //显示通道0的电压
            val = GetADCValue(0);     //获取ADC通道0的转换值
            ValueToString(str, val);  //转为字符串格式的电压值
            LcdShowStr(0, 1, str);    //显示到液晶上
            //显示通道1的电压
            val = GetADCValue(1);
            ValueToString(str, val);
            LcdShowStr(6, 1, str);
            //显示通道3的电压
            val = GetADCValue(3);
            ValueToString(str, val);
            LcdShowStr(12, 1, str);
        }
    }
}
/* 读取当前的ADC转换值，chn-ADC通道号0~3 */
unsigned char GetADCValue(unsigned char chn)
{
    unsigned char val;
    
    I2CStart();
    if (!I2CWrite(0x48<<1))  //寻址PCF8591，如未应答，则停止操作并返回0
    {
        I2CStop();
        return 0;
    }
    I2CWrite(0x40|chn);        //写入控制字节，选择转换通道
    I2CStart();
    I2CWrite((0x48<<1)|0x01);  //寻址PCF8591，指定后续为读操作    
    I2CReadACK();              //先空读一个字节，提供采样转换时间
    val = I2CReadNAK();        //读取刚刚转换完的值
    I2CStop();
    
    return val;
}
/* ADC转换值转为实际电压值的字符串形式，str-字符串指针，val-AD转换值 */
void ValueToString(unsigned char *str, unsigned char val)
{
    //电压值=转换结果*2.5V/255，式中的25隐含了一位十进制小数
    val = (val*25) / 255;
    str[0] = (val/10) + '0';  //整数位字符
    str[1] = '.';             //小数点
    str[2] = (val%10) + '0';  //小数位字符
    str[3] = 'V';             //电压单位
    str[4] = '\0';            //结束符
}
/* 配置并启动T0，ms-T0定时时间 */
void ConfigTimer0(unsigned int ms)
{
    unsigned long tmp;  //临时变量
    
    tmp = 11059200 / 12;      //定时器计数频率
    tmp = (tmp * ms) / 1000;  //计算所需的计数值
    tmp = 65536 - tmp;        //计算定时器重载值
    tmp = tmp + 12;           //补偿中断响应延时造成的误差
    T0RH = (unsigned char)(tmp>>8);  //定时器重载值拆分为高低字节
    T0RL = (unsigned char)tmp;
    TMOD &= 0xF0;   //清零T0的控制位
    TMOD |= 0x01;   //配置T0为模式1
    TH0 = T0RH;     //加载T0重载值
    TL0 = T0RL;
    ET0 = 1;        //使能T0中断
    TR0 = 1;        //启动T0
}
/* T0中断服务函数，执行300ms定时 */
void InterruptTimer0() interrupt 1
{
    static unsigned char tmr300ms = 0;
    
    TH0 = T0RH;  //重新加载重载值
    TL0 = T0RL;
    tmr300ms++;
    if (tmr300ms >= 30)  //定时300ms
    {
        tmr300ms = 0;
        flag300ms = 1;
    }
}
```
 



