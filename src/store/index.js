import Vue from "vue";
import Vuex from "vuex";
import theme from "./modules/theme";
import basic from "./modules/basic/index.js";
import setting from './modules/setting';

import getters from "./getters";
Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        theme,
        basic,
        setting
    },
    getters,
    strict: true
});
