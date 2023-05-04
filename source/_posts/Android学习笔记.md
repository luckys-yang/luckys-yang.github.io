---
title: Android学习笔记
cover: /img/num101.webp
comments: false
top: 95
categories:
  - Android
abbrlink: 6ba9642b
date: 2022-11-20 13:42:00
---


## 前言

{% note blue 'fas fa-fan' flat %}参考文章{% endnote %}

[朱友斌](https://zhuyb.blog.csdn.net/category_11875449_3.html)

[Android开发者官网文档](https://developer.android.google.cn/guide/topics/manifest/application-element?hl=zh-cn)

{% note blue 'fas fa-fan' flat %}例程地址{% endnote %}

[luckys-yang/Car2021_Example_v1.2: Android 3.19 (github.com)](https://github.com/luckys-yang/Car2021_Example_v1.2/tree/master)



## 环境配置

- 下载安装包之后，双击运行，傻瓜式安装即可，下一步下一步。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230318101437.webp)

- 第一次运行Android Studio会提示找不到SDK目录，先不管这个，点击【Cancel】取消即可,

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230318100857.webp)

- 然后再按【Next】设置SDK目录，这一步是将SDK安装到哪个目录下面。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230318105048.webp)

- 下一步然后点击完成

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230318105112.webp)



## 新建项目

- 点击 【New Project】 新建一个项目，选择【Empty Activity】空模板

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230318110559.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230318110626.webp)

- 填写App应用相关信息，例如：名称，包路径，项目保存路径，开发语言，Android版本，填写完成后点击【Finsh】即可，然后它就开始下载相关的SDK依赖及模板代码

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230318112021.webp)



- 进去后需要去下载Gradle，不要在AS里下会超时的，直接跳转到这个下载地址下载【如果您没有下载Gradle，那么您将无法执行Gradle任务。Gradle是一个构建自动化工具，用于构建、测试和部署软件】

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230318115853.webp)

- 下载完解压到你喜欢的目录下

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230318120211.webp)

- 然后配置Gradle路径

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230318124816.webp)

需要注意插件的版本跟Gradle的版本兼容性，[Android Gradle 插件版本说明  | Android 开发者  | Android Developers (google.cn)](https://developer.android.google.cn/studio/releases/gradle-plugin?hl=zh-cn#updating-gradle)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230318125041.webp)

- 配置完点击右上角的 `Sync Project with Gradle Files`【如果您在项目中更改了Gradle文件（例如build.gradle文件），则需要同步项目与Gradle文件，以确保Gradle构建系统了解您的更改。】，然后点击 `Make Project` 构建和编译项目

## 创建虚拟机

- 按步骤点击即可

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230318130147.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230318130213.webp)

选择 `内存小的`，因为其他的占内存大

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230318193954.webp)

点击下载，然后等待完成即可

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230318194015.webp)

{% endgallery %}

如果上面创建后运行报错 `The emulator process for AVD xxx has terminated.`可能就是环境变量没搞好

首先在C盘(也可以在其他盘中文也不要紧)创建一个文件夹--`AndroidAVD`，然后打开环境变量，在系统变量那新建一个变量名固定，变量值填你创建的那个文件夹(记得把之前填的SDK啥的变量删了)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230318194905.webp)

打开项目的SDK路径，找到 `D:\my_android\AndroidSDK\system-images` 下把里面的文件都删除，然后重新去新建一个设备(下载也要重新)，最后运行即可：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230318195410.webp)



## 创建Git

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230319125146.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230319125251.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230319125622.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230319125654.webp)

然后进入Github就看到了

{% endgallery %}



## 好用的插件

壁纸API：https://tuapi.eees.cc/api.php?category={fengjing}

