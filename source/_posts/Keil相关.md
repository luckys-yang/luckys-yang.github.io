---
title: Keil相关
cover: /img/num54.webp
comments: false
tags:
  - 破解
categories:
  - 资源分享与教程
abbrlink: d68fd8c9
date: 2022-04-10 23:08:00
---

##  前言
收集的各种报错解决方案
- [解决keil MDK 5 编译出现"Could not open file ..\output\core_cm3.o: No such file or directory"的终极超简单方法](https://blog.csdn.net/qq_42926939/article/details/89502253)
- [国产32冒充STM32导致daplink下载不了](https://blog.csdn.net/chunquqiulailll/article/details/113257923)

其他

- [ARM-GCC等等其他](https://gnutoolchains.com/arm-eabi/)
- [pack](https://www.keil.arm.com/packs/stm32f1xx_dfp-keil/boards/)

软件

- [阿里云](https://www.aliyundrive.com/s/42kfPMTvnJD)

## 配置 STM32 开发环境

- 首先到官网下载  [keil MDK](https://www.keil.com/download/product/)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204102318148.jpg)

- 点击后会弹出需要填写信息的页面随便写就行了

- 写完会弹出以下页面点击下载即可

  ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204102318878.jpg)

- 下载完成安装即可，<font color='cornflowerblue'>中间无需改任何东西位置默认就行</font><font color='grey'>（由于我之前下过 keil C51 所以第一次下时我改过位置导致后面破解不了只能把 keil C51 卸了重新下 keil MDK）</font>

- 安装完成后右键<font color='red'> "以管理员身份打开"</font>然后打开破解工具开始破解

{% gallery %}
  ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204110859306.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204110859284.png)
{% endgallery %}

- 复制 ID 后打开破解工具按照下面图片步骤完成（破解工具在我书签页第一个书签）

  ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204110904654.png)

- 把复制的那串密钥粘贴到下面那个位置，点击 Add 如果成功了则上面就会显示 <font color='orange'>MDK-ARM Plus</font>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204110906694.png)

- 破解完成后还需要安装STM32的芯片包（不然你没有芯片也不能编译代码）；直接去 [MDK5 Software Packs](https://www.keil.com/dd2/Pack/# !# eula-container)下载，记得选择正确的型号，因为我的板子是 <font color='orange'>STM32F103RDT6</font>；所以我就下载 STM32F1系列的（保存目录最好存你 keil MDK 安装目录下）

{% gallery %}
  ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204110918781.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204110918078.png)
{% endgallery %}


- 下载完成后到目录找到这个 pack 双击它安装（安装过程一直 Next 即可）

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204110921163.png)

- 安装完成后打开 keil MDK 软件检查有没有这个芯片包

{% gallery %}
  ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111341088.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111341899.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111341570.png)
{% endgallery %}

这样就完成了！！！

##  配置 C51 开发环境

如果还想写 51单片机代码则还想要配置 C51的密钥，首先下载 <font color='orange'>MDK-C51</font>配置（压缩包在书签第一个）

- 将 MDK-C51解压后可以看到这些文件

  ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111349583.png)

- 然后将 C51.zip 复制到你的 Keil MDK 安装目录下然后解压（不知道安装目录的可以右键你的 Keil MDK 找到"<font color='orange'>文件所在位置</font>"）

  ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111353954.png)

<font color='cornflowerblue'>这是解压后的部分文件截图：</font>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111354475.png)

- 然后把之前 MDK-C51解压后的 C51配置代码.txt 用记事本打开，修改 <font color='orange'>PATH</font>的路径为你 Keil MDK 的安装目录（就是刚刚的"文件所在位置"）

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111359847.png)

- 然后打开 Keil MDK 安装目录下的 <font color='orange'>TOOLS.INI</font> 配置文件，将上面修改好路径的配置代码复制到该文件的<font color='orange'>末尾</font>然后保存即可（如果提示权限不足，建议用管理员权限打开此配置文件）

{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111403757.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111403923.png)
{% endgallery %}

- 然后打开 Keil MDK，打开刚刚的 <font color='orange'>License Management</font> 复制 ID 到破解工具那生成秘钥然后激活即可

{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111407801.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111408500.png)
{% endgallery %}

- 51单片机系列的选<font color='red'> AT89C52 </font>即可（头文件是：<font color='orange'># include "reg52.h"</font>）

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111412274.png)

好了，现在可以愉快的敲代码了



##  美化代码界面

