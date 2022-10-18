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

        <div class="affix">
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
import frequentBookmarks from "./widgets/frequent-bookmarks";
import Search from "./widgets/search";
import { getBookmarks } from "@/api/modules/bookmark";
import { getTodos } from "@/api/modules/todo";
export default {
    name: "IndexLayout",
    data() {
        return {
            dialogVisible: false
        };
    },
    // 加载engines和bookmarkds以及todos
    // 加载本地个性化配置
    // 同步到vuex中
    async created() {
        const token = await getToken();
        if (token && token.value) {
            console.log(`已登录,token为:${token.value.substring(0, 10)}****`);
            // 获取书签
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
                }
                if (
                    todoRes.status == "fulfilled" &&
                    todoRes.value.code == 200
                ) {
                    const todos = todoRes.value.data;
                    this.updateRemoteTodo(todos);
                }
            });
            // load remote settings and data
        } else {
            console.log("未登录");
        }
    },
    components: {
        RamblerSearch: Search,
        frequentBookmarks: frequentBookmarks,
        RamblerSetting: Setting
    },
    methods: {
        ...mapActions("bookmark", ["updateRemoteBookmark"]),
        ...mapActions("todo", ["updateRemoteTodo"]),
        openSetting: function() {
            this.dialogVisible = true;
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
        overflow-x: hidden;
    }
    .frequent-bookmarks {
        width: 80%;
        margin: 0 auto;
    }
    .affix {
        position: absolute;
        right: 30px;
        bottom: 30px;
        .affix-icon {
            width: 30px;
            height: 30px;
            fill: #ddd;
            cursor: pointer;
            transition: all 0.7s;
        }
        &:hover > .affix-icon {
            transform: rotate(270deg);
        }
    }
}
</style>