|       插件名       |                            作用                             |
| :----------------: | :---------------------------------------------------------: |
|     CodeGlance     |          在右侧边栏添加一个缩略图，方便快速导航代           |
|    Sexy Editor     | [设置背景](https://www.cnblogs.com/yue31313/p/7337160.html) |
| *Rainbo*w Brackets |                          彩色括号                           |



## 常用快捷键

|       快捷键       |             作用             |
| :----------------: | :--------------------------: |
| `CTRL`+`ALT`+`←/→` | 可以在最近的编辑地方来回切换 |
|      `CTRL+B`      |          跳转到定义          |

可以自定义快捷键，比如代码字体的放大缩小：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230320082449.webp)





## 问题

- 首先看看SDK的安装目录有没有配置环境变量

|    变量名    |                        值                         |
| :----------: | :-----------------------------------------------: |
| ANDROID_HOME | D:\my_android\AndroidSDK`(这个是我的SDK安装目录)` |

然后在系统PATH添加两条

```bash
%ANDROID_SDK_HOME%\platform- tools
    
%ANDROID_SDK_HOME%\tools    
```

还有检查NDK路径是不是你的NDK路径，不是就去跟目录下的 `local.properties` 文件里改

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230319114043.webp)

```properties
ndk.dir=D\:\\my_android\\AndroidSDK\\ndk\\25.2.9519653
```

- 模拟器可以使用雷电模拟器，网络需要在设置里搞

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230319115014.webp)

AS里的模拟器太卡了，雷电好用，直接先启动雷电模拟器(不启动AS是检测不到设备)，然后在AS里选择设备，按三角形进入，改了代码后按旁边的 `run app` 即可

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230319120718.webp)

需要把手机断开连接否则可能占用了5555导致雷电模拟器不能被AS检测到，断开后在AS里编译即可看到5554设备

- 需要注意的是，修改 SDK 版本后可能会影响应用的兼容性和可用性。如果你将`build.gradle` 里的 `minSdkVersion` 或 `targetSdkVersion` 修改为较高的版本，可能会导致应用无法在低版本的 Android 系统上运行或无法使用一些新特性和 API


## Android学习

### Android目录结构及相关文件介绍



{% note blue 'fas fa-fan' flat %}工程目录结构{% endnote %}

在Android Studio里面，采用【Android】视图，查看到的项目目录结构就是下面的样子：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230320083546.webp)



如果采用【Project】视图，则查看的是下面这个样子的：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230320083602.webp)

{% note simple %}

Android Studio将工程分为两类: `项目(Project)` 和 `模块(Module) `
在一个项目【Project】里面，可以包含多个模块【Module】， `每个模块都是可以单独运行的`。

{% endnote %}



{% note blue 'fas fa-fan' flat %}各目录详解{% endnote %}

- manifests目录

manifests目录下面，只有一个【AndroidManifest.xml】文件，这个文件是Android应用的启动配置文件，用于设定Android应用启动时候的一些参数信息，例如: `启动图标、应用名称、主题、页面布局等等`。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230320084219.webp)

{% note simple %}

每一个Android应用下面，都必须要有一个【AndroidManifest.xml】文件

- `android:allowBackup`：是否允许应用备份，允许用户备份系统应用和第三方应用的apk安装包和应用数据。
- `android:dataExtractionRules`：应用可以将此属性设置为XML资源，在其中指定规则，以确定在备份或转移操作过程中您以从设备复制哪些文件和目录。
- `android:fullBackupContent`：指定应用备份规则。
- `android:icon`：APP应用在手机上面显示的图标。
- `android:label`:：APP应用再手机上面显示的应用名称。
- `android:supportsRtl`：是否支持从右往左的文字排列顺序。
- `android:theme`： APP的显示风格，主题。

{% endnote %}


- java目录

java目录下面，有三个包目录，分别如下所示:

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230320084815.webp)

这三个包目录下，就是我们需要编写的java源代码，其中两个是用于【单元测试】的包目录，从上面图可以看到，包名称后面添加了括号标识 `（androidTest、test)`。

- java(generated) 目录

