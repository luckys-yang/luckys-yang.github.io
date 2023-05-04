---
title: Linux-文件基本操作
cover: /img/num89.webp
comments: false
categories:
  - Linux
abbrlink: 3ae376c6
date: 2022-09-24 10:15:00
updated: 2022-10-11 13:39:32
---
##  man手册
```bash
# 打开手册
man man
# 查看函数名或者命令所在的本数
man -f 函数名/命令
# 退出手册 
q
# 走到下一行
j
#  走到上一行
k
# 回到第一行
g
# 跳到最后一行
G 
# 向下翻一页
f
# 向上翻一页 
b
```
![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220925214659.jpg)

##  文件类型与权限

{% note blue 'fas fa-fan' flat %} Linux用户 {% endnote %}

Linux系统中的3类用户：

- <span style="color:red;">管理员</span>：比如root用户，权限最大
- <span style="color:red;"> 系统用户</span>：系统用户的uid值为 `0-499`；不同发行版可能不一致，以实际实现为准；系统用户一般用于 `守护进程服务`使用，一般不允许登录系统（即/sbin/nologin），这样可以降低对应进程的权限
  3）<span style="color:red;"> 普通用户</span>：一般用于人机交互登录的账户

{% note blue 'fas fa-fan' flat %} umark的作用 {% endnote %}

umask在创建文件或文件夹的时候生成默认的 `UGO访问权限` 

umask用来限定文件和文件夹创建时的默认权限， `用文件（666）或文件夹（777）的默认最大权限减去umask即为文件和文件夹创建时的默认权限`

##  文件编程的一般步骤

1. 在Linux中要操作一个文件，一般是 `先open打开一个文件，得到文件描述符`，然后对文件进行读写操作(或其他操作)，最后是close关闭文件即可。

2. 强调一点:对文件进行操作时，一定要先打开文件，打开成功之后才能操作，如果打开失败，就不用进行后边的操作了， `最后读写完成后，一定要关闭文件，否则会造成文件损坏`
3. 文件平时是存放在 `块设备中的文件系统文件中的`，我们把这种文件叫 `静态文件`，当我们去open打开一 个文件时，linux内核做的操作包括:内核在进程中建立一个打开文件的数据结构，记录下我们打开的这个文件;内核在内存中申请一段内存， 并且将静态文件的内容从块设备中读取到内核中特定地址管理存放(叫 `动态文件`)。
4. 打开文件以后，以后对这个文件的读写操作，都是 `针对内存中的这一份动态文件的`， 而并不是针对静态文件的。当然我们对动态文件进行读写以后，此时内存中动态文件和块设备文件中的静态文件就不同步了， `当我们close关闭动态文件时，close内部内核将内存中的动态文件的内容去更新(同步)块设备中的静态文件`
5. 为什么这么设计，不直接对块设备直接操作？
    `块设备本身读写非常不灵活，是按块读写的，而内存是按字节单位操作的，而且可以随机操作，很灵活`



{% note blue 'fas fa-fan' flat %} 文件类型 {% endnote %}

Linux文件类型常见的有： `普通文件、目录、字符设备文件、块设备文件、符号链接文件等。`

`普通文件`：Linux中最多的一种文件类型, 包括 纯文本文件(ASCII)；二进制文件(binary)；数据格式的文件(data);各种压缩文件。<span style="color:# e80daf">第一个属性为 [-] </span>。如[-rw-r–r–]

`目录文件`：在linux中，它的思想是一切皆是文件。<span style="color:# e80daf">第一个属性为 [d]</span>，例如 [drwxr-xr-x]

`字符设备文件`：串行端口的接口设备，例如键盘、鼠标等等。<span style="color:# e80daf">第一个属性为[c]</span>

`块设备文件`：存储数据以供系统存取接口设备，简单而言就是硬盘。如/dev/hda1。<span style="color:# e80daf">第一个属性为 [b]</span>

`套接字文件`：<span style="color:# e80daf">第一个属性为[s]</span>

`管道文件`：FIFO也是一种特殊的文件类型，<span style="color:# e80daf">第一个属性为 [p]</span>

