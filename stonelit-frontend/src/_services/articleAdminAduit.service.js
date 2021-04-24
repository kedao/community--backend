import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/smart/api/pc/articleAdminAduit`;

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

function approve(ids) {
    return fetchWrapper.postJson(`${baseUrl}/approve`, {
        idList: ids,
    });
}

function reject(ids, rejectReason) {
    return fetchWrapper.postJson(`${baseUrl}/reject`, {
        idList: ids,
        rejectReason,
    });
}

const name = 'articleAdminAduit';
const title = '投稿审核';

export const articleAdminAduit = {
    name,
    title,
    selectByPage,
    selectById,
    approve,
    reject,
};
