<template>
    <div class="image-card-container">
        <div class="icon">
            <div class="loading" v-show="!loadOver">
                <rambler-icon name="loading" class="rotate"></rambler-icon>
            </div>
        </div>
        <div class="description">
            <p>{{ name }}</p>
        </div>
    </div>
</template>

<script>
import { getFaviconByUrl } from "@/utils/index";
import { getHostFromUrl } from "@/utils/index";
export default {
    name: "ImageCard",
    props: {
        url: String,
        name: String
    },
    data() {
        return {
            loadOver: false
        };
    },
    methods: {
        getImageUrl: function(url) {
            const host = getHostFromUrl(url);
            const key = "iconMap";
            return new Promise(async (resolve, reject) => {
                try {
                    let iconMap = {};
                    const cacheMap = localStorage.getItem(key);
                    if (cacheMap) {
                        iconMap = JSON.parse(cacheMap);
                    }
                    let icon = "";
                    // 有限从缓存中读取
                    if (iconMap[host]) icon = iconMap[host];
                    else icon = await getFaviconByUrl(host);
                    this.$store.dispatch("setting/updateFavicon", {
                        src: host,
                        icon: icon
                    });
                    resolve(icon);
                } catch (e) {
                    reject(e);
                }
            });
        }
    },
    created() {},
    watch: {
        name: {
            handler: function(newVal, oldVal) {
                console.log(newVal);
            }
        },
        url: {
            immediate: true,
            handler: function(newVal) {
                if (newVal) {
                    // 获取主机并根据主机查询对应favicon
                    this.getImageUrl(newVal).then(url => {
                        // 加载图标并关闭loading
                        if (url) {
                            const image = new Image();
                            image.src = url;
                            image.onload = () => {
                                this.loadOver = true;
                                image.setAttribute("width", "100%");
                                this.$el
                                    .querySelector(".icon")
                                    .appendChild(image);
                            };
                        }
                    });
                }
            }
        }
    }
};
</script>
<style lang="less" scoped>
@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
.image-card-container {
    .icon {
        padding: 10px;
        width: 50px;
        height: 50px;
        background: #fff;
        margin: 0 auto;
        border-radius: 8px;
        margin-bottom: 10px;
        position: relative;
        .loading {
            position: absolute;
            left: 10px;
            top: 10px;
            text-align: center;
            .rotate {
                font-size: 30px;
                animation: rotate 1.5s linear;
                animation-iteration-count: infinite;
            }
        }
    }

    .description {
        text-align: center;
        color: #333;
        height: 20px;
        max-width: 100px;
        overflow: hidden;
        line-height: 20px;
        p {
            margin: 0 auto;
            max-width: 80px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
}
</style>
