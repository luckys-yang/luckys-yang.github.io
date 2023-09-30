---
title: 电机与PID学习
cover: /img/num143.webp
categories:
  - 细化学习
comments: false
katex: true	
abbrlink: f3106827
date: 2023-06-25 14:10:48
---



{% note blue 'fas fa-fan' flat %}参考文章/资料{% endnote %}

[电机驱动芯片——DRV8833、TB6612、A4950、L298N的详解与比较](https://blog.51cto.com/u_15262460/2883155)

[全国大学生电子设计竞赛(三)--SPWM与PID--果果小师弟](https://mp.weixin.qq.com/s/xa3o6SjaeFCSDEWV_BS6Nw)

[B站天下行走平衡车-gitee](https://gitee.com/GFPhoenix)

[匿名上位机使用方法分享--波形显示](https://blog.csdn.net/wangjt1988/article/details/83686656)

[ANO V7上位机协议程序（新版加入DMA形式发送接收）](https://blog.csdn.net/qq_43603289/article/details/119026568?spm=1001.2014.3001.5502)

[详细介绍如何从0开始写一个数据通信，将数据从单片机发送到上位机](https://blog.csdn.net/qq_44339029/article/details/106004997)

[野火多功能调试助手用户手册](https://www.firebbs.cn/forum.php?mod=viewthread&tid=29923&extra=page%3D1)



{% note blue 'fas fa-fan' flat %}资料/软件下载{% endnote %}

[匿名上位机](http://www.anotc.com/wiki/%E5%8C%BF%E5%90%8D%E4%BA%A7%E5%93%81%E8%B5%84%E6%96%99/%E8%B5%84%E6%96%99%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E6%B1%87%E6%80%BB)

[VOFA+文档/下载软件](https://www.vofa.plus/docs/FAQ/faq)

[cjson-github](https://github.com/DaveGamble/cJSON)







| 记录了电机驱动芯片 |
| :----------------: |
|      LV8548MC      |
|     TB6612FNG      |
|       A4950        |
|      DRV8833       |
|       L298N        |

|  记录了电机型号   |
| :---------------: |
| MG310直流减速电机 |



## 电机

### 有刷直流电机

#### 介绍

- 简介

直流有刷电机是内含电刷装置的将直流电能转换成机械能（直流电动机）或将机械能转换成直流电能（直流发电机）的旋转电机。区别于直流无刷电机，电刷装置是用来引入或引出直流电压和直流电流的。 `直流有刷电机是所有电机的基础，它具有启动快、制动及时、可在大范围内平滑地调速、控制电路相对简单等特点`。是 `闭环`的

- 优点

① 价钱比较便宜，有刷直流电机因为使用的空间比较广，而得到广泛应用的原因就是价钱比较便宜，因此上，出现使用的问题不管是维修还是更换都不会造成经济拮据的问题
② 方便控制，在进行操作的时候只需施加直流电压即可使电机转动。有刷直流电机在使用的时候甚至不需要使用微控制器，只要把电机连接到电池就可以进行很好的使用。
③ 有刷直流电机在低速时会产生输出高扭矩，这样的使用状况即使电机有负载，那么在这种高启动转矩的使用状况下，也可使电机快速上升。

- 缺点

① 有刷电机的刷子在不断地运转时，这些电刷会随着时间的推移而磨损。这样，与其他类型的电机相比，这样的磨损会造成一些使用的麻烦。
② 有刷直流电动机，在使用的时候电刷和换向器之间的电弧。在这样的转换过程中会导致大量的电噪声，而这样的噪声会给人产生较大的不舒服的感觉。
③ 在操作有刷直流电机的时候。部件之间存在摩擦，而这些摩擦会产生热量。有刷直流电机的运转时最大的速度的出现，会因为过高的速度会导致热量过高而出现使用的问题

- 减速器的作用(有的电机有减速器)

因为电机转的比较快所以需要减速来进行控制它

1. 降低电机速度

2. 提高输出扭矩

rpm是每分钟多少转意思，比如一个电机是10000/rpm，减速比是1:20，那它实际转速是 10000 / 20 = 500/rpm，转速减少了扭矩增大，比如原本扭矩是0.1Kg/cm，就变成 1.6Kg/cm，这个看比例

减速比为1:20,即输出轴转一圈,电机内部实际转20圈

> 按照传动级数不同可分为单级和多级减速器；按照传动类型可分为齿轮减速器、蜗杆减速器和行星齿轮减速器
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230625145741.webp)
>
> - `齿轮减速箱体积较小，传递扭矩大，但是有一定的回程间隙`
> - `蜗轮蜗杆减速机的主要特点是具有反向自锁功能，可以有较大的减速比，但是一般体积较大，传动效率不高，精度不高`
> - `行星减速机其优点是结构比较紧凑，回程间隙小、精度较高，使用寿命很长，额定输出扭矩可以做的很大，但价格略贵`



- 电机选型

1. 尺寸：根据结构大小选择尺寸
2. 扭力：要足够带动负载
3. 驱动电压：一般5V，12V，24V
4. 驱动电流：电流和电压影响功率，一般功率越大，扭力越大

> 1. JGA25-370，带编码器，输入电压3.5-20V，约40元
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230704182922.webp)
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230704183020.webp)

> 2. TT马达，品种多，选择余地多。黄色塑料齿轮，1:48，130电机，约1元；蓝色金属齿轮，约6元；黑色高品质带编码器30-50元；黄色塑料齿轮带编码器，14-24元

> 3. GA12-N20，无编码器，速度较慢，约9元

> 4. JGB37-520带编码器电机，约40元

> 5. MG310/370/513，比较可靠的型号，GMR或霍尔编码器，输入电压11-16V(12V)或7-13V(8V)， 约30-120元
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230704183520.webp)
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230704183533.webp)
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230704181814.webp)
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230704182335.webp)



- 驱动方式

1. 只能打开或关闭，不能变速与换向，用继电器，BJT或MOS开关控制通断即可
2. 可以打开或关闭，可以变速，但不能换向，可用PWM控制电子开关，也可控制驱动电压大小，一般选用PWM控制，比较简单
3. 可以打开或关闭，可以变速，也可以换向（正转/反转），用PWM控制桥路，改变流经电机的电流，就能改变电机转向

> 情况1

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524073418.webp)

> 情况2

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524073521.webp)

- 衰减模式

衰减模式，可简单理解为 `如何使电机停下`：如果控制电机一直向一个方向旋转不会产生问题。但是如果这是想让电机停下，那么问题就来了。由于电机是感性负载，电流不能突变。在断开电机两端所加的电压时，电机产生的反向电动势很有可能损坏FET(场效应晶体管，它是一种用于控制电流的半导体器件)。因此想让电机停下，除了断开供电，还要形成一个续流的回路，释放掉电机上的能量。

- 补充

> 驱动电压越大，转速越快；电流越大，扭矩越大
>
> 当 `扭矩<负载` 时，电机转速会下降，电流上升从而增大扭矩。当负载非常大，电机带不动从而停止转动时（堵转），电流达到最大值，此时需特别注意，很有可能烧坏电机驱动
>
> H桥中绝对不能出现同侧（左侧/右侧）的FET同时导通的情况(这样会导致电流不经过电机直接到地，形成短路！因此在状态切换时需要一步一步来，而集成H桥的芯片一般会在内部自动解决这个问题 -- 利用死区控制)

- 编码器

编码器分为 `光电` 和 `霍尔` 编码器，还分为 `增量式` 和 `绝对式`

测量位置(倒立摆)；测量速度(平衡小车)

是一种将 `角位移或者角速度` 转换成 `一连串电数字脉冲` 的旋转式传感器，我们可以通过编码器测量到位移或者速度信息

> 霍尔编码器

霍尔编码器为13位编码器,即电机每转,对于编码器有2的13次方的增量( `简单的说,上面那个霍尔编码器检测的圆盘,转一圈,检测13个脉冲`)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230704184637.webp)

采集数据方式：

第一种软件技术直接采用外部中断进行采集，根据AB相位差的不同可以判断正负

第二种硬件技术直接使用定时器的编码器模式

一般使用第二种，也是大家常说的四倍频，提高测量精度的方法。其实就是把AB相的上升沿和下降沿都采集而已，所以1变4。自己使用外部中断方式实现就比较占用资源了，所以不建议使用

> TI1 <–> 通道A
>
> TI2 <–> 通道B

 `那么编码器的输出信号具体是什么？我们如何根据输出信号测量转速 和方向？`

转速:  单位时间测量到的脉冲数量(比如根据每秒测量到多少个脉冲来计算转速)

旋转方向: 两通道信号的相对电平关系

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230704201236.webp)

STM32单片机的定时器和通用定时器具有**编码器接口模式**、在STM32中文参考手册13章中有详细介绍

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230704185445.webp)

这个是计数方向与编码器信号的关系、我们拆开来看

> 仅在TI1计数、电机正转(对原始数据二倍频)
>
> (看【3】那里虚线往上看，现在是TI1，所以看 `TI1FP1信号` 那栏，现在是上升，然后里面又有向下和向上计数，到达是哪个呢所以需要看TI2对应是什么，是低电平所以看 `相对信号的电平`那栏找到低，对应过去就是 `向上计数`，其他的也是这样看)
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230704202906.webp)
>
> 仅在TI1计数、电机反转(对原始数据二倍频)
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230704203029.webp)
>
> 在TI1和TI2都计数(可以看到这样就对原始数据四倍频了)
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230704203158.webp)
>
> 计数方向
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230704203606.webp)

> **第一种方法(考虑溢出)：**
>
> 这次编码器计数值 = 计数器值+计数溢出次数 * 计数最大器计数最大值
>
> 计数器两次变化值 = 这次编码器计数值 - 上次编码器计数值
>
> 然后根据这个单位变化量计算速度
>
> **还有一种方法(计数一次后下一次前我清0了，因为一般电机转速不会超出的)：**
>
> 计数器变化量 = 当前计数器值
>
> 每次计数值清空
>
> 然后根据这个变化量 计算速度
>
> 然后我们再看具体到哪一款电机和编码器上如何测速

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230704234218.webp)

> 会不会溢出？
>
> 这个看电机的型号，比如我现在的是MG310，一圈脉冲大概是1040，2ms读取一次编码器值，那就是 `32767/1040=31`，也就是每2ms就要旋转31圈，那每秒就是旋转 `31*500=15500` 圈，可以知道我这个型号电机是不会达到这么大的转速的，所以不会溢出



#### 编程示例1

>  程序基于GD32F103VET6

- 直流电机常用驱动IC --- LV8548MC(安森美)

`LV8548MC` 是一种2通道低饱和电压正/反向电机驱动芯片。适用于 `12V` 系统产品，可驱动两台直流电机，一台采用 `并联方式`的直流电机，或者 `可全程` 和 `半步` 驱动步进电机。

供电电压为： `4 ~ 16V`

- 引脚

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524075912.webp)

> IN1和IN2引脚一起工作，驱动输出引脚OUT1和OUT2；IN3和IN4引脚一起工作，驱动输出引脚OUT3和OUT4

- 控制逻辑

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524080206.webp)

> Forward表示正转，Reverse表示反转，这跟电机接线有关系
>
> 控制有刷直流电机正转简单来说其实就是控制电机+极转给高电平，-极默认低电平，反转的话就调转过来
>
> 初始化状态下管脚都是低电平，就绪

- 注意

只需要改变电机的占空比即可控制，至于PWM频率是多少也没有一个固定的数值需要自己去调试，虽然好像频率对电机的影响也不算很大

- 硬件连接

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524084942.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524084304.webp)

> 这次我们控制一个直流电机测试，OUT1接-极，OUT2接+极，IN1接到了32的PB1引脚，是TIM3_CH4，INT2接到PB0，是TIM3_CH3，所以用32单片机控制一路通道输出PWM波，另一路输出低电平，就能用OUT1和OUT2控制电机转动

- MX配置

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524090727.webp)

- 程序编写

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524090925.webp)

> 这里占空比设置到100%的话需要比重装载值大1，否则波形是很小间隙，而不是一条直线

{% folding, DC_Motor.h %}

```cpp
#include "AllHead.h"

// 定义枚举类型
typedef enum
{
    Start_State = (uint8_t)0,
    Stop_State = (uint8_t)1,
}Status_t;

typedef enum
{
    Forward_State = (uint8_t)0,
    Reverse_State = (uint8_t)1,
}Direction_t;

typedef enum
{
    Speed_50 = (uint8_t)500,
    Speed_60 = (uint8_t)600,
    Speed_70 = (uint8_t)700,
    Speed_80 = (uint8_t)800,
    Speed_90 = (uint8_t)900,
    Speed_100 = (uint8_t)1001,    
}Speed_t;

typedef enum
{
    Speed_up = (uint8_t)0,	// 加速
    Speed_down = (uint8_t)1,	// 减速
}Speed_Change_t;

typedef struct
{
    uint8_t Status;	// 直流电机状态
    uint8_t Direction;	// 直流电机方向
    uint8_t Speed;	// 直流电机速度
    void (*Start)(void);
    void (*Stop)(void);
    void (*Direction_Adjust)(void);
    void (*Speed_Adjust)(Speed_Change_t);
}DC_Motor_t;

extern DC_Motor_t DC_Motor;
```

{% endfolding %}

{% folding, DC_Motor.c %}

```cpp
#include "AllHead.h"

static void Start(void);
static void Stop(void);
static void Direction_Adjust(void);
static void Speed_Adjust(Speed_Change_t);

DC_Motor_t DC_Motor = 
{
    Stop_State,
   	Forward_State,
    Speed_50,
    Start,
    Stop,
    Direction_Adjust,
    Speed_Adjust
};


static void Start()
{
    //启动电机
    if(DC_Motor.Direction ==  Forward_Status)   //如果电机的方向是正转
    {
        HAL_TIM_PWM_Start(&htim3, TIM_CHANNEL_3);   //启动定时器3通道3的PWM输出
    }
    else //如果电机方向是反转
    {
        HAL_TIM_PWM_Start(&htim3, TIM_CHANNEL_4);   //启动定时器3通道4的PWM输出
    }
    //更新电机状态
    DC_Motor.Status = Start_Status;
}

static void Stop()
{
    //关闭电机
    if(DC_Motor.Status == Start_Status)
    {
        HAL_TIM_PWM_Stop(&htim3, TIM_CHANNEL_3);    //关闭通道的3PWM输出
        HAL_TIM_PWM_Stop(&htim3, TIM_CHANNEL_4);    //关闭通道的4PWM输出
    }
    //更新电机状态
    DC_Motor.Status = Stop_Status;
}

/*
* @name   Direction_Adjust
* @brief  调整转动方向
* @param  Direction：要设置的方向
* @retval None
*/
static void Direction_Adjust()
{
    //判断是否是启动状态
    if(DC_Motor.Status == Start_Status)
    {
        if(DC_Motor.Direction == Reverse_Status)        //如果原来是反转
        {
            //设置为正转
            HAL_TIM_PWM_Stop(&htim3, TIM_CHANNEL_4);    //关闭通道4的PWM输出
            HAL_Delay(200);                             //延时200ms，等待电机停止
            HAL_TIM_PWM_Start(&htim3, TIM_CHANNEL_3);   //启动定时器3通道3的PWM输出
            DC_Motor.Direction = Forward_Status;        //更新方向为正转
        }
        else        //如果原来是正转
        {
            //设置为反转
            HAL_TIM_PWM_Stop(&htim3, TIM_CHANNEL_3);    //关闭通道3的PWM输出
            HAL_Delay(200);                             //延时200ms，等待电机停止
            HAL_TIM_PWM_Start(&htim3, TIM_CHANNEL_4);   //启动定时器3通道4的PWM输出
            DC_Motor.Direction = Reverse_Status;        //更新方向为反转
        }
    }
}

/*
* @name   Speed_Adjust
* @brief  调整转动速度
* @param  Speed_Change：增加速度或者减少速度
* @retval None
*/
static void Speed_Adjust(Speed_Change_t Speed_Change)
{
    //判断是否是启动状态
    if(DC_Motor.Status == Start_Status)
    {
        //增大电机速度
        if(Speed_Change == speed_up)
        {
            switch (DC_Motor.Speed)
            {
            case Speed_50:
                DC_Motor.Speed = Speed_60;
                break;
            case Speed_60:
                DC_Motor.Speed = Speed_70;
                break;
            case Speed_70:
                DC_Motor.Speed = Speed_80;
                break;
            case Speed_80:
                DC_Motor.Speed = Speed_90;
                break;
            case Speed_90:
                DC_Motor.Speed = Speed_100;
                break;
            case Speed_100:
                DC_Motor.Speed = Speed_100;
                break;
            default:
                DC_Motor.Speed = Speed_50;
                break;
            }
        }
        //减少电机速度
        else
        {
            switch (DC_Motor.Speed)
            {
            case Speed_50:
                DC_Motor.Speed = Speed_50;
                break;
            case Speed_60:
                DC_Motor.Speed = Speed_50;
                break;
            case Speed_70:
                DC_Motor.Speed = Speed_60;
                break;
            case Speed_80:
                DC_Motor.Speed = Speed_70;
                break;
            case Speed_90:
                DC_Motor.Speed = Speed_80;
                break;
            case Speed_100:
                DC_Motor.Speed = Speed_90;
                break;
            default:
                DC_Motor.Speed = Speed_90;
                break;
            }
        }
        //改变占空比
        TIM3->CCR3 = DC_Motor.Speed;
        TIM3->CCR4 = DC_Motor.Speed;
    }
}
```

{% endfolding %}



#### 编程示例2

> 电机驱动板是TB6612FNG，电机型号是MG310直流减速电机，减速比20，电压范围7-13V，速度1.3m/s，编码器是13线霍尔
>


> 程序基于GD32F103VET6

- 电机驱动模块详解

1. TB6612FNG是直流电机驱动器件，它具有大电流 `MOSFET-H` 桥结构，双通道电路输出，可同时驱动2个电机
2. 相比L298N 的热耗性和外围二极管续流电路，它无需外加散热片，外围电路简单，只需外接电源滤波电容就可以直接驱动电机，
   利于减小系统尺寸。对于PWM 信号输入频率范围，高达 `100 kHz(一般10~20KHz就够了)`
3. 参数：最大输入电压：VM = 15V ；最大输出电流：Iout = 1.2A（平均）/3.2A（峰值）；正反转/短路刹车/停机功能模式；内置过热保护和低压检测电路

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230625080128.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230625080140.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230625080259.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230625161756.webp) 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230625180508.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230625180726.webp)

{% endgallery %}

- 数据手册

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230625184519.webp)

> CW（Clockwise顺时针）：即正向旋转；
>
> CCW（Counterclockwise逆时针）：即反向旋转；
>
> Stop（自由停车）：即前述的滑动/电流快衰减；
>
> Short brake（刹车）：即前述的制动/电流慢衰减；
>
> Standby（待机）：即芯片不工作
>
> 仔细观察上表，可发现其相比于DRV8833的控制，不同在于多了一个PWM脚
>
> - 如果令PWM输入脚一直为高电平，即只通过IN1和IN2控制电机的四个状态（旋转时为满速状态），这便是最基础的控制
> - 当加入了PWM后，便可和之前一样，通过占空比调节速度
>   1. 一种是 `IN1和IN2固定，PWM脚输入PWM`，此时是配合慢衰减调速。例如：IN1为1，IN2为0，PWM为PWM，则正转和慢衰减相互切换；
>   2. 另外一种是 `PWM脚为高电平，IN1、IN2中的一个固定另一个为PWM输入`，此时是配合快衰减调速。例如，IN1为1，IN2为PWM输入，PWM为1，则正转与快衰减相互切换
>
> - PWM的频率一般选在5k~20kHz

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/8a2eda5bb899ccb06f398b40454a197b.webp)



