<template>
    <div class="proxy-site-container">
        <component
            :is="renderType"
            :url="url"
            :props="props"
            :openOn="props.openOn"
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
                            name="open"
                            class="prefix-icon"
                        ></rambler-icon
                        ><span>编辑</span>
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
                        <span @click.stop="updateType(1)">款式一</span>
                        <span @click.stop="updateType(2)">款式二</span>
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
            <div class="edit-site-container">
                <div class="form">
                    <div class="form-item">
                        <div class="label">
                            <p>标题</p>
                        </div>
                        <div class="form-content">
                            <el-input v-model="form.title"></el-input>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="label">
                            <p>地址</p>
                        </div>
                        <div class="form-content">
                            <el-input v-model="form.url"></el-input>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="label">
                            <p>样式</p>
                        </div>
                        <div class="form-content">
                            <el-radio-group
                                v-model="form.renderType"
                                @input="handleStyleChange"
                            >
                                <el-radio-button label="SiteType1"
                                    >流金</el-radio-button
                                >
                                <el-radio-button label="SiteType2"
                                    >普通</el-radio-button
                                >
                                <el-radio-button label="Custom"
                                    >自定义</el-radio-button
                                >
                            </el-radio-group>
                        </div>
                    </div>
                    <template v-if="form.renderType == 'Custom'">
                        <!-- <div class="form-item">
                            <el-switch
                                v-model="form.backgroundType"
                                active-text="背景图片"
                                inactive-text="背景色"
                            >
                            </el-switch>
                        </div> -->
                        <template v-if="!form.backgroundType">
                            <div class="form-item">
                                <div class="label">
                                    <p>背景色</p>
                                </div>
                                <div class="form-content">
                                    <el-color-picker
                                        v-model="form.backgroundColor"
                                    ></el-color-picker>
                                </div>
                            </div>
                            <div class="form-item">
                                <div class="label">
                                    <p>文字颜色</p>
                                </div>
                                <div class="form-content">
                                    <el-color-picker
                                        v-model="form.fontColor"
                                    ></el-color-picker>
                                </div></div
                        ></template>
                        <template v-else>
                            <el-button>上传背景</el-button>
                        </template>
                    </template>
                    <div class="confirm-btn">
                        <rambler-button type="primary" @click="sureUpdate">
                            确定
                        </rambler-button>
                    </div>
                </div>
                <div
                    class="preview-box"
                    :style="{
                        backgroundImage: `url('${$store.getters.background}')`,
                    }"
                >
                    <div class="preview">
                        <div class="icon">
                            <component
                                :is="form.renderType"
                                :url="url"
                                :prop="previewProp"
                            >
                            </component>
                        </div>
                        <div class="title">{{ form.title }}</div>
                    </div>
                </div>
            </div>
        </rambler-dialog>
    </div>
</template>
<script>
import _ from "lodash";
import { mapActions } from "vuex";
import SiteType1 from "./type1";
import SiteType2 from "./type2";
import Custom from "./custom";
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
            editFormVisible: false, // 编辑弹窗
            form: {
                id: "",
                url: "",
                title: "",
                props: [],
                renderType: "",
                backgroundColor: "",
                fontColor: "",
                backgroundType: false, // false代表背景色模式
            },
        };
    },
    computed: {
        renderType: function () {
            return "SiteType" + this.props.type;
        },
        extraActions: function () {
            const extraActionKey = Object.keys(this.props).filter(
                (item) => item !== "openOn" && item !== "type"
            );
            return extraActionKey.map((e) => ({
                title: e,
                value: this.props[e],
            }));
        },
        previewProp: function () {
            const previewProps = Object.assign(this.props, {
                backgroundColor: this.form.backgroundColor,
                fontColor: this.form.fontColor,
            });
            console.log(previewProps);
            return previewProps;
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
            window.open(this.url, "_blank");
        },
        // 样式切换回调
        handleStyleChange(type) {},
        // 更新当前书签属性
        sureUpdate() {
            const payload = {
                component: "site",
                height: this.height,
                width: this.width,
                id: this.id,
                url: this.form.url,
                show: true,
                title: this.form.title,
                url: this.form.url,
            };
        },
        // 访问
        visit() {
            window.open(this.url, this.openOn);
        },
        // 打开编辑弹窗
        showEdit() {
            this.contextMenuVisible = false;
            this.editFormVisible = true;
            // 赋值
            this.form.id = this.id;
            this.form.title = this.title;
            this.form.url = this.url;
            this.form.renderType = this.renderType;
        },
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
        Custom: Custom,
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
<style lang="less">
.edit-site-container {
    display: flex;
    .form {
        flex: 1;
        .form-item {
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin-bottom: 20px;
            .label {
                width: 65px;
                height: 100%;
                vertical-align: middle;
            }
            .form-content {
                flex: 1;
                display: flex;
                align-items: center;
            }
        }
        .confirm-btn {
            display: flex;
            justify-content: flex-end;
        }
    }
    .preview-box {
        margin-left: 40px;
        width: 200px;
        height: 200px;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-size: cover;
        .preview {
            width: 100px;
            height: 130px;
            .icon {
                width: 100px;
                height: 100px;
            }
            .title {
                height: 30px;
                width: 100px;
                text-align: center;
                color: #ffffffae;
                font-size: 12px;
                font-weight: bold;
                line-height: 30px;
                overflow: hidden;
                text-overflow: ellipsis;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
            }
        }
    }
}
</style>
