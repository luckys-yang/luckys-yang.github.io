---
title: Java学习笔记
cover: /img/num120.webp
categories:
  - Java
comments: false
katex: true
abbrlink: 7b8ad929
date: 2023-03-07 12:28:05
---



## 前言

{% note blue 'fas fa-fan' flat %}参考文章/博主{% endnote %}

https://www.cwwwxl.top/posts/ea538f2a.html

https://chengzi516.github.io/chengzi-java-get-start-with-java.html



## 安装IDEA

当然也可以选择另一个集成开发环境 `eclipse`，这个占内存小而且没有多余的页面

| 我的安装版本 |
| :----------: |
|   2021.2.3   |



- 直接下载打开(软件在阿里云盘)，安装路径改成D盘，然后勾选这些一直NEXT即可

![ ](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230307124020.webp)

- 弹出这个表示是否要导入本地设置，选择下面那个不导入即可

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230307124334.webp)

- 来到这个页面表示要激活，我们直接关闭

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230307124441.webp)

- 双击脚本开始PJ，PJ完打开可以看到OK了

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230307124653.webp)





## IDEA基本配置

- 汉化

直接 `File` -- `setting` -- `Plugins` 搜索插件 `Chinese`就出来了，图标是一个 `汉` 字那个【安装完重启即可】

- 项目结构/设置

在工程里点击右边那个设置按钮即可看到，一般在这里我们做配置Project全局SDK依赖，新建模块，导入模块等动作

- Ctrl+滑轮改变字体大小

在 `设置` --- `编辑器` --- `常规` 那勾选即可

- 自动导包

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230307133902.webp)

- 文件编码

在设置里一般是UTF-8

- 新建一个java项目

{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230307140437.webp)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230307141708.webp)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230307142037.webp)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230307142052.webp)
{% endgallery %}



## git推送配置

首先在你的项目文件夹下打开 `git bash`，进行下面的命令：

```bash
git init

git remote add origin git@github.com:luckys-yang/javaproject.git

git pull git@github.com:luckys-yang/javaproject.git

git add .

git commit -m '测试'

git push origin master
```

就推送成功了

然后在IDEA里登陆然后选择git.exe

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230307154807.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230307154757.webp)



点击 `git` --- `管理远程`，添加ssh链接即可

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230307154507.webp)

- 平时只需按顺序左到右点即可提交

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230307154623.webp)



## 第一个Java程序

- 右键 `src` 文件夹新建一个 `java 类`，名称是类名

```java
public class helloworld {
    public static void main(String[] args) {
        System.out.println("hello world");
    }
}
```

一个源文件里只能有一个 `public` 修饰的类， `且源文件名字必须和 public 修饰的类的名字相同`。

{% note simple %}

源文件中的类用来表示程序中的一个组件。public class helloworld 就是一个类，其内容必须包裹在括号内部。

{% endnote %}

那么，也可以创建 `不用public修饰的类`，比如

```java
//创建一个没有public修饰的类
class helloChina {
    //内容
}
```

在类中，也可以带有 `一个或多个` 的方法。
java 中的方法，和 c 中的函数具有相似的概念。方法： `也就是在括号内编写执行语句`



{% note blue 'fas fa-fan' flat %}分析{% endnote %}

```cpp
// Java程序的入口点，相当于C语言中的 `main` 函数入口
//当Java程序运行时，JVM会从这个方法开始，该方法会被执行。这个方法的意义在于初始化程序，并为程序的其它部分提供一个入口点。其中各个部分会被组织成类，并在这个方法中被调用。在这个方法中，可以调用程序中的其它类和方法，实现整个程序的逻辑。而args则是用来接收命令行参数的字符串数组，可以在程序运行时通过命令行传入参数。
public static void main(String[] args) {
        System.out.println("hello world");
```

`public static`：现在可以理解为书写方法的必要格式。

`void`：方法的返回类型

`main `：函数名，main 方法也是 java 程序的入口函数

`String [] args`：形式参数

`System.out.println (“hello world”); `：则等同于 c 中的 printf (“hello world\n”)；注意，System.out.println 具备 `自动换行`的功能。



## 注释，标识符与关键字

{% note blue 'fas fa-fan' flat %}注释{% endnote %}

注释跟C语言一样，在IDEA中可以快捷键 `CTRL+/`



{% note blue 'fas fa-fan' flat %}标识符{% endnote %}

java 中标识符的命名也和 c 类似

`标识符`：在程序中由书写者为类名，方法名，变量取的易于甄别的名字。

命名规则如下：

- 所有的标识符都应该以字母（A-Z 或者 a-z）,美元符（$）、或者下划线（_）开始
- 不能以数字开头，也不可是关键字， `且严格区分大小写`。
- **类名**：对于所有的类来说，类名的首字母应该大写。如果类名由若干单词组成，那么每个单词的首字母应该大写，例如 **MyFirstJavaClass** 
- **方法名**：所有的方法名都应该以小写字母开头。如果方法名含有若干单词，则后面的每个单词首字母大写
- **源文件名**：源文件名必须和类名相同。当保存文件的时候，你应该使用类名作为文件名保存（切记 Java 是大小写敏感的），文件名的后缀为 **.java**。（如果文件名和类名不相同则会导致编译错误）



{% note blue 'fas fa-fan' flat %}常见关键字{% endnote %}

|   关键字   |                             含义                             |
| :--------: | :----------------------------------------------------------: |
|  abstract  |                表明类或者成员方法具有抽象属性                |
|   assert   |                    断言，用来进行程序调试                    |
|  boolean   |            基本数据类型之一，声明布尔类型的关键字            |
|   break    |                        提前跳出一个块                        |
|    byte    |                  基本数据类型之一，字节类型                  |
|    case    |           用在 switch 语句之中，表示其中的一个分支           |
|   catch    |                 用在异常处理中，用来捕捉异常                 |
|    char    |                  基本数据类型之一，字符类型                  |
|   class    |                          声明一个类                          |
|   const    |                   保留关键字，没有具体含义                   |
|  continue  |                      回到一个块的开始处                      |
|  default   | 默认，例如，用在 switch 语句中，表明一个默认的分支。Java8 中也作用于声明接口函数的默认实现 |
|     do     |                   用在 do-while 循环结构中                   |
|   double   |              基本数据类型之一，双精度浮点数类型              |
|    else    |           用在条件语句中，表明当条件不成立时的分支           |
|    enum    |                             枚举                             |
|  extends   | 表明一个类型是另一个类型的子类型。对于类，可以是另一个类或者抽象类；对于接口，可以是另一个接口 |
|   final    | 用来说明最终属性，表明一个类不能派生出子类，或者成员方法不能被覆盖，或者成员域的值不能被改变，用来定义常量 |
|  finally   |   用于处理异常情况，用来声明一个基本肯定会被执行到的语句块   |
|   float    |              基本数据类型之一，单精度浮点数类型              |
|    for     |                     一种循环结构的引导词                     |
|   go to    |                   保留关键字，没有具体含义                   |
|     if     |                       条件语句的引导词                       |
| implements |                  表明一个类实现了给定的接口                  |
|   import   |                    表明要访问指定的类或包                    |



## 数据类型

### 基本数据类型

- 8种

|          类型          |                             描述                             | 默认值  |
| :--------------------: | :----------------------------------------------------------: | :-----: |
|     `byte(字节型)`     | `1字节，有符号，MIN:-127，MAX:127`，主要用于大型数组中节约空间。主要代替整数 |    0    |
|    `short(短整型)`     |            `2字节，有符号，MIN:-32768，MAX:32767`            |    0    |
|      `int(整型)`       | `4字节，有符号，MIN:-2147483648,MAX:2147483647`，一般整型变量默认为 int类型 |    0    |
|     `long(长整型)`     | `8字节，有符号，MIN:-9223372036854775808,MAX:9223372036854775807,缩写:L(可小写但是小写看起来会跟1混淆)`<br>这种类型主要使用在需要比较大整数的系统上 |   0L    |
| `float(单精度浮点型)`  |                   `单精度，4字节，缩写:f`                    |  0.0f   |
| `double(双精度浮点型)` |    `双精度,8字节，缩写：D`，浮点数的默认类型为double类型     |  0.0d   |
|   `boolean(布尔型)`    |                    `1位，只有true和false`                    |  false  |
|     `char(字符型)`     |      `2字节，MIN:0,MAX:65535`，char类型可以存储任何字符      | 'u0000' |

{% note red 'fas fa-fan' flat %}注意{% endnote %}

1. byte 是 java 中较 c 特有的一种类型，其只有 `1字节`大小，用以替代 int 类型来`节省空间`
2. 字符型 char 和 c 语言的 char 大小有所不同，c 语言里占 `1字节`，java 里占 `2字节`
3. Java 的数据类型里，不论系统是多少位，int 型始终占用 `4字节`，long 都占用 `8字节`
4. java `没有无符号的整型和浮点型`
5. `整型`默认为 int型， `浮点型`默认为 double型
6. java不能隐式执行 `向下转型`，因为会使精度降低，但是可以向上转型

```java
//1.1字面量属于double类型，不能直接将1.1直接赋值给 float 变量，因为这是向下转型
float f = 1.1;//报错
//1.1f 字面量才是 float 类型
float f = 1.1f;

//向下转型需要强制类型转换
double a = 3.3;
float b = (float)3.3;
```



***



### 引用数据类型

