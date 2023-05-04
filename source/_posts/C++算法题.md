---
title: C/C++算法题
cover: /img/num60.webp
comments: false
tags:
  - 算法
categories:
  - C语言学习笔记
abbrlink: 3f5d4448
date: 2022-03-11 21:33:00
updated: 2022-06-08 23:45:44
---
##  猜年龄

<font color='orange'>题目描述：</font>

美国数学家维纳(N.Wiener)智力早熟，11岁就上了大学。他曾在1935~1936年应邀来中国清华大学讲学。一次，他参加某个重要会议，年轻的脸孔引人注目。于是有人询问他的年龄，他回答说：“我年龄的<font color='red'>立方</font>是个<font color='red'>4位数</font>。我年龄的<font color='red'>4次方</font>是个<font color='red'>6位数</font>。这10个数字正好包含了从<font color='red'>0到9</font>这10个数字，每个都恰好出现<font color='red'>1次</font>。”请你推算一下，他当时到底有多年轻。

main.c
```cpp
# include <iostream>
using namespace std;
int main()
{
	int i=0;
	int I1=0;
	int I2=0;
	for (i = 10; i < 30; ++i)
	{
		I1 = i * i * i;//年龄的立方
		I2 = I1 * i;//年龄的4次方
		if (I1 >= 1000&&I1<10000 && I2>=100000&&I2<1000000)
		{
			cout << i << " " << I1 << " " << I2 << endl;
		}
	}
	return 0;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2Fbo7V10.png)

##  马虎的算式

小明是个急性子，上小学的时候经常把老师写在黑板上的题目抄错了。
    有一次，老师出的题目是：36 x 495 = ?
    他却给抄成了：396 x 45 = ?
    但结果却很戏剧性，他的答案竟然是对的！！
    因为 36 * 495 = 396 * 45 = 17820
    类似这样的巧合情况可能还有很多，比如：27 * 594 = 297 * 54
    假设 a b c d e 代表1~9不同的5个数字（注意是各不相同的数字，且不含0）
    能满足形如： <font color='red'>ab * cde = adb * ce</font> 这样的算式一共有多少种呢？

main.c
```cpp
# include <iostream>
using namespace std;
int main()
{
	int count = 0;
	for (int a = 1; a < 10; a++)
	{
		for (int b = 1; b < 10; b++)
		{
			if(a!=b)
			for (int c = 1; c < 10; c++)
			{
				if(c!=a&&c!=b)
				for (int d = 1; d < 10; d++)
				{
					if(d!=a&&d!=b&&d!=c)
					for (int e = 1; e < 10; e++)
					{
						if (e != a && e != b && e != c && e != d)
						{
							if ((a * 10 + b) * (c * 100 + d * 10 + e) == (a * 100 + d * 10 + b) * (c * 10 + e))
							{
								count++;
							}
						}
					}
				}
			}
		}
	}
	printf("%d", count);
	return 0;
}
```


![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FboXJgA.png)

##  振兴中华

小明参加了学校的趣味运动会，其中的一个项目是：跳格子。地上画着一些格子，每个格子里写一个字，如下所示：

从我做起振
我做起振兴
做起振兴中        
起振兴中华

比赛时，先站在<font color='red'>左上角</font>的写着“从”字的格子里，可以横向或纵向跳到相邻的格子里，但不能跳到对角的格子或其它位置。一直要跳到“<font color='red'>华</font>”字结束。

要求跳过的路线刚好构成“从我做起振兴中华”这句话。

请你帮助小明算一算他一共有多少种可能的跳跃路线呢？

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2Fboxv5T.png)

main.c
```cpp
# include <iostream>
using namespace std;

int fun(int x, int y)
{
	if (x == 3 || y == 4)//当这种情况代表只有一种走法
		return 1;
	return fun(x + 1, y) + fun(x, y+1);//没有走到边界有两种走法加起来就是总数
}
int main()
{
	cout << fun(0, 0) << endl;//从左上角(0,0)开始
	return 0;
}
```



##  幻方填空

幻方是把一些数字填写在方阵中，使得行、列、两条对角线的数字之和都相等。
欧洲最著名的幻方是德国数学家、画家迪勒创作的版画《忧郁》中给出的一个4阶幻方。
他把<font color='red'>1,2,3,…16</font> 这16个数字填写在4 x 4的方格中。
如图所示，即：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbTiuz8.png)

表中有些数字已经显露出来，还有些用<font color='red'>?</font>和<font color='red'>*</font>代替。
请你计算出 ?  和  *  所代表的数字

(<font color='red'>next_permutation</font>：全排列)


main.c
```cpp
# include <iostream>
# include <vector>
# include <algorithm>//全排列头文件
using namespace std;