一开始代码界面是[默认](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E6%96%87%E6%9C%AC/%E9%BB%98%E8%AE%A4.prop)的，有的人可能就不太习惯，比如我（我一开始接触C语言就是在 VS2019 上敲的，实在太舒服了）；但是 Keil 没有设置代码配色方案的 UI 支持，所有的配色方案都是在安装目录下的 <font color='orange'>/UV4/global.prop</font> 文件中定义，可以自行设计配色方案。这里分享好看的几款（下载后直接覆盖重启 Keil 即可）：

 [global.prop（sublime风格）](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E6%96%87%E6%9C%AC/1.prop)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111506994.png)


[global.prop（VScode风格）](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E6%96%87%E6%9C%AC/2.prop)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111545687.png)

<font color='red'>注意：</font>重启打开项目会出现注释乱码这需要手动修改设置，这样注释就恢复了

{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111547157.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202204111548471.png)
{% endgallery %}


##  插件

{% btns rounded grid5 %}
{% cell 下载,https://www.aliyundrive.com/s/AVCfSjG1utZ, fas fa-download %}
{% endbtns %}

- CoolFormat(代码格式化2)
- AStyle(代码格式化1)
- DateTime(当前时间)
- FunctionComment(函数注释)
- FileComments(文件注释)



##  嵌入式开发工具

[RT-Thread Studio - RT-Thread物联网操作系统](https://www.rt-thread.org/page/studio.html)



## keil编译脚本

速度跟在软件里编译是一样的没区别

放在 `uvprojx` 文件同级目录下双击
`UV` 改成你的UV4.exe路径

```bat
@echo off

set UV=C:\Keil_V5\UV4\UV4.exe
set UV_PRO_FILE="uvprojx"
set UV_PRO_DIR=%cd%

for /f "usebackq delims=" %%j in (`dir /b "%UV_PRO_DIR%"\*."%UV_PRO_FILE%"`) do (
if exist %%j (
set UV_PRO_FILE_PATH="%UV_PRO_DIR%\%%j"))

echo %UV%
echo %UV_PRO_DIR%
echo %UV_PRO_FILE_PATH%

echo Init building ...
echo .>build_log.txt
%UV% -j0 -r %UV_PRO_FILE_PATH% -o %cd%\build_log.txt
type build_log.txt
echo Done.
pause
```



## vscode+keil

{% note blue 'fas fa-fan' flat %}参考文章{% endnote %}

[vscode “未定义标识符”的一种情况](https://blog.csdn.net/hill_guo/article/details/127248239?spm=1001.2101.3001.6650.6&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-6-127248239-blog-124092622.235%5Ev29%5Epc_relevant_default_base3&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-6-127248239-blog-124092622.235%5Ev29%5Epc_relevant_default_base3&utm_relevant_index=11)

[VS Code配置开发环境时出现“未定义标识符”](https://blog.csdn.net/qq_43784626/article/details/111638186?spm=1001.2101.3001.6650.5&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-5-111638186-blog-124092622.235%5Ev29%5Epc_relevant_default_base3&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-5-111638186-blog-124092622.235%5Ev29%5Epc_relevant_default_base3&utm_relevant_index=10)

{% note red 'fas fa-fan' flat %}方法1{% endnote %}

- 安装插件 `Keil V`
- 写UV4.exe的路径

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230419214442.webp)

- 打开项目的话可以管理员身份打开vscode然后在里面直接就打开项目的根目录文件夹即可
- 注意编写 `setting.json`，不加的话会出现宏定义下面有红色波浪线警告，但是可以跳转定义

```json
{
    "files.associations": {
        "my.h": "c"
    },
    "C_Cpp.intelliSenseEngineFallback": "Disabled", //需要添加的
    "C_Cpp.intelliSenseEngine": "Tag Parser",  //  需要添加的
}
```

- 添加 `c_cpp_properties.json`

```json
{
    "configurations": [
        {
            "name": "Win32",
            "includePath": [
                "${workspaceFolder}/**",
                "C:/Keil_v5/ARM/ARMCC/include"
            ],
            "defines": [
                "_DEBUG",
                "UNICODE",
                "_UNICODE",
                "__CC_ARM", /*必须加*/
                "USE_HAL_DRIVER",   /*看keil的宏定义*/
                "STM32G431xx"   /*看keil的宏定义*/
            ],
            "compilerPath": "D:\\GW64\\mingw64\\bin\\gcc.exe",
            "cStandard": "c99",
            "cppStandard": "c++17",
            "intelliSenseMode": "windows-gcc-x64"
        }
    ],
    "version": 4
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230419215508.webp)



- vscode最好用管理员身份打开，这样不需要每次编译或者下载时需要点击弹窗
- MX配置完后vscode自动会刷新

{% note red 'fas fa-fan' flat %}方法2{% endnote %}

下载插件`Keil Assistant` ，然后配置一下路径

> 推荐下载 `1.6.2版本`，可以使用快捷键进行编译下载，新版本不行

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230508183557.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230508183754.webp)





## KEIL快捷键设置

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230414140940.png)

- 修改  `跳转到定义` 快捷键为 `CTRL+B`

```bash
Edit:Advanced:Go to Definition of current Word
```

- 修改 `注释选择的内容` 快捷键为 `CTRL+/`

```bash
Edit:Advanced:Comment Selection
```

- 修改 `取消注释` 快捷键为 `CTRL+SHIFT+/`

```bash
Edit:Advanced:Uncomment Selection
```



## 用户代码片段

可以设置快捷代码模板，在左下角设置 --- `用户代码片段`，然后选择对应语言，在程序里输入 `//sta`就可以选择模板回车了

```json
{
	"Print to console_1": {
		"prefix": "//static",
		"body": [
			"/*====================================静态内部函数声明区 BEGIN====================================*/",
			"/*====================================静态内部函数声明区    END====================================*/"
		],
		"description": "静态内部函数声明区注释"
	},
	"Print to console_2": {
		"prefix": "//",
		"body": [
			"/*====================================变量区 BEGIN====================================*/",
			"/*====================================变量区    END====================================*/"
		],
		"description": "全局/外部变量区注释"
	}
}
```



##  问题

- static声明了函数但是未使用的话会有警告

> warning:  #177-D: function "GUI_ST7735_DrawBox"  was declared but never referenced

解决方法：

1. 保留这个函数的声明，但不想看到这个警告，可以在函数名称前加修饰符 `__attribute__((unused))` 告诉编译器这个函数不使用
2. 注释掉不使用的函数，使用宏定义来把不使用到的集中起来注释，用到再提出去

- 安装完，如果芯片页面是绿色的点击下载按钮会卡死，这个需要安装 `MDK-For Cortex 524.exe`，然后看看有没有变灰，变了就OK，实在不行重启，还不行的话就新建一个工程，选择另一个不要选下面这个：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230527205130.webp)

- Keil的注册表信息

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230528102209.webp)

- AC5

开发要用MDK，建议安装5.36版本，这个版本有AC5编译器，之后的版本不再集成

解决方法：

1. 先安装5.36再安装最新版本，这样AC5可以自动集成到MDK中
2. 安装最新版本后手动添加AC5编译器，安装完MDK后把ARMCC文件夹手动放到keil安装目录的ARM文件夹中，然后在keil中手动添加，选择刚刚添加的文件夹

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230611102530.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230611102623.webp)