引用数据类型： `类，接口，数组`都是引用数据类型，又叫包装类

包装类的作用：

* 包装类作为类首先拥有了 `Object` 类的方法
* 包装类作为引用类型的变量可以 `存储 null 值`

```java
基本数据类型                包装类（引用数据类型）
byte                      Byte
short                     Short
int                       Integer
long                      Long

float                     Float
double                    Double
char                      Character
boolean                   Boolean
```

Java 为包装类做了一些特殊功能，具体来看特殊功能主要有：

* 可以把基本数据类型的值转换成字符串类型的值
  1. 调用 `toString()` 方法
  2. 调用 `Integer.toString`(基本数据类型的值) 得到字符串
  3. 直接把 `基本数据类型 + 空字符串`就得到了字符串（推荐使用）

- 把字符串类型的数值转换成对应的基本数据类型的值（**重要**）,将一个字符串表示的整数（如"123"）转换成一个对应的`Integer`对象。换句话说，它将一个字符串类型的数字转换成一个整型对象。


1. Xxx.parseXxx("字符串类型的数值") → `Integer.parseInt(numStr)`
2. Xxx.valueOf("字符串类型的数值")   → `Integer.valueOf(numStr)` （推荐使用）

```java
public class helloworld {
    public static void main(String[] args) {
//         1.把基本数据类型的值转成字符串(3种方法)
        Integer it = 100;
//        a.调用 toString() 方法得到字符串
        String it_str = it.toString();
        // 字符串拼接 1会根据前面自动转换为"1"
        System.out.println(it_str+1);   // 输出"1001"

//        b.调用Integer.toString(基本数据类型的值)得到字符串
        String it_str1 = Integer.toString(it);
        System.out.println(it_str1+2);   // 输出"1002"

//        c.直接把基本数据类型+空字符串就得到了字符串
        String it_str2 = it + "";
        System.out.println(it_str2+3);   // 输出"1003"

//        2.把字符串类型的数值转换成对应的基本数据类型的值
        String numStr = "23";
        int numInt = Integer.valueOf(numStr);
        System.out.println(numInt+1);    // 输出24

        String doubleStr = "3.14";
        double numDouble = Double.valueOf(doubleStr);
        System.out.println(numDouble+0.1);  // 输出3.24
    }
}
```



***



### 类型对比

- 有了基本数据类型，为什么还要引用数据类型？

> 引用数据类型封装了数据和处理该数据的方法，比如 Integer.parseInt(String) 就是将 String 字符类型数据转换为 Integer 整型
>
> Java 中大部分类和方法都是针对引用数据类型，包括泛型和集合

- 引用数据类型那么好，为什么还用基本数据类型？

> 引用类型的对象要多储存对象头，对基本数据类型来说空间浪费率太高。逻辑上来讲，Java 只有包装类就够了，为了运行速度，需要用到基本数据类型；优先考虑运行效率的问题，所以二者同时存在是合乎情理的

- Java 集合不能存放基本数据类型，只存放对象的引用？

> 不能放基本数据类型是因为不是 Object 的子类。泛型思想，如果不用泛型要写很多参数类型不同的但功能相同的函数（方法重载）

- Object 类什么意思？

> 至于`Object`类型，它是Java中所有类的父类，因此可以代表任何Java对象。在需要无法确定具体类型的情况下，可以使用`Object`类型进行参数传递、变量存储等操作。但是，在实际编程中，如果过多地使用`Object`类型，会导致代码的可读性和可维护性下降

- ==

> == 比较基本数据类型：比较的是具体的值，相同返回 `true`，不相同返回 `false`
> == 比较引用数据类型：比较的是对象地址值，因此，对于包装类对象的比较，应该使用`.equals()`方法或者转换为相应的基本数据类型再进行比较。



### 装箱拆箱

`自动装箱`：可以直接把基本数据类型的值或者变量赋值给包装类

`自动拆箱`：可以把包装类的变量直接赋值给基本数据类型

```java
public class helloworld {
    public static void main(String[] args) {
        int a = 12;
        Integer a1 = 12;//自动装箱
        Integer a2 = a; //自动装箱
        Integer a3 = null;  // 引用数据类型的默认值可以为null

        Integer c = 100;
        int c1 = c; //自动拆箱
    }
}
```

```java
public class helloworld {
    public static void main(String[] args) {
        Integer it = Integer.valueOf(12);   //手动装箱
        Integer a = 3;
        int it33 = a.intValue();    //手动拆箱
    }
}
```

>  自动装箱反编译后底层调用 `Integer.valueOf()` 实现
>
> 自动拆箱调用 `java.lang.Integer#intValue`



***



### 缓存池

 `new Integer(123)` 与 `Integer.valueOf(123)` 的区别在于：

- new Integer(123)：每次都会新建一个对象
- Integer.valueOf(123)：会使用缓存池中的对象，多次调用取得同一个对象的引用

当比较`x`和`y`的值时，由于`new`关键字会在堆内存中创建新的对象，因此`x`和`y`分别指向独立的内存地址，所以它们的比较结果是`false`

`注意`：需要注意的是，缓存池中缓存的是数值在 -128 至 127 范围内的对象，因此只有当使用 `valueOf()` 方法装箱时，且数值在这个范围内时，才能保证返回相同的对象。而超出这个范围的数值，则一定会新创建一个对象，因此使用 `==` 进行比较时，结果一定是 `false`。

```java
public class helloworld {
    public static void main(String[] args) {
        
        Integer x = new Integer(123);
        Integer y = new Integer(123);
        System.out.println(x == y); //输出false

        Integer z = Integer.valueOf(123);
        Integer g = Integer.valueOf(123);
        System.out.println(z == g); //输出true
        
        Integer z2 = Integer.valueOf(163);
        Integer g2 = Integer.valueOf(163);
        System.out.println(z2 == g2); //输出false  因为缓存池最大是127超出了一定是false      
    }
}
```



基本类型对应的缓存池如下：

- `Boolean` 类型的 `true` 和 `false`
- `Byte` 类型的 `-128 ~ 127`
- `Short` 类型的 `-128 ~ 127`
- `Integer` 类型的 `-128 ~ 127`
- `Long` 类型的 `-128 ~ 127`
- `Character` 类型的 `\u0000 ~ \u007F` (即 0 ~ 127)

在 jdk 1.8 所有的数值类缓冲池中，**Integer 的缓存池 IntegerCache 很特殊，这个缓冲池的下界是 -128，上界默认是 127**，但是上界是可调的，在启动 JVM 时通过 `AutoBoxCacheMax=<size>` 来指定这个缓冲池的大小，该选项在 JVM 初始化的时候会设定一个名为 `java.lang.IntegerCache.high` 系统属性，然后 IntegerCache 初始化的时候就会读取该系统属性来决定上界

在进行转换时， `优先将引用类型转换为基本类型，而不是将基本类型转换为引用类型`

```java
int a = 1000;
Integer b = 1000;
System.out.println(a == b); //输出true 因为 y 会调用 intValue 【自动拆箱】返回 int 原始值进行比较
```





***



### 输入数据

```java
//语法
Scanner sc = new Scanner(System.in)
    
> next()：遇到了空格，就不再录入数据了，结束标记：空格、tab 键
> nextLine()：可以将数据完整的接收过来，结束标记：回车换行符    
```

一般使用 `sc.nextInt()` 或者 `sc.nextLine()` 接受整型和字符串，然后转成需要的数据类型

* Scanner：`BufferedReader br = new BufferedReader(new InputStreamReader(System.in))`
* print：`PrintStream.write()`

```java
public class helloworld {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);    //创建一个 Scanner 对象 sc 用于接收用户输入
        String msg = sc.nextLine(); //将用户输入转化成字符串类型，并赋值给 msg 变量
        System.out.println(msg);    //输出msg的值
    }
}
```

使用引用数据类型的API:

```java
public class helloworld {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        while(scanner.hasNextLine()) {
            String msg = scanner.nextLine();
            System.out.println(msg);
        }
    }
}
```



## 数组

### 初始化

数组就是存储数据长度固定的容器，存储多个数据的数据类型要一致，`数组也是一个对象`

创建数组：

* 数据类型[] 数组名：`int[] arr`  （常用）
* 数据类型 数组名[]：`int arr[]`

静态初始化：

* 显性 --- 数据类型[] 数组名 = new 数据类型[]{元素1,元素2,...}：`int[] arr = new int[]{11,22,33}`
* 隐性 --- 数据类型[] 数组名 = {元素1,元素2,...}：`int[] arr = {44,55,66}`

动态初始化：

数据类型[] 数组名 = new 数据类型[数组长度]：`int[] arr = new int[3]`

```java
public class helloworld {
    public static void main(String[] args) {
        int[] arr = new int[3];
        Arrays.fill(arr,1); //初始化为1
        System.out.println(arr[0]); //输出1
    }
}
```



***



### 元素访问

* `索引`：每一个存储到数组的元素，都会自动的拥有一个编号，从 **0** 开始。这个自动编号称为数组索引（index），可以通过数组的索引访问到数组中的元素

* `访问格式`：数组名[索引]，`arr[0]`
* `赋值`：`arr[0] = 10`



***



### 内存分配

内存是计算机中的重要器件，临时存储区域，作用是运行程序。编写的程序是存放在硬盘中，在硬盘中的程序是不会运行的，必须放进内存中才能运行，运行完毕后会清空内存，Java 虚拟机要运行程序，必须要对内存进行空间的分配和管理

