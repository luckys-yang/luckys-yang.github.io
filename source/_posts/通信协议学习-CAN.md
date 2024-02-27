---
title: 通信协议学习-CAN
cover: /img/num170.webp
comments: false
katex: true
categories:
  - 细化学习
abbrlink: 3132f4c8
---

## 前言

{% note blue 'fas fa-fan' flat %}参考文章/博主{% endnote %}



## CAN

参考手册：can入门教程

[CAN波特率计算](http://www.bittiming.can-wiki.info/#bxCAN)

### CAN基础详解

{% tip bolt %}介绍{% endtip %}

CAN 是控制器局域网络（Controller Area Network） 的缩写，是 ISO 国际标准化的 `串行通信` 协议，为了满足汽车产业的 "减少线束的数量"，"通过多个LAN，进行大量数据的高速通信"的需求

> ISO发布CAN标准 `ISO11898(高速CAN)` 以及 `ISO11519(低速CAN)`
>
> `低速CAN`：通信速率10~125Kbps，总线长度可达1000米
>
> `高速CAN(经典CAN)`：通信速率125Kbps~1Mbps，总线长度<=40米
>
> `CAN FD`：通信速率可达5Mbps，并且兼容经典CAN，遵循ISO 11898-1 做数据收发



{% tip bolt %}CAN总线拓扑{% endtip %}

`终端电阻`：用于阻抗匹配，以减少回波反射

- 闭环总线网络

总线的两端各要求有一个 `“120 欧”` 的电阻，允许挂载多个设备节点(一般最大30个)

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231102145117.webp" style="zoom:67%;" />

- 开环总线网络

两根总线是独立的、不形成闭环，要求每根总线上各串联有一个 `“2.2千欧”` 的电阻，允许挂载多个设备节点(一般最大20个)

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231102145149.webp" style="zoom:67%;" />



{% tip bolt %}特点{% endtip %}

`(1) 多主控制`

在总线空闲时，所有的单元都可开始发送消息（多主控制），最先访问总线的单元可获得发送权（CSMA/CA 方式），多个单元同时开始发送时，发送高优先级 ID 消息的单元可获得发送权

`(2) 消息的发送`

在 CAN 协议中，所有的消息都以固定的格式发送。总线空闲时，所有与总线相连的单元都可以开始发送新消息。两个以上的单元同时开始发送消息时，根据标识符（Identifier 以下称为 ID）决定优先级。ID 并不是表示发送的目的地址，而是表示访问总线的消息的优先级。两个以上的单元同时开始发送消息时，对各消息 ID 的每个位进行逐个仲裁比较。仲裁获胜（被判定为优先级最高）的单元可继续发送消息，仲裁失利的单元则立刻停止发送而进行接收工作

`(3) 系统的柔软性`

与总线相连的单元没有类似于“地址”的信息。因此在总线上增加单元时，连接在总线上的其它单元的软硬件及应用层都不需要改变

`(4) 通信速度`

根据整个网络的规模，可设定适合的通信速度，在同一网络中，所有单元必须设定成统一的通信速度，即使有一个单元的通信速度与其它的不一样，此单元也会输出错误信号，妨碍整个网络的通信，不同网络间则可以有不同的通信速度

`(5) 远程数据请求`

可通过发送“遥控帧” 请求其他单元发送数据

`(6) 错误检测功能·错误通知功能·错误恢复功能`

所有的单元都可以检测错误（错误检测功能），检测出错误的单元会立即同时通知其他所有单元（错误通知功能），正在发送消息的单元一旦检测出错误，会强制结束当前的发送。强制结束发送的单元会不断反复地重新发送此消息直到成功发送为止（错误恢复功能）

`(7) 故障封闭`

CAN 可以判断出错误的类型是总线上暂时的数据错误（如外部噪声等）还是持续的数据错误（如单元内部故障、驱动器故障、断线等）。由此功能，当总线上发生持续数据错误时，可将引起此故障的单元从总线上隔离出去

`(8) 连接`

CAN 总线是可同时连接多个单元的总线。可连接的单元总数理论上是没有限制的。但实际上可连接的单元数受总线上的时间延迟及电气负载的限制。降低通信速度，可连接的单元数增加；提高通信速度，则可连接的单元数减少



{% tip bolt %}CAN物理层{% endtip %}

CAN 通讯并不是以时钟信号来进行同步的，它是一种 `异步` 通讯，只具有 `CAN_H` 和  `CAN_L` 两条信号线，共同构成一组差分信号线，以 `差分信号` 的形式进行通讯 ( `根据CAN_H和CAN_L上的电位差来判断总线电平`)

总线电平分为 `显性电平(逻辑0)` 和 `隐性电平(逻辑1)`，而且必须处于这两个其中一个状态

`显性电平具有优先权`，发送方通过使总线电平发送变化，将消息发送给接收方

`CAN 协议` 中对它使用的 `CAN_H` 及 `CAN_L` 表示的差分信号做了规定：

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231102151527.webp" style="zoom:67%;" />

以高速 CAN 协议为例，当表示 `逻辑 1 时(隐性电平)`， `CAN_H` 和 `CAN_L` 线上的电压均为 `2.5v`，即它们的电压差为 `VH - VL = 0V`；而表示 `逻辑 0 时(显性电平)`， `CAN_H` 的电平为  `3.5V`， `CAN_L` 线的电平为 `1.5V`，即它们的电压差为 `VH - VL = 2V`

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231102152431.webp" style="zoom:67%;" />



- CAN 控制器

一般单片机自带，如STM32的 bxCAN



- CAN收发器芯片

`TJA1050`， `TJA11042`， `SIT1050T` 等等

> TJA1050

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231102160058.webp)

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231102160017.webp" style="zoom:67%;" />

> TJA1040T

`TJA1040T` 芯片负责将单片机的TTL逻辑电平转换为CAN总线的通讯电平，芯片的TXD引脚接到单片机的CAN_TX引脚，RXD引脚接到单片机的CAN_RX引脚，STB引脚可接单片机的一个普通IO口，TJA1040T芯片就是CAN收发器，单片机内部的CAN外设就是CAN控制器

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230522151110.webp)





{% tip bolt %}CAN协议层{% endtip %}

CAN总线以 `帧` 形式进行通信。CAN协议定义了5种类型的帧：`数据帧`，`遥控帧`，`错误帧`，`过载帧`，`过载帧`，`间隔帧`，其中数据帧最为常用

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231102161941.webp)

> 数据帧

数据帧由 `7` 段组成，数据帧又分 `标准帧(CAN2.0A)` 和 `扩展帧(CAN2.0B)`，主要体现在仲裁帧和控制帧

`数据帧发送的是接收方的ID，遥控帧因为要要求别人发送信息过来，所以发送的是发送方的ID`

数据帧的构成主要由 `帧起始、仲裁段、控制段、数据段、CRC段、ACK段和帧结束` 组成，这里 `0~64Bit` 也就是 `8` 个字节

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231104230203.webp" style="zoom:67%;" />

- 帧起始

`SOF`，一开始总线上是隐性电平，为 `逻辑1`，当电平由隐性变为显性，即由 `1变为0`，则表示帧起始

- 仲裁段

`ID`，表示该帧优先级的段，优先级，也叫标识符位， `11` 位

`RTR` 表示远程发送请求位， `0数据帧，1遥控帧`

扩展数据帧的话 `ID` 部分一样，而且还增加了 `18` 位扩展ID，也就是仲裁段的 `ID` 位数是 `29`位。后面的 `SRR` 其实就是代替标准帧的 `RTR`

{% note simple %}

那怎么分辨哪个是标准帧哪个是扩展帧？比如扩展帧 `0x1800F001`

扩展格式中 `ID0~ID17` 为扩展ID，而 `ID18~ID28` 为 `基本ID`:

$\text{二进制：0001 1000 0000 0000   1111 0000 0000 0001}$

$\text{红色部分为扩展ID，蓝色部分为基本ID：}$

$000\textcolor{red}{[1\ 1000\ 0000\ 00]}\textcolor{blue}{[00\    1111\ 0000\ 0000\ 0001]}$

{% endnote %}

{% note simple %}

标准ID一般 `<=0x7FF(11位)`，只包含基本ID

对于扩展CAN的 `低18位为扩展ID`， `高11位为基本ID`

{% endnote %}

- 控制段

表示数据的字节数及保留位的段

`IDE` 用于区分 `标准格式` 与 `扩展格式`，当它为 `显性电平时(0)` 表示标准格式， `隐性电平时(1)`表示扩展格式

`DLC` 是数据长度编码位，决定了数据段的长度

`R0，R1` 为保留位，默认设置为 `显性位(0)`