`链接文件`：软连接文件。<span style="color:# e80daf">第一个属性为 [l]</span>，例如 [lrwxrwxrwx]

第一位是文件类型，-表示普通文件，d是目录以此类推
{% note blue 'fas fa-fan' flat %} 文件权限{% endnote %}

`r`: 读权限
`w` : 写权限
`x` : 执行权限

若用户建立的为文件则默认没有可执行权限，即只有可读可写权限，也就是默认文件权限最大为 `666`，所以对应类似shell脚本等需要手动添加可执行权限。



##  Linux-open函数

```cpp
//包含头文件(一个都不能少)
# include <sys/types.h>
# include <sys/stat.h>
# include <fcntl.h>

//如果是写在C语言代码还要加上C语言的头文件：
# include <stdio.h>
```



```cpp
//open函数有两个参数和三个参数
//(参数1)Pathname:要打开的文件名（Linux下文件的路径，缺省为当前路径）
//(参数2)Flags(权限)：
1. O_RDONLY(只读打开) 2. O_WRONLY(只打打开) 3. O_RDWR(可读可写打开)；
//以上这三个常数中应当只指定一个，下列常数是可选择的：（可用 '|' 指定多项）
O_CREAT： 若文件不存在则创建它。使用此选项时，需要同时说明第三个参数mode，用其说明该新文件的存取许可权限。
O_EXCL：如果同时指定了 O_CREAT，而文件已经存在，则返回错误信息。       
O_APPEND：每次写时都加到文件的尾端。（写文件在文件末尾不会覆盖原先内容）
O_TRUNC：属性去打开文件时，如果这个文件中本来是有内容的，而且为只读或只写成功打开，则将其长度截短为0。（如果文件里面有东西直接删然后写）
O_NOCTTY：当文件为终端时，阻止该终端成为进程的控制终端

/* (参数3)Mode：一定是在flags中使用了O_CREAT标志，mode记录待创建的文件的访问权限(用八进制表示(3个为一组)，如0777表示最高权限，数字0前缀表示八进制)；
    		文件权限由open的mode参数和当前进程的umask掩码共同决定
    		比如0644表示-rw-r–r–（如果没有对应权限会用-代替）
    		R：读，W：写，X：执行，USR：文件所属的用户，GRP：文件所属的组，OTH：其他用户
*/
    
/* 返回值：open函数返回的是一个数字，利用一个整型数字fd来接收
   失败： -1
   成功：大于0(即文件描述符)
*/
/* 文件描述符范围是 0~1023，其中0~2固定是：
    0是标准输入(/dev/stdin)
    1是标准输出(/dev/stdout)
    2是标准错误(/dev/stderr)
    这3个标准设备文件是系统运行程序时默认打开
*/
//dev文件夹是存储硬件设备信息的目录，dev是设备的英文device缩写，通过该目录可以直接访问硬件；该目录中并不是放的外部设备驱动程序，而是一个访问这些外部设备的端口，可以便捷的去访问这些外部设备。
   

int open(const char* pathname,int flags);
int open(const char* pathname,int flags,mode_t mode);
```



##  Linux-perror函数

```cpp
//perror（）用来将上一个函数发生错误的原因输出到标准设备(stderr)
//将你输入的一些信息和现在的errno所对应的错误一起输出
perror("错误：");
```

##  Linux-write函数

```cpp
//头文件
# include <unistd.h>
```

```cpp
//函数说明：write()会把参数buf所指的内存写入count个字节到参数fd所指的文件内
//参数1
文件描述符fd
//参数2
无类型的指针buf，可以存放要写的内容
//参数3
写多少字节数
/* 返回值
成功：返回实际写入的字节数（len）。
失败：返回-1，错误代码存入errno中  

strlen()用来读取长度，不包括'/0'，sizeof才包括！
*/

write(int fd, const void *buf, size_t count);
```



##  Linux-read函数

```cpp
//头文件
# include <unistd>
```

```cpp
//函数说明：read()会把参数fd所指的文件传送count 个字节到buf 指针所指的内存中。

//参数1
文件描述符fd
//参数2
读取字节数存储位置
//参数3
读取字节数
//返回值
成功：返回读取的字节数
失败：返回-1并设置errno
如果在调read之前已到达文件末尾，则这次read返回0

read(int fd, void *buf, size_t count);
```

