---
title: KST-51之课程实训
cover: /img/num141.webp
categories:
  - 51系列
comments: false
abbrlink: a736b997
date: 2023-06-20 23:36:06
---



> 51单片机实训周要求是搞个密码锁，还好不算复杂，但是太久没碰51了有点生疏(一开始模块化得好好地写到一半内存炸了，搞得浪费一天时间)，最后只能赶时间半天时间在例程上修改，整理，虽然没有完全模块化但是也部分模块化，最后测试了功能都是正常的



- 要求

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230620234947.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230620234837.webp)

{% endgallery %}



- 程序编写

{% folding, eeprom.c %}

```cpp
/***************************************************************************
 * File: eeprom.c
 * Author: Luckys.
 * Date: 2023/06/19
 * description: EEPROM
 ****************************************************************************/
#include <reg52.h>

/*====================================variable definition declaration area BEGIN===================================*/

extern void I2CStart();
extern void I2CStop();
extern unsigned char I2CReadACK();
extern unsigned char I2CReadNAK();
extern bit I2CWrite(unsigned char dat);

/*====================================variable definition declaration area   END===================================*/


/*
* @function: EEPROM_Read
* @param: buf -- 数据接收指针，addr -- E2中的起始地址，len -- 读取长度
* @retval: None
* @brief: 读取函数
*/
void EEPROM_Read(unsigned char *buf, unsigned char addr, unsigned char len)
{
    do
    { // 用寻址操作查询当前是否可进行读写操作
        I2CStart();
        if (I2CWrite(0x50 << 1)) // 应答则跳出循环，非应答则进行下一次查询
        {
            break;
        }
        I2CStop();
    } while (1);
    I2CWrite(addr);               // 写入起始地址
    I2CStart();                   // 发送重复启动信号
    I2CWrite((0x50 << 1) | 0x01); // 寻址器件，后续为读操作
    while (len > 1)               // 连续读取len-1个字节
    {
        *buf++ = I2CReadACK(); // 最后字节之前为读取操作+应答
        len--;
    }
    *buf = I2CReadNAK(); // 最后一个字节为读取操作+非应答
    I2CStop();
}

/*
* @function: EEPROM_Write
* @param: buf -- 数据写入指针，addr -- E2中的起始地址，len -- 读取长度
* @retval: None
* @brief: 写入函数
*/
void EEPROM_Write(unsigned char *buf, unsigned char addr, unsigned char len)
{
    while (len > 0)
    {
        // 等待上次写入操作完成
        do
        { // 用寻址操作查询当前是否可进行读写操作
            I2CStart();
            if (I2CWrite(0x50 << 1)) // 应答则跳出循环，非应答则进行下一次查询
            {
                break;
            }
            I2CStop();
        } while (1);
        // 按页写模式连续写入字节
        I2CWrite(addr); // 写入起始地址
        while (len > 0)
        {
            I2CWrite(*buf++);       // 写入一个字节数据
            len--;                  // 待写入长度计数递减
            addr++;                 // E2地址递增
            if ((addr & 0x07) == 0) // 检查地址是否到达页边界，24C02每页8字节，
            {                       // 所以检测低3位是否为零即可
                break;              // 到达页边界时，跳出循环，结束本次写操作
            }
        }
        I2CStop();
    }
}
```

{% endfolding %}

{% folding, i2c.c %}

```cpp
/***************************************************************************
 * File: i2c.c
 * Author: Luckys.
 * Date: 2023/06/19
 * description: 描述
****************************************************************************/
#include <reg52.h>
#include <intrins.h>

/*====================================variable definition declaration area BEGIN===================================*/

#define I2CDelay() \
    {              \
        _nop_();   \
        _nop_();   \
        _nop_();   \
        _nop_();   \
    }
    
sbit I2C_SCL = P3 ^ 7;
sbit I2C_SDA = P3 ^ 6;

/*====================================variable definition declaration area   END===================================*/



/* 产生总线起始信号 */
void I2CStart()
{
    I2C_SDA = 1; // 首先确保SDA、SCL都是高电平
    I2C_SCL = 1;
    I2CDelay();
    I2C_SDA = 0; // 先拉低SDA
    I2CDelay();
    I2C_SCL = 0; // 再拉低SCL
}
/* 产生总线停止信号 */
void I2CStop()
{
    I2C_SCL = 0; // 首先确保SDA、SCL都是低电平
    I2C_SDA = 0;
    I2CDelay();
    I2C_SCL = 1; // 先拉高SCL
    I2CDelay();
    I2C_SDA = 1; // 再拉高SDA
    I2CDelay();
}
/* I2C总线写操作，dat-待写入字节，返回值-从机应答位的值 */
bit I2CWrite(unsigned char dat)
{
    bit ack;            // 用于暂存应答位的值
    unsigned char mask; // 用于探测字节内某一位值的掩码变量

    for (mask = 0x80; mask != 0; mask >>= 1) // 从高位到低位依次进行
    {
        if ((mask & dat) == 0) // 该位的值输出到SDA上
            I2C_SDA = 0;
        else
            I2C_SDA = 1;
        I2CDelay();
        I2C_SCL = 1; // 拉高SCL
        I2CDelay();
        I2C_SCL = 0; // 再拉低SCL，完成一个位周期
    }
    I2C_SDA = 1; // 8位数据发送完后，主机释放SDA，以检测从机应答
    I2CDelay();
    I2C_SCL = 1;   // 拉高SCL
    ack = I2C_SDA; // 读取此时的SDA值，即为从机的应答值
    I2CDelay();
    I2C_SCL = 0; // 再拉低SCL完成应答位，并保持住总线

    return (~ack); // 应答值取反以符合通常的逻辑：
                   // 0=不存在或忙或写入失败，1=存在且空闲或写入成功
}
/* I2C总线读操作，并发送非应答信号，返回值-读到的字节 */
unsigned char I2CReadNAK()
{
    unsigned char mask;
    unsigned char dat;

    I2C_SDA = 1;                             // 首先确保主机释放SDA
    for (mask = 0x80; mask != 0; mask >>= 1) // 从高位到低位依次进行
    {
        I2CDelay();
        I2C_SCL = 1;      // 拉高SCL
        if (I2C_SDA == 0) // 读取SDA的值
            dat &= ~mask; // 为0时，dat中对应位清零
        else
            dat |= mask; // 为1时，dat中对应位置1
        I2CDelay();
        I2C_SCL = 0; // 再拉低SCL，以使从机发送出下一位
    }
    I2C_SDA = 1; // 8位数据发送完后，拉高SDA，发送非应答信号
    I2CDelay();
    I2C_SCL = 1; // 拉高SCL
    I2CDelay();
    I2C_SCL = 0; // 再拉低SCL完成非应答位，并保持住总线

    return dat;
}
/* I2C总线读操作，并发送应答信号，返回值-读到的字节 */
unsigned char I2CReadACK()
{
    unsigned char mask;
    unsigned char dat;

    I2C_SDA = 1;                             // 首先确保主机释放SDA
    for (mask = 0x80; mask != 0; mask >>= 1) // 从高位到低位依次进行
    {
        I2CDelay();
        I2C_SCL = 1;      // 拉高SCL
        if (I2C_SDA == 0) // 读取SDA的值
            dat &= ~mask; // 为0时，dat中对应位清零
        else
            dat |= mask; // 为1时，dat中对应位置1
        I2CDelay();
        I2C_SCL = 0; // 再拉低SCL，以使从机发送出下一位
    }
    I2C_SDA = 0; // 8位数据发送完后，拉低SDA，发送应答信号
    I2CDelay();
    I2C_SCL = 1; // 拉高SCL
    I2CDelay();
    I2C_SCL = 0; // 再拉低SCL完成应答位，并保持住总线

    return dat;
}
```

