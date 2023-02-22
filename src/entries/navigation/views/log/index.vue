<template>
    <div class="log-manage-container">
        <!-- 账号配置 -->
        <!-- <rambler-alert type="warning"
            >登录成功后将在浏览器缓存用户信息</rambler-alert
        > -->
        <div class="account-setting">
            <input type="text" placeholder="账户" v-model="account.username" />
            <input
                type="password"
                placeholder="密码"
                v-model="account.password"
            />
            <rambler-button @click="handleLogin" type="primary"
                >登录</rambler-button
            >
            <span :class="{ success: isChecked, fail: !isChecked }">{{
                isChecked == undefined ? "" : isChecked ? "√" : "x"
            }}</span>
        </div>
        <div class="project">
            <multi-select
                v-model="project"
                :options="projectList"
                :searchable="true"
                placeholder="选择项目编号，支持搜索"
                :custom-label="nameWithLang"
                :max-height="200"
            ></multi-select>
        </div>
        <div class="log-content">
            <textarea
                placeholder="摸鱼人，写点什么吧..."
                v-model="logContent"
            ></textarea>
            <span class="tip">{{ logContent.length }}/25</span>
        </div>
        <div class="btn">
            <rambler-button @click="submit" type="primary">保存</rambler-button>
        </div>
    </div>
</template>

<script>
import settings from "@/settings";
import "vue-multiselect/dist/vue-multiselect.min.css";
import MultiSelect from "vue-multiselect";
import { login, loadProjects, addLog } from "@/api/modules/log";
export default {
    name: "IndexLayout",
    data() {
        return {
            account: {
                username: "",
                password: "",
            },
            isLogin: false,
            projectList: [],
            project: "",
            logContent: "", // 日志内容
            isChecked: undefined, //是否登录成功
        };
    },
    components: {
        MultiSelect,
    },
    mounted() {
        this.initData();
        this.readCache();
    },
    methods: {
        readCache() {
            const cacheStr = localStorage.getItem(settings.keys.LogUser);
            if (cacheStr) {
                const cache = JSON.parse(cacheStr);
                const date = new Date(cache.date);
                const now = new Date();
                // 只读取
                if (
                    now.getDate() == date.getDate() &&
                    now.getMonth() == date.getMonth()
                ) {
                    this.account.username = cache.account;
                    this.account.password = cache.password;
                    this.project = cache.project;
                    this.logContent = cache.content;
                    this.handleLogin();
                } else {
                    localStorage.setItem(settings.keys.LogUser, "");
                }
            }
        },
        handleLogin() {
            if (!this.account.username || !this.account.password) {
                this.$ramblerNotification.warn("未输入账户或密码");
                return;
            }
            login(this.account).then((res) => {
                const { code, message } = res;
                if (code == 200) {
                    this.$ramblerNotification.success(message);
                    this.isChecked = true;
                } else {
                    this.$ramblerNotification.danger(message);
                    this.isChecked = false;
                }
            });
        },
        initData() {
            loadProjects().then((res) => {
                this.projectList = res.map((project) => ({
                    ID: project.ID,
                    Name: project.Name,
                    Label: project.Name.substring(0, 40),
                }));
            });
        },
        nameWithLang({ ID, Name, Label }) {
            return `${Label}`;
        },
        submit() {
            if (!this.isChecked) {
                this.$ramblerNotification.info("请先登录后在操作");
                return;
            }
            if (!this.project) {
                this.$ramblerNotification.info("请选择项目编号");
                return;
            }
            if (!this.logContent || this.logContent.length < 25) {
                this.$ramblerNotification.info("日志内容不足25字");
                return;
            }
            const data = {
                content: this.logContent,
                account: this.account.username,
                password: this.account.password,
                projectName: this.project.Name,
            };
            addLog(data).then((res) => {
                if (res.status !== 200) {
                    this.$ramblerNotification.danger("请求发送失败");
                    return;
                }
                const { code, message } = res.data;
                if (code == 200) {
                    this.$ramblerNotification.success(message);
                    // 单独保存project信息，方便读缓存
                    data.project = this.project;
                    data.date = new Date();
                    localStorage.setItem(
                        settings.keys.LogUser,
                        JSON.stringify(data)
                    );
                } else {
                    this.$ramblerNotification.danger("保存失败，请联系管理员");
                }
            });
        },
    },
};
</script>
<style scoped lang="less">
.log-manage-container {
    .account-setting {
        margin-bottom: 15px;
        input {
            height: 35px;
            box-sizing: border-box;
            margin-right: 15px;
            border: none;
            outline: none;
            border: 1px solid #eee;
            padding-left: 8px;
        }
        input:-webkit-autofill {
            color: #35495e !important;
            background-color: transparent;
        }
        span {
            display: inline-block;
            margin-left: 15px;
        }
        .success {
            color: green;
        }
        .fail {
            color: red;
        }
    }
    .project {
        margin-bottom: 15px;
    }
    .log-content {
        position: relative;
        margin-bottom: 15px;
        textarea {
            display: block;
            width: 100%;
            height: 150px;
            outline: none;
            box-sizing: border-box;
            border: 1px solid #eee;
            font-family: inherit;
            padding: 8px;
            font-size: 16px;
            color: #35495e;
        }
        span {
            position: absolute;
            right: 9px;
            bottom: 5px;
        }
    }
    .btn {
        display: flex;
        justify-content: flex-end;
    }
}
</style>
