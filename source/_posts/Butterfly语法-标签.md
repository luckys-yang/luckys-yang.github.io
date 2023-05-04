---
title: Butterfly语法/标签
cover: /img/num3.webp
categories:
  - 本站点滴
comments: false
abbrlink: e933f89d
date: 2023-01-21 21:46:57
---

- 文章置顶是 `sticky: x`（x是数字，数值越大，置顶的优先级越大）
- 文章布局
![](https://moonshuo.cn//images/202211011133548.png)


- 添加自定义页面（当我们在执行 `hexo g` 命令时，`.md` 文件就会被转化成 HTML 文件，但是有时候我们需要新建一个独立的页面，这个页面不使用主题的渲染，具有自己独立的样式）

在根目录下的 `source` 文件夹下创建index.md，需要在里面改：

```markdown
---
layout: false
---
{% raw %}
xxxxxxxxxxxxx
xx HTML代码 xx
xxxxxxxxxxxxx
{% endraw %}
```

在主题文件下 `sidebar` --- `menu` --- 下按其他页面格式写即可

- 修改404页面，在主题配置文件找到 `error_404` 选项，改成 `true`，然后找到 `404.pug` 在里面修改即可，本地预览只能访问 `http://localhost:4000/404.html` 看效果【由于是pug格式所以需要[html转pug](https://tooltt.com/html2pug/)】
- 添加Algolia搜索，参考[基于 Hexo 键入搜索功能](https://tzy1997.com/articles/hexo1607/#%E5%89%8D%E8%A8%80)，需要注意indexName不要有符号，简简单单abc就行，每次更新文章都要重新 `hexo algolia`（当前这个插件只能搜索文章名，因为主题版本太低不支持）
- 文章插入bibi视频语法：

修改里面的 aid 为你视频的 AV号
```html
<div align=center class="aspect-ratio">
    <iframe src="https://player.bilibili.com/player.html?aid=474023258&&page=1&as_wide=1&high_quality=1&danmaku=0" 
    scrolling="no" 
    border="0" 
    frameborder="no" 
    framespacing="0" 
    high_quality=1
    danmaku=1 
    allowfullscreen="true"> 
    </iframe>
</div>
```

- 文章页局部 html 代码不渲染

可以用标签包裹：
```html
{% raw %}
<div class="">你的一些代码...</div>
<script>你的一些代码...</script>
{% endraw %}
```



- 语法标签语法参考：
1. https://butterfly.js.org/posts/4aa8abbe/#timeline
2. https://tzy1997.com/articles/0xiipgum/#%E7%89%B9%E6%95%88%E6%A0%87%E7%AD%BE-wow
3. https://blog.imzjw.cn/posts/bfdocs/

- 代码框语言选择 `diff` 可以高亮 `+/-` 的代码
- 数学公式语法参考：

1. [Markdown 在数学公式中插入文字](https://blog.csdn.net/LeoYY3/article/details/81007300)
2. [markdown语法中一些数学符号](https://blog.csdn.net/holly_Z_P_F/article/details/120624491)
3. [Markdown语法之数学公式【总结】](https://blog.csdn.net/m0_46190471/article/details/126130602)
4. [markdown数学公式总结](https://zhuanlan.zhihu.com/p/357093758)
5. [markdown插入空格](https://blog.csdn.net/weixin_45052363/article/details/123610883)