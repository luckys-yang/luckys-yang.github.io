---
title: eNSP-笔记
cover: /img/num110.webp
comments: false
tags:
  - eNSP
categories:
  - 专业课笔记
abbrlink: aa44e601
date: 2022-06-27 14:14:00
updated: 2022-07-01 18:45:57
---
##  附1-命令缩写

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96/QQ%E6%88%AA%E5%9B%BE20220627152412%20.png)

<font color='red'>注1</font>：`ip address xxx.xxx.xxx.xxx 子网掩码`	缩写 `ip add xxx.xxx.xxx.xxx 子网掩码（子网掩码可用24代替）`

<font color='red'>注2</font>：华为命令文档：https://support.huawei.com/enterprise/zh/doc/EDOC1100169982/9f807c4

##  VRP通用路由介绍

{% note red 'fas fa-fan' flat %} 本节主要命令{% endnote %}

```cpp
sys	//进入系统视图
sysname SW1	//重命名设备为SW1
q	//返回上一级视图    
Ctrl+z/return	//直接返回用户视图
save	//保存配置信息，输入y或n表示是否继续，等待几秒后保存成功(必须在用户视图下才可以使用)
undo 名称/命令	//删除配置，即取消所配置的信息
dis 名称/命令	//即可查看接口或者设备配置信息    
dis saved-configuration	//查询当前设备的所保存的信息
dis current-configuration	//查询当前设备的所有配置情况（简写：dis cur）
dis version	//查看VRP的版本信息
reboot	//重启    
shutdown	//端口状态下，禁用此端口，前面加undo表示开启
dis this	//显示系统当前视图下生效的运行配置参数
```

```cpp
//清空配置命令
//第一步，用户视图下
reset saved-configuration
//输入命令后会出现叫你 Are you sure?(y/n)：这时输入y
//第二步
reboot
//输入命令后会出现叫你 Contunue?[y/n]：这时输入n
//系统会继续提示：System...Continue?[y/x]：这时输入y，重启
//以上完成后路由器恢复出厂设置，需要断开路由再启动

```

```cpp
//关闭泛洪信息
undo terminal monitor	//可简写 u t m
//开启
terminal monitor	//可简写 t m
```

{% note blue 'fas fa-fan' flat %} 前言 {% endnote %}

`VRP` (Versatile Routing Platform)即通用路由平台，是华为在通信领域多年的研究经验结晶，是华为所有基于 `IP/ATM` 构架的数据通信产品操作系统平台。运行VRP操作系统的华为产品包括 `路由器、局域网交换机、ATM交换机、拨号访问服务器、IP电话网关、电信级综合业务接入平台、智能业务选择网关，以及专用硬件防火墙等。`<font color='cornflowerblue'>核心交换平台基于IP或ATM。</font>

{% note blue 'fas fa-fan' flat %} 华为命令结构规律{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220627144802.jpg)

`命令字`：规定了系统应该执行的功能，个人理解就是规定主方向，例如：display(查询状态)、undo(撤销命令)、reboot（重启设备）等确认主方向。

`关键字`：是在命令字的基础上进一步约束命令，是对命令的扩展，更加明确主方向。

`参数列表`：对命令执行更加的精细化，目的是让指令明确自己要去哪里 去干什莫。

例如：

```cpp
[Huawei]dis ip int GigabitEthernet 0/0/0   //查询g 0/0/0接口地信息
```

`命令字`：dis(display)  ----告诉系统说，我这是我这是查询命令

`关键字`：ip  ----在查询的基础上再次告诉系统我的查询查询目标是IP

`参数名`：int----再把接口告诉系统，我要查IP里面的接口（intface的缩写）

`参数值`：GigabitEthernet 0/0/0  ----最后告诉系统查询那个接口

<font color='red'>注1</font>：

<font color='gree'>①</font> 每条命令里最多有一个命令字，但是可以有多个关键字和参数。

<font color='gree'>②</font> 命令字、关键字、参数名、参数值之间，需要用空格进行分割。

<font color='gree'>③</font> 一条命令命令字是唯一且不可缺少的，例如:reboot、save等。

<font color='gree'>④</font> 命令不一定都是这么完整的格式，但是整体思想都是如此。

{% note blue 'fas fa-fan' flat %} 视图 {% endnote %}

- 在VRP通用路由平台有三种视图，分为`用户视图、系统视图和接口视图。`
- 打开路由器的 `CLI`，即打开命令行页面后，会出现 很多`# `，等加载往后会有以下页面显示（`用户视图`），输入 `sys` 进入 `系统视图`

<font color='red'>注1</font>：若启动后一直出来 `# ` 或启动报错，说明可能配置软件安装有错误等等，首先尝试把 `防火墙`关闭！（所以我每次用都会把火绒退出）

- 例如我们对路由器LSW2的 `Ethernet 0/0/0` 接口进行配置，只需要在系统视图下输入： `int e0/0/0`，即可进入该接口下

<font color='red'>注1</font>：命令不分大小写，有的长单词可简写！

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220627144241.jpg)

##  配置IP地址和网关

{% note red 'fas fa-fan' flat %} 本节主要命令{% endnote %}

```cpp
//路由器
g+端口号	//进入某端口
ip add ip地址 网关 //端口状态下配置路由器ip和网关
    
//交换机
vlan xx	//划分vlan,如vlan 10,vlan 20
int vlan xx	//进入vlan
ip add ip地址 网关	//vlan状态下配置交换机ip，网关
dis vlan	//查看vlan配置
port link-type access	//指定配置接口类型为 `access` 
port default vlan xx	//将相应的vlan应用到端口上
    
//PC机
ping ip地址	//查询是否已经通信

```

{% note blue 'fas fa-fan' flat %} PC的配置 {% endnote %}

`双击PC机，打开其基础配置`，在`IPv4配置选项卡`中可设置IP地址、子网掩码、网关。例设置IP地址、子网掩码、网关分别为：`192.168.1.122` 、`255.255.255.0`、`192.168.1.1`，如下图：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220628081142.png)

{% note blue 'fas fa-fan' flat %} 路由器的配置 {% endnote %}

若要对路由器的接口进行配置，在CLI中需转到`接口视图`，并进入相应的接口，然后输入`ip address`后跟 `ip地址` 和 `子网掩码`，之间空格隔开。例对路由器的 `GigabitEthernet0/0/0` 接口配置ip地址和子网掩码分别为：`192.168.1.12`、`255.255.255.0`。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220628082535.jpg)

{% note blue 'fas fa-fan' flat %} 交换机的配置 {% endnote %}

- 划分VLAN

