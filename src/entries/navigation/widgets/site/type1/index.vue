<template>
    <div class="site-container">
        <div class="box">
            <div class="icon">
                <ChromeIcon :url="url" :size="32"></ChromeIcon>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "Site-Type1",
    props: {
        url: String,
        openOn: String,
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
    background-color: #ffffff;
    overflow: hidden;

    .box {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;

        &::before {
            content: "";
            width: calc(100% - @border-width);
            height: calc(100% - @border-width);
            background-color: #cdd7ff;
            border-radius: 5px;
            position: absolute;
            top: calc(@border-width / 2);
            left: calc(@border-width / 2);
            z-index: 2;
        }

        &::after {
            content: "";
            width: 300%;
            height: 300%;
            background-color: rgb(255, 255, 255);
            background-image: conic-gradient(
                #fff 0%,
                rgb(190, 192, 45) 45%,
                #fff 60%
            );
            border-radius: 5px;
            position: absolute;
            top: -100%;
            left: -100%;
            z-index: 1;
            border-radius: 5px;
            animation: rotate 2s linear infinite;
        }

        .icon {
            position: absolute;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            z-index: 2;
            padding: 22px;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
                width: 40px;
                height: 40px;
            }
        }
    }
}

@keyframes rotate {
    100% {
        transform: rotate(360deg);
    }
}
</style>
