<template>
    <div class="folder-container" @click="preview">
        <div class="grid-box">
            <div v-for="item of displayChildren" class="grid-box-item">
                <ChromeIcon :url="item.url" :size="32"></ChromeIcon>
            </div>
        </div>
        <rambler-dialog
            width="390px"
            :visible.sync="dialogVisible"
            :name="dialogName"
            :title="title"
            :draggable="true"
            append-to-body
        >
            <div style="padding: 30px 40px 10px" class="dialog-folder">
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
import Site from "../site/index";
export default {
    name: "Folder",
    data() {
        return {
            dialogVisible: false,
        };
    },
    props: {
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
    created() {},
    methods: {
        preview() {
            this.dialogVisible = true;
        },
    },
};
</script>
<style lang="less" scoped>
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
