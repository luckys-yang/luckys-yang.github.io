---
title: MySQL-基本操作DQL(下)
cover: /img/num42.webp
comments: false
categories:
  - MySQL学习笔记
abbrlink: f4522458
date: 2022-03-27 14:54:00
updated: 2022-06-03 21:29:28
---
{% note blue 'fas fa-fan' flat %}MySQL 执行顺序！！！（死记硬背）{% endnote %}

- <font color='pink'>from</font> 表	<font color='orange'>第一步</font>
- 连接类型 <font color='pink'>join</font> 表2	<font color='orange'>第二步</font>
- <font color='pink'>on</font> 连接条件	<font color='orange'>第三步</font>
- <font color='pink'>where</font> 筛选条件	<font color='orange'>第四步</font>
- <font color='pink'>group by</font> 分组列表	<font color='orange'>第五步</font>
- <font color='pink'>having </font>分组后的筛选条件	<font color='orange'>第六步</font>
- <font color='pink'>order by</font> 排序列表	<font color='orange'>第八步</font>
- <font color='pink'>limit</font> 偏移 ，条目数	<font color='orange'>第九步</font>

## 分页查询

{% note blue 'fas fa-fan' flat %}简介{% endnote %}

<font color='orange'>分页查询</font>在项目开发中常见，由于数据量很大，显示屏长度有限，因此对数据需要采取分页显示方式。例如数据共有30条，每页显示5条，第一页显示1-5条，第二页显示6-10条。<font color='orange'>（索引是从0开始，跟C语言数组一样）</font>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203271535508.jpg)



{% note blue 'fas fa-fan' flat %}操作{% endnote %}

```sql
-- 1.查询product表的前5条数据
select * from product limit 5;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203271640094.png)

```sql
-- 2.从第4条开始显示，显示5条
select * from product limit 3,5;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203271644020.png)

```sql
-- 3.分页显示
select * from product limit 0,60; -- 第一页--->（1-1）*60
select * from product limit 60,60;-- 第二页--->（2-1）*60
select * from product limit 120,60;-- 第三页--->（3-1）*60
```



## insert into select 语句

{% note blue 'fas fa-fan' flat %}简介{% endnote %}

<font color='cornflowerblue'>将一张表的数据导入到另一张表中</font>，可以使用 <font color='orange'>insert into select</font> 语句<font color='red'>（要求目标表Table2必须存在）</font>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203271655202.png)

{% note blue 'fas fa-fan' flat %}操作{% endnote %}

```sql
use mydb;
-- 查询表所有内容
select * from product;
-- 创建product2
create table product2(
	pname varchar(20),
	price double
);
-- 把product表数据插入到product2表中
insert into product2(pname,price) select pname,price from product;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203271718548.png)

- 通过统计商品数量然后把结果插入到另一个表

```sql
-- 创建product3
create table product3(
	category_id varchar(20),
	product_count int
);
-- 按照哪一个分组然后统计有多少个商品
insert into product3 select category_id,count(*) from product group by category_id;
-- 查询表
select * from product3;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203271724042.png)



## 练习⑴

 
```sql
-- 使用 mydb 数据库
use mydb;
-- 创建 student 表
create table student(
	`id` int,
	`name` varchar(20),
	`gender` varchar(20),
	`chinese` int,
	`english` int,
	`math` int
);
-- 插入数据
insert into student(`id`,`name`,`gender`,`chinese`,`english`,`math`) values(1,'张三','男',89,78,45);
insert into student(`id`,`name`,`gender`,`chinese`,`english`,`math`) values(2,'张四','女',49,43,76);
insert into student(`id`,`name`,`gender`,`chinese`,`english`,`math`) values(3,'张五','男',53,77,32);
insert into student(`id`,`name`,`gender`,`chinese`,`english`,`math`) values(4,'张六','女',78,45,97);
insert into student(`id`,`name`,`gender`,`chinese`,`english`,`math`) values(5,'李四','女',23,87,90);
insert into student(`id`,`name`,`gender`,`chinese`,`english`,`math`) values(6,'小狗','男',89,78,45);
insert into student(`id`,`name`,`gender`,`chinese`,`english`,`math`) values(7,'小王','女',56,43,78);
insert into student(`id`,`name`,`gender`,`chinese`,`english`,`math`) values(8,'小米','男',43,51,77);
```
 


```sql
-- 查询表中所有学生的信息
select * from student;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203271952644.png)

```sql
-- 查询表中所有学生的姓名和对应的英语成绩
select `name`,`english` from student;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203271956515.png)

```sql
-- 过滤表中重复数据
select distinct * from student;
```



```sql
-- 统计每个学生的总分
select `name`,(`chinese`+`english`+`math`) as total_score from student; # 注意这里不能用sum
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203272003017.png)

```sql
-- 在所有学生总分数上加10分特长分
select `name`,(`chinese`+`english`+`math`+10) as total_score from student;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203272006873.png)

```sql
-- 使用别名表示学生分数
select name ,`chinese` '语文成绩',`english` '英语成绩', `math` '数学成绩' from student;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203272013487.png)

```sql
-- 查询英语成绩大于90分的同学
select * from student where english>90;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203272019097.png)

