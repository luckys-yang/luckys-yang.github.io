---
title: 51-蓝牙接收温度显示
cover: /img/num74.webp
comments: false
tags:
  - 蓝牙
categories:
  - 51系列
abbrlink: bd4e8871
date: 2022-04-09 15:17:00
updated: 2022-06-09 01:10:25
---
{% note blue 'fas fa-fan' flat %}实验{% endnote %}

下载程序后，插上DS18B20温度传感器，数码管显示检测的温度值，与PZ-HC05蓝牙进行配对，打开手机APP，采集的温度数据上传到手机APP显示。

main.c
```cpp
# include "public.h"
# include "bluetooth.h"

/*******************************************************************************
* 函 数 名       : main
* 函数功能		 : 主函数
* 输    入       : 无
* 输    出    	 : 无
*******************************************************************************/
void main()
{	
	bluetooth_control_init();

	while(1)
	{				
		bluetooth_control();	
	}		
}

```
 

smg.c（数码管）
```cpp
# include "smg.h"


u8 gsmg_code[17]={0x3f,0x06,0x5b,0x4f,0x66,0x6d,0x7d,0x07,
				0x7f,0x6f,0x77,0x7c,0x39,0x5e,0x79,0x71};
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

# include "public.h"

sbit A0=P2^2;
sbit A1=P2^3;
sbit A2=P2^4;
# define SMG_A0_F_PORT P0//宏定义数码管P0端口
extern u8 gsmg_code[17];  //注意要加extern 

void smg_display(u8 dat[],u8 pos);
# endif
```
 

ds18b20.c（温度传感器）
```cpp
# include "ds18b20.h"
# include "intrins.h"

/*******************************************************************************
* 函 数 名         : ds18b20_reset
* 函数功能		   : 复位DS18B20  
* 输    入         : 无
* 输    出         : 无
*******************************************************************************/
void ds18b20_reset(void)
{
	DS18B20_PORT=0;	//拉低DQ
	delay_10us(75);	//拉低750us
	DS18B20_PORT=1;	//DQ=1
	delay_10us(2);	//20US
}

/*******************************************************************************
* 函 数 名         : ds18b20_check
* 函数功能		   : 检测DS18B20是否存在
* 输    入         : 无
* 输    出         : 1:未检测到DS18B20的存在，0:存在
*******************************************************************************/
u8 ds18b20_check(void)
{
	u8 time_temp=0;

	while(DS18B20_PORT&&time_temp<20)	//等待DQ为低电平
	{
		time_temp++;
		delay_10us(1);	
	}
	if(time_temp>=20)return 1;	//如果超时则强制返回1
	else time_temp=0;
	while((!DS18B20_PORT)&&time_temp<20)	//等待DQ为高电平
	{
		time_temp++;
		delay_10us(1);
	}
	if(time_temp>=20)return 1;	//如果超时则强制返回1
	return 0;
}

/*******************************************************************************
* 函 数 名         : ds18b20_read_bit
* 函数功能		   : 从DS18B20读取一个位
* 输    入         : 无
* 输    出         : 1/0
*******************************************************************************/
u8 ds18b20_read_bit(void)
{
	u8 dat=0;
	
	DS18B20_PORT=0;
	_nop_();_nop_();
	DS18B20_PORT=1;	
	_nop_();_nop_(); //该段时间不能过长，必须在15us内读取数据
	if(DS18B20_PORT)dat=1;	//如果总线上为1则数据dat为1，否则为0
	else dat=0;
	delay_10us(5);
	return dat;
} 

/*******************************************************************************
* 函 数 名         : ds18b20_read_byte
* 函数功能		   : 从DS18B20读取一个字节
* 输    入         : 无
* 输    出         : 一个字节数据
*******************************************************************************/
u8 ds18b20_read_byte(void)
{
	u8 i=0;
	u8 dat=0;
	u8 temp=0;

	for(i=0;i<8;i++)//循环8次，每次读取一位，且先读低位再读高位
	{
		temp=ds18b20_read_bit();
		dat=(temp<<7)|(dat>>1);
	}
	return dat;	
}

/*******************************************************************************
* 函 数 名         : ds18b20_write_byte
* 函数功能		   : 写一个字节到DS18B20
* 输    入         : dat：要写入的字节
* 输    出         : 无
*******************************************************************************/
void ds18b20_write_byte(u8 dat)
{
	u8 i=0;
	u8 temp=0;

	for(i=0;i<8;i++)//循环8次，每次写一位，且先写低位再写高位
	{
		temp=dat&0x01;//选择低位准备写入
		dat>>=1;//将次高位移到低位
		if(temp)
		{
			DS18B20_PORT=0;
			_nop_();_nop_();
			DS18B20_PORT=1;	
			delay_10us(6);
		}
		else
		{
			DS18B20_PORT=0;
			delay_10us(6);
			DS18B20_PORT=1;
			_nop_();_nop_();	
		}	
	}	
}

/*******************************************************************************
* 函 数 名         : ds18b20_start
* 函数功能		   : 开始温度转换
* 输    入         : 无
* 输    出         : 无
*******************************************************************************/
void ds18b20_start(void)
{
	ds18b20_reset();//复位
	ds18b20_check();//检查DS18B20
	ds18b20_write_byte(0xcc);//SKIP ROM
    ds18b20_write_byte(0x44);//转换命令	
}

/*******************************************************************************
* 函 数 名         : ds18b20_init
* 函数功能		   : 初始化DS18B20的IO口 DQ 同时检测DS的存在
* 输    入         : 无
* 输    出         : 1:不存在，0:存在
*******************************************************************************/ 
u8 ds18b20_init(void)
{
	ds18b20_reset();
	return ds18b20_check();	
}

/*******************************************************************************
* 函 数 名         : ds18b20_read_temperture
* 函数功能		   : 从ds18b20得到温度值
* 输    入         : 无
* 输    出         : 温度数据
*******************************************************************************/
float ds18b20_read_temperture(void)
{
	float temp;
	u8 dath=0;
	u8 datl=0;
	u16 value=0;

	ds18b20_start();//开始转换
	ds18b20_reset();//复位
	ds18b20_check();
	ds18b20_write_byte(0xcc);//SKIP ROM
    ds18b20_write_byte(0xbe);//读存储器

	datl=ds18b20_read_byte();//低字节
	dath=ds18b20_read_byte();//高字节
	value=(dath<<8)+datl;//合并为16位数据

	if((value&0xf800)==0xf800)//判断符号位，负温度
	{
		value=(~value)+1; //数据取反再加1
		temp=value*(-0.0625);//乘以精度	
	}
	else //正温度
	{
		temp=value*0.0625;	
	}
	return temp;
}

```
 

