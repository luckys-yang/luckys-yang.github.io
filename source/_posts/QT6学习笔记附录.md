---
title: QT6学习笔记附录
cover: /img/num162.webp
categories:
  - QT
comments: false
abbrlink: 929f475f
date: 2024-01-04 13:54:38
---



## 参考

> 参考文章

[CMake 学习笔记](https://www.cnblogs.com/zhangyi1357/p/17943887)

[Qt错误总结--关于宏Q_OBJECT](https://blog.csdn.net/mr_robot_strange/article/details/108119719)

[最全的常用正则表达式大全](https://zhuanlan.zhihu.com/p/33683962)

[最全的常用正则表达式大全——包括校验数字、字符、一些特殊的需求等等](https://www.cnblogs.com/zxin/archive/2013/01/26/2877765.html)

[qt 串口助手 界面美化](https://blog.csdn.net/ftjudr/article/details/128474726?ops_request_misc=&request_id=&biz_id=102&utm_term=QTextEdit%E7%BE%8E%E5%8C%96&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduweb~default-0-128474726.142^v99^control&spm=1018.2226.3001.4187)

## 附录-控件相关

### 按钮

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240103190811.webp)



## 附录-资源系统qrc

Qt资源系统是一种平台无关的机制，用于在应用程序中传输资源文件。如果您的应用程序总是需要一组特定的文件(如图标、翻译文件、图像)，并且您不想使用特定于系统的方法来打包和定位这些资源，请使用它。

**优势：**

1. 将图片资源放到资源文件，可以方便管理
2. 当程序编译的时候, 资源文件中的图片会被转换为二进制, 打包到exe中
3. 直接发布exe就可以, 不需要额外提供图片资源了

- QT

在Qt Creator中只需要添加一个新文件，选择 `Qt Resource File` 即可，然后选择打开方式选择那个exe

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240104153156.webp)

用exe打开后

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240104153856.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240104154300.webp)

然后 `Ctrl+S` 保存一下

在 `CMakeLists.txt` 文件里添加(QT添不添加都可以运行)

```bash
set(PROJECT_SOURCES
        Resource.qrc
)
```

然后调用的话这样：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240104155220.webp)

```cpp
setWindowIcon(QIcon(":Resource/zay.png"));
```

- VS

而在Vs中，是没有办法创建资源文件的，我们可以手动创建一个空的.qrc文件，然后打开

把这个exe拷贝到msvc套件的bin目录中，最后把它设置为qrc文件的默认打开方式



## 附录-VS配置

### VS2022配置QT

VS2022安装选择：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240105094114.webp)

1. 首先选择一个合适的位置，创建项目文件夹，并在文件夹里面创建一个名为`CMakeLists.txt`的文件

2. 打开Vs，选择打开本地文件夹，找到刚创建的项目文件夹
3. 然后在项目文件（也叫作CMake文件）`CMakeLists.txt`中加入如下代码

```bash
cmake_minimum_required(VERSION 3.10)

project(day_07 VERSION 1.0 LANGUAGES CXX)

# 防止出现C++17不支持错误
if(CMAKE_CXX_COMPILER_ID MATCHES "MSVC")
        add_compile_options("/Zc:__cplusplus" "/permissive-" ) #"/utf-8"
    if(BUILD_QT5)
         add_compile_options("/utf-8") #"/utf-8"
    endif()
endif()

set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTORCC ON)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Qt6 REQUIRED Widgets)

# 放在提升类后找不到头文件
set(CMAKE_INCLUDE_CURRENT_DIR ON)

set(PROJECT_SOURCES 

)


add_executable(${PROJECT_NAME} ${PROJECT_SOURCES})


target_link_libraries(${PROJECT_NAME} PRIVATE Qt6::Widgets)
```

可能出现报错，需要配置环境变量，找到Qt安装目录配置里面的环境变量，或者把mingw_64的环境变量删除，只添加msvc的即可

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240105094623.webp)

有问题多点这两个：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240110145335.webp)



4. 创建main.cpp，加入如下代码运行即可

```cpp
#include<QWidget>
#include<QApplication>

int main(int argc, char* argv[])
{
	QApplication a(argc, argv);

	QWidget w;
	w.show();

	return a.exec();
}
```



> 也可以直接打开Qt Creator创建的项目，进行编译运行；Qt Creator 也可以直接打开Vs创建的CMake项目



### CMake管理多个项目

待写



### vs插件创建项目

