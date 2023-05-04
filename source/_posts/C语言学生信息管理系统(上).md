---
title: C语言学生信息管理系统(上)
cover: /img/num66.webp
comments: false
tags:
  - 项目
categories:
  - C语言学习笔记
abbrlink: b217f87f
date: 2022-02-14 15:30:00
updated: 2022-06-09 00:30:08
---
##  声明函数

```cpp
# pragma once
 
void writeLogFile(char* buf);
void HideCursor();
struct Node* creatlist();//创建表头
struct Node* createNode(struct student data);//创建结点
void insertByHead(struct Node* headNode, struct student data);//头插
void waitConfirm();//清空缓冲区，等待按下
void menu();//打印表格菜单
void init();//设置控制台窗口
struct student inputINfo();//输入学生信息
struct Node* find_Name_2(struct Node* headNode, char* name);//单纯找名字，找到返回指针
int find_Name_3(struct Node* headNode, char* name);//找名字，找到返回名字的个数
struct Node* modifi_find_Name(struct Node* headNode, char* name);//修改功能里的找名字找到并且打印
int find_Grade(struct Node* headNode, char* grade);//找班级
void showPage(int startIndex, int endIndex, int num1, int num2);//显示页码
void show(int num1, int num2);//显示主函数
void bubble_sort_ID();//学号排序
void showPage2(char* str, char c);//显示页码2
void show2(int k, char* ss, char c);//显示2主函数
int searchStu_Num(struct Node* headNode, double num);//找学生学号
struct Node* find_ID(struct Node* headNode, struct student s);//找学生学号
bool save();//保存主函数
void save_judge();//保存判断
bool judge_grade_sex(struct student move);//输入的班级性别成绩是否正规判断
void input();//输入主函数
void del();//删除主函数
void interpos();//插入主函数
void modifi();//修改主函数
void find_information();//查找信息主函数
void bubble_sort_sum(struct Node* posNodeFront, struct Node* p2Move);//总成绩冒泡排序
void score_rank();//总成绩主函数
bool stat_RSA();//统计算法
void subject_mean();//科目平均分
void stat();//统计主函数
void login();//登陆界面
void landing();//登陆
void SetCursorPosition(int x,int y);//获取光标位置
struct U_Node* find_Account(struct U_Node* headNode, struct User s);//找账号
struct U_Node* find_Password(struct U_Node* headNode, struct User s);//找密码
void Register();//注册
bool permission();//权限
bool save_user();//保存
void Admin_interface();
```
 




## 头文件，预处理，全局变量   

```cpp
# include <stdio.h>
# include <string.h>
# include <stdlib.h>
# include <conio.h>
# include <stdbool.h>
# include <windows.h>
# include <time.h>
# include <assert.h>
# include"tablePrint.h"
# include"StudentSystem.h"
 
# define EVERY_PAGE_BOX 10//每页10个
# define LOGFILENAME "Log.txt"//日志文件存储文件
# define EXEDATA  "data.txt"//用户数据存储文件
# define USERINFO "userdata.txt"//用户信息存储文件
# define LOGIN_MAX  1//每次程序运行只能注册一个用户
struct Node* list;
struct U_Node* List;
int count = 0;//找学生名字计数
int login_max = LOGIN_MAX;
int Student_Num = 0;//学生数量
int User_Num = 0;//用户数量
bool Administrator =false;//管理员权限
bool Teacher = false;//老师权限
bool Student = false;//学生权限
char head[][COL_LEN_MAX] = {
	"学号","班级","姓名","性别","数学","C语言","英语","总分"
};
 
char hea[][COL_LEN_MAX] = {
	"班级","数学合格人数","英语合格人数","C语言合格人数","班级人数","班人数"
};
 
char he[][COL_LEN_MAX] = {
	"总人数","男生","女生"
};
 
char Admin[][COL_LEN_MAX] = {
	"类型","姓名","认证码","账号","密码"
};
```
 


## main函数   

