<template>
    <div
        id="nav"
        :class="headerStyle"
        style="
            opacity: 1;
            z-index:999;
            animation: 1s ease 0s 1 normal none running headerNoOpacity;
        "
    >
        <div class="header"><a href="/" class="description">苏浩の博客</a></div>
        <div class="menu">
            <ul>
                <li v-for="(item, index) of menuList" :key="index">
                    <router-link :to="item.url">{{ item.name }}</router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    props: {},
    data() {
        return {
            headerStyle: [], // header动态class
            scrollTop: 0,
            menuList: []
        };
    },
    methods: {
        scrollEvent: function() {
            // 保存滚动状态,用于控制header样式
            const lastVal = this.scrollTop;
            let nowVal = document.documentElement.scrollTop || document.body.scrollTop;
            if (lastVal > nowVal) {
                this.headerStyle = ['visible'];
            } else {
                this.headerStyle = ['fixed'];
            }
            this.scrollTop = nowVal;
            if (this.scrollTop == 0) {
                this.headerStyle = [];
            }
        }
    },
    created() {
        this.menuList = this.$store.getters.menu;
    },
    mounted() {
        window.addEventListener('scroll', this.scrollEvent);
    }
};
</script>

<style lang="stylus" scoped>
#nav
    position absolute
    top 0
    width 100%
    z-index 15
    height 60px
    padding 10px 36px
    overflow hidden
    display flex
    color #4C4948
    justify-content space-between
    .header
        .description
            font-weight bold
            font-size 18px
            line-height 40px
            color #fff
            text-decoration none
    .menu
        ul
            display flex
            li
                list-style none
                font-size 16px
                margin 0 15px
                height 35px
                transition all ease-in 1s
                position relative
                a
                    float left
                    white-space nowrap
                    overflow hidden
                    line-height 40px
                    color #fff
                    font-size 15px
                    text-decoration none
                    font-weight bold
            li:hover>a
                color #f3887e
.fixed
    position fixed
    top -60px
    background-color rgba(255, 255, 255, 0)
    color #fff
    transition all 1s
    a
        color #fff !important
.visible
    position fixed !important
    background-color rgba(6, 73, 92, 1)
    top 0 !important
    transition all 0.2s
    .header
        .description
            color #ffffff !important
    .menu
        a
            color #ffffff !important
</style>
