---
title: 第12章-STL（array与vector）
cover: /img/num36.webp
comments: false
tags:
  - STL
categories:
  - C++学习笔记
abbrlink: '9153357'
date: 2022-03-08 19:54:00
updated: 2022-06-03 20:52:39
---
##  STL概念

- STL(Standard Template Library,标准模板库)
- STL从广义上分为:容器(container)算法(algorithm) 迭代器(iterator)
- 容器和算法之间通过迭代器进行无缝连接。
- STL 几乎所有的代码都采用了模板类或者模板函数

<font color='red'>STL六大组件：</font>

1. <font color='orange'>容器</font>：各种数据结构，如vector、list、deque、set、map   等,用来存放数据。
2. <font color='orange'>算法</font>：各种常用的算法，如sort、find、copy、for_each等
3. <font color='orange'>迭代器</font>：扮演了容器与算法之间的胶合剂。
4. <font color='orange'>仿函数</font>：行为类似函数，可作为算法的某种策略。
5. <font color='orange'>适配器</font>：一种用来修饰容器或者仿函数或迭代器接口的东西。
6. <font color='orange'>空间配置器</font>：负责空间的配置与管理。


<font color='orange'>常用的数据结构</font>：数组,链表,树,栈,队列,集合,映射表等
这些容器分为<font color='orange'>序列式容器和关联式容器</font>两种:
<font color='orange'>序列式容器</font>:强调值的排序，序列式容器中的每个元素均有固定的位置。
<font color='orange'>关联式容器</font>:二叉树结构，各元素之间没有严格的物理上的顺序关系

算法分为<font color='orange'>质变算法和非质变算法</font>：

①<font color='orange'>质变算法</font>：是指运算过程中会更改区间内的元素的内容，例如拷贝，替换，删除等。

②<font color='orange'>非质变算法</font>：是指运算过程中不会更改区间内的元素的内容，例如查找，计数，遍历，寻找极值等。

迭代器

提供一种方法，便之能够依序寻访某个容器所含的各个元素，而又无需暴露该容器的内部表示方式。

<font color='orange'>每个容器都有自己专属的迭代器</font>

迭代器使用非常<font color='orange'>类似于指针</font>，初学阶段我们可以先理解迭代器为指针
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbgHcO1.png)



##  array(定长数组)

头文件：<font color='orange'><array></font>

###  模拟array

main.cpp
```cpp
template<class T,size_t size>
class MyArray
{
public:
	MyArray()
	{
		memory = new T[size]；
	}
    ~MyArray()
    {
        delete[] memory;
    }
 
protected:
	T* memory;
public:
    T* begin()
{
    return memory+0;//第一个元素
}
    T* end()
{
    return memory+size;//最后一个位置
}
    //类中类
    //类的对象模仿指针的行为
    class iterator
    {
        public:
            iterator(T* pMove=nullptr):pMove(pMove){}
            void operator=(T* pMove)//重载=
            {
                this->pMove=pMove;
            }
             bool operator!=(T* pMove)//重载!=
            {
               return this->pMove!=pMove;
            }
            iterator operator++(int)//重载++
            {
                this->pMove++;
                return *this
            }
            T operator*()//重载*
            {
                return pMove[0];
            }
        protected:
            T* pMove;
    }
};
 
void test()
{
	MyArray<int, 3>arr1;
    for(int i=0;i<3;i++)
{
    arr1[i]=i;
}
    MyArray<int,3>::iterator iter;
    for(iter=arr1.begin();iter!=arr1.end();iter++)
{
    cout<<*iter;
}
cout<<endl;   
}
```
 

### STL-array

main.cpp
```cpp
void testArray() 
{
	//存储数据的类型是:int  
//数组长度:3
//用模板的时候用的都是对象，而不是new一个对象
	array<int, 3> array1D;
	array<string, 3>* p = new array<string, 3>;
	delete p;
# define MAX 5
	array<double, 5> dAarray1D;
	//创建并初始化
	array<int, 3>  num = { 1,2,3 };
	for (int i = 0; i < array1D.size(); i++) 
	{
		array1D[i] = i;
	}
	//迭代器
}
 
void testExOperator() 
{
	//使用： 和数组一样的用法
	//一些函数
	array<int, 3> test = { 1,2,3 };
	cout << test.empty() << endl;
	cout << test.size() << endl;
	test.fill(5);		//填充所有的元素 ，填充为5
	for (int v : test)		
	{
		cout << v << "\t";
	}
	cout << endl;
	//交换  长度一定是要一样常
	array<int, 3> test1 = { 0,0,0};
	test.swap(test1);
	int cData[3] = { 1,2,3 };   //映射：一种对应关系，数组下标对应元素
	for (auto v : cData) 
	{
		cout << v << "\t";
	}
	cout << endl;
}
```
 


