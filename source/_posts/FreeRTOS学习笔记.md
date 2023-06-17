---
title: FreeRTOS学习笔记
cover: /img/num104.webp
comments: false
katex: true
categories:
  - 实时操作系统
abbrlink: a98edcdb
date: 2022-11-16 17:34:48
---
## 前言

网站：

[FreeRTOS官网](https://www.freertos.org/)

参考文章：

[从0到1学习FreeRTOS：FreeRTOS 内核应用开发：（四）FreeRTOS 的启动流程](https://blog.csdn.net/qq_38351824/article/details/100997810?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522166858827716782427483868%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=166858827716782427483868&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~baidu_landing_v2~default-6-100997810-null-null.142^v63^control,201^v3^add_ask,213^v2^t3_esquery_v3&utm_term=freertos%20main%E5%87%BD%E6%95%B0&spm=1018.2226.3001.4187)
[FreeRTOS 入门-极客笔记](https://deepinout.com/freertos-tutorials/freertos-intro/freertos-tutorials.html)
[FreeRTOS基础篇教程目录汇总](https://www.cnblogs.com/yangguang-it/p/7233591.html)

[FreeRTOS基础篇_研究是为了理解的博客-CSDN博客](https://blog.csdn.net/zhzht19861011/category_9265276.html)

[ FreeRTOS+CubeMX系列第一篇——初识FreeRTOS_cubemx freertos](https://blog.csdn.net/weixin_44793491/article/details/107577711)

[飞起的小田博客](https://www.cnblogs.com/tianxxl/tag/STM32CubeIDE/)



## 教学大纲

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230304153839.webp)



## FreeRTOS介绍

FreeRTOS(读作"free-arr-toss")是一个嵌入式系统使用的开源实时操作系统。它的主要工作是 `执行任务`，大部分FreeRTOS的代码都涉及优先权，调度以及执行用户自定义任务。

以前在使用 51,STM32单片机裸机(未使用操作系统)的时候一般都是在 main函数 里面用 while(1) 做一个大循环来完成所有的处理，即 `应用程序` 是一个 `无限的循环` ，循环中调用相应的函数完成所需的处理。有时候我们也需要中断中完成一些处理。相对多任务系统而言，这个就是 `单任务系统`(也称为前后台系统)。中断服务函数就是 `前台程序`，大循环while(1) 就是 `后台程序`。

裸机开发：实时性差，前后台各个任务都是排队等着轮流执行；但是这种前后台系统简单，资源消耗也少

多任务系统开发：把一个大问题(应用)"分而治之"，把大问题划分为很多小问题，然后逐步把小问题解决掉，大问题也就随之解决(这些小问题可以单独作为一个小任务来处理)，这些小任务是<span style="color:red">并发处理的</span>，注意，<span style="color:red">并不是说同一时刻一起执行很多任务，而是由于每个任务执行的时间很短，导致看起来像是同一时刻执行了很多任务一样。</span>

`任务调度器`：哪个任务先执行，哪个任务后执行?

FreeRTOS 是一个 `抢占式` 的实时多任务系统，任务调度器也是抢占式的

`抢占式调度`：高优先级任务可以打断低优先级任务，抢占式调度，是最高优先级的任务一旦就绪，总能得到CPU的执行权；它抢占了低优先级的运行机会，在抢占式调度系统中，总是运行 `最高优先级的任务`

`时间片轮转调度`：让相同优先级的几个任务轮流运行，每个任务运行一个时间片，任务在时间片运行后操作系统自动切换到下一个任务运行；在任务运行的时间片中，也可以提前让出CPU运行权，把它交给下一个任务运行。FreeRTOS的时间片固定为 `一个时钟节拍`，由 `configTICK_RATE_HZ` 这个宏定义

```cpp
/********FreeRTOSConfig.h********/
# define configTICK_RATE_HZ			( ( TickType_t ) 1000 )
```



## FreeRTOS文件结构

首先去[官网](https://www.freertos.org) 点击 `Download FreeRTOS` --- 点击下载`FreeRTOS 202112.00`即可

```cpp
FreeRTOSv10.4.1
    |
    | -- FreeRTOS
            | -- Demo	存放演示例程工程 
            | -- License	存放许可证
            | -- Source		存放实时内核源文件
                    | -- include	API头文件
                    | -- portable	提供一些会被 FreeRTOS 核心代码调用的函数
                    | -- croutine.c	 协程相关 ，以前片子资源不够的时候用，现在用的人很少了
                    | -- event_groups.c	事件组
                    | -- list.c	列表结构描述，在内核整体控制上都使用了列表格式数据处理,一切数据结构的基础
                    | -- queue.c	消息队列用于task间通信和同步
                    | -- stream_buffer.c	流缓冲区
                    | -- tasks.c	任务相关的函数
                    | -- timers.c	软定时器
    |
    | -- FreeRTOS-Plus	内核以外的附加的组件
            | -- Demo
            | -- Source
                    | -- FreeRTOS-Plus-CLI 	指令交互
    				| -- FreeRTOS-Plus-IO	提供不同硬件设备I/O引脚的通信接口
    				| -- FreeRTOS-Plus-TCP	TCP/IP协议组件
    				| -- FreeRTOS-Plus-UDP	UDP组件    
    				| -- FreeRTOS-Plus-Trace	可视化跟踪   
```



## 第1讲

### FreeRTOS的启动流程

{% note blue 'fas fa-fan' flat %}FreeRTOS启动流程{% endnote %}

FreeRTOS主要有两种比较流行的启动方式：

1. 在main函数中将硬件初始化 ，RTOS系统初始化，同时创建所有任务，再启动RTOS调度器

```cpp
//伪代码

#include "xxx.h"

int main(void)
{
    Hardware_init();	//硬件初始化
    RTOS_init();	//RTOS初始化
    RTOS_TaskCreate(Task_n);	//创建任务1
    RTOS_TaskCreate(Task_n);	//创建任务n
    RTOS_Start();	//RTOS启动，开始任务调度
}

//任务1函数
void Task_1()
{
    for(;;)
    {
        ...
    }
}

//任务n函数
void Task_n()
{
    for(;;)
    {
        ...
    }
}
```



1. 在main函数中将硬件初始化 ，RTOS系统初始化，只创建一个启动任务，再启动RTOS调度器。之后，在启动任务中创建各种应用任务，当所有任务创建完成，启动任务把自己删除。

```cpp
//伪代码

#include "xxx.h"

int main(void)
{
    Hardware_init();	//硬件初始化
    RTOS_init();	//RTOS初始化
    RTOS_TaskCreate(AppTaskCreate);	//创建总任务
    RTOS_Start();	//RTOS启动，开始任务调度
}

void AppTaskCreate()
{
    //创建任务1
    RTOS_TaskCreate(Task_1);
    //创建任务n
    RTOS_TaskCreate(Task_n);
    //创建完应用任务删除自身释放内存
    RTOS_TaskDelate(AppTaskCreate);
}

//任务1函数
void Task_1()
{
    for(;;)
    {
        ...
    }
}

//任务n函数
void Task_n()
{
    for(;;)
    {
        ...
    }
}
```



## 第2讲

### FreeRTOS编程风格

- FreeRTOS使用的数据类型虽然都是标准C的数据类型，但都进行了重定义，取了个新名字

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230304172108.webp)

需要注意的是， `char`数据类型可以通过keil指定了有符号或者无符号， `默认为无符号`。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230304172250.webp)



- 因为STM32属于32位架构,所以CubeMX配置默认把 `configUSE_16_BIT_TICKS` Disable掉，但是可以通过修改 `FreeRTOSConfig.h`

| 数据类型(主要是4种) | 说明                                                         |
| :-----------------: | ------------------------------------------------------------ |
|     TickType_t      | 如果用户使能了宏定义 `configUSE_16_BIT_TICKS`，那么 TickType_t 定义的就是 16 位无符号数<br>如果没有使能，那么 TickType_t 定义的就是 32 位无符号数。 对于 32 位架构的处理器，一定要禁止此宏定义，即设置此宏定义数值为 0 即可【CubeMX配置里默认禁止了】 |
|     BaseType_t      | 对于 32 位架构，BaseType_t 定义的是 32 位有符号数<br>对于 16 位架构，BaseType_t 定义的是 16 位有符号数。 如果 BaseType_t 被定义成了 char 型，要特别注意将其设置为有符号数，因为部分函数的返回值是用负数来表示错误类型。 |
|     UBaseType_t     | 这个数据类型是 BaseType_t 类型的无符号版本                   |
|     StackType_t     | 栈变量数据类型定义，这个数量类型由系统架构决定，对于 16 位系统架构，StackType_t 定义的是16 位变量，对于 32 位系统架构，StackType_t 定义的是 32 位变量。 |

- FreeRTOS里的变量的命名

在FreeRTOS中，定义变量时，把变量的类型作为前缀，方便用户通过变量即可知道变量的类型

 `uint32_t`  定义的变量都加上前缀  `ul`【 u 代表 unsigned 无符号，l 代表 long 长整型】
 `uint16_t`  定义的变量都加上前缀  `us`【 u 代表 unsigned 无符号，s 代表 short 短整型】
 `uint8_t`  定义的变量都加上前缀  `uc`。【u 代表 unsigned 无符号，c 代表 char 字符型】

指针变量会加上前缀  `p` 

 `char`  定义的变量只能用于 ASCII 字符，前缀使用 c

 `char *` 定义的指针变量只能用于 ASCII 字符串，前缀使用 pc

其它比如结构体、任务句柄等前缀是x，无符号则是 `ux`

- 函数

加上了  `static`  声明的函数，定义时要加上前缀  `pr` ，这个是单词 private(私人) 的缩写

带有返回值的函数，根据返回值的数据类型，加上相应的前缀，如果没有返回值，即 void 类型
，函数的前缀加上字母  `v`

根据文件名，文件中相应的函数定义时也将文件名加到函数命名中，比如 tasks.c 文件中函数
vTaskDelete，函数中的 task 就是文件名中的 task

- 宏定义

在FreeRTOS中，宏用 `大写字母` 表示，并 `配有小写字母作为前缀`，前缀用于指示该宏在哪个头文件定义。

| 此外，有几个通用的宏定义贯穿FreeRTOS的整个代码，都是表示0与1的宏(pd前缀表示`portable data便携式数据1`) |
| :----------------------------------------------------------: |
|                         pdTRUE --- 1                         |
|                        pdFALSE --- 0                         |
|                         pdPASS --- 1                         |
|                         pdFAIL --- 0                         |

### FreeRTOS调试方法

`处理器利用率`：处理器利用率其实就是系统运行的程序占用的CPU资源，表示机器在某段时间程序运行的情况，如果这段时间中，程序一直在占用CPU的使用权，那么可以认为CPU的利用率是100%；CPU的利用率越高，说明机器在这个时间上运行了很多程序，反之较少。利用率的高低与CPU强弱有直接关系。

需要了解任务的执行状态，任务栈的使用情况以及各个任务的 CPU 使用率，这时就需要用到官方提供的两个函数 `vTaskList`  和  `vTaskGetRunTimeStats`，然后通过串口打印出来【另外有一点要特别注意，这种调试方式仅限测试目的，实际项目中不要使用，这种测试方式比较影响系统实时性】

为了获取 FreeRTOS 的任务信息，需要创建一个定时器， `这个定时器的时间基准精度要高于系统时钟节拍`，这样得到的任务信息才准确。这里提供的函数仅用于测试目的，切不可将其用于实际项目，原因有两点：

1. FreeRTOS 的系统内核没有对总的计数时间做溢出保护。
2. 定时器中断是 50us 进入一次，比较影响系统性能。

这里使用的是 32 位变量来保存 50us 一次的计数值，最大支持计数时间(运行时间超过了 59.6 分钟将不准确)：

$2^{32} \times 50us / 3600s = 59.6 \text{分钟}$

 {% note blue 'fas fa-fan' flat %}CubeMX配置{% endnote %}

- 第一个宏用来使能 `运行时间统计功能`，第二个宏用来使能 `可视化追踪功能`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230303161450.webp)

- 如果第二个宏设置为1，则下面两个宏必须被定义：

1. `portCONFIGURE_TIMER_FOR_RUN_TIME_STATS()`

用户程序需要 `提供一个基准时钟函数`，函数完成初始化基准时钟功能，这个函数要被define到宏portCONFIGURE_TIMER_FOR_RUN_TIME_STATS()上。这是因为 `运行时间统计需要一个比系统节拍中断频率还要高分辨率的基准定时器`，否则，统计可能不精确。基准定时器中断频率要比系统节拍中断 `快10~20倍`。基准定时器中断 `频率越快，统计越精准，但能统计的运行时间也越短`（比如，基准定时器10ms中断一次，8位无符号整形变量可以计到2.55秒，但如果是1秒中断一次，8位无符号整形变量可以统计到255秒）。


2. `portGET_RUN_TIME_COUNTER_VALUE()`

用户程序需要 `提供一个返回基准时钟当前“时间”的函数`，这个函数要被define到宏portGET_RUN_TIME_COUNTER_VALUE()上。

- 定时50us

$Hz = \frac{1}{(50/1000000)s} = 20000$

$Arr = \frac{1000000}{20000} = 50$

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230304191415.webp)



上面那两个宏是MX封装FreeRTOS的函数的，可在 `FreeRTOSConfig.h`查看：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230304204449.webp)

```cpp
/*main.c*/

volatile uint32_t sys_time = 0UL;	//系统时间计数


int main(void)
{
    HAL_TIM_Base_Start_IT(&htim6);	//开启定时器6
    ...
}

void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim)
{
  if(htim->Instance == TIM6)
  {
	  sys_time++;
  }
}
```

```cpp
/*AllTask.c*/

//创建一个打印任务

//打印任务 
void vPrint_CPU_function(void *pvParameters)
{
	uint8_t CPU_Run[500];	//保存任务运行时间信息
	
	for(;;)
	{
		vTaskList((char*)&CPU_Run);	
		printf("-----------------------------------------------------------------------------------------\r\n");
		printf("任务名                                  任务状态  优先级  剩余栈  任务序号\r\n");
		printf("%s",CPU_Run);
		printf("-----------------------------------------------------------------------------------------\r\n");
		
		vTaskGetRunTimeStats((char*)&CPU_Run);
		printf("-----------------------------------------------------------------------------------------\r\n");
		printf("任务名                                 运行计数              利用率\r\n");
		printf("%s",CPU_Run);
		printf("-----------------------------------------------------------------------------------------\r\n");
		
		osDelay(1000);
	}
	vTaskDelete(NULL);
}

//实现下面两个函数

//初始化定时器
void configureTimerForRunTimeStats(void)
{
	sys_time = 0;	//清零计数时间
}

//获取当前系统的运行时间计数器的值
unsigned long getRunTimeCounterValue(void)
{
	return sys_time;	//返回计数时间
}
```



![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230305112343.webp)



## 第3讲

### 系统配置说明

关于系统配置可参考官网：https://www.freertos.org/zh-cn-cmn-s/a00110.html

 `FreeRTOSConfig.h` 根据正在构建的应用程序定制FreeRTOS内核。因此，它特定于应用程序，而不是FreeRTOS，并且应该位于应用程序目录中，而不是位于FreeRTOS内核源代码目录中。

另外，大部分配置选项在 `FreeRTOS.h` 文件中都有默认的配置，在应用时，把需要的配置选项放在 `FreeRTOSConfig.h` 文件即可。

在 `FreeRTOS.h` 里首先是引入 `FreeRTOSConfig.h` 头文件，然后宏定义定义是如下格式：

```cpp
#ifndef INCLUDE_xTaskGetIdleTaskHandle
	#define INCLUDE_xTaskGetIdleTaskHandle 0
#endif

//意思是如果用户在 FreeRTOSConfig.h 没有定义 "INCLUDE_xTaskGetIdleTaskHandle 1" 则默认定义为 "#define INCLUDE_xTaskGetIdleTaskHandle 0"
```



### Config开始的宏

- 内核配置

|                   宏                    | 说明                                                         |
| :-------------------------------------: | :----------------------------------------------------------- |
|          configUSE_PREEMPTION           | 1--抢占式调度器<br>0--合作式调度器【项目一般不用合作式】     |
| configUSE_PORT_OPTIMISED_TASK_SELECTION | 此配置用于优化优先级列表中要执行的最高优先级任务的算法。对CM内核的移植文件，默认已经在文件 `portmacro.h` 文件中使能。<br>通用方式--0，所有平台的移植文件都可以配置为0，纯c编写，比专用效率低，可用的优先级数量不限制<br>专用方式--1，部分平台支持，这些平台架构有专用的汇编指令，通过这些指令可以加快算法执行速度，比通用方式高效，有最大优先级数限制通常限制为32个 |
|         configUSE_TICKLESS_IDLE         | 1--使能tickless低功耗模式<br>0--禁能tickless低功耗模式【一般涉及到低功耗产品才使能】 |
|           configCPU_CLOCK_HZ            | 定义CPU的主频，单位Hz                                        |
|           configTICK_RATE_HZ            | 定义系统时钟节拍数，单位Hz，一般取1000Hz即可，设置过高会增加系统负荷 |
|          configMAX_PRIORITLES           | 定义可供用户使用的最大任务优先级数                           |
|        configMINIMAL_STACK_SIZE         | 定义空闲任务的栈空间大小，单位字(即4字节)【默认是128字(512字节)】 |
|          configTOTAL_HEAP_SIZE          | 定义堆大小，FreeRTOS内核，用户动态内存申请，任务栈，任务创建，信号量创建，消息队列创建等都需要用到这个空间【即把单片机RAM分一部分给FreeRTOS剩下的部分由用户自己使用】 |
|         configMAX_TASK_NAME_LEN         | 定义任务名最大字符数，末尾的结束符'\0'也包含在内             |
|         configUSE_16_BIT_TICKS          | 系统时钟节拍数使用 TickType_t 数据类型定义的【默认32位单片机配置为0】 |
|         configIDLE_SHOULD_YIELD         | 用于使能与空闲任务同优先级的任务，只有满足以下两个条件此配置才有效：<br>1. 使能抢占式调度器<br>2. 有创建与空闲任务同优先级的任务【实际应用不建议用户使用此功能默认为0即可】 |
|      configUSE_TASK_NOTIFICATIONS       | 1--使能任务间直接的消息传递，包含信号量，时间标志组和消息邮箱<br>0--禁用此功能 |
|            configUSE_MUTEXES            | 1--使能互斥信号量<br>0--禁能互斥信号量                       |
|       configUSE_RECURSIVE_MUTEXES       | 1--使能递归互斥信号量<br>0--禁能递归互斥信号量               |
|      configUSE_COUNTING_SEMAPHORES      | 1--使能计数信号量<br>0--禁能计数信号量                       |
|        configQUEUE_REGISTRY_SIZE        | 通过此定义来设置可以注册的信号量和消息队列个数               |
|          configUSE_QUEUE_SETS           | 1--使能消息队列<br>0--禁能消息队列                           |
|         configUSE_TIME_SLICING          | 1--使能时间片调度<br>0--禁能时间片调度【默认在 `FreeRTOS.h`里配置为1了】 |

- 其他配置

钩子函数主要功能是用于函数的扩展，用户可以根据自己的需要在里面添加相关的测试函数

|                  宏                  | 说明                                                         |
| :----------------------------------: | :----------------------------------------------------------- |
|         configUSE_IDLE_HOOK          | 1--使能空闲任务的钩子函数<br>0--禁能空闲任务钩子函数         |
|     configUSE_MALLOC_FAILED_HOOK     | 当创建任务，信号量或者消息队列时，FreeRTOS通过函数pvPortMalloc()申请动态内存。<br>1--使能动态内存申请失败时的钩子函数<br>0--禁能动态内存申请失败时的钩子函数 |
|         configUSE_TICK_HOOK          | 1--使能滴答定时器中断里面执行的钩子函数<br>0--禁能滴答定时器中断里面执行的钩子函数 |
|    configCHECK_FOR_STACK_OVERFLOW    | FreeRTOS的栈溢出检测支持两种方法，为了方便描述，我们这里将其称之为方法一和方法二。<br>2--栈溢出检测使用方法2<br>1--栈溢出检测使用方法1<br>0--禁止栈溢出检测 |
|    configGENERATE_RUN_TIME_STATS     | 1--使能任务运行状态参数统计<br>0--禁止此特性                 |
|       configUSE_TRACE_FACILITY       | 1--将添加额外的结构体成员和函数以此来协助可视化和跟踪<br>0--禁能此特性 |
| configUSE_STATS_FORMATTING_FUNCTIONS | 用户配置宏定义 `configUSE_TRACE FACILITY` 和 `configUSE STATS FORMATTING FUNCTIONS` 都为1的时候，将使能函数 `vTaskList()` 和 `vTaskGetRanTimeStats()` ，如果两者中任何一个为0，那么这两个函数都将被禁能 |

- 合作式任务配置(不需要用到)

|               宏                | 说明                                                   |
| :-----------------------------: | :----------------------------------------------------- |
|      configUSE_CO_ROUTINES      | 1--使能合作式调度相关函数<br>0--禁能合作式调度相关函数 |
| configMAX_CO_ROUTINE_PRIORITIES | 此参数用于定义可供用户使用的最大的合作式任务优先级数   |

- 软件定时器配置

|              宏              | 说明                                                         |
| :--------------------------: | :----------------------------------------------------------- |
|       configUSE_TIMERS       | 1--使能软件定时器<br>0--禁能软件定时器【它是通过滴答定时器来配置很多软件定时器的】 |
|  configTIMER_TASK_PRIORITY   | 配置软件定时器任务的优先级                                   |
|   configTIMER_QUEUE_LENGTH   | 配置软件定时器命令队列的长度【相当于软件定时器的个数】       |
| configTIMER_TASK_STACK_DEPTH | 配置软件定时器任务的栈空间大小                               |

- 中断相关

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230305151844.webp)

|                      宏                      | 说明                                                         |
| :------------------------------------------: | :----------------------------------------------------------- |
|   configLIBRARY_LOWEST_INTERrUPT_PRIORITY    | 配置中断最低优先级，通常为15(因为STM32的抢占优先级最多设置为4bit，优先级最低只能设置为15)，此参数用于配置SysTick与PendSV |
| configLIBRARY_MAX_SYSCALL_INTERRUPT_PRIORITY | 配置系统可管理的最高优先级，此参数用于配置BASEPRI寄存器，设置为5则优先级数值为0,1,2,3,4的中断是不受FreeRTOS管理的，不可被屏蔽，也不能调用FreeRTOS的API接口函数，而中断优先级在5~15的中断受系统FreeRTOS管理，可以被屏蔽 |

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230305152133.webp)

`理解`：这3个是FreeRTOS产生的中断：

1.  `xPortSysTickHandler` 是用于处理系统的时钟节拍，实现任务调度和时间管理等功能
2.  `xPortPendSVHandler `当系统需要切换任务时，会触发一个特殊的中断——PendSV中断，并调用xPortPendSVHandler函数。
3.  `vPortSVCHandler `系统调用是通过软中断（SWI）实现的。当程序执行svc指令时，会触发软中断，并调用vPortSVCHandler函数。通过vPortSVCHandler函数的处理，FreeRTOS能够实现系统调用和任务管理等功能，例如创建任务、删除任务、延时等待、获取系统时间等。这些功能都是由内核提供的，通过系统调用的方式



### include 开始的宏

以 `INCLUDE` 开头的宏允许您的应用程序将未使用的实时内核组件从您的工程中移除，这可节约嵌入式应用程序所需的任何ROM或RAM。
每个宏都采用以下形式:

```cpp
INCLUDE_FunctionName
```

其中 FunctionName表示可以选择性地排除的API函数（或函数集) `要包含API函数，请将宏设置为1，要排除该函数，请将宏设置为0`。



### 断言配置

STM32CubeMX生成的，在 `FreeRTOSConfig.h` 有定义，而且在大量地方有使用断言

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230305132138.webp)

`理解`：如果条件 x 不成立，即 x 的值为 0，那么执行以下步骤：

1. 禁用中断，防止出现其他错误
2. 进入一个无限循环，程序会一直卡在这里，直到被复位或者重新启动 这个宏定义主要用于在程序运行时检查某些关键条件是否满足，如果不满足则强制停止程序的运行，避免出现未知的错误。通常情况下，这个宏定义会被用在嵌入式系统开发中，以确保系统的稳定性和可靠性。

在HAL库也有类似断言，在GPIO初始化那，如果参数不是那7个GPIO组就会报错

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230305150527.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230305150242.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230305150536.webp)





### MX里参数配置

- 根据文档可以知道哪些型号单片机支持跑FreeRTOS的：[微控制器和编译器工具链支持 FreeRTOS](https://www.freertos.org/zh-cn-cmn-s/RTOS_ports.html)；我们这次测试的是蓝桥杯嵌入式开发比赛的板子 `STM32G431RBT6`，它基于 `ARM Cortex-M4F` 架构，支持FreeRTOS【原本打算用标准库去学习FreeRTOS但是官方从F4系列开始就不更新标准库了所以只能使用HAL库学习】



{% note blue 'fas fa-fan' flat %}CubeMX参数详解{% endnote %}

`lnterface`：选择CMSIS_v1【版本1】

{% note simple %}

【Config parameters 选项详解】

- `API，Versions`：都是一些版本信息

- `MPU/FPU`：STM32处理器中的两种特殊处理单元，MPU是内存保护单元，用于保护系统内存；而FPU则是浮点运算单元，用于处理浮点数运算的指令【使不使能无所谓】

- `Kernel settings`：内核设置

|               选项                | 解释                                                         |
| :-------------------------------: | :----------------------------------------------------------- |
|          USE_PREEMPTION           | 设置为 1 以使用 `抢占式`  rtos 调度程序<br>设置为 0 以使用 `协作式`  rtos 调度程序(即时间片) |
|           CPU_CLOCK_HZ            | 这必须设置为驱动用于生成内核周期性滴答中断的外设的时钟频率，这通常但不总是等于主系统时钟频率【CPU 时钟频率】 |
|           TICK_RATE_HZ            | 设置滴答中断频率，值以 `HZ`  为单位指定，直接影响到计时的分辨率，精度越高，占用CPU时间越多，范围 `1~1000`；多个任务可以共享一个优先级，RTOS调度器为相同优先级的任务分享CPU时间，在每一个RTOS 系统节拍中断到来时进行任务切换。高的系统节拍中断频率会降低分配给每一个任务的“时间片”持续时间。【一般默认为1000也就是1ms】 |
|          MAX_PRIORITIES           | 能够分配给任务的最大优先级，范围 `4~32`，比如设置为4，那么你可以使用的优先级号是0--1--2--3，如果程序里超出的话则强制为 `MAX-1` |
|        MINIMAL_STACK_SIZE         | 设置分配给空闲任务的堆栈大小值在这里以 `uint32 为单位(字)`；应该考虑线程的数量、总堆大小和系统栈大小， `栈的大小不能超过总堆的空间`，当动态分配时， `最大值 = configTOTAL_HEAP_SIZE/4`；当静态分配时， `最大值 = MCU ram size/4`；空闲任务 `优先级最低`，通常用来执行一些系统维护任务，比如检查任务堆栈使用情况，定期释放不再使用的内存，管理硬件等等【这个选项只影响空闲任务不会影响用户创建的任务】 |
|         MAX_TASK_NAME_LEN         | 任务名的最大（ASCII）字符数，包括字符串结束符NULL(’\0’)，范围 `12–255` |
|         USE_16_BIT_TICKS          | tick 计数值保存在一个 portTickType 型的变量中。STM32 只能 0<br>1-则 portTickType 为 `无符号 16bit`<br>0-则 portTickType 为 `无符号32bit` |
|         IDLE_SHOULD_YIELD         | 当任务具有空闲优先级且内核系统使用了抢占式调度器，则：<br>0-阻止空闲任务为其它具有空闲优先级的任务让出CPU，只有当空闲任务离开运行状态才能被抢占。<br>1-如果有另外一个空闲优先级的任务在准备状态，则空闲任务立刻让出CPU，让该任务运行【一般默认0】 |
|            USE_MUTEXES            | 1–使用互斥量<br>0–忽略互斥量<br>未使用 `cmsis rtos v2` 时允许使用这两个值【一般默认1】<br>临界区机制 |
|       USE_RECURSIVE_MUTEXES       | 当USE_MUTEXES=1才有意义。<br>1–使用递归互斥量<br>0–忽略递归互斥量 |
|      USE_COUNTING_SEMAPHORES      | 1–使用计数信号量<br>0–忽略计数信号量                         |
|        QUEUE_REGISTRY_SIZE        | 通过此宏定义来设置可以注册的信号量和消息队列个数<br>队列注册有2个目的，都与操作系统内核的调试器有关：<br>1、注册队列的时候，可以给队列起一个名字当使用调试组件时通过名字可以很容易区分不同队列。<br>2、它包含调试器所需的信息来定位每个已注册的队列和信号量。<br>如果想使用内核调试器查看队列和信号量信息，必须先将这些队列和信号量进行注册。参见 `vQueueAddToRegistry()`和 `vQueueUnregisterQueue()`，如果用户没有使用内核方面的调试器这个宏定义是没有意义的 |
|     USE_APPLICATION_TASK_TAG      | 1–vTaskSetApplicationTaskTag 函数有效<br>仅用于高级用户<br>可以为每个任务分配一个“tag”值。 此值仅用于应用程序，RTOS 内核本身并不以任何方式使用它。 |
|   ENABLE_BACKWARD_COMPATIBILITY   | 头文件 FreeRTOS.h 包含一系列 #define 宏定义，这些宏将 FreeRTOS 8.0.0 版本之前使用的数据类型的名称映射到版本 8.0.0 中使用的名称。<br>这些宏可以确保RTOS内核升级到V8.0.0版本时，之前的应用代码不用做任何修改。<br>0–会去掉这些宏定义，需要用户确认应用代码没有用到8.0.0版本之前的（原本需要映射的）名字<br>相当于兼容旧版本的一个功能【一般默认1】 |
| USE_PORT_OPTIMISED_TASK_SELECTION | 可以根据不同型号的单片机优化任务调度的选择，从而有效地提高系统的效率，用于优化优先级列表中要执行的最高优先级任务的算法【由于Freertos v9 支持，强制启用 1】 |
|         USE_TICKLESS_IDLE         | 1-使能tickless低功耗<br>0-禁用tickless低功耗<br>它可以通过在系统处于空闲状态时关闭定时器中断来实现，从而减少系统的能耗 |
|      USE_TASK_NOTIFICATIONS       | 1-使能任务间直接的消息传递，包括信号量，事件标志组和消息邮箱<br>0-禁用此功能，每个任务节省8字节<br>每个RTOS任务都有 `32位的通知值`。RTOS任务通知是直接发送到任务的事件，它可以解除对接收任务的阻塞，并且可以更新接收任务的通知值 |
|     RECORD_STACK_HIGH_ADDRESS     | 1-启用时，假设堆栈向下增长，堆栈起始地址将保存到每个任务 tcb 中 |

- `Memory management settings`：内存管理设置

|           选项           | 解释                                                         |
| :----------------------: | ------------------------------------------------------------ |
|    Memory Allocation     | Dynamic(动态)<br>static(静态)<br>Dynamic/static(动态或者静态)【一般选择动态】 |
|     TOTAL_HEAP_SIZE      | rtos 内核可用的 ram 总量，范围 `512字节~32000字节`【stm32G4的SRAM最大是32K】 |
| Memory Management scheme | 内存管理方案，会管理你的动态内存分配后剩余的零碎【一般选择heap_4】 |

- `Hook function related definitions`：钩子函数相关定义

|             选项             | 解释                                                         |
| :--------------------------: | ------------------------------------------------------------ |
|        USE_IDLE_HOOK         | `当FreeRTOS空闲时` ，Idle Hook选项允许用户定义一个函数来完成一些特定的工作，比如进行资源释放、状态检查等。使用该选项可以有效地利用空闲时间，而不必浪费系统资源 |
|        USE_TICK_HOOK         | tick hook 函数是一个钩子或回调函数， `它可以在每次FreeRTOS计时器溢出时被调用`，以实现一些特定的功能。例如，用户可以使用它来检查任务的执行情况，监控任务的堆栈使用情况，以及进行资源释放等。 |
|    USE_MALLOC_FAILED_HOOK    | 它可以 `在系统申请内存失败时被调用`，以实现一些特定的功能。例如，用户可以使用它来报告内存分配错误，以帮助调试程序，或者可以采取恢复措施，比如释放空闲的资源等。 |
| USE_DAEMON_TASK_STARTUP_HOOK | 它可以在 `后台任务启动时被调用`，以实现一些特定的功能。例如，用户可以使用它来报告任务的启动状态，或者可以初始化一些系统资源，以便后台任务可以正常运行。 |
|   CHECK_FOR_STACK_OVERFLOW   | 它可以 `检查任务的堆栈` 使用情况，以判断是否发生堆栈溢出。如果发生堆栈溢出，FreeRTOS就会调用一个钩子函数，以便用户可以采取恢复措施，例如重新启动任务或系统等。 |

- `Run time and task stats gathering related definitions`：任务运行信息获取配置

|              选项              | 解释                                                         |
| :----------------------------: | ------------------------------------------------------------ |
|    GENERATE_RUN_TIME_STATS     | 1-使能任务运行状态参数统计<br>0-禁用此功能<br>它可以收集有关系统运行情况的统计信息，如 `系统的运行时间、任务的CPU占用情况等`。这些信息可以帮助用户调试程序，或者可以帮助用户优化系统的性能。 |
|       USE_TRACE_FACILITY       | 1-使能此配置将添加额外的结构体成员和函数，以此来协助可视化和跟踪，在使用LAR中的FreeRTOS<br>0-禁用此功能<br>插件时需要使能这个配置，否则无法显示任务栈的使用情况<br>它可以跟踪系统中任务的执行情况，可以帮助用户更好地调试系统。它可以 `跟踪系统中所有任务的运行状态，例如挂起状态、就绪状态、正在运行状态等`，以便用户可以更好地了解系统的运行情况。 |
| USE_STATS_FORMATTlNG_FUNCTIONS | 当 `USE_TRACE_FACILITY` 和 此函数都为1时将使能 `vTaskList()`函数和 `vTaskGetRunTimeStats()`函数；只要其中一个为0那这两个函数无效。<br>它可以 `将系统的运行状态信息格式化为文本`。使用这个选项，可以 `方便地将系统的运行状态信息打印到控制台或文件中，以便进行调试和分析`。 |

- `Co-routine related definitions`：合作式任务配置(一般资源不够的单片机才用)

|           选项            | 解释                                                         |
| :-----------------------: | ------------------------------------------------------------ |
|      USE_CO_ROUTINES      | 1-使能合作式调度相关函数<br>0-禁用合作式相关函数<br>协程是一种更灵活的任务模型，它可以更轻松地实现一些复杂的任务。使用这个选项，可以方便地将一些复杂的任务实现在FreeRTOS上，使系统更加灵活。 |
| MAX_CO_ROUTINE_PRIORITIES | 它用于指定协程的最大优先级数量。使用这个选项，可以指定系统中最多可以有多少个不同优先级的协程。这将有助于更好地调度任务，提高系统的性能。 |

- `Software timer definitions`：软件定时器配置

|    选项    | 解释                                                         |
| :--------: | ------------------------------------------------------------ |
| USE_TIMERS | 它允许用户在FreeRTOS中使用定时器。使用定时器，可以方便地在系统中设定指定时间段内执行任务，从而更好地调度任务，提高系统的性能。就是当单片机定时器不够时再打开 |

- `lnterrupt nesting behaviour configuration`：中断嵌套行为配置

|                  选项                  | 解释                                                         |
| :------------------------------------: | ------------------------------------------------------------ |
|   LIBRARY_LOWEST_INTERRUPT_PRIORITY    | 此宏定义是用来配置FreeRTOS用到的SysTick中断和PendSV中断的优先级。在NVIC分组设置为4的情况下，此宏定义的范围就是0~15，即SysTick和PendSV都配置为了最低优先级， `实际项目也推荐配置成最低优先级`。 |
| LIBRARY_MAX_SYSCALL_INTERRUPT_PRIORITY | 定义了受FreeRTOS管理的最高优先级中断。简单的说就是允许用户在这个中断服务程序里调用FreeRTOS的API的最高优先级。设置NVIC为4的情况下，配置LIBRARY_MAX_SYSCALL_INTERRUPT_PRIORITY为0x01表示用户可以在抢占式优先级为1~15的中断里调用FreeRTOS的API函数，抢占式优先级为0的中断里面不允许调用 |

- Added with 10.2.1 support(这个没什么用)

{% endnote %}

{% note simple %}

【lnclude parameters 选项详解】

可参考文章：[FreeRTOS系列第12篇---FreeRTOS任务应用函数](https://blog.csdn.net/zhzht19861011/article/details/50498173)

| 函数                         | 描述                               | 作用                                                         |
| :--------------------------- | ---------------------------------- | ------------------------------------------------------------ |
| vTaskPrioritySet             | 改变一个任务的优先级               |                                                              |
| ux TaskPriorityGet           | 查询员工任务的优先级               | 查询任务的优先级参数是任务句柄，返回值是UBaseType_t类型      |
| vTaskDelete                  | 删除任务                           |                                                              |
| vTas1kCleanUpResources       | 回收删除任务后的资源(RAM等)        |                                                              |
| vTaskSuspend                 | 时任务进入挂起状态                 |                                                              |
| vTaskDelayUntil              | 使任务进入阻塞状态(绝对时间)       |                                                              |
| vTaskDelay                   | 时任务进入阻塞状态(相对时间)       |                                                              |
| xTaskGetSchedulerState       | 查询调度器状态                     |                                                              |
| xTaskResumeFromlSR           | 将挂起态任务切换成就绪态(中断中)   |                                                              |
| xQueueGetMutexHolder         |                                    |                                                              |
| xSemaphoreGetMutexHolder     | 返回获取函数参数中互斥量的任务句柄 |                                                              |
| pcTaskGetTaskName            | 获取任务的名字                     |                                                              |
| uxTaskGetStackHighWaterMark  | 返回任务启动后的最小剩余堆栈空间   |                                                              |
| xTaskGetCurrentTaskHandle    | 返回运行态任务的句柄               |                                                              |
| eTaskGetState                | 返回任务状态值                     |                                                              |
| xEventGroupSetBitFromISR     | 设置指定的事件组标志位为1(中断中)  |                                                              |
| xTimerPendFunctionCall       |                                    |                                                              |
| xTaskAbortDelay              | 任务切出阻塞态进入就绪态           |                                                              |
| xTaskGetHandle               | 通过函数名字获取函数句柄           |                                                              |
| uxTaskGetStackHighWaterMark2 | 用于获取任务堆栈的高水位标记       | 当任务开始执行时，它的堆栈被填充了一些特定的值，如0xa5、0x5a等。当任务运行时，它的堆栈指针会向下移动，堆栈空间被使用。通过获取堆栈高水位标记，可以知道任务堆栈的最高使用位置，即任务堆栈的剩余空间， `返回的数值越大，表示任务堆栈的剩余空间越大` |

{% endnote %}

{% note simple %}

【Advanced settings(高级设置) 选项详解】

{% endnote %}

{% note simple %}

【User Constants(用户常量) 选项详解】

{% endnote %}

{% note simple %}

【Tasks and Queues(任务和队列) 选项详解】

{% endnote %}

{% note simple %}

【Timers and Semaphores(定时器和信号量) 选项详解】

{% endnote %}

{% note simple %}

【FreeRTOS Heap Usage(FreeRTOS堆使用) 选项详解】

|                  选项                   | 解释(单位Bytes)          |
| :-------------------------------------: | ------------------------ |
|          HEAP STILL AVAILABLE           | 剩余字节数               |
|             TOTAL HEAP USED             | 已使用字节数             |
|         Total amount for tasks          | 任务总占用字节数         |
|         Total amount for queues         | 队列所占字节数           |
|         Total amount for timers         | 定时器所占字节数         |
| Total amount for mutexes and semaphores | 信号量与互斥量所占字节数 |
|         Total amount for events         | FreeRTOS事件数量         |
|             FreeRTOS tasks              | 各任务字节数分配情况     |

{% endnote %}

{% note simple %}

【Mutexes(互斥锁) 选项详解】

{% endnote %}



{% note blue 'fas fa-fan' flat %}CubeMX配置{% endnote %}

如果直接生成代码会弹出：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230301213918.webp)

只是因为FreeRTOS使用了滴答定时器，所以我们需要在SYS那换成别的不冲突的定时器【一般使用TIM7，因为TIM6包括了DAC相关的所以没选，然后中断优先级可以改高点4左右，因为低的话可能造成系统的HALDelay函数被打断】

- 需要注意由于改了SYS的定时器所以它默认会在 `main.c` 生成定时器回调函数所以用户不需要去重复写





## 第4讲

### 任务的概念和状态

{% note blue 'fas fa-fan' flat %}任务的基本概念{% endnote %}

从系统的角度看，任务是竞争系统资源的 `最小运行单元`。

FreeRTOS是一个支持多任务的操作系统，在FreeRTOS中，任务 `可以使用或等待CPU使用内存空间`等系统资源，并独立于其他任务运行。

每个任务在自己的环境中运行，在任何时刻，只有一个任务得到运行，FreeRTOS调度器决定运行哪个任务。 `调度器会不断的启动、停止每一个任务，宏观上看，所有的任务都在同时进行`。

在FreeRTOS中，每个任务都有自己的栈空间(一段连续的内存)，用于保存任务运行环境。任务越多，需要的栈空间就越大，而一个系统能运行多少个任务，取决于系统可用的内存。

任务通常会运行在一个 `死循环` 中，不会退出， `如果不需要某个任务，可以调用FreeRTOS中的删除任务API函数将任务删除，释放系统资源`。

特别的，FreeRTOS支持相同优先级任务， `相同优先级任务之间的调度，采用的是轮询机制`，每个任务分配一定的执行时间。 `不同优先级任务之间的调度，执行的是抢占式调度`。

在任何时刻，只有 `一个任务` 得到运行，RTOS调度器决定运行哪个任务，在任务切入切出时 `保存上下文环境（寄存器值、堆栈内容）`是调度器主要的职责



{% note blue 'fas fa-fan' flat %}任务的状态{% endnote %}

`就绪状态 (Ready)`：任务已经创建，并且可以被调度器运行。当任务被创建时，它处于就绪状态。但是因为有一个同优先级或者更高优先级的任务处于运行状态而还没有真正执行(没有被阻塞和挂起)

`运行状态 (Running)`：当前在 CPU 上运行的任务。只有一个任务能处于运行状态。

`阻塞状态 (Blocked)`：任务被阻塞了，不能被调度器运行。当任务执行阻塞操作时，如等待信号量、邮箱、消息队列，外部中断，调用延时函数等，它将进入阻塞状态。

`挂起状态 (Suspended)`：任务被挂起了，不能被调度器运行。当任务被调用 vTaskSuspend() 挂起时，它将进入挂起状态。(不可以通过设定超时事件而退出挂起状态，只能通过调用xTaskResume()才可以从挂起态恢复)

`删除状态 (Deleted)`：任务已被删除，不能被调度器运行。当任务调用 vTaskDelete() 或者调度器自动删除任务时，它将进入删除状态。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/20151215111938789.webp)



