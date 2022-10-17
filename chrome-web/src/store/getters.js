const getters = {
    theme: state => state.theme.currentTheme,
    dataSource: state => state.setting.dataSource,
    // 搜索引擎
    engines: state => {
        if (state.setting.dataSource == "local") {
            return state.engine.engines;
        } else {
            return state.engine.remoteEngines;
        }
    },
    // 当前搜索引擎
    currentEngine: state => {
        // 根据数据源选择第一条为默认搜索引擎
        if (state.setting.dataSource == "local") {
            return state.engine.currentEngine || state.engine.engines[0].name;
        } else {
            return (
                state.engine.remoteDefaultEngine ||
                state.engine.remoteEngines[0].name
            );
        }
    },
    // 常用网站
    frequentBookmarks: state => {
        if (state.setting.dataSource == "local") {
            return state.frequentBookmark.frequentBookmarks;
        } else {
            return state.frequentBookmark.remoteFrequentBookmark;
        }
    }
};
export default getters;
