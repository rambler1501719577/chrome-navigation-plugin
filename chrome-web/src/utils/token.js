import Cookies from "js-cookie";

// chrome或者本地server获取token
export function getToken() {
    return new Promise(resolve => {
        if (chrome.cookies) {
            chrome.cookies.get(
                {
                    url: "http://www.suhaoblog.cn",
                    name: "token"
                },
                cookie => {
                    resolve(cookie);
                }
            );
        } else {
            resolve({ value: Cookies.get("token") });
        }
    });
}

/**
 * cookie保存token
 * @param {*} payload token
 * @param {*} time 有效时间(秒数)
 */
export function setToken(payload, time = 60 * 60 * 8) {
    return new Promise(resolve => {
        if (chrome.cookies) {
            const expirationDate = parseInt(new Date().getTime() / 1000) + time;
            chrome.cookies.set(
                {
                    url: "http://www.suhaoblog.cn",
                    name: "token",
                    value: payload,
                    expirationDate: expirationDate
                },
                function(cookie) {
                    resolve(cookie);
                }
            );
        } else {
            const expire = new Date(new Date().getTime() + time * 60 * 60);
            Cookies.set("token", payload, {
                expires: expire
            });
            resolve();
        }
    });
}

export function clearToken() {
    Cookies.remove("token");
}
