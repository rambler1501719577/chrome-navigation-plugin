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
                <bookmark-list
                    ref="bookmarkList"
                    @change="getSelectedData"
                ></bookmark-list>
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
import _ from "lodash";
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
            selectedBookmarks: [],
        };
    },
    methods: {
        ...mapActions("frequentBookmark", ["update", "batchInsert"]),
        // 确认添加
        confirm() {
            if (this.createType == "bookmark") {
                this.batchInsert({
                    data: this.selectedBookmarks.map((selectedOne) => {
                        // 将书签中的title转为常用链接中的name属性，其余保持不变
                        const obj = selectedOne;
                        obj.name = selectedOne.title;
                        delete obj.title;
                        obj.from = "bookmark";
                        return obj;
                    }),
                })
                    .then((effectRows) => {
                        if (effectRows == 0) {
                            this.$ramblerNotification.warn(
                                `新增失败，无法重复添加`
                            );
                        } else {
                            this.$ramblerNotification.success(`添加成功`);
                        }
                    })
                    .finally(() => {
                        this.selectedBookmarks.splice(
                            0,
                            this.selectedBookmarks.length
                        );
                        this.$refs.bookmarkList.clearSelection();
                    });
            } else {
                if (!this.form.name || !this.form.url) {
                    this.$ramblerNotification.warn(`网站名称或地址不能为空`);
                    return;
                }
                this.update({
                    type: "add",
                    data: {
                        name: this.form.name,
                        url: this.form.url,
                        id: uuidv4(),
                        from: "user",
                    },
                });
                this.$ramblerNotification.success(`添加成功`);
            }
            this.resetFields();
            this.$emit("close");
        },
        resetFields() {
            this.form.name = "";
            this.form.url = "";
        },
        // 获取数据
        getSelectedData(payload) {
            this.selectedBookmarks = [...payload];
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