{% endfolding %}

{% folding, infrared.c %}

```cpp
#include "main.h"

/*====================================variable definition declaration area BEGIN===================================*/
// 红外接收缓存数组
uint8_t Infrared_RX_Buff[4] = {0};  
// 红外键码到标准PC键码的映射表
const uint8_t code Infrered_CodeMap[][2] = {  
    {0x45,0x00}, {0x46,0x00}, {0x47,0x1B}, //开关->无  Mode->无   静音->ESC
    {0x44,0x00}, {0x40,0x25}, {0x43,0x27}, //播放->无  后退->向左 前进->向右
    {0x07,0x00}, {0x15,0x28}, {0x09,0x26}, // EQ->无   减号->向下 加号->向上
    {0x16, '0'}, {0x19,0x1B}, {0x0D,0x0D}, //'0'->'0'  箭头->ESC  U/SD->回车
    {0x0C, '1'}, {0x18, '2'}, {0x5E, '3'}, //'1'->'1'  '2'->'2'   '3'->'3'
    {0x08, '4'}, {0x1C, '5'}, {0x5A, '6'}, //'4'->'4'  '5'->'5'   '6'->'6'
    {0x42, '7'}, {0x52, '8'}, {0x4A, '9'}, //'7'->'7'  '6'->'8'   '9'->'9'
};

/*====================================variable definition declaration area   END===================================*/

/*====================================static function declaration area BEGIN====================================*/

void Infrared_Init(void);    // 红外接收初始化
uint16_t Infrared_Get_High_Time(void);      // 获取当前高电平的持续时间
uint16_t Infrared_Get_Low_Time(void);    // 获取当前低电平的持续时间
void Infrared_Handler(void); // 红外接收函数处理

extern void KeyAction(uint8_t keycode);
/*====================================static function declaration area   END====================================*/

/*
* @function: Infrared_Init
* @param: None
* @retval: None
* @brief: 红外接收初始化
*/
void Infrared_Init(void)
{
    INFRARED_INPUT = 1;  // 确保红外接收引脚被释放

    TMOD &= 0x0F;  // 清零T1的控制位
    TMOD |= 0x10;  // 配置T1为模式1
    TR1 = 0;       // 停止T1计数
    ET1 = 0;       // 禁止T1中断 

    IT1 = 1;       // 设置INT1为负边沿触发
    EX1 = 1;       // 使能INT1中断 
}

/*
* @function: Infrared_Get_High_Time
* @param: None
* @retval: None
* @brief: 获取当前高电平的持续时间
*/
uint16_t Infrared_Get_High_Time(void)
{
    TH1 = 0; // 清零T1计数初值
    TL1 = 0;
    TR1 = 1;         // 启动T1计数
    while (INFRARED_INPUT) // 红外输入引脚为1时循环检测等待，变为0时则结束本循环
    {
        // 当T1计数值大于0x4000，即高电平持续时间超过约18ms时，
        if (TH1 >= 0x40)
        {          
            break; // 强制退出循环，是为了避免信号异常时，程序假死在这里。
        }
    }
    TR1 = 0; // 停止T1计数

    return (TH1 * 256 + TL1); // T1计数值合成为16bit整型数，并返回该数
}

/*
* @function: Infrared_Get_Low_Time
* @param: None
* @retval: None
* @brief: 获取当前低电平的持续时间
*/
uint16_t Infrared_Get_Low_Time(void)
{
    TH1 = 0; // 清零T1计数初值
    TL1 = 0;
    TR1 = 1;          // 启动T1计数
    while (!INFRARED_INPUT) // 红外输入引脚为0时循环检测等待，变为1时则结束本循环
    {
        // 当T1计数值大于0x4000，即低电平持续时间超过约18ms时，
        if (TH1 >= 0x40)
        {          
            break; // 强制退出循环，是为了避免信号异常时，程序假死在这里。
        }
    }
    TR1 = 0; // 停止T1计数

    return (TH1 * 256 + TL1); // T1计数值合成为16bit整型数，并返回该数
}

/*
* @function: Infrared_Handler
* @param: None
* @retval: None
* @brief: 红外接收函数处理
*/
void Infrared_Handler(void)
{
    uint8_t i;

    if (Parameter.Infrared_RX_Flag)
    {
        for (i = 0; i < sizeof(Infrered_CodeMap)/sizeof(Infrered_CodeMap[0]); i++) //遍历映射表
        {
            if ((Infrared_RX_Buff[2]) == Infrered_CodeMap[i][0])  //在表中找到当前接收的键码后，
            {                                  //用对应的映射码执行函数调度，
                (KeyAction(Infrered_CodeMap[i][1]));    //直接调用按键动作函数即可。
                break;
            }
        }        
        Parameter.Infrared_RX_Flag = FALSE;
    }
}
```

{% endfolding %}

{% folding, key.c %}

