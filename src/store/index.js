import Vue from "vue";
import Vuex from "vuex";
import basic from "./modules/basic";
import setting from "./modules/setting";

import getters from "./getters";
Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        basic,
        setting
    },
    getters,
    strict: true
});
