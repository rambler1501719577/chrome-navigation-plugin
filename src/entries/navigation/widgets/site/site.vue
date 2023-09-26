<template>
    <div class="proxy-site-container">
        <component
            :is="renderType"
            :url="url"
            :openOn="props.openOn"
            @contextmenu.native.stop.prevent="handleSiteContextMenu"
        >
        </component>
        <div
            class="fixed-site-contextmenu"
            v-if="contextMenuVisible"
            :style="{
                left: contextMenuPosition.left + 'px',
                top: contextMenuPosition.top + 'px',
            }"
        >
            <div class="contextmenu-item" is-single="true">
                <li @click.stop="hide"><p>隐藏</p></li>
            </div>
            <!-- <div class="contextmenu-item" is-single="true">
                <li><p>删除</p></li>
            </div> -->
            <div class="contextmenu-item multi">
                <li><p>样式</p></li>
                <div class="inner-box">
                    <span @click.stop="updateType(1)">款式一</span>
                    <span @click.stop="updateType(2)">款式二</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions } from "vuex";
import SiteType1 from "./type1";
import SiteType2 from "./type2";
export default {
    name: "Site",
    props: {
        id: String,
        url: String,
        width: String | Number,
        height: String | Number,
        title: String,
        props: {
            type: Object,
            default: () => ({
                type: 1,
                openOn: "_blank",
            }),
        },
    },
    data() {
        return {
            contextMenuVisible: false,
            contextMenuPosition: {
                left: 0,
                top: 0,
            },
        };
    },
    computed: {
        renderType: function () {
            return "SiteType" + this.props.type;
        },
    },
    mounted() {
        window.addEventListener("click", () => {
            if (this.contextMenuVisible) this.contextMenuVisible = false;
        });
    },
    methods: {
        ...mapActions("layout", ["updateSiteWidget", "hideWidget"]),
        // 切换类型
        updateType(type) {
            const payload = {
                id: this.id,
                width: this.width,
                height: this.height,
                component: "site",
                title: this.title,
                props: this.props,
                url: this.url,
            };
            payload.props["type"] = type;
            this.updateSiteWidget(payload)
                .then(() => {
                    this.contextMenuVisible = false;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        handleSiteContextMenu: function (e) {
            const { pageX, pageY } = e;
            this.contextMenuPosition.left = pageX;
            this.contextMenuPosition.top = pageY;
            this.contextMenuVisible = true;
        },
        // 隐藏组件
        hide() {
            this.hideWidget({ id: this.id, status: false });
        },
    },
    components: {
        SiteType1: SiteType1,
        SiteType2: SiteType2,
    },
};
</script>
<style lang="less" scoped>
@context-menu-padding: 8px;
.proxy-site-container {
    height: 100%;
}
.fixed-site-contextmenu {
    width: 120px;
    position: fixed;
    background-color: #0b0b0bcc;
    backdrop-filter: blur(10px);
    z-index: 999;
    padding: @context-menu-padding;
    box-sizing: border-box;
    border-radius: 3px;
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08),
        0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
    .contextmenu-item {
        li {
            border-radius: 3px;
            list-style: none;
            position: relative;
            display: block;
            width: 100%;
            height: 30px;
            color: #fff;
            font-size: 12px;
            line-height: 30px;
            box-sizing: border-box;
            padding-left: 5px;
        }
    }
    .contextmenu-item[is-single="true"] {
        li:hover {
            background: #787777;
            color: #fff;
        }
    }
    .multi {
        .inner-box {
            padding-left: 0px;
            span {
                display: inline-block;
                font-size: 10px;
                transform: scale(0.8);
                background-color: #737272;
                color: #fff;
                padding: 5px 6px;
                border-radius: 5px;
                &:hover {
                    background-color: #ffffff3e;
                }
            }
        }
    }
}
</style>
