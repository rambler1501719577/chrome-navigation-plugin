<template>
    <div class="site-container">
        <div class="icon">
            <ChromeIcon :url="url" :size="32"></ChromeIcon>
        </div>
    </div>
</template>
<script>
import ChromeIcon from "@/components/chrome-img";
export default {
    name: "Site-Type2",
    props: {
        url: String,
    },
    components: { ChromeIcon },
};
</script>
<style lang="less" scoped>
@site-text-height: 20px;
@border-width: 8px;

.site-container {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    background: linear-gradient(#fff2, transparent);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0, 25px 25px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(10px);
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
