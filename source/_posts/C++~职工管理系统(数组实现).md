---
title: C++~职工管理系统(数组实现)
cover: /img/num61.webp
comments: false
tags:
  - 项目
categories:
  - C++学习笔记
abbrlink: 3840a23b
date: 2022-03-07 13:23:00
updated: 2022-06-08 23:54:48
---
## main.cpp


```cpp
# include <iostream>
using namespace std;
# include "staff.h"
# include "worker.h"
# include "common.h"
# include "manager.h"
# include "boss.h"
int main()
{
 
	//实例化管理者对象
	WorkerManager wm;
	
	int choice = 0;//存储用户的选项
	while (true)
	{
		//调用成员函数
		wm.Show_Menu();
		cout << "请输入你的选择" << endl;
		cin >> choice;
		switch (choice)
		{
		case 0:
			system("cls");
			wm.Exit();
			break;
		case 1:
			wm.Add_Emp();
			break;
		case 2:
			wm.Show_Emp();
			break;
		case 3:
			wm.Del_Emp();
			break;
		case 4:
			wm.Mod_Emp();
			break;
		case 5:
			wm.Find_Emp();
			break;
		case 6:
			wm.Sort_Emp();
			break;
		case 7:
			wm.Clean_Emp();
			break;
		default:
			system("cls");
			break;
		}
	}
	return 0;
}
```




##  staff.h

```cpp
# pragma once//防止头文件重复包含
# include <iostream>
# include <time.h>
# include <conio.h>
# include <windows.h>
# include <fstream>
# include "worker.h"
# include "common.h"
# include "manager.h"
# include "boss.h"
# define FILENAME "1.txt"
using namespace std;
 
class WorkerManager
{
public:
	//构造函数
	WorkerManager();
 
	//展示菜单
	void Show_Menu();
 
	//退出
	void Exit();
 
	//记录职工人数
	int m_EmpNum;
 
	//职工数组指针
	Worker **m_EmpArray;
 
	//添加职工
	void Add_Emp();
 
	//保存文件
	void Save();
 
	//判断文件是否为空 标志
	bool m_File;
 
	//统计文件中人数
	int get_EmpNum();
 
	//初始化员工
	void init_Emp();
 
	//显示职工信息
	void Show_Emp();
 
	//删除员工
	void Del_Emp();
 
	//判断员工是否存在（存在返回所在数组下标，不存在返回-1）
	int IsExist(int id);
 
	//修改职工
	void Mod_Emp();
 
	//查找职工
	void Find_Emp();
 
	//名字查找
	int Find_Name(string name);
 
	//判断编号是否已经存在相同,存在返回true 不存在返回false
	bool Find_Id(int id);
 
	//排序
	void Sort_Emp();
 
	//清空文件
	void Clean_Emp();
 
 
	//清空缓冲区等待按键
	void waitConfirm();
 
	//析构函数
	~WorkerManager();
};
```




##  staff.cpp

