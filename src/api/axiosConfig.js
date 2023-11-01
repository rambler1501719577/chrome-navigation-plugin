// 加载进度条
import NProgress from "nprogress/nprogress";
import "nprogress/nprogress.css";
import axios from "axios";
import store from "../store/index";
import {
    setToken,
    getToken,
    getRefreshToken,
    removeRefreshToken,
} from "@/utils/token";
import qs from "qs";
import RamblerNotification from "../components/notification";
import { replaceToken } from "./modules/user";
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
const whiteApiList = [
    "/api/public/user/oauth",
    "/api/public/user/replaceToken",
];
NProgress.configure({
    template:
        '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>',
});
let isReplacingToken = false;
let cancelTokens = []; // 待取消接口数组
// axios实例
const service = axios.create({
    timeout: 5000, // request timeout
    paramsSerializer: function (params) {
        return qs.stringify(params, {
            arrayFormat: "brackets",
        });
    },
    baseURL: "http://localhost:8889",
    // baseURL: "http://www.suhaoblog.cn/ext-api",
});

// 请求的拦截器
service.interceptors.request.use(async (config) => {
    NProgress.start();
    const { url } = config;
    // 防止缓存请求队列缓存自己
    if (whiteApiList.findIndex((v) => v == url) !== -1) return config;
    try {
        // getToken返回一个promise, 如果token存在且有效, 则resolve, 否则reject
        const token = await getToken();
        // token正常, 设置授权头并请求
        if (token && token.value) {
            config.headers["Authorization"] = token.value;
            console.log("token有效, 直接请求");
            return config;
        }
    } catch (e) {
        console.log("token过期, 正在更新token");
        // getToken如果获取不到token, 会reject promise, 因此在catch中处理感觉可读性更好
        const refreshToken = getRefreshToken();
        if (refreshToken == "") throw new Error("未发现refresh_token");
        // 先将阻塞的接口放入待取消数组中,如果更新token失败,则取消发送,并提示用户登录过期
        // 否则等待更新token之后在重新设置config.Authorization请求头
        // 刀先架脖子上, 如果replaceToken失败, 人头落地
        config.cancelToken = source.token;
        cancelTokens.push(() => source.cancel("取消请求"));
        try {
            // 尝试从localstorage读取refresh_token并更新token
            await refreshingToken(refreshToken);
        } catch (e) {
            console.log(e);
        }
    }
    try {
        const token = await getToken();
        config.headers["Authorization"] = token.value;
    } catch (e) {}
    return config;
});

// 响应拦截器
service.interceptors.response.use(
    (response) => {
        NProgress.done();
        return response;
    },
    (error) => {
        // 取消请求
        if (axios.isCancel(error)) {
            console.log("取消请求");
        } else {
            // 针对错误进行处理
            let { response } = error;
            if (response) {
                handleCommonError(response);
                NProgress.done();
                return Promise.reject(response);
            } else {
                // 没网情况
                let { msg } = error;
                if (!msg) msg = "网络异常或者服务器已停";
                RamblerNotification.danger(msg);
                NProgress.done();
                return Promise.reject(msg);
            }
        }
    }
);

/**
 * 刷新token
 */
async function refreshingToken(refreshToken) {
    if (!isReplacingToken) {
        isReplacingToken = true;
        return new Promise((resolve, reject) => {
            // 请求刷新令牌
            replaceToken({ token: refreshToken })
                .then((res) => {
                    if (res.data.code == 200) {
                        console.log("token获取成功");
                        const { token, token_expires } = res.data.data;
                        setToken(token, token_expires)
                            .then(() => {
                                console.log(
                                    "token更新成功, 即将继续发送阻塞的请求"
                                );
                                resolve(token);
                            })
                            .catch(() => {
                                console.log("更新token失败, 未知异常");
                                reject("更新token失效");
                            });
                    } else {
                        console.log("refresh_token过期, 取消所有阻塞的请求");
                        store.dispatch("user/clearUserInfo");
                        store.dispatch("layout/reset");
                        removeRefreshToken();
                        RamblerNotification.danger("登录过期, 请重新登录");
                        // 取消队列执行, 取消请求
                        cancelTokens.forEach((cancel) => {
                            cancel();
                        });
                        reject("refresh_token过期");
                    }
                })
                .finally(() => {
                    // 恢复变量值
                    isReplacingToken = false;
                });
        });
    } else {
        // 阻塞当前请求
        return new Promise((resolve, reject) => {
            const id = setInterval(() => {
                console.log("waiting for fetching a new token....");
                if (!isReplacingToken) {
                    clearTimeout(id);
                    resolve();
                }
            }, 1000);
        });
    }
}

/**
 * 处理请求错误
 * 这里先简单提示一下http状态码以及返回文字
 * @param {Object} response
 */
function handleCommonError(response) {
    let { code, msg } = response.data;
    if (code == 10000) {
        RamblerNotification.info(msg);
    } else {
        RamblerNotification.danger(msg);
    }
}

// 返回axios实例
export default service;
