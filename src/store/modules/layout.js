import { addBookmark, hideBookmark } from "@/api/modules/bookmark";
export default {
    namespaced: true,
    state: {
        widgetSize: 80,
        row: 4,
        column: 16,
        gap: 30, // gap
        widgets: [
            {
                width: 1,
                height: 1,
                component: "folder",
                title: "VUE生态",
                props: {
                    children: [
                        {
                            width: 1,
                            height: 1,
                            component: "site",
                            title: "Vue.js",
                            url: "https://v2.cn.vuejs.org/v2/guide/installation.html",
                        },
                        {
                            width: 1,
                            height: 1,
                            component: "site",
                            title: "Element",
                            url: "https://element.eleme.cn/#/zh-CN/component/installation",
                        },
                    ],
                },
            },
            {
                width: 1,
                height: 1,
                component: "site",
                title: "Vue.js",
                url: "https://v2.cn.vuejs.org/v2/guide/installation.html",
                props: {
                    type: 1,
                },
            },
        ],
    },
    getters: {},
    mutations: {
        UPDATE_FREQUENT_BOOKMARKS: function (state, payload) {},
        // resize widget's size
        SET_WIDGET_SIZE: function (state, payload) {},
        // justify rows
        SET_LAYOUT_ROW: function (state, payload) {},
        // justify columns
        SET_LAYOUT_COLUMN: function (state, payload) {},
        // reset layout
        SET_LAYOUT: function (state, payload) {},
        // add layout
        ADD_LAYOUT: function (state, payload) {
            state.widgets.push(payload);
        },
        // edit layout
        EDIT_LAYOUT: function (state, payload) {},
        // 删除组件
        DELETE_WIDGET: function (state, payload) {
            if (!payload.id) return;
            const index = state.widgets.findIndex((v) => v.id == payload.id);
            if (index !== -1) state.widgets.splice(index, 1);
        },
        // 更新所有组件
        SET_WIDGETS: function (state, payload) {
            state.widgets = payload;
        },
        // 更新组件, 删除并替换一个新的
        EDIT_WIDGET: function (state, payload) {
            const { id } = payload;
            const index = state.widgets.findIndex((v) => v.id == id);
            if (index !== -1) {
                state.widgets.splice(index, 1, payload);
            } else {
                console.log("更新失败,未找到对应组件");
            }
        },
    },
    actions: {
        updateFrequentBookmarks({ commit }, payload) {},
        setWidgets({ commit }, payload) {
            commit("SET_WIDGETS", payload);
        },
        // 注册组件
        addWidget({ commit }, payload) {
            return new Promise((resolve, reject) => {
                addBookmark(payload).then((res) => {
                    if (res.data.code == 200) {
                        commit("ADD_LAYOUT", payload);
                        resolve();
                    } else {
                        reject();
                    }
                });
            });
        },
        // 更新Site组件信息
        updateSiteWidget({ commit }, payload) {
            return new Promise((resolve, reject) => {
                if (!payload.id) {
                    reject("widget的id为空,更新失败");
                }
                commit("EDIT_WIDGET", payload);
                resolve();
            });
        },
        // 隐藏组件
        hideWidget({ commit }, payload) {
            return new Promise((resolve, reject) => {
                if (!payload.id) {
                    resolve("删除书签失败, id为空");
                }
                hideBookmark(payload).then((res) => {
                    if (res.data.code == 200) {
                        commit("DELETE_WIDGET", payload);
                        resolve();
                    } else {
                        reject(res.data.msg);
                    }
                });
            });
        },
    },
};
