---
title: CW32_BLDC_EVA无刷电机开发板学习
cover: /img/num140.webp
categories:
  - CW32(芯源)
comments: false
abbrlink: 59555d48
date: 2023-06-11 08:51:46
---



## 前言

{% note blue 'fas fa-fan' flat %}参考文章\资源{% endnote %}

[我的项目工程github](https://github.com/luckys-yang/cw32_Project)



## 开箱

> 在公众号免费申请的板子终于到了，太开心了！现在跟饭盒派两个板子一起同步学习

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230611085409.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230611085426.webp)



## 介绍

> 这个板子主控跟饭盒派一样，都是 `CW32F030C8T6`，所以创建工程啥的都是一样这里就不写了

- 信息

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230611233255.jpg)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230611233345.jpg)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230611233334.webp)

{% endgallery %}

- 板子资源

> ◆ CPU: `CW32F030C8T6`, FLASH:64K, SRAM: 8K
>
> ◆ 1 个SWD 调试下载口
>
> ◆ 1 个电源指示灯
>
> ◆ 1 个 `0.91寸OLED` 模块接口（IIC1 PB6/PB7 已留出接口）
>
> ◆ 1 个USART 串口预留接口（PB8/PB9）
>
> ◆ 1 个ESC 串口预留接口（PB1/PB2）
>
> ◆ 1 个AD 电位器（ADC PB0）
>
> ◆ 3 个功能按钮
>
> ◆ 3 个功能指示灯
>
> ◆ 1 个专用电机接口
>
> ◆ 1 个扩展电机UVW 接口
>
> ◆ 1 个扩展电机霍尔接口
>
> ◆ 1 个NTC 温度传感器
>
> ◆ 1 个复位按钮，可用于复位MCU
>
> ◆ EG3013驱动，6路MOS控制
>
> ◆ 一路DC电源接口



{% note red 'fas fa-fan' flat %}注意{% endnote %}

工程不新建而是直接复制一份模板工程 `cw32030c8t6_template`，在它基础上进行开发学习，节省时间



## LED

- 硬件连接

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230612071818.webp)



## KEY

- 硬件连接

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230612083239.webp)



## 蜂鸣器

- 硬件连接

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230612095343.webp)