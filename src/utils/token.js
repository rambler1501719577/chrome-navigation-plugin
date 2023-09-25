import Cookies from "js-cookie";

// chrome或者本地server获取token
export function getToken() {
    return new Promise((resolve) => {
        if (chrome.cookies) {
            chrome.cookies.get(
                {
                    url: "http://www.suhaoblog.cn",
                    name: "token",
                },
                (cookie) => {
                    resolve(cookie);
                }
            );
        } else {
            resolve({
                value: Cookies.get("token"),
                expirationDate: Cookies.get("token-expires"),
            });
        }
    });
}

/**
 * cookie保存token
 * @param {*} payload token
 * @param {*} time 有效时间(小时数)
 */
export function setToken(payload, time = 8) {
    return new Promise((resolve) => {
        const expirationDate = new Date().getTime() / 1000 + time * 60 * 60;
        if (chrome.cookies) {
            chrome.cookies.set(
                {
                    url: "http://www.suhaoblog.cn",
                    name: "token",
                    value: payload,
                    expirationDate: expirationDate,
                },
                function (cookie) {
                    resolve(cookie);
                }
            );
        } else {
            const expire = new Date(
                new Date().getTime() + time * 60 * 60 * 1000
            );
            Cookies.set("token", payload, {
                expires: expire,
            });
            // 开发环境下保存token-expires来保存过期时间
            Cookies.set("token-expires", expirationDate, {
                expires: expire,
            });
            resolve();
        }
    });
}

// 移除token
export function clearToken() {
    return new Promise((resolve) => {
        if (chrome.cookies) {
            chrome.cookies.remove(
                {
                    url: "http://www.suhaoblog.cn",
                    name: "token",
                },
                () => {
                    resolve();
                }
            );
        } else {
            Cookies.remove("token");
            resolve();
        }
    });
}
