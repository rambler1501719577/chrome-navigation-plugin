// 加载进度条
import NProgress from "nprogress/nprogress";
import "nprogress/nprogress.css";
import axios from "axios";
import store from "../store/index";
import { setToken, getToken, getRefreshToken } from "@/utils/token";
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
const requestQueue = [];
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
    const isWhiteUrl = whiteApiList.findIndex((v) => v == url) !== -1;
    if (isWhiteUrl) {
        return config;
    }
    try {
        // getToken返回一个promise, 如果token存在且有效, 则resolve, 否则reject
        const token = await getToken();
        // token正常, 设置授权头并请求
        if (token && token.value) {
            config.headers["Authorization"] = token.value;
        }
    } catch (e) {
        console.log(e);
        // getToken如果获取不到token, 会reject promise, 因此在catch中处理感觉可读性更好
        // 尝试从localstorage读取refresh_token并更新token
        const refreshToken = getRefreshToken();
        if (refreshToken == "") throw new Error("未发现refresh_token");
        // 在更换token中, 请求依次放入等待队列
        console.log("正在替换token,取消请求");
        config.cancelToken = new axios.CancelToken((cancel) => {
            // 取消请求
            cancel(`取消请求: 【${url}】`);
        });
        // 将请求包装在promise中, 放入等待队列
        requestQueue.push((token) => {
            config.headers["Authorization"] = token;
            return service(config);
        });
        console.log(`已缓存【${requestQueue.length}】个请求`);
        // 更换token,保存token,并将响应的token作为参数顺序调用等待队列
        if (!isReplacingToken) {
            console.log("开始替换token...");
            isReplacingToken = true;
            try {
                const res = await replaceToken({ token: refreshToken });
                const { token, token_expires } = res.data.data;
                // 保存token
                await setToken(token, token_expires);
                console.log("token替换成功, 开始执行缓存队列缓存的请求");
                // requestQueue.forEach(async (reqFunc, index) => {
                //     console.log(`开始执行第${index + 1}个请求`);
                //     const res = await reqFunc(token);
                // });

                // const promiseQueue = requestQueue.map((req) => req(token));

                // Promise.all(promiseQueue).then(() => {
                //     return new Promise((resolve) => {
                //         isReplacingToken = false;
                //         requestQueue.splice(0, requestQueue.length);
                //         resolve();
                //     });
                // });
            } catch (e) {
                console.log("refresh_token失效, 客户端登录过期");
                store.dispatch("user/clearUserInfo");
                store.dispatch("layout/reset");
                RamblerNotification.danger("登录过期, 请重新登录");
                requestQueue.splice(0, requestQueue.length);
            }
        }
    }
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
            console.log(error);
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
