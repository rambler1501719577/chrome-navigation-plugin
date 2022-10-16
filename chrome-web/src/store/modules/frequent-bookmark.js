export default {
    namespaced: true,
    state: {
        frequentBookmarks: []
    },
    mutations: {
        UPDATE_FREQUENT_BOOKMARKS(state, payload) {
            state.frequentBookmarks.splice(
                state.frequentBookmarks.findIndex(
                    item => item.id == payload.id
                ),
                1,
                payload
            );
        },
        ADD_FREQUENT_BOOKMARKS(state, payload) {
            if (!payload) {
                return;
            }
            state.frequentBookmarks.push(payload);
        },
        DELETE_FREQUENT_BOOKMARKS(state, payload) {
            const index = state.frequentBookmarks.findIndex(
                item => item.id == payload.id
            );
            state.frequentBookmarks.splice(index, 1);
        }
    },
    getters: {
        frequentBookmarks: state => {
            return state.frequentBookmarks;
        }
    },
    actions: {
        // 通用方法，更新state
        update({ commit }, payload) {
            const { type, data } = payload;
            if (type == "add") {
                commit("ADD_FREQUENT_BOOKMARKS", data);
            } else if (type == "delete") {
                commit("DELETE_FREQUENT_BOOKMARKS", data);
            } else {
                commit("UPDATE_FREQUENT_BOOKMARKS", data);
            }
        }
    }
};
