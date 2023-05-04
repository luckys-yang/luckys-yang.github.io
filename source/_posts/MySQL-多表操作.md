---
title: MySQL-多表操作
cover: /img/num43.webp
comments: false
categories:
  - MySQL学习笔记
abbrlink: f93574d6
date: 2022-03-28 15:29:00
updated: 2022-06-03 21:36:08
---
## 多表关系

{% note blue 'fas fa-fan' flat %}多表关系{% endnote %}

MySQL 多表之间的关系可以概括为：<font color='orange'>一对一，一对多/多对一关系，多对多</font>

{% note blue 'fas fa-fan' flat %}一对一关系{% endnote %}

- 一个学生只有一张身份证; 一张身份证只能对应一学生。
- 在任一表中添加<font color='orange'>唯一外键</font>，指向<font color='orange'>另一方主键</font>，确保<font color='cornflowerblue'>一对一</font>关系。
- 一般<font color='cornflowerblue'>一对一</font>关系很少见，遇到<font color='orange'>一对一关系的表最好是合并表</font>。

{% note blue 'fas fa-fan' flat %}一对多/多对一关系{% endnote %}

部门和员工

分析：一个部门有多个员工，一个员工只能对应一个部门

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203281548599.png)

{% note blue 'fas fa-fan' flat %}多对多关系{% endnote %}

学生和课程

分析：一个学生可以选择很多门课程，一个课程也可以被很多学生选择

原则：多对多关系实现需要借助<font color='orange'>第三张中间表</font>。中间表<font color='orange'>至少包含两个字段</font>，<font color='cornflowerblue'>将多对多的关系，拆成一对多的关系</font>，中间表<font color='orange'>至少要有两个外键</font>，<font color='cornflowerblue'>这两个外键分别指向原来的那两张表的主键</font>。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203281556330.jpg)



## 外键约束简介

{% note blue 'fas fa-fan' flat %}介绍{% endnote %}

MySQL 外键约束 (<font color='orange'>foreign key</font>) 是表的一个特殊字段，经常与<font color='cornflowerblue'>主键约束</font>一起使用。对于两个具有关联关系的表而言，相关联字段中<font color='orange'>主键所在的表就是主表</font>（<font color='cornflowerblue'>父表</font>)，<font color='orange'>外键所在的表就是从表</font>（<font color='cornflowerblue'>子表</font>)。

外键用来建立<font color='cornflowerblue'>主表与从表</font>的关联关系，为两个表的数据<font color='cornflowerblue'>建立连接</font>，约束两个表中数据的<font color='cornflowerblue'>一致性和完整性</font>。<font color='green'>比如</font>，一个水果摊，只有苹果、桃子、李子、西瓜等4种水果，那么，你来到水果摊要买水果就只能选择苹果、桃子、李子和西瓜，其它的水果都是不能购买的。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203281605579.png)

{% note blue 'fas fa-fan' flat %}定义一个外键时，需要遵守下列规则{% endnote %}

- <font color='orange'>主表必须已经存在</font>于数据库中，或者是<font color='orange'>当前正在创建的表</font>。
- <font color='orange'>必须为主表定义主键。</font>
- 主键<font color='orange'>不能包含空值</font>，但<font color='orange'>允许在外键中出现空值</font>。也就是说，只要外键的每个非空值出现在指定的主键中，这个外键的内容就是<font color='cornflowerblue'>正确</font>的。
- 在主表的表名后面<font color='cornflowerblue'>指定列名或列名的组合</font>。这个列或列的组合必须是主<font color='orange'>表的主键或候选键。</font>
- 外键中<font color='orange'>列的数目必须和主表的主键中列的数目相同</font>。
- 外键中<font color='orange'>列的数据类型必须和主表主键中对应列的数据类型相同</font>。



##  创建外键约束

{% note blue 'fas fa-fan' flat %}方式一{% endnote %}

在创建表时设置外键约束

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203281618770.png)

{% note blue 'fas fa-fan' flat %}操作{% endnote %}