| 区域名称   | 作用                                                       |
| ---------- | ---------------------------------------------------------- |
| 寄存器     | 给 CPU 使用                                                |
| 本地方法栈 | JVM 在使用操作系统功能的时候使用                           |
| 方法区     | 存储可以运行的 class 文件                                  |
| 堆内存     | 存储对象或者数组，new 来创建的，都存储在堆内存             |
| 方法栈     | 方法运行时使用的内存，比如 main 方法运行，进入方法栈中执行 |



***



### 数组异常

- 索引越界异常：`ArrayIndexOutOfBoundsException `
- 空指针异常： `NullPointerException`

```java
public class helloworld {
    public static void main(String[] args) {
        int[] arr = new int[3];
        //把null赋值给数组
        arr = null;
        System.out.println(arr[0]); //抛出 NullPointerException 异常
    }
}
```



***



### 二维数组

二维数组也是一种容器，不同于一维数组，该容器存储的都是一维数组容器

初始化：

- 动态初始化：数据类型[][] 变量名 = new 数据类型[m] [n]，`int[][] arr = new int[3][3]`
  - m 表示这个二维数组，可以存放多少个一维数组， `行`
  - n 表示每一个一维数组，可以存放多少个元素， `列`
- 静态初始化
  - `数据类型[][] 变量名 = new 数据类型 [][]{{元素1, 元素2...} , {元素1, 元素2...} }`
  - `数据类型[][] 变量名 = {{元素1, 元素2...}, {元素1, 元素2...}...}`
  - `int[][] arr = {{11,22,33}, {44,55,66}}`

- 遍历

```java
public class helloworld {
    //        1.遍历二维数组，取出里面每一个一维数组
//        2.在遍历的过程中，对每一个一维数组继续完成遍历，获取内部存储的每一个元素
    public static void main(String[] args) {
        int[][] arr = {{11,22,33},{44,55,66}};

        for(int i = 0; i< arr.length;i++) {
            for(int j = 0;j<arr[i].length;j++) {
                System.out.println(arr[i][j]);
            }
        }
    }
}
```



## 运算

- switch：从 java 7开始，可以在 switch 条件判断语句里使用 String 对象

```java
public class helloworld {
    public static void main(String[] args) {
        String s = "a";
        switch(s) {
            case "a":
                System.out.println("aaa");
                break;
            case "b":
                System.out.println("bbb");
                break;
            case "c":
                System.out.println("ccc");
                break;
            default:
                break;
        }
    }
}
```

switch 不支持 long、float、double，switch 的设计初衷是对那些只有少数几个值的类型进行等值判断，如果值过于复杂，那么用 if 比较合适



## 参数

### 形参实参

形参：

* 形式参数，用于定义方法的时候使用的参数，只能是变量
* 形参只有在方法被调用的时候，虚拟机才分配内存单元，方法调用结束之后便会释放所分配的内存单元

实参：调用方法时传递的数据 `可以是常量，也可以是变量`



***



### 可变参数

可变参数用在形参中可以接收多个数据，在方法内部本质上就是一个数组

`格式`：数据类型... 参数名称

`作用`：传输参数非常灵活，可以不传输参数、传输一个参数、或者传输一个数组

可变参数的注意事项：

* 一个形参列表中可变参数只能有一个
* 可变参数必须放在形参列表的最后面

```java
public class helloworld {
    public static void main(String[] args) {
        int num1;
        num1 = sum();  //可以不传输参数
        System.out.println(num1);   //输出0
        num1 =  sum(1,2);   //可以传输多个参数
        System.out.println(num1);   //输出3
        num1 = sum(new int[]{1,2,3,4,5,6,7});  //可以传输一个数组
        System.out.println(num1);   //输出28
    }
    public static int sum(int... nums) {
        int sum = 0;
        for(int i :nums) {
            sum += i;
        }
        return sum;
    }
}
```



## 方法

### 方法概述

方法（method）是将具有独立功能的代码块组织成为一个整体，使其具有特殊功能的代码集

 `注意`：

方法必须先创建才可以使用，该过程成为方法定义，方法创建后并不是直接可以运行的，需要手动使用后才执行，该过程成为方法调用 

在方法内部定义的叫局部变量，局部变量不能加 static，包括 protected、private、public 这些也不能加

方法必须定义在类的内部，不可以定义在类外面，因为它是属于类的一部分

方法参数的传递方式是按值传递，即传实参的副本，当我们将一个 `对象或数组` 作为参数传递给方法时，实际上是传递了该对象或数组的引用（也就是指向堆内存中数据的地址），而不是该对象或数组的副本

 `原因` ：

局部变量是保存在栈中的，而静态变量保存于方法区（JDK8 在堆中），局部变量出了方法就被栈回收了，而静态变量不会，所以**在局部变量前不能加 static 关键字**，静态变量是定义在类中，又叫类变量



***



### 定义调用

定义格式(`方法名应该使用驼峰式大小写（单词首字母小写，后面单词首字母大写）`)：

```java
public static 返回值类型 方法名(参数) {
    //方法体
    return 数据;
}
```

调用格式：

```java
数据类型 变量名 = 方法名(参数);
```

* 方法名：调用方法时候使用的标识
* 参数：由数据类型和变量名组成，多个参数之间用逗号隔开
* 方法体：完成功能的代码块
* return：如果方法操作完毕，有数据返回，用于把数据返回给调用者

如果方法操作完毕

* void 类型的方法，直接调用即可，而且方法体中一般不写 return
* 非 void 类型的方法，推荐用变量接收调用

`原理`：每个方法在被调用执行的时候，都会进入栈内存，并且拥有自己独立的内存空间，方法内部代码调用完毕之后，会从栈内存中弹栈消失

```java
public class helloworld {
    public static void main(String[] args) {
        int[] a = {10};
        int[] b = {20};
        System.out.println("Before swap:a[0]="+a[0]+",b[0]="+b[0]); //输出 10 20
        swap(a,b);
        System.out.println("After swap:a[0]="+a[0]+",b[0]="+b[0]);  //输出 20 10
    }
//交换两个数的方法
    public static void swap(int[] x, int[] y) {
        int temp = x[0];
        x[0] = y[0];
        y[0] = temp;
    }
}
```

如果想修改基本数据类型可以把方法的返回值赋值给要修改的基本数据类型



***



### 注意事项

- 方法不能嵌套定义，即方法里面不能再定义方法
- void 表示无返回值，可以省略 return，也可以单独的书写 return，后面不加数据



***



### 方法重载

#### 重载介绍

方法重载指同一个类中定义的多个方法之间的关系，满足下列条件的多个方法相互构成重载：

1. 多个方法在**同一个类**中
2. 多个方法具有**相同的方法名**
3. 多个方法的**参数不相同**，类型不同或者数量不同

重载仅对应方法的定义， `与方法的调用无关`，调用方式参照标准格式

重载仅针对同一个类中方法的名称与参数进行识别， `与返回值无关`，不能通过返回值来判定两个方法是否构成重载

原理： `JVM → 运行机制 → 方法调用 → 多态原理`

```java
public class helloworld {
    public static void main(String[] args) {

    }
    public static void fun(int a) {
        //方法体
    }
//    错误原因：重载与返回值无关
    public static int fun(int a) {
        //方法体
    }
//    正确格式
    public static void fun(int a,int b) {   
        //方法体
    }
}
```



***



#### 方法选取

重载的方法在编译过程中即可完成识别，方法调用时 Java 编译器会根据所传入参数的声明类型（注意与实际类型区分）来选取重载方法。选取的过程共分为三个阶段：

* `一阶段`：在不考虑对基本类型自动装拆箱 (auto-boxing，auto-unboxing)，以及可变长参数的情况下选取重载方法
* `二阶段`：如果第一阶段中没有找到适配的方法，那么在允许自动装拆箱，但不允许可变长参数的情况下选取重载方法
* `三阶段`：如果第二阶段中没有找到适配的方法，那么在允许自动装拆箱以及可变长参数的情况下选取重载方法

如果 Java 编译器在同一个阶段中找到了多个适配的方法，那么会选择一个最为贴切的，而决定贴切程度的一个关键就是形式参数类型的继承关系，**一般会选择形参为参数类型的子类的方法，因为子类时更具体的实现**：

```java
public class MethodDemo {
    void invoke(Object obj, Object... args) { ... }
    void invoke(String s, Object obj, Object... args) { ... }

    invoke(null, 1); 	// 调用第二个invoke方法，选取的第二阶段
    invoke(null, 1, 2); // 调用第二个invoke方法，匹配第一个和第二个，但String是Object的子类
    
    invoke(null, new Object[]{1}); // 只有手动绕开可变长参数的语法糖，才能调用第一个invoke方法
    							   // 可变参数底层是数组，JVM->运行机制->代码优化
}
```

 `因此不提倡可变长参数方法的重载`



***



#### 继承重载

除了同一个类中的方法，重载也可以作用于这个类所继承而来的方法。如果子类定义了与父类中**非私有方法**同名的方法，而且这两个方法的参数类型不同，那么在子类中，这两个方法同样构成了重载

