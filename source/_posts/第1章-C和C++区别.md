---
title: 第1章-C和C++区别
cover: /img/num25.webp
comments: false
tags:
  - C++动态内存
categories:
  - C++学习笔记
abbrlink: 213aeb57
date: 2022-03-07 13:35:00
updated: 2022-06-03 18:52:04
---
## 头文件

- c++当中头文件可以直接采用类名的方式直接包含，`不需要.h`

- 如果想要包含C语言标准库中的头文件，可以采用.h方式包含，也可以采用去掉.h直接在头文件前面加个c (例如：`<cstring>`)

- 包含 `自定义头文件`，`不可以采用缺少.h的方式写法`(例如："myhead.h")

  

## 入口函数

- c++中 `只支持int返回值类型` 主函数
- c++中主函数的参数没什么要求，`可以写也可以不写`

## 命名空间

{% note simple %}
如何自己写一个命名空间？
```cpp
namespace 空间名
{
	//函数
	//变量
	//自定义类型
}
```

学会怎么调用空间中的数据？
`空间名`::`成员`;

省略的方式 调用空间中的成员
using namespace `空间名`;
注意：省略多个前缀的时候，要注意的问题同名问题（二义性问题）

命名空间的嵌套
剥洋葱
作用：
1.在一定程度上增加标志符的使用率
2.在大型项目开始可以有效避免起名冲突
{% endnote %}

main.cpp

```cpp
# include <iostream>//标准c++头文件
using namespace std;//标准命名空间

namespace mm1
{
	char name[10];
	int age;
	void print()
	{
		printf("hello world mm1\n");
	}
	struct MM
	{
		int age;
	};
}
namespace boy
{
	namespace mm
	{
		int age;
		void print()
		{
			printf("boy::mm\n");
		}
	}
}
 
int main()//入口函数
{
	strcpy(mm1::name, "小可爱");
	struct mm1::MM mm = { 1 };
	printf("%d\n", mm.age);
	mm1::print();
 
	{
		using namespace mm1;
			printf("%s\n", name);
	}
	//嵌套
	boy::mm::print();
	//省略方式
	using namespace boy::mm;
	print();
 
	return 0;
}
 
 
```


## C++基本输入和输出


main.cpp

```cpp
# include <iostream>
# include <cstdio>
 
int num = 999;
int main()
{
	{
		using namespace std;
		//No.1  c++基本输出
	    //1.1单个数据的时候
		printf("我是最帅的！\n");
		cout << "我是最帅的那也不错\n";
 
		printf("%d\n", 1);
		cout << 1;
		cout << "\n";
		//1.2输出多个数据
		printf("%d%s%lf\n", 1, "你好帅", 1.5);
		cout << 1 << "你好帅" << 1.5;//不会自动补0是多少就打印多少
		cout << "\n";
		//1.3关于格式控制
		//c++依旧支持C语言格式控制字符，不需要要考虑c++的格式控制
		//目前只需要掌握基本输入和输出的用法即可，IO流课程再讲解
		cout << "520" << endl;//endl：换行(是字符'L'小写不是数字1),其他\t也是这样操作
		//1.4输出多个变量
		int iNum = 1;
		char str[20] = "我好帅，小丁丁";
		double dNum = 3.14;
		cout << iNum << "\t" << str << "\t" << dNum << endl;
 
 
		//No.2 c++的基本输入
		//1.输入单个字符
		cin >> iNum;
		cout << "iNum=" << iNum << endl;
		//2.输入多个数据
		cin >> iNum >> str >> dNum;
		cout << "iNum=" << iNum << "str=" << str << "dNum=" << dNum << endl;
	}
 
	//No3.注意几个现象
	//1.命名空间,如果把命名空间放作用域里下面使用就会报错，消除错误方法：加前缀 std::
	int temp = 0;
	std::cout << 1 << std::endl;
	//2.别致写法
	std::cout << "uloveyou" << std::endl;
	int num=111;
	std::cout << num << std::endl;//就近原则
	std::cout << ::num << std::endl;//::标识全局的变量
    //强制类型转换
    double a=66.666;
    std::cout<<int(a)<<std::endl;//输出结果66
    //C语言的知识
    float fnum=0.22f//尾巴加f表示是浮点型
    unsigned int aa=1u//无符号整型
    long int k=66L;//长整型
	return 0;
}
```


