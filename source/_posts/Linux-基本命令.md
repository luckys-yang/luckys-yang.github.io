---
title: Linux-基本命令
cover: /img/num88.webp
comments: false
categories:
  - Linux
abbrlink: 5dd37c70
date: 2022-09-24 10:10:00
updated: 2022-10-11 15:52:29
---
##  Linux 检查端口是否被防火墙阻止
- 方法# 1 使用“telnet”命令
```bash
# “yang5201314.cn”是我们想要访问的 Web 服务器的名称。而“80”是指我们希望找出其状态的端口号
telnet yang5201314.cn 80
```
下面的输出意味着成功连接到指定的 Web 服务器，这意味着指定的端口没有被我们的防火墙阻止
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96/QQ%E6%88%AA%E5%9B%BE20221011153311.jpg)
- 方法# 2：使用“nc”命令
```bash
nc -v yang5201314.cn 80
```
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96/QQ%E6%88%AA%E5%9B%BE20221011153503.jpg)

##  用户，权限
重置密码参考：[在Linux下修改和重置root密码的方法](https://www.jb51.net/article/140179.htm)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96/QQ%E6%88%AA%E5%9B%BE20221011154154.jpg)
有几个由冒号 (:) 分隔的数据字段，从左到右分别是 `用户名`，`x字符表示加密的密码`，`UID (1000)：每个用户都必须有自己唯一的用户 ID`，`GID (1000)：组 ID 由以下字段表示。GID 保存在文件 /etc/group 中`，`详细信息（yang,,,）`，`主目录(/home/yang)`，`/usr/bin/zsh 是shell或命令的默认绝对路径`

```bash
# 添加用户，过程是需要设置密码，全名地址等等，该命令将创建新用户的家目录，并将初始化文件从/etc/skel目录复制到用户的家目录。在家目录中，用户可以创建，编辑和删除文件和目录
sudo adduser 用户名
# 查看用户信息
cat /etc/passwd
# 查看用户组
cat /etc/group
# 删除用户而不删除用户文件(需要用户名不在登陆状态且当前是root状态)
sudo deluser 用户名
# 删除并且删除用户的家目录和邮件使用(需要用户名不在登陆状态且当前是root状态)
sudo deluser --remove-home 用户名
# 查看当前活跃用户
w
# Linux在线用户
who
# 切换用户
su 用户名
# 修改文件权限，给xx文件最高权限
chmod 0777 xx
# 修改xx文件所有者
chown 用户名 xx
# 建立链接文件 ln
# 软链接：不占用空间，源文件删除软连接文件作废，可以连接文件和文件夹
ln –s 源文件 目标文件
# 硬链接：占用同样空间，源文件删除硬链接正常使用，只可以链接文件
ln 源文件 目标文件
```

##  文件搜索、查找、读取，打印数据
参考：[Linux find命令](https://www.runoob.com/linux/linux-comm-find.html)
```bash
# 查询当前目录下是否有该 xx 文件
find xx
# 查询PATH路径下是否有该 xx 文件
find path/xxx
# 将当前目录及其子目录下所有文件后缀为 .c 的文件列出来
find . -name "*.c"
# 将当前目录及其子目录下所有最近 20 天内更新过的文件列出
find . -ctime  20
```
```bash
# 显示xx文件最后 10 行；
tail  xx
# 显示xx文件前 10 行；
head  xx
# 显示整个文件
cat  xx
# 先显示文件的一页内容，再逐行显示
more  xx
# 打开xx文件并先显示一页内容，再逐行显示；（q 键退出）
less  xx
# 从xx文件中查询内容为“aa”的行
grep  “aa”  xx
# 从xx文件中查询内容为“aa”的行并显示行号
grep -n “aa”  xx
```
```bash
# 统计文件：总行数、含有内容的行数（只有空格不算内容）、总字数
wc  xx
# 统计文件总行数
wc  -l  xx
# | 管道命令，连接多个命令
# 先从xx文件中查询内容包含 “11” 的行，在统计总的行数；（最终只返回统计的行数）
grep  "11"  xx | wc -l
```
```bash
# 打印海量数据，如果带参数 -5表示打印5行
more 文件名
# 打印少量数据(带换行)
cat 文件名
```

##  文件压缩与解压
```bash
# 压缩、查看、解压；
# tar  -cvf | -tvf | -xvf
# 压缩、查看、解压（gz 压缩方式）
# tar  -czvf | -tzvf | -xzvf
# c——创建、z—— gz 压缩方式、vf——显示

# 将 a1、a2、a3，这 3 个 文件压缩成 k.tar 文件
tar -cf  k.tar  a1  a2  a3
# 将 3 个文件压缩成 k.tar 文件，并显示压缩文件 k.tar 中所压缩的所有文件
tar -cvf  k.tar  a1 a2 a3
# 以 gz 的压缩方式压缩 3 个文件，并显示压缩文件 k.tar.gz 中所压缩的所有文件
tar -czvf  k.tar.gz  a1 a2 a3
# 显示压缩文件 k.tar 中的文件
tar  -tf  k.tar
# 详细显示压缩文件 k.tar 中的文件；（也可以直接查看 gz 压缩的文件）
tar  -tvf  k.tar
# 将压缩文件 k.tar 解压到当前目录中
tar  -xf  k.tar
# 将压缩文件 k.tar 解压到当前目录，并显示解压出的所有文件；（也可以直接解压 gz 也是方式压缩的文件）
tar  -xvf  k.tar
```

##  Ubuntu基础教程之apt-get命令
参考：[Ubuntu基础教程之apt-get命令](https://www.jb51.net/article/167527.htm) 

##  bash与zsh命令
{% note blue 'fas fa-fan' flat %}bash和zsh的区别及相关命令{% endnote %}
一句话，二者均是shell的一种，`zsh能基本完美兼容bash的命令，并且使用起来更加优雅`。由于bash或zsh本质上都是解释器，他们所共同服务的是shell语言，因此在命令语法上基本相同，部分兼容性差异可参考：[Zsh和Bash的兼容性问题](https://segmentfault.com/a/1190000011122024)
[我怎么知道我是bash还是zsh](https://linuxhint.com/know-bash-or-zsh/)
<span style="color:red;">注</span>：当出现 `.bashrc:16: command not found: shopt` 这种错误一般是因为当前是zsh而却写到bash，切换到zsh就行了(shell修改对应shell的文件)
常见命令：
```bash
# 临时切换到bash
bash
# 临时切换到zsh
zsh
# 永久切换到bash有两种方法，需要重启
chsh -s /bin/bash
chsh -s $(which bash)
# 永久切换到zsh有两种方法，需要重启
chsh -s /bin/zsh
chsh -s $(which zsh)
# 查看系统已安装shell
cat /etc/shells
# 查看bash版本，查看zsh类似
bash --version
# 查看当前活动shell
echo $0
```
在配置文件方面：
bash读取的配置文件：`~/.bash_profile文件`
zsh读取的配置文件：`~/.zshrc文件`

##  which命令与>>使用
`which` 命令的功能是从用户的 path 目录中搜索可执行文件并返回
`$()` 表示执行 () 里的命令并将结果返回
这种写法会更 “安全”，也更易于移植，首先 `$(which xxx)` 获取的是 `绝对路径`，可以规避相对路径带来的不可控异常，其次 $(which xxx) 可以便于在不同的服务器上运行
`>`(输出重定向)：将本来在屏幕上的输出重定向保存到文件里(文件不存在就新建，存在就覆盖原来内容)
`>>`(追加输出重定向)： 将本来在屏幕上的输出重定向保存到文件里(文件不存在就新建，存在只是在末尾追加)

##  .bashrc与.bash_profile区别
当Bash作为 `交互式登录shell`调用时，将读取并执行 `.bash_profile`；对于 `交互式非登录shell`，则执行 `.bashrc`
 `仅应运行一次` 的命令应该使用 `.bash_profile` ，例如自定义$PATH 环境变量。
将 `每次启动新Shell时` 应该运行的命令放在 `.bashrc` 文件中。 这包括您的别名和function，自定义提示，历史记录自定义等。
全局startup文件放在 `/etc` 目录下用于设置所有用户共同的配置，除非你清楚地知道你在做的事情，否则不要轻易改动它们；
个人startup文件放在 `~` 目录下，用于设置某个用户的个性化配置
<span style="color:red;">请注意后两个的区别</span>：`.bash_profile`只在会话开始时被读取一次，而 `.bashrc` 则每次打开新的终端时，都要被读取

##  如何在 Ubuntu 22.04 中列出已安装的软件包
一个“包”指的是一组项目，例如脚本、文本文件、库、许可证等。这些包允许以包管理器解包软件并将其包含在您的操作系统中的方式安装软件
- 使用 GUI 列出 Ubuntu 22.04 中已安装的软件包
打开 `Ubuntu Software`-->`已安装` 即可查看
- 使用 dpkg 列出 Ubuntu 22.04 中已安装的软件包
```bash
dpkg -l | grep ^ii
下面的命令将计算所有已安装的软件包数量
dpkg -l | grep ^ii | wc -l
```
- 在 Ubuntu 22.04 中使用 apt 列出已安装的软件包
“ apt ” 是一个包管理器，可帮助在 Ubuntu 系统上安装、更新、显示和删除包
```bash
# 列出已安装
apt list --installed
# 使用 grep 命令和 apt 命令来查看我们的系统上是否安装了某个包(xorg是某个包名)
apt list --installed | grep xorg
# 要查看有关特定软件包的信息，我们可以使用带有 apt 的 show 命令
apt show xorg
```
- 在 Ubuntu 22.04 中使用 snap 列出已安装的软件包
要列出 snap 包，我们不能使用 apt 或 dpkg 命令。相反，我们使用 snap 命令来显示在我们的系统上安装为 snap 包的包
```bash
snap list
```

##  echo命令
Linux中 echo命令主要用于 `打印字符或者回显`，一般起到一个 `提示的作用`
语法：echo [选项] [输出内容]
具体用法参考：[Linux命令 - echo命令](https://blog.csdn.net/qq_45988641/article/details/116976000?spm=1001.2101.3001.6650.7&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-7-116976000-blog-122187643.pc_relevant_3mothn_strategy_recovery&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-7-116976000-blog-122187643.pc_relevant_3mothn_strategy_recovery&utm_relevant_index=8)

##  文件增删改查
<font color='red'>一般增删改查都会加多一个 `-i` 保险点防止误操作！！！</font>
```bash
cp 当前路径下的源文件名字 目标路径
# 如果复制过去顺便改名的话则:
cp 当前路径下的源文件名字 目标路径/新名字
# 如果复制的是一个 `文件夹` 的需要在后面加 `-r`
```
```bash
# mv命令可以移动文件/目录，也可以重命名
mv 源文件 目标文件名/路径
# 同一路径下移动相当于重命名
mv 源文件 新名字
```
```bash
# 直接删除普通文件
rm 文件名
# 删除文件夹
rm 文件夹/目录 -r
# 强制删除
rm 文件夹/目录 -f
```
```bash
# 创建普通文件
touch 文件名
# 创建目录/文件夹
mkdir 目录名
```
```bash
# 查看文件权限命令
ls 文件名+文件名后缀 -l
```

##  基础常用命令
```bash
~ 家目录
/根目录
./ 当前路径
../当前路径的上一层路径
cd .. 返回上一级目录
cd ~ 切换到当前用户的主目录
一般格式是：/home/用户名/xxx
pwd 查看当前所在目录
ls -l 查看当前目录下所有文件的详细信息(不包括隐藏文件)
ls -a 查看当前目录下的隐藏文件（以.开头的文件）
ls -all 查看当前目录下所有文件详细信息(包括隐藏文件)
clear 清屏
tree 显示当前路径所有文件并且用树状显示（第一次用需要安装 sudo apt install tree）
ifconfig 查看ip地址
```
##  Vim命令
不能每个文件都用 Vim 打开，Vim 将文件的所有内容读取到内存中，如果文件过大，甚至大于内存空间，用 Vim 打开后会占据整个内存
```bash
i：插入模式，可以对文本的内容进行修改：增加、删除、修改等；
Esc ：从任意模式中退出；
: ：切换到底线命令模式；
:wq ：保存后关闭文本；
:q! ：不保存直接关闭文本；
G ：光标移到尾行的行首；
gg ：光标移到首行的行首；
dd ：删除光标所在的整行，不管光标在行首行中或者行尾；
x ：删除光标所在的字符；
u ：恢复刚刚删除的内容；
yy ：复制光标所在的整行内容；
p ：将复制的信息插入在光标所在行的下一行，可多次插入；（重新产生一行内容，不是插入别的行中）
```
##  软件安装等命令
```bash
# 查看软件安装的路径
dpkg -L 包名
# 安装包命令：
sudo apt-get install 安装包名字
# 重新安装已安装的包(如果已安装的包有了更新或新版本，也可以用这个方法把包升级到最新的版本)
sudo apt-get install --reinstall 包名
# 更新指定的包
sudo apt-get install 包名
# 检查某个包的版本
sudo apt-get -s install 包名
# 安装指定版本的包
sudo apt-get install tree=1.7.0-5
# 只删除程序文件，保留相关的配置文件
sudo apt-get remove 包名
# 同时删除程序文件及其配置文件(两种写法)
sudo apt-get purge 包名
sudo apt-get remove --purge 包名
# 删除自动安装的软件包，这些软件包当初是为了满足其他软件包对它的依赖关系而安装的，而现在已经不再需要了。因此在删除包后执行一下 autoremove 是个不错的选择
sudo apt-get autoremvoe
# 清除系统中缓存的包安装文件(安装包的过程实际上是先把包安装文件下载到缓存目录，然后执行安装。久而久之系统中会存在大量无用的包安装文件，clean 命令可以清除这些缓存的包安装文件)
sudo apt-get clean
# 跟上面差不多但只删除不能再下载的软件包文件，而且这些文件在很大程度上是无用的。这允许长时间维护缓存，而不至于大小失控
sudo apt-get autoclean
# 下载包的源代码(source code)需要提前在"Ubuntu Software" 选项卡中选中 "Source code"
apt-get source 包名
```

##  进程相关命令
```bash
# 查看正在执行的软件进程
ps -ef |grep 包名
# 查看进程信息
ps -aux
# 杀死正在执行的进程(xxx表示进程号)
kill -9 xxx 
# 或者
sudo  kill  进程号(PID)
# 显示当前系统正在执行的进程的相关信息，包括进程ID、内存占用率、CPU占用率等
top [参数]
# 查看某进程信息
top -p 574
# CPU个数和核数
cat /proc/cpuinfo
# 查看磁盘分区情况
df -h
```
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96/QQ%E6%88%AA%E5%9B%BE20221011003105.jpg)
分析上面5行：
- 第一行，任务队列信息
00:30:44 — 当前系统时间
up 8:08 — 系统已经运行了8小时4分钟（在这期间系统没有重启过的吆！）
1 users — 当前有1个用户登录系统
load average: 0.31, 0.30, 0.33 — load average后面的三个数分别是1分钟、5分钟、15分钟的负载情况。(load average数据是每隔5秒钟检查一次活跃的进程数，然后按特定算法计算出的数值。如果这个数除以逻辑CPU的数量，结果高于5的时候就表明系统在超负荷运转了。)
- 第二行，Tasks — 任务（进程）
系统现在共有329个进程，其中处于运行中的有1个，328个在休眠（sleep），stoped状态的有0个，zombie状态（僵尸）的有0个。
- 第三行，cpu状态信息
0.5% us — 用户空间占用CPU的百分比。
0.7% sy — 内核空间占用CPU的百分比。
0.0% ni — 改变过优先级的进程占用CPU的百分比
98.7% id — 空闲CPU百分比
0.0% wa — IO等待占用CPU的百分比
0.0% hi — 硬中断（Hardware IRQ）占用CPU的百分比
0.1% si — 软中断（Software Interrupts）占用CPU的百分比
0.0% st — 虚拟化占用
- 第四行,内存状态(单位：MB)
3793.8 total — 物理内存总量
342.1 free — 空闲内存总量
1287.1 used — 使用中的内存总量
2164.6 buff/cache — 缓存的内存量
- 第五行，swap交换分区信息(单位：MB)
2048.0 total — 交换区总量
342.1 free — 空闲交换区总量
3.5k used — 使用的交换区总量
2159.4 avail men — 物理占用
<span style="color:red;">备注1</span>：第四行中使用中的内存总量（used）指的是现在系统内核控制的内存数，空闲内存总量（free）是内核还未纳入其管控范围的数量。纳入内核管理的内存不见得都在使用中，还包括过去使用过的现在可以被重复利用的内存，内核并不把这些可被重新使用的内存交还到free中去，因此 `在linux上free内存会越来越少，但不用为此担心。`
<span style="color:red;">备注2</span>：对于内存监控，在top里我们要时刻监控第五行swap交换分区的used，`如果这个数值在不断的变化，说明内核在不断进行内存和swap的数据交换，这是真正的内存不够用了。`
- 第六行，空行
- 第七行以下：各进程（任务）的状态监控
PID — 进程id
USER — 进程所有者
PR — 进程优先级
NI — nice值。负值表示高优先级，正值表示低优先级
VIRT — 进程使用的虚拟内存总量，单位kb。VIRT=SWAP+RES
RES — 进程使用的、未被换出的物理内存大小，单位kb。RES=CODE+DATA
SHR — 共享内存大小，单位kb
%CPU — 上次更新到现在的CPU时间占用百分比
%MEM — 进程使用的物理内存百分比
TIME+ — 进程使用的CPU时间总计，单位1/100秒
COMMAND — 进程名称（命令名/命令行）
{% note blue 'fas fa-fan' flat %}其他使用技巧{% endnote %}
- 多U多核CPU监控
在top基本视图中，按键盘数字“1”，可监控每个逻辑CPU的状况
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96/QQ%E6%88%AA%E5%9B%BE20221011093313.jpg)
观察上图，服务器有4个逻辑CPU，实际上是1个物理CPU。再按数字键1，就会返回到top基本视图界面
- 高亮显示当前运行进程
敲击键盘“b”（打开/关闭加亮效果）
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96/QQ%E6%88%AA%E5%9B%BE20221011094316.jpg)
进程id为10384的“top”进程被加亮了，top进程就是视图第二行显示的唯一的运行态（runing）的那个进程，可以通过敲击“y”键关闭或打开运行态进程的加亮效果。
- 进程字段排序
默认进入top时，各进程是按照 `CPU的占用量`来排序的，敲击键盘“x”（打开/关闭排序列的加亮效果）

##  xdg-open命令
`xdg-open` 命令可以打开pdf,jpg,png,网页,文本等格式（它会自动选择合适的程序打开，非常滴方便）如果记不住的可以设置命令的别名：
```bash
# dakai是别名
alias dakai='xdg-open'
```
查看系统设置的别名
```bash
alias
```
删除别名
```bash
unalias 别名
```
这样以后直接输入 `dakai xxx` 就OK了，不过重启后还是会没了，因为这是临时别名，想要永久生效需要加入到 Linux启动文件 
如果想在bash下使用命令：`.bashrc`(隐藏文件)或.bash_profile(隐藏文件)，需要注意`cp -i`转义使用要双引号
```bash
# 当前用户生效
echo 'alias cp='"'cp -i'" >> ~/.bashrc
# 全局用户生效
echo 'alias cp='"'cp -i'" >> /etc/bashrc
```
如果想在zsh下使用命令：`.zshrc`(隐藏文件)或.zsh_profile(隐藏文件)
```bash
# 当前用户生效
echo 'alias cp='"'cp -i'" >> ~/.zshrc
# 全局用户生效
echo 'alias cp='"'cp -i'" >> /etc/zshrc
```
也可以直接打开路径下的文件
```bash
# bash下
gedit ~/.bashrc
# zsh下
gedit ~/.zshrc
```
其他shell操作类似
修改完重启配置文件生效
```bash
# zsh
source ~/.zshrc
# bash
source ~/.bashrc
```

## 修改用户名

首先注销你想要修改的用户名，不要登陆进去，先登陆进另一个用户名(可新建一个)，然后进入终端，输入下面命令：
```bash
sudo usermod -l xxx -d /home/xxx -m oldusername
```
其中，`xxx` 表示你新的用户名 ，`oldusername` 表示你之前旧的用户名(即你注销出去那个)，搞定就注销当前，重新登陆之前那个即可看到效果
 `注意`：使用 `usermod -l xxx`命令只是将当前用户的登录名修改为xxx，但是它并不能修改当前用户的家目录和其他相关配置文件中的用户名，所以使用上面的命令会把配置文件也一起修改了。、

可以输入下面命令查看是否已经修改了配置文件里的用户名：
```bash
grep oldusername /etc/passwd
```
`oldusername` 表示你之前的用户名，如果结果里没有表示修改成功

## 修改域名
- 首先输入这条
```bash
sudo nano /etc/hostname
```
在打开的文件中，将当前主机名替换为新的主机名，并保存更改，按下 `Ctrl + O，然后按 Enter 键`,这将保存您所做的更改，然后按下 `Ctrl + X`，这将使nano编辑器退出，并返回到终端提示符，如果您想放弃对文件的更改并退出编辑器，请按下 `Ctrl + C`

需要注意的是，在保存文件时，如果您更改了文件的名称或位置，则需要使用另一个文件名保存文件。例如，如果您在编辑 /etc/hostname 文件时更改了文件名，则您需要使用以下命令将其保存为新文件名：
```bash
sudo nano new_hostname_file_name
```
- 然后输入下面,在打开的文件中，找到包含旧主机名的行，并将其替换为新主机名
```bash
sudo nano /etc/hosts
```

- 重启
```bash
sudo reboot
```



{% note red 'fas fa-fan' flat %}注意{% endnote %}

如果您更改了Ubuntu计算机的主机名或域名，则可能需要更新某些配置文件，以便它们反映新的主机名或域名。具体来说，以下类型的配置文件可能需要更新:

| 配置文件                                                     |
| :----------------------------------------------------------- |
| `/etc/hosts`文件：这个文件包含计算机上所有主机名和IP地址的映射。如果您更改了主机名或域名，则需要更新此文件中与旧主机名相关联的所有行。 |
| `/etc/hostname`文件：这个文件包含计算机的主机名。如果您更改了主机名或域名，则需要更新此文件中的主机名。 |
| `/etc/mailname`文件：如果您使用邮件服务器，则需要更新此文件中的主机名。 |
| `/etc/apache2/conf.d/fqdn`文件：如果您使用Apache Web服务器，则需要更新此文件中的主机名。 |
| `/etc/bind/named.conf.local`文件：如果您使用BIND域名服务器，则需要更新此文件中的主机名。 |
| `/etc/ssh/sshd_config`文件：如果您使用SSH服务器，则需要更新此文件中的主机名。 |



  

  

  
