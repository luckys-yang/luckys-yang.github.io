---
title: STM32-Keil破解和配置
cover: /img/num54.webp
comments: false
tags:
  - 破解
categories:
  - 资源分享与教程
abbrlink: d68fd8c9
date: 2022-04-10 23:08:00
updated: 2022-11-13 22:17:43
---

##  前言
收集的各种报错解决方案
- [解决keil MDK 5 编译出现"Could not open file ..\output\core_cm3.o: No such file or directory"的终极超简单方法](https://blog.csdn.net/qq_42926939/article/details/89502253)

## 配置 STM32 开发环境

- 首先到官网下载  [keil MDK](https://www.keil.com/download/product/)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204102318148.jpg)

- 点击后会弹出需要填写信息的页面随便写就行了

- 写完会弹出以下页面点击下载即可

  ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204102318878.jpg)

- 下载完成安装即可，<font color='cornflowerblue'>中间无需改任何东西位置默认就行</font><font color='grey'>（由于我之前下过 keil C51 所以第一次下时我改过位置导致后面破解不了只能把 keil C51 卸了重新下 keil MDK）</font>

- 安装完成后右键<font color='red'> "以管理员身份打开"</font>然后打开破解工具开始破解

{% gallery %}
  ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204110859306.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204110859284.png)
{% endgallery %}

- 复制 ID 后打开破解工具按照下面图片步骤完成（破解工具在我书签页第一个书签）

  ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204110904654.png)

- 把复制的那串密钥粘贴到下面那个位置，点击 Add 如果成功了则上面就会显示 <font color='orange'>MDK-ARM Plus</font>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204110906694.png)

- 破解完成后还需要安装STM32的芯片包（不然你没有芯片也不能编译代码）；直接去 [MDK5 Software Packs](https://www.keil.com/dd2/Pack/# !# eula-container)下载，记得选择正确的型号，因为我的板子是 <font color='orange'>STM32F103RDT6</font>；所以我就下载 STM32F1系列的（保存目录最好存你 keil MDK 安装目录下）

{% gallery %}
  ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204110918781.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204110918078.png)
{% endgallery %}


- 下载完成后到目录找到这个 pack 双击它安装（安装过程一直 Next 即可）

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204110921163.png)

- 安装完成后打开 keil MDK 软件检查有没有这个芯片包

{% gallery %}
  ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111341088.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111341899.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111341570.png)
{% endgallery %}

这样就完成了！！！

##  配置 C51 开发环境

如果还想写 51单片机代码则还想要配置 C51的密钥，首先下载 <font color='orange'>MDK-C51</font>配置（压缩包在书签第一个）

- 将 MDK-C51解压后可以看到这些文件

  ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111349583.png)

- 然后将 C51.zip 复制到你的 Keil MDK 安装目录下然后解压（不知道安装目录的可以右键你的 Keil MDK 找到"<font color='orange'>文件所在位置</font>"）

  ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111353954.png)

<font color='cornflowerblue'>这是解压后的部分文件截图：</font>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111354475.png)

- 然后把之前 MDK-C51解压后的 C51配置代码.txt 用记事本打开，修改 <font color='orange'>PATH</font>的路径为你 Keil MDK 的安装目录（就是刚刚的"文件所在位置"）

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111359847.png)

- 然后打开 Keil MDK 安装目录下的 <font color='orange'>TOOLS.INI</font> 配置文件，将上面修改好路径的配置代码复制到该文件的<font color='orange'>末尾</font>然后保存即可（如果提示权限不足，建议用管理员权限打开此配置文件）

{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111403757.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111403923.png)
{% endgallery %}

- 然后打开 Keil MDK，打开刚刚的 <font color='orange'>License Management</font> 复制 ID 到破解工具那生成秘钥然后激活即可

{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111407801.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111408500.png)
{% endgallery %}

- 51单片机系列的选<font color='red'> AT89C52 </font>即可（头文件是：<font color='orange'># include "reg52.h"</font>）

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111412274.png)

好了，现在可以愉快的敲代码了



##  美化代码界面

一开始代码界面是[默认](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E6%96%87%E6%9C%AC/%E9%BB%98%E8%AE%A4.prop)的，有的人可能就不太习惯，比如我（我一开始接触C语言就是在 VS2019 上敲的，实在太舒服了）；但是 Keil 没有设置代码配色方案的 UI 支持，所有的配色方案都是在安装目录下的 <font color='orange'>/UV4/global.prop</font> 文件中定义，可以自行设计配色方案。这里分享好看的几款（下载后直接覆盖重启 Keil 即可）：

 [global.prop（sublime风格）](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E6%96%87%E6%9C%AC/1.prop)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111506994.png)


[global.prop（VScode风格）](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E6%96%87%E6%9C%AC/2.prop)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111545687.png)

<font color='red'>注意：</font>重启打开项目会出现注释乱码这需要手动修改设置，这样注释就恢复了

{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111547157.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111548471.png)
{% endgallery %}


##  插件

{% btns rounded grid5 %}
{% cell 下载,https://www.aliyundrive.com/s/AVCfSjG1utZ, fas fa-download %}
{% endbtns %}

- CoolFormat(代码格式化2)
- AStyle(代码格式化1)
- DateTime(当前时间)
- FunctionComment(函数注释)
- FileComments(文件注释)



##  嵌入式开发工具

[RT-Thread Studio - RT-Thread物联网操作系统](https://www.rt-thread.org/page/studio.html)

##  参考文章
vscode开发单片机：https://blog.zeruns.tech/archives/690.html