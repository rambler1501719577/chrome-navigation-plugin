import Vue from "vue";
import Vuex from "vuex";
import basic from "./modules/basic";
import setting from "./modules/setting";
import frequentBookmark from "./modules/frequent-bookmark";
import createPersistedState from "vuex-persistedstate";
import engine from "./modules/engine";
import todo from "./modules/todo";
import bookmark from "./modules/bookmark";
import dialog from "./modules/dialog";

import getters from "./getters";
Vue.use(Vuex);
const env = process.env.NODE_ENV;
const persisteKey = "cache-data";

const persistePlugin = createPersistedState({
    key: persisteKey,
    paths: [
        "frequentBookmark",
        "setting",
        "basic",
        "engine",
        "todo",
        "bookmark",
        "dialog",
    ],
});

const store = new Vuex.Store({
    modules: {
        basic,
        setting,
        frequentBookmark,
        engine,
        todo,
        bookmark,
        dialog,
    },
    getters,
    strict: true,
    // veux持久化配置
    plugins: [],
});
if (env !== "development") {
    store.plugins.push(persistePlugin);
} else {
    localStorage.removeItem(persisteKey);
    console.log(`当前为【${env}】环境，不开启持久化`);
}

export default store;
