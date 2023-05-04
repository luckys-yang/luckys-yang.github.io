---
title: C语言学生信息管理系统(下)
cover: /img/num67.webp
comments: false
tags:
  - 项目
categories:
  - C语言学习笔记  
abbrlink: ab0cc93e
date: 2022-02-14 15:23:00
updated: 2022-06-09 00:44:00
---
## 菜单界面

```cpp
void menu()
{
	system("cls");//先清空屏幕
	system("color 0e");
	printTableHead(MENU_WIDTH);//50，打印表头
	printTableMidInfo(MENU_WIDTH, "蓝羽学生成绩管理系统");
	printTableMidInfo(MENU_WIDTH, "");
 
	const char* subMenus[] = {
		"1. 输入学生信息",
		"2. 删除学生信息 " ,
		"3. 插入学生信息 " ,
		"4. 查找学生信息",
		"5. 修改学生信息 " ,
		"6. 学生成绩排名 " ,
		"7. 统计学生总数 " ,
		"8. 显示所有信息 " ,
		"0.   退出系统   "
	};
	int sz = sizeof(subMenus) / sizeof(subMenus[0]);
	for (int i = 0; i < sz; i++)
	{
		if (i == sz - 1)
		{
			printTableMidInfo_Y(MENU_WIDTH, subMenus[i],14,12);
		}
		else
			printTableMidInfo(MENU_WIDTH, subMenus[i]);
	}
	color(14);
	printTableMidInfo(MENU_WIDTH, "");
	printTableTail(MENU_WIDTH);//打印表尾
	printMidInfo("请输入(1-7)：");
}
```
 


##   初始化  

```cpp
void init()
{
	list = creatlist();
	struct Node* p5Move = (struct Node*)malloc(sizeof(struct Node));
	if (p5Move == NULL)
	{
		struct tm* tt = TimeNow();
		char* buff = (char*)malloc(1024);
		sprintf(buff, "%d/%d/%d %d:%d:%d    第194行init函数申请内存失败", tt->tm_year + 1900, tt->tm_mon, tt->tm_mday, tt->tm_hour, tt->tm_min, tt->tm_sec);
		writeLogFile(buff);
		free(buff);
		buff = NULL;
		return ;
	}
	char cmd[50];
	sprintf(cmd, "mode con lines=%d cols=%d", WIN_HEIGHT, WIN_WIDTH);
	system(cmd);
	
	menu();
	//程序启动后要求自动从文件中读取数据，然后保存到数组中
	//fopen 打开一个文件
	FILE* fp = fopen(EXEDATA, "rb");//'r'表示只读，'b'表示二进制信息
	if (fp == NULL)
	{
		struct tm* tt = TimeNow();
		char* buff = (char*)malloc(1024);
		sprintf(buff, "%d/%d/%d %d:%d:%d    第212行init函数打开文件为空", tt->tm_year + 1900, tt->tm_mon, tt->tm_mday, tt->tm_hour, tt->tm_min, tt->tm_sec);
		writeLogFile(buff);
		free(buff);
		buff = NULL;
		Student_Num = 0;
		return;
	}
	while (!feof(fp))//feof表示文件是否结束
	{
		int ret = fread(&p5Move->data, sizeof(struct student), 1, fp);
		if (ret == 1)
		{
			struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
			if (!newNode)
			{
				struct tm* tt = TimeNow();
				char* buff = (char*)malloc(1024);
				sprintf(buff, "%d/%d/%d %d:%d:%d    第217行init函数申请内存失败", tt->tm_year + 1900, tt->tm_mon, tt->tm_mday, tt->tm_hour, tt->tm_min, tt->tm_sec);
				writeLogFile(buff);
				free(buff);
				buff = NULL;
				return;
			}
			else
			{
				newNode->data = p5Move->data;
				newNode->next = list->next;
				list->next = newNode;
				Student_Num++;
			}	
		}
	}
	fclose(fp);
}
```
 


##  查找名字函数  

```cpp
//返回NULL 表示没有这个学生
//返回posNodeFront  表示这个学生名字存在
struct Node* modifi_find_Name(struct Node* headNode,char* name)
{
	struct Node* posNode = headNode->next;
	struct Node* posNodeFront = headNode;
	if (posNode == NULL)
	{
		return NULL;
	}
	count = 0;
	while (posNode!=NULL)
	{
		if (0 != strcmp(posNode->data.name, name))
		{
			posNodeFront = posNode;
			posNode = posNodeFront->next;
		}
		else
		{
			count++;
			if (count == 1)
			{
				printf("学号\t班级\t姓名\t性别\t数学\tC语言\t英语\t总分\t\n");
			}
			if (count >= 1)
			{
				printf("%.0f\t%s\t%s\t%s\t%.2f\t%.2f\t%.2f\t%.2f\n", posNode->data.ID, posNode->data.grade, posNode->data.name,
					posNode->data.sex, posNode->data.Math, posNode->data.CLange, posNode->data.English, posNode->data.sum);
			}
			posNodeFront = posNode;
			posNode = posNodeFront->next;
		}	
	}
	if (count == 0)
	{
		return NULL;
	}
	else if(count>1)
	{
		return posNodeFront;
	}
}
```
 


