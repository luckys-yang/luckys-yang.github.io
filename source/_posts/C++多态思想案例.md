---
title: C++多态思想案例
cover: /img/num24.webp
comments: false
tags:
  - C++多态
categories:
  - C++学习笔记
abbrlink: b0d76ba4
date: 2022-03-08 17:10:00
updated: 2022-06-03 18:40:44
---

{% note blue 'fas fa-fan' flat %}C++多态(电脑组装){% endnote %}

main.cpp

```cpp
# include <iostream>
# include <string>
using namespace std;
//抽象不同零件类
//抽象CPU类
class CPU
{
public:
	//抽象的计算函数
	virtual void calculate() = 0;
};
//抽象显卡类
class VideoCard
{
public:
	//抽象的显示函数
	virtual void display() = 0;
};
//抽象内存条类
class Memory
{
public:
	//抽象的存储函数
	virtual void storage() = 0;
};
 
//电脑类
class Computer
{
public:
	Computer(CPU* cpu, VideoCard* vc, Memory* mem):cpu(cpu),vc(vc),mem(mem){}
	//提供工作的函数
	void work()
	{
		//让零件工作起来调用接口
		cpu->calculate();
		vc->display();
		mem->storage();
	}
	~Computer()
	{
		if (cpu != nullptr)
		{
			delete cpu;
			cpu = nullptr;
			cout << "虚析构CPU" << endl;
		}
		 if (vc != nullptr)
		{
			delete vc;
			vc = nullptr;
			cout << "虚析构VC" << endl;
		}
		if (mem != nullptr)
		{
			delete mem;
			mem = nullptr;
			cout << "虚析构Mem" << endl;
		}
	}
protected:
	CPU* cpu;//CPU零件
	VideoCard* vc;//显卡零件
	Memory* mem;//内存条零件
};
 
//具体厂商
//Intel
class IntelCPU:public CPU
{
public:
	virtual void calculate()
	{
		cout << "Intel的CPU开始计算了" << endl;
	}
};
class IntelVC :public VideoCard
{
public:
	virtual void display()
	{
		cout << "Intel的显卡开始显示了" << endl;
	}
};
class IntelMem:public Memory
{
public:
	virtual void storage()
	{
		cout << "Intel的内存条开始储存了" << endl;
	}
};
//Lenovo
class LenovoCPU :public CPU
{
public:
	virtual void calculate()
	{
		cout << "Lenovo的CPU开始计算了" << endl;
	}
};
class LenovoVC :public VideoCard
{
public:
	virtual void display()
	{
		cout << "Lenovo的显卡开始显示了" << endl;
	}
};
class LenovoMem :public Memory
{
public:
	virtual void storage()
	{
		cout << "Lenovo的内存条开始储存了" << endl;
	}
};
void test()
{
	//创建电脑
	cout << "电脑1：" << endl;
	CPU* intelCpu = new IntelCPU;
	VideoCard* intelCard = new IntelVC;
	Memory* intelMem = new IntelMem;
	Computer* computer1 = new Computer(intelCpu, intelCard, intelMem);
	computer1->work();
	delete computer1;
	cout<< "--------------------------" << endl;
	cout << "电脑2："<<endl;
	computer1 = new Computer(new LenovoCPU, new LenovoVC, new LenovoMem);
	computer1->work();
	delete computer1;
	computer1 = nullptr;
}
 
int main()
{
	test();
	
	return 0;
}
```



![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbgtkIH.png)

C++多态(计算加减乘除例子)

普通写法：

main.cpp

```cpp
# include <iostream>
# include <string>
using namespace std;
//普通写法
class Counter
{
public:
	int Count(string symbol)
	{
		if (symbol == "+")
		{
			return num1 + num2;
		}
		else if (symbol == "-")
		{
			return num1 - num2;
		}
		else if (symbol == "*")
		{
			return num1 * num2;
		}
		else if (symbol == "/");
		{
			return num1 / num2;
		}
        //如果想扩展新功能，需要修改源码
        //在真实开发中提倡  开闭原则
        //开闭原则：对扩展进行开放，对修改进行关闭
	}
	int& getNum1()
	{
		return num1;
	}
	int& getNum2()
	{
		return num2;
	}
	
protected:
	int num1;
	int num2;
};
void test1()
{
	Counter c;
	c.getNum1() = 10;
	c.getNum2() = 20;
	cout << c.getNum1() << "+" << c.getNum2() << "=" << c.Count("+") << endl;
	cout << c.getNum1() << "-" << c.getNum2() << "=" << c.Count("-") << endl;
	cout << c.getNum1() << "*" << c.getNum2() << "=" << c.Count("*") << endl;
	cout << c.getNum1() << "/" << c.getNum2() << "=" << c.Count("/") << endl;
}
int main()
{
	test1();
 
 
 
	return 0;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbgYCNj.png)

多态写法：

main.cpp

```cpp
# include <iostream>
# include <string>
using namespace std;

