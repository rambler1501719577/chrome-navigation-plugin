<template>
    <div class="background-container">
        <div class="choices">
            <div class="title">
                <h1>所有背景</h1>
            </div>
            <div class="absolute-box">
                <div class="background-list">
                    <!-- 系统自带背景 -->
                    <div class="bg-item system-bg" v-for="(pic, index) of 9">
                        <img
                            :key="index"
                            :src="'/background/' + pic + '.jpg'"
                            alt=""
                            width="100%"
                            @click="updateSystemBg('system', pic)"
                        />
                        <div class="tools">
                            <div class="btns">
                                <div class="preview-btn">
                                    <rambler-icon
                                        name="preview"
                                        class="icon"
                                        @click.native="
                                            updateSystemBg('system', pic)
                                        "
                                    ></rambler-icon>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 自定义背景 -->
                    <div class="bg-item custom-bg" v-if="hasUploadBg">
                        <img
                            :src="background.customBg"
                            width="100%"
                            @click="updateSystemBg('custom')"
                        />
                        <div class="tools">
                            <div class="btns">
                                <div class="preview-btn">
                                    <rambler-icon
                                        name="preview"
                                        class="icon"
                                        @click.native="updateSystemBg('custom')"
                                    ></rambler-icon>
                                </div>
                                <div class="change-btn">
                                    <rambler-icon
                                        name="exchange"
                                        class="icon"
                                        @click.native="uploadFile"
                                    ></rambler-icon>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 上传背景 -->
                    <div class="bg-item upload" @click="uploadFile" v-else>
                        上传图片
                    </div>
                    <input
                        id="upload"
                        type="file"
                        accept="image/*"
                        @change="readImage($event)"
                    />
                </div>
            </div>
        </div>

        <div class="preview-box">
            <div class="title">
                <h1>预览</h1>
            </div>
            <div
                class="preview"
                :style="{
                    backgroundImage: `url('${previewSrc}')`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                }"
            >
                <!-- 动效 -->
                <div class="effect">
                    <component
                        :is="choosen.dyBackground + '-background'"
                        v-bind="dynamicAttrs"
                    ></component>
                </div>
            </div>
            <div class="title">背景动效</div>
            <div class="dynamic-bg">
                <el-radio-group v-model="choosen.dyBackground">
                    <el-radio label="snow">雪花</el-radio>
                    <el-radio label="bubble">气泡</el-radio>
                    <el-radio label="empty">无</el-radio>
                </el-radio-group>
            </div>
            <div class="title">背景模糊</div>
            <div class="dynamic-bg-blur">
                <rambler-input v-model="choosen.blur"></rambler-input>
            </div>
            <div class="btn">
                <rambler-button type="primary" @click="reply"
                    >保存并应用</rambler-button
                >
            </div>
        </div>
    </div>
</template>
<script>
import EmptyBackground from "./backgrounds/empty";
import BubbleBackground from "./backgrounds/bubble";
import SnowBackground from "./backgrounds/snow";
import { uploadFileSize } from "@/settings";
import { mapActions, mapState } from "vuex";
const attrMap = {
    snow: {
        maxSnowRadius: 10,
        maxSnowVx: 2,
        maxSnowVy: 2,
        maxSnowCount: 50,
    },
    bubble: {
        bubbleCount: 30,
        // 气泡半径
        maxBubbleRadius: 2,
        // 气泡最大速度
        maxBubbleSpeed: 1,
        // 气泡最小速度
        minBubbleSpeed: 0.5,
    },
};
export default {
    data() {
        return {
            dyBackground: "",
            choosen: {
                belong: "",
                systemBg: "",
                customBg: "",
                dyBackground: "",
                blur: 0,
            },
        };
    },
    computed: {
        ...mapState("setting", {
            background: (state) => state.background,
            dynamicBackground: (state) => state.dynamicBackground,
        }),
        // 预览背景地址
        previewSrc: function () {
            return this.choosen.belong == "system"
                ? "/background/" + this.choosen.systemBg
                : this.choosen.customBg;
        },
        hasUploadBg() {
            return this.background.customBg ? true : false;
        },
        dynamicAttrs() {
            return attrMap[this.choosen.dyBackground];
        },
    },
    components: {
        EmptyBackground,
        BubbleBackground,
        SnowBackground,
    },
    methods: {
        // 映射setting.Action
        ...mapActions("setting", [
            "updateBackground",
            "updateDynamicBackground",
        ]),
        updateSystemBg(type, pic) {
            this.choosen.belong = type;
            if (type == "custom") {
                this.choosen.customBg = this.background.customBg;
            } else {
                this.choosen.systemBg = pic + ".jpg";
            }
        },
        uploadFile() {
            document.querySelector("#upload").click();
        },
        // 读取文件，转为Base64编码
        readImage(e) {
            const files = e.target.files;
            if (files.length > 1) {
                this.$message.error("仅支持自定义一张照片");
            }
            const file = files[0];
            const { size } = file;
            if (size / 1024 / 1024 >= uploadFileSize) {
                return this.$message.error(
                    `单张文件大小不得超过${uploadFileSize}M`
                );
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.addEventListener("load", () => {
                this.choosen.belong = "custom";
                this.choosen.customBg = reader.result;
            });
            reader.addEventListener("error", (e) => {
                this.$message.error("读取文件失败，文件不存在");
                console.log(e);
            });
        },
        reply() {
            const payload = {
                belong: this.choosen.belong,
                src:
                    this.choosen.belong == "system"
                        ? this.choosen.systemBg
                        : this.choosen.customBg,
            };
            this.updateBackground(payload);
            this.updateDynamicBackground(this.choosen.dyBackground);
            this.$ramblerNotification.success("更换背景成功");
        },
    },
    created() {
        this.choosen.belong = this.background.belong;
        this.choosen.customBg = this.background.customBg;
        this.choosen.systemBg = this.background.systemBg;
        this.choosen.dyBackground = this.dynamicBackground;
        this.dyBackground = this.dyBackground;
    },
};
</script>
<style lang="less" scoped>
@import url("./styles/background-manage.less");
</style>
