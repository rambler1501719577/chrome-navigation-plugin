<template>
    <div class="search-container">
        <!-- 搜索表单 -->
        <div class="search-form">
            <input
                id="search"
                type="text"
                @click="handleFocus"
                @input="handleInput"
                v-model="keywords"
                autocomplete="off"
                :placeholder="placeholder"
            />
            <favicon
                class="search-prefix"
                :url="currentEngineUrl"
                :size="20"
            ></favicon>
            <!-- 优雅、着实优雅 -->
            <div class="popup-panel" v-show="showPopup">
                <!-- 搜索引擎 -->
                <engines></engines>
                <!-- 分割线 -->
                <div class="divider"></div>
                <!-- 搜索结果 -->
                <div class="search-result">
                    <ul>
                        <li v-for="(result, index) of searchResult">
                            <a
                                @click="go(result)"
                                :class="{
                                    'result-item': true,
                                    'is-current': index == verticalIndex,
                                }"
                            >
                                <!-- 书签搜索结果 -->
                                <div
                                    v-if="result.from == 'bookmark'"
                                    class="result-item-detail"
                                >
                                    <div class="icon">
                                        <el-tag type="warning">书签</el-tag>
                                    </div>
                                    <div class="title">
                                        {{ result.title }}
                                    </div>
                                </div>
                                <!-- 历史搜索结果 -->
                                <div
                                    v-else-if="result.from == 'history'"
                                    class="result-item-detail"
                                >
                                    <div class="icon">
                                        <el-tag>历史</el-tag>
                                    </div>
                                    <div class="title">
                                        {{ result.title }}
                                    </div>
                                </div>
                                <!-- 未匹配 -->
                                <div v-else class="result-item-detail">
                                    <div class="icon">
                                        <el-tag type="info">默认</el-tag>
                                    </div>
                                    <div class="title">
                                        去【{{ currentEngine }}】中搜索{{
                                            result.title
                                        }}
                                    </div>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Engines from "./engines.vue";
import { mapGetters } from "vuex";
import { searchFromHistory } from "chrome-service";
export default {
    name: "Search",
    data() {
        return {
            keywords: "",
            searchResult: [],
            showPopup: false,
            dialogVisible: false,
            data: {
                name: "",
                searchUrl: "",
            },
            verticalIndex: 0, // 竖直方向指针位置，标识搜索结果第几条
        };
    },
    components: {
        Engines,
    },
    computed: {
        ...mapGetters([
            "engines",
            "currentEngine",
            "flatternBookmark",
            "dataSource",
        ]),
        placeholder: function () {
            return `在${this.$store.getters.currentEngine}中搜索`;
        },
        currentEngineUrl: function () {
            return this.engines.find((item) => item.name == this.currentEngine)
                ?.searchUrl;
        },
    },
    methods: {
        handleFocus() {
            this.showPopup = true;
        },
        handleBlur() {
            this.showPopup = false;
        },
        // 跳转目标页面
        go: function (result) {
            if (!result) {
                result = this.searchResult[this.verticalIndex];
            }
            if (result.from == "bookmark" || result.from == "history") {
                window.open(result.url, "_self");
            } else {
                const engine = this.engines.find(
                    (item) => item.name == this.currentEngine
                );
                // 替换搜索关键字
                window.open(
                    engine.searchUrl.replace("搜索", this.keywords),
                    "_blank"
                );
            }
        },
        // 搜索
        search: function () {
            const engine = this.engines.find(
                (item) => item.name == this.currentEngine
            );
            if (!engine) {
                return this.$message.error("当前搜索引擎错误");
            }
            window.open(`${engine.searchUrl}${this.keywords}`, "_self");
            this.keywords = "";
        },
        // 在书签中模糊搜索
        searchInBookmark(keywords) {
            if (!keywords) return [];
            let res = [];
            this.flatternBookmark.forEach((element) => {
                if (
                    element.title
                        .toLowerCase()
                        .indexOf(keywords.toLowerCase()) !== -1
                )
                    res.push({
                        ...element,
                        from: "bookmark",
                    });
            });
            return res;
        },

        async handleInput(keywords) {
            // 重置索引和搜索结果
            this.verticalIndex = 0;
            const searchRes = [];
            // 搜索引擎中搜索
            searchRes.push({
                title: this.keywords,
                from: "engine",
            });
            if (this.flatternBookmark.length > 0) {
                searchRes.push(...this.searchInBookmark(this.keywords));
            }
            // 搜索历史记录
            searchRes.push(...(await searchFromHistory(this.keywords, 20)));
            this.searchResult = searchRes;
            if (!this.keywords) {
                this.searchResult = [];
            }
        },
        // 切换搜索结果
        switchResult: function (keyCode) {
            const resultDomHeight = 50; // 搜索结果高度
            const dom = document.querySelector(".search-result");
            const resultCount = dom.clientHeight / resultDomHeight;
            const scrollTop = dom.scrollTop;
            if (keyCode == 38 && this.verticalIndex > 0) {
                this.verticalIndex--;
                // 滚动条上移，scrollTop > 0为标识
                if (scrollTop >= this.verticalIndex * resultDomHeight) {
                    dom.scrollTop = scrollTop - resultDomHeight;
                }
            }
            if (
                keyCode == 40 &&
                this.verticalIndex < this.searchResult.length - 1
            ) {
                this.verticalIndex++;
                if (this.verticalIndex >= resultCount) {
                    // 滚动条下移
                    dom.scrollTop =
                        (this.verticalIndex - resultCount + 1) *
                        resultDomHeight;
                }
            }
        },
    },
    mounted() {
        this.$el.addEventListener("keydown", (e) => {
            if (e.keyCode == 37 || e.keyCode == 39) {
                // this.switchEngine(e.keyCode);
            }
            if (e.keyCode == 38 || e.keyCode == 40) {
                this.switchResult(e.keyCode);
                e.preventDefault();
            }
            if (e.keyCode == 13) {
                this.go();
            }
        });
        document.addEventListener("click", (e) => {
            // e.path突然失效，可能是遵循标准事件模型，移除了path属性
            const paths = e.path || (e.composedPath && e.composedPath());
            if (![].find.call(paths, (item) => item.className == "search")) {
                this.showPopup = false;
            }
        });
    },
};
</script>
<style lang="less" scoped="scoped">
@import url("./styles/search-front.less");
</style>