正常选择 `Qt widgets Application` 项目即可，在里面进行选择组件，可以先选择一些常用的比如 `Core,GUI,Widgets`，反正后面也可以在工程里继续添加修改，编译工具选择看个人，需要把 `ui头文件` 输出目录改一下，默认是生成在debug里面的，这样的话会导致后面添加自定义控件时出现包含头文件找不到的问题，需要改成工程根目录，右键 `.ui文件`属性 即：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240110091628.webp)

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240110091854.webp" style="zoom:67%;" />

> 新建的类最好右键【项目】选择 `Qt Class` 进行创建，记得勾选 `object`，新建完成后右键新建的 `.h` 属性那改成 `moc`，否则程序里不能使用 `Q_OBJECT`
>
> <img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240110144246.webp" style="zoom:67%;" />



### vs中在UI里进行信号与槽连接

在主窗口类中声明的“转到槽”式的槽，严格采用 `on_QAction对象名称_方法名称` 的命名方式

参考：

[vs2019开发Qt5，QAction类的信号转到槽的实现技巧](https://blog.csdn.net/phonixsupheria/article/details/107351123)

[开发 Qt 时右键没有自动添加 slots 槽的功能](https://zhaojichao.blog.csdn.net/article/details/131318916)

## QT知识点/问题

> QT文档可在电脑打开：
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231229135224.webp)
>
> <img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231229135347.webp" style="zoom:67%;" />

> 写QT程序不能在主(GUI)线程代码里写死循环，否则程序会卡死(窗口会无响应)

> 经常出现这种配置没问题但是就是编译失败，原因是缓存问题，只需要右键打开文件路径，返回工程路径上一级路径，把缓存文件夹删除即可（或者使用更加快的方法---点击【重新构建】）
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231229104417.webp)
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231229104637.webp)

> 包含一个没有的模块则会报错，需要在 `CMakeLists.txt` 里面进行包含才行：
>
> 比如在main.cpp包含这个头文件，则会出现找不到此文件的错误：
>
> ```cpp
> #include <QSqlQuery>
> ```
>
> 只需要在txt这几个地方添加 `Sql` 即可
>
> ```cpp
> # 查找Qt库版本
> find_package(QT NAMES Qt6 Qt5 REQUIRED COMPONENTS Widgets Sql)
> # 查找当前Qt版本的Widgets模块
> find_package(Qt${QT_VERSION_MAJOR} REQUIRED COMPONENTS Widgets Sql)
> 
> ....
>  
> # 把Qt::Widgets模块的库连接到HelloQt
> target_link_libraries(hello PRIVATE Qt${QT_VERSION_MAJOR}::Widgets
> Qt${QT_VERSION_MAJOR}::Sql)
> ```
>
> 出现那个错误可以【重新构建】即可

> 修改项目名称的话记得也需要在 `CMakeLists.txt` 里面改对应的，当然也可以用简单的方法直接改一处即可，就是把txt里面其他的地方用到的项目名称用 `${PROJECT_NAME}` 代替即可

> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231229112810.webp)

> QT里Debug无输出的话，只需要把那个勾去掉即可：
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231230131510.webp)

> 【文件路径】
>
> 在 `CMakeLists.txt` 里添加
>
> ```bash
> # 设置在构建可执行文件时，可执行文件的输出目录
> set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/bin)
> ```

> 提升类后出现找不到头文件问题，只需要在 `CMakeLists.txt` 里添加
>
> ```bash
> set(CMAKE_INCLUDE_CURRENT_DIR ON)
> ```
>
> 重新构建即可

> `Q_PROPERTY` 宏：一个返回值类型为 type，名称为 name 的属性，用 READ、WRITE 关键字定义属性的读取、写入函数，还有其他的一些关键字定义属性的一些操作特性。属性的类型可以是 `QVariant` 支持的任何类型，也可以用户自定义类型
>
> 不管是否用READ和WRITE定义了接口函数,只要知道属性名称,就可以通过 `QObject:property()` 读取属性值，并通过  `QObject::setProperty()` 设置属性值
>
> 由于该宏是qt特有的，需要用moc进行编译，故必须继承于QObject类

> 指定父对象有两种方法：
>
> 1. `setParent` 函数
> 2. 通过构造函数传参
>
> 如果不指定父对象，那创建的控件就看不到

