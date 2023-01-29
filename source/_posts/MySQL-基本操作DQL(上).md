---
title: MySQL-基本操作DQL(上)
cover: /img/num41.webp
comments: false
categories:
  - MySQL学习笔记
abbrlink: ed491519
date: 2022-03-24 14:36:00
updated: 2022-06-03 21:24:56
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

##  概念

{% note blue 'fas fa-fan' flat %}概念{% endnote %}

- 数据库管理系统一个重要概念就是数据查询，数据查询不应只是简单返回数据中存储的数据，还应该根据需要对数据进行筛选以及确定数据以什么样的<font color='orange'>格式显示</font>。
- MySQL 提供了功能强大，灵活的语句来实现这些操作。
- MySQL 数据库使用<font color='orange'> select </font>语句来查询数据。

{% note blue 'fas fa-fan' flat %}语法格式{% endnote %}

- <font color='orange'>带 [ ] 可以省略</font>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220324144944.png)

{% note blue 'fas fa-fan' flat %}简化版语法{% endnote %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220324145002.png)

##  数据准备

 
```sql
-- 1.创建数据库
create database if not exists mydb;
use mydb;

-- 2.创建商品表
create table product(
	`pid` int primary key auto_increment, -- 商品编号
	`pname` varchar(20) not null, -- 商品名称
	`price` double, -- 商品价格
	`category_id` varchar(20) -- 商品所属分类
);

-- 3.插入数据
insert into product values(null,'啄木鸟衬衣',300,'c002');
insert into product values(null,'恒源祥西裤',800,'c002');
insert into product values(null,'花花公子夹克',440,'c002');
insert into product values(null,'劲霸休闲裤',266,'c002');
insert into product values(null,'海澜之家卫衣',180,'c002');
insert into product values(null,'杰克琼斯运动裤',430,'c002');

insert into product values(null,'兰蔻面霜',300,'c003');
insert into product values(null,'雅诗兰黛精华水',200,'c003');
insert into product values(null,'香奈儿香水',350,'c003');
insert into product values(null,'SK-II神仙水',350,'c003');
insert into product values(null,'资生堂粉底液',180,'c003');

insert into product values(null,'老北京方便面',56,'c004');
insert into product values(null,'良品铺子海带丝',17,'c004');
insert into product values(null,'三只松鼠坚果',88,null);
```
  

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220324151220.png)


## 基本查询-简单查询

- <font color='orange'>查询所有的商品</font>

```sql
-- 1.查询所有的商品
select  pid,pname,price,category_id from product; -- 这个方法慢，如果有几十列那么...
select * from product; -- 这个和上面效果一样，* 代表全部列
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220324190403.png)

- <font color='orange'>查询商品名和商品价格</font>

```sql
-- 2.查询商品名和商品价格
select pname,price from product;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220324190817.png)

- <font color='orange'>别名查询.使用的关键字是 as（as可以省略的）</font>，目前暂时没什么用到后面多表查询就发挥用处了！！

```sql
-- 3.1表起别名
select * from product as p;
select * from prodect p;
-- 3.2列起别名
select pname as '商品名',price '商品价格' from product;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220324191933.png)

- <font color='orange'>去掉重复值</font>

```sql
-- 4.去重
select distinct price from product; -- 去掉商品价格相同的数据
select distinct * from product; -- 去掉相同的行(就是两行数据相同会去掉一行)
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220324192623.png)

- 查询结果是<font color='orange'>表达式</font>(运算查询)：将所有商品的价格<font color='orange'>加10进行显示</font>（<font color='red'>并不会真的把表数据改了！！！</font>）

```sql
select pname,price+10 new_price from product; -- new_price 是列的别名(不可能拿price+10当列名吧)
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220324193539.png)

##  基本查询-运算符

{% note blue 'fas fa-fan' flat %}简介{% endnote %}

数据库中的表结构确立后，表中的数据代表的意义就已经确定。通过 MySQL 运算符进行运算就可以获取到表结构以外的<font color='orange'>另─种数据</font>。

例如，学生表中存在一个 birth 字段，这个字段表示学生的出生年份。而运用 MySQL 的算术运算符用当前的年份减学生出生的年份，那么得到的就是这个学生的<font color='orange'>实际年龄数据</font>。

{% note blue 'fas fa-fan' flat %}MySQL支持4种运算符{% endnote %}

- <font color='red'>算术运算符</font>
- <font color='red'>比较运算符</font>
- <font color='red'>逻辑运算符</font>
- <font color='red'>位运算符</font>

{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220324194536.jpg)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220324194852.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220324194823.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220324194447.png)
{% endgallery %}


###  操作-算术运算符

```sql
-- 将所有商品价格加20
select pname,price+20 as new_price from product;
-- 将所有商品价格上调10%
select pname,price * 1.1 as new_price from product;
```

{% note red'fas fa-fan' flat %}注意：运算后并不会影响真实数据，只是显示作用{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220324205036.png)


###  操作-比较,逻辑运算符

 
```sql
-- 查询商品名称为"花花公子夹克"的商品所有商品
select * from product where pname = '花花公子夹克';

