<template>
    <div class="site-container">
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
    methods: {},
};
</script>
<style lang="less" scoped>
@site-text-height: 20px;
@border-width: 8px;

.site-container {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    background: #f3f3f3;
    position: relative;
    .icon {
        position: absolute;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        z-index: 2;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
            width: 40px;
            height: 40px;
        }
    }
}
</style>
