// 加载进度条
import NProgress from "nprogress/nprogress";
import "nprogress/nprogress.css";
import axios from "axios";
import qs from "qs";
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
    baseURL: "http://82.156.8.154/ext-api",
});

// 请求的拦截器
service.interceptors.request.use((config) => {
    NProgress.start();
    return config;
});

// 响应拦截器
service.interceptors.response.use(
    (response) => {
        NProgress.done();
        return response;
    },
    (error) => {
        NProgress.done();
        return Promise.reject(error);
    }
);

// 返回axios实例
export default service;
