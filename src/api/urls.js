module.exports = {
    user: {
        login: "/api/user/oauth",
    },
    bookmark: {
        list: "/api/bookmark/bookmarks",
        add: "/api/bookmark/create",
        hide: "/api/bookmark/updateStatus",
        updateProp: "/api/bookmark/updateProps",
        destory: "/api/bookmark/destroy",
    },
    todo: {
        list: "/api/todo/selectAll",
    },
};
