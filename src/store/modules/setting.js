export default {
    namespaced: true,
    state: {
        dataSource: "local", // 数据源 remote | local
        background: {
            belong: "system", // system | custom
            systemBg: "9.jpg", // 系统背景
            customBg: "", // 自定义背景Base64串
            blur: 0,
        }, // 背景图片名称 (位置固定：根目录background下)
        isGuide: false,
        dynamicBackground: "snow", // 特效名称，snow | bubble | empty
        fixedBarWidth: 60, // 左侧固定栏宽度
        boxPadding: 15, // grid-component-container的padding 用于计算grid合适宽高
    },
    mutations: {
        UPDATE_DATASOURCE(state, param) {
            state.dataSource = param;
        },
        UPDATE_DYNAMIC_BACKGROUND(state, param) {
            state.dynamicBackground = param;
        },
        UPDATE_FAVICON(state, param) {
            let cacheMap = localStorage.getItem("iconMap");
            let iconMap = {};
            if (cacheMap) iconMap = JSON.parse(cacheMap);
            if (!iconMap[param.src]) {
                iconMap[param.src] = param.icon;
                localStorage.setItem("iconMap", JSON.stringify(iconMap));
            }
        },
        UPDATE_BACKGROUND(state, { belong = "system", src = "" }) {
            state.background.belong = belong;
            if (belong == "system") {
                state.background.systemBg = src;
            } else {
                state.background.customBg = src;
            }
        },
        UPDATE_IS_GUIDE(state) {
            // 只指引一次，更新后置为false
            state.isGuide = true;
        },
    },
    actions: {
        updateDataSource({ commit }, payload) {
            commit("UPDATE_DATASOURCE", payload);
        },
        updateFavicon({ commit }, payload) {
            commit("UPDATE_FAVICON", payload);
        },
        /**
         * 更新背景
         * @param {*} payload {belong: system | custom, src: 背景地址 | base64 image}
         */
        updateBackground({ commit }, payload) {
            commit("UPDATE_BACKGROUND", payload);
        },
        updateIsGuide({ commit }) {
            commit("UPDATE_IS_GUIDE");
        },
        updateDynamicBackground({ commit }, payload) {
            commit("UPDATE_DYNAMIC_BACKGROUND", payload);
        },
    },
    getters: {
        belong: (state) => state.background.belong,
        background: (state) => state.background.src,
        dynamicBackground: (state) => state.dynamicBackground,
    },
};
