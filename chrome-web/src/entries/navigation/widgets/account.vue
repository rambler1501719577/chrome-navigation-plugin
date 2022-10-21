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
    methods: {
        ...mapActions("setting", ["updateDataSource"]),
        ...mapActions("engine", ["replaceEngines", "setDefaultEngine"]),
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
}
</style>