main.cpp
```cpp
//定长数组处理自定义类型的数据
class MM
{
public:
	MM() {}
	MM(string name, int age) :name(name), age(age) {}
	void print() 
	{
		cout << name << "\t" << age << endl;
	}
protected:
	string name;
	int age;
};
void testUserData() 
{
	array<MM, 3> mmData;	//	MM array[3];
	for (int i = 0; i < mmData.size(); i++) 
	{
		string name = "name";
		mmData[i] = MM(name + to_string(i), 16 + i);
	}
 
	for (auto v : mmData) 
	{
		//v:就是MM的对象
		v.print();
		//cout<<v;			//想要这样输出，重载<<运算符
	}
	//迭代器访问
	//对象模仿指针，*迭代器 就是取值运算
	array<MM, 3>::iterator iter;
	//begin()
	//end(): 最后一个位置，不是最后元素的位置
	(*mmData.begin()).print();
	//(*mmData.end()).print();  越界访问
	(*(mmData.end() - 1)).print();
	for (iter = mmData.begin(); iter != mmData.end(); iter++) 
	{
		//(*iter).print();
		iter->print();
		//cout<<*iter;		//重载<<
	}
}
```
 


<font color='orange'>array当做函数参数，返回值</font>

main.cpp
```cpp
//array当做函数参数，返回值都可以
array<int, 3>&  returnArray(array<int, 3>& temp) 
{
	for (int i = 0; i < temp.size(); i++)
	{
		temp[i] = i;
	}
	return temp;
}
```
 



##  vector(动态数组)

头文件：<font color='orange'><vector></font>

main.cpp
```cpp
//辅助函数:遍历容器
template <class _Ty>
void printVector(vector<_Ty>& temp) 
{
	for (auto v : temp) 
	{
		cout << v << "\t ";
	}
	cout << endl;
}
 
//配合for_each使用
void pri(string val)
{
	cout << val << " ";
}
 
//基本用法
void test1()
{
	//模板类型：存储数据类型
	//1.不带长度的创建方式
	vector<int> vData;
	//只能用成员函数做插入
	for (int i = 0; i < 4; i++)
	{
		vData.push_back(i);//尾插法
	}
	print(vData);
	/*打印结果：0 1 2 3*/
 
	//2.带长度
	vector<string> strData(3);//当前动态数组长度为3
	//确定长度，可以直接使用数组法插入
	for (int i = 0; i < strData.size(); i++)
	{
		string name = "name";
		strData[i] = name + to_string(i);
	}
	print(strData);
	/*打印结果：name0 name1 name2*/
	//超过的必须用成员函数插入
	//strData[3] = "name3";//中断: vector subscript out of range(超出下标范围)
	strData.push_back("name3");//做了自动扩增
	print(strData);
	/*打印结果：name0 name1 name2 name3*/
 
	//3.带初始化
	vector<double> dData = { 11.1, 2.2, 3.3, 4.3, 5.4, 6.55 };//自动算出长度为6
	print(dData);
	/*打印结果：11.1  2.2  3.3  4.3  5.4  6.55*/
 
	//猜谜
	vector<int> iData(3);
	iData.push_back(123);//在原有内存的后面扩增，原来的数据还在
	print(iData);
	/*打印结果：0 0 0 123*/
 
	//1.迭代器遍历
	vector<string>::iterator iter;
	
	for (iter = strData.begin(); iter != strData.end(); iter++)
	{
		cout << *iter<<" ";
	}
	cout << endl;
	/*打印结果：name0 name1 name2 name3*/
 
	//2.迭代器遍历
	vector<string>::iterator isBegin = strData.begin();
	vector<string>::iterator isEnd = strData.end();
	while (isBegin != isEnd)
	{
		cout << *isBegin<<" ";
		isBegin++;
	}
	cout << endl;
	/*打印结果：name0 name1 name2 name3*/
 
	//3.利用STL提供遍历算法
	for_each(strData.begin(), strData.end(), pri);
	cout << endl;
	/*打印结果：name0 name1 name2 name3*/
 
}
//自定义类型数据
class MM 
{
public:
	MM(string name, int age) :name(name), age(age) {}
	friend ostream& operator<<(ostream& out, const MM& temp) 
	{
		out << temp.name << "\t" << temp.age;
		return out;
	}
protected:
	string name;
	int age;
};
void testUserData() 
{
	vector<MM> mmData;
	for (int i = 0; i < 3; i++) 
	{
		string name = "name";
		mmData.push_back(MM(name + to_string(i), 18 + i));
	}
	//二进制“<<”: 没有找到接受“MM”类型的右操作数的运算符(或没有可接受的转换)
	printVector(mmData);
}
 
void Other()
{
	vector<int> iData2 = { 1,2,3,4,5 };
	vector<int> iData3 = { 5,4,3,2,1 };
	cout<<iData2.size() << endl;//当前元素个数
	cout<<iData2.empty() << endl;//是否为nullptr
	cout << iData2.front() << endl;//访问第一个元素
	cout << iData2.back() << endl;//访问最后一个元素
	cout << iData2.at(3)<< endl;//下标访问
	cout << iData2[3] << endl;//等效于上面
	iData2.swap(iData3);//交换两个数组元素
	print(iData2);//打印结果：5 4 3 2 1
	vector<int>::iterator iter;
	cout << (*iData2.begin())<<endl;//访问第一个元素
	cout << (*(iData2.end() - 1)) << endl;//访问最后一个元素
	//修改某个元素
	iData2.emplace(iData2.begin() + 1, 999);
	print(iData2);
	iData2.emplace_back(888);//和push_back一样的功能，尾插扩增
	print(iData2);
	//iData2.emplace_front(777);//错误；不存在这种修改第一个元素的函数
	
	//删除函数，数组容器没有
	//iData2.erase(iData2.begin()+2);//数组只有伪删除，没有删除操作
 
	//批量复制
	int arr[] = {6,66,666};
	vector<int> cData;
	cData.assign(arr,arr+3);
	print(cData);//打印结果：6 66 666
}
```
 