```cpp
readbuf=(char *)malloc(sizeof(char)*n_write+1);//申请内存需要加多1或者1以上拿来放/0
```

##  Linux-close函数

```cpp
//头文件
# include <unistd.h>
```

```cpp
//每次打开文件操作完需要关闭它

int close(int fd)//函数原型 
```



##  解决文件写入后光标在末端问题

read函数是从光标位置开始读取，所以需要写入数据后把光标移动到首段

方法1：

```cpp
close(fd)//关闭文件
fd=open("./xxx",O_RDWR);//然后重启文件就能使光标移动到首段
```

方法2：

```cpp
lseek(fd,0,SEEK_SET);//移动到首段
```

##  Linux-lseek函数

```cpp
//头文件
 # include <sys/types.h>
 # include <unistd.h>
```

```cpp
//参数1
fd：文件描述符
//参数2
offset：文件偏移量
/*
1. offset为负数时向文件开头偏移，正数向文件末尾偏移，0则为不偏移(一般设置为0)
2. 参数 offset 的含义取决于参数 whence：
	
*/
//参数3
whence：文件偏移相对位置
    (1)如果 whence 为SEEK_SET，offset相对于文件开头进行偏移
	(2)如果 whence 为 SEEK_END，offset相对于文件末尾进行偏移
	(3)如果 whence 为 SEEK_CUR，offset相对文件当前位置进行偏移

//返回值
成功：返回文件的偏移量
失败：-1
    

off_t lseek(int fd, off_t offset, int whence);//函数原型
lseek(i fd, 0, SEEK_SET)//为光标开头偏移0，即光标置于最开头。
lseek(i fd, 0, SEEK_END)//为光标末端偏移0，即光标置于最末尾
```

##  Linux快速获取文件里面字符长度

```cpp
//先用open函数打开后使用lseek（）函数读取到末尾，用一个整型i来赋值
int main()
{
    int fd;
    char *buf="fucking";
    fd=open("./files",O_RDWR);
    int i=lseek(fd,0,SEEK_END);
    printf("long：",i);
}
```

##  read函数指针移动问题

当我们使用 `read()` 函数去读取数据时，它会按照你提供的 `count`去读取count个字节的数据， `同时文件指针后移`，但是文件指针移动并非是以字节为单位来移动的！！！而是以 `字符` 为单位来移的（这里说的字符并非只是char类型的，还包括了宽字符。我把它们都叫字符）

`就像是操作堆栈差不多，依次读取每往后移动一位最前面的一位就会被覆盖掉`

##  C语言-malloc

```cpp
//头文件
# include <stdlib.h>
//num_bytes 是无符号整型，用于表示分配的字节数
//返回值：
成功:则返回指向被分配内存的指针(此存储区中的初始值不确定)
失败:返回空指针NULL。
/*
void* 表示未确定类型的指针，void *可以指向任何类型的数据，更明确的说是指申请内存空间时还不知道用户是用这段空间来存储什么类型的数据（比如是char还是int或者...）
*/
//注意：当内存不再使用时，应使用free()函数将内存块释放

//格式：(分配类型 *)malloc(分配元素个数 *sizeof(分配类型))    
void *malloc(unsigned int num_bytes);//函数原型
```



##  例1