```cpp
int main()
{
	
	SetConsoleTitle("学生信息管理系统");//标题
	List = Createlist();
	Import_data();
	login();
	srand((unsigned int)time(NULL));
	init();
	//选择菜单
	int choice = -1;
	scanf("%d", &choice);
	while (1)
	{
		switch (choice)
		{
		case 1:
		{
			if (permission())
			{
				input(); break;//输入
			}
			break;
			
		}
		case 2:
		{
			if (permission())
			{
				del(); break;//删除
			}
			break;
		}
		case 3:
		{
			if (permission())
			{
				interpos(); break;//插入
			}
			break;
		}
		case 4:find_information(); break;//查找
		case 5:
		{
			if (permission())
			{
				modifi(); break;//修改
			}
			break;
		}
		case 6:score_rank(); break;//成绩排名
		case 7:stat(); break;//统计
		case 8:
		{
			bubble_sort_ID();
			system("color 02");
			show(2,8); break;//显示
		}
		case 0:
			if (!save())
			{
				system("color 0c");
				printf("保存失败！");
				exit(-1);
			}
			else
			{
				Student = false;
				Teacher = false;
				Administrator = false;
				login_max = 0;
				system("color 0a");
				printf("保存成功\n");
				for (int i = 3; i >=0; i--)
				{
					printf("还有%d秒返回登录界面...", i);
					Sleep(1000);
				}
				login();
			}		
		default:break;
		}
		waitConfirm();
		menu();
		rewind(stdin);
		scanf("%d", &choice);
	}
	system("pause");
	return 0;
}
```
 


##  登录界面   

```cpp
//登录界面
void login()
{
	char cmd2[50];
	sprintf(cmd2, "mode con lines=%d cols=%d", WIN_HEIGHT, WIN_WIDTH);
	system(cmd2);
	HideCursor();
		while (Student == false && Teacher == false && Administrator == false)
		{		
		system("cls");
		system("color 02");
		printTableHead(MENU_WIDTH);//50，打印表头
		printTableMidInfo(MENU_WIDTH, "蓝羽学生信息管理系统登陆界面");
		printTableMidInfo(MENU_WIDTH, "");
		printTable_Y(MENU_WIDTH);
		printTableMidInfo_Y(MENU_WIDTH, "1. 登陆★",2,11);
		printTable_Y(MENU_WIDTH);
		printTableMidInfo_Y(MENU_WIDTH, "2. 注册★",2,8);
		printTable_Y(MENU_WIDTH);
		printTableMidInfo_Y(MENU_WIDTH, "  3.修改密码★", 2, 9);
		printTable_Y(MENU_WIDTH);
		printTableMidInfo_Y(MENU_WIDTH, "0. 退出★",2,13);
		printTableTail(MENU_WIDTH);
		printMidInfo("请输入(1-3)：");
		rewind(stdin);
		int choice4 = -1;
		scanf("%d", &choice4);
		switch (choice4)
		{
		case 1:
		{
			landing();
			break;
		}
		case 2:
		{
			if (login_max == 1)
			{
				Register();
				break;
			}
			else
			{
				system("cls");
				color(4);
				printf("一次只能注册一个用户！\n按任意键返回...");
				waitConfirm();
				break;
			}
			
		}
		case 3:
		{
			ChangePassword();
			break;
		}
		case 0:
		{
			system("cls");
			SetCursorPosition(10,4);
			color(2);
			printf("☆感谢使用蓝羽学生信息管理系统------慢走☆");
			for (int i = 3; i >=0; i--)
			{
				SetCursorPosition(20, 15);
				printf("%d秒后程序结束！\n", i);
				Sleep(1000);
			}
			exit(0);
			break;
		}
		case 438:
		{
			Admin_interface();
			break;
		}
		default:break;
		}
	}
	
}
```
 


##  登录界面需要用到的链表结构体   