- 数据段

数据的内容，一帧可以发 `0~64 bit`，也就是 `0~8 Byte` 的数据量

- CRC段

检查帧的传输错误的段

`CRC` 部分的计算一般由 `CAN 控制器` 硬件完成，出错时的处理则由 `软件` 控制最大重发数

`DEL` 是一个界定符，它为 `隐性位(1)`，主要作用是把 `CRC` 校验码与后面的 `ACK` 段间隔起来

- ACK段

ACK 段包括一个 ACK 槽位，和 ACK 界定符位，类似IIC的应答信号，在 ACK 槽位中，发送节点发送的是  `隐性位(1)`，而接收节点则在这一位中发送 `显性位(0)` 以示应答，在 ACK 槽和帧结束之间由 ACK 界定符间隔开

- 帧结束

帧结束段由发送节点发送的 `7` 个 `隐性位(1)` 表示结束

> CAN位时序介绍

CAN总线以 "位同步" 机制，实现对电平的正确采样。位数据都由四段组成：`同步段(SS)`， `传播时间段(PTS)`，`相位缓冲段1(PBS1)` 和 `相位缓冲段2(PBS2)`，每段又由多个位时序 `Tq(最小时间单位)` 组成

`1` 位由多少个 `Tq` 构成、每个段又由多少个 `Tq` 构成等，可以任意设定位时序。通过设定位时序，多个单元可同时采样，也可任意设定采样点

根据位时序就可以计算出CAN通信的波特率

限定了 `SWJ` 值后，再同步时，不能增加限定长度的 `SJW` 值。 `SWJ` 值较大时，吸收误差能力更强，但是通讯速度会下降，采样点一般设置在电平变化后的 `50% ~ 80%` 的区间，这个区间采集的电平就比较稳定

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230522190732.webp" style="zoom: 50%;" />

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231103164256.webp" style="zoom:67%;" />



> 数据同步过程

时钟频率误差及传输路径上的（电缆、驱动器等）相位延迟会引起同步偏差，因此接收单元通过 `硬件同步` 或者 `再同步` 的方法调整时序进行接收

- 硬件同步

接收单元在 `总线空闲状态` 检测出 `帧起始时` 进行的同步调整

在检测出边沿的地方不考虑 `SJW(再同步补偿宽度)` 的值而认为是 `SS` 段

节点通过 `CAN` 总线发送数据，一开始发送帧起始信号。总线上其他节点会检测帧起始信号在不在位数据的 `SS` 段内，判断内部时序与总线是否同步

假如不在 `SS` 段内，这种情况下，采样点获得的电平状态是不正确的。所以，节点会使用硬件同步方式调整，把自己的 `SS` 段平移到检测到边沿的地方，获得同步，同步情况下，采样点获得的电平状态才是正确的

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231104124155.webp" style="zoom:67%;" />

- 再同步

再同步利用普通数据位的 `边沿信号`（帧起始信号是 `特殊` 的边沿信号)进行同步。再同步的方式分为两种情况： `超前` 和 `滞后` ，即 `边沿信号` 与 `SS` 段的 `相对位置`

每当检测出边沿时，根据 `SJW` 值通过加长 `PBS1` 段，或缩短 `PBS2` 段，以调整同步。但如果发生了超出 `SJW` 值的误差时，最大调整量不能超过 `SJW` 值

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231104124848.webp" style="zoom:67%;" />

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231104125152.webp" style="zoom:67%;" />



> CAN总线仲裁(优先级决定)

在总线空闲态，最先开始发送消息的单元获得发送权

多个单元同时开始发送时，各发送单元从 `仲裁段(报文ID)` 的 `第一位` 开始进行仲裁。 `连续输出显性电平(0)`最多的单元可继续发送(`换句话就是ID越小优先级越高`)，即 `首先出现隐性电平的单元失去对总线的占有权变为接收`，竞争失败单元，会自动检测总线空闲，在第一时间再次尝试发送

当然还有另一种情况就是单元检测到是 `0`，但是总线上检测到的是 `1`，那就是出现错误了

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231104131246.webp" style="zoom:67%;" />



{% tip bolt %}CAN控制器{% endtip %}

> CAN控制器介绍

STM32 CAN控制器( `bxCAN(STM32F1,F4,F7系列)` )，支持 `CAN 2.0A` 和 `CAN 2.0B Active` 版本协议，`STM32H7 的是FDCAN`

`CAN 2.0A`：只能处理标准数据帧且扩展帧的内容会识别错误

`CAN 2.0B Active`：可以处理标准数据帧和扩展数据帧

`CAN 2.0B Passive`：只能处理标准数据帧且扩展帧的内容会忽略

- 特点

波特率最高可达 `1Mbps`

支持时间触发通信( `CAN` 的硬件内部定时器可以在 `Tx/Rx`  的帧起始位的采样点位置生成时间戳)

具有 `3级` 发送邮箱

具有 `3级` 深度的 `2个` 接收 `FIFO`

可变的过滤组( `F4/F7最多28个,F1最多14个` )，它还有别的叫法：滤波器，筛选器



> CAN控制器模式

CAN控制器的工作模式有三种：

1. 初始化模式 -- 需要配置寄存器时
2. 正常模式 -- CAN总线同步，开始接收和发送
3. 睡眠模式 -- 降低功耗

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231104141749.webp" style="zoom:67%;" />

CAN控制器的测试模式有三种：

1. 静默模式
2. 环回模式
3. 环回静默模式

`注`：这三种模式都是在初始化模式下进行配置的

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231104143009.webp" style="zoom:67%;" />

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231104143115.webp" style="zoom:67%;" />



> CAN控制器框图

`CAN1` 是主， `CAN2` 是从

1. `CAN内核`

包含各种控制寄存器/状态/配置寄存器，可以配置模式，波特率等

2. `发送邮箱`

用来缓存待发送的报文，最多可以缓存3个报文

3. `接收FIFO`

缓存接收到的有效报文

4. `接收过滤器`

筛选有效报文

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231104144553.webp)

> 发送处理

发送优先级由邮箱中报文的标识符决定，标识符数值越低优先级越高，如果标识符相同，则邮箱小的先被发送

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231104145202.webp)



> 接收处理

有效报文是指(数据帧直到EOF段的最后一位都没有错误)，且通过过滤器组对标识符过滤

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231104145608.webp)

当FIFO处于挂号_3状态(即FIFO的3个邮箱都是满的)，下一个有效的报文就会导致溢出，并且一个报文会丢失。至于哪个报文会被丢弃，取决于对FIFO的设置：

1. 如果 `禁用了FIFO锁定功能`(CAN_MCR寄存器的RFLM位被清’0’)，那么FIFO中最后收到的报文就被新报文所覆盖。这样，最新收到的报文不会被丢弃掉
2. 如果 `启用了FIFO锁定功能`(CAN_MCR寄存器的RFLM位被置’1’)，那么新收到的报文就被丢弃，软件可以读到FIFO中最早收到的3个报文



> CAN控制器位时序

STM32的CAN外设位时序分为三段：`同步段SYNC_SEG`，`时间段1 BS1(相当于PTS+PBS1)`，`时间段2 BS2`

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231104154840.webp" style="zoom:67%;" />



$$\text{波特率=}\frac{1}{1tq + tq * (TS1[3:0] + 1) + tq * (TS2[2:0] + 1)}$$

$$tq = tpck\times(BRP[9:0] + 1)$$

$$tpck=42MHz(\text{对于F407系列来说，挂载在APB1上})$$

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231104155606.webp" style="zoom:67%;" />

{% note simple %}

STM32F103，设 `TS1=8`、 `TS2=7` 、 `BRP=3`

$$\text{波特率}=\frac{36000}{[(9+8+1)*4]} = 500Kbps$$

STM32F407，设 `TS1=6`、 `TS2=5`、 `BRP=5`

$$\text{波特率}=\frac{42000}{[(7+6+1)*6]} = 500Kbps$$

需要注意的是通信双方波特率要设置为一样才能通信成功

{% endnote %}



> CAN相关寄存器

