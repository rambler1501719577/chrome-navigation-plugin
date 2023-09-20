import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import getters from "./getters";

const env = process.env.NODE_ENV;
const persisteKey = "cache-data";

Vue.use(Vuex);

// automatic import modules
let importModules = {};
const ctx = require.context("./modules", false, /\.js$/);
ctx.keys().forEach((key) => {
    // format key
    const moduleName = key.replace(/\.\/(.*?)\.js$/g, "$1");
    importModules[moduleName] = ctx(key).default;
});

const store = new Vuex.Store({
    modules: { ...importModules },
    getters,
    strict: true,
    // veux持久化配置
    plugins:
        env == !"development"
            ? [
                  createPersistedState({
                      key: persisteKey,
                      paths: Object.keys(importModules),
                  }),
              ]
            : [],
});

export default store;
