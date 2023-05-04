---
title: MySQL-函数
cover: /img/num44.webp
comments: false
categories:
  - MySQL学习笔记
abbrlink: 774beab2
date: 2022-03-30 09:47:00
updated: 2022-06-03 21:40:51
---

##  函数的概述

在MySQL 中，函数非常多，主要可以分为以下几类：

- <font color='red'>聚合函数</font>
- <font color='red'>数学函数</font>
- <font color='red'>字符串函数</font>
- <font color='red'>日期函数</font>
- <font color='red'>控制流函数</font>
- <font color='red'>窗口函数</font>

##  聚合函数

{% note blue 'fas fa-fan' flat %}概念{% endnote %}

- 在MysQL中，聚合函数主要由: <font color='orange'>count,sum,min,max,avg</font>,这些聚合函数我们之前都学过，不再重复。这里我们学习另外一个函数:<font color='cornflowerblue'> group_concat()</font>，<font color='orange'>该函数用户实现行的合并</font>
- <font color='cornflowerblue'>group_concat()</font> 函数首先根据<font color='orange'>group by</font>指定的列进行分组，并且用分隔符分隔，将同一个分组中的值连接起来，返回一个字符串结果。

{% note blue 'fas fa-fan' flat %}操作{% endnote %}

 
```sql
create database mydb4;
use mydb4;

create table emp(
emp_id int primary key auto_increment comment '编号',
emp_name char(20) not null default '' comment '姓名',
salary decimal(10,2) not null default 0 comment '工资',
department char(20) not null default '' comment '部门'
);

insert into emp(emp_name , salary ,department)
values('张晶晶',5000, '财务部'),
('王飞飞', 5800,'财务部'),
('赵刚',6200, '财务部'),
('刘小贝', 5700,'人事部'),
('王大鹏',6700,'人事部'),
('张小斐' ,5200,'人事部'),
('刘云云',7500,'销售部'),
('刘云鹏',7200,'销售部'),
('刘云鹏',7800,'销售部');
```
 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203301310600.png)

```sql
-- 将所有员工的名字合并成一行
select group_concat(emp_name) from emp;
# 或（用分割符）
select group_concat(emp_name separator ';') from emp;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203301314200.png)

```
-- 指定排序方式和分隔符
select department,group_concat(emp_name separator ';') from emp group by department;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203301317885.png)

```sql
-- 按照薪资降序
select department,group_concat(emp_name order by salary desc separator ';') from emp group by department;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203301319964.png)



##  数学函数

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203301904852.jpg)

```sql
-- 求绝对值
select abs(-10); -- 10
select abs(表达式或者字段) from 表;

-- 向上取整
select ceil(1.1); -- 2
select ceil(1.0); -- 1

-- 向下取整
select floor(1.1); -- 1
select floor(1.9); -- 1

-- 取列表最大值
select greatest(1,2,3,4); -- 4
-- 取列表最小值
select least(1,2,3,4,0); -- 0
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203301914786.jpg)

```sql
-- 取模
select mod(5,2); -- 1
-- 取x的y次方
select power(2,3); -- 8
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203301917005.jpg)

```sql
-- 取随机数
select rand();
# 可以嵌套别的
select floor(rand()*100);
-- 取小数的四舍五入
select round(3.45334); -- 3
-- 将小数的四舍五入取指定位数小数
select round(3.1453323,4); -- 3.1453
-- 将小数截取到指定位数，不会四舍五入
select truncate(3.74158,2); -- 3.74
```



## 字符串函数

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203301928296.jpg)

 
```sql
-- 1.获取字符串字符个数
select char_length('hello'); -- 5
select char_length('我爱你'); -- 3

-- length取长度，返回的单位是字节
select length('hello'); -- 5
select length('我爱你'); -- 9 (在mysql里每个汉字字节长度是3)

-- 2.字符串合并
select concat('hello','world'); -- helloworld
select concat(c1,c2) from table_name;

