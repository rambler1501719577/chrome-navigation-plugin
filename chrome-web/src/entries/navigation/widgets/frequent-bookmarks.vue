<template>
    <div class="frequent-bookmarks-container">
        <div
            class="bookitem"
            v-for="bookmark of frequentBookmarks"
            :key="bookmark.id"
        >
            <a
                :href="bookmark.url"
                target="_blank"
                @mouseenter.self="handleMouseenter($event)"
                @mouseleave="handleMouseout($event)"
            >
                <image-card
                    :name="bookmark.name"
                    :url="bookmark.url"
                ></image-card>
            </a>
            <!-- 删除icon -->
            <div class="delete-icon">
                <a @click="deleteFrequentSite(bookmark)"
                    ><rambler-icon
                        @mouseover.native="handleMouseOver"
                        class="close-icon"
                        name="close-light"
                    ></rambler-icon
                ></a>
            </div>
        </div>
        <div class="bookitem" v-if="showAddMore" @click="showDialog">
            <div class="outer">
                <div class="add-bg">
                    <rambler-icon name="add" class="add-icon"></rambler-icon>
                </div>
                <div class="text">
                    添加
                </div>
            </div>
        </div>
        <el-dialog
            width="500px"
            title="本地书签管理"
            :modal="false"
            @open="handleOpen"
            top="10vh"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            v-dialogDrag
        >
            <el-form
                label-position="left"
                label-width="56px"
                :model="form"
                size="small"
                :rules="rules"
                ref="form"
            >
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item label="网址" prop="url">
                    <el-input
                        v-model="form.url"
                        placeholder="网址"
                        @keydown.enter="handleSubmit"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div class="btns" style="display:flex;justify-content:flex-end">
                <el-button size="small" @click="handleSubmit" type="primary"
                    >确定</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
const { v4: uuidv4 } = require("uuid");
import ImageCard from "../components/image-card";
import { mapGetters, mapActions } from "vuex";
export default {
    name: "FrequesntBookmarks",
    data() {
        var urlValidator = (rule, value, callback) => {
            const reg = /https?:\/\/(\w+\.?)+/;
            if (!reg.test(value)) {
                return callback(new Error("请输入包含http(s)的完整地址"));
            }
            callback();
        };
        return {
            commonBookmark: [],
            showAddMore: true,
            dialogVisible: false,
            form: {
                name: "",
                url: ""
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: "网站名称不能为空",
                        trigger: "blur"
                    }
                ],
                url: [
                    { validator: urlValidator, trigger: "blur" },
                    {
                        required: true,
                        message: "网站地址不能为空",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    computed: {
        ...mapGetters(["frequentBookmarks"])
    },
    components: {
        ImageCard
    },
    methods: {
        ...mapActions("frequentBookmark", ["update"]),
        deleteFrequentSite(site) {
            this.update({
                type: "delete",
                data: {
                    id: site.id
                }
            });
        },
        handleMouseenter(e) {
            e.target.parentNode.querySelector(".delete-icon").style.display =
                "block";
        },
        handleMouseout(e) {
            e.target.parentNode.querySelector(".delete-icon").style.display =
                "none";
        },
        handleMouseOver(e) {
            e.target.parentNode.parentNode.style.display = "block";
        },
        showDialog() {
            this.dialogVisible = true;
        },
        handleSubmit: function() {
            this.$refs.form.validate(result => {
                if (result) {
                    // 同步到vuex
                    this.update({
                        type: "add",
                        data: {
                            name: this.form.name,
                            url: this.form.url,
                            id: uuidv4()
                        }
                    });
                    this.$refs.form.resetFields();
                    this.dialogVisible = false;
                }
            });
        },
        handleOpen() {
            this.$nextTick(() => {
                this.$refs.form.resetFields();
            });
        }
    }
};
</script>
<style lang="less" scoped>
.frequent-bookmarks-container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .bookitem {
        width: 100px;
        min-height: 100px;
        margin-right: 20px;
        margin-bottom: 20px;
        cursor: pointer;
        transition: all 0.5s;
        border-radius: 10px;
        position: relative;
        &:hover {
            background-color: rgba(211, 206, 206, 0.5);
        }
        .outer {
            width: 100%;
            height: 100%;
            margin-top: 15px;
            .add-bg {
                margin: 15px auto;
                margin-bottom: 10px;
                background: #ffffff;
                width: 50px;
                height: 50px;
                border-radius: 8px;
                display: flex;
                justify-content: center;
                align-items: center;
                .add-icon {
                    fill: rgb(77, 71, 71) !important;
                    font-size: 16px;
                    font-weight: 200;
                }
            }
            .text {
                color: #fff;
                text-align: center;
            }
        }
        a {
            padding-top: 15px;
            display: block;
            height: 100%;
        }
        .delete-icon {
            position: absolute;
            display: none;
            right: 4px;
            top: -10px;
            .close-icon {
                fill: #65605c;
                &:hover {
                    fill: #fff;
                }
            }
        }
    }
}
</style>