### 系统启动调度与空闲任务

{% note blue 'fas fa-fan' flat %}系统启动{% endnote %}

使用 `vTaskStartScheduler()` 函数启动FreeRTOS调度【osKernelstart里面其实就是调用这个函数只是封装了而已】

使用这个函数要注意以下几个问题：

1. 空闲任务和可选的定时器任务是在调用这个函数后自动创建的。
2. 正常情况下这个函数是不会返回的，如果有返回，极有可能是用于定时器任务或者空闲任务的内存空间不足造成创建失败，此时需要加法FreeRTOS可管理的内存空间。

```cpp
#define configTOTAL_HEAP_SIZE                    ((size_t)10240)
```



{% note blue 'fas fa-fan' flat %}空闲任务{% endnote %}

FreeRTOS 中有一个特殊的任务叫做空闲任务 (Idle task)。这个任务是由 FreeRTOS 自动创建的，它的优先级是最低的，并且当所有其它任务都处于阻塞状态时，调度器会自动切换到这个任务上运行。

空闲任务的主要目的是在系统空闲时执行后台操作，如调整 CPU 的频率，执行计数器或收集统计信息等。

可以通过实现 `xApplicationIdleHook() `函数来指定空闲任务的具体行为，以实现自己的空闲处理逻辑。此函数在空闲任务调用时运行。此函数的默认实现为空函数，如果没有被重定义，空闲任务就不会执行其他任何操作。

 `空闲任务是唯一一个不允许出现阻塞情况的任务`



{% note blue 'fas fa-fan' flat %}空闲任务钩子{% endnote %}

空闲任务钩子是一个函数，每一个空闲任务周期被调用一次。如果你想将任务程序功能运行在空闲优先级上，可以有两种选择：

1. 在一个空闲任务钩子中实现这个功能：因为FreeRTOS必须至少有一个任务处于就绪或运行状态，因此钩子函数 `不可以调用可能引起空闲任务阻塞的API函数`（比如vTaskDelay()或者带有超时事件的队列或信号量函数）。
2. 创建一个具有空闲优先级的任务去实现这个功能：这是个更灵活的解决方案，但是会带来更多RAM开销。
         

```cpp
//创建一个空闲钩子步骤如下：
1.在CubeMX【config parameters】里使能"USE_IDLE_HOOK"选项
2.定义一个函数，函数和参数原型如下：
void vApplicationIdleHook(void);
```

通常， `使用这个空闲钩子函数设置CPU进入低功耗模式`。



### 任务的设计要点

1. 中断服务函数是一种需要特别注意的上下文环境，它运行在非任务的执行环境下（一般为芯片的一种特殊运行模式（也被称作特权模式）），在这个上下文环境中不能使用挂起当前任务的操作， 不允许调用任何会阻塞运行的 API 函数接口。另外需要注意的是， 中断服务程序最好保持精简短小，快进快出，一般在中断服务函数中只做标记事件的发生，然后通知任务，让对应任务去执行相关处理，因为中断服务函数的优先级高于任何优先级的任务，如果中断处理时间过长，将会导致整个系统的任务无法正常运行。所以在设计的时候 必须考虑中断的频率、中断的处理时间 等重要因素，以便配合对应中断处理任务的工作。
2. 做为一个优先级明确的实时系统，如果一个任务中的程序出现了死循环操作（ 此处的死循环是指没有阻塞机制的任务循环体比如while(1)或者其他的），那么比这个任务优先级低的任务都将无法执行。【注意的是任务函数本身是一个死循环没错但是不能在里面再搞死循环这个是需要避免的】
3. 任务设计时，就应该保证任务在不活跃的时候，任务可以进入阻塞态以交出CPU使用权，这就需要我们自己 明确知道什么情况下让任务进入阻塞态，保证低优先级任务可以正常运行。在实际设计中，一般会将紧急的处理事件的任务优先级设置得高一些。
4. 空闲任务（idle任务）是 FreeRTOS系统中没有其他工作进行时自动进入的系统任务 。因为处理器总是需要代码来执行—— 所以至少要有一个任务处于运行态。
5. 除此之外，还需要注意任务的执行时间。任务的执行时间一般是指两个方面， `一是任务从开始到结束的时间`， `二是任务的周期`。



### 任务的创建

创建任务的方式：

1. 静态创建任务：xTaskCreateStatic()，需要自行定义任务栈空间与任务控制块，一般不采用
2. 动态创建任务，xTaskCreate()，系统动态分频任务栈空间与任务控制块，一般是使用此方式

两种动态任务创建的方式，一种是在 `CubeMX中创建任务`；另一种是在 `工程中调用FreeRTOS源码来创建任务`

{% note blue 'fas fa-fan' flat %}CubeMX中创建任务{% endnote %}

CubeMX默认会生成一个函数名为 `StartDefaultTask` 的默认任务

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230302093121.webp)

|       优先级从低到高排序        |
| :-----------------------------: |
|      osPriorityIdle(空闲)       |
|       osPriorityLow (低)        |
| osPriorityBelowNormal(低于正常) |
|     osPriorityNormal(正常)      |
| osPriorityAboveNormal(高于正常) |
|       osPriorityHigh(高)        |
|  osPriorityRealtime(优先实时)   |



在 `main.c` 里自动先初始化任务，然后调用内核启动函数启动你的任务

{% note red 'fas fa-fan' flat %}个人习惯{% endnote %}

- 一般任务设置成 `weak` 方式，这样不修改源代码，在另一个文件里实现它
- 任务函数名和字符串名称，习惯是设置成 `相同的字符串`， `函数名首字母大写`， `字符串名称小写`
- 创建一个 `My_Task`文件夹，创建 `AllTask.c` 和 `AllTask.h` ，这里写你创建的任务实现代码
- 创建一个 `App` 文件夹，里面存放你写的外设驱动代码
- `MINIMAL_STACK_SIZE` 大小一般给大点10240以上，任务看情况调试，默认128字

```cpp
//在CubeMX中创建任务本质上和在工程内创建没有什么不同，都是都调用FreeRTOS源码，只不过CubeMX会对FreeRTOS源码进行二次封装

osThreadId testTaskHandle;	//任务句柄

//任务函数
void TestTASK(void const * argument)
{
    for(;;)
    {
        ...
    }
}
//参数分别是：字符串，函数名，优先级，传入的参数，栈大小
//osThreadDef也不是函数是宏定义，就是把参数赋给结构体成员
//osThread不是函数是宏定义，它使用 ##  拼接字符串变成"os_thread_def_testTask"然后把这个结构体取址赋给创建任务的函数osThreadId osThreadCreate (const osThreadDef_t *thread_def, void *argument)的第一个参数，它是结构体指针类型，创建完后返回值是一个句柄，然后把句柄赋给你定义的句柄testTaskHandle

osThreadDef(testTask, TestTASK, osPriorityNormal, 0, 500);	//参数写到一个结构体
testTaskHandle = osThreadCreate(osThread(testTask), NULL);	//调用封装好的xTaskCreate函数
```



{% note blue 'fas fa-fan' flat %}调用FreeRTOS源码来创建任务{% endnote %}

```cpp
//任务创建函数原型
BaseType_t xTaskCreate(	TaskFunction_t pxTaskCode,	//任务函数
                        const char *const pcName,	//任务名
                        const configSTACK_DEPTH_TYPE usStackDepth,	//任务堆栈大小(单位word)
                        void *const pvParameters,	//任务参数
                        UBaseType_t uxPriority,	//任务优先级
                        TaskHandle_t *const pxCreatedTask 	//任务句柄
                      );
```

|     变量      | 描述                                                         |
| :-----------: | ------------------------------------------------------------ |
|  pxTaskCode   | 函数指针，指向任务函数的入口。任务永远不会返回(死循环)；该参数类型为 `TaskFunction_t` 定义在文件 `projdefs.h` 中，参数类型为空指针类型并返回空类型【任务函数的形参只能是pvParameters】 |
|    pcName     | 任务描述，字符串形式；字符串的最大长度由 `configMAX_TASK_NAME_LEN` 决定默认16(包含'\0')，该宏位于 `FreeRTOSConfig.h` 中【用于调试时方便看是哪个任务】 |
| usStackDepth  | 创建任务时，FreeRTOS内核会为每个任务分配固定的栈空间，栈空间的字数（word），而不是字节数（byte） |
| pvParameters  | void* 指针，当任务创建时，作为一个参数传递给任务，没有的话一般是写 `NULL` |
|  uxPriority   | 任务的优先级，优先级的取值范围为[ `0, configMAX_PRIORITIES - 1`]， `任务优先级越高，其优先级值越大` |
| pxCreatedTask | 用于传出任务的句柄(ID)。这个句柄可以用来操作已经创建的任务，如改变任务优先级、删除任务等。如果不需要任务句柄，可以将pvCreatedTask置为NULL |
|    返回值     | 如果任务创建成功，则返回 `pdPASS` ；如果任务创建失败，则返回相应的错误码(-1/-4/-5)。大部分创建失败的原因，都是因为FreeRTOS无法为任务分配足够的空间导致的，在实际程序中，应该判断该返回值，失败时记录错误码，便于查找问题原因。 |

```cpp
//错误码

//错误无法分配所需的内存
errCOULD_NOT_ALLOCATE_REQUIRED_MEMORY	( -1 )
//错误队列阻塞    
errQUEUE_BLOCKED						( -4 )
//错误队列产量    
errQUEUE_YIELD							( -5 )
```



### 详解任务句柄

- 首先看一下定义的句柄，类型是 `osThreadId`

```cpp
osThreadId testTaskHandle;
```

- 点击 `osThreadId` 跳转一下，可以看到它是重命名的，类型是 `TaskHandle_t`

```cpp
typedef TaskHandle_t osThreadId;
```

- 点击 `TaskHandle_t` 跳转一下，可以看到最终它的类型是 `struct tskTaskControlBlock*`，它是一个指向任务控制块结构体的指针

```cpp
struct tskTaskControlBlock;
typedef struct tskTaskControlBlock* TaskHandle_t;
```

- 然后我们在创建任务时是对指针进行取址 `&testTaskHandle`

```cpp
xTaskCreate(vPrint_CPU_function,"usart1TX_function",TASK1_STACK_SIZE,NULL,TASK1_PRIORITY,&testTaskHandle);
```

- 那说明参数类型是一个指针的指针，函数原型如下(省略了其他参数)：

```cpp
	BaseType_t xTaskCreate(x,x,x,x,x,TaskHandle_t * const pxCreatedTask )
```

- 为什么参数类型是一个指针的指针呢，因为我们的形参 `testTaskHandle`本身是一个指针，然后我们需要传递这个形参，就需要 `&` ，举例：

```cpp
func(int **temp)
{
    **temp += 10;
}

int main(void)
{
    int a = 1;
    int *p1 = &a;
    int *p2 = p1;
    
    func(&p2);
    printf("a = %d\n",a);	//结果是11
}

1.首先在main函数里面定义一个整型变量a，并初始化为1
2.再定义一个指向a的指针p1，并初始化为 &a
3.再定义一个指向p1的指针p2，并初始化为p1
4.调用func函数，并把p2的地址作为参数传递给func函数
5.func函数中的参数是一个指向指针的指针temp，它将指向整型数值+11，因为p2指向p1，p1里面又是存放a的地址，所以p2指向a的地址，所以可以修改a的值
    
注意：
int *p2 = p1;改成int *p2 = &p1;编译是不通过的，因为P1类型是int*，而&p1的类型是int **，但是我们的p2类型是int * 所以类型不一致，想要类型一致则改成 int **p2 = &p1;
然后func函数形参类型要改成三级指针 int ***temp，函数内部改成 ***temp += 10;这样才能正常运行修改a的值
```

- 言归正传继续看这个 `pxCreatedTask`形参 用在哪里(在xTaskCreate函数里，省略了其他参数)，可以看到是直接把这个指针的指针赋值的没有&

```cpp
prvInitialiseNewTask( x, x, x, x, x, pxCreatedTask, x, x );
```

-  `prvInitialiseNewTask` 函数原型(省略了其他参数)，可以看到类型也是指针的指针 `TaskHandle_t * const pxCreatedTask`

```cpp
static void prvInitialiseNewTask(x,
x,x,x,x,TaskHandle_t * const pxCreatedTask,x,x )
```

- 继续看 `pxCreatedTask` 这个形参用在什么地方(在prvInitialiseNewTask函数里)，可以看到是把一个指针类型的 `pxNewTCB` 赋给 `pxCreatedTask`

```cpp
*pxCreatedTask = ( TaskHandle_t ) pxNewTCB;
```

- 再看看 `pxNewTCB`形参的类型是 `TCB_t`类型

```cpp
static void prvInitialiseNewTask(x,x,x,x,x,x,TCB_t *pxNewTCB,x)
```

- 点击 `TCB_t` 跳转可以看到它是一个重命名

```cpp
typedef tskTCB TCB_t;
```

- 点击  `tsKTCB` 跳转可以看到它是一个结构体，通过注释可以知道这个结构体是一个任务控制块

```cpp
/*Task control block......*/
typedef struct tskTaskControlBlock 
{
	...
} tskTCB;
```

- 所以最终下面代码意思就是 将新创建任务的`TCB`结构体的指针`pxNewTCB`转换为一个`TaskHandle_t`类型的句柄，并将其存储到`pxCreatedTask`所指向的地址中，而这个所指向的地址里面存储了一个`TaskHandle_t`类型的变量，而这个变量就是用户定义的句柄：`testTaskHandle`

```cpp
*pxCreatedTask = ( TaskHandle_t ) pxNewTCB;
```



### 任务删除，挂起与恢复

{% note blue 'fas fa-fan' flat %}删除任务函数详解{% endnote %}

```cpp
//函数原型
void vTaskDelete( TaskHandle_t xTaskToDelete );	//参数是任务句柄
```

使用这个函数要注意以下问题：

1. 使用此函数需要在 `FreeRTOSConfig.h` 配置文件里配置宏定义为

```cpp
#define INCLUDE_vTaskDelete                  1
```

2. 如果往此函数里面填的任务ID是 `NULL(即数值0)`，那么删除的就是当前正在执行的任务，此任务被删除后，FreeRTOS会切换到任务就绪列表里面下一个要执行的最高优先级任务
3. 在 FreeRTOS 中，在执行删除任务的时候，并不会释放任务的内存空间，只会 `将任务添加到回收列表中，真正的系统资源回收工作在空闲任务完成`，如果用户在FreeRTOS中调用了这个函数的话，`一定要让空闲任务有执行的机会，否则这块内存是无法释放的`，另外，创建的任务在使用中申请了动态内存，这个内存不会因为任务被删除而删除，这一点一定要注意，`一定要在删除任务前将申请的动态内存释放`
4. 删除时最好判断一下句柄是否为 `NULL`，不为 `NULL`就删除

{% note simple %}

这个回收列表是一个由`TCB`结构体组成的链表，其中每个节点都是一个空闲任务的`TCB`结构体。

{% endnote %}

{% note blue 'fas fa-fan' flat %}挂起任务函数详解{% endnote %}

```cpp
//函数原型
void vTaskSuspend( TaskHandle_t xTaskToSuspend )	//参数是任务句柄
```

使用这个函数要注意以下问题：

1. 使用此函数需要在 `FreeRTOSConfig.h` 配置文件中配置宏定义为

```cpp
#define INCLUDE_vTaskSuspend                 1
```

2. 如果往此函数填写参数为 `NULL(即数值0)` 那么挂起的就是当前正在执行的任务，此任务被挂起后，FreeRTOS会切换到任务就绪列表里面下一个要执行的高优先级任务
3. 多次调用此函数的话，只需调用一次 `vTaskResume`即可将任务从挂起态恢复

{% note blue 'fas fa-fan' flat %}恢复任务函数详解{% endnote %}

恢复任务有两种方式：`普通方式` 和 `中断方式`

普通方式恢复任务函数原型：

```cpp
void vTaskResume( TaskHandle_t xTaskToResume )	//参数是任务句柄
```

使用这个函数需要注意以下问题：

1. 使用此函数需要在 `FreeRTOSConfig.h` 配置文件中配置宏定义为：

```cpp
#define INCLUDE_vTaskSuspend                 1
```

2. 多次调用函数 `vTaskSuspend` 的话，只需调用一次 `vTaskResume`即可将任务从挂起态恢复
3. 此函数是用于任务代码中调用，故不可以在中断服务程序中调用此函数，中断服务程序中使用的是 `xTaskResumeFromISR()` 

中断方式恢复任务函数原型：

```cpp
BaseType_t xTaskResumeFromISR( TaskHandle_t xTaskToResume )	//参数是任务句柄，返回值是成功返回pdTrue 失败返回pdFALSE
```

使用这个函数要注意以下问题：

1. 使用此函数需要在 `FreeRTOSConfig.h` 配置文件中配置宏定义为(第一个已经默认在 `FreeRTOS.h` 里打开了不需要用户去打开)：

```cpp
INCLUDE_xTaskResumeFromISR 1
INCLUDE_vTaskSuspend 1    
```

2. 多次调用函数 `vTaskSuspend` 的话，只需调用一次 `xTaskResumeFromISR`即可将任务从挂起态恢复
3. 如果用户打算采用这个函数实现中断与任务的同步， `要注意一种情况，如果此函数的调用优先于vTaskSuspend被调用，那么此次同步会丢失，这种情况下建议使用信号量来实现同步`
4. 此函数是用于中断服务程序中调用，故不可以在任务中使用此函数
5. 此函数有返回值的，可以通过判断返回值来是否进行任务切换



### 综合实验程序

{% note simple %}

`实验目的`：熟悉任务的创建，删除，挂起，恢复

`按键1`：删除任务LED2

`按键2`：创建任务LED2

`按键3`：挂起任务LED3

`按键4`：恢复任务LED3

`注意`：打印任务优先级不能比LED任务高，不然会影响LED显示

{% endnote %}



{% note blue 'fas fa-fan' flat %}CubeMX配置{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230306154827.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230306154844.webp)



{% note blue 'fas fa-fan' flat %}程序编写{% endnote %}

{% folding, main.c %}

```cpp
int main(void)
{
    HardWare_init();	//硬件初始化
    AppTaskCreate();	//任务创建
}
```

{% endfolding %}

{% folding, KEY.c %}

```cpp
//省略一部分，留下主要部分

extern osThreadId vled1_taskfunctionHandle;	//LED1任务
extern osThreadId vled2_taskfunctionHandle;	//LED2任务
extern osThreadId vled3_taskfunctionHandle;	//LED3任务
extern osThreadId vprint_cpu_taskfunctionHandle;	//打印任务
extern osThreadId vkey_taskfunctionHandle;	//按键检测与实现任务
extern void vLED2_TaskFunction(void const * argument);

//按键执行功能
void KEY_RUNFLAG(void)
{
	if(KeyData.KEY1_DOWN_FLAG)
	{
		KeyData.KEY1_DOWN_FLAG = 0;
		printf("KEY1按下\r\n");
		if(vled2_taskfunctionHandle != NULL)
		{
			//删除任务2
			vTaskDelete(vled2_taskfunctionHandle);
			vled2_taskfunctionHandle = NULL;
			printf("删除任务LED2\r\n");
		}
		else
		{
			printf("任务LED2已删除，不需要删除\r\n");
		}
	}
	if(KeyData.KEY2_DOWN_FLAG)
	{
		KeyData.KEY2_DOWN_FLAG = 0;
		printf("KEY2按下\r\n");
		if(NULL == vled2_taskfunctionHandle)
		{
			//创建LED2任务
			osThreadDef(vled2_taskfunction,vLED2_TaskFunction,osPriorityNormal,0,128);
			vled2_taskfunctionHandle = osThreadCreate(osThread(vled2_taskfunction),NULL);
			if(vled2_taskfunctionHandle != NULL)
			{
				printf("成功创建任务LED2\r\n");
			}
		}
		else
		{
			printf("任务LED2已存在，不需要创建\r\n");
		}
	}
	if(KeyData.KEY3_DOWN_FLAG)
	{
		KeyData.KEY3_DOWN_FLAG = 0;
		printf("KEY3按下，挂起任务LED3\r\n");
		vTaskSuspend(vled3_taskfunctionHandle);	//挂起任务LED3
	}
	if(KeyData.KEY4_DOWN_FLAG)
	{
		KeyData.KEY4_DOWN_FLAG = 0;
		printf("KEY4按下，恢复任务LED3\r\n");
		vTaskResume(vled3_taskfunctionHandle);
	}	
}
```

{% endfolding %}

{% folding, AllTask.c %}

```cpp
extern osThreadId vled1_taskfunctionHandle;	//LED1任务
extern osThreadId vled2_taskfunctionHandle;	//LED2任务
extern osThreadId vled3_taskfunctionHandle;	//LED3任务

osThreadId vprint_cpu_taskfunctionHandle;	//打印任务
osThreadId vkey_taskfunctionHandle;	//按键检测与实现任务

void vPrint_CPU_TaskFunction(void const* argument);
void vKey_TaskFunction(void const* argument);

//管理任务
void AppTaskCreate(void)
{
	taskENTER_CRITICAL();
	
	//创建打印任务
	osThreadDef(vprint_cpu_taskfunction,vPrint_CPU_TaskFunction,osPriorityNormal,0,512);
	vprint_cpu_taskfunctionHandle = osThreadCreate(osThread(vprint_cpu_taskfunction),NULL);
	//创建按键任务
	osThreadDef(vkey_taskfunction,vKey_TaskFunction,osPriorityNormal,0,128);
	vkey_taskfunctionHandle = osThreadCreate(osThread(vkey_taskfunction),NULL);
	
	taskEXIT_CRITICAL();
}

//打印任务
void vPrint_CPU_TaskFunction(void const* argument)
{
	uint8_t CPU_Run[500];	//保存任务运行时间信息
	
	for(;;)
	{
		vTaskList((char*)&CPU_Run);	
		printf("-----------------------------------------------------------------------------------------\r\n");
		printf("任务名                                  任务状态  优先级  剩余栈  任务序号\r\n");
		printf("%s",CPU_Run);
		printf("-----------------------------------------------------------------------------------------\r\n");
		
		vTaskGetRunTimeStats((char*)&CPU_Run);
		printf("-----------------------------------------------------------------------------------------\r\n");
		printf("任务名                                 运行计数              利用率\r\n");
		printf("%s",CPU_Run);
		printf("-----------------------------------------------------------------------------------------\r\n");
		
		osDelay(5000);
	}	
}


//按键任务
void vKey_TaskFunction(void const* argument)
{
	for(;;)
	{
		KEY_function();
		KEY_RUNFLAG();
		osDelay(20);
	}
}


void vLED1_TaskFunction(void const * argument)
{
	for(;;)
	{
		LED_Dis(0x01,SET);
		osDelay(300);
		LED_Dis(0x01,RESET);
		osDelay(300);
	}
}

void vLED2_TaskFunction(void const * argument)
{
	for(;;)
	{
		LED_Dis(0x02,SET);
		osDelay(500);
		LED_Dis(0x02,RESET);
		osDelay(500);	
	}
	
}
	
void vLED3_TaskFunction(void const * argument)
{
	for(;;)
	{
		LED_Dis(0x04,SET);
		osDelay(100);
		LED_Dis(0x04,RESET);
		osDelay(100);		
	}
}


//初始化
void HardWare_init(void)
{
	LCD_Init();
	LCD_Clear(Blue);
	LCD_SetBackColor(Blue);
	LCD_SetTextColor(Black);
	LCD_DisplayStringLine(Line0,(uint8_t*)"                    ");
	LCD_DisplayStringLine(Line1,(uint8_t*)"                    ");
	LCD_DisplayStringLine(Line2,(uint8_t*)"      FreeRTOS      ");
	LCD_SetBackColor(White);
	LCD_DisplayStringLine(Line3,(uint8_t*)"                    ");
	LCD_DisplayStringLine(Line4,(uint8_t*)"                    ");
	LCD_DisplayStringLine(Line5,(uint8_t*)"                    ");
	LCD_DisplayStringLine(Line6,(uint8_t*)"                    ");
	LCD_DisplayStringLine(Line7,(uint8_t*)"                    ");
	LCD_DisplayStringLine(Line8,(uint8_t*)"                    ");
	LCD_DisplayStringLine(Line9,(uint8_t*)"                    ");
	LED_Dis(0xFF,RESET);
	printf("----FreeRTOS----\r\n");
	printf("----任务管理实验----\r\n");
	printf("按键功能如下：\r\n");
	printf("KEY1:删除LED2任务\r\n");
	printf("KEY2:重建LED2任务\r\n");
	printf("KEY3:挂起LED3任务\r\n");
	printf("KEY4:恢复LED3任务\r\n");
	HAL_TIM_Base_Start_IT(&htim6);	//开启定时器6
}
```

{% endfolding %}



## 第5讲

### 了解调度器

简单的说，调度器就是使用相关的调度算法来决定当前需要执行的任务。

FreeRTOS操作系统支持三种调度方式: `抢占式调度`， `时间片调度` 和 `合作式调度`。

{% note blue 'fas fa-fan' flat %}合作式调度{% endnote %}

合作式调度器提供了一种单任务的系统结构：

1. 当任务需要运行时，被添加到等待队列
2. 任务在特定的时刻被调度运行(以周期性或者单次方式)
3. 任务运行直到完成(高优先级任务不可抢占CPU)，然后由调度器选择下一个任务

`优点`：调度简单，系统占用资源少(单任务结构，运行时高优先级任务不会抢占CPU，不需要给每个任务分配独立的栈空间)

`缺点`：系统实时性不够好

{% note simple %}

单片机资源越来越丰富，加上合作式调度器的系统实时性不够好，合作式调度已经很少使用，FreeRTOS在新的版本中已不再更新

{% endnote %}

{% note blue 'fas fa-fan' flat %}抢占式调度{% endnote %}

抢占式调度器提供了一种 `多任务` 的系统结构，高优先级任务可以抢占低优先级的CPU使用权，使得系统实时性非常好。

使用抢占式调度器时，根据任务重要程度合理分配优先级，CPU会优先执行就绪列表中优先级最高的任务。

下面图片：任务1优先级<任务2优先级<任务3优先级

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230306170825.webp)

{% note simple %}

所以高优先级任务一定要有阻塞，让出CPU给低优先级的任务执行否则高优先级会一直占用CPU低优先级任务不会得到运行的机会

{% endnote %}



{% note blue 'fas fa-fan' flat %}时间片调度{% endnote %}

时间片调度针对同优先级的任务，调度算法给同优先级的任务分配一个专门的列表，用于记录当前就绪的任务，并为每个任务分配一个时间片。【默认开启的】

```cpp
//FreeRTOS.h
#define configUSE_TIME_SLICING 1
```

`注意`：FreeRTOS里每一个任务分配的时间是一样的，不像别的操作系统可以不同任务不同时间片

面图片：任务1优先级=任务2优先级=任务3优先级=任务4优先级

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230306171729.webp)



{% note blue 'fas fa-fan' flat %}举例{% endnote %}

可以创建3个任务ABC，优先级设为一样，每个任务是打印功能然后使用 `HAL_Delay(10)`延时(这里不使用os延时这样可以看到很好效果)，然后时间片节拍设置为50ms(表示隔50ms切换一次任务)，开始运行可以发现每个任务都是打印5次(任务里延时10msX5等于50ms)，然后切换下一个任务以此循环。

如果把 `时间片禁止` 了就会发现只有一个任务一直在运行不会切换



### 任务栈大小确定

任务的栈大小公式：

$\text{number of bytes} = \text{TCB size} + (4 \times \text{task stack size})$

$\text{TCB size 默认是112}$

$\text{task stack size 就是你创建任务设置的word数 单位：字}$

$\text{一般默认是128字也就是}128\times4 = 512\text{字节}$

|                          栈空间来自                          |
| :----------------------------------------------------------: |
|                           局部变量                           |
|                    函数形参(针对函数嵌套)                    |
| 函数返回地址(针对函数嵌套)<br>一般函数的返回地址是专门保存到LR（ Link Register）寄存器里面的，LR是需要入栈的 |
|                      函数内部的状态保存                      |
|                           任务切换                           |
|                           发生中断                           |
|                             ...                              |

FreeRTOS任务栈的大小实际上是由 `TCB大小和任务堆栈大小` 共同决定的。TCB大小决定了任务创建时需要分配的空间大小，而每个任务堆栈在创建时需要分配4个字节的空间，因此任务栈的总大小就是TCB大小加上(4 * 任务堆栈大小)。

`建议`：可以事先给任务分配一个大的栈空间，然后通过调试打印方法打印栈的使用情况，运行一段时间后就有一个大概的范围，再乘以安全系数(一般是1.5~2)，即可得到需要使用的栈空间了



### 任务栈溢出与检测

栈溢出就是用户分配的栈空间不够用了，溢出了

栈生长方向是从高地址到低地址生长(M4和M3是这种方式)：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230306193548.webp)

`注意`:栈的生长方向不同于数组的存储方向，数组的存储方向是从低地址到高地址。因此，在使用栈和数组时需要注意它们的存储方向，以避免访问越界和数据错误。