-- 查询价格为800商品
select * from product where price = 300;

-- 查询价格不是800的所有商品
select * from product where price !=800;
select * from product where price <> 800;
select * from product where not (price = 800);

-- 查询商品价格大于60元是所有商品信息
select * from product where price >= 60;

-- 查询商品价格在200到1000之间所有商品
select * from product where price between 200 and 1000;
select * from product where price >=200 and price <=1000;
select * from product where price >=200 && price <=1000;

-- 查询商品价格是200或者800的所有商品
select * from product where price in(200,800);
select * from product where price = 200 || price = 800;
select * from product where price = 200 or price = 800;

-- 查询含有'衣' 字的所有商品
select * from product where pname like '%衣%'; -- %用来匹配任意字符

-- 查询以 '老' 开头的所有商品
select * from product where pname like '老%';

-- 查询第二个字为'木'的所有商品
select * from product where pname like '_木%'; -- 下划线匹配单个字符

-- 查询category_id为null的商品
select * from product where category_id is null; 

-- 查询category_id不为null的商品
select * from product where category_id is not null; 

-- 使用 least 求最小值
select least(10,5,20) as small_number; -- as small_number 起别名

-- 使用 greatest 求最大值
select greatest(22,34,99) as big_number;
select greatest(22,null,99) as big_number; -- 如果求最小值最大值有个值为null则不会进行比较，结果直接为null

-- 求某列最小值
select min(price) from product;

-- 求某列最大值
select max(price) from product;

```
  


<font color='orange'>运行结果大同小异就不放了</font>

###  操作-位运算符(了解)

{% note blue 'fas fa-fan' flat %}这些了解即可不需要记{% endnote %}

```sql
select 3 & 5; -- 位与(两个1才是1)

select 3 | 5; -- 位或(一个1就是1)

select 3^5; -- 位异或(相同为0不同为1)

select 3>>1; -- 位左移(最后一位去掉前面补0)

select 3<<1; -- 位右移(前面一位去掉后面补0)

select ~3; -- 位取反(0变1；1变0)
```

## 排序查询

{% note blue 'fas fa-fan' flat %}介绍{% endnote %}

如果我们需要对读取的数据进行排序，我们就可以使用MySQL 的 <font color='orange'>order by</font> 子句来设定你想按哪个字段哪种方式来进行排序，再返回搜索结果。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220324215945.png)

{% note blue 'fas fa-fan' flat %}特点{% endnote %}

- <font color='orange'>asc</font> 代表升序，<font color='orange'>desc</font> 代表降序，如果不写<font color='orange'>默认升序</font>
- order by 用于子句中可以支持<font color='orange'>单个字段，多个字段，表达式，函数，别名</font>
- order by 子句，放在<font color='orange'>查询语句的最后面</font>。<font color='red'>LIMIT</font> 子句除外

```sql
-- 1.使用价格排序（降序）
select * from product order by price desc;

-- 2.使用价格排序（降序）的基础上，以分类排序（降序）
select * from product order by price desc,category_id desc;

-- 3.显示商品的价格（去重复），并排序（降序）
select distinct price from product order by price desc;
```
{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220324221826.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220324221934.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220324221946.png)
{% endgallery %}


##  聚合查询

{% note blue 'fas fa-fan' flat %}简介{% endnote %}

上面我们做的查询都是<font color='orange'>横向查询</font>，它们都是根据条件一行一行的进行判断，而使用聚合函数查询是<font color='orange'>纵向查询</font>，它是对一列的值进行计算，然后返回一个<font color='orange'>单一的值</font>；另外聚合函数会<font color='orange'>忽略空值</font>。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220324222222.png)

 
```sql
-- 1.查询商品的总条数
select count(pid) from product;
select count(*) from product;

