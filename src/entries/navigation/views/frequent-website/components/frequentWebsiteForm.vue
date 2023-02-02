<template>
    <div class="frequent-website-form">
        <div class="title">
            <span>{{
                createType == "bookmark" ? "从书签选择" : "手动添加"
            }}</span>
            <span class="float-text" @click="handleCustomCreate">{{
                createType == "bookmark" ? "手动创建" : "从书签选择"
            }}</span>
        </div>
        <div class="content">
            <!-- 手动创建 -->
            <div class="form" v-if="createType == 'custom'">
                <div class="form-item">
                    <p class="label">网站名称</p>
                    <input type="text" v-model="form.name" />
                </div>
                <div class="form-item search">
                    <p class="label">网站地址</p>
                    <input type="text" v-model="form.url" />
                </div>
            </div>
            <!-- 从书签选择 -->
            <div class="bookmark-list" v-else>
                <bookmark-list @change="getSelectedData"></bookmark-list>
            </div>
            <div class="footer">
                <rambler-button type="primary" @click="confirm"
                    >确定</rambler-button
                >
            </div>
        </div>
    </div>
</template>
<script>
import BookmarkList from "../../bookmark/list";
const { v4: uuidv4 } = require("uuid");
import { mapActions } from "vuex";
export default {
    name: "FrequentWebsiteForm",
    components: {
        BookmarkList,
    },
    data() {
        return {
            form: {
                name: "",
                url: "",
            },
            createType: "bookmark", //创建方式 bookmark | custom
        };
    },
    methods: {
        ...mapActions("frequentBookmark", ["update"]),
        // 确认添加
        confirm() {
            this.update({
                type: "add",
                data: {
                    name: this.form.name,
                    url: this.form.url,
                    id: uuidv4(),
                },
            });
            this.resetFields();
            this.$emit("close");
        },
        resetFields() {
            this.form.name = "";
            this.form.url = "";
        },
        // 获取数据
        getSelectedData(payload) {
            this.form.name = payload.title;
            this.form.url = payload.url;
        },
        // 切换创建方式
        handleCustomCreate() {
            console.log(this.createType);
            if (this.createType == "bookmark") {
                this.createType = "custom";
                this.resetFields();
            } else {
                this.createType = "bookmark";
            }
        },
    },
};
</script>
<style lang="less" scoped>
@import url("../styles/frequent-website-form.less");
@import url("../../../../../styles/form.less");
</style>