FreeRTOS提供了两种栈溢出检测机制，这两种检测都是在任务切换时才会进行：

1. 在任务切换时检测任务栈指针是否过界，如果过界了，在任务切换的时候会触发栈溢出钩子函数(钩子函数的主要作用就是对原有函数的功能进行扩展，用户可以根据自己的需要往里面添加相关的测试代码)

```cpp
void vApplicationStackOverflowHook( TaskHandle_t xTask, char *pcTaskName )	//参数1是任务句柄，参数2是任务名称
```

用户可以在钩子函数里面做一些处理。这种方法不能保证所有的栈溢出都能检测到。比如 `任务在执行的过程中出现过栈溢出，任务切换前栈指针又恢复到正常水平`，这种情况在任务的时候是检测不到的。又比如 `任务栈溢出后，把这部分栈区的数据修改了，这部分栈区的数据不重要或者暂时没有用到还好，但如果是重要数据被修改将直接导致系统进入硬件异常`，这种情况下，栈溢出检测功能也是检测不到的。

使用方法1需要在 `FreeRTOSConfig.h` 文件中配置如下宏定义(在MX选择)：

```cpp
configCHECK_FOR_STACK_OVERFLOW 1
```



2. 任务创建的时候 `将任务栈所有数据初始化为0xa5`，任务切换时进行任务栈检测的时候会检测末尾的16个字节是否都是0xa5，通过这种方式来检测任务栈是否溢出了。相比方法一，这种方法的速度稍慢些，但是这样就有效地避免了方法一里面的部分情况。不过依然不能保证所有的栈溢出都能检测到，比如任务栈末尾的16个字节没有用到，即没有被修改，但是任务栈已经溢出了，这种情况是检测不到的。另外任务栈溢出后，任务栈末尾的16个字节没有修改，但是溢出部分的栈区数据被修改了，这部分栈区的数据不重要或者暂时没有用到还好，但如果是重要数据被修改将直接导致系统进入硬件异常，这种情况下，栈溢出检测功能也是检测不到的。

使用方法2需要在 `FreeRTOSConfig.h` 文件中配置如下宏定义(在MX选择)：

```cpp
configCHECK_FOR_STACK_OVERFLOW 2
```

以上的方法在产品测试可以用但是产品发布时最好关闭它



### 综合实验程序

{% note simple %}

`实验目的`：模拟栈溢出，造成硬件异常

`实验方法`：在任务 `vkey_taskfunction` 中申请过大的数组，模拟栈溢出的情况，检测到按键1按下时，对数组赋值，模拟产生系统硬件错误。检测溢出后触发钩子函数，将发送栈溢出的任务打印出来。【检测机制两种方法都试试】

{% endnote %}



{% note blue 'fas fa-fan' flat %}CubeMX配置{% endnote %}

- 选择方法1，测完再换方法2测

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230306202641.webp)





{% note blue 'fas fa-fan' flat %}程序编写{% endnote %}

- 需要在 `HardFault_Handler()` 函数里面进行编写

这个函数是ARM Cortex-M 系列处理器内置的一个函数。在 STM32 系列微控制器中，HardFault_Handler 函数也是预定义好的， `用于处理处理器硬件错误异常`。【在 stm32g4xx_it.c里】

{% folding, KEY.c %}

```cpp
//按键执行功能
void KEY_RUNFLAG(void)
{
    if(KeyData.KEY1_DOWN_FLAG)
    {
        int16_t i;
        uint8_t Buf[1024];

        KeyData.KEY1_DOWN_FLAG = 0;
        printf("KEY1按下\r\n");
        for(i = 1023; i >= 0; i--)
        {
            Buf[i] = 0x55;
            vTaskDelay(100);
        }

    }
    ...
}
```

{% endfolding %}

{% folding, AllTask.c %}

```cpp
void vApplicationStackOverflowHook(xTaskHandle xTask, signed char *pcTaskName)
{
	printf("任务%s发送栈溢出",pcTaskName);
}
```

{% endfolding %}

{% folding, stm32g4xx_it.c %}

```cpp
void HardFault_Handler(void)
{
  /* USER CODE BEGIN HardFault_IRQn 0 */

  /* USER CODE END HardFault_IRQn 0 */
  while (1)
  {
    /* USER CODE BEGIN W1_HardFault_IRQn 0 */
	  printf("系统硬件错误\r\n");
	  HAL_Delay(1);
    /* USER CODE END W1_HardFault_IRQn 0 */
  }
}
```

{% endfolding %}

{% note blue 'fas fa-fan' flat %}实验现象{% endnote %}

按键1按下会触发钩子函数打印 `任务vkey_taskfunction发送栈溢出`，而且死机只能重启，但是没触发硬件错误，这是因为

`栈溢出并未导致任务的堆栈空间覆盖到 HardFault_Handler 函数所在的堆栈空间。如果任务的堆栈空间溢出仅仅覆盖到了其他堆栈空间，比如其他任务的堆栈空间，那么就不会触发 HardFault_Handler 函数。`，如果触发硬件错误直接就打印 `系统硬件错误`且不会触发钩子函数

方法2一样



## 第6讲

### 中断优先级

{% note blue 'fas fa-fan' flat %}NVIC回顾{% endnote %}

STM32中有一个强大而方便的NVIC，它属于CM4内核的器件。

STM32中有两个优先级的概念： `抢占优先级` 和 `响应优先级(也称子优先级)`，抢占优先级高的可以打断抢占优先级低的，抢占优先级一样则看响应优先级的高低，如果抢占优先级和响应优先级一样则根据它们在中断表中的排位顺序决定先处理哪一个。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230307081731.webp)

`注意`：当你启动FreeRTOS后，中断优先级组只能配置为 `4`，即抢占优先级可以配置为0~15，数值越小优先级越高，关闭FreeRTOS后才可以自定义选择组【在FreeRTOSConfig.h也可以看到】

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230307082150.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230307082439.webp)

{% note blue 'fas fa-fan' flat %}SVC,PendSV,Systick中断{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230307083934.webp)

`SVC中断`：在FreeRTOS的移植文件 ports.c 中有用到SVC中断的0号系统服务，即SVC 0；此中断在FreeRTOS中仅执行一次，用于启动第一个要执行的任务。另外，由于FreeRTOS没有配置SVC的字段优先级，默认没有配置的情况下，SVC中断的优先级就是最高的 0。

`PendSV和Systick中断`：任务切换和时基中断都是配置为优先级最低

{% note blue 'fas fa-fan' flat %}不受操作系统管理的中断{% endnote %}

FreeRTOS内核源码有多处开关全局中断的地方，这些开关全局中断会加大中断延迟时间。比如在源码的某个地方关闭了全局中断，但是此时有外部中断触发，这个中断的服务程序就需要等到再次开启全局中断后才可以得到执行。 `开关中断之间的时间越长，中断延迟时间就越大，这样极其影响系统的实时性`。如果这是一个紧急的中断事件，得不到计时执行的话，后果是可想而知的。

针对这种情况，FreeRTOS专门做了一个新的开关中断实现机制。 `关闭中断时仅关闭受FreeRTOS管理的中断，不受FreeRTOS管理的中断不关闭，这些不受管理的中断都是高优先级的中断`，用户可以在这些中断里面加入需要实时响应的程序。

实现这个功能的奥秘在于FreeRTOS开关中断使用的寄存器 `basepri`：

basepri 寄存器用于任务抢占和中断抢占之间的优先级管理。该寄存器是一个 8 位的寄存器，它的值可以控制当前任务允许被中断的最高优先级。当它被设置为某个值后，所有优先级号大于等于此值的中断都被关(`优先级号越大优先级越低`)，若设置为0则不关闭任何中断，0也是默认值。

 `当任务进入临界区时`，可以通过将 basepri 寄存器的值设置为大于等于临界区中最高优先级的值，来禁止中断抢占当前任务，从而保证临界区的原子性。 `当任务退出临界区时`，可以通过将 basepri 寄存器的值恢复为 0，来允许中断抢占当前任务。

`注意`:使用 basepri 寄存器来管理任务和中断之间的优先级关系需要特别小心，因为 `不当的使用可能会导致任务饥饿、死锁等问题`。因此，在使用 basepri 寄存器时，需要仔细考虑任务的优先级、中断的优先级以及它们之间的关系，以确保系统的稳定性和可靠性。

可以通过MX配置此值或者 `FreeRTOSConfig.h`：

【一般设置为5即可，即0~4中断不受FreeRTOS管理】

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230307090547.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230307090709.webp)

如果你想哪个中断不受FreeRTOS管理可以在设置那把勾去掉然后就可以配置为 `0~4`了，不去掉勾的话只会显示 `5~15` 给你

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230307091305.webp)



### 任务优先级

{% note blue 'fas fa-fan' flat %}任务优先级说明{% endnote %}

1. FreeRTOS中任务的最高优先级是通过 `FreeRTOSConfig.h` 文件中的 `configMAX_PRIORITIES` 进行配置的，用户实际可以使用的优先级范围是 `0~configMAX_PRIORITIES -1`。比如我们配置此宏定义为 `7` ，那么用户可以使用的优先级号是 `0,1,2,3,4，5,6不包含7`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230307092210.webp)

2. 用户配置任务的优先级数值越小，那么此任务的优先级越低，空闲任务的优先级是 `0(最低)`
3. 建议用户配置宏定义 `configMAX_PRIORITIES` 的最大值不要超过 `32` 。因为对于CM内核的移植文件，用户任务的优先级不是大于等于32的话， `portmacro.h` 文件中的宏定义 `configUSE_PORT_OPTIMISED_TASK_SELECTION`会优化优先级列表中要执行的最高优先级任务的获取算法【此宏定义默认是使能的(即默认32),用户也可以在 `FreeRTOSConfig.h` 文件中进行配置】

{% note blue 'fas fa-fan' flat %}任务优先级分配方案{% endnote %}

优先级设置多少是没有标准的，但是可以参考下面这个标准：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230307094213.webp)

`IRQ任务`：IRQ任务是指通过中断服务程序进行触发的任务，此类任务应该设置为所有任务里面优先级最高的

`高优先级后台任务`：比如按键检测，触摸检测，USB消息处理，串口消息处理等，都可以归为这一类任务

`低优先级的时间片调度任务`：比如 emWin 的界面显示，LED数码管的显示等不需要实时执行的都可以归为这一类任务。实际应用中用户不必纠结直接将这些任务都设置为1的同优先级任务，可以设置多个优先级，只需注意这类任务不需要高实时性

`空闲任务`：空闲任务是系统任务

`注意`：IRQ任务和高优先级任务必须设置为阻塞式(调用消息等待或者延迟等函数即可)，只有这样，高优先级任务才会释放CPU的使用权，从而低优先级任务才有机会得到执行



### 函数

{% note blue 'fas fa-fan' flat %}获取任务优先级{% endnote %}

```cpp
//函数原型
UBaseType_t uxTaskPriorityGet( const TaskHandle_t xTask )	//参数是任务句柄
```

1. 使用此函数需要在 `FreeRTOSConfig.h` 配置文件中配置如下宏定义(或者在MX使能)：

```cpp
#define INCLUDE_uxTaskPriorityGet            1
```

2. 如果参数填 `NULL(即数值0)`，那么获取的优先级就是当前正在执行的任务

{% note blue 'fas fa-fan' flat %}修改任务优先级{% endnote %}

```cpp
//函数原型
void vTaskPrioritySet( TaskHandle_t xTask, UBaseType_t uxNewPriority )//参数1：任务句柄 参数2：新的优先级
```

1. 使用此函数需要在 `FreeRTOSConfig.h` 配置文件中配置如下宏定义：

```cpp
#define INCLUDE_vTaskPrioritySet             1
```

2. 如果第一个参数填的是 `NULL`，那配置的就是当前正在执行的任务
3. 如果被修改的任务优先级修改后高于正在执行的任务，将执行任务切换，切换到修改好的高优先级任务
4. 第二个参数值不可大于等于 `FreeRTOSConfig.h` 文件中的宏定义 `#define configMAX_PRIORITIES` 配置的数值

### 开关中断与临界段函数

{% note blue 'fas fa-fan' flat %}临界段概念{% endnote %}
代码的临界段也称为临界区，一旦这部分代码开始执行，则不允许中断打断。为确保临界段代码的执行不被中断，在进入临界段之前须关中断，而临界段代码执行完毕后，要立即开中断。

进入临界段前操作寄存器basepri关闭了所有大于等于宏定义`configLIBRARY_MAX_SYSCALL_INTERRUPT_PRIORITY`所定义的中断优先级，这样临界段代码就不
会被中断干扰到，而且 `实现任务切换功能的PendSV中断和滴答定时器中断是最低优先级中断`，所以此任务在执行临界段代码期间是不会被其它高优先级任务打断的。退出临界段时重新操作 basepri寄存器，即打开被关闭的中断（这里我们不考虑不受FreeRTOS管理的更高优先级中断)

除了FreeRTOS 操作系统源码所带的临界段以外，用户写应用的时候也有临界段的问题，比如以下两种:

1. 读取或者修改变量（特别是用于任务间通信的全局变量)的代码，一般来说这是最常见的临界代码。
2. 调用公共函数的代码，特别是不可重入的函数，如果多个任务都访问这个函数，结果是可想而知的。 `总之，对于临界段要做到执行时间越短越好，否则会影响系统的实时性`

{% note blue 'fas fa-fan' flat %}开关中断函数(宏){% endnote %}

```cpp
//在task.h里

//关闭所有受管理的中断
#define taskDISABLE_INTERRUPTS()	portDISABLE_INTERRUPTS()
//打开所有受管理的中断
#define taskENABLE_INTERRUPTS()		portENABLE_INTERRUPTS()
```

`这两个函数不推荐使用，因为它们不支持嵌套使用！`

{% note blue 'fas fa-fan' flat %}任务进入/退出临界段函数{% endnote %}

```cpp
//任务中进入临界段
#define taskENTER_CRITICAL()		portENTER_CRITICAL()
//任务中退出临界段
#define taskEXIT_CRITICAL()			portEXIT_CRITICAL()
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230307183820.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230307183838.webp)



其实这两个函数也是调用 `开关中断函数`，但是这两个函数都对变量 `uxCriticalNesting` 进行了操作，这个变量很重要，用于临界段的嵌套计数

`注意`：临界段处理函数必须成对使用

{% note blue 'fas fa-fan' flat %}中断进入/退出临界段函数{% endnote %}

```cpp
//中断进入临界段
#define taskENTER_CRITICAL_FROM_ISR() portSET_INTERRUPT_MASK_FROM_ISR()
//中断退出临界段
#define taskEXIT_CRITICAL_FROM_ISR( x ) portCLEAR_INTERRUPT_MASK_FROM_ISR( x )
```

中断里面的临界段代码的开关中断是通过寄存器basepri实现的。这里为什么没有中断嵌套计数呢？是因为它换了另外一种实现方法， `通过保存和恢复寄存器basepri的数值就可以实现嵌套使用`

`注意`：临界段处理函数必须成对使用



### 综合实验程序

{% note simple %}

初始时：

`print任务优先级`：3

`IDLE任务优先级`：0

`LED3任务优先级`：3

`LED2任务优先级`：3

`LED1任务优先级`：3

`按键任务优先级`：4

{% endnote %}

{% note blue 'fas fa-fan' flat %}CubeMX配置{% endnote %}

- 可控制的中断是5~15

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230307185529.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230307190045.webp)

{% note blue 'fas fa-fan' flat %}程序编写{% endnote %}

{% note success simple %}任务中临界段测试{% endnote %}

- 这里测试所以临界段里面的代码只是执行延时5s，正常来说是放重要的代码的

{% folding, KEY.c(测试1--不改按键任务优先级只系统延时5s) %}

```cpp
//测试1(不改优先级只系统延时5s)
	if(KeyData.KEY1_DOWN_FLAG)
	{
		KeyData.KEY1_DOWN_FLAG = 0;
		printf("KEY1按下\r\n");
		printf("更改前的KEY任务的优先级为：%u\r\n",(uint16_t)uxTaskPriorityGet(NULL));
		HAL_Delay(5000);
	}
```

实验现象是：按下按键1时LED任务停止运行5s，5s后恢复正常【这是因为按键的优先级是4最高的所以其他低优先级的不能抢占】

{% endfolding %}

{% folding, KEY.c(测试2--改按键任务优先级为2) %}

```cpp
	if(KeyData.KEY1_DOWN_FLAG)
	{
		KeyData.KEY1_DOWN_FLAG = 0;
		printf("KEY1按下\r\n");
		printf("更改前的KEY任务的优先级为：%u\r\n",(uint16_t)uxTaskPriorityGet(NULL));
		vTaskPrioritySet(NULL,2);
		printf("更改后的KEY任务的优先级为：%u\r\n",(uint16_t)uxTaskPriorityGet(NULL));
		HAL_Delay(5000);
	}
```

实验现象是：按键1按下后按键任务优先级会立刻改成2，由于按键任务优先级变成比LED任务优先级还低，所以马上进行了任务切换所以`HAL_Delay(5000);` 不会执行到就切换了

{% endfolding %}

{% folding, KEY.c(测试3--改按键任务优先级为2并且加临界段) %}

```cpp
	if(KeyData.KEY1_DOWN_FLAG)
	{
		KeyData.KEY1_DOWN_FLAG = 0;
		printf("KEY1按下\r\n");
		//测试任务代码临界段
		printf("更改前的KEY任务的优先级为：%u\r\n",(uint16_t)uxTaskPriorityGet(NULL));
		vTaskPrioritySet(NULL,2);
		printf("更改后的KEY任务的优先级为：%u\r\n",(uint16_t)uxTaskPriorityGet(NULL));
		printf("进入代码临界段\r\n");
		taskENTER_CRITICAL();	//进入代码临界段
		printf("延时5s，尽管KEY任务的优先级最低，但是由于进入了进阶段，任务不会切换，LED灯应该停止闪烁\r\n");
		HAL_Delay(5000);
		taskEXIT_CRITICAL();	//退出临界段
		printf("退出代码临界段\r\n");
		vTaskPrioritySet(NULL,4);
	}
```

实验现象是按键1按下后按键任务优先级改成2，比LED任务优先级低，但是由于进入了临界段，因为临界段中禁止任务切换。所以，即使 LED 任务的优先级比按键任务高，也不能在临界段中抢占执行权，而是执行临界段里面的代码，退出临界段后，由于执行了 `vTaskPrioritySet(NULL,4);`按键任务的优先级改回4，这意味着按键任务的优先级此时比 LED 任务高，所以任务调度器会继续执行按键任务而不是立即切换到 LED 任务。 `因此，根据任务调度器的调度策略，退出临界段后任务的切换不一定会立即发生。需要根据任务的优先级和状态来决定下一个要执行的任务。`

{% endfolding %}

{% note success simple %}中断中临界段测试{% endnote %}

```cpp
void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim)
{
    UBaseType_t uxSavedInterruptStatus;
    
    uxSavedInterruptStatus = taskENTER_CRITICAL_FROM_ISR();	//进入临界段
    //放重要的代码
    taskEXTI_CRITICAL_FROM_ISR(uxSavedInterruptStatus);	//退出临界段
}
```

`uxSavedInterruptStatus`是一个变量，用于保存进入临界段前的中断状态。在进入临界段时，中断是被禁止的，因此这个变量的值为0。在退出临界段时，根据这个变量的值来决定是否开启中断，以保持中断的嵌套状态不变。



## 第7讲

### 调度锁,中断锁，任务锁

{% note blue 'fas fa-fan' flat %}调度锁{% endnote %}

调度锁就是RTOS提供的 `调度器开关` 函数，如果某个任务调用了调度锁开关函数， `处于调度锁开和调度锁关之间的代码在执行期间是不会被高优先级的任务抢占的，即任务调度被禁止`。这一点要跟临界段的作用区分开， `调度锁只是禁止了任务调度并没有关闭任何中
断，中断还是正常执行的`。而临界段进行了开关中断操作。

```cpp
//调度锁开启函数原型
void vTaskSuspendAll( void )
```

使用这个函数要注意以下问题：

1. 调度锁只是禁止了任务调度，并没有关闭任务中断
2. 调度锁开启函数和关闭函数一定要成对使用
3. 切不可在调度锁开启函数和调度锁关闭函数之间调用任何会引起任务切换的API，比如 `vTaskDelayUntil`，`vTaskDelay`，`xQueueSend` 等

```cpp
//调度锁关闭函数
BaseType_t xTaskResumeAll( void )	//调度锁关闭后，如果需要任务切换，此函数返回pdTRUE，否则返回pdFALSE
```

使用这个函数要注意以下问题：

 `同上`

### 综合实验程序

{% note simple %}

`实验方法`：

`任务1`：优先级低，启动调度锁，调度锁开关之间使用HAL_Delay延时5s，退出调度锁后，使用HAL_Delay继续延时5s

`任务2`：优先级高，指示灯100ms闪烁

{% endnote %}



{% note blue 'fas fa-fan' flat %}CubeMX配置{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230308104220.webp)



{% note blue 'fas fa-fan' flat %}程序编写{% endnote %}

{% folding, AllTask.c(测试1--LED1任务只延时不调用调度锁函数) %}

```cpp
void vLED1_TaskFunction(void const * argument)
{
	for(;;)
	{
		HAL_Delay(2000);
		HAL_Delay(5000);
	}
}

void vLED2_TaskFunction(void const * argument)
{
	for(;;)
	{
		LED_Dis(0x02,SET);
		osDelay(100);
		LED_Dis(0x02,RESET);
		osDelay(100);	
	}
}
```

实验现象：LED2任务执行100ms闪烁，因为LED2任务优先级比较高

{% endfolding %}

{% folding, AllTask.c(测试2--LED1任务延时并调用调度锁函数) %}

```cpp
void vLED1_TaskFunction(void const * argument)
{
	for(;;)
	{
		HAL_Delay(2000);
		//调度器锁开
		vTaskSuspendAll();
		HAL_Delay(5000);
		if(pdTRUE == xTaskResumeAll())
		{
			taskYIELD();	//立即任务切换
		}
	}
}

void vLED2_TaskFunction(void const * argument)
{
	for(;;)
	{
		LED_Dis(0x02,SET);
		osDelay(100);
		LED_Dis(0x02,RESET);
		osDelay(100);	
	}
}
```

实验现象是LED2任务闪烁10次然后停止闪烁5s然后又闪烁10次以此循环

{% endfolding %}



{% note blue 'fas fa-fan' flat %}中断锁{% endnote %}

中断锁就是RTOS 提供的 `开关中断` 函数，FreeRTOS没有专门的中断锁函数，使用上一讲里面介绍的临界段处理函数就可以实现同样效果。



{% note blue 'fas fa-fan' flat %}任务锁{% endnote %}

简单的说，为了防止当前任务的执行被其它高优先级的任务打断而提供的锁机制就是任务锁。FreeRTOS也没有专门的任务锁函数，但是使用FreeRTOS现有的功能有两种实现方法:

1. 利用调度锁关闭任务切换
2. 利用FreeRTOS的任务代码临界段处理函数关闭PendSV中断和Systick 中断，进而关闭任务切换。



## 第8讲

### 系统节拍

{% note blue 'fas fa-fan' flat %}FreeRTOS 的时钟节拍{% endnote %}

任何操作系统都需要提供一个时钟节拍，以供系统处理诸如延时、 超时等与时间相关的事件。
时钟节拍是特定的周期性中断，这个中断可以看做是 `系统心跳`。 中断之间的时间间隔取决于不同的应
用，一般是 `1ms – 100ms`。时钟的节拍中断使得内核可以将任务延迟若干个时钟节拍，以及当任务等待
事件发生时，提供等待超时等依据。 `时钟节拍率越快，系统的额外开销就越大`。一般来说 `都是用滴答定时器来实现系统时钟节拍的`。

{% note blue 'fas fa-fan' flat %}滴答定时器 Systick{% endnote %}

SysTick 定时器被捆绑在 NVIC 中，用于产生 SysTick 异常（异常号： 15）， 滴答定时器是一个 24 位
的递减计数器，支持中断。 使用比较简单， 专门用于给操作系统提供时钟节拍。
FreeRTOS 的系统时钟节拍可以在配置文件 `FreeRTOSConfig.h` 里面设置：

```cpp
#define configTICK_RATE_HZ                       ((TickType_t)1000)
```

如上所示的宏定义配置表示系统时钟节拍是 `1KHz(即1ms)`



### 延时相关函数

FreeRTOS 中的时间延迟函数主要有以下两个作用：

1. 为周期性执行的任务提供延迟。
2. 对于抢占式调度器，让高优先级任务可以通过时间延迟函数释放 CPU 使用权，从而让低优先级任务可以得到执行。

FreeRTOS 的时间相关函数主要是4个：

{% note blue 'fas fa-fan' flat %}vTaskDelay函数{% endnote %}

相对延时，vTaskDelay()指定的延时时间是从调用vTaskDelay()后开始计算，直到延时指定的时间结束。单位是 `系统节拍时钟周期(不是ms)`， `portTICK_PERIOD_MS` 宏定义是用来辅助计算真实时间，此值是系统节拍时钟中断的周期，单位是毫秒【在portmacro.h有定义】

不适用与周期性执行任务的场合其它任务和中断活动，会影响到vTaskDelay()的调用（比如调用前高优先级任务抢占了当前任务），因此会影响任务下一次执行的时间

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230303135143.webp)

```cpp
//configTICK_RATE_HZ是在cubeMX里填写的频率，可在FreeRTOSconfig.h查看
#define configTICK_RATE_HZ                       ((TickType_t)1000)

//portmacro.h
#define portTICK_PERIOD_MS			( ( TickType_t ) 1000 / configTICK_RATE_HZ )
```

所以vTaskDelay的计算公式(可参考osDelay函数)：

$\text{实际vTaskDelay参数值 = 你想要延时的时间(ms) / portTICK_PERIOD_MS}$

比如延时500ms，则通过计算得出vTaskDelay参数应该写500

```cpp
TickType_t TicksToDelay;	//定义变量(注意类型要跟函数一致)
TicksToDelay = 500 / portTICK_PERIOD_MS;	//转换为节拍
vTaskDelay(TicksToDelay);	//阻塞500ms
```

{% note red 'fas fa-fan' flat %}osDelay{% endnote %}

`osDelay`函数就是封装了 `vTaskDelay` ，单位是 `ms(不是节拍)`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230308124407.webp)





{% note blue 'fas fa-fan' flat %}vTaskDelayUntil函数{% endnote %}

绝对延时，周期性任务可以使用此函数，以确保一个恒定的频率执行，当调用 `vTaskSuspendAll()` 函数挂起RTOS调度器时，不可以使用此函数。

即使任务在执行过程中发生中断，那么也不会影响这个任务的运行周期，仅仅是缩短了阻塞的时间而已，到了要唤醒的时间依旧会将任务唤醒。

`注意`：在使用绝对延时时，如果您的任务需要执行时间超过了指定的延时时间，则任务将在计划时间之前被唤醒。这可能会导致任务的优先级被提升，从而影响系统的实时性。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230303135205.webp)



```cpp
//函数原型
//使用前需要在MX使能或者在FreeRTOSConfig.h把宏定义使能：#define INCLUDE_vTaskDelayUntil 1

//参数1：存储任务上次处于非阻塞状态时刻的变量地址
//参数2：周期性延迟时间(当时间等于(*pxPreviousWakeTime + xTimeIncrement)时，任务解除阻塞)
void vTaskDelayUntil( TickType_t * const pxPreviousWakeTime, const TickType_t xTimeIncrement )
```

```cpp
//用法
//可以使用portTickType定义因为在 FreeRTOS.h里宏定义了它等于TickType_t (938行左右)

void Usart1Tx_function(void *pvParameters)
{
	static TickType_t PreviousWakeTime;	//保存上一次时间
	static TickType_t TimeIncrement;	//需要多少节拍
	
	TimeIncrement = 1000 / portTICK_PERIOD_MS;	//把ms转换成节拍(如果设置的系统节拍是1ms则不需要转换直接给参数即可)
	PreviousWakeTime = xTaskGetTickCount();	//获取当前系统时间
	
	for(;;)
	{
		vTaskDelayUntil(&PreviousWakeTime,TimeIncrement);	//绝对延时，1000ms
	}
	vTaskDelete(NULL);
}
```



{% note blue 'fas fa-fan' flat %}xTaskGetTickCount函数{% endnote %}

用于获取系统当前运行的时钟节拍数，此函数用于在 `任务代码` 里面调用，如果在中断服务程序里面调用的话，需要使用另一个函数【不可混淆用】

```cpp
//用法
printf("当前系统节拍是：%d\n",xTaskGetCount());
```

{% note blue 'fas fa-fan' flat %}xTaskGetTickCountFromISR函数{% endnote %}

用于获取系统当前运行的时钟节拍数，此函数用于在 `中断服务程序` 里面调用，如果在任务里面调用的话，需要使用另一个函数【不可混淆用】

```cpp
//用法与上面一样
```



### 综合实验程序

{% note simple %}

`任务1`：HAL_Delay延时50ms，模拟传感器采集数据与被中断或高优先级任务打断的时间，printf打印任务运行次数，再通过vTaskDelay相对延时200ms

`任务2`：HAL_Delay延时50ms，模拟传感器采集数据与被中断或高优先级任务打断的时间，printf打印任务执行次数，再通过vTaskDelayUntil绝对延时200ms

`实验分析`：任务1由于采用相对延时，printf间隔250ms(50ms+200ms)打印信息；任务2由于采用绝对延时，printf间隔200ms(50ms+150ms)打印信息

{% endnote %}



{% note blue 'fas fa-fan' flat %}程序编写{% endnote %}

{% folding, AllTask.c %}

```cpp
void vLED1_TaskFunction(void const * argument)
{
	uint16_t Task1_cnt = 0;
	
	for(;;)
	{
		//模拟传感器采集数据与被中断或者高优先级任务打断的时间
		HAL_Delay(50);
		LED_Togg(0x01);
		//打印任务运行次数
		printf("任务1执行次数：%d\r\n",++Task1_cnt);
		//相对延时200ms
		osDelay(200);
	}
}

void vLED2_TaskFunction(void const * argument)
{
	portTickType PreviousWakeTime;	//之前的唤醒时间
	uint16_t Task2_cnt = 0;
	PreviousWakeTime = xTaskGetTickCount();	//获取当前系统时间
	
	for(;;)
	{
		//模拟传感器采集数据与被中断或者高优先级任务打断的时间
		HAL_Delay(50);
		LED_Togg(0x02);
		//打印任务运行次数
		printf("任务2执行任务次数：%d\r\n",++Task2_cnt);
		//绝对延时200ms
		osDelayUntil(&PreviousWakeTime,200);
	}
}
```

{% endfolding %}



## 第9讲

### 链表的概念

链表是一种物理存储单元上 `非连续、非顺序` 的存储结构，数据元素的逻辑顺序是通过链表中的指针链接次序实现的。链表由一系列节点（链表中每一个元素称为节点)组成，节点可以在运行时动态生成。每个节点包括两个部分: `一个是存储数据元素的数据域`， `另一个是存储下一个节点地址的指针域`。

链表作为C语言的一种基础数据结构，在平时写程序中用得并不多，但在操作系统中使用得非常多。如果需要读懂FreeRTOS系统的源码，必须弄懂链表，如果只是应用FreeRTOS系统，简要了解即可。

### 单向/双向链表

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230308141018.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230308141048.webp)



### FreeRTOS里链表实现

- 在 FreeRTOS 中，任务链表使用的是 `双向循环链表`

- FreeRTOS中的 `列表` 与 `列表项` 分别对应C语言链表中的 `链表` 与 `节点`

{% note simple %}

ListItem_t：用来表示链表中的一个元素

MiniListItem_t：用来表示链表中初始的那个元素

List_t：用来表示一个链表

{% endnote %}



{% note blue 'fas fa-fan' flat %}ListItem_t{% endnote %}

```cpp
//此代码来自list.h【140行左右】

