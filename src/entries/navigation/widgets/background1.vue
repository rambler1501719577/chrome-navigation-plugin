<template>
    <div class="background-container">
        <el-tabs v-model="activeTab">
            <el-tab-pane label="系统背景" name="system">
                <div class="gallary">
                    <img
                        v-for="(pic, index) of 9"
                        :key="index"
                        :src="'/background/' + pic + '.jpg'"
                        alt=""
                        @click="updateSystemBg(pic)"
                    />
                </div>
            </el-tab-pane>
            <el-tab-pane label="自定义背景" name="custom">
                <!-- 自定义上传 -->
                <div class="custom-cover-upload">
                    <div class="btns">
                        <el-button @click="uploadFile" size="small">{{
                            this.choosenFileBase64Str ? "更换" : "选择图片"
                        }}</el-button>
                        <el-button
                            size="small"
                            v-if="choosenFileBase64Str"
                            @click="reply"
                            >应用</el-button
                        >
                    </div>
                    <div class="preview-img-box">
                        <img
                            v-if="choosenFileBase64Str"
                            :src="choosenFileBase64Str"
                            width="100%"
                            alt=""
                        />
                    </div>

                    <input
                        id="upload"
                        type="file"
                        accept="image/*"
                        @change="readImage($event)"
                    />
                </div>
            </el-tab-pane>
            <el-tab-pane label="背景动效" name="dynamic-bg">
                <el-radio-group v-model="dyBackground" @change="updateDyBg">
                    <el-radio label="snow">雪花</el-radio>
                    <el-radio label="bubble">气泡</el-radio>
                    <el-radio label="empty">无</el-radio>
                </el-radio-group>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import { mapGetters, mapActions, mapState } from "vuex";
export default {
    data() {
        return {
            choosenFileBase64Str: "",
            activeTab: "",
            dyBackground: ""
        };
    },
    computed: {
        ...mapState("setting", {
            background: state => state.background,
            dynamicBackground: state => state.dynamicBackground
        })
        // ...mapGetters("setting", ["belong", "background", "dynamicBackground"])
    },
    methods: {
        // 映射setting.Action
        ...mapActions("setting", [
            "updateBackground",
            "updateDynamicBackground"
        ]),
        updateSystemBg(pic) {
            this.updateBackground({
                belong: "system",
                src: pic + ".jpg"
            });
        },
        // 更新动态特效
        updateDyBg(effec) {
            this.updateDynamicBackground(effec);
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
            const reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.addEventListener("load", () => {
                this.choosenFileBase64Str = reader.result;
                console.log(reader.result);
            });
            reader.addEventListener("error", e => {
                this.$message.error("解析图片失败，请检查图片格式");
                console.log(e);
            });
        },
        reply() {
            this.updateBackground({
                belong: "custom",
                src: this.choosenFileBase64Str
            });
        }
    },
    created() {
        console.log(this.background);
        this.activeTab = this.background.belong;
        this.choosenFileBase64Str = this.background.customBg;
        this.dyBackground = this.dynamicBackground;
    }
};
</script>
<style lang="less" scoped>
.background-container {
    max-height: calc(80vh - 30px - 43px);
    overflow: hidden auto;
    .gallary {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        img {
            width: 300px;
            margin-bottom: 20px;
        }
    }
    .custom-cover-upload {
        .preview-img-box {
            width: 60%;
            margin: 0 auto;
        }
        .btns {
            display: flex;
            justify-content: center;
            margin-bottom: 15px;
        }
        #upload {
            display: none;
        }
    }
}
</style>
