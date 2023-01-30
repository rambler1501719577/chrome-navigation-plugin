<template>
    <div class="bubble">
        <canvas id="bubble-canvas"></canvas>
    </div>
</template>

<script>
import { random, randomColor } from "@/utils/index";
class Bubble {
    constructor() {
        this.radius = 0;
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.color = "rgb(0,0,0)";
    }
    update(boundary, maxRadius, speed) {
        this.y -= this.speed;
        if (this.y <= 0) {
            this.init(boundary, maxRadius, speed);
        }
    }
    init(boundary, maxRadius, speed) {
        this.radius = random(0, maxRadius);
        this.color = randomColor();
        this.x = random(0, boundary.width);
        this.y = random(0, boundary.height);
        this.speed = random(speed.min, speed.max);
    }
}
export default {
    name: "BubbleBackground",
    props: {
        // 气泡数量
        bubbleCount: {
            type: Number,
            default: () => 50,
        },
        // 气泡半径
        maxBubbleRadius: {
            type: Number,
            default: () => 3,
        },
        // 气泡最大速度
        maxBubbleSpeed: {
            type: Number,
            default: () => 2,
        },
        // 气泡最小速度
        minBubbleSpeed: {
            type: Number,
            default: () => 0.5,
        },
    },
    data() {
        return {
            bubbleArr: [],
            windowHeight: 0,
            windowWidth: 0,
            canvas: null,
            ctx: null,
        };
    },
    async mounted() {
        await this.init();
        this.draw();
    },
    methods: {
        generateBubble() {
            const boundary = {
                width: this.windowWidth,
                height: this.windowHeight,
            };
            const speed = {
                max: this.maxBubbleSpeed,
                min: this.minBubbleSpeed,
            };
            for (let i = 0; i < this.bubbleCount; i++) {
                const bubble = new Bubble();
                bubble.init(boundary, this.maxBubbleRadius, speed);
                this.bubbleArr.push(bubble);
            }
        },
        init() {
            return new Promise((resolve) => {
                this.windowHeight = this.$el.clientHeight;
                this.windowWidth = this.$el.clientWidth;
                this.canvas = this.$el.querySelector("#bubble-canvas");
                this.ctx = this.canvas.getContext("2d");
                this.canvas.style.width = this.canvas.width = this.windowWidth;
                this.canvas.style.height = this.canvas.height =
                    this.windowHeight;
                this.generateBubble();
                resolve();
            });
        },
        draw() {
            this.ctx.clearRect(0, 0, this.windowWidth, this.windowHeight);
            // repaint
            this.bubbleArr.forEach((bubble) => {
                // update bubble,
                this.ctx.save();
                bubble.update(
                    { width: this.windowWidth, height: this.windowHeight },
                    this.maxBubbleRadius,
                    { max: this.maxBubbleSpeed, min: this.minBubbleSpeed }
                );
                this.ctx.fillStyle = "#fff";
                this.ctx.beginPath();
                this.ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.restore();
            });
            requestAnimationFrame(this.draw);
        },
    },
};
</script>
<style lang="less" scoped>
.bubble {
    width: 100%;
    height: 100%;
}
</style>