-- 指定分隔符进行字符串合并
select concat_ws('-','hello','world'); -- hello-world

-- 3.返回字符串在列表中第一次出现的位置
select field('aaa','aaa','bbb','ccc'); -- 1
select field('bbb','aaa','bbb','ccc'); -- 2
select field('bbb','aaa','bbb','bbb'); -- 2
```
 


![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203301939624.jpg)

```sql
-- 4.去除字符串左边空格
select ltrim('    aaaa'); -- aaaa
-- 去除字符串右边空格
select rtrim('  aaaa      '); -- aaaa
-- 去除两端空格
select trim('    aaaa          '); -- aaaa  
-- 5.字符串截取
select mid("helloworld",2,3); -- ell 从第二个字符开始截取，截取长度为3
-- 6.获取字符串A在另一个字符串中第一次出现的位置
select position('abc' in 'hfsfssabcee'); -- 7
-- 7.字符串替换
select replace('helloworld','world','sb'); -- hellosb
-- 8.字符串翻转
select reverse('hello'); -- olleh
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203301952669.jpg)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203302006750.jpg)

```sql
-- 9.返回字符串的后几个字符
select right('hello',3);-- llo
-- 10.字符串比较
select strcmp('hello','hello'); -- 0
-- 11.字符串截取
select substr('hello',2,3); -- ell 从第二个字符开始截取，截取3个字符
select substring('hello',2,3); -- ell 从第二个字符开始截取，截取3个字符
-- 12.将小写转大写
select ucase('helloworld');-- HELLOWORLD
select upper('helloworld');-- HELLOWORLD
-- 13.将大写转小写
select lcase('HELLOWORLD');-- helloworld
select lower('HELLOWORLD');-- helloworld
```



```sql
select ename,substr(hiredate,1,4) from emp;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203302004741.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203302003980.png)



## 日期函数

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203302009525.jpg)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203302029824.jpg)

 
```sql
-- 1.获取时间戳（毫秒值）
select unix_timestamp();
-- 2.将一个日期字符串转为毫秒值
select unix_timestamp('2022-3-20 20:12:22'); -- 1647778342
-- 3.将时间戳毫秒值转为指定格式的日期
select from_unixtime(1647778342,'%Y-%m-%d %H:%i:%s'); -- 2022-03-20 20:12:22
-- 4.获取当前年月日
select curdate(); -- 2022-03-30
select current_date(); -- 2022-03-30
-- 5.获取当前是时分秒
select current_time(); -- 20:25:07
select curtime(); -- 20:25:07
-- 6.获取年月日 和 时分秒
select current_timestamp(); -- 2022-03-30 20:26:28
-- 7.从日期字符串中获取年月日
select date('2022-3-30 20:27:22'); -- 2022-03-30
-- 8.获取日期之间的差距（单位天）
select datediff('2022-3-20','2008-12-12'); -- 4846
```
 
{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203302032602.jpg)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203302041864.jpg)
{% endgallery %}


```sql
-- 9.获取时间的差值（秒级）
select timediff('20:21:33','10:22:45'); -- 09:58:48
-- 10.日期格式化
select date_format('2022-3-20 20:23:1','%Y-%m-%d %H:%i:%s'); -- 2022-03-20 20:23:01
-- 11.将字符串转成日期
select str_to_date('2022-3-20 20:23:12','%Y-%m-%d %H:%i:%s'); -- 2022-03-20 20:23:12
-- 12.将日期进行减法,日期向前跳转
select date_sub('2021-10-22',interval 2 day); -- 2021-10-20
-- 13.将日期进行加法，日期向后跳转
select date_add('2021-10-22',interval 2 day); -- 2021-10-24
select date_add('2021-10-22',interval 2 month); -- 2021-12-24
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203302046981.jpg)

