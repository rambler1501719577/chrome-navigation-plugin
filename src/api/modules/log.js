// 日志管理相关接口
import instance from "@/api/axiosConfig";
function getAllCookie(cookieArr) {
    return cookieArr.map(getCookies).join(";");
}
export function login(data) {
    return new Promise((resolve, reject) => {
        instance({
            url: "http://82.156.8.154/lrapi/Home/Login",
            method: "post",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            data: {
                userName: data.username,
                userPass: data.password,
                remeberMe: "checked",
                dc: new Date().getTime().toString(),
                IsRecordPwd: "on",
            },
        }).then((res) => {
            console.log(res);
            const cookies = res.headers["set-cookie"];
            resolve(getAllCookie(cookies));
        });
    });
}
