---
title: 虚拟机安装Ubuntu22.04及相关设置
cover: /img/num85.webp
comments: false
categories:
  - Linux
abbrlink: b4bc0d96
date: 2022-09-10 20:16:00
updated: 2022-10-11 18:03:11
---
##  下载 ubuntu
`本机VM版本是16.1.1`

`清华镜像网站`：https://mirrors.tuna.tsinghua.edu.cn/ubuntu-releases/22.04/	（选择 `[ubuntu-22.04.1-desktop-amd64.iso](https://mirrors.tuna.tsinghua.edu.cn/ubuntu-releases/22.04/ubuntu-22.04.1-desktop-amd64.iso)`这个下载）

下载完直接在虚拟机创建新的虚拟机然后选择刚刚安装镜像的路径里的 `iso` 后缀文件即可，安装过程简单，注意一定要记住密码！！！忘了得重装

##  调整分辨率

刚开始在虚拟机里 ubuntu 界面很小需要改一下分辨率，步骤：`settings` -> `Displays` -> `Resolution（选择1718x921效果最佳）`

##  默认源更换

步骤： `Softwarre & Updates` -> `倒三角` -> `other` -> `select Best Server` ，等待它搜索完后 -> `Choose Server(需要输入密码)` -> `close` -> `Reload the`，大功告成



##  upgrade升级系统软件

打开终端输入以下命令（一开始我没输入这个命令直接下一个命令会出现这个错误：`E:dpkg was interrupted，you nust manually run 'sudo dpkg --configure -a' to correct the problem.`）

```cpp
sudo dpkg --configure -a
```

再输入

```cpp
sudo apt upgrade
```

```cpp
sudo apt install plasma-discover
```

打开 `Discover` 就可以下载软件了

##  安装原生的火狐浏览器
{% note blue 'fas fa-fan' flat %} 方法1  {% endnote %}
直接把系统语言设置成中文重启进去浏览器就可以用了
{% note blue 'fas fa-fan' flat %} 方法2  {% endnote %}
打开火狐官网下载地址：https://www.mozilla.org/en-US/firefox/linux/?utm_medium=referral&utm_source=support.mozilla.org（进去后点击 Download Now 即可下载）

下载完后打开命令终端按顺序输入命令（必须是root下）教程网址：https://support.mozilla.org/zh-CN/kb/linux-firefox

<font color='red'>注</font>：上面教程第6步之前需要先完成下面这步否则会下载不了报错

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220910181701.jpg)

`解决方法`：

(这个可以在你本机浏览器不用在虚拟机里打开)使用网址：https://www.ipaddress.com/ 获得`raw.githubusercontent.com`网站的`ip`地址：`185.199.108.133`

`修改 hosts 文件`：

```cpp
sudo gedit /etc/hosts
```

`在最后一行添加`（添加完记得右上角save）：

```cpp
185.199.108.133 raw.githubusercontent.com
```

继续进行教程的第6步即可

完成第6步教程后效果如图表示OK可以继续输入下面命令()：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220910183531.jpg)

`删除旧的火狐`：

```cpp
sudo snap remove firefox
```

`打开新安装的火狐`（此命令不能在root下可以再新建一个终端输入然后回车即可！）：

```cpp
/usr/local/bin/firefox
```

最后自动打开新的火狐了然后去浏览器 `设置` -> `搜索` -> `默认搜索引擎`（改成百度即可）最后最后就是右键桌面图标旧的火狐点击 `Quit` 关闭，再右键新的火狐 `add to Favorites` 锁定在桌面就不怕找不到了（如果实在不小心关闭了可以通过之前上面那个 `打开新安装火狐命令`打开）

##  打开文件再点一次文件最小化功能

打开终端输入：

```cpp
gsettings set org.gnome.shell.extensions.dash-to-dock click-action 'minimize'
```

##  安装编解码器和微软字体

输入命令：

```cpp
sudo apt install ubuntu-restricted-extras
```

等待安装即可，会出现一直需要按回车的现象是正常的它是在后面安装可以通过长按回车会看到 `一闪而过` 的黄色进度条（可以输入 `sudo gedit /etc/apt/sources.list` 命令显示进度条）过程中弹出白色页面按键盘右箭头选择ok回车即可

##   安装 GNOME 扩展

输入命令：

```cpp
sudo apt install chrome-gnome-shell
```

然后去火狐浏览器输入网站：https://extensions.gnome.org

打开后点击这里安装

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220910194346.jpg)

安装完刷新网页就可以在上面打开插件了

##  安装防火墙

`打开Ubuntu Software` -> `搜索firewall` -> `下载Firewall Configuration` （暂时不知道怎么用不管了）

##  检查显示wayland vs. xorg

当前一般是这样的

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220910195654.jpg)

步骤：`右上角` -> `Power Off/Log Out`（选择 Log Out）-> `在输入密码界面可以选择`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220910195908.jpg)

改完后是这样的

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220910200056.jpg)

<font color='red'>注</font>：此功能看需要改没必要则不用管

##  安装 Ubuntu-Cleaner

可以帮助你清除一些不要的安装包，缓存等等

打开终端输入命令（在root下）：

```cpp
sudo add-apt-repository ppa:gerardpuig/ppa
```

```cpp
sudo apt-get update
```

```cpp
sudo apt-get install ubuntu-cleaner
```

安装完搜索cleaner出来

##  设置不显示如何解决
输入命令：
```cpp
sudo apt-get install gnome-control-center
```

##  安装星火商店

火狐商店输入网站：https://www.spark-app.store/download

点击左边的下载按钮直接下载即可

下载完打开刚刚下载的位置一般是 `Downloads` 下右键打开终端输入 `ls` 看看是否有 `spark-store_3.2_amd64.deb` 安装包（可能版本不同名字不同看后缀是deb就行）

