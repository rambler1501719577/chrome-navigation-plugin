// 日志管理相关接口
import instance from "@/api/axiosConfig";

export function login(data) {
    return new Promise((resolve, reject) => {
        instance({
            url: "http://82.156.8.154:3001/api/login",
            method: "post",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            data: {
                account: data.username,
                password: data.password,
            },
        }).then((res) => {
            resolve(res.data);
        });
    });
}

export function loadProjects(cookie) {
    return new Promise((resolve, reject) => {
        instance({
            url: "http://82.156.8.154:3001/api/projects",
            method: "get",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            params: {
                cookie: cookie,
            },
        }).then((res) => {
            resolve(res.data.data);
        });
    });
}

export function addLog(data) {
    return new Promise((resolve, reject) => {
        instance({
            url: "http://82.156.8.154:3001/api/log/add",
            method: "post",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            data: data,
        }).then((res) => {
            resolve(res);
        });
    });
}
