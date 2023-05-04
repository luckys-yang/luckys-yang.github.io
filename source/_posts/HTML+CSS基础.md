---
title: HTML+CSS基础
cover: /img/num86.webp
comments: false
tags:
  - html
  - css
categories:
  - 前端学习
abbrlink: 10d96c98
date: 2022-09-10 20:20:00
updated: 2022-10-06 19:53:10
---
##  前言 用到的插件

`Live Server`

`Auto Rename Tag`

##  HTML常用标签

###  html文件结构

- html结构标签：

`<!DOCTYPE>`

`<html>`

`<head>`

`<title>`

`<body>`

html 的所有标签为 `树形` 结构，例如：

每一个标签都是一个节点，每一个标签一般来说都会有一个 `开始标签` 和 `结束标签`，开始标签和结束标签之间的部分就是它的所有子节点，在 `同一级` 的标签都是兄弟节点，有些特殊标签是没有起始标签和结束标签的，相当于 `叶子节点` ，`body 标签` 是承载网站页面所有内容的地方，所有 HTML 文件结构都是一棵树，根节点就是 `HTML 标签`

- `<html>` 与 `</html>` 之间的文本描述网页
- `<body>` 与 `</body>` 之间的文本是可见的页面内容

绝大多数标签都可以看成是  `<div>` 和 `<span>` 拓展过来的，没有本质的区别，只是它们默认的 CSS 样式不一样

在写网站的时候，习惯将每个部分放在 <div> 里面，好处：CSS 设置样式可以直接操作某个 <div>，js 也可以直接对 <div> 进行各种操作

`块状元素`：默认带一个<font color='cornflowerblue'> 回车</font>

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220908165340.jpg)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220908171523.png)

```html
<!-- HTML文件第一行是文件的类型 所有的网页都需要写这一条 -->
<!DOCTYPE html>
<!-- 浏览器语言环境 -->
<html lang="zh-CN">
    <!-- 声明了文档的字符编码 -->
    <meta charset="UTF-8">
    <!-- 定义的网页标题 -->
    <title>测试</title>
    <!-- 页面的 logo -->
    <link rel="icon" href="https://oss.wwru.cn/blog/WordPress/img/favicon.ico">
</head>

<!-- head 元素 规定文档相关的配置信息（元数据），包括文档的标题，引用的文档样式 CSS 和脚本等 -->
<!-- body 元素表示文档的内容(不是放到 head 里面的内容都会放到 body 里面) -->
<!-- 
    多行注释
    111
    222
    333
-->
<!-- 背景颜色 -->
<body style="background-color: yellow">
<!-- 标题标签1~6级 -->
<!-- 默认情况下，HTML 会自动地在块级元素前后添加一个额外的空行，比如段落、标题元素前后 -->
<h1>1222</h1>
<!-- p标签是文本的一个段落，段与段之间有间距，是块状元素 -->
<!-- p标签会自动过滤空格和回车，同样，绝大部分的 HTML 标签都会把空格和回车过滤掉 -->
<p>111</p>
<!-- span不是块状元素是行内元素，默认不带回车 -->
<span>侧耳</span>
<!-- HTML 链接是通过 <a> 标签进行定义的。在 href 属性中指定链接的地址 -->
<a href="https://www.baidu.com">百度</a>
<!-- 没有内容的 HTML 元素被称为空元素，比如换行 -->
<!-- 在 XHTML、XML 以及未来版本的 HTML 中，所有元素都必须被关闭，所以还是加上/比较好 -->
<br/>
<br/>
<!-- 属性总是以名称/值对的形式出现，属性总是在 HTML 元素的开始标签中规定。属性和属性值一般使用小写！ -->
<!-- 属性值应该始终被包括在引号内。双引号是最常用的，不过使用单引号也没有问题。
在某些个别的情况下，比如属性值本身就含有双引号，那么您必须使用单引号 
-->
<!-- HTML 图像是通过 <img> 标签进行定义的。 图像的名称和尺寸是以属性的形式提供的（默认单位px）-->
<img src="https://squoosh.app/c/icon-demo-large-photo-18da387a.jpg" width="104" height="142" />
<!-- align属性:水平对齐方式已经弃用 -->
<h1 align="center">这是弃用居中</h1>
<h1 style="text-align: center">这是标准居中</h1>
<!-- 水平线(<hr />标签)来分隔文章中的小节是一个办法（但并不是唯一的办法） -->
<hr />
<!-- 如果您希望在不产生一个新段落的情况下进行换行（新行），请使用 <br /> 标签 -->
<p>这是<br/>我爸爸<br/>哈哈哈</p>
<!-- 当显示页面时，浏览器会移除源代码中多余的空格和空行。所有连续的空格或空行都会被算作一个空格 -->
<!-- style 属性用于改变 HTML 元素的样式 -->
<p style="font-family: 华文新魏;color:red;font-size: 44px">STYLE属性</p>
<!-- pre标签很适合显示计算机代码，保留空格和换行 -->
<pre>这 是 
换行
</pre>
<!-- 写地址 -->
<address>
这是我的 <a href="tencent://AddContact/?fromId=50&fromSubId=1&subcmd=all&uin=444783764">QQ</a>  
</address>
<!-- 删除文本和下划线文本 -->
<p>我是<del>傻逼</del><ins>靓仔</ins></p>

</body>
</html>

```