```cpp
/***************************************************************************
 * File: key.c
 * Author: Luckys.
 * Date: 2023/06/19
 * description: 
****************************************************************************/
#include <reg52.h>

sbit KEY_IN_1  = P2^4;
sbit KEY_IN_2  = P2^5;
sbit KEY_IN_3  = P2^6;
sbit KEY_IN_4  = P2^7;
sbit KEY_OUT_1 = P2^3;
sbit KEY_OUT_2 = P2^2;
sbit KEY_OUT_3 = P2^1;
sbit KEY_OUT_4 = P2^0;

unsigned char code KeyCodeMap[4][4] = { //矩阵按键编号到标准键盘键码的映射表
    { '1',  '2',  '3', 0x26 }, //数字键1、数字键2、数字键3、向上键
    { '4',  '5',  '6', 0x25 }, //数字键4、数字键5、数字键6、向左键
    { '7',  '8',  '9', 0x28 }, //数字键7、数字键8、数字键9、向下键
    { '0', 0x1B, 0x0D, 0x27 }  //数字键0、ESC键、  回车键、 向右键
};
unsigned char pdata KeySta[4][4] = {  //全部矩阵按键的当前状态
    {1, 1, 1, 1},  {1, 1, 1, 1},  {1, 1, 1, 1},  {1, 1, 1, 1}
};

extern void KeyAction(unsigned char keycode);

/* 按键驱动函数，检测按键动作，调度相应动作函数，需在主循环中调用 */
void Key_Handler()
{
    unsigned char i, j;
    static unsigned char pdata backup[4][4] = {  //按键值备份，保存前一次的值
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
    keyout++;         //输出索引递增
    keyout &= 0x03;   //索引值加到4即归零
    switch (keyout)   //根据索引，释放当前输出引脚，拉低下次的输出引脚
    {
        case 0: KEY_OUT_4 = 1; KEY_OUT_1 = 0; break;
        case 1: KEY_OUT_1 = 1; KEY_OUT_2 = 0; break;
        case 2: KEY_OUT_2 = 1; KEY_OUT_3 = 0; break;
        case 3: KEY_OUT_3 = 1; KEY_OUT_4 = 0; break;
        default: break;
    }
}

```

{% endfolding %}

{% folding, lcd1602.c %}

```cpp
/***************************************************************************
 * File: lcd1602.c
 * Author: Luckys.
 * Date: 2023/06/19
 * description: 
****************************************************************************/
#include "main.h"

/*====================================variable definition declaration area BEGIN===================================*/

uint8_t Pin_Status_Temp_Arr[3]; // 存储状态

/*====================================variable definition declaration area   END===================================*/

/*====================================extern area BEGIN===================================*/

extern void FillMemory(uint8_t *dest, uint8_t byt, uint8_t len);

/*====================================extern area   END===================================*/

/*====================================static function declaration area BEGIN====================================*/

static void Led_Pin_Pause(void);    // 暂停LED相关引脚的值
static void Led_Pin_Recover(void);  // 恢复LED相关引脚的值

/*====================================static function declaration area   END====================================*/

/* 等待液晶准备好 */
void LcdWaitReady()
{
    unsigned char sta;

    LCD1602_DB = 0xFF;
    LCD1602_RS = 0;
    LCD1602_RW = 1;
    do
    {
        LCD1602_E = 1;
        sta = LCD1602_DB; // 读取状态字
        LCD1602_E = 0;
    } while (sta & 0x80); // bit7等于1表示液晶正忙，重复检测直到其等于0为止
}

/* 向LCD1602液晶写入一字节命令，cmd-待写入命令值 */
void LcdWriteCmd(unsigned char cmd)
{
    Led_Pin_Pause();    // 暂停状态
    LcdWaitReady();
    LCD1602_RS = 0;
    LCD1602_RW = 0;
    LCD1602_DB = cmd;
    LCD1602_E = 1;
    LCD1602_E = 0;
    Led_Pin_Recover();  // 打开状态
}

/* 向LCD1602液晶写入一字节数据，dat-待写入数据值 */
void LcdWriteDat(unsigned char dat)
{
    Led_Pin_Pause();    // 暂停状态
    LcdWaitReady();
    LCD1602_RS = 1;
    LCD1602_RW = 0;
    LCD1602_DB = dat;
    LCD1602_E = 1;
    LCD1602_E = 0;
    Led_Pin_Recover();  // 打开状态
}

/* 设置显示RAM起始地址，亦即光标位置，(x,y)-对应屏幕上的字符坐标 */
void LcdSetCursor(unsigned char x, unsigned char y)
{
    unsigned char addr;

    if (y == 0)          // 由输入的屏幕坐标计算显示RAM的地址
        addr = 0x00 + x; // 第一行字符地址从0x00起始
    else
        addr = 0x40 + x;      // 第二行字符地址从0x40起始
    LcdWriteCmd(addr | 0x80); // 设置RAM地址
}

/* 在液晶上显示字符串，(x,y)-对应屏幕上的起始坐标，str-字符串指针 */
void LcdShowStr(unsigned char x, unsigned char y, unsigned char *str)
{
    LcdSetCursor(x, y);  // 设置起始地址
    while (*str != '\0') // 连续写入字符串数据，直到检测到结束符
    {
        LcdWriteDat(*str++);
    }
}

/* 清屏 */
void LcdClearScreen()
{
    LcdWriteCmd(0x01);
}

/* 初始化1602液晶 */
void InitLcd1602()
{
    LcdWriteCmd(0x38); // 16*2显示，5*7点阵，8位数据接口
    LcdWriteCmd(0x0C); // 显示器开，光标关闭
    LcdWriteCmd(0x06); // 文字不动，地址自动+1
    LcdWriteCmd(0x01); // 清屏
}

/* 在液晶上显示与当前输入密码位数相同的*，以指示当前输入的密码位数（不会超过屏幕宽度） */
void ShowPswCnt()
{
    unsigned char buf[LCD_LONG];
    if (Parameter.ucPassword_Cnt > 16)
    {
        return;
    }
    FillMemory(buf, '*', Parameter.ucPassword_Cnt);
    FillMemory(buf + Parameter.ucPassword_Cnt, '\0', sizeof(buf) - Parameter.ucPassword_Cnt);
    LcdShowStr(0, 1, buf);
}

/********************************************LED部分***************************************/

/*
* @function: Led_Pin_Pause
* @param: None
* @retval: None
* @brief: 暂停LED相关引脚的值
*/
static void Led_Pin_Pause(void)
{
    ENLED = 1;  // 停止
    Pin_Status_Temp_Arr[0] = LED_PORT;
    Pin_Status_Temp_Arr[1] = ADDR0;
    Pin_Status_Temp_Arr[2] = ADDR1;    
}

/*
* @function: Led_Pin_Pause
* @param: None
* @retval: None
* @brief: 恢复LED相关引脚的值
*/
static void Led_Pin_Recover(void)
{
    ADDR0 = Pin_Status_Temp_Arr[1];
    ADDR1 = Pin_Status_Temp_Arr[2];  
    LED_PORT = Pin_Status_Temp_Arr[0];  
    ENLED = 0;  // 开启
}

/*
* @function: Led_Init
* @param: None
* @retval: None
* @brief: LED初始化
*/
void Led_Init(void)
{
    /*Enable 74HC138 IC ---- Y6' */
	ENLED = 0;
	ADDR0 = 0;
	ADDR1 = 1;
	ADDR2 = 1;
	ADDR3 = 1;

    LED_PORT = 0xFF;    // 初始化全灭
}

/*
* @function: Led_Flip
* @param: LEDx -> x:1~8
* @retval: None
* @brief: LED翻转
*/
void Led_Flip(Led_Num_t LEDx)
{
    switch(LEDx)
    {
        case LED1: LED1_PIN = ~LED1_PIN;break;
        case LED2: LED2_PIN = ~LED2_PIN;break;
        case LED3: LED3_PIN = ~LED3_PIN;break;
        case LED4: LED4_PIN = ~LED4_PIN;break;
        case LED5: LED5_PIN = ~LED5_PIN;break;
        case LED6: LED6_PIN = ~LED6_PIN;break;
        case LED7: LED7_PIN = ~LED7_PIN;break;
        case LED8: LED8_PIN = ~LED8_PIN;break;
        default:LED_PORT = 0xFF;
    } 
}

/********************************************蜂鸣器部分***************************************/
/*
* @function: Buzzer_ON
* @param: None
* @retval: None
* @brief: 蜂鸣器打开
*/
void Buzzer_ON(void)
{
    Parameter.Buzzer_Start_Flag = TRUE;
}
```

