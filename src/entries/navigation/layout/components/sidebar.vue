<template>
    <div class="fixed-sidebar" id="sidebar-window">
        <!-- 换肤 -->
        <el-tooltip
            class="item"
            effect="dark"
            content="背景设置"
            placement="right"
        >
            <div class="box-item">
                <div
                    class="icon-wrapper"
                    @click="showDialog('skinDialogVisible')"
                >
                    <rambler-icon name="skin" class="icon"></rambler-icon>
                </div>
            </div>
        </el-tooltip>
        <!-- 系统设置 -->
        <el-tooltip
            class="item"
            effect="dark"
            content="系统设置"
            placement="right"
        >
            <div class="box-item">
                <div class="icon-wrapper" @click="showDialog('dialogVisible')">
                    <rambler-icon name="setting" class="icon"></rambler-icon>
                </div>
            </div>
        </el-tooltip>

        <el-tooltip
            class="item"
            effect="dark"
            content="使用教程"
            placement="right"
        >
            <div class="box-item">
                <div class="icon-wrapper" @click="guide">
                    <rambler-icon name="guide" class="icon"></rambler-icon>
                </div>
            </div>
        </el-tooltip>
    </div>
</template>

<script>
import { event } from "../../event";
export default {
    name: "SideBar",
    data() {
        return {};
    },
    created() {},
    mounted() {},
    components: {},
    methods: {
        open(type) {
            this[type] = true;
        },
        showDialog(type) {
            event.$emit("dialog", type);
        },
        guide() {
            event.$emit("guide");
        },
    },
};
</script>
<style scoped lang="less">
@import url("../style.less");
</style>