![效果图](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220910102912.jpg)

### html块级标签

```html
<!DOCTYPE html>
<html lang="en">
    <meta charset="UTF-8">
    <title>测试</title>
</head>

<!-- 
h1~h6：定义标题
p：定义段落
定义无序列表：ul、li  定义有序列表：ol、li
    快捷方式：ul>li + 回车
通常是用来描述一些术语定义：dl，dt，dd

块级标签独占一行
-->
<h1>文章标题</h1>
<P>五十年来，WWF 一直致力于保护自然界的未来。 世界领先的环保组织，WWF 工作于 100 个国家，并得到美国一百二十万会员及全球近五百万会员的支持。</P>

<ul>
    <li>西瓜</li>
    <li>苹果</li>
    <li>香蕉</li>
</ul>

<ol>
    <li>打开冰箱</li>
    <li>拿出东西</li>
    <li>关闭冰箱</li>
</ol>

<dl>
    <dt>动物</dt>
    <dd>猫</dd>
    <dd>狗</dd>
    <dd>老虎</dd>
</dl>
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220910111651.jpg)

###  html行内标签

```html
<!-- 
a：超链接，用于页面间链接
img：定义图片
    alt：当图片失效时可以显示信息或者被设备识别
    title：当鼠标放上去时会显示图片标题
span、i：定义少量文本，i常用于图标

行内标签可以和别的标签独占一行，从左至右，从上到下
-->

<a href="https://t7.baidu.com/it/u=4162611394,4275913936&fm=193&f=GIF">百度图片</a>123
<!-- <img src="https://img0.baidu.com/it/u=1213543375,1345563756&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500" alt="动漫" title="动漫001"> -->
<a href="">
    <span>3</span>
    <span>成都新增本土“36+39”，详情公布</span>
    <span>热</span>
</a>
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220910124417.jpg)

###  特殊功能标签meta

`作用`：它位于 HTML 文档的 `<head>` 和 `<title>` 之间（有些也不是在 `<head>和<title>`之间），它提供的信息用户不可见，标签提供 `文档字符集，使用语言，作者等基本信息，关键词和网页等级的设定`

```html
<!DOCTYPE html>
<html lang="en">
    <meta charset="UTF-8">
    <!-- <meta http-equiv="refresh" content="5;url=https://y.qq.com"/> -->
    <title>测试</title>
</head>

<!-- 
设置页面字符集：<meta charset="uft-8">
设置网页的描述：<meta name="description" content="">
设置网页的关键字：<meta name="keywords" content="">
请求的重定向：<meta http-equiv="refresh" content="5;url=地址"/>
    5代表5秒后跳转，refresh是刷新意思
视口设置(切换到手机端自适应)：<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0,viewport-fit=cover">
-->
</body>
</html>
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220910130500.jpg)

###  table表格标签

简单的 HTML 表格由 table 元素以及一个或多个 `tr,th或td` 元素组成

```html
<!-- 
table(表格)：属性：border(设置边框，数字表示边框大小)，cellspacing(单元格与单元格间隙) cellpadding(单元格内填充)
tr(行)
td(列/单元格)：属性：colspan="2"(跨2列)，rowspan="2"(跨2行)
    属性写在你重复数据的第一个，然后第2个开始重复的可以删除
thead(表头)，th(表头单元格)，tbody(表主体)，tfooter(表尾)

-->
<table border="0" cellpadding="20" cellspacing="1">
<!-- 头部放在表头里 -->
<thead>
    <tr>
        <th>姓名</th>
        <th>年龄</th>
        <th>性别</th>
        <th>成绩</th>
    </tr>
</thead>
<!-- 这是表主体 -->
<tbody>
    <tr>
        <td>李小华</td>
        <td>18</td>
        <td>男</td>
        <td>合格</td>
    </tr>
    <tr>
        <td>杨晓东</td>
        <td>16</td>
        <td>男</td>
        <td>优秀</td>
    </tr>
</tbody>
<tfooter>
    <tr>
        <td>平均</td>
        <td></td>
        <td></td>
        <td>良好</td>

    </tr>
</tfooter>

</table>

<table border="1">
    <thead>
        <th>姓名</th>
        <th>公司</th>
        <th>职位</th>
        <th>住址</th>
        <th>电话</th>
    </thead>
    <tbody>
        <tr>
            <td>小名</td>
            <td rowspan="4">腾讯</td>
            <td rowspan="4">程序员</td>
            <td>和平街32号</td>
            <td>123432</td>
        </tr>
        <tr>
            <td>小红</td>
            <td>幸福路45号</td>
            <td>15345332</td>
        </tr>
        <tr>
            <td>小猪</td>
            <td>荷塘路75号</td>
            <td>153332</td>
        </tr>
        <tr>
            <td>小茹</td>
            <td>爱子街道44号</td>
            <td>1945435</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <td>总人数</td>
            <td colspan="3"></td>
            <td>4</td>
        </tr>
    </tfoot>
</table>
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220911083015.jpg)

###  from标签

