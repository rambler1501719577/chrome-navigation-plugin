<template>
    <div class="bookmarkmark-container">
        <div class="bookmark-header">
            <div class="paths">
                <rambler-button @click="goBack">后退</rambler-button>
                <div class="path">
                    <span @click="handlePathClick(undefined)"> 全部书签 </span>
                    <span
                        v-for="(visitedDir, index) of path"
                        :key="index"
                        @click="handlePathClick(visitedDir)"
                    >
                        {{ visitedDir.title }}
                    </span>
                </div>
            </div>
            <div class="tail">
                <div class="mesh">
                    <rambler-icon class="icon" name="grid"></rambler-icon>
                </div>
                <div class="list">
                    <rambler-icon class="icon" name="list"></rambler-icon>
                </div>
            </div>
        </div>
        <div class="table-header">
            <div class="file">书签名</div>
            <div class="mod-time">修改时间</div>
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
import { randomNum } from "@/utils";
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
                    title: "vol",
                },
                {
                    dateAdded: 1628582602825,
                    dateGroupModified: 1673316216588,
                    id: "2",
                    index: 1,
                    url: "1",
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
            try {
                this.getChildren(bookmarkDir.id);
                this.path.push(bookmarkDir);
            } catch (e) {
                console.log("获取书签捕获到异常");
            }
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
            for (let i = 0; i < times; i++) {
                arr.push({
                    dateAdded: 1628582602825,
                    dateGroupModified: 1673316216588,
                    id: "2",
                    index: 1,
                    url: i % 2 == 0 ? "111" : "",
                    parentId: "0",
                    title: "随机" + i + "",
                });
            }
            return arr;
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
        align-items: center;
        margin-bottom: 10px;
        color: #666;
        font-size: 14px;
        user-select: none;
        .paths {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            .path {
                margin-left: 6px;
                span {
                    cursor: pointer;
                    position: relative;
                    margin-right: 12px;
                    &:hover {
                        color: rgb(105, 151, 221);
                    }
                }
                span:not(:last-child):before {
                    content: "";
                    position: absolute;
                    top: 0px;
                    right: -5px;
                    width: 1px;
                    height: 16px;
                    background: #666;
                    transform: rotateZ(13deg);
                }
            }
        }
        .tail {
            display: flex;
            .mesh {
                .icon {
                    font-size: 20px;
                    margin: -2px 4px 0 0;
                }
            }
            .icon {
                fill: #444;
                font-size: 18px;
            }
        }
    }
    .table-header {
        display: flex;
        height: 26px;
        line-height: 26px;
        font-size: 14px;
        margin-bottom: 5px;
        .file {
            padding-left: 5px;
            background: #eee;
            margin-right: 5px;
            flex: 1;
        }
        .mod-time {
            width: 100px;
            padding-left: 5px;
            background: #eee;
        }
    }
}
</style>
