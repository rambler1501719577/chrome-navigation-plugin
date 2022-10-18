<template>
    <div class="search-container">
        <!-- 搜索引擎列表 -->
        <div class="engine-list">
            <ul>
                <li
                    v-for="(engine, index) of engines"
                    :key="index"
                    :class="{ selected: engine.name == currentEngine }"
                    @click="switchEngine(engine)"
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
                placeholder="搜万物 | 支持在【书签】和【历史记录】中搜索"
                @keydown.enter="search"
            />
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
                        <a @click="go(history)" class="result-item">
                            <div
                                v-if="result.from == 'bookmark'"
                                class="result-item-detail"
                            >
                                <div class="icon">
                                    <rambler-icon name="date"></rambler-icon>
                                </div>
                                <div class="title">
                                    {{ result.title }}
                                </div>
                                <div>
                                    <el-tag>{{ result.from }}</el-tag>
                                </div>
                            </div>
                            <div
                                v-else-if="result.from == 'search'"
                                class="result-item-detail"
                            >
                                <div class="icon">
                                    <rambler-icon name="search"></rambler-icon>
                                </div>
                                <div class="title">
                                    {{ result.title }}
                                </div>
                                <div>
                                    <el-tag>{{ result.from }}</el-tag>
                                </div>
                            </div>
                            <div v-else class="result-item-detail">
                                <div class="title">{{ result.title }}</div>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: "Search",
    data() {
        return {
            keywords: "",
            searchResult: []
        };
    },
    computed: {
        ...mapGetters(["engines", "currentEngine", "flatternBookmark"])
    },
    methods: {
        // 获得访问链接
        go: function(result) {
            if (result.from == "bookmark" || result.from == "history") {
                window.open(result.url, "_self");
            } else {
                window.open(`${engine.searchUrl}${this.keywords}`, "_self");
            }
        },
        switchEngine: function(engine) {
            this.$store.dispatch("engine/updateCurrentEngine", engine.name);
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
                if (element.title.indexOf(keywords) !== -1)
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
            searchRes.push({
                title: this.keywords,
                from: "engine"
            });
            console.log(searchRes);
            this.searchResult = searchRes;
        }
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
            max-height: 400px;
            .result-item {
                display: block;
                height: 45px;
                &:hover {
                    background: #ddd;
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
                }
            }
        }
    }
}
</style>
