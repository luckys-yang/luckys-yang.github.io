---
title: MQTT学习笔记
cover: /img/num87.webp
comments: false
tags:
  - MQTT
categories:
  - 32系列
abbrlink: 7c8862c4
date: 2022-09-22 13:15:00
updated: 2022-09-22 17:57:31
---
##  介绍

 MQTT的全称为Message Queue Telemetry Transport（[消息队列](https://so.csdn.net/so/search?q=消息队列&spm=1001.2101.3001.7020)遥测传输协议），由IBM公司制定。是一种轻量级的、基于“发布/订阅”模式的消息传输协议。

MQTT协议是基于 TCP 的一个 `应用层` 协议

MQTT协议具有以下特性：

- 基于 TCP 协议的应用层协议；
- 采用 C/S 架构；
- 使用订阅/发布模式，将消息的发送方和接受方解耦；
- 提供 3 种消息的 `QoS`（Quality of Service）: 至多一次(可能会丢包)，最少一次(保证包到达，可能会出现重包)，只有一次(保证包会到达目的地，且不会出现重包)；
- 收发消息都是 `异步` 的，发送方不需要等待接收方应答。

{% note blue 'fas fa-fan' flat %} MQTT协议的通信模型 {% endnote %}

 MQTT的通信时通过 `发布/订阅` 的方式来实现，订阅和发布又是基于 `主题` (Topic)的。发布方和订阅方通过这种方式来进行解耦，没有直接地连接，需要一个中间方。在MQTT里，中间方称之为 `Broker`，用来进行 `消息的存储与转发`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/d1e53151a712484f89da7f277f4612c7.jpg)

1. `发布方(Publisher)连接到Broker`

2. `订阅方(Subscriber)连接到Broker，并订阅主题Topic1`

3. `发布方(Publisher)发送给Broker一条消息，主题为Topic1`

4. `Broker收到了发布方的消息，发现订阅方(Subscriber)订阅了Topic1,然后将消息转发给订阅方(Subscriber)`

5. `订阅方(Subscriber)从Broker接受该数据。`

 MQTT通过订阅与发布模型对消息的发布方和订阅方进行解耦后，发布方在发布消息时 `并不需要订阅方也连接到Broker`，只要订阅方之前订阅过相应主题，那么 `它在连接到Broker之后就可以收到发布方在它离线期间发布的消息`。我们可以称这种消息为 `离线消息`。

​      根据上述描述，这里可以做个简单的总结。比如现在有两个具有联网功能的MCU，这俩就是 `客户端`。然后在远程服务器上搭建一个MQTT服务器，那这个MQTT服务器就是 `Broker`。现在 `MCU_A对Broker进行订阅Topic`，化身为 `Subscriber`。 `MCU_B连接MQTT服务器后，向Topic进行发布消息`，化身为 `Publisher`。这样MCU_A就会收到MCU_B发布过来的消息。这时候MCU_A关机了，MCU_B又发布了消息，此时MCU_A肯定是接收不到消息的，因为关机了。此时MCU_B赌气，也关机了。那整个网络中就只剩下Broker了。此时，MCU_A开机，因为之前订阅过了Topic，那Broker检测到MCU_A上线后，就会推送消息给A。这样 `即使MCU_B不在线，MCU_A也能收到B的离线消息` 。这个消息是缓存在Broker中。以上过程中，A是订阅者，B是发布者。那这时候如果B也订阅Topic呢？那B即是发布者，也是订阅者。




##  名词解释

`Publisher和Subscriber`：Publisher和Subscriber是相对于Topic来说的。如果一个Client向某个Topic发布消息，那么这个Client就是Publisher。如果一个Client订阅了某个Topic，那么它就是Subscriber。换句话来说的话，<span style="color:# e80daf">一个Client即可以是发布者，也可以是订阅者</span>

`Broker`：MQTT的Broker负责接受发布者的消息，并发送给相应的订阅者，是整个MQTT订阅发布的核心。一般情况下，<span style="color:# e80daf">Broker都是服务器</span>

