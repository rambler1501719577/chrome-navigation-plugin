// 加载进度条
import NProgress from "nprogress/nprogress";
import "nprogress/nprogress.css";
import axios from "axios";
import { getToken } from "@/utils/token";
import qs from "qs";
import RamblerNotification from "../components/notification";
const whiteApiList = ["/api/public/user/oauth"];
NProgress.configure({
    template:
        '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>',
});
// axios实例
const service = axios.create({
    timeout: 5000, // request timeout
    paramsSerializer: function (params) {
        return qs.stringify(params, {
            arrayFormat: "brackets",
        });
    },
    // baseURL: "http://localhost:8889",
    baseURL: "http://www.suhaoblog.cn/ext-api",
});

// 请求的拦截器
service.interceptors.request.use(async (config) => {
    NProgress.start();
    try {
        const token = await getToken();
        if (token) {
            config.headers["Authorization"] = token.value;
        }
    } catch (e) {
        const { url } = config;
        if (!whiteApiList.includes(url)) {
            return Promise.reject({
                msg: "登录已过期,请求取消",
            });
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
