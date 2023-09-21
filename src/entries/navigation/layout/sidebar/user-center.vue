<template>
    <div class="user-part-container">
        <div class="login-box" v-if="isLogin">
            <img :src="avatar" />
        </div>
        <div v-else class="unlogin-container" @click="showLoginDialog">
            <rambler-icon name="account" class="unlogin-user"></rambler-icon>
        </div>
        <rambler-dialog
            width="400px"
            height="240px"
            :visible="loginDialogVisible"
            name="user-login-panel"
            :draggable="true"
        >
            <div style="padding: 20px">
                <rambler-input v-model="form.username" placeholder="用户名" />
                <!-- <input v-model="form.password" /> -->
                <rambler-input
                    type="password"
                    v-model="form.password"
                    placeholder="密码"
                />
                <rambler-button @click="handleLogin">登录</rambler-button>
            </div>
        </rambler-dialog>
    </div>
</template>
<script>
import { setToken } from "@/utils/token";
import { login, fetchUserBookmark } from "@/api/modules/user";
import { mapActions, mapState } from "vuex";
import RamblerDialog from "../../../../components/dialog/RamblerDialog.vue";
export default {
    components: { RamblerDialog },
    data() {
        return {
            loginDialogVisible: false,
            form: {
                username: "admin",
                password: "123456",
            },
        };
    },
    computed: {
        ...mapState("user", {
            avatar: (state) => state.userInfo.avatar,
        }),
        isLogin: function () {
            return !this.avatar == "";
        },
    },
    methods: {
        ...mapActions("user", ["setUserInfo"]),
        ...mapActions("layout", ["setWidgets"]),
        showLoginDialog() {
            this.loginDialogVisible = true;
        },
        handleLogin() {
            login(this.form).then((res) => {
                const { code, msg } = res.data;
                if (code == 200) {
                    let { user, token, token_expires } = res.data.data;
                    if (!token_expires) token_expires = 8;
                    setToken(token, token_expires);
                    this.setUserInfo(user);
                    // 获取并更新bookmarks
                    fetchUserBookmark().then((res) => {
                        if (res.data.code == 200) {
                            const bookmarks = res.data.data.map((item) => {
                                if (item.children && item.children.length > 0) {
                                    return {
                                        ...item,
                                        props: {
                                            children: item.children,
                                        },
                                    };
                                } else {
                                    delete item.children;
                                    return item;
                                }
                            });
                            this.setWidgets(bookmarks);
                        } else {
                            message.error("获取用户书签失败");
                        }
                    });
                    this.$ramblerNotification.success(msg);
                    this.loginDialogVisible = false;
                } else {
                    this.$ramblerNotification.error(msg);
                }
            });
        },
    },
};
</script>
<style lang="less" scoped>
.user-part-container {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    .login-box {
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        img {
            border-radius: 50%;
            width: 100%;
        }
    }
    .unlogin-container {
        display: flex;
        justify-content: center;
        align-items: center;
        .unlogin-user {
            cursor: pointer;
            fill: #eee;
            font-size: 26px;
            transition: all 0.2s linear;
            &:hover {
                transform: scale(1.2);
            }
        }
    }
}
</style>