void check(vector<int> arr)
{
	//行
	int r1 = 16 + arr[0] + arr[1] + 13;
	int r2 = arr[2]+ arr[3] + 11 + arr[4] ;
	int r3 = 9 + arr[5] + arr[6] + arr[7];
	int r4 = arr[8] + 15 + arr[9] + 1;
	//列
	int c1 = 16 + arr[2] + 9 + arr[8];
	int c2 = arr[0] + arr[3] + arr[5] +15;
	int c3 = arr[1] + 11 + arr[6] + arr[9];
	int c4 = 13 + arr[4] + arr[7] + 1;
	//对角线
	int k1 = 16 + arr[3] + arr[6] + 1;
	int k2 = 13 + 11 + arr[5] + arr[8];
	if (r1 == r2 && r2 == r3 && r3 == r4 && c1 == c2 && c2 == c3 && c3 == c4 && c4 == k1 && k1 == k2)
	{
		cout << "*:" << arr[7] << endl;
		for (int i = 0; i < 10; i++)
		{
			cout << arr[i] << "  ";
		}
		return;
	}
}
int num[] = { 2,3,4,5,6,7,8,10,12,14 };//把剩余的数字排好
int main()
{
	
	int len = sizeof(num) / sizeof(num[0]);
	vector<int> arr;
	for (int i = 0; i < len; i++)
	{
		arr.push_back(num[i]);//把数组插入到arr中
	}
	do
	{
		check(arr);
	} while (next_permutation(arr.begin(), arr.end()));

	return 0;
}
```


![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbTjhBq.png)

##  公约数公倍数

求最大公约数：<font color='orange'>辗转相除法</font>

求最小公倍数：<font color='orange'> x * y / 最大公约数</font>

<font color='red'>注意：</font><font color='cornflowerblue'>不要把计算最大公约数后的a,b拿来计算最小公倍数，要拿m,n</font>

main.c
```cpp
// 交换数值
void swap(int* a, int* b)
{
	
	int temp;
	temp = *a;
	*a = *b;
	*b = temp;
}

void myfunc(int a, int b)
{
	
	int m, n, r;
	if (a < b) swap(&a, &b);
	m = a;
	n = b;
	r = a % b;
	while (r != 0)
	{
		a = b;
		b = r;
		r = a % b;
	}
	printf("%d\n", b); // 最大公约数
	printf("%d\n",m*n/b); // 最小公倍数x*y/gcd(x,y)
}

int main()
{
	myfunc(15,20);
	return 0;
}
```


##  三部排序

一般的排序有许多经典算法，如快速排序、希尔排序等。

但实际应用时，经常会或多或少有一些特殊的要求。我们没必要套用那些经典算法，可以根据实际情况建立更好的解法。

比如，对一个整型数组中的数字进行分类排序：

使得<font color='red'>负数都靠左端，正数都靠右端，0在中部</font>。注意问题的特点是：负数区域和正数区域内并<font color='red'>不要求有序</font>。可以利用这个特点通过1次线性扫描就结束战斗!!

如果给定数组：

<font color='orange'>25,18,-2,0,16,-5,33,21,0,19,-16,25,-3,0</font>
则排序后为：
<font color='orange'>-3,-2,-16,-5,0,0,0,21,19,33,25,16,18,25</font>

以下的程序实现了该目标。
main.c
```cpp
# include <iostream>
using namespace std;
//负数左边，整数右边，0中间
void Fun(int* arr,int len)
{
	int index = 0;
	int right = len - 1;
	int left = 0;
	while (index <= right)
	{
		if (arr[index] > 0)
		{
			int temp = arr[right];
			arr[right] = arr[index];
			arr[index] = temp;
			right--;
		}
		else if (arr[index] < 0)
		{
			int temp = arr[left];
			arr[left] = arr[index];
			arr[index] = temp;
			left++;
			index++;
		}
		else
			index++;
	}
}


