<template>
    <div id="nav" class="visible" style="
            opacity: 1;
            z-index:999;
            animation: 1s ease 0s 1 normal none running headerNoOpacity;
        ">
        <div class="header"><a href="/" class="description">苏浩の博客</a></div>
        <div class="menu-icon">
            <i class="fa fa-bars" @click="toggleMenu"></i>
        </div>
        <div class="menu">
            <ul @click="nodeClick">
                <li v-for="(item, index) of menuList" :key="index">
                    <router-link :to="item.url"><i class="fa fa-star"></i>{{ item.name }}</router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    props:{},
    data() {
        return {
            headerStyle: [], // header动态class
            scrollTop: 0,
            menuList: [],
            isCollapse: true
        };
    },
    watch: {
        isCollapse: {
            handler: function(newVal) {
                let menu = document.getElementsByClassName("menu")[0];
                if(newVal) {
                    menu.style.height = 0;
                } else {
                    menu.style.height = this.menuList.length * 40 + 'px';
                }
            }
        }
    },
    methods: {
        toggleMenu: function() {
            this.isCollapse = !this.isCollapse;
        },
        nodeClick: function() {
            this.isCollapse = !this.isCollapse;
        }
    },
    created() {
        this.menuList = this.$store.getters.menu;
    },
};
</script>

<style lang="stylus" scoped>
#nav
    width 100%
    z-index 15
    height 60px
    padding 10px 15px
    color #4C4948
    position fixed !important
    background-color rgba(6, 73, 92, 1)
    top 0 !important
    transition all 0.2s
    .header
        float left
        .description
            font-weight bold
            font-size 18px
            line-height 40px
            color #fff
            text-decoration none
    .menu-icon
        float right
        margin 5px 0 5px 0
        width 30px
        height 30px
        display flex
        position relative
        justify-content center
        align-items center
        i
            color #fff
            cursor pointer
            font-size 24px
    .menu
        overflow hidden
        transition all 0.5s
        position absolute
        height 0
        top 60px
        left 0
        width 100%
        background-color #06495c
        z-index 99
        ul
            margin 0
            list-style none
            padding-bottom 10px
            border-top 1px solid #eee
            li
                height 40px
                a
                    text-decoration none
                    padding-left 15px
                    line-height 40px
                    display block
                    color #fff
                    font-size 16px
                    i
                        margin-right 10px
</style>
