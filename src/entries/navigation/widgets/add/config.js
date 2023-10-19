export const supportWidgets = {
    site: {
        label: "书签",
        supportSize: [[1, 1]], // 支持大小, 二维数组, 分别标识宽高
        allowCustomIcon: false,
    },
    folder: {
        label: "文件夹",
        supportSize: [[1, 1]], // 支持大小, 二维数组, 分别标识宽高
        allowCustomIcon: false,
    },
    "count-down": {
        label: "倒计时",
        supportSize: [[3, 1]],
        allowCustomIcon: true,
    },
    // {
    //     type: "todo",
    //     label: "待办",
    //     supportSize: [
    //         [1, 1],
    //         [3, 4],
    //     ], // 支持大小, 二维数组, 分别标识宽高
    //     allowCustomIcon: true,
    // },
    // {
    //     type: "music",
    //     label: "R音乐",
    //     supportSize: [
    //         [1, 1],
    //         [3, 1],
    //     ], // 支持大小, 二维数组, 分别标识宽高
    //     allowCustomIcon: true,
    // },
    // {
    //     type: "what-to-eat",
    //     label: "吃什么",
    //     supportSize: [[1, 1]], // 支持大小, 二维数组, 分别标识宽高
    //     allowCustomIcon: true,
    // },
    // {
    //     type: "history",
    //     label: "历史记录",
    //     supportSize: [[1, 1]], // 支持大小, 二维数组, 分别标识宽高
    //     allowCustomIcon: true,
    // },
};

export const widgetPreviewProp = {
    site: {
        id: "1",
        width: 1,
        height: 1,
        url: "www.baidu.com",
        title: "预览书签",
        prop: {
            type: "1",
        },
    },
    folder: {
        id: "2",
        width: 1,
        height: 1,
        title: "预览文件夹",
        prop: {
            children: [],
        },
    },
    "count-down": {
        id: "3",
        title: "倒计时",
        width: 3,
        height: 1,
        prop: {
            title: "死亡倒计时",
            date: new Date("2023-10-30"),
            type: "3x1",
        },
        allowCustomIcon: true,
    },
    todo: {
        id: "3",
        width: 1,
        height: 1,
        title: "待办",
        prop: {},
    },
    music: {
        id: "4",
        width: 1,
        height: 1,
        title: "音乐",
        prop: {},
    },
    "what-to-eat": {},
    history: {},
};
