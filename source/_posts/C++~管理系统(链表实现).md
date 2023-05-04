---
title: C++~管理系统(链表实现)
cover: /img/num62.webp
comments: false
tags:
  - 项目
categories:
  - C++学习笔记
abbrlink: cbb87b87
date: 2022-03-08 18:05:00
updated: 2022-06-08 23:59:20
---
##  node.h

```cpp
# pragma once
class MM;
//存放数据
class Node
{
public:
	Node();
	Node(MM* data);
	Node(MM* data, Node* next);
	Node*& getNext();//接口
	MM*& getData();//接口
protected:
	MM *data;
	Node* next;
};
 
```
 




##  node.cpp


```cpp
# include "node.h"
# include "mm.h"
Node::Node()
{
    //初始化
	this->next = nullptr;
}
 
Node::Node(MM* data)
{
    //初始化
	this->data = data;
	this->next = nullptr;
}
 
Node::Node(MM* data, Node* next)
{
    //初始化
	this->data = data;
	this->next = next;
}
 
Node*& Node::getNext()
{
	return next;
}
 
MM*& Node::getData()
{
	return data;
}
```
 




## list.h

```cpp
# pragma once
# include "mm.h"
# include <conio.h>
class Node;//声明
 
class list
{
public:
	list();
	void insertList(MM* data);//头插
	void printList();//打印
	void deleteAppoin(string posData);//删除指定数据
	Node* searchByData(string posData);//查找
	void wait();//按任意键继续
	void saveListToFile(const char* fileName);//保存到文件
	void readFileTpList(const char* fileName);//从文件中读取
protected:
	Node* headNode;//头节点
	int curSize;//链表长度
};
```
 




##  list.cpp

```cpp
# include "list.h"
# include "node.h"
# include <iostream>
using namespace std;
 
list::list()
{
	this->headNode = nullptr;
	this->curSize = 0;
}
 
void list::insertList(MM* data)
{
	headNode = new Node(data, headNode);//表头插入
	this->curSize++;
}
 
void list::printList()
{
	Node* pMove = headNode;
	if (pMove == nullptr)
	{
		cout << "暂无数据" << endl;
		return;
	}
	while (pMove != nullptr)
	{
		pMove->getData()->printMM();
		pMove = pMove->getNext();
	}
}
 
void list::deleteAppoin(string posData)
{
	Node* preNode = headNode;
	Node* curNode = headNode;
	while (curNode != nullptr && curNode->getData()->getName() != posData)
	{
		preNode = curNode;
		curNode = curNode->getNext();
	}
	if (curNode == nullptr)
	{
		cout << "查无此人" << endl;
		wait();
	}
	else if (curNode == preNode)//删除的是表头
	{
		Node* nextNode = curNode->getNext();
		delete headNode;
		headNode = nextNode;
		this->curSize--;
		cout << "删除成功！" << endl;
		this->saveListToFile(FILENAME);//保存到文件
		wait();
	}
	else
	{
		preNode->getNext() = curNode->getNext();
		delete curNode;
		curNode = nullptr;
		this->curSize--;
		cout << "删除成功！" << endl;
		this->saveListToFile(FILENAME);//保存到文件
		wait();
	}
}
 
void list::wait()
{
	rewind(stdin);
	getch();
}
 
void list::saveListToFile(const char* fileName)
{
	Node* pMove = headNode;
	fstream save(fileName, ios::out);
	while (pMove != nullptr)
	{
		pMove->getData()->saveFile(save);
		pMove = pMove->getNext();
	}
	save.close();
	cout << "保存成功" << endl;
}
 
void list::readFileTpList(const char* fileName)
{
	fstream read(fileName, ios::in);
	while (1)
	{
		//每次都要new一个对象，因为有指针
		MM* mm = new MM;
		mm->readFile(read);
		if (read.eof())//因为是头插，读到最后会多读所以要判断
			break;
		insertList(mm);
	}
	read.close();
}
 
Node* list::searchByData(string posData)
{
	Node* pMove = headNode;
	while (pMove != nullptr && pMove->getData()->getName() != posData)
	{
		pMove = pMove->getNext();
	}
	if (pMove == nullptr)
	{
		return nullptr;
	}
	else
		return pMove;
}
```
 




##  mm.h