|    寄存器     |          名称          |                             作用                             |
| :-----------: | :--------------------: | :----------------------------------------------------------: |
|    CAN_MCR    |    CAN主控制寄存器     |                  主要负责CAN工作模式的配置                   |
|    CAN_BTR    |      位时序寄存器      | 用来设置分频$T_{BS1}/T_{BS2}/T_{SWJ}$等参数，设置测试模式，只有 CAN 硬件处于初始化模式时，才能由软件访问此寄存器 |
| CAN_(T/R)lxR  |      标识符寄存器      |      存放(待发送/接收)的 `报文ID、扩展ID、IDE位及RTR位`      |
| CAN_(T/R)DTxR | 数据长度和时间戳寄存器 |               存放(待发送/接收)报文的 `DLC` 段               |
| CAN_(T/R)DLxR |     低位数据寄存器     |      存放(待发送/接收)报文数据段的 `Data0~Data3` 的内容      |
| CAN_(T/R)DHxR |     高位数据寄存器     |      存放(待发送/接收)报文数据段的 `Data4~Data7` 的内容      |
|   CAN_FM1R    |    过滤器模式寄存器    | 用于设置各过滤器组的工作模式，只能使用有的过滤器组，不能使用没有的 |
|   CAN_FS1R    |    过滤器位宽寄存器    |                   用于设置各过滤器组的位宽                   |
|   CAN_FFA1R   |     FIFO关联寄存器     |            用于设置报文通过过滤器后，被存入的FIFO            |
|   CAN_FA1R    |    过滤器激活寄存器    |                    用于开启对应的过滤器组                    |
| CAN_FxR(1/2)  |    过滤器组x寄存器     |    根据位宽和模式设置不同， `CAN_FxR1` 和 `FxR2`功能不同     |



{% tip bolt %}CAN相关HAL库驱动介绍{% endtip %}

| 驱动函数                               |         关联寄存器         |     功能描述      |
| :------------------------------------- | :------------------------: | :---------------: |
| `__HAL_RCC_CANx_CLK_ENABLE(...)`       |                            |    使能CAN时钟    |
| `HAL_CAN_Init(...)`                    |          MCR/BTR           |     初始化CAN     |
| `HAL_CAN_ConfigFilter(...)`            |        过滤器寄存器        | 配置CAN接收过滤器 |
| `HAL_CAN_Start(...)`                   |          MCR/MSR           |    启动CAN设备    |
| `HAL_CAN_ActivateNotification(...)`    |            IER             |     使能中断      |
| `__HAL_CAN_ENABLE_IT(...)`             |            IER             |  使能CAN中断允许  |
| `HAL_CAN_AddTxMessage(...)`            | TSR/TIxR/TDTxR/TDLxR/TDHxR |     发送消息      |
| `HAL_CAN_GetTxMailboxesFreeLevel(...)` |            TSR             |   等待发送完成    |
| `HAL_CAN_GetRxFifoFillLevel(...)`      |         RF0R/RF1R          |   等待接收完成    |
| `HAL_CAN_GetRxMessage(...)`            |   RF0R/RFF1R/RDLxR/RDHxR   |     接收消息      |

CAN外设相关重要结构体：`CAN_InitTypeDef`、`CAN_FilterTypeDef`、`CAN_(T/R)xHeaderTypeDef`

{% note simple %}

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231104222859.webp" style="zoom:67%;" />

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231104223028.webp" style="zoom:67%;" />

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231105125034.webp" style="zoom:67%;" />

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231105125109.webp" style="zoom:67%;" />

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231104224015.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231104224151.webp)

举例：

假设现在扩展帧是0x99，那怎么赋值32位标识符列表模式？

首先把32位宽砍一半，分成左边高16位和右边低16位，然后：

```cpp
0x99>>13&0xFFFF ----- 获取ID高16位
0x99<<3&0xFFFF -----  获取ID低16位  
# 因为扩展帧最大是29位，所以右移13位就是取高16位，然后剩下13位不足16位就需要左移3位了    
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231105124144.webp)

{% endnote %}



{% tip bolt %}CAN基本驱动步骤{% endtip %}

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231105130522.webp" style="zoom: 50%;" />



{% tip bolt %}附{% endtip %}

波特率计算可以使用网站进行生成推荐值：

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231106162252.webp" style="zoom:50%;" />



### 遥控帧

> 巧用遥控帧

遥控帧发送的时候，DLC是无用的，但依然会发送出去，当我们发送遥控帧的时候，把不同的命令DLC赋不同的值，接收的时候，只要识别DLC的值就能知道接收的命令是什么，这样就能快速的传递命令，当然，发送端和接收端需事先约定好



### CAN过滤器详解

参考：

[再谈STM32的CAN过滤器-bxCAN的过滤器的4种工作模式以及使用方法总结](https://blog.csdn.net/flydream0/article/details/52317532?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522169926234116800211583021%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=169926234116800211583021&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~top_positive~default-1-52317532-null-null.nonecase&utm_term=CAN%E8%BF%87%E6%BB%A4%E5%99%A8&spm=1018.2226.3001.4450)



> 以下是基于STM32F429IGT6进行分析

{% tip bolt %}STM32F429IGT6相关{% endtip %}

- 过滤器组

F4系列 CAN1 和 CAN2 之间共享 `28 个筛选器组(0~27)`，每个筛选器组 x 均包含 `两个 32 位寄存器`，分别是 `CAN_FxR0` 和 `CAN_FxR1` ，过滤器组中的每个过滤器，编号(叫做过滤器号)从 `0` 开始，到某个最大数值（这时最大值并非 `27` ，而是取决于 `28` 个过滤器组的模式和位宽的设置，当全部配置为位宽为 `16`，且为标识符列表模式时，最大编号为 `28*4-1=111`）

- 过滤器的过滤模式

选择模式可设置 `屏蔽位(掩码)模式` 或 `标识符列表模式`

|   模式   |                             优点                             |             缺点             |
| :------: | :----------------------------------------------------------: | :--------------------------: |
| 列表模式 |                 能精确地过滤每个指定的CAN ID                 |          有数量限制          |
| 掩码模式 | 取决于屏蔽码，有时无法完全精确到每一个CAN ID，部分不期望的CAN ID有时也会收到 | 数量取决于屏蔽码，最多无上限 |

1. 屏蔽位模式

在这种模式下，你为每个过滤器 `指定一个ID和一个掩码`。只有与这个ID匹配的消息才会被接收。掩码允许你定义 `哪些位是重要的(即需要匹配的)` 和 `哪些位可以忽略`， `例如，一个掩码0xFF0表示你只关心ID的高8位，而不关心低4位`

2. 标识符列表模式

在这种模式下，你可以为每个过滤器 `指定一个或多个ID`。只有与这些ID匹配的消息才会被接收

- 过滤器位宽

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231106195014.webp)



- 过滤器优先级

根据过滤器的不同配置，有可能一个报文标识符能通过多个过滤器的过滤；在这种情况下，存放在接收邮箱中的过滤器匹配序号，根据下列优先级规则来确定：

● 位宽为32位的过滤器，优先级高于位宽为16位的过滤器

● 对于位宽相同的过滤器，标识符列表模式的优先级高于屏蔽位模式

● 位宽和模式都相同的过滤器，优先级由过滤器号决定，过滤器号小的优先级高

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230523174613.webp" style="zoom:50%;" />

- 过滤器寄存器

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231107085226.webp" style="zoom: 50%;" />

对于标准的CAN ID来说，我们有一个16位的寄存器来处理他足够了，相应地，扩展CAN ID，我们就必须使用32位的寄存器来处理它

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231107085742.webp" style="zoom:50%;" />

这个是屏蔽位寄存器

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231108092139.webp" style="zoom:50%;" />

于是根据模式与位宽的设置，我们共可以得出4种不同的组合： `32位宽的列表模式`， `16位宽的列表模式`， `32位宽掩码模式` ， `16位宽的掩码模式`。如下图所示：

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231104152034.webp" style="zoom:67%;" />

在使能过滤器情况下，总线上广播的报文 `ID` 与过滤器的配置都不匹配， `CAN` 控制器会丢弃该报文，不会进入到接收 `FIFO` 中

 `一般来说如果你是节点一般只需要接收主机的数据，所以设置为标识符模式，如果你是主机的话一般需要接收很多节点的数据则设置为屏蔽位模式`

`注意`：标识符选择位IDE和帧类型RTR需要一致，不同过滤器组的工作模式可以设置为不同

凡是需要过滤 `扩展CAN ID` 的，都是需要用到 `32位宽` 的模式



{% note simple %}

注意 `CAN_FilterTypeDef` 结构体成员，它跟上面图中寄存器对应关系：

- 位宽为32位时

|    结构体成员    | 寄存器 |
| :--------------: | :----: |
|   FilterIdHigh   |  FxR1  |
|   FilterIdLow    |  FxR1  |
| FilterMaskIdHigh |  FxR2  |
| FilterMaskIdLow  |  FxR2  |

{% endnote %}



1. `32位宽的列表模式`

这两个寄存器的各位定义都是一样的，都用来存储某个具体的期望通过的CAN ID，这样就可以存入2个期望通过的CAN ID(标准CAN ID和扩展CAN ID均可)

2. `32位宽掩码模式`

CAN_FxR1 用做32位宽的验证码，而 CAN_FxR2 则用作32位宽的屏蔽码

3. `16位宽的掩码模式`

可以当做2对验证码+屏蔽码组合来用，但它只能对标准CAN ID进行过滤

4. `16位宽的列表模式`

CAN_FxR1和CAN_FxR2定义一样，且各自拆成两个16位宽的寄存器，则总共可以写入4个标准CAN ID



{% folding, 通用.c %}

```cpp
/*
* @function: HAL_CAN_RxFifo1MsgPendingCallback
* @param: None
* @retval: None
* @brief: 中断回调函数
*/
void HAL_CAN_RxFifo0MsgPendingCallback(CAN_HandleTypeDef *hcan)
{
	if (HAL_OK == HAL_CAN_GetRxMessage(hcan, CAN_RX_FIFO0, &canRx, Mycan.CAN_Rx_Buffer))
	{
		Mycan.CAN_RX_Flag = 1;
	}
}