```cpp
# include "staff.h"
 
WorkerManager::WorkerManager()
{
	//1.文件不存在
	fstream ifs;
	ifs.open(FILENAME, ios::in);//读文件
	if (!ifs.is_open())
	{
		//初始化属性
		this->m_EmpNum = 0;
		this->m_EmpArray = NULL;
		//初始化文件是否为空
		this->m_File = true;
		ifs.close();
		return;
	}
 
	//2.文件存在，数据为空
	char ch;
	ifs >> ch;
	if (ifs.eof())//如果已到达流的结尾，则为 true，否则为 false
	{
		//初始化属性
		this->m_EmpNum = 0;
		this->m_EmpArray = NULL;
		//初始化文件是否为空
		this->m_File = true;
		ifs.close();
		return;
	}
 
	//3.文件存在并且有数据
	int num = this->get_EmpNum();
	this->m_EmpNum= num;//更新人数
	//开辟空间
	this->m_EmpArray = new Worker * [this->m_EmpNum];
	//将文件数据存到数组
	this->init_Emp();
	this->m_File = false;
}
 
int WorkerManager::get_EmpNum()
{
	fstream ifs;
	ifs.open(FILENAME, ios::in);
	int id;
	string name;
	int dId;
 
	int num = 0;
	while (ifs >> id && ifs >> name && ifs >> dId)
	{
		//统计人数
		num++;
	}
	ifs.close();
	return num;
}
 
void WorkerManager::waitConfirm()
{
		cout << "按任意键继续" << endl;
		rewind(stdin);//清空缓冲区
		getch();//不需要按下回车
}
 
void WorkerManager::Show_Menu()
{
	system("cls");
	cout << "*********************************************\
*       当前职工人数:"<<this->m_EmpNum<< endl;
	cout << "********   欢迎使用蓝羽职工管理系统   ********" << endl;
	cout << "*************   0.退出管理程序   *************" << endl;
	cout << "*************   1.增加职工信息   *************" << endl;
	cout << "*************   2.显示职工信息   *************" << endl;
	cout << "*************   3.删除离职职工   *************" << endl;
	cout << "*************   4.修改职工信息   *************" << endl;
	cout << "*************   5.查找职工信息   *************" << endl;
	cout << "*************   6.按照编号排序   *************" << endl;
	cout << "*************   7.清空所有文档   *************" << endl;
	cout << "**********************************************" << endl;
	cout << endl;
}
 
void WorkerManager::Exit()
{
	cout << "欢迎下次使用" << endl;
	exit(0);
}
 
void WorkerManager::Add_Emp()
{
	system("cls");
	cout << "请输入添加职工数量：" << endl;
	int addNum = 0;//保存用户的输入数量
	cin >> addNum;
	if (addNum > 0)
	{
		//添加
		//计算添加新空间大小
		int newSize = this->m_EmpNum + addNum;//新空间人数 =原来记录人数+新增人数
		
		//开辟新空间
		Worker** newSpace=new Worker* [newSize];
		//将原来空间下的数据拷贝到新空间上
		if (this->m_EmpArray != NULL)
		{
			for (int i = 0; i <this->m_EmpNum; i++)
			{
				newSpace[i] = this->m_EmpArray[i];
			}
		}
		while (1)
		{
			//批量添加新数据
			for (int i = 0; i < addNum; i++)
			{
				int id;//编号
				string name;//名字
				int dId;//部门选择
				cout << "请输入第" << i + 1 << "个新职工编号" << endl;
				cin >> id;
				while (true == Find_Id(id))
				{
					cout << "编号已存在，请重新输入！" << endl;
					Sleep(500);
					system("cls");
					cout << "请输入第" << i + 1 << "个新职工编号" << endl;
					cin >> id;
				}
				cout << "请输入第" << i + 1 << "个新职工姓名" << endl;
				cin >> name;
				Worker* worker = NULL;
				cout << "请选择该职工岗位" << endl;
				cout << "1.普通员工" << endl;
				cout << "2.经理" << endl;
				cout << "3.老板" << endl;
				cin >> dId;
				if (dId >= 1 && dId <= 3)
				{
					switch (dId)
					{
					case 1:
						worker = new Common(id, name, 1);
						break;
					case 2:
						worker = new Manager(id, name, 2);
						break;
					case 3:
						worker = new Boss(id, name, 3);
						break;
					}
					//将创建的职工保存到数组
					newSpace[this->m_EmpNum + i] = worker;
					system("cls");
				}
				else
				{
					cout << "请输入正确的部门选项" << endl;
					Sleep(500);
					system("cls");
					i--;
				}
			}
			break;
		}
		//释放原来空间
		delete[] this->m_EmpArray;
		//更改新空间的指向
		this->m_EmpArray = newSpace;
		//更新新职工的人数
		this->m_EmpNum = newSize;
		//提示添加成功
		cout << "成功添加" << addNum << "名新职工" << endl;
		this->m_File = false;
		this->Save();
		waitConfirm();
	}
	else
	{
		cout << "输入数据有误" << endl;
	}
}
 
void WorkerManager::Save()
{
	fstream ofs(FILENAME, ios::out);
	for (int i = 0; i < this->m_EmpNum; i++)
	{
		ofs << this->m_EmpArray[i]->m_Id << "\t"
			<< this->m_EmpArray[i]->m_Name <<"\t"
			<< this->m_EmpArray[i]->m_DeptId << endl;
	}
	ofs.close();
}
void WorkerManager::init_Emp()
{
	fstream ifs;
	ifs.open(FILENAME, ios::in);
	int id;
	string name;
	int dId;
	int index = 0;
	while (ifs >> id && ifs >> name && ifs >> dId)
	{
		Worker* worker = NULL;
		if (dId == 1)//普通员工
		{
			worker = new Common(id, name, dId);
		}
		else if (dId == 2)//经理
		{
			worker = new Manager(id, name, dId);
		}
		else if (dId == 3)//老板
		{
			worker = new Boss(id, name, dId);
		}
		this->m_EmpArray[index++] = worker;
	}
	ifs.close();
}
 
void WorkerManager::Show_Emp()
{
	system("cls");
	//判断文件是否为空
	if (this->m_File)
	{
		cout << "文件不存在或者记录为空！" << endl;
	}
	else
	{
		for (int i = 0; i < this->m_EmpNum; i++)
		{
			//利用多态调用程序接口
			this->m_EmpArray[i]->showInfo();
		}
	}
	waitConfirm();
}
 
void WorkerManager::Del_Emp()
{
	system("cls");
	int num = -1;
	cout << "请输入要删除的id:";
	cin >> num;
	int index = this->IsExist(num);
	if (index == -1)
	{
		cout << "查无此人！" << endl;
		waitConfirm();
	}
	else
	{
		cout << "找到了，是否删除(y/n)" << endl;
		char flag=0;
		cin >> flag;
		if ('y' == flag)
		{
			for (int i =index; i < this->m_EmpNum-1; i++)
			{
				this->m_EmpArray[i] = this->m_EmpArray[i + 1];
			}
			this->m_EmpNum--;
			cout << "删除成功！" << endl;
			this->Save();
			waitConfirm();
		}
		else
		{
			cout<<"取消删除"<<endl;
				waitConfirm();
		}
	}
}
int WorkerManager::IsExist(int id)
{
	int index = -1;
	for (int i = 0; i < this->m_EmpNum; i++)
	{
		if (this->m_EmpArray[i]->m_Id == id)
		{
			return i;
		}
	}
	return index;
}
 
void WorkerManager::Mod_Emp()
{
	system("cls");
	if (this->m_File)
	{
		cout << "文件不存在或者记录为空" << endl;
		waitConfirm();
	}
	else
	{
		cout << "请输入要修改职工的编号：" << endl;
		int id;
		cin >> id;
		int index = this->IsExist(id);
		if (index == -1)
		{
			cout << "查无此人！" << endl;
			waitConfirm();
		}
		else
		{
			int newid = 0;
			string newName = "";
			int newdId = 0;
			cout << "查到：" << id << "号职工，请输入新的职工编号：" << endl;
			cin >> newid;
			//这里注意新输入的编号可以是原本的
			while ((true == Find_Id(newid)) && (newid != this->m_EmpArray[index]->m_Id))
			{
				cout << "编号已存在，请重新输入！" << endl;
				Sleep(500);
				system("cls");
				cout <<"请输入新的职工编号：" << endl;
				cin >> newid;
			}
			cout<< "请输入新名字：" << endl;
			cin >> newName;
			cout << "请选择该职工岗位" << endl;
			cout << "1.普通员工" << endl;
			cout << "2.经理" << endl;
			cout << "3.老板" << endl;
			cin >> newdId;
			if (newdId >= 1 && newdId <= 3)
			{
				delete this->m_EmpArray[index];
				Worker* worker = NULL;
				switch (newdId)
				{
				case 1:
					worker = new Common(newid, newName, 1);
					break;
				case 2:
					worker = new Manager(newid, newName, 2);
					break;
				case 3:
					worker = new Boss(newid, newName, 3);
					break;
				}
				this->m_EmpArray[index] = worker;//更新数据到数组
				this->Save();
				cout << "修改成功！" << endl;
				waitConfirm();
			}
			else
			{
				cout << "修改失败！请输入正确的部门选项" << endl;
				waitConfirm();
			}
 
		}
	}
}
 
void WorkerManager::Find_Emp()
{
	system("cls");
	if (this->m_File)
	{
		cout << "文件不存在或者文件为空！"<<endl;
		waitConfirm();
		return;
	}
	cout << "请选择要查找的方式："<<endl;
	cout << "    1.按编号查找    " << endl;
	cout << "    2.按姓名查找    " << endl;
	int flag = 0;
	cin >> flag;
	if (flag == 1)
	{
		cout << "请输入要查找的职工编号：" << endl;
		int id = 0;
		cin >> id;
		int index = this->IsExist(id);
		if (index == -1)
		{
			cout << "查无此人！" << endl;
		}
		else
		{
			this->m_EmpArray[index]->showInfo();
		}
		waitConfirm();
	}
	else if (flag == 2)
	{
		cout << "请输入要查找的姓名："<<endl;
		string name;
		cin >> name;
		if (!Find_Name(name))
		{
			cout << "查无此人！" << endl;
			waitConfirm();
		}
		else
			waitConfirm();
	}
	else
	{
		cout << "输入选项错误" << endl;
		waitConfirm();
	}
}
 
int WorkerManager::Find_Name(string name)
{
	int flag = 0;
	for (int i = 0; i < this->m_EmpNum; i++)
	{
		if (this->m_EmpArray[i]->m_Name == name)
		{
			cout << "查找成功，";
			this->m_EmpArray[i]->showInfo();
			flag = 1;
		}
	}
	return flag;
}
 
bool WorkerManager::Find_Id(int id)
{
	for (int i = 0; i < this->m_EmpNum; i++)
	{
		if ((this->m_EmpArray[i]->m_Id) == id)
			return true;
	}
	return false;
}
 
void WorkerManager::Sort_Emp()
{
	system("cls");
	if (this->m_File)
	{
		cout << "文件不存在或者文件记录为空" << endl;
		waitConfirm();
	}
	else
	{
		cout << " 请选择排序方式: " << endl;
		cout << "  1.按编号升序  " << endl;
		cout << "  2.按编号降序  " << endl;
		int num = 0;
		cin >> num;
		for (int i = 0; i < this->m_EmpNum; i++)
		{
			int minOrmax = i;
			for (int j = i + 1; j < this->m_EmpNum; j++)
			{
				if (1 == num)
				{
					//升序
					if (this->m_EmpArray[minOrmax]->m_Id > this->m_EmpArray[j]->m_Id)
					{
						minOrmax = j;
					}
				}
				else if (2 == num)
				{
					//降序
					if (this->m_EmpArray[minOrmax]->m_Id < this->m_EmpArray[j]->m_Id)
					{
						minOrmax = j;
					}
				}
				else
				{
					cout << "请输入正确的选项！" << endl;
					waitConfirm();
					return;
				}
			}
			if (i != minOrmax)
			{
				Worker* temp = this->m_EmpArray[i];
				this->m_EmpArray[i] = this->m_EmpArray[minOrmax];
				this->m_EmpArray[minOrmax] = temp;
			}
		}
		this->Save();
		this->Show_Emp();
	}
}
 
void WorkerManager::Clean_Emp()
{
	system("cls");
	cout << "确定要清空?(y/n)" << endl;
	char ch ='\0';
	cin >> ch;
	if ('y' == ch || 'Y' == ch)
	{
		fstream ofs(FILENAME, ios::trunc);//删除文件后重新创建
		ofs.close();
		if (this->m_EmpArray != NULL)
		{
			//删除堆区每个职工对象
			for (int i = 0; i < this->m_EmpNum; i++)
			{
				delete this->m_EmpArray[i];
				this->m_EmpArray[i] = nullptr;
			}
		}
		//删除堆区数组指针
		delete[] this->m_EmpArray;
		this->m_EmpArray = nullptr;
		this->m_EmpNum = 0;
		this->m_File = true;
		this->Save();
		cout << "清空成功！" << endl;
		waitConfirm();
	}
	else
	{
		cout << "取消清空"<<endl;
		waitConfirm();
	}
}
 
WorkerManager::~WorkerManager()
{
	if (this->m_EmpArray != NULL)
	{
		delete[] this->m_EmpArray;
		this->m_EmpArray = nullptr;
	}
}
```