//用于描述链表中的一个元素
struct xLIST_ITEM
{
	listFIRST_LIST_ITEM_INTEGRITY_CHECK_VALUE			
	configLIST_VOLATILE TickType_t xItemValue;			
	struct xLIST_ITEM * configLIST_VOLATILE pxNext;		
	struct xLIST_ITEM * configLIST_VOLATILE pxPrevious;	
	void * pvOwner;										
	struct xLIST * configLIST_VOLATILE pxContainer;		
	listSECOND_LIST_ITEM_INTEGRITY_CHECK_VALUE			
};
typedef struct xLIST_ITEM ListItem_t;	
```

 `详解`：

|                        参数                        | 解释                                                         |
| :------------------------------------------------: | ------------------------------------------------------------ |
|    `listFIRST_LIST_ITEM_INTEGRITY_CHECK_VALUE`     | 用于检查链表的第一个列表项的完整性的常量。该常量的值为 0x12345678，用于检查第一个列表项的 xItemValue 字段是否包含了正确的值。xItemValue 字段的值应该是最高优先级任务的优先级值，如果该值不正确，说明链表的完整性已经被破坏。 |
|    `listSECOND_LIST_ITEM_INTEGRITY_CHECK_VALUE`    | 用于检查链表的第二个列表项的完整性的常量。该常量的值为 0x87654321，用于检查第二个列表项的 xItemValue 字段是否包含了正确的值。xItemValue 字段的值应该是最低优先级任务的优先级值，如果该值不正确，说明链表的完整性已经被破坏。 |
|     configLIST_VOLATILE TickType_t xItemValue      | 用于存储任务的优先级，`configLIST_VOLATILE` 是一个宏定义，在 FreeRTOS 的不同端口中可能会有不同的实现。它通常用于确保在访问 `xItemValue` 字段时使用原子操作，以防止多个任务同时访问该字段时发生竞态条件 |
|   struct xLIST_ITEM * configLIST_VOLATILE pxNext   | 指向下一个成员的指针                                         |
| struct xLIST_ITEM * configLIST_VOLATILE pxPrevious | 指向上一个成员的指针                                         |
|                   void * pvOwner                   | 一个指向拥有该列表项的内核对象（如任务、信号量等）的指针     |
|   struct xLIST * configLIST_VOLATILE pxContainer   | 一个指向包含该列表项的双向循环链表的指针。在 FreeRTOS 中，每个列表项都属于一个双向循环链表，该指针指向该列表项所属的链表。 |



{% note blue 'fas fa-fan' flat %}MiniListItem_t{% endnote %}

- 是一个迷你型的 `Item`

- 它和 ListItem_t 的定义非常类似，关键成员少了 `pvOwner`、 `pxContainer`；



```cpp
struct xMINI_LIST_ITEM
{
    listFIRST_LIST_ITEM_INTEGRITY_CHECK_VALUE
    configLIST_VOLATILE TickType_t xItemValue;
    struct xLIST_ITEM *configLIST_VOLATILE pxNext;
    struct xLIST_ITEM *configLIST_VOLATILE pxPrevious;
};
typedef struct xMINI_LIST_ITEM MiniListItem_t;
```



{% note blue 'fas fa-fan' flat %}List_t{% endnote %}

```cpp
//这个是管理整个链表的(精简)
typedef struct xLIST
{
	listFIRST_LIST_INTEGRITY_CHECK_VALUE				
	volatile UBaseType_t uxNumberOfItems;
	ListItem_t * configLIST_VOLATILE pxIndex;			
	MiniListItem_t xListEnd;							
	listSECOND_LIST_INTEGRITY_CHECK_VALUE				
} List_t;
```

|                   参数                   | 解释                                                         |
| :--------------------------------------: | ------------------------------------------------------------ |
|   listFIRST_LIST_INTEGRITY_CHECK_VALUE   | 用于检查链表的完整性，确保链表没有被破坏。这是一个常量，其值为0x4C495354UL，用于检测链表的开头是否被修改。 |
|   volatile UBaseType_t uxNumberOfItems   | 链表中元素的数量。定义了当前这个链表中有多少个 Item ，增加一个链表元素，这个值加1，反之，减1； |
| ListItem_t * configLIST_VOLATILE pxIndex | 指向链表中的第一个元素，用来遍历整个链表                     |
|         MiniListItem_t xListEnd          | 它不是链表中的一个元素，只是一个指向链表最后一个元素的标记。 |
|  listSECOND_LIST_INTEGRITY_CHECK_VALUE   | 用于检查链表的完整性，确保链表没有被破坏。这是一个常量，其值为0x5453494CUL，用于检测链表的结尾是否被修改。 |



### 链表的节点定义/初始化

- 以下代码在 `list.c`



{% note blue 'fas fa-fan' flat %}一个链表的初始化{% endnote %}

【只在新建一个链表时才执行，后续插入删除不需要】

```cpp
//参数：指向一个 List_t 类型的指针，该指针指向一个双向链表的头结点。
void vListInitialise( List_t * const pxList )
{
	pxList->pxIndex = ( ListItem_t * ) &( pxList->xListEnd );// MiniListItem_t 结构强转	
	pxList->xListEnd.xItemValue = portMAX_DELAY;
	pxList->xListEnd.pxNext = ( ListItem_t * ) &( pxList->xListEnd );	
	pxList->xListEnd.pxPrevious = ( ListItem_t * ) &( pxList->xListEnd );
	pxList->uxNumberOfItems = ( UBaseType_t ) 0U;
	listSET_LIST_INTEGRITY_CHECK_1_VALUE( pxList );
	listSET_LIST_INTEGRITY_CHECK_2_VALUE( pxList );
}
```

| 这段代码执行过程                                             |
| :----------------------------------------------------------- |
| 传入一个表征链表的结构体指针 List_t * const pxList           |
| 在 List_t 结构中，用于标记链表最后的 xListEnd 结构是一个定义，而不是指针，这里首先将传入链表的 `pxList->pxIndex = ( ListItem_t * ) &( pxList->xListEnd );` 强转为 ListItem_t 结构，并赋值给了 pxIndex，也就是给 pxIndex 内容为这个 List 的 xListEnd 的地址 |
| 接下来便将 xListEnd 的 xItemValue 写入最大值 0xFFFFFFFF(32位CPU) |
| 然后便将 xListEnd 的 next 和 prev 指针全部指向它自己，已达到初始化的目的 |
| 最后初始化该链表中有效元素的个数为 0 个                      |
| 最后通过宏 `listSET_LIST_INTEGRITY_CHECK_1_VALUE` 和 `listSET_LIST_INTEGRITY_CHECK_2_VALUE` 分别设置链表的完整性检查值 |
| 链表就被成功地初始化了                                       |

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230308204838.webp)



{% note blue 'fas fa-fan' flat %}初始化一个链表元素{% endnote %}

- 将元素的容器指针给赋值成为 NULL

```cpp
//初始化节点
void vListInitialiseItem( ListItem_t * const pxItem )
{
	pxItem->pxContainer = NULL;

	listSET_FIRST_LIST_ITEM_INTEGRITY_CHECK_VALUE( pxItem );
	listSET_SECOND_LIST_ITEM_INTEGRITY_CHECK_VALUE( pxItem );
}
```

### 链表的插入

- 以下代码在 `list.c`

插入新节点需要先执行 `vListInitialiseItem` 函数再执行插入函数

{% note blue 'fas fa-fan' flat %}尾插{% endnote %}

```cpp
//参数1：一个指向列表的指针
//参数2：一个指向要插入的列表项的指针
void vListInsertEnd( List_t *const pxList, ListItem_t *const pxNewListItem )
{
    ListItem_t *const pxIndex = pxList->pxIndex;

    listTEST_LIST_INTEGRITY( pxList );
    listTEST_LIST_ITEM_INTEGRITY( pxNewListItem );

    pxNewListItem->pxNext = pxIndex;
    pxNewListItem->pxPrevious = pxIndex->pxPrevious;

    mtCOVERAGE_TEST_DELAY();

    pxIndex->pxPrevious->pxNext = pxNewListItem;
    pxIndex->pxPrevious = pxNewListItem;

    pxNewListItem->pxContainer = pxList;

    ( pxList->uxNumberOfItems )++;
}
```

| 这段代码执行过程                                             |
| :----------------------------------------------------------- |
| 首先获取链表的 pxIndex 结构指针，此指针在链表初始化的时候，是指向了 xListEnd |
| 然后，使用 `listTEST_LIST_INTEGRITY` 和  `listTEST_LIST_ITEM_INTEGRITY`  两个宏来检查链表的完整性和新元素的完整性。这两个宏通常用于调试。 |
| 将新元素的 pxNext 指针设置为链表的索引节点，将 pxPrevious 指针设置为链表索引节点的前一个节点(即之前最后一个节点) |
| 执行 mtCOVERAGE_TEST_DELAY() 宏，用于代码覆盖率测试          |
| 将新元素插入到链表中：<br>1.将新元素的前一个节点的 pxNext 指针指向新元素<br>2.将链表索引节点的 pxPrevious 指针指向新元素 |
| 将新元素的 pxContainer 指针设置为链表本身，以表示该元素属于该链表 |
| 最后，将链表的元素数量加 1                                   |

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230309072925.webp)



{% note blue 'fas fa-fan' flat %}升序插入{% endnote %}

- 如果两个节点的辅助值相同，则新节点在旧节点的后面插入

```cpp
//参数1：指向链表的指针，表示要将新的节点插入到哪个链表中。
//参数2：指向新节点的指针，表示要插入的新节点
void vListInsert( List_t *const pxList, ListItem_t *const pxNewListItem )
{
    ListItem_t *pxIterator;
    const TickType_t xValueOfInsertion = pxNewListItem->xItemValue;

    listTEST_LIST_INTEGRITY( pxList );
    listTEST_LIST_ITEM_INTEGRITY( pxNewListItem );

    if( xValueOfInsertion == portMAX_DELAY )
    {
        pxIterator = pxList->xListEnd.pxPrevious;
    }
    else
    {


        for( pxIterator = ( ListItem_t * ) & ( pxList->xListEnd ); pxIterator->pxNext->xItemValue <= xValueOfInsertion; pxIterator = pxIterator->pxNext )
        {
            //这里没有什么可做的，只是迭代到想要的插入位置
        }
    }

    pxNewListItem->pxNext = pxIterator->pxNext;
    pxNewListItem->pxNext->pxPrevious = pxNewListItem;
    pxNewListItem->pxPrevious = pxIterator;
    pxIterator->pxNext = pxNewListItem;

    pxNewListItem->pxContainer = pxList;

    ( pxList->uxNumberOfItems )++;
}
```

| 这段代码执行过程                                             |
| :----------------------------------------------------------- |
| 首先定义一个指向链表节点的指针，表示在链表中查找要插入位置的迭代器。 |
| `xValueOfInsertion` 表示新节点的值，用于在链表中查找插入位置。 |
| 进行完整性检查，确保链表和节点的数据结构没有被意外地改变     |
| 然后根据新节点的值 `xValueOfInsertion` 在链表中查找插入位置  |
| 将新节点插入到链表中，更新前后节点的指针【这里for循环找，直到找到一个大于xValueOfInsertion的值才退出，那新节点就会插在相同节点的后面】 |
| 将新节点的容器指针 `pxContainer` 指向链表的指针 `pxList`     |
| 增加链表的节点数 `uxNumberOfItems`                           |



### 链表的删除

- 从指定元素中的 pxContainer 获取到该元素所属的链表结构；再将元素从链表中摘除

```cpp
UBaseType_t uxListRemove( ListItem_t *const pxItemToRemove )
{

    List_t *const pxList = pxItemToRemove->pxContainer;

    pxItemToRemove->pxNext->pxPrevious = pxItemToRemove->pxPrevious;
    pxItemToRemove->pxPrevious->pxNext = pxItemToRemove->pxNext;

    mtCOVERAGE_TEST_DELAY();

    if( pxList->pxIndex == pxItemToRemove )
    {
        pxList->pxIndex = pxItemToRemove->pxPrevious;
    }
    else
    {
        mtCOVERAGE_TEST_MARKER();
    }

    pxItemToRemove->pxContainer = NULL;
    ( pxList->uxNumberOfItems )--;

    return pxList->uxNumberOfItems;
}
```



### 综合实验程序

{% note simple %}

创建一个任务，在任务里面进行链表测试

把硬件初始化都注释，只需保留内核的

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230309075616.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230309075640.webp)

{% endnote %}

{% note blue 'fas fa-fan' flat %}程序编写{% endnote %}

{% folding, AllTask.c %}

```cpp
//定义列表
xList List;
//定义列表项
xListItem List_Item1;
xListItem List_Item2;
xListItem List_Item3;

void vLED1_TaskFunction(void const * argument)
{
	//列表初始化
	vListInitialise(&List);
	//列表项初始化
	vListInitialiseItem(&List_Item1);
	List_Item1.xItemValue = 1;
	vListInitialiseItem(&List_Item2);
	List_Item2.xItemValue = 2;
	vListInitialiseItem(&List_Item3);
	List_Item3.xItemValue = 3;
	//将列表项1,2,3按升序插入列表
	vListInsert(&List,&List_Item1);
	vListInsert(&List,&List_Item2);
	vListInsert(&List,&List_Item3);
	//将列表项2移除
	uxListRemove(&List_Item2);
	//将列表项2插入列表尾部
	vListInsertEnd(&List,&List_Item2);
	
	for(;;)
	{
		osDelay(1);
	}
}
```

{% endfolding %}

{% note blue 'fas fa-fan' flat %}软件仿真调试{% endnote %}

- 首先设置断点在 `MX_FREERTOS_Init` 函数那和 `vListInitialise` 函数那，点击进入仿真，点击 `Watch1`添加 `4` 个变量进行查看

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230309081833.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230309081355.webp)

- 进入仿真后默认是分配了地址给这几个变量

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230309081725.webp)

- 点击运行，则运行到 `vListInitialise` 函数那，然后按 `F10`，执行完初始化函数，可以看到 `Num`初始化为0，`ItemValue` 初始化为最大值为0xFFFFFFFF，`pxPrevious,pxNext都指向End`， `End` 则等于 `Index`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230309082523.webp)

- 然后继续按 `F10`，执行完列表项初始化，可以看到 `ItemValue` 的值已经初始化好，因为 `vListInitialiseItem` 函数里面只是把 `pxContainer` 赋值为 `NULL`，所以地址没其他变化

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230309083743.webp)

- 继续按一次 `F10`,进行插入 `List_Item1`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230309085543.webp)

- 继续按一次 `F10`,进行插入 `List_Item2`，可以看到2是插在1后面

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230309090255.webp)

- 继续按一次 `F10`,进行插入 `List_Item3`，可以看到3是插在2后面

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230309090645.webp)



- 继续按 `F10`，删除 `List_Item2`，可以看到 `pxContainer`已经指向 `NULL`，列表的总元素个数变成 `2`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230309091026.webp)

- 继续 `F10`，把 `List_Item2` 插入到尾部，可以看到 1的下一个是3,3的下一个是2,2的下一个是索引节点

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230309091446.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230309092321.webp)

- 测试完记得把之前注释的硬件初始化还原



## 第10讲

### 消息队列的概念

{% note blue 'fas fa-fan' flat %}消息队列的概念及其作用{% endnote %}

消息队列就是通过 RTOS 内核提供的服务，任务或中断服务子程序可以将一个消息（ `注意，FreeRTOS
消息队列传递的是实际数据(复制方式)，并不是数据地址，RTX，uCOS-II 和 uCOS-III 是传递的地址`）放入到队列，同样，一个或者多个任务可以通过 RTOS 内核服务从队列中得到消息；常用于任务间通信，是一种 `异步`通信方式。

通常，先进入消息队列的消息先传给任务，也就是说，任务先得到的是最先进入到消息队列的消息，即 `先进先出的原则(FIFO)`，FreeRTOS
的消息队列支持 `先进先出(FIFO)` 和  `后进先出(LIFO)` 两种数据存取方式。

FreeRTOS中消息队列特性：

1. 消息支持先进先出方式排队，支持异步读写工作方式
2. 读写队列均支持超时机制
3. 消息支持后进先出方式排队，向队首发送消息(LIFO)
4. 可以允许不同长度(不超过队列节点最大值)的任意类型消息
5. 一个任务能够从任意一个消息队列接收和发送消息
6. 多个任务能够从同一个消息队列接收和发送消息
7. 当队列使用结束后，可以通过删除队列函数进行删除

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230309105442.webp)



{% note simple %}

在FreeRTOS里当一个任务向消息队列发送数据时，它会将实际数据复制到消息队列中，并在接收数据的任务接收该消息时返回这些数据。 `这种方法需要更多的内存分配和数据复制`

这样 `RTX，uCOS-II 和 uCOS-III` 更加高效，但是 `FreeRTOS` 则任务之间的数据传递更加安全，因为每个任务都有自己的内存空间，这可以防止一个任务意外地覆盖另一个任务的数据

任务能够从队列中读取消息，当队列中的消息为空时，读取消息的任务将被阻塞。用户可以指定阻塞的任务时间 `xTicksToWait`，在这段时间中，如果队列为空，该任务将保持阻塞状态以等待队列数据有效。当队列中有新消息时，被阻塞的任务会被唤醒并处理新消息;当等待的时间超过指定的阻塞时间，即使队列中没有有效数据， `任务也会自动从阻塞态转为就绪态`。

{% endnote %}

在裸机编程时，使用全局数组的确比较方便，但是在加上 RTOS 后就是另一种情况了。 相比消息队列，使用全局数组主要有如下四个问题：

1. 使用消息队列可以让 RTOS 内核有效地管理任务，而全局数组是无法做到的，任务的超时等机制需要用户自己去实现
2. 使用了全局数组就要防止多任务的访问冲突，而使用消息队列则处理好了这个问题，用户无需担心
3. 使用消息队列可以有效地解决中断服务程序与任务之间消息传递的问题，使用全局数组任务则需要不断去监测标志位以获取数据
4. FIFO 机制更有利于数据的处理



{% note blue 'fas fa-fan' flat %}FreeRTOS任务间消息队列的实现{% endnote %}

任务间消息队列的实现是指各个任务之间使用消息队列实现任务间的通信。

如下图：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/1100576-20170718080216661-974415095.webp)

|                           运行条件                           |
| :----------------------------------------------------------: |
|                创建消息队列，可以存放10个消息                |
| 创建2个任务Task1和 Task2，任务 Task1向消息队列放数据，任务 Task2从消息队列获取数据 |
|                     消息采用 `FIFO` 方式                     |

|                  运行过程主要有以下两种情况                  |
| :----------------------------------------------------------: |
| 任务 Task1 向消息队列放数据，任务 Task2从消息队列取数据，如果放数据的速度 `快于` 取数据的速度，那么会出现消息队列存放慢的情况，FreeRTOS的消息存放函数 `xQueueSend` 支持超时等待，用户可以设置超时等待，直到有空间可以存放消息或者设置的超时时间溢出 |
| 任务 Task1向消息队列放数据，任务 Task2 从消息队列取数据，如果放数据的速度 `慢于` 取数据的速度，那么会出现消息队列为空的情况，FreeRTOS的消息获取函数 `xQueueReceive`支持超时等待，用户可以设置超时等待，直到消息队列中有消息或者数组的超时时间溢出 |



{% note blue 'fas fa-fan' flat %}FreeRTOS中断方式消息队列的实现{% endnote %}

FreeRTOS 中断方式消息队列的实现是指中断函数和 FreeRTOS 任务之间使用消息队列

如下图：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/1100576-20170718080453521-843003957.webp)

|              运行条件              |
| :--------------------------------: |
|   创建消息队列，可以存放10个消息   |
| 创建1个任务Task1和一个串口接收中断 |
|        消息采用 `FIFO` 方式        |

|                  运行过程主要有以下两种情况                  |
| :----------------------------------------------------------: |
| 中断服务程序向消息队列放数据，任务Task1从消息队列取数据，如果放数据的速度 `快于` 取数据的速度，那么会出现消息队列存放满的情况。由于中断服务程序里面的消息队列发送函数 `xQueueSendFromISR`不支持超时设置，所以发送前要通过含 `xQueueIsQueueFullFromISR` 检测消息队列是否满 |
| 中断服务程序向消息队列放数据，任务 Task1 从消息队列取数据，如果放数据的速度 `慢于` 取数据的速度，那么会出现消息队列存为空的情况。在FreeRTOS的任务中可以通过函数 `xQueueReceive` 获取消息，因为此函数可以设置超时等待，直到消息队列中有消息存放或者设置的超时时间溢出 |

实际应用中，中断方式的消息机制要注意以下四个问题：

1.  `中断函数的执行时间越短越好`，防止其它低于这个中断优先级的异常不能得到及时响应
2. 实际应用中， `建议不要在中断中实现消息处理`，用户可以在中断服务程序里面发送消息通知任务，在任务中实现消息处理，这样可以有效地保证中断服务程序的实时响应。同时此任务也需要设置为高优先级，以便退出中断函数后任务可以得到及时执行
3. 中断服务程序中一定要调用专用于中断的消息队列函数，即以 `FromISR` 结尾的函数
4. 在操作系统中实现中断服务程序与裸机编程的区别

- 如果 FreeRTOS 工程的中断函数中没有调用FreeRTOS 的消息队列 API 函数，与裸机编程是一样的。
- 如果 FreeRTOS 工程的中断函数中调用了 FreeRTOS 的消息队列的 API 函数，退出的时候要检测是否有高优先级任务就绪，如果有就绪的，需要在退出中断后进行任务切换，这点与裸机编程稍有区别



### 消息队列API

以下函数可在 `queue.h` 找到定义，在 `queue.c` 找到实现，一共 `24`个函数

官网：[FreeRTOS - FreeRTOS 队列 API 函数](https://www.freertos.org/zh-cn-cmn-s/a00018.html)

|           队列API名           | 描述                                                         |
| :---------------------------: | ------------------------------------------------------------ |
|        `xQueueCreate`         | 创建一个新队列并返回：<br>成功--可引用此队列的句柄<br>失败--NULL【动态创建】 |
|      xQueueCreateStatic       | 创建一个新队列并返回 可以引用该队列的句柄【静态创建，不怎么用】 |
|        `vQueueDelete`         | 删除队列 — 释放分配用于存储放置在队列中的项目的所有内存      |
|         `xQueueSend`          | 在队列中发布消息【FIFO】                                     |
|      `xQueueSendFromISR`      | 在队列中发布消息【中断】                                     |
|       xQueueSendToBack        | 往队列尾部发布消息【FIFO】，这个跟上面一样                   |
|    xQueueSendToBackFromISR    | 往队列尾部发布消息【中断】                                   |
|       xQueueSendToFront       | 往队列头部发布消息【LIFO】                                   |
|   xQueueSendToFrontFromISR    | 往队列头部发布消息【中断】                                   |
|        `xQueueReceive`        | 从队列中接收消息                                             |
|     xQueueReceiveFromISR      | 从队列中接收消息【中断】                                     |
|    uxQueueMessagesWaiting     | 返回队列中存储的消息数                                       |
| uxQueueMessagesWaitingFromISR | 返回队列中存储的消息数【中断】                               |
|    uxQueueSpacesAvailable     | 返回队列中的可用空间数                                       |
|          xQueueReset          | 将队列重置为其原始的空状态                                   |
|        xQueueOverwrite        | 即使队列已满的情况下也将写入队列， 同时覆盖队列中已经 存在的数据【适用于长度为1的队列】 |
|    xQueueOverwriteFromISR     | 即使队列已满的情况下也将写入队列， 同时覆盖队列中已经 存在的数据【适用于长度为1的队列】【中断】 |
|          xQueuePeek           | 从队列中接收消息，而无须从队列中删除该消息。 消息由副本接收，因此必须提供适当大小的缓冲区 |
|       xQueuePeekFromISR       | 从队列中接收消息，而无须从队列中删除该消息。 消息由副本接收，因此必须提供适当大小的缓冲区【中断】 |
|      vQueueAddToRegistry      | 为队列指定名称，并将队列添加到注册表                         |
|     vQueueUnregisterQueue     | 从队列注册表中删除队列                                       |
|        pcQueueGetName         | 从队列的句柄中查找队列名称                                   |
|   xQueueIsQueueFullFromISR    | 查询队列以确定队列是否已满【中断】                           |
|   xQueueIsQueueEmptyFromISR   | 查询队列以确定队列是否为空                                   |



### 消息队列创建，删除

{% note blue 'fas fa-fan' flat %}了解一下消息队列控制块(句柄){% endnote %}

```cpp
typedef struct QueueDefinition
{
    //指向队列缓冲区的起始地址
    int8_t *pcHead;	
    //指向下一个可供写入的缓冲区地址
    int8_t *pcWriteTo;	
    //一个匿名的联合体，用于保存指向等待队列和信号量的指针
    union
    {
        QueuePointers_t xQueue;
        SemaphoreData_t xSemaphore;
    } u;
	//一个链表，用于保存等待发送的任务列表
    List_t xTasksWaitingToSend;
    //一个链表，用于保存等待接收的任务列表
    List_t xTasksWaitingToReceive;
	//记录队列中当前等待接收的消息数量
    volatile UBaseType_t uxMessagesWaiting;
    //队列中元素(消息)的数量（即缓冲区的总长度）
    UBaseType_t uxLength;
    //队列中每个元素(消息)的大小（以字节为单位）
    UBaseType_t uxItemSize;
	//接收锁，用于控制读取缓冲区的并发访问
    volatile int8_t cRxLock;
    //发送锁，用于控制写入缓冲区的并发访问
    volatile int8_t cTxLock;

#if( ( configSUPPORT_STATIC_ALLOCATION == 1 ) && ( configSUPPORT_DYNAMIC_ALLOCATION == 1 ) )
    //标志位，指示队列是否是静态分配的
    uint8_t ucStaticallyAllocated;
#endif

#if ( configUSE_QUEUE_SETS == 1 )
    //如果队列是QueueSet的一部分，则该指针指向QueueSet容器
    struct QueueDefinition *pxQueueSetContainer;
#endif

#if ( configUSE_TRACE_FACILITY == 1 )
    //队列在FreeRTOS内部的编号，用于跟踪调试
    UBaseType_t uxQueueNumber;
    //队列类型，用于跟踪调试
    uint8_t ucQueueType;
#endif

} xQUEUE;
//重命名为Queue_t
typedef xQUEUE Queue_t;
```

```cpp
//定义一个消息队列
osMessageQId myQueue01Handle;
```

通过点击 `osMessageQId` 跳转可以知道最终它是一个什么类型

```cpp
osMessageQId --> typedef QueueHandle_t osMessageQId; --> typedef struct QueueDefinition * QueueHandle_t;
```



{% note blue 'fas fa-fan' flat %}创建队列{% endnote %}

```cpp
//参数1：队列长度，即消息个数
//参数2：每个消息大小，单位字节
//返回值：创建成功返回消息队列的句柄 如果由于FreeRTOSConfig.h文件中configTOTAL_HEAP_SIZE大小不足，无法为此消息队列提供所需空间会返回NULL
QueueHandle_t xQueueCreate( uxQueueLength, uxItemSize );
```

使用这个函数要注意以下问题：

FreeRTOS 的消息传递是数据的复制，而不是传递的数据地址，这点要特别注意。  `每一次传递都是
uxItemSize 个字节`

{% note blue 'fas fa-fan' flat %}删除消息队列{% endnote %}

```cpp
//参数：队列句柄
void vQueueDelete( QueueHandle_t xQueue );
```

`说明`：消息队列删除后，系统会清空此队列的全部消息，且不能再次使用此队列



### 任务中消息队列发送

```cpp
//参数1：消息队列句柄
//参数2：要传递数据地址，每次发送都是将消息队列创建函数xQueueCreate所指定的单个消息大小复制到消息队列空间中(如果发送的是变量需要加&)
//参数3：等待消息队列有空间的最大等待时间，单位是：系统时钟节拍
//返回值：消息成功发送返回pdTRUE 失败返回errQUEUE_FULL
BaseType_t xQueueSend(QueueHandle_t xQueue, const void * const pvItemToQueue, TickType_t xTicksToWait);
```

使用这个函数需要注意以下问题：

1. FreeRTOS 的消息传递是数据的复制，而不是传递的数据地址
2. 假设消息队列空间是10个字节，但是消息数据是4个字节那在发送时还是会发生10个字节不会以数据的大小而改变这个， `xQueueSend()函数的第二个参数是固定长度的，长度取决于创建队列时指定的单个消息大小`
3. 此函数是用于任务代码中调用的，故不可以在中断服务程序中调用此函数
4. 如果消息队列已经满且第三个参数为 0，那么此函数会立即返回
5. 如果用户将  `FreeRTOSConfig.h`  文件中的宏定义  `INCLUDE_vTaskSuspend` 配置为 1 且第三个参数配置为 `portMAX_DELAY`，那么此发送函数会永久等待直到消息队列有空间可以使用
6. 消息队列还有两个函数 `xQueueSendToBack` 和  `xQueueSendToFront`，函数 xQueueSendToBack
   实现的是  `FIFO`  方式的存取，函数xQueueSendToFront 实现的是  `LIFO` 方式的读写。 `我们这里说的函数 xQueueSend 等效于 xQueueSendToBack，即实现的是 FIFO 方式的存取`
7. 发送的数据大小包括\r\n



### 中断中消息队列发送

```cpp
//参数1：消息队列句柄
//参数2：要传递数据地址， 每次发送都是将消息队列创建函数 xQueueCreate 所指定的单个消息大小复制到消息队列空间中
//参数3：用于保存是否有高优先级任务准备就绪。如果函数执行完毕后，此参数的数值是 pdTRUE，说明有高优先级任务要执行，否则没有
//返回值：如果消息成功发送返回 pdTRUE，否则返回 errQUEUE_FULL
BaseType_t xQueueSendFromISR(QueueHandle_t xQueue, const void * const pvItemToQueue,BaseType_t * const pxHigherPriorityTaskWoken)
```

使用这个函数要注意以下问题：

1. FreeRTOS 的消息传递是数据的复制，而不是传递的数据地址。 正因为这个原因，用户在创建消息队列时单个消息大小不可太大，因为一定程度上面会增加中断服务程序的执行时间
2. 此函数是用于中断服务程序中调用的，故不可以在任务代码中调用此函数
3. 消息队列还有两个函数  `xQueueSendToBackFromISR` 和  `xQueueSendToFrontFromISR`，函数
   xQueueSendToBackFromISR 实现的是 `FIFO` 方式的存取，函数 xQueueSendToFrontFromISR 实现的是 `LIFO` 方式的读写。 `我们这里说的函数 xQueueSendFromISR 等效于xQueueSendToBackFromISR，即实现的是 FIFO 方式的存取`



### 消息队列接收

```cpp
//参数1：消息队列句柄
//参数2：从消息队列中复制出数据后所储存的缓冲地址，缓冲区空间要大于等于消息队列创建函数 xQueueCreate 所指定的单个消息大小，否则取出的数据无法全部存储到缓冲区，从而造成内存溢出。
//参数3：消息队列为空时，等待消息队列有数据的最大等待时间，单位系统时钟节拍
//返回值：如果接收到消息返回 pdTRUE，否则返回 pdFALSE
BaseType_t xQueueReceive( QueueHandle_t xQueue, void * const pvBuffer, TickType_t xTicksToWait );
```

使用这个函数要注意以下问题：

1. 此函数是用于任务代码中调用的，故不可以在中断服务程序中调用此函数
2. 如果消息队列为空且第三个参数为 0，那么此函数会立即返回
3. 如果用户将 `FreeRTOSConfig.h` 文件中的宏定义 `INCLUDE_vTaskSuspend`  配置为 1 且第三个参数配置为 `portMAX_DELAY`，那么此函数会永久等待直到消息队列有数据



### 任务与任务程序

{% note simple %}

`按键1`：打印任务执行情况

`按键2`：向队列1发送单个数据

`按键3`：向队列2发送字符串

创建4个任务，分别是 `LED任务`，`按键任务`，`队列1接收任务`，`队列2接收任务`

{% endnote %}

{% note blue 'fas fa-fan' flat %}CubeMX配置{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230309152356.webp)

{% note blue 'fas fa-fan' flat %}程序编写{% endnote %}

-  `xQueueCreate(1,sizeof(uint32_t))` 可以写成 `xQueueCreate(1,4)`，因为uint32_t是4位，但是不能写成3否则接收数据是负数乱码



{% folding, AllTask.c %}

```cpp
extern osThreadId vled1_taskfunctionHandle;
extern osThreadId queue1rx_taskfunctionHandle;
extern osThreadId queue2rx_taskfunctionHandle;
extern osThreadId vkey_taskfunctionHandle;

//定义队列变量
QueueHandle_t xQueue1 = NULL;
QueueHandle_t xQueue2 = NULL;

//队列创建
void Queue_Create(void)
{
	//创建消息队列1接收1个消息
	xQueue1 = xQueueCreate(1,sizeof(uint32_t));
	if(NULL == xQueue1)
	{
		printf("创建消息队列1失败\r\n");
	}
	else
	{
		printf("创建消息队列1成功\r\n");
	}
	//创建消息队列2接收2个消息
	xQueue2 = xQueueCreate(2,16);
	if(NULL == xQueue2)
	{
		printf("创建消息队列2失败\r\n");
	}
	else
	{
		printf("创建消息队列2成功\r\n");
	}
}

//消息队列2任务
void Queue2RX_TaskFunction(void const * argument)
{
	uint8_t ucRX_Data[16] = {0};	//接收队列2数据数组
	
	for(;;)
	{
		if(pdTRUE == xQueueReceive(xQueue2,ucRX_Data,portMAX_DELAY))	//永远等待它不会超时的
		{
			printf("成功接收消息队列2的字符串：%s\r\n",ucRX_Data);
		}
	}
}

//消息队列1任务
void Queue1RX_TaskFunction(void const * argument)
{
	uint32_t ucRx_Data;	//存放接收的数据
	const TickType_t RX_BlockTime = pdMS_TO_TICKS(1000);	//1s
	
	for(;;)
	{
		if(pdTRUE == xQueueReceive(xQueue1,&ucRx_Data,RX_BlockTime))
		{
			printf("成功接收消息队列1的数据：%d\r\n",ucRx_Data);
		}
		else
		{
			printf("接收消息队列1的数据出现超时！！！\r\n");
		}
	}
}

//按键任务
void vKey_TaskFunction(void const* argument)
{
	for(;;)
	{
		KEY_function();
		KEY_RUNFLAG();
		osDelay(20);
	}
}


void vLED1_TaskFunction(void const * argument)
{
	for(;;)
	{
		LED_Togg(0x01);
		osDelay(1000);
	}
}
```

{% endfolding %}

{% folding, KEY.c %}

```cpp
extern osThreadId vled1_taskfunctionHandle;
extern osThreadId queue1rx_taskfunctionHandle;
extern osThreadId queue2rx_taskfunctionHandle;
extern osThreadId vkey_taskfunctionHandle;
extern QueueHandle_t xQueue1;
extern QueueHandle_t xQueue2;

void KEY_RUNFLAG(void)
{
	uint8_t CPU_Run[500];	//保存任务运行时间信息
	static uint32_t ucSend_Data = 1;	//向消息队列1发送的数据
	 const TickType_t SendBlockTime = pdMS_TO_TICKS(10);
	if(KeyData.KEY1_DOWN_FLAG)	//打印任务情况
	{
		KeyData.KEY1_DOWN_FLAG = 0;
		vTaskList((char*)&CPU_Run);	
		printf("-----------------------------------------------------------------------------------------\r\n");
		printf("任务名                                  任务状态  优先级  剩余栈  任务序号\r\n");
		printf("%s",CPU_Run);
		printf("-----------------------------------------------------------------------------------------\r\n");
		
		vTaskGetRunTimeStats((char*)&CPU_Run);
		printf("-----------------------------------------------------------------------------------------\r\n");
		printf("任务名                                 运行计数              利用率\r\n");
		printf("%s",CPU_Run);
		printf("-----------------------------------------------------------------------------------------\r\n");		
	}
	if(KeyData.KEY2_DOWN_FLAG)	//向队列1发送单个数据
	{
		KeyData.KEY2_DOWN_FLAG = 0;
		if(pdTRUE == xQueueSend(xQueue1,&ucSend_Data,SendBlockTime))
		{
			printf("成功向消息队列1发送数据：%d\r\n",ucSend_Data);
		}
		else
		{
			printf("向消息队列1发送数据出现超时！！！\r\n");
		}
		//更新要发送的数据
		ucSend_Data += 1000;
	}
	if(KeyData.KEY3_DOWN_FLAG)
	{
		KeyData.KEY3_DOWN_FLAG = 0;
		if(pdTRUE == xQueueSend(xQueue2,"MCUSTM32G431\r\n",0))
		{
			printf("成功向消息队列2发送字符串：%s\r\n","MCUSTM32G431");
		}
		else
		{
			printf("按键3向消息队列2发送字符串出现超时！！！\r\n");
		}
	}
	if(KeyData.KEY4_DOWN_FLAG)
	{
		KeyData.KEY4_DOWN_FLAG = 0;
		if(pdTRUE == xQueueSend(xQueue2,"Yang5201314",0))
		{
			printf("成功向消息队列2发送字符串：%s\r\n","Yang5201314");
		}
		else
		{
			printf("按键4向消息队列2发送字符串出现超时！！！\r\n");
		}
	}	
}
```

{% endfolding %}



{% note blue 'fas fa-fan' flat %}实验现象{% endnote %}

因为消息队列1任务是一直在判断是否接收到数据，如果没有接收到则会打印 `接收消息队列1的数据出现超时！！！`，间隔是1s(任务里有写)，当按下按键2则发送32位的数据，然后消息队列1任务就接收打印，按键3则发送字符串，因为接收任务那是使用无限等待的，所以不会返回FALSE，直到接收到字符串数据才打印



![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230309173421.webp)

### 中断与任务程序

{% note blue 'fas fa-fan' flat %}MX创建队列注意{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230322124550.webp)

```cpp
osMessageQId myQueue01Handle;

osMessageQDef(myQueue01, 10, ucUSART1_RX_BUFF);
myQueue01Handle = osMessageCreate(osMessageQ(myQueue01), NULL);
```

这个消息大小可以是 `uint8_t,uint16_t...`，也可以是结构体名称，数组名称(需要在程序里定义)

需要注意 `Item Size` 不能直接填数字，原因是：

首先看它底层，它这个最终是使用 `sizeof()` 来计算的所以如果给数字，那它只能是4(int)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230322125126.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230322124959.webp)



{% note simple %}

创建3个任务，分别是LED，按键，队列1任务

创建一个消息队列名字为：`myQueue01`

配置 `USART1`中断

实验分析：在串口1中断里进行消息队列的发送，然后在队列1任务里进行打印接收的数据

{% endnote %}



{% note blue 'fas fa-fan' flat %}CubeMX配置{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230322125848.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230322164916.webp)

{% note blue 'fas fa-fan' flat %}程序编写{% endnote %}

{% folding, my_usart1.h %}

```cpp
#ifndef __MY_USART1_H
#define __MY_USART1_H
#include "AllTask.h"

#define RX_MAX_LEN 10


extern uint8_t ucUSART1_RX_BUFF[RX_MAX_LEN];
extern uint8_t ucRx_Len;
extern bool Rx_Over_Flag;


#endif
```

{% endfolding %}

{% folding, my_usart1.c %}

1. 将串口接收数据放在队列发送数据后面，这样可以避免在发送数据时接收到新的数据导致数据丢失
2. 将任务切换放在最后，这样可以避免在任务切换时新的中断到来导致数据丢失
3. 添加了队列满的处理，可以选择丢弃数据或者等待队列可用

```cpp
#include "my_usart1.h"

uint8_t ucUSART1_RX_BUFF[RX_MAX_LEN] = {0};
uint8_t ucRx_Len = 0;
bool Rx_Over_Flag = 0;

