import Vue from "vue";
import Vuex from "vuex";
import basic from "./modules/basic";
import setting from "./modules/setting";
import frequentBookmark from "./modules/frequent-bookmark";
import createPersistedState from "vuex-persistedstate";
import engine from "./modules/engine";
import todo from "./modules/todo";
import bookmark from "./modules/bookmark";

import getters from "./getters";
Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        basic,
        setting,
        frequentBookmark,
        engine,
        todo,
        bookmark
    },
    getters,
    strict: true,
    // veux持久化配置
    plugins: [
        createPersistedState({
            key: "cache-data",
            paths: [
                "frequentBookmark",
                "setting",
                "basic",
                "engine",
                "todo",
                "bookmark"
            ]
        })
    ]
});