import axios from "axios";
export default {
    saveBasicInfo({ commit }) {
        return new Promise((resolve, reject) => {
            axios
                .all([])
                .then(
                    axios.spread((tags, hotArticle, info, menu) => {
                        const param = {
                            tags: tags.data,
                            hotArticle: hotArticle.data,
                            info: info.data,
                            menu: menu.data
                        };
                        commit("SAVE_INFO", param);
                        resolve(true);
                    })
                )
                .catch(() => {
                    reject();
                });
        });
    }
};
