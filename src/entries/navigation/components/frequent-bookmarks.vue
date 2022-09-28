<template>
    <div class="frequent-bookmarks-container">
        <div
            class="bookitem"
            v-for="bookmark of commonBookmark"
            :key="bookmark.url"
        >
            <a :href="bookmark.url" target="_blank">
                <div class="icon">
                    <img :src="bookmark.icon" alt="" width="100%" />
                </div>
                <div class="description">
                    <p>{{ bookmark.name }}</p>
                </div>
            </a>
        </div>
    </div>
</template>

<script>
import _ from "lodash";
import { getFaviconByUrl } from "@/utils/index";
import { mapGetters } from "vuex";
export default {
    name: "FrequesntBookmarks",
    data() {
        return {
            commonBookmark: []
        };
    },
    computed: {
        ...mapGetters("setting", ["frequentBookmarks"])
    },
    methods: {},
    async created() {
        const key = "iconMap";
        // 从浏览器中读取缓存的url和icon映射格式
        const iconMap = {};
        const cacheMap = localStorage.getItem(key);
        if (cacheMap) {
            const tempMap = JSON.parse(cacheMap);
            Object.keys(tempMap).forEach(key => {
                iconMap[key] = tempMap[key];
            });
        }
        const bookmarks = _.cloneDeep(this.frequentBookmarks);
        for (let bookmark of bookmarks) {
            // 读取缓存
            const url = bookmark.url;
            if (iconMap[url]) {
                bookmark.icon = iconMap[url];
            } else {
                console.log(`fetching icons by ${url} from grab`);
                const icons = await getFaviconByUrl(bookmark.url);
                if (icons.length > 0) {
                    const src = icons[0].src;
                    bookmark.icon = src;
                    iconMap[url] = src;
                }
            }
        }
        localStorage.setItem(key, JSON.stringify(iconMap));
        this.commonBookmark = bookmarks;
    }
};
</script>
<style lang="stylus" scoped>
.frequent-bookmarks-container
    display flex
    justify-content center
    flex-wrap wrap
    .bookitem
        width 100px
        min-height 100px
        margin-right 20px
        margin-bottom 20px
        cursor pointer
        padding-top 15px
        transition all 0.5s
        border-radius 10px
        .icon
            padding 10px
            width 50px
            height 50px
            background #fff
            margin 0 auto
            border-radius 8px
            margin-bottom 10px
        .description
            text-align center
            color #333
            height 20px
            max-width 100px
            overflow hidden
            line-height 20px
            p
                margin 0 auto
                max-width 80px
                white-space nowrap
                overflow hidden
                text-overflow ellipsis
        &:hover
            background-color rgba(229,229,229,0.5)
</style>
