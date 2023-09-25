<template>
    <img :src="src" v-if="!isDev" />
    <rambler-icon name="website" class="fake-icon" v-else></rambler-icon>
</template>
<script>
export default {
    name: "Chrome-Img",
    props: {
        url: String,
        // 图标大小，宽高比例为1
        size: {
            type: Number,
            default: 32,
        },
        // 圆形图标
        round: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            isDev: false,
            src: "",
        };
    },
    watch: {
        url: function (newVal) {
            this.src = this.getIconUrl(newVal, this.size);
        },
    },
    methods: {
        getIconUrl: function (url, size) {
            if (!chrome.runtime || !url) {
                return "";
            }
            const prepareUrl = new URL(chrome.runtime.getURL("/_favicon/"));
            prepareUrl.searchParams.set("pageUrl", url);
            prepareUrl.searchParams.set("size", size + "");
            return prepareUrl.toString();
        },
    },
    created() {
        if (!this.url) {
            throw new Error("expect prop url, but get undefined");
        }
        if (!chrome.runtime) {
            this.isDev = true;
        } else {
            this.src = this.getIconUrl(this.url, this.size);
        }
    },
};
</script>
<style lang="less" scoped>
.fake-icon {
    font-size: 36px;
    fill: #3868b3;
}
</style>
