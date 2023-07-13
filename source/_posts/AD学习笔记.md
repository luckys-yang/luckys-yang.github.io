---
title: AD学习笔记
cover: /img/num145.webp
categories:
  - 硬件
comments: false
abbrlink: 7c82ff4
date: 2023-07-08 12:46:59
---



## 前言

{% note blue 'fas fa-fan' flat %}软件{% endnote %}

[AD软件-百度网盘-提取码2ulv](https://pan.baidu.com/s/1_tn5dTqo3VWMb3p3h9HIjg)



## 智能车4层板

[Altium Designer 20 19（入门到精通全38集）四层板智能车PCB设计视频教程](https://www.bilibili.com/video/BV16t411N7RD/?p=5&spm_id_from=pageDriver&vd_source=5fb3f08926cbdbc6d84b3f2bda38c0b1)

### 新建工程

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230708221215.webp)

然后新建原理图库，CTRL+S保存

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/3534dffdsfsdf.webp)

新建原理图，保存

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230708222352.webp)

新建PCB元件库，保存

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230708222545.webp)

新建PCB，保存

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230708222708.webp)

> 创建完是这样的
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230708223546.webp)



### 元件库介绍以及电阻容模型创建

选中原理图库，然后点击右下角状态栏的 Panels(如果没有状态栏则在上面视图那勾选)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230708224045.webp)

元件符号(原理图上的表现形式): 包含 `元件边框、管脚（管脚序号，管脚名称）、元件名称、元件说明`，用来建立电气连接关系。

放置的引脚默认长度可以在设置里修改，我一般改为一个格子长，`100mil`，还有放置线的颜色也可以改一下(这样就不用每次在属性里改了)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230709121635.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230709123007.webp)

放置的过程中同时按 `tab键` ，可以调出属性设置。放置后通过 `双击` 也可调出属性设置。

> 设置管脚，边框时，格点的大小决定了边框的位置，一般把格点设置为 `20mil`，也可以快捷键 `G` 切换格点大小
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230708231251.webp)
>
> 有四个点的一端叫电气连接点(也有叫热点的)，具有电气属性，注意不要放反,—般至于两侧
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230708231528.webp)

点击放置管脚时，如果点击TAB键则可以在旁边设置属性，比如修改引脚序号隐藏等等

放置第二个管脚：可点击第一个管脚并按住 `Shift键` 拖动复制，然后可以进行隐藏叠着的引脚名称，双击管脚在属性里点击那个眼睛即可

位号一般是电阻是 `R?`，电阻值暂时不写因为工程里一般有很多阻值的电阻

还有引脚号一般不分正负的都隐藏，只有分正负的才显示

【Links】栏可以添加厂家名称和链接

【Footprint】栏是封装

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230709122444.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230709122434.webp)

> 无极性电容也是这样画，位号一般是电容是 `C?`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230709123546.webp)

> 极性电容的话负极要用贝塞尔曲线画(确定起点弯曲点终点即可)，然后在正极那添加字符串 `+` 字体换一下即可

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230709124341.webp)



### IC创建

> 位号一般用 `U?`，器件管脚名称直接复制原理图即可，然后双击引脚粘贴即可

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230710085608.webp)

> 画第二个，需要注意管脚Name竖向怎么改成横向，可以在下面位置修改

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230710090736.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230710091116.webp)



### 排针类创建

> 管脚号不推荐隐藏，名称可以隐藏

> 创建排针这种管脚大于5个以上最好使用阵列，主增量表示间隔多少，如果设置为2，则序号变成1,3,5,7...

> 此示例我主增量和次增量都选择2,

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230710095309.webp)

### 二极管与光耦的创建

> 二极管

使用多边形画，然后填充颜色，那条竖杠可以先把格点设置为1mil，然后点击多边形，绘制一个长矩形即可填充颜色最后，画完把格点设置回之前即可

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230710182859.webp)

> 光耦

画线条，然后末尾或者开头可以选择图形

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230710184056.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230710190657.webp)



## 杜洋AD入门

[入门PCB设计（全30集带目录） 杜洋工作室 AD09](https://www.bilibili.com/video/BV1w7411s7De/?spm_id_from=333.337.top_right_bar_window_history.content.click&vd_source=5fb3f08926cbdbc6d84b3f2bda38c0b1)



### 在原理图增加元器件以及自定义元器件

`原理图的器件不需要跟实物外观一模一样，这个跟PCB库不一样，PCB库注重的是器件的尺寸封装那些，原理图的话只需要引脚啥的数量对上就行了，外观不重要`

官方库可以在原理图界面点击【放置器件】，然后右边栏就可以看到有很多器件了,这两个库就是官方库

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230709134402.webp)

> 官方库直接拖过去就行了

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230709192715.webp)

> 画IC

习惯把1脚放在十字那

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230709193947.webp)





## 问题

> - 中英切换
>
> 点击设置勾选本地重新启动软件即可
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230708220430.webp)

> 100mil = 2.54mm

> 如果需要在字母上面加横杠，则修改名字，在每一个单词前加一个 `\` 即可

## 常用快捷键

- 画原理图元件库

> 按住鼠标中键往前推往后推可以实现放大缩小比CTRL+滑轮方便

> CTRL+鼠标右键可以快速放大缩小

> 依次点击键盘 `VGS` 调出格点大小调整

> 鼠标选中元器件，按SHIFT键然后拖动就可以复制一个出来，此处出来的序号会递增，直接CTRL+C的序号不会递增，也可以放置引脚时按TAB改【Designator】为1，然后下一个默认递增2,3,4...

> 选中器件，依次按 `EMS`即可移动对象

> 镜像--复制对象，粘贴时按 `Y`

> 多选对象--选中一个后按SHIFT可以多选

- 画原理图

> 画线--按 `p` 再按 `w`

> 自定义快捷键，比如对齐等等，首先按 `A` 弹出对齐选项页面，然后按住 `CTRL` 键点击一下选项弹出
>
> 可以设置：
>
> 左对齐--4，右对齐--6，上对齐--8，下对齐--2
>
> 水平分布--7，垂直分布--9
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230710092451.webp)