交换机的配置和路由器不一样，它要通过划分一个新的虚拟局域网，也就是<font color='orange'>定义一个vlan进行封装</font>。例在交换机LSW1中定义一个 `vlan20` 其ip地址和子网掩码分别为：`192.168.1.2`、`24`，如下图：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220628083446.jpg)

- 查看VLAN配置

`display vlan`命令用来查看所有VLAN的相关信息，若不指定任何可选参数，则显示所有VLAN的基本信息，可以看到刚刚划分的vlan20，如下图：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220628083821.png)

- 三层交换机

注：关于几层交换机可以看型号判断：`S5700` 是三层交换机，`S3700`是二层交换机

这里讲的是三层交换机与PC机的拓扑图，实现三层交换机和PC机的连通，如下图：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220628084919.png)

<font color='gree'>① </font>打开LSW1的CLI，配置三层交换机的接口`g0/0/1`，进行 `vlan` 划分

<font color='gree'>②</font> 配置接口类型：在进入相应接口后，输入命令“`port link-type access`”，指定配置接口类型为 `access` 。

<font color='gree'>③</font> 应用端口：然后将相应的vlan应用到该端口上，输入命令“`port default vlan`”，后跟vlan名称

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220628090153.png)

{% note blue 'fas fa-fan' flat %} 网关通信{% endnote %}

网关在`网络层以上`实现网络的互相连接，是复杂的网络互连设备，仅`用于两个高层协议不同的网络互连`。简单的来说<font color='orange'>网关就相当于从一个房间走向另外一个房间之间需要通过一扇门才能通过。</font>

- ping命令

ping命令是用来检测PC与输入的IP地址是否有数据通讯，以来`判断网络是否连通`，即在PC机的命令行中输入"`ping`"后跟ip地址

例如当我们设置好路由器和PC机的ip地址如下：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220628091154.png)

设置PC机的ip地址、子网掩码、网关为 `192.168.1.1`、`255.255.255.0`、`192.168.1.254`。

设置路由器端口 `g0/0/1` 的IP地址和子网掩码。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220628094010.png)

然后回到PC机在命令行输入 `ping 192.168.1.254`，会发现已经ping通，即实现了网关通信；交换机与PC实现网关通信也是一样，只是要划分vlan且网关地址要一致，否则无法ping通。

##  配置静态路由、动态路由

{% note red 'fas fa-fan' flat %} 本节主要命令{% endnote %}

```cpp
//静态路由
ip route-static 目标网段 子网掩码 下一跳	//这里的网段是根据看对应ip的子网掩码的，子网掩码中255表示不可变，0可以变；下一跳指的是相邻的路由器接口ip地址
    
//浮动路由
ip route-static 目标网段 子网掩码 下一跳preference 70	//备用路径，静态路由默认优先级60，设置备选路径优先级要大于60，值越小优先级越高

//PC机
tracert	//路由跟踪

//动态路由-RIP
rip	//系统视图下开启协议进程，其默认进程号为version 1，即rip-1
network 网段	//这里网段只能是路由相邻，即直连的路由其ip地址
version 2	//改变其运行版本为2，下面也是输入network 网段
    
//动态路由-OSPF
ospf	//系统视图下开启协议进程，跟rip一样，默认进程号1，即ospf-1
area 区域ID	//配置区域
network 网段 反子网掩码	//与rip差不多，只是后面增加了一个反子网掩码
```

{% note blue 'fas fa-fan' flat %} 静态路由 {% endnote %}

静态路由是一种路由的方式，`手动配置`，而非动态决定。且与动态路由不同，静态路由是`固定的`，不会改变，即使网络状况已经改变或是重新被组态。一般来说，静态路由是由网络管理员逐项加入路由表。

<font color='red'>注</font>：路由器有阻隔广播功能

<font color='cornflowerblue'>例题</font>：配置路由器R1和R2之间的静态路由

注：这里路由的接口不能使用 `Ethernet` 类型，只能用 `GE` 类型（我也不清楚为什么）

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220628122907.jpg)

<font color='gree'>①</font> 在配置好各个PC机的ip地址、子网掩码、网关后，对路由R1和R2的 `G0/0/0` 和 `G0/0/1` 的接口进行配置

<font color='gree'>②</font> 在 `系统视图` 下，对于R1，由于R1与PC1和R2是相邻的，与PC2是间接相连的，配置R1的静态路由的目标网段为 `192.168.2.0`，而下一跳为R2的 `G0/0/0`接口ip为 `10.0.0.2`]，即配置命令为 `ip route-static 192.168.2.0 24 10.0.0.2`

也是在 `系统视图` 下，对于R2，由于R2与PC2和R1是相邻的，与PC1是间接相连的，配置R2的静态路由的目标网段为 `192.168.1.0`，而下一跳为R1的 `G0/0/0`接口ip为 `10.0.0.1`，即配置命令为 `ip route-static 192.168.1.0 24 10.0.0.1`

<font color='gree'>③</font> 测试连通性，发现是连通的

{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220628110717.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220628110910.png)
{% endgallery %}

{% note blue 'fas fa-fan' flat %} 浮动路由 {% endnote %}

浮动路由指的是配置 `两条静态路由` 默认选取链路质量优（带宽大的）作为 `主路径`，当主路径出现故障时，由带宽较小的备份路径顶替主路径。<font color='orange'>作用：保持网络不中断</font>；<font color='orange'>浮动路由在同一时刻数据只会有一条链路代为转发</font>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220629004150.jpg)

```cpp
//R1配置
int g0/0/0
ip add 192.168.3.1 24
q
int g0/0/1
ip add 192.168.1.254 24
q
int g0/0/2
ip add 192.168.4.1 24
q
    
//R2配置
int g0/0/0
ip add 192.168.3.2 24
q
int g0/0/1
ip add 192.168.2.254 24
q
int g0/0/2
ip add 192.168.5.1 24
q

//R3配置
int g0/0/0
ip add 192.168.4.2 24
q
int g0/0/1
ip add 192.168.5.2 24
q
```

```cpp
//R1配置
ip route-static 192.168.2.0 24 192.168.3.2	////这里的网段是根据看对应ip的子网掩码的，子网掩码中255表示不可变，0可以变；下一跳指的是相邻的路由器接口ip地址
ip route-static 192.168.2.0 24 192.168.4.2 preference 70
    
//R2配置
ip route-static 192.168.1.0 24 192.168.3.1	//默认主路径
ip route-static 192.168.1.0 24 192.168.5.2 preference 70	//备用路径，静态路由默认优先级60，设置备选路径优先级要大于60
    
//R3配置
ip route-static 192.168.1.0 24 192.168.4.1
ip route-static 192.168.2.0 24 192.168.5.1
```

