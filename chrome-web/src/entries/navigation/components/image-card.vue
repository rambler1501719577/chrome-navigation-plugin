<template>
    <div class="image-card-container">
        <div class="icon">
            <div class="loading" v-if="!loadOver">
                <rambler-icon name="loading" class="rotate"></rambler-icon>
            </div>
            <template v-else>
                <div class="content" v-if="loadSucc"></div>
                <div v-else>
                    <img
                        width="100%"
                        src="@/assets/images/image-error.png"
                        alt=""
                    />
                </div>
            </template>
        </div>
        <div class="description">
            <p>{{ name }}</p>
        </div>
    </div>
</template>

<script>
import errImg from "@/assets/images/image-error.png";
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
            loadOver: false,
            loadSucc: true
        };
    },
    methods: {
        getImageUrl: function(url) {
            const host = getHostFromUrl(url);
            const key = "iconMap";
            return new Promise(async (resolve, reject) => {
                let iconMap = {};
                const cacheMap = localStorage.getItem(key);
                if (cacheMap) {
                    iconMap = JSON.parse(cacheMap);
                }
                let icon = "";
                // 有限从缓存中读取
                if (iconMap[host]) icon = iconMap[host];
                else {
                    try {
                        icon = await getFaviconByUrl(host);
                        this.$store.dispatch("setting/updateFavicon", {
                            src: host,
                            icon: icon
                        });
                    } catch (e) {
                        icon = "";
                    }
                }
                resolve(icon);
            });
        }
    },
    watch: {
        url: {
            immediate: true,
            handler: function(newVal) {
                if (!newVal) return;
                // 验证网站
                let siteReg = /https?:\/\/(\w+\.?)+/;
                if (!siteReg.test(newVal)) {
                    this.$message.error(`【${newVal}】不是正确的url`);
                    this.loadOver = true;
                    this.$nextTick(() => {
                        const image = document.createElement("img");
                        image.setAttribute("width", "100%");
                        image.src = errImg;
                        this.$el.querySelector(".icon").appendChild(image);
                    });
                } else {
                    // 获取主机并根据主机查询对应favicon
                    this.getImageUrl(newVal).then(url => {
                        this.loadOver = true;
                        if (url) {
                            const image = new Image();
                            image.src = url;
                            image.onload = () => {
                                this.loadSucc = true;
                                image.setAttribute("width", "100%");
                                this.$nextTick(() => {
                                    this.$el.querySelector(
                                        ".icon > .content"
                                    ).innerHTML = "";
                                    this.$el
                                        .querySelector(".icon > .content")
                                        .appendChild(image);
                                });
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
        color: #f8f0f0;
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
