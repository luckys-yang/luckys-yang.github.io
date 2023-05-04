---
title: C语言-扫雷游戏
cover: /img/num59.webp
comments: false
tags:
  - 项目
categories:
  - C语言学习笔记
abbrlink: 6671ff44
date: 2022-03-05 17:50:00
updated: 2022-06-08 23:36:05
---

main.cpp
```cpp
/*********************程序源码***********************************/
# include <stdio.h>
# include <string.h>
# include <stdlib.h>
# include <easyx.h>
# include <time.h>
# include <tool.h>
# include <stdbool.h>
# include <conio.h>
# include <Commctrl.h>
# pragma comment(lib,"winmm.lib")
# define  ROW	10//行
# define	 COLS	10//列
# define  WINDOW_W	ROW*40//地图宽
# define  WINDOW_H	(COLS*40)+50//地图高
# define  IMG_W		40//图片宽
# define  IMG_H		40//图片高
# define  MINE		10//雷的数量
# define  IMG_NUM	14//素材数量
# define   MINUTE		3//关卡限时（分）
# define	  DELAY_X      50
//矩形1
# define   ROUND_X1	185
# define   ROUND_Y1	200
# define   ROUND_X2	320	
# define   ROUND_Y2	230
//矩形2
# define   ROUND2_X1	185
# define   ROUND2_Y1	250
# define   ROUND2_X2	320	
# define   ROUND2_Y2	280
//矩形3
# define   ROUND3_X1	185
# define   ROUND3_Y1	300
# define   ROUND3_X2	320	
# define   ROUND3_Y2	330
//矩形4
# define   ROUND4_X1	185
# define   ROUND4_Y1	350
# define   ROUND4_X2	320	
# define   ROUND4_Y2	380
//客服按钮
# define   SER_X1	0
# define   SER_Y1	31
# define   SER_X2	104	
# define   SER_Y2	55
 
 
 
 
void init(int map[][COLS]);
void create_mine(int map[][COLS]);
void Show(int map[][COLS]);
void mine_Sodoku(int map[][COLS]);
void load_img(IMAGE TP[]);
void draw(int map[][COLS], IMAGE TP[]);
void mouse_handle(ExMessage* m, int map[][COLS], int r, int c,int flag,int m_x,int m_y);
void blank_chain(int map[][COLS], int r, int c);
int win_lose(int map[][COLS]);
void menu(ExMessage* m2);
void count_down(int m, int s, IMAGE TP2[]);
void Loading();
static int min = MINUTE;//分
static int s = 60;//秒
static double t = 0;//当t满足条件s--
static int X = DELAY_X;
bool face = true; //true:笑脸 false:哭脸
bool key = false;//true:开始计时 false:未开始
bool landing = false;
int main()
{
	
//主页面	
HOME:
	{
		static double i =500;//公告字体
		double run3 = 0;
		initgraph(505, 500,EW_SHOWCONSOLE);//EW_SHOWCONSOLE
		system("color fd");
		IMAGE TuPian[3];//背景和标题
		IMAGE Gif[14];//斩杀图
		IMAGE Lightning[8];//闪电图
		IMAGE Bulletin;//公告栏
		IMAGE Woman[8];//女孩
		IMAGE Service;//客服
		mciSendString("open music/wzry.mp3", 0, 0, 0);
		mciSendString("play music/wzry.mp3 repeat", 0, 0, 0);
		char s1[] = "公告:尊敬的扫雷玩家您好：自2022年1月15日开始《扫雷游戏》将推出“防白嫖系统”，请自觉充钱！充钱不白嫖，白嫖要充钱！  修复了一些bug:①修复了平民玩家过多的问题②修复了不充钱还能玩的bug③优化了没钱玩你麻痹的效果";
		int len = strlen(s1);
		char s[10];
		char a2[50];
		for (int i = 1; i < 14; i++)
		{
			sprintf(a2, "gif/%d.png", i);
			loadimage(Gif + i, a2, 300, 300);
		}
		for (int j =0; j <8; j++)
		{
			sprintf(a2, "gif/0%d.png",j);
			loadimage(Lightning +j, a2, 64, 240);
			sprintf(a2, "gif/000%d.png", j);
			loadimage(Woman + j, a2, 88, 78);
		}
		
		loadimage(TuPian + 0, "images/sky.jpg", 505, 500, 0);
		loadimage(TuPian + 2, "images/bt.png", 395, 125, 0);
		loadimage(&Service, "images/kf.png", 104, 26, 0);
		loadimage(&Bulletin,"images/dhk.png", 520,30);
		BeginBatchDraw();	//开始双缓冲绘图
		while (1)
		{
			cleardevice();
			Sleep(5);
			putimage(0, 0, TuPian + 0, SRCPAINT);
			drawImg(20, 50, TuPian + 2);
			drawImg(0,30, &Service);
			static int z2 = 0;
			static int z3 = 0;
			static int flag4 = 0;
			
			drawImg(-5, 0, &Bulletin);
			drawImg(80,100 , Gif + z2);
			drawImg(380, 0, Lightning + z3);
			drawImg(run3, 428, Woman + z3);
			flag4++;
			run3 ++;
			if (flag4 ==7)
			{
				z2++;
				z3++;
				flag4 = 0;
			}
			if (z2 == 14)
			{
				z2 = 0;
			}
			if (z3 == 8)
			{
				z3 = 0;
			}
			if (run3 >= 593)
			{
				run3 =-88;
			}
			settextstyle(20, 0, "华文新魏");
			settextcolor(RGB(128, 255, 255));
		    outtextxy(i, 1,s1);
			 Loading();
			ExMessage m2;
			if (peekmessage(&m2, EM_MOUSE))
			{
				int r2 = m2.x;//行
				int c2 = m2.y;//列
				
				switch (m2.message)
				{
				case WM_LBUTTONDOWN:
				{
					
					if ((r2 >= ROUND_X1 && r2 <= ROUND_X2) && (c2 >= ROUND_Y1 && c2 <= ROUND_Y2))
					{
						PlaySound("music/6.wav", NULL, SND_ASYNC | SND_FILENAME);
						if (landing==true)
						{
							
							i = 500;
							mciSendString("close music/wzry.mp3", 0, 0, 0);
							goto GAME;
						}
						else if (landing ==false)
						{
							int select4= MessageBox(GetHWnd(), "请先登陆！！！！", "麻豆传媒", MB_OKCANCEL);
							if (select4 == IDOK)
							{
								;
							}
							else
							{
								;
							}
						}
							
					}
					else if ((r2 >= ROUND2_X1 && r2 <= ROUND2_X2) && (c2 >= ROUND2_Y1 && c2 <= ROUND2_Y2))
					{
						PlaySound("music/6.wav", NULL, SND_ASYNC | SND_FILENAME);
						i = 500;
						goto Top_up;
					}
					else if ((r2 >= ROUND3_X1 && r2 <= ROUND3_X2) && (c2 >= ROUND3_Y1 && c2 <= ROUND3_Y2))
					{
						if (landing == false)
						{
							PlaySound("music/6.wav", NULL, SND_ASYNC | SND_FILENAME);
							i = 500;
							goto Convert;
						}
						else
						{
							int select5 = MessageBox(GetHWnd(), "已登陆，无须再登陆！", "麻豆传媒", MB_OKCANCEL);
							if (select5 == IDOK)
							{
								;
							}
							else
							{
								;
							}
						}
						
						
					}
					else if ((r2 >= ROUND4_X1 && r2 <= ROUND4_X2) && (c2 >= ROUND4_Y1 && c2 <= ROUND4_Y2))
					{
						int select6 = MessageBox(GetHWnd(), "是否退出？", "麻豆传媒", MB_OKCANCEL);
						if (select6== IDOK)
						{
							exit(0);
						}
						else
						{
							;
						}
					}
					else if ((r2 >= SER_X1 && r2 <= SER_X2) && (c2 >= SER_Y1 && c2 <= SER_Y2))
					{
						PlaySound("music/6.wav", NULL, SND_ASYNC | SND_FILENAME);
						i = 500;
						goto Ser;
					}
					break;
				}
				}
			}
			menu(&m2);
			
			i-=1;
			if (i ==(double)(-40)+(-10*len))
			{
				i = 500;
			}
			
			FlushBatchDraw();	//刷新
			
		}
		EndBatchDraw();
	}
	//客服
Ser:
	{
		initgraph(435,225);
		IMAGE Black;//黑背景
		IMAGE Tx;//头像
		IMAGE TxK[11];//头像框
		IMAGE QQ[2];//QQ图标
		IMAGE Return[2];//返回
		static int z4= 0;
		static int flag6 = 0;
		loadimage(&Black, "images/black.png", 450, 240);
		loadimage(&Tx, "images/Tx.png", 50,50);
		loadimage(Return+0, "images/return2.png", 113, 27);
		loadimage(Return +1, "images/return22.png", 113, 27);
		char a4[20];
		for (int i =0; i <11; i++)
		{
			sprintf(a4, "gif/0000%d.png", i);
			loadimage(TxK + i, a4, 50, 50);
		}
		loadimage(QQ+0, "images/qq1.png", 35, 35);
		loadimage(QQ +1, "images/qq.png", 35, 35);
		BeginBatchDraw();
		while (1)
		{
			
			putimage(-8,-8, &Black);
			putimage(90,60, &Tx);
			drawImg(90,60, TxK + z4);
			putimage(180, 80, QQ + 0, SRCPAINT);//黑白图
			putimage(180, 80, QQ + 1, SRCAND); //原图
			putimage(320, 15, Return + 0, SRCPAINT);//黑白图
			putimage(320, 15, Return + 1, SRCAND); //原图
			
			flag6++;
			if (flag6 ==500)
			{
				z4++;
				flag6 = 0;
			}
			if (z4 == 11)
			{
				z4 = 0;
			}
			setbkmode(TRANSPARENT);//透明
			settextcolor(BLACK);
			settextstyle(20, 0, "华文新魏");
			outtextxy(175, 60, "作者:");
 
			settextcolor(BLUE);
			settextstyle(20,0, "隶书");
			outtextxy(230, 60, "蓝色的羽");
			settextcolor(RGB(0, 255, 255));
			outtextxy(230, 90, "444783764");
 
			settextcolor(BLACK);
			settextstyle(15, 0, "宋体");
			outtextxy(30, 130, "游戏信息:");
			outtextxy(95, 130, "《扫雷简单版》制作于2022.1.15,完成于1.17,");
			outtextxy(95, 150, "代码1000行左右,纯属娱乐");
			ExMessage m4;
			if (peekmessage(&m4, EM_MOUSE))
			{
				int r4 = m4.x;//行
				int c4 = m4.y;//列
				switch (m4.message)
				{
				case WM_LBUTTONDOWN:
				{
					if ((r4 >=330 && r4 <= 420) && (c4 >=16 && c4 <= 40))
					{
						PlaySound("music/6.wav", NULL, SND_ASYNC | SND_FILENAME);
						goto HOME;
					}
				}
				}
			}
 
			
 
			
 
			FlushBatchDraw();	//刷新
		}
		EndBatchDraw();
	}
	
//登陆入口
Convert:
	{
		int flag2 = 0;
		char ID[] = "5201314";
		char PassWord[] = "a123456";
		char R[] = "RETURN";
		char id[100];
		char ch1;
		char password[100];
		int count1 =2;
		int count3 =2;
	Print:
		{
			while (1)
			{
				printf("*********************登陆界面*********************\n");
				printf("**************************************************\n");
				printf("**************************************************\n");
				printf("********************1.请输入账号******************\n");
				printf("********************2.请输入密码******************\n");
				printf("********************3. 回车登陆 ******************\n");
				printf("*********4.任意地方输入'RETURN'则返回主页面*******\n");
 
				while (count1 > 0)
				{
					printf("请输入账号：");
					scanf("%s", id);
					//判断是否相同，相同则返回主页面
					if (strcmp(R, id) == 0)
					{
						system("cls");
						goto HOME;
					}
					int len1 = strlen(ID);
					int len2 = strlen(id);
					if (len1 != len2)
					{
						printf("账号错误！\n");
						Sleep(200);
						system("cls");
						goto Print;
 
					}
					else if (len1 == len2)
					{
						for (int i = 0; i < len2; i++)
						{
							if (id[i] != ID[i])
							{
								count1 = 1;
								i = len2;
								printf("账号错误！\n");
								Sleep(200);
								system("cls");
								goto Print;
							}
							else
							{
								count1 = 0;
								i = len2;
							}
						}
					}
				}
				printf("请输入密码：");
				while (count3 > 0)
				{
					
					while ((ch1 = getch()) != '\r')
					{
 
						if ((ch1 == '\b'))
						{
							if (flag2 > 0)
							{
								flag2--;
								printf("\b \b");
							}
							else
								flag2 = 0;
 
						}
						else
						{
							password[flag2++] = ch1;
							printf("*");
						}
 
					}
					password[flag2] = '\0';
					int len3 = strlen(PassWord);
					int len4 = strlen(password);
					//判断是否相同，相同则返回主页面
					if (strcmp(R, password) == 0)
					{
						system("cls");
						goto HOME;
					}
					if (len3 != len4)
					{
						//密码输入错误则重新回到起点
						password[99] = { 0 };
						flag2 = 0;
						for (int i = 0; i <len4; i++)
						{
							printf("\b \b");
						}
						
						Sleep(200);
					}
					else if (len3 == len4)
					{
						for (int j = 0; j < len4; j++)
						{
 
							if (PassWord[j] != password[j])
							{
								count3++;
								password[99] = { 0 };
								flag2 = 0;
								for (int j = 0; j < len4; j++)
								{
									printf("\b \b");
								}
								Sleep(200);
								
							}
							else if(j==len4-1&&count3==2)
							{
								count3 = 0;
							}
						}
					}
				}
				break;
			}
		}
		
		if (count1 == count3)
		{
			printf("\n");
			printf("登陆成功！\n");
			for (int i = 3; i > 0; i--)
			{
				printf("还有%d秒返回主页面！\n",i);
				Sleep(1000);
			}
			landing = true;
			system("cls");
			
			goto HOME;
		}
	}
	//充值入口
Top_up:
	{
		initgraph(505, 500);
		IMAGE TP3[2];//二维码和返回
		IMAGE Man[8];//男孩
		char a3[20];
		for (int k = 0; k <8; k++)
		{
			sprintf(a3, "gif/00%d.png", k);
			loadimage(Man + k, a3, 80, 74);
		}
		double run2 = 0;
		BeginBatchDraw();	//开始双缓冲绘图
		while (1)
		{
			loadimage(TP3+ 0, "images/QR.jpg", 505, 500, 0);
			loadimage(TP3 +1, "images/return.png", 90,35, 0);
			putimage(0, 0, TP3 + 0);
			drawImg(6,450, TP3 +1);
			static int z3 = 0;
			static int flag5= 0;
			drawImg(run2, 0, Man+z3);
			run2+=0.5;
			flag5++;
			if (flag5==15)
			{
				z3++;
				flag5= 0;
			}
			if (z3 ==8)
			{
				z3 = 0;
			}
			if (run2 >= 505)
			{
				run2 = 0;
			}
			ExMessage m3;
			if (peekmessage(&m3, EM_MOUSE))
			{
				int r3 = m3.x;//行
				int c3 = m3.y;//列
				switch (m3.message)
				{
				case WM_LBUTTONDOWN:
				{
					if ((r3 >= 6 && r3<= 90) && (c3 >= 450 && c3<= 480))
					{
						PlaySound("music/6.wav", NULL, SND_ASYNC | SND_FILENAME);
						goto HOME;
					}
				}
				}
			}
			FlushBatchDraw();	//刷新
		}
		EndBatchDraw();
		
	}
	
	
//游戏页面
GAME:
	{
		initgraph(WINDOW_W, WINDOW_H);//地图 EW_SHOWCONSOLE
		int map[ROW][COLS] = { 0 };
		srand((unsigned int)time(NULL));//随机
		IMAGE TP[IMG_NUM];//定义素材
		IMAGE TP2[5];
		mciSendString("open music/2.mp3", 0, 0, 0);
		mciSendString("open music/3.mp3", 0, 0, 0);
		mciSendString("play music/2.mp3 repeat", 0, 0, 0);
		load_img(TP);
		init(map);
 
		BeginBatchDraw();	//开始双缓冲绘图
		while (1)
		{
			
			int win =1;
			count_down(min, s,TP2);
			
			ExMessage m;//定义鼠标消息
			static int flag = 1;//右键切换标记
		
			draw(map, TP);//绘图
			
			if (peekmessage(&m, EM_MOUSE))//如果获取到一条鼠标消息
			{
 
				//鼠标的坐标对应数组下标
				int r = m.y / IMG_H;//行
				int c = m.x / IMG_W;//列
				int m_x = m.x;//鼠标坐标
				int m_y = m.y;
				mouse_handle(&m, map, r, c, flag,m_x,m_y);
				win = win_lose(map);
				//赢
				if (win == 0)
				{
					X--;
					if (X ==30)
					{
						int select2 = MessageBox(GetHWnd(), "恭喜你，通关！是否返回主页面？", "麻豆传媒", MB_OKCANCEL);
						if (select2 == IDOK)
						{
							mciSendString("close music/3.mp3 ", 0, 0, 0);
							X = DELAY_X;
							min = MINUTE;
							s = 60;
							t = 0;
							init(map);
							goto HOME;
 
						}
						else
						{
							mciSendString("close music/3.mp3 ", 0, 0, 0);
							X = DELAY_X;
							min = MINUTE;
							s = 60;
							t = 0;
							init(map);
						}
							
					}
					
				}
				if (win == -1)
				{
					X--;
					if (X== 0)
					{
						int select3 = MessageBox(GetHWnd(), "踩雷专家！ 是否返回主页面？","麻豆传媒" ,MB_OKCANCEL);
						if (select3 == IDOK)
						{
							mciSendString("close music/3.mp3 ", 0, 0, 0);
							mciSendString("close music/2.mp3 ", 0, 0, 0);
							win = 1;
							X = DELAY_X;
							min = MINUTE;
							s = 60;
							t = 0;
							init(map);
							goto HOME;
						}
						else
						{
							mciSendString("close music/3.mp3 ", 0, 0, 0);
							X = DELAY_X;
							min = MINUTE;
							s = 60;
							t = 0;
							init(map);
						}
							
					}
					
 
				}
			}
			
			if (face == false)
			{
				
				mciSendString("close music/3.mp3 ", 0, 0, 0);
					X--;
					if (X==0)
					{
						min = MINUTE;
						s = 60;
						t = 0;
						init(map);
						X=DELAY_X;
						face = true;
					}	
			}
			
			if (key==true)
			{
				t++;
			}
			
			if ((t == 400)&&(win==1))
			{
				s--;
				t = 0;
			}
			else if (s == 0)
			{
				min--;
				s = 60;
			}
			else if (min < 0)//当时间到则弹出提示框选择
			{
				int select = MessageBox(GetHWnd(), "时间到了，重开吧你！按“确定”重新玩，按”否“退出", "麻豆传媒", MB_OKCANCEL);
				if (select == IDOK)//重新玩
				{
					mciSendString("close music/3.mp3 ", 0, 0, 0);
					min = MINUTE;
					s = 60;
					init(map);
				}
				else
				{
					exit(0);
				}
			}
 
			FlushBatchDraw();	//刷新
		}
		EndBatchDraw();
	}
	
	while (1);
	return 0;
}
//初始化
void init(int map[][COLS])
{
	key =false;
	memset(map, 0, sizeof(int) * ROW * COLS);//把map全部初始化为0
	create_mine(map);
	mine_Sodoku(map);
	//Show(map);
}
//显示
void Show(int map[][COLS])
{
	for (int i = 0; i < ROW; i++)
	{
		for (int j = 0; j < COLS; j++)
		{
			printf("%2d ", map[i][j]);
		}
		printf("\n");
	}
}
//随机生成雷
void create_mine(int map[][COLS])
{
	for (int i = 0; i <MINE;)
	{
		int r = rand() %ROW;
		int c = rand() %COLS;
		if (map[r][c] == 0)
		{
			map[r][c] = -1;
			++i;
		}
	}
}
//雷周围的九宫格
void mine_Sodoku(int map[][COLS])
{
	for (int i = 0; i < ROW; i++)
	{
		for (int j = 0; j < COLS; j++)
		{
			if (map[i][j] == -1)
			{
				for (int r = i - 1; r <= i + 1; r++)
				{
					for (int c = j - 1; c <= j + 1; c++)
					{
						if ((map[r][c]!=-1)&&(r >= 0 && r < 10 && c >= 0 && c < 10))//排除雷并且在范围内
						{
							map[r][c] += 1;
						}
						
					}
				}
			}
		}
	}
	for (int i2 = 0; i2 < ROW; i2++)
	{
		for (int j2 = 0; j2 < COLS; j2++)
		{
			map[i2][j2] += 20;
		}
	}
}
//加载图片
void load_img(IMAGE TP[])
{
	char arr[50];
	for (int i = 0; i < IMG_NUM; i++)
	{
		sprintf(arr, "images/%d.jpg", i);
		loadimage(TP+i, arr, IMG_W,IMG_H, 0);
	}
	
}
//绘制图片
void draw(int map[][COLS], IMAGE TP[])
{
	for (int i = 0; i <ROW; i++)
	{
		for (int j = 0; j <COLS; j++)
		{
			if (map[i][j] >= -1 && map[i][j] <= 8)
			{
				switch (map[i][j])
				{
				case 0:putimage(j * IMG_W, i * IMG_H, TP + 0); break;//注意这里不要反了不然数据和实际图片不同
				case 1:putimage(j * IMG_W, i * IMG_H, TP + 1); break;
				case 2:putimage(j * IMG_W, i * IMG_H, TP + 2); break;
				case 3:putimage(j * IMG_W, i * IMG_H, TP + 3); break;
				case 4:putimage(j * IMG_W, i * IMG_H, TP + 4); break;
				case 5:putimage(j * IMG_W, i * IMG_H, TP + 5); break;
				case 6:putimage(j * IMG_W, i * IMG_H, TP + 6); break;
				case 7:putimage(j * IMG_W, i * IMG_H, TP + 7); break;
				case 8:putimage(j * IMG_W, i * IMG_H, TP + 8); break;
				case -1:putimage(j * IMG_W, i * IMG_H, TP + 9); break;
				}
			}
			else if (map[i][j] >= 19 && map[i][j] <= 28)//贴白盒子
			{
				putimage(j * IMG_W, i * IMG_H, TP +10);
			}
			else if (map[i][j] >= 39 && map[i][j] <= 48)//贴旗
			{
				putimage(j * IMG_W, i * IMG_H, TP + 11);
			}
			else if (map[i][j] >= 59 && map[i][j] <= 68)//贴问号
			{
				putimage(j * IMG_W, i * IMG_H, TP + 12);
			}
			else if (map[i][j] == -2)
			{
				putimage(j * IMG_W, i * IMG_H, TP + 13);
			}
			
		}
	}
	
}
 
//鼠标操作
void mouse_handle(ExMessage* m,int map[][COLS],int r,int c,int flag,int m_x,int m_y)
{
	
	switch ((*m).message)
	{
		
	case WM_LBUTTONDOWN://左键打开盒子
	{
		key = true;
		if (map[r][c] > 19 && map[r][c] <= 28&&map[r][c]!=20)
		{
			
			
			PlaySound("music/0.wav", NULL, SND_ASYNC | SND_FILENAME);//异步播放，只能播放wav格式
			Sleep(80);
			map[r][c] -= 20;
			
			break;
		}
		else if (map[r][c] == 20)//如果点到空白就展开
		{	
			PlaySound("music/1.wav", NULL, SND_ASYNC | SND_FILENAME);
			blank_chain(map,r,c);
			break;
		}
		else if (map[r][c] == 19)//如果点到炸弹
		{
			mciSendString("play music/3.mp3 ", 0, 0, 0);
			map[r][c] -=21;
			for (int i = 0; i < ROW; i++)
			{
				for (int j = 0; j < COLS; j++)
				{
					if (map[i][j] == 19)
					{
						map[i][j] -= 20;
						
					}
				}
			}	
		}
		else if (m_x >= 166 && m_x <= 206 && m_y >= 405 && m_y <= 445)
		{
			PlaySound("music/5.wav", NULL, SND_ASYNC | SND_FILENAME);
			face = !face;
		}
		break;
	}
	case WM_RBUTTONDOWN://右键插旗/插问号
	{
		
		switch (flag)
		{
		case 1:
		{
			if (map[r][c] >= 19 && map[r][c] <= 28)
			{
				PlaySound("music/4.wav", NULL, SND_ASYNC | SND_FILENAME);
				map[r][c] += 20;
				flag = 2;
				break;
			}
		}
		case 2:
		{
			if (map[r][c] >= 39 && map[r][c] <= 48)
			{
				PlaySound("music/4.wav", NULL, SND_ASYNC | SND_FILENAME);
				map[r][c] += 20;
				flag = 3;
				break;
			}
		}
		case 3:
		{
			if (map[r][c] >= 59 && map[r][c] <= 68)
			{
				PlaySound("music/4.wav", NULL, SND_ASYNC | SND_FILENAME);
				map[r][c] -= 40;
				flag = 1;
				break;
			}
		}
		}
 
	}
	}
	
}
//空白就炸开当前点击的下标
void blank_chain(int map[][COLS],int r,int c)
{
	for (int i = r - 1; i <= r + 1; i++)
	{
		for (int j = c - 1; j <= c + 1; j++)
		{
			if ((map[i][j] != -1) && (i >= 0
				&& i < 10 && j >= 0 && j < 10) 
				&& (map[i][j] >= 19 && map[i][j] <= 28))//不是炸弹并且是关闭状态，不能越界
			{
				map[i][j] -= 20;
				blank_chain(map, r, c);//递归
			}
		}
	}
}
//倒计时
void count_down(int m,int s, IMAGE TP2[])
{
	loadimage(TP2+0, "images/14.jpg", WINDOW_W, WINDOW_H, 0);
	loadimage(TP2+1, "images/face1.jpg", IMG_W+13, IMG_H+13, 0);
	loadimage(TP2+2, "images/face.jpg", IMG_W+13,IMG_H+13, 0);
	loadimage(TP2 +3, "images/cry1.jpg", IMG_W+13, IMG_H+13, 0);
	loadimage(TP2 +4, "images/cry.jpg", IMG_W+13, IMG_H+13, 0);
	putimage(0, 300, TP2+0);
	if (face)
	{
		putimage(160, 400, TP2 + 1, SRCPAINT);//黑白图
		putimage(160, 400, TP2 + 2, SRCAND); //原图
	}
	else
	{
		putimage(160, 400, TP2 + 3, SRCPAINT);//黑白图
		putimage(160, 400, TP2 + 4, SRCAND); //原图
	}
		char arr[50];
		sprintf(arr, "剩余时间:%d ：%d",m,s);
		setbkmode(TRANSPARENT);//透明
		settextstyle(20, 0, "华文新魏");
		settextcolor(BLACK);
		outtextxy(250, 420, arr);
}
int win_lose(int map[][COLS])
{
	int count = 0;//记录打开盒子的个数
	int count2= 0;
	for (int i = 0; i < ROW; i++)
	{
		for (int j = 0; j < COLS; j++)
		{
			if (map[i][j] >= 0 && map[i][j] <= 8)
				count++;
			if (map[i][j] == -2)
			{
				count2++;
			}
		}
 
	}
	if (count == ROW * COLS - MINE)
	{
		return 0;
	}
	else if (count2>0)
	{
		return -1;
	}
	else
		return 1;
}
 
void menu(ExMessage* m2)
{
	//感应鼠标的位置
	setbkmode(TRANSPARENT);//透明
	if ((m2->x >= ROUND_X1 && m2->x <= ROUND_X2) && (m2->y >= ROUND_Y1 && m2->y <= ROUND_Y2))
	{
		setlinecolor(RED);
		setfillcolor(BLACK);
		fillroundrect(ROUND_X1, ROUND_Y1, ROUND_X2, ROUND_Y2, 20, 30);
	}
	else
	{
		setlinecolor(RED);
		setfillcolor(LIGHTMAGENTA);
		fillroundrect(ROUND_X1, ROUND_Y1, ROUND_X2, ROUND_Y2, 20, 30);
	}
	settextstyle(30, 0, "华文新魏");
	settextcolor(YELLOW);
	outtextxy(195, 200, "进入游戏");
	
	
	if ((m2->x >= ROUND2_X1 && m2->x <= ROUND2_X2) && (m2->y >= ROUND2_Y1 && m2->y <= ROUND2_Y2))
	{
		setlinecolor(RED);
		setfillcolor(BLACK);
		fillroundrect(ROUND2_X1, ROUND2_Y1, ROUND2_X2, ROUND2_Y2, 20, 30);
	}
	else
	{
		setlinecolor(RED);
		setfillcolor(LIGHTMAGENTA);
		fillroundrect(ROUND2_X1, ROUND2_Y1, ROUND2_X2, ROUND2_Y2, 20, 30);
	}
	settextstyle(30, 0, "华文新魏");
	settextcolor(YELLOW);
	outtextxy(195, 250, "充值入口");
	
	if ((m2->x >= ROUND3_X1 && m2->x <= ROUND3_X2) && (m2->y >= ROUND3_Y1 && m2->y <= ROUND3_Y2))
	{
		setlinecolor(RED);
		setfillcolor(BLACK);
		fillroundrect(ROUND3_X1, ROUND3_Y1, ROUND3_X2, ROUND3_Y2, 20, 30);
	}
	else
	{
		setlinecolor(RED);
		setfillcolor(LIGHTMAGENTA);
		fillroundrect(ROUND3_X1, ROUND3_Y1, ROUND3_X2, ROUND3_Y2, 20, 30);
	}
	settextstyle(30, 0, "华文新魏");
	settextcolor(RED);
	settextcolor(YELLOW);
	outtextxy(195, 300, "登陆入口");
 
	if ((m2->x >= ROUND4_X1 && m2->x <= ROUND4_X2) && (m2->y >= ROUND4_Y1 && m2->y <= ROUND4_Y2))
	{
		setlinecolor(RED);
		setfillcolor(BLACK);
		fillroundrect(ROUND4_X1, ROUND4_Y1, ROUND4_X2, ROUND4_Y2, 20, 30);
	}
	else
	{
		setlinecolor(RED);
		setfillcolor(LIGHTMAGENTA);
		fillroundrect(ROUND4_X1, ROUND4_Y1, ROUND4_X2, ROUND4_Y2, 20, 30);
	}
	settextstyle(30, 0, "华文新魏");
	settextcolor(YELLOW);
	outtextxy(195, 350, "退出程序");
}
	
//加载图片
void Loading()
{
	
	static double run =-160;
	IMAGE Dog[6];
	IMAGE Gif[14];
	
	//定义结构体
	struct Sprite
	{
	    int x;
		int y;
		int w;
		int h;
 
	};
	Sprite dog
	{
		dog.x = run,
		dog.y = 435,
		dog.w = 102,
		dog.h = 72,
	};
	char a[50];
	for (int i = 1; i <6; i++)
	{
		sprintf(a, "images/0%d.png", i);
		loadimage(Dog + (i - 1), a, dog.w, dog.h);
	}
	
	static int z = 0;
	static int flag3 = 0;
 
	drawImg(dog.x, dog.y, Dog + z);
	flag3++;
	run++;	
	if (flag3 ==5)
	{
		z++;
		flag3 = 0;
	}
	if (z ==5)
	{
		z = 0;
	}
	if (dog.x >=505)
	{
		run = -160;
	}
	
	
}
```

运行示例：

<div class="video-bilibili">
  <iframe
    src="https://player.bilibili.com/player.html?aid=808216415&bvid=BV1G34y1i7YG&cid=486737542&page=1"
    scrolling="no"
    border="0"
    frameborder="no"
    framespacing="0"
    high_quality="1"
    danmaku="1"
    allowfullscreen="true"
  ></iframe>
</div>

{% btns rounded grid5 %}
{% cell 下载源码|2022, https://pan.baidu.com/s/1UfhWNjLfcFa41bwebAD-iA , fas fa-download %}
{% endbtns %}