- 接线注意

> Motor_B 对应车的左轮，Motor_A对应车的右轮
>
> `STBY` 是使能端高电平有效，接3.3或者5V即可
>
> `AO1/AO2` 的话接电机的 `+/-`即可(这个无所谓这个只会影响正反转)
>
> `PWMA` 的话接单片机的PWM输出引脚，一般是给10KHz即可，通过输出 `0%~100%` 占空比控制电机的速度
>
> `AIN1/AIN2` 是控制电机的正反转引脚通过高低电平，接单片机IO即可
>
> `VM` 的话接12V
>
> `注意：必须要有PWM 输入才有AO1 和AO2 的信号，只接AIN1 和AIN2不会产生AO1 和AO2 的信号`
>
> 另一路电机B同理



##### 速度开环控制

> 无反馈，直接控制。(速度与PWM 值成正比，所以为速度开环控制)

- MX配置

使用定时器4的4个通道输出PWM给电机，不需要开中断

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230626180131.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230626175957.webp)

- 程序编写

{% folding, Motor.h %}

```cpp
#ifndef __MOTOR_H
#define __MOTOR_H

// 宏定义 管脚
/*后左*/
#define LATER_LEFT_PWMB GPIO_PIN_12
#define LATER_LEFT_BIN1 GPIO_PIN_2
#define LATER_LEFT_BIN2 GPIO_PIN_3
/*后右*/
#define LATER_RIGHT_PWMA GPIO_PIN_13
#define LATER_RIGHT_AIN1 GPIO_PIN_4
#define LATER_RIGHT_AIN2 GPIO_PIN_5
/*前左*/
#define FRONT_LEFT_PWMA GPIO_PIN_14
#define FRONT_LEFT_AIN1 GPIO_PIN_0
#define FRONT_LEFT_AIN2 GPIO_PIN_1
/*前右*/
#define FRONT_RIGHT_PWMB GPIO_PIN_15
#define FRONT_RIGHT_BIN1 GPIO_PIN_6
#define FRONT_RIGHT_BIN2 GPIO_PIN_7

typedef enum
{
    Motor_FRONT_LEFT = (uint8_t)0,  // 左前
    Motor_FRONT_RIGHT = (uint8_t)1, // 右前
    Motor_LATER_LEFT = (uint8_t)2,  // 左后
    Motor_LATER_RIGHT = (uint8_t)3, // 右后
}Motor_Mark_t;

typedef struct
{
	int16_t usMotor_Fre;	// 电机频率
    int16_t usLater_Left_Duty; // 后左电机占空比
    int16_t usLater_Right_Duty; // 后右电机占空比
    int16_t usFront_Left_Duty; // 前左电机占空比
    int16_t usFront_Right_Duty; // 前右电机占空比
    void (*Motor_Init)(void);
    void (*Motor_Front_Left_Set_Forward)(void); // 正转
    void (*Motor_Front_Right_Set_Forward)(void);
    void (*Motor_Later_Left_Set_Forward)(void);
    void (*Motor_Later_Right_Set_Forward)(void);

    void (*Motor_Front_Left_Set_Reverse)(void); // 反转
    void (*Motor_Front_Right_Set_Reverse)(void);
    void (*Motor_Later_Left_Set_Reverse)(void);
    void (*Motor_Later_Right_Set_Reverse)(void);   

    void (*Motor_Set_Duty)(Motor_Mark_t, float); // 设置占空比(速度)
	void (*Motor_Fre_And_Duty_compute)(void);   // 频率占空比计算(用于显示OLED)
    void (*Motor_Stop)(void);   // 自由停车
    double (*Motor_Clamp)(double, double, double);   // 限幅 
    void (*Motor_Brake)(void);  // 刹车
}Motor_t;


extern Motor_t Motor;

#endif
```

{% endfolding %}

{% folding, Motor.c %}

```cpp
/***************************************************************************
 * File: Motor.c
 * Author: Luckys.
 * Date: 2023/06/23
 * description: 电机
 -----------------------------------
接线：
    后左轮：PD12 --- Timer4_CH1    PE2 --- BIN1 PE3 --- BIN2
    后右轮：PD13 --- Timer4_CH2    PE4 --- AIN1 PE5 --- AIN2
    前左轮：PD14 --- Timer4_CH3    PE0 --- AIN1 PE1 --- AIN2
    前右轮：PD15 --- Timer4_CH4    PD6 --- BIN1 PD7 --- BIN2
    STBY --- 3.3V    
频率：
    MX设置了ARR为7199，PSC为0  ---> 72000000 / (7199 + 1) / (0 + 1) = 10KHz    
 -----------------------------------
****************************************************************************/
#include "AllHead.h"

/*====================================static function declaration area BEGIN====================================*/

static void Motor_Init(void);

static void Motor_Front_Left_Set_Forward(void);
static void Motor_Front_Right_Set_Forward(void);
static void Motor_Later_Left_Set_Forward(void);
static void Motor_Later_Right_Set_Forward(void);

static void Motor_Front_Left_Set_Reverse(void);
static void Motor_Front_Right_Set_Reverse(void);
static void Motor_Later_Left_Set_Reverse(void);
static void Motor_Later_Right_Set_Reverse(void);

static void Motor_Set_Duty(Motor_Mark_t motor, float duty);
static void Motor_Fre_And_Duty_compute(void);
static void Motor_Stop(void);
static double Motor_Clamp(double value, double min_value, double max_value);
static void Motor_Brake(void);

/*====================================static function declaration area   END====================================*/

Motor_t Motor = 
{
	0,
    0,
    0,
    0,
    0,
    Motor_Init,
    Motor_Front_Left_Set_Forward,
    Motor_Front_Right_Set_Forward,
    Motor_Later_Left_Set_Forward,
    Motor_Later_Right_Set_Forward,

    Motor_Front_Left_Set_Reverse,
    Motor_Front_Right_Set_Reverse,
    Motor_Later_Left_Set_Reverse,
    Motor_Later_Right_Set_Reverse,

    Motor_Set_Duty,
	Motor_Fre_And_Duty_compute,
    Motor_Stop,
    Motor_Clamp,
    Motor_Brake
};


/*
* @function: Motor_Init
* @param: None
* @retval: None
* @brief: 电机初始化
*/
static void Motor_Init(void)
{
    HAL_TIM_PWM_Start(&htim4, TIM_CHANNEL_1);
    HAL_TIM_PWM_Start(&htim4, TIM_CHANNEL_2);
    HAL_TIM_PWM_Start(&htim4, TIM_CHANNEL_3);
    HAL_TIM_PWM_Start(&htim4, TIM_CHANNEL_4);
	
    // 初始化四个轮子正转
    Motor_Front_Left_Set_Forward();
    Motor_Front_Right_Set_Forward();
    Motor_Later_Left_Set_Forward();
    Motor_Later_Right_Set_Forward();
}

/*
* @function: Motor_Front_Left_Forward
* @param: None
* @retval: None
* @brief: 左前轮正转
*/
static void Motor_Front_Left_Set_Forward(void)
{
    HAL_GPIO_WritePin(GPIOE, FRONT_LEFT_AIN1, GPIO_PIN_SET);
    HAL_GPIO_WritePin(GPIOE, FRONT_LEFT_AIN2, GPIO_PIN_RESET);
}

/*
* @function: Motor_Front_Right_Set_Forward
* @param: None
* @retval: None
* @brief: 右前轮正转
*/
static void Motor_Front_Right_Set_Forward(void)
{
    HAL_GPIO_WritePin(GPIOD, FRONT_RIGHT_BIN1, GPIO_PIN_SET);
    HAL_GPIO_WritePin(GPIOD, FRONT_RIGHT_BIN2, GPIO_PIN_RESET);    
}

/*
* @function: Motor_Later_Left_Set_Forward
* @param: None
* @retval: None
* @brief: 左后轮正转
*/
static void Motor_Later_Left_Set_Forward(void)
{
    HAL_GPIO_WritePin(GPIOE, LATER_LEFT_BIN1, GPIO_PIN_RESET);
    HAL_GPIO_WritePin(GPIOE, LATER_LEFT_BIN2, GPIO_PIN_SET);    
}

/*
* @function: Motor_Later_Right_Set_Forward
* @param: None
* @retval: None
* @brief: 右后轮正转
*/
static void Motor_Later_Right_Set_Forward(void)
{
    HAL_GPIO_WritePin(GPIOE, LATER_RIGHT_AIN1, GPIO_PIN_RESET);
    HAL_GPIO_WritePin(GPIOE, LATER_RIGHT_AIN2, GPIO_PIN_SET);     
}

/*
* @function: Motor_Front_Left_Set_Reverse
* @param: None
* @retval: None
* @brief: 左前轮反转
*/
static void Motor_Front_Left_Set_Reverse(void)
{
    HAL_GPIO_WritePin(GPIOE, FRONT_LEFT_AIN1, GPIO_PIN_RESET);
    HAL_GPIO_WritePin(GPIOE, FRONT_LEFT_AIN2, GPIO_PIN_SET);    
}

/*
* @function: Motor_Front_Right_Set_Reverse
* @param: None
* @retval: None
* @brief: 右前轮反转
*/
static void Motor_Front_Right_Set_Reverse(void)
{
    HAL_GPIO_WritePin(GPIOD, FRONT_RIGHT_BIN1, GPIO_PIN_RESET);
    HAL_GPIO_WritePin(GPIOD, FRONT_RIGHT_BIN2, GPIO_PIN_SET);    
}

/*
* @function: Motor_Later_Left_Set_Reverse
* @param: None
* @retval: None
* @brief: 左后轮反转
*/
static void Motor_Later_Left_Set_Reverse(void)
{
    HAL_GPIO_WritePin(GPIOE, LATER_LEFT_BIN1, GPIO_PIN_SET);
    HAL_GPIO_WritePin(GPIOE, LATER_LEFT_BIN2, GPIO_PIN_RESET);    
}

/*
* @function: Motor_Later_Right_Set_Reverse
* @param: None
* @retval: None
* @brief: 右后轮反转
*/
static void Motor_Later_Right_Set_Reverse(void)
{
    HAL_GPIO_WritePin(GPIOE, LATER_RIGHT_AIN1, GPIO_PIN_SET);
    HAL_GPIO_WritePin(GPIOE, LATER_RIGHT_AIN2, GPIO_PIN_RESET);     
}

/*
* @function: Motor_Stop
* @param: None
* @retval: None
* @brief: 自由停车
*/
static void Motor_Stop(void)
{
    HAL_GPIO_WritePin(GPIOE, FRONT_LEFT_AIN1, GPIO_PIN_RESET);
    HAL_GPIO_WritePin(GPIOE, FRONT_LEFT_AIN2, GPIO_PIN_RESET); 

    HAL_GPIO_WritePin(GPIOD, FRONT_RIGHT_BIN1, GPIO_PIN_RESET);
    HAL_GPIO_WritePin(GPIOD, FRONT_RIGHT_BIN2, GPIO_PIN_RESET);

    HAL_GPIO_WritePin(GPIOE, LATER_LEFT_BIN1, GPIO_PIN_RESET);
    HAL_GPIO_WritePin(GPIOE, LATER_LEFT_BIN2, GPIO_PIN_RESET); 

    HAL_GPIO_WritePin(GPIOE, LATER_RIGHT_AIN1, GPIO_PIN_RESET);
    HAL_GPIO_WritePin(GPIOE, LATER_RIGHT_AIN2, GPIO_PIN_RESET);     
}

/*
* @function: Motor_Brake
* @param: None
* @retval: None
* @brief: 刹车
*/
static void Motor_Brake(void)
{
    Motor_Set_Duty(Motor_FRONT_LEFT,0);
    Motor_Set_Duty(Motor_FRONT_RIGHT,0);
    Motor_Set_Duty(Motor_LATER_LEFT,0);
    Motor_Set_Duty(Motor_LATER_RIGHT,0);
}

/*
* @function: Motor_Set_Duty
* @param: motor -> 哪个电机 duty -> 占空比设置(范围0%~101%)
* @retval: None
* @brief: 设置电机占空比
*/
static void Motor_Set_Duty(Motor_Mark_t motor, float duty)
{
    switch(motor)
    {
        case Motor_FRONT_LEFT:
        {
            Motor.usFront_Left_Duty = (TIM4->ARR + 1) * (duty / 100.0f);
            TIM4->CCR3 = Motor.usFront_Left_Duty;
            break;
        }
        case Motor_FRONT_RIGHT:
        {
            Motor.usFront_Right_Duty = (TIM4->ARR + 1) * (duty / 100.0f);
            TIM4->CCR4 = Motor.usFront_Right_Duty;
            break;
        }
        case Motor_LATER_LEFT:
        {
            Motor.usLater_Left_Duty = (TIM4->ARR + 1) * (duty / 100.0f);
            TIM4->CCR1 = Motor.usLater_Left_Duty;
            break;
        }
        case Motor_LATER_RIGHT:
        {
            Motor.usLater_Right_Duty = (TIM4->ARR + 1) * (duty / 100.0f);
            TIM4->CCR2 = Motor.usLater_Right_Duty;
            break;
        }
        default:break;                        
    }
#if LOG_DEBUG
    printf("TIM4_CH1:%d  TIM4_CH2:%d\r\nTIM4_CH3:%d  TIM4_CH4:%d\r\n", TIM4->CCR1,TIM4->CCR2,TIM4->CCR3,TIM4->CCR4);
#endif
}

/*
* @function: Motor_Fre_And_Duty_compute
* @param: None
* @retval: None
* @brief: 实际电机频率占空比计算
*/
static inline void Motor_Fre_And_Duty_compute(void)
{
    uint16_t Timer4_fre = 0;
    float T4_CH1_Duty = 0, T4_CH2_Duty = 0, T4_CH3_Duty = 0, T4_CH4_Duty = 0;

    Timer4_fre = 72000000 / (TIM4->PSC + 1) / (TIM4->ARR + 1);  // 计算频率
	Motor.usMotor_Fre = Timer4_fre;
    T4_CH1_Duty = ((float)TIM4->CCR1 / TIM4->ARR) * 100;    // 计算占空比
    T4_CH2_Duty = ((float)TIM4->CCR2 / TIM4->ARR) * 100;
    T4_CH3_Duty = ((float)TIM4->CCR3 / TIM4->ARR) * 100;
    T4_CH4_Duty = ((float)TIM4->CCR4 / TIM4->ARR) * 100;

		Public.UsartPrintf(huart_debug,"电机频率：%d\r\n",Motor.usMotor_Fre);
	Public.UsartPrintf(huart_debug,"前左：%.0f 前右：%.0f 后左：%.0f 后右：%.0f\r\n\r\n",T4_CH3_Duty,T4_CH4_Duty,T4_CH1_Duty,T4_CH2_Duty);
#if LOG_DEBUG
    printf("CH1:%.0f  CH2:%.0f\r\n CH3:%.0f CH4:%.0f\r\n", T4_CH1_Duty, T4_CH2_Duty, T4_CH3_Duty, T4_CH4_Duty);
#endif
}

/*
* @function: Motor_Clamp
* @param: None
* @retval: None
* @brief: 限幅函数
*/
static double Motor_Clamp(double value, double min_value, double max_value)
{
    if (value < min_value)
    {
        return min_value;
    }
    else if (value > max_value)
    {
        return max_value;
    }
    return value;
}
```

{% endfolding %}

> 正转的话可以：
>
> ```cpp
> // 正转
> i = 20;
> Motor.Motor_Front_Left_Set_Forward();
> Motor.Motor_Front_Right_Set_Forward();
> Motor.Motor_Later_Left_Set_Forward();
> Motor.Motor_Later_Right_Set_Forward();
> 
> Motor.Motor_Set_Duty(Motor_FRONT_LEFT, i);
> Motor.Motor_Set_Duty(Motor_FRONT_RIGHT, i);
> Motor.Motor_Set_Duty(Motor_LATER_LEFT, i);
> Motor.Motor_Set_Duty(Motor_LATER_RIGHT, i);
> ```
>
> 反转：
>
> ```cpp
> // 反转
> i = -20;
> Motor.Motor_Front_Left_Set_Reverse();
> Motor.Motor_Front_Right_Set_Reverse();
> Motor.Motor_Later_Left_Set_Reverse();
> Motor.Motor_Later_Right_Set_Reverse();
> 
> Motor.Motor_Set_Duty(Motor_FRONT_LEFT, -i);
> Motor.Motor_Set_Duty(Motor_FRONT_RIGHT, -i);
> Motor.Motor_Set_Duty(Motor_LATER_LEFT, -i);
> Motor.Motor_Set_Duty(Motor_LATER_RIGHT, -i);
> ```
>
> 刹车(清除占空比即可方向引脚无需改变)：
>
> ```cpp
> Motor.Motor_Brake();
> ```
>
> 自由停车(方向引脚全部拉低PWM引脚无需改变)：
>
> ```cpp
> Motor.Motor_Stop();
> ```



##### 速度闭环控制(位置式PID)

> 编码器数值的获取及其数值实际意义： `电机转速=编码器读数*当前频率(单位s)/电机减速比/编码器精度/倍频数(r/s)`
>
> 闭环控制的意义： `有反馈的控制`
>
> 速度闭环控制的过程： `根据当前速度反馈，调整PWM值`

- MX配置

后右轮：

| 驱动板 | 单片机(定时器接口) |
| :----: | :----------------: |
|  E1A   |   TIM8_CH1(PC6)    |
|  E1B   |   TIM8_CH2(PC7)    |

后左轮：

| 驱动板 | 单片机(定时器接口) |
| :----: | :----------------: |
|  E2A   |   TIM5_CH1(PA0)    |
|  E2B   |   TIM5_CH2(PA1)    |

前左轮：

| 驱动板 | 单片机(定时器接口) |
| :----: | :----------------: |
|  E1A   |   TIM8_CH1(PC6)    |
|  E1B   |   TIM8_CH2(PC7)    |

前右轮：

| 驱动板 | 单片机(定时器接口) |
| :----: | :----------------: |
|  E2A   |   TIM2_CH1(PA15)   |
|  E2B   |   TIM2_CH2(PB3)    |



编码器需要用一个定时器来进行输入捕获计算速度反馈给pid调速，需要开中断(程序里暂时没用到中断但是还是开启了)，定时器6用作普通计数功能开中断

1. 打开编码器模式，设置ARR，设置滤波器为6，TI1和TI2都计数，然后引脚都设置为上拉

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230704215645.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230704232334.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230704232347.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230704232706.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230706154016.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230706154150.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230706154306.webp)

{% endgallery %}




- 测试程序编写

> 首先先简单调试一下看看能不能读取到编码器的值，设置2ms读取打印在上位机，用手去转动轮子，如果向前转读出的值是负数那就需要在前面加一个 `-` 这样才合理，向后转是负数

> 把清0屏蔽掉，然后在轮子那夹张纸片啥的当做标识，手动旋转一圈看看大概跟理论旋转一圈的值是不是差不多，我手动转一圈大概是1059，理论是 `减速比30，霍尔线13，倍频是4，那一圈脉冲数就是 30*13*4=1040`，可以看到很接近(有误差是正常的)

