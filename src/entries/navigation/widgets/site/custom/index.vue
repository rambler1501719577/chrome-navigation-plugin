<template>
    <div
        class="custom-site-container"
        :style="{
            background: prop.backgroundColor,
        }"
    >
        <div class="icon">
            <ChromeIcon
                v-if="!prop.text || prop.text == ''"
                :url="url"
                :size="32"
            ></ChromeIcon>
            <span
                v-else
                :style="{
                    color: prop.textColor,
                    fontSize: prop.textSize + 'px',
                }"
                >{{ prop.text }}</span
            >
        </div>
    </div>
</template>
<script>
export default {
    name: "Custom-Site",
    watch: {
        "prop.backgroundColor": {
            handler: function (newVal) {
                console.log(newVal);
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
                text: "示例",
                textSize: 36,
                textColor: "#333333",
                backgroundColor: "#ffffff",
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
