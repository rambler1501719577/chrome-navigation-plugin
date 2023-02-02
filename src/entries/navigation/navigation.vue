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
            >
                <rambler-button @click="clearData" type="danger"
                    >清空所有数据</rambler-button
                >
            </rambler-dialog>
            <rambler-dialog
                :index="101"
                :visible.sync="accountDialogVisible"
                name="accountSetting"
                title="账户设置"
                width="700px"
                height="220px"
                :draggable="true"
            >
                <account-setting></account-setting>
            </rambler-dialog>

            <!-- 侧边栏 -->
            <div class="fixed-sidebar" id="sidebar-window">
                <!-- 账户设置 -->
                <el-tooltip
                    class="item"
                    effect="dark"
                    content="账户设置"
                    placement="right"
                    v-if="isLogin"
                >
                    <div class="box-item">
                        <div
                            class="icon-wrapper"
                            @click="open('accountDialogVisible')"
                        >
                            <rambler-icon
                                name="account"
                                class="icon"
                            ></rambler-icon>
                        </div>
                    </div>
                </el-tooltip>
                <!-- 换肤 -->
                <el-tooltip
                    class="item"
                    effect="dark"
                    content="背景设置"
                    placement="right"
                >
                    <div class="box-item">
                        <div
                            class="icon-wrapper"
                            @click="open('skinDialogVisible')"
                        >
                            <rambler-icon
                                name="skin"
                                class="icon"
                            ></rambler-icon>
                        </div>
                    </div>
                </el-tooltip>
                <!-- 系统设置 -->
                <el-tooltip
                    class="item"
                    effect="dark"
                    content="系统设置"
                    placement="right"
                >
                    <div class="box-item">
                        <div
                            class="icon-wrapper"
                            @click="open('dialogVisible')"
                        >
                            <rambler-icon
                                name="setting"
                                class="icon"
                            ></rambler-icon>
                        </div>
                    </div>
                </el-tooltip>

                <el-tooltip
                    class="item"
                    effect="dark"
                    content="使用教程"
                    placement="right"
                >
                    <div class="box-item">
                        <div class="icon-wrapper" @click="guide">
                            <rambler-icon
                                name="guide"
                                class="icon"
                            ></rambler-icon>
                        </div>
                    </div>
                </el-tooltip>
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
                    <rambler-icon name="skin" class="icon"></rambler-icon>
                    <span>数据管理</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import "driver.js/dist/driver.min.css";
import Driver from "driver.js";
import { mapActions } from "vuex";
import { getToken, tokenExpires } from "@/utils/token";
import { getBookmarks } from "@/api/modules/bookmark";
import { getTodos } from "@/api/modules/todo";
import DynamicBackground from "./views/background";
import TimeFlip from "./components/time-flip";

import DataManage from "./views/data-manage/index";
import frequentBookmarks from "./views/frequent-website/list-front";
import Search from "./views/search-engine/search";

import BackgroundSetting from "./views/background/manage";
import AccountSetting from "./views/account";
export default {
    name: "IndexLayout",
    data() {
        return {
            dialogVisible: false,
            skinDialogVisible: false,
            accountDialogVisible: false,
            isLogin: false,
            driver: null,
            contextMenuShow: false,
            position: {
                left: 0,
                top: 0,
            },
            test2: true,
        };
    },
    async created() {
        const token = await getToken();
        if (token && token.value) {
            this.isLogin = true;
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
    },
    components: {
        DynamicBackground: DynamicBackground,
        RamblerSearch: Search,
        frequentBookmarks: frequentBookmarks,
        DataManage: DataManage,
        BackgroundSetting: BackgroundSetting,
        AccountSetting: AccountSetting,
        TimeFlip: TimeFlip,
    },
    methods: {
        ...mapActions("bookmark", ["updateRemoteBookmark", "updateBookmark"]),
        ...mapActions("todo", ["updateRemoteTodo"]),
        open(type) {
            this[type] = true;
        },
        clearData() {
            localStorage.clear();
            window.location.reload();
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
            const promises = [
                getBookmarks(null, token.value),
                getTodos(null, token.value),
            ];
            Promise.allSettled(promises).then(([bookmarkRes, todoRes]) => {
                if (
                    bookmarkRes.status == "fulfilled" &&
                    bookmarkRes.value.code == 200
                ) {
                    const bookmarks = bookmarkRes.value.data.records;
                    this.updateRemoteBookmark(bookmarks);
                    console.log(`已更新bookmarks, 共【${bookmarks.length}】条`);
                }
                if (
                    todoRes.status == "fulfilled" &&
                    todoRes.value.code == 200
                ) {
                    const todos = todoRes.value.data;
                    this.updateRemoteTodo(todos);
                    console.log(`已更新todos, 共【${todos.length}】条`);
                }
            });
        },
        loadLocalBookmark: function () {
            if (!chrome.bookmarks) {
                return console.log("请在chrome中调试本地书签");
            }
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
.page-container {
    box-sizing: border-box;
    height: 100vh;
    width: 100vw;
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    overflow-x: hidden;
    position: relative;
    .content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100vh;
        z-index: 20;
        overflow: hidden;
        .search {
            max-width: 60%;
            margin: 30px auto;
            padding: 5px;
        }
        .frequent-bookmarks {
            width: 80%;
            margin: 0 auto;
        }
        .fixed-sidebar {
            padding-top: 15px;
            width: 60px;
            height: 100%;
            position: fixed;
            left: 0;
            top: 0;
            background: #00000954;

            .box-item {
                width: 100%;
                height: 60px;
                cursor: pointer;
                .icon-wrapper {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                &:hover .icon {
                    transform: scale(1.3);
                }
            }

            .icon {
                width: 30px;
                height: 30px;
                fill: rgb(234, 224, 224);
                cursor: pointer;
                margin-bottom: 8px;
                transition: all 0.3s;
            }
            .affix-icon {
                width: 30px;
                height: 30px;
                fill: #ddd;
                cursor: pointer;
                transition: all 0.7s;

                &:hover {
                    transform: rotate(270deg);
                }
            }
        }
        .time {
            position: absolute;
            right: 60px;
            bottom: 60px;
        }
    }
    .dy-background {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 10;
        width: 100%;
        height: 100vh;
        overflow: hidden;
    }
    .popup {
        position: absolute;
        z-index: 9999;
        width: 160px;
        background: #fff;
        box-shadow: 0 2px 2px #333;
        ul {
            width: 100%;
            list-style: none;
            li {
                height: 40px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding: 0 0 0 8px;
                font-weight: 300;
                font-size: 14px;
                cursor: pointer;
                .icon {
                    fill: #333;
                    margin-right: 4px;
                }
                &:hover {
                    background: #eee;
                }
            }
        }
    }
}
</style>
