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
                        selected: bookmark.selected,
                    }"
                >
                    <!-- 文件夹 -->
                    <div
                        v-if="isDir(bookmark)"
                        class="dir"
                        @click="handleDirClick(bookmark)"
                        :title="bookmark.title"
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
                        :title="bookmark.title"
                        @click="handleBookmarkClicked(bookmark)"
                    >
                        <div class="icon">
                            <favicon :url="bookmark.url" :size="34"></favicon>
                        </div>
                        <div class="title">
                            {{ bookmark.title }}
                        </div>
                    </div>
                    <div v-if="bookmark.selected" class="selected-sign">
                        <rambler-icon
                            class="icon"
                            name="selected-sign"
                        ></rambler-icon>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getBookmarkSubTree } from "chrome-service";
import _ from "lodash";
export default {
    name: "Bookmark",
    data() {
        return {
            bookmarkList: [],
            // 访问路径栈
            path: [],
            selectedBookmarks: [],
        };
    },
    computed: {
        ...mapGetters(["frequentBookmarks"]),
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
        clearSelection() {
            this.selectedBookmarks.splice(0, this.selectedBookmarks.length);
            this.bookmarkList.forEach((item) => (item.selected = false));
            this.getChildren("0");
        },
        handleBookmarkClicked(payload) {
            // 给默认值
            if (payload.selected == undefined) {
                // 添加为响应式数据
                this.$set(payload, "selected", false);
            }
            if (payload.selected) {
                payload.selected = false;
                const index = this.selectedBookmarks.findIndex(
                    (bookmark) => bookmark.id == payload.id
                );
                this.selectedBookmarks.splice(index, 1);
            } else {
                // 移除反选书签
                payload.selected = true;
                this.selectedBookmarks.push(payload);
            }
            // 提交到父组件
            this.$emit("change", _.cloneDeep(this.selectedBookmarks));
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
        // 获取书签子树
        getChildren(bookmarkId) {
            getBookmarkSubTree(bookmarkId).then((bookmarkSubTree) => {
                this.bookmarkList = bookmarkSubTree;
            });
        },
    },
};
</script>
<style lang="less" scoped>
@import url("./styles/bookmark-manage.less");
@import url("./styles/bookmark-list.less");
</style>