一般是因为使用了某些技术或框架（如 Dagger、Butter Knife、Databinding 等）导致的。其中，后面带有 `(generated)` 标记的 `java` 目录是由这些技术或框架自动生成的代码所在的目录

 `这些自动生成的代码不应该被手动修改或删除，否则可能会导致程序无法正常运行`。如果想要修改这些代码，可以通过修改相关注解或配置文件来影响代码的生成。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230320085011.webp)

- res下的drawable目录

主要用于存放一些矢量图，或者我们自己添加的图片文件。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230320085817.webp)

{% note simple %}

注意:上面图片中，【drawable】目录下面有两个xml文件，其中一个后面标记了 `(v24)`，这个【v24】是Android 7.0版本以上的， `主要是为了让矢量图兼容Android 7.0版本以上的应用程序`。

{% endnote %}

{% note simple %}

Android相关的版本信息

| Android 版本 | 对应SDK API | 发布时间 |
| :----------: | :---------: | :------: |
|      13      |     33      |   22.2   |
|      12      |     31      |  21.10   |
|      11      |     30      |   20.9   |
|      10      |     29      |   19.8   |
|      9       |     28      |   18.8   |
|      8       |    26/27    |   17.8   |
|      7       |    24/25    |   16.8   |
|      6       |     23      |   15.9   |
|      5       |    21/22    |   14.6   |

{% endnote %}

- res下的layout目录

主要是存放应用的布局样式文件，文件是以xm格式保存的，一个Android应用可以有多个样式布局文件。这个目录下面，有一个默认给我们生成的【activity_main.xml】布局文件。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230320090640.webp)

- res下的mipmap目录

主要用于存放一些App应用的启动图标，里面有默认的启动图标文件，如下所示：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230320090911.webp)

- res下的values目录

主要用于存放一些常星文件，例如:字符串常量、颜色相关常量、样式主题常星等等。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230320091121.webp)

- res下的xml目录

主要用于定义一些规则文件

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230320091309.webp)

- Gradle Scripts目录

主要保存Android应用的一些构建配置文件，是Gradle的构建配置文件，Gradle和maven类似，都是用于项目的构建、管理等功能。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230320091513.webp)

|      文件名称      |                             用途                             |
| :----------------: | :----------------------------------------------------------: |
|    build.gradle    | 这个文件有两个，一个项目层面的配置文件，另一个是针对某个模块层面的配置文件。主要作用就是设置App的构建编译规则。 |
| proguard-rules.pro |        用于描述java源代码的混淆规则(类似于加密之类的)        |
| gradle.properties  | 用于配置编译工程的命令行参数，一般都不用改动，使用默认的就可以了 |
|  settings.gradle   | 这个文件主要用于设置哪些模块需要构建编译。例如:【include "app"】表示要编译app模块 |
|  local properties  | 项目的本地配置文件，这个文件是在工程编译之后自动生成的，用于描述本地开发电脑的环境配置信息，包括:SDK相关的路径等等 |

- build.gradle内容详解

