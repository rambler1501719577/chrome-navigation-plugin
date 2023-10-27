<template>
    <div
        class="folder-container"
        @click="preview"
        @contextmenu.stop.prevent="handleCommonWidgetContextMenu"
    >
        <div class="folder-bg">
            <rambler-icon name="folder"></rambler-icon>
        </div>
        <!-- <div class="grid-box">
            <div v-for="item of displayChildren" class="grid-box-item">
                <ChromeIcon :url="item.url" :size="32"></ChromeIcon>
            </div>
        </div> -->
        <!-- 右键菜单 -->
        <transition
            name="custom-classes-transition"
            enter-active-class="rambler__animated fadeInRight"
            leave-active-class="rambler__animated fadeOut"
        >
            <div
                class="fixed-site-contextmenu global-popup-container"
                v-if="contextMenuVisible"
                :style="{
                    left: contextMenuPosition.left + 'px',
                    top: contextMenuPosition.top + 'px',
                }"
            >
                <div class="contextmenu-item" is-single="true">
                    <li @click.stop="hideWidget"><p>删除</p></li>
                </div>
            </div>
        </transition>
        <!-- 展示子元素弹窗 -->
        <rambler-dialog
            width="450px"
            :visible.sync="dialogVisible"
            :emptyTitle="true"
            :draggable="true"
            append-to-body
            @opened="handleFolderDialogOpen"
            customClass="folder-container-dialog"
        >
            <div class="dialog-folder-container">
                <div class="folder-bg">
                    <rambler-icon name="folder"></rambler-icon>
                </div>
                <div class="swiper-container" :id="'swiper-' + id">
                    <div class="swiper-wrapper">
                        <div
                            class="swiper-slide"
                            v-for="(page, index) of pageData"
                            :key="index"
                        >
                            <div class="dialog-folder">
                                <div
                                    v-for="(item, _index) of page"
                                    :key="_index"
                                    class="folder-item"
                                >
                                    <div class="icon-container">
                                        <div v-if="item.isAdd" class="add-icon">
                                            <rambler-icon
                                                name="add"
                                            ></rambler-icon>
                                        </div>
                                        <site
                                            v-else
                                            :id="item.id"
                                            :prop="item.props"
                                            :url="item.url"
                                            :title="item.title"
                                        ></site>
                                    </div>
                                    <p>{{ item.title }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="swiper-pagination"></div>
                </div>
            </div>
        </rambler-dialog>
    </div>
</template>
<script>
import widgetCommon from "../../mixins/widget-common";
import Site from "../site/index";
import Swiper from "swiper"; //  ES6 导入swiper js文件
import "swiper/dist/css/swiper.min.css";
export default {
    name: "Folder",
    mixins: [widgetCommon],
    data() {
        return {
            dialogVisible: false,
            swiperOption: {},
            swiper: null,
            pageSize: 8,
        };
    },
    props: {
        prop: {
            type: Object,
            default: () => ({
                children: [],
            }),
        },
    },
    components: {
        Site,
    },
    computed: {
        displayChildren() {
            return this.prop.children.slice(0, 9);
        },
        pageData: function () {
            const addIcon = {
                title: "添加",
                isAdd: true,
            };
            const data = [];
            const { children } = this.prop;
            if (!children || children.length == 0) {
                data.push([addIcon]);
                return data;
            }
            const groupSize = parseInt(children.length / this.pageSize) + 1;
            for (let i = 0; i < groupSize; i++) {
                const page = this.prop.children.slice(
                    i * this.pageSize,
                    (i + 1) * this.pageSize
                );
                if (i == groupSize - 1) {
                    page.push(addIcon);
                }
                data.push(page);
            }
            return data;
        },
    },
    methods: {
        preview() {
            this.dialogVisible = true;
        },
        getCurrentPageData(page) {
            const pageData = this.prop.children.slice(
                page * this.pageSize,
                (page + 1) * this.pageSize
            );
            // 最后一页数据，添加按钮
            if (page == this.pages - 1) {
                pageData.push({
                    title: "添加",
                    isAdd: true,
                });
            }
            return pageData;
        },
        handleFolderDialogOpen() {
            const id = "#swiper-" + this.id;
            new Swiper(id, {
                // 如果需要分页器
                pagination: {
                    el: ".swiper-pagination",
                },
                spaceBetween: 10,
            });
        },
    },
};
</script>
<style lang="less" scoped>
@context-menu-padding: 8px;
.folder-container {
    width: 100%;
    height: 100%;
    background-size: cover;
    border-radius: 5px;
    overflow: hidden;
    position: relative;
    .folder-bg {
        position: absolute;
        z-index: 2;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        .rambler-icon {
            position: relative;
            // left: -7px;
            top: 4px;
            font-size: 80px;
            // fill: rgb(244, 202, 37);
        }
    }
    .grid-box {
        position: absolute;
        z-index: 1;
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(3, 1fr);
        .grid-box-item {
            box-sizing: border-box;
            padding: 3px;
            width: 33%;
            height: 33%;
            img {
                width: 18px;
                height: 18px;
            }
            .rambler-icon {
                font-size: 18px;
            }
        }
    }
    .fixed-site-contextmenu {
        width: 120px;
        position: fixed;
        z-index: 999;
    }
}
</style>
<style lang="less">
.dialog-folder-container {
    position: relative;
    width: 100%;
    width: 450px;
    height: 450px;
    overflow: hidden;
    .folder-bg {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        .rambler-icon {
            font-size: 450px;
        }
    }
    .swiper-container {
        background: #fff;
        position: absolute;
        top: 114px;
        left: 25px;
        z-index: 1;
        width: 400px;
        height: 300px;
        align-content: flex-start;
        flex-wrap: wrap;
        padding: 10px;
        border-radius: 15px;
        .swiper-slide {
            overflow: hidden;
            padding-top: 15px;
            .dialog-folder {
                display: flex;
                flex-wrap: wrap;
                align-content: flex-start;
                width: 100%;

                .folder-item {
                    cursor: pointer;
                    width: 80px;
                    margin-right: 20px;
                    .icon-container {
                        height: 80px;
                        width: 80px;
                        .add-icon {
                            width: 100%;
                            height: 100%;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            background: #eee;
                            border-radius: 10px;
                            .rambler-icon {
                                font-size: 30px;
                                fill: #656565;
                            }
                        }
                    }
                    p {
                        height: 40px;
                        line-height: 40px;
                        text-align: center;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
                .folder-item:nth-child(4n) {
                    margin-right: 0;
                }
            }
        }
    }
}
</style>
<style>
.folder-container-dialog {
    background: transparent !important;
}
</style>
