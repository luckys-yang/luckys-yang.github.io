---
title: MySQL-约束
cover: /img/num40.webp
comments: false
categories:
  - MySQL学习笔记
abbrlink: '87225041'
date: 2022-03-22 12:22:00
updated: 2022-06-03 21:18:35
---
##  约束-简介

{% note blue 'fas fa-fan' flat %}概念{% endnote %}

约束实际上就是表中数据的限制条件。

{% note blue 'fas fa-fan' flat %}作用{% endnote %}

表在设计的时候加入约束的目的就是为了保证表中的记录完整性和有效性，比如用户表有些列的值 (手机号) 不能为空，有些列的值 (身份证) 不能重复。

{% note blue 'fas fa-fan' flat %}分类{% endnote %}

- 主键约束(<font color='orange'>primary key</font>) <font color='cornflowerblue'>PK</font>
- 自增长约束(<font color='orange'>auto_increment</font>)
- 非空约束(<font color='orange'>not null</font>)
- 唯一性约束(<font color='orange'>unique</font>)
- 默认约束(<font color='orange'>default</font>)
- 零填充约束(<font color='orange'>zerofill</font>)
- 外键约束(<font color='orange'>foreign key</font>) <font color='cornflowerblue'>FK</font>

## 约束-主键约束

###  简介

{% note blue 'fas fa-fan' flat %}概念{% endnote %}

- MySQL主键约束是一个列或者多个列的组合，其值唯一地标识表中的每一行，方便在RDBMS中尽快的找到某一行。
- 主键约束相当于 <font color='orange'>唯一约束+非空约束</font> 的组合，主键约束列不允许重复，也不允许出现空值。
- <font color='orange'>每个表最多只允许一个主键</font>
- 主键约束的关键字是：<font color='orange'>primary key</font>
- 当创建主键约束时，系统默认会在所在的列和列组合上建立对应的唯一索引。

{% note blue 'fas fa-fan' flat %}操作{% endnote %}

- 添加单列主键
- 添加多列联合主键
- 删除主键

###  操作-单列主键

创建单列主键有两种方式，一种是<font color='orange'>在定义字段的同时指定主键</font>，一种是<font color='orange'>定义完字段之后指定主键</font>。

{% note blue 'fas fa-fan' flat %}方式一{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220322130135.png)

 
```sql
use student;# 使用哪个数据库
create table emp1(
    eid int primary key,
	name varchar(20),
	deptId int,
	salary double
);
```
 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220322131329.png)

{% note blue 'fas fa-fan' flat %}方式二{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220322131802.png)

 
```sql
create table emp2(
	eid int,
	name varchar(20),
	depId int,
	salary double,
	constraint pk1 primary key(eid) # constraint pk1 可以省略
);
```
 

{% note blue 'fas fa-fan' flat %}主键的作用{% endnote %}

```sql
-- 主键约束的列非空并且唯一
insert into emp2() values(1001,'李四',10,6000);# 插入一条数据
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220322132947.png)

- <font color='orange'>当再插入相同的 'eid' 时就会报错 "重复输入 '1001' "</font>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220322132922.png)

- <font color='orange'>主键也不能为空，不然也会报错</font>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220322133420.png)


###  操作-联合主键

所谓联合主键，就是这个主键是由一张表中多个字段组成的。

{% note red 'fas fa-fan' flat %}注意{% endnote %}

1.当主键是由多个字段组成时，不能直接在字段名后面声明主键约束。

2.一张表只能有一个主键，联合主键也是一个主键。

{% note blue 'fas fa-fan' flat %}用法{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220322161655.png)

 
```sql
create table emp3(
	name varchar(20),
	deptId int,
	salary double,
	constraint pk2 primary key(name,deptId)
);
insert into emp3 values('张三',10,2000);# 数据1
insert into emp3 values('张三',20,2000);# 数据2
insert into emp3 values('李四',10,2000);# 数据3
```
 


![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220322164126.png)

- 上面的 "<font color='orange'>name</font>" 和 "<font color='orange'>depId</font>" 是联合主键，意思就是说后面再插入的数据中 "name" 和 "depId" 不能和数据1完全一样，但是可以"name" <font color='orange'>相同</font>，但是 "depId"<font color='orange'>不同</font>，或者 "depId" <font color='orange'>相同</font>，"name"<font color='orange'>不同</font>，<font color='orange'>并且联合主键的各列，每一列都不能为空</font>

{% note red 'fas fa-fan' flat %}错误示范{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220322163547.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220322164034.png)


###  操作-通过修改表结构添加主键

主键约束不仅可以在创建表的同时创建，也可以在修改表时添加（比如当创建了表后忘了加主键就可以使用这种方法）

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220322164613.png)

 
```sql
-- 提前创建好表emp4
create table emp4(
name varchar(20),
age int,
fox varchar(6),
results double
);
-- 添加联合主键约束(也可以添加单个)
alter table emp4 add primary key(name,age);
```
 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220322165955.png)


###  操作-删除主键

一个表中不需要主键约束时，就需要从表中将其删除。删除主键约束的方法要比创建主键约束容易得多。

{% note red 'fas fa-fan' flat %}注意{% endnote %}

不需要指定哪个主键因为一个表就一个主键


![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220322171039.png)

```sql
alter table emp4 drop primary key; # 删除emp4的主键
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220322171523.png)