`Client和Server`：客户端可以是任何终端设备，而服务端大部分情况下都是Broker。

`Topic`：Topic是UTF-8字符串，可以理解为消息的类型，订阅者订阅（Subscribe）后，就会收到该主题的消息内容

`Topic类`：同一产品下不同设备的Topic集合，用 `${productkey}和${deviceName}`通配一个唯一的设备，一个Topic类对一个ProductKey下所有设备通用

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220922142009.jpg)

1. 产品的Topic类不用于通信，只用来定义Topic,真正用来消息通信的是Topic，Topic和Topic类的格式一致，区别在于，Topic类中的变量<span style="color:# e80daf">${deviceName}</span>，
2. 在Topic中是具体的设备名称，设备对应的Topic是从产品对应的Topic类中映射出来，根据设备名称而动态创建的。设备的Topic中带有设备名称即DeviceName，只能被该设备用来Pub和Sub通信
3. 在配置规则引擎时，配置的Topic中可使用<span style="color:# e80daf">通配符</span>，且同一个类中只能出现一个通配符

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/20180804170202185.jpg)

还有一些使用限制详见[文档](https://help.aliyun.com/document_detail/30527.htm?spm=a2c4g.11186623.0.0.12df6401VcVSvX# section-mmp-bdv-4fb)



`payload`：可以理解为消息的内容，是指订阅者具体要使用的内容

`网关`：能够直接连接物联网平台的设备，且具有子设备管理功能，能够代理子设备连接云端

`子设备`：子设备不能直接连接物联网平台，只能通过网关连接

`三元组`： 

- <span style="color:# e80daf">PublicKey</span>：物联网平台为产品颁发的唯一标识，在设备通信及认证中都要用到，需妥善保管。
- <span style="color:# e80daf">DeviceName</span>：在注册设备时，自定义的或者自动生成的设备名称，在通信及认证中都要用到，需妥善保管。
      
- <span style="color:# e80daf">DeviceSecret</span>：物联网平台为设备颁发的设备秘钥，和DeviceName成对出现，在设备认证时会用，需妥善保管

`属性`：设备的功能模型之一，一般用于描述设备运行时的状态，如环境监测设备所读取的环境温度等，属性支持<span style="color:# e80daf">GET和SET</span>两种请求方式，应用系统可发起对属性的读取或设置请求

`服务`：设备的功能模型之一，设备可被外部调用的能力或者方法，可设置输入参数或输出参数。相比属性，服务可用一条指令实现更复杂的业务逻辑，如执行某项特定的任务

`事件`：设备的功能模型之一，设备运行时的事件，事件一般包含需要被外部感知和处理的通知消息，可包含多个输出参数。如。某项任务完成的信息，设备发生故障报警时的问题等，事件可以被订阅和推送

`设备影子`：是一个JSON文档，用于存储设备或者应用的当前状态信息。每个设备都会在云端有唯一的设备影子对应，无论设备有没有连接到Internet，都可以使用设备影子通过MQTT或者HTTP获取或者设置设备的状态

`QoS`：可靠传输保证；有三种消息发布服务质量

1. <span style="color:# e80daf">QoS0</span>："至多一次"，消息发布完全依赖底层TCP/IP网络。会发生消息丢失或重复
2. <span style="color:# e80daf">QoS1</span>："至少一次"，确保消息到达，但消息重复可能会发生
3. <span style="color:# e80daf">QoS2</span>："只有一次"，确保消息到达一次，为此，带有唯一消息 ID 的消息会存储两次，首先来自发送者，然后是接收者。QoS 级别 2 在网络中具有最高的开销，因为在发送方和接收方之间需要两个流

##  连接与断开

{% note blue 'fas fa-fan' flat %} MQTT连接过程 {% endnote %}

-  Client(客户端)建立到Broker的连接过程如下：

1. Client发送connect数据包给Broker
2. Broker在收到connect数据包后，给Client返回一个connACK数据包

`connect数据包`：客户端标识符(Client identifier 唯一的)、用户名(Username)、密码(Password)、遗愿主题(will topic)，当client非正常地中断连接时，Broker将会向制定的遗愿主题中发布遗愿消息、遗愿消息(will message)

` connACK数据包`：连接返回码(Connect Return code)用于标识连接是否建立成功。 `0标识成功`

{% note blue 'fas fa-fan' flat %} MQTT断开过程 {% endnote %}

- Client 主动关闭连接

 client主动关闭连接只需要向Broker发送一个 `Disconnect` 数据包就可以了。<span style="color:# e80daf">发送完后，就可以关闭底层的TCP连接了，不需要等待Broker的回复</span>(Broker也不会对Disconnect数据包进行回复)。

<span style="color:green">问</span>： 为什么Client关闭TCP连接之前，要发送一个和Broker没有交互的数据包，而不是关闭底层的TCP连接？<span style="color:red">答</span>：因为涉及到MQTT协议的一个特性。在MQTT协议中，Broker需要判断Client是否是正常的断开连接。当Broker收到Client的Disconnect数据包的时候，Broker则认为Client是 `正常断开`，那么会丢弃当前连接指定的遗愿消息。如果Broker检测到Client连接丢失，但是又没有收到Disconnect数据包，则认为Client是 `非正常断开`的，就会向在连接的时候指定的遗愿主题发布遗愿消息。

- Broker主动关闭连接

 MQTT协议规定Broker在没有收到Client的DISCONNECT数据包之前都应该和Client保持连接。只有当Broker 在连接保活(Keep Alive)的时间间隔内，没有收到Client的任何MQTT数据包的时候会主动关闭连接。一些Broker的实现在MQTT协议上做了一些拓展，支持Client的连接管理，可以主动和某个Client断开连接。

<span style="color:red">注意</span>： Broker主动关闭连接之前不会向Client发送任何MQTT数据包，而是直接关闭底层的TCP连接

{% note blue 'fas fa-fan' flat %} 连接保活(Keep alive) {% endnote %}

Broker需要知道Client是否正常地断开了和它的连接，以发出遗愿消息。实际上Client也需要能够很快的检测它失去了和Broker的连接，以便重新连接。虽然TCP协议在丢失连接时会通知上层应用，但是TCP有一个半打开连接的问题(half-open connection)，在这种状态下，一端的TCP连接已经失效，但是另外一端并不知情，它认为连接依然是打开的，它需要很长时间才能感知到对端已经连接断开了，这种情况在使用移动或卫星网络的时候尤为常见。所以仅仅依赖TCP的连接状态是不够的，于是MQTT协议设计了一套Keep alive机制。

 在建立连接的时候，我们可以传递一个 `Keep alive参数，它的单位是秒`。MQTT协议中规定： `在1.5倍的Keep alive的时间间隔内，如果Broker没有收到来自Client的任何数据包，那么Broker认为它和Client之间的连接已经断开；同样如果Client没有收到来自Broker的任何数据包，那么Client认为它和Broker之间的连接已经断开。`在Broker和Client之间没有任何数据包传输的时候，MQTT中通过 `PINGREQ/PINGRESP` 来满足Keep alive的约定和侦测连接状态。 

` PINGREQ数据包`：当Client在一个Keep alive时间间隔内没有向Broker发送任何数据包，比如Publish和Subscribe的时候，它应该向Broker发送PINGREQ数据包。

`PINGRESP数据包`：收到PINGREQ数据包后，会回复一个PINGRESP数据包

{% note red 'fas fa-fan' flat %} 对于Keep alive机制，还需要注意以下几点 {% endnote %}

- `如果在一个Keep Alive时间间隔内，Client和Broker有过数据包传输，比如PUBLISH数据包，Client就没有必要再使用PINGREQ了；`
- `Keep Alive值是由Client指定，不同的Client可以指定不同的值；`
- `Keep Alive的最大值为18小时12分15秒即65535秒；`
- `Keep Alive的值设为0的话，代表不使用Keep Alive机制`



##  订阅和发布

{% note blue 'fas fa-fan' flat %} 订阅 {% endnote %}

1. Client向Broker发送一个Subscriber数据包，该数据包中含有Client想要订阅的主题和其他一些参数。

2. Broker收到Subscribe数据包后，向Client发送一个SubACK数据包作为应答。

`Subscribe数据包`：数据包标识(Packet identifier)两个字节(唯一)、订阅列表(List of Subscriptions)包含Client想要订阅的主题列表，列表中的每项由订阅主题名和对应的QoS组成。

`SubACK数据包`：数据包标识(Packet identifier)两个字节(唯一)、返回码(return codes)包含一组返回码，返回码的数量和顺序和Subscribe数据包的订阅列表对应，用于标识订阅类别中的每一个订阅项的订阅结果。

{% note blue 'fas fa-fan' flat %} 取消订阅 {% endnote %}

1. Subscriber向Broker发送一个Unsubscribe数据包，该数据包包含想要取消订阅的主题。

2. Broker收到Unsubscribe数据包之后，向Subscirber发送一个UnsubACK数据包作为应答。

`Unsubscribe数据包`：数据包标识(Packet identifier)两个字节(唯一)、主题列表(List of Topics)包含Client想要取消订阅的主题过滤器列表。

`UnsubACK数据包`：数据包标识(Packet identifier)两个字节(唯一)

{% note blue 'fas fa-fan' flat %} 发布{% endnote %}

MQTT发布中最重要的是 `Publish数据包`，Publish数据包是用于发送方和接收方之间传输消息的。当Publisher要向某个Topic发布一条消息时，Publisher会向Broker发送一个Publish数据包。当Broker要将一条消息转发给订阅了某条主题的Subscriber时，Broker也会向该Subscriber发送一个Publish数据包。接收方会根据数据包中的QoS决定应答，当QoS（Quality of Service）为0时，接收方不做任何应答。

`Publish数据包`：<span style="color:# e80daf">消息重复标识(DUP flag)</span>：当DUP flag=1时，代表该消息是一条重发消息，因接收方没有确认收到之前的消息而重发的(只有在QoS大于0的消息中使用)、<span style="color:# e80daf">QoS、Retain标识</span>：当被设置为1时，Broker应该保存该条消息，当之后有任何新的Subscriber订阅Publish消息中指定的主题时，都会先收到该条消息，这种消息也叫Retained消息、<span style="color:# e80daf">数据包标识(Packet identifier)两个字节(唯一)</span>、<span style="color:# e80daf">主题名称(Topic Name)</span>：该消息发布到哪个主题。

##  MQTT协议数据包结构

在MQTT协议中，一个MQTT数据包由三部分组成： 

- `固定头（Fixed header）`：存在于所有MQTT数据包中，表示数据包类型及数据包的分组类标识
- `可变头（Variable header）`：存在于部分`MQTT`数据包中，数据包类型决定了可变头是否存在及其具体内容
- `消息体（payload）`：存在于部分`MQTT`数据包中，表示客户端收到的具体内容

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220922154812.jpg)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/bead03d52096eca7366e94c5dc43ca29.jpg)

