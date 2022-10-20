export default {
    namespaced: true,
    state: {
        dataSource: "local", // 数据源 remote | local
        background: "1.jpg" // 背景图片名称 (位置固定：根目录background下)
    },
    mutations: {
        UPDATE_DATASOURCE(state, param) {
            state.dataSource = param;
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
        UPDATE_BACKGROUND(state, param) {
            state.background = param;
        }
    },
    actions: {
        updateDataSource({ commit }, payload) {
            commit("UPDATE_DATASOURCE", payload);
        },
        updateFavicon({ commit }, payload) {
            commit("UPDATE_FAVICON", payload);
        },
        updateBackground({ commit }, payload) {
            commit("UPDATE_BACKGROUND", payload);
        }
    }
};
