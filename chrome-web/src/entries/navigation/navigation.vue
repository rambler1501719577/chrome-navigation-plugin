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
        <el-dialog
            width="1000px"
            title="个性化设置"
            :modal="false"
            top="10vh"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            v-dialogDrag
        >
            <rambler-setting></rambler-setting>
        </el-dialog>

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

        <div class="affix">
            <rambler-icon
                @click.native="openBookmarkConfig"
                name="date"
                class="bookmark"
            ></rambler-icon>
            <rambler-icon
                @click.native="openSetting"
                name="setting"
                class="affix-icon"
            ></rambler-icon>
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
export default {
    name: "IndexLayout",
    data() {
        return {
            dialogVisible: false,
            bookmarkDialogVisible: false
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
        BookmarkSetting: BookmarkSetting
    },
    methods: {
        ...mapActions("bookmark", ["updateRemoteBookmark", "updateBookmark"]),
        ...mapActions("todo", ["updateRemoteTodo"]),
        openSetting: function() {
            this.dialogVisible = true;
        },
        openBookmarkConfig() {
            this.bookmarkDialogVisible = !this.bookmarkDialogVisible;
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
    .affix {
        display: flex;
        position: absolute;
        width: 35px;
        right: 30px;
        bottom: 30px;
        flex-wrap: wrap;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .bookmark {
            width: 35px;
            height: 35px;
            fill: #ddd;
            cursor: pointer;
            margin-bottom: 8px;
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
