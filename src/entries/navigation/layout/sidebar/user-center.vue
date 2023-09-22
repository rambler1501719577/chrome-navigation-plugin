<template>
    <div class="user-part-container">
        <div class="login-box" v-if="avatar !== ''" @click="showLoginDialog">
            <img :src="avatar" />
        </div>
        <div v-else class="unlogin-container" @click="showLoginDialog">
            <rambler-icon name="account" class="unlogin-user"></rambler-icon>
        </div>

        <rambler-dialog
            width="400px"
            height="240px"
            :visible.sync="loginDialogVisible"
            name="user-login-panel"
            :draggable="true"
            append-to-body
        >
            <div style="padding: 20px" v-if="avatar == ''">
                <rambler-input v-model="form.username" placeholder="用户名" />
                <rambler-input
                    type="password"
                    v-model="form.password"
                    placeholder="密码"
                />
                <rambler-button @click="handleLogin">登录</rambler-button>
            </div>
            <div v-else class="user-info-panel">
                <div class="user-panel-bg">
                    <img :src="avatar" width="30px" class="avatar" />
                </div>
                <div class="user-panel-content">
                    <h1>欢迎回来, {{ nickname }}</h1>
                    <rambler-button @click="logout">退出登录</rambler-button>
                </div>
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
    created() {
        console.log(this.avatar);
    },
    computed: {
        ...mapState("user", {
            avatar: (state) => state.userInfo.avatar,
            nickname: (state) => state.userInfo.nickname,
        }),
    },
    methods: {
        ...mapActions("user", ["setUserInfo", "clearUserInfo"]),
        ...mapActions("layout", ["setWidgets"]),
        showLoginDialog() {
            this.loginDialogVisible = true;
        },
        logout() {
            this.clearUserInfo();
            this.loginDialogVisible = false;
            this.$ramblerNotification.info("您已成功退出");
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
            cursor: pointer;
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

<style lang="less">
@avatar-size: 70px;
.user-info-panel {
    width: 100%;
    height: 100%;
    position: relative;
    .user-panel-bg {
        width: 100%;
        height: 30%;
        background: #098fa8;
        position: relative;
        .avatar {
            width: @avatar-size;
            position: absolute;
            top: calc(100% - @avatar-size / 2);
            left: 50%;
            margin-left: calc(-@avatar-size / 2);
            border-radius: 50%;
            display: block;
        }
    }
    .user-panel-content {
        padding-top: 50px;
        text-align: center;

        h1 {
            margin-bottom: 20px;
        }
    }
}
</style>