```cpp
//返回NULL 表示没有这个学生
//返回posNodeFront 表示这个学生存在
struct Node* find_Name_2(struct Node* headNode, char* name)
{
	struct Node* posNode = headNode->next;
	struct Node* posNodeFront = headNode;
	if (posNode == NULL)
	{
		return NULL;
	}
	while (0 != strcmp(posNode->data.name, name))
	{
		posNodeFront = posNode;
		posNode = posNodeFront->next;
		if (posNode == NULL)
		{
			return NULL;
		}
	}
	return posNodeFront;
}
```
 
```cpp
//返回名字个数
int find_Name_3(struct Node* headNode, char* name)
{
	int count3 = 0;
	struct Node* posNode = headNode->next;
	if (posNode == NULL)
	{
		return 0;
	}
	while (posNode!=NULL)
	{
		if (0 == (strcmp(posNode->data.name, name)))
		{
			count3++;
			posNode = posNode->next;
		}
		else
			posNode = posNode->next;
		
		
	}
	return count3;
}
```
 




##   查找班级函数  

```cpp
//查询班级副函数
int find_Grade(struct Node* headNode, char* grade)
{
	int count4 = 0;
	struct Node* posNode = headNode->next;
	if (posNode == NULL)
	{
		return 0;
	}
	while (posNode != NULL)
	{
		if (0 == (strcmp(posNode->data.grade, grade)))
		{
			count4++;
			posNode = posNode->next;
		}
		else
			posNode = posNode->next;
 
 
	}
	return count4;
}
```
 


##   学号冒泡排序  

```cpp
//学号冒泡排序
void bubble_sort_ID()
{
	struct Node* posNodeFront = list->next;
	if (!posNodeFront)
	{
		return;
	}
	else
	{
		struct Node* p2Move = posNodeFront->next;
		for (int i = 0; i < Student_Num - 1; ++i)
		{
			posNodeFront = list->next;
			p2Move = posNodeFront->next;
			for (int j = 0; j < Student_Num - 1 - i; ++j)
			{
				if (p2Move->data.ID < posNodeFront->data.ID)
				{
					struct student Swap = p2Move->data;
					p2Move->data = posNodeFront->data;
					posNodeFront->data = Swap;
				}
				p2Move = p2Move->next;
				posNodeFront = posNodeFront->next;
			}
		}
	}
 
}
```
 


##   总分冒泡排序  

```cpp
//总成绩冒泡排序
void bubble_sort_sum(struct Node* posNodeFront,struct Node* p2Move)
{
	assert(posNodeFront&&p2Move);
	for (int i = 0; i < Student_Num - 1; ++i)
	{
		posNodeFront = list->next;
		p2Move = posNodeFront->next;
		for (int j = 0; j < Student_Num - 1 - i; ++j)
		{
			if (p2Move->data.sum> posNodeFront->data.sum)
			{
				struct student Swap = p2Move->data;
				p2Move->data = posNodeFront->data;
				posNodeFront->data = Swap;
			}
			p2Move = p2Move->next;
			posNodeFront = posNodeFront->next;
		}
	}
}
```
 


##   查找学号函数  

```cpp
//返回pMove 表示存在ID
//返回NULL  表示ID不存在
struct Node* find_ID(struct Node* headNode, struct student s)
{
	struct Node* pMove = list->next;
	if (pMove == NULL)
	{
		return NULL;
	}
	while (pMove != NULL)
	{
		if ((pMove->data.ID) == (s.ID))
		{
			return pMove;
		}
		pMove = pMove->next;
	}
	return NULL;
 
}
```
 
```cpp
//返回-1  表示没有这个学生
//返回>=0  表示这个学生学号存在
int searchStu_Num(struct Node* headNode, double num)
{
	struct Node* pMove = headNode;
	while (pMove->next != NULL)
	{
		pMove = pMove->next;
		if (pMove->data.ID == num)
		{
			return 0;
		}
	}
	return -1;
}
```
 




##   保存到文件函数  

```cpp
//保存主函数
bool save()
{
	
	struct Node* p2Move = list->next;
	FILE  *fp=fopen(EXEDATA, "wb");
	if (fp == NULL)
	{
		return false;
	}
	while (p2Move)
	{
		int ret = fwrite(&p2Move->data, sizeof(struct student), 1, fp);
				
		p2Move = p2Move->next;
		if (ret != 1)
		{
			fclose(fp);
			return false;
		}
	}	
	fclose(fp);//关闭文件
	return true;
}
 
//保存判断
void save_judge()
{
	if (!save())
	{
		system("color 0c");
		printf("保存失败！\n");
		exit(-1);
	}
	else
	{
		system("color 0a");
		printf("保存成功！\n");
	}
	Sleep(200);
}
```
 


##  对输入的班级，性别，成绩判断是否合法  

