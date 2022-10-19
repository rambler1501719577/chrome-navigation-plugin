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

        <!-- 导出数据 -->
        <div class="export">
            <el-button size="small" type="primary" @click="exportConfig"
                >导出本地配置</el-button
            >
            <el-button size="small" type="primary" @click="importConfig"
                >导入本地配置</el-button
            >
            <input id="upload" type="file" @change="parseJson" />
        </div>
    </div>
</template>

<script>
import FileSaver from "file-saver";
import { mapActions } from "vuex";
export default {
    name: "Account",
    data() {
        return {
            localDataSource: false
        };
    },
    created() {
        this.localDataSource =
            this.$store.getters.dataSource == "local" ? true : false;
    },
    methods: {
        ...mapActions("setting", ["updateDataSource"]),
        ...mapActions("engine", ["setDefaultEngine"]),
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
            const data = JSON.stringify([
                {
                    name: 123
                }
            ]);
            const blob = new Blob([data], { type: "" });
            FileSaver.saveAs(blob, "config.json");
        },
        // 解析文本
        parseJson(e) {
            const file = e.target.files[0];
            let reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function() {
                console.log(JSON.parse(this.result));
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
    }
}
</style>
