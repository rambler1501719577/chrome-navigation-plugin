<template>
    <div class="layout">
        <!-- 根据分辨率决定渲染手机端header还是pc端header -->
        <div class="rambler-content">
            <div class="con">
                <app-main
                    @nav-change="handlerNavChange"
                    ref="appMain"
                ></app-main>
            </div>
        </div>
        <affix class="affix"></affix>
    </div>
</template>

<script>
import Affix from "@/components/Affix";
import AppMain from "./components/AppMain";
import { scrollToTop } from "@/utils/index";
export default {
    name: "IndexLayout",
    data() {
        return {
            showSidebar: false, // 是否显示侧边栏
            customAsideArr: [], // 侧边栏展示哪些组件
            hasBanner: false, // 是否显示banner
            isCustomBanner: false, // 是否是自定义banner
            bannerText: "", // banner文字信息
            customBanner: "", // 自定义banner名称,
            isMobile: false,
            articleDetailText: "" // 文章详情，通过emit传递到这个中转
        };
    },
    provide: function() {
        return {
            article: this
        };
    },
    watch: {
        $route: {
            handler: function(newVal) {
                scrollToTop(0);
                this.handleRouteChange(newVal);
            }
        },
        "$store.getters.showSidebar": function(newVal) {
            this.showSidebar = newVal;
        }
    },
    components: {
        AppMain,
        Affix
    },
    methods: {
        handlerNavChange: function(val) {
            this.articleDetailText = val.content;
        },
        handleRouteChange: function(route) {
            // 控制是否展示左侧侧边栏, 以及展示哪些侧边栏
            let clientWidth = document.body.clientWidth;
            if (clientWidth < 768) {
                this.isMobile = true;
            } else {
                this.isMobile = false;
            }
            if (route.meta.aside) {
                this.showSidebar = true;
                this.customAsideArr = route.meta.aside.customAside;
                // 将信息同步到vuex中,完成右下角切换按钮的同步
                this.$store.dispatch("setting/toggleSidebar", {
                    showSidebar: this.showSidebar
                });
            } else {
                this.showSidebar = false;
            }
            // banner信息
            if (route.meta.banner) {
                this.hasBanner = true;
                if (route.meta.banner.isCustomBanner) {
                    this.isCustomBanner = true;
                    this.customBanner = route.meta.banner.customBanner;
                } else {
                    this.isCustomBanner = false;
                    this.bannerText =
                        route.meta.banner.bannerText || "默认Banner";
                }
            } else {
                this.hasBanner = false;
            }
        }
    },
    mounted() {
        const currentRoute = this.$route;
        // 根据路由参数定制banner和侧边栏
        this.handleRouteChange(currentRoute);
    }
};
</script>
<style scoped lang="stylus">
@import './styles/media.styl'

.layout
    box-sizing border-box
    font-size 20px
    min-height 100vh
    background-size cover
    background-repeat no-repeat
    background-attachment fixed
    overflow-x hidden
    background-image url('../assets/images/bg.jpg')
    .banner
        display block
        width 100%
</style>
