import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/smart/api/pc/contentAdmin`;

function approveAuditContent(data) {
    return fetchWrapper.postJson(`${baseUrl}/approveAuditContent`, data);
}

function queryArticleCommentHeadInfo(id) {
    return fetchWrapper.get(`${baseUrl}/queryArticleCommentHeadInfo`, {
        id
    });
}

function queryPostHeadInfo() {
    return fetchWrapper.get(`${baseUrl}/queryPostHeadInfo`);
}

function queryPostReplyHeadInfo() {
    return fetchWrapper.get(`${baseUrl}/queryPostReplyHeadInfo`);
}

function queryProductCommentHeadInfo() {
    return fetchWrapper.get(`${baseUrl}/queryPostReplyHeadInfo`);
}

function rejectAuditContent(data) {
    return fetchWrapper.postJson(`${baseUrl}/rejectAuditContent`, data);
}

function selectNeedAuditContent(data, currentPage, perPage = 30) {
    return fetchWrapper.postJson(`${baseUrl}/selectNeedAuditContent`, {
        pageNum: currentPage,
        pageSize: perPage,
        ...data,
    });
}

const name = 'contentAdmin';
const title = '内容审核';

export const contentAdmin = {
    name,
    title,
    approveAuditContent,
    queryArticleCommentHeadInfo,
    queryPostHeadInfo,
    queryPostReplyHeadInfo,
    queryProductCommentHeadInfo,
    rejectAuditContent,
    selectNeedAuditContent,
};

