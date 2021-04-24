import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/smart/api/pc/communityAuth`;

function assign(idList) {
    return fetchWrapper.postJson(`${baseUrl}/assign`, {
        idList
    });
}


function queryAllAdminUser(userId,nickName) {
    return fetchWrapper.get(`${baseUrl}/queryAllAdminUser`, {
        userId,
        nickName,
    });
}

function remove(idList) {
    return fetchWrapper.postJson(`${baseUrl}/remove`, {
        idList
    });
}

const name = 'communityAuth';
const title = '社区管理';

export const communityAuth = {
    name,
    title,
    assign,
    queryAllAdminUser,
    remove,
};