![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2Fbs2nJO.png)

## C++新类型


main.cpp

```cpp
# include <iostream>
# include <cstdio>
using namespace std;
 
/*
bool类型：占用内存一个字节；计算机非0或者指针为NULL表示不成立；充当函数返回值，开关；正常输出是0和1
指针：表示空用:nullptr
引用类型：理解为起别名；
auto类型：自动推断类型：必须根据赋值的数据推断类型，不能直接推断
*/
void arr(const char* a)
{
	cout << a << endl;
}
//指针传参
void Cop(int& a)//不要理解为指针，int& a=实参,修改a就是修改实参
{
	a = 999;
}
 
int pai = 666;
void Cop2(int*& p)
{
	p = &pai;
}
//右值引用
void printRightValue(int&& a)
{
	a+=2000;//增加一个可以修改的功能,常引用是不能修改的
	cout << a << endl;//输出3001
}
 
int num = 999;
int main()
{
	bool bNum =true;
	cout << bNum << endl;
	//boolalpha 用true和false方式打印bool类型
	cout << boolalpha << bNum << endl;
	int* p = nullptr;//表示空
	//类型& 别名=要起别名的东西
	int 女朋友 = 9;
	int& 小可爱 = 女朋友;//小可爱就是女朋友的别名
	小可爱 = 777;
	cout << 女朋友 << endl;//输出：777
	//c++中常量要求更严格
	//想要传变量和常量必须用const修饰
	arr("love");//形参必须要有const修饰
	//常引用
	//int& x = 1;//直接报错，c++对const更加严格
	int a=1;
	const int& xx = 1;//第一种写法：const修饰，可以给左值起引用也可以给右值引用
	const int& x2 = a;
	//右值引用
	int&& x = 1;//常量是右值（运算符的右边），给常量起别名
	//int&& x = a;//错误，右值引用只能给右值起别名
	//引用一般用在什么地方？
	//1.函数参数（防止拷贝产生）；2.函数返回值（增加左值使用）3.不能返回局部变量引用
	int x3 = 8;
	Cop(x3);
	cout << x3 << endl;
	int pp = 1001;
	int* pp2 = &pp;
	Cop2(pp2);
	cout << *pp2 << endl;//输出：666
	printRightValue(1001);
 
	return 0;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2Fbs2Vdx.png)

## 函数思想


main.cpp

```cpp
# include <iostream>
# include <cstdio>
using namespace std;
 
/*
	函数思想：
	No1.内敛思想：inline关键字，内敛函数就是编译完以二进制形式存在
	1.1什么样的函数可以成为inline,短小精悍
	1.2在结构体中或者类中实现的函数默认内敛
	No2.函数重载：c++允许同名不同参数函数存在①参数数目不同②参数类型不同③参数顺序不同(一定建立在不同类型的基础上)
	No3.函数缺省：c++允许给函数形参初始化
	3.1缺省顺序必须从右到左，缺省的参数中间不能存在没有缺省的
	3.2没有传入参数的使用默认值
*/
 
inline int Max(int a, int b)
{
	return a > b ? a : b;
}
//可以同名，数目不同
void print(int a)
{
	cout << a << endl;
}
void print(int a, int b)
{
	cout << "迫不得已"<<endl;
	cout << a + b << endl;
}
void print(char a, char c)
{
	cout << a << c << endl;
}
//和上面不是顺序不同
//void print(int b, int a)
//{
//	cout << b + a << endl;
//}
 
//类型不同
void print(int a, char c)
{
	cout << a + c << endl;
}
void print(char a, int c)
{
	cout << a + c << endl;
}
//函数缺省:
//void printData(int a=8,int b,int c=9)//这样写是错误的error:默认实参不在形参列表的结尾
//正确的写法：
void printData(int a = 66, int b = 9, int c = 88)//a和b可以一起省略不初始化或者a单独不初始化
{
	cout << a << b << c <<endl;
}
 
