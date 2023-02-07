<template>
    <div class="system-setting-container">
        <div class="nav">
            <ul>
                <li><a href="#account-setting">账户设置</a></li>
                <li><a href="#clear-data">清空数据</a></li>
            </ul>
        </div>
        <div class="content">
            <div id="account-setting">
                <account-setting></account-setting>
            </div>
            <div id="clear-data">
                <rambler-alert type="danger">
                    这将会清空你的所有数据且无法撤回、请谨慎操作
                </rambler-alert>
                <rambler-button @click="clearData" type="danger"
                    >清空所有数据</rambler-button
                >
            </div>
            <div id="repair">
                <rambler-alert type="warning">
                    使用中出现问题可通过以下按钮进行修复
                </rambler-alert>
                <rambler-button @click="repairEngines"
                    >修复搜索引擎</rambler-button
                >
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from "vuex";
import AccountSetting from "./widgets/account";
export default {
    name: "Account",
    data() {
        return {};
    },
    created() {},
    computed: {},
    components: {
        AccountSetting,
    },
    methods: {
        ...mapActions("engine", ["repairEngine"]),
        clearData() {
            this.$ramblerNotification.danger(
                "已清空所有数据，即将重新载入插件"
            );
            setTimeout(() => {
                localStorage.clear();
                window.location.reload();
            }, 2500);
        },
        repairEngines() {
            this.repairEngine();
            this.$ramblerNotification.success("已修复默认搜索引擎");
        },
    },
};
</script>
<style lang="less" scoped="scoped">
.system-setting-container {
    .nav {
        margin-bottom: 15px;
        ul {
            display: flex;
            li {
                margin-right: 8px;
                a {
                    color: #333;
                    padding: 0 0 3px 0;
                    &:hover {
                        border-bottom: 1px solid rgb(62, 61, 61);
                    }
                }
            }
        }
    }
    .content {
        #account-setting {
            margin-bottom: 15px;
        }
        #clear-data {
            .rambler-button {
                margin-top: 10px;
            }
        }
        #repair {
            margin-top: 10px;
            .rambler-button {
                margin-top: 10px;
            }
        }
    }
}
</style>