> ```cpp
> // 元素集合,成对出现,元素的名字,矩形区域范围(其中每个元素都是一个 QPair，QPair 由一个 QString 和一个 QRectF 组成)
> QVector<QPair<QString, QRectF>> listItem;
> 
> /*
> 类似于 C++ 中的 std::vector
> 
> QPair 是一个存储两个值的容器，用于将两个值关联在一起。在这里，每个 QPair 包含一个 QString 和一个 QRectF。
> 
> QString：Qt 中的字符串类，用于存储文本。
> 
> QRectF：Qt 中的矩形类，表示浮点数精度的矩形区域
> */
> ```

> 每一个控件的标识符名称可以在 `.ui` 里面进行设置，这个标识符可以当做CSS样式时的标识符
>
> <img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240113165358.webp" style="zoom:67%;" />

> 【编码问题】，把 `.cpp和.h` 设置成UTF-8或者带Bom最好，不然会报很多警告，也可以使用代码方式，在main主函数添加下面代码(下面的是QT5的，需要头文件 `#include<QtCore5Compat/QTextCodec>`)：
>
> ```cpp
> int main()
> {
> #if (QT_VERSION <= QT_VERSION_CHECK(5,0,0))
> #if _MSC_VER
>     QTextCodec *codec = QTextCodec::codecForName("gbk");
> #else
>     QTextCodec *codec = QTextCodec::codecForName("utf-8");
> #endif
>     QTextCodec::setCodecForLocale(codec);
>     QTextCodec::setCodecForCStrings(codec);
>     QTextCodec::setCodecForTr(codec);
> #else
>     QTextCodec *codec = QTextCodec::codecForName("utf-8");
>     QTextCodec::setCodecForLocale(codec);
> #endif
> }
> ```
>
> 在其他的.cpp首行添加：
>
> ```cpp
> #pragma execution_character_set("utf-8")
> ```

> 数值转字符串用 `QString::number()`



### 正则表达式

需要包含头文件 `#include<QRegularexpression>`,QT6没有 `QRegExp` ，所以用不了

```cpp
// 示例

// 限制输入框只能输入 英文和数字
m_pEditUser->setValidator(new QRegularExpressionValidator(QRegularExpression(R"(^[A-Za-z0-9]+$)"), m_pEditUser));
```

> 语法
>
> - m-n位的数字 --- `^d{m,n}$`
> - n位的数字 --- `^d{n}$`
> - 至少n位的数字 --- `^d{n,}$`

> 常用正则表达式
>
> |                             作用                             |                       表达式                       |
> | :----------------------------------------------------------: | :------------------------------------------------: |
> |                      只能输入英文和数字                      |                  `^[A-Za-z0-9]+$`                  |
> |                         只能输入数字                         |                     `^[0-9]*$`                     |
> |                         只能输入中文                         |                  `^[一-龥]{0,}$`                   |
> |                 只能输入英文和数字，长度0~6                  |                `^[A-Za-z0-9]{0,6}`                 |
> | 必须包含大小写字母和数字的组合，不能使用特殊字符，长度在8-10之间 | `^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\da-zA-Z]{8,10}$` |







## QT设置

> 添加格式化
>
> {% gallery %}
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231230141021.webp)
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231230141049.webp)
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231230141131.webp)
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231230141146.webp)
>
> {% endgallery %}
>
> ```bash
> #ANSI标准的文件格式，
> #--style=ansi	：ANSI 风格格式和缩进(使用这个的话{}会对齐)
> #--style=kr 	：Kernighan&Ritchie 风格格式和缩进
> #--style=linux 	：Linux 风格格式和缩进
> #--style=gnu 	：gnu 风格格式和缩进
> --style=ansi
> indent=spaces=4	   # 缩进采用4个空格
> indent-switches         # -S  设置 switch 整体缩进
> indent-cases 	          # -K  设置 cases 整体缩进
> indent-namespaces       # -N  设置 namespace 整体缩进
> indent-preproc-block    # -xW 设置预处理模块缩进
> indent-preproc-define   # -w  设置宏定义模块缩进	
> pad-oper                # -p  操作符前后填充空格
> delete-empty-lines      # -xe 删除多余空行
> add-braces              # -j  单行语句加上大括号
> align-pointer=name      # *、&这类字符靠近变量名字
> #align-pointer=type       *、&这类字符靠近类型
> ```