##  array与vector嵌套

###  array与array

<font color='orange'>等效</font>创建一个二维数组 int array[4][3]，array里面存的还是array.

存的是这样的数据类型array<int, 3>，有4个一样的

```cpp
void testArrayVsArray() 
{
	array<array<int, 3>, 4> arrData;  //int arrData[4][3]
	for (int i = 0; i < 4; i++) 
	{
		for (int j = 0; j < 3; j++) 
		{
			arrData[i][j] = i * j;
			cout << arrData[i][j] << "\t";
		}
		cout << endl;
	}
}
```

###  vector与vector

<font color='orange'>也是一个二维数组</font>，<font color='orange'>只能创建没有带长度的</font>

vector数组可以出现行、列数不等的情况

[collapse status="false" title="main1.cpp"]
```cpp
void testVectorVsVector() 
{
	srand((unsigned int)time(nullptr));
	vector<vector<int>> vecData;
	//一般vecotor 采用的是push_back插入
	for (int i = 0; i < 4; i++) 
	{
		vector<int> temp;
		//rand()%3 [0,2]  [2,4]
		for (int j = 0; j < rand()%3+2; j++) 
		{
			temp.push_back(i * j);
		}
		vecData.push_back(temp);
	}
    //打印
	//不等列，有可能每一列元素个数不同所以用.size()
	//不等列数的二位数组
	for (int i = 0; i < vecData.size(); i++) 
	{
		for (int j = 0; j < vecData[i].size(); j++) 
		{
			cout << vecData[i][j] << "\t";
		}
		cout << endl;
	}
}
```
 


另一种写法：

[collapse status="false" title="main2.cpp"]
```cpp
void test()
{
	vector<vector<int>> v1;
	vector<int> p1;
	vector<int> p2;
	vector<int> p3;
	vector<int> p4;
	//插入元素
	for (int i = 0; i < 4; i++)
	{
		p1.push_back(i+1);
		p2.push_back(i+2);
		p3.push_back(i+3);
		p4.push_back(i+4);
	}
	v1.push_back(p1);
	v1.push_back(p2);
	v1.push_back(p3);
	v1.push_back(p4);
 
		//通过大容器遍历一遍
	for (vector<vector<int>>::iterator is = v1.begin(); is != v1.end(); is++)
	{
        //(*is)-----vector<int>
		for (vector<int>::iterator vis = (*is).begin(); vis != (*is).end(); vis++)
		{
			cout << *vis << " ";
		}
		cout << endl;
	}
}
```
 

###  array套vector

main.cpp
```cpp
void testArrayVsVector()
{
	array<vector<int>, 3> vecArr;
	vector<int> vec1[3] = { { 1,2,3 } , {1,2,3,4}, {1,2}};
	for (int i = 0; i < vecArr.size(); i++) 
	{
		vecArr[i] = vec1[i];
	}
	//不等列数的二位数组
	for (int i = 0; i < vecArr.size(); i++)
	{
		for (int j = 0; j < vecArr[i].size(); j++)
		{
			cout << vecArr[i][j] << "\t";
		}
		cout << endl;
	}
	vector<array<array<vector<int>, 3>, 3>> vec;
	//慢慢剥洋葱即可
	array<array<vector<int>, 3>, 3> test;
	for (int i = 0; i < 3; i++) 
	{
		test[i] = vecArr;		//vecArr: array<vector<int>, 3>
	}
	vec.push_back(test);
	//从里到外一层层准备，最后插入到最外那层
	vector<array<array<vector<int>, 3>, 3>> test;
	//上面一行 等效下面两行
	using Data = array<array<vector<int>, 3>, 3>;
	vector<Data> test2;
 
	array<array<vector<int>, 3>, 3> test3;
	//上面一行 等效下面两行
	using Data2 = array<vector<int>, 3>;
	array<Data2, 3>  test3;
}
```
 

###  vector套array

main.cpp
```cpp
void testVectorVsArray() 
{
	vector<array<int, 3>> arrVec;
	array<int, 3>  arr[3] = { { 1,2,3 } , {1,2,3}, {1,2,3}};
	for (int i = 0; i < 3; i++) 
	{
		arrVec.push_back(arr[i]);
	}
	for (int i = 0; i < arrVec.size(); i++)
	{
		for (int j = 0; j < arrVec[i].size(); j++)
		{
			cout << arrVec[i][j] << "\t";
		}
		cout << endl;
	}
}
```
 