最后经过测试可以ping通，还可以通过 `tracert` ip 看看经过了哪些路由端口，也可以把其中一条线的端口断开测试是否连通

```cpp
//端口断开
int g0/0/0
shutdown
//恢复
int g0/0/0
undo shutdown
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220629005649.png)



{% note blue 'fas fa-fan' flat %} 动态路由 {% endnote %}

动态路由是与静态路由相对的一个概念，指路由器能够根据路由器之间的交换的特定路由信息 `自动地建立自己的路由表`，并且能够根据链路和节点的变化适时地进行 `自动调整`。下面主要介绍 `RIP` 和 `OSPF`

###  RIP协议

路由信息协议（RIP）是一种`动态路由选择协议`，它是使用最早最广泛的协议，用于自治系统内的路由信息传递，使用这种协议的路由器`只与相邻的路由器进行信息交换`，适用于 `小型网络`。

<font color='cornflowerblue'>例题</font>：配置R1和R2之间的动态路由信息协议

![跟静态路由拓扑图一样](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220628122907.jpg)

<font color='gree'>①</font> 在配置好各个PC机的ip地址、子网掩码、网关后，对路由R1和R2的 `G0/0/0` 和 `G0/0/1` 的接口进行配置

<font color='gree'>②</font> 在系统视图下，对于路由器R1，由于R1与PC1和R2是相邻的，与PC1相连的接口网段 `192.168.1.0`和与R2相连的接口网段 `10.0.0.0`，即配置命令为`rip` 然后输入 `network 192.168.1.0`  再输入 `network 10.0.0.0` 。

对于路由器R2，由于R2与PC2和R1是相邻的，与PC2相连的接口网段 `192.168.2.0`和与R2相连的接口网段 `10.0.0.0`，即配置命令为`rip` 然后输入  `network 192.168.2.0`  再输入 `network 10.0.0.0` 。

<font color='gree'>③</font> 测试连通性，发现已经连通

###  OSPF协议

开放式最短路径优先即为OSPF协议的优点，它也是一种`动态路由选择协议`，用于单一自治系统内的决策路由，适用于 `大型网络`

<font color='cornflowerblue'>例题1</font>（单区域）：在 `区域0` 中，配置路由器R1和R2之间的动态开放式最短路径优先协议

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220628123227.jpg)

<font color='gree'>①</font> 配置PC和路由步骤这里省略跟静态路由一样

<font color='gree'>②</font> 在系统视图下，对于路由器R1，配置命令为`ospf` 然后输入 `area 0` 再输入`network 192.168.1.0 0.0.0.255` 再输入  `network 10.0.0.0 0.0.0.255` 。

对于路由器R2，配置命令为`ospf` 然后输入 `area 0` 再输入  `network 192.168.2.0 0.0.0.255` 再输入  `network 10.0.0.0 0.0.0.255` 。

<font color='gree'>③</font> 然后ping一下发现已经连通

例题2（多区域）：配置 `区域0，区域1，区域2` 中路由器R1和R2之间的动态开放式最短路径优先协议

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220628131241.jpg)

<font color='gree'>①</font> 配置PC和路由步骤这里省略跟静态路由一样

<font color='gree'>②</font> 对于 R1，需要配置 `area 0` 和 `area 1`；对于R2。需要配置 `area 1` 和 `area 2`

![R1](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220628190531.jpg)

{% gallery %}
![R2](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220628190635.jpg)
![R2](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220628190656.jpg)
{% endgallery %}

<font color='gree'>③</font> 通过ping ip 发现PC1除了PC2不能ping其他都可以连通，PC2除了PC1不能ping其他都可以连通，相当于一个区域的才能互相连通

<font color='gree'>④</font> 查看全局路由表，输入命令：`dis ip routing-table`，可以发现下图红框内容是我们定义的 `OSPF` 动态路由

<font color='red'>注</font>：下图蓝框意思依次为：`目的网络 主机地址/掩码长度`；`学习路由的协议`；`优先级`；`开销`；`路由标记`；`下一跳`；`下一跳的接口`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220628194231.jpg)

## 单臂路由

简单的来说，单臂路由就是通过在路由器的一个接口上通过配置 `子接口`（这里的接口并不是物理接口）实现不同虚拟局域网之间的互联互通。

{% note blue 'fas fa-fan' flat %} Trunk模式 {% endnote %}

Trunk端口允许 `多个VLAN` 通过，可以接收和发送多个VLAN报文，一般用于 `交换机之间端口` ，只允许默认VLAN报文发送时不打标签，带有标签的数据被转发至另一个交换机Trunk端口

交换机可以使用trunk功能（中继链路），只需要两台交换机之间有一条互连线，将互连线的两个端口设置为trunk模式，这样就可以使交换机上不同VLAN共享这条线路

```cpp
//主要命令
//进入端口状态下...
port l trunk	//设置端口工作模式为trunk
port trunk pvid v ID号	//指定端口的PVID值
port trunk allow-pass v all/ID号	//允许所有或者部分VLAN通过trunk口
```



{% note blue 'fas fa-fan' flat %}VLAN概述与优势{% endnote %}

在传统的交换式以太网中，所有的用户都在同一个广播域中，当网络规模较大时，广播包的数量会急剧增加（广播风暴），网络的 `传输效率将会明显下降`。我们可以使用 `分隔广播域` 的方法来解决这个，分隔广播域有两种方法。`物理分隔` 和 `逻辑分隔`

<font color='cornflowerblue'>优势</font>：

<font color='gree'>①</font> <font color='orange'>控制广播</font>：每个VLAN都是一个 `独立的广播域` ，这样就减少了广播对带宽的占用，提高了网络传输效率。
<font color='gree'>②</font> <font color='orange'>增强网络安全性</font>：由于只能在同一VLAN内的端口之间交换数据， `不同VLAN的端口之间不能直接访问` ，因此通过划分VLAN可以限制个别主机访问服务器等资源，提高网络的安全性。
<font color='gree'>③</font> <font color='orange'>简化网络管理</font>：一个VLAN可以 `根据部门职能、对象组或应用将不同地理位置的用户划分为一个逻辑网段` ，在不改动网络物理连接的情况下可以任意地将工作站在工作组或子网之间移动。利用VLAN大大减轻了网络管理和维护工作的负担，降低了网络维护的费用。




![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220628215741.jpg)

```cpp
//单臂路由配置
int g0/0/0.1	//进入子接口1
dot1q termination vid 10	//配置子接口dot1q终结的单层VLAN ID，封装数据帧
ip add 192.168.1.254 24	//对子接口配置ip地址和子网掩码
arp broadcast en	//开启子接口1的ARP广播功能

    
int g0/0/0.2	//进入子接口2
dot1q termination vid 20
ip add 192.168.2.254 24
arp broadcast en
    