##  worker.h

```cpp
# pragma once
# include <iostream>
using namespace std;
# include <string>
 
//职工抽象类
class Worker
{
public:
	//显示个人信息
	virtual void showInfo() = 0;
	//获取岗位名称
	virtual string getDeptName() = 0;
 
	//编号
	int m_Id;
	//姓名
	string m_Name;
	//部门编号
	int m_DeptId;
 
};
```



##  common.h(普通员工类)

```cpp
# pragma once
# include <iostream>
using namespace std;
# include "worker.h"
 
//普通员工类
class Common:public Worker
{
public:
	//构造函数
	Common(int id,string name,int dId);
	//显示个人信息
	virtual void showInfo();
	//获取岗位名称
	virtual string getDeptName();
 
};
```




## Common.cpp(普通员工类实现)

```cpp
# include "common.h"
 
//构造函数
Common::Common(int id, string name, int dId)
{
	//初始化自身
	this->m_Id = id;
	this->m_Name = name;
	this->m_DeptId = dId;
}
//显示个人信息
void Common::showInfo()
{
	cout << "职工编号:" << this->m_Id
		<< "\t" << "职工姓名:" << this->m_Name
		<< "\t" << "职工岗位:" << this->getDeptName() 
		<<"\t职责:完成经理交给的任务" << endl;
}
//获取岗位名称
string Common::getDeptName()
{
	return string("员工");
}
```




