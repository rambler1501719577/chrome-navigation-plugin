import { getBookmarks } from "./bookmark";
import { getEngineList } from "./engine";
// import { getTodos } from "./todo";

const requestSuccess = (res) => {
    if (res.status == "fulfilled" && res.value.data.code == 200) {
        return true;
    }
    return false;
};

/**
 * 请求云端书签、待办、设置等
 * @returns 云端数据
 */
export function loadCloudData() {
    return new Promise((resolve, reject) => {
        // 请求队列
        const promises = [getBookmarks(), getEngineList()];
        const result = {};
        Promise.allSettled(promises).then(([bookmarkRes, engineRes]) => {
            try {
                // 书签
                if (requestSuccess(bookmarkRes)) {
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

                if (requestSuccess(engineRes)) {
                    result["engines"] = engineRes.value.data.data;
                } else {
                    reject("获取用户搜索引擎失败");
                }

                // if (
                //     todoRes.status == "fulfilled" &&
                //     todoRes.value.code == 200
                // ) {
                //     const todos = todoRes.value.data;
                //     result["todos"] = Array.isArray(todos) ? todos : [];
                // }
                resolve(result);
            } catch (e) {
                reject("获取远程数据异常");
            }
        });
    });
}
