---
title: Linux-进程
cover: /img/num92.webp
comments: false
categories:
  - Linux
abbrlink: '73383e60'
date: 2022-09-25 21:39:00
updated: 2022-09-26 13:11:02
---
##  进程-概念

{% note blue 'fas fa-fan' flat %}什么是程序，什么是进程，有什么区别？{% endnote %}
<span style="color:# e80daf">1.程序是静态的概念，gcc xxx.c –o pro。磁盘中生成pro文件，叫做程序</span>

<span style="color:# e80daf">2.进程是程序的一次运行活动，通俗点意思是程序跑起来，系统中就多了一个进程</span>

{% note blue 'fas fa-fan' flat %}如何查看系统中有哪些进程？{% endnote %}
<span style="color:# e80daf">1.使用ps指令查看实际工作中，配合grep来查找程序中是否存在某一个进程</span>
<span style="color:# e80daf">2.使用top指令查看，类似windows任务管理器</span>

{% note blue 'fas fa-fan' flat %}什么是进程标识符？{% endnote %}
<span style="color:# e80daf">每个进程都有一个非负整数表示的唯一ID,叫做Pid，类似身份证。编程调用getpid函数获取自身的进程标识符 getppid获取父进程的进程标识符</span>

```bash
Pid=0:  称为交换进程（swapper）
作用—进程调度
Pid=1：init进程
作用—系统初始化
```

{% note blue 'fas fa-fan' flat %}什么叫父进程，什么叫子进程？{% endnote %}
<span style="color:# e80daf">进程A创建了进程B那么A叫做父进程，B叫做子进程，父子进程是相对的概念，理解为人类中的父子关系</span>

{% note blue 'fas fa-fan' flat %}C程序的存储空间是如何分配？{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/20210410190628480.jpg)

```bash
●正文段：这是由CPU执行的机器指令部分。通常，正文段是可共享的，所以即使是频繁执行的程序(如文本编辑器、C编译器和shell等)在存储器中也只需有一个副本，另外，正文段常常是只读的，以防止程序由于意外而修改其自身的指令。
●初始化数据段：通常将此段称为数据段，它包含了程序中需明确地赋初值的变量。例如，C程序中出现在任何函数之外的声明:
intmaxcount = 99;
使此变量带有其初值存放在初始化数据段中。
●非初始化数据段：通常将此段称为bss段，这一名称来源于一个早期的汇编运算符，意思是“block started by symbol" (由符号开始的块)，在程序开始执行之前，内核将此段中的数据初始化为0或空指针。出现在任何函数外的C声明
longsum[1000] ;
使此变量存放在非初始化数据段中。
●栈：自动变量以及每次函数调用时所需保存的信息都存放在此段中。每次调用函数时，其返回地址以及调用者的环境信息(例如某些机器寄存器的值)都存放在栈中。然后，最近被调用的函数在栈上为其自动和临时变量分配存储空间。通过以这种方式使用栈，可以递归调用C函数。递归函数每次调用自身时，就使用一个新的栈帧，因此一个函数调用实例中的变量集不会影响另一个函数调用实例中的变量。
●堆：通常在堆中进行动态存储分配。由于历史上形成的惯例，堆位于非初始化数据段和栈之间。
```

##  Linux-fork函数

- fork创建一个子进程的一般目的

(1) 一个父进程希望复制自己， `使父、子进程同时执行不同的代码段`。这在网络服务进程中是常见的一父 进程等待客户端的服务请求。当这种请求到达时，父进程调用fork,使子进程处理此请求。父进程则继续等待下一个服务请求到达。
(2) `一个进程要执行一个不同的程序`。 这对shell是常见的情况。在这种情况下，子进程从for k返回后立即调用exec

- 一个进程调用fork（）函数后，系统先给新的进程分配资源，例如存储数据和代码的空间。然后把原来的进程的所有值都复制到新的新进程中，只有少数值与原来的进程的值不同。 `相当于克隆了一个自己。`

```cpp
//头文件
# include <sys/types.h>
# include <unistd.h>
//返回值
fork调用的一个奇妙之处就是它仅仅被调用一次，却能够返回两次，它可能有三种不同的返回值：
    (1)在父进程中，fork返回新创建子进程的进程ID；
    (2)在子进程中，fork返回0；
    (3)如果出现错误，fork返回一个负值；
```

```cpp
/*
 在fork函数执行完毕后，如果创建新进程成功，则出现两个进程，一个是子进程，一个是父进程。在子进程中，fork函数返回0，在父进程中，fork返回新创建子进程的进程ID。我们可以通过fork返回的值来判断当前进程是子进程还是父进程。
*/
/*
 fork出错可能有两种原因：
   (1)当前的进程数已经达到了系统规定的上限，这时errno的值被设置为EAGAIN。
   (2)系统内存不足，这时errno的值被设置为ENOMEM。
*/
```

```cpp
/*
创建新进程成功后，系统中出现两个基本完全相同的进程，这两个进程执行没有固定的先后顺序，哪个进程先执行要看系统的进程调度策略。
*/
/*
测一下一个程序中到底创建了几个子进程，最好的方法就是调用printf函数打印该进程的pid，也即调用printf("%d/n",getpid());或者通过printf("+/n");来判断产生了几个进程
*/
/*
可以通过getpid()得到进程的pid，通过getppid()得到父进程的pid
*/
/*
产生一个子进程可以在任意时刻通过getppid（）得到父进程的pid，但是，不能知道一个父进程的所有子进程的pid，一旦子进程结束，父进程无法得到其pid，这也是父进程中返回其子进程pid的原因。 另外，进程ID 0 总是由内核交换使用，所以一个子进程的pid不可能为0
*/
/*
子进程在运行而其父进程已经结束，称该子进程为孤儿进程，将其父进程pid设为1（这也就相当于福利院啦）
*/
```

```cpp
# include <sys/types.h>
# include <unistd.h>
# include <stdio.h>

int main()
{
    pid_t pid;
    int data=10;
    while(1)
    {
        printf("please input a data\n");
        scanf("%d",&data);
        if(data==1)
        {
            pid=fork();
            if(pid>0)
            {

            }
            else if(pid==0)
            {
                while(1)
                {
                    printf("do net require,pid=%d\n",getpid());
                    sleep(3);
                }
            }
        }
        else
            {
                printf("wait,do nothing\n");
            }
    }
    
    return 0;
}

//输入1后，在父进程中pork返回值pid是子进程的，子进程也是复制了父进程这时候子进程中pid==0所以进入了内嵌的while里而父进程则也同时进行while循环
```

