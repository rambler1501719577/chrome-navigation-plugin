<template>
    <div class="bookmarkmark-container">
        <!-- `chrome://favicon2/?size=16&scaleFactor=2x&allowGoogleServerFallback=0&pageUrl=http://www.suhaoblog.cn` -->
        <div class="header"></div>
        <div class="data">
            <el-table
                :data="localBookmark"
                row-key="id"
                border
                default-expand-all
                :tree-props="{
                    children: 'children'
                }"
            >
                <el-table-column prop="title" label="书签名称">
                </el-table-column>
                <el-table-column label="添加日期" width="140">
                    <template slot-scope="scope">{{
                        new Date(scope.row.dateAdded).toLocaleDateString()
                    }}</template>
                </el-table-column>
                <el-table-column
                    prop="index"
                    label="排序号"
                    width="80"
                    align="center"
                >
                </el-table-column>
                <el-table-column label="操作" width="160" align="center">
                    <template slot-scope="scope">
                        <el-button
                            size="small"
                            type="primary"
                            @click="editRow(scope.row)"
                            >编辑</el-button
                        >
                        <el-button
                            size="small"
                            type="danger"
                            @click="deleteRow(scope.row)"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
            title="更新数据"
            :modal="false"
            top="10vh"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            v-dialogDrag
        >
            <el-form label-position="top" label-width="80px" :model="form">
                <el-form-item label="书签名">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.url"></el-input>
                </el-form-item>
            </el-form>
            <div class="btns" style="display:flex;justify-content:flex-end">
                <el-button @click="handleSubmit" type="primary">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import _ from "lodash";
import { mapGetters, mapActions } from "vuex";
export default {
    name: "Bookmark",
    data() {
        return {
            form: {
                title: "",
                url: ""
            },
            dialogVisible: false
        };
    },
    computed: {
        ...mapGetters("bookmark", ["localBookmark"])
    },
    methods: {
        ...mapActions("bookmark", ["updateBookmark"]),
        // 图标样式(待调试)
        getIconStyle(row) {
            return {
                backgroundImage: `-webkit-image-set(url("chrome://favicon2/?size=16&scaleFactor=1x&pageUrl=${row.url}&allowGoogleServerFallback=0") 1x,url("chrome://favicon2/?size=16&scaleFactor=2x&pageUrl=${row.url}&allowGoogleServerFallback=0") 2x);`,
                width: 32 + "px",
                height: 32 + "px"
            };
        },
        // 编辑行
        editRow: function(row) {
            if (!chrome.bookmarks) {
                return this.$message.error("请在扩展程序中操作数据");
            }
            this.form = _.cloneDeep(row);
            this.dialogVisible = true;
        },
        // 同步到chrome中
        handleSubmit() {
            chrome.bookmarks.update(
                this.form.id,
                {
                    title: this.form.title,
                    url: this.form.url
                },
                result => {
                    // 重新获取bookmark数据
                    this.updateBookmark();
                }
            );
        },
        // 删除行
        deleteRow: function(row) {
            if (!chrome.bookmarks) {
                return this.$message.error("请在扩展程序中操作数据");
            }
            chrome.bookmarks.remove(row.id, () => {
                // 重新获取bookmark数据
                this.updateBookmark();
            });
        }
    }
};
</script>
<style lang="less" scoped>
.bookmarkmark-container {
    overflow: hidden auto;
    height: calc(80vh - 30px - 43px);
}
</style>