```cpp
bool judge_grade_sex(struct student move)
{
		if ((0 != strcmp(move.sex, "男")) && (0 != strcmp(move.sex, "女")))
		{
			if ((0 != strcmp(move.grade, "A班")) && (0 != strcmp(move.grade, "B班")))
			{
				if (move.CLange < 0)
				{
					printf("请输入正确的班级和性别！\n");
					printf("成绩不能是负数，请重新输入！\n");
					return false;
				}
				if (move.English < 0)
				{
					printf("请输入正确的班级和性别！\n");
					printf("成绩不能是负数，请重新输入！\n");
					return false;
				}
				if (move.Math < 0)
				{
					printf("请输入正确的班级和性别！\n");
					printf("成绩不能是负数，请重新输入！\n");
					return false;
				}
				printf("请输入正确的班级和性别！\n");
				return false;
			}
			if ((move.CLange < 0) && (move.English < 0) &&( move.Math < 0))
			{
				printf("请输入正确的性别！\n");
				printf("成绩不能是负数，请重新输入！\n");
				return false;
			}
			printf("请输入正确的性别！\n");
			return false;
		}
		if ((0 != strcmp(move.grade, "A班")) && (0 != strcmp(move.grade, "B班")))
		{
			if ((0 != strcmp(move.sex, "男")) && (0 != strcmp(move.sex, "女")))
			{
				if (move.CLange < 0)
				{
					printf("请输入正确的班级和性别！\n");
					printf("成绩不能是负数，请重新输入！\n");
					return false;
				}
			else if (move.English < 0)
				{
					printf("请输入正确的班级和性别！\n");
					printf("成绩不能是负数，请重新输入！\n");
					return false;
				}
			else if (move.Math < 0)
				{
					printf("请输入正确的班级和性别！\n");
					printf("成绩不能是负数，请重新输入！\n");
					return false;
				}
				printf("请输入正确的班级和性别！\n");
				return false;
			}
			printf("请输入正确的班级！\n");
			return false;
		}
		if (move.CLange < 0)
		{
			printf("成绩不能是负数，请重新输入！\n");
			return false;
		}
		if (move.English < 0)
		{
			printf("成绩不能是负数，请重新输入！\n");
			return false;
		}
		if (move.Math < 0)
		{
			printf("成绩不能是负数，请重新输入！\n");
			return false;
		}
		
		return true;
 
 
}
```
 


##   输入功能实现  

```cpp
//输入主函数
void input()
{
	char str=0;
	while (1)
	{
		system("cls");
		system("color 0e");
		printf("是否使用输入功能(y/n):");
		rewind(stdin);
		scanf("%c", &str);
		if (str == 'N' || str == 'n')
		{
			printf("请按任意键回主页....");
			break;
		}
		else if (str == 'Y' || str == 'y')
		{
			struct student move = inputINfo();
			if (false==judge_grade_sex(move))
			{
				waitConfirm();
				continue;
			}
			if (searchStu_Num(list, move.ID) >= 0)
			{
				printf("学号[%.0lf]已存在！\n", move.ID);
				waitConfirm();
				continue;
			}
			insertByHead(list, move);
			Student_Num++;
			save_judge();
		}
		else
			continue;
		
	}
}
```
 
```cpp
struct student inputINfo()//输入函数struct student inputINfo()//输入函数
{
	struct student s;
	printf("学号：");
	scanf("%lf", &s.ID);
 
	printf("班级：");
	scanf("%s",s.grade);
	
	printf("姓名：");
	scanf("%s", s.name);
 
	printf("性别：");
	scanf("%s", s.sex);
 
	printf("数学成绩：");
	scanf("%lf", &s.Math);
 
	printf("C语言成绩：");
	scanf("%lf", &s.CLange);
 
	printf("英语成绩：");
	scanf("%lf", &s.English);
 
	s.sum = s.Math + s.CLange + s.English;
	return s;
	
 
}
```
 


##   删除主函数  

```cpp
//删除主函数
void del()
{
 
	char str_name[20];
	char str2[20];
	while (1)
	{
		system("cls");
		char c=-1;
		printf("是否使用删除功能？(y/n)");
		rewind(stdin);
		scanf("%c", &c);
		if (c == 'N' || c == 'n')
		{
			printf("请按任意键回主页....");
			break;
		}
		else if (c == 'Y' || c == 'y')
		{
			system("cls");
			printf("请输入要删除信息的学生姓名：");
			rewind(stdin);
			scanf("%s", str_name);
			struct Node* p = find_Name_2(list, str_name);
			if (NULL == p)
			{
				printf("该学生%s不存在！", str_name);
				printf("请按任意键继续....");
				waitConfirm();
				continue;
			}
			else
			{
 
				printf("找到了，是否删除(y/n)");
				rewind(stdin);
				scanf("%s", &str2);
				if (strcmp(str2, "Y") != 0 && strcmp(str2, "y") != 0)
				{
					printf("请按任意键继续....");
					waitConfirm();
					continue;
				}
				else
				{
					rewind(stdin);
					struct Node* p2 = p->next;
					p->next = p2->next;
					free(p2);
					p2 = NULL;
					printf("删除成功！");
					Student_Num--;
					Sleep(200);
 
				}
			}
		}
		else
			continue;
		
	}
}
```
 


