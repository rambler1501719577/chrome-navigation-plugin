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
                                <el-radio-button label="SiteTypeCustom"
                                    >自定义</el-radio-button
                                >
                            </el-radio-group>
                        </div>
                    </div>
                    <template v-if="form.renderType == 'SiteTypeCustom'">
                        <template v-if="!form.backgroundType">
                            <div class="custom-design-box">
                                <div class="form-item">
                                    <div class="label">
                                        <p>背景色</p>
                                    </div>
                                    <div class="form-content">
                                        <el-color-picker
                                            v-model="form.backgroundColor"
                                        ></el-color-picker>
                                        <el-button
                                            type="text"
                                            style="margin-left: 15px"
                                            @click="chooseFile"
                                            >上传背景?</el-button
                                        >
                                    </div>
                                </div>
                                <div class="form-item">
                                    <div class="label">
                                        <p>图标文本</p>
                                    </div>
                                    <div class="form-content">
                                        <el-checkbox
                                            v-model="form.withText"
                                            style="margin-left: 5px"
                                            @change="handleShowTextChange"
                                        ></el-checkbox>
                                        <el-input
                                            v-model="form.text"
                                            maxlength="10"
                                            show-word-limit
                                            placeholder="输入图标文本"
                                            :disabled="!form.withText"
                                            style="
                                                width: 200px;
                                                margin-left: 20px;
                                            "
                                        ></el-input>
                                    </div>
                                </div>
                                <div class="form-item" v-if="form.withText">
                                    <div class="label">
                                        <p>文本颜色</p>
                                    </div>
                                    <div class="form-content">
                                        <el-color-picker
                                            v-model="form.textColor"
                                        ></el-color-picker>
                                        <span style="margin: 0 15px 0 15px"
                                            >字体大小</span
                                        >
                                        <el-input-number
                                            v-model="form.textSize"
                                            style="width: 120px"
                                        ></el-input-number>
                                    </div>
                                </div>
                            </div>
                        </template>
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
import SiteTypeCustom from "./custom";
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
            },
        };
    },
    computed: {
        renderType: function () {
            return "SiteType" + this.prop.type;
        },
        extraActions: function () {
            const extraActionKey = Object.keys(this.prop).filter(
                (item) =>
                    item !== "openOn" && item !== "type" && item != "style"
            );
            return extraActionKey.map((e) => ({
                title: e,
                value: this.prop[e],
            }));
        },
        previewProp: function () {
            const previewProps = {
                ...this.prop,
            };
            const style = {
                backgroundColor: this.form.backgroundColor,
            };
            if (this.form.withText) {
                style["text"] = this.form.text;
                style["textSize"] = this.form.textSize;
                style["textColor"] = this.form.textColor;
            }
            previewProps["style"] = JSON.stringify(style);
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
        handleShowTextChange() {
            this.form.text = this.title;
        },
        customSite() {
            if (this.prop.hasOwnProperty("style")) {
                this.updateType("Custom");
            } else {
                this.showEdit();
                this.form.renderType = "SiteTypeCustom";
            }
        },
        chooseFile() {
            // TODO 显示选择文件弹窗
            this.$ramblerNotification.info("开发中");
        },
        // 样式切换回调
        handleStyleChange(type) {},
        // 更新当前书签属性
        sureUpdate() {
            const styles = {
                backgroundColor: this.form.backgroundColor,
            };
            if (this.form.text != "") {
                styles["text"] = this.form.text;
                styles["textSize"] = this.form.textSize;
                styles["textColor"] = this.form.textColor;
            }
            const originData = {
                component: "site",
                height: this.height,
                width: this.width,
                id: this.id,
                url: this.form.url,
                show: true,
                title: this.form.title,
                props: {
                    type: this.form.renderType.replace("SiteType", ""),
                    style: JSON.stringify(styles),
                },
            };
            const payload = _.cloneDeep(originData);
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
            this.form.text = "";
            if (this.prop.hasOwnProperty("style")) {
                const style = JSON.parse(this.prop.style);
                this.form.backgroundColor = style.backgroundColor;
                if (style.text && style.text !== "") {
                    this.form.withText = true;
                    this.form.text = style.text;
                    this.form.textColor = style.textColor;
                    this.form.textSize = style.textSize;
                }
            }
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
        .custom-design-box {
            width: 100%;
        }
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
            width: 80px;
            height: 110px;
            .icon {
                width: 80px;
                height: 80px;
            }
            .title {
                height: 30px;
                width: 80px;
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
