---
title: EDA学习笔记
cover: /img/num98.webp
comments: false
categories:
  - EDA
abbrlink: 366a746c
date: 2022-12-04 12:05:18
---
## 前言

- 官网相关

[嘉立创EDA官网](https://lceda.cn/)

[嘉立创使用教程文档](https://docs.lceda.cn/cn/FAQ/Editor/index.html)

[嘉立创-蓝桥杯EDA视频](https://www.bilibili.com/video/BV1LP4y1E7Hd/?spm_id_from=333.999.0.0)

- 参考视频



- 参考文章



## 蓝桥杯EDA赛项

|        名称        |                             内容                             |
| :----------------: | :----------------------------------------------------------: |
|      比赛时长      |                              5h                              |
|       客观题       |                             15分                             |
|       设计题       |                             85分                             |
|    需要预装软件    | 嘉立创EDA(专业版)客户端<br>PDF阅读器<br>Office办公套件<br>解压缩软件 |
| 试题涉及的基础知识 | 数字，模拟电路基础知识<br>电子元器件参数与选型<br>原理图识图<br>原理图和PCB绘制<br>原理图设计环境参数设置<br>PCB设计环境变量和设计规则设置<br>设计规则检查<br>工程生产文件输出 |



## 基础

### 基础库

基础库上面的内容主要是一些常用的`电器标识符`、`电阻`、`电容`、`电感`、`电源`、`连接器`、`二极管`、`三极管`、`稳压器件`，还有一些其他常用的器件。

每个器件的右下角都有个小三角符号，打开后选择不同的封装类型

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230419172625.webp)

### 元件库

如果我们在画图的过程中有些库在基础库中找不到，可以在元件库中进行搜索。

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230419172817.webp)



### PCB设计

在原理图下点击 `顶部菜单`  --> `设计`  --> `原理图转PCB`

即可快速转为PCB

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230419174032.webp)

### 快捷键

- 共用快捷键

|    快捷键     |                             功能                             |                            示意图                            |
| :-----------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
| Space(空格键) |                         旋转所选图形                         | ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230419175425.webp) |
|   鼠标右键    |        长按右键拖动画布；操作过程中按一下右键释放操作        | ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/a8252328b6be90772055bf34538048fb.png) |
|    Left(←)    |                    向左滚动或左移所选图形                    | ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/6cf67c5e7ac5c6e7331fc5dc2675287c.png) |
|   Right(→)    |                    向右滚动或右移所选图形                    | ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/ddaad1d5d5872bebc1997e1de2b8c534.png) |
|     Up(↑)     |                    向上滚动或上移所选图形                    | ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/d3174e47bf306defaf158e96ac993fc7.png) |
|    Down(↓)    |                    向下滚动或下移所选图形                    | ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/9d81bf35169b38d2797512c87f019827.png) |
|      TAB      | 在放置元素时修改它的属性；选中一个元素并按下该快捷键打开偏移量对话框 | ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/e0b55206cd0e9c21fe321394be2f339e.png) |
|     HOME      |                         重新指定原点                         | ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/3ebc6ba469db2bba9113f6bc4a4103c2.png) |
|    Delete     |                           删除所选                           | ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/b97f405e8949cec58eec333dd280b0d4.png) |
|       A       |                             放大                             | ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/c5b9a846ef98985888c5593ff3f87156.png) |
|       Z       |                             缩小                             | ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/fe6ad4fe6b93f24343d1ed17ae21ecda.png) |
|       R       |                         旋转所选图形                         | ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230419175425.webp) |
|       X       |                     水平翻转(封装不支持)                     | ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/2c838993fbb14f344b7c79e076e3991b.png) |
|       Y       |                     垂直翻转(封装不支持)                     | ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/b303a213b2070423d815649e61953e55.png) |
|    CTRL+D     |                          设计管理器                          | ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/65d0637decaa3f226ae3c68b5cb7dd94 (1).png) |
|   CTRL+HOME   |                    打开原点坐标设置对话框                    | ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/d05d6fd21186c97a74fa4423a362fedf (2).png) |
|    SHIFT+F    |                       浏览和查找元件库                       | ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230419220911.png) |

