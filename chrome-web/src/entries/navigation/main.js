import Vue from "vue";
import Navigation from "./navigation";
import store from "../../store";
import axios from "axios";
import "@/directives/drag";
import "@/directives/bubble";
// 全局css样式
import "styl/scroll.css";
import "styl/reset.css";
import "styl/global.css"; //全局样式表(重置某些样式)
import "./load-element";
import "animate.css";
import "@/assets/iconfont/iconfont.css";
// 注册图标
import SvgIcon from "@/icon";

Vue.prototype.$axios = axios;
Vue.prototype.$store = store;
Vue.config.productionTip = false;

/**
 * 公共组件
 */
Vue.component("RamblerIcon", SvgIcon);

new Vue({
    store,
    render: h => h(Navigation)
}).$mount("#app");
