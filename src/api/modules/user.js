import { get, post } from "../http";

export function login(data) {
    return post("/api/public/user/oauth", data);
}

export function fetchUserBookmark() {
    return get("/api/bookmark/bookmarks");
}
