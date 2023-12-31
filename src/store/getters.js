import _ from "lodash";
const getChildren = (widget) => {
    if (
        !widget.props ||
        !widget.props.children ||
        widget.props.children.length == 0
    ) {
        return [widget];
    } else {
        const children = [];
        widget.props.children.forEach((item) => {
            children.push(...getChildren(item));
        });
        return children;
    }
};
const getters = {
    theme: (state) => state.theme.currentTheme,
    dataSource: (state) => state.setting.dataSource,
    // 搜索引擎
    engines: (state) => {
        if (state.setting.dataSource == "local") {
            return state.engine.engines;
        } else {
            return state.engine.remoteEngines;
        }
    },
    // 当前搜索引擎
    currentEngine: (state) => {
        // 根据数据源选择第一条为默认搜索引擎
        if (state.engine.currentEngine) return state.engine.currentEngine;
        let currentEngine = "";
        if (state.setting.dataSource == "local") {
            currentEngine = state.engine.engines[0].name;
        } else {
            currentEngine = state.engine.remoteEngines[0].name;
        }
        if (!currentEngine) {
            return "百度";
        }
    },
    flatWidgets: (state) => {
        const treeWidgets = state.layout.widgets;
        const widgets = [];
        treeWidgets.forEach((v) => {
            widgets.push(...getChildren(v));
        });
        return widgets;
    },
    // 常用网站
    frequentBookmarks: (state) => {
        if (state.setting.dataSource == "local") {
            return state.frequentBookmark.frequentBookmarks;
        } else {
            return state.frequentBookmark.remoteFrequentBookmark;
        }
    },
    // 待办
    todo: (state) => {
        if (state.setting.dataSource == "local") {
            return state.todo.todo;
        } else {
            return state.todo.remoteTodo;
        }
    },
    bookmark: (state) => {
        if (state.setting.dataSource == "local") {
            return state.bookmark.bookmark;
        } else {
            return state.bookmark.remoteBookmark;
        }
    },
    // 本地和远程书签合并后的集合
    flatternBookmark: (state) => {
        let treeBookmark = [];
        if (Array.isArray(state.bookmark.bookmark)) {
            treeBookmark.push(..._.cloneDeep(state.bookmark.bookmark));
        }
        if (Array.isArray(state.bookmark.remoteBookmark)) {
            treeBookmark.push(..._.cloneDeep(state.bookmark.remoteBookmark));
        }
        function getChildren(bookmark) {
            if (!bookmark) return [];
            let arr = [];
            for (let book of bookmark) {
                if (book.children) {
                    arr.push(...getChildren(book.children));
                    delete book.children;
                    arr.push(book);
                } else {
                    arr.push(book);
                }
            }
            return arr;
        }
        let flatternBookmark = [];
        flatternBookmark.push(...getChildren(treeBookmark));
        return flatternBookmark;
    },
    background: (state) => {
        if (state.setting.background.belong == "system") {
            return `/background/${state.setting.background.systemBg}`;
        }
        return state.setting.background.customBg;
    },
    dynamicBackground: (state) => {
        return state.setting.dynamicBackground + "-background";
    },
    // 是否指引过
    isGuide: (state) => state.setting.isGuide,
};
export default getters;
