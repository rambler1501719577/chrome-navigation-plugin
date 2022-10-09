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
                            v-model="scope.row.url"
                        ></el-input>
                        <span v-else>{{ scope.row.url }}</span>
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
import { mapGetters } from "vuex";
export default {
    data() {
        return {
            tableData: []
        };
    },
    computed: {
        ...mapGetters("setting", ["frequentBookmarks"])
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
            const { name, url, id, order } = scope.row;
            this.tableData[index] = {
                name,
                url,
                id,
                order
            };
            console.log(this.tableData);
            this.$store.dispatch(
                "setting/updateFrequentBookmarks",
                this.tableData
            );
        }
    },
    created() {
        let data = this.frequentBookmarks;
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
}
</style>