```cpp
//声明该项目是一个 Android 应用程序，并使用 com.android.application 插件。
//提供了许多构建和打包 Android 应用程序所需的任务和功能（所以这个插件必须有不能删除否则构建报错）
plugins {
    id 'com.android.application'
}
//定义 Android 应用程序的构建设置
android {  
    namespace 'com.example.demo1'	//应用程序的命名空间       
    compileSdk 33	//指定应用程序编译时使用的 Android SDK 版本 
//配置 Android 应用程序的默认设置
    defaultConfig {
        applicationId "com.example.demo1"	//应用程序的包名
        minSdk 23	//定义应用程序的最低兼容
        targetSdk 33	//目标 Android 版本
        versionCode 1	//定义应用程序的版本号
        versionName "1.0"	//定义应用程序的版本名称

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"	//指定 AndroidJUnitRunner 作为测试运行器
    }
//配置应用程序的构建类型
    buildTypes {
//release应用程序的发布版本        
        release {
            minifyEnabled false	//表示是否启用代码混淆和压缩
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'	//指定代码混淆所需的规则文件
        }
    }
//指定 Java 编译选项
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8	// Java 源代码兼容版本 JavaVersion.VERSION_1_8 表示 Java 8 版本。其中，"1" 表示主版本号，"8" 表示次版本号
        targetCompatibility JavaVersion.VERSION_1_8	//目标代码的兼容版本
    }
}

//配置该项目的依赖库
dependencies {
//这是一个 AndroidX 库，提供了与旧版 Android 兼容的应用程序界面和行为的实现。该库包含了许多常用的 UI 控件和组件，如 Button、TextView 等。
    implementation 'androidx.appcompat:appcompat:1.4.1'
//这是一个 Google Material Design 库，提供了丰富的 UI 控件和组件，如 FloatingActionButton、Toolbar 等。该库基于 AndroidX 库构建，可以与其它 AndroidX 库一起使用        
    implementation 'com.google.android.material:material:1.5.0'
//这是一个 AndroidX 库，提供了灵活的布局管理功能，可帮助你更轻松地创建自适应和响应式的 UI 布局。它支持约束布局和链式布局等多种布局方式。        
    implementation 'androidx.constraintlayout:constraintlayout:2.1.3'
//这是一个单元测试框架，用于编写和运行 JUnit 测试用例。        
    testImplementation 'junit:junit:4.13.2'
//这是一个 AndroidX 测试库，提供了在 Android 平台上运行 JUnit 测试的扩展功能。        
    androidTestImplementation 'androidx.test.ext:junit:1.1.3'
//这是一个 AndroidX 测试库，提供了执行 UI 测试的 API 和工具。它支持在 Android 设备和模拟器上运行测试用例，并提供了许多实用的测试功能，如界面交互、匹配器等。        
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.4.0'
}
```



### 基本UI控件

Android里面提供了很多的UI控件，并且Android中的所有控件可以有两种创建方式：

1. 第一种方式：在【activity.xml】(布局文件)的XMIL配置文件里面使用标签创建。
2. 第二种方式：在java代码中通过控件对象来创建。



#### TextView

TextView控件：用于显示文本内容的，Android里面通过XML设置属性时候，所有的属性几乎都是使用【 `android:`】开头

{% note simple %}

| 控件属性        | 描述                                                         |
| :-------------- | :----------------------------------------------------------- |
| `layout_width`  | 设置控件宽度，三个可选值(fill_parent，match_parent,wrap_content),也可以直接使用数字，采用【dp】单位 |
| `layout_height` | 设置控件高度，三个可选值(fill_parent，match_parent,wrap_content),也可以直接使用数字，采用【dp】单位 |
| `id`            | 控件的唯—标识                                                |
| `text`          | 控件显示的内容                                               |
| `textColor`     | 控件字体颜色                                                 |
| `textStyle`     | 控件宁体的风格，三个可选值(normal正常，bold加粗，italic斜体)。textSize:控件字体大写。一般采用【sp】作为单位 |
| `background`    | 控件的背景颜色，也可以是图片                                 |
| `gravity`       | 控件中内容对齐方式。这个有很多的可选值，上下左右水平垂直等等方向，查询需要的属性即可。 |
| `shadowColor`   | 设置阴影颜色                                                 |
| `shadowRadius`  | 设置阴影的模糊程度，设为0.1就变成了字体颜色，建议使用3.0     |
| `shadowDx`      | 设置阴影在水平方向的偏移                                     |
| `shadowDy`      | 设置阴影在竖直方向的偏移                                     |

{% endnote %}

{% note blue 'fas fa-fan' flat %}案例1---设置基础属性{% endnote %}



在 `layout` 目录下，新创建一个 `activity(活动)` 配置文件，可以使用Android Studio提供的快捷创建方式。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230320131813.webp)

此时会弹出窗口，让我们填写activity的文件名称

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230320132305.webp)

填写完成之后，点击【Finish】，此时我们项目里面就会创建【activity_textview.xml】布局文件，并且还会自动创建一个【textview】类。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230320141240.webp)

