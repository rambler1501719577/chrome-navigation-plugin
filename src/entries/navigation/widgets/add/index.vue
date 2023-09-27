<template>
    <div class="add-widget-container" @click="showAddDialog">
        <rambler-icon name="add" class="add-icon"></rambler-icon>
        <rambler-dialog
            width="390px"
            :visible.sync="dialogVisible"
            name="add-component-dialog-111"
            :draggable="true"
            append-to-body
            title="添加组件"
        >
            <div style="padding: 30px 40px 10px" class="dialog-add-component">
                <select
                    v-model="form.component"
                    class="rambler-select"
                    placeholder="选择要添加的组件"
                >
                    <option
                        v-for="(component, index) of supportComponents"
                        :value="component.type"
                        :key="index"
                    >
                        {{ component.label }}
                    </option>
                </select>
                <!-- <rambler-input
                    placeholder="请输入组件类型"
                    v-model="form.component"
                /> -->
                <rambler-input
                    placeholder="请输入组件长"
                    v-model="form.width"
                />
                <rambler-input
                    placeholder="请输入组件宽"
                    v-model="form.height"
                />
                <rambler-input placeholder="请输入地址" v-model="form.url" />
                <rambler-input placeholder="请输入标题" v-model="form.title" />
                <div class="add-confirm-btn">
                    <rambler-button @click="sureAdd">确定</rambler-button>
                </div>
            </div>
        </rambler-dialog>
    </div>
</template>
<script>
import _ from "lodash";
import { mapActions } from "vuex";
import { supportComponents } from "./config";
export default {
    name: "Add-Component",
    data() {
        return {
            dialogVisible: false,
            form: {
                component: "site",
                width: 1,
                height: 1,
                url: "",
                title: "",
            },
            supportComponents: supportComponents,
        };
    },
    props: {},
    created() {},
    methods: {
        ...mapActions("layout", ["addWidget"]),
        showAddDialog() {
            this.dialogVisible = true;
        },
        // 添加到store并同步到数据库
        sureAdd() {
            const payload = _.cloneDeep(this.form);
            payload["show"] = true;
            this.addWidget(payload)
                .then(() => {
                    this.$ramblerNotification.success("添加成功");
                    this.dialogVisible = false;
                })
                .catch((err) => {
                    this.$ramblerNotification.error("添加失败");
                });
        },
    },
};
</script>

<style lang="less" scoped>
.add-widget-container {
    width: 100%;
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
    .add-confirm-btn {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;
    }
}
</style>
