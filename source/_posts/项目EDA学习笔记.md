---
title: 项目EDA学习笔记
cover: /img/num146.webp
categories:
  - EDA
comments: false
abbrlink: a252d5b8
date: 2023-08-19 09:51:44
---



{% note blue 'fas fa-fan' flat %}开源项目{% endnote %}

[自制openmv](https://github.com/xxl1998/OpenMVX)

{% note blue 'fas fa-fan' flat %}参考文章{% endnote %}

[开源自制openmv全部资料，包含原理图PCB等整个工程与简易教程](https://blog.csdn.net/weixin_43153721/article/details/103296453?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522169266987016777224481919%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=169266987016777224481919&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~top_positive~default-1-103296453-null-null.268^v1^koosearch&utm_term=openmv4%E5%8E%9F%E7%90%86%E5%9B%BE&spm=1018.2226.3001.4450)

[嘉立创EDA与AD、PADS、OrCAD之间的PCB互转](https://m.elecfans.com/article/2103121.html)

[AT24C08读写注意](https://www.amobbs.com/thread-5599144-1-1.html)

[AT24C04、AT24C08、AT24C16系列EEPROM芯片单片机读写驱动程序](https://blog.csdn.net/wanglong3713/article/details/124618724)

[OpenMV 屏幕 ST7735 教程](https://educ8s.tv/openmv-screen-st7735-tutorial/#)

[高速电路设计实践读书笔记](https://blog.csdn.net/pythph/article/details/109481030?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522169355012916800227425928%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fblog.%2522%257D&request_id=169355012916800227425928&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~first_rank_ecpm_v1~rank_v31_ecpm-2-109481030-null-null.268^v1^koosearch&utm_term=%E7%8E%8B%E5%89%91%E5%AE%87&spm=1018.2226.3001.4450)



##  智能平衡车

- 原理图

注意封装

- PCB

12V转5V还是不行，原因待找，其他正常

## STM32F407VET6核心板

- 板子外设设计

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230825123339.webp)



> 这两个引脚手册说接一个2.2uF的电容到地
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230822214452.webp)

> 在无源晶振应用方案中，两个外接电容能够微调晶振产生的时钟频率。而并联1MΩ电阻可以
>
> 1. 帮助晶振起振(晶振输入输出连接的电阻作用是产生负反馈，保证放大器工作在高增益的线性区，一般在M欧级)。因此，当发生程序启动慢或不运行时，建议给晶振并联1MΩ的电阻，并联1M电阻增加了电路中的负性阻抗（-R），即提升了增益，缩短了晶振起振时间，达到了晶振起振更容易之目的，在低温环境下振荡电路阻抗也会发生变化，当阻抗增加到一定程度时，晶振就会发生起振困难或不起振现象。这时，我们也需要给晶振并联1MΩ电阻，建议为了增加振荡电路稳定性，给晶振同时串联一个100Ω的电阻，这样可以减少晶振的频率偏移程度
> 2. 限流的作用，防止反向器输出对晶振过驱动，损坏晶振，有的晶振不需要是因为把这个电阻已经集成到了晶振里面
>
> `注意`：并联电阻不能太小，串联电阻不能太大。否则，在温度较低的情况下不易起振
>
> `调整电容可微调振荡频率`：一般情况下，增大电容会使振荡频率下降，而减小电容会使振荡频率升高

> BOOT引脚接地问题？
>
> 如果直接接地的话要是因为外界干扰或电源波动让地上有突发波动脉冲，往往立即反应到管脚上。若恰好此时采样就可能误判而进入非用户程序区启动模式。对于电磁干扰厉害的应用场合，要特别注意这点，但是如果串联的那个电阻太大呢？不难理解，该电阻越大，该脚的低电位就越不明朗。大到一定程度后，遇到个别因素【比方电源的波动、外界干扰、内阻个体差异等因素】个别时刻可能产生误触发，导致对该脚电平的误读误判，进而让芯片进入非用户程序区的启动模式。最终给人感觉就是用户程序没有得以运行。`在发生上述情况时，看门狗往往也不起作用`
>
> 所以，总的来讲，若BOOT脚需要低电平的话，建议接个10K上下电阻到地，不建议直接接地，阻值也不要过大

- 原理图PCB与3D

> 2023.8.25更新---V1

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230825100422.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230825100839.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230825100858.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230825100916.webp)

{% endgallery %}



## openMVH7

> 主控选择STM32H743VIT6，注意是V版
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230825142459.webp)
>
> 摄像头选择OV7725

- 注意

> FPC座是0.5mm 24P 翻盖下接
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230825140058.webp)

> 没有BOOT1引脚，只有BOOT0

> 无源晶振选择了贴片，焊接需要注意引脚
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230829102735.webp)

> Micro 5P插座 贴片有卷边
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230829112012.webp)