{% endfolding %}

{% folding, other.c %}

```cpp
/***************************************************************************
 * File: other.c
 * Author: Luckys.
 * Date: 2023/06/19
 * description: 
****************************************************************************/
#include "main.h"

/*====================================function declaration area BEGIN===================================*/

void FillMemory(uint8_t *dest, uint8_t byt, uint8_t len);   // 用一个指定字节填充一段内存
void CopyMemory(uint8_t *dest, uint8_t *src, uint8_t len);  // 将一段内存数据拷贝到另一处
bit CmpMemory(uint8_t *ptr1, uint8_t *ptr2, uint8_t len);   // 内存比较函数，比较两个指针所指向的内存数据是否相同
uint8_t GetChkSum(uint8_t *dat, uint8_t len);
void SavePassword(void);    // 将当前的密码数据保存到EEPROM中，同时添加校验字节
bit ReadPassword(); // 从EEPROM中读取保存的密码数据，并对密码进行“累加和”校验
uint8_t find_substring(char *arr1, char *arr2, uint8_t len2);   // 模糊查找
uint8_t Add_Symbol(uint8_t *arr,uint8_t Now_Len);   // 末尾添加 '@' 凑够实际密码长度的最大值
void KeyAction(uint8_t keycode);    // 按键动作函数，根据键码执行相应的操作，keycode
void Clear_Cache(void); // 清除缓存
uint8_t Compare_And_Save(void); // 比较+保存
void System_MS_Delay(uint16_t ms);  // 延时

/*====================================function declaration area   END===================================*/

/*====================================extern declaration area BEGIN===================================*/

extern void EEPROM_Write(unsigned char *buf, unsigned char addr, unsigned char len);
extern void EEPROM_Read(unsigned char *buf, unsigned char addr, unsigned char len);
extern void KeyNumAction(uint8_t keycode);
extern void LcdClearScreen();
extern void KeyEnterAction();
extern void KeyEscAction();
/*====================================extern  declaration area   END===================================*/


/* 用一个指定字节填充一段内存，dest-目的地址，byt-填充用字节，len-数据长度 */
void FillMemory(uint8_t *dest, uint8_t byt, uint8_t len)
{
    while (len--)
    {
        *dest++ = byt;
    }
}

/* 将一段内存数据拷贝到另一处，dest-目的地址，src-源地址，len-数据长度 */
void CopyMemory(uint8_t *dest, uint8_t *src, uint8_t len)
{
    while (len--)
    {
        *dest++ = *src++;
    }
}

/* 内存比较函数，比较两个指针所指向的内存数据是否相同，
   ptr1-待比较指针1，ptr2-待比较指针2，len-待比较长度
   返回值-两段内存数据完全相同时返回1，不同返回0 */
bit CmpMemory(uint8_t *ptr1, uint8_t *ptr2, uint8_t len)
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

/* 将一段数据按字节累加，返回获得的累加和，dat-数据指针，len-数据长度 */
uint8_t GetChkSum(uint8_t *dat, uint8_t len)
{
    uint8_t sum = 0;

    while (len--)
    {
        sum += *dat++;
    }
    return sum;
}

/* 将当前的密码数据保存到EEPROM中，同时添加校验字节 */
void SavePassword(void)
{
    uint8_t buf[PWD_IN_MAX_LEN + 1];

    CopyMemory(buf, ucUser_Pwd_Buff, PWD_IN_MAX_LEN);  //复制密码数据到缓冲区中
    buf[PWD_IN_MAX_LEN] = ~GetChkSum(buf, PWD_IN_MAX_LEN);  //填充最后的累加和校验字节
    EEPROM_Write(buf, PWD_SAVE_ADDR, PWD_IN_MAX_LEN + 1); //将密码数据保存到EEPROM中
}

/* 从EEPROM中读取保存的密码数据，并对密码进行“累加和”校验，
   返回值-校验通过返回1，否则返回0 */
bit ReadPassword()
{
    uint8_t sum;
    uint8_t buf[PWD_IN_MAX_LEN + 1];

    EEPROM_Read(buf, PWD_SAVE_ADDR, PWD_IN_MAX_LEN + 1); //读取密码数据和校验字节
    sum = GetChkSum(buf, PWD_IN_MAX_LEN); //计算密码数据的累加和
    if (buf[PWD_IN_MAX_LEN] == ~sum)      //校验通过，即密码有效时，拷贝密码
    {
        CopyMemory(ucUser_Pwd_Buff, buf, PWD_IN_MAX_LEN);
        return 1;
    }
    else  //密码数据无效时，缓冲区默认成全0
    {
        FillMemory(ucUser_Pwd_Buff, '\0', PWD_IN_MAX_LEN);
        return 0;
    }
}

// 模糊查找
uint8_t find_substring(char *arr1, char *arr2, uint8_t len2)
{
    uint8_t pos1 = 0; // 当前匹配到的位置
    uint8_t pos2 = 0; // 下一个需要匹配的位置
    uint8_t i, len1 = 0;

    // 计算长度,去除'@'
    for (i = 0; i < 10; i++)
    {
        if (arr1[i] != '@')
        {
            ++len1;
        }
    }
    for (i = 0; i < len2; i++)
    {
		// // 如果当前的字符匹配上了，就继续匹配后面的字符是否相等
        if (arr1[pos1] == arr2[i])
        {
            pos2 = pos1 + 1;
            while ((pos2 < len1) && (i < len2) && (arr1[pos2] == arr2[i + 1]))
            {
                i++;	// 匹配成功，arr2的下标往后移动一位
                pos2++;	// 匹配成功，pos2的下标往后移动一位
            }
            if (pos2 == len1)
            {
                return 1; // 找到了
            }
        }
        else
        {
            pos1 = 0;	// 从头开始匹配
        }
    }

    return 0; // 没有找到
}

// 末尾添加@凑够10个
uint8_t Add_Symbol(uint8_t *arr,uint8_t Now_Len)
{
    uint8_t i;
    if (Now_Len > PWD_REAL_MAX || Now_Len < PWD_REAL_MIN)   // 判断条件是否满足
    {
        return 0;
    }
    for (i = Now_Len; i < PWD_REAL_MAX; i++)
    {
        arr[i] = '@';
    }
    return 1;
}

/* 按键动作函数，根据键码执行相应的操作，keycode-按键键码 */
void KeyAction(uint8_t keycode)
{
    if  ((keycode >= '0') && (keycode <= '9')) //输入字符
    {
        KeyNumAction(keycode);
    }
    else if (keycode == 0x0D)  //回车键
    {
        KeyEnterAction();
    }
    else if (keycode == 0x1B)  //Esc键
    {
        KeyEscAction();
    }
    else if (keycode == 0x26)	// 向上
    {
        Menu_Mode = Menu_Mode % 2 + 1;
        LcdClearScreen();
    }
    else if (keycode == 0x28)	// 向下
    {
        Menu_Mode = (Menu_Mode > 1) ? Menu_Mode - 1 : 2;
        LcdClearScreen();
    }    
}

/*清除缓存*/
void Clear_Cache(void)
{
    FillMemory(ucPwd_In_Buff1, '\0', PWD_IN_MAX_LEN);
    FillMemory(ucPwd_In_Buff2, '\0', PWD_IN_MAX_LEN);
    Parameter.ucPassword_Cnt = 0;      
}

/*比较+保存*/
uint8_t Compare_And_Save(void)
{
    if (CmpMemory(ucPwd_In_Buff1, ucPwd_In_Buff2, PWD_REAL_MAX))
    {
        if (Add_Symbol(ucUser_Pwd_Buff, Parameter.ucPassword_Cnt))
        {
            EEPROM_Write(&Power_Value, PWD_SAVE_ADDR, 1);   // 写入标志位
            System_MS_Delay(5);
            EEPROM_Write(ucUser_Pwd_Buff, PWD_SAVE_ADDR, PWD_REAL_MAX); // 密码存储
            return 1;
        }
        else
        {
            return 0;
        }
    }
    return 0;
}

// ms延时
void System_MS_Delay(uint16_t ms)
{
    uint16_t i,j;
    for(j=ms;j>0;j--)
    for(i=112;i>0;i--);
}
```

