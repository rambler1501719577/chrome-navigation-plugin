const getMaxIndex = (cachedDialogs) => {
    if (!cachedDialogs || cachedDialogs.length == 0) {
        return 1;
    }
    let sortFunc = (item1, item2) => item2.index - item1.index;
    // 深拷贝一下, 防止排序污染原有数据
    let cloneTagArr = JSON.parse(JSON.stringify(cachedDialogs));
    let maxTagViewIndex = cloneTagArr.sort(sortFunc)[0].index;
    return maxTagViewIndex;
};
export default {
    namespaced: true,
    state: {
        cachedDialogs: [], // { name:String, index: Number }
    },
    mutations: {
        ADD_CACHED_DIALOG(state, params) {
            if (!params.name || !params.index)
                throw new Error("cached dialogs 参数异常");
            state.cachedDialogs.push(params);
        },
        DELETE_CACHED_DIALOGS(state, params) {
            const index = state.cachedDialogs.findIndex(
                (dialog) => dialog.name == params.name
            );
            state.cachedDialogs.splice(index, 1);
        },
        UPDATE_CACHED_DIALOGS(state, params) {
            const { name } = params;
            const newIndex = getMaxIndex(state.cachedDialogs) + 1;
            const index = state.cachedDialogs.findIndex(
                (dialog) => dialog.name == name
            );
            state.cachedDialogs.splice(index, 1, { name, index: newIndex });
        },
    },
    actions: {
        /**
         * 创建或更新缓存队列
         * @param {*} { commit, state }
         * @param {*} payload { name: String, index: Number }
         */
        updateDialogs({ commit, state }, payload) {
            const exist = state.cachedDialogs.find(
                (dialog) => dialog.name == payload.name
            );
            if (exist) {
                commit("UPDATE_CACHED_DIALOGS", payload);
            } else {
                commit("ADD_CACHED_DIALOG", payload);
            }
        },
        /**
         * 删除缓存队列
         * @param {*} { commit }
         * @param {*} payload { name: String }
         */
        deleteCachedDialog({ commit }, payload) {
            commit("DELETE_CACHED_DIALOGS", payload);
        },
    },
    getters: {
        index: (state) => (name) => {
            const currentDialog = state.cachedDialogs.find(
                (dialog) => dialog.name == name
            );
            if (!currentDialog) {
                return getMaxIndex(state.cachedDialogs) + 1;
            } else {
                return currentDialog.index;
            }
        },
    },
};
