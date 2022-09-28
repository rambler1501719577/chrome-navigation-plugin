export default {
    namespaced: true,
    state: {
        engines: [
            {
                name: "baidu",
                label: "百度",
                searchUrl: "https://www.baidu.com/s?ie=UTF-8&wd="
            },
            {
                name: "npm",
                label: "NPM",
                searchUrl: "https://www.npmjs.com/search?q="
            },
            {
                name: "mdn",
                label: "MDN",
                searchUrl: "https://developer.mozilla.org/en-US/search?q="
            },
            {
                name: "github",
                label: "GitHub",
                searchUrl: "https://github.com/search?q="
            },
            {
                name: "zhihu",
                label: "知乎",
                searchUrl: "https://www.zhihu.com/search?type=content&q="
            },
            {
                name: "iconfont",
                label: "Iconfont",
                searchUrl:
                    "https://www.iconfont.cn/search/index?searchType=icon&q="
            },
            {
                name: "aiqiyi",
                label: "爱奇艺",
                searchUrl: "https://so.iqiyi.com/so/q_"
            },
            {
                name: "bilibili",
                label: "哔哩哔哩",
                searchUrl: "https://search.bilibili.com/all?keyword="
            }
        ],
        frequentBookmarks: [
            {
                icon: "",
                name: "Vue Doc",
                url: "www.suhaoblog.cn",
                order: ""
            },
            {
                icon: "",
                name: "Element",
                url: "element.eleme.cn/#/zh-CN/component/datetime-picker",
                order: ""
            }
        ]
    },
    mutations: {
        UPDATE_ENGINES(state, param) {
            state.showSidebar = param.showSidebar;
        }
    },
    getters: {
        engines: state => state.engines,
        frequentBookmarks: state => state.frequentBookmarks
    },
    actions: {
        setEngines({ commit }, param) {
            commit("UPDATE_ENGINES", param);
        }
    }
};
