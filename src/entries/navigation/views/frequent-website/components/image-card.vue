<template>
    <div class="image-card-container">
        <div class="icon">
            <favicon :url="url" :size="30"></favicon>
        </div>
        <div class="description">
            <p>{{ name }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: "ImageCard",
    props: {
        url: String,
        name: String,
    },
    data() {
        return {
            loadOver: false,
            loadSucc: true,
        };
    },
};
</script>
<style lang="less" scoped>
@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
.image-card-container {
    .icon {
        padding: 10px;
        width: 50px;
        height: 50px;
        background: #fff;
        margin: 0 auto;
        border-radius: 8px;
        margin-bottom: 10px;
        position: relative;
        img {
            user-select: none;
        }
        .loading {
            position: absolute;
            left: 10px;
            top: 10px;
            text-align: center;
            .rotate {
                font-size: 30px;
                animation: rotate 1.5s linear;
                animation-iteration-count: infinite;
            }
        }
    }

    .description {
        text-align: center;
        color: #f8f0f0;
        height: 20px;
        max-width: 100px;
        overflow: hidden;
        line-height: 20px;
        p {
            margin: 0 auto;
            max-width: 80px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            user-select: none;
        }
    }
}
</style>