void MyCAN_Handler(void)
{
	if (Mycan.CAN_RX_Flag)
	{
		HAL_GPIO_TogglePin(LED1_GPIO_Port,LED1_Pin);
		if (CAN_ID_STD == canRx.IDE)	// 判断是标准帧
		{
			printf("STD_ID:%x  ",canRx.StdId);
			for (uint8_t i = 0; i < canRx.DLC; i++)	// DLC是接收的数据长度
			{
				printf("%02x ",Mycan.CAN_Rx_Buffer[i]);	// 打印数据
			}
			printf("\r\n");
		}
		else if (CAN_ID_EXT == canRx.IDE)	// 判断是扩展帧
		{
			printf("EXT_ID:%x  ",canRx.ExtId);
			for (uint8_t i = 0; i < canRx.DLC; i++)
			{
				printf("%02x ",Mycan.CAN_Rx_Buffer[i]);	// 打印数据
			}
			printf("\r\n");			
		}
		Mycan.CAN_RX_Flag = 0;
	}
}
```

{% endfolding %}





{% tip bolt %}32位宽的列表模式{% endtip %}

扩展帧则需要将 `IDE为“1”`，标准帧则为 `IDE为“0”`

数据帧设 `RTR为“0”`，远程帧设 `RTR为“1”`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231107121134.webp)

{% note simple %}

`问1：`为什么左移5位？

因为我们需要看映射，像上图，我们基本ID只有11位，那相当于只占高16位，那就是STID[10:0]，EXID[17:13]的话属于扩展帧的补0即可(不需要关心)，所以左移5位就刚刚好，高位的话不足就前面补0

$$\text{标准ID 0x123的二进制：1  0010 0011}$$

$$\text{左移5位后：10 0100 0110 0000}$$

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231107181747.webp)

{% endnote %}



> 【实验】
>
> 内容：只接收 `ID为0x123` 和 `ID为0x12345678` 的数据，其他的丢弃

{% folding, my_can.c %}

```cpp
static void MyCAN_Filter_Config(void)
{
	CAN_FilterTypeDef can_filterconfig;
	uint32_t stdID = 0x123;	// 基本ID
	uint32_t extID = 0x12345678;	// 扩展ID
	
    
	can_filterconfig.FilterMode = CAN_FILTERMODE_IDLIST;	// 32位列表模式
	can_filterconfig.FilterScale = CAN_FILTERSCALE_32BIT;	// 32位宽
	
	can_filterconfig.FilterIdHigh = stdID << 5;	// 11位ID需要左移5位
	can_filterconfig.FilterIdLow = CAN_ID_STD | 0 | 0;	// 标准帧|数据帧|无用的0
	can_filterconfig.FilterMaskIdHigh = (extID >> 13) & 0xFFFF;	// 右移13位获取高16位
	can_filterconfig.FilterMaskIdLow = (extID << 3) & 0xFFFF | CAN_ID_EXT;	// 左移3位获取低16位|为扩展帧
	
	can_filterconfig.FilterBank = 0;	// 过滤器0
	can_filterconfig.FilterActivation = CAN_FILTER_ENABLE;	// 激活
	can_filterconfig.FilterFIFOAssignment = CAN_FILTER_FIFO0;	// 绑定FIFO0
	can_filterconfig.SlaveStartFilterBank = 14;	// 从CAN
	
	if (HAL_CAN_ConfigFilter(&hcan1, &can_filterconfig) != HAL_OK)
	{
		Error_Handler();
	}	
}
```

{% endfolding %}

- 实验现象

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231107202917.webp" style="zoom: 80%;" />



{% tip bolt %}16位宽的列表模式{% endtip %}

扩展帧则需要将 `IDE为“1”`，标准帧则为 `IDE为“0”`

数据帧设 `RTR为“0”`，远程帧设 `RTR为“1”`

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231107204301.webp" style="zoom:67%;" />

在16位宽的列表模式下， `FilterIdHigh`， `FilterIdLow`， `FilterMaskIdHigh`， `FilterMaskIdLow` 这4个16位变量都是用来存储一个 `标准CAN ID`，这样，就可以存放 `4个标准CAN ID`了

> 【实验】
>
> 内容：只接收ID为 `0x123` 、 `0x133` 、`0x143`、`0x153` 的数据，其他的丢弃

{% folding, my_can.c %}

```cpp
static void MyCAN_Filter_Config(void)
{
    CAN_FilterTypeDef can_filterconfig;

    uint32_t stdID1 = 0x123; // 基本ID1
    uint32_t stdID2 = 0x133; // 基本ID2
    uint32_t stdID3 = 0x143; // 基本ID3
    uint32_t stdID4 = 0x153; // 基本ID4

    can_filterconfig.FilterMode = CAN_FILTERMODE_IDLIST;  // 16位列表模式
    can_filterconfig.FilterScale = CAN_FILTERSCALE_16BIT; // 16位宽

    can_filterconfig.FilterIdHigh = stdID1 << 5; // 11位ID需要左移5位
    can_filterconfig.FilterIdLow = stdID2 << 5;
    can_filterconfig.FilterMaskIdHigh = stdID3 << 5;
    can_filterconfig.FilterMaskIdLow = stdID4 << 5;

    can_filterconfig.FilterBank = 0;                          // 过滤器0
    can_filterconfig.FilterActivation = CAN_FILTER_ENABLE;    // 激活
    can_filterconfig.FilterFIFOAssignment = CAN_FILTER_FIFO0; // 绑定FIFO0
    can_filterconfig.SlaveStartFilterBank = 14;               // 从CAN

    if (HAL_CAN_ConfigFilter(&hcan1, &can_filterconfig) != HAL_OK)
    {
        Error_Handler();
    }
}
```

{% endfolding %}

- 实验现象

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231107205448.webp" style="zoom:67%;" />





{% tip bolt %}32位宽掩码模式{% endtip %}

此模式可以过滤标准CAN ID，也可以过滤扩展CAN ID，甚至两者混合一起

扩展帧则需要将 `IDE为“1”`，标准帧则为 `IDE为“0”`

数据帧设 `RTR为“0”`，远程帧设 `RTR为“1”`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231107210939.webp)



{% note simple %}

> 只针对标准CAN ID

{% note simple %}

`问1：`为什么 FilterMaskIdLow = 0 | CAN_RTR_REMOTE？

在实际的信息接收过程中，我们既要接收数据帧，也要接收遥控帧(也叫远程帧)，遥控帧用于发送不带数据的命令，RTR位也要匹配，屏蔽器的RTR位要为0，才能保证过滤器ID的RTR位不管为0或1都能接收，但是上面这样的写法是只接收数据帧不接收遥控帧

{% endnote %}

{% folding, mycan.c %}

```cpp
static void MyCAN_Filter_Config(void)
{
    CAN_FilterTypeDef can_filterconfig;

    uint16_t stdID_Arr[] = {0x7E0, 0x7E1, 0x7E2, 0x7E3, 0x7E4, 0x7E5, 0x7E6, 0x7E7, 0x7E8, 0x7E9}; // 定义一组标准ID
    uint16_t mask, num, tmp;

    mask = 0x7FF;	// 因为标准帧最大是11位也就是0x7FF
    num = sizeof(stdID_Arr) / sizeof(stdID_Arr[0]); // 计算元素个数
    for (uint8_t i = 0; i < num; i++)
    {
        tmp = stdID_Arr[i] ^ (~stdID_Arr[0]); // 所有数组元素与元素0同或操作，找出不同位
        mask &= tmp;	// 实时更新mask值
    }

    can_filterconfig.FilterMode = CAN_FILTERMODE_IDMASK;  // 32位掩码模式
    can_filterconfig.FilterScale = CAN_FILTERSCALE_32BIT; // 32位宽

    can_filterconfig.FilterIdHigh = (stdID_Arr[0] << 5); // 验证码可以为数组的任意一个ID
    can_filterconfig.FilterIdLow = 0;
    can_filterconfig.FilterMaskIdHigh = (mask << 5);
    can_filterconfig.FilterMaskIdLow = 0 | CAN_RTR_REMOTE;	// 只接收数据帧不接收遥控帧

    can_filterconfig.FilterBank = 0;                          // 过滤器0
    can_filterconfig.FilterActivation = CAN_FILTER_ENABLE;    // 激活
    can_filterconfig.FilterFIFOAssignment = CAN_FILTER_FIFO0; // 绑定FIFO0
    can_filterconfig.SlaveStartFilterBank = 14;               // 从CAN

    if (HAL_CAN_ConfigFilter(&hcan1, &can_filterconfig) != HAL_OK)
    {
        Error_Handler();
    }
}
```

{% endfolding %}

- 实验现象

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231107215726.webp)



> 只针对扩展CAN ID

为 `1` 的位就是不可变的，为 `0` 的位就是可变的，这里结果相当于程序里最终算出的mask

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231108101124.webp)

{% folding, mycan.c %}

```cpp
static void MyCAN_Filter_Config(void)
{
    CAN_FilterTypeDef can_filterconfig;

    uint32_t extID_Arr[] = {0x18201010, 0x18201021, 0x18201012, 0x18201033, 0x18301011}; // 定义一组扩展ID
    uint32_t mask, num, tmp;

    mask = 0x1FFFFFFF;                              // 扩展帧是29位
    num = sizeof(extID_Arr) / sizeof(extID_Arr[0]); // 计算元素个数
    for (uint8_t i = 0; i < num; i++)
    {
        tmp = extID_Arr[i] ^ (~extID_Arr[0]); // 所有数组元素与元素0同或操作，找出不同位
        mask &= tmp;
    }
    
    can_filterconfig.FilterMode = CAN_FILTERMODE_IDMASK;  // 32位掩码模式
    can_filterconfig.FilterScale = CAN_FILTERSCALE_32BIT; // 32位宽

    can_filterconfig.FilterIdHigh = (extID_Arr[0] >> 13) & 0xFFFF;                    // 数组任意一个成员都可以作为验证码
    can_filterconfig.FilterIdLow = (extID_Arr[0] << 3) & 0xFFFF | CAN_ID_EXT | 0 | 0; // 低16位扩展帧|扩展帧|数据帧|无用的0
    can_filterconfig.FilterMaskIdHigh = (mask >> 13) & 0xFFFF;                        // 屏蔽位高16位
    can_filterconfig.FilterMaskIdLow = (mask << 3) & 0xFFFF | CAN_RTR_REMOTE;         // 接收数据帧不接收遥控帧

    can_filterconfig.FilterBank = 0;                          // 过滤器0
    can_filterconfig.FilterActivation = CAN_FILTER_ENABLE;    // 激活
    can_filterconfig.FilterFIFOAssignment = CAN_FILTER_FIFO0; // 绑定FIFO0
    can_filterconfig.SlaveStartFilterBank = 14;               // 从CAN

    if (HAL_CAN_ConfigFilter(&hcan1, &can_filterconfig) != HAL_OK)
    {
        Error_Handler();
    }
}
```

{% endfolding %}

- 实验现象

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231108102533.webp" style="zoom:67%;" />



> 标准CAN ID与扩展CAN ID混合过滤

{% folding, mycan.c %}

```cpp
static void MyCAN_Filter_Config(void)
{
    CAN_FilterTypeDef can_filterconfig;

    uint32_t stdID_Arr[] = {0x711, 0x712, 0x71A, 0x710, 0x715}; 
    uint32_t extID_Arr[] = {0x18201010, 0x18201021, 0x18201012, 0x18201033, 0x18301011}; // 定义一组扩展ID
    uint32_t mask, num, tmp, std_mask, ext_mask, min_mask;

// ********************  标准帧计算  ********************
    std_mask = 0x7FF;                             
    num = sizeof(stdID_Arr) / sizeof(stdID_Arr[0]);
    for (uint8_t i = 0; i < num; i++)
    {
        tmp = stdID_Arr[i] ^ (~stdID_Arr[0]); 
        std_mask &= tmp;
    }
// ********************  扩展帧计算  ********************
    ext_mask = 0x1FFFFFFF;
    num = sizeof(extID_Arr) / sizeof(extID_Arr[0]);
    for (uint8_t i = 0; i < num; i++)
    {
        tmp = extID_Arr[i] ^ (~extID_Arr[0]); 
        ext_mask &= tmp;
    }    
// ********************  综合计算  ********************
    min_mask = (stdID_Arr[0] << 18) ^ (~extID_Arr[0]);  // 计算标准CAN ID与扩展CAN ID混合的屏蔽码
    mask = (std_mask << 18) & ext_mask & min_mask;  // 计算最终的屏蔽码

    can_filterconfig.FilterMode = CAN_FILTERMODE_IDMASK;  // 32位掩码模式
    can_filterconfig.FilterScale = CAN_FILTERSCALE_32BIT; // 32位宽

    // can_filterconfig.FilterIdHigh = (extID_Arr[0] >> 13) & 0xFFFF; // 扩展帧数组任意一个成员都可以作为验证码
    // can_filterconfig.FilterIdLow = (extID_Arr[0] << 3) & 0xFFFF | CAN_ID_EXT | 0 | 0; // 扩展帧低16位扩展帧|扩展帧|数据帧|无用的0
    // 这里也可以这样设置
    can_filterconfig.FilterIdHigh = stdID_Arr[0] << 5; // 标准帧数组任意一个成员都可以作为验证码
    can_filterconfig.FilterIdLow = 0 | CAN_ID_STD | 0 | 0; // 标准帧低16位扩展帧|标准帧|数据帧|无用的0  

    can_filterconfig.FilterMaskIdHigh = (mask >> 13) & 0xFFFF;                        // 屏蔽位高16位
    can_filterconfig.FilterMaskIdLow = (mask << 3) & 0xFFFF | CAN_RTR_REMOTE;         // 接收数据帧，不接收遥控帧

    can_filterconfig.FilterBank = 0;                          // 过滤器0
    can_filterconfig.FilterActivation = CAN_FILTER_ENABLE;    // 激活
    can_filterconfig.FilterFIFOAssignment = CAN_FILTER_FIFO0; // 绑定FIFO0
    can_filterconfig.SlaveStartFilterBank = 14;               // 从CAN

    if (HAL_CAN_ConfigFilter(&hcan1, &can_filterconfig) != HAL_OK)
    {
        Error_Handler();
    }
}
```

{% endfolding %}

- 实验现象

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231108110321.webp" style="zoom:67%;" />



> 16位宽掩码模式

High放Arr1或Arr2标准帧都可以，反正跟掩码对应就行

{% folding, mycan.c %}

```cpp
static void MyCAN_Filter_Config(void)
{
    CAN_FilterTypeDef can_filterconfig;

    uint16_t stdID_Arr1[] = {0x711, 0x712, 0x71A, 0x710, 0x715}; 
    uint16_t stdID_Arr2[] = {0x7D1, 0x7D2, 0x7D3, 0x7D4, 0x7D5};
    uint16_t mask1, mask2, num, tmp;

// ********************  标准帧计算  ********************
    mask1 = 0x7FF;
    num = sizeof(stdID_Arr1) / sizeof(stdID_Arr1[0]);   // 计算元素大小
    for (uint8_t i = 0; i < num; i++)
    {
        tmp = stdID_Arr1[i] ^ (~stdID_Arr1[0]);
        mask1 &= tmp;
    }
    mask2 = 0x7FF;
    num = sizeof(stdID_Arr2) / sizeof(stdID_Arr2[0]);   // 计算元素大小
    for (uint8_t i = 0; i < num; i++)
    {
        tmp = stdID_Arr2[i] ^ (~stdID_Arr2[0]);
        mask2 &= tmp;
    }    

    can_filterconfig.FilterMode = CAN_FILTERMODE_IDMASK;  // 16位掩码模式
    can_filterconfig.FilterScale = CAN_FILTERSCALE_16BIT; // 16位宽

    can_filterconfig.FilterIdHigh = stdID_Arr1[0] << 5; // 设置第1个验证码
    can_filterconfig.FilterIdLow = stdID_Arr2[0] << 5; // 设置第2个验证码

    can_filterconfig.FilterMaskIdHigh = (mask1 << 5) | 0x10;    // 设置第1个掩码 --- 只接收数据帧
    can_filterconfig.FilterMaskIdLow = (mask2 << 5) | 0x10;    // 设置第2个掩码 --- 只接收数据帧

    can_filterconfig.FilterBank = 0;                   // 过滤器0
    can_filterconfig.FilterActivation = CAN_FILTER_ENABLE;    // 激活
    can_filterconfig.FilterFIFOAssignment = CAN_FILTER_FIFO0; // 绑定FIFO0
    can_filterconfig.SlaveStartFilterBank = 14;               // 从CAN

    if (HAL_CAN_ConfigFilter(&hcan1, &can_filterconfig) != HAL_OK)
    {
        Error_Handler();
    }
}
```

{% endfolding %}

- 实验现象

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231108212129.webp" style="zoom:67%;" />

{% endnote %}



### CAN分析仪

[USB to CANA 资料-微雪](https://www.waveshare.net/wiki/USB-CAN-A)

{% tip bolt %}驱动安装{% endtip %}

下载 `CH341SER` 驱动，双击 `CH341SER.EXE` 文件，点击安装，出现驱动安装成功后，点击确定完成驱动安装(要先把分析仪插上电脑先！)

{% tip bolt %}CAN分析仪上位机UCANV2.0{% endtip %}

 `2M` 波特率能兼容大部分 `CAN` 速率（串口波特率大约对应CAN 速率的2倍），一般情况默认 `2M`波特率就可以，将 `CAN` 速率改为和外接CAN设备对应的速率（最高支持1M）即可

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231106111145.webp)



{% tip bolt %}硬件连接{% endtip %}

双绞线(所在找不到可以使用杜邦线代替，把杜邦线像扭麻花那样绕一起就行了)

CAN波特率要双方一致

| USB to CAN |   STM32    |
| :--------: | :--------: |
|   CAN_H    |   CAN_H    |
|   CAN_L    |   CAN_L    |
|    GND     | 可接可不接 |

> 那这个GND的作用是什么？

如果在长距离的通信中，由于电缆长度或其他因素导致VCC和GND的电位差异较大，这样会导致信号传输变得不稳定，可能会出现数据误码等问题，虽然使用差分信号可以解决这个问题，但是不能完全消除这个问题

虽然CAN通信只需要使用H和L两个差分信号线进行数据传输，但是为了确保CAN总线的稳定性和可靠性，建议将CAN节点的地线连接在一起，如果CAN节点之间存在较大的电位差，可能会导致CAN节点之间的电压偏移过大，并且可能会使CAN总线出现不稳定的工作情况



### 问题

> 在使能CAN2时钟之前，需要先使能CAN1的时钟
>
> CAN2筛选器组从14开始，范围是 `14~27`，CAN1的范围是 `0~13`

> 需要注意中断函数名称，FIFO0和FIFO1他们不一样，如果用错会造车CAN卡死





### 编程示例1

> 测试模式 --- 环回模式（自发自收）

- MX配置

最关键主要配置如下三个参数，分频数我这里配置 `45(也就是对应寄存器BRP)`，下面的 `tq` 值就会自动计算出来。因为can时钟是 `45MHz` 经过 `45` 分频后，一个单位时间就是 `1us=1000ns`

因为我想要 `100k` 波特率，然后填写下面的 `Time segment1(简称 Tbs1 )` 和 `Time segment2 (简称 Tbs2)` 为 `5` 和 `4`

`jump width` 这个时间参数是作为补偿时间的上限，当时间有偏差的时候，就会自动补偿，最长时间不能超过该参数设定值

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231105142933.webp)

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231105153242.webp" style="zoom:67%;" />

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231105153119.webp" style="zoom:67%;" />



{% tip bolt %}初始化源码分析{% endtip %}

{% folding, can.c(系统) %}

```cpp
// CAN参数初始化
void MX_CAN1_Init(void)
{
    hcan1.Instance = CAN1; 
    hcan1.Init.Prescaler = 45;  // 分频系数(BRP)
    hcan1.Init.Mode = CAN_MODE_LOOPBACK;    // 工作模式设置-环回模式：自发自收
    hcan1.Init.SyncJumpWidth = CAN_SJW_1TQ; // 重新同步跳跃宽度
    hcan1.Init.TimeSeg1 = CAN_BS1_5TQ;  // 时间段1
    hcan1.Init.TimeSeg2 = CAN_BS2_4TQ;  // 时间段2
    hcan1.Init.TimeTriggeredMode = DISABLE; // 禁止时间触发通信模式
    hcan1.Init.AutoBusOff = DISABLE;    // 禁止自动离线管理
    hcan1.Init.AutoWakeUp = DISABLE;    // 禁止自动唤醒
    hcan1.Init.AutoRetransmission = DISABLE;    // 禁止自动重发
    hcan1.Init.ReceiveFifoLocked = DISABLE; // 禁止接收FIFO锁定
    hcan1.Init.TransmitFifoPriority = DISABLE;  // 禁止发送FIFO优先级

    if (HAL_CAN_Init(&hcan1) != HAL_OK)
    {
        Error_Handler();
    }
}

