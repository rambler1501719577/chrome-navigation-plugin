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
                name: "Vue Doc",
                url: "http://www.suhaoblog.cn?id=212"
            },
            {
                name: "Element",
                url:
                    "https://element.eleme.cn/#/zh-CN/component/datetime-picker"
            },
            {
                name: "账号收益",
                url:
                    "http://wb.renwozuan.com/?_time=1657893845237&id=11123955&password=dami1234"
            },
            {
                name: "bilibili",
                url:
                    "https://www.bilibili.com/medialist/play/ml1717621061/BV1D4411K7mA?spm_id_from=333.788.0.0&oid=54876984&otype=2"
            },
            {
                name: "CSDN",
                url:
                    "https://blog.csdn.net/qq_44204058/article/details/109611297"
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
        frequentBookmarks: state => {
            return state.frequentBookmarks;
        }
    },
    actions: {
        setEngines({ commit }, param) {
            commit("UPDATE_ENGINES", param);
        }
    }
};
