<template>
    <div class="container">
        <canvas id="snow-canvas"></canvas>
    </div>
</template>
<script>
import { random } from "@/utils/index";
class Snow {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.radius = 0;
        this.vx = 0;
        this.vy = 0;
        this.alpha = 0;
    }

    // 随机生成一片雪花, 不能接收参数
    init(boundary, radius, vx, vy) {
        this.x = random(0, boundary.width);
        this.y = random(0, boundary.height);
        this.radius = random(0, radius);
        this.vx = random(-vx, vx);
        this.vy = random(2, vy);
        this.alpha = random(0.1, 0.9);
    }

    update(boundary, radius, vx, vy) {
        this.x += this.vx;
        this.y += this.vy;
        if (
            this.x > boundary.width ||
            this.x <= 0 ||
            this.y > boundary.height
        ) {
            this.init(boundary, radius, vx, vy);
        }
    }
}
export default {
    methods: {},
    data() {
        return {
            windowHeight: 0,
            windowWidth: 0,
            snowList: [],
            canvas: null,
            ctx: null,
            image: null,
            animationId: null,
        };
    },
    props: {
        maxSnowRadius: {
            default: () => 13,
        },
        maxSnowVx: {
            default: () => 2,
        },
        maxSnowVy: {
            default: () => 4,
        },
        maxSnowCount: {
            default: () => 100,
        },
    },
    methods: {
        // 初始化canvas
        init() {
            return new Promise((resolve) => {
                this.windowHeight = this.$el.clientHeight;
                this.windowWidth = this.$el.clientWidth;
                this.canvas = this.$el.querySelector("#snow-canvas");
                this.ctx = this.canvas.getContext("2d");
                this.canvas.style.width = this.canvas.width = this.windowWidth;
                this.canvas.style.height = this.canvas.height =
                    this.windowHeight;
                this.createSnows();
                const image = new Image();
                image.src = "/img/snow.png";
                image.addEventListener("load", () => {
                    this.image = image;
                    resolve();
                });
                // this.canvas.style.background = "#000";
            });
        },
        // 构建雪花数组
        createSnows() {
            this.snowList.splice(0, this.snowList.length);
            const boundary = {
                width: this.windowWidth,
                height: this.windowHeight,
            };
            for (let i = 0; i < this.maxSnowCount; i++) {
                const snow = new Snow();
                snow.init(
                    boundary,
                    this.maxSnowRadius,
                    this.maxSnowVx,
                    this.maxSnowVy
                );
                this.snowList.push(snow);
            }
        },
        clear() {
            this.ctx &&
                this.ctx.clearRect(0, 0, this.windowWidth, this.windowHeight);
        },
        async drawBg() {
            await this.init();
            this.draw();
        },
        draw() {
            this.clear();
            // repaint
            this.snowList.forEach((snow) => {
                // update snow,
                this.ctx.save();
                snow.update(
                    { width: this.windowWidth, height: this.windowHeight },
                    this.maxSnowRadius,
                    this.maxSnowVx,
                    this.maxSnowVy
                );

                this.ctx.fillStyle = "#fff";
                this.ctx.beginPath();
                this.ctx.drawImage(
                    this.image,
                    snow.x,
                    snow.y,
                    snow.radius,
                    snow.radius
                );
                // this.ctx.arc(snow.x, snow.y, snow.radius, 0, Math.PI * 2);
                this.ctx.closePath();
                this.ctx.globalAlpha = snow.alpha;
                this.ctx.fill();
                this.ctx.restore();
            });
            this.animationId = requestAnimationFrame(this.draw);
        },
    },
    mounted() {
        this.drawBg();
        window.onresize = () => {
            cancelAnimationFrame(this.animationId);
            this.drawBg();
        };
    },
};
</script>
<style lang="less" scoped>
.container {
    width: 100%;
    height: 100%;
}
</style>