创建完成之后，我们就可以在【activity_textview.xml】布局文件里面，添加一个【TextView】控件，设置【TextView】控件的相关属性，也可以在【textview.java】类里面通过java代码设置相关的属性。

{% note simple %}

创建XML文件后会同时新建一个Java类的原因是为了方便在Java代码中使用XML文件。这个Java类是根据XML文件的结构自动生成的，包含了XML文件中的所有元素和属性，可以通过Java代码来访问和操作XML文件。

`如果你不需要在Java代码中使用这个XML文件，那么新建的Java类可以删除。但是需要注意的是，删除Java类并不会影响XML文件本身，XML文件仍然存在并可以被其他程序使用。`

{% endnote %}

创建完成之后，我们就可以在【activity_textview.xml】布局文件里面，添加一个【TextView】控件，设置【TextView】控件的相关属性，也可以在【textview.java】类里面通过java代码设置相关的属性。

{% note simple %}

控件代码需要写在 `<androidx.constraintlayout.widget.ConstraintLayout>` 标签和 `</androidx.constraintlayout.widget.ConstraintLayout>`标签中间，作为子元素，不能写在外面否则编译报错

{% endnote %}

```xml
<?xml version="1.0" encoding="utf-8"?>
<!--  第1行指定了根布局元素，使用了AndroidX库中的ConstraintLayout布局  -->
<!-- 第2行定义了Android命名空间，用于引用Android系统的属性 -->
<!-- 第3行定义了自定义命名空间，用于引用应用程序内部的属性 -->
<!-- 第4行定义了工具命名空间，用于指定布局文件在设计时的可见性 -->
<!-- 第5行定义了布局的宽度为match_parent，即与父布局的宽度相等 -->
<!-- 第6行定义了布局的高度为match_parent，即与父布局的高度相等 -->
<!-- 第7行指定了布局文件所属的Activity或Fragment的类名，用于在设计时提供上下文信息。在这个例子中，上下文是textview类 -->
<androidx.constraintlayout.widget.ConstraintLayout  xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".textview">
    
    <TextView
        android:id="@+id/tv01"
        android:text="这是TextView的文本内容"
        android:textSize="100sp"
        android:textColor="#FF0000"
        android:background="@color/black"
        android:textStyle="bold"
        android:gravity="center"
        android:layout_width="match_parent"
        android:layout_height="match_parent" 
        />

</androidx.constraintlayout.widget.ConstraintLayout>
```

{% note simple %}

创建了【TextView】控件之后，我们还不能访问，因为一个App应用启动时候，默认是访问【 `activity_main.xml` 】的布局页面，我们没有设置页面跳转之类的话，是不能访问到我们自己写的【 `activity_textview.xml` 】布局页面的。
我们可以设置启动时候，直接访问我们写的【activity_textview.xml】布局页面即可，后面学到到页面跳转之类的，也可以通过页面跳转来访问。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230320154206.webp)

{% endnote %}

启动之后，就可以看到TextView设置的属性效果了。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230320154719.webp)

{% note blue 'fas fa-fan' flat %}案例2---设置带有阴影的TextView{% endnote %}

```xml
    <TextView
        android:id="@+id/tv02"
        android:text="设置阴影"
        android:textSize="40sp"
        android:textColor="@color/black"
        android:shadowColor="#FF0000"
        android:textStyle="bold"
        android:shadowRadius="3.0"
        android:shadowDx="30"
        android:shadowDy="20"
        android:layout_width="match_parent"
        android:layout_height="match_parent" 
        />
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230320160116.webp)

{% note blue 'fas fa-fan' flat %}案例3---跑马灯效果一行文字移动{% endnote %}

{% note simple %}

`singleLine`: 内容单行显示

`focusable`: 是否可以获取焦点

`fosusableln TouchMode`: 触摸的时候是否可以获取焦点

`ellipsize`: 省略文本(是否显示【..】的格式)，要实现跑马灯效果就设置为【marquee】

`marqueeRepeatLimit`: 字幕动画重复的次数

`clickable`: 是否可点击

`android:speed`属性是在API level 26才被引入的，如果你的项目的`minSdkVersion`小于26，则无法使用该属性

{% endnote %}

```xml
    <TextView
        android:id="@+id/tv03"
        android:text="采用TextView控件实现跑马灯效果"
        android:textSize="40sp"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:ellipsize="marquee"
        android:focusable="true"
        android:marqueeRepeatLimit="marquee_forever"
        android:singleLine="true"
        android:clickable="true"
        android:focusableInTouchMode="true"
        android:scrollHorizontally="true"
        />
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230321091727.webp)



