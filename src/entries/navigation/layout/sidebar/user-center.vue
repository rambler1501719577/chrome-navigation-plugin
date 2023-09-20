<template>
    <div class="user-part-container">
        <div class="login-box" v-if="isLogin">avatar</div>
        <div v-else class="unlogin-container" @click="showLoginDialog">
            <rambler-icon name="account" class="unlogin-user"></rambler-icon>
        </div>
        <rambler-dialog
            width="200"
            height="200"
            :visible="loginDialogVisible"
            name="user-login-panel"
            :draggable="true"
        >
            <input v-model="form.username" />
            <input v-model="form.password" />
            <rambler-button @click="handleLogin">登录</rambler-button>
        </rambler-dialog>
    </div>
</template>
<script>
import { login, fetchUserBookmark } from "@/api/modules/user";
import { mapState } from "vuex";
import RamblerDialog from "../../../../components/dialog/RamblerDialog.vue";
export default {
    components: { RamblerDialog },
    data() {
        return {
            isLogin: false,
            loginDialogVisible: false,
            form: {
                username: "admin",
                password: "123456",
            },
        };
    },
    computed: {
        ...mapState("user", {
            userInfo: (state) => state.userInfo,
        }),
    },
    methods: {
        showLoginDialog() {
            this.loginDialogVisible = true;
        },
        handleLogin() {
            login(this.form).then((res) => {
                const { code, msg } = res.data;
                if (code == 200) {
                    const { user, token, token_expires } = res.data.data;
                    setToken(token, token_expires);
                    dispatcher({
                        type: userActionType.SET_USER,
                        payload: user,
                    });
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
                            dispatcher({
                                type: layoutActionTypes.SET_LAYOUT,
                                payload: bookmarks,
                            });
                        } else {
                            message.error("获取用户书签失败");
                        }
                    });
                    message.success(msg);
                    dialogHandler(false);
                } else {
                    message.error(msg);
                }
            });
        },
    },
    created() {
        if (this.userInfo) {
            this.isLogin = true;
        }
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
