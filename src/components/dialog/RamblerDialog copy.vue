<template>
    <!-- 用于做全屏的遮罩层 -->
    <transition
        name="custom-classes-transition"
        enter-active-class="rambler__animated fadeInDown"
        leave-active-class="rambler__animated fadeOutDown"
    >
        <div class="rambler-dialog" v-show="visible" :style="dynamicStyle">
            <div
                :class="['rambler_dialog__header', { 'drag-title': allowDrag }]"
                :style="{ height: headerHeight + 'px' }"
            >
                <slot name="header">
                    <div class="title">
                        <rambler-icon
                            :name="icon"
                            class="title-icon"
                        ></rambler-icon>
                        <span>{{ title }}</span>
                    </div>
                    <div class="btns">
                        <rambler-icon
                            name="close"
                            class="right-icon close"
                        ></rambler-icon>
                    </div>
                </slot>
            </div>
            <!-- 延迟渲染，解决background canvas获取不到高度问题 -->
            <div
                v-if="rendered"
                class="content"
                :style="{ width: renderWidth, height: renderHeight }"
            >
                <!-- 这里可以通过v-if控制销毁当前元素 -->
                <slot></slot>
            </div>
            <div class="footer"></div>
        </div>
    </transition>
</template>

<script>
import { viewState } from "./constant";
import { mapGetters, mapActions } from "vuex";
export default {
    name: "RamblerDialog",
    props: {
        visible: Boolean,
        width: String,
        height: String,
        // 开启拖拽
        draggable: {
            type: Boolean,
            default: false,
        },
        center: {
            type: Boolean,
            default: true,
        },
        // 页面的标识，类似id
        name: String,
        // 表头名称
        title: {
            type: String,
            default: "默认标题",
        },
        // 表头图标
        icon: {
            type: String,
            default: "engine",
        },
        appendToBody: {
            type: Boolean,
        },
    },
    data() {
        return {
            allowDrag: true,
            isDragging: false,
            position: {
                left: 100,
                top: 30,
            },
            originalPosition: {
                left: 100,
                top: 100,
            },
            rendered: false,
            headerHeight: 38,
            // 页面状态的常量
            viewState: viewState,
            animaionId: "", // requestAnimationFrame注册id
            startPositionX: 0, // 拖拽初始位置Y
            startPositionY: 0, // 拖拽初始位置X
            renderWidth: 0, // 渲染宽度
            renderHeight: 0, // 渲染高度
            mode: "restore", // max/middle
        };
    },
    computed: {
        ...mapGetters("dialog", ["index"]),
        dynamicStyle: function () {
            const { left, top } = this.position;
            return {
                zIndex: this.index(this.name),
                left: left + "px",
                top: top + "px",
            };
        },
    },
    watch: {
        // 弹窗隐藏和显示
        visible: function (newVal) {
            if (newVal) {
                this.$emit("open");
                this.rendered = true;
                // 依赖width属性计算中间位置
                if (this.center) {
                    this.relocateDialog();
                }
                if (this.visible) {
                    this.rendered = true;
                }
                this.updateDialogs({
                    name: this.name,
                    index: this.index(this.name),
                });
            } else {
                // this.hide();
                this.deleteCachedDialog({
                    name: this.name,
                });
            }
        },
        mode(newVal) {
            this.$bus.$emit("dialog-size-change", {
                page: this.name,
                mode: newVal,
            });
            if (newVal == "fullscreen") {
                // 全屏
                this.allowDrag = false;
                this.maximize();
            } else {
                // 还原
                this.allowDrag = true;
                this.restore();
            }
        },
    },
    methods: {
        ...mapActions("dialog", ["updateDialogs", "deleteCachedDialog"]),
        handleResize: function () {
            if (this.mode == "fullscreen") {
                this.maximize();
            }
        },
        // 还原全屏
        restore() {
            // 初始位置和宽高
            this.renderHeight = this.height;
            this.renderWidth = this.width;
            this.position.left = this.originalPosition.left;
            this.position.top = this.originalPosition.top;
        },
        // 全屏方法
        maximize() {
            this.position.left = 0;
            this.position.top = 0;
            this.renderWidth = document.body.clientWidth + "px";
            this.renderHeight = document.body.clientHeight - 50 - 38 + "px";
        },
        minus() {
            this.$emit("minus", this.name);
        },
        close: function () {
            // 向父组件递交关闭信息
            this.$emit("close", this.name);
            this.$emit("update:visible", false);
        },
        // 弹窗鼠标按下事件
        handleMouseDown(e) {
            // 更新层级
            this.updateDialogs({
                name: this.name,
                index: this.index(this.name),
            });
            const { target } = e;
            e.stopPropagation();
            const nodeName = target.nodeName.toLowerCase();
            if (nodeName == "div") {
                // 无论怎样都置顶, 通过emit触发, 可以自定义执行事件
                this.$emit("click-title", this.name);
                if (target.className.indexOf("drag-title") !== -1) {
                    // 检测拖拽
                    this.isDragging = true;
                    this.startPositionX = e.offsetX;
                    this.startPositionY = e.offsetY;
                    // 通过给document绑定mousemove事件解决拖拽过去失去焦点问题
                    document.onmousemove = this.handleMouseMove;
                    document.onmouseup = this.handleMouseUp;
                }
            } else {
                // svg或者use, 从path找到svg标签，决定触发什么事件
                const paths = e.path || (e.composedPath && e.composedPath());
                let aim = paths.find((item) => item.nodeName == "svg");
                const indexOf = Array.prototype.indexOf;
                if (aim) {
                    if (indexOf.call(aim.classList, "close") !== -1) {
                        this.close();
                        e.stopPropagation();
                    } else if (indexOf.call(aim.classList, "restore") !== -1) {
                        this.mode = "fullscreen";
                    } else if (
                        indexOf.call(aim.classList, "fullscreen") !== -1
                    ) {
                        this.mode = "restore";
                    } else if (indexOf.call(aim.classList, "minus") !== -1) {
                        this.minus();
                    }
                }
            }
        },
        // 鼠标移动
        handleMouseMove(e) {
            // 防止选中文字
            e.preventDefault();
            if (this.isDragging) {
                this.animaionId = window.requestAnimationFrame(() => {
                    this.position.left = e.clientX - this.startPositionX;
                    this.position.top = e.clientY - this.startPositionY;
                    // 保存最后的位置
                    this.originalPosition.top = this.position.top;
                    this.originalPosition.left = this.position.left;
                });
            }
        },
        handleMouseUp() {
            cancelAnimationFrame(this.animaionId);
            this.isDragging = false;
            document.onmousemove = null;
            document.onmouseup = null;
        },
        // 调整弹窗居中
        relocateDialog() {
            const windowHeight = document.body.clientHeight;
            const windowWidth = document.body.clientWidth;
            const posLeft = windowWidth / 2 - parseInt(this.width) / 2;
            this.position.left = posLeft > 0 ? posLeft : 0;
            const posTop =
                (windowHeight - parseInt(this.height) - this.headerHeight) / 2;
            this.position.top = posTop > 0 ? posTop : "10vh";
        },
    },
    mounted() {
        // 绑定拖拽事件
        this.allowDrag = this.draggable;
        this.$nextTick(() => {
            if (this.draggable) {
                let dom = this.$el;
                dom.onmousedown = this.handleMouseDown;
            }
            if (this.appendToBody) {
                document.body.append(this.$el);
            }
        });
        window.onresize = this.handleResize;
    },
    created() {
        this.renderWidth = this.width;
        this.renderHeight = this.height;
    },
};
</script>

<style scoped lang="less">
.rambler-dialog {
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08),
        0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
    position: fixed;
    overflow: hidden;
    border-radius: 8px;
    .rambler_dialog__header {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        align-items: center;
        background-color: #6cbdf1;
        color: #fff;
        letter-spacing: 1px;
        cursor: move;
        display: flex;
        font-size: 14px;
        justify-content: space-between;
        padding: 0 12px;
        .title {
            cursor: default;
            .title-icon {
                fill: #fff;
                margin-right: 8px;
                float: left;
            }
        }
        .btns {
            .right-icon {
                cursor: pointer;
                margin-right: 10px;
                fill: #fff;
                &:hover {
                    fill: #1cbdee;
                }
            }
            .restore {
                font-size: 20px;
            }
            .fullscreen {
                font-size: 16px;
            }
        }
    }
    .content {
        overflow: hidden auto;
        background: #fff;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }
}
</style>
