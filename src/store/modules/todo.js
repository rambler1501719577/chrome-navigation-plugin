export default {
    namespaced: true,
    state: {
        todo: [],
        // 远程todo配置
        remoteTodo: []
    },
    mutations: {
        UPDATE_REMOTE_TODO(state, data) {
            state.remoteTodo = data;
        }
    },
    actions: {
        updateRemoteTodo({ commit }, payload) {
            commit("UPDATE_REMOTE_TODO", payload);
        }
    }
};
