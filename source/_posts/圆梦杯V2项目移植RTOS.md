---
title: 圆梦杯V2项目移植RTOS
cover: /img/num153.webp
categories:
  - 实时操作系统
comments: false
abbrlink: 6452470c
date: 2023-09-20 22:03:35
---



## 前言

{% note blue 'fas fa-fan' flat %}参考文章{% endnote %}

[ARM_CM4_MPU和ARM_CM4F区别](http://47.111.11.73/thread-308347-1-1.html)



## 源码移植RTOS

1. 下载源码，我的是 `V202111`，然后创建一个HAL工程驱动LED即可，需要把SYS基准时钟换成别的定时器
2. 在工程新建一个文件夹，叫 `FreeRTOS`，然后把下面的源码全部复制过去

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230920215216.webp)

3. 然后删掉没用的只留下这些，其中 `RVDS` 文件夹里面只留下一个 `ARM_CM4F` 文件夹

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230920221303.webp)

4. Keil里面添加文件

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230920221744.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230920221800.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230920222115.webp)

4. 然后编译一下，会出现报错正常，发现 `FreeRTOSConfig.h` 文件打不开，需要去我们下载的源码里面的demo里面找，找到 `CORTEX_M4F_STM32F407ZG-SK` 文件夹里面，把它复制出来放到自己工程下USER下即可然后添加头文件路径，编译，会发现错误变成80多个(我人都傻了)，查了原因是因为使用了AC6编译器，切换到AC5还是有4个错误，这里我还是继续使用AC6，首先在源码找到 `portable\GCC\ARM_CM4F`的文件夹进行代替，原本是使用`\FreeRTOS\portable\RVDS\ARM_CM4F下`的port.c和portmacro.h，然后编译发现只有一个错误：`SystemCoreClock未定义`，需要把FreeRTOSConfig.h顶部的条件编译改成：

```cpp
#if defined(__ICCARM__) || defined(__CC_ARM) || defined(__GNUC__)
    #include <stdint.h>
    extern uint32_t SystemCoreClock;
#endif
```

编译发现有3个错误，只需要去屏蔽stm32f4xx_it.c那3个函数即可，因为它跟port.c定义重复：

```cpp
PendSV_Handler()
SVC_Handler()
Systick_Handler()
```

再编译会发现Hook结尾的函数未定义，这些函数用户需要用的话需要自己去编写，就是回调函数，这里只需要在FreeRTOSConfig.h将这些钩子函数宏定义屏蔽掉即可：

```cpp
#define configUSE_IDLE_HOOK				0
#define configUSE_TICK_HOOK				0
#define configCHECK_FOR_STACK_OVERFLOW	0
#define configUSE_MALLOC_FAILED_HOOK	0
```

然后编译应该就是没有报错了

然后把时钟也改了直接给单片机系统时钟：

```cpp
#define configCPU_CLOCK_HZ				( (unsigned long)168000000 )
```



## MX生成RTOS

> 上面的方法是使用源码的方式，MX的话有一键配置不需要去下载

MX里选择V1版本，他们区别是内核不一样，V2的话代码量大点

> 然后最快的方法是把现有工程拷贝一份到新路径改名为 `DreamV2_OS`，然后打开新路径下的工程里 `.ioc` ，点击File然后重新另存为到你新的路径下，然后如果有生成新的.ioc则把旧的删了，旧的 `.mxproject`也要删不然会影响原来工程，然后keil那些名称也全部改成你工程名字然后打开keil重新编译，还有输出的debug路径也需要在设置里改

> 下面开始在 `DreamV2_OS` 项目里进行移植：
>
> 1. 把main函数里面主循环里面的代码删掉
> 2. System.Run()函数里面也不要了
> 3. Task里面的也全部不要
> 4. 初始化也暂时屏蔽即可，只留下那些普通的没用到系统延时的比如蜂鸣器按键led串口定时器的初始化
> 5. MX配置
>
> - 首先是基准时钟定时器换成别的我为了保持和系统时钟频率一致选择了 `TIM11`
> - 单独开一个20KHz(50us)的定时器用于任务利用率计数(调试)，等做完后再删除这个即可,最大支持计数时间(运行时间超过了 59.6 分钟将不准确)，这里我选择了定时器12
> - 选择 `FreeRTOS V1` ，然后简单配置一下：
>
> ```cpp
> MAX_TASK_NAME_LEN 20	// 任务名称长度改成20
> TOTAL_HEAP_SIZE	10240	// 内存给10K先
> // 使能运行时间和任务状态追踪(Enable 3个)    
> ```
>
> - 设置NVIC，进去如果看到红色是正常的，我们只需要把它全部设为5即可，而且右下角的使用RTOS函数的勾记得要勾上
> - 然后创建一个用于打印任务信息的任务，大小设置高点512字(因为待会里面需要定义大的数组)，优先级的话高点



## 模块

> 任务默认都写在生成的 `freertos.c` 里面

### 打印任务状态

> 需要定义一个变量在定时器里面一直递增，然后在 `freertos.c` 里面找到两个弱函数复制到另一个自己建的.c里面进行编写(怕到时候重新生成会没了)

使用TIM12，定时50us

### 规划

我任务主要有下面：

1. 按键扫描与执行