##  约束-自增长约束

{% note blue 'fas fa-fan' flat %}概念{% endnote %}

在MySQL中，当主键定义为自增长后，这个主键的值就<font color='orange'>不再需要用户输入数据</font>了，而由数据库系统根据定义<font color='orange'>自动赋值</font>。<font color='orange'>每增加一条记录</font>，主键会自动以相同的步长进行增长。

通过给字段添加 <font color='orange'>auto_increment</font> 属性来实现主键自增长

{% note blue 'fas fa-fan' flat %}操作{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220322172529.png)

 
```sql
-- 创建表
create table t_user(
id int primary key auto_increment,
name varchar(20)
);

-- 插入数据
insert into t_user values(null,'张三'); # 第一个参数写null就行了，但是不能空着
insert into t_user(name)  values('李四'); # 也可以指定字段赋值
insert into t_user  values(3,'王五'); # 也可以自己写id,但是不能重复
insert into t_user  values(7,'赵六'); # 也可以不需要按顺序写
insert into t_user  values(null,'小狗'); # 它会根据上一条数据的id自增长(每次加1)
```
 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220322174106.png)

{% note blue 'fas fa-fan' flat %}特点{% endnote %}

- 默认情况下，auto_increment 的初始值是 <font color='orange'>1 </font>，每新增一条记录，字段值自动<font color='orange'>加 1</font> 。
- 一个表中<font color='orange'>只能有一个字段</font>使用 suto_increment 约束，且该字段必须有<font color='orange'>唯一索引</font>，以避免序号重复(即为主键或主键的一部分)。
- auto_increment 约束的字段必须具备 <font color='orange'>NOT NULL 属性</font>。
- auto_increment 约束的字段只能是整数类型 (<font color='orange'>tinyint</font>，<font color='orange'>smallint</font>，<font color='orange'>int</font>，<font color='orange'>bigint </font>等)

{% note blue 'fas fa-fan' flat %}指定自增字段初始值{% endnote %}

如果第一条记录设置了该字段的初始值，那么新增加的记录就从这个初始值开始自增。例如，如果表中插入的第一条记录的 id 值设置为 <font color='orange'>5</font> ，那么再插入记录时，id 的值就会<font color='orange'>从 5 开始往上增加</font>。

{% note blue 'fas fa-fan' flat %}方式一{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220322180027.png)

 
```sql
create table t_user2(
id int primary key auto_increment,
name varchar(20)
)auto_increment = 100;
insert into t_user2 values(null,'张三');
insert into t_user2 values(null,'张三');
```
 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220322230154.png)

{% note blue 'fas fa-fan' flat %}方式二{% endnote %}

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220323092511.png)

 
```sql
create table t_use3 (
			id int primary key auto_increment,
			name varchar(20)
);
alter table t_use3 auto_increment = 200;
insert into t_use3 values(null,'张三');
insert into t_use3 values(null,'李四');
```
 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220323092345.png)

{% note blue 'fas fa-fan' flat %}delete 和 truncate 在删除后自增列的变化{% endnote %}

- <font color='orange'>delete </font>数据之后自动增长从<font color='orange'>断点开始</font>
- <font color='orange'>truncate</font> 数据之后自动增长从<font color='orange'>默认起始值开始</font>

```sql
delete from t_use3;
insert into t_use3 values(null,'张三');
insert into t_use3 values(null,'李四');
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220323095055.png)

```sql
truncate t_use3;
insert into t_use3 values(null,'张三');
insert into t_use3 values(null,'李四');
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220323095804.png)

##  约束-非空约束

{% note blue 'fas fa-fan' flat %}概念{% endnote %}

MySQL 非空约束(not null) 指字段的值<font color='orange'>不能为空</font>。对于使用了非空约束的字段，如果用户在添加数据时<font color='orange'>没有指定值</font>，数据库系统就会<font color='red'>报错</font>。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220323100831.png)

{% note blue 'fas fa-fan' flat %}方式一{% endnote %}

```sql
create table t_use5(
	id int,
	name varchar(20) not null, -- 指定非空约束
	address varchar(20) not null -- 指定非空约束
);
insert into t_use5(id) values(111); -- 不可以
insert into t_use5(id,name,address) values(111,null,null); -- 不可以
insert into t_use5(id,name,address) values(111,'null','null'); -- 可以（字符串：NULL）
insert into t_use5(id,name,address) values(111,'',''); -- 可以（空串）
```

