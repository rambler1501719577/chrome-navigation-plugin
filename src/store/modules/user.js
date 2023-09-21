/**
 * 用户相关数据
 * @author rambler
 */
import settings from "@/settings";
import { setToken, clearToken } from "@/utils/token";
export default {
    namespaced: true,
    state: {
        // 用户信息
        userInfo: {
            nicnname: "",
            avatar: "",
            username: "",
        },
    },
    mutations: {
        SET_USER_INFO(state, data) {
            const { avatar, nickname, username } = data;
            state.userInfo.avatar = avatar;
            state.userInfo.nickname = nickname;
            state.userInfo.username = username;
        },
        CLEAR_USER_INFO(state) {
            state.userInfo = null;
        },
    },
    actions: {
        /**
         * 保存用户信息，考虑安全问题，将token抹除，通过cookie保存token
         * @param {Object} context
         * @param {Object} payload
         */
        setUserInfo(context, payload) {
            if (payload && payload.token) {
                setToken(payload.token, settings.defaultTokenExpires);
                delete payload.token;
            }
            context.commit("SET_USER_INFO", payload);
        },
        /**
         * 清空用户登录状态，删除保存的权限
         * @param {Object} context
         * @param {Object} payload
         */
        async clearUserInfo(context) {
            // 清空token
            await clearToken();
            // 清空用户信息
            context.commit("CLEAR_USER_INFO");
        },
    },
};
