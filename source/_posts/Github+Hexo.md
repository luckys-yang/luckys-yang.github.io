---
title: Github+Hexo
cover: /img/num2.webp
comments: false
categories:
  - 本站点滴
password: 20211020
message: 私密内容...
abbrlink: 706d020b
date: 2021-10-20 14:22:46
---

## 前言

- 参考文章

[淘宝 npm 域名即将切换 && npmmirror 重构升级](https://zhuanlan.zhihu.com/p/465424728?spm=a2c6h.24755359.0.0.6d444dccU4Hosu)

[利用腾讯云对象存储 COS 桶托管 hexo 博客](https://cloud.tencent.com/developer/article/1947477)

[使用腾讯云对象存储最低成本搭建静态网站](https://www.bilibili.com/read/cv6274937/)

博客：https://stackoverflow.club/article

[github自定义域名](https://skyreeves.cn/post/4d89caeb.html)

[Git常用命令](https://xlenco.eu.org/posts/1b99.html)

[Git命令取别名](https://blog.csdn.net/wu_xianqiang/article/details/105913866)

[知名Github加速平台jsdelivr域名被墙，启用新方案加速Github静态文件](https://www.peico.cn/749.html)

[Netlify部署Hexo](https://blog.csdn.net/qq_38701868/article/details/108677521)

本Blog参考于下面教程部署：

[基于 Hexo 从零开始搭建个人博客（一）](https://tzy1997.com/articles/hexo1601/)

[基于 Hexo 从零开始搭建个人博客（二）](https://tzy1997.com/articles/hexo1602/)

[基于 Hexo 从零开始搭建个人博客（三）](https://tzy1997.com/articles/hexo1603/)

[基于 Hexo 从零开始搭建个人博客（四）](https://tzy1997.com/articles/hexo1604/)



## 安装部分

- 首先环境部署：

|  名称   |                下载地址                 |                             注意                             |
| :-----: | :-------------------------------------: | :----------------------------------------------------------: |
| node.js | [点我](https://nodejs.org/en/download/) | 选择.msi 64位下载安装在除了C盘以外的盘，安装完记得验证一下(我的版本是v18.13.0) |
|   Git   |  [点我](https://git-scm.com/downloads)  | 安装在除了C盘以外的盘，还要配置环境变量(我的版本是2.39.0.windows.2) |

- 验证

①打开CMD输入下面命令出现版本号表示安装成功(npm 为 Node.js 的包管理工具)

```
node -v
npm -v
```

②打开 git bash 或 cmd，输入下面命令出现版本号表示安装成功

```
git --version
```


- 环境变量配置

以你Git的安装路径为准，我的是 `C:\BoKe\Git\Git\cmd`，把这段路径复制到环境变量系统变量--Path里，完成后执行上面的验证步骤

- 更换 NPM 镜像源

由于官方默认的 NPM 镜像源在国内速度不是很好，建议换成淘宝的镜像

```
npm config set registry https://registry.npmmirror.com
```

- 设置NPM源的另一种方式---nrm(选看)

安装nrm

```
npm install -g nrm
```

常用命令：

```
nrm -V :查看nrm 版本
nrm current :查看当前npm源名称
nrm ls :查看npm源列表
nrm add 【自定义源名称】 【源地址】：添加源
nrm use 【源名称】：切换npm源
nrm del 【源名称】:删除npm源
nrm test 【源名称】：测试源的访问速度，不加源名称则默认测试所有源的速度(结果数字越小表示越好)
```



## Github部分

- 注册Github账号(有则创建存储库即可)

|      官网地址      |
| :----------------: |
| https://github.com |

创建存储库时库名格式是 `用户名.github.io`(我的用户名是yangzhenwang)；然后勾选public(公开)，点击 `Create repository` 创建即可

创建完成后点击仓库绿色的 `< >code` 保存ssh下的那段，我的如下：

```
git@github.com:xxx/xxx.github.io.git
```

点击你的仓库右侧的 `Settings` 向下找到`Gihub pages`,点击`Launch automatic page generator`，Github 将会自动替你创建出一个 pages 的页面。 如果配置没有问题，大约几分钟之后，`yourname.github.io`这个网址就可以正常访问了(我的是https://yangzhenwang.github.io)

## 安装Hexo

- 在合适的盘符里创建，我选的是 `G:\yangblog`下，在该文件夹下右键打开 `Git Base Here`开始输入命令安装：

```
npm install hexo-cli -g
```

<span style="color:red;">注意：</span>如果这里执行命令出现很多 `npm ERR!`并且有 `4048` 错误则去删除 `C盘/用户/下的.npmrc文件`，再去重新执行命令(这个错误是因为有缓存，清理下缓存就行)；还有别的方法如可以输入下面任意一条命令：

```
npm cache clean --force
npm cache verify
```

还有就是如果npm命令不行就换成npx试试

- 再安装hexo

```
npm install hexo --save
```

- 安装完验证(出现版本号表示安装成功)

```
hexo -v
```

- 初始化文件夹(3条命令)

```
hexo init blog // hexo会安装到blog这个文件夹
cd blog
npm install
```

- 生成Hexo页面

```
hexo generate
```

- 启动预览服务

```
hexo server
```

此时就可以通过 `http://localhost:4000` 来本地预览你的博客了(Ctrl+C则退出预览)

##  推送到 Github

- 配置个人信息

```
git config --global user.name "XXXX"	# 名字QQ号即可跟下面对应
git config --global user.email "XXXXXXXXX@XXX.com"	# 一般是QQ邮箱
```

- 生成密钥

```
ssh-keygen -t rsa -C xxxxxx@xx.com
# -C后面加你在github的用户名邮箱，这样公钥才会被github认可
less ~/.ssh/id_rsa.pub
# 查看公钥内容稍后加入Github账户的sshkey中
```

然后会弹出一些信息，它会生成秘钥保存在某个文件夹下我的是 `/c/Users/44478/.ssh/id_rsa`

- 查看 id_rsa.pub 文件，并整个复制

```
cat ~/.ssh/id_rsa.pub
```

- 然后复制秘钥去github--`点击setting`--`点击SSH and GPG keys` -- `点击New SSH key` --`粘贴在key处，title随便写即可`，然后在Git输入命令看看是否可以用

```bash
ssh -T git@github.com
```



- 修改 hexo 根目录下的文件`_config.yml`中的 deploy，添加之前保存的 ssh：

```
deploy:
  - type: git
    repo: 
        github: git@github.com:yangblaze/yangblaze.github.io.git #GitHub仓库的ssh
    branch: main  # 分支看你是mian还是master
```

- 推送代码到github需要安装组件

```
npm install --save hexo-deployer-git
```

- 推送代码

```
hexo clean && hexo g && hexo d
```

过几分钟就可以访问 `用户名.github.io` 访问你的博客了



## Hexo常用命令/语法

```
Hexo init初始化博客
Hexo n 标题 创建一篇文章
Hexo clean 清理文件
Hexo g 生成静态文件
Hexo d 部署博客
hexo server启动本地服务
hexo render渲染文件
```

- 注意自定义域名+CDN时，github那不要强制https,CDN开启https服务



## 源码备份/其他操作

- 为Git安装 `tree`命令，把tree.exe复制到 `E:\gits\Git\mingw64\bin\` 下即可，命令是 `tree .`

-   `.gitignore` 文件夹是来筛选出不想提交或者屏蔽的文件，push 的时候也不会上传到git上

```bash
Gitignore用法简介：

#        注释，后面的内容为注释
/        表示根目录
！        指定不忽略的内容
*.sln        忽略掉以.sln为后缀的文件
```

- 【其他用法3】清空远程仓库

```bash
git rm * -f -r	# 删除所有文件夹包括文件
git add .
git commit -m "***" 	# 增加提交信息
git push origin master	# master是远程分支
```

首先要保持本地跟仓库是一致避免有冲突

- 【其他一些命令】

`origin` 是远程仓库链接的别名，链接太长用起来麻烦一般使用这个代替

```bash
git config --global user.name   # 获取当前登录的用户
git config --global user.email  # 获取当前登录用户的邮箱
git remote rm name  # 删除远程仓库
git status # 命令用于查看在你上次提交之后是否有对文件进行再次修改
git reset  [HEAD]	# 回退上一个版本
git reset HEAD^ hello.php  # 回退 hello.php 文件的版本到上一个版本
git log	# 查看历史提交记录
git blame xxx	# 查看某个文件的修改记录

git fetch [alias]	#告诉 Git 去获取它有你没有的数据，然后再执行下面
git merge [alias]/[branch]

git branch	# 没有参数时列出本地的分支，当你执行 git init 的时候，默认情况下 Git 就会为你创建 master 分支，*表示当前的分支
git branch -r	# 列出远程分支
git branch xxx	# 手动创建一个分支
git checkout -b xxx	# 创建新分支并立即切换到该分支下
git checkout xxx	# 切换到xxx分支
git branch -d xxx	# 删除分支
git push origin --delete [branch-name] #【删除远程分支】
git merge xxx	# 合并xxx分支到主分支，删除完就可以使用上面命令删除分支了留下主分支
git tag -a v1.0 -m '注释' # -a表示创建一个带注释的标签，【按ESC，输入:wq!回车确认保存退出】，切换了分支tag仍然存在，说明tag与分支并没有关系，它标识的是某次特定的提交
git tag	# 显示添加的所有标签
git tag -l xxx	# 支持正则表达式查找，如【git tag -l V* 查找V开头的标签】【git tag -l ?2* 查找中间有2的标签】
git push origin xxx	# 推送指定的本地标签到远程仓库，或者用下面这条
git push -u origin master	# (前提是本地和远程仓库已经建立联系)进行一次推送即可
git push origin --tag	# 一次性推送所有本地标签到远程仓库
git push origin :v3.0	# 删除远程仓库标签，但是本地标签还在
git tag -d v3.0	# 删除本地标签
git rm -r --cached .	# 删除本地缓存，将文件改为未track状态，然后在提交
git config --list	# 查看git的配置
```



## 报错集合

### 1.15

- 在输入 `hexo d` 后出现错误：`fatal: not a git repository (or any of the parent directories): .git`，意思是（当前）不是一个git的目录（或任何一个父目录），需要使用命令 `git init` 新建一个.git目录即可，然后推送，需要把 Butterfly那个主题文件移回你根目录主题那，然后仓库会buid报错不用管，部署在vercel的不用怕正常访问网站。还有就是访问github不了就把加速器关了
- 然后还有生成很多分支啥的，可以重新生成ssh秘钥步骤，如果还不行就重装Hexo，最好一开始备份一个blog，我就是这样，还有就是配置文件里把git...改成https...那个
- 不能直接推送整个项目不然build会报错，只需要本地 `hexo c && hexo g`，然后把 `public`文件夹推送上去即可

## vercel部署Hexo

导入Github代码库，搞完需要绑定你域名来访问(因为vercel在国内的DNS被污染了)，腾讯云CDN的话主机记录用 `*` ，CDN那用 `*.yang5201314.cn` 这样vercel里面的域名就不会报错



## Gitee部署Hexo

- 把密钥添加到Gitee里

```bash
git pull git@gitee.com:luckys-yang/luckys-yang.git

git add .

git commit -m '更新'

git pull git@gitee.com:luckys-yang/luckys-yang.git
```

推送完还要登陆Gitee手动点击更新，它才部署不然没效果



## Hexo博客如何迁移到新电脑

参考文章：https://www.fomal.cc/posts/d1927166.html



## 其他命令

- 在 git 用 vscode 打开作为编辑器

```bash
# 回到主目录(也可以不回直接后面指定路径下哪个文件夹)
cd ~
# 用vim打开.bashrc文件
vim ~/.bashrc
# 用alias把vscode的exe的路径包起来(此行在vim里编写，需要按'A'才能插入写完记得'ESC'然后':wq')
# 复制路径是这样：D:\vs code\Microsoft VS Code\Code.exe 需要改一下像下面(有空格要加单引号)：
alias vscode="'/d/vs code/Microsoft VS Code/Code.exe'"
# 退出后生效配置文件就可以用 vscode xxx 了
source .bashrc
```



## bat命令

`bat脚本` 也称批处理文件，是Windows系统默认支持的脚本语言



- 注释

```bash
rem命令行注释，可以回显（语句会在命令行中显示）

::两个冒号，效果同上，但不会回显。（冒号后加任意非字母数字字符都可起到注释作用）
```

- 开关回显与暂停(一般这样用)

```bash
@echo off
xxxx这是内容xxxx
pause
```

- set用法之接收用户输入数据

str是变量名,=后面是提示语

```bash
set /p str=请输入值：
```

- 删除文件命令(只能删除文件，里面的文件夹保留)

```bash
::删除该层目录下的所有文件,需要确认[Y/N]
del G:\xxx\xxx
::不需要确认[Y/N]
del /s G:\xxx\xxx
```



- 删除文件夹命令(如删除temp文件夹，直接整个文件夹没了)

```bash
rd /s /q G:\xx\xx\temp
```

- 复制文件夹命令(如复制public下所有文件夹/文件到king文件夹里，`/e`表示复制目录和子目录包括空的，`/y`表示禁止提示确认要覆盖现有目标文件也就是强制覆盖)

```bash
xcopy /e /y G:\yangblog\yang\public\* G:\yangblog\ts\king\
```



## Netlify部署Hexo

官网：https://app.netlify.com/

直接Github登陆，然后选择导入仓库，把Hexo的那个仓库导入配置默认即可不需要添加任何东西，然后自定义域名，把netlify生成的网站域名解析到CNAME，然后部署证书，证书需要去下载本地然后对应的复制过去即可

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230227133438.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230227132855.webp)

## 问题

出现警告：LF will be replaced by CRLF the next time Git touches it
输入命令 不转化换行符即可
```bash
git config --global core.autocrlf false
```