- 编译报cmsis_version.h或__COMPILER_BARRIER的错误

这两个都和CMSIS CORE有关，要勾选如下选项，例程里应该已经默认勾选了，注意CORE的版本，低于5.1.0勾上也还会报错，可以尝试安装网盘或群文件里的 `ARM.CMSIS.5.9.0.pack` 或者 `直接升级MDK`

[github](https://github.com/ARM-software/CMSIS_5/releases)

[ARM](https://www.keil.arm.com/packs/?q=&sort_by=)

- 溢出

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230612072623.webp)

解决方法：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230612072757.webp)

- HAL库，勾选了C库后编译报错：

```cpp
Undefined symbol __use_two_region_memory
Undefined symbol __initial_sp
```

解决方法是打开工程下的 `startup_xxx.s` 文件，翻到最后面，注释下面这两行，然后编译再取消注释再编译就正常了

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230614000006.webp)

> 参考文章：https://blog.csdn.net/qq_62014938/article/details/125602277

- 使用V6编译器，如果代码有中文会报警告，可以在魔法棒那添加屏蔽或者在文件顶部写下面这句

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ图片20230624112034.webp)

```cpp
#pragma clang diagnostic ignored "-Winvalid-source-encoding"
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230624111741.webp)

```cpp
-Wno-invalid-source-encoding
```

- MX后面重新生成代码后，keil工程里自己创建的group和头文件路径全部没了

> 最新：这个是CubeMX的Bug，6.9.1版本已经修复

 在点击了MX的GENERATE CODE按钮后，在弹出界面那选择【Open Project】最后那个选否

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230816185451.webp)

- 串口打印都是0问题

使用V5版本+勾选C库就正常，但是使用V6版本的话直接勾C库会报错，需要先使用V5版本然后在主函数main页面点击最左边的那个编译一次，再切换到V6版本+勾C库，然后点击第2个编译按钮编译即可没有错误，但是还是输出0，此时只需要去内存管理那切换到 `-O0`即可