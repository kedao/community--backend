import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/smart/api/pc/articleAdminRecommend`;

function selectByPage(currentPage, perPage = 30, title = '') {
    return fetchWrapper.postJson(`${baseUrl}/selectByPage`, {
        pageNum: currentPage,
        pageSize: perPage,
        title,
    });
}

function selectAllTopRecommend() {
    return fetchWrapper.post(`${baseUrl}/selectAllTopRecommend`);
}

function selectById(articleId) {
    return fetchWrapper.get(`${baseUrl}/selectById`, {
        articleId,
    });
}

function cancelRecommend(articleId) {
    return fetchWrapper.post(`${baseUrl}/cancelRecommend`, {
        articleId,
    });
}

function cancelSetTop(articleId) {
    return fetchWrapper.post(`${baseUrl}/cancelSetTop`, {
        articleId,
    });
}

function insertSubject(data) {
    return fetchWrapper.postJson(`${baseUrl}/insertSubject`, data);
}

function setAsArticle(articleId) {
    return fetchWrapper.post(`${baseUrl}/setAsArticle`, {
        articleId,
    });
}

function setBigImage(articleId) {
    return fetchWrapper.post(`${baseUrl}/setBigImage`, {
        articleId,
    });
}

function setTop(articleId) {
    return fetchWrapper.post(`${baseUrl}/setTop`, {
        articleId,
    });
}

const name = 'articleAdminRecommend';
const title = '推荐列表';

export const articleAdminRecommend = {
    name,
    title,
    selectByPage,
    selectAllTopRecommend,
    selectById,
    cancelRecommend,
    cancelSetTop,
    insertSubject,
    setAsArticle,
    setBigImage,
    setTop,
};