```sql
-- 创建部门表-- 主表
create table if not exists dept(
	detpno varchar(20) primary key,-- 部门号 主键列
	name varchar(20) -- 部门名字
);
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203281634341.png)

```sql
-- 创建员工表，并创建外键约束（方式一）
create table if not exists emp(
	eid varchar(20) primary key,-- 员工编号
	ename varchar(20),-- 员工名字
	age int,-- 员工年龄
	dept_id varchar(20), -- 员工所属部门
	foreign  key(dept_id) references dept(detpno) 
);

```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203281634228.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203281639317.png)

{% note blue 'fas fa-fan' flat %}方式二{% endnote %}

在创建表后设置外键约束

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203281642087.png)

{% note blue 'fas fa-fan' flat %}操作{% endnote %}

 
```sql
-- 创建部门表-- 主表
create table if not exists dept(
	detpno varchar(20) primary key,-- 部门号 主键列
	name varchar(20) -- 部门名字
);

-- 创建员工表，并创建外键约束（方式二）
create table if not exists emp(
	eid varchar(20) primary key,-- 员工编号
	ename varchar(20),-- 员工名字
	age int,-- 员工年龄
	dept_id varchar(20) -- 员工所属部门
);
alter table emp add constraint emp_fk foreign key(dept_id) references dept(detpno);

```
 



## 外键约束下的数据操作

- 添加数据

 
```sql
-- 1.添加主表数据
-- 注意必须先给主表添加数据
insert into dept values('1001','研发部');
insert into dept values('1002','销售部');
insert into dept values('1003','财务部');
insert into dept values('1004','人事部');

-- 2.添加从表数据
-- 注意给从表添加数据时，外键列的值必须依赖主表的主键列
insert into emp values('1','乔峰',20,'1001');
insert into emp values('2','李白',21,'1001');
insert into emp values('3','貂蝉',23,'1001');
insert into emp values('4','李信',26,'1002');
insert into emp values('5','孙悟空',34,'1002');
insert into emp values('6','猪八戒',66,'1003');
insert into emp values('7','凯',76,'1003');
insert into emp values('8','小乔',11,'1005');# 不可以
```
 


- 删除数据

```sql
-- 3.删除数据
-- 注意：主表的数据被从表依赖时，不能删除，否则可以删除
-- 从表的数据可以随便删除
delete from dept where detpno = '1001';-- 不可以删除
delete from dept where `detpno` = '1004';-- 可以删除
delete from emp where eid='7'; -- 可以删除
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203281719460.png)



## 删除外键约束

外键一旦删除，就会解除主表和从表的关联关系

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203281722686.png)

```sql
-- 4.删除外键约束
alter table emp drop foreign key emp_fk;# emp_fk是别名
```

<font color='orange'>这个名字可以这样查看：</font>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203281731298.png)



## 操作-多对多关系

{% note blue 'fas fa-fan' flat %}操作{% endnote %}

```sql
-- 学生表和课程表（多对多）
-- 1.创建学生表student(左侧主表)
create table student(
	sid int primary key auto_increment,
	name varchar(20),
	age int,
	gender varchar(20)
);
-- 2.创建课程表course(右侧主表)
create table course(
	cid int primary key auto_increment,
	cidname varchar(20)
);
-- 3.创建中间表student_course/score(从表)
create table score(
	sid int,
	cid int,
	score double
);
```

```sql
-- 4.建立外键约束（2次）
alter table score add foreign key(sid) references student(sid);
alter table score add foreign key(cid) references course(cid);
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203281754220.png)

```sql
-- 5.给学生表添加数据
insert into student values(1,'小龙女',18,'女'),(2,'杨过',28,'男'),(3,'孙悟空',66,'男');
-- 6.给课程表添加数据
insert into course values(1,'语文'),(2,'数学'),(3,'英语');
-- 7.给中间表添加数据
insert into score values(1,1,55),(1,2,78),(2,1,88),(2,3,97),(3,2,56),(3,3,54);
-- 修改和删除时，中间表可以随便删除和修改，但是两边的主表受从表依赖的数据不能删除或者修改
```



## 多表联合查询

{% note blue 'fas fa-fan' flat %}介绍{% endnote %}

多表查询就是同时查询<font color='cornflowerblue'>两个或两个以上</font>的表，因为有的用户在查看数据的时候，需要显示的数据来自多张表。多表查询有以下分类：

- <font color='red'>交叉连接查询</font>[产生笛卡尔积，了解]

语法：

```sql
select * from A,B;
```

- <font color='red'>内连接查询</font>(使用的关键字 inner join -- inner可以省略)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203281937248.png)

语法：

```sql
# 隐式内连接（SQL92标准）
select * from A,B where 条件;
# 显示内连接（SQL99标准）
select * from A inner join B on 条件;
```

- <font color='red'>外连接查询</font>（使用的关键字 outer join -- outer可以省略）

语法：

```sql
# 左外连接：left outer join
select * from A left outer join B on 条件;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203281938149.png)

