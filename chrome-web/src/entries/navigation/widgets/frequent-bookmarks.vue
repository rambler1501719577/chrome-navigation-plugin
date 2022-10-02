<template>
    <div class="frequent-bookmarks-container">
        <div
            class="bookitem"
            v-for="bookmark of commonBookmark"
            :key="bookmark.url"
        >
            <a :href="bookmark.url" target="_blank">
                <image-card
                    :name="bookmark.name"
                    :url="bookmark.url"
                    :icon="bookmark.icon"
                ></image-card>
            </a>
        </div>
    </div>
</template>

<script>
import _ from "lodash";
import { getFaviconByUrl } from "@/utils/index";
import { getHostFromUrl } from "@/utils/index";
import ImageCard from "../components/image-card";
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
    components: {
        ImageCard
    },
    methods: {
        loadIcons: async function() {
            const icons = _.cloneDeep(this.frequentBookmarks);
            let iconMap = {};
            // 从localstorage读取缓存
            const cacheMap = localStorage.getItem("iconMap");
            if (cacheMap) {
                try {
                    iconMap = JSON.parse(cacheMap);
                } catch (e) {
                    iconMap = {};
                    throw new Error("解析缓存iconMap失败");
                }
            }
            for (let icon of icons) {
                const host = getHostFromUrl(icon.url);
                if (iconMap[host]) {
                    icon["icon"] = iconMap[host];
                } else {
                    const iconSrc = await getFaviconByUrl(host);
                    iconMap[host] = iconSrc;
                }
            }
            this.commonBookmark = icons;
            localStorage.setItem("iconMap", JSON.stringify(iconMap));
        }
    },
    created() {
        this.loadIcons();
    }
};
</script>
<style lang="less" scoped>
.frequent-bookmarks-container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .bookitem {
        width: 100px;
        min-height: 100px;
        margin-right: 20px;
        margin-bottom: 20px;
        cursor: pointer;
        padding-top: 15px;
        transition: all 0.5s;
        border-radius: 10px;
        &:hover {
            background-color: rgba(229, 229, 229, 0.5);
        }
    }
}
</style>