int main()
{
	print(1,'a');//重载调用，优先调用类型一致的函数，如果类型一致的不存在就找能够转换的例如：void print(int a, int b)优先转换左边的再匹配
	int a, b, c;
	a = 1; b = 2; c = 3;
	printData();//不传参数输出：66 9 88
	printData(a,b,c);//输出：1 2 3
 
	return 0;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2Fbs2Ee1.png)

## 答疑

{% note simple %}
auto与C语言auto区别？
答：c++中淘汰了C语言用法，只有自动推断用法
auto可以在声明变量时根据变量初始值的类型自动为此变量选择匹配的类型。
举例：对于值x=1；既可以声明： int x=1 或 long x=1，也可以直接声明 auto x=1

为什么char*类型创建要加const?
答：这个跟赋值的值有关系，因为c++对const要求更加严格，两边类型必须一致
{% endnote %}

```cpp
//指针变量=常量地址，类型不一致所以要加const
	//char* str = "i like you";//	E0144 "const char *" 类型的值不能用于初始化 "char *" 类型的实体
	 char str2[] = "i lke you";
	 char* str = str2;
	 cout << str << endl;
```

## 结构体区别


main.cpp

```cpp
# include <iostream>
# include <cstdio>
# include <string>
using namespace std;
 
/*
	结构体区别：
	NO.1 类型上不需要struct 关键字，直接用结构体名即可；
	No.2 c++结构体中允许函数存在
	在结构体中声明，在结构体外实现，当然也可以在结构体内实现
	结构体中函数访问数据，是可以直接访问
	学会调用，和数据成员方式一样的
	对象（结构体变量）.成员
	指针->成员
	(*对象指针).成员
	c++在没有写构造函数和权限限定的时候，用法和C语言用法一样。
*/
struct MM
{
	//属性，特征
	//数据成员
	char name[20];
	int age;
	//.....
	//行为（方法）
	//成员函数
	void print()
	{
		cout << name << "\t" << age << endl;
	}
	void printData();//在里面声明在外面实现
};
//结构体限定，告诉别人这个函数来自哪里
void MM::printData()
{
	cout << name << "\t" << age << endl;
}
//结构体中的变量必须通过结构体变量（结构体指针）去访问
//c++结构体中的函数访问属性，可以直接访问
int main()
{
	struct MM girl = {"小芳",20};
	MM mm = {"小狗",43};
	girl.print();
	(&girl)->print();
	MM* p = &girl;
	(*p).print();
    girl.age=666;
    girl.print();
	return 0;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2Fbs2Zo6.png)


## 动态内存申请

main.cpp

```cpp
# include <iostream>
# include <cstdio>
# include <string>
using namespace std;
 
/*
	动态内存申请
	C语言的动态内存申请：malloc 不带初始化 calloc 带初始化 realloc 重新申请  free释放
	c++动态内存申请：
	①new(申请)delete(释放)
	②单个变量内存申请
	③数组的动态申请
	④结构体内存申请
*/
struct MM
{
	char* name;//需要加const
	int age;
	//成员函数
	void print()
	{
		cout << name<<"\t" << age << endl;
	}
};
void test1()
{
	//申请不初始化
	int* p = new int;
	*p = 999;
	cout << *p << endl;
	delete p;//释放完后还可以用，就像穿衣服一样脱了还能穿
	p = nullptr;
	 p = new int;
	*p = 666;
	cout << *p << endl;
	delete p;
	p = nullptr;
	//申请内存加初始化
	int* p2 = new int(520);//()给单个数据初始化
	cout << *p2 << endl;
	delete p2;
	p2 = nullptr;
 
}
 
