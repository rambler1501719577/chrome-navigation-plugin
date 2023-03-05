<template>
    <div
        v-bubble="'heart'"
        class="page-container"
        :style="{
            backgroundImage: `url('${$store.getters.background}')`,
        }"
    >
        <div class="content">
            <!-- 搜索 -->
            <div class="search" id="search-window">
                <rambler-search />
            </div>
            <!-- common bookmarks -->
            <div class="frequent-bookmarks" id="frequent-window">
                <frequent-bookmarks />
            </div>
            <rambler-dialog
                :visible.sync="skinDialogVisible"
                name="backgroundSetting"
                title="背景设置"
                width="800px"
                height="520px"
                :draggable="true"
                :appendToBody="true"
            >
                <background-setting></background-setting>
            </rambler-dialog>

            <rambler-dialog
                :visible.sync="dialogVisible"
                name="dataManage"
                title="系统设置"
                width="700px"
                height="500px"
                :draggable="true"
                :appendToBody="true"
            >
                <system-setting></system-setting>
            </rambler-dialog>

            <rambler-dialog
                :visible.sync="noteDialogVisible"
                name="dataManage"
                title="日志管理（内部使用）"
                width="700px"
                height="335px"
                :draggable="true"
                :appendToBody="true"
            >
                <log-manage></log-manage>
            </rambler-dialog>

            <!-- 侧边栏 -->
            <div class="fixed-sidebar" id="sidebar-window">
                <!-- 换肤 -->
                <div class="box-item">
                    <div
                        class="icon-wrapper"
                        @click="open('skinDialogVisible')"
                    >
                        <rambler-icon name="skin" class="icon"></rambler-icon>
                    </div>
                </div>
                <!-- 系统设置 -->
                <div class="box-item">
                    <div class="icon-wrapper" @click="open('dialogVisible')">
                        <rambler-icon
                            name="setting"
                            class="icon"
                        ></rambler-icon>
                    </div>
                </div>

                <div class="box-item">
                    <div class="icon-wrapper" @click="guide">
                        <rambler-icon name="guide" class="icon"></rambler-icon>
                    </div>
                </div>

                <div class="box-item">
                    <div
                        class="icon-wrapper"
                        @click="open('noteDialogVisible')"
                    >
                        <rambler-icon name="note" class="icon"></rambler-icon>
                    </div>
                </div>
            </div>

            <div class="time">
                <time-flip></time-flip>
            </div>
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
                <li @click="open('skinDialogVisible')">
                    <rambler-icon name="skin" class="icon"></rambler-icon>
                    <span>切换背景</span>
                </li>
                <li @click="open('dialogVisible')">
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
import { event } from "../event";
import "driver.js/dist/driver.min.css";
import Driver from "driver.js";
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
        // 定义指引步骤
        this.defineSteps();
        if (!this.$store.getters.isGuide) {
            this.guide();
        }
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
        // 监听各个组件发送的事件
        event.$on("guide", this.guide);
        event.$on("dialog", (payload) => {
            this.open(payload);
        });
    },
    components: {
        DynamicBackground: () => import("../views/background"),
        RamblerSearch: () => import("../views/search-engine/search"),
        frequentBookmarks: () => import("../views/frequent-website/list-front"),
        DataManage: () => import("../views/data-manage/index"),
        BackgroundSetting: () => import("../views/background/manage"),
        TimeFlip: () => import("../widgets/time-flip"),
        SystemSetting: () => import("../views/system-setting/index"),
        LogManage: () => import("../views/log"),
    },
    methods: {
        ...mapActions("bookmark", ["updateRemoteBookmark", "updateBookmark"]),
        ...mapActions("todo", ["updateRemoteTodo"]),
        open(type) {
            this[type] = true;
        },
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
        defineSteps() {
            this.driver = new Driver({
                padding: 0,
                doneBtnText: "完成",
                closeBtnText: "关闭",
                nextBtnText: "下一步", // Next button text for this step
                prevBtnText: "上一步",
            });
            this.driver.defineSteps([
                {
                    element: "#search-window",
                    popover: {
                        className: "first-step-popover-class",
                        title: "搜索模块",
                        description:
                            "将在【书签】【历史记录】中进行检索, 可以使用上下箭头切换结果并使用回车跳转, 上方可以切换不同搜索引擎",
                        position: "bottom-center",
                        offset: 0,
                    },
                },
                {
                    element: "#frequent-window",
                    popover: {
                        title: "常用菜单导航",
                        description:
                            "方便快速访问常用网站, 可以在右侧进行添加和修改",
                        position: "bottom-center",
                    },
                },
                // {
                //     element: "#sidebar-window",
                //     popover: {
                //         title: "设置区域",
                //         description:
                //             "这里可以对整个插件进行配置, 鼠标悬停会有文字提示",
                //         position: "left-center"
                //     }
                // }
            ]);
        },
        // 用户指引
        guide(e) {
            this.contextMenuShow = false;
            this.$nextTick(() => {
                this.driver.start();
                this.$store.dispatch("setting/updateIsGuide");
                if (e) e.stopPropagation();
            });
        },
    },
};
</script>
<style scoped lang="less">
@import url("./style.less");
</style>
