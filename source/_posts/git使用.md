---
title: git使用
cover: /img/num121.webp
categories:
  - Git
comments: false
abbrlink: 4896de77
date: 2023-03-29 11:41:28
---



## 我的Git仓库

https协议访问经常访问不了，ssh安全快速

- [【博客推送】仓库](https://github.com/luckys-yang/luckys-yang.github.io)

```bash
git@github.com:luckys-yang/luckys-yang.github.io.git
```

- [【博客源码】仓库](https://github.com/luckys-yang/my_blog)

```bash
git@github.com:luckys-yang/my_blog.git
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



## Git错误集合

{% note simple %}

```bash
error: RPC failed; HTTP 500 curl 22 The requested URL returned error: 500
```

这个是因为网络不稳定，重新 `git push origin master` 即可

{% endnote %}



