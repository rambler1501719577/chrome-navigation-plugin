export default {
    namespaced: true,
    state: {
        currentEngine: "baidu",
        engines: [
            {
                id: "b75b33d4-d94b-4de4-a05e-99c7f8872fe0",
                name: "百度",
                searchUrl: "https://www.baidu.com/s?ie=UTF-8&wd="
            }
        ]
    },
    mutations: {
        UPDATE_ENGINE(state, payload) {
            state.engines.splice(
                state.engines.findIndex(item => item.id == payload.id),
                1,
                payload
            );
        },
        ADD_ENGINE(state, payload) {
            if (!payload) {
                return;
            }
            state.engines.push(payload);
        },
        DELETE_ENGINE(state, payload) {
            const index = state.engines.findIndex(
                item => item.id == payload.id
            );
            if (index !== -1) {
                state.engines.splice(index, 1);
            } else {
                this.$message.error("删除失败, 数据不存在");
            }
        },
        UPDATE_CURRENT_ENGINE(state, payload) {
            state.currentEngine = payload;
        },
        SET_DEFAULT_ENGINE(state) {
            state.currentEngine = state.engines[0].name;
        }
    },
    getters: {
        engines: state => state.engines,
        currentEngine: state => state.currentEngine
    },
    actions: {
        update({ commit }, payload) {
            const { type, data } = payload;
            if (type == "add") {
                commit("ADD_ENGINE", data);
            } else if (type == "delete") {
                commit("DELETE_ENGINE", data);
                commit("SET_DEFAULT_ENGINE");
            } else {
                commit("UPDATE_ENGINE", data);
            }
        },
        updateCurrentEngine({ commit }, payload) {
            commit("UPDATE_CURRENT_ENGINE", payload);
        }
    }
};
