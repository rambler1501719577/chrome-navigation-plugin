<template>
    <div class="edit-site-container">
        <div class="form">
            <el-collapse v-model="activePanel" accordion>
                <el-collapse-item title="组件基本信息" name="site-info">
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
                </el-collapse-item>
                <el-collapse-item title="组件样式" name="site-style">
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
                                            size="small"
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
                                                width: 100%;
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
                                            size="small"
                                        ></el-color-picker>
                                        <span style="margin: 0 10px 0 10px"
                                            >字体大小</span
                                        >
                                        <el-input-number
                                            v-model="form.textSize"
                                            style="width: 115px"
                                            size="small"
                                        ></el-input-number>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <el-button>上传背景</el-button>
                        </template>
                    </template>
                </el-collapse-item>
                <el-collapse-item name="site-link">
                    <template slot="title">
                        定制快捷访问
                        <el-popover
                            placement="top-start"
                            title="关于快捷访问"
                            width="320"
                            trigger="hover"
                        >
                            <div class="site-popover-container">
                                <p class="desc">
                                    设置当前“ 组件 ”
                                    的右键菜单，如你想快捷跳转爱奇艺电影页，可以按照这样配置
                                </p>
                                <div class="line">
                                    <span>标题: </span>
                                    <el-input
                                        size="small"
                                        value="爱奇艺电影"
                                    ></el-input>
                                </div>
                                <div class="line">
                                    <span>链接: </span>
                                    <el-input
                                        size="small"
                                        value="https://www.iqiyi.com/dianying/"
                                    ></el-input>
                                </div>
                            </div>

                            <rambler-icon
                                name="help"
                                slot="reference"
                                style="
                                    position: relative;
                                    top: 1.5px;
                                    left: 3px;
                                "
                            ></rambler-icon>
                        </el-popover>
                    </template>
                    <div class="site-link-container">
                        <div
                            style="
                                margin-bottom: 10px;
                                display: flex;
                                justify-content: flex-end;
                            "
                        >
                            <el-button @click="addRow" type="text"
                                >添加</el-button
                            >
                        </div>
                        <!-- 已有快捷访问列表 -->
                        <div
                            class="site-link-item"
                            v-for="(link, index) of form.siteLinks"
                            :key="index"
                        >
                            <div class="site-link-title">
                                <p>标题：</p>
                                <el-input
                                    placeholder="名称"
                                    v-model="link.key"
                                    size="small"
                                />
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="small"
                                    class="delete-btn"
                                    @click.native="deleteRow(link.id)"
                                    circle
                                ></el-button>
                            </div>
                            <div class="site-link-value">
                                <p>链接：</p>
                                <el-input
                                    placeholder="超链接地址"
                                    v-model="link.value"
                                    size="small"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="extr"></div>
                </el-collapse-item>
            </el-collapse>

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
</template>
<script>
import { v4 } from "uuid";
import _ from "lodash";
import { mapActions } from "vuex";
import SiteType1 from "./type1";
import SiteType2 from "./type2";
import SiteTypeCustom from "./custom";
export default {
    name: "SiteEditForm",
    props: {
        id: String,
        url: String,
        title: String,
        prop: {
            type: Object,
            default: () => ({
                type: 1,
                openOn: "_blank",
            }),
        },
    },
    watch: {
        title: {
            immediate: true,
            handler: function (newVal) {
                this.form.title = newVal;
            },
        },
        url: {
            immediate: true,
            handler: function (newVal) {
                this.form.url = newVal;
            },
        },
        prop: {
            deep: true,
            immediate: true,
            handler: function (newProp) {
                this.form.renderType = this.renderType;
                // 清空text并从style中重新读取style
                this.form.text = "";
                if (newProp.hasOwnProperty("style")) {
                    const style = JSON.parse(newProp.style);
                    this.form.backgroundColor = style.backgroundColor;
                    if (style.text && style.text !== "") {
                        this.form.withText = true;
                        this.form.text = style.text;
                        this.form.textColor = style.textColor;
                        this.form.textSize = style.textSize;
                    }
                }
                if (newProp.hasOwnProperty("link")) {
                    this.form.siteLinks = [];
                    const links = JSON.parse(newProp.link);
                    Object.keys(links).forEach((key) => {
                        this.form.siteLinks.push({
                            key: key,
                            value: links[key],
                        });
                    });
                }
            },
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
        };
    },
    computed: {
        renderType: function () {
            return "SiteType" + this.prop.type;
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
    methods: {
        ...mapActions("layout", ["updateSiteWidget"]),
        handleShowTextChange() {
            this.form.text = this.title;
        },
        deleteRow(id) {
            console.log(id);
            const idx = this.form.siteLinks.findIndex((v) => v.id == id);
            if (idx !== -1) {
                this.form.siteLinks.splice(idx, 1);
            }
        },
        addRow() {
            this.form.siteLinks.push({
                key: "",
                value: "",
                id: v4(),
            });
        },
        chooseFile() {
            // TODO 显示选择文件弹窗
            this.$ramblerNotification.info(
                "别催，键盘都打出火星字了，还催！！"
            );
        },
        // 样式切换回调
        handleStyleChange(type) {},
        // 更新当前书签属性
        sureUpdate() {
            // 样式
            const styles = {
                backgroundColor: this.form.backgroundColor,
            };
            if (this.form.text != "") {
                styles["text"] = this.form.text;
                styles["textSize"] = this.form.textSize;
                styles["textColor"] = this.form.textColor;
            }
            const links = {};
            for (let i = 0; i < this.form.siteLinks.length; i++) {
                let link = this.form.siteLinks[i];
                links[link.key] = link.value;
            }
            // 快捷访问
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
                    link: JSON.stringify(links),
                },
            };
            const payload = _.cloneDeep(originData);
            this.$emit("sure", payload);
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
        .el-collapse {
            border: none;
        }
        .el-collapse-item__wrap {
            border: none;
        }
        .el-collapse-item {
            margin-bottom: 10px;
        }
        .el-collapse-item__header {
            background: #f0eeee;
            height: 34px;
            padding-left: 10px;
            border: none;
            border-radius: 5px;
        }
        .el-collapse-item__content {
            padding: 15px 15px 0 15px;
        }
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
        .site-link-container {
            width: 100%;
            .site-link-item {
                .el-input {
                    flex: 1;
                }
                p {
                    width: 45px;
                }
                margin-bottom: 8px;
                .site-link-title {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    .delete-btn {
                        margin-left: 10px;
                    }
                }
                .site-link-value {
                    display: flex;
                    align-items: center;
                }
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
<style lang="less">
.site-popover-container {
    .desc {
        line-height: 200%;
        color: #333;
        font-size: 14px;
        margin-bottom: 10px;
    }
    .line {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        span {
            width: 50px;
        }
    }
}
</style>