void test2()
{
	//一维数组,不带初始化
	int* arr = new int[3];//等效于产生 int arr[3]
	//const char* s = new char[20];//你--->大老婆
	//const char* s2 = s;//朋友--->大老婆
	//s = "斤斤计较";//你--->二老婆
	//cout << s << endl;//输出"斤斤计较"
	//cout << s2 << endl;//输出乱码
 
	//通常字符串赋值是用strcpy
	char* arr2 = new char[20];
	strcpy(arr2, "你好呀");
	cout <<arr2<<endl;
	//释放只有两种方式：delete 指针：释放单个内存   delete[] 指针：释放一段内存
	delete[] arr;
	arr = nullptr;
	delete[] arr2;
	arr2 = nullptr;
	//带初始化的 一段数据的用{}
	int* arr3 = new int[6]{ 1,2,3,4,5,6 };
	for (int i = 0; i < 6; i++)
	{
		cout << arr3[i] << endl;
	}
	delete[] arr3;
	arr3 = nullptr;
 
	char* arr4 = new char[6]{ 'a','B','\0'};
	cout << arr4 << endl;
	delete[] arr4;
	arr4 = nullptr;
 
	arr4 = new char[10]{ "ILOVEYOU" };
	cout << arr4 << endl;
	delete[] arr4;
	arr4 = nullptr;
}
 
void test3()
{
	//new一个对象
	//结构体只能大括号，尽量不要这样初始化
	//MM* pmm = new MM{ "小金",22 };//E0144	"const char *" 类型的值不能用于初始化 "char *" 类型的实体,需要上面结构体加const
	//pmm->print();
	//pmm->name = new char[20];
	// 不能修改
	//strcpy(pmm->name, "来来来");//error E0167	"const char *" 类型的实参与 "char *" 类型的形参不兼容
	MM* pmm = new MM;
	//结构体中指针要做二次申请，才能strcpy,或者赋值
	pmm->name = new char[20];
	strcpy(pmm->name,"你好");//不能直接赋值还要二次申请
	pmm->age = 6;
	pmm->print();
	//申请顺序和释放顺序是相反的，就是个栈，反过来会中断
	delete[] pmm->name;
	delete pmm;
}
 
int main()
{
	test1();
	test2();
	test3();
	return 0;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2Fbs2mFK.png)

## 内存池


main.cpp

```cpp
# include <iostream>
# include <cstdio>
# include <string>
using namespace std;
 
/*
	内存池：
	允许大家申请一段内存，供给程序使用，综合管理内存,(切蛋糕)
	malloc 内存在堆区
	new    内存在自由存储区
*/
void test()
{
	char* memorySum = new char[1024];
	//....事情的处理，需要内存，程序所有的内存源自于memorySum
	//memorySum是申请内存的首地址
	int* pNum = new(memorySum)int[3]{ 1,2,3 };//格式：new(申请内存的开始位置) 申请类型和申请多少
	//char* pstr = new(memorySum+12)char[20]{ "小哥哥" };//12是因为int类型申请了三个所以是3*4=12
	//等效于下面这段,指针的偏移
	char* pstr = new(pNum + 3)char[20]{ "小哥哥" };
	for (int i = 0; i < 3; i++)
	{
		cout << ((int*)memorySum)[i]<< endl;//注意优先级用括号
	}
	cout <<pNum[2]<< endl;
	cout << pstr << endl;
	//也可以通过memorySum偏移去打印
	cout << memorySum + 12 << endl;//输出:小哥哥,如果偏移位置没有数据则显示乱码例如:memorySum+500
	//释放方便，只需释放总内存
	delete[] memorySum;
	memorySum = nullptr;
}
 
int main()
{
	test();
	return 0;
}
```


## C++string类型

main.cpp