```cpp
// 初始化
static void PID_Timer_Init(void)
{
    HAL_TIM_Encoder_Start(&htim5,TIM_CHANNEL_ALL);//开启定时器5
    HAL_TIM_Encoder_Start(&htim8,TIM_CHANNEL_ALL);//开启定时器8
    HAL_TIM_Base_Start_IT(&htim5);				//开启定时器2 中断
    HAL_TIM_Base_Start_IT(&htim8);                //开启定时器4 中断
}

// 测试代码
static void TasksHandle_2MS(void)
{
  Motor.Motor_Brake();	// 刹车(因为测试我们手动转轮子即可)
  // 1.保存计数器值
  PID.Encoder1Count = (short)__HAL_TIM_GET_COUNTER(&htim5) * -1;	// 我的左轮向前是负数所以需要*-1转为正数
  PID.Encoder2Count = (short)__HAL_TIM_GET_COUNTER(&htim8);
  // 2.清零计数器值
  __HAL_TIM_SET_COUNTER(&htim5, 0);
  __HAL_TIM_SET_COUNTER(&htim8, 0);
  Public.UsartPrintf(huart_debug, "Encoder1Count:%d\r\n", PID.Encoder1Count);	// 打印调试
  Public.UsartPrintf(huart_debug, "Encoder2Count:%d\r\n", PID.Encoder2Count);
}
```

> 转速计算测试，2ms太快了，我们定时10ms进行计算套公式就行了，注意要强制类型转换为float，否则打印结果只有整数部分小数部分丢失！

```cpp
//在上面结构体里添加两个变量
float Motor2Speed;  // 电机2速度(s)
float Motor1Speed;  // 电机1速度(s)

// 然后在上面基础上改一下
static void TasksHandle_10MS(void)
{
  Motor.Motor_Brake();
  // 1.保存计数器值
  PID.Encoder1Count = (short)__HAL_TIM_GET_COUNTER(&htim5) * -1;
  PID.Encoder2Count = (short)__HAL_TIM_GET_COUNTER(&htim8);
  // 2.清零计数器值
  __HAL_TIM_SET_COUNTER(&htim5, 0);
  __HAL_TIM_SET_COUNTER(&htim8, 0);

  PID.Motor1Speed = (float)PID.Encoder1Count * 100 / 20 / 13 / 4;  // 因为是每秒多少转所以需要把10ms转为s
  PID.Motor2Speed = (float)PID.Encoder2Count * 100 / 20 / 13 / 4;

  Public.UsartPrintf(huart_debug, "Motor1Speed:%.2f\r\n", PID.Motor1Speed);
  Public.UsartPrintf(huart_debug, "Motor2Speed:%.2f\r\n", PID.Motor2Speed);  
}
```

> 添加定时器，在定时器里进行每10ms获取一次计数值

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230705105939.webp)

```cpp
void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim) // 定时器中断回调函数
{
	if (htim == &htim7)
	{
		static uint16_t Encode_Cnt;
        
		Encode_Cnt++;
		
		if ((Encode_Cnt % 10) == 0)
		{
			// 1.保存计数器值
			PID.Encoder1Count = (short)__HAL_TIM_GET_COUNTER(&htim5) * -1;
			PID.Encoder2Count = (short)__HAL_TIM_GET_COUNTER(&htim8);
			// 2.清零计数器值
			__HAL_TIM_SET_COUNTER(&htim5, 0);
			__HAL_TIM_SET_COUNTER(&htim8, 0);

			PID.Motor1Speed = (float)PID.Encoder1Count * 100 / 20 / 13 / 4; // 因为是每秒多少转所以需要把10ms转为s
			PID.Motor2Speed = (float)PID.Encoder2Count * 100 / 20 / 13 / 4;
			Encode_Cnt = 0;
		}
		System.Task_Marks_Handler();
	}
}
```

> 如果给占空比为正数，但是车是倒着走就需要在程序里修改，把传入后的占空比前面加一个 `-` 即可，需要注意要先进行占空比正负判断来决定小车是往前还是往后，再把负数改为正数再赋值给CCRx寄存器

```cpp
/*
* @function: Motor_Set_Duty
* @param: motor -> 哪个电机 duty -> 占空比设置(范围0%~100%)
* @retval: None
* @brief: 设置电机占空比
*/
static inline void Motor_Set_Duty(Motor_Mark_t motor, float duty)
{
    uint16_t CH1_pulse,CH2_pulse,CH3_pulse,CH4_pulse;

    switch(motor)
    {
        case Motor_FRONT_LEFT:
        {
            if (duty < 0)
            {
                Motor_Set_Reverse(Motor_FRONT_LEFT);
                duty = -duty;   // 取反转为正数
            }
            else
            {
                Motor_Set_Forward(Motor_FRONT_LEFT);
            }
            CH1_pulse = (TIM4->ARR + 1) * (float)(duty / 100.0f);
            TIM4->CCR3 = CH1_pulse;
            break;
        }
        case Motor_FRONT_RIGHT:
        {
            if (duty < 0)
            {
                Motor_Set_Reverse(Motor_FRONT_RIGHT);
                duty = -duty;   // 取反转为正数
            }
            else
            {
                Motor_Set_Forward(Motor_FRONT_RIGHT);
            }            
            CH2_pulse = (TIM4->ARR + 1) * (float)(duty / 100.0f);
            TIM4->CCR4 = CH2_pulse;
            break;
        }
        case Motor_LATER_LEFT:
        {
            if (duty < 0)
            {
                Motor_Set_Reverse(Motor_LATER_LEFT);
                duty = -duty;   // 取反转为正数
            }
            else
            {
                Motor_Set_Forward(Motor_LATER_LEFT);
            }           
            CH3_pulse = (TIM4->ARR + 1) * (float)(duty / 100.0f);
            TIM4->CCR1 = CH3_pulse;
            break;
        }
        case Motor_LATER_RIGHT:
        {
            if (duty < 0)
            {
                Motor_Set_Reverse(Motor_LATER_RIGHT);
                duty = -duty;   // 取反转为正数
            }
            else
            {
                Motor_Set_Forward(Motor_LATER_RIGHT);
            }            
            CH4_pulse = (TIM4->ARR + 1) * (float)(duty / 100.0f);
            TIM4->CCR2 = CH4_pulse;
            break;
        }
        default:break;                        
    }
#if LOG_DEBUG
    printf("TIM4_CH1:%d  TIM4_CH2:%d\r\nTIM4_CH3:%d  TIM4_CH4:%d\r\n", TIM4->CCR1,TIM4->CCR2,TIM4->CCR3,TIM4->CCR4);
#endif
}
```

```cpp
Motor.usLater_Left_Duty = 30;
Motor.usLater_Right_Duty = 30;
Motor.Motor_Set_Duty(Motor_LATER_LEFT, Motor.usLater_Left_Duty);
Motor.Motor_Set_Duty(Motor_LATER_RIGHT, Motor.usLater_Right_Duty);
```

> 简单的闭环速度控制，把转速控制在 `2.9-3.1`转每秒

```cpp
static void TasksHandle_100MS(void)
{
  if (Encoder.Motor1Speed < 2.9)
  {
    Motor.usLater_Left_Duty++;
  }
  if (Encoder.Motor1Speed > 3.1)
  {
    Motor.usLater_Left_Duty--;
  }

  if (Encoder.Motor2Speed < 2.9)
  {
    Motor.usLater_Right_Duty++;
  }
  if (Encoder.Motor2Speed > 3.1)
  {
    Motor.usLater_Right_Duty--;
  }  

  Motor.Motor_Set_Duty(Motor_LATER_LEFT,Motor.usLater_Left_Duty);
	Motor.Motor_Set_Duty(Motor_LATER_RIGHT,Motor.usLater_Right_Duty);
  
  Public.UsartPrintf(huart_debug, "Motor1Speed:%.2f duty1:%d\r\n", Encoder.Motor1Speed,Motor.usLater_Left_Duty);
  Public.UsartPrintf(huart_debug, "Motor2Speed:%.2f duty2:%d\r\n\r\n", Encoder.Motor2Speed,Motor.usLater_Right_Duty);      
}
```

转速控制到我们想要的范围，但是我们并不满意、能够看出来控制的速度很慢，给电机一些阻力电机至少要2-3秒能够调整过来，这在一些场景是不允许的。

理想的控制效果是：在电机转速很慢的是时候能快速调整，在电机一直转的不能达到要求时候能够更快速度调整

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230705143528.webp)

> PID控制写在【PID学习-附1-位置式PID】



- 最终程序编写









####  编程示例3

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/624b1df5b01f717b3ce5dea758a3706a.webp)

- 驱动芯片介绍

> -  A4950，单H桥电机驱动芯片
> - 电机驱动电压：8~40V，输出最大电流可达3.5A
> - 内置过温保护，短路保护和可选择的过流保护

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230625195204.webp)

> GND --- 接地
>
> IN2 --- H桥逻辑输入1
>
> IN1 --- H桥逻辑输入2
>
> VREF --- 逻辑电压和用于限流比较的电压，一般接5V
>
> VBB --- 电机驱动电压(内部对其处理后供给逻辑电路）
>
> OUT1 --- H桥输出1
>
> LSS --- H桥的电流控制，可通过一个电阻接地限制电流(不限电流时直接接地）
>
> OUT2 --- H桥输出2
>
> PAD --- 用于散热

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/53c2fbe88c5f40032508e3e948bb3b29.webp)

> 通过引脚说明和功能框图可看出，此芯片不同之处有：
>
> - 只有单H桥，因此引脚较少；
> - 限流比较的参考电压由外部给出（VREF脚）；因此限流值 `Isense=Vref/10/Rsense`。如上面的模块中，Vref接5V，Rsense为R250精密检测电阻（0.25Ω），因此限流值为2A
> - 当IN1和IN2均保持低电平1ms，芯片进入待机模式。而不是通过引脚直接控制。

此芯片的驱动逻辑与DRV8833PWP芯片一模一样



#### 编程示例4

- 驱动芯片介绍

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230704185037.webp)

> -  L298N是ST公司的一款电机驱动芯片，也是集成了双H桥
> - 电机驱动电压3~48V；可持续工作的输出电流为2A，峰值可达3A
> - 如上图，L298N模块明显比前两个芯片模块外接的元件多，这与L298N的内部结构有关（下面将介绍）
> - 如上图，由于该芯片在H桥上的损耗严重发热较明显（饱和压降大），需要加装散热片，因此在使用上比前两个芯片复杂，体积也相对较大

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/5007d74f0cbfff05ba477e2f77a7fe2e.webp)

> Sense A --- H桥A的电流控制，可通过一个电阻接地限制电流(不限电流时直接接地）
>
> VSS --- 给内部逻辑电路供电，一般接5V
>
> Out 1 --- H桥A的输出1脚
>
> Input 3 --- H桥B的逻辑输入1
>
> Out 2 --- H桥A的输出2脚
>
> Enable B --- H桥B的使能控制端，高电平打开，低电平关闭
>
> Vs --- 电机驱动电压3~48V，需要一个100nF的滤波电容接地
>
> Input 4 --- H桥B的逻辑输入2
>
> Input 1 --- H桥A的逻辑输入1
>
> Out 3 --- H桥B的输出1脚
>
> Enable A --- H桥A的使能控制端，高电平打开，低电平关闭
>
> Out 4 --- H桥B的输出2脚
>
> Input 2 --- H桥A的逻辑输入2
>
> Sense B --- H桥B的电流控制，可通过一个电阻接地限制电流(不限电流时直接接地）
>
> GND --- 接地	

L298N有两个使能控制引脚可分别控制两个H桥是否使能，其余则和前两个芯片类似

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/f5c3ad14ea60bb4a28624e6a7414e534.webp)

> - L298N的内部功能很多都类似，比如电流检测，H桥驱动，外接电容等
> - 主要区别在于L298N的H桥采用了BJT而不是MOSFET。这就直接导致没有寄生二极管，无法像前两个芯片一样实现续流。因此需要外接8个续流二极管。因为频率不高，选用普通的整流二极管即可（如1N4007）
> - 此芯片的电流检测脚Sense X并不像前面的芯片，其没有在内部进行电压比较从而限流，从数据手册上看，需要一个L297芯片配合进行限流。因此一般直接接地，不进行限流。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230625200649.webp)

> 如果想进行速度的控制，那么一种方法是对Enable A输入PWM， 当IN1=1，IN2=0时，即在正转与快衰减之间来回切换，与前面原理类似，占空比越大，速度越快

> 以上三种芯片驱动能力排序： `DRV8833<BT6612<A4950≈L298N`
>
> 选择这种集成H桥芯片时，需要考虑的参数有： `可承受的工作电流要大于电机的堵转电流，防止堵转时驱动芯片烧毁；导通电阻尽可能小，减少芯片的发热损耗`
>
> 以上四种芯片所能驱动的电流最大也就3A。对于一些堵转电流十几安的电机来说是远远不够的。此时，所能选择的集成H桥芯片也很少（英飞凌的BTN系列，价格较高，一般在30元以上）。因此常常采取电桥驱动+MOS管的方式自行搭建H桥



#### 编程示例5

- 驱动芯片介绍

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/d8dda285ecf74b155aba6f5e80fc615c.webp)

> DRV8833，芯片中共有两个全H桥。因此最多可以同时驱动两个直流电机或一个步进电机
>
> 电源供电电压 `2.7~10.8V`，每个H桥输出的均方根（RMS）电流为 `1.5A`，峰值可达 `2A`
>
> 内置过热保护和用户可调的限流保护电路

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/db457ef6deb28317c9cc6e6e0c928290.webp)

> nSLEEP --- 睡眠模式控制，高电平使能芯片，低电平进入睡眠模式(关闭芯片)
>
> BIN1 --- H桥B的逻辑输入1脚
>
> AOUT1 --- H桥A的输出1脚
>
> BIN2 --- H桥B的逻辑输入2脚
>
> AISEN --- H桥A的电流控制，可通过一个电阻接地限制电流(不限电流时直接接地）
>
> VCP --- 用于高端FET栅极驱动电压，需要一个10nF,耐压16V的陶瓷电容接到VM脚
>
> AOUT2 --- H桥A的输出2脚
>
> VM --- 电机电源供应2.7V-10.8V，需要一个10uF的滤波电容接地
>
> BOUT2 --- H桥B的输出2脚
>
> GND --- 器件接地脚
>
> BISEN --- H桥B的电流控制，可通过一个电阻接地限制电流(不限电流时直接接地）
>
> VINT --- 芯片内部稳压器的输出(3.3V)，需要一个2.2uF,耐压6.3V的滤波电容接地
>
> BOUT1 --- H桥B的输出1脚
>
> AIN2 --- H桥A的逻辑输入2脚
>
> nFAULT --- 当温度过高或通过电流过大时会输出低电平进行提示
>
> AIN1 --- H桥A的逻辑输入1脚

由于MOS管导通后会产生一定的饱和压降(Vsat，不同芯片有较大差异，具体看手册)，因此在选择驱动电压VM时，可以接近或比所用电机额定电压稍高。

芯片逻辑电压VINT的选择要根据所用单片机的逻辑电平决定。如果单片机是5V逻辑电平，则VINT同样选择5V输入

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/959554acd94791c44a65e6591407796f.webp)

> 当温度过高，温度检测保护模块会使nFAULT所接的FET导通拉到低电平,同时H桥转成衰减模式，不再给电机供电
>
> 如果不需要限流，则xISEN脚直接接地即可

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230625211453.webp)



### 步进电机

`工作原理`：步进电机是将电脉冲信号转变为角位移或线位移的 `开环` 控制元件。在非超载的情况下，电机的转速、停止的位置只取决于脉冲信号的频率和脉冲数，而不受负载变化的影响，当步进驱动器接收到一个脉冲信号，它就驱动步进电机按设定的方向转动一个固定的角度，称为 ``"步距角"``，它的旋转是以固定的角度一步一步运行的。可以通过控制脉冲个数来控制角位移量，从而达到准确定位的目的;同时可以通过控制脉冲频率来控制电机转动的速度和加速度，从而达到调速的目的。

`特征`：

1. 步进电机要加驱动才可以运转，驱动信号，没有脉冲的时候，步进电机静止，加入适当的脉冲信号，就会以角度（称为步角）转动。转动的速度和脉冲的频率成正比。
2. 步进电机具有瞬间启动和急速停止的特征。
3. 改变脉冲的顺序，可以方便改变转动的方向。

`驱动方法`：

步进电机不能直接接到工频交流或直流电源上工作，必须使用专用的步进电动机驱动器，它由脉冲发生控制单元，功率驱动单元，保护单元等组成。驱动单元与步进电动机直接耦合，也可以理解成步进电动机微机控制器的功率接口



> 单极性和双极性步进电机区别在于：
>
> 1. 单极性的电流只有一个方向，只能通过单向脉冲信号控制旋转方向，这意味着它只能顺时针或逆时针旋转--- `用ULN2003A驱动，比较简单`
> 2. 双极性的可以通过变换电流方向控制旋转方向，这使得它可以在两个方向上旋转--- `需要桥路驱动`

- 典型的步进电机分类

`两相式步进电机`：

1. 低速下扭矩比较大
2. 驱动方式多，控制比较简单
3. 很多变种：四相五线、六线步进电机、八线步进电机

`三相式步进电机`：

1. 体积大
2. 高速性能好
3. 步距角比较小，控制精度更高，运行更稳定
4. 驱动方式单一且复杂
5. 本质（无刷直流电机)



#### 单极性步进电机

{% note blue 'fas fa-fan' flat %}28BYJ-48{% endnote %}

参考：[太极创客](http://www.taichi-maker.com/homepage/reference-index/motor-reference-index/28byj-48-stepper-motor-intro/)



![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524124930.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524125111.webp)

28：步进电机的有效最大外径是28毫米
B：表示是步进电机
Y：表示是永磁式
J：表示是减速型（减速比1:64）
48：表示四相八拍

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524113110.webp)

> 步距角和减速比是两个比较重要的参数

从步进电机内部看，因为正对着的齿上的绕组是串联的，A、B、C、D四个绕组的一端都接到了5V，另一端通过按键接到GND，当某一个按键被按下了，如图中第二个按键被按下，则B和其对面的绕组都有电流流过，电生磁，所以中间转子的0和3端就被磁力吸住维持在一个平衡状态

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524113431.webp)

