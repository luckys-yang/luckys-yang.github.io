---
title: QT上位机项目-云台
cover: /img/num164.webp
categories:
  - QT
comments: false
katex: true
password: 20240104
message: 涉及到公司机密,暂未开放
abbrlink: ac29a05e
date: 2024-01-04 13:56:20
---



## 前言

> 参考博客

[屁股大象的QTdemo-gitee](https://gitee.com/chen_xuyuan)

[Qt控件的使用-csdn详细](https://blog.csdn.net/pzs0221/article/details/119745243?ops_request_misc=&request_id=&biz_id=102&utm_term=qt%20%E9%A1%B9%E7%9B%AE%20%E6%8E%A7%E4%BB%B6&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~sobaiduweb~default-9-119745243.nonecase&spm=1018.2226.3001.4450)

[Qt应用开发串口助手-csdn](https://blog.csdn.net/mark_md/category_10481194.html)

[Qt自定义控件和模板分享](https://blog.csdn.net/t13506920069/article/details/126067756?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522170488281816800211592607%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fblog.%2522%257D&request_id=170488281816800211592607&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~first_rank_ecpm_v1~rank_v31_ecpm-6-126067756-null-null.nonecase&utm_term=qt%20%E9%A1%B9%E7%9B%AE%20%E6%8E%A7%E4%BB%B6&spm=1018.2226.3001.4450)

[uiverse-好看UI](https://uiverse.io/elements)

[QTextEdit 控件禁止鼠标选中文本方法](https://blog.csdn.net/qq_41633442/article/details/103202177)

[错误 C2653 “QtCharts”: 不是类或命名空间名称](https://blog.csdn.net/weixin_36815313/article/details/131346283)

[在QT中使用QtChart](https://www.jianshu.com/p/b3bdd88f490c)

[Qt中，在另一cpp文件操作ui界面的相关控件](https://blog.csdn.net/lml521lml927/article/details/119520635)

[Qt 在其他 cpp 文件中调用主工程下文件中的函数](https://zhaojichao.blog.csdn.net/article/details/131820932)

[QTextCodec 默认编码 与 编码转换](https://blog.csdn.net/ken2232/article/details/130251742?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_baidulandingword~default-1-130251742-blog-133030346.235^v40^pc_relevant_anti_t3_base&spm=1001.2101.3001.4242.2&utm_relevant_index=4)

[QSerialPort的waitForReadyRead()函数一直返回false](https://blog.csdn.net/yf18283144008/article/details/131721156)



> 参考开源项目

[Qt-widget-Fancy_UI - github](https://github.com/BFEMCC/Qt-widget-Fancy_UI/tree/main)



> 我的Github仓库

[work-AC-PTZ](https://github.com/luckys-yang/work-AC-PTZ.git)



## 开发日志

|    时间     |                             内容                             |
| :---------: | :----------------------------------------------------------: |
| `2024.1.10` |          搞一个登录页面(LoginView.h，LoginView.cpp)          |
| `2024.1.13` | 完成登陆界面的布局，剩下数据库部分后面有时间再写，开始搞主页面 |



## 自定义库

> 项目里面已添加的

- HintMessage(信息提示框)
- NavBar导航栏

需要拖个 `Widget`

- Progresswait加载中控件
- Bsp_ComBoBox下拉框控件

需要拖个 `Combo Box`

- HoverFillButton波纹按钮

需要拖个 `PushButton`

- Panelitem标题栏控件

需要拖个  `Widget`

- LcdDateTime当前时间控件

需要拖个 `widget`，可以通过CSS改样式

- FlatUI 控件ll

不需要提升，直接拖对应的即可，然后只需要调用函数重新设置样式即可

1. QPushButton按钮
2. QLineEdit单行文本编辑框
3. QProgressBar进度条
4. QSlider滑块
5. QRadioButton单选按钮
6. QCheckBox复选框
7. QScrollBar滚动条

8. QLabel标签

- NavProgress导航进度条(暂时没用到)

需要拖一个 `widget`

- NavLabel标签控件

需要拖一个 `QLabel` 

- SaveLog调试输出控件

不需要提升，直接在 TextEdit控件上用即可

- TextMoveWidget字体滚动控件(暂时没用到)

需要拖个  `widget`

- progresscolor进度条控件

拖个 `widget`

- ImageAnimation图片动画控件

拖个 `widget` 即可

- ProgressPercent加载控件

拖个 `widget` 即可



> 使用图标字体

可以使用图标字体，然后找对应的索引即可





### 登陆界面

#### 注意

> 如果想要主窗口边框圆角，方法是定义一个父窗口(在main)，然后再定义一个窗口继承于父类，大小一样，然后把父类的窗口设置为无边框，透明背景即可
>
> ```cpp
> setWindowFlags(windowFlags() | Qt::FramelessWindowHint);  // 去掉窗口边框
> this->setAttribute(Qt::WA_TranslucentBackground);//设置窗口背景透明
> ```

> 注意设置大小或者什么的一定要指定对象，不然不生效
>
> ```cpp
> this->setFixedSize(TOOL_WINDOW_W, TOOL_WINDOW_H);	// 指定当前窗口大小
> close_btn->setFixedSize(42, 42);	// 指定按钮的大小
> 
> // 不能直接这样(不推荐！！！！)
> setFixedSize(TOOL_WINDOW_W, TOOL_WINDOW_H);
> setFixedSize(42, 42);
> ```

> ```cpp
> const SignInView* GetSignInView() const;	// 该函数不会修改成员变量的值，并且该函数可以在常量对象上调用,可以用来获取 SignUpView 对象的状态，但不能修改其状态
> SignInView* GetSignInView() const;	// 该函数不会修改成员变量的值，并且该函数可以在常量对象上调用,可以用来获取或修改 LoginOverlay 对象的状态
> ```

> 使用了非 ASCII 字符集中的字符（例如 Unicode 字符）, `isalpha()` 和 `isdigit()` 函数可能无法正确地处理这些字符，从而导致断言失败
>
> 使用 Qt 的 `QString` 类代替 `std::string`，以便正确处理 Unicode 字符。您可以将输入字符串转换为 QString 对象，然后使用 `QChar` 类的 `isLetter()` 和 `isDigit()` 函数来检查字符串中的字母和数字(2024.1.14 --- 这种写法不要了换成别的)
>
> ```cpp
> bool PublicClass::Letter_Number_isValid(const std::string& str)
> {
> 	
> 	QString qstr = QString::fromStdString(str);
> 
> 	int nCount = qstr.count();
> 
> 	for (int i = 0; i < nCount; i++)
> 	{
> 		QChar cha = qstr.at(i);
> 		ushort uni = cha.unicode();
> 		if (uni >= 0x4E00 && uni <= 0x9FA5)
> 		{
> 			//这个字符是中文
> 			return false;
> 		}
> 	}
> 	return true;
> }
> ```





#### 旧缓存区

{% folding, LoginView %}

```cpp
// .h

/*装载 LoginCard 的主窗口-------------------------------------------------------------------------------*/

class LoginView : public QWidget
{
    Q_OBJECT
public:
    explicit LoginView(QWidget* parent = nullptr);
    ~LoginView();
    // 获取 SignInView 对象指针的常量版本
    const SignInView* GetSignInView() const;
    // 获取 SignUpView 对象指针的常量版本
    const SignUpView* GetSignUpView() const; 
protected:
    // 初始化窗口内容
    void Init(); 
    // 绘制事件(override)
    void paintEvent(QPaintEvent* event) override;
    // 登录函数
    void SignIn(const QString user, const QString pwd); 
    // 注册函数
    void SignUp(const QString nickName, const QString user, const QString pwd); 
private:
    LoginCard* m_pLoginCard; // LoginCard 对象指针
    QPixmap m_backgroundPixmap; // 背景图像
};


// .cpp

/*装载 LoginCard 的主窗口-----------------------------------------------------------------------------------------------------------------------*/


LoginView::LoginView(QWidget *parent)
    : QWidget(parent)
{
    LoginviewParameter.screenWidth = QApplication::primaryScreen()->geometry().width();  // 获取屏幕宽度
    LoginviewParameter.screenHeight = QApplication::primaryScreen()->geometry().height();  // 获取屏幕高度
    //setFixedSize(LoginviewParameter.screenWidth, LoginviewParameter.screenHeight);    // 固定窗口大小为屏幕大小

    // 读取css样式
    QFile file(":/Loginview/Resource/CSS/Loginview.css");
    if (true == file.open(QFile::ReadOnly))
    {
        LoginviewParameter.qss = file.readAll();
        file.close();	// 关闭文件
#ifdef QT_Loginview_DEBUG
        qDebug() << LoginviewParameter.qss << Qt::endl;
        qDebug() << "屏幕宽度:" << LoginviewParameter.screenWidth << "屏幕高度:" << LoginviewParameter.screenHeight << Qt::endl;
#endif
    }
    else
    {
#ifdef QT_Loginview_DEBUG
        qDebug() << "open file error";
#endif
    }

    //setWindowFlags(windowFlags() | Qt::FramelessWindowHint);  // 去掉窗口边框
    LoginView::Init();
}

LoginView::~LoginView()
{
#ifdef QT_Loginview_DEBUG
    qDebug() << "delete LoginView";
#endif
}

const SignInView *LoginView::GetSignInView() const
{
    return m_pLoginCard->GetSignInView();	// 返回 LoginCard 中的 SignInView
}

const SignUpView *LoginView::GetSignUpView() const
{
    return m_pLoginCard->GetSignUpView();  // 返回 LoginCard 中的 SignUpView
}

void LoginView::Init()
{
    setObjectName(QStringLiteral("login_view"));	// 给窗口设置对象名
    //setStyleSheet(LoginviewParameter.qss);	// 设置窗口样式
    // 加载图片
    //m_backgroundPixmap.load(":/Loginview/Resource/Images/AC_logo.png");
    // 缩放背景图片以适应屏幕
    //m_backgroundPixmap = m_backgroundPixmap.scaled(LoginviewParameter.screenWidth, LoginviewParameter.screenHeight, Qt::IgnoreAspectRatio, Qt::SmoothTransformation);
    // 创建 LoginCard 窗口
    m_pLoginCard = new LoginCard(this);
    // 将背景图片设置到 LoginCard 的 Overlay 中
    m_pLoginCard->GetOverlay()->SetPixmap(m_backgroundPixmap);
    // 将 LoginCard 窗口移动到屏幕中央
    m_pLoginCard->move((width() - m_pLoginCard->width()) / 2,  (height() - m_pLoginCard->height()) / 2);

    // 连接 SignInView 的 Submitted 信号和 LoginView 的 SignIn 槽函数
    connect(GetSignInView(), &SignInView::Submitted, this, &LoginView::SignIn);
    // 连接 SignUpView 的 Submitted 信号和 LoginView 的 SignUp 槽函数
    connect(GetSignUpView(), &SignUpView::Submitted, this, &LoginView::SignUp);

    // 全屏展示窗口
    //showFullScreen();
}

void LoginView::paintEvent(QPaintEvent *event)
{
    // QStyleOption ---- Qt 绘图元素的各种选项的类
    QStyleOption opt;
    // 初始化(Qt5是用init函数)
    opt.initFrom(this);

    QPainter p(this);
    // 设置渲染提示 --- 开启反锯齿  开启平滑像素变换
    p.setRenderHints(QPainter::Antialiasing | QPainter::SmoothPixmapTransform);
    // 使用当前样式（QStyle）绘制一个窗口小部件(widget)
    style()->drawPrimitive(QStyle::PE_Widget, &opt, &p, this);
    // 绘制背景图片
    p.drawPixmap(0, 0, m_backgroundPixmap);
    QWidget::paintEvent(event);	// 调用基类 QWidget 的 paintEvent 函数
}

void LoginView::SignIn(const QString user, const QString pwd)
{
    // 执行登陆操作
}

void LoginView::SignUp(const QString nickName, const QString user, const QString pwd)
{
    // 执行注册操作
}
```

{% endfolding %}

> 设置阴影
>
> ```cpp
> /*添加阴影效果*/
> //创建了一个 QGraphicsDropShadowEffect 对象，并将它设置为当前窗口小部件（widget）的图形效果
> QGraphicsDropShadowEffect *shadow = new QGraphicsDropShadowEffect(this);
> // 设置阴影的偏移量。在这里，阴影的偏移量为 (0, 0)，表示没有偏移
> shadow->setOffset(0, 0);
> // 设置阴影的颜色为灰色
> shadow->setColor(Qt::red);
> // 设置阴影的模糊半径。这里设置为30
> shadow->setBlurRadius(1);
> // 将 QGraphicsDropShadowEffect 对象设置为当前窗口小部件的图形效果，从而应用阴影效果
> setGraphicsEffect(shadow);
> // 设置当前窗口小部件的内容边距
> setContentsMargins(1, 1, 1, 1);
> ```

> 设置渐变矩形
>
> ```cpp
> // 在paintEvent函数里面写即可
> 
> //从左上角填充到右下角
> QLinearGradient linearGradient(100, 100, 300, 300);
> //填充过程中插入的颜色
> linearGradient.setColorAt(0, QColor(133, 132, 76));
> linearGradient.setColorAt(0.5, QColor(122, 32, 57));
> linearGradient.setColorAt(1, QColor(12, 32, 157));
> QBrush brush(linearGradient);
> p.setPen(Qt::NoPen);
> p.setBrush(brush);
> p.drawRect(100, 100, 200, 200);
> ```

> 绘制一下自己新加的内容，然后再调用基类的绘制事件
>
> ```cpp
> QWidget::paintEvent(even);	// 调用基类 QWidget 的 paintEvent 函数
> ```

> QT的刷新机制，有时会不刷新的bug解决办法
>
> ```cpp
> void showEvent(QShowEvent *e)
> 
> {
>     this->setAttribute(Qt::WA_Mapped);	// 告诉系统界面已经显示出来了
>     QWidget::showEvent(e);	
> } 
> ```

> 信号与槽旧版本写法：
>
> ```cpp
> connect(ui->left_navBar, SIGNAL(currentItemChanged(int, QString)), this, SLOT(currentItemChanged(int, QString)));
> ```

> 【使用window的API，无法跨平台】
>
> 窗口置顶
>
> ```cpp
> #include <Windows.h>
> /*
> 1. 将 Qt 的窗口标识符（winId() 函数返回的值）转换为 Windows 窗口句柄 HWND。HWND 是 Windows 窗口的句柄类型
> 2. 表示将窗口置于所有非顶层窗口之上，即置顶。如果使用 HWND_NOTOPMOST，则表示取消窗口置顶
> 3. 表示窗口的新位置，这里设置为 (0, 0)，即保持原有位置
> 4. 表示窗口的新大小，这里设置为 (0, 0)，即保持原有大小
> 5. SWP_NOMOVE 表示不改变窗口的位置，SWP_NOSIZE 表示不改变窗口的大小
> */
> SetWindowPos(reinterpret_cast<HWND>(winId()), HWND_TOPMOST, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE);
> ```
>
> 禁止捕获
>
> 禁止捕获窗口的情况通常与隐私、安全性或应用程序设计的特定需求有关
>
> 禁止捕获窗口并不总是可行的，因为一些窗口管理器或桌面环境可能允许全局捕获屏幕的权限。此外，禁止捕获可能会影响用户体验，并应该谨慎使用
>
> ```cpp
> SetWindowDisplayAffinity(reinterpret_cast<HWND>(winId()), WDA_EXCLUDEFROMCAPTURE);//禁止捕获
> 
> SetWindowDisplayAffinity(reinterpret_cast<HWND>(winId()), WDA_NONE);//恢复
> ```

> 设置字体大小：
>
> ```cpp
> font.setPixelSize(40); // 设置字体大小
> ```



#### 闲谈

1. 登陆成功的话直接禁用登陆窗口上面的控件还有切换登陆和注册的那个按钮，然后显示加载控件
2. 加载控件计数到100%发送信号，发送信号，main函数里面进行信号连接，判断到这个信号然后进行关闭登陆窗口，显示主窗口(存在问题，不能释放登录窗口，只能关闭，调用释放会卡死，也尝试在登陆窗口那在析构函数里面进行信号的断开也没用)



### 主页面

> 整体命名

| 变量  |    中文     |
| :---: | :---------: |
| Pitch | 俯仰角(Y轴) |
| Roll  | 横滚角(X轴) |
|  Yaw  | 航向角(Z轴) |

命名规则是大到小，就是 `父类名_部件名`，套就完了



#### 闲谈

1. 主页面左边使用自定义控件 `NavBar` 布局，右边使用 `Stacked Widget` 控件

需要注意导航栏建立连接后需要手动emit一次，不然的话虽然界面选中的是索引0，但是显示的对应页面是不会刷新的(可能对应页面显示的是索引1)

```cpp
ui->left_navBar->setItems("云台中控;参数设置;固件更新;云台测试;串口调试助手;波形显示");
ui->left_navBar->setTextFont(QFont(MainwindowParameter.System_Font_Id, 11));	// 设置字体和大小
emit ui->left_navBar->NavBar_Signals_CurrentItemChanged(0, "云台中控");	// 手动触发一次
```

2. 主函数需要重写显示事件，然后使用定时器延时100ms触发显示事件这样才能保证打开软件会刷新一次页面，如果不加的话索引0是不会刷新的(首次)，需要点一下其他项再回去才正常

- 有弊端，就是每次最小化再打开都会因为这个而自动回到索引0的页面，所以改成另一个方法就是在主窗口初始化后使用一个定时器定时100ms后触发刷新索引 --- 修改1

- 上面的还有弊端，把登陆窗口也打开后，发现登陆完成后show主窗口不会刷新，因为主窗口在main函数时就初始化一次了，解决方法是加一个标志位，把屏蔽的重写函数打开，保证标志位只执行一次就不会发生【2】的问题
- 还是有问题，发现把窗口设置为无边框后左边导航栏没有选择索引0(没有填充ui颜色)，原因可能是因为设置无边框后触发 `showevent` 进去执行了跳转到所以0函数，然后标志位置true就不会再进去了，所以解决方法是设置为延时500ms触发跳转到索引，一开始是100ms可能太快了

3. 添加自定义字体，鸿蒙开源字体，把ttf存储在qrc里面然后调用函数设置即可

```cpp
int fontId = QFontDatabase::addApplicationFont("G:\\my_code\\win_qt_code\\AC\\AC_PTZ_V1\\Resource\\HarmonyOS_Sans_Bold.ttf");
QStringList fontFamilies = QFontDatabase::applicationFontFamilies(fontId);
if (fontFamilies.size() > 0)
{
    QFont font;
    font.setFamily(fontFamilies[0]);
    qApp->setFont(font);
}
#ifdef QT_Mainwindow_DEBUG
qDebug() << fontFamilies;
#endif
```

4. 窗口是否可移动是通过判断水平线，水平线下则鼠标不能让窗口移动，水平线上则鼠标可以使窗口移动

- bug：在多个屏幕之间拖的话会有显示不全的情况，除非最小化再打开则变正常，原因是移动到新位置后没有手动刷新，所以需要在移动到新位置则调用更新函数 `update()`(但是转换会导致页面卡顿一会)
- 不能使用安装过滤器方式，也不重写 `eventFilter`函数，不然这样导致父窗口上的其他子窗口也能触发事件进行拖动而不是只能父窗口才能拖动，解决方法是重写鼠标点击和松开事件，使用定时器触发然后进行拖动即可(放弃这种，因为这个使用定时器，在拖的过程中会造成里面控件卡顿阻塞)
- 还是使用原来的那个重写3个鼠标函数，不使用定时器，但是需要在鼠标松开时刷新页面不然会显示不全(副屏拖到主屏时)，但是这刷新也会造成页面卡顿一会

```cpp
void Mainwindow::mousePressEvent(QMouseEvent* event)
{
	// 只处理主窗口上小于 Line_H 的区域
	if (event->y() < Line_H)
	{
		if (event->button() == Qt::LeftButton)
		{
			MainwindowParameter.m_click = event->pos();
			dragTimer->start();
		}
	}

	// 其他处理
	QWidget::mousePressEvent(event);
}

void Mainwindow::mouseReleaseEvent(QMouseEvent* event)
{
	// 只处理主窗口上小于 Line_H 的区域
	if (event->y() < Line_H && event->button() == Qt::LeftButton)
	{
		dragTimer->stop();
		MainwindowParameter.m_click = { 0, 0 };
	}

	// 其他处理
	QWidget::mousePressEvent(event);
}


// 定时器槽函数，处理窗口的移动
void Mainwindow::onDragTimerTimeout()
{
	QPoint currentPos = mapFromGlobal(QCursor::pos());
	this->move(this->pos() + currentPos - MainwindowParameter.m_click);
	this->update();
}
```

5. 最小化和关闭使用信号方式触发，还要考虑一个问题就是鼠标按下但是是在超出这个按钮的范围外松开则需要把此次操作无效，通过获取松开时全局坐标是否在矩形内即可，大概是下面这样，需要判断 `clicked`，不能判断 `released`，不然还是不行

```cpp
/*关闭按钮点击后释放触发*/
connect(ui->closeBtn, &QPushButton::clicked, this, [ = ]()
{
    // 获取了全局鼠标位置
    QPoint mousePos = QCursor::pos();
    QPoint localPos = this->mapFromGlobal(mousePos);

    if (this->rect().contains(localPos))    // 检查局部坐标是否在窗口的矩形区域内
    {
        this->close();
    }
});
```

6. 注意一个问题就是建立连接的顺序会影响实际操作的，比如如果先建立连接再初始化鼠标拖动就不生效，需要初始化完界面再建立连接，然后如果有些控件不生效的话可以在建立连接后手动触发一次信号

7. 遇到一个奇怪的问题，这里要么就不传参，然后Lambda就可以使用 `[&]`，要么就传参，但是Lambda就只能是 `[=]`，否则触发信号就会产生异常

```cpp
void Mainwindow::UI_Test_Init(Ui::MainwindowClass* ui)
{
		connect(btn1, &HoverFillButton::HoverFillButton_Signals_mose_isRelease, this, [=]() {
		qDebug() << ui->left_navBar->getCurrentIndex();
		ui->step_1->setStatusMode(StepProgress::ColorMode_Finish);
		this->update();	// 手动更新
		});
}
```

8. 如何在别的cpp文件调用主ui操作页面控件？

<img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240120111739.webp" style="zoom: 80%;" />

9. 常用的正则表达式我放在 `PublicClasss` 了，函数使用 `static` 这样直接通过类名去调用即可

 

#### 底部

- 校准进度的框大小

高固定40，字体大小10，字间距2

1. 4个中文的占80宽
2. 3个英文的占50
3. 2个英文的占40
4. 5个中文占95
5. 2个中文占50

- 调试框使用 `Text Edit` 这个支持 `HTML` ，使用 `Plain Text Edit` 则不支持，然后滚动条的样式最好不要用自带的，先把自带的屏蔽掉，然后拖一个滚动条放过去即可，在程序里再重新指定文本框的滚动条，滚动条样式在CSS里添加即可

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240117173109.webp)

```cpp
ui->Debug_TextEdit->setVerticalScrollBar(ui->verticalScrollBar);
```

### Bug/未解决

> LineEdit控件设置了只读但是还是可以进行输入中文(只是输入了不能删除，只能选择再输入就会覆盖)，其他的正常不能输入，也试了换正则表达式限制全部不能输入但是会显示一个光标，而且只要程序里面进行修改这个控件的文本然后还是可以进行删除，而且只读和正则表达式共存的话不行(2024.1.17)
>
> ~~【暂时的解决方法】：可以不使能这个控件但是这样的话显示不太好看，目前还是直接只读模式~~
>
> 【解决方法】：有个属性修改就可以了，`focusPolicy` 选择 `NoFocus`，用于设置控件的焦点策略。您可以将焦点策略设置为 `Qt::NoFocus` 以禁用控件的焦点

> 【报错 C2653 “QtCharts”: 不是类或命名空间名称】
>
> 解决方法是：
>
> 在ui界面把 `QtCharts::QChartView` 改成 `QChartView`

> 不能在勾选【保存日志】状态下关闭窗口否则关闭后显示异常，解决方法是在主窗口关闭前取消勾选，重写主窗口的关闭函数即可
>
> ```cpp
> void Mainwindow::closeEvent(QCloseEvent* event)
> {
> 	// 检查复选框是否被勾选，如果是，则取消勾选
> 	if (ui->Debug_SaveLog_CheckBox->isChecked())
> 	{
> 		ui->Debug_SaveLog_CheckBox->setChecked(false);
> 	}
> 	// 调用父类的 closeEvent 函数
> 	QWidget::closeEvent(event);
> }
> ```

> 不能在主线程里直接操作UI，需要通过信号与槽进行操作，把UI控制放在槽函数里，线程通过信号去触发即可

> 串口接收 waitForReadyRead 函数 一直返回timeout
>
> ~~解决方案是使用waitForReadyRead延时一段时间，不判断返回结果，直接realAll可以读到数据~~【不行这样会如果关闭串口则报异常，只能现在是不用这个延时了】
>
> readyRead信号适用于异步；
> waitForReadyRead适用于同步
>
> 信号不要同时使用，必然触发超时错误

> 串口发送框如果先写好内容再点击【16进制发送】的话转为16进制正常，但是再按一次转回去的话虽然转成功但是待会点击发送时是会把显示的当做字符串发送的【待解决】

> 发现一个就是如果连接了设备后，不拔连接电脑那端的串口线而是拔了连接设备那端的串口线，那上位机不会检测到设备断开还是正常处于连接状态，这个正常，但是版本信息它不会消失，而且连接另一台设备后版本信息不会更新，因为串口没有断开，它不会重新发送版本查询，这个暂时不管，只能从用户自己去解决，断开设备连接别的设备后需要重新打开串口才能正常获取版本信息，软件当然也可以一直去定时查询版本号但是没必要

> 主线程需要发送数据包的话最好通过信号与槽进行发送，还有就是需要注意串口的初始化~~一定要全局的不要在函数里面进行初始化否则会出现野指针，也就是没有初始化就用，今天遇到就是串口new放在打开串口按钮那，只有打开串口才new，然后我没打开串口就点击按钮进行发送操作就报错异常~~，还是可以放在函数里面，只需要其他地方发送前先进行判断串口是否打开就不会造成异常，不推荐放全局因为这样会导致就是打开的第一个串口很正常但是关闭重新打开另一个串口就会出现警告串口不能创建在别的线程也导致丢包率大大提高

> 程序在别人电脑上出现点击控件有矩形虚线框出现，暂时未解决，但是有看到解决方法：
>
> [QTableWidget选中存在虚线问题](https://blog.csdn.net/weixin_39308337/article/details/104043242)
>
> [Qt 按钮控件虚线框](https://blog.csdn.net/JohnnyRian/article/details/116057962)



### 软件工作流程

打开串口后，上位机间隔1s发送一次【版本查询0x50】，直到有收到回复后，然后再间隔100ms交替发送【系统状态查询0x51】和 【姿态查询0x10】





### 串口

参考：

[Modbus协议串口调试软件](https://github.com/SantaJiang/ModbusDebuger/tree/master)

[SerialAssistance](https://github.com/lynnllh/SerialAssistance/tree/master)

[Qt串口](https://github.com/XuhengChai/QtSerialPort)

[Qt串口基本设置与协议收发、波形显示](https://blog.csdn.net/weixin_45817947/article/details/132795563?ops_request_misc=&request_id=&biz_id=102&utm_term=qt%E4%B8%B2%E5%8F%A3%E5%8F%91%E9%80%81&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~sobaiduweb~default-4-132795563.nonecase&spm=1018.2226.3001.4450)

[QT串口发送结果比预期多字节问题](https://blog.csdn.net/yimuta9538/article/details/103769756?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522170636391316777224459709%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fblog.%2522%257D&request_id=170636391316777224459709&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~first_rank_ecpm_v1~rank_v31_ecpm-11-103769756-null-null.nonecase&utm_term=qt%E4%B8%B2%E5%8F%A3%E5%8F%91%E9%80%81&spm=1018.2226.3001.4450)



- 串口参数要设置对，不然会打开失败，显示 `系统找不到指定文件`，如果其他参数都正确，那大概率就是端口号选错或者端口名设置错误，串口名字不能带有描述信息，必须是 `COMx` 格式

```cpp
MainPage5_ui->Top_SerialPort_comboBox->addItem(info.portName().append(": ").append(info.description()), info.portName());	// 添加可用的串口端口号和描述信息
```

可以这样写，第二个参数就是端口号数据，到时候读取直接读取即可

- 串口列表检测

检测的话分为

1. 串口打开状态下，检测到列表有变化，但是不是正在当前使用的端口，【方法是如果正在使用时列表发生了改变则等关闭串口时就直接进行更新】
2. 串口关闭状态下，检测到列表有变化，【方法是直接发送更新信号】
3. 串口打开状态下，检测到列表有变化而且是当前正在使用的端口，【方法是直接强制断开串口然后更新】

- 串口数据接收的槽函数需要做唯一标识，即在连接函数参数最后加一个，这样保证了信号与槽函数是唯一的，如果再次尝试使用相同的信号和槽进行连接，连接操作将被忽略

```cpp
connect(_serialPort, &QSerialPort::readyRead, this, &SerialThread::Serial_Thread_Data_Receive, Qt::UniqueConnection);
```

- 文本框限制输入

> ```cpp
> void MainPage5::Slots_Page5_SerialSend_textEdit_TextChanged()
> {
> 	// 勾选了十六进制发送
> 	if (AppSettings::Status_Enable == AppSettings::Instance()->get_pSerialCommunicationParameter()->HexSend_Status)
> 	{
> 		QString strData = MainPage5_ui->Page5_SerialSend_textEdit->toPlainText();
> 		// 使用正则表达式匹配十六进制数和空格
> 		QRegularExpression hexRegex("^[0-9A-Fa-f ]+$");
> 		if (!hexRegex.match(strData).hasMatch())
> 		{
> 			 emit MainPage5_Signals_PromptMsg(MessageType::MESSAGE_TYPE_ERROR, QString("只能输入十六进制或空格!"));
> 			MainPage5_ui->Page5_SerialSend_textEdit->blockSignals(true);
> 			MainPage5_ui->Page5_SerialSend_textEdit->setText("");	// 清除输入框
> 			MainPage5_ui->Page5_SerialSend_textEdit->blockSignals(false);
> 		}
> 	}
> }
> ```
>
> 上面如果不加 `MainPage5_ui->Page5_SerialSend_textEdit->blockSignals` 限制的话会造成死循环导致异常
>
> 设置为true时，QObject对象[子类]不会发出信号
>
> ```cpp
> 例如：
> 
> QComboBox动态添加item的时候，它会发出xxxChanged信号，但是初始情况下我们不希望其发出，待初始化完成后再发出。
> 
> 则可以：
> 
> 先设置blockSignals(true)；//阻塞信号
> 
> 添加item；
> 
> 设置blockSignals(false);//取消信号阻塞
> ```

还有就是起点问题，如果删除键删除到文本框起点位置也会触发一次正则表达式，方法是检测光标的位置，光标为0则不进入if触发错误处理

```cpp
int cursorPosition = MainPage5_ui->Page5_SerialSend_textEdit->textCursor().position();
```

- 编码问题

串口助手我默认都是 `UTF-8`，所以中文的十六进制跟GBK编码是不一样的

```cpp
// UTF-8的 "你好"
E4 BD A0 E5 A5 BD
// GBK的 "你好"
C4 E3 BA C3
```



- 定时器的话必须在同一个线程打开或者关闭，最好初始化为 `nullptr`，然后放函数里面的话为了防止重复连接最好先解除连接再进行连接

```cpp
void SerialThread::Serial_Thread_TimingSend_Control(int time)
{
	// 如果之前已经创建了定时器，则先解除定时器与槽函数的连接否则定时器停不下来
	if (TimingSend_timer != nullptr)
	{
		disconnect(TimingSend_timer, &QTimer::timeout, this, nullptr);
		TimingSend_timer->stop();
		TimingSend_timer = nullptr;
	}
	TimingSend_timer = new QTimer(this);
	connect(TimingSend_timer, &QTimer::timeout, this, [=]()
		{
			// 发送数据信号
			emit SerialThread_Signals_StartSendData();
		});

	if (AppSettings::Status_Enable == AppSettings::Instance()->get_pSerialCommunicationParameter()->TimingSend_Status)
	{
		// 启动定时器
		TimingSend_timer->start(time);
	}
	else if (AppSettings::Status_Disable == AppSettings::Instance()->get_pSerialCommunicationParameter()->TimingSend_Status)
	{
		TimingSend_timer->stop();
	}
}
```

- 串口发送的话去掉发送完成显示在上位机这个部分，因为发现会很卡，直接发送即可不显示，这个的原因找到了，是因为使用了插入，得使用 `append` 才不会卡

- 串口接收文本框十六进制显示一行可以显示30个十六进制数

- 串口接收使用队列+定时器定时去解析里面的数据方法

- 解析数据的话暂时有两种方法

1. 使用了 `QByteArray` 和 `QString` 类的一些方法来获取和解析数据

```cpp
// 示例

/*数据解析*/
// 使用constData函数获取data字节数组的指向数据的常量指针 将常量指针转换为const uchar*类型 将从小端模式表示的字节序列解析为指定类型的值
quint16 mainVersion = qFromLittleEndian<quint16>(reinterpret_cast<const uchar *>(array.constData()));	// 固件版本(0~1)
quint16 rackVersion = qFromLittleEndian<quint16>(reinterpret_cast<const uchar *>(array.constData() + 2));	// 机架编号(2~3)
quint16 configVersion = qFromLittleEndian<quint16>(reinterpret_cast<const uchar *>(array.constData() + 4));	// 配置版本1(4~5)
// 机架描述
QByteArray rackDescriptionBytes = array.mid(6, 32);	// mid 获取字节数组中指定位置和长度的子字节数组 第 6 个位置开始，取出长度为 32 的子字节数组
QString rackDescription = QString::fromUtf8(rackDescriptionBytes.constData()).trimmed();	// 需要转UTF-8  trimmed用于移除字符串两端的空白字符
// 编译时间
QByteArray compileDateBytes = array.mid(38, 16);
QString compileDate = QString::fromUtf8(compileDateBytes.constData()).trimmed();
// ID
QByteArray id = array.mid(54, 12).toHex().toUpper();

/*UI更新*/
if (AppSettings::Instance()->getSerial_isOpen())
{
    ui->Top_ICVersion_lineEdit->setText(QString::number(mainVersion));
    ui->Top_ICID_lineEdit->setText(id);
    ui->Bottom__RackNumber_lineEdit->setText(QString("%1: %2").arg(QString::number(rackVersion)).arg(rackDescription));
    ui->Bottom__CompileTime_lineEdit->setText(compileDate);
    ui->Bottom__ConfigVersion1_lineEdit->setText(QString::number(configVersion));
}
```

2. 直接使用 `QDataStream` 进行二进制解析，直接对字节进行解析，并且可以指定字节顺序，而不需要进行多次数组截取、字符串转换等操作，效率高推荐！

> `readRawData` 从数据流中读取原始数据并将其存储到指定的缓冲区，接受两个参数：缓冲区的指针和要读取的字节数

```cpp
// 示例

/*数据解析*/
// 将字节数组转换为数据流
QDataStream stream(array);
// 设置字节序为小端模式，与协议说明中一致
stream.setByteOrder(QDataStream::LittleEndian);

qint16 roll, pitch, yaw;	// 姿态
qint16 motorRoll, motorPitch, motorYaw;	// 电机位置
qint16 targetRoll, targetPitch, targetYaw;	// 目标姿态
qint16 motionSpeedRoll, motionSpeedPitch, motionSpeedYaw;	// 运动速度辐值

// 从数据流中读取数据，并存入上述定义的变量中
stream >> roll;	//姿态 - 横滚 俯仰 航向
stream >> pitch;
stream >> yaw;

stream >> motorRoll;	//电机位置 - 横滚 俯仰 航向
stream >> motorPitch;
stream >> motorYaw;

stream >> targetRoll;	//目标姿态 - 横滚 俯仰 航向
stream >> targetPitch;
stream >> targetYaw;

stream >> motionSpeedRoll;	//运动速度辐值 - 横滚 俯仰 航向
stream >> motionSpeedPitch;
stream >> motionSpeedYaw;

// 将读取的数据转换为浮点数值
float rollValue = static_cast<float>(roll) / 100.0;
float pitchValue = static_cast<float>(pitch) / 100.0;
float yawValue = static_cast<float>(yaw) / 100.0;

float motorRollValue = static_cast<float>(motorRoll) / 100.0;
float motorPitchValue = static_cast<float>(motorPitch) / 100.0;
float motorYawValue = static_cast<float>(motorYaw) / 100.0;

float targetRollValue = static_cast<float>(targetRoll) / 100.0;
float targetPitchValue = static_cast<float>(targetPitch) / 100.0;
float targetYawValue = static_cast<float>(targetYaw) / 100.0;

float motionSpeedRollValue = static_cast<float>(motionSpeedRoll) / 100.0;
float motionSpeedPitchValue = static_cast<float>(motionSpeedPitch) / 100.0;
float motionSpeedYawValue = static_cast<float>(motionSpeedYaw) / 100.0;

/*Ui更新*/
// 运动速度辐值
ui->Page1_Pane1_Pitch_lineEdit->setText(QString::number(motionSpeedPitchValue, 'f', 2));
ui->Page1_Pane1_Roll_lineEdit->setText(QString::number(motionSpeedRollValue, 'f', 2));
ui->Page1_Pane1_Yaw_lineEdit->setText(QString::number(motionSpeedYawValue, 'f', 2));
// 姿态角
ui->Page1_Pane2_Pitch_lineEdit->setText(QString::number(pitchValue, 'f', 2));
ui->Page1_Pane2_Roll_lineEdit->setText(QString::number(rollValue, 'f', 2));
ui->Page1_Pane2_Yaw_lineEdit->setText(QString::number(yawValue, 'f', 2));
// 电机位置
ui->Page1_Pane3_Pitch_lineEdit->setText(QString::number(motorPitchValue, 'f', 2));
ui->Page1_Pane3_Roll_lineEdit->setText(QString::number(motorRollValue, 'f', 2));
ui->Page1_Pane3_Yaw_lineEdit->setText(QString::number(motorYawValue, 'f', 2));
// 目标姿态
ui->Page1_Pane4_Pitch_lineEdit->setText(QString::number(targetPitchValue, 'f', 2));
ui->Page1_Pane4_Roll_lineEdit->setText(QString::number(targetRollValue, 'f', 2));
ui->Page1_Pane4_Yaw_lineEdit->setText(QString::number(targetYawValue, 'f', 2));
```

- 协议里某些涉及到位功能，所以可以使用位域结构体来存储，注意大小端问题还有跨平台下字节对齐，如果跨平台的话还是用位运算好点

- 协议解析那全部使用 `QByteArray` 类型进行存储与解析，之前是转为 `QString` 类型再进行数据解析结果是经常丢包，改成这个后大大降低了丢包率

旧方案：

```cpp
QString SerialThread::Serial_Thread_OldProtocol1_CRC(QByteArray array)
{
	quint16 temp = 0;
	quint8 sum = 0;

	QDataStream out(&array, QIODevice::ReadWrite); // 将字节组读入
	while (!out.atEnd())
	{
		qint8 outchar = 0;
		out >> outchar; // 每字节填充一次，直到结束
		temp += (qint16)(outchar & 0xff);
	}

	sum = temp & 0xFF;	// 只要低8位

	QString crc = QString("%1").arg(sum & 0xFF, 2, 16, QLatin1Char('0')).toUpper();
#if 0
	qDebug() << "crc:" << sum << Qt::endl;
#endif
	return crc;
}

void SerialThread::Serial_Thread_OldProtocol1_DataGetCheck(QByteArray& recvBuff)
{
	QString crc;        // 接收到的CRC

	QDataStream out(&recvBuff, QIODevice::ReadWrite);      // 创建QDataStream对象，用于读取QByteArray

	while (!out.atEnd())    // 如果未读取到QByteArray结尾
	{
		qint8 outChar = 0;  // 定义一个字节类型的变量，初始化为0
		out >> outChar;     // 从QByteArray中读取一个字节，并放入outChar中

		// 将读取到的字节转换为十六进制字符串
		QString byte = QString("%1").arg(outChar & 0xFF, 2, 16, QLatin1Char('0')).toUpper();

		switch (OldProtocol1_Parameter->state_machine)
		{
		case HeaderState:
		{
			// 判断帧头
			if (PROTOCOL1_HEAD == byte)
			{
				OldProtocol1_Parameter->state_machine = SourceAddressState;
			}
			break;
		}
		case SourceAddressState:
		{
			// 判断目的地
			if (PROTOCOL1_SRC_GATE2 == byte)
			{
				OldProtocol1_Parameter->checkData_str += byte;
				OldProtocol1_Parameter->state_machine = DestinationAddressStatus;
			}
			else
			{
				OldProtocol1_Parameter->checkData_str.clear();
				OldProtocol1_Parameter->state_machine = HeaderState;
			}
			break;
		}
		case DestinationAddressStatus:
		{
			// 判断来源地址
			if ((PROTOCOL1_SRC_PITCH == byte) || (PROTOCOL1_SRC_ROLL == byte) || (PROTOCOL1_SRC_YAW == byte) || (PROTOCOL1_SRC_HANDLE == byte) || (PROTOCOL1_SRC_GATE1 == byte) || (PROTOCOL1_SRC_GATE2 == byte))
			{
				OldProtocol1_Parameter->checkData_str += byte;
				OldProtocol1_Parameter->state_machine = FunctionCodeStatus;
			}
			else
			{
				OldProtocol1_Parameter->checkData_str.clear();
				OldProtocol1_Parameter->state_machine = HeaderState;
			}
			break;
		}
		case FunctionCodeStatus:
		{
			// 功能码
			OldProtocol1_Parameter->functionCode = byte;
			OldProtocol1_Parameter->checkData_str += byte;
			OldProtocol1_Parameter->state_machine = DataLen1Status;
			break;
		}
		case DataLen1Status:
		{
			// 数据长度1和2是一样的
			OldProtocol1_Parameter->bufferdatalen = byte;
			OldProtocol1_Parameter->state_machine = DataLen2Status;
			break;
		}
		case DataLen2Status:
		{
			// 数据长度1和2是一样的，故转换为实际长度只需要拿其中一个即可
			OldProtocol1_Parameter->bufferdatalen += byte;
			OldProtocol1_Parameter->checkData_str += OldProtocol1_Parameter->bufferdatalen;
			OldProtocol1_Parameter->dataLen_Cnt = 0;
			OldProtocol1_Parameter->dataLen = byte.toInt(&OldProtocol1_Parameter->ok, 16);	// 16进制字符串转换为10进制数字
			// 数据长度为0则直接跳到CRC即可
			if (PROTOCOL1_NONE_DATALEN == OldProtocol1_Parameter->bufferdatalen)
			{
				OldProtocol1_Parameter->state_machine = ChecksumState;
			}
			else
			{
				OldProtocol1_Parameter->state_machine = ReceiveDataBlockState;
			}
			break;
		}
		case ReceiveDataBlockState:
		case LastReceiveDataBlockState:
		{
			OldProtocol1_Parameter->validData_str += byte;	// 接收的有效数据
			OldProtocol1_Parameter->checkData_str += byte;
			if (OldProtocol1_Parameter->dataLen_Cnt == (OldProtocol1_Parameter->dataLen - 1))		// 接收够数据(0~69相当于70个所以dataLen需要-1)
			{
				OldProtocol1_Parameter->state_machine = ChecksumState;
			}
			else	// 未接收完
			{
				OldProtocol1_Parameter->state_machine = LastReceiveDataBlockState;
				++OldProtocol1_Parameter->dataLen_Cnt;	// 计数++
			}
			break;
		}
		case ChecksumState:
		{
			// CRC校验
			crc = byte;
			QByteArray temp = QByteArray::fromHex(OldProtocol1_Parameter->checkData_str.toLatin1().data());	// 数据为字符串，需要转换成16进制
#if 0
			qDebug() << "有效数据个数:" << OldProtocol1_Parameter->dataLen_Cnt << "OldProtocol1_Parameter->dataLen:" << OldProtocol1_Parameter->dataLen << Qt::endl;
#endif
			QString strSum = Serial_Thread_OldProtocol1_CRC(temp);

			if (crc == strSum)
			{
				// 校验成功
				OldProtocol1_Parameter->dataCheck_Flag = true;
#if 0	// 解析数据不使用unsigned char* 故屏蔽
				// 把数据保存
				for (int i = 0, j = 0; i < OldProtocol1_Parameter->validData_str.length(); i += 2, j++)
				{
					OldProtocol1_Parameter->finalData[j] = OldProtocol1_Parameter->validData_str.mid(i, 2).toInt(&OldProtocol1_Parameter->ok, 16);
				}
#endif
				QByteArray hexData = QByteArray::fromHex(OldProtocol1_Parameter->validData_str.toUtf8());	// 将一个十六进制字符串转换为对应的字节数组
				// 串口数据解析
				Serial_Thread_OldProtocol1_Data_Analyze(OldProtocol1_Parameter->functionCode, hexData, OldProtocol1_Parameter->dataLen);
			}
			else
			{
				// 校验失败
				OldProtocol1_Parameter->dataCheck_Flag = false;
			}
			strSum.clear();	// 清除
			OldProtocol1_Parameter->functionCode = "XX";
			OldProtocol1_Parameter->validData_str.clear();	// 有效数据清0
			OldProtocol1_Parameter->checkData_str.clear();	// 校验数据清0
			OldProtocol1_Parameter->state_machine = HeaderState;
			break;
		}
		default:break;
		}
		}
#if 0	// 打印
	qDebug() << "除了帧头以外的数据:" << buffer << Qt::endl;
#endif
	}

void SerialThread::Serial_Thread_OldProtocol1_Data_Analyze(QString code, const QByteArray& array, int data_len)
{
	switch (code.toInt(&OldProtocol1_Parameter->ok, 16))
	{
	case PRO1_FUNC_PostureQuery:	// 姿态查询
	{
		emit Pro1_Signals_PostureQuery(array, data_len);
		break;
	}
	case PRO1_FUNC_VersionQuery:	// 版本查询
	{
		emit Pro1_Signals_VersionQuery(array, data_len);
		OldProtocol1_Parameter->ConnectDevice_Flag = true;
		break;
	}
	case PRO1_FUNC_SystemStatusQuery:	// 系统状态查询
	{
		emit Pro1_Signals_SystemStatusQuery(array, data_len);
		break;
	}
	default:
	{
		qDebug() << "功能码错误";
		return;
	}
	}
	AppSettings::Instance()->ParsePack_Count++;	// 解包数++
	emit SerialThread_Signals_PackCountToUi();	// 发送信号更新显示
}
```

- 分割符问题

```cpp
// 获取轨迹点
QString input_text = ui->Page1_Pane6_TrackPoint_lineEdit->text();

QStringList points = input_text.trimmed().split(';', Qt::SkipEmptyParts);	// 如果只有一个轨迹点时，在进行字符串分割时，会得到两个元素："12,111" 和 ""（空字符串） 因为分隔符 ";" 出现在字符串的末尾，所以最后一个元素就是空字符串返回的是分割后的字符串数组中的元素数量，即 2 这是因为分割后的数组中包含了一个非空元素和一个空字符串元素 如果你想要避免这种情况，可以在进行字符串分割之前，先使用 trimmed() 方法删去字符串两端的空格，或者在进行字符串分割时，使用 QString::SkipEmptyParts 标记来跳过空字符串
```
- QByteArray相关

> 方法 `prepend` 把元素插在头部

## 常用控件

### 滚动条

- setValue函数

可以设置滚动条位置，可以设置到最大值 `maximum()` 的位置



### 复选框

- 通过状态改变信号 `stateChanged` 可以知道有没有勾，它有返回值，勾了是 `2` ，没勾是 `0`
- 通过判断 `checkState` 可以获取勾选状态
- 方法`setCheckState` 可以设置勾不勾选



### 下拉框

- 设置显示内容的同时绑定对应的数据

```cpp
MainPage2_ui->Page2_Pane1_PCAddr_comboBox->addItem("12", AppSettings::PCAddr_12);	// 显示12,绑定对应的数据是枚举类型的
```

下拉框的选项默认下标是从第一个选项开始是0，以此递增，所以获取当前所选项的下标是

```cpp
int current = MainPage2_ui->Page2_Pane1_Model_comboBox->currentIndex();
```

获取下标对应的绑定数据(返回类型是QVaariant类型需要用 `static_cast` 转换为对应想要的类型)，也可以使用方法 `currentData`

```cpp
qDebug() << MainPage2_ui->Page2_Pane1_PCAddr_comboBox->itemData(index);

auto current_data = MainPage2_ui->Page2_Pane1_Model_comboBox->itemData(current).value<AppSettings::Model_et>();	// 获取当前下标对应的绑定数据(需要类型转换)
qDebug() << current_data;

// 另一种方法(推荐)
auto checkBit_current_data = MainPage5_ui->Page5_SerialCheckBit_comboBox->currentData().value<AppSettings::SerialCheckBit_et>();// 获取当前下标对应的绑定数据(需要类型转换)
```

通过数据寻找对应下标是

```cpp
qDebug() << MainPage2_ui->Page2_Pane1_PCAddr_comboBox->findData(static_cast<int>(AppSettings::PCAddr_11));
```



### 文本框

- 默认是数据超出文本框自动换行的，可以通过Ui界面修改， 把  `lineWrapMode` 模式设置为 `QTextOption::NoWrap`，则不会自动换行就会水平一直写入
- 追加文本的话使用 `append` 会自动在末尾添加换行符，使用 `insertPlainText` 则不会添加换行符
- `toPlainText` 是以纯文本方式获取框里的内容
- 没有正则表达式方法 `setValidator`



## 旧协议

### S07

中间的是俯仰，上面是横滚X，下面是航向

> 功能
>
> 1. POV模式下表示旋转按钮会旋转横滚轴电机，相当于解锁横滚
> 2. PF模式下表示旋转左右按钮会旋转航向轴电机，旋转上下会旋转俯仰
> 3. F模式
> 4. L模式
> 5. 任意模式下长按不放就是FG模式，此模式下电机回来力度变大，松开则退出FG模式变成普通模式
> 6. 双击红点切换横竖屏
> 7. 点击电源则打开补光灯，有3档





### 总体

一个设备有唯一的配置：

1. 串口波特率
2. 校验位
3. 停止位
4. 数据位
5. 机型
6. PC地址
7. 是否等待空闲帧



### 协议

#### 初始

> 定义 `控制设备为通信主机，即上位机`， `云台为通信从机，即下位机`
>
> 数据从云台发往控制设备： `数据上行`
>
> 数据从控制设备发往云台： `数据下行`

> 通信模式：`采用问答式通信模式即：主机问 – 从机答`

> 基本规则：
>
> 1. 主机的设置/命令类功能吗，在从机无需数据返回的情况下，都以 `确认/否认帧` 返回
> 2. 未特别说明，所有数据均采用 `小端模式`，即 `低位字节在前,高位字节在后`
> 3. 延后命令返回问题，对于校准等命令，结果无法马上返回，主机应该在命令执行过程中 `反复查询状态`，校准返回命令也将在校准结束后遇到查询命令返回

> 以下协议版本为 `1.0.2.4`

- 设备正常可识别配置

|    机型     | 串口波特率 | PC地址 | 是否等待空闲帧 |
| :---------: | :--------: | :----: | :------------: |
| V5+新按键板 |    9600    |   12   |       否       |



#### 协议部分

>【协议格式】
>
>|     名称      | 长度（byte） |              说明              |
>| :-----------: | :----------: | :----------------------------: |
>|     帧头      |      1       |          固定值：0x55          |
>|   目的地址    |      1       |            备用：0             |
>|    源地址     |      1       |            备用：0             |
>|    功能码     |      1       |                                |
>| 用户数据长度1 |      1       |               N                |
>| 用户数据长度2 |      1       |               N                |
>| 用户数据(UD)  |      N       |        用户数据可以为空        |
>|     校验      |      1       | 和校验：从目的地址开始的字节和 |

> 【地址规划】
>
> | 地址空间 | 地址 |    模块     |         说明          |
> | :------: | :--: | :---------: | :-------------------: |
> |    0     |  2   |  俯仰/云台  |                       |
> |    0     |  1   |    横滚     | 仅Bootloader 状态有效 |
> |    0     |  3   |    航向     | 仅Bootloader 状态有效 |
> |    0     |  4   |  手柄/网关  |                       |
> |    10    |  11  | 网关1号端口 |        上位机         |
> |    10    |  12  | 网关2号端口 |                       |
> |    10    |  13  |   摄像头    |          AI           |
> |    10    |  14  |   遥控器    |                       |



### 【确认】0x00

> `上位机发送`：55 02 0C 46 04 04 01 01 96 14 08 

|  名称  | 长度 |    说明    |
| :----: | :--: | :--------: |
| 命令ID |  1   | 确认的命令 |
|  备用  |  1   |            |

> `下位机回复`：55 0C 02 00 02 02 46 00 58

### 【否认】0x01

|  名称  | 长度 |    说明    |
| :----: | :--: | :--------: |
| 命令ID |  1   | 否认的命令 |
|  备用  |  1   |            |
|  原因  |  2   | 否认的原因 |



### 【调试信息】0x02

> `上位机发送`：

电机校准过程中会发送给上位机，字符串形式，包含了x次校准的值

> `下位机回复`：55 0c 02 02 17 17 32 e6 ac a1 e6 a0 a1 e5 87 86 3a 31 30 31 39 20 20 20 32 35 35 39 34 2a



### 【输入-六面下一步】0x03

> `上位机发送`：55 02 0C 03 04 04 01 00 00 00 1A

| 名称 | 长度 | 说明 |
| :--: | :--: | :--: |
| 值1  |  2   |      |
| 值2  |  2   |      |



> `下位机回复`：

### 【命令输入】0x04

> `上位机发送`：55 02 0C 04 0B 0B 70 72 69 6E 74 5F 73 74 61 74 65 D5 （print_state）
>
> `上位机发送`：55 02 0C 04 0F 0F 70 72 69 6E 74 5F 6D 6F 74 6F 72 5F 63 61 6C 7C （print_motor_cal）





> `下位机回复`：55 0C 02 04 0B 0B 70 72 69 6E 74 5F 73 74 61 74 65 D5
>
> `下位机回复`：55 0C 02 04 0F 0F 70 72 69 6E 74 5F 6D 6F 74 6F 72 5F 63 61 6C 7C

### 【姿态查询】0x10

> `上位机发送`：55 02 0C 10 00 00 1E

|       名称        | 长度 |     说明     |
| :---------------: | :--: | :----------: |
|     姿态-横滚     |  2   | ±180度 X 100 |
|     姿态-俯仰     |  2   | ±180度 X 100 |
|     姿态-航向     |  2   | ±180度 X 100 |
|   电机位置-横滚   |  2   | ±180度 X 100 |
|   电机位置-俯仰   |  2   | ±180度 X 100 |
|   电机位置-航向   |  2   | ±180度 X 100 |
|   目标姿态-横滚   |  2   | ±180度 X 100 |
|   目标姿态-俯仰   |  2   | ±180度 X 100 |
|   目标姿态-航向   |  2   | ±180度 X 100 |
| 运动速度辐值-横滚 |  2   |              |
| 运动速度辐值-俯仰 |  2   |              |
| 运动速度辐值-航向 |  2   |              |

> `下位机回复示例`：55 0C 02 10 18 18 AF F5 67 DD DA C1 67 03 C3 DB 33 E5 00 00 50 DD 7B 3E 0B 00 0A 00 20 00 0C



### 【姿态设置】0x11

> `上位机发送`：55 02 0C 11 06 06 10 27 20 4E 30 75 75 

|   名称    | 长度 |                        说明                         |
| :-------: | :--: | :-------------------------------------------------: |
| 姿态-横滚 |  2   | ±180度 X 100 如果为±32768表示该设置无效（以下类同） |
| 姿态-俯仰 |  2   |                    ±180度 X 100                     |
| 姿态-航向 |  2   |                    ±180度 X 100                     |

> `下位机回复`：55 0C 02 00 02 02 11 00 23(确认)

### 【扩展模式通知】0x12

> `上位机发送`：





> `下位机回复`：

### 【匀速运动速度设置】0x13

> `上位机发送`：55 02 0C 13 06 06 00 00 0C 00 21 00 5A

|   名称   | 长度(Byte) |     说明      |
| :------: | :--------: | :-----------: |
| 横滚速度 |     2      | 度/s，0为停止 |
| 俯仰速度 |     2      |     度/s      |
| 航向速度 |     2      |     度/s      |



> `下位机回复`：55 0C 02 00 02 02 13 00 25(确认)

### 【跟随设置】0x14

> `上位机发送`：





> `下位机回复`：

### 【初始姿态（姿态微调）读取】0x15

> `上位机发送`：55 02 0C 15 00 00 23 

| 名称 | 长度(Byte) |   说明    |
| :--: | :--------: | :-------: |
| 横滚 |     2      | 弧度x1000 |
| 俯仰 |     2      | 弧度x1000 |

> `下位机回复`：55 0C 02 15 04 04 00 00 00 00 2B



### 【初始姿态（姿态微调）设置】0x16

> `上位机发送`：55 02 0C 16 04 04 37 00 64 00 C7

| 名称 | 长度(Byte) |   说明    |
| :--: | :--------: | :-------: |
| 横滚 |     2      | 弧度x1000 |
| 俯仰 |     2      | 弧度x1000 |



> `下位机回复`：55 0C 02 00 02 02 16 00 28(确认)



### 【跟随参数读取】0x17

> `上位机发送`：55 02 0C 17 00 00 25

参考 跟随参数设置

> `下位机回复`：55 0C 02 17 08 08 00 00 0F 00 3C 00 3C 00 BC 

### 【模式设置】0x18

> `上位机发送`：55 02 0C 18 02 02 02 00 2C （快速跟随就是进入FG模式）
>
> `上位机发送`：55 02 0C 18 02 02 00 00 2A （退出快速跟随）

|   名称   | 长度(Byte) |                             说明                             |
| :------: | :--------: | :----------------------------------------------------------: |
|   模式   |     1      | 0：普通模式<br>1：校准模式(动态)<br>2：电机锁定模式(FG模式)<br>3：无<br>4：校准模式(静态) |
| 模式参数 |     1      |             FG模式：0或0xFF最快速度1-255速度等级             |



> `下位机回复`：55 0C 02 00 02 02 18 00 2A（确认）

### 【跟随参数设置】0x19

> `上位机发送`：55 02 0C 19 08 08 57 04 6F 00 57 04 57 04 B7 

|   名称   | 长度(Byte) |   说明    |
| :------: | :--------: | :-------: |
| 航向死区 |     2      |    度     |
| 俯仰死区 |     2      |    度     |
| 航向速度 |     2      | 1-255级别 |
| 俯仰速度 |     2      | 1-255级别 |

> `下位机回复`：55 0C 02 00 02 02 19 00 2B

### 【控制参数读取】0x1A

> `上位机发送`：55 02 0C 1A 00 00 28 

参考控制参数设置

> `下位机回复`：55 0C 02 1A 06 06 00 00 00 1E 0A 0C 68

### 【控制参数设置】0x1B

> `上位机发送`：55 02 0C 1B 06 06 00 00 00 00 00 00 35 （无勾选）
>
> `上位机发送`：55 02 0C 1B 06 06 00 01 00 00 00 00 36 （勾选俯仰摇杆反向）
>
> `上位机发送`：55 02 0C 1B 06 06 00 00 01 00 00 00 36 (勾选航向摇杆反向)
>
> `上位机发送`：55 02 0C 1B 06 06 00 01 01 00 00 00 37 （两个都勾选）

|     名称     | 长度(Byte) |        说明         |
| :----------: | :--------: | :-----------------: |
| 横滚摇杆方向 |     1      | 0：正向<br>1：反向  |
| 俯仰摇杆方向 |     1      | 0：正向<br/>1：反向 |
| 航向摇杆方向 |     1      | 0：正向<br/>1：反向 |
| 横滚摇杆速度 |     1      |      1-255级别      |
| 俯仰摇杆速度 |     1      |      1-255级别      |
| 航向摇杆速度 |     1      |      1-255级别      |



> `下位机回复`：55 0C 02 00 02 02 1B 00 2D 

### 【电机围栏查询】0x1C

> `上位机发送`：





> `下位机回复`：

### 【电机围栏设置】0x1D

> `上位机发送`：





> `下位机回复`：

### 【匀速运动速度查询】0x1E

> `上位机发送`：55 02 0C 1E 00 00 2C 

|   名称   | 长度(Byte) | 说明 |
| :------: | :--------: | :--: |
| 横滚速度 |     2      | 度/s |
| 俯仰速度 |     2      | 度/s |
| 航向速度 |     2      | 度/s |



> `下位机回复`：55 0C 02 1E 06 06 00 00 00 00 00 00 38

### 【默认参数缺省设置】0x1F

> `上位机发送`：55 02 0C 1F 01 01 00 2F （跟随模式参数 - 缺省）
>
> `上位机发送`：55 02 0C 1F 01 01 01 30 （控制参数 - 缺省）





> `下位机回复`：55 0C 02 00 02 02 1F 00 31

### 【无】0x20



### 【姿态位移命令】0x21

> `上位机发送`：





> `下位机回复`：

### 【轨迹模式命令】0x22

> `上位机发送`：55 02 0C 22 01 01 01 33 (轨迹开始)
>
> `上位机发送`：55 02 0C 22 0C 0C 02 02 64 00 20 D1 50 46 E0 2E 00 00 45 （轨迹执行）
>
> `上位机发送`：55 02 0C 22 01 01 00 32 （轨迹退出）

|    名称    | 长度(Byte) |                           说明                            |
| :--------: | :--------: | :-------------------------------------------------------: |
|    类型    |     1      | 0：退出轨迹模式<br>1：进入轨迹准备阶段<br>2：轨迹执行阶段 |
| 轨迹点个数 |     1      |           (2~12) x 4 字节（仅轨迹执行模式有效）           |
|  轨迹时间  |     2      |                            秒                             |
|  轨迹点1   |     4      |                航向坐标x100，俯仰坐标x100                 |
|  轨迹点2   |     4      |                           同上                            |
|  轨迹点n   |     4      |                       2 <= n <= 12                        |

> `下位机回复`：55 0C 02 00 02 02 22 00 34 （确认）
>
> `上位机回复`：55 0C 02 00 02 02 22 00 34 （确认）55 0C 02 10 18 18 02 00 18 00 D0 FF 03 01 0E 01 CE FF 00 00 E6 13 20 D1 18 00 D4 00 CF 01 BD （调试信息）
>
> `下位机回复`：55 0C 02 00 02 02 22 00 34 （确认）

### 【中心跟随命令】0x23

> `上位机发送`：





> `下位机回复`：

### 【输出控制】0x24

> `上位机发送`：





> `下位机回复`：

### 【HV横竖切换命令】0x25

> `上位机发送`：55 02 0C 25 01 01 01 36

| 名称 | 长度(Byte) |              说明              |
| :--: | :--------: | :----------------------------: |
| 类型 |     1      | 0：切换到横屏<br>1：切换到竖屏 |



> `下位机回复`：55 0C 02 00 02 02 25 00 37（确认）

### 【摄像头接口】0x26

|   名称   | 长度(Byte) |                             说明                             |
| :------: | :--------: | :----------------------------------------------------------: |
|  命令码  |     1      | 0：NONE<br>1：横竖排切换命令 （云台响应）<br>2：开始/结束录像  （按键版响应）<br>3：拍照/录像切换命令（按键版响应）<br>4：开启/关闭跟踪<br>5：开启/关闭手势<br>6：锁定/解除人物 |
| 命令参数 |     1      |                                                              |





### 【电机零位置微调查询】0x27

> `上位机发送`：55 02 0C 27 00 00 35 

| 名称 | 长度(Byte) |   说明   |
| :--: | :--------: | :------: |
| 横滚 |     2      | 0xFFFF/0 |
| 俯仰 |     2      | 0xFFFF/0 |
| 航向 |     2      | 角度x100 |



> `下位机回复`：55 0C 02 27 06 06 00 00 00 00 00 00 41 

### 【电机零位置微调设置】0x28

FF FF 固定，发送时x100凑整

> `上位机发送`：55 02 0C 28 06 06 FF FF BB 04 DC 02 DD 

| 名称 | 长度(Byte) |             说明             |
| :--: | :--------: | :--------------------------: |
| 横滚 |     2      |            0xFFFF            |
| 俯仰 |     2      |            0xFFFF            |
| 航向 |     2      | 角度x100（0XFFFF无效设置值） |



> `下位机回复`：

### 【运动控制命令(回中)】0x30

> `上位机发送`：55 02 0C 30 01 01 00 40 （回中）
>
> `上位机发送`：55 02 0C 30 01 01 02 42 (自拍)





> `下位机回复`：55 0C 02 00 02 02 30 00 42（确认）

### 【过程运动控制-全景命令】0x31

> `上位机发送`：55 02 0C 31 03 03 02 00 24 6B （开始全景）
>
> `上位机发送`：55 02 0C 31 02 02 02 01 46 （执行全景）
>
> `上位机发送`：55 02 0C 31 02 02 02 FF 44 （退出全景）
>
> `上位机发送`：55 02 0C 31 02 02 00 64 A7 （盗梦）
>
> `上位机发送`：55 02 0C 31 02 02 01 00 44 （dm1启）
>
> `上位机发送`：55 02 0C 31 03 03 01 01 00 47 （dm1执行）
>
> `上位机发送`：55 02 0C 31 02 02 01 02 46 （dm1退）

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-16_18-18-48.webp)

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-16_18-19-01.webp)



> `下位机回复`：55 0C 02 00 02 02 31 00 43 

### 【电机测试-力矩命令】0x40

> `上位机发送`：55 02 0C 40 06 06 0B 00 0C 00 0D 00 7E(正常设置)
>
> `上位机发送`：55 02 0C 40 06 06 FF FF FF FF FF FF 54(关闭力矩)

| 名称 | 长度(Byte) |  说明  |
| :--: | :--------: | :----: |
| 横滚 |     2      | +-1800 |
| 俯仰 |     2      | +-1800 |
| 航向 |     2      | +-1800 |



> `下位机回复`：55 0C 02 00 02 02 40 00 52(确认)

### 【PID控制调试命令(横滚)】0x41

> `上位机发送`：





> `下位机回复`：

### 【PID控制调试命令(俯仰)】0x42

> `上位机发送`：





> `下位机回复`：

### 【PID控制调试命令(航向)】0x43

> `上位机发送`：





> `下位机回复`：

### 【陀螺仪数据查询】0x44

> `上位机发送`：





> `下位机回复`：

### 【控制板重启】0x45

> `上位机发送`：55 02 0C 45 02 02 FF 00 56
>
> `上位机发送`：55 02 0C 45 02 02 FF CC 22（校准清除）

重启后会回复字符串调试信息：

```bash
// auto_ad_ps=0
55 0c 02 02 0c 0c 61 75 74 6F 5F 61 64 5F 70 73 3D 30 b4
```



> `下位机回复`：55 0C 02 00 02 02 45 00 57

### 【临时命令】0x46

- 声音

> `上位机发送`：55 02 0C 46 04 04 01 01 96 14 08 

第7个字节固定0x01

|     名称     | 长度（字节） |   说明    |
| :----------: | :----------: | :-------: |
|   音量频率   |      1       | 范围0~255 |
|   音量大小   |      1       | 范围0~255 |
| 音量持续时间 |      1       | 范围0~255 |

> `下位机回复`：55 0C 02 00 02 02 46 00 58 (确认)



- 辨识采样

> `上位机发送`：55 02 0C 46 01 01 00 56 



### 【读取内存数据】0x47

> `上位机发送`：





> `下位机回复`：

### 【电机角度数据】0x48

> `上位机发送`：





> `下位机回复`：

### 【补光灯控制】0x49

> `上位机发送`：55 02 0C 49 03 03 00 00 00 5D(灭)
>
> `上位机发送`：55 02 0C 49 03 03 01 00 00 5E （亮）





> `下位机回复`：55 0C 02 00 02 02 49 00 5B(确认)

### 【用户数据UD读】0x4A

> `上位机发送`：55 02 0C 4A 02 02 01 01 5E 

- 上位机发送

|   名称   | 长度（字节） |            说明             |
| :------: | :----------: | :-------------------------: |
| 起始地址 |      1       |         目前只支持1         |
| 数据长度 |      1       | 字数量（非字节）目前只支持1 |

- 下位机回复

|   名称   | 长度（字节） |            说明             |
| :------: | :----------: | :-------------------------: |
| 起始地址 |      1       |         目前只支持1         |
| 数据长度 |      1       | 字数量（非字节）目前只支持1 |
|  数据1   |      2       |                             |

> `下位机回复`：55 0C 02 4A 04 04 01 01 01 00 63 

### 【用户数据写】0x4B

> `上位机发送`：55 02 0C 4B 04 04 01 01 05 00 68 

|   名称   | 长度（字节） |            说明             |
| :------: | :----------: | :-------------------------: |
| 起始地址 |      1       |         目前只支持1         |
| 数据长度 |      1       | 字数量（非字节）目前只支持1 |
|  数据1   |      2       |                             |



> `下位机回复`：55 0C 02 00 02 02 4B 00 5D (确认)

### 【云台测试噪声】0x4C

> `上位机发送`：55 02 0C 4C 01 01 02 5E （IMU噪声测试）
>
> `上位机发送`：55 02 0C 4C 01 01 03 5F （航向漂移速度测试）大概8s后发送查询命令回传
>
> `上位机发送`：55 02 0C 4C 01 01 04 60 （IMU零偏测试）大概5s后发送查询命令回传
>
> `上位机发送`：55 02 0C 4C 01 01 01 5D （一键体检）大概10s后发送查询命令回传
>
> `上位机发送`：55 02 0C 4C 01 01 00 5C （查询结果）

噪声测试的话，可以通过内部状态去判断测试完没有，它测完的话，X,Y,Z电机静止标志会短时间变成0然后恢复为1的，判断到就直接发送一个查询结果命令即可

- 查询命令回传

|   名称   | 长度（字节） |                             说明                             |
| :------: | :----------: | :----------------------------------------------------------: |
| 测试命令 |      1       |                     就是上位机发送的命令                     |
| 测试结果 |      n       | IMU噪声测试：XYZ噪声，各占1字节，需要结果除以100<br>IMU零偏测试：校准后数据XYZ,原始数据XYZ,各占1个字节，结果需要除以100 |

> `下位机回复`：55 0C 02 00 02 02 4C 00 5E
>
> `下位机回复`：查询结果：55 0C 02 4C 04 04 02 4F 61 55 69（IMU噪声测试）
>
> `下位机回复`：查询结果：55 0C 02 4C 07 07 04 07 2A 00 4F 2C 04 1C（IMU零偏测试）从左到右是校准后零偏，原始零偏
>
> `下位机回复`：查询结果：55 0C 02 4C 11 11 01 00 02 01 00 02 00 03 00 04 01 05 01 06 01 07 00 9E （一键体检）格式是【检查项 检测结果】从左到后分别是00编码器磁场强度，01IMU温度补偿范围，02陀螺仪校准，03加速度计校准，04卡位校准，05IMU噪声，06校准后零偏，07原始零偏，结果是0则成功，其他则表示失败

### 【补光灯控制】0x4D

> `上位机发送`：





> `下位机回复`：

### 【版本查询】0x50

> `上位机发送`：55 02 0C 50 00 00 5E

|   名称    | 长度（字节） |                        说明                         |
| :-------: | :----------: | :-------------------------------------------------: |
|  版本号   |      2       |                     主程序版本                      |
| 机架版本  |      2       |                   十进制机架编号                    |
| 配置版本1 |      2       |           X. X. X. X. X 新手柄协议.0.0.0            |
| 机架描述  |      32      |                   描述字符串UTF-8                   |
| 编译日期  |      16      |                     字符串UTF-8                     |
|    ID     |      16      | ID二进制值，96位有效(也就是相当于12位，后面4位无效) |

> `下位机回复`：55 0C 02 50 46 46 29 0C D2 00 74 27 E5 A4 AE E6 9E 9C 2D 53 37 5F 41 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 32 30 32 33 31 32 32 32 31 36 34 30 00 00 00 00 93 8A 48 00 00 40 65 58 22 37 71 04 00 00 00 00 C3



- 读手柄版本

跟上面一样，源地址不同

> `上位机发送`：55 04 0C 50 00 00 60 



> `下位机回复`：55 0C 04 50 46 46 76 08 CD 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 32 30 32 33 31 32 33 30 31 31 32 38 35 34 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 F9

对应：手柄版本:2166 硬件版本:205 编译时间:20231230112854



### 【系统状态查询】0x51

> `上位机发送`：55 02 0C 51 00 00 5F

|            名称            | 长度(字节) |                             说明                             |
| :------------------------: | :--------: | :----------------------------------------------------------: |
|          运行时间          |     2      |                            单位s                             |
|          系统状态          |     4      |                           见下表1                            |
|          扩展状态          |     4      |                           见下表2                            |
|          横滚温度          |     1      |                       摄氏度(为0正常)                        |
|          俯仰温度          |     1      |                         摄氏度(主控)                         |
|          航向温度          |     1      |                       摄氏度(为0正常)                        |
|          内部状态          |     4      |                           见下表3                            |
| 震动幅度(这个应该是没用到) |     6      | X轴震动幅度（2字节 幅度X100）<br>Y轴震动幅度（2字节 幅度X100）<br>Z轴震动幅度（2字节 幅度X100） |
|           IO输入           |     2      |                          16位IO输入                          |

- 表1

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240128192433.webp)

- 表2

例如：

$$ \text{12 -> 0000 0000 0000 0000 0000 0000 0000 1100 -> 轨迹执行阶段 + 轨迹运动已到达开始位置}$$

1.0.2.4版本协议工作模式的4DV移到应用模式下为7DV，旧的1.0.2.0是下面的样子，故按照新的来

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240129101656.webp)

- 表3

1.0.2.4版本协议新增 ai位在 Bit17

可能无用位它是随机数0或者1这个需要注意

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20240129101951.webp)

> `下位机回复`：55 0C 02 51 13 13 4C 02 60 18 00 90 00 04 00 00 00 1E 00 07 10 00 09 00 00 1D 

下位机发送的只有19个字节数据



### 【开/关机命令】0x52

> `上位机发送`：55 02 0C 52 01 01 01 63

|  名称  | 长度（字节） |        说明        |
| :----: | :----------: | :----------------: |
| 开关机 |      1       | 0：开机<br>1：关机 |



> `下位机回复`：发送关机则直接关机

### 【电机校准】0x53

> `上位机发送`：55 02 0C 53 00 00 61





> `下位机回复`：55 0C 02 00 02 02 53 00 65(确认)

### 【姿态校准】0x54

> `上位机发送`：55 02 0C 54 01 01 00 64 

|  名称  | 长度（字节） |                 说明                  |
| :----: | :----------: | :-----------------------------------: |
| 校准项 |      1       | 0：所有<br>1：电机零角度<br>2：陀螺仪 |



> `下位机回复`：55 0C 02 00 02 02 54 00 66 (确认)

### 【姿态校准数据查询】0x55

> `上位机发送`：



> `下位机回复`：

### 【控制PID设置】0x56

这个是临时的，关机重启后失效，发送时x10000

> `上位机发送`：55 02 0C 56 12 12 10 27 20 4E 30 75 40 9C 50 C3 60 EA 70 11 80 38 91 5F 34 55 02 0C 51 00 00 5F 

|   名称    | 长度（字节） |  说明  |
| :-------: | :----------: | :----: |
|  Roll_KP  |      2       | x10000 |
|  Roll_KI  |      2       |  同上  |
|  Roll_KD  |      2       |  同上  |
| Pitch_KP  |      2       |  同上  |
| Pitch _KI |      2       |  同上  |
| Pitch _KD |      2       |  同上  |
|  Yaw_KP   |      2       |  同上  |
|  Yaw _KI  |      2       |  同上  |
|  Yaw _KD  |      2       |  同上  |



> `下位机回复`：55 0C 02 00 02 02 56 00 68

### 【控制PID 查询】0x57

> `上位机发送`：55 02 0C 57 00 00 65 

接收后需要除以10000

|   名称    | 长度（字节） |  说明  |
| :-------: | :----------: | :----: |
|  Roll_KP  |      2       | x10000 |
|  Roll_KI  |      2       |  同上  |
|  Roll_KD  |      2       |  同上  |
| Pitch_KP  |      2       |  同上  |
| Pitch _KI |      2       |  同上  |
| Pitch _KD |      2       |  同上  |
|  Yaw_KP   |      2       |  同上  |
|  Yaw _KI  |      2       |  同上  |
|  Yaw _KD  |      2       |  同上  |

> `下位机回复`：55 0C 02 57 12 12 DC 05 00 00 A0 00 E8 03 00 00 A0 00 E8 03 00 00 A0 00 20 

### 【加速度计(六面)校准】0x58

> `上位机发送`：55 02 0C 58 00 00 66 

|   名称   | 长度（字节） |                   说明                    |
| :------: | :----------: | :---------------------------------------: |
| 校准结果 |      1       | 0：校准完成<br>1：校准错误<br>2：校准超时 |
|  错误码  |      1       |                无错误时为0                |



> `下位机回复`：

### 【电机围栏检测】0x59

> `上位机发送`：





> `下位机回复`：

### 【空闲命令】0x60

> `上位机发送`：





> `下位机回复`：

### 【模式数据】0x61

摇杆控制的

> `上位机发送`：

|  名称   | 长度（字节） |                             说明                             |
| :-----: | :----------: | :----------------------------------------------------------: |
|   id    |      1       |                                                              |
|  mode   |      1       | Bit0,1：缺省<br>Bitt2,3：负载类型<br>Bit4：回头<br>Bit5：回中<br>Bit6,7：模式 |
| ctl_mod |      1       |       模式（替代mode字节中的模式字段，扩展了它的长度）       |
|   Yaw   |      1       |                   摇杆航向值,  `-64 ~ +64`                   |
|  Pitch  |      1       |                   摇杆俯仰值, `-64 ~ +64`                    |
|  Roll   |      1       |                   摇杆横滚值, `-64 ~ +64`                    |



> `下位机回复`：

### 【固件升级准备命令】0x71

> `上位机发送`：





> `下位机回复`：

### 【固件升级开始】0x72

> `上位机发送`：





> `下位机回复`：

### 【固件升级完成】0x74

> `上位机发送`：





> `下位机回复`：

### 【加密固件升级数据】0x75

> `上位机发送`：





> `下位机回复`：

### 【机架版本查询】0x76

> `上位机发送`：





> `下位机回复`：

### 【查询手柄剩余电量】0x81

> `上位机发送`：





> `下位机回复`：

### 【无】0x82

### 【无】0x83

### 【按钮事件】0x84

### 【无】0x85

### 【焦距设置】0x86

|  名称  | 长度（字节） |            说明            |
| :----: | :----------: | :------------------------: |
| 焦距值 |      1       | 1：增加焦距<br>2：减小焦距 |



### 【对焦设置】0x87

### 【无】0x88

### 【无】0x89

### 【查询按键板蓝牙mac地址】0x90

### 【无】0x91

### 【无】0x92

### 【无】0x93

### 【无】0x94

### 【霍尔值读取】0xA1

> `上位机发送`：55 02 0C A1 00 00 AF 

> `下位机回复`：55 0C 02 A1 0C 0C F6 04 78 09 6C 08 12 0B 1C 09 88 05 85 





## 新协议

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-19_10-21-07.webp)

### 升级

![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/PixPin_2024-02-19_10-23-42.webp)