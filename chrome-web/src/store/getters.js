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
    },
    // 待办
    todo: state => {
        if (state.setting.dataSource == "local") {
            return state.todo.todo;
        } else {
            return state.todo.remoteTodo;
        }
    },
    bookmark: state => {
        if (state.setting.dataSource == "local") {
            return state.bookmark.bookmark;
        } else {
            return state.bookmark.remoteBookmark;
        }
    },
    flatternBookmark: state => {
        let treeBookmark;
        if (state.setting.dataSource == "local") {
            treeBookmark = state.bookmark.bookmark;
        } else {
            treeBookmark = state.bookmark.remoteBookmark;
        }
        function getChildren(bookmark) {
            let arr = [];
            for (let book of bookmark) {
                if (book.children) {
                    arr.push(...getChildren(book.children));
                    delete book.children;
                    arr.push(book);
                }
            }
            return arr;
        }
        let flatternBookmark = [];
        flatternBookmark.push(...getChildren(treeBookmark));
        return flatternBookmark;
    }
};
export default getters;
