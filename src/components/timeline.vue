<template>
    <div class="timeline">
        <!-- 每个月份 -->
        <div class="timeline-month" v-for="(item, index) of data" v-if="item.data.length > 0">
            <div class="head">
                <div class="month">
                    <h3>{{ item.month }}月</h3>
                </div>
                <div class="part1"></div>
                <div class="part2"></div>
                <div class="part3"></div>
            </div>
            <ul>
                <template v-for="(child, subIndex) of item.data">
                    <li v-if="subIndex % 2 == 0">
                        <div class="tree-left tree-item">
                            <div class="tree-inside">
                                <div class="time">
                                    <p>{{ child.month }}月{{ child.day }}日</p>
                                </div>
                                <div class="title">
                                    <h3>{{ child.title }}</h3>
                                </div>
                                <div class="content" v-html="child.content"></div>
                            </div>
                        </div>
                    </li>
                    <li v-else>
                        <div class="tree-right tree-item">
                            <div class="tree-inside">
                                <div class="time">
                                    <p>{{ child.month }}月{{ child.day }}日</p>
                                </div>
                                <div class="title">
                                    <h3>{{ child.title }}</h3>
                                </div>
                                <div class="content" v-html="child.content"></div>
                            </div>
                        </div>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'finding',
    props: {
        data: Array
    },
    data() {
        return {};
    },
    computed: {},
    components: {},
    methods: {},
    mounted() {}
};
</script>

<style scoped="scoped" lang="stylus">
.timeline
    height 100vh
    .timeline-month
        margin-top 27px
        .head
            width 120px
            padding 0 0 104px 0
            margin 0 auto
            position relative
            .month
                position absolute
                top 50%
                left 50%
                color #fff
                font-size 24px
                transform translate(-50%, -50%)
            .part1
                width 0
                border-right 30px solid #000
                border-top 52px solid transparent
                border-bottom 52px solid transparent
                float left
            .part2
                width 60px
                height 104px
                background-color #000
                float left
            .part3
                width 0
                border-left 30px solid #000
                border-top 52px solid transparent
                border-bottom 52px solid transparent
                float left
        ul
            li
                list-style none
                width 4px
                position relative
                border 2px dotted #000
                box-sizing border-box
                margin 0 auto
                .tree-left
                    position relative
                    left calc((100vw - 280px) * -0.5)
                .tree-right
                    position relative
                    left 2px
                .tree-item
                    width calc((100vw - 280px) * 0.5)
                    padding 20px 50px 20px 50px
                    color #fff
                    .tree-inside
                        border 1px solid #000
                        color #000
                        position relative
                        padding 20px
                        .time
                            padding 3px 8px
                            background #000
                            color #fff
                            position absolute
                            left 20px
                            border-radius 8px
                            top 0
                            transform translateY(-50%)
                .date
                    width 24px
                    height 24px
                    position relative
                    left -12px
                    background #000
                    color #fff
                    text-align center
                    transform rotate(45deg)
                    p
                        transform rotate(315deg)
            li::after
                content ''
                width 24px
                height 24px
                background #000
                transform translateX(-50%) rotate(45deg)
                position absolute
                left 50%
</style>