#### Button

Button是按钮控件，它是一个继承自TextView控件的子控件。

{% note blue 'fas fa-fan' flat %}案例1---基础属性{% endnote %}

在`layout` 文件夹新建一个 xml文件为 `activity_button` 

```xml
    <Button
        android:id="@+id/btn01"
        android:text="这是按钮"
        android:layout_width="200dp"
        android:layout_height="100dp"
        />
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230321140329.webp)

{% note simple %}

但是这样会报错：`btn01 <Button>: Missing Constraints in ConstraintLayout`，因为某些控件没有设置完整的约束条件导致的。

在 `ConstraintLayout` 中，每个控件都需要设置水平和垂直方向上的约束条件，即需要加上下面两条

```xml
app:layout_constraintEnd_toEndOf="parent"
app:layout_constraintTop_toTopOf="parent"
```

{% endnote %}



{% note blue 'fas fa-fan' flat %}案例2---点击切换背景{% endnote %}

这里我们实现一个功能，就是点击按钮的时候，按钮背景会自动切换。通过【android background】属性设置背景，但是这种不能直接设置颜色，要设置drawable类型，才能够生效。

- 我们在【drawable】目录下面，创建一个【btn_selector.xml】文件。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230321142447.webp)

- 创建之后，我们在里面添加【<item>】标签，然后设置需要显示的一些背景图，添加一些背景图。

{% gallery %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230321142726.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230321143152.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230321143219.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230321143308.webp)

然后按照上面操作再添加一个图标用于下面程序测试

{% endgallery %}

- 然后在【btn_selector.xml】文件里面，设置我们的选择的图标，图标可以选择很多个。

```xml
<!--  当点击时显示这个drawable  -->
    <item android:drawable="@drawable/baseline_alarm_on_24" android:state_pressed="true" />
<!--  默认显示的图标  -->
    <item android:drawable="@drawable/baseline_bug_report_24" />
```

`drawable`的一些属性：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230321150544.webp)


- 在 `activity_button.xml` 里设置按钮的背景为drawable的XML文件。

```xml
    <Button
        android:id="@+id/btn02"
        android:layout_width="200dp"
        android:layout_height="100dp"
        android:text="这是按钮2"
        android:background="@drawable/btn_selector"
        tools:visibility="visible" />
```

- 启动访问页面，然后鼠标点击不释放，此时显示的就是另外一个图标，释放后，就显示之前的图标。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230321145555.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230321145630.webp)

{% note blue 'fas fa-fan' flat %}案例3---按钮事件{% endnote %}

Button控件有三个事件: `点击事件`， `长按事件` ， `触摸事件`。事件需要通过 `事件监听器`来获取，三个监听器分别如下所示:

{% note simple %}

`setOnClickListener`: 点击事件监听器。重写【onClick】方法。

`setOnLongClickListener`: 长按事件监听器。重写【onLongClick】方法。

`setOnTouchListener`: 触摸事件监听器。重写【onTouch】方法。

{% endnote %}

在 `MainActivity` 类文件里进行编写代码

```java