ds18b20.h
```cpp
# ifndef _ds18b20_H
# define _ds18b20_H

# include "public.h"

//管脚定义
sbit DS18B20_PORT=P3^7;	//DS18B20数据口定义


//函数声明
u8 ds18b20_init(void);
float ds18b20_read_temperture(void);

# endif
```
 

public.c（通用）
```cpp
# include "public.h"

/*******************************************************************************
* 函 数 名       : delay_10us
* 函数功能		 : 延时函数，ten_us=1时，大约延时10us
* 输    入       : ten_us
* 输    出    	 : 无
*******************************************************************************/
void delay_10us(u16 ten_us)
{
	while(ten_us--);	
}

/*******************************************************************************
* 函 数 名       : delay_ms
* 函数功能		 : ms延时函数，ms=1时，大约延时1ms
* 输    入       : ms：ms延时时间
* 输    出    	 : 无
*******************************************************************************/
void delay_ms(u16 ms)
{
	u16 i,j;
	for(i=ms;i>0;i--)
		for(j=110;j>0;j--);
}
```
 


public.h
```cpp
# ifndef _public_H
# define _public_H

# include "reg52.h"

typedef unsigned int u16;	//对系统默认数据类型进行重定义
typedef unsigned char u8;


void delay_10us(u16 ten_us);
void delay_ms(u16 ms);

# endif

```
 


uart.c（串口通信）
```cpp
# include "uart.h"

# define RELOAD_COUNT 0xFA //宏定义波特率发生器的载入值 9600

void UART_Init(void)
{
	SCON|=0X50;			//设置为工作方式1
	TMOD|=0X20;			//设置计数器工作方式2
	PCON=0X80;			//波特率加倍
	TH1=RELOAD_COUNT;	//计数器初始值设置
	TL1=TH1;
	ES=0;				//关闭接收中断
	EA=1;				//打开总中断
	TR1=1;				//打开计数器
//	TI=1;          //发送中断标记位，如果使用printf函数的必须设置	
}

void UART_SendData(u8 dat)
{
	ES=0; //关闭串口中断
	TI=0; //清发送完毕中断请求标志位
	SBUF=dat; //发送
	while(TI==0); //等待发送完毕
	TI=0; //清发送完毕中断请求标志位
	ES=1; //允许串口中断
}

void UART_SendString(u8 *pbuf)
{
	while(*pbuf!='\0') //遇到空格跳出循环	
	{
		UART_SendData(*pbuf);
		delay_10us(5);
		pbuf++;	
	}
}

u8 UART_RX_BUF[UART_REC_LEN];     //接收缓冲,最大UART_REC_LEN个字节.
//接收状态
//bit15，	接收完成标志
//bit14，	接收到0x0d
//bit13~0，	接收到的有效字节数目
u16 UART_RX_STA=0;       //接收状态标记	


//void UART_IRQn() interrupt 4
//{
//	u8 r;
//	static u8 i=0;
//	
//	if(RI)
//	{
//		RI=0;
//		UART_RX_BUF[i]=SBUF;//读取接收到的数据
//		if(UART_RX_BUF[0]=='+')i++;
//		else i=0;
//		if(i==10)
//		{
//			i=0;
//		}		  		
//	}	
//}


```
 