{% endfolding %}

{% folding, main.h %}

```cpp
#ifndef __MAIN_H
#define __MAIN_H
#include <reg52.h>

#define LCD_LONG 16 // 屏幕宽度显示最大字符长度
#define PWD_IN_MAX_LEN    20    //输入密码最大长度
#define PWD_SAVE_ADDR  0x30  //密码在EEPROM中的保存地址
#define PSW_FLAG_ADDR  0x08 // 上电标志位存储地址
#define PWD_REAL_MAX 10  // 用户密码实际最大长度
#define PWD_REAL_MIN 6   // 用户密码实际最小长度
#define Power_FLAG (uint8_t)'7'  // 上电存储值
#define PWD_ERROR_MAX 3 // 错误多少次后锁定
// 重置密码时打开宏
// #define USE_RESET_PWD
// 需要调成上电时状态打开宏(打开后烧写然后注释再烧一次即可)
// #define USE_POWER_ON

/*LED IO*/
sbit LED1_PIN = P0^0;
sbit LED2_PIN = P0^1;
sbit LED3_PIN = P0^2;
sbit LED4_PIN = P0^3;
sbit LED5_PIN = P0^4;
sbit LED6_PIN = P0^5;
sbit LED7_PIN = P0^6;
sbit LED8_PIN = P0^7;
#define LED_PORT P0

/*74HC138 IC IO*/
sbit ADDR0 = P1^0;  // A
sbit ADDR1 = P1^1;  // B
sbit ADDR2 = P1^2;  // C
sbit ADDR3 = P1^3;  // G1
sbit ENLED = P1^4;  // G2

/*Buzzer IO*/
sbit BUZZER_PIN = P1^6;

/* I2C IO */
sbit I2C_SCL = P3^7;
sbit I2C_SDA = P3^6;

/* LCD1602 IO*/
sbit LCD1602_RS = P1^0;
sbit LCD1602_RW = P1^1;
sbit LCD1602_E  = P1^5;
#define LCD1602_DB  P0

/* infrared IO*/
sbit INFRARED_INPUT = P3^3;

typedef unsigned char uint8_t;
typedef unsigned short uint16_t;
typedef unsigned int uint32_t;

// TRUE/FALSE
typedef enum
{
    FALSE = 0U,
    TRUE = !FALSE 
}FLagStatus_t;

// 模式枚举
typedef enum
{
    Change_PAWWD = (uint8_t)0x01,   // 修改密码模式
    VERIFY_PAWWD = (uint8_t)0x02,   // 密码验证模式
} Menu_Mode_t;

// 密码状态枚举
typedef enum
{
    NONE_PWD = (uint8_t)0x00,   // 无状态
    ENTER_PWD = (uint8_t)0x01,  // 输入密码状态
    SET_PWD = (uint8_t)0x02,    // 设置密码状态
    AGAIN_PWD = (uint8_t)0x03,  // 再次确认密码状态
}Input_Status_t;

// 页面切换枚举
typedef enum
{
    Interface_NULL = (uint8_t)0x00, // 无
    Interface_PowerOn = (uint8_t)0x01,  // 第一次上电
    Interface_ModeChoose = (uint8_t)0x02,   // 模式选择
    Interface_ChangePwd = (uint8_t)0x03,    // 密码修改
    Interface_VerifyPwd = (uint8_t)0x04,    // 密码验证
    Interface_Open = (uint8_t)0x05, // 解锁成功
    Interface_Lock = (uint8_t)0x06,  // 锁定系统
} Menu_Interface_Status_t;

// LED枚举
typedef enum
{
    LED1 = (uint8_t)0x01,
    LED2 = (uint8_t)0x02,
    LED3 = (uint8_t)0x03,
    LED4 = (uint8_t)0x04,
    LED5 = (uint8_t)0x05,
    LED6 = (uint8_t)0x06,
    LED7 = (uint8_t)0x07,
    LED8 = (uint8_t)0x08,        
} Led_Num_t;

typedef struct
{
    uint8_t Infrared_RX_Flag;   // 红外标志位
    uint8_t Buzzer_Start_Flag;  // 蜂鸣器启动标志位
    uint8_t ucUNLock_Led_Flag;    // 开锁后LED标志位
    uint8_t ucError_Cnt;    // 错误密码计数  (默认0)
    uint8_t ucPassword_Cnt;   // 当前输入密码位数的计数器  (默认0)
    uint8_t Verify_Index;    // 验证密码步骤索引 1 -- 输入密码   (默认0)
    uint8_t Change_Index;    // 修改密码步骤索引 1 -- 旧密码输入 2 -- 新密码输入 3 -- 再次输入新密码  (默认0)
    uint8_t PowerOn_Index;  // 第一次上电步骤索引 1 -- 输入密码 2 -- 再次输入 (默认0)
} Parameter_t;

extern uint8_t Power_Value;
extern uint8_t pdata ucUser_Pwd_Buff[PWD_REAL_MAX];
extern Menu_Mode_t Menu_Mode;
extern Parameter_t Parameter;
extern uint8_t pdata ucPwd_In_Buff1[PWD_IN_MAX_LEN];  //密码输入缓冲区1
extern uint8_t pdata ucPwd_In_Buff2[PWD_IN_MAX_LEN];  //密码输入缓冲区2
#endif

```