```java
public class helloworld {
    public static void main(String[] args) {
//        实例化
        Animal animal = new Animal();
        Dog dog = new Dog();
        animal.say();   //输出 "I am an animal"
        dog.say();   //输出 "I am an animal"
        dog.say(3); //输出 "Wool" "Wool" "Wool"
    }

}
//创建一个父类
class Animal {
    public void say() {
        System.out.println("I am an animal");
    }
}
//继承Animal类，所以Dog类是Animal的子类
class Dog extends Animal {
    public void say(int times) {
        for(int i = 0;i < times; i++) {
            System.out.println("Wool");
        }
    }
}
```



### 参数传递

Java 的参数是 `以值传递` 的形式传入方法中

值传递和引用传递的区别在于传递后会不会影响实参的值：**值传递会创建副本**，引用传递不会创建副本

- `基本数据类型`：形式参数的改变，不影响实际参数

每个方法在栈内存中，都会有独立的栈空间，方法运行结束后就会弹栈消失

```java
public class helloworld {
    public static void main(String[] args) {
        int number = 100;
        System.out.println("调用change方法前："+number);  //输出 100
        change(number);
        System.out.println("调用change方法后："+number);  //输出 100
    }

    public static void change(int number) {
        number = 200;
    }
}
```

- `引用类型`：形式参数的改变，影响实际参数的值

**引用数据类型的传参，本质上是将对象的地址以值的方式传递到形参中**，内存中会造成两个引用指向同一个内存的效果，所以即使方法弹栈，堆内存中的数据也已经是改变后的结果

```java
public class helloworld {
    public static void main(String[] args) {
        Dog dog = new Dog("A");
        func(dog);
        System.out.println(dog.getName());  //输出"B"
    }
    private static void func(Dog dog)
    {
        dog.setName("B");
    }
}

class  Dog {
    String name;
    public Dog(String a) {
        name = a;
    }
    public void setName(String v_name) {
        name = v_name;
    }
    public String getName() {
        return name;
    }
}
```



## 枚举

枚举是 Java 中的一种特殊类型，为了做信息的标志和信息的分类

定义枚举的格式：

```java
修饰符 enum 枚举名称{
	第一行都是罗列枚举实例的名称。
}
```

* 枚举类是用 `final` 修饰的，枚举类不能被继承
* 枚举类默认继承了 java.lang.Enum 枚举类
* 枚举类的第一行都是常量，必须是罗列枚举类的实例名称
* 枚举类相当于是多例设计模式
* 每个枚举项都是一个实例，是一个静态成员变量

| 方法名                                            | 说明                                 |
| ------------------------------------------------- | ------------------------------------ |
| String name()                                     | 获取枚举项的名称                     |
| int ordinal()                                     | 返回枚举项在枚举类中的索引值         |
| int compareTo(E  o)                               | 比较两个枚举项，返回的是索引值的差值 |
| String toString()                                 | 返回枚举常量的名称                   |
| static <T> T  valueOf(Class<T> type,String  name) | 获取指定枚举类中的指定名称的枚举值   |
| values()                                          | 获得所有的枚举项                     |

* 源码分析：

```java
enum Season {
    SPRING , SUMMER , AUTUMN , WINTER;
}
// 枚举类的编译以后源代码：
public final class Season extends java.lang.Enum<Season> {
	public static final Season SPRING = new Season();
	public static final Season SUMMER = new Season();
	public static final Season AUTUMN = new Season();
	public static final Season WINTER = new Season();

	public static Season[] values();
	public static Season valueOf(java.lang.String);
}
```



- API 使用

```java
public class helloworld {
    public static void main(String[] args) {
//        获取索引
        Season season = Season.ONE;
        System.out.println(season); //输出 ONE
        System.out.println(season.ordinal());   //0 该值代表索引
        season.ONE.DoSomething();
        season.TWO.DoSomething();
//        获取全部枚举
        Season[] ss = Season.values();
        for(int i = 0;i<ss.length;i++)
        {
            System.out.println(ss[i]);
        }
        int result = Season.ONE.compareTo(Season.TWO);  //比较两个枚举项
        System.out.println(result); //相差1 所以输出 -1
        System.out.println(season.getValue());  //输出 1
    }
}

enum Season {
    ONE(1),TWO(2),THREE(3),FOUR(4);

    private int value;

    public void DoSomething() {
        System.out.println("HELLO");
    }
    private Season(int value) {
        this.value = value;
    }
    public int getValue() {
        return value;
    }
}
```





## Debug

Debug 是供程序员使用的程序调试工具，它可以用于查看程序的执行流程，也可以用于追踪程序执行过程来调试程序。

加断点 → Debug 运行 → 单步运行 → 看 Debugger 窗口 → 看 Console 窗口

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230406112237.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230406112252.webp)

在断点右键可以输入值进行调试



## 对象

### 概述

Java 是一种面向对象的高级编程语言

面向对象三大特征： `封装，继承，多态`

两个概念： `类和对象`

* 类：相同事物共同特征的描述，类只是学术上的一个概念并非真实存在的，只能描述一类事物
* 对象：是真实存在的实例， 实例 == 对象，`对象是类的实例化`
* 结论：有了类和对象就可以描述万千世界所有的事物，必须先有类才能有对象

***



### 类

#### 定义

定义格式：

```java
修饰符 class 类名{
}
```

1. 类名的 `首字母建议大写`， `满足驼峰模式` ，比如 StudentNameCode
2. 一个 Java 代码中可以定义多个类， `按照规范一个 Java 文件一个类`
3. 一个 Java 代码文件中， `只能有一个类是 public 修饰`， `public 修饰的类名必须成为当前 Java 代码的文件名称`

```java
类中的成分:有且仅有五大成分
修饰符 class 类名{
		1.成员变量(Field):  	描述类或者对象的属性信息的。
        2.成员方法(Method):		描述类或者对象的行为信息的。
		3.构造器(Constructor):	 初始化一个对象返回。
		4.代码块
		5.内部类
	  }
类中有且仅有这五种成分，否则代码报错！
public class ClassDemo {
    System.out.println(1);//报错
}
```



***



#### 构造器

构造器格式：

```
修饰符 类名(形参列表){

}
```

`作用`：初始化类的一个对象返回

`分类`：无参数构造器，有参数构造器

`注意`：**一个类默认自带一个无参数构造器**，写了有参数构造器默认的无参数构造器就消失，还需要用无参数构造器就要重新写

构造器初始化对象的格式： `类名 对象名称 = new 构造器`

* `无参数构造器的作用`：初始化一个类的对象（使用对象的默认值初始化）返回
* `有参数构造器的作用`：初始化一个类的对象（可以在初始化对象的时候为对象赋值）返回

```java
public class Person {
    private String name;
    private int age;

    public void setName(String name) {
        this.name = name;
    }
    public void setAge(int age) {
        this.age = age;
    }
    public String returnName() {
        return this.name;
    }
    public int returnAge() {
        return this.age;
    }

}

//函数入口类
public class helloworld {
    public static void main(String[] args) {
//        实例化 无参构造器
          Person person = new Person();
          person.setName("小明");
          person.setAge(99);
          System.out.println("名字：" + person.returnName() + " 年龄：" + person.returnAge());	//输出 "名字：小明 年龄：99"
    }
}
```

```java
public class Person {
    private String name;
    private int age;
//    有参构造器
    public Person(String name,int age) {
        this.name = name;
        this.age = age;
    }
}

//函数入口类
public class helloworld {
    public static void main(String[] args) {
//        实例化，需要参数
          Person person = new Person("小明",19);
    }
}
```



### 包

`包`：分门别类的管理各种不同的技术，便于管理技术，扩展技术，阅读技术(类似于文件夹可以帮助我们组织文件，包可以帮助我们组织类)

定义包的格式：`package 包名`，必须放在类名的最上面

导包格式：`import 包名.类名`

> 包名应该尽量简洁且具有描述性，以便其他开发者能够轻松地理解代码的结构和意图。同时，在命名包时，也应该遵循命名规范，采用小写字母、点号分隔的方式(不建议在包名中使用类名，因为这样容易造成歧义和混淆)

> 包名的选择要基于以下几个方面考虑：
>
> 1. 技术栈和功能。包名应该反映代码所涉及的技术栈、功能和应用场景，例如 `com.example.app`、`com.example.api`、`com.example.util` 等等；
> 2. 项目名称和业务领域。包名应该与项目名称和业务领域相关联，以便帮助其他开发者快速识别代码所属的项目和领域；
> 3. 项目组织和团队约定。如果是多人协作开发，在团队内部应该约定一套包命名规范，以便保持代码的规范化和统一性。
>
> 例如，假设我们正在开发一个名为“学生信息管理系统”的项目，我们可以将包名定义为 `com.example.student` 或者 `com.example.studentmanagement` 等等。这样的命名方式既简洁明了，又符合 Java 的命名规范，同时还能够帮助其他开发人员快速识别代码所涉及的领域和应用场景。

相同包下的类可以直接访问；不同包下的类必须导包才可以使用

- 那什么时候需要定义包呢？

在 Java 中，包（Package）是将一组相关的类和接口封装在一起的一种机制。因此，当你需要定义一组相关的类和接口时，就应该考虑定义一个包来将其组织起来。下面是一些需要定义包的情况：

1. `代码复用和模块化`：如果你的应用程序中包含多个模块或者功能模块，则可以使用包将不同模块的代码组织在一起，从而实现代码复用和模块化。
2. `名称空间的管理`：在一个大型的应用程序中，可能存在相同类名的情况，使用包可以将这些类名隔离开来，从而避免命名冲突。
3. `可维护性和可读性`：合理地组织代码能够提高代码的可维护性和可读性，使用包可以让代码更加有层次感，并且使得代码结构更加清晰和易于维护。
4. `权限控制`：Java 中的访问权限修饰符（public、protected、private 和包访问），可以帮助你控制代码的访问权限，使用包也可以帮助你更好地管理类的访问权限。