```sql
# 右外连接：right outer join
select * from A right outer join B on 条件;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203281938646.png)

```sql
# 满外连接：full outer join
select * from A full outer join B on 条件;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203281938025.png)


- <font color='red'>子查询</font>

select 的嵌套

- <font color='red'>表自关联</font>

将一张表当成多张表来用

###  7.1  数据准备

 
```sql
-- 创建部门表
create table if not exists dept2(
	deptno varchar(20) primary key, -- 部门号
	name varchar(20) -- 部门名字
);
-- 创建员工表
create table if not exists emp2(
	eid varchar(20) primary key,-- 员工编号
	ename varchar(20),-- 员工名字
	age int,-- 员工年龄
	dept_id varchar(20) -- 员工所属部门
);
-- 给dept2添加数据
insert into dept2 values('1001','研发部');
insert into dept2 values('1002','销售部');
insert into dept2 values('1003','财务部');
insert into dept2 values('1004','人事部');
-- 给emp2表添加数据
insert into emp2 values( '1','乔峰',20,'1001');
insert into emp2 values( '2','段誉',21,'1001' );
insert into emp2 values( '3','虚竹',23,'1001' );
insert into emp2 values( '4','阿紫',18,'1001' ) ;
insert into emp2 values( '5','扫地僧',85,'1002 ' );
insert into emp2 values( '6','李秋水',33,'1002' );
insert into emp2 values( '7','鸠摩智',50,'1002');
insert into emp2 values( '8','天山童姥',60,'1003');
insert into emp2 values( '9','慕容博',58,'1003' ) ;
insert into emp2 values( ' 10','丁春秋',71,'1005');
```
 



###  交叉连接查询

{% note blue 'fas fa-fan' flat %}介绍{% endnote %}

- 交叉连接查询返回被连接的两个表所有数据行的笛卡尔积
- 笛卡尔积可以理解为<font color='orange'>一张表的每一行去和另外一张表的任意一行进行匹配</font>
- 假如 A 表有 <font color='cornflowerblue'>m </font>行数据，B 表有 <font color='cornflowerblue'>n</font> 行数据，则返回 <font color='cornflowerblue'>m*n</font> 行数据
- 笛卡尔积会产生很多冗余的数据，后期的其他查询可以在<font color='cornflowerblue'>该集合的基础上进行条件筛选</font>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203282004279.png)

{% note blue 'fas fa-fan' flat %}操作{% endnote %}

```sql
select * from dept2,emp2;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203282012539.png)



###  内连接查询

- 内连接查询求多张表的<font color='orange'>交集</font>（共同部分）

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203282018544.png)

```sql
-- 1.查询每个部门的所属员工
# 隐式内连接
select * from dept2,emp2 where deptno = dept_id;
-- 或前面加表名.列名（这样写比较专业）
select * from dept2 ,emp2  where dept2.deptno = emp2.dept_id;
# 显示内连接
select * from dept2 join emp2 on deptno = dept_id;
select * from dept2 inner join emp2 on dept2.deptno = emp2.dept_id;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203282031414.png)

```sql
-- 查询研发部门的所属员工
# 隐式内连接
select * from dept2 a,emp2 b where a.deptno=b.dept_id and name='研发部'; 
# 显示内连接
select * from dept2 a join emp2 b on a.deptno=b.dept_id and name='研发部'; 
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203282035057.png)

```sql
-- 查询研发部和销售部的所属员工
# 隐式内连接
select * from dept2 a,emp2 b where a.deptno=b.dept_id and (name='研发部' or name='销售部'); 
# 或
select * from dept2 a,emp2 b where a.deptno=b.dept_id and name in('研发部','销售部');
# 显示内连接
select * from dept2 a join emp2 b on a.deptno=b.dept_id and (name='研发部' or name='销售部'); 
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203282040587.png)

