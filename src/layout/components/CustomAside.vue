<template>
    <div class="custom-container">
        <!-- 通过动态组件动态渲染左侧组件 -->
        <component class="item" :articleDetailText="articleDetailText" v-for="item in aside" :key="item.id" :is="item"></component>
    </div>
</template>

<script>
import RamblerAbout from '../widgets/About';
import RamblerHotArticle from '../widgets/HotArticle';
import RamblerTags from '../widgets/Tags';
import ArticleNav from '../widgets/Nav.vue';
export default {
    name: '',
    props: {
        aside: {
            type: Array,
            default: () => []
        },
        articleDetailText: String
    },
    data() {
        return {};
    },
    components: {
        RamblerAbout,
        RamblerHotArticle,
        RamblerTags,
        ArticleNav
    },
    methods: {},
    created() {}
};
</script>

<style scoped="scoped" lang="stylus">
.custom-container
    position sticky
    top 0
    .item
        background-color #fff
        border-radius 10px
        margin-bottom 20px
</style>
