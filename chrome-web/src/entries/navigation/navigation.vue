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
            title="个性化设置"
            :modal="false"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
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
import Setting from "./settings/index";
import frequentBookmarks from "./widgets/frequent-bookmarks";
import Search from "./widgets/search";
export default {
    name: "IndexLayout",
    data() {
        return {
            dialogVisible: true
        };
    },
    // 加载engines和bookmarkds以及todos
    // 加载本地个性化配置
    // 同步到vuex中
    created() {},
    components: {
        RamblerSearch: Search,
        frequentBookmarks: frequentBookmarks,
        RamblerSetting: Setting
    },
    watch: {
        $route: {
            handler: function() {}
        },
        "$store.getters.showSidebar": function() {}
    },
    methods: {
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
        right: 20px;
        bottom: 20px;
        .affix-icon {
            width: 25px;
            height: 25px;
            fill: #ddd;
            cursor: pointer;
        }
    }
}
</style>
