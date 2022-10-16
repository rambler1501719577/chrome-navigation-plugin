import Cookies from "js-cookie";

// chrome或者本地server获取token
export function getToken() {
    return new Promise((resolve, reject) => {
        if (chrome) {
            chrome.cookies.get(
                {
                    name: "token",
                    url: "http://rambler.com"
                },
                function(token) {
                    resolve(token);
                }
            );
        } else {
            resolve(Cookies.get("token"));
        }
    });
}

export function setToken(payload) {
    return new Promise((resolve, reject) => {
        if (chrome) {
            chrome.cookies.set(
                {
                    url: "http://rambler.com",
                    name: "token",
                    value: payload,
                    secure: false,
                    httpOnly: false
                },
                function() {
                    resolve();
                }
            );
        } else {
            Cookies.set("token", payload, {
                expires: 1
            });
            resolve();
        }
    });
}

export function clearToken() {
    Cookies.remove("token");
}