- 原理图快捷键

|    快捷键    |            功能             |
| :----------: | :-------------------------: |
|      W       |          绘制导线           |
|      B       |          绘制总线           |
|      U       |          总线分支           |
|      N       |          网络标签           |
|      P       |          放置管脚           |
|      L       |          绘制折线           |
|      O       |         绘制多边形          |
|      Q       |       绘制贝塞尔曲线        |
|      C       |          绘制圆弧           |
|      S       |          绘制矩形           |
|      E       |          绘制椭圆           |
|      F       |          自由绘制           |
|      T       |          放置文本           |
|      I       |        修改选中器件         |
|    CTRL+Q    |         标识符 VCC          |
|    CTRL+G    |         标识符 GND          |
|    CTRL+R    |        仿真当前文档         |
|    CTRL+J    |     打开仿真设置对话框      |
| CTRL+SHIFT+X | 批量选中元件，布局传递到PCB |
|   SHIFT+T    |        打开符号向导         |
|    ALT+F     |       打开封装管理器        |

- PCB快捷键

|      快捷键      |                     功能                     |
| :--------------: | :------------------------------------------: |
|        W         |                   绘制走线                   |
|        U         |                   绘制圆弧                   |
|        C         |                   绘制圆形                   |
|        N         |                   放置尺寸                   |
|        S         |                   放置文本                   |
|        O         |                  放置连接线                  |
|        E         |                   绘制铺铜                   |
|        T         | 切换至顶层；选中封装时，切换封装层属性为顶层 |
|        B         | 切换至底层；选中封装时，切换封装层属性为底层 |
|        1         |                 切换至内层1                  |
|        2         |                 切换至内层2                  |
|        3         |                 切换至内层3                  |
|        4         |                 切换至内层4                  |
|        P         |                   放置焊盘                   |
|        Q         |                 切换画布单位                 |
|        V         |                   放置过孔                   |
|        M         |                   量测距离                   |
|        H         |     持续高亮选中的网络，再按一次取消高亮     |
|        L         |                 改变布线角度                 |
|        -         |  布线时，减少线宽；小键盘时，循环切换PCB层   |
|        +         |  布线时，增加线宽；小键盘时，循环切换PCB层   |
|     *(星号)      |                循环切换PCB层                 |
|      Delete      |  删除选中的元素；布线过程中撤销到上一次布线  |
|       Alt–       |                 减少栅格尺寸                 |
|       Alt+       |                 增加栅格尺寸                 |
|      CTRL+Q      |              显示或隐藏网络文字              |
|     SHIFT+S      |                 只显示当前层                 |
|    CTRL+ALT+L    |                 开启全部图层                 |
| CTRL+SHIFT+ALT+D |           打开封装自定义数据对话框           |

### 创建元件符号

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/d2d06059170f6df20499793833db68e4.png)

元件符号是元件在原理图上的表现形式，主要由 `元件边框、管脚（包括管脚序号和管脚名称）、元件名称及元件说明` 组成，通过放置的管脚来建立电气连接关系。元件符号中的管脚序号是和电子元器件实物的管脚一一对应的。在创建元件的时候，图形不一定和实物完全一样，但是对于管脚序号和名称，一定要严格按照元件规格书中的说明一一对应。

#### 手动创建

1. 放置矩形，`快捷键S`
2. 任点一处进行绘制，`右键`完成绘制
3. `左键`选择图像，点击4个`绿点`进行形状调整
4. 修改颜色
5. 放置管脚，`快捷键P`
6. 调整管脚位置，`注意小圆点要朝外侧`，选中管脚，`快捷键Space`进行旋转

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20230420095849.webp)



## 暂停更新