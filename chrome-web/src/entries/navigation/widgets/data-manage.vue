<template>
    <div class="account-container">
        <div class="export">
            <div class="info">
                <el-alert :closable="false" type="warning"
                    >你可以通过导出本地设置(JSON文件),
                    编辑后在重新导入(JSON格式)</el-alert
                >
            </div>
            <div class="btn">
                <el-button size="small" type="primary" @click="exportConfig"
                    >导出本地配置</el-button
                >
                <el-button size="small" type="primary" @click="importConfig"
                    >导入本地配置</el-button
                >
                <input id="upload" type="file" @change="parseJson" />
            </div>
        </div>
    </div>
</template>

<script>
import FileSaver from "file-saver";
import { mapActions, mapGetters } from "vuex";
export default {
    name: "Account",
    data() {
        return {};
    },
    computed: {
        ...mapGetters(["dataSource"]),
        ...mapGetters("engine", ["localEngines"]),
        ...mapGetters("frequentBookmark", ["localFrequentBookmarks"]),
        ...mapGetters("bookmark", ["localBookmark"])
    },
    methods: {
        ...mapActions("engine", ["setDefaultEngine"]),
        ...mapActions("frequentBookmark", ["replaceFrequentBookmark"]),
        ...mapActions("engine", ["replaceEngines", "setDefaultEngine"]),
        exportConfig() {
            const data = JSON.stringify({
                frequentBookmark: this.localFrequentBookmarks,
                engine: this.localEngines
            });
            const blob = new Blob([data], { type: "" });
            FileSaver.saveAs(blob, "config.json");
        },
        // 解析文本
        parseJson(e) {
            const _this = this;
            const file = e.target.files[0];
            let reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function() {
                try {
                    let res = JSON.parse(this.result);
                    const { frequentBookmark, engine } = res;
                    // 更新本地数据
                    _this.replaceFrequentBookmark(frequentBookmark);
                    _this.replaceEngines(engine);
                    // 设置默认搜索引擎
                    _this.setDefaultEngine({ dataSource: "local" });
                    _this.$message.success("导入成功");
                } catch (e) {
                    _this.$message.error("导入失败, 请刷新重试");
                }
            };
        },
        // 唤起file事件
        importConfig() {
            document.querySelector("#upload").click();
        }
    }
};
</script>
<style lang="less" scoped="scoped">
.account-container {
    .data-choose {
        .form-item {
            display: flex;
            justify-content: flex-start;
            padding: 20px;
            .tooltip {
                margin-left: 6px;
                display: flex;
                align-items: center;
            }
        }
    }
    .export {
        #upload {
            display: none;
        }
        .info {
            margin-bottom: 10px;
        }
        .btn {
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>
