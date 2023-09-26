<template>
    <div class="site-container" @click="visit">
        <div class="icon">
            <ChromeIcon :url="url" :size="32"></ChromeIcon>
        </div>
    </div>
</template>
<script>
export default {
    name: "Site-Type2",
    props: {
        url: String,
        openOn: String,
    },
    methods: {
        visit() {
            window.open(this.url, this.openOn);
        },
    },
};
</script>
<style lang="less" scoped>
@site-text-height: 20px;
@border-width: 8px;

.site-container {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    background: #eeeeeecc;
    .icon {
        position: absolute;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        z-index: 2;
        padding: 22px;

        img {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
