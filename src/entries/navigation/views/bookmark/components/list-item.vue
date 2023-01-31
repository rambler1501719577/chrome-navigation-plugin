<template>
    <div class="bookmark-list-item-wrapper">
        <!-- dir start -->
        <div
            v-if="isDir"
            class="list-item-dir list-item"
            @dblclick="handleItemClick('dir')"
            @contextmenu="handleContextmenu"
        >
            <div class="title">
                <rambler-icon name="folder" class="icon"></rambler-icon>
                <span class="title-text"
                    >{{ bookmark.title | upper }} -- {{ bookmark.index }}</span
                >
            </div>
            <div class="mod-time">
                <!-- bookmark.dateGroupModified -->
                <div class="delete-box">
                    <rambler-icon
                        class="icon"
                        name="delete-fill"
                        @click.native.stop="confirmForDelete"
                    ></rambler-icon>
                    <div class="alert-box">
                        确定要删除这个<span style="color: red">文件夹</span>吗
                        <div class="alert-bottom-btn">
                            <p
                                class="rambler-icon-inline cancel"
                                @click.stop="cancelDeletet"
                            >
                                取消
                            </p>
                            <p
                                class="rambler-icon-inline sure"
                                @click.stop="sureDeleteDir"
                            >
                                确定
                            </p>
                        </div>
                    </div>
                </div>
                <rambler-icon
                    class="icon"
                    name="edit-fill"
                    @click.native="showEditDialog"
                ></rambler-icon>
            </div>
            <div class="opt-btns"></div>
        </div>
        <!-- dir end -->
        <!-- bookmark start -->
        <div
            v-else
            class="list-item-bookmark list-item"
            @click="handleItemClick('bookmark')"
        >
            <div class="title">
                <favicon
                    :url="bookmark.url"
                    :name="bookmark.title"
                    class="icon"
                ></favicon>
                <span class="title-text"
                    >{{ bookmark.title | upper }}{{ bookmark.index }}</span
                >
            </div>
            <div class="mod-time">
                <div class="delete-box">
                    <rambler-icon
                        class="icon"
                        name="delete-fill"
                        @click.native.stop="confirmForDelete"
                    ></rambler-icon>
                    <div class="alert-box">
                        确定要删除这个<span style="color: red">书签</span>吗
                        <div class="alert-bottom-btn">
                            <p
                                class="rambler-icon-inline cancel"
                                @click.stop="cancelDeletet"
                            >
                                取消
                            </p>
                            <p
                                class="rambler-icon-inline sure"
                                @click.stop="sureDeleteBookmark"
                            >
                                确定
                            </p>
                        </div>
                    </div>
                </div>
                <rambler-icon
                    class="icon"
                    name="edit-fill"
                    @click.native="showEditDialog"
                ></rambler-icon>
            </div>
        </div>
        <!-- bookmark end -->
        <rambler-dialog
            :visible.sync="editDialogVisible"
            name="editBookmark"
            width="500px"
            height="300px"
            title="编辑"
            :draggable="true"
        >
            <div class="form">
                <div class="form-item">
                    <p class="label">标题</p>
                    <input type="text" v-model="data.title" />
                </div>
                <div class="form-item" v-if="!isDir">
                    <p class="label">地址</p>
                    <input type="text" v-model="data.url" />
                </div>
                <div class="form-item">
                    <p class="label">上级文件夹</p>
                    <input type="text" v-model="data.parentId" />
                </div>
                <div class="footer">
                    <rambler-button @click="cancelEdit">取消</rambler-button>
                    <rambler-button type="primary" @click="sureUpdate"
                        >确定</rambler-button
                    >
                </div>
            </div>
        </rambler-dialog>
    </div>
</template>

<script>
export default {
    name: "Bookmark",
    props: {
        bookmark: {
            required: true,
            type: Object,
        },
    },
    data() {
        return {
            editDialogVisible: false,
            data: {
                title: "",
                id: "",
                url: "",
                parentId: "",
            },
        };
    },
    computed: {
        isDir() {
            return !this.bookmark.url;
        },
    },
    methods: {
        // 删除提示
        confirmForDelete(e) {
            const { target } = e;
            target.parentNode.parentNode.querySelector(
                ".alert-box"
            ).style.display = "block";
            e.stopPropagation();
        },
        // 取消编辑
        cancelEdit() {
            this.editDialogVisible = false;
            this.data.title = "";
            this.data.parentId = "";
            this.data.url = "";
        },
        // 更新书签
        sureUpdate() {
            try {
                if (!chrome.bookmarks)
                    throw new Error("更新书签异常，无法读取书签对象");
                chrome.bookmarks.update(
                    this.bookmark.id,
                    {
                        title: this.data.title,
                        url: this.data.url,
                    },
                    (res) => {
                        console.log("修改成功");
                    }
                );
            } catch (e) {
                console.log("更新书签异常");
            } finally {
                this.editDialogVisible = false;
                this.data.title = "";
                this.data.url = "";
                this.$emit("update");
            }
        },
        // 取消删除
        cancelDeletet(e) {
            // e.target.parentNode.parentNode.style.display = "none";
            this.closeDeleteTip();
        },
        showEditDialog() {
            this.data = JSON.parse(JSON.stringify(this.bookmark));
            this.editDialogVisible = true;
        },
        closeDeleteTip() {
            this.$el.querySelector(".alert-box").style.display = "none";
        },
        // 确定删除书签
        sureDeleteBookmark() {
            chrome.bookmarks.remove(this.bookmark.id, (result) => {
                this.$emit("update");
                console.log("remove bookmark successfully");
            });
            this.closeDeleteTip();
        },
        sureDeleteDir() {
            chrome.bookmarks.removeTree(this.bookmark.id, (res) => {
                this.$emit("update");
                this.closeDeleteTip();
            });
        },
        handleItemClick(type) {
            const emitType = type == "dir" ? "dir-click" : "bookmark-click";
            this.$emit(emitType, this.bookmark);
        },
        handleContextmenu(e) {
            // 思路： 悬停后展示buttons like baidu网盘
            e.stopPropagation();
            e.preventDefault();
        },
    },
};
</script>
<style lang="less" scoped>
@import url("../styles/bookmark-item.less");
</style>
