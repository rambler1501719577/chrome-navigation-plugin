module.exports = {
    SAVE_INFO: function(state, param) {
        state.siteInfo = param.info;
        state.hotArticle = param.hotArticle;
        state.tags = param.tags;
        state.menu = param.menu.records;
    }
}
