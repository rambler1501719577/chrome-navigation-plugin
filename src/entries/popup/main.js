import Vue from "vue";
import App from "./App.vue";
// 全局css样式
import "styl/scroll.css";
import "styl/reset.css";
import "styl/global.css";
// 注册图标
import Icon from "@/icon";

Vue.config.productionTip = false;
import "./load-element";

Vue.component("RamblerIcon", Icon);

new Vue({
    render: h => h(App)
}).$mount("#app");