// GPIO初始化
void HAL_CAN_MspInit(CAN_HandleTypeDef *canHandle)
{
    GPIO_InitTypeDef GPIO_InitStruct = {0};
    if (canHandle->Instance == CAN1)
    {
        /* CAN1 clock enable */
        __HAL_RCC_CAN1_CLK_ENABLE();

        __HAL_RCC_GPIOA_CLK_ENABLE();
        /**CAN1 GPIO Configuration
        PA11     ------> CAN1_RX
        PA12     ------> CAN1_TX
        */
        GPIO_InitStruct.Pin = GPIO_PIN_11 | GPIO_PIN_12;
        GPIO_InitStruct.Mode = GPIO_MODE_AF_PP;
        GPIO_InitStruct.Pull = GPIO_NOPULL;
        GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_VERY_HIGH;
        GPIO_InitStruct.Alternate = GPIO_AF9_CAN1;	// 设置引脚的复用功能为CAN1
        HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);
    }
}
```

{% endfolding %}



{% tip bolt %}用户添加代码{% endtip %}

{% folding, my_can.h %}

```cpp
#ifndef __MY_CAN_H
#define __MY_CAN_H
#include "main.h"
#include "can.h"
#include "tim.h"
#include "usart.h"
#include "gpio.h"
#include <stdio.h>