```cpp
struct User 
{
	char Type[20];//类型  学生/老师/管理员
	char name[20];//姓名
	char Tea_Attestation[50]="0";//老师注册的认证码
	char Account[20];//账号
	char PassWord[20];//密码
 
};
 User administrator = { "管理员","蓝羽","9981","8888","20020829" };
struct  U_Node
{
	struct User data;
	struct U_Node* left;
	struct U_Node* right;
	int size;
};
//创建链表
struct U_Node* Createlist()
{
	U_Node* headNode = (U_Node*)malloc(sizeof(U_Node));
	if (!headNode)
	{
		struct tm* tt = TimeNow();
		char* buff = (char*)malloc(1024);
		sprintf(buff, "%d/%d/%d %d:%d:%d    第1496行Createlist函数申请内存失败", tt->tm_year + 1900, tt->tm_mon, tt->tm_mday, tt->tm_hour, tt->tm_min, tt->tm_sec);
		writeLogFile(buff);
		free(buff);
		buff = NULL;
		return NULL;
	}
	else
	{
		headNode->left =headNode->right= headNode;
		headNode->data = administrator;
		headNode->size =0;
		return headNode;
	}
}
//创建一个结点
struct U_Node* CreatNode(struct User data)
{
	struct U_Node* newNode = (struct U_Node*)malloc(sizeof(U_Node));
	if (newNode == NULL)
	{
		struct tm* tt = TimeNow();
		char* buff = (char*)malloc(1024);
		sprintf(buff, "%d/%d/%d %d:%d:%d    第1539行CreatNode函数申请内存失败", tt->tm_year + 1900, tt->tm_mon, tt->tm_mday, tt->tm_hour, tt->tm_min, tt->tm_sec);
		writeLogFile(buff);
		free(buff);
		buff = NULL;
		return NULL;
	}
	else
	{
		newNode->left = newNode->right = NULL;
		newNode->data = data;
		return newNode;
	}
		
}
//尾插
void InsertNodeByTail(struct U_Node* headNode,struct User data)
{
	struct U_Node* newNode = CreatNode(data);
	if (headNode->size==0)
	{
		headNode->right = newNode;
		newNode->left = headNode;
		headNode->left = newNode;
		newNode->right = headNode;
		(headNode->size)++;
	}
	else
	{
		struct U_Node* tailNode = headNode->left;//表尾
		tailNode->right = newNode;
		newNode->left = tailNode;
		newNode->right = headNode;
		headNode->left = newNode;
		(headNode->size)++;
	}
}
```
 


##  获取控制台函数，可以指定位置显示   

```cpp
void SetCursorPosition(int x,int y)
{
	COORD pos = {x,y};
	//获取控制台
	HANDLE hOutput = GetStdHandle(STD_OUTPUT_HANDLE);
	SetConsoleCursorPosition(hOutput, pos);
 
}
```
 


##  查找账号，密码函数   

```cpp
//查找账号
struct U_Node* find_Account(struct U_Node* headNode,struct User s)
{
		struct U_Node* pMove =headNode;
		int kk=headNode->size;
		while (kk >=0)
		{
			if (0==strcmp(pMove->data.Account,s.Account))
			{
				return pMove;//找到返回指针
			}
			pMove = pMove->right;
			kk--;
		}
		return NULL;//找不到返回NULL
}
//查找密码
struct U_Node* find_Password(struct U_Node* headNode, struct User s)
{
	int kk= headNode->size;
		struct U_Node* p2Move = headNode;
		while (kk >=0)
		{
			if (0==strcmp(p2Move->data.PassWord,s.PassWord))
			{
				return p2Move;//找到返回指针
			}
			p2Move = p2Move->right;
			kk--;
		}
		return NULL;//找不到返回NULL
}
```
 


##  账号防呆，密码防呆函数   

```cpp
//密码防呆
bool Password_Fool_proof(char* data)
{
	int len = strlen(data);
	if (len >= 11 || len<=5)
	{
		return false;
	}
	int number = 0;
	int letter = 0;
	int other = 0;
	for (int i = 0; i < len - 1; i++)
	{
		if (((int)data[i] >= '0' && (int)data[i] <= '9') || ((data[i] >= 'a' && data[i] >= 'z') || (data[i] >= 'A' && data[i] >= 'Z')))
		{
			number++;
		}
		else
			other++;
	}
	if (other == 0)
		return true;
	else
		return false;
}
//账号防呆
bool Account_Fool_proof(char* data)
{
	int len = strlen(data);
	if (len!=8)
	{
		return false;
	}
	int number = 0;
	int other = 0;
	for (int i = 0; i < len - 1; i++)
	{
		if ((int)data[i] >= '0' && (int)data[i] <= '9')
		{
			number++;
		}
		else
			other++;
	}
	if (other == 0)
		return true;
	else
		return false;
}
```
 


##  保存到文件，和从文件提取数据函数   

