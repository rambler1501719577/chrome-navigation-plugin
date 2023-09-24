export const supportComponents = [
    {
        type: "folder",
        label: "文件夹",
        supportSize: [
            [1, 1],
            [2, 2],
        ], // 支持大小, 二维数组, 分别标识宽高
        allowCustomIcon: false,
    },
    {
        type: "site",
        label: "书签",
        supportSize: [[1, 1]], // 支持大小, 二维数组, 分别标识宽高
        allowCustomIcon: false,
    },
    {
        type: "todo",
        label: "待办",
        supportSize: [
            [1, 1],
            [3, 4],
        ], // 支持大小, 二维数组, 分别标识宽高
        allowCustomIcon: true,
    },
    {
        type: "music",
        label: "R音乐",
        supportSize: [
            [1, 1],
            [3, 1],
        ], // 支持大小, 二维数组, 分别标识宽高
        allowCustomIcon: true,
    },
    {
        type: "what-to-eat",
        label: "吃什么",
        supportSize: [[1, 1]], // 支持大小, 二维数组, 分别标识宽高
        allowCustomIcon: true,
    },
    {
        type: "history",
        label: "历史记录",
        supportSize: [[1, 1]], // 支持大小, 二维数组, 分别标识宽高
        allowCustomIcon: true,
    },
];
