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
                <div class="engine-list">
                    <ul>
                        <li
                            v-for="(engine, index) of engines"
                            :key="index"
                            :class="{
                                selected: engine.name == currentEngine,
                                'engine-item': true,
                            }"
                            @click="handleEngineClick(engine)"
                            @contextmenu="openContextMenu($event, engine)"
                        >
                            {{ engine.name }}
                        </li>
                        <li @click="showDialog">+</li>
                    </ul>
                </div>
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
        <rambler-dialog
            :visible.sync="dialogVisible"
            name="addSearchEngine"
            title="添加搜索引擎"
            :draggable="true"
            width="500px"
            height="220px"
        >
            <div class="form">
                <div class="form-item">
                    <p class="label">名称</p>
                    <input type="text" v-model="data.name" />
                </div>
                <div class="form-item">
                    <p class="label">搜索地址</p>
                    <input type="text" v-model="data.searchUrl" />
                </div>
                <div class="footer">
                    <rambler-button @click="cancel">取消</rambler-button>
                    <rambler-button type="primary" @click="confirm"
                        >确定</rambler-button
                    >
                </div>
            </div>
        </rambler-dialog>
        <div
            class="search-popup-menu"
            :style="popupStyle"
            v-show="showPopupmenu"
        >
            <ul>
                <li class="popup-menu-item" @click="deleteEngine">删除</li>
                <li class="popup-menu-item">编辑</li>
            </ul>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
const { v4: uuidv4 } = require("uuid");
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
            choosenContextMenu: {},
            popupPosition: {
                left: 0,
                top: 0,
            },
            showPopupmenu: false, // 搜索引擎上鼠标右键弹出的popup-menu
        };
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
        popupStyle() {
            return {
                left: this.popupPosition.left + "px",
                top: this.popupPosition.top + "px",
            };
        },
    },
    methods: {
        ...mapActions("engine", ["updateCurrentEngine", "update"]),
        handleFocus() {
            this.showPopup = true;
        },
        deleteEngine() {
            this.update({
                type: "delete",
                data: {
                    id: this.choosenContextMenu.id,
                },
            });
        },
        // 鼠标右键
        openContextMenu(e, choosen) {
            e.stopPropagation();
            e.preventDefault();
            this.showPopupmenu = true;
            const { clientX, clientY } = e;
            this.popupPosition.left = clientX;
            this.popupPosition.top = clientY;
            this.choosenContextMenu = choosen;
        },
        confirm() {
            // 解析查询url，获取主机
            const data = {
                name: this.data.name,
                searchUrl: this.data.searchUrl,
                id: uuidv4(),
            };
            this.data.name = "";
            this.data.searchUrl = "";
            // 同步到vuex
            this.update({
                type: "add",
                data: data,
            });
            this.dialogVisible = false;
        },
        cancel() {
            this.dialogVisible = false;
            this.data.name = "";
            this.data.searchUrl = "";
        },
        showDialog() {
            this.dialogVisible = true;
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
                window.open(`${engine.searchUrl}${this.keywords}`, "_self");
            }
        },
        handleEngineClick: function (engine) {
            this.updateCurrentEngine(engine.name);
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
        // chrome history中搜索
        searchInHistory(keywords, limit) {
            return new Promise((resolve) => {
                if (!keywords) {
                    resolve([]);
                }
                chrome.history.search(
                    {
                        text: keywords,
                        maxResults: limit,
                    },
                    (res) => {
                        resolve(
                            res.map((ele) => ({ ...ele, from: "history" }))
                        );
                    }
                );
            });
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
            // chrome history对象提供的search匹配机制没理解
            if (chrome.history) {
                searchRes.push(
                    ...(await this.searchInHistory(this.keywords, 20))
                );
            }
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
            // chrome下e.path突然失效，可能是遵循标准事件模型，移除了path属性
            const paths = e.path || (e.composedPath && e.composedPath());
            if (![].find.call(paths, (item) => item.className == "search")) {
                this.showPopup = false;
            }
            if (
                ![].find.call(paths, (item) => item.className == "engine-item")
            ) {
                this.showPopupmenu = false;
            }
        });
    },
};
</script>
<style lang="less" scoped="scoped">
@import url("./styles/search-front.less");
</style>