```sql
-- 14.从日期中获取小时
select extract(hour from '2022-3-20 20:48:12'); -- 20
select extract(year from '2022-3-20 20:48:12'); -- 2022
select extract(month from '2022-3-20 20:48:12'); -- 3
-- 15.获取给定日期的最后一天
select last_day('2022-3-20'); -- 2022-03-31
-- 16.获取指定年份和天数的日期
select makedate('2022',145); -- 2022-05-25
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203302052408.jpg)

```sql
-- 17.根据日期获取年月日，时分秒
select year('2022-3-30 20:56:12'); -- 2022
select month('2022-3-30 20:56:12');-- 3 
select minute('2022-3-30 20:56:12');-- 56
select quarter('2022-3-30 20:56:12');-- 1  获取季度
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203302055377.jpg)

```sql
-- 18.根据日期获取信息
select monthname('2022-3-30 20:56:12'); -- March（获取月份的英文）
select dayname('2022-3-30 20:56:12'); -- Wednesday（获取星期几的英文）
select dayofmonth('2022-3-30 20:56:12'); -- 30（获取当月的第几天）
select dayofweek('2022-3-30 20:56:12'); -- 4（1：周日 2：周一 ....）
select dayofyear('2022-3-30 20:56:12'); -- 89（获取一年的第几天）
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203302105227.jpg)

```sql
select week('2022-3-30 20:56:12'); -- 13
select yearweek('2022-3-30'); -- 202213
select now(); -- 2022-03-30 21:09:09（获取当前时间）
```



###  日期格式

{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203302021269.jpg)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203302021162.jpg)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203302021498.jpg)
{% endgallery %}




##  控制流函数

###  if 逻辑判断语句

{% note blue 'fas fa-fan' flat %}if 逻辑判断语句{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203302112964.jpg)

```sql
select if(1+1=3,'是','不是');-- 不是
select *,if(sal>=1000,'中等','低等') flag from emp;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203302119564.png)

```sql
select ifnull(5,0); -- 5
select ifnull(null,0); -- 0
select ifnull(null,null); -- null
select *,ifnull(comm,0) comm_flg from emp;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203302122351.png)

```sql
select isnull(5); -- 0
select isnull(null); -- 1
```

```sql
select nullif(12,12);-- null
select nullif(12,13); -- 12
```



###  case when 语句

{% note blue 'fas fa-fan' flat %}case when 语句{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203302128237.jpg)

```sql
select
	case 5
		when 1 then '你好'
		when 2 then 'hello'
		when 5 then '正确'
		else
			'其他'
	end; -- 正确
	
	select
	case 
		when 1>2 then '你好'
		when 2=2 then 'hello'
		when 5>1 then '正确'
		else
			'其他'
	end as info; -- hello
```



```sql
use test1;
create table orders(
	oid int primary key,-- 订单id
	price double, -- 订单价格
	payType int -- 支付类型（1：微信支付 2：支付宝支付 3：银行卡支付 4：其他）
);

insert into orders values(1,1200,1);
insert into orders values(2,1000,2);
insert into orders values( 3,200,3);
insert into orders values(4,3000,1);
insert into orders values( 5,1500,2);
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203302206333.png)

 
```sql
# 方式一：
select 
	*,
	case payType
		when 1 then '微信支付'
		when 2 then '支付宝支付'
		when 3 then '银行卡支付'
	else
		'其他支付方式'
end as payTypeStr
from orders;
# 方式二：
select 
	*,
	case 
		when payType=1 then '微信支付'
		when payType=2 then '支付宝支付'
		when payType=3 then '银行卡支付'
	else
		'其他支付方式'
end as payTypeStr
from orders;
```
 


![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203302211907.png)

##  窗口函数（8.0新增）

{% note blue 'fas fa-fan' flat %}介绍{% endnote %}