> 【vscode进行编写】
>
> 只能编写(跳转方便补全方便)，不能编译和运行，直接在工程文件夹下右键【在vscode打开】，然后创建一个 `.vscode` 文件夹，再创建以下文件即可：
>
> {% folding, c_cpp_properties.json %}
>
> ```cpp
> {
>  "configurations": [
>      {
>          "name": "Win32",
>          "includePath": [
>              "${workspaceFolder}/**",
>              "${workspaceFolder}",
>              "G:\\QT6.5.2\\install\\6.5.3\\mingw_64\\include\\**"    // 模块路径
>          ],
>          "defines": [
>              "_DEBUG",
>              "UNICODE",
>              "_UNICODE"
>          ],
>          "cStandard": "c11",
>          "cppStandard": "gnu++14",
>          "intelliSenseMode": "linux-gcc-x64",
>          "compilerPath": "D:\\GW64\\mingw64\\bin\\gcc.exe"
>      }
>  ],
>  "version": 4
> }
> ```
>
> {% endfolding %}
>
> {% folding, settings.json %}
>
> ```cpp
> {
>  "files.associations": {
>  },
>  "C_Cpp.intelliSenseEngineFallback": "enabled", //需要添加的
>  "C_Cpp.intelliSenseEngine": "disabled",
>  "C_Cpp.errorSquiggles": "enabled", //  需要添加的
> }
> ```
>
> {% endfolding %}

> 我们自己添加的库 `QsLog` 文件夹中的 `CMakeLists.txt` 文件也是用于编译和构建 QsLog 静态库的，在整个项目工程的  `CMakeLists.txt` 文件中，通过添加子目录 `add_subdirectory(./QsLog)` 来调用该文件夹下的  `CMakeLists.txt` 文件
>
> 整个项目工程的 `CMakeLists.txt` 文件中还包含了其他的构建指令，比如构建可执行文件、链接其他的库等。而 `QsLog` 文件夹下的 `CMakeLists.txt` 文件则只关注 `QsLog` 静态库的编译和构建

> 打开黑窗口，只需要在主函数文件顶部写入：
>
> ```cpp
> #ifdef _DEBUG
> #pragma comment(linker,"/subsystem:console /entry:mainCRTStartup")
> #endif // _DEBUG
> ```

> 在视图模式下用 `Ctrl+方向键` 可以控制控件移动1个像素，直接按方向的话会移动10个像素



## 打包

### windeployQt

直接使用 `Release` 进行编译，出现头文件问题报错的话需要重新在项目配置里面勾选对应模块，然后看看有的地方头文件是不是用了 `<>` ,你项目自己的头文件需要用 `""` 包起来，然后编译完成会生成对应 `exe`，可以直接复制这个exe到一个新建文件夹里面，然后左下角打开黑窗口，找对应的我的是 `MSVC`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-03_08-47-51.webp)

然后进入你的exe文件夹地方，输入:

```cpp
windeployqt AC_PTZ_V1.exe
```

回车即可，最后完成后直接把那个文件夹压缩打包发给别人就可以了

> **注意点：**命令行在启动是，会有一行提示,`记得调用vcvarsall.bat来完成环境设置!`
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240203085159.webp)
>
> 意思是说，我们还没有运行vcvarsall.bat，所以VS的环境变量没有配置好，因此不会拷贝VS相关的依赖库
>
> vcvarsall.bat是VS自带的配置环境变量的批处理文件。它的位置取决你的安装位置，我的在`G:\vs2022\anzhuang\VC\Auxiliary\Build`下，接下来就尝试运行vcvarsall.bat来配置一下VS的环境,直接把 `exe` 拖过去然后最后面加上 `amd64` 即可
>
> 然后回车后成功，再进行上面步骤



### Inno Setup

[Inno Setup](https://jrsoftware.org/isdl.php)

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240203092447.webp" style="zoom:67%;" />

然后正常安装即可，安装完成后打开，选择新建脚本，然后一直下一步，该填写的地方就填写即可，最后需要选择对应exe,然后把文件还有文件夹分别加到这里，这里的是在上面windeployQt步骤完成后再进行的

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240203093403.webp)

最终加完直接编译即可

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240203094611.webp" style="zoom:50%;" />

最终会生成一个exe安装程序，安装一下完成后运行发现报错：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240203095317.webp)

我们先在刚刚安装的那个地方找到卸载程序运行，卸载先，再打开刚刚的脚本进行修改(以后进行修改直接修改脚本快一点不需要重新新建脚本啥的)，就是把文件夹的地方加到后面那

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240203100023.webp)

- 汉化（安装过程中文）

首先拿到 `ChineseSimple.isl` 中文翻译文件，然后放入 `Inno Setup` 的安装目录下的Languages目录下,最后，还需要修改脚本重新编译即可：

