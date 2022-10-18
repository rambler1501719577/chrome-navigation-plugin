<template>
    <div class="popup-container">
        <component
            :is="component"
            @login-success="handleLoginSuccess"
        ></component>
    </div>
</template>
<script>
import { getToken } from "@/utils/token";
import Login from "./views/login";
import UserInfo from "./views/user-info";
export default {
    name: "PopupUp",
    data() {
        return {
            component: "login" // login | user-info
        };
    },
    components: {
        Login,
        UserInfo
    },
    methods: {
        handleLoginSuccess() {
            this.component = "user-info";
        }
    },
    async created() {
        const token = await getToken();
        if (token && token.value) {
            this.component = "user-info";
        }
    }
};
</script>
<style lang="less" scoped>
.popup-container {
    width: 400px;
}
</style>