```cpp
//保存
bool save_user()
{
	struct U_Node* pMove = List->right;
	int kk = List->size;
 
	FILE* fp = fopen(USERINFO, "wb");
	if (fp == NULL)
	{
		return false;
	}
	while (kk >0)
	{
		int ret = fwrite(&pMove->data, sizeof(struct User), 1, fp);
 
		pMove = pMove->right;
		kk--;
		if (ret != 1)
		{
			fclose(fp);
			return false;
		}
	}
	fclose(fp);//关闭文件
	return true;
}
//文件提取
void Import_data()
{
	//文件提取数据
	FILE* fp = fopen(USERINFO, "rb");
	if (fp == NULL)
	{
		struct tm* tt = TimeNow();
		char* buff = (char*)malloc(1024);
		sprintf(buff, "%d/%d/%d %d:%d:%d    第1832行init函数打开文件为空", tt->tm_year + 1900, tt->tm_mon, tt->tm_mday, tt->tm_hour, tt->tm_min, tt->tm_sec);
		writeLogFile(buff);
		free(buff);
		buff = NULL;
		User_Num = 0;
	}
	else
	{
		struct U_Node* pMove = (struct U_Node*)malloc(sizeof(struct U_Node));
 
		while (!feof(fp))//feof表示文件是否结束
		{
			int ret = fread(&pMove->data, sizeof(struct User), 1, fp);
			if (ret == 1)
			{
				struct U_Node* newNode = (struct U_Node*)malloc(sizeof(struct U_Node));
				struct U_Node* tailNode = List->left;
				if (!newNode)
				{
					struct tm* tt = TimeNow();
					char* buff = (char*)malloc(1024);
					sprintf(buff, "%d/%d/%d %d:%d:%d    第1851行init函数申请内存失败", tt->tm_year + 1900, tt->tm_mon + 1, tt->tm_mday, tt->tm_hour, tt->tm_min, tt->tm_sec);
					writeLogFile(buff);
					free(buff);
					buff = NULL;
					return;
				}
				else
				{
					newNode->data = pMove->data;
					tailNode->right = newNode;
					newNode->left = tailNode;
					newNode->right = List;
					List->left = newNode;
					User_Num++;
					List->size++;
				}
			}
		}
		fclose(fp);
	}
}
```
 


##  修改密码函数   

```cpp
//修改密码
void ChangePassword()
{
	while (1)
	{
		system("cls");
		SetCursorPosition(23, 6);
		color(12);
		printf("蓝羽学生信息管理系统修改密码界面");
		rewind(stdin);
		SetCursorPosition(28, 10);
		color(2);
		struct User s4;
		printf("请输入账号：");
		scanf("%s", s4.Account);
		if (NULL == find_Account(List, s4))
		{
			SetCursorPosition(28, 11);
			color(11);
			printf("账号不存在！");
			printf("请按任意键继续....");
			waitConfirm();
			continue;
		}
		SetCursorPosition(28, 11);
		color(2);
		printf("请输入当前密码：");
		scanf("%s", s4.PassWord);
		struct U_Node* pMove = find_Password(List, s4);
		if (NULL == pMove)
		{
			SetCursorPosition(28, 12);
			color(11);
			printf("密码错误！");
		}
		SetCursorPosition(28, 12);
		color(2);
		printf("请输入新密码：");
		char num[20];
		scanf("%s", num);
		if (false == Password_Fool_proof(num))
		{
			SetCursorPosition(1, 13);
			color(11);
			printf("密码只能是英文或者数字组成，并且不能少于5位或者超过11个字符！");
			printf("请按任意键继续....");
			waitConfirm();
			continue;
		}
		strcpy(pMove->data.PassWord, num);
		if (!save_user())
		{
			SetCursorPosition(28, 16);
			color(4);
			printf("文件保存失败！\n");
		}
		else
		{
			SetCursorPosition(28, 16);
			color(3);
			printf("文件保存成功！\n");
		}
		rewind(stdin);
		SetCursorPosition(28, 17);
		printf("请按任意键返回....");
		waitConfirm();
		break;
	}
}
```
 


## 登陆功能实现   

