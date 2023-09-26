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
            class="popup global-popup-container"
            v-show="contextMenuShow"
            :style="{
                left: position.left + 'px',
                top: position.top + 'px',
            }"
        >
            <div class="contextmenu-item" is-single="true">
                <li>
                    <rambler-icon
                        name="skin"
                        class="prefix-icon"
                    ></rambler-icon>
                    <span>更换背景</span>
                </li>
            </div>
            <div class="contextmenu-item" is-single="true">
                <li>
                    <rambler-icon
                        name="setting"
                        class="prefix-icon"
                    ></rambler-icon>
                    <span>系统设置</span>
                </li>
            </div>
            <div
                class="contextmenu-item"
                is-single="true"
                @mouseenter="showSecondCtxMenu"
                @mouseleave="hideSecondCtxMenu"
            >
                <li>
                    <rambler-icon
                        name="setting"
                        class="prefix-icon"
                    ></rambler-icon>
                    <span>撤销隐藏</span>
                    <rambler-icon
                        name="back"
                        class="suffix-icon icon-flip"
                    ></rambler-icon>
                </li>
                <div
                    class="secondary-contextmenu-container"
                    v-show="showSecondMenu"
                >
                    <div
                        v-if="hideItems.length == 0"
                        class="contextmenu-item"
                        is-single="true"
                    >
                        <li>
                            <rambler-icon
                                name="skin"
                                class="prefix-icon"
                            ></rambler-icon>
                            <span>空</span>
                        </li>
                    </div>
                    <div
                        class="contextmenu-item"
                        is-single="true"
                        v-for="item of hideItems"
                        v-else
                        :key="item.id"
                        @click.stop="revokeDeleteWidget(item)"
                    >
                        <li>
                            <rambler-icon
                                name="skin"
                                class="prefix-icon"
                            ></rambler-icon>
                            <span>{{ item.title }}</span>
                        </li>
                    </div>
                </div>
            </div>
        </div>

        <!-- 所有的弹窗组件 -->
        <notification></notification>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
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
            showSecondMenu: false,
        };
    },
    computed: {
        ...mapState("layout", {
            hideItems: (state) => state.widgets.filter((v) => !v.show),
        }),
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
            this.$store.dispatch("user/clearUserInfo");
            console.log("已清除用户数据");
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
        ...mapActions("layout", ["setWidgets", "revokeWidget"]),
        ...mapActions("todo", ["updateRemoteTodo"]),
        // 显示桌面右键二级菜单
        showSecondCtxMenu() {
            this.showSecondMenu = true;
        },
        hideSecondCtxMenu() {
            this.showSecondMenu = false;
        },
        revokeDeleteWidget(item) {
            this.revokeWidget(item)
                .then(() => {
                    this.$ramblerNotification.success("撤销成功");
                })
                .catch((err) => {
                    this.$ramblerNotification.success(err);
                });
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
                const { bookmarks } = result;
                this.setWidgets(bookmarks);
                // this.updateRemoteTodo(todos);
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
.page-container {
    box-sizing: border-box;
    height: 100vh;
    width: 100vw;
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    overflow-x: hidden;
    position: relative;

    .dy-background {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 10;
        width: 100%;
        height: 100vh;
        overflow: hidden;
    }

    .content {
        height: 100vh;
        width: 100vw;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 11;
        overflow: hidden;
    }

    .popup {
        position: absolute;
        z-index: 9999;
        width: 160px;
        box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08),
            0 3px 6px -4px rgba(0, 0, 0, 0.12),
            0 9px 28px 8px rgba(0, 0, 0, 0.05);
    }
}
</style>
