import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/smart/api/pc/articleAdminReview`;

function selectByPage(currentPage, perPage = 30, title = '') {
    return fetchWrapper.postJson(`${baseUrl}/selectByPage`, {
        pageNum: currentPage,
        pageSize: perPage,
        title,
    });
}

function selectById(articleId) {
    return fetchWrapper.get(`${baseUrl}/selectById`, {
        articleId
    });
}

function cancelRecommend(ids) {
    return fetchWrapper.postJson(`${baseUrl}/cancelRecommend`, {
        idList: ids,
    });
}

function cancelOffLine(ids) {
    return fetchWrapper.postJson(`${baseUrl}/cancelOffLine`, {
        idList: ids,
    });
}

function offLine(ids, rejectReason) {
    return fetchWrapper.postJson(`${baseUrl}/offLine`, {
        idList: ids,
        rejectReason,
    });
}

function recommend(data) {
    return fetchWrapper.postJson(`${baseUrl}/recommend`, data);
}

const name = 'articleAdminReview';
const title = '过审稿件';

export const articleAdminReview = {
    name,
    title,
    selectByPage,
    selectById,
    cancelRecommend,
    cancelOffLine,
    offLine,
    recommend,
};
