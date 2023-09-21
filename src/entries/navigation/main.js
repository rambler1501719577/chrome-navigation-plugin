import Vue from "vue";
import App from "./App";
import store from "../../store";
import axios from "axios";
import "@/directives/drag";
import "@/directives/bubble";
import ElementUI from "element-ui";
import Filters from "@/filters";
import RamblerNotification from "@/components/notification";
import { event } from "./event";

// 全局css样式
import "styl/scroll.css";
import "styl/reset.css";
import "styl/global.css"; //全局样式表(重置某些样式)

import "animate.css";
import "@/assets/iconfont/iconfont.css";
import "element-ui/lib/theme-chalk/index.css";
// 注册图标
import SvgIcon from "@/icon";
// import Favicon from "./components/favicon";
import Favicon from "@/components/favicon";
import RamblerDialog from "@/components/dialog/RamblerDialog";
import RamblerButton from "@/components/button";
import RamblerAlert from "@/components/alert";
import RamblerInput from "@/components/input";

Vue.use(ElementUI);
Vue.use(RamblerNotification, { name: "ramblerNotification" });
Vue.prototype.$ramblerNotification({ title: "title", message: "message" });
Vue.prototype.$axios = axios;
Vue.prototype.$store = store;
Vue.prototype.$event = event;
Vue.config.productionTip = false;

/**
 * 公共组件
 */
Vue.component("RamblerIcon", SvgIcon);
Vue.component("Favicon", Favicon);
Vue.component("RamblerDialog", RamblerDialog);
Vue.component("RamblerButton", RamblerButton);
Vue.component("RamblerAlert", RamblerAlert);
Vue.component("RamblerInput", RamblerInput);

// 注册过滤器
Object.keys(Filters).forEach((key) => Vue.filter(key, Filters[key]));

new Vue({
    store,
    render: (h) => h(App),
}).$mount("#app");
