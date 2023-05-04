---
title: 中间人攻击之ARP欺骗
cover: /img/num63.webp
comments: false
categories:
  - 资源分享与教程
abbrlink: 89dd0605
date: 2022-03-16 20:10:00
updated: 2022-06-09 00:03:42
---

{% note red 'fas fa-fan' flat %}前言{% endnote %}

本文章来自于原创[中间人攻击之ARP欺骗 – 青云博客 (qinglin.co)](https://blog.qinglin.co/1410.html)

##  中间人攻击

中间人攻击（Man-in-the-MiddleAttack，简称“MITM攻击”）是一种“间接”的入侵攻击，这种攻击模式是通过各种技术手段将受入侵者控制的一台计算机虚拟放置在网络连接中的两台通信计算机之间，这台计算机就称为“中间人”。 SMB会话劫持、DNS欺骗等技术都是典型的MITM攻击手段。在黑客技术越来越多的运用于以获取经济利益为目标的情况下时，MITM攻击成为对网银、网游、网上交易等最有威胁并且最具破坏性的一种攻击方式。

##   ARP欺骗

又称ARP毒化（ARP poisoning，网络上多译为ARP病毒）或ARP攻击，是针对[以太网](https://baike.baidu.com/item/以太网)[地址解析协议](https://baike.baidu.com/item/地址解析协议)（[ARP](https://baike.baidu.com/item/ARP)）的一种攻击技术，通过欺骗局域网内访问者PC的网关MAC地址，使访问者PC错以为攻击者更改后的MAC地址是网关的MAC，导致网络不通。此种攻击可让攻击者获取[局域网](https://baike.baidu.com/item/局域网)上的数据包甚至可篡改数据包，且可让网络上特定计算机或所有计算机无法正常连线。例如：将自己的MAC地址分别发送给主机A和主机B，然后，欺骗主机A和B，让它们以为已经连接到对方实际上则是连接到中间人攻击者主机C上了。然后两者之间的通信都经过主机C。

{% note blue 'fas fa-fan' flat %}实验目的{% endnote %}

监听并下载受害者在浏览器访问网站的图片(懂得都懂)除了这个还能让目标主机<font color='orange'>断网或限速</font>

{% note blue 'fas fa-fan' flat %}实验说明{% endnote %}

- 攻击机：kali linux（192.168.170.129）
- 靶机：ubuntu linux（192.168.170.128）
- 攻击工具：ettercap工具和driftnet工具
- 环境：同一局域网并且靶机防火墙关闭状态

首先得知道靶机的<font color='orange'>ip和网关</font>，并且防火墙是<font color='orange'>关闭</font>状态，同一个局域网网关是相同的，知道靶机IP就行了。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317221722.jpg)

然后来到kali，先确保kali里有 <font color='red'>driftnet</font>

Driftnet监视网络流量，并选择并显示JPEG，GIF和其他图像格式进行显示。
它还可以从网络中提取MPEG音频数据并进行播放。

github地址：[GitHub - deiv/driftnet](https://github.com/deiv/driftnet)

- 检查是否有driftnet工具，执行命令：

```bash
driftnet -h
```

- 如果提示："<font color='orange'>bash: driftnet: command not found</font>"就需要安装一下，执行命令：

```bash
apt-get install driftnet
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317221940.png)

- 查看IP转发，<font color='orange'>1 </font>则表示开启, <font color='orange'>0</font> 则表示关闭

```bash
cat /proc/sys/net/ipv4/ip_forward
```

 <font color='orange'>开启IP转发</font>，命令的中0是禁止数据包转发，1表示允许，该命令的意思是把 1 写入 /proc/sys/net/ipv4/ip_forward 文件中

```bash
echo 1 >/proc/sys/net/ipv4/ip_forward
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317223006.png)

-  接下来启动 <font color='red'>ettercap </font>（一般kali自带有的）

```bash
ettercap -G
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317223201.png)

<font color='orange'>先扫描主机，再显示主机列表</font>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317223432.png)

把<font color='orange'>网关</font>添加到<font color='cornflowerblue'>Add to Target 1</font> ，<font color='orange'>靶机ip</font>添加到<font color='cornflowerblue'>Add Target 2</font>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317223720.png)

<font color='orange'>右边选择ARP投毒 -> ok</font>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317224104.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317224122.png)

<font color='orange'>点击左边开始</font>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317224218.png)

-  现在已经启动了arp投毒，接下来<font color='orange'>新建终端</font>启动driftnet（可以查看靶机浏览网站的图片）
- <font color='red'>注意：</font>如果你的攻击机不是 kali 是 ubuntu 则这里不是 "<font color='orange'>eth0</font>"，而是 "<font color='orange'>ens33</font>",后面步骤也是把所有的 "<font color='orange'>eth0</font>" 替换成 "<font color='orange'>ens33</font>"

```bash
driftnet -i eth0
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317224801.png)

- 回到<font color='orange'>ubuntu linux</font>靶机上，随便在浏览器打开一个<font color='orange'>http协议</font>的网站，只能看到是http网站上的图， https网站上的图抓不到。

- 在 kali 可以监听到靶机浏览网站的图片

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317225636.jpg)

- 接下来可以把监听到的图片下载到指定目录下，例如保存到 /tmp 目录

```bash
driftnet -i eth0 -a -d /tmp
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317230153.png)

同时使用tcpdump抓包（当然也可以使用wireshark实时抓包并显示，但对本机压力比较大，建议使用tcpdump抓包，完成后再用wireshark显示）
经过一段时间的抓包之后就可以停止了。打开wireshark分析捕获到的数据包分析，使用过滤语法，找出含有cookies的数据包

复制出cookies的值，并在浏览器中利用，这里推荐一款好用的cooikes利用工具cookie-injecting-tools（地址：https://github.com/lfzark/cookie-injecting-tools）。
利用成功后，刷新页面，就可以进入到被人的主页和网盘了

不过现在大多数电脑都有防火墙所以这东西只能拿来自己电脑玩玩