-- 2.查询价格大于200商品的总条数
select count(pid) from product where price >200;

-- 3.查询分类为'c002' 的所有商品的总和
select sum(price) from product where category_id = 'c002'; -- 它会先去查询商品号为'c002'的出来然后再计算总和

-- 4.查询商品的最大价格
select max(price) from product;

-- 5.查询商品的最小价格
select min(price) from product;
select max(price) MAX_num,min(price) Min_num from product; -- 或者最大，最小一起求；MAX_num，Min_num是别名

-- 6.查询分类为'c002'所有商品的平均价格
select avg(price) from product where category_id = 'c002';
```
  


###  聚合查询-NULL值处理

{% note blue 'fas fa-fan' flat %}介绍{% endnote %}

- <font color='orange'>count 函数对 null 值的处理</font>

如果 count 函数的参数为 (<font color='cornflowerblue'> *</font> )，则统计<font color='cornflowerblue'>所有记录的个数</font>。而如果参数为<font color='cornflowerblue'>某字段</font>，<font color='cornflowerblue'>不统计含 null 值</font>的记录个数。

- <font color='orange'>sum 和 avg 函数对null 值的处理</font>

这两个函数<font color='cornflowerblue'>忽略 null 值的存在</font>，就好像该条记录<font color='cornflowerblue'>不存在一样</font>。

- <font color='orange'>max 和 min 函数对 null 值的处理</font>

max 和 min 这两个函数同样<font color='cornflowerblue'>忽略 null 值的存在</font>。

```sql
create table test_user(
	c1 varchar(20),
	c2 int
);
-- 插入数据测试
insert into test_user values('aaa',3);
insert into test_user values('bbb',4);
insert into test_user values('ccc',null);
insert into test_user values('ddd',5);

select count(*),count(1),count(c2) from test_user; -- 4 4 3
select sum(c2),max(c2),min(c2),avg(c2) from test_user; -- 12 5 3 4
```

##  分组查询（上）

{% note blue 'fas fa-fan' flat %}简介{% endnote %}

分组查询是指使用 <font color='orange'>group by</font> 子句对查询信息进行分组。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203271333736.png)

<font color='cornflowerblue'>如果要进行分组的话，则 select 子句之后，只能出现分组的字段和统计函数，其他的字段不能出现。</font>

{% note blue 'fas fa-fan' flat %}操作{% endnote %}

比如看回之前的表数据，可以发现其实可以按照最后一个字段 <font color='orange'>category_id </font>进行分组，可以分为<font color='orange'>3</font>组

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203271337905.png)

```sql
-- 统计各个分类商品的个数
select category_id,count(*) from product group by category_id;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203271345617.png)

{% note blue 'fas fa-fan' flat %}执行过程{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203271357950.jpg)

{% note red'fas fa-fan' flat %}注意{% endnote %}

<font color='orange'>group by</font> 后面可以跟多个字段，比如一个学生表，学生信息有<font color='cornflowerblue'>学号，名字，年龄，省，市</font>；那么可以 group by 后面跟 ‘<font color='cornflowerblue'>省</font>’ 和 '<font color='cornflowerblue'>市</font> ，只有<font color='orange'>同一个省一个市</font>的学生才会分到同一组。

##  分组查询（下）

{% note blue 'fas fa-fan' flat %}分组之后的条件筛选-having{% endnote %}

- 分组之后对统计结果进行筛选的话必须使用 <font color='orange'>having</font>，不能使用 <font color='cornflowerblue'>where</font>
- <font color='cornflowerblue'>where</font> 子句用来筛选 <font color='green'>from </font>子句中指定的操作所产生的行
- <font color='orange'>group by</font> 子句用来分组 <font color='cornflowerblue'>where</font> 子句的输出
- <font color='orange'>having</font> 子句用来分组的结果中筛选

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203271333736.png)

{% note blue 'fas fa-fan' flat %}操作{% endnote %}

 
```sql
-- 统计各个分类商品的个数，且只显示个数大于4的信息
-- SQL执行顺序：from->group by->count(*)->select->having->order by
select 
	category_id,count(*) cnt
from
	product
group by
	category_id
having
	cnt>4
order by 
	cnt desc;
# order by:排序；cnt是别名
```
  

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/202203271440132.png)