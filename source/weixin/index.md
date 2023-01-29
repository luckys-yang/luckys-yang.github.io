---
title: weixin
date: 2023-01-21 16:07:28
layout: false
---

{% raw %}
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/butterfly/blog_other/wechat111.ico" type="image/x-icon"><!-- 替换自己的图标 -->
    <title>wechat</title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }
        
        body {
            background-color: #888;
        }
        
        .card {
            width: fit-content;
            margin: 20vh auto 0;
            padding: 1rem;
            overflow: hidden;
            transition: 0.5s;
            border-radius: 15px;
            background-color: white;
            box-shadow: 0px 0px 8px 0 rgb(39 193 197 / 77%);
            text-align: center;
        }
        
        .card:hover {
            box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.3);
        }
        
        .top {
            display: flex;
        }
        
        .logo {
            width: 70px;
            height: 70px;
        }
        
        .logo img {
            border-radius: 10px;
            width: 100%;
        }
        
        .info {
            text-align: left;
            font-size: 1.2rem;
            padding: 10px
        }
        
        .info>div img {
            height: 1rem;
        }
        
        .text,
        .info>span {
            font-size: 14px;
            font-size: 15px;
            color: #888;
        }
        
        .QRcode {
            margin-top: 1rem;
            height: 350px;
            width: 350px;
        }
        
        .QRcode img {
            width: 100%;
        }
        
        @media (max-width:479px) {
            .QRcode {
                height: auto;
                width: 100%;
            }
            .card {
                margin-top: 13vh;
                width: 80%;
            }
        }
    </style>
</head>

<body>
    <div class="card">
        <div class="top">
            <div class="logo">
                <img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/butterfly/blog_other/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20230121163443.webp" alt="头像">
            </div>
            <div class="info">
                <div>
                    <span>Luckys.</span>
                    <img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/butterfly/blog_other/man.webp"><br>
                </div>
                <span>广东 江门</span>
            </div>
        </div>

        <div class="QRcode">
            <img src="https://image-1309791158.cos.ap-guangzhou.myqcloud.com/butterfly/blog_other/QQ%E6%88%AA%E5%9B%BE20230121163946.webp" alt="二维码">
        </div>
        <p class="text">扫一扫上面的二维码图案，加我微信</p>
    </div>
</body>

</html>
{% endraw %}