`CONNECT报文` 有且只有一个，并且是客户端到服务端 建立连接 后的第一个报文， `服务端必须将客户端发送的第二个CONNECT报文当作协议违规处理并断开客户端的连接`

{% note blue 'fas fa-fan' flat %} MQTT固定头 分析{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/1aee540639d1b9348ec28952fa4416b3.jpg)

`Byte1,bits7~4`：4位无符号值，类型如下

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/139bda1041be4c05b97bc25ea7a919a8.jpg)

`Byte1,bits3~0`：首字节的低4位(bit3~bit0)用来表示某些报文类型的控制字段，实际上只有少数报文类型有控制位

`bits[3]`为DUP字段，如果值为1，表明这个数据包是一条重复的消息；否则该数据包就是第一次发布的消息

`bit[2],bit[1]`为QoS字段，如果<span style="color:# e80daf">bits[1]和bits[2]都为0，表示Qos 0(至多一次)</span>；如果<span style="color:# e80daf">bit[1]为1，表示Qos 1(至少一次)</span>；如果<span style="color:# e80daf">bits[2]为1，表示Qos 2(只有一次)</span>；如果<span style="color:# e80daf">同时将bits[1] 和 bits[2] 设置为1，那么客户端或服务器认为这是一条非法的消息，会关闭当前连接</span>

