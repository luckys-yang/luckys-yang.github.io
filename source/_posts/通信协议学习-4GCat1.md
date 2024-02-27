---
title: 通信协议学习-4GCat1
cover: /img/num166.webp
comments: false
katex: true
categories:
  - 细化学习
abbrlink: e06f6639
---

## 前言

{% note blue 'fas fa-fan' flat %}参考文章/博主{% endnote %}

[NB-IoT / 4G 连接腾讯云失败处理](https://bbs.csdn.net/topics/607147595)

## 4G Cat.1

### 硬件

{% tip bolt %}组成{% endtip %}

> 4G通信板

- CAT1模组： `SIMCom A7670C`
- 网络类型：支持 `中国移动、中国联通和中国电信` 的4G网络。电信 & 联通的物联网卡由于限制多，故需要实际测试，不保证100%支持
- 尺寸：46mm×38mm

> 4G超级天线

- 真实增益： `10dbi`
- 尺寸：17+2cm
- 接口类型： `SMA内针`
- 说明：华为路由器同款天线

> 定位天线

- GPS：支持
- 北斗：支持
- 增益： `38dbi`

> 物联网卡

- 中国移动物联网专用卡



{% tip bolt %}4G Cat.1通信板电路原理图{% endtip %}

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231205122602.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231205123313.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231205123754.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231205134551.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231205134616.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231205134638.webp)

{% endgallery %}



{% tip bolt %}串口通信与模块通信{% endtip %}

| 模块 | 单片机/USB转串口 |
| :--: | :--------------: |
|  5V  |        5V        |
| GND  |       GND        |
|  RX  |        TX        |
|  TX  |        RX        |

> 【只需要使用5v引脚和GND引脚给模块供电即可，不可用3v3引脚】
>
> 【没有标明引脚名称的引脚，一般不需要用到，可以忽略】
>
> 【对接完引脚之后，还需要做串口通信配置，例如串口通信波特率等，以及插入物联网卡】

{% tip bolt %}物联网卡{% endtip %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231205140058.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231205140105.webp)

- 默认配套：**中国移动**物联网卡
- 50M/月，可用3个月，满足测试需求

> 把卡插入开发板中，即会自动激活
>
> 根据国家工信部等部门要求，物联网卡一旦激活后，就**不能拔出来插入其它设备**，否则卡会锁定
>
> 物联网卡有多种类型，支持 4G Cat.1 网络的卡才可用于本模块

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231205142315.webp" style="zoom:50%;" />



### 模块测试

#### 简介

比较熟悉的无线通信技术包括 `WIFI、蓝牙、ZigBee` 等短距离无线通信技术、 `2G、3G、4G` 等移动蜂窝通信技术以及低功耗、广覆盖的 `LPWA技术（如NB-IoT，Lora）`等

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231205141237.webp)

 `Cat.X` 全称是 `LTE UE-Category` ，UE是 `用户设备（user equipment）`， `Category是分类、类别的意思`。所以Cat.X这个值主要用来 `衡量终端支持的传输速率的等级`，根据 `3GPP Release` 定义， `UE-Category` 被分为 `1-15` 共 `15` 个等级，其中 `Cat.1-5` 在R8组， `Cat.6-8` 在R10组， `Cat.9-10` 在R11组， `Cat.11-15` 在R12组。目前我们手机所使用的LTE网络主要指的是 `LTE Cat.4`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231205141805.webp)

相较于 `Cat.4` ， `Cat.1` 具备一定的成本优势，例如网络建设上，现在 `LTE Cat.1` 可以无缝接入现有LTE网络当中，无需针对基站进行软硬件的升级，网络覆盖成本很低。芯片成本上，经过系统优化后，集成度更高，模组的硬件架构更简单，外围硬件成本更低

相较于 `Cat.M2（NB-IoT）`， `Cat.1` 具备一定速率、时延和移动性方面的优势，拥有跟 `LTE Cat.4` 相同的毫秒级传输时延，以及支持100KM/H以上的移动速度



