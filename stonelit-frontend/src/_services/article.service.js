import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/smart/api/common/article`;

function queryDetailById(articleId) {
    return fetchWrapper.get(`${baseUrl}/queryDetailById`, {
        articleId
    });
}

function addComment(data) {
    return fetchWrapper.post(`${baseUrl}/addComment`, data);
}

function addCommentReply(data) {
    return fetchWrapper.post(`${baseUrl}/addCommentReply`, data);
}

function queryCommentByPage(data) {
    return fetchWrapper.get(`${baseUrl}/queryCommentByPage`, data);
}

/**
 * 点赞/取消赞一级评论
 *
 * @param data
 * @returns {Promise<*>}
 */
function likeOrCancelLikeComment(data) {
    return fetchWrapper.post(`${baseUrl}/likeOrCancelLikeComment`, data);
}

/**
 * 点踩/取消踩一级评论
 *
 * @param data
 * @returns {Promise<*>}
 */
function stampOrCancelStampComment(data) {
    return fetchWrapper.post(`${baseUrl}/stampOrCancelStampComment`, data);
}

const name = 'article';
const title = '文章';

export const article = {
    name,
    title,
    queryDetailById,
    addComment,
    addCommentReply,
    queryCommentByPage,
    likeOrCancelLikeComment,
    stampOrCancelStampComment,
};