> VBUS引脚是为了监测USB的连接问题，它是使用PA9，与USART1_TX复用
>
> 要使用STM32微控制器的USB功能，需要将FS_DP和FS_DM引脚正确连接到USB插座或其他USB设备上
>
> FS_DP(+) 和 FS_DM(-) 是差分传输线，用于在USB设备上进行数据的传输。这两个引脚是USB的数据线，用于传输USB信号

> 屏幕是ST7735S,可参考原版引脚分布
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230830090358.webp)
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230830090409.webp)
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230830090644.webp)
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230830090657.webp)

> 支架选择这种，所以需要提前在openmv上打孔
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230830103925.webp)



- 原理图PCB与3D

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230830173650.webp)



## F407VET6底板1号

> 基于之前做的VET6核心板做的底板，然后加上各种传感器

> DC-DC部分，注意功率电感的选择，选择电流大的，看饱和电流

> 核心板尺寸看上面
>
> 支架的话看这个
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230903183508.webp)
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230903185522.webp)
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230903193703.webp)
>
> <img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230905140921.webp" style="zoom:50%;" />
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230905140930.webp)
>
> <img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230905140942.webp" style="zoom: 67%;" />



## 注意汇总

> PCB布线步骤：
>
> 1. 规划电源
>
> 2. STM32
> 3. 外设–固定引脚
> 4. 外设–可映射，适当调整原理图，以方便布线
> 5. 电源信号，5V，4v，3.3V - 外设
> 6. 地线处理
> 7. 规则检查
> 8. 铺铜

> 芯片相邻引脚如果网络标号一样不要直接相连，应该引出来再连接

> 连接晶振的电容的地在旁边打多几个GND过孔围着晶振可以避免串扰

> 电源线设置为30mil，信号线设置为10mil宽度，如果大电流的话比如3A最好线宽加到40mil以上

> 走线**以底层走线为主**，走不通的可以切换到内层1进行连接，走线过程中**优先走直线**，需要拐弯的地方以圆弧拐弯或钝角为主，最后**加上泪滴**，添加丝印标记

> 每一层的切换快捷键为：顶层：**T**；底层：**B**；内层1：**1**；内层2：**2**，在右侧图层面板中选择要走线的层；(专业版的快捷键是前面加个 `ALT`)

> 输入电容要靠近IC引脚，电感也是，滤波电容的话靠近电感

> 粗线的话可以用铜皮代替

## 立创EDA使用汇总

> 专业版里绘制板框，用矩形然后切换mm，100x100mm即可，如果需要圆角则圆角半径10mm
>
> 选择4层板
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230819173211.webp)

> 在原理图里拉框选中元器件在上方点击【设计】->【交叉选择】就可以跳转到PCB中选中的部分，此时可以右键选择【高亮选中】那就一直高亮你想看的元器件了( `注意必须是打开的是自己的工程才能这样，在线打开开源里面的不能交叉选择需要先保存为自己工程才能！！！`)

> 板框的话如果复杂就要用CAD画然后导入，只能导入DXF格式

> 过孔尺寸一般信号的话是内直径12mil外直径24mil，电源的话内直径15mil外直径30mil
>
> 在布线过程中可以通过快捷键 SHIFT+V，或 CTRL+右键菜单进行切换常用的过孔尺寸

> Shift + S可以切换当前图层的亮度，将其他图层的元素变暗

> 从焊盘引出的过孔应离焊盘远一些,至少间距20mil

> 完整地平面又是怎么回事呢？原因是在顶层的地方由于走线的原因导致有些地方间距特别小，这时候这些区域就被包围起来了，没有和大部队的铜连接起来，那么这些区域里的地的电势就不和其他地方相同，这种时候只需将这些区域通过通孔将其连接到底层的地平面就可以了。

## AD导入到EDA专业版

> 1. AD软件里导出PCB时选择 `ASCII` 编码格式，原理图也是，然后把他们一起压缩为zip格式压缩包
> 2. 打开嘉立创专业版，左上角导入AD，选择刚刚压缩的压缩包即可，会弹出框让你选择一些配置，这个看需要也可以直接点确定 