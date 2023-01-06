const popupMenu = [];

// 安装插件时执行的函数
chrome.runtime.onInstalled.addListener(details => {
    console.log(details);
    chrome.contextMenus.create({
        id: "add",
        title: "添加到",
        onclick: function() {
            // chrome.tabs.executeScript(null, {
            //     code: `
            //     var kw = document.querySelector('#kw');
            //     kw.value = 'java';
            //     var but = document.querySelector('#su');
            //     but.click()
            // `
            // });
            console.log("execute tabs script");
        }
    });
});
