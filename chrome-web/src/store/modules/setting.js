export default {
    namespaced: true,
    state: {
        dataSource: "local" // 数据源 remote | local
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
        }
    },
    actions: {
        updateDataSource({ commit }, payload) {
            commit("UPDATE_DATASOURCE", payload);
        },
        updateFavicon({ commit }, payload) {
            commit("UPDATE_FAVICON", payload);
        }
    }
};