```cpp
# include <stdio.h>
# include <sys/types.h>
# include <sys/stat.h>
# include <fcntl.h>
# include <unistd.h>
# include <string.h>
# include <stdlib.h>

int main()
{
    int fd;
    char *buf="Hello Yang";
    fd=open("./yang2.txt",O_RDWR|O_CREAT,0777);//打开yang2.txt如果不存在则创建，权限为777最高权限
    if(fd==-1)
    {
        perror("open Error");
        return -1;
    }
    else
        printf("open Success\n");

    int write_byte_num=write(fd,buf,strlen(buf));
    if(write_byte_num==-1)
    {
        perror("write Error!");
        return -2;
    }
    else
        printf("write Success,Write_Byte_Num:%d\n",write_byte_num);
    lseek(fd,0,SEEK_SET);

    char *readbuf;
    readbuf=(char*)malloc(sizeof(char)*write_byte_num+10);//多加10防止内存溢出
    if(!readbuf)
    {
        perror("malloc");
        return -3;
    }
    int read_byte_num=read(fd,readbuf,write_byte_num);
    close(fd);
    if(read_byte_num==-1)
    {
        perror("read Error");
        return -4;
    }
    else if(read_byte_num==0)
        printf("read 0 Byte\n");
    else
    {
        printf("read Success,Read_Byte_Num:%d\n",read_byte_num);
        printf("%s\n",readbuf);
    }
    free(readbuf);//释放
    readbuf=NULL;
        
    return 0;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220924154741.jpg)

##  代码实现文件CP指令

Linux正常cp是在输入命令：`cp 123.c 666.c`(在这里123.c是源文件，666.c是目标文件)

```cpp
//这里有三个参数
//这里注重前面两个参数即可最后一个不怎么用
//参数1
argc：是命令行总的参数
//参数2
argv[]：是argc个参数，其中第0个参数是程序命令名
    
/*
argv是一个二级指针，是一个数组的指针，意思是这个指针的每一项都是一个数组
*/
    
/*
char **argv
分析：argv是一个指针变量，argv的指向（*argv）是char *，也就是argv指向的也是一个指针 ；*argv的指向（**argv）是char

char *argv[]
分析：首先argv是一个数组，数组里面的元素是指针变量（char *），数组里元素指向的是char
*/

int main( int argc , char *argv[] , char *envp[] );//函数原型
```

```cpp
# include <stdio.h>

int main(int argc,char **argv)
{
    printf("total program:%d\n",argc);
    printf("No.1 program:%s\n",argv[0]);
    printf("No.2 program:%s\n",argv[1]);
    printf("No.3 program:%s\n",argv[2]);
    
    return 0;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220924172352.jpg)

`cp指令的思路`：

1. 打开创建src.c
2. 读src.c到buf中
3.  打开创建des.c
4. 将buf写入des.c
5. close关闭两个文件


```cpp
# include <stdio.h>
# include <sys/types.h>
# include <sys/stat.h>
# include <fcntl.h>
# include <unistd.h>
# include <stdlib.h>
# include <string.h>


int main(int argc,char **argv)
{
    int fd_src;//src文件描述符
    char *buf="Life is a Fucking Movie";//写入源文件的字符串
    //创建并打开src文件
    fd_src=open(argv[1],O_RDWR|O_CREAT,0777);
    if(fd_src==-1)
    {
        perror("open-src");
        return -1;
    }
    else
        printf("open src.c Success\n");
    //写入内容到src文件
    int write_byte_num=write(fd_src,buf,strlen(buf));
    if(write_byte_num==-1)
    {
        perror("write_src");
        return -2;
    }
    else
        printf("write src.c Success,byte is %d\n",write_byte_num);
    lseek(fd_src,0,SEEK_SET);//不能忘了这步，回到首段
    //读取src文件内容到readbuf
    char *readbuf;
    readbuf=(char*)malloc(sizeof(char)*write_byte_num+10);
    if(!readbuf)
    {
        perror("malloc");
        return -3;
    }
    int read_byte_num=read(fd_src,readbuf,write_byte_num);
    if(read_byte_num==-1)
    {
        perror("read_src");
        return -4;
    }
    else if(read_byte_num==0)
    {
        perror("read 0 byte\n");
        return -5;
    }
    else
    {
        printf("read src.c Success,byte is %d\n",read_byte_num);
    }
    //创建并打开des.c文件
    int fd_des;//des文件描述符
    fd_des=open(argv[2],O_RDWR|O_CREAT|O_TRUNC,0777);
    if(fd_des==-1)
    {
        perror("open des");
        return -6;
    }
    else
        printf("open des.c Success\n");
    //把readbuf的内容写入des.c
    int write_byte_num2=write(fd_des,readbuf,read_byte_num);
    if(write_byte_num2==-1)
    {
        perror("write des");
        return -7;
    }
    else
        printf("write des.c Success,byte is %d\n",write_byte_num2);
    lseek(fd_des,0,SEEK_SET);
    close(fd_src);
    close(fd_des);
    free(readbuf);
    readbuf=NULL;
    

    return 0;
}
```
 

