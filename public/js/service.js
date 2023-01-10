const eventHandlerMap = {
    ["add-2-frequent"]: tab => {
        console.log("frequent clicked");
        console.log(tab);
        return createContextMenuResult("add-2-frequent", true);
    },
    ["add-2-bookmark"]: tab => {
        console.log("bookmark clicked");
        console.log(tab);
        return createContextMenuResult("add-2-bookmark", true);
    }
};

function createContextMenuResult(menuId, success = true) {
    return {
        module: menuId,
        success
    };
}

export default {
    handleContextMenuClicked: (menuItemId, tab) => {
        return eventHandlerMap[menuItemId](tab);
    },
    toast: (message, type) => {
        const messageBox = document.createElement("div");
        messageBox.innerHTML = message;
        messageBox.style.right = "15px";
        messageBox.style.top = "15px";
        messageBox.className = `rambler-toast rambler-toast-${type}`;
        document.body.appendChild(messageBox);
        setTimeout(() => {
            messageBox.remove();
        }, 1500);
    },

    getActiveTab: () => {
        return new Promise((resolve, reject) => {
            chrome.tabs.query(
                {
                    currentWindow: true,
                    active: true
                },
                tabs => {
                    if (tabs.length > 0) {
                        resolve(tabs[0]);
                    }
                    reject("未能捕获到活动窗口");
                }
            );
        });
    },
    /**
     * 向目标标签注入css文件
     * @param {*} tabId 标签id
     * @param {*} files 文件路径(相对于扩展的根路径，如css/inject.css)
     */
    insertCSS: function(tabId, files) {
        chrome.scripting.insertCSS({
            target: {
                tabId: tabId
            },
            files: files
        });
    }
};