int g0/0/0.3	//进入子接口3
dot1q termination vid 30
ip add 192.168.3.254 24
arp broadcast en
```

```cpp
//交换机配置
int e0/0/1	//进入接口
port l trunk	//设置端口工作模式为trunk
port trunk allow-pass vlan all	//允许所有VLAN通过trunk口
    
    
vlan batch 10 20 30	//一次性创建VLAN 10 20 30
    
    
int e0/0/2
port l a	//指定配置接口类型为 `access` (port link-type access)
port d v 10	//将相应的vlan应用到端口上(port default vlan 10)

    
int e0/0/3
port l a
port d v 20	
    
    
int e0/0/4
port l a
port d v 30	
```

最后，通过PC机互相ping，会发现已经连通

##  AAA模式

在进入用户页面后，要对用户进行认证，以下由两种方式对设备进行配置，分别是`password模式`和`AAA模式`。两种模式都是在PC2的 `串口` 里进行操作的，打开PC机后点击 `连接`

AAA是认证（Authentication）、授权（Authorization）和计费（Accounting）的简称，是网络安全中进行访问控制的一种安全管理机制，提供 `认证、授权和计费` 三种安全服务。

AAA模式`登录时需输入用户名和密码`，当用户输入信息与设备所配置的用户名和密码正确时才能通过。如果对用户采用AAA认证，登录到设备的用户所能访问的命令级别由AAA配置信息中本地用户的级别决定。缺省情况下，AAA本地用户的级别为 `0`

{% note blue 'fas fa-fan' flat %} 用户级别 {% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220629111409.jpg)



![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220629105533.png)

<font color='gree'>①</font> 首先点击PC，到 `串口` 那点击连接，进入用户视图下，然后输入 `sys` 进入系统视图

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220629105756.png)

<font color='gree'>②</font> 

```cpp
//PC
user-interface console 0	//进入Console用户页面
authentication-mode aaa	//设置模式为AAA
q	//返回系统视图
aaa	//进入AAA视图
local-user adim password cipher 123456	//配置用户名和密码
local-user adim privilege level 3	//配置用户级别，当前设置为3
q	//退出退到直到弹出登陆页面
```

<font color='gree'>③</font> 测试登陆，通过 `dis cu` 查看配置信息

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220629111123.png)

## 远程终端协议（远程登录）

telnet，即 `远程终端协议` ，通过两个路由器AR2220之间的远程登陆实验来实现互通，其中 `R1` 作为telent服务器端，`R2` 作为客户端

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220629123048.jpg)

```cpp
//R1
int g0/0/0
ip add 192.168.1.1 24
    