```sql
-- 查询总分大于200分的所有同学
select * from student where (`chinese`+`english`+`math`)>200;

select *,`chinese`+`english`+`math` as tatal_score from student where (`chinese`+`english`+`math`)>200;

-- 用'别名>200'代替(`chinese`+`english`+`math`) >200
select *,`chinese`+`english`+`math` as tatal_score from student where tatal_score >200;# 错误写法!!!，需要注意SQL语句执行顺序(执行顺序我会放到文章末尾)
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203272020714.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203272026110.png)

```sql
-- 查询英语分数在 80 - 90之间的同学
select * from student where english between 80 and 90;
-- 或者
select * from student where english >=80 and english<=90;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203272036140.png)

```sql
-- 查询英语分数不在 80 - 90之间的同学
select * from student where not (english between 80 and 90);
-- 或
select * from student where english not between 80 and 90;
-- 或
select * from student where not (english >=80 and english<=90);
-- 或
select * from student where  english <80 || english>90;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203272059651.png)

```sql
-- 查询数学分数为89,90,91的同学
select * from student where math in(89,90,91);
-- 查询数学分数不为89,90,91的同学
select * from student where math not in(89,90,91);
```

```sql
-- 查询所有姓张的学生英语成绩
select name,english from student where name like '张%';
```

```sql
-- 查询数学分80并且语文80分的同学
select * from student where math=80 and english=80;
```

```sql
-- 查询英语80或者总分200的同学
select * from student where english =80 or (chinese+math+english)=200;
```

```sql
-- 对数学成绩降序排序后输出
select * from student order by math desc;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203272123240.png)

```sql
-- 对总分排序后输出，然后再按从高到低的顺序输出
select * from student order by (chinese + math + english) desc;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203272130643.png)



```sql
-- 对姓李的学生总分成绩排序输出
select * from student where name like '李%' order by (chinese+english+math) desc;
```

```sql
-- 查询男生和女生分别有多少人，并将人数降序排序输出
select gender,count(*) as total_cnt from student group by gender order by total_cnt desc;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203272140768.png)

```sql
-- 查询男生和女生分别有多少人，并将人数降序排序输出，查询出人数大于4的性别人数信息
select gender,count(*) as total_cnt from student group by gender having total_cnt >4 order by total_cnt desc;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203272146766.png)



## 练习⑵

 
```sql
use mydb;
create table emp(
	empno int,-- 员工编号
	ename varchar(20),-- 员工姓名
	job varchar(50),-- 工作名字
	mgr int,-- 上级领导编号
	hiredate date,-- 入职时间
	sal int,-- 编号
	come int,-- 奖金
	deptno int -- 部门编号
	);

insert into emp values
(7369,'smith','clerk',7902,'1980-12-17',800,null,20),
(7499,'alen','salesman',7698,'1981-02-20',1600,300,30),
(7521,'ward','salesman',7698,'1981-02-22',1250,500,30),
(7566,'jones','manager',7839,'1981-04-02',2975,null,20),
(7654,'martin','salesman',7698,'1981-09-28',1250,1400,30),
(7698,'blake','manager',7839,'1981-05-01',2850,null,30),
(7782,'clark','manager',7839,'1981-06-09',2450,null,10),
(7788,'scott','analyst',7566,'1987-04-19',3000,null,20),
(7839,'king','president',null,'1981-11-17',5000,null,10),
(7844,'turner','salesman',7698,'1981-09-08',1500,0,30),
(7876,'adams','clerk',7788,'1987-05-23',1100,null,20),
(7900,'james','clerk',7698,'1981-12-03',950,null,30),
(7902,'ford','analyst',7566,'1981-12-03',3000,null,20),
(7934,'miller','clerk',7782,'1982-01-23',1300,null,10);
```
 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203272205281.png)

```sql
-- 1.按员工编号升序排列不在10号部门工作的员工信息
select * from emp where deptno != 10 order by empno;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203272211449.png)

```sql
-- 2.查询姓名第二个字母不是”a”且薪水大于1000元的员工信息，按年薪降序排列
-- ifnull(sal,0)  如果comm的值为null,则当0处理，不为null则还是原来的值
select * from emp where ename not like '_a%' and sal >1000 order by (12*sal+ifnull(come,0)) desc;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203272232244.png)

```sql
-- 3.求每个部门的平均薪水
select deptno ,avg(sal) from emp group by deptno;

-- 4.求每个部门平均薪水并且用别名和降序
select deptno ,avg(sal) as avg_sal from emp group by deptno order by avg_sal desc;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203272239628.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203272239547.png)

```sql
-- 5.求各个部门的最高薪水
select deptno,max(sal) as max_sal from emp group by deptno; 
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203272242105.png)

```sql
-- 6.求每个部门每个岗位的最高薪水,并且按部门排序
select deptno,job,max(sal) from emp group by deptno,job order by deptno;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203272246448.png)

