---
title: ASR_PRO语音笔记
cover: /img/num151.webp
categories:
  - 细化学习
comments: false
abbrlink: e561ca0d
date: 2023-09-15 11:00:05
---



## 前言

{% note blue 'fas fa-fan' flat %}参考文章/资料{% endnote %}

[ASRPRO学习资源汇总](https://haohaodada.com/new/bbs/forum.php?mod=viewthread&tid=867&extra=)

[ASR论坛](https://haohaodada.com/new/bbs/forum.php)



## 基本操作及注意事项

> PA4引脚是下载引脚，设计时需要上拉不能悬空

> 字符编程下右键可以用vscode打开，然后在里面进行编写，然后保存后ASR_Block会自动同步的，下载的话还是在ASR_Block里面

> 打断功能，语音在播报长的内容时可以打断，需要在字符模式下操作，把 `user_config.h` 里面的 `USE_AEC_MODULE`(使用回声消除模式) 打开置1然后重新编译
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230915110729.webp)
>
> 在终端里面输入 `./rebuild` 回车即可
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230915111014.webp)



## 项目1--圆梦杯小车

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230915202523.webp)