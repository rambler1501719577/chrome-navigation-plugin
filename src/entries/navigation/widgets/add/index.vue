<template>
    <div
        class="add-widget-container"
        @click="showAddDialog"
        @contextmenu.stop.prevent="doNothing"
    >
        <rambler-icon name="add" class="add-icon"></rambler-icon>
        <rambler-dialog
            width="700px"
            :visible.sync="dialogVisible"
            :draggable="true"
            append-to-body
            title="添加组件"
        >
            <div class="dialog-add-component">
                <div class="component-gallary">
                    <div
                        v-for="(widget, index) of Object.keys(supportWidgets)"
                        @click="handleChooseChange(widget)"
                        :key="index"
                        :class="[
                            'gallary-item',
                            choosen == widget ? 'choosen' : '',
                        ]"
                    >
                        {{ supportWidgets[widget].label }}
                    </div>
                </div>
                <div class="widget-form">
                    <!-- 预览 -->
                    <div
                        class="preview"
                        :style="{
                            backgroundImage: `url('${$store.getters.background}')`,
                        }"
                    >
                        <div class="widget" :style="previewWidgetStyle">
                            <div class="cover"></div>
                            <grid-card
                                :component="previewWidget"
                                v-bind="previewWidgetProps"
                            ></grid-card>
                        </div>
                    </div>
                    <!-- 组件大小 -->
                    <div class="form-item">
                        <span>大小: </span>
                        <div class="form-content">
                            <el-radio-group v-model="form.size">
                                <el-radio-button
                                    v-for="(size, index) of supportSize"
                                    :key="index"
                                    :label="size[0] + 'x' + size[1]"
                                ></el-radio-button>
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="form-item">
                        <span>标题: </span>
                        <div class="form-content">
                            <el-input
                                placeholder="请输入标题"
                                v-model="form.title"
                            />
                        </div>
                    </div>
                    <div class="form-item" v-if="choosen == 'site'">
                        <span>地址: </span>
                        <div class="form-content">
                            <el-input
                                placeholder="请输入地址"
                                v-model="form.url"
                            />
                        </div>
                    </div>
                    <div class="add-confirm-btn">
                        <rambler-button type="primary" @click="sureAdd"
                            >确定</rambler-button
                        >
                    </div>
                </div>
            </div>
        </rambler-dialog>
    </div>
</template>
<script>
import widgetMixin from "../../mixins/widget-common";
import _ from "lodash";
import { supportWidgets, widgetPreviewProp } from "./config";
export default {
    name: "Add-Component",
    data() {
        return {
            dialogVisible: false,
            form: {
                component: "site",
                size: "1x1",
                url: "",
                title: "",
            },
            supportWidgets: supportWidgets,
            choosen: "site",
        };
    },
    mixins: [widgetMixin],
    computed: {
        previewWidget: function () {
            return this.choosen;
        },
        previewWidgetProps: function () {
            return widgetPreviewProp[this.choosen];
        },
        previewWidgetStyle() {
            const { width, height } = widgetPreviewProp[this.choosen];
            const style = {
                width: width ? width * 100 + "px" : "100px",
                height: height ? height * 100 + "px" : "100px",
            };
            return style;
        },
        supportSize: function () {
            return supportWidgets[this.choosen].supportSize;
        },
    },
    methods: {
        showAddDialog() {
            this.dialogVisible = true;
        },
        doNothing(e) {
            // todo
        },
        handleChooseChange(widget) {
            this.choosen = widget;
            this.form.component = widget;

            const props = supportWidgets[widget];
            const { supportSize } = props;
            this.form.size = supportSize[0][0] + "x" + supportSize[0][1];
        },
        // 添加到store并同步到数据库
        sureAdd() {
            const payload = _.cloneDeep(this.form);
            const size = this.form.size.split("x");
            payload["width"] = parseInt(size[0]);
            payload["height"] = parseInt(size[1]);
            delete payload.size;
            // prop属性
            if (this.previewWidgetProps.hasOwnProperty("prop")) {
                const prop = {};
                Object.keys(this.previewWidgetProps.prop).forEach((key) => {
                    prop[key] = this.previewWidgetProps.prop[key];
                });
                payload["prop"] = prop;
            }
            payload["show"] = true;
            this.add(payload)
                .then(() => {
                    this.$ramblerNotification.success("添加成功");
                    this.dialogVisible = false;
                })
                .catch((err) => {
                    this.$ramblerNotification.danger("添加失败");
                });
        },
    },
};
</script>

<style lang="less" scoped>
.add-widget-container {
    width: 100%;
    color: #fff;
    height: 100%;
    border-radius: 5px;
    background: #eeeeee7c;
    display: flex;
    justify-content: center;
    align-items: center;
    .add-icon {
        fill: #333;
        font-size: 18px;
    }
}
</style>
<style lang="less">
.dialog-add-component {
    padding: 15px;
    height: 500px;
    display: flex;
    .component-gallary {
        padding: 12px;
        padding-bottom: 0;
        width: 240px;
        height: 100%;
        background: #eee;
        overflow: hidden auto;
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        .gallary-item {
            width: 102px;
            height: 102px;
            margin-right: 12px;
            background: #b4b4b4;
            margin-bottom: 12px;
            text-align: center;
            line-height: 102px;
            border-radius: 3px;
            cursor: pointer;
            color: #333;
            &:hover {
                background: #2e9fc1;
                color: #fff;
            }
        }
        .choosen {
            background: #2e9fc1;
            color: #fff;
        }
        .gallary-item:nth-child(2n) {
            margin-right: 0;
        }
        .gallary-item:last-child {
            margin-bottom: 0;
        }
    }
    .widget-form {
        flex: 1;
        margin-left: 20px;
        height: 500px;
        box-sizing: border-box;
        overflow: hidden auto;
        .preview {
            padding: 20px;
            margin: 0 auto;
            margin-bottom: 20px;
            .widget {
                margin: auto;
                position: relative;
                .cover {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: 999;
                }
            }
        }
        .form-item {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            span {
                display: block;
                width: 60px;
            }
            .form-content {
                flex: 1;
            }
        }
    }
    .add-confirm-btn {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;
    }
}
</style>
