export default {
    namespaced: true,
    state: {
        bookmark: [],
        remoteBookmark: []
    },
    mutations: {
        UPDATE_REMOTE_BOOKMARK(state, payload) {
            state.remoteBookmark = payload;
        }
    },
    actions: {
        updateRemoteBookmark({ commit }, payload) {
            commit("UPDATE_REMOTE_BOOKMARK", payload);
        }
    }
};
