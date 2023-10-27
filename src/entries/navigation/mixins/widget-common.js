import { mapActions } from "vuex";
export default {
    // 所有组件都会接受的公用属性
    props: {
        id: String,
        title: String,
        width: String | Number,
        height: String | Number,
    },
    data() {
        return {
            contextMenuVisible: false,
            // 弹窗位置
            contextMenuPosition: {
                left: 0,
                top: 0,
            },
            editFormVisible: false, // 编辑弹窗
            contextMenuWidth: 160, // 可被组件重写，这里给默认值160
            showSecondMenu: false, // 显示二级菜单
            secondMenuStyle: {}, // 右键二级菜单位置
        };
    },
    mounted() {
        // 任意位置关闭右键弹窗
        window.addEventListener("click", () => {
            if (this.contextMenuVisible) this.contextMenuVisible = false;
        });
        // 其他组件显示弹窗时，关闭其他弹窗，事件总线实现
        this.$event.$on("widget-contextmenu", (payload) => {
            if (payload !== this.id && this.contextMenuVisible) {
                this.contextMenuVisible = false;
            }
        });
    },
    methods: {
        ...mapActions("layout", ["updateSiteWidget", "add", "hide", "delete"]),
        // 打开编辑弹窗
        showEdit() {
            this.contextMenuVisible = false;
            this.editFormVisible = true;
        },
        // 弹出右键菜单
        handleCommonWidgetContextMenu: function (e) {
            const { pageX, pageY } = e;
            this.contextMenuPosition.left = pageX;
            this.contextMenuPosition.top = pageY;
            const { clientWidth } = document.documentElement;
            // 超出右边可视区域自动贴边，暂不考虑高度高出问题
            if (this.contextMenuWidth + pageX > clientWidth) {
                this.contextMenuPosition.left =
                    clientWidth - this.contextMenuWidth;
            }
            if (!this.contextMenuVisible) {
                this.contextMenuVisible = true;
            }
            this.$event.$emit("widget-contextmenu", this.id);
        },
        // 右键弹窗二级菜单显示
        showSecondCtxMenu() {
            // 初始定义secondMenuStyle是一个空对象, 所以需要 $set和 $delete来强制更新视图
            const viewPortWidth = document.documentElement.clientWidth;
            // 一级弹窗和二级弹窗加起来都不超过可视窗口宽度, 可以在右侧展开二级菜单
            if (
                this.contextMenuPosition.left + this.contextMenuWidth * 2 >=
                viewPortWidth
            ) {
                this.$delete(this.secondMenuStyle, "left");
                this.$set(this.secondMenuStyle, "right", "100%");
            } else {
                this.$delete(this.secondMenuStyle, "right");
                this.$set(this.secondMenuStyle, "left", "100%");
            }
            // 高度溢出先不考虑
            this.$set(this.secondMenuStyle, "top", "0");
            this.showSecondMenu = true;
        },
        hideSecondCtxMenu() {
            this.showSecondMenu = false;
        },
        // 以下是通用组件增删改查接口，组件内部可以覆盖（重写）
        /**
         * 隐藏组件
         */
        hideWidget() {
            if (!this.id) {
                return this.$ramblerNotification.danger("隐藏组件失败, id为空");
            }
            this.hide(this.id);
        },
        // 删除组件（物理删除）
        deleteWidget() {
            this.delete(this.id)
                .then(() => {})
                .catch((e) => {
                    console.log(e);
                });
        },
        // 更新组件(组件基本属性和附加属性prop)，更新任意属性需要传整个对象过来
        updateWidget() {
            //
        },
    },
};
