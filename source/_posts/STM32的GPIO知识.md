---
title: 必须掌握的硬件知识
cover: /img/num116.webp
comments: false
categories:
  - 单片机知识
abbrlink: 20723b6c
date: 2023-02-11 09:40:45
---



##  GPIO的八种模式

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230211092253.webp)

{% note red 'fas fa-fan' flat %}注意1{% endnote %}

不要混淆输入跟输出，你就是单片机，你要控制什么，单片机就控制什么；想要灯亮，我IO口输出一个低电平，二极管正向导通了就可以了。我想要知道KEY的状态，我读取IO口的高低。看它输入是高是低

{% note red 'fas fa-fan' flat %}注意2{% endnote %}

GPIO的引脚速度与和应用匹配(1M表示1024Kb,9600波特率大概1.2Kb)

- 对于串口，如果最大波特率只需115200，那么 `2M` 的GPIO引脚速度就够了，既省电又降噪
- 对于I2C，假设使用400KHz波特率，若想把余量留大些，那么用2M的或许不够，此时可选择 `10M`
- 对于SPI，假设使用18M或者9M波特率，用10M明显不够，此时可选择 `50M` 的GPIO引脚速度

{% note red 'fas fa-fan' flat %}注意3{% endnote %}

所有端口均有外部中断能力，为了使用外部中断线，端口必须配置成 `输入模式`

一般上下拉电阻的阻值都在 `30-50K` 之间。这样可以增强MCU的抗干扰能力

芯片 `内部上/下拉电阻` 不影响GPIO输出模式

必须以 `字(32位)` 的方式操作GPIO外设寄存器

{% note blue 'fas fa-fan' flat %}名词解释{% endnote %}

- 输入数据寄存器(IDR)
- 输出数据寄存器(ODR)
- 位设置/清除寄存器(BSRR)
- VDD:能够容忍3.3V电压,最大3.6V(`一般VDD<VCC`)
- VCC:一定是5V
- VSS:公共连接，通常指电路公共接地端电压
- TTL肖特基触发器:TTL肖特基触发器即为用肖特基管构成的施密特触发器，施密特触发器利用门阀电压将引脚模拟信号变成矩形信号，进行转化为0/1数字信号存入输入数据寄存器

{% note blue 'fas fa-fan' flat %}下图中两个二极管起保护作用{% endnote %}

当引脚电压高于VDD 时，上方的二极管导通，当引脚电压低于VSS 时，下方的二极管导通，防止不正常电压引入芯片导致芯片烧毁。（虽有这样的保护，但不能驱动大功率器件，如直接驱动电机，电机堵转的反向电流会烧毁芯片）

{% note blue 'fas fa-fan' flat %}推挽输出{% endnote %}

可以输出高,低电平,连接数字器件；路线:①-输出控制信号; ②-控制MOS管开合; ③-最终信号输出；IDR:可实时读取引脚电平(外部电平)；ODR:置0，N-MOS导通，P-MOS高阻，IDR为0；ODR:置1，P-MOS导通，N-MOS高阻，IDR为1; 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221021214350.jpg)
当INT输入为高电平时，经过反向后输出到MOS管栅极为低电平，PMOS的SD导通，OUT输出为高电平VDD；当INT输入为低电平时，经过反向后输出到MOS管栅极为高电平，NMOS的DS导通，OUT输出为低电平。当引脚高低电平切换时，两个管子轮流导通，P 管负责灌电流，N 管负责拉电流，使其负载能力和开关速度都比普通的方式有很大的提高
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/3abd7340ae6d4718b1edca50d3167fa4.webp)

{% note blue 'fas fa-fan' flat %}开漏输出{% endnote %}
只能输出低电平，相当于PMOS不存在；若两个都不导通则输出高阻态，此时如果外接5V上拉此时IO则输出接近5V(常用于电平转换)；若想输出高电平需要外接上拉电阻，电阻此时输出电平取决于此时上拉电阻的外部电源电压情况；还有 `线与` 功能(即当所有引脚均输出高电平时，输出才为高电平，若任一引脚输出低电平，则输出低电平，常用于 I2C)

{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221022140123.jpg)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/f92f84380f714a568e2ec2f8cae1795c.webp)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221022135235.jpg)
{% endgallery %}