##   插入函数  

```cpp
//插入主函数
void interpos()
{
	while (1)
	{
		char c = -1;
		system("cls");
		system("color 0e");
		printf("是否使用插入功能？(y/n)");
		rewind(stdin);
		scanf("%c", &c);
		if (c == 'N' || c == 'n')
		{
			printf("请按任意键回主页....");
			break;
		}
		else if (c == 'Y' || c == 'y')
		{
			system("cls");
			printf("请输入要插入的学生信息：");
			rewind(stdin);
			struct student  move = inputINfo();
			if (false == judge_grade_sex(move))
			{
				waitConfirm();
				continue;
			}
			rewind(stdin);
			int i = searchStu_Num(list, move.ID);
			if (i >= 0)
			{
				char c2;
				printf("你插入的学号已存在，是否替换,不替换则重新输入？(y/n)：");
				scanf("%c", &c2);
				if (c2 == 'Y' || c2 == 'y')
				{
					struct Node* p2Move = find_ID(list, move);
					p2Move->data = move;
					continue;
				}
				if (c2 == 'N' || c2 == 'n')
				{
					continue;
				}
			}
			else
			{
				insertByHead(list, move);
				Student_Num++;
				save_judge();
			}
		}
		else
			continue;
		
	}
}
```
 


##  修改函数  

```cpp
void modifi()
{
	while (1)
	{
		char c = -1;
		system("cls");
		system("color 0e");
		printf("是否使用修改功能？(y/n)");
		rewind(stdin);
		scanf("%c", &c);
		if (c == 'N' || c == 'n')
		{
			printf("请按任意键回主页....");
			break;
		}
		else if (c == 'Y' || c == 'y')
		{
			system("cls");
			printTableHead(MENU_WIDTH);//50，打印表头
			printTableMidInfo(MENU_WIDTH, "选择要修改信息的途径");
			printTableMidInfo(MENU_WIDTH, "");
			printTable_Y(MENU_WIDTH);
			printTableMidInfo(MENU_WIDTH, "1.通过姓名");
			printTable_Y(MENU_WIDTH);
			printTableMidInfo(MENU_WIDTH, "2.通过学号");
			printTableTail(MENU_WIDTH);
			printMidInfo("请输入(1-2)：");
			rewind(stdin);
			int choice2 = -1;
			scanf("%d", &choice2);
			switch (choice2)
			{
			case 1:
			{
				char c = -1;
				char str_name[20] = "\0";
				system("cls");
				printf("请输入要修改信息的姓名：");
				rewind(stdin);
				scanf("%s", str_name);
				int ww=find_Name_3(list, str_name);
				struct Node* p= modifi_find_Name(list, str_name);
				if (ww == 0)
				{
					printf("无此学生信息！\n");
				}
				else if (count == 1)
				{
					struct Node* pp=find_Name_2(list, str_name);
					system("cls");
					printf("找到了,请输入新的信息：\n");
					rewind(stdin);
					struct student k = inputINfo();
					if (false == judge_grade_sex(k))
					{
						waitConfirm();
						continue;
					}
					rewind(stdin);
					if (NULL == find_ID(list, k))
					{
						pp->next->data = k;
						system("cls");
						save();
						printf("修改成功！\n");
						save_judge();
						printf("请按任意键继续....");
						waitConfirm();
						continue;
						break;
					}
					else
					{
						printf("学号[%.0lf] 已存在，请重新输入\n", k.ID);
						printf("请按任意键继续....");
						waitConfirm();
						continue;
					}
				}
				else if ((p != NULL) && count>1)
				{
					printf("找到了%d条相同名字信息！请通过输入学号选择要修改的学生：",count);
					rewind(stdin);
					struct student k3;
					scanf("%lf", &k3.ID);
					struct Node* p6Move=find_ID(list, k3);
					if (p6Move == NULL)
					{
						printf("请输入正确的学号！\n");
					}
					else if (NULL != p6Move && (0 == (strcmp(p6Move->data.name, str_name))))
					{
						printf("请输入新的信息：\n");
						rewind(stdin);
						struct student k4 = inputINfo();
						struct Node* p5Move = find_ID(list, k4);
						if (NULL != p5Move && (k3.ID != k4.ID))
						{
							printf("学号[%.0lf]已存在！请使用别的学号！\n", k4.ID);
							printf("请按任意键继续....");
							waitConfirm();
							continue;
						}
						p6Move->data = k4;
						system("cls");
						save();
						printf("修改成功！\n");
						save_judge();
						printf("请按任意键继续....");
						waitConfirm();
						continue;
						break;
					}
					
				
				}
			}
			case 2:
			{
				struct student k1;
				system("cls");
				printf("请输入要修改信息的学号：");
				rewind(stdin);
				scanf("%lf",&k1.ID);
				struct Node* p3Move = find_ID(list,k1);
				if (NULL!=p3Move)
				{
					printf("找到了,请输入新的信息：\n");
					rewind(stdin);
					struct student k2 = inputINfo();
					if (false == judge_grade_sex(k2))
					{
						waitConfirm();
						continue;
					}
					rewind(stdin);
					struct Node* p4Move = find_ID(list, k2);
					if (NULL != p4Move&& (k1.ID!=k2.ID))
					{
						printf("学号[%.0lf]已存在！请使用别的学号！\n", k2.ID);
						printf("请按任意键继续....");
						waitConfirm();
						continue;
					}
					else
					{
						p3Move->data =k2;
						system("cls");
						save();
						printf("修改成功！\n");
						save_judge();
						printf("请按任意键继续....");
						waitConfirm();
						continue;
						break;
					}
				}
				else
				{
					printf("该学号[%.0lf]不存在！\n",k1.ID);
					printf("请按任意键继续....");
					waitConfirm();
					continue;
				
				}
			}
			default:break;
				
			}
		}
		else
		continue;
	}
}
```
 


