export default {
    namespaced: true,
    state: {
        dark: {},
        bright: {},
        common: {},
        currentTheme: ""
    },
    mutations: {
        // 先从sessionStorage读theme
        updateTheme(state) {
            const theme = sessionStorage.getItem("theme");
            if (theme != null && theme != "") {
                const obj = JSON.parse(theme);
                state.currentTheme = obj.currentTheme;
                state.dark = obj.dark;
                state.bright = obj.bright;
                state.common = obj.common;
            }
        },
        // 从js获取主题相关配置
        setTheme(state, obj) {
            state.currentTheme = obj.currentTheme;
            state.dark = obj.dark;
            state.bright = obj.bright;
            state.common = obj.common;
            sessionStorage.setItem("theme", JSON.stringify(obj));
        },
        // 切换主题
        switchTheme(state, theme) {
            state.currentTheme = theme;
        },
        // 字体大小
        changeFontSize(state, val) {
            const fontSize = {
                fontSize: val
            };
            state.common.pfont = fontSize;
        }
    },
    actions: {}
};