void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart)
{
    BaseType_t xHigherPriorityTaskWoken = pdFALSE;
    if(huart == &huart1)
    {
        //向队列1发送数据
        if(xQueueSendFromISR(myQueue01Handle, ucUSART1_RX_BUFF, &xHigherPriorityTaskWoken) != pdPASS)
        {
            //如果队列满了，可以选择丢弃数据或者等待队列可用
            //xQueueReset(myQueue01Handle);
            //xQueueSendFromISR(myQueue01Handle, ucUSART1_RX_BUFF, &xHigherPriorityTaskWoken);
			printf("队列满了\r\n");
        }
        //继续通过串口中断接收字符
        HAL_UART_Receive_IT(&huart1,(uint8_t*)ucUSART1_RX_BUFF, RX_MAX_LEN);
    }
    //如果有高优先级任务就绪，执行一次任务切换
    portYIELD_FROM_ISR(xHigherPriorityTaskWoken);
}
```

{% endfolding %}

{% folding, AllTask.c %}

```cpp
//消息队列1任务
void Queue1RX_TaskFunction(void const * argument)
{
	uint8_t ucRx_Data[10] = {0};	//存放接收的数据
	
	//接收中断，够RX_MAX_LEN个才会触发中断
	HAL_UART_Receive_IT(&huart1,(uint8_t*)ucUSART1_RX_BUFF,RX_MAX_LEN);
	for(;;)
	{
		if(pdPASS == xQueueReceive(myQueue01Handle,&ucRx_Data,portMAX_DELAY))
		{
			printf("成功接收消息队列1的数据：%s\r\n",ucRx_Data);
		}
	}
}
```

{% endfolding %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230322164813.webp)

## 第11讲

### 信号量的概念与分类

 `消息队列` 是实现任务与任务或任务与中断间通信的数据结构，可类比裸机编程中的数组

`信号量` 是实现任务与任务或任务与中断间通信的机制，可以类比裸机编程中的标志位

比如：比如有个 30 人的电脑机房，我们就可以创建信号量的初始化值是 30，表示 30 个可用资源，不理解的初学者表示信号量还有初始值？是的，信号量说白了就是 `共享资源的数量`。 另外我们要求一个同学使用一台电脑，这样每有一个同学使用一台电脑，那么信号量的数值就减一，直到 30 台电脑都被占用，此时信号量的数值就是 0。 如果此时还有几个同学没有电脑可以使用，那么这几个同学就得等待，直到有同学离开。 有一个同学离开，那么信号量的数值就加 1，有两个就加 2，依此类推。刚才没有电脑用的同学此时就有电脑可以用了，有几个同学用，信号量就减几，直到再次没有电脑可以用，这么一个过程就是使用信号量来管理共享资源的过程。

信号量可以实现任务与任务或任务与中断间的 `同步功能(二值信号量)`、 `资源管理(计数信号量)`、 `临界资源的互斥访问(互斥信号量)`等

信号量是一个 `非负正数`，二值信号量与互斥信号量取值范围为 `0-1`，计数信号量取值范围是 `0-N(N>1)` , 0表示信号量为空，所有试图获取它的任务都将处于阻塞状态，直到超时退出或其他任务释放信号量 正数表示有一个或多个信号量供获取

平时使用信号量主要实现以下两个功能：

平时使用信号量主要实现以下两个功能：

1. 两个任务之间或者中断函数跟任务之间的同步功能，这个和前面章节讲解的事件标志组是类似的。其实就是共享资源为 1 的时候。
2. 多个共享资源的管理，就像上面举的机房上机的例子。针对这两种功能，FreeRTOS 分别提供了二值信号量和计数信号量，其中二值信号量可以理解成计数信号量的一种特殊形式，即初始化为仅有一个资源可以使用，只不过 FreeRTOS 对这两种都提供了 API函数，而像 RTX，uCOS-II 和 III 是仅提供了一个信号量功能，设置不同的初始值就可以分别实现二值信-号量和计数信号量。 当然，FreeRTOS 使用计数信号量也能够实现同样的效果。

|              信号量的分类               |
| :-------------------------------------: |
| 二值信号量(重点同步应用,类似裸机的Flag) |
|        计数信号量(重点资源管理)         |
|        互斥信号量(重点互斥访问)         |
|        递归互斥信号量(简单了解)         |



### 二值信号量的定义与应用

`定义`：信号量资源被获取了，信号量值就是 `0`，信号量资源被释放，信号量值就是 `1`，把这种只有 0 和 1 两种情况的信号量称之为二值信号量。

创建二值信号量时，系统会为创建的二值信号量分配内存，二值信号量创建完成后的示意图为：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230322181743.webp)

从上图可以看出，二值信号量是一种 `长度为1，消息大小为0的特殊消息队列`。

因为这个队列只有空或满两种状态，而且消息大小为0，因此在运用时，只需要知道队列中是否有消息即可，而无需关注消息是什么。

在嵌入式系统中，二值信号量是 `任务与任务` 或者 `任务与中断` 间 `同步`的重要手段

二值信号量也可以用于 `临界资源的访问`，但不建议，因为存在 `任务优先级翻转` 问题，这个将在下一讲的 `互斥信号量`(具有优先级继承机制)中进行详细讲解

{% note simple %}

任务与任务中同步的应用场景

假设有一个温湿度传感器，每1s采集一次数据，那么让它在液晶屏中显示数据，这个周期也是1s，如果液晶屏刷新的周期是100ms，那么此时的温湿度数据还没更新，液晶屏根本无须刷新，只需要在1s后温湿度数据更新时刷新即可，否则CPU就是白白做了多次的无效数据更新操作，造成CPU资源浪费。如果液晶屏刷新的周期是10s，那么温湿度的数据都变化了10次，液晶屏才来更新数据，那么这个产品测得的结果就是不准确的，所以还是需要同步协调工作，在温湿度采集完毕之后进行液晶屏数据的刷新，这样得到的结果才是最准确的，并且不会浪费CPU的资源。

上面例子虽然也可以像裸机直接设置一个标志位来进行判断，但是拿信号量来实现的好处是可以解决多任务之间的同步和互斥问题

{% endnote %}

 {% note simple %}

任务与中断中同步的应用场景

在串口接收中，我们不知道什么时候有数据发送过来，但如果设置一个任务专门时刻查询是否有数据到来，将会浪费CPU资源，所以在这种情况下使用二值信号量是很好的办法: `当没有数据到来时，任务进入阻塞态，不参与任务的调度;等到数据到来了，释放一个二值信号量，任务就立即从阻塞态中解除，进入就绪态，然后在运行时处理数据，这样系统的资源就会得到很好的利用`。

{% endnote %}

### 二值信号量的运作机制

{% note blue 'fas fa-fan' flat %}任务间二值信号量的实现{% endnote %}

任务间二值信号量的实现是指各个任务之间使用信号量实现任务的同步功能。下面我们通过如下的框图来说明一下FreeRTOS二值信号量的实现：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230322193319.webp)

{% note simple %}

- 首先创建2个任务Task1和Task2
- 创建二值信号量默认的初始值是0，也就是没有可用资源

`运行过程`：任务Task1运行过程中调用函数 `xSemaphoreTake` 获取信号量资源，但是由于创建二值信号的初始值是0，没有信号量可以用，任务Task1将由运行态转到阻塞状态。运行的过程中任务Task2通过函数 `xSemaphoreGive` 释放信号量，任务Task1由阻塞态进入到就绪态，在调度器的作用下由就绪态又进入到运行态，实现Task1与Task2的同步功能。

{% endnote %}

{% note blue 'fas fa-fan' flat %}中断方式二值信号量的实现{% endnote %}

FreeRTOS中断方式二值信号量的实现是指中断与任务间使用信号量实现同步功能。下面我们通过如下的框图来说明一下FreeRTOS中断方式二值信号量的实现：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230322193757.webp)

{% note simple %}

- 创建1个任务Task1和一个串口接收中断
- 二值信号量的初始值为0，串口中断调用函数 `xSemaphoreGiveFromISR` 释放信号量，任务Task1调用函数 `xSemaphoreTake` 获取信号量资源

 `运行过程`：任务Task1运行过程中调用函数 `xSemaphoreTake`，由于信号量的初始值是0，没有信号量资源可用，任务Task1由运行态进入到阻塞态。Task1阻塞的情况下，串口接收到数据进入到了串口中断服务程序，在串口中断服务程序中调用函数 `xSemaphoreGiveFromlSR` 释放信号量资源，信号量数值加1，此时信号量计数值为1，任务Task1由阻塞态进入到就绪态，在调度器的作用下由就绪态又进入到运行态，任务Task1获得信号量后，信号量数值减1，此时信号量计数值又变成了0。再次循环执行时，任务Task1调用函数 `xSemaphoreTake` 由于没有资源可用再次进入到挂起态，等待串口释放二值信号量资源，如此往复循环。

{% endnote %}

{% note red 'fas fa-fan' flat %}实际应用中，中断方式的消息机制要注意以下四个问题{% endnote %}

1. 中断函数的 `执行时间越短越好`，防止其它低于这个中断优先级的异常不能得到及时响应
2. 实际应用中，建议 `不要在中断中实现消息处理`，用户可以在中断服务程序里面发送消息通知任务，在任务中实现消息处理，这样可以有效地保证中断服务程序的实时响应。同时此任务也需要设置为高优先级，以便退出中断函数后任务可以得到及时执行
3. 中断服务程序中一定要 `调用专用于二值信号量设置函数`，即以FromISR结尾的函数
4. 如果FreeRTOS工程的中断函数中调用了FreeRTOS的二值信号量的API函数退出的时候 `要检测是否有高优先级任务就绪，如果有就绪的，需要在退出中断后进行任务切换`



### 常用的API函数

使用二值信号量的典型流程如下:

1. 创建二值信号量
2. 释放二值信号量(0-->1)
3. 获取二值信号量(1-->0)
4. 删除二值信号量

{% note blue 'fas fa-fan' flat %}二值信号量创建与删除{% endnote %}

- 二值信号量控制块(句柄)

二值信号量的句柄为消息队列的句柄，因为二值信号量是一种长度为1，消息大小为0的特殊消息队列； 变量`xBinarySem` 是一个指向 `osSemaphoreId` 类型的指针，用于保存信号量的句柄或者标识符

```cpp
//定义二值信号量
osSemaphoreId xBinarySem = NULL;
```

通过点击 `osSemaphoreId` 跳转可以看到最后它其实也是一个消息队列句柄

```cpp
osSemaphoreId --> typedef SemaphoreHandle_t osSemaphoreId; --> typedef QueueHandle_t SemaphoreHandle_t; --> typedef struct QueueDefinition * QueueHandle_t;
```

- 二值信号量的创建

```cpp
//函数原型
//函数描述：创建二值信号量
//返回值：创建成功会返回二值信号量的句柄，如果由于 FreeRTOSConfig.h文件中heap大小不足，无法为此二值信号量提供所需的空间会返回NULL
QueueHandle_t xSemaphoreCreateBinary(void)
```

此函数是基于消息队列函数实现：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230322202616.png)

```cpp
//使用示例
xBinarySem = xSemaphoreCreateBinary();
if(NULL == xBinarySem)
{
    printf("创建二值信号量失败\r\n");
}
else
{
    printf("创建二值信号量成功\r\n");
}
```

- 二值信号量删除

```cpp
//函数原型
//函数描述：用于删除二值信号量
void vSemaphoreDelete(void);
```

- 任务中二值信号量释放

```cpp
//函数原型
//函数描述：用于任务中二值信号量释放
//参数：信号量句柄
//返回值：如果信号量释放成功返回pdTRUE,否则返回pdFALSE,因为信号量的实现是基于消息队列，返回失败的主要原因是消息队列已经满了
BaseType_t xSemaphoreGive(SemaphoreData_t xSemaphore);
```

使用这个函数需要注意下面问题：

1. 此函数是用于任务代码中调用的，故不可以在中断服务程序中调用此函数，中断服务程序中使用的是 `xSemaphoreGiveFromISR`

2. 使用此函数前，一定要保证用函数 `xSemaphoreCreateBinary()--二值`,  `xSemaphoreCreateMutex()--互斥` 或者 `xSemaphoreCreateCounting()--计数` 创建了信号量
3. 此函数不支持使用 `xSemaphoreCreateRecursiveMutex()--递归互斥` 创建的信号量

```cpp
//使用示例
printf("发送同步信号\r\n");
xResult = xSemaphoreGive(xBinarySem);
if(pdTRUE == xResult)
{
    printf("成功发送二值信号量同步信号，次数=%d\r\n",++GiveCnt);
}
else
{
    printf("发送二值信号量同步信号失败\r\n");
}
```

- 中断中二值信号量释放

```cpp
//函数原型
//函数描述：用于中断服务程序中释放信号量
//参数1：信号量句柄
//参数2：用于保存是否有高优先级任务准备就绪。如果函数执行完毕后，此参数是pdTRUE，说明有高优先级任务要执行，否则没有
//返回值：如果信号量释放成功返回pdTRUE，否则返回errQUEUE_FULL
BaseType_t xSemaphoreGiveFromISR( SemaphoreData_t xSemaphore, BaseType_t * const pxHigherPriorityTaskWoken );
```

使用这个函数需要注意下面问题：

1. 此函数是基于消息队列函数 `xQueueGiveFromISR` 实现的:

```cpp
#define xSemaphoreGiveFromISR( xSemaphore, pxHigherPriorityTaskWoken )	xQueueGiveFromISR( ( QueueHandle_t ) ( xSemaphore ), ( pxHigherPriorityTaskWoken ) )
```

2. 此函数是用于中断服务程序中调用的，故不可以任务代码中调用此函数，任务代码中中使用的是 `xSemaphoreGive`。
3. 使用此函数前，一定要保证用函数 `xSemaphoreCreateBinary()` 或者 `xSemaphoreCreateCounting()` 创建了信号量。
4. 此函数不支持使用 `xSemaphoreCreateMutex()` 创建的信号量。

```cpp
//使用示例
void HAL_UART_RxCpltCallback(UART_HandleTypeDefe *huart)
{
    BaseType_t xHigherPriorityTaskWoken = pdFALSE;
    
    if(huart->Instance == huart3.Instance)
    {
        //发送同步信号
        xSemaphoreGiveFromISR(myBinarySem01Handle,&xHigherPriorityTaskWoken);
        //如果有高优先级任务就绪，执行一次任务切换
        portYIELD_FROM_ISR(xHigherPriorityTaskWoken);
    }
}
```

- 任务中二值信号量获取

```cpp
//函数原型
//参数1：信号量句柄
//参数2：是没有信号量可用时，等待信号量可用的最大等待时间，单位系统节拍
//返回值：如果创建成功会获取信号量返回pdTRUE,否则返回pdFALSE
BaseType_t xSemaphoreTake(SemaphoreData_t xSemaphore, TickType_t xBlockTime);
```

使用这个函数需要注意下面问题：

1. 此函数是用于任务代码中调用的，故不可以在中断服务程序中调用此函数，中断服务程序使用的是 `xSemaphoreTakeFromISR`
2. 如果消息队列为空且第2个参数为0，那么此函数会立即返回
3. 如果用户将 FreeRTOSConfig.h 文件中的宏定义 `INCLUDE_vTaskSuspend` 配置为1且第2个参数配置为 `portMAX_DELAY`，那么此函数会永久等待直到信号量可用。(一般串口我们设置为永久等待)

```cpp
//使用示例
uint8_t ucUSART1_RX_BUFF[10] = {0};

void BinarySem_SyncReceive_Task(void const *argument)
{
    BaseType_t xResult;
    uint16_t TakeCnt = 0;	//获取计数
    
    for(;;)
    {
        //通过串口中断接收10个字符
        HAL_UART_Receive_IT(&huart1,(uint8_t*)ucUSART1_RX_BUFF,10);
        printf("等待同步信号，无限等待\r\n");
        xResult = xSemaphoreTake(myBinarySem01Handle,portMAX_DELAY);
        if(pdTRUE == xResult)
        {
            printf("成功接收到二值信号量同步信号次数 = %d\r\n",++TakeCnt);
            printf("接收达到的串口数据：%s\r\n",ucUSART1_RX_BUFF);
        }
    }
}
```



### 任务与任务程序

{% note simple %}

创建3个任务：LED，按键，信号量同步

手动创建二值信号量

{% endnote %}

{% note blue 'fas fa-fan' flat %}MX配置{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230323083328.webp)

{% note blue 'fas fa-fan' flat %}程序编写{% endnote %}

{% folding, app_freertos.c(自动创建的) %}

这里我们调用API手动创建二值信号量

```cpp
//定义二值信号量
osSemaphoreId xBinartSem = NULL;

void MX_FREERTOS_Init(void)
{
    ...
    xBinartSem = xSemaphoreCreateBinary();
    if(NULL == xBinartSem)
    {
	    printf("创建二值信号量失败\r\n");
    }
    else
    {
	    printf("创建二值信号量成功\r\n");
    }        
}
```

{% endfolding %}

{% folding, AllTask.c %}

```cpp
extern osSemaphoreId xBinartSem;

//同步信号任务
void Binarysem_Function(void const * argument)
{
	BaseType_t xResult;
	uint16_t TakeCnt = 0;	//获取计数
	for(;;)
	{
		printf("等待同步信号，无限等待\r\n");
		xResult = xSemaphoreTake(xBinartSem,portMAX_DELAY);	//获取二值信号量
		
		if(pdTRUE == xResult)
		{
			printf("成功接收到二值信号量同步信号，次数=%d\r\n",++TakeCnt);
		}
	}
}
```

{% endfolding %}

{% folding, KEY.c %}

```cpp
extern osSemaphoreId xBinartSem;
uint16_t GiveCnt = 0;	//释放计数

void KEY_RUNFLAG(void)
{
	if(KeyData.KEY2_DOWN_FLAG)	
	{
		KeyData.KEY2_DOWN_FLAG = 0;
		printf("发送同步信号\r\n");
		xResult = xSemaphoreGive(xBinartSem);	//释放二值信号量
		
		if(pdTRUE == xResult)
		{
			printf("成功发送二值信号量同步信号，次数 = %d\r\n",++GiveCnt);
		}
		else
		{
			printf("发送二值信号量同步信号失败\r\n");
		}
	}    
}
```

{% endfolding %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230323081710.webp)

### 中断与任务程序

{% note blue 'fas fa-fan' flat %}MX创建二值信号量{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230323130048.webp)

```cpp
//MX生成的创建二值信号量代码
osSemaphoreId myBinarySem01Handle; 

osSemaphoreDef(myBinarySem01);
myBinarySem01Handle = osSemaphoreCreate(osSemaphore(myBinarySem01), 1);
```

需要注意的是我们需要手动添加一些代码在它创建完后面：

```cpp
if(NULL == myBinarySem01Handle)
{
    printf("创建二值信号量失败\r\n");
}
else
{
    printf("创建二值信号量成功\r\n");
}
xSemaphoreTake(myBinarySem01Handle, 0);	//MX生成的创建二值信号量时默认为1所以需要去获取一次
```

因为它默认生成的代码是默认是1(即默认是释放)，所以需要创建完二值信号量后获取一次(信号量变成0),原因可以通过点击 `osSemaphoreCreate` 函数跳转源码查看：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230323130711.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230323130744.png)



{% note blue 'fas fa-fan' flat %}程序编写{% endnote %}

{% folding, my_usart1.c %}

```cpp
extern osSemaphoreId myBinarySem01Handle;

void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart)
{
	BaseType_t xHigherPriorityTaskWoken = pdFALSE;
	
	if(&huart1 == huart)
	{
		//发送同步信号
		xSemaphoreGiveFromISR(myBinarySem01Handle,&xHigherPriorityTaskWoken);
		//如果有高优先级任务则进行一次切换
		portYIELD_FROM_ISR(xHigherPriorityTaskWoken);
	}
}
```

{% endfolding %}

{% folding, AllTask.c %}

```cpp
extern osSemaphoreId myBinarySem01Handle;

void Binarysem_Function(void const * argument)
{
	BaseType_t xResult;
	uint16_t TakeCnt = 0;	//获取计数
	for(;;)
	{
		//通过串口中断接收10个字符
		HAL_UART_Receive_IT(&huart1,(uint8_t*)ucUSART1_RX_BUFF,RX_MAX_LEN);
		printf("等待同步信号，无限等待\r\n");
		xResult = xSemaphoreTake(myBinarySem01Handle,portMAX_DELAY);
		printf("num:%ld\r\n",xResult);
		if(pdTRUE == xResult)
		{
			printf("成功接收到二值信号量同步信号，次数：%d\r\n",++TakeCnt);
			printf("接收到的串口数据：%s\r\n",ucUSART1_RX_BUFF);
		}
	}
}
```

{% endfolding %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230323130438.webp)



## 第12讲

### 计数信号量的定义与应用

 `取值大于1的信号量称之为计数信号量`

>  计数信号量的取值也可以为1，但通常大于1，如果取值为1，相当于只有0与1两种状态，用二值信号量即可。
> 创建计数信号量时，系统会为创建的计数信号量分配内存
>
> 因为这个队列的消息大小为0，因此在运用时，只需要知道队列中是否有消息即可，而无需关注消息是什么。

{% note simple %}

应用场景：

计数信号量允许多个任务对其进行操作，但限制了任务的数量。比如有一个停车场，里面只有50个车位，那么只能停50辆车，相当于我们的信号量有50个。假如一开始停车场的车位还有50个，那么每进去一辆车就要消耗一个停车位，车位的数量就要减1，相应地，我们的信号量在使用之后也需要减1。当停车场停满了50辆车时，此时的停车位数量为0，再来的车就不能停进去了，否则将没法停车了，也相当于我们的信号量为0，后面的任务对这个停车场资源的访问也无法进行。当有车从停车场离开时，车位又空余出来了，那么后面的车就能停进去了。信号量操作也是一样的，当我们释放了这个资源，后面的任务才能对这个资源进行访问。

{% endnote %}

 ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230411140902.webp)

◆ 任务Task1运行过程中调用函数 `xSemaphoreTake` 获取信号量资源，如果信号量大于0，Task1将直接获取资源。如果信号量为0，任务Task1将由运行态转到阻塞状态，等待资源可用。一旦获取了资源并使用完毕后会通过函数 `xSemaphoreGive` 释放掉资源

◆ 任务Task2至N运行过程中调用函数 `xSemaphoreTake` 获取信号量资源，如果信号量大于0，Task2至N将直接获取资源。如果信号量为0，任务Task2至N将由运行态转到阻塞状态，等待资源可用。一旦获取了资源并使用完毕后会通过函数 `xSemaphoreGive` 释放掉资源

### 常用的API函数

使用计数信号量的典型流程如下(除了创建不一样其他的跟二值一样):

1. 创建计数信号量
2. 释放计数信号量
3. 获取计数信号量
4. 删除计数信号量

{% note blue 'fas fa-fan' flat %}计数信号量创建与删除{% endnote %}

二值信号量的句柄为消息队列的句柄，因为二值信号量是一种长度大于1，消息大小为0的特殊消息队列； 变量`myCountingSem01Handle` 是一个指向 `osSemaphoreId` 类型的指针，用于保存信号量的句柄或者标识符

- 计数信号量的创建

```cpp
//参数1--支持的最大计数值
//参数2--初始计数值不能超过最大值
//返回值--如果创建成功会返回消息队列的句柄，如果由于FreeRTOSConfig.h文件中heap大小不足，无法为此消息队列提供所需的空间会返回NULL
SemaphoreHandle_t xSemaphoreCreateCounting(UBaseType_t uxMAXCount,UBaseType_t uxInitialCount);
```

```cpp
osSemaphoreDef(myCountingSem01);
myCountingSem01Handle = osSemaphoreCreate(osSemaphore(myCountingSem01), 20);
```

`注意`:需要把宏定义设为1才能使用计数信号量(在MX里使能 `USE_COUNTING_SEMAPHORES`即可)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230411150210.webp)



### 任务与任务

{% note simple %}

创建3个任务：LED，按键，LCD显示计数信号量

创建二值信号量，计数信号量

{% endnote %}

{% note blue 'fas fa-fan' flat %}MX配置{% endnote %}

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230411151721.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230411151940.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230411152538.webp)

{% endgallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230411160529.webp)

{% note blue 'fas fa-fan' flat %}程序编写{% endnote %}

{% folding, app_freertos.c %}

```cpp
void MX_FREERTOS_Init(void)
{
    ...
    if(NULL == myBinarySem01Handle)
    {
        printf("创建二值信号量失败\r\n");
    }
    else
    {
        printf("创建二值信号量成功\r\n");
    }
    if(NULL == myCountingSem01Handle)
    {
        printf("创建计数信号量失败\r\n");
    }
    else
    {
        printf("创建计数信号量成功\r\n");
    }
    //xSemaphoreTake(myBinarySem01Handle,0);	//MX生成的创建二值信号量时默认为1	（注释掉即默认更新一次LCD）
}
```

{% endfolding %}

{% folding, AllTask.c %}

```cpp
extern osThreadId vled1_taskfunctionHandle;
extern osThreadId vkey_taskfunctionHandle;
extern osThreadId vlcd_functionHandle;

extern osSemaphoreId myBinarySem01Handle;
extern osSemaphoreId myCountingSem01Handle;

uint8_t myCountingSem_ucMessageWaiting = 20;	//最大值

//同步任务
void Lcd_Function(void const *argument)
{
    BaseType_t xResult;
    uint16_t TakeCnt = 0;	//获取计数
    char Display_Str[20] = " ";

    for(;;)
    {
        printf("无限等待同步信号更新显示，第%u次等待，等待中\r\n", ++TakeCnt);
        xResult = xSemaphoreTake(myBinarySem01Handle, portMAX_DELAY);
        LED.Led_State ^= 2;
        LED.vLed_write_all(LED.Led_State);
        if(pdTRUE == xResult)
        {
            printf("更新显示\r\n");
            snprintf(Display_Str, sizeof(Display_Str), " NOW CAR NUMBER:%d ", myCountingSem_ucMessageWaiting);
            LCD_DisplayStringLine(Line1, (uint8_t *)Display_Str);
        }
    }
}

//按键任务
void vKey_TaskFunction(void const *argument)
{
    for(;;)
    {
        KEY.vKey_scan_function();
        KEY.vKey_run_flag_function();
        osDelay(20);
    }
}

//LED任务
void vLED1_TaskFunction(void const *argument)
{
    for(;;)
    {
        LED.Led_State ^= 1;
        LED.vLed_write_all(LED.Led_State);
        osDelay(1000);
    }
}



//初始化
void HardWare_init(void)
{
    LCD_Init();
    LCD_Clear(Blue);
    LCD_SetBackColor(Blue);
    LCD_SetTextColor(Black);
    LCD_DisplayStringLine(Line0, (uint8_t *)"      FreeRTOS      ");
    LED_Dis(0xFF, RESET);
    printf("----FreeRTOS----\r\n");
    printf("----计数信号量--模拟车库----\r\n");
    printf("默认车库可以停放20辆车，LCD显示车位数量\r\n");
    printf("按键功能如下：\r\n");
    printf("KEY1:打印任务执行情况\r\n");
    printf("KEY2:获取信号量，模拟车辆入库，同时通过二值信号量发同步信号给LCD显示");
    printf("KEY3:释放信号量，模拟车辆出库，同时通过二值信号量发同步信号给LCD显示");
    HAL_TIM_Base_Start_IT(&htim6);	//开启定时器6
}
```

{% endfolding %}

{% folding, KEY.c %}

```cpp
extern uint8_t myCountingSem_ucMessageWaiting;
extern osSemaphoreId myBinarySem01Handle;
extern osSemaphoreId myCountingSem01Handle;

//按键执行功能
void vKey_run_flag_function(void)
{
    BaseType_t xResult;

    if(KEY.Key_Down_Buff[1])
    {
        KEY.Key_Down_Buff[1] = 0;
        printf("获取计数信号量，模拟车辆入库，申请停车位");
        xResult = xSemaphoreTake(myCountingSem01Handle, 0);
        if(pdTRUE == xResult)
        {
            printf("获取成功，成功申请停车位，发送同步显示信号\r\n");
            myCountingSem_ucMessageWaiting--;	//把这个放前面而不放下面是因为一旦释放了二值会立马唤醒LCD显示但是变量还没减，另一种方案就是把按键的优先级提高
            xSemaphoreGive(myBinarySem01Handle);
        }
        else
        {
            printf("获取失败，停车位已满\r\n");
        }
    }
    if(KEY.Key_Down_Buff[2])
    {
        KEY.Key_Down_Buff[2] = 0;
        printf("释放计数信号量，模拟车库出库，让出停车位\r\n");
        xResult = xSemaphoreGive(myCountingSem01Handle);
        if(pdTRUE == xResult)
        {
            printf("释放成功，成功让出停车位，发送同步显示信号\r\n");
            myCountingSem_ucMessageWaiting++;
            xSemaphoreGive(myBinarySem01Handle);
        }
        else
        {
            printf("释放失败，停车位已空\r\n");
        }
    }
}
```

{% endfolding %}



{% note blue 'fas fa-fan' flat %}实验现象{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230411175312.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230411175520.webp)



## 第13讲

### 互斥信号量的定义与应用

取值只有0与1两种状态的信号量称之为二值信号量。

而互斥信号量是一种 `特殊的二值信号量`，具有 `防止优先级翻转` 的特性

互斥信号量是一种 `长度为1，消息大小为0` 的特殊消息队列。在嵌入式操作系统中， `互斥信号量用于临界资源的独占式访问`， `只能用于任务与任务间`，因为其特有的优先级继承机制只能在任务中起作用， `在中断的上下文环境毫无意义`。

{% note simple %}

比如有两个任务需要通过同一串口发送数据，其硬件资源只有一个，那么两个任务不能同时发送，否则会导致数据错误。此时就可以用互斥信号量对串口资源进行保护，当任务1正在使用串口发送数据时，互斥信号量变为无效，任务2无法使用串口，任务2必须等待互斥信号量有效(任务1释放信号量)，才能获得串口使用权，进而发送数据。

{% endnote %}

### 优先级翻转问题

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230411183627.webp)

> - 创建3个任务Task1，Task2和Task3，优先级分别为3，2，1。也就是Task1的优先级最高
>
> - 任务Task1和Task3互斥访问串口打印printf，采用二值信号实现互斥访问
>
> -  起初Task3通过二值信号量正在调用printf，被任务Task1抢占，开始执行任务Task1，也就是上图的起始位置
>
> -  任务Task1运行的过程需要调用函数printf，发现任务Task3正在调用，任务Task1会被挂起，等待Task3释放函数printf
>
> - 在调度器的作用下，任务Task3得到运行，Task3运行的过程中，由于任务Task2就绪，抢占了Task3的运行优先级翻转问题就出在这里了，从任务执行的现象上看，任务Task1需要等待Task2执行完毕才有机会得到执行，这个与抢占式调度正好反了， `正常情况下应该是高优先级任务抢占低优先级任务的执行，这里成了高优先级任务Task1等待低优先级任务Task2完成。这种情况被称之为优先级翻转问题`
>
> - 任务Task2执行完毕后，任务Task3恢复执行，Task3释放互斥资源后，任务Task1得到互斥资源，从而可以继续执行
>
> - 那为什么互斥信号量就可以解决这个问题？
>
> 当Task3执行的时候会临时提高Task3的优先级为高优先级，然后其他的Task2任务就不会打断到它，等Task3执行完后就恢复回原优先级，然后Task1就会执行(Task1就只需要等Task3执行完就行了)
>
>  `互斥信号量的优先级继承是继承要获取该信号量的任务的优先级。当一个高优先级任务请求获取一个被低优先级任务持有的互斥信号量时，系统会自动提升持有该信号量的低优先级任务的优先级到等于高优先级任务的优先级。这样可以确保在高优先级任务执行期间，不会有其他低优先级任务干扰其运行。当高优先级任务释放该互斥信号量时，持有该信号量的任务的优先级将恢复到原来的低优先级`

### 优先级翻转编程验证

{% note blue 'fas fa-fan' flat %}MX配置{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230411204746.webp)



{% note blue 'fas fa-fan' flat %}程序编写{% endnote %}

```cpp
extern osThreadId vhigh_priorityHandle;
extern osThreadId vmid_priorityHandle;
extern osThreadId vlow_priorityHandle;

//高优先级
void vHigh_Priority(void const * argument)
{
	BaseType_t xResult;
	
	for(;;)
	{
		printf("Hight 获取二值信号量\r\n");
		xResult = xSemaphoreTake(myBinarySem01Handle,portMAX_DELAY);	//获取无限等待
		if(xResult == pdTRUE)
		{
			printf("Hight Running\r\n");
		}
		printf("Hight 释放二值信号量\r\n");
		xResult = xSemaphoreGive(myBinarySem01Handle);
		osDelay(500);
	}
}
//中优先级
void vMid_Priority(void const * argument)
{
	for(;;)
	{
		printf("Mid Running\r\n");
		osDelay(500);
	}	
}
//低优先级
void vLow_Priority(void const * argument)
{
	BaseType_t xResult;
	
	for(;;)
	{
		printf("low 获取二值信号量\r\n");
		xResult = xSemaphoreTake(myBinarySem01Handle,portMAX_DELAY);
		if(xResult == pdTRUE)
		{
			printf("low Running\r\n");
		}
		HAL_Delay(3000);	//延时3s 模拟低优先级长时间占用信号量
		printf("low 释放二值信号量\r\n");
		xResult = xSemaphoreGive(myBinarySem01Handle);
		osDelay(500);
	}	
}
```



{% note blue 'fas fa-fan' flat %}实验现象{% endnote %}

在低优先级 `HAL_Delay` 期间被中优先级抢占了,需要注意的是要把其他除这3个任务外的所有任务都屏蔽才看到效果(不实现weak即可)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230411204545.webp)



### 常用的API函数

使用互斥信号量的典型流程如下(只能在任务中使用不能在中断中使用，只是创建不一样其他跟前面一样):

1. 创建互斥信号量
2. 释放互斥信号量
3. 获取互斥信号量
4. 删除互斥信号量

{% note blue 'fas fa-fan' flat %}互斥信号量控制块(句柄){% endnote %}

```cpp
typedef SemaphoreHandle_t osMutexId;
typedef QueueHandle_t SemaphoreHandle_t;

//定义互斥信号量
osMutexId myMutex01Handle;
```

{% note blue 'fas fa-fan' flat %}互斥信号量的创建{% endnote %}

```cpp
//创建互斥信号量
//返回值：创建成功返回互斥信号量的句柄，如果由于FreeRTOSConfig.h文件中heap大小不足，无法为此互斥信号量提供所需的空间会返回NULL
SemaphoreHandle_t xSemaphoreCreateMutex(void);
```

```cpp
osMutexDef(myMutex01);
myMutex01Handle = osMutexCreate(osMutex(myMutex01));
```

使用这个函数要注意以下问题：

1. 使用此函数要在FreeRTOSConfig.h 文件中使能宏定义:  `#define configUSE_MUTEXES 1`



### 互斥信号量应用编程

{% note blue 'fas fa-fan' flat %}MX配置{% endnote %}

需要在MX使能 `USE_MUTEXES`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230411212629.webp)

任务的话跟上面优先级翻转编程一样配置



{% note blue 'fas fa-fan' flat %}程序编写{% endnote %}

{% folding, app_freertos.c %}

```cpp
void MX_FREERTOS_Init(void)
{
    ...
    if(NULL == myMutex01Handle)
    {
        printf("创建互斥信号量成功\r\n");
    }
    else
    {
        printf("创建互斥信号量失败\r\n");
    }
}
```

{% endfolding %}

{% folding, AllTask.c %}

```cpp
extern osMutexId myMutex01Handle;

extern osThreadId vhigh_priorityHandle;
extern osThreadId vmid_priorityHandle;
extern osThreadId vlow_priorityHandle;


void vHigh_Priority(void const * argument)
{
	BaseType_t xResult;
	
	for(;;)
	{
		printf("Hight 获取互斥信号量\r\n");
		//在这里去获取一个被低优先级持有的互斥信号量时会临时提高低优先级的优先级为高优先级！！！
		xResult = xSemaphoreTake(myMutex01Handle,portMAX_DELAY);	//获取互斥信号量 无限等待
		if(xResult == pdTRUE)
		{
			printf("Hight Running\r\n");
		}
		printf("Hight 释放互斥信号量\r\n");
		xResult = xSemaphoreGive(myMutex01Handle);
		osDelay(500);
	}
}
void vMid_Priority(void const * argument)
{
	for(;;)
	{
		printf("Mid Running\r\n");
		osDelay(500);
	}	
}
void vLow_Priority(void const * argument)
{
	BaseType_t xResult;
	
	for(;;)
	{
		printf("low 获取互斥信号量\r\n");
		xResult = xSemaphoreTake(myMutex01Handle,portMAX_DELAY);
		if(xResult == pdTRUE)
		{
			printf("low Running\r\n");
		}
		HAL_Delay(3000);	//延时3s 模拟低优先级长时间占用信号量
		printf("low 释放互斥信号量\r\n");
		//一旦释放互斥信号量则马上还原抬高的优先级回到默认优先级！！！
		xResult = xSemaphoreGive(myMutex01Handle);
		osDelay(500);
	}	
}
```

