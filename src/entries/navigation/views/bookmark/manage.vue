<template>
    <div class="bookmarkmark-container">
        <div class="bookmark-header">
            <div class="paths">
                <div class="back-btn">
                    <rambler-icon
                        name="back"
                        @click.native="goBack"
                    ></rambler-icon>
                </div>
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
                <div class="create-folder">
                    <rambler-icon
                        class="icon"
                        name="create-folder"
                        @click.native="showCreateBookmarkFolder"
                    ></rambler-icon>
                </div>
                <div class="refresh">
                    <rambler-icon
                        class="icon"
                        name="refresh"
                        @click.native="updateList"
                    ></rambler-icon>
                </div>
            </div>
        </div>
        <div class="content">
            <div class="table-header">
                <div class="file">书签名</div>
                <div class="mod-time">修改时间</div>
            </div>
            <ul>
                <li v-for="bookmark of bookmarkList">
                    <bookmark-item
                        @dir-click="handleDirClick"
                        @bookmark-click="handleBookmarkClick"
                        @update="updateList"
                        :bookmark="bookmark"
                    ></bookmark-item>
                </li>
            </ul>
        </div>

        <rambler-dialog
            :visible.sync="folderDialogVisible"
            name="createFolder"
            :title="`在【${currentPath.title}】中创建文件夹`"
            width="400px"
            height="120px"
            :draggable="true"
        >
            <div class="create-folder">
                <input
                    type="text"
                    v-model="folder.title"
                    placeholder="文件夹名称"
                />
                <div class="footer">
                    <rambler-button @click="cancel" style="margin-right: 8px"
                        >取消</rambler-button
                    >
                    <rambler-button
                        type="primary"
                        @click="confirmCreateBookmark"
                        >确定</rambler-button
                    >
                </div>
            </div>
        </rambler-dialog>
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
            folderDialogVisible: false,
            folder: {
                title: "",
            },
        };
    },
    components: {
        BookmarkItem,
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
        ...mapActions("bookmark", ["updateBookmark"]),
        // 创建文件夹
        showCreateBookmarkFolder() {
            this.folderDialogVisible = true;
        },
        cancel() {
            this.folderDialogVisible = false;
            this.folder.title = "";
        },
        confirmCreateBookmark() {
            try {
                if (!chrome.bookmarks) throw new Error("创建文件夹失败");
                chrome.bookmarks.create({
                    parentId: this.currentPath ? this.currentPath.id : "0",
                    title: this.folder.title,
                });
            } catch (e) {
                console.log("创建文件夹失败，无法访问chrome.bookmark对象");
            } finally {
                this.folder.title = "";
                this.folderDialogVisible = false;
                this.updateList();
            }
        },
        // 更新当前标签页列表
        updateList() {
            const currentPath = this.path[this.path.length - 1];
            this.getChildren(currentPath.id);
        },
        // 返回到上一级
        backPreviousDir() {
            // 移除被删除的路径
            this.path.pop();
            this.updateList();
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
        // 点击书签
        handleBookmarkClick(bookmark) {
            console.log(bookmark);
        },
        goBack() {
            if (this.path.length == 0) {
                return;
            }
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
@import url("./styles/bookmark-manage.less");
</style>
