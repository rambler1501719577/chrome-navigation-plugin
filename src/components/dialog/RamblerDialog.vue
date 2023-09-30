<template>
    <div class="rambler-dialog-container">
        <el-dialog
            :custom-class="customClass"
            :title="$slots.title ? '' : title"
            :visible.sync="show"
            :width="width"
            v-draggable
            :top="top"
            :append-to-body="appendToBody"
            :modal="modal"
            :fullscreen="fullscreen"
            :destroy-on-close="destroyOnClose"
            :modal-append-to-body="modalAppendToBody"
            :before-close="beforeClose"
            :close-on-click-modal="closeOnClickModal"
            :show-close="false"
            @open="open"
            @opened="opened"
            @close="close"
            @closed="closed"
        >
            <!-- 有写弹窗头部则采用输入的 -->
            <template v-if="$slots.title">
                <span slot="title">
                    <slot name="title" />
                </span>
            </template>
            <!-- 自定义默认头部 -->
            <template v-if="!$slots.title">
                <div slot="title" class="biu-default-header-box">
                    <div class="biu-default-header-title">{{ title }}</div>
                    <div
                        class="biu-default-header-close"
                        @click="beforeClose2"
                        v-if="showClose"
                    >
                        <span class="biu-icon-guanbi2"></span>
                    </div>
                </div>
            </template>
            <!-- 弹窗内容区域 -->
            <slot />
            <!-- 弹窗底部区域 -->
            <template v-if="$slots.footer">
                <span slot="footer">
                    <slot name="footer" />
                </span>
            </template>
            <!-- 自定义默认头部 -->
            <template v-if="!$slots.footer">
                <div slot="footer" class="biu-default-header-box"></div>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { startDrag } from "./util";
export default {
    name: "biuDialog",
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: "提示",
        },
        appendToBody: {
            // Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true
            type: Boolean,
            default: true,
        },
        modalAppendToBody: {
            // 遮罩层是否插入至 body 元素上，若为 false，则遮罩层会插入至 Dialog 的父元素上
            type: Boolean,
            default: true,
        },
        modal: {
            // 是否需要遮罩层
            type: Boolean,
            default: true,
        },
        fullscreen: {
            // 是否全屏
            type: Boolean,
            default: false,
        },
        destroyOnClose: {
            // 关闭时销毁 Dialog 中的元素
            type: Boolean,
            default: true,
        },
        width: {
            type: String,
            default: "30%",
        },
        top: {
            type: String,
            default: "15vh",
        },
        customClass: {
            type: String,
            default: "rambler-dialog",
        },
        showClose: {
            type: Boolean,
            default: false,
        },
        closeOnClickModal: {
            type: Boolean,
            default: true,
        },
        beforeClose: {
            type: Function,
        },
    },
    computed: {
        show: {
            get() {
                return this.visible;
            },
            set(val) {
                console.log(val);
                this.$emit("update:visible", val); // visible 改变的时候通知父组件
            },
        },
    },
    directives: {
        draggable: (el, binding) => {
            // 绑定拖拽事件 [绑定拖拽触发元素为弹框头部、拖拽移动元素为整个弹框]
            startDrag(
                el.querySelector(".el-dialog__header"),
                el.querySelector(".el-dialog"),
                binding.value
            );
        },
    },
    data() {
        return {};
    },
    methods: {
        //点击自定义的关闭按钮
        beforeClose2() {
            this.beforeClose(() => {
                this.show = false;
            });
        },
        open() {
            // Dialog 打开的回调
            this.$emit("open");
        },
        opened() {
            // Dialog 打开动画结束时的回调
            this.$emit("opened");
        },
        close() {
            // Dialog 关闭的回调
            this.$emit("close");
        },
        closed() {
            // Dialog 关闭动画结束时的回调
            this.$emit("closed");
        },
        cancel() {
            this.$emit("cancel");
        },
        submit() {
            this.$emit("submit");
        },
    },
};
</script>

<style lang="less">
.rambler-dialog {
    // .el-dialog__header {
    //     padding: 0;
    // }
    .el-dialog__footer {
        padding: 0;
    }
}
</style>