- <font color='orange'>MySQL 8.0</font> 新增窗口函数,窗口函数又被称为<font color='cornflowerblue'>开窗函数</font>，与Oracle窗口函数类似，属于 MysQL 的一大特点
- 非聚合窗口函数是相对于聚函数来说的。聚合函数是对一组数据计算后返回单个值(即分组)，非聚合函数一次只会处理一行数据。窗口聚合函数在行记录上计算某个字段的结果时，可将窗口范围内的数据输入到聚合函数中，并<font color='cornflowerblue'>不改变行数</font>。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203302217247.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203302217018.png)

{% note blue 'fas fa-fan' flat %}分类{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203302219968.jpg)

{% note blue 'fas fa-fan' flat %}语法{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203302220408.png)

其中，<font color='orange'>window_function</font> 是窗口函数的<font color='cornflowerblue'>名称</font>; <font color='orange'>expr</font> 是<font color='cornflowerblue'>参数</font>，有些函数不需要参数；over 子句包含<font color='orange'>三个</font>选项：

- <font color='red'>分区(partition by)</font>

partition by 选项用于将数据行拆分成多个分区（组)，它的作用类似于 <font color='orange'>group by</font>分组。如果省略了 partition by，所有的数据作为一个组进行计算

- <font color='red'>排序（order by)</font>

<font color='cornflowerblue'>over </font>子句中的 order by 选项用于指定分区内的排序方式，与 order by 子句的作用<font color='cornflowerblue'>类似</font>

- <font color='red'>以及窗口大小（frame_clause）</font>

frame_clause 选项用于在当前分区内指定一个计算窗口，也就是一个与当前行相关的数据子集



###  序号排序

序号函数有三个: <font color='cornflowerblue'>row_number()</font>、<font color='cornflowerblue'>rank()</font>、<font color='cornflowerblue'>dense_rank()</font>，可以用来实现<font color='orange'>分组排序，并添加序号。</font>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203302249195.png)

 
```sql
# 数据准备
use mydb4;
create table employee(
	dname varchar(20), -- 部门名
	eid varchar(20), 
	ename varchar(20),
	hiredate date, -- 入职时间
	salary double -- 薪资
);
insert into employee values('研发部','1001','刘备','2021-11-01',3000);
insert into employee values('研发部','1002','关羽','2021-11-02',5000);
insert into employee values('研发部','1003','张飞','2021-11-03',7000);
insert into employee values ('研发部','1004 ','赵云','2021-11-04',7000);
insert into employee values('研发部',' 1005','马超','2021-11-05',4000);
insert into employee values('研发部','1006','黄忠',' 2021-11-06',4000);

insert into employee values('销售部','1007','曹操','2021-11-01',2000);
insert into employee values ('销售部','1008','许褚','2021-11-02',3000);
insert into employee values('销售部','1009','典韦','2021-11-03',5000);
insert into employee values('销售部','1010','张辽','2021-11-04',6000);
insert into employee values ('销售部','1011 ','徐晃',' 2021-11-05' ,9000);
insert into employee values ('销售部','1012','曹洪', ' 2021-11-06',6000);
```
 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203302313974.png)

```sql
-- 对每个部门员工按照薪资排序，并给出排名
select
dname,
ename,
salary,
row_number() over(partition by dname order by salary desc) as rn1,
rank() over(partition by dname order by salary desc) as rn2,
dense_rank() over(partition by dname order by salary desc) as rn3
from employee;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203302314491.png)

```sql
-- 求出每个部门薪资排在前三名的员工 - 分组求topn
select
*
from
(
	select
	dname,
	ename,
	salary,
	dense_rank() over(partition by dname order by salary desc) as rn
from employee
)t
where t.rn <= 3;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203302319657.png)

```sql
-- 对所有员工进行全局排序（不分组）
# 不加 partition by 表示全局排序
select
dname,
ename,
salary,
dense_rank() over(order by salary desc) as rn3
from employee;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203302321753.png)

###  待更新（暂时先不学）