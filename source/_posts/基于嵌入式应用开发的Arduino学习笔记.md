---
title: 基于嵌入式应用开发的Arduino学习笔记
cover: /img/num97.webp
comments: false
categories:
  - Arduino
abbrlink: db18db87
date: 2022-12-09 10:16:00
updated: 2022-12-11 18:27:44
---
## 前言

[ArduinoIDE官网下载](https://www.arduino.cc/en/software)

[安装库的步骤](http://www.arduino.cc/en/Guide/Libraries)



- 参考文章

[太极创客](http://www.taichi-maker.com/homepage/reference-index/arduino-code-reference/serial/)

- 参考手册资料

Arduino开发环境搭建文档



| 从车Arduino微控制器 |                   ATmega2560                   |
| :-----------------: | :--------------------------------------------: |
|  数字输入输出引脚   |       54个(其中有15个引脚可作为PWM引脚)        |
|    模拟输入引脚     |                      16个                      |
| Flash Memory(闪存)  | 256 KB ( 其中由 8 KB用于系统引导（bootloader） |
| SRAM（静态存储器）  |                      8 KB                      |
|       EEPROM        |                      4 KB                      |
|     内置LED引脚     |                       13                       |
|      时钟频率       |                     16 MHz                     |



## ArduinoIDE安装

当前官网最新版本为 `2.0.3` （以实际为准）

- 安装过程无脑Next(安装路径看个人我喜欢放E盘因为我C盘是中文)

- 安装完成打开IDE，如果需要改成中文可以在 `File` 里点击首选项进行改
- 如果弹窗让你下载驱动啥的点安装即可

- 然后开始选择你的开发板(新手一般是 Arduino uno)，这里我是直接打开嵌入式应用开发的例程，板子型号选择 `Genuino Mega or Mega2560`，对应的 CPU 类型 `ATmega2560(Mega2560)`,端口选择Arduino/Genuino Mega or Mega 2560 开发板的串口设备(需要连接板子)
- 导入库（需要导入不然编译不了）

首先点击浏览选择一个文件夹来存放库，选择好以后则不要再改了

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221209095611.jpg)

把例程里的文件夹直接复制粘贴放在路径下即可(切记不要直接把库里面的文件解压至 My_Lib下应该统一放在一个libraries的文件夹里这个文件夹名字相当于库名，然后浏览那的路径最后应该是主文件夹也就是 My_Lib)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221209095709.jpg)

- 然后点击 `验证` 看看编译有没有错误，正常按上面步骤是没有错误的然后就可以点击 `上传` 下载程序到开发板里即可

## Arduino基础语法

Arduino程序可以分为三个主要部分： `结构、值（变量和常量）和函数`



- 程序结构

Arduino程序不像C语言那样使用 `main()` 当做函数入口，但是程序中编写的setup和loop函数，都在main函数中调用了

loop的循环执行，是通过for循环实现的，且每次loop结束后，都会进行串口事件判断，也正是因为这种设计， `串口事件不能实时响应`



```cpp
void setup()
{
    //初始化，只执行一次
    //通常我们会在这完成Arduino的初始化设置，如配置I/O口状态，初始化串口等操作
}

/*有的Arduino程序没有loop程序这时候需要到main.cpp把loop注释掉或者新建一个loop函数但是里面什么都不放以便main函数调用否则会编译错误*/
void loop()
{
    //循环执行体，无限循环
}
```

变量定义跟C语言差不多一样，定义在 `setup()` 上方

<span style="color:red;">常量</span>

|  名称  |    描述     |
| :----: | :---------: |
|  HIGH  | 引脚高电平1 |
|  LOW   | 引脚低电平0 |
| INPUT  |    输入     |
| OUTPUT |    输出     |
|  true  |     真      |
| false  |     假      |

<span style="color:red;">数据类型</span>

|        名称        |                  描述                   | 占用字节 |
| :----------------: | :-------------------------------------: | :------: |
| char,unsigned char |          字符型，无符号字符型           |    1     |
|  int,unsigned int  |            整型，无符号整型             |    2     |
| long,unsigned long |          长整型，无符号长整型           |    4     |
|      boolean       |           布尔类型(只有真/假)           |    1     |
|        byte        | 字节类型(特有的跟unsigned char功能一样) |    1     |
|       float        |              单精度浮点型               |    4     |
|       string       |               字符串类型                |    /     |
|       String       |                  对象                   |          |
|       array        |                  排列                   |          |
|        word        |                   字                    |          |

关于String类里面有很多实用的函数，可在 `WString.h`里找

## Arduino 常用函数

|  函数   | 参数 | 描述 |
| :-----: | :--: | :--: |
| pinMode |      |      |
|         |      |      |
|         |      |      |

## Arduino.串口

- 初始化串口

```cpp
//需要在setup函数里对串口初始化
//把串口波特率设置为115200
Serial.begin(115200);	
```

- 打印数据

```cpp
//打印有两种，区别是前者换行输出，后者不换行
int x;
Serial.println(x,BIN);	//把x的二进制打印并且换行

Serial.print(x,BIN);	//不换行
```

- 其他函数

```cpp
/*
判断串口是否有接收到外界发送过来的数据，返回值是int值(即等待读取的数据字节数)
*/
Serial.available()	
 
//读取接收的数据并且存到指定地址     
Serial.read()	

//终止串行通讯     
Serial.end()
  
/*
可用于从设备接收到的数据中寻找指定字符串信息。当函数找到了指定字符串信息后将会立即结束函数执行并且返回“真”。否则将会返回“假”    
参数为被查找字符串允许是String、char类型
*/    
Serial.find(target)    
      
/*
可用于从设备接收到的数据中寻找指定字符串信息。当函数找到了指定字符串信息后将会立即结束函数执行并且返回“真”。否则将会返回“假”。该函数在满足以下任一条件后都会停止函数执行
    – 读取到指定终止字符串
	– 找到了指定字符串信息
	– 达到设定时间（可使用setTimeout来设置）
参数1--被查找字符串跟find一样
参数2--终止字符串，当读取到这个时函数会返回
*/
Serial,findUntil(target,terminator)    

/*
可让开发板在所有待发数据发送完毕前，保持等待状态
在没有使用flush函数的情况下，开发板在输出信息前后时间差别微乎其微。但是在使用了flush函数以后，可以明显看到开发板输出信息占用了一定的时间
*/
Serial.flush()  
    
/*
清除接收缓存
在loop函数里循环接收数据然后清空缓存
*/    
void loop()
{
    while(Serial.)
}
```

