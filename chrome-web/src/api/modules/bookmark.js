import instance from "@/api/axiosConfig";
import { bookmark } from "../urls";

// 所有书签
export function getBookmarks(params, token) {
    return instance({
        url: bookmark.list,
        method: "get",
        params: params,
        headers: {
            Authorization: token
        }
    });
}
