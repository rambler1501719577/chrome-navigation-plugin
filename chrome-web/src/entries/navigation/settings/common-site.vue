<template>
    <div class="common-site-container">
        <div class="list">
            <el-table :data="tableData">
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
        <div class="add-area">
            <div
                :class="{ 'add-button': true, 'add-button-active': isActive }"
                @click="switchStatus"
            >
                <rambler-icon name="add"></rambler-icon>
            </div>
            <div :class="{ 'add-form': true, 'add-form-active': isActive }">
                <el-form
                    :inline="true"
                    :model="form"
                    class="demo-form-inline"
                    size="small"
                >
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
import _ from "lodash";
import { mapGetters } from "vuex";
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
        ...mapGetters("setting", ["frequentBookmarks"])
    },
    methods: {
        switchStatus() {
            this.isActive = !this.isActive;
        },
        onSubmit: function() {
            this.tableData.push({
                name: this.form.name,
                url: this.form.url,
                isEdit: false
            });
            this.form.name = "";
            this.form.url = "";
            this.$store.dispatch(
                "setting/updateFrequentBookmarks",
                this.tableData
            );
        },
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
                order
            };
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
    .add-area {
        margin-top: 10px;
        position: relative;
        height: 40px;
        overflow: hidden;
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