{% endfolding %}

{% note blue 'fas fa-fan' flat %}实验现象{% endnote %}

可以看到中优先级任务没有去抢占低优先级任务

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230411214930.webp)



### 递归互斥信号量

递归互斥信号量是一种特殊的互斥信号量， `支持拥有该信号量使用权的任务重复多次获取，而不会死锁`。任务成功获取几次递归互斥信号量，就要返还几次，在此之前，递归互斥信号量都处于无效状态。递归互斥信号量应用很少，简要了解即可。



## 第14讲

### 事件的概念与应用

事件是实现 `任务与任务` 或 `任务与中断` 间通信的机制，用于 `同步，无数据传输`。

与信号量不同的是，事件可以实现 `一对多、多对多` 的同步，即一个任务可以等待多个事件的发生:可以是任意一个事件发生时唤醒任务进行事件处理;也可以是几个事件都发生后才唤醒任务进行事件处理。同样，也可以是多个任务同步多个事件。

FreeRTOS提供的事件具有如下特点:

1. 事件相互独立，一个32位的事件集合( `EventBitst类型的变量，实际可用于表示事件的只有低24位` )用于标识该任务发生的事件类型,其中每一位表示一种事件类型( `0表示该事件类型未发生，1表示该事件类型已经发生` )，一共有24种事件类型

2. 事件仅用于同步，不提供数据传输功能

3. 事件无排队性，即多次向任务设置同一事件(如果任务还未来得及读取)，等效于只设置一次

4. 允许多个任务对同一事件进行读写操作

5. 支持事件等待超时机制

在FreeRTOS事件中，获取每个事件时，用户可以选择感兴趣的事件，并且选择读取事件信息标记。 `它有3个属性，分别是逻辑与逻辑或以及是否清除标记` 。当任务等待事件同步时，可以通过任务感兴趣的事件位和事件信息标记来判断当前接收的事件是否满足要求，如果满足，则说明任务等到对应的事件，系统将唤醒等待的任务;否则，任务会根据用户指定的阻塞超时时间继续等待下去

- FrecRTOS的事件用于任务与任务或任务与中断间的同步。为什么不直接用变量呢?那样岂不是更有效率?

若是在裸机编程中，用全局变量是最有效的方法，但是在操作系统中，使用全局变量就要考虑以下问题了:

1. 使用事件标志组可以让 RTOS 内核有效地管理任务，而全局变量是无法做到的，任务的超时等机制需要用户自己去实现
2. 使用了全局变量就要防止多任务的访问冲突，而使用事件标志组则处理好了这个问题，用户无需担心
3. 使用事件标志组可以有效地解决中断服务程序和任务之间的同步问题



### 事件的运作关系

```cpp
EventBits_t 通过跳转可以看到是：typedef TickType_t EventBits_t; 通过 TickType_t 跳转看到 typedef uint32_t TickType_t; 它是32位的
//它是32位的，但是只有低24位才用于事件标志，高8位用于事件组编号
//事件标志位低24位用于指定要等待和处理的具体事件，而事件组编号则用于将这些事件组织成一组    
```

{% note blue 'fas fa-fan' flat %}任务与任务{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230412084900.webp)

创建2个任务: Task1和Task2

1. 任务Task1运行过程中调用函数 `xEventGroupWaitBits`，等待事件标志位被设置，任务Task1由运行态进入到阻塞态
2. 任务Task2设置Task1等待的事件标志，任务Task1由阻塞态进入到就绪态，在调度器的作用下由就绪态又进入到运行态

{% note blue 'fas fa-fan' flat %}中断与任务{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230412085601.webp)

创建一个任务和一个串口接收中断

1. 任务Task1运行过程中调用函数 `×EventGroupWaitBits`，等待事件标志位被设置，任务Task1由运行态进入到阻塞态。
2. Task1阻塞的情况下，串口接收到数据进入到了串口中断服务程序，在串口中断服务程序中设置Task1等待的事件标志，任务Task1由阻塞态进入到就绪态，在调度器的作用下由就绪态又进入到运行态。

> 实际应用中，中断方式的消息机制要注意以下三个问题:
>
> 1. 中断函数的执行时间越短越好，防止其它低于这个中断优先级的异常不能得到及时响应。
> 2. 实际应用中，建议不要在中断中实现消息处理，用户可以在中断服务程序里面发送消息通知任务,在任务中实现消息处理，这样可以有效地保证中断服务程序的实时响应。同时此任务也需要设置为高优先级，以便退出中断函数后任务可以得到及时执行。
> 3. 中断服务程序中一定要调用专用于中断的事件标志设置函数，即以 `FromISR` 结尾的函数。
> 4. 如果 FreeRTOS 工程的中断函数中没有调用 FreeRTOS 的事件标志组 API 函数，与裸机编程是一样的；如果 FreeRTOS 工程的中断函数中调用了 FreeRTOS 的事件标志组的 API 函数，退出的时候要检测是否有高优先级任务就绪，如果有就绪的，需要在退出中断后进行任务切换



### 常用的API函数

使用事件的典型流程如下:

1. 创建事件组
2. 置位事件组
3. 等待事件组
4. 删除事件组

{% note blue 'fas fa-fan' flat %}事件组的创建与删除{% endnote %}

> 任务控制块(句柄)
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230412090947.webp)

```cpp
//创建事件组 函数原型
//返回值：创建成功返回事件标志组句柄，如果FreeRTOSConfig.h文件定义的heap空间不足会返回NULL
EventGroupHandle_t xEventGroupCreate( void )
```

```cpp
//删除事件组 函数原型
//参数：事件组句柄
void vEventGroupDelete( EventGroupHandle_t xEventGroup )
```

{% note blue 'fas fa-fan' flat %}事件组的置位{% endnote %}

将指定的事件设置为1

```cpp
//任务中置位事件组 函数原型
//参数1：事件标志组句柄
//参数2：表示24个可设置的事件标志位，EventBits_t 是定义的32位变量，低24位用于事件标志设置。变量uxBitsToSet的低24位的某个位设置为1，那么被设置的事件标志组的相应位就设置为1。变量uxBitsToSet设置为0的位对事件标志相应位没有影响。比如设置变量uxBitsToSet = 0x0003就表示将事件标志的位0和位1设置为1，其余位没有变化。
//返回值：返回当前的事件标志组数值
EventBits_t xEventGroupSetBits( EventGroupHandle_t xEventGroup, const EventBits_t uxBitsToSet )
```

使用这个函数要注意以下问题:

1. 使用前一定要保证事件标志组已经通过函数 `xEventGroupCreate` 创建了
2. 此函数是用于任务代码中调用的，故不可以在中断服务程序中调用此函数，中断服务程序中使用的是 `xEventGroupSetBitsFromISR` 
3. 用户通过参数 `uxBitsToSet` 设置的标志位并不一定会保留到此函数的返回值中，下面举两种情况:
   a. 调用此函数的过程中，其它高优先级的任务就绪了，并且也修改了事件标志，此函数返回的事件标志位会发生变化
   b. 调用此函数的任务是一个低优先级任务，通过此函数设置了事件标志后，让一个等待此事件标志的高优先级任务就绪了，会立即切换到高优先级任务去执行，相应的事件标志位会被函数 `xEventGroupWaitBits` 清除掉，等从高优先级任务返回到低优先级任务后，函数 `xEventGroupSetBits` 的返回值已经被修改

```cpp
//中断中置位事件组 函数原型
//参数1：事件标志组句柄
//参数2：表示24个可设置的事件标志位，EventBits_t 是定义的32位变量，低24位用于事件标志设置。变量uxBitsToSet的低24位的某个位设置为1，那么被设置的事件标志组的相应位就设置为1。变量uxBitsToSet设置为0的位对事件标志相应位没有影响。比如设置变量uxBitsToSet = 0x0003就表示将事件标志的位0和位1设置为1，其余位没有变化。
//参数3：用于保存是否有高优先级任务准备就绪。如果函数执行完毕后，此参数的数值是pdTRUE,说明有高优先级任务要执行，否则没有
//返回值：如果消息成功发送给守护任务(就是FreeRTOS 的定时器服务任务）返回pdPASS，否则返回pdFAIL，另外守护任务中的消息队列满了也会返回pdFAIL
BaseType_t xEventGroupSetBitsFromISR( EventGroupHandle_t xEventGroup, const EventBits_t uxBitsToSet, BaseType_t *pxHigherPriorityTaskWoken )
```

使用这个函数要注意以下问题：

1. 使用前一定要保证事件标志已经通过函数 `xEventGroupCreate` 创建了。同时要在 FreeRTOSConfig.h 文件中使能如下三个宏定义：

```cpp
#define INCLUDE_xEventGroupSetBitFromISR 1
#define configUSE_TIMERS 1
#define INCLUDE_xTimerPendFunctionCall 1
```

2. 函数 `xEventGroupSetBitsFromISR` 是用于中断服务程序中调用的，故不可以在任务代码中调用此函数，任务代码中使用的是  `xEventGroupSetBits`
3. 函数 `xEventGroupSetBitsFromISR` 对事件标志组的操作是不确定性操作，因为不知道当前有多少个任务在等待此事件标志。而 FreeRTOS 不允许在中断服务程序和临界段中执行不确定性操作。 为了不在中断服务程序中执行，就通过此函数给 FreeRTOS 的 daemon 任务（就是 FreeRTOS 的定时器任务）发送消息，在 daemon 任务中执行事件标志的置位操作。 同时也为了不在临界段中执行此不确定操作，将临界段改成由调度锁来完成。这样不确定性操作在中断服务程序和临界段中执行的问题就都得到解决了。
4. 由于函数 `xEventGroupSetBitsFromISR` 对事件标志的置位操作是在 daemon 任务里面执行的， `如果想让置位操作立即生效，即让等此事件标志的任务能够得到及时执行，需要设置 daemon 任务的优先级高于使用此事件标志组的所有其它任务`。



{% note blue 'fas fa-fan' flat %}等待事件组{% endnote %}

```cpp
//等待事件组 函数原型
//参数1：事件组句柄
//参数2：表示等待24个事件标志位中的指定标志，EventBits_t 是定义的32位变量，低24位用于事件标志设置。比如设置变量uxBitsToWaitFor = Ox0003就表示等待事件标志的位О和位1设置为1。此参数切不可设置为0 
//参数3：第3个参数选择是否清除已经被置位的事件标志，如果这个参数设置为pdTRUE，且函数 xEventGroupWaitBits 在参数 xTicksToWait设置的溢出时间内返回或等到满足任务唤醒的事件时，相应被设置的事件标志位会被清零。如果这个参数设置为pdFALSE，对已经被设置的事件标志位没有影响。
//参数4：选择是否等待所有的标志位都被设置，如果这个参数设置为pdTRUE，要等待第2个参数uxBitsToWaitFor所指定的标志位全部被置1，函数才可以返回。当然，超出了在参数xTicksToWait 设置的溢出时间也是会返回的。如果这个参数设置为pdFALSE，第2个参数uxBitsToWaitFor所指定的任何标志位被置1，函数都会返回，超出溢出时间也会返回
//参数5：设置等待时间，单位时钟节拍周期。如果设置为portMAX_DELAY，表示永久等待。
//返回值：由于设置的时间超时或者指定的事件标志位被置1，导致函数退出时返回的事件标志组数值。
EventBits_t xEventGroupWaitBits( EventGroupHandle_t xEventGroup, const EventBits_t uxBitsToWaitFor, const BaseType_t xClearOnExit, const BaseType_t xWaitForAllBits, TickType_t xTicksToWait )
```

使用这个函数要注意以下问题:

1. 此函数切不可在中断服务程序中调用。
2. 着重说明下这个函数的返回值，通过返回值用户可以检测是哪个事件标志位被置1了，如果由于设置的等待时间超时，函数的返回值可会有部分事件标志位被置1。如果由于指定的事件标志位被置1而返回，并且设置了这个函数的参数 `xClearOnExit` 为pdTRUE 那么此函数的返回值是清零前的事件标志组数值。
3. 另外，调用此函数的任务在离开阻塞状态到退出函数 `xEventGroupWaitBits` 之间这段时间，如果一个高优先级的任务抢占执行了，并且修改了事件标志位，那么此函数的返回值会跟当前的事件标志组数值不同。



### 任务与任务

{% note blue 'fas fa-fan' flat %}MX配置{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230412113623.webp)

事件组只能在代码里创建，MX里不能创建

{% note blue 'fas fa-fan' flat %}程序编写{% endnote %}

{% folding, app_freertos.c %}

```cpp
EventGroupHandle_t myEvent01Handle = NULL;	//定义事件组

void MX_FREERTOS_Init(void)
{
    myEvent01Handle = xEventGroupCreate();
    if(NULL == myEvent01Handle)
    {
        printf("创建事件组失败\r\n");
    }
    else
    {
        printf("创建事件组成功\r\n");
    }
    ...
}
```

{% endfolding %}

{% folding, KEY.h %}

```cpp
#define KEY2_EVENT (EventBits_t)(0x0001 << 0)	//设置事件组掩码位0
#define KEY3_EVENT (EventBits_t)(0x0001 << 1)	//设置事件组掩码位1
#define KEY4_EVENT (EventBits_t)(0x0001 << 2)	//设置事件组掩码位2
```

{% endfolding %}

{% folding, KEY.c %}

```cpp
if(KEY.Key_Down_Buff[1])
{
    KEY.Key_Down_Buff[1] = 0;
    xEventGroupSetBits(myEvent01Handle, KEY2_EVENT);	//按键2事件置1
}
if(KEY.Key_Down_Buff[2])
{
    KEY.Key_Down_Buff[2] = 0;
    xEventGroupSetBits(myEvent01Handle, KEY3_EVENT);	//按键3事件置1
}
if(KEY.Key_Down_Buff[3])
{
    KEY.Key_Down_Buff[3] = 0;
    xEventGroupSetBits(myEvent01Handle, KEY4_EVENT);	//按键4事件置1
}
```

{% endfolding %}

{% folding, AllTask.c %}

```cpp
extern osThreadId vevent_functionHandle;
extern EventGroupHandle_t myEvent01Handle;
//#define Event_WaitAllBits	//预编译(是否等待所有标志位)

void vEvent_function(void const * argument)
{
	EventBits_t xEvent;	//接收
	uint16_t count = 0;	//同步计数

	#ifdef Event_WaitAllBits
	for(;;)
	{
		printf("等待事件同步信号，无限等待\r\n");
		xEvent = xEventGroupWaitBits(
										myEvent01Handle,	//事件句柄
										KEY2_EVENT|KEY3_EVENT|KEY4_EVENT,	//事件：按键2,3,4
										pdTRUE,	//退出时清除标志位
										pdTRUE,	//逻辑与--满足所有事件
										portMAX_DELAY	//无限等待
									);
		if((xEvent&(KEY2_EVENT|KEY3_EVENT|KEY4_EVENT)) == (KEY2_EVENT|KEY3_EVENT|KEY4_EVENT))
		{
			printf("成功接收到同步信号，次数%u\r\n",++count);
			LED.Led_State ^= 2;
			LED.vLed_write_all(LED.Led_State);
		}
	}
	#else
	for(;;)
	{
		printf("等待事件同步信号，无限等待\r\n");
		xEvent = xEventGroupWaitBits(
										myEvent01Handle,	//事件句柄
										KEY2_EVENT|KEY3_EVENT|KEY4_EVENT,	//事件：按键2,3,4
										pdTRUE,	//退出时清除标志位
										pdFALSE,	//逻辑或--满足其中一个事件
										portMAX_DELAY	//无限等待
									);
		if(((xEvent&KEY2_EVENT) == KEY2_EVENT) || ((xEvent&KEY3_EVENT) == KEY3_EVENT) || ((xEvent&KEY4_EVENT) == KEY4_EVENT))
		{
			printf("成功接收到同步信号，次数%u\r\n",++count);
			LED.Led_State ^= 2;
			LED.vLed_write_all(LED.Led_State);			
		}
	}
	#endif
}
```

{% endfolding %}

{% note blue 'fas fa-fan' flat %}实验现象{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230412125831.webp)



### 中断与任务

{% note blue 'fas fa-fan' flat %}MX配置{% endnote %}

中断则需要使能软件定时器

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230412133455.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230412134901.webp)

{% note blue 'fas fa-fan' flat %}程序编写{% endnote %}

{% folding, my_usart1.h %}

```cpp
#define RX_MAX_LEN 12
#define UART1_ReceEVENT (EventBits_t)(0x0001 << 3)	//设置事件掩码位3

extern uint8_t ucUSART1_RX_BUFF[RX_MAX_LEN];
extern uint8_t ucRx_Len;
extern bool Rx_Over_Flag;
```

{% endfolding %}

{% folding, my_usart1.c %}

```cpp
uint8_t ucUSART1_RX_BUFF[RX_MAX_LEN] = {0};
uint8_t ucRx_Len = 0;
bool Rx_Over_Flag = 0;

extern EventGroupHandle_t myEvent01Handle;

void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart)
{
	BaseType_t xHigherPriorityTaskWoken = pdFALSE;
	
	if(&huart1 == huart)
	{
		//触发串口接收事件
		xEventGroupSetBitsFromISR(myEvent01Handle,UART1_ReceEVENT,&xHigherPriorityTaskWoken);
		//如果有高优先级任务则进行一次切换
		portYIELD_FROM_ISR(xHigherPriorityTaskWoken);
	}
}
```

{% endfolding %}

{% folding, AllTask.c %}

```cpp
extern EventGroupHandle_t myEvent01Handle;
extern osThreadId vevent_functionHandle;

void vEvent_function(void const * argument)
{
	EventBits_t xEvent;	//接收

	for(;;)
	{
		printf("等待串口发送12个字符\r\n");
		HAL_UART_Receive_IT(&huart1,(uint8_t*)ucUSART1_RX_BUFF,12);
		printf("等待事件同步信号，无限等待\r\n");

		xEvent = xEventGroupWaitBits(
										myEvent01Handle,	//事件句柄
										UART1_ReceEVENT,	//事件：串口1接收
										pdTRUE,	//退出时清除标志位
										pdTRUE,	//逻辑与--满足所有事件
										portMAX_DELAY	//无限等待
									);
        //这个判断也可以不要，因为它是在上面无限等待所以等到了才执行下面
		if((xEvent&UART1_ReceEVENT) == UART1_ReceEVENT)
		{
			printf("接收到串口数据：%s\r\n",ucUSART1_RX_BUFF);
			LED.Led_State ^= 2;
			LED.vLed_write_all(LED.Led_State);
		}
	}
}
```

{% endfolding %}

{% note blue 'fas fa-fan' flat %}实验现象{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230412143004.webp)



## 第15讲

### 软件定时器的概念与应用

FreeRTOS软件定时器的时基是 `基于系统时钟节拍` 实现的，之所以叫软件定时器 `是因为它的实现不需要额外使用硬件定时器，而且可以创建很多个`，综合这些因素，这个功能就被称之为软件定时器组。既然是定时器，那么它实现的功能与硬件定时器也是类似的。在硬件定时器中，我们是在定时器中断中实现需要的功能，而使用软件定时器时，我们是在创建软件定时器时指定软件定时器的回调函数，在回调函数中实现相应的功能。

> 定时器可以说是每个MCU都有的外设,有的MCU其定时器功能异常强大,比如提供PWM、输入捕获等功能。但是最常用的还是定时器最基础的功能一一定时，通过定时器来完成需要周期性处理的事务。MCU自带的定时器属于硬件定时器，不同的MCU其硬件定时器数量不同，因为要考虑成本的问题。FreeRTOS也提供了定时器功能，不过是软件定时器，软件定时器的精度肯定没有硬件定时器那么高，但是对于普通的精度要求不高的周期性处理的任务来说够了。

FreeRTOS提供的软件定时器支持如下功能(软件定时器的使用相当于扩展了定时器的数量，允许创建更多的定时任务):

1. 裁剪，可通过宏关闭软件定时器功能
2. 软件定时器创建
3. 软件定时器启动
4. 软件定时器停止
5. 软件定时器复位
6. 软件定时器删除
   

>  `单次模式与周期模式`
> FreeRTOS提供的软件定时器支持单次模式和周期性模式，单次模式就是用户创建了定时器并启动了定时器后，定时时间到将不再重新执行，这就是单次模式软件定时器的含义。周期模式就是此定时器会按照设置的时间周期重复去执行，这就是周期模式软件定时器的含义。另外就是单次模式或者周期模式的定时时间到后会调用定时器的回调函数，用户可以回调函数中加入需要执行的工程代码。

>  `定时器守护任务`
> FreeRTOS通过一个 `prvTimerTask` 任务(也叫作 `守护任务(Daemon)` )管理软件定时器，它是在启动调度器时自动创建的，以满足用户定时需求。pryTimerTask任务会在其执行期间检查用户启动的时间周期溢出的定时器，并调用其回调函数。只有设置FreeRTOSConfig.h中的宏定义 `configUSE_TIMERS` 为1，将相关代码编译进来，才能正常使用软件定时器相关功能。

FreeRTOS定时器组的大部分API函数都是通过消息队列给定时器任务发消息，在定时器任务里面执行实际的操作。为了更好的说明这个问题，将官方在线版手册中的这个截图贴出来进行说明:

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230412175949.webp)

左侧图是用户应用程序，右侧是定时器任务。在用户应用程序里面调用了定时器组API函数 `xTimerReset`，这个函数会通过消息队列给定时器任务发消息，在定时器任务里面执行实际操作。消息队列在此处的作用有一个专门的名字: `Timer command queue`，即专门发送定时器组命令的队列。

> 应用场景
> 在很多应用中，我们需要用到一些定时器任务，硬件定时器受硬件的限制，数量上不足以满足用户的实际需求，无法提供更多的定时器，那么可以采用软件定时器来完成，由软件定时器任务代替硬件定时器任务。但需要注意的是，软件定时器的精度是无法和硬件定时器相比的，因为在软件定时器的定时过程中极有可能被其他中断所打断，这是由于软件定时器的执行上下文环境是任务( `prvTimerTask任务` )。所以，软件定时器更适用于对时间精度要求不高的任务，或一些辅助型的任务。

> 软件定时器的精度
> 在操作系统中，通常软件定时器以系统节拍周期为计时单位。系统节拍是系统的心跳节拍，表示系统时钟的频率，类似人的心跳1s 能跳动多少下。系统节拍配置为 `configTICK_RATE HZ`，该宏在 FreeRTOSConfig.h 中有定义，默认是1000。那么系统的时钟节拍周期就为 `1ms` (1s跳动1000下，每一下时长就为1ms)。软件定时器的所定时数值必须是这个节拍周期的整数倍，例如节拍周期是10ms，那么上层软件定时器定时数值只能是10ms、20ms、100ms等，而不能取值为15ms。由于节拍定义了系统中定时器能够分辨的精确度，系统可以根据实际CPU的处理能力和实时性需求设置合适的数值， `系统节拍周期的值越小，精度越高，但是系统开销也将越大`，因为这代表在1s中系统进入时钟中断的次数也就越多。

> 回调函数
> 在 `prvTimerTask` 任务中检测软件定时器，一旦定时时间到，将执行 `回调函数` (被作为参数传递的函数，间接调用)，以完成任务

> prvTimerTask 任务的优先级设置高些以便及时处理软件定时器的相关指令;即设置 `TIMER_TASK_PRIORITY` ，但是范围是不能超过 `MAX_PRIORITES`

>  `定时器回调函数是在定时器任务中执行的，实际应用中不可在定时器回调函数中调用任何将定时器任务挂起的函数，比如vTaskDelay(), vTaskDelayUntil()以及非零延迟的消息队列和信号量相关的函数。将定时器任务挂起，会导致定时器任务负责的相关功能都不能正确执行了。`



### 常用的API函数

使用软件定时器的典型流程如下:

1. 创建软件定时器
2. 启动软件定时器
3. 停止软件定时器
4. 删除软件定时器
5. 获取软件定时器ID

 ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230413082505.webp)

结构体成员变量说明:

1. 软件定时器的名字，一般用于调试，因为控制定时器是通过句柄
2. 软件定时器的列表项，用于插入定时器链表
3. 软件定时器的周期，单位为 `系统节拍(tick)`，表示定时器每隔多少个tick会触发一次，从而执行对应的回调函数
4. 软件定时器的数字ID，典型用法是多个定时器共用一个回调函数时，通过 `ID` 辨别
5. 软件定时器的回调函数，当定时时间到就会调用这个函数，可以是任何类型的函数，但需要满足特定的函数原型要求
6. 如果系统支持跟踪功能，xTIMER结构体可以用于在FreeRTOS+Trace中跟踪定时器。`uxTimerNumber`是一个给定的数字，可以用于标识跟踪数据
7. 定时器的状态位，用于记录定时器是否被静态分配、是否激活等信息。包括以下位定义：
   - Bit 0: 定时器是否处于已经激活状态。
   - Bit 1: 定时器是否为静态分配，即是否在定义时已经确定了使用哪个变量或内存地址来存储定时器控制块。



{% note blue 'fas fa-fan' flat %}创建软件定时器{% endnote %}

```cpp
//创建软件定时器 函数原型
//参数1：定时器名字
//参数2：定时器周期，单位系统时钟节拍
//参数3：选择单次模式或者周期模式------pdFALSE->单次模式; pdTRUE->周期模式
//参数4：定时器ID
//参数5：定时器回调函数
//返回值：创建成功返回定时器的句柄，由于FreeRTOSCongfig.h 文件中 heap空间不足，或者定时器周期设置为0，会返回NULL
TimerHandle_t xTimerCreate(	const char *const pcTimerName,
                            const TickType_t xTimerPeriodInTicks,
                            const UBaseType_t uxAutoReload,
                            void *const pvTimerID,
                            TimerCallbackFunction_t pxCallbackFunction )
```

使用这个函数要注意以下问题:

1. 在 FreeRTOSConfig.h 文件中使能宏定义

```cpp
#define configUSE_TIMERS 1
```

这个回调函数格式可以点击创建函数进行跳转查看

```cpp
TimerCallbackFunction_t pxCallbackFunction
↓    
typedef void (*TimerCallbackFunction_t)( TimerHandle_t xTimer );    
```





{% note blue 'fas fa-fan' flat %}删除软件定时器{% endnote %}

```cpp
//函数原型
//参数1：定时器句柄
//参数2：定时器队列消息发送超时间，定时器组的大部分API函数不是直接运行的，而是通过消息队列给定时器任务发消息来实现的，此参数设置的等待时间就是当消息队列已经满的情况下，等待消息队列有空间时的最大等待时间。
//返回值：返回pdFAIL表示此函数向消息队列发送消息失败，返回pdPASS表示此函数向消息队列发送消息成功。定时器任务实际执行消息队列发来的命令依赖于定时器任务的优先级，如果定时器任务是高优先级会及时得到执行，如果是低优先级，就要等待其余高优先级任务释放CPU权才可以得到执行。
BaseType_t xTimerDelete(TimerHandle_t xTimer,const TickType_t xTicksToWait )
```

{% note blue 'fas fa-fan' flat %}启动软件定时器{% endnote %}

```cpp
//函数原型
//参数1：定时器句柄
//参数2：定时器队列消息发送超时间，定时器组的大部分API函数不是直接运行的，而是通过消息队列给定时器任务发消息来实现的，此参数设置的等待时间就是当消息队列已经满的情况下，等待消息队列有空间时的最大等待时间。
//返回值：返回pdFAIL表示此函数向消息队列发送消息失败，返回pdPASS表示此函数向消息队列发送消息成功。定时器任务实际执行消息队列发来的命令依赖于定时器任务的优先级，如果定时器任务是高优先级会及时得到执行，如果是低优先级，就要等待其余高优先级任务释放CPU权才可以得到执行。
BaseType_t xTimerStart(TimerHandle_t xTimer,const TickType_t xTicksToWait )
```

使用这个函数要注意以下问题:

1. 使用前一定要保证定时器组已经通过函数 `xTimerCreate` 创建了
2. 对于已经被激活的定时器，即调用过函数 `xTimerStart` 进行启动，再次调用此函数相当于调用了函数 `xTimerReset` 对定时器时间进行了复位
3. 如果在启动FreeRTOS调度器前调用了此函数，定时器是不会立即执行的，需要等到启动了FreeRTOS调度器才会得到执行，即从此刻开始计时，达到 `xTimerCreate` 中设置的单次或者周期性延迟时间才会执行相应的回调函数

- 疑问？

那我们没有创建队列那它是怎么进行插入初始化的，可以点击 Start函数进行跳转看看(嗯...没看到有那看另一个函数)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230413094847.webp)

点击create函数跳转看看，可以发现是在create函数里面创建的定时器队列

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230413095106.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230413095146.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230413095202.webp)

{% endgallery %}



{% note blue 'fas fa-fan' flat %}停止软件定时器{% endnote %}

```cpp
//函数原型
//参数1：定时器句柄
//参数2：定时器队列消息发送超时间，定时器组的大部分API函数不是直接运行的，而是通过消息队列给定时器任务发消息来实现的，此参数设置的等待时间就是当消息队列已经满的情况下，等待消息队列有空间时的最大等待时间。
//返回值：返回pdFAIL表示此函数向消息队列发送消息失败，返回pdPASS表示此函数向消息队列发送消息成功。定时器任务实际执行消息队列发来的命令依赖于定时器任务的优先级，如果定时器任务是高优先级会及时得到执行，如果是低优先级，就要等待其余高优先级任务释放CPU权才可以得到执行。
BaseType_t xTimerStop(TimerHandle_t xTimer,const TickType_t xTicksToWait )
```



{% note blue 'fas fa-fan' flat %}获取软件定时器ID{% endnote %}

```cpp
//函数原型
//参数：是定时器句柄
//返回值：返回定时器ID
void *pvTimerGetTimerID(const TimerHandle_t xTimer)
```

使用这个函数要注意以下问题:

1. 使用前一定要保证定时器组已经通过函数 `xTimerCreate` 创建了
2. 创建不同的定时器时，可以对定时器使用相同的回调函数，在回调函数中通过此函数获取是哪个定时器的时间到了，这个功能就是此函数的主要作用



### 应用编程

也可以在MX里进行软件定时器的配置：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230414085736.webp)

```cpp
//默认生成的代码
osTimerDef(MyTimer01, vMyTimerCallback);
MyTimer01Handle = osTimerCreate(osTimer(MyTimer01), osTimerPeriodic, (void*) 1);
```

但是它不能在MX里面进行时间的设置，所以点击 `osTimerCreate` 看看源码：

可以发现它默认全部都是1，而且注释也说明了当你使用 `osTimerStart` 启动定时器时应填写这个覆盖

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230414092857.webp)

即在创建软件定时器函数下面添加(具体多少ms看需要)：

```cpp
  if(MyTimer01Handle != NULL)
  {
	  printf("软件定时器1创建成功\r\n");
	  printf("软件定时器1的周期调整为1000ms\r\n");
	  
	  xTimerChangePeriod(MyTimer01Handle,1000,0);	//修改周期为1000ms
	  if(pdPASS == xTimerStart(MyTimer01Handle,0))	//启动
	  {
		  printf("启动软件定时器1成功\r\n");
	  }
  }
```



{% note blue 'fas fa-fan' flat %}MX配置{% endnote %}

 `TIMER_TASK_STACK_DEPTH` 是设置的堆栈大小，可以设置小点可以通过打印查看消耗多少


![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230413090946.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230412134901.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230413091458.webp)



{% note blue 'fas fa-fan' flat %}程序编写{% endnote %}

>  `Timer_ID = *((uint8_t*)pvTimerGetTimerID(pxTimer));` 这个代码的执行解释：
>
> 1. `pxTimer`是指向`TimerHandle_t`类型的指针，它指向当前正在处理的定时器
> 2. `pvTimerGetTimerID()`函数用于获取与定时器关联的应用程序定义的ID值，需要传递一个`TimerHandle_t`类型的参数
> 3. `*((uint8_t*)pvTimerGetTimerID())`将返回的ID值强制转换为一个`uint8_t`类型的指针，并解引用该指针来获取ID值
> 4. 最后，将ID值存储在`Timer_ID`变量中

> configASSERT(pxTimer);
>
> 这个相当于 `断言机制`，判断这个参数是否为NULL,如果 `pxTimer` 为 NULL，则会抛出一个 ASSERT 异常，并停止后续代码的执行

{% folding, app_freertos.c %}

```cpp
//定义定时器ID
uint8_t Timer01_ID = 1;
uint8_t Timer02_ID = 2;
//定义软件定时器
TimerHandle_t myTimer01Handle = NULL;
TimerHandle_t myTimer02Handle = NULL;


void MX_FREERTOS_Init(void)
{
    /* USER CODE BEGIN Init */
    myTimer01Handle = xTimerCreate(
                          "Timer01",	//名字
                          100,	//定时周期
                          pdTRUE,	//周期模式
                          (void *)&Timer01_ID,	//ID
                          (TimerCallbackFunction_t)vMyTimerCallback	//中断回调函数
                      );
    if(myTimer01Handle != NULL)
    {
        printf("创建软件定时器1成功\r\n");

        if(pdPASS == xTimerStart(myTimer01Handle, 0))
        {
            printf("启动软件定时器1cg\r\n");
        }
    }
    myTimer02Handle = xTimerCreate(
                          "Timer02",
                          500,	//500ms
                          pdTRUE,	//周期模式
                          (void *)&Timer02_ID,	//ID
                          (TimerCallbackFunction_t)vMyTimerCallback	//中断回调函数
                      );
    if(myTimer02Handle != NULL)
    {
        printf("创建软件定时器2成功\r\n");

        if(pdPASS == xTimerStart(myTimer02Handle, 0))
        {
            printf("启动软件定时器2cg\r\n");
        }
    }
}
```

{% endfolding %}

{% folding, AllTask.c %}

```cpp
extern uint8_t Timer01_ID;
extern uint8_t Timer02_ID;
extern TimerHandle_t myTimer01Handle;
extern TimerHandle_t myTimer02Handle;

//按键任务
void vKey_TaskFunction(void const* argument)
{
	for(;;)
	{
		KEY.vKey_scan_function();
		KEY.vKey_run_flag_function();
		osDelay(20);
	}
}

//LED任务
void vLED1_TaskFunction(void const * argument)
{
	for(;;)
	{
		LED.Led_State ^= 1;
		LED.vLed_write_all(LED.Led_State);
		osDelay(1000);
	}
}

//软件定时器回调函数
void vMyTimerCallback(xTimerHandle pxTimer)
{
	uint8_t Timer_ID = 0;	//软件定时器ID
	static uint16_t Timer01CallbackCnt = 0;	//计数
	static uint16_t Timer02CallbackCnt = 0;
	
	//形参校验(相当于断言机制)
	configASSERT(pxTimer);
	//获取软件定时器ID
	Timer_ID = *((uint8_t*)pvTimerGetTimerID(pxTimer));
	//执行软件定时器1任务
	if(Timer01_ID == Timer_ID)
	{
		LED.Led_State ^= 2;
		LED.vLed_write_all(LED.Led_State);
		printf("软件定时器1回调函数次数=%u\r\n",++Timer01CallbackCnt);
	}
	//执行软件定时器2任务
	if(Timer02_ID == Timer_ID)
	{
		LED.Led_State ^= 4;
		LED.vLed_write_all(LED.Led_State);
		printf("软件定时器2回调函数次数=%u\r\n",++Timer02CallbackCnt);
	}
}
```

{% endfolding %}

{% folding, KEY.c %}

