<template>
    <div
        class="custom-site-container"
        :style="{
            background: customStyle.backgroundColor,
        }"
    >
        <div class="icon">
            <ChromeIcon
                v-if="!customStyle.text || customStyle.text == ''"
                :url="url"
                :size="32"
            ></ChromeIcon>
            <span
                v-else
                :style="{
                    color: customStyle.textColor,
                    fontSize: customStyle.textSize + 'px',
                }"
                >{{ customStyle.text }}</span
            >
        </div>
    </div>
</template>
<script>
export default {
    name: "Custom-Site",
    props: {
        url: String,
        openOn: String,
        prop: {
            type: Object,
            required: true,
        },
    },
    watch: {
        prop: {
            deep: true,
            immediate: true,
            handler: function (newVal) {
                if (newVal.style) {
                    const styles = JSON.parse(newVal.style);
                    this.customStyle.backgroundColor =
                        styles.backgroundColor || "#ffffff";
                    this.customStyle.text = styles.text;
                    this.customStyle.textSize = styles.textSize || 30;
                    this.customStyle.textColor = styles.textColor || "#333333";
                }
            },
        },
    },
    data() {
        return {
            customStyle: {
                backgroundColor: "red",
                textColor: "",
                textSize: 0,
                text: "",
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
