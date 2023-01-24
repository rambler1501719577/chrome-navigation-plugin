<template>
    <div class="bookmarkmark-container">
        <div class="bookmark-header">
            <div class="paths">
                <button @click="goBack">后退</button>
                <div class="path">
                    <span v-for="(visitedDir, index) of path" :key="index">
                        {{ visitedDir.title }}
                    </span>
                </div>
            </div>
            <div class="tail">
                <div class="mesh">网格</div>
                <div class="list">列表</div>
            </div>
        </div>
        <ul>
            <li v-for="bookmark of bookmarkList">
                <bookmark-item
                    @dir-click="handleDirClick"
                    @bookmark-click="handleBookmarkClick"
                    :bookmark="bookmark"
                ></bookmark-item>
            </li>
        </ul>
    </div>
</template>

<script>
import _ from "lodash";
import { mapGetters, mapActions } from "vuex";
import BookmarkItem from "./components/list-item";
export default {
    name: "Bookmark",
    data() {
        return {
            bookmarkList: [
                {
                    dateAdded: 1628582602825,
                    dateGroupModified: 1672970149506,
                    id: "1",
                    index: 0,
                    parentId: "0",
                    title: "书签栏",
                },
                {
                    dateAdded: 1628582602825,
                    dateGroupModified: 1673316216588,
                    id: "2",
                    index: 1,
                    parentId: "0",
                    title: "其他书签",
                },
            ],
            // 访问路径栈
            path: [],
        };
    },
    components: {
        BookmarkItem,
    },
    computed: {
        ...mapGetters("bookmark", ["localBookmark"]),
    },
    created() {
        this.getChildren("0");
    },
    methods: {
        ...mapActions("bookmark", ["updateBookmark"]),
        // 点击书签文件夹
        handleDirClick(bookmarkDir) {
            this.path.push(bookmarkDir);
            this.getChildren(bookmarkDir.id);
        },
        // 点击书签
        handleBookmarkClick(bookmark) {
            console.log(bookmark);
        },
        goBack() {
            this.path.pop();
            const lastVisitedPath = this.path[this.path.length - 1];
            if (lastVisitedPath) {
                this.getChildren(lastVisitedPath.id);
            } else {
                this.getChildren("0");
            }
        },
        // 根据标签id获取子书签
        isDir(bookmark) {
            return !bookmark.url;
        },
        getChildren(bookmarkId) {
            if (!chrome.bookmarks) {
                console.log("无法读取chrome.bookmarks对象");
                // this.bookmarkList = [];
            } else {
                chrome.bookmarks.getChildren(bookmarkId, (list) => {
                    this.bookmarkList = list;
                });
            }
        },
        // 编辑行
        editRow: function (row) {
            if (!chrome.bookmarks) {
                return this.$message.error("请在扩展程序中操作数据");
            }
            this.form = _.cloneDeep(row);
            this.dialogVisible = true;
        },
        // 同步到chrome中
        handleSubmit() {
            chrome.bookmarks.update(
                this.form.id,
                {
                    title: this.form.title,
                    url: this.form.url,
                },
                (result) => {
                    // 重新获取bookmark数据
                    this.updateBookmark();
                }
            );
        },
        // 删除行
        deleteRow: function (row) {
            if (!chrome.bookmarks) {
                return this.$message.error("请在扩展程序中操作数据");
            }
            chrome.bookmarks.remove(row.id, () => {
                // 重新获取bookmark数据
                this.updateBookmark();
            });
        },
    },
};
</script>
<style lang="less" scoped>
.bookmarkmark-container {
    .bookmark-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        color: #666;
        font-size: 14px;
        user-select: none;
        .paths {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            .path {
                span {
                    position: relative;
                    margin-right: 10px;
                }
                span:not(:last-child):before {
                    content: "";
                    position: absolute;
                    top: 0px;
                    right: -5px;
                    width: 3px;
                    height: 16px;
                    background: #666;
                }
            }
        }
        .tail {
            display: flex;
        }
    }
}
</style>