```cpp
//登陆
void landing()
{
	system("cls");
	struct User s8;
	char ch1;
	int i = 0;
	char password[20];
	SetCursorPosition(25,10);
	printf("『用户名』:");
	rewind(stdin);
	scanf("%s",s8.Account);
	SetCursorPosition(25, 11);
	printf("『密码』:");
	rewind(stdin);
	while ((ch1=getch()) !='\r')
	{
		if (ch1 == '\b')
		{
			if (i > 0)
			{
				i--;
				printf("\b \b");
			}
			else
			{
				i = 0;
			}
		}
		else
		{
			password[i++] = ch1;
			printf("*");
		}
	}
	password[i] ='\0';
	strcpy(s8.PassWord,password);
	struct U_Node* pMove  = find_Account(List, s8);
	struct U_Node* p2Move = find_Password(List, s8);
	if ((NULL == pMove)|| NULL == p2Move)
	{
		SetCursorPosition(25, 12);
		color(7);
		printf("用户名不存在或者密码错误！\n");
		printf("请按任意键继续....");
		waitConfirm();
	}
	else if ((NULL != pMove) && (NULL != p2Move))
	{
		
		system("cls");
		if (0==strcmp(pMove->data.Type,"学生"))
		{
			SetCursorPosition(20, 10);
			color(14);
			printf("★尊敬的%s登陆成功，欢迎使用蓝羽学生信息管理系统！★\n",pMove->data.Type);
			Student = true;
			printf("请按任意键继续....");
			waitConfirm();
		}
		if (0==strcmp(pMove->data.Type,"老师"))
		{
			SetCursorPosition(20, 10);
			color(14);
			printf("★尊敬的%s登陆成功，欢迎使用蓝羽学生信息管理系统！★\n",pMove->data.Type);
			Teacher = true;
			printf("请按任意键继续....");
			waitConfirm();
		}
		if (0==strcmp(pMove->data.Type,"管理员"))
		{
			char s[20] = "管理员";
			SetCursorPosition(20, 10);
			color(14);
			printf("尊敬的帅气的%s登陆成功，欢迎使用蓝羽学生信息管理系统！★\n", s);
			Administrator = true;
			printf("请按任意键继续....");
			waitConfirm();
		}
	}
}
```
 


## 注册功能实现   

```cpp
void Register()
{
	while (1)
	{
		system("cls");
		struct User s3;
		SetCursorPosition(24, 6);
		color(12);
		printf("蓝羽学生信息管理系统注册界面");
		color(14);
		SetCursorPosition(28, 10);
		printf("类型：学生/老师:");
		rewind(stdin);
		scanf("%s", s3.Type);
		if ((0 != strcmp(s3.Type, "学生")) && (0 != strcmp(s3.Type, "老师")))
		{
			SetCursorPosition(28, 11);
			printf("请输入正确的类型！！！");
			printf("请按任意键继续....");
			waitConfirm();
			continue;
		}
		if (0 == strcmp(s3.Type, "老师"))
		{
			printf("教师认证码:");
			scanf("%s", s3.Tea_Attestation);
			if (0 != strcmp(s3.Tea_Attestation, List->data.Tea_Attestation))
			{
				printf("认证码错误，请联系管理员获取认证码\n");
				printf("请按任意键继续....");
				waitConfirm();
				continue;
			}
		}
		SetCursorPosition(28, 11);
		printf("姓名：");
		rewind(stdin);
		scanf("%s", s3.name);
		SetCursorPosition(28, 12);
		printf("设置账号：");
		rewind(stdin);
		scanf("%s", s3.Account);
		if (false == Account_Fool_proof(s3.Account))
		{
			SetCursorPosition(20, 20);
			color(11);
			printf("账号只能8位数字，不能有英文和其他符号！");
			printf("请按任意键继续....");
			waitConfirm();
			continue;
		}
		if (NULL != find_Account(List, s3))
		{
			SetCursorPosition(20,20);
			color(11);
			printf("账号已存在，请重新设置！！！");
			printf("请按任意键继续....");
			waitConfirm();
			continue;
		}
		SetCursorPosition(28, 13);
		printf("设置密码：");
		rewind(stdin); 
		scanf("%s",s3.PassWord);
		if (false==Password_Fool_proof((s3.PassWord)))
		{
			SetCursorPosition(1, 20);
			color(11);
			printf("密码只能是英文或者数字组成，并且不能少于5位或者超过11个字符！");
			printf("请按任意键继续....");
			waitConfirm();
			continue;
		}
		InsertNodeByTail(List, s3);
		SetCursorPosition(28, 15);
		color(3);
		printf("注册成功！\n");
		login_max = 0;
		User_Num++;
		if (!save_user())
		{
			SetCursorPosition(28, 16);
			color(4);
			printf("文件保存失败！\n");
		}
		else
		{
			SetCursorPosition(28, 16);
			color(3);
			printf("文件保存成功！\n");
		}
		rewind(stdin);
		SetCursorPosition(28, 17);
		printf("请按任意键返回....");
		waitConfirm();
		break;
	}
}
```
 


