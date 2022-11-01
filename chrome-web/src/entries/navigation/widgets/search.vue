<template>
    <div class="search-container">
        <!-- 搜索引擎列表 -->
        <div class="engine-list">
            <ul>
                <li
                    v-for="(engine, index) of engines"
                    :key="index"
                    :class="{ selected: engine.name == currentEngine }"
                    @click="handleEngineClick(engine)"
                >
                    {{ engine.name }}
                </li>
            </ul>
        </div>
        <!-- 搜索表单 -->
        <div class="search-form">
            <input
                id="search"
                type="text"
                @input="handleInput"
                v-model="keywords"
                autocomplete="off"
                placeholder="可使用 ⬆ ⬇ 箭头切换结果"
            />
            <!-- 优雅、着实优雅 -->
            <img
                class="search-icon"
                src="../../../assets/images/search.png"
                height="100%"
                alt=""
                @click="search"
            />
            <div class="search-result">
                <ul>
                    <li v-for="(result, index) of searchResult">
                        <a
                            @click="go(result)"
                            :class="{
                                'result-item': true,
                                'is-current': index == verticalIndex
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
                                <div class="visit-count">
                                    近期访问 【{{ result.visitCount }}】次
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
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
    name: "Search",
    data() {
        return {
            keywords: "",
            searchResult: [],
            horizontalIndex: 0, // 水平方向指针位置，标识搜索引擎
            verticalIndex: 0 // 竖直方向指针位置，标识搜索结果第几条
        };
    },
    computed: {
        ...mapGetters([
            "engines",
            "currentEngine",
            "flatternBookmark",
            "dataSource"
        ])
    },
    methods: {
        ...mapActions("engine", ["updateCurrentEngine"]),
        // 跳转目标页面
        go: function(result) {
            if (!result) {
                result = this.searchResult[this.verticalIndex];
            }
            if (result.from == "bookmark" || result.from == "history") {
                window.open(result.url, "_self");
            } else {
                const engine = this.engines.find(
                    item => item.name == this.currentEngine
                );
                window.open(`${engine.searchUrl}${this.keywords}`, "_self");
            }
        },
        handleEngineClick: function(engine) {
            this.updateCurrentEngine(engine.name);
        },
        // 搜索
        search: function() {
            const engine = this.engines.find(
                item => item.name == this.currentEngine
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
            this.flatternBookmark.forEach(element => {
                if (
                    element.title
                        .toLowerCase()
                        .indexOf(keywords.toLowerCase()) !== -1
                )
                    res.push({
                        ...element,
                        from: "bookmark"
                    });
            });
            return res;
        },
        // chrome history中搜索
        searchInHistory(keywords, limit) {
            return new Promise(resolve => {
                if (!keywords) {
                    resolve([]);
                }
                chrome.history.search(
                    {
                        text: keywords,
                        maxResults: limit
                    },
                    res => {
                        resolve(res.map(ele => ({ ...ele, from: "history" })));
                    }
                );
            });
        },
        async handleInput(keywords) {
            // 重置索引和搜索结果
            this.verticalIndex = 0;
            const searchRes = [];
            if (this.flatternBookmark.length > 0) {
                searchRes.push(...this.searchInBookmark(this.keywords));
            }
            // chrome history对象提供的search匹配机制没理解
            if (chrome.history) {
                searchRes.push(
                    ...(await this.searchInHistory(this.keywords, 20))
                );
            }
            // 搜索引擎中搜索
            searchRes.push({
                title: this.keywords,
                from: "engine"
            });
            this.searchResult = searchRes;
            if (!this.keywords) {
                this.searchResult = [];
            }
        },
        // 切换搜索引擎
        switchEngine: function(keyCode) {
            // if (keyCode == 37 && this.horizontalIndex > 0) {
            //     this.horizontalIndex--;
            // }
            // if (
            //     keyCode == 39 &&
            //     this.horizontalIndex < this.engines.length - 1
            // ) {
            //     this.horizontalIndex++;
            // }
            // this.updateCurrentEngine(this.engines[this.horizontalIndex].name);
        },
        // 切换搜索结果
        switchResult: function(keyCode) {
            const resultDomHeight = 45; // 搜索结果高度
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
        }
    },
    mounted() {
        this.$el.addEventListener("keydown", e => {
            if (e.keyCode == 37 || e.keyCode == 39) {
                this.switchEngine(e.keyCode);
            }
            if (e.keyCode == 38 || e.keyCode == 40) {
                this.switchResult(e.keyCode);
                e.preventDefault();
            }
            if (e.keyCode == 13) {
                this.go();
            }
        });
    }
};
</script>
<style lang="less" scoped="scoped">
.search-container {
    position: relative;
    .engine-list {
        overflow: hidden;
        ul {
            list-style: none;
            display: flex;
            margin-bottom: 10px;
            padding-left: 25px;
            li {
                background-color: #fff;
                color: #333;
                font-size: 14px;
                height: 35px;
                padding: 0 15px;
                line-height: 35px;
                user-select: none;
                margin-right: 10px;
                transition: all 0.5s;
                cursor: pointer;
            }
            li.selected {
                background-color: #333;
                color: #fff;
            }
        }
    }
    .search-form {
        box-sizing: border-box;
        padding: 0 25px;
        width: 100%;
        height: 50px;
        border-radius: 10px;
        background-color: #fff;
        position: relative;
        #search {
            display: block;
            width: 100%;
            border: none;
            outline: none;
            height: 50px;
            line-height: 50px;
            font-size: 17px;
            box-sizing: border-box;
            border-bottom: 1px solid transparent;
        }

        #search::placeholder {
            color: #999;
        }

        .search-icon {
            position: absolute;
            right: 25px;
            top: 12px;
            width: 25px;
            height: 25px;
            cursor: pointer;
        }
        .search-result {
            position: absolute;
            top: 51px;
            left: 0;
            z-index: 2;
            width: 100%;
            background: #ffffff;
            overflow: hidden auto;
            border-radius: 10px;
            max-height: 360px;
            .result-item {
                display: block;
                height: 45px;
                box-sizing: border-box;
                border-bottom: 1px solid #f9f1f1;
                &:hover {
                    background: #eee;
                }
                .result-item-detail {
                    height: 100%;
                    padding: 0 10px;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    .icon {
                        margin-right: 10px;
                    }
                    .title {
                        margin-right: 10px;
                    }
                }
            }
            .is-current {
                background: #eee;
            }
        }
    }
}
</style>