/*
多态好处：
- <font color='orange'>组织结构清晰</font>
- <font color='orange'>可读性强</font>
- <font color='orange'>对于前期和后期扩展以及维护性高</font>
*/

//多态
//实现计算器抽象类
class Counter
{
public:
	virtual int count()
	{
		return 0;
	}
	
	int& getNum1()
	{
		return num1;
	}
	int& getNum2()
	{
		return num2;
	}
	
protected:
	int num1;
	int num2;
};
//加法
class Add :public Counter
{
public:
	int count()
	{
		return getNum1()+getNum2();
	}
};
//减法
class Sub :public Counter
{
public:
	int count()
	{
		return getNum1() - getNum2();
	}
};
//乘法
class Mul :public Counter
{
public:
	int count()
	{
		return getNum1() * getNum2();
	}
};
//除法
class Mod :public Counter
{
public:
	int count()
	{
		return getNum1() / getNum2();
	}
};
 
void test()
{
	//多态使用条件
	//父类指针或者引用指向子类对象
	//加法
	Counter* abc = new Add;
	abc->getNum1() = 10;
	abc->getNum2() = 20;
	cout << abc->getNum1() << "+" << abc->getNum2() << "=" << abc->count() << endl;
	delete abc;
	//减法
	abc = new Sub;
	abc->getNum1() = 30;
	abc->getNum2() = 10;
	cout << abc->getNum1() << "-" << abc->getNum2() << "=" << abc->count() << endl;
    delete abc;
	//乘法
	abc = new Mul;
	abc->getNum1() = 40;
	abc->getNum2() = 30;
	cout << abc->getNum1() << "*" << abc->getNum2() << "=" << abc->count() << endl;
    delete abc;
	//除法
	abc = new Mod;
	abc->getNum1() = 64;
	abc->getNum2() = 8;
	cout << abc->getNum1() << "/" << abc->getNum2() << "=" << abc->count() << endl;
    delete abc;
}
int main()
{
	test();
	return 0;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbgYSHg.png)

C++多态思想(制作饮品)

main.cpp

```cpp
# include <iostream>
# include <string>
using namespace std;
 
class Drink
{
public:
	//煮水
	virtual void Boil() = 0;
	//冲泡
	virtual void Brew() = 0;
	//倒入杯子
	virtual void PutInCap() = 0;
	//加入辅料
	virtual void Accessory() = 0;
	//制作饮品
	virtual void MakeDrink()
	{
		Boil();
		Brew();
		PutInCap();
		Accessory();
	}
};
//制作咖啡
class Coffee :public Drink
{
public:
	//煮水
	virtual void Boil()
	{
		cout << "煮农夫山泉" << endl;
	}
	//冲泡
	virtual void Brew()
	{
		cout << "冲泡咖啡" << endl;
	}
	//倒入杯子
	virtual void PutInCap()
	{
		cout << "倒入杯子" << endl;
	}
	//加入辅料
	virtual void Accessory()
	{
		cout << "加入糖和牛奶" << endl;
	}
};
//制作茶
class Tea :public Drink
{
public:
	//煮水
	virtual void Boil()
	{
		cout << "煮开水" << endl;
	}
	//冲泡
	virtual void Brew()
	{
		cout << "冲泡茶叶" << endl;
	}
	//倒入杯子
	virtual void PutInCap()
	{
		cout << "倒入茶壶" << endl;
	}
	//加入辅料
	virtual void Accessory()
	{
		cout << "加入辣椒粉" << endl;
	}
};
//制作函数
void doWork(Drink* object)
{
	object->MakeDrink();
	delete object;
}
void test()
{
	//制作咖啡
	doWork(new Coffee);
	//制作茶
	cout << endl;
	doWork(new Tea);
}
int main()
{
	test();
	
	return 0;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbgthwD.png)

C++模板--数组排序，数组类封装

数组排序：利用模板将char类型数组和int类型数组进行排序


main.cpp

```cpp
# include <iostream>
# include <string>
# include <fstream>//包含头文件
using namespace std;
/*
	实现通用 对数组进行排序的函数
	规则：从大到小
	算法：选择排序
	测试：char数组、int数组
*/
 
//元素交换模板
template<typename T>
void mySwap(T& a, T& b)
{
	T temp = a;
	a = b;
	b = temp;
}
 
//数组排序模板
template<typename T>
void mySort(T arr[], int len)
{
	for (int i = 0; i < len; i++)
	{
		int max = i;
		for (int j = i + 1; j < len; j++)
		{
			if (arr[j] > arr[max])
			{
				max = j;
			}
		}
		//交换
		if (i != max)
		{
			mySwap(arr[max], arr[i]);
		}
	}
}
 
