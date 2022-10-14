import Vue from "vue";
import Vuex from "vuex";
import basic from "./modules/basic";
import setting from "./modules/setting";
import frequentBookmark from "./modules/frequent-bookmark";
import createPersistedState from "vuex-persistedstate";

import getters from "./getters";
Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        basic,
        setting,
        frequentBookmark
    },
    getters,
    strict: true,
    // veux持久化配置
    plugins: [
        createPersistedState({
            key: "cache-data",
            paths: ["frequentBookmark", "setting", "basic"]
        })
    ]
});
