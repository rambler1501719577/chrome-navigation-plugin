import NotificationComponent from "./index.vue";
import { event } from "./event";
import { v4 } from "uuid";
const RamblerNotification = {
    // this will be called when user call Vue.user()
    install(Vue, args = {}) {
        if (this.installed) {
            return;
        }
        // 调整参数
        if (!args.name) args.name = "Rambler-Notification";
        console.log(`【${args.name}】组件注册成功`);
        // 保证注册一次
        this.installed = true;
        // 真正的方法 params {type: String, title: String, message: String|Node}
        const notify = (params) => {
            params.id = v4();
            event.$emit("add", params);
        };
        // 绑定别名函数
        ["success", "danger", "warn", "info"].forEach((alias) => {
            notify[alias] = (message) => {
                notify({
                    type: alias,
                    message,
                });
            };
        });
        // 注册组件
        Vue.component(args.name, RamblerNotification);
        Vue.component("Notification", NotificationComponent);
        Vue.prototype[`$${args.name}`] = notify;
        window[`$${args.name}`] = notify;
    },
};
// 提供install方法
export default RamblerNotification;