> - 步距角
>
> 意思是：每64个脉冲（节拍）步进电机就会转 `5.625` 度。旋转角度与脉冲之间的计算公式：`pulse=(angle/5.625) * 64`
>
> - 驱动方式：单四拍
>
> 四个绕组按B、C、D、A这样的顺序节拍（也可按其他顺序，这个不一定），轮流通电一次，可以让中间的转子转过一个绕组的角度，比如转子的0端本来是对着正上方的，就转到了左上方，这样，再来一个四节拍，转子就将再转过一个齿的角度，到了左边，所以 `8个四节拍` 以后转子就转完了 `一圈`，单节拍（这是指 `8 * 4` 个节拍）的步进角度（步进电机转动的角度）就可以算出来了： `360度/（4*8）= 360/32 = 11.25度`，所以每 `32` 个脉冲步进电机就会转 `11.25` 度
>
> - 驱动方式：双四拍
>
> 顺序： `AB-BC-CD-DA`，A和B两个绕组同时通电，步距角与单四拍的一样，为 `11.25°/32`
>
> - 驱动方式：八拍
>
> 而八拍就类似这样的节拍： `A-AB-B-BC-C-CD-D-DA`，因为有两个绕组同时导电的情况，对转子的吸力一样，这样就又会产生一个新的转动角度，所以转子就会比原来4个节拍的多了4个转动的角度，这样再转一圈，就要 `（4+4）* 8 = 64` 个节拍了，所以 `360度/64 = 5.625度`，这 `5.625` 度是步进电机转动的角度，也就是是下面讲到的输出轴的转动角度；
>
> 通俗理解： `64` 个节拍，转子转动 `一周`，步进电机转动 `5.625` 度，所以这种驱动方式下一个节拍步进电机转动的角度为： `5.625/64 = 0.087890625度`
>
> 这就是参数表步距角 `5.625°/64` 的由来。
>
> - 减速比
>
> 根据步进电机的内部拆解图，参考文章里介绍了中间的转子如果带动周边齿轮，最后带动输出轴转动，这部分不太好理解，我认为只需知道中间的齿轮是转子，也就是上面介绍步距角时的转子以及与最终的输出轴之间的关系就行了。
>
> 如果在八拍的转动方式下， `64` 个节拍转子就转动 `一圈`，根据减速比为 `1/64` ，意思就是说转子要转 `64` 圈，输出轴才转 `一圈`，所以 `64*64 = 4096个节拍` 输出轴就转 `一圈`，根据上面八拍的步距角可得， `64` 个节拍已经让输出轴转了 `5.625度` ，所以 `5.625 * 64 = 360度`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524114225.webp)

- 三种驱动方式的特点

单四拍：电流最小，扭矩最小

双四拍：电流最大，扭矩最大

八拍：电流居中，扭矩居中，常用

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524152714.webp)

- 接线图

> 四相五线接法
>
> 公共线红5接5V电源，是所有线圈的供电端，通过红5线将线圈分成了四个，所以是四相
>
> 电流只能从红5引脚流入，从某一个相的引脚流出
>
> 蓝1，粉红2，黄3，橙4接到驱动IC的输出端，驱动IC的输入端接到单片机引脚

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524152853.webp)

> 四相六线接法

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524153320.webp)

{% note blue 'fas fa-fan' flat %}编程示例1{% endnote %}

- 硬件连接

> 手上的步进电机接线，红色（电源线5V）、橙色（A相）、黄色（B相）、粉红色（C相）、蓝色（D相）
>
> `通过改变不同相通电的顺序，可以改变转动的方向`
>
> `通过改变脉冲数量，可以控制转动的角度`
>
> `通过改变脉冲的频率，可以改变转动的速度`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524111345.webp)

- 驱动IC-ULN2003A

ULN2003是高耐压、大电流达林顿陈列，由七个NPN 达林顿管组成。所有单元共用发射极，每个单元采用开集电极输出。每一对达林顿都串联一个2.7K 的基极电阻，直接兼容TTL 和5V CMOS 电路，可以直接处理原先需要标准逻辑缓冲器来处理的数据。 ULN2003 工作电压高，工作电流大，灌电流可达500mA

应用：1、继电器驱动 2、直流照明驱动 3、步进电机驱动 4、电磁阀 5、直流无刷电机驱动

左边为输入，右边为输出，中间是NPN达林顿管，当输入为1时，输出为0，输入为0时，输出为1

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524154025.webp)

- MX配置

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524155240.webp)

> 定时器溢出时间为5ms

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524162450.webp)



- 程序编写

{% folding, Myinit.c %}

```cpp
void vHardware_Init(void)
{
    HAL_TIM_Base_Start_IT(&htim7);	// 启动定时器7
}
```

{% endfolding %}

{% folding, Motor.h %}

```cpp
#ifndef __MOTOR_H
#define __MOTOR_H

#include "AllHead.h"

//宏定义
#define	SET_Motor_A	HAL_GPIO_WritePin(GPIOF,GPIO_PIN_1,GPIO_PIN_SET);
#define	CLR_Motor_A	HAL_GPIO_WritePin(GPIOF,GPIO_PIN_1,GPIO_PIN_RESET);

#define	SET_Motor_B	HAL_GPIO_WritePin(GPIOF,GPIO_PIN_2,GPIO_PIN_SET);
#define	CLR_Motor_B	HAL_GPIO_WritePin(GPIOF,GPIO_PIN_2,GPIO_PIN_RESET);

#define	SET_Motor_C	HAL_GPIO_WritePin(GPIOF,GPIO_PIN_3,GPIO_PIN_SET);
#define	CLR_Motor_C	HAL_GPIO_WritePin(GPIOF,GPIO_PIN_3,GPIO_PIN_RESET);

#define	SET_Motor_D	HAL_GPIO_WritePin(GPIOF,GPIO_PIN_4,GPIO_PIN_SET);
#define	CLR_Motor_D	HAL_GPIO_WritePin(GPIOF,GPIO_PIN_4,GPIO_PIN_RESET);

#define Circle_Set_Value (uint8_t)8 //转动的圈数

//定义枚举类型
//状态
typedef enum
{
	Start_State  	= (uint8_t)0,
	Stop_State  	= (uint8_t)1,
}Status_t;
//方向
typedef enum
{
	Forward_State = (uint8_t)0,
	Reverse_State = (uint8_t)1,
}Direction_t;
//速度等级
typedef enum
{
	Speed_1  = (uint8_t)100, //100*0.1ms 
	Speed_2  = (uint8_t)90,
	Speed_3  = (uint8_t)80,
	Speed_4  = (uint8_t)70,
	Speed_5  = (uint8_t)60,       //6ms
	Speed_6  = (uint8_t)50, //10KHz    50*0.1ms = 5ms
	Speed_7  = (uint8_t)40,
	Speed_8  = (uint8_t)30,
	Speed_9  = (uint8_t)20, //2ms
}Speed_t;
//加减速
typedef enum
{
	Speed_up    = (uint8_t)0, //加速
	Speed_down  = (uint8_t)1, //减速
}Speed_Change_t;

//驱动模式
typedef enum
{
	Drive_Mode_Single_4_Beats    = (uint8_t)0, //单四拍 - 步距角为5.625/32(型号28BYJ-48)，驱动力度最小
	Drive_Mode_Double_4_Beats    = (uint8_t)1, //双四拍 - 步距角为5.625/32(型号28BYJ-48)，驱动力度最大
	Drive_Mode_8_Beats           = (uint8_t)2, //八拍   - 步距角为5.625/64(型号28BYJ-48)，驱动力度居中
}Drive_Mode_t;


//定义结构体类型
typedef struct
{
  uint8_t Status;    //步进电机状态
	uint8_t Direction; //步进电机方向
	uint8_t Speed;     //步进电机速度
	uint8_t Circle;    //步进电机转动圈数
	Drive_Mode_t Drive_Mode;   //步进电机驱动模式
	uint16_t Pulse_Cnt;        //步进电机脉冲计数
	uint16_t One_Circle_Pulse; //步进电机转动一圈的脉冲数(要跟模式匹配，4或者双4拍则填2048)
	
	void (*Direction_Adjust)(void);        //步进电机方向调整
	void (*Speed_Adjust)(Speed_Change_t);  //步进电机速度调整
	void (*Step_One_Pulse)(void);          //步进电机步进一个脉冲
} Unipolar_Step_Motor_t;

extern Unipolar_Step_Motor_t  Unipolar_Step_Motor;

#endif
```

{% endfolding %}

{% folding, Motor.c %}

```cpp
#include "AllHead.h"

/* Private function prototypes------------------------------------------------*/      
static void Direction_Adjust(void);        //步进电机方向调整
static void Speed_Adjust(Speed_Change_t);  //步进电机速度调整
static void Step_One_Pulse(void);          //步进电机步进一个脉冲

/* Public variables-----------------------------------------------------------*/

//定义结构体类变量
Unipolar_Step_Motor_t Unipolar_Step_Motor = 
{
	Stop_State,
	Forward_State, 
	Speed_6,
	0,
	Drive_Mode_8_Beats,
	0,
	(uint16_t)4096,
	
	Direction_Adjust,
	Speed_Adjust,
	Step_One_Pulse
};

/*
	* @name   Direction_Adjust
	* @brief  直流电机方向调整
	* @param  None
	* @retval None      
*/
static void Direction_Adjust(void)
{
	if(Unipolar_Step_Motor.Status == Start_State)
	{
		//调整电机运行方向
		if(Unipolar_Step_Motor.Direction == Reverse_State)
		{
			Unipolar_Step_Motor.Direction = Forward_State;
		}
		else
		{
			Unipolar_Step_Motor.Direction = Reverse_State;
		}
		
		Unipolar_Step_Motor.Circle = Circle_Set_Value;
		Unipolar_Step_Motor.Pulse_Cnt = 0;
	}
}

/*
	* @name   Speed_Adjust
	* @brief  直流电机速度调整
	* @param  Speed_Change -> 速度变化
	* @retval None      
*/
static void Speed_Adjust(Speed_Change_t Speed_Change)
{
	if(Unipolar_Step_Motor.Status == Start_State)
	{
		if(Speed_Change == Speed_up)
		{
			//增大电机速度
			switch(Unipolar_Step_Motor.Speed)
			{
				case Speed_1: Unipolar_Step_Motor.Speed = Speed_2; break;
				case Speed_2: Unipolar_Step_Motor.Speed = Speed_3; break;
				case Speed_3: Unipolar_Step_Motor.Speed = Speed_4; break;
				case Speed_4: Unipolar_Step_Motor.Speed = Speed_5; break;
				case Speed_5: Unipolar_Step_Motor.Speed = Speed_6; break;
				case Speed_6: Unipolar_Step_Motor.Speed = Speed_7; break;
				case Speed_7: Unipolar_Step_Motor.Speed = Speed_8; break;
				case Speed_8: Unipolar_Step_Motor.Speed = Speed_9; break;
				case Speed_9: Unipolar_Step_Motor.Speed = Speed_9; break;
				default:Unipolar_Step_Motor.Speed = Speed_6; 
			}
		}
		else
		{
			//减小电机速度
			switch(Unipolar_Step_Motor.Speed)
			{
				case Speed_1: Unipolar_Step_Motor.Speed = Speed_1; break;
				case Speed_2: Unipolar_Step_Motor.Speed = Speed_1; break;
				case Speed_3: Unipolar_Step_Motor.Speed = Speed_2; break;
				case Speed_4: Unipolar_Step_Motor.Speed = Speed_3; break;
				case Speed_5: Unipolar_Step_Motor.Speed = Speed_4; break;
				case Speed_6: Unipolar_Step_Motor.Speed = Speed_5; break;
				case Speed_7: Unipolar_Step_Motor.Speed = Speed_6; break;
				case Speed_8: Unipolar_Step_Motor.Speed = Speed_7; break;
				case Speed_9: Unipolar_Step_Motor.Speed = Speed_8; break;
				default:Unipolar_Step_Motor.Speed = Speed_6;
			}
		}
		
		//更新定时器7的计时重装载寄存器
		TIM7 ->ARR = Unipolar_Step_Motor.Speed;
	}
}

/*
	* @name   Step_One_Pulse
	* @brief  步进电机步进一个脉冲
	* @param  Speed_Change -> 速度变化
	* @retval None      
*/
static void Step_One_Pulse(void)
{
	static uint8_t Position = 0;
	
	//单四拍
	if(Unipolar_Step_Motor.Drive_Mode == Drive_Mode_Single_4_Beats)
	{
		if(Unipolar_Step_Motor.Direction == Forward_State)
		{
			//正向步进  A - D - C - B
			switch(Position)
			{
				case 0: SET_Motor_A; CLR_Motor_B; CLR_Motor_C; CLR_Motor_D; break;
				case 1: CLR_Motor_A; CLR_Motor_B; CLR_Motor_C; SET_Motor_D; break;
				case 2: CLR_Motor_A; CLR_Motor_B; SET_Motor_C; CLR_Motor_D; break;
				case 3: CLR_Motor_A; SET_Motor_B; CLR_Motor_C; CLR_Motor_D; break;
				default: System.Error_Handler();
			}
		}
		else
		{
			//反向步进  A - B - C - D
			switch(Position)
			{
				case 0: SET_Motor_A; CLR_Motor_B; CLR_Motor_C; CLR_Motor_D; break;
				case 1: CLR_Motor_A; SET_Motor_B; CLR_Motor_C; CLR_Motor_D; break;
				case 2: CLR_Motor_A; CLR_Motor_B; SET_Motor_C; CLR_Motor_D; break;
				case 3: CLR_Motor_A; CLR_Motor_B; CLR_Motor_C; SET_Motor_D; break;
				default: System.Error_Handler();
			}
		}
		
		//更新位置信息
		if((++Position) == 4)
				Position = 0;
	}
	
	//双四拍
	if(Unipolar_Step_Motor.Drive_Mode == Drive_Mode_Double_4_Beats)
	{
		if(Unipolar_Step_Motor.Direction == Forward_State)
		{
			//正向步进  DA - CD - BC - AB
			switch(Position)
			{
				case 0: SET_Motor_A; CLR_Motor_B; CLR_Motor_C; SET_Motor_D; break;
				case 1: CLR_Motor_A; CLR_Motor_B; SET_Motor_C; SET_Motor_D; break;
				case 2: CLR_Motor_A; SET_Motor_B; SET_Motor_C; CLR_Motor_D; break;
				case 3: SET_Motor_A; SET_Motor_B; CLR_Motor_C; CLR_Motor_D; break;
				default: System.Error_Handler();
			}
		}
		else
		{
			//反向步进  DA - AB - BC - CD
			switch(Position)
			{
				case 0: SET_Motor_A; CLR_Motor_B; CLR_Motor_C; SET_Motor_D; break;
				case 1: SET_Motor_A; SET_Motor_B; CLR_Motor_C; CLR_Motor_D; break;
				case 2: CLR_Motor_A; SET_Motor_B; SET_Motor_C; CLR_Motor_D; break;
				case 3: CLR_Motor_A; CLR_Motor_B; SET_Motor_C; SET_Motor_D; break;
				default: System.Error_Handler();
			}
		}
		
		//更新位置信息
		if((++Position) == 4)
				Position = 0;
	}
	
	//单八拍
	if(Unipolar_Step_Motor.Drive_Mode == Drive_Mode_8_Beats)
	{
		if(Unipolar_Step_Motor.Direction == Forward_State)
		{
			//正向步进 A - DA - D - CD - C - BC - B - AB
			switch(Position)
			{
				case 0: SET_Motor_A; CLR_Motor_B; CLR_Motor_C; CLR_Motor_D; break;
				case 1: SET_Motor_A; CLR_Motor_B; CLR_Motor_C; SET_Motor_D; break;
				case 2: CLR_Motor_A; CLR_Motor_B; CLR_Motor_C; SET_Motor_D; break;
				case 3: CLR_Motor_A; CLR_Motor_B; SET_Motor_C; SET_Motor_D; break;
				case 4: CLR_Motor_A; CLR_Motor_B; SET_Motor_C; CLR_Motor_D; break;
				case 5: CLR_Motor_A; SET_Motor_B; SET_Motor_C; CLR_Motor_D; break;
				case 6: CLR_Motor_A; SET_Motor_B; CLR_Motor_C; CLR_Motor_D; break;
				case 7: SET_Motor_A; SET_Motor_B; CLR_Motor_C; CLR_Motor_D; break;
				default:System.Error_Handler();
			}
		}
		else
		{
			//反向步进 A - AB - B - BC - C -CD - D - DA 
			switch(Position)
			{
				case 0: SET_Motor_A; CLR_Motor_B; CLR_Motor_C; CLR_Motor_D; break;
				case 1: SET_Motor_A; SET_Motor_B; CLR_Motor_C; CLR_Motor_D; break; 
				case 2: CLR_Motor_A; SET_Motor_B; CLR_Motor_C; CLR_Motor_D; break;
				case 3: CLR_Motor_A; SET_Motor_B; SET_Motor_C; CLR_Motor_D; break;
				case 4: CLR_Motor_A; CLR_Motor_B; SET_Motor_C; CLR_Motor_D; break; 
				case 5: CLR_Motor_A; CLR_Motor_B; SET_Motor_C; SET_Motor_D; break;
				case 6: CLR_Motor_A; CLR_Motor_B; CLR_Motor_C; SET_Motor_D; break;
				case 7: SET_Motor_A; CLR_Motor_B; CLR_Motor_C; SET_Motor_D; break;
				default: System.Error_Handler();
			}
		}
		
		//更新位置信息
		if((++Position) == 8)
				Position = 0;
	}
}

void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim)
{
    //控制步进电机
    if(htim->Instance == htim7.Instance)
    {
        //没转完指定的圈数
        if(Unipolar_Step_Motor.Circle > 0)
        {
            //电机转动一个脉冲
            Unipolar_Step_Motor.Step_One_Pulse();

            //根据脉冲计数判断是否转动了一圈
            if(++Unipolar_Step_Motor.Pulse_Cnt == Unipolar_Step_Motor.One_Circle_Pulse)
            {
                Unipolar_Step_Motor.Pulse_Cnt = 0;
                //转动圈数减一
                Unipolar_Step_Motor.Circle--;
            }
        }
        //已转完指定的圈数
        else
        {
            Unipolar_Step_Motor.Status = Stop_State;
            CLR_Motor_A;
            CLR_Motor_B;
            CLR_Motor_C;
            CLR_Motor_D;
        }
    }
}
```

{% endfolding %}

{% folding, main.c %}

```cpp
void HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin)
{
  //如果按键1被按下
  if(GPIO_Pin == KEY1_Pin)
  {
    LED.LED_Fun(LED1,LED_Flip);
    Uniplar_Step_Motor.Start_Or_Stop();   //控制步进电机启动或停止
  }

  //如果按键2被按下
  if(GPIO_Pin == KEY2_Pin)
  {
    LED.LED_Fun(LED2,LED_Flip);
    Uniplar_Step_Motor.Direction_Adjust();  //控制步进电机正反转
  }

  //如果按键3被按下
  if(GPIO_Pin == KEY3_Pin)
  {
    LED.LED_Fun(LED3,LED_Flip);
    Uniplar_Step_Motor.Speed_Adjust(Speed_up);    //加速
  }

  //如果按键4被按下
  if(GPIO_Pin == KEY4_Pin)
  {
    LED.LED_Fun(LED3,LED_Flip);
    Uniplar_Step_Motor.Speed_Adjust(Speed_down);   //减速
  }
}
```

{% endfolding %}

{% note blue 'fas fa-fan' flat %}实验现象{% endnote %}

1、在八拍的情况下，脉冲数为4096，则步进电机刚好转一圈

2、在单四拍的情况下，脉冲数为2048，则步进电机刚好转一圈，如果脉冲数为4096，则电机转两圈

3、在双四拍的情况下，脉冲数为2048，则步进电机刚好转一圈，如果脉冲数为4096，则电机转两圈

因为八拍让转子转一圈的脉冲数是64，单四拍或双四拍让转子转一圈的脉冲数都是32，是八拍的一半，在减速比都是64的情况下，让步进电机转一圈，则

八拍：`64 * 64 = 4096`

单四拍或双四拍： `32 * 64 = 2048`

所以当选择单四拍或双四拍的情况下，如果脉冲数仍然是4096，则步进电机就转两圈



#### 双极性步进电机



![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524170615.webp)

