<template>
    <div
        v-bubble
        class="page-container"
        :style="{
            backgroundImage: `url('${$store.getters.background}')`
        }"
    >
        <!-- 搜索 -->
        <div class="search" id="search-window">
            <rambler-search />
        </div>
        <!-- common bookmarks -->
        <div class="frequent-bookmarks" id="frequent-window">
            <frequent-bookmarks />
        </div>
        <!-- 侧边栏 -->
        <div class="fixed-sidebar" id="sidebar-window">
            <!-- 本地书签设置 -->
            <el-tooltip
                class="item"
                effect="dark"
                content="本地书签管理"
                placement="right"
            >
                <div class="box-item">
                    <div
                        class="icon-wrapper"
                        @click="open('bookmarkDialogVisible')"
                    >
                        <rambler-icon
                            name="bookmark"
                            class="icon"
                        ></rambler-icon>
                    </div>
                    <el-dialog
                        width="1000px"
                        title="本地书签管理"
                        :modal="false"
                        top="10vh"
                        :visible.sync="bookmarkDialogVisible"
                        :close-on-click-modal="false"
                        v-dialogDrag
                    >
                        <bookmark-setting></bookmark-setting>
                    </el-dialog>
                </div>
            </el-tooltip>
            <!-- 搜索引擎配置 -->
            <el-tooltip
                class="item"
                effect="dark"
                content="搜索引擎配置"
                placement="right"
            >
                <div class="box-item">
                    <div
                        class="icon-wrapper"
                        @click="open('engineDialogVisible')"
                    >
                        <rambler-icon name="engine" class="icon"></rambler-icon>
                    </div>
                    <el-dialog
                        width="1000px"
                        title="搜索引擎配置"
                        :modal="false"
                        top="10vh"
                        :visible.sync="engineDialogVisible"
                        :close-on-click-modal="false"
                        v-dialogDrag
                    >
                        <engine-setting></engine-setting>
                    </el-dialog>
                </div>
            </el-tooltip>
            <!-- 常用网站配置 -->
            <el-tooltip
                class="item"
                effect="dark"
                content="配置你常用的网站"
                placement="right"
            >
                <div class="box-item">
                    <div
                        class="icon-wrapper"
                        @click="open('frequentBookmarkDialogVisible')"
                    >
                        <rambler-icon
                            name="website"
                            class="icon"
                        ></rambler-icon>
                    </div>
                    <el-dialog
                        width="1000px"
                        title="常用网站配置"
                        :modal="false"
                        top="10vh"
                        :visible.sync="frequentBookmarkDialogVisible"
                        :close-on-click-modal="false"
                        v-dialogDrag
                    >
                        <frequent-bookmark-setting></frequent-bookmark-setting>
                    </el-dialog>
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
                        <rambler-icon name="skin" class="icon"></rambler-icon>
                    </div>
                    <el-dialog
                        width="1000px"
                        title="背景设置"
                        :modal="false"
                        top="10vh"
                        :visible.sync="skinDialogVisible"
                        :close-on-click-modal="false"
                        v-dialogDrag
                    >
                        <background-setting></background-setting>
                    </el-dialog>
                </div>
            </el-tooltip>
            <!-- 数据管理 -->
            <el-tooltip
                class="item"
                effect="dark"
                content="数据管理"
                placement="right"
            >
                <div class="box-item">
                    <div class="icon-wrapper" @click="open('dialogVisible')">
                        <rambler-icon
                            name="setting"
                            class="icon"
                        ></rambler-icon>
                    </div>
                    <el-dialog
                        width="700px"
                        title="数据管理"
                        :modal="false"
                        top="10vh"
                        :visible.sync="dialogVisible"
                        :close-on-click-modal="false"
                        v-dialogDrag
                    >
                        <data-manage></data-manage>
                    </el-dialog>
                </div>
            </el-tooltip>
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

                    <el-dialog
                        width="700px"
                        title="账户设置"
                        :modal="false"
                        top="10vh"
                        :visible.sync="accountDialogVisible"
                        :close-on-click-modal="false"
                        v-dialogDrag
                    >
                        <account-setting></account-setting>
                    </el-dialog>
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
                        <rambler-icon name="guide" class="icon"></rambler-icon>
                    </div>
                </div>
            </el-tooltip>
        </div>
        <div class="time">
            <time-flip></time-flip>
        </div>
    </div>
</template>

<script>
import TimeFlip from "./components/time-flip";
import Driver from "driver.js";
import "driver.js/dist/driver.min.css";
import { mapActions } from "vuex";
import { getToken } from "@/utils/token";
import DataManage from "./widgets/data-manage";
import BookmarkSetting from "./widgets/bookmark";
import frequentBookmarks from "./widgets/frequent-bookmarks";
import Search from "./widgets/search";
import { getBookmarks } from "@/api/modules/bookmark";
import { getTodos } from "@/api/modules/todo";
import EngineSetting from "./widgets/engine";
import FrequentBookmarkSetting from "./widgets/common-site";
import BackgroundSetting from "./widgets/background";
import AccountSetting from "./widgets/account";
export default {
    name: "IndexLayout",
    data() {
        return {
            dialogVisible: false,
            bookmarkDialogVisible: false,
            engineDialogVisible: false,
            frequentBookmarkDialogVisible: false,
            skinDialogVisible: false,
            accountDialogVisible: false,
            isLogin: false,
            driver: null
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
    components: {
        RamblerSearch: Search,
        frequentBookmarks: frequentBookmarks,
        DataManage: DataManage,
        BookmarkSetting: BookmarkSetting,
        EngineSetting: EngineSetting,
        FrequentBookmarkSetting: FrequentBookmarkSetting,
        BackgroundSetting: BackgroundSetting,
        AccountSetting: AccountSetting,
        TimeFlip: TimeFlip
    },
    methods: {
        ...mapActions("bookmark", ["updateRemoteBookmark", "updateBookmark"]),
        ...mapActions("todo", ["updateRemoteTodo"]),
        open(type) {
            this[type] = true;
        },
        // 请求远程数据(不缓存)
        loadRemoteData(token) {
            const promises = [
                getBookmarks(null, token.value),
                getTodos(null, token.value)
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
        loadLocalBookmark: function() {
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
                prevBtnText: "上一步"
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
                        offset: 0
                    }
                },
                {
                    element: "#frequent-window",
                    popover: {
                        title: "常用菜单导航",
                        description:
                            "方便快速访问常用网站, 可以在右侧进行添加和修改",
                        position: "bottom-center"
                    }
                },
                {
                    element: "#sidebar-window",
                    popover: {
                        title: "设置区域",
                        description:
                            "这里可以对整个插件进行配置, 鼠标悬停会有文字提示",
                        position: "left-center"
                    }
                }
            ]);
        },
        // 用户指引
        guide(e) {
            this.driver.start();
            this.$store.dispatch("setting/updateIsGuide");
            if (e) e.stopPropagation();
        }
    }
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
        width: 60px;
        height: 100%;
        position: fixed;
        right: 0;
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
}
</style>
