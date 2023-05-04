---
title: vs code 踩坑合集
cover: /img/num91.webp
comments: false
tags:
  - VS Code
categories:
  - 问题
abbrlink: da44d010
date: 2022-09-25 16:45:37
updated: 2022-09-25 16:45:37
---
- 编译器编码与生成EXE编码不一致

> 今天用vscode打开我的一个旧项目发现代码显示中文正常，点开生成的exe文件里面中文全是乱码，我通过查看控制台属性发现是UTF-8，而我编译器是 utf-8带bom，通过网上查找许多教程终于搞好了：
>
> 首先是  `.cpp` 文件需要 `点击下方的编码`--> `通过编码重新打开`(选择Simplified Chinese (GBK)--> `如果这时候代码变乱码只需 CTRL+z回退一下就正常了`)
>
> 接着点击 `设置` --> `搜索编码即可`(设置成Simplified Chinese (GBK))
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220925163416.jpg)
>
> 然后打开 `设置` --> `右上角打开json`
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220925163555.jpg)
>
> 添加下面的即可：
>
> ```cpp
> "[cpp]": {
>         "files.encoding": "gbk"
>     },
>     "[c]": {
>         "files.encoding": "gbk"
>     },
> ```
>
> 重新运行即可



- 多文档编程需要注意

> 在 vscode 多文档时是跟 vs2019不一样的，它不是在设置里添加路径，是到 `.vscode` 目录下的 `launch.json` 和 `tasks.json` 里改
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220925164055.jpg)
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220925164327.jpg)
>
> 这样直接运行 `main.cpp` 即可生成的 `exe` 不用删除它会实时更新



- printf输出空白乱码

> 需要把工程编码改成UTF-8然后撤销一下即可



- 打开vscode右下角弹出 `Code安装似乎损坏,请重新安装` ，原因是因为安装了 `background插件` 导致的它可能会修改配置，解决方法：

1. 卸载这个插件
2. 安装 `Fix VSCode Checksums插件`，然后 `CTRL+SHIFT+P`打开命令面板，输入

```bash
Fix Checksums: Apply
```

并且点击回车，然后右下角会弹出 `Checksums applied. Please restart VSCode to see effect` 提示，此时重启vscode即可成功