> 通过线圈的电流有两个方向
>
> 电流方向：
>
> `A+ 流向 A- 或者 A- 流向 A+`
>
> `B+ 流向 B- 或者 B- 流向 B+`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524170753.webp)

- 驱动方式

和单极性步进电机一样，有三种驱动方式：单四拍、双四拍、八拍

 `A+表示电流从A+流向A-，A-表示电流从A-流向A+`

 `该电机没有减速比`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524171110.webp)

> 单4拍和双四拍转一圈的话则需要 `360/7.5=48`，则需要48个脉冲
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524183254.webp)
>
> 八拍转一圈的话则需要 `360/3.75=96`，则需要96个脉冲



- 硬件连接

> 程序里A1表示A+,A2表示A-，B1表示B+，B2表示B-

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524170438.webp)

- MX配置

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524173252.webp)

> 定时器溢出时间为5ms

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524162450.webp)

- 程序编写

{% folding, Myinit.c %}

```cpp
void vHardware_Init(void)
{
    HAL_TIM_Base_Start_IT(&htim7);	// 启动定时器7
}
```

{% endfolding %}

{% folding, Motor.h %}

```cpp
#ifndef __MOTOR_H
#define __MOTOR_H

#include "AllHead.h"

//宏定义
#define	SET_Motor_A1	HAL_GPIO_WritePin(GPIOF,GPIO_PIN_5,GPIO_PIN_SET);
#define	CLR_Motor_A1	HAL_GPIO_WritePin(GPIOF,GPIO_PIN_5,GPIO_PIN_RESET);
#define	SET_Motor_A2	HAL_GPIO_WritePin(GPIOF,GPIO_PIN_6,GPIO_PIN_SET);
#define	CLR_Motor_A2	HAL_GPIO_WritePin(GPIOF,GPIO_PIN_6,GPIO_PIN_RESET);

#define	SET_Motor_B1	HAL_GPIO_WritePin(GPIOF,GPIO_PIN_7,GPIO_PIN_SET);
#define	CLR_Motor_B1	HAL_GPIO_WritePin(GPIOF,GPIO_PIN_7,GPIO_PIN_RESET);
#define	SET_Motor_B2	HAL_GPIO_WritePin(GPIOF,GPIO_PIN_8,GPIO_PIN_SET);
#define	CLR_Motor_B2	HAL_GPIO_WritePin(GPIOF,GPIO_PIN_8,GPIO_PIN_RESET);

#define Circle_Set_Value (uint8_t)25 //转动的圈数

//定义枚举类型
//状态
typedef enum
{
	Start_State  	= (uint8_t)0,
	Stop_State  	= (uint8_t)1,
}Status_t;
//方向
typedef enum
{
	Forward_State = (uint8_t)0,
	Reverse_State = (uint8_t)1,
}Direction_t;
//速度等级
typedef enum
{
	Speed_1  = (uint8_t)100, //100*0.1ms 
	Speed_2  = (uint8_t)90,
	Speed_3  = (uint8_t)80,
	Speed_4  = (uint8_t)70,
	Speed_5  = (uint8_t)60,       //6ms
	Speed_6  = (uint8_t)50, //10KHz    50*0.1ms = 5ms
	Speed_7  = (uint8_t)40,
	Speed_8  = (uint8_t)30,
	Speed_9  = (uint8_t)20, //2ms
}Speed_t;
//加减速
typedef enum
{
	Speed_up    = (uint8_t)0, //加速
	Speed_down  = (uint8_t)1, //减速
}Speed_Change_t;

//驱动模式
typedef enum
{
	Drive_Mode_Single_4_Beats    = (uint8_t)0, //单四拍 - 步距角为7.5°，驱动力度最小
	Drive_Mode_Double_4_Beats    = (uint8_t)1, //双四拍 - 步距角为7.5°，驱动力度最大
	Drive_Mode_8_Beats           = (uint8_t)2, //八拍   - 步距角为3.75°，驱动力度居中
}Drive_Mode_t;


//定义结构体类型
typedef struct
{
  uint8_t Status;    //步进电机状态
	uint8_t Direction; //步进电机方向
	uint8_t Speed;     //步进电机速度
	uint8_t Circle;    //步进电机转动圈数
	Drive_Mode_t Drive_Mode;   //步进电机驱动模式
	uint8_t Pulse_Cnt;        //步进电机脉冲计数
	uint8_t One_Circle_Pulse; //步进电机转动一圈的脉冲数(要跟模式匹配，4或者双4拍则填48,8拍填96)
	
	void (*Direction_Adjust)(void);        //步进电机方向调整
	void (*Speed_Adjust)(Speed_Change_t);  //步进电机速度调整
	void (*Step_One_Pulse)(void);          //步进电机步进一个脉冲
} Bipolar_Step_Motor_t;

extern Bipolar_Step_Motor_t  Bipolar_Step_Motor;

#endif
```

{% endfolding %}

{% folding, Motor.c %}

```cpp
#include "AllHead.h"

/* Private function prototypes------------------------------------------------*/      
static void Direction_Adjust(void);        //步进电机方向调整
static void Speed_Adjust(Speed_Change_t);  //步进电机速度调整
static void Step_One_Pulse(void);          //步进电机步进一个脉冲

/* Public variables-----------------------------------------------------------*/

//定义结构体类变量
Bipolar_Step_Motor_t Bipolar_Step_Motor = 
{
	Stop_State,
	Forward_State, 
	Speed_6,
	0,
	Drive_Mode_Double_4_Beats,
	0,
	(uint8_t)48,
	
	Direction_Adjust,
	Speed_Adjust,
	Step_One_Pulse
};

/*
	* @name   Direction_Adjust
	* @brief  直流电机方向调整
	* @param  None
	* @retval None      
*/
static void Direction_Adjust(void)
{
	if(Bipolar_Step_Motor.Status == Start_State)
	{
		//调整电机运行方向
		if(Bipolar_Step_Motor.Direction == Reverse_State)
		{
			Bipolar_Step_Motor.Direction = Forward_State;
		}
		else
		{
			Bipolar_Step_Motor.Direction = Reverse_State;
		}
		
		Bipolar_Step_Motor.Circle = Circle_Set_Value;
		Bipolar_Step_Motor.Pulse_Cnt = 0;
	}
}

/*
	* @name   Speed_Adjust
	* @brief  直流电机速度调整
	* @param  Speed_Change -> 速度变化
	* @retval None      
*/
static void Speed_Adjust(Speed_Change_t Speed_Change)
{
	if(Bipolar_Step_Motor.Status == Start_State)
	{
		if(Speed_Change == Speed_up)
		{
			//增大电机速度
			switch(Bipolar_Step_Motor.Speed)
			{
				case Speed_1: Bipolar_Step_Motor.Speed = Speed_2; break;
				case Speed_2: Bipolar_Step_Motor.Speed = Speed_3; break;
				case Speed_3: Bipolar_Step_Motor.Speed = Speed_4; break;
				case Speed_4: Bipolar_Step_Motor.Speed = Speed_5; break;
				case Speed_5: Bipolar_Step_Motor.Speed = Speed_6; break;
				case Speed_6: Bipolar_Step_Motor.Speed = Speed_7; break;
				case Speed_7: Bipolar_Step_Motor.Speed = Speed_8; break;
				case Speed_8: Bipolar_Step_Motor.Speed = Speed_9; break;
				case Speed_9: Bipolar_Step_Motor.Speed = Speed_9; break;
				default:Bipolar_Step_Motor.Speed = Speed_6; 
			}
		}
		else
		{
			//减小电机速度
			switch(Bipolar_Step_Motor.Speed)
			{
				case Speed_1: Bipolar_Step_Motor.Speed = Speed_1; break;
				case Speed_2: Bipolar_Step_Motor.Speed = Speed_1; break;
				case Speed_3: Bipolar_Step_Motor.Speed = Speed_2; break;
				case Speed_4: Bipolar_Step_Motor.Speed = Speed_3; break;
				case Speed_5: Bipolar_Step_Motor.Speed = Speed_4; break;
				case Speed_6: Bipolar_Step_Motor.Speed = Speed_5; break;
				case Speed_7: Bipolar_Step_Motor.Speed = Speed_6; break;
				case Speed_8: Bipolar_Step_Motor.Speed = Speed_7; break;
				case Speed_9: Bipolar_Step_Motor.Speed = Speed_8; break;
				default:Bipolar_Step_Motor.Speed = Speed_6;
			}
		}
		
		//更新定时器7的计时重装载寄存器
		TIM7 ->ARR = Bipolar_Step_Motor.Speed;
	}
}

/*
	* @name   Step_One_Pulse
	* @brief  步进电机步进一个脉冲
	* @param  Speed_Change -> 速度变化
	* @retval None      
*/
static void Step_One_Pulse(void)
{
	static uint8_t Position = 0;
	
	//单四拍
	if(Bipolar_Step_Motor.Drive_Mode == Drive_Mode_Single_4_Beats)
	{
		if(Bipolar_Step_Motor.Direction == Forward_State)
		{
			//正向步进  A1 - B2 - A2 - B1
			switch(Position)
			{
				case 0: SET_Motor_A1; CLR_Motor_B1; CLR_Motor_A2; CLR_Motor_B2; break;
				case 1: CLR_Motor_A1; CLR_Motor_B1; CLR_Motor_A2; SET_Motor_B2; break;
				case 2: CLR_Motor_A1; CLR_Motor_B1; SET_Motor_A2; CLR_Motor_B2; break;
				case 3: CLR_Motor_A1; SET_Motor_B1; CLR_Motor_A2; CLR_Motor_B2; break;
				default: System.Error_Handler();
			}
		}
		else
		{
			//反向步进  A1 - B1 - A2 - B2
			switch(Position)
			{
				case 0: SET_Motor_A1; CLR_Motor_B1; CLR_Motor_A2; CLR_Motor_B2; break;
				case 1: CLR_Motor_A1; SET_Motor_B1; CLR_Motor_A2; CLR_Motor_B2; break;
				case 2: CLR_Motor_A1; CLR_Motor_B1; SET_Motor_A2; CLR_Motor_B2; break;
				case 3: CLR_Motor_A1; CLR_Motor_B1; CLR_Motor_A2; SET_Motor_B2; break;
				default: System.Error_Handler();
			}
		}
		
		//更新位置信息
		if((++Position) == 4)
				Position = 0;
	}
	
	//双四拍
	if(Bipolar_Step_Motor.Drive_Mode == Drive_Mode_Double_4_Beats)
	{
		if(Bipolar_Step_Motor.Direction == Forward_State)
		{
			//正向步进  A1B2 - B2A2 - A2B1 - B1A1
			switch(Position)
			{
				case 0: SET_Motor_A1; CLR_Motor_B1; CLR_Motor_A2; SET_Motor_B2; break;
				case 1: CLR_Motor_A1; CLR_Motor_B1; SET_Motor_A2; SET_Motor_B2; break;
				case 2: CLR_Motor_A1; SET_Motor_B1; SET_Motor_A2; CLR_Motor_B2; break;
				case 3: SET_Motor_A1; SET_Motor_B1; CLR_Motor_A2; CLR_Motor_B2; break;
				default: System.Error_Handler();
			}
		}
		else
		{
			//反向步进  A1B1 - B1A2 - A2B2 - B2A1
			switch(Position)
			{
				case 0: SET_Motor_A1; SET_Motor_B1; CLR_Motor_A2; CLR_Motor_B2; break;
				case 1: CLR_Motor_A1; SET_Motor_B1; SET_Motor_A2; CLR_Motor_B2; break;
				case 2: CLR_Motor_A1; CLR_Motor_B1; SET_Motor_A2; SET_Motor_B2; break;
				case 3: SET_Motor_A1; CLR_Motor_B1; CLR_Motor_A2; SET_Motor_B2; break;
				default: System.Error_Handler();
			}
		}
		
		//更新位置信息
		if((++Position) == 4)
				Position = 0;
	}
	
	//单八拍
	if(Bipolar_Step_Motor.Drive_Mode == Drive_Mode_8_Beats)
	{
		if(Bipolar_Step_Motor.Direction == Forward_State)
		{
			//正向步进 A1 - A1B2 - B2 - B2A2 - A2 - A2B1 - B1 - B1A1
			switch(Position)
			{
				case 0: SET_Motor_A1; CLR_Motor_B1; CLR_Motor_A2; CLR_Motor_B2; break;
				case 1: SET_Motor_A1; CLR_Motor_B1; CLR_Motor_A2; SET_Motor_B2; break;
				case 2: CLR_Motor_A1; CLR_Motor_B1; CLR_Motor_A2; SET_Motor_B2; break;
				case 3: CLR_Motor_A1; CLR_Motor_B1; SET_Motor_A2; SET_Motor_B2; break;
				case 4: CLR_Motor_A1; CLR_Motor_B1; SET_Motor_A2; CLR_Motor_B2; break;
				case 5: CLR_Motor_A1; SET_Motor_B1; SET_Motor_A2; CLR_Motor_B2; break;
				case 6: CLR_Motor_A1; SET_Motor_B1; CLR_Motor_A2; CLR_Motor_B2; break;
				case 7: SET_Motor_A1; SET_Motor_B1; CLR_Motor_A2; CLR_Motor_B2; break;
				default:System.Error_Handler();
			}
		}
		else
		{
			//反向步进 A1 - A1B1 - B1 - B1A2 - A2 - A2B2 - B2 - B2A1
			switch(Position)
			{
				case 0: SET_Motor_A1; CLR_Motor_B1; CLR_Motor_A2; CLR_Motor_B2; break;
				case 1: SET_Motor_A1; SET_Motor_B1; CLR_Motor_A2; CLR_Motor_B2; break; 
				case 2: CLR_Motor_A1; SET_Motor_B1; CLR_Motor_A2; CLR_Motor_B2; break;
				case 3: CLR_Motor_A1; SET_Motor_B1; SET_Motor_A2; CLR_Motor_B2; break;
				case 4: CLR_Motor_A1; CLR_Motor_B1; SET_Motor_A2; CLR_Motor_B2; break; 
				case 5: CLR_Motor_A1; CLR_Motor_B1; SET_Motor_A2; SET_Motor_B2; break;
				case 6: CLR_Motor_A1; CLR_Motor_B1; CLR_Motor_A2; SET_Motor_B2; break;
				case 7: SET_Motor_A1; CLR_Motor_B1; CLR_Motor_A2; SET_Motor_B2; break;
				default: System.Error_Handler();
			}
		}
		
		//更新位置信息
		if((++Position) == 8)
				Position = 0;
	}
}

void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim)
{
    //控制步进电机
    if(htim->Instance == htim7.Instance)
    {
        //没转完指定的圈数
        if(Bipolar_Step_Motor.Circle > 0)
        {
            //电机转动一个脉冲
            Bipolar_Step_Motor.Step_One_Pulse();

            //根据脉冲计数判断是否转动了一圈
            if(++Bipolar_Step_Motor.Pulse_Cnt == Bipolar_Step_Motor.One_Circle_Pulse)
            {
                Bipolar_Step_Motor.Pulse_Cnt = 0;
                //转动圈数减一
                Bipolar_Step_Motor.Circle--;
            }
        }
        //已转完指定的圈数
        else
        {
            Bipolar_Step_Motor.Status = Stop_State;
            CLR_Motor_A1;
            CLR_Motor_A2;
            CLR_Motor_B1;
            CLR_Motor_B2;
        }
    }
}
```

{% endfolding %}



### 无刷电机

#### 介绍

无刷直流电机由电动机主体和驱动器组成，是一种典型的机电━体化产品。

结构上，无刷电机和有刷电机有相似之处，也有转子和定子，只不过和有刷电机的结构相反;有刷电机的转子是线圈绕组，和动力输出轴相连，定子是永磁磁钢;无刷电机的转子是永磁磁钢，连同外壳一起和输出轴相连，定子是绕组线圈，去掉了有刷电机用来交替变换电磁场的换向电刷，故称之为无刷电机。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524191147.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524191156.webp)

- 优点

① 无电刷、低干扰

② 噪音低，运转顺畅

③ 寿命长，低维护成本

- 缺点

① 价格贵

② 驱动复杂

- 驱动

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524191415.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524191424.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230524191439.webp)





## 附1-上位机使用

### MiniBalance上位机

直接把 `DataScope_DP.h` 和 `DataScope_DP.c` 加入工程即可，然后调用串口1进行发送数据，间隔50ms即可

{% folding, DataScope_DP.h %}

```cpp
#ifndef __DATA_PRTOCOL_H
#define __DATA_PRTOCOL_H

extern unsigned char DataScope_OutPut_Buffer[42]; // 待发送帧数据缓存区

void DataScope_Get_Channel_Data(float Data, unsigned char Channel); // 写通道数据至 待发送帧数据缓存区

unsigned char DataScope_Data_Generate(unsigned char Channel_Number); // 发送帧数据生成函数

#endif
```

{% endfolding %}

{% folding, DataScope_DP.c %}

```cpp
#include "DataScope_DP.h"
unsigned char DataScope_OutPut_Buffer[42] = {0}; // 串口发送缓冲区

// 函数说明：将单精度浮点数据转成4字节数据并存入指定地址
// 附加说明：用户无需直接操作此函数
// target:目标单精度数据
// buf:待写入数组
// beg:指定从数组第几个元素开始写入
// 函数无返回
void Float2Byte(float *target, unsigned char *buf, unsigned char beg)
{
	unsigned char *point;
	point = (unsigned char *)target; // 得到float的地址
	buf[beg] = point[0];
	buf[beg + 1] = point[1];
	buf[beg + 2] = point[2];
	buf[beg + 3] = point[3];
}

// 函数说明：将待发送通道的单精度浮点数据写入发送缓冲区
// Data：通道数据
// Channel：选择通道（1-10）
// 函数无返回
void DataScope_Get_Channel_Data(float Data, unsigned char Channel)
{
	if ((Channel > 10) || (Channel == 0))
		return; // 通道个数大于10或等于0，直接跳出，不执行函数
	else
	{
		switch (Channel)
		{
		case 1:
			Float2Byte(&Data, DataScope_OutPut_Buffer, 1);
			break;
		case 2:
			Float2Byte(&Data, DataScope_OutPut_Buffer, 5);
			break;
		case 3:
			Float2Byte(&Data, DataScope_OutPut_Buffer, 9);
			break;
		case 4:
			Float2Byte(&Data, DataScope_OutPut_Buffer, 13);
			break;
		case 5:
			Float2Byte(&Data, DataScope_OutPut_Buffer, 17);
			break;
		case 6:
			Float2Byte(&Data, DataScope_OutPut_Buffer, 21);
			break;
		case 7:
			Float2Byte(&Data, DataScope_OutPut_Buffer, 25);
			break;
		case 8:
			Float2Byte(&Data, DataScope_OutPut_Buffer, 29);
			break;
		case 9:
			Float2Byte(&Data, DataScope_OutPut_Buffer, 33);
			break;
		case 10:
			Float2Byte(&Data, DataScope_OutPut_Buffer, 37);
			break;
		}
	}
}

// 函数说明：生成 DataScopeV1.0 能正确识别的帧格式
// Channel_Number，需要发送的通道个数
// 返回发送缓冲区数据个数
// 返回0表示帧格式生成失败
unsigned char DataScope_Data_Generate(unsigned char Channel_Number)
{
	if ((Channel_Number > 10) || (Channel_Number == 0))
	{
		return 0;
	} // 通道个数大于10或等于0，直接跳出，不执行函数
	else
	{
		DataScope_OutPut_Buffer[0] = '$'; // 帧头

		switch (Channel_Number)
		{
		case 1:
			DataScope_OutPut_Buffer[5] = 5;
			return 6;
		case 2:
			DataScope_OutPut_Buffer[9] = 9;
			return 10;
		case 3:
			DataScope_OutPut_Buffer[13] = 13;
			return 14;
		case 4:
			DataScope_OutPut_Buffer[17] = 17;
			return 18;
		case 5:
			DataScope_OutPut_Buffer[21] = 21;
			return 22;
		case 6:
			DataScope_OutPut_Buffer[25] = 25;
			return 26;
		case 7:
			DataScope_OutPut_Buffer[29] = 29;
			return 30;
		case 8:
			DataScope_OutPut_Buffer[33] = 33;
			return 34;
		case 9:
			DataScope_OutPut_Buffer[37] = 37;
			return 38;
		case 10:
			DataScope_OutPut_Buffer[41] = 41;
			return 42;
		}
	}
	return 0;
}
```

