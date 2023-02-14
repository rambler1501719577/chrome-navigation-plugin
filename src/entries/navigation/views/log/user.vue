<template>
    <div class="log-manage-container">
        <!-- 账号配置 -->
        <div class="account-setting">
            <input type="text" placeholder="账户" />
            <input type="password" placeholder="密码" />
            <input id="remember" type="checkbox" v-model="isChecked" />
            <label for="remember">记住密码</label>
            <button @click="handleLogin">登录</button>
        </div>
        <!--  -->
    </div>
</template>

<script>
import { login } from "@/api/modules/log";
import settings from "@/settings";
export default {
    name: "IndexLayout",
    data() {
        return {
            account: {
                username: "",
                password: "",
            },
            isChecked: false,
            isLogin: false,
        };
    },
    async created() {},
    mounted() {
        this.checkLoginStatus();
    },
    methods: {
        checkLoginStatus() {
            const account = localStorage.getItem(settings.keys.logUser);
            if (account) {
                this.isLogin = true;
            }
        },
        handleLogin() {
            login(this.account).then((res) => {
                console.log(res);
            });
        },
    },
};
</script>
<style scoped lang="less"></style>
