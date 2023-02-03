import { v4 as uuidv4 } from "uuid";
export default {
    namespaced: true,
    state: {
        // {id: String, name: String, url: String, from: String, index: String}
        frequentBookmarks: [],
        // 远程常用网站
        remoteFrequentBookmark: [
            {
                name: "VUEX",
                url: "https://vuex.vuejs.org/zh/guide/getters.html#%E9%80%9A%E8%BF%87%E6%96%B9%E6%B3%95%E8%AE%BF%E9%97%AE",
            },
        ],
    },
    getters: {
        localFrequentBookmarks: (state) => state.frequentBookmarks,
    },
    mutations: {
        UPDATE_FREQUENT_BOOKMARKS(state, payload) {
            state.frequentBookmarks.splice(
                state.frequentBookmarks.findIndex(
                    (item) => item.id == payload.id
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
                (item) => item.id == payload.id
            );
            state.frequentBookmarks.splice(index, 1);
        },
        CLEAR(state) {
            state.frequentBookmarks.splice(0, state.frequentBookmarks.length);
        },
    },
    actions: {
        // 通用方法，更新state
        update({ commit, state }, payload) {
            const { type, data } = payload;
            if (type == "add") {
                // 判断是否存在,存在即更新，否则添加
                const index = state.frequentBookmarks.findIndex(
                    (item) => item.name == data.name && item.url == data.url
                );
                if (index !== -1) {
                    console.log("【frequent-website】添加失败,数据已经存在");
                    return;
                    // commit("UPDATE_FREQUENT_BOOKMARKS", data);
                } else {
                    payload.id = uuidv4();
                    commit("ADD_FREQUENT_BOOKMARKS", data);
                }
            } else if (type == "delete") {
                commit("DELETE_FREQUENT_BOOKMARKS", data);
            } else {
                commit("UPDATE_FREQUENT_BOOKMARKS", data);
            }
        },
        // 导入替换所有的常用网址
        replaceFrequentBookmark({ commit }, payload) {
            if (!payload || !Array.isArray(payload) || payload.length == 0)
                return;
            commit("CLEAR");
            payload.forEach((item) => {
                commit("ADD_FREQUENT_BOOKMARKS", item);
            });
        },
        // 自动修复数据格式异常问题
        autoRepair() {},
    },
};