//R2
int g0/0/0
ip add 192.168.1.2 24
```

```cpp
//R1
user-interface vty 0 4	//进入虚拟类型终端VTY用户界面。VTY是路由器的远程登陆的虚拟端口，0 4表示可以同时打开5个会话，即最多允许5个用户同时登陆。
authentication-mode password	//然后会弹出提示“Please configure the login password (maximum length 16):”，提示输入密码的最大字符限制为16，我这里设置为：123456
user privilege level 3	//配置用户级别为3
```

然后在R2上测试telnet连接，在用户视图输入命令`telnet ip地址`，来测试客户端R2访问R1服务器，成功后会要求输入密码，输入错误系统没有提示成功则通过并按之前设置的用户级别要求来访问服务器R1

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220629124014.jpg)

{% note blue 'fas fa-fan' flat %} 查看用户界面的用户登录信息 {% endnote %}

可通过命令`display users （all）`，查看用户界面的用户登录信息，下图可以看到R2已经连接上服务器了

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220629124216.jpg)

##  动态主机配置协议（DHCP）

{% note blue 'fas fa-fan' flat %} 定义 {% endnote %}

DHCP（动态主机配置协议）是一个局域网的网络协议。指的是由服务器控制一段IP地址范围，客户机登录服务器时就可以自动获得服务器分配的IP地址和子网掩码。两种方式分别是基于接口地址池的  `DHCP（接口模式）` 和基于全局地址池的  `DHCP （全局模式）`。其通常被应用在 `大型的局域网络环境中`，由管理员手动安装并进行必要的配置，能够提升地址的使用率。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220629133312.jpg)

```cpp
//R1配置
int g0/0/0
ip add 192.168.1.254 24
q
int g0/0/1
ip add 192.168.2.254 24
q
dhcp en	//使能DHCP
ip pool 1	//设置ip地址池1
network 192.168.1.0 mask 24	//配置ip范围及子网掩码
gatework-list 192.168.1.254	//配置网关，注意要和路由器g0/0/0的ip地址一样
dns-list 8.8.8.8	//配置dns；DNS地址是一个域名服务器地址，它负责把用户的网站地址解析成IP地址，命令：dhcp server dns-list 主DNS 备用DNS
lease day 0 hour 12	//配置租约12小时；超过租期后地址将会重新进行分配
q
int g0/0/0
dhcp select global	//开启该接口的 DHCP 功能；global是指定接口采用全局地址池并对客户端分配ip地址
```

输入 `dis ip pool name 1` 查看地址分配详细信息

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220629135032.jpg)

```cpp
//R1配置
int g0/0/1
dhcp select int	//开启采用接口地址的DHCP Server功能
dhcp server dns-list 8.8.8.8	//网关
dhcp server lease day 0 hour 12	//租约12小时
dhcp server static ip-address 192.168.2.10 mac-address 5489-9810-7267	//绑定静态IP地址给静态mac，如果报错需要到PC释放dhcp分配的ip地址 “ipconfig /release”，配置完成然后再“ipconfig /renew”
```

接下来就是测试，看是否能够由基于全局地址池的DHCP服务器给PC机分配IP地址，我们打开PC机的基础配置，在 `IPv4` 配置中勾选 `DHCP`，然后点击 `应用`。此时就已经给PC机分配IP地址了，我们通过在命令行中输入 `ipconfig` 命令来测试一下

{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220629141030.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220629140935.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220629140950.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220629141043.png)
{% endgallery %}

顺便测试一下连通性，可以发现4台PC已经互相连通

##  STP/MSTP

{% note blue 'fas fa-fan' flat %} STP是什么？ {% endnote %}

`生成树协议STP`（spanning tree protocol）

{% note blue 'fas fa-fan' flat %} 环路会引起的问题 {% endnote %}

<font color='gree'>①</font> `环路会引起广播风暴，网络中的主机会收到重复数据帧。`
<font color='gree'>②</font> `环路会引起MAC地址表震荡。`
<font color='cornflowerblue'>场景</font>:为了提高网络可靠性，交换网络中通常会使用冗余链路，然而，冗余链路会交给交换网络带来环路风险，并导致广播风暴以及MAC地址表不稳定等问题，进而会影响到用户的通信质量。生成树协议STP（spanning tree protocol）可以在提高可靠性的同时用能避免环路带来的各种问题。

{% note blue 'fas fa-fan' flat %} STP的作用 {% endnote %}

STP通过 `阻塞端口` 来消除环路，并能够实现链路备份的目的。（防止环路）
运行该协议的交换机可以自动找出导致环路的链路，并将其临时阻塞，在链路发生故障的时候，再自动恢复阻塞链路，保障网络既有冗余又无环运行。

{% note blue 'fas fa-fan' flat %} BPDU报文 {% endnote %}

STP需要网络设备相互交换消息来检测桥接环路，该消息称为 `网桥协议数据单元BPDU`。STP之所以能够良好的工作并构建一个无环的网络，是依赖于BPDU报文的泛洪，并根据报文中相关字段计算的结果。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/20210410134602449.png)

- 桥ID（Bridge ID）是交换机的STP标识符，一个8个字节，由 `2个字节的优先级` 和 `6个字节的MAC地址` 构成
- 桥优先级缺省位 `32768`，可以手工修改。（4069的倍数）
- MAC地址为交换机的背板MAC。
- 网络中Bridge ID最小的交换机将成为根桥。

{% note blue 'fas fa-fan' flat %} STP的端口状态 {% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/20210410142425108.png)

{% note blue 'fas fa-fan' flat %} 生成树算法的步骤 {% endnote %}

- 选择根网桥

`依据`：网桥ID（BID）
网桥ID=网桥优先级+网桥的MAC地址
`网桥优先级的取值范围`：0-65535（4096倍数）
`默认值`：32768
优先比较优先级，选最小
当优先级相等的情况下，选MAC地址小的

- 每个非根网桥上选择根端口`（RP）`

<font color='gree'>①</font> 到根桥最低的根路径成本
某个网桥到达根网桥的中间所有线路的路径成本之和
用来代表一条线路带宽的大小
<font color='gree'>②</font> 直连的网桥ID最小的
<font color='gree'>③</font> 对端端口ID（PID）最小的
端口ID=端口优先级+端口编号
`端口优先级`：0-255  `默认值`：128

- 在每条链路上都要选择一个指定端口`（DP）`

根网桥上的每个端口都是指定端口，都不会被阻塞
<font color='gree'>①</font> 比较到达根桥的RPC（Root Path Cost），越小越优。
<font color='gree'>②</font> 比较BPDU包发送者的BID，越小越优。
<font color='gree'>③</font> 比较BPDU包发送者的PID，越小越优。
<font color='gree'>④</font> 比较BPDU包接收者的PID，越小越优。

<font color='red'>总结</font>：`stp算法的比较都是选小的`

- 阻塞既不是根端口又不是指定端口的端口`（AP）`

{% note blue 'fas fa-fan' flat %} MSTP {% endnote %}

`MSTP兼容STP和RSTP`，通过多实例能实现对业务流量和用户流量的隔离，同时还提供了数据转发的多个冗余路径，在数据转发过程中实现VLAN数据的负载均衡。
在MSTP中，你可以将若干个VLAN映射到一个实例(instance)，MSTP将为每个instance运行一棵生成树，可以基于instance设置优先级、端口路径开销等参数。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220629223706.jpg)

```cpp
//SW3
vlan batch 10 20	//创建vlan 10 20
int e0/0/1
port hybrid pvid vlan 10	//设置Hybrid类型接口的缺省VLAN ID
port hybrid untagged vlan 10 20	//指定相关VLAN的数据发送时添加标签

int e0/0/2
port hybrid pvid vlan 20
port hybrid untagged vlan 10 20
    
int e0/0/3
port hybrid pvid vlan 10
port hybrid untagged vlan 10 20
 
int e0/0/4
port hybrid pvid vlan 20	
port hybrid untagged vlan 10 20
    
stp region-configuration	//进入MST域视图
region-name test	//配置MST域的域名
instance 1 vlan 10	//把vlan10映射到生成树实例1上
instance 2 vlan 20	//把vlan20映射到生成树实例2上
active region-configuration	//激活MST域，使修改后的参数生效
    
//SW1
vlan 10 20
int e0/0/1
port hybrid untagged vlan 10 20

int e0/0/2
port hybrid pvid vlan 10
port hybrid untagged vlan 10 20
    
int e0/0/3
port l trunk
port trunk allow-pass vlan 2 to 4094	//将Trunk类型接口加入这些VLAN
    
stp region-configuration	
region-name test	
instance 1 vlan 10	
instance 2 vlan 20	
active region-configuration
  
stp instance 1 root primary	//配置交换设备为生成树实例1的根桥
stp instance 2 root secondary	//配置交换设备为生成树实例2的备份根桥
    
//SW2
vlan batch 10 20
int e0/0/1
port hybrid untagged vlan 10 20

int e0/0/2
port hybrid pvid vlan 20
port hybrid untagged vlan 10 20
    
int e0/0/3
port l trunk
port trunk allow-pass vlan 2 to 4094
  
stp instance 1 root secondary	//配置交换设备为生成树实例1的备份根桥
stp instance 2 root primary	//配置交换设备为生成树实例2的根桥
    
stp region-configuration
region-name test
instance 1 vlan 10
instance 2 vlan 20
active region-configuration
```

```cpp
//R1
int g0/0/0
ip add 192.168.10.1 24

int g0/0/1
ip add 192.168.20.1 24
    
