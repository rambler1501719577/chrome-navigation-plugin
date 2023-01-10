import { get } from "../http";
import { article } from "../urls";

export function getArticleByCategory(param) {
    return get({
        url: article.categoryArticle,
        params: param
    });
}

export function getIndexArticleList(params) {
    return get({
        url: article.indexArticleList,
        params
    });
}

export function getArticleDetail(params) {
    return get({
        url: article.detail,
        params
    });
}

export function getArticleList() {
    return get({
        url: article.articles
    });
}

export function selectArticleByTag(param) {
    return get({
        url: article.tagArticle,
        params: param
    });
}
