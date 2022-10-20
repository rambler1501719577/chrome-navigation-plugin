<template>
    <div class="setting-container">
        <div class="account-config">
            <account-setting></account-setting>
        </div>
    </div>
</template>

<script>
import AccountSetting from "./account";
export default {
    name: "Setting",
    data() {
        return {
            activeName: "first"
        };
    },
    components: {
        AccountSetting
    }
};
</script>
<style lang="less" scoped="scoped"></style>