##   (后门)管理员界面   

```cpp
 
//管理员界面
void Admin_interface()
{
	system("cls");
	system("color 0e");
	struct User s9;
	char ch1;
	int i = 0;
	char password[20];
	SetCursorPosition(25, 10);
	printf("『管理员用户名』:");
	rewind(stdin);
	scanf("%s", s9.Account);
	SetCursorPosition(25, 11);
	printf("『管理员密码』:");
	rewind(stdin);
	while ((ch1 = getch()) != '\r')
	{
		if (ch1 == '\b')
		{
			if (i > 0)
			{
				i--;
				printf("\b \b");
			}
			else
			{
				i = 0;
			}
		}
		else
		{
			password[i++] = ch1;
			printf("*");
		}
	}
	password[i] = '\0';
	strcpy(s9.PassWord, password);
	if ((0 != strcmp(List->data.Account, s9.Account)) || (0 != strcmp(List->data.PassWord, s9.PassWord)))
	{
		SetCursorPosition(25, 13);
		printf("用户名或者密码错误！");
		printf("请按任意键继续....");
		waitConfirm();
	}
	else
	{
		SetCursorPosition(25, 13);
		printf("尊敬的帅气的%s大人登陆成功，欢迎来到数据后台！★\n", List->data.name);
		for (int i =3; i>=0; i--)
		{
			SetCursorPosition(25, 14);
			printf("还有%d秒跳转...", i);
			Sleep(1000);
		}
		Admin_show();
	}
	
}
```
 


## 管理员界面的数据显示   

[collapse status="false" title="14"]
```cpp
void Admin_showPage(int* Size)
{
	struct U_Node* flag = List->left;//记录p3Move的上一个
	struct U_Node* p4Move = List;
	if ((*Size) < 0)
	{
		return;
	}
	system("cls");
	printTableHead(TABLE_WIDTH, 5);
	printTableRow_Y_color(TABLE_WIDTH, Admin, sizeof(Admin) / sizeof(Admin[0]), 14, 5);
	printTableMidLine(TABLE_WIDTH, 5);
	char row7[5][COL_LEN_MAX];
	int  i = 10;
	static int kkk = 10;
 
	for (int i = 0; i < 10; i++)
	{
		sprintf(row7[0], "%s", p4Move->data.Type);
		sprintf(row7[1], "%s", p4Move->data.name);
		sprintf(row7[2], "%s", p4Move->data.Tea_Attestation);
		sprintf(row7[3], "%s", p4Move->data.Account);
		sprintf(row7[4], "%s", p4Move->data.PassWord);
		(*Size)--;
		printTableRow(TABLE_WIDTH, row7, 5);
		printTableMidLine(TABLE_WIDTH,5);
		flag = p4Move;
		p4Move = p4Move->right;
		if (*(Size) < 0)
		{
			break;
		}
        if (i > 0 && (i % 9 == 0))
		{
			break;
		}
	}
	printTableTail(TABLE_WIDTH, 5);
	List = flag;
}
 
void Admin_show()
{
 
	struct U_Node* flag2 = List;
	int Size = List->size;
	int j = 0;
	if ((Size % 10 == 0) && (Size >= 10))
	{
		j = Size / 10;
	}
	else if ((Size % 10 != 0) && (Size >= 0))
	{
		j = (Size / 10) + 1;
	}
	else
	{
		j = 1;
	}
	char buff3[64];
	for (int i = 0; i < j; i++)
	{
		Admin_showPage(&Size);
		sprintf(buff3, "共%d页,第%d页", j, i + 1);
		printMidInfo(buff3);
		if (i <=((Size / 10) + 1))
		{
			waitConfirm();
		}
	}
	List = flag2;
}
```
 