然后输入命令安装（下面需要改成你安装包名字）注意安装时要使用`apt `命令, 不能使用`dpkg`命令, 否则会报错 !

```cpp
sudo apt install ./spark-store_3.2_amd64.deb
```

安装完就可以在应用那找到 `Spark Store` 了

安装QQ，微信文件传输助手

星火商店搜索QQ即可，我安装的是 `QQ(dwine5)`

微信文件传输助手也是不错的方便

搜索 `ccc-app` 可以管理应用方便卸载

##  自带输入法

```bash
sudo apt install ibus
im-config -s ibus
sudo apt install ibus-gtk ibus-gtk3
sudo apt install ibus-pinyin
```

`设置`->`键盘`->`+` ->`汉语`（`选择中文(智能拼音)`），重启即可

##  安装 VScode

直接商店安装即可然后登陆账号同步，云端替换，配置啥的不用改



##  给终端换个主题

打开网站：https://ohmyz.sh

滑到下面复制命令即可

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220911134003.png)
```bash
sh -c "$(wget https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"
```

安装过程第一次的话需要先按提示下载另一个东西

```bash
sudo apt install zsh
```
然后再复制刚刚网站的命令即可，安装完点击右上角重新登陆就看到终端换了（不过切换到root又变成原样）
- 安装插件zsh-autosuggestions(历史命令智能提示)
```bash
# 安装
sudo apt-get install zsh-autosuggestions
vim ~/.zshrc
# 在plugins函数中添加插件zsh-autosuggestions（与git空格隔开）
plugins=(git zsh-autosuggestions)
# 并且在下面一行加入(要在之前的source下面写否则没效)source后面一段是插件的默认保存地址
source /usr/share/zsh-autosuggestions/zsh-autosuggestions.zsh
# i插入，ESC退出:wq保存
# 然后更新文件
source ~/.zshrc
```
- 安装插件zsh-syntax-highlighting(语法高亮)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96/QQ%E6%88%AA%E5%9B%BE20221011165456.jpg)
```bash
# 安装
sudo apt-get install zsh-syntax-highlighting
# 跟之前的插件用空格隔开
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
# 在另一行写
source /usr/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
```
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96/QQ%E6%88%AA%E5%9B%BE20221011171920.jpg)
- 主题查看与更换
主题demo参考：[Themes](https://github.com/ohmyzsh/ohmyzsh/wiki/Themes)
```bash
# 输入
cd ~/.oh-my-zsh/themes
ls
#  记住.zsh.theme前缀，比如 cloud
vim ~/.zshrc
# 改变 ZSH_THEME="xxx"，xxx即是刚刚那个前缀，看个人喜好主题
# 改完更新一下
source ~/.zshrc 

```

##  桌面文件全部消失右键显示不全解决方法
输入命令：
```bash
sudo apt-get install -f
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install ubuntu-desktop
reboot
```

##  截图快捷键修改

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220911205333.jpg)



##  ubuntu 运行c程序

打开 `软件和更新` -> `勾选源代码`

```bash
# 下载安装gcc
sudo apt-get build-dep gcc
```

```bash
# 创建.c文件
touch xxx.c
```

```bash
# 用自带的vi编辑器编写.c
vi xxx.c
# 也可以用自带的 gedit 文本编辑器打开
gedit xxx.c
```

`键盘a进入插入模式，写完ESC(退出)再:wq(保存)！！！`

```bash
# 将.c文件转换成可执行文件并且运行
# 生成了一次可执行文件后下次想运行直接 ./xxx 即可（前提是代码内容不能变动过）
gcc xxx.c -o xxx
./xxx
```
##  共享文件夹

```bash
# 共享文件：首先打开虚拟机设置->选择选项然后开启共享文件，添加路径，然后来到linux打开终端输入：
cd /mnt/hgfs
ls
# 就可以看到你共享文件夹了
```
也可以直接打开文件夹路径去找：
`打开文件夹`->`其他位置`->`计算机`->`mnt`->`hgfs`
重启后如果发现共享文件夹不见了可以试试下面命令：
```bash
# 输入这个命令如果出现了你共享文件夹的名字代表共享文件夹还在
vmware-hgfsclient
# 输入这个命令
sudo vmhgfs-fuse .host:/ /mnt/hgfs -o allow_other
# 如果报错：if you are sure this is safe, use the 'nonempty' mount option，则输入下面的
sudo vmhgfs-fuse .host:/ -o nonempty /mnt/hgfs -o allow_other
```
然后去 `/mnt/hgfs/` 目录下就可以发现共享文件夹回来了（但是重启后又恢复原样了）
解决每次开机需要重新挂载共享文件：
首先打开终端并且进入root状态下（否则待会没权限修改文件），输入：
```bash
/etc
gedit fstab
```
接着打开文本后在最后一行加入这一行保存即可：
```bash
.host:/         /mnt/hgfs         fuse.vmhgfs-fuse allow_other,defaults   0       0
```
重启发现共享文件夹自动已经可以出来了

##  hgfs权限问题
具体方法可以参考这两篇网上教程
1.https://blog.csdn.net/anlz729/article/details/106826215
2.https://blog.csdn.net/qq_43516928/article/details/119430588
3.实在不行试试用管理员身份打开VM

##  虚拟机跟主机复制粘贴问题
首先关机状态，打开`虚拟机设置`-->把`软盘`移除
按顺序输入命令：
删除原来安装过的文件(这个不是把你虚拟机所有文件删了...)
```bash
sudo apt autoremove open-vm-tools
```
安装命令
```bash
sudo apt install open-vm-tools
```
```bash
sudo apt install open-vm-tools-desktop
```
重启
```bash
reboot
```


  
  