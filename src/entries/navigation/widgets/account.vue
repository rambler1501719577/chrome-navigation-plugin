<template>
    <div class="account-container">
        <!-- 数据源选择 -->
        <div class="data-choose">
            <el-alert :closable="false" type="warning"
                >登录以后可以切换到远程数据，两份数据相互独立，也可以在管理端将本地数据导入(待开发)</el-alert
            >
            <div class="form-item">
                <el-switch
                    @change="changeDataSource"
                    v-model="localDataSource"
                    active-text="本地缓存"
                    inactive-text="账户数据"
                >
                </el-switch>
                <div class="tooltip">
                    <el-popover
                        placement="right"
                        width="400"
                        effect="dark"
                        trigger="hover"
                        content="切换到账户数据仍会保留本地之前的设置, 需要时可以切换"
                    >
                        <rambler-icon
                            name="tip"
                            slot="reference"
                        ></rambler-icon>
                    </el-popover>
                </div>
            </div>
        </div>
        <!-- 导入导出 -->
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
import { getToken } from "@/utils/token";
export default {
    name: "Account",
    data() {
        return {
            localDataSource: false,
            isLogin: false
        };
    },
    created() {
        this.localDataSource = this.dataSource == "local" ? true : false;
        getToken().then(token => {
            if (token && token.value) {
                this.isLogin = true;
            }
        });
    },
    computed: {
        ...mapGetters(["dataSource"]),
        ...mapGetters("engine", ["localEngines"]),
        ...mapGetters("frequentBookmark", ["localFrequentBookmarks"]),
        ...mapGetters("bookmark", ["localBookmark"])
    },
    methods: {
        ...mapActions("frequentBookmark", ["replaceFrequentBookmark"]),
        ...mapActions("engine", ["replaceEngines", "setDefaultEngine"]),
        ...mapActions("setting", ["updateDataSource"]),
        changeDataSource(value) {
            if (value) {
                this.updateDataSource("local");
                this.setDefaultEngine({
                    dataSource: "local"
                });
            } else {
                this.updateDataSource("remote");
                this.setDefaultEngine({
                    dataSource: "remote"
                });
            }
        },
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
