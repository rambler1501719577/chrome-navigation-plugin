export default {
    namespaced: true,
    state: {
        showSidebar: true
    },
    mutations: {
        SWITCH_SIDEBAR(state, param) {
            state.showSidebar = param.showSidebar
        }
    },
    actions: {
        toggleSidebar({
            commit
        }, param) {
            commit("SWITCH_SIDEBAR", param);
        }
    }
};