`<from>` 标签用于用户输入创建 HTML 表单（表单能够包含 input 元素，比如文本字段，复选框，单选框，提交按钮等等）。表单还可以包含 `select option，textarea，checkbox，lable` 等等元素。数据关联标签可使用 `name` 属性，对关联数据做名称标记，便于后端接口获取对应的数据。表单用于向服务器 `传输数据`

{% note blue 'fas fa-fan' flat %} get请求和post请求区别 {% endnote %}

- get请求一般是去 `取获取数据`（其实也可以提交，但常见的是获取数据）；
  post请求一般是去 `提交数据`。
- get因为参数会放在 `url` 中，所以 `隐私性，安全性较差`，请求的数据长度是 `有限制` 的，
  不同的浏览器和服务器不同，一般限制在 2~8K 之间，更加常见的是 1k 以内；
  post请求是 `没有的长度限制`，请求数据是放在 `body` 中；
- get请求刷新服务器或者回退 `没有影响`，post请求回退时会 `重新提交数据请求`。
- get请求 `可以被缓存` ，post请求 `不会被缓存`。
- get请求会 `被保存在浏览器历史记录当中` ，post不会。get请求可以被收藏为书签，因为参数就是url中，但post不能。它的参数不在url中。
- get请求只能进行url编码（appliacation-x-www-form-urlencoded）,post请求支持多种（multipart/form-data等）。
- 对于 GET 方式的请求，浏览器会把 `http header` 和 `data` 一并发送出去，服务器响应 `200`
  （返回数据）表示成功；
  而对于 POST，浏览器先发送 `header`，服务器响应 `100`， 浏览器再继续发送 `data`，服
  务器响应 `200` （返回数据）。

```html
<!-- 
form(表单)：可用属性：action(提交地址)，method(提交方式 get是默认值，还有post)
input(输入)：可用属性：
    type属性：
        text(单行文本输入框，默认值)
        password(密码输入框)
        button(普通按钮)
        submit(提交按钮 默认值是提交)
        reset(重置按钮)
        checkbox(复选框)
        radio(单选框)
    value属性：(表单控件传给处理程序的值)
    name属性：name就是提交到后台的索引（表单必备的不能少）
        具有相同name属性radio为同一组
        只有设置了 name 属性的表单元素才能在提交表单时传递它们的值
button(按钮)：与input【button】区别是具有跳转，自带刷新功能
    type属性：
        button(普通按钮)
        submit(提交按钮，默认值)
        reset(重置按钮)
select， option(一起使用的，下拉选择)
    name属性：对数据标记，一般放在select标签
textarea(多行文本输入框)
    cols，rows规定textarea的尺寸，不过更好的办法是使用CSS的height 和 width 属性

1.from标签表示一个表单域/项
2.表单总控一般放最后比如提交，重置
3.name取名是见名知意
4.复选框跟单选框如果name值相同但是效果是不一样的还是有区别的
复选框如果相同name提交到后台系统可能只取最后那个前面的就被覆盖
可以通过加[]表示是一组数据来提交，但是又出现一个问题就是不知道选了是哪个
所以还需要value来进行区分
5.下拉选择的选项自带name但是一般还是加个value给它,不加的话后台取到的值就是选项名
6.value也可以作为默认值，比如单行输入框和密码输入框那
7.重置不一定等于清空！！！是回到最初状态
8. https://mdcm.yang5201314.cn/reg.php?username=admin&pwd=123&fruits%5B%5D=001&fruits%5B%5D=002&classification=01&%E7%AE%80%E4%BB%8B=
这是from表单的数据提交通过F12分析：带有？是get请求，相反的是post请求不带？跟表单数据 只有一个地址
表单数据在载荷那，一般大量数据时用post请求，简单来说：

-->

<form action="https://mdcm.yang5201314.cn/reg.php" method="post">
    <span>单行输入框：</span>
    <input type="text" name="username" value="admin">
    <br/>
    <span>密码输入框：</span>
    <input type="password" name="pwd" value="123">
    <br/>
    <span>按钮：</span>
    <input type="button" value="按钮">
    <br/>
    <span>提交按钮：</span>
    <input type="submit">
    <br/>
    <span>重置按钮：</span>
    <input type="reset">
    <br/>
    <span>复选框：</span>
    <input type="checkbox" name="fruits[]" value="001">苹果
    <input type="checkbox" name="fruits[]" value="002">香蕉
    <input type="checkbox" name="fruits[]" value="003">草莓
    <br/>
    <span>单选框：</span>
    <input type="radio" name="小红" value="001">男
    <input type="radio" name="小红" value="002">女
    <input type="radio" name="小红" value="003">保密
    <br/>
    <span>button标签：</span>
    <button type="submit">提交</button>
    <button type="reset">重置</button>
    <button type="button">普通按钮</button>
    <br/>
    <span>下拉选择：</span>
    <select name="classification">
        <option value="01">娱乐新闻</option>
        <option value="02">体育新闻</option>
        <option value="03">军事新闻</option>
        <option value="04">国外新闻</option>
    </select>
    <br/>
    <span>多行文本框：</span>
    <textarea cols="30" rows="5" name="简介"></textarea>

</form>
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220911103243.jpg)

```html
<!-- lable:表示用户界面中某个元素的说明,常与input嵌套 -->
<!-- 
1.可以点击关联的标签来聚焦或者激活这个输入元素，就像直接点击输入元素一样。
    这扩大了元素的可点击区域，让包括使用触屏设备在内的用户更容易激活这个元素 
