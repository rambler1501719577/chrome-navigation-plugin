/**
 * 不在这个文件中对axios进行处理
 * 只引入axios的实例,并向外提供接口
 * @author rambler
 */
import instance from "./axiosConfig";

// get
export function get(url, params) {
    return instance({
        url,
        method: "get",
        params,
    });
}

// post
export function post(url, data) {
    return instance({
        url,
        method: "post",
        data,
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
    });
}
