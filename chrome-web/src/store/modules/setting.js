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
        ]
    },
    mutations: {
        UPDATE_ENGINES(state, param) {
            state.showSidebar = param.showSidebar;
        },
        UPDATE_FAVICON(state, param) {
            let cacheMap = localStorage.getItem("iconMap");
            let iconMap = {};
            if (cacheMap) iconMap = JSON.parse(cacheMap);
            if (!iconMap[param.src]) {
                iconMap[param.src] = param.icon;
                localStorage.setItem("iconMap", JSON.stringify(iconMap));
            }
        }
    },
    getters: {
        engines: state => state.engines
    },
    actions: {
        setEngines({ commit }, param) {
            commit("UPDATE_ENGINES", param);
        },
        updateFavicon({ commit }, payload) {
            commit("UPDATE_FAVICON", payload);
        }
    }
};