#### 模块常见指令测试

使用USB转串口进行接线(接4条线即可)，然后打开串口助手 `波特率115200,8,NONE,1`，等待模块的两颗指示灯依次亮起(一个常亮，一个闪烁)

> 【查询IMEI】
>
> IMEI的全称是International Mobile station Equipment Identity，即 `国际移动设备身份码`，用于标识每一个移动网络设备。每个4G Cat.1模块的IMEI都是不同的
>
> ```cpp
> 输入：AT+CGSN
> 返回：
>  
> 861817065314739
> 
> OK
> ```

> 【读取设备信息】
>
> - Manufacture：制造商
> - Model：模块型号
> - Revision：固件版本
> - IMEI：国际移动设备识别码
>
> ```cpp
> 输入：ATI
> 返回：   
>     
> Manufacturer: INCORPORATED
> Model: A7670C-MASL
> Revision: A7670M7_V1.11.1
> IMEI: 861817065314739
> +GCAP: +CGSM,+FCLASS,+DS
> 
> OK    
> ```

> 【读取ICCID】
>
> ICCID的全称是Integrate circuit card identity，也就是 `集成电路卡识别码`，是用来标识每一张SIM卡的，不同的SIM的ICCID是不同的
>
> ```cpp
> 输入：AT+CICCID
> 返回：
>  
> +ICCID: 89860487212180545068
> 
> OK    
> ```

> 【读取信号强度】
>
> 返回的第一个参数，即下面的31，表示信号强度，具体的定义如下：
>
> - `0`：-113dBm 或更低
> - `1`：-111dBm
> - `2~30`：-109dBm~-53dBm
> - `31`：-51dBm 或更高
> - `99`：未知或无法检测
>
> 其中的dBm为一种信号强度单位。通常 `dBm值越大，表示信号越好`
>
> ```cpp
> 输入：AT+CSQ
> 返回：
>     
> +CSQ: 31,99
> 
> OK    
> ```

> 【查询网络注册状态】
>
> 这个指令返回了两个参数，第1个参数暂时用不到，第2个参数说明如下：
>
> - `0`：未注册，但设备现在并不在搜寻新的运营商网络
> - `1`：已注册本地网络
> - `2`：未注册，设备正在搜寻基站
> - `4`：未知状态
> - `5`：已注册，但是处于漫游状态
>
> ```cpp
> 输入：AT+CEREG?
> 返回：
>   
> +CEREG: 0,1
> 
> OK    
> ```

> 【查询网络附着状态】
>
> 如果模块要用4G Cat.1 网络收发数据，需要首先附着到基站的网络中
>
> 其中的返回值说明如下：
>
> - `0`：未附着
> - `1`：已附着成功
>
> ```cpp
> 输入：AT+CGATT?
> 返回：
>     
> +CGATT: 1
> 
> OK    
> ```

> 【查询设备IP地址】
>
> 如果模块已经加入到互联网中就可以通过此指令获取模块的IP地址了
>
> 其中的 `10.90.37.63` 就是模块的IP地址了。有了IP地址，模块就可以跟各个云服务器通信了，例如腾讯云服务器、阿里云服务器或Onenet云服务器等
>
> ```cpp
> 输入：AT+CGPADDR
> 返回：
>  
> +CGPADDR: 1,10.90.37.63
> 
> OK    
> ```

> 【重启模块】
>
> 重启大概10S左右
>
> ```cpp
> 输入：AT+CRESET
> 返回：
>  
> *ATREADY: 1
> 
> +CPIN: READY
> 
> +CGEV: EPS PDN ACT 1
> 
> SMS DONE
> 
> PB DONE    
> ```

> 【打开网络】
>
> 返回下面表示打开成功
>
> ```cpp
> 输入：AT+NETOPEN
> 返回：
>  
> OK
> 
> +NETOPEN: 0    
> ```