int loopback0	//取值范围是0～1023
ip add 1.1.1.1 24	//配置loopback的DNS
```

验证MSTP，输入命令：`dis stp brief`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220629225230.jpg)

并且打开PC1和PC2尝试ping `1.1.1.1`，发现已经连通

{% note blue 'fas fa-fan' flat %} Hybrid模式 {% endnote %}

Hybrid端口和Trunk端口一样，不过它 `既能用于交换机也能用于计算机`，允许多个VLAN报文发送时 `不打标签`

##  ACL/NAT

{% note blue 'fas fa-fan' flat %} ACL概述 {% endnote %}

- 访问控制列表（Access Control Lists,ACL）是应用在路由器接口的指令列表。这些指令列表用来告诉路由器 `哪些数据包可以收、哪些数据包需要拒绝`。
- ACL分类

<font color='gree'>①</font> `基本ACL`：范围2000-2999

<font color='gree'>②</font> `高级ACL`：范围3000-3999

<font color='gree'>③</font> `二层ACL`：范围4000-4999

<font color='gree'>④</font> `自定义ACL`：范围5000-6999

- ACL工作原理

ACL使用 `包过滤技术`，在路由器上读取第三层及第四层包头中的信息，如源地址、目的地址、源端口、目的端口等，根据预先定义好的规则，对包进行过滤，从而达到访问控制的目的。
ACL有两个方向。

<font color='gree'>（1）</font>出：已经过路由器的处理，正离开路由器接口的数据包。

<font color='gree'>（2）</font>入：已到达路由器接口的数据包，将被路由器处理。
如果对接口应用了ACL，那么路由器将对数据包应用该组规则进行顺序检查

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220630001913.jpg)

- ACL的应用

`匹配IP流量`（可基于源、目的IP地址、协议类型、端口号等）

在 `Traffic-filter` 中被调用

在 `NAT` 中被调用

{% note blue 'fas fa-fan' flat %} NAT概述 {% endnote %}

- 网络地址转换（NAT）随着网络的发展，对公网IP地址的需求与日俱增。为了缓解公网IP地址的不足，并且保护内部服务器的私网地址，可以使用NAT技术 `将私网地址转换成公网地址`。
- NAT的实现方式

`静态NAT`：所谓静态NAT是指公网IP和私网IP的对应关系是静态的，由管理员手工指定后就不会改变了。并且静态NAT实现的是一对一的地址转换。
`动态NAT`：动态NAT基于地址池来实现私有地址和公网地址的转换，任然是一对一的地址转换，但是私网和公网的对应关系不固定。
`NAPT`：网络地址端口转换，NAPT允许多个内部地址映射到一个公有地址的不同端口。
`Easy IP`：允许将多个内部地址映射到网关出接口地址上的不同端口。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220630011903.jpg)

{% note blue 'fas fa-fan' flat %} 静态NAT设置 {% endnote %}

```cpp
//R1
int g0/0/0
ip add 192.168.1.1 24
int g0/0/1
ip add 202.10.100.1 24
nat static global 15.0.0.10 inside 192.168.1.10	//做nat的地址转换；nat static global 马甲 inside 源地址 
    
ip route-static 0.0.0.0 0 202.10.100.2	//添加默认路由目的网段0.0.0.0子网掩码长度0下一跳入接口ip202.10.100.2 
    
//R2
int g0/0/0
ip add 202.10.100.2 24

ip route-static 15.0.0.10 32 202.10.100.1	//添加静态路由目的网段15.0.0.10子网掩码长度32下一跳入接口ip202.10.100.1 
```

测试：PC1 和 Server1 `ping` `202.10.100.2`，会发现PC1不通，Server1通

{% note blue 'fas fa-fan' flat %} 动态NAT-PAT设置 {% endnote %}

```cpp
//R1
int g0/0/0
ip add 192.168.1.1 24
int g0/0/1
ip add 202.10.100.1 24

nat address-group 1 15.0.0.10 15.0.0.11	//设置nat地址池
acl 2000	//创建标准ACL访问控制列表
    
rule permit source 192.168.1.0 0.0.0.255	////规则 许可 源 地址
int g0/0/1
nat outbound 2000 address-group 1	//将一个访问控制列表ACL和一个地址池关联起来，nat地址池出接口调用ACL2000
    
//R2
int g0/0/0
ip add 202.10.100.2 24

ip route-static 15.0.0.0 24 202.10.100.1
```

测试：PC1 和 Server1 `ping` `202.10.100.2`，会发现PC1通，Server1通

{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220630013522.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220630013649.png)
{% endgallery %}

##  综合实验1

{% note blue 'fas fa-fan' flat %} 项目需求分析 {% endnote %}

服务器群交换机使用两条链路连接到核心交换机，两条链路可以配置端口聚合，防止单链路出现故障。财务部和项目管理部处于同一区域，各部门交换机使用一条链路连接到核心交换机，为防止单链路故障，可以在财务部交换机和项目管理部交换机上采用一条链路互联，当上行链路出现故障时可以通过其他部门的交换机到达核心交换机。采用这种方式连接时，三台交换机会形成环路，可以采用 `生成树` 解决该问题。

项目管理部为方便员工获取DNS服务器IP地址，可以采用 `DHCP` 方式为该局域网自动分配IP及DNS地址。核心交换机、服务器群交换机和出口路由器各均采用三层互联，可以配置动态路由协议自动学习路由实现全网互联互通。
公司有一个公网IP，各部门所有员工都有访问internet的需求，可以在出口路由器上配置网络地址转换。
为方便网络管理员对设备进行远程管理，需要启用所有设备的 `SSH服务`。

<font color='red'>注</font>：由于eNSP 的PC机不能运行 `ssh` 命令，故最后的登陆无法实现

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220630091252.jpg)

{% note blue 'fas fa-fan' flat %} 规划表 {% endnote %}

交换机管理是 `vlan 100`，每一个交换机都有

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220630135541.jpg)
![][2]
![][3]
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220630184413.jpg)

本项目分为以下任务：

<font color='gree'>① </font>VLAN配置

<font color='gree'>②</font> 以太网配置

<font color='gree'>③ </font> IP业务配置

<font color='gree'>④</font> 路由配置

<font color='gree'>⑤ </font> 出口配置

<font color='gree'>⑥</font> SSH服务配置

{% note blue 'fas fa-fan' flat %} vlan和vlanif的区别 {% endnote %}

`vlanif` 不是物理端口，是 `逻辑`端口，通常这个接口地址作为 `vlan` 下面用户的 `网关`， 应用于 `三层交换机`。

`vlan` 是 `物理` 端口，应用于 `二层交换机`

<font color='orange'>划分VLAN后，同一VLAN内的用户可以互相通信，但是属于不同VLAN的用户不能直接通信</font>。为了实现VLAN间通信，可通过配置 `vlanif` 来实现



- 在进行<font color='cornflowerblue'>任务1</font>之前可以先配好PC的 `ip，网关，子网掩码`等等

首先根据 `vlanif` 的网段进行配置ip：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220630185352.png)

根据需求，项目管理部需要使用 `DNS自动获取ip`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220630185530.png)

根据 `IP规划表` 配置 `DNS服务器`，`网管计算机` 没有规定哪个ip地址，可以根据 `192.168.90.0/24` 网段自己设计

{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220630190943.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220630191349.png)
{% endgallery %}




### 任务1-VLAN配置

{% note blue 'fas fa-fan' flat %} 任务1描述 {% endnote %}

<font color='gree'>①</font> 在 `SW1,SW2,SW3,SW4` 上创建VLAN并修改备注（通过查看规划表）

<font color='gree'>②</font> 在 `SW1,SW2,SW3,SW4` 上将端口划分给VLAN

<font color='gree'>③</font> 输入相对应查看命令进行验证（可做可不做）

{% note blue 'fas fa-fan' flat %} ①命令 {% endnote %}
主要看PC连接在哪个交换机上那么网关就在哪

```cpp
//SW1
u t m	//关闭泛洪信息
sys
sysname SW1
vlan 10	//创建vlan10
description FA	//修改备注为FA
    
