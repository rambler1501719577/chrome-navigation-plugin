<template>
    <div
        class="favicon-container"
        :style="{
            width: size + 'px',
            height: size + 'px',
        }"
        v-rambler-loading="loading"
    >
        <div class="content" v-if="loadSucc"></div>
        <div v-else>
            <img
                width="100%"
                class="error-img"
                src="@/assets/images/image-error.png"
                alt=""
            />
        </div>
    </div>
</template>

<script>
import { isUrl } from "@/utils";
export default {
    name: "Favicon",
    props: {
        url: String,
        // 图标大小，宽高比例为1
        size: {
            type: Number,
            default: 16,
        },
        // 圆形图标
        round: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            loadSucc: true,
            loading: true,
        };
    },
    directives: {
        "rambler-loading": {
            update(el, { value }) {
                if (!value) {
                    const dom = el.querySelector(".icon-loading");
                    dom && dom.remove();
                } else {
                    const svgDom = document.createElement("i");
                    svgDom.className = "iconfont icon-loading";
                    // style会打上hash值, 样式不会应用到当前i标签、因此这样写
                    svgDom.style =
                        "line-height: 20px;text-align: center;font-size: 16px;display: block;animation: rotate 1.7s linear infinite;";
                    const box = el.querySelector(".content");
                    if (box) {
                        box.innerHTML = "";
                        box.appendChild(svgDom);
                    }
                }
            },
        },
    },
    methods: {
        getImageUrl: function (url) {
            if (!chrome.runtime) {
                return "";
            }
            const prepareUrl = new URL(chrome.runtime.getURL("/_favicon/"));
            prepareUrl.searchParams.set("pageUrl", url);
            prepareUrl.searchParams.set("size", 128);
            return prepareUrl.toString();
        },
    },
    watch: {
        url: {
            immediate: true,
            handler: function (newVal) {
                this.loadSucc = true;
                this.loading = true;
                if (!newVal) return;
                // 验证网站
                if (!isUrl(newVal)) {
                    console.log(`【${newVal}】不是正确的url`);
                    this.loadSucc = false;
                } else {
                    // 获取主机并根据主机查询对应favicon
                    const url = this.getImageUrl(newVal);
                    if (url) {
                        const image = new Image();
                        image.src = url;
                        image.onload = () => {
                            this.loadSucc = true;
                            image.setAttribute("width", "100%");
                            this.$nextTick(() => {
                                this.$el.querySelector(".content").innerHTML =
                                    "";
                                this.$el
                                    .querySelector(".content")
                                    .appendChild(image);
                            });
                        };
                        image.onerror = () => {
                            this.loadSucc = false;
                        };
                    } else {
                        console.log("加载图标失败");
                        this.loadSucc = false;
                    }
                    this.loading = false;
                }
            },
        },
    },
};
</script>
<style lang="less" scoped>
.favicon-container {
    // overflow: hidden;
    .content {
        width: 100%;
        height: 100%;
        .icon-loading {
            line-height: 20px;
            text-align: center;
            font-size: 16px;
            display: block;
            animation: rotate 1.7s linear infinite;
        }
    }
    .error-img {
        width: 100%;
        height: 100%;
    }
}
</style>