> 【创建UDP链接】
>
> 返回下面表示UDP连接成功
>
> ```cpp
> 输入：AT+CIPOPEN=0,"UDP",,,12301
> 返回：
> 
> +CIPOPEN: 0,0
> 
> OK
> ```

> 【向远端发送数据】
>
> 输入完后接着串口调试助手中会出现一个尖括号，这样才能发送数据
>
> ```cpp
> 输入：AT+CIPSEND=0,13,"1.15.27.206",12301
> 返回：
> >    
> ```

> 【启动MQTT功能】
>
> ```cpp
> 输入：AT+CMQTTSTART
> 返回：
>  
> OK
> 
> +CMQTTSTART: 0    
> ```

> 【打开MQTT连接】
>
> ```cpp
> 输入：AT+CMQTTACCQ=0,"CAT1Module",0
> 返回：
>  
> OK    
> ```

> 【连接MQTT服务器】
>
> - `0`：连接序号，在某些情况下，可能会有多个 MQTT 连接，通过连接序号可以区分不同的连接
> - `"tcp://1.15.27.206:1883"`：MQTT 服务器的地址，使用 TCP 协议连接到 IP 地址为 1.15.27.206 的服务器，端口号为 1883
> - `60`：表示客户端在多长时间内没有向服务器发送数据时，服务器会认为客户端已经断开连接。单位一般是秒，所以这里表示客户端每 60 秒会向服务器发送一次心跳包以保持连接
> - `1`：这是 Clean Session 标志位，用于确定是否需要清除之前的会话信息。如果设为 1，表示建立一个新的会话；如果设为 0，则会继续之前的会话。这个标志位能够影响客户端与服务器之间的连接行为
>
> ```cpp
> 输入：AT+CMQTTCONNECT=0,"tcp://1.15.27.206:1883",60,1
> 返回：
>  
> OK    
> ```

> 【订阅主题且设置主题字符串长度】
>
> 回车后会出现一个尖括号
>
> ```cpp
> 输入：AT+CMQTTSUBTOPIC
> 返回：
> >        
> ```

> 【订阅主题】
>
> 在这之前需要先进行上面命令，然后输入待订阅主题名称(不能有回车，会返回OK)，再执行这个命令
>
> ```cpp
> 输入：AT+CMQTTSUB
> 返回：
> 
> OK
> 
> +CMQTTSUB: 0,0    
> ```









#### 登陆私有云端服务器

> 免费的私有云端服务：【远程服务器地址】： `1.15.27.206` 【端口号】： `22` 【用户名】： `lucker` 【密码】： `12345678`

- 使用PuTTY

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231205222851.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231205175817.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231205175841.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231205175902.webp)

{% endgallery %}

出现这个界面就表示成功登陆进去了：

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231205175924.webp" style="zoom:67%;" />

可以使用 `cat readme.txt` 命令来查看 `readme.txt` 的内容

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231205223728.webp)

- 使用xShell

用户名和密码跟上面一样

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206100357.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206100759.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206100916.webp)

{% endgallery %}







#### 使用UDP与私有云服务器通信

1. 串口波特率那些跟前面一样，先发送【 `AT` 】测试模块是否在线；再发送 【 `AT+CGPADDR` 】获取IP地址如果获取失败则到信号好的地方尝试，发送【 `AT+NETOPEN` 】打开网络
2. 使用登陆私有云的方法登录进去，然后输入命令运行 `udpserver` 服务：

```cpp
./udpserver
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231205225247.webp)

3. 串口助手输入命令，创建UDP链接

```cpp
AT+CIPOPEN=0,"UDP",,,12301
```

4. 串口助手输入命令，说明待发送的数据长度(长度13)，准备发送数据，发送成功会显示一个 `>` ，则可以发送数据

```cpp
AT+CIPSEND=0,13,"1.15.27.206",12301
```

5. 数据发送测试(不能有回车！)，发送完13个数据需要重新发送上面命令再发送数据才有效，重复操作

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231205231023.webp)

6. 关闭连接

```cpp
AT+QICLOSE=0
```

7. 在服务器的命令行中输入Ctrl+C组合键，退出UDP程序



#### 使用TCP与私有云服务器通信

1. 正常按照上面步骤【1】
2. 在 `xShell` 输入命令

```cpp
./tcpserver
```

3. 在串口助手输入

```bash
AT+NETOPEN	# 打开网络
    	
