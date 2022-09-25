const getters = {
    theme: state => state.theme.currentTheme,
    tags: state => state.basic.tags,
    hotArticle: state => state.basic.hotArticle,
    info: state => state.basic.siteInfo,
    menu: state => state.basic.menu,
    showSidebar: state => state.setting.showSidebar
};
export default getters;
