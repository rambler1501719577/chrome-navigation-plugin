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
            <img
                @click="updateBackground('10.jpg')"
                src="/background/10.jpg"
                alt=""
            />
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
    data() {
        return {};
    },
    computed: {
        ...mapGetters("frequentBookmark", ["localFrequentBookmarks"])
    },
    methods: {
        // 映射setting.Action
        ...mapActions("setting", ["updateBackground"])
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
}
</style>