AT+CIPOPEN=0,"TCP","1.15.27.206",12300    # 建立TCP连接
```

4. 发送数据

```bash
AT+CIPSEND=0,13	# 数据长度是13，发送完这个命令出现>则可以开始发送数据

{"value":123}	# 发送数据测试，不要有回车
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206103050.webp)

5. 关闭连接

```cpp
AT+QICLOSE=0
```

6. 在服务器的命令行中输入Ctrl+C组合键，退出TCP程序



#### 使用MQTT与私有云服务器通信

> MQTT.fx需要秘钥才能用，可以去官网申请免费三个月

1. 实验环境搭建

- 下载MQTT.fx
- 启动MQTT服务，在xShell里输入命令

```bash
./killall
./mosquitto -v
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206114301.webp)

2. 使用MQTT.fx连接云服务器

点击【设置】，新建连接按下面的那样写

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206115040.webp)

3. 重复步骤1
4. 点击【Connect】按钮，连接MQTT服务，选择【Subscribe】选项卡，输入订阅的主题【“topic/pub”】，然后点击【Subscribe】按钮，至此，MQTT.fx已经成功订阅了【 “ topic/pub ”】 这个主题，接下来使用模块往这个主题发布消息，那么MQTT.fx就会接收到这个消息

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206120956.webp)

5. 使用模块连接云服务器

串口波特率那些跟前面一样，先发送【 `AT` 】测试模块是否在线；再发送 【 `AT+CGPADDR` 】获取IP地址如果获取失败则到信号好的地方尝试，然后发送下面指令

```bash
AT+CMQTTSTART	# 启动MQTT指令

AT+CMQTTACCQ=0,"CAT1Module",0	# 打开MQTT连接

AT+CMQTTCONNECT=0,"tcp://1.15.27.206:1883",60,1	# 连接MQTT服务器

AT+CMQTTSUBTOPIC=0,9,1	# 订阅主题且设置主题字符串长度(回车后会出现一个尖括号)

topic/sub	# 输入待订阅的主题(不能有回车)

AT+CMQTTSUB=0	# 订阅主题
```

6. MQTT.fx往MQTT主题发布消息

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206145512.webp)

串口助手接收到的消息

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206145600.webp)

在物联网领域中，许多设备采用这个方式来实现远程控制，例如：

- 使用手机App控制家里的空调开启
- 使用语音助手控制打开窗帘
- 使用手机App打开智能快递柜



7. 模块往MQTT主题发布消息(每发一次的消息步骤不能省略)

```bash
AT+CMQTTTOPIC=0,9	# 设置待发布的主题的字符串长度(回车后会出现一个尖括号)

topic/pub	# 输入主题(不能有回车)

AT+CMQTTPAYLOAD=0,13	# 设置要发送的数据长度(会出现一个尖括号)

{"value":123}	# 将要发送的消息(不需要回车)

AT+CMQTTPUB=0,1,60	# 向指定的主题发布消息
```

在MQTT.fx中可以查看接收到的消息：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206153756.webp)

在物联网领域中，许多设备采用这个方式来实现数据采集，例如：

- 采集环境温湿度数据，并上报到云端服务器
- 监测指定区域内是否发生火灾，并把监测结果上报到云端服务器

8. 退订主题

模块在订阅主题后，也可以退订这个主题，退订完毕，模块不会再收到往该主题发布消息了

```bash
AT+CMQTTUNSUB=0,9,1	# 设置需要退订的主题的长度(会出现一个尖括号)

topic/sub	# 输入待退订的主题(不需要回车)
```

9. 关闭MQTT功能

在不需要MQTT通信时，需要关闭MQTT功能

```bash
AT+CMQTTDISC=0,120	# 断开MQTT连接

