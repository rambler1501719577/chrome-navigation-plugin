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
            <div style="padding: 30px 40px 10px" class="dialog-folder">
                <select v-model="form.component">
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
                <rambler-button @click="sureAdd">确定</rambler-button>
            </div>
        </rambler-dialog>
    </div>
</template>
<script>
import { mapActions } from "vuex";
import { supportComponents } from "./config";
export default {
    name: "Add-Component",
    data() {
        return {
            dialogVisible: false,
            form: {
                component: "",
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
            console.log(111);
            this.addWidget(this.form)
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
.folder-container {
    width: 100%;
    height: 100%;
    background: #ffffff92;
    border-radius: 5px;
    overflow: hidden;
    .grid-box {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(3, 1fr);
        .grid-box-item {
            box-sizing: border-box;
            padding: 3px;
            width: 33%;
            height: 33%;
            img {
                width: 18px;
                height: 18px;
            }
            .rambler-icon {
                font-size: 18px;
            }
        }
    }
}
</style>
<style lang="less">
.add-widget-container {
    background: #ffffff7d;
    height: 100%;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    .add-icon {
        fill: #49a1d7;
    }
}
</style>