##  查找主函数  

```cpp
//查找信息主函数
void find_information()
{
	while (1)
	{
		char cc = -1;
		system("cls");
		system("color 0e");
		printf("是否使用查询功能？(y/n)");
		rewind(stdin);
		scanf("%c", &cc);
		if (cc == 'N' || cc == 'n')
		{
			printf("请按任意键回主页....");
			break;
		}
		else if (cc == 'Y' || cc == 'y')
		{
			system("cls");
			printTableHead(MENU_WIDTH);//50，打印表头
			printTableMidInfo(MENU_WIDTH, "选择要查询信息的途径");
			printTableMidInfo(MENU_WIDTH, "");
			printTable_Y(MENU_WIDTH);
			printTableMidInfo(MENU_WIDTH, "1.姓名查询");
			printTable_Y(MENU_WIDTH);
			printTableMidInfo(MENU_WIDTH, "2.学号查询");
			printTable_Y(MENU_WIDTH);
			printTableMidInfo(MENU_WIDTH, "3.班级查询");
			printTableTail(MENU_WIDTH);
			printMidInfo("请输入(1-3)：");
			rewind(stdin);
			int choice3 = -1;
			scanf("%d", &choice3);
			switch (choice3)
			{
			case 1:
			{
				system("cls");
				printf("请输入要查询的姓名：");
				rewind(stdin);
				char ss[20] = "\0";
				scanf("%s", ss);
				char w1 = 'b';
				int k = find_Name_3(list, ss);
				if (k == 0)
				{
					printf("查无此人！\n");
				}
				else
				{
					show2(k,ss,w1);
				}
				waitConfirm();
				continue;
			}
			case 2:
			{
				system("cls");
				printf("请输入要查询的学号：");
				rewind(stdin);
				struct student s2;
 
				scanf("%lf", &s2.ID);
				struct Node* p3Move = find_ID(list, s2);
				if (NULL == p3Move)
				{
					printf("查无此人！\n");
					printf("请按任意键继续....");
					waitConfirm();
					continue;
					break;//学号查询
				}
				else
				{
					printTableHead(TABLE_WIDTH, 8);
					printTableRow_Y_color(TABLE_WIDTH, head, sizeof(head) / sizeof(head[0]), 14, 8);
					printTableMidLine(TABLE_WIDTH, 8);
					char row6[8][COL_LEN_MAX];
					sprintf(row6[0], "%.0f", p3Move->data.ID);
					sprintf(row6[1], "%s", p3Move->data.grade);
					sprintf(row6[2], "%s", p3Move->data.name);
					sprintf(row6[3], "%s", p3Move->data.sex);
					sprintf(row6[4], "%.2f", p3Move->data.Math);
					sprintf(row6[5], "%.2f", p3Move->data.CLange);
					sprintf(row6[6], "%.2f", p3Move->data.English);
					sprintf(row6[7], "%.2f", p3Move->data.sum);
					printTableRow(TABLE_WIDTH, row6, 8);
					printTableTail(TABLE_WIDTH, 8);
					waitConfirm();
					continue;
					break;//学号查询
				}
			}
			case 3:
			{
				system("cls");
				printf("请输入要查询的班级：");
				char w = 'a';
				rewind(stdin);
				char ss2[20] = "\0";
				scanf("%s", ss2);
				int x = find_Grade(list, ss2);
				if (x == 0)
				{
					printf("暂无信息！\n");
				}
				else
				{
					show2(x, ss2,w);
				}
				waitConfirm();
				continue;
			}
			default:
			{
				break;
			}
 
			}
		}
		else
			continue;
	}
}
```
 


##   查找主函数显示函数  

