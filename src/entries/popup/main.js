import Vue from "vue";
import App from "./App.vue";
import axios from "axios";
// 全局css样式
import "styl/scroll.css";
import "styl/reset.css";
import "styl/global.css";
// 注册图标
import Icon from "@/icon";

Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

Vue.component("RamblerIcon", Icon);

new Vue({
    render: h => h(App)
}).$mount("#app");
