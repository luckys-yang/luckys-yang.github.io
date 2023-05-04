---
title: 中间人攻击之DNS劫持
cover: /img/num64.webp
comments: false
categories:
  - 资源分享与教程
abbrlink: c550940b
date: 2022-03-18 17:49:00
updated: 2022-06-09 00:07:04
---

{% note red 'fas fa-fan' flat %}前言{% endnote %}

本文章来自于原创[中间人攻击之ARP欺骗 – 青云博客 (qinglin.co)](https://blog.qinglin.co/1410.html)

##  DNS劫持

DNS劫持就是通过劫持了DNS服务器，通过某些手段取得某域名的解析记录控制权，进而修改此域名的解析结果，导致对该域名的访问由原IP地址转入到修改后的指定IP，DNS欺骗其实并不是真的“黑掉”了对方的网站，而是冒名顶替，其结果就是对网址不能访问或访问的是假网址，从而实现窃取资料或者破坏原有正常服务的目的。简而言之就是针对某一个用户，使得其访问的网站均为黑客提前设置好的web页面，例如，伪造路由器登录地址或者其他登录页面，盗取登录账号密码

{% note blue 'fas fa-fan' flat %}实验目的{% endnote %}

替换受害者访问的页面

{% note blue 'fas fa-fan' flat %}实验说明{% endnote %}

- 攻击机：kali linux（192.168.170.129）
- 靶机：ubuntu linux（192.168.170.128）
- 攻击工具：kali linux系统下的ettercap工具
- 环境：同一局域网并且靶机防火墙关闭状态

<font color='orange'>先修改kali里的两个文件</font>

- 修改 <font color='orange'>/var/www/html/index.html</font>，(前提是把你用户名权限修改成0，可以参考文章[VM安装kali# Kav (yang5201314.cn)](https://yang5201314.cn/posts/19d3.html# 31-修改成-root-权限)) ，这个文件是劫持之后跳转的页面，可以直接用记事本打开，也可以用终端命令打开，写入自己页面（我在网上随便找了一份代码粘贴上去）

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220318180530.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220318181614.png)

- 修改<font color='orange'> /etc/ettercap/etter.dns</font>，添加以下记录 <font color='orange'>* A  192.168.170.129</font> 

  <font color='cornflowerblue'>*</font>代表所有网站（也可以指定某个网站），<font color='cornflowerblue'>A</font>是解析类型，<font color='cornflowerblue'>后面ip</font>是攻击者要欺骗为的ip（记得把前面# 号删除）

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220318182310.png)

- 然后把权限改一下，不然打不开浏览器 (因为我是kali ,其他系统自行测试)，<font color='orange'>"×××"</font>就是你用户名

```bash
cd /home/×××
```

```bash
chown -R root ./
```

-  接下来启动apache网站服务器

```bash
 systemctl start apache2
```

- 在浏览器打开看一下是否正常 (输入你ip)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220318185950.png)

- 再启动<font color='orange'>ettercap</font>工具

```bash
ettercap -G
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220318190317.png)

- 还是老样子，先扫描主机再列出主机，然后把<font color='orange'>网关</font>添加到<font color='cornflowerblue'>Add to Target 1</font> ，<font color='orange'>靶机ip</font>添加到<font color='cornflowerblue'>Add Target 2</font>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220318190525.png)

-  点击右上角三点 ---【plugins】---【manage plugins】

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220318190752.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220318190720.png)

- <font color='orange'>右键</font>启动<font color='orange'>dns_spoof</font>，左边有个 <font color='orange'>*</font> 号就是开启了

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220318190826.png)

- 来到 ubuntu 这边，随便打开一个<font color='orange'>http</font>网站，可以看到已经跳转到了指定页面上，随便<font color='orange'>ping</font>一个域名也是被劫持到了该IP上，并且访问https网站会显示 "<font color='orange'>连接失败</font>"，并且我的 kali机会记录受害者访问 http 协议的网址

{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220318191310.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220318191142.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220318191604.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220318192139.png)
{% endgallery %}


劫持过的网站，即使停止劫持，工具那边停止攻击之后，靶机再次访问之前被劫持的网站，仍然是被劫持时的界面。
主要是运营商以节省跨省流量结算费用为目标进行DNS劫持。当运营商系统发现HTTP访问的域名时会在区域内的服务器中缓存一份资源，后续用户再请求的时候其域名解析会被解析到运营商的服务器上去由运营商的服务器直接返回内容。

其应对方法只有使用HTTPS，但并不仅仅是在原有的域名HTTP的基础上切换HTTPS那么简单，还需要保障这个域名不支持HTTP访问并且没有被大范围使用HTTP访问过，如果不这样做的话会出现一个问题，运营商在DNS解析的时候并不知道这个域名是用什么协议访问的，当之前已经记录过这个域名支持HTTP访问后，不管后续是否是HTTPS访问，都会进行DNS劫持，这是如果使用的是HTTPS访问，会因为运营商的缓存服务器没有对应的SSL证书而导致请求无法建立链接，这时就会遇到请求失败的问题。

<font color='orange'>所以该怎么恢复呢？</font>

- 其实也很简单直接重启或者只需两条命令

```bash
sudo systemd-resolve --flush-caches
```

```bash
sudo systemd-resolve --statistics
```

可以看到DNS缓存大小为<font color='orange'>0</font>了，打开浏览器也可以用了

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220318193632.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220318193644.png)