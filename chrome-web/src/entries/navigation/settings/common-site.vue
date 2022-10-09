<template>
    <div class="common-site-container">
        <div class="list">
            <el-table :data="tableData" stripe>
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
                            v-model="scope.row.address"
                        ></el-input>
                        <span v-else>{{ scope.row.address }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160">
                    <template slot-scope="scope">
                        <div v-if="!scope.row.isEdit">
                            <el-button
                                size="mini"
                                @click="editCurrentRow(scope)"
                                >编辑</el-button
                            >
                            <el-button
                                size="mini"
                                @click="deleteRow(scope.row)"
                                slot="reference"
                                >删除</el-button
                            >
                        </div>
                        <div v-else>
                            <el-button size="mini" @click="saveData(scope)"
                                >保存</el-button
                            >
                            <el-button size="mini" @click="cancelEdit(scope)"
                                >取消</el-button
                            >
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="add-operation">+</div>
    </div>
</template>
<script>
import _ from "lodash";
export default {
    data() {
        const tableData = [
            {
                id: 1,
                name: "Vue官网",
                address: "上海市普陀区金沙江路 1518 弄",
                order: 1
            },
            {
                id: 2,
                name: "Vue",
                address: "上沙江路 1518 弄",
                order: 2
            }
        ];
        return {
            tableData: tableData.map(item => {
                return {
                    ...item,
                    isEdit: false
                };
            })
        };
    },
    methods: {
        // 取消保存， 还原原数据
        cancelEdit: function(scope) {
            if (scope.row.originData) {
                // 将原来数据还原
                Object.keys(scope.row.originData).forEach(key => {
                    if (key == "id") return;
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
            scope.row.originData = _.cloneDeep(row);
        },
        deleteRow: function(row) {
            const index = this.tableData.findIndex(
                element => element.id == row.id
            );
            this.tableData.splice(index, 1);
        },
        saveData(scope) {
            const originData = scope.row.originData;
            const index = this.tableData.findIndex(
                ele => ele.id == originData.id
            );
            scope.row.isEdit = false;
            const { name, address, id, order } = scope.row;
            this.tableData[index] = {
                name,
                address,
                id,
                order
            };
        }
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
}
</style>
