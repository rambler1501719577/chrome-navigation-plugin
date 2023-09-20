<template>
    <div class="layout-container">
        <!-- 侧边栏 -->
        <div class="fixed-sidebar" id="sidebar-window">
            <user-center></user-center>
            <!-- 换肤 -->
            <div class="box-item">
                <div class="icon-wrapper" @click="open('skinDialogVisible')">
                    <rambler-icon name="skin" class="icon"></rambler-icon>
                </div>
            </div>
            <!-- 系统设置 -->
            <div class="box-item">
                <div class="icon-wrapper" @click="open('dialogVisible')">
                    <rambler-icon name="setting" class="icon"></rambler-icon>
                </div>
            </div>

            <div class="box-item">
                <div class="icon-wrapper" @click="open('noteDialogVisible')">
                    <rambler-icon name="note" class="icon"></rambler-icon>
                </div>
            </div>
        </div>

        <div class="right-content">
            <!-- 搜索 -->
            <div class="search" id="search-window">
                <rambler-search />
            </div>
            <!-- common bookmarks -->
            <div class="grid-list-container" id="frequent-window">
                <grid-component-list></grid-component-list>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from "vuex";
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
    mounted() {
        // 监听各个组件发送的事件
        this.$event.$on("guide", this.guide);
        this.$event.$on("dialog", (payload) => {
            this.open(payload);
        });
    },
    components: {
        RamblerSearch: () => import("../views/search-engine/search"),
        TimeFlip: () => import("../widgets/time-flip"),
        LogManage: () => import("../views/log"),
        GridComponentList: () => import("./components/grid-list.vue"),
        UserCenter: () => import("./sidebar/user-center.vue"),
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
    },
};
</script>
<style scoped lang="less">
@import url("./style.less");
</style>
