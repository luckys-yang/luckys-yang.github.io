---
title: shell脚本学习
cover: /img/num5.webp
categories:
  - shell
comments: false
abbrlink: f26f620f
date: 2023-01-22 11:01:04
---



## 前言

- 参考文章

[Linux 命令大全 | 菜鸟教程](https://www.runoob.com/linux/linux-command-manual.html)



## 注意问题

- 如果内容中包含 `$` 符号时要用 `\` 符号进行转义



## 基础命令

- `cat` 常用于显示某个文件的内容，或者将几个文件内容连接一起显示(常与重定向或追加符号配合使用)

```bash
# 1.查看abc.txt内容
cat abc.txt

# 2.非交互式编辑文件，'>'表示重定向(输出)，'<<'表示输入，输入完回显示一个'>'就可以写内容了(之前的内容会被覆盖)，写完内容最后需要加结束符，故最后一行是这样的:'> EOF'
cat >abc.txt<<EOF

# 3.清空abc.txt文件内容，但是文件还存在
cat /dev/null >abc.txt
```

- `touch` 命令常用于新建一个文件