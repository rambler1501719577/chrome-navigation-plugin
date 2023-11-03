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
        <transition
            name="custom-classes-transition"
            enter-active-class="rambler__animated fadeInRight"
            leave-active-class="rambler__animated fadeOut"
        >
            <div
                class="popup global-popup-container"
                v-show="contextMenuShow"
                :style="{
                    left: position.left + 'px',
                    top: position.top + 'px',
                }"
            >
                <div
                    class="contextmenu-item"
                    is-single="true"
                    @click="openDialog('skin')"
                >
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
                    <li @click.stop="doNothing">
                        <rambler-icon
                            name="setting"
                            class="prefix-icon"
                        ></rambler-icon>
                        <span>撤销删除</span>
                        <rambler-icon
                            name="back"
                            class="suffix-icon icon-flip"
                        ></rambler-icon>
                    </li>
                    <transition
                        name="custom-classes-transition"
                        enter-active-class="rambler__animated fadeInRight"
                        leave-active-class="rambler__animated fadeOut"
                    >
                        <div
                            class="local-secondary-contextmenu-container"
                            v-show="showSecondMenu"
                            :style="secondMenuStyle"
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
                    </transition>
                </div>
            </div>
        </transition>

        <!-- 所有的弹窗组件 -->
        <notification></notification>
    </div>
</template>

<script>
// 弹出窗口子元素宽高
const popupMenuItemHeight = 30;
const popupMenuItemWidth = 160;
const popupMenuPadding = 8;
import { mapActions, mapState } from "vuex";
import { getRefreshToken } from "@/utils/token";
import { loadCloudData } from "@/api/modules/index";
export default {
    name: "IndexLayout",
    data() {
        return {
            dialogVisible: false,
            contextMenuShow: false,
            position: {
                left: 0,
                top: 0,
            },
            showSecondMenu: false,
            secondMenuStyle: {},
        };
    },
    computed: {
        ...mapState("layout", {
            hideItems: (state) => state.widgets.filter((v) => !v.show),
        }),
    },
    async mounted() {
        // 加载本地书签
        this.loadLocalBookmark();
    },
    mounted() {
        // 这个组件主要用来处理账户数据等操作
        // 由于用户信息已经做了持久化, 登录后除非手动删除不会消失
        // 因此登录过期的唯一可能在于replaceToken
        try {
            const token = getRefreshToken();
            if (!token) {
                throw new Error("refresh_token过期, 用户客户端登录过期");
            }
            // load remote settings and data
            this.loadRemoteData();
        } catch (e) {
            this.$store.dispatch("user/clearUserInfo");
            console.log("用户客户端登录过期, 清空用户信息成功");
            this.$store.dispatch("layout/reset");
            console.log("重置layout -> widgets");
            this.$ramblerNotification.warn("登录信息已过期, 请重新登录");
        }
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
        ...mapActions("bookmark", ["updateBookmark"]),
        ...mapActions("layout", ["setWidgets", "revokeWidget"]),
        ...mapActions("todo", ["updateRemoteTodo"]),
        ...mapActions("engine", ["setEngines"]),
        doNothing() {},
        // 通过事件总线发送事件, 弹出layout中的弹窗
        openDialog(type) {
            this.$event.$emit("openDialog", type);
        },
        // 显示桌面右键二级菜单
        showSecondCtxMenu() {
            // 初始定义secondMenuStyle是一个空对象, 所以需要 $set和 $delete来强制更新视图
            // 二级菜单高度
            const secondMenuHeight =
                this.hideItems.length * popupMenuItemHeight +
                popupMenuPadding * 2;
            const viewPortWidth = document.documentElement.clientWidth;
            const viewportHeight = document.documentElement.clientHeight;
            // 一级弹窗和二级弹窗加起来都不超过可视窗口宽度, 可以在右侧展开二级菜单
            if (this.position.left + popupMenuItemWidth * 2 >= viewPortWidth) {
                this.$delete(this.secondMenuStyle, "left");
                this.$set(this.secondMenuStyle, "right", "100%");
            } else {
                this.$delete(this.secondMenuStyle, "right");
                this.$set(this.secondMenuStyle, "left", "100%");
            }
            // 只有当二级菜单顶部展开会被遮挡才从底部展开, 其他情况下从顶部展开,也就是 top:0
            const contextMenuHeight =
                document.querySelectorAll(".popup>.contextmenu-item").length *
                    popupMenuItemHeight +
                popupMenuPadding * 2;
            if (
                (this.position.top > secondMenuHeight &&
                    secondMenuHeight + contextMenuHeight <= this.top) ||
                this.position.top + contextMenuHeight + secondMenuHeight >=
                    viewportHeight
            ) {
                this.$delete(this.secondMenuStyle, "top");
                this.$set(this.secondMenuStyle, "bottom", "0");
            } else {
                this.$delete(this.secondMenuStyle, "bottom");
                this.$set(this.secondMenuStyle, "top", "0");
            }
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
            // 高度非固定，通过子节点个数 × 子节点高度获得
            const contextMenuHeight =
                document.querySelectorAll(".popup>.contextmenu-item").length *
                    popupMenuItemHeight +
                popupMenuPadding * 2;
            const contextMenuWidth = popupMenuItemWidth;
            // 视口宽高
            const viewPortWidth = document.documentElement.clientWidth;
            const viewportHeight = document.documentElement.clientHeight;
            const heightGap = viewportHeight - contextMenuHeight;
            this.contextMenuShow = true;
            const { pageX, pageY } = e;
            if (pageX + contextMenuWidth >= viewPortWidth) {
                this.position.left = viewPortWidth - contextMenuWidth;
            } else {
                this.position.left = pageX;
            }
            if (pageY >= heightGap) {
                this.position.top = heightGap;
            } else {
                this.position.top = pageY;
            }
        },
        // 请求远程数据
        loadRemoteData() {
            loadCloudData()
                .then((result) => {
                    const { bookmarks, engines } = result;
                    this.setWidgets(bookmarks);
                    this.setEngines(engines);
                    // this.updateRemoteTodo(todos);
                    this.$ramblerNotification.success("成功同步云端数据");
                })
                .catch((errMsg) => {
                    this.$ramblerNotification.danger(errMsg);
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
        .local-secondary-contextmenu-container {
            position: absolute;
            background-color: #2c2c2c;
            width: 160px;
            border-radius: 8px;
            padding: 8px;
        }
    }
}
</style>
