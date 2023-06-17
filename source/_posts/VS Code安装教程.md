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
---
## 安装与配置vscode

参考文章：https://juejin.cn/post/7054468187600977956

- 官网下载 [Visual Studio Code ](https://code.visualstudio.com/)
- 去下载 [MingG64](https://sourceforge.net/projects/mingw-w64/files/)，选择 `x86_64-posix-seh`，直接解压到D盘某文件夹里即可，我的路径是 `D:\GW64\mingw64\bin`
- 配置环境变量，进去到刚刚解压的文件夹里，找到 `bin` ，复制当前路径打开环境变量在 Path里添加即可

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230416124922.webp)

- 打开vscode，安装中文插件还有 `C\C++` 插件，然后 `CTRL+SHIFT+P` 打开控制面板，输入 `C\C++` ，找到UI配置，进去路径选择你刚刚那个bin里面(一般已经自动检测到)，然后下面选择 `window-gcc-x64`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230416124810.webp)

- 然后写一个C语言测试代码点击 `以非调试模式运行`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230416124039.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230416124053.webp)

它会生成一个 `.vscode` 文件夹，里面有 `tasks.json`，`launch.json(可能没有这个需要自己创建)`，然后按下面修改即可

{% folding, tasks.json %}

```json
{
    "tasks": [
        {
            "type": "cppbuild",
            "label": "C/C++: gcc.exe 生成活动文件",
            "command": "D:\\GW64\\mingw64\\bin\\gcc.exe",	//路径看你自己那改
            "args": [
                "-fdiagnostics-color=always",
                "-g",
                "-fexec-charset=GBK",   // 处理mingw中文编码问题
                "-finput-charset=UTF-8",// 处理mingw中文编码问题
                "${file}",
                "-o",
                "${fileDirname}\\${fileBasenameNoExtension}.exe"
            ],
            "options": {
                "cwd": "${fileDirname}"
            },
            "problemMatcher": [
                "$gcc"
            ],
            "group": {
                "kind": "build",
                "isDefault": true
            },
            "detail": "调试器生成的任务。"
        }
    ],
    "version": "2.0.0"
}
```

{% endfolding %}

{% folding, launch.json %}

```json
{
    "version": "0.2.0",
    "configurations": [
      {
        "name": "g++.exe - 生成和调试活动文件",
        "type": "cppdbg",
        "request": "launch",
        "program": "${fileDirname}\\${fileBasenameNoExtension}.exe",
        "args": [],
        "stopAtEntry": false,
        "cwd": "${fileDirname}",
        "environment": [],
        "externalConsole": true,  //打开控制台需要在程序里加 system("pause");否则控制台一闪而过
        "MIMode": "gdb",
        "miDebuggerPath": "D:\\GW64\\mingw64\\bin\\gdb.exe",
        "setupCommands": [
          {
            "description": "为 gdb 启用整齐打印",
            "text": "-enable-pretty-printing",
            "ignoreFailures": true
          }
        ],
        "preLaunchTask": "C/C++: gcc.exe 生成活动文件"
      }
    ]
  }
```

{% endfolding %}



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

现在我使用的字体是 `HarmonyOS Sans SC Light`，[HarmonyOS](https://github.com/IKKI2000/harmonyos-fonts/blob/main/fonts/HarmonyOS_Sans/HarmonyOS_Sans_Bold.ttf)



- 主题颜色

我使用这个插件 `One Dark Pro` 的 `One Dark Pro Mix` 主题感觉不错



## 快捷键

- 快捷键回到上一次编辑的地方

`alt + <-` 返回上一级

`alt + ->` 回到下一级

  