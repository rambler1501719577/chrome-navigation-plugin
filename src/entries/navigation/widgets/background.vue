<template>
    <div class="background-container">
        <div class="choices">
            <div class="title">
                <h1>所有列表</h1>
            </div>
            <div class="absolute-box">
                <div class="background-list">
                    <div class="bg-item system-bg" v-for="(pic, index) of 9">
                        <img
                            :key="index"
                            :src="'/background/' + pic + '.jpg'"
                            alt=""
                            width="100%"
                            @click="updateSystemBg(pic)"
                        />
                    </div>
                    <!-- 自定义背景 -->
                    <div class="bg-item system-bg" v-for="(pic, index) of 2">
                        <img
                            :key="index"
                            :src="'/background/' + pic + '.jpg'"
                            alt=""
                            width="100%"
                            @click="updateSystemBg(pic)"
                        />
                    </div>
                    <!-- 上传背景 -->
                    <div class="bg-item upload">
                        +
                    </div>
                </div>
            </div>
        </div>

        <div class="preview-box">
            <div class="title">
                <h1>预览</h1>
            </div>
            <div class="preview">
                <img src="/background/1.jpg" width="100%" alt="" />
            </div>
            <div class="title">
                背景动效
            </div>
            <div class="dynamic-bg">
                <el-radio-group v-model="dyBackground" @change="updateDyBg">
                    <el-radio label="snow">雪花</el-radio>
                    <el-radio label="bubble">气泡</el-radio>
                    <el-radio label="empty">无</el-radio>
                </el-radio-group>
            </div>
            <div class="btn">
                <el-button type="primary">保存并应用</el-button>
            </div>
        </div>
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
    height: calc(80vh - 30px - 43px);
    display: flex;
    .choices {
        width: 300px;
        height: 100%;
        .title {
            height: 30px;
            background: #eee;
            color: #fff;
        }
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
                .bg-item {
                    float: left;
                    width: 145px;
                    height: 82px;
                    overflow: hidden;
                    margin-bottom: 10px;
                    cursor: pointer;
                }
                .bg-item:nth-child(2n + 1) {
                    margin-right: 10px;
                }
                .upload {
                    line-height: 82px;
                    text-align: center;
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
            width: 100%;
            max-height: 254px;
            overflow: hidden;
            background: #eee;
        }
        .btn {
            position: absolute;
            bottom: 0;
            right: 0;
        }
    }
}
</style>
