﻿newYearTimer = null;
var newYear = () => {
    clearTimeout(newYearTimer);
    if (!document.querySelector('#newYear')) return;
    // 插本时间戳 and 星期对象 2024-04-15 08:00:00
    let newYear = new Date('4/15/2024 8:00:00').getTime() / 1000,
        week = { 0: '周日', 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六' }
    time();

    // 补零函数
    function nol(h) { return h > 9 ? h : '0' + h; };

    function time() {
        // 现在 时间对象
        let now = new Date();

        // 右下角 今天
        document.querySelector('#newYear .today').innerHTML = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + week[now.getDay()]

        // 现在与新年相差秒数
        let second = newYear - Math.round(now.getTime() / 1000);

        // 小于0则表示时间到了
        if (second < 0) {
            document.querySelector('#newYear .title').innerHTML = 'Lucky Day!';
            document.querySelector('#newYear .newYear-time').innerHTML = '<span class="happyNewYear">重在参与</p>';
        } else {
            // 大于0则时间还没到
            document.querySelector('#newYear .title').innerHTML = '距离2024毕业剩余：'

            // 大于一天则直接渲染天数
            if (second > 86400) {
                document.querySelector('#newYear .newYear-time').innerHTML = `<span class="day">${Math.ceil(second / 86400)}<span class="unit">天</span></span>`
            } else {
                // 小于一天则使用时分秒计时。
                let h = nol(parseInt(second / 3600));
                second %= 3600;
                let m = nol(parseInt(second / 60));
                second %= 60;
                let s = nol(second);
                document.querySelector('#newYear .newYear-time').innerHTML = `<span class="time">${h}:${m}:${s}</span></span>`;
                // 计时
                newYearTimer = setTimeout(time, 1000);
            }
        }
    }
}
// Pjax适配：若没有开启Pjax这里直接是newYear()即可
// 开了Pjax的用以下两句
document.addEventListener('pjax:complete', newYear);
document.addEventListener('DOMContentLoaded', newYear);