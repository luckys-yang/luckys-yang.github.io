---
title: git使用
cover: /img/num121.webp
categories:
  - Git
comments: false
abbrlink: 4896de77
date: 2023-03-29 11:41:28
---



## 前言

{% note blue 'fas fa-fan' flat %}参考文章{% endnote %}

[使用 Github Action 自动部署 Hexo 博客](https://ll.sc.cn/posts/10d9/)

## 我的Git仓库

https协议访问经常访问不了，ssh安全快速

- [【博客推送】仓库](https://github.com/luckys-yang/luckys-yang.github.io)

```bash
git@github.com:luckys-yang/luckys-yang.github.io.git
```

- [【博客源码】仓库](https://github.com/luckys-yang/my_blog)

```bash
git@github.com:luckys-yang/MyBlog_Code.git
```

- [【嵌入式应用开发-主车程序】仓库](https://github.com/luckys-yang/Embedded_Main_Car)

```bash
git@github.com:luckys-yang/Embedded_Main_Car.git
```

- [【嵌入式应用开发-龙芯1B程序】仓库](https://github.com/luckys-yang/LongXin1B)

```bash
git@github.com:luckys-yang/LongXin1B.git
```

- [【嵌入式应用开发-从车程序】仓库](https://github.com/luckys-yang/Embedded_From_Car)

```bash
git@github.com:luckys-yang/Embedded_From_Car.git
```

- [【蓝桥杯嵌入式G4历届省赛程序】仓库](https://github.com/luckys-yang/lan_G4_SS)

```bash
git@github.com:luckys-yang/lan_G4_SS.git
```

- [【宿舍指纹锁-项目】仓库](https://github.com/luckys-yang/Dormitory_Fingerprint_Lock)

```bash
git@github.com:luckys-yang/Dormitory_Fingerprint_Lock.git
```

- [【GD32F103VET6学习笔记代码】](https://github.com/luckys-yang/MyGD32F103VET6_Study_Code)

```bash
git@github.com:luckys-yang/MyGD32F103VET6_Study_Code.git
```

- [【我的博客文章备份】](https://github.com/luckys-yang/my_article/tree/master)

```bash
git@github.com:luckys-yang/my_article.git
```

- [【备用仓库mdcm那个博客的】](https://github.com/luckys-yang/blog_codee)

```bash
git@github.com:luckys-yang/blog_codee.git
```

- [【CW32学习笔记】](https://github.com/luckys-yang/cw32_Project)

```bash
git@github.com:luckys-yang/cw32_Project.git
```

- [【硬件进阶学习-硬件家园】](https://github.com/luckys-yang/Advanced-hardware_study)

```bash
git@github.com:luckys-yang/Advanced-hardware_study.git
```

- [【MSP430F149学习-硬件家园】](https://github.com/luckys-yang/MSP430F149_study)

```bash
git@github.com:luckys-yang/MSP430F149_study.git
```

- [【C#学习笔记-硬件家园】](https://github.com/luckys-yang/C-)

```bash
git@github.com:luckys-yang/C-.git
```

- [【github主页的】](https://github.com/luckys-yang/luckys-yang)

```bash
git@github.com:luckys-yang/luckys-yang.git
```

- [【百科荣创-安卓例程】](https://github.com/luckys-yang/Car2021_Example_v1.2)

```bash
git@github.com:luckys-yang/Car2021_Example_v1.2.git
```

- [【博客评论系统-giscus】](https://github.com/luckys-yang/blog_giscus)

```bash
git@github.com:luckys-yang/blog_giscus.git
```

- [【文件模块等等】](https://github.com/luckys-yang/manual/tree/master)

```bash
git@github.com:luckys-yang/manual.git
```

- [【圆梦杯2023】](https://github.com/luckys-yang/Dream_Cup2023)

```bash
git@github.com:luckys-yang/Dream_Cup2023.git
```



## Git推送流程

- 新建仓库然后推送流程

```bash
git init
```

```bash
git remote add origin 仓库链接
```

```bash
git pull origin master
```

```bash
git add .
```

```bash
git commit -m '更新'
```

```bash
git push origin master
```

- 更新仓库流程

查看修改了哪些文件(即 `modified` )

```bash
git status
```

然后把工程文件夹添加本地到暂存区(不要直接pull不然本地有可能被覆盖产生冲突)

```bash
git add .
```

把暂存区中的所有修改都提交到版本库中

```bash
git commit -m '更新'
```

从远程仓库中拉取最新代码，然后再进行推送

```bash
git pull origin master
```

将本地暂存区仓库的修改推送到远程仓库中

```bash
git push origin master
```

如果访问不了就换成ssh

```bash
git push xxx
```



## 推送脚本

> 为了简化步骤，可以写一个.bat脚本进行推送这样不用手写这么多行命令

- 我的文章备份推送(pen.bat)

```bat
#!/bin/bash

# 进入Git仓库所在目录
cd G:/yangblog/yang/source/_posts/

# 以防万一先备份复制到另一个文件夹
cp G:/yangblog/yang/source/_posts/* G:/yangblog/bei -r -f

# 检查当前分支状态
git status

# 添加所有更改到本地暂存区
git add .

# 提交更改并添加提交注释($1是第一个参数意思)
git commit -m "$1"

# 拉取远程仓库
git pull origin master

# 推送
git push origin master
```

> 运行：打开git bash 界面，运行脚本，6/17是参数$1
>
> ```bash
> sh pen.bat 6/17
> ```

- 我的博客推送（blog1.bat）

需要先进行hexo c && hexo g更新最新的Public文件夹

```bat
#!/bin/bash

# 进入Git仓库所在目录
cd G:/yangblog/tui/

# 把博客的public复制到tui下过来
cp G:/yangblog/yang/public/* G:/yangblog/tui/ -r -f

# 检查当前分支状态
git status

# 添加所有更改到本地暂存区
git add .

# 提交更改并添加提交注释
git commit -m "$1"

# 拉取远程仓库
git pull origin master

# 询问确认推送操作
echo "是否要推送到远程仓库？[Y/N]"
read confirm
if [ "$confirm" = "Y" ] || [ "$confirm" = "y" ]; then
  # 推送
  git push origin master
else
  echo "已取消推送"
fi
```

> 运行：打开git bash 界面，运行脚本，6/17是参数$1
>
> ```bash
> sh blog1.bat 6/17
> ```

- 推送源码

```bat
#!/bin/bash

# 进入Git仓库所在目录
cd G:/yangblog/yang/

# 检查当前分支状态
git status

# 添加所有更改到本地暂存区
git add .

# 提交更改并添加提交注释
git commit -m "$1"

# 拉取远程仓库
git pull origin master

# 推送
# 询问确认推送操作
echo "是否要推送到远程仓库？[Y/N]"
read confirm
if [ "$confirm" = "Y" ] || [ "$confirm" = "y" ]; then
  # 推送
  git push origin master
else
  echo "已取消推送"
fi
```





## Git错误集合

{% note simple %}

```bash
error: RPC failed; HTTP 500 curl 22 The requested URL returned error: 500
```

这个是因为网络不稳定，重新 `git push origin master` 即可

{% endnote %}

{% note simple %}

参考文章：https://gist.github.com/Tamal/1cc77f88ef3e900aeae65f0e5e504794

```bash
Connection reset by 140.82.114.3 port 22
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

这个有可能是因为网络不稳定，也可能是端口问题，防火墙啥的，谷歌了一下找到一个大佬的方法：

```bash
# 输入可能会弹出需要你输入 "yes"，如果弹出 "Hi xxxx! You've successfully authenticated, but GitHub does not provide shell access." 则成功无需下面命令
# 【使用HTTPS 协议的端口号(即TCP端口443)测试是否能够成功 SSH 连接到 GitHub 服务器】
ssh -T -p 443 git@ssh.github.com

# 在里面添加内容
# 【将 github.com 的别名指向 ssh.github.com 主机，并将其 SSH 连接端口号设置为 443】
vim ~/.ssh/config
# 添加以下内容：
Host github.com
  Hostname ssh.github.com
  Port 443
  
然后按 "ESc" 键，再输入 ":wq" 保存退出即可

# 输入看看会不会弹出"Hi xxxx! You've successfully authenticated, but GitHub does not provide shell access."，一般到这步都可以成功
ssh -T git@github.com

# 然后就可以进行pull或者push了
```

{% endnote %}

{% note simple %}

出现push不了，可能是超过100M，就算删除了也不行，原因是已经commit到本地仓库，需要删除才能重新commit

```bash
// 查看提交
git log
// 删除
git reset HEAD~1
```

{% endnote %}