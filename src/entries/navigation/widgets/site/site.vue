<template>
    <div class="proxy-site-container">
        <component
            :is="renderType"
            :url="url"
            :prop="prop"
            :openOn="prop.openOn"
            @click.native="visit"
            @contextmenu.native.stop.prevent="handleSiteContextMenu"
        >
        </component>
        <!-- 右键弹出菜单 -->
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
                    <li @click.stop="openInNewTab">
                        <rambler-icon
                            name="open"
                            class="prefix-icon"
                        ></rambler-icon
                        ><span>新标签页打开</span>
                    </li>
                </div>
                <div class="contextmenu-item" is-single="true">
                    <li @click.stop="showEdit">
                        <rambler-icon
                            name="edit"
                            class="prefix-icon"
                        ></rambler-icon
                        ><span>编辑组件</span>
                    </li>
                </div>
                <template v-if="extraActions.length > 0">
                    <div
                        class="contextmenu-item"
                        is-single="true"
                        v-for="item of extraActions"
                        :key="item.title"
                    >
                        <li @click.stop="openInNewTab">
                            <rambler-icon
                                name="open"
                                class="prefix-icon"
                            ></rambler-icon
                            ><span>{{ item.title }}</span>
                        </li>
                    </div>
                </template>
                <template v-if="fastLinks.length > 0">
                    <div
                        class="contextmenu-item"
                        is-single="true"
                        v-for="item of fastLinks"
                        :key="item.key"
                    >
                        <li @click="visitFastLink(item)">
                            <rambler-icon
                                name="fast"
                                class="prefix-icon"
                            ></rambler-icon
                            ><span>{{ item.key }}</span>
                        </li>
                    </div>
                </template>
                <div class="contextmenu-item" is-single="true">
                    <li @click.stop="hide">
                        <rambler-icon
                            name="hide"
                            class="prefix-icon"
                        ></rambler-icon>
                        <span>隐藏</span>
                    </li>
                </div>
                <div class="contextmenu-item multi-contextmenu-item">
                    <li><p>样式</p></li>
                    <div class="inner-box">
                        <span
                            @click.stop="updateType(1)"
                            :class="[prop.type == '1' ? 'choosen' : '']"
                            >流金边框</span
                        >
                        <span
                            @click.stop="updateType(2)"
                            :class="[prop.type == '2' ? 'choosen' : '']"
                            >普通</span
                        >
                        <span
                            @click.stop="customSite"
                            :class="[prop.type == 'Custom' ? 'choosen' : '']"
                            >自定义</span
                        >
                    </div>
                </div>
            </div>
        </transition>

        <!-- 编辑弹窗 -->
        <rambler-dialog
            :visible.sync="editFormVisible"
            :title="'修改 ' + title"
            width="600px"
            top="100px"
        >
            <edit-form
                :prop="prop"
                :id="id"
                :url="url"
                :title="title"
                @sure="sureUpdate"
            ></edit-form>
        </rambler-dialog>
    </div>
</template>
<script>
import _ from "lodash";
import { mapActions } from "vuex";
import SiteType1 from "./type1";
import SiteType2 from "./type2";
import SiteTypeCustom from "./custom";
import EditForm from "./site-edit-form.vue";
export default {
    name: "Site",
    props: {
        id: String,
        url: String,
        width: String | Number,
        height: String | Number,
        title: String,
        prop: {
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
            activePanel: "site-info",
            editFormVisible: false, // 编辑弹窗
            form: {
                id: "",
                url: "",
                title: "",
                props: [],
                renderType: "",
                backgroundColor: "",
                backgroundType: false, // false代表背景色模式
                withText: false, //是否含有文本
                textColor: "",
                textSize: 30,
                text: "",
                // 快捷链接数组
                siteLinks: [],
            },
            fastLinks: [],
        };
    },
    created() {
        this.$watch(
            "prop",
            function (newVal) {
                if (newVal.link) {
                    this.fastLinks = [];
                    const links = JSON.parse(this.prop.link);
                    Object.keys(links).forEach((key) => {
                        this.fastLinks.push({
                            key: key,
                            value: links[key],
                        });
                    });
                }
            },
            { immediate: true }
        );
    },
    computed: {
        renderType: function () {
            return "SiteType" + this.prop.type;
        },
        extraActions: function () {
            const extraActionKey = Object.keys(this.prop).filter(
                (item) =>
                    item !== "openOn" &&
                    item !== "type" &&
                    item !== "style" &&
                    item !== "link"
            );
            return extraActionKey.map((e) => ({
                title: e,
                value: this.prop[e],
            }));
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
        openInNewTab() {
            this.contextMenuVisible = false;
            window.open(this.url, "_blank");
        },
        // 快捷链接访问
        visitFastLink(link) {
            window.open(link.value, "_self");
        },
        customSite() {
            if (this.prop.hasOwnProperty("style")) {
                this.updateType("Custom");
            } else {
                this.showEdit();
                this.form.renderType = "SiteTypeCustom";
            }
        },
        // 更新当前书签属性
        sureUpdate(payload) {
            payload["width"] = this.width;
            payload["height"] = this.height;
            this.updateSiteWidget(payload)
                .then(() => {
                    this.editFormVisible = false;
                })
                .catch((err) => {
                    this.$ramblerNotification.danger("保存失败");
                });
        },
        // 访问
        visit() {
            window.open(this.url, "_self");
        },
        // 打开编辑弹窗
        showEdit() {
            this.contextMenuVisible = false;
            this.editFormVisible = true;
        },
        // 切换类型
        updateType(type) {
            const originData = {
                id: this.id,
                width: this.width,
                height: this.height,
                component: "site",
                title: this.title,
                props: this.prop,
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
        SiteTypeCustom: SiteTypeCustom,
        EditForm,
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
