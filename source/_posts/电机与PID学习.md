---
title: 电机与PID学习
cover: /img/num143.webp
categories:
  - 细化学习
comments: false
abbrlink: f3106827
date: 2023-06-25 14:10:48
---



{% note blue 'fas fa-fan' flat %}参考文章/资料{% endnote %}

[电机驱动芯片——DRV8833、TB6612、A4950、L298N的详解与比较](https://blog.51cto.com/u_15262460/2883155)

[全国大学生电子设计竞赛(三)--SPWM与PID--果果小师弟](https://mp.weixin.qq.com/s/xa3o6SjaeFCSDEWV_BS6Nw)

{% note blue 'fas fa-fan' flat %}网盘资料{% endnote %}



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





{% note blue 'fas fa-fan' flat %}轮子动起来{% endnote %}

{% folding, Motor.h %}

```cpp
#ifndef __MOTOR_H
#define __MOTOR_H
#include "AllHead.h"

// 宏定义 管脚
/*后左*/
#define LATER_LEFT_PWMB GPIO_PIN_6
#define LATER_LEFT_BIN1 GPIO_PIN_4
#define LATER_LEFT_BIN2 GPIO_PIN_5
/*后右*/
#define LATER_RIGHT_PWMA GPIO_PIN_7
#define LATER_RIGHT_AIN1 GPIO_PIN_8
#define LATER_RIGHT_AIN2 GPIO_PIN_9
/*前左*/
#define FRONT_LEFT_PWMA GPIO_PIN_0
#define FRONT_LEFT_AIN1 GPIO_PIN_14
#define FRONT_LEFT_AIN2 GPIO_PIN_15
/*前右*/
#define FRONT_RIGHT_PWMB GPIO_PIN_1
#define FRONT_RIGHT_BIN1 GPIO_PIN_12
#define FRONT_RIGHT_BIN2 GPIO_PIN_13

typedef struct
{
    uint16_t usLater_Left_Duty; // 后左电机占空比
    uint16_t usLater_Right_Duty; // 后右电机占空比
    uint16_t usFront_Left_Duty; // 前左电机占空比
    uint16_t usFront_Right_Duty; // 前右电机占空比
    void (*Motor_Init)(void);
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
 * Date: 2023/06/24
 * description: 电机
 -----------------------------------
接线：
    后左轮：PA6 --- Timer_CH0     PA4 --- BIN1 PA5 --- BIN2
    后右轮：PA7 --- Timer_CH1     PB8 --- AIN1 PB9 --- AIN2
    前左轮：PB0 --- Timer_CH2     PB14 --- AIN1 PB15 --- AIN2
    前右轮：PB1 --- Timer_CH3     PB12 --- BIN1 PB13 --- BIN2
    STBY --- 3.3V    
 -----------------------------------
****************************************************************************/
#include "Motor.h"

/*====================================static function declaration area BEGIN====================================*/

static void Motor_Init(void);
static void Motor_Timer_Init(uint16_t arr, uint16_t psc);
static void Motor_GPIO_Init(void);

/*====================================static function declaration area   END====================================*/
Motor_t Motor = 
{
    0,
    0,
    0,
    0,
    Motor_Init
};


/*
* @function: Motor_Init
* @param: None
* @retval: None
* @brief: 电机初始化
*/
static void Motor_Init(void)
{
    Motor_GPIO_Init();
    Motor_Timer_Init(5400 - 1 , 1 - 0);    // 54000000 / 5400 / 1 = 10KHz APB1时钟是系统时钟的一半
}

/*
* @function: Motor_Timer_Init
* @param: None
* @retval: None
* @brief: 电机--定时器初始化
*/
static void Motor_Timer_Init(uint16_t arr, uint16_t psc)
{
    timer_parameter_struct myTIMER2;
    timer_oc_parameter_struct myTIMER2_OC;

    // 开启定时器时钟和复用时钟
    rcu_periph_clock_enable(RCU_TIMER2);
    gpio_init(GPIOA, GPIO_MODE_AF_PP, GPIO_OSPEED_50MHZ, LATER_LEFT_PWMB | LATER_RIGHT_PWMA);  // PA6 PA7
    gpio_init(GPIOB, GPIO_MODE_AF_PP, GPIO_OSPEED_50MHZ, FRONT_LEFT_PWMA | FRONT_RIGHT_PWMB);  // PB0 PB1
    // 结构体复位初始化
    timer_deinit(TIMER2);

    // 初始化定时器结构体
    timer_struct_para_init(&myTIMER2);
    // 预分频--psc值
    myTIMER2.prescaler = psc;
    // 对齐模式
    myTIMER2.alignedmode = TIMER_COUNTER_EDGE;
    // 计数方向--向上计数
    myTIMER2.counterdirection = TIMER_COUNTER_UP;
    // 重装载值--arr
    myTIMER2.period = arr;
    // 时钟分频因子--不分频
    myTIMER2.clockdivision = TIMER_CKDIV_DIV1;
    // 初始化
    timer_init(TIMER2,&myTIMER2);

    // 通道使能
    myTIMER2_OC.outputstate = TIMER_CCX_ENABLE;
    // 通道极性--高电平有效
    myTIMER2_OC.ocpolarity = TIMER_OC_POLARITY_HIGH;

    // ----------------通道0配置(后左)----------------
    timer_channel_output_config(TIMER2,TIMER_CH_0,&myTIMER2_OC);    // 外设TIMERx的通道输出配置
    timer_channel_output_pulse_value_config(TIMER2,TIMER_CH_0,Motor.usLater_Left_Duty); // 通道占空比设置
    timer_channel_output_mode_config(TIMER2,TIMER_CH_0,TIMER_OC_MODE_PWM0); // 通道模式---PWM0模式
    timer_channel_output_shadow_config(TIMER2,TIMER_CH_0,TIMER_OC_SHADOW_DISABLE);  // 不使用输出比较影子寄存器

    // ----------------通道1配置(后右)----------------
    timer_channel_output_config(TIMER2,TIMER_CH_1,&myTIMER2_OC);    // 外设TIMERx的通道输出配置
    timer_channel_output_pulse_value_config(TIMER2,TIMER_CH_1,Motor.usLater_Right_Duty); // 通道占空比设置   
    timer_channel_output_mode_config(TIMER2,TIMER_CH_1,TIMER_OC_MODE_PWM0); // 通道模式---PWM0模式
    timer_channel_output_shadow_config(TIMER2,TIMER_CH_1,TIMER_OC_SHADOW_DISABLE);  // 不使用输出比较影子寄存器

    // ----------------通道2配置(前左)----------------
    timer_channel_output_config(TIMER2,TIMER_CH_2,&myTIMER2_OC);    // 外设TIMERx的通道输出配置
    timer_channel_output_pulse_value_config(TIMER2,TIMER_CH_2,Motor.usFront_Left_Duty); // 通道占空比设置
    timer_channel_output_mode_config(TIMER2,TIMER_CH_2,TIMER_OC_MODE_PWM0); // 通道模式---PWM0模式
    timer_channel_output_shadow_config(TIMER2,TIMER_CH_2,TIMER_OC_SHADOW_DISABLE);  // 不使用输出比较影子寄存器

    // ----------------通道1配置(前右)----------------
    timer_channel_output_config(TIMER2,TIMER_CH_3,&myTIMER2_OC);    // 外设TIMERx的通道输出配置
    timer_channel_output_pulse_value_config(TIMER2,TIMER_CH_3,Motor.usFront_Right_Duty); // 通道占空比设置   
    timer_channel_output_mode_config(TIMER2,TIMER_CH_3,TIMER_OC_MODE_PWM0); // 通道模式---PWM0模式
    timer_channel_output_shadow_config(TIMER2,TIMER_CH_3,TIMER_OC_SHADOW_DISABLE);  // 不使用输出比较影子寄存器

    timer_enable(TIMER2);    // 使能定时器2
}

/*
* @function: Motor_GPIO_Init
* @param: None
* @retval: None
* @brief: 电机方向控制引脚初始化
*/
static void Motor_GPIO_Init(void)
{
    rcu_periph_clock_enable(RCU_GPIOA);
    rcu_periph_clock_enable(RCU_GPIOB);

    /* 后左 正转 */
    gpio_init(GPIOA,GPIO_MODE_OUT_PP,GPIO_OSPEED_50MHZ,LATER_LEFT_BIN1);  // PA4  
    gpio_init(GPIOA,GPIO_MODE_OUT_PP,GPIO_OSPEED_50MHZ,LATER_LEFT_BIN2);  // PA5 
    gpio_bit_write(GPIOA, LATER_LEFT_BIN1,RESET); 
    gpio_bit_write(GPIOA, LATER_LEFT_BIN2,SET);  

    /* 后右 正转 */
    gpio_init(GPIOB,GPIO_MODE_OUT_PP,GPIO_OSPEED_50MHZ,LATER_RIGHT_AIN1);  // PB8 
    gpio_init(GPIOB,GPIO_MODE_OUT_PP,GPIO_OSPEED_50MHZ,LATER_RIGHT_AIN2);  // PB9 
    gpio_bit_write(GPIOB, LATER_RIGHT_AIN1,RESET); 
    gpio_bit_write(GPIOB, LATER_RIGHT_AIN2,SET);  

    /* 前左 正转 */
    gpio_init(GPIOB,GPIO_MODE_OUT_PP,GPIO_OSPEED_50MHZ,FRONT_LEFT_AIN1);  // PA4  
    gpio_init(GPIOB,GPIO_MODE_OUT_PP,GPIO_OSPEED_50MHZ,FRONT_LEFT_AIN2);  // PA5 
    gpio_bit_write(GPIOB, FRONT_LEFT_AIN1,SET); 
    gpio_bit_write(GPIOB, FRONT_LEFT_AIN2,RESET);  

    /* 前右 正转 */
    gpio_init(GPIOB,GPIO_MODE_OUT_PP,GPIO_OSPEED_50MHZ,FRONT_RIGHT_BIN1);  // PB8 
    gpio_init(GPIOB,GPIO_MODE_OUT_PP,GPIO_OSPEED_50MHZ,FRONT_RIGHT_BIN2);  // PB9
    gpio_bit_write(GPIOB, FRONT_RIGHT_BIN1,SET); 
    gpio_bit_write(GPIOB, FRONT_RIGHT_BIN2,RESET);        
}
```

{% endfolding %}

{% folding, Key.h %}

```cpp
/*
 * @description: 按键功能执行
 * @return {*}
 * @Date: 2023-05-09 09:59:38
 */
// 按键功能执执行
void vKEY_Comply_Function(void)
{
    static uint8_t Flag;
    if(MyKey.Key_Down_State[0])
    {
        MyKey.Key_Down_State[0] = 0;

        switch(Flag)
        {
            case 0:
            {
                Motor.usLater_Left_Duty = 2700; // 50%
                Motor.usLater_Right_Duty = 2700;
                Motor.usFront_Left_Duty = 2700;
                Motor.usFront_Right_Duty = 2700;                
                Flag = 1;
                break;
            }
            case 1:
            {
                Motor.usLater_Left_Duty = 2160; // 40%
                Motor.usLater_Right_Duty = 2160;
                Motor.usFront_Left_Duty = 2160;
                Motor.usFront_Right_Duty = 2160;                    
                Flag = 2;
                break;
            }
            case 2:
            {
                Motor.usLater_Left_Duty = 1620; // 30%
                Motor.usLater_Right_Duty = 1620;
                Motor.usFront_Left_Duty = 1620;
                Motor.usFront_Right_Duty = 1620;                
                Flag = 3;
                break;
            }
            case 3:
            {
                Motor.usLater_Left_Duty = 1080; // 20%
                Motor.usLater_Right_Duty = 1080;
                Motor.usFront_Left_Duty = 1080;
                Motor.usFront_Right_Duty = 1080;                
                Flag = 4;
                break;
            } 
            case 4:
            {
                Motor.usLater_Left_Duty = 540; // 10%
                Motor.usLater_Right_Duty = 540;
                Motor.usFront_Left_Duty = 540;
                Motor.usFront_Right_Duty = 540;                
                Flag = 5;
                break;
            }
            case 5: // 0%
            {
                Motor.usLater_Left_Duty = 0;
                Motor.usLater_Right_Duty = 0;
                Motor.usFront_Left_Duty = 0;
                Motor.usFront_Right_Duty = 0;                
                Flag = 0;
                break;
            }
            default : Flag = 0;break;                                               
        }     
        // 调整速度
        timer_channel_output_pulse_value_config(TIMER2,TIMER_CH_0,Motor.usLater_Left_Duty);
        timer_channel_output_pulse_value_config(TIMER2,TIMER_CH_1,Motor.usLater_Right_Duty);
        timer_channel_output_pulse_value_config(TIMER2,TIMER_CH_2,Motor.usFront_Left_Duty);
        timer_channel_output_pulse_value_config(TIMER2,TIMER_CH_3,Motor.usFront_Right_Duty);        
    }
}
```

{% endfolding %}







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

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/d353c456db466935c48270065431af21.webp)

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





## PID学习

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