{% endfolding %}

> 测试代码

```cpp
/*
* @function: Motor_Fre_And_Duty_compute
* @param: None
* @retval: None
* @brief: 实际电机频率占空比计算
*/
static inline void Motor_Fre_And_Duty_compute(void)
{
    uint8_t Send_Count; //串口需要发送的数据个数
    uint16_t Timer4_fre = 0;
    float T4_CH1_Duty = 0, T4_CH2_Duty = 0, T4_CH3_Duty = 0, T4_CH4_Duty = 0;

    Timer4_fre = 72000000 / (TIM4->PSC + 1) / (TIM4->ARR + 1);  // 计算频率
    Motor.usMotor_Fre = Timer4_fre;
    T4_CH1_Duty = ((float)TIM4->CCR1 / TIM4->ARR) * 100;    // 计算占空比
    T4_CH2_Duty = ((float)TIM4->CCR2 / TIM4->ARR) * 100;
    T4_CH3_Duty = ((float)TIM4->CCR3 / TIM4->ARR) * 100;
    T4_CH4_Duty = ((float)TIM4->CCR4 / TIM4->ARR) * 100;
    // 发送到上位机
    DataScope_Get_Channel_Data(T4_CH1_Duty, 1); // 上位机通道1
    DataScope_Get_Channel_Data(T4_CH2_Duty, 2); // 上位机通道2
    DataScope_Get_Channel_Data(T4_CH3_Duty, 3); // 上位机通道3
    DataScope_Get_Channel_Data(T4_CH4_Duty, 4); // 上位机通道4
    Send_Count = DataScope_Data_Generate(4);
    HAL_UART_Transmit(&huart1, DataScope_OutPut_Buffer, Send_Count, 300);   // 调用库函数发送
}
```

> 纵轴显示模式--自动里程(递增)；横轴显示模式--自动点距(缩进)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230704152829.webp)



### 匿名上位机

我使用的版本为 `V7.2.2.8版本`

> 曲线显示速度波形方便观察数据

> 先看通信协议

匿名上位机DATA 数据内容中的数据，采用 `小端模式`，低字节在前，高字节在后。 什么意思呢，这里的小端模式跟上文介绍的单片机的大小端模式无关，不是指同一个东西，这里的小端模式理解为我们向上位机发送数据的时候要先发送数据的低字节，再发送数据的高字节，因此我们在把DATA区的数据放到数组data_to_send里是要先放低字节，拿上文中的数据1000为例要先放1110 1000 再放 0000 0011， `即对于小端模式的单片机先调用BYTE0(1000) ，再调用BYTE1(1000)，而对于大端模式的单片机先调用BYTE1(1000)，再调用BYTE0(1000)`。因此对于本例传递4个int16类型的数据区代码如下：

【大端模式】

```cpp
data_to_send[_cnt++] = BYTE1(_a);
data_to_send[_cnt++] = BYTE0(_a);

data_to_send[_cnt++] = BYTE1(_b);
data_to_send[_cnt++] = BYTE0(_b);

data_to_send[_cnt++] = BYTE1(_c);
data_to_send[_cnt++] = BYTE0(_c);

data_to_send[_cnt++] = BYTE1(_d);
data_to_send[_cnt++] = BYTE0(_d);
```

【小端模式】

```cpp
data_to_send[_cnt++] = BYTE0(_a);
data_to_send[_cnt++] = BYTE1(_a);

data_to_send[_cnt++] = BYTE0(_b);
data_to_send[_cnt++] = BYTE1(_b);

data_to_send[_cnt++] = BYTE0(_c);
data_to_send[_cnt++] = BYTE1(_c);

data_to_send[_cnt++] = BYTE0(_d);
data_to_send[_cnt++] = BYTE1(_d);
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230705161139.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230705161148.webp)

> 对16位，32位数据进行拆分,拆分后我们按照协议要求发送数据就可以了
>
> ```cpp
> //需要发送16位,32位数据，对数据拆分，之后每次发送单个字节
> //拆分过程：对变量dwTemp 去地址然后将其转化成char类型指针，最后再取出指针所指向的内容
> #define BYTE0(dwTemp)  (*(char *)(&dwTemp))	// 低8位（最低有效字节）
> #define BYTE1(dwTemp)  (*((char *)(&dwTemp) + 1))	// 第二个8位（次低有效字节）
> #define BYTE2(dwTemp)  (*((char *)(&dwTemp) + 2))	// 第三个8位（次高有效字节）
> #define BYTE3(dwTemp)  (*((char *)(&dwTemp) + 3))	// 最高8位（最高有效字节）
> ```

{% folding, NiMing.h %}

```cpp
#ifndef __NIMING_H
#define __NIMING_H

//需要发送16位,32位数据，对数据拆分，之后每次发送单个字节
//拆分过程：对变量dwTemp 去地址然后将其转化成char类型指针，最后再取出指针所指向的内容
#define BYTE0(dwTemp)  (*(char *)(&dwTemp))
#define BYTE1(dwTemp)  (*((char *)(&dwTemp) + 1))
#define BYTE2(dwTemp)  (*((char *)(&dwTemp) + 2))
#define BYTE3(dwTemp)  (*((char *)(&dwTemp) + 3))

typedef struct
{
    uint8_t data_to_send[100];  // 发送字符串
    void (*ANO_DT_Send_F1)(uint16_t, uint16_t, uint16_t, uint16_t); // 通过F1帧发送4个uint16类型的数据
    void (*ANO_DT_Send_F2)(int16_t, int16_t, int16_t, int16_t); // 通过F2帧发送4个int16类型的数据
    void (*ANO_DT_Send_F3)(int16_t, int16_t, int32_t);      //  通过F3帧发送2个int16类型和1个int32类型的数据
}NiMing_t;


extern NiMing_t NiMing;

#endif
```

{% endfolding %}

{% folding, NiMing.c %}

```cpp
/***************************************************************************
 * File: NiMing.c
 * Author: Luckys.
 * Date: 2023/06/30
 * description: 匿名上位机
****************************************************************************/
#include "AllHead.h"

/*====================================static function declaration area BEGIN====================================*/

static void ANO_DT_Send_F1(uint16_t, uint16_t, uint16_t, uint16_t);
static void ANO_DT_Send_F2(int16_t, int16_t, int16_t, int16_t);
static void ANO_DT_Send_F3(int16_t, int16_t, int32_t);

/*====================================static function declaration area   END====================================*/

NiMing_t NiMing = 
{
    {0},
    ANO_DT_Send_F1,
    ANO_DT_Send_F2,
    ANO_DT_Send_F3
};



/*
* @function: ANO_DT_Send_F1
* @param: _a -> 数据1 _b -> 数据2 _c -> 数据3 _d -> 数据4
* @retval: None
* @brief: 通过F1帧发送4个uint16类型的数据
*/
static void ANO_DT_Send_F1(uint16_t _a, uint16_t _b, uint16_t _c, uint16_t _d)
{
    uint8_t _cnt = 0;     // 计数值
    uint8_t sumcheck = 0; // 和校验
    uint8_t addcheck = 0; // 附加和校验
    uint8_t i = 0;

    NiMing.data_to_send[_cnt++] = 0xAA; // 帧头
    NiMing.data_to_send[_cnt++] = 0xFF; // 目标地址
    NiMing.data_to_send[_cnt++] = 0xF1; // 功能码
    NiMing.data_to_send[_cnt++] = 8;    // 数据长度
    // 单片机为小端模式-低地址存放低位数据，匿名上位机要求先发低位数据，所以先发低地址
    NiMing.data_to_send[_cnt++] = BYTE0(_a);
    NiMing.data_to_send[_cnt++] = BYTE1(_a);

    NiMing.data_to_send[_cnt++] = BYTE0(_b);
    NiMing.data_to_send[_cnt++] = BYTE1(_b);

    NiMing.data_to_send[_cnt++] = BYTE0(_c);
    NiMing.data_to_send[_cnt++] = BYTE1(_c);

    NiMing.data_to_send[_cnt++] = BYTE0(_d);
    NiMing.data_to_send[_cnt++] = BYTE1(_d);
    for (i = 0; i < NiMing.data_to_send[3] + 4; i++)
    {
        sumcheck += NiMing.data_to_send[i]; // 和校验
        addcheck += sumcheck;        // 附加校验
    }
    NiMing.data_to_send[_cnt++] = sumcheck;
    NiMing.data_to_send[_cnt++] = addcheck;

    HAL_UART_Transmit(&huart_debug, NiMing.data_to_send, _cnt, 0xFFFF); // 这里是串口发送函数
}

/*
* @function: ANO_DT_Send_F2
* @param: _a -> 数据1 _b -> 数据2 _c -> 数据3 _d -> 数据4
* @retval: None
* @brief: 通过F2帧发送4个int16类型的数据
*/
static void ANO_DT_Send_F2(int16_t _a, int16_t _b, int16_t _c, int16_t _d) 
{
    uint8_t _cnt = 0;
    uint8_t sumcheck = 0; // 和校验
    uint8_t addcheck = 0; // 附加和校验
    uint8_t i = 0;

    NiMing.data_to_send[_cnt++] = 0xAA;
    NiMing.data_to_send[_cnt++] = 0xFF;
    NiMing.data_to_send[_cnt++] = 0xF2;
    NiMing.data_to_send[_cnt++] = 8; // 数据长度
    // 单片机为小端模式-低地址存放低位数据，匿名上位机要求先发低位数据，所以先发低地址
    NiMing.data_to_send[_cnt++] = BYTE0(_a);
    NiMing.data_to_send[_cnt++] = BYTE1(_a);

    NiMing.data_to_send[_cnt++] = BYTE0(_b);
    NiMing.data_to_send[_cnt++] = BYTE1(_b);

    NiMing.data_to_send[_cnt++] = BYTE0(_c);
    NiMing.data_to_send[_cnt++] = BYTE1(_c);

    NiMing.data_to_send[_cnt++] = BYTE0(_d);
    NiMing.data_to_send[_cnt++] = BYTE1(_d);

    for (i = 0; i < NiMing.data_to_send[3] + 4; i++)
    {
        sumcheck += NiMing.data_to_send[i];
        addcheck += sumcheck;
    }

    NiMing.data_to_send[_cnt++] = sumcheck;
    NiMing.data_to_send[_cnt++] = addcheck;

    HAL_UART_Transmit(&huart_debug, NiMing.data_to_send, _cnt, 0xFFFF); // 这里是串口发送函数
}

/*
* @function: ANO_DT_Send_F3
* @param: _a -> 数据1 _b -> 数据2 _c -> 数据3
* @retval: None
* @brief: 通过F3帧发送2个int16类型和1个int32类型的数据
*/
static void ANO_DT_Send_F3(int16_t _a, int16_t _b, int32_t _c)
{
    uint8_t _cnt = 0;
    uint8_t sumcheck = 0; // 和校验
    uint8_t addcheck = 0; // 附加和校验
    uint8_t i = 0;

    NiMing.data_to_send[_cnt++] = 0xAA;
    NiMing.data_to_send[_cnt++] = 0xFF;
    NiMing.data_to_send[_cnt++] = 0xF3;
    NiMing.data_to_send[_cnt++] = 8; // 数据长度
    // 单片机为小端模式-低地址存放低位数据，匿名上位机要求先发低位数据，所以先发低地址
    NiMing.data_to_send[_cnt++] = BYTE0(_a);
    NiMing.data_to_send[_cnt++] = BYTE1(_a);

    NiMing.data_to_send[_cnt++] = BYTE0(_b);
    NiMing.data_to_send[_cnt++] = BYTE1(_b);

    NiMing.data_to_send[_cnt++] = BYTE0(_c);
    NiMing.data_to_send[_cnt++] = BYTE1(_c);
    NiMing.data_to_send[_cnt++] = BYTE2(_c);
    NiMing.data_to_send[_cnt++] = BYTE3(_c);

    for (i = 0; i < NiMing.data_to_send[3] + 4; i++)
    {
        sumcheck += NiMing.data_to_send[i];
        addcheck += sumcheck;
    }

    NiMing.data_to_send[_cnt++] = sumcheck;
    NiMing.data_to_send[_cnt++] = addcheck;

    HAL_UART_Transmit(&huart_debug, NiMing.data_to_send, _cnt, 0xFFFF); // 这里是串口发送函数
}

```

{% endfolding %}

> 代码测试，直接调用即可，`注意上位机不支持浮点数，所以需要扩大倍数然后发送`
>
> ```cpp
> NiMing.ANO_DT_Send_F2(Encoder.Motor1Speed*100, 3.0*100, Encoder.Motor2Speed*100, 3.0*100);  // 匿名上位机调试
> ```

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230705221344.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230705221327.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230705215140.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230705221149.webp)

{% endgallery %}

> 使用cjson调试PID

1. 打开串口中断
2. 调大堆栈

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230706123500.webp)

3. 编写串口中断函数(记住在中断服务函数里不要清除中断标志位！！否则卡死)

```cpp
/*
* @function: USART1_IRQHandler
* @param: None
* @retval: None
* @brief: 串口中断服务函数
*/
void USART1_IRQHandler(void)
{
	if (__HAL_UART_GET_FLAG(&huart1,UART_FLAG_RXNE) != 0x00u)
	{
		// __HAL_UART_CLEAR_FLAG(&huart1,UART_FLAG_RXNE);	// 清除标志位
		if (UART1.Uart1_Rec_Count >= UART1_REC_MAX)
		{
			UART1.Uart1_Rec_Count = 0;
		}
		HAL_UART_Receive(&huart1, &UART1.Uart1_Rec_Buff[UART1.Uart1_Rec_Count++], 1, 1000);
	}

	HAL_UART_IRQHandler(&huart1);
}
```

3. 加入cjson  `.c`  和  `.h` 到工程里，编写解析函数(注释的是控制电机PID的测试时暂时屏蔽)

```cpp
float p,i,d,a;

/*
* @function: UART1_CJSON_Analyze
* @param: None
* @retval: None
* @brief: CJSON解析
*/
static void UART1_CJSON_Analyze(void)
{
    cJSON *cJsonData, *cJsonVlaue;

    if (UART1_Wait_Finish() == 0) // 是否接收完毕
    {
        cJsonData = cJSON_Parse((const char *)UART1.Uart1_Rec_Buff);
        if (cJSON_GetObjectItem(cJsonData, "p") != NULL)
        {
            cJsonVlaue = cJSON_GetObjectItem(cJsonData, "p");
            p = cJsonVlaue->valuedouble;
            // PID_Motor1Speed.Kp = p;
        }
        if (cJSON_GetObjectItem(cJsonData, "i") != NULL)
        {
            cJsonVlaue = cJSON_GetObjectItem(cJsonData, "i");
            i = cJsonVlaue->valuedouble;
            // PID_Motor1Speed.Ki = i;
        }
        if (cJSON_GetObjectItem(cJsonData, "d") != NULL)
        {
            cJsonVlaue = cJSON_GetObjectItem(cJsonData, "d");
            d = cJsonVlaue->valuedouble;
            // PID_Motor1Speed.Kd = d;
        }
        if (cJSON_GetObjectItem(cJsonData, "a") != NULL)
        {
            cJsonVlaue = cJSON_GetObjectItem(cJsonData, "a");
            a = cJsonVlaue->valuedouble;
            // PID_Motor1Speed.target_val = a;
        }
        if (cJsonData != NULL)
        {
            cJSON_Delete(cJsonData); // 释放空间、但是不能删除cJsonVlaue不然会 出现异常错误
        }
        Public.Memory_Clear(UART1.Uart1_Rec_Buff, UART1_REC_MAX);   // 清空接收buf，注意这里不能使用strlen
    }
    Public.UsartPrintf(huart_debug,"P:%.3f  I:%.3f  D:%.3f A:%.3f\r\n", p, i, d, a);
}
```

3. 发送测试

```cpp
{"p":110,"i":5,"d":0,"a":2}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230706140335.webp)





### VOFA+

> 波形显示

1. 把左边波形控件拉到右边，然后放大，右键x轴选择【时间轴】，右键y轴选择【通道Ix】
2. 程序里发送的格式是：

```cpp
// 这样就发送了两个通道的数据了
printf("%.2f,%.2f \n",a,b);
```

> 测试代码