```cpp
# pragma once
# include <iostream>
# include <string>
# include <fstream>
using namespace std;
# define FILENAME "1.txt"
class MM
{
public:
	MM(string name, int age, string tel, string sex);
	MM();
	void printMM();
	void saveFile(fstream& file);//保存流操作
	void readFile(fstream& file);//读取流操作
	string& getName();//接口
	int& getAge();//接口
	string& getTel();//接口
	string& getSex();//接口
protected:
	string name;
	int age;
	string tel;
	string sex;
};
```
 




##  mm.cpp

```cpp
# include "mm.h"
 
MM::MM(string name, int age, string tel, string sex)
{
	this->name = name;
	this->age = age;
	this->tel = tel;
	this->sex = sex;
}
 
void MM::printMM()
{
	cout << "姓名：" << this->name
		<< "\t" << "年龄：" << this->age
		<< "\t" << "电话：" << this->tel
		<< "\t" << "性别：" << this->sex << endl;
}
 
void MM::saveFile(fstream& file)
{
	file << name<< "\t"
		<< age << "\t" << tel << "\t" << sex << endl;
}
 
void MM::readFile(fstream& file)
{
	file >> name>> age >> tel>> sex;
}
 
string& MM::getName()
{
	return name;
}
 
int& MM::getAge()
{
	return age;
}
 
string& MM::getTel()
{
	return tel;
}
 
string& MM::getSex()
{
	return sex;
}
 
MM::MM()
{
	
}
```
 




##  system.h

```cpp
# pragma once
# include "list.h"
# include "node.h"
class MMsystem
{
public:
	MMsystem();
	void MakeMenu();
	void KeyDown();
protected:
	list* pList;
};
```
 




##  system.cpp

```cpp
# include "system.h"
MMsystem::MMsystem():pList(new list)
{
	pList->readFileTpList(FILENAME);
}
 
void MMsystem::MakeMenu()
{
	cout << "------------------【MM管理系统】---------------------" << endl;
	cout << "***************0.退出系统***************" << endl;
	cout << "***************1.插入系统***************" << endl;
	cout << "***************2.删除系统***************" << endl;
	cout << "***************3.查找系统***************" << endl;
	cout << "***************4.修改系统***************" << endl;
	cout << "***************5.浏览系统***************" << endl;
	cout << "-----------------------------------------------------" << endl;
}
 
void MMsystem::KeyDown()
{
	int userKey = 0;
	Node* p;
	string name;
	int age;
	string tel;
	string sex;
		cin >> userKey;
		switch (userKey)
		{
		case 0:
			exit(0);
			break;
		case 1:
			cout << "input: \tname\tage\ttel\tsex" << endl;
			rewind(stdin);
			cin >> name >> age >> tel >> sex;
			pList->insertList(new MM(name, age, tel, sex));
			cout << "添加成功" << endl;
			pList->wait();
			pList->saveListToFile(FILENAME);
			break;
		case 2:
			cout << "input delete name:" << endl;
			rewind(stdin);
			cin >> name;
			pList->deleteAppoin(name);
			break;
		case 3:
		{
			cout << "Please input the name you want to change:" << endl;
			rewind(stdin);
			cin >> name;
			p=(pList->searchByData(name));
			if (p!= nullptr)
			{
				cout << "找到了" << endl;
				p->getData()->printMM();
				pList->wait();
			}
			else
			{
				cout << "查无此人" << endl;
				pList->wait();
			}
			break;
		}
		case 4:
			cout << "Please input the name you want to modify:" << endl;
			rewind(stdin);
			cin >> name;
			p = (pList->searchByData(name));
			if (p != nullptr)
			{
				cout << "input the new message:" << endl;
				cout << "input: \tname\tage\ttel\tsex" << endl;
				rewind(stdin);
				cin >> p->getData()->getName();
				cin >> p->getData()->getAge();
				cin >> p->getData()->getTel();
				cin >> p->getData()->getSex();
				cout << "修改成功！" << endl;
				pList->saveListToFile(FILENAME);
				pList->wait();
			}
			else
			{
				cout << "查无此人！" << endl;
				pList->wait();
			}
			break;
		case 5:
			pList->printList();
			pList->wait();
			break;
		default:
			break;
		}
}
 
```
 




## main.cpp

```cpp
# include <iostream>
# include <string>
# include "list.h"
# include "mm.h"
# include"system.h"
using namespace std;
 
int main()
{
	MMsystem* pSystem = new MMsystem;
	while (1)
	{
		pSystem->MakeMenu();
		pSystem->KeyDown();
		system("cls");
	}
	return 0;
}
```
 




##  运行截图

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2Fbgsd3D.png)