```cpp
void showPage2(char* str,char c)
{
	char k = c;
	struct Node* flag = list;//记录p3Move的上一个
	struct Node* p6Move = flag->next;
	if (p6Move == NULL)
	{
		return;
	}
	system("cls");
	printTableHead(TABLE_WIDTH, 8);
	printTableRow_Y_color(TABLE_WIDTH, head, sizeof(head) / sizeof(head[0]),14,8);
	printTableMidLine(TABLE_WIDTH, 8);
	char row6[8][COL_LEN_MAX];
	int  i = 10;
	static int kkk = 10;
	while (i > 0)
	{
		if (k == 'b')
		{
			while ((strcmp(p6Move->data.name, str)))
			{
				i--;
				flag = p6Move;
				p6Move = p6Move->next;
				if (p6Move == NULL || flag == NULL)
				{
					return;
					break;
				}
			}
		}
		if (k == 'a')
		{
			while ((strcmp(p6Move->data.grade, str)))
			{
				i--;
				flag = p6Move;
				p6Move = p6Move->next;
				if (p6Move == NULL || flag == NULL)
				{
					return;
					break;
				}
			}
		}
		sprintf(row6[0], "%.0f", p6Move->data.ID);
		sprintf(row6[1], "%s", p6Move->data.grade);
		sprintf(row6[2], "%s", p6Move->data.name);
		sprintf(row6[3], "%s", p6Move->data.sex);
		sprintf(row6[4], "%.2f", p6Move->data.Math);
		sprintf(row6[5], "%.2f", p6Move->data.CLange);
		sprintf(row6[6], "%.2f", p6Move->data.English);
		sprintf(row6[7], "%.2f", p6Move->data.sum);
		printTableRow(TABLE_WIDTH, row6, 8);
		i--;
		if (kkk > 0)
		{
			printTableMidLine_Y3(TABLE_WIDTH, 8);
		}
		kkk--;
		if (kkk == 0)
		{
			kkk = 10;
		}
		flag = p6Move;
		p6Move = p6Move->next;
	}
	 list = flag;
}
 
//choice  'b' 代表查姓名  'a'代表查班级
void show2(int k,char* ss,char c)
{
	struct Node* flag2 = list;//先把list存到一个临时变量里，等show函数结束list变回原始值
	struct Node* p4Move = list->next;
	
	{
		int j2 = 0;
		int j = 0;
		if ((k % 10 == 0)&&(k>=10))
		{
			j = k / 10;
			j2 = j;
		}
		else if((k%10!=0)&&(k>=0))
		{
			j= (k / 10) + 1;
			j2 = j;
		}
		else
		{
			j = 1;
			j2 = j;
		}
		char buff2[64];
		for (int i = 0; i <j; i++)
		{
			showPage2(ss,c);
			sprintf(buff2, "共%d页,第%d页",(k/10)+1, i + 1);
			printMidInfo(buff2);
			if (i <((k/10)+1)-1)
			{
				waitConfirm();
			}
			j2--;
		}
		if (j2 == 0)//当页码为0执行下面
		{
			list = flag2;
		}
	}	
}
```
 


##   总成绩排名主函数  

```cpp
//总成绩排名主函数
void score_rank()
{
	system("color 0b");
	struct Node* posNodeFront = list->next;
	
	if (posNodeFront == NULL)
	{
		system("cls");
		printf("暂无学生信息！");
		return;
	}
	struct Node* p2Move = posNodeFront->next;
	if (p2Move == NULL)
	{
		system("cls");
		show(11,8);
	}
	
	else
	{
		bubble_sort_sum(posNodeFront, p2Move);
	}
	show(11,8);
}
```
 


##   总成绩排名函数显示函数  

```cpp
void showPage(int startIndex, int endIndex, int num1, int num2)
{
	if (endIndex >= Student_Num)
	{
		endIndex = Student_Num - 1;
	}
	if (endIndex - startIndex + 1 > EVERY_PAGE_BOX)
	{
		endIndex = startIndex + EVERY_PAGE_BOX - 1;
	}
	system("cls");
	printTableHead(TABLE_WIDTH, 8);
	printTableRow_Y_color(TABLE_WIDTH, head, sizeof(head) / sizeof(head[0]), num1, num2);
	printTableMidLine(TABLE_WIDTH, 8);
	char row[8][COL_LEN_MAX];
 
	struct Node* flag = list;//记录p3Move的上一个
	struct Node* p3Move = flag->next;
	for (int i = startIndex; i <= endIndex; i++)
	{
		sprintf(row[0], "%.0f", p3Move->data.ID);
		sprintf(row[1], "%s", p3Move->data.grade);
		sprintf(row[2], "%s", p3Move->data.name);
		sprintf(row[3], "%s", p3Move->data.sex);
		sprintf(row[4], "%.2f", p3Move->data.Math);
		sprintf(row[5], "%.2f", p3Move->data.CLange);
		sprintf(row[6], "%.2f", p3Move->data.English);
		sprintf(row[7], "%.2f", p3Move->data.sum);
 
 
		printTableRow(TABLE_WIDTH, row, 8);
		if (i < endIndex)
		{
			printTableMidLine(TABLE_WIDTH, 8);
		}
		else
		{
			printTableTail(TABLE_WIDTH, 8);
		}
		flag = p3Move;
		p3Move = p3Move->next;
		if (p3Move == NULL)
		{
			return;
		}
	}
	list = flag;
}
 
void show(int num1, int num2)
{
	struct Node* flag2 = list;//先把list存到一个临时变量里，等show函数结束list变回原始值
	struct Node* p4Move = list->next;
	system("cls");
	if (p4Move == NULL)
	{
		printf("还没有学生信息！\n");
		return;
	}
	int pageCount = (Student_Num + EVERY_PAGE_BOX - 1) / EVERY_PAGE_BOX;//多少页
	int k = pageCount;
	char buff[64];
	for (int i = 0; i < pageCount; i++)
	{
		showPage(i * EVERY_PAGE_BOX, (i + 1) * EVERY_PAGE_BOX - 1, num1, num2);//每一页的起始序号结束序号
		sprintf(buff, "共%d页,第%d页", pageCount, i + 1);
		printMidInfo(buff);
		if (i < pageCount - 1)
		{
			waitConfirm();
		}
		k--;
	}
	if (k == 0)//当页码为0执行下面
	{
		list = flag2;
	}
}
```
 


