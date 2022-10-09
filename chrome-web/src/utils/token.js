import Cookies from "js-cookie";

export function getToken() {
    return Cookies.get("token");
}

export function setToken(payload) {
    Cookies.set("token", payload, {
        expires: 1
    });
}

export function clearToken() {
    Cookies.remove("token");
}
