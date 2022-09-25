const { ADMIN_SERVER, WEB_SERVER } = require('@/settings');
module.exports = {
    article: {
        categoryArticle: WEB_SERVER + '/article/selectPageByCondition',
        indexArticleList: WEB_SERVER + '/article/indexList',
        articles: WEB_SERVER + '/articles',
        detail: WEB_SERVER + '/article/selectOne',
        tagArticle: WEB_SERVER + '/article/selectByTag',
        hotArticle: WEB_SERVER + '/article/selectHotArticle'
    },
    basic: {
        tag: WEB_SERVER + "/tag/selectAll",
        siteInfo: WEB_SERVER + "/basic/getSiteInfo",
        me: WEB_SERVER + "/setting/selectMe"
    },
    classify: {
        list: WEB_SERVER + "/classify/selectAll"
    },
    collection: {
        list: WEB_SERVER + "/collection/selectAll"
    },
    friend: {
        list: WEB_SERVER + "/friend/applyPageData",
        submit: WEB_SERVER + "/friend/applyFriend"
    },
    menu: {
        list: ADMIN_SERVER + "/menu/selectMenuList"
    },
    reply: {
        submit: WEB_SERVER + "/reply/insert",
        list: WEB_SERVER + "/reply/selectPage"
    },
    words: {
        list: WEB_SERVER + "/think/selectAll"
    }
}