### 封装

封装的哲学思维： `合理隐藏，合理暴露`

封装最初的目的：提高代码的安全性和复用性，组件化，还有助于降低代码耦合度、增加可维护性、提高代码的灵活性等等

封装的步骤：

1. 成员变量应该私有，用 `private` 修饰，只能在本类中直接访问
2. 提供成套的 getter 和 setter 方法暴露成员变量的取值和赋值

使用 private 修饰成员变量的原因： `实现数据封装，不想让别人使用修改你的数据，比较安全`



### 关键字

#### this

this 关键字的作用：

* this 关键字代表了 `当前对象的引用`
* this 出现在方法中：`哪个对象调用这个方法 this 就代表谁`
* this 可以出现在构造器中： `代表构造器正在初始化的那个对象`
* this 可以区分变量是访问的成员变量还是局部变量



#### static

##### 基本介绍

Java 是 `通过成员变量是否有 static 修饰来区分是类的还是属于对象的`

按照有无 static 修饰，成员变量和方法可以分为：

* 成员变量：
  * 静态成员变量（类变量）：static 修饰的成员变量， `属于类本身，与类一起加载一次，只有一个，直接用类名访问即可`
  * 实例成员变量：无 static 修饰的成员变量，属于类的每个对象的， `与类的对象一起加载，对象有多少个，实例成员变量就加载多少个，必须用类的对象来访问`

* 成员方法：
  * 静态方法：有 static 修饰的成员方法称为静态方法也叫类方法，属于类本身的，直接用类名访问即可
  * 实例方法：无 static 修饰的成员方法称为实例方法，属于类的每个对象的，必须用类的对象来访问



##### static用法

成员变量的访问语法：

* 静态成员变量：只有一份可以被类和类的对象**共享访问**
  * 类名.静态成员变量（同一个类中访问静态成员变量可以省略类名不写）
  * 对象.静态成员变量（ `不推荐` ）

* 实例成员变量：
  * 对象.实例成员变量（先创建对象）

成员方法的访问语法：

* 静态方法：有 static 修饰，属于类

  * 类名.静态方法（同一个类中访问静态成员可以省略类名不写）
  * 对象.静态方法（ `不推荐，参考 JVM → 运行机制 → 方法调用` ）

* 实例方法：无 static 修饰，属于对象

  * 对象.实例方法	

```java
public class helloworld {
//1.静态方法：有static修饰，属于类，直接用类名访问即可！
    public static void intAdd() {}
// 2.实例方法：无static修饰，属于对象，必须用对象访问！    
    public void func() {}

    public static void main(String[] args) {
        helloworld.intAdd();
        intAdd();
//        helloworld.func();  //会报错，不能直接类名.
        helloworld hell = new helloworld();	//需要创建对象调用
        hell.func();
    }
}
```



##### 	两个问题

{% note blue 'fas fa-fan' flat %}内存问题{% endnote %}

* 栈内存存放 main 方法和地址

* 堆内存存放对象和变量

* 方法区存放 class 和静态变量（jdk8 以后移入堆）

{% note blue 'fas fa-fan' flat %}访问问题{% endnote %}

* 实例方法是否可以直接访问实例成员变量？ `可以，因为它们都属于对象`
* 实例方法是否可以直接访问静态成员变量？ `可以，静态成员变量可以被共享访问`
* 实例方法是否可以直接访问实例方法?  `可以，实例方法和实例方法都属于对象`
* 实例方法是否可以直接访问静态方法？ `可以，静态方法可以被共享访问`
* 静态方法是否可以直接访问实例变量？  `不可以，实例变量必须用对象访问！！`
* 静态方法是否可以直接访问静态变量？  `可以，静态成员变量可以被共享访问`
* 静态方法是否可以直接访问实例方法?  `不可以，实例方法必须用对象访问！！`
* 静态方法是否可以直接访问静态方法？ `可以，静态方法可以被共享访问！！`



#### super

继承后 super 调用父类构造器，父类构造器初始化继承自父类的数据。

总结与拓展：

* this 代表了当前对象的引用（继承中指代子类对象）：this.子类成员变量、this.子类成员方法、**this(...)** 可以根据参数匹配访问本类其他构造器
* super 代表了父类对象的引用（继承中指代了父类对象空间）：super.父类成员变量、super.父类的成员方法、super(...) 可以根据参数匹配访问父类的构造器

注意：

*  `this(...) 借用本类其他构造器，super(...) 调用父类的构造器`
*  `this(...) 或 super(...) 必须放在构造器的第一行，否则报错`
*  `this(...) 和 super(...) 不能同时出现在构造器中，因为构造函数必须出现在第一行上，只能选择一个`

> 当你在调用一个构造方法时，这种方式允许你将这个构造方法所需的一些参数传递给另一个构造方法，并且这个构造方法具有相同的类名。在这个过程中，借用的构造方法叫做 `兄弟构造器`

```java
public class helloworld {
    public static void main(String[] args) {
//       Main main = new Main();
        Student student1 = new Student("小猪",11);
        Student student2 = new Student("晓东",19,"幼儿园");
        Study study1 = new Study("小龙",66,"精神病院");
        System.out.println(student1.getName()); //输出 "小猪"
        System.out.println(student2.getName()); //输出 "晓东"
        System.out.println(study1.getName());   //输出 "小龙"
    }
}

class Study extends Student {
    public Study(String name,int age,String schoolName) {
        super(name,age,schoolName); //根据参数调用父类的构造器
    }
}

class Student {
    private String name;
    private int age;
    private String schoolName;

    public Student() {

    }
    public Student(String name,int age) {
        //借用兄弟构造器功能
        this(name,age,"张三");
    }
    public Student(String name,int age,String schoolName) {
        this.name = name;
        this.age = age;
        this.schoolName = schoolName;
    }
    public String getName() {
        return this.name;
    }
}
```



#### final

##### 基本介绍

final 用于修饰：类，方法，变量

* final 修饰类， `类不能被继承了，类中的方法和变量可以使用`
* final 可以 `修饰方法，方法就不能被重写`
* final 修饰变量总规则： `变量有且仅能被赋值一次`

 `final 和 abstract 的关系是互斥关系，不能同时修饰类或者同时修饰方法`



##### 修饰变量

{% note blue 'fas fa-fan' flat %}静态变量{% endnote %}

final 修饰静态成员变量，变量变成了常量

常量： `有 public static final 修饰，名称字母全部大写，多个单词用下划线连接(不一定是public也可以是其他，反正final修饰的就要大写)`

 `常量应该被定义为类的成员变量，不能定义在方法里`

`不能在方法里初始化`

final 修饰静态成员变量可以在哪些地方赋值：

1. 定义的时候赋值一次
2. 可以在静态代码块中赋值一次( `即 static{}格式`)

```java
public class helloworld {
    public static final String NAME = "张三";
    public static final String NAME2;
    static {
//        在静态代码块里初始化
        NAME2 = "李四";
    }    
    public static void main(String[] args) {
    }
}
```





{% note blue 'fas fa-fan' flat %}实例变量{% endnote %}

final 修饰变量的总规则：有且仅能被赋值一次

final 修饰实例成员变量可以在哪些地方赋值 1 次：

1. 定义的时候赋值一次
2. 可以在实例代码块中赋值一次
3. 可以在每个构造器中赋值一次

```java
public class helloworld {
    private  final String NAME = "张三";
    private  final String NAME2;
    private  final String NAME3;
//    可以在实例代码块中赋值一次。
    {
        NAME2 = "张三2";
    }
//    构造器赋值一次
    public  helloworld() {
        NAME3 = "李四";
    }
    //    构造器赋值一次
    public helloworld(int a) {
        NAME3 = "李武";
    }
    public static void main(String[] args) {
        helloworld hello = new helloworld();
//        hello.NAME3 = "傻逼"; //第二次赋值 报错！
    }
}
```



#### implements

`implements` 关键字用于表示一个类实现了一个接口。通过 `implements` 关键字，类可以继承接口中声明的所有抽象方法，并必须对这些抽象方法进行实现



#### instanceof

`instanceof`: 判断左边的对象是否是右边的类的实例，或者是其直接或间接子类，或者是其接口的实现类

用于判断一个对象是否是某个类或其子类的实例，通常与类型转换（包括向上转型和向下转型）一起使用，以确保类型转换的安全性

参考 `多态上下转型那里`

### 继承

#### 基本介绍

继承是 Java 中一般到特殊的关系，是一种子类到父类的关系

* 被继承的类称为：父类/超类
* 继承父类的类称为：子类

继承的作用：

* `提高代码的复用，相同代码可以定义在父类中`
* 子类继承父类，可以直接使用父类这些代码（相同代码重复利用）
* 子类得到父类的属性（成员变量）和行为（方法），还可以定义自己的功能，子类更强大

继承的特点：

1.  `子类的全部构造器默认先访问父类的无参数构造器，再执行自己的构造器`
2. **单继承**： `一个类只能继承一个直接父类`
3. 多层继承： `一个类可以间接继承多个父类（家谱）`
4. 一个类可以有多个子类
5. 一个类要么默认继承了 Object 类，要么间接继承了 Object 类， `Object 类是 Java 中的祖宗类`