```sql
-- 查询每个部门的员工数，并升序排序
select a.name,a.deptno,count(1) from dept2 a join emp2 b on a.deptno=b.dept_id group by a.deptno,a.name;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203282048762.png)

```sql
-- 查询人数大于2的部门，并按照人数降序排序
select 
	a.`name`,
	a.deptno,
	count(1) as total_cnt
from 
	dept2 a 
join 
	emp2 b 
on 
	a.deptno=b.dept_id 
group by 
	a.deptno,a.`name` 
having 
	total_cnt >=3 
order by 
	total_cnt desc;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203282054777.png)



###  外连接查询

{% note red 'fas fa-fan' flat %}注意{% endnote %}

<font color='orange'>oracle </font>里面有 <font color='cornflowerblue'>full join</font>，可是在 MySQL 对 <font color='cornflowerblue'>full join</font> 支持不太友好。我们可以使用 <font color='orange'>union </font>来达到目的。

```sql
-- 查询哪些部门有员工，哪些部门没有员工
select * from dept2 a left outer join emp2 b on a.deptno = b.dept_id;
-- 如果多张表也可以这样
select * from A
	left join B on 条件1;
	left join C on 条件2;
	left join D on 条件3;
	...
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203282115521.png)

```sql
-- 查询哪些员工有对应的部门，哪些没有
select * from dept2 a right join emp2 b on a.deptno = b.dept_id;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203282121591.png)

```sql
-- 使用 union 关键字实现左连接和右连接的并集
select * from dept2 a full join emp2 b on a.deptno = b.dept_id;-- 不可以，可能别的版本可以
select * from dept2 a left join emp2 b on a.deptno=b.dept_id;
union -- union all 是将两个查询结果上下拼接，不去重
select * from dept2 a right join emp2 b on a.deptno=b.dept_id;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203282131311.png)



### 子查询

{% note red 'fas fa-fan' flat %}介绍{% endnote %}

子查询就是指的在一个完整的查询语句之中，<font color='cornflowerblue'>嵌套若干个不同功能的小查询</font>，从而一起完成复杂查询的一种编写形式，通俗一点就是包含 <font color='orange'>select </font>嵌套的查询。

{% note red 'fas fa-fan' flat %}特点{% endnote %}

<font color='cornflowerblue'>子查询可以返回的数据类型一共分为四种：</font>

- <font color='orange'>单行单列</font>：返回的是一个具体列的内容，可以理解为一个单值数据：
- <font color='orange'>单行多列</font>：返回一行数据中多个列的内容；
- <font color='orange'>多行单列</font>：返回多行记录之中同一列的内容，相当于给出了一个操作范围；
- <font color='orange'>多行多列</font>：查询返回的结果是一张临时表

{% note red 'fas fa-fan' flat %}操作{% endnote %}

```sql
-- 查询年龄最大的员工信息，显示信息包含员工号、员工名字，员工年龄
# 1.查询最大年龄
select max(age) from emp2;
# 2.让每个员工的年龄和最大年龄进行比较，相等则满足条件
select * from emp2 where age=(select max(age) from emp2);
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203282145262.png)

```sql
-- 查询年研发部和销售部的员工信息，包含员工号、员工名字
# 方式一：关联查询
select * from dept2 a join emp2 b on a.deptno=b.dept_id and (name='研发部' or name='销售部'); 
# 方式二：子查询
# 2.1 先查询研发部和销售部的部门号：deptno 1001 和 1002
select deptno from dept2 where name='研发部' or name='销售部';
# 2.2 查询哪个员工的部门号是1001 或者 1002
select * from emp2 where dept_id in(select deptno from dept2 where name='研发部' or name='销售部');
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203282156053.png)

```sql
-- 查询研发部20岁以下的员工信息,包括员工号、员工名字，部门名字
# 方式一：关联查询
select * from dept2 a join emp2 b on a.deptno=b.dept_id and (name='研发部' and age<20);
# 方式二：子查询
# 2.1在部门表中查询研发部信息
select * from dept2 where name='研发部';
# 2.2在员工表中查询年龄小于20岁的员工信息
select * from emp2 where age<20;
# 2.3 将以上两个查询结果进行关联查询
select * from (select * from dept2 where name='研发部') a join (select * from emp2 where age<20) b on a.deptno=b.dept_id;-- 注意要给别名
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203282208882.png)

