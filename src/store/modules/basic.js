export default {
    namespaced: true,
    state: {
        siteInfo: "",
        hotArticle: "",
        tags: "",
        menu: ""
    },
    mutations: {
        SAVE_INFO: function(state, param) {
            state.siteInfo = param.info;
            state.hotArticle = param.hotArticle;
            state.tags = param.tags;
            state.menu = param.menu.records;
        }
    },
    actions: {
        saveBasicInfo() {
            return new Promise(() => {});
        }
    }
};