//打印数组模板
template<typename T>
void print(T arr[],int len)
{
	for (int i = 0; i < len; i++)
	{
		cout << arr[i] << "\t";
	}
	cout << endl;
}
void test1()
{
	//测试char数组
	char charArr[] = "aabcdef";
	int len = sizeof(charArr) / sizeof(charArr[0]);
	mySort(charArr, len);
	print(charArr, len);
}
 
void test2()
{
	//测试int数组
	int intArr[] = { 1,1,2,4,5,8,7,3 };
	int len = sizeof(intArr) / sizeof(intArr[0]);
	mySort(intArr, len);
	print(intArr, len);
}
 
int main()
{
	test1();
	test2();
	return 0;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2Fbg4kGR.png)

数组类封装：

{% note red 'fas fa-fan' flat %}注意{% endnote %}

C++ 模板不能把源文件和声明文件分开成两个文件

Myarray.hpp
```cpp
# pragma once
# include <iostream>
# include <string>
using namespace std;
 
template<class T>
class MyArray
{
public:
 
	//有参构造  参数 容量
	MyArray(int capacity)
	{
		this->m_Capacity = capacity;
		this->m_size = 0;
		this->pAddress = new T[this->m_Capacity];
	}
 
	//拷贝构造
	MyArray(const MyArray& arr)
	{
		this->m_Capacity = arr.m_Capacity;
		this->m_size = arr.m_size;
		//this->pAddress = arr.pAddress;//错误，这是浅拷贝
		this->pAddress = new T[arr.m_Capacity];
		//将arr中的数据也拷贝过去
		for (int i = 0; i < this->m_size; i++)
		{
			this->pAddress[i] = arr.pAddress[i];
		}
	}
 
	//operator= 防止浅拷贝
	MyArray& operator=(const MyArray& arr)
	{
		//先判断原来堆区是否有数据，如果有先释放
		if (this->pAddress != nullptr)
		{
			delete[] this->pAddress;
			pAddress = nullptr;
		}
		//深拷贝
		this->m_Capacity = arr.m_Capacity;
		this->m_size = arr.m_size;
		this->pAddress = new T[arr.m_Capacity];
		for (int i = 0; i < this->m_size; i++)
		{
			this->pAddress[i] = arr.pAddress[i];
		}
		return *this;
	}
 
	//尾插法
	void Push(const T& val)
	{
		//判断容量是否等于大小
		if (this->m_Capacity == this->m_size)
			return;
		this->pAddress[this->m_size] = val;
		this->m_size++;
	}
 
	//尾删
	void Pop()
	{
		//让用户访问不到最后一个元素
		if (this->m_size == 0)
			return;
		this->m_size--;
	}
 
	//通过下标访问数组元素
	T& operator[](int index)//返回&引用就是可修改的左值，例如：arr[1]=8;
	{
		return this->pAddress[index];
	}
 
	//返回容量大小
	int getCapacity()
	{
		return this->m_Capacity;
	}
 
	//返回数组大小
	int getSize()
	{
		return this->m_size;
	}
 
	//析构
	~MyArray()
	{
		if (this->pAddress == nullptr)
		{
			delete[] pAddress;
			pAddress = nullptr;
		}
	}
 
protected:
	T* pAddress;//指针指向堆区开辟的真实数组
	int m_Capacity;//数组容量
	int m_size;//数组大小
};
```

main.cpp

```cpp
# include <iostream>
# include <string>
# include "Myarry.hpp"
using namespace std;
 
template<class T>
void print(MyArray<T>& arr)
{
	for (int i = 0; i < arr.getSize(); i++)
	{
		cout << arr[i] << "\t";
	}
	cout << endl << "arr容量：" << arr.getCapacity() << endl;
	cout << "arr大小：" << arr.getSize() << endl << endl;
}
void test()
{
	MyArray<int>arr1(16);
	for (int i = 0; i <6; i++)
	{
		arr1.Push(i);//头插
	}
	arr1[0] = 999;
 
	MyArray<int>arr2(arr1);
 
	MyArray<int>arr3(2);
 
	arr3 = arr1;
 
	arr3.Pop();
 
	print(arr1);
	print(arr2);
	cout << "arr3尾删后："<<endl;
	print(arr3);
}
 
//测试自定义数据类型
class Person
{
public:
	Person() {}
	Person(string name, int age) :name(name), age(age) {}
	//重载<<
	friend ostream& operator<<(ostream& out, Person& p)
	{
		cout << p.name <<" " << p.age<<"\t";
		return out;
	}
	string name;
	int age;
};
 
void test2()
{
	MyArray<Person>arr4(4);
	Person p1("张三", 77);
	Person p2("李四", 66);
	Person p3("王五", 22);
	Person p4("傻六", 33);
 
	//将数据插入数组
	arr4.Push(p1);
	arr4.Push(p2);
	arr4.Push(p3);
	arr4.Push(p4);
	print(arr4);
	arr4.Pop();
	cout << "arr4尾删后："<<endl;
	print(arr4);
}
 
int main()
{
	test();
	test2();
	return 0;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2Fbg4AR1.png)