```cpp
Public.UsartPrintf(huart_debug, "%.2f,%.2f \n", Encoder.Motor1Speed,Encoder.Motor2Speed);  // VOFA+上位机调试
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230705153259.webp)



### 野火PID调试助手

首先我们测试一下看看野火上位机下发的命令格式，需要另一个串口调试助手协助，打开虚拟串口，然后发送，在另一个串口助手即可收到

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230918100351.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230918101018.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230918100750.webp)

> 发送部分格式
>
> ```cpp
> set_computer_value(SEND_FACT_CMD, CURVES_CH1, &a, 1);	// 发送实际值--a是int类型
> ```
>
> 



## PID学习

PID控制器是一种线性控制器，用 `输出量y(t)` 和 `给定量r(t)` 之间的误差的时间函数 `e(t)=r(t)-y(t)` 的 `比例、积分和微分` 的线性组合构成控制量u(t)，称为 `比例、积分、微分控制`，简称 `PID控制(也可以理解为 p:现在 i:过去 d:未来)`

> 1. Kp（比例系数）：
>    - 比例系数决定了响应系统误差的快慢程度。
>    - 当Kp值较大时，控制器对误差的响应较强，系统的纠正速度会加快。
>    - 然而，如果Kp过大，系统可能会产生过量的振荡或不稳定的行为。
>    - 如果Kp值较小，系统的响应较为缓慢，可能导致误差无法迅速减小。
> 2. Ki（积分系数）：
>    - 积分系数决定了对误差累积部分进行纠正的力度。
>    - 它主要用于消除稳态误差（系统无法完全消除的偏差）。
>    - 当Ki值较大时，积分项的影响将更明显，系统将更积极地纠正偏差。
>    - 然而，如果Ki过大，系统可能会产生超调或振荡的现象。
>    - 如果Ki值较小，系统的对稳态误差的纠正能力较弱。
> 3. Kd（微分系数）：
>    - 微分系数决定了对误差变化率进行纠正的力度。
>    - 它主要用于预测和抑制系统的超调行为。
>    - 当Kd值较大时，微分项的影响将更明显，系统将更敏锐地对误差的变化做出反应。
>    - 然而，如果Kd过大，系统可能会导致过度抑制或产生震荡。
>    - 如果Kd值较小，系统对误差变化的敏感度较低，可能无法有效抑制超调或振荡。

> - 位置式和增量式PID区别？
>
> 1. 位置式PID控制器的公式中直接使用误差项、累积误差项和误差变化项
> 2. 增量式PID控制器的公式中使用的是误差的增量或变化量
> 3. 在位置式PID控制器中，一般会有对误差的积分项，而增量式PID控制器中通常没有显式的积分项
> 4. 位置式PID控制器更常见且应用广泛，而增量式PID控制器通常用于对控制量增量的调节

> - 【PID口诀】
>
> 参数整定找最佳，从小到大顺序查
> 先是比例后积分，最后再把微分加
> 曲线振荡很频繁，比例度盘要放大
> 曲线漂浮绕大湾，比例度盘往小扳
> 曲线偏离回复慢，积分时间往下降
> 曲线波动周期长，积分时间再加长
> 曲线振荡频率快，先把微分降下来
> 动差大来波动慢，微分时间应加长
> 理想曲线两个波，前高后低四比一
> 一看二调多分析，调节质量不会低





#### 附1-增量式PID

{% note red 'fas fa-fan' flat %}注意{% endnote %}

本例基于上面的【有刷直流电机-编程示例2-速度闭环控制】



> $U_k = Kp \times e_k + Ki∑^{k} _{j=0}e_j + Kd(e_k - e_{k-1})$
>
> 上面从左到右就是 `比例项+积分项+微分项`
>
> 位置式PID控制器使用当前误差 $e_k$、累积误差 $Ki∑^{k} _{j=0}e_j$ 以及误差变化率 $e_k - e_{k-1}$ 的加权和来计算控制量 $U_k$
>
> 其中，比例项 $Kp$ 乘以当前误差，积分项 $Ki$ 乘以累积误差，而微分项 $Kd$ 乘以误差变化率
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230705222816.webp)
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230706000437.webp)

> 1. 调节P  把 `I=0、D=0` 先给正值或负值值测试P正负(比如给负数如果失控了就表示不对就给正数)、然后根据PID函数输入和输出估算P 大小，然后 `I=0 D=0` 去测试，调节一个较大值
> 2. 调节I  把P等于前面上一步调好的值 然后测试 `I给较大正值和负值` 测试出I正负，然后I从小值调节，直到没有偏差存在
> 3.  `一般系统不使用D`
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230706152201.webp)



{% folding, PID.h %}

```cpp
#ifndef __PID_H
#define __PID_H

typedef struct
{
    float target_val; // 目标值
    float actual_val; // 实际值

    float err;        // 当前偏差
    float err_last;   // 上次偏差
    float err_sum;    // 误差累计值

    float Kp; // 比例系数
    float Ki; // 积分系数
    float Kd; // 微分系数
}PID_t;

extern PID_t PID_Motor1Speed;


void PID_Init(void);
float P_Control(PID_t* p_pid,float new_actual_val); // 比例p调节控制函数
float PI_Control(PID_t *p_pid, float new_actual_val);   // 比例P 积分I 控制函数
float PID_Control(PID_t* p_pid,float new_actual_val); // PID控制函数

#endif
```

{% endfolding %}

{% folding, PID.c %}

```cpp
/***************************************************************************
 * File: PID.c
 * Author: Luckys.
 * Date: 2023/06/26
 * description: PID
****************************************************************************/
#include "AllHead.h"


PID_t PID_Motor1Speed;

/*
* @function: PID_Init
* @param: None
* @retval: None
* @brief: PID初始化
*/
void PID_Init(void)
{
    PID_Motor1Speed.target_val = 0.00; // 目标值
    PID_Motor1Speed.actual_val = 0.00; // 实际值

    PID_Motor1Speed.err = 0.00;        // 当前偏差
    PID_Motor1Speed.err_last = 0.00;   // 上次偏差
    PID_Motor1Speed.err_sum = 0.00;    // 误差累计值

    PID_Motor1Speed.Kp = 0.00; // 比例系数
    PID_Motor1Speed.Ki = 0.00; // 积分系数
    PID_Motor1Speed.Kd = 0.00; // 微分系数    
}

/*
* @function: P_Control
* @param: p_pid -> 指向PID结构体的指针 new_actual_val -> 新的实际值
* @retval: None
* @brief: 比例p调节控制函数
*/
float P_Control(PID_t* p_pid,float new_actual_val)
{
    p_pid->actual_val = new_actual_val;       // 传递真实值
    p_pid->err = p_pid->target_val - p_pid->actual_val; // 当前误差=目标值-真实值
    // 比例控制调节   输出 = Kp * 当前误差
    p_pid->actual_val = p_pid->Kp * p_pid->err;

    return p_pid->actual_val;
}

/*
* @function: PI_Control
* @param: p_pid -> 指向PID结构体的指针 new_actual_val -> 新的实际值
* @retval: None
* @brief: 比例P 积分I 控制函数
*/
float PI_Control(PID_t *p_pid, float new_actual_val)
{
    p_pid->actual_val = new_actual_val;                 // 传递真实值
    p_pid->err = p_pid->target_val - p_pid->actual_val; // 当前误差=目标值-真实值
    p_pid->err_sum += p_pid->err;                     // 误差累计值 = 当前误差累计和
    // 使用PI控制 输出 = Kp*当前误差 + Ki*误差累计值
    p_pid->actual_val = p_pid->Kp * p_pid->err + p_pid->Ki * p_pid->err_sum;

    return p_pid->actual_val;
}

/*
* @function: PID_Control
* @param: p_pid -> 指向PID结构体的指针 new_actual_val -> 新的实际值
* @retval: None
* @brief: PID控制函数
*/
float PID_Control(PID_t* p_pid,float new_actual_val)
{
    p_pid->actual_val = new_actual_val;                 // 传递真实值
    p_pid->err = p_pid->target_val - p_pid->actual_val; ////当前误差=目标值-真实值
    p_pid->err_sum += p_pid->err;                     // 误差累计值 = 当前误差累计和
    // 使用PID控制 输出 = Kp*当前误差  +  Ki*误差累计值 + Kd*(当前误差-上次误差)
    p_pid->actual_val = p_pid->Kp * p_pid->err + p_pid->Ki * p_pid->err_sum + p_pid->Kd * (p_pid->err - p_pid->err_last);
    // 保存上次误差: 这次误差赋值给上次误差
    p_pid->err_last = p_pid->err;

    return p_pid->actual_val;
}
```

{% endfolding %}

> 测试代码(调试1) --- 只用Kp(只根据当前误差进行控制)

{% folding, Task.c %}

```cpp
static void TasksHandle_5MS(void)
{
    Motor.Motor_Set_Duty(Motor_LATER_LEFT,PID_Control(&PID_Motor1Speed, Encoder.Motor1Speed));  // PID控制电机1
    NiMing.ANO_DT_Send_F2(Encoder.Motor1Speed*100, 3.0*100, 0, 0);  // 匿名上位机调试
}
```

{% endfolding %}

首先需要把PID赋初始值，否则默认全部0的话电机不会动

分析：看PID控制函数，我们输入大概是 `0~10` 左右，输出是 `0~99`，那Kp可以先给10试试，

```cpp
PID_Motor1Speed.target_val = 3.00; // 目标值
PID_Motor1Speed.Kp = 10; // 比例系数
```

可以看到误差还是挺大的

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230706111659.webp)

尝试把Kp=10改成50，可以看到误差小了，因为Kp大小决定了误差的响应速度

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230706112055.webp)

> 测试代码(调试2) --- 在上面基础上加入Ki(加入历史误差)

```cpp
PID_Motor1Speed.target_val = 3.00; // 目标值
PID_Motor1Speed.Kp = 10; // 比例系数
PID_Motor1Speed.Ki = 5; // 积分系数
```

可以看到，已经很接近目标值了

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230706113726 (1).webp)

> 把速度改变丢中断里执行,20ms执行一次

```cpp
static uint16_t PID_Cnt;


if ((PID_Cnt % 20) == 0)
{
    Motor.Motor_Set_Duty(Motor_LATER_LEFT, PID_Control(&PID_Motor1Speed, Encoder.Motor1Speed)); // PID控制电机1
    PID_Cnt = 0;
}
```

> 实现前进，后退，左转，右转，停止，原地左转，原地右转

- 为什么改变了目标速度后调用 `Motor_Set_Duty`呢？不是在中断里有这个吗？

因为这样保证了实时性，因为中断里 `Motor_Set_Duty` 函数20ms才进入一次 

- 看图就知道这么写了

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230706204721.webp)

```cpp
/*
* @function: Motor_Pid_Seet_Speed
* @param: front_l -> 前左目标速度 front_r -> 前右目标速度 later_l -> 后左目标速度 later_r -> 后右目标速度
* @retval: None
* @brief: 电机PID速度设置
*/
static void Motor_Pid_Seet_Speed(float front_l, float front_r, float later_l, float later_r)
{
    PID_FrontLeft_Speed.target_val = front_l;
    PID_FrontRight_Speed.target_val = front_r;
    PID_LaterLeft_Speed.target_val = later_l;
    PID_LaterRight_Speed.target_val = later_r;

    Motor.Motor_Set_Duty(Motor_FRONT_LEFT, PID_Control(&PID_FrontLeft_Speed, front_l)); 
    Motor.Motor_Set_Duty(Motor_FRONT_RIGHT, PID_Control(&PID_FrontRight_Speed, front_r));
    Motor.Motor_Set_Duty(Motor_LATER_LEFT, PID_Control(&PID_LaterLeft_Speed, later_l));
    Motor.Motor_Set_Duty(Motor_LATER_RIGHT, PID_Control(&PID_LaterRight_Speed, later_r)); 
}
```

```cpp
switch(choose)
{
case 1:
{
    Motor.Motor_Pid_Seet_Speed(2, 2, 2, 2); // 前进
    break;
}
case 2:
{
    Motor.Motor_Pid_Seet_Speed(-2, -2, -2, -2); // 后退
    break;
}
case 3:
{
    Motor.Motor_Pid_Seet_Speed(2, 3, 2, 3); // 左转
    break;
}
case 4:
{
    Motor.Motor_Pid_Seet_Speed(3, 2, 3, 2); // 右转
    break;
}
case 5:
{
    Motor.Motor_Pid_Seet_Speed(0, 0, 0, 0); // 停止
    break;
}
case 6:
{
    Motor.Motor_Pid_Seet_Speed(-2, 2, -2, 2); // 原地左转
    break;
}
case 7:
{
    Motor.Motor_Pid_Seet_Speed(2, -2, 2, -2); // 原地右转
    break;
}
default:
    break;
}
choose = (choose - 1 + 1) % 7 + 1;
}
```

> 向前加速度，向前减速度

```cpp
// 结构体里定义
float fMotor_Max_Sub_Speed; // 向前最大减速度上限
float fMotor_Max_Add_Speed; // 向前最大加速度上限

/*
* @function: Motor_Go_Acceleration
* @param: None
* @retval: None
* @brief: 向前加速度
*/
static void Motor_Go_Acceleration(void)
{
    static float SpeedTemp = 0.5;

    if (SpeedTemp <= Motor.fMotor_Max_Add_Speed)
    {
        SpeedTemp += 0.5;
    }
    Motor_Pid_Seet_Speed(SpeedTemp, SpeedTemp, SpeedTemp, SpeedTemp);
}

/*
* @function: Motor_Go_Deceleration
* @param: None
* @retval: None
* @brief: 向前减速度
*/
static void Motor_Go_Deceleration(void)
{
    if (Motor.fMotor_Max_Sub_Speed >= 0.5)
    {
        Motor.fMotor_Max_Sub_Speed -= 0.5;
    }
    Motor_Pid_Seet_Speed(Motor.fMotor_Max_Sub_Speed, Motor.fMotor_Max_Sub_Speed, Motor.fMotor_Max_Sub_Speed, Motor.fMotor_Max_Sub_Speed);    
}
```

> 里程计算

`里程`: 小车行驶的路程长度

只要计算出每个单位时间小车行驶的长度然后一直相加，就是这一段时间行驶的总里程长度了

20ms计算一次,20ms走过了多少距离，然后一直相加，就是走的总距离，就是里程。这里我们使用后左轮进行计算。也可以两个后轮相加然后除以2(我车的轮胎直径是4.8cm)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230706214246.webp)

```cpp
// 丢定时器中断里20ms执行一次即可

// 里程数(cm) += 时间周期（s）*车轮转速(转/s)*车轮周长(cm)
Motor.Mileage += 0.02 * Encoder.MotorSpeed_Arr[Motor_LATER_LEFT] * 15;
```

> 7路灰度寻迹(未加PID)

{% folding, Track.c %}

```cpp
/*
* @function: Track_Read_Sensor
* @param: None
* @retval: None
* @brief: 读取传感器偏离(识别到黑线返回数字信号低电平0，未识别到黑线返回高电平1)
*/
static void Track_Read_Sensor(void)
{
    Track_Read_Status();

    // 识别到黑线在中间 --- 111 0 111
    if (Track.ucTrack_Status_Buff[L3_Status] == 1 && Track.ucTrack_Status_Buff[L2_Status]  == 1 && Track.ucTrack_Status_Buff[L1_Status]  == 1 &&
        Track.ucTrack_Status_Buff[M_Status] == 0 &&
        Track.ucTrack_Status_Buff[R1_Status] == 1 && Track.ucTrack_Status_Buff[R2_Status]  == 1 && Track.ucTrack_Status_Buff[R3_Status] == 1)
    {
        Track.Car_Error_Status = 0;
        Motor.Motor_Pid_Seet_Speed(2,2,2,2);
    }   
    // 小车偏右程度1 --- 110 0 111
    else if (Track.ucTrack_Status_Buff[L3_Status] == 1 && Track.ucTrack_Status_Buff[L2_Status] == 1 && Track.ucTrack_Status_Buff[L1_Status] == 0 &&
            Track.ucTrack_Status_Buff[M_Status] == 0 &&
            Track.ucTrack_Status_Buff[R1_Status] == 1 && Track.ucTrack_Status_Buff[R2_Status] == 1 && Track.ucTrack_Status_Buff[R3_Status] == 1)
    {
        Motor.Motor_Pid_Seet_Speed(1.5,3,1.5,3);
    } 
    // 小车偏右程度2 --- 110 1 111
    else if (Track.ucTrack_Status_Buff[L3_Status] == 1 && Track.ucTrack_Status_Buff[L2_Status] == 1 && Track.ucTrack_Status_Buff[L1_Status] == 0 &&
            Track.ucTrack_Status_Buff[M_Status] == 1 &&
            Track.ucTrack_Status_Buff[R1_Status] == 1 && Track.ucTrack_Status_Buff[R2_Status] == 1 && Track.ucTrack_Status_Buff[R3_Status] == 1)
    {
        Motor.Motor_Pid_Seet_Speed(1.5,3.5,1.5,3.5);
    } 
    // 小车偏右程度3 --- 100 1 111
    else if (Track.ucTrack_Status_Buff[L3_Status] == 1 && Track.ucTrack_Status_Buff[L2_Status] == 0 && Track.ucTrack_Status_Buff[L1_Status] == 0 &&
            Track.ucTrack_Status_Buff[M_Status] == 1 &&
            Track.ucTrack_Status_Buff[R1_Status] == 1 && Track.ucTrack_Status_Buff[R2_Status] == 1 && Track.ucTrack_Status_Buff[R3_Status] == 1)
    {
        Motor.Motor_Pid_Seet_Speed(1.5,4,1.5,4);
    }   
    // 小车偏右程度4 --- 101 1 111
    else if (Track.ucTrack_Status_Buff[L3_Status] == 1 && Track.ucTrack_Status_Buff[L2_Status] == 0 && Track.ucTrack_Status_Buff[L1_Status] == 1 &&
            Track.ucTrack_Status_Buff[M_Status] == 1 &&
            Track.ucTrack_Status_Buff[R1_Status] == 1 && Track.ucTrack_Status_Buff[R2_Status] == 1 && Track.ucTrack_Status_Buff[R3_Status] == 1)
    {
        Motor.Motor_Pid_Seet_Speed(1.5,4.5,1.5,4.5);
    }
    // 小车偏右程度5 --- 001 1 111
    else if (Track.ucTrack_Status_Buff[L3_Status] == 0 && Track.ucTrack_Status_Buff[L2_Status] == 0 && Track.ucTrack_Status_Buff[L1_Status] == 1 &&
            Track.ucTrack_Status_Buff[M_Status] == 1 &&
            Track.ucTrack_Status_Buff[R1_Status] == 1 && Track.ucTrack_Status_Buff[R2_Status] == 1 && Track.ucTrack_Status_Buff[R3_Status] == 1)
    {
        Motor.Motor_Pid_Seet_Speed(1.5,5,1.5,5);
    }  
    // 小车偏右程度6 --- 011 1 111
    else if (Track.ucTrack_Status_Buff[L3_Status] == 0 && Track.ucTrack_Status_Buff[L2_Status] == 1 && Track.ucTrack_Status_Buff[L1_Status] == 1 &&
            Track.ucTrack_Status_Buff[M_Status] == 1 &&
            Track.ucTrack_Status_Buff[R1_Status] == 1 && Track.ucTrack_Status_Buff[R2_Status] == 1 && Track.ucTrack_Status_Buff[R3_Status] == 1)
    {
        Motor.Motor_Pid_Seet_Speed(1.5,5.5,1.5,5.5);
    }     
    // 小车偏左程度1 --- 111 0 011
    else if (Track.ucTrack_Status_Buff[L3_Status] == 1 && Track.ucTrack_Status_Buff[L2_Status] == 1 && Track.ucTrack_Status_Buff[L1_Status] == 1 &&
            Track.ucTrack_Status_Buff[M_Status] == 0 &&
            Track.ucTrack_Status_Buff[R1_Status] == 0 && Track.ucTrack_Status_Buff[R2_Status] == 1 && Track.ucTrack_Status_Buff[R3_Status] == 1)
    {
        Motor.Motor_Pid_Seet_Speed(3,1.5,3,1.5);
    } 
    // 小车偏左程度2 --- 111 1 011
    else if (Track.ucTrack_Status_Buff[L3_Status] == 1 && Track.ucTrack_Status_Buff[L2_Status] == 1 && Track.ucTrack_Status_Buff[L1_Status] == 1 &&
            Track.ucTrack_Status_Buff[M_Status] == 1 &&
            Track.ucTrack_Status_Buff[R1_Status] == 0 && Track.ucTrack_Status_Buff[R2_Status] == 1 && Track.ucTrack_Status_Buff[R3_Status] == 1)
    {
        Motor.Motor_Pid_Seet_Speed(3.5,1.5,3.5,1.5);
    } 
    // 小车偏左程度3 --- 111 1 001
    else if (Track.ucTrack_Status_Buff[L3_Status] == 1 && Track.ucTrack_Status_Buff[L2_Status] == 1 && Track.ucTrack_Status_Buff[L1_Status] == 1 &&
            Track.ucTrack_Status_Buff[M_Status] == 1 &&
            Track.ucTrack_Status_Buff[R1_Status] == 0 && Track.ucTrack_Status_Buff[R2_Status] == 0 && Track.ucTrack_Status_Buff[R3_Status] == 1)
    {
        Motor.Motor_Pid_Seet_Speed(4,1.5,4,1.5);
    }   
    // 小车偏左程度4 --- 111 1 101
    else if (Track.ucTrack_Status_Buff[L3_Status] == 1 && Track.ucTrack_Status_Buff[L2_Status] == 1 && Track.ucTrack_Status_Buff[L1_Status] == 1 &&
            Track.ucTrack_Status_Buff[M_Status] == 1 &&
            Track.ucTrack_Status_Buff[R1_Status] == 1 && Track.ucTrack_Status_Buff[R2_Status] == 0 && Track.ucTrack_Status_Buff[R3_Status] == 1)
    {
        Motor.Motor_Pid_Seet_Speed(4.5,1.5,4.5,1.5);
    }
    // 小车偏左程度5 --- 111 1 100
    else if (Track.ucTrack_Status_Buff[L3_Status] == 1 && Track.ucTrack_Status_Buff[L2_Status] == 1 && Track.ucTrack_Status_Buff[L1_Status] == 1 &&
            Track.ucTrack_Status_Buff[M_Status] == 1 &&
            Track.ucTrack_Status_Buff[R1_Status] == 1 && Track.ucTrack_Status_Buff[R2_Status] == 0 && Track.ucTrack_Status_Buff[R3_Status] == 0)
    {
        Motor.Motor_Pid_Seet_Speed(5,1.5,5,1.5);
    }  
    // 小车偏左程度6 --- 111 1 110
    else if (Track.ucTrack_Status_Buff[L3_Status] == 1 && Track.ucTrack_Status_Buff[L2_Status] == 1 && Track.ucTrack_Status_Buff[L1_Status] == 1 &&
            Track.ucTrack_Status_Buff[M_Status] == 1 &&
            Track.ucTrack_Status_Buff[R1_Status] == 1 && Track.ucTrack_Status_Buff[R2_Status] == 1 && Track.ucTrack_Status_Buff[R3_Status] == 0)
    {
        Motor.Motor_Pid_Seet_Speed(5.5,1.5,5.5,1.5);
    }      
    else if (Track.ucTrack_Status_Buff[L3_Status] == 1 && Track.ucTrack_Status_Buff[L2_Status] == 1 && Track.ucTrack_Status_Buff[L1_Status] == 1 &&
            Track.ucTrack_Status_Buff[M_Status] == 1 &&
            Track.ucTrack_Status_Buff[R1_Status] == 1 && Track.ucTrack_Status_Buff[R2_Status] == 1 && Track.ucTrack_Status_Buff[R3_Status] == 1)
    {
        Motor.Motor_Pid_Seet_Speed(0,0,0,0);
    }  
    else if (Track.ucTrack_Status_Buff[L3_Status] == 0 && Track.ucTrack_Status_Buff[L2_Status] == 0 && Track.ucTrack_Status_Buff[L1_Status] == 0 &&
            Track.ucTrack_Status_Buff[M_Status] == 0 &&
            Track.ucTrack_Status_Buff[R1_Status] == 0 && Track.ucTrack_Status_Buff[R2_Status] == 0 && Track.ucTrack_Status_Buff[R3_Status] == 0)
    {
        Motor.Motor_Pid_Seet_Speed(0,0,0,0);
    }                                   
}
```

{% endfolding %}

> 加灰度PID，差速就是一边加一边减，具体哪边加哪边减看调试

{% folding, Track.h %}

```cpp
#ifndef __TRACK_H
#define __TRACK_H