2.将一个 <label> 和一个 <input> 元素匹配在一起，你需要给 <input> 一个 id 属性。
    而 <label> 需要一个 for 属性，其值和 <input> 的 id 一样。
-->
<input type="checkbox" id="fruit01"><label for="fruit01">猪八戒</label>
<input type="checkbox" id="fruit02"><label for="fruit02">沙和尚</label>
```

```css
/*
表示任何处于选中状态的radio(<input type="radio">), checkbox (<input type="checkbox">) 或 ("select") 元素中的option HTML 元素  
 */
[type='radio']:checked {
    /* 表示会将元素从 无障碍树 accessibility tree 中移除。
    这会导致该元素及其所有子代元素不再被屏幕阅读技术 访问 */
    display: none; 
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220913135441.jpg)



##  CSS层叠样式表的基本特征与引用方式

###  CSS层叠样式表的基本特征

CSS基本语法结构：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220912073225.jpg)

`;`是分割声明（最后一个声明一般不用写;）

在 HTML 里写样式用 `<style>` 标签包裹

- `hover` 选择器是当鼠标放上去时向元素添加特殊的样式

###  CSS引用方式

```html
<!-- 
1.行内样式
    <p style="color:red">样式使用</p>
2.内部样式（一般加在head里面，因为浏览器加载是从上到下执行的）
    <style type="text/css">
        /* 声明样式 */
        p{
            color:pink !important;
        }
    </style>
3.外联样式
<link rel="stylesheet" type="text/css" href="css/index.css">
    
不过一般现在推荐 “结构 表现分离” ：
网页设计中，HTML标签只用于搭建网页的基本结构，不使用标签属性设置显示样式，所有的样式交由CSS来设置。
-->
```

###  常见选择器(1)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220912224003.jpg)

判断是不是它的后代只需看是不是被它 `包裹` 即可

```html
<h1>通配符1</h1>
<p>通配符2</p>
<span>标签选择器</span>
<span id="num">id选择器</span>
<span class="texts">class类选择器</span>
```

```css
/* 通配符选择器 */
*{
    color: rgb(0, 162, 255);
    font-size: 80px;
}
/* 标签选择器 */
span{
    color: chartreuse;
    font-size: 30px;
}
/* id选择器 */
/* 具有相同id值的标签都会选中 */
/* id尽量不要同名，因为js也有选择器 */
/* 具有唯一性 */
# num{
    color: brown;
    font-family: 华文新魏;
}
/* class类选择器 */
.texts{ 
    color: crimson;
    font-size: 20px;
    font-family: 楷书;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220912140434.jpg)

```html
<span>2323</span>
<div class="zuxian">
    <span>祖先后代选择器</span>
    <div>
        <span>34444</span>
    </div>
</div>
```

```css
/* 层级~祖先后代选择器 */
.zuxian span{
    color: coral;
    font-size: 12px;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220912141418.jpg)

```html
<div class="zuxian">
    <span>测试1</span>
    <div>
        <span>测试2</span>
    </div>
    <span>测试3</span>
</div>
```

```css
/* 父子级选择器 */
.zuxian>span{
    color: coral; 
    font-size: 40px;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220912141855.jpg)

```html
<ul>
    <li class="char">a</li>
    <li>b</li>
    <li>c</li>
</ul>
```

```css
/* 相邻兄弟级选择器 */
.char+li{
    color: blueviolet;
    font-size: 50px;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220912210506.jpg)

```html
<ul>
    <li>22</li>
    <li class="char2">a</li>
    <li>b</li>
    <li>c</li>
</ul>
<li>11</li>
```

```css
/* 后续兄弟选择器 */
.char2~li{
    color:brown;
    font-size: 60px;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220912211240.jpg)

```html
<div class="num">
    <p>1233</p>
</div>
<div class="num-char">
    <p>2222</p>
</div>
<div class="kk-num">
    <p>333</p>
</div>
```

```css
/* 匹配class的值等于num的所有元素 */
[class='num'] {
    color: aqua;
    font-size: 40px;
}
/* 匹配class属性值以num开头的所有元素 */
[class^='num'] {
    color: rgb(174, 0, 255);
    font-size: 40px;
}
/* 匹配class属性值以num结尾的所有元素 */
[class$='num'] {
    color: rgb(255, 0, 0);
    font-size: 40px;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220912221210.jpg)

```html
<div class="num">
    <p>1233</p>
</div>
<div class="num-char">
    <p>2222</p>
</div>
<div class="kk-num">
    <p>333</p>
</div>
<div class="numm">
    <p>333</p>
</div>
```

```css
/* 匹配class属性值包含num的所有元素 */
[class*='num'] {
    color: rgb(255, 0, 128);
    font-size: 40px;
}
/* 匹配class属性值等于num/以num-开头的所有元素 */
[class|='num'] {
    color: rgb(0, 255, 76);
    font-size: 40px;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220912222225.jpg)

```html
<div class="num">
    <p>1233</p>
</div>
<div class="num char">
    <p>2222</p>
</div>
<div class="kk-num">
    <p>333</p>
