<template>
    <div class="background-container">
        <div class="info">
            <el-alert type="warning" :closable="false"
                >后续会支持上传本地图片作为背景</el-alert
            >
        </div>
        <div class="gallary">
            <img
                @click="updateBackground('1.jpg')"
                src="/background/1.jpg"
                alt=""
            />
            <img
                @click="updateBackground('2.jpg')"
                src="/background/2.jpg"
                alt=""
            />
            <img
                @click="updateBackground('3.jpg')"
                src="/background/3.jpg"
                alt=""
            />
            <img
                @click="updateBackground('4.jpg')"
                src="/background/4.jpg"
                alt=""
            />
            <img
                @click="updateBackground('5.jpg')"
                src="/background/5.jpg"
                alt=""
            />
            <img
                @click="updateBackground('6.jpg')"
                src="/background/6.jpg"
                alt=""
            />
            <img
                @click="updateBackground('7.jpg')"
                src="/background/7.jpg"
                alt=""
            />
            <img
                @click="updateBackground('8.jpg')"
                src="/background/8.jpg"
                alt=""
            />
            <img
                @click="updateBackground('9.jpg')"
                src="/background/9.jpg"
                alt=""
            />
        </div>
        <!-- 自定义上传 -->
        <div class="custom-cover-upload">
            <img
                v-if="choosenFileBase64Str"
                :src="choosenFileBase64Str"
                width="100px"
                height="100%"
                alt=""
            />
            <el-button @click="uploadFile" size="small">{{
                this.choosenFileBase64Str ? "重新选择" : "选择图片"
            }}</el-button>
            <el-button size="small" v-if="choosenFileBase64Str" @click="reply"
                >保存并应用</el-button
            >
            <input
                id="upload"
                type="file"
                accept="image/*"
                @change="readImage($event)"
            />
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
    data() {
        return {
            choosenFileBase64Str: ""
        };
    },
    computed: {
        ...mapGetters("frequentBookmark", ["localFrequentBookmarks"])
    },
    methods: {
        // 映射setting.Action
        ...mapActions("setting", ["updateBackground"]),
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
            this.updateBackground(this.choosenFileBase64Str);
        }
    }
};
</script>
<style lang="less" scoped>
.background-container {
    max-height: calc(80vh - 30px - 43px);
    overflow: hidden auto;
    .info {
        padding: 0 10px 10px 10px;
    }
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
        #upload {
            display: none;
        }
    }
}
</style>