<span style="color:red">注</span>：代码用到了打开创建文件用到 `O_TRUNC`，用来如果这个文件中本来是有内容的，完全覆盖（我的代码暂时没写）

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220924183613.jpg)

##  修改程序的配置文件(strstr)

```cpp
//头文件
# include <string.h>
```

```cpp
//从str1中寻找str2第一次出现的位置
//返回值：
返回指向第一次出现str2位置的指针，如果没找到则返回NULL

char *strstr(char *str1, char *str2);
```

`场景`：<span style="color:# e80daf">一配置文件有如下内容，需将LENG =3改成LENG = 5</span>

```cpp
SPEED=3
LENG=3
SCORE=9
LEVEL=0
```

`思路`：

1. 找到文件头的位置
2. 往后移，用地址++的方式找到需要更改的位置(使用strstr函数)
3. 修改文件内容
4. 光标回到最前面
5. 把修改好的内容重新写入该文件
6. 关闭文件，释放内存

```cpp
# include <stdio.h>
# include <sys/types.h>
# include <sys/stat.h>
# include <fcntl.h>
# include <unistd.h>
# include <string.h>
# include <stdlib.h>

int main(int argc,char **argv)
{
    int fd;
    char *readbuf=NULL;
    if(argc!=2)
    {
        printf("param error\n");
        exit(-1);
    }
    fd=open(argv[1],O_RDWR);
    int size=lseek(fd,0,SEEK_END);//统计字节
    lseek(fd,0,SEEK_SET);//回到首段
    readbuf=(char*)malloc(sizeof(char)*size+10);
    int read_byte_num=read(fd,readbuf,size);
    char *p=strstr(readbuf,"LENG=");
    if(p==NULL)
    {
        printf("not found!\n");
        exit(-1);
    }
    p+=strlen("LENG=");
    *p='5';
    lseek(fd,0,SEEK_SET);//改完需要回到首段
    int write_byte_num=write(fd,readbuf,strlen(readbuf));//重新写入文件
    printf("Modify Success\n");
    close(fd);
    free(readbuf);
    readbuf=NULL;
    return 0;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220924214814.jpg)

##  写结构体数组到文件

```cpp
# include <sys/types.h>
# include <sys/stat.h>
# include <unistd.h>
# include <stdio.h>
# include <stdlib.h>
# include <fcntl.h>

//写整数到文件
//需要注意直接传数字是错误的，需要转换成字符串写入
//直接传数字打开文档三显示数字的ASICC码对应的字符,且后面还有3个\00，因为b是一个字节int是4字节
int main()
{
    int fd;
    int date1 = 100;
    int date2 = 0;
    fd = open("./yang2.txt", O_RDWR);
    if (fd == -1)
    {
        perror("open");
        exit(-1);
    }
    printf("open Success\n");
    int write_byte_num = write(fd, &date1, sizeof(int));
    if (write_byte_num == -1)
    {
        perror("write");
        exit(-1);
    }
    printf("write Success\n");
    lseek(fd, 0, SEEK_SET);
    int read_byte_num = read(fd, &date2, sizeof(int));
    if (read_byte_num == -1)
    {
        printf("read");
        exit(-1);
    }
    else if (read_byte_num == 0)
    {
        printf("read 0 byte\n");
        exit(-1);
    }
    else
    {
        printf("read Success\n");
        printf("write:%d read:%d count:%d\n", write_byte_num, read_byte_num, date2);
    }
    close(fd);
    return 0;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220924230059.jpg)

