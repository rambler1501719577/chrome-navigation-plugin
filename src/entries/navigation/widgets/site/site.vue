<template>
    <div class="proxy-site-container">
        <component
            :is="renderType"
            :url="url"
            :openOn="props.openOn"
            @contextmenu.native.stop.prevent="handleSiteContextMenu"
        >
        </component>
        <transition
            name="custom-classes-transition"
            enter-active-class="rambler__animated fadeInRight"
            leave-active-class="rambler__animated fadeOut"
        >
            <div
                class="fixed-site-contextmenu global-popup-container"
                v-if="contextMenuVisible"
                :style="{
                    left: contextMenuPosition.left + 'px',
                    top: contextMenuPosition.top + 'px',
                }"
            >
                <div class="contextmenu-item" is-single="true">
                    <li @click.stop="hide"><p>隐藏</p></li>
                </div>
                <div class="contextmenu-item multi-contextmenu-item">
                    <li><p>样式</p></li>
                    <div class="inner-box">
                        <span @click.stop="updateType(1)">款式一</span>
                        <span @click.stop="updateType(2)">款式二</span>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import _ from "lodash";
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
        this.$event.$on("widget-contextmenu", (payload) => {
            if (payload !== this.id && this.contextMenuVisible) {
                this.contextMenuVisible = false;
            }
        });
    },
    methods: {
        ...mapActions("layout", ["updateSiteWidget", "hideWidget"]),
        // 切换类型
        updateType(type) {
            const originData = {
                id: this.id,
                width: this.width,
                height: this.height,
                component: "site",
                title: this.title,
                props: this.props,
                url: this.url,
                show: true,
            };
            const payload = _.cloneDeep(originData);
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
            this.$event.$emit("widget-contextmenu", this.id);
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
    z-index: 999;
}
</style>