{% note blue 'fas fa-fan' flat %}方式二{% endnote %}

```sql
create table t_user1(
	id int,
	name varchar(20) ,
	address varchar(20)
);
alter table t_user1 modify name varchar(20) not null;
alter table t_user1 modify address varchar(20) not null;
```

{% note blue 'fas fa-fan' flat %}查看是否为非空约束{% endnote %}

输入命令，运行结果看【<font color='orange'>状态</font>】那栏，"<font color='orange'>NO</font>" 代表是<font color='orange'>非空约束</font>

```sql
desc t_user1; -- desc 后面的是你要查询的表名
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220323104418.png)

或者直接右键表点击【<font color='orange'>设计表</font>】，进去看【<font color='orange'>不是null</font>】那栏，打钩<font color='orange'>√ </font>就是代表非空约束

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220323104829.png)

{% note blue 'fas fa-fan' flat %}删除非空约束{% endnote %}

删除也是非常简单只需把 '<font color='orange'>not null</font> 去掉运行即可

```sql
alter table t_user1 modify name varchar(20);
alter table t_user1 modify address varchar(20);
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220323105431.png)

## 约束-唯一约束

{% note blue 'fas fa-fan' flat %}概念{% endnote %}

唯一约束 (Unique key) 是指所有记录中字段的值<font color='orange'>不能重复出现</font>。例如，为 id 字段加上唯一性约束后，每条记录的 id 值都是<font color='orange'>唯一的</font>，不能出现重复的情况。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220323110245.png)

{% note blue 'fas fa-fan' flat %}方式一{% endnote %}

```sql
create table t_user2(
	id int,
	name varchar(20) unique -- 指定唯一约束
);
insert into t_user2 values(100,'李四');
insert into t_user2 values(100,'李四2');
insert into t_user2 values(101,null); -- 在MySQL中 null 和任何值都不相同，甚至和自己也不相同
insert into t_user2 values(102,null);
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220323111739.png)

{% note blue 'fas fa-fan' flat %}方式二{% endnote %}

```sql
create table t_user3(
	id int,
	name varchar(20)
);
alter table t_user3 add constraint unique_pn unique(name);
```

{% note blue 'fas fa-fan' flat %}删除唯一约束{% endnote %}

```sql
alter table t_user3 drop index unique_pn; -- 这是方式二的删除约束方式，unique_pn代表是这个唯一约束的名字
alter table t_user2 drop index name; -- 这是方式一的删除约束方式
```


##  约束-默认约束

{% note blue 'fas fa-fan' flat %}概念{% endnote %}

MySQL 默认值约束用来指定某列的默认值。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220323113441.png)

{% note blue 'fas fa-fan' flat %}方式一{% endnote %}

```sql
create table t_user4(
	id int,
	name varchar(20) default '小狗' -- 指定默认约束
);
insert into t_user4 values(123,'小米');
insert into t_user4(id) values(123);
insert into t_user4 values(123,null); -- 这个不会触发默认值，因为已经明确指定为null
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220323114649.png)

{% note blue 'fas fa-fan' flat %}方式二{% endnote %}

```sql
create table t_user6(
	id int,
	name varchar(20)
);
alter table t_user6 modify name varchar(20) default '张三';
insert into t_user6 values(123,'小米');
insert into t_user6(id) values(123);
insert into t_user6 values(123,null);
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220323115135.png)

 {% note blue 'fas fa-fan' flat %}删除默认约束{% endnote %}

```sql
alter table t_user6 modify name varchar(20) null;
insert into t_user6(id) values(7); -- 删除后再插入可以看到约束已经没了
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220323115553.png)

##  约束-零填充约束

 {% note blue 'fas fa-fan' flat %}概念{% endnote %}

- 插入数据时，当该字段的值的长度<font color='orange'>小于</font>定义的长度时，会在该值的前面<font color='orange'>补上相应的0</font>
- zerofill 默认为 <font color='orange'>int(10)</font>
- 当使用 zerofill 时，默认会自动加 <font color='orange'>unsigned</font>（无符号）属性，使用 unsigned 属性后，数值范围是原来的<font color='orange'>2倍</font>，例如，有符号为 <font color='cornflowerblue'>-128~+127</font>，无符号为 <font color='cornflowerblue'>0~256</font>

 {% note blue 'fas fa-fan' flat %}操作{% endnote %}

```sql
create table t_user7(
	id int zerofill,
	name varchar(20)
);
insert into t_user7 values(111,'张三');
insert into t_user7 values(1,'李四');
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220323120826.png)

 {% note blue 'fas fa-fan' flat %}删除零填充约束{% endnote %}

```sql
alter table t_user7 modify id int;
```

##  约束-总结

{% gallery %}
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220323122730.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220323122849.png)
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FQQ%E6%88%AA%E5%9B%BE20220323122938.png)
{% endgallery %}
