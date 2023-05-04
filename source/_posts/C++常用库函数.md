---
title: C++常用库函数
cover: /img/num37.webp
comments: false
categories:
  - C++学习笔记
abbrlink: fe9be042
date: 2022-03-12 23:24:00
updated: 2022-06-03 20:56:08
tags:
---
## next_permutation函数

排列就是一次对对象序列或值序列的重新排列。例如，“ABC”中字符可能的排列是：

```
"ABC", "ACB", "BAC", "BCA", "CAB", "CBA"
```

头文件：<font color='red'><algorithm></font>

next_permutation（）在使用前需要对欲排列数组按<font color='red'>升序排序</font>，顺序<font color='red'>从小到大</font>

当当前序列不存在下一个排列时，函数返回<font color='red'>false</font>，否则返回<font color='green'>true</font>

还有个跟它相反的函数：<font color='orange'>prev_permutation</font>

功能：输出所有比当前排列小的排列，顺序<font color='red'>从大到小</font>

### int类型

<font color='grey'>用法格式：</font>

```cpp
int a[3] = {1,2,3};
do
{
    cout << a[0] << " " << a[1] << " " << a[2] << endl;
} while (next_permutation(a, a + 3)); //参数a代表要排列的开始位置；3指的是要进行排列的长度(结束位置)
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbHq9IO.png)

### char类型

```cpp
    char arr[20];
    cin >> arr;
    char* frist =arr;
    char* last = arr+strlen(arr);
   sort(frist, last);//该语句对输入的数组进行字典升序排序
do
{
    cout << arr << endl;
} while (next_permutation(frist,last));
//这样就不必事先知道arr的大小了，是把整个arr字符串全都进行排序
//若采用 while(next_permutation(arr,arr+5)); 如果只输入1562，就会产生错误，因为arr中第五个元素指向未知
//若要整个字符串进行排序，参数5指的是数组的长度，不含结束符
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbHOZUf.png)

### string类型

```cpp
string arr = "7564";
sort(arr.begin(), arr.end());
do
{
    cout << arr << " ";
} while (next_permutation(arr.begin(), arr.end()));
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbHOhMd.png)