###  子查询关键字

- <font color='red'>all </font>关键字
- <font color='red'>any </font>关键字
- <font color='red'>some </font>关键字
- <font color='red'>in </font>关键字
- <font color='red'>exists </font>关键字

{% note blue 'fas fa-fan' flat %}关键字-all{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203282212989.png)

<font color='red'>特点：</font>

- all：与子查询<font color='orange'>返回</font>的所有值比较为 true 则返回 <font color='orange'>true</font>
- all 可以与 <font color='orange'>=、>、>=、<、<=、<></font> 结合是来使用，分别表示等于、大于、大于等于、小于、小于等于、不等于其中的其中的所有数据。
- all 表示指定列中的值必须要<font color='orange'>大于</font>子查询集的每一个值，<font color='cornflowerblue'>即必须要大于子查询集的最大值</font>；如果是小于号<font color='cornflowerblue'>即小于子查询集的最小值</font>。同理可以推出其它的比较运算符的情况。

```sql
-- 1.查询年龄大于‘1003’部门所有年龄的员工信息
select * from emp2 where age > all(select age from emp2 where dept_id = '1003');
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203282224162.png)

```sql
-- 2.查询不属于任何一个部门的员工信息
select * from emp2 where dept_id != all(select deptno from dept2);
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203282225240.png)



{% note blue 'fas fa-fan' flat %}关键字-any 和 same{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203282226219.png)

<font color='red'>特点：</font>

- any：与子查询返回的任何值比较为 true 则返回 <font color='cornflowerblue'>true</font>
- any 可以与<font color='orange'> =、>、>=、<、<=、<></font> 结合是来使用，分别表示等于、大于、大于等于、小于、小于等于、不等于其中的其中的任何一个数据。
- 表示制定列中的值要大于子查询中的任意一个值，即必须要大于子查询集中的最小值。同理可以推出其它的比较运算符的情况。
- <font color='cornflowerblue'>some 和 any 的作用一样</font>，some 可以理解为 any 的<font color='cornflowerblue'>别名</font>

{% note blue 'fas fa-fan' flat %}操作{% endnote %}

```sql
-- 查询年龄大于'1003' 部门任意一个员工年龄的员工信息
select * from emp2 where age>any(select age from emp2 where dept_id = '1003') and dept_id != '1003';
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203282237745.png)



{% note blue 'fas fa-fan' flat %}关键字-in{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203282243758.png)

<font color='red'>特点：</font>

- in 关键字，用于<font color='cornflowerblue'>判断某个记录的值,是否在指定的集合中</font>
- 在 in 关键字前边加上 <font color='orange'>not </font>font>可以将<font color='orange'>条件反过来</font>

{% note blue 'fas fa-fan' flat %}操作{% endnote %}

```sql
-- 查询年研发部和销售部的员工信息，包括员工号和员工名字
select eid,ename from emp2 where dept_id in(select deptno from dept2 where name='研发部' or name = '销售部');
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203282303053.png)



{% note blue 'fas fa-fan' flat %}关键字-exists{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203291055659.png)

<font color='red'>特点：</font>

- 该子查询如果 “有数据结果” (<font color='cornflowerblue'>至少返回一行数据</font>)，则该 exists() 的结果为 “true"，外层查询执行
- 该子查询如果 “没有数据结果”（没有任何数据返回），则该 exists() 的结果为 “false"，外层查询不执行
- exists 后面的子查询不返回任何实际数据，只返回<font color='cornflowerblue'>真或假</font>，当返回真时 <font color='cornflowerblue'>where</font>条件<font color='cornflowerblue'>成立</font>
- 注意，<font color='orange'>exists</font> 关键字，比 <font color='orange'>in </font>关键字的运算效率高，因此，在实际开发中，特别是大数据量时<font color='cornflowerblue'>推荐使用 exists 关键字</font>

