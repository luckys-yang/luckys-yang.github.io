---
title: 蓝牙SDK相关知识
cover: /img/num175.webp
categories:
  - 蓝牙SDK开发
comments: false
abbrlink: afc0ba36
date: 2024-02-21 12:53:35
---



## HID

> 参考文章
>
> [HID官网](https://usb.org/document-library/hid-usage-tables-15)
>
> [【BLE】HID设备的实现（蓝牙自拍杆、蓝牙键盘、蓝牙鼠标、HID复合设备）](https://blog.csdn.net/qq_34254642/article/details/126672201?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522170824351016800225540519%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=170824351016800225540519&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduend~default-1-126672201-null-null.142^v99^control&utm_term=%E8%93%9D%E7%89%99%E8%87%AA%E6%8B%8D%E6%9D%86&spm=1018.2226.3001.4187)
>
> [USB标准请求及描述符在线分析](https://www.usbzh.com/tool/usb.html)
>
> [BLE HID控制手机相机或音乐](https://blog.csdn.net/pig10086/article/details/72402066)
>
> [HID 报告及报告描述简介](https://www.usbzh.com/article/detail-775.html)
>
> [别人的HID代码](https://android.googlesource.com/kernel/msm/+/android-msm-wahoo-4.4-p-preview-2/drivers/hid/)
>
> [HID协议学习详细！！](https://blog.csdn.net/weixin_46187354/article/details/131235456)



### 基础知识

HID主要完成的工作就是完成： `鼠标/键盘等HID和PC/手机等主机的数据通信，数据通信的方向有单向也有双向的`

HID设备通讯协议有两种，分别是

1. **HID Boot Protocol**

一种通用协议，可用于交换所有HID设备的数据，但是它不支持多个并发数据输入输出，数据格式和长度是固定的，数据表示什么意思也是固定的，所以不需要报告描述符

2. **HID Report Protocol**

一种自定义协议，不同的HID设备可以使用不同格式的报告描述符和报告协议来进行数据传输，并支持多个并发数据输入输出，需要根据报告描述符才能 ，因为他需要根据报告描述符才能理解之后接收的报告数据的具体含义

> HOST 就相当于 PC 主机， 而 device就相当于鼠标，键盘这些 USB 外设
>
> ble hid 中，可以看做蓝牙设备就是 device，而手机就是 host
>
> 为什么蓝牙设备发送数据却称为输入报告，这是因为在 USB 规范中，Input output 都是相对与 host 来说的，输入到 host 的数据称为 input，host 输出的数据称为 output

> Bluetooth HID devices支持三种Report： `Input`, `Output`, `Feature`
>
> - **Input Reports,输入报告**
>
> Ble 中，表示 Bluetooth HID device 发送数据给 Bluetooth HID Host
> USB 中输入报告通常通过 中断输入端点来传输。当然也可以通过 控制端点由 HOST 使用 GET REPORT 控制传输请求来获取数据,即host 先发送 get report 命令，device 随后回复 input report，之后 host 会回复一个状态(0 字节数据表示成功)。
>
> - **Output Reports,输出报告**
>
> Ble 中表示 Bluetooth HID Host.发送数据给 Bluetooth HID device.
> USB 中输出报告通常通过 中断输出端点来传输。当然也可以通过 控制端点由 HOST 使用 SET REPORT 控制传输请求来发出数据，即HOST 先发送 set report 命令，随后 HOST 发送待发送的数据，最后 DEVICE 回复一个状态(0 字节表示成功)。
>
> - **Feature Reports,特征报告**
>
> Ble 中双向数据通道
>
> USB 中只能通过控制端点来传输双向数据， HOST 使用 GET REPORT 来从 DEVICE 获取数据，或者 HOST 使用 SET REPORT 发送数据给 DEVICE

> HID设备应用场景：
>
> 1. 键盘和鼠标
>
> 键盘和鼠标是最常见的HID设备之一，可以用于输入文字、控制光标等操作。
>
> 2. 游戏手柄和方向盘
>
> 游戏手柄和方向盘是常见的游戏控制器，可以实现游戏中的各种操作，如移动、跳跃、射击等。
>
> 3. 触摸屏
>
> 触摸屏可以用于移动设备上的交互，如点击、滑动、缩放等操作。
>
> 4. 扫描仪
>
> 扫描仪可以用于将文档或图片数字化，便于存储和传输。
>
> 5. 电视遥控器
>
> 电视遥控器可以通过HID设备来实现对电视的遥控操作，包括调节音量、切换频道等。

### HID Report Protocol

- 数据包格式需求-Report Map

要实现HID数据的传输，必须两者协商好一个数据包格式。而HID设备的种类多种多样，所要上报的数据格式/长度各不相同，如只有3个按键的键盘，或者全功能键盘，其所需发送的数据格式是不同的。

HID设备要满足各种稀奇古怪的需求。在HID中是通过report map来定义数据包格式

Report Map如何看呢? [HID Usage Tables 1.4 | USB-IF](https://usb.org/document-library/hid-usage-tables-14) 要对照这个文档看

> 一个Report Map对应蓝牙的一个 `Characteristic` 节点，但是在USB却是对应一个 `Interface`
>
> 蓝牙的Service下的 `Characteristic` 的数量其实还好，基本都是软件做的，但是USB设备的 `Interface/Endpoint` 基本都是硬件做的，也就是说数量是有限的

- 复合设备需求-Report ID

HID在Report Map中引入了Report ID的概念， `也就是1个Report Map中可以有多个Report ID，这样只要在每笔包之前加入Report ID，就可以在一个Characteristic/Endpoint中实现多种功能需求`



### BLE HID 服务

```cpp
HID 服务 UUID 为标准规范，为 0x1812
```

> 数据的发送都是放在 `报告中`，USB 中通过各个 `端点` 来收发数据
>
> BLE 中即通过 HID 服务下面的各个 `characteristic` 来传输和接收 HID 的报告数据



### 报告描述符

[HID Descriptor Tool描述符生成工具](https://usb.org/document-library/hid-descriptor-tool)

[报告描述符中的那些数字字符所表达的含义](https://www.cnblogs.com/image-eye/archive/2012/02/28/2372362.html)

> 需要准备两份手册：
>
> ①《Device Class Definition for Human Interface Devices (HID)》
>
> ②《Universal Serial Bus HID Usage Tables》

> 报告描述符，用于描述一个报文的结构和用途，从而使 Host 接收到 HID 报文之后，能够按照报告描述符描述的[报文格式](https://so.csdn.net/so/search?q=报文格式&spm=1001.2101.3001.7020)，来解析报文内容
>
> 一个报告描述符可以描述多个报文，不同的报文需通过报文中第一个字节所表达的 Report ID 进行区分。当报告描述符中只描述了一个报文格式，且没有描述 Report ID 时，报文中也不会有 Report ID
>
> 每一项描述基本上是由两个字节构成，第一个字节为前缀，第二个字节数据部分

- 查看描述符数组步骤

1. 

```css
// 举例假设是
0x05, 0x0c
    
则：
0x05为前缀，0x0C为数据部分    
0x05 转换为二进制为 0000 0101，按照HID协议generic item format定义，该字节分为三部分：
	【1】Bit0~Bit1表示数据部分长度----00为0个字节，01为1个字节，10为2个字节，11为4个字节(在这里我们数据部分只有一个字节0x0c)
    【2】Bit2~Bit3表示前缀的类型----00为main，01为GLobal，10为Lobal，11为预留(在这里是GLobal)
    【3】Bit4~Bit7表示前缀的tag----(在这里是GLobal)
    	1. 一般分为input(二进制的1000 00 nn)
    	2. output(二进制的 1001 00 nn)
    	3. feature(1011 00 nn)
    	4. collection(1010 00 nn)
    	5. end collection(1100 00 nn)
```

2. 根据 `前缀的类型` 去找手册①里找对应的

```bash
main --- 手册①28页
GLobal --- 手册①35页
Lobal --- 手册①39页
```



3. 根据 `数据部分` 去手册②里找对应的，有的是属于子项，需要在子项找十六进制，比如 `0x07` 是 `Keyboard`，`Keyboard LeftControl` 是属于`Keyboard`里面的，需要去手册找，找到是 `0xE0`





> 用法

在描述符中，您首先设置一个 USAGE_PAGE，并且某些 USAGE 可用，在鼠标示例中， `USAGE_PAGE（通用桌面）`允许您使用  `USAGE（鼠标）`，当使用页面更改为 `USAGE_PAGE（按钮）`时， `USAGE_MINIMUM` 和 `USAGE_MAXIMUM` 允许您指定按钮，然后才能使用 `USAGE (X)` 和 `USAGE (Y)`，使用页面更改回 `USAGE_PAGE（通用桌面）`。使用页面就像一个命名空间，更改使用页面会影响可用的“使用”。

查看 [HID报告描述符教程 手把手教你编写HID报告描述符](https://www.usbzh.com/article/detail-830.html)

- HID报告描述符USAGE_PAGE分类(这个重要)

[USAGE_PAGE分类](https://www.usbzh.com/article/detail-969.html)

```css
USAGE_PAGE，用途页，指定设备的功能
    
USAGE，用法索引，设备功能的用法
	USAGE_MINMUM，用法最大值，当一个设备由多个用法时，可指定用法的最大值和最小值，这样可以表达这个区间的所有用法
	USAGE_MAXMUM，用法最小值
    
COLLECTION，集合的开始，当设备具有多个数据集合时，需使用 COLLECTION 进行包围，类似于结构体的花括号
    
END_COLLECTION，集合的结束，类似结构体的右花括号
    
INPUT，输入数据的格式（数据/固定值，数组还是数据…）
    
OUTPUT，输出数据的格式（数据/固定值，数组还是数据…）
    
LOGICAL，数据逻辑值，由最大值和最小值决定
	LOGICAL_MINMUM，逻辑最大值
	LOGICAL_MAXMUN，逻辑最小值
    
REPORT_ID，当报告描述符中描述了多个报告时，可使用报告描述符进行区分
    
REPORT_SIZE，指定报表数据区域所包含的位数
    
REPORT_COUNT，报表中数据域的数目
```



### 名词

`Collection Application (CA)`：用于描述一个 HID 设备或者功能子集，并且与特定的应用程序或驱动程序相关联。这种集合的目的是为了将设备与其控制应用程序进行关联和交互，常见的例子包括键盘或鼠标

`Collection Physical (CP)`：用于描述一组数据项，这些数据项代表在一个几何点收集的数据点，特别适用于传感器设备。它并不表示一组数据值来自一个设备，比如键盘。在报告多个传感器位置的设备中，物理集合用于显示哪些数据来自哪个传感器。常见例子是加速度计，陀螺仪，磁力计，压力传感器，光传感器

> Usage Types (Controls) 控件类型控制

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-21_19-54-39.webp" style="zoom:80%;" />

- Linear Control (LC)

线性控制（Linear Control，LC）通常是用来操作线性数值的，比如音量调节、亮度控制等。它可以通过一对增加/减少按钮、旋钮或滑块来实现

1. 增加/减少控制：
   - 通过一对按钮来实现，需要将这两个按钮转换成一个2位有符号值，并声明为相对主项目。当值为-1时表示减少，+1时表示增加，值为0时表示没有变化。
2. 旋钮（Jog Wheel）：
   - 通常是一个自动返回到固定中心位置的旋钮，会报告一个带符号值，并声明为相对主项目。旋钮的偏移量与报告的值成比例，报告的值为-n时表示减少，+n时表示增加，值为0时表示没有变化。需要声明足够大的报告大小来容纳带符号值n。
3. 线性旋钮或滑块：
   - 被声明为绝对主项目，可以实现线性的控制，报告当前的绝对数值。



- On/Off Control (OOC)

开关控制（On/Off Control，OOC）可以通过以下几种方式来实现：

1. 两个按钮，一个代表开，一个代表关：
   - 这两个按钮被编码成一个2位有符号值，并声明为相对、无优选、主项目，逻辑最小值为-1，逻辑最大值为1。当从0过渡到-1时表示关，从0过渡到+1时表示开，值为0时表示没有变化。
2. 单按钮切换开关状态：
   - 一个按钮每次按下时切换开关状态。这个单按钮被编码成一个1位无符号值，并声明为相对、优选、主项目，逻辑最小值为0，逻辑最大值为1。从0到1的过渡切换当前的开关状态，1到0的过渡不会引起变化。
3. 切换开关机械保持状态：
   - 这种控制方式通过一个切换开关来维持开关状态。被编码成一个1位无符号值，并声明为绝对、无优选、主项目，逻辑最小值为0，逻辑最大值为1。断言1表示开，断言0表示关。

这些是实现开关控制的常见方式和声明要求，用来描述如何在HID设备中实现和声明开关控制。



- Momentary Control (MC)

瞬时控制（Momentary Control，MC）就是一个基本的按键，比如鼠标上的按钮。这种控制方式被编码成一个1位值，并声明为绝对、优选、主项目，逻辑最小值为0，逻辑最大值为1。数值为1时表示按键被按下（asserted condition），数值为0时表示按键未被按下（non-asserted condition）。



- One Shot Control (OSC)

一次触发控制（One Shot Control，OSC）是一个按下按钮触发单个事件或动作的控制方式。这种控制方式被编码成一个1位值，并声明为相对、优选、主项目，逻辑最小值为0，逻辑最大值为1。从0到1的过渡会启动一个事件，而1到0的过渡不会引起任何变化，但在下一个事件发生之前需要再次将其置为0。

举例来说，你可以想象一下电视机或显示器上的去磁按钮（degauss）。当你按下去磁按钮时，它会发出一个触发去磁的信号，屏幕上的颜色会短暂地发生变化。松开按钮后，屏幕会恢复正常。在这种情况下，每次按下按钮都只会触发一次去磁事件，必须等待按钮返回到未按下状态（0），才能再次进行去磁操作。

一次触发控制在很多电子设备中都有应用，用于触发一次性的事件或操作，例如闪光灯、报警器等



- Re-Trigger Control (RTC)

是一个按下按钮，只要保持按下状态，就会触发重复事件的控制方式。这种控制方式被编码成一个1位值，并声明为绝对、优选、主项目，逻辑最小值为0，逻辑最大值为1。从0到1的过渡会触发第一个事件，在每个事件结束时，如果控制仍然处于按下状态（值为1），则会发生另一个事件。

举例来说，你可以想象一下游戏手柄上的连续射击按钮。当你按下连续射击按钮时，它会触发第一发射击事件，然后会以一定的频率持续触发射击事件，直到你松开按钮或停止保持按下状态。在这种情况下，只要按钮保持按下状态，控制就会不断触发重复事件。

重新触发控制在很多电子设备中都有应用，用于实现连续触发或自动重复的功能，例如游戏手柄上的连发按钮、键盘上的自动重复键等



## BLE

> 参考文章

[深入浅出低功耗蓝牙(BLE)协议栈](https://www.cnblogs.com/iini/p/8969828.html)

[蓝牙 16 位通用唯一标识符 (UUID)](https://blog.csdn.net/u013564470/article/details/123606816)

[系统性简述BLE蓝牙](https://blog.csdn.net/u013564470/article/details/123524606?ops_request_misc=&request_id=&biz_id=102&utm_term=%E7%89%B9%E5%BE%81%E5%A3%B0%E6%98%8EBLE&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduweb~default-1-123524606.142^v99^control&spm=1018.2226.3001.4187)

[bluetooth官网](https://www.bluetooth.com/specifications/specs/?status=active)

[详细介绍 BLE GATT层 porfile属性 ：特征声明，特征值，特征描述符](https://blog.csdn.net/m0_73219367/article/details/133804551?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_utm_term~default-0-133804551-blog-119761424.235^v43^pc_blog_bottom_relevance_base6&spm=1001.2101.3001.4242.1&utm_relevant_index=3)

[在线 UUID 生成器](https://www.uuidgenerator.net/version4)

[在线UUID](https://www.uuid.online/)

[蓝牙 Appearance characteristic，外观 及取值参考](https://blog.csdn.net/weixin_42623551/article/details/132533008)

[ble4.2扫描回复包详解（SCAN_RSP）](https://blog.csdn.net/freemote/article/details/119216852?spm=1001.2101.3001.6650.1&utm_medium=distribute.pc_relevant.none-task-blog-2~default~OPENSEARCH~Rate-1-119216852-blog-126421897.pc_relevant_multi_platform_whitelistv3&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2~default~OPENSEARCH~Rate-1-119216852-blog-126421897.pc_relevant_multi_platform_whitelistv3&utm_relevant_index=2)

[GR551x 文档(可参考)](https://docs.goodix.com/en/goodix-web/online_api/gr551x_api_reference/233/html/d9/d45/group___b_a_s___c___f_u_n_c_t_i_o_n.html#ga4b990541b09c6cbd60a530fd8252fda4)

[初探BLE 蓝牙电池服务](https://blog.51cto.com/u_15703042/5478603)

[凌思微LE501X开发一 (蓝牙串口透传实例解析)](https://blog.csdn.net/libin55/category_9333215.html)

[低功耗蓝牙配对绑定解读和实践](https://www.cnblogs.com/iini/p/12801242.html)





> 手机下载调试APP：`BLE调试宝`

### 基础知识

- 透传

BLE透传是BLE应用中最常用的通信方式，透传及数据透明传输，这是一种工作方式，只对MCU的数据进行转发而不做任何处理

- 主机模式和从机模式

BLE中进行数据交互的双方就是主机和从机

`主机`：工作在主机模式时，可以搜索周围的设备并根据需要进行对从设备发起连接

`从机`：工作在从机模式时，无法主动搜索设备，只能发起广播被主机搜索，从设备和主机连接之后可以和主机进行数据通信

- 框架

BLE设备分为控制器与主机，并不是对应两个设备，而是一个设备的层次区分

`控制器`：物理设备，用于收发无线电信号。控制器通过天线与外界设备相连接，通过主机控制接口（HCI）与主机相连接

|          层次          |                             描述                             |
| :--------------------: | :----------------------------------------------------------: |
|         物理层         |     物理层采用2.4G无线电，简单的传输和接受电磁辐射的部分     |
|         链路层         | 链路层负责广播、扫描、建立和维护连接，以及确保数据包按正确的方式计算校验以及加密 |
| 主机/控制器接口（HCI） | 主机/控制器接口允许主机将命令和数据发送到控制器，并允许控制器将事件和数据发送到主机。HCI分为逻辑接口和物理接口两个部分。逻辑接口定义了命令和事件，可以交付给任何物理传输或通过控制器上的API交付给控制器。物理接口定义了命令、事件和数据如何通过不同的技术来传输。已经定义的物理接口包括USB、SDIO和UART |

`主机`：

1. 逻辑链路控制和适配协议（L2CAP）

逻辑链路控制和适配协议是BLE复用层，定义了两个基本概念：L2CAP信道和L2CAP信令。低功耗蓝牙只用到了最少的L2CAP功能。

2. 安全管理协议（SM）

安全管理器定义了一个简单的 `配对和密钥分发`协议。配对是一个获取对方设备信任的过程，通常采取认证的方式实现。配对之后，接着是链路加密和密钥分发过程。 `在密钥分发过程中从设备把密钥共享给主设备，当这两台设备在未来重新连接时，他们可以使用先前共享的密钥进行加密，从而迅速认证彼此身份`。安全管理器还提供了一个安全工具箱，负责生成数据的哈希值、确认值以及配对过程中使用的短期密钥。

3. 属性协议（ATT）

`服务器`：客户端提供数据服务，就是数据中心

`客户端`：从服务器读写应用数据，就是访问数据者

属性协议定义了访问对端设备上的数据的一组规则。属性协议定义了六种类型的信息：

【1】从客户端发至服务器的请求

【2】从服务器发至客户端的回复请求响应

【3】从客户端发至服务器的无需响应的命令

【4】从服务器发至客户端的无需确认的通知

【5】从服务器发至客户端的指示

【6】从客户端发至服务器的回复指示的确认

而属性是被编址并打上标签的一小块数据。每个属性均包含一个用来标识该属性唯一的句柄、一个用于标识存放数据的类型的一个值

> BLE的属性类型是有限的，可以分为四大类:
>
> Primary Service（首要服务项）
>
> Secondary Service（次要服务项）
>
> Include（包含服务项）
>
> Characteristic（特征）

4. 通用属性规范协议（GATT）

通用属性规范位于属性协议之上，定义了属性的类型及其使用方法

在GATT协议中，蓝牙设备被视为包含一组服务(Service)和特征(Characteristic)的集合体。服务表示一个或多个相关的特征，而特征则包括属性值(Value)、类型(Type)和描述符(Descriptor)。通过GATT协议，蓝牙设备可以读取和写入对应特征的属性值，并针对特定的应用需求进行相应配置。

例如，在一个智能手环和智能手机之间的连接过程中，通过GATT协议，智能手环向智能手机提供了一组服务，这些服务包括手环实时步数监控等功能，并提供相应的特征及其属性值。当用户在智能手机的应用程序中选择查看手环步数时，智能手机会向手环发送请求，通过GATT协议来读取相应的特征属性值，从而数据交互得以完成。

 `总之，GATT协议为蓝牙设备间的通信提供了标准的规范和约束，使不同类型的蓝牙设备能够相互通信和交换数据`



5. 通用访问规范（GAP）

通用访问规范定义了设备如何发现、连接，以及为用户提供有用的信息。它还定义了设备之间如何建立长久的关系，称为绑定(bonding)

同时描述了设备如何成为广播者和观察者，并且实现无需连接的数据传输



- 应用层

控制器和主机之上是应用层。应用层规范定义了三种类型： `特性(characteristic)`、 `服务(service)` 和 `规范(profile)`

|         类型          |                             描述                             |
| :-------------------: | :----------------------------------------------------------: |
| 特性(characterisitic) | 特性是采用已知格式，以通用唯一识别码(UUID)作为标记的一小块数据。由于特性要求能够重复使用，因而设计时没有设计行为 |
|     服务(service)     | 服务是指在设备或系统中定义的一组相关特性的集合，用于提供特定的功能或服务。服务可以分为首要服务和次要服务。首要服务描述设备主要提供的功能，而次要服务则是协助或支持首要服务或其他次要服务的功能 |
|     规范(profile)     | 规范是一份文档或说明，描述了两个或多个设备之间的通信协议、交互方式和拓扑结构等信息。规范定义了设备之间如何发现、连接和交互，以及客户端如何使用特性和服务。规范和服务之间存在多对多的关系，一个设备可以提供多个服务，而一个服务也可以被多个设备使用。 `Profile就是基于BLE通信的应用场景和特殊需求，为系统提供标准化的API接口`，`一个Profile通常由一个或多个服务组成，每个服务包含多个特征和描述符`，`比如，心率测量Profile规定了在使用BLE连接心率传感器时需要实现的服务和特征，包括读取心率数值、测量开始和停止等操作。只要设备符合对应Profile的规范，就能通过这些服务和特征实现设备间的无缝交互和控制` |



- BLE广播事件

`通用广播`：最常用的广播方式，可以被扫描，接收到连接请求时可以作为【从设备】进入一个连接

`定向广播`：针对于快速建立连接的需求，定向广播会占满整个广播信道，数据净荷只包含广播者和发起者地址，发起者收到发给自已的定向广播后，会立即发送连接请求

`不可连接广播`：广播数据，而不进入连接态

`可发现广播`：不可连接，但可以响应扫描

`BLE广播间隔`：是指两次广播事件之间的最小时间间隔，一般取值范围在【20ms-10.24S】之间，链路层会在每次广播时间期间产生一个随机广播延时时间【（0ms-10ms）】

广播是【从设备】发起的，可以被主设备扫描到，并能对扫描进行响应，即扫描响应

- BLE扫描事件

每次扫描，设备打开接收器去监听广播设备，这称为一个扫描事件，扫描事件有两个时间参数：

1. 扫描窗口(scan window)：一次扫描进行的时间宽度
2. 扫描间隔(scan interval)：两个连续的扫描窗口的起始时间之间的时间差，包括扫描休息的时间和扫描进行的时间

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-22_08-17-50.webp)

扫描是主机的行为

- BLE连接事件

注意，建立连接之前，走的都是广播信道，建立连接之后，就会走数据信道

1. 一个连接事件是指主设备和从设备之间相互发送数据包的过程
2. 所有的数据交换都是通过连接事件来完成
3. 每个事件发生在某个数据通道（0-36)
4. 一个连接中，主从设备依靠连接事件交换数据
5. 设备连接后，无论有无数据收发，连接事件都在按照设置的连接参数周而复始的进行着，直到一方停止响应
6. 主机与从机可在单次连接事件进行多次数据传输
7. 在连接事件之外，BLE设备处于休眠状态

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-22_08-21-07.webp)

> 连接参数
>
> 1. 连接间隔：必须是1.25ms的倍数，范围是从最小值6（7.5ms）到最大值3200（4.0s）。间隔参数包括两个16位的值，第一个为最小连接间隔，第二个为最大连接间隔。
> 2. 从机延迟：这个参数描述了从机跳过连接事件的次数。这使外围设备具有一定的灵活性，如果它不具有任何数据传送，它可以选择跳过连接事件，并保持睡眠，从而提供了一些积蓄力量。这一决定取决于外围设备。
> 3. 监督超时：这是两个成功的连接事件之间间隔的最大值。如果超过这个时间还未出现成功的连接事件，那么设备将会考虑失去连接，返回一个未连接状态。这个参数值使用10ms的步进（10ms的倍数）。监督超时时间从最小10（100ms）到最大3200（32.0s）。同时超时时间必须大于有效连接事件。

- UUID

在蓝牙协议栈中可能会有多个服务，每个服务会有多个特征值，而这些服务或者特征值都有一个唯一的ID

`通用唯一识别码`，是一个 `128位` 的数字，用来标志属性的类型

 `Service` 和 `Characteristic` 都是一种属性，都需要一个唯一的UUID来标识

因为128位的UUID相当长，设备间为了识别数据的类型需要发送长达16字节的数据。为了提高传输效率，蓝牙技术联盟(SIG)定义

了一个“UUID基数”，结合一个较短的16位数使用。二者仍然遵循通用唯一识别码的分配规则，只不过在设备间传输常用的UUID

时，只发送较短的16位版本，接收方收到后补上蓝牙UUID基数即可。

> 也就是说，不管是什么样的蓝牙设备，只要你提供**设备信息（Device Information）** 的服务功能，就必须使用 `0x180A` 的UUID号，这样，当应用程序需要读取这蓝牙设备的设备信息时，只需要找到对应UUID号为 `0x180A` 的服务，就可以获取到



- RSSI

是接收信号的强度指示

接收包RSSI是指无线模块发送信息后，接收端的无线模块接收到数据后，当前接收数据的信号强度的寄存器值，也就是接收模块获取到发送模块当前发送的信号强度

dbm是无线信号的强度单位。 `一般在 -90 ~ 0之间`

> 一般情况下：
>  `-50 ~ 0` 之间信号强度很好，使用感知好
>
> `-70 ~ -50` 之间信号强度好。使用感知略差，但体验上无明显影响
>
> `-70以下` 信号就不是太好了，使用上感知就不好

- 特征值

特征值就是BLE协议栈向外提供的一个数据接口，蓝牙之间的数据传输终落实在特征值上。在BLE协议栈的GATT层中封装了若干服务(service)，而在每一个服务中又有若干特征值(characters)，特征值可以是任意类型的数据。蓝牙之间的数据传输靠协议栈提供的write和read函数，而这两个函数就是在操作特征值

- 属性声明

> 注意：
>
> 1. **两个必需的声明是特征声明和特征值声明**
> 2. **特征值声明应紧跟着特征声明而存在**
> 3. **特征声明是一个特征的开始**

服务分为首要服务和次要服务，UUID分别为 `0x2800` 和 `0x2801`，权限是只读

包含声明的UUID为 `0x2802`，权限是只读

特征声明的UUID为 `0x2803`，权限是只读

> 特征声明有一个值，这个值有5个字节：包括特征的属性(0字节)，特征值句柄(1,2字节)，和特征UUID(3，4字节)
>
> ```bash
> 字节 0：规定了该特征的性质（property）：
> {
> 
> 0x01 ---- 允许对该特征值进行广播。
> 
> 0x02 ---- 允许读取特征值。
> 
> 0x04 ---- 允许写入特征值（没有响应）。
> 
> 0x08 ---- 允许写入特征值（有响应）。
> 
> 0x10 ---- 允许向GATT 客户端进行特征值通知（无需确认）。
> 
> 0x20 ---- 允许向GATT 客户端进行特征值指示（需要确认）。
> 
> 0x40 ---- 允许对特征值进行签名写操作。
> 
> 0x80 ---- 存在扩展性质位，该扩展性质位在特征扩展性质描述符中定义。
> }
> 
> 字节 1 - 2：表示了该特征值的句柄（handle）
> 
> 字节 3 - 4：表示了该特征值的类型（UUID）
> ```

> 常用特征UUID：
>
> |      分配类型       | 分配的UUID |              分配目标               |    中文意思    |
> | :-----------------: | :--------: | :---------------------------------: | :------------: |
> | 声明 (Declarations) | **0x2800** |           Primary Service           |    主要服务    |
> | 声明 (Declarations) | **0x2801** |          Secondary Service          |    二级服务    |
> | 声明 (Declarations) |   0x2802   |               Include               |      包括      |
> | 声明 (Declarations) | **0x2803** |           Characteristic            |      特征      |
> | 描述符 (Descriptor) | **0x2900** | Characteristic Extended Properties  |  特征扩展属性  |
> | 描述符 (Descriptor) |   0x2901   |   Characteristic User Description   |  特征用户描述  |
> | 描述符 (Descriptor) | **0x2902** | Client Characteristic Configuration | 客户端特征配置 |
> | 描述符 (Descriptor) | **0x2903** | Server Characteristic Configuration | 服务器特征配置 |
> | 描述符 (Descriptor) |   0x2904   | Characteristic Presentation Format  |  特征描述格式  |
> | 描述符 (Descriptor) |   0x2905   |   Characteristic Aggregate Format   |  特征汇总格式  |

>  一个 服务定义( service definition ) 包含：
>
> - **服务声明（Service Declaration）:** Attribute 格式定义如下表
>
> | **属性句柄 (Attribute Handle)** |                **属性类型 (Attribute UUID)**                 |      **属性值 (Attribute Value)**       |             **属性权限 (Attribute Permissions)**             |
> | :-----------------------------: | :----------------------------------------------------------: | :-------------------------------------: | :----------------------------------------------------------: |
> |             0xNNNN              | 0x2800<br>Primary Service（首要服务项） 的UUID<br>或者<br>0x2801<br>Secondary Service（次要服务项） 的 UUID | 服务(Service) 的 UUID (16bit或者128bit) | 只读（Read Only）<br>无需认证(No Authentication)<br>无需授权(No Authorization) |
>
> - **特征(Characteristic)**：一个或者多个
>
> 一个 特征定义(characteristic definition) 必须包含 `一个 特征声明` (characteristic declaration) 和一个 `特征值声明`(Characteristic Value declaration) ，可以包含 `任意数量的 特征描述符声明`(characteristic descriptor declaration) 
>

> 蓝牙名称长度可以是0至248个字节

- MTU

指BLE连接中可用于一次性传输的最大字节数

在建立BLE连接时，服务器会发送ATT MTU Request消息，要求客户端回复其支持的最大MTU大小。而客户端则会根据实际情况回复ATT MTU Response消息，并将自己支持的最大MTU大小告知服务器。在双方完成协商后，BLE连接使用的MTU大小就确定下来了，从而可以更高效地进行数据传输。

在低功耗蓝牙连接中， `ATT协议默认的MTU长度为23字节`

BLE连接所使用的MTU大小可能受到设备硬件、协议栈以及操作系统等因素的影响



- 缩写

1. DIS(设备信息服务)
2. PnP ID(即插即用)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-24_15-46-05.webp)

读取PnP ID服务可以获取设备的制造商信息

3. ntf(通知)

server发送给client端，不需要client端回复

4. req(请求)

同样是client发送给server的，需要server端发送response回复

5. cmd(命令)

一般是client发送给server的，不需要回复

6. rsp(回应)

是server发送给client端，作为client端request的回复

7. ind(指示)

server发送给client端，需要client端回复Confirmation确认

8. cfm(确认)

client端发送给server端，作为ind的确认



### 蓝牙协议栈分层

1. PHY层（Physical layer物理层）

PHY层用来指定BLE所用的无线频段，调制解调方式和方法等。PHY层做得好不好，直接决定整个BLE芯片的功耗，灵敏度以及selectivity等射频指标

2. LL层（Link Layer链路层）

用于控制设备的射频状态，控制设备会处于5种状态之一:standby（准备）、advertising（广播）、scanning（监听/扫描）， initiating（发起连接）、connected（已连接）

`链路层定义的两个角色是：主机和从机`

LL层要做的事情非常多，比如具体选择哪个射频通道进行通信，怎么识别空中数据包，具体在哪个时间点把数据包发送出去，怎么保证数据的完整性，ACK如何接收，如何进行重传，以及如何对链路进行管理和控制等等。LL层只负责把数据发出去或者收回来，对数据进行怎样的解析则交给上面的GAP或者GATT

3. HCI（Host controller interface）

HCI是可选的

HCI主要用于2颗芯片实现BLE协议栈的场合，用来规范两者之间的通信协议和通信命令等。

4. GAP层（Generic access profile）

GAP是对LL层payload（有效数据包）如何进行解析的两种方式中的一种，而且是最简单的那一种。GAP简单的对LL payload进行一些规范和定义，因此GAP能实现的功能极其有限。GAP目前主要用来进行广播，扫描和发起连接等

5. L2CAP层（Logic link control and adaptation protocol）逻辑链路控制及自适应协议层

L2CAP对LL进行了一次简单封装，LL只关心传输的数据本身，L2CAP就要区分是加密通道还是普通通道，同时还要对连接间隔进行管理

6. SMP（Secure manager protocol）

SMP用来管理BLE连接的加密和安全的，如何保证连接的安全性，同时不影响用户的体验，这些都是SMP要考虑的工作。该层定义了配对和密钥分配方式

7. ATT（Attribute protocol）属性协议层

ATT层用来定义用户命令及命令操作的数据，比如读取某个数据或者写某个数据。BLE协议栈中，开发者接触最多的

ATTAttribute除了定义数据，同时定义该数据可以使用的ATT命令，因此这一层被称为ATT层。

允许设备向其它设备展示一块特定的数据，称之为 `“属性(attribute)”`。在ATT环境中，展示 `“属性”` 的设备称之为 `服务器`，与之配对的设备称之为 `客户端`。链路层状态(主机和从机)与设备的ATT角色是相互独立的。例如，主机设备既可以是ATT服务器，也可以是ATT客户端。从机设备可以是ATT客户端，也可以是ATT服务端

8. GATT（Generic attribute profile ）通用属性配置文件层

GATT用来规范attribute中的数据内容，并运用group（分组）的概念对attribute进行分类管理。没有GATT，BLE协议栈也能跑，但互联互通就会出问题，也正是因为有了GATT和各种各样的应用profile

GATT层定义的两个角色是： `客户端和服务器`

> 这几个角色是针对特定层来说的，并不冲突，一个设备可以是客户端从机，也可以是服务器从机，既可以是客户端主机，也可以是服务器主机
>
> 主从机主要是谁广播，谁扫描；客户端和服务器主要是谁提供数据，谁接收数据
>
> 设备开机后，一开始，处于就绪态，然后从机广播，主机扫描，这个过程，需要物理层，链路层参与数据传输，GAP层参与设备识别与绑定，然后双方建立连接，连接之后，就是GATT参与的时候了，此时，主要是业务数据传输，这时候就涉及到配置文件，服务和特征等属性了。 



### 包

> 广播数据包

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-22_13-43-22.webp" style="zoom:80%;" />

数据段最大为37字节，其中广播设备的mac地址占用6字节，所以广播最大的有效的数据是31字节

广播数据包最长31字节，而这31字节又被拆成很多小数据包，每个小数据包代表一类广播数据。例如有 `设备名称数据包`，`外观数据包`， `发射功率数据包`， `服务UUID数据包`， `服务数据数据包`， `厂商自定义数据包`

- 广播数据包类型type

type值是蓝牙联盟定义的，全球统一，宏的命名是每个厂家自己定义的(下面是凌思微的)

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-22_13-49-57.webp" style="zoom:67%;" />



> 扫描数据包

BLE扫描过程中一个或多个低功耗蓝牙设备对主动扫描作出了响应，或者在被动扫描期间收到了广播。控制器Controller依次将扫描到的这些设备信息上报给Host。

要注意，扫描回复数据不能超过31字节！

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-22_22-17-29.webp)



> MAC地址

6个字节，而且每次手机重新连接它都会变，广播中不用包含地址，默认已经有了

- 分类

1. 公共地址：从IEEE购买，保证唯一性

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-22_19-00-48.webp)

2. 随机静态地址：自己定义，上电初始化完成以后不能修改。剩余46位不能全0或者全1，1个上电周期内不能变，下次上电可以变

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-22_19-02-18.webp)

3. 随机可解析私有地址：定时更新，在广播，已经连接过程中也可以修改

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-22_19-03-36.webp)

4. 随机不可解析私有地址：地址定时更新，建议15分钟跟新一次。用的比较少

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-22_19-04-24.webp)

> 外观特征

一个设备应只有一个外观特征的实例



## 问题

> ble主机和从机如何建立连接

步骤：

1. 从机广播：从机不断发送广播包告诉主机自己的存在和可用性
2. 主机扫描：主机搜索附近的从机并扫描它们发出的广播包，以确定可用设备
3. 主机请求连接：主机选择想要连接的从机并向其发送连接请求
4. 从机响应连接请求：如果从机接受连接请求，它会返回一个连接确认
5. 安全配对：此时如果有安全配对需求，则主机和从机进行配对操作（加密等）
6. 建立连接：在完成了上述步骤之后，主机和从机就成功建立起了连接，并可以进行数据传输

 `需要注意的是，BLE从机和主机之间的连接具有时限，如果长时间没有数据传输，连接可能会自动中断以节省电量。若需要维持连接，请在一定时间内进行数据交互以保持连接`

> BLE配对的相关概念

Paring（配对）和bonding（绑定）是实现蓝牙射频通信安全的一种机制，有两点需要注意：

1. 是paring/bonding实现的是蓝牙链路层的安全，对应用来说完全透明，也就是说，不管有没有paring/bonding，你发送或接收应用数据的方式是一样的，不会因为加了paring/bonding应用数据传输需要做某些特殊处理；
2. 安全有两种选项：加密或者签名，目前绝大多数应用都是选择加密