<template>
    <div class="setting-container">
        <el-tabs v-model="activeName">
            <el-tab-pane label="常用网站配置" name="first">
                <div class="frequent-site">
                    <common-site></common-site>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import CommonSite from "./common-site";
export default {
    name: "Setting",
    components: {},
    data() {
        return {
            activeName: "first"
        };
    },
    components: {
        CommonSite
    },
    computed: {},
    methods: {},
    created() {}
};
</script>
<style lang="less" scoped="scoped"></style>