<span style="color:red">注</span>：目前bits[3~0]只在PUBLISH协议中使用有效，并且表中指明了是 `MQTT 3.1.1版本`。对于其它MQTT协议版本，内容可能不同。所有固定头标记为"保留"的协议类型，bits[3~0]必须保持与表中保持一致，如SUBSCRIBE协议，其bits[1]必须为 1 。如果接收方接收到非法的消息，会强行关闭当前连接。

`bits[0]`为RETAIN字段，发布保留标识，表示服务器要保留这次推送的信息，如果有新的订阅者出现，就把这消息推送给它，如果设有那么推送至当前订阅者后释放

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/08d3eb37300d4b57b5700988ec1bd58e.jpg)

`剩余长度（Remaining Length）`：固定头的第二字节用来保存变长头部和消息体的总大小的，但不是直接保存的。这一字节是可以扩展，其保存机制，前7位用于保存长度，后一部用做标识。当最后一位为 1时，表示长度不足，需要使用二个字节继续保存

{% note blue 'fas fa-fan' flat %} MQTT可变头 分析{% endnote %}

按顺序包含四个字段：

- 协议名（Protocol Name）
- 协议级别（Protocol Level）
- 连接标志（Connect Flags）
- 连接保活（Keep Alive）

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/4bd8f68090344369ba8889b09be8a530.jpg)

