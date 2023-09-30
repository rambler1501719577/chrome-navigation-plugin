<template>
    <div
        class="folder-container"
        @click="preview"
        @contextmenu.stop.prevent="handleSiteContextMenu"
    >
        <div class="grid-box">
            <div v-for="item of displayChildren" class="grid-box-item">
                <ChromeIcon :url="item.url" :size="32"></ChromeIcon>
            </div>
        </div>
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
                    <li @click.stop="hide"><p>隐藏</p></li>
                </div>
                <!-- <div class="contextmenu-item multi-contextmenu-item">
                <li><p>样式</p></li>
                <div class="inner-box">
                    <span @click.stop="updateType(1)">款式一</span>
                    <span @click.stop="updateType(2)">款式二</span>
                </div>
            </div> -->
            </div>
        </transition>
        <rambler-dialog
            width="390px"
            :visible.sync="dialogVisible"
            :name="dialogName"
            :title="title"
            :draggable="true"
            append-to-body
        >
            <div class="dialog-folder">
                <div v-for="item of props.children" class="folder-item">
                    <div class="icon-container">
                        <site
                            :props="item.props"
                            :url="item.url"
                            :title="item.title"
                        ></site>
                    </div>
                    <p>{{ item.title }}</p>
                </div>
            </div>
        </rambler-dialog>
    </div>
</template>
<script>
import { mapActions } from "vuex";
import Site from "../site/index";
export default {
    name: "Folder",
    data() {
        return {
            dialogVisible: false,
            contextMenuVisible: false,
            contextMenuPosition: {
                left: 0,
                top: 0,
            },
        };
    },
    props: {
        id: String,
        props: {
            type: Object,
            default: () => ({
                children: [],
            }),
        },
        title: String,
    },
    components: {
        Site,
    },
    computed: {
        dialogName: function () {
            return this.title + new Date().getTime();
        },
        displayChildren() {
            return this.props.children.slice(0, 9);
        },
    },
    mounted() {
        window.addEventListener("click", () => {
            if (this.contextMenuVisible) this.contextMenuVisible = false;
        });
    },
    methods: {
        ...mapActions("layout", ["hideWidget"]),
        preview() {
            this.dialogVisible = true;
        },
        handleSiteContextMenu: function (e) {
            const { pageX, pageY } = e;
            this.contextMenuPosition.left = pageX;
            this.contextMenuPosition.top = pageY;
            this.contextMenuVisible = true;
        },
        hide() {
            this.hideWidget({ id: this.id, status: false });
        },
    },
};
</script>
<style lang="less" scoped>
@context-menu-padding: 8px;
.folder-container {
    width: 100%;
    height: 100%;
    background: #ffffff92;
    border-radius: 5px;
    overflow: hidden;
    .grid-box {
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
.dialog-folder {
    display: flex;
    flex-wrap: wrap;
    .folder-item {
        cursor: pointer;
        width: 80px;
        margin-right: 35px;
        .icon-container {
            height: 80px;
            width: 80px;
        }
        p {
            height: 50px;
            line-height: 50px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .folder-item:nth-child(3n) {
        margin-right: 0;
    }
}
</style>