##   统计算法  

```cpp
//统计算法
bool stat_RSA()
{
	struct Node* pMove = list->next;
	if (!pMove)
	{
		printf("还没有学生信息！");
		return false;
	}
	//A班
	int A_Mat_count = 0;//数学合格人数
	int A_CLa_count = 0;//C语言合格人数
	int A_Eng_count = 0;//英语合格人数
	int A_peop_count = 0;//班级人数
	//B班
	int B_Mat_count = 0;//数学合格人数
	int B_CLa_count = 0;//C语言合格人数
	int B_Eng_count = 0;//英语合格人数
	int B_peop_count = 0;//班级人数
	int man_count = 0;//男生
	int woman_count = 0;//女生
	while (pMove != NULL)
	{
		
		if (0 == strcmp(pMove->data.grade, "A班"))
		{
			if ((pMove->data.Math) >= 60)
			{
				A_Mat_count++;
			}
			if ((pMove->data.CLange) >= 60)
			{
				A_CLa_count++;
			}
			if ((pMove->data.English) >= 60)
			{
				A_Eng_count++;
			}
			if (0==(strcmp(pMove->data.sex,"男")))
			{
				man_count++;
			}
			if (0 != (strcmp(pMove->data.sex, "男")))
			{
				woman_count++;
			}
			A_peop_count++;
			pMove = pMove->next;
		}
		else if (0 == strcmp(pMove->data.grade, "B班"))
		{
			if ((pMove->data.Math) >= 60)
			{
				B_Mat_count++;
			}
			if ((pMove->data.CLange) >= 60)
			{
				B_CLa_count++;
			}
			if ((pMove->data.English) >= 60)
			{
				B_Eng_count++;
			}
			if (0 == (strcmp(pMove->data.sex, "男")))
			{
				man_count++;
			}
			if (0 != (strcmp(pMove->data.sex, "男")))
			{
				woman_count++;
			}
			B_peop_count++;
			pMove = pMove->next;
		}
	}
	A.CLange_pass_num = A_CLa_count;
	A.English_pass_num= A_Eng_count;
	A.Math_pass_num= A_Mat_count;
	A.People = A_peop_count;
	B.CLange_pass_num = B_CLa_count;
	B.English_pass_num = B_Eng_count;
	B.Math_pass_num = B_Mat_count;
	B.People = B_peop_count;
	man.People = man_count;
	woman.People = woman_count;
	return true;
}
//科目平均分
void subject_mean()
{
	struct Node* pMove = list->next;
	double A_Math_mean = 0;
	double A_CLa_mean = 0;
	double A_Eng_mean = 0;
	double B_Math_mean = 0;
	double B_CLa_mean = 0;
	double B_Eng_mean = 0;
	if (pMove == NULL)
	{
		return;
	}
	else
	{
		while (pMove != NULL)
		{
			if (0 == strcmp(pMove->data.grade, "A班"))
			{
				A_CLa_mean += pMove->data.CLange;
				A_Math_mean += pMove->data.Math;
				A_Eng_mean += pMove->data.English;
 
			}
			else if (0 == strcmp(pMove->data.grade, "B班"))
			{
				B_CLa_mean += pMove->data.CLange;
				B_Math_mean += pMove->data.Math;
				B_Eng_mean += pMove->data.English;
			}
			pMove = pMove->next;
		}
		A.CLange_mean = A_CLa_mean;
		A.English_mean= A_Eng_mean;
		A.Math_mean = A_Math_mean;
		B.CLange_mean = B_CLa_mean;
		B.English_mean = B_Eng_mean;
		B.Math_mean = B_Math_mean;
 
		
	}
}
```
 


##   统计主函数  