继承的格式：

```java
// 修饰符可以省略但是class不能省略！！！！
修饰符 class 子类 extends 父类{

}
```

子类不能继承父类的东西：

*  `子类可以继承父类的构造器，但是子类不能继承父类的私有构造器`。当一个子类被创建时，它会在内存中先创建父类对象，然后再创建子类对象。因此，子类的构造过程中需要先调用父类的构造器，然后再执行子类自身的构造器。如果子类没有显式定义构造器，则默认继承了父类的无参构造器。但是如果父类没有无参构造器（即只有带参数的构造器），则子类必须显式调用父类的有参构造器，并且使用 `super()` 关键字来完成这个调用。
* 子类是不能可以继承父类的私有成员的，可以反射暴力去访问继承自父类的私有成员
* 子类是不能继承父类的静态成员，父类静态成员只有一份可以被子类共享访问，**共享并非继承**

```java
public class Person {
    private String name;
    private int age;
//有参构造器
    public Person(String name,int age) {
        this.name = name;
        this.age = age;
    }
}

//默认的访问权限是包访问权限
class animal extends Person {
    private String animal_name;
    private int animal_number;

    public animal(String name,int age,String animal_name,int animal_number) {
        super(name,age);    //调用父类的构造器来初始化父类的属性
        this.animal_name = animal_name;
        this.animal_number = animal_number;
    }

}
```



如果父类中只有一个带参数的构造器，并且子类需要使用无参构造器来创建对象，就需要显式地在子类中定义无参构造器，并在其中使用 `super()` 关键字来调用父类的带参数构造器

```java
//默认的访问权限是包访问权限
class Animal extends Person {
    private String animal_name;
    private int animal_number;


    public Animal(String name,int age,String animal_name,int animal_number) {
        super(name,age);    //调用父类的构造器来初始化父类的属性
        this.animal_name = animal_name;
        this.animal_number = animal_number;
    }
    //构造一个无参构造器
    public Animal() {
        super("",0);	//调用父类的构造器来初始化父类的属性
    }

}
```



***



#### 变量访问

继承后成员变量的访问特点： `就近原则`，子类有找子类，子类没有找父类，父类没有就报错

如果要申明访问父类的成员变量可以使用： `super.父类成员变量(super指父类引用)`

```java
public class helloworld {

    public static void main(String[] args) {
//       Main main = new Main();
        wolf w = new wolf();
        w.showName();

    }
}

class wolf extends Animal2 {
    private String name = "子类";
    public void showName() {
        String name = "局部名称";
        System.out.println(name);   //输出 "局部名称"
        System.out.println(this.name);     //输出 "子类"
        System.out.println(super.name); //输出 "父类动物名称"
        System.out.println(name1);  //输出 "父类"
//        System.out.println(name2);  //报错 子类父类都没
    }
}

class Animal2 {
    public String name = "父类动物名称";
    public String name1 = "父类";
}
```



***



#### 方法访问

子类继承了父类就得到了父类的方法， `可以直接调用，受权限修饰符的限制，也可以重写方法`

方法重写：子类重写一个与父类申明一样的方法来 `覆盖` 父类的该方法

方法重写的校验注解： `@Override`

* 方法加了这个注解，那就必须是成功重写父类的方法，否则报错
* @Override 优势： `可读性好，安全，优雅`(这个可以省略的但是为了可读性一般重写的话需要加)

**子类可以扩展父类的功能，但不能改变父类原有的功能**， `重写有以下三个限制`：

- 子类方法的访问权限必须大于等于父类方法
- 子类方法的返回类型必须是父类方法返回类型或为其子类型
- 子类方法抛出的异常类型必须是父类抛出异常类型或为其子类型

继承中的隐藏问题：

- 子类和父类方法都是静态的，那么子类中的方法会隐藏父类中的方法
- 在子类中可以定义和父类成员变量同名的成员变量，此时子类的成员变量隐藏了父类的成员变量，在创建对象为对象分配内存的过程中， `隐藏变量依然会被分配内存`
- 如果子类要调用父类的同名方法，必须在重写的方法体内的第一行使用 `super` 关键字来调用

```java
public class helloworld {
    public static void main(String[] args) {
        Dog dog = new Dog();
        dog.move(); //调用子类方法
    }
}

class Dog extends Animal {
    @Override
    public void move() {
        super.move();   //输出 "Animal is moving"
        System.out.println("Dog is running");
    }
}

class Animal {
    public void move() {
        System.out.println("Animal is moving");
    }
}
```



***



#### 常见问题

- 为什么子类构造器会先调用父类构造器？


1. 子类的构造器的第一行默认 super() 调用父类的无参数构造器，写不写都存在
2. 子类继承父类，子类就得到了父类的属性和行为。调用子类构造器初始化子类对象数据时，必须先调用父类构造器初始化继承自父类的属性和行为
3. 参考 JVM → 类加载 → 对象创建

```java
class Animal {
    public Animal() {
        System.out.println("==父类Animal的无参数构造器==");
    }
}

class Tiger extends Animal {
    public Tiger() {
        super(); // 默认存在的，根据参数去匹配调用父类的构造器。
        System.out.println("==子类Tiger的无参数构造器==");
    }
    public Tiger(String name) {
        //super();  默认存在的，根据参数去匹配调用父类的构造器。
        System.out.println("==子类Tiger的有参数构造器==");
    }
}
```

- 为什么 Java 是单继承的？

答：反证法，假如 Java 可以多继承，请看如下代码：

```java
class A{
	public void test(){
		System.out.println("A");
	}
}
class B{
	public void test(){
		System.out.println("B");
	}
}
class C extends A , B {
	public static void main(String[] args){
		C c = new C();
        c.test(); 
        // 出现了类的二义性！所以Java不能多继承！！
	}
}
```



### 抽象类

#### 基本介绍

>  父类知道子类要完成某个功能，但是每个子类实现情况不一样

抽象方法： 没有方法体，只有方法声明，必须用 `abstract` 修饰的方法就是抽象方法，因此必须由子类去实现

抽象类：拥有抽象方法的类必须定义成抽象类，必须用 abstract 修饰，**抽象类是为了被继承**

一个类继承抽象类，**必须重写抽象类的全部抽象方法**，否则这个类必须定义成抽象类

 `它不能被实例化，只能被继承`

```java
//定义一个抽象类
public abstract class Shape {
    protected String color;

    public Shape(String color) {
        this.color = color;
    }
//定义两个抽象方法 ，这些方法没有具体实现
    public abstract double getArea();
    public abstract double getPerimeter();

    public void printColor() {
        System.out.println("颜色："+ color);
    }
}
//继承抽象类
class Circle extends Shape {
    private double radius;

    public Circle(String color,double radius) {
        super(color);
        this.radius = radius;
    }
    @Override
    public double getArea() {
        return Math.PI*radius*radius;
    }
    @Override
    public double getPerimeter() {
        return 2*Math.PI*radius;
    }
}
```

```java
public class helloworld {
    public static void main(String[] args) {
        Circle circle = new Circle("BLACK",20);
        System.out.println(circle.getArea());   //输出 1256.6370614359173
        System.out.println(circle.getPerimeter());  //输出 125.66370614359172
        circle.printColor();    // 输出 "颜色：BLACK"
    }
}
```



#### 常见问题

一、抽象类是否有构造器，是否可以创建对象?

* 抽象类有构造器，但是抽象类不能创建对象，类的其他成分它都具备，构造器提供给子类继承后调用父类构造器使用
* 抽象类中存在抽象方法，但不能执行，**抽象类中也可没有抽象方法**

二、static 与 abstract 能同时使用吗？

- 不能，被 static 修饰的方法属于类，是类自己的东西，不是给子类来继承的，而抽象方法本身没有实现，就是用来给子类继承



#### 存在意义

**被继承**，抽象类就是为了被子类继承，否则抽象类将毫无意义（核心）

抽象类体现的是"模板思想"：**部分实现，部分抽象**，可以使用抽象类设计一个模板模式



### 接口

#### 基本介绍

接口是 Java 语言中一种引用类型，是方法的集合。

接口是更加彻底的抽象，接口中只有抽象方法和常量，没有其他成分

```java
 修饰符 interface 接口名称{
	// 抽象方法
	// 默认方法
	// 静态方法
	// 私有方法
}
```

* 抽象方法：接口中的抽象方法默认会加上 `public abstract` 修饰，所以可以省略不写

* 静态方法：静态方法必须有方法体

* 常量：是 public static final 修饰的成员变量，仅能被赋值一次，值不能改变。常量的名称规范上要求全部大写，多个单词下划线连接，public static final 可以省略不写

```java
public interface Shape {
//    public static final String SCHOOL_NAME = "张三";
    String SCHOOL_NAME = "张三";
//    public abstract void run();
    void run();
}
```



#### 实现接口

接口是用来被类实现的

* `类与类是继承关系`：一个类只能直接继承一个父类，单继承
* `类与接口是实现关系`：一个类可以实现多个接口，多实现，接口不能继承类
* `接口与接口继承关系`：**多继承**

```java
修饰符 class 实现类名称 implements 接口1,接口2,接口3,....{

}
修饰符 interface 接口名 extend 接口1,接口2,接口3,....{
    
}
```