```cpp
# include <sys/types.h>
# include <sys/stat.h>
# include <unistd.h>
# include <stdio.h>
# include <stdlib.h>
# include <fcntl.h>
//写结构体到文件
//同理文档也是显示ASICC码
struct Test
{
    int a;
    char c;
};

int main()
{
    int fd;
    struct Test date1={123,'a'};
    struct Test date2;
    fd=open("./yang2.txt",O_RDWR);
    if(fd==-1)
    {
        perror("open");
        exit(-1);
    }
    int write_byte_num=write(fd,&date1,sizeof(struct Test));
    if(write_byte_num==-1)
    {
        perror("write");
        exit(-1);
    }
    lseek(fd,0,SEEK_SET);
    int read_byte_num=read(fd,&date2,sizeof(struct Test));
    printf("read:%d %c\n",date2.a,date2.c);
    close(fd);
    
    return 0;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220924231827.jpg)

```cpp
//写结构体数组到文件
# include <sys/types.h>
# include <sys/stat.h>
# include <unistd.h>
# include <stdio.h>
# include <stdlib.h>
# include <fcntl.h>

struct Test
{
    int a;
    char c;
};

int main()
{
    int fd;
    struct Test date1[2]={{123,'a'},{666,'b'}};
    struct Test date2[2];
    fd=open("./yang2.txt",O_RDWR);
    if(fd==-1)
    {
        perror("open");
        exit(-1);
    }
    int write_byte_num=write(fd,&date1,sizeof(struct Test)*2);//因为数组大小是2
    if(write_byte_num==-1)
    {
        perror("write");
        exit(-1);
    }
    lseek(fd,0,SEEK_SET);
    int read_byte_num=read(fd,&date2,sizeof(struct Test)*2);
    printf("read:%d %c\n",date2[0].a,date2[0].c);
    printf("read:%d %c\n",date2[1].a,date2[1].c);
    close(fd);
    
    return 0;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220924233112.jpg)

##  C库-fopen函数

```cpp
//参数1
字符串包含欲打开的文件路径及文件名
//参数2
流形态(必须要用双引号)：
r（只读方式打开一个文本文件，必须要存在）
rb（只读方式打开一个二进制文件）
w（只写方式打开一个文本文件，若文件不存在则建立该文件）
wb（只写方式打开一个二进制文件）
a（追加方式打开一个文本文件，若文件不存在则建立该文件）
ab（追加方式打开一个二进制文件）
r+（可读可写方式打开一个文本文件，必须要存在）
rb+（可读可写方式打开一个二进制文件）
w+（可读可写方式创建一个文本文件，若文件不存在则建立该文件，会覆盖之前内容）
wb+（可读可写方式生成一个二进制文件）
a+（可读可写追加方式打开一个文本文件，若文件不存在则建立该文件）
ab+（可读可写方式追加一个二进制文件）

//返回值
返回值：文件顺利打开或创建后，指向该文件指针就会被返回。如果文件打开或创建失败，则返回 NULL


FILE * fopen(const char * path,const char * mode);//函数原型
```

- 缓冲文件系统与非缓冲系统的区别

<span style="color:# e80daf">缓冲文件系统(fopen)</span> ：在 `内存为每个文件开辟一个缓存区`，当执行读操作，从磁盘文件将数据读入内存缓冲区，装满后从内存缓冲区依次读取数据。写操作同理。 `内存缓冲区的大小影响着实际操作外存的次数，缓冲区越大，操作外存的次数越少，执行速度快，效率高。`缓冲区大小由机器而定。借助 `文件结构体指针`对文件管理，可读写字符串、格式化数据、二进制数据。

<span style="color:# e80daf">非缓冲文件系统(open)</span>：依赖操作系统功能对文件读写， `不设文件结构体指针，只能读写二进制文件。`

-  `open属于低级IO，fopen属于高级IO`
- `open返回文件描述符`，属于用户态，读写需进行用户态与内核态切换。 `fopen返回文件指针`

- open是系统函数， `不可移植`fopen是标准C函数， `可移植`
- 一般 `用fopen打开普通文件，open打开设备文件`
- 如果顺序访问文件， `fopen比open快`；如果随机访问文件， `open比fopen快`

##  C库-fwrite函数

