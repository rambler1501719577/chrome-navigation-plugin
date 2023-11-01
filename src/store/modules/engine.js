export default {
    namespaced: true,
    state: {
        currentEngine: "百度",
        // 本地engine配置
        engines: [
            {
                id: "b75b33d4-d94b-4de4-a05e-99c7f8872fe0",
                name: "百度",
                searchUrl: "https://www.baidu.com/s?ie=UTF-8&wd=搜索",
            },
        ],
    },
    mutations: {
        UPDATE_ENGINE(state, payload) {
            state.engines.splice(
                state.engines.findIndex((item) => item.id == payload.id),
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
                (item) => item.id == payload.id
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
            if (state.engines.length > 0) {
                state.currentEngine = state.engines[0].name;
            } else {
                state.currentEngine = "百度";
            }
        },
        CLEAR(state) {
            state.engines.splice(0, state.engines.length);
        },
    },
    getters: {
        localEngines: (state) => state.engines,
        remoteEngines: (state) => state.remoteEngines,
    },
    actions: {
        /**
         * 更新搜索引擎
         * @param {*} payload 格式{type: [add, delete, update], data: {}}
         */
        update({ commit, state }, payload) {
            const { type, data } = payload;
            if (type == "add") {
                commit("ADD_ENGINE", data);
            } else if (type == "delete") {
                commit("DELETE_ENGINE", data);
                // 设置默认搜索引擎
                if (state.currentEngine == data.name) {
                    commit("SET_DEFAULT_ENGINE");
                }
            } else {
                commit("UPDATE_ENGINE", data);
            }
        },
        updateCurrentEngine({ commit }, payload) {
            commit("UPDATE_CURRENT_ENGINE", payload);
        },
        setDefaultEngine({ commit, state }, payload) {
            const { dataSource } = payload;
            if (dataSource == "local") {
                commit("UPDATE_CURRENT_ENGINE", state.engines[0].name);
            } else {
                commit("UPDATE_CURRENT_ENGINE", state.remoteEngines[0].name);
            }
        },
        replaceEngines({ commit }, payload) {
            if (!Array.isArray(payload) || payload.length == 0) {
                return;
            }
            commit("CLEAR");
            payload.forEach((item) => {
                commit("ADD_ENGINE", item);
            });
        },
        repairEngine({ commit, state }) {
            // 重置百度搜索引擎地址
            // 其余搜索引擎检测不到【搜索】关键字直接剔除
            state.engines.forEach((engine, index) => {
                if (engine.name == "百度") {
                    state.engines.splice(index, 1, {
                        id: "b75b33d4-d94b-4de4-a05e-99c7f8872fe0",
                        name: "百度",
                        searchUrl: "https://www.baidu.com/s?ie=UTF-8&wd=搜索",
                    });
                    return;
                }
                const { searchUrl, name } = engine;
                if (decodeURI(searchUrl).indexOf("搜索") == -1) {
                    console.log(`${name}搜索地址异常,已删除`);
                    state.engines.splice(index, 1);
                }
            });
        },
    },
};