```cpp
# include <iostream>
# include <cstdio>
# include <string>
# include <cstring>
using namespace std;
/*
	string类型
	NO.1 string创建:①带初始化②不带初始化③通过另一个字符串创建
	NO.2 string基本操作:
*/
void test1()
{
	//一般string前不用加const,加了就不能修改
	//创建方式①
	string str1;
	str1 = "hello world";
	cout<<"str1:" << str1 << endl;
	//创建方式②
	string str2("hello world");
	cout<<"str2:" << str2 << endl;
	//创建方式③
	string str3 = "hello world";//我喜欢这种
	cout<<"str3:" << str3 << endl;
	//还可以赋值方式
	string str4(str3);
	cout<<"str4:" << str4 << endl;
	string str5 = str4;
	cout<<"str5:" << str5 << endl;
}
void test2()
{
	string str1 = "one";
	string str2 = "two";
	//字符串连接
	string str3 = str1 + str2;//加号连接两个字符串，没有减法
	cout << "str3:" << str3 << endl;
	//字符串比较
	if (str1 > str2)
	{
		cout << "str1大" << endl;
	}
	else
	{
		cout << "str1小" << endl;
	}
}
void test3()
{
	//c++中是一个自定义类型(类)，目前当做结构体即可
	//c++ string不能用到C语言的字符串处理函数
	//c++如何转换为C语言的char*
	//c_str()  data()函数
	string str6 = "Like";
	//printf("%s", str6);//这样会警告输出不了
	printf("str6:%s\n", str6.c_str());
	printf("str6:%s\n", str6.data());
	//直接把数字转换为相应的字符串
	string str7 = to_string(123456);
	cout <<"str7:" << str7 << endl;
}
void test4()
{
	//采用下标法打印string
	string str = "i kill you";
	//c++ string中计算长度没有记录\0
	for (int i = 0; i <10; i++)
	{
		cout << str[i];
	}
	cout << endl;
	//其他函数操作
	//万金油函数
	//empty();
	//size();
	string str3 = "abcd";
	//cout << sizeof(str3) << endl;//输出：28
	cout << str3.size() << endl;//输出：4
	string str4;
	if (str4.empty())//return length==0; 
	{
		cout << "str4字符串为空" << endl;
	}
}
int main()
{
	test1();
	test2();
	test3();
	test4();
	return 0;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2Fbs2uWD.png)

## c语言~动态内存申请回顾

main.cpp

```cpp
//malloc,申请内存不初始化
	int* pM = (int*)malloc(sizeof(int) * 3);
	//memset(pM, 0, sizeof(int) * 3);
 
	//calloc,申请内存顺便初始化为0
	int* pM2 = (int*)calloc(3,sizeof(int));
	//相当于malloc的基础上加了memset(pM,3,sizeof(int)*3);
	//realloc,原来的数据还在
	int* pp = (int*)malloc(sizeof(int));
	*pp = 100;
	pp = (int*)realloc(pp, sizeof(int) * 3);
	pp[1] = 200;
	pp[2] = 334;
	cout << pp[0] <<pp[1]<<pp[2]<< endl;//不能超过申请的内存不然多出来的会是垃圾值
	return 0;
```

```cpp
//p是指针可以省略*
	auto *p = new int[3]{ 1,2,3 };
	cout << p[0] << endl;
```

## C语言~二维数组动态申请

main.cpp

```cpp
# include <iostream>
# include <cstdio>
# include <string>
# include <cstring>
using namespace std;
 
int** create(int row, int cols)
{
	int** p = (int**)malloc(sizeof(int*) * row);
	if (p == NULL)
	{
		return NULL;
	}
	for (int i = 0; i <row; i++)
	{
		p[i] = (int*)malloc(sizeof(int) * cols);
	}
	return p;
}
int main()
{
	int** p = create(4,3);
	for (int i = 0; i < 4; i++)
	{
		for (int j = 0; j < 3; j++)
		{
			p[i][j] = i * j;
			cout << p[i][j] << "\t";
		}
		cout << "\n";
	}
	//用数组指针去申请
	int(*prr)[4] = (int(*)[4])malloc(sizeof(int[4]) * 3);//三行四列
	//int *p=(指针的类型)malloc(sizeof(指针所指向的类型)*3)
	//指针的类型：去掉变量名    int*
	//指针所指向的类型：去掉变量名+*    int
	//int *p=(int*)malloc(sizeof(int)*3)
	return 0;
}
```


## C++动态申请一维数组，二维数组

main.cpp

```cpp
# include <iostream>
# include <cstdio>
# include <string>
# include <cstring>
using namespace std;
 
 
int main()
{
	//c++申请一维数组
	int* p = new int[10];
	for (int i = 0; i < 10; i++)
	{
		p[i] = i;
		cout << p[i] << endl;
	}
 
	cout << endl;
	//c++申请二维数组(四行三列)
	int** pp = new int* [4];
	for (int i = 0; i < 4; i++)
	{
		pp[i] = new int[3];
	}
	for (int i = 0; i < 4; i++)
	{
		for (int j = 0; j < 3; j++)
		{
			pp[i][j] = i * j;
			cout << pp[i][j]<<"\t";
		}
		cout << endl;
	}
	return 0;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2Fbs2MSe.png)