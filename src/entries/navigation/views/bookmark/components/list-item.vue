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
                <span class="title-text">{{ bookmark.title | upper }}</span>
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
                <rambler-icon class="icon" name="edit-fill"></rambler-icon>
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
                <span class="title-text">{{ bookmark.title | upper }}</span>
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
            </div>
        </div>
        <!-- bookmark end -->
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
        return {};
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
        // 取消删除
        cancelDeletet(e) {
            // e.target.parentNode.parentNode.style.display = "none";
            this.closeDeleteTip();
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
.bookmark-list-item-wrapper {
    .list-item {
        height: 40px;
        display: flex;
        align-items: center;
        .title {
            flex: 1;
            overflow: hidden;
            color: #666;
            font-size: 16px;
            line-height: 20px;
            letter-spacing: 1px;
            display: flex;
            align-items: center;
            .title-text {
                user-select: none;
                display: block;
                width: 100%;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }

            .icon {
                font-size: 18px;
                margin-right: 8px;
            }
        }
        .mod-time {
            position: relative;
            height: 100%;
            padding-top: 11px;
            width: 100px;
            color: rgba(0, 0, 0, 0.54);
            padding-left: 5px;
            .delete-box {
                display: inline-block;
                position: relative;
                .alert-box {
                    display: none;
                    position: absolute;
                    z-index: 9;
                    left: -80px;
                    top: 30px;
                    width: 180px;
                    height: 80px;
                    padding: 12px;
                    font-size: 14px;
                    background: #fff;
                    color: #606266;
                    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
                    border: 1px solid #ebeef5;
                    .alert-bottom-btn {
                        margin-top: 12px;
                        display: flex;
                        justify-content: flex-end;
                        .sure {
                            background: rgb(95, 156, 225);
                            color: #fff;
                        }
                        .cancel {
                            color: rgb(95, 156, 225);
                        }
                    }
                    &:before {
                        content: "";
                        position: absolute;
                        left: 80px;
                        top: -7px;
                        width: 0;
                        height: 0;
                        border-left: 10px solid transparent;
                        border-right: 10px solid transparent;
                        border-bottom: 7px solid #fff;
                    }
                }
            }
            .icon {
                font-size: 20px;
                cursor: pointer;
                fill: #7a9edf;
                margin-right: 8px;
                &:hover {
                    fill: rgb(89, 120, 218);
                }
            }
        }
        &:hover {
            background: #edf3f9;
        }
    }
}
</style>