</div>
<div class="numm">
    <p>333</p>
```

```css
/* 匹配class属性值里有num的值且有空格分隔(空格可以在单词前面或者后面)的所有元素 */
[class~='num'] {
    color: rgb(255, 72, 0);
    font-size: 40px;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220912222609.jpg)

###  常见选择器(2)

判断方法：

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220912231500.jpg)

```html
<ul>
    <li>西瓜</li>
    <li>香蕉</li>
    <li>梨子</li>
</ul>
<div class="box">
    <span>123</span>
    <p>456</p>
    <span>789</span>
</div>
```

```css
/* 结构化伪类选择器 */
/*  .是类   :是伪类 */

/* 选择父元素里边的第1个子元素 */
/* ul是body的第一个子元素 */
/* li是ul的第一个子元素 */
/* 系统是从父元素下的所有子元素拿出来排序看是不是第一个，而不是挑一样的出来排序！ */
ul:first-child{
    color:bisque;
}
/* 加>跟不加一样的在这 */
ul>li:first-child{
    color: aqua;
    font-size: 50px;
}
.box>span :first-child{
    color: red;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220912231624.jpg)

```html
<ul>
    <li>西瓜</li>
    <li>香蕉</li>
    <li>梨子</li>
</ul>
<div class="box">
    <span>123</span>
    <p>456</p>
    <span>789</span>
    <p>666</p>
    <a href="">111</a>
</div>
```

```css
/* 结构化伪类选择器 */
/*  .是类   :是伪类 */

/* 选择父元素里边的最后1个子元素 */
ul>li:last-child {
    color: blueviolet;
}

/* 找到 .box所有子元素p中的第一个p */
.box>p:first-of-type {
    color:red;
}

/* 找到 .box所有子元素p中的最后一个p */
.box>p:last-of-type {
    color: blue;
}

/* 找到 .box所有子元素中唯一的一个p(即不能有另一个p) */
.box>a:only-of-type {
    color: chartreuse;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220912234541.jpg)

```html
<ul>
    <li>西瓜</li>
    <li>香蕉</li>
    <li>梨子</li>
</ul>
<div class="box">
    <span>123</span>
    <p>456</p>
    <p>666</p>
    <span>789</span>
    <a href="">111</a>
    <a href="">大大</a>
</div>
```

```css
/* 选择父元素里边第n个子元素 */
ul>li:nth-child(1) {
    color: blue;
}
ul>li:nth-child(2) {
    color: red;
}
/* 组合 */
ul>li:nth-child(2) ~ li {
    color: rgb(255, 0, 149);
}

/* 给box下的奇数且是span加背景颜色 */
.box>span:nth-child(odd) {
    background-color: chartreuse;
}

/* 给box下的偶数且是span加背景颜色 */
.box>span:nth-child(even) {
    background-color: rgb(202, 11, 59);
}

/* 取反操作 */
/* 除了所有a中第一个a之外都变黄色 */
.box>:not(a:first-of-type) {
    color:darkorange;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220913001324.jpg)

###  常见选择器(3)

```css
/* 伪元素选择器 */
/* 使用::开头 */

/* 第一个字母/字符/文字(并且文字所处的行之前没有其他内容（如图片和内联的表格) */
/* 适用于块级元素，不适用于行内元素如span */
p::first-letter{
    color: red;
}
/*第一行*/
p::first-line{
    color: red;
}
```

```html
<div class="box">
    <a>3423</a>
    <p>456</p>
    <p>666</p>
</div>
```

```css
/*  创建一个伪元素，其将成为匹配选中的元素的第一个子元素。
常通过 content 属性来为一个元素添加修饰性的内容。此元素默认为行内元素 
content属性一定要有，用不到可以写' '
*/
.box>p::before{
    content: '大';
    background-color: red;
}
/* 跟before一样，但是这个放最后 */
.box>a::after{
    content: '小';
    background-color:blue;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220913123002.jpg)

```html
    <!-- readonly：只读状态 -->
<input type="text" value="enabled选择器" readonly>
<!-- disabled：禁止状态 -->
<input type="text" value="不可输入" disabled>
<input type="radio">西瓜
<input type="radio">椰子
<br/>
<!-- lable:表示用户界面中某个元素的说明,常与input嵌套 -->
<!-- 
1.可以点击关联的标签来聚焦或者激活这个输入元素，就像直接点击输入元素一样。
    这扩大了元素的可点击区域，让包括使用触屏设备在内的用户更容易激活这个元素 
2.将一个 <label> 和一个 <input> 元素匹配在一起，你需要给 <input> 一个 id 属性。
    而 <label> 需要一个 for 属性，其值和 <input> 的 id 一样。
-->
<input type="checkbox" id="fruit01"><label for="fruit01">猪八戒</label>
<input type="checkbox" id="fruit02"><label for="fruit02">沙和尚</label>
```

