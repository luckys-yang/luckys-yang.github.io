---
title: Butterfly魔改备忘录
cover: /img/num1.webp
categories:
  - 本站点滴
comments: false
abbrlink: 63e9ebce
date: 2023-01-21 21:40:19
---

## 星空背景

参考文章：https://tzy1997.com/articles/hexo1606/#%E6%98%9F%E7%A9%BA%E8%83%8C%E6%99%AF%E5%92%8C%E6%B5%81%E6%98%9F%E7%89%B9%E6%95%88

## 添加复制弹窗

引进css,js，然后添加 `<script>...</script>` 内容【都在主题配置文件里操作】，随便把它的镜像源改成下面这样速度快点

## 替换js镜像源

参考文章：

[安知鱼：目前可用cdn整理](https://anzhiy.cn/posts/fe76.html)



在 `scripts` --> `cdn.js` 里把 cdn.jsdelivr.net 替换成 jsd.onmicrosoft.cn 也可以在主题配置文件里添加(那里优先级最高会覆盖cdn.js里的)
可用的镜像源有：
    
```bash
npm.sourcegcdn.com

npm.elemecdn.com

npm.onmicrosoft.cn

jsew.cky.codes

jsd.onmicrosoft.cn
```

## gulp压缩

参考文章：https://blog.imzjw.cn/posts/b74f504f/#gulp-%E5%8E%8B%E7%BC%A9

需要注意完成文章操作后需要再执行 `npm install gulp` 命令才能使用 `gulp` 命令

使用格式：hexo cl && hexo g && gulp && hexo d





## 页脚区修改

<span style="color:red;">改动①</span>

参考文章：https://blog.imzjw.cn/posts/b74f504f/#%E9%A1%B5%E8%84%9A%E5%BE%BD%E6%A0%87

添加一些图标，可在https://shields.io/category/issue-tracking 生成
【更改了标签 `<p></p>` 为 `<div></div>` 把行间距搞违和点，把svg改成我cos存储的】

<span style="color:red;">改动②</span>

页脚透明化 在 `my.css` 添加即可

<span style="color:red;">改动③</span>

添加爱心跳动图标【踩坑---display:unset;会导致不会跳，所以加了另一个display去覆盖】

在主题文件下 `layout/includes/footer.pug` 里进行替换：

```pug
&copy;${theme.footer.owner.since} - ${nowYear} By ${config.author}
替换成
&copy;${theme.footer.owner.since} - ${nowYear + ' '} <i id="heartbeat" class="fa fas fa-heartbeat"></i> ${config.author}

&copy;${nowYear} By ${config.author} 
替换成
&copy;${nowYear + ' '} <i id="heartbeat" class="fa fas fa-heartbeat"></i> ${config.author}
```

然后把css写在 `my.css`

<span style="color:red;">改动④</span>

添加网站运行时间，在主题文件下 `layout\includes\footer.pug` 下最后一行添加(注意#缩进跟上面if一样，修改 `new Date` 为你的建站时间)：

```diff
  if theme.footer.custom_text
    .footer_custom_text!=`${theme.footer.custom_text}`
+  #running-time(style='color: #5c5c5c;')
+    script.
+      setInterval(()=>{let create_time=Math.round(new Date('3/10/2022 08:00:00').getTime()/1000);let timestamp=Math.round((new Date().getTime()+8*60*60*1000)/1000);let second=timestamp-create_time;let time=new Array(0,0,0,0,0);if(second>=365*24*3600){time[0]=parseInt(second/(365*24*3600));second%=365*24*3600;}if(second>=24*3600){time[1]=parseInt(second/(24*3600));second%=24*3600;}if(second>=3600){time[2]=parseInt(second/3600);second%=3600;}if(second>=60){time[3]=parseInt(second/60);second%=60;}if(second>0){time[4]=second;}currentTimeHtml='本站已苟活了 '+time[0]+' 年 '+time[1]+' 天 '+time[2]+' 时 '+time[3]+' 分 '+time[4]+' 秒';document.getElementById("running-time").innerHTML=currentTimeHtml;},1000);
```

{% note red 'fas fa-fan' flat %}注意{% endnote %}

这里时间格式跟右侧倒计时一样需要改不然手机端不显示




## 修改了源码的all.min.css

把 all.min.css部署在腾讯云对象存储里，需要在主题文件 `plugins.yml` 里找到下面代码屏蔽：

```yml
# fontawesomeV6:
#   name: '@fortawesome/fontawesome-free'
#   file: css/all.min.css
#   other_name: font-awesome
#   version: 6.2.1
```
按F12把需要的 `.woff2` 后缀文件下载(.ttf不需要只需要woff2即可)上传到对象存储 `all.min.css` 同级目录下，然后把css里面 `.woff2` 的相对路径改成 `./xxx.woff2` 即可，然后把css链接复制在主题配置文件里引入，还需要注意跨域问题，添加规则，可参考：

https://cloud.tencent.com/document/product/436/11488

https://cloud.tencent.com/document/product/436/56652



## 添加留言页面+留言板信封

1. 使用命令 `hexo new page comments` 创建一个留言页面

2. 输入安装插件命令 `npm install hexo-butterfly-envelope --save`

3. 在主题配置文件里添加 `envelope_comment` 配置

参考文章：

https://akilar.top/posts/e2d3c450/

https://blog.imzjw.cn/posts/b74f504f/#%E7%95%99%E8%A8%80%E6%9D%BF%E4%BF%A1%E5%B0%81

## 修改侧栏公告

在 `card_announcement.pug` 文件里第4行 `i.fas.fa-bullhorn.fa-shake` 替换成 `i.fas.fa-bullhorn`

## 修改了网站的图标颜色样式
具体在 `my.css`

## 全局字体引入外部

方式1：引入 `鸿蒙字体`，具体在主题配置那引入，字体名：`HarmonyOS_Regular`

方式2：在 `my.css`里添加：

```css
/* 外部字体引入【暂没用到】 */
@font-face {
    font-family: 'tzy';
    /* 字体名自定义即可 */
    /* src: url('https://cdn.jsdelivr.net/gh/tzy13755126023/BLOG_SOURCE/font/ZhuZiAWan.woff2'); */
    src: url('https://npm.elemecdn.com/ethan4116-blog/lib/font/ZhuZiAWan.ttf');
    /* 字体文件路径 */
    font-display: swap;
}

body,
.gitcalendar {
    font-family: tzy !important;
}
```

## 添加双栏插件

输入插件安装命令 `npm i hexo-butterfly-article-double-row --save`，然后在根配置文件添加 `butterfly_article_double_row` 相关配置即可【添加了css在 `my.css` 优化了文章奇数时分页功能跑公比去】

注意在插件包里的js镜像源不行需要自行找到插件路径替换：
`https://cdn.jsdelivr.net/gh/Zfour/Butterfly-double-row-display@1.00/cardlistpost.min.css` 替换成
`https://jsd.onmicrosoft.cn/gh/Zfour/Butterfly-double-row-display@1.00/cardlistpost.min.css`

## 添加评论

1. 首先 `建一个公开的仓库`

2. 在 `settings` --## `general` --## `Features` --## 勾选`Discussions `，按步骤写信息即可，创建完后分类默认是 `Announcements`(公告)

3. 前往 https://github.com/apps/giscus 安装giscus APP ，选择你那个评论的仓库即可

4. 前往 https://giscus.app/zh-CN 按步骤写仓库名啥的，然后它会生成配置直接按名字复制到主题配置文件下的 `giscus`配置项里配置即可，还要在 `comments`配置项选择 `giscus`

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/butterfly/blog_other/QQ%E6%88%AA%E5%9B%BE20230119112814.jpg)

还需要在 `.md` 文件里加入关键字来关闭一些页面的评论 `comments: false` 这样显得好看点

## 修改文章目录样式

1. 在 `my.css` 添加样式即可(蒙版效果)

## 修改侧栏小卡片
<span style="color:red;">改动①</span>

在 `my.css` 添加样式即可

<span style="color:red;">改动②</span>

修改文字，在 `zh-CN` 里找到对应文字修改即可


## JS和CSS加载问题

参考文章：https://akilar.top/posts/615d5ede/

JS加载会阻塞HTML页面的加载，所以有必要进行异步加载，减少阻塞，JS的引入有两个属性值 `defer` 和 `async` ：

`defer` 是除了告诉浏览器不要阻塞页面之外，还可以确保脚本执行的相对顺序(加在那些确保页面完整性的必要js上)

`async` 是其他脚本不会等待async脚本加载完成，同样,async脚本也不会等待其他脚本(一般加在那些非必要的，起装饰或者优化效果的js上)

CND配置项的引入先于 `inject`，故也需要加属性值，在主题文件夹下---`layout` --- `includes` --- `additional-js.pug` 中修改，添加了属性值(具体可去查看)

- 页面载入并渲染的流程可以简单理解为以下情况：

`加载HTML资源->解析HTML->加载CSS资源，同时构建DOM树->解析CSS，同时渲染DOM树`



css的异步加载有两种方式，其中一种是加这句 `media="defer" onload="this.media='all'"`，【这里通过定义一个无效media，使得该CSS引入优先级最低，再用onload="this.media='all'"在页面加载完成后纠正media，并加载CSS】<span style="color:red;">目前在用第一种方法</span>

事实上，相比于给CSS添加异步加载，不如将我们的魔改样式整合到index.css文件内，减少对服务器的请求次数。这样更能节省加载时间【下面操作仅针对于Butterfly主题】  步骤如下【做完图标没了...故没搞】：

主题下的 `source\css\` 路径下新建 `_custom` 文件夹，然后把魔改样式的CSS文件拖动进去，然后在 `index.styl` 引入

## Mathjs

1. 首先禁用MathJax（如果你配置过 MathJax 的话），然后开启 `katex` 配置项

2. 如果想要支持数学公式，需要 `卸载你之前的 hexo 的 markdown 渲染器`，安装下面这个：

```bash
npm un hexo-renderer-marked --save # 如果有安装这个的话，卸载
npm un hexo-renderer-kramed --save # 如果有安装这个的话，卸载

npm i hexo-renderer-markdown-it --save # 需要安装这个渲染插件
npm install katex @renbaoshuo/markdown-it-katex # 需要安装这个katex插件
```
3. 在根目录配置文件加入：

```yml
markdown:
    plugins:
      - '@renbaoshuo/markdown-it-katex'
```
4. 使用时只需在需要数学公式的文章开头处加入 `katex: true` 即可

## 文章加密插件
<span style="color:red;">开启文章加密会有bug目录蒙版显示有问题！</span>
1. 安装 `npm install --save hexo-blog-encrypt`
2. 语法：

```bash
password: mikemessi
abstract: 有东西被加密了, 请输入密码查看.
message: 您好, 这里需要密码.
theme: xray
wrong_pass_message: 抱歉, 这个密码看着不太对, 请再试试.
wrong_hash_message: 抱歉, 这个文章不能被校验, 不过您还是能看看解密后的内容.
```
主题有多种：  `default、blink、shrink、flip、up、surge、wave、xray`

## 自定义右键
参考文章：

https://www.fomal.cc/posts/d739261b.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89

https://yisous.xyz/posts/11eb4aac/

1. 在主题文件下新建 `\themes\butterfly\layout\includes\rightmenu.pug`
2. 然后在 `/themes/butterfly/layout/includes/layout.pug` 中引入(注意缩进要跟上面一行一样)：

```pug
!=partial('includes/rightmenu',{}, {cache:true})
```
3. 主题文件下新建 `/themes/butterfly/source/css/rightmenu.css` ，然后在主题配置文件里引入 `<link rel="stylesheet" href="/css/rightmenu.css">`
4. 在主题文件下新建 `/themes/butterfly/source/js/rightmenu.js` ，【进去屏蔽那个回到顶部，没用到然后把全屏那个加进去】然后需要在主题配置文件引入：

```yml
  - <script type="text/javascript" src="https://cdn1.tianli0.top/npm/jquery@latest/dist/jquery.min.js"></script>
  - <script type="text/javascript" src="/js/rightmenu.js"></script>
```

<span style="color:red;">备注</span>：

- 上面的镜像 `cdn1.tianli0.top` 需要换成 `jsd.onmicrosoft.cn` 或者其他可以用的镜像源

- 去除一些不常用的选项，通过修改 `includes\rightmenu.pug` 文件即可，把不需要的直接删，然后改一下背景颜色在css那

## 侧栏IP信息显示

参考文章：https://ichika.cc/Article/beautiful_IPLocation/

1. 主题文件下创建了 `/themes/butterfly/source/js/IPdw.js`，把需要的js代码丢进去即可，然后改一下key，调用是 `#welcome-info`，需要定位到区/县 则在
2. 打开腾讯定位服务网站 https://lbs.qq.com/service/webService/webServiceGuide/webServiceIp  申请应用【产品选择WebServiceAPI，域名白名单填自己的域名或不填，如果到时候不能正常获取则原因可能是白名单设置有问题】 
可以访问下面链接看看能不能正常返回数据(key=你自己的key)：
https://apis.map.qq.com/ws/location/v1/ip?ip=111.206.145.41&key=7L3BZ-SDZLV-RZ3PR-UQMW2-EBJN7-45FBA
3. 在主题文件 `/theme/butterfly/latout/includes/widget/card_announcement.pug` 下修改成这样(添加一行注释下面几行)：

```pug
if theme.aside.card_announcement.enable
  .card-widget.card-announcement
    #welcome-info
    .item-headline
    //-   i.fas.fa-bullhorn
    //-   span= _p('aside.card_announcement')
    //- .announcement_content!= theme.aside.card_announcement.content
```

 `2023.3.6修改`：
 修改了距离的计算，使用 Vincenty 公式来计算，主要修改了

原
 ```js
/*根据经纬度计算两点距离(点1经度,点1纬度,点2经度,点2纬度)*/
function getDistance(e1, n1, e2, n2) {
    const R = 6371
    const { sin, cos, asin, PI, hypot } = Math

    let getPoint = (e, n) => {
        e *= PI / 180
        n *= PI / 180
        return { x: cos(n) * cos(e), y: cos(n) * sin(e), z: sin(n) }
    }

    let a = getPoint(e1, n1)
    let b = getPoint(e2, n2)
    let c = hypot(a.x - b.x, a.y - b.y, a.z - b.z)
    let r = asin(c / 2) * 2 * R
    return Math.round(r);
}
/*根据自己的需求定制*/
function showWelcome() {
    if (!document.getElementById("welcome-info")) return
    //在江门则写：(113.39637，22.43749) 在中山则写：(113.39639,22.43747) 左边东京右边北纬
    let dist = getDistance(113.387621,  22.431503, ipLoacation.result.location.lng, ipLoacation.result.location.lat); /*这里记录你自己的经纬度【去这个网站查询当前位置然后复制过来 http://jingweidu.757dy.com/】【或者使用手机指南针获取经纬度然后去网站 https://www.tiantianditu.com/tool/convert.html 转换也行】*/ 
 ```

改后
```js
//Vincenty 公式来计算距离
/*根据经纬度计算两点距离(点1经度,点1纬度,点2经度,点2纬度)*/
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // 地球半径，单位千米
    const { sin, cos, atan2, sqrt, pow } = Math;
    // 将角度转为弧度
    const rad = (deg) => deg * Math.PI / 180;
    // 计算两点间的距离
    const dLat = rad(lat2 - lat1);
    const dLon = rad(lon2 - lon1);
    const a = pow(sin(dLat / 2), 2) + cos(rad(lat1)) * cos(rad(lat2)) * pow(sin(dLon / 2), 2);
    const c = 2 * atan2(sqrt(a), sqrt(1 - a));
    const r = R * c;
    return Math.round(r);
}
function showWelcome() {
    if (!document.getElementById("welcome-info")) return;
    /*这里记录你自己的经纬度【去这个网站查询当前位置然后复制过来 http://jingweidu.757dy.com/】【或者使用手机指南针获取经纬度然后去网站 https://www.tiantianditu.com/tool/convert.html 转换也行】*/ 
    let dist = getDistance(113.387621, 22.431503,  ipLoacation.result.location.lng, ipLoacation.result.location.lat);
    console.log(dist);
```


## 禁用F12
1. 主题文件夹下 `theme/Butterfly/layout/includes/layout.pug` 在 `head,body` 同级下添加(注意缩进不然报错)

```pug
  script.
    ((function() {var callbacks = [],timeLimit = 50,open = false;setInterval(loop, 1);return {addListener: function(fn) {callbacks.push(fn);},cancleListenr: function(fn) {callbacks = callbacks.filter(function(v) {return v !== fn;});}}
    function loop() {var startTime = new Date();debugger;if (new Date() - startTime > timeLimit) {if (!open) {callbacks.forEach(function(fn) {fn.call(null);});}open = true;window.stop();alert('你真坏，请关闭控制台！');document.body.innerHTML = "";} else {open = false;}}})()).addListener(function() {window.location.reload();});
  script.
    function toDevtools(){
      let num = 0; 
      let devtools = new Date();
      devtools.toString = function() {
        num++;
        if (num > 1) {
            alert('你真坏，请关闭控制台！')
            window.location.href = "about:blank"
            blast();
        }
      }
      console.log('', devtools);
    }
    toDevtools();
```
2. 在自定义js里添加(我在 `IPdw.js` ) 代码即可【自己调试时需要注释掉...】

## 优化CSS
参考文章：https://tzy1997.com/articles/hexo1606/#%E5%B1%80%E9%83%A8css%E4%BC%98%E5%8C%96

引入在 `my.css` 里【我也不知道效果...】

## 文章永久链接更改

1. 安装插件【npm install hexo-abbrlink --save】
2. 在根配置文件找到 `permalink` 然后修改成如下：

```yml
url: https://mdcm.yang5201314.cn
permalink: post/:abbrlink.html # post为自定义前缀  文章的永久链接格式 year/:month/:day/:title/
abbrlink: 
  alg: crc32   #算法： crc16(default) and crc32
  rep: hex     #进制： dec(default) and hex
permalink_defaults: # 永久链接中各部分的默认值
pretty_urls:  # 网址美化
  trailing_index: false # 是否在永久链接中保留尾部的 index.html
  trailing_html: true # 是否在永久链接中保留尾部的 .html
```
## 顶部渐变条色加载条
在 `my.css` 加样式，然后主题配置文件引入js依赖

## 文章h1~h6风车样式

修改主题配置文件 `_config.butterfly.yml` 文件的 `beautify` 配置项两处：

```yml
  title-prefix-icon: '\f863' # '\f0c1'
  title-prefix-icon-color: "#F47466" # '#F47466'
```
在 `my.css` 添加样式

## 导航栏魔改
1. 在 `my.css` 添加，把一级图标居中
2. 修改主题文件下 `layout\includes\header\nav.pug` ，把 `span=' '+_p('search.title')` 屏蔽即可

## 文章标题霓虹灯
在 `my.css` 添加样式即可【适用于暗黑模式】

## 加入到达底部按钮

在主题文件下 `layout\includes\rightside.pug` 里最后一行(回到顶部的下面)添加即可

## 添加节日弹窗公祭日网站变灰

{% note red 'fas fa-fan' flat %}本站暂时停用此功能{% endnote %}

在主题文件下 `source\js\`创建了 `day.js` 和 `lunar.js`

然后在主题配置文件里引入依赖和js即可(依赖镜像源我使用了 `jsew.cky.codes` 速度还可以)

如果在本地调试的话弹窗只弹一次的，所以需要在设置里 `隐私设置和安全性
` --- `始终在关闭窗口时清除 Cookie` 那把 `http://localhost:4000` 添加进去即可这样每次关闭窗口都会把Cookie清除弹窗又会弹了

可以加点Emoji表情：

https://www.emojidaquan.com/all-objects-emojis

https://emojixd.com/list

## 添加灯笼
在主题文件 `\themes\butterfly\source\css` 下创建 `lantern.css`，在 `\themes\butterfly\source\css\index.styl` 文件最后引入：

```pug
// 灯笼  
if hexo-config('lantern') && hexo-config('lantern.enable')
  @import './lantern.css'
```

在主题文件下 `\themes\butterfly\layout\includes` 文件夹下新建 `lantern.pug` 写入代码，在 `\themes\butterfly\layout\includes\layout.pug` 里引入加在head的后面即可：

```pug
    //- 灯笼
    if(theme.lantern.enable)
      include ./lantern.pug
```

在主题配置文件 `_config.butterfly.yml` 加入如下配置项控制开关(手机已适配)

```yml
# 灯笼开关 建议只在过年期间开启
lantern:
  enable: true
```
## 侧栏个人信息添加微信按钮

改了图标颜色，点击进去跳转另一个静态页面(页面不使用主题渲染)，需要改为自己的微信二维码
`hexo new page weixin`

然后把html代码放进去用特定标签包住(在语法篇有教程)

## 侧栏个人信息添加摸鱼图标

参考文章：https://www.fomal.cc/posts/d739261b.html#%E5%8F%8B%E9%93%BE%E6%A0%B7%E5%BC%8F%E9%AD%94%E6%94%B9%EF%BC%88%E5%BA%97%E9%95%BF%EF%BC%89

首先在主题文件下 `\layout\widget\card_author.pug` 文件里进行替换(文字只能4个多了显示不了后面)：

```pug
      .avatar-img
        img(src=url_for(theme.avatar.img) onerror=`this.onerror=null;this.src='` + url_for(theme.error_img.flink) + `'` alt="avatar")
替换成：
      div.card-info-avatar
        .avatar-img
          img(src=url_for(theme.avatar.img) onerror=`this.onerror=null;this.src='` + url_for(theme.error_img.flink) + `'` alt="avatar")
        div.author-status-box
          div.author-status
            g-emoji.g-emoji(alias="palm_tree" fallback-src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/butterfly/blog_other/ssaa1324234.png") 🐟
            span 摸鱼中        
```
然后添加一些css在 `my.css`里

## 重写侧栏头像旋转(不要旋转功能)

用 `unset` 属性重写两行即可在 `my.css`

加了彩带，把 `\layout\widget\card_author.pug` 里的 `.is-center` 换成 `.author_top.is-center`，然后去 `my.css` 里添加样式【已屏蔽因为有点卡】

重写页脚设置按钮，由于 `unset` 的影响导致不会旋转

## 项目启动自定义字符画(在git控制台显示版本等等)

替换 `\scripts\welcome.js` 即可

## 滚动条样式

在 `my.css` 里添加

## 添加静态说说

参考文章：

https://fa.fangguokeji.cn/#apply

[蝴蝶主题+个性美化_cungudafa的博客-CSDN博客](https://blog.csdn.net/cungudafa/article/details/105699384)



1.  `languages\zh-cn.yml` 下添加

```yml
shuoshuo: 说说
```

2. 创建一个说说页面 `hexo new page shuoshuo `，然后在里面编写(引入自己的css样式和图标需要的依赖)：

```markdown
---
title: 说说
date: 2023-01-22 14:13:42
type: "shuoshuo"
comments: false
---
<link rel="stylesheet" href="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/butterfly/css/shuoshuo.css"
    media="all" onload="this.media='all'">
<link href="https://cdn.bootcdn.net/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" media="all" onload="this.media='all'">    
<div id="primary" class="content-area">
    <main id="main" class="site-main" role="main">
        <div id="shuoshuo_content">
            <ul class="cbp_tmtimeline">
                <li> 
                    <span class="shuoshuo_author_img">
                        <img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/butterfly/blog_other/93801118587.webp"
                            class="avatar avatar-48 zhuan" width="48" height="48">
                    </span>
                    <div class="cbp_tmlabel">
                        <p></p>
                        <p>想要开学，想吃火锅，想吃烧烤，想吃蟹肉煲，想吃鸡脚米线，想喝奶茶~</p>
                        <p></p>
                        <p class="shuoshuo_time"><i class="fa fa-clock-o"></i>
                            2020年2月25日
                        </p>
                    </div>
                </li>
                <li> 
                    <span class="shuoshuo_author_img">
                    <img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/butterfly/blog_other/93801118587.webp"
                            class="avatar avatar-48 zhuan" width="48" height="48">
                    </span>
                    <div class="cbp_tmlabel">
                        <p></p>
                        <p>第一个说说</p>
                        <p></p>
                        <p class="shuoshuo_time"><i class="fa fa-clock-o"></i>
                            2020年2月25日
                        </p>
                    </div>
                </li>
            </ul>
        </div>
</div>
<script type="text/javascript">
    (function () {
        var oldClass = "";
        var Obj = "";
        $(".cbp_tmtimeline li").hover(function () {
            Obj = $(this).children(".shuoshuo_author_img");
            Obj = Obj.children("img");
            oldClass = Obj.attr("class");
            var newClass = oldClass + " zhuan";
            Obj.attr("class", newClass);
        }, function () {
            Obj.attr("class", oldClass);
        })
    })
</script>
```

样式改了点


3. 在主题配置文件下添加图标，路径

```yml
  说说: /shuoshuo/ || fas fa-pen
```


3. 如果想要插入图片可以这样：

```html
<img src="" height="200" width="100" />
```

4. 一条说说要有头像，内容，时间，(用`p`标签包起来)；每条说说需要用 `li` 标签包起来【<span style="color:red;">注意代码之间不能有空行</span>】
5. 插入音乐：

```html
<iframe frameborder="no" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=1338809890&auto=1&height=66"></iframe>
```



## 页面卡片背景颜色

重写了css，改了颜色，在`my.css`

## Loading相关

加载效果：https://codepen.io/yuanchuan/pen/wZJqNK

- 去除了加载完拉开帷幕效果，我是使用默认加载，找到 `layout\loading\fullpage-loading.pug`，进行删除那两行：

```pug
#loading-box
  .loading-left-bg
  .loading-right-bg
  .spinner-box
    .configure-border-1
      .configure-core
    .configure-border-2
      .configure-core
    .loading-word= _p('loading')
```

- 自定义加载效果（只需要引进pug和styl即可）

前往[Loading Animation](https://akilar.top/posts/3d221bf2/)滑动最下面找到爱心效果：

1. 在主题文件下 `\layout\includes\loading\`下创建 `doodle.pug`，粘贴代码进去即可然后在末尾添加下面代码(以免一直在加载画面卡住)：

```pug
#loading-box
  style.
    css-doodle {--color: @p(#51eaea, #fffde1, #ff9d76, #FB3569);--rule: (:doodle {@grid: 30x1 / 18vmin;--deg: @p(-180deg, 180deg);}:container {perspective: 30vmin;}:after, :before {content: '';background: var(--color); @place-cell: @r(100%) @r(100%); @size: @r(6px); @shape: heart;} @place-cell: center; @size: 100%;box-shadow: @m2(0 0 50px var(--color));background: @m100(radial-gradient(var(--color) 50%, transparent 0)@r(-20%, 120%) @r(-20%, 100%) / 1px 1px no-repeat); will-change: transform, opacity; animation: scale-up 12s linear infinite; animation-delay: calc(-12s / @I * @i); @keyframes scale-up { 0%, 95.01%, 100% {transform: translateZ(0) rotate(0);opacity: 0;}10% {opacity: 1;}95% {transform: translateZ(35vmin) rotateZ(@var(--deg));}})}
  css-doodle(use="var(--rule)")
  script(async src='https://cdn.bootcdn.net/ajax/libs/css-doodle/0.32.2/css-doodle.min.js')


script.
  const preloader = {
    endLoading: () => {
      document.body.style.overflow = 'auto';
      document.getElementById('loading-box').classList.add("loaded")
    },
    initLoading: () => {
      document.body.style.overflow = '';
      document.getElementById('loading-box').classList.remove("loaded")

    }
  }
  window.addEventListener('load',()=> { preloader.endLoading() })

  if (!{theme.pjax && theme.pjax.enable}) {
    document.addEventListener('pjax:send', () => { preloader.initLoading() })
    document.addEventListener('pjax:complete', () => { preloader.endLoading() })
  }
```

如果CDN源慢可以换成这个：`https://cdn.bootcdn.net/ajax/libs/css-doodle/0.32.2/css-doodle.min.js`



2. 在同级文件夹下打开 `index.pug` 添加：

```diff
if theme.preloader.source === 1
  include ./fullpage-loading.pug
+else if theme.preloader.source == 6
+  include ./doodle.pug
```

3. 在主题文件下打开 `source\layout\loading.styl`，在末尾添加(注意要自己看上面例子加第一句else if判断)：

```stylus
else if hexo-config('preloader.enable') && hexo-config('preloader.source') == 6
  #loading-box
    position fixed
    z-index 1000
    width 100vw
    height 100vh
    margin 0
    background #270F34
    overflow hidden
    display flex
    align-items center
    justify-content center
    contain content
    overflow clip
    &.loaded
        z-index -1000
        css-doodle
            display none
```

4. 在主题配置文件找到 `preloader`配置项，在 `source`项那填 `6`

## 友链改动

- 头像保存在根目录下 `source\link\touxiang\` 下，引进格式为 `./touxiang/xxx.webp`
- 添加友链个数统计，修改主题文件夹下 `layout\includes\page\flink.pug`：

```diff
-    - let className = i.class_name ? markdown(`## ${i.class_name}`) : "" 
+    - let className = i.class_name ? markdown(`## ${i.class_name} (${i.link_list.length})`) : "" 
```

- 友链名字颜色，改为在 `link.yml` 里添加属性 `theme_color: "#447c7bb3" ` 即可设置不同卡片的名字颜色


```diff
-      <a href="${j.link}" title="${j.name}" target="_blank">
+      <a href="${j.link}" style="color:${j.theme_color}" title="${j.name}" target="_blank">
```

- 调整CSS，添加在 `my.css`



## 侧栏添加倒计时

参考文章：https://www.fomal.cc/posts/d1927166.html



{% note red 'fas fa-fan' flat %}注意{% endnote %}

时间格式需要改一下，不然电脑端显示正常手机端显示 `NaNa`

```js
/*时间格式：月/日/年 时:分:秒*/
let newYear = new Date('4/15/2024 8:00:00').getTime() / 1000
```



1. 根目录下创建一个 `source\_data\widget.yml`，粘贴代码
2. 在 `my.css` 添加样式(自己修改不要图片改成透明式背景颜色)
3. 主题文件下创建一个 `source\js\newYear.js`，粘贴代码(修改倒计时时间，删删减减)
4. 在主题配置文件里引入上面的JS
5. 顺便把分类，网站资讯卡片背景也重写了

## 添加鼠标样式

在 `my.css` 里添加即可，换了CDN源

## 哔哩哔哩视频适配

参考文章：https://www.naokuoteng.cn/posts/d014c592.html

```css
/*哔哩哔哩视频适配*/
.video-bilibili {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 65%;
  margin: 3% auto;
  text-align: center;
}
.video-bilibili iframe {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}

.video-youtube {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  margin: 3% auto;
}
.video-youtube iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
```

使用方法：


```markdown
<div class="video-bilibili">
  <iframe
    src="哔哩哔哩视频链接"
    scrolling="no"
    border="0"
    frameborder="no"
    framespacing="0"
    high_quality="1"
    danmaku="1"
    allowfullscreen="true"
  ></iframe>
</div>
```

## 创建博客手机APP

参考文章：https://www.naokuoteng.cn/posts/2afd210.html

有点卡，玩玩还行，ios需要证书麻烦搞不了



## 个人引导页

参考了项目：[个人樱花引导页](https://gitee.com/nianbroken/Personal_Sakura_Guide_Page#)

## 外挂标签使用

有的外挂标签如果没效果可能是包没下，需要下载 `Tag_Plugins_v1.5.zip` 然后复制 js或者css到你文件里，参考文章：[基于Butterfly的外挂标签引入](https://tzy1997.com/articles/0xiipgum/#%E6%8A%98%E5%8F%A0%E6%A1%86-folding)

## 首页文章卡片添加wowjs动画

参考文章：

[Add Blog Animation -- Wowjs](https://akilar.top/posts/abab51cf/)

[博客魔改教程总结(一)](https://www.fomal.cc/posts/eec9786.html#wowjs%E5%8A%A8%E7%94%BB)

- 安装插件

```bash
npm install hexo-butterfly-wowjs --save
```

- 然后在主题配置文件里按自己修改参数即可

## 标签添加数量统计

- 想主题文件下 `\scripts\helpers\page.js` 第52行的 `${tag.name}` 后面添加 `(${tag.length})`
- 修改了样式，在 `my.css`

## 添加置顶插件

- 先卸载旧的再安装新的

```bash
npm uninstall hexo-generator-index --save
npm install hexo-generator-index-pin-top --save
```

- 使用方法是在文章顶部添加 `top` 属性，数字越大，文章越靠前

## 分类标签名称改成英文

参考文章：http://blog.aiheadn.cn/archives/1b4c065d.html
这可要可不要，除非部署在服务器，对于 Nginx 上不支持中文 url才要改
在根配置文件里找到 `category_map` 属性和 `tag_map` 属性 ，修改这两个的值即可，格式如下：

```yml
category_map:
  '代码学习' : Codelearning
  '信息技术' : xingxijishu
```

## 浏览器视频不显示

如果网页出现嵌入的视频代码没效果，可以去 `设置`-->`隐私设置与安全性`-->`允许所有cookie`，刷新网页即可看到视频正常显示

## 添加音乐

参考文章：[butterfly魔改aplayer音乐](https://anzhiy.cn/posts/6c69.html#%E9%AD%94%E6%94%B9%E6%95%88%E6%9E%9C%E9%A2%84%E8%A7%88)

主要是添加了一个 `aplayer.css` ，一个`aplay.js`，`meting.js`，还有`music.pug`，歌单idpug里使用网易云歌单id

## 分类美化

参考文章：https://blog.4t.pw/posts/a4a8f401.html

添加css到 `my.css` 即可，默认是8个分类如果分类多的话可以复制两次把数字改一下即可

## 友链新增

参考文章：https://blog.4t.pw/posts/3161a535.html#css%E6%B7%BB%E5%8A%A0%E6%96%B9%E5%BC%8F%E4%BA%8C



## 文章新窗口打开

- 主页面， `\themes\butterfly\layout\includes\mixins\post-ui.pug`

```diff
mixin postUI(posts)
  each article , index in page.posts.data
    .recent-post-item
      -
        let link = article.link || article.path
        let title = article.title || _p('no_title')
        const position = theme.cover.position
        let leftOrRight = position === 'both'
          ? index%2 == 0 ? 'left' : 'right'
          : position === 'left' ? 'left' : 'right'
        let post_cover = article.cover
        let no_cover = article.cover === false || !theme.cover.index_enable ? 'no-cover' : ''
      -
      if post_cover && theme.cover.index_enable
        .post_cover(class=leftOrRight)
-          a(href=url_for(link) title=title)
+          a(href=url_for(link), target='_blank', title=title)
            img.post_bg(src=url_for(post_cover) onerror=`this.onerror=null;this.src='`+ url_for(theme.error_img.post_page) + `'` alt=title)
      .recent-post-info(class=no_cover)
-        a.article-title(href=url_for(link) title=title)= title
+        a.article-title(href=url_for(link), target='_blank', title=title)= title
```

- 归档页面, `\themes\butterfly\layout\includes\mixins\article-sort.pug`

```diff
      .article-sort-item(class=no_cover)
        if article.cover && theme.cover.archives_enable
-          a.article-sort-item-img(href=url_for(article.path) title=title)
+          a.article-sort-item-img(href=url_for(article.path), target='_blank', title=title)
            img(src=url_for(article.cover) alt=title onerror=`this.onerror=null;this.src='${url_for(theme.error_img.post_page)}'`)
        .article-sort-item-info
-          a.article-sort-item-title(href=url_for(article.path) title=title)= title
+          a.article-sort-item-title(href=url_for(article.path), target='_blank', title=title)= title
          span.article-sort-item-index= (current - 1) * config.per_page + post_index + 1
```



## 文章加密

安装插件

```bash
npm install --save hexo-blog-encrypt
```

在需要加密的文章头部添加

```bash
password: hello	# 密码
message: 您好, 这里需要密码.	# 描述
```

然后可以去找它的css改一下，hexo-blog-encrypt