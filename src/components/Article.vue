<template>
    <div class="article-item">
        <!-- 文章标题 -->
        <header class="header">
            <div class="sticky-top"><rambler-icon v-if="article.top" name="affix" class="affix-icon"></rambler-icon></div>
            <div class="title">
                <h1>
                    <router-link :to="getArticleUrl()">{{ article.title }}</router-link>
                </h1>
            </div>
            <div class="article-meta">
                <div class="publish-date">
                    <span>{{ article.createTime }}</span>
                    <span>{{ article.updateTime }}</span>
                </div>
                <div class="tags" v-if="hasTag()"><rambler-tag v-for="(tag, index) of article.tags" :tag="tag" :key="index"></rambler-tag></div>
            </div>
        </header>
        <content class="content">
            <!-- 预览 -->
            <MdEditor background="#fff" :content="article.description"></MdEditor>
        </content>
    </div>
</template>

<script>
import MdEditor from 'components/editor/MdEditor';
export default {
    name: 'Article',
    props: {
        article: {
            type: Object,
            default: () => {
                ({
                    id: undefined,
                    title: '没有名称',
                    tags: [],
                    description: '该文章没有描述'
                });
            }
        },
        showTag: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        getArticleUrl: function() {
            let url = undefined;
            if (this.article.id) {
                url = '/detail/' + this.article.id;
            }
            return url;
        },
        // 判断是否显示标签
        hasTag: function() {
            if (!this.article.tags || this.article.tags.length == 0 || !this.showTag) {
                return false;
            }
            // 如果tags为空, 则后台返回的是[null]
            return this.article.tags.filter(item => item != null).length > 0;
        }
    },
    components: {
        MdEditor
    }
};
</script>

<style scoped="scoped" lang="stylus">
@import './styles/article.styl'

.article-item
    border-radius 5px
    padding 1rem
    background #fff
    .header
        position relative
        .sticky-top
            .affix-icon
                position absolute
                right 0
                top 0
                transform rotate(45deg)
        .title
            position relative
            h1
                a
                    text-decoration none
                    cursor url('../assets/cur/pointer.cur'), auto
                    font-size 2rem
                    font-weight 700
                    color #444950
                    font-family 'PingFang SC', 'Microsoft YaHei', sans-serif, Arial
                    display block
                    line-height 170%
                    text-align center
        .article-meta
            display flex
            justify-content center
            .publish-date
                font-size 16px
                color #606770
        .tag
            height 30px
            overflow hidden
            padding-top 5px
        .description
            color #333
            font-size 16px
            line-height 30px
            display -webkit-box
            -webkit-box-orient vertical
            -webkit-line-clamp 3
            overflow hidden
            padding 10px 10px 0 0
</style>