AT+CMQTTREL=0	# 释放MQTT相关的资源

AT+CMQTTSTOP	# 关闭MQTT功能
```

在 Xshell 里【ctrl+c】可以退出MQTT程序

10. 使用MQTT手机客户端

> 苹果手机可以去下载一个 `MQTTTool`

1. 在 `Xshell` 里输入命令，开启MQTT服务

```bash
./killall

./mosquitto -v
```

2. 打开APP，输入 `Host`，`Port`，`Client Id` 内容，开启【Clean Session】，点击【Connect】，连接远程服务器成功后, `Connect` 按钮变成 `Disconnect`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206161629.webp)

点击 `Subscribe` 选项卡，切换到主题订阅页面并输入主题 `“topic/pub”`，然后点击 `Subscribe` 按钮，订阅主题成功后， `Subscribe` 按钮会变成 `Unsubscribe`，电脑端MQTT.fx或者模块 就可以向这个主题发送消息了

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206161659.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206164716.webp)

也可以向主题发布消息。选择Publish，然后输入以下信息：

然后点击 `Publish` 就可以实现了往 `topic/report` 发送 `yang5201314` 这个消息了

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206161722.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206164950.webp)



#### 获取经纬度

需要把线安装好，为了能够顺利获取经纬度，需要把定位天线头(那个黑色的东西)伸到有GPS信号的地方，否则获取不到经纬度

```bash
AT+CGNSSPWR=1	# 打开GPS功能(注意，在发送这个命令后，需要等待开发板返回“+CGNSSPWR：READY!”才可以进行下一步！！)

AT+CGNSSPORTSWITCH=0,1	# 让经纬度数据从串口输出

AT+CGNSSTST=1	# 启动串口经纬度数据输出功能(然后串口就会一直输出数据了)

# 其他---------------------
AT+CGNSSTST=0	# 关闭串口经纬度数据输出功能

AT+CGPSINFO	# 手动获取经纬度
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231213093249.webp)





{% tip bolt %}经纬度获取失败处理{% endtip %}

能看到这个界面，表示4G模块、定位天线大概率均无损坏，只是信号弱：

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206190459.webp" style="zoom:50%;" />

处理方法如下：

- 把定位天线伸到室外测试
- 把整个模块放置到空旷的户外测试，例如**空旷的公园**、**篮球场**等
- 在同一个场地中，测试10次或以上
- GPS/北斗信号**极容易**受到建筑物遮挡，故一般需要在**四面空旷**、**无建筑物遮挡**且信号良好的场地中测试



### 采集温湿度&定位到腾讯云

> 参考文章：https://zhuanlan.zhihu.com/p/510059768
>
> 官方文档：https://cloud.tencent.com/document/product/634/32546#.E5.92.8C.E6.A0.87.E5.87.86-mqtt-.E5.8C.BA.E5.88.AB

#### 系统搭建

- 新建项目，产品

登陆腾讯云，进入【物联网开发平台】，点击 `“管理控制台”` 链接进入控制台，有免费示例试用

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206194852.webp" style="zoom:50%;" />

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206195005.webp)

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206195130.webp" style="zoom: 67%;" />

- 物理模型配置

在物模型中找到并点击 `“新建自定义功能”` 链接

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206195224.webp" style="zoom:50%;" />

然后进行温度，湿度，经度，纬度的功能创建：

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206200501.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206200606.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206200752.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206200914.webp)

{% endgallery %}

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206201430.webp" style="zoom:67%;" />

系统会进入到设备开发页面，直接点击 `“下一步”` 链接

- 交互开发配置

在交互开发页面中打开 `“接入腾讯连连官方小程序”` 以及 `“使用通用版APP控制产品”` ，然后点击 `产品展示配置按钮`

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206201640.webp" style="zoom:67%;" />

按照提示输入产品信息，然后点击 `保存`

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206201918.webp" style="zoom: 67%;" />

点击面板配置按钮

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206202207.webp)

