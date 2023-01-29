---
title: VS Code安装教程
cover: /img/num46.webp
comments: false
tags:
  - VS Code
  - PicGo
categories:
  - 资源分享与教程
abbrlink: 61bdeebe
date: 2022-05-30 15:40:00
updated: 2022-09-25 13:38:36
---
## 安装与配置vscode

- 官网下载 <font color='orange'>VS Code</font>：[Visual Studio Code ](https://code.visualstudio.com/)
- 下载 TDM-GCC：[tdm-gcc](https://jmeubank.github.io/tdm-gcc/download/)

- 安装过程需要注意：
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202205301656472.png)
- 安装完成先不要打开 `vs code` ，先在没有中文的路径下新建一个文件夹，然后进去文件夹里右键选择【通过 code 打开】，然后进入到 `vs code` 在里面左边栏右键新建文件，取名 `main.cpp` 然后简单写几行代码用来调试（得先下载相关插件）
- 安装插件
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96/QQ%E6%88%AA%E5%9B%BE20220614171327.jpg)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202205301741486.jpg)
如果运行报错：`launch: program 'd:\vsProject\mian.exe'does not exist`，则需要配置`tasks.json` 和 `launch.json`，直接替换成下面的模板修改一下路径即可

tasks.json

注意："command"和"detail"的路径得看你之前下载的`TDM-GCC`的路径，替换即可
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96/QQ%E6%88%AA%E5%9B%BE20220614172023.jpg)

```json
{
    "tasks": [
    {
        "type": "cppbuild",
        "label": "C/C++: g++.exe build active file",
        "command": "D:/tdmgcc/tdd/bin/g++.exe",
        "args": ["-g", "${file}", "-o", "${fileDirname}\\${fileBasenameNoExtension}.exe"],
        "options": {
        "cwd": "${fileDirname}"
        },
        "problemMatcher": ["$gcc"],
        "group": {
        "kind": "build",
        "isDefault": true
        },
        "detail": "compiler: D:/tdmgcc/tdd/bin/g++.exe"
    }
    ],
    "version": "2.0.0"
}
```
launch.json

注意：这里"miDebuggerPath"路径跟上面一样需要改成你的路径
```json
{
    // 使用 IntelliSense 了解相关属性。 
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [{
        "name": "g++.exe - Build and debug active file",
        "type": "cppdbg",
        "request": "launch",
        "program": "${fileDirname}\\${fileBasenameNoExtension}.exe",
        "args": [],
        "stopAtEntry": false,
        "cwd": "${fileDirname}",
        "environment": [],
        "externalConsole": false,
        "MIMode": "gdb",
        "miDebuggerPath": "D:\\tdmgcc\\tdd\\bin\\gdb.exe",
        "setupCommands": [
        {
            "description": "Enable pretty-printing for gdb",
            "text": "-enable-pretty-printing",
            "ignoreFailures": true
        }
    ],
    "preLaunchTask": "C/C++: g++.exe build active file"
    }]
}
```

##  附：PicGo上传图片问题

1、需要把 `火绒` 关了！！！
2、`设置`->`代理`->`手动设置代理`，选上
3、打开 `DevSidecar-给开发者的边车辅助工具`软件
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202205301744803.jpg)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202205301745321.jpg)




## vscode安装插件

{% note blue 'fas fa-fan' flat %}开发微信小程序插件{% endnote %}

- <font color='orange'>vscode weapp api</font>（为vscode提供小程序[API](https://so.csdn.net/so/search?q=API&spm=1001.2101.3001.7020)提示及代码片段）
- <font color='orange'>vscode wxml</font>（为Vscode提供 wxml 语法支持及代码片段）
- <font color='orange'>vscode-wechat</font>（wechat app support for vscode(version v1.6.0+)）
- <font color='orange'>Easy WXLESS</font>（为vscode提供wxss语法支持及代码片段）

- <font color='orange'>小程序开发助手</font>（微信小程序标签、属性的智能补全）



{% note blue 'fas fa-fan' flat %}其他好用插件{% endnote %}

- <font color='orange'>Bracket Pair Colorizer</font>（多彩括号）
- <font color='orange'>JavaScript (ES6) code snippets</font>（ES6语法智能提示,支持js）
- <font color='orange'>Path Intellisense</font>（自动提示文件路径）
- <font color='orange'>Todo Tree</font>（高亮一些特定的注解，在左侧菜单快速定位到该位置）
- <font color='orange'>background-cover</font>（背景图片设置）
- <font color='orange'>C/C++ Compile Run</font>（按F6运行会有黑窗口，需要打开设置--扩展--Compile Run configuration
--Run-in-external-terminal打钩）

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202205301812486.jpg)

- 字体设置

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202205301849751.jpg)


  
  