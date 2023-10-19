<template>
    <div class="count-down-proxy-container">
        <component
            :is="renderType"
            :title="prop.title"
            :lastDays="lastDays"
            @contextmenu.native.stop.prevent="handleCommonWidgetContextMenu"
        ></component>

        <!-- 右键弹出菜单 -->
        <transition
            name="custom-classes-transition"
            enter-active-class="rambler__animated fadeInRight"
            leave-active-class="rambler__animated fadeOut"
        >
            <div
                class="fixed-countdown-contextmenu global-popup-container"
                v-if="contextMenuVisible"
                :style="{
                    left: contextMenuPosition.left + 'px',
                    top: contextMenuPosition.top + 'px',
                }"
            >
                <div class="contextmenu-item" is-single="true">
                    <li @click.stop="showEdit">
                        <rambler-icon
                            name="edit"
                            class="prefix-icon"
                        ></rambler-icon
                        ><span>编辑组件</span>
                    </li>
                </div>
                <div class="contextmenu-item" is-single="true">
                    <li @click.stop="hideWidget">
                        <rambler-icon
                            name="hide"
                            class="prefix-icon"
                        ></rambler-icon>
                        <span>隐藏</span>
                    </li>
                </div>
                <div
                    class="contextmenu-item contextmenu-item-danger"
                    is-single="true"
                >
                    <li @click.stop="deleteWidget">
                        <rambler-icon
                            name="delete"
                            class="prefix-icon"
                        ></rambler-icon>
                        <span>删除</span>
                    </li>
                </div>
                <div class="contextmenu-item multi-contextmenu-item">
                    <li><p>大小</p></li>
                    <div class="inner-box">
                        <span
                            @click.stop="updateType(1)"
                            :class="[prop.type == '1x1' ? 'choosen' : '']"
                            >1 x 1</span
                        >
                        <span
                            @click.stop="updateType(2)"
                            :class="[prop.type == '3x1' ? 'choosen' : '']"
                            >3 x 1</span
                        >
                        <span
                            @click.stop="customSite"
                            :class="[prop.type == '3x2' ? 'choosen' : '']"
                            >3 x 2</span
                        >
                    </div>
                </div>
            </div>
        </transition>

        <!-- 编辑弹窗 -->
        <rambler-dialog
            :visible.sync="editFormVisible"
            :title="'修改 ' + prop.title"
            width="600px"
            top="100px"
        >
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
                            <el-input v-model="form.date"></el-input>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </rambler-dialog>
    </div>
</template>
<script>
import CountDown1x1 from "./1x1";
import CountDown3x1 from "./3x1";
import CountDown3x2 from "./3x2";
import widgetMixin from "../../mixins/widget-common";
export default {
    name: "Site",
    mixins: [widgetMixin],
    props: {
        url: String,
        prop: {
            type: Object,
            default: () => ({
                title: "倒计时",
                date: new Date(),
                type: "3x1",
            }),
        },
    },
    data() {
        return {
            activePanel: "site-info",
            form: {
                title: "",
                date: new Date(),
            },
        };
    },
    computed: {
        renderType: function () {
            return "CountDown" + this.prop.type;
        },
        lastDays() {
            // 总共秒数
            let betweenSecond = (this.prop.date.getTime() - Date.now()) / 1000;
            // 取整求天数
            const lastDays = Math.floor((betweenSecond / 60) * 60 * 24);
            return lastDays;
        },
    },
    methods: {},
    components: {
        CountDown1x1,
        CountDown3x1,
        CountDown3x2,
    },
};
</script>
<style lang="less" scoped>
.count-down-proxy-container {
    width: 100%;
    height: 100%;
}
.fixed-countdown-contextmenu {
    width: 132px;
    position: fixed;
    z-index: 999;
}
</style>