##  manager.h(经理类)

```cpp
# pragma once
# include <iostream>
using namespace std;
# include "worker.h"
 
//经理类
class Manager:public Worker
{
public:
	Manager(int id, string name, int dId);
	//显示个人信息
	virtual void showInfo();
	//获取岗位名称
	virtual string getDeptName();
};
```




##  manager.cpp(经理类实现)

```cpp
# include "manager.h"
 
Manager::Manager(int id, string name, int dId)
{
	this->m_Id = id;
	this->m_Name = name;
	this->m_DeptId = dId;
}
//显示个人信息
void Manager::showInfo()
{
	cout << "职工编号:" << this->m_Id
		<< "\t" << "职工姓名:" << this->m_Name
		<< "\t" << "职工岗位:" << this->getDeptName()
		<< "\t职责:完成老板交给的任务" << endl;
}
//获取岗位名称
string Manager::getDeptName()
{
	return string("经理");
}
```




##  boss.h(老板类)

```cpp
# pragma once
# include "worker.h"
 
//老板类
class Boss :public Worker
{
public:
	Boss(int id, string name, int dId);
	//显示个人信息
	virtual void showInfo();
	//获取岗位名称
	virtual string getDeptName();
};
```




##  boss.cpp(老板类实现)

```cpp
# include "boss.h"
 
Boss::Boss(int id, string name, int dId)
{
	this->m_Id = id;
	this->m_Name = name;
	this->m_DeptId = dId;
}
//显示个人信息
void Boss::showInfo()
{
	cout << "职工编号:" << this->m_Id
		<< "\t" << "职工姓名:" << this->m_Name
		<< "\t" << "职工岗位:" << this->getDeptName()
		<< "\t职责:在家数钱" << endl;
}
//获取岗位名称
string Boss::getDeptName()
{
	return string("老板");
}
```


##  运行截图

{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbgwqZ6.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2Fbgw7s1.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbgwLdK.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbgwTMR.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbgwHqx.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbgwOIO.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbgwjiD.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbgwvJe.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbgwxRH.png)
{% endgallery %}