import instance from "@/api/axiosConfig";
import { bookmark } from "../urls";

// 所有书签
export function getBookmarks() {
    return instance({
        url: bookmark.list,
        method: "get",
    });
}

// 添加书签
export function addBookmark(data) {
    return instance({
        url: bookmark.add,
        method: "post",
        data: data,
    });
}
