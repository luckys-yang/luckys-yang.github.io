---
title: I2C时序笔记
cover: /img/num115.webp
comments: false
katex: true
tags:
  - I2C
  - 时序
categories:
  - 单片机知识
abbrlink: '30211493'
---



## I2C时序讲解

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/1c9cd74609b44308b4c968c47fb2563f.webp)

$I^2C$由数据线 `SDA` 和时钟线 `SCL` 构成的**串行总线**，可发送和接收数据，两条线必须通过 `上拉电路连接至正电源` ，数据传输只能 `在总线不忙时启动`

 $I^2C$  通信分为 低速模式 100kbit/s 、快速模式 400kbit/s 和高速模式3.4Mbit/s 。因为所有的 $I^2C$ 器件都支持低速，但却未必支持另外两种速度，所以作为通用的$I^2C$程序我们选择 100k 这个速率来实现，也就是说实际程序产生的时序必须 `小于等于100k` 的时序参数，也就是 `高低电平的保持时间需要大于等于4.7us(一般我们取5us)`



{% note blue 'fas fa-fan' flat %}通用函数{% endnote %}

```cpp
//SDA线输出一个位
void SDA_Output(uint16_t val)
{
    if(val)
    {
        GPIOB->BSRR |= GPIO_PIN_7;	//引脚置高
    }
    else
    {
        GPIOB->BRR |= GPIO_PIN_7;	//引脚置低
    }
}

//SCL线输出一个位
void SCL_Output(uint16_t val)
{
    if(val)
    {
        GPIOB->BSRR |= GPIO_PIN_6;	//引脚置高
    }
    else
    {
        GPIOB->BSRR |= GPIO_PIN_6;	//引脚置低
    }
}

//SDA输入一个位
uint8_t SDA_Input(void)
{
    if(HAL_GPIO_ReadPin(GPIOB,GPIO_PIN_7) == GPIO_PIN_SET)	//读取是不是高电平
    {
        return 1;	//是则返回1
    }
    else
    {
        return 0;	//不是则返回0
    }
}

//短暂延时
static void delay1(unsigned int n)
{
    uint32_t i;
    for ( i = 0; i < n; ++i);
}

//SDA线输入模式配置
void SDA_Input_Mode()
{
    GPIO_InitTypeDef GPIO_InitStructure = {0};

    GPIO_InitStructure.Pin = GPIO_PIN_7;
    GPIO_InitStructure.Mode = GPIO_MODE_INPUT;
    GPIO_InitStructure.Pull = GPIO_PULLUP;
    GPIO_InitStructure.Speed = GPIO_SPEED_FREQ_HIGH;
    HAL_GPIO_Init(GPIOB, &GPIO_InitStructure);
}

//SDA线输出模式配置
void SDA_Output_Mode()
{
    GPIO_InitTypeDef GPIO_InitStructure = {0};

    GPIO_InitStructure.Pin = GPIO_PIN_7;
    GPIO_InitStructure.Mode = GPIO_MODE_OUTPUT_OD;
    GPIO_InitStructure.Pull = GPIO_NOPULL;
    GPIO_InitStructure.Speed = GPIO_SPEED_FREQ_HIGH;
    HAL_GPIO_Init(GPIOB, &GPIO_InitStructure);
}
```



{% note blue 'fas fa-fan' flat %}开始/停止信号{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96/202204012221630.png)

数据线和时钟线在总线 `不忙时保持高电平`

SCL 线为 `高电平` 期间，SDA 线由 `高电平向低电平的变化` 表示起始信号；SCL线为高电平期间，SDA 线由 `低电平向高电平的变化` 表示终止信号

`起始和终止信号都是由主机发出的`，在起始信号产生后，总线就处于 `被占用` 的状态；在终止信号产生后，总线就处于 `空闲` 状态

```cpp
//I2C开始信号
void I2CStart(void)
{
    SDA_Output(1);	//拉高
    delay_us(5);
    SCL_Output(1);	//拉高
    delay_us(5);
    SDA_Output(0);	//先拉低
    delay_us(5);
    SCL_Output(0);	//再拉低
    delay_us(5);
}
```

```cpp
//停止信号
void I2CStop(void)
{
    SCL_Output(0);	//拉低
    delay_us(5);
    SDA_Output(0);	//拉低
    delay_us(5);
    SCL_Output(1);	//拉高
    delay_us(5);
    SDA_Output(1);	//拉高
    delay_us(5);    
}
```