vlan 20
description PM
    
vlan 100
description SW-MGMT
    
vlan 201
description SW1-R1
```

- `SW2` 下面的 `服务器群`，加上 `设备管理`，分别是 `90 100`

```cpp
//SW2
u t m	//关闭泛洪信息
sys
sysname SW2
vlan 90
description DC
    
vlan 100
description SW-MGMT
```

- 因为 `SW3` 下面涉及到 `财务部` 和 `项目管理部`，然后加上本身 `设备管理`，分别是 `10 20 100`


```cpp
//SW3
u t m	//关闭泛洪信息
sys
sysname SW3
vlan 10
description FA

vlan 20
description DC
    
vlan 100
description SW-MGMT
```

- `SW4` 和 `SW3` 一样，所以可以直接在 `SW3` 输入命令 `dis cur` 复制刚刚的命令粘贴即可

```cpp
//SW4
复制SW1命令即可
```

{% note blue 'fas fa-fan' flat %} ②命令 {% endnote %}

```cpp
//SW1
int g0/0/24	//进入端口
port l access	//配置端口模式为access
port d vlan 201	//配置端口缺省VLAN为vlan 201
```

```cpp
//SW2
port-group 1	//创建端口组1（当需要多个端口需要vlan时可以创建一个组）
group-member g0/0/1 to g0/0/10	//将g0/0/0~g0/0/10加入到端口组
port l access
port d vlan 90
```

```cpp
//SW3
port-group 1	
group-member e0/0/1 to e0/0/20
port l access
port d vlan 10
```

```cpp
//SW4
port-group 1
group-member e0/0/1 to e0/0/20
port l access
port d vlan 20
```

{% note blue 'fas fa-fan' flat %} ③验证 {% endnote %}

- `dis vlan` 命令进行查看<font color='orange'>VLAN配置是否生效</font>（这里以SW3为例）

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220630150710.jpg)

- `dis port vlan` 命令进行查看<font color='orange'>端口分配状态</font>（这里以SW3为例）

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220630151750.jpg)

###  任务2-以太网配置

{% note blue 'fas fa-fan' flat %} 任务2描述 {% endnote %}

<font color='gree'>①</font> 配置 `SW1,SW3,SW4` 的互连端口为 `trunk` 模式，并 `放行相应VLAN`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220630153801.jpg)

<font color='gree'>②</font> 配置 `核心交换机`(SW1) 与服务器群交换机(SW2)互连线路为 `Eth-Trunk` ，配置端口模式为 `Trunk` 并 `放行相应VLAN`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220630154003.jpg)

<font color='gree'>③</font> 交换机启动 `STP` 功能，指定核心交换机的 `STP优先级`，配置连接各PC的端口为 `生成树边缘端口`

<font color='gree'>④</font> 输入相对应查看命令进行验证（可做可不做）

{% note blue 'fas fa-fan' flat %} ①命令 {% endnote %}

- 因为 `SW1` 刚刚配置了 `vlan 10 20 100 201`，由于 `vlan 201` 待会需要设置成 `Eth-trunk`(链路聚合)，所以这里就暂时不考虑 `201`

```cpp
//SW1
int g0/0/1
port l trunk	//配置端口模式为Trunk
port trunk allow-pass vlan 10 20 100	//放行vlan
int g0/0/2
port l trunk	//配置端口模式为Trunk
port trunk allow-pass vlan 10 20 100	//放行vlan
```

- `SW3` 和 `SW1` 配置一样，直接复制即可

```cpp
//SW3
复制SW1命令即可
```

- `SW4` 和 `SW1` 配置也是一样，直接复制

```cpp
//SW4
复制SW1命令即可
```

{% note blue 'fas fa-fan' flat %} ②命令 {% endnote %}

```cpp
//SW1
int eth-trunk 1	//创建 Eth-Trunk 1；数字可以随意起
port l trunk	//配置端口模式为Trunk
port trunk allow-pass vlan 100	//放行vlan 100即可，其他的通过 OSPF

int g0/0/21
eth-trunk 1	//加入到 Eth-Trunk 1 中

int g0/0/22
eth-trunk 1
```

```cpp
//SW2
复制SW1即可
```

{% note blue 'fas fa-fan' flat %} ③命令 {% endnote %}

- `SW1` 配置成 `根桥`，`SW3` 和 `SW4` 配置成边缘端口

```cpp
//SW1
stp mode rstp	//设置模式为rstp
stp priority 4096	//配置优先级
```

```cpp
//SW3
stp mode rstp
port-group 1	//进入端口组，如果是单独端口则直接进入那个端口即可
stp edged-port en	//配置成生成树边缘端口
```

```cpp
//SW4
复制SW3即可
```

{% note blue 'fas fa-fan' flat %} ④验证 {% endnote %}

- `dis port vlan` 命令查看端口VLAN配置信息（这里以SW1为例）

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220630205548.jpg)

- `dis eth-trunk` 命令查看 `聚合链路`端口状态（这里以SW1为例）

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220630205833.jpg)

- `dis stp` 命令查看STP配置状态信息（这里以SW3为例）

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220630210103.jpg)

- `dis stp brief` 命令查看STP实例的端口状态信息（这里以SW3为例）

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220630211225.jpg)

###  任务3-IP业务配置

{% note blue 'fas fa-fan' flat %} 任务3描述 {% endnote %}

<font color='gree'>①</font> 在 `SW 1,2,3,4`的  `vlanif` 接口  和 `R1` 端口上配置 `IP地址 `

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220630233548.png)

<font color='gree'>②</font> 在 `R2`（虚拟Internet设备）上配置 `IP地址`

<font color='gree'>③</font> 在 `SW1` 上对 `vlan 20` 启用 `DHCP` 功能配置客户端从IP地址池中获取IP地址

<font color='gree'>④</font> 输入相对应查看命令进行验证（可做可不做）

{% note blue 'fas fa-fan' flat %} ①命令 {% endnote %}

```cpp
//SW1
int vlanif 10
ip add 192.168.10.1 24

