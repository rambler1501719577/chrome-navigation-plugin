import contextMenus from "./context-menu.js"; // 右键弹出菜单
import Service from "./service.js";

// 安装和更新时会调用
chrome.runtime.onInstalled.addListener(details => {
    // registe context menus at runtime.onInstalled
    contextMenus.forEach(contextMenu => {
        chrome.contextMenus.create(contextMenu);
    });
});

/**
 * 1. 执行相关逻辑
 * 2. 页面提示用户处理结果
 */
chrome.contextMenus.onClicked.addListener(async ({ menuItemId }, tab) => {
    const processResult = Service.handleContextMenuClicked(menuItemId, tab);
    console.log("处理结果", processResult);

    // 获取当前tab, 注入js和css
    const { id } = await Service.getActiveTab();

    // 嵌入css脚本
    Service.insertCSS(id, ["css/inject.css"]);

    // 执行弹窗
    chrome.scripting.executeScript({
        target: { tabId: id },
        func: Service.toast,
        args: [`${processResult.module}模块执行成功`, "success"]
    });
});