1. 当一个类实现多个接口时，多个接口中存在同名的静态方法并不会冲突，只能 `通过各自接口名访问静态方法`
2. 当一个类实现多个接口时， `多个接口中存在同名的默认方法，实现类必须重写这个方法`
3. 当一个类既继承一个父类，又实现若干个接口时，父类中成员方法与接口中默认方法重名，子类**就近选择执行父类**的成员方法
4. `接口中，没有构造器，不能创建对象`，接口是更彻底的抽象，连构造器都没有，自然不能创建对象

```java
public class helloworld {
    public static void main(String[] args) {
        Student student = new Student();
        student.eat();
        student.run();
    }
}

class Student implements Food,Person {
    @Override
    public void eat() {
        System.out.println("这是eat");
    }
    @Override
    public void run() {
        System.out.println("这是run");
    }
}
interface Food {
    void eat();
}
interface Person {
    void run();
}
```



#### 新增功能

jdk1.8 以后新增的功能：

* 默认方法（就是普通实例方法）
  * 必须用 `default` 修饰，默认会 public 修饰
  * 必须用接口的实现类的对象来调用
  * 必须有默认实现
* 静态方法
  * 默认会 public 修饰
  * 接口的静态方法必须用接口的类名本身来调用
  * 调用格式： `ClassName.method()`
  * 必须有默认实现
* 私有方法：JDK 1.9 才开始有的，只能在**本类中**被其他的默认方法或者私有方法访问

```java
public class helloworld {
    public static void main(String[] args) {
        // 1.默认方法调用：必须用接口的实现类对象调用。
        Man m = new Man();
        m.run();
        m.work();
        // 2.接口的静态方法必须用接口的类名本身来调用。
        InterfaceJDK8.inAddr();
    }
}

class Man implements InterfaceJDK8 {
    @Override
    public void work() {
        System.out.println("工作中");
    }
}

interface InterfaceJDK8() {
    //抽象方法
    void work();

    //    a.默认方法，必须用接口的实现类的对象；来调用
    default void run() {
        go();
        System.out.println("开始跑步");
    }

    //    b.静态方法
//    注意：接口的静态方法必须用接口的类名本身来调用
    static void inAddr() {
        System.out.println("我们在中山");
    }

    //    私有方法(JDK 1.9才开始有的)
//    只能在本接口中被其他的默认方法或者私有方法访问。
    private void go() {
        System.out.println("开始");
    }
}
```



#### 对比抽象类

| **参数**           | **抽象类**                                                   | **接口**                                                     |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 默认的方法实现     | 可以有默认的方法实现                                         | 接口完全是抽象的，jdk8 以后有默认的实现                      |
| 实现               | 子类使用 **extends** 关键字来继承抽象类。如果子类不是抽象类的话，它需要提供抽象类中所有声明的方法的实现。 | 子类使用关键字 **implements** 来实现接口。它需要提供接口中所有声明的方法的实现 |
| 构造器             | 抽象类可以有构造器                                           | 接口不能有构造器                                             |
| 与正常Java类的区别 | 除了不能实例化抽象类之外，和普通 Java 类没有任何区别         | 接口是完全不同的类型                                         |
| 访问修饰符         | 抽象方法有 **public**、**protected** 和 **default** 这些修饰符 | 接口默认修饰符是 **public**，别的修饰符需要有方法体          |
| main方法           | 抽象方法可以有 main 方法并且我们可以运行它                   | jdk8 以前接口没有 main 方法，不能运行；jdk8 以后接口可以有 default 和 static 方法，可以运行 main 方法 |
| 多继承             | 抽象方法可以继承一个类和实现多个接口                         | 接口可以继承一个或多个其它接口，接口不可继承类               |
| 速度               | 比接口速度要快                                               | 接口是稍微有点慢的，因为它需要时间去寻找在类中实现的方法     |
| 添加新方法         | 如果往抽象类中添加新的方法，可以给它提供默认的实现，因此不需要改变现在的代码 | 如果往接口中添加方法，那么必须改变实现该接口的类             |



### 多态

#### 基本介绍

 `多态的概念`：同一个实体同时具有多种形式同一个类型的对象，执行同一个行为，在不同的状态下会表现出不同的行为特征

多态的格式：

* 父类类型范围 > 子类类型范围

```java
父类类型 对象名称 = new 子类构造器;
接口	  对象名称 = new 实现类构造器;
```

多态的执行：

* 对于方法的调用：**编译看左边，运行看右边**（分派机制）
* 对于变量的调用：**编译看左边，运行看左边**

多态的使用规则：

* 必须存在继承或者实现关系
* 必须存在父类类型的变量引用子类类型的对象
* 存在方法重写

多态的优势：

* 在多态形式下，右边对象可以实现组件化切换，便于扩展和维护，也可以实现类与类之间的**解耦**
* 父类类型作为方法形式参数，传递子类对象给方法，可以传入一切子类对象进行方法的调用，更能体现出多态的**扩展性**与便利性

多态的劣势： 

* 多态形式下，不能直接调用子类特有的功能，因为编译看左边，父类中没有子类独有的功能，所以代码在编译阶段就直接报错了

```java
public class helloworld {
    public static void main(String[] args) {
        Animal cat = new Cat();
        Animal dog = new Dog();
        dog.run();  // 输出 "狗在跑"
//        可以去判断这个对象是不是属于Dog，如果是就把它强制类型转换为Dog这样就可以调用Dog的方法
        if(dog instanceof Dog) {
            ((Dog)dog).eat();   // 输出 "狗在吃饭"
        }
//        dog.eat();    // 错误的，编译看左边
        cat.run();  // 输出 "动物在跑"
        go(dog);    // 输出 "狗在跑"
    }
//    用 Dog或者Cat 都没办法让所有动物参与进来，只能用Anima
    public static  void go(Animal d) {
        d.run();
    }
}


class Cat extends Animal {
}

class Dog extends Animal {
    public void eat(){
        System.out.println("狗在吃饭");
    }
    @Override
    public void run() {
        System.out.println("狗在跑");
    }
}

class Animal {
    public void run(){
        System.out.println("动物在跑");
    }
}
```



#### 上下转型

> 基本数据类型的转换：
>
> 1. 小范围类型的变量或者值可以直接赋值给大范围类型的变量
> 2. 大范围类型的变量或者值必须强制类型转换给小范围类型的变量

引用数据类型的**自动**类型转换语法： `子类类型的对象或者变量可以自动类型转换赋值给父类类型的变量`

**父类引用指向子类对象**

- **向上转型 (upcasting)**：通过子类对象（小范围）实例化父类对象（大范围），这种属于自动转换
- **向下转型 (downcasting)**：通过父类对象（大范围）实例化子类对象（小范围），这种属于强制转换

```java
public class helloworld {
    public static void main(String[] args) {
//        向上转型
        Animal a = new Dog();
        a.run();    // 输出 "狗在跑"
//        向下转型
        Dog dog = (Dog)a;
        dog.eat();  // 输出 "狗在吃饭"
    }
}


class Dog extends Animal {
    public void eat(){
        System.out.println("狗在吃饭");
    }
    @Override
    public void run() {
        System.out.println("狗在跑");
    }
}

class Animal {
    public void run(){
        System.out.println("动物在跑");
    }
}
```



### 内部类

#### 描述

内部类是类的五大成分之一： `成员变量，方法，构造器，代码块，内部类`

概念： `定义在一个类里面的类就是内部类`

作用：提供更好的封装性，体现出组件思想，**间接解决类无法多继承引起的一系列问题**

分类：静态内部类、实例内部类（成员内部类）、局部内部类、**匿名内部类**（重点） 



####  静态内部类

定义：有 static 修饰，属于外部类本身，会加载一次

静态内部类中的成分研究：

* 类有的成分它都有，静态内部类属于外部类本身，只会加载一次
* 特点与外部类是完全一样的，只是位置在别人里面
* 可以定义静态成员

静态内部类的访问格式：

```java
外部类名称.内部类名称
    
// 示例
Outter.StaticOutter    
```

静态内部类创建对象的格式：

```java
外部类名称.内部类名称 对象名称 = new 外部类名称.内部类构造器
// 示例
Outter.StaticOutter S1 = new Outter.StaticOutter();    
```

静态内部类的访问拓展：

* 静态内部类中是否可以直接访问外部类的静态成员?	`可以，外部类的静态成员只有一份，可以被共享`
* 静态内部类中是否可以直接访问外部类的实例成员?	`不可以，外部类的成员必须用外部类对象访问`

静态内部类的优点：相对于非静态内部类和匿名内部类，静态内部类的一个优势是，在不需要访问外部类的非静态成员时，可以 `避免创建不必要的外部类实例，从而减少内存开销和对象创建的时间`。静态内部类通常用来封装和隐藏外部类的实现细节，或者作为与外部类相关联的工具类。

```java
// 在静态内部类中，确实可以直接访问外部类的静态成员，无需通过外部类的实例来访问
// 在外部类中，若想要访问内部类的实例或者成员，则需要创建内部类的实例
public class helloworld {
    public static void main(String[] args) {
//        需要创建一个内部类实例
        Outter.StaticOutter S1 = new Outter.StaticOutter();
        S1.Print(); // 输出"我是静态" "变量2"
    }
}

//创建一个类
class Outter {
    private static int Number = 2;
//创建一个内部静态类
    static class StaticOutter {
        void Print() {
            System.out.println("我是静态类");
            System.out.println("变量"+Number);
        }
    }
}
```