typedef struct
{
    void (*MyCAN_Init)(void);   // CAN用户初始化
    void (*MyCAN_Send_Message)(uint32_t, uint8_t *, uint16_t);  // 发送消息数据函数
    uint8_t (*MyCAN_Rec_Message)(uint8_t *);    // 接收消息数据函数
} MyCAN_st;

extern MyCAN_st Mycan;

#endif
```

{% endfolding %}

{% folding, my_can.c %}

```cpp
#include "my_can.h"

/* Private variables=========================================================*/
CAN_TxHeaderTypeDef canTx;  // CAN发送结构体
CAN_RxHeaderTypeDef canRx;  // CAN接收结构体

/* Private function prototypes===============================================*/
static void MyCAN_Init(void);
static void MyCAN_Filter_Config(void);
static void MyCAN_Send_Message(uint32_t, uint8_t *, uint16_t);
static uint8_t MyCAN_Rec_Message(uint8_t *);
/* Public variables==========================================================*/
MyCAN_st Mycan = 
{
    .MyCAN_Init = &MyCAN_Init,
    .MyCAN_Send_Message = &MyCAN_Send_Message,
    .MyCAN_Rec_Message = &MyCAN_Rec_Message
};

/*
* @function: MyCAN_Init
* @param: None
* @retval: None
* @brief: CAN用户初始化
*/
static void MyCAN_Init(void)
{
    MyCAN_Filter_Config();  // CAN过滤器配置
    HAL_CAN_Start(&hcan1);  // 启动CAN
}

/*
* @function: MyCAN_Filter_Config
* @param: None
* @retval: None
* @brief: CAN过滤器配置
*/
static void MyCAN_Filter_Config(void)
{
    CAN_FilterTypeDef can_filterconfig;

    // 过滤器是接收所有报文，不筛选
    can_filterconfig.FilterMode = CAN_FILTERMODE_IDMASK;    // 过滤器模式 --- 屏蔽位模式
    can_filterconfig.FilterScale = CAN_FILTERSCALE_32BIT;   // 位宽 --- 32位
	// 默认 0 即全部通过
    can_filterconfig.FilterIdHigh = 0;  // ID高字节
    can_filterconfig.FilterIdLow = 0;   // ID低字节
    can_filterconfig.FilterMaskIdHigh = 0;  // 掩码高字节
    can_filterconfig.FilterMaskIdLow = 0;   // 掩码低字节

    can_filterconfig.FilterBank = 0;    // 过滤器组(0~27)
    can_filterconfig.FilterFIFOAssignment = CAN_FilterFIFO0;    // 过滤器关联FIFO
    can_filterconfig.FilterActivation = CAN_FILTER_ENABLE;  // 激活过滤器
    can_filterconfig.SlaveStartFilterBank = 27;    // 从CAN选择启动过滤器组
    // 过滤器组初始化
    HAL_CAN_ConfigFilter(&hcan1, &can_filterconfig);
}