```cpp
//参数1
buffer：是一个指向用于保存数据的内存位置的指针 (是一个指针，对于fwrite来说，是要获取数据的地址）
//参数2
size：是每次读取的字节数
//参数3
count：是读取的次数
//参数4
是数据写入的流(目标指针的文件)
//返回值
是实际写入的元素（并非字节）数目(取决于第三个参数，即写多少次就是多少)
如果输入过程中遇到了文件尾或者输出过程中出现了失误，这个数字可能比请求的元素数目要小                            
//例子(代码中有两种写法，意思是一样的)
fwrite(str,sizeof(char),strlen(str),fp);一次写char大小，写str这么多个
fwrite(str,sizeof(char)*strlen(str),1,fp);一次写char大小str这么多个，写一次
                   
size_t fwrite(void*buffer,size_ size,size_t count,FILE*stream);//函数原型
```

##  C库-fread函数

```cpp
//功能：是用于读取二进制数据

//参数1
buffer:是读取的数据存放的内存的指针，（可以是数组，也可以是新开辟的空间）
    ps:是一个指向用于保存数据的内存位置的指针（为指向缓冲区保存或读取的数据或者是用于接收数据的内存地址）
//参数2
size：是每次读取的字节数
//参数3
count：是读取的次数
//参数4
是数据写入的流(目标指针的文件)
//返回值
成功：是实际读取的元素（并非字节）数目
失败：返回 0
ps：如果输入过程中遇到了文件尾或者输出过程中出现了错误，这个数字可能比请求的元素数目要小        
        
size_t fread(void*buffer,size_t size,size_t count,FILE*stream);//函数原型
```



##  例2

```cpp
# include <stdio.h>
# include <string.h>


int main()
{
    FILE *fp;
    char *str="Live is a Fuckong Movie";
    char readbuf[50]={0};
    fp=fopen("./yang3.txt","w+");
    if(fp!=NULL)
        printf("open Success\n");
    int num1=fwrite(str,sizeof(char)*strlen(str),1,fp);
    if(num1==1)
        printf("write Success\n");
    fseek(fp,0,SEEK_SET);
    int num2=fread(readbuf,sizeof(char)*strlen(str),1,fp);
    if(num2==1)
        printf("read Success\n");
    printf("read date:%s\n",readbuf);
    fclose(fp);
    return 0;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220925111325.jpg)

##  C库-fputc函数

```cpp
//函数功能： 将字符c写到文件指针fp所指向的文件的当前写指针的位置
//参数1
c ：为要写入的字符，虽然函数被定义为整型数，但仅用其低八位
//参数2
fp：文件指针  
//返回值
成功：返回写入的字符
失败：返回 EOF 
//注意：
    
int fputc (int c, File *fp)//函数原型
```

##  C库-fgetc函数

```cpp
//用于从文件流中读取一个字符
//参数
stream：为文件指针
//返回值
成功:读取到的字符，
读到文件结尾时返回EOF
int fgetc(FILE * stream);//函数原型
```

##  C库-feof函数

```cpp
//检测流上的文件结束符
//参数
stream：为文件指针
//返回值
如果文件结束，则返回非0值，否则返回0    
int feof(FILE *stream);//函数原型
```

```cpp
//常用写法（此写法不严谨，在linux读取时会把 EOF(-1/\337)也读取了）
 while(!feof(fp))
 {
     
 }
//读取时最好拿fgetc返回值当判断条件
while(1)
{
    char c=fgetc(fp);
    if(c==EOF)
        break;
    printf("%c",c);
}
```

##  例3

```cpp
# include <sys/types.h>
# include <sys/stat.h>
# include <unistd.h>
# include <stdio.h>
# include <stdlib.h>
# include <fcntl.h>
# include <string.h>


int main()
{
    FILE *fp;
    char c;
    char *str ="a+b=c Y/N";
    char *p=str;//在这不要直接操作原数据指针，可以操作p指针
    fp=fopen("./yang3.txt","w+");
    for(int i=0;i<strlen(str);i++)
    {
        fputc(*p,fp);
        p++;
    }
    printf("fputc Success\n");
    fseek(fp,0,SEEK_SET);
    while(1)
    {
        c=fgetc(fp);
        if(c==EOF)
            break;
        printf("%c",c);
    }
    printf("\nfgetc Success\n");
    fclose(fp);
    return 0;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220925212611.jpg)