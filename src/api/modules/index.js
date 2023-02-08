import { getBookmarks } from "./bookmark";
import { getTodos } from "./todo";

/**
 * 请求云端书签、待办、设置等
 * @param {*} token token
 * @returns 云端数据
 */
export function loadCloudData(token) {
    return new Promise((resolve, reject) => {
        // 请求队列
        const promises = [getBookmarks(null, token), getTodos(null, token)];
        const result = {};
        Promise.allSettled(promises).then(([bookmarkRes, todoRes]) => {
            try {
                if (
                    bookmarkRes.status == "fulfilled" &&
                    bookmarkRes.value.code == 200
                ) {
                    const bookmarks = bookmarkRes.value.data.records;
                    result["bookmarks"] = Array.isArray(bookmarks)
                        ? bookmarks
                        : [];
                }
                if (
                    todoRes.status == "fulfilled" &&
                    todoRes.value.code == 200
                ) {
                    const todos = todoRes.value.data;
                    result["todos"] = Array.isArray(todos) ? todos : [];
                }
                resolve(result);
            } catch (e) {}
            reject("获取远程数据异常");
        });
    });
}