`协议名`：表示协议名 "MQTT" 的UTF-8编码的字符串。MQTT规范的后续版本不会改变这个字符串的偏移和长度

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220922163723.jpg)

`协议级别`：为无符号值表示客户端的版本等级。<span style="color:# e80daf">3.1.1版本的协议等级是 4 ，MQTT v5.0的协议版本字段为 5 （0x05）</span>

`连接标志`：包含一些用于指定MQTT连接行为的参数。它还指出playload字段是否存在

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220922165455.jpg)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220922165823.jpg)

```bash
# 字段详解

# MQTT会话(Clean Session)：
MQTT客户端向服务器发起CONNECT请求时，可以通过’Clean Session’标志设置会话。
‘Clean Session’设置为 0 ，表示创建一个持久会话，在客户端断开连接时，会话仍然保持并保存离线消
息，直到会话超时注销。
‘Clean Session’设置为 1 ，表示创建一个新的临时会话，在客户端断开时，会话自动销毁。
# Will Flag/Will Qos/Will Retain ：
Will Flag设置为 1表示如果连接请求被接受，服务端必须存储一个Will Message，并和网络连接关联起来。之后在网络连接断开的时候必须发布Will Message，除非服务端收到DISCONNECT包删掉了Will Message

Will Message会在某些情况下发布，包括但不限于：
1.服务端发现I/O错误或网络失败。
2.客户端在Keep Alive时间内通信失败。
3.客户端没有发送DISCONNECT包就关闭了网络连接。
4.服务端因协议错误关闭了网络连接。

如果Will Flag被设置为 1 ，连接标识中的Will QoS和Will Retain字段将会被服务端用到
Will QoS这两个bits表示发布Will Message时使用QoS的等级
Will Retain这个bit表示Will Message在发布之后是否需要保留

如果Will Flag设置为 0 ，那么Will Retain必须是 0
如果Will Flag设置为 1 ：
如果Will Retain设置为 0 ，那么服务端必须发布Will Message，不必保存
如果Will Retain设置为 1 ，那么服务端必须发布Will Message，并保存

# User Name Flag：
User Name Flag设置为 0 则用户名不必出现在载荷中；设置为 1 则必须出现在载荷中

# Password Flag
Password Flag设置为 0 则密码不必出现在载荷中；设置为 1 则必须出现在载荷中；如果 User Name Flag设置为 0 ，那么Password Flag必须设置为 0 
```