```cpp
extern TimerHandle_t myTimer01Handle;
extern TimerHandle_t myTimer02Handle;

	if(KEY.Key_Down_Buff[1])	
	{
		KEY.Key_Down_Buff[1] = 0;
		//关闭软件定时器2		
		if(pdPASS == xTimerStop(myTimer01Handle,100))
		{
			printf("关闭软件定时器1成功\r\n");
		}
		else
		{
			printf("关闭软件定时器1失败\r\n");
		}
		//关闭软件定时器2
		if(pdPASS == xTimerStop(myTimer02Handle,100))
		{
			printf("关闭软件定时器2成功\r\n");
		}
		else
		{
			printf("关闭软件定时器2失败\r\n");
		}		
	}
	if(KEY.Key_Down_Buff[2])	//重新打开软件定时器1
	{
		KEY.Key_Down_Buff[2] = 0;
		if(pdPASS == xTimerStart(myTimer01Handle,100))
		{
			printf("重新打开软件定时器1成功\r\n");
		}
		else
		{
			printf("重新打开软件定时器1失败\r\n");
		}
	}
	if(KEY.Key_Down_Buff[3])	//重新打开软件定时器2
	{
		KEY.Key_Down_Buff[3] = 0;
		if(pdPASS == xTimerStart(myTimer02Handle,100))
		{
			printf("重新打开软件定时器2成功\r\n");
		}
		else
		{
			printf("重新打开软件定时器2失败\r\n");
		}		
	}	
```

{% endfolding %}



{% note blue 'fas fa-fan' flat %}实验现象{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230413105523.webp)

## 第16讲

### 任务通知的概念

FreeRTOS 从v8.2.0 版本开始提供任务通知功能， `每个任务都有一个32位的通知值`，在多数情况下，任务通知 `可以替代二值信号量、计数信号量、事件组，也可以替代长度为1的队列`(可以保存一个32位整数或指针值)。

> 相对于以前使用FreeRTOS内核通信的资源时必须创建队列、二进制信号量、计数信号量或事件组的情况，使用任务通知显然更灵活。按照FreeRTOS官方的说法， `使用任务通知比通过信号量等ICP通信方式解除阻塞的任务速度快45%，并且更加省RAM内存空间`，任务通知的使用无需创建队列。要想使用任务通知，必须将FreeRTOSConfig.h中的宏定义 `configUSE_TASK_NOTIFICATIONS` 设置为1。 `其实FreeRTOS默认是为1的，所以任务通知是默认可用的`。

FreeRTOS提供以下几种方式发送通知给任务:
1. 发送通知给任务，如果有通知未读，则不覆盖通知值
2. 发送通知给任务，直接覆盖通知值
3. 发送通知给任务，设置通知值的一个或者多个位，可以当作事件组来使用
4. 发送通知给任务，递增通知值，可以当作信号量使用



但是这种方式也有缺点：

1. 只能有一个任务接收通知消息，因为必须指定接收通知的任务
2. 只有等待通知的任务可以被阻塞，发送通知的任务在任何情况下都不会因为发送失败而进入阻塞态。



### 任务通知的运行机制

任务通知属于任务附带的资源，所以在任务被创建时，任务通知也被初始化，我们知道在使用队列、信号量前，必须先创建队列和信号量，目的是创建队列数据结构，比如使用 `xQueueCreate()` 函数创建队列，用 `xSemaphoreCreateBinary()` 函数创建二值信号量等。再来看任务通知，由于任务通知的数据结构包含在任务控制块中，只要任务存在，任务通知数据结构就已经创建完毕，可以直接使用，所以使用时很方便

任务通知 `可以在任务中向指定任务发送通知`， `也可以在中断中向指定任务发送通知`。FreeRTOS的每个任务都有一个 `32位的通知值`，任务控制块中的成员变量 `ulNotifiedValue` 就是这个通知值。 `只有在任务中可以等待通知，而不允许在中断中等待通知`。如果任务在等待的通知暂时无效，任务会根据用户指定的阻塞超时时间进入阻塞状态， 我们可以将等待通知的任务看作消费者；其他任务和中断可以向等待通知的任务发送通知，发送通知的任务和中断服务函数可以看作生产者，当其他任务或者中断向这个任务发送任务通知，且任务获得通知以后，该任务就会从阻塞态中解除，这与FreeRTOS中内核的其他通信机制一致。

### 常用的API函数

{% note blue 'fas fa-fan' flat %}任务通知的数据结构{% endnote %}

任务通知是任务控制块的资源，属于任务控制块中的成员变量，如下：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230413113339.webp)

`ulNotifiedValue`: 任务通知值，用于保存一个32位整数或指针值

`ucNotifyState`: 任务通知状态，用于标识任务的通知状态

状态取值：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230413113612.webp)

> `taskNOT_WAITING_NOTIFICATION`：任务当前状态为未等待通知。这个状态表示当前任务没有在等待通知，或者上次等待通知已经结束
>
> `taskWAITING_NOTIFICATION`：任务当前状态为等待通知。这个状态表示当前任务正在等待通知，即任务已经通过调用 ulTaskNotifyTake() 函数来阻塞自己，等待接收通知
>
> `taskNOTIFICATION_RECEIVED`：任务当前状态为已接收通知。这个状态表示当前任务已经接收到通知，即任务已经通过调用 ulTaskNotifyTake() 函数被唤醒，可以继续执行自己的任务了。如果进行了多项通知，则该状态表示接收到任意一项通知。



{% note blue 'fas fa-fan' flat %}常用API函数{% endnote %}

> `替代二值信号量与计数信号量`
>
> 发送任务通知:
> xTaskNotifyGive()
> vTaskNotifyGiveFromISR()
>
> 获取任务通知:
> ulTaskNotifyTake()

> `替代长为1的队列与事件组`
>
> 发送任务通知:
> xTaskNotify()
> vTaskNotifyFromISR()
>
> 获取任务通知:
> ulTaskNotifyWait()



{% note blue 'fas fa-fan' flat %}任务中发送通知{% endnote %}

`功能`：在任务中向指定任务发送通知，使任务通知值加1，这种方式用于信号量

```cpp
//函数原型
//参数1：任务句柄
//参数2：任务通知值，取0
//参数3：指示任务控制块中的变量ulNotifiedValue 实现加一操作
//参数4：空
//返回值：没有超时机制，永远返回pdPASS
BaseType_t xTaskNotifyGive(TaskHandle_t xTaskToNotify, uint32_t ulValue, eNotifyAction eAction, uint32_t *pulPreviousNotificationValue)
↓    
#define xTaskNotifyGive( xTaskToNotify ) xTaskGenericNotify( ( xTaskToNotify ), ( 0 ), eIncrement, NULL )
```

参数3可参考：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230413125310.webp)

{% note blue 'fas fa-fan' flat %}任务中获取通知{% endnote %}

`功能`：在任务中获取通知，与 xTaskNotifyGive() 配套使用，用于替代二值信号量与计数信号量

```cpp
//函数原型
//参数1：退出时是否清0计数，pdTRUE-->清0，pdFALSE-->减1
//参数2：超时时间，单位为系统节拍
//返回值：返回任务之前的任务通知值
uint32_t ulTaskNotifyTake( BaseType_t xClearCountOnExit, TickType_t xTicksToWait )
```

源码分析：

```cpp
uint32_t ulTaskNotifyTake( BaseType_t xClearCountOnExit, TickType_t xTicksToWait )
{
    uint32_t ulReturn;
//进入临界区保护当前任务，以避免并发问题
    taskENTER_CRITICAL();	
    {
//        如果当前任务没有接收到通知，则将任务状态设置为 taskWAITING_NOTIFICATION，表示当前任务正在等待通知
        if( pxCurrentTCB->ulNotifiedValue == 0UL )
        {
            pxCurrentTCB->ucNotifyState = taskWAITING_NOTIFICATION;
//如果 xTicksToWait 的值大于 0，则将当前任务加入延迟列表中，并调用 portYIELD_WITHIN_API() 函数让出 CPU，等待通知到来
            if( xTicksToWait > ( TickType_t ) 0 )
            {
                prvAddCurrentTaskToDelayedList( xTicksToWait, pdTRUE );	//将当前任务添加到延迟列表中，并按照任务等待时间的大小排序。该函数的作用是将当前任务从就绪状态转换为阻塞状态，并设置任务的解阻塞时刻
                traceTASK_NOTIFY_TAKE_BLOCK();	//函数记录当前任务进入阻塞状态的事件
                portYIELD_WITHIN_API();	//让出 CPU，将当前任务挂起，等待通知到来
            }
            else
            {
                mtCOVERAGE_TEST_MARKER();	// 是一个空函数，通常用于测试覆盖率的统计
            }
        }
        else
        {
            mtCOVERAGE_TEST_MARKER();	// 是一个空函数，通常用于测试覆盖率的统计
        }
    }
    taskEXIT_CRITICAL();

    taskENTER_CRITICAL();
    {
        traceTASK_NOTIFY_TAKE();	//用于记录任务接收到通知的事件
        ulReturn = pxCurrentTCB->ulNotifiedValue;
//如果当前任务已经接收到通知，则直接获取通知计数器的值并退出函数
        if( ulReturn != 0UL )
        {
            //清0还是减1
            if( xClearCountOnExit != pdFALSE )
            {
                pxCurrentTCB->ulNotifiedValue = 0UL;
            }
            else
            {
                pxCurrentTCB->ulNotifiedValue = ulReturn - ( uint32_t ) 1;	//用于更新任务接收到通知计数器的值的
            }
        }
        else
        {
            mtCOVERAGE_TEST_MARKER();	// 是一个空函数，通常用于测试覆盖率的统计
        }

        pxCurrentTCB->ucNotifyState = taskNOT_WAITING_NOTIFICATION;
    }
//离开临界区并返回任务接收到的通知计数器的值    
    taskEXIT_CRITICAL();

    return ulReturn;
}
```





{% note blue 'fas fa-fan' flat %}任务中发送通知{% endnote %}

```cpp
//函数原型
//参数1：任务句柄
//参数2：任务通知值，取0
//参数3：指示任务控制块中的变量ulNotifiedValue 实现加一操作
//参数4：空
//返回值：根据上面第3个形参的说明，将其设置为eSetValueWithoutOverwrite，有可能返回pdFALSE，其余所有情况都返回值pdPASS
BaseType_t xTaskNotify(TaskHandle_t xTaskToNotify, uint32_t ulValue, eNotifyAction eAction, uint32_t *pulPreviousNotificationValue)
```

参数3可取下面的：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230413131259.webp)

源码：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230413132014.webp)



{% note blue 'fas fa-fan' flat %}在任务中获取通知{% endnote %}

`功能`：在任务中获取通知，与xTaskNotify()配套使用，用于替代长度位1的队列与事件组

```cpp
//函数原型
//形参1:进入函数时，清除哪些位-> 0:无变化  1∶清除相应位
//形参2:退出函数时，清除哪些位-> 0:无变化  1∶清除相应位
//形参3:保存通知值
//形参4:超时时间，单位为系统节拍
//返回值：pdTRUE:获取任务通知成功    pdFALSE:获取任务通知失败
BaseType_t xTaskNotifyWait( uint32_t ulBitsToClearOnEntry, uint32_t ulBitsToClearOnExit, uint32_t *pulNotificationValue, TickType_t xTicksToWait )
```

使用注意：

1. 任务创建后，任务控制块中的变量 `ulNotifiedValue` 初始计数值是0

2. 默认配置此函数可以使用的的宏定义已经在FreeRTOS.h 文件中使能:

```cpp
#define configUSE_TASK_NOTIFICATIONS 1
```

当然，如果用户不需要使用任务通知功能相关的函数，可以在 FreeRTOSConfig.h文件中配置此宏定义为0来禁止，这样创建的每个任务可以 `节省5个字节` 的需求



### 任务通知代替二值信号量编程

任务的话配置一个同步任务即可

{% note blue 'fas fa-fan' flat %}程序编写{% endnote %}

{% folding, AllTask.c %}

```cpp
extern osThreadId vbinaryHandle;

void vBinarySem_Sync_Task(void const * argument)
{
	BaseType_t xResult;
	uint16_t TakeCnt = 0;
	
	for(;;)
	{
		printf("获取任务通知，无限等待\r\n");
		xResult = ulTaskNotifyTake(pdTRUE,portMAX_DELAY);	//二值信号量需要清0 无限等待
		//任务通知值被清0之前，通知值必为1(其实不需要判断这里只是演示返回值)
		if(1 == xResult)
		{
			printf("成功获取任务通知，次数=%u\r\n",++TakeCnt);
			LED.Led_State ^= 2;
			LED.vLed_write_all(LED.Led_State);
		}
	}
}
```

{% endfolding %}

{% folding, KEY.c %}

```cpp
void vKey_run_flag_function(void)
{
    uint8_t xResult;
    static uint16_t GiveCnt = 0;

    if(KEY.Key_Down_Buff[1])
    {
        KEY.Key_Down_Buff[1] = 0;
        xResult = xTaskNotifyGive(vbinaryHandle);	//任务句柄
        if(pdPASS == xResult)
        {
            printf("任务通知发送成功，次数=%u\r\n", ++GiveCnt);
        }
    }
}
```

{% endfolding %}



### 任务通知代替计数信号量编程

{% note blue 'fas fa-fan' flat %}MX配置{% endnote %}

这里的话需要单独开两个任务进行获取和释放信号量还有一个LCD显示任务优先级全部中等即可，不能在按键里进行因为它会超时等待，按键还需要做其他事情不能被挂起所以不能在按键里进行获取和释放

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230413144952.webp)

有点不太正常，按一次有可能多触发，是因为按键任务里有按下清0然后获取和释放函数里也有可能是有Bug，解决方法是把按键任务里按键1按键2的标志位清0去掉，在获取和释放那进行判断，这样就不会出现多触发

{% note blue 'fas fa-fan' flat %}程序编写{% endnote %}

{% folding, AllTask.c %}

```cpp
extern osThreadId TakeNotifyHandle;
extern osThreadId GiveNotifyHandle;
extern osThreadId DisplayLcdHandle;
extern osSemaphoreId myBinarySem01Handle;

uint8_t myCountingSem_ucMessagesWaiting = 20;


//显示
void DisplayLcd_function(void const * argument)
{
	BaseType_t xResult;
	char arr[20] = " ";
	for(;;)
	{
		xResult = xSemaphoreTake(myBinarySem01Handle,portMAX_DELAY);	//获取信号量 无限等待
		if(pdTRUE == xResult)
		{
			snprintf(arr,sizeof(arr),"CAR NUMBER have:%d ",myCountingSem_ucMessagesWaiting);
			LCD_DisplayStringLine(Line1,(uint8_t*)arr);			
		}
	}
}

//获取任务通知
void TakeNotify_function(void const * argument)
{
	for(;;)
	{
		if(KEY.Key_Down_Buff[2])
		{
			KEY.Key_Down_Buff[2] = 0;
			//获取任务通知，获取后，任务通知值减1
			myCountingSem_ucMessagesWaiting = ulTaskNotifyTake(pdFALSE,0);	//减1 不等待\等待也可以
			if(myCountingSem_ucMessagesWaiting > 0)
			{
				printf("获取任务通知成功，申请1个车位，发送同步显示信号\r\n");
				myCountingSem_ucMessagesWaiting--;
				xSemaphoreGive(myBinarySem01Handle);
			}
			else
			{
				printf("获取任务通知失败，停车位已满\r\n");
			}
		}
		osDelay(20);
	}

}
//发送任务通知
void GiveNotify_function(void const * argument)
{
	BaseType_t xResult;
	//初始化计数信号量初始值(因为它默认是0所以想初始化为20就用这个函数)
	xTaskNotify(TakeNotifyHandle,myCountingSem_ucMessagesWaiting,eSetValueWithOverwrite);	//覆盖方式
	for(;;)
	{
		if(KEY.Key_Down_Buff[3])
		{
			KEY.Key_Down_Buff[3] = 0;
			if(myCountingSem_ucMessagesWaiting < 20)
			{
				//发送任务通知
				xResult = xTaskNotifyGive(TakeNotifyHandle);
				if(pdPASS == xResult)
				{
					printf("发送任务通知成功，释放1个停车位\r\n");
					myCountingSem_ucMessagesWaiting++;
					xSemaphoreGive(myBinarySem01Handle);
				}
			}
			else
			{
				printf("不能释放，停车位已空\r\n");
			}
		}
		osDelay(20);
	}	

}
```

{% endfolding %}

{% folding, KEY.c %}

```cpp
//注释掉清0操作
if(KEY.Key_Down_Buff[2])	
{
    //KEY.Key_Down_Buff[2] = 0;
}
if(KEY.Key_Down_Buff[3])	
{
    //KEY.Key_Down_Buff[3] = 0;
}
```

{% endfolding %}

{% note blue 'fas fa-fan' flat %}实验现象{% endnote %}

跟之前模拟车库一样



### 任务通知代替消息队列编程

{% note blue 'fas fa-fan' flat %}MX配置{% endnote %}

在上面工程基础上写即可不需要再配置



{% note blue 'fas fa-fan' flat %}程序编写{% endnote %}
{% folding, AllTask.c %}

```cpp
extern osThreadId TakeNotifyHandle;
extern osThreadId GiveNotifyHandle;

//接收任务通知
void TakeNotify_function(void const * argument)
{
	BaseType_t xResult;
	uint32_t ucRec_Data = 0;
	
	const TickType_t ucReceiveBlockTime = pdMS_TO_TICKS(1000);
	
	for(;;)
	{
		xResult = xTaskNotifyWait(
									0x00000000,	//进入函数时不清除任务通知任何位
									0xFFFFFFFF,	//退出函数时清除任务通知值所有位
									&ucRec_Data,	//保存任务通知值
									ucReceiveBlockTime	
								 );
		if(pdTRUE == xResult)
		{
			printf("成功获取任务通知的数据：%u\r\n",ucRec_Data);
		}
		else
		{
			printf("获取任务通知的数据出现超时！！！\r\n");
		}
	}

}
//接收任务通知2
void GiveNotify_function(void const * argument)
{
	BaseType_t xResult;
	uint8_t *pucRec_Data = NULL;
	
	for(;;)
	{
		xResult = xTaskNotifyWait(
									0x00000000,	//进入函数时不清除任务通知值任何位
									0xFFFFFFFF,	//退出函数时清除任务通知值所有位
									(uint32_t*)&pucRec_Data,
									portMAX_DELAY
								 );
		if(pdTRUE == xResult)
		{
			printf("成功获取任务通知的数据:%s\r\n",pucRec_Data);
		}
	}	

}
```

{% endfolding %}

{% folding, KEY.c %}

```cpp
if(KEY.Key_Down_Buff[2])
{
    KEY.Key_Down_Buff[2] = 0;
    xTaskNotify(TakeNotifyHandle, ucSend_Data, eSetValueWithoutOverwrite);
    ucSend_Data += 1000;
}
if(KEY.Key_Down_Buff[3])
{
    KEY.Key_Down_Buff[3] = 0;
    printf("发送任务通知-模拟队列发送字符串：%s\r\n", "MCUSTM32G431");
    xTaskNotify(GiveNotifyHandle, (uint32_t)"MCUSTM32G431", eSetValueWithoutOverwrite);
}
```

{% endfolding %}


{% note blue 'fas fa-fan' flat %}实验现象{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230413193652.webp)



### 任务通知代替事件组编程

{% note blue 'fas fa-fan' flat %}MX配置{% endnote %}

在上面工程上即可不需要配置



{% note blue 'fas fa-fan' flat %}程序编写{% endnote %}
{% folding, AllTask.c %}

```cpp
extern osThreadId TakeNotifyHandle;

//接收任务通知
void TakeNotify_function(void const * argument)
{
	BaseType_t xResult;
	uint32_t Rec_Event = 0;	//定义任务通知接收变量
    uint32_t Last_Event = 0;	//缓存任务通知之前的值，用于多事件
	uint16_t SynCnt = 0;	//同步计数
	
	for(;;)
	{
		printf("获取任务通知，无限等待\r\n");
		xResult = xTaskNotifyWait(
									0x00000000,
									0xFFFFFFFF,
									&Rec_Event,	//保存任务通知值
									portMAX_DELAY
								 );
		if(pdTRUE == xResult)
		{
			Last_Event |= Rec_Event;	//缓存
			if((Last_Event&(KEY2_EVENT|KEY3_EVENT|KEY4_EVENT)) == (KEY2_EVENT|KEY3_EVENT|KEY4_EVENT))
			{
				printf("成功接收到任务通知同步信号，次数=%u\r\n",++SynCnt);
				LED.Led_State ^= 2;
				LED.vLed_write_all(LED.Led_State);
				Last_Event = 0;
			}
		}
	}

}
```

{% endfolding %}

{% folding, KEY.c %}

```cpp
#define KEY2_EVENT (EventBits_t)(0x0001 << 0)	//设置事件组掩码位0
#define KEY3_EVENT (EventBits_t)(0x0001 << 1)	//设置事件组掩码位1
#define KEY4_EVENT (EventBits_t)(0x0001 << 2)	//设置事件组掩码位2

if(KEY.Key_Down_Buff[1])
{
    KEY.Key_Down_Buff[1] = 0;
    xTaskNotify(TakeNotifyHandle, KEY2_EVENT, eSetBits);
}
if(KEY.Key_Down_Buff[2])
{
    KEY.Key_Down_Buff[2] = 0;
    xTaskNotify(TakeNotifyHandle, KEY3_EVENT, eSetBits);
}
if(KEY.Key_Down_Buff[3])
{
    KEY.Key_Down_Buff[3] = 0;
    xTaskNotify(TakeNotifyHandle, KEY4_EVENT, eSetBits);
}
```

{% endfolding %}


{% note blue 'fas fa-fan' flat %}实验现象{% endnote %}

三个按键按下才触发一次打印



## 综合应用1

> 用到的组件：
>
> ①队列
>
> ②二值信号量
>
> ③事件组
>
> ④任务通知
>
> ⑤软件定时器

{% note blue 'fas fa-fan' flat %}MX配置{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230414155950.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230414155937.webp)

{% note blue 'fas fa-fan' flat %}程序编写{% endnote %}

{% folding, app_freertos.c %}

```cpp
EventGroupHandle_t MyEvent01Handle = NULL;	//定义事件组
uint8_t Queue01_Buff[8] = {0};	//队列1缓存

void MX_FREERTOS_Init(void)
{
    ...
    MyEvent01Handle = xEventGroupCreate();
    if(MyEvent01Handle != NULL)
    {
        printf("创建事件组成功\r\n");
    }

    if(MyTimer01Handle != NULL)
    {
        printf("软件定时器1创建成功\r\n");
        printf("软件定时器1的周期调整为1000ms\r\n");

        xTimerChangePeriod(MyTimer01Handle, 1000, 0);	//修改周期为1000ms
        if(pdPASS == xTimerStart(MyTimer01Handle, 0))
        {
            printf("启动软件定时器1成功\r\n");
        }
    }
    ...
}
```

{% endfolding %}

{% folding, AllTask.c %}

```cpp
extern osThreadId Led_TaskHandle;
extern osThreadId Key_TaskHandle;
extern osThreadId Lcd_TaskHandle;
extern osThreadId Event_Sync_TaskHandle;
extern osThreadId Usart1_TaskHandle;
extern osThreadId Queue_Receive_TaskHandle;
extern osTimerId MyTimer01Handle;	//软件定时器
extern EventGroupHandle_t MyEvent01Handle;	//事件组
extern osSemaphoreId myBinarySem01Handle;	//二值
extern osMessageQId myQueue01Handle;
extern uint8_t Queue01_Buff[8];	//队列1缓存

/*
队列任务
*/
void Queue_Receive_Handler(void const * argument)
{
	char arr[3] = {'0','0',' '};
		
	for(;;)
	{
		if(pdPASS == xQueueReceive(myQueue01Handle,Queue01_Buff,portMAX_DELAY))
		{
			printf("队列1收到的数据：");
			
		}
		for(uint8_t i = 0; i < 8; i++)
		{
			arr[0] = Queue01_Buff[i]/16;	//高位
			if(arr[0] <= 9)
			{
				arr[0] += '0';
			}
			else
			{
				arr[0] += ('A' - 10);
			}
			arr[1] = Queue01_Buff[i]%16;	//低位
			if(arr[1] <= 9)		
			{
				arr[1] += '0';
			}
			else
			{
				arr[1] += ('A' - 10);
			}
			HAL_UART_Transmit(&huart1,(uint8_t*)&arr,3,200);	//发送到串口助手打印
		}
		printf("\r\n");
	}
}

/*
功能：LED任务
*/
void Led_Handler(void const * argument)
{
	for(;;)
	{
		LED.Led_State ^= 1;
		LED.vLed_write_all(LED.Led_State);
		osDelay(1000);
	}
}
/*
功能：按键检测与执行任务
*/
void Key_Handler(void const * argument)
{
	for(;;)
	{
		KEY.vKey_scan_function();
		KEY.vKey_run_flag_function();
		osDelay(20);		
	}
}
/*
功能：LCD显示任务
*/
void Lcd_Handler(void const * argument)
{
	char display_Arr[20] = " "; 
	
	for(;;)
	{
		ulTaskNotifyTake(pdTRUE,portMAX_DELAY);	//获取任务通知
		
		MyADC.vAdc_get_value_function();	//数据更新
		LED.Led_State ^= 2;
		LED.vLed_write_all(LED.Led_State);
		//显示在LCD
		snprintf(display_Arr,sizeof(display_Arr),"ADC2 value:%.2f ",MyADC.Adc_Value);
		LCD_DisplayStringLine(Line1,(uint8_t*)display_Arr);
	}
}
/*
功能：事件任务
*/
void Event_Sync_Handler(void const * argument)
{
	EventBits_t Rx_Event = 0;
	
	for(;;)
	{
		Rx_Event = xEventGroupWaitBits(
										MyEvent01Handle,	//事件组句柄
										KEY2_EVENT|KEY3_EVENT|KEY4_EVENT,
										pdTRUE,	//退出时清除标志位
										pdTRUE,	//逻辑与
										portMAX_DELAY	//无限等待
									  );
		if((Rx_Event&(KEY2_EVENT|KEY3_EVENT|KEY4_EVENT)) == (KEY2_EVENT|KEY3_EVENT|KEY4_EVENT))
		{
			if(BUZZER_STATE_OFF == BUZZER.Buzzer_State)
			{
				BUZZER.vBuzzer_control(SET);
			}
			else
			{
				BUZZER.vBuzzer_control(RESET);
			}
		}
	}
}
/*
功能：串口任务
*/
void Usart1_Handler(void const * argument)
{
	BaseType_t xResult;
	__HAL_UART_ENABLE_IT(&huart1,UART_IT_RXNE);
	__HAL_UART_ENABLE_IT(&huart1,UART_IT_IDLE);
	for(;;)
	{
		HAL_UART_Receive_DMA(&huart1,(uint8_t*)&ucUSART1_RX_BUFF,RX_MAX_LEN);
		xResult = xSemaphoreTake(myBinarySem01Handle,portMAX_DELAY);	//获取二值信号量
		if(pdTRUE == xResult)
		{
			LED.Led_State ^= 4;
			LED.vLed_write_all(LED.Led_State);
			MyUSART.vUsart1_Protocol_Analysis();	//数据解析
		}
	}
}
/*
功能：软件定时器回调函数
*/
void vMyTimerCallback(void const * argument)
{
	configASSERT(argument);	//断言

	xTaskNotifyGive(Lcd_TaskHandle);	//发送任务通知给LCD任务
}

//初始化
void HardWare_init(void)
{
	LCD_Init();
	LCD_Clear(White);
	LCD_SetBackColor(White);
	LCD_SetTextColor(Black);
	LED_Dis(0xFF,RESET);
	printf("----FreeRTOS----\r\n");
	printf("----综合应用1----\r\n");
	printf("按键1--打印任务\r\n");
	printf("按键2--设置按键事件\r\n");
	printf("按键3--设置按键事件\r\n");
	printf("按键4--设置按键事件\r\n");
	HAL_TIM_Base_Start_IT(&htim6);	//开启定时器6
	HAL_ADCEx_Calibration_Start(&hadc2,ADC_SINGLE_ENDED);
	HAL_ADC_Start_DMA(&hadc2,(uint32_t*)&MyADC.Adc_Rx_Buff,10);
}

//打印任务使用情况函数
void vTask_Print_function(void)
{
    uint8_t CPU_Run[500];	//保存任务运行时间信息

    vTaskList((char *)&CPU_Run);
    printf("-----------------------------------------------------------------------------------------\r\n");
    printf("任务名                                  任务状态  优先级  剩余栈  任务序号\r\n");
    printf("%s", CPU_Run);
    printf("-----------------------------------------------------------------------------------------\r\n");

    vTaskGetRunTimeStats((char *)&CPU_Run);
    printf("-----------------------------------------------------------------------------------------\r\n");
    printf("任务名                                 运行计数              利用率\r\n");
    printf("%s", CPU_Run);
    printf("-----------------------------------------------------------------------------------------\r\n");
}
```

{% endfolding %}

{% folding, KEY.h %}

```cpp
#define KEY2_EVENT (EventBits_t)(0x0001 << 0)	//设置事件组掩码位0
#define KEY3_EVENT (EventBits_t)(0x0001 << 1)	//设置事件组掩码位1
#define KEY4_EVENT (EventBits_t)(0x0001 << 2)	//设置事件组掩码位2
```

{% endfolding %}

{% folding, KEY.c %}

```cpp
extern EventGroupHandle_t MyEvent01Handle;

//按键执行功能
void vKey_run_flag_function(void)
{
	if(KEY.Key_Down_Buff[0])	
	{
		KEY.Key_Down_Buff[0] = 0;
		vTask_Print_function();
	}
	if(KEY.Key_Down_Buff[1])	
	{
		KEY.Key_Down_Buff[1] = 0;
		xEventGroupSetBits(MyEvent01Handle,KEY2_EVENT);
	}
	if(KEY.Key_Down_Buff[2])	
	{
		KEY.Key_Down_Buff[2] = 0;
        xEventGroupSetBits(MyEvent01Handle,KEY3_EVENT);
	}
	if(KEY.Key_Down_Buff[3])	
	{
		KEY.Key_Down_Buff[3] = 0;
		xEventGroupSetBits(MyEvent01Handle,KEY4_EVENT);
	}	
}
```

{% endfolding %}

{% folding, usart.c(自带) %}

```cpp
extern osSemaphoreId myBinarySem01Handle;	//二值

void USART1_IRQHandler(void)
{
	BaseType_t xHighPeriorityTaskWoken = pdFALSE;
	
	if(SET == __HAL_UART_GET_FLAG(&huart1,UART_FLAG_IDLE))
	{
		__HAL_UART_CLEAR_FLAG(&huart1,UART_FLAG_IDLE);
		HAL_UART_DMAStop(&huart1);
		ucRx_Len = RX_MAX_LEN - __HAL_DMA_GET_COUNTER(&hdma_usart1_rx);
		xSemaphoreGiveFromISR(myBinarySem01Handle,&xHighPeriorityTaskWoken);	//释放二值
		portYIELD_FROM_ISR(xHighPeriorityTaskWoken);	//如果有高优先级任务则执行
	}
  HAL_UART_IRQHandler(&huart1);
}
```

{% endfolding %}

{% folding, my_usart.c %}

```cpp
uint8_t ucUSART1_RX_BUFF[RX_MAX_LEN] = {0};
uint8_t ucRx_Len = 0;
bool Rx_Over_Flag = 0;
uint8_t Usart1_Order_Buff[USART1_ORDER_LEN] = {0};
extern osMessageQId myQueue01Handle;

/*
功能：串口协议解析(共8字节)
举例：0x55 0x01 0x01 0x00 0x00 0x00 0x00 0xBB
*/
void vUsart1_Protocol_Analysis(void)
{
	uint8_t i = 0,j = 0,Index = 0;
	bool Analysis_Over_Flag = 0;
	char arr[50];
	
	if(ucRx_Len < 1)
	{
		return;
	}
	
	//过滤干扰数据，首字节为0x55，共8字节
	for(i = 0; i < RX_MAX_LEN; i++)
	{
		if((0x55 == ucUSART1_RX_BUFF[i]) && (0xBB == ucUSART1_RX_BUFF[i+7]))
		{
			for(j  = 0;j < USART1_ORDER_LEN; j++)
			{
				Usart1_Order_Buff[j] = ucUSART1_RX_BUFF[i+Index];
				Index++;
				Analysis_Over_Flag = 1;
			}
		}
	}
	xQueueSend(myQueue01Handle,Usart1_Order_Buff,0);	//向队列1发送数据

	memset(ucUSART1_RX_BUFF,0,sizeof(ucUSART1_RX_BUFF));
	
	if(Analysis_Over_Flag)
	{
		Analysis_Over_Flag = 0;
		snprintf(arr,sizeof(arr),"RX_DATA:%#x-%#x-%#x-%#x-%#x-%#x-%#x-%#x\r\n",Usart1_Order_Buff[0],Usart1_Order_Buff[1],Usart1_Order_Buff[2],Usart1_Order_Buff[3],Usart1_Order_Buff[4],Usart1_Order_Buff[5],Usart1_Order_Buff[6],Usart1_Order_Buff[7]);
		HAL_UART_Transmit(&huart1,(uint8_t*)&arr,strlen(arr),200);	//发送回去
		
		if(0x01 == Usart1_Order_Buff[1])
		{
			switch(Usart1_Order_Buff[2])
			{
				case LED8_OPEN:
				{
					LED.Led_State = (~0x80)&LED.Led_State;
					LED.vLed_write_all(LED.Led_State);
					break;
				}
				case LED8_CLOSE:
				{
					LED.Led_State = (0x80)|LED.Led_State;
					LED.vLed_write_all(LED.Led_State);	
					break;	
				}
				case BUZZER_OFF:
				{
					BUZZER.vBuzzer_control(RESET);
					break;
				}
				case BUZZER_ON:
				{
					BUZZER.vBuzzer_control(SET);
					break;
				}
				default:break;
			}
		}
	}
	memset(Usart1_Order_Buff,0,sizeof(Usart1_Order_Buff));
}
```

{% endfolding %}


{% note blue 'fas fa-fan' flat %}实验现象{% endnote %}

<div class="video-bilibili">
  <iframe
    src="https://player.bilibili.com/player.html?aid=484895848&bvid=BV12T411W75y&cid=1095312339&page=1"
    scrolling="no"
    border="0"
    frameborder="no"
    framespacing="0"
    high_quality="1"
    danmaku="1"
    allowfullscreen="true"
  ></iframe>
</div>



## 第17讲

### 动态内存管理介绍

动态内存管理是FreeRTOS非常重要的一项功能，任务创建、信号量、消息队列、事件标志组、互斥信号量、软件定时器组等需要的RAM空间都是通过动态内存管理从FreeRTOSConfig.h文件定义的heap空间中申请的。

FreeRTOS支持5种动态内存管理方案，分别通过文件 `heap_1` , `heap_2` , `heap_3` , `heap_4` 和 `heap_5` 实现

