// 加载进度条
import NProgress from "nprogress/nprogress";
import "nprogress/nprogress.css";
import axios from "axios";
import qs from "qs";
import { message } from "@/utils/index";
import { getToken } from "@/utils/token";
NProgress.configure({
    template:
        '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
});
// axios实例
const service = axios.create({
    timeout: 5000, // request timeout
    paramsSerializer: function(params) {
        return qs.stringify(params, {
            arrayFormat: "brackets"
        });
    },
    baseURL: "http://82.156.8.154:9999"
});

// 请求的拦截器
service.interceptors.request.use(config => {
    NProgress.start();
    const token = getToken();
    if (!token) {
        config.headers.common["Authorization"] = "true";
    }
    return config;
});

// 响应拦截器
service.interceptors.response.use(
    response => {
        NProgress.done();
        const res = response.data;
        const responseCode = res.code;
        if (responseCode == 200) {
            return res;
        } else if (responseCode == 202) {
            message("接口请求过于频繁,请稍后重试");
            return Promise.reject(res.message);
        } else {
            return Promise.reject(res.message);
        }
    },
    error => {
        NProgress.done();
        return Promise.reject(error);
    }
);

// 返回axios实例
export default service;