`连接保活`：

1. Keep Alive是以 `秒` 为单位的时间间隔。用 `2` 字节表示，它指的是 `客户端从发送完成一个控制包到开始发送下一个的最大时间间隔`
2. 客户端有责任 `确保两个控制包发送的间隔不能超过Keep Alive的值。如果没有其他控制包可发，客户端必须发送PINGREQ包`
3. 客户端可以在任何时间发送PINGREQ包，不用关心Keep Alive的值， `用PINGRESP来判断与服务端的网络连接是否正常。`
4. 如果Keep Alive的值 `非 0 `，而且服务端在 `一个半Keep Alive的周期 `内没有收到客户端的控制包，服务端必须作为网络故障 `断开网络连接`
5. 如果客户端在发送了PINGREQ后，在一个合理的时间都 `没有收到PINGRESP包`，客户端应该关闭和服务端的网络连接
6. Keep Alive的值 `为 0` ，就关闭了维持的机制。这意味着， `客户端不断开连接`

<span style="color:red">备注</span>：不管保持连接的值是多少，任何时候，只要服务端认为客户端是不活跃或无响应的，可以断开客户端的连接

```bash
# 心跳的作用
PINGREQ包从客户端发往服务端，可以用来：
1 ：在没有其他控制包从客户端发送给服务端的时候，告知服务端客户端的存活状态。
2 ：请求服务端响应，来确认服务端是否存活。
3 ：确认网络连接的有效性。
PINGRESP包从服务端发送给客户端来响应PINGREQ包。它代表服务端是存活的。
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220922172007.jpg)

<span style="color:red">备注</span>：

1. 有效负载（playload）字段的存在与否并不是 Reserved字段来指定，而是 `will flag、user Name`等字段。比如：如果will flag为1，则负载中需要包含will tpoic、will message等字段。如果需要用户名密码，则负载中需要包含这些信息。
2. 服务端必须验证CONNECT控制报文的保留标志位（第0位Reserved）是否为0， `如果不为0必须断开客户端连接`

{% note blue 'fas fa-fan' flat %} MQTT消息体(Payload)分析 {% endnote %}

有些报文类型是包含 `Payload` 的，Payload意思是消息载体的意思，如 PUBLISH 的Payload就是指消息内容（应用程序发布的消息内容）。而CONNECT的Payload则包含 `ClientIdentifier，Will Topic，Will Message，Username，Password` 等信息。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220922174305.jpg)

##  遗言机制

因为MQTT会运行在网络不好的环境中。可以合理的假设，在这些环境中，客户端偶尔会不正常的断开连接。原因包括连接丢失，电量为空等等。了解客户端是正常断连(发送了DISCONNECT消息)还是非正常断连(没有发送DISCONNECT消息)，这对你正确做出响应有帮助。遗言特性为客户端对非正常断连做出响应提供了合适的途径。

在MQTT中，你可以使用遗言去通知其它设备有一个设备异常断连了。每一个客户端在它连接代理的时候都能定义它的遗言。遗言是一个包含主题，保留信息标志，QoS，和负载的普通消息。代理会一直存储该消息，直到该客户端异常断连。面对异常断连，代理会发送遗言给所有订阅了该遗言的主题的客户端。但是如果一个客户端是通过发送DISCONNECT消息正常断连的,代理会丢弃存储的遗言。

```bash
# 代理什么时候发送遗言?
# 根据MQTT3.1.1的标准，代理在以下情形下必须发送遗言：
1.服务端发现I/O错误或网络失败。
2.客户端在Keep Alive时间内通信失败。
3.客户端没有发送DISCONNECT包就关闭了网络连接。
4.服务端因协议错误关闭了网络连接。
```

MQTT客户端向服务器端CONNECT请求时，可以设置是否发送 `遗愿消息(Will Message)标志，和遗愿消
息主题(Topic)与内容(Payload)。`