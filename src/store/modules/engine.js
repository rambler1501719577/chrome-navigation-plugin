import { addEngine, destroyEngine, updateEngine } from "@/api/modules/engine";
export default {
    namespaced: true,
    state: {
        currentEngine: "百度",
        // 本地engine配置
        engines: [],
        defaultEngine: {
            id: "b75b33d4-d94b-4de4-a05e-99c7f8872fe0",
            title: "百度",
            searchUrl: "https://www.baidu.com/s?ie=UTF-8&wd=搜索",
        },
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
        DELETE_ENGINE(state, engineId) {
            const index = state.engines.findIndex(
                (item) => item.id == engineId
            );
            state.engines.splice(index, 1);
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
        // 设置所有的engines
        SET_ENGINES(state, payload) {
            state.engines = [state.defaultEngine, ...payload];
        },
    },
    getters: {
        localEngines: (state) => state.engines,
    },
    actions: {
        setEngines({ commit }, payload) {
            if (Array.isArray(payload)) {
                commit("SET_ENGINES", payload);
                commit("SET_DEFAULT_ENGINE");
            }
        },
        // 更新当前搜索引擎
        updateCurrentEngine({ commit }, payload) {
            if (!payload) {
                return;
            }
            commit("UPDATE_CURRENT_ENGINE", payload);
        },
        setDefaultEngine({ commit, state }, payload) {
            const { dataSource } = payload;
            if (dataSource == "local") {
                commit("UPDATE_CURRENT_ENGINE", state.engines[0].title);
            } else {
                commit("UPDATE_CURRENT_ENGINE", state.remoteEngines[0].title);
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
        // 添加搜索引擎
        add({ commit }, payload) {
            return new Promise((resolve, reject) => {
                addEngine(payload)
                    .then((res) => {
                        const { code, data, msg } = res.data;
                        if (code == 200) {
                            commit("ADD_ENGINE", data);
                            resolve();
                        } else {
                            reject(msg);
                        }
                    })
                    .catch((e) => {
                        const msg = `创建失败, 错误信息: ${e}`;
                        reject(msg);
                    });
            });
        },
        /**
         * 更新搜索引擎
         * @param {*} payload {id: required, title:"", searchUrl:""}
         */
        update({ commit, state }, engine) {
            return new Promise((resolve, reject) => {
                if (!engine.id) {
                    reject("id为空, 更新失败");
                }
                updateEngine(engine).then((res) => {
                    const { code, data, msg } = res.data;
                    if (code == 200) {
                        commit("UPDATE_ENGINE", data);
                        resolve();
                    } else {
                        reject(msg);
                    }
                });
            });
        },
        // 删除搜索引擎
        delete({ commit }, engineId) {
            return new Promise((resolve, reject) => {
                if (!engineId) {
                    reject("id为空, 删除失败");
                }
                destroyEngine({ ids: engineId })
                    .then((res) => {
                        const { code, msg } = res.data;
                        if (code == 200) {
                            commit("DELETE_ENGINE", engineId);
                            commit("SET_DEFAULT_ENGINE");
                            resolve();
                        } else {
                            reject(msg);
                        }
                    })
                    .catch((e) => {
                        reject(e);
                    });
            });
        },
        repairEngine({ commit, state }) {
            // 重置百度搜索引擎地址
            // 其余搜索引擎检测不到【搜索】关键字直接剔除
            state.engines.forEach((engine, index) => {
                if (engine.title == "百度") {
                    state.engines.splice(index, 1, state.defaultEngine);
                    return;
                }
                const { searchUrl, title } = engine;
                if (decodeURI(searchUrl).indexOf("搜索") == -1) {
                    console.log(`${title}搜索地址异常,已删除`);
                    state.engines.splice(index, 1);
                }
            });
        },
    },
};
