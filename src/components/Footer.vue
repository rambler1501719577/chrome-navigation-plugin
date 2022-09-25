<template>
    <div class="rambler-footer">
        <div class="site-time">
            <!-- 设置网站运行时间 -->
            <span>本站已经运行: {{year}}年 {{ day }}天 {{ hour }}小时 {{ minute }}分钟 {{ second }}秒</span>
        </div>
        <div class="archival-info">
            <span>
                <img src="../assets/images/icp.png" alt="" width="20px" />
                <a target="_blank" class="gov" href="http://beian.miit.gov.cn">鲁ICP备19010999号-2</a>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            day: 125,
            hour: 20,
            minute: 30,
            second: 15,
            year: 1,
            blogStartTime: '2019-4-10 18:19:00', //网站上线时间
            deg: 0
        };
    },
    methods: {
        updateTime() {
            setInterval(function() {
                this.calculateTime(this.blogStartTime);
            }, 1000);
        },
        /**
         * 分别更新网站运行的总天数,小时数,分钟数,秒数等
         * @time 2019年8月14日 15:34:00
         */
        calculateTime(time) {
            const startTime = new Date(time).getTime();
            let nowTime = new Date().getTime();
            let totalSeconds = (nowTime - startTime) / 1000;
            /* 月日时分这几个单位分别对应的秒数 */
            const yearSecond = 31536000; // 一年的秒数
            const daySecond = 86400; //一天的秒数
            const hourSecond = 3600; //一小时的秒数
            const minuteSecond = 60; //一分钟的秒数
            this.year = parseInt(totalSeconds / yearSecond + '');
            totalSeconds %= yearSecond;
            this.day = parseInt(totalSeconds / daySecond + '');
            totalSeconds %= daySecond;
            this.hour = parseInt(totalSeconds / hourSecond + '');
            totalSeconds %= hourSecond;
            this.minute = parseInt(totalSeconds / minuteSecond + '');
            totalSeconds %= minuteSecond;
            this.second = parseInt(totalSeconds + '');
        }
    },
    created() {},
    mounted() {
        let _this = this;
        setInterval(() => {
            _this.calculateTime(_this.blogStartTime);
        }, 1000);
    },
    beforeDestroy() {
        clearInterval(this.timer);
    }
};
</script>

<style lang="stylus" scoped>
.rambler-footer
    padding 10px 0
    width 100%
    color #fff
    font-size 0.8rem
    .site-time
        margin-bottom 10px
        text-align center
    .archival-info
        font-size 0.8rem
        text-align center
        span
            height 20px
            display flex
            justify-content center
            align-items center
            img, a
                color #fff
                text-decoration none
                margin-right 5px
</style>
