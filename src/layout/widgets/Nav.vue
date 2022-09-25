<template>
    <div class="rambler-article-nav">
        <div class="head"><h3>导航</h3></div>
        <div class="nav">
            <ul>
                <li
                    v-for="(item, index) of navList"
                    :key="index"
                    :style="{
                        paddingLeft: item.type * 16 + 'px'
                    }"
                >
                    {{ item.content }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            navList: []
        };
    },
    watch: {
        articleDetailText: {
            handler: function(val, oldVal) {
                this.navList = this.getNav(val);
            },
            immediate: true,
            deep: true
        }
    },
    props: {
        articleDetailText: String
    },
    inject: ['article'],
    methods: {
        getNav: function(text) {
            let reg = /^#{1,6}\s.*/gm;
            let result = text.match(reg) || [];
            return result.map(item => {
                return {
                    type: item.lastIndexOf('#'),
                    content: item.match(/(?<=#\s)(.*)/)[0]
                };
            });
        }
    },
    created() {
        // this.navList = this.getNav(this.articleDetailText);
    }
};
</script>
<style lang="stylus" scoped>
.rambler-article-nav
    padding 0 20px 20px 20px
    .head
        padding-top 10px
        line-height 40px
        margin-left 15px
        font-size 18px
        font-weight 600
        h3
            i
                margin-right 4px
                font-size 18px
    .nav
        ul
            list-style none
            li
                font-size 16px
                line-height 32px
</style>