```cpp
//统计主函数
void stat()
{
		    system("cls");
			system("color 09");
			if (false!=stat_RSA())
			{
				printTableHead(TABLE_WIDTH, 5);
				printTableRow_Y2(TABLE_WIDTH, hea, sizeof(hea) / sizeof(hea[0]),9,8);
				printTableMidLine(TABLE_WIDTH, 5);
				char row_A[5][COL_LEN_MAX];//A班数据
				char row_B[5][COL_LEN_MAX];//B班数据
				char row_A_pass[5][COL_LEN_MAX];//合格率
				char row_B_pass[5][COL_LEN_MAX];//合格率
				char row_total[3][COL_LEN_MAX];//总统计
				char row_A_mean[5][COL_LEN_MAX];//A班平均分
				char row_B_mean[5][COL_LEN_MAX];//B班平均分
				sprintf(row_A[0], "%s", "A班");
				sprintf(row_A[1], "%.0f", A.Math_pass_num);
				sprintf(row_A[2], "%.0f", A.English_pass_num);
				sprintf(row_A[3], "%.0f", A.CLange_pass_num);
				sprintf(row_A[4], "%.0f", A.People);
				printTableRow(TABLE_WIDTH, row_A, 5);
				subject_mean();
				//A班平均分
				printTableMidLine_Y(TABLE_WIDTH, 5, 1);
				sprintf(row_A_mean[0], "%s", "平均分");
				sprintf(row_A_mean[1], "%.2f", (A.Math_mean / A.People));//总分/班人数
				sprintf(row_A_mean[2], "%.2f", (A.English_mean / A.People));
				sprintf(row_A_mean[3], "%.2f", (A.CLange_mean / A.People));
			    printTableRow_Y(TABLE_WIDTH, row_A_mean, 5);
				printTableTail_Y2(TABLE_WIDTH, 5);
				
				//A班合格率
				sprintf(row_A_pass[0], "%s", "合格率");
				sprintf(row_A_pass[1], "%.2f%%", (A.Math_pass_num / A.People) * 100);//合格人数/班级总人数
				sprintf(row_A_pass[2], "%.2f%%", (A.English_pass_num / A.People) * 100);
				sprintf(row_A_pass[3], "%.2f%%", (A.CLange_pass_num / A.People) * 100);
				printTableRow_Y(TABLE_WIDTH, row_A_pass, 5);
				printTableMidLine_Y(TABLE_WIDTH, 5, 0);
 
				sprintf(row_B[0], "%s", "B班");
				sprintf(row_B[1], "%.0f", B.Math_pass_num);
				sprintf(row_B[2], "%.0f", B.English_pass_num);
				sprintf(row_B[3], "%.0f", B.CLange_pass_num);
				sprintf(row_B[4], "%.0f", B.People);
				printTableRow(TABLE_WIDTH, row_B, 5);
				printTableMidLine_Y(TABLE_WIDTH, 5, 1);
				//B班平均分
				sprintf(row_B_mean[0], "%s", "平均分");
				sprintf(row_B_mean[1], "%.2f", (B.Math_mean / B.People));//总分/班人数
				sprintf(row_B_mean[2], "%.2f", (B.English_mean / B.People));
				sprintf(row_B_mean[3], "%.2f", (B.CLange_mean / B.People));
				printTableRow_Y(TABLE_WIDTH, row_B_mean, 5);
				printTableTail_Y2(TABLE_WIDTH, 5);
 
				//B班合格率
				sprintf(row_B_pass[0], "%s", "合格率");
				sprintf(row_B_pass[1], "%.2f%%", (B.Math_pass_num / B.People) * 100);//合格人数/班级总人数
				sprintf(row_B_pass[2], "%.2f%%", (B.English_pass_num / B.People) * 100);
				sprintf(row_B_pass[3], "%.2f%%", (B.CLange_pass_num / B.People) * 100);
				printTableRow_Y(TABLE_WIDTH, row_B_pass, 5);
				printTableTail_Y(TABLE_WIDTH, 5);
				printf("\n\n");
 
				printTableHead(TABLE_WIDTH,3);
				printTableRow_Y_color(TABLE_WIDTH, he, sizeof(he) / sizeof(he[0]),9,8);
				printTableMidLine(TABLE_WIDTH,3);
				sprintf(row_total[0], "%d",Student_Num);
				sprintf(row_total[1], "%.0f",man.People);
				sprintf(row_total[2], "%.0f",woman.People);
				printTableRow_Y_color(TABLE_WIDTH, row_total, 3,9,2);
				printTableTail(TABLE_WIDTH, 3);
			}
			
}
```
 


##   字体颜色函数  

```cpp
//字体颜色
void color(const unsigned short textColor)      //自定义函根据参数改变颜色 
{
	if (textColor >= 0 && textColor <= 15)     //参数在0-15的范围颜色
		SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), textColor);  //用一个参数，改变字体颜色
	else   //默认的字体颜色是白色
		SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 7);
}
```
 


##   啰嗦  
还有一些是用到封装函数就不写了，比如代码里那些 `printTableMidInfo();` `printTableHead();` 等等那些......那些都是 `设计表格` 的函数。

其实还有很多功能想做（比如管理员用户数据显示那增加一个用户最新一次的登陆时间、删除用户功能等等），但是时间紧迫后面还有好多东西得学单片机那些所以剩下的功能等有缘再做了，exe我打包好放在最后，有兴趣可以去下来玩玩，顺便帮我测测bug,然后在评论区告诉一下我，蟹蟹！

##   源码地址  

{% btns rounded grid5 %}
{% cell 下载源码|2022, https://pan.baidu.com/s/1UfhWNjLfcFa41bwebAD-iA , fas fa-download %}
{% endbtns %}

##  程序截图  

{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220315170444.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220315170602.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220315170613.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220315170632.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220315170648.png)
{% endgallery %}