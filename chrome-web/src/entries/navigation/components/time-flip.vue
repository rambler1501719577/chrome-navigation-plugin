<template>
    <div class="time-flip-container" draggable="false">
        <div class="time">
            <span>
                {{ time.hour[0] }}
                {{ time.hour[1] }}
            </span>

            <span>:</span>
            <span>
                {{ time.minute[0] }}
                {{ time.minute[1] }}
            </span>
        </div>
        <div class="date">
            {{ date.month }}月{{ date.date }}日, 星期{{ date.day }}
        </div>
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
                }
            },
            date: {
                month: "",
                date: "",
                day: ""
            }
        };
    },
    created() {
        this.updateTime();
        this.updateDate();
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
            setTimeout(this.updateTime, 1000);
        },
        updateDate() {
            const date = new Date();
            this.date.month = date.getMonth() + 1;
            this.date.date = date.getDate();
            const day = date.getDay();
            switch (day) {
                case 0:
                    this.date.day = "天";
                    break;
                case 1:
                    this.date.day = "一";
                    break;
                case 2:
                    this.date.day = "二";
                    break;
                case 3:
                    this.date.day = "三";
                    break;
                case 4:
                    this.date.day = "四";
                    break;
                case 5:
                    this.date.day = "五";
                    break;
                case 6:
                    this.date.day = "六";
                    break;
            }
        }
    }
};
</script>
<style lang="less" scoped>
.time-flip-container {
    margin: 0 auto;
    color: #fff;
    text-align: center;

    .time {
        height: 50px;
        line-height: 50px;
        font-size: 80px;
        margin-bottom: 40px;
        user-select: none;
    }
    .date {
        height: 50px;
        line-height: 50px;
        font-size: 40px;
        user-select: none;
    }
}
</style>
