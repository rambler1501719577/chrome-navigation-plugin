<template>
    <div class="background-container">
        <div class="choices">
            <div class="title">
                <h1>所有列表</h1>
            </div>
            <div class="absolute-box">
                <div class="background-list">
                    <!-- 系统自带背景 -->
                    <div
                        class="bg-item system-bg"
                        v-for="(pic, index) of 9"
                        @mouseover="handleCoverMouseEnter"
                        @mouseleave="handleCoverMouseOut"
                    >
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
                    <div
                        class="bg-item custom-bg"
                        v-if="hasUploadBg"
                        @mouseover="handleCoverMouseEnter"
                        @mouseleave="handleCoverMouseOut"
                    >
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
            <div class="btn">
                <el-button type="primary" size="small" @click="reply"
                    >保存并应用</el-button
                >
            </div>
        </div>
    </div>
</template>
<script>
import EmptyBackground from "../background/empty";
import BubbleBackground from "../background/bubble";
import SnowBackground from "../background/snow";
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
        handleCoverMouseOut(event) {
            try {
                const { target } = event;
                if (!target) return;
                target.querySelector(".tools").style.display = "none";
            } catch (e) {}
        },
        handleCoverMouseEnter(event) {
            try {
                const { target } = event;
                if (!target) return;
                target.parentNode.querySelector(".tools").style.display =
                    "flex";
            } catch (e) {}
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
            this.$message.success("更换成功");
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
.background-container {
    height: 490px;
    display: flex;
    .title {
        padding-left: 8px;
        height: 30px;
        line-height: 30px;
        background: #eee;
        color: #333;
    }
    .choices {
        width: 300px;
        height: 100%;
        .absolute-box {
            height: calc(100% - 30px);
            overflow: hidden;
            width: 100%;
            position: relative;
            .background-list {
                position: absolute;
                top: 0;
                left: 0;
                right: -15px;
                bottom: 0;
                overflow: auto;
                padding-top: 10px;

                .bg-item:nth-child(2n + 1) {
                    margin-right: 10px;
                }
                .bg-item:nth-child(9) {
                    margin-bottom: 0;
                }
                .bg-item:nth-child(10) {
                    margin-bottom: 0;
                }
                .upload {
                    box-sizing: border-box;
                    border: 1px solid #eee;
                    line-height: 82px;
                    text-align: center;
                }
                .custom-bg {
                    position: relative;
                }
                #upload {
                    display: none;
                }
                .bg-item {
                    float: left;
                    width: 145px;
                    height: 82px;
                    overflow: hidden;
                    margin-bottom: 10px;
                    position: relative;
                    cursor: pointer;
                    .tools {
                        display: none;
                        position: absolute;
                        left: 0;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        justify-content: center;
                        align-items: center;
                        background: rgba(255, 255, 255, 0.8);
                        .btns {
                            height: 100%;
                            width: 100%;
                            line-height: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            .icon {
                                font-size: 25px;
                                fill: rgb(131, 125, 125);
                                padding: 0 10px;
                            }
                        }
                    }
                }
            }
        }
    }
    .preview-box {
        margin-left: 20px;
        flex: 1;
        height: 100%;
        position: relative;
        .preview {
            margin: 10px 0;
            width: 100%;
            height: 254px;
            overflow: hidden;
            background: #eee;
            position: relative;
            .effect {
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
            }
        }
        .dynamic-bg {
            margin: 10px 0;
        }
        .btn {
            position: absolute;
            bottom: 0;
            right: 0;
        }
    }
}
</style>