> 在51单片机中，引脚都叫通用输入输出引脚，是具有双向功能的，32单片机的引脚也可以
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230521190559.webp)
>
> CPU往位设置寄存器写入1，则高电平1来到输出控制电路这里，N-MOS管不会导通，此时IO端口的电平状态由外部的上拉或者下拉决定，可能为高电平也可能为低电平；同时IO端口的状态可以被读取，通过虚线的电路被CPU读取，此时读取的并不一定是CPU输出的高电平1，而是外部的状态
>
> CPU如果往位设置寄存器写入0，则低电平0来到输出控制寄存器，N-MOS管导通，IO端口与VSS导通，而VSS是电路公共地端电压，一般接GND，所以IO端口就输出低电平0；同时CPU读取时端口状态就是自己输出的低电平0
>
>  `所以IO引脚配置为开漏输出就既可以作输出又可以作输入了，并不需要再配置改变IO口的工作模式(常用于I2C)`


{% note blue 'fas fa-fan' flat %}复用推挽/开漏输出{% endnote %}
作为片上外设（USART、I2C、SPI等）专用引脚，即一个引脚有多种用途但同一时刻一个引脚只能使用复用功能中的一个；一般I2C---复用开漏输出	PWM/USART---复用推挽输出

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221022141426.jpg)

{% note blue 'fas fa-fan' flat %}模拟输入{% endnote %}

常用于ADC,路线:①-信号从引脚进⼊, ②-直接进⼊⽚上外设ADC中；IDR: 断开无效，常为0，无法读取准确引脚电平状态；ODR:断开无效，使上下拉电阻不能影响电平状态；
 `功耗最小`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221021213141.jpg)

{% note blue 'fas fa-fan' flat %}浮空输入{% endnote %}

路线: ①-信号从引脚进⼊; ②-经施密特触发器转换为0,1; ③-存⼊输⼊数据寄存器随时可读取；两个上/下拉电阻开关均断开,读取的电平是不确定的，外部信号是什么电平，MCU引脚就输入什么电平。 `MCU复位上电后，默认为浮空输入模式`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221022142952.jpg)

{% note blue 'fas fa-fan' flat %}下拉输入{% endnote %}
路线： ①-信号从引脚进⼊; ②-被下拉电阻钳位; ③-施密特触发器转换为0,1; ④-存至输⼊数据寄存器随时读取；当开关闭合，外部I/O无输入信号时，默认输入低电平

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221022144200.jpg)

{% note blue 'fas fa-fan' flat %}上拉输入{% endnote %}
图跟下拉一样只是下拉换成上拉；当开关闭合，外部I/O无输入信号时，默认输入高电平

## F1和F4的初始化区别

{% note blue 'fas fa-fan' flat %}F1系列{% endnote %}

```cpp
void GPIO_Init(void)
{
     GPIO_InitTypeDef GPIO_InitStructure;//结构体初始化
   
     RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);//使能PA端口时钟
    
     GPIO_InitStructure.GPIO_Pin = GPIO_Pin_1;   //LED0-->PA.1 端口配置
     GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_PP;   //推挽输出
     GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;  //IO口速度为50MHz
     GPIO_Init(GPIOA, &GPIO_InitStructure); //根据设定参数初始化GPIOA.1
     GPIO_SetBits(GPIOA,GPIO_Pin_1);    //PA.1 输出高
 
}
```
{% note blue 'fas fa-fan' flat %}F4系列{% endnote %}

```cpp
void GPIO_Init(void)
{
   //声明一个GPIO结构体变量
	GPIO_InitTypeDef GPIO_InitStructure;
	delay_init(84);	
	//使能GPIO所在的总线的时钟
	RCC_AHB1PeriphClockCmd(RCC_AHB1Periph_GPIOA, ENABLE);
    //定义该结构体
	GPIO_InitStructure.GPIO_Pin=GPIO_Pin_2; //使用的IO口 （总共有16个IO口）
	GPIO_InitStructure.GPIO_Mode=GPIO_Mode_OUT; //设置IO的模式
	GPIO_InitStructure.GPIO_Speed=GPIO_Speed_100MHz;    //100MHz
	GPIO_InitStructure.GPIO_OType=GPIO_OType_PP;    //推挽
	GPIO_InitStructure.GPIO_PuPd=GPIO_PuPd_UP;  //上拉
    //初始化该结构体
	GPIO_Init(GPIOA,&GPIO_InitStructure);
}
```