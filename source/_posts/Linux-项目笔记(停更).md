---
title: Linux-项目笔记(停更)
cover: /img/num107.webp
comments: false
categories:
  - Linux
abbrlink: 980b8c62
date: 2022-09-29 18:24:00
updated: 2022-10-10 15:47:54
---
##  安装 arm-linux-gcc

{% note blue 'fas fa-fan' flat %} 参考链接 {% endnote %}

[file命令用法](http://t.zoukankan.com/kex1n-p-5716752.html)

方法2可参考：[安装和使用arm-linux-gcc交叉编译工具链](https://blog.51cto.com/u_13640625/4906785)

[ARM-Linux GCC 4.4.3](http://www.friendlyelec.com.cn/download.asp)

[ubuntu下安装 arm-linux-gcc-4.4.3](https://blog.csdn.net/weixin_33766805/article/details/85674510)

[arm-linux-gcc：未找到命令 解决方法](https://blog.csdn.net/m0_67402731/article/details/126326142)

[ARM交叉编译器的学习(学习记录)](https://blog.csdn.net/weixin_39328406/article/details/117202335)

[大佬博客](http://chanpinxue.cn/archives/category/os/linux)

[Ubuntu 18.04安装arm-linux-gcc交叉编译器](https://blog.csdn.net/qq_40748967/article/details/122209445)

[Ubuntu 18.04安装arm-linux-gcc交叉编译器的两种方法](https://cloud.tencent.com/developer/article/1826545?from=15425)

[Ubuntu20.04安装arm-linux-gcc](https://blog.csdn.net/weixin_51082062/article/details/123764417)

[Ubuntu 链接ln的使用:创建和删除符号链接](http://t.zoukankan.com/dancesir-p-7229754.html)

{% note red 'fas fa-fan' flat %}注意{% endnote %}

`/tmp` 文件夹是Linux的临时文件夹，用来存放临时的缓存文件， `目录默认清理10天未用的文件，系统重启会清理目录`（还有一个`/var/tmp`也是临时文件夹）

{% note blue 'fas fa-fan' flat %} 方法1 {% endnote %}

此方法安装的是最新版的，<del>但是此方法需要 `翻墙`，否则99%会失败</del><span style="color:red;">目前好像不用翻墙了</span>

打开终端，输入安装命令(卸载的需要再卸这里暂时不用)：

- 进行arm-linux-gcc的安装：

```bash
sudo apt-get install gcc-arm-linux-gnueabihf
```

- 进行arm-linux-g++的安装(看需要安)：

```bash
sudo apt-get install g++-arm-linux-gnueabihf
```

- arm-linux-gcc的卸载：

```bash
sudo apt-get remove gcc-arm-linux-gnueabihf
```

- arm-linux-g++的卸载：

```bash
sudo apt-get remove g++-arm-linux-gnueabihf
```

安装完成后一般在 `/usr` 目录下生成一个名为 `arm-linux-gnueabihf` 的文件夹

- 接着在 `root` 状态下输入命令打开文本配置 `环境变量`和 `库变量`(目的是以后在任何位置使用该交叉编译器)

```bash
gedit /etc/profile
```

- 在文件最后添加两行，PATH:是刚刚生成的 `arm-linux-gnueabihf`文件夹里面的 `bin`， `lib` 的路径

```bash
export PATH=$PATH:/usr/arm-linux-gnueabihf/bin
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/arm-linux-gnueabihf/lib
```

- 使用 `source` 命令重新加载生效该配置文件

```bash
source /etc/profile
```

- 输入验证命令

```bash
arm-linux-gnueabihf-gcc -v
```

弹出这个表示安装成功：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221008233246.jpg)

- 接着可以去写一个 `.c` 文件然后测试一下看看能不能编译成功(编译原理步骤跟之前gcc类似)

```bash
arm-linux-gnueabihf-gcc xxx.c -o xxx
```

编译成功会生成 `xxx` 文件(没有后缀的)，如果此时想 `./xxx` 执行它会发现报错 `ZSH: executable file format error:./ open`(可执行文件格式错误)，可以用 `file xxx` 命令 可以知道它是在 `32-bit ARM架构`上运行的

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20221008235233.jpg)

如果你的 `gcc是32位的`，然后你的 `Ubuntu是64位的`，那就要下载32位相关库

```bash
sudo apt-get install lsb-core lib32stdc++6
```



##  gcc和arm-linux-gcc有何不同？

本质上都是编译器，而gcc是linux系统用来 `将代码编译成可执行程序的手段`。编译出来的是适用于linux系统的 `可执行二进制文件`。 `所以用gcc编译出来的可执行程序只有在linux系统下面可以运行。` arm-linux-gcc告诉编译器，我编写的环境是linux，但是我希望生成的 `可执行程序是在arm上面跑的`。这就是 `交叉编译`。编写环境和执行环境分离的一种手段。
