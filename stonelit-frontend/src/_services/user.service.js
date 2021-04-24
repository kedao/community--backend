import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/smart/api/pc/user`;

function selectContentByType(userId, queryType, currentPage, perPage = 30) {
    return fetchWrapper.get(`${baseUrl}/selectContentByType`, {
        pageNum: currentPage,
        pageSize: perPage,
        userId,
        queryType,
    });
}

function selectByIdOrNickname(userId, nickName) {
    return fetchWrapper.get(`${baseUrl}/selectByIdOrNickname`, {
        userId,
        nickName,
    });
}

function banUser(userId, reasonList, effectiveStartDate, effectiveEndDate) {
    return fetchWrapper.postJson(`${baseUrl}/banUser`, {
        userId,
        reasonList,
        effectiveStartDate,
        effectiveEndDate,
    });
}

function releaseUser(idList) {
    return fetchWrapper.postJson(`${baseUrl}/releaseUser`, {
        idList,
    });
}

const name = 'user';
const title = '用户';

export const user = {
    name,
    title,
    selectContentByType,
    selectByIdOrNickname,
    banUser,
    releaseUser,
};
