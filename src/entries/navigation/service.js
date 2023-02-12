/**
 * chrome相关api
 * @author rambler
 * @date 2023年2月9日09:42:35
 */
import { randomNum } from "@/utils";
// 树形书签数据
export function getBookmarkTree() {
    return new Promise((resolve, reject) => {
        if (!chrome.bookmarks) {
            resolve([]);
        }
        chrome.bookmarks.getTree().then((res) => {
            // 默认情况下chrome书签分为书签栏和其他书签
            // 为了考虑到用户体验，将其他书签合并到书签栏中，作为一个独立的文件夹
            const result = res[0].children[0].children; //书签栏数据
            if (res[0].children[1]) {
                result.push(res[0].children[1]); //其他书签
            }
            resolve(result);
        });
    });
}

// 获取favicon图标地址
export function getIconUrl(url, size = 32) {
    if (!chrome.runtime || !url) {
        return "";
    }
    const prepareUrl = new URL(chrome.runtime.getURL("/_favicon/"));
    prepareUrl.searchParams.set("pageUrl", url);
    prepareUrl.searchParams.set("size", size);
    return prepareUrl.toString();
}

// 创建书签收藏夹
export function createBookmarkFolder(title, parentId = "0") {
    if (!chrome.bookmarks) {
        throw new Error("无法访问chrome api");
    }
    chrome.bookmarks.create({
        parentId: parentId,
        title: title,
    });
}

// 获取书签子树
export function getBookmarkSubTree(id) {
    return new Promise((resolve, reject) => {
        if (!chrome.bookmarks) {
            resolve(randomData());
        }
        chrome.bookmarks.getChildren(id, (list) => {
            resolve(list);
        });
    });
}

// 更新书签
export function updateBookmark(id, title, url) {
    if (!chrome.bookmarks) {
        throw new Error("无法访问chrome对象");
    }
    return new Promise((resolve, reject) => {
        try {
            chrome.bookmarks.update(id, { title, url }, (result) => {
                resolve(result);
            });
        } catch (e) {
            reject("更新书签异常");
        }
    });
}

// 删除书签
export function removeBookmark(id) {
    if (!chrome.bookmarks) {
        throw new Error("无法访问chrome对象");
    }
    return new Promise((resolve, reject) => {
        if (!id) reject("id为空，删除失败");
        chrome.bookmarks.remove(id, () => {
            resolve();
        });
    });
}

// 删除书签文件夹
export function removeBookmarkTree(bookmarkTreeId) {
    if (!chrome.bookmarks) {
        throw new Error("无法访问chrome对象");
    }
    return new Promise((resolve, reject) => {
        if (!bookmarkTreeId) reject("文件夹id为空，删除失败");
        chrome.bookmarks.removeTree(bookmarkTreeId, (res) => {
            resolve();
        });
    });
}

// 在chrome历史记录中搜索
export function searchFromHistory(keywords, total) {
    // chrome history对象提供的search匹配机制没理解
    return new Promise((resolve, reject) => {
        if (!chrome.history || !keywords) {
            resolve([]);
        }
        chrome.history.search(
            {
                text: keywords,
                maxResults: total,
            },
            (res) => {
                resolve(res.map((ele) => ({ ...ele, from: "history" })));
            }
        );
    });
}

// mock bookmark data
const randomData = () => {
    const arr = [];
    const times = randomNum(2, 10);
    for (let i = 0; i < times; i++) {
        arr.push({
            dateAdded: 1628582602825,
            dateGroupModified: 1673316216588,
            id: "2",
            index: 1,
            url: i % 2 == 0 ? "111" : "",
            parentId: "0",
            title: "随机" + i + "",
        });
    }
    return arr;
};
