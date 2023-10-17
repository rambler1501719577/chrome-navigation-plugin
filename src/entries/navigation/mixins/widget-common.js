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
        ...mapActions("layout", ["updateSiteWidget", "hide", "delete"]),
        // 打开编辑弹窗
        showEdit() {
            this.contextMenuVisible = false;
            this.editFormVisible = true;
        },
        handleCommonWidgetContextMenu: function (e) {
            const { pageX, pageY } = e;
            this.contextMenuPosition.left = pageX;
            this.contextMenuPosition.top = pageY;
            this.contextMenuVisible = true;
            this.$event.$emit("widget-contextmenu", this.id);
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
        deleteWidget() {
            this.delete(this.id)
                .then(() => {
                    console.log("删除成功");
                })
                .catch((e) => {
                    console.log(e);
                });
        },
        // 更新组件(组件基本属性和附加属性prop)，更新任意属性需要传整个对象过来
        updateWidget() {},
        // 删除组件（物理删除）
        deleteWidget() {},
    },
};
