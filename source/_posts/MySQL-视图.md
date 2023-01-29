---
title: MySQL-视图
cover: /img/num45.webp
comments: false
categories:
  - MySQL学习笔记
abbrlink: '56431718'
date: 2022-03-31 12:51:00
updated: 2022-06-03 21:44:28
---
## 视图创建

{% note blue 'fas fa-fan' flat %}介绍{% endnote %}

- 视图(view）是一个<font color='orange'>虚拟表</font>，非真实存在，其本质是根据 SQL 语句获取动态的数据集，并为其命名，用户使用时只需使用视图名称即可获取结果集，并可以将其当作表来使用。
- 数据库中只存放了视图的定义，而并没有存放视图中的数据。<font color='orange'>这些数据存放在原来的表中。</font>
- 使用视图查询数据时，数据库系统会从原来的表中取出对应的数据。因此，视图中的数据是依赖于原来的表中的数据的。一旦表中的数据发生改变，显示在视图中的数据也会发生改变。

{% note blue 'fas fa-fan' flat %}作用{% endnote %}

- <font color='orange'>简化代码</font>，可以把重复使用的查询封装成视图重复使用，同时可以使复杂的查询易于理解和使用。
- <font color='orange'>安全原因</font>，如果一张表中有很多数据，很多信息不希望让所有人看到，此时可以使用视图视，如:社会保险基金表，可以用视图只显示姓名，地址，而不显示社会保险号和工资数等，可以对不同的用户，设定不同的视图。

{% note blue 'fas fa-fan' flat %}视图的创建{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203311306341.jpg)

 
```sql
-- 视图
-- 准备数据
create database if not exists mydb6_view;
use mydb6_view;
create table dept(
	deptno int primary key,
  dname varchar(20),
	loc varchar(20)
);
insert into dept values(10, '教研部','北京'),
(20, '学工部','上海'),
(30, '销售部','广州'),
(40, '财务部','武汉');

create table emp(
	empno int primary key,
	ename varchar(20),
	job varchar(20),
	mgr int,
	hiredate date,
	sal numeric(8,2),
	comm numeric(8, 2),
	deptno int,
-- 	FOREIGN KEY (mgr) REFERENCES emp(empno),
	foreign key (deptno) references dept(deptno) on delete set null on update cascade
);
insert into emp values
(1001, '甘宁', '文员', 1013, '2000-12-17', 8000.00, null, 20),
(1002, '黛绮丝', '销售员', 1006, '2001-02-20', 16000.00, 3000.00, 30),
(1003, '殷天正', '销售员', 1006, '2001-02-22', 12500.00, 5000.00, 30),
(1004, '刘备', '经理', 1009, '2001-4-02', 29750.00, null, 20),
(1005, '谢逊', '销售员', 1006, '2001-9-28', 12500.00, 14000.00, 30),
(1006, '关羽', '经理', 1009, '2001-05-01', 28500.00, null, 30),
(1007, '张飞', '经理', 1009, '2001-09-01', 24500.00, null, 10),
(1008, '诸葛亮', '分析师', 1004, '2007-04-19', 30000.00, null, 20),
(1009, '曾阿牛', '董事长', null, '2001-11-17', 50000.00, null, 10),
(1010, '韦一笑', '销售员', 1006, '2001-09-08', 15000.00, 0.00, 30),
(1011, '周泰', '文员', 1008, '2007-05-23', 11000.00, null, 20),
(1012, '程普', '文员', 1006, '2001-12-03', 9500.00, null, 30),
(1013, '庞统', '分析师', 1004, '2001-12-03', 30000.00, null, 20),
(1014, '黄盖', '文员', 1007, '2002-01-23', 13000.00, null, 10);

create table salgrade(
	grade int primary key,
	losal int,
	hisal int
);
insert into salgrade values
(1, 7000, 12000),
(2, 12010, 14000),
(3, 14010, 20000),
(4, 20010, 30000),
(5, 30010, 99990);
```
 
{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203311315251.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203311315956.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203311315183.png)
{% endgallery %}



```sql
-- 查看表和视图
show tables;
show full tables;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203311319071.png)

```sql
select * from view1_emp;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203311322235.png)