int vlanif 20
ip add 192.168.20.1 24
    
int vlanif 100
ip add 192.168.100.1 24
    
int vlanif 201
ip add 10.1.1.1 30
```

```cpp
//SW2
int vlanif 90
ip add 192.168.90.1 24
    
int vlanif 100
ip add 192.168.100.2 24
```

```cpp
//SW3
int vlanif 100
ip add 192.168.100.3 24
```

```cpp
//SW4
int vlanif 100
ip add 192.168.100.4 24
```

```cpp
//R1
sys
sysname R1
int g0/0/0
ip add 16.16.16.1 24
    
int g0/0/1
ip add 10.1.1.2 30
```

{% note blue 'fas fa-fan' flat %} ②命令 {% endnote %}

```cpp
//R2
sys
sysname R2
int g0/0/0
ip add 16.16.16.16 24
```

{% note blue 'fas fa-fan' flat %} ③命令 {% endnote %}

```cpp
//SW1
dhcp en	//开启DHCP功能
int vlanif 20
dhcp select int	//配置客户端从IP池获取IP地址
dhcp server dns-list 192.168.90.100	//配置客户端从DHCP服务器获取DNS地址
```

{% note blue 'fas fa-fan' flat %} ④验证 {% endnote %}

- `dis ip int brief` 命令查看IP地址配置是否生效（这里以SW1为例）

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220630215642.jpg)

- 在 `SW1` 上执行 `dis ip pool int vlanif20` 命令查看 vlanif20 接口的IP地址池信息

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220630215948.jpg)

###  任务4-路由配置

{% note blue 'fas fa-fan' flat %} 任务4描述 {% endnote %}

<font color='gree'>①</font> `R1，SW1,SW2` 上启动 `OSPF` 功能，并将对应网段加入 `OSPF Area 0` 中，路由器R1将默认路由通告到 OSPF 区域

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220630232111.jpg)

<font color='gree'>②</font> 在 `SW3,SW4` 上配置默认路由指向 `SW1`

<font color='gree'>③</font> 输入相对应查看命令进行验证（可做可不做）

{% note blue 'fas fa-fan' flat %} ①命令 {% endnote %}

```cpp
//R1
ospf 10	//创建OSPF 进程10
area 0	//区域0
network 10.1.1.0 0.0.0.3	//network 网段 反子网掩码
    
default-route-advertise always	//将默认路由通告到OSPF区域
```

- 全部改成网段形式

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220701000424.jpg)

```cpp
//SW1
ospf 10	//创建OSPF 进程10
area 0
network 192.168.10.0 0.0.0.255
network 192.168.20.0 0.0.0.255
network 192.168.100.0 0.0.0.255
network 10.1.1.0 0.0.0.3
```

```cpp
//SW2
ospf 10	//创建OSPF 进程10
area 0
network 192.168.90.0 0.0.0.255
network 192.168.100.0 0.0.0.255
```

{% note blue 'fas fa-fan' flat %} ②命令 {% endnote %}

```cpp
//SW3
ip route-static 0.0.0.0 0 192.168.100.1	//配置默认路由指向192.168.100.1
```

```cpp
//SW4
复制SW3即可
```

{% note blue 'fas fa-fan' flat %} ③验证 {% endnote %}

- `dis ip routing-table` 命令查看路由表信息（这里以SW2为例）

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220630234223.jpg)

###  任务5-出口配置

{% note blue 'fas fa-fan' flat %} 任务5描述 {% endnote %}

<font color='gree'>①</font> 在 `R1` 上配置 `NAT`，让内网用户可以访问Internet，`财务部，项目管理部，服务器群` 这3个网段

<font color='gree'>②</font> 输入相对应查看命令进行验证（可做可不做）

{% note blue 'fas fa-fan' flat %} ①命令 {% endnote %}

```cpp
//R1
acl 2000	//创建ACL，编号为2000
rule permit sourse 192.168.10.0 0.0.0.255	//配置规则，允许10.0网段通过
rule permit sourse 192.168.20.0 0.0.0.255	//配置规则，允许20.0网段通过
rule permit sourse 192.168.90.0 0.0.0.255	//配置规则，允许90.0网段通过
    
int g0/0/0
nat outbound 2000	//配置接口启用 Easy IP 方式的NAT
```

{% note blue 'fas fa-fan' flat %} ②验证 {% endnote %}

- `dis nat outbound` 命令查看NAT配置信息

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220630235254.jpg)
- 到这就已经实现全网互通了，可以去 `项目管理部` 输入 `ipconfig` 查看DNS生成的IP等相关信息（需要注意如果生成的DNS server是空白，需要输入 `ipconfig /release`释放租约，然后输入 `ipconfig /renew` 重新申请IP地址），然后可以尝试 `ping` 其他PC机或者路由等等。
![][4]

###  任务6-SSH服务配置

{% note blue 'fas fa-fan' flat %} 任务6描述 {% endnote %}

<font color='gree'>①</font> 所有交换机或者路由器配置SSH服务

<font color='gree'>②</font> 输入相对应查看命令进行验证（可做可不做）

{% note blue 'fas fa-fan' flat %} ①命令 {% endnote %}

```cpp
//SW1
rsa local-key-pair create	//创建秘钥
2048	//设置秘钥长度为2048
stelnet server en	//使能STelnet服务
user-interface vty 0 4	//进入VTY页面
authentication-mode aaa	//配置认证方式为AAA
protocol inbound ssh	//配置VTY用户界面支持SSH功能

ssh user admin	//创建SSH用户
ssh user admin authentication-type password	//配置admin用户认证类型为密码认证
ssh user admin service-type stelnet	//配置admin用户服务方式为STlnet
aaa	//进入AAA视图
local-user admin password cipher HwEdu12# $	//配置本地用户admin,密码为H..$
local-user admin service-type ssh	//配置本地用户admin的服务方式为SSH
local-user admin privilege level 15	//配置本地用户等级为15
```

```cpp
//SW2,SW3,SW4,R1
复制即可
```

{% note blue 'fas fa-fan' flat %} ②验证 {% endnote %}

- `dis ssh server status` 命令查看SSH状态信息（这里以SW1为例）

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220701002821.jpg)

- `dis ssh user-information` 命令查看SSH用户信息（这里以SW1为例）

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220701003032.jpg)


  
  [4]: https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96/QQ%E6%88%AA%E5%9B%BE20220701182227.png