/*
* @function: MyCAN_Send_Message
* @param: None
* @retval: None
* @brief: 发送消息数据函数
*/
static void MyCAN_Send_Message(uint32_t id, uint8_t *buff, uint16_t len)
{
    uint32_t tx_mail = CAN_TX_MAILBOX0; // 发送邮箱0

    canTx.ExtId = id;   // 扩展帧id
    // canTx.StdId = id;   // 扩展帧下这个成员无效(此成员为标准帧，只能和上面二选1)
    canTx.DLC = len;    // 数据长度
    canTx.IDE = CAN_ID_EXT; // 帧格式 --- 扩展帧
    canTx.RTR = CAN_RTR_DATA;   // 帧类型 --- 数据帧

    HAL_CAN_AddTxMessage(&hcan1, &canTx, buff, &tx_mail);   // 发送消息

    while(HAL_CAN_GetTxMailboxesFreeLevel(&hcan1) != 3);    // 等待全部邮箱发送完成(即空闲邮箱=3)
}

/*
* @function: MyCAN_Rec_Message
* @param: None
* @retval: None
* @brief: 接收消息数据函数
*/
static uint8_t MyCAN_Rec_Message(uint8_t *buff)
{
    if (0 == HAL_CAN_GetRxFifoFillLevel(&hcan1, CAN_RX_FIFO0))  // 没有接收到数据
    {
        return 0;
    }
    HAL_CAN_GetRxMessage(&hcan1, CAN_RX_FIFO0, &canRx, buff);   // 接收消息

    return canRx.DLC;   // 返回接收到的消息数据长度
}
```

{% endfolding %}

{% folding, Key.c %}

```cpp
uint8_t arr[8] = {0};
static uint8_t n = 0;
if (Key.Key_Status_Arr[0])
{
    Key.Key_Status_Arr[0] = 0;
    for (uint8_t i = 0; i < 8; i++)
    {
        arr[i] = n + i;
    }
    n++;
    Mycan.MyCAN_Send_Message(0x12345678, arr, 8);
}
```

{% endfolding %}

{% folding, main.c %}

```cpp
int main(void)
{
    Mycan.MyCAN_Init();
    
    while(1)
    {
        rx_len = Mycan.MyCAN_Rec_Message(rx_buf);
        if (rx_len)
        {
          for (uint8_t i = 0; i < rx_len; i++)
          {
            printf("%x ", rx_buf[i]);
          }
          printf("\r\n");
        }        
    }
}
```

{% endfolding %}



- 实验现象

自发自收，通过串口打印到上位机，然后其他总线也能监测(接收)到数据，但是其他的节点只能在 `正常模式` 或者 `静默模式` 下才能接收到其数据

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231106125320.webp" style="zoom: 50%;" />





### 编程示例2

> 测试模式 --- 环回模式（自发自收）

- 硬件连接



![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230522151110.webp)



- MX配置

bxCAN是挂载在APB1总线上的，APB1总线的时钟为36M

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230523214509.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230523214251.webp)

-  配置位时间参数

根据STM32参考手册里位时间特性的介绍，来配置最小时间单位Tq

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230523215015.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230523220046.webp)

> 在位时间参数里可以配置分频系数，这个系数没有下拉列表，需要自己写，APB1 36MHz时钟来到这里经过分频再给后面使用，根据实际通信速度来配置，例如可以设置为4分频，那 `36MHz/4 = 9MHz`
>
> 同步段因为固定为1个时间单元，所以不用配置
>
> 根据采样点最好在一个位的50% ~ 80%位置采样，所以 `时间段1可以配置长一点`，其范围为1到16个时间单元，这里可根据下拉列表选择11个时间单元
>
> 时间段2的设置就要 `注意不要让总和超过最大Tq数，因为同步段+时间段1+时间段2的Tq数范围是8 ~ 25个`，不过配置工具已经把参数规定好了，所以不用担心超出的问题，这里可以设置为6个时间单元，则会自动计算出一个位占用的时间（Time for one Bit）为 `2000ns`
>
> 计算过程：
>
> $36MHz/4 = 9MHz$
>
> $\text{同步段（1个Tq）} + \text{时间段1（11个Tq）} + \text{时间段2（6个Tq）} = \text{18个Tq}$
>
> $9MHz/18 = 0.5MHz$
>
> 即：即每一个Tq的频率就是0.5MHz，转为时间就为  `1/0.5MHz = 1/500000Hz = 0.000002s = 2us = 2000ns`
>
> 重新同步跳跃宽度（SJW）可设置范围是1 ~ 4个时间单元，这里可以选择2

-  配置基础参数

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230523220813.webp)

> 接收FIFO锁定模式：选择Enable（锁定）时，当接收FIFO满时，新接收到的报文就丢弃，软件可以读到FIFO中最早收到的3个报文。
>
> 选择Disable（不锁定）时，那么FIFO中最后收到的报文就被新报文所覆盖。这样，最新收到的报文不会被丢弃掉。
>
> 发送FIFO优先级：未使能就按邮箱序号进行发送

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230523221021.webp)

> 正常模式就需要两个或更多的实验板来进行通信
>
> 环回模式就只使用一个实验板就可以测试通信
>
> 本次实验使用环回模式

- NVIC

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230523221158.webp)

> CAN发送使用轮询的方式，接收就用RX0中断方式

- GPIO

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230523222056.webp)

> 推挽输出即可(虽然不知道有什么用)



- 程序编写

{% folding, Myinit.c %}

```cpp
void vHardware_Init(void)
{
    CAN_TEST.svCAN_Config();
}
```

{% endfolding %}

{% folding, System.h %}

```cpp
#ifndef __System_H
#define __System_H

//定义结构体类型
typedef struct
{
	void (*Run)(void);
	void (*Error_Handler)(void);
	void (*Assert_Failed)(void);
} System_t;

extern System_t  System;

#endif
```

{% endfolding %}

{% folding, System.c %}

```cpp
#include "AllHead.h"

static void Run(void); 
static void Error_Handler(void);
static void Assert_Failed(void);
	
/* Public variables-----------------------------------------------------------*/
System_t System = 
{
	Run,
	Error_Handler,
	Assert_Failed
};

/* Private function prototypes------------------------------------------------*/ 

/*
	* @name   Run
	* @brief  系统运行
	* @param  None
	* @retval None      
*/
static void Run()
{
	
}

/*
	* @name   Error_Handler
	* @brief  系统错误处理
	* @param  None
	* @retval None      
*/
static void Error_Handler()
{
	/* User can add his own implementation to report the HAL error return state */
}

/*
	* @name   Assert_Failed
	* @brief  函数参数错误处理
	* @param  None
	* @retval None      
*/
static void Assert_Failed()
{
	/* User can add his own implementation to report the file name and line number,
     tex: printf("Wrong parameters value: file %s on line %d\r\n", file, line) */
}
```

{% endfolding %}

{% folding, Timer6.h %}

```cpp
#ifndef __Timer6_H
#define __Timer6_H

#include "AllHead.h"

//定义枚举类型
typedef enum
{
	TIMER6_10mS  	= (uint16_t)2,
	TIMER6_50mS  	= (uint16_t)10,
	TIMER6_100mS	= (uint16_t)20,
	TIMER6_200mS	= (uint16_t)40,
	TIMER6_500mS	= (uint16_t)100,
	TIMER6_1S     = (uint16_t)200,
	TIMER6_2S     = (uint16_t)400,
	TIMER6_3S     = (uint16_t)600,
	TIMER6_5S     = (uint16_t)1000,
	TIMER6_10S    = (uint16_t)2000,
	TIMER6_3min   = (uint16_t)36000,
}TIMER6_Value_t;

//定义结构体类型
typedef struct
{
	uint16_t volatile usDelay_Timer;    //延时定时器
	uint16_t volatile SHT30_Measure_Timeout;	// 温湿度延时时间
	
	void (*Timer6_Start_IT)(void);      //定时器6以中断模式启动
} Timer6_t;

extern Timer6_t  Timer6;

#endif
```

{% endfolding %}

{% folding, Timer6.c %}

```cpp
#include "AllHead.h"
    
