<template>
    <div
        v-bubble="'heart'"
        class="page-container"
        :style="{
            backgroundImage: `url('${$store.getters.background}')`,
        }"
    >
        <div class="content">
            <!-- grid布局 -->
            <grid-component></grid-component>
        </div>
        <!-- 动态背景 -->
        <div class="dy-background">
            <dynamic-background></dynamic-background>
        </div>

        <!-- 鼠标右键 -->
        <div
            class="popup"
            v-show="contextMenuShow"
            :style="{
                left: position.left + 'px',
                top: position.top + 'px',
            }"
        >
            <ul>
                <li @click="execute('skinDialogVisible')">
                    <rambler-icon name="skin" class="icon"></rambler-icon>
                    <span>切换背景</span>
                </li>
                <li @click="execute('dialogVisible')">
                    <rambler-icon name="setting" class="icon"></rambler-icon>
                    <span>系统设置</span>
                </li>
            </ul>
        </div>

        <!-- 所有的弹窗组件 -->
        <notification></notification>
    </div>
</template>

<script>
import { mapActions } from "vuex";
import { getToken } from "@/utils/token";
import { loadCloudData } from "@/api/modules/index";
export default {
    name: "IndexLayout",
    data() {
        return {
            dialogVisible: false,
            skinDialogVisible: false,
            driver: null,
            contextMenuShow: false,
            noteDialogVisible: false,
            position: {
                left: 0,
                top: 0,
            },
        };
    },
    async created() {
        // 这个组件主要用来处理账户数据等操作
        const token = await getToken();
        if (token && token.value) {
            // 获取和现在相差时间毫秒数
            const time = token.expirationDate * 1000 - new Date().getTime();
            const hours = (time / 1000 / 60 / 60).toFixed(2);
            console.log(`获取用户信息成功, token ${hours} 小时后失效`);
            // load remote settings and data
            this.loadRemoteData(token);
        } else {
            console.log("未登录或token已过期");
        }
        // 加载本地书签
        this.loadLocalBookmark();
    },
    mounted() {
        this.$nextTick(() => {
            this.$el.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                this.showContextMenu(e);
            });
            window.addEventListener("click", (e) => {
                this.contextMenuShow = false;
            });
        });
    },
    components: {
        DynamicBackground: () => import("./background"),
        GridComponent: () => import("./layout"),
    },
    methods: {
        ...mapActions("bookmark", ["updateRemoteBookmark", "updateBookmark"]),
        ...mapActions("todo", ["updateRemoteTodo"]),
        showContextMenu(e) {
            const contextMenu = document.querySelector(".popup");
            // 高度非固定，通过子节点个数 × 子节点高度获得
            const contextMenuHeight =
                contextMenu.querySelectorAll("li").length * 40;
            const viewportHeight =
                document.documentElement.clientHeight ||
                document.body.clientHeight;
            const heightGap = viewportHeight - contextMenuHeight;
            this.contextMenuShow = true;
            const { pageX, pageY } = e;
            this.position.left = pageX;
            this.position.top = pageY > heightGap ? heightGap : pageY;
        },
        // 请求远程数据(不缓存)
        loadRemoteData(token) {
            loadCloudData(token.value).then((result) => {
                const { bookmarks, todos } = result;
                this.updateRemoteBookmark(bookmarks);
                this.updateRemoteTodo(todos);
                this.$ramblerNotification.success("成功同步云端数据");
            });
        },
        loadLocalBookmark: function () {
            this.updateBookmark();
        },
        // 通过事件总线触发事件
        execute(dialogName) {
            this.$event.$emit("dialog", dialogName);
        },
    },
};
</script>
<style scoped lang="less">
@import url("./style/style.less");
</style>