uart.h
```cpp
# ifndef _uart_H
# define _uart_H

# include "public.h"
# include "stdio.h"


# define UART_REC_LEN  			10  	//定义最大接收字节数 50

extern u8  UART_RX_BUF[UART_REC_LEN]; //接收缓冲,最大USART_REC_LEN个字节.末字节为换行符 
extern u16 UART_RX_STA;         		//接收状态标记	


void UART_Init(void);
void UART_SendData(u8 dat);
void UART_SendString(u8 *pbuf);


# endif

```
 


bluetooth.c（蓝牙）
```cpp
# include "bluetooth.h"
# include "ds18b20.h"
# include "uart.h"
# include "smg.h"


//定义LED1管脚
sbit LED1=P2^0;

//定义蓝牙控制命令
# define LED1_ON_CMD			0X11
# define LED1_OFF_CMD		0X10


//蓝牙控制初始化
void bluetooth_control_init(void)
{
	UART_Init();
	ds18b20_init();//初始化DS18B20
	ES=1;//允许串口中断	
}

//蓝牙控制
void bluetooth_control(void)
{
	long i=0;
   	int temp_value;
	u8 temp_buf[5];
	u8 bluetooth_send_buf[7];

	while(1)
	{
		i++;
		if(i%50==0)//间隔一段时间读取温度值，间隔时间要大于温度传感器转换温度时间
			temp_value=ds18b20_read_temperture()*10;//保留温度值小数后一位
		if(temp_value<0)//负温度
		{
			temp_value=-temp_value;
			temp_buf[0]=0x40;//显示负号
			bluetooth_send_buf[0]='-';	
		}
		else
		{
			temp_buf[0]=0x00;//不显示
			bluetooth_send_buf[0]='+';
		}		
		temp_buf[1]=gsmg_code[temp_value/1000];//百位
		temp_buf[2]=gsmg_code[temp_value%1000/100];//十位
		temp_buf[3]=gsmg_code[temp_value%1000%100/10]|0x80;//个位+小数点
		temp_buf[4]=gsmg_code[temp_value%1000%100%10];//小数点后一位
		smg_display(temp_buf,4);
		if(i%100==0)
		{
			bluetooth_send_buf[1]=temp_value/1000+0x30;
			bluetooth_send_buf[2]=temp_value%1000/100+0x30;
			bluetooth_send_buf[3]=temp_value%1000%100/10+0x30;
			bluetooth_send_buf[4]='.';
			bluetooth_send_buf[5]=temp_value%1000%100%10+0x30;
			bluetooth_send_buf[6]='\0';
			UART_SendString(bluetooth_send_buf);//通过串口发送温度数据到APP	
		}		
	}				
}

//串口中断服务函数
//接收手机APP发送的信号后控制板载资源
void UART_IRQn() interrupt 4
{
	if(RI)
	{
		RI=0;
		UART_RX_BUF[0]=SBUF;//读取接收到的数据
		
		//蓝牙控制
		if(UART_RX_BUF[0]==LED1_ON_CMD)
			LED1=0;
		else if(UART_RX_BUF[0]==LED1_OFF_CMD)
			LED1=1;		
	}	
}

```
 


bluetooth.h
```cpp
# ifndef _bluetooth_H
# define _bluetooth_H

# include "public.h"

void bluetooth_control_init(void);
void bluetooth_control(void);

# endif
```
 
<div class="video-bilibili">
  <iframe
    src="https://player.bilibili.com/player.html?aid=340508700&bvid=BV1v94y1Z7mX&cid=571396187&page=1"
    scrolling="no"
    border="0"
    frameborder="no"
    framespacing="0"
    high_quality="1"
    danmaku="1"
    allowfullscreen="true"
  ></iframe>
</div>