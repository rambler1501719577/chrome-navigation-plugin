<template>
    <div class="setting-container">
        <el-tabs v-model="activeName">
            <el-tab-pane label="账户设置" name="first">
                <div class="account-config">
                    <account-setting></account-setting>
                </div>
            </el-tab-pane>
            <el-tab-pane label="常用网站" name="third">
                <div class="frequent-site">
                    <common-site></common-site>
                </div>
            </el-tab-pane>
            <el-tab-pane label="搜索引擎" name="second">
                <div class="engine-config">
                    <engine-manage></engine-manage>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import AccountSetting from "./account";
import CommonSite from "./common-site";
import EngineManage from "./engine";
export default {
    name: "Setting",
    data() {
        return {
            activeName: "first"
        };
    },
    components: {
        CommonSite,
        EngineManage,
        AccountSetting
    }
};
</script>
<style lang="less" scoped="scoped"></style>
