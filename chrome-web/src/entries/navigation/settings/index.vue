<template>
    <div class="setting-container">
        <el-tabs v-model="activeName">
            <el-tab-pane label="常用网站配置" name="first">
                <div class="frequent-site">
                    <common-site></common-site>
                </div>
            </el-tab-pane>
            <el-tab-pane label="搜索引擎配置" name="second">
                <div class="engine-config">
                    <engine-manage></engine-manage>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
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
        EngineManage
    }
};
</script>
<style lang="less" scoped="scoped"></style>
