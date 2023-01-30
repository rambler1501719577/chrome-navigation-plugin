/**
 * 切换标签状态
 * @param {Object} tagList 标签列表
 * @param {Object} tag 目标标签
 * @param {Object} status 切换的状态 see #constant/viewState
 */
const switchTagStatus = (tagList, tag, status) => {
    if (!tag) return;
    // 针对三种情况进行分别处理
    switch (status) {
        case viewState.ACTIVE: {
            // 取消其他tag的Active状态
            tagList.forEach((item) => {
                if (item.status == viewState.ACTIVE) {
                    item.status = viewState.INACTIVE;
                }
            });
            // 切换到ACTIVE状态
            tag.status = viewState.ACTIVE;
            break;
        }
        case viewState.INACTIVE: {
            tag.status = viewState.INACTIVE;
            break;
        }
        case viewState.CLOSE: {
            tag.status = viewState.CLOSE;
            break;
        }
    }
};

// 获取标签数组和弹窗数组中index的最大值, +1 后可以让窗口前置
const getMaxIndex = (tagList, dialogList) => {
    // 不可能单独打开二级弹窗, 所以一级为空, 就返回 0 即可
    if (!tagList || tagList.length == 0) {
        return 0;
    }
    let sortFunc = (item1, item2) => item2.index - item1.index;
    // 深拷贝一下, 防止在sort时页面重新渲染
    let cloneTagArr = JSON.parse(JSON.stringify(tagList));
    let maxTagViewIndex = cloneTagArr.sort(sortFunc)[0].index;
    // 有弹窗, 计算弹窗和标签页index最大值
    if (dialogList && dialogList.length !== 0) {
        let cloneDialogArr = JSON.parse(JSON.stringify(dialogList));
        let maxDialogViewsIndex = cloneDialogArr.sort(sortFunc)[0].index;
        return Math.max(maxDialogViewsIndex, maxTagViewIndex);
    } else {
        // 否则只需要考虑标签页index最大值
        return maxTagViewIndex;
    }
};

export default {
    namespaced: true,
    state: {
        visitedViews: [], // 标签页, name作为唯一标识符
        dialogViews: [], // 不作为标签显示, 只是普通的弹窗
        frontViews: {}, // 当前最顶层的dialog, 用于防止重复点击顶层, 重新计算zIndex问题
    },
    mutations: {
        // 保持只有一个路由属于active状态
        ADD_VISITED_VIEW: (state, view) => {
            // 先判断有没有, 没有就push, 并更新当前前置菜单
            let aim = state.visitedViews.find((item) => item.name == view.name);
            if (!aim) {
                switchTagStatus(state.visitedViews, view, viewState.ACTIVE);
                view.index =
                    getMaxIndex(state.visitedViews, state.dialogViews) + 1;
                state.visitedViews.push(view);
                // 更新缓存的当前激活标签
                state.frontViews = view;
            } else {
                // 已经打开了,需要激活
                switchTagStatus(state.visitedViews, aim, viewState.ACTIVE);
                aim.index =
                    getMaxIndex(state.visitedViews, state.dialogViews) + 1;
                state.frontViews = aim;
            }
        },
        DEL_VISITED_VIEW: (state, view) => {
            // 删除不访问的路由
            for (const [i, v] of state.visitedViews.entries()) {
                if (v.name === view.name) {
                    state.visitedViews.splice(i, 1);
                    break;
                }
            }
            // 找到当前INACTIVE状态下Index最大的菜单并激活
            let sortArr = state.visitedViews
                .filter((item) => item.status == viewState.INACTIVE)
                .sort((item1, item2) => item2.index - item1.index);
            if (sortArr.length > 0) {
                switchTagStatus(
                    state.visitedViews,
                    state.visitedViews.find(
                        (item) => item.name == sortArr[0].name
                    ),
                    viewState.ACTIVE
                );
            }
        },
        // 激活Tag
        ACTIVE_VIEW: (state, view) => {
            let aim = state.visitedViews.find((item) => item.name == view.name);
            if (aim) {
                switchTagStatus(state.visitedViews, aim, viewState.ACTIVE);
                aim.index =
                    getMaxIndex(state.visitedViews, state.dialogViews) + 1;
                state.frontViews = aim;
            }
        },
        // 取消激活的tag
        DEACTIVE_VIEW: (state, view) => {
            let aim = state.visitedViews.find((item) => item.name == view.name);
            if (aim) {
                switchTagStatus(state.visitedViews, aim, viewState.CLOSE);
            }
        },
        DELETE_ALL: (state) => {
            state.visitedViews = [];
        },
    },
    actions: {
        addView({ commit }, view) {
            commit("ADD_VISITED_VIEW", view);
        },
        delView({ commit }, view) {
            commit("DEL_VISITED_VIEW", view);
        },
        activeView({ commit }, view) {
            commit("ACTIVE_VIEW", view);
        },
        deactiveView({ commit }, view) {
            commit("DEACTIVE_VIEW", view);
        },
        closeAll({ commit }) {
            commit("DELETE_ALL");
        },
    },
    getters: {
        // 层级最高的标签index
        maxIndex: (state) => getMaxIndex(state.visitedViews, state.dialogViews),
        // 置顶的标签
        currentView: (state) => state.frontViews,
    },
};