```css
/* UI状态伪类选择器 */
/* 
1.所谓UI选择器：就是只有当元素处于某种状态下时，才起作用，在默认状态下不起作用！

*/

/* :enabled 表示任何被启用的（enabled）元素。如果一个元素能够被激活（如选择、点击或接受文本输入），或者能够获取焦点，则该元素是启用的。
元素也有一个禁用的状态（disabled state），在被禁用时，元素不能被激活或获取焦点。 
*/
input:enabled {
    color:rgb(218, 14, 99);
}

/* 只读 */
input:read-only {
    color:rgba(14, 119, 218, 0.486);
}

/*
表示任何处于选中状态的radio(<input type="radio">), checkbox (<input type="checkbox">) 或 ("select") 元素中的option HTML 元素  
 */
[type='radio']:checked {
    /* 表示会将元素从 无障碍树 accessibility tree 中移除。
    这会导致该元素及其所有子代元素不再被屏幕阅读技术 访问 */
    display: none; 
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220913141717.jpg)

```html
<a href="https://www.baidu.com">百度</a>
<a href="https://y.qq.com">QQ音乐</a>
<a href="https://weibo.com">新浪微博</a>
```

```css
/*
用来选中元素当中的链接。
它将会选中所有尚未访问的链接，包括那些已经给定了其他伪类选择器的链接（例如:hover选择器，:active选择器，:visited选择器） 
 */
/* 用于设置文本的修饰线外观的（下划线、上划线、贯穿线/删除线 或 闪烁） */
a:link {
    color: rgb(18, 209, 104);
    background-color: rgba(6, 200, 226, 0.849);
    font-size: 40px;
    text-decoration: none;
}
/* 表示用户已访问过的链接。出于隐私原因，可以使用此选择器修改的样式非常有限。 */
a:visited {
    color:white;
}
/*
1. 用于用户使用指示设备虚指一个元素（没有激活它）的情况 
2. :hover 规则需要放在 :link 和 :visited 规则之后，但是在:active 规则之前，按照 LVHA 的顺序声明 :link－:visited－:hover－:active。
*/
/* 鼠标放上去时的效果是红色 */
a:hover {
    color: red;
    text-decoration: underline;
}
/* 匹配被用户激活的元素。它让页面能在浏览器监测到激活时给出反馈。当用鼠标交互时，它代表的是用户按下按键和松开按键之间的时间。 */
/* 长按时颜色是这个颜色 */
a:active {
    color: rgba(60, 26, 180, 0.644);
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220913192906.jpg)

##  CSS文本与布局样式，浮动与定位

###  CSS文本样式

```html
<h1>可可能会被后声被后声明的</h1>
<ul>
    <li style="list-style: none">html</li>
    <li>css</li>
    <li>js</li>
</ul>
<h2>析构亚沙成ss</h2>
<p>在上面的实例中，类名为con的div样式为：宽度100像素，高度100像素，浅红色的背景颜色，字体大小44像素，行高为100像素，且在父级元素中水平居中对齐。
那么，此时，是否对优先级有所了解了呢？</p>
```

```css
/* 
颜色 
color:red / # ff0000 / rgb(255,0,0) /rgba(255,0,0,.7)
    英文/十六进制/rgb/rgba(多了一个透明度)
*/
/*
大小
font-size:12px / 1em /1rem
    1. px是固定的像素，一旦设置了就无法因为适应页面大小而改变
    2. em和rem相对于px更具有灵活性，他们是相对长度单位，意思是长度不是定死了的，更适用于响应式布局。
    3. em是相对于其父元素来设置字体大小的，一般都是以<body>的“font-size”为基准
    4. em相对于父元素，rem相对于根元素
    5. 任何浏览器默认字体大小都是16px，所有未经调整的浏览器都符合1em=16px
    6. 元素的width/height/padding/margin用em的话是相对于该元素的font-size
    7. rem是全部的长度都相对于根元素(<html>元素)
    8. 通常做法是给html元素设置一个字体大小，然后其他元素的长度单位就为rem。
    9. 不要在多列布局中使用 em 或 rem 改用 %
    10. 不要使用 em 或 rem，如果缩放会不可避免地导致要打破布局元素
*/
/*
字重
font-weight:light / normal / bold / 600 /700
    1. normal一般用于重置恢复正常
 */
/*
风格
font-style:italic(倾斜) / normal(正常)
 */
/*
字体
font-family:'Microsoft Yahei','宋体'
 */
/*
下划线
text-decoration:none / underline / overline / line-through
重置 / 下划线 / 上划线 / 删除线
    比如a标签链接自带有下划线可以使用none重置掉
 */
/*
行高
line-height:16px / 32px 
行与行的高度，是文字的头部到下一行的文字头部的距离
 */
h1 {
    color: 	# d11414;
    font-size: 70px;
    font-weight: bold;
    font-style: italic;
    font-family: 华文新魏;
    text-decoration: overline;
    line-height: 50px;
}
/*
ul \ ol 样式
list-style:none / circle ...
 */
li {
    list-style: circle;
}
/*
可以设置列表元素的 marker（比如圆点、符号、或者自定义计数器样式） 
 */
ul {
    list-style-type: disc;
}
/*
文本水平对齐方式
text-align:left / center / right 
 */
h2 {
    text-align: center;
}
/*
缩进
text-indent:px / em / rem 
 */
p {
    text-indent: 2em;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220914184741.jpg)



###  CSS布局常用样式

```html
    <span>123</span><span>abc</span>
    <div class="box">你好呀</div>
    <div class="box">早上好</div>
    <br />
    <a href="">百度</a>
    <a href="">QQ音乐</a>
    <p>菜鸟教程</p>
    <p>人才</p>
    <div class="boxer">
        <div class="item1"></div>
        <div class="item2"></div>
        <div class="item3"></div>
    </div>
    <div class="box2"></div>
    <div class="box3"></div>
    <div class="box3"></div>
