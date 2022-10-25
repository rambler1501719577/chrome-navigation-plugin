<template>
    <div class="time-flip-container">
        <!-- <div class="hour">
            <div
                :class="{
                    digit: true,
                    flip: test
                }"
            >
                <span>1</span>
            </div>
        </div>
        <el-button @click="test = !test">
            翻转
        </el-button> -->
    </div>
</template>

<script>
export default {
    name: "TimeFlip",
    props: {},
    data() {
        return {
            time: {
                hour: {
                    0: 0,
                    1: 0
                },
                minute: {
                    0: 0,
                    1: 0
                },
                second: {
                    0: 0,
                    1: 0
                }
            },
            test: false
        };
    },
    created() {
        // this.updateTime();
    },
    methods: {
        updateTime() {
            const date = new Date();
            const hour = date.getHours();
            this.time.hour[0] = hour.toString()[0] || "0";
            this.time.hour[1] = hour.toString()[1] || "0";
            const minute = date.getMinutes();
            this.time.minute[0] = minute.toString()[0] || "0";
            this.time.minute[1] = minute.toString()[1] || "0";
            const second = date.getSeconds();
            this.time.second[0] = second.toString()[0] || "0";
            this.time.second[1] = second.toString()[1] || "0";
            setTimeout(this.updateTime, 1000);
        }
    }
};
</script>
<style lang="less" scoped>
.time-flip-container {
    // height: 100px;
    // width: 100%;
    margin: 0 auto;
    background: #fff;
    text-align: center;
    line-height: 100px;
    font-size: 30px;
    perspective: 1000;
    .hour {
        .digit {
            width: 100px;
            height: 100px;
            background: red;
            transition: all 0.3s linear;
            transform-origin: top;
        }
        .flip {
            transform: rotate3d(180deg, 0, 0);
        }
    }
}
</style>
