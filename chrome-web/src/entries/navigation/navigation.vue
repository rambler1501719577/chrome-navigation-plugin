<template>
    <div class="page-container">
        <!-- 搜索 -->
        <div class="search">
            <rambler-search />
        </div>
        <!-- common bookmarks -->
        <div class="frequent-bookmarks">
            <frequent-bookmarks />
        </div>
        <!-- 侧边栏 -->
        <div class="fixed-sidebar">
            <!-- 本地书签设置 -->
            <el-tooltip
                class="item"
                effect="dark"
                content="本地书签管理"
                placement="right"
            >
                <div class="box-item">
                    <rambler-icon
                        @click.native="open('bookmarkDialogVisible')"
                        name="bookmark"
                        class="icon"
                    ></rambler-icon>
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
                    <rambler-icon
                        @click.native="open('engineDialogVisible')"
                        name="engine"
                        class="icon"
                    ></rambler-icon>
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
                    <rambler-icon
                        @click.native="open('frequentBookmarkDialogVisible')"
                        name="website"
                        class="icon"
                    ></rambler-icon>
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
            <!-- 数据管理 -->
            <el-tooltip
                class="item"
                effect="dark"
                content="背景设置"
                placement="right"
            >
                <div class="box-item">
                    <rambler-icon
                        @click.native="open('skinDialogVisible')"
                        name="skin"
                        class="icon"
                    ></rambler-icon>
                    <el-dialog
                        width="700px"
                        title="背景设置"
                        :modal="false"
                        top="10vh"
                        :visible.sync="skinDialogVisible"
                        :close-on-click-modal="false"
                        v-dialogDrag
                    >
                        <h1>下载背景图, 更新vuex</h1>
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
                    <rambler-icon
                        @click.native="open('dialogVisible')"
                        name="setting"
                        class="icon"
                    ></rambler-icon>
                    <el-dialog
                        width="700px"
                        title="数据管理"
                        :modal="false"
                        top="10vh"
                        :visible.sync="dialogVisible"
                        :close-on-click-modal="false"
                        v-dialogDrag
                    >
                        <rambler-setting></rambler-setting>
                    </el-dialog>
                </div>
            </el-tooltip>
        </div>
    </div>
</template>

<script>
import { mapActions } from "vuex";
import { getToken } from "@/utils/token";
import Setting from "./settings/index";
import BookmarkSetting from "./widgets/bookmark";
import frequentBookmarks from "./widgets/frequent-bookmarks";
import Search from "./widgets/search";
import { getBookmarks } from "@/api/modules/bookmark";
import { getTodos } from "@/api/modules/todo";
import EngineSetting from "./widgets/engine";
import FrequentBookmarkSetting from "./widgets/common-site";
export default {
    name: "IndexLayout",
    data() {
        return {
            dialogVisible: false,
            bookmarkDialogVisible: false,
            engineDialogVisible: false,
            frequentBookmarkDialogVisible: false,
            skinDialogVisible: false
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
    },
    components: {
        RamblerSearch: Search,
        frequentBookmarks: frequentBookmarks,
        RamblerSetting: Setting,
        BookmarkSetting: BookmarkSetting,
        EngineSetting: EngineSetting,
        FrequentBookmarkSetting
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
        }
    }
};
</script>
<style scoped lang="less">
.page-container {
    box-sizing: border-box;
    height: 100vh;
    width: 100vw;
    background: url("../../assets/images/background.jpg");
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    overflow-x: hidden;
    position: relative;
    .search {
        max-width: 60%;
        margin: 30px auto;
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
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
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