// 引脚定义
#define TRACK_R1 GPIO_PIN_2 
#define TRACK_R2 GPIO_PIN_1 
#define TRACK_R3 GPIO_PIN_0
#define TRACK_M GPIO_PIN_3 
#define TRACK_L1 GPIO_PIN_4
#define TRACK_L2 GPIO_PIN_5
#define TRACK_L3 GPIO_PIN_6

// 测试
#define SPEED_1 4
#define SSPEED_2 10
#define SPEED_3 15
#define SPEED_4 30

// 最大速度
#define MAX_SPEED 70
// 普通速度
#define MAX_COMMON_SPEED 30

typedef enum
{
    R1_Status = (uint8_t)0,
    R2_Status = (uint8_t)1,
    R3_Status = (uint8_t)2,
    M_Status = (uint8_t)3,
    L1_Status = (uint8_t)4,
    L2_Status = (uint8_t)5,
    L3_Status = (uint8_t)6,
}Track_Status_t;

typedef struct
{
    float Track_Motor_PID_Arr[4];    // 电机最后寻迹PID控制速度
    float Track_PID_Out;    // 寻迹PID计算输出速度
    uint8_t Car_Stop_Status;  // 到达终点线停止状态
	int8_t Car_Error_Status;	// 小车的位置偏移量 误差(error),位置偏移越大，误差越大，偏移越小，误差越小(偏右是负偏左是正)
    uint8_t ucTrack_Status_Buff[7]; // 存储7路状态

    void (*Track_Read_Status)(void);    // 读取状态
    void (*Track_Read_Sensor)(void);    // 读取寻迹状态与偏离置标志位
}Track_t;

extern Track_t Track;


#endif
```

{% endfolding %}

{% folding, Track.c %}

```cpp
/***************************************************************************
 * File: Track.c
 * Author: Luckys.
 * Date: 2023/06/23
 * description: 光电灰度7路寻迹模块
 -----------------------------------
接线：
    PG0 ---> R3
    PG1 ---> R2
    PG2 ---> R1
    PG3 ---> M
    PG4 ---> L1
    PG5 ---> L2
    PG6 ---> L3   
    5V ---> VCC
    GND ---> GND
 -----------------------------------
****************************************************************************/
#include "AllHead.h"

/*====================================variable definition declaration area BEGIN===================================*/

uint8_t go_right_Flag = 0;  // 转右

/*====================================variable definition declaration area   END===================================*/

/*====================================static function declaration area BEGIN====================================*/

static void Track_Read_Status(void);
static void Track_Read_Sensor(void);
/*====================================static function declaration area   END====================================*/
Track_t Track = 
{
    {0},
    0,
    FALSE,
	0,
    {0},

    Track_Read_Status,
    Track_Read_Sensor,
};

/*
* @function: Track_Read_Status
* @param: None
* @retval: None
* @brief: 读取寻迹灯状态
*/
static void Track_Read_Status(void)
{
    // 从左到右排序 传感器返回的数字信号依次存入
    Track.ucTrack_Status_Buff[L3_Status] = HAL_GPIO_ReadPin(GPIOG, TRACK_L3) ? 0 : 1;
    Track.ucTrack_Status_Buff[L2_Status] = HAL_GPIO_ReadPin(GPIOG, TRACK_L2) ? 0 : 1;
    Track.ucTrack_Status_Buff[L1_Status] = HAL_GPIO_ReadPin(GPIOG, TRACK_L1) ? 0 : 1;
    Track.ucTrack_Status_Buff[M_Status] = HAL_GPIO_ReadPin(GPIOG, TRACK_M) ? 0 : 1;
    Track.ucTrack_Status_Buff[R1_Status] = HAL_GPIO_ReadPin(GPIOG, TRACK_R1) ? 0 : 1;
    Track.ucTrack_Status_Buff[R2_Status] = HAL_GPIO_ReadPin(GPIOG, TRACK_R2) ? 0 : 1;
    Track.ucTrack_Status_Buff[R3_Status] = HAL_GPIO_ReadPin(GPIOG, TRACK_R3) ? 0 : 1;
#if LOG_DEBUG
    printf("R1-%d R2-%d R3-%d\r\nM-%d\r\nL1-%d L2-%d L3-%d\r\n\r\n", Track.ucTrack_Status_Buff[R1_Status],Track.ucTrack_Status_Buff[R2_Status],Track.ucTrack_Status_Buff[R3_Status],Track.ucTrack_Status_Buff[M_Status],Track.ucTrack_Status_Buff[L1_Status],Track.ucTrack_Status_Buff[L2_Status],Track.ucTrack_Status_Buff[L3_Status]);
#endif    
}


/*
* @function: Track_Read_Sensor
* @param: None
* @retval: None
* @brief: 读取传感器偏离(识别到黑线返回数字信号低电平0，未识别到黑线返回高电平1)
*/
static void Track_Read_Sensor(void)
{
    static int8_t Last_Status;  // 上一次状态

    Track_Read_Status();

    // 识别到黑线在中间 --- 111 0 111
    if (Track.ucTrack_Status_Buff[L3_Status] == 1 && Track.ucTrack_Status_Buff[L2_Status]  == 1 && Track.ucTrack_Status_Buff[L1_Status]  == 1 &&
        Track.ucTrack_Status_Buff[M_Status] == 0 &&
        Track.ucTrack_Status_Buff[R1_Status] == 1 && Track.ucTrack_Status_Buff[R2_Status]  == 1 && Track.ucTrack_Status_Buff[R3_Status] == 1)
    {
        Track.Car_Error_Status = 0;
    }   
    // 小车偏右程度1 --- 110 0 111
    else if (Track.ucTrack_Status_Buff[L3_Status] == 1 && Track.ucTrack_Status_Buff[L2_Status] == 1 && Track.ucTrack_Status_Buff[L1_Status] == 0 &&
            Track.ucTrack_Status_Buff[M_Status] == 0 &&
            Track.ucTrack_Status_Buff[R1_Status] == 1 && Track.ucTrack_Status_Buff[R2_Status] == 1 && Track.ucTrack_Status_Buff[R3_Status] == 1)
    {
        Track.Car_Error_Status = -1;
    } 
    // 小车偏右程度2 --- 110 1 111
    else if (Track.ucTrack_Status_Buff[L3_Status] == 1 && Track.ucTrack_Status_Buff[L2_Status] == 1 && Track.ucTrack_Status_Buff[L1_Status] == 0 &&
            Track.ucTrack_Status_Buff[M_Status] == 1 &&
            Track.ucTrack_Status_Buff[R1_Status] == 1 && Track.ucTrack_Status_Buff[R2_Status] == 1 && Track.ucTrack_Status_Buff[R3_Status] == 1)
    {
        Track.Car_Error_Status = -2;
    } 
    // 小车偏右程度3 --- 100 1 111
    else if (Track.ucTrack_Status_Buff[L3_Status] == 1 && Track.ucTrack_Status_Buff[L2_Status] == 0 && Track.ucTrack_Status_Buff[L1_Status] == 0 &&
            Track.ucTrack_Status_Buff[M_Status] == 1 &&
            Track.ucTrack_Status_Buff[R1_Status] == 1 && Track.ucTrack_Status_Buff[R2_Status] == 1 && Track.ucTrack_Status_Buff[R3_Status] == 1)
    {
        Track.Car_Error_Status = -3;
    }   
    // 小车偏右程度4 --- 101 1 111
    else if (Track.ucTrack_Status_Buff[L3_Status] == 1 && Track.ucTrack_Status_Buff[L2_Status] == 0 && Track.ucTrack_Status_Buff[L1_Status] == 1 &&
            Track.ucTrack_Status_Buff[M_Status] == 1 &&
            Track.ucTrack_Status_Buff[R1_Status] == 1 && Track.ucTrack_Status_Buff[R2_Status] == 1 && Track.ucTrack_Status_Buff[R3_Status] == 1)
    {
        Track.Car_Error_Status = -4;
    }
    // 小车偏右程度5 --- 001 1 111
    else if (Track.ucTrack_Status_Buff[L3_Status] == 0 && Track.ucTrack_Status_Buff[L2_Status] == 0 && Track.ucTrack_Status_Buff[L1_Status] == 1 &&
            Track.ucTrack_Status_Buff[M_Status] == 1 &&
            Track.ucTrack_Status_Buff[R1_Status] == 1 && Track.ucTrack_Status_Buff[R2_Status] == 1 && Track.ucTrack_Status_Buff[R3_Status] == 1)
    {
        Track.Car_Error_Status = -5;
    }  
    // 小车偏右程度6 --- 011 1 111
    else if (Track.ucTrack_Status_Buff[L3_Status] == 0 && Track.ucTrack_Status_Buff[L2_Status] == 1 && Track.ucTrack_Status_Buff[L1_Status] == 1 &&
            Track.ucTrack_Status_Buff[M_Status] == 1 &&
            Track.ucTrack_Status_Buff[R1_Status] == 1 && Track.ucTrack_Status_Buff[R2_Status] == 1 && Track.ucTrack_Status_Buff[R3_Status] == 1)
    {
        Track.Car_Error_Status = -6;
    }     
    // 小车偏左程度1 --- 111 0 011
    else if (Track.ucTrack_Status_Buff[L3_Status] == 1 && Track.ucTrack_Status_Buff[L2_Status] == 1 && Track.ucTrack_Status_Buff[L1_Status] == 1 &&
            Track.ucTrack_Status_Buff[M_Status] == 0 &&
            Track.ucTrack_Status_Buff[R1_Status] == 0 && Track.ucTrack_Status_Buff[R2_Status] == 1 && Track.ucTrack_Status_Buff[R3_Status] == 1)
    {
        Track.Car_Error_Status = 1;
    } 
    // 小车偏左程度2 --- 111 1 011
    else if (Track.ucTrack_Status_Buff[L3_Status] == 1 && Track.ucTrack_Status_Buff[L2_Status] == 1 && Track.ucTrack_Status_Buff[L1_Status] == 1 &&
            Track.ucTrack_Status_Buff[M_Status] == 1 &&
            Track.ucTrack_Status_Buff[R1_Status] == 0 && Track.ucTrack_Status_Buff[R2_Status] == 1 && Track.ucTrack_Status_Buff[R3_Status] == 1)
    {
        Track.Car_Error_Status = 2;
    } 
    // 小车偏左程度3 --- 111 1 001
    else if (Track.ucTrack_Status_Buff[L3_Status] == 1 && Track.ucTrack_Status_Buff[L2_Status] == 1 && Track.ucTrack_Status_Buff[L1_Status] == 1 &&
            Track.ucTrack_Status_Buff[M_Status] == 1 &&
            Track.ucTrack_Status_Buff[R1_Status] == 0 && Track.ucTrack_Status_Buff[R2_Status] == 0 && Track.ucTrack_Status_Buff[R3_Status] == 1)
    {
        Track.Car_Error_Status = 3;
    }   
    // 小车偏左程度4 --- 111 1 101
    else if (Track.ucTrack_Status_Buff[L3_Status] == 1 && Track.ucTrack_Status_Buff[L2_Status] == 1 && Track.ucTrack_Status_Buff[L1_Status] == 1 &&
            Track.ucTrack_Status_Buff[M_Status] == 1 &&
            Track.ucTrack_Status_Buff[R1_Status] == 1 && Track.ucTrack_Status_Buff[R2_Status] == 0 && Track.ucTrack_Status_Buff[R3_Status] == 1)
    {
        Track.Car_Error_Status = 4;
    }
    // 小车偏左程度5 --- 111 1 100
    else if (Track.ucTrack_Status_Buff[L3_Status] == 1 && Track.ucTrack_Status_Buff[L2_Status] == 1 && Track.ucTrack_Status_Buff[L1_Status] == 1 &&
            Track.ucTrack_Status_Buff[M_Status] == 1 &&
            Track.ucTrack_Status_Buff[R1_Status] == 1 && Track.ucTrack_Status_Buff[R2_Status] == 0 && Track.ucTrack_Status_Buff[R3_Status] == 0)
    {
        Track.Car_Error_Status = 5;
    }  
    // 小车偏左程度6 --- 111 1 110
    else if (Track.ucTrack_Status_Buff[L3_Status] == 1 && Track.ucTrack_Status_Buff[L2_Status] == 1 && Track.ucTrack_Status_Buff[L1_Status] == 1 &&
            Track.ucTrack_Status_Buff[M_Status] == 1 &&
            Track.ucTrack_Status_Buff[R1_Status] == 1 && Track.ucTrack_Status_Buff[R2_Status] == 1 && Track.ucTrack_Status_Buff[R3_Status] == 0)
    {
        Track.Car_Error_Status = 6;
    }      
    else if (Track.ucTrack_Status_Buff[L3_Status] == 1 && Track.ucTrack_Status_Buff[L2_Status] == 1 && Track.ucTrack_Status_Buff[L1_Status] == 1 &&
            Track.ucTrack_Status_Buff[M_Status] == 1 &&
            Track.ucTrack_Status_Buff[R1_Status] == 1 && Track.ucTrack_Status_Buff[R2_Status] == 1 && Track.ucTrack_Status_Buff[R3_Status] == 1)
    {

    }  
    else if (Track.ucTrack_Status_Buff[L3_Status] == 0 && Track.ucTrack_Status_Buff[L2_Status] == 0 && Track.ucTrack_Status_Buff[L1_Status] == 0 &&
            Track.ucTrack_Status_Buff[M_Status] == 0 &&
            Track.ucTrack_Status_Buff[R1_Status] == 0 && Track.ucTrack_Status_Buff[R2_Status] == 0 && Track.ucTrack_Status_Buff[R3_Status] == 0)
    {

    }

    Track.Track_PID_Out = PID_Control(&PID_Track, Track.Car_Error_Status);   // PID计算输出目标速度 这个速度，会和基础速度加减  

    Track.Track_Motor_PID_Arr[Motor_FRONT_LEFT] = 5 - Track.Track_PID_Out;   
    Track.Track_Motor_PID_Arr[Motor_FRONT_RIGHT] = 5 + Track.Track_PID_Out;
    Track.Track_Motor_PID_Arr[Motor_LATER_LEFT] = 5 - Track.Track_PID_Out;
    Track.Track_Motor_PID_Arr[Motor_LATER_RIGHT] = 5 + Track.Track_PID_Out;
    // 限幅
    Track.Track_Motor_PID_Arr[Motor_FRONT_LEFT] = Motor.Motor_Clamp(Track.Track_Motor_PID_Arr[Motor_FRONT_LEFT], 0, 7);  
    Track.Track_Motor_PID_Arr[Motor_FRONT_RIGHT] = Motor.Motor_Clamp(Track.Track_Motor_PID_Arr[Motor_FRONT_RIGHT], 0, 7);  
    Track.Track_Motor_PID_Arr[Motor_LATER_LEFT] = Motor.Motor_Clamp(Track.Track_Motor_PID_Arr[Motor_LATER_LEFT], 0, 7); 
    Track.Track_Motor_PID_Arr[Motor_LATER_RIGHT] = Motor.Motor_Clamp(Track.Track_Motor_PID_Arr[Motor_LATER_RIGHT], 0, 7); 

    if (Track.Car_Error_Status != Last_Status)
    {
        // 通过计算的速度控制电机
        Motor.Motor_Pid_Seet_Speed(Track.Track_Motor_PID_Arr[Motor_FRONT_LEFT], Track.Track_Motor_PID_Arr[Motor_FRONT_RIGHT], Track.Track_Motor_PID_Arr[Motor_LATER_LEFT], Track.Track_Motor_PID_Arr[Motor_LATER_RIGHT]);
    } 
    Last_Status = Track.Car_Error_Status;                         
}




```

{% endfolding %}

{% folding, PID.c %}

```cpp
/*寻迹PID*/
PID_Track.target_val = 0.00; // 目标值
PID_Track.actual_val = 0.00; // 实际值

PID_Track.err = 0.00;        // 当前偏差
PID_Track.err_last = 0.00;   // 上次偏差
PID_Track.err_sum = 0.00;    // 误差累计值

PID_Track.Kp = 10; // 比例系数
PID_Track.Ki = 0; // 积分系数
PID_Track.Kd = 0; // 微分系数
```

{% endfolding %}