```sql
-- 查询公司是否有大于60岁的员工，有则输出
select * from emp2 a where exists(select * from emp2 where a.age>60);
# 或
select * from emp2 a where eid in(select eid from emp2 where a.age>60);
-- 查询有所属部门的员工信息
select * from emp2 a where exists(select * from dept2 b where a.dept_id = b.deptno);
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203291643484.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203291643639.png)



## 自关联查询

{% note blue 'fas fa-fan' flat %}概念{% endnote %}

MySQL 有时在信息查询时需要进行对表自身进行关联查询，即一张表自己和自己关联，一张表当成多张表来用。<font color='cornflowerblue'>注意自关联时表必须给表起别名。</font>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203291646813.png)

{% note blue 'fas fa-fan' flat %}操作{% endnote %}

 
```sql
-- 创建自关联表
create table t_sanguo(
	eid int primary key,
	ename varchar(20),
	manger_id int,
	foreign key(manger_id) references t_sanguo(eid) -- 添加自关联约束
);
-- 插入数据
insert into t_sanguo values (1,'刘协',NULL);
insert into t_sanguo values (2,'刘备',1);
insert into t_sanguo values ( 3,'关羽',2);
insert into t_sanguo values (4,'张飞',2);
insert into t_sanguo values (5,'曹操',1);
insert into t_sanguo values (6,'许褚',5);
insert into t_sanguo values ( 7,'典韦',5);
insert into t_sanguo values (8,'孙权',1);
insert into t_sanguo values ( 9,'周瑜',8);
insert into t_sanguo values (10,'鲁肃',8);
```
 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203291656719.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203291656734.png)

```sql
select * from t_sanguo a,t_sanguo b;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203291712107.png)

```sql
-- 1.查询每个三国人物及他的上级信息，如：关羽，刘备
select * from t_sanguo a,t_sanguo b where a.manger_id=b.eid;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203291708688.png)

```sql
select a.ename,b.ename from t_sanguo a,t_sanguo b where a.manger_id = b.eid;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203291717547.png)

```sql
-- 2.查询所有人物及上级
select a.ename,b.ename from t_sanguo a left join t_sanguo b on a.manger_id=b.eid;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203291720548.png)

```sql
-- 3.查询所有人物，上级，上上级 比如：张飞 刘备 刘协
select a.ename,b.ename,c.ename from t_sanguo a 
	left join t_sanguo b on a.manger_id=b.eid
	left join t_sanguo c on b.manger_id=c.eid; 
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203291725220.png)



##  练习

{% note blue 'fas fa-fan' flat %}数据准备{% endnote %}

 
```sql
-- 创建test1数据库
create database test1;

-- 选择使用 test1数据库
use test1;

-- 创建部门表
create table dept(
	deptno int primary key, -- 部门编号
	dname varchar(14), -- 部门名称
	loc varchar(13) -- 部门地址
);

-- 插入数据
insert into dept values ( 10, 'accounting','new york' );
insert into dept values ( 20, 'research','dallas' );
insert into dept values ( 3o, 'sales','chicago' );
insert into dept values (40, 'operations','boston' );

-- 创建员工表
create table emp(
	empno int primary key,-- 员工编号
	ename varchar(10),-- 员工姓名
	job varchar(9),-- 员工工作
	mgr int,-- 员工直属领导编号
	hiredate date,-- 入职时间
	sal double,-- 工资
	comm double,-- 奖金
	deptno int -- 对应dept表的外键
);

-- 添加 部门 和 员工 之间的外键关系
insert into emp values(7369, 'smith' ,'clerk',7902,'1980-12-17',800,null,20);
insert into emp values(7499, 'allen' , 'salesman',7698,'1981-02-20',1600,300,30);
insert into emp values(7521, 'ward' , 'salesman',7698,'1981-02-22',1250,500,30);
insert into emp values(7566, 'jones' , 'manager' ,7839,'1981-04-02',2975,null,20);
insert into emp values(7654 , 'martin' , 'salesman',7698,'1981-09-28',1250,1400,30);
insert into emp values(7698,'blake' , 'manager ',7839, '1981-05-01',2850,null,30);
insert into emp values(7782,'clark ' , 'manager ',7839,'1981-06-09',2450,null,10);
insert into emp values(7788,'scott' , 'analyst',7566, '1987-07-03',3000,null,20);
insert into emp values(7839, 'king' , 'president' ,null, '1981-11-17' ,5000,null,10);
insert into emp values(7844,'turner' , 'salesman',7698,'1981-09-08',1500,0,30);
insert into emp values(7876, 'adams ' , 'clerk' ,7788,'1987-07-13',1100,null,20);
insert into emp values(7900,'james' , 'clerk' ,7698,'1981-12-03' ,950,null,30);
insert into emp values(7902, 'ford' , 'analyst',7566,'1981-12-03',3000,null,20);
insert into emp values(7934, 'miller' , 'clerk ' ,7782,'1981-01-23',1300,null,10);

-- 创建工资等级表
create table salgrade(
	grade int,-- 等级
	losal double,-- 最低工资
	hisal double -- 最高工资
);

-- 插入数据
insert into salgrade values ( 1,780,1200) ;
insert into salgrade values (2,1201,1400) ;
insert into salgrade values ( 3,1401,2000) ;
insert into salgrade values (4,2001,3000);
insert into salgrade values (5,3001,9999);
```
 
