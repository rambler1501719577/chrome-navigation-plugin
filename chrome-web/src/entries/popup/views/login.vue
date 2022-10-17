<template>
    <div class="login-box">
        <div class="input-area">
            <div class="field-item">
                <p>Username</p>
                <input
                    id="account"
                    autocomplete="off"
                    v-model="user.username"
                    type="text"
                    placeholder="账号"
                />
            </div>
            <div class="field-item">
                <p>Password</p>
                <input
                    type="password"
                    v-model="user.password"
                    id="password"
                    placeholder="密码"
                />
            </div>
        </div>
        <div id="message-box"></div>
        <div class="login-btn">
            <p>
                <input
                    type="checkbox"
                    id="remember"
                    value="remember"
                    checked
                />Remember Me
            </p>
            <button id="login-btn" type="button" @click="handleLogin">
                Login
            </button>
        </div>
    </div>
</template>
<script>
import { login } from "@/api/modules/user";
import { setToken } from "@/utils/token";
export default {
    data() {
        return {
            user: {
                username: "",
                password: ""
            }
        };
    },
    methods: {
        handleLogin() {
            login({
                account: this.user.username,
                password: this.user.password
            }).then(res => {
                if (res.code == 200) {
                    this.$message.success("登录成功");
                    setToken(res.data.token, 5 * 60).then(cookie => {
                        console.log("cookie设置成功", cookie);
                        this.$emit("login-success");
                    });
                } else {
                    this.$message.error("登录失败, 请检查账号密码");
                }
            });
        }
    }
};
</script>
<style lang="less" scoped>
.login-box {
    width: 100%;
    height: 100%;
}

.input-area {
    width: 100%;
    height: 220px;
    background-color: #fff;
    padding: 30px;
    box-sizing: border-box;
}

.login-btn {
    height: 70px;
    background-color: #dee;
    display: flex;
    align-items: center;
    justify-content: space-around;
}

.login-btn p {
    display: flex;
    font-size: 18px;
    align-items: center;
}

.login-btn input {
    font-size: 20px;
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-right: 8px;
}

.login-btn button {
    color: #fff;
    cursor: pointer;
    text-align: center;
    width: 100px;
    font-size: 16px;
    height: 40px;
    box-shadow: 2px 2px 3px #ddd;
    outline: none;
    border: none;
    background-color: #0c96a1;
    border-radius: 20px;
}

.field-item {
    margin-bottom: 20px;
}

.field-item p {
    font-size: 18px;
    margin-bottom: 8px;
}

.field-item input {
    box-sizing: border-box;
    width: block;
    width: 100%;
    height: 36px;
    border: 2px solid #ddd;
    padding-left: 8px;
}

#message-box {
    position: relative;
    top: -15px;
    text-align: center;
    line-height: 40px;
}

#message-box .success {
    color: green;
}

#message-box .fail {
    color: red;
}
</style>