static void Timer6_Start_IT(void);  //定时器6以中断模式启动
	
Timer6_t  Timer6 = 
{
	0,
	0,
	
	Timer6_Start_IT     
};

/*
	* @name   Timer6_Start_IT
	* @brief  定时器6以中断模式启动
	* @param  None
	* @retval None      
*/
static void Timer6_Start_IT(void)
{
	HAL_TIM_Base_Start_IT(&htim6); //启动定时器6
}
```

{% endfolding %}

{% folding, CAN_TEST.h %}

```cpp
#ifndef __CAN_TEST_H
#define __CAN_TEST_H
#include "AllHead.h"

// 宏定义
#define CAN_SEND_OK     (uint8_t)0
#define CAN_SEND_FAIL   (uint8_t)1  

#define CAN_REC_OK      (uint8_t)0
#define CAN_REC_FAIL    (uint8_t)1

typedef struct 
{
    // 操作模式
    uint32_t Operate_Mode;
    void (*svCAN_Init)(void);
    void (*svCAN_Config)(void);
    // 发送缓存
    uint8_t Send_Buf[8];
    // 接收缓存
    uint8_t Rec_Buf[8];
    uint8_t (*CAN_Send_Msg)(uint8_t*,uint8_t);
    uint8_t (*CAN_Rec_Msg)(uint8_t*);
    // 接收标志位
    uint8_t volatile Rec_Flag;
}CAN_TEST_t;

extern CAN_TEST_t CAN_TEST;
#endif
```

{% endfolding %}

{% folding, CAN_TEST.c %}

```cpp
#include "AllHead.h"

/*====================================静态内部变量/函数声明区 BEGIN====================================*/
static void svCAN_Init(void);	// 初始化
static void svCAN_Config(void);	// 配置
static uint8_t CAN_Send_Msg(uint8_t*,uint8_t);	// 发送信息
static uint8_t CAN_Rec_Msg(uint8_t*);	// 接收信息
/*====================================静态内部变量/函数声明区    END====================================*/

/*====================================变量区 BEGIN====================================*/
CAN_TEST_t CAN_TEST = 
{
	// 正常模式
	CAN_MODE_NORMAL,
	svCAN_Init,
	svCAN_Init,
	{0},
	{0},
	CAN_Send_Msg,
	CAN_Rec_Msg,
	FALSE
}
/*====================================变量区    END====================================*/

void svCAN_Init(void)
{
	// 自行编写如果需要切换模式则需要重新初始化
}

static void svCAN_Init(void)
{
	// CAN过滤器参数配置
	CAN_FilterTypeDef CAN_FilterTypeDefSture;

	CAN_FilterTypeDefSture.FilterBank = 0;						// 配置过滤器0（F1共有14个，0-13）
	CAN_FilterTypeDefSture.FilterScale = CAN_FILTERSCALE_16BIT; // 配置为16位过滤器
	CAN_FilterTypeDefSture.FilterMode = CAN_FILTERMODE_IDMASK;	// 屏蔽位模式
	// ID号为0x00，屏蔽位为0x00，说明任何ID都接收
	CAN_FilterTypeDefSture.FilterIdLow = 0x00; // FR1
	CAN_FilterTypeDefSture.FilterMaskIdLow = 0x00;
	CAN_FilterTypeDefSture.FilterIdHigh = 0x00; // FR2
	CAN_FilterTypeDefSture.FilterMaskIdHigh = 0x00;
	CAN_FilterTypeDefSture.FilterFIFOAssignment = CAN_FILTER_FIFO0; // 过滤器0关联到FIFO0
	CAN_FilterTypeDefSture.FilterActivation = ENABLE;				// 激活过滤器0
	CAN_FilterTypeDefSture.SlaveStartFilterBank = 14;

	// 启动过滤器
	if (HAL_CAN_ConfigFilter(&hcan, &CAN_FilterTypeDefSture) != HAL_OK)
	{
		printf("CAN配置函数：配置过滤器!");
		System.Error_Handler();
	}

	// 使能FIFO0接收到一个新报文中断，具体为FIFO0的挂起中断
	if (HAL_CAN_ActivateNotification(&hcan, CAN_IT_RX_FIFO0_MSG_PENDING) != HAL_OK)
	{
		printf("CAN配置函数：使能FIFO0接收到一个新报文中断!");
		System.Error_Handler();
	}

	// 启动CAN
	if (HAL_CAN_Start(&hcan) != HAL_OK)
	{
		printf("CAN配置函数：CAN启动失败!");
		System.Error_Handler();
	}

	printf("配置成功,CAN成功启动!\r\n");
}

static uint8_t CAN_Send_Msg(uint8_t *pSend_Buf, uint8_t LEN)
{
	uint8_t i = 0;
	static uint8_t ucTestData = 0;
	uint32_t uiTxMailBox; // 接收CAN发送数据成功时返回的邮箱号（0-2）

	// 定义CAN TX消息头参数
	CAN_TxHeaderTypeDef CAN_TxHeaderTypeDefStrue =
		{
			0x88,		  // 标准标识符-11位
			0x00,		  // 拓展标识符-29位
			CAN_ID_STD,	  // 设置为标准格式
			CAN_RTR_DATA, // 设置为数据帧
			8,			  // 发送数据的长度 0 ~ 8
			DISABLE		  // 不使用捕获时间戳计数器
		};

	// 判断工作模式
	if (CAN_Test.uiOperate_Mode == CAN_MODE_LOOPBACK)
	{
		printf("\r\nCAN工作在环回模式，使用一块实验板来测试\r\n");
	}
	else
	{
		printf("\r\nCAN工作在正常模式，需要两块以上的实验板才能测试\r\n");
	}

	// 设置要发送的报文(测试数据，每次+1)
	printf("CAN要发送的报文如下：\r\n");
	for (i = 0; i < 8; i++)
	{
		printf("%#.2x ", ucTestData);
		CAN_Test.ucSend_Buf[i] = ucTestData++;
	}
	printf("\r\n");

	// 将消息添加到第一个空闲的Tx邮箱并激活相应的传输要求
	if (HAL_CAN_AddTxMessage(&hcan, &CAN_TxHeaderTypeDefStrue, pSend_Buf, &uiTxMailBox) != HAL_OK)
	{
		return CAN_SEND_FAIL;
	}

	// 通过检查空闲邮箱个数确认是否发送完成
	Timer6.usDelay_Timer = 0;
	do
	{
		// 超时处理
		if (Timer6.usDelay_Timer >= TIMER_1s)
		{
			printf("CAN发送超时\r\n");
			return CAN_SEND_FAIL;
		}
	} while (HAL_CAN_GetTxMailboxesFreeLevel(&hcan) != 3); // 如果3个发送邮箱都不是空闲的话，就说明数据还在发送，等于3表示所有三个发送邮箱都为空闲，可以进行发送数据

	// 发送成功
	return CAN_SEND_OK;
}

// CAN的FIFO0挂号中断 回调函数
//这里参数需要加_，可能是Bug
void HAL_CAN_RxFifo0MsgPendingCallback(CAN_HandleTypeDef * hcan_)
{
	// 定义CAN Rx消息头参数
	CAN_RxHeaderTypeDef CAN_RxHeader;
	// CAN接收消息
	if(HAL_CAN_GetRxMessage(&hcan,CAN_RX_FIFO0,&CAN_RxHeader,CAN_TEST.Rec_Buf) == HAL_OK)
	{
		CAN_TEST.Rec_Flag = TRUE;
	}
}
```

{% endfolding %}

{% folding, main.c %}

```cpp
void Test(void)
{
    // 计数
    static uint16_t CAN_Send_Ok_Cnt = 0;
    static uint16_t CAN_Send_Fail_Cnt = 0;
    static uint16_t CAN_Rec_Ok_Cnt = 0;
    
    // CAN发送数据
    if(KEY1)
    {
        KEY1 = 0;
        if(CAN_TEST.CAN_Send_Msg(CAN_TEST.Send_Buf,8) == CAN_SEND_OK)
        {
            printf("CAN发送成功次数：%u\r\n",++CAN_Send_Ok_Cnt);
        }
        else
        {
            printf("CAN发送失败次数：%u\r\n",++CAN_Send_Fail_Cnt);
        }
    }
    // CAN接收数据
    if(CAN_TEST.Rec_Flag == TRUE)
    {
        CAN_TEST.Rec_Flag = FALSE;
        printf("CAN接收成功次数：%u\r\n",++CAN_Rec_Ok_Cnt);
        CAN_TEST.CAN_Rec_Msg(CAN_TEST.Rec_Buf);
    }
}
```

{% endfolding %}