<template>
    <div class="frequent-bookmarks-container">
        <div
            class="bookitem"
            v-for="bookmark of frequentBookmarks"
            :key="bookmark.id"
            @contextmenu.stop.prevent="showEditDialog($event, bookmark)"
        >
            <a :href="bookmark.url" target="_blank">
                <image-card
                    :name="bookmark.name"
                    :url="bookmark.url"
                ></image-card>
            </a>
            <!-- 删除icon -->
            <div class="delete-icon">
                <a @click="deleteFrequentSite(bookmark)"
                    ><rambler-icon
                        class="close-icon"
                        name="close-light"
                    ></rambler-icon
                ></a>
            </div>
        </div>
        <div
            class="bookitem"
            v-if="showAddMore"
            @click="showDialog"
            @contextmenu.stop.prevent="doNothing"
        >
            <div class="outer">
                <div class="add-bg">
                    <rambler-icon name="add" class="add-icon"></rambler-icon>
                </div>
                <div class="text">添加</div>
            </div>
        </div>
        <!-- 新建 -->
        <rambler-dialog
            width="710px"
            height="480px"
            title="最常访问"
            name="frequentWebsiteDialog"
            :visible.sync="dialogVisible"
            :draggable="true"
        >
            <frequent-website-form
                type=""
                @close="handleClose"
            ></frequent-website-form>
        </rambler-dialog>
        <rambler-dialog
            width="500px"
            height="230px"
            title="编辑"
            name="editFrequentWebsiteDialog"
            :visible.sync="editDialogVisible"
            :draggable="true"
        >
            <div class="form">
                <div class="form-item">
                    <p class="label">网站名称</p>
                    <input type="text" v-model="form.name" />
                </div>
                <div class="form-item search">
                    <p class="label">网站地址</p>
                    <input type="text" v-model="form.url" />
                </div>
                <div class="footer">
                    <rambler-button @click="save" type="primary"
                        >确定</rambler-button
                    >
                </div>
            </div>
        </rambler-dialog>
        <div class="popup" :style="popupStyle" v-show="showPopup">
            <p class="popup-item" @click="edit">编辑</p>
            <p class="popup-item" @click="deleteItem">删除</p>
        </div>
    </div>
</template>

<script>
import frequentWebsiteForm from "./components/frequentWebsiteForm.vue";
import ImageCard from "./components/image-card";
import { mapGetters, mapActions } from "vuex";
export default {
    name: "FrequesntBookmarks",
    data() {
        return {
            commonBookmark: [],
            showAddMore: true,
            dialogVisible: false,
            showPopup: false,
            form: {
                name: "",
                url: "",
            },
            editDialogVisible: false,
            editType: "",
            choosenItem: {},
            popupPosition: {
                left: 0,
                top: 0,
            },
        };
    },
    computed: {
        ...mapGetters(["frequentBookmarks"]),
        popupStyle() {
            return {
                position: "fixed",
                left: this.popupPosition.left + "px",
                top: this.popupPosition.top + "px",
            };
        },
    },
    components: {
        ImageCard,
        frequentWebsiteForm,
    },
    mounted() {
        document.addEventListener("click", (e) => {
            const paths = e.path || (e.composedPath && e.composedPath());
            if (![].find.call(paths, (item) => item.className == "popup")) {
                this.showPopup = false;
            }
        });
    },
    methods: {
        ...mapActions("frequentBookmark", ["update"]),
        save() {
            this.update({
                type: "update",
                data: {
                    id: this.choosenItem.id,
                    name: this.form.name,
                    url: this.form.url,
                },
            });
            this.editDialogVisible = false;
        },
        deleteFrequentSite(site) {
            this.update({
                type: "delete",
                data: {
                    id: site.id,
                },
            });
        },
        deleteItem() {
            this.showPopup = false;
            this.deleteFrequentSite(this.choosenItem);
        },
        edit() {
            this.showPopup = false;
            this.editDialogVisible = true;
            this.form.name = this.choosenItem.name || this.choosenItem.title;
            this.form.url = this.choosenItem.url;
        },
        doNothing() {
            return;
        },
        handleClose() {
            this.dialogVisible = false;
            // TODO
        },
        showEditDialog(e, item) {
            const { clientX, clientY } = e;
            this.popupPosition.left = clientX;
            this.popupPosition.top = clientY;
            this.showPopup = true;
            this.choosenItem = item;
        },
        showDialog() {
            this.dialogVisible = true;
        },
        handleSubmit: function () {
            this.$refs.form.validate((result) => {
                if (result) {
                    // 同步到vuex
                    this.update({
                        type: "add",
                        data: {
                            name: this.form.name,
                            url: this.form.url,
                        },
                    });
                    this.$refs.form.resetFields();
                    this.dialogVisible = false;
                }
            });
        },
    },
};
</script>
<style lang="less" scoped>
@import url("./styles/frequent-website-front-list.less");
@import url("../../../../styles/form.less");
</style>
