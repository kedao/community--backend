import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/smart/api/pc/dashboard`;

function countTodayArticle() {
    return fetchWrapper.get(`${baseUrl}/countTodayArticle`);
}

function countTodayArticleComment() {
    return fetchWrapper.get(`${baseUrl}/countTodayArticleComment`);
}

function countTodayPost() {
    return fetchWrapper.get(`${baseUrl}/countTodayPost`);
}

function countTodayPostReply() {
    return fetchWrapper.get(`${baseUrl}/countTodayPostReply`);
}

function countTodayProductComment() {
    return fetchWrapper.get(`${baseUrl}/countTodayProductComment`);
}

function countTodayProductCommentReply() {
    return fetchWrapper.get(`${baseUrl}/countTodayProductCommentReply`);
}

function countTodayVideo() {
    return fetchWrapper.get(`${baseUrl}/countTodayVideo`);
}

function countTodayVideoComment() {
    return fetchWrapper.get(`${baseUrl}/countTodayVideoComment`);
}

function currentOnlineCount() {
    return fetchWrapper.get(`${baseUrl}/currentOnlineCount`);
}

function todayOnlineCount() {
    return fetchWrapper.get(`${baseUrl}/currentOnlineCount`);
}

function onlineUserPerHour() {
    return fetchWrapper.get(`${baseUrl}/onlineUserPerHour`);
}

function selectHistoryDataByPage() {
    return fetchWrapper.get(`${baseUrl}/selectHistoryDataByPage`);
}

const name = 'dashboard';
const title = '报表';

export const dashboardService = {
    name,
    title,
    countTodayArticle,
    countTodayArticleComment,
    countTodayPost,
    countTodayPostReply,
    countTodayProductComment,
    countTodayProductCommentReply,
    countTodayVideo,
    countTodayVideoComment,
    currentOnlineCount,
    todayOnlineCount,
    onlineUserPerHour,
    selectHistoryDataByPage,
};
