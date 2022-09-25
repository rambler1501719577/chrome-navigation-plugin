import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
// 全局css样式
import "styl/scroll.css";
import "styl/reset.css";
import "styl/global.css"; //全局样式表(重置某些样式)
// animated动画库
import "animate.css/animate.min.css";
// 注册图标
import Icon from "@/icon";

Vue.prototype.$axios = axios;
Vue.prototype.$store = store;
Vue.config.productionTip = false;

/**
 * 消息提示框
 */
import { message } from "./utils/index";
Vue.prototype.$message = message;

/**
 * html去掉标签过滤器
 */
Vue.filter("html2Text", str => {
    return str.replace(/<[^>]+>/g, "");
});

Vue.filter("timeToDistance", time => {
    let date = new Date(time);
    let now = new Date();
    // 差多少秒
    let timeBetween = parseInt((now.getTime() - date.getTime()) / 1000);
    if (timeBetween <= 0) {
        return "刚刚";
    }
    const minuteTime = 60,
        hourTime = 3600,
        dayTime = 86400,
        monthTime = 2592000,
        yearTime = 31104000;
    // 距离现在多少秒
    if (timeBetween < minuteTime) {
        return `${timeBetween} 秒前`;
    } else if (timeBetween < hourTime) {
        return `${parseInt(timeBetween / minuteTime)} 分钟前`;
    } else if (timeBetween < dayTime) {
        return `${parseInt(timeBetween / hourTime)} 小时前`;
    } else if (timeBetween < monthTime) {
        return `${parseInt(timeBetween / dayTime)} 天前`;
    } else if (timeBetween < yearTime) {
        return `${parseInt(timeBetween / monthTime)} 月前`;
    } else {
        return `${parseInt(timeBetween / yearTime)} 年前`;
    }
});

/**
 * 公共组件
 */
import RamblerTag from "@/components/widget/RamblerTag";
Vue.component("RamblerTag", RamblerTag);

import RamblerArticleList from "@/components/Article";
Vue.component("RamblerArticleList", RamblerArticleList);

Vue.component("RamblerIcon", Icon);
/**
 * 时间过滤器
 * 参数格式为：{y}-{m}-{d} {h}:{i}:{s}
 */
Vue.filter("timeFormat", (time, cFormat) => {
    const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
    let date;
    if (typeof time === "object") {
        date = time;
    } else {
        if (typeof time === "string" && /^[0-9]+$/.test(time)) {
            time = parseInt(time);
        }
        if (typeof time === "number" && time.toString().length === 10) {
            time = time * 1000;
        }
        date = new Date(time);
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    };
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key];
        // Note: getDay() returns 0 on Sunday
        if (key === "a") {
            return ["日", "一", "二", "三", "四", "五", "六"][value];
        }
        return value.toString().padStart(2, "0");
    });
    return time_str;
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