{% note blue 'fas fa-fan' flat %}等待ACK应答{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230204222139.webp)

- 调整了I2CWaitACK函数里的代码位置：`SDA_output_Mode ()` 放在最后

-  每当主机向从机发送完一个字节的数据，主机总是需要等待从机发出一个应答信号，以检验从机是否成功接收到了数据


```cpp
//I2C等待应答信号
unsigned char I2CWaitAck(void)
{
    unsigned short cErrTime = 5;
    SDA_Input_Mode();	//设置为输入模式
    delay1(DELAY_TIME);
    SCL_Output(1);	//拉高
    delay1(DELAY_TIME);
    while(SDA_Input())	//等待SDA输入为0
    {
        cErrTime--;
        delay1(DELAY_TIME);
        if (0 == cErrTime)	//超时则强制退出返回ERROR
        {
            SDA_Output_Mode();	//SDA变为输出模式
            I2CStop();	//停止信号
            return ERROR;	//无应答
        }
    }
    SCL_Output(0);	//拉低
    delay1(DELAY_TIME);
    SDA_Output_Mode();	//设置为输出模式
    return SUCCESS;	//应答
}
```



{% note blue 'fas fa-fan' flat %}发送ACK应答/不应答{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96/202205021946917.jpg)

```cpp
//I2C发送确认信号
void I2CSendAck(void)
{
    SDA_Output(0);	//SDA为低电平发送应答ACK
    delay1(DELAY_TIME);
    delay1(DELAY_TIME);
    SCL_Output(1);	//SCL一高一低发送一位数据
    delay1(DELAY_TIME);
    SCL_Output(0);
    delay1(DELAY_TIME);
}

//I2C发送非确认信号

void I2CSendNotAck(void)
{
    SDA_Output(1);	//SDA为高电平发送非应答NACK
    delay1(DELAY_TIME);
    delay1(DELAY_TIME);
    SCL_Output(1);
    delay1(DELAY_TIME);
    SCL_Output(0);
    delay1(DELAY_TIME);

}
```

{% note blue 'fas fa-fan' flat %}发送1字节{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230206152558.webp)

- 发送数据，发送8次数据，如果数据为1,显然SDA是被拉高;如果数据为0，那么SDA被拉低，先传输数据的最高位，再传输数据的最低位
- `SDA_Input_Mode()` 函数：函数每次接收过来的都是一个字节，而通过 `&0x80` 就会保留最高位的数据，舍弃后七位的数据，也就是说，通过这个操作之后，就只有1位数据被保存了下来，然后通过 `cSendByte += cSendByte;` 将这一位数据进行加法计算，这可以看作是这一位数据的左移运算

```cpp
void I2CSendByte(unsigned char cSendByte)
{
    unsigned char  i = 8;//传输8位 1个字节
    while (i--)
    {
        SCL_Output(0);	//拉低
        delay1(DELAY_TIME);
        SDA_Output(cSendByte & 0x80);//SDA输出cSendByte最高位
        delay1(DELAY_TIME);
        cSendByte += cSendByte;//实现数据左移1位 效果与cSendByte<<1相同
        delay1(DELAY_TIME);
        SCL_Output(1);	//拉高 发送数据
        delay1(DELAY_TIME);
    }
    SCL_Output(0);	//拉低 发送完成
    delay1(DELAY_TIME);
}
```

{% note blue 'fas fa-fan' flat %}接收1字节{% endnote %}

```cpp
unsigned char I2CReceiveByte(void)
{
    unsigned char i = 8;
    unsigned char cR_Byte = 0;
    SDA_Input_Mode();//SDA变为输入模式 开始读数据
    while (i--)
    {
        cR_Byte += cR_Byte;//读入的数据左移一位
        SCL_Output(0);
        delay1(DELAY_TIME);
        delay1(DELAY_TIME);
        SCL_Output(1);
        delay1(DELAY_TIME);
        cR_Byte |=  SDA_Input();//将读入的数据的值给要返回的数cR_Byte 
    }
    SCL_Output(0);
    delay1(DELAY_TIME);
    SDA_Output_Mode();//SDA变为默认的输出模式 停止读数据
    return cR_Byte;
}
```