按照提示关闭用不到的显示组件，然后点击 `“保存”` 链接

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206202505.webp" style="zoom:67%;" />

点击智能联动配置按钮

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206202623.webp)

勾选环境温度，湿度，纬度，经度作为智能联动的条件，然后点击 `“保存”` 链接，然后直接 `下一步`

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206202744.webp" style="zoom:50%;" />

- 设备调试配置

在设备调试栏目中点击 `“新建设备”` 按钮，输入名称 `保存`

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206203101.webp" style="zoom:50%;" />

在刚创建的设备中，点击 `“二维码”` 链接，使用 `“腾讯连连”` 小程序扫描这个二维码，添加这个设备

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206203728.webp" style="zoom: 50%;" />

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206203801.webp" style="zoom:67%;" />

- 获取MQTT服务地址与端口

单击刚创建好的设备名称，把其中的产品ID复制出来，在产品ID后面加上 `“.iotcloud.tencentdevices.com”` 便得到MQTT服务器地址，例如我的是：

```bash
J7X2YMW6IU.iotcloud.tencentdevices.com
```

MQTT服务秘钥认证的默认端口为： `1883`，看[官方文档](https://cloud.tencent.com/document/product/634/32546#.E5.92.8C.E6.A0.87.E5.87.86-mqtt-.E5.8C.BA.E5.88.AB)

- 生成MQTT链接参数

分别把产品ID、设备名称和设备秘钥复制出来，找到 `“MQTT连接参数生成工具.html”`打开网页，然后选择好签名算法后点击 `Generate` 生成 `UersName` 和 `Password`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206205032.webp)

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206205155.webp" style="zoom: 50%;" />

```bash
产品ID: J7X2YMW6IU
设备名称: TH_Sensor_Test
设备秘钥: 3xTpgDpy9sFftkCViLU5WQ==
```



```bash
UserName: J7X2YMW6IUTH_Sensor_Test;12010126;0M3Y7;1992171084
Password: a88fc461af8202b6933524ec9b5c9d2fac226a35cbc09b9d4150a1d00000406f;hmacsha256
```



#### MQTT.fx测试(数据上传)

配置完点击 `Apply`，然后 `OK` ，然后点击连接即可，然后可以在平台上看到设备已在线，小程序设备也在线

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206210141.webp" style="zoom:67%;" />

- 获取主题

把其中的 `“${deviceName}”` 替换为在前续步骤中获取到的设备名称，替换后的主题如下：

```bash
$thing/up/property/J7X2YMW6IU/TH_Sensor_Test
```

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206210511.webp" style="zoom: 67%;" />

- 使用MQTT.fx发布主题（数据上报）

把获取到主题复制到主题输入框中，并且把以下代码字符串复制到发送框中，然后点击 `Publish` 按钮

```bash
{
	"method":"report",
	"params":{
	    "temp":23,
	    "humi":60,
	    "longitude":90,
	    "latitude":20
	}
}
# 参数里面"xxx" 是之前设置的标识符
# method：report 表示设备属性上报
# params：JSON 结构内为设备上报的属性值
```

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231206211139.webp" style="zoom:67%;" />





### 远程控制开关

> 参考文章：https://zhuanlan.zhihu.com/p/572593482



#### 系统搭建

在上面基础上添加即可

- 物理模型配置

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231213095543.webp" style="zoom:67%;" />

- 交互开发配置

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231213095912.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231213095938.webp)

- 获取主题

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231213100229.webp" style="zoom: 67%;" />

把其中的 `“${deviceName}”` 替换为在前续步骤中获取到的设备名称，替换后的主题如下：

```bash
$thing/down/property/J7X2YMW6IU/TH_Sensor_Test
```



#### MQTT.fx测试(数据下发)

在小程序里点击开关则MQTT.fx会接收到对应数据

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231213101217.webp" style="zoom:67%;" />

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231213101105.webp" style="zoom:67%;" />

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231213201530.webp" style="zoom:67%;" />