##  权限函数：（只限制学生就行，老师和管理员无区别）   

```cpp
//权限
bool permission()
{
	if (Student == true)
	{
		system("cls");
		printf("无权限操作！");
		printf("请按任意键返回....");
		return false;
		//waitConfirm();
	}
	return true;
}
```
 


## 日志文件：（可以知道哪行出现问题）   

```cpp
//日志文件
void writeLogFile(char* buf)
{
	char ch[] = "\n\r";
	FILE* fp = fopen(LOGFILENAME,"a");
	if (fp == NULL) {
		fp = fopen(LOGFILENAME, "wb");//如果文件不存在，创建新文件
		fclose(fp);
		fp = fopen(LOGFILENAME, "rb");//打开文件
	}
	fprintf(fp, "%s", buf);
	fwrite(ch, 2, 1, fp);
	fclose(fp);
}
```
 


##  隐藏光标函数：   

```cpp
//隐藏光标
void HideCursor() // 用于隐藏光标
{
	CONSOLE_CURSOR_INFO cursor_info = { 1, 0 };  // 第二个值为0表示隐藏光标
	SetConsoleCursorInfo(GetStdHandle(STD_OUTPUT_HANDLE), &cursor_info);//函数和结构体都在windows.h中定义。
}
```
 


##  获取当前时间函数   

```cpp
//获取当前时间
struct tm* TimeNow()
{
	time_t  t;
	struct  tm* lt;
	time(&t); //获取Unix时间戳。
	lt = localtime(&t); //转为时间结构
	//printf("北京时间:%d/%d/%d %d:%d:%d",
	//	lt->tm_year + 1900, lt->tm_mon, lt->tm_mday, lt->tm_hour, lt->tm_min, lt->tm_sec); //输出结果
	return lt;
}
```
 


##  清空缓冲区等待按键按下函数   
还有代码中rewind(stdin);也是清空缓冲区效果

```cpp
void waitConfirm()
{
	rewind(stdin);//清空缓冲区
	getch();//不需要按下回车
}
```
 


## 增删改查需要用到的链表结构体   

```cpp
struct student
{
	double ID;//学号
	char grade[20];//班级
	char name[20];//姓名
	char sex[10];//性别
	double Math;//数学成绩
	double CLange;//C语言成绩
	double English;//英语成绩
	double sum;//总成绩
};
struct classes
{
	double Math_pass_num;//数学合格人数
	double CLange_pass_num;//C语言合格人数
	double English_pass_num;//英语合格人数
	double Math_mean;//数学平均分
	double CLange_mean;//C语言平均分
	double English_mean;//英语平均分
	double People;//班级人数
}A,B,man,woman;
 
//创建存放数据的结构体
struct Node
{
	struct student data;
	struct Node* next;
};
 
struct Node* creatlist()
{
	struct Node* headNode = (struct Node*)malloc(sizeof(struct Node));
	if (!headNode)
	{
		struct tm* tt=TimeNow();
		char* buff = (char*)malloc(1024);
		sprintf(buff, "%d/%d/%d %d:%d:%d    第97行creatlist函数申请内存失败",tt->tm_year+1900,tt->tm_mon,tt->tm_mday,tt->tm_hour,tt->tm_min,tt->tm_sec);
		writeLogFile(buff);
		free(buff);
		buff = NULL;
		return NULL;
	}
	else
		headNode->next = NULL;
	return headNode;
}
 
struct Node* createNode(struct student data)
{
	struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
	 if(newNode== NULL)
	{
		 struct tm* tt = TimeNow();
		 char* buff = (char*)malloc(1024);
		 sprintf(buff, "%d/%d/%d %d:%d:%d    第117行createNode函数申请内存失败", tt->tm_year + 1900, tt->tm_mon, tt->tm_mday, tt->tm_hour, tt->tm_min, tt->tm_sec);
		 writeLogFile(buff);
		 free(buff);
		 buff = NULL;
		 return NULL;
	}
	 else
	 {
		 newNode->data = data;
		 newNode->next = NULL;
	 }
	 return newNode;
}
 
void insertByHead(struct Node* headNode,struct student data)
{
	struct Node* newNode = createNode(data);
	newNode->next = headNode->next;
	headNode->next = newNode;
}
```
 
