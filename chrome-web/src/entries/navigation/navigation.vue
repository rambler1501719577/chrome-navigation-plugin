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
import settings from "@/settings";
import { getToken } from "@/utils/token";
import Setting from "./settings/index";
import frequentBookmarks from "./widgets/frequent-bookmarks";
import Search from "./widgets/search";
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
        console.log(token);
        if (token.value) {
            console.log(`已登录,token为:${token.value.substring(0, 10)}`);
            // load remote settings and data
        } else {
            console.log("还未登录");
            // 获取数据，替换本地缓存
        }
    },
    components: {
        RamblerSearch: Search,
        frequentBookmarks: frequentBookmarks,
        RamblerSetting: Setting
    },
    methods: {
        openSetting: function() {
            this.dialogVisible = true;
        },
        loadMookData() {
            const data = [
                {
                    id: 1,
                    name: "Vue Doc",
                    url: "http://www.suhaoblog.cn?id=212"
                },
                {
                    id: 2,
                    name: "Element",
                    url:
                        "https://element.eleme.cn/#/zh-CN/component/datetime-picker"
                },
                {
                    id: 3,
                    name: "账号收益",
                    url:
                        "http://wb.renwozuan.com/?_time=1657893845237&id=11123955&password=dami1234"
                },
                {
                    id: 4,
                    name: "bilibili",
                    url:
                        "https://www.bilibili.com/medialist/play/ml1717621061/BV1D4411K7mA?spm_id_from=333.788.0.0&oid=54876984&otype=2"
                },
                {
                    id: 5,
                    name: "CSDN",
                    url:
                        "https://blog.csdn.net/qq_44204058/article/details/109611297"
                }
            ];
            localStorage.setItem(
                settings.keys.FREQUENT_BOOKMARKS,
                JSON.stringify(data)
            );
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