## 修改视图

修改视图是指修改数据库中已存在的表的定义。当基本表的某些字段发生改变时，可以<font color='cornflowerblue'>通过修改视图来保持视图和基本表之间一致</font>。MySQL 中通过 <font color='orange'>create or replace view </font>语句和 <font color='orange'>alter view </font>语句来修改视图。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203311325270.png)

```sql
alter view view1_emp
as
select a.deptno,a.dname,a.loc,b.ename,b.sal from dept a,emp b where a.deptno = b.deptno;

select * from view1_emp;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203311329198.png)



## 更新视图

某些视图是可更新的。也就是说，可以在 <font color='orange'>update、delete 或 insert </font>等语句中使用它们，以更新基表的内容。对于可更新的视图，在视图中的行和基表中的行之间必须具有<font color='orange'>一对一</font>的关系。如果视图包含下述结构中的任何一种，<font color='cornflowerblue'>那么它就是不可更新的:</font>

- 聚合函数(sum(),min(),max(),count() 等)
- distinct
- group by
- having
- union 或union all
- 位于选择列表中的子查询
- join
- from 子句中的不可更新视图
- where 子句中的子查询，引用 from 子句中的表。
- 仅引用文字值（在该情况下，没有要更新的基本表)

<font color='cornflowerblue'>视图中虽然可以更新数据，但是有很多的限制。一般情况下，最好将视图作为查询数据的虚拟表，而不要通过视图更新数据。因为，使用视图更新数据时，如果没有全面考虑在视图中更新数据的限制，就可能会造成数据更新失败。</font>

```sql
-- 2、视图包含聚合函数不可更新
create 
	or replace view view2_emp as select
	count(*) cnt
from
	emp;
	
select * from view2_emp;	
insert into view2_emp values( 100 ); # 错误	
update view2_emp set cnt = 100; # 错误
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203311352607.png)

```sql
-- 视图包含 distinct 不可更新
-- 插入数据时，视图只是引用表格中的某些字段，
-- 而另外一些字段又没有指定默认值时会插入失败
create or replace view view3_emp as select distinct job from emp;

insert into view3_emp values('财务');# 错误
```

```sql
-- count  group by   having 也不行
create or replace view view4_emp as select deptno,count(*) cnt from emp group by deptno having cnt>2;
insert into view2_emp values(30,100); # 错误
```

```sql
-- 2、视图包含聚合函数不可更新
-- 5、视图包含union、union all不可更新
-- union all不去重，union会去重
create or replace view view5_emp as select empno,ename from emp where empno <= 5
union 
select empno, ename from emp where empno > 8;

select * from  view5_emp;

insert into view5_emp values( 1015, '宋江' );# 错误
```

 
```sql
-- 6、视图包含子查询不可更新
create 
	or replace view view6_emp as select
	empno,
	ename,
	sal 
from
	emp 
where
	sal = (
	select
		max( sal ) 
	from
	emp);

select
	* 
from
	view6_emp;

insert into view6_emp
values
	( 1015, '血刀老祖', 30000.0 );
```
 

 
```sql
-- 7、视图包含join不可更新
create view view7_emp as select
dname,
ename,
sal 
from
	emp a
	join dept b on a.deptno = b.deptno;

insert into view7_emp
values
	( '行政部', '韦小宝', 6500.00 );
	
-- 8、视图包含常量文字值不可更新
create 
	or replace view view8_emp as select
	'行政部' dname,
	'杨过' ename;
	
insert into view8_emp
values
	( '行政部', '韦小宝' );


create 
	or replace view view9_emp as select
	* 
from
	emp;
```
 



##  重命名视图和删除视图

<font color='red'>重命名视图：</font>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203311409114.png)

<font color='red'>删除视图：</font>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203311409216.png)

<font color='orange'>删除视图时，只能删除视图的定义，不会删除数据</font>

```sql
-- 重命名视图
rename table view1_emp to myview;
```

```sql
-- 删除视图
drop view if exists myview;
```