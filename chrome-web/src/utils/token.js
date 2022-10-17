import Cookies from "js-cookie";

// chrome或者本地server获取token
export function getToken() {
    return new Promise(resolve => {
        chrome.cookies.get(
            {
                url: "http://www.suhaoblog.cn",
                name: "token"
            },
            cookie => {
                resolve(cookie);
            }
        );
    });
}

/**
 * cookie保存token
 * @param {*} payload token
 * @param {*} time 有效时间(秒数)
 */
export function setToken(payload, time = 60 * 60 * 8) {
    return new Promise(resolve => {
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
    });
}

export function clearToken() {
    Cookies.remove("token");
}