```

```css
/*
display(元素显示状态)
    none | inline(行内) | inline-block(行内块) | block(块级元素) | flex(弹性盒子)
        1. 块元素与行元素是可以转换的，也就是说display的属性值可以由我们来改变。

 */
/* 变成块元素 */
span {
    display: block;
}
/* 变成行内元素 */
.box {
    display: inline;
}
/* 
1. 即在同一行显示，又可以设置宽高，margin和padding可以设置
2. 在一行排列的时候盒子与盒子之间会出现空白空隙
        解决方法：把下面的div挨着写，不留空格，空白就会消失
 */
a {
    display: inline-block;
    margin: 10px;
    height: 40px;
}
/*
none：将该元素隐藏，不会再文档流中出现，所谓的文档流也就是文档中可显示对象在排列时所占用的位置 
隐藏相当于完全消失不见了，而visibility:hidden相当于隐身，虽然看不见了，但是还占据一定的位置
 */
p {
    display: none;
}
/*
flex：
    1.它决定一个盒子在其它盒子中的分布，以及如何处理可用的空间。使用该模型，可以轻松的创建"自适应"浏览器窗口的流动布局 
    2. 将对象作为弹性伸缩盒显示，对其他兄弟元素来说，它依然是一个普通的块级标签，对里面的子元素（弹性项目）来说，这个盒子是它们的弹性容器
 */
/*
width(宽):100px | 1em | 1rem
height(高):100px | 1em | 1rem 
backbound-color:red | # ff0000 | rgb(255,0,0) | rgba(255,0,0,0.5)
 */
.boxer {
    width: 100px;
    height: 400px;
    background-color: red;
    display: flex;
}
.boxer>div {
    width:30%;
    height: 400px;
}
.item1 {
    background-color: aqua;
}
.item2 {
    background-color: blue;
}
.item3 {
    background-color: chartreuse;
}
/*
边框：
border:1px(框的粗细) solid(实线) | dashed(虚线) 颜色; 
 */

.box2 {
    width:300px;
    height: 300px;
    border: 4mm ridge red;
}
/*
外边框：margin：margin 属性为给定元素设置所有四个（上下左右）方向的外边距属性
                                垂直方向 外边距margin塌陷（上下两个元素间），取值取两者较大的相等则取一样的
                                当设置两个数值时第一个表示上下第二个表示左右
                                当设置三个数值时第一个表示上第二个表示左右第三个表示下
                                当设置四个数值时第一个表示上第二个表示右第三个表示下第四个表示左（顺时针方向）
                                还有单独设置的如：margin-top,margin-left等等
内边框：padding ：控制元素所有四条边的内边距区域
                            一个元素的内边距区域指的是其内容与其边框之间的空间
                            跟margin一样可以有取一个值或者2个3个4个
 */         
.box3 {
    width: 200px;
    height: 200px;
    border: 1px solid blue;
    margin: 20px;
    padding: 20px;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220917174248.png)

### position定位的使用

```html
<div class="box"></div>
<div class="box" id="element"></div>
<div class="box"></div>
```

```css
/*
position：static(静态定位) | relative(相对定位) | absolute(绝对定位) | fixed(固定定位) | 粘性定位
    1.relative元素先放置在未添加定位时的位置(原本自身的位置)，再在不改变页面布局的前提下调整元素位置
    （因此会在此元素未添加定位时所在位置留下空白）
    2.static生效时， top, right, bottom, left 和 z-index 属性无效。
    3. z-index数值越大越显示在上面，数值低的会被盖住
 */

.box {
    width: 60px;
    height: 60px;
    background-color: red;
    border: 3px solid blue;
    display: inline-block;
}

# element {
    background-color: yellow;
    border: 3px solid green;
    position: relative;
    bottom: -20px;
    left: 40px;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220917211739.png)

```html
<div class="box"></div>
<div class="box" id="element"></div>
<div class="box"></div>
<div style="height: 2000px; width:200px "></div>
```

```css
/*
position：static(静态定位) | relative(相对定位) | absolute(绝对定位) | fixed(固定定位) | 粘性定位
    1.relative元素先放置在未添加定位时的位置(原本自身的位置)，再在不改变页面布局的前提下调整元素位置
    （因此会在此元素未添加定位时所在位置留下空白）
    2.static生效时， top, right, bottom, left 和 z-index 属性无效。
    3. z-index数值越大越显示在上面，数值低的会被盖住
    4. z-index只能工作在被明确定义了absolute，fixed或relative 这三个定位属性的元素中
 */

.box {
    width: 60px;
    height: 60px;
    background-color: red;
    border: 3px solid blue;
    display: inline-block;
}

# element {
    background-color: yellow;
    border: 3px solid green;
    position: fixed;
    bottom: 1000px;
    left: 40px;
}

/*
absolute元素会被移出正常文档流，并不为元素预留空间，
通过指定元素相对于最近的非 static 定位祖先元素的偏移，来确定元素位置 
 */
