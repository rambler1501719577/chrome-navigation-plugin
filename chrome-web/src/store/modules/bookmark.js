export default {
    namespaced: true,
    state: {
        bookmark: [],
        remoteBookmark: []
    },
    getters: {
        bookmark: state => state.bookmark
    },
    mutations: {
        UPDATE_BOOKMARK(state, payload) {
            state.bookmark = payload;
        },
        UPDATE_REMOTE_BOOKMARK(state, payload) {
            state.remoteBookmark = payload;
        }
    },
    actions: {
        updateRemoteBookmark({ commit }, payload) {
            commit("UPDATE_REMOTE_BOOKMARK", payload);
        },
        // 异步获取bookmarks
        updateBookmark({ commit }) {
            chrome.bookmarks.getTree().then(res => {
                commit("UPDATE_BOOKMARK", res[0].children[0].children);
            });
        }
    }
};