{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203292229890.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203292229248.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203292229155.png)
{% endgallery %}


```sql
-- 1、返回拥有员工的部门名、部门号。
select distinct d.dname,d.deptno from dept d join emp e on d.deptno = e.deptno; 
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203292240881.png)

```sql
-- 2、工资水平多于smith的员工信息。
select * from emp where sal > (select sal from emp where ename ='smith');
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203292245273.png)

```sql
-- 3、返回员工和所属经理的姓名。
select a.ename,b.ename from emp a,emp b where a.mgr = b.empno;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203292248283.png)

```sql
-- 4、返回雇员的雇佣日期早于其经理雇佣日期的员工及其经理姓名。
select a.ename,a.hiredate,b.ename,b.hiredate from emp a join emp b on a.mgr = b.empno and a.hiredate < b.hiredate;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203292253605.png)

```sql
-- 5、返回员工姓名及其所在的部门名称。
select a.ename,b.dname from emp a join dept b on a.deptno = b.deptno;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203292257613.png)

```sql
-- 6.返回从事clerk工作的员工姓名和所在部门名称
select a.ename,b.dname,a.job from emp a join dept b on a.deptno = b.deptno and job ='clerk';
```

```sql
-- 7、返回部门号及其本部门的最低工资。
select deptno, min(sal) from emp group by deptno;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203292310313.png)

```sql
-- 8、返回销售部( sales)所有员工的姓名。
select b.ename from dept a join emp b on a.deptno = b.deptno and a.dname = 'sales';
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203300945229.png)


```sql
-- 9、返回工资水平多于平均工资的员工。
select * from emp where sal > (select avg(sal) from emp);
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203292315144.png)

```sql
-- 10.返回与scott从事相同工作的员工
select * from emp where job = (select job from emp where ename = 'scott') and ename != 'scott';
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203292321452.png)

```sql
-- 11.返回与30部门员工工资水平相同的员工姓名和工资
select * from emp where sal >all(select sal from emp where deptno = 30);
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203300906525.png)

```sql
-- 12.返回员工工作及其从事此工作的最低工资。
select job,min(sal) from emp group by job;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203300910472.png)

```sql
-- 13.计算出员工的年薪，并且以年薪排序。
select ename,(sal * 12 + ifnull(comm,0)) as year_sal from emp order by year_sal desc;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203300919725.png)

```sql
-- 14.返回工资处于第四级别的员工的姓名。
select * from emp where sal between (select losal from salgrade where grade = 4) and (select hisal from salgrade where grade = 4);
# 或
select * from emp where sal between (select losal from salgrade where grade = 4) and 3000;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203300933706.png)

```sql
-- 15.返回工资为二等级的职员名字，部门所在地
select * from dept a join emp b on a.deptno = b.deptno join salgrade c on grade = 2 and b.sal >= c.losal and b.sal <= c.hisal;
# 或
select * from dept a,emp b,salgrade c where a.deptno = b.deptno and grade = 2 and b.sal >= c.losal and b.sal <= c.hisal;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203300938364.png)