/*
fixed元素会被移出正常文档流，并不为元素预留空间，而是通过指定元素相对于屏幕视口（viewport）的位置来指定元素位置。
元素的位置在屏幕滚动时不会改变 
比如网页的“返回顶部”组件就是
  */

/*
sticky元素相当于固定一个位置不管滑动相当于文章目录 
 */

/*
坐标：
top上边移动的距离
right
bottom
left
层叠：z-index 
 */
```



### float浮动的用法

```html
<div class="artice">
<div class="box"></div>再举一个生活的例子吧，假设你还在上高中，这时候你的班长站在班级讲台上，宣布下午放假半天。
（是不是会很开心？）可是，这时候你的班主任老师说了一句：放什么放，不放假，继续学习~~~那么，
你们班又有几个人敢“私自放假”呢？优先级就如同这个——谁说话最“算数”。换到我们的CSS样式上，
不同的选择器优先级不同
</div>
<p>123</p>
<div class="overflow"> 属性指定一个元素应沿其容器的左侧或右侧放置，允许文本和内联元素环绕它。该元素从网页的正常流动（文档流）中移除</div>
```

```css
/*
浮动
float:left(左浮动) | right(右浮动)
清除浮动的影响：overflow:hidden; clear:left | right | both
height:设置父级盒子的固定高度 
overflow: hidden;把超出的消除(开了浮动如果需要把高度找回来)，auto:自动有滚动条
开了浮动需要把高度找回来
 */

/*
由于body默认有属性的可以重置一下 
 */
body {
    margin: 0;
}

.box {
    width: 400px;
    height: 300px;
    background-color: red;
    float: left;
    margin-right: 10px; /*右边的外边距*/
}

.artice {
    background-color:# eee;
}

.overflow {
    width: 60px;
    height: 120px;
    background-color:# eee;
    overflow: scroll;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220918085947.jpg)

##  CSS优先级

优先级关系：

`!important声明` > `行内样式` > `ID选择器` > `类选择器=属性选择器=伪类选择器` > `元素标签选择器=关系选择器=伪元素选择器` > `通配符选择器`

```html
<div class="box-1"></div>
<div class="box-1 artice"></div>
```

```css
/* 优先级可以叠加，相当于送货地址越精准肯定送到的越快 */

.box-1 {
    width: 100px;
    height: 200px;
    background-color: red;
}

.artice {
    background-color: blue;
}
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220918092821.png)

##  案例-搜索input结构仿制

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>搜索输入框</title>
    <link rel="stylesheet" href="path/to/font-awesome/css/font-awesome.min.css">
    <style>
        /* 清除浏览器自带属性影响 */
        * {
            margin: 0;
            padding: 0;
        }
        .search {
            padding-left: 15px; /*设置一个元素的左填充（空格）*/
            margin-top: 10px;   /*设置元素的上部边距(允许为负)*/
        }
        /*模块化精准到一个区域内的哪个元素这样减少冲突  */
        .search .input {
            display: inline-block;
            position: relative;
            width: 310px;
            height: 34px;
            padding: 8 18px;
            background-color: # f7f7f7;
            border-radius: 17px;    /*圆角化*/
            box-sizing: border-box;/*允许你以某种方式定义某些元素，以适应指定区域*/
        }
        /* 图标 */
        .search .input .icon-search {
            width: 18px;
            height: 18px;
            margin-top: 5px;
            margin-left: 10px;
            display: inline-block;
            background-color: rgb(206, 57, 57);
        }
        .search .input input {
            position: absolute;
            right: 18px;
            background: transparent;
            height: 18px;
            width: 245px;
            border: 0;
            padding-top: 6px;
            outline: 0;/*消除输入时的橙色框*/
        }
        .search .btn {
            display: inline-block;
            width: 50px;
            height: 34px;
            text-align: center;
            line-height: 34px;
            font-size: 15px;
            color: green;
        }

    </style>
</head>
<body>
    <!-- 开发时命名一般是一个区域，比如搜索区，商品区等等 -->
    <!-- placeholder 是HTML5 中新增的一个属性。placeholder可以用来描述输入字段预期值的简短的提示信息。
        提示信息会在用户输入值之前显示，一旦用户输入信息该提示就会自动消失 -->
    <div class="search">
        <div class="input">
            <i class="icon-search"></i>
                <input type="text" placeholder="点击搜索商品">
        </div>
        <!-- 需要把input和btn变成行内块再把字体宽度改小点才能在一行 -->
        <div class="btn">搜索</div>
    </div>   
</body>
</html>
```

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20220918113245.jpg)

##  css一些属性用法
`pointer-events: none;` 属性是让鼠标点击效果没了，可在图片链接上使用--见关于我页尾
div怎么不随浏览器放大或缩小改变大小和位置？
(1)首先为了让div大小不变，我们给div定义上 `Width` 和 `Height` 两个属性，固定宽和高那么div就不会变形
(2)为了不让DIV随着位移，我们通过在body里定 `position:relative;` 再在div上定义 `position:absolute;` 这两个定义第一个是相对定位，后面在div上是绝对定位，这样div就不会随浏览器变化而变化了。

##  案例-金刚区结构仿制

暂时停止更新----2022.9.18