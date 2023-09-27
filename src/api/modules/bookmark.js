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

// 更新widget状态
export function updateWidgetStatus(data) {
    return instance({
        url: bookmark.hide,
        method: "put",
        data,
    });
}

export function updateWidgetProps(data) {
    return instance({
        url: bookmark.updateProp,
        method: "put",
        data,
    });
}
