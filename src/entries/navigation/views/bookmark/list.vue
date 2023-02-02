<template>
    <div class="bookmarkmark-container">
        <div class="bookmark-list-wrapper">
            <div class="bookmark-header">
                <div class="paths">
                    <div class="path">
                        <span @click="handlePathClick(undefined)">
                            全部书签
                        </span>
                        <span
                            v-for="(visitedDir, index) of path"
                            :key="index"
                            @click="handlePathClick(visitedDir)"
                        >
                            {{ visitedDir.title }}
                        </span>
                    </div>
                </div>
                <div class="tail"></div>
            </div>
            <div class="content">
                <div
                    v-for="bookmark of bookmarkList"
                    :class="{
                        'list-item': true,
                        selected: bookmark.title == selected.title,
                    }"
                >
                    <!-- 文件夹 -->
                    <div
                        v-if="isDir(bookmark)"
                        class="dir"
                        @click="handleDirClick(bookmark)"
                    >
                        <div class="icon">
                            <rambler-icon name="folder"></rambler-icon>
                        </div>
                        <div class="title">
                            {{ bookmark.title }}
                        </div>
                    </div>
                    <!-- 书签 -->
                    <div
                        v-else
                        class="not-dir"
                        @click="handleBookmarkClicked(bookmark)"
                    >
                        <div class="icon">
                            <favicon :url="bookmark.url" :size="34"></favicon>
                        </div>
                        <div class="title">
                            {{ bookmark.title }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { randomNum } from "@/utils";
import { mapGetters } from "vuex";
export default {
    name: "Bookmark",
    data() {
        return {
            bookmarkList: [],
            // 访问路径栈
            path: [],
            selected: {}, //当前选中书签
        };
    },
    computed: {
        ...mapGetters("bookmark", ["localBookmark"]),
        currentPath() {
            if (this.path.length == 0) {
                return {
                    id: 1,
                    title: "全部书签",
                };
            }
            return this.path[this.path.length - 1];
        },
    },
    created() {
        this.getChildren("0");
    },
    methods: {
        handleBookmarkClicked(payload) {
            this.selected = payload;
            this.$emit("change", payload);
        },
        // 点击书签文件夹
        handleDirClick(bookmarkDir) {
            try {
                this.getChildren(bookmarkDir.id);
                this.path.push(bookmarkDir);
            } catch (e) {
                console.log("获取书签捕获到异常");
            }
        },
        // 根据标签id获取子书签
        isDir(bookmark) {
            return !bookmark.url;
        },
        // 路径直接跳转
        handlePathClick(pathTarget) {
            if (!pathTarget) {
                while (this.path.length !== 0) {
                    this.path.pop();
                }
                this.getChildren("0");
                return;
            }
            const targetPathIndex = this.path.findIndex(
                (path) => path.id == pathTarget.id
            );
            const popTime = this.path.length - (targetPathIndex + 1);
            for (let i = 0; i < popTime; i++) {
                this.path.pop();
            }
            this.getChildren(pathTarget.id);
        },
        // chrome api -> 根据id获取书签
        getChildren(bookmarkId) {
            if (!chrome.bookmarks) {
                this.bookmarkList = [...this.randomData()];
            } else {
                chrome.bookmarks.getChildren(bookmarkId, (list) => {
                    this.bookmarkList = list;
                });
            }
        },
        randomData() {
            const arr = [];
            const times = randomNum(2, 10);
            for (let i = 0; i < 50; i++) {
                arr.push({
                    dateAdded: 1628582602825,
                    dateGroupModified: 1673316216588,
                    id: "2",
                    index: 1,
                    url: i % 4 == 0 ? "111" : "",
                    parentId: "0",
                    title: "随机随机随机随机随机" + i + "",
                });
            }
            return arr;
        },
    },
};
</script>
<style lang="less" scoped>
@import url("./styles/bookmark-manage.less");
@import url("./styles/bookmark-list.less");
</style>
