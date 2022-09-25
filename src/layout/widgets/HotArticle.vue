<template>
    <div class="rambler-hot-article">
        <div class="head">
            <h3>
                <i class="iconfont iconwenzhang"></i>
                热门文章
            </h3>
        </div>
        <div class="list">
            <ul>
                <li v-for="item of articleList" :key="item.id">
                    <div class="item">
                        <div class="content">
                            <a @click="articleUrl(item)">[{{ item.classifyName }}] {{ item.title }}</a>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            articleList: []
        };
    },
    methods: {
        articleUrl: function(item) {
            this.$router.push('/detail/' + item.id);
        }
    },
    mounted() {
        this.articleList = this.$store.getters.hotArticle;
    }
};
</script>

<style lang="stylus" scoped>
.rambler-hot-article
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
    .list
        padding 0px 15px 5px 15px
        ul
            li
                list-style none
                height 40px
                .item
                    display flex
                    cursor url('../../assets/cur/pointer.cur'), auto
                    .cover
                        width 40px
                        height 40px
                        margin-right 10px
                        overflow hidden
                        img
                            transition all 0.5s
                    .content
                        flex 1
                        position relative
                        a
                            display block
                            color #787372
                            font-size 15px
                            text-decoration none
                            line-height 40px
                        a:hover
                            color #006868
                        .time
                            position absolute
                            right 0
                            bottom 0
                            font-size 14px
                            color #ccc
                            line-height 20px
                .item:hover img
                    transform scale(1.2)
</style>