int main()
{
	int arr[] = { 25,18,-2,0,16,-5,33,21,0,19,-16,25,-3,0 };
	Fun(arr, sizeof(arr) / sizeof(arr[0]));
	for (int i = 0; i < sizeof(arr) / sizeof(arr[0]); i++)
	{
		cout << arr[i] << " ";
	}
	return 0;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2Fb7kMTJ.png)

##  核桃的数量

小张是软件项目经理，他带领<font color='red'>3</font>个开发组。工期紧，今天都在加班呢。为鼓舞士气，小张打算给每个组发一袋核桃（据传言能补脑）。他的要求是：

1. <font color='red'>各组的核桃数量必须相同</font>

2. 各组内必须能<font color='red'>平分核桃</font>（当然是不能打碎的）

3. 尽量提供满足1,2条件的最小数量（节约闹革命嘛）

输入格式
输入包含<font color='red'>三个正整数a, b, c，</font>表示<font color='red'>每个组正在加班的人数</font>，用空格分开<font color='red'>（a,b,c<30）</font>
输出格式
输出一个正整数，表示每袋核桃的数量。
main.c
```cpp
# include <iostream>
using namespace std;
int main()
{
	int a, b, c;
	scanf("%d %d %d", &a, &b, &c);
	for (int i = 1; i < a * b * c; i++)
	{
		if (i % a == 0 && i % b == 0 && i % c == 0)
		{
			cout << i;
			break;
		}
	}
	return 0;
}
```
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2Fb7NdYR.png)

##  猜年龄②

s夫人一向很神秘。这会儿有人问起她的年龄，她想了想说：
“<font color='red'>20年前</font>，我<font color='red'>丈夫的年龄刚好是我的2倍</font>，而<font color='red'>现在他的年龄刚好是我的1.5倍</font>”。

你能算出s夫人现在的年龄吗？
main.c
```cpp
# include <iostream>
using namespace std;
int main()
{
	for (int i = 0; i < 99; i++)
	{
		for (int j = 0; j < 99; j++)
		{
			if (i - 20 == (j - 20) * 2 && i == j * 1.5)
			{
				cout << j;
			}
		}
	}
	return 0;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2Fb7trZQ.png)

##  打印十字图

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2Fb70kqK.png)

输入格式 一个正整数 <font color='red'>n (n<30)</font> 表示要求打印图形的层数。 输出格式 对应包围层数的该标志。
main.c
```cpp
# include <stdio.h>
# include <stdlib.h>
# include <iostream>
using namespace std;
char arr[130][130];
int N;

void printAll(int l, int r)
{
	for (int i = l; i <= r; i++)
	{
		for (int j = l; j <= r; j++)
		{
			if (arr[i][j] != '$')
			{
				arr[i][j] = '.';
			}
			cout << arr[i][j] << " ";
		}
		cout << endl;
	}
}

void deal(int n)
{
	
	int l = 2*(N-n);
	int row = 9 + (n - 1) * 4;
	int col = 9 + (n - 1) * 4;
	int r = (9 + (N - 1) * 4 - 1) -l;//可以取到的最大下标

	//处理第一行和最后一行
	for (int i = l+2; i <= r - 2; i++)
	{
		arr[l][i] = '$';
		arr[r][i] = '$';
	}
	//处理第二行和倒数第二行
	arr[l+1][l+2] = '$';
	arr[l+1][r - 2] = '$';

	arr[r - 1][l+2] = '$';
	arr[r - 1][r - 2] = '$';
	//处理第三行和倒数第三行
	arr[l+2][l+0]=arr[l+2][l+1]=arr[l+2][l+2] = '$';
	arr[l+2][r] = arr[l+2][r - 1] = arr[l+2][r - 2] = '$';

	arr[r - 2][l+0] = arr[r - 2][l+1] = arr[r - 2][l+2] = '$';
	arr[r - 2][r] = arr[r - 2][r - 1] = arr[r - 2][r - 2] = '$';

	//处理两边
	for (int i = l+3; i <= r - 3; i++)
	{
		arr[i][l] = '$';
		arr[i][r] = '$';

	}
	
}

int main(int argc, char* argv[])
{
	
	scanf("%d", &N);
	for (int i = N; i >= 1; i--)
	{
		deal(i);
	}
	//十字的行列
	for (int j = 2 * N; j < 2 * N + 5; j++)
	{
		arr[2 * N + 3-1][j] = '$';
		arr[j][2 * N +2] = '$';
	}
	printAll(0, 9 + (N - 1) * 4 - 1);
	return 0;
}

```
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbHSBX4.png)