```diff
- [Languages]
- ;Name: "english"; MessagesFile: "compiler:Default.isl"
+ [Languages]
+ Name: "ChineseSimple"; MessagesFile: "compiler:Languages\ChineseSimple.isl"
```

如果安装出现乱码就修改 `ChineseSimple.isl` 文件里面的编码格式

- 安装一次之后，不能选择安装路径

如果程序安装一次之后，无论如何都不能选择安装路径了，则需要在[Setup]下添加如下语句

```diff
+ UsePreviousAppDir=no
```



### 设置exe图标

设置完窗口图标之后，我们可能需要设置可执行程序exe文件的图标

后缀必须是 `.ico`

[在线转换](https://convertio.co/zh/)

1. 将转换好的ico文件放到源文件所在目录，即和 `CMakeLists.txt` 文件同级目录，并创建名为`icon.rc`的文件，写入如下内容

```bash
IDI_ICON1 ICON DISCARDABLE "zay.ico"	# zay看你名称
```

2. 最后在 `CMakeLists.txt` 中添加如下命令(QT不需要加也行)

```bash
aux_source_directory(. MY_SCOURCES)
add_executable(QtTest ${MY_SCOURCES} "icon.rc")
```

3. 在 `CMakeLists.txt` 添加 `ico.rc`

```bash
set(PROJECT_SOURCES
        ico.rc
)
```

4. 重新构建运行即可

- vs方式

把 `ico` 放到资源文件qrc里面，然后在程序里添加：

```cpp
/*设置exe*/
this->setWindowTitle("AOCHAUN_V24.2.3");
this->setWindowIcon(QIcon(":/Mainwindow/Resource/AC_logo1.ico"));
```

然后右键项目添加资源，Icon导入即可

## C++知识点

### 类相关



> 在不同的命名空间中可以定义 `相同名称` 的类，通过限定命名空间可以消除命名冲突并准确地使用所需的类
>
> {% folding, 示例代码 %}
>
> ```cpp
> namespace A {
>  class Example {
>      // 类定义
>  };
> }
> 
> namespace B {
>  class Example {
>      // 类定义
>  };
> }
> 
> int main() {
>  A::Example obj1;  // 使用A命名空间中的Example类
>  B::Example obj2;  // 使用B命名空间中的Example类
> 
>  return 0;
> }
> ```
>
> {% endfolding %}

> 在类里面声明，实现这个函数，我们可以直接在类的里面写，也可以写在类的外面
>
> {% folding, main.cpp %}
>
> ```cpp
> class Animal // 定义一个名为 Animal 的类
> {
> public: // 公共成员，外部可访问
> Animal(const std::string &name, int age); // 构造函数声明，用于初始化对象
> void cry(); // 声明一个公共成员函数，用于发出动物的叫声（cry）
> 
> private: // 私有成员，外部不可访问
> std::string name; // 动物名字
> int age; // 动物年龄
> };
> 
> Animal::Animal(const std::string &name, int age) : name(name), age(age) // 构造函数定义，用于初始化对象的成员变量
> {
> }
> 
> void Animal::cry() // 发出动物的叫声（cry）
> {
> }
> ```
>
> {% endfolding %}

> - 在C++中，通常将 `类的声明` 放在头文件（.h文件）中，而将 `类的实现` 放在源文件（.cpp文件）中
> - 一般是先声明类再去实现类
> - 参考文章[第7章-继承与派生](https://blog.yang5201314.cn/post/6da3ea58)
>
> {% folding, widget.h(类声明) %}
>
> ```cpp
> #ifndef WIDGET_H
> #define WIDGET_H
> 
> #include <QWidget>  // 包含QWidget头文件，这个是控件基类
> 
> namespace Ui    // 命名空间
> {
>     class Widget;   //  类的声明 UI里面的类型
> }
> 
> // 定义了一个名为 Widget 的类，它继承自 QWidget 类
> // 通过使用 public 关键字，表示 Widget 类公开了 QWidget 类的成员和接口
> class Widget : public QWidget
> {
>     Q_OBJECT    // 这个是使用信号和槽机制必须包含的一个宏(一般都会包含在类的第一行)
> 
> public: // 标识了下面的成员函数和成员变量的访问权限为公开，即可以从类的外部访问
>     Widget(QWidget *parent = nullptr);  // 构造函数的声明，接受一个 QWidget 类型的指针参数 parent，并且设置默认值为 nullptr
>     ~Widget();  // 析构函数的声明，没有参数
> 
> private:    // 标识了下面的成员函数和成员变量的访问权限为私有，即只能在类的内部访问
>     Ui::Widget *ui; // 这是一个私有成员变量，类型为 Ui::Widget*
> };
> #endif // WIDGET_H
> ```
>
> {% endfolding %}
>
> - 派生类(子类)继承基类(父类)的话需要 `必须要调用父类构造函数，必须采用初始化参数列表的方式`
> - 在初始化列表中初始化成员变量可以避免在构造函数体内对其进行赋值操作，从而提供了一种更为直接和高效的初始化方式
> - 在类的内部，构造函数是可以访问类的私有成员的，通过初始化列表对私有成员变量进行初始化是C++语言的一种特性
> - 参考文章[第4章-特殊成员](https://blog.yang5201314.cn/post/34037d70)
>
> {% folding, widget.cpp(类实现) %}
>
> ```cpp
> Widget::Widget(QWidget *parent)	// 定义了一个名为 Widget 的类的构造函数，接受一个 QWidget 类型的指针作为参数
>     : QWidget(parent)	// 调用 QWidget 类的构造函数并将参数 parent 传递进去，用于初始化 Widget 类的父类部分
>     , ui(new Ui::Widget)	// 使用 new 关键字创建了一个名为 ui 的 Ui::Widget 类的对象，并进行了初始化
> {
>     ui->setupUi(this);	// 调用 ui 对象的 setupUi 方法，并将当前的 Widget 对象作为参数传递进去
> }
> 
> // 析构函数
> Widget::~Widget()
> {
>     delete ui;  // 释放ui对象
> }
> ```
>
> {% endfolding %}

> 允许在同一范围中声明几个功能类似的同名函数，但是这些 `同名函数的形式参数（指参数的个数、类型或者顺序）必须不同`，这就是重载函数， `不能只有函数返回值类型不同`
>
> ```cpp
> class Animal
> {
> public:
> void cry();
> void cry(int count);
> void cry(int count, int count2);
> 
> private:
> std::string name;
> int age;
> };
> ```

> 【构造函数和析构函数】
>
> 参考文章：[第3章-构造函数](https://blog.yang5201314.cn/post/c87f0dc8)

> 类的继承允许我们在新的类里面继承父类的 `public` 和 `protected` 部分，`private` 部分可以间接通过父类的公共函数访问
>
> 参考文章：[第4章-特殊成员](https://blog.yang5201314.cn/post/34037d70)
>
> {% folding, main.cpp %}
>
> ```cpp
> class Animal
> {
> public:
> Animal(const std::string &name, int age) : name(name), age(age) {}
> void cry() const { std::cout << "Animal is crying!" << std::endl; }
> void move() const { std::cout << "Animal is moving!" << std::endl; }
> 
> private:
> std::string name;
> int age;
> 
> public:
> // 公共成员函数，用于访问父类的 private 成员
> std::string get_name() const { return name; }
> int get_age() const { return age; }
> };
> 
> class Dog : public Animal
> {
> public:
> Dog(const std::string &name, int age, const std::string &breed) : Animal(name, age), breed(breed) {}
> void bark() const { std::cout << "Dog is barking!" << std::endl; }
> 
> private:
> std::string breed;
> };
> 
> int main(int argc, char *argv[])
> {
>  Dog d("Tommy", 3, "Bulldog");
>  std::cout << "Name: " << d.get_name() << std::endl; // 访问父类的私有成员变量
>  std::cout << "Age: " << d.get_age() << std::endl; // 访问父类的私有成员变量
>  system("pause");
>  return 0;
> }
> ```
>
> {% endfolding %}

> 【虚函数和纯虚函数】
>
> `虚函数`：有实际定义的，允许派生类对他进行覆盖式的替换， `virtual`修饰。虚函数的优点是可以预留接口(API)
> `纯虚函数`：没有实际定义的虚函数就是纯虚函数,子类必须自己实现，否则会报错！！！
>
> 参考文章：[第8章-虚函数和多态](https://blog.yang5201314.cn/post/77ad7c6d#override%E5%92%8Cfinal)
>
> {% folding, main.cpp %}
>
> ```cpp
> // 基类 Animal
> class Animal
> {
> public:
> virtual void makeSound()
> {
> std::cout << "动物发出了声音！" << std::endl;
> }
> 
> // 纯虚函数
> virtual void eat() = 0;
> };
> 
> // 派生类 Dog
> class Dog : public Animal
> {
> public:
> void makeSound() override	// override 强制重写，标识作用，用来检查父类是否存在当前的虚函数
> {
> std::cout << "汪汪汪！" << std::endl;
> }
> 
> void eat() override
> {
> std::cout << "狗正在啃骨头！" << std::endl;
> }
> };
> 
> // 派生类 Cat
> class Cat : public Animal
> {
> public:
> void makeSound() override
> {
> std::cout << "喵喵喵！" << std::endl;
> }
> 
> void eat() override
> {
> std::cout << "猫正在吃鱼！" << std::endl;
> }
> };
> 
> int main(int argc, char *argv[])
> {
> Animal *animalPtr;
> 
> // 创建 Dog 对象，并通过基类指针调用虚函数
> animalPtr = new Dog();
> animalPtr->makeSound(); // 输出：汪汪汪！
> animalPtr->eat();       // 输出：狗正在啃骨头！
> 
> // 创建 Cat 对象，并通过基类指针调用虚函数
> animalPtr = new Cat();
> animalPtr->makeSound(); // 输出：喵喵喵！
> animalPtr->eat();       // 输出：猫正在吃鱼！
> 
> delete animalPtr;
> 
> system("pause");
> return 0;
> }
> ```
>
> {% endfolding %}
>
> 需要注意的是，如果在类的声明中将函数声明为虚函数，但是没有在源文件中提供具体的实现，那么编译器会报错,QT里经常一些父类有这个修饰的函数，你的自定义类继承父类然后重新声明了这个虚函数但是不去.cpp实现这个虚函数的话会编译器报错

> 【lambda表达式】
>
> Lambda 表达式是一个匿名函数，即没有函数名的函数
>
> ```cpp
> // 【语法格式】
> []() {}
> 
> // ()也可省略
> // [=] 意思是表示以值捕获的方式捕获所有外部变量，表达式内部对这些变量的修改不会影响到外部的变量，一般是=或this
> // [&] 意思是表示以引用的方式捕获所有外部变量，这样就可以修改实际的值了
> ```
>
> {% folding, main.cpp %}
>
> ```cpp
> #include <iostream>
> #include "windows.h"
> #include <vector>
> #include <algorithm>
> 
> int main(int argc, char *argv[])
> {
> std::vector<int> numbers = {1, 2, 3, 4, 5};
> 
> // 使用Lambda表达式作为参数传递给std::for_each算法
> std::for_each(numbers.begin(), numbers.end(), [](int num)
>        { std::cout << num << " "; });
> 
> // 使用Lambda表达式作为函数对象
> auto square = [](int x)
> {
> return x * x;
> };
> 
> // 使用Lambda表达式作为函数对象
> auto square2 = [](int x)
> {
> return x * x + 1;
> };
> 
> int result = square2(5);
> std::cout << std::endl
>    << "Square of 5: " << result << std::endl;
> 
> system("pause");
> return 0;
> }
> ```
>
> {% endfolding %}





### 特殊成员

> 【友元函数】
>
> 参考文章：
>
> [第4章-特殊成员](https://blog.yang5201314.cn/post/34037d70#%E5%8F%8B%E5%85%83)
>
> [第5章-运算符重载](https://blog.yang5201314.cn/post/aad6642b#%E5%8F%8B%E5%85%83%E9%87%8D%E8%BD%BD%E4%B8%8E%E7%B1%BB%E6%88%90%E5%91%98%E8%BF%90%E7%AE%97%E7%AC%A6%E9%87%8D%E8%BD%BD)
>
> 有些运算符必须要使用 `友元重载`
>
> 类内声明，类外实现 `不需要friend修饰，不需要类名限定`

> 【auto】
>
> `auto` 关键字是一种类型推导机制，可以根据变量初始化表达式的类型自动推导出变量的类型。当使用 `auto` 声明变量时，编译器会根据变量的右值表达式来确定这个变量的类型
>
> 【static】
>
> 静态成员函数 不能访问 非静态成员变量 或 非静态成员函数
>
> 静态成员函数 通常用于 执行与类本身相关的操作 , 执行该函数 不涉及到 类实例对象中的信息



### 数据类型

> `reinterpret_cast`  运算符可以用于各种指针类型之间的转换
>
> ```cpp
> uchar arr[] = {0x00, 0x00, 0x80, 0x3F}; // 表示浮点数1.0的字节表示形式
> float* f = reinterpret_cast<float*>(arr);
> ```

> 有些语法需要加 `Qt::` 才能访问，比如输入输出流 `endl` 等等
>
> ```cpp
> Qt::endl;	// 这样调用
> ```

> `Type` 是枚举类型

> `qobject_cast` 这个方法是基于QObject的，也就是元对象系统，父类转子类
>
> ```cpp
> inline T qobject_cast(QObject *object)	// 函数返回 object 向下的转型 T 如果转型不成功则返回 0 ，如果传入的 object 本身就是 0 则返回 0
>  
> // T类型必须继承自 QObject 
> // 在声明时必须有 Q_OBJECT 宏    
> ```

> `T` 是一个模板参数，表示你希望将 `QObject*` 指针转换为的目标类型

> `static_cast`
>
> 1. 隐式类型转换：`static_cast` 可以进行标准的隐式类型转换，例如将整数类型转换为浮点数类型
> 2. 显式类型转换：`static_cast` 可以用于显式地将一种类型转换为另一种类型，例如将一个基类指针转换为派生类指针
> 3. 可以把枚举类进行转换打印
>
> ```cpp
> qDebug() << "枚举类型:" << static_cast<int>(m_enStatus);
> ```

> `QList<T>`：`QList` 是 Qt 提供的通用容器类，用于存储一系列的元素。在这段代码中，`QList<QPointF>` 表示一个存储 `QPointF` 类型元素的列表。`QPointF` 是 Qt 提供的表示二维浮点坐标的类
>
> 通过使用花括号 `{}`，可以在声明列表时直接初始化其元素

> `std::vector<HintMessageItem*> m_vecMessage;` 向量：该向量存储的元素类型是指向 `HintMessageItem` 类的指针
>
> - `std::vector`: 是 C++ 标准库中的动态数组容器，它可以自动调整大小以容纳其包含的元素。
> - `<HintMessageItem*>`: 规定了向量中的元素类型，即指向 `HintMessageItem` 类的指针。这意味着 `m_vecMessage` 存储的是 `HintMessageItem` 对象的指针。
> - `m_vecMessage`: 是变量的名称，这是一个用于存储 `HintMessageItem` 指针的向量。
>
> 是一个通用的动态数组容器，可以存储几乎任何类型的元素。它是一个模板类，通过模板参数指定存储的元素类型
>
> ```cpp
> // 语法
> std::vector<> xxx;
> ```



### 格式

> 想换行的话可以加一个 `R"()"` 包起来：
>
> ```cpp
> this->setStyleSheet(R"(QLabel
>     {
>         font-family: '楷体';
>         font-size: 26px;
>         color:red;
>     })");
> ```



### 其他

> ```cpp
> // 强类型枚举/枚举类
> // 引入了作用域，使得枚举成员在命名空间中是独立的，这样就可以不同的枚举类里面的成员名字是可以一样的
> // 传统的 enum 枚举成员在同一作用域中是唯一的，可能会导致命名冲突
> enum class LoginStatus
> {
>     
> }
> ```

> `构造函数` 使用 `explicit` 修饰则表示不能进行隐式类型转换，只能通过显示调用构造函数来创建对象

> `QStringLiteral` 关键字，用于创建Unicode字符串，可以将字符串转换成编译期常量，提高字符串的效率和安全性

> `std::mutex` 是 C++ 标准库中提供的互斥量，用于实现多线程间的互斥访问
>
> ```cpp
> // 用法1
> 
> std::mutex m;
> 
> // 在临界区前加锁
> std::lock_guard<std::mutex> lock(m);
> 
> // 临界区操作
> 
> // 在作用域结束时自动解锁
> ```
>
> ```cpp
> // 用法2
> 
> std::mutex m;
> 
> // 手动锁定
> m.lock();
> 
> // 临界区操作
> 
> // 手动解锁
> m.unlock();
> ```
>
> ```cpp
> // 用法3
> 
> std::unique_lock<std::mutex> lck(m_qMtx);  // 锁定互斥量
> 
> // 一些操作，包括可能抛出异常的操作
> 
> // 在这个点上，lck 的析构函数将自动解锁互斥量
> ```

> ```cpp
> // 用于展开宏，获得宏对应的数值
> #define STR(x) #x
> #define STRINGIFY(x) STR(x)
> 
> // 注册昵称最大长度
> #define SignUp_Name_MAX_LEN 8
> 
> qDebug() << STRINGIFY(SignUp_Name_MAX_LEN);	// 输出8
> ```



