<template>
    <div
        class="custom-site-container"
        :style="{
            background: prop.backgroundColor,
        }"
    >
        <div class="icon">
            <ChromeIcon :url="url" :size="32"></ChromeIcon>
        </div>
    </div>
</template>
<script>
export default {
    name: "Custom-Site",
    watch: {
        prop: {
            handler: function (newVal) {
                console.log(1);
            },
            deep: true,
        },
    },
    props: {
        url: String,
        openOn: String,
        prop: {
            type: Object | undefined,
            default: () => ({
                iconSize: 36,
                backgroundColor: "#ffffff",
                fontColor: "#333333",
            }),
        },
    },
    data() {
        return {
            containerStyle: {
                background: "red",
            },
        };
    },
};
</script>
<style lang="less" scoped>
@site-text-height: 20px;
@border-width: 8px;

.custom-site-container {
    width: 100%;
    height: 100%;
    border-radius: 5px;
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
            width: 100%;
            height: 100%;
        }
    }
}
</style>
