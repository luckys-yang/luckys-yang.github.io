---
title: Linux课程记录
cover: /img/num122.webp
categories:
  - Linux
comments: false
abbrlink: 83652de0
date: 2023-04-03 12:11:18
---

## Putty连接Ubuntu

- 首先 ubuntu 安装 ssh服务

```bash
sudo apt-get install openssh-server
```

- 手动启动ssh服务

```bash
sudo systemctl start ssh
```

- 查看ssh是否成功启动

```bash
sudo systemctl status ssh
```

输入后会显示一些信息，包括当前状态、最近一次的活动时间、PID 等信息，`running` 表示ssh服务正在运行

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230403122310.webp)

- 输入命令查看ubuntu的服务器ip地址

```bash
ifconfig
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230403123017.webp)

- 查看ssh服务是否正在监听

```bash
sudo ss -tunlp | grep sshd
```

- 查看防火墙是否关闭

```bash
ufw status

# 关闭防火墙
ufw disable
```

- window关闭防火墙

```
firewall.cpl
```