```





#### Notification

【Notification (通知)】是一个通知控件，就是我们平时手机上面可以接收到的那些推送消息提示，比如:微博推送通知，微信消息通知等等，Android中提供了Notification控件来实现通知的功能。

由于Notfication通知可以有很多，为了方便管理，Android通过【NotficationManager(通知管理器)】来统一管理Notfication通知。【NotficationManager (通知管理器)】是一个基于单例模式对象，它是由系统维护的一个服务， `一个应用程序只会有一个通知管理器对象`。

{% note blue 'fas fa-fan' flat %}使用【Notification】通知之前，我们需要获取【NotificationManager】通知管理器对象，如何获取呢?{% endnote %}

1. 获取【NotificationManager】通知管理器对象

Android里面给我们提供了【getSystemService(Sitring arg)】方法，可以用于获取某个系统服务，并且每个【Activity】类都继承了这个方法，所以直接调用即可。

{% note simple %}

【getSystemService(String arg)】方法，根据不同的参数，就可以获取不同的系统服务对象，例如: 要获取NitificationManager对象，那么就可以传递一个:【 `getSystemService(NOTIFICATION_MANAGER)` 】

{% endnote %}

通过【NotificationManager】通知管理器对象中，提供的两个方法就可以实现通知的发送和取消功能，方法如下所示:

{% note simple %}

 `notify()方法` : 发送通知。两个参数：第一个是 `id` (这个id唯一即可)，第二个是 `Notification通知对象`

`cancel()方法` : 取消通知。一个参数： `id`，这个id和发送通知时候设置的id必须—致

{% endnote %}

【NotificationManager】通知管理器对象中，提供了【createNotificationChannel】方法，用于设置通知渠道

{% note simple%}

 `createNotificationChannel()方法`: 设置通知渠道

{% endnote %}

2. 创建【Notification】通知对象

当我们获取到【NotificationManager(通知管理器)】对象之后，我们就可以利用通知管理器对象的【 `Builder()`】构造器来创建一个【Notification】通知对象。通过这种【Builder()】构造器的方式，可以保证在所有Android版本的手机上都能够生效。 `但是在Android 8.0版本开始，引入了通知渠道的概念，也就是【NotificationChannel】通知渠道，我们在使用通知的时候，还需要设置对应的通知渠道，这样才能够正常的使用通知功能`。

| Notification通知相关方法                                     |
| :----------------------------------------------------------- |
| `setContentTitle`:设置通知的标题。(必须设置)                 |
| `setContentText`:设置通知的具体内容。(必须设置)              |
| `setSmallIcon`:设置通知显示的小图标，图标必须是没有颜色的(int类型的参数) |
| `setColor`:设置小图标的颜色                                  |
| `setLargelcon`:设置通知显示的大图标(bitmap类型的参数)        |
| `setContentIntent`:设置点击通知后的跳转位置                  |
| `setAutoCancel`:设置点击通知后是否自动清除通知               |
| `setWhen`:设置通知被创建的时间                               |

3. 通知渠道【NotificationChannel】对象

{% note blue 'fas fa-fan' flat %}Android 8.0版本引入通知渠道【NotificationChannel】这个概念，它允许我们为每个通知设置自定义的通知渠道。那具体什么是通知渠道呢?{% endnote %}

我们通过【NotficationChannel】类的构造方法就可以创建一个【NotficationChannel】对象，构造方法有三个参数:

- id：通知渠道的唯一标识
- name：通知渠道名称
- importance：通知的重要程度，有5个重要程度，如下：

{% note simple %}

| 通知的5个重要程度  |                          描述                          |
| :----------------: | :----------------------------------------------------: |
|  IMPORTANCE_NONO   |                        关闭通知                        |
|   IMPORTANCE_MIN   | 开启通知，不会弹出提示，不会有提示音，状态栏不会显示。 |
|   IMPORTANCE_LOW   |   开启通知，不会弹出，不会有提示音，只在状态栏显示。   |
| IMPORTANCE_DEFAULT |     开启通知，不会弹出，会有提示音，状态栏会显示。     |
|  IMPORTANCE_HIGH   |      开启通知，会弹出，会有提示音，状态栏会显示。      |

{% endnote %}

{% note success simple %}案例代码{% endnote %}







## java安卓基础

{% note simple %}
AS代码里 `x usages` 这个信息是指该类或方法在当前项目中被使用的次数。旁边显示的用户名通常是该类或方法的最后一次修改者的用户名
{% endnote %}

{% note simple %}

静态对象可以被类的所有实例共享，而非静态对象只能被创建它的实例所共享。 在实际使用中， `静态对象主要用于存储和共享类级别的数据，例如常量、工具类、单例模式等`； `非静态对象主要用于存储和处理实例级别的数据，例如类的属性、状态等`。

{% endnote %}

{% note simple %}

`@Override`是一个注解，表示该方法是覆盖了父类或者实现了接口中的方法。在Java中，当我们使用`@Override`注解来修饰一个方法时，编译器会检查该方法是否是重写了父类或接口中的方法，如果不是，则会编译错误。这个注解能够帮助我们在编译时发现一些错误，提高代码的可读性和可维护性。 在这个代码中，`@Override`注解表示`run()`方法是重写了`Runnable`接口中的`run()`方法

`@SuppressLint` 也是注解，来禁止 Lint 发出警告。

{% endnote %}

{% note simple %}

在 Java 中，可以通过两种方式创建类：一种是声明一个新的类，另一种是使用匿名内部类。匿名内部类是指没有名字的内部类

{% endnote %}

{% note simple %}

在 Android 中，线程是通过时间片轮询的方式来执行的。每个线程都被分配一个时间片，线程在自己的时间片内执行任务，当时间片用完后，操作系统会把该线程挂起，切换到另一个线程继续执行。这样，多个线程通过时间片轮流执行，就实现了同时运行的效果。 `如果在主线程中执行耗时操作，如网络请求、文件读写等，会导致主线程阻塞，用户界面无响应，甚至出现 ANR（Application Not Responding）错误。因此，应该将耗时操作放到子线程中执行，避免阻塞主线程，保证用户界面的流畅性和响应性`。

每个应用程序只有一个主线程，主线程负责处理用户交互事件、更新 UI 界面等任务，但是可以创建多个子线程来执行耗时操作， `子线程不能直接更新 UI 界面，必须通过 Handler 或其他方式将结果传递给主线程，由主线程来更新界面。`

{% endnote %}

{% note simple %}

一般来说，方法名的命名应该能够描述该方法的功能，并且最好能够体现该方法所在的线程。比如， `如果一个方法是在主线程中执行的，可以在方法名中加上 "main" 或 "UI" 等关键字`，以便于区分。而 `如果一个方法是在子线程中执行的，可以在方法名中加上 "thread" 或 "async" 等关键字`。这样做可以让代码更加清晰、易懂。

{% endnote %}

{% note simple %}

在 Java 和 Android 中，启动一个新的线程或者创建一个线程对象之后都需要调用 `start()` 方法，这是创建和启动线程的标准方式。

{% endnote %}

{% note simple %}

Java 中没有全局变量的概念，因此不能定义一个可以归整个项目管的全局变量。但是，可以通过一些技术手段来实现类似于全局变量的效果，例如使用单例模式、静态方法等。

由于 定义在代码顶部的变量a 没有被 static 修饰，因此每个实例都会有自己的 a 变量，它们是相互独立的，互不影响

 `在 C 语言中`，全局变量是在程序的数据区中分配空间的，所有函数都可以访问同一块内存，因此修改全局变量的值会影响其他函数中该变量的值。 `而在 Java 中`，每个对象都有自己的内存空间，变量的值是存储在对象内存中的，因此每个对象的变量值是相互独立的，互不影响。

{% endnote %}

{% note simple %}

线程池是一种管理和复用线程的机制，它可以在创建线程时避免频繁地创建和销毁线程，从而提高程序的性能和响应速度。线程池可以用于管理多个后台任务，例如网络 IO、数据库访问等任务，以及大量的小任务，例如 UI 事件、定时任务等。

java 中提供了 `java.util.concurrent` 包来支持线程池的实现，其中常用的线程池包括 `ThreadPoolExecutor` 和 `ScheduledThreadPoolExecutor`

{% endnote %}