```sql
-- 7.求平均薪水大于2000的部门编号
select deptno,avg(sal) as avg_sal from emp group by deptno having avg_sal>2000;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203272249493.png)

```sql
-- 8.求平均薪水大于1500的部门编号列出来，按部门平均薪水降序排序
select deptno,avg(sal) as avg_sal from emp group by deptno having avg_sal>1500 order by avg_sal desc;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203272252309.png)

```sql
-- 9.选择公司有奖金的员工，姓名
select * from emp where come is not null;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203272254163.png)

```sql
-- 10.查询员工最高工资和最低工资的差距
select max(sal)-min(sal) from emp;
-- 或起别名
select max(sal)-min(sal) '薪资差距' from emp;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203272256200.png)



## 正则表达式

{% note blue 'fas fa-fan' flat %}简介{% endnote %}

​       正则表达式 (regular expression) 描述了一种字符串匹配的规则，正则表达式本身就是一个字符串，使用这个字符串来<font color='orange'>描述，用来定义匹配规则，匹配一系列符合某个句法规则</font>。在开发中，正则表达式通常被用来<font color='orange'>检索，替换那些符合某个规则的文本</font>。

​        MySQL通过 <font color='orange'>regeexp </font>关键字支持正则表达式进行字符串匹配

{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203281322241.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203281332853.png)
{% endgallery %}


{% note blue 'fas fa-fan' flat %}操作{% endnote %}

```sql
-- ^ 在字符串开始处进行匹配(简单说就是判断'abc'第一个字母是不是a)
-- 1代表真，匹配成功；0代表假，匹配失败
select 'abc' regexp '^a'; # 1

select * from product where pname regexp '^花';
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203281344544.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203281344316.png)

```sql
-- $ 在字符串末尾开始匹配
select 'abc' regexp 'a$'; # 0
select 'abc' regexp 'c$'; # 1
select * from product where pname regexp '水$';-- 查询商品里有没有‘水’结尾的商品
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203281350417.png)

```sql
-- . 匹配任意单个字符，可以匹配除了换行符之外的任意字符
select 'abc' regexp '.b';# 1
select 'abc' regexp '.a';# 0  (a的前面没有字符)
select 'abc' regexp '.c';# 1
select 'abc' regexp 'a.';# 1
```

```sql
-- [^...] 注意^符合只有在[ ]内才是取反的意思，在别的地方都是表示开始处匹配
select 'a' regexp '[^abc]';# 0
select 'x' regexp '[^abc]';# 1
select 'abc' regexp '[^a]';# 1
```

```sql
-- a* 匹配0个或者多个a，包括空字符串。可以作为占位符使用，有没有指定字符都可以匹配到数据
select 'stab' regexp '.ta*b';# 1
select 'stb' regexp '.ta*b';# 1
select 'as' regexp 's*';# 1
select '' regexp 'a*'; # 1
```

```sql
-- a+匹配1个或者多个a，但是不包括空字符
select 'stab' regexp '.ta+b';# 1
select 'stb' regexp '.ta+b';# 0
select '' regexp 'a+'; # 0
```

```sql
-- a?匹配0个或者1个a
select 'stb' regexp '.ta?b';# 1
select 'stab' regexp '.ta?b';# 1
select 'staab' regexp '.ta?b';# 0
```

```sql
-- a1 | a2 匹配a1或者a2
select 'a' regexp 'a|b';# 1
select 'b' regexp 'a|b';# 1
select 'b' regexp '^(a|b)';# 1
select 'a' regexp '^(a|b)';# 1
select 'c' regexp '^(a|b)';# 0
select '' regexp '^(|)'; # 1
```

```sql
-- a1 | a2 匹配a1或者a2
select 'a' regexp 'a|b';# 1
select 'b' regexp 'a|b';# 1
select 'b' regexp '^(a|b)';# 1 (意思是说a或者b开头？)
select 'a' regexp '^(a|b)';# 1
select 'c' regexp '^(a|b)';# 0
select '' regexp '^(|)'; # 1
```

```sql
-- a{m} 匹配m个a
select 'auuuc' regexp 'au{4}c';# 0
select 'auuuc' regexp 'au{3}c';# 1
```

```sql
-- a{m} 匹配m个a
select 'auuuc' regexp 'au{4}c';# 0
select 'auuuc' regexp 'au{3}c';# 1
```

```sql
-- a{m,} 匹配m个或者更多个a
select 'accccer' regexp 'ac{4,}er';# 1
select 'accccer' regexp 'ac{3,}er';# 1
select 'accccer' regexp 'ac{5,}er';# 0
```

```sql
-- a{m,n}匹配m到n个a,包含m和n
select 'accccer' regexp 'ac{3,4}er';# 1
select 'accccer' regexp 'ac{4,5}er';# 1
select 'accccer' regexp 'ac{6,9}er';# 0
```

```sql
-- (abc) 
-- abc作为一个序列匹配，不用括号起来都是用单个字符去匹配，如果要把多个字符作为一个整体去匹配就需要用到括号，所以括号适合上面的所有情况
select 'xababy' regexp 'x(abab)y'; # 1
select 'xababy' regexp 'x(ab)*y'; # 1
select 'xababy' regexp 'x(ab){1,2}y'; # 1
```