#### 实例内部类

定义：无 `static` 修饰的内部类，属于外部类的每个对象，跟着外部类对象一起加载

实例内部类的成分特点：实例内部类中不能定义静态成员，其他都可以定义

实例内部类的访问格式：

```java
外部类名称.内部类名称
```

创建对象的格式：

```java
外部类名称.内部类名称 对象名称 = new 外部类构造器.new 内部构造器

// 示例
Outer.Inner S1 = new Outer().new Inner();    
```

**实例内部类可以访问外部类的全部成员**

* 实例内部类中可以直接访问外部类的静态成员，外部类的静态成员可以被共享访问
* 实例内部类中可以访问外部类的实例成员，实例内部类属于外部类对象，可以直接访问外部类对象的实例成员

```java
public class helloworld {
    public static void main(String[] args) {
//        创建一个内部类的实例
        Outer.Inner S1 = new Outer().new Inner();
//        或者另一种创建方法 -- S2
        Outer out = new Outer();
        Outer.Inner S2 = out.new Inner();
        S2.Inner_Print();   // 输出 "Inner"
        out.Outer_Print();  // 输出 "外部类" "Inner"
        S1.Inner_Print();   // 输出 "Inner"
    }
}

class Outer {
    private String Str = "我是外部类";

    void Outer_Print() {
        Inner ner = new Inner();
        System.out.println("外部类");
        ner.Inner_Print();
    }
//    创建一个内部类
    class Inner {
        void Inner_Print() {
            System.out.println("Inner");
        }
    }
}
```



#### 局部内部类

局部内部类：定义在方法中，在构造器中，代码块中，for 循环中定义的内部类

局部内部类中的成分特点：只能定义实例成员，不能定义静态成员

局部内部类的作用域仅限于方法或代码块中，因此只能在定义它的方法或代码块中被使用。而且，局部内部类不能添加访问修饰符，但可以使用 final 进行修饰

```java
public class helloworld {
    public static void main(String[] args) {
//        创建外部类实例并且调用它的方法
        Animal animal = new Animal();
        animal.Func();
    }
}

class Animal {
    private String name = "小鸟";
    private int Number = 999;

    public void Func() {
        final int Cnt = 0;
        class Tiger {
            String info = "Tiger";
            public void Func2() {
                // 在局部内部类中访问成员变量
                System.out.println(info);
                // 在局部内部类中访问外部类变量
                System.out.println(name);
                System.out.println(Number);
                // 局部内部类访问 final 的局部变量
                int sum = Cnt + 200;
                System.out.println(sum);
            }
        }
        // 创建局部内部类的对象
        Tiger tiger = new Tiger();
        // 调用局部内部类的方法
        tiger.Func2();
    }
}
```



#### 匿名内部类

匿名内部类：没有名字的局部内部类

匿名内部类的格式：

```java
new 类名|抽象类|接口(形参){
	//方法重写。
}
```

匿名内部类的特点：

* 匿名内部类不能定义静态成员
* 匿名内部类一旦写出来，就会立即创建一个匿名内部类的对象返回
* **匿名内部类的对象的类型相当于是当前 new 的那个的类型的子类类型**
* 匿名内部类引用局部变量必须是**常量**，底层创建为内部类的成员变量（原因：JVM → 运行机制 → 代码优化）

```java
public class helloworld {
    public static void main(String[] args) {
        Runnable S1 = new Runnable() {
            @Override
            public void run() {
                System.out.println("我是匿名内部类");
            }
        };
        S1.run();   // 输出 "我是匿名内部类"
    }
}
```



### 权限符

权限修饰符：有四种（ `private -> 缺省 -> protected - > public` ）
可以修饰成员变量，修饰方法，修饰构造器，内部类，不同修饰符修饰的成员能够被访问的权限将受到限制

| 四种修饰符访问权限 | private | 缺省 | protected | public |
| ------------------ | :-----: | :--: | :-------: | :----: |
| 本类中             |    √    |  √   |     √     |   √    |
| 本包下的子类中     |    X    |  √   |     √     |   √    |
| 本包下其他类中     |    X    |  √   |     √     |   √    |
| 其他包下的子类中   |    X    |  X   |     √     |   √    |
| 其他包下的其他类中 |    X    |  X   |     X     |   √    |

`protected` 用于修饰成员，表示在继承体系中成员对于子类可见

* 基类的 protected 成员是包内可见的，并且对子类可见
* 若子类与基类不在同一包中，那么子类实例可以访问其从基类继承而来的 protected 方法（重写），而不能访问基类实例的 protected 方法

> `protected` 关键字的作用是为了支持继承，并且对于一些需要被子类访问的成员，但是不需要被其他类访问的情况，使用 protected可以帮助我们更容易地实现这个需求



### 代码块

####  静态代码块

静态代码块的格式：

 ```java
static {
}
 ```

* 静态代码块特点： 
  * 必须有 static 修饰，只能访问静态资源
  * 会与类一起优先加载，且自动触发执行一次
* 静态代码块作用：
  * 可以在执行类的方法等操作之前先在静态代码块中进行静态资源的初始化 
  * `先执行静态代码块，在执行 main 函数里的操作`

```java
import java.util.ArrayList;
import java.util.Arrays;

public class helloworld {
    public static String Name;
    public static ArrayList<String> lists = new ArrayList<>();
    // 静态代码块,属于类，与类一起加载一次!
    static {
        System.out.println("静态初始化开始");
        // 在静态代码块中进行静态资源的初始化操作
        Name = "Luckys-Yang";
        lists.add("3");
        lists.add("4");
        lists.add("5");
    }
    public static void main(String[] args) {
        System.out.println("Main方法执行");
        System.out.println(Name);
        System.out.println(lists);
    }
}

// 输出结果
// 静态初始化开始
// Main方法执行
// Luckys-Yang
// [3, 4, 5]
```



#### 实例代码块

实例代码块的格式：

```java
{

}
```

* 实例代码块的特点：
  * 无 static 修饰，属于对象
  * 会与类的对象一起加载，每次创建类的对象的时候，实例代码块都会被加载且自动触发执行一次
  * 实例代码块的代码在底层实际上是提取到每个构造器中去执行的
* 实例代码块的作用：实例代码块可以在创建对象之前进行实例资源的初始化操作
* 实例化代码块中的代码在 `对象创建前被执行`，因此可以用于初始化对象的非静态成员变量

```java
public class helloworld {
    int x;
    int y;
    public helloworld() {
        System.out.println("调用了无参构造函数");
    }
//    初始化实例代码
    {
        x = 111;
        y = 999;
        System.out.println("调用实例代码块");
    }
    public static void main(String[] args) {
        helloworld hello = new helloworld();
        System.out.println("x = "+hello.x);
        System.out.println("y = "+hello.y);
    }
}
// 输出
调用实例代码块
调用了无参构造函数
x = 111
y = 999
```



## API

### Object

#### 基本介绍

Object 类是 Java 中的 `祖宗类`，一个类或者默认继承 Object 类，或者间接继承 Object 类，Object 类的方法是一切子类都可以直接使用

- 常用方法

> `toString()` ：默认是返回当前对象在堆内存中的地址信息：类的全限名@内存地址
>
> ```java
> public class helloworld {
>  public static void main(String[] args) {
>      Object Oject1 = new Object();
>      System.out.println(Oject1.toString());
>  }
> }
> // 输出
> java.lang.Object@1b6d3586
> ```
> `equals(Object o)`：比较两个对象的引用是否一样
>
> ```java
> public class helloworld {
>     public static void main(String[] args) {
> //        创建两个Object类
>         Object Oject1 = new Object();
>         Object Oject2 = new Object();
>         System.out.println(Oject1.toString());
> //        比较两个对象的引用是否一样
>         if(Oject1.equals(Oject2))
>         {
>             System.out.println("一样");
>         }
>         else
>         {
>             System.out.println("不一样");
>         }
>     }
> }
> ```

> - `== 和 equals 的区别`
>
> == 比较的是变量（栈）内存中存放的对象的（堆）内存地址，用来判断两个对象的**地址**是否相同，即是否是指相同一个对象，比较的是真正意义上的指针操作Object 类中的方法，
>
> equals **默认比较两个对象的引用**，重写 equals 方法比较的是两个对象的**内容**是否相等，所有的类都是继承自 java.lang.Object 类，所以适用于所有对象
>
> ```java
> public class helloworld {
>     public static void main(String[] args) {
>         String str1 = "测试";
>         String str2 = new String("测试");
>         String str3 = "测试";
>         System.out.println(str1 == str2);   // 输出 "false"
>         System.out.println(str1 == str3);   // 输出 "true"
>         System.out.println(str1.equals(str2));   // 输出 "true"
>     }
> }
> ```

hashCode 的作用：

* hashCode 的存在主要是用于查找的快捷性，如 Hashtable，HashMap 等，可以在散列存储结构中确定对象的存储地址
* 如果 `两个对象相同`，就是适用于 equals(java.lang.Object) 方法，那么这 `两个对象的 hashCode 一定要相同`
*  `哈希值相同的数据不一定内容相同，内容相同的数据哈希值一定相同`



### 深浅克隆

> 深拷贝相当于修改一个对象的值另一个对象的值不会受影响，浅拷贝的话则相当于指针操作修改一个另一个也会改变



## 问题

- 如果出现双击图标打不开，可以打开任务管理器往下滑找到IDEA结束任务然后重新双击即可