import { getBookmarks } from "./bookmark";
// import { getTodos } from "./todo";

/**
 * 请求云端书签、待办、设置等
 * @returns 云端数据
 */
export function loadCloudData() {
    return new Promise((resolve, reject) => {
        // 请求队列
        const promises = [getBookmarks()];
        const result = {};
        Promise.allSettled(promises).then(([bookmarkRes, todoRes]) => {
            try {
                if (
                    bookmarkRes.status == "fulfilled" &&
                    bookmarkRes.value.data.code == 200
                ) {
                    const bookmarks = bookmarkRes.value.data.data.map(
                        (item) => {
                            if (item.children && item.children.length > 0) {
                                const children = item.children;
                                delete item.children;
                                return {
                                    ...item,
                                    props: {
                                        children: children,
                                    },
                                };
                            } else {
                                delete item.children;
                                return item;
                            }
                        }
                    );
                    result["bookmarks"] = Array.isArray(bookmarks)
                        ? bookmarks
                        : [];
                } else {
                    reject("获取书签失败");
                }
                // if (
                //     todoRes.status == "fulfilled" &&
                //     todoRes.value.code == 200
                // ) {
                //     const todos = todoRes.value.data;
                //     result["todos"] = Array.isArray(todos) ? todos : [];
                // }
                resolve(result);
            } catch (e) {}
            reject("获取远程数据异常");
        });
    });
}