{% endfolding %}

{% folding, main.c %}

```cpp
#include "main.h"

/*====================================variable definition declaration area BEGIN===================================*/
// 枚举初始化
Input_Status_t Input_Status = NONE_PWD;
Menu_Mode_t Menu_Mode = Change_PAWWD;
Menu_Interface_Status_t Menu_Interface_Status = Interface_NULL;
// 结构体初始化
Parameter_t Parameter = 
{
    FALSE,
    FALSE,
    FALSE,
    0,
    0,
    0,
    0,
    0,
};

// 上电标志位
uint8_t Power_Value = '7';
uint8_t pdata ucUser_Pwd_Buff[PWD_REAL_MAX] = {'1','2','3','4','5','6','7','@','@','@'};   //用户密码数据(默认)
uint8_t pdata ucPwd_In_Buff1[PWD_IN_MAX_LEN];  //密码输入缓冲区1
uint8_t pdata ucPwd_In_Buff2[PWD_IN_MAX_LEN];  //密码输入缓冲区2

uint8_t T0RH = 0;  //T0重载值的高字节
uint8_t T0RL = 0;  //T0重载值的低字节

extern uint8_t Infrared_RX_Buff[4];
/*====================================variable definition declaration area   END===================================*/


/*====================================extern declaration area BEGIN===================================*/

extern uint8_t GetChkSum(uint8_t *dat, uint8_t len);
extern void KeyScan();
extern void LcdClearScreen();
extern void LcdShowStr(uint8_t x, uint8_t y, uint8_t *str);
extern uint8_t find_substring(char *arr1, char *arr2, uint8_t len2);
extern void FillMemory(uint8_t *dest, uint8_t byt, uint8_t len);
extern void EEPROM_Write(uint8_t *buf, uint8_t addr, uint8_t len);
extern uint8_t Add_Symbol(uint8_t *arr,uint8_t Now_Len);
extern void CopyMemory(uint8_t *dest, uint8_t *src, uint8_t len);
extern bit CmpMemory(uint8_t *ptr1, uint8_t *ptr2, uint8_t len);
extern void EEPROM_Read(uint8_t *buf, uint8_t addr, uint8_t len);
extern void InitLcd1602();
extern void Key_Handler();
extern void ShowPswCnt();
extern void SavePassword(void);
extern void Clear_Cache(void);
extern uint8_t Compare_And_Save(void);
extern void System_MS_Delay(uint16_t ms);
extern void Led_Flip(Led_Num_t LEDx);
extern void Led_Init(void);
extern void Buzzer_ON(void);
extern void Infrared_Handler(void);
extern void Infrared_Init(void);
extern uint16_t Infrared_Get_High_Time(void);
extern uint16_t Infrared_Get_Low_Time(void);
/*====================================extern  declaration area   END===================================*/

/*====================================function declaration area BEGIN===================================*/

void ConfigTimer0(uint16_t);  // 配置并启动T0
void Menu_Handler(void);    // 页面变化
void KeyNumAction(uint8_t); // 数字检测
void KeyEnterAction(void);  // 回车检测
void Hardware_Init(void);    // 硬件初始化

/*====================================function declaration area   END===================================*/


void main()
{
    Hardware_Init();

    while (1)
    {
        Menu_Handler(); // 页面处理
        Infrared_Handler(); // 红外处理
        Key_Handler();    // 按键处理
    }
}

void Menu_Handler(void)
{
    switch (Menu_Interface_Status)
    {
    case Interface_PowerOn: // 首次上电设置密码
    {
        switch(Parameter.PowerOn_Index)
        {
            case 1:
            {
                Input_Status = SET_PWD;
                LcdShowStr(0, 0, "  Set Password");
                break;
            }
            case 2:
            {
                Input_Status = AGAIN_PWD;
                LcdShowStr(0, 0, "  Set Again");
                break;
            }
            default: break;
        }
        break;
    }
    case Interface_ModeChoose: // 主页面
    {
        LcdShowStr(0, 0, "      Mode");

        if (Change_PAWWD == Menu_Mode)
        {
            LcdShowStr(0, 1, "1.Revise PWD");
        }
        else if (VERIFY_PAWWD == Menu_Mode)
        {
            LcdShowStr(0, 1, "2.verify PWD");
        }
        break;
    }
    case Interface_ChangePwd: // 修改密码
    {
        switch(Parameter.Change_Index)
        {
            case 1: // 旧密码输入
            {
                LcdShowStr(0, 0, "Old Password");
                Input_Status = SET_PWD; // 这个有限制长度
                break;
            }
            case 2: // 新密码输入
            {
                LcdShowStr(0, 0, "new Password");
                Input_Status = SET_PWD; // 这个有限制长度
                break;
            }
            case 3:	// 再次新密码输入
            {
                LcdShowStr(0, 0, "  Set Again");
                Input_Status = AGAIN_PWD; // 再次输入
                break;
            }
            default:break;
        }
        break;
    }
    case Interface_VerifyPwd: // 验证密码
    {
        switch (Parameter.Verify_Index)
        {
            case 1: // 输入密码
            {
                LcdShowStr(0, 0, "Input Password");
                Input_Status = ENTER_PWD;
                break;
            }
            default: break;
        }
        break;
    }
    case Interface_Open:    // 开锁
    {
        LcdShowStr(0, 0, "   Hello Baby");
        LcdShowStr(0, 1, "  Door is Open");
        break;
    }
    case Interface_Lock:    // 锁死
    {
        LcdShowStr(0, 0, "  System Lock");
        LcdShowStr(0, 1, "  Please Reset");
        while(1)
        {
            ;
        }
        break;
    }
    default:
        break;
    }
}

/* 数字键动作函数，keycode-数字按键的ASCII值 */
void KeyNumAction(uint8_t keycode)
{
    switch (Input_Status)
    {
        // 输入密码状态时，将输入字符填充到 ucPwd_In_Buff1 (长度可设置最大限制)
    case ENTER_PWD: 
    {
        if (Parameter.ucPassword_Cnt < PWD_IN_MAX_LEN)
        {
            ucPwd_In_Buff1[Parameter.ucPassword_Cnt] = keycode; // 赋值
            Parameter.ucPassword_Cnt++;
            ShowPswCnt();
        }
        break;        
    }
        // 设置密码状态时，将输入字符填充到 ucPwd_In_Buff1(长度有一定范围)
    case SET_PWD:                        
    {
        if (Parameter.ucPassword_Cnt < PWD_REAL_MAX) // 密码长度看宏
        {
            ucPwd_In_Buff1[Parameter.ucPassword_Cnt] = keycode;
            Parameter.ucPassword_Cnt++;
            ShowPswCnt();
        }
        break;        
    }
        // 设置密码确认状态时，将输入字符填充到 ucPwd_In_Buff2(长度有一定范围)
    case AGAIN_PWD: 
    {
        if (Parameter.ucPassword_Cnt < PWD_REAL_MAX)
        {
            ucPwd_In_Buff2[Parameter.ucPassword_Cnt] = keycode;
            Parameter.ucPassword_Cnt++;
            ShowPswCnt();
        }
        break;        
    }
    default: break;
    }
}

/* 回车键动作函数 */
void KeyEnterAction(void)
{

    switch(Menu_Interface_Status)
    {
        case Interface_NULL:break;	// 暂时没得用！
        case Interface_PowerOn:	// 如果当前处于上电状态下
        {
            if (1 == Parameter.PowerOn_Index)	// 如果当前是处于 1 状态
            {
                Parameter.PowerOn_Index = 2;	// 转下一个状态 2
                Parameter.ucPassword_Cnt = 0;
                LcdClearScreen();
            }
            else if (2 == Parameter.PowerOn_Index)  // 完成此步再清空 Buff1 和 Buff2的缓存！！！
            {
                if (Compare_And_Save())	// 比较两个数组+保存到EEPROM
                {
                    Menu_Interface_Status = Interface_ModeChoose;
                    LcdShowStr(0, 0, "   Set Success");
                    System_MS_Delay(1200);
                }
                else
                {
                    // 错误则继续在设置密码页面
                    Menu_Interface_Status = Interface_PowerOn;
                    Parameter.PowerOn_Index = 1;
                    LcdShowStr(0, 0, "    Set Fail");
                    System_MS_Delay(1200);
                }      
                Clear_Cache();
                LcdClearScreen();
            }
            break;
        }   
        case Interface_ModeChoose:
        {
            if (Change_PAWWD == Menu_Mode)
            {
                Menu_Interface_Status = Interface_ChangePwd;
                Parameter.Change_Index = 1;
            }
            else if (VERIFY_PAWWD == Menu_Mode)
            {
                Menu_Interface_Status = Interface_VerifyPwd;
                Parameter.Verify_Index = 1;
            }
            Clear_Cache();
            LcdClearScreen();
            break;
        }
        case Interface_ChangePwd:
        {
            switch(Parameter.Change_Index)
            {
                case 1:
                {
                    if (find_substring(ucUser_Pwd_Buff, ucPwd_In_Buff1, PWD_REAL_MAX))  // 判断旧密码是否吻合
                    {
                        Parameter.Change_Index = 2;
                    }  
                    else
                    {
                        LcdShowStr(0, 0, "  Old Password");
                        LcdShowStr(0, 1, "     Error"); 
                        Parameter.Change_Index = 0;
                        Menu_Interface_Status = Interface_ModeChoose;                       
                    }                 
                    break;
                }
                case 2:
                {
                    Parameter.Change_Index = 3;
                    break;
                }
                case 3:
                {
                    if (Compare_And_Save())
                    {
                        Menu_Interface_Status = Interface_ModeChoose;
                        LcdShowStr(0, 0, "   Set Success");
                        System_MS_Delay(1200);
                    }
                    else
                    {
                        // 错误则继续在设置密码页面
                        Menu_Interface_Status = Interface_ChangePwd;
                        Parameter.Change_Index = 2; // 错误继续回去重新
                        Clear_Cache();
                        LcdShowStr(0, 0, "    Set Fail");
                        System_MS_Delay(1200);
                    }                     
                    break;
                }
                default: break;
            }
            Parameter.ucPassword_Cnt = 0;
            LcdClearScreen();
            break;
        }
        case Interface_VerifyPwd:
        {
            switch(Parameter.Verify_Index)
            {
                case 1: // 无需清除数据缓存！！！
                {
                    if (find_substring(ucUser_Pwd_Buff, ucPwd_In_Buff1, PWD_IN_MAX_LEN))    // 判断
                    {                       
                        Menu_Interface_Status = Interface_Open; // 开锁
                        Parameter.ucUNLock_Led_Flag = TRUE; // LED开始运行
                        LcdShowStr(0, 0, " Password True");
                        LcdShowStr(0, 1, "   Door Open"); 
                        System_MS_Delay(1200);                        
                    }
                    else    // 密码错误，回到模式选择界面，且错误计数++
                    {
                        Menu_Interface_Status = Interface_ModeChoose;
                        Buzzer_ON();    // 启动蜂鸣器
                        LcdShowStr(0, 0, " Password Error");
                        System_MS_Delay(1200); 
                        Parameter.ucError_Cnt++;
                        if (Parameter.ucError_Cnt >= PWD_ERROR_MAX) // 锁定系统！！！只能复位
                        {
                            Buzzer_ON();    // 启动蜂鸣器
                            Menu_Interface_Status = Interface_Lock;
                        }
                    }
                    Clear_Cache();
                    break;
                }
                default: break;
            }
            LcdClearScreen();
            LcdClearScreen();
            break;
        }
        default: break;
    }
}

/* Esc键动作函数 */
void KeyEscAction()
{
    switch (Input_Status)
    {
    case ENTER_PWD: //输入密码状态时，清空当前输入以重新开始
    {
        if (1 == Parameter.Verify_Index)
        {
            LcdClearScreen();
            LcdShowStr(0, 0, "Input Password");
            Clear_Cache();
        }
        break;
    }
    case SET_PWD: //设置密码状态时，清空当前输入以重新开始
    {
        LcdClearScreen();
        if (1 == Parameter.Change_Index)
        {
            LcdShowStr(0, 0, "Old Password");
            
        }
        else if (2 == Parameter.Change_Index)
        {
            LcdShowStr(0, 0, "new Password");
        }
        FillMemory(ucPwd_In_Buff1, '\0', PWD_IN_MAX_LEN);
        Parameter.ucPassword_Cnt = 0;
        break;        
    }
    case AGAIN_PWD: //设置密码确认状态时，清空输入并返回密码设置状态
    {
        LcdClearScreen();
        if ((3 == Parameter.Change_Index) || (2 == Parameter.PowerOn_Index))
        {
            LcdShowStr(0, 0, "  Set Again");
        }
        FillMemory(ucPwd_In_Buff2, '\0', PWD_IN_MAX_LEN);
        Parameter.ucPassword_Cnt = 0;        
        break;        
    }
    default: break;
    }
}

/*
* @function: Hardware_Init
* @param: None
* @retval: None
* @brief: 硬件初始化
*/
void Hardware_Init(void)
{
    uint8_t Flag = '1';
    EA = 1;           //开总中断
    ConfigTimer0(1);  //配置T0定时1ms
    InitLcd1602();    //初始化液晶
    Led_Init(); // LED初始化
    Infrared_Init();    // 红外初始化

#ifdef USE_POWER_ON
    EEPROM_Write(&Flag,PSW_FLAG_ADDR,1);
#endif 

#ifdef USE_RESET_PWD 
    EEPROM_Write(ucUser_Pwd_Buff, PWD_SAVE_ADDR, PWD_REAL_MAX); // 密码存储
#endif

    EEPROM_Read(&Flag,PSW_FLAG_ADDR,1); // 读取标志位

    if (Power_FLAG == Flag)    // 不是首次上电
    {
        Menu_Interface_Status = Interface_ModeChoose;
        EEPROM_Read(ucUser_Pwd_Buff,PWD_SAVE_ADDR,PWD_REAL_MAX);    // 读取密码
    }
    else
    {
        // 设置密码
        Menu_Interface_Status = Interface_PowerOn;
        Parameter.PowerOn_Index = 1;
    }
    Clear_Cache();
}


/* 配置并启动T0，ms-T0定时时间 */
void ConfigTimer0(uint16_t ms)
{
    unsigned long tmp;  //临时变量

    tmp = 11059200 / 12;      //定时器计数频率
    tmp = (tmp * ms) / 1000;  //计算所需的计数值
    tmp = 65536 - tmp;        //计算定时器重载值
    tmp = tmp + 13;           //补偿中断响应延时造成的误差
    T0RH = (uint8_t)(tmp >> 8); //定时器重载值拆分为高低字节
    T0RL = (uint8_t)tmp;
    TMOD &= 0xF0;   //清零T0的控制位
    TMOD |= 0x01;   //配置T0为模式1
    TH0 = T0RH;     //加载T0重载值
    TL0 = T0RL;
    ET0 = 1;        //使能T0中断
    TR0 = 1;        //启动T0
}


/* T0中断服务函数，执行按键扫描 */
void InterruptTimer0() interrupt 1
{
    static uint8_t Led_Cnt;
    static uint16_t Buzzer_Cnt;

    TH0 = T0RH;  //重新加载重载值
    TL0 = T0RL;

    if (Parameter.ucUNLock_Led_Flag)
    {
        Led_Cnt++;

        if (200 == Led_Cnt)
        {
            Led_Cnt = 0;
            Led_Flip(LED1);
            Led_Flip(LED3);
            Led_Flip(LED5);
            Led_Flip(LED7);
        }
    }
    if (Parameter.Buzzer_Start_Flag)
    {
        Buzzer_Cnt++;

        if (3000 == Buzzer_Cnt)
        {
            Buzzer_Cnt = 0;
            Parameter.Buzzer_Start_Flag = FALSE;
        }
        BUZZER_PIN = ~BUZZER_PIN;
    }
    KeyScan();   //按键扫描
}

/*
* @function: EXINT1_ISR
* @param: None
* @retval: None
* @brief: INT1中断服务函数，执行红外接收及解码
*/
void EXINT1_ISR() interrupt 2
{
    uint8_t i, j;
    uint8_t byt;
    uint16_t time;

    // 接收并判定引导码的9ms低电平
    time = Infrared_Get_Low_Time();
    if ((time < 7833) || (time > 8755)) // 时间判定范围为8.5～9.5ms，
    {                                   // 超过此范围则说明为误码，直接退出
        IE1 = 0;                        // 退出前清零INT1中断标志
        return;
    }
    // 接收并判定引导码的4.5ms高电平
    time = Infrared_Get_High_Time();
    if ((time < 3686) || (time > 4608)) // 时间判定范围为4.0～5.0ms，
    {                                   // 超过此范围则说明为误码，直接退出
        IE1 = 0;
        return;
    }
    // 接收并判定后续的4字节数据
    for (i = 0; i < 4; i++) // 循环接收4个字节
    {
        for (j = 0; j < 8; j++) // 循环接收判定每字节的8个bit
        {
            // 接收判定每bit的560us低电平
            time = Infrared_Get_Low_Time();
            if ((time < 313) || (time > 718)) // 时间判定范围为340～780us，
            {                                 // 超过此范围则说明为误码，直接退出
                IE1 = 0;
                return;
            }
            // 接收每bit高电平时间，判定该bit的值
            time = Infrared_Get_High_Time();
            if ((time > 313) && (time < 718)) // 时间判定范围为340～780us，
            {                                 // 在此范围内说明该bit值为0
                byt >>= 1;                    // 因低位在先，所以数据右移，高位为0
            }
            else if ((time > 1345) && (time < 1751)) // 时间判定范围为1460～1900us，
            {                                        // 在此范围内说明该bit值为1
                byt >>= 1;                           // 因低位在先，所以数据右移，
                byt |= 0x80;                         // 高位置1
            }
            else // 不在上述范围内则说明为误码，直接退出
            {
                IE1 = 0;
                return;
            }
        }
        Infrared_RX_Buff[i] = byt; // 接收完一个字节后保存到缓冲区
    }
    Parameter.Infrared_RX_Flag = TRUE; // 接收完毕后设置标志
    IE1 = 0;    // 退出前清零INT1中断标志
}


```

{% endfolding %}



![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230620234723.webp)