> 五种动态内存管理方式简单总结如下，实际项目中，用户根据需要选择合适的:
>
> -  `heap_1` :五种方式里面最简单的，但是申请的内存不允许释放
>
> 用户通过函数 `xPortGetFreeHeapSize` 就能获得FreeRTOS动态内存的剩余，进而可以根据剩余情况优化动态内存的大小。
>
> ①项目应用不需要删除任务、信号量、消息队列等已经创建的资源
>
> ②具有时间确定性，即申请动态内存的时间是固定的并且不会产生内存碎片
>
> ③确切的说这是一种静态内存分配，因为申请的内存是不允许被释放掉的
>
> - heap_2:支持动态内存的申请和释放，但是不支持内存碎片的处理
>
> - heap_3∶将编译器自带的malloc和free函数进行简单的封装
>
> -  `heap_4` :支持动态内存的申请和释放，支持内存碎片处理
>
> 用户通过函数 `xPortGetFreeHeapSize` 就能获得FreeRTOS动态内存的剩余，但是不提供动态内存是如何被分配成各个小内存块的信息。使用函数 `xPortGetMinimumEverFreeHeapSize` 能够获取从系统启动到当前时刻的动态内存最小剩余，从而用户就可以根据剩余情况优化动态内存的大小
>
> ①可以用于需要重复的创建和删任务、信号量、事件标志组、软件定时器等内部资源的场合
>
> ②随机的调用pvPortMalloc()和vPortFree()，且每次申请的大小都不同，也不会像heap_2那样产生很多的内存碎片
>
> ③不具有时间确定性，即申请动态内存的时间不是确定的
>
> -  `heap_5` :在heap_4的基础上支持将动态内存设置在不连续的区域上(即可以将外部SARM和内部一起使用)
>
> heap_5动态内存管理是通过函数 `vPortDefineHeapRegions` 进行初始化的，也就是说用户在创建任务FreeRTOS的内部资源前要优先级调用这个函数vPortDefineHeapRegions，否则是无法通过函数pvPortMalloc申请到动态内存的。
>
> `定义的时候要注意两个问题，一个是内存段结束时要定义NULL。另一个是内存段的地址是从低地址到高地址排列`
>
> 用户通过函数 `xPortGetFreeHeapSize` 就能获得FreeRTOS动态内存的剩余，但是不提供动态内存是如何被分配成各个小内存块的信息。使用函数 `xPortGetMinimumEverFreeHeapSize` 能够获取从系统启动到当前时刻的动态内存最小剩余，从而用户就可以根据剩余情况优化动态内存的大小

FreeRTOS的动态内存大小在FreeRTOSConfig.h 文件中进行了定义:

```cpp
#define configTOTAL_HEAP_SIZE                    ((size_t)10240)
```



### heap_1和heap_4测试

- heap_4实验

{% note blue 'fas fa-fan' flat %}MX配置{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230414182243.webp)



{% note blue 'fas fa-fan' flat %}程序编写{% endnote %}

{% folding, KEY.c %}

```cpp
if(KEY.Key_Down_Buff[1])
{
    KEY.Key_Down_Buff[1] = 0;
    printf("剩余动态内存大小为%u\r\n", xPortGetFreeHeapSize());
    printf("系统启动至当前时刻的动态内存最小剩余为=%u\r\n", xPortGetMinimumEverFreeHeapSize());
}
```

{% endfolding %}


{% note blue 'fas fa-fan' flat %}实验现象{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230414182130.webp)

- heap_1实验

{% note blue 'fas fa-fan' flat %}MX配置{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230414182830.webp)



{% note blue 'fas fa-fan' flat %}程序编写{% endnote %}

{% folding, KEY.c %}

```cpp
if(KEY.Key_Down_Buff[1])
{
    KEY.Key_Down_Buff[1] = 0;
    printf("剩余动态内存大小为%u\r\n", xPortGetFreeHeapSize());
}
```

{% endfolding %}


{% note blue 'fas fa-fan' flat %}实验现象{% endnote %}

按按键2正常，按键1按下后，系统会死机，原因是 `vTaskList()` 函数会调用 `vPortFree()` 函数释放内存，而heap_1内存管理方案不支持内存释放，导致死机

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230414183139.webp)

### heap_5测试

{% note blue 'fas fa-fan' flat %}MX配置{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230414190012.webp)



{% note blue 'fas fa-fan' flat %}程序编写{% endnote %}

{% folding, app_freertos.c %}

```cpp
void MX_FREERTOS_Init(void)
{
    /* USER CODE BEGIN Init */
    HeapRegion_t xHeapRegions[] =
    {
        { ( uint8_t * ) 0x20003000UL, 0x1400 },	//5K
        { ( uint8_t * ) 0x20005800UL, 0x2800 },	//10K
        { NULL, 0 }
    };
    vPortDefineHeapRegions( xHeapRegions );
    ...
}
```

{% endfolding %}


{% note blue 'fas fa-fan' flat %}实验现象{% endnote %}

在创建信号量，事件，任务等等之前必须要先调用 `vPortDefineHeapRegions()` 函数

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230414185439.webp)

而且必须是 `低地址到高地址`，使用的话直接把下面复制即可

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230414185635.webp)

- 起始地址怎么看？

可以在keil里点击 `魔法棒` 查看，我的是 `STM32G431RBT6`，0x8000十进制就是32768‬，除以1024就是32K，起始地址一般不使用默认 0x20000000，因为还有其他变量用了，所以设置起始地址一般从大点的地方开始设置，比如 `5K~10K`那样

> 分配10K的话，10240的十六进制是0x2800,总大小是0x8000，则0x8000-0x2800结果是0x5800，所以我们内存的后面4位就是这个，最终 `10k就是0x20005800UL,0x2800`，5k就是 `5800-2800=3000,就是0x20003000UL,0x2800`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230414190144.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230414213942.webp)

- 如果屏蔽了 `vPortDefineHeapRegions( xHeapRegions );` 烧进去就会卡死
- 如果调换地址，先高再低也会卡死
- 如果把低地址改成默认 `0x2000000UL` 也会卡死



## 第18讲

### 独立看门狗IWDG概念

递减的，范围是 `0~4095`，看门狗被激活后，则在计数器计数至0x000时产生复位，时钟是 `32KHz(不同芯片型号可能不一样具体看数据手册)`，8位分频，假设现在想定时1s则计算过程：

> 公式：
>
> $IWDG\text{重装载值}=(\frac{\text{时钟频率}}{\text{分频值}})\times\text{想要定时的时间(s)}$
>
> 等价于
>
> $IWDG\text{重装载值}=(\frac{\text{时钟频率}\times\text{想要定时的时间(s)}}{\text{分频值}})$
>
> 则重装载值等于 `(32000*1)/32=1000`，所以重装载值取1000，分频值取32

 `而且需要注意重装载值不能超过4095`，根据这个芯片根据公式计算可以得出它 `最小定时时间为125us，最大定时时间为32.8s`


![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230415120621.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230415120853.webp)

### 看门狗监测多任务执行思路

- 监测目标

① 监测系统死机

② 监测任务执行

- 监测方案

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230415124306.webp)

说明:
① 监测任务通过独立看门狗 `监测自身，如果长时间得不到执行，看门狗将复位系统`

② 监测任务通过事件监控其它任务， `如果任一任务得不到执行，看门狗将复位系统`

③ 监测任务收到 `全部被监测任务发来的事件标志`后，才进行喂狗

应用注意事项：
① 监测任务 `优先级设置最高`，以便及时喂狗

② `监测任务与被监测任务均不可以挂起或删除`，否则，无法及时喂狗导致系统复位

③ 喂狗时间由 `被监测任务的最大发送事件标志间隔时间确定`，并且留有足够裕量

④ 考虑事件标志只有低24位可用， `被监测任务最多24个，足够使用`





### 监测多任务编程

{% note blue 'fas fa-fan' flat %}MX配置{% endnote %}

一般来说，独立看门狗的窗口值需要足够长，以确保系统能在规定时间内喂独立看门狗。同时，窗口值也不能过长，否则会影响系统的响应速度。通常， `窗口值的取值范围为重载值的 1/4 到 3/4` 之间，如果重载值是 1000，而窗口值是 800，那么当看门狗计数器递减至 800 时，系统需要在规定的时间内完成喂独立看门狗的操作，否则就会导致看门狗计数器继续递减

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230415133519.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230415134619.webp)



{% note blue 'fas fa-fan' flat %}程序编写{% endnote %}
{% folding, AllTask.c %}

```cpp
extern osThreadId Iwdg_TaskHandle;
extern osThreadId Key_TaskHandle;
extern osThreadId Task01Handle;
extern osThreadId Task02Handle;
extern osThreadId Task03Handle;
extern osThreadId Task04Handle;
extern osThreadId Led_TaskHandle;
extern osTimerId MyTimer01Handle;
extern EventGroupHandle_t MyEvent01Handle;


void Iwdg_Handler(void const * argument)
{
	EventBits_t xEvent;
	const TickType_t xTicksToWait = 6000 / portTICK_PERIOD_MS;	//设置等待时间为6s
	
	for(;;)
	{
		xEvent = xEventGroupWaitBits(
										MyEvent01Handle,	//时间句柄
										BIT_TASK_ALL_EVENT,	//事件
										pdTRUE,	//退出时清除事件位
										pdTRUE,	//逻辑与
										xTicksToWait	//等待时间
								    );
		if((xEvent&(BIT_TASK_ALL_EVENT)) == (BIT_TASK_ALL_EVENT))
		{
			LED.Led_State ^= 2;
			LED.vLed_write_all(LED.Led_State);
			printf("喂狗，监测任务与被监测任务均正常运行\r\n");
			HAL_IWDG_Refresh(&hiwdg);	//喂狗
		}
		else
		{
			//调试
			//关闭看门狗，通过变量xEvent值可以知道哪个任务长时间没有发送事件标志
		}
	}
}	
void Task01_Handler(void const * argument)
{
	for(;;)
	{
		osDelay(1000);
		xEventGroupSetBits(MyEvent01Handle,BIT_TASK01_EVENT);	//设置事件		
	}
}
void Task02_Handler(void const * argument)
{
	for(;;)
	{
		osDelay(2000);
		xEventGroupSetBits(MyEvent01Handle,BIT_TASK02_EVENT);	//设置事件		
	}	
}
void Task03_Handler(void const * argument)
{
	for(;;)
	{
		osDelay(3000);
		xEventGroupSetBits(MyEvent01Handle,BIT_TASK03_EVENT);	//设置事件		
	}	
}
void Task04_Handler(void const * argument)
{
	for(;;)
	{
		osDelay(4000);
		xEventGroupSetBits(MyEvent01Handle,BIT_TASK04_EVENT);	//设置事件		
	}	
}
void Key_Handler(void const * argument)
{
	for(;;)
	{
		KEY.vKey_scan_function();
		KEY.vKey_run_flag_function();
		osDelay(20);
	}
}
void Led_Handler(void const * argument)
{
	for(;;)
	{
		LED.Led_State ^= 1;
		LED.vLed_write_all(LED.Led_State);
		osDelay(1000);
	}
}
```

{% endfolding %}

{% folding, KEY.c %}

```cpp
extern osThreadId Task01Handle;
extern osThreadId Iwdg_TaskHandle;

if(KEY.Key_Down_Buff[1])
{
    KEY.Key_Down_Buff[1] = 0;
    printf("挂起任务1\r\n");
    vTaskSuspend(Task01Handle);	//挂起任务1
}
if(KEY.Key_Down_Buff[2])
{
    KEY.Key_Down_Buff[2] = 0;
    LED.Led_State ^= 8;
    LED.vLed_write_all(LED.Led_State);
    printf("删除任务1\r\n");
    vTaskDelete(Task01Handle);	//删除任务1

}
if(KEY.Key_Down_Buff[3])
{
    KEY.Key_Down_Buff[3] = 0;
    LED.Led_State ^= 16;
    LED.vLed_write_all(LED.Led_State);
    printf("挂起IWDG任务\r\n");
    vTaskSuspend(Iwdg_TaskHandle);
}
```

{% endfolding %}


{% note blue 'fas fa-fan' flat %}实验现象{% endnote %}

大概 4s喂狗一次

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230415141148.webp)

按键2，3，4会导致喂狗失败复位

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230415144015.webp)

## 第19讲

### STM32低功耗介绍

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230415153622.webp)

① 电池类产品，一般要求低功耗设计，比如农业物联网的节点采集设备

② 低功耗设计，除了MCU，软件，硬件设计同等重要，如果硬件设计不支持则用不了低功耗

③ Tickless模式主要针对睡眠模式，当然，也可以自行使用停机模式，待机模式

这里主要讲FreeRTOS里面的Tickless模式



### Tickless模式介绍

Tickless低功耗机制是当前小型RTOS所采用的通用低功耗方法，比如 `FreeRTOS` ， `RTX` 和 `uCOS-III`等。

仅从字母上看， `Tick` 是滴答时钟的意思， `less` 是 Tick 的后缀，表示较少的，整体看就是 `表示减少滴答时钟节拍运行`。在FreeRTOS系统中，当用户任务都被挂起或者阻塞时，最低优先级的空闲任务会得到执行。那么STM32支持的低功耗模式就可以放在空闲任务里面实现。为了实现低功耗最优设计，我们还不能直接把睡眠模式放在空闲任务就可以了。由于Tick中断停止，将导致无法及时运行阻塞超时的任务，`进入空闲任务后，首先要计算可以执行低功耗的最大时间，也就是求出下一个要执行的高优先级任务还剩多少时间`。然后就是把 `低功耗的唤醒时间设置为这个求出的时间(其实就是重载Systick)`，如果没有其它中断或事件唤醒STM32，到时间后Systick中断会将STM32唤醒，继续执行任务。这个就是所谓的Tickless模式。从上面的讲解中可以看出，实现Tickless模式最麻烦的是计算低功耗可以执行的时间。这个难题，FreeRTOS 已为我们做好。

- 使用的话首先需要在MX使能宏定义

```cpp
#define configUSE_TICKLESS_IDLE 1
```

> 在进入 if 语句之前，`xExpectedIdleTime` 可能已经被更新，例如在此之前有其它任务或中断执行了一些操作，导致当前任务的空闲时间变短了。因此，在进入临界区 `vTaskSuspendAll()` 之前，需要重新获取一次 `xExpectedIdleTime` 的值，并再次判断是否满足进入省电模式的条件，目的是为了避免误判

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230415162104.webp)

- 然后配置宏定义 `configEXPECTED_IDLE_TIME_BEFORE_SLEEP`，只有当系统可运行于低功耗模式的时钟节拍数 `大于等于` 这个参数时，系统才可以进入到低功耗模式(FreeRTOS默认已经配置了默认是2)，因为1的话就没必要休眠了，而且用户自定义设置时不能小于2否则报错

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230415161639.webp)

### 源码分析

- 首先看内核启动函数 `osKernelStart()`，可以看到它会创建空闲任务 `prvIdleTask`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230415163844.webp)

- 点击 `prvIdleTask` 跳转可以看到空闲任务里有一个预编译代码：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230415162104.webp)

这个 `xExpectedIdleTime` 其实就是下一个任务执行时间减去当前时间 `xNextTaskUnblockTime - xTickCount`

函数 `__weak void vPortSuppressTicksAndSleep( TickType_t xExpectedIdleTime )` 下面这个大于0才会进入睡眠模式

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230415165535.webp)

如果想要待机模式的话可以点击 `configPOST_SLEEP_PROCESSING` 跳转，然后点击 `PostSleepProcessing`跳转到弱函数(需要在MX使能了Tickless功能才行)，这样进入睡眠模式后我们把 `ulExpectedIdleTime` 设为0然后下面就可以放待机或者停机代码，需要注意进入待机或者停机后Tick中断是无法唤醒单片机的任务是不会执行的

```cpp
//在app_freertos.c里生成的
__weak void PostSleepProcessing(uint32_t ulExpectedIdleTime)
{
/* place for user code */
	ulExpectedIdleTime = 0;
	//这里待机或者停机
}
```



### Tickless编程

{% note blue 'fas fa-fan' flat %}MX配置{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230415171239.webp)

使能后会在程序里新增两个弱函数给用户进行编写

```cpp
//执行一些准备工作，然后进入省电模式
__weak void PreSleepProcessing(uint32_t ulExpectedIdleTime)
{
/* place for user code */
}
//执行一些准备工作，然后进入省电模式
__weak void PostSleepProcessing(uint32_t ulExpectedIdleTime)
{
/* place for user code */
}
```

然后可以修改宏定义的值默认是2

```cpp
#define configEXPECTED_IDLE_TIME_BEFORE_SLEEP 2
```

不要在源代码那改可以把它复制到 `FreeRTOSConfig.h` 里面添加到用户代码之间即可

然后这两个函数是相反的过程，一个是进入低功耗一个是退出低功耗，进入前把引脚啥的配好断电恢复就配置回去



{% note blue 'fas fa-fan' flat %}程序编写{% endnote %}

由于板子没有低功耗设计所以使用LED检验看看是否进入低功耗

{% folding, AllTask.c %}

```cpp
void Led_Handler(void const * argument)
{
	for(;;)
	{
		LED.Led_State = (~0x01)&LED.Led_State;
		LED.vLed_write_all(LED.Led_State);
		HAL_Delay(1000);	//延时1s才看到效果
		osDelay(1000);
	}
}
```

{% endfolding %}

{% folding, app_freertos.c %}

```cpp
__weak void PreSleepProcessing(uint32_t ulExpectedIdleTime)
{
/* place for user code */
	LED.vLed_write_all(0xFF);	//全部灭
}
```

{% endfolding %}


{% note blue 'fas fa-fan' flat %}实验现象{% endnote %}

LED1亮1s然后熄灭然后亮循环...



## FreeRTOS的疑问

{% note blue 'fas fa-fan' flat %}这几个的意思？{% endnote %}

```cpp
#define tskRUNNING_CHAR		( 'X' )	//运行
#define tskBLOCKED_CHAR		( 'B' )	//阻塞
#define tskREADY_CHAR		( 'R' )	//准备
#define tskDELETED_CHAR		( 'D' )	//删除
#define tskSUSPENDED_CHAR	( 'S' )	//挂起
```



{% note blue 'fas fa-fan' flat %}pdTRUE和pdPASS是否等效？{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230412095227.webp)



{% note blue 'fas fa-fan' flat %}临界段和调度锁？{% endnote %}

在 FreeRTOS 中， `临界段只是禁止其他中断打断当前任务，而并没有禁止其他任务抢占当前任务的 CPU 时间`。因此，如果当前任务在临界区内被一个高优先级任务抢占，那么当前任务会被挂起，等待高优先级任务执行完毕后才能继续执行。  `临界段的作用是保护共享资源，在临界区内对共享资源的访问是原子的，即不会被其他中断打断，但是并没有保护当前任务不被其他任务抢占`。 `如果需要保护当前任务不被其他任务抢占，可以使用调度锁来实现`。 因此，在使用临界段时，需要注意该机制只能保证共享资源的原子性，而不能保证当前任务不被其他任务抢占。如果需要保证当前任务不被其他任务抢占，可以使用调度锁或者其他机制来实现。【所以单单使用临界段访问共享资源还是有风险的最好配合调度锁】





{% note blue 'fas fa-fan' flat %}中断中的临界段？{% endnote %}

`uxSavedInterruptStatus`这个变量的值不是决定中断是否打开的关键因素。它的作用是在退出临界段时恢复进入临界段之前的中断状态，从而保持中断的嵌套状态不变。具体来说，当进入临界段时，`taskENTER_CRITICAL_FROM_ISR()`函数会将中断嵌套计数器加1，如果此时中断是打开的，那么函数会将`uxSavedInterruptStatus`变量的值设置为1，表示进入临界段前中断是打开的。当退出临界段时，`taskEXIT_CRITICAL_FROM_ISR()`函数会根据中断嵌套计数器的值来决定是否开启中断，如果中断嵌套计数器为0，即没有嵌套临界段的情况，那么函数会将中断开启或关闭，具体的开启或关闭动作取决于`uxSavedInterruptStatus`变量的值。如果`uxSavedInterruptStatus`变量的值为1，表示进入临界段前中断是打开的，那么函数会在退出临界段时重新开启中断。如果`uxSavedInterruptStatus`变量的值为0，表示进入临界段前中断是关闭的，那么函数会在退出临界段时保持中断关闭状态。因此，`uxSavedInterruptStatus`变量的值不是决定中断是否打开的关键因素，而是用于恢复中断状态的。 `默认情况下，中断是打开状态`，还有注意的是不受FreeRTOS管理的中断还是会打断进入临界段的任务

 `所以在使用临界段函数时，要尽可能地缩小临界区，以减少禁止中断的时间，从而避免对系统的响应性产生影响`



{% note blue 'fas fa-fan' flat %}中断优先级跟任务优先级区别{% endnote %}

简单的说，这两个之间没有任何关系， `不管中断的优先级是多少，中断的优先级永远高于任何任务的优先级，即任务在执行的过程中，中断来了就开始执行中断服务程序`。

既然你调用了FreeRTOS的API，你的中断优先级设置就应该是属于FreeRTOS管理的,所以如果你的中断应该设置为 `将其优先级手动设置为数值等于或大于configMAX_SYSCALL_INTERRUPT_PRIORITY设置的值`



{% note blue 'fas fa-fan' flat %}HAL_Delay在FreeRTOS作用{% endnote %}

`HAL_Delay` 函数在FreeRTOS里也可以使用，但是它不会造成阻塞，它是在那空等时间到



{% note blue 'fas fa-fan' flat %}任务控制块作用{% endnote %}

`TCB`是任务控制块（Task Control Block）的缩写，是一个用于管理任务的数据结构。`TCB`结构体中保存了任务的各种信息，如任务的状态、优先级、堆栈指针、等待事件、任务延时等等。

在FreeRTOS中，每个任务都有一个对应的`TCB`结构体，这个结构体可以在任务创建时分配内存并初始化，然后在任务运行时被用来管理任务的各种状态和信息。任务的创建、删除、挂起、恢复等操作都会对任务的`TCB`结构体进行修改，从而影响任务的运行。

通过结构体里面这些信息，FreeRTOS可以实现任务的调度、切换、挂起、恢复等操作，从而实现多任务系统的功能



{% note blue 'fas fa-fan' flat %}为什么cubemx以前生成的代码是 `typedef void* TaskHandle_t;`，后来改成 `typedef struct tskTaskControlBlock* TaskHandle_t;` 为什么作者要改成这样？{% endnote %}

原因是因为这个改变可以提高代码的可读性和可维护性。

在`typedef void* TaskHandle_t;`的定义中，`TaskHandle_t`是一个指向任意类型数据的指针，这意味着它可以指向任何类型的数据，而不仅仅是指向任务控制块。这样的定义虽然可以工作，但是在代码中使用起来不够直观，容易引起混淆和错误。 相比之下，`typedef struct tskTaskControlBlock* TaskHandle_t;`的定义更加明确和准确，它直接将`TaskHandle_t`定义为一个指向任务控制块的指针类型。这样的定义可以提高代码的可读性和可维护性，使得代码更加易于理解和修改。此外，使用结构体指针的方式来定义任务句柄，还可以避免在代码中进行不必要的类型转换，从而提高代码的安全性和可靠性。



{% note blue 'fas fa-fan' flat %}vPrintString函数的使用{% endnote %}

如果需要这个函数可以在CubeMX里把 `USE_TRACE_FACILITY` 和 `USE_STATS_FORMATTING_FUNCTIONS` 使能，然后在应用程序中包含  `FreeRTOS/Source/debug/printf-stdarg.c` 文件

`vPrintString` 是一个RTOS内核中的输出函数，用于将一个字符串输出到控制台或者其他设备上。它的优点是可以在RTOS内核中使用，输出的字符串可以和RTOS其他任务的输出混合在一起，方便调试和监控。【默认没有换行，需要换行可以使用 `vPrintStringAndNewLine` 函数】



{% note blue 'fas fa-fan' flat %}相对延时和绝对延时区别？{% endnote %}

举例：

运行条件：

1. 有一个 bsp_KeyScan 函数，这个函数处理时间大概耗时 2ms。
2. 有两个任务，一个任务 Task1 是用的 vTaskDelay 延迟，延迟 10ms，另一个任务 Task2 是用的
   vTaskDelayUntil 延迟，延迟 10ms。
3. 不考虑任务被抢占而造成的影响

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/1100576-20170715091935025-618582010.webp)





{% note blue 'fas fa-fan' flat %}SysTick 的优先级配置为最低，那延迟的话系统时间会不会有偏差？{% endnote %}

答案是不会的，因为 SysTick 只是当次响应中断被延迟了，而 SysTick 是硬件定时器，它一直在计时，这一次的溢出产生中断与下一次的溢出产生中断的时间间隔是一样的，至于系统是否响应还是延迟响应， 这个与 SysTick 无关，它照样在计时。



{% note blue 'fas fa-fan' flat %}在CubeMX里把MAX_PRIORITIES选项写了7为什么程序里使用8也能正常运行{% endnote %}

在FreeRTOS中，`MAX_PRIORITIES`选项定义了任务优先级的最大值。根据FreeRTOS文档的说明，`MAX_PRIORITIES`的默认值是5，最大值是256。在Cubemx里将其设置为7，实际上就是将其设置为了7。 如果在程序中使用了大于7的优先级，程序仍然可以正常运行，因为FreeRTOS并不会检查任务优先级的范围。如果超出了范围，FreeRTOS会将其限制在`MAX_PRIORITIES-1`的范围内，因此在你的例子中，使用了8的优先级实际上被限制在了7。 因此，你在程序中使用8的优先级并不会有任何问题，但仍然建议使用符合规范的优先级范围，以避免潜在的问题。，可以使用 `uxTaskPriorityGet()` 函数查询任务优先级



{% note blue 'fas fa-fan' flat %}绝对不可以在优先级为0的中断服务例程中调用RTOSAPI函数{% endnote %}

在FreeRTOS中，优先级为0的中断服务例程通常是用于处理紧急事件的，例如硬件故障、系统崩溃等。在这种情况下，RTOS内部的一些操作可能已经被中断打断，因此在中断服务例程中调用RTOSAPI函数可能会导致意想不到的行为，例如死锁、资源争用等问题。此外，优先级为0的中断服务例程的执行时间应该尽量短，以保证系统的实时性和稳定性。因此，为了避免不必要的风险和影响，最好避免在优先级为0的中断服务例程中调用RTOSAPI函数。



{% note blue 'fas fa-fan' flat %}FreeRTOS执行任务过程{% endnote %}

FreeRTOS 使用一种称为 `调度器` 的算法，它可以在任务之间自动切换，以确保系统资源合理分配。它会检查正在运行的任务，如果发现任务函数是一个死循环，它会把CPU时间分配给其他任务，以便它们也能够正常运行。比如，假设系统中有3个任务，A，B 和 C，A的优先级最高，B的优先级次之，C的优先级最低。如果A中的任务函数是一个死循环，则调度器会把CPU时间分配给B和C，以便它们也能够正常运行。

首先执行的最高优先级的任务Task1，Task1 会一直运行 `直到遇到系统阻塞式的 API 函数，比如延迟，事件标志等待，信号量等待`， Task1 任务会被挂起，也就是释放CPU的执行权，让低优先级的任务得到执行。



{% note blue 'fas fa-fan' flat %}裸机开发跟FreeRTOS死循环{% endnote %}

在裸机开发中，死循环会一直占用CPU时间，从而阻止其他功能得以执行。然而，在FreeRTOS中，死循环不会阻塞其他任务，因为FreeRTOS中的调度器会根据任务的优先级和时间片来决定任务的运行时间，从而实现多任务的同时运行。



{% note blue 'fas fa-fan' flat %}为什么要空闲任务？{% endnote %}

因为FreeRTOS一旦启动，就必须要保证系统中 `每时每刻都有一个任务处于运行状态(Runing)`，并且空闲任务不可以被 `挂起与删除`，空闲任务的 `优先级最低的`，以便系统中其他任务能随时抢占空闲任务的CPU使用权。(这些都是系统必要的东西，无需用户自己实现，处理完这些系统才真正启动) 



{% note blue 'fas fa-fan' flat %}FreeRTOS里抢占式rtos调度程序与协作式rtos调度程序区别{% endnote %}

抢占式RTOS调度程序是指调度器会把任务 `按照优先级排序` ，并自动从优先级最高的任务开始执行，当优先级高的任务结束后自动切换到优先级次高的任务执行；而协作式RTOS调度程序是指 `调度器不会自动切换任务`，而是由被调度的任务自行切换，任务可以选择是否执行其他任务。



{% note blue 'fas fa-fan' flat %}FreeRTOS里互斥量，递归互斥量，计数信号量什么意思{% endnote %}

互斥量（Mutex）是FreeRTOS中提供的一种互斥机制，它可以帮助多个任务访问共享资源时保持互斥， `即一次只有一个任务可以访问该资源，以防止两个任务同时访问同一资源`；从而避免了任务之间的竞争，保证了系统的稳定性。
递归互斥量（Recursive Mutex）是FreeRTOS中提供的一种特殊的互斥量，它 `可以被同一个任务多次加锁`，而不会出现死锁的情况，从而可以帮助任务在访问共享资源时保持互斥性。

计数信号量（Counting Semaphore）是FreeRTOS中提供的一种特殊的计数器，它可以用来控制多个任务同时访问共享资源的数量，从而可以有效地提高系统的效率。



{% note blue 'fas fa-fan' flat %}FreeRTOS里钩子函数什么意思{% endnote %}

钩子函数是FreeRTOS中的一种特殊函数，它可以被任务和调度器调用，以实现在任务切换、调度器启动和关闭等特定情况下执行特定操作的功能。它可以被用户用于实现一些自定义的功能，比如跟踪任务的运行情况、监控任务的堆栈使用情况等。

钩子函数之所以被称为钩子函数，是因为它们可以像钩子一样，钩住任务的执行流程，从而实现特定的功能。



{% note blue 'fas fa-fan' flat %}FreeRTOS里抢占优先级为什么是1~15{% endnote %}

因为0是单片机最高的优先级，一般系统保留给内部使用，以便系统可以在重要情况下响应中断，而用户则应尽量从优先级1开始，这样可以保证系统的稳定性和正常运行。



{% note blue 'fas fa-fan' flat %}换算{% endnote %}

在**16位**的系统中（比如8086微机） 1字 （word）= 2字节（byte）= 16（bit）
在**32位**的系统中（比如win32） 1字（word）= 4字节（byte）=32（bit）
在**64位**的系统中（比如win64）1字（word）= 8字节（byte）=64（bit）



{% note blue 'fas fa-fan' flat %}FreeRTOS里临界区什么意思{% endnote %}

FreeRTOS临界区可以理解为一个特殊的区域， `只有当一个任务进入临界区，其他任务才能进入，而在一个任务在临界区内完成操作之前，其他任务都无法进入这个区域`。例如当你去银行取钱时，你必须进入取款机区域，而在你取完钱之前，其他人都不能进这个区域。【也就是互斥量功能】

创建任务时并不需要写进入临界区退出临界区，但是在使用临界区机制时，必须显式地进入临界区和退出临界区。





## FreeRTOS函数

|                         函数/宏定义                          |                        HAL代码(封装)                         | 作用                                                         |
| :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------- |
|       void `vTaskDelete`( TaskHandle_t xTaskToDelete )       |                              /                               | 参数类型为任务句柄，一般参数写 NULL，表示删除调用者任务而不是删除指定任务 |
| BaseType_t xTaskCreate(	TaskFunction_t pxTaskCode, const char *const pcName,	 const configSTACK_DEPTH_TYPE usStackDepth, void *const pvParameters, UBaseType_t uxPriority, TaskHandle_t *const pxCreatedTask ) | osThreadId osThreadCreate (const osThreadDef_t *thread_def, void *argument) | 创建任务函数，经常用                                         |
|               void vTaskStartScheduler( void )               |                osStatus osKernelStart (void)                 | 启动调度器，在创建完任务后必须执行的操作不然任务不能运行     |
|      void vTaskDelay( const TickType_t xTicksToDelay )       |             osStatus osDelay (uint32_t millisec)             | 相对延时，任务会进入阻塞状态，单位是系统节拍时钟周期(不是ms或者s)，此函数不适用与周期性执行任务的场合。此外，其它任务和中断活动，会影响 vTaskDelay()的调用（比如调用前高优先级任务抢占了当前任务），因此会影响任务下一次执行的时间 |
| void vTaskDelayUntil( TickType_t * const pxPreviousWakeTime, const TickType_t xTimeIncrement ) |                              /                               | 绝对延时                                                     |
|             TickType_t xTaskGetTickCount( void )             |                              /                               | 获取系统当前运行的时钟节拍数(任务函数中使用)                 |
|         TickType_t xTaskGetTickCountFromISR( void )          |                              /                               | 获取系统当前运行的时钟节拍数(中断服务函数中使用)             |
|                          vTaskList                           |                              /                               | 列出系统中所有任务的详细信息，包括任务名、任务状态、任务优先级、任务堆栈使用情况等 |
|                     vTaskGetRunTimeStats                     |                              /                               | 用于获取系统中任务的运行时间统计信息，包括每个任务的运行时间、任务占用 CPU 的百分比、任务切换次数等 |
|        void vTaskDelete( TaskHandle_t xTaskToDelete )        |                              /                               | 删除任务                                                     |
|       void vTaskSuspend( TaskHandle_t xTaskToSuspend )       |                              /                               | 挂起任务                                                     |
|        void vTaskResume( TaskHandle_t xTaskToResume )        |                              /                               | 普通方式恢复任务                                             |
| BaseType_t xTaskResumeFromISR( TaskHandle_t xTaskToResume )  |                              /                               | 中断方式恢复任务                                             |
|                              /                               |                 void HardFault_Handler(void)                 | STM自带的一个用于处理硬件错误异常的中断服务函数              |
| void vApplicationStackOverflowHook(xTaskHandle xTask, signed char *pcTaskName) |                              /                               | 任务栈溢出时自动调用的钩子函数，参数 xTask 是指出现栈溢出的任务的句柄，参数pcTaskName则是该任务的名称 |
|  UBaseType_t uxTaskPriorityGet( const TaskHandle_t xTask )   |                              /                               | 获取任务优先级                                               |
| void vTaskPrioritySet( TaskHandle_t xTask, UBaseType_t uxNewPriority ) |                              /                               | 修改任务函数                                                 |
| #define taskDISABLE_INTERRUPTS()	portDISABLE_INTERRUPTS() |                              /                               | 关闭所有受管理的中断(不推荐使用)                             |
| #define taskENABLE_INTERRUPTS()		portENABLE_INTERRUPTS() |                              /                               | 打开所有受管理的中断(不推荐使用)                             |
|   #define taskENTER_CRITICAL()		portENTER_CRITICAL()   |                              /                               | 进入临界段(任务中)                                           |
|  #define taskEXIT_CRITICAL()			portEXIT_CRITICAL()  |                              /                               | 退出临界段(任务中)                                           |
| #define taskENTER_CRITICAL_FROM_ISR() portSET_INTERRUPT_MASK_FROM_ISR() |                              /                               | 中断进入临界段                                               |
| #define taskEXIT_CRITICAL_FROM_ISR( x ) portCLEAR_INTERRUPT_MASK_FROM_ISR( x ) |                              /                               | 中断退出临界段                                               |
|      #define taskYIELD()					portYIELD()      |                              /                               | 强制当前任务放弃CPU的使用权，让其他同优先级的任务得到执行机会 |
|                  pdMS_TO_TICKS( xTimeInMs )                  |                              /                               | 把用户的毫秒转换成系统节拍数                                 |







## FreeRTOS坑

{% note simple %}

今天创建了两个任务一个是串口打印一个是LED闪烁，但是一直是高优先级的在运行另一个不运行，查了原因原来是CubeMX默认生成的任务导致，把默认的任务函数去掉不实现它即可(它是weak的)

{% endnote %}

{% note simple %}

使用 `printf` 造成挂死，原因是任务分配的栈大小太小了，默认是 `128`，改成 `512` 即可

还有打印都是框框问号原因是重定向函数里 `HAL_UART_Transmit` 函数写错，里面参数 `ch`必须是 `&ch`

{% endnote %}

{% note simple %}

因为FreeRTOS很多结构体都是定义在 `.c` 文件的，所以用户一般不能去操作它的结构体来访问成员变量

{% endnote %}

{% note simple %}

基于FreeRTOS开发时使用 `空闲中断+DMA`需要注意不要把这两行代码放串口初始化那，否则会造成卡死，但是在裸机开发时没问题，原因是因为 `加入FreeRTOS之后，程序已经变成了多任务系统，其中每个任务都有自己的上下文环境和栈空间。如果你在初始化函数中直接开启串口中断，那么中断处理函数将会在中断上下文中运行，而这个上下文环境和栈空间是由FreeRTOS动态分配的，而不是由裸机时静态分配的，因此可能会覆盖其他任务的栈内存，导致其他任务出错。`，所以最好把初始化放在任务开头

```cpp
__HAL_UART_ENABLE_IT(&huart1,UART_IT_RXNE);
__HAL_UART_ENABLE_IT(&huart1,UART_IT_IDLE);
```

{% endnote %}



## 结语

花了大概半个月熟悉了一遍基于HAL的FreeRTOS学习，感觉学到很多