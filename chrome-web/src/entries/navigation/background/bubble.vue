<template>
    <div class="bubble"></div>
</template>

<script>
import { randomNum } from "@/utils/index";
export default {
    name: "BubbleBackground",
    props: {},
    data() {
        return {
            bubbleCount: 10
        };
    },
    mounted() {
        this.generateBubble();
        setInterval(() => {
            this.generateBubble();
        }, 1000);
    },
    methods: {
        generateBubble() {
            for (let i = 0; i < this.bubbleCount; i++) {
                const bubble = document.createElement("span");
                bubble.className = "bubble-item";
                bubble.style = `--left:${randomNum(0, 100)};--delay:${randomNum(
                    0,
                    10
                )};--speed:${randomNum(10, 20)};--breath:${randomNum(10, 20)}`;
                this.$el.appendChild(bubble);
                setTimeout(() => {
                    bubble.remove();
                }, 20000);
            }
        }
    }
};
</script>
<style>
.bubble-item {
    position: absolute;
    bottom: -10px;
    left: calc(var(--left) / 100 * 100vw);
    display: block;
    width: 5px;
    height: 5px;
    background-color: #fff;
    border-radius: 50%;
    animation: breath calc(var(--breath) / 10 * 1s) linear infinite,
        bubble calc(var(--speed) * 1s) linear infinite;
    animation-delay: calc(var(--delay) / 100 * 5s);
}
</style>
<style lang="less" scoped>
.bubble {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
    width: 100%;
    height: 100vh;
    display: flex;
    overflow: hidden;
}
</style>
