---
title: MySQL-基本操作DDL
cover: /img/num39.webp
comments: false
categories:
  - MySQL学习笔记
abbrlink: a3fd0bcd
date: 2022-03-09 12:42:00
updated: 2022-06-03 21:09:47
---
## DDL解释

DDL(Data Definition Language), 数据定义语言，该语言部分包括以下内容：

- <font color='orange'>对数据库的常用操作</font>
- <font color='orange'>对表结构的常用操作</font>
- <font color='orange'>修改表结构</font>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2Fb2Rly8.png)

## 对数据库的常用操作

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2Fb2Wn74.png)

```sql
-- 这是注释(光标在某尾时按CTRL + /)
# 这也是注释
```

<font color='pink'>报错显示这个表示数据库已经存在，不能再创建</font>

```sql
> 1007 - Can't create database 'mydb1'; database exists
```

完整代码：

 
```sql
-- 这是注释(光标在某尾时按CTRL + /)
# 这也是注释

-- 查看所有数据库
show databases;

-- 创建数据库
create database mydb1;
-- if not exsts  表示如果不存在
create database if not exists mydb1;

-- 选择使用哪一个数据库
use mydb1;

-- 删除数据库
drop database mydb1;
-- if exists 表示如果存在 
drop database if exists mydb1;

-- 修改数据库编码
alter database mydb1 character set utf8;
```
 


## 对表格的常用操作
### 创建表

- 创建表格式

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2Fb2HNHx.png)

 
```sql
-- 选择数据库
use student;

create table if not exists m_student(
 sid int,
 name varchar(20),# varchar 相当于字串符;20表示长度
 gender varchar(10),
 age int,
 birth date,
 address varchar(20),
 score double
 );
```
 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2Fb2OtzD.png)

- 数据类型

数据类型是<font color='orange'>指在创建表的时候为表中字段指定数据类型</font>，只有数据<font color='orange'>符合类型要求</font>才能存储起来，使用数据类型的原则是:<font color='orange'>够用就行</font>，尽量使用取值范围小的，而不用大的，这样可以更多的<font color='orange'>节省存储空间</font>。

①<font color='red'>数值类型</font>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2Fb2jKER.png)

```sql
decimal(M,D)--->decimal(5,2) ---指定多少位：5表示有效位数（整数部分+小数部分）；2表示小数点后的位数
```

②<font color='red'>字符串类型</font>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbRSMLD.png)

③<font color='red'>日期类型</font>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbRpd91.png)


### 其他操作

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbR938I.png)

 
```sql
-- 1.查看当前数据库所有的表
show tables;

-- 2.查看指定表的创建语句
show create table m_student;

-- 3.查看表结构
desc m_student;

-- 4.删除表
drop table m_student;
```
 

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbRCYWR.png)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbRCWOf.png)


### 修改表添加列

<font color='orange'>语法格式</font>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbRPOCd.png)

```sql
-- 修改表结构
--  # 为m_student表添加一个新的字段：系别 dept 类型：varchar(20)
alter table m_student add dept varchar(20);
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbRkq5F.png)

### 修改列名和类型和删除列

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbRkPpj.png)

```sql
-- 修改表列名和类型
--  # 为student表的dept字段更换为department varchar(30)
alter table m_student change dept department varchar(30);

-- 修改表删除列
-- # 删除student表中department这列
alter table m_student drop department;
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbRAkPe.png)

 ### 修改表名

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/%E5%85%B6%E4%BB%96%2FbRm0gg.png)

```sql
-- 修改表名
-- # 将表m_student改名为stu
rename table m_student to stu;
```