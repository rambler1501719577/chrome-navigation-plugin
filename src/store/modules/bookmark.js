import { getBookmarkTree } from "chrome-service";
export default {
    namespaced: true,
    state: {
        bookmark: [],
        remoteBookmark: [],
    },
    getters: {
        localBookmark: (state) => state.bookmark,
    },
    mutations: {
        UPDATE_BOOKMARK(state, payload) {
            state.bookmark = payload;
        },
        UPDATE_REMOTE_BOOKMARK(state, payload) {
            state.remoteBookmark = payload;
        },
    },
    actions: {
        updateRemoteBookmark({ commit }, payload) {
            commit("UPDATE_REMOTE_BOOKMARK", payload);
        },
        // 异步获取bookmarks
        updateBookmark({ commit }) {
            getBookmarkTree().then((bookmarkTree) => {
                commit("UPDATE_BOOKMARK", bookmarkTree);
            });
        },
    },
};