原本考虑用事件标志组做的，然后在事件任务里进行按键的相关执行动作，但是最后还是没用，直接按键按下就发送同步信号啥的就行了

2. WS2812B灯的开关

通过ASR串口接收数据进行判断，如果是打开命令就把WS2812B对应的事件标志组置1，如果是关闭命令就把对应的事件标志组置0，然后在WS2812B任务里就一直使用GetBits函数获取事件标志组01的状态，如果进行判断WS2812B的状态进行开和关，这里原本是打算用无限等待那个函数但是有Bug，执行一次就不执行了

3. 小车运动

创建一个小车运动任务，然后运行一次阻塞800ms左右即可，然后小车运动函数也需要改，不能有死循环，否则会导致复位，需要在里面加阻塞1ms或者10ms

4. OLED刷新显示

显示的话直接在任务里阻塞500ms刷新一次，然后切换屏幕的话是通过按键进行的发送二值信号量

5. 数据采集

使用软件定时器进行200ms发送二值信号量给任务采集一次

6. 接收阿里云发送过来的指令

接收阿里云的命令函数我放在了硬件定时器中断里面5ms进行判断一次

7. 发送心跳包和心跳包回复判断

发送心跳包的话创建一个专门的任务，创建一个12S的软件定时器进行发送，心跳包判断的话就放在了LED指示灯那一起，记得把LED任务内存设大点

8. 数据上传到阿里云

创建一个上传任务，间隔5S，然后判断心跳包是否成功，成功就发送，不成功就不发送

9. 打印任务状态(调试阶段使用)

直接通过按键加上互斥信号量用于串口的打印

10. 系统指示灯

直接在任务里进行1s的阻塞


11. 蜂鸣器

任务通知代替二值信号量，发送任务通知给蜂鸣器任务

12. ASR串口接收

在接收任务里进行同步信号获取，然后获取后进行数据解析还有通过队列发送接收数据的备份给另一个队列任务加上互斥信号量然后进行上位机的输出打印

13. 独立看门狗

创建一个独立看门狗任务，然后使能独立看门狗，设定时间为6S，有些任务是可以进行监控的，但是有些是不可以的，比如那些死等的(挂起任务)那种就不会执行下面的程序，那这些任务就不能被监控，只有那些不是死等的可以



### 蜂鸣器

> 蜂鸣器响一段时间的话我是使用任务通知代替二值信号量

```cpp
/*Buzzer.c*/
static void Buzzer_Ring(void)
{
	// 发送任务通知
	xTaskNotifyGive(BUZZERHandle);
}

/*freertos.c*/
void BUZZER_Task(void const *argument)
{
  /* USER CODE BEGIN BUZZER_Task */
  Buzzer.Buzzer_Init(); // 蜂鸣器初始化
  /* Infinite loop */
  for (;;)
  {
	ulTaskNotifyTake(pdTRUE, portMAX_DELAY);	// 接收任务通知，无限等待(参1-退出时清0)
	
	Buzzer.Buzzer_ON();
	osDelay(1000);
	Buzzer.Buzzer_OFF();
  }
  /* USER CODE END BUZZER_Task */
}
```



### 独立看门狗

> 在低功耗模式下，独立看门狗可能会因为硬件时钟失真而无法正常工作，从而导致系统重启或死机等问题。因此，在低功耗模式下，建议使用窗口看门狗，可以更好地保障系统的稳定性和可靠性

看手册我们F407的LSI时钟是32KHz(也可以在MX里面看)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230923194126.webp)

时间设定：30S

> $LSI=32KHz$
>
> $\text{超时时间:}=(1/(32/256)*3750ms = 30000ms=30s)$

- MX配置

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230923195817.webp)











## 问题

> 首先是RVDS文件夹下的这几个文件夹的选择，自己对照型号选择即可，我的是F407所以这里选择 `ARM_CM4F`
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230920220906.webp)

> 使用MX生成的FreeRTOS的话，编译也会出现之前源码移植出现的问题，所以只需要去MX看一下FreeRTOS的版本，然后去[Github官网](https://github.com/FreeRTOS/FreeRTOS)下载一样的版本的源码下来，找到GCC下的进行替换,然后编译( `注意每次重新生成的话都需要替换`)，需要注意在main.c里面已经有那个定时器回调函数了所以在别的地方不能再定义

> 温湿度读不出，原因还是之前那个把代码优化改为0就行了

> ASR接收任务只能读一次然后就卡死，原因是队列任务那打错串口了，应该是用串口1打印到上位机结果写成用ASR的串口了可能导致数据错误
>
> 队列打印一次就没有数据了，任务正常没卡死，打印了内存消耗才发现队列任务的内存变成0，原因是任务的内存给小了，128字改成256字即可

> 上传阿里云那一直卡死在那，我直接屏蔽就行了(iot.c)：
>
> ```cpp
> 	//--------屏蔽这里不然初始化一直卡死在这里
> //	while(MQTTDeserialize_connack(&sessionPresent, &connack_rc, IOT.Buf, IOT.Buflen) != 1 || connack_rc != 0);
> 
> //	if(connack_rc != 0)
> //	{		
> //		WiFi_Log("Connect reply:%uc\r\n",connack_rc);
> //	}
> //	WiFi_Log("《Successfully connected!》\r\n");
> ```

