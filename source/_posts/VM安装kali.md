---
title: VM安装kali
cover: /img/num47.webp
comments: false
tags:
  - 虚拟机
categories:
  - 资源分享与教程
abbrlink: 8a43f441
date: 2022-03-16 12:21:00
updated: 2022-06-03 21:56:44
---
##  下载 kali 系统镜像文件

下载途径：

- [Kali Docs | Kali Linux Documentation](https://www.kali.org/docs/)

<font color='orange'>kali 官网下载</font>（速度有点慢，毕竟服务器在国外）

- [清华大学开源软件镜像站 | Tsinghua Open Source Mirror](https://mirrors.tuna.tsinghua.edu.cn/)

<font color='orange'>清华大学的开源镜像站</font>

- [中科大 Open Source Software Mirror](http://mirrors.ustc.edu.cn/)

<font color='orange'>中科大的开源镜像站</font>

- [阿里巴巴开源镜像站-OPSX镜像站-阿里云开发者社区 (aliyun.com)](https://developer.aliyun.com/mirror/)

<font color='orange'>阿里云的开源镜像站</font>

- [mirrors.zju.edu.cn](http://mirrors.zju.edu.cn/)

<font color='orange'>浙大的开源镜像站</font>

- [Index of /kali-images/kali-2020.4](http://old.kali.org/kali-images/kali-2020.4/)

<font color='orange'>这也是一个网站 (当前我下载的就是这个)</font>

##  使用VM虚拟机安装 kali

###  虚拟机配置

- 打开VM虚拟机，创建新的虚拟机，选中自定义安装，点击下一步

![](https://s1.ax1x.com/2022/03/16/qSFGvD.png)

- 默认下一步

![](https://s1.ax1x.com/2022/03/16/qSFKER.png)

- 选择稍后安装

![](https://s1.ax1x.com/2022/03/16/qSF8gO.png)

- 操作系统选择Linux，版本这里选Debian8x64

![](https://s1.ax1x.com/2022/03/16/qSF1C6.png)

- 虚拟机命名，下一步

![](https://s1.ax1x.com/2022/03/16/qSFeu4.png)

- 默认下一步

![](https://s1.ax1x.com/2022/03/16/qSFaVA.png)

- 这里内存选择1024MB

![](https://s1.ax1x.com/2022/03/16/qSFQ4x.png)

- 默认下一步

![](https://s1.ax1x.com/2022/03/16/qSFYKe.png)

![](https://s1.ax1x.com/2022/03/16/qSFmDJ.png)

![](https://s1.ax1x.com/2022/03/16/qSFMU1.png)

![](https://s1.ax1x.com/2022/03/16/qSFnb9.png)

- 磁盘设置为比推荐大一些，勾选磁盘储存为单个文件

![](https://s1.ax1x.com/2022/03/16/qSF38K.png)

- 命名后下一步

![](https://s1.ax1x.com/2022/03/16/qSFVvF.png)

- 点击完成

![](https://s1.ax1x.com/2022/03/16/qSFtDH.png)

- 回到Kali页面，点击编辑虚拟机设置

![](https://s1.ax1x.com/2022/03/16/qSFNbd.png)

- 点击CD/DVD(IDE),将ISO文件路径导入，然后点击确定。之后点击开启虚拟机。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317080742.png)

### Kali 系统配置

- 开启虚拟机后，就是这个页面，第一行按回车键继续。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220316230712.png)

- 确定系统语言，这里选择中文简体。用鼠标点击继续，进行语言设置。

- 进行主机名设置。点击继续

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220316230915.png)

- 进行登陆的用户名和密码设置，中间有个域名可以随便设置。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220316231033.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220316231057.png)

- 选择第一个，点击继续

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220316231133.png)

- 默认第一个继续

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220316231218.png)

- 默认最后一个结束分区，并继续

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220316231243.png)

- 这里选择是，点击继续

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220316231313.png)

- 这里选不选都可以，选上会安装附加工具，并加长大量安装时间。(但是Xfce一定要选，我当时觉得没必要就只选了最后一个其他都没选结果进去只有黑窗口没有图形化界面，然后我又得删了重新安装...)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317081237.png)

- 之后会进行长时间的安装，来到这个页面，选择是，点击继续

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317075355.png)

- 这里一定要选择/dev/sda，不然会安装失败

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317075425.png)

- 当出现这个页面，恭喜你安装成功，点击继续将会重启然后回车再输入用户名和密码，之后会进入系统。

{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317075457.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317082707.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317082757.png)
{% endgallery %}


##  与主机共享文件

###  修改成 root 权限

<font color='red'>注意</font>：一定要先做 <font color='orange'>3.1</font> 再看 <font color='orange'>3.2 </font>步骤 (一开始我也是做了 3.2 步骤没做这步，结果配置是配置成功了但是关机重新打开虚拟机要重新配置一遍，所以一定一定要先做这步)

- 桌面右键打开终端，输入命令,输入密码，变成 <font color='orange'>root </font>状态

```bash
sudo su
```

```bash
sudo -i
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317145912.png)

- 然后开始修改账号权限

```bash
vim /etc/passwd
```
{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317145727.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317150406.png)
{% endgallery %}


可以看到 root 的权限最高，我们自己的权限最低 (1000) ，root用户ID是<font color='red'> 0</font> 我们需要找到自己的用户名位置并且修改ID为 <font color='red'>0</font>，如果要修改内容我们需要用到 命令行插入模式的功能键 ‘<font color='orange'> i </font>’ (键盘字母 ' i ' ) 

- 首先找到我们用户名位置，鼠标点击数字处再按键盘 '<font color='orange'> i </font>，此时底下会出现 "<font color='orange'>插入</font>" 两字便可以开始修改了

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317150738.png)

然后 键盘 <font color='orange'>Esc</font> 退出插入模式，再快捷键 <font color='orange'>Shift+zz</font> 保存并退出，最后输入命令<font color='orange'>重启</font> Kali linux 系统

```bash
reboot
```

重启后可以看到我们已经是 root 状态了 (不用每次都输入密码了),不放心可以输入命令查看当前id

```bash
id
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317151455.png)

###  配置共享文件

点击顶部【虚拟机】，可以看到【重新安装VMware Tools】按钮是<font color='orange'>灰色</font>的，接下来就开始安装共享文件了：

- 首先虚拟机处于<font color='orange'>关机状态</font>，然后点击【编辑虚拟机设置】--【选项】--【共享文件夹】--【总是启动】--【添加】(提前在你主机新建一个文件夹用于共享的文件夹) --【确定】

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317105034.png)

- 还是点击【编辑虚拟机设置】--【硬件】--【CD/DVD】--【使用物理驱动器】--【自动检测】--【确定】

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317100011.png)

- 启动虚拟机，点击【虚拟机】，可以看到按钮【重新安装VMware Tools】现在不是灰色了可以，点击【重新安装VMware Tools】，然后正常进入系统来到桌面

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317115135.png)

- 来到桌面后，会看到一个像光盘一样的图标，并且名字是<font color='orange'>"VMware Tools"</font>，点击它，进去后会看到一个后缀是 <font color='orange'>.gz</font> 的文件，然后把它拖到桌面并解压

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317121849.png)

- 解压完后接着就右键桌面打开终端，开始输入命令：

① 直接复制这段代码回车，创建目录，为后面安装tools铺垫 (可以看到我图片多了一条重复的 ' /etc/rc/.d/rc0.d ' 这个不要紧复制代码过去回车就行了不用修改任何地方)

```bash
# sudo mkdir -p /etc/rc.d/rc0.d
# sudo mkdir -p /etc/rc.d/rc1.d
# sudo mkdir -p /etc/rc.d/rc2.d
# sudo mkdir -p /etc/rc.d/rc3.d
# sudo mkdir -p /etc/rc.d/rc4.d
# sudo mkdir -p /etc/rc.d/rc5.d
# sudo mkdir -p /etc/rc.d/rc6.d
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317122843.png)

② 接着打开桌面那个刚刚 <font color='orange'>".gz" </font>文件解压出来的文件，看看里面有没有 <font color='orange'>".pl" </font>文件(有代表你离成功又进一步了！)，然后<font color='orange'>复制</font>顶部的路径到终端上面粘贴并且回车

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317122949.png)

③ 接着就复制这段代码过去粘贴并且回车 (意思是运行这个文件)，然后终端开始有反应有代码在动了然后你只需按<font color='orange'>回车</font>就行，其他上面都不需要做...

```bash
./vmware-install.pl
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317123024.png)

④ 看到这个这个界面代表 tools 安装成功了!!!

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317123108.png)

⑤ 接着输入这条命令 (意思是查看共享目录)，回车发现这个不就是之前在VM上添加的文件名吗，没错，就是它。。如果你发现不是那就凉凉了，得看看是不是之前步骤错了

```bash
vmware-hgfsclient
```
{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317123205.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317131237.png)
{% endgallery %}


⑥ 接着又输入这条命令 (意思是新建文件夹)，<font color='red'>××× 就是你的文件名</font>，需要跟共享文件的名字保持一致，否则可能后面会有错

```bash
mkdir /mnt/hgfs/×××/
```

⑦ 接着再输入命令 (意思是创建共享文件夹) ，到这就完成了 (<font color='red'>记得把 '×××' 换成你共享文件名</font>)

```bash
/usr/bin/vmhgfs-fuse .host:/ /mnt/hgfs/×××/ -o subtype=vmhgfs-fuse,allow_other
```

⑧ 设置，使每次开机自动挂载共享文件夹 (这步一定要做，不做下次开机进来又得从头配置，嘻嘻)，文件<font color='orange'> /etc/fstab</font> 的末尾添加多一行 (如果你不把 3.1 步骤做了到这步你会发现修改了保存不了，因为你没权限)

{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317190435.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317190605.png)
{% endgallery %}


添加到末尾然后保存 (<font color='red'>记得把 '×××' 换成你共享文件名</font>)：

```bash
.host:/×××  /mnt/hgfs/×××  fuse.vmhgfs-fuse   allow_other   0   0
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317191339.png)

```bash
vmware-hgfsclient
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317132920.png)

现在可以在你主机传东西到共享文件夹里了，我在Win往里面放张图片做测试

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317123605.png)

回到虚拟机点击【文件系统】-- 找到【mnt】文件夹，一直点就看到Win刚刚放的图片了...

{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317123657.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317123715.png)
{% endgallery %}


##  设置网络

现在万事俱备只差网络了 (没网络可活不了呀，做啥都不方便...)，前提是你用 kali 打开浏览器看看能不能访问或者 <font color='green'>ping </font>一下<font color='orange'> baidu.com</font> ，如果不能则跟我一起做下面步骤 (网络没问题可以不用看)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317214759.png)

- 点击【编辑】--【虚拟网络编辑器】

{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317215500.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317215223.png)
{% endgallery %}


然后再点击【虚拟机】--【设置】

{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317215730.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317215840.png)
{% endgallery %}


- 现在网络就可以了，然后打开浏览器试试吧，浏览器设置中文的步骤：

{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317220110.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317220215.png)
{% endgallery %}


<font color='orange'>由于我之前就设置了所以我这会显示有</font>

{% gallery %}
![1](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317220303.png)
![2](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317220408.png)
![3](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317220513.png)
![4](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317220534.png)
{% endgallery %}


<font color='orange'>然后重新进入就看到已经是中文了</font>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220317220547.png)

## 结束语
<div>
    <img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2F95f72051efaf496edc2cb23e8837fb15.gif" width="100"/>
</div>