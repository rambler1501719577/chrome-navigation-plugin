<template>
    <div class="common-site-container">
        <el-alert :closable="false" type="warning" v-if="dataSource == 'remote'"
            >账户数据无法编辑, 请在管理端进行编辑, 点击跳转(待开发)</el-alert
        >
        <div class="list">
            <el-table :data="tableData">
                <div slot="empty">
                    啥玩意也没有啊
                </div>
                <el-table-column label="名称" align="left" width="200">
                    <template slot-scope="scope">
                        <el-input
                            size="small"
                            v-if="scope.row.isEdit"
                            v-model="scope.row.name"
                        ></el-input>
                        <span v-else>{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="网址" align="left">
                    <template slot-scope="scope">
                        <el-input
                            size="small"
                            v-if="scope.row.isEdit"
                            v-model="scope.row.url"
                        ></el-input>
                        <span v-else>{{ scope.row.url }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="150"
                    align="center"
                    v-if="dataSource == 'local'"
                >
                    <template slot-scope="scope">
                        <div v-if="!scope.row.isEdit">
                            <el-button
                                size="mini"
                                type="primary"
                                @click="editCurrentRow(scope)"
                                >编辑</el-button
                            >
                            <el-button
                                size="mini"
                                type="danger"
                                @click="deleteRow(scope.row)"
                                slot="reference"
                                >删除</el-button
                            >
                        </div>
                        <div v-else>
                            <el-button
                                type="success"
                                size="mini"
                                @click="saveData(scope)"
                                >保存</el-button
                            >
                            <el-button
                                size="mini"
                                @click="cancelEdit(scope)"
                                type="warning"
                                >取消</el-button
                            >
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="add-area" v-show="dataSource == 'local'">
            <div
                :class="{ 'add-button': true, 'add-button-active': isActive }"
                @click="switchStatus"
            >
                <rambler-icon class="add-icon" name="add"></rambler-icon>
            </div>
            <div :class="{ 'add-form': true, 'add-form-active': isActive }">
                <el-form :inline="true" :model="form" size="small">
                    <el-form-item label="名称">
                        <el-input
                            v-model="form.name"
                            placeholder="名称"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="网址">
                        <el-input
                            v-model="form.url"
                            placeholder="网址"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit"
                            >确定</el-button
                        >
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
const { v4: uuidv4 } = require("uuid");
import _ from "lodash";
import { mapGetters, mapActions } from "vuex";
export default {
    data() {
        return {
            tableData: [],
            form: {
                name: "",
                url: ""
            },
            isActive: true
        };
    },
    computed: {
        ...mapGetters(["dataSource"]),
        ...mapGetters("frequentBookmark", ["localFrequentBookmarks"])
    },
    methods: {
        // 映射setting.Action
        ...mapActions("frequentBookmark", ["update"]),
        switchStatus() {
            this.isActive = !this.isActive;
        },
        // 新增
        onSubmit: function() {
            let reg = /https?:\/\/(\w+\.?)+/;
            if (!reg.test(this.form.url))
                return this.$message.error(
                    "地址格式错误,请输入包含http的完整地址"
                );
            const data = {
                name: this.form.name,
                url: this.form.url,
                id: uuidv4()
            };
            this.tableData.push({
                ...data,
                isEdit: false
            });
            this.form.name = "";
            this.form.url = "";
            // 同步到vuex
            this.update({
                type: "add",
                data: data
            });
        },
        // 取消保存， 还原原数据
        cancelEdit: function(scope) {
            if (scope.row.originData) {
                // 将原来数据还原
                Object.keys(scope.row.originData).forEach(key => {
                    scope.row[key] = scope.row.originData[key];
                });
            }
            scope.row.isEdit = false;
        },
        editCurrentRow: function(scope) {
            const row = scope.row;
            if (!row.isEdit) {
                row["isEdit"] = true;
            }
            // 将当前行数据保存到originData中，如果取消保存在取出数据覆盖现有数据即可
            scope.row.originData = _.cloneDeep(row);
        },
        // 删除
        deleteRow: function(row) {
            const index = this.tableData.findIndex(
                element => element.id == row.id
            );
            this.tableData.splice(index, 1);
            this.update({
                type: "delete",
                data: {
                    id: row.id
                }
            });
        },
        // 更新
        saveData(scope) {
            scope.row.isEdit = false;
            const index = this.tableData.findIndex(
                ele => ele.id == scope.row.id
            );
            const payload = {};
            Object.keys(scope.row).forEach(key => {
                if (key !== "originData" && key !== "isEdit") {
                    payload[key] = scope.row[key];
                }
            });
            this.tableData.splice(index, 1, {
                ...payload,
                isEdit: false
            });
            this.update({
                type: "edit",
                data: payload
            });
        }
    },
    created() {
        let data = this.localFrequentBookmarks;
        // 通过isEdit标识每一行是否是编辑状态
        this.tableData = _.cloneDeep(data).map(item => ({
            ...item,
            isEdit: false
        }));
    }
};
</script>
<style lang="less" scoped>
.common-site-container {
    .list {
        color: #333;
    }
    .add-operation {
        height: 50px;
        text-align: center;
        line-height: 50px;
        color: #333;
        font-size: 30px;
        cursor: pointer;
        background: #eee;
        margin-top: 15px;
    }
    .add-area {
        margin-top: 10px;
        position: relative;
        height: 40px;
        overflow: hidden;
        .add-icon {
            fill: #fff;
        }
        .add-button {
            position: absolute;
            right: 0;
            bottom: 0;
            height: 100%;
            width: 40px;
            background: #57b1bc;
            font-size: 18px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: all 0.5s;
            z-index: 2;
        }
        .add-button-active {
            transform: rotate(-90deg);
        }
        .add-form {
            position: absolute;
            right: 40px;
            bottom: -14px;
            transition: all 0.5s;
        }
        .add-form-active {
            transform: translateX(553px);
        }
    }
}
</style>
