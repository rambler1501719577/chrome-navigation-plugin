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
            {
                width: 1,
                height: 1,
                component: "site",
                title: "Vue.js",
                url: "https://v2.cn.vuejs.org/v2/guide/installation.html",
                props: {
                    type: 2,
                },
            },
            {
                width: 1,
                height: 1,
                component: "site",
                title: "Vue.js",
                url: "https://v2.cn.vuejs.org/v2/guide/installation.html",
                props: {
                    type: 2,
                },
            },
            {
                width: 1,
                height: 1,
                component: "site",
                title: "Vue.js",
                url: "https://v2.cn.vuejs.org/v2/guide/installation.html",
                props: {
                    type: 2,
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
        ADD_LAYOUT: function (state, payload) {},
        // edit layout
        EDIT_LAYOUT: function (state, payload) {},
        // delete layout
        DELETE_LAYOUT: function (state, payload) {},
    },
    actions: {
        updateFrequentBookmarks({